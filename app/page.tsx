import React from "react";
import Link from "next/link";
import { getHomeStats, getVerbs, getExceptionsAndTraps } from "@/src/lib/data/selectors";
import { PriorityBadge, GroupBadge, AuxiliaryBadge, RegularityBadge } from "@/src/components/ui/Badges";

export default async function HomePage() {
  const stats = getHomeStats();
  const topVerbs = getVerbs({ limit: 6 }).verbs;
  const topTraps = getExceptionsAndTraps({ limit: 4 }).traps;

  return (
    <div className="space-y-8 pb-12">
      {/* HERO / WELCOME BANNER */}
      <div className="bg-[#002147] text-white p-6 md:p-8 rounded-xl border border-blue-900 shadow-sm relative overflow-hidden">
        <div className="relative z-10 max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-white/15 text-blue-100 text-xs font-mono">
            <span className="material-symbols-outlined text-[14px]">auto_stories</span>
            <span>{stats.bookTitle} — {stats.author}</span>
          </div>
          <h1 className="text-2xl md:text-4xl font-bold tracking-tight font-sans text-white">
            L&apos;Atlas & Portail de Révision
          </h1>
          <p className="text-blue-200 text-sm md:text-base leading-relaxed">
            The complete master pedagogical French revision system with bidirectional cross-linking across
            verbs, full conjugation matrices, grammar rules, exercises, expressions, and common traps.
          </p>
        </div>

        <div className="absolute right-0 bottom-0 opacity-10 pointer-events-none translate-x-8 translate-y-8">
          <span className="material-symbols-outlined text-[200px]">menu_book</span>
        </div>
      </div>

      {/* MASTER DATA METRIC STATS STRIP */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        <Link
          href="/verbs"
          className="p-4 rounded-lg bg-surface-container-low border border-outline-variant/60 hover:border-primary transition-all group block"
        >
          <div className="flex items-center justify-between text-on-surface-variant mb-1">
            <span className="text-xs font-mono uppercase tracking-wider">Verbs</span>
            <span className="material-symbols-outlined text-[18px] text-primary group-hover:scale-110 transition-transform">translate</span>
          </div>
          <div className="text-2xl font-bold font-mono text-primary">{stats.totalVerbs}</div>
          <p className="text-[11px] text-on-surface-variant mt-1">Full conjugation matrices</p>
        </Link>

        <Link
          href="/grammar"
          className="p-4 rounded-lg bg-surface-container-low border border-outline-variant/60 hover:border-primary transition-all group block"
        >
          <div className="flex items-center justify-between text-on-surface-variant mb-1">
            <span className="text-xs font-mono uppercase tracking-wider">Grammar Rules</span>
            <span className="material-symbols-outlined text-[18px] text-primary group-hover:scale-110 transition-transform">menu_book</span>
          </div>
          <div className="text-2xl font-bold font-mono text-primary">{stats.totalRules}</div>
          <p className="text-[11px] text-on-surface-variant mt-1">Formulas & exceptions</p>
        </Link>

        <Link
          href="/tenses"
          className="p-4 rounded-lg bg-surface-container-low border border-outline-variant/60 hover:border-primary transition-all group block"
        >
          <div className="flex items-center justify-between text-on-surface-variant mb-1">
            <span className="text-xs font-mono uppercase tracking-wider">Tenses & Moods</span>
            <span className="material-symbols-outlined text-[18px] text-primary group-hover:scale-110 transition-transform">history_toggle_off</span>
          </div>
          <div className="text-2xl font-bold font-mono text-primary">{stats.totalTenses}</div>
          <p className="text-[11px] text-on-surface-variant mt-1">4 distinct moods</p>
        </Link>

        <Link
          href="/expressions"
          className="p-4 rounded-lg bg-surface-container-low border border-outline-variant/60 hover:border-primary transition-all group block"
        >
          <div className="flex items-center justify-between text-on-surface-variant mb-1">
            <span className="text-xs font-mono uppercase tracking-wider">Expressions</span>
            <span className="material-symbols-outlined text-[18px] text-primary group-hover:scale-110 transition-transform">chat_bubble</span>
          </div>
          <div className="text-2xl font-bold font-mono text-primary">{stats.totalExpressions}</div>
          <p className="text-[11px] text-on-surface-variant mt-1">Idioms & pattern slots</p>
        </Link>

        <Link
          href="/vocabulary"
          className="p-4 rounded-lg bg-surface-container-low border border-outline-variant/60 hover:border-primary transition-all group block"
        >
          <div className="flex items-center justify-between text-on-surface-variant mb-1">
            <span className="text-xs font-mono uppercase tracking-wider">Vocabulary</span>
            <span className="material-symbols-outlined text-[18px] text-primary group-hover:scale-110 transition-transform">dictionary</span>
          </div>
          <div className="text-2xl font-bold font-mono text-primary">{stats.totalVocabulary}</div>
          <p className="text-[11px] text-on-surface-variant mt-1">Gender, article, senses</p>
        </Link>

        <Link
          href="/exercises"
          className="p-4 rounded-lg bg-surface-container-low border border-outline-variant/60 hover:border-primary transition-all group block"
        >
          <div className="flex items-center justify-between text-on-surface-variant mb-1">
            <span className="text-xs font-mono uppercase tracking-wider">Exercises</span>
            <span className="material-symbols-outlined text-[18px] text-emerald-600 group-hover:scale-110 transition-transform">quiz</span>
          </div>
          <div className="text-2xl font-bold font-mono text-emerald-700">{stats.totalExercises}</div>
          <p className="text-[11px] text-on-surface-variant mt-1">Interactive drills & answers</p>
        </Link>

        <Link
          href="/traps"
          className="p-4 rounded-lg bg-surface-container-low border border-outline-variant/60 hover:border-primary transition-all group block"
        >
          <div className="flex items-center justify-between text-on-surface-variant mb-1">
            <span className="text-xs font-mono uppercase tracking-wider">Traps & Pitfalls</span>
            <span className="material-symbols-outlined text-[18px] text-amber-600 group-hover:scale-110 transition-transform">warning</span>
          </div>
          <div className="text-2xl font-bold font-mono text-amber-700">{stats.totalTraps}</div>
          <p className="text-[11px] text-on-surface-variant mt-1">Correct vs incorrect forms</p>
        </Link>

        <Link
          href="/chapters"
          className="p-4 rounded-lg bg-surface-container-low border border-outline-variant/60 hover:border-primary transition-all group block"
        >
          <div className="flex items-center justify-between text-on-surface-variant mb-1">
            <span className="text-xs font-mono uppercase tracking-wider">Chapters</span>
            <span className="material-symbols-outlined text-[18px] text-primary group-hover:scale-110 transition-transform">import_contacts</span>
          </div>
          <div className="text-2xl font-bold font-mono text-primary">{stats.totalChapters}</div>
          <p className="text-[11px] text-on-surface-variant mt-1">Structured curriculum</p>
        </Link>

        <Link
          href="/examples"
          className="p-4 rounded-lg bg-surface-container-low border border-outline-variant/60 hover:border-primary transition-all group block"
        >
          <div className="flex items-center justify-between text-on-surface-variant mb-1">
            <span className="text-xs font-mono uppercase tracking-wider">Examples</span>
            <span className="material-symbols-outlined text-[18px] text-primary group-hover:scale-110 transition-transform">format_quote</span>
          </div>
          <div className="text-2xl font-bold font-mono text-primary">{stats.totalExamples}</div>
          <p className="text-[11px] text-on-surface-variant mt-1">With focus spans</p>
        </Link>

        <Link
          href="/concepts"
          className="p-4 rounded-lg bg-surface-container-low border border-outline-variant/60 hover:border-primary transition-all group block"
        >
          <div className="flex items-center justify-between text-on-surface-variant mb-1">
            <span className="text-xs font-mono uppercase tracking-wider">Concepts</span>
            <span className="material-symbols-outlined text-[18px] text-primary group-hover:scale-110 transition-transform">psychology</span>
          </div>
          <div className="text-2xl font-bold font-mono text-primary">{stats.totalConcepts}</div>
          <p className="text-[11px] text-on-surface-variant mt-1">Semantic taxonomy & explorer</p>
        </Link>
      </div>

      {/* DIRECT ACTION JUMP TARGETS (Suggestion 18) */}
      <div className="space-y-3">
        <div className="flex items-center justify-between border-b border-outline-variant/50 pb-2">
          <h2 className="text-base font-bold text-primary flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-[20px]">bolt</span>
            <span>Direct Jump Targets</span>
          </h2>
          <span className="text-xs text-on-surface-variant font-mono">
            Direct syllabus slices
          </span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
          <Link
            href="/verbs?regularity=irregular"
            className="p-3 rounded-lg bg-surface-container-low border border-outline-variant/70 hover:border-primary hover:bg-surface-container transition-all group"
          >
            <div className="text-[10px] font-mono uppercase text-amber-700 font-bold">Verbs</div>
            <div className="text-xs font-bold text-primary group-hover:underline mt-0.5">Irregular Verbs</div>
            <div className="text-[10px] text-on-surface-variant mt-1 font-mono">Irregulars filter &rarr;</div>
          </Link>
          <Link
            href="/tenses?mood=subjunctive"
            className="p-3 rounded-lg bg-surface-container-low border border-outline-variant/70 hover:border-primary hover:bg-surface-container transition-all group"
          >
            <div className="text-[10px] font-mono uppercase text-purple-700 font-bold">Moods</div>
            <div className="text-xs font-bold text-primary group-hover:underline mt-0.5">Subjunctive</div>
            <div className="text-[10px] text-on-surface-variant mt-1 font-mono">4 subjunctive tenses &rarr;</div>
          </Link>
          <Link
            href="/grammar?priority=1"
            className="p-3 rounded-lg bg-surface-container-low border border-outline-variant/70 hover:border-primary hover:bg-surface-container transition-all group"
          >
            <div className="text-[10px] font-mono uppercase text-emerald-700 font-bold">Rules</div>
            <div className="text-xs font-bold text-primary group-hover:underline mt-0.5">Priority 1 Rules</div>
            <div className="text-[10px] text-on-surface-variant mt-1 font-mono">Core essentials &rarr;</div>
          </Link>
          <Link
            href="/grammar?cefr=B1"
            className="p-3 rounded-lg bg-surface-container-low border border-outline-variant/70 hover:border-primary hover:bg-surface-container transition-all group"
          >
            <div className="text-[10px] font-mono uppercase text-blue-700 font-bold">Level</div>
            <div className="text-xs font-bold text-primary group-hover:underline mt-0.5">B1 Intermediate</div>
            <div className="text-[10px] text-on-surface-variant mt-1 font-mono">Threshold syllabus &rarr;</div>
          </Link>
          <Link
            href="/expressions"
            className="p-3 rounded-lg bg-surface-container-low border border-outline-variant/70 hover:border-primary hover:bg-surface-container transition-all group"
          >
            <div className="text-[10px] font-mono uppercase text-indigo-700 font-bold">Expressions</div>
            <div className="text-xs font-bold text-primary group-hover:underline mt-0.5">Idiom Patterns</div>
            <div className="text-[10px] text-on-surface-variant mt-1 font-mono">Governed phrases &rarr;</div>
          </Link>
          <Link
            href="/traps"
            className="p-3 rounded-lg bg-surface-container-low border border-outline-variant/70 hover:border-amber-600 hover:bg-surface-container transition-all group"
          >
            <div className="text-[10px] font-mono uppercase text-rose-700 font-bold">Traps</div>
            <div className="text-xs font-bold text-primary group-hover:underline mt-0.5">Pitfall Review</div>
            <div className="text-[10px] text-on-surface-variant mt-1 font-mono">Curated warnings &rarr;</div>
          </Link>
        </div>
      </div>

      {/* CORE CURRICULUM QUICK ACCESS MODULES */}
      <div className="space-y-4">
        <div className="flex items-center justify-between border-b border-outline-variant/50 pb-2">
          <h2 className="text-lg font-bold text-primary flex items-center gap-2">
            <span className="material-symbols-outlined text-primary">grid_view</span>
            <span>Revision Modules & Explorer</span>
          </h2>
          <span className="text-xs text-on-surface-variant font-mono">
            Master Schema v{stats.datasetVersion}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <Link
            href="/verbs"
            className="p-5 rounded-lg bg-surface-container-lowest border border-outline-variant hover:border-primary transition-all duration-150 group"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="w-10 h-10 rounded-lg bg-[#002147] text-white flex items-center justify-center">
                <span className="material-symbols-outlined text-[20px]">translate</span>
              </div>
              <span className="text-xs font-mono text-primary group-hover:translate-x-1 transition-transform">
                Explore &rarr;
              </span>
            </div>
            <h3 className="font-bold text-base text-primary group-hover:text-primary-container">
              Verbs & Conjugations Matrix
            </h3>
            <p className="text-xs text-on-surface-variant mt-1 leading-relaxed">
              Explore all {stats.totalVerbs} French verbs with complete conjugation matrices across indicative, conditional, subjunctive, and imperative moods.
            </p>
          </Link>

          <Link
            href="/grammar"
            className="p-5 rounded-lg bg-surface-container-lowest border border-outline-variant hover:border-primary transition-all duration-150 group"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="w-10 h-10 rounded-lg bg-blue-700 text-white flex items-center justify-center">
                <span className="material-symbols-outlined text-[20px]">menu_book</span>
              </div>
              <span className="text-xs font-mono text-primary group-hover:translate-x-1 transition-transform">
                Explore &rarr;
              </span>
            </div>
            <h3 className="font-bold text-base text-primary group-hover:text-primary-container">
              Grammar Rules & Formations
            </h3>
            <p className="text-xs text-on-surface-variant mt-1 leading-relaxed">
              {stats.totalRules} detailed grammar rules with formation patterns, signal words, transformations, agreement rules, and restrictions.
            </p>
          </Link>

          <Link
            href="/traps"
            className="p-5 rounded-lg bg-surface-container-lowest border border-amber-200 hover:border-amber-500 transition-all duration-150 group"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="w-10 h-10 rounded-lg bg-amber-600 text-white flex items-center justify-center">
                <span className="material-symbols-outlined text-[20px]">warning</span>
              </div>
              <span className="text-xs font-mono text-amber-700 group-hover:translate-x-1 transition-transform">
                Review &rarr;
              </span>
            </div>
            <h3 className="font-bold text-base text-amber-900 group-hover:text-amber-800">
              Pitfalls & Common Traps
            </h3>
            <p className="text-xs text-on-surface-variant mt-1 leading-relaxed">
              {stats.totalTraps} curated linguistic pitfalls featuring direct comparison of correct vs. incorrect forms and key exception callouts.
            </p>
          </Link>

          <Link
            href="/exercises"
            className="p-5 rounded-lg bg-surface-container-lowest border border-emerald-200 hover:border-emerald-500 transition-all duration-150 group"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="w-10 h-10 rounded-lg bg-emerald-700 text-white flex items-center justify-center">
                <span className="material-symbols-outlined text-[20px]">quiz</span>
              </div>
              <span className="text-xs font-mono text-emerald-700 group-hover:translate-x-1 transition-transform">
                Practice &rarr;
              </span>
            </div>
            <h3 className="font-bold text-base text-emerald-900 group-hover:text-emerald-800">
              Practice Drills & Exercises
            </h3>
            <p className="text-xs text-on-surface-variant mt-1 leading-relaxed">
              {stats.totalExercises} exercises organized across all 27 chapters with prompts, multiple choice options, hints, and answer keys.
            </p>
          </Link>

          <Link
            href="/expressions"
            className="p-5 rounded-lg bg-surface-container-lowest border border-outline-variant hover:border-primary transition-all duration-150 group"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="w-10 h-10 rounded-lg bg-indigo-700 text-white flex items-center justify-center">
                <span className="material-symbols-outlined text-[20px]">chat_bubble</span>
              </div>
              <span className="text-xs font-mono text-primary group-hover:translate-x-1 transition-transform">
                Explore &rarr;
              </span>
            </div>
            <h3 className="font-bold text-base text-primary group-hover:text-primary-container">
              Expressions & Collocations
            </h3>
            <p className="text-xs text-on-surface-variant mt-1 leading-relaxed">
              {stats.totalExpressions} idioms, fixed phrases, and verbal collocations complete with pattern slots and prepositions.
            </p>
          </Link>

          <Link
            href="/chapters"
            className="p-5 rounded-lg bg-surface-container-lowest border border-outline-variant hover:border-primary transition-all duration-150 group"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="w-10 h-10 rounded-lg bg-[#002147] text-white flex items-center justify-center">
                <span className="material-symbols-outlined text-[20px]">import_contacts</span>
              </div>
              <span className="text-xs font-mono text-primary group-hover:translate-x-1 transition-transform">
                Browse &rarr;
              </span>
            </div>
            <h3 className="font-bold text-base text-primary group-hover:text-primary-container">
              Curriculum Chapters
            </h3>
            <p className="text-xs text-on-surface-variant mt-1 leading-relaxed">
              Browse all {stats.totalChapters} textbook chapters with structured sections, page references, and aggregated exercise questions.
            </p>
          </Link>
        </div>
      </div>

      {/* SPOTLIGHT SECTIONS: VERBS & TRAPS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Verbs Spotlight */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-base text-primary flex items-center gap-2">
              <span className="material-symbols-outlined text-primary text-[18px]">translate</span>
              <span>Essential Verbs Spotlight</span>
            </h3>
            <Link href="/verbs" className="text-xs font-mono text-primary hover:underline">
              View all ({stats.totalVerbs}) &rarr;
            </Link>
          </div>

          <div className="divide-y divide-outline-variant/40 bg-surface-container-lowest rounded-lg border border-outline-variant overflow-hidden">
            {topVerbs.map((v) => (
              <Link
                key={v.id}
                href={`/verbs/${encodeURIComponent(v.lemma)}`}
                className="flex items-center justify-between p-3.5 hover:bg-surface-container transition-colors group"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm text-primary group-hover:underline">
                      {v.lemma}
                    </span>
                    <GroupBadge group={v.group} />
                    <AuxiliaryBadge auxiliary={v.auxiliary} />
                    <RegularityBadge regularity={v.regularity} />
                  </div>
                  <p className="text-xs text-on-surface-variant mt-0.5">
                    {v.english || "—"}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <PriorityBadge priority={v.priority} />
                  <span className="material-symbols-outlined text-[18px] text-on-surface-variant group-hover:translate-x-0.5 transition-transform">
                    chevron_right
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Common Pitfalls & Traps Spotlight */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-base text-amber-900 flex items-center gap-2">
              <span className="material-symbols-outlined text-amber-600 text-[18px]">warning</span>
              <span>Frequent Traps & Pitfalls</span>
            </h3>
            <Link href="/traps" className="text-xs font-mono text-amber-800 hover:underline">
              View all ({stats.totalTraps}) &rarr;
            </Link>
          </div>

          <div className="divide-y divide-amber-100 bg-amber-50/40 rounded-lg border border-amber-200 overflow-hidden">
            {topTraps.map((trap) => (
              <Link
                key={trap.id}
                href="/traps"
                className="p-3.5 hover:bg-amber-100/50 transition-colors group block"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h4 className="font-bold text-sm text-amber-950 group-hover:underline">
                      {trap.title}
                    </h4>
                    <p className="text-xs text-amber-900/80 mt-1 line-clamp-2">
                      {trap.description}
                    </p>
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-200 text-amber-900 font-medium whitespace-nowrap">
                    {trap.category}
                  </span>
                </div>
                {(trap.correct_form || trap.incorrect_form) && (
                  <div className="mt-2 grid grid-cols-2 gap-2 text-xs font-mono">
                    {trap.correct_form && (
                      <div className="p-1 px-2 rounded bg-emerald-100 text-emerald-900">
                        ✓ {trap.correct_form}
                      </div>
                    )}
                    {trap.incorrect_form && (
                      <div className="p-1 px-2 rounded bg-rose-100 text-rose-900 line-through">
                        ✗ {trap.incorrect_form}
                      </div>
                    )}
                  </div>
                )}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
