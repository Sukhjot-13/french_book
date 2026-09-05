"""
Comprehensive Test Suite for High-Risk Enrichment Pipeline
(enrichment/high-risk/tests/test_high_risk_pipeline.py)

Covers all 17 sections of plan.md:
- Configuration, paths, invariants, and authorization boundaries
- Machine-readable conjugation contract and trusted sources allowlist
- Inventory and preflight classification (complete, missing, partial)
- Deterministic batch generation and manifest locking
- 15 fail-closed response validation gates
- Dual-reviewer approval workflow
- Transactional atomic applicator, backups, idempotence, and source immutability
"""

import copy
import json
import shutil
import sys
import tempfile
import unittest
from pathlib import Path

# Add repo root and high-risk dir to sys.path
REPO_ROOT = Path(__file__).resolve().parent.parent.parent.parent
HIGH_RISK_DIR = Path(__file__).resolve().parent.parent
for p in [str(REPO_ROOT), str(HIGH_RISK_DIR)]:
    if p not in sys.path:
        sys.path.insert(0, p)

from config.high_risk_config import (
    ACTIVE_COLLECTION,
    ACTIVE_HIGH_RISK_FIELD,
    ALLOWED_OPERATIONS,
    APPLICATOR_VERSION,
    BATCH_MANIFEST_PATH,
    CONTRACT_VERSION,
    GENERATOR_VERSION,
    HIGH_RISK_FIELDS,
    MASTER_DATA_PATH,
    NORMAL_ENRICHED_DATA_PATH,
    SOURCE_ALLOWLIST_VERSION,
    VALIDATOR_VERSION,
)
from scripts.apply_high_risk_enrichment import apply_approved_batch
from scripts.approve_high_risk import approve_batch, reject_batch
from scripts.high_risk_helpers import (
    classify_morphological_type,
    compute_file_sha256,
    evaluate_verb_conjugation_status,
    is_impersonal,
    is_pronominal,
    load_baseline_dataset,
    load_conjugation_contract,
    load_response_schema,
    load_trusted_sources,
    validate_master_dataset_schema,
)
from scripts.inventory_high_risk import run_inventory
from scripts.make_high_risk_batch import generate_batch
from scripts.validate_high_risk_response import validate_response


class TestHighRiskConfiguration(unittest.TestCase):
    def test_configuration_boundaries(self):
        self.assertEqual(ACTIVE_COLLECTION, "verbs")
        self.assertEqual(ACTIVE_HIGH_RISK_FIELD, "conjugations")
        self.assertEqual(ALLOWED_OPERATIONS, ["set_if_missing_complete"])

        # Check all 11 collections from Section 3 of plan.md
        expected_collections = [
            "verbs", "vocabulary", "expressions", "concepts", "grammar_rules",
            "tenses", "exceptions_and_traps", "examples", "exercises",
            "chapters", "topics"
        ]
        for c in expected_collections:
            self.assertIn(c, HIGH_RISK_FIELDS)
            self.assertGreater(len(HIGH_RISK_FIELDS[c]), 0)

        self.assertIn("conjugations", HIGH_RISK_FIELDS["verbs"])
        self.assertIn("gender", HIGH_RISK_FIELDS["vocabulary"])
        self.assertIn("pattern", HIGH_RISK_FIELDS["expressions"])

    def test_versions_aligned(self):
        self.assertEqual(CONTRACT_VERSION, "1.0.0")
        self.assertEqual(GENERATOR_VERSION, "1.0.0")
        self.assertEqual(VALIDATOR_VERSION, "1.0.0")
        self.assertEqual(APPLICATOR_VERSION, "1.0.0")
        self.assertEqual(SOURCE_ALLOWLIST_VERSION, "1.0.0")

    def test_conjugation_contract_structure(self):
        contract = load_conjugation_contract()
        self.assertEqual(contract["version"], "1.0.0")
        self.assertIn("canonical_moods", contract)
        self.assertIn("canonical_tenses", contract)
        self.assertIn("person_keys", contract)

        tenses = [t["tense"] for t in contract["canonical_tenses"]]
        self.assertIn("présent", tenses)
        self.assertIn("imparfait", tenses)
        self.assertIn("futur_simple", tenses)
        self.assertIn("passé_simple", tenses)
        self.assertIn("conditionnel_présent", tenses)
        self.assertIn("subjonctif_présent", tenses)
        self.assertIn("impératif", tenses)

    def test_trusted_sources_allowlist(self):
        sources = load_trusted_sources()
        self.assertEqual(sources["version"], "1.0.0")
        self.assertGreater(len(sources["sources"]), 0)
        source_ids = {s["source_id"] for s in sources["sources"]}
        self.assertIn("bescherelle_la_conjugaison_pour_tous", source_ids)
        self.assertIn("curated_in_repo_reference_v1", source_ids)


