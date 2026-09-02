# Final Master Re-Audit

## Executive Summary

The repaired preview is **not ready for promotion**. Several important repairs are real: the complete canonical-reference traversal now finds zero absent targets; the two answer-key boundary errors are corrected; all 79 empty synthetic conjugations are gone; the three imperative paradigms survive; source gender is retained; the 11 known tense-pair duplications are collapsed; functional roles and the seven named pronominal flags are repaired; the targeted expression patterns are linked; and book metadata is correct.

Promotion blockers remain. All 19 tense nodes still say `mood: indicative`, including 11 plainly non-indicative current nodes. Twelve of the 21 source compound paradigms still have `compound: false`. The 17 specifically reported glossary spill records are absent, but the known `au`, `le`, and `vu` fragments remain and rejecting `you merci` lost the source-supported `merci` entry. Vocabulary POS/sense handling remains unsafe and introduced same-form/same-meaning duplicate nodes for several mere gender conflicts. Generated-global provenance still uses `source_files:["synthesized"]` and a fixed reference count of 1 for all 31 records. The missing-target sweep also introduced empty, ID-decoded semantic entities, including 27 rules, 83 expressions, and 7 examples. The claimed two-run idempotence evidence is not present in the repository.

## Usage-Efficient Verification Approach

Deterministic scripts checked all canonical typed references, all 88 rejection records, source/target mappings, exact corruption strings, gender preservation, tense metadata, conjugations, answer identities, entity emptiness, duplicate candidates, hashes, and graph traces. Semantic review focused on the two rejection classes, known glossary/POS/homograph risks, tense moods, compound paradigms, targeted verbs/expressions, and repair-created placeholder entities. Direct PDF review was limited to pages 274-275 and 283-284 for the two answer corrections, plus targeted text extraction for questionable glossary repairs. One Luna sub-agent was used for high-volume mechanical checks; final semantic judgments were independently made here.

## Original Blocking Issue Verification

| Original Issue | Status | Evidence | Promotion Blocking? |
|---|---|---|---|
| 1. Broken relationships | FIXED | Complete traversal: 3,331 typed references, 3,331 existing targets, 0 absent. The 88 removals were separately audited. | NO |
| 2. Glossary bilingual spill / semantic garbage | PARTIALLY_FIXED | The 17 reported spill strings are gone, but `vocab_au`, `vocab_le`, and `vocab_vu` retain split-column fragments, and source-supported `merci` was lost. | YES |
| 3. Two answer-key boundary failures | FIXED | Both answers match the actual text spanning PDF pages 274-275 and 283-284; footer contamination is absent. | NO |
| 4. Vocabulary gender/POS/sense loss and `voile` over-merge | PARTIALLY_FIXED | 446 gender-bearing canonical targets retain gender and `voile` is split correctly, but known POS corruption remains and several mere gender conflicts were split into duplicate lexical nodes. | YES |
| 5. Duplicate tense nodes / wrong mood metadata / generated traceability | PARTIALLY_FIXED | The 11 known pairs are unified, but all 19 nodes are still indicative and all 31 generated-global records retain false synthesized/one-reference trace data. | YES |
| 6. Empty conjugations / imperatives / compound flags / table provenance | PARTIALLY_FIXED | 0 empty paradigms; 3/3 imperatives present; 104/104 table paradigms have table attestations; 12/21 compound paradigms remain false. | YES |
| 7. `functional_roles` / impersonal misuse | FIXED | Schema supports the field; auxiliary/modal/impersonal roles are present; `falloir` and `pleuvoir` use `verb_group: unknown`, not `impersonal`. | NO |
| 8. Expression links and patterns | PARTIALLY_FIXED | All named targets pass, but 83 ID-decoded `source_reference_target` expressions have empty English semantics and weak synthetic content. | YES |
| 9. `book.chapter_ids` / PDF metadata | FIXED | Exactly `chapter_01` through `chapter_27` in order; both local PDF metadata and direct PDF loading report 286 pages. | NO |

## Relationship Re-Audit

The current registry covers book, chapter, section, concept relations, tense fields, rule fields, verb fields, conjugation endpoints, expression fields/relations, vocabulary fields, example relations, exercise chapter/section links, and nested question relations. An independent traversal reproduced:

- `TOTAL_TYPED_REFERENCES: 3331`
- `RESOLVED: 3331`
- `BROKEN: 0`

The merge audit tests existence in the global ID set rather than enforcing collection type. The only apparent prefix/type mismatch was `vocab_reponse.word_family_ids -> verb_repondre`; a word-family edge can legitimately cross lexical entity types, so it is not classified as broken. Sense-level `example_ids` were also checked independently and did not add any references or failures.

Zero broken references does not establish semantic completeness: the missing-target sweep created numerous empty records, addressed under New Regressions.

