# High-Risk Enrichment Handoff

## Do Not Merge Yet

`data/MASTER_DATA.json` is immutable. Do not write high-risk results to it or
to `enrichment/MASTER_DATA_ENRICHED.json`. The only eventual application target
is `enrichment/HIGH_RISK_DATA_ENRICHED.json`, after every gate below passes.

## Current State — 2026-09-09

- Frozen v2.1 validation: 723 passing batches, 30 failed partial-conjugation
  repair batches, and 254 `NO_PROPOSAL` gaps.
- Isolated v2.2 correction queue: 25 staged response files covering the 30
  failed repair batches (147 targets) and all 254 former `NO_PROPOSAL` targets.
- v2.2 staging validation: 25/25 responses pass, with a combined in-memory
  `MASTER_SCHEMA` dry run free of errors; no source or normal-enriched dataset
  has been modified.
- The narrow, evidence-documented `pouvoir` null-imperative exception is now
  recorded in `config/correction_conjugation_policy_v2_2.json`. It is a
  staging-policy exception, not approval to apply the candidate.

## Required Before Application

1. Independently review and version a v2.2 repair policy that permits canonical
   replacement of malformed partial conjugation records while deterministically
   retaining their exact baseline source-evidence objects in an audit mapping.
2. Obtain independent linguistic and compliance review of the v2.2 policy
   exception and all staged candidates.
3. Implement and test the v2.2 source-evidence rebinding, approval, and
   transaction-safe applicator path. It must combine the 723 v2.1 passing
   candidates with the 25 v2.2 correction batches without mutating either
   baseline dataset.
4. Obtain distinct named linguistic and
   compliance approvals, apply only to `enrichment/HIGH_RISK_DATA_ENRICHED.json`,
   and rerun the complete inventory, test suite, hashes, and idempotence check.

## Protected Baseline Hash

Both protected baseline files currently have SHA-256:

`1d33ba23575eed2dedd763309c05536bae54c647c0b0cb9ad6a536bfb19f8892`
