# Flash Final Pre-Promotion Audit

## Executive Summary

This independent pre-promotion audit evaluated the frozen French grammar master dataset (`data/final/french_grammar_master.preview.json`) and its reconciliation artifacts following the final blocker repair pass. 

All primary audit questions have been deterministically evaluated against authoritative inputs (the 27 immutable chapter files, bilingual glossaries, verb tables, answer keys, and source PDF references):
1. **The 308 previously dropped relationships** are 100% restored through authentic, source-backed evidence (262 `SOURCE_BACKED_ENTITY_RECONCILED` and 46 `SOURCE_DERIVED_ENTITY_CREATED`). Zero relationships were fabricated from slug decoding or guess-work.
2. **The 189 reconstructed targets** (12 concepts, 27 grammar rules, 57 verbs, 83 expressions, 7 examples, 3 vocabulary items) have genuine source backing in immutable chapter syllabus, lesson explanations, section entity arrays, and exercise prompts.
3. **The 46 derived verb relationships** represent 34 unique French infinitive lemmas physically present in exercise question prompt parentheses in the immutable chapter JSON files (0 mismatches).
4. **The relationship graph** achieves complete integrity: 3,418 resolved internal typed edges, 88 confirmed malformed extractions safely rejected (79 empty conjugation paradigms and 9 pseudo-English verb tokens), 0 broken links, and 0 unresolved blockers.
5. **Provenance accounting** is mathematically sound and transparent: 576 direct physical chapter attestations are cleanly distinguished from 177 relationship-reconciled target attestations and table/glossary evidence; duplicate attestations are collapsed (13); and `UNACCOUNTED_SOURCE_EVIDENCE` is computed deterministically as 0.
6. **Targeted semantic regressions remain resolved**: `voile` preserves two distinct lexical entries (feminine sail vs. masculine veil); `expr_vu_que` and `expr_des_que` have English continuation fragments stripped; `merci` is retained; and all six targeted expressions are intact.
7. **Idempotence** is confirmed via `data/reconciliation/master-idempotence-report.json` with identical two-run hashes and `IDEMPOTENCE_PASS`.

The dataset is safe, source-faithful, and ready for final promotion.

---

## Usage-Efficient Method

In strict adherence to the read-only, low-usage mode:
- No files were modified, no pipeline regeneration was initiated, and the dataset was not promoted.
- Verification relied strictly on deterministic Node.js and TypeScript evaluation scripts against the 31 immutable source inputs and frozen master artifacts.
- Exact programmatic traversal, prompt lemma extraction, and attestation counting were executed in place of manual inspection loops.
- Source text validation for disputed claims was conducted directly against `data/extracted/chapters/` and `data/extracted/backmatter/`.

---

## 308 Relationship Restoration

The 308 relationships previously dropped in the second repair cycle were audited programmatically across entity type, relationship field, source chapter, and resolution class.

### Programmatic Distribution

| Resolution Class | Count | Description |
|---|---:|---|
| `SOURCE_BACKED_ENTITY_RECONCILED` | 262 | Canonical targets backed by chapter syllabus, lesson presentations, and bilingual glossaries |
| `SOURCE_DERIVED_ENTITY_CREATED` | 46 | Canonical verb targets derived from exercise prompt parenthetical lemmas |
| **Total** | **308** | **100% resolved** |

### Breakdown by Relationship Field

| Relationship Field | Count | Resolution Status |
|---|---:|---|
| `concept_ids` | 99 | All 99 resolve to 12 pedagogical curriculum concepts |
| `expression_ids` | 83 | All 83 resolve to authentic lesson expressions |
| `relations.verbs` | 67 | 46 prompt-derived verbs + 21 lesson-presented verbs |
| `grammar_rule_ids` | 27 | All 27 resolve to chapter lesson grammar rules |
| `verb_ids` | 20 | All 20 resolve to section-presented verb lemmas |
| `example_ids` | 7 | All 7 resolve to authentic sentence examples |
| `related_vocabulary_ids` | 2 | Linked from expressions (`vocab_besoin`, `vocab_envie`) |
| `relations.grammar_rules` | 1 | Inter-rule relationship resolved |
| `mood_governance.trigger_expression_ids` | 1 | Subjunctive trigger expression resolved |
| `vocabulary_ids` | 1 | Lesson-presented vocabulary item (`vocab_par_coeur`) |

### Verification Against Antipatterns
- **Pattern A Check (Missing target -> Decode ID -> Invent semantic entity)**: PASS. No entity consists of a name/slug shell. All rules, verbs, expressions, and examples carry complete semantic text derived from chapter presentations.
- **Pattern B Check (Missing target -> Reject relationship)**: PASS. Zero valid relationships were rejected due to absent targets.

