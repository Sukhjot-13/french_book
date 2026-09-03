import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getGrammarRuleById } from "@/src/lib/data/selectors";
import { PriorityBadge, CEFRBadge } from "@/src/components/ui/Badges";

interface GrammarDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function GrammarDetailPage({ params }: GrammarDetailPageProps) {
  const { id } = await params;
  const data = getGrammarRuleById(id);

  if (!data) {
    notFound();
  }

  const { rule, tenses, verbs, examples, traps } = data;

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
      <div className="p-6 md:p-8 rounded-xl bg-surface-container-low border border-outline-variant space-y-4">
        <div>
          <span className="text-[11px] font-mono uppercase text-on-surface-variant tracking-wider block mb-1">
            Grammar Principle • {rule.category}
          </span>
          <h1 className="text-2xl md:text-4xl font-bold font-sans text-primary tracking-tight">
            {rule.title}
          </h1>
          {rule.summary && (
            <p className="text-sm md:text-base text-on-surface mt-2 leading-relaxed font-medium">
              {rule.summary}
            </p>
          )}
        </div>

        {/* Formation Formula (Master Schema) */}
        {rule.formation && (
          <div className="p-4 rounded-lg bg-[#002147] text-white font-mono text-sm border border-blue-900 shadow-xs">
            <span className="text-[10px] uppercase text-blue-200 block font-sans font-bold mb-1">
              Formation Formula:
            </span>
            <span className="text-blue-100 font-semibold">{rule.formation}</span>
          </div>
        )}

        {/* Linguistic Explanation */}
        {rule.explanation && (
          <div className="pt-2 text-sm text-on-surface leading-relaxed font-sans space-y-2">
            <span className="font-bold text-primary font-mono text-xs uppercase block">
              Explanation & Grammar Mechanism:
            </span>
            <p className="whitespace-pre-line">{rule.explanation}</p>
          </div>
        )}

