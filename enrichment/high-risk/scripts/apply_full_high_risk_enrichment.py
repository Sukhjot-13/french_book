"""Transactionally apply approved complete-queue high-risk candidates."""

import argparse
import copy
import json
import os
import shutil
import sys
import tempfile
from datetime import datetime, timezone
from pathlib import Path
from typing import Any, Dict, List, Optional

REPO_ROOT = Path(__file__).resolve().parent.parent.parent.parent
HIGH_RISK_DIR = Path(__file__).resolve().parent.parent
for path in (str(REPO_ROOT), str(HIGH_RISK_DIR)):
    if path not in sys.path:
        sys.path.insert(0, path)

from config.high_risk_config import (
    APPROVED_DIR,
    AUDITS_DIR,
    BACKUPS_DIR,
    BATCH_MANIFEST_PATH,
    FULL_QUEUE_APPLICATOR_VERSION,
    FULL_QUEUE_FILL_MODE,
    FULL_QUEUE_REPAIR_MODE,
    FULL_QUEUE_VALIDATOR_VERSION,
    FULL_QUEUE_VERSION,
    HIGH_RISK_DATA_PATH,
    MASTER_DATA_PATH,
    NATURAL_KEYS,
    NORMAL_ENRICHED_DATA_PATH,
    REPORTS_DIR,
    RESPONSES_DIR,
    VALIDATED_DIR,
)
from scripts.high_risk_helpers import (
    compute_file_sha256,
    load_baseline_dataset,
    validate_master_dataset_schema,
)
from scripts.validate_full_high_risk_response import validate_full_queue_response


def state_path_for(output_path: Path) -> Path:
    """Returns the adjacent provenance-state path for a derived output."""
    return output_path.with_name(f"{output_path.stem}_STATE.json")


def _key_token(key: Any) -> str:
    """Returns a stable token for scalar or composite natural keys."""
    return json.dumps(key, ensure_ascii=False, sort_keys=True, separators=(",", ":"))


def _entity_key(collection: str, entity: Dict[str, Any]) -> Any:
    """Extracts a collection-specific natural key."""
    fields = NATURAL_KEYS[collection]
    if isinstance(fields, list):
        return {field: entity.get(field) for field in fields}
    return entity.get(fields)


def _find_entity(data: Dict[str, Any], collection: str, key: Any) -> Optional[Dict[str, Any]]:
    """Resolves an entity in a staged dataset."""
    target = _key_token(key)
    return next(
        (entity for entity in data.get(collection, []) if _key_token(_entity_key(collection, entity)) == target),
        None,
    )


def _is_empty(value: Any) -> bool:
    """Returns whether a field satisfies the fill-only precondition."""
    return value is None or value == "" or value == [] or value == {}


def _atomic_write_json(path: Path, payload: Dict[str, Any]) -> None:
    """Atomically writes one JSON object beside its final destination."""
    path.parent.mkdir(parents=True, exist_ok=True)
    fd, temp_name = tempfile.mkstemp(dir=str(path.parent), prefix=f".{path.name}.tmp_")
    try:
        with os.fdopen(fd, "w", encoding="utf-8") as handle:
            json.dump(payload, handle, ensure_ascii=False, indent=2)
        os.replace(temp_name, path)
    except Exception:
        Path(temp_name).unlink(missing_ok=True)
        raise


