# Final Master Semantic Audit

## Executive Summary

The preview is schema-valid and its reported top-level entity counts are accurate, but it is not semantically or referentially safe to promote.

Independent checks found promotion-blocking failures that the reconciliation reports do not expose:

- 219 live references point to IDs absent from the master. `master-relationship-audit.json` reports 0 because its audit does not traverse most section arrays, expression/example relations, or question relations.
- Clear two-column glossary extraction spillover was accepted with 0 uncertain/conflict/rejected rows, producing at least 14 expressions and 3 vocabulary records with English text embedded in canonical French fields.
- Source noun gender was discarded for 433 of 445 unique gender-bearing canonical vocabulary records. Five source mappings contain gender conflicts that the zero-conflict report does not record.
- 11 pairs of generated tense nodes represent the same source tense under French and English labels, fracturing the graph. All 30 generated tenses have `mood: indicative`, including 16 whose source-derived IDs explicitly identify conditional, subjunctive, imperative, infinitive, participle, or gerund forms.
- 79 synthesized conjugation placeholders have empty `forms`; three additional source imperative paradigms are empty because `imperative_forms` were not ingested. All 82 are marked `machine_checked`.
- 85 of the 104 verb-table-derived canonical conjugations have no verb-table attestation. Twenty-one source compound paradigms are marked `compound: false`.
- The historical page-boundary answer beginning `Ses idées sont ...` is still truncated. A second answer contains a copyright footer and loses its continuation on the next PDF page.
- The expected verb `functional_roles` representation is absent; `falloir` and `pleuvoir` store `impersonal` in `verb_group`.
- `book.chapter_ids` is empty despite 27 chapters, and the local source PDF has 286 pages while `book.source_file.page_count_pdf` says 338.

No `SOURCE_ENTITY_UNACCOUNTED` case was found for the enumerated source entities: every chapter entity, glossary row, answer, and unique verb-table row has a disposition/mapping to an existing canonical ID. This does not offset the semantic corruption and broken graph.

## Recomputed Master Counts

| Collection | Recomputed | Reported | Result |
|---|---:|---:|---|
| chapters | 27 | 27 | match |
| sections | 80 | 80 | match |
| concepts | 12 | 12 | match |
| tenses | 30 | 30 | match |
| grammar_rules | 93 | 93 | match |
| verbs | 394 | 394 | match |
| conjugations | 187 | 187 | match |
| expressions | 154 | 154 | match |
| vocabulary | 570 | 570 | match |
| examples | 90 | 90 | match |
| exercises | 197 | 197 | match |
| questions | 1872 | 1872 | match |
| answers | 1872 | 1872 | match |
| exceptions_and_traps | 0 | 0 | match |
| study_sets | 0 | 0 | match |

Additional structural results:

- Zod schema parse: PASS.
- Duplicate IDs across all top-level entities and nested questions: 0.
- Malformed canonical/question IDs under the dataset's prefix/slug conventions: 0.
- Duplicate primitive values inside relationship arrays: 0.
- Empty required semantic values: `english: []` on `verb_conclure`, `verb_hair`, `verb_s_asseoir`, and `verb_vaincre`; `forms: {}` on 82 conjugations.
- `book.chapter_ids` contains 0 of 27 chapter IDs.
- Local source PDF page count: 286; master metadata: 338.
- `master-input-counts.json` says 98 verb-table cells, while direct source recomputation, `master-coverage-report.json`, and the merge summary say 104. The 104 are source paradigms/provenance rows, not individual person cells.

## Source Traceability

Independent source inventory and disposition checks found:

| Source class | Recomputed source records | Accounted |
|---|---:|---:|
| chapters | 27 | 27 |
| sections | 80 | 80 |
| grammar rules | 93 | 93 |
| verbs | 119 | 119 |
| conjugations | 23 | 23 |
| expressions | 32 | 32 |
| vocabulary | 22 | 22 |
| examples | 90 | 90 |
| exercises | 197 | 197 |
| questions | 1872 | 1872 |
| glossary FR->EN | 948 | 948 |
| glossary EN->FR | 978 | 978 |
| unique verb-table rows | 56 | 56 |
| answer-key answers | 1872 | 1872 |

All non-null canonical targets in the 6,578-row disposition file exist in the preview. The summary's 6,457 processed-source count excludes 121 `source_file: synthesized` dispositions: 12 concepts, 30 tenses, and 79 conjugations.

