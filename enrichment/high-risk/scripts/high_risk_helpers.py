"""
High-Risk Helpers (enrichment/high-risk/scripts/high_risk_helpers.py)

Shared utility functions for hashing, baseline dataset loading, conjugation
contract evaluation, morphological categorization, and schema validation.
"""

import hashlib
import json
from pathlib import Path
from typing import Any, Dict, List, Optional, Tuple, Union
import jsonschema

import sys
from pathlib import Path
REPO_ROOT = Path(__file__).resolve().parent.parent.parent.parent
HIGH_RISK_DIR = Path(__file__).resolve().parent.parent
for p in [str(REPO_ROOT), str(HIGH_RISK_DIR)]:
    if p not in sys.path:
        sys.path.insert(0, p)

from config.high_risk_config import (
    MASTER_DATA_PATH,
    MASTER_SCHEMA_PATH,
    NORMAL_ENRICHED_DATA_PATH,
    CONJUGATION_CONTRACT_PATH,
    TRUSTED_SOURCES_PATH,
    RESPONSE_SCHEMA_PATH,
)


def compute_file_sha256(path: Union[str, Path]) -> str:
    """Computes deterministic SHA-256 hash of a file formatted as 'sha256:<hex>'."""
    h = hashlib.sha256()
    with open(path, "rb") as f:
        while chunk := f.read(65536):
            h.update(chunk)
    return f"sha256:{h.hexdigest()}"


def compute_content_sha256(content: Union[str, bytes]) -> str:
    """Computes deterministic SHA-256 hash of text/bytes content."""
    if isinstance(content, str):
        content = content.encode("utf-8")
    return f"sha256:{hashlib.sha256(content).hexdigest()}"


def get_baseline_dataset_path() -> Path:
    """
    Determines baseline dataset path.
    Per Section 1: creates high-risk derived dataset from approved normal-enriched
    dataset if it exists, otherwise from the immutable source data.
    """
    if NORMAL_ENRICHED_DATA_PATH.exists():
        return NORMAL_ENRICHED_DATA_PATH
    return MASTER_DATA_PATH


def load_baseline_dataset(path: Optional[Union[str, Path]] = None) -> Tuple[Dict[str, Any], str]:
    """Loads baseline dataset from disk and returns (parsed_dict, sha256_hash)."""
    target_path = Path(path) if path else get_baseline_dataset_path()
    h = compute_file_sha256(target_path)
    with open(target_path, "r", encoding="utf-8") as f:
        data = json.load(f)
    return data, h


def load_conjugation_contract() -> Dict[str, Any]:
    """Loads conjugation contract JSON specification."""
    with open(CONJUGATION_CONTRACT_PATH, "r", encoding="utf-8") as f:
        return json.load(f)


def load_trusted_sources() -> Dict[str, Any]:
    """Loads trusted sources allowlist configuration."""
    with open(TRUSTED_SOURCES_PATH, "r", encoding="utf-8") as f:
        return json.load(f)


def load_response_schema() -> Dict[str, Any]:
    """Loads response JSON schema definition."""
    with open(RESPONSE_SCHEMA_PATH, "r", encoding="utf-8") as f:
        return json.load(f)


def is_pronominal(infinitive: str) -> bool:
    """Checks if verb infinitive is pronominal/reflexive."""
    s = infinitive.strip().lower()
    return s.startswith("(s')") or s.startswith("s'") or s.startswith("se ") or s.startswith("(se)")


def is_impersonal(infinitive: str, contract: Optional[Dict[str, Any]] = None) -> bool:
    """Checks if verb is strictly impersonal."""
    clean = infinitive.strip().lower()
    for prefix in ["(s')", "s'", "se ", "(se)"]:
        if clean.startswith(prefix):
            clean = clean[len(prefix):].strip()
    impersonals = [
        "pleuvoir", "falloir", "neiger", "geler", "grêler", "bruiner", "tonner", "venter"
    ]
    if contract and "defective_and_impersonal_rules" in contract:
        impersonals = contract["defective_and_impersonal_rules"].get("impersonal_verbs", impersonals)
    return clean in impersonals


