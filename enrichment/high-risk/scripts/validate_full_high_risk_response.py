"""Validate v2 full-queue high-risk responses without authorizing a merge.

The complete queue has a deliberately smaller proposal contract than the
legacy verbs.conjugations pipeline. This validator owns that contract. It
validates every field's response envelope and distinguishes explicitly marked
unverified AI candidates from proposals backed by verified local evidence.
"""

import argparse
import json
import sys
from pathlib import Path
from typing import Any, Dict, List, Optional, Tuple

REPO_ROOT = Path(__file__).resolve().parent.parent.parent.parent
HIGH_RISK_DIR = Path(__file__).resolve().parent.parent
for path in (str(REPO_ROOT), str(HIGH_RISK_DIR)):
    if path not in sys.path:
        sys.path.insert(0, path)

from config.high_risk_config import BATCH_MANIFEST_PATH, HIGH_RISK_FIELDS, NATURAL_KEYS
from scripts.high_risk_helpers import compute_file_sha256, load_baseline_dataset, load_trusted_sources


REQUIRED_TOP_LEVEL = {
    "batch_id", "collection", "field", "mode", "baseline_hash", "candidate_provenance", "proposals", "no_proposals"
}
CONTROLLED_NO_PROPOSAL_REASONS = {
    "SOURCE_NOT_FOUND", "CONFLICTING_SOURCES", "INSUFFICIENT_EVIDENCE", "PARTIAL_EXISTING_DATA"
}


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
    """Returns whether a fill-only field is still eligible for a proposal."""
    return value is None or value == "" or value == [] or value == {}


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
    snapshot = REPO_ROOT / evidence_path
    if not snapshot.is_file():
        return f"evidence snapshot is missing: {evidence_path}"
    actual_hash = compute_file_sha256(snapshot)
    if source.get("evidence_sha256") != actual_hash or evidence_hash != actual_hash:
        return f"evidence hash does not match verified snapshot for '{source_id}'"
    return None


def validate_full_queue_response(response_path: Path, baseline_path: Optional[Path] = None) -> Tuple[str, Dict[str, Any]]:
    """Validates a v2 full-queue response and returns ``(PASS|FAIL, report)``.

    A PASS establishes only that the response is an accountable proposal (or a
    complete no-proposal result); it never marks a high-risk mutation approved.
    """
    errors: List[str] = []
    if not response_path.is_file():
        return "FAIL", {"errors": [f"File not found: {response_path}"]}
    try:
        response = json.loads(response_path.read_text(encoding="utf-8"))
    except (OSError, json.JSONDecodeError) as exc:
        return "FAIL", {"errors": [f"Invalid JSON: {exc}"]}
    if not isinstance(response, dict):
        return "FAIL", {"errors": ["Response must be a JSON object."]}
    missing = REQUIRED_TOP_LEVEL - response.keys()
    extra = response.keys() - REQUIRED_TOP_LEVEL
    if missing:
        errors.append(f"Missing required top-level fields: {sorted(missing)}")
    if extra:
        errors.append(f"Unexpected top-level fields: {sorted(extra)}")
    if errors:
        return "FAIL", {"errors": errors}

    batch_id = response["batch_id"]
    try:
        manifest = json.loads(BATCH_MANIFEST_PATH.read_text(encoding="utf-8"))
    except (OSError, json.JSONDecodeError) as exc:
        return "FAIL", {"errors": [f"Cannot read batch manifest: {exc}"]}
    batch = manifest.get("batches", {}).get(batch_id)
    if not isinstance(batch, dict):
        return "FAIL", {"errors": [f"Batch '{batch_id}' is not in the frozen manifest."]}

    for key in ("collection", "field", "mode", "baseline_hash"):
        if response[key] != batch.get(key):
            errors.append(f"{key} does not match the frozen manifest")
    if response["candidate_provenance"] != "AI_GENERATED_UNVERIFIED":
        errors.append("candidate_provenance must be AI_GENERATED_UNVERIFIED")
    collection = response["collection"]
    field = response["field"]
    if collection not in HIGH_RISK_FIELDS or field not in HIGH_RISK_FIELDS[collection]:
        errors.append(f"Unsupported high-risk field '{collection}.{field}'")
    batch_file = BATCH_MANIFEST_PATH.parent / f"{batch_id}.txt"
    if not batch_file.is_file() or batch.get("batch_checksum") != compute_file_sha256(batch_file):
        errors.append("Batch prompt is missing or does not match its frozen checksum")
    data, baseline_hash = load_baseline_dataset(baseline_path)
    if response["baseline_hash"] != baseline_hash:
        errors.append("baseline_hash does not match the active baseline")

    proposals = response["proposals"]
    no_proposals = response["no_proposals"]
    if not isinstance(proposals, list) or not isinstance(no_proposals, list):
        errors.append("proposals and no_proposals must both be arrays")
        return "FAIL", {"batch_id": batch_id, "errors": errors}

    expected = {_key_token(key): key for key in batch.get("target_keys", [])}
    seen = set()
    trusted_sources = load_trusted_sources()
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
        if response["mode"] != "FILL_ONLY":
            errors.append("REPAIR_REVIEW_ONLY batches cannot contain automatic proposals")
        elif not _is_empty(entity.get(field)):
            errors.append("Fill-only proposal targets a non-empty field")
        evidence_error = _candidate_evidence(proposal["evidence"], field, trusted_sources)
        if evidence_error:
            errors.append(evidence_error)

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

    missing_targets = set(expected) - seen
    if missing_targets:
        errors.append("Response omits one or more batch targets")
    return ("FAIL" if errors else "PASS"), {
        "batch_id": batch_id,
        "proposal_count": len(proposals),
        "no_proposal_count": len(no_proposals),
        "errors": errors,
    }


def main() -> None:
    """CLI entry point for validating one v2 full-queue response."""
    parser = argparse.ArgumentParser(description="Validate a v2 full high-risk queue response.")
    parser.add_argument("response_file", type=Path)
    parser.add_argument("--baseline", type=Path, default=None)
    args = parser.parse_args()
    status, report = validate_full_queue_response(args.response_file, args.baseline)
    print(f"{status}: {report.get('batch_id', args.response_file.name)}")
    for error in report["errors"]:
        print(f"- {error}")
    raise SystemExit(0 if status == "PASS" else 1)


if __name__ == "__main__":
    main()
