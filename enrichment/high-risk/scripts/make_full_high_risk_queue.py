"""Generate the complete high-risk enrichment/review queue from one baseline.

This producer deliberately creates proposals only. Field-specific validators
and applicators remain the authority for whether a proposed change can merge.
"""

import argparse
import json
import sys
from datetime import datetime, timezone
from pathlib import Path
from typing import Any, Dict, Iterable, List, Optional

REPO_ROOT = Path(__file__).resolve().parent.parent.parent.parent
HIGH_RISK_DIR = Path(__file__).resolve().parent.parent
for path in (str(REPO_ROOT), str(HIGH_RISK_DIR)):
    if path not in sys.path:
        sys.path.insert(0, path)

from config.high_risk_config import BATCHES_DIR, HIGH_RISK_FIELDS, NATURAL_KEYS
from scripts.high_risk_helpers import compute_content_sha256, load_baseline_dataset

MANIFEST_PATH = BATCHES_DIR / "BATCH_MANIFEST.json"
BATCH_SIZES = {"verbs": 5, "vocabulary": 10, "expressions": 10, "grammar_rules": 10,
               "tenses": 8, "exceptions_and_traps": 10}
CONTEXT_FIELDS = ("english", "definition", "description", "summary", "usage", "mood",
                  "category", "verb_group", "auxiliary", "regularity", "part_of_speech",
                  "canonical_form", "rule_name", "title", "name", "chapter_number")


def is_empty(value: Any) -> bool:
    """Returns whether a high-risk field has no value to preserve."""
    return value is None or value == "" or value == [] or value == {}


def entity_key(collection: str, entity: Dict[str, Any]) -> Any:
    """Returns the configured scalar or composite natural key."""
    fields = NATURAL_KEYS[collection]
    return {field: entity.get(field) for field in fields} if isinstance(fields, list) else entity.get(fields)


def chunks(items: List[Dict[str, Any]], size: int) -> Iterable[List[Dict[str, Any]]]:
    """Yields deterministic fixed-size entity chunks."""
    for index in range(0, len(items), size):
        yield items[index:index + size]


def context(collection: str, field: str, entity: Dict[str, Any]) -> Dict[str, Any]:
    """Builds compact, non-authoritative context for one proposed target."""
    result = {"entity_key": entity_key(collection, entity), "field": field,
              "current_value": entity.get(field)}
    for name in CONTEXT_FIELDS:
        if name in entity and name not in result:
            result[name] = entity[name]
    return result


def prompt(batch_id: str, collection: str, field: str, mode: str, baseline_hash: str,
           targets: List[Dict[str, Any]]) -> str:
    """Formats one self-contained high-risk proposal batch instruction file."""
    return f"""================================================================================
L'ÉTUDE — COMPLETE HIGH-RISK ENRICHMENT BATCH: {batch_id}
================================================================================
Collection: {collection}
Field: {field}
Mode: {mode}
Baseline SHA-256: {baseline_hash}
Expected response: {batch_id}_RESPONSE.json
Validator: scripts/validate_full_high_risk_response.py

ROLE AND SCOPE
Return proposals for ONLY the listed entities and ONLY the listed field. Existing
source-derived values are immutable. Do not add entities, alter natural keys,
delete data, fabricate evidence, browse the web, or infer unsupported facts.

AI-CANDIDATE POLICY
Generate a best-effort candidate value when you can do so confidently from
French linguistic knowledge. Every generated value is UNVERIFIED and will be
checked later; it is not source-derived data and cannot be applied directly to
the learner-facing dataset. Return NO_PROPOSAL only for genuine uncertainty,
conflicting forms, or an incomplete existing field.

MODE RULES
- FILL_ONLY: propose a value only when current_value is null, empty string,
  empty array, or empty object. Do not modify non-empty values.
- REPAIR_REVIEW_ONLY: do not propose an automatic mutation. Describe the exact
  missing/ambiguous structure and return NO_PROPOSAL until a human has approved
  a field-specific repair contract.

RESPONSE JSON CONTRACT
{{
  "batch_id": "{batch_id}",
  "collection": "{collection}",
  "field": "{field}",
  "mode": "{mode}",
  "baseline_hash": "{baseline_hash}",
  "candidate_provenance": "AI_GENERATED_UNVERIFIED",
  "proposals": [
    {{"entity_key": "<exact natural key from target>", "value": "<contract-valid value>",
      "evidence": {{"source_id": "AI_GENERATED_UNVERIFIED", "evidence_sha256": null, "notes": "Brief rationale and uncertainty, if any."}}}}
  ],
  "no_proposals": [
    {{"entity_key": "<exact natural key from target>", "reason": "SOURCE_NOT_FOUND|CONFLICTING_SOURCES|INSUFFICIENT_EVIDENCE|PARTIAL_EXISTING_DATA", "details": ""}}
  ]
}}

TARGETS
{json.dumps(targets, ensure_ascii=False, indent=2)}
================================================================================
"""


