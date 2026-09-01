import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getGrammarRuleById } from "@/src/lib/data/selectors";
import { PriorityBadge, CEFRBadge } from "@/src/components/ui/Badges";
import { CrossLink } from "@/src/components/ui/CrossLink";

interface GrammarDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function GrammarDetailPage({ params }: GrammarDetailPageProps) {
  const { id } = await params;
  const data = getGrammarRuleById(id);

  if (!data) {
    notFound();
  }

  const { rule, tenses, verbs, examples, exercises, chapters } = data;

  return (
    <div className="space-y-8 pb-16">
      {/* TOP NAVIGATION / BREADCRUMBS */}
      <div className="flex items-center justify-between">
        <Link
          href="/grammar"
          className="inline-flex items-center gap-1.5 text-xs font-mono text-on-surface-variant hover:text-primary transition-colors"
        >
          <span className="material-symbols-outlined text-[16px]">arrow_back</span>
          <span>Back to Grammar Library</span>
        </Link>
        <div className="flex items-center gap-2">
          <PriorityBadge priority={rule.priority} />
          <CEFRBadge cefr={rule.cefr} />
        </div>
      </div>

      {/* RULE HERO HEADER */}
      <div className="p-6 md:p-8 rounded-lg bg-surface-container-low border border-outline-variant space-y-4">
        <div>
          <span className="text-[11px] font-mono uppercase text-on-surface-variant tracking-wider block mb-1">
            Grammar Rule #{rule.id}
          </span>
          <h1 className="text-2xl md:text-4xl font-bold font-sans text-primary tracking-tight">
            {rule.title}
          </h1>
          {rule.title_fr && (
            <p className="text-base md:text-lg text-secondary font-serif italic mt-1">
              {rule.title_fr}
            </p>
          )}
        </div>

        {/* Formation Pattern Banner */}
        {rule.formation_pattern && (
          <div className="p-4 rounded bg-primary-container text-white font-mono text-sm border border-outline-variant/30">
            <span className="text-[10px] uppercase text-primary-fixed block font-sans font-bold mb-1">
              Formation Formula:
            </span>
            <span className="text-primary-fixed">{rule.formation_pattern}</span>
          </div>
        )}

        {/* Linguistic Explanation */}
        <div className="pt-2 text-sm md:text-base text-on-surface leading-relaxed font-sans">
          <p>{rule.explanation || "Grammar rule explanation."}</p>
        </div>
      </div>

      {/* TRAPS AND EXCEPTIONS BOX */}
      {rule.exceptions && rule.exceptions.length > 0 && (
        <div className="p-5 rounded-lg bg-amber-50 border border-amber-300 text-amber-950 space-y-2">
          <div className="flex items-center gap-2 font-bold text-sm text-amber-900">
            <span className="material-symbols-outlined text-[20px]">warning</span>
            <span>Traps, False Friends & Irregular Exceptions</span>
          </div>
          <ul className="list-disc list-inside space-y-1 text-xs md:text-sm">
            {rule.exceptions.map((trap, idx) => (
              <li key={idx}>{trap}</li>
            ))}
          </ul>
        </div>
      )}

      {/* RELATED TENSES & VERBS */}
      {(tenses.length > 0 || verbs.length > 0) && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {tenses.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-sm font-bold font-mono uppercase text-on-surface-variant flex items-center gap-2">
                <span className="material-symbols-outlined text-[18px] text-primary">history_toggle_off</span>
                <span>Associated Tenses</span>
              </h3>
              <div className="flex flex-wrap gap-2">
                {tenses.map((t) => (
                  <CrossLink
                    key={t.id}
                    type="tense"
                    id={t.id}
                    label={`${t.name_fr} (${t.name_en})`}
                  />
                ))}
              </div>
            </div>
          )}

          {verbs.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-sm font-bold font-mono uppercase text-on-surface-variant flex items-center gap-2">
                <span className="material-symbols-outlined text-[18px] text-primary">translate</span>
                <span>Governed Verbs</span>
              </h3>
              <div className="flex flex-wrap gap-2">
                {verbs.map((v) => (
                  <CrossLink
                    key={v.id}
                    type="verb"
                    id={v.id}
                    label={v.lemma}
                    sublabel={v.english || undefined}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* EXAMPLES */}
      {examples.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between border-b border-outline-variant/60 pb-2">
            <h2 className="text-xl font-bold text-primary flex items-center gap-2">
              <span className="material-symbols-outlined text-primary">format_quote</span>
              <span>Contextual Sentence Examples</span>
            </h2>
            <span className="text-xs font-mono text-on-surface-variant">
              {examples.length} examples
            </span>
          </div>

          <div className="divide-y divide-outline-variant/40 rounded bg-surface-container-lowest border border-outline-variant overflow-hidden">
            {examples.map((ex) => (
              <div key={ex.id} className="p-4 space-y-1">
                <p className="text-base text-primary font-serif font-serif-example">
                  {ex.french}
                </p>
                <p className="text-xs text-on-surface-variant font-sans">
                  {ex.english}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* EXERCISES LINK */}
      {exercises.length > 0 && (
        <div className="space-y-3 pt-4 border-t border-outline-variant/60">
          <h3 className="text-sm font-bold font-mono uppercase text-on-surface-variant">
            Targeted Exercises ({exercises.length})
          </h3>
          <div className="space-y-2">
            {exercises.slice(0, 5).map((ex) => (
              <div
                key={ex.id}
                className="p-3 rounded bg-surface-container-lowest border border-outline-variant text-xs"
              >
                <span className="font-bold text-primary">{ex.title}</span>
                {ex.instructions && (
                  <p className="text-on-surface-variant mt-1">{ex.instructions}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ATTESTATIONS */}
      {chapters.length > 0 && (
        <div className="space-y-3 pt-4 border-t border-outline-variant/60">
          <h3 className="text-sm font-bold font-mono uppercase text-on-surface-variant">
            Chapters Attestation
          </h3>
          <div className="flex flex-wrap gap-2">
            {chapters.map((ch) => (
              <CrossLink
                key={ch.id}
                type="chapter"
                id={ch.id}
                label={`Ch ${ch.chapter_number}: ${ch.title}`}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
