"use client";

import React, { useMemo, useState, useSyncExternalStore } from "react";
import Link from "next/link";
import {
  selectDueCards,
  selectSrsStats,
  gradeCard,
  subscribeSrsStore,
  getSrsStoreSnapshot,
  getSrsServerSnapshot,
  type SrsCard,
} from "@/src/lib/data/srs";

type Grade = "got" | "again";

function buildQueue(due: SrsCard[], resolved: Record<string, Grade>): SrsCard[] {
  const pending = due.filter((card) => resolved[card.key] !== "got");
  const requeued = due.filter((card) => resolved[card.key] === "again");
  return [...pending, ...requeued];
}

export function ReviewSession({ cards }: { cards: SrsCard[] }) {
  const store = useSyncExternalStore(subscribeSrsStore, getSrsStoreSnapshot, getSrsServerSnapshot);
  const [now, setNow] = useState(() => Date.now());
  const [resolved, setResolved] = useState<Record<string, Grade>>({});
  const [flipped, setFlipped] = useState(false);

  const due = useMemo(() => selectDueCards(cards, store.records, now), [cards, store.records, now]);
  const stats = useMemo(() => selectSrsStats(cards, store.records, now), [cards, store.records, now]);
  const queue = useMemo(() => buildQueue(due, resolved), [due, resolved]);

  // Fixed session total: the number of due cards the session started with.
  const deckSignature = `${cards.length}:${cards[0]?.key ?? ""}:${cards[cards.length - 1]?.key ?? ""}`;
  const [session, setSession] = useState({ signature: deckSignature, total: due.length, done: 0 });
  if (session.signature !== deckSignature) {
    setSession({ signature: deckSignature, total: due.length, done: 0 });
    setResolved({});
    setFlipped(false);
  }

  const done = session.done;

  if (queue.length === 0) {
    return (
      <div className="p-8 text-center space-y-3">
        <div className="text-4xl">🎉</div>
        <h2 className="text-xl font-bold text-primary">All caught up!</h2>
        <p className="text-sm text-on-surface-variant">
          You reviewed {done} card{done === 1 ? "" : "s"} this session. {stats.learned} card
          {stats.learned === 1 ? " is" : "s are"} scheduled for later.
        </p>
        <Link href="/" className="inline-block text-sm font-mono text-primary hover:underline">
          ← Back to Revision Home
        </Link>
      </div>
    );
  }

  const current = queue[0];

  const grade = (remembered: boolean) => {
    gradeCard(current.key, remembered);
    setResolved((prev) => ({ ...prev, [current.key]: remembered ? "got" : "again" }));
    setSession((prev) => ({ ...prev, done: prev.done + 1 }));
    setNow(Date.now());
    setFlipped(false);
  };

  return (
    <div className="max-w-xl mx-auto space-y-4">
      <div className="flex items-center justify-between text-xs font-mono text-on-surface-variant">
        <span>
          {done + 1} / {Math.max(session.total, done + 1)} this session
        </span>
        <span>
          {stats.due} due · {stats.learned} learned
        </span>
      </div>

      <button
        type="button"
        onClick={() => setFlipped((f) => !f)}
        className="w-full min-h-[220px] p-8 rounded-xl bg-surface-container-lowest border border-outline-variant shadow-xs flex flex-col items-center justify-center gap-3 cursor-pointer"
        aria-label={flipped ? "Show prompt" : "Reveal answer"}
      >
        <span className="text-[11px] font-mono uppercase tracking-wider text-on-surface-variant">
          {flipped ? "Answer — tap to hide" : "Prompt — tap to reveal"}
        </span>
        <span className="text-3xl font-bold font-sans text-primary text-center">
          {flipped ? current.back : current.front}
        </span>
        {current.hint && <span className="text-xs text-on-surface-variant">{current.hint}</span>}
      </button>

      {flipped ? (
        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => grade(false)}
            className="py-3 rounded-lg bg-rose-100 text-rose-900 text-sm font-bold hover:bg-rose-200 transition-colors"
          >
            ✗ Again
          </button>
          <button
            type="button"
            onClick={() => grade(true)}
            className="py-3 rounded-lg bg-emerald-600 text-white text-sm font-bold hover:bg-emerald-700 transition-colors"
          >
            ✓ Got it
          </button>
        </div>
      ) : (
        <p className="text-center text-xs text-on-surface-variant">
          Try to recall the answer, then tap the card.
        </p>
      )}
    </div>
  );
}
