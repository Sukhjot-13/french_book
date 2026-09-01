import React from "react";
import Link from "next/link";
import { getHomeStats, getVerbs, getGrammarRules, getExpressions } from "@/src/lib/data/selectors";
import { PriorityBadge, GroupBadge, AuxiliaryBadge } from "@/src/components/ui/Badges";

export default async function HomePage() {
  const stats = getHomeStats();
  const topVerbs = getVerbs({ priority: 5, limit: 6 }).verbs;
  const topRules = getGrammarRules({ priority: 5, limit: 4 }).rules;
  const topExpressions = getExpressions({ priority: 5, limit: 4 }).expressions;

  return (
    <div className="space-y-8 pb-12">
      {/* HERO / WELCOME BANNER */}
      <div className="bg-primary-container text-white p-6 md:p-8 rounded-lg border border-outline-variant/30 relative overflow-hidden">
        <div className="relative z-10 max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded bg-white/10 text-primary-fixed text-xs font-mono">
            <span className="material-symbols-outlined text-[14px]">auto_stories</span>
            <span>Practice Makes Perfect — Complete French Grammar</span>
          </div>
          <h1 className="text-2xl md:text-4xl font-bold tracking-tight font-sans text-white">
            L'Atlas & Portail de Révision
          </h1>
          <p className="text-primary-fixed-dim text-sm md:text-base leading-relaxed">
            A high-density academic reference system cross-linking verbs, conjugations,
            expressions, vocabulary, grammar rules, and contextual examples.
          </p>
        </div>

        <div className="absolute right-0 bottom-0 opacity-10 pointer-events-none translate-x-8 translate-y-8">
          <span className="material-symbols-outlined text-[200px]">menu_book</span>
        </div>
      </div>

      {/* DYNAMIC METRIC STATS STRIP (No hardcoding) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <div className="p-4 rounded bg-surface-container-low border border-outline-variant/50">
          <div className="flex items-center justify-between text-on-surface-variant mb-1">
            <span className="text-xs font-mono uppercase">Verbs</span>
            <span className="material-symbols-outlined text-[18px] text-primary">translate</span>
          </div>
          <div className="text-2xl font-bold font-mono text-primary">{stats.verbsCount}</div>
          <p className="text-[11px] text-on-surface-variant mt-1">
            {stats.regularVerbsCount} reg • {stats.irregularVerbsCount} irreg
          </p>
        </div>

        <div className="p-4 rounded bg-surface-container-low border border-outline-variant/50">
          <div className="flex items-center justify-between text-on-surface-variant mb-1">
            <span className="text-xs font-mono uppercase">Expressions</span>
            <span className="material-symbols-outlined text-[18px] text-primary">chat_bubble</span>
          </div>
          <div className="text-2xl font-bold font-mono text-primary">{stats.expressionsCount}</div>
          <p className="text-[11px] text-on-surface-variant mt-1">Idioms & Collocations</p>
        </div>

        <div className="p-4 rounded bg-surface-container-low border border-outline-variant/50">
          <div className="flex items-center justify-between text-on-surface-variant mb-1">
            <span className="text-xs font-mono uppercase">Vocabulary</span>
            <span className="material-symbols-outlined text-[18px] text-primary">dictionary</span>
          </div>
          <div className="text-2xl font-bold font-mono text-primary">{stats.vocabCount}</div>
          <p className="text-[11px] text-on-surface-variant mt-1">With POS & Gender</p>
        </div>

        <div className="p-4 rounded bg-surface-container-low border border-outline-variant/50">
          <div className="flex items-center justify-between text-on-surface-variant mb-1">
            <span className="text-xs font-mono uppercase">Grammar Rules</span>
            <span className="material-symbols-outlined text-[18px] text-primary">menu_book</span>
          </div>
          <div className="text-2xl font-bold font-mono text-primary">{stats.grammarRulesCount}</div>
          <p className="text-[11px] text-on-surface-variant mt-1">Across all concepts</p>
        </div>

        <div className="p-4 rounded bg-surface-container-low border border-outline-variant/50">
          <div className="flex items-center justify-between text-on-surface-variant mb-1">
            <span className="text-xs font-mono uppercase">Tenses & Moods</span>
            <span className="material-symbols-outlined text-[18px] text-primary">history_toggle_off</span>
          </div>
          <div className="text-2xl font-bold font-mono text-primary">{stats.tensesCount}</div>
          <p className="text-[11px] text-on-surface-variant mt-1">Simples & composés</p>
        </div>

        <div className="p-4 rounded bg-surface-container-low border border-outline-variant/50">
          <div className="flex items-center justify-between text-on-surface-variant mb-1">
            <span className="text-xs font-mono uppercase">Chapters</span>
            <span className="material-symbols-outlined text-[18px] text-primary">import_contacts</span>
          </div>
          <div className="text-2xl font-bold font-mono text-primary">{stats.chaptersCount}</div>
          <p className="text-[11px] text-on-surface-variant mt-1">Full curriculum</p>
        </div>
      </div>

      {/* CORE CURRICULUM QUICK ACCESS CARDS */}
      <div className="space-y-4">
        <div className="flex items-center justify-between border-b border-outline-variant/50 pb-2">
          <h2 className="text-lg font-bold text-primary flex items-center gap-2">
            <span className="material-symbols-outlined text-primary">grid_view</span>
            <span>Revision Libraries</span>
          </h2>
          <span className="text-xs text-on-surface-variant font-mono">
            {stats.essentialPriorityCount} Essential P5 Priority Items
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <Link
            href="/verbs"
            className="p-5 rounded bg-surface-container-lowest border border-outline-variant hover:border-primary transition-all duration-150 group"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="w-10 h-10 rounded bg-primary text-white flex items-center justify-center">
                <span className="material-symbols-outlined text-[20px]">translate</span>
              </div>
              <span className="text-xs font-mono text-primary group-hover:translate-x-1 transition-transform">
                Browse &rarr;
              </span>
            </div>
            <h3 className="font-bold text-base text-primary group-hover:text-primary-container">
              Verbs & Conjugations Matrix
            </h3>
            <p className="text-xs text-on-surface-variant mt-1 leading-relaxed">
              Explore {stats.verbsCount} verbs with full tense conjugations, auxiliaries (avoir vs être), and irregular patterns.
            </p>
          </Link>

          <Link
            href="/expressions"
            className="p-5 rounded bg-surface-container-lowest border border-outline-variant hover:border-primary transition-all duration-150 group"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="w-10 h-10 rounded bg-secondary text-white flex items-center justify-center">
                <span className="material-symbols-outlined text-[20px]">chat_bubble</span>
              </div>
              <span className="text-xs font-mono text-primary group-hover:translate-x-1 transition-transform">
                Browse &rarr;
              </span>
            </div>
            <h3 className="font-bold text-base text-primary group-hover:text-primary-container">
              Expressions & Collocations
            </h3>
            <p className="text-xs text-on-surface-variant mt-1 leading-relaxed">
              Master {stats.expressionsCount} idioms, verb constructions, connectors, and conversational phrases.
            </p>
          </Link>

          <Link
            href="/grammar"
            className="p-5 rounded bg-surface-container-lowest border border-outline-variant hover:border-primary transition-all duration-150 group"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="w-10 h-10 rounded bg-tertiary-container text-white flex items-center justify-center">
                <span className="material-symbols-outlined text-[20px]">menu_book</span>
              </div>
              <span className="text-xs font-mono text-primary group-hover:translate-x-1 transition-transform">
                Browse &rarr;
              </span>
            </div>
            <h3 className="font-bold text-base text-primary group-hover:text-primary-container">
              Grammar Rules & Traps
            </h3>
            <p className="text-xs text-on-surface-variant mt-1 leading-relaxed">
              {stats.grammarRulesCount} explicit grammar rules with explanations, exceptions callouts, and formation formulas.
            </p>
          </Link>

          <Link
            href="/tenses"
            className="p-5 rounded bg-surface-container-lowest border border-outline-variant hover:border-primary transition-all duration-150 group"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="w-10 h-10 rounded bg-primary-container text-white flex items-center justify-center">
                <span className="material-symbols-outlined text-[20px]">history_toggle_off</span>
              </div>
              <span className="text-xs font-mono text-primary group-hover:translate-x-1 transition-transform">
                Browse &rarr;
              </span>
            </div>
            <h3 className="font-bold text-base text-primary group-hover:text-primary-container">
              Tenses & Moods Atlas
            </h3>
            <p className="text-xs text-on-surface-variant mt-1 leading-relaxed">
              Indicatif, Subjonctif, Conditionnel, Impératif, and Participe systems with timeline nuances.
            </p>
          </Link>

          <Link
            href="/vocabulary"
            className="p-5 rounded bg-surface-container-lowest border border-outline-variant hover:border-primary transition-all duration-150 group"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="w-10 h-10 rounded bg-secondary text-white flex items-center justify-center">
                <span className="material-symbols-outlined text-[20px]">dictionary</span>
              </div>
              <span className="text-xs font-mono text-primary group-hover:translate-x-1 transition-transform">
                Browse &rarr;
              </span>
            </div>
            <h3 className="font-bold text-base text-primary group-hover:text-primary-container">
              Vocabulary Lexicon
            </h3>
            <p className="text-xs text-on-surface-variant mt-1 leading-relaxed">
              {stats.vocabCount} terms organized by grammatical category, gender markers, and learning priority.
            </p>
          </Link>

          <Link
            href="/examples"
            className="p-5 rounded bg-surface-container-lowest border border-outline-variant hover:border-primary transition-all duration-150 group"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="w-10 h-10 rounded bg-primary text-white flex items-center justify-center">
                <span className="material-symbols-outlined text-[20px]">format_quote</span>
              </div>
              <span className="text-xs font-mono text-primary group-hover:translate-x-1 transition-transform">
                Browse &rarr;
              </span>
            </div>
            <h3 className="font-bold text-base text-primary group-hover:text-primary-container">
              Global Example Explorer
            </h3>
            <p className="text-xs text-on-surface-variant mt-1 leading-relaxed">
              Browse {stats.examplesCount} contextual sentences with authentic French typography and translations.
            </p>
          </Link>
        </div>
      </div>

      {/* ESSENTIAL VERBS & HIGH-PRIORITY RULES SECTION */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Essential Verbs Spotlight */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-base text-primary flex items-center gap-2">
              <span className="material-symbols-outlined text-primary text-[18px]">star</span>
              <span>Essential Verbs (Priority 5)</span>
            </h3>
            <Link href="/verbs" className="text-xs font-mono text-primary hover:underline">
              View all ({stats.verbsCount}) &rarr;
            </Link>
          </div>

          <div className="divide-y divide-outline-variant/40 bg-surface-container-lowest rounded border border-outline-variant overflow-hidden">
            {topVerbs.map((v) => (
              <Link
                key={v.id}
                href={`/verbs/${encodeURIComponent(v.id)}`}
                className="flex items-center justify-between p-3.5 hover:bg-surface-container transition-colors group"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm text-primary group-hover:underline">
                      {v.lemma}
                    </span>
                    <GroupBadge group={v.group} />
                    <AuxiliaryBadge auxiliary={v.auxiliary} />
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

        {/* Priority Grammar Rules Spotlight */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-base text-primary flex items-center gap-2">
              <span className="material-symbols-outlined text-primary text-[18px]">verified</span>
              <span>Key Grammar Points (Priority 5)</span>
            </h3>
            <Link href="/grammar" className="text-xs font-mono text-primary hover:underline">
              View all ({stats.grammarRulesCount}) &rarr;
            </Link>
          </div>

          <div className="divide-y divide-outline-variant/40 bg-surface-container-lowest rounded border border-outline-variant overflow-hidden">
            {topRules.map((r) => (
              <Link
                key={r.id}
                href={`/grammar/${encodeURIComponent(r.id)}`}
                className="p-3.5 hover:bg-surface-container transition-colors group block"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h4 className="font-bold text-sm text-primary group-hover:underline">
                      {r.title}
                    </h4>
                    {r.title_fr && (
                      <p className="text-xs text-on-surface-variant font-serif italic">
                        {r.title_fr}
                      </p>
                    )}
                  </div>
                  <PriorityBadge priority={r.priority} />
                </div>
                {r.formation_pattern && (
                  <div className="mt-2 p-1.5 rounded bg-surface-container font-mono text-xs text-primary border border-outline-variant/50">
                    {r.formation_pattern}
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
