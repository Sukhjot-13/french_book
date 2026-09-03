"use client";

import React, { useState } from "react";
import Link from "next/link";
import { GrammarRuleUI, VerbUI, ExampleUI, TrapUI, TenseUI } from "@/src/lib/data/selectors";
import { usePeek } from "../peek/PeekContext";

interface GrammarDetailViewProps {
  rule: GrammarRuleUI;
  tenses: TenseUI[];
  verbs: VerbUI[];
  examples: ExampleUI[];
  traps: TrapUI[];
}

export function GrammarDetailView({
  rule,
  tenses,
  verbs,
  examples,
  traps,
}: GrammarDetailViewProps) {
  const { openPeek } = usePeek();
  const [showAllExamples, setShowAllExamples] = useState(false);
  const visibleExamples = showAllExamples ? examples : examples.slice(0, 3);

  // Derive "When to Use" bullets from rule.usage or summary
  const usageBullets = rule.usage && rule.usage.length > 0
    ? rule.usage.slice(0, 3)
    : rule.summary
    ? [rule.summary]
    : ["Apply when constructing standard syntactic structures in this register."];

  // Derive "Common Trap" text from traps or rule.common_traps
  const commonTrapNotice =
    traps.length > 0
      ? traps[0].description
      : rule.common_traps && rule.common_traps.length > 0
      ? rule.common_traps[0]
      : rule.restrictions && rule.restrictions.length > 0
      ? rule.restrictions[0]
      : null;

  return (
    <div className="space-y-6">
      {/* STICKY LOCAL SUBNAV */}
      <nav className="sticky top-2 z-20 px-3 py-2 rounded-xl bg-surface-container-low/95 backdrop-blur-md border border-outline-variant/80 shadow-xs flex flex-wrap items-center justify-between gap-2 text-xs font-mono">
        <div className="flex items-center gap-1.5 overflow-x-auto">
          <a href="#overview" className="px-2.5 py-1 rounded-lg hover:bg-surface-container hover:text-primary transition-colors text-on-surface-variant font-medium">
            Overview
          </a>
          {rule.formation && (
            <a href="#formation" className="px-2.5 py-1 rounded-lg hover:bg-surface-container hover:text-primary transition-colors text-on-surface-variant font-medium">
              Formation
            </a>
          )}
          {(verbs.length > 0 || tenses.length > 0) && (
            <a href="#relations" className="px-2.5 py-1 rounded-lg hover:bg-surface-container hover:text-primary transition-colors text-on-surface-variant font-medium">
              Connections ({verbs.length + tenses.length})
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
            href={`/examples?grammarRule=${encodeURIComponent(rule.title)}`}
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
              Grammar Rule • {rule.category}
            </span>
            <h1 className="text-2xl md:text-4xl font-bold font-sans text-primary tracking-tight mt-0.5">
              {rule.title}
            </h1>
          </div>
          <div className="text-xs font-mono text-on-surface-variant flex items-center gap-2">
            {rule.cefr && <span>level: <strong className="text-primary">{rule.cefr}</strong></span>}
            {rule.priority && (
              <>
                <span>·</span>
                <span>priority: {rule.priority}</span>
              </>
            )}
          </div>
        </div>

        {/* POINT 12: 2-BOX SUMMARY CAPSULE (WHEN TO USE & WATCH OUT) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
          {/* Box 1: When to Use */}
          <div className="p-3.5 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-xs text-emerald-950 space-y-1.5 shadow-xs">
            <div className="flex items-center gap-1.5 font-bold font-mono text-[11px] uppercase text-emerald-900">
              <span className="material-symbols-outlined text-[16px] text-emerald-700">check_circle</span>
              <span>When to Use</span>
            </div>
            <ul className="space-y-1 text-emerald-900 leading-relaxed">
              {usageBullets.map((u, i) => (
                <li key={i} className="flex items-start gap-1.5">
                  <span className="text-emerald-700 font-bold">•</span>
                  <span>{u}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Box 2: Watch Out / Common Trap */}
          <div className="p-3.5 rounded-lg bg-amber-500/10 border border-amber-500/30 text-xs text-amber-950 space-y-1.5 shadow-xs">
            <div className="flex items-center gap-1.5 font-bold font-mono text-[11px] uppercase text-amber-900">
              <span className="material-symbols-outlined text-[16px] text-amber-700">warning</span>
              <span>Watch Out / Trap</span>
            </div>
            {commonTrapNotice ? (
              <p className="text-amber-900 leading-relaxed">
                {commonTrapNotice}
              </p>
            ) : (
              <p className="text-amber-900/80 italic leading-relaxed">
                No exceptional structural irregularity flagged for this rule.
              </p>
            )}
          </div>
        </div>

        {/* Formation Formula */}
        {rule.formation && (
          <div id="formation" className="p-3.5 rounded-lg bg-[#002147] text-white font-mono text-xs md:text-sm border border-blue-900 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <span className="text-[10px] uppercase text-blue-200 block font-sans font-bold">
                Formation Formula:
              </span>
              <span className="text-blue-100 font-semibold">{rule.formation}</span>
            </div>
            {rule.word_order && (
              <span className="text-[11px] font-mono text-blue-200 bg-blue-950 px-2 py-1 rounded">
                Order: {rule.word_order}
              </span>
            )}
          </div>
        )}

        {/* Detailed Explanation */}
        {rule.explanation && (
          <div className="pt-2 text-xs md:text-sm text-on-surface leading-relaxed space-y-1 font-sans">
            <span className="font-bold text-primary font-mono text-[11px] uppercase block">
              Explanation & Mechanics:
            </span>
            <p className="whitespace-pre-line text-on-surface/90">{rule.explanation}</p>
          </div>
        )}

        {/* Signal Words & Agreement Rules */}
        {(rule.signal_words?.length || rule.agreement_rules?.length) && (
          <div className="pt-2 border-t border-outline-variant/40 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            {rule.signal_words && rule.signal_words.length > 0 && (
              <div>
                <span className="font-bold font-mono text-[10px] uppercase text-on-surface-variant block mb-1">
                  Signal Words / Triggers:
                </span>
                <div className="flex flex-wrap gap-1">
                  {rule.signal_words.map((w, idx) => (
                    <span key={idx} className="px-2 py-0.5 rounded bg-surface-container font-mono text-[11px] text-primary">
                      {w}
                    </span>
                  ))}
                </div>
              </div>
            )}
            {rule.agreement_rules && rule.agreement_rules.length > 0 && (
              <div>
                <span className="font-bold font-mono text-[10px] uppercase text-on-surface-variant block mb-1">
                  Agreement Rules:
                </span>
                <ul className="space-y-0.5 text-on-surface-variant">
                  {rule.agreement_rules.map((ar, idx) => (
                    <li key={idx}>• {ar}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </div>

      {/* RELATIONSHIPS: RELATED VERBS & TENSES (Point 7) */}
      <div id="relations" className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Governed / Related Verbs */}
        <div className="p-5 rounded-xl bg-surface-container-lowest border border-outline-variant space-y-3 shadow-xs">
          <h2 className="text-base font-bold text-primary flex items-center gap-2 border-b border-outline-variant/50 pb-2">
            <span className="material-symbols-outlined text-primary text-[18px]">menu_book</span>
            <span>Related Verbs ({verbs.length})</span>
          </h2>
          {verbs.length > 0 ? (
            <div className="space-y-2">
              {verbs.slice(0, 6).map((verb) => (
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
              No specific verbs linked directly to this general grammar rule.
            </p>
          )}
        </div>

        {/* Governed / Related Tenses */}
        <div className="p-5 rounded-xl bg-surface-container-lowest border border-outline-variant space-y-3 shadow-xs">
          <h2 className="text-base font-bold text-primary flex items-center gap-2 border-b border-outline-variant/50 pb-2">
            <span className="material-symbols-outlined text-primary text-[18px]">history_toggle_off</span>
            <span>Related Tenses ({tenses.length})</span>
          </h2>
          {tenses.length > 0 ? (
            <div className="space-y-2">
              {tenses.map((t) => (
                <div
                  key={t.id}
                  className="p-2.5 rounded-lg bg-surface-container-low/50 border border-outline-variant/40 flex items-center justify-between gap-2 text-xs"
                >
                  <div>
                    <Link
                      href={`/tenses/${encodeURIComponent(t.name_fr)}`}
                      className="font-bold text-primary hover:underline capitalize"
                    >
                      {t.name_fr}
                    </Link>
                    {t.mood && (
                      <p className="text-on-surface-variant text-[11px]">Mode {t.mood}</p>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={() => openPeek("tense", t.name_fr)}
                    className="text-[11px] font-mono text-primary hover:underline px-2 py-0.5 rounded bg-surface-container"
                  >
                    Peek Tense
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-on-surface-variant italic py-2">
              No individual tense guides directly attached.
            </p>
          )}
        </div>
      </div>

      {/* CONTEXTUAL EXAMPLES WITH SMART SHOW MORE */}
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
              href={`/examples?grammarRule=${encodeURIComponent(rule.title)}`}
              className="text-xs font-mono font-semibold text-primary hover:underline inline-flex items-center gap-1"
            >
              <span>View all examples for this rule in Example Explorer</span>
              <span className="material-symbols-outlined text-[13px]">arrow_forward</span>
            </Link>
          </div>
        </div>
      )}

      {/* PRACTICE DRILL CALL-TO-ACTION (Suggestion 23) */}
      <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-emerald-700 text-white flex items-center justify-center">
            <span className="material-symbols-outlined text-[20px]">quiz</span>
          </div>
          <div>
            <div className="text-xs font-bold text-emerald-950">Practice This Rule</div>
            <div className="text-[11px] text-emerald-900/80">Reinforce your grasp with targeted questions and chapter drills.</div>
          </div>
        </div>
        <Link
          href={rule.raw_chapters?.[0] ? `/exercises?chapter=${rule.raw_chapters[0]}` : `/exercises?search=${encodeURIComponent(rule.title)}`}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-700 text-white text-xs font-mono font-medium hover:bg-emerald-800 transition-colors self-start sm:self-auto"
        >
          <span>Drill Exercises</span>
          <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
        </Link>
      </div>

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
            <span className="font-bold text-on-surface">Rule ID:</span> {rule.id}
          </div>
          {rule.raw_chapters && rule.raw_chapters.length > 0 && (
            <div className="flex flex-wrap items-center gap-1.5 pt-1">
              <span className="font-bold text-on-surface">Book Chapters:</span>
              {rule.raw_chapters.map((ch) => (
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