### Restoration Classification
- `VALID_SOURCE_BACKED_RESTORATIONS`: 308 (100%)
- `QUESTIONABLE_RESTORATIONS`: 0
- `IMPROPER_RESTORATIONS`: 0
- `UNRESOLVED`: 0

---

## 189 Reconstructed Targets

The 189 reconstructed canonical targets in `scripts/source-reconciled-targets.ts` were audited across all six entity classes to verify that their semantic content derives from authentic source evidence rather than ID guesswork:

1. **Concepts (12 targets)**:
   - Backed by chapter syllabus titles and section curriculum topics (e.g., `concept_interrogation` from Chapter 2; `concept_movement` from Chapter 4; `concept_pronominal_verbs` from Chapter 6; `concept_past_time` from Chapter 7; `concept_relative_pronouns` from Chapter 24).
   - Every concept has structured pedagogical metadata and full-graph reference linkages.
2. **Grammar Rules (27 targets)**:
   - 27 of 27 (100%) are explicitly enumerated in `grammar_rule_ids` arrays of immutable chapter sections.
   - Detailed rule explanations and exemplar sentences match the printed lesson text (e.g., `rule_interrogative_inversion_rules` captures euphonic `-t-` inversion rules from Chapter 2, page 19; `rule_ne_ni_ni_construction` captures neither...nor negation from Chapter 2, page 22).
3. **Verbs (57 targets)**:
   - 34 unique lemmas (46 relationships) derived from exercise prompts.
   - 23 unique verbs presented in chapter lesson sections (e.g., reciprocal verbs `s'aimer`, `se parler`, `se téléphoner`, `s'écrire` in Section 06.02, page 50; auxiliary/directional verbs in Chapter 7).
4. **Expressions (83 targets)**:
   - 83 of 83 (100%) are explicitly referenced in chapter section `expression_ids` arrays.
   - All have non-empty `canonical_form` and valid `english` glosses (e.g., `expr_a_condition_que_subjonctif`, `expr_aller_bien`, `expr_apprendre_a_inf`).
5. **Examples (7 targets)**:
   - 7 of 7 (100%) correspond to authentic example sentences from lesson sections with complete French and English text (e.g., `example_disjunctive_001`: *"Qui est là ? — Moi !"* / *"Who is there? — Me!"*).
6. **Vocabulary (3 targets)**:
   - `vocab_besoin` and `vocab_envie` linked via `related_vocabulary_ids` on `expr_avoir_besoin_de` and `expr_avoir_envie_de` in Chapter 3; `vocab_par_coeur` presented in Section 03.03.

Zero reconstructed targets were synthesized from empty shells or ID-only heuristics.

---

## 46 Derived Verb Relationships

The 46 `SOURCE_DERIVED_ENTITY_CREATED` relationships were tested against the 27 immutable chapter files:
- **Total Relationships Evaluated**: 46
- **Unique Verb Lemmas**: 34
- **Question Prompt Mismatches**: 0
- **Prompt Lemma Verification**: 46 of 46 (100%) exercise questions physically contain the exact French infinitive lemma within parentheses in the prompt text:
  - `exercise_01_1_1_q04` -> `(apporter)` in *"Tu (apporter) toujours des fleurs."*
  - `exercise_01_1_3_q08` -> `(exercer)` in *"Ils (exercer) une grande influence."*
  - `exercise_01_1_5_q07` -> `(s’appeler)` in *"Elle (s’appeler) Juliette."*
  - `exercise_05_5_4_q10` -> `(se plaindre)` in *"Elle (se plaindre) tout le temps."*
  - `exercise_06_6_1_q07` -> `(se balader)` in *"Vous (se balader) dans le parc."*
  - Additional prompt-verified lemmas: `(geler)`, `(introduire)`, `(se réveiller)`, `(s’organiser)`, `(s’occuper)`, `(sous-titrer)`, `(trembler)`.
- **Linguistic Integrity**: Pronominal status is preserved; no English tokens or pseudo-verbs were converted into French verbs; zero outside dictionary hallucination was introduced.

---

## Source Trace Quality

Inspection of `data/reconciliation/master-reconciled-target-source-trace.json` confirmed:
- **Mappability**: 189 of 189 (100%) trace records identify real source entity IDs (`source_entity_ids`) that map deterministically to specific immutable chapter files (`data/extracted/chapters/chapter-01.json` through `chapter-27.json`).
- **Trace Evidence Distinction**: Literal source text (such as exact prompt quotes and chapter section titles) is explicitly separated from structural context notes.
- **Classification**: Each entry correctly specifies `attestation_classification` (e.g. `derived_from_question_prompt` for the 34 prompt verbs vs. `direct_chapter_lesson_attestation` for syllabus/lesson entities).

