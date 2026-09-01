import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getChapterById } from "@/src/lib/data/selectors";
import { CrossLink } from "@/src/components/ui/CrossLink";
import { PriorityBadge, PosBadge, GenderBadge } from "@/src/components/ui/Badges";

interface ChapterDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function ChapterDetailPage({ params }: ChapterDetailPageProps) {
  const { id } = await params;
  const data = getChapterById(id);

  if (!data) {
    notFound();
  }

  const { chapter, sections, grammarRules, verbs, vocabulary, expressions, exercises, examples } = data;

  return (
    <div className="space-y-8 pb-16">
      {/* TOP NAVIGATION / BREADCRUMBS */}
      <div className="flex items-center justify-between">
        <Link
          href="/chapters"
          className="inline-flex items-center gap-1.5 text-xs font-mono text-on-surface-variant hover:text-primary transition-colors"
        >
          <span className="material-symbols-outlined text-[16px]">arrow_back</span>
          <span>Back to Chapters</span>
        </Link>
        {chapter.page_start && chapter.page_end && (
          <span className="text-xs font-mono text-on-surface-variant bg-surface-container-high px-2.5 py-1 rounded">
            Book Pages {chapter.page_start} – {chapter.page_end}
          </span>
        )}
      </div>

      {/* CHAPTER HERO HEADER */}
      <div className="p-6 md:p-8 rounded-lg bg-surface-container-low border border-outline-variant space-y-3">
        <span className="text-xs font-mono font-bold uppercase text-primary-container bg-primary-fixed px-2.5 py-1 rounded inline-block">
          Chapter {chapter.chapter_number}
        </span>
        <h1 className="text-2xl md:text-4xl font-bold font-sans text-primary tracking-tight">
          {chapter.title}
        </h1>
        {chapter.subtitle && (
          <p className="text-base md:text-lg text-secondary font-serif italic">
            {chapter.subtitle}
          </p>
        )}
        {chapter.summary && (
          <p className="text-xs md:text-sm text-on-surface leading-relaxed pt-2">
            {chapter.summary}
          </p>
        )}
      </div>

      {/* SECTIONS BREAKDOWN */}
      {sections.length > 0 && (
        <div className="space-y-3">
          <h2 className="text-lg font-bold text-primary flex items-center gap-2 border-b border-outline-variant/60 pb-2">
            <span className="material-symbols-outlined text-primary">view_list</span>
            <span>Chapter Sections ({sections.length})</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {sections.map((sec, idx) => (
              <div
                key={sec.id || idx}
                className="p-3.5 rounded bg-surface-container-lowest border border-outline-variant text-xs space-y-1"
              >
                <div className="font-bold text-primary text-sm">{sec.title}</div>
                {sec.summary && <p className="text-on-surface-variant">{sec.summary}</p>}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* GRAMMAR RULES TAUGHT */}
      <div className="space-y-4">
        <div className="flex items-center justify-between border-b border-outline-variant/60 pb-2">
          <h2 className="text-xl font-bold text-primary flex items-center gap-2">
            <span className="material-symbols-outlined text-primary">menu_book</span>
            <span>Grammar Rules in Chapter</span>
          </h2>
          <span className="text-xs font-mono text-on-surface-variant">
            {grammarRules.length} rules
          </span>
        </div>

        {grammarRules.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {grammarRules.map((rule) => (
              <div
                key={rule.id}
                className="p-4 rounded bg-surface-container-lowest border border-outline-variant flex flex-col justify-between group"
              >
                <div className="space-y-1.5">
                  <div className="flex items-start justify-between">
                    <Link
                      href={`/grammar/${encodeURIComponent(rule.id)}`}
                      className="font-bold text-sm text-primary hover:underline"
                    >
                      {rule.title}
                    </Link>
                    <PriorityBadge priority={rule.priority} />
                  </div>
                  {rule.formation_pattern && (
                    <div className="p-1.5 rounded bg-surface-container font-mono text-[11px] text-primary">
                      {rule.formation_pattern}
                    </div>
                  )}
                </div>
                <div className="pt-2 mt-2 border-t border-surface-container text-right">
                  <CrossLink type="grammar" id={rule.id} label="View Rule" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-xs text-on-surface-variant italic">
            No specific grammar rules directly keyed to this chapter header.
          </p>
        )}
      </div>

      {/* VERBS INTRODUCED */}
      {verbs.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between border-b border-outline-variant/60 pb-2">
            <h2 className="text-lg font-bold text-primary flex items-center gap-2">
              <span className="material-symbols-outlined text-primary">translate</span>
              <span>Verbs Introduced ({verbs.length})</span>
            </h2>
          </div>
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

      {/* VOCABULARY IN CHAPTER */}
      {vocabulary.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between border-b border-outline-variant/60 pb-2">
            <h2 className="text-lg font-bold text-primary flex items-center gap-2">
              <span className="material-symbols-outlined text-primary">dictionary</span>
              <span>Chapter Vocabulary ({vocabulary.length})</span>
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
            {vocabulary.slice(0, 30).map((vc) => (
              <div
                key={vc.id}
                className="p-2.5 rounded bg-surface-container-lowest border border-outline-variant text-xs flex items-center justify-between"
              >
                <div>
                  <span className="font-bold text-primary">{vc.french}</span>
                  <span className="text-on-surface-variant block text-[11px]">{vc.english}</span>
                </div>
                <div className="flex items-center gap-1">
                  <PosBadge pos={vc.part_of_speech} />
                  <GenderBadge gender={vc.gender} />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* EXERCISES IN CHAPTER */}
      {exercises.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between border-b border-outline-variant/60 pb-2">
            <h2 className="text-lg font-bold text-primary flex items-center gap-2">
              <span className="material-symbols-outlined text-primary">fitness_center</span>
              <span>Practice Exercises ({exercises.length})</span>
            </h2>
          </div>
          <div className="space-y-3">
            {exercises.map((ex) => (
              <div
                key={ex.id}
                className="p-4 rounded-lg bg-surface-container-lowest border border-outline-variant space-y-2 text-xs"
              >
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-sm text-primary">
                    {ex.title || `Exercise ${ex.id}`}
                  </h3>
                  <span className="font-mono text-on-surface-variant">
                    {ex.questions_count} questions
                  </span>
                </div>
                {ex.instructions && (
                  <p className="text-on-surface-variant font-medium">{ex.instructions}</p>
                )}
                {ex.questions && ex.questions.length > 0 && (
                  <div className="divide-y divide-surface-container pt-2 border-t border-surface-container">
                    {ex.questions.slice(0, 5).map((q, qIdx) => (
                      <div key={qIdx} className="py-1.5 flex justify-between gap-4">
                        <span className="text-on-surface">
                          <strong>{q.number}.</strong> {q.prompt}
                        </span>
                        {q.answer && (
                          <span className="font-mono text-primary font-bold">{q.answer}</span>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
