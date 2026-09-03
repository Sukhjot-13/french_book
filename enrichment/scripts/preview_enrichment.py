"""
Enrichment Preview Generator (enrichment/scripts/preview_enrichment.py)

Performs dry-run diff calculation for validated patch files against master data.
Determines exact additions, no-ops, conflicts, and reference validity without modifying master.
Outputs machine-readable preview JSON to enrichment/manual/review/.
Supports single patch or bulk preview across manual/validated/.
"""

import sys
import json
import argparse
from pathlib import Path
from typing import Dict, Any, List, Optional, Tuple, Union

# Ensure scripts directory is in python path
SCRIPT_DIR = Path(__file__).resolve().parent
if str(SCRIPT_DIR) not in sys.path:
    sys.path.insert(0, str(SCRIPT_DIR))

from enrichment_config import (
    VALIDATED_DIR,
    REVIEW_DIR,
    NATURAL_KEYS,
)
from enrichment_helpers import (
    load_json,
    save_json,
    load_master_data,
    find_entity_by_natural_key,
    build_natural_key_index,
    natural_key_to_str,
    normalize_french_text,
    resolve_field_name,
)


class DiffOperation:
    def __init__(
        self,
        op_type: str,
        field: str,
        status: str,  # "ADDITION", "NO_OP", "CONFLICT", "REJECTED"
        existing_value: Any = None,
        proposed_value: Any = None,
        applied_value: Any = None,
        reason: Optional[str] = None,
    ):
        self.op_type = op_type
        self.field = field
        self.status = status
        self.existing_value = existing_value
        self.proposed_value = proposed_value
        self.applied_value = applied_value
        self.reason = reason

    def to_dict(self) -> Dict[str, Any]:
        return {
            "operation": self.op_type,
            "field": self.field,
            "status": self.status,
            "existing": self.existing_value,
            "proposed": self.proposed_value,
            "applied": self.applied_value,
            "reason": self.reason,
        }


def preview_patch_file(
    patch_path: Path,
    dataset: Dict[str, Any],
    indices: Optional[Dict[str, Any]] = None,
) -> Dict[str, Any]:
    """Evaluates in-memory diff for one patch against dataset."""
    data = load_json(patch_path)
    batch_id = data.get("batch_id", patch_path.stem.replace("_VALIDATED", ""))
    collection = data.get("collection")
    patches = data.get("patches", [])

    if indices is None:
        indices = {}
    if collection not in indices:
        indices[collection] = build_natural_key_index(dataset, collection)
    coll_index = indices[collection]

    entity_diffs: List[Dict[str, Any]] = []
    total_additions = 0
    total_no_ops = 0
    total_conflicts = 0
    total_rejected = 0
    entities_with_additions = 0

    for patch in patches:
        entity_key = patch.get("entity_key")
        operations = patch.get("operations", [])
        key_str = natural_key_to_str(collection, entity_key)

        _, entity = find_entity_by_natural_key(dataset, collection, entity_key, coll_index)
        if entity is None:
            entity_diffs.append({
                "entity_key": entity_key,
                "key_str": key_str,
                "status": "ENTITY_NOT_FOUND",
                "diffs": [],
            })
            total_rejected += len(operations)
            continue

        item_ops: List[DiffOperation] = []
        entity_has_additions = False

        for op in operations:
            op_type = op.get("operation")
            field = resolve_field_name(op.get("field", ""))

            if op_type == "add_unique":
                raw_values = op.get("values", [])
                existing_arr = entity.get(field, [])
                if existing_arr is None:
                    existing_arr = []

                norm_existing = [normalize_french_text(str(v)) for v in existing_arr]
                to_add = []
                already_present = []

                for v in raw_values:
                    if normalize_french_text(str(v)) in norm_existing:
                        already_present.append(v)
                    else:
                        to_add.append(v)
                        norm_existing.append(normalize_french_text(str(v)))

                if to_add:
                    item_ops.append(DiffOperation(
                        op_type="add_unique",
                        field=field,
                        status="ADDITION",
                        existing_value=existing_arr,
                        proposed_value=raw_values,
                        applied_value=to_add,
                        reason=f"Adding {len(to_add)} unique value(s).",
                    ))
                    total_additions += len(to_add)
                    entity_has_additions = True

                if already_present:
                    item_ops.append(DiffOperation(
                        op_type="add_unique",
                        field=field,
                        status="NO_OP",
                        existing_value=existing_arr,
                        proposed_value=already_present,
                        applied_value=None,
                        reason="Values already present in existing array.",
                    ))
                    total_no_ops += len(already_present)

            elif op_type == "set_if_empty":
                proposed = op.get("value")
                existing = entity.get(field)

                if existing is None or existing == "" or existing == []:
                    item_ops.append(DiffOperation(
                        op_type="set_if_empty",
                        field=field,
                        status="ADDITION",
                        existing_value=existing,
                        proposed_value=proposed,
                        applied_value=proposed,
                        reason="Target field is empty; setting proposed value.",
                    ))
                    total_additions += 1
                    entity_has_additions = True
                elif str(existing).strip() == str(proposed).strip():
                    item_ops.append(DiffOperation(
                        op_type="set_if_empty",
                        field=field,
                        status="NO_OP",
                        existing_value=existing,
                        proposed_value=proposed,
                        applied_value=None,
                        reason="Field already contains identical value.",
                    ))
                    total_no_ops += 1
                else:
                    item_ops.append(DiffOperation(
                        op_type="set_if_empty",
                        field=field,
                        status="CONFLICT",
                        existing_value=existing,
                        proposed_value=proposed,
                        applied_value=None,
                        reason="Existing singleton differs from proposed value.",
                    ))
                    total_conflicts += 1

            elif op_type == "propose_replace":
                item_ops.append(DiffOperation(
                    op_type="propose_replace",
                    field=field,
                    status="CONFLICT",
                    existing_value=entity.get(field),
                    proposed_value=op.get("proposed"),
                    applied_value=None,
                    reason=f"Replacement proposal requires manual review: {op.get('reason', '')}",
                ))
                total_conflicts += 1

            elif op_type == "add_relation":
                target_coll = op.get("target_collection")
                target_key = op.get("target_key")
                rel_field = f"related_{target_coll}" if f"related_{target_coll}" in entity else "relations"
                existing_rels = entity.get(rel_field, [])
                if existing_rels is None:
                    existing_rels = []

                key_repr = natural_key_to_str(target_coll, target_key)
                if any(normalize_french_text(str(r)) == normalize_french_text(key_repr) for r in existing_rels):
                    item_ops.append(DiffOperation(
                        op_type="add_relation",
                        field=rel_field,
                        status="NO_OP",
                        existing_value=existing_rels,
                        proposed_value=key_repr,
                        applied_value=None,
                        reason="Relation already exists.",
                    ))
                    total_no_ops += 1
                else:
                    item_ops.append(DiffOperation(
                        op_type="add_relation",
                        field=rel_field,
                        status="ADDITION",
                        existing_value=existing_rels,
                        proposed_value=key_repr,
                        applied_value=key_repr,
                        reason="New cross-reference relation link.",
                    ))
                    total_additions += 1
                    entity_has_additions = True

            else:
                item_ops.append(DiffOperation(
                    op_type=op_type,
                    field=field,
                    status="ADDITION",
                    existing_value=entity.get(field),
                    proposed_value=op.get("value"),
                    applied_value=op.get("value"),
                    reason="Applied standard operation.",
                ))
                total_additions += 1
                entity_has_additions = True

        if entity_has_additions:
            entities_with_additions += 1

        entity_diffs.append({
            "entity_key": entity_key,
            "key_str": key_str,
            "status": "PROCESSED",
            "diffs": [d.to_dict() for d in item_ops],
        })

    preview_summary = {
        "batch_id": batch_id,
        "collection": collection,
        "entities_reviewed": len(patches),
        "entities_with_additions": entities_with_additions,
        "additions": total_additions,
        "no_ops": total_no_ops,
        "conflicts": total_conflicts,
        "rejected": total_rejected,
        "existing_values_removed": 0,
        "entity_diffs": entity_diffs,
        "batch_summary": data.get("batch_summary", ""),
    }

    return preview_summary


