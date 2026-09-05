"""
High-Risk Inventory and Preflight Tool (enrichment/high-risk/scripts/inventory_high_risk.py)

Read-only inventory and preflight auditor. Evaluates the baseline dataset against
MASTER_SCHEMA.json and conjugation_contract.json. Classifies all verbs as
COMPLETE, MISSING, PARTIAL, MALFORMED, UNSUPPORTED, or REQUIRES_REVIEW,
and categorizes targets by morphological risk.
"""

import argparse
import json
import sys
from collections import Counter
from datetime import datetime, timezone
from pathlib import Path
from typing import Any, Dict, List, Optional

REPO_ROOT = Path(__file__).resolve().parent.parent.parent.parent
HIGH_RISK_DIR = Path(__file__).resolve().parent.parent
for p in [str(REPO_ROOT), str(HIGH_RISK_DIR)]:
    if p not in sys.path:
        sys.path.insert(0, p)

from config.high_risk_config import (
    CONTRACT_VERSION,
    REPORTS_DIR,
)
from scripts.high_risk_helpers import (
    classify_morphological_type,
    evaluate_verb_conjugation_status,
    load_baseline_dataset,
    load_conjugation_contract,
    validate_master_dataset_schema,
)


def run_inventory(baseline_path: Optional[Path] = None) -> Dict[str, Any]:
    """Runs complete preflight inventory on baseline dataset and writes reports."""
    data, baseline_hash = load_baseline_dataset(baseline_path)
    contract = load_conjugation_contract()

    if contract.get("version") != CONTRACT_VERSION:
        raise ValueError(
            f"Contract version mismatch: expected {CONTRACT_VERSION}, got {contract.get('version')}"
        )

    # 1. Validate baseline schema
    schema_errors = validate_master_dataset_schema(data)
    if schema_errors:
        raise ValueError(f"Baseline dataset failed schema validation: {schema_errors[:5]}")

    verbs = data.get("verbs", [])
    if not verbs:
        raise ValueError("Baseline dataset contains 0 verbs in 'verbs' collection.")

    # 2. Check for duplicate natural keys (infinitive)
    infinitives: List[str] = []
    seen_infinitives = set()
    duplicates = []
    for v in verbs:
        inf = v.get("infinitive")
        if not inf:
            duplicates.append("<MISSING_OR_EMPTY_INFINITIVE>")
        elif inf in seen_infinitives:
            duplicates.append(inf)
        else:
            seen_infinitives.add(inf)
        infinitives.append(inf or "")

    if duplicates:
        raise ValueError(f"Duplicate or empty verb natural keys detected: {duplicates}")

    # 3. Classify every verb
    status_counts: Counter = Counter()
    morphology_counts: Counter = Counter()
    verb_inventory: List[Dict[str, Any]] = []

    for v in verbs:
        inf = v["infinitive"]
        status, reasons = evaluate_verb_conjugation_status(v, contract)
        morphology = classify_morphological_type(v, contract)

        status_counts[status] += 1
        morphology_counts[morphology] += 1

        conjs = v.get("conjugations")
        conj_count = len(conjs) if isinstance(conjs, list) else 0

        verb_inventory.append({
            "infinitive": inf,
            "verb_group": v.get("verb_group"),
            "regularity": v.get("regularity"),
            "auxiliary": v.get("auxiliary"),
            "morphological_type": morphology,
            "status": status,
            "reasons": reasons,
            "current_conjugation_count": conj_count,
        })

    inventory_result = {
        "timestamp": datetime.now(timezone.utc).isoformat(),
        "contract_version": CONTRACT_VERSION,
        "baseline_hash": baseline_hash,
        "total_verbs": len(verbs),
        "status_summary": dict(status_counts),
        "morphology_summary": dict(morphology_counts),
        "missing_count": status_counts.get("MISSING", 0),
        "complete_count": status_counts.get("COMPLETE", 0),
        "partial_count": status_counts.get("PARTIAL", 0),
        "malformed_count": status_counts.get("MALFORMED", 0),
        "unsupported_count": status_counts.get("UNSUPPORTED", 0),
        "requires_review_count": status_counts.get("REQUIRES_REVIEW", 0),
        "verbs": verb_inventory,
    }

    # 4. Emit inventory.json and human-readable text report
    REPORTS_DIR.mkdir(parents=True, exist_ok=True)
    json_path = REPORTS_DIR / "inventory.json"
    with open(json_path, "w", encoding="utf-8") as f:
        json.dump(inventory_result, f, indent=2, ensure_ascii=False)

    txt_path = REPORTS_DIR / "inventory_report.txt"
    with open(txt_path, "w", encoding="utf-8") as f:
        f.write("=" * 78 + "\n")
        f.write("L'ÉTUDE HIGH-RISK ENRICHMENT PREFLIGHT INVENTORY REPORT\n")
        f.write(f"Generated: {inventory_result['timestamp']}\n")
        f.write(f"Baseline Dataset SHA-256: {baseline_hash}\n")
        f.write(f"Conjugation Contract Version: {CONTRACT_VERSION}\n")
        f.write("=" * 78 + "\n\n")

        f.write(f"Total Verbs in Dataset: {len(verbs)}\n")
        f.write("\nStatus Breakdown:\n")
        for s, count in sorted(status_counts.items()):
            pct = (count / len(verbs)) * 100
            f.write(f"  - {s:<18}: {count:>4} ({pct:>5.1f}%)\n")

        f.write("\nMorphological Breakdown:\n")
        for m, count in sorted(morphology_counts.items()):
            pct = (count / len(verbs)) * 100
            f.write(f"  - {m:<18}: {count:>4} ({pct:>5.1f}%)\n")

        if status_counts.get("PARTIAL", 0) > 0:
            f.write("\nPartial Verbs Requiring Manual Review Mode (Excluded from Fill-Only):\n")
            for item in verb_inventory:
                if item["status"] == "PARTIAL":
                    f.write(f"  - {item['infinitive']}: {item['reasons']}\n")

        if status_counts.get("MALFORMED", 0) > 0:
            f.write("\nMalformed Verbs (BLOCKING):\n")
            for item in verb_inventory:
                if item["status"] == "MALFORMED":
                    f.write(f"  - {item['infinitive']}: {item['reasons']}\n")

        f.write("\n" + "=" * 78 + "\n")

    return inventory_result


def main() -> None:
    parser = argparse.ArgumentParser(description="Run high-risk inventory and preflight check.")
    parser.add_argument("--baseline", type=str, default=None, help="Path to baseline dataset JSON.")
    args = parser.parse_args()

    try:
        res = run_inventory(Path(args.baseline) if args.baseline else None)
        print(f"✅ Inventory complete: {res['total_verbs']} verbs evaluated.")
        print(f"   - COMPLETE: {res['complete_count']}")
        print(f"   - MISSING:  {res['missing_count']}")
        print(f"   - PARTIAL:  {res['partial_count']}")
        print(f"   - Baseline: {res['baseline_hash']}")
        print(f"   - Reports written to: {REPORTS_DIR / 'inventory.json'}")
    except Exception as e:
        print(f"❌ Inventory failed: {e}", file=sys.stderr)
        sys.exit(1)


if __name__ == "__main__":
    main()
