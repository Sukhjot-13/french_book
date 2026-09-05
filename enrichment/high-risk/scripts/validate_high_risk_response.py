"""
High-Risk Response Validator (enrichment/high-risk/scripts/validate_high_risk_response.py)

Enforces 15 fail-closed validation gates on AI worker responses for
verbs.conjugations enrichment. Produces validated payloads only on complete PASS.
"""

import argparse
import copy
import json
import re
import sys
from datetime import datetime, timezone
from pathlib import Path
from typing import Any, Dict, List, Optional, Set, Tuple

REPO_ROOT = Path(__file__).resolve().parent.parent.parent.parent
HIGH_RISK_DIR = Path(__file__).resolve().parent.parent
for p in [str(REPO_ROOT), str(HIGH_RISK_DIR)]:
    if p not in sys.path:
        sys.path.insert(0, p)

import jsonschema

from config.high_risk_config import (
    ACTIVE_COLLECTION,
    ACTIVE_HIGH_RISK_FIELD,
    ALLOWED_OPERATIONS,
    BATCH_MANIFEST_PATH,
    CONTRACT_VERSION,
    CONTROLLED_NO_PROPOSAL_REASONS,
    REPORTS_DIR,
    RESPONSES_DIR,
    SOURCE_ALLOWLIST_VERSION,
    VALIDATED_DIR,
    VALIDATOR_VERSION,
)
from scripts.high_risk_helpers import (
    classify_morphological_type,
    compute_file_sha256,
    is_defective,
    is_impersonal,
    is_pronominal,
    load_baseline_dataset,
    load_conjugation_contract,
    load_response_schema,
    load_trusted_sources,
    normalize_conjugations_for_schema,
    validate_master_dataset_schema,
)

# Placeholder detection patterns
PLACEHOLDER_REGEX = re.compile(r"(\.{3}|TODO|TBD|FIXME|\?{2,}|placeholder|example|unknown)", re.IGNORECASE)
HTML_REGEX = re.compile(r"<[^>]+>")


