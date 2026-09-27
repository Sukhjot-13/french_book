"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { VerbUI, ExpressionUI, GrammarRuleUI, ExampleUI } from "@/src/lib/data/selectors";
import { VerbConjugation } from "@/src/lib/dataset/masterSchema";
import { usePeek } from "../peek/PeekContext";
import { PronunciationButton } from "../common/PronunciationButton";

interface VerbDetailViewProps {
  verb: VerbUI;
  conjugations: VerbConjugation[];
  expressions: ExpressionUI[];
  grammarRules: GrammarRuleUI[];
  examples: ExampleUI[];
}

export function VerbDetailView({
  verb,
  conjugations,
  expressions,
  grammarRules,
  examples,
}: VerbDetailViewProps) {
  const { openPeek } = usePeek();

  // Mood selection tab: "indicatif" | "conditionnel" | "subjonctif" | "impératif"
  const moods = useMemo(() => {
    const list: string[] = [];
    conjugations.forEach((c) => {
      const m = c.mood?.toLowerCase() || "indicatif";
      if (!list.includes(m)) list.push(m);
    });
    return list.length > 0 ? list : ["indicatif"];
  }, [conjugations]);

  const [activeMood, setActiveMood] = useState<string>(moods[0] || "indicatif");

  // Filter conjugations for current mood
  const moodConjugations = useMemo(() => {
    return conjugations.filter((c) => (c.mood?.toLowerCase() || "indicatif") === activeMood);
  }, [conjugations, activeMood]);

  // Open tense accordion in current mood (default to present or first one)
  const defaultTense = useMemo(() => {
    const pres = moodConjugations.find((c) => c.tense.toLowerCase().includes("présent") || c.tense.toLowerCase().includes("present"));
    return pres ? pres.tense : moodConjugations[0]?.tense || "";
  }, [moodConjugations]);

  const [expandedTense, setExpandedTense] = useState<string>(defaultTense);

  // Reset the open tense when the mood changes. Done during render
  // (adjusting state from previous-render info) instead of in an effect,
  // so there is no cascading re-render. defaultTense is already computed
  // from the new activeMood above by the time this runs.
  const [prevMood, setPrevMood] = useState<string>(activeMood);
  if (prevMood !== activeMood) {
    setPrevMood(activeMood);
    setExpandedTense(defaultTense);
  }

  // Smart "Show More" states
  const [showAllSenses, setShowAllSenses] = useState(false);
  const [showAllExpressions, setShowAllExpressions] = useState(false);
  const [showAllExamples, setShowAllExamples] = useState(false);

  const visibleSenses = showAllSenses ? verb.senses : (verb.senses || []).slice(0, 3);
  const visibleExpressions = showAllExpressions ? expressions : expressions.slice(0, 5);
  const visibleExamples = showAllExamples ? examples : examples.slice(0, 3);

  const formatGroupName = (g: string) => {
    if (g === "1st_group") return "1er groupe (-er)";
    if (g === "2nd_group") return "2e groupe (-ir)";
    if (g === "3rd_group") return "3e groupe (-re/-oir)";
    return g;
  };

  return (
    <div className="space-y-6">
      {/* STICKY LOCAL SUBNAV */}
      <nav className="sticky top-2 z-20 px-3 py-2 rounded-xl bg-surface-container-low/95 backdrop-blur-md border border-outline-variant/80 shadow-xs flex flex-wrap items-center justify-between gap-2 text-xs font-mono">
        <div className="flex items-center gap-1.5 overflow-x-auto">
          <a href="#overview" className="px-2.5 py-1 rounded-lg hover:bg-surface-container hover:text-primary transition-colors text-on-surface-variant font-medium">
            Overview
          </a>
          <a href="#conjugations" className="px-2.5 py-1 rounded-lg hover:bg-surface-container hover:text-primary transition-colors text-on-surface-variant font-medium">
            Conjugations
          </a>
          {expressions.length > 0 && (
            <a href="#expressions" className="px-2.5 py-1 rounded-lg hover:bg-surface-container hover:text-primary transition-colors text-on-surface-variant font-medium">
              Expressions ({expressions.length})
            </a>
          )}
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
            href={`/examples?verb=${encodeURIComponent(verb.lemma)}`}
            className="text-[11px] font-semibold text-primary hover:underline inline-flex items-center gap-1"
          >
            <span>All Examples</span>
            <span className="material-symbols-outlined text-[13px]">arrow_forward</span>
          </Link>
        </div>
      </nav>

      {/* VERB HERO HEADER */}
      <div id="overview" className="p-5 md:p-6 rounded-xl bg-surface-container-low border border-outline-variant space-y-4 shadow-xs">
        {/* Top title and clean text strip (No badge overload) */}
        <div className="flex flex-col md:flex-row md:items-baseline justify-between gap-2 border-b border-outline-variant/40 pb-3">
          <div className="flex items-baseline gap-3">
            <h1 className="text-3xl md:text-4xl font-bold font-sans text-primary tracking-tight">
              {verb.lemma}
            </h1>
            <PronunciationButton text={verb.lemma} />
            {verb.pronominal && (
              <span className="text-xs font-mono font-medium text-purple-800 bg-purple-100/80 px-2 py-0.5 rounded border border-purple-200">
                pronominal (se {verb.lemma})
              </span>
            )}
          </div>
          <div className="text-xs font-mono text-on-surface-variant flex items-center gap-2">
            <span>{formatGroupName(verb.group)}</span>
            <span>·</span>
            <span className={verb.regularity === "irregular" ? "text-amber-800 font-semibold" : ""}>
              {verb.regularity}
            </span>
            <span>·</span>
            <span>aux: <Link href={`/verbs?auxiliary=${encodeURIComponent(verb.auxiliary)}`} className="underline hover:text-primary font-bold text-primary">{verb.auxiliary}</Link></span>
            {verb.cefr && (
              <>
                <span>·</span>
                <span className="font-bold text-primary">{verb.cefr}</span>
              </>
            )}
          </div>
        </div>

        {/* Primary English Meaning */}
        <div>
          <p className="text-lg md:text-xl text-secondary font-serif italic">
            {verb.english || "No direct translation recorded"}
          </p>
        </div>

        {/* Compact Key Facts Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1 text-xs font-mono">
          <div className="p-2.5 rounded bg-surface-container-lowest border border-outline-variant/40">
            <span className="text-on-surface-variant text-[10px] uppercase block">Participe Passé</span>
            <span className="font-bold text-primary text-sm">{verb.past_participle || "—"}</span>
          </div>
          <div className="p-2.5 rounded bg-surface-container-lowest border border-outline-variant/40">
            <span className="text-on-surface-variant text-[10px] uppercase block">Participe Présent</span>
            <span className="font-bold text-primary text-sm">{verb.present_participle || "—"}</span>
          </div>
          <div className="p-2.5 rounded bg-surface-container-lowest border border-outline-variant/40">
            <span className="text-on-surface-variant text-[10px] uppercase block">Transitivity</span>
            <span className="font-bold text-primary text-sm capitalize">{verb.transitivity || "—"}</span>
          </div>
          <div className="p-2.5 rounded bg-surface-container-lowest border border-outline-variant/40">
            <span className="text-on-surface-variant text-[10px] uppercase block">Chapter Links</span>
            <span className="font-bold text-primary text-sm">
              {verb.raw_chapters?.length ? `Ch ${verb.raw_chapters.join(", ")}` : "—"}
            </span>
          </div>
        </div>

        {/* Senses with Smart "Show More" */}
        {verb.senses && verb.senses.length > 0 && (
          <div className="pt-2 border-t border-outline-variant/40 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-mono uppercase font-bold text-on-surface-variant">
                Semantic Senses ({verb.senses.length})
              </span>
              {verb.senses.length > 3 && (
                <button
                  type="button"
                  onClick={() => setShowAllSenses(!showAllSenses)}
                  className="text-xs font-mono text-primary hover:underline"
                >
                  {showAllSenses ? "Show fewer senses" : `Show ${verb.senses.length - 3} more meanings`}
                </button>
              )}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs">
              {visibleSenses.map((sense, idx) => (
                <div
                  key={idx}
                  className="p-2.5 rounded-lg bg-surface-container-lowest border border-outline-variant/40"
                >
                  <div className="font-semibold text-primary">
                    {idx + 1}. {sense.english_gloss || sense.meaning}
                  </div>
                  {sense.context && (
                    <div className="text-on-surface-variant text-[11px] italic mt-0.5">
                      Context: {sense.context}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Usage notes if any */}
        {verb.usage_notes && verb.usage_notes.length > 0 && (
          <div className="pt-2 border-t border-outline-variant/40 text-xs space-y-1">
            <span className="text-[11px] font-mono uppercase font-bold text-on-surface-variant block">
              Usage Notes
            </span>
            {verb.usage_notes.slice(0, 2).map((note, i) => (
              <p key={i} className="text-on-surface-variant leading-relaxed">
                • {note}
              </p>
            ))}
          </div>
        )}
      </div>

      {/* SYSTEMATIC CONJUGATION SELECTOR (Mood tabs + Accordion tenses) */}
      <div id="conjugations" className="space-y-3 p-5 rounded-xl bg-surface-container-lowest border border-outline-variant shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-outline-variant/50 pb-3">
          <div>
            <h2 className="text-lg font-bold text-primary flex items-center gap-2">
              <span className="material-symbols-outlined text-primary text-[20px]">
                history_toggle_off
              </span>
              <span>Conjugation Selector</span>
            </h2>
            <p className="text-xs text-on-surface-variant">
              Select a mood, then click any tense to expand its full inflection matrix.
            </p>
          </div>

          {/* Mood Tabs */}
          <div className="flex items-center gap-1 p-1 rounded-lg bg-surface-container-low border border-outline-variant/50 self-start">
            {moods.map((m) => (
              <button
                key={m}
                onClick={() => setActiveMood(m)}
                className={`px-3 py-1 rounded text-xs font-mono capitalize transition-all ${
                  activeMood === m
                    ? "bg-primary text-white font-bold shadow-xs"
                    : "text-on-surface-variant hover:text-primary hover:bg-surface-container"
                }`}
              >
                {m}
              </button>
            ))}
          </div>
        </div>

        {/* Accordion list for the selected mood */}
        {moodConjugations.length > 0 ? (
          <div className="divide-y divide-outline-variant/40 rounded-lg border border-outline-variant/50 overflow-hidden">
            {moodConjugations.map((conj) => {
              const isExpanded = expandedTense === conj.tense;
              return (
                <div key={conj.tense} className="bg-surface-container-lowest transition-colors">
                  {/* Accordion header */}
                  <div
                    role="button"
                    tabIndex={0}
                    onClick={() => setExpandedTense(isExpanded ? "" : conj.tense)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        setExpandedTense(isExpanded ? "" : conj.tense);
                      }
                    }}
                    className="w-full p-3 flex items-center justify-between text-left hover:bg-surface-container-low transition-colors cursor-pointer select-none"
                  >
                    <div className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-[18px] text-primary transition-transform duration-150">
                        {isExpanded ? "expand_more" : "chevron_right"}
                      </span>
                      <span className="font-bold text-sm text-primary capitalize font-sans">
                        {conj.tense}
                      </span>
                      {conj.formation_note && (
                        <span className="hidden sm:inline-block text-[11px] font-mono text-on-surface-variant/80 truncate max-w-md">
                          ({conj.formation_note})
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          openPeek("tense", conj.tense);
                        }}
                        className="text-[11px] font-mono text-primary hover:underline px-2 py-0.5 rounded bg-surface-container"
                      >
                        Peek Tense
                      </button>
                      <span className="text-xs font-mono text-on-surface-variant">
                        {isExpanded ? "Collapse" : "Open"}
                      </span>
                    </div>
                  </div>

                  {/* Accordion expanded body: Clean dense 6-form grid */}
                  {isExpanded && (
                    <div className="p-4 bg-surface-container-low/40 border-t border-outline-variant/30 space-y-3 animate-in fade-in duration-150">
                      {conj.formation_note && (
                        <p className="text-xs font-serif italic text-on-surface-variant">
                          Rule: {conj.formation_note}
                        </p>
                      )}

                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 text-xs font-mono">
                        {conj.forms?.je && (
                          <div className="p-2 rounded bg-surface-container-lowest border border-outline-variant/40 flex justify-between">
                            <span className="text-on-surface-variant">je / j&apos;</span>
                            <span className="font-bold text-primary">{conj.forms.je}</span>
                          </div>
                        )}
                        {conj.forms?.tu && (
                          <div className="p-2 rounded bg-surface-container-lowest border border-outline-variant/40 flex justify-between">
                            <span className="text-on-surface-variant">tu</span>
                            <span className="font-bold text-primary">{conj.forms.tu}</span>
                          </div>
                        )}
                        {conj.forms?.il_elle_on && (
                          <div className="p-2 rounded bg-surface-container-lowest border border-outline-variant/40 flex justify-between">
                            <span className="text-on-surface-variant">il / elle / on</span>
                            <span className="font-bold text-primary">{conj.forms.il_elle_on}</span>
                          </div>
                        )}
                        {conj.forms?.nous && (
                          <div className="p-2 rounded bg-surface-container-lowest border border-outline-variant/40 flex justify-between">
                            <span className="text-on-surface-variant">nous</span>
                            <span className="font-bold text-primary">{conj.forms.nous}</span>
                          </div>
                        )}
                        {conj.forms?.vous && (
                          <div className="p-2 rounded bg-surface-container-lowest border border-outline-variant/40 flex justify-between">
                            <span className="text-on-surface-variant">vous</span>
                            <span className="font-bold text-primary">{conj.forms.vous}</span>
                          </div>
                        )}
                        {conj.forms?.ils_elles && (
                          <div className="p-2 rounded bg-surface-container-lowest border border-outline-variant/40 flex justify-between">
                            <span className="text-on-surface-variant">ils / elles</span>
                            <span className="font-bold text-primary">{conj.forms.ils_elles}</span>
                          </div>
                        )}
                      </div>

                      <div className="text-right">
                        <Link
                          href={`/tenses/${encodeURIComponent(conj.tense)}`}
                          className="text-xs font-mono text-primary hover:underline inline-flex items-center gap-1"
                        >
                          <span>Open complete {conj.tense} study guide</span>
                          <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
                        </Link>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          <div className="p-6 text-center text-xs text-on-surface-variant italic">
            No conjugations recorded for mood: {activeMood}.
          </div>
        )}
      </div>

      {/* GROUPED RELATIONSHIPS: CONSTRUCTIONS & GOVERNED GRAMMAR RULES */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Constructions & Collocations */}
        <div id="expressions" className="p-5 rounded-xl bg-surface-container-lowest border border-outline-variant space-y-3 shadow-xs">
          <div className="flex items-center justify-between border-b border-outline-variant/50 pb-2">
            <div>
              <h2 className="text-base font-bold text-primary flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-[18px]">chat_bubble</span>
                <span>Constructions & Expressions</span>
              </h2>
              <span className="text-[11px] font-mono text-on-surface-variant">
                {expressions.length} associated expressions
              </span>
            </div>
            {expressions.length > 5 && (
              <button
                type="button"
                onClick={() => setShowAllExpressions(!showAllExpressions)}
                className="text-xs font-mono text-primary hover:underline"
              >
                {showAllExpressions ? "Show fewer" : `Show ${expressions.length - 5} more`}
              </button>
            )}
          </div>

          {visibleExpressions.length > 0 ? (
            <div className="space-y-2">
              {visibleExpressions.map((exp) => (
                <div
                  key={exp.id}
                  className="p-2.5 rounded-lg bg-surface-container-low/50 border border-outline-variant/40 flex items-start justify-between gap-2 text-xs"
                >
                  <div className="space-y-0.5">
                    <Link
                      href={`/expressions/${encodeURIComponent(exp.french)}`}
                      className="font-bold text-primary hover:underline"
                    >
                      {exp.french}
                    </Link>
                    <p className="text-on-surface-variant text-[11px]">{exp.english}</p>
                    {exp.pattern && (
                      <span className="inline-block text-[10px] font-mono text-blue-900 bg-blue-50 px-1.5 py-0.2 rounded border border-blue-200">
                        {exp.pattern}
                      </span>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={() => openPeek("expression", exp.french)}
                    className="text-[11px] font-mono text-primary hover:underline px-2 py-0.5 rounded bg-surface-container"
                  >
                    Peek
                  </button>
                </div>
              ))}

              {expressions.length > 0 && (
                <div className="pt-2 border-t border-outline-variant/40">
                  <Link
                    href={`/expressions?baseVerb=${encodeURIComponent(verb.lemma)}`}
                    className="text-xs font-mono font-semibold text-primary hover:underline inline-flex items-center gap-1"
                  >
                    <span>View all {expressions.length} expressions with {verb.lemma}</span>
                    <span className="material-symbols-outlined text-[13px]">arrow_forward</span>
                  </Link>
                </div>
              )}
            </div>
          ) : (
            <p className="text-xs text-on-surface-variant italic py-4">
              No standalone idiomatic expressions directly linked to this verb lemma.
            </p>
          )}
        </div>

        {/* Governed Grammar Rules */}
        <div id="grammar" className="p-5 rounded-xl bg-surface-container-lowest border border-outline-variant space-y-3 shadow-xs">
          <div className="flex items-center justify-between border-b border-outline-variant/50 pb-2">
            <div>
              <h2 className="text-base font-bold text-primary flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-[18px]">menu_book</span>
                <span>Governed Grammar Rules</span>
              </h2>
              <span className="text-[11px] font-mono text-on-surface-variant">
                {grammarRules.length} rules
              </span>
            </div>
          </div>

          {grammarRules.length > 0 ? (
            <div className="space-y-2">
              {grammarRules.slice(0, 5).map((rule) => (
                <div
                  key={rule.id}
                  className="p-2.5 rounded-lg bg-surface-container-low/50 border border-outline-variant/40 flex items-start justify-between gap-2 text-xs"
                >
                  <div className="space-y-0.5">
                    <Link
                      href={`/grammar/${encodeURIComponent(rule.title)}`}
                      className="font-bold text-primary hover:underline"
                    >
                      {rule.title}
                    </Link>
                    {rule.summary && (
                      <p className="text-on-surface-variant text-[11px] line-clamp-2">
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
          ) : (
            <p className="text-xs text-on-surface-variant italic py-4">
              No grammar rules directly keyed to this verb.
            </p>
          )}
        </div>
      </div>

      {/* CONTEXTUAL EXAMPLES WITH SMART SHOW MORE */}
      {examples.length > 0 && (
        <div id="examples" className="p-5 rounded-xl bg-surface-container-lowest border border-outline-variant space-y-3 shadow-xs">
          <div className="flex items-center justify-between border-b border-outline-variant/50 pb-2">
            <div>
              <h2 className="text-base font-bold text-primary flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-[18px]">format_quote</span>
                <span>Sentence Examples in Context</span>
              </h2>
              <span className="text-[11px] font-mono text-on-surface-variant">
                {examples.length} examples
              </span>
            </div>
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
                <p className="text-sm text-primary font-serif font-medium">
                  {ex.french}
                </p>
                <p className="text-xs text-on-surface-variant font-sans">
                  {ex.english}
                </p>
              </div>
            ))}
          </div>

          <div className="pt-2 border-t border-outline-variant/40 flex items-center justify-between">
            <Link
              href={`/examples?verb=${encodeURIComponent(verb.lemma)}`}
              className="text-xs font-mono font-semibold text-primary hover:underline inline-flex items-center gap-1"
            >
              <span>View all examples for {verb.lemma} in Example Explorer</span>
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
            <div className="text-xs font-bold text-emerald-950">Test Your Mastery</div>
            <div className="text-[11px] text-emerald-900/80">Drill conjugations, grammar constructions, and fill-in-the-blanks.</div>
          </div>
        </div>
        <Link
          href={`/exercises?search=${encodeURIComponent(verb.lemma)}`}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-700 text-white text-xs font-mono font-medium hover:bg-emerald-800 transition-colors self-start sm:self-auto"
        >
          <span>Practice Exercises</span>
          <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
        </Link>
      </div>

      {/* DEMOTED SOURCES & TECHNICAL METADATA (Point 9) */}
      <details className="p-3.5 rounded-lg bg-surface-container-low border border-outline-variant/60 text-xs font-mono group">
        <summary className="cursor-pointer text-on-surface-variant font-semibold select-none flex items-center justify-between">
          <span className="flex items-center gap-1.5">
            <span className="material-symbols-outlined text-[16px]">info</span>
            <span>Source Attestations & Technical Metadata</span>
          </span>
          <span className="text-[11px] text-on-surface-variant group-open:rotate-180 transition-transform">
            ▼
          </span>
        </summary>
        <div className="pt-3 border-t border-outline-variant/40 mt-2 space-y-2 text-[11px] text-on-surface-variant">
          <div>
            <span className="font-bold text-on-surface">Verb ID:</span> {verb.id}
          </div>
          {verb.raw_chapters && verb.raw_chapters.length > 0 && (
            <div className="flex flex-wrap items-center gap-1.5 pt-1">
              <span className="font-bold text-on-surface">Book Chapters:</span>
              {verb.raw_chapters.map((ch) => (
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