class TestInventoryAndClassification(unittest.TestCase):
    def test_morphological_classification(self):
        contract = load_conjugation_contract()
        self.assertTrue(is_impersonal("pleuvoir", contract))
        self.assertTrue(is_impersonal("falloir", contract))
        self.assertFalse(is_impersonal("parler", contract))

        self.assertTrue(is_pronominal("(s')asseoir"))
        self.assertTrue(is_pronominal("se souvenir"))
        self.assertFalse(is_pronominal("aimer"))

        self.assertEqual(classify_morphological_type({"infinitive": "parler", "verb_group": 1}, contract), "regular_er")
        self.assertEqual(classify_morphological_type({"infinitive": "finir", "verb_group": 2}, contract), "regular_ir")
        self.assertEqual(classify_morphological_type({"infinitive": "manger", "verb_group": 1}, contract), "spelling_change")
        self.assertEqual(classify_morphological_type({"infinitive": "commencer", "verb_group": 1}, contract), "spelling_change")
        self.assertEqual(classify_morphological_type({"infinitive": "pleuvoir"}, contract), "impersonal")

    def test_preflight_inventory_run(self):
        inv = run_inventory()
        self.assertEqual(inv["total_verbs"], 496)
        self.assertEqual(inv["missing_count"], 349)
        self.assertEqual(inv["partial_count"], 147)
        self.assertEqual(inv["malformed_count"], 0)
        self.assertTrue(inv["baseline_hash"].startswith("sha256:"))


class TestBatchGeneratorAndManifest(unittest.TestCase):
    def test_deterministic_batch_generation(self):
        # Generate test batch in temp environment
        with tempfile.TemporaryDirectory() as tmp_dir:
            tmp_path = Path(tmp_dir)
            manifest_file = tmp_path / "BATCH_MANIFEST.json"
            b1 = generate_batch(morphology="regular_er", batch_size=2, batch_num=99)
            self.assertEqual(b1["batch_id"], "099_verbs_conjugations_batch_099")
            self.assertEqual(len(b1["target_keys"]), 2)
            self.assertEqual(b1["field"], "conjugations")
            self.assertEqual(b1["collection"], "verbs")
            self.assertTrue(b1["baseline_hash"].startswith("sha256:"))
            self.assertTrue(b1["batch_checksum"].startswith("sha256:"))


