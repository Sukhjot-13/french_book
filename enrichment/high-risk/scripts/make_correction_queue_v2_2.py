"""Create a separate, immutable correction queue from v2.1 validation results.

The queue deliberately does not alter the frozen v2.1 batches or manifest.  It
packages only failed conjugation-repair targets and strict-gate NO_PROPOSAL
targets into practical, manually transferable prompt files.  Its repair
prompts are review-only because the current v2.1 preservation rule cannot
canonicalize malformed partial conjugation records.
"""

import argparse
import json
import sys
from collections import defaultdict
from datetime import datetime, timezone
from pathlib import Path
from typing import Any, Dict, Iterable, List, Optional

REPO_ROOT = Path(__file__).resolve().parent.parent.parent.parent
HIGH_RISK_DIR = Path(__file__).resolve().parent.parent
for path in (str(REPO_ROOT), str(HIGH_RISK_DIR)):
    if path not in sys.path:
        sys.path.insert(0, path)

from config.high_risk_config import BATCH_MANIFEST_PATH, REPORTS_DIR, RESPONSES_DIR
from scripts.high_risk_helpers import compute_content_sha256, load_baseline_dataset, load_conjugation_contract
from scripts.make_full_high_risk_queue import context, field_value_schema


CORRECTION_QUEUE_VERSION = "2.2.0-draft"
DEFAULT_OUTPUT_DIR = HIGH_RISK_DIR / "batches" / "corrections-v2.2"
SUMMARY_PATH = REPORTS_DIR / "FULL_QUEUE_VALIDATION_SUMMARY.json"
REPAIR_BATCH_SIZE = 12
EXPRESSION_BATCH_SIZE = 25
RESPONSE_RELATIVE_DIR = Path("enrichment/high-risk/responses/corrections-v2.2")
VERB_REPAIR_CONTEXT_FIELDS = (
    "infinitive", "english", "verb_group", "auxiliary", "regularity",
    "transitivity", "past_participle", "present_participle", "stems",
)
EXPRESSION_RETRY_CONTEXT_FIELDS = (
    "canonical_form", "english", "pattern", "prepositions",
    "complement_structure", "restrictions", "transformations", "base_verb",
    "expression_type", "register",
)


def chunks(items: List[Dict[str, Any]], size: int) -> Iterable[List[Dict[str, Any]]]:
    """Yields deterministic, fixed-size groups for manual worker handoff."""
    for index in range(0, len(items), size):
        yield items[index:index + size]


def key_token(value: Any) -> str:
    """Creates a stable lookup token for scalar or composite natural keys."""
    return json.dumps(value, ensure_ascii=False, sort_keys=True, separators=(",", ":"))


def find_entity(data: Dict[str, Any], collection: str, entity_key: Any) -> Dict[str, Any]:
    """Returns one baseline entity by the same natural key used by v2.1 batches."""
    expected = key_token(entity_key)
    for entity in data.get(collection, []):
        candidate = context(collection, "_unused_", entity)["entity_key"]
        if key_token(candidate) == expected:
            return entity
    raise ValueError(f"No {collection} entity exists for correction target {entity_key!r}")


def correction_context(collection: str, field: str, entity: Dict[str, Any]) -> Dict[str, Any]:
    """Returns only context necessary for one field-specific correction prompt."""
    if (collection, field) == ("verbs", "conjugations"):
        fields = VERB_REPAIR_CONTEXT_FIELDS
    elif collection == "expressions":
        fields = EXPRESSION_RETRY_CONTEXT_FIELDS
    else:
        fields = tuple(entity)
    current_value = entity.get(field)
    result = {
        "entity_key": context(collection, field, entity)["entity_key"],
        "field": field,
        "current_value": current_value,
        "related_context": {name: entity[name] for name in fields if name in entity and name != field},
    }
    if (collection, field) == ("verbs", "conjugations") and isinstance(current_value, list):
        evidence_digest = []
        sanitized_records = []
        for index, record in enumerate(current_value):
            if not isinstance(record, dict):
                sanitized_records.append(record)
                continue
            sources = record.get("sources", [])
            sanitized_records.append({name: value for name, value in record.items() if name != "sources"})
            evidence_digest.append({
                "record_index": index,
                "mood": record.get("mood"),
                "tense": record.get("tense"),
                "source_count": len(sources) if isinstance(sources, list) else None,
                "sources_sha256": compute_content_sha256(json.dumps(sources, ensure_ascii=False, sort_keys=True)),
            })
        result["current_value"] = sanitized_records
        result["immutable_source_evidence_digest"] = evidence_digest
    return result


