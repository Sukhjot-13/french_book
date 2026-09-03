import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getTenseById } from "@/src/lib/data/selectors";
import { MoodBadge } from "@/src/components/ui/Badges";

interface TenseDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function TenseDetailPage({ params }: TenseDetailPageProps) {
  const { id } = await params;
  const data = getTenseById(id);

  if (!data) {
    notFound();
  }

  const { tense, conjugations, grammarRules, examples, traps } = data;

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
        <MoodBadge mood={tense.mood} />
      </div>

      {/* TENSE HERO HEADER */}
      <div className="p-6 md:p-8 rounded-xl bg-surface-container-low border border-outline-variant space-y-4">
        <div>
          <span className="text-[11px] font-mono uppercase text-on-surface-variant tracking-wider block mb-1">
            Mode {tense.mood || "Indicatif"}
          </span>
          <h1 className="text-2xl md:text-4xl font-bold font-sans text-primary tracking-tight capitalize">
            {tense.name_fr}
          </h1>
          {tense.name_en && (
            <p className="text-base md:text-lg text-secondary font-serif italic mt-1">
              {tense.name_en}
            </p>
          )}
        </div>

        {/* Formation Formula (Master Schema) */}
        {tense.formation && (
          <div className="p-4 rounded-lg bg-[#002147] text-white font-mono text-sm border border-blue-900 shadow-xs">
            <span className="text-[10px] uppercase text-blue-200 block font-sans font-bold mb-1">
              Formation Formula:
            </span>
            <span className="text-blue-100 font-semibold">{tense.formation}</span>
          </div>
        )}

        {/* Usage Guidelines (Master Schema) */}
        {tense.usage && tense.usage.length > 0 && (
          <div className="pt-2 text-sm text-on-surface leading-relaxed font-sans space-y-2">
            <span className="font-bold text-primary font-mono text-xs uppercase block">
              Pedagogical Usage & Temporal Nuance:
            </span>
            <ul className="list-disc pl-5 space-y-1 text-on-surface-variant text-xs md:text-sm">
              {tense.usage.map((u, idx) => (
                <li key={idx}>{u}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Signal Words & Agreement Rules (Master Schema) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-3 border-t border-outline-variant/50 text-xs">
          {tense.signal_words && tense.signal_words.length > 0 && (
            <div>
              <span className="font-bold font-mono text-[10px] uppercase text-on-surface-variant block mb-1">
                Signal Words / Temporal Markers:
              </span>
              <div className="flex flex-wrap gap-1">
                {tense.signal_words.map((word, wIdx) => (
                  <span key={wIdx} className="px-2 py-0.5 rounded bg-surface-container font-mono text-[11px] text-primary">
                    {word}
                  </span>
                ))}
              </div>
            </div>
          )}

          {tense.agreement_rules && tense.agreement_rules.length > 0 && (
            <div>
              <span className="font-bold font-mono text-[10px] uppercase text-on-surface-variant block mb-1">
                Agreement Rules:
              </span>
              <ul className="space-y-1 text-on-surface-variant text-[11px]">
                {tense.agreement_rules.map((rule, rIdx) => (
                  <li key={rIdx}>• {rule}</li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Common Traps & Form Variations */}
        {(tense.common_traps && tense.common_traps.length > 0) && (
          <div className="p-3 rounded-lg bg-amber-50 border border-amber-200 text-xs text-amber-900 space-y-1">
            <span className="font-bold font-mono text-[10px] uppercase tracking-wider block text-amber-800">
              ⚠️ Common Traps & Pitfalls:
            </span>
            {tense.common_traps.map((trap, tIdx) => (
              <p key={tIdx}>• {trap}</p>
            ))}
          </div>
        )}
      </div>

      {/* SAMPLE VERB CONJUGATIONS */}
      <div className="space-y-4">
        <div className="flex items-center justify-between border-b border-outline-variant/60 pb-2">
          <h2 className="text-xl font-bold text-primary flex items-center gap-2">
            <span className="material-symbols-outlined text-primary">translate</span>
            <span>Recorded Conjugations for {tense.name_fr}</span>
          </h2>
          <span className="text-xs font-mono text-on-surface-variant">
            {conjugations.length} verbs
          </span>
        </div>

        {conjugations.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {conjugations.map((conj) => (
              <div
                key={conj.id}
                className="p-4 rounded-xl bg-surface-container-lowest border border-outline-variant flex flex-col justify-between shadow-xs"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <Link
                      href={`/verbs/${encodeURIComponent(conj.verb_id.replace(/^verb_/, ""))}`}
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
                  <Link
                    href={`/verbs/${encodeURIComponent(conj.verb_id.replace(/^verb_/, ""))}`}
                    className="text-xs font-mono text-primary hover:underline inline-flex items-center gap-1"
                  >
                    <span>Full Verb Conjugation</span>
                    <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-xs text-on-surface-variant italic">
            No specific irregular overrides recorded for this tense; regular formation formula applies.
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
              <Link
                key={r.id}
                href={`/grammar/${encodeURIComponent(r.title)}`}
                className="p-3.5 rounded-lg bg-surface-container-lowest border border-outline-variant hover:border-primary transition-colors block"
              >
                <div className="font-bold text-sm text-primary hover:underline">
                  {r.title}
                </div>
                {r.summary && (
                  <p className="text-xs text-on-surface-variant mt-1 line-clamp-2">
                    {r.summary}
                  </p>
                )}
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* SPECIFIC TRAPS FOR THIS TENSE */}
      {traps && traps.length > 0 && (
        <div className="space-y-3">
          <h2 className="text-lg font-bold text-amber-900 flex items-center gap-2 border-b border-amber-200 pb-2">
            <span className="material-symbols-outlined text-amber-600">warning</span>
            <span>Dedicated Pitfalls & Traps</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {traps.map((trap) => (
              <div key={trap.id} className="p-3.5 rounded-lg bg-amber-50/60 border border-amber-200 text-xs">
                <div className="font-bold text-sm text-amber-950">{trap.title}</div>
                <p className="text-amber-900 mt-1">{trap.description}</p>
                {(trap.correct_form || trap.incorrect_form) && (
                  <div className="mt-2 grid grid-cols-2 gap-2 font-mono">
                    {trap.correct_form && (
                      <div className="p-1 rounded bg-emerald-100 text-emerald-900">✓ {trap.correct_form}</div>
                    )}
                    {trap.incorrect_form && (
                      <div className="p-1 rounded bg-rose-100 text-rose-900 line-through">✗ {trap.incorrect_form}</div>
                    )}
                  </div>
                )}
              </div>
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

          <div className="divide-y divide-outline-variant/40 rounded-xl bg-surface-container-lowest border border-outline-variant overflow-hidden">
            {examples.slice(0, 10).map((ex) => (
              <div key={ex.id} className="p-4 space-y-1">
                <p className="text-base text-primary font-serif">
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
