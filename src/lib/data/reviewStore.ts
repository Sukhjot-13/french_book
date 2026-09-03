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
