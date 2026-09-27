/**
 * v2.2 repair audit mapping (suggestion 2026-09-09 — implemented 2026-09-26).
 *
 * Frozen v2.1 policy was internally incompatible for malformed source records:
 * it required them to remain unchanged AND the proposed list to be entirely
 * canonical. v2.2 resolves this by canonically REPLACING records while
 * preserving every original source-evidence object through a deterministic,
 * hash-bound audit mapping:
 *
 * - `audit.original_sha256`: sha256 over the canonical (key-sorted) JSON of
 *   the ORIGINAL record (excluding any prior `audit` block, so re-repairs
 *   chain instead of nesting).
 * - `audit.original_evidence`: the original record's evidence objects copied
 *   VERBATIM (deep-equal) — nothing may be dropped, edited, or reordered.
 * - `audit.repaired_at` / `audit.policy`: provenance of the repair itself.
 *
 * verifyRepairAudit(original, repaired) enforces all three. Pure, no I/O.
 */
import { createHash } from "crypto";

export interface RepairAudit {
  original_sha256: string;
  original_evidence: unknown[];
  repaired_at: string;
  policy: string;
}

export const REPAIR_POLICY_ID = "repair-v2.2";

/** Deterministic JSON: object keys sorted recursively, no whitespace. */
export function stableStringify(value: unknown): string {
  if (Array.isArray(value)) {
    return `[${value.map(stableStringify).join(",")}]`;
  }
  if (value !== null && typeof value === "object") {
    const entries = Object.entries(value as Record<string, unknown>)
      .filter(([, v]) => v !== undefined)
      .sort(([a], [b]) => (a < b ? -1 : a > b ? 1 : 0));
    return `{${entries.map(([k, v]) => `${JSON.stringify(k)}:${stableStringify(v)}`).join(",")}}`;
  }
  return JSON.stringify(value) ?? "null";
}

export function sha256Hex(text: string): string {
  return createHash("sha256").update(text, "utf8").digest("hex");
}

/** Evidence objects live under `sources` (with `attestations` as fallback). */
export function readEvidence(record: Record<string, unknown>): unknown[] {
  const sources = record["sources"];
  if (Array.isArray(sources)) return sources;
  const attestations = record["attestations"];
  if (Array.isArray(attestations)) return attestations;
  return [];
}

/** The auditable original: everything except a prior `audit` block. */
export function auditableOriginal(record: Record<string, unknown>): Record<string, unknown> {
  const rest = { ...record };
  delete rest.audit;
  return rest;
}

export interface RepairAuditResult {
  ok: boolean;
  errors: string[];
  originalSha256: string;
}

/**
 * Verify a v2.2 repair: hash binding matches, every original evidence object
 * is preserved verbatim (order-sensitive), audit provenance is stamped.
 */
export function verifyRepairAudit(
  original: Record<string, unknown>,
  repaired: Record<string, unknown>
): RepairAuditResult {
  const errors: string[] = [];
  const auditable = auditableOriginal(original);
  const originalSha256 = sha256Hex(stableStringify(auditable));

  const audit = (repaired as Record<string, unknown>)["audit"] as RepairAudit | undefined;
  if (!audit || typeof audit !== "object") {
    return { ok: false, errors: ["repaired record carries no audit block"], originalSha256 };
  }
  if (audit.policy !== REPAIR_POLICY_ID) {
    errors.push(`audit.policy must be ${REPAIR_POLICY_ID}`);
  }
  if (typeof audit.repaired_at !== "string" || audit.repaired_at.trim() === "") {
    errors.push("audit.repaired_at must be a non-empty timestamp");
  }
  if (audit.original_sha256 !== originalSha256) {
    errors.push("audit.original_sha256 does not match the original record");
  }
  const originalEvidence = readEvidence(auditable);
  const keptEvidence = Array.isArray(audit.original_evidence) ? audit.original_evidence : null;
  if (keptEvidence === null) {
    errors.push("audit.original_evidence must be an array");
  } else if (stableStringify(keptEvidence) !== stableStringify(originalEvidence)) {
    errors.push(
      `audit.original_evidence must preserve all ${originalEvidence.length} original evidence object(s) verbatim`
    );
  }
  return { ok: errors.length === 0, errors, originalSha256 };
}

/** Build a compliant audit block for a repair about to be written. */
export function buildRepairAudit(
  original: Record<string, unknown>,
  repairedAt = new Date().toISOString()
): RepairAudit {
  const auditable = auditableOriginal(original);
  return {
    original_sha256: sha256Hex(stableStringify(auditable)),
    original_evidence: readEvidence(auditable),
    repaired_at: repairedAt,
    policy: REPAIR_POLICY_ID,
  };
}