def repair_instructions(contract: Dict[str, Any]) -> str:
    """Formats the explicit, draft-only canonicalization contract for repairs."""
    canonical = [
        {"mood": item["mood"], "tense": item["tense"], "required_forms": item["required_forms"]}
        for item in contract["canonical_tenses"]
    ]
    return f"""REPAIR-SPECIFIC REQUIREMENTS
This is a v2.2 DRAFT correction proposal. It is NOT compatible with the current
v2.1 validator or applicator and cannot be merged until a separately reviewed
repair policy is implemented. Do not place this response in the ordinary
`enrichment/high-risk/responses/` directory.

The failure in every target is caused by partial or noncanonical existing
conjugation records. Produce one complete canonical replacement list:
- use exactly the canonical mood/tense pairs below;
- provide every required non-null person form unless the verb is genuinely
  impersonal or defective under the existing contract;
- do not retain duplicate or noncanonical records merely to preserve their
  spelling;
- do not repeat, invent, or modify source-evidence objects. Every existing
  record's evidence is represented by an immutable SHA-256 digest in TARGETS;
  a future reviewed v2.2 repair script must rebind the exact baseline source
  objects to the appropriate canonical records;
- set each output record's `sources` array to `[]`; it is schema-valid staging
  data, not a replacement for the baseline's immutable source evidence;
- state any normalization or ambiguity in `evidence.notes`.

CANONICAL MOOD/TENSE/FORM REQUIREMENTS
{json.dumps(canonical, ensure_ascii=False, indent=2)}
"""


def fill_instructions() -> str:
    """Formats strict no-gap requirements for retrying previous NO_PROPOSAL targets."""
    return """RETRY-SPECIFIC REQUIREMENTS
Every target previously returned `NO_PROPOSAL` with `INSUFFICIENT_EVIDENCE`.
Return a non-empty, schema-valid proposal for EVERY target in this batch.
Do not emit `NO_PROPOSAL`: it will leave the strict queue incomplete. Use only
the listed field and preserve all non-target context exactly. If genuine
ambiguity remains, describe the constrained choice and uncertainty in
`evidence.notes` for human linguistic review rather than omitting the target.
"""


def prompt(
    batch_id: str,
    collection: str,
    field: str,
    remediation_type: str,
    baseline_hash: str,
    source_batch_ids: List[str],
    targets: List[Dict[str, Any]],
    value_schema: Dict[str, Any],
    contract: Dict[str, Any],
) -> str:
    """Builds one self-contained correction prompt with a strict response envelope."""
    special = repair_instructions(contract) if remediation_type == "CANONICAL_REPAIR_DRAFT" else fill_instructions()
    response_name = f"{batch_id}_RESPONSE.json"
    return f"""================================================================================
L'ÉTUDE — HIGH-RISK CORRECTION QUEUE {CORRECTION_QUEUE_VERSION}: {batch_id}
================================================================================
Collection: {collection}
Field: {field}
Remediation type: {remediation_type}
Baseline SHA-256: {baseline_hash}
Source v2.1 batches: {", ".join(source_batch_ids)}

YOU MAY DO
Return exactly one JSON response for this prompt. Propose values only for the
listed natural keys and the single named field. Preserve French spelling,
diacritics, grammatical gender, agreement, and source objects. This is a
candidate for later independent linguistic and provenance review.

YOU MAY NOT DO
Do not alter source or baseline datasets, existing frozen v2.1 batches, the
v2.1 manifest, natural keys, non-target fields, or any entity outside TARGETS.
Do not browse, claim unverified external sources, invent citations, include
Markdown, or create files other than the response JSON.

{special}

RESPONSE DESTINATION
Save exactly one file named `{response_name}` to:
`{RESPONSE_RELATIVE_DIR}/{response_name}`
Never overwrite a file in `enrichment/high-risk/responses/` directly. The
response remains staged until a dedicated v2.2 validator is reviewed.

RESPONSE JSON ENVELOPE (no extra top-level keys)
{json.dumps({
    "batch_id": batch_id,
    "correction_queue_version": CORRECTION_QUEUE_VERSION,
    "collection": collection,
    "field": field,
    "remediation_type": remediation_type,
    "baseline_hash": baseline_hash,
    "source_v2_1_batch_ids": source_batch_ids,
    "candidate_provenance": "AI_GENERATED_UNVERIFIED",
    "proposals": [{"entity_key": "<exact key from TARGETS>", "value": "<schema-valid value>", "evidence": {"source_id": "AI_GENERATED_UNVERIFIED", "evidence_sha256": None, "notes": "Brief rationale, retained evidence, and uncertainty."}}],
    "no_proposals": [],
}, ensure_ascii=False, indent=2)}

FIELD VALUE SCHEMA (AUTHORITATIVE)
{json.dumps(value_schema, ensure_ascii=False, indent=2)}

TARGETS
{json.dumps(targets, ensure_ascii=False, indent=2)}
================================================================================
"""


