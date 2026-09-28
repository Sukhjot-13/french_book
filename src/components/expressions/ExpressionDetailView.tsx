"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ExpressionUI, VerbUI, ExampleUI, VocabUI } from "@/src/lib/data/selectors";
import { usePeek } from "../peek/PeekContext";

interface ExpressionDetailViewProps {
  expression: ExpressionUI;
  verbs: VerbUI[];
  examples: ExampleUI[];
  vocabulary: VocabUI[];
}

export function ExpressionDetailView({
  expression,
  verbs,
  examples,
  vocabulary,
}: ExpressionDetailViewProps) {
  const { openPeek } = usePeek();
  const [showAllExamples, setShowAllExamples] = useState(false);
  const visibleExamples = showAllExamples ? examples : examples.slice(0, 3);

  return (
    <div className="space-y-6">
      {/* STICKY LOCAL SUBNAV */}
      <nav className="sticky top-2 z-20 px-3 py-2 rounded-xl bg-surface-container-low/95 backdrop-blur-md border border-outline-variant/80 shadow-xs flex flex-wrap items-center justify-between gap-2 text-xs font-mono">
        <div className="flex items-center gap-1.5 overflow-x-auto">
          <a href="#overview" className="px-2.5 py-1 rounded-lg hover:bg-surface-container hover:text-primary transition-colors text-on-surface-variant font-medium">
            Overview
          </a>
          {expression.pattern && (
            <a href="#pattern" className="px-2.5 py-1 rounded-lg hover:bg-surface-container hover:text-primary transition-colors text-on-surface-variant font-medium">
              Pattern & Slots
            </a>
          )}
          {(verbs.length > 0 || vocabulary.length > 0) && (
            <a href="#relations" className="px-2.5 py-1 rounded-lg hover:bg-surface-container hover:text-primary transition-colors text-on-surface-variant font-medium">
              Connections ({verbs.length + vocabulary.length})
            </a>
          )}
          {examples.length > 0 && (
            <a href="#examples" className="px-2.5 py-1 rounded-lg hover:bg-surface-container hover:text-primary transition-colors text-on-surface-variant font-medium">
              Examples ({examples.length})
            </a>
          )}
        </div>
        <div className="flex items-center gap-2">
          <Link
            href={`/examples?search=${encodeURIComponent(expression.french)}`}
            className="text-[11px] font-semibold text-primary hover:underline inline-flex items-center gap-1"
          >
            <span>Explorer Filter</span>
            <span className="material-symbols-outlined text-[13px]">arrow_forward</span>
          </Link>
        </div>
      </nav>

      {/* HERO HEADER */}
      <div id="overview" className="p-5 md:p-6 rounded-xl bg-surface-container-low border border-outline-variant space-y-4 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-baseline justify-between gap-2 border-b border-outline-variant/40 pb-3">
          <div>
            <span className="text-[10px] font-mono uppercase text-on-surface-variant tracking-wider block">
              {expression.type.replace("_", " ")}
            </span>
            <h1 className="text-2xl md:text-4xl font-bold font-sans text-primary tracking-tight mt-0.5">
              {expression.french}
            </h1>
          </div>
          <div className="text-xs font-mono text-on-surface-variant flex items-center gap-2">
            <span>register: <strong>{expression.register}</strong></span>
            {expression.strength && (
              <>
                <span>·</span>
                <span>strength: {expression.strength}</span>
              </>
            )}
            {expression.cefr && (
              <>
                <span>·</span>
                <span className="font-bold text-primary">{expression.cefr}</span>
              </>
            )}
          </div>
        </div>

        {/* English Meaning */}
        <p className="text-base md:text-xl text-secondary font-serif italic">
          {expression.english || "—"}
        </p>

        {/* Prominently Emphasized Syntactic Pattern (Point 13) */}
        {expression.pattern && (
          <div id="pattern" className="p-3.5 rounded-lg bg-[#002147] text-white font-mono text-xs md:text-sm border border-blue-900 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <span className="text-[10px] uppercase text-blue-200 block font-sans font-bold">
                Syntactic Pattern:
              </span>
              <span className="text-blue-100 font-semibold">{expression.pattern}</span>
            </div>
            {expression.complement_structure && (
              <span className="text-[11px] font-mono text-blue-200 bg-blue-950 px-2 py-1 rounded">
                {expression.complement_structure}
              </span>
            )}
          </div>
        )}

        {/* Pattern Slots */}
        {expression.pattern_slots && expression.pattern_slots.length > 0 && (
          <div className="pt-2 border-t border-outline-variant/40 space-y-2">
            <span className="text-[11px] font-mono uppercase font-bold text-on-surface-variant block">
              Pattern Slots & Constraints
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 text-xs">
              {expression.pattern_slots.map((slot, sIdx) => (
                <div
                  key={sIdx}
                  className="p-2.5 rounded-lg bg-surface-container-lowest border border-outline-variant/40"
                >
                  <div className="font-mono font-bold text-primary">
                    {slot.slot_name || `Slot ${sIdx + 1}`}
                  </div>
                  {slot.filler_types && (
                    <div className="text-on-surface-variant text-[11px] mt-0.5">
                      Types: {slot.filler_types.join(", ")}
                    </div>
                  )}
                  {slot.notes && (
                    <div className="text-on-surface-variant text-[11px] italic mt-0.5">
                      {slot.notes}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Governed Prepositions */}
        {expression.prepositions && expression.prepositions.length > 0 && (
          <div className="pt-2 border-t border-outline-variant/40 flex items-center gap-2 text-xs font-mono">
            <span className="text-on-surface-variant font-bold uppercase text-[10px]">
              Prepositions:
            </span>
            <div className="flex flex-wrap gap-1">
              {expression.prepositions.map((prep, pIdx) => (
                <span
                  key={pIdx}
                  className="px-2 py-0.5 rounded bg-surface-container text-primary font-bold text-[11px]"
                >
                  {prep}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Restrictions / Warnings */}
        {expression.restrictions && expression.restrictions.length > 0 && (
          <div className="p-3 rounded-lg bg-amber-500/10 border border-amber-500/30 text-xs text-amber-900 space-y-1">
            <span className="font-bold text-[11px] font-mono uppercase block">Usage Caution:</span>
            {expression.restrictions.map((r, idx) => (
              <p key={idx} className="leading-relaxed">
                • {r}
              </p>
            ))}
          </div>
        )}
      </div>

      {/* RELATIONSHIPS: RELATED VERBS & VOCABULARY (Point 7) */}
      <div id="relations" className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Base / Related Verbs */}
        <div className="p-5 rounded-xl bg-surface-container-lowest border border-outline-variant space-y-3 shadow-xs">
          <h2 className="text-base font-bold text-primary flex items-center gap-2 border-b border-outline-variant/50 pb-2">
            <span className="material-symbols-outlined text-primary text-[18px]">menu_book</span>
            <span>Associated Verbs ({verbs.length})</span>
          </h2>
          {verbs.length > 0 ? (
            <div className="space-y-2">
              {verbs.map((verb) => (
                <div
                  key={verb.id}
                  className="p-2.5 rounded-lg bg-surface-container-low/50 border border-outline-variant/40 flex items-center justify-between gap-2 text-xs"
                >
                  <div>
                    <Link
                      href={`/verbs/${encodeURIComponent(verb.lemma)}`}
                      className="font-bold text-primary hover:underline text-sm"
                    >
                      {verb.lemma}
                    </Link>
                    <p className="text-on-surface-variant text-[11px]">{verb.english}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => openPeek("verb", verb.lemma)}
                    className="text-[11px] font-mono text-primary hover:underline px-2 py-0.5 rounded bg-surface-container"
                  >
                    Peek Verb
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-on-surface-variant italic py-2">
              No directly linked base verbs recorded.
            </p>
          )}
        </div>

        {/* Governed / Related Vocabulary */}
        <div className="p-5 rounded-xl bg-surface-container-lowest border border-outline-variant space-y-3 shadow-xs">
          <h2 className="text-base font-bold text-primary flex items-center gap-2 border-b border-outline-variant/50 pb-2">
            <span className="material-symbols-outlined text-primary text-[18px]">dictionary</span>
            <span>Related Vocabulary ({vocabulary.length})</span>
          </h2>
          {vocabulary.length > 0 ? (
            <div className="space-y-2">
              {vocabulary.map((voc) => (
                <div
                  key={voc.id}
                  className="p-2.5 rounded-lg bg-surface-container-low/50 border border-outline-variant/40 flex items-center justify-between gap-2 text-xs"
                >
                  <div>
                    <Link
                      href={`/vocabulary/${encodeURIComponent(voc.id)}`}
                      className="font-bold text-primary hover:underline text-sm"
                    >
                      {voc.french}
                    </Link>
                    <p className="text-on-surface-variant text-[11px]">{voc.english}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => openPeek("vocab", voc.id)}
                    className="text-[11px] font-mono text-primary hover:underline px-2 py-0.5 rounded bg-surface-container"
                  >
                    Peek Vocab
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-on-surface-variant italic py-2">
              No standalone lexical entries linked directly.
            </p>
          )}
        </div>
      </div>

      {/* SENTENCE EXAMPLES WITH SMART SHOW MORE */}
      {examples.length > 0 && (
        <div id="examples" className="p-5 rounded-xl bg-surface-container-lowest border border-outline-variant space-y-3 shadow-xs">
          <div className="flex items-center justify-between border-b border-outline-variant/50 pb-2">
            <h2 className="text-base font-bold text-primary flex items-center gap-2">
              <span className="material-symbols-outlined text-primary text-[18px]">format_quote</span>
              <span>Contextual Sentence Examples</span>
            </h2>
            {examples.length > 3 && (
              <button
                type="button"
                onClick={() => setShowAllExamples(!showAllExamples)}
                className="text-xs font-mono text-primary hover:underline"
              >
                {showAllExamples ? "Show fewer examples" : `Show ${examples.length - 3} more examples`}
              </button>
            )}
          </div>

          <div className="divide-y divide-outline-variant/30">
            {visibleExamples.map((ex) => (
              <div key={ex.id} className="py-2.5 space-y-0.5">
                <p className="text-sm text-primary font-serif font-medium">{ex.french}</p>
                <p className="text-xs text-on-surface-variant font-sans">{ex.english}</p>
              </div>
            ))}
          </div>

          <div className="pt-2 border-t border-outline-variant/40 flex items-center justify-between">
            <Link
              href={`/examples?search=${encodeURIComponent(expression.french)}`}
              className="text-xs font-mono font-semibold text-primary hover:underline inline-flex items-center gap-1"
            >
              <span>View all examples in Example Explorer</span>
              <span className="material-symbols-outlined text-[13px]">arrow_forward</span>
            </Link>
          </div>
        </div>
      )}

      {/* DEMOTED TECHNICAL METADATA (Point 9) */}
      <details className="p-3.5 rounded-lg bg-surface-container-low border border-outline-variant/60 text-xs font-mono group">
        <summary className="cursor-pointer text-on-surface-variant font-semibold select-none flex items-center justify-between">
          <span className="flex items-center gap-1.5">
            <span className="material-symbols-outlined text-[16px]">info</span>
            <span>Source Attestation & Technical Metadata</span>
          </span>
          <span className="text-[11px] text-on-surface-variant group-open:rotate-180 transition-transform">
            ▼
          </span>
        </summary>
        <div className="pt-3 border-t border-outline-variant/40 mt-2 space-y-2 text-[11px] text-on-surface-variant">
          <div>
            <span className="font-bold text-on-surface">Expression ID:</span> {expression.id}
          </div>
          {expression.raw_chapters && expression.raw_chapters.length > 0 && (
            <div className="flex flex-wrap items-center gap-1.5 pt-1">
              <span className="font-bold text-on-surface">Book Chapters:</span>
              {expression.raw_chapters.map((ch) => (
                <Link
                  key={ch}
                  href={`/chapters/${ch}`}
                  className="px-2 py-0.5 rounded bg-surface-container hover:bg-primary hover:text-white transition-colors"
                >
                  Chapter {ch}
                </Link>
              ))}
            </div>
          )}
        </div>
      </details>
    </div>
  );
}
