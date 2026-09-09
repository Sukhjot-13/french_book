"""Validate complete-queue high-risk responses without authorizing a merge.

This validator checks the frozen queue envelope, each proposed field value,
fill/repair preconditions, partial-conjugation preservation, and a full-dataset
schema dry run. Passing output still requires independent review and dual human
approval before application.
"""

import argparse
import copy
import json
import re
import sys
from datetime import datetime, timezone
from pathlib import Path
from typing import Any, Dict, List, Optional, Tuple

import jsonschema

REPO_ROOT = Path(__file__).resolve().parent.parent.parent.parent
HIGH_RISK_DIR = Path(__file__).resolve().parent.parent
for path in (str(REPO_ROOT), str(HIGH_RISK_DIR)):
    if path not in sys.path:
        sys.path.insert(0, path)

from config.high_risk_config import (
    BATCH_MANIFEST_PATH,
    FULL_QUEUE_FILL_MODE,
    FULL_QUEUE_REPAIR_MODE,
    FULL_QUEUE_VALIDATOR_VERSION,
    FULL_QUEUE_VERSION,
    HIGH_RISK_FIELDS,
    MASTER_SCHEMA_PATH,
    NATURAL_KEYS,
    REPORTS_DIR,
    VALIDATED_DIR,
)
from scripts.high_risk_helpers import (
    compute_file_sha256,
    evaluate_verb_conjugation_status,
    is_defective,
    is_impersonal,
    load_baseline_dataset,
    load_conjugation_contract,
    load_trusted_sources,
    validate_master_dataset_schema,
)
from scripts.make_full_high_risk_queue import field_value_schema


REQUIRED_TOP_LEVEL = {
    "batch_id", "queue_version", "collection", "field", "mode",
    "baseline_hash", "candidate_provenance", "proposals", "no_proposals",
}
CONTROLLED_NO_PROPOSAL_REASONS = {
    "SOURCE_NOT_FOUND", "CONFLICTING_SOURCES", "INSUFFICIENT_EVIDENCE",
    "PARTIAL_EXISTING_DATA",
}
PLACEHOLDER_REGEX = re.compile(
    r"(?:\bTODO\b|\bTBD\b|\bFIXME\b|\bplaceholder\b|\?{2,})",
    re.IGNORECASE,
)


def _key_token(key: Any) -> str:
    """Returns a stable comparable representation for scalar or composite keys."""
    return json.dumps(key, ensure_ascii=False, sort_keys=True, separators=(",", ":"))


def _entity_key(collection: str, entity: Dict[str, Any]) -> Any:
    """Extracts the configured natural key from a baseline entity."""
    fields = NATURAL_KEYS[collection]
    if isinstance(fields, list):
        return {field: entity.get(field) for field in fields}
    return entity.get(fields)


def _find_entity(data: Dict[str, Any], collection: str, key: Any) -> Optional[Dict[str, Any]]:
    """Finds one baseline entity by its collection-specific natural key."""
    target = _key_token(key)
    for entity in data.get(collection, []):
        if _key_token(_entity_key(collection, entity)) == target:
            return entity
    return None


def _is_empty(value: Any) -> bool:
    """Returns whether a fill-only field has no value to preserve."""
    return value is None or value == "" or value == [] or value == {}


def _contains_placeholder(value: Any) -> bool:
    """Recursively detects strong placeholder markers in a candidate value."""
    if isinstance(value, str):
        return bool(PLACEHOLDER_REGEX.search(value))
    if isinstance(value, list):
        return any(_contains_placeholder(item) for item in value)
    if isinstance(value, dict):
        return any(_contains_placeholder(item) for item in value.values())
    return False


