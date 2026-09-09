"""
High-Risk Enrichment Configuration (enrichment/high-risk/config/high_risk_config.py)

Authoritative configuration for the conservative high-risk enrichment pipeline.
Governs path resolution, strict authorization boundaries, versioned contracts,
and non-negotiable invariants.
"""

from pathlib import Path
from typing import Dict, List, Union

# Base Directory Resolution
REPO_ROOT = Path(__file__).resolve().parent.parent.parent.parent
ENRICHMENT_DIR = REPO_ROOT / "enrichment"
HIGH_RISK_DIR = ENRICHMENT_DIR / "high-risk"

CONFIG_DIR = HIGH_RISK_DIR / "config"
BATCHES_DIR = HIGH_RISK_DIR / "batches"
RESPONSES_DIR = HIGH_RISK_DIR / "responses"
VALIDATED_DIR = HIGH_RISK_DIR / "validated"
REVIEW_DIR = HIGH_RISK_DIR / "review"
APPROVED_DIR = HIGH_RISK_DIR / "approved"
REJECTED_DIR = HIGH_RISK_DIR / "rejected"
REPORTS_DIR = HIGH_RISK_DIR / "reports"
AUDITS_DIR = HIGH_RISK_DIR / "audits"
BACKUPS_DIR = HIGH_RISK_DIR / "backups"
FIXTURES_DIR = HIGH_RISK_DIR / "fixtures"
SCRIPTS_DIR = HIGH_RISK_DIR / "scripts"
TESTS_DIR = HIGH_RISK_DIR / "tests"

# Dataset Paths
# MASTER_DATA_PATH is strictly immutable source. Never write to it.
MASTER_DATA_PATH = REPO_ROOT / "data" / "MASTER_DATA.json"
MASTER_SCHEMA_PATH = REPO_ROOT / "data" / "MASTER_SCHEMA.json"
NORMAL_ENRICHED_DATA_PATH = ENRICHMENT_DIR / "MASTER_DATA_ENRICHED.json"

# High-risk output dataset is isolated from normal enrichment output
HIGH_RISK_DATA_PATH = ENRICHMENT_DIR / "HIGH_RISK_DATA_ENRICHED.json"

# Config and Contract Files
CONJUGATION_CONTRACT_PATH = CONFIG_DIR / "conjugation_contract.json"
TRUSTED_SOURCES_PATH = CONFIG_DIR / "trusted_sources.json"
RESPONSE_SCHEMA_PATH = CONFIG_DIR / "response_schema.json"
BATCH_MANIFEST_PATH = BATCHES_DIR / "BATCH_MANIFEST.json"

# Pipeline Versions
CONTRACT_VERSION = "1.0.0"
GENERATOR_VERSION = "1.0.0"
VALIDATOR_VERSION = "1.0.0"
APPLICATOR_VERSION = "1.0.0"
SOURCE_ALLOWLIST_VERSION = "1.0.0"

# Complete queue versions are independent from the legacy single-field
# verbs.conjugations workflow above.  Bumping these values deliberately makes
# stale worker responses fail closed when the queue contract changes.
FULL_QUEUE_VERSION = "2.1.0"
FULL_QUEUE_VALIDATOR_VERSION = "2.1.0"
FULL_QUEUE_APPLICATOR_VERSION = "2.1.0"

# Complete-queue modes.  FILL_ONLY sets a currently empty field.  The repair
# mode replaces a partial conjugation list only after validation proves that
# every existing record is preserved and the proposed list is contract-complete.
FULL_QUEUE_FILL_MODE = "FILL_ONLY"
FULL_QUEUE_REPAIR_MODE = "COMPLETE_PARTIAL_REVIEW"

# Sizing Rules (5-10 verbs per batch for human review and failure isolation)
DEFAULT_BATCH_SIZE = 5
MAX_BATCH_SIZE = 10

# Full High-Risk Field Inventory (Section 3 of plan.md)
# Excluded from normal enrichment by design.
HIGH_RISK_FIELDS: Dict[str, List[str]] = {
    "verbs": [
        "conjugations",
        "stems",
        "auxiliary",
        "verb_group",
        "transitivity",
        "regularity",
        "past_participle",
        "present_participle",
    ],
    "vocabulary": [
        "gender",
        "articles",
        "part_of_speech",
        "plural",
    ],
    "expressions": [
        "pattern",
        "pattern_slots",
        "prepositions",
        "complement_structure",
        "restrictions",
        "transformations",
    ],
    "concepts": [
        "name",
    ],
    "grammar_rules": [
        "formation",
        "conditions",
        "restrictions",
        "exceptions",
        "agreement_rules",
        "word_order",
        "transformations",
    ],
    "tenses": [
        "formation",
        "regular_patterns",
        "irregular_stems",
        "compound_structure",
        "agreement_rules",
    ],
    "exceptions_and_traps": [
        "correct_form",
        "incorrect_form",
    ],
    "examples": [
        "french",
    ],
    "exercises": [
        "chapter_number",
        "exercise_code",
        "questions",
    ],
    "chapters": [
        "chapter_number",
    ],
    "topics": [
        "name",
    ],
}

# Initial Phase Policy: verbs.conjugations only
ACTIVE_COLLECTION = "verbs"
ACTIVE_HIGH_RISK_FIELD = "conjugations"

# Strict Allowed Operations (Section 4 & 10)
# Only set_if_missing_complete is authorized for this phase.
ALLOWED_OPERATIONS = ["set_if_missing_complete"]

# Natural Keys
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

# Controlled Reason Codes for no_proposals
CONTROLLED_NO_PROPOSAL_REASONS = [
    "SOURCE_NOT_FOUND",
    "CONFLICTING_SOURCES",
    "PARTIAL_EXISTING_DATA",
    "UNSUPPORTED_VERB_TYPE",
    "DEFECTIVE_UNCERTAIN",
    "INSUFFICIENT_EVIDENCE",
]
