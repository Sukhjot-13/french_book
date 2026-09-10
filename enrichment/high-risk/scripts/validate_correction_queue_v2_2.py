"""Fail-closed staging validation for the isolated v2.2 correction queue.

This verifies candidate structure and schema safety only.  A PASS means the
candidate is ready for v2.2 repair-policy review, never for approval or merge.
"""

import argparse
import copy
import json
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

from scripts.high_risk_helpers import (
    load_baseline_dataset,
    load_conjugation_contract,
    validate_master_dataset_schema,
)
from scripts.make_correction_queue_v2_2 import (
    CORRECTION_QUEUE_VERSION,
    DEFAULT_OUTPUT_DIR,
    RESPONSE_RELATIVE_DIR,
    correction_context,
    find_entity,
    key_token,
)
from scripts.make_full_high_risk_queue import field_value_schema
from scripts.validate_full_high_risk_response import (
    _contains_placeholder,
    _is_empty,
    _validate_conjugation_candidate,
)


DEFAULT_RESPONSES_DIR = HIGH_RISK_DIR / "responses" / "corrections-v2.2"
DEFAULT_REPORTS_DIR = HIGH_RISK_DIR / "reports" / "corrections-v2.2"
CORRECTION_MANIFEST_PATH = DEFAULT_OUTPUT_DIR / "CORRECTION_MANIFEST.json"
CORRECTION_POLICY_PATH = HIGH_RISK_DIR / "config" / "correction_conjugation_policy_v2_2.json"
REQUIRED_TOP_LEVEL = {
    "batch_id", "correction_queue_version", "collection", "field",
    "remediation_type", "baseline_hash", "source_v2_1_batch_ids",
    "candidate_provenance", "proposals", "no_proposals",
}


def load_correction_conjugation_policy(path: Path = CORRECTION_POLICY_PATH) -> Dict[str, Any]:
    """Loads the narrow, staged v2.2 conjugation-exception policy."""
    policy = json.loads(path.read_text(encoding="utf-8"))
    if policy.get("version") != CORRECTION_QUEUE_VERSION:
        raise ValueError("Correction conjugation policy version does not match the correction queue")
    if not isinstance(policy.get("imperative_exceptions"), list):
        raise ValueError("Correction conjugation policy has no imperative_exceptions list")
    return policy


def _validate_correction_conjugation_candidate(
    entity: Dict[str, Any], candidate: List[Dict[str, Any]], contract: Dict[str, Any], policy: Dict[str, Any]
) -> List[str]:
    """Applies canonical checks plus exact null-only imperative exceptions."""
    infinitive = entity.get("infinitive")
    exception = next(
        (item for item in policy["imperative_exceptions"] if item.get("infinitive") == infinitive), None
    )
    errors = _validate_conjugation_candidate(entity, candidate, contract)
    if exception is None:
        return errors
    required_null_forms = set(exception["required_null_forms"])
    errors = [
        error for error in errors
        if not (
            error.startswith("('imperative', 'impératif') requires a non-empty ")
            and any(f"'{form}'" in error for form in required_null_forms)
        )
    ]
    imperative_records = [
        record for record in candidate
        if isinstance(record, dict) and record.get("mood") == "imperative" and record.get("tense") == "impératif"
    ]
    if len(imperative_records) == 1:
        forms = imperative_records[0].get("forms", {})
        for form in required_null_forms:
            if forms.get(form) is not None:
                errors.append(f"('imperative', 'impératif') exception requires {form!r} to be null")
    return errors