def validate_response(
    response_path: Path,
    baseline_path: Optional[Path] = None,
) -> Tuple[str, Dict[str, Any]]:
    """
    Executes all 15 validation gates on a candidate response file.
    Returns (status, report_dict) where status is 'PASS', 'REVIEW_REQUIRED', or 'FAIL'.
    """
    gates_passed: List[str] = []
    errors: List[str] = []
    warnings: List[str] = []

    # GATE 1: File presence, valid JSON, response schema compliance
    if not response_path.exists():
        return "FAIL", {"status": "FAIL", "errors": [f"File not found: {response_path}"]}

    try:
        with open(response_path, "r", encoding="utf-8") as f:
            raw_content = f.read()
            response_data = json.loads(raw_content)
    except Exception as e:
        return "FAIL", {"status": "FAIL", "errors": [f"Invalid JSON in {response_path}: {e}"]}

    response_schema = load_response_schema()
    validator = jsonschema.Draft7Validator(response_schema)
    schema_errs = list(validator.iter_errors(response_data))
    if schema_errs:
        err_msgs = [f"Schema error at [{'.'.join(str(p) for p in err.path)}]: {err.message}" for err in schema_errs[:10]]
        return "FAIL", {"status": "FAIL", "errors": err_msgs}
    gates_passed.append("GATE_1_RESPONSE_SCHEMA")

    # Load baseline, contract, manifest, and sources
    data, actual_baseline_hash = load_baseline_dataset(baseline_path)
    contract = load_conjugation_contract()
    trusted_sources = load_trusted_sources()

    batch_id = response_data["batch_id"]

    if not BATCH_MANIFEST_PATH.exists():
        return "FAIL", {"status": "FAIL", "errors": ["BATCH_MANIFEST.json does not exist."]}

    with open(BATCH_MANIFEST_PATH, "r", encoding="utf-8") as f:
        manifest = json.load(f)

    manifest_batches = manifest.get("batches", {})
    if batch_id not in manifest_batches:
        return "FAIL", {"status": "FAIL", "errors": [f"Batch '{batch_id}' not found in manifest."]}

    batch_meta = manifest_batches[batch_id]

    # GATE 2: Exact batch ID, collection, contract version, baseline hash, source allowlist version
    if response_data.get("collection") != ACTIVE_COLLECTION:
        errors.append(f"Expected collection '{ACTIVE_COLLECTION}', got '{response_data.get('collection')}'")
    if response_data.get("contract_version") != CONTRACT_VERSION:
        errors.append(f"Expected contract_version '{CONTRACT_VERSION}', got '{response_data.get('contract_version')}'")
    if response_data.get("baseline_hash") != actual_baseline_hash:
        errors.append(f"Baseline hash mismatch: expected '{actual_baseline_hash}', got '{response_data.get('baseline_hash')}'")
    if response_data.get("source_allowlist_version") != SOURCE_ALLOWLIST_VERSION:
        errors.append(f"Expected source_allowlist_version '{SOURCE_ALLOWLIST_VERSION}', got '{response_data.get('source_allowlist_version')}'")
    if batch_meta.get("collection") != ACTIVE_COLLECTION:
        errors.append("Manifest collection does not match the active collection.")
    if batch_meta.get("field") != ACTIVE_HIGH_RISK_FIELD:
        errors.append("Manifest field does not match the active high-risk field.")
    for key, expected in (
        ("contract_version", CONTRACT_VERSION),
        ("source_allowlist_version", SOURCE_ALLOWLIST_VERSION),
        ("baseline_hash", actual_baseline_hash),
    ):
        if batch_meta.get(key) != expected:
            errors.append(f"Manifest {key} is stale or inconsistent with the current run.")

    batch_file = BATCH_MANIFEST_PATH.parent / f"{batch_id}.txt"
    if not batch_file.exists():
        errors.append(f"Batch prompt is missing: {batch_file}")
    elif batch_meta.get("batch_checksum") != compute_file_sha256(batch_file):
        errors.append("Batch prompt checksum does not match the frozen manifest.")

    if not errors:
        gates_passed.append("GATE_2_METADATA_INTEGRITY")

    # Target accounting
    expected_targets = set(batch_meta.get("target_keys", []))
    verbs_by_infinitive = {v["infinitive"]: v for v in data.get("verbs", [])}

    patches = response_data.get("patches", [])
    no_proposals = response_data.get("no_proposals", [])

    patch_keys = [p["entity_key"] for p in patches]
    no_prop_keys = [np["entity_key"] for np in no_proposals]
    all_response_keys = patch_keys + no_prop_keys

    # GATE 3: Target uniqueness & existence in baseline
    key_counts: Dict[str, int] = {}
    for k in all_response_keys:
        key_counts[k] = key_counts.get(k, 0) + 1
        if key_counts[k] > 1:
            errors.append(f"Duplicate target key in response: '{k}'")
        if k not in verbs_by_infinitive:
            errors.append(f"Target key '{k}' does not exist in baseline verbs collection.")

    # GATE 4: Exact manifest ownership (no extra, no omitted without no_proposal)
    response_key_set = set(all_response_keys)
    extra_targets = response_key_set - expected_targets
    missing_targets = expected_targets - response_key_set

    if extra_targets:
        errors.append(f"Response contains targets outside the manifest: {sorted(extra_targets)}")
    if missing_targets:
        errors.append(f"Response omitted targets without no_proposal: {sorted(missing_targets)}")

    if not errors:
        gates_passed.append("GATE_3_AND_4_TARGET_OWNERSHIP")

    # Validate no_proposals reasons
    for np in no_proposals:
        reason = np.get("reason")
        if reason not in CONTROLLED_NO_PROPOSAL_REASONS:
            errors.append(f"Invalid no_proposal reason '{reason}' for target '{np.get('entity_key')}'. Must be one of {CONTROLLED_NO_PROPOSAL_REASONS}")

    # Allowlisted source IDs
    allowed_source_ids = {s["source_id"]: s for s in trusted_sources.get("sources", [])}

    # Canonical tenses configuration
    canonical_tenses = contract.get("canonical_tenses", [])
    canonical_tense_keys = {(t["mood"], t["tense"]) for t in canonical_tenses}
    person_keys = contract.get("person_keys", [])

    staged_patches: List[Dict[str, Any]] = []
    seen_conjugation_fingerprints: Dict[str, str] = {}

    for patch in patches:
        entity_key = patch["entity_key"]
        baseline_verb = verbs_by_infinitive[entity_key]

        # GATE 5: Operation authorized
        op = patch.get("operation")
        if op not in ALLOWED_OPERATIONS:
            errors.append(f"Target '{entity_key}': unauthorized operation '{op}'.")

        # GATE 6: Only verbs.conjugations modified
        field = patch.get("field")
        if field != ACTIVE_HIGH_RISK_FIELD:
            errors.append(f"Target '{entity_key}': unauthorized field '{field}'.")

        # GATE 7: Precondition check: current target field is empty
        existing_conjs = baseline_verb.get("conjugations")
        if existing_conjs not in [None, []]:
            errors.append(
                f"Target '{entity_key}': field 'conjugations' is not empty (contains {len(existing_conjs)} items). Fill-only requires strictly empty field."
            )

        # GATE 8: Evidence verification
        evidence = patch.get("evidence", {})
        source_id = evidence.get("source_id")
        if not source_id or source_id not in allowed_source_ids:
            errors.append(f"Target '{entity_key}': evidence source_id '{source_id}' is not in trusted sources allowlist.")
        else:
            src_def = allowed_source_ids[source_id]
            if "conjugations" not in src_def.get("allowed_fields", []):
                errors.append(f"Target '{entity_key}': source '{source_id}' is not authorized for 'conjugations'.")
            if src_def.get("verification_status") != "VERIFIED":
                errors.append(f"Target '{entity_key}': source '{source_id}' is not independently verified for this pipeline.")
            evidence_path = src_def.get("evidence_path")
            expected_evidence_hash = src_def.get("evidence_sha256")
            if not evidence_path or not expected_evidence_hash:
                errors.append(f"Target '{entity_key}': source '{source_id}' lacks a frozen local evidence path and SHA-256.")
            else:
                local_evidence = (REPO_ROOT / evidence_path).resolve()
                if REPO_ROOT not in local_evidence.parents or not local_evidence.exists():
                    errors.append(f"Target '{entity_key}': source '{source_id}' evidence path is missing or outside the repository.")
                elif compute_file_sha256(local_evidence) != expected_evidence_hash:
                    errors.append(f"Target '{entity_key}': source '{source_id}' evidence hash does not match its allowlist record.")

        # GATE 9 & 10: Conjugation paradigm verification
        val = patch.get("value")
        if not isinstance(val, list) or len(val) == 0:
            errors.append(f"Target '{entity_key}': value must be a non-empty array of conjugation records.")
            continue

        verb_morphology = classify_morphological_type(baseline_verb, contract)
        is_imp = is_impersonal(entity_key, contract)
        is_pronom = is_pronominal(entity_key)
        is_def = is_defective(entity_key)

        supplied_tense_keys = set()
        for idx, c_rec in enumerate(val):
            t_name = c_rec.get("tense")
            m_name = c_rec.get("mood")
            forms = c_rec.get("forms", {})

            tense_key = (m_name, t_name)
            if tense_key not in canonical_tense_keys:
                errors.append(f"Target '{entity_key}' rec #{idx}: unknown mood/tense pair '{m_name}/{t_name}'.")
            if tense_key in supplied_tense_keys:
                errors.append(f"Target '{entity_key}' has duplicate mood/tense record '{m_name}/{t_name}'.")
            supplied_tense_keys.add(tense_key)

            # Check required forms for this tense
            target_tense_rule = next((t for t in canonical_tenses if t["tense"] == t_name), None)
            if target_tense_rule:
                req_forms = target_tense_rule.get("required_forms", [])
                for rf in req_forms:
                    f_val = forms.get(rf)
                    if is_imp and rf not in ["il_elle_on", "impersonal_form"]:
                        # For impersonal verbs, other forms must be null
                        if f_val is not None:
                            errors.append(f"Target '{entity_key}' ({t_name}): impersonal verb must have null for personal form '{rf}'.")
                    elif is_imp and rf in ["il_elle_on", "impersonal_form"]:
                        if f_val is None and forms.get("impersonal_form") is None:
                            errors.append(f"Target '{entity_key}' ({t_name}): impersonal verb requires il_elle_on or impersonal_form.")
                    elif not is_imp and not is_def:
                        # Regular non-defective verb must have string
                        if not isinstance(f_val, str) or not f_val.strip():
                            errors.append(f"Target '{entity_key}' ({t_name}): missing required form for '{rf}'.")
                        else:
                            # GATE 10 checks: placeholder, html, english
                            if PLACEHOLDER_REGEX.search(f_val):
                                errors.append(f"Target '{entity_key}' ({t_name}): placeholder text detected in '{rf}': '{f_val}'.")
                            if HTML_REGEX.search(f_val):
                                errors.append(f"Target '{entity_key}' ({t_name}): HTML tags detected in '{rf}': '{f_val}'.")

            # Check non-required forms
            for pk in person_keys:
                pk_val = forms.get(pk)
                if isinstance(pk_val, str):
                    if PLACEHOLDER_REGEX.search(pk_val):
                        errors.append(f"Target '{entity_key}' ({t_name}): placeholder text in '{pk}'.")
                    if HTML_REGEX.search(pk_val):
                        errors.append(f"Target '{entity_key}' ({t_name}): HTML in '{pk}'.")

        # GATE 9: Check all canonical tenses are supplied (unless defective)
        missing_canonical = canonical_tense_keys - supplied_tense_keys
        if missing_canonical and not is_def:
            errors.append(f"Target '{entity_key}': missing canonical tenses: {sorted(missing_canonical)}.")

        # GATE 11 & 12: Morphological / structural cross checks
        if is_pronom:
            # Pronominal check: present tense je should have me/m'
            pres_rec = next((c for c in val if c.get("tense") == "présent"), None)
            if pres_rec:
                je_form = pres_rec.get("forms", {}).get("je")
                if je_form and not (je_form.startswith("me ") or je_form.startswith("m'") or je_form.startswith("m’")):
                    warnings.append(f"Target '{entity_key}': pronominal verb 'je' form does not show reflexive pronoun: '{je_form}'.")

        # GATE 13: Detect exact duplicate proposed tables across unrelated infinitives
        fp = json.dumps([c.get("forms") for c in val], sort_keys=True)
        if fp in seen_conjugation_fingerprints:
            other_inf = seen_conjugation_fingerprints[fp]
            warnings.append(
                f"Duplicate conjugation table detected: '{entity_key}' shares exact forms with '{other_inf}'. Requires linguistic review."
            )
        else:
            seen_conjugation_fingerprints[fp] = entity_key

        staged_patches.append(patch)

    if errors:
        return "FAIL", {
            "status": "FAIL",
            "batch_id": batch_id,
            "gates_passed": gates_passed,
            "errors": errors,
            "warnings": warnings,
        }

    # GATE 14: In-memory dry run & full master schema validation
    cloned_dataset = copy.deepcopy(data)
    cloned_verbs_map = {v["infinitive"]: v for v in cloned_dataset["verbs"]}
    for patch in staged_patches:
        inf = patch["entity_key"]
        cloned_verbs_map[inf]["conjugations"] = normalize_conjugations_for_schema(patch["value"], inf)

    dry_run_schema_errors = validate_master_dataset_schema(cloned_dataset)
    if dry_run_schema_errors:
        errors.append(f"In-memory dry run failed master schema validation: {dry_run_schema_errors[:5]}")
        return "FAIL", {
            "status": "FAIL",
            "batch_id": batch_id,
            "gates_passed": gates_passed,
            "errors": errors,
            "warnings": warnings,
        }
    gates_passed.append("GATE_14_IN_MEMORY_SCHEMA_DRY_RUN")

    # Determine final verdict
    status = "REVIEW_REQUIRED" if warnings else "PASS"
    gates_passed.append("GATE_15_DETERMINISTIC_PASS")

    report = {
        "status": status,
        "batch_id": batch_id,
        "timestamp": datetime.now(timezone.utc).isoformat(),
        "validator_version": VALIDATOR_VERSION,
        "contract_version": CONTRACT_VERSION,
        "baseline_hash": actual_baseline_hash,
        "target_count": len(expected_targets),
        "patch_count": len(staged_patches),
        "no_proposal_count": len(no_proposals),
        "gates_passed": gates_passed,
        "errors": errors,
        "warnings": warnings,
    }

    # Write validation reports
    REPORTS_DIR.mkdir(parents=True, exist_ok=True)
    report_json_path = REPORTS_DIR / f"{batch_id}_VALIDATION_REPORT.json"
    with open(report_json_path, "w", encoding="utf-8") as f:
        json.dump(report, f, indent=2, ensure_ascii=False)

    report_txt_path = REPORTS_DIR / f"{batch_id}_VALIDATION_REPORT.txt"
    with open(report_txt_path, "w", encoding="utf-8") as f:
        f.write("=" * 78 + "\n")
        f.write(f"L'ÉTUDE HIGH-RISK VALIDATION REPORT: {batch_id}\n")
        f.write(f"Status: {status}\n")
        f.write(f"Timestamp: {report['timestamp']}\n")
        f.write(f"Baseline SHA-256: {actual_baseline_hash}\n")
        f.write("=" * 78 + "\n")
        f.write(f"Patches: {len(staged_patches)} | No Proposals: {len(no_proposals)}\n")
        f.write("\nGates Passed:\n")
        for g in gates_passed:
            f.write(f"  - {g}\n")
        if warnings:
            f.write("\nWarnings (Routing to REVIEW_REQUIRED):\n")
            for w in warnings:
                f.write(f"  - {w}\n")
        if errors:
            f.write("\nErrors (FAIL):\n")
            for e in errors:
                f.write(f"  - {e}\n")
        f.write("=" * 78 + "\n")

    # If PASS, emit validated payload
    VALIDATED_DIR.mkdir(parents=True, exist_ok=True)
    validated_file = VALIDATED_DIR / f"{batch_id}_VALIDATED.json"
    if status == "PASS":
        validated_payload = {
            "batch_id": batch_id,
            "collection": ACTIVE_COLLECTION,
            "contract_version": CONTRACT_VERSION,
            "baseline_hash": actual_baseline_hash,
            "validator_version": VALIDATOR_VERSION,
            "validated_at": report["timestamp"],
            "source_allowlist_version": SOURCE_ALLOWLIST_VERSION,
            "raw_response_hash": compute_file_sha256(response_path),
            "validation_report_hash": compute_file_sha256(report_json_path),
            "patches": staged_patches,
            "no_proposals": no_proposals,
            "summary": response_data.get("batch_summary", ""),
        }
        with open(validated_file, "w", encoding="utf-8") as f:
            json.dump(validated_payload, f, indent=2, ensure_ascii=False)
    else:
        if validated_file.exists():
            validated_file.unlink()

    return status, report


def main() -> None:
    parser = argparse.ArgumentParser(description="Validate high-risk enrichment response.")
    parser.add_argument("response_file", type=str, help="Path to response JSON file.")
    parser.add_argument("--baseline", type=str, default=None, help="Path to baseline dataset.")
    args = parser.parse_args()

    status, report = validate_response(Path(args.response_file), Path(args.baseline) if args.baseline else None)
    if status == "PASS":
        print(f"✅ PASS: Batch '{report['batch_id']}' passed all 15 validation gates.")
        print(f"   Validated output: {VALIDATED_DIR / (report['batch_id'] + '_VALIDATED.json')}")
        print(f"   Report: {REPORTS_DIR / (report['batch_id'] + '_VALIDATION_REPORT.json')}")
        sys.exit(0)
    elif status == "REVIEW_REQUIRED":
        print(f"⚠️ REVIEW_REQUIRED: Batch '{report['batch_id']}' requires human review.")
        for w in report.get("warnings", []):
            print(f"   Warning: {w}")
        sys.exit(2)
    else:
        print(f"❌ FAIL: Batch '{report['batch_id']}' failed validation.")
        for err in report.get("errors", []):
            print(f"   Error: {err}")
        sys.exit(1)


if __name__ == "__main__":
    main()