def run_preview(args: argparse.Namespace) -> None:
    dataset = load_master_data()
    indices: Dict[str, Any] = {}

    files_to_preview: List[Path] = []
    if args.file:
        p = Path(args.file)
        if not p.is_absolute():
            candidate = VALIDATED_DIR / p
            p = candidate if candidate.exists() else p.resolve()
        files_to_preview = [p]
    else:
        VALIDATED_DIR.mkdir(parents=True, exist_ok=True)
        files_to_preview = sorted(list(VALIDATED_DIR.glob("*_VALIDATED.json")))

    if not files_to_preview:
        print(f"No validated patch files found to preview in: {VALIDATED_DIR}")
        return

    REVIEW_DIR.mkdir(parents=True, exist_ok=True)

    print("\n" + "=" * 65)
    print("L'ÉTUDE ENRICHMENT DRY-RUN PREVIEW")
    print("=" * 65)

    for patch_file in files_to_preview:
        preview_data = preview_patch_file(patch_file, dataset, indices)
        batch_id = preview_data["batch_id"]

        preview_out_file = REVIEW_DIR / f"{batch_id}_PREVIEW.json"
        save_json(preview_data, preview_out_file, indent=2)

        print(f"\nBATCH: {batch_id} (Collection: {preview_data['collection']})")
        print("-" * 65)

        for ediff in preview_data["entity_diffs"]:
            additions = [d for d in ediff["diffs"] if d["status"] == "ADDITION"]
            conflicts = [d for d in ediff["diffs"] if d["status"] == "CONFLICT"]

            if additions or conflicts:
                print(f"\n▶ {ediff['key_str']}")
                for add in additions:
                    applied = add["applied"]
                    if isinstance(applied, list):
                        print(f"  + {add['field']}:")
                        for item in applied:
                            print(f"      + {item}")
                    else:
                        print(f"  + {add['field']}: {applied}")

                for conf in conflicts:
                    print(f"  ! CONFLICT in {conf['field']}:")
                    print(f"      Existing: {conf['existing']}")
                    print(f"      Proposed: {conf['proposed']}")
                    print(f"      Status  : NOT automatically applied ({conf['reason']})")

        print("\n" + "." * 65)
        print(f"Summary for {batch_id}:")
        print(f"  Entities reviewed       : {preview_data['entities_reviewed']}")
        print(f"  Entities with additions : {preview_data['entities_with_additions']}")
        print(f"  Total additions         : {preview_data['additions']}")
        print(f"  No-ops (already present): {preview_data['no_ops']}")
        print(f"  Conflicts to review     : {preview_data['conflicts']}")
        print(f"  Values removed          : {preview_data['existing_values_removed']}")
        print(f"  Saved preview to        : {preview_out_file}")

    print("\n" + "=" * 65 + "\n")


def main() -> None:
    parser = argparse.ArgumentParser(description="Preview proposed additions and conflicts without modifying master.")
    parser.add_argument("file", nargs="?", help="Specific validated patch JSON to preview.")
    parser.add_argument("--all", action="store_true", help="Preview all validated patches.")
    args = parser.parse_args()
    run_preview(args)


if __name__ == "__main__":
    main()