def load_failure_targets(
    summary: Dict[str, Any], manifest: Dict[str, Any], data: Dict[str, Any]
) -> List[Dict[str, Any]]:
    """Collects failed v2.1 repair targets with their exact validation errors."""
    targets: List[Dict[str, Any]] = []
    for source_id, result in sorted(summary["results"].items()):
        if result.get("status") != "FAIL":
            continue
        entry = manifest["batches"].get(source_id)
        if not entry or entry.get("mode") != "COMPLETE_PARTIAL_REVIEW":
            raise ValueError(f"Unexpected non-repair failure in {source_id}")
        for entity_key in entry["target_keys"]:
            entity = find_entity(data, entry["collection"], entity_key)
            target = correction_context(entry["collection"], entry["field"], entity)
            target["source_v2_1_batch_id"] = source_id
            target["validation_errors"] = [
                error for error in result.get("errors", [])
                if f"Target {entity_key!r}:" in error
            ]
            targets.append(target)
    return targets


def load_no_proposal_targets(
    summary: Dict[str, Any], manifest: Dict[str, Any], data: Dict[str, Any]
) -> Dict[tuple[str, str], List[Dict[str, Any]]]:
    """Collects strict-gate NO_PROPOSAL targets from their original responses."""
    grouped: Dict[tuple[str, str], List[Dict[str, Any]]] = defaultdict(list)
    for source_id, result in sorted(summary["results"].items()):
        if not result.get("no_proposal_count"):
            continue
        entry = manifest["batches"].get(source_id)
        response_path = RESPONSES_DIR / f"{source_id}_RESPONSE.json"
        response = json.loads(response_path.read_text(encoding="utf-8"))
        for no_proposal in response.get("no_proposals", []):
            entity_key = no_proposal["entity_key"]
            entity = find_entity(data, entry["collection"], entity_key)
            target = correction_context(entry["collection"], entry["field"], entity)
            target["source_v2_1_batch_id"] = source_id
            target["previous_no_proposal"] = no_proposal
            grouped[(entry["collection"], entry["field"])].append(target)
    return grouped


