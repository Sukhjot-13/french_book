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
MASTER_SCHEMA_PATH = REPO_ROOT / "data" / "MASTER_SCHEMA.json"
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
    """Builds target context including every existing non-target field."""
    result = {"entity_key": entity_key(collection, entity), "field": field,
              "current_value": entity.get(field)}
    result["related_context"] = {
        name: value for name, value in entity.items()
        if name != field
    }
    return result


def resolve_schema_references(schema: Any, definitions: Dict[str, Any], stack: tuple[str, ...] = ()) -> Any:
    """Inlines local ``#/$defs`` references for an AI-readable field contract."""
    if isinstance(schema, list):
        return [resolve_schema_references(item, definitions, stack) for item in schema]
    if not isinstance(schema, dict):
        return schema

    reference = schema.get("$ref")
    if isinstance(reference, str) and reference.startswith("#/$defs/"):
        name = reference.removeprefix("#/$defs/")
        if name in definitions and name not in stack:
            resolved = resolve_schema_references(definitions[name], definitions, (*stack, name))
            siblings = {key: value for key, value in schema.items() if key != "$ref"}
            return {**resolved, **resolve_schema_references(siblings, definitions, stack)}

    return {
        key: resolve_schema_references(value, definitions, stack)
        for key, value in schema.items()
    }


def field_value_schema(master_schema: Dict[str, Any], collection: str, field: str) -> Dict[str, Any]:
    """Returns the fully resolved JSON Schema fragment for one target field."""
    definitions = master_schema.get("$defs", {})
    collection_schema = resolve_schema_references(
        master_schema["properties"][collection]["items"], definitions
    )
    field_schema = collection_schema["properties"][field]
    return resolve_schema_references(field_schema, definitions)


def prompt(batch_id: str, collection: str, field: str, mode: str, baseline_hash: str,
           targets: List[Dict[str, Any]], value_schema: Dict[str, Any]) -> str:
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
    {{"entity_key": "<exact natural key from target>", "value": "<value conforming exactly to FIELD VALUE SCHEMA below>",
      "evidence": {{"source_id": "AI_GENERATED_UNVERIFIED", "evidence_sha256": null, "notes": "Brief rationale and uncertainty, if any."}}}}
  ],
  "no_proposals": [
    {{"entity_key": "<exact natural key from target>", "reason": "SOURCE_NOT_FOUND|CONFLICTING_SOURCES|INSUFFICIENT_EVIDENCE|PARTIAL_EXISTING_DATA", "details": ""}}
  ]
}}

FIELD VALUE SCHEMA (AUTHORITATIVE)
The proposal `value` MUST conform exactly to this resolved JSON Schema. Honor
every declared type, enum, required property, item shape, and nullability. Do
not add properties not permitted by the schema. An empty array is a valid
proposal only when it is meaningful for the field and target; it is not a
substitute for uncertain content.
{json.dumps(value_schema, ensure_ascii=False, indent=2)}

TARGET CONTEXT RULES
- Every target includes `related_context`, the complete existing record except
  for the empty target field. Use it to preserve consistency with related
  fields, but never alter, repeat, or overwrite it.
- Propose only information supported by the target context or confident French
  linguistic knowledge. If the schema-valid value is genuinely uncertain, use
  the controlled `NO_PROPOSAL` entry instead of guessing.

TARGETS
{json.dumps(targets, ensure_ascii=False, indent=2)}
================================================================================
"""


def build_queue(baseline_path: Optional[Path] = None) -> Dict[str, Any]:
    """Creates fresh batches for every missing high-risk field and review gap."""
    data, baseline_hash = load_baseline_dataset(baseline_path)
    master_schema = json.loads(MASTER_SCHEMA_PATH.read_text(encoding="utf-8"))
    BATCHES_DIR.mkdir(parents=True, exist_ok=True)
    manifest: Dict[str, Any] = {"version": "2.0.0", "baseline_hash": baseline_hash,
                                "created_at": datetime.now(timezone.utc).isoformat(), "batches": {}}
    sequence = 1

    for collection, fields in HIGH_RISK_FIELDS.items():
        entities = data.get(collection, [])
        for field in fields:
            value_schema = field_value_schema(master_schema, collection, field)
            targets = [context(collection, field, entity) for entity in entities if is_empty(entity.get(field))]
            for local_number, group in enumerate(chunks(targets, BATCH_SIZES.get(collection, 10)), start=1):
                batch_id = f"{sequence:03d}_{collection}_{field}_fill_{local_number:03d}"
                content = prompt(batch_id, collection, field, "FILL_ONLY", baseline_hash, group, value_schema)
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
    conjugation_schema = field_value_schema(master_schema, "verbs", "conjugations")
    for local_number, group in enumerate(chunks(partials, BATCH_SIZES["verbs"]), start=1):
        batch_id = f"{sequence:03d}_verbs_conjugations_repair_{local_number:03d}"
        content = prompt(
            batch_id, "verbs", "conjugations", "REPAIR_REVIEW_ONLY", baseline_hash,
            group, conjugation_schema
        )
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
