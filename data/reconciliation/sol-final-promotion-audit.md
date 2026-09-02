# Sol Final Promotion Audit

## Executive Decision

The frozen preview is **not safe to promote**.

The current merge is cleanly isolated from `data/final/french_grammar.json`, and many internal regression checks pass. However, `scripts/master_merge.ts` does not read any of the 31 authoritative files named by the promotion contract. It instead reads a materially different 31-file tree under `data/extracted/`. The mismatch is substantive rather than a filename alias: entity structures, identifiers, chapter counts, glossary row counts, and attestation counts differ. Consequently, the restored relationships, reconstructed targets, provenance totals, and completeness claims are not certified against the required authoritative inputs.

Two additional evidence defects are independently promotion blocking: the idempotence report copies a single computed hash into both run fields rather than recording two executions, and `UNACCOUNTED_SOURCE_EVIDENCE` is forced to zero by a tautological accounting construction whose 177 relationship-attestation term is itself a constant.

Decision: `MASTER_REPAIR_STILL_REQUIRED`.

## Audit Efficiency / Method

The audit read the three required reports, then used exact searches and short deterministic Node/jq checks over only the named pipeline, frozen preview, reconciliation artifacts, and the 31 required source files. The merge pipeline was not rerun, the PDF was not scanned, and no dataset, source, script, JSON artifact, or configuration was modified.

Semantic inspection stopped once source isolation made promotion impossible. Remaining work was limited to cheap checks needed to characterize whether other claimed safeguards were independently valid.

## Frozen-State Verification

- Recomputed SHA-256 after parsing the preview, removing only `generated_at` and `updated_at`, and serializing it: `e9faedf5b2fea18924eb73bfb2604f158b342b4e94e517450ba88090da46910c`.
- This matches the expected canonical hash and both values written in `master-idempotence-report.json`.
- The current preview therefore matches the artifact represented by the recorded hash.
- This establishes frozen-file identity, but not genuine two-run pipeline idempotence; see **Idempotence**.

## Authoritative Input Isolation

Required reporting:

- `AUTHORITATIVE_INPUT_COUNT = 0` directly consumed from the 31 required `bookdata/json/...` paths.
- `CONFIGURED_ALTERNATE_INPUT_COUNT = 31` (`27` chapter JSON files plus `4` backmatter JSON files under `data/extracted/`).
- `LEGACY_DATA_REFERENCED_BY_PIPELINE = false`.
- `LEGACY_DATA_CONTRIBUTION = 0`.

`scripts/master_merge.ts` configures these inputs:

- `data/extracted/chapters/*.json`
- `data/extracted/backmatter/glossary-en-fr.json`
- `data/extracted/backmatter/glossary-fr-en.json`
- `data/extracted/backmatter/verb-tables.json`
- `data/extracted/backmatter/answer-key.json`

It does not configure or read:

- `bookdata/json/1.json` through `bookdata/json/27.json`
- `bookdata/json/English-Frenchglossary.json`
- `bookdata/json/French-Englishglossary.json`
- `bookdata/json/verb_table.json`
- `bookdata/json/answer_key.json`

The alternate inputs are not byte-equivalent mirrors. For example, `bookdata/json/1.json` and `data/extracted/chapters/chapter-01.json` have different hashes and different structures/IDs. Across all 27 chapters, the required files contain 186 exercises, 1,755 questions, and 4,042 physical attestation objects, while the alternate pipeline chapters contain 197 exercises, 1,872 questions, and 576 physical attestation objects. The required glossaries expose 980 and 81 `entries`; the alternate files are top-level arrays of 978 and 948 records. Only the verb-table pair was byte-identical among the sampled corresponding files.

No import, read, fallback map, ID map, or semantic lookup in `master_merge.ts`, `source-reconciled-targets.ts`, or their directly imported dataset helpers references `data/final/french_grammar.json`. Legacy exclusion therefore passes, but authoritative-input isolation fails.

## 308 Restored Relationships

Artifact-level invariants pass:

- 308 records total.
- 262 `SOURCE_BACKED_ENTITY_RECONCILED`.
- 46 `SOURCE_DERIVED_ENTITY_CREATED`.
- No other resolution class and no `UNRESOLVED_BLOCKER`.
- All 308 owners exist in the frozen preview.
- All 308 canonical targets exist in the frozen preview.
- All 308 restored edges occur on the stated preview owner/field.
- 189 unique targets: 12 concepts, 27 rules, 57 verbs, 83 expressions, 7 examples, and 3 vocabulary items.

The resolution artifact is not independent source proof: every `source_reference_id` equals the final `canonical_target_id`, `source_text` is normally only an owner ID, and the source is generically labeled `immutable-chapter-input`.

Against the required `bookdata/json/1..27.json` files, only 19 of the 308 stated owners were found by exact ID and **0 of 308** stated owner/field/reference triples existed. This reflects the materially different source identifier system. The 308 edges can be classified as internally resolved in the alternate pipeline graph, but they cannot be classified `VALID_SOURCE_BACKED` against the promotion contract. Their audit classification is `UNRESOLVED` with respect to required-source provenance.

No restored edge was converted into a rejection in the current preview. That does not cure the source-authority failure.

## 189 Reconstructed Target Integrity

The trace has exactly 189 unique records with the expected type distribution. However:

- Every trace uses the placeholder source filename `immutable-chapter-input`; zero listed source filenames resolve to a real repository path.
- The trace content is generated by the repair and is often a narrative assertion such as a chapter/section presentation claim.
- The semantic target objects are hardcoded in `scripts/source-reconciled-targets.ts` and injected by `master_merge.ts`.
- The current executable does not validate those objects against the required `bookdata/json` sources.
- The identifier comparison above found 0/308 exact source relationship triples in those required chapter files.

This does not prove the French semantics are false. It proves the required independent grounding is absent. Because the contract forbids accepting ID-derived or repair-authored trace assertions as source evidence, the 189 targets are not promotion-certifiable in the current pipeline.

## 46 Source-Derived Verb Verification

Within the frozen preview/alternate extraction stream, all 46 relationships pass the mechanical prompt test:

- 46/46 owner questions exist.
- 46/46 prompts contain a parenthetical infinitive matching the target verb lemma after accent and punctuation normalization.
- 34 unique lemmas are represented.
- No mismatch or English pseudo-token was found.
- Pronominal spellings normalize consistently.

This group is mechanically coherent. It does not independently repair the global source-authority blocker because the question IDs/prompts being checked come from the alternate extraction stream, not the required chapter files.

## Full Relationship Graph

An independent typed traversal reproducing the schema-aware field set found:

- `RESOLVED_INTERNAL_REFERENCES = 3418`
- `FINAL_BROKEN = 0`
- `CONFIRMED_MALFORMED_REJECTIONS = 88`
- `TOTAL_TYPED_REFERENCES = 3506`

The 88 rejection records divide exactly into:

- 79 missing conjugation-placeholder references.
- 9 pseudo-English verb references using six tokens: `better`, `fewer`, `her`, `their`, `never`, and `where`.

None of the 88 target IDs is defined in the required chapter or verb-table object IDs. The 79 are a mechanically uniform missing-paradigm class, and the six pseudo-English tokens are not French verb lemmas. No legitimate French relationship was exposed inside this rejection set.

The internal graph therefore passes structural closure. Structural closure cannot establish source fidelity when the graph was built from the wrong chapter/glossary inputs.

## Provenance Accounting

The preview contains 2,824 final entity-attestation occurrences and 2,824 unique per-entity attestation keys. The report's identity `2837 - 2824 = 13` is arithmetically consistent with its claimed pre-collapse occurrence count.

The provenance audit is nevertheless not acceptable:

1. `DIRECT_SOURCE_ATTESTATION_OBJECTS = 576` is recomputed from `data/extracted/chapters`, not the required immutable chapter inputs. The 27 required `bookdata/json` chapter files physically contain 4,042 attestation objects across the audited entity arrays.
2. `GENERATED_SOURCE_ATTESTATIONS_FROM_SOURCE_RELATIONSHIPS = 177` is assigned as a literal constant in `master_merge.ts`; it is not derived from the 177 final attestation objects or from reconciliation records.
3. `UNACCOUNTED_SOURCE_EVIDENCE` is algebraically guaranteed to be zero. `totalAuthoritativeSourceEvidence` is defined as the exact sum of `reconciledSourceEvidence` and `rejectedSourceEvidence`, then the latter two are subtracted. This is not an independent completeness reconciliation.
4. The regression test checks the reported 576, 177, and zero values plus a prose string; it does not recompute them from the required inputs.
5. The 177 relationship-generated attestations are numerically separated from the 576 label in the JSON, but their source grounding is not validated against the required source tree.

