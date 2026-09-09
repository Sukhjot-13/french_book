# High-Risk Correction Queue 2.2.0-draft

This queue contains only the 30 v2.1 failed conjugation-repair source batches
and the 254 strict-gate `NO_PROPOSAL` targets. It does not modify or supersede
the frozen v2.1 queue.

## Locations

- Prompts: `enrichment/high-risk/batches/corrections-v2.2/`
- Correction manifest: `enrichment/high-risk/batches/corrections-v2.2/CORRECTION_MANIFEST.json`
- Raw worker responses: `enrichment/high-risk/responses/corrections-v2.2/`
- Future v2.2 reports: `enrichment/high-risk/reports/corrections-v2.2/`
- Future v2.2 validated candidates: `enrichment/high-risk/validated/corrections-v2.2/`
- Future v2.2 approvals: `enrichment/high-risk/approved/corrections-v2.2/`

## Coordinator / subagent handoff prompt

> Assign one subagent one `*.txt` prompt at a time from
> `enrichment/high-risk/batches/corrections-v2.2/`. The subagent must read the
> entire prompt, produce exactly one JSON response matching its envelope, and
> save it only to the exact path stated in that prompt under
> `enrichment/high-risk/responses/corrections-v2.2/`. It must never modify `data/MASTER_DATA.json`,
> `enrichment/MASTER_DATA_ENRICHED.json`, frozen v2.1 batches or manifest, or
> files outside its assigned response. Return every target as a proposal and
> keep `no_proposals` empty. The coordinator checks that each expected response
> exists and preserves the prompt's source-batch traceability.

## Important repair limitation

The repair prompts are deliberately marked `CANONICAL_REPAIR_DRAFT`. The v2.1
validator requires malformed partial records to be both unchanged and
canonical, which is impossible. Do not copy these staged responses into the
ordinary v2.1 response folder. A separately reviewed v2.2 repair-policy,
validator, and application path must exist before they can be validated or
applied.

## Queue contents

- Correction batches: 25
- Source failed repair batches: 30
- Retried NO_PROPOSAL targets: 254