No `SOURCE_ENTITY_UNACCOUNTED` finding was established. However, disposition is not proof of faithful content: malformed glossary rows were accepted, gender was dropped, imperative forms were omitted, and truncated answer-key source strings were copied unchanged.

## Verb Audit

- No duplicate canonical infinitive was found, including accent/apostrophe normalization.
- The non-pronominal/pronominal distinctions for `apercevoir`/`s’apercevoir`, `laver`/`se laver`, `lever`/`se lever`, and `voir`/`se voir` remain separate; these are legitimate distinctions.
- Seven apostrophe-form pronominal lemmas have `pronominal: false`: `verb_s_abonner`, `verb_s_accroupir`, `verb_s_apercevoir`, `verb_s_enfuir`, `verb_s_entrainer`, `verb_s_epanouir`, and `verb_s_evanouir`.
- No prose/glossary sentence was found as a verb infinitive, and no `accepter -> er`-style partial lemma remains in the master.
- `functional_roles` is absent from every verb and from the schema. Consequently `avoir`/`être` are not represented as auxiliaries in that field and `pouvoir`/`devoir`/`vouloir` are not represented as modals. `falloir` and `pleuvoir` instead have `verb_group: impersonal`, contrary to the required field semantics.
- The four table-only verbs listed in the structural section have empty English arrays.
- High-connectivity verbs generally retain their principal lemma and meanings from the sources, but their graph links are incomplete. In particular, `prendre`, `demander`, `pouvoir`, `devoir`, `vouloir`, and `penser` have no canonical expression links despite source patterns or occurrences discussed below.

## Expression Audit

The full 154-record scan found systematic glossary residue and missing relationship enrichment.

Confirmed malformed canonical French expressions include:

- `expr_de_temps_en_temps_from_time`: `de temps en temps from time`
- `expr_get_one_s_recevoir_son_diplome`: `get one’s recevoir son diplôme`
- `expr_go_randonner`: `go randonner`
- `expr_grow_vieillir`: `grow vieillir`
- `expr_have_a_avoir_mal_a_la_tete`: `have a avoir mal à la tête`
- `expr_have_a_avoir_mal_au_dos`: `have a avoir mal au dos`
- `expr_have_a_avoir_mal_au_ventre`: `have a avoir mal au ventre`
- `expr_have_the_avoir_la_grippe`: `have the avoir la grippe`
- `expr_pouvoir_can`: `pouvoir can`
- `expr_selon_according`: `selon according`
- `expr_time_de_temps_en_temps`: `time de temps en temps`
- `expr_to_devoir`: `to devoir`
- `expr_to_have_a_cold_avoir_un_rhume`: `to have a cold avoir un rhume`
- `expr_you_merci`: `you merci`

The PDF confirms these are column-boundary concatenations rather than printed French expressions. For example, PDF page 255 prints `brancher to plug in` and `bras (m.) arm` in separate columns; pages 261-269 similarly separate `pouvoir`, `préférer`, `selon`, `sembler`, `randonner`, `vieillir`, and the reverse-glossary entries.

Ordinary single lexical headwords were also routed as expressions, including `actuellement`, `agréable`, `ainsi`, `autrefois`, and `volontiers`. Their records are nonproductive collocations with no slots, which does not justify first-class expression routing.

Forty-nine verbal expressions start with an existing canonical base verb yet omit that source-supported `base_verb_ids` link. Confirmed examples include all three `prendre` expressions, numerous `avoir` and `faire` expressions, `tenir à`, `tenir compte de`, `rendre visite à`, `recevoir son diplôme`, and `tomber en panne`.

Targeted constructions:

- `prendre une décision`: absent. The PDF contains `avant de prendre une décision` in exercise 8.6, but no expression node/link preserves it.
- `prendre la décision de + infinitif`: no exact source occurrence was located; no issue is asserted from outside knowledge.
- `demander à quelqu’un de + infinitif`: no exact canonical expression. The textbook prints indirect-object examples such as `Elle nous a demandé de ne rien dire` and the chapter data references missing `expr_demander_de_inf`; exact slot modeling requires source-grounded review.
- `venir chercher quelqu’un`: correctly represented by `expr_venir_chercher_qqn`, with required person slot and base links to `verb_venir` and `verb_chercher`.
- `penser à + infinitif`: absent; section 27 references missing `expr_penser_a`. The exact infinitive scope should be settled from the source before repair.
- `avoir [NUMBER] ans`: misrepresented as fixed, nonproductive `avoir trente-cinq ans`, with no number slot and no `verb_avoir` base link. The PDF explicitly prints `j’ai (trente-cinq) ans` as a productive pattern.