This is a provenance-label honesty and completeness blocker.

## Generated Global Entities

The artifact contains the expected 31 records: 19 tenses and 12 concepts.

- `number_of_references` equals `reference_locations.length` for all 31.
- The summed reference/location count is 475.
- No record uses `source_files: ["synthesized"]`.
- Mood distribution is correct: indicative 8, subjunctive 4, conditional 2, infinitive 2, imperative 1, gerund 1, participle 1.
- The 19 tense nodes remain consolidated; no regression in the expected tense-node count was found.

The counts are consistent with the frozen preview traversal. Trace paths are not fully truthful as authoritative paths: they use alternate names such as `chapter-01.json`, plus synthetic labels such as `chapter-conjugations.json`, rather than the required `bookdata/json/...` files. Thus reference counting passes internally, while source-location authority fails.

## Targeted Semantic Regression Checks

All requested frozen-preview checks pass:

- `voile`: separate feminine `sail` and masculine `veil` entries; both senses agree with the required English-French glossary rows.
- `expr_vu_que`: English meanings are exactly `given`, `in view of`.
- `expr_des_que`: English is `as soon as`; variant `aussitôt que` is retained.
- `merci`: retained as `thank you`.
- `prendre une décision`, `venir chercher quelqu'un`, `avoir [NUMBER] ans`, `demander de + infinitif`, `penser à`, and `rendre visite à` all exist with their expected semantic links or structured variants.

No additional vocabulary cleanup was attempted.

## Source Completeness Sanity Check

The frozen preview contains 27 chapters, 197 exercises, 1,872 questions, and 1,872 non-empty answers with 1,872 unique question identities. The required answer-key file independently contains 197 exercises and 1,872 answers.

However, the current merge consumes 0/31 of the named authoritative paths. Its alternate chapter stream contains 197 exercises and 1,872 questions, whereas the 27 required chapter files contain 186 exercises and 1,755 questions. Both required glossaries are likewise omitted in favor of differently shaped and differently sized alternate files. Therefore authoritative input completeness fails even though final answer-key identity totals happen to match.

Cheap preservation checks pass:

- PDF page metadata: 286.
- Three non-empty imperative paradigms: `partir`, `regarder`, `vendre`.
- 21/21 compound-table paradigms have `compound: true`.
- 104/104 table conjugations retain `verb_table` attestations.
- `être` retains `auxiliary`; `pouvoir` retains `modal`.
- All seven named pronominal verbs retain `pronominal: true`.
- `exercise_22_22_1_q09` contains the complete continuation.
- `exercise_02_2_3_q06` is exactly `Elle saisit l’occasion.` with no footer contamination.
- No `source_reference_target` shell tag was found.

## Regression Test Quality

The test suite has useful direct checks for schema validity, internal broken references, target presence, `voile`, `vu que`, tense moods, compound flags, selected answer repairs, selected verb flags, and selected expressions.

Critical weaknesses remain:

- It never loads any required `bookdata/json` file, so it cannot detect the source-isolation failure.
- For the 308 restorations it checks report length/classes and final target existence, not source owner/reference evidence.
- Generated-global tests compare `number_of_references` with the artifact's own `reference_locations.length`; they do not independently traverse all generated-target references.
- Provenance tests trust report values and the report's prose assertion rather than recomputing source accounting.
- It does not verify the 1,872 question/answer identity total.
- It reads `master-relationship-audit.json` in addition to a partial direct traversal, and its direct traversal omits some schema relationship collections that the merge's walker includes.
- It does not verify genuine two-run idempotence.

These weaknesses are promotion blocking here because the omitted source and provenance facts fail independent inspection.

## Idempotence

The frozen preview's recomputed stable hash matches the expected value. The durable report fields also have the requested values and config identifier.

