"use client";

/**
 * Lightweight client-side store for saving items to review and marking items reviewed.
 * Persisted in browser localStorage with custom event dispatching for reactive UI updates.
 */

export interface SavedItemRecord {
  id: string;
  type: "verb" | "vocab" | "grammar" | "expression";
  savedAt: number;
}

const STORAGE_KEY_SAVED = "letude_saved_items";
const STORAGE_KEY_REVIEWED = "letude_reviewed_items";
const EVENT_NAME = "letude-review-state-changed";

function safeGetStorage(key: string): Record<string, boolean> {
  if (typeof window === "undefined") return {};
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function safeSetStorage(key: string, data: Record<string, boolean>): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(key, JSON.stringify(data));
    window.dispatchEvent(new CustomEvent(EVENT_NAME));
  } catch {
    // ignore storage quota errors
  }
}

export interface ReviewStateSnapshot {
  saved: Set<string>;
  reviewed: Set<string>;
}

/**
 * Reads both key maps in one pass. Components that need the state for many rows
 * call this once per mount instead of once per row per render, and prune keys
 * that are no longer plain booleans so the maps cannot grow without bound.
 */
export function getReviewStateSnapshot(): ReviewStateSnapshot {
  return {
    saved: sanitizeStore(safeGetStorage(STORAGE_KEY_SAVED), STORAGE_KEY_SAVED),
    reviewed: sanitizeStore(safeGetStorage(STORAGE_KEY_REVIEWED), STORAGE_KEY_REVIEWED),
  };
}

function sanitizeStore(store: Record<string, boolean>, storageKey: string): Set<string> {
  const keys = new Set<string>();
  let dirty = false;
  const cleaned: Record<string, boolean> = {};
  for (const [key, value] of Object.entries(store)) {
    if (value === true) {
      keys.add(key);
      cleaned[key] = true;
    } else {
      dirty = true;
    }
  }
  if (dirty) {
    try {
      localStorage.setItem(storageKey, JSON.stringify(cleaned));
    } catch {
      // ignore quota errors
    }
  }
  return keys;
}

export function isItemSaved(type: string, id: string): boolean {
  const store = safeGetStorage(STORAGE_KEY_SAVED);
  return Boolean(store[`${type}:${id}`]);
}

export function toggleItemSaved(type: string, id: string): boolean {
  const store = safeGetStorage(STORAGE_KEY_SAVED);
  const key = `${type}:${id}`;
  const next = !store[key];
  if (next) {
    store[key] = true;
  } else {
    delete store[key];
  }
  safeSetStorage(STORAGE_KEY_SAVED, store);
  return next;
}

export function isItemReviewed(type: string, id: string): boolean {
  const store = safeGetStorage(STORAGE_KEY_REVIEWED);
  return Boolean(store[`${type}:${id}`]);
}

export function toggleItemReviewed(type: string, id: string): boolean {
  const store = safeGetStorage(STORAGE_KEY_REVIEWED);
  const key = `${type}:${id}`;
  const next = !store[key];
  if (next) {
    store[key] = true;
  } else {
    delete store[key];
  }
  safeSetStorage(STORAGE_KEY_REVIEWED, store);
  return next;
}

export function subscribeReviewState(callback: () => void): () => void {
  if (typeof window === "undefined") return () => {};
  window.addEventListener(EVENT_NAME, callback);
  return () => window.removeEventListener(EVENT_NAME, callback);
}