## Vocabulary Audit

- Confirmed malformed French vocabulary records:
  - `vocab_brancher_to_plug_in_bras`: `brancher to plug in bras` / `arm`
  - `vocab_chercher_to_look_for_cheveux`: `chercher to look for cheveux` / `hair`
  - `vocab_devoir_to_have_to_diamant`: `devoir to have to diamant` / `diamond`
- Additional extraction fragments include `vocab_au` with `cinéma at the movies`, `vocab_le` with Tuesday/Friday continuations, and `vocab_vu` with a split `vu que` meaning.
- Source noun gender is present for 445 unique canonical vocabulary targets. It is absent in the master for 433 of them. This is large-scale information loss, not a display-only omission.
- Five canonical targets receive conflicting source genders: `vocab_anniversaire`, `vocab_meurtrier`, `vocab_patron`, `vocab_veuf`, and `vocab_voile`. The merge silently drops gender rather than reporting a conflict.
- `vocab_voile` is a confirmed over-merge: two EN->FR source rows with distinct meanings and distinct genders (`sail` and `veil`) collapse into one record with both English meanings and no sense/gender separation.
- Four canonical IDs receive conflicting source POS labels: `vocab_arabe`, `vocab_chinois`, `vocab_douleur`, and `vocab_marchand`. `vocab_douleur` ends as `part_of_speech: adjective` even though the FR->EN source labels it a noun. `vocab_marchand` accumulates French continuation fragments inside its English array.
- No source glossary uses `invariable` as a gender value, so no such misrepresentation was found.

## Glossary Routing Audit

Direct recomputation exactly matches the reported route totals:

| Route | Merged | New | Total |
|---|---:|---:|---:|
| vocabulary | 475 | 548 | 1023 |
| verbs | 440 | 272 | 712 |
| expressions | 69 | 122 | 191 |
| uncertain/conflict/rejected | 0 | 0 | 0 |
| total | 984 | 942 | 1926 |

The counts are internally consistent but the deterministic classification is not semantically sound. It trusts malformed source `is_expression`/POS decisions and never routes obvious column-spill records to review or rejection. It also discards source gender during vocabulary construction and uses first-route POS in conflicting cases.

Boundary review results:

- Verb routing is count-complete and did not place source POS `verb` rows into vocabulary.
- Opposite glossary directions usually enrich the same normalized lemma, but slot variants can under-merge (`rendre visite à` versus `rendre visite (à quelqu’un)`).
- Multiword vocabulary includes many legitimate noun phrases, so whitespace alone is not a valid rerouting rule.
- Pronominal spellings route to verb entities, but seven lose the `pronominal` flag.
- English headword notation with trailing `, to` generally routes correctly to verbs; column spill and inverted headword fragments are the failure boundary.

The systematic causal rule is: accepted source classification plus French-string normalization, without a bilingual column-integrity guard or semantic conflict gate.

## Conjugation Audit

- Canonical IDs and `verb_id`/`tense_id` targets exist for all 187 conjugations.
- Eighty-two conjugations have no non-null form: 79 synthesized reference placeholders plus the imperative paradigms for `regarder`, `vendre`, and `partir`.
- The three imperative losses are caused by ingesting `person_forms` while ignoring the source `imperative_forms` object.
- 164 conjugations have no attestation: the 79 synthesized placeholders and 85 newly created verb-table paradigms.
- Twenty-one source paradigms under the source's compound tables are marked `compound: false`.
- 137 form cells across all 23 chapter-source conjugations repeat the subject pronoun inside a person-keyed value (for example key `nous` -> `nous pouvons`). This is inconsistent with the raw verb-table form convention.
- `pouvoir` present indicative preserves the source variant: chapter `je peux` plus table `peux/puis` becomes `je peux / je puis`; both chapter and verb-table attestations are retained. No legitimate variant is lost in this targeted case.
- The `pouvoir` paradigm still exhibits the subject-pronoun duplication described above.
- No duplicate conjugation ID/key was found, but the generated tense under-merges create semantically duplicate tense partitions.

## Verb Table Audit