The report is not valid evidence of two-run idempotence. At the end of `scripts/master_merge.ts`, one `stableHash` is computed once and the report is written with both `run_1_hash: stableHash` and `run_2_hash: stableHash`, with `hash_match: true` and `result: IDEMPOTENCE_PASS` assigned in that same write. No second pipeline execution or independently captured second hash is represented. Per the audit instruction, the pipeline was not rerun. Frozen identity passes; two-run idempotence certification fails.

## Promotion Blockers

### SOL-BLOCKER-001 — Required authoritative inputs are not consumed

- **Entity / file:** `scripts/master_merge.ts`, `bookdata/json/*`, `data/extracted/*`.
- **Actual evidence:** The merge reads 31 alternate files under `data/extracted` and no required `bookdata/json` path. Corresponding files differ in hashes, schema, IDs, and counts.
- **Expected condition:** Exactly the named 27 chapter files and four named backmatter files must be the authoritative merge inputs.
- **Why unsafe:** Source fidelity, restored relationships, reconstructed semantics, provenance, and completeness are certified against a different data stream.
- **Minimum future repair scope:** Point the merge at the named authoritative files, or add a deterministic, audited normalization stage whose only inputs are those files and whose output equivalence/completeness is proved; then regenerate and re-audit affected artifacts.

### SOL-BLOCKER-002 — Reconstructed-target evidence is not independently mappable to the required sources

- **Entity / file:** `scripts/source-reconciled-targets.ts`, `master-reconciled-target-source-trace.json`, `master-final-relationship-resolution.json`.
- **Actual evidence:** 189 hardcoded targets use generic repair-authored trace claims and placeholder source filenames. Zero of the 308 stated exact owner/field/reference triples was found in the required chapter files.
- **Expected condition:** Semantic content must be supported by actual required-source lesson, taxonomy, prompt, sentence, or lexical records; IDs and repair-authored assertions are insufficient.
- **Why unsafe:** The audit cannot exclude ID-decoded/manual semantic invention against the mandated authority.
- **Minimum future repair scope:** Rebuild the 189 trace records with exact required file paths, source object IDs, fields, and literal/structural evidence, changing semantic targets only where that evidence requires it.

### SOL-BLOCKER-003 — Provenance completeness is tautological and partly constant

- **Entity / file:** `scripts/master_merge.ts`, `master-provenance-audit.json`.
- **Actual evidence:** Direct attestations are counted from the alternate input stream; the 177 relationship count is a constant; total evidence is constructed as reconciled plus rejected evidence, guaranteeing unaccounted evidence equals zero.
- **Expected condition:** All categories, especially direct physical objects and unaccounted evidence, must be independently computed from the required sources and final dispositions.
- **Why unsafe:** The report cannot reveal omitted source evidence and mislabels the source population being accounted.
- **Minimum future repair scope:** Compute each source population and disposition independently from the required inputs, then reconcile by stable evidence identity.

### SOL-BLOCKER-004 — Idempotence report does not represent two runs

- **Entity / file:** `scripts/master_merge.ts`, `master-idempotence-report.json`.
- **Actual evidence:** One runtime hash is copied into both run fields and pass fields are assigned directly.
- **Expected condition:** Two separately executed runs must yield independently captured identical hashes after the documented volatile-field exclusion.
- **Why unsafe:** A nondeterministic second execution could pass this report unchanged.
- **Minimum future repair scope:** Capture hashes from two actual isolated executions of the corrected pipeline and persist their comparison.

## Non-Blocking Observations

- The legacy dataset is fully excluded from the inspected execution path.
- Internal graph closure is clean: 3,418 resolved, zero broken.
- The 88 rejected edges form the expected safe classes.
- All 46 prompt-derived verb relations mechanically match in the frozen alternate-source graph.
- Targeted glossary/expression repairs and all cheap preservation checks survive.
- Sparse English glosses on table-only verbs were not investigated or enriched.

## Final Decision

The current frozen master cannot be promoted because it is not built from the mandated authoritative input paths, reconstructed semantics are not independently traceable to those inputs, provenance completeness is tautological, and the idempotence artifact records one hash as if it were two runs. Passing internal graph and regression checks do not override these source-contract failures.

MASTER_REPAIR_STILL_REQUIRED