def build_queue(baseline_path: Optional[Path] = None) -> Dict[str, Any]:
    """Creates fresh batches for every missing high-risk field and review gap."""
    data, baseline_hash = load_baseline_dataset(baseline_path)
    BATCHES_DIR.mkdir(parents=True, exist_ok=True)
    manifest: Dict[str, Any] = {"version": "2.0.0", "baseline_hash": baseline_hash,
                                "created_at": datetime.now(timezone.utc).isoformat(), "batches": {}}
    sequence = 1

    for collection, fields in HIGH_RISK_FIELDS.items():
        entities = data.get(collection, [])
        for field in fields:
            targets = [context(collection, field, entity) for entity in entities if is_empty(entity.get(field))]
            for local_number, group in enumerate(chunks(targets, BATCH_SIZES.get(collection, 10)), start=1):
                batch_id = f"{sequence:03d}_{collection}_{field}_fill_{local_number:03d}"
                content = prompt(batch_id, collection, field, "FILL_ONLY", baseline_hash, group)
                (BATCHES_DIR / f"{batch_id}.txt").write_text(content, encoding="utf-8")
                manifest["batches"][batch_id] = {"batch_id": batch_id, "collection": collection,
                    "field": field, "mode": "FILL_ONLY", "baseline_hash": baseline_hash,
                    "batch_checksum": compute_content_sha256(content),
                    "target_keys": [item["entity_key"] for item in group]}
                sequence += 1

    # Partial conjugation data is ineligible for fill-only mutation but must be
    # visible in the complete queue so it cannot be mistaken for completion.
    partials = [context("verbs", "conjugations", entity) for entity in data.get("verbs", [])
                if isinstance(entity.get("conjugations"), list) and entity.get("conjugations")]
    for local_number, group in enumerate(chunks(partials, BATCH_SIZES["verbs"]), start=1):
        batch_id = f"{sequence:03d}_verbs_conjugations_repair_{local_number:03d}"
        content = prompt(batch_id, "verbs", "conjugations", "REPAIR_REVIEW_ONLY", baseline_hash, group)
        (BATCHES_DIR / f"{batch_id}.txt").write_text(content, encoding="utf-8")
        manifest["batches"][batch_id] = {"batch_id": batch_id, "collection": "verbs",
            "field": "conjugations", "mode": "REPAIR_REVIEW_ONLY", "baseline_hash": baseline_hash,
            "batch_checksum": compute_content_sha256(content),
            "target_keys": [item["entity_key"] for item in group]}
        sequence += 1

    MANIFEST_PATH.write_text(json.dumps(manifest, ensure_ascii=False, indent=2), encoding="utf-8")
    return manifest


def main() -> None:
    """CLI entry point for generating the fresh full high-risk queue."""
    parser = argparse.ArgumentParser(description="Generate every high-risk enrichment batch.")
    parser.add_argument("--baseline", type=Path, default=None, help="Optional baseline JSON path.")
    args = parser.parse_args()
    manifest = build_queue(args.baseline)
    print(f"Generated {len(manifest['batches'])} high-risk batches from {manifest['baseline_hash']}.")


if __name__ == "__main__":
    main()
