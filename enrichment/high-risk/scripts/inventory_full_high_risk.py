"""Inventory every configured high-risk gap in a baseline or derived dataset."""

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

from config.high_risk_config import HIGH_RISK_DATA_PATH, HIGH_RISK_FIELDS, REPORTS_DIR
from scripts.high_risk_helpers import (
    evaluate_verb_conjugation_status,
    load_baseline_dataset,
    load_conjugation_contract,
)


def _is_empty(value: Any) -> bool:
    """Returns whether a high-risk field is still empty."""
    return value is None or value == "" or value == [] or value == {}


def inventory_full_high_risk(
    dataset_path: Optional[Path] = None,
    *,
    emit_artifacts: bool = True,
    reports_dir: Path = REPORTS_DIR,
) -> Dict[str, Any]:
    """Counts empty high-risk slots, incomplete conjugations, and unresolved items."""
    selected_path = dataset_path
    if selected_path is None and HIGH_RISK_DATA_PATH.exists():
        selected_path = HIGH_RISK_DATA_PATH
    data, dataset_hash = load_baseline_dataset(selected_path)
    field_counts: Dict[str, Dict[str, int]] = {}
    empty_slots = 0
    for collection, fields in HIGH_RISK_FIELDS.items():
        entities = data.get(collection, [])
        field_counts[collection] = {}
        for field in fields:
            count = sum(1 for entity in entities if _is_empty(entity.get(field)))
            field_counts[collection][field] = count
            empty_slots += count

    contract = load_conjugation_contract()
    conjugation_statuses: Dict[str, int] = {}
    for verb in data.get("verbs", []):
        status, _ = evaluate_verb_conjugation_status(verb, contract)
        conjugation_statuses[status] = conjugation_statuses.get(status, 0) + 1
    incomplete_conjugations = sum(
        count for status, count in conjugation_statuses.items() if status != "COMPLETE"
    )
    unresolved_count = len(data.get("unresolved_items", []))
    report = {
        "timestamp": datetime.now(timezone.utc).isoformat(),
        "dataset_path": str(selected_path or "default baseline"),
        "dataset_hash": dataset_hash,
        "empty_high_risk_slot_count": empty_slots,
        "field_counts": field_counts,
        "conjugation_statuses": conjugation_statuses,
        "incomplete_conjugation_count": incomplete_conjugations,
        "unresolved_item_count": unresolved_count,
        "high_risk_complete": empty_slots == 0 and incomplete_conjugations == 0,
        "whole_dataset_review_complete": (
            empty_slots == 0 and incomplete_conjugations == 0 and unresolved_count == 0
        ),
    }
    if emit_artifacts:
        reports_dir.mkdir(parents=True, exist_ok=True)
        (reports_dir / "FULL_HIGH_RISK_INVENTORY.json").write_text(
            json.dumps(report, ensure_ascii=False, indent=2), encoding="utf-8"
        )
        lines = [
            "=" * 78,
            "L'ÉTUDE FULL HIGH-RISK INVENTORY",
            f"Empty high-risk slots: {empty_slots}",
            f"Incomplete conjugations: {incomplete_conjugations}",
            f"Unresolved source items: {unresolved_count}",
            f"High-risk complete: {'YES' if report['high_risk_complete'] else 'NO'}",
            f"Whole-dataset review complete: {'YES' if report['whole_dataset_review_complete'] else 'NO'}",
            "=" * 78,
        ]
        (reports_dir / "FULL_HIGH_RISK_INVENTORY.txt").write_text(
            "\n".join(lines) + "\n", encoding="utf-8"
        )
    return report


def main() -> None:
    """CLI entry point for final completion inventory."""
    parser = argparse.ArgumentParser(description="Inventory all high-risk enrichment gaps.")
    parser.add_argument("--dataset", type=Path, default=None)
    parser.add_argument("--require-complete", action="store_true")
    args = parser.parse_args()
    report = inventory_full_high_risk(args.dataset)
    print(f"Empty high-risk slots: {report['empty_high_risk_slot_count']}")
    print(f"Incomplete conjugations: {report['incomplete_conjugation_count']}")
    print(f"Unresolved source items: {report['unresolved_item_count']}")
    if args.require_complete and not report["high_risk_complete"]:
        raise SystemExit(2)


if __name__ == "__main__":
    main()
