"""
Enrichment Configuration (enrichment/scripts/enrichment_config.py)

Authoritative configuration for the L'Étude manual AI enrichment pipeline.
Governs batch sizing, collection natural keys, allowed operations, field permissions,
and directory structure.
"""

from pathlib import Path
from typing import Dict, Any, List, Union

# Base Paths (resolves relative to repo root)
REPO_ROOT = Path(__file__).resolve().parent.parent.parent
ENRICHMENT_DIR = REPO_ROOT / "enrichment"
MANUAL_DIR = ENRICHMENT_DIR / "manual"

BATCHES_DIR = MANUAL_DIR / "batches"
RESPONSES_DIR = MANUAL_DIR / "responses"
VALIDATED_DIR = MANUAL_DIR / "validated"
REVIEW_DIR = MANUAL_DIR / "review"
APPROVED_DIR = MANUAL_DIR / "approved"
REPORTS_DIR = MANUAL_DIR / "reports"
LOGS_DIR = MANUAL_DIR / "logs"
BACKUPS_DIR = MANUAL_DIR / "backups"

MASTER_DATA_PATH = REPO_ROOT / "data" / "MASTER_DATA.json"
MASTER_SCHEMA_PATH = REPO_ROOT / "data" / "MASTER_SCHEMA.json"
# Enrichment is deliberately copy-only. The source dataset is never a write target.
ENRICHED_DATA_PATH = ENRICHMENT_DIR / "MASTER_DATA_ENRICHED.json"

PROGRESS_FILE = LOGS_DIR / "PROGRESS.json"
BATCH_MANIFEST_FILE = LOGS_DIR / "BATCH_MANIFEST.json"

# Configurable Default Batch Sizes (edit here to change batch sizing across pipeline)
DEFAULT_BATCH_SIZES: Dict[str, int] = {
    "vocabulary": 40,
    "verbs": 20,
    "expressions": 30,
    "concepts": 20,
    "grammar_rules": 15,
    "tenses": 8,
    "exceptions_and_traps": 20,
    "examples": 30,
    "exercises": 15,
    "chapters": 8,
    "topics": 20,
}

# Recommended Global Collection Order for whole-dataset queue generation
COLLECTION_ORDER: List[str] = [
    "vocabulary",
    "verbs",
    "expressions",
    "concepts",
    "grammar_rules",
    "tenses",
    "exceptions_and_traps",
    "examples",
    "exercises",
    "chapters",
    "topics",
]

# Protected collections excluded from automatic enrichment by default
PROTECTED_COLLECTIONS: List[str] = [
    "unresolved_items",
    "source_quality",
]

# Natural Key Specification per Collection
# Can be a single string property, or a tuple/list of strings for composite keys
NATURAL_KEYS: Dict[str, Union[str, List[str]]] = {
    "verbs": "infinitive",
    "vocabulary": ["canonical_form", "part_of_speech"],
    "expressions": "canonical_form",
    "concepts": "name",
    "grammar_rules": "rule_name",
    "tenses": "name",
    "exceptions_and_traps": ["title", "category"],
    "examples": "french",
    "exercises": ["chapter_number", "exercise_code"],
    "chapters": "chapter_number",
    "topics": "name",
}

# Supported and implemented patch operations.  Keep this list in lockstep with
# apply_enrichment.py and preview_enrichment.py; accepting an operation that is
# not implemented safely is a data-loss risk.
ALLOWED_OPERATIONS: List[str] = [
    "add_unique",
    "set_if_empty",
    "add_object_unique",
]

# Field Name Normalization / Aliases (e.g. english_meanings -> english)
FIELD_ALIASES: Dict[str, str] = {
    "english_meanings": "english",
    "meanings": "english",
    "rule_title": "rule_name",
    "title_name": "rule_name",
    "tense_name": "name",
    "concept_name": "name",
    "french_sentence": "french",
    "english_translation": "english",
}

# Fields that may be included in an AI enrichment pass.  The collection schema
# describes each field's shape; this list is the separate authorization boundary.
# Natural keys, provenance, source text, exercise answers, and destructive fields
# are intentionally excluded even when they appear in MASTER_SCHEMA.json.
SAFE_FIELDS: Dict[str, List[str]] = {
    "verbs": ["english", "synonyms", "antonyms", "register", "usage_notes", "aliases", "search_terms", "tags"],
    "vocabulary": ["english", "synonyms", "antonyms", "register", "usage_notes", "aliases", "search_terms", "word_family", "tags", "gender", "articles", "plural", "variants"],
    "expressions": ["english", "synonyms", "antonyms", "register", "usage_notes", "aliases", "search_terms", "collocation_strength", "tags"],
    "concepts": ["description", "aliases", "tags"],
    "grammar_rules": ["explanation", "summary", "usage", "signal_words", "tags"],
    "tenses": ["english_name", "usage", "signal_words", "tags"],
    "exceptions_and_traps": ["description", "why_incorrect", "why_correct", "memory_tip", "tags"],
    "examples": ["english", "tags", "related_verbs", "related_tenses"],
    "exercises": ["instructions", "notes", "tags"],
    "chapters": ["notes", "sections"],
    "topics": ["description", "tags"],
}

HIGH_RISK_FIELDS: Dict[str, List[str]] = {
    "verbs": ["conjugations", "stems", "auxiliary", "verb_group", "transitivity", "regularity", "past_participle", "present_participle"],
    "vocabulary": ["gender", "articles", "part_of_speech", "plural"],
    "expressions": ["pattern", "pattern_slots", "prepositions", "complement_structure", "restrictions", "transformations"],
    "concepts": ["name"],
    "grammar_rules": ["formation", "conditions", "restrictions", "exceptions", "agreement_rules", "word_order", "transformations"],
    "tenses": ["formation", "regular_patterns", "irregular_stems", "compound_structure", "agreement_rules"],
    "exceptions_and_traps": ["correct_form", "incorrect_form"],
    "examples": ["french"],
    "exercises": ["chapter_number", "exercise_code", "questions"],
    "chapters": ["chapter_number"],
    "topics": ["name"],
}

# Additive relationship fields whose values must resolve to existing natural keys.
RELATIONSHIP_TARGETS: Dict[str, Dict[str, str]] = {
    "examples": {
        "related_verbs": "verbs",
        "related_tenses": "tenses",
    },
}