## Rejected Relationship Audit

- `TOTAL REJECTED: 88`
- `MECHANICALLY VALID RECORDS: 9/88`
- `SEMANTICALLY VERIFIED MALFORMED: 88` (9 direct cases; 79 verified as a complete repetitive group)
- `SAMPLED LOW-RISK: 12/79` conjugation-placeholder records manually inspected after complete group checks
- `HIGH-RISK REVIEWED: 79` legitimate-looking French conjugation IDs, reviewed programmatically as one class; all 9 pseudo-English cases reviewed directly
- `IMPROPER REJECTIONS FOUND: 0`

Grouping is exact:

| Field / class | Count | Source pattern | Reason |
|---|---:|---|---|
| `relations.verbs` | 9 | `better` (2), `fewer` (1), `her` (2), `their` (2), `never` (1), `where` (1) | English extraction placeholders, not French verbs |
| `conjugation_ids` | 79 | One `present_indicative` reference per French verb, across chapters 1-6 | No chapter paradigm and no matching verb-table row/forms |

All 79 conjugation references occur on their stated source verb, but none has a source conjugation object, none of the 79 owners appears in the supplied verb table, and none has a retained canonical target. Group rejection is therefore semantically safe and did not discard an authoritative paradigm.

The resolution evidence is nevertheless malformed for audit purposes: all 79 conjugation records have `source_context: null`, so only the 9 pseudo-English records contain every required context field. The generic file label `chapter source` also omits the actual chapter filename, even though deterministic lookup located 29 records in chapter 1, 19 in chapter 2, 6 in chapter 3, 6 in chapter 4, 8 in chapter 5, and 11 in chapter 6.

## Glossary Integrity

Exact canonical-field searches found none of the 14 named malformed expressions or the three named malformed vocabulary strings. The repair file accounts for 17 rejected rows, and valid neighboring content survives for the checked forms including `avoir mal...`, `avoir un rhume`, `recevoir son diplôme`, `de temps en temps`, `devoir`, `randonner`, `vieillir`, `brancher`, `bras`, `chercher`, `cheveux`, `diamant`, `pouvoir`, `préférer`, `selon`, and `sembler`.

The repair is incomplete:

- `vocab_au`: English `cinéma at the movies`
- `vocab_le`: English `mardi on Tuesdays`, `vendredi on Fridays`
- `vocab_vu`: English `que given`, `in view of`
- PDF page 272 prints `thank you merci`, but rejecting the malformed `you merci` row created no canonical `merci` entity. The report's assertion that valid adjacent rows were processed independently is false for this case.

These are the same source-column failure class as the original blocker.

## Vocabulary Metadata / Homographs

Across 800 gender-bearing glossary rows routed to vocabulary, there are 446 current canonical targets and zero missing canonical noun genders. `voile` is no longer over-merged: `vocab_voile` is feminine/`sail`, while `vocab_voile_veil` is masculine/`veil`.

Conflict handling is still unsafe:

- `douleur` remains canonically `part_of_speech: adjective` despite noun morphology and the source noun evidence.
- `arabe` and `chinois` remain `part_of_speech: other` despite noun morphology.
- `marchand` still mixes the headword with continuation phrases in its English array.
- `anniversaire`, `meurtrier`, `patron`, and `veuf` were split into two nodes even though each pair has the same French form and overlapping/same English meaning; the conflicting gender metadata does not establish separate senses. The conflict report incorrectly labels these as homographs.
- Normalization also exposes unreviewed duplicate pairs for `peinture`, `penderie`, and `étudiant`.

Thus aggregate gender retention is fixed, but POS and sense identity are not promotion-safe.

## Tense Canonicalization

All 11 original French/English pairs resolve to a single node; the tense count fell from 30 to 19 and no normalized duplicate tense label remains.

Mood repair failed. Every one of the 19 tenses is `indicative`. At minimum 11 current IDs directly identify non-indicative categories: two conditional, three subjunctive, one imperative, two infinitive, one participle, one gerund, and one pluperfect-subjunctive node. Source verb-table rows explicitly provide conditional, imperative, and subjunctive moods, so this is not an outside-language inference.

All tense attestations remain empty, and their generated trace records are not source-specific.

## Conjugations / Verb Tables

- `EMPTY_SYNTHETIC_CONJUGATIONS: 0`
- `SOURCE_IMPERATIVE_PARADIGMS_EXPECTED: 3`
- `SOURCE_IMPERATIVE_PARADIGMS_PRESENT: 3`
- `TABLE_DERIVED_CONJUGATIONS: 104`
- `TABLE_DERIVED_WITH_PROVENANCE: 104`
- `COMPOUND_FLAG_MISMATCHES: 12`