def _candidate_evidence(evidence: Any, field: str, trusted_sources: Dict[str, Any]) -> Optional[str]:
    """Validates either an explicit AI candidate marker or verified evidence."""
    if not isinstance(evidence, dict):
        return "proposal evidence must be an object"
    source_id = evidence.get("source_id")
    evidence_hash = evidence.get("evidence_sha256")
    if source_id == "AI_GENERATED_UNVERIFIED":
        if evidence_hash is not None:
            return "AI-generated candidates must not claim an evidence hash"
        if not isinstance(evidence.get("notes"), str):
            return "AI-generated candidate notes must be a string"
        return None
    sources = {source.get("source_id"): source for source in trusted_sources.get("sources", [])}
    source = sources.get(source_id)
    if source is None:
        return f"unknown evidence source '{source_id}'"
    if source.get("verification_status") != "VERIFIED":
        return f"evidence source '{source_id}' is not VERIFIED"
    if field not in source.get("allowed_fields", []):
        return f"evidence source '{source_id}' is not approved for field '{field}'"
    evidence_path = source.get("evidence_path")
    if not isinstance(evidence_path, str) or not evidence_path:
        return f"evidence source '{source_id}' has no local snapshot"
    snapshot = (REPO_ROOT / evidence_path).resolve()
    if REPO_ROOT not in snapshot.parents or not snapshot.is_file():
        return f"evidence snapshot is missing or outside the repository: {evidence_path}"
    actual_hash = compute_file_sha256(snapshot)
    if source.get("evidence_sha256") != actual_hash or evidence_hash != actual_hash:
        return f"evidence hash does not match verified snapshot for '{source_id}'"
    return None


def _preserves_existing_conjugations(existing: Any, candidate: Any) -> bool:
    """Checks that a repair candidate retains every existing record unchanged."""
    return (
        isinstance(existing, list)
        and isinstance(candidate, list)
        and all(record in candidate for record in existing)
    )


def _validate_conjugation_candidate(
    entity: Dict[str, Any], candidate: Any, contract: Dict[str, Any]
) -> List[str]:
    """Checks canonical tense uniqueness and required-person form semantics."""
    if not isinstance(candidate, list):
        return ["conjugation value must be an array"]
    errors: List[str] = []
    infinitive = entity.get("infinitive", "")
    canonical = {
        (item["mood"], item["tense"]): item
        for item in contract.get("canonical_tenses", [])
    }
    seen = set()
    impersonal = is_impersonal(infinitive, contract)
    defective = is_defective(infinitive)
    for index, record in enumerate(candidate):
        if not isinstance(record, dict):
            continue
        key = (record.get("mood"), record.get("tense"))
        if key not in canonical:
            errors.append(f"record #{index} has unknown canonical mood/tense {key!r}")
            continue
        if key in seen:
            errors.append(f"record #{index} duplicates canonical mood/tense {key!r}")
            continue
        seen.add(key)
        forms = record.get("forms", {})
        if not isinstance(forms, dict):
            errors.append(f"record #{index} forms must be an object")
            continue
        for person in canonical[key].get("required_forms", []):
            value = forms.get(person)
            if impersonal:
                if person == "il_elle_on":
                    if value is None and forms.get("impersonal_form") is None:
                        errors.append(f"{key!r} requires an impersonal third-person form")
                elif value is not None:
                    errors.append(f"{key!r} impersonal form {person!r} must be null")
            elif not defective and (not isinstance(value, str) or not value.strip()):
                errors.append(f"{key!r} requires a non-empty {person!r} form")
    missing = set(canonical) - seen
    if missing:
        errors.append(f"missing canonical mood/tense records: {sorted(missing)!r}")
    return errors


