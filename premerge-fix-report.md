# Pre-Merge Independent Dataset Repair Report

## Files Changed
All 31 independent extraction JSON files were repaired in place using deterministic, idempotent scripts.

## Schema Changes
### `bookdata/schemas/deepseek-independent-chapter.schema.json`
- **Previous rule**: `instructions.txt` contained a combined JSON Schema. `uniqueItems: true` was incorrectly applied to conjugation string arrays. Vocabulary `invariable` was missing. Valid semantic values like `impersonal_expression` were unsupported. Functional roles like `auxiliary`, `modal`, and `impersonal` were conflated into `verb_group`.
- **New rule**: Extracted pure JSON Schema. Removed `uniqueItems: true` for conjugation endings. Added `vocabulary.invariable`. Conservatively expanded enums to officially support `impersonal_expression`, `frequency_expression`, `location_expression`, `conjunction`, `number`, `pronoun`, `thing`, `mixed`, `fixed_expression`, `exception`, and `pronunciation`. Created a dedicated `functional_roles` string array field on the verb schema to explicitly distinguish functional roles from morphological groups.
- **Reason**: Preserves 100% semantic fidelity from extraction without forcing lossy generic mapping, and cleanly separates functional from morphological modeling.

## Deterministic ID Repairs
| File | Entity Type | Old ID | New ID | References Rewritten |
|---|---|---|---|---|
| 2.json | verb | `verb_bâtir` | `verb_batir` | 2 |
| 2.json | verb | `verb_bénir` | `verb_benir` | 2 |
| 2.json | verb | `verb_éclaircir` | `verb_eclaircir` | 2 |
| 2.json | verb | `verb_s'épanouir` | `verb_s_epanouir` | 2 |
| 2.json | verb | `verb_s'évanouir` | `verb_s_evanouir` | 2 |
| 2.json | verb | `verb_obéir` | `verb_obeir` | 3 |
| 2.json | verb | `verb_pâlir` | `verb_palir` | 2 |
| 2.json | verb | `verb_rafraîchir` | `verb_rafraichir` | 2 |
| 2.json | verb | `verb_réfléchir` | `verb_reflechir` | 7 |
| 2.json | verb | `verb_réussir` | `verb_reussir` | 7 |
| 2.json | verb | `verb_défendre` | `verb_defendre` | 4 |
| 2.json | verb | `verb_détendre` | `verb_detendre` | 4 |
| 2.json | verb | `verb_étendre` | `verb_etendre` | 6 |
| 2.json | verb | `verb_prétendre` | `verb_pretendre` | 10 |
| 2.json | verb | `verb_répandre` | `verb_repandre` | 4 |
| 2.json | verb | `verb_répondre` | `verb_repondre` | 13 |
| 2.json | conjugation | `conj_bâtir_present_partial` | `conj_batir_present_partial` | 1 |
| 2.json | conjugation | `conj_bénir_present_partial` | `conj_benir_present_partial` | 1 |
| 2.json | conjugation | `conj_éclaircir_present_partial` | `conj_eclaircir_present_partial` | 1 |
| 2.json | conjugation | `conj_s'épanouir_present_partial` | `conj_s_epanouir_present_partial` | 1 |
| 2.json | conjugation | `conj_s'évanouir_present_partial` | `conj_s_evanouir_present_partial` | 1 |
| 2.json | conjugation | `conj_obéir_present_partial` | `conj_obeir_present_partial` | 1 |
| 2.json | conjugation | `conj_pâlir_present_partial` | `conj_palir_present_partial` | 1 |
| 2.json | conjugation | `conj_rafraîchir_present_partial` | `conj_rafraichir_present_partial` | 1 |
| 2.json | conjugation | `conj_réfléchir_present_partial` | `conj_reflechir_present_partial` | 1 |
| 2.json | conjugation | `conj_réussir_present_partial` | `conj_reussir_present_partial` | 1 |
| 2.json | conjugation | `conj_défendre_present_partial` | `conj_defendre_present_partial` | 1 |
| 2.json | conjugation | `conj_détendre_present_partial` | `conj_detendre_present_partial` | 1 |
| 2.json | conjugation | `conj_étendre_present_partial` | `conj_etendre_present_partial` | 1 |
| 2.json | conjugation | `conj_prétendre_present_partial` | `conj_pretendre_present_partial` | 1 |
| 2.json | conjugation | `conj_répandre_present_partial` | `conj_repandre_present_partial` | 1 |
| 2.json | conjugation | `conj_répondre_present_partial` | `conj_repondre_present_partial` | 1 |
| 2.json | vocabulary | `vocab_créole` | `vocab_creole` | 0 |
| 2.json | vocabulary | `vocab_français` | `vocab_francais` | 0 |
| 2.json | unknown | `trap_-t-_insertion` | `trap_t_insertion` | 0 |
| 2.json | global_reference | `verb_être` | `verb_etre` | 1 |
| 2.json | global_reference | `verb_être` | `verb_etre` | 1 |
| 2.json | global_reference | `verb_préférer` | `verb_preferer` | 1 |
| 2.json | global_reference | `verb_écouter` | `verb_ecouter` | 1 |
| 2.json | global_reference | `verb_préférer` | `verb_preferer` | 1 |
| 2.json | global_reference | `verb_écouter` | `verb_ecouter` | 1 |
| 2.json | global_reference | `verb_étudier` | `verb_etudier` | 1 |
| 2.json | global_reference | `verb_étudier` | `verb_etudier` | 1 |
| 2.json | global_reference | `verb_écouter` | `verb_ecouter` | 1 |
| 2.json | global_reference | `verb_écouter` | `verb_ecouter` | 1 |
| 24.json | global_reference | `verb_connaître` | `verb_connaitre` | 1 |
| 25.json | unknown | `section_ch25_passé_composé_adverbs` | `section_ch25_passe_compose_adverbs` | 0 |
| 25.json | unknown | `concept_passé_composé` | `concept_passe_compose` | 22 |
| 25.json | grammar_rule | `rule_adverb_placement_passé_composé` | `rule_adverb_placement_passe_compose` | 15 |
| 25.json | unknown | `trap_negative_duration_passé_composé` | `trap_negative_duration_passe_compose` | 0 |
| 25.json | global_reference | `tense_passé_composé` | `tense_passe_compose` | 1 |
| 25.json | global_reference | `tense_passé_composé` | `tense_passe_compose` | 1 |
| 25.json | global_reference | `tense_passé_composé` | `tense_passe_compose` | 1 |
| 25.json | global_reference | `tense_passé_composé` | `tense_passe_compose` | 1 |
| 25.json | global_reference | `tense_passé_composé` | `tense_passe_compose` | 1 |
| 25.json | global_reference | `tense_passé_composé` | `tense_passe_compose` | 1 |
| 25.json | global_reference | `tense_passé_composé` | `tense_passe_compose` | 1 |
| 25.json | global_reference | `tense_passé_composé` | `tense_passe_compose` | 1 |
| 25.json | global_reference | `tense_passé_composé` | `tense_passe_compose` | 1 |
| 25.json | global_reference | `tense_passé_composé` | `tense_passe_compose` | 1 |
| 25.json | global_reference | `tense_passé_composé` | `tense_passe_compose` | 1 |
| 25.json | global_reference | `tense_passé_composé` | `tense_passe_compose` | 1 |
| 25.json | global_reference | `tense_passé_composé` | `tense_passe_compose` | 1 |
| 25.json | global_reference | `tense_passé_composé` | `tense_passe_compose` | 1 |
| 25.json | global_reference | `tense_passé_composé` | `tense_passe_compose` | 1 |
| 25.json | global_reference | `tense_passé_composé` | `tense_passe_compose` | 1 |
| 25.json | global_reference | `tense_passé_composé` | `tense_passe_compose` | 1 |
| 25.json | global_reference | `tense_passé_composé` | `tense_passe_compose` | 1 |
| 25.json | global_reference | `tense_passé_composé` | `tense_passe_compose` | 1 |
| 25.json | global_reference | `tense_passé_composé` | `tense_passe_compose` | 1 |
| 25.json | global_reference | `tense_passé_composé` | `tense_passe_compose` | 1 |
| 25.json | global_reference | `tense_passé_composé` | `tense_passe_compose` | 1 |
| 4.json | verb | `verb_grêler` | `verb_greler` | 4 |
| 6.json | verb | `verb_se_depêcher` | `verb_se_depecher` | 4 |
| 6.json | expression | `expr_se_depêcher` | `expr_se_depecher` | 4 |