def validate_correction_response(
    response_path: Path,
    data: Dict[str, Any],
    baseline_hash: str,
    manifest: Dict[str, Any],
    master_schema: Dict[str, Any],
    contract: Dict[str, Any],
    policy: Optional[Dict[str, Any]] = None,
) -> Tuple[str, Dict[str, Any]]:
    """Validates one v2.2 draft response against its correction-manifest entry."""
    errors: List[str] = []
    policy = policy or load_correction_conjugation_policy()
    batch_id = response_path.name.removesuffix("_RESPONSE.json")
    report: Dict[str, Any] = {
        "status": "FAIL", "batch_id": batch_id,
        "timestamp": datetime.now(timezone.utc).isoformat(),
        "correction_queue_version": CORRECTION_QUEUE_VERSION,
        "errors": errors,
    }
    try:
        response = json.loads(response_path.read_text(encoding="utf-8"))
    except (OSError, json.JSONDecodeError) as exc:
        errors.append(f"Invalid or unreadable JSON: {exc}")
        return "FAIL", report
    if not isinstance(response, dict):
        errors.append("Response top level must be an object")
        return "FAIL", report
    if set(response) != REQUIRED_TOP_LEVEL:
        errors.append("Response top-level keys must match the correction response envelope exactly")

    entry = manifest.get("batches", {}).get(batch_id)
    if entry is None:
        errors.append("Response batch ID is not present in CORRECTION_MANIFEST.json")
        return "FAIL", report
    expected_metadata = {
        "batch_id": batch_id,
        "correction_queue_version": CORRECTION_QUEUE_VERSION,
        "collection": entry["collection"],
        "field": entry["field"],
        "remediation_type": entry["remediation_type"],
        "baseline_hash": baseline_hash,
        "source_v2_1_batch_ids": entry["source_v2_1_batch_ids"],
        "candidate_provenance": "AI_GENERATED_UNVERIFIED",
    }
    for name, expected in expected_metadata.items():
        if response.get(name) != expected:
            errors.append(f"Metadata mismatch for {name!r}")

    proposals = response.get("proposals")
    no_proposals = response.get("no_proposals")
    if not isinstance(proposals, list):
        errors.append("proposals must be an array")
        proposals = []
    if no_proposals != []:
        errors.append("no_proposals must be an empty array in the correction queue")

    expected_keys = {key_token(item) for item in entry["target_keys"]}
    seen_keys = set()
    value_schema = field_value_schema(master_schema, entry["collection"], entry["field"])
    value_validator = jsonschema.Draft202012Validator(value_schema)
    for proposal in proposals:
        if not isinstance(proposal, dict) or set(proposal) != {"entity_key", "value", "evidence"}:
            errors.append("Every proposal must contain exactly entity_key, value, and evidence")
            continue
        target_key = proposal["entity_key"]
        token = key_token(target_key)
        if token in seen_keys:
            errors.append(f"Duplicate proposal target: {target_key!r}")
            continue
        seen_keys.add(token)
        if token not in expected_keys:
            errors.append(f"Proposal target is outside this correction batch: {target_key!r}")
            continue
        try:
            entity = find_entity(data, entry["collection"], target_key)
        except ValueError:
            errors.append(f"Proposal target does not exist in baseline: {target_key!r}")
            continue
        value = proposal["value"]
        if _is_empty(value):
            errors.append(f"Target {target_key!r}: proposal value is empty")
        if _contains_placeholder(value):
            errors.append(f"Target {target_key!r}: proposal contains placeholder text")
        for schema_error in list(value_validator.iter_errors(value))[:5]:
            location = ".".join(str(part) for part in schema_error.path) or "value"
            errors.append(f"Target {target_key!r}: schema error at {location}: {schema_error.message}")
        evidence = proposal["evidence"]
        if not isinstance(evidence, dict) or set(evidence) != {"source_id", "evidence_sha256", "notes"}:
            errors.append(f"Target {target_key!r}: evidence must match the AI-candidate envelope")
        elif evidence.get("source_id") != "AI_GENERATED_UNVERIFIED" or evidence.get("evidence_sha256") is not None:
            errors.append(f"Target {target_key!r}: evidence must remain AI_GENERATED_UNVERIFIED with null hash")
        elif not isinstance(evidence.get("notes"), str) or not evidence["notes"].strip():
            errors.append(f"Target {target_key!r}: evidence.notes must be a non-empty string")

        if entry["remediation_type"] == "FILL_RETRY" and not _is_empty(entity.get(entry["field"])):
            errors.append(f"Target {target_key!r}: fill-retry target field is no longer empty")
        if entry["remediation_type"] == "CANONICAL_REPAIR_DRAFT":
            if not isinstance(value, list):
                errors.append(f"Target {target_key!r}: conjugation repair value must be an array")
            else:
                for message in _validate_correction_conjugation_candidate(entity, value, contract, policy):
                    errors.append(f"Target {target_key!r}: {message}")
                for record_index, record in enumerate(value):
                    if isinstance(record, dict) and record.get("sources") != []:
                        errors.append(f"Target {target_key!r}: record #{record_index} sources must be [] for staged v2.2 repair")

    missing = expected_keys - seen_keys
    if missing:
        errors.append(f"Response omits {len(missing)} required target(s)")
    if len(proposals) != len(expected_keys):
        errors.append(f"Expected {len(expected_keys)} proposals, found {len(proposals)}")
    report.update({"proposal_count": len(proposals), "no_proposal_count": len(no_proposals) if isinstance(no_proposals, list) else None})
    if not errors:
        report["status"] = "PASS"
        return "PASS", report
    return "FAIL", report