- Source tables: 20/20.
- Unique source rows: 56/56.
- Source paradigms/provenance rows: 104/104.
- Every unique row ID appears in disposition data, and every one of the 104 disposition targets exists.
- `master-input-counts.json` is stale/inconsistent at 98.
- Newly created table conjugations omit their verb-table attestation (85/104); only the 19 paradigms merged into existing chapter conjugations retain one.
- The three imperative paradigms lose all printed forms, as described above.
- `conclure` is linked to `verb_conclure` and `conj_conclure_present_indicative`. Its six present forms and past participle match the source row; its English array is empty because the source row supplies none. Its new conjugation nonetheless has no verb-table attestation.

## Grammar Rule Audit

- All 93 top-level source rules map 1:1 to 93 canonical rules.
- No exact normalized duplicate title or explanation was found.
- No empty explanation or missing rule attestation was found.
- Existing rule content was not detectably truncated relative to its source JSON.
- The graph is nevertheless incomplete: sections contain 27 references to absent rule IDs, including interrogative inversion, `ne...ni...ni`, modal/`-oir` rules, `venir` compounds, `faire` expressions, participle/passé composé rules, subjunctive triggers, partitives, comparative rules, possessives, and relative pronouns.
- These missing referenced rules are omitted from the relationship report because that report checks only `section.chapter_id`, not section content arrays.

## Generated Concepts/Tenses Audit

- Generated concepts present: 12/12.
- Generated tenses present: 30/30.
- All 42 records have a corresponding entry in `master-generated-global-entities.json`.
- The report gives only `source_files: ["synthesized"]`, `provenance: taxonomy reconstruction`, and a slug-decoded label. It does not name the source files/fields that supplied the references.
- `number_of_references` is 1 for every generated entity, while independent master traversal finds a different count for all 42.
- All generated concepts are empty shells with no relations/attestations. All generated tenses have no attestations and no formation/usage content.
- No invented textbook explanation was inserted, which is good; however, default mood metadata was invented and is wrong for the 16 clearly non-indicative IDs.
- Confirmed semantic duplicate tense pairs split chapter/reference nodes from verb-table conjugation nodes:
  - `tense_imparfait` / `tense_imperfect_indicative`
  - `tense_futur_simple` / `tense_simple_future`
  - `tense_conditionnel_present` / `tense_conditional_mood`
  - `tense_passe_compose` / `tense_conversational_past_present_perfect`
  - `tense_plus_que_parfait` / `tense_pluperfect_indicative`
  - `tense_conditionnel_passe` / `tense_past_conditional`
  - `tense_subjonctif_present` / `tense_present_subjunctive`
  - `tense_subjonctif_passe` / `tense_past_subjunctive`
  - `tense_passe_simple` / `tense_historical_past`
  - `tense_imperatif` / `tense_imperative_mood`
  - `tense_futur_anterieur` / `tense_future_perfect`

## Example Audit

- Source examples: 90; canonical examples: 90.
- Duplicate normalized French examples: 0.
- Every example retains an attestation; no example source entity is omitted.
- Six example relations point to absent verbs: `example_dual_auxiliary_001`, `example_imperative_pron_001`, `example_manquer_prep_001`, `example_passe_simple_001`, `example_passive_001`, and `example_verb_prep_de_001`.
- Example `relations.chapters` arrays are empty even when the attestation names a chapter. Parent chapters still list the examples, so the forward graph works only in one direction.

## Exercise / Question / Answer Audit

- Exercises: 197 unique IDs.
- Questions: 1872 unique IDs.
- Embedded non-null answers: 1872; answer identity is the unique question ID.
- Answer-key exercises: 197; source answers: 1872.
- Orphan answers: 0.
- Missing answers: 0.
- Source question order and prompt text are preserved exactly in the master.
- Master answer text and answer-key source text match exactly for all 1872 rows, and each answer retains separate `answer_key_source` page metadata.

The exact transfer preserves two source-extraction defects:

1. `exercise_22_22_1_q09` answer is only `Ses idées sont`. PDF pages 283-284 show the complete continuation: `Ses idées sont bonnes? —Oui, ses idées sont meilleures que les nôtres.` This historical page-boundary case is not complete.
2. `exercise_02_2_3_q06` answer is `Elle saisit Copyright © 2008 by Annie Heminway. Click here for terms of use.` PDF pages 274-275 show the real answer crossing the page boundary: `Elle saisit l’occasion.`

Question-level source pages are not stored on each question; only the parent exercise attestation identifies the chapter/exercise page. Answer provenance is more granular than question provenance.

## Relationship Semantic Audit

Independent traversal checked 3,424 typed reference slots:

- resolved: 3,205
- broken: 219

Broken-reference breakdown:

