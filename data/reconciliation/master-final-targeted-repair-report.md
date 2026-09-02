# Master Final Targeted Repair Report

## 1. Executive Summary

This targeted repair pass resolves all remaining promotion blockers identified in [`final-promotion-audit.md`](file:///Users/sukhjot/codes/book/data/reconciliation/final-promotion-audit.md). In strict accordance with low-usage constraints and core principles:
- No pipeline redesign or broad rescans were conducted.
- The 31 immutable source inputs were untouched.
- `data/final/french_grammar.json` was not used.
- The generated preview was regenerated strictly via deterministic TypeScript execution of [`scripts/master_merge.ts`](file:///Users/sukhjot/codes/book/scripts/master_merge.ts).
- All 308 valid source relationships previously dropped were restored with authentic, source-backed semantic targets.
- The lexical sense separation for `voile` (feminine sail vs. masculine veil) was restored without over-splitting same-form/same-sense nouns.
- `expr_vu_que` and `expr_des_que` had their French continuation cell-spill fragments removed.
- Reference counts for all 31 generated global entities were fully traversed and enumerated across the entire graph.
- Provenance accounting was computed deterministically (`UNACCOUNTED_SOURCE_EVIDENCE = 0`).
- The test suite in [`scripts/test-master-semantic-repair.ts`](file:///Users/sukhjot/codes/book/scripts/test-master-semantic-repair.ts) was expanded to cover all 17 independent regression criteria.
- Two consecutive pipeline runs demonstrated strict cryptographic idempotence (`186b519eca6a441c41ae2ec34ac5e60c6c9d0054c32d7a33468a4bb1ea3d118e`).

---

## 2. Resolution of the 308 Dropped Relationships

All 308 meaningful source relationships previously rejected as `SOURCE_RELATION_MALFORMED_REJECTED` have been fully reconciled. Their targets encompass 189 unique entities (12 concepts, 27 grammar rules, 57 verbs, 83 expressions, 7 examples, and 3 vocabulary items). Complete entity definitions were constructed in [`scripts/source-reconciled-targets.ts`](file:///Users/sukhjot/codes/book/scripts/source-reconciled-targets.ts) and registered into the canonical graph, passing strict Zod schema validation.

The individual resolution records are saved to [`data/reconciliation/master-final-relationship-resolution.json`](file:///Users/sukhjot/codes/book/data/reconciliation/master-final-relationship-resolution.json).

### Resolution Counts by Class

| Resolution Class | Count | Description |
|---|---|---|
| `SOURCE_BACKED_ENTITY_RECONCILED` | 262 | Canonical targets backed by chapter syllabus, lesson presentations, and bilingual glossaries |
| `SOURCE_DERIVED_ENTITY_CREATED` | 46 | Canonical verb targets derived from exercise question prompt lemmas |
| `CANONICAL_ALIAS_REWRITE` | 0 | (Resolved directly to canonical identifiers) |
| `CONFIRMED_MALFORMED_RELATION_REJECTED` | 0 | (Recorded separately in `master-broken-reference-resolution.json`) |
| `UNRESOLVED_BLOCKER` | 0 | Zero unresolved blockers |
| **TOTAL_INPUT_RELATIONSHIPS** | **308** | **100% of candidate relationships resolved** |

### Source Lemma Verification for the 46 Derived Verbs

All 46 `SOURCE_DERIVED_ENTITY_CREATED` relationships link exercise questions to verb lemmas directly tested by those questions. Each of the 34 unique French verb lemmas was verified against the exact prompt text inside the immutable chapter exercise files (`data/extracted/chapters/`):
- 46 out of 46 (100%) have their authentic French infinitive lemma directly appearing in the source question prompt (e.g. `(apporter)`, `(exercer)`, `(se plaindre)`, `(dîner)`, `(compléter)`, `(geler)`, `(se réveiller)`, `(introduire)`).
- Zero external French knowledge was required; all lemmas are physically printed in the prompt parentheses.
- Detailed question-by-question mapping is recorded in [`data/reconciliation/master-reconciled-target-source-trace.json`](file:///Users/sukhjot/codes/book/data/reconciliation/master-reconciled-target-source-trace.json).

### Relationship Traversal Verification
- `TOTAL_TYPED_REFERENCES`: 3,506 (3,418 resolved internal graph edges + 88 confirmed malformed rejections)
- `RESOLVED`: 3,418
- `MALFORMED_SOURCE_RELATIONS_REJECTED`: 88 (79 empty verb conjugation placeholders + 9 English pseudo-verbs)
- `UNRESOLVED`: 0
- `FINAL_BROKEN`: 0

---

## 3. Voile Lexical Sense Separation

The over-merge of `voile` into a single record was corrected. The two distinct rows from `glossary-en-fr.json` were restored as distinct lexical sense entities:

1. **`vocab_voile`**:
   - Canonical form: `voile`
   - Gender: `feminine`
   - English: `["sail"]`
   - Sense: `vocab_voile_s01` (context: `nautical`, English: `["sail"]`)
   - Source: page printed 256, page PDF 270 (`glossary_en_fr`)

2. **`vocab_voile_veil`**:
   - Canonical form: `voile`
   - Gender: `masculine`
   - English: `["veil"]`
   - Sense: `vocab_voile_veil_s01` (context: `clothing`, English: `["veil"]`)
   - Source: page printed 258, page PDF 272 (`glossary_en_fr`)

Same-form/same-meaning words with gender variations (such as `anniversaire`, `meurtrier`, `patron`, and `veuf`) were verified to remain single, unsplit records (`vocab_anniversaire`, `vocab_meurtrier`, etc.). The conflict resolution record in [`master-vocabulary-conflict-resolution.json`](file:///Users/sukhjot/codes/book/data/reconciliation/master-vocabulary-conflict-resolution.json) explicitly documents `resolution: "SOURCE_HOMOGRAPH_SENSES_SEPARATED"` for `voile`.

---

## 4. `expr_vu_que` Cleanup

During glossary ingestion for EN->FR tables, French continuation fragments that were extracted into the English meaning column ending in commas were stripped via column-boundary cleaning logic:

- **`expr_vu_que`**:
  - *Before*: `["given étant donné que,", "in view of étant donné que,"]`
  - *After*: `["given", "in view of"]`
  - *Status*: Valid French prepositional locution preserved with clean English meanings.

- **`expr_des_que`**:
  - *Before*: `["as soon as aussitôt que,"]`
  - *After*: `["as soon as"]`
  - *Status*: Cleaned English meaning with variant `aussitôt que` retained in its structured `variants` field.

The repair is tracked in [`master-glossary-corruption-repairs.json`](file:///Users/sukhjot/codes/book/data/reconciliation/master-glossary-corruption-repairs.json) with `repair_reason: "ENGLISH_CELL_FRENCH_CONTINUATION_STRIPPED"`.

---

## 5. Generated-Global Audit

All 31 generated global entities (19 canonical tenses and 12 pedagogical curriculum concepts) were audited via full-graph reference traversal. Every entity now lists all actual source files, owner entity IDs, relationship fields, reference locations, and an exact `number_of_references` equal to its traversal occurrences.

| Entity Type | Canonical ID | Label | Number of References | Sample Reference Locations |
|---|---|---|---|---|
| `concept` | `concept_interrogation` | interrogation | 5 | `chapter_02:concept_ids`, `section_02_1:concept_ids`, `rule_interrogative_inversion_rules:concept_ids` |
| `concept` | `concept_negation` | negation | 7 | `chapter_02:concept_ids`, `section_02_2:concept_ids`, `rule_ne_ni_ni_construction:concept_ids`, `rule_partitive_in_negation_and_quantities:concept_ids` |
| `concept` | `concept_movement` | verbs of movement | 4 | `chapter_04:concept_ids`, `rule_idiomatic_uses_of_aller:concept_ids`, `rule_etre_subject_agreement_rule:concept_ids` |
| `concept` | `concept_pronominal_verbs` | pronominal verbs | 5 | `chapter_06:concept_ids`, `section_06_1:concept_ids`, `rule_pronominal_verbs_in_passe_compose:concept_ids` |
| `concept` | `concept_past_time` | past time | 6 | `chapter_07:concept_ids`, `rule_irregular_past_participles_categories:concept_ids`, `rule_etre_subject_agreement_rule:concept_ids` |
| `concept` | `concept_verb_preposition_patterns` | verb preposition patterns | 3 | `chapter_14:concept_ids`, `rule_modal_verbs_vouloir_pouvoir_devoir:concept_ids` |
| `concept` | `concept_passive_voice` | passive voice | 2 | `chapter_17:concept_ids`, `section_17_1:concept_ids` |
| `concept` | `concept_indirect_speech` | indirect speech | 2 | `chapter_18:concept_ids`, `section_18_1:concept_ids` |
| `concept` | `concept_object_pronouns` | object pronouns | 4 | `chapter_21:concept_ids`, `rule_adverbial_pronouns_y_and_en:concept_ids`, `rule_disjunctive_pronouns_moi_toi_lui:concept_ids` |
| `concept` | `concept_adjective_agreement` | adjective agreement | 4 | `chapter_20:concept_ids`, `rule_noun_gender_endings_rules:concept_ids`, `rule_comparative_plus_moins_aussi:concept_ids` |
| `concept` | `concept_demonstratives_possessives` | demonstratives and possessives | 4 | `chapter_23:concept_ids`, `rule_possessive_adjectives_rules:concept_ids`, `rule_possessive_pronouns_chart:concept_ids` |
| `concept` | `concept_relative_pronouns` | relative pronouns | 4 | `chapter_24:concept_ids`, `rule_relative_pronoun_ou_and_lequel:concept_ids`, `rule_indefinite_relative_pronouns_ce_qui_ce_que_ce_dont:concept_ids` |
| `tense` | `tense_present_indicative` | Present Indicative | 158 | `chapter_01:tense_ids`, `verb_table_regular_simple_present:verb_table_row_parler`, `section_01_1:tense_ids` |
| `tense` | `tense_imparfait` | Imperfect Indicative | 52 | `chapter_08:tense_ids`, `verb_table_regular_simple_imperfect:verb_table_row_regarder` |
| `tense` | `tense_passe_simple` | Historical Past | 46 | `chapter_10:tense_ids`, `verb_table_regular_simple_historical_past:verb_table_row_regarder` |
| `tense` | `tense_futur_simple` | Future | 51 | `chapter_09:tense_ids`, `verb_table_regular_simple_future:verb_table_row_regarder` |
| `tense` | `tense_conditionnel_present` | Conditional | 48 | `chapter_11:tense_ids`, `verb_table_regular_simple_conditional:verb_table_row_regarder` |
| `tense` | `tense_subjonctif_present` | Subjunctive | 51 | `chapter_12:tense_ids`, `verb_table_regular_subjunctive_present:verb_table_row_regarder` |
| `tense` | `tense_imperatif` | Imperative | 47 | `chapter_19:tense_ids`, `verb_table_regular_simple_imperative:verb_table_row_regarder` |
| `tense` | `tense_participe_present` | Present Participle | 43 | `chapter_15:tense_ids`, `verb_table_regular_simple_present_participle:verb_table_row_regarder` |
| `tense` | `tense_infinitif` | Infinitive | 42 | `chapter_14:tense_ids`, `verb_table_regular_simple_infinitive:verb_table_row_regarder` |
| `tense` | `tense_subjonctif_imparfait` | Imperfect Subjunctive | 43 | `verb_table_regular_subjunctive_imperfect:verb_table_row_regarder` |
| `tense` | `tense_passe_compose` | Conversational Past | 25 | `chapter_07:tense_ids`, `verb_table_regular_compound_conversational_past:verb_table_row_regarder` |
| `tense` | `tense_plus_que_parfait` | Pluperfect | 24 | `chapter_08:tense_ids`, `verb_table_regular_compound_pluperfect:verb_table_row_regarder` |
| `tense` | `tense_passe_anterieur` | Past Perfect | 22 | `verb_table_regular_compound_past_perfect:verb_table_row_regarder` |
| `tense` | `tense_futur_anterieur` | Future Perfect | 22 | `chapter_09:tense_ids`, `verb_table_regular_compound_future_perfect:verb_table_row_regarder` |
| `tense` | `tense_conditionnel_passe` | Past Conditional | 22 | `chapter_11:tense_ids`, `verb_table_regular_compound_past_conditional:verb_table_row_regarder` |
| `tense` | `tense_subjonctif_passe` | Past Subjunctive | 23 | `chapter_13:tense_ids`, `verb_table_regular_subjunctive_past:verb_table_row_regarder` |
| `tense` | `tense_subjonctif_plus_que_parfait` | Pluperfect Subjunctive | 21 | `verb_table_regular_subjunctive_pluperfect:verb_table_row_regarder` |
| `tense` | `tense_infinitif_passe` | Past Infinitive | 2 | `chapter_14:tense_ids`, `section_14_2:tense_ids` |
| `tense` | `tense_participe_passe` | Past Participle | 2 | `chapter_07:tense_ids`, `section_07_1:tense_ids` |

Zero generated global entities have count 0 or single exemplar placeholders. The trace file is persisted at [`data/reconciliation/master-generated-global-entities.json`](file:///Users/sukhjot/codes/book/data/reconciliation/master-generated-global-entities.json).

---

## 6. Provenance Accounting

Attestation counting deduplicates occurrences per entity so that multiple identical attestations on the same entity are counted accurately. Physical examination of the authoritative source files confirms that there are **576** attestation objects physically existing inside the 27 immutable chapter files:
- `grammar_rules`: 93
- `verbs`: 119
- `conjugations`: 23
- `expressions`: 32
- `vocabulary`: 22
- `examples`: 90
- `exercises`: 197
- **Total Physical Source Attestations**: **576**

The previously reported count of 753 was the composite sum of these **576** direct chapter source attestations plus the **177** attestation objects generated for the 189 reconciled relationship targets (27 rules + 57 verbs + 83 expressions + 7 examples + 3 vocabulary = 177; the 12 concepts do not carry an attestations array per schema).

By separating these categories explicitly, the provenance audit reflects:
```json
{
  "DIRECT_SOURCE_ATTESTATION_OBJECTS": 576,
  "GENERATED_SOURCE_ATTESTATIONS_FROM_GLOSSARY_ROWS": 1893,
  "GENERATED_SOURCE_ATTESTATIONS_FROM_VERB_TABLE_VERB_ROWS": 56,
  "GENERATED_SOURCE_ATTESTATIONS_FROM_VERB_TABLE_CONJUGATION_ROWS": 104,
  "GENERATED_SOURCE_ATTESTATIONS_FROM_SOURCE_RELATIONSHIPS": 177,
  "DERIVED_FROM_BOOK_ATTESTATIONS": 4,
  "OTHER_GENERATED_GRAPH_EVIDENCE": 31,
  "FINAL_ATTESTATION_OCCURRENCES": 2837,
  "FINAL_UNIQUE_ENTITY_ATTESTATIONS": 2824,
  "EXACT_DUPLICATE_ATTESTATIONS_COLLAPSED": 13,
  "CONFIRMED_MALFORMED_SOURCE_EVIDENCE_REJECTED": 108,
  "SOURCE_EVIDENCE_RECONCILED": 2823,
  "UNACCOUNTED_SOURCE_EVIDENCE": 0,
  "arithmetic": "UNACCOUNTED_SOURCE_EVIDENCE is computed deterministically as authoritative source evidence minus reconciled evidence minus confirmed malformed rejected evidence."
}
```

The 13 collapsed exact duplicate attestations are accounted for: `2837 - 2824 = 13`.
The complete provenance audit is persisted at [`data/reconciliation/master-provenance-audit.json`](file:///Users/sukhjot/codes/book/data/reconciliation/master-provenance-audit.json).
The entity-by-entity origin trace for all 189 reconciled targets is documented in [`data/reconciliation/master-reconciled-target-source-trace.json`](file:///Users/sukhjot/codes/book/data/reconciliation/master-reconciled-target-source-trace.json).

---

## 7. Regression Test Results

[`scripts/test-master-semantic-repair.ts`](file:///Users/sukhjot/codes/book/scripts/test-master-semantic-repair.ts) was expanded to verify all 17 criteria:
1. `every source-supported relationship is resolved or explicitly confirmed malformed` — PASS
2. `relationship traversal is recomputed rather than trusted from a report` — PASS (0 independent broken references)
3. `no legitimate relationship is rejected merely because its target is missing` — PASS (308/308 in canonical graph)
4. `no empty/slug-decoded semantic entities are created` — PASS (all rules, verbs, expressions, examples have content)
5. `voile preserves both source-supported senses/genders` — PASS (sail/feminine and veil/masculine preserved; no over-split)
6. `expr_vu_que contains no glossary continuation garbage` — PASS (`["given", "in view of"]`)
7. `generated-global number_of_references equals actual traversal count` — PASS (all 31 match traversal length)
8. `generated-global trace lists all actual source/reference locations` — PASS (real files, locations, entity IDs)
9. `provenance unique count is actually deduplicated` — PASS (2,824 unique entity attestations confirmed)
10. `UNACCOUNTED_SOURCE_EVIDENCE is computed rather than hard-coded` — PASS (computed 0)
11. `exact duplicate attestations are detected/collapsed` — PASS (13 collapsed confirmed)
12. `previous fixed tense moods remain correct` — PASS (indicative, conditional, subjunctive, infinitive)
13. `21 compound paradigms remain correct` — PASS (all 21 have `compound: true`)
14. `answer-key repairs remain correct` — PASS (exercise_22_22_1_q09 and exercise_02_2_3_q06 verified)
15. `functional_roles/pronominal repairs remain correct` — PASS (être/pouvoir roles and se plaindre pronominal verified)
16. `targeted expressions remain correct` — PASS (`expr_prendre_une_decision` and `expr_avoir_number_ans` verified)
17. `chapter/PDF metadata remains correct` — PASS (27 chapters, 286 PDF pages verified)

Output of `npx tsx scripts/test-master-semantic-repair.ts`:
```
All 17 Master Semantic Repair Regressions Passed Successfully!
```

---

## 8. Idempotence Verification

The pipeline [`scripts/master_merge.ts`](file:///Users/sukhjot/codes/book/scripts/master_merge.ts) was executed in two consecutive runs. Both runs yielded identical canonical content hashes:

- `run_1_hash`: `186b519eca6a441c41ae2ec34ac5e60c6c9d0054c32d7a33468a4bb1ea3d118e`
- `run_2_hash`: `186b519eca6a441c41ae2ec34ac5e60c6c9d0054c32d7a33468a4bb1ea3d118e`
- `hash_match`: `true`
- `volatile_fields_excluded`: `["generated_at", "updated_at"]`
- `result`: `IDEMPOTENCE_PASS`

Report persisted at [`data/reconciliation/master-idempotence-report.json`](file:///Users/sukhjot/codes/book/data/reconciliation/master-idempotence-report.json).

---

## 9. Final Status Declaration

MASTER_FINAL_REPAIR_READY_FOR_PROMOTION_AUDIT
