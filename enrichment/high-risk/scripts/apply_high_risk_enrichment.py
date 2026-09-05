"""
High-Risk Applicator (enrichment/high-risk/scripts/apply_high_risk_enrichment.py)

Transaction-safe applicator for approved high-risk enrichment batches.
Creates timestamped backups, enforces fill-only preconditions at apply time,
validates staged datasets against MASTER_SCHEMA.json, atomically writes to
enrichment/HIGH_RISK_DATA_ENRICHED.json, and writes immutable audit logs.
"""

import argparse
import copy
import json
import os
import shutil
import sys
import tempfile
from datetime import datetime, timezone
from pathlib import Path
from typing import Any, Dict, List, Optional, Tuple

REPO_ROOT = Path(__file__).resolve().parent.parent.parent.parent
HIGH_RISK_DIR = Path(__file__).resolve().parent.parent
for p in [str(REPO_ROOT), str(HIGH_RISK_DIR)]:
    if p not in sys.path:
        sys.path.insert(0, p)

from config.high_risk_config import (
    APPLICATOR_VERSION,
    APPROVED_DIR,
    AUDITS_DIR,
    BACKUPS_DIR,
    CONTRACT_VERSION,
    HIGH_RISK_DATA_PATH,
    MASTER_DATA_PATH,
    MASTER_SCHEMA_PATH,
    NORMAL_ENRICHED_DATA_PATH,
    REPORTS_DIR,
    RESPONSES_DIR,
)
from scripts.high_risk_helpers import (
    compute_content_sha256,
    compute_file_sha256,
    load_baseline_dataset,
    normalize_conjugations_for_schema,
    validate_master_dataset_schema,
)
from scripts.validate_high_risk_response import validate_response


def state_path_for(output_path: Path) -> Path:
    """Returns the adjacent provenance state file for one high-risk output."""
    return output_path.with_name(f"{output_path.stem}_STATE.json")


