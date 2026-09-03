"""
Enrichment Pipeline Comprehensive Test Suite (enrichment/tests/test_enrichment_pipeline.py)

Tests batch generation, response validation, conflict detection, dry-run previews,
human-readable reports, and atomic transactional apply mechanics.
"""

import sys
import unittest
import tempfile
from pathlib import Path

# Add scripts directory to path
SCRIPTS_DIR = Path(__file__).resolve().parent.parent / "scripts"
if str(SCRIPTS_DIR) not in sys.path:
    sys.path.insert(0, str(SCRIPTS_DIR))

from enrichment_config import (
    DEFAULT_BATCH_SIZES,
    COLLECTION_ORDER,
    PROTECTED_COLLECTIONS,
    NATURAL_KEYS,
    ALLOWED_OPERATIONS,
)
from enrichment_helpers import (
    normalize_french_text,
    natural_key_to_str,
    extract_natural_key,
    natural_keys_match,
    load_master_data,
    find_entity_by_natural_key,
    build_natural_key_index,
)
from validate_enrichment_response import validate_response_file
from preview_enrichment import preview_patch_file
from generate_enrichment_report import format_preview_report, format_applied_report
from apply_enrichment import apply_patch_to_dataset


class TestEnrichmentConfiguration(unittest.TestCase):
    def test_collections_and_batch_sizes(self):
        expected_collections = [
            "vocabulary", "verbs", "expressions", "concepts",
            "grammar_rules", "tenses", "exceptions_and_traps",
            "examples", "exercises", "chapters", "topics"
        ]
        for c in expected_collections:
            self.assertIn(c, DEFAULT_BATCH_SIZES)
            self.assertGreater(DEFAULT_BATCH_SIZES[c], 0)
            self.assertIn(c, NATURAL_KEYS)

        self.assertIn("unresolved_items", PROTECTED_COLLECTIONS)
        self.assertIn("source_quality", PROTECTED_COLLECTIONS)


class TestEnrichmentHelpers(unittest.TestCase):
    def test_normalize_french_text(self):
        self.assertEqual(normalize_french_text("Être"), "etre")
        self.assertEqual(normalize_french_text("à la maison"), "a la maison")
        self.assertEqual(normalize_french_text("Çà et là"), "ca et la")

    def test_natural_key_to_str(self):
        self.assertEqual(natural_key_to_str("verbs", "prendre"), "prendre")
        vocab_key = {"canonical_form": "tour", "part_of_speech": "noun"}
        self.assertEqual(natural_key_to_str("vocabulary", vocab_key), "canonical_form=tour::part_of_speech=noun")

    def test_natural_keys_match(self):
        self.assertTrue(natural_keys_match("Être", "etre"))
        self.assertTrue(natural_keys_match(
            {"canonical_form": "tour", "part_of_speech": "noun"},
            {"canonical_form": "tour", "part_of_speech": "noun"}
        ))
        self.assertFalse(natural_keys_match(
            {"canonical_form": "tour", "part_of_speech": "noun"},
            {"canonical_form": "tour", "part_of_speech": "verb"}
        ))