def apply_full_approved_batch(
    approved_file: Path,
    output_path: Optional[Path] = None,
    baseline_path: Optional[Path] = None,
    *,
    rebuild_from_baseline: bool = False,
    responses_dir: Path = RESPONSES_DIR,
    validated_dir: Path = VALIDATED_DIR,
    reports_dir: Path = REPORTS_DIR,
    audits_dir: Path = AUDITS_DIR,
    backups_dir: Path = BACKUPS_DIR,
) -> Dict[str, Any]:
    """Applies one integrity-bound approval to an isolated derived dataset."""
    target_output = Path(output_path) if output_path else HIGH_RISK_DATA_PATH
    if target_output.resolve() in {MASTER_DATA_PATH.resolve(), NORMAL_ENRICHED_DATA_PATH.resolve()}:
        raise PermissionError("Complete high-risk application cannot overwrite a source/baseline dataset.")
    approved = json.loads(approved_file.read_text(encoding="utf-8"))
    batch_id = approved.get("batch_id")
    if approved.get("queue_version") != FULL_QUEUE_VERSION:
        raise ValueError("Approved payload belongs to a stale or legacy queue.")
    if approved.get("validator_version") != FULL_QUEUE_VALIDATOR_VERSION:
        raise ValueError("Approved payload was not produced by the active full-queue validator.")
    decision = approved.get("review_decision", {})
    if decision.get("status") != "APPROVED":
        raise ValueError("Batch does not have APPROVED review status.")
    if not decision.get("linguistic_reviewer") or not decision.get("compliance_reviewer"):
        raise ValueError("Batch lacks required linguistic and compliance reviewers.")
    if decision["linguistic_reviewer"] == decision["compliance_reviewer"]:
        raise ValueError("Linguistic and compliance reviewers must be distinct.")

    validated_path = validated_dir / f"{batch_id}_VALIDATED.json"
    report_path = reports_dir / f"{batch_id}_VALIDATION_REPORT.json"
    raw_response_path = responses_dir / f"{batch_id}_RESPONSE.json"
    integrity = approved.get("approval_integrity", {})
    if not validated_path.is_file() or not report_path.is_file() or not raw_response_path.is_file():
        raise ValueError("Approval is missing its validated payload, report, or raw response chain.")
    if integrity.get("validated_payload_hash") != compute_file_sha256(validated_path):
        raise ValueError("Validated payload changed after approval.")
    if integrity.get("validation_report_hash") != compute_file_sha256(report_path):
        raise ValueError("Validation report changed after approval.")
    validated = json.loads(validated_path.read_text(encoding="utf-8"))
    approved_core = {
        key: value for key, value in approved.items()
        if key not in {"review_decision", "approval_integrity"}
    }
    if approved_core != validated:
        raise ValueError("Approved payload content does not exactly match its validated payload.")
    if approved.get("raw_response_hash") != compute_file_sha256(raw_response_path):
        raise ValueError("Raw response changed after validation.")
    status, fresh_report = validate_full_queue_response(raw_response_path, baseline_path)
    if status != "PASS":
        raise ValueError(f"Raw response failed fresh validation: {fresh_report.get('errors', [])[:3]}")

    baseline, baseline_hash = load_baseline_dataset(baseline_path)
    if approved.get("baseline_hash") != baseline_hash:
        raise ValueError("Approved batch baseline is stale.")

    state_path = state_path_for(target_output)
    if rebuild_from_baseline:
        staged = copy.deepcopy(baseline)
        state = {
            "root_baseline_hash": baseline_hash,
            "queue_version": FULL_QUEUE_VERSION,
            "applied_batches": [],
        }
        input_hash = baseline_hash
    elif target_output.exists():
        if not state_path.is_file():
            raise ValueError(
                "Existing high-risk output has no compatible provenance state. "
                "Use --rebuild once to start the v2.1 output from the frozen baseline."
            )
        state = json.loads(state_path.read_text(encoding="utf-8"))
        if state.get("root_baseline_hash") != baseline_hash or state.get("queue_version") != FULL_QUEUE_VERSION:
            raise ValueError("Existing high-risk output uses a different baseline or queue version.")
        staged = json.loads(target_output.read_text(encoding="utf-8"))
        input_hash = compute_file_sha256(target_output)
    else:
        staged = copy.deepcopy(baseline)
        state = {
            "root_baseline_hash": baseline_hash,
            "queue_version": FULL_QUEUE_VERSION,
            "applied_batches": [],
        }
        input_hash = baseline_hash

    audit_path = audits_dir / f"{batch_id}_AUDIT.json"
    if audit_path.exists():
        prior = json.loads(audit_path.read_text(encoding="utf-8"))
        already_applied = batch_id in state.get("applied_batches", [])
        values_match = all(
            (
                (entity := _find_entity(staged, approved["collection"], patch["entity_key"]))
                is not None
                and entity.get(approved["field"]) == patch["value"]
            )
            for patch in approved.get("patches", [])
        )
        if already_applied and values_match:
            return {**prior, "idempotent_replay": True}
        raise ValueError("An immutable audit already exists but the staged output does not match it.")

    collection = approved["collection"]
    field = approved["field"]
    mode = approved["mode"]
    applied_keys: List[Any] = []
    skipped_keys: List[Any] = []
    for patch in approved.get("patches", []):
        entity = _find_entity(staged, collection, patch["entity_key"])
        baseline_entity = _find_entity(baseline, collection, patch["entity_key"])
        if entity is None or baseline_entity is None:
            raise ValueError(f"Cannot resolve approved target {patch['entity_key']!r}.")
        current_value = entity.get(field)
        proposed_value = patch["value"]
        if current_value == proposed_value:
            skipped_keys.append(patch["entity_key"])
            continue
        if mode == FULL_QUEUE_FILL_MODE:
            if not _is_empty(current_value):
                raise ValueError(f"Fill-only target {patch['entity_key']!r} is no longer empty.")
        elif mode == FULL_QUEUE_REPAIR_MODE:
            if current_value != baseline_entity.get(field):
                raise ValueError(f"Repair target {patch['entity_key']!r} changed after the frozen baseline.")
        else:
            raise ValueError(f"Unsupported approved mode '{mode}'.")
        entity[field] = copy.deepcopy(proposed_value)
        applied_keys.append(patch["entity_key"])

    schema_errors = validate_master_dataset_schema(staged)
    if schema_errors:
        raise ValueError(f"Staged dataset failed MASTER_SCHEMA validation: {schema_errors[:5]}")

    backup_path = None
    if target_output.exists():
        backups_dir.mkdir(parents=True, exist_ok=True)
        timestamp = datetime.now(timezone.utc).strftime("%Y%m%d_%H%M%S_%f")
        backup_path = backups_dir / f"{target_output.stem}_{timestamp}.json"
        shutil.copy2(target_output, backup_path)

    _atomic_write_json(target_output, staged)
    output_hash = compute_file_sha256(target_output)
    applied_batches = list(state.get("applied_batches", []))
    if batch_id not in applied_batches:
        applied_batches.append(batch_id)
    state.update({
        "applied_batches": applied_batches,
        "last_output_hash": output_hash,
        "applicator_version": FULL_QUEUE_APPLICATOR_VERSION,
    })
    _atomic_write_json(state_path, state)

    audit = {
        "batch_id": batch_id,
        "queue_version": FULL_QUEUE_VERSION,
        "applied_at": datetime.now(timezone.utc).isoformat(),
        "applicator_version": FULL_QUEUE_APPLICATOR_VERSION,
        "collection": collection,
        "field": field,
        "mode": mode,
        "input_hash": input_hash,
        "output_hash": output_hash,
        "backup_file": str(backup_path) if backup_path else None,
        "applied_count": len(applied_keys),
        "applied_keys": applied_keys,
        "skipped_existing_count": len(skipped_keys),
        "skipped_existing_keys": skipped_keys,
        "no_proposal_count": len(approved.get("no_proposals", [])),
        "review_decision": decision,
    }
    audits_dir.mkdir(parents=True, exist_ok=True)
    audit_path.write_text(json.dumps(audit, ensure_ascii=False, indent=2), encoding="utf-8")
    reports_dir.mkdir(parents=True, exist_ok=True)
    (reports_dir / f"{batch_id}_APPLIED_REPORT.txt").write_text(
        "\n".join([
            "=" * 78,
            f"L'ÉTUDE COMPLETE HIGH-RISK APPLICATION REPORT: {batch_id}",
            f"Collection/field: {collection}.{field}",
            f"Applied: {len(applied_keys)} | Already present: {len(skipped_keys)}",
            f"No proposals (remaining gaps): {len(approved.get('no_proposals', []))}",
            f"Output SHA-256: {output_hash}",
            "=" * 78,
        ]) + "\n",
        encoding="utf-8",
    )
    return audit


