"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { TenseUI, VerbConjugationUI, GrammarRuleUI, ExampleUI, TrapUI } from "@/src/lib/data/selectors";
import { usePeek } from "../peek/PeekContext";

interface TenseDetailViewProps {
  tense: TenseUI;
  conjugations: VerbConjugationUI[];
  grammarRules: GrammarRuleUI[];
  examples: ExampleUI[];
  traps: TrapUI[];
}

export function TenseDetailView({
  tense,
  conjugations,
  grammarRules,
  examples,
  traps,
}: TenseDetailViewProps) {
  const { openPeek } = usePeek();

  const [verbQuery, setVerbQuery] = useState("");
  const [showAllExamples, setShowAllExamples] = useState(false);

  const filteredConjugations = useMemo(() => {
    if (!verbQuery.trim()) return conjugations;
    const q = verbQuery.toLowerCase();
    return conjugations.filter((c) => c.verb_id?.toLowerCase().includes(q));
  }, [conjugations, verbQuery]);

  const visibleExamples = showAllExamples ? examples : examples.slice(0, 3);

  return (
    <div className="space-y-6">
      {/* STICKY LOCAL SUBNAV */}
      <nav className="sticky top-2 z-20 px-3 py-2 rounded-xl bg-surface-container-low/95 backdrop-blur-md border border-outline-variant/80 shadow-xs flex flex-wrap items-center justify-between gap-2 text-xs font-mono">
        <div className="flex items-center gap-1.5 overflow-x-auto">
          <a href="#overview" className="px-2.5 py-1 rounded-lg hover:bg-surface-container hover:text-primary transition-colors text-on-surface-variant font-medium">
            Overview
          </a>
          <a href="#matrix" className="px-2.5 py-1 rounded-lg hover:bg-surface-container hover:text-primary transition-colors text-on-surface-variant font-medium">
            Inflections ({conjugations.length})
          </a>
          {grammarRules.length > 0 && (
            <a href="#grammar" className="px-2.5 py-1 rounded-lg hover:bg-surface-container hover:text-primary transition-colors text-on-surface-variant font-medium">
              Rules ({grammarRules.length})
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
            href={`/examples?tense=${encodeURIComponent(tense.name_fr)}`}
            className="text-[11px] font-semibold text-primary hover:underline inline-flex items-center gap-1"
          >
            <span>Explorer Filter</span>
            <span className="material-symbols-outlined text-[13px]">arrow_forward</span>
          </Link>
        </div>
      </nav>

      {/* POINT 15: TENSE QUICK-REFERENCE CARD FIRST */}
      <div id="overview" className="p-5 md:p-6 rounded-xl bg-surface-container-low border border-outline-variant space-y-4 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-baseline justify-between gap-2 border-b border-outline-variant/40 pb-3">
          <div>
            <span className="text-[10px] font-mono uppercase text-on-surface-variant tracking-wider block">
              Mode {tense.mood || "Indicatif"}
            </span>
            <h1 className="text-2xl md:text-4xl font-bold font-sans text-primary tracking-tight capitalize mt-0.5">
              {tense.name_fr}
            </h1>
            {tense.name_en && (
              <p className="text-sm md:text-base text-secondary font-serif italic mt-0.5">
                {tense.name_en}
              </p>
            )}
          </div>
          <span className="text-xs font-mono text-on-surface-variant px-2.5 py-1 rounded bg-surface-container">
            {conjugations.length} verbs indexed
          </span>
        </div>

        {/* 4-PART QUICK REFERENCE CARD */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {/* 1. Formula */}
          <div className="p-3.5 rounded-lg bg-[#002147] text-white space-y-1 shadow-xs border border-blue-900">
            <span className="text-[10px] font-mono uppercase text-blue-200 block font-bold">
              1. Formula / Formation:
            </span>
            <p className="font-mono text-xs md:text-sm font-semibold text-blue-100">
              {tense.formation || "Standard stem + tense inflectional endings"}
            </p>
          </div>

          {/* 2. When to Use */}
          <div className="p-3.5 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-950 space-y-1 shadow-xs">
            <span className="text-[10px] font-mono uppercase text-emerald-900 block font-bold">
              2. When to Use:
            </span>
            <ul className="text-xs space-y-0.5 text-emerald-950">
              {tense.usage && tense.usage.length > 0 ? (
                tense.usage.slice(0, 2).map((u, idx) => (
                  <li key={idx} className="flex items-start gap-1">
                    <span className="text-emerald-700 font-bold">•</span>
                    <span>{u}</span>
                  </li>
                ))
              ) : (
                <li>Temporal aspect and modal conditions of this tense system.</li>
              )}
            </ul>
          </div>

          {/* 3. Signal Words */}
          <div className="p-3.5 rounded-lg bg-surface-container-lowest border border-outline-variant/50 space-y-1.5 shadow-xs">
            <span className="text-[10px] font-mono uppercase text-on-surface-variant block font-bold">
              3. Signal Words / Temporal Markers:
            </span>
            {tense.signal_words && tense.signal_words.length > 0 ? (
              <div className="flex flex-wrap gap-1">
                {tense.signal_words.map((w, idx) => (
                  <span
                    key={idx}
                    className="px-2 py-0.5 rounded bg-surface-container text-primary font-mono text-[11px]"
                  >
                    {w}
                  </span>
                ))}
              </div>
            ) : (
              <span className="text-xs text-on-surface-variant italic">Contextual temporal triggers.</span>
            )}
          </div>

          {/* 4. Agreement Rules & Traps */}
          <div className="p-3.5 rounded-lg bg-surface-container-lowest border border-outline-variant/50 space-y-1.5 shadow-xs">
            <span className="text-[10px] font-mono uppercase text-on-surface-variant block font-bold">
              4. Agreement Rule & Pitfall:
            </span>
            {tense.agreement_rules && tense.agreement_rules.length > 0 ? (
              <p className="text-xs text-on-surface leading-relaxed">
                {tense.agreement_rules[0]}
              </p>
            ) : tense.common_traps && tense.common_traps.length > 0 ? (
              <p className="text-xs text-amber-900 leading-relaxed">
                ⚠️ {tense.common_traps[0]}
              </p>
            ) : (
              <span className="text-xs text-on-surface-variant italic">Standard morphological subject-verb concord.</span>
            )}
          </div>
        </div>
      </div>

      {/* RECORDED VERB CONJUGATIONS (SCAN TABLE + SEARCH + PEEK) */}
      <div id="matrix" className="p-5 rounded-xl bg-surface-container-lowest border border-outline-variant space-y-4 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-outline-variant/50 pb-3">
          <div>
            <h2 className="text-base font-bold text-primary flex items-center gap-2">
              <span className="material-symbols-outlined text-primary text-[18px]">history_toggle_off</span>
              <span>Verb Inflection Matrix</span>
            </h2>
            <p className="text-xs text-on-surface-variant">
              Quickly scan forms or click any verb to peek full profile and examples.
            </p>
          </div>

          <div className="w-full sm:w-64 relative">
            <input
              type="text"
              value={verbQuery}
              onChange={(e) => setVerbQuery(e.target.value)}
              placeholder="Filter verb forms..."
              className="w-full px-3 py-1.5 pl-8 rounded bg-surface-container-low border border-outline-variant text-xs text-on-surface focus:outline-none focus:border-primary font-sans"
            />
            <span className="material-symbols-outlined absolute left-2 top-1.5 text-[16px] text-on-surface-variant">
              search
            </span>
          </div>
        </div>

        {filteredConjugations.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {filteredConjugations.slice(0, 30).map((conj) => (
              <div
                key={conj.id}
                className="p-3 rounded-lg bg-surface-container-low/40 border border-outline-variant/40 space-y-2 hover:border-primary/60 transition-colors"
              >
                <div className="flex items-center justify-between border-b border-outline-variant/30 pb-1.5">
                  <Link
                    href={`/verbs/${encodeURIComponent(conj.verb_id)}`}
                    className="font-bold text-sm text-primary hover:underline"
                  >
                    {conj.verb_id}
                  </Link>
                  <button
                    type="button"
                    onClick={() => openPeek("verb", conj.verb_id)}
                    className="text-[11px] font-mono text-primary hover:underline px-2 py-0.5 rounded bg-surface-container"
                  >
                    Peek Verb
                  </button>
                </div>

                <div className="space-y-1 text-xs font-mono">
                  {conj.je && (
                    <div className="flex justify-between py-0.5 border-b border-outline-variant/20">
                      <span className="text-on-surface-variant text-[11px]">je</span>
                      <span className="font-bold text-primary">{conj.je}</span>
                    </div>
                  )}
                  {conj.tu && (
                    <div className="flex justify-between py-0.5 border-b border-outline-variant/20">
                      <span className="text-on-surface-variant text-[11px]">tu</span>
                      <span className="font-bold text-primary">{conj.tu}</span>
                    </div>
                  )}
                  {conj.il_elle_on && (
                    <div className="flex justify-between py-0.5 border-b border-outline-variant/20">
                      <span className="text-on-surface-variant text-[11px]">il/elle</span>
                      <span className="font-bold text-primary">{conj.il_elle_on}</span>
                    </div>
                  )}
                  {conj.nous && (
                    <div className="flex justify-between py-0.5 border-b border-outline-variant/20">
                      <span className="text-on-surface-variant text-[11px]">nous</span>
                      <span className="font-bold text-primary">{conj.nous}</span>
                    </div>
                  )}
                  {conj.vous && (
                    <div className="flex justify-between py-0.5 border-b border-outline-variant/20">
                      <span className="text-on-surface-variant text-[11px]">vous</span>
                      <span className="font-bold text-primary">{conj.vous}</span>
                    </div>
                  )}
                  {conj.ils_elles && (
                    <div className="flex justify-between py-0.5">
                      <span className="text-on-surface-variant text-[11px]">ils/elles</span>
                      <span className="font-bold text-primary">{conj.ils_elles}</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-8 text-center text-xs text-on-surface-variant italic">
            No conjugations found matching &quot;{verbQuery}&quot;.
          </div>
        )}
      </div>

      {/* RELATIONSHIPS: RELATED GRAMMAR RULES */}
      {grammarRules.length > 0 && (
        <div id="grammar" className="p-5 rounded-xl bg-surface-container-lowest border border-outline-variant space-y-3 shadow-xs">
          <h2 className="text-base font-bold text-primary flex items-center gap-2 border-b border-outline-variant/50 pb-2">
            <span className="material-symbols-outlined text-primary text-[18px]">menu_book</span>
            <span>Related Grammar Rules ({grammarRules.length})</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {grammarRules.map((rule) => (
              <div
                key={rule.id}
                className="p-3 rounded-lg bg-surface-container-low/40 border border-outline-variant/40 flex items-start justify-between gap-2 text-xs"
              >
                <div>
                  <Link
                    href={`/grammar/${encodeURIComponent(rule.title)}`}
                    className="font-bold text-primary hover:underline"
                  >
                    {rule.title}
                  </Link>
                  {rule.summary && (
                    <p className="text-on-surface-variant text-[11px] mt-0.5 line-clamp-2">
                      {rule.summary}
                    </p>
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => openPeek("grammar", rule.title)}
                  className="text-[11px] font-mono text-primary hover:underline px-2 py-0.5 rounded bg-surface-container"
                >
                  Peek
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

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
              href={`/examples?tense=${encodeURIComponent(tense.name_fr)}`}
              className="text-xs font-mono font-semibold text-primary hover:underline inline-flex items-center gap-1"
            >
              <span>View all examples for {tense.name_fr} in Example Explorer</span>
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
            <div className="text-xs font-bold text-emerald-950">Drill Tense Inflections</div>
            <div className="text-[11px] text-emerald-900/80">Practice conjugation drills and sentence transformations for {tense.name_fr}.</div>
          </div>
        </div>
        <Link
          href={`/exercises?search=${encodeURIComponent(tense.name_fr)}`}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-700 text-white text-xs font-mono font-medium hover:bg-emerald-800 transition-colors self-start sm:self-auto"
        >
          <span>Practice Exercises</span>
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
            <span className="font-bold text-on-surface">Tense ID:</span> {tense.id}
          </div>
          <div>
            <span className="font-bold text-on-surface">Mood Category:</span> {tense.mood}
          </div>
        </div>
      </details>
    </div>
  );
}
