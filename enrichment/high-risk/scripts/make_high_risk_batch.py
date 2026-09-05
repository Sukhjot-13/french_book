"""
High-Risk Batch Generator (enrichment/high-risk/scripts/make_high_risk_batch.py)

Generates deterministic TXT batch prompts and updates BATCH_MANIFEST.json
for high-risk verbs.conjugations enrichment. Enforces fill-only preconditions
and morphological segregation.
"""

import argparse
import json
import sys
from datetime import datetime, timezone
from pathlib import Path
from typing import Any, Dict, List, Optional

REPO_ROOT = Path(__file__).resolve().parent.parent.parent.parent
HIGH_RISK_DIR = Path(__file__).resolve().parent.parent
for p in [str(REPO_ROOT), str(HIGH_RISK_DIR)]:
    if p not in sys.path:
        sys.path.insert(0, p)

from config.high_risk_config import (
    ACTIVE_COLLECTION,
    ACTIVE_HIGH_RISK_FIELD,
    ALLOWED_OPERATIONS,
    BATCH_MANIFEST_PATH,
    BATCHES_DIR,
    CONTRACT_VERSION,
    DEFAULT_BATCH_SIZE,
    GENERATOR_VERSION,
    MAX_BATCH_SIZE,
    SOURCE_ALLOWLIST_VERSION,
)
from scripts.high_risk_helpers import (
    classify_morphological_type,
    compute_content_sha256,
    evaluate_verb_conjugation_status,
    load_baseline_dataset,
    load_conjugation_contract,
    load_trusted_sources,
)


def format_batch_txt(
    batch_id: str,
    baseline_hash: str,
    targets: List[Dict[str, Any]],
    contract: Dict[str, Any],
    trusted_sources: Dict[str, Any],
) -> str:
    """Formats deterministic batch prompt text for worker."""
    expected_response_filename = f"{batch_id}_RESPONSE.json"

    allowed_sources_summary = "\n".join(
        f"- ID: {s['source_id']} | Name: {s['name']} | Type: {s['source_type']} | Allowed: {', '.join(s['allowed_fields'])}"
        for s in trusted_sources.get("sources", [])
    )

    tenses_summary = "\n".join(
        f"- Mood: {t['mood']}, Tense: {t['tense']} (Required persons: {', '.join(t['required_forms'])})"
        for t in contract.get("canonical_tenses", [])
    )

    targets_text = "\n\n".join(
        f"TARGET #{idx + 1}:\n"
        f"  Infinitive: {t['infinitive']}\n"
        f"  Verb Group: {t.get('verb_group') or 'unknown'}\n"
        f"  Regularity: {t.get('regularity') or 'unknown'}\n"
        f"  Auxiliary: {t.get('auxiliary') or 'unknown'}\n"
        f"  Morphological Risk: {t['morphological_type']}\n"
        f"  Precondition: Field 'conjugations' is strictly EMPTY."
        for idx, t in enumerate(targets)
    )

    sample_patch = {
        "entity_key": targets[0]["infinitive"] if targets else "parler",
        "field": "conjugations",
        "operation": "set_if_missing_complete",
        "precondition": {
            "field_state": "EMPTY"
        },
        "evidence": {
            "source_id": "bescherelle_la_conjugaison_pour_tous",
            "source_type": "reference_lexicon",
            "reference_notes": "Standard 1st group regular paradigm verified."
        },
        "value": [
            {
                "tense": "présent",
                "mood": "indicative",
                "forms": {
                    "je": "...",
                    "tu": "...",
                    "il_elle_on": "...",
                    "nous": "...",
                    "vous": "...",
                    "ils_elles": "...",
                    "imperative_tu": None,
                    "imperative_nous": None,
                    "imperative_vous": None,
                    "impersonal_form": None
                },
                "stems": [],
                "endings": ["e", "es", "e", "ons", "ez", "ent"],
                "formation_note": None,
                "irregularities": [],
                "notes": [],
                "sources": [
                    {
                        "source_name": "Bescherelle",
                        "source_type": "reference_lexicon"
                    }
                ]
            }
        ]
    }

    sample_no_proposal = {
        "entity_key": "exemple_verb",
        "reason": "SOURCE_NOT_FOUND",
        "details": "No attested paradigm in trusted sources allowlist."
    }

    txt = f"""================================================================================
L'ÉTUDE HIGH-RISK CONJUGATION ENRICHMENT BATCH: {batch_id}
================================================================================
Collection: {ACTIVE_COLLECTION}
Field: {ACTIVE_HIGH_RISK_FIELD}
Generator Version: {GENERATOR_VERSION}
Contract Version: {CONTRACT_VERSION}
Source Allowlist Version: {SOURCE_ALLOWLIST_VERSION}
Baseline Dataset SHA-256: {baseline_hash}
Expected Response File: responses/{expected_response_filename}

IMPORTANT RULES & INVARIANTS:
1. You must respond with EXACTLY ONE valid JSON file.
2. No markdown wrappers, no prose, no code fences. Output pure raw JSON.
3. Every target verb listed below must have either:
   - Exactly one entry in 'patches' with operation 'set_if_missing_complete'
     backed by allowlisted trusted evidence; OR
   - Exactly one entry in 'no_proposals' with a controlled reason.
4. Do not touch any field other than '{ACTIVE_HIGH_RISK_FIELD}'.
5. Do not propose changes to verbs that already have conjugations.
6. All accents and diacritics must be strictly preserved.
7. 'All tenses' is not informal: every canonical tense below must be present.

MANDATORY CANONICAL TENSES TO SUPPLY:
{tenses_summary}

ALLOWED TRUSTED SOURCES (MUST CITE ONE):
{allowed_sources_summary}

TARGET VERBS IN THIS BATCH:
{targets_text}

JSON RESPONSE TEMPLATE:
{{
  "batch_id": "{batch_id}",
  "collection": "{ACTIVE_COLLECTION}",
  "contract_version": "{CONTRACT_VERSION}",
  "baseline_hash": "{baseline_hash}",
  "source_allowlist_version": "{SOURCE_ALLOWLIST_VERSION}",
  "patches": [
    {json.dumps(sample_patch, indent=4, ensure_ascii=False)}
  ],
  "no_proposals": [
    {json.dumps(sample_no_proposal, indent=4, ensure_ascii=False)}
  ],
  "batch_summary": "Summary of proposed conjugations and citations."
}}
================================================================================
"""
    return txt