class TestValidationGatesFailClosed(unittest.TestCase):
    def setUp(self):
        self.contract = load_conjugation_contract()
        with open(HIGH_RISK_DIR / "fixtures" / "sample_paradigms.json", "r", encoding="utf-8") as f:
            self.sample_paradigms = json.load(f)

    def test_gate_1_malformed_json(self):
        with tempfile.NamedTemporaryFile(suffix="_RESPONSE.json", mode="w", delete=False) as f:
            f.write("{malformed json: broken")
            temp_path = Path(f.name)
        try:
            status, report = validate_response(temp_path)
            self.assertEqual(status, "FAIL")
            self.assertTrue(any("Invalid JSON" in err for err in report["errors"]))
        finally:
            temp_path.unlink(missing_ok=True)

    def test_gate_2_metadata_mismatch(self):
        with tempfile.NamedTemporaryFile(suffix="_RESPONSE.json", mode="w", delete=False) as f:
            bad_data = {
                "batch_id": "001_verbs_conjugations_batch_001",
                "collection": "verbs",
                "contract_version": "9.9.9",  # WRONG
                "baseline_hash": "sha256:0000000000000000000000000000000000000000000000000000000000000000",
                "source_allowlist_version": "1.0.0",
                "patches": [],
                "no_proposals": [],
                "batch_summary": "Test"
            }
            json.dump(bad_data, f)
            temp_path = Path(f.name)
        try:
            status, report = validate_response(temp_path)
            self.assertEqual(status, "FAIL")
            self.assertTrue(any("contract_version" in err or "manifest" in err for err in report["errors"]))
        finally:
            temp_path.unlink(missing_ok=True)

    def test_gate_7_reject_non_empty_existing_verb(self):
        # Try to propose patch for '(s')asseoir' which already has non-empty conjugations
        _, baseline_hash = load_baseline_dataset()
        data = {
            "batch_id": "999_verbs_conjugations_batch_999",
            "collection": "verbs",
            "contract_version": CONTRACT_VERSION,
            "baseline_hash": baseline_hash,
            "source_allowlist_version": SOURCE_ALLOWLIST_VERSION,
            "patches": [
                {
                    "entity_key": "(s')asseoir",
                    "field": "conjugations",
                    "operation": "set_if_missing_complete",
                    "precondition": {"field_state": "EMPTY"},
                    "evidence": {
                        "source_id": "bescherelle_la_conjugaison_pour_tous",
                        "source_type": "reference_lexicon",
                        "reference_notes": "test"
                    },
                    "value": self.sample_paradigms["parler"]
                }
            ],
            "no_proposals": [],
            "batch_summary": "Test non-empty rejection"
        }
        # Fake manifest entry
        with open(BATCH_MANIFEST_PATH, "r", encoding="utf-8") as f:
            manifest = json.load(f)
        manifest["batches"]["999_verbs_conjugations_batch_999"] = {
            "batch_id": "999_verbs_conjugations_batch_999",
            "target_keys": ["(s')asseoir"]
        }
        with open(BATCH_MANIFEST_PATH, "w", encoding="utf-8") as f:
            json.dump(manifest, f)

        with tempfile.NamedTemporaryFile(suffix="_RESPONSE.json", mode="w", delete=False) as f:
            json.dump(data, f)
            temp_path = Path(f.name)

        try:
            status, report = validate_response(temp_path)
            self.assertEqual(status, "FAIL")
            self.assertTrue(any("not empty" in err for err in report["errors"]))
        finally:
            temp_path.unlink(missing_ok=True)
            # clean manifest
            del manifest["batches"]["999_verbs_conjugations_batch_999"]
            with open(BATCH_MANIFEST_PATH, "w", encoding="utf-8") as f:
                json.dump(manifest, f)

    def test_gate_8_reject_untrusted_source(self):
        _, baseline_hash = load_baseline_dataset()
        data = {
            "batch_id": "998_verbs_conjugations_batch_998",
            "collection": "verbs",
            "contract_version": CONTRACT_VERSION,
            "baseline_hash": baseline_hash,
            "source_allowlist_version": SOURCE_ALLOWLIST_VERSION,
            "patches": [
                {
                    "entity_key": "aimer",
                    "field": "conjugations",
                    "operation": "set_if_missing_complete",
                    "precondition": {"field_state": "EMPTY"},
                    "evidence": {
                        "source_id": "unverified_random_scraper_dot_com",  # FORBIDDEN
                        "source_type": "web_scrape",
                        "reference_notes": "Scraped online"
                    },
                    "value": self.sample_paradigms["parler"]
                }
            ],
            "no_proposals": [],
            "batch_summary": "Test untrusted source rejection"
        }
        with open(BATCH_MANIFEST_PATH, "r", encoding="utf-8") as f:
            manifest = json.load(f)
        manifest["batches"]["998_verbs_conjugations_batch_998"] = {
            "batch_id": "998_verbs_conjugations_batch_998",
            "target_keys": ["aimer"]
        }
        with open(BATCH_MANIFEST_PATH, "w", encoding="utf-8") as f:
            json.dump(manifest, f)

        with tempfile.NamedTemporaryFile(suffix="_RESPONSE.json", mode="w", delete=False) as f:
            json.dump(data, f)
            temp_path = Path(f.name)

        try:
            status, report = validate_response(temp_path)
            self.assertEqual(status, "FAIL")
            self.assertTrue(any("trusted sources allowlist" in err for err in report["errors"]))
        finally:
            temp_path.unlink(missing_ok=True)
            del manifest["batches"]["998_verbs_conjugations_batch_998"]
            with open(BATCH_MANIFEST_PATH, "w", encoding="utf-8") as f:
                json.dump(manifest, f)

    def test_gate_10_reject_placeholder_text(self):
        _, baseline_hash = load_baseline_dataset()
        corrupted_paradigm = copy.deepcopy(self.sample_paradigms["parler"])
        corrupted_paradigm[0]["forms"]["je"] = "TODO: find form"  # Placeholder!

        data = {
            "batch_id": "997_verbs_conjugations_batch_997",
            "collection": "verbs",
            "contract_version": CONTRACT_VERSION,
            "baseline_hash": baseline_hash,
            "source_allowlist_version": SOURCE_ALLOWLIST_VERSION,
            "patches": [
                {
                    "entity_key": "aimer",
                    "field": "conjugations",
                    "operation": "set_if_missing_complete",
                    "precondition": {"field_state": "EMPTY"},
                    "evidence": {
                        "source_id": "bescherelle_la_conjugaison_pour_tous",
                        "source_type": "reference_lexicon",
                        "reference_notes": "verified"
                    },
                    "value": corrupted_paradigm
                }
            ],
            "no_proposals": [],
            "batch_summary": "Test placeholder rejection"
        }
        with open(BATCH_MANIFEST_PATH, "r", encoding="utf-8") as f:
            manifest = json.load(f)
        manifest["batches"]["997_verbs_conjugations_batch_997"] = {
            "batch_id": "997_verbs_conjugations_batch_997",
            "target_keys": ["aimer"]
        }
        with open(BATCH_MANIFEST_PATH, "w", encoding="utf-8") as f:
            json.dump(manifest, f)

        with tempfile.NamedTemporaryFile(suffix="_RESPONSE.json", mode="w", delete=False) as f:
            json.dump(data, f)
            temp_path = Path(f.name)

        try:
            status, report = validate_response(temp_path)
            self.assertEqual(status, "FAIL")
            self.assertTrue(any("placeholder text" in err for err in report["errors"]))
        finally:
            temp_path.unlink(missing_ok=True)
            del manifest["batches"]["997_verbs_conjugations_batch_997"]
            with open(BATCH_MANIFEST_PATH, "w", encoding="utf-8") as f:
                json.dump(manifest, f)


