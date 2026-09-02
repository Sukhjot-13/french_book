# Terra Targeted Authoritative Audit

## Executive Verdict

TERRA_TARGETED_REPAIR_REQUIRED.

## Independent Audit Method

Direct source occurrences are compared with persisted-master fields and explicit rejection records; the merge is never imported.

## Provenance Independence

VALID; source occurrences: 37658; unaccounted: 6795.

## Rejected Pointer Classification

UNRESOLVED: 46.

## Tense Canonicalization

RAW_TENSE_COUNT: 27; CANONICAL_TENSE_COUNT: 27; ALIAS_DUPLICATE_COUNT: 0.

## Artifact Synchronization

ARTIFACT_DRIFT.

## Input Isolation

PASS: {"bookdata_json":true,"data_extracted":false,"data_normalized":false,"deprecated_final_master":false}.

## Answer Reconciliation

PASS: 197 exercises, 1868 questions, 1872 answers, 4 structural extra slots, 0 unmatched questions, 0 unmatched answers.

## Reusable Audit Script

`tsx scripts/audit-authoritative-master.ts` writes these artifacts and exits nonzero on blockers.

## Promotion Blockers

- Disposition or represent 6795 source evidence occurrences.
- Resolve or preserve listed rejected pointers; unknown pointers are not safe rejections.
- Regenerate stale reconciliation report content.

## Non-Blocking Observations

JSON retains deterministic classifications and suspicious IDs without listing thousands of normal records.

## Final Decision

TERRA_TARGETED_REPAIR_REQUIRED
