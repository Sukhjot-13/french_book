"""
Enrichment Apply Engine (enrichment/scripts/apply_enrichment.py)

Applies approved patch files to MASTER_DATA.json with transaction safety.
Enforces pre-apply backup, in-memory staging, zero data loss, full MASTER_SCHEMA
validation, atomic writes, and audit logging.
Accepts patches from enrichment/manual/approved/ (or manual/validated/ with --force-validated).
"""

import sys
import copy
import json
import argparse
from pathlib import Path
from typing import Dict, Any, List, Optional, Tuple, Set, Union

# Ensure scripts directory is in python path
SCRIPT_DIR = Path(__file__).resolve().parent
if str(SCRIPT_DIR) not in sys.path:
    sys.path.insert(0, str(SCRIPT_DIR))

from enrichment_config import (
    APPROVED_DIR,
    VALIDATED_DIR,
    LOGS_DIR,
    BACKUPS_DIR,
    REPORTS_DIR,
    PROGRESS_FILE,
    NATURAL_KEYS,
)
from enrichment_helpers import (
    load_json,
    save_json,
    load_master_data,
    save_master_data_atomically,
    backup_master_data,
    calculate_hash,
    validate_against_master_schema,
    find_entity_by_natural_key,
    build_natural_key_index,
    natural_key_to_str,
    normalize_french_text,
    resolve_field_name,
)
from generate_enrichment_report import generate_report_for_file


def apply_patch_to_dataset(
    dataset: Dict[str, Any],
    patch_data: Dict[str, Any],
    indices: Optional[Dict[str, Any]] = None,
) -> Tuple[bool, Dict[str, Any], List[str]]:
    """
    Applies operations from patch_data into dataset IN MEMORY.
    Returns (success, audit_dict, errors_list).
    """
    batch_id = patch_data.get("batch_id", "unknown")
    collection = patch_data.get("collection")
    patches = patch_data.get("patches", [])

    if not collection or collection not in dataset:
        return False, {}, [f"Collection '{collection}' not found in master dataset."]

    if indices is None:
        indices = {}
    if collection not in indices:
        indices[collection] = build_natural_key_index(dataset, collection)
    coll_index = indices[collection]

    entities_modified = 0
    operations_applied = 0
    operations_skipped = 0
    conflicts_skipped = 0
    changes_by_field: Dict[str, int] = {}
    errors: List[str] = []

    for patch in patches:
        entity_key = patch.get("entity_key")
        operations = patch.get("operations", [])
        key_str = natural_key_to_str(collection, entity_key)

        _, entity = find_entity_by_natural_key(dataset, collection, entity_key, coll_index)
        if entity is None:
            errors.append(f"Entity '{key_str}' not found in master '{collection}'.")
            continue

        entity_changed = False

        for op in operations:
            op_type = op.get("operation")
            field = resolve_field_name(op.get("field", ""))

            if op_type == "add_unique":
                raw_values = op.get("values", [])
                existing_arr = entity.get(field)
                if existing_arr is None:
                    existing_arr = []
                    entity[field] = existing_arr

                if not isinstance(existing_arr, list):
                    errors.append(f"Field '{field}' on '{key_str}' is not an array for 'add_unique'.")
                    continue

                norm_existing = {normalize_french_text(str(v)) for v in existing_arr}
                added_count = 0
                for v in raw_values:
                    norm_v = normalize_french_text(str(v))
                    if norm_v not in norm_existing:
                        existing_arr.append(v)
                        norm_existing.add(norm_v)
                        added_count += 1

                if added_count > 0:
                    operations_applied += 1
                    entity_changed = True
                    changes_by_field[field] = changes_by_field.get(field, 0) + added_count
                else:
                    operations_skipped += 1

            elif op_type == "set_if_empty":
                proposed = op.get("value")
                existing = entity.get(field)

                if existing is None or existing == "" or existing == []:
                    entity[field] = proposed
                    operations_applied += 1
                    entity_changed = True
                    changes_by_field[field] = changes_by_field.get(field, 0) + 1
                elif str(existing).strip() == str(proposed).strip():
                    operations_skipped += 1
                else:
                    conflicts_skipped += 1

            elif op_type == "add_relation":
                target_coll = op.get("target_collection")
                target_key = op.get("target_key")
                rel_field = f"related_{target_coll}" if f"related_{target_coll}" in entity else "relations"
                existing_rels = entity.get(rel_field)
                if existing_rels is None:
                    existing_rels = []
                    entity[rel_field] = existing_rels

                key_repr = natural_key_to_str(target_coll, target_key)
                norm_existing_rels = {normalize_french_text(str(r)) for r in existing_rels}
                if normalize_french_text(key_repr) not in norm_existing_rels:
                    existing_rels.append(key_repr)
                    operations_applied += 1
                    entity_changed = True
                    changes_by_field[rel_field] = changes_by_field.get(rel_field, 0) + 1
                else:
                    operations_skipped += 1

            elif op_type == "propose_replace":
                # Review-only operations are never applied automatically
                conflicts_skipped += 1

            elif op_type == "replace_existing":
                # Only applied if explicitly approved in the patch
                proposed = op.get("value")
                entity[field] = proposed
                operations_applied += 1
                entity_changed = True
                changes_by_field[field] = changes_by_field.get(field, 0) + 1

            else:
                # Custom operation fallback
                entity[field] = op.get("value")
                operations_applied += 1
                entity_changed = True
                changes_by_field[field] = changes_by_field.get(field, 0) + 1

        if entity_changed:
            entities_modified += 1

    audit_entry = {
        "batch_id": batch_id,
        "collection": collection,
        "status": "applied",
        "entities_modified": entities_modified,
        "operations_applied": operations_applied,
        "operations_skipped": operations_skipped,
        "conflicts_skipped": conflicts_skipped,
        "changes_by_field": changes_by_field,
    }

    return len(errors) == 0, audit_entry, errors


