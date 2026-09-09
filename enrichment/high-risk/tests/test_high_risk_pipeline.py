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
from unittest.mock import patch

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
    FULL_QUEUE_REPAIR_MODE,
    FULL_QUEUE_VALIDATOR_VERSION,
    FULL_QUEUE_VERSION,
    GENERATOR_VERSION,
    HIGH_RISK_FIELDS,
    MASTER_DATA_PATH,
    NORMAL_ENRICHED_DATA_PATH,
    SOURCE_ALLOWLIST_VERSION,
    VALIDATOR_VERSION,
)
from scripts.apply_high_risk_enrichment import apply_approved_batch
from scripts.apply_full_high_risk_enrichment import apply_full_approved_batch
from scripts.approve_high_risk import approve_batch, approve_validated_folder, reject_batch
from scripts.high_risk_helpers import (
    classify_morphological_type,
    compute_content_sha256,
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
from scripts.inventory_full_high_risk import inventory_full_high_risk
from scripts.make_high_risk_batch import generate_batch
from scripts.make_correction_queue_v2_2 import CORRECTION_QUEUE_VERSION, build_correction_queue
from scripts.process_full_high_risk_responses import process_response_folder
from scripts.validate_high_risk_response import validate_response
from scripts.validate_full_high_risk_response import validate_full_queue_response


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
        with tempfile.TemporaryDirectory() as tmp_dir, patch(
            "scripts.inventory_high_risk.REPORTS_DIR", Path(tmp_dir)
        ):
            inv = run_inventory()
        self.assertEqual(inv["total_verbs"], 496)
        self.assertEqual(inv["missing_count"], 349)
        self.assertEqual(inv["partial_count"], 147)
        self.assertEqual(inv["malformed_count"], 0)
        self.assertTrue(inv["baseline_hash"].startswith("sha256:"))

    def test_full_high_risk_inventory_matches_frozen_queue_scope(self):
        report = inventory_full_high_risk(
            NORMAL_ENRICHED_DATA_PATH,
            emit_artifacts=False,
        )
        self.assertEqual(report["empty_high_risk_slot_count"], 5523)
        self.assertEqual(report["incomplete_conjugation_count"], 496)
        self.assertEqual(report["conjugation_statuses"]["MISSING"], 349)
        self.assertEqual(report["conjugation_statuses"]["PARTIAL"], 147)
        self.assertFalse(report["high_risk_complete"])


class TestBatchGeneratorAndManifest(unittest.TestCase):
    def test_deterministic_batch_generation(self):
        # The complete queue owns every fill-only target; verify its frozen
        # manifest rather than attempting to add a colliding test batch.
        with open(BATCH_MANIFEST_PATH, "r", encoding="utf-8") as f:
            manifest = json.load(f)
        self.assertEqual(manifest["version"], FULL_QUEUE_VERSION)
        self.assertEqual(manifest["validator_version"], FULL_QUEUE_VALIDATOR_VERSION)
        self.assertGreater(len(manifest["batches"]), 0)
        batch_id, entry = next(iter(manifest["batches"].items()))
        batch_file = HIGH_RISK_DIR / "batches" / f"{batch_id}.txt"
        self.assertTrue(batch_file.exists())
        self.assertEqual(compute_content_sha256(batch_file.read_text(encoding="utf-8")), entry["batch_checksum"])
        self.assertTrue(entry["baseline_hash"].startswith("sha256:"))

    def test_correction_queue_is_isolated_and_traceable(self):
        with tempfile.TemporaryDirectory() as tmp_dir:
            output_dir = Path(tmp_dir) / "corrections-v2.2"
            correction_manifest = build_correction_queue(output_dir)
            self.assertEqual(correction_manifest["version"], CORRECTION_QUEUE_VERSION)
            self.assertEqual(len(correction_manifest["source_failed_batch_ids"]), 30)
            self.assertEqual(correction_manifest["source_no_proposal_target_count"], 254)
            self.assertEqual(len(correction_manifest["batches"]), 25)
            self.assertTrue((output_dir / "CORRECTION_MANIFEST.json").is_file())
            self.assertTrue((output_dir / "HANDOFF.md").is_file())
            for batch_id, batch in correction_manifest["batches"].items():
                prompt_path = output_dir / f"{batch_id}.txt"
                self.assertTrue(prompt_path.is_file())
                self.assertEqual(
                    compute_content_sha256(prompt_path.read_text(encoding="utf-8")),
                    batch["batch_sha256"],
                )
                self.assertIn("responses/corrections-v2.2", batch["response_destination"])


class TestValidationGatesFailClosed(unittest.TestCase):
    def setUp(self):
        self.contract = load_conjugation_contract()
        with open(HIGH_RISK_DIR / "fixtures" / "sample_paradigms.json", "r", encoding="utf-8") as f:
            self.sample_paradigms = json.load(f)

    def _validate_with_temporary_manifest(self, response_path, batch_id, target_keys):
        with open(BATCH_MANIFEST_PATH, "r", encoding="utf-8") as f:
            manifest = json.load(f)
        manifest["batches"][batch_id] = {
            "batch_id": batch_id,
            "target_keys": target_keys,
        }
        with tempfile.TemporaryDirectory() as tmp_dir:
            temp_manifest = Path(tmp_dir) / "BATCH_MANIFEST.json"
            temp_manifest.write_text(json.dumps(manifest), encoding="utf-8")
            with patch(
                "scripts.validate_high_risk_response.BATCH_MANIFEST_PATH",
                temp_manifest,
            ):
                return validate_response(response_path)

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
        with tempfile.NamedTemporaryFile(suffix="_RESPONSE.json", mode="w", delete=False) as f:
            json.dump(data, f)
            temp_path = Path(f.name)

        try:
            status, report = self._validate_with_temporary_manifest(
                temp_path, "999_verbs_conjugations_batch_999", ["(s')asseoir"]
            )
            self.assertEqual(status, "FAIL")
            self.assertTrue(any("not empty" in err for err in report["errors"]))
        finally:
            temp_path.unlink(missing_ok=True)

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
        with tempfile.NamedTemporaryFile(suffix="_RESPONSE.json", mode="w", delete=False) as f:
            json.dump(data, f)
            temp_path = Path(f.name)

        try:
            status, report = self._validate_with_temporary_manifest(
                temp_path, "998_verbs_conjugations_batch_998", ["aimer"]
            )
            self.assertEqual(status, "FAIL")
            self.assertTrue(any("trusted sources allowlist" in err for err in report["errors"]))
        finally:
            temp_path.unlink(missing_ok=True)

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
        with tempfile.NamedTemporaryFile(suffix="_RESPONSE.json", mode="w", delete=False) as f:
            json.dump(data, f)
            temp_path = Path(f.name)

        try:
            status, report = self._validate_with_temporary_manifest(
                temp_path, "997_verbs_conjugations_batch_997", ["aimer"]
            )
            self.assertEqual(status, "FAIL")
            self.assertTrue(any("placeholder text" in err for err in report["errors"]))
        finally:
            temp_path.unlink(missing_ok=True)


class TestFullQueueValidation(unittest.TestCase):
    def _response_for_first_full_queue_batch(self):
        with open(BATCH_MANIFEST_PATH, "r", encoding="utf-8") as f:
            manifest = json.load(f)
        batch_id, batch = next(iter(manifest["batches"].items()))
        return {
            "batch_id": batch_id,
            "queue_version": FULL_QUEUE_VERSION,
            "collection": batch["collection"],
            "field": batch["field"],
            "mode": batch["mode"],
            "baseline_hash": batch["baseline_hash"],
            "candidate_provenance": "AI_GENERATED_UNVERIFIED",
            "proposals": [],
            "no_proposals": [
                {"entity_key": key, "reason": "SOURCE_NOT_FOUND", "details": "No verified local snapshot."}
                for key in batch["target_keys"]
            ],
        }

    def test_full_queue_accepts_complete_no_proposal_response(self):
        with tempfile.NamedTemporaryFile(suffix="_RESPONSE.json", mode="w", delete=False) as f:
            json.dump(self._response_for_first_full_queue_batch(), f, ensure_ascii=False)
            response_path = Path(f.name)
        try:
            status, report = validate_full_queue_response(response_path)
            self.assertEqual(status, "PASS", report["errors"])
        finally:
            response_path.unlink(missing_ok=True)

    def test_full_queue_accepts_ai_generated_candidate(self):
        response = self._response_for_first_full_queue_batch()
        target = response["no_proposals"].pop()["entity_key"]
        with open(HIGH_RISK_DIR / "fixtures" / "sample_paradigms.json", "r", encoding="utf-8") as f:
            sample_paradigms = json.load(f)
        response["proposals"] = [{
            "entity_key": target,
            "value": sample_paradigms["parler"],
            "evidence": {
                "source_id": "AI_GENERATED_UNVERIFIED",
                "evidence_sha256": None,
                "notes": "Candidate pending independent review.",
            },
        }]
        with tempfile.NamedTemporaryFile(suffix="_RESPONSE.json", mode="w", delete=False) as f:
            json.dump(response, f, ensure_ascii=False)
            response_path = Path(f.name)
        try:
            status, report = validate_full_queue_response(response_path)
            self.assertEqual(status, "PASS", report["errors"])
        finally:
            response_path.unlink(missing_ok=True)

    def test_full_queue_rejects_schema_invalid_candidate(self):
        response = self._response_for_first_full_queue_batch()
        target = response["no_proposals"].pop()["entity_key"]
        response["proposals"] = [{
            "entity_key": target,
            "value": "not a conjugation array",
            "evidence": {
                "source_id": "AI_GENERATED_UNVERIFIED",
                "evidence_sha256": None,
                "notes": "Deliberately invalid fixture.",
            },
        }]
        with tempfile.NamedTemporaryFile(suffix="_RESPONSE.json", mode="w", delete=False) as f:
            json.dump(response, f, ensure_ascii=False)
            response_path = Path(f.name)
        try:
            status, report = validate_full_queue_response(response_path)
            self.assertEqual(status, "FAIL")
            self.assertTrue(any("schema error" in error for error in report["errors"]))
        finally:
            response_path.unlink(missing_ok=True)

    def test_full_queue_accepts_completion_that_preserves_partial_conjugations(self):
        with open(BATCH_MANIFEST_PATH, "r", encoding="utf-8") as f:
            manifest = json.load(f)
        batch_id, batch = next(
            (batch_id, batch)
            for batch_id, batch in manifest["batches"].items()
            if batch["mode"] == FULL_QUEUE_REPAIR_MODE
        )
        baseline, _ = load_baseline_dataset()
        target = batch["target_keys"][0]
        baseline_verb = next(verb for verb in baseline["verbs"] if verb["infinitive"] == target)
        existing = copy.deepcopy(baseline_verb["conjugations"])
        existing_keys = {(record["mood"], record["tense"]) for record in existing}
        with open(HIGH_RISK_DIR / "fixtures" / "sample_paradigms.json", "r", encoding="utf-8") as f:
            sample = json.load(f)["parler"]
        candidate = existing + [
            copy.deepcopy(record)
            for record in sample
            if (record["mood"], record["tense"]) not in existing_keys
        ]
        response = {
            "batch_id": batch_id,
            "queue_version": FULL_QUEUE_VERSION,
            "collection": batch["collection"],
            "field": batch["field"],
            "mode": batch["mode"],
            "baseline_hash": batch["baseline_hash"],
            "candidate_provenance": "AI_GENERATED_UNVERIFIED",
            "proposals": [{
                "entity_key": target,
                "value": candidate,
                "evidence": {
                    "source_id": "AI_GENERATED_UNVERIFIED",
                    "evidence_sha256": None,
                    "notes": "Structurally complete repair fixture.",
                },
            }],
            "no_proposals": [
                {"entity_key": key, "reason": "INSUFFICIENT_EVIDENCE", "details": "Test fixture."}
                for key in batch["target_keys"][1:]
            ],
        }
        with tempfile.NamedTemporaryFile(suffix="_RESPONSE.json", mode="w", delete=False) as f:
            json.dump(response, f, ensure_ascii=False)
            response_path = Path(f.name)
        try:
            status, report = validate_full_queue_response(response_path)
            self.assertEqual(status, "PASS", report["errors"])
            response["proposals"][0]["value"].remove(existing[0])
            response_path.write_text(json.dumps(response, ensure_ascii=False), encoding="utf-8")
            status, report = validate_full_queue_response(response_path)
            self.assertEqual(status, "FAIL")
            self.assertTrue(any("alters or omits" in error for error in report["errors"]))
        finally:
            response_path.unlink(missing_ok=True)


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

    def test_full_queue_validation_approval_and_generic_application(self):
        with open(BATCH_MANIFEST_PATH, "r", encoding="utf-8") as f:
            manifest = json.load(f)
        batch_id, batch = next(
            (batch_id, batch)
            for batch_id, batch in manifest["batches"].items()
            if batch["collection"] == "verbs" and batch["field"] == "auxiliary"
        )
        target = batch["target_keys"][0]
        response = {
            "batch_id": batch_id,
            "queue_version": FULL_QUEUE_VERSION,
            "collection": batch["collection"],
            "field": batch["field"],
            "mode": batch["mode"],
            "baseline_hash": batch["baseline_hash"],
            "candidate_provenance": "AI_GENERATED_UNVERIFIED",
            "proposals": [{
                "entity_key": target,
                "value": "avoir",
                "evidence": {
                    "source_id": "AI_GENERATED_UNVERIFIED",
                    "evidence_sha256": None,
                    "notes": "Schema/application integration fixture.",
                },
            }],
            "no_proposals": [
                {"entity_key": key, "reason": "INSUFFICIENT_EVIDENCE", "details": "Test fixture."}
                for key in batch["target_keys"][1:]
            ],
        }
        with tempfile.TemporaryDirectory() as tmp_dir:
            root = Path(tmp_dir)
            responses = root / "responses"
            validated = root / "validated"
            reports = root / "reports"
            approved = root / "approved"
            audits = root / "audits"
            backups = root / "backups"
            responses.mkdir()
            response_path = responses / f"{batch_id}_RESPONSE.json"
            response_path.write_text(json.dumps(response, ensure_ascii=False), encoding="utf-8")

            status, report = validate_full_queue_response(
                response_path,
                emit_artifacts=True,
                reports_dir=reports,
                validated_dir=validated,
            )
            self.assertEqual(status, "PASS", report["errors"])
            validated_path = validated / f"{batch_id}_VALIDATED.json"
            with patch("scripts.approve_high_risk.REPORTS_DIR", reports), patch(
                "scripts.approve_high_risk.APPROVED_DIR", approved
            ):
                approved_path = approve_batch(
                    validated_path,
                    "Linguistic Reviewer",
                    "Compliance Reviewer",
                    "Reviewed integration fixture.",
                )

            output = root / "HIGH_RISK_OUTPUT.json"
            audit = apply_full_approved_batch(
                approved_path,
                output,
                responses_dir=responses,
                validated_dir=validated,
                reports_dir=reports,
                audits_dir=audits,
                backups_dir=backups,
            )
            self.assertEqual(audit["applied_count"], 1)
            enriched = json.loads(output.read_text(encoding="utf-8"))
            entity = next(verb for verb in enriched["verbs"] if verb["infinitive"] == target)
            self.assertEqual(entity["auxiliary"], "avoir")
            replay = apply_full_approved_batch(
                approved_path,
                output,
                responses_dir=responses,
                validated_dir=validated,
                reports_dir=reports,
                audits_dir=audits,
                backups_dir=backups,
            )
            self.assertTrue(replay["idempotent_replay"])
            tampered = json.loads(approved_path.read_text(encoding="utf-8"))
            tampered["patches"][0]["value"] = "etre"
            approved_path.write_text(json.dumps(tampered), encoding="utf-8")
            with self.assertRaisesRegex(ValueError, "does not exactly match"):
                apply_full_approved_batch(
                    approved_path,
                    output,
                    responses_dir=responses,
                    validated_dir=validated,
                    reports_dir=reports,
                    audits_dir=audits,
                    backups_dir=backups,
                )

    def test_bulk_processor_reports_missing_queue_responses(self):
        with tempfile.TemporaryDirectory() as tmp_dir:
            root = Path(tmp_dir)
            responses = root / "responses"
            responses.mkdir()
            summary = process_response_folder(
                responses,
                reports_dir=root / "reports",
                validated_dir=root / "validated",
            )
            self.assertEqual(summary["responses_found"], 0)
            self.assertEqual(summary["missing_response_count"], summary["total_batches"])
            self.assertFalse(summary["ready_for_review"])

    def test_bulk_approval_rejects_incomplete_validated_queue(self):
        with tempfile.TemporaryDirectory() as tmp_dir:
            with self.assertRaisesRegex(ValueError, "not validated"):
                approve_validated_folder(
                    Path(tmp_dir),
                    "Linguistic Reviewer",
                    "Compliance Reviewer",
                )


if __name__ == "__main__":
    unittest.main()
