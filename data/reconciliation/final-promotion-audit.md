# Final Promotion Audit

## Executive Summary

The second repair is **not ready for promotion**.

Two blocker categories are fixed: the 19 tense moods match source metadata, and all 21 source compound paradigms are marked compound. The literal placeholder shells are also gone, the requested regression checks remain intact, and the durable two-run idempotence artifact is coherent.

Promotion-blocking problems remain:

- The fall from 3,331 to 3,023 typed relationships is exactly explained by 308 newly rejected non-placeholder relationships. These include 99 concept links, 83 expression links, 67 verb relations, 27 rule links, and other source-aligned links. The rejection reason is only that no target entity definition was found. Targeted source checks show that these are meaningful relationships, not confirmed malformed extraction.
- `voile` has regressed from two source-supported senses back into one unsensed record containing both `sail` and `veil` with one gender.
- The targeted `au`, `le`, and `vu` records are removed and `merci -> thank you` is restored, but the neighboring canonical `vu que` record still contains French continuation text inside its English meanings.
- Generated-global traces now name real files and locations, but every one of the 19 records still reports `number_of_references: 1`; independent typed traversal gives counts from 3 to 158.
- Provenance totals reproduce mechanically, but `FINAL_UNIQUE_ATTESTATIONS` is a raw occurrence count rather than a unique count, `UNACCOUNTED_SOURCE_EVIDENCE: 0` is hard-coded, and the 308 meaningful rejected relationship occurrences are not honestly accounted as retained knowledge.

## Usage-Efficient Verification

Verification was limited to the three required reports, the current preview, the named reconciliation artifacts, the immutable chapter/glossary/verb-table inputs needed for targeted source checks, and PDF page 272 for `merci`. The merge pipeline was not rerun and the PDF was not inspected beyond that page.

Deterministic checks independently recomputed the complete typed relationship count, tense distribution, exact compound-table set, placeholder/empty-record counts, targeted vocabulary identities, regression counts, generated trace reference counts, attestation counts, and the stable preview hash. The regression test was run once because no durable execution report was present; it passed.

## Second-Repair Blocker Verification

| # | Second-repair blocker | Status | Promotion blocking |
|---:|---|---|---|
| 1 | Tense moods | FIXED | NO |
| 2 | Compound flags | FIXED | NO |
| 3 | Residual glossary corruption + `merci` | PARTIALLY_FIXED | YES |
| 4 | Vocabulary POS/sense identity | REGRESSED | YES |
| 5 | Generated-global traceability | PARTIALLY_FIXED | YES |
| 6 | Placeholder semantic entities / relationship loss | PARTIALLY_FIXED | YES |
| 7 | Provenance accounting | NOT_FIXED | YES |

## Tense Metadata

Independent preview counts reproduce the reported 19-node distribution:

| Mood | Count |
|---|---:|
| conditional | 2 |
| indicative | 8 |
| gerund | 1 |
| imperative | 1 |
| subjunctive | 4 |
| infinitive | 2 |
| participle | 1 |

The 15 finite tense assignments agree with the `mood` values in the verb-table `other_tenses` rows and with the exact table identities/titles. The four non-finite assignments are tied to immutable chapter references: present infinitive in chapters 6 and 14, past infinitive in chapter 14, and present participle/gerund in chapter 15. No tense uses `other`, and no assignment requires guessing from an unsupported canonical slug.

The 11 previously duplicated French/English tense pairs remain consolidated. There are 19 exact French tense labels and no duplicated label group.

**Result: FIXED; not promotion blocking.**

## Compound Paradigms

The exact seven source table IDs denoting compound paradigms were matched against conjugation attestation anchors:

- `verb_table_regular_compound_conversational_past`
- `verb_table_regular_compound_pluperfect`
- `verb_table_regular_compound_past_perfect`
- `verb_table_regular_compound_future_perfect`
- `verb_table_regular_compound_past_conditional`
- `verb_table_regular_subjunctive_past`
- `verb_table_regular_subjunctive_pluperfect`

Each table contributes `regarder`, `vendre`, and `partir`, yielding exactly 21 source paradigms. All 21 current conjugations have `compound: true`.

- `SOURCE_COMPOUND_PARADIGMS: 21`
- `MISMATCHES: 0`

**Result: FIXED; not promotion blocking.**

## Glossary Integrity