def _write_validation_artifacts(
    response_path: Path,
    response: Dict[str, Any],
    report: Dict[str, Any],
    reports_dir: Path,
    validated_dir: Path,
) -> None:
    """Writes a report and, on PASS, its integrity-bound validated payload."""
    reports_dir.mkdir(parents=True, exist_ok=True)
    validated_dir.mkdir(parents=True, exist_ok=True)
    batch_id = response.get("batch_id", response_path.stem)
    report_json_path = reports_dir / f"{batch_id}_VALIDATION_REPORT.json"
    report_txt_path = reports_dir / f"{batch_id}_VALIDATION_REPORT.txt"
    report_json_path.write_text(
        json.dumps(report, ensure_ascii=False, indent=2), encoding="utf-8"
    )
    lines = [
        "=" * 78,
        f"L'ÉTUDE COMPLETE HIGH-RISK VALIDATION REPORT: {batch_id}",
        f"Status: {report['status']}",
        f"Queue Version: {report.get('queue_version')}",
        f"Baseline SHA-256: {report.get('baseline_hash')}",
        f"Proposals: {report.get('proposal_count', 0)} | No Proposals: {report.get('no_proposal_count', 0)}",
    ]
    if report.get("errors"):
        lines.extend(["", "Errors:", *[f"  - {error}" for error in report["errors"]]])
    lines.append("=" * 78)
    report_txt_path.write_text("\n".join(lines) + "\n", encoding="utf-8")

    validated_path = validated_dir / f"{batch_id}_VALIDATED.json"
    if report["status"] != "PASS":
        validated_path.unlink(missing_ok=True)
        return

    validated_payload = {
        "batch_id": batch_id,
        "queue_version": response["queue_version"],
        "collection": response["collection"],
        "field": response["field"],
        "mode": response["mode"],
        "baseline_hash": response["baseline_hash"],
        "candidate_provenance": response["candidate_provenance"],
        "validator_version": FULL_QUEUE_VALIDATOR_VERSION,
        "validated_at": report["timestamp"],
        "raw_response_hash": compute_file_sha256(response_path),
        "validation_report_hash": compute_file_sha256(report_json_path),
        "patches": response["proposals"],
        "no_proposals": response["no_proposals"],
    }
    validated_path.write_text(
        json.dumps(validated_payload, ensure_ascii=False, indent=2), encoding="utf-8"
    )