| Field | Broken |
|---|---:|
| section/example `example_ids` | 7 |
| `expression_ids` | 85 |
| `grammar_rule_ids` | 27 |
| `related_vocabulary_ids` | 2 |
| `relations.grammar_rules` | 1 |
| `relations.verbs` | 76 |
| `verb_ids` | 20 |
| `vocabulary_ids` | 1 |

By owning record, 140 are in sections, 70 in exercise questions, 6 in examples, and 3 in expressions.

`master-relationship-audit.json` examines 1,467 references and reports 0 broken because it checks chapter arrays, `section.chapter_id`, verb conjugation/expression arrays, exercise chapter IDs, and conjugation verb/tense IDs only. It omits the arrays that contain all 219 failures.

Nine question relations are not merely missing but semantically wrong extraction links to English placeholders: `verb_better` (2), `verb_fewer`, `verb_her` (2), `verb_their` (2), `verb_never`, and `verb_where`. These are `SEMANTICALLY_WRONG_RELATIONSHIP` findings.

Expression-to-verb semantics are also materially incomplete: 49 source-supported candidates lack the base link, including all `prendre` expressions. The correct `venir chercher quelqu’un` relationship is a positive control.

## Confirmed Duplicate Candidates

- `expr_rendre_visite_a` (`rendre visite à`) and `expr_rendre_visite_a_qqn` (`rendre visite (à quelqu’un)`) are `CONFIRMED_DUPLICATE`: opposite glossary directions express the same construction, but they became two entities. Neither links to `verb_rendre`.
- The 11 tense pairs listed under Generated Concepts/Tenses are `CONFIRMED_DUPLICATE` semantic nodes. Their distinct labels originate from French chapter IDs versus English verb-table titles, not distinct tense semantics.

## Possible Duplicate Candidates

- `expr_prendre_un_verre` and `expr_prendre_un_verre_du_vin` are `POSSIBLE_DUPLICATE`/variant candidates. The two glossary directions give nearly the same English meaning but different French surface forms; source review should determine whether one is a variant rather than silently collapsing them.
- `expr_de_temps_en_temps_from_time` and `expr_time_de_temps_en_temps` are two malformed halves of the same bilingual glossary line. Both should be reviewed as extraction garbage rather than automatically merged.
- `avoir besoin` / `avoir besoin de`, `avoir envie` / `avoir envie de`, and `se plaindre` / `se plaindre de` are `LEGITIMATE_DISTINCTION` candidates at the pattern/frame level; they should not be merged solely by prefix similarity.

## Possible Over-Merges

- `POSSIBLE_OVERMERGE` (source-confirmed incompatible senses): `vocab_voile` combines source `sail` and `veil` rows with different gender metadata into one unsensed record.
- `POSSIBLE_OVERMERGE`: `vocab_marchand` combines the headword with multiple extracted continuation phrases (`au détail`, `de journaux`, `de légumes`, etc.) as English meanings instead of preserving phrase identities.
- `POSSIBLE_OVERMERGE`/POS corruption: `vocab_douleur` receives noun and adjective source labels but is canonically only an adjective.
- No canonical verb record was found that collapses a non-pronominal and pronominal lemma into one ID.

## Provenance Audit

Strictly counting explicit objects in the 31 immutable sources' `attestations` arrays:

- SOURCE book attestations: 576
- SOURCE derived_from_book attestations: 0
- MASTER book attestations: 2577
- MASTER derived_from_book attestations: 0
- PROVENANCE_DOWNGRADES_OR_UPGRADES: 0 direct `book`/`derived_from_book` conversion cases, because none of the 31 sources uses `derived_from_book`.

The master total of 2,577 is internally real, but the reconciliation claim that there were exactly 2,577 incoming source attestations is not an independent source count. The merge code sets the incoming count equal to the final count as a proxy.

The master total decomposes as the 576 chapter-source attestations, 1,926 generated glossary attestations, 56 verb-level table attestations, and only 19 conjugation-level table attestations. Thus 85 newly created table conjugations lack their direct table provenance even though their source rows are known. The 79 synthesized conjugations also have no provenance.

`data/extracted/backmatter/enriched-conjugations.json` contains `derived_from_book`, but it is not one of the 31 specified immutable inputs and has no disposition in this merge; it was not counted as a source for this audit.

## Semantic Garbage Audit

Confirmed canonical garbage includes the 17 bilingual-spill entities listed under Expression and Vocabulary Audit, the copyright-contaminated answer, and the English pseudo-verb relation IDs.