def apply_approved_batch(
    approved_file: Path,
    output_path: Optional[Path] = None,
    baseline_path: Optional[Path] = None,
) -> Dict[str, Any]:
    """
    Applies an approved high-risk patch file with complete rollback safety.
    Returns audit dictionary on success.
    """
    if not approved_file.exists():
        raise FileNotFoundError(f"Approved batch file not found: {approved_file}")

    target_output = Path(output_path) if output_path else HIGH_RISK_DATA_PATH

    # CRITICAL INVARIANT: Never overwrite immutable source or normal enrichment output
    if target_output.resolve() == MASTER_DATA_PATH.resolve():
        raise PermissionError(f"FATAL: Attempted write to immutable source data: {MASTER_DATA_PATH}")
    if target_output.resolve() == NORMAL_ENRICHED_DATA_PATH.resolve():
        raise PermissionError(f"FATAL: Attempted write to normal enrichment dataset: {NORMAL_ENRICHED_DATA_PATH}")

    with open(approved_file, "r", encoding="utf-8") as f:
        approved_data = json.load(f)

    # Re-verify approval status
    review_decision = approved_data.get("review_decision", {})
    if review_decision.get("status") != "APPROVED":
        raise ValueError(f"Batch '{approved_data.get('batch_id')}' does not have APPROVED status.")
    if not review_decision.get("linguistic_reviewer") or not review_decision.get("compliance_reviewer"):
        raise ValueError("Batch lacks required dual reviewer signatures.")
    if review_decision["linguistic_reviewer"] == review_decision["compliance_reviewer"]:
        raise ValueError("Batch reviewers must be distinct.")

    batch_id = approved_data["batch_id"]

    # An approval is valid only when it still exactly refers to the current
    # validated payload and its passing validation report.
    integrity = approved_data.get("approval_integrity", {})
    validated_file = APPROVED_DIR.parent / "validated" / f"{batch_id}_VALIDATED.json"
    report_file = REPORTS_DIR / f"{batch_id}_VALIDATION_REPORT.json"
    if not integrity or not validated_file.exists() or not report_file.exists():
        raise ValueError("Approved batch lacks the required validated-payload/report integrity chain.")
    if integrity.get("validated_payload_hash") != compute_file_sha256(validated_file):
        raise ValueError("Validated payload has changed since approval.")
    if integrity.get("validation_report_hash") != compute_file_sha256(report_file):
        raise ValueError("Validation report has changed since approval.")
    with open(report_file, "r", encoding="utf-8") as f:
        validation_report = json.load(f)
    if validation_report.get("status") != "PASS":
        raise ValueError("Batch does not have a passing validation report.")

    # Re-run the authoritative validator immediately before application. This
    # rejects stale baselines, changed evidence, tampered responses, and any
    # approval chain that was fabricated without a valid raw response.
    raw_response = RESPONSES_DIR / f"{batch_id}_RESPONSE.json"
    fresh_status, _ = validate_response(raw_response, baseline_path)
    if fresh_status != "PASS":
        raise ValueError("Approved batch did not pass fresh pre-application validation.")

    _, current_baseline_hash = load_baseline_dataset(baseline_path)
    if approved_data.get("baseline_hash") != current_baseline_hash:
        raise ValueError("Approved batch baseline is stale; regenerate, revalidate, and reapprove it.")

    # 1. Determine working base dataset
    # If high-risk derived dataset already exists on disk, build upon it;
    # otherwise, start from normal enriched dataset or master data.
    output_state_path = state_path_for(target_output)
    if target_output.exists():
        if not output_state_path.exists():
            raise ValueError("Existing high-risk output has no provenance state; do not build on it. Rebuild from a verified baseline.")
        with open(output_state_path, "r", encoding="utf-8") as f:
            output_state = json.load(f)
        if output_state.get("root_baseline_hash") != current_baseline_hash:
            raise ValueError("Existing high-risk output was created from a different baseline.")
        working_base_path = target_output
        with open(working_base_path, "r", encoding="utf-8") as f:
            staged_data = json.load(f)
        input_hash = compute_file_sha256(working_base_path)
    else:
        staged_data, input_hash = load_baseline_dataset(baseline_path)

    # 2. Revalidate baseline / contract versions
    if approved_data.get("contract_version") != CONTRACT_VERSION:
        raise ValueError(
            f"Contract version mismatch: batch has {approved_data.get('contract_version')}, system requires {CONTRACT_VERSION}"
        )

    # 3. Create timestamped backup of existing target output if present
    BACKUPS_DIR.mkdir(parents=True, exist_ok=True)
    backup_file = None
    if target_output.exists():
        ts_str = datetime.now(timezone.utc).strftime("%Y%m%d_%H%M%S")
        backup_file = BACKUPS_DIR / f"{target_output.stem}_{ts_str}.json"
        shutil.copy2(target_output, backup_file)

    # 4. Apply patches in memory
    verbs = staged_data.get("verbs", [])
    verbs_by_inf = {v["infinitive"]: v for v in verbs}

    applied_keys: List[str] = []
    skipped_existing: List[str] = []

    for patch in approved_data.get("patches", []):
        inf = patch["entity_key"]
        if inf not in verbs_by_inf:
            raise ValueError(f"Verb '{inf}' not found in staged dataset.")

        verb_entry = verbs_by_inf[inf]
        current_conjs = verb_entry.get("conjugations")

        # GATE 7 re-enforced at apply time (fill-only invariant)
        if current_conjs not in [None, []]:
            skipped_existing.append(inf)
            continue

        verb_entry["conjugations"] = normalize_conjugations_for_schema(patch["value"], inf)
        applied_keys.append(inf)

    # 5. Schema validation on the full staged dataset
    schema_errors = validate_master_dataset_schema(staged_data)
    if schema_errors:
        raise ValueError(f"Staged dataset failed master schema validation: {schema_errors[:5]}")

    # 6. Atomic write
    target_output.parent.mkdir(parents=True, exist_ok=True)
    temp_fd, temp_path = tempfile.mkstemp(
        dir=str(target_output.parent),
        prefix=f".{target_output.name}.tmp_",
    )
    with os.fdopen(temp_fd, "w", encoding="utf-8") as f:
        json.dump(staged_data, f, indent=2, ensure_ascii=False)

    os.replace(temp_path, target_output)
    output_hash = compute_file_sha256(target_output)
    if not output_state_path.exists():
        with open(output_state_path, "w", encoding="utf-8") as f:
            json.dump({"root_baseline_hash": current_baseline_hash, "created_by": APPLICATOR_VERSION}, f, indent=2)

    # 7. Immutable audit record
    AUDITS_DIR.mkdir(parents=True, exist_ok=True)
    audit_record = {
        "batch_id": batch_id,
        "applied_at": datetime.now(timezone.utc).isoformat(),
        "applicator_version": APPLICATOR_VERSION,
        "contract_version": CONTRACT_VERSION,
        "input_hash": input_hash,
        "output_hash": output_hash,
        "target_output_file": str(target_output),
        "backup_file": str(backup_file) if backup_file else None,
        "applied_count": len(applied_keys),
        "applied_keys": applied_keys,
        "skipped_existing_count": len(skipped_existing),
        "skipped_existing_keys": skipped_existing,
        "no_proposal_count": len(approved_data.get("no_proposals", [])),
        "review_decision": review_decision,
    }

    audit_file = AUDITS_DIR / f"{batch_id}_AUDIT.json"
    with open(audit_file, "w", encoding="utf-8") as f:
        json.dump(audit_record, f, indent=2, ensure_ascii=False)

    # 8. Human-readable applied report
    REPORTS_DIR.mkdir(parents=True, exist_ok=True)
    report_file = REPORTS_DIR / f"{batch_id}_APPLIED_REPORT.txt"
    with open(report_file, "w", encoding="utf-8") as f:
        f.write("=" * 78 + "\n")
        f.write(f"L'ÉTUDE HIGH-RISK ENRICHMENT APPLICATION REPORT: {batch_id}\n")
        f.write(f"Timestamp: {audit_record['applied_at']}\n")
        f.write(f"Applicator Version: {APPLICATOR_VERSION}\n")
        f.write(f"Target Output: {target_output}\n")
        f.write(f"Input SHA-256:  {input_hash}\n")
        f.write(f"Output SHA-256: {output_hash}\n")
        if backup_file:
            f.write(f"Backup Created: {backup_file}\n")
        f.write("=" * 78 + "\n\n")
        f.write(f"Applied Verbs ({len(applied_keys)}):\n")
        for k in applied_keys:
            f.write(f"  + {k}\n")
        if skipped_existing:
            f.write(f"\nSkipped Existing Verbs ({len(skipped_existing)}):\n")
            for k in skipped_existing:
                f.write(f"  * {k} (already populated, skipped per fill-only rule)\n")
        f.write("\nReviewers:\n")
        f.write(f"  - Linguistic: {review_decision.get('linguistic_reviewer')}\n")
        f.write(f"  - Compliance: {review_decision.get('compliance_reviewer')}\n")
        f.write(f"  - Notes:      {review_decision.get('notes')}\n")
        f.write("=" * 78 + "\n")

    return audit_record


def main() -> None:
    parser = argparse.ArgumentParser(description="Apply approved high-risk batch.")
    parser.add_argument("approved_file", type=str, help="Path to *_APPROVED.json file.")
    parser.add_argument("--output", type=str, default=None, help="Explicit safe target output path.")
    parser.add_argument("--baseline", type=str, default=None, help="Explicit baseline dataset path.")
    args = parser.parse_args()

    try:
        audit = apply_approved_batch(
            Path(args.approved_file),
            Path(args.output) if args.output else None,
            Path(args.baseline) if args.baseline else None,
        )
        print(f"✅ Successfully applied batch '{audit['batch_id']}':")
        print(f"   Applied: {audit['applied_count']} verbs")
        print(f"   Skipped: {audit['skipped_existing_count']} verbs")
        print(f"   Output:  {audit['target_output_file']}")
        print(f"   Hash:    {audit['output_hash']}")
        print(f"   Audit:   {AUDITS_DIR / (audit['batch_id'] + '_AUDIT.json')}")
    except Exception as e:
        print(f"❌ Application failed: {e}", file=sys.stderr)
        sys.exit(1)


if __name__ == "__main__":
    main()