def is_defective(infinitive: str) -> bool:
    """Checks if verb is traditionally defective (missing several moods/tenses)."""
    clean = infinitive.strip().lower()
    for prefix in ["(s')", "s'", "se ", "(se)"]:
        if clean.startswith(prefix):
            clean = clean[len(prefix):].strip()
    defectives = {
        "clore", "enclore", "forclore", "gésir", "traire", "abstraire",
        "distraire", "extraire", "soustraire", "braire", "bruire",
        "sourdre", "frire", "déchoir", "échoir", "falloir", "pleuvoir", "seoir", "messeoir"
    }
    return clean in defectives


def classify_morphological_type(verb: Dict[str, Any], contract: Optional[Dict[str, Any]] = None) -> str:
    """
    Classifies verb into morphological risk category:
    - impersonal
    - defective
    - pronominal
    - spelling_change
    - regular_er
    - regular_ir
    - irregular
    """
    infinitive = verb.get("infinitive", "").strip()
    clean = infinitive.lower()
    for prefix in ["(s')", "s'", "se ", "(se)"]:
        if clean.startswith(prefix):
            clean = clean[len(prefix):].strip()

    if is_impersonal(clean, contract):
        return "impersonal"
    if is_defective(clean):
        return "defective"
    if is_pronominal(infinitive):
        return "pronominal"

    group = verb.get("verb_group", "")
    regularity = verb.get("regularity", "")

    # Spelling-change verbs (-ger, -cer, -eler, -eter, -oyer, -ayer, -uyer, e*er, é*er)
    if clean.endswith("er") and not clean.endswith("aller"):
        if clean.endswith("ger") or clean.endswith("cer"):
            return "spelling_change"
        if clean.endswith("eler") or clean.endswith("eter"):
            return "spelling_change"
        if clean.endswith("oyer") or clean.endswith("ayer") or clean.endswith("uyer"):
            return "spelling_change"
        # stem e/é changes: e.g. lever, peser, espérer, répéter
        if regularity == "spelling_change":
            return "spelling_change"
        if group in [1, "1", "1st", "1er", "premier"] or regularity == "regular":
            return "regular_er"

    if clean.endswith("ir") and (group in [2, "2", "2nd", "2e", "deuxième"] or regularity == "regular"):
        return "regular_ir"

    return "irregular"


def evaluate_verb_conjugation_status(verb: Dict[str, Any], contract: Dict[str, Any]) -> Tuple[str, List[str]]:
    """
    Evaluates a verb's conjugations field against the contract.
    Returns (status, reasons) where status is one of:
    - COMPLETE
    - MISSING
    - PARTIAL
    - MALFORMED
    - UNSUPPORTED
    - REQUIRES_REVIEW
    """
    reasons: List[str] = []
    conjs = verb.get("conjugations")

    # If None or empty array -> MISSING
    if conjs is None or (isinstance(conjs, list) and len(conjs) == 0):
        return "MISSING", ["No conjugation records present"]

    if not isinstance(conjs, list):
        return "MALFORMED", [f"conjugations must be an array, got {type(conjs).__name__}"]

    canonical_tenses = contract.get("canonical_tenses", [])
    person_keys = contract.get("person_keys", [])
    required_conj_fields = contract.get("required_conjugation_fields", [
        "tense", "mood", "forms", "stems", "endings", "formation_note", "irregularities", "notes", "sources"
    ])

    present_tense_keys = set()

    for idx, c in enumerate(conjs):
        if not isinstance(c, dict):
            return "MALFORMED", [f"conjugation record #{idx} is not an object"]

        for f in required_conj_fields:
            if f not in c:
                return "MALFORMED", [f"conjugation record #{idx} missing required field '{f}'"]

        tense_name = c.get("tense")
        mood_name = c.get("mood")
        forms = c.get("forms")

        if not tense_name:
            return "MALFORMED", [f"conjugation record #{idx} has empty tense name"]

        if not isinstance(forms, dict):
            return "MALFORMED", [f"conjugation record #{idx} ('{tense_name}') forms is not an object"]

        for pk in person_keys:
            if pk not in forms:
                return "MALFORMED", [f"conjugation record #{idx} ('{tense_name}') forms missing person key '{pk}'"]

        present_tense_keys.add((mood_name, tense_name))

    # Check for completeness against mandatory canonical tenses
    missing_mandatory = []
    for ct in canonical_tenses:
        key = (ct.get("mood"), ct.get("tense"))
        if key not in present_tense_keys:
            # Check fallback tense names (e.g. Indicatif vs indicative)
            matched = False
            for (m, t) in present_tense_keys:
                if t == ct.get("tense") or (m and ct.get("mood") and m.lower() == ct.get("mood").lower() and t == ct.get("tense")):
                    matched = True
                    break
            if not matched:
                missing_mandatory.append(f"{ct.get('mood')}/{ct.get('tense')}")

    if missing_mandatory:
        # Some conjugations exist, but not all mandatory ones
        return "PARTIAL", [f"Missing mandatory canonical tenses: {', '.join(missing_mandatory)}"]

    return "COMPLETE", ["All canonical tenses present and well-formed"]


