# High-Risk Enrichment Pipeline Plan

## 1. Purpose and boundary

This document specifies a separate, conservative pipeline for enriching fields
that define linguistic facts, structure, source-derived content, or learner
answers. It is intentionally distinct from the completed normal enrichment
queue. Normal enrichment is additive and only touches `SAFE_FIELDS`; this
pipeline must never reuse that authorization list or its permissive behaviour.

The primary initial use case is completing missing verb conjugation paradigms.
It can later support the other high-risk fields listed in section 3, but each
field (or tightly related field family) requires its own explicit policy,
generator, validator rules, tests, and human approval before it can run.

Non-negotiable invariants:

- `data/MASTER_DATA.json` is immutable source data. No script, AI worker, or
  reviewer may overwrite it.
- The normal-enrichment output (`enrichment/MASTER_DATA_ENRICHED.json`) must
  not be overwritten by a high-risk run.
- Write high-risk results only to a separately named derived dataset, such as
  `enrichment/HIGH_RISK_DATA_ENRICHED.json`; create it from the approved
  normal-enriched dataset if it exists, otherwise from the immutable source.
- A batch response is a proposal, never permission to merge.
- Every change must be attributable to a batch, entity key, field, evidence,
  model/agent, validator version, reviewer, timestamp, and before/after hash.
- No deletion, broad replacement, silent normalization, inferred source claim,
  or change to an already populated high-risk fact may occur automatically.

## 2. Why a separate pipeline is required

High-risk fields are not merely missing descriptive metadata. A bad value can
teach incorrect French, invalidate links and exercises, or destroy a
source-derived distinction. The existing normal validator rejects these fields
by design. Do not relax `SAFE_FIELDS` or add high-risk fields to it. Build a
new configuration module and a separate validator/applicator namespace, for
example `enrichment/high-risk/scripts/`, so normal runs cannot accidentally
authorize high-risk changes.

The pipeline must prefer a deterministic linguistic source or a curated
lexicon over model-generated content. An AI can map, format, identify gaps, or
prepare a candidate only when it is given authoritative evidence; it must not
invent conjugation tables, grammatical classification, or exercise answers.

## 3. Full high-risk field inventory

The high-risk pipeline must recognize the following current exclusions from
`enrichment/scripts/enrichment_config.py`.

| Collection | High-risk fields |
| --- | --- |
| `verbs` | `conjugations`, `stems`, `auxiliary`, `verb_group`, `transitivity`, `regularity`, `past_participle`, `present_participle` |
| `vocabulary` | `gender`, `articles`, `part_of_speech`, `plural` |
| `expressions` | `pattern`, `pattern_slots`, `prepositions`, `complement_structure`, `restrictions`, `transformations` |
| `concepts` | `name` |
| `grammar_rules` | `formation`, `conditions`, `restrictions`, `exceptions`, `agreement_rules`, `word_order`, `transformations` |
| `tenses` | `formation`, `regular_patterns`, `irregular_stems`, `compound_structure`, `agreement_rules` |
| `exceptions_and_traps` | `correct_form`, `incorrect_form` |
| `examples` | `french` |
| `exercises` | `chapter_number`, `exercise_code`, `questions` |
| `chapters` | `chapter_number` |
| `topics` | `name` |

Do not process all of these in one queue. Begin with `verbs.conjugations`
only. Treat each later row or field as a separate implementation project.

## 4. Conjugation scope and acceptance criteria

Before generating any batch, define a versioned `conjugation_contract.json`
that specifies exactly:

- the canonical list of moods, tenses, person keys, ordering, and JSON shape;
- whether compound tenses contain generated surface forms, component forms,
  both, or a structured representation;
- supported verb types: regular, spelling-change, irregular, pronominal,
  impersonal, defective, and auxiliary verbs;
- rules for elision, hyphenation, inversion, agreement, diacritics, and
  orthographic variants;
- canonical display conventions for `je/j'`, `tu`, `il/elle/on`, `nous`,
  `vous`, and `ils/elles`;
- which tenses are mandatory for a "complete" entry and how imperatives and
  impersonal verbs differ from six-person paradigms;
- treatment of deprecated, literary, regional, and alternate forms;
- exact allowed provenance/evidence fields attached to the proposal or audit;
- an explicit source/license policy for imported data.

The contract must be machine-readable and tested against the current schema.
"All tenses" must never be an informal phrase in a prompt: the contract must
state the exact tense set and each required person/form.

