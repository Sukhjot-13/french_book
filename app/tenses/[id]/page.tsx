import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getTenseById } from "@/src/lib/data/selectors";
import { CrossLink } from "@/src/components/ui/CrossLink";

interface TenseDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function TenseDetailPage({ params }: TenseDetailPageProps) {
  const { id } = await params;
  const data = getTenseById(id);

  if (!data) {
    notFound();
  }

  const { tense, conjugations, verbs, grammarRules, examples } = data;

  return (
    <div className="space-y-8 pb-16">
      {/* TOP NAVIGATION / BREADCRUMBS */}
      <div className="flex items-center justify-between">
        <Link
          href="/tenses"
          className="inline-flex items-center gap-1.5 text-xs font-mono text-on-surface-variant hover:text-primary transition-colors"
        >
          <span className="material-symbols-outlined text-[16px]">arrow_back</span>
          <span>Back to Tenses Atlas</span>
        </Link>
        <span className="text-xs font-mono uppercase px-2.5 py-1 rounded bg-primary-container text-white">
          Mode {tense.mood || "Tense"}
        </span>
      </div>

      {/* TENSE HERO HEADER */}
      <div className="p-6 md:p-8 rounded-lg bg-surface-container-low border border-outline-variant space-y-4">
        <div>
          <span className="text-[11px] font-mono uppercase text-on-surface-variant tracking-wider block mb-1">
            {tense.aspect || "Temporal System"}
          </span>
          <h1 className="text-2xl md:text-4xl font-bold font-sans text-primary tracking-tight">
            {tense.name_fr}
          </h1>
          <p className="text-base md:text-lg text-secondary font-serif italic mt-1">
            {tense.name_en}
          </p>
        </div>

        {tense.formation_rule && (
          <div className="p-4 rounded bg-primary-container text-white font-mono text-sm border border-outline-variant/30">
            <span className="text-[10px] uppercase text-primary-fixed block font-sans font-bold mb-1">
              Formation Rule:
            </span>
            <span className="text-primary-fixed">{tense.formation_rule}</span>
          </div>
        )}

        {tense.temporal_reference && (
          <div className="pt-2 text-sm text-on-surface leading-relaxed font-sans">
            <span className="font-bold text-primary font-mono text-xs uppercase block mb-1">
              Temporal Nuance & Usage:
            </span>
            <p>{tense.temporal_reference}</p>
          </div>
        )}
      </div>

      {/* SAMPLE CONJUGATIONS */}
      <div className="space-y-4">
        <div className="flex items-center justify-between border-b border-outline-variant/60 pb-2">
          <h2 className="text-xl font-bold text-primary flex items-center gap-2">
            <span className="material-symbols-outlined text-primary">translate</span>
            <span>Sample Verb Conjugations</span>
          </h2>
          <span className="text-xs font-mono text-on-surface-variant">
            {conjugations.length} conjugated verbs recorded
          </span>
        </div>

        {conjugations.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {conjugations.slice(0, 12).map((conj) => (
              <div
                key={conj.id || conj.verb_id}
                className="p-4 rounded-lg bg-surface-container-lowest border border-outline-variant flex flex-col justify-between shadow-xs"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <Link
                      href={`/verbs/${encodeURIComponent(conj.verb_id)}`}
                      className="font-bold text-base text-primary hover:underline"
                    >
                      {conj.verb_id.replace(/^verb_/, "")}
                    </Link>
                    <span className="text-[10px] font-mono text-on-surface-variant">Verb</span>
                  </div>

                  <div className="space-y-1 text-xs font-mono py-1">
                    {conj.je && (
                      <div className="flex justify-between py-0.5 border-b border-surface-container">
                        <span className="text-on-surface-variant">je / j'</span>
                        <span className="font-semibold text-primary">{conj.je}</span>
                      </div>
                    )}
                    {conj.tu && (
                      <div className="flex justify-between py-0.5 border-b border-surface-container">
                        <span className="text-on-surface-variant">tu</span>
                        <span className="font-semibold text-primary">{conj.tu}</span>
                      </div>
                    )}
                    {conj.il_elle_on && (
                      <div className="flex justify-between py-0.5 border-b border-surface-container">
                        <span className="text-on-surface-variant">il / elle / on</span>
                        <span className="font-semibold text-primary">{conj.il_elle_on}</span>
                      </div>
                    )}
                    {conj.nous && (
                      <div className="flex justify-between py-0.5 border-b border-surface-container">
                        <span className="text-on-surface-variant">nous</span>
                        <span className="font-semibold text-primary">{conj.nous}</span>
                      </div>
                    )}
                    {conj.vous && (
                      <div className="flex justify-between py-0.5 border-b border-surface-container">
                        <span className="text-on-surface-variant">vous</span>
                        <span className="font-semibold text-primary">{conj.vous}</span>
                      </div>
                    )}
                    {conj.ils_elles && (
                      <div className="flex justify-between py-0.5">
                        <span className="text-on-surface-variant">ils / elles</span>
                        <span className="font-semibold text-primary">{conj.ils_elles}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="pt-2 mt-2 border-t border-surface-container">
                  <CrossLink
                    type="verb"
                    id={conj.verb_id}
                    label={`Full Table for ${conj.verb_id.replace(/^verb_/, "")}`}
                  />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-xs text-on-surface-variant italic">
            Conjugations for this tense will appear as the pipeline completes its next pass.
          </p>
        )}
      </div>

      {/* ASSOCIATED GRAMMAR RULES */}
      {grammarRules.length > 0 && (
        <div className="space-y-3">
          <h2 className="text-lg font-bold text-primary flex items-center gap-2 border-b border-outline-variant/60 pb-2">
            <span className="material-symbols-outlined text-primary">menu_book</span>
            <span>Associated Grammar Principles</span>
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {grammarRules.map((r) => (
              <CrossLink
                key={r.id}
                type="grammar"
                id={r.id}
                label={r.title}
                sublabel={r.title_fr || undefined}
              />
            ))}
          </div>
        </div>
      )}

      {/* EXAMPLES */}
      {examples.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between border-b border-outline-variant/60 pb-2">
            <h2 className="text-xl font-bold text-primary flex items-center gap-2">
              <span className="material-symbols-outlined text-primary">format_quote</span>
              <span>Contextual Usage Sentences</span>
            </h2>
            <span className="text-xs font-mono text-on-surface-variant">
              {examples.length} examples
            </span>
          </div>

          <div className="divide-y divide-outline-variant/40 rounded bg-surface-container-lowest border border-outline-variant overflow-hidden">
            {examples.slice(0, 10).map((ex) => (
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
    </div>
  );
}