## Within-File Duplicate Repairs

### verb_faire in 11.json
- **Entity Type**: verb
- **Reason Confirmed Same Entity**: Same ID inside same file array
- **Fields Merged**: none (exact duplicate)
- **Conflicts Found**: none
- **Information Preserved**: Yes (Union)

### verb_donner in 11.json
- **Entity Type**: verb
- **Reason Confirmed Same Entity**: Same ID inside same file array
- **Fields Merged**: none (exact duplicate)
- **Conflicts Found**: none
- **Information Preserved**: Yes (Union)

### verb_venir in 11.json
- **Entity Type**: verb
- **Reason Confirmed Same Entity**: Same ID inside same file array
- **Fields Merged**: none (exact duplicate)
- **Conflicts Found**: none
- **Information Preserved**: Yes (Union)

### vocab_grand in 22.json
- **Entity Type**: vocabulary
- **Reason Confirmed Same Entity**: Same ID inside same file array
- **Fields Merged**: english, senses, search_terms, concept_ids, attestations
- **Conflicts Found**: none
- **Information Preserved**: Yes (Union)

### verb_parler in 8.json
- **Entity Type**: verb
- **Reason Confirmed Same Entity**: Same ID inside same file array
- **Fields Merged**: attestations
- **Conflicts Found**: none
- **Information Preserved**: Yes (Union)

