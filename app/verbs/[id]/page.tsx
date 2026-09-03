import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getVerbById } from "@/src/lib/data/selectors";
import {
  PriorityBadge,
  GroupBadge,
  AuxiliaryBadge,
  RegularityBadge,
  TransitivityBadge,
  CEFRBadge,
  MoodBadge,
} from "@/src/components/ui/Badges";

interface VerbDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function VerbDetailPage({ params }: VerbDetailPageProps) {
  const { id } = await params;
  const data = getVerbById(id);

  if (!data) {
    notFound();
  }

  const { verb, conjugations, expressions, grammarRules, examples } = data;

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
      <div className="p-6 md:p-8 rounded-xl bg-surface-container-low border border-outline-variant space-y-4">
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
            <TransitivityBadge transitivity={verb.transitivity} />
          </div>
        </div>

        {/* Stem / Participle Quick Strip */}
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
            <span className="text-on-surface-variant block text-[10px] uppercase">Transitivity</span>
            <span className="font-bold text-primary text-sm capitalize">{verb.transitivity}</span>
          </div>
        </div>

        {/* Senses / Definitions (Master Schema) */}
        {verb.senses && verb.senses.length > 0 && (
          <div className="pt-3 border-t border-outline-variant/50 space-y-2">
            <h3 className="text-xs font-mono uppercase text-on-surface-variant font-bold">
              Meanings & Semantic Senses
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {verb.senses.map((sense, sIdx) => (
                <div
                  key={sIdx}
                  className="p-3 rounded-lg bg-surface-container-lowest border border-outline-variant/50 text-xs"
                >
                  <div className="font-bold text-primary">
                    {sIdx + 1}. {sense.english_gloss || sense.meaning || "Sense"}
                  </div>
                  {sense.context && (
                    <div className="text-on-surface-variant italic mt-0.5">
                      Context: {sense.context}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Synonyms, Antonyms, Usage Notes (Master Schema) */}
        {((verb.synonyms && verb.synonyms.length > 0) || (verb.antonyms && verb.antonyms.length > 0) || (verb.usage_notes && verb.usage_notes.length > 0)) && (
          <div className="pt-3 border-t border-outline-variant/50 grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
            {verb.synonyms && verb.synonyms.length > 0 && (
              <div>
                <span className="font-mono text-[10px] uppercase text-on-surface-variant block mb-1">Synonyms</span>
                <div className="flex flex-wrap gap-1">
                  {verb.synonyms.map((s, idx) => (
                    <span key={idx} className="px-1.5 py-0.5 rounded bg-surface-container font-mono text-[11px]">
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            )}
            {verb.antonyms && verb.antonyms.length > 0 && (
              <div>
                <span className="font-mono text-[10px] uppercase text-on-surface-variant block mb-1">Antonyms</span>
                <div className="flex flex-wrap gap-1">
                  {verb.antonyms.map((a, idx) => (
                    <span key={idx} className="px-1.5 py-0.5 rounded bg-surface-container font-mono text-[11px]">
                      {a}
                    </span>
                  ))}
                </div>
              </div>
            )}
            {verb.usage_notes && verb.usage_notes.length > 0 && (
              <div className="md:col-span-3">
                <span className="font-mono text-[10px] uppercase text-on-surface-variant block mb-1">Usage Notes</span>
                <div className="space-y-1">
                  {verb.usage_notes.map((note, idx) => (
                    <p key={idx} className="text-on-surface-variant leading-relaxed">
                      • {note}
                    </p>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* CONJUGATIONS MATRIX */}
      <div className="space-y-4">
        <div className="flex items-center justify-between border-b border-outline-variant/60 pb-2">
          <h2 className="text-xl font-bold text-primary flex items-center gap-2">
            <span className="material-symbols-outlined text-primary">history_toggle_off</span>
            <span>Conjugation Matrix</span>
          </h2>
          <span className="text-xs font-mono text-on-surface-variant">
            {conjugations.length} tenses recorded
          </span>
        </div>

        {conjugations.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {conjugations.map((conj, cIdx) => (
              <div
                key={cIdx}
                className="p-4 rounded-xl bg-surface-container-lowest border border-outline-variant flex flex-col justify-between shadow-xs"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <Link
                      href={`/tenses/${encodeURIComponent(conj.tense)}`}
                      className="font-bold text-sm text-primary hover:underline capitalize"
                    >
                      {conj.tense}
                    </Link>
                    <MoodBadge mood={conj.mood} />
                  </div>

                  <div className="space-y-1.5 text-xs font-mono py-2">
                    {conj.forms?.je && (
                      <div className="flex justify-between py-0.5 border-b border-surface-container">
                        <span className="text-on-surface-variant">je / j'</span>
                        <span className="font-semibold text-primary">{conj.forms.je}</span>
                      </div>
                    )}
                    {conj.forms?.tu && (
                      <div className="flex justify-between py-0.5 border-b border-surface-container">
                        <span className="text-on-surface-variant">tu</span>
                        <span className="font-semibold text-primary">{conj.forms.tu}</span>
                      </div>
                    )}
                    {conj.forms?.il_elle_on && (
                      <div className="flex justify-between py-0.5 border-b border-surface-container">
                        <span className="text-on-surface-variant">il / elle / on</span>
                        <span className="font-semibold text-primary">{conj.forms.il_elle_on}</span>
                      </div>
                    )}
                    {conj.forms?.nous && (
                      <div className="flex justify-between py-0.5 border-b border-surface-container">
                        <span className="text-on-surface-variant">nous</span>
                        <span className="font-semibold text-primary">{conj.forms.nous}</span>
                      </div>
                    )}
                    {conj.forms?.vous && (
                      <div className="flex justify-between py-0.5 border-b border-surface-container">
                        <span className="text-on-surface-variant">vous</span>
                        <span className="font-semibold text-primary">{conj.forms.vous}</span>
                      </div>
                    )}
                    {conj.forms?.ils_elles && (
                      <div className="flex justify-between py-0.5">
                        <span className="text-on-surface-variant">ils / elles</span>
                        <span className="font-semibold text-primary">{conj.forms.ils_elles}</span>
                      </div>
                    )}
                  </div>
                </div>

                {conj.formation_note && (
                  <p className="text-[11px] text-on-surface-variant/80 mt-2 font-sans italic border-t border-surface-container pt-1.5">
                    {conj.formation_note}
                  </p>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="p-8 text-center rounded-xl bg-surface-container-lowest border border-dashed border-outline-variant">
            <p className="text-sm text-on-surface-variant">
              Conjugation forms for regular pattern available in the tenses library.
            </p>
          </div>
        )}
      </div>

      {/* ASSOCIATED EXPRESSIONS & COLLOCATIONS */}
      {expressions.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between border-b border-outline-variant/60 pb-2">
            <h2 className="text-xl font-bold text-primary flex items-center gap-2">
              <span className="material-symbols-outlined text-primary">chat_bubble</span>
              <span>Expressions & Idiomatic Constructions</span>
            </h2>
            <span className="text-xs font-mono text-on-surface-variant">
              {expressions.length} related constructions
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {expressions.map((exp) => (
              <div
                key={exp.id}
                className="p-3.5 rounded-lg bg-surface-container-lowest border border-outline-variant flex items-start justify-between gap-3 group"
              >
                <div>
                  <Link
                    href={`/expressions/${encodeURIComponent(exp.french)}`}
                    className="font-bold text-sm text-primary hover:underline"
                  >
                    {exp.french}
                  </Link>
                  <p className="text-xs text-on-surface-variant mt-0.5">
                    {exp.english}
                  </p>
                  {exp.pattern && (
                    <div className="text-[11px] font-mono text-blue-800 bg-blue-50 px-1.5 py-0.5 rounded mt-1.5 inline-block">
                      Pattern: {exp.pattern}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* RELATED GRAMMAR RULES */}
      {grammarRules.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between border-b border-outline-variant/60 pb-2">
            <h2 className="text-xl font-bold text-primary flex items-center gap-2">
              <span className="material-symbols-outlined text-primary">menu_book</span>
              <span>Governing Grammar Rules</span>
            </h2>
            <span className="text-xs font-mono text-on-surface-variant">
              {grammarRules.length} rules
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {grammarRules.map((rule) => (
              <Link
                key={rule.id}
                href={`/grammar/${encodeURIComponent(rule.title)}`}
                className="p-3.5 rounded-lg bg-surface-container-lowest border border-outline-variant hover:border-primary transition-colors block"
              >
                <div className="font-bold text-sm text-primary hover:underline">
                  {rule.title}
                </div>
                {rule.summary && (
                  <p className="text-xs text-on-surface-variant mt-1 line-clamp-2">
                    {rule.summary}
                  </p>
                )}
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
              <span>Contextual Sentence Examples</span>
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

      {/* SOURCE CHAPTERS */}
      {verb.raw_chapters && verb.raw_chapters.length > 0 && (
        <div className="space-y-3 pt-4 border-t border-outline-variant/60">
          <h3 className="text-sm font-bold font-mono uppercase text-on-surface-variant">
            Chapters Attestation
          </h3>
          <div className="flex flex-wrap gap-2">
            {verb.raw_chapters.map((chNum) => (
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
