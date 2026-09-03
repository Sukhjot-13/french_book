import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getExpressionById } from "@/src/lib/data/selectors";
import { PriorityBadge, RegisterBadge, CollocationBadge, CEFRBadge } from "@/src/components/ui/Badges";

interface ExpressionDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function ExpressionDetailPage({ params }: ExpressionDetailPageProps) {
  const { id } = await params;
  const data = getExpressionById(id);

  if (!data) {
    notFound();
  }

  const { expression, verbs, examples, vocabulary } = data;

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
      <div className="p-6 md:p-8 rounded-xl bg-surface-container-low border border-outline-variant space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <span className="text-[11px] font-mono uppercase text-on-surface-variant tracking-wider block mb-1">
              {expression.type}
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
            <CollocationBadge strength={expression.strength} />
          </div>
        </div>

        {/* Pattern & Slot Structure (Master Schema) */}
        {expression.pattern && (
          <div className="p-4 rounded-lg bg-[#002147] text-white font-mono text-sm border border-blue-900 shadow-xs">
            <span className="text-[10px] uppercase text-blue-200 block font-sans font-bold mb-1">
              Syntactic Pattern:
            </span>
            <span className="text-blue-100 font-semibold">{expression.pattern}</span>
          </div>
        )}

        {/* Pattern Slots */}
        {expression.pattern_slots && expression.pattern_slots.length > 0 && (
          <div className="pt-3 border-t border-outline-variant/50 space-y-2">
            <span className="text-xs font-bold font-mono uppercase text-on-surface-variant block">
              Pattern Slots / Fillers:
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
              {expression.pattern_slots.map((slot, sIdx) => (
                <div key={sIdx} className="p-2.5 rounded-lg bg-surface-container-lowest border border-outline-variant/50 text-xs">
                  <div className="font-mono font-bold text-primary">{slot.slot_name || `Slot ${sIdx + 1}`}</div>
                  {slot.filler_types && (
                    <div className="text-on-surface-variant mt-0.5">
                      Types: {slot.filler_types.join(", ")}
                    </div>
                  )}
                  {slot.notes && (
                    <div className="text-on-surface-variant italic mt-0.5">{slot.notes}</div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Prepositions & Complement Structure */}
        {((expression.prepositions && expression.prepositions.length > 0) || expression.complement_structure) && (
          <div className="pt-3 border-t border-outline-variant/50 grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
            {expression.prepositions && expression.prepositions.length > 0 && (
              <div>
                <span className="font-mono text-[10px] uppercase text-on-surface-variant block mb-1">Governed Prepositions:</span>
                <div className="flex flex-wrap gap-1">
                  {expression.prepositions.map((prep, pIdx) => (
                    <span key={pIdx} className="px-2 py-0.5 rounded bg-surface-container font-mono text-[11px] text-primary">
                      {prep}
                    </span>
                  ))}
                </div>
              </div>
            )}
            {expression.complement_structure && (
              <div>
                <span className="font-mono text-[10px] uppercase text-on-surface-variant block mb-1">Complement Structure:</span>
                <p className="font-mono text-primary">{expression.complement_structure}</p>
              </div>
            )}
          </div>
        )}

        {/* Synonyms, Antonyms, Restrictions */}
        {((expression.synonyms && expression.synonyms.length > 0) || (expression.restrictions && expression.restrictions.length > 0)) && (
          <div className="pt-3 border-t border-outline-variant/50 grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
            {expression.synonyms && expression.synonyms.length > 0 && (
              <div>
                <span className="font-mono text-[10px] uppercase text-on-surface-variant block mb-1">Synonyms:</span>
                <div className="flex flex-wrap gap-1">
                  {expression.synonyms.map((s, idx) => (
                    <span key={idx} className="px-2 py-0.5 rounded bg-surface-container font-mono text-[11px]">
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            )}
            {expression.restrictions && expression.restrictions.length > 0 && (
              <div>
                <span className="font-mono text-[10px] uppercase text-rose-800 block mb-1">Restrictions:</span>
                <ul className="space-y-1 text-rose-900">
                  {expression.restrictions.map((r, idx) => (
                    <li key={idx}>⚠️ {r}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </div>

      {/* ASSOCIATED CORE VERBS */}
      {verbs.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-lg font-bold text-primary flex items-center gap-2 border-b border-outline-variant/60 pb-2">
            <span className="material-symbols-outlined text-primary">translate</span>
            <span>Underlying Core Verbs</span>
          </h2>

          <div className="flex flex-wrap gap-3">
            {verbs.map((v) => (
              <Link
                key={v.id}
                href={`/verbs/${encodeURIComponent(v.lemma)}`}
                className="p-3.5 rounded-lg bg-surface-container-lowest border border-outline-variant hover:border-primary transition-colors flex items-center gap-3 group"
              >
                <div>
                  <div className="font-bold text-primary group-hover:underline">{v.lemma}</div>
                  <div className="text-xs text-on-surface-variant">{v.english}</div>
                </div>
                <span className="material-symbols-outlined text-[16px] text-on-surface-variant">arrow_forward</span>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* RELATED VOCABULARY */}
      {vocabulary.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-lg font-bold text-primary flex items-center gap-2 border-b border-outline-variant/60 pb-2">
            <span className="material-symbols-outlined text-primary">dictionary</span>
            <span>Related Vocabulary</span>
          </h2>

          <div className="flex flex-wrap gap-2">
            {vocabulary.map((vc) => (
              <Link
                key={vc.id}
                href={`/vocabulary?query=${encodeURIComponent(vc.french)}`}
                className="px-3 py-1.5 rounded-lg bg-surface-container-low border border-outline-variant text-xs text-primary hover:border-primary transition-colors"
              >
                <strong>{vc.french}</strong> — {vc.english}
              </Link>
            ))}
          </div>
        </div>
      )}

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
      {expression.raw_chapters && expression.raw_chapters.length > 0 && (
        <div className="space-y-3 pt-4 border-t border-outline-variant/60">
          <h3 className="text-sm font-bold font-mono uppercase text-on-surface-variant">
            Chapters Attestation
          </h3>
          <div className="flex flex-wrap gap-2">
            {expression.raw_chapters.map((chNum) => (
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
