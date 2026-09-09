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

from config.high_risk_config import NATURAL_KEYS, REPORTS_DIR, VALIDATED_DIR
from scripts.high_risk_helpers import load_baseline_dataset


def _key_token(key: Any) -> str:
    """Returns a stable token for scalar or composite natural keys."""
    return json.dumps(key, ensure_ascii=False, sort_keys=True, separators=(",", ":"))


def _entity_key(collection: str, entity: Dict[str, Any]) -> Any:
    """Extracts a collection-specific natural key."""
    fields = NATURAL_KEYS[collection]
    if isinstance(fields, list):
        return {field: entity.get(field) for field in fields}
    return entity.get(fields)


def _find_entity(data: Dict[str, Any], collection: str, key: Any) -> Dict[str, Any]:
    """Resolves an entity by scalar or composite natural key."""
    target = _key_token(key)
    return next(
        (entity for entity in data.get(collection, []) if _key_token(_entity_key(collection, entity)) == target),
        {},
    )


def generate_preview(
    validated_file: Path,
    baseline_path: Optional[Path] = None,
) -> str:
    """Generates preview text and writes reports for a validated batch."""
    with open(validated_file, "r", encoding="utf-8") as f:
        val_data = json.load(f)

    data, baseline_hash = load_baseline_dataset(baseline_path)
    batch_id = val_data["batch_id"]
    collection = val_data.get("collection", "verbs")
    field = val_data.get("field", "conjugations")
    patches = val_data.get("patches", [])
    no_proposals = val_data.get("no_proposals", [])

    lines: List[str] = []
    lines.append("=" * 78)
    lines.append(f"L'ÉTUDE HIGH-RISK PREVIEW & DRY-RUN DIFF: {batch_id}")
    lines.append(f"Baseline SHA-256: {baseline_hash}")
    lines.append(f"Patches: {len(patches)} | No Proposals: {len(no_proposals)}")
    lines.append("=" * 78 + "\n")

    for idx, patch in enumerate(patches):
        key = patch["entity_key"]
        baseline_entity = _find_entity(data, collection, key)
        patch_field = patch.get("field", field)
        current_value = baseline_entity.get(patch_field)

        lines.append(f"--- ENTITY #{idx + 1}: {key} ---")
        lines.append(f"  Collection: {collection}")
        lines.append(f"  Field: {patch_field}")
        lines.append(f"  Mode/Operation: {val_data.get('mode', patch.get('operation'))}")
        lines.append(f"  Evidence: {patch.get('evidence', {}).get('source_id')}")
        lines.append(f"  Before: {json.dumps(current_value, ensure_ascii=False, sort_keys=True)}")
        lines.append(f"  After:  {json.dumps(patch['value'], ensure_ascii=False, sort_keys=True)}")
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
