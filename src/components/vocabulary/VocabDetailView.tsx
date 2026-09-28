"use client";

import React from "react";
import Link from "next/link";
import { VocabUI, ExpressionUI, ExampleUI, VerbUI, ChapterUI } from "@/src/lib/data/selectors";
import { usePeek } from "@/src/components/peek/PeekContext";
import { PronunciationButton } from "@/src/components/common/PronunciationButton";

interface VocabDetailViewProps {
  vocab: VocabUI;
  expressions: ExpressionUI[];
  examples: ExampleUI[];
  relatedVerbs: VerbUI[];
  relatedChapters: ChapterUI[];
}

export function VocabDetailView({
  vocab,
  expressions,
  examples,
  relatedVerbs,
  relatedChapters,
}: VocabDetailViewProps) {
  const { openPeek } = usePeek();

  return (
    <div className="space-y-6">
      {/* HERO / IDENTITY HEADER CARD */}
      <div className="p-6 md:p-8 rounded-2xl bg-surface-container-low border border-outline-variant shadow-xs">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
          <div className="space-y-2">
            <div className="flex flex-wrap items-baseline gap-3">
              {vocab.article && (
                <span className="text-2xl md:text-3xl font-serif text-secondary font-medium">
                  {vocab.article}
                </span>
              )}
              <h1 className="text-3xl md:text-4xl font-extrabold text-primary tracking-tight font-serif">
                {vocab.display_form || vocab.french}
              </h1>
              <PronunciationButton text={vocab.display_form || vocab.french} />
              {vocab.plural_form && (
                <span className="text-sm font-mono text-on-surface-variant/80">
                  (pl. <span className="font-semibold text-primary">{vocab.plural_form}</span>)
                </span>
              )}
            </div>

            <p className="text-xl md:text-2xl font-serif text-on-surface-variant font-medium">
              {vocab.english}
            </p>

            {/* Badges strip */}
            <div className="flex flex-wrap items-center gap-2 pt-2">
              <span className="px-2.5 py-1 rounded text-xs font-mono font-bold uppercase tracking-wide bg-[#002147] text-white">
                {vocab.part_of_speech}
              </span>
              {vocab.gender && (
                <span className="px-2.5 py-1 rounded text-xs font-mono font-medium bg-surface-container-high text-primary border border-outline-variant">
                  {vocab.gender === "masculine" ? "Masculine (m)" : vocab.gender === "feminine" ? "Feminine (f)" : vocab.gender}
                </span>
              )}
              {vocab.cefr && (
                <span className="px-2 py-0.5 rounded text-xs font-mono font-bold bg-amber-100 text-amber-900 border border-amber-300">
                  CEFR {vocab.cefr}
                </span>
              )}
              {vocab.register && vocab.register !== "neutral" && (
                <span className="px-2 py-0.5 rounded text-xs font-mono bg-purple-100 text-purple-900 border border-purple-200">
                  {vocab.register}
                </span>
              )}
              {vocab.priority && vocab.priority <= 2 && (
                <span className="px-2 py-0.5 rounded text-xs font-mono bg-emerald-100 text-emerald-900 border border-emerald-300 font-semibold">
                  Core Vocabulary ★
                </span>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => openPeek("vocab", vocab.id)}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-surface-container-lowest border border-outline-variant text-xs font-mono text-primary hover:bg-[#002147] hover:text-white transition-colors shadow-xs"
            >
              <span className="material-symbols-outlined text-[16px]">visibility</span>
              <span>Quick Peek Panel</span>
            </button>
          </div>
        </div>

        {/* Linguistic Notes & Variants */}
        {vocab.variants && vocab.variants.length > 0 && (
          <div className="mt-4 pt-4 border-t border-outline-variant/60 text-xs font-mono text-on-surface-variant flex items-center gap-2">
            <span className="font-bold text-on-surface">Variants:</span>
            <span>{vocab.variants.join(", ")}</span>
          </div>
        )}
      </div>

      {/* SENSES & DEFINITIONS */}
      {vocab.senses && vocab.senses.length > 0 && (
        <div className="p-5 md:p-6 rounded-2xl bg-surface-container-lowest border border-outline-variant space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-outline-variant">
            <span className="material-symbols-outlined text-[20px] text-primary">menu_book</span>
            <h2 className="text-base font-bold text-primary tracking-tight">Senses & Meanings</h2>
          </div>
          <div className="space-y-3">
            {vocab.senses.map((sense, idx) => (
              <div
                key={idx}
                className="p-3.5 rounded-xl bg-surface-container-low border border-outline-variant/50 space-y-1.5"
              >
                <div className="flex items-center gap-2">
                  <span className="w-5 h-5 flex items-center justify-center rounded-full bg-[#002147] text-white text-[11px] font-mono font-bold">
                    {idx + 1}
                  </span>
                  <span className="font-semibold text-sm text-primary">
                    {String(sense.english_gloss || sense.meaning || "")}
                  </span>
                  {Boolean(sense.context) && (
                    <span className="text-xs font-mono text-on-surface-variant italic">
                      ({String(sense.context)})
                    </span>
                  )}
                </div>
                {Boolean(sense.french_definition) && (
                  <p className="text-xs text-on-surface-variant font-serif pl-7 italic">
                    « {String(sense.french_definition)} »
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* WORD FAMILY & RELATIONS */}
      {(vocab.word_family?.length > 0 || vocab.synonyms?.length > 0 || vocab.antonyms?.length > 0) && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {vocab.word_family && vocab.word_family.length > 0 && (
            <div className="p-4 rounded-xl bg-surface-container-lowest border border-outline-variant space-y-2">
              <span className="text-xs font-mono font-bold uppercase text-on-surface-variant block">
                Word Family
              </span>
              <div className="flex flex-wrap gap-1.5">
                {vocab.word_family.map((wf, i) => (
                  <button
                    key={i}
                    onClick={() => openPeek("vocab", wf)}
                    className="px-2 py-0.5 rounded text-xs font-mono bg-surface-container-high hover:bg-primary hover:text-white transition-colors"
                  >
                    {wf}
                  </button>
                ))}
              </div>
            </div>
          )}

          {vocab.synonyms && vocab.synonyms.length > 0 && (
            <div className="p-4 rounded-xl bg-surface-container-lowest border border-outline-variant space-y-2">
              <span className="text-xs font-mono font-bold uppercase text-on-surface-variant block">
                Synonyms
              </span>
              <div className="flex flex-wrap gap-1.5">
                {vocab.synonyms.map((syn, i) => (
                  <button
                    key={i}
                    onClick={() => openPeek("vocab", syn)}
                    className="px-2 py-0.5 rounded text-xs font-mono bg-surface-container-high hover:bg-primary hover:text-white transition-colors"
                  >
                    {syn}
                  </button>
                ))}
              </div>
            </div>
          )}

          {vocab.antonyms && vocab.antonyms.length > 0 && (
            <div className="p-4 rounded-xl bg-surface-container-lowest border border-outline-variant space-y-2">
              <span className="text-xs font-mono font-bold uppercase text-on-surface-variant block">
                Antonyms
              </span>
              <div className="flex flex-wrap gap-1.5">
                {vocab.antonyms.map((ant, i) => (
                  <button
                    key={i}
                    onClick={() => openPeek("vocab", ant)}
                    className="px-2 py-0.5 rounded text-xs font-mono bg-surface-container-high hover:bg-primary hover:text-white transition-colors"
                  >
                    {ant}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* CONNECTED VERBS & IDIOMATIC EXPRESSIONS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Related Verbs */}
        <div className="p-5 rounded-2xl bg-surface-container-lowest border border-outline-variant space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-outline-variant">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[20px] text-primary">auto_stories</span>
              <h2 className="text-sm font-bold text-primary uppercase font-mono">Related Verbs</h2>
            </div>
            <span className="text-xs font-mono text-on-surface-variant">
              {relatedVerbs.length} verbs
            </span>
          </div>

          {relatedVerbs.length > 0 ? (
            <div className="space-y-2">
              {relatedVerbs.map((v) => (
                <div
                  key={v.id}
                  className="p-2.5 rounded-lg bg-surface-container-low border border-outline-variant/40 flex items-center justify-between group"
                >
                  <div>
                    <Link
                      href={`/verbs/${encodeURIComponent(v.lemma)}`}
                      className="font-bold text-sm text-primary group-hover:underline"
                    >
                      {v.lemma}
                    </Link>
                    <span className="text-xs text-on-surface-variant block">{v.english}</span>
                  </div>
                  <button
                    onClick={() => openPeek("verb", v.lemma)}
                    className="px-2 py-1 rounded text-xs font-mono text-primary bg-surface-container hover:bg-[#002147] hover:text-white transition-colors"
                  >
                    Peek →
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-on-surface-variant italic py-4 text-center">
              No directly linked base verbs recorded.
            </p>
          )}
        </div>

        {/* Related Expressions */}
        <div className="p-5 rounded-2xl bg-surface-container-lowest border border-outline-variant space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-outline-variant">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[20px] text-primary">chat_bubble</span>
              <h2 className="text-sm font-bold text-primary uppercase font-mono">Idioms & Expressions</h2>
            </div>
            <span className="text-xs font-mono text-on-surface-variant">
              {expressions.length} expressions
            </span>
          </div>

          {expressions.length > 0 ? (
            <div className="space-y-2">
              {expressions.map((e) => (
                <div
                  key={e.id}
                  className="p-2.5 rounded-lg bg-surface-container-low border border-outline-variant/40 flex items-center justify-between group"
                >
                  <div>
                    <Link
                      href={`/expressions/${encodeURIComponent(e.french)}`}
                      className="font-bold text-sm text-primary group-hover:underline"
                    >
                      {e.french}
                    </Link>
                    <span className="text-xs text-on-surface-variant block">{e.english}</span>
                  </div>
                  <button
                    onClick={() => openPeek("expression", e.french)}
                    className="px-2 py-1 rounded text-xs font-mono text-primary bg-surface-container hover:bg-[#002147] hover:text-white transition-colors"
                  >
                    Peek →
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-on-surface-variant italic py-4 text-center">
              No directly linked expressions recorded.
            </p>
          )}
        </div>
      </div>

      {/* EXAMPLES IN CONTEXT */}
      <div className="p-5 md:p-6 rounded-2xl bg-surface-container-lowest border border-outline-variant space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-outline-variant">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[20px] text-primary">format_quote</span>
            <h2 className="text-base font-bold text-primary tracking-tight">Examples in Context</h2>
          </div>
          <span className="text-xs font-mono text-on-surface-variant">
            {examples.length} illustrative sentences
          </span>
        </div>

        {examples.length > 0 ? (
          <div className="space-y-3">
            {examples.map((ex) => (
              <div
                key={ex.id}
                className="p-4 rounded-xl bg-surface-container-low border border-outline-variant/50 space-y-1.5"
              >
                <p className="font-serif text-base text-primary font-medium">
                  {ex.french}
                </p>
                <p className="text-sm text-on-surface-variant">
                  {ex.english}
                </p>
                {ex.notes && (
                  <p className="text-xs font-mono text-on-surface-variant/80 pt-1 italic">
                    Note: {ex.notes}
                  </p>
                )}
              </div>
            ))}
          </div>
        ) : (
          <p className="text-xs text-on-surface-variant italic py-6 text-center">
            No contextual sentences recorded for this term.
          </p>
        )}
      </div>

      {/* TEXTBOOK CHAPTERS */}
      {relatedChapters.length > 0 && (
        <div className="p-5 rounded-2xl bg-surface-container-low border border-outline-variant flex flex-wrap items-center justify-between gap-3">
          <div className="space-y-0.5">
            <span className="text-xs font-mono font-bold uppercase text-on-surface-variant">
              Textbook Reference
            </span>
            <p className="text-sm text-primary font-medium">
              Studied in {relatedChapters.length} textbook chapters
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            {relatedChapters.map((ch) => (
              <Link
                key={ch.id}
                href={`/chapters/${ch.chapter_number}`}
                className="px-3 py-1.5 rounded-lg bg-surface-container-lowest border border-outline-variant text-xs font-mono font-bold text-primary hover:bg-[#002147] hover:text-white transition-colors"
              >
                Ch {ch.chapter_number}: {ch.title}
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