---

## Relationship Graph

Full independent typed traversal of the entire master entity graph was recomputed:
- `TOTAL_TYPED_REFERENCES`: 3,506 (3,418 resolved internal edges + 88 confirmed malformed rejections)
- `RESOLVED_INTERNAL_REFERENCES`: 3,418
- `CONFIRMED_MALFORMED_REJECTIONS`: 88
- `UNRESOLVED_REFERENCES`: 0
- `FINAL_BROKEN_REFERENCES`: 0

### Audit of the 88 Rejected References
The 88 rejected references in `data/reconciliation/master-broken-reference-resolution.json` were inspected:
- **79 Empty Conjugation Placeholders**: Missing paradigms that have no corresponding entry in the authoritative source verb tables (`verb-tables.json`).
- **9 Pseudo-English Verb References**: Tokens extracted mistakenly from English exercise prompts (`verb_better`, `verb_fewer`, `verb_her`).
- **Conclusion**: No genuine French grammatical entity or source-supported relationship is hidden within the 88 rejected references.

---

## Provenance

Provenance accounting in `data/reconciliation/master-provenance-audit.json` was independently verified against raw counts:

| Provenance Metric | Value | Verification Finding |
|---|---:|---|
| `DIRECT_SOURCE_ATTESTATION_OBJECTS` | 576 | Physically verified in the 27 immutable chapter files (93 rules, 119 verbs, 23 conjugations, 32 expressions, 22 vocab, 90 examples, 197 exercises) |
| `GENERATED_SOURCE_ATTESTATIONS_FROM_GLOSSARY_ROWS` | 1,893 | Verified from EN->FR and FR->EN glossary entries |
| `GENERATED_SOURCE_ATTESTATIONS_FROM_VERB_TABLE_VERB_ROWS` | 56 | Verified from unique verb table headwords |
| `GENERATED_SOURCE_ATTESTATIONS_FROM_VERB_TABLE_CONJUGATION_ROWS` | 104 | Verified from full table conjugation paradigms |
| `GENERATED_SOURCE_ATTESTATIONS_FROM_SOURCE_RELATIONSHIPS` | 177 | Reconciled target attestations (27 rules + 57 verbs + 83 expressions + 7 examples + 3 vocabulary; concepts do not carry attestations) |
| `DERIVED_FROM_BOOK_ATTESTATIONS` | 4 | Table-only verbs |
| `OTHER_GENERATED_GRAPH_EVIDENCE` | 31 | 19 tenses + 12 concepts |
| `FINAL_ATTESTATION_OCCURRENCES` | 2,837 | Total raw attestation instances |
| `FINAL_UNIQUE_ENTITY_ATTESTATIONS` | 2,824 | Deduplicated unique entity attestation keys |
| `EXACT_DUPLICATE_ATTESTATIONS_COLLAPSED` | 13 | Exactly `2,837 - 2,824 = 13` |
| `CONFIRMED_MALFORMED_SOURCE_EVIDENCE_REJECTED` | 108 | Explicit malformed evidence exclusions |
| `SOURCE_EVIDENCE_RECONCILED` | 2,823 | Harmonized canonical evidence base |
| `UNACCOUNTED_SOURCE_EVIDENCE` | 0 | Deterministically computed, not hardcoded |

---

## Generated Global Entities

Inspection of `data/reconciliation/master-generated-global-entities.json` verified all 31 generated global entities (19 canonical tenses and 12 concepts):
- **Reference Traversal Equality**: For all 31 entities, `number_of_references == reference_locations.length` (0 mismatches; counts range from 2 to 158 across chapters, sections, rules, conjugations, and exercises).
- **Placeholder Elimination**: 0 entities have `"synthesized"` in `source_files`. All list real source files and real owner entity IDs.
- **Tense Distribution & Mood Integrity**: All 19 tenses have source-safe moods (8 indicative, 4 subjunctive, 2 conditional, 2 infinitive, 1 imperative, 1 gerund, 1 participle). None use `"other"`.
- **Consolidation**: The 11 previously duplicated English/French tense pairs remain cleanly unified.

---

## Targeted Semantic Regression Checks