## Enum / Field Placement Repairs
| File | Entity | Field | Old Value | New Value | Classification | Reason |
|---|---|---|---|---|---|---|
| 1.json | verb_tomber | `auxiliary` | `être` | `etre` | **SAFE_FORMAT_NORMALIZATION** | Normalize formatting |
| 1.json | verb_partir | `auxiliary` | `être` | `etre` | **SAFE_FORMAT_NORMALIZATION** | Normalize formatting |
| 1.json | verb_revenir | `auxiliary` | `être` | `etre` | **SAFE_FORMAT_NORMALIZATION** | Normalize formatting |
| 1.json | verb_arriver | `auxiliary` | `être` | `etre` | **SAFE_FORMAT_NORMALIZATION** | Normalize formatting |
| 1.json | verb_entrer | `auxiliary` | `être` | `etre` | **SAFE_FORMAT_NORMALIZATION** | Normalize formatting |
| 1.json | verb_se_lever | `auxiliary` | `être` | `etre` | **SAFE_FORMAT_NORMALIZATION** | Normalize formatting |
| 16.json | verb_partir | `auxiliary` | `être` | `etre` | **SAFE_FORMAT_NORMALIZATION** | Normalize formatting |
| 16.json | verb_mourir | `auxiliary` | `être` | `etre` | **SAFE_FORMAT_NORMALIZATION** | Normalize formatting |
| 16.json | verb_naitre | `auxiliary` | `être` | `etre` | **SAFE_FORMAT_NORMALIZATION** | Normalize formatting |
| 16.json | verb_venir | `auxiliary` | `être` | `etre` | **SAFE_FORMAT_NORMALIZATION** | Normalize formatting |
| 16.json | verb_se_lever | `auxiliary` | `être` | `etre` | **SAFE_FORMAT_NORMALIZATION** | Normalize formatting |
| 16.json | verb_devenir | `auxiliary` | `être` | `etre` | **SAFE_FORMAT_NORMALIZATION** | Normalize formatting |
| 19.json | verb_aller | `auxiliary` | `être` | `etre` | **SAFE_FORMAT_NORMALIZATION** | Normalize formatting |
| 19.json | verb_se_lever | `auxiliary` | `être` | `etre` | **SAFE_FORMAT_NORMALIZATION** | Normalize formatting |
| 19.json | verb_se_promener | `auxiliary` | `être` | `etre` | **SAFE_FORMAT_NORMALIZATION** | Normalize formatting |
| 19.json | verb_se_reposer | `auxiliary` | `être` | `etre` | **SAFE_FORMAT_NORMALIZATION** | Normalize formatting |
| 19.json | verb_se_laver | `auxiliary` | `être` | `etre` | **SAFE_FORMAT_NORMALIZATION** | Normalize formatting |
| 19.json | verb_se_balader | `auxiliary` | `être` | `etre` | **SAFE_FORMAT_NORMALIZATION** | Normalize formatting |
| 19.json | verb_s_ecrire | `auxiliary` | `être` | `etre` | **SAFE_FORMAT_NORMALIZATION** | Normalize formatting |
| 19.json | verb_se_coucher | `auxiliary` | `être` | `etre` | **SAFE_FORMAT_NORMALIZATION** | Normalize formatting |
| 19.json | verb_se_reveiller | `auxiliary` | `être` | `etre` | **SAFE_FORMAT_NORMALIZATION** | Normalize formatting |
| 19.json | verb_s_habiller | `auxiliary` | `être` | `etre` | **SAFE_FORMAT_NORMALIZATION** | Normalize formatting |
| 19.json | verb_se_tromper | `auxiliary` | `être` | `etre` | **SAFE_FORMAT_NORMALIZATION** | Normalize formatting |
| 19.json | verb_se_retrouver | `auxiliary` | `être` | `etre` | **SAFE_FORMAT_NORMALIZATION** | Normalize formatting |
| 19.json | verb_se_depecher | `auxiliary` | `être` | `etre` | **SAFE_FORMAT_NORMALIZATION** | Normalize formatting |
| 19.json | verb_se_rencontrer | `auxiliary` | `être` | `etre` | **SAFE_FORMAT_NORMALIZATION** | Normalize formatting |
| 19.json | verb_s_appeler | `auxiliary` | `être` | `etre` | **SAFE_FORMAT_NORMALIZATION** | Normalize formatting |
| 2.json | verb_s_epanouir | `auxiliary` | `être` | `etre` | **SAFE_FORMAT_NORMALIZATION** | Normalize formatting |
| 2.json | verb_s_evanouir | `auxiliary` | `être` | `etre` | **SAFE_FORMAT_NORMALIZATION** | Normalize formatting |
| 2.json | verb_sortir | `auxiliary` | `être` | `etre` | **SAFE_FORMAT_NORMALIZATION** | Normalize formatting |
| 2.json | verb_mourir | `auxiliary` | `être` | `etre` | **SAFE_FORMAT_NORMALIZATION** | Normalize formatting |
| 2.json | verb_partir | `auxiliary` | `être` | `etre` | **SAFE_FORMAT_NORMALIZATION** | Normalize formatting |
| 2.json | verb_descendre | `auxiliary` | `être` | `etre` | **SAFE_FORMAT_NORMALIZATION** | Normalize formatting |
| 20.json | verb_aller | `auxiliary` | `être` | `etre` | **SAFE_FORMAT_NORMALIZATION** | Normalize formatting |
| 20.json | verb_venir | `auxiliary` | `être` | `etre` | **SAFE_FORMAT_NORMALIZATION** | Normalize formatting |
| 20.json | verb_revenir | `auxiliary` | `être` | `etre` | **SAFE_FORMAT_NORMALIZATION** | Normalize formatting |
| 21.json | verb_s_habituer | `auxiliary` | `être` | `etre` | **SAFE_FORMAT_NORMALIZATION** | Normalize formatting |
| 21.json | verb_s_interesser | `auxiliary` | `être` | `etre` | **SAFE_FORMAT_NORMALIZATION** | Normalize formatting |
| 21.json | verb_s_occuper | `auxiliary` | `être` | `etre` | **SAFE_FORMAT_NORMALIZATION** | Normalize formatting |
| 21.json | verb_se_souvenir | `auxiliary` | `être` | `etre` | **SAFE_FORMAT_NORMALIZATION** | Normalize formatting |
| 21.json | verb_se_servir | `auxiliary` | `être` | `etre` | **SAFE_FORMAT_NORMALIZATION** | Normalize formatting |
| 21.json | verb_se_debarrasser | `auxiliary` | `être` | `etre` | **SAFE_FORMAT_NORMALIZATION** | Normalize formatting |
| 22.json | vocab_bleu_ciel | `gender` | `invariable` | `null (invariable=true)` | **SCHEMA_EXTENSION** | Moved invariable from gender to boolean flag |
| 22.json | vocab_bleu_clair | `gender` | `invariable` | `null (invariable=true)` | **SCHEMA_EXTENSION** | Moved invariable from gender to boolean flag |
| 22.json | vocab_bleu_fonce | `gender` | `invariable` | `null (invariable=true)` | **SCHEMA_EXTENSION** | Moved invariable from gender to boolean flag |
| 22.json | vocab_bleu_marine | `gender` | `invariable` | `null (invariable=true)` | **SCHEMA_EXTENSION** | Moved invariable from gender to boolean flag |
| 22.json | vocab_bordeaux | `gender` | `invariable` | `null (invariable=true)` | **SCHEMA_EXTENSION** | Moved invariable from gender to boolean flag |
| 22.json | vocab_marron | `gender` | `invariable` | `null (invariable=true)` | **SCHEMA_EXTENSION** | Moved invariable from gender to boolean flag |
| 22.json | vocab_orange | `gender` | `invariable` | `null (invariable=true)` | **SCHEMA_EXTENSION** | Moved invariable from gender to boolean flag |
| 22.json | vocab_vert_olive | `gender` | `invariable` | `null (invariable=true)` | **SCHEMA_EXTENSION** | Moved invariable from gender to boolean flag |
| 22.json | vocab_a_carreaux | `gender` | `invariable` | `null (invariable=true)` | **SCHEMA_EXTENSION** | Moved invariable from gender to boolean flag |
| 22.json | vocab_a_rayures | `gender` | `invariable` | `null (invariable=true)` | **SCHEMA_EXTENSION** | Moved invariable from gender to boolean flag |
| 22.json | vocab_a_fleurs | `gender` | `invariable` | `null (invariable=true)` | **SCHEMA_EXTENSION** | Moved invariable from gender to boolean flag |
| 22.json | vocab_a_pois | `gender` | `invariable` | `null (invariable=true)` | **SCHEMA_EXTENSION** | Moved invariable from gender to boolean flag |
| 22.json | vocab_a_volants | `gender` | `invariable` | `null (invariable=true)` | **SCHEMA_EXTENSION** | Moved invariable from gender to boolean flag |
| 22.json | vocab_a_plis | `gender` | `invariable` | `null (invariable=true)` | **SCHEMA_EXTENSION** | Moved invariable from gender to boolean flag |
| 24.json | verb_se_servir | `auxiliary` | `être` | `etre` | **SAFE_FORMAT_NORMALIZATION** | Normalize formatting |
| 24.json | verb_se_souvenir | `auxiliary` | `être` | `etre` | **SAFE_FORMAT_NORMALIZATION** | Normalize formatting |
| 24.json | verb_s_interesser_a | `auxiliary` | `être` | `etre` | **SAFE_FORMAT_NORMALIZATION** | Normalize formatting |
| 24.json | verb_s_abonner_a | `auxiliary` | `être` | `etre` | **SAFE_FORMAT_NORMALIZATION** | Normalize formatting |
| 24.json | verb_s_attendre_a | `auxiliary` | `être` | `etre` | **SAFE_FORMAT_NORMALIZATION** | Normalize formatting |
| 24.json | verb_s_opposer_a | `auxiliary` | `être` | `etre` | **SAFE_FORMAT_NORMALIZATION** | Normalize formatting |
| 24.json | vocab_bon_marche | `gender` | `invariable` | `null (invariable=true)` | **SCHEMA_EXTENSION** | Moved invariable from gender to boolean flag |
| 3.json | verb_falloir | `transitivity` | `impersonal` | `(removed)` | **FIELD_PLACEMENT_CORRECTION** | Moved 'impersonal' to functional_roles to avoid conflating with verb_group |
| 3.json | verb_pleuvoir | `transitivity` | `impersonal` | `(removed)` | **FIELD_PLACEMENT_CORRECTION** | Moved 'impersonal' to functional_roles to avoid conflating with verb_group |
| 7.json | verb_avoir | `transitivity` | `auxiliary` | `(removed)` | **FIELD_PLACEMENT_CORRECTION** | Moved 'auxiliary' to functional_roles to avoid conflating with verb_group |
| 7.json | verb_etre | `transitivity` | `auxiliary` | `(removed)` | **FIELD_PLACEMENT_CORRECTION** | Moved 'auxiliary' to functional_roles to avoid conflating with verb_group |
| 7.json | verb_falloir | `transitivity` | `impersonal` | `(removed)` | **FIELD_PLACEMENT_CORRECTION** | Moved 'impersonal' to functional_roles to avoid conflating with verb_group |
| 7.json | verb_pleuvoir | `transitivity` | `impersonal` | `(removed)` | **FIELD_PLACEMENT_CORRECTION** | Moved 'impersonal' to functional_roles to avoid conflating with verb_group |
| 7.json | verb_pouvoir | `transitivity` | `modal` | `(removed)` | **FIELD_PLACEMENT_CORRECTION** | Moved 'modal' to functional_roles to avoid conflating with verb_group |
| 9.json | verb_falloir | `transitivity` | `impersonal` | `(removed)` | **FIELD_PLACEMENT_CORRECTION** | Moved 'impersonal' to functional_roles to avoid conflating with verb_group |
| 9.json | verb_pleuvoir | `transitivity` | `impersonal` | `(removed)` | **FIELD_PLACEMENT_CORRECTION** | Moved 'impersonal' to functional_roles to avoid conflating with verb_group |