class TestEnrichmentValidationAndPreview(unittest.TestCase):
    def setUp(self):
        # Create a mini mock master dataset
        self.dataset = {
            "verbs": [
                {
                    "infinitive": "prendre",
                    "display_form": "prendre",
                    "english": ["to take"],
                    "register": "neutral",
                    "synonyms": ["saisir"],
                },
                {
                    "infinitive": "venir",
                    "display_form": "venir",
                    "english": ["to come"],
                    "register": "neutral",
                    "synonyms": [],
                }
            ],
            "vocabulary": [
                {
                    "canonical_form": "décision",
                    "part_of_speech": "noun",
                    "english": ["decision"],
                }
            ]
        }

    def test_validation_clean_patch(self):
        patch_payload = {
            "batch_id": "test_001",
            "collection": "verbs",
            "patches": [
                {
                    "entity_key": "prendre",
                    "operations": [
                        {
                            "operation": "add_unique",
                            "field": "english",
                            "values": ["to catch", "to have"]
                        }
                    ]
                }
            ],
            "uncertain_suggestions": [],
            "batch_summary": "Added meanings for prendre."
        }

        with tempfile.NamedTemporaryFile(mode="w", suffix=".json", delete=False) as f:
            import json
            json.dump(patch_payload, f)
            temp_path = Path(f.name)

        try:
            res, clean_payload = validate_response_file(temp_path, self.dataset)
            self.assertTrue(res.is_valid)
            self.assertEqual(res.status, "PASSED")
            self.assertEqual(res.valid_operations_count, 1)
        finally:
            temp_path.unlink()

    def test_validation_rejects_forbidden_ops_and_artificial_ids(self):
        forbidden_payload = {
            "batch_id": "test_bad_001",
            "collection": "verbs",
            "patches": [
                {
                    "entity_key": "prendre",
                    "operations": [
                        {
                            "operation": "delete",
                            "field": "english"
                        },
                        {
                            "operation": "set_if_empty",
                            "field": "id",
                            "value": "custom_uuid_1234"
                        }
                    ]
                }
            ]
        }

        with tempfile.NamedTemporaryFile(mode="w", suffix=".json", delete=False) as f:
            import json
            json.dump(forbidden_payload, f)
            temp_path = Path(f.name)

        try:
            res, _ = validate_response_file(temp_path, self.dataset)
            self.assertFalse(res.is_valid)
            self.assertEqual(res.status, "FAILED")
            self.assertTrue(any("forbidden" in e.lower() or "artificial id" in e.lower() for e in res.errors))
        finally:
            temp_path.unlink()

    def test_preview_diff_calculations(self):
        patch_payload = {
            "batch_id": "test_preview_001",
            "collection": "verbs",
            "patches": [
                {
                    "entity_key": "prendre",
                    "operations": [
                        # Already exists: to take (NO_OP), new: to catch (ADDITION)
                        {"operation": "add_unique", "field": "english", "values": ["to take", "to catch"]},
                        # Already exists neutral -> NO_OP
                        {"operation": "set_if_empty", "field": "register", "value": "neutral"},
                    ]
                },
                {
                    "entity_key": "venir",
                    "operations": [
                        # Conflict: existing neutral vs proposed informal
                        {"operation": "set_if_empty", "field": "register", "value": "informal"}
                    ]
                }
            ]
        }

        with tempfile.NamedTemporaryFile(mode="w", suffix=".json", delete=False) as f:
            import json
            json.dump(patch_payload, f)
            temp_path = Path(f.name)

        try:
            preview = preview_patch_file(temp_path, self.dataset)
            self.assertEqual(preview["additions"], 1)  # 'to catch'
            self.assertEqual(preview["no_ops"], 2)     # 'to take' and 'neutral'
            self.assertEqual(preview["conflicts"], 1)  # 'informal' conflict
            self.assertEqual(preview["existing_values_removed"], 0)

            # Test text report generation
            report = format_preview_report(preview)
            self.assertIn("to catch", report)
            self.assertIn("CONFLICT", report)
            self.assertIn("L'ÉTUDE ENRICHMENT REPORT", report)
        finally:
            temp_path.unlink()


class TestEnrichmentApplyEngine(unittest.TestCase):
    def test_in_memory_apply_and_conflict_handling(self):
        dataset = {
            "verbs": [
                {
                    "infinitive": "prendre",
                    "english": ["to take"],
                    "synonyms": ["saisir"],
                    "register": "neutral",
                    "usage_notes": None,
                }
            ]
        }

        patch_data = {
            "batch_id": "test_apply_001",
            "collection": "verbs",
            "patches": [
                {
                    "entity_key": "prendre",
                    "operations": [
                        {"operation": "add_unique", "field": "english", "values": ["to catch"]},
                        {"operation": "set_if_empty", "field": "usage_notes", "value": "Versatile verb."},
                        {"operation": "set_if_empty", "field": "register", "value": "formal"},  # conflict!
                    ]
                }
            ]
        }

        success, audit, errors = apply_patch_to_dataset(dataset, patch_data)
        self.assertTrue(success)
        self.assertEqual(audit["operations_applied"], 2)
        self.assertEqual(audit["conflicts_skipped"], 1)

        verb = dataset["verbs"][0]
        self.assertIn("to catch", verb["english"])
        self.assertEqual(verb["usage_notes"], "Versatile verb.")
        self.assertEqual(verb["register"], "neutral")  # Not overwritten!

        # Test applied report formatting
        report = format_applied_report(audit)
        self.assertIn("APPLY AUDIT SUMMARY", report)
        self.assertIn("english", report)


if __name__ == "__main__":
    unittest.main()
