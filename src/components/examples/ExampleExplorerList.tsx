"use client";

import React from "react";
import Link from "next/link";
import { ExampleUI } from "@/src/lib/data/selectors";
import { usePeek } from "../peek/PeekContext";

interface ExampleExplorerListProps {
  examples: ExampleUI[];
}

export function ExampleExplorerList({ examples }: ExampleExplorerListProps) {
  const { openPeek } = usePeek();

  return (
    <div className="divide-y divide-outline-variant/50 rounded-xl border border-outline-variant overflow-hidden bg-surface-container-lowest shadow-xs">
      {examples.map((ex) => (
        <div
          key={ex.id}
          className="p-4 md:p-5 hover:bg-surface-container-low transition-colors space-y-2 group"
        >
          {/* French Sentence */}
          <p className="text-base md:text-lg text-primary font-serif leading-snug">
            {ex.french}
          </p>

          {/* English Translation */}
          <p className="text-xs md:text-sm text-on-surface-variant font-sans">
            {ex.english}
          </p>

          {/* Interactive Peek Metadata Strip (Point 15 in gptsugg.txt) */}
          <div className="flex flex-wrap items-center gap-1.5 pt-2 text-xs">
            {/* Focus Spans */}
            {ex.focus_spans && ex.focus_spans.length > 0 && (
              <div className="flex flex-wrap items-center gap-1">
                {ex.focus_spans.map((span, sIdx) => (
                  <span
                    key={sIdx}
                    className="px-2 py-0.5 rounded bg-blue-100/70 text-blue-900 font-mono text-[11px] font-semibold border border-blue-200"
                    title={span.focus_type || "Focus span"}
                  >
                    🎯 {span.text}
                  </span>
                ))}
              </div>
            )}

            {/* Verbs with Peek */}
            {ex.related_verbs && ex.related_verbs.length > 0 && (
              <div className="flex flex-wrap items-center gap-1">
                {ex.related_verbs.map((v, vIdx) => (
                  <button
                    key={vIdx}
                    type="button"
                    onClick={() => openPeek("verb", v)}
                    className="px-2 py-0.5 rounded bg-surface-container hover:bg-[#002147] hover:text-white font-mono text-[11px] text-primary border border-outline-variant/60 transition-colors"
                  >
                    verb: {v}
                  </button>
                ))}
              </div>
            )}

            {/* Grammar Rules with Peek */}
            {ex.related_grammar_rules && ex.related_grammar_rules.length > 0 && (
              <div className="flex flex-wrap items-center gap-1">
                {ex.related_grammar_rules.map((rule, rIdx) => (
                  <button
                    key={rIdx}
                    type="button"
                    onClick={() => openPeek("grammar", rule)}
                    className="px-2 py-0.5 rounded bg-surface-container hover:bg-[#002147] hover:text-white font-mono text-[11px] text-primary border border-outline-variant/60 transition-colors"
                  >
                    rule: {rule}
                  </button>
                ))}
              </div>
            )}

            {/* Tenses with Peek */}
            {ex.related_tenses && ex.related_tenses.length > 0 && (
              <div className="flex flex-wrap items-center gap-1">
                {ex.related_tenses.map((t, tIdx) => (
                  <button
                    key={tIdx}
                    type="button"
                    onClick={() => openPeek("tense", t)}
                    className="px-2 py-0.5 rounded bg-surface-container hover:bg-[#002147] hover:text-white font-mono text-[11px] text-primary border border-outline-variant/60 transition-colors"
                  >
                    tense: {t}
                  </button>
                ))}
              </div>
            )}

            {/* Book Chapters Link */}
            {ex.raw_chapters && ex.raw_chapters.length > 0 && (
              <div className="flex items-center gap-1 ml-auto">
                {ex.raw_chapters.map((chNum) => (
                  <Link
                    key={chNum}
                    href={`/chapters/${chNum}`}
                    className="px-2 py-0.5 rounded bg-surface-container font-mono text-[10px] text-on-surface-variant hover:bg-primary hover:text-white transition-colors"
                  >
                    Ch {chNum}
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
