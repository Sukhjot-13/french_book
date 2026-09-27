"use client";

/**
 * Spaced-repetition flashcards (suggestion: SRS review mode, 2026-09-26).
 * Minimal SM-2-style scheduler persisted in LocalStorage:
 * - new cards start at interval 0 (due immediately);
 * - "Got it" advances 0 → 1 → 3 → 7 → 14 → 30 → 60 days (capped);
 * - "Again" resets to 0 and counts a lapse.
 * Pure scheduling helpers are exported for tests; storage access is guarded.
 */

export interface SrsCard {
  key: string;
  front: string;
  back: string;
  hint?: string;
}

interface SrsRecord {
  intervalDays: number;
  due: number;
  lapses: number;
}

const STORAGE_KEY = "letude_srs";
const INTERVAL_STEPS = [0, 1, 3, 7, 14, 30, 60];
const DAY_MS = 24 * 60 * 60 * 1000;

function safeRead(): Record<string, SrsRecord> {
  if (typeof window === "undefined") return {};
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : {};
    return parsed && typeof parsed === "object" ? parsed : {};
  } catch {
    return {};
  }
}

function safeWrite(records: Record<string, SrsRecord>): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
  } catch {
    // ignore quota errors
  }
}

export function nextInterval(currentDays: number, remembered: boolean): number {
  if (!remembered) return 0;
  const idx = INTERVAL_STEPS.indexOf(currentDays);
  if (idx === -1) return INTERVAL_STEPS[1];
  return INTERVAL_STEPS[Math.min(idx + 1, INTERVAL_STEPS.length - 1)];
}

export function gradeCard(key: string, remembered: boolean, now = Date.now()): SrsRecord {
  const records = safeRead();
  const prev = records[key] || { intervalDays: 0, due: 0, lapses: 0 };
  const intervalDays = nextInterval(prev.intervalDays, remembered);
  const next: SrsRecord = {
    intervalDays,
    due: now + intervalDays * DAY_MS,
    lapses: remembered ? prev.lapses : prev.lapses + 1,
  };
  records[key] = next;
  safeWrite(records);
  return next;
}

export function getDueCards(cards: SrsCard[], now = Date.now()): SrsCard[] {
  const records = safeRead();
  return cards.filter((card) => {
    const rec = records[card.key];
    return !rec || rec.due <= now;
  });
}

export function getSrsStats(cards: SrsCard[], now = Date.now()): { total: number; due: number; learned: number } {
  const records = safeRead();
  let due = 0;
  let learned = 0;
  for (const card of cards) {
    const rec = records[card.key];
    if (!rec || rec.due <= now) {
      due += 1;
    } else if (rec.intervalDays > 0) {
      learned += 1;
    }
  }
  return { total: cards.length, due, learned };
}