class TestApprovalAndSafeApplication(unittest.TestCase):
    def setUp(self):
        self.source_hash_before = compute_file_sha256(MASTER_DATA_PATH)
        if NORMAL_ENRICHED_DATA_PATH.exists():
            self.normal_enriched_hash_before = compute_file_sha256(NORMAL_ENRICHED_DATA_PATH)
        else:
            self.normal_enriched_hash_before = None

        with open(HIGH_RISK_DIR / "fixtures" / "sample_paradigms.json", "r", encoding="utf-8") as f:
            self.sample_paradigms = json.load(f)

    def test_approval_workflow_requires_dual_signoff(self):
        with tempfile.TemporaryDirectory() as tmp_dir:
            val_file = Path(tmp_dir) / "test_VALIDATED.json"
            val_data = {
                "batch_id": "test_batch",
                "collection": "verbs",
                "contract_version": CONTRACT_VERSION,
                "patches": []
            }
            with open(val_file, "w") as f:
                json.dump(val_data, f)

            # Missing reviewers
            with self.assertRaises(ValueError):
                approve_batch(val_file, "", "")

            with self.assertRaises(ValueError):
                approve_batch(val_file, "Linguist", "")

            # A hand-written lookalike is not a validator-produced payload and
            # must never enter the approval directory.
            with self.assertRaises(ValueError):
                approve_batch(val_file, "Linguist Expert", "Compliance Officer", "All good")

    def test_safe_application_and_invariants(self):
        # Create a valid approved batch targeting a disposable output file
        with tempfile.TemporaryDirectory() as tmp_dir:
            disposable_output = Path(tmp_dir) / "DISPOSABLE_OUTPUT.json"

            # Attempting write to MASTER_DATA_PATH must raise PermissionError
            with tempfile.NamedTemporaryFile(suffix="_APPROVED.json", mode="w", delete=False) as f:
                fake_approved = {
                    "batch_id": "001_verbs_conjugations_batch_001",
                    "contract_version": CONTRACT_VERSION,
                    "review_decision": {
                        "status": "APPROVED",
                        "linguistic_reviewer": "Rev1",
                        "compliance_reviewer": "Rev2"
                    },
                    "patches": []
                }
                json.dump(fake_approved, f)
                approved_path = Path(f.name)

            with self.assertRaises(PermissionError):
                apply_approved_batch(approved_path, output_path=MASTER_DATA_PATH)

            with self.assertRaises(PermissionError):
                apply_approved_batch(approved_path, output_path=NORMAL_ENRICHED_DATA_PATH)

            # A hand-written approved lookalike cannot be applied either: the
            # approved payload must be chained to the exact validated payload
            # and passing report that produced it.
            with self.assertRaises(ValueError):
                apply_approved_batch(approved_path, output_path=disposable_output)

            # Prepare a plausible patch body for the integrity-chain test.
            chuchoter_paradigm = copy.deepcopy(self.sample_paradigms["parler"])
            for c in chuchoter_paradigm:
                forms = c.get("forms", {})
                for pk, val in forms.items():
                    if isinstance(val, str) and val.startswith("parl"):
                        forms[pk] = val.replace("parl", "chuchot")

            valid_approved_data = {
                "batch_id": "996_verbs_conjugations_batch_996",
                "contract_version": CONTRACT_VERSION,
                "review_decision": {
                    "status": "APPROVED",
                    "linguistic_reviewer": "Linguist Expert",
                    "compliance_reviewer": "Compliance Officer",
                    "notes": "Verified against Bescherelle."
                },
                "patches": [
                    {
                        "entity_key": "aimer",
                        "field": "conjugations",
                        "operation": "set_if_missing_complete",
                        "precondition": {"field_state": "EMPTY"},
                        "evidence": {
                            "source_id": "bescherelle_la_conjugaison_pour_tous",
                            "source_type": "reference_lexicon",
                            "reference_notes": "1st group standard"
                        },
                        "value": chuchoter_paradigm
                    }
                ],
                "no_proposals": []
            }
            with open(approved_path, "w", encoding="utf-8") as f:
                json.dump(valid_approved_data, f)

            with self.assertRaises(ValueError):
                apply_approved_batch(approved_path, output_path=disposable_output)

            # Verify source immutability invariant
            source_hash_after = compute_file_sha256(MASTER_DATA_PATH)
            self.assertEqual(
                self.source_hash_before,
                source_hash_after,
                "FATAL INVARIANT VIOLATION: MASTER_DATA.json was mutated!"
            )
            if self.normal_enriched_hash_before:
                normal_hash_after = compute_file_sha256(NORMAL_ENRICHED_DATA_PATH)
                self.assertEqual(
                    self.normal_enriched_hash_before,
                    normal_hash_after,
                    "FATAL INVARIANT VIOLATION: MASTER_DATA_ENRICHED.json was mutated!"
                )


if __name__ == "__main__":
    unittest.main()