def validate_full_queue_response(
    response_path: Path,
    baseline_path: Optional[Path] = None,
    *,
    emit_artifacts: bool = False,
    reports_dir: Optional[Path] = None,
    validated_dir: Optional[Path] = None,
) -> Tuple[str, Dict[str, Any]]:
    """Validates one complete-queue response and returns ``(PASS|FAIL, report)``.

    PASS means the candidate is structurally safe to review. It does not
    certify linguistic correctness and does not authorize application.
    """
    errors: List[str] = []
    if not response_path.is_file():
        return "FAIL", {"status": "FAIL", "errors": [f"File not found: {response_path}"]}
    try:
        response = json.loads(response_path.read_text(encoding="utf-8"))
    except (OSError, json.JSONDecodeError) as exc:
        return "FAIL", {"status": "FAIL", "errors": [f"Invalid JSON: {exc}"]}
    if not isinstance(response, dict):
        return "FAIL", {"status": "FAIL", "errors": ["Response must be a JSON object."]}

    missing = REQUIRED_TOP_LEVEL - response.keys()
    extra = response.keys() - REQUIRED_TOP_LEVEL
    if missing:
        errors.append(f"Missing required top-level fields: {sorted(missing)}")
    if extra:
        errors.append(f"Unexpected top-level fields: {sorted(extra)}")

    batch_id = response.get("batch_id", response_path.stem)
    try:
        manifest = json.loads(BATCH_MANIFEST_PATH.read_text(encoding="utf-8"))
    except (OSError, json.JSONDecodeError) as exc:
        return "FAIL", {
            "status": "FAIL", "batch_id": batch_id,
            "errors": [f"Cannot read batch manifest: {exc}"],
        }
    batch = manifest.get("batches", {}).get(batch_id)
    if not isinstance(batch, dict):
        errors.append(f"Batch '{batch_id}' is not in the frozen manifest.")
        batch = {}

    if response.get("queue_version") != FULL_QUEUE_VERSION or manifest.get("version") != FULL_QUEUE_VERSION:
        errors.append(f"queue_version must match the active frozen queue '{FULL_QUEUE_VERSION}'")
    if manifest.get("validator_version") != FULL_QUEUE_VALIDATOR_VERSION:
        errors.append("Manifest validator_version is stale")
    for key in ("collection", "field", "mode", "baseline_hash"):
        if response.get(key) != batch.get(key):
            errors.append(f"{key} does not match the frozen manifest")
    if response.get("candidate_provenance") != "AI_GENERATED_UNVERIFIED":
        errors.append("candidate_provenance must be AI_GENERATED_UNVERIFIED")

    collection = response.get("collection")
    field = response.get("field")
    mode = response.get("mode")
    if collection not in HIGH_RISK_FIELDS or field not in HIGH_RISK_FIELDS.get(collection, []):
        errors.append(f"Unsupported high-risk field '{collection}.{field}'")
    if mode not in {FULL_QUEUE_FILL_MODE, FULL_QUEUE_REPAIR_MODE}:
        errors.append(f"Unsupported complete-queue mode '{mode}'")
    if mode == FULL_QUEUE_REPAIR_MODE and (collection, field) != ("verbs", "conjugations"):
        errors.append("COMPLETE_PARTIAL_REVIEW is authorized only for verbs.conjugations")

    batch_file = BATCH_MANIFEST_PATH.parent / f"{batch_id}.txt"
    if not batch_file.is_file() or batch.get("batch_checksum") != compute_file_sha256(batch_file):
        errors.append("Batch prompt is missing or does not match its frozen checksum")

    data, baseline_hash = load_baseline_dataset(baseline_path)
    if response.get("baseline_hash") != baseline_hash or manifest.get("baseline_hash") != baseline_hash:
        errors.append("baseline_hash does not match the active baseline")

    proposals = response.get("proposals")
    no_proposals = response.get("no_proposals")
    if not isinstance(proposals, list) or not isinstance(no_proposals, list):
        errors.append("proposals and no_proposals must both be arrays")
        proposals = proposals if isinstance(proposals, list) else []
        no_proposals = no_proposals if isinstance(no_proposals, list) else []

    expected = {_key_token(key): key for key in batch.get("target_keys", [])}
    seen = set()
    trusted_sources = load_trusted_sources()
    master_schema = json.loads(MASTER_SCHEMA_PATH.read_text(encoding="utf-8"))
    value_validator = None
    if collection in HIGH_RISK_FIELDS and field in HIGH_RISK_FIELDS.get(collection, []):
        try:
            value_validator = jsonschema.Draft202012Validator(
                field_value_schema(master_schema, collection, field)
            )
        except (KeyError, TypeError) as exc:
            errors.append(f"Cannot resolve schema for '{collection}.{field}': {exc}")
    contract = load_conjugation_contract()

    valid_proposals: List[Dict[str, Any]] = []
    conjugation_fingerprints: Dict[str, Any] = {}
    for proposal in proposals:
        if not isinstance(proposal, dict) or set(proposal) != {"entity_key", "value", "evidence"}:
            errors.append("Each proposal must contain only entity_key, value, and evidence")
            continue
        token = _key_token(proposal["entity_key"])
        if token in seen:
            errors.append("A target appears more than once")
            continue
        seen.add(token)
        if token not in expected:
            errors.append("Proposal targets an entity outside this batch")
            continue
        entity = _find_entity(data, collection, proposal["entity_key"])
        if entity is None:
            errors.append("Proposal target does not exist in the baseline")
            continue

        value = proposal["value"]
        if _is_empty(value):
            errors.append(f"Target {proposal['entity_key']!r}: proposal value is empty")
        if value_validator is not None:
            for schema_error in list(value_validator.iter_errors(value))[:5]:
                location = ".".join(str(part) for part in schema_error.path) or "value"
                errors.append(
                    f"Target {proposal['entity_key']!r} schema error at {location}: {schema_error.message}"
                )
        if _contains_placeholder(value):
            errors.append(f"Target {proposal['entity_key']!r}: proposal contains placeholder text")

        existing = entity.get(field)
        if mode == FULL_QUEUE_FILL_MODE:
            if not _is_empty(existing):
                errors.append(f"Target {proposal['entity_key']!r}: fill-only field is not empty")
        elif mode == FULL_QUEUE_REPAIR_MODE:
            current_status, _ = evaluate_verb_conjugation_status(entity, contract)
            if current_status != "PARTIAL":
                errors.append(
                    f"Target {proposal['entity_key']!r}: repair mode requires a PARTIAL conjugation field"
                )
            if not _preserves_existing_conjugations(existing, value):
                errors.append(
                    f"Target {proposal['entity_key']!r}: repair candidate alters or omits an existing conjugation record"
                )

        if (collection, field) == ("verbs", "conjugations") and isinstance(value, list):
            for conjugation_error in _validate_conjugation_candidate(entity, value, contract):
                errors.append(f"Target {proposal['entity_key']!r}: {conjugation_error}")
            candidate_entity = copy.deepcopy(entity)
            candidate_entity[field] = value
            candidate_status, reasons = evaluate_verb_conjugation_status(candidate_entity, contract)
            if candidate_status != "COMPLETE":
                errors.append(
                    f"Target {proposal['entity_key']!r}: conjugation candidate is {candidate_status}, "
                    f"not COMPLETE ({'; '.join(reasons)})"
                )
            fingerprint = _key_token([record.get("forms") for record in value if isinstance(record, dict)])
            if fingerprint in conjugation_fingerprints:
                errors.append(
                    f"Target {proposal['entity_key']!r}: conjugation forms exactly duplicate target "
                    f"{conjugation_fingerprints[fingerprint]!r} in the same response"
                )
            else:
                conjugation_fingerprints[fingerprint] = proposal["entity_key"]

        evidence_error = _candidate_evidence(proposal["evidence"], field, trusted_sources)
        if evidence_error:
            errors.append(f"Target {proposal['entity_key']!r}: {evidence_error}")
        valid_proposals.append(proposal)

    for item in no_proposals:
        if not isinstance(item, dict) or set(item) != {"entity_key", "reason", "details"}:
            errors.append("Each no_proposal must contain only entity_key, reason, and details")
            continue
        token = _key_token(item["entity_key"])
        if token in seen:
            errors.append("A target appears more than once")
            continue
        seen.add(token)
        if token not in expected:
            errors.append("No-proposal targets an entity outside this batch")
        if item["reason"] not in CONTROLLED_NO_PROPOSAL_REASONS:
            errors.append(f"Invalid no-proposal reason '{item['reason']}'")
        if not isinstance(item["details"], str):
            errors.append("no_proposal details must be a string")

    if set(expected) - seen:
        errors.append("Response omits one or more batch targets")

    if not errors:
        staged = copy.deepcopy(data)
        for proposal in valid_proposals:
            entity = _find_entity(staged, collection, proposal["entity_key"])
            if entity is None:
                errors.append("Dry run could not resolve a validated proposal target")
                break
            entity[field] = copy.deepcopy(proposal["value"])
        if not errors:
            schema_errors = validate_master_dataset_schema(staged)
            if schema_errors:
                errors.append(f"Full-dataset schema dry run failed: {schema_errors[:5]}")

    status = "FAIL" if errors else "PASS"
    report = {
        "status": status,
        "batch_id": batch_id,
        "timestamp": datetime.now(timezone.utc).isoformat(),
        "queue_version": FULL_QUEUE_VERSION,
        "validator_version": FULL_QUEUE_VALIDATOR_VERSION,
        "baseline_hash": baseline_hash,
        "target_count": len(expected),
        "proposal_count": len(proposals),
        "no_proposal_count": len(no_proposals),
        "unfilled_target_count": len(no_proposals),
        "errors": errors,
    }
    if emit_artifacts:
        _write_validation_artifacts(
            response_path, response, report,
            reports_dir or REPORTS_DIR,
            validated_dir or VALIDATED_DIR,
        )
    return status, report


def main() -> None:
    """CLI entry point for validating and materializing one response."""
    parser = argparse.ArgumentParser(description="Validate one complete high-risk queue response.")
    parser.add_argument("response_file", type=Path)
    parser.add_argument("--baseline", type=Path, default=None)
    args = parser.parse_args()
    status, report = validate_full_queue_response(
        args.response_file, args.baseline, emit_artifacts=True
    )
    print(f"{status}: {report.get('batch_id', args.response_file.name)}")
    for error in report["errors"]:
        print(f"- {error}")
    if status == "PASS":
        print(f"Validated output: {VALIDATED_DIR / (report['batch_id'] + '_VALIDATED.json')}")
    raise SystemExit(0 if status == "PASS" else 1)


if __name__ == "__main__":
    main()
