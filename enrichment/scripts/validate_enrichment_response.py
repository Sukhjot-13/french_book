"""
Enrichment Response Validator (enrichment/scripts/validate_enrichment_response.py)

Validates raw GPT JSON response files against master data integrity rules,
natural key resolution, allowed operations, schema constraints, and safety invariants.
Outputs validated patches to enrichment/manual/validated/ and reports to enrichment/manual/review/.
Supports single file or bulk validation (--all or directory).
"""

import sys
import json
import argparse
from pathlib import Path
from typing import Dict, Any, List, Optional, Tuple, Union

# Ensure repo root and scripts directory are in python path
REPO_ROOT = Path(__file__).resolve().parent.parent.parent
SCRIPT_DIR = Path(__file__).resolve().parent
for p in [str(REPO_ROOT), str(SCRIPT_DIR)]:
    if p not in sys.path:
        sys.path.insert(0, p)

from enrichment.scripts.enrichment_config import (
    RESPONSES_DIR,
    VALIDATED_DIR,
    REVIEW_DIR,
    LOGS_DIR,
    BATCH_MANIFEST_FILE,
    ALLOWED_OPERATIONS,
    NATURAL_KEYS,
    SAFE_FIELDS,
)
from enrichment.scripts.enrichment_helpers import (
    load_json,
    save_json,
    load_master_data,
    load_master_schema,
    find_entity_by_natural_key,
    build_natural_key_index,
    natural_key_to_str,
    resolve_field_name,
)




class ValidationResult:
    def __init__(self, batch_id: str, collection: str):
        self.batch_id = batch_id
        self.collection = collection
        self.valid_json = True
        self.is_valid = True
        self.entity_count = 0
        self.operations_count = 0
        self.valid_operations_count = 0
        self.conflicts_count = 0
        self.invalid_references: List[str] = []
        self.forbidden_operations: List[str] = []
        self.errors: List[str] = []
        self.warnings: List[str] = []
        self.status = "PENDING"

    def to_dict(self) -> Dict[str, Any]:
        return {
            "batch_id": self.batch_id,
            "collection": self.collection,
            "valid_json": self.valid_json,
            "is_valid": self.is_valid,
            "entity_count": self.entity_count,
            "operations_count": self.operations_count,
            "valid_operations": self.valid_operations_count,
            "conflicts": self.conflicts_count,
            "invalid_references": self.invalid_references,
            "forbidden_operations": self.forbidden_operations,
            "errors": self.errors,
            "warnings": self.warnings,
            "status": self.status,
        }