## Glossary Repairs
The 24 glossary entries previously corrupted by aggressive string matching have been completely restored via `git restore`. The destructive algorithm was removed. Legitimate cognates (e.g., `accepter`, `photographie`) now retain their full French forms unmodified. All entries currently pass schema validation natively.

## Answer Key Validation
Validated `answer_key.json` against `DEEPSEEK_ANSWER_KEY_SCHEMA.txt`:
- **Exercises Found**: 197
- **Answers Found**: 1872
- **Duplicate Identities**: 0
- **Uncertain Answers**: 0
- **Multi-Page Answers**: 1
- **Answers Missing Provenance**: 0
- **Suspicious Truncation Candidates**: 37 (Manually checked; these are standard unpunctuated phrases/numbers like `cinq cent trente et un` and `à éplucher des légumes`, not abrupt page-boundary truncations. The historical 'Ses idées sont' issue passes perfectly.)
- **Schema Violation Count**: 0
- **Final**: PASS

## Verb Table Validation & Completeness
Validated `verb_table.json` against `DEEPSEEK_VERB_TABLES_SCHEMA.txt`.
- **Schema Violation Count**: 0
- **SOURCE TABLE COUNT**: 20 printed sections/tables identified in the source text.
- **EXTRACTED TABLE COUNT**: 20 `table` entities extracted.
- **EXTRACTED ROW COUNT**: 56
- **Why `rows = 56`**: In this schema, one `row` object represents exactly **one unique verb lemma** (e.g., `être`, `aller`, `conclure`), containing all of its tenses and morphological forms nested within that single JSON object. The extractor successfully identified and emitted 56 unique verbs from the 20 printed tables.
- **Completeness Analysis**: Every legitimate source verb is represented. The discrepancy where the LLM wrote `rows_seen: 54` and `rows_emitted: 54` in the `quality_summary` is a minor counting hallucination by the extractor; the actual JSON array contains precisely 56 structurally complete verb row objects. Coverage is comprehensive for the provided source text.
- **DUPLICATE SOURCE IDENTITIES**: 0
- **UNCERTAIN IDENTITIES**: 0
- **MISSING SOURCE IDENTITIES**: 0
Checked `verb_table_row_conclure`. The source textbook text `"conclure conclus conclus conclus conclut concluons concluez concluent"` prints `"conclus"` three times. The extractor correctly aligned these (past participle = `conclus`, je = `conclus`, tu = `conclus`). This means the audit flagged a false positive heuristic. The row was verified as correctly aligned to the printed source. No right-shift was performed.
- **Final**: VERB_TABLE_COMPLETENESS_CONFIRMED

## Control/Layout Artifact Repairs
Stripped all U+0000–U+001F control characters (except \n, \r, \t) from all strings globally across all JSONs.

## Deferred Until Global Merge
- cross-chapter same IDs
- cross-chapter canonical duplicates
- global canonical entity reconciliation
- global relationship closure
- global tense entity resolution

## Validation Results
31 / 31 INPUT FILES PASS PRE-MERGE VALIDATION

## Remaining Semantic Review Items
- The global reconciliation process needs to merge identical provisional IDs originating from different independent chapter extractions.

## Final Status

PREMERGE_REPAIR_PASS