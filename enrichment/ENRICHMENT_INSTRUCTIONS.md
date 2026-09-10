# Enrichment Operating Instructions

## Purpose and immutable inputs

Use enrichment to propose additions to the learning dataset without changing
the authoritative source. Never edit `data/MASTER_DATA.json` or
`data/MASTER_SCHEMA.json`. Begin every run by recording SHA-256 hashes for both
files and validating the source dataset against the schema.

Write every result to a separately named derived file under `enrichment/`, for
example `enrichment/DATA_ENRICHED.json`. Never overwrite the master dataset.

## Queue and batch creation

Create a frozen manifest before asking an AI for content. Each batch file must
contain:

- an immutable batch ID, source hash, target collection/field, and exact target
  natural keys;
- the resolved field schema and required JSON response envelope;
- only the context needed for the requested field;
- field preconditions and explicit no-change boundaries;
- accepted operation(s), evidence/provenance requirements, and an exact
  response filename and destination;
- instructions to return a structured `NO_PROPOSAL` for genuine uncertainty.

Keep batches small enough to review, group similar linguistic risk together,
and never allow an AI to edit batch files, manifests, schemas, or datasets.

## Responses and validation

Workers write one JSON response per assigned batch in the designated response
folder. A validator must fail closed and check JSON shape, manifest ownership,
baseline hash, schema conformance, target completeness, allowed fields,
preconditions, placeholders, duplicates, and full-dataset schema safety in an
in-memory dry run.

Keep raw responses, validation reports, validated candidates, rejection
records, approvals, backups, and application audits in separate lifecycle
folders. A response is a proposal, not permission to merge.

## Extra controls for linguistically high-risk fields

For conjugations, grammatical classifications, source-derived examples,
exercise answers, and other learner-facing linguistic facts, also require:

- a versioned field contract that names every accepted tense/form or value;
- trusted evidence or an explicit `AI_GENERATED_UNVERIFIED` marker;
- preservation of existing source evidence when completing partial data;
- independent linguistic review plus a distinct compliance/provenance review;
- named approval records before application.

Never invent evidence. A missing or conflicting source must remain an explicit
review item rather than being silently filled.

## Application and verification

Apply only approved, integrity-bound candidates. Recheck every precondition at
application time, stage changes in memory, validate the full derived dataset
against `MASTER_SCHEMA.json`, then atomically write the derived output. Record
before/after hashes, changed keys, reviewer decisions, and tool versions.

Finally run the full test suite, schema validation, inventory/completeness
checks, idempotence verification, `git diff --check`, and confirm the master
source and schema hashes are unchanged.
