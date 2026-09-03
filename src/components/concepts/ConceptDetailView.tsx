"use client";

import React from "react";
import Link from "next/link";
import {
  ConceptUI,
  GrammarRuleUI,
  TenseUI,
  VerbUI,
  ExpressionUI,
  VocabUI,
  ExampleUI,
} from "@/src/lib/data/selectors";
import { usePeek } from "@/src/components/peek/PeekContext";

interface ConceptDetailViewProps {
  concept: ConceptUI;
  grammarRules: GrammarRuleUI[];
  tenses: TenseUI[];
  verbs: VerbUI[];
  expressions: ExpressionUI[];
  vocabulary: VocabUI[];
  examples: ExampleUI[];
}

export function ConceptDetailView({
  concept,
  grammarRules,
  tenses,
  verbs,
  expressions,
  vocabulary,
  examples,
}: ConceptDetailViewProps) {
  const { openPeek } = usePeek();

  return (
    <div className="space-y-6">
      {/* HERO / HEADER CARD */}
      <div className="p-6 md:p-8 rounded-2xl bg-surface-container-low border border-outline-variant shadow-xs">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
          <div className="space-y-3">
            <div className="flex flex-wrap items-center gap-2.5">
              <span className="w-8 h-8 rounded-lg bg-[#002147] text-white flex items-center justify-center">
                <span className="material-symbols-outlined text-[20px]">psychology</span>
              </span>
              <h1 className="text-2xl md:text-3xl font-extrabold text-primary tracking-tight font-sans">
                {concept.name}
              </h1>
              {concept.cefr && (
                <span className="px-2.5 py-0.5 rounded text-xs font-mono font-bold bg-amber-100 text-amber-900 border border-amber-300">
                  CEFR {concept.cefr}
                </span>
              )}
              {concept.priority && (
                <span className="px-2 py-0.5 rounded text-xs font-mono bg-blue-100 text-blue-900 border border-blue-200">
                  Priority {concept.priority}
                </span>
              )}
            </div>

            {concept.description && (
              <p className="text-base text-on-surface leading-relaxed max-w-3xl">
                {concept.description}
              </p>
            )}

            {/* Aliases & Tags */}
            <div className="flex flex-wrap items-center gap-2 pt-1 text-xs font-mono text-on-surface-variant">
              {concept.aliases && concept.aliases.length > 0 && (
                <div className="flex items-center gap-1">
                  <span className="font-bold text-on-surface">Also known as:</span>
                  <span>{concept.aliases.join(", ")}</span>
                </div>
              )}
              {concept.tags && concept.tags.length > 0 && (
                <div className="flex items-center gap-1 ml-auto">
                  {concept.tags.map((t, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-0.5 rounded bg-surface-container-high text-on-surface"
                    >
                      #{t}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => openPeek("concept", concept.name)}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-surface-container-lowest border border-outline-variant text-xs font-mono text-primary hover:bg-[#002147] hover:text-white transition-colors shadow-xs"
            >
              <span className="material-symbols-outlined text-[16px]">visibility</span>
              <span>Quick Peek Panel</span>
            </button>
          </div>
        </div>
      </div>

      {/* METRIC STRIP */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3 text-xs font-mono">
        <div className="p-3 rounded-xl bg-surface-container-lowest border border-outline-variant">
          <span className="text-on-surface-variant block text-[10px] uppercase">Grammar Rules</span>
          <span className="text-lg font-bold text-primary">{grammarRules.length}</span>
        </div>
        <div className="p-3 rounded-xl bg-surface-container-lowest border border-outline-variant">
          <span className="text-on-surface-variant block text-[10px] uppercase">Tenses & Moods</span>
          <span className="text-lg font-bold text-primary">{tenses.length}</span>
        </div>
        <div className="p-3 rounded-xl bg-surface-container-lowest border border-outline-variant">
          <span className="text-on-surface-variant block text-[10px] uppercase">Verbs</span>
          <span className="text-lg font-bold text-primary">{verbs.length}</span>
        </div>
        <div className="p-3 rounded-xl bg-surface-container-lowest border border-outline-variant">
          <span className="text-on-surface-variant block text-[10px] uppercase">Expressions</span>
          <span className="text-lg font-bold text-primary">{expressions.length}</span>
        </div>
        <div className="p-3 rounded-xl bg-surface-container-lowest border border-outline-variant">
          <span className="text-on-surface-variant block text-[10px] uppercase">Vocabulary</span>
          <span className="text-lg font-bold text-primary">{vocabulary.length}</span>
        </div>
        <div className="p-3 rounded-xl bg-surface-container-lowest border border-outline-variant">
          <span className="text-on-surface-variant block text-[10px] uppercase">Examples</span>
          <span className="text-lg font-bold text-primary">{examples.length}</span>
        </div>
      </div>

      {/* CONNECTED GRAMMAR RULES & TENSES */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Grammar Rules */}
        <div className="p-5 md:p-6 rounded-2xl bg-surface-container-lowest border border-outline-variant space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-outline-variant">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[20px] text-primary">menu_book</span>
              <h2 className="text-base font-bold text-primary tracking-tight">Connected Grammar Rules</h2>
            </div>
            <span className="text-xs font-mono text-on-surface-variant">{grammarRules.length} rules</span>
          </div>

          {grammarRules.length > 0 ? (
            <div className="space-y-2.5">
              {grammarRules.map((rule) => (
                <div
                  key={rule.id}
                  className="p-3 rounded-xl bg-surface-container-low border border-outline-variant/40 flex items-start justify-between gap-3 group"
                >
                  <div className="space-y-1">
                    <Link
                      href={`/grammar/${encodeURIComponent(rule.title)}`}
                      className="font-bold text-sm text-primary group-hover:underline"
                    >
                      {rule.title}
                    </Link>
                    <p className="text-xs text-on-surface-variant line-clamp-2">
                      {rule.summary || rule.explanation}
                    </p>
                  </div>
                  <button
                    onClick={() => openPeek("grammar", rule.title)}
                    className="px-2 py-1 rounded text-xs font-mono text-primary bg-surface-container hover:bg-[#002147] hover:text-white transition-colors shrink-0"
                  >
                    Peek →
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-on-surface-variant italic py-6 text-center">
              No directly connected grammar rules recorded.
            </p>
          )}
        </div>

        {/* Tenses & Verbs */}
        <div className="space-y-6">
          {/* Tenses */}
          {tenses.length > 0 && (
            <div className="p-5 rounded-2xl bg-surface-container-lowest border border-outline-variant space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-outline-variant">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[20px] text-primary">history_toggle_off</span>
                  <h2 className="text-sm font-bold text-primary uppercase font-mono">Tenses & Moods</h2>
                </div>
                <span className="text-xs font-mono text-on-surface-variant">{tenses.length}</span>
              </div>
              <div className="space-y-2">
                {tenses.map((t) => (
                  <div
                    key={t.id}
                    className="p-2.5 rounded-lg bg-surface-container-low border border-outline-variant/40 flex items-center justify-between"
                  >
                    <div>
                      <Link
                        href={`/tenses/${encodeURIComponent(t.name_fr)}`}
                        className="font-bold text-sm text-primary hover:underline"
                      >
                        {t.name_fr}
                      </Link>
                      <span className="text-xs text-on-surface-variant block font-serif italic">
                        {t.name_en || t.mood}
                      </span>
                    </div>
                    <button
                      onClick={() => openPeek("tense", t.name_fr)}
                      className="px-2 py-1 rounded text-xs font-mono text-primary bg-surface-container hover:bg-[#002147] hover:text-white transition-colors"
                    >
                      Peek →
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Verbs */}
          <div className="p-5 rounded-2xl bg-surface-container-lowest border border-outline-variant space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-outline-variant">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[20px] text-primary">translate</span>
                <h2 className="text-sm font-bold text-primary uppercase font-mono">Key Verbs</h2>
              </div>
              <span className="text-xs font-mono text-on-surface-variant">{verbs.length} verbs</span>
            </div>
            {verbs.length > 0 ? (
              <div className="grid grid-cols-2 gap-2">
                {verbs.map((v) => (
                  <div
                    key={v.id}
                    className="p-2 rounded-lg bg-surface-container-low border border-outline-variant/40 flex items-center justify-between group"
                  >
                    <Link
                      href={`/verbs/${encodeURIComponent(v.lemma)}`}
                      className="font-bold text-xs text-primary group-hover:underline truncate"
                    >
                      {v.lemma}
                    </Link>
                    <button
                      onClick={() => openPeek("verb", v.lemma)}
                      className="text-[10px] font-mono text-on-surface-variant hover:text-primary shrink-0"
                    >
                      Peek
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-on-surface-variant italic py-3 text-center">
                No specific verbs linked.
              </p>
            )}
          </div>
        </div>
      </div>

      {/* CONNECTED EXPRESSIONS & VOCABULARY */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Expressions */}
        <div className="p-5 rounded-2xl bg-surface-container-lowest border border-outline-variant space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-outline-variant">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[20px] text-primary">chat_bubble</span>
              <h2 className="text-sm font-bold text-primary uppercase font-mono">Idioms & Expressions</h2>
            </div>
            <span className="text-xs font-mono text-on-surface-variant">{expressions.length}</span>
          </div>
          {expressions.length > 0 ? (
            <div className="space-y-2">
              {expressions.map((e) => (
                <div
                  key={e.id}
                  className="p-2.5 rounded-lg bg-surface-container-low border border-outline-variant/40 flex items-center justify-between group"
                >
                  <div className="truncate mr-2">
                    <Link
                      href={`/expressions/${encodeURIComponent(e.french)}`}
                      className="font-bold text-xs text-primary group-hover:underline block truncate"
                    >
                      {e.french}
                    </Link>
                    <span className="text-[11px] text-on-surface-variant block truncate">{e.english}</span>
                  </div>
                  <button
                    onClick={() => openPeek("expression", e.french)}
                    className="px-2 py-1 rounded text-xs font-mono text-primary bg-surface-container hover:bg-[#002147] hover:text-white transition-colors shrink-0"
                  >
                    Peek →
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-on-surface-variant italic py-4 text-center">
              No expressions linked.
            </p>
          )}
        </div>

        {/* Vocabulary */}
        <div className="p-5 rounded-2xl bg-surface-container-lowest border border-outline-variant space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-outline-variant">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[20px] text-primary">dictionary</span>
              <h2 className="text-sm font-bold text-primary uppercase font-mono">Vocabulary</h2>
            </div>
            <span className="text-xs font-mono text-on-surface-variant">{vocabulary.length}</span>
          </div>
          {vocabulary.length > 0 ? (
            <div className="flex flex-wrap gap-1.5">
              {vocabulary.map((vc) => (
                <div
                  key={vc.id}
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-surface-container-low border border-outline-variant/40 text-xs font-mono group"
                >
                  <Link
                    href={`/vocabulary/${encodeURIComponent(vc.french)}`}
                    className="font-bold text-primary group-hover:underline"
                  >
                    {vc.french}
                  </Link>
                  <button
                    onClick={() => openPeek("vocab", vc.french)}
                    className="text-[10px] text-on-surface-variant hover:text-primary"
                    title="Peek"
                  >
                    👁
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-on-surface-variant italic py-4 text-center">
              No vocabulary terms linked.
            </p>
          )}
        </div>
      </div>

      {/* EXAMPLES IN CONTEXT */}
      {examples.length > 0 && (
        <div className="p-5 md:p-6 rounded-2xl bg-surface-container-lowest border border-outline-variant space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-outline-variant">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[20px] text-primary">format_quote</span>
              <h2 className="text-base font-bold text-primary tracking-tight">Example Sentences</h2>
            </div>
            <span className="text-xs font-mono text-on-surface-variant">{examples.length} sentences</span>
          </div>
          <div className="space-y-3">
            {examples.map((ex) => (
              <div
                key={ex.id}
                className="p-4 rounded-xl bg-surface-container-low border border-outline-variant/50 space-y-1"
              >
                <p className="font-serif text-base text-primary font-medium">{ex.french}</p>
                <p className="text-sm text-on-surface-variant">{ex.english}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TEXTBOOK CHAPTERS */}
      {concept.raw_chapters && concept.raw_chapters.length > 0 && (
        <div className="p-5 rounded-2xl bg-surface-container-low border border-outline-variant flex flex-wrap items-center justify-between gap-3">
          <div className="space-y-0.5">
            <span className="text-xs font-mono font-bold uppercase text-on-surface-variant">
              Textbook References
            </span>
            <p className="text-sm text-primary font-medium">
              Concept discussed in chapters:
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            {concept.raw_chapters.map((ch) => (
              <Link
                key={ch}
                href={`/chapters/${ch}`}
                className="px-3 py-1.5 rounded-lg bg-surface-container-lowest border border-outline-variant text-xs font-mono font-bold text-primary hover:bg-[#002147] hover:text-white transition-colors"
              >
                Chapter {ch}
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