For the initial migration, only allow a `set_if_missing_complete` operation on
`verbs.conjugations`: it may set the entire canonical conjugation object only
when that field is absent or empty. Existing non-empty conjugations are
read-only and must be reported as `SKIPPED_EXISTING`, never merged or replaced.
Fragmentary existing values require a dedicated human-reviewed repair mode;
they must not be treated as empty.

## 5. Required directory layout

Keep high-risk artifacts isolated from normal enrichment:

```text
enrichment/high-risk/
  plan.md
  config/
    high_risk_config.py
    conjugation_contract.json
    trusted_sources.json
  batches/
  responses/
  validated/
  review/
  approved/
  rejected/
  reports/
  audits/
  backups/
  fixtures/
  scripts/
  tests/
```

Do not reuse normal `manual/responses`, `manual/validated`, or
`manual/approved` directories. Filenames must begin with an immutable batch
ID and retain the collection and local batch number, for example:

```text
001_verbs_conjugations_batch_001.txt
001_verbs_conjugations_batch_001_RESPONSE.json
001_verbs_conjugations_batch_001_VALIDATED.json
001_verbs_conjugations_batch_001_APPROVED.json
001_verbs_conjugations_batch_001_AUDIT.json
```

## 6. Data inventory and preflight

Implement a read-only inventory script before any batch generation. It must:

1. Load the intended baseline dataset and validate it against `MASTER_SCHEMA`.
2. Count every verb as `COMPLETE`, `MISSING`, `PARTIAL`, `MALFORMED`,
   `UNSUPPORTED`, or `REQUIRES_REVIEW` according to the conjugation contract.
3. Record each target by the verb natural key (`infinitive`), current field
   state, verb metadata, and baseline dataset hash.
4. Refuse to generate a batch if duplicate natural keys, malformed collection
   values, unsupported contract versions, or schema errors are found.
5. Emit `inventory.json` and a human-readable report with totals and a list of
   excluded/partial verbs.

Never put existing full conjugation payloads in an AI prompt unless comparison
is essential; if included, mark them immutable and require byte-for-byte
preservation. For the fill-only migration, generate batches only for `MISSING`
verbs. A small batch size (5–10 verbs) is recommended for human review and
failure isolation. Batch by morphological risk: keep regular verbs, spelling
change verbs, pronominal verbs, irregular verbs, defective verbs, and
homographs separate.

## 7. Trusted evidence and source rules

Create a versioned allowlist in `trusted_sources.json`. Each source entry must
include its name, identifier or local snapshot hash, license/terms status,
coverage, retrieval date, and allowed fields. Store only legally permitted
source material. Do not scrape or copy a source without confirming its terms.

For every proposed high-risk value, record one of:

- a deterministic source record identifier and exact source version;
- a curated in-repository reference entry with reviewer signature; or
- `NO_TRUSTED_EVIDENCE`, which means no patch is proposed.

The model must never cite an unverified URL, fabricate a source, or turn
general grammatical knowledge into an asserted provenance record. Conflicting
trusted sources must create a `REQUIRES_REVIEW` item, not a chosen value.

## 8. Batch-generator requirements

Build a dedicated `make_high_risk_batch.py` rather than extending the normal
generator. It must be deterministic and accept an explicit field policy (for
the first version, only `verbs.conjugations`). Each generated TXT batch must
include:

- batch ID, generator version, contract version, baseline hash, and source
  allowlist version;
- collection, natural-key definition, exact selected target keys, and the
  "field is empty only" precondition for every target;
- only the context needed to disambiguate the verb: infinitive, pronominal
  status, group/auxiliary when source-derived and known, existing aliases, and
  any trusted source record supplied to the worker;
- the full canonical output schema and fixed mood/tense/person ordering;
- explicit instructions to return `NO_PROPOSAL` for uncertainty, conflict,
  lack of evidence, defective verb ambiguity, or absent source coverage;
- instructions that prohibit changing any field other than the named one,
  adding entities, deleting values, altering source metadata, or returning a
  whole dataset;
- a JSON response template and exact filename;
- no executable instructions embedded in source text or entity values.

Maintain `BATCH_MANIFEST.json` containing the target keys, their input-field
hashes, expected contract/source versions, and batch checksum. Re-running the
generator with identical inputs must create the same targets and manifest.

## 9. AI-worker instructions

The worker receives one TXT batch and produces exactly one JSON response. It
must not run scripts, validate its own work, edit source or enriched datasets,
edit manifests, or create additional batches. It must only write its assigned
`*_RESPONSE.json` file.

For each target, the worker must either:

