import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getExpressionById } from "@/src/lib/data/selectors";
import { PriorityBadge, RegisterBadge, CEFRBadge } from "@/src/components/ui/Badges";
import { CrossLink } from "@/src/components/ui/CrossLink";

interface ExpressionDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function ExpressionDetailPage({ params }: ExpressionDetailPageProps) {
  const { id } = await params;
  const data = getExpressionById(id);

  if (!data) {
    notFound();
  }

  const { expression, primaryVerb, relatedVerbs, examples, chapters } = data;

  return (
    <div className="space-y-8 pb-16">
      {/* TOP NAVIGATION / BREADCRUMBS */}
      <div className="flex items-center justify-between">
        <Link
          href="/expressions"
          className="inline-flex items-center gap-1.5 text-xs font-mono text-on-surface-variant hover:text-primary transition-colors"
        >
          <span className="material-symbols-outlined text-[16px]">arrow_back</span>
          <span>Back to Expressions Library</span>
        </Link>
        <div className="flex items-center gap-2">
          <PriorityBadge priority={expression.priority} />
          <CEFRBadge cefr={expression.cefr} />
        </div>
      </div>

      {/* EXPRESSION HERO HEADER */}
      <div className="p-6 md:p-8 rounded-lg bg-surface-container-low border border-outline-variant space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <span className="text-[11px] font-mono uppercase text-on-surface-variant tracking-wider block mb-1">
              {expression.type || "Expression"}
            </span>
            <h1 className="text-2xl md:text-4xl font-bold font-sans text-primary tracking-tight">
              {expression.french}
            </h1>
            <p className="text-base md:text-xl text-secondary font-serif italic mt-2">
              {expression.english || "—"}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <RegisterBadge register={expression.register} />
            {expression.strength && (
              <span className="px-2 py-0.5 rounded text-xs font-mono bg-surface-container-high text-on-surface-variant">
                Strength: {expression.strength}
              </span>
            )}
          </div>
        </div>

        {expression.literal_english && (
          <div className="p-3 rounded bg-surface-container-lowest border border-outline-variant/40 text-xs">
            <span className="font-mono font-bold text-on-surface-variant uppercase text-[10px] block">
              Literal Translation:
            </span>
            <span className="text-primary italic font-serif">&ldquo;{expression.literal_english}&rdquo;</span>
          </div>
        )}
      </div>

      {/* ASSOCIATED CORE VERBS */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold text-primary flex items-center gap-2 border-b border-outline-variant/60 pb-2">
          <span className="material-symbols-outlined text-primary">translate</span>
          <span>Underlying Verbs</span>
        </h2>

        <div className="flex flex-wrap gap-3">
          {primaryVerb && (
            <div className="p-3 rounded bg-surface-container-lowest border border-outline-variant flex items-center gap-3">
              <span className="text-xs font-mono text-on-surface-variant">Primary:</span>
              <CrossLink
                type="verb"
                id={primaryVerb.id}
                label={primaryVerb.lemma}
                sublabel={primaryVerb.english || undefined}
              />
            </div>
          )}
          {relatedVerbs.map((v) => (
            <div
              key={v.id}
              className="p-3 rounded bg-surface-container-lowest border border-outline-variant flex items-center gap-3"
            >
              <span className="text-xs font-mono text-on-surface-variant">Related:</span>
              <CrossLink
                type="verb"
                id={v.id}
                label={v.lemma}
                sublabel={v.english || undefined}
              />
            </div>
          ))}
          {!primaryVerb && relatedVerbs.length === 0 && (
            <p className="text-xs text-on-surface-variant italic">
              No specific primary verb registered for this expression.
            </p>
          )}
        </div>
      </div>

      {/* CONTEXTUAL EXAMPLES */}
      {examples.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between border-b border-outline-variant/60 pb-2">
            <h2 className="text-xl font-bold text-primary flex items-center gap-2">
              <span className="material-symbols-outlined text-primary">format_quote</span>
              <span>Contextual Usage Examples</span>
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