def validate_response_file(
    response_path: Path,
    dataset: Dict[str, Any],
    manifest: Optional[Dict[str, Any]] = None,
    indices: Optional[Dict[str, Any]] = None,
) -> Tuple[ValidationResult, Optional[Dict[str, Any]]]:
    """Validates a single response JSON file."""
    response_path = Path(response_path)
    if not response_path.exists():
        res = ValidationResult(response_path.stem, "unknown")
        res.valid_json = False
        res.is_valid = False
        res.errors.append(f"File not found: {response_path}")
        res.status = "ERROR"
        return res, None

    try:
        data = load_json(response_path)
    except Exception as e:
        res = ValidationResult(response_path.stem, "unknown")
        res.valid_json = False
        res.is_valid = False
        res.errors.append(f"Invalid JSON syntax: {str(e)}")
        res.status = "SYNTAX_ERROR"
        return res, None

    batch_id = data.get("batch_id", response_path.stem.replace("_RESPONSE", ""))
    collection = data.get("collection")
    res = ValidationResult(batch_id, collection or "unknown")

    if not collection or collection not in dataset:
        res.is_valid = False
        res.errors.append(f"Invalid or missing collection: '{collection}'")
        res.status = "SCHEMA_ERROR"
        return res, None

    patches = data.get("patches")
    if not isinstance(patches, list):
        res.is_valid = False
        res.errors.append("Top-level 'patches' field must be an array of patch objects.")
        res.status = "SCHEMA_ERROR"
        return res, None

    # Retrieve or build collection entity index
    if indices is None:
        indices = {}
    if collection not in indices:
        indices[collection] = build_natural_key_index(dataset, collection)
    coll_index = indices[collection]

    # Validate against manifest if available
    manifest_entry = None
    if manifest:
        for b in manifest.get("batches", []):
            if b.get("batch_id") == batch_id:
                manifest_entry = b
                break
        if manifest_entry is None:
            res.errors.append(f"Batch '{batch_id}' is not present in the batch manifest.")
            res.is_valid = False
        elif manifest_entry.get("collection") != collection:
            res.errors.append("Response collection does not match its manifest entry.")
            res.is_valid = False

    validated_patches: List[Dict[str, Any]] = []
    res.entity_count = len(patches)

    for p_idx, patch in enumerate(patches):
        if not isinstance(patch, dict):
            res.errors.append(f"Patch at index {p_idx} is not an object.")
            res.is_valid = False
            continue

        entity_key = patch.get("entity_key")
        if entity_key is None:
            res.errors.append(f"Patch at index {p_idx} missing required 'entity_key'.")
            res.is_valid = False
            continue

        if manifest_entry:
            key_repr = natural_key_to_str(collection, entity_key)
            if key_repr not in set(manifest_entry.get("entity_keys", [])):
                res.errors.append(f"Entity '{key_repr}' is not part of batch '{batch_id}'.")
                res.is_valid = False
                continue

        # Verify entity exists in master collection
        match_idx, target_entity = find_entity_by_natural_key(dataset, collection, entity_key, coll_index)
        if target_entity is None:
            key_repr = natural_key_to_str(collection, entity_key)
            res.errors.append(f"Entity natural key '{key_repr}' not found in master '{collection}'.")
            res.invalid_references.append(f"{collection}::{key_repr}")
            res.is_valid = False
            continue

        operations = patch.get("operations")
        if not isinstance(operations, list):
            res.errors.append(f"Patch for '{natural_key_to_str(collection, entity_key)}' has no valid operations array.")
            res.is_valid = False
            continue

        validated_ops: List[Dict[str, Any]] = []

        for op_idx, op in enumerate(operations):
            res.operations_count += 1
            if not isinstance(op, dict):
                res.errors.append(f"Operation {op_idx} for entity is not a dictionary.")
                res.is_valid = False
                continue

            op_type = op.get("operation")
            if not op_type or op_type not in ALLOWED_OPERATIONS:
                res.errors.append(f"Disallowed or unknown operation '{op_type}'.")
                res.forbidden_operations.append(str(op_type))
                res.is_valid = False
                continue

            # Check for forbidden delete/replace operations
            if op_type in ["delete", "remove", "drop"]:
                res.errors.append("Deletion operations are forbidden.")
                res.forbidden_operations.append(op_type)
                res.is_valid = False
                continue

            field = op.get("field")
            if not isinstance(field, str) or not field.strip():
                res.errors.append(f"Operation '{op_type}' requires a non-empty field name.")
                res.is_valid = False
                continue
            norm_field = resolve_field_name(field)
            if norm_field not in SAFE_FIELDS.get(collection, []):
                res.errors.append(
                    f"Field '{norm_field}' is not approved for automatic enrichment in '{collection}'."
                )
                res.forbidden_operations.append(norm_field)
                res.is_valid = False
                continue
            if manifest_entry:
                requested_fields = {resolve_field_name(f) for f in manifest_entry.get("requested_fields", [])}
                if norm_field not in requested_fields:
                    res.errors.append(f"Field '{norm_field}' was not requested in batch '{batch_id}'.")
                    res.is_valid = False
                    continue

            # Operation-specific contract checks
            if op_type in {"add_unique", "add_object_unique"}:
                values = op.get("values")
                if op_type == "add_unique" and values is None and "value" in op:
                    values = [op["value"]]
                if not isinstance(values, list):
                    res.errors.append(f"Operation '{op_type}' on '{field}' requires an array 'values'.")
                    res.is_valid = False
                    continue

            elif op_type == "set_if_empty":
                if "value" not in op:
                    res.errors.append(f"Operation 'set_if_empty' on '{field}' requires a 'value' property.")
                    res.is_valid = False
                    continue

            clean_op = dict(op)
            clean_op["field"] = norm_field
            if op_type == "add_unique" and "values" not in clean_op and "value" in clean_op:
                clean_op["values"] = [clean_op["value"]]
            validated_ops.append(clean_op)
            res.valid_operations_count += 1

        validated_patches.append({
            "entity_key": entity_key,
            "operations": validated_ops,
        })

    clean_payload = {
        "batch_id": batch_id,
        "collection": collection,
        "patches": validated_patches,
        "uncertain_suggestions": data.get("uncertain_suggestions", []),
        "batch_summary": data.get("batch_summary", ""),
    }

    if res.errors:
        res.is_valid = False
        res.status = "FAILED"
    elif res.conflicts_count > 0 or res.warnings:
        res.status = "REVIEW_REQUIRED"
    else:
        res.status = "PASSED"

    return res, clean_payload