def validate_correction_folder(
    response_dir: Path = DEFAULT_RESPONSES_DIR,
    reports_dir: Path = DEFAULT_REPORTS_DIR,
    baseline_path: Optional[Path] = None,
) -> Dict[str, Any]:
    """Validates every expected correction response and one full staged dataset dry run."""
    manifest = json.loads(CORRECTION_MANIFEST_PATH.read_text(encoding="utf-8"))
    data, baseline_hash = load_baseline_dataset(baseline_path)
    if baseline_hash != manifest.get("baseline_hash"):
        raise ValueError("Baseline hash differs from the correction manifest")
    master_schema = json.loads((REPO_ROOT / "data" / "MASTER_SCHEMA.json").read_text(encoding="utf-8"))
    contract = load_conjugation_contract()
    policy = load_correction_conjugation_policy()
    expected_ids = set(manifest["batches"])
    response_paths = {path.name.removesuffix("_RESPONSE.json"): path for path in response_dir.glob("*_RESPONSE.json")}
    missing_ids = sorted(expected_ids - set(response_paths))
    unexpected_ids = sorted(set(response_paths) - expected_ids)
    reports_dir.mkdir(parents=True, exist_ok=True)
    results: Dict[str, Any] = {}
    staged = copy.deepcopy(data)
    pass_count = 0
    for batch_id in sorted(expected_ids & set(response_paths)):
        status, report = validate_correction_response(
            response_paths[batch_id], data, baseline_hash, manifest, master_schema, contract, policy
        )
        results[batch_id] = {"status": status, "errors": report["errors"], "proposal_count": report.get("proposal_count", 0)}
        (reports_dir / f"{batch_id}_STAGED_VALIDATION_REPORT.json").write_text(
            json.dumps(report, ensure_ascii=False, indent=2) + "\n", encoding="utf-8"
        )
        if status != "PASS":
            continue
        pass_count += 1
        response = json.loads(response_paths[batch_id].read_text(encoding="utf-8"))
        entry = manifest["batches"][batch_id]
        for proposal in response["proposals"]:
            entity = find_entity(staged, entry["collection"], proposal["entity_key"])
            entity[entry["field"]] = proposal["value"]
    staged_schema_errors = validate_master_dataset_schema(staged) if pass_count == len(expected_ids) else []
    summary = {
        "timestamp": datetime.now(timezone.utc).isoformat(),
        "correction_queue_version": CORRECTION_QUEUE_VERSION,
        "baseline_hash": baseline_hash,
        "responses_found": len(expected_ids & set(response_paths)),
        "total_batches": len(expected_ids),
        "missing_response_ids": missing_ids,
        "unexpected_response_ids": unexpected_ids,
        "pass_count": pass_count,
        "fail_count": len(results) - pass_count,
        "staged_dataset_schema_errors": staged_schema_errors,
        "ready_for_policy_review": not missing_ids and not unexpected_ids and pass_count == len(expected_ids) and not staged_schema_errors,
        "ready_for_approval_or_application": False,
        "results": results,
    }
    (reports_dir / "CORRECTION_QUEUE_VALIDATION_SUMMARY.json").write_text(
        json.dumps(summary, ensure_ascii=False, indent=2) + "\n", encoding="utf-8"
    )
    print(f"Responses: {summary['responses_found']}/{summary['total_batches']}")
    print(f"PASS: {summary['pass_count']} | FAIL: {summary['fail_count']}")
    print(f"Ready for policy review: {'YES' if summary['ready_for_policy_review'] else 'NO'}")
    return summary


def main() -> None:
    """CLI entry point for staging-only v2.2 correction validation."""
    parser = argparse.ArgumentParser(description="Validate v2.2 correction responses without applying them.")
    parser.add_argument("--responses", type=Path, default=DEFAULT_RESPONSES_DIR)
    parser.add_argument("--reports", type=Path, default=DEFAULT_REPORTS_DIR)
    parser.add_argument("--baseline", type=Path, default=None)
    parser.add_argument("--require-complete", action="store_true")
    args = parser.parse_args()
    summary = validate_correction_folder(args.responses, args.reports, args.baseline)
    if args.require_complete and not summary["ready_for_policy_review"]:
        raise SystemExit(2)


if __name__ == "__main__":
    main()