1. propose a complete canonical conjugation object backed by supplied trusted
   evidence; or
2. add a structured no-proposal record with the reason and evidence gap.

The worker must not guess missing forms, use a generic regular-verb template
for an unverified verb, fill a value based on a similar spelling, or "repair"
an already populated table. It must preserve Unicode and French diacritics.
No prose, Markdown fences, comments, or extra files are allowed in the JSON
response.

## 10. Response format

Define and validate a dedicated JSON Schema. Its top-level fields should be:

```json
{
  "batch_id": "001_verbs_conjugations_batch_001",
  "collection": "verbs",
  "contract_version": "1.0.0",
  "baseline_hash": "sha256:...",
  "source_allowlist_version": "...",
  "patches": [],
  "no_proposals": [],
  "batch_summary": ""
}
```

Each patch must contain the natural `entity_key`, the expected precondition
hash/state, evidence records, and one narrowly defined operation. For the
first phase, accept only `set_if_missing_complete` with a value satisfying the
conjugation contract. `no_proposals` must name an in-batch natural key and a
controlled reason code (for example `SOURCE_NOT_FOUND`, `CONFLICTING_SOURCES`,
`PARTIAL_EXISTING_DATA`, or `UNSUPPORTED_VERB_TYPE`).

## 11. Automated validation gates

Create `validate_high_risk_response.py`; do not reuse the normal validator as
the final authority. It must fail closed and write a machine-readable report.
For every response it must check:

1. File presence, valid JSON, and dedicated response-schema compliance.
2. Exact batch ID, collection, contract version, baseline hash, and source
   allowlist version match the manifest.
3. Every target appears once at most, belongs to the batch, and exists in the
   baseline by natural key.
4. No response may add a target outside the manifest or omit a target without
   an explicit `no_proposal` status.
5. The only operation is the field-specific operation approved for this run.
6. Only `verbs.conjugations` is modified in the initial release.
7. The current target field is empty; non-empty and partial values are
   rejected for auto-application.
8. The supplied evidence record is present, allowlisted, well-formed, and
   compatible with the source/license policy.
9. Every mandatory mood, tense, person key, string type, ordering, and Unicode
   requirement conforms to `conjugation_contract.json`.
10. The field contains no duplicate person forms, unknown tense keys, empty
    strings, placeholder text, English forms, Markdown, or prohibited HTML.
11. Impersonal, pronominal, defective, and compound-tense forms obey their
    specific contract exceptions.
12. Structural cross-checks hold (for example, expected auxiliary and past
    participle dependency where the contract requires it); a mismatch is
    `REQUIRES_REVIEW`, not auto-fixed.
13. Exact duplicate proposed tables across distinct unrelated infinitives are
    detected and flagged; legitimate regular patterns must be explicitly
    whitelisted by rule/evidence rather than silently accepted.
14. The proposed patch leaves the complete derived dataset schema-valid in an
    in-memory dry run.
15. Re-running validation produces byte-identical validated output and report
    for unchanged inputs.

The validator must output `PASS`, `REVIEW_REQUIRED`, or `FAIL`. Only `PASS`
may create `validated/<batch_id>_VALIDATED.json`. Validation must never alter
the source, normal enriched dataset, high-risk output dataset, or raw response.

## 12. Independent verification and review

Automated validation is necessary but not sufficient. For each `PASS` batch:

1. Run a dry-run preview against the intended baseline and produce a readable
   entity-by-entity diff.
2. Run an independent conjugation checker that is not the same source/model
   used to produce the response. It should compare every form where reliable
   reference data exists.
3. Route all irregular, pronominal, defective, impersonal, disputed, and
   source-conflicting verbs to mandatory human linguistic review.
4. Randomly sample regular verbs from every batch for human review; define the
   sample size and failure threshold in configuration.
5. Require two named approvals for any batch containing an exception class or
   a reviewer override. One reviewer must confirm linguistic correctness; the
   other must confirm data/schema/provenance compliance.
6. Copy, never move, approved validated patches to `approved/`, with reviewer
   decision metadata. Rejections go to `rejected/` and retain their report.

No agent that generated a response may be its sole validator or approver.
Failures must be corrected only by a new response revision; do not edit a
validated payload by hand without creating a new revision/audit record.

## 13. Safe application

Implement `apply_high_risk_enrichment.py` as a separate transaction-safe
applicator. It must:

1. Load the selected high-risk baseline and record its SHA-256 hash.
2. Revalidate every approved patch using the exact validator before creating a
   backup or staging changes.