def write_handoff(output_dir: Path, manifest: Dict[str, Any]) -> None:
    """Writes an operational guide for manual workers or a coordinator AI."""
    text = f"""# High-Risk Correction Queue {CORRECTION_QUEUE_VERSION}

This queue contains only the 30 v2.1 failed conjugation-repair source batches
and the 254 strict-gate `NO_PROPOSAL` targets. It does not modify or supersede
the frozen v2.1 queue.

## Locations

- Prompts: `enrichment/high-risk/batches/corrections-v2.2/`
- Correction manifest: `enrichment/high-risk/batches/corrections-v2.2/CORRECTION_MANIFEST.json`
- Raw worker responses: `{RESPONSE_RELATIVE_DIR}/`
- Future v2.2 reports: `enrichment/high-risk/reports/corrections-v2.2/`
- Future v2.2 validated candidates: `enrichment/high-risk/validated/corrections-v2.2/`
- Future v2.2 approvals: `enrichment/high-risk/approved/corrections-v2.2/`

## Coordinator / subagent handoff prompt

> Assign one subagent one `*.txt` prompt at a time from
> `enrichment/high-risk/batches/corrections-v2.2/`. The subagent must read the
> entire prompt, produce exactly one JSON response matching its envelope, and
> save it only to the exact path stated in that prompt under
> `{RESPONSE_RELATIVE_DIR}/`. It must never modify `data/MASTER_DATA.json`,
> `enrichment/MASTER_DATA_ENRICHED.json`, frozen v2.1 batches or manifest, or
> files outside its assigned response. Return every target as a proposal and
> keep `no_proposals` empty. The coordinator checks that each expected response
> exists and preserves the prompt's source-batch traceability.

## Important repair limitation

The repair prompts are deliberately marked `CANONICAL_REPAIR_DRAFT`. The v2.1
validator requires malformed partial records to be both unchanged and
canonical, which is impossible. Do not copy these staged responses into the
ordinary v2.1 response folder. A separately reviewed v2.2 repair-policy,
validator, and application path must exist before they can be validated or
applied.

## Queue contents

- Correction batches: {len(manifest['batches'])}
- Source failed repair batches: {len(manifest['source_failed_batch_ids'])}
- Retried NO_PROPOSAL targets: {manifest['source_no_proposal_target_count']}
"""
    (output_dir / "HANDOFF.md").write_text(text, encoding="utf-8")