def apply_full_approved_folder(
    approved_dir: Path = APPROVED_DIR,
    output_path: Optional[Path] = None,
    baseline_path: Optional[Path] = None,
    *,
    rebuild_from_baseline: bool = False,
) -> List[Dict[str, Any]]:
    """Applies current-manifest approvals in deterministic batch order."""
    manifest = json.loads(BATCH_MANIFEST_PATH.read_text(encoding="utf-8"))
    current_ids = set(manifest.get("batches", {}))
    files = [
        path for path in approved_dir.glob("*_APPROVED.json")
        if path.name.removesuffix("_APPROVED.json") in current_ids
    ]
    if not files:
        raise ValueError("No current-queue approved files were found.")
    audits: List[Dict[str, Any]] = []
    for index, approved_file in enumerate(sorted(files)):
        audits.append(apply_full_approved_batch(
            approved_file,
            output_path,
            baseline_path,
            rebuild_from_baseline=rebuild_from_baseline and index == 0,
        ))
    return audits


def main() -> None:
    """CLI entry point for one approved file or the approved folder."""
    parser = argparse.ArgumentParser(description="Apply approved complete high-risk candidates.")
    target = parser.add_mutually_exclusive_group(required=True)
    target.add_argument("--approved", type=Path)
    target.add_argument("--folder", type=Path)
    parser.add_argument("--output", type=Path, default=None)
    parser.add_argument("--baseline", type=Path, default=None)
    parser.add_argument("--rebuild", action="store_true")
    args = parser.parse_args()
    if args.approved:
        audits = [apply_full_approved_batch(
            args.approved, args.output, args.baseline,
            rebuild_from_baseline=args.rebuild,
        )]
    else:
        audits = apply_full_approved_folder(
            args.folder, args.output, args.baseline,
            rebuild_from_baseline=args.rebuild,
        )
    print(f"Applied {len(audits)} approved batches.")
    print(f"Changed fields: {sum(audit['applied_count'] for audit in audits)}")


if __name__ == "__main__":
    main()
