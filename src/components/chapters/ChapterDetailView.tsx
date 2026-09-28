"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  ChapterUI,
  GrammarRuleUI,
  VerbUI,
  VocabUI,
  ExpressionUI,
  ExerciseUI,
  ExampleUI,
} from "@/src/lib/data/selectors";
import { usePeek } from "../peek/PeekContext";

interface ChapterDetailViewProps {
  chapter: ChapterUI;
  sections: { id?: string; title: string; summary?: string | null }[];
  grammarRules: GrammarRuleUI[];
  verbs: VerbUI[];
  vocabulary: VocabUI[];
  expressions: ExpressionUI[];
  exercises: ExerciseUI[];
  examples: ExampleUI[];
}

export function ChapterDetailView({
  chapter,
  sections,
  grammarRules,
  verbs,
  vocabulary,
  expressions,
  exercises,
  examples,
}: ChapterDetailViewProps) {
  const { openPeek } = usePeek();
  const [activeTab, setActiveTab] = useState<
    "overview" | "grammar" | "verbs" | "vocab" | "expressions" | "practice"
  >("overview");

  // Derive 1-screen Cheat Sheet items
  const keyVerbs = verbs.slice(0, 4);
  const coreRule = grammarRules[0];
  const essentialVocab = vocabulary.slice(0, 5);
  const topTrap = grammarRules.find((r) => r.common_traps && r.common_traps.length > 0)
    ?.common_traps?.[0] || "Remember to observe gender agreement with preceding direct object pronouns when using avoir.";

  return (
    <div className="space-y-6">
      {/* CHAPTER HERO HEADER */}
      <div className="p-5 md:p-6 rounded-xl bg-surface-container-low border border-outline-variant space-y-3 shadow-xs">
        <div className="flex items-center justify-between">
          <span className="text-xs font-mono font-bold uppercase text-white bg-[#002147] px-2.5 py-1 rounded">
            Chapter {chapter.chapter_number}
          </span>
          {chapter.pages?.printed_start && chapter.pages?.printed_end && (
            <span className="text-xs font-mono text-on-surface-variant">
              Book pages: {chapter.pages.printed_start} – {chapter.pages.printed_end}
            </span>
          )}
        </div>

        <h1 className="text-2xl md:text-3xl font-bold font-sans text-primary tracking-tight">
          {chapter.title}
        </h1>

        {chapter.notes && (
          <p className="text-xs md:text-sm text-on-surface-variant leading-relaxed">
            {chapter.notes}
          </p>
        )}
      </div>

      {/* POINT 5: QUICK CHEAT SHEET (1-SCREEN CAPSULE) */}
      <div className="p-5 rounded-xl bg-surface-container-lowest border border-outline-variant space-y-3 shadow-xs">
        <div className="flex items-center justify-between border-b border-outline-variant/50 pb-2">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-[20px]">bolt</span>
            <h2 className="text-sm md:text-base font-bold text-primary font-mono uppercase tracking-wider">
              Chapter {chapter.chapter_number} Quick Cheat Sheet
            </h2>
          </div>
          <span className="text-[11px] font-mono text-on-surface-variant">
            Fast revision summary
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
          {/* 1. Key Verbs */}
          <div className="p-3 rounded-lg bg-surface-container-low border border-outline-variant/50 space-y-2">
            <div className="flex items-center gap-1 font-bold font-mono text-[11px] text-primary uppercase">
              <span className="material-symbols-outlined text-[15px]">translate</span>
              <span>Key Verbs</span>
            </div>
            {keyVerbs.length > 0 ? (
              <div className="space-y-1">
                {keyVerbs.map((v) => (
                  <div key={v.id} className="flex items-center justify-between">
                    <button
                      type="button"
                      onClick={() => openPeek("verb", v.lemma)}
                      className="font-bold text-primary hover:underline font-mono text-xs"
                    >
                      {v.lemma}
                    </button>
                    <span className="text-on-surface-variant text-[11px] truncate max-w-[100px]">
                      {v.english}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-on-surface-variant italic text-[11px]">General chapter content.</p>
            )}
          </div>

          {/* 2. Core Grammar Rule */}
          <div className="p-3 rounded-lg bg-surface-container-low border border-outline-variant/50 space-y-2">
            <div className="flex items-center gap-1 font-bold font-mono text-[11px] text-primary uppercase">
              <span className="material-symbols-outlined text-[15px]">menu_book</span>
              <span>Core Rule</span>
            </div>
            {coreRule ? (
              <div className="space-y-1">
                <button
                  type="button"
                  onClick={() => openPeek("grammar", coreRule.title)}
                  className="font-bold text-primary hover:underline text-xs text-left line-clamp-1"
                >
                  {coreRule.title}
                </button>
                <p className="text-on-surface-variant text-[11px] leading-relaxed line-clamp-3">
                  {coreRule.summary || coreRule.formation || coreRule.explanation}
                </p>
              </div>
            ) : (
              <p className="text-on-surface-variant italic text-[11px]">Fundamental thematic chapter.</p>
            )}
          </div>

          {/* 3. Essential 5 Vocab Words */}
          <div className="p-3 rounded-lg bg-surface-container-low border border-outline-variant/50 space-y-2">
            <div className="flex items-center gap-1 font-bold font-mono text-[11px] text-primary uppercase">
              <span className="material-symbols-outlined text-[15px]">dictionary</span>
              <span>Essential Vocab</span>
            </div>
            {essentialVocab.length > 0 ? (
              <div className="space-y-1">
                {essentialVocab.map((voc) => (
                  <div key={voc.id} className="flex items-center justify-between">
                    <button
                      type="button"
                      onClick={() => openPeek("vocab", voc.id)}
                      className="font-semibold text-primary hover:underline text-xs truncate max-w-[90px]"
                    >
                      {voc.french}
                    </button>
                    <span className="text-on-surface-variant text-[11px] truncate max-w-[80px]">
                      {voc.english}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-on-surface-variant italic text-[11px]">Syntactic patterns focus.</p>
            )}
          </div>

          {/* 4. Top Trap */}
          <div className="p-3 rounded-lg bg-amber-500/10 border border-amber-500/30 space-y-1.5 text-amber-950">
            <div className="flex items-center gap-1 font-bold font-mono text-[11px] text-amber-900 uppercase">
              <span className="material-symbols-outlined text-[15px] text-amber-700">warning</span>
              <span>#1 Trap to Avoid</span>
            </div>
            <p className="text-[11px] text-amber-900 leading-relaxed line-clamp-4">
              {topTrap}
            </p>
          </div>
        </div>
      </div>

      {/* POINT 6: TABBED VIEW FOR CHAPTERS */}
      <div className="space-y-4">
        {/* Navigation Tabs */}
        <div className="flex items-center gap-1 border-b border-outline-variant/60 pb-1 overflow-x-auto">
          <button
            type="button"
            onClick={() => setActiveTab("overview")}
            className={`px-3.5 py-2 rounded-t-lg text-xs font-mono font-medium transition-colors flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === "overview"
                ? "bg-[#002147] text-white font-bold"
                : "text-on-surface-variant hover:text-primary hover:bg-surface-container"
            }`}
          >
            <span>Overview ({sections.length} sec)</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("grammar")}
            className={`px-3.5 py-2 rounded-t-lg text-xs font-mono font-medium transition-colors flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === "grammar"
                ? "bg-[#002147] text-white font-bold"
                : "text-on-surface-variant hover:text-primary hover:bg-surface-container"
            }`}
          >
            <span>Grammar Rules ({grammarRules.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("verbs")}
            className={`px-3.5 py-2 rounded-t-lg text-xs font-mono font-medium transition-colors flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === "verbs"
                ? "bg-[#002147] text-white font-bold"
                : "text-on-surface-variant hover:text-primary hover:bg-surface-container"
            }`}
          >
            <span>Verbs ({verbs.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("vocab")}
            className={`px-3.5 py-2 rounded-t-lg text-xs font-mono font-medium transition-colors flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === "vocab"
                ? "bg-[#002147] text-white font-bold"
                : "text-on-surface-variant hover:text-primary hover:bg-surface-container"
            }`}
          >
            <span>Vocabulary ({vocabulary.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("expressions")}
            className={`px-3.5 py-2 rounded-t-lg text-xs font-mono font-medium transition-colors flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === "expressions"
                ? "bg-[#002147] text-white font-bold"
                : "text-on-surface-variant hover:text-primary hover:bg-surface-container"
            }`}
          >
            <span>Expressions ({expressions.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("practice")}
            className={`px-3.5 py-2 rounded-t-lg text-xs font-mono font-medium transition-colors flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === "practice"
                ? "bg-[#002147] text-white font-bold"
                : "text-on-surface-variant hover:text-primary hover:bg-surface-container"
            }`}
          >
            <span>Practice & Examples ({exercises.length + examples.length})</span>
          </button>
        </div>

        {/* TAB CONTENTS */}
        {/* 1. Overview Tab */}
        {activeTab === "overview" && (
          <div className="space-y-4 animate-in fade-in duration-100">
            {sections.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {sections.map((sec, idx) => (
                  <div
                    key={sec.id ? `${sec.id}_${idx}` : `sec_${idx}`}
                    className="p-3.5 rounded-lg bg-surface-container-lowest border border-outline-variant text-xs space-y-1 shadow-xs"
                  >
                    <div className="font-bold text-primary text-sm">{sec.title}</div>
                    {sec.summary && (
                      <p className="text-on-surface-variant leading-relaxed">{sec.summary}</p>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-8 text-center text-xs text-on-surface-variant rounded-xl border border-outline-variant bg-surface-container-lowest">
                No section headers recorded for this chapter.
              </div>
            )}
          </div>
        )}

        {/* 2. Grammar Rules Tab */}
        {activeTab === "grammar" && (
          <div className="space-y-4 animate-in fade-in duration-100">
            {grammarRules.length > 0 ? (
              <div className="rounded-xl border border-outline-variant overflow-hidden bg-surface-container-lowest shadow-xs">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-surface-container border-b border-outline-variant text-[11px] font-mono uppercase text-on-surface-variant">
                      <th className="py-2.5 px-3.5">Rule Title</th>
                      <th className="py-2.5 px-3.5">Formula / Formation</th>
                      <th className="py-2.5 px-3.5">Summary</th>
                      <th className="py-2.5 px-3.5 text-right">Quick Peek</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-outline-variant/40">
                    {grammarRules.map((rule) => (
                      <tr
                        key={rule.id}
                        onClick={() => openPeek("grammar", rule.title)}
                        className="hover:bg-surface-container-low transition-colors cursor-pointer group"
                      >
                        <td className="py-2.5 px-3.5 font-bold text-primary text-sm">
                          <Link
                            href={`/grammar/${encodeURIComponent(rule.title)}`}
                            onClick={(e) => e.stopPropagation()}
                            className="hover:underline"
                          >
                            {rule.title}
                          </Link>
                        </td>
                        <td className="py-2.5 px-3.5 font-mono text-on-surface-variant">
                          {rule.formation || "—"}
                        </td>
                        <td className="py-2.5 px-3.5 text-on-surface-variant max-w-sm line-clamp-2">
                          {rule.summary || rule.explanation}
                        </td>
                        <td className="py-2.5 px-3.5 text-right">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              openPeek("grammar", rule.title);
                            }}
                            className="px-2 py-1 rounded text-[11px] font-mono text-primary bg-surface-container group-hover:bg-[#002147] group-hover:text-white transition-colors"
                          >
                            Peek →
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="p-8 text-center text-xs text-on-surface-variant rounded-xl border border-outline-variant bg-surface-container-lowest">
                No grammar rules listed for this chapter.
              </div>
            )}
          </div>
        )}

        {/* 3. Verbs Tab */}
        {activeTab === "verbs" && (
          <div className="space-y-4 animate-in fade-in duration-100">
            {verbs.length > 0 ? (
              <div className="rounded-xl border border-outline-variant overflow-hidden bg-surface-container-lowest shadow-xs">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-surface-container border-b border-outline-variant text-[11px] font-mono uppercase text-on-surface-variant">
                      <th className="py-2.5 px-3.5">Verb</th>
                      <th className="py-2.5 px-3.5">Meaning</th>
                      <th className="py-2.5 px-3.5">Auxiliary & Participle</th>
                      <th className="py-2.5 px-3.5 text-right">Quick Peek</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-outline-variant/40">
                    {verbs.map((verb) => (
                      <tr
                        key={verb.id}
                        onClick={() => openPeek("verb", verb.lemma)}
                        className="hover:bg-surface-container-low transition-colors cursor-pointer group"
                      >
                        <td className="py-2.5 px-3.5 font-bold text-primary text-sm">
                          <Link
                            href={`/verbs/${encodeURIComponent(verb.lemma)}`}
                            onClick={(e) => e.stopPropagation()}
                            className="hover:underline"
                          >
                            {verb.lemma}
                          </Link>
                        </td>
                        <td className="py-2.5 px-3.5 text-on-surface">{verb.english}</td>
                        <td className="py-2.5 px-3.5 font-mono text-on-surface-variant">
                          {verb.auxiliary} · {verb.past_participle || "—"}
                        </td>
                        <td className="py-2.5 px-3.5 text-right">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              openPeek("verb", verb.lemma);
                            }}
                            className="px-2 py-1 rounded text-[11px] font-mono text-primary bg-surface-container group-hover:bg-[#002147] group-hover:text-white transition-colors"
                          >
                            Peek →
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="p-8 text-center text-xs text-on-surface-variant rounded-xl border border-outline-variant bg-surface-container-lowest">
                No verbs specifically keyed to this chapter.
              </div>
            )}
          </div>
        )}

        {/* 4. Vocabulary Tab */}
        {activeTab === "vocab" && (
          <div className="space-y-4 animate-in fade-in duration-100">
            {vocabulary.length > 0 ? (
              <div className="rounded-xl border border-outline-variant overflow-hidden bg-surface-container-lowest shadow-xs">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-surface-container border-b border-outline-variant text-[11px] font-mono uppercase text-on-surface-variant">
                      <th className="py-2.5 px-3.5">Term</th>
                      <th className="py-2.5 px-3.5">Category</th>
                      <th className="py-2.5 px-3.5">English Meaning</th>
                      <th className="py-2.5 px-3.5 text-right">Quick Peek</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-outline-variant/40">
                    {vocabulary.map((voc) => (
                      <tr
                        key={voc.id}
                        onClick={() => openPeek("vocab", voc.id)}
                        className="hover:bg-surface-container-low transition-colors cursor-pointer group"
                      >
                        <td className="py-2.5 px-3.5 font-bold text-primary text-sm">
                          {voc.article && typeof voc.article === "string" && (
                            <span className="font-serif font-normal mr-1">{voc.article}</span>
                          )}
                          {voc.french}
                        </td>
                        <td className="py-2.5 px-3.5 font-mono text-on-surface-variant">
                          {voc.part_of_speech}
                        </td>
                        <td className="py-2.5 px-3.5 text-on-surface">{voc.english}</td>
                        <td className="py-2.5 px-3.5 text-right">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              openPeek("vocab", voc.id);
                            }}
                            className="px-2 py-1 rounded text-[11px] font-mono text-primary bg-surface-container group-hover:bg-[#002147] group-hover:text-white transition-colors"
                          >
                            Peek →
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="p-8 text-center text-xs text-on-surface-variant rounded-xl border border-outline-variant bg-surface-container-lowest">
                No vocabulary items in this chapter.
              </div>
            )}
          </div>
        )}

        {/* 5. Expressions Tab */}
        {activeTab === "expressions" && (
          <div className="space-y-4 animate-in fade-in duration-100">
            {expressions.length > 0 ? (
              <div className="rounded-xl border border-outline-variant overflow-hidden bg-surface-container-lowest shadow-xs">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-surface-container border-b border-outline-variant text-[11px] font-mono uppercase text-on-surface-variant">
                      <th className="py-2.5 px-3.5">Expression</th>
                      <th className="py-2.5 px-3.5">Syntactic Pattern</th>
                      <th className="py-2.5 px-3.5">English Meaning</th>
                      <th className="py-2.5 px-3.5 text-right">Quick Peek</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-outline-variant/40">
                    {expressions.map((exp) => (
                      <tr
                        key={exp.id}
                        onClick={() => openPeek("expression", exp.french)}
                        className="hover:bg-surface-container-low transition-colors cursor-pointer group"
                      >
                        <td className="py-2.5 px-3.5 font-bold text-primary text-sm">
                          <Link
                            href={`/expressions/${encodeURIComponent(exp.french)}`}
                            onClick={(e) => e.stopPropagation()}
                            className="hover:underline"
                          >
                            {exp.french}
                          </Link>
                        </td>
                        <td className="py-2.5 px-3.5 font-mono text-blue-900 font-semibold text-[11px]">
                          {exp.pattern || "—"}
                        </td>
                        <td className="py-2.5 px-3.5 text-on-surface">{exp.english}</td>
                        <td className="py-2.5 px-3.5 text-right">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              openPeek("expression", exp.french);
                            }}
                            className="px-2 py-1 rounded text-[11px] font-mono text-primary bg-surface-container group-hover:bg-[#002147] group-hover:text-white transition-colors"
                          >
                            Peek →
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="p-8 text-center text-xs text-on-surface-variant rounded-xl border border-outline-variant bg-surface-container-lowest">
                No expressions listed for this chapter.
              </div>
            )}
          </div>
        )}

        {/* 6. Practice & Examples Tab */}
        {activeTab === "practice" && (
          <div className="space-y-6 animate-in fade-in duration-100">
            {/* Exercises */}
            {exercises.length > 0 && (
              <div className="p-5 rounded-xl bg-surface-container-lowest border border-outline-variant space-y-3 shadow-xs">
                <h3 className="text-base font-bold text-primary flex items-center gap-2 border-b border-outline-variant/50 pb-2">
                  <span className="material-symbols-outlined text-primary text-[18px]">quiz</span>
                  <span>Practice Exercises ({exercises.length})</span>
                </h3>
                <div className="space-y-3">
                  {exercises.map((ex, idx) => (
                    <div
                      key={ex.id ? `${ex.id}_${idx}` : `exercise_${idx}`}
                      className="p-3.5 rounded-lg bg-surface-container-low border border-outline-variant/50 space-y-2 text-xs"
                    >
                      <div className="font-bold text-primary">
                        {idx + 1}. {ex.instructions || ex.title}
                      </div>
                      {ex.questions && ex.questions.length > 0 && (
                        <div className="space-y-1.5 pt-1">
                          {ex.questions.map((item, iIdx) => (
                            <div key={`q_${idx}_${iIdx}`} className="p-2 rounded bg-surface-container-lowest border border-outline-variant/30 space-y-1">
                              <p className="font-serif text-primary">{item.prompt}</p>
                              {item.correct_answer && (
                                <details className="text-[11px] font-mono text-on-surface-variant cursor-pointer">
                                  <summary className="hover:text-primary">Reveal Answer</summary>
                                  <p className="font-bold text-emerald-800 pt-1">
                                    {Array.isArray(item.correct_answer)
                                      ? item.correct_answer.join(", ")
                                      : item.correct_answer}
                                  </p>
                                </details>
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Contextual Examples */}
            {examples.length > 0 && (
              <div className="p-5 rounded-xl bg-surface-container-lowest border border-outline-variant space-y-3 shadow-xs">
                <h3 className="text-base font-bold text-primary flex items-center gap-2 border-b border-outline-variant/50 pb-2">
                  <span className="material-symbols-outlined text-primary text-[18px]">format_quote</span>
                  <span>Contextual Sentence Examples ({examples.length})</span>
                </h3>
                <div className="divide-y divide-outline-variant/30">
                  {examples.map((ex, idx) => (
                    <div key={ex.id ? `${ex.id}_${idx}` : `example_${idx}`} className="py-2.5 space-y-0.5">
                      <p className="text-sm text-primary font-serif font-medium">{ex.french}</p>
                      <p className="text-xs text-on-surface-variant font-sans">{ex.english}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