def normalize_conjugations_for_schema(conjs: List[Dict[str, Any]], infinitive: str) -> List[Dict[str, Any]]:
    """
    Sanitizes conjugation records so that they strictly satisfy MASTER_SCHEMA.json:
    - deduplicates endings array while preserving order
    - populates all required fields in sourceEvidence records
    """
    sanitized = []
    for c in conjs:
        c_copy = dict(c)
        # Deduplicate endings
        if "endings" in c_copy and isinstance(c_copy["endings"], list):
            c_copy["endings"] = list(dict.fromkeys(c_copy["endings"]))

        # Normalize sources
        norm_sources = []
        for s in c_copy.get("sources", []):
            st = s.get("source_type", "verb_table")
            if st not in ["chapter", "book", "glossary", "verb_table", "answer_key", "ai_enrichment", "user_added", "derived", "other"]:
                st = "verb_table"
            norm_sources.append({
                "source_type": st,
                "source_name": s.get("source_name", "reference_table"),
                "chapter_number": s.get("chapter_number"),
                "section_title": s.get("section_title"),
                "page_printed": s.get("page_printed"),
                "page_pdf": s.get("page_pdf"),
                "context_type": s.get("context_type"),
                "exercise_code": s.get("exercise_code"),
                "question_number": s.get("question_number"),
                "table_title": s.get("table_title", "verb_conjugations"),
                "table_type": s.get("table_type"),
                "row_label": s.get("row_label", infinitive),
                "column": s.get("column"),
                "direction": s.get("direction"),
                "source_headword": s.get("source_headword", infinitive),
                "source_target": s.get("source_target"),
                "source_text": s.get("source_text"),
                "created_by": s.get("created_by", "ai_enrichment") if s.get("created_by") in ['independent_extraction', 'rule_expansion', 'mapping_script', 'ai_enrichment', 'manual', 'other', None] else "ai_enrichment",
                "notes": s.get("notes"),
                "derived_from": s.get("derived_from", []),
                "source_classifications": s.get("source_classifications", []),
            })
        c_copy["sources"] = norm_sources
        sanitized.append(c_copy)
    return sanitized


def validate_master_dataset_schema(dataset: Dict[str, Any]) -> List[str]:
    """Validates full dataset against MASTER_SCHEMA.json using jsonschema."""
    with open(MASTER_SCHEMA_PATH, "r", encoding="utf-8") as f:
        schema = json.load(f)
    validator = jsonschema.Draft202012Validator(schema)
    errors = []
    for err in validator.iter_errors(dataset):
        path = ".".join(str(p) for p in err.path)
        errors.append(f"[{path or 'root'}]: {err.message}")
        if len(errors) >= 25:
            errors.append("... (additional schema errors truncated)")
            break
    return errors
