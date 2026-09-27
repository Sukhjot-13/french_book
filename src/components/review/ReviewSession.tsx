"use client";

import React, { useState } from "react";
import Link from "next/link";
import { getDueCards, getSrsStats, gradeCard, type SrsCard } from "@/src/lib/data/srs";

export function ReviewSession({ cards }: { cards: SrsCard[] }) {
  const [queue, setQueue] = useState<SrsCard[]>(() => getDueCards(cards));
  const [flipped, setFlipped] = useState(false);
  const [done, setDone] = useState(0);
  // Read fresh every render: grading writes LocalStorage directly.
  const stats = getSrsStats(cards);

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
    setDone((d) => d + 1);
    setFlipped(false);
    setQueue((q) => {
      const [, ...rest] = q;
      // A missed card goes straight back into this session's queue.
      return remembered ? rest : [...rest, current];
    });
  };

  return (
    <div className="max-w-xl mx-auto space-y-4">
      <div className="flex items-center justify-between text-xs font-mono text-on-surface-variant">
        <span>
          {done + 1} / {done + queue.length} this session
        </span>
        <span>{stats.due} due · {stats.learned} learned</span>
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
        {current.hint && (
          <span className="text-xs text-on-surface-variant">{current.hint}</span>
        )}
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
