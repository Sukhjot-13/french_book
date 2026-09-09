"""Bulk-validate all available complete high-risk queue responses."""

import argparse
import json
import sys
from datetime import datetime, timezone
from pathlib import Path
from typing import Any, Dict, Optional

REPO_ROOT = Path(__file__).resolve().parent.parent.parent.parent
HIGH_RISK_DIR = Path(__file__).resolve().parent.parent
for path in (str(REPO_ROOT), str(HIGH_RISK_DIR)):
    if path not in sys.path:
        sys.path.insert(0, path)

from config.high_risk_config import (
    BATCH_MANIFEST_PATH,
    REPORTS_DIR,
    RESPONSES_DIR,
    VALIDATED_DIR,
)
from scripts.validate_full_high_risk_response import validate_full_queue_response


def process_response_folder(
    response_dir: Path = RESPONSES_DIR,
    baseline_path: Optional[Path] = None,
    reports_dir: Path = REPORTS_DIR,
    validated_dir: Path = VALIDATED_DIR,
) -> Dict[str, Any]:
    """Validates current-manifest responses and writes an aggregate summary."""
    manifest = json.loads(BATCH_MANIFEST_PATH.read_text(encoding="utf-8"))
    expected_ids = set(manifest.get("batches", {}))
    response_paths = {
        path.name.removesuffix("_RESPONSE.json"): path
        for path in response_dir.glob("*_RESPONSE.json")
    }
    current_paths = {batch_id: path for batch_id, path in response_paths.items() if batch_id in expected_ids}
    missing_ids = sorted(expected_ids - current_paths.keys())
    unexpected_ids = sorted(response_paths.keys() - expected_ids)

    results: Dict[str, Any] = {}
    pass_count = 0
    fail_count = 0
    proposal_count = 0
    no_proposal_count = 0
    for batch_id in sorted(current_paths):
        status, report = validate_full_queue_response(
            current_paths[batch_id],
            baseline_path,
            emit_artifacts=True,
            reports_dir=reports_dir,
            validated_dir=validated_dir,
        )
        results[batch_id] = {
            "status": status,
            "proposal_count": report.get("proposal_count", 0),
            "no_proposal_count": report.get("no_proposal_count", 0),
            "errors": report.get("errors", []),
        }
        if status == "PASS":
            pass_count += 1
            proposal_count += report.get("proposal_count", 0)
            no_proposal_count += report.get("no_proposal_count", 0)
        else:
            fail_count += 1

    summary = {
        "timestamp": datetime.now(timezone.utc).isoformat(),
        "queue_version": manifest.get("version"),
        "baseline_hash": manifest.get("baseline_hash"),
        "total_batches": len(expected_ids),
        "responses_found": len(current_paths),
        "missing_response_count": len(missing_ids),
        "missing_response_ids": missing_ids,
        "unexpected_response_count": len(unexpected_ids),
        "unexpected_response_ids": unexpected_ids,
        "pass_count": pass_count,
        "fail_count": fail_count,
        "validated_proposal_count": proposal_count,
        "validated_no_proposal_count": no_proposal_count,
        "ready_for_review": (
            len(missing_ids) == 0
            and len(unexpected_ids) == 0
            and fail_count == 0
            and no_proposal_count == 0
        ),
        "results": results,
    }
    reports_dir.mkdir(parents=True, exist_ok=True)
    (reports_dir / "FULL_QUEUE_VALIDATION_SUMMARY.json").write_text(
        json.dumps(summary, ensure_ascii=False, indent=2), encoding="utf-8"
    )
    lines = [
        "=" * 78,
        "L'ÉTUDE COMPLETE HIGH-RISK RESPONSE SUMMARY",
        f"Responses: {len(current_paths)}/{len(expected_ids)}",
        f"PASS: {pass_count} | FAIL: {fail_count}",
        f"Validated proposals: {proposal_count}",
        f"No proposals (remaining gaps): {no_proposal_count}",
        f"Ready for review: {'YES' if summary['ready_for_review'] else 'NO'}",
        "=" * 78,
    ]
    (reports_dir / "FULL_QUEUE_VALIDATION_SUMMARY.txt").write_text(
        "\n".join(lines) + "\n", encoding="utf-8"
    )
    return summary


def main() -> None:
    """CLI entry point for incremental or final response-folder processing."""
    parser = argparse.ArgumentParser(description="Validate complete high-risk queue responses in bulk.")
    parser.add_argument("--responses", type=Path, default=RESPONSES_DIR)
    parser.add_argument("--baseline", type=Path, default=None)
    parser.add_argument("--require-complete", action="store_true")
    args = parser.parse_args()
    summary = process_response_folder(args.responses, args.baseline)
    print(f"Responses: {summary['responses_found']}/{summary['total_batches']}")
    print(f"PASS: {summary['pass_count']} | FAIL: {summary['fail_count']}")
    print(f"No proposals: {summary['validated_no_proposal_count']}")
    if summary["fail_count"]:
        raise SystemExit(1)
    if args.require_complete and not summary["ready_for_review"]:
        raise SystemExit(2)


if __name__ == "__main__":
    main()
