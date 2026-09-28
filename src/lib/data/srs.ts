"use client";

/**
 * Spaced-repetition flashcards (suggestion: SRS review mode, 2026-09-26).
 * Minimal SM-2-style scheduler persisted in LocalStorage:
 * - new cards start at interval 0 (due immediately);
 * - "Got it" advances 0 → 1 → 3 → 7 → 14 → 30 → 60 days (capped);
 * - "Again" resets to 0 and counts a lapse.
 * Storage uses a versioned envelope with per-record validation so a corrupted
 * or future-shaped payload degrades to "everything is due" instead of silently
 * stranding cards. The store is exposed through useSyncExternalStore-compatible
 * subscribe/snapshot functions so components never read LocalStorage in render.
 */

export interface SrsCard {
  key: string;
  front: string;
  back: string;
  hint?: string;
}

export interface SrsRecord {
  intervalDays: number;
  due: number;
  lapses: number;
}

export interface SrsEnvelope {
  version: number;
  records: Record<string, SrsRecord>;
}

export interface SrsStoreSnapshot {
  version: number;
  records: Record<string, SrsRecord>;
}

export const SRS_SCHEMA_VERSION = 2;

const STORAGE_KEY = "letude_srs";
const INTERVAL_STEPS = [0, 1, 3, 7, 14, 30, 60];
const DAY_MS = 24 * 60 * 60 * 1000;

const SERVER_SNAPSHOT: SrsStoreSnapshot = { version: 0, records: {} };

function isSrsRecord(value: unknown): value is SrsRecord {
  if (!value || typeof value !== "object") return false;
  const rec = value as Record<string, unknown>;
  return (
    Number.isFinite(rec.intervalDays) &&
    Number.isFinite(rec.due) &&
    Number.isFinite(rec.lapses) &&
    (rec.intervalDays as number) >= 0 &&
    (rec.lapses as number) >= 0
  );
}

export function sanitizeRecords(input: unknown): Record<string, SrsRecord> {
  const out: Record<string, SrsRecord> = {};
  if (!input || typeof input !== "object" || Array.isArray(input)) return out;
  for (const [key, value] of Object.entries(input as Record<string, unknown>)) {
    if (isSrsRecord(value)) out[key] = value;
  }
  return out;
}

export function parseSrsState(raw: string | null): SrsEnvelope {
  if (!raw) return { version: SRS_SCHEMA_VERSION, records: {} };
  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch {
    return { version: SRS_SCHEMA_VERSION, records: {} };
  }
  if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
    return { version: SRS_SCHEMA_VERSION, records: {} };
  }
  const envelope = parsed as Partial<SrsEnvelope>;
  if (typeof envelope.version === "number" && envelope.records) {
    return { version: envelope.version, records: sanitizeRecords(envelope.records) };
  }
  // Version 1 wrote the bare record map with no envelope.
  return { version: 1, records: sanitizeRecords(parsed) };
}

let cachedSnapshot: SrsStoreSnapshot = SERVER_SNAPSHOT;
let cacheStamp = "";
const listeners = new Set<() => void>();

function readStorage(): SrsStoreSnapshot {
  if (typeof window === "undefined") return SERVER_SNAPSHOT;
  let stamp = "";
  try {
    stamp = localStorage.getItem(STORAGE_KEY) || "";
  } catch {
    return SERVER_SNAPSHOT;
  }
  if (stamp === cacheStamp) return cachedSnapshot;
  const envelope = parseSrsState(stamp || null);
  const next: SrsStoreSnapshot = {
    version: envelope.version,
    records: envelope.records,
  };
  cachedSnapshot = next;
  cacheStamp = stamp;
  return next;
}

function writeStorage(records: Record<string, SrsRecord>): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ version: SRS_SCHEMA_VERSION, records }));
  } catch {
    // ignore quota errors
  }
  cacheStamp = "";
  readStorage();
}

export function subscribeSrsStore(listener: () => void): () => void {
  listeners.add(listener);
  const onStorage = (event: StorageEvent) => {
    if (event.key && event.key !== STORAGE_KEY) return;
    cacheStamp = "";
    listener();
  };
  if (typeof window !== "undefined") window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(listener);
    if (typeof window !== "undefined") window.removeEventListener("storage", onStorage);
  };
}

export function getSrsStoreSnapshot(): SrsStoreSnapshot {
  return readStorage();
}

export function getSrsServerSnapshot(): SrsStoreSnapshot {
  return SERVER_SNAPSHOT;
}

export function nextInterval(currentDays: number, remembered: boolean): number {
  if (!remembered) return 0;
  const idx = INTERVAL_STEPS.indexOf(currentDays);
  if (idx === -1) return INTERVAL_STEPS[1];
  return INTERVAL_STEPS[Math.min(idx + 1, INTERVAL_STEPS.length - 1)];
}

export function gradeCard(key: string, remembered: boolean, now = Date.now()): SrsRecord {
  const records = { ...getSrsStoreSnapshot().records };
  const prev = records[key] || { intervalDays: 0, due: 0, lapses: 0 };
  const intervalDays = nextInterval(prev.intervalDays, remembered);
  const next: SrsRecord = {
    intervalDays,
    due: now + intervalDays * DAY_MS,
    lapses: remembered ? prev.lapses : prev.lapses + 1,
  };
  records[key] = next;
  writeStorage(records);
  for (const listener of listeners) listener();
  return next;
}

function isUsableRecord(rec: SrsRecord | undefined): rec is SrsRecord {
  return isSrsRecord(rec);
}

export function selectDueCards(
  cards: SrsCard[],
  records: Record<string, SrsRecord>,
  now: number
): SrsCard[] {
  return cards.filter((card) => {
    const rec = records[card.key];
    if (!isUsableRecord(rec)) return true;
    return rec.due <= now;
  });
}

export function selectSrsStats(
  cards: SrsCard[],
  records: Record<string, SrsRecord>,
  now: number
): { total: number; due: number; learned: number } {
  let due = 0;
  let learned = 0;
  for (const card of cards) {
    const rec = records[card.key];
    if (!isUsableRecord(rec) || rec.due <= now) {
      due += 1;
    } else if (rec.intervalDays > 0) {
      learned += 1;
    }
  }
  return { total: cards.length, due, learned };
}

export function getDueCards(cards: SrsCard[], now = Date.now()): SrsCard[] {
  return selectDueCards(cards, getSrsStoreSnapshot().records, now);
}

export function getSrsStats(cards: SrsCard[], now = Date.now()): { total: number; due: number; learned: number } {
  return selectSrsStats(cards, getSrsStoreSnapshot().records, now);
}
