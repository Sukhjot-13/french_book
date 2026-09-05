"""
High-Risk Review and Approval Tool (enrichment/high-risk/scripts/approve_high_risk.py)

Manages human approval workflows for validated high-risk enrichment batches.
Requires two named reviewer sign-offs (linguistic correctness and compliance/provenance)
and copies validated payloads to approved/ with complete audit trail.
"""

import argparse
import copy
import json
import sys
from datetime import datetime, timezone
from pathlib import Path
from typing import Any, Dict, Optional

REPO_ROOT = Path(__file__).resolve().parent.parent.parent.parent
HIGH_RISK_DIR = Path(__file__).resolve().parent.parent
for p in [str(REPO_ROOT), str(HIGH_RISK_DIR)]:
    if p not in sys.path:
        sys.path.insert(0, p)

from config.high_risk_config import (
    APPROVED_DIR,
    REJECTED_DIR,
    REPORTS_DIR,
    VALIDATED_DIR,
)
from scripts.high_risk_helpers import compute_file_sha256


def approve_batch(
    validated_path: Path,
    linguistic_reviewer: str,
    compliance_reviewer: str,
    notes: Optional[str] = None,
) -> Path:
    """Approves a validated batch with dual sign-off and writes to approved/."""
    if not validated_path.exists():
        raise FileNotFoundError(f"Validated file not found: {validated_path}")

    if not linguistic_reviewer or not linguistic_reviewer.strip():
        raise ValueError("Linguistic reviewer name/ID is required.")

    if not compliance_reviewer or not compliance_reviewer.strip():
        raise ValueError("Compliance reviewer name/ID is required.")
    if linguistic_reviewer.strip() == compliance_reviewer.strip():
        raise ValueError("Linguistic and compliance reviewers must be distinct people.")

    with open(validated_path, "r", encoding="utf-8") as f:
        val_data = json.load(f)

    batch_id = val_data["batch_id"]
    if val_data.get("collection") != "verbs" or val_data.get("validator_version") is None:
        raise ValueError("Only a validator-produced high-risk payload may be approved.")

    report_path = REPORTS_DIR / f"{batch_id}_VALIDATION_REPORT.json"
    if not report_path.exists():
        raise ValueError(f"Passing validation report is required: {report_path}")
    with open(report_path, "r", encoding="utf-8") as f:
        report = json.load(f)
    if report.get("status") != "PASS":
        raise ValueError("Only a PASS validation report may be approved.")
    if report.get("baseline_hash") != val_data.get("baseline_hash"):
        raise ValueError("Validation report and validated payload have different baselines.")

    approved_payload = copy.deepcopy(val_data)
    approved_payload["review_decision"] = {
        "status": "APPROVED",
        "decided_at": datetime.now(timezone.utc).isoformat(),
        "linguistic_reviewer": linguistic_reviewer.strip(),
        "compliance_reviewer": compliance_reviewer.strip(),
        "notes": notes or "Dual human review completed and approved.",
    }
    approved_payload["approval_integrity"] = {
        "validated_payload_hash": compute_file_sha256(validated_path),
        "validation_report_hash": compute_file_sha256(report_path),
    }

    APPROVED_DIR.mkdir(parents=True, exist_ok=True)
    approved_file = APPROVED_DIR / f"{batch_id}_APPROVED.json"

    with open(approved_file, "w", encoding="utf-8") as f:
        json.dump(approved_payload, f, indent=2, ensure_ascii=False)

    return approved_file


def reject_batch(
    validated_path: Path,
    reviewer: str,
    reason: str,
) -> Path:
    """Rejects a validated batch and records rejection report in rejected/."""
    if not validated_path.exists():
        raise FileNotFoundError(f"Validated file not found: {validated_path}")

    with open(validated_path, "r", encoding="utf-8") as f:
        val_data = json.load(f)

    batch_id = val_data["batch_id"]

    rejected_payload = copy.deepcopy(val_data)
    rejected_payload["review_decision"] = {
        "status": "REJECTED",
        "decided_at": datetime.now(timezone.utc).isoformat(),
        "reviewer": reviewer.strip(),
        "rejection_reason": reason.strip(),
    }

    REJECTED_DIR.mkdir(parents=True, exist_ok=True)
    rejected_file = REJECTED_DIR / f"{batch_id}_REJECTED.json"

    with open(rejected_file, "w", encoding="utf-8") as f:
        json.dump(rejected_payload, f, indent=2, ensure_ascii=False)

    return rejected_file


def main() -> None:
    parser = argparse.ArgumentParser(description="Approve or reject a validated high-risk batch.")
    parser.add_argument("validated_file", type=str, help="Path to *_VALIDATED.json file.")
    parser.add_argument("--linguist", type=str, default="", help="Name/ID of linguistic reviewer.")
    parser.add_argument("--compliance", type=str, default="", help="Name/ID of compliance reviewer.")
    parser.add_argument("--notes", type=str, default="", help="Review notes.")
    parser.add_argument("--reject", action="store_true", help="Reject batch instead of approving.")
    parser.add_argument("--reason", type=str, default="", help="Rejection reason if --reject is set.")
    args = parser.parse_args()

    try:
        val_path = Path(args.validated_file)
        if args.reject:
            if not args.reason:
                raise ValueError("Rejection requires --reason.")
            out_file = reject_batch(val_path, args.linguist or args.compliance or "Reviewer", args.reason)
            print(f"🛑 Batch rejected: written to {out_file}")
        else:
            if not args.linguist or not args.compliance:
                raise ValueError("Approval requires both --linguist and --compliance reviewer names.")
            out_file = approve_batch(val_path, args.linguist, args.compliance, args.notes)
            print(f"✅ Batch approved: written to {out_file}")
    except Exception as e:
        print(f"❌ Review action failed: {e}", file=sys.stderr)
        sys.exit(1)


if __name__ == "__main__":
    main()
