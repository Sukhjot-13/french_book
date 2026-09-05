"""
High-Risk Preview and Dry-Run Diff Generator (enrichment/high-risk/scripts/preview_high_risk.py)

Generates human-readable entity-by-entity diffs for validated high-risk patches
against the baseline dataset.
"""

import argparse
import json
import sys
from pathlib import Path
from typing import Any, Dict, List, Optional

REPO_ROOT = Path(__file__).resolve().parent.parent.parent.parent
HIGH_RISK_DIR = Path(__file__).resolve().parent.parent
for p in [str(REPO_ROOT), str(HIGH_RISK_DIR)]:
    if p not in sys.path:
        sys.path.insert(0, p)

from config.high_risk_config import REPORTS_DIR, VALIDATED_DIR
from scripts.high_risk_helpers import load_baseline_dataset


def generate_preview(
    validated_file: Path,
    baseline_path: Optional[Path] = None,
) -> str:
    """Generates preview text and writes reports for a validated batch."""
    with open(validated_file, "r", encoding="utf-8") as f:
        val_data = json.load(f)

    data, baseline_hash = load_baseline_dataset(baseline_path)
    verbs_by_inf = {v["infinitive"]: v for v in data.get("verbs", [])}

    batch_id = val_data["batch_id"]
    patches = val_data.get("patches", [])
    no_proposals = val_data.get("no_proposals", [])

    lines: List[str] = []
    lines.append("=" * 78)
    lines.append(f"L'ÉTUDE HIGH-RISK PREVIEW & DRY-RUN DIFF: {batch_id}")
    lines.append(f"Baseline SHA-256: {baseline_hash}")
    lines.append(f"Patches: {len(patches)} | No Proposals: {len(no_proposals)}")
    lines.append("=" * 78 + "\n")

    for idx, patch in enumerate(patches):
        inf = patch["entity_key"]
        baseline_v = verbs_by_inf.get(inf, {})
        current_conjs = baseline_v.get("conjugations", [])

        lines.append(f"--- ENTITY #{idx + 1}: {inf} ---")
        lines.append(f"  Field: {patch['field']}")
        lines.append(f"  Operation: {patch['operation']}")
        lines.append(f"  Evidence: {patch.get('evidence', {}).get('source_id')}")
        lines.append(f"  Before: {len(current_conjs)} conjugations")
        lines.append(f"  After:  {len(patch['value'])} conjugations\n")

        lines.append("  Proposed Conjugation Matrix:")
        for c in patch["value"]:
            tense = c.get("tense")
            mood = c.get("mood")
            forms = c.get("forms", {})
            lines.append(f"    [{mood}/{tense}]")
            for person, val in forms.items():
                if val is not None:
                    lines.append(f"      {person:<15}: {val}")
        lines.append("")

    if no_proposals:
        lines.append("--- NO PROPOSALS ---")
        for np in no_proposals:
            lines.append(f"  - {np['entity_key']}: {np['reason']} ({np.get('details')})")
        lines.append("")

    lines.append("=" * 78)
    preview_text = "\n".join(lines)

    REPORTS_DIR.mkdir(parents=True, exist_ok=True)
    report_file = REPORTS_DIR / f"{batch_id}_PREVIEW.txt"
    with open(report_file, "w", encoding="utf-8") as f:
        f.write(preview_text)

    return preview_text


def main() -> None:
    parser = argparse.ArgumentParser(description="Generate preview diff for validated high-risk patch.")
    parser.add_argument("validated_file", type=str, help="Path to *_VALIDATED.json file.")
    parser.add_argument("--baseline", type=str, default=None, help="Path to baseline dataset.")
    args = parser.parse_args()

    try:
        txt = generate_preview(Path(args.validated_file), Path(args.baseline) if args.baseline else None)
        print(txt)
    except Exception as e:
        print(f"❌ Preview generation failed: {e}", file=sys.stderr)
        sys.exit(1)


if __name__ == "__main__":
    main()