The canonical vocabulary IDs `vocab_au`, `vocab_le`, and `vocab_vu` are absent, so their originally reported malformed meanings (`cinéma at the movies`, the Tuesday/Friday continuations, and `que given` / `in view of`) no longer survive on those records.

`vocab_merci` exists as `merci -> thank you` and has a glossary EN->FR attestation at printed page 258 / PDF page 272 anchored to `expr_you_merci`. Targeted extraction of PDF page 272 independently shows `thank you merci` between the neighboring `thank, to remercier` and `theater théâtre (m.)` rows.

Neighbor checks found that `cinéma`, `au cinéma`, `le mardi`, `le vendredi`, `remercier`, `théâtre`, and the immediately adjacent FR->EN headwords remain present. The repair therefore did not delete those neighboring legitimate entries.

However, the neighboring canonical `expr_vu_que` remains semantically corrupted. Its English array is:

- `given étant donné que,`
- `in view of étant donné que,`

The French continuation `étant donné que` is still stored as English meaning text. This is the same bilingual continuation failure class and was exposed by the targeted `vu` neighborhood check.

**Result: PARTIALLY_FIXED; promotion blocking.**

## Vocabulary Identity

The targeted POS repairs for `douleur`, `arabe`, `chinois`, and `marchand` now select the source-supported noun analysis. `marchand` retains only `merchant` and `storekeeper`; its specialty continuation fragments are no longer meanings. `anniversaire`, `meurtrier`, `patron`, `veuf`, `peinture`, `penderie`, and `étudiant` each have one canonical record, so same-form/same-meaning rows are no longer split merely because source gender metadata disagrees. No exact duplicate French headword group exists in the current vocabulary.

`voile` has regressed. The immutable EN->FR glossary has two rows:

- feminine `voile` -> `sail`
- masculine `voile` -> `veil`

The current preview has one `vocab_voile`, feminine, with `english: ["sail", "veil"]` and no senses. The second repair therefore reintroduced the previously confirmed over-merge and discarded the sense/gender distinction.

**Result: REGRESSED; promotion blocking.**

## Placeholder Entity Check

Programmatic checks found:

- `source_reference_target` verbs: 0
- `source_reference_target` expressions: 0
- `source_reference_target` vocabulary: 0
- grammar rules with empty explanations: 0
- expressions with empty canonical/English semantics: 0
- examples with empty French/English text: 0
- empty vocabulary meanings: 0

The only verbs without English/sense content are the four already identified table-only source records (`conclure`, `haïr`, `(s')asseoir`, and `vaincre`); each has real verb-table provenance and is not a fake shell.

Literal ID-decoded shells are gone. They were not replaced with source-backed canonical semantics, however: the corresponding relationship evidence was broadly deleted, as detailed below.

**Shell absence: FIXED. Combined placeholder/removal category: PARTIALLY_FIXED and promotion blocking because of semantic relationship loss.**

## Relationship Preservation

An independent complete typed traversal reproduced:

- `FINAL_TYPED_REFERENCES: 3023`
- `FINAL_RESOLVED: 3023`
- `FINAL_BROKEN: 0`

The traversal covers book/chapter/section arrays; concept relations; tense rule, conjugation, example, exercise, and tense links; grammar-rule arrays and mood-governance triggers; verb arrays; conjugation endpoints; expression arrays and relations; vocabulary arrays; example relations; exercise chapter/section links; and every nested question relation.

Zero broken references was achieved with semantic loss. The previous repaired state had 3,331 typed references. The exact difference is 308, and the rejection artifact contains exactly 308 newly removed non-placeholder relationship occurrences:

| Removed relationship field | Count |
|---|---:|
| `concept_ids` | 99 |
| `expression_ids` | 83 |
| `relations.verbs` | 67 |
| `grammar_rule_ids` | 27 |
| `verb_ids` | 20 |
| `example_ids` | 7 |
| `related_vocabulary_ids` | 2 |
| `vocabulary_ids` | 1 |
| `relations.grammar_rules` | 1 |
| `mood_governance.trigger_expression_ids` | 1 |
| **Total** | **308** |

These are not the 88 previously audited safe removals (79 empty-paradigm conjugation references plus 9 English pseudo-verbs); those had already been excluded in the 3,331-reference state.

High-risk source checks show direct semantic alignment, for example:

- Chapter 18, its two sections, and two substantive indirect-speech rules all reference `concept_indirect_speech`, yet all such links and every concept node are now gone (`concepts: 0`).
- The section titled “The verb aller (to go)” references `expr_aller_bien`; the relationship and target are gone.
- The section titled “The indefinite and partitive articles with nouns” references `rule_partitive_articles_du_de_la_des`; the relationship and target are gone.
- The section “Verbs that use different prepositions” and the sentence `Tu me manques beaucoup depuis ton départ.` both reference `verb_manquer`; those links and the canonical verb are gone.
- The other rejected expression, rule, example, vocabulary, and French-verb groups consist of plausible French grammatical entities and receive no evidence of extraction corruption.

The generic reason “target has no entity definition” establishes non-resolution, not malformed source evidence. Removing the relationships rather than retaining or resolving their source-supported semantics is a promotion blocker.

## Rejected Source Evidence

- `TOTAL_REJECTED_SOURCE_EVIDENCE: 396`

Exact grouping by failure class:

| Failure class | Reason / field group | Count | Judgment |
|---|---|---:|---|
| English pseudo-verb extraction | `question.relations.verbs` (`better`, `fewer`, `her`, `their`, `never`, `where`) | 9 | Semantically safe rejection |
| Empty-paradigm placeholder | `verb.conjugation_ids`; no chapter paradigm and no verb-table forms | 79 | Semantically safe rejection |
| Generic unresolved source relationship | The ten field groups listed under Relationship Preservation | 308 | Improper rejection of meaningful source relationship evidence |

The 308 generic records all use `source_file: immutable-chapter-input`, but give only the owner ID as context and the same non-semantic “registry lookup failed” evidence. Group inspection found meaningful French target IDs and thematic agreement with the owning chapters, sections, rules, examples, and questions. No malformed-extraction signature was supplied or found for this group.

- `SEMANTICALLY_SAFE_REJECTIONS: 88`
- `QUESTIONABLE_REJECTIONS: 0`
- `IMPROPER_REJECTIONS: 308`

The classification is by relationship occurrence, matching the 396-row artifact. The 308 improper occurrences exactly equal the relationship-count reduction from 3,331 to 3,023.

## Generated Global Trace

There are 19 generated-global records, all tenses; no generated concepts remain because all concept relationships and nodes were removed. Every trace now names a real source file, source entity ID, relationship field, and reference location. Fifteen point to `verb-tables.json`; four point to chapter 6, 14, or 15. The old `source_files: ["synthesized"]` value is gone.

The reference counts are still false. Every trace reports `number_of_references: 1`. Independent typed traversal finds actual current reference counts ranging from 3 to 158, including:

- present indicative: 158
- imperfect: 25
- passé composé: 25
- conditional present: 18
- imperative: 13
- present subjunctive: 12
- present infinitive: 9
- the least-referenced generated tenses: 3 each

The traces also list only one exemplar source entity/location rather than the real set of reference locations. The generated-global repair is therefore source-specific but not complete or numerically truthful.

**Result: PARTIALLY_FIXED; promotion blocking.**

## Provenance

The current report contains the requested categories and the numerical values reproduce from the preview/source artifacts:

- `DIRECT_SOURCE_ATTESTATION_OBJECTS: 576`
- `GENERATED_SOURCE_ATTESTATIONS_FROM_GLOSSARY_ROWS: 1906`
- `GENERATED_SOURCE_ATTESTATIONS_FROM_VERB_TABLE_VERB_ROWS: 56`
- `GENERATED_SOURCE_ATTESTATIONS_FROM_VERB_TABLE_CONJUGATION_ROWS: 104`
- `DERIVED_FROM_BOOK_ATTESTATIONS: 4`
- `OTHER_GENERATED_GRAPH_EVIDENCE: 19`
- `FINAL_UNIQUE_ATTESTATIONS: 2660`
- `REJECTED_SOURCE_EVIDENCE: 396`
- `UNACCOUNTED_SOURCE_EVIDENCE: 0`

The 576 direct objects independently match the attestation count in the 27 immutable normalized chapter inputs. The 19 `OTHER_GENERATED_GRAPH_EVIDENCE` records are precisely the generated tense traces inspected above: 15 table-backed and four chapter-reference-backed. They are plausible evidence records, but their reference counts/locations are incomplete. No surviving fake ID-derived entity was found mislabeled as direct `book` evidence.

The accounting is not honestly defined in three material respects:

1. `FINAL_UNIQUE_ATTESTATIONS` is assigned the raw number of final attestation occurrences. There are 2,660 occurrences, but 13 are exact duplicates within the same entity, leaving 2,647 entity-attestation occurrences after per-entity exact deduplication.
2. `UNACCOUNTED_SOURCE_EVIDENCE` is hard-coded to zero in `scripts/master_merge.ts`; it is not computed by reconciling sources, dispositions, rejections, and retained canonical evidence.
3. The 308 meaningful source relationship occurrences are classified as rejected solely because lookup failed. Treating deletion as accounting does not preserve or honestly dispose of their semantic evidence.

The category totals legitimately overlap by role, so simple addition is not required. The problem is category definition and unsupported zero-unaccounted assurance, not arithmetic alone.

**Result: NOT_FIXED; promotion blocking.**

## Regression Preservation

Cheap checks confirm the previously fixed areas that are not implicated by the newly discovered relationship loss:

- 197 exercises and 1,872 answers
- both complete page-boundary answers, with no footer contamination
- three non-empty imperative paradigms (`regarder`, `vendre`, `partir`)
- 104/104 table-derived conjugations with verb-table provenance
- auxiliary, modal, and impersonal `functional_roles`
- all seven named pronominal flags
- `prendre une décision`
- `venir chercher quelqu'un`
- productive `avoir [NUMBER] ans`
- the `demander de + infinitif` and `penser à` patterns
- canonical `rendre visite à` with the alternate surface form as a variant
- 27 chapter IDs
- PDF page count 286
- the previously reported question/example graph traces for `prendre`, `pouvoir`, `avoir`, `venir`, `demander`, and `penser`

The last check does not offset newly deleted graph knowledge such as `verb_manquer` and the 308 relationships described above.

The regression script passed once. It now asserts mood presence, the 21 compound flags, the three targeted corrupt vocabulary IDs, `merci`, placeholder-shell absence, generated source-file presence, and the reported zero-broken count. Coverage remains insufficient for promotion because it:

- does not assert `voile` sense separation or the other targeted vocabulary identities;
- accepts any generated `number_of_references > 0`, so the false fixed value of 1 passes;
- checks only that provenance contains a number, not that categories are honestly computed;
- trusts `master-relationship-audit.json` instead of independently traversing relationships;
- does not test preservation of the 3,331-state relationships or rejection semantics.

## Idempotence

`master-idempotence-report.json` contains all required durable fields:

- identical `run_1_hash` and `run_2_hash`
- `hash_match: true`
- excluded volatile fields: `generated_at`, `updated_at`
- pipeline/config identifier: `scripts/master_merge.ts`
- result: `IDEMPOTENCE_PASS`

The current preview independently hashes, after removing those two volatile fields, to:

`f6cd68af9d34c0d5e7e6476837f1f8398ff3252ff33870d715c11b23af5b9de4`

The pipeline was not rerun. The preserved two-run evidence is complete and coherent.

## Remaining Blocking Issues

1. Restore source-supported relationship knowledge instead of rejecting the 308 meaningful typed relationship occurrences merely because their targets lack definitions.
2. Re-separate `voile` into the source-supported `sail` and `veil` senses with their distinct genders.
3. Remove the surviving French continuation fragments from the English meanings of `expr_vu_que` while preserving the legitimate construction.
4. Give all 19 generated-global traces their actual reference counts and complete source/reference locations.
5. Replace hard-coded/mislabeled provenance accounting with computed, auditable categories that account honestly for source relationship evidence.
6. Extend regressions to detect the vocabulary, trace-count, provenance-definition, full traversal, and relationship-preservation failures above.

## Remaining Non-Blocking Items

- The four table-only verbs have intentionally sparse English metadata but real verb-table provenance.
- `prendre un verre` variants remain deliberately unresolved.
- Embedded answer provenance still stores one page while the correction artifact preserves both boundary pages.
- One cross-type word-family link (`réponse` -> `répondre`) remains representationally unusual but semantically defensible.

## Final Decision

The required conditions for promotion are not met. Although tense moods, compound flags, literal placeholder removal, previous targeted repairs, and idempotence pass, valid source-supported relationships were removed to reach zero broken references; `voile` regressed; a targeted glossary continuation defect remains; generated-global counts are false; and provenance accounting is not auditable.

MASTER_REPAIR_STILL_REQUIRED