        {/* Usage points, Restrictions, Conditions (Master Schema) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-3 border-t border-outline-variant/50 text-xs">
          {rule.usage && rule.usage.length > 0 && (
            <div>
              <span className="font-bold font-mono text-[10px] uppercase text-on-surface-variant block mb-1">
                Usage Guidelines:
              </span>
              <ul className="space-y-1 text-on-surface-variant">
                {rule.usage.map((u, idx) => (
                  <li key={idx}>• {u}</li>
                ))}
              </ul>
            </div>
          )}

          {rule.restrictions && rule.restrictions.length > 0 && (
            <div>
              <span className="font-bold font-mono text-[10px] uppercase text-rose-800 block mb-1">
                Restrictions:
              </span>
              <ul className="space-y-1 text-rose-900">
                {rule.restrictions.map((r, idx) => (
                  <li key={idx}>⚠️ {r}</li>
                ))}
              </ul>
            </div>
          )}

          {rule.signal_words && rule.signal_words.length > 0 && (
            <div>
              <span className="font-bold font-mono text-[10px] uppercase text-on-surface-variant block mb-1">
                Signal Words:
              </span>
              <div className="flex flex-wrap gap-1">
                {rule.signal_words.map((w, idx) => (
                  <span key={idx} className="px-2 py-0.5 rounded bg-surface-container font-mono text-[11px] text-primary">
                    {w}
                  </span>
                ))}
              </div>
            </div>
          )}

          {rule.agreement_rules && rule.agreement_rules.length > 0 && (
            <div>
              <span className="font-bold font-mono text-[10px] uppercase text-on-surface-variant block mb-1">
                Agreement Rules:
              </span>
              <ul className="space-y-1 text-on-surface-variant">
                {rule.agreement_rules.map((ar, idx) => (
                  <li key={idx}>• {ar}</li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Contrast with & Word Order */}
        {((rule.contrast_with && rule.contrast_with.length > 0) || rule.word_order) && (
          <div className="pt-3 border-t border-outline-variant/50 text-xs space-y-2">
            {rule.word_order && (
              <p className="font-mono text-primary bg-surface-container p-2 rounded">
                <strong>Word Order:</strong> {rule.word_order}
              </p>
            )}
            {rule.contrast_with && rule.contrast_with.length > 0 && (
              <div>
                <span className="font-mono text-[10px] uppercase text-on-surface-variant block mb-1">
                  Contrast With:
                </span>
                <div className="flex flex-wrap gap-1">
                  {rule.contrast_with.map((cw, idx) => (
                    <span key={idx} className="px-2 py-0.5 rounded bg-blue-50 text-blue-900 font-mono text-[11px]">
                      {cw}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* TRAPS AND EXCEPTIONS BOX */}
      {((rule.exceptions && rule.exceptions.length > 0) || (rule.common_traps && rule.common_traps.length > 0) || (traps && traps.length > 0)) && (
        <div className="p-5 rounded-xl bg-amber-50 border border-amber-300 text-amber-950 space-y-3">
          <div className="flex items-center gap-2 font-bold text-sm text-amber-900">
            <span className="material-symbols-outlined text-[20px]">warning</span>
            <span>Traps, Irregular Exceptions & Pitfalls</span>
          </div>

          {rule.exceptions && rule.exceptions.length > 0 && (
            <div>
              <span className="text-xs font-bold uppercase font-mono block text-amber-900 mb-1">Exceptions:</span>
              <ul className="list-disc list-inside space-y-1 text-xs md:text-sm">
                {rule.exceptions.map((exc, idx) => (
                  <li key={idx}>{exc}</li>
                ))}
              </ul>
            </div>
          )}

          {rule.common_traps && rule.common_traps.length > 0 && (
            <div>
              <span className="text-xs font-bold uppercase font-mono block text-amber-900 mb-1">Common Pitfalls:</span>
              <ul className="list-disc list-inside space-y-1 text-xs md:text-sm">
                {rule.common_traps.map((ct, idx) => (
                  <li key={idx}>{ct}</li>
                ))}
              </ul>
            </div>
          )}

          {traps && traps.length > 0 && (
            <div className="pt-2 border-t border-amber-200 grid grid-cols-1 md:grid-cols-2 gap-2">
              {traps.map((t) => (
                <div key={t.id} className="p-3 rounded-lg bg-white/70 border border-amber-200 text-xs">
                  <div className="font-bold text-amber-950">{t.title}</div>
                  <p className="text-amber-900 mt-0.5">{t.description}</p>
                  {t.correct_form && (
                    <div className="font-mono text-emerald-900 mt-1 font-semibold">✓ {t.correct_form}</div>
                  )}
                  {t.incorrect_form && (
                    <div className="font-mono text-rose-900 line-through">✗ {t.incorrect_form}</div>
                  )}
                </div>
              ))}
            </div>
          )}
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
                  <Link
                    key={t.id}
                    href={`/tenses/${encodeURIComponent(t.name_fr)}`}
                    className="px-3 py-1.5 rounded-lg bg-surface-container-low border border-outline-variant text-xs font-mono font-medium text-primary hover:border-primary transition-colors"
                  >
                    {t.name_fr} ({t.name_en})
                  </Link>
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
                  <Link
                    key={v.id}
                    href={`/verbs/${encodeURIComponent(v.lemma)}`}
                    className="px-3 py-1.5 rounded-lg bg-surface-container-low border border-outline-variant text-xs font-mono font-medium text-primary hover:border-primary transition-colors"
                  >
                    {v.lemma}
                  </Link>
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

          <div className="divide-y divide-outline-variant/40 rounded-xl bg-surface-container-lowest border border-outline-variant overflow-hidden">
            {examples.map((ex) => (
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

      {/* SOURCE CHAPTERS */}
      {rule.raw_chapters && rule.raw_chapters.length > 0 && (
        <div className="space-y-3 pt-4 border-t border-outline-variant/60">
          <h3 className="text-sm font-bold font-mono uppercase text-on-surface-variant">
            Chapters Attestation
          </h3>
          <div className="flex flex-wrap gap-2">
            {rule.raw_chapters.map((chNum) => (
              <Link
                key={chNum}
                href={`/chapters/${chNum}`}
                className="px-2.5 py-1 rounded bg-surface-container text-xs font-mono text-primary hover:bg-primary hover:text-white transition-colors"
              >
                Chapter {chNum}
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