The `regarder`, `vendre`, and `partir` imperatives each retain `tu`, `nous`, and `vous` forms. `conj_pouvoir_present_indicative` retains the `je peux / je puis` variant and both chapter/table attestations.

The supplied regular table contains 21 compound paradigms (seven for each of the three regular model verbs). Only the nine whose matched `source_anchor` contains `compound_` are marked compound. Conversational past/present perfect, pluperfect indicative, past subjunctive, and pluperfect subjunctive remain false for each model verb, leaving 12 mismatches. This is caused by faulty provenance-table matching, which falls back to the simple-present table for those names.

## Verb Metadata

`functional_roles` is present in the schema and preview. `avoir`/`être` are auxiliary, `pouvoir`/`devoir`/`vouloir` are modal, and `falloir`/`pleuvoir` are impersonal. The latter two no longer misuse `verb_group`.

All seven targeted records - `s'abonner`, `s'accroupir`, `s'apercevoir`, `s'enfuir`, `s'entraîner`, `s'épanouir`, and `s'évanouir` - have `pronominal: true`.

## Expression / Pattern Graph

Targeted repairs pass:

- `prendre une décision` exists, links `verb_prendre`, and honestly uses a `derived_from_book` exercise attestation.
- `venir chercher quelqu'un` remains intact and links both base verbs.
- `avoir [NUMBER] ans` has a required number slot and retains the fixed form as a variant.
- `demander de + infinitif` and `penser à` exist and link their verbs using source-derived attestations.
- The two `rendre visite` records are consolidated into `expr_rendre_visite_a`, with the other surface form retained as a variant and both glossary attestations preserved.

However, the relationship-target synthesis pass creates 83 expressions tagged `source_reference_target` with empty English arrays and forms mechanically decoded from IDs (for example, `aller inf` and `a condition que subjonctif`). They are relationship placeholders, not promotion-safe canonical constructions.

## Answer-Key Verification

- `EXPECTED EXERCISES: 197`
- `EXPECTED ANSWERS: 1872`
- `ORPHANS: 0`
- `DUPLICATES: 0`
- `MISSING: 0`

Actual PDF pages 274-275 show `Elle saisit` followed on the next page by `l'occasion.` The preview correctly stores `Elle saisit l’occasion.` with no copyright/footer text. Actual PDF pages 283-284 show `Ses idées sont` followed by `bonnes? —Oui, ses idées sont meilleures que les nôtres.` The preview stores the complete answer.

The correction report records both pages for each repair. The embedded question provenance retains only the first page because its schema has scalar page fields; this trace limitation is non-blocking because the correction artifact preserves the full boundary evidence.

## Book / Generated Metadata

`book.chapter_ids` contains exactly 27 ordered IDs (`chapter_01` through `chapter_27`). Direct loading of `docs/source_book.pdf` reports 286 pages, matching the preview.

`master-generated-global-entities.json` fails the required traceability check. All 31 records use `source_files:["synthesized"]`, all use creation reason `Synthesized to fix broken reference`, all report `number_of_references: 1`, and none supplies source fields/reference locations. This contradicts the claimed repair and the actual graph.

## Provenance

Independent counts found:

- `DIRECT_SOURCE_ATTESTATION_OBJECTS: 576` in the 27 immutable chapter inputs
- `GENERATED_SOURCE_ATTESTATIONS_FROM_GLOSSARY_ROWS: 1909`
- `GENERATED_SOURCE_ATTESTATIONS_FROM_VERB_TABLE_VERB_ROWS: 56`
- `GENERATED_SOURCE_ATTESTATIONS_FROM_VERB_TABLE_CONJUGATION_ROWS: 104`
- `FINAL_UNIQUE_ATTESTATIONS: 2799`
- `derived_from_book` expression attestations: 4

The remaining 150 final attestations are repair-created `book` attestations on 57 verbs, 83 expressions, 3 vocabulary records, and 7 examples synthesized from relationship IDs. They are not direct source attestation objects and the merge summary does not distinguish them.

`master-provenance-audit.json` is only `{ "status": "PASS" }`; it provides none of the required category counts. The merge summary reports only `book: 2795` and `derived_from_book: 4`, obscuring direct versus generated provenance. Table conjugation provenance is complete, and `prendre une décision` is honestly labeled derived, but aggregate provenance accounting is not promotion-safe.

## Cross-Chapter Graph

Canonical reverse traversal from question/example edges produces the following reachable coverage:

| Verb | Reachable Chapters | Conjugations | Linked Expressions | Examples | Questions | Rule/Concept/Tense Contexts |
|---|---:|---:|---:|---:|---:|---:|
| `prendre` | 7 | 1 | 4 | 2 | 12 | 2 |
| `pouvoir` | 7 | 1 | 0 | 1 | 21 | 1 |
| `avoir` | 7 | 1 | 26 | 2 | 27 | 1 |
| `venir` | 4 | 1 | 2 | 6 | 9 | 5 |
| `demander` | 1 | 0 | 1 | 1 | 0 | 1 |
| `penser` | 3 | 0 | 1 | 1 | 2 | 1 |

