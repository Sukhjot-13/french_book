import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getVerbById, getTenses } from "@/src/lib/data/selectors";
import {
  PriorityBadge,
  GroupBadge,
  AuxiliaryBadge,
  RegularityBadge,
  CEFRBadge,
} from "@/src/components/ui/Badges";
import { CrossLink } from "@/src/components/ui/CrossLink";

interface VerbDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function VerbDetailPage({ params }: VerbDetailPageProps) {
  const { id } = await params;
  const data = getVerbById(id);

  if (!data) {
    notFound();
  }

  const { verb, conjugations, expressions, grammarRules, examples, chapters } = data;
  const { tenses } = getTenses();
  const tenseMap = new Map(tenses.map((t) => [t.id, t]));

  return (
    <div className="space-y-8 pb-16">
      {/* TOP NAVIGATION / BREADCRUMBS */}
      <div className="flex items-center justify-between">
        <Link
          href="/verbs"
          className="inline-flex items-center gap-1.5 text-xs font-mono text-on-surface-variant hover:text-primary transition-colors"
        >
          <span className="material-symbols-outlined text-[16px]">arrow_back</span>
          <span>Back to Verbs Library</span>
        </Link>
        <div className="flex items-center gap-2">
          <PriorityBadge priority={verb.priority} />
          <CEFRBadge cefr={verb.cefr} />
        </div>
      </div>

      {/* VERB HERO HEADER */}
      <div className="p-6 md:p-8 rounded-lg bg-surface-container-low border border-outline-variant space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-3xl md:text-5xl font-bold font-sans text-primary tracking-tight">
                {verb.lemma}
              </h1>
              {verb.pronominal && (
                <span className="px-2 py-0.5 rounded text-xs font-mono bg-purple-100 text-purple-900 border border-purple-200 font-semibold">
                  Pronominal (se {verb.lemma})
                </span>
              )}
            </div>
            <p className="text-base md:text-lg text-secondary font-serif italic mt-1">
              {verb.english || "No direct translation specified"}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <GroupBadge group={verb.group} />
            <RegularityBadge regularity={verb.regularity} />
            <AuxiliaryBadge auxiliary={verb.auxiliary} />
          </div>
        </div>

        {/* Stem / Radical / Participle Quick Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3 border-t border-outline-variant/50 text-xs font-mono">
          <div className="p-2.5 rounded bg-surface-container-lowest border border-outline-variant/40">
            <span className="text-on-surface-variant block text-[10px] uppercase">Participe Passé</span>
            <span className="font-bold text-primary text-sm">{verb.past_participle || "—"}</span>
          </div>
          <div className="p-2.5 rounded bg-surface-container-lowest border border-outline-variant/40">
            <span className="text-on-surface-variant block text-[10px] uppercase">Participe Présent</span>
            <span className="font-bold text-primary text-sm">{verb.present_participle || "—"}</span>
          </div>
          <div className="p-2.5 rounded bg-surface-container-lowest border border-outline-variant/40">
            <span className="text-on-surface-variant block text-[10px] uppercase">Auxiliary</span>
            <span className="font-bold text-primary text-sm capitalize">{verb.auxiliary}</span>
          </div>
          <div className="p-2.5 rounded bg-surface-container-lowest border border-outline-variant/40">
            <span className="text-on-surface-variant block text-[10px] uppercase">Regularity</span>
            <span className="font-bold text-primary text-sm capitalize">{verb.regularity}</span>
          </div>
        </div>
      </div>

      {/* CONJUGATIONS MATRIX */}
      <div className="space-y-4">
        <div className="flex items-center justify-between border-b border-outline-variant/60 pb-2">
          <h2 className="text-xl font-bold text-primary flex items-center gap-2">
            <span className="material-symbols-outlined text-primary">history_toggle_off</span>
            <span>Conjugation Matrix</span>
          </h2>
          <span className="text-xs font-mono text-on-surface-variant">
            {conjugations.length} tense forms available
          </span>
        </div>

        {conjugations.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {conjugations.map((conj) => {
              const tenseInfo = tenseMap.get(conj.tense_id);
              const tenseTitle = tenseInfo ? tenseInfo.name_fr : conj.tense_name_fr || conj.tense_id;
              const tenseMood = tenseInfo ? tenseInfo.mood : conj.mood || "Tense";

              return (
                <div
                  key={conj.id || conj.tense_id}
                  className="p-4 rounded-lg bg-surface-container-lowest border border-outline-variant flex flex-col justify-between shadow-xs"
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <Link
                        href={`/tenses/${encodeURIComponent(conj.tense_id)}`}
                        className="font-bold text-sm text-primary hover:underline"
                      >
                        {tenseTitle}
                      </Link>
                      <span className="text-[10px] font-mono uppercase px-1.5 py-0.5 rounded bg-surface-container-high text-on-surface-variant">
                        {tenseMood}
                      </span>
                    </div>

                    <div className="space-y-1.5 text-xs font-mono py-2">
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

                  {conj.notes && (
                    <p className="text-[11px] text-on-surface-variant/80 mt-2 font-sans italic border-t border-surface-container pt-1.5">
                      {conj.notes}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          <div className="p-8 text-center rounded bg-surface-container-lowest border border-dashed border-outline-variant">
            <p className="text-sm text-on-surface-variant">
              Conjugation tables for this verb will appear in the upcoming dataset freeze.
            </p>
          </div>
        )}
      </div>

      {/* ASSOCIATED EXPRESSIONS & COLLOCATIONS */}
      <div className="space-y-4">
        <div className="flex items-center justify-between border-b border-outline-variant/60 pb-2">
          <h2 className="text-xl font-bold text-primary flex items-center gap-2">
            <span className="material-symbols-outlined text-primary">chat_bubble</span>
            <span>Expressions & Verb Patterns</span>
          </h2>
          <span className="text-xs font-mono text-on-surface-variant">
            {expressions.length} related constructions
          </span>
        </div>

        {expressions.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {expressions.map((exp) => (
              <div
                key={exp.id}
                className="p-3.5 rounded bg-surface-container-lowest border border-outline-variant flex items-start justify-between gap-3 group"
              >
                <div>
                  <Link
                    href={`/expressions/${encodeURIComponent(exp.id)}`}
                    className="font-bold text-sm text-primary hover:underline group-hover:text-primary-container"
                  >
                    {exp.french}
                  </Link>
                  <p className="text-xs text-on-surface-variant mt-0.5">
                    {exp.english || exp.literal_english}
                  </p>
                  {exp.type && (
                    <span className="inline-block text-[10px] font-mono px-1.5 py-0.2 rounded bg-surface-container-high text-on-surface-variant mt-2 uppercase">
                      {exp.type}
                    </span>
                  )}
                </div>
                <CrossLink type="expression" id={exp.id} label="View" />
              </div>
            ))}
          </div>
        ) : (
          <p className="text-xs text-on-surface-variant italic">
            No specific idiomatic expressions registered for this verb.
          </p>
        )}
      </div>

      {/* CONTEXTUAL EXAMPLES */}
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

      {/* SOURCE CHAPTERS & ATTESTATIONS */}
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