def generate_batch(
    morphology: str = "regular_er",
    batch_size: int = DEFAULT_BATCH_SIZE,
    batch_num: int = 1,
    infinitive: Optional[str] = None,
    baseline_path: Optional[Path] = None,
) -> Dict[str, Any]:
    """Generates a high-risk batch and records manifest entry."""
    if batch_size > MAX_BATCH_SIZE:
        raise ValueError(f"Batch size {batch_size} exceeds maximum {MAX_BATCH_SIZE}.")

    data, baseline_hash = load_baseline_dataset(baseline_path)
    contract = load_conjugation_contract()
    trusted_sources = load_trusted_sources()

    verbs = data.get("verbs", [])
    if not verbs:
        raise ValueError("No verbs found in baseline dataset.")

    # Load existing manifest to find already batched targets
    BATCHES_DIR.mkdir(parents=True, exist_ok=True)
    manifest: Dict[str, Any] = {"version": "1.0.0", "batches": {}}
    if BATCH_MANIFEST_PATH.exists():
        with open(BATCH_MANIFEST_PATH, "r", encoding="utf-8") as f:
            manifest = json.load(f)

    already_batched = set()
    for b_data in manifest.get("batches", {}).values():
        for t in b_data.get("target_keys", []):
            already_batched.add(t)

    # Filter eligible targets: MUST be status == MISSING
    eligible: List[Dict[str, Any]] = []
    for v in verbs:
        inf = v.get("infinitive", "")
        if not inf or inf in already_batched:
            continue

        status, _ = evaluate_verb_conjugation_status(v, contract)
        if status != "MISSING":
            continue

        m_type = classify_morphological_type(v, contract)
        if infinitive and inf == infinitive:
            eligible.append({**v, "morphological_type": m_type})
            break
        elif not infinitive and (morphology == "all" or m_type == morphology):
            eligible.append({**v, "morphological_type": m_type})

    if not eligible:
        raise ValueError(f"No eligible MISSING verbs found for criteria (morphology={morphology}, infinitive={infinitive}).")

    selected = eligible[:batch_size]
    batch_id = f"{batch_num:03d}_verbs_conjugations_batch_{batch_num:03d}"

    txt_content = format_batch_txt(
        batch_id=batch_id,
        baseline_hash=baseline_hash,
        targets=selected,
        contract=contract,
        trusted_sources=trusted_sources,
    )

    batch_checksum = compute_content_sha256(txt_content)
    batch_file = BATCHES_DIR / f"{batch_id}.txt"

    with open(batch_file, "w", encoding="utf-8") as f:
        f.write(txt_content)

    manifest_entry = {
        "batch_id": batch_id,
        "collection": ACTIVE_COLLECTION,
        "field": ACTIVE_HIGH_RISK_FIELD,
        "generator_version": GENERATOR_VERSION,
        "contract_version": CONTRACT_VERSION,
        "source_allowlist_version": SOURCE_ALLOWLIST_VERSION,
        "baseline_hash": baseline_hash,
        "batch_checksum": batch_checksum,
        "morphology_filter": morphology,
        "target_keys": [t["infinitive"] for t in selected],
        "targets": [
            {
                "infinitive": t["infinitive"],
                "morphological_type": t["morphological_type"],
                "auxiliary": t.get("auxiliary"),
                "verb_group": t.get("verb_group"),
            }
            for t in selected
        ],
        "created_at": datetime.now(timezone.utc).isoformat(),
    }

    manifest.setdefault("batches", {})[batch_id] = manifest_entry
    with open(BATCH_MANIFEST_PATH, "w", encoding="utf-8") as f:
        json.dump(manifest, f, indent=2, ensure_ascii=False)

    return manifest_entry


def main() -> None:
    parser = argparse.ArgumentParser(description="Generate high-risk batch prompt.")
    parser.add_argument("--morphology", type=str, default="regular_er", help="Morphological category filter.")
    parser.add_argument("--size", type=int, default=DEFAULT_BATCH_SIZE, help="Batch size (max 10).")
    parser.add_argument("--batch-num", type=int, default=1, help="Batch sequence number.")
    parser.add_argument("--infinitive", type=str, default=None, help="Target specific infinitive.")
    args = parser.parse_args()

    try:
        res = generate_batch(
            morphology=args.morphology,
            batch_size=args.size,
            batch_num=args.batch_num,
            infinitive=args.infinitive,
        )
        print(f"✅ Generated high-risk batch '{res['batch_id']}' with {len(res['target_keys'])} targets.")
        print(f"   Targets: {', '.join(res['target_keys'])}")
        print(f"   Batch file: {BATCHES_DIR / (res['batch_id'] + '.txt')}")
        print(f"   Manifest: {BATCH_MANIFEST_PATH}")
    except Exception as e:
        print(f"❌ Batch generation failed: {e}", file=sys.stderr)
        sys.exit(1)


if __name__ == "__main__":
    main()