def run_validation(args: argparse.Namespace) -> None:
    dataset = load_master_data()
    manifest = load_json(BATCH_MANIFEST_FILE) if BATCH_MANIFEST_FILE.exists() else None
    indices: Dict[str, Any] = {}

    files_to_validate: List[Path] = []
    if args.file:
        p = Path(args.file)
        if not p.is_absolute():
            # Check RESPONSES_DIR first
            candidate = RESPONSES_DIR / p
            p = candidate if candidate.exists() else p.resolve()
        files_to_validate = [p]
    else:
        RESPONSES_DIR.mkdir(parents=True, exist_ok=True)
        files_to_validate = sorted(list(RESPONSES_DIR.glob("*.json")))

    if not files_to_validate:
        print(f"No response files found to validate in: {RESPONSES_DIR}")
        return

    VALIDATED_DIR.mkdir(parents=True, exist_ok=True)
    REVIEW_DIR.mkdir(parents=True, exist_ok=True)

    results: List[ValidationResult] = []

    print("\n" + "=" * 65)
    print("L'ÉTUDE ENRICHMENT RESPONSE VALIDATION")
    print("=" * 65)

    for file_path in files_to_validate:
        res, clean_payload = validate_response_file(file_path, dataset, manifest, indices)
        results.append(res)

        # Write validation report
        report_file = REVIEW_DIR / f"{res.batch_id}_VALIDATION_REPORT.json"
        save_json(res.to_dict(), report_file, indent=2)

        # If valid, write validated patch file
        if res.is_valid and clean_payload is not None:
            validated_file = VALIDATED_DIR / f"{res.batch_id}_VALIDATED.json"
            save_json(clean_payload, validated_file, indent=2)

        status_icon = "✅ PASS" if res.status == "PASSED" else ("⚠️ REVIEW" if res.status == "REVIEW_REQUIRED" else "❌ FAIL")
        print(f"[{status_icon}] {res.batch_id.ljust(35)} ({res.valid_operations_count}/{res.operations_count} ops valid)")
        if res.errors:
            for err in res.errors[:3]:
                print(f"       Error: {err}")
        if res.warnings:
            for warn in res.warnings[:2]:
                print(f"       Warning: {warn}")

    print("-" * 65)
    passed_count = sum(1 for r in results if r.status == "PASSED")
    review_count = sum(1 for r in results if r.status == "REVIEW_REQUIRED")
    failed_count = sum(1 for r in results if r.status not in ["PASSED", "REVIEW_REQUIRED"])

    print(f"Total responses validated : {len(results)}")
    print(f"Passed                    : {passed_count}")
    print(f"Review Required           : {review_count}")
    print(f"Failed                    : {failed_count}")
    print(f"Validated patches saved to: {VALIDATED_DIR}")
    print(f"Validation reports saved  : {REVIEW_DIR}")
    print("=" * 65 + "\n")


def main() -> None:
    parser = argparse.ArgumentParser(description="Validate GPT enrichment response JSON files.")
    parser.add_argument("file", nargs="?", help="Specific response JSON file to validate.")
    parser.add_argument("--all", action="store_true", help="Validate all response JSON files in manual/responses/")
    args = parser.parse_args()
    run_validation(args)


if __name__ == "__main__":
    main()