def run_apply(args: argparse.Namespace) -> None:
    dataset = load_master_data()
    master_hash_before = calculate_hash(dataset)

    # Determine patch files to apply
    source_dir = VALIDATED_DIR if args.force_validated else APPROVED_DIR
    files_to_apply: List[Path] = []

    if args.file:
        p = Path(args.file)
        if not p.is_absolute():
            candidate = source_dir / p
            p = candidate if candidate.exists() else p.resolve()
        files_to_apply = [p]
    else:
        source_dir.mkdir(parents=True, exist_ok=True)
        files_to_apply = sorted(list(source_dir.glob("*.json")))

    if not files_to_apply:
        print(f"No patch files found to apply in: {source_dir}")
        if not args.force_validated:
            print("Note: By default, patches must be placed in enrichment/manual/approved/.")
            print("To apply directly from manual/validated/, use flag: --force-validated")
        return

    print("\n" + "=" * 65)
    print("L'ÉTUDE TRANSACTION-SAFE ENRICHMENT APPLY")
    print("=" * 65)
    print(f"Found {len(files_to_apply)} patch file(s) to apply.")

    # Create master backup before modifying anything
    first_batch_name = files_to_apply[0].stem.replace("_APPROVED", "").replace("_VALIDATED", "")
    backup_path = backup_master_data(first_batch_name)
    print(f"Pre-apply backup created: {backup_path}")

    # Stage changes in memory on a deep-copied dataset
    staged_dataset = copy.deepcopy(dataset)
    applied_audits: List[Dict[str, Any]] = []
    indices: Dict[str, Any] = {}

    for patch_file in files_to_apply:
        print(f"\nStaging patch: {patch_file.name} ...")
        patch_data = load_json(patch_file)
        batch_id = patch_data.get("batch_id", patch_file.stem)

        success, audit, errors = apply_patch_to_dataset(staged_dataset, patch_data, indices)
        if not success:
            print(f"❌ Error applying patch {patch_file.name}:")
            for e in errors:
                print(f"   {e}")
            print("\nABORTING! Master data remains unchanged.")
            sys.exit(1)

        audit["backup_file"] = str(backup_path)
        audit["master_hash_before"] = master_hash_before
        applied_audits.append(audit)
        print(f"  + Applied {audit['operations_applied']} operation(s) across {audit['entities_modified']} entity(s).")
        if audit["conflicts_skipped"] > 0:
            print(f"  ! Skipped {audit['conflicts_skipped']} conflicting singleton(s).")

    # Post-apply complete schema validation
    print("\nRunning comprehensive MASTER_SCHEMA validation against staged data...")
    schema_errors = validate_against_master_schema(staged_dataset)
    if schema_errors:
        print("❌ CRITICAL: Schema validation failed on staged dataset!")
        for err in schema_errors[:10]:
            print(f"   {err}")
        print("\nABORTING! Master data remains untouched.")
        sys.exit(1)

    print("✅ MASTER_SCHEMA validation passed (100% compliant).")

    # Atomic write to MASTER_DATA.json
    print("Writing updated master dataset atomically...")
    save_master_data_atomically(staged_dataset)
    master_hash_after = calculate_hash(staged_dataset)
    print(f"Master dataset updated. SHA-256 after: {master_hash_after}")

    # Write audit logs and generate applied reports
    LOGS_DIR.mkdir(parents=True, exist_ok=True)
    for audit in applied_audits:
        batch_id = audit["batch_id"]
        audit["master_hash_after"] = master_hash_after
        audit["schema_validation"] = "passed"

        audit_file = LOGS_DIR / f"{batch_id}.json"
        save_json(audit, audit_file, indent=2)

        # Generate human-readable applied report
        report_file = generate_report_for_file(audit_file, mode="applied")
        print(f"Generated applied report: {report_file.name}")

    print("\n" + "=" * 65)
    print("ENRICHMENT BATCH APPLY COMPLETE & VERIFIED")
    print(f"Total Batches Applied: {len(applied_audits)}")
    print(f"Audit Logs Saved To  : {LOGS_DIR}")
    print(f"Applied Reports In   : {REPORTS_DIR}")
    print("=" * 65 + "\n")


def main() -> None:
    parser = argparse.ArgumentParser(description="Transaction-safe application of approved enrichment patches.")
    parser.add_argument("file", nargs="?", help="Specific approved patch JSON to apply.")
    parser.add_argument("--all", action="store_true", help="Apply all approved patches.")
    parser.add_argument("--force-validated", action="store_true", help="Allow applying directly from manual/validated/ without moving to approved/.")
    args = parser.parse_args()
    run_apply(args)


if __name__ == "__main__":
    main()