The repaired canonical question references make these indirect occurrences reachable without mislabeling them as direct book attestations. This satisfies the targeted cross-chapter graph requirement, although the verb schema still has no explicit occurrence-chapter field.

## Semantic Garbage

Automated scans found these repair-created empty semantic records:

- 27 grammar rules with empty explanations and no attestations
- 57 `source_reference_target` verbs with empty English/sense content (plus four table-only verbs whose source legitimately supplies no English)
- 83 `source_reference_target` expressions with empty English content
- 3 `source_reference_target` vocabulary records with empty English content
- 7 examples with empty French and English strings

These records explain part of the drop from 219 broken references to zero: target IDs now exist, but semantic content was inferred from slugs or left empty. The `au`/`le`/`vu` glossary fragments described above also remain. No copyright text remains in answers, and no pseudo-English verb entity was created.

## Duplicate / Over-Merge Check

No normalized duplicate verb, expression, tense, or conjugation identity remains. `rendre visite` and the 11 tense-pair duplicates are correctly unified; pronominal and apostrophe forms remain distinct where appropriate; `voile` is correctly split by meaning/gender.

Vocabulary normalization returns eight multi-node forms. `voile` is a justified homograph split, but at least `anniversaire`, `meurtrier`, `patron`, and `veuf` are same-form/same-meaning conflict splits rather than demonstrated distinct senses. `peinture`, `penderie`, and `étudiant` require source resolution and were not reported by the duplicate audit. The generated duplicate audit's empty result is therefore not reliable.

## Regression Test Evidence

The regression script was inspected and run once; it passed. `Passed: 1` represents one deterministic suite containing multiple assertions for schema parsing, reported broken-reference count, chapter/page metadata, empty conjugations, three imperatives, pseudo-verbs, selected expressions, and a narrow bilingual-spill regex.

Coverage is not sufficient for the original blocker set. It does not assert tense moods, compound flags, vocabulary POS/sense handling, generated provenance, source-context completeness, cross-chapter reachability, answer text, or repair-created empty semantic entities. Its relationship assertion trusts the generated summary rather than recomputing the graph.

## Idempotence Evidence

The current preview independently hashes to `e43d5175adbe10c01e4ef22cc0bc5c4ff487e4a29fb26865cd50d9126445aafb` after excluding `generated_at` and `updated_at`, matching the repair report.

Only one resulting hash is preserved in repository artifacts. The report says a second run *must* reproduce it; it does not record two run hashes, configurations, or a hash-match record. The two-run values in the audit request therefore cannot be independently verified without rerunning the merge, which strict low-usage instructions prohibit absent reliable artifacts.

`IDEMPOTENCE_EVIDENCE_INSUFFICIENT`

## New Regressions

- Relationship-target synthesis introduced 177 weak/empty semantic targets: 27 rules, 57 verbs, 83 expressions, 3 vocabulary records, and 7 examples.
- 150 generated relationship-target attestations are labeled as direct `book` attestations in aggregate accounting.
- Same-form/same-meaning gender conflicts were split into duplicate vocabulary nodes and described as homographs.
- The generated-global report still contains false synthesized provenance and reference counts.
- Seventy-nine rejection records omit source context.

These are likely repair-side effects rather than a broader linguistic audit.

## Remaining Blocking Issues

1. Incorrect tense mood metadata on all 11 plainly non-indicative current tense nodes.
2. Twelve source compound paradigms still marked non-compound.
3. Incomplete glossary corruption repair (`au`, `le`, `vu`) and loss of source-supported `merci`.
4. Unsafe vocabulary POS/sense conflict handling and newly introduced duplicate lexical nodes.
5. False/incomplete generated-global and aggregate provenance.
6. Large-scale creation of empty, ID-derived semantic targets to obtain zero broken references.
7. Expression graph polluted by 83 empty, ID-decoded placeholder constructions.

## Remaining Non-Blocking Items

- The 79 rejected conjugation records need exact chapter filenames/source contexts added to their evidence, although the group rejection itself is semantically supported.
- Embedded answer provenance stores only the first boundary page; the correction report preserves both pages.
- `prendre un verre` variants remain deliberately unresolved.
- Four table-only verbs have empty English arrays because their supplied table rows contain no English meaning.
- One cross-type word-family edge (`réponse` -> `répondre`) is valid but not representable by a single-prefix target rule.
- A durable two-run hash record is missing.

## Final Decision

MASTER_REPAIR_STILL_REQUIRED
