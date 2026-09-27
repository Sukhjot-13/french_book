# Repair Policy v2.2 — canonical replacement with hash-bound audit (2026-09-26)

Implements the 2026-09-09 suggestion: the frozen v2.1 partial-conjugation
repair policy was internally incompatible for malformed source records (it
required those records to remain unchanged while also requiring the proposed
list to be entirely canonical and complete).

## Rule

A malformed record MAY be canonically replaced when ALL of the following hold:

1. The replacement validates against the master schema for its collection.
2. The replacement carries an `audit` block built by
   `buildRepairAudit()` (`src/lib/dataset/repair-audit.ts`):
   - `original_sha256` — sha256 over the canonical JSON of the ORIGINAL
     record (excluding any prior `audit` block, so re-repairs chain).
   - `original_evidence` — every original `sources` (fallback:
     `attestations`) object copied VERBATIM. None dropped, edited, reordered.
   - `repaired_at` + `policy: "repair-v2.2"`.
3. `verifyRepairAudit(original, repaired)` passes. It is order-sensitive on
   purpose: evidence reordering counts as tampering.
4. Partial verbs: `conjugations` on the replacement must be complete for the
   tenses the source record claims (same gate as v2.1), but the record itself
   is replaced rather than preserved-malformed.

## Non-goals

- No learner-facing promotion: repaired records stay staged until the
  existing field-specific validation + dual-review approval pass.
- No migration runner ships here — this policy + validator are the gate any
  future applier must satisfy first. Independent linguistic + compliance
  review still required before any application.
