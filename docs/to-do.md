# Enrichment Restart Handoff

## Current state — 2026-09-10

The old enrichment queues, responses, derived datasets, validators, and audit
artifacts were intentionally removed during the reset. The immutable inputs
are now only `data/MASTER_DATA.json` and `data/MASTER_SCHEMA.json`.

Start a future enrichment run from:

1. `enrichment/ENRICHMENT_GAP_REPORT.md` for the current data backlog.
2. `enrichment/ENRICHMENT_INSTRUCTIONS.md` for the required safe workflow.

No enrichment is currently queued, validated, approved, or applied. Any future
run must create a new manifest, batches, response lifecycle folders, validation
tooling, and a separately named derived dataset without modifying either
immutable input.