The PDF directly confirms that the canonical spill strings combine adjacent columns or adjacent glossary entries. These are not unusual French and should not have received `NEW_CANONICAL_ENTITY` with zero review/rejection.

No single punctuation-token entity or page heading stored as a top-level verb was found.

## Cross-Chapter Preservation

Top-level entity attestations are retained and no exact attestation was deduplicated away. However, the global graph does not aggregate exercise/example occurrence chapters back onto the canonical verbs.

Examples:

- `verb_prendre` lists only chapter 2, while valid question relations occur in chapters 2, 7, 8, 9, 10, 11, and 15.
- `verb_pouvoir` lists only chapter 3, while valid question relations occur in chapters 3, 9, 11, 13, 14, and 24.
- `verb_avoir` lists only chapter 3, while valid question relations occur in chapters 3, 8, 9, 10, 11, 13, and 24.
- `verb_venir` lists only chapter 4, while valid question relations also occur in chapter 11.

This is information-graph loss: the question records remain, but cross-chapter retrieval from the verb record cannot discover them. The 219 broken links and empty `book.chapter_ids` further prevent the preview from functioning as a dependable global revision graph.

## Knowledge-Graph Trace Tests

| Verb | Direct chapter list | Conjugations | Correct linked expressions | Examples | Derived rule/concept context | Valid exercise-question links |
|---|---|---:|---:|---:|---|---:|
| `verb_prendre` | 02 | 1 | 0 | 2 | `rule_prendre_group_present` | 12 across 7 chapters |
| `verb_demander` | none | 0 | 0 | 1 | indirect-speech rule / concept | 0 |
| `verb_venir` | 04 | 1 | 2 | 6 | 5 rules / movement + indirect speech | 9 across 2 chapters |
| `verb_pouvoir` | 03 | 1 | 0 | 1 | translating-could rule | 21 across 6 chapters |
| `verb_avoir` | 03 | 1 | 9 | 2 | avoir idiom + conjugation rules | 27 across 7 chapters |

Detailed conclusions:

- `prendre`: the verb, present conjugation, examples, and questions exist, but all three canonical `prendre` collocations omit `verb_prendre`, and `prendre une décision` has no entity/link despite its PDF exercise occurrence.
- `demander`: represented primarily as a glossary verb plus one example. The chapter's `expr_demander_de_inf` reference is broken, so the revision graph does not expose its complement pattern.
- `venir`: strongest positive trace. `venir chercher quelqu’un` and `venir de + infinitif` are correctly linked; examples and the present conjugation exist. Cross-chapter exercise occurrence is not reflected on the verb.
- `pouvoir`: the legitimate `peux/puis` variant and two provenance attestations survive. Modal role is absent, and chapter coverage is incomplete.
- `avoir`: several canonical expressions are linked, but many other source glossary `avoir` expressions are unlinked. The productive age pattern is reduced to a fixed number.

## Blocking Issues

The following issues should prevent promotion:

1. 219 broken references, contradicting the zero-broken relationship report.
2. At least 17 confirmed bilingual extraction-spill entities and one copyright-contaminated answer.
3. Two confirmed page-boundary answer failures, including the explicitly targeted `Ses idées sont ...` case.
4. Loss of source gender on 433 vocabulary targets and unreported source gender/POS conflicts, including the `voile` homograph over-merge.
5. Eleven semantically duplicate tense pairs, wrong default moods, and non-source-specific generated-global provenance.
6. Eighty-two empty conjugation paradigms, including three lost source imperatives; 21 wrong compound flags; 85 missing table conjugation attestations.
7. Missing `functional_roles` representation and improper use of `verb_group: impersonal`.
8. Systematic expression under-linking and broken source-referenced patterns, including `prendre`, `demander`, `penser`, and the number slot in `avoir ... ans`.
9. Empty `book.chapter_ids` and incorrect source PDF page-count metadata.

## Non-Blocking Review Items

- Decide whether `prendre un verre` / `prendre un verre du vin` should be variants or distinct records.
- Preserve legitimate frame distinctions for `avoir besoin`, `avoir envie`, and `se plaindre` while repairing their links.
- Decide whether individual questions require their own source-page object rather than inheriting only the parent exercise attestation.
- Review the four table-only verbs with empty English arrays; the verb-table source itself provides no English meaning, so any repair must use another supplied source rather than external enrichment.
- Review one-way chapter/example and verb/exercise navigation even after all broken references are repaired.

## Final Decision

MASTER_SEMANTIC_FIXES_REQUIRED