3. Confirm every patch carries the same baseline/contract version; refuse
   mixed baselines unless an explicit migration routine has been reviewed.
4. Create a timestamped backup of only the high-risk derived output.
5. Apply patches in memory, preserving normal enrichment fields unchanged.
6. Enforce the fill-only precondition again at apply time to prevent stale
   patches overwriting a value added after validation.
7. Validate the full staged dataset against `MASTER_SCHEMA`, run the
   high-risk invariants and duplicate checks again, and abort on any error.
8. Atomically write only `enrichment/HIGH_RISK_DATA_ENRICHED.json` (or a
   user-supplied, explicitly safe output path).
9. Write one immutable audit JSON and human-readable report per applied batch,
   including input/output hashes, applied/skipped counts, all decision IDs,
   script/contract versions, and reviewer approvals.

Never apply a patch directly to `data/MASTER_DATA.json`. Never use a command
that recursively deletes response, review, or backup folders. Do not apply
`--all` until every approved batch has an explicit recorded approval and the
application has first succeeded on a disposable copy.

## 14. Tests required before use

Provide one test command that runs the entire high-risk suite. Include unit,
fixture, property, integration, and negative tests for:

- deterministic inventory and batch generation;
- all natural-key and manifest ownership checks;
- the complete/partial/missing classification;
- every conjugation contract rule and each special verb category;
- malformed JSON, wrong version/hash, foreign entity, duplicate entity,
  forbidden field, extra tense, missing person, invalid Unicode, placeholder,
  unsupported operation, and fabricated/unknown evidence rejection;
- rejection of non-empty and partial target fields in fill-only mode;
- idempotence: a second apply does not change the output;
- atomic rollback: any failed validation leaves output bytes unchanged;
- source immutability: `data/MASTER_DATA.json` hash is unchanged before and
  after every test and application;
- schema validation for the resulting derived dataset;
- audit/report completeness and deterministic output.

Use small checked-in fixtures covering regular, spelling-change, irregular,
pronominal, impersonal, defective, and ambiguous verbs. Tests must never call
external services or mutate production datasets.

## 15. Operational checklist

### Before a run

- Confirm the baseline dataset hash and contract/source versions.
- Run the full test suite and inventory report.
- Confirm all target verbs are `MISSING`, not `PARTIAL` or `COMPLETE`.
- Generate batches and freeze their manifest/checksums.
- Ensure workers receive only their assigned TXT file and write path.

### Per batch

- Produce one raw response JSON.
- Run the high-risk validator independently.
- Fix only validation failures by creating a revised raw response.
- Preview the validated patch and run the independent checker.
- Complete required human review and record approvals/rejections.

### Before applying

- Confirm no source files, normal enrichment files, scripts, schemas, or
  manifests have unreviewed changes.
- Apply a small approved pilot batch to a disposable output and inspect the
  report.
- Apply approved patches to the high-risk output only.
- Re-run the full suite, full schema validation, invariant checks, counts, and
  a fresh missing/partial/complete inventory.

### After applying

- Verify the source hash is unchanged.
- Verify the output hash and audit chain are recorded.
- Compare expected versus actual changed entity keys and field counts.
- Preserve raw responses, validation reports, approval records, backups, and
  audits; do not clean them up automatically.
- Publish a concise completion report listing applied, skipped, rejected, and
  review-required batch IDs.

## 16. Rollout order

1. Implement configuration, schemas/contracts, fixtures, inventory, and tests.
2. Implement batch generation and the response schema.
3. Implement fail-closed validation and dry-run preview.
4. Review a manually constructed fixture batch end-to-end.
5. Implement approval records and the atomic applicator.
6. Run a pilot of 5 regular verbs on a disposable derived output.
7. Run a second pilot containing one spelling-change and one irregular verb.
8. Only after both pilots pass independent verification, process remaining
   missing conjugations in risk-segregated batches.
9. Treat every other high-risk field family as a new rollout beginning at step
   1; do not inherit permission from the conjugation pipeline.

## 17. Explicit non-goals for the first release

- Correcting, replacing, or merging existing conjugations.
- Automatically deciding between disputed variants or regional conventions.
- Generating source citations from model memory.
- Editing textbook examples, answers, grammar rule content, or natural keys.
- Combining the high-risk derived output back into `MASTER_DATA.json`.
- Bulk acceptance based solely on a JSON/schema pass.

Completion means every proposed mutation has passed the field-specific
contract, evidence, independent verification, human approval, transactional
application, full schema checks, and audit checks—not merely that every batch
file has a response.