Independent inspection of `data/final/french_grammar_master.preview.json` confirms:
1. **`voile` Lexical Senses**:
   - `vocab_voile`: feminine noun, `english: ["sail"]`, context: nautical.
   - `vocab_voile_veil`: masculine noun, `english: ["veil"]`, context: clothing.
   - Unsplit check: Same-form/same-meaning words (`anniversaire`, `meurtrier`, `patron`, `veuf`) remain single unsplit records.
2. **`expr_vu_que` & `expr_des_que`**:
   - `expr_vu_que`: English meanings are cleanly `["given", "in view of"]` with continuation fragments (`étant donné que,`) eliminated.
   - `expr_des_que`: English meaning is `["as soon as"]`; variant `aussitôt que` is properly preserved in structured `variants`.
3. **`vocab_merci`**:
   - Present with `english: ["thank you"]`, backed by glossary EN->FR attestation (printed page 258 / PDF page 272).
4. **Targeted Expressions**:
   - `expr_prendre_une_decision` (*prendre une décision*): intact, linked to `verb_prendre`.
   - `expr_venir_chercher_qqn` (*venir chercher quelqu'un*): intact.
   - `expr_avoir_number_ans` (*avoir [NUMBER] ans*): intact with productive `NUMBER` pattern slot.
   - `expr_demander_de_inf` (*demander de + infinitif*): intact.
   - `expr_penser_a` (*penser à*): intact.
   - `expr_rendre_visite_a` (*rendre visite à*): intact.

---

## Previous Fixes Preservation

Deterministic verification confirmed all previously established baseline metrics:
- **Chapters**: 27 / 27 present.
- **Exercises**: 197 / 197 present.
- **Questions & Answers**: 1,872 / 1,872 present.
- **Duplicate Answer Identities**: 0.
- **Boundary Answer Repairs**:
  - `exercise_22_22_1_q09`: *"Ses idées sont bonnes? —Oui, ses idées sont meilleures que les nôtres."* (continuation repaired).
  - `exercise_02_2_3_q06`: *"Elle saisit l’occasion."* (footer contamination stripped).
- **Imperative Paradigms**: 3 / 3 present.
- **Compound Paradigms**: 21 / 21 marked `compound: true`, anchored to source compound tables.
- **Table Conjugations**: 104 / 104 carry valid table provenance.
- **Functional Roles**: `verb_etre` has `auxiliary`; `verb_pouvoir` has `modal`.
- **Pronominal Flags**: `verb_se_plaindre`, `verb_se_depecher`, `verb_se_souvenir`, `verb_se_tromper`, `verb_se_lever`, `verb_se_coucher`, and `verb_s_appeler` all have `pronominal: true`.
- **PDF Page Count**: Exactly 286.
- **Generic Shells**: 0 entities tagged `source_reference_target`.

---

## Regression Test Quality

`scripts/test-master-semantic-repair.ts` was reviewed and executed (`npx tsx scripts/test-master-semantic-repair.ts`):
- All 17 regression criteria passed.
- **Substantive Data Testing**: The suite independently parses the preview JSON schema, constructs the complete canonical ID set, traverses relationship arrays across all 12 dataset collections, recomputes unique attestation keys, and tests semantic contents directly.
- **Finding**: While the test suite independently verifies question boundaries and answer repairs, the total answer count (1,872) is verified directly in data rather than asserted as a single numeric literal in the test script. This does not weaken the audit, as the 1,872 question count was verified deterministically in this audit.

---

## Idempotence

`data/reconciliation/master-idempotence-report.json` was audited:
- `run_1_hash`: `e9faedf5b2fea18924eb73bfb2604f158b342b4e94e517450ba88090da46910c`
- `run_2_hash`: `e9faedf5b2fea18924eb73bfb2604f158b342b4e94e517450ba88090da46910c`
- `hash_match`: `true`
- `volatile_fields_excluded`: `["generated_at", "updated_at"]`
- `pipeline_config_identifier`: `scripts/master_merge.ts`
- `result`: `IDEMPOTENCE_PASS`

*(Note: The hash recorded in `master-idempotence-report.json` and `master-second-semantic-repair-report.md` is `e9faedf...`. An earlier repair text cited `186b519...`, but the authoritative report file holds the verified passing hash).*

---

## Remaining Blocking Issues

None. Zero promotion-blocking issues detected.

---

## Remaining Non-Blocking Items

- The 4 table-only irregular verbs (`conclure`, `haïr`, `(s')asseoir`, `vaincre`) retain source-accurate sparse English glosses without speculative dictionary expansion.
- The 88 rejected references (79 empty conjugation paradigms and 9 English pseudo-verbs) remain safely excluded with explicit rationale documented in `master-broken-reference-resolution.json`.

---

## Final Decision

FLASH_PREPROMOTION_PASS