def build_correction_queue(
    output_dir: Path = DEFAULT_OUTPUT_DIR,
    baseline_path: Optional[Path] = None,
    replace_generated: bool = False,
) -> Dict[str, Any]:
    """Creates the standalone correction prompts and immutable local manifest."""
    if output_dir.exists() and any(output_dir.iterdir()):
        if not replace_generated:
            raise FileExistsError(f"Refusing to overwrite non-empty correction queue: {output_dir}")
        existing_manifest_path = output_dir / "CORRECTION_MANIFEST.json"
        if not existing_manifest_path.is_file():
            raise FileExistsError("Correction output has no manifest; refusing to replace unknown files")
        existing_manifest = json.loads(existing_manifest_path.read_text(encoding="utf-8"))
        expected_names = {
            "CORRECTION_MANIFEST.json", "HANDOFF.md",
            *(f"{batch_id}.txt" for batch_id in existing_manifest.get("batches", {})),
        }
        actual_names = {path.name for path in output_dir.iterdir()}
        if existing_manifest.get("version") != CORRECTION_QUEUE_VERSION or actual_names != expected_names:
            raise FileExistsError("Correction output contains unrecognized files; refusing to replace it")
        for path in output_dir.iterdir():
            path.unlink()
    summary = json.loads(SUMMARY_PATH.read_text(encoding="utf-8"))
    manifest = json.loads(BATCH_MANIFEST_PATH.read_text(encoding="utf-8"))
    data, baseline_hash = load_baseline_dataset(baseline_path)
    if baseline_hash != summary.get("baseline_hash") or baseline_hash != manifest.get("baseline_hash"):
        raise ValueError("Baseline hash does not match the frozen v2.1 queue and validation summary")

    master_schema = json.loads((REPO_ROOT / "data" / "MASTER_SCHEMA.json").read_text(encoding="utf-8"))
    contract = load_conjugation_contract()
    repair_targets = load_failure_targets(summary, manifest, data)
    retry_targets = load_no_proposal_targets(summary, manifest, data)
    output_dir.mkdir(parents=True, exist_ok=True)
    (HIGH_RISK_DIR / "responses" / "corrections-v2.2").mkdir(parents=True, exist_ok=True)
    for stage in ("reports", "validated", "approved", "audits"):
        (HIGH_RISK_DIR / stage / "corrections-v2.2").mkdir(parents=True, exist_ok=True)

    correction_manifest: Dict[str, Any] = {
        "version": CORRECTION_QUEUE_VERSION,
        "created_at": datetime.now(timezone.utc).isoformat(),
        "baseline_hash": baseline_hash,
        "source_v2_1_queue_version": manifest.get("version"),
        "source_v2_1_manifest_sha256": compute_content_sha256(BATCH_MANIFEST_PATH.read_text(encoding="utf-8")),
        "source_validation_summary_sha256": compute_content_sha256(SUMMARY_PATH.read_text(encoding="utf-8")),
        "source_failed_batch_ids": [batch_id for batch_id, result in summary["results"].items() if result.get("status") == "FAIL"],
        "source_no_proposal_target_count": sum(result.get("no_proposal_count", 0) for result in summary["results"].values()),
        "batches": {},
    }

    sequence = 1
    repair_schema = field_value_schema(master_schema, "verbs", "conjugations")
    for local_number, group in enumerate(chunks(repair_targets, REPAIR_BATCH_SIZE), start=1):
        batch_id = f"C22_{sequence:03d}_verbs_conjugations_repair_{local_number:03d}"
        source_ids = sorted({item["source_v2_1_batch_id"] for item in group})
        content = prompt(batch_id, "verbs", "conjugations", "CANONICAL_REPAIR_DRAFT", baseline_hash,
                         source_ids, group, repair_schema, contract)
        path = output_dir / f"{batch_id}.txt"
        path.write_text(content, encoding="utf-8")
        correction_manifest["batches"][batch_id] = {
            "collection": "verbs", "field": "conjugations", "remediation_type": "CANONICAL_REPAIR_DRAFT",
            "source_v2_1_batch_ids": source_ids, "target_keys": [item["entity_key"] for item in group],
            "batch_sha256": compute_content_sha256(content), "response_destination": str(RESPONSE_RELATIVE_DIR / f"{batch_id}_RESPONSE.json"),
        }
        sequence += 1

    for (collection, field), targets in sorted(retry_targets.items()):
        size = EXPRESSION_BATCH_SIZE if collection == "expressions" and field == "pattern_slots" else 10
        value_schema = field_value_schema(master_schema, collection, field)
        for local_number, group in enumerate(chunks(targets, size), start=1):
            batch_id = f"C22_{sequence:03d}_{collection}_{field}_retry_{local_number:03d}"
            source_ids = sorted({item["source_v2_1_batch_id"] for item in group})
            content = prompt(batch_id, collection, field, "FILL_RETRY", baseline_hash,
                             source_ids, group, value_schema, contract)
            path = output_dir / f"{batch_id}.txt"
            path.write_text(content, encoding="utf-8")
            correction_manifest["batches"][batch_id] = {
                "collection": collection, "field": field, "remediation_type": "FILL_RETRY",
                "source_v2_1_batch_ids": source_ids, "target_keys": [item["entity_key"] for item in group],
                "batch_sha256": compute_content_sha256(content), "response_destination": str(RESPONSE_RELATIVE_DIR / f"{batch_id}_RESPONSE.json"),
            }
            sequence += 1

    (output_dir / "CORRECTION_MANIFEST.json").write_text(
        json.dumps(correction_manifest, ensure_ascii=False, indent=2) + "\n", encoding="utf-8"
    )
    write_handoff(output_dir, correction_manifest)
    return correction_manifest


def main() -> None:
    """CLI entry point for the isolated v2.2 correction-queue generator."""
    parser = argparse.ArgumentParser(description="Generate a separate v2.2 high-risk correction queue.")
    parser.add_argument("--output", type=Path, default=DEFAULT_OUTPUT_DIR)
    parser.add_argument("--baseline", type=Path, default=None)
    parser.add_argument("--replace-generated", action="store_true", help="Replace only a verified prior correction queue at --output.")
    args = parser.parse_args()
    manifest = build_correction_queue(args.output, args.baseline, args.replace_generated)
    print(f"Generated {len(manifest['batches'])} correction batches at {args.output}.")
    print(f"Failed repair source batches: {len(manifest['source_failed_batch_ids'])}")
    print(f"Retried NO_PROPOSAL targets: {manifest['source_no_proposal_target_count']}")


if __name__ == "__main__":
    main()
