import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getChapterById } from "@/src/lib/data/selectors";
import { ChapterDetailView } from "@/src/components/chapters/ChapterDetailView";

interface ChapterDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function ChapterDetailPage({ params }: ChapterDetailPageProps) {
  const { id } = await params;
  const data = getChapterById(id);

  if (!data) {
    notFound();
  }

  const {
    chapter,
    sections,
    grammarRules,
    verbs,
    vocabulary,
    expressions,
    exercises,
    examples,
  } = data;

  return (
    <div className="space-y-4 pb-16">
      {/* TOP NAVIGATION / BREADCRUMBS */}
      <div className="flex items-center justify-between">
        <Link
          href="/chapters"
          className="inline-flex items-center gap-1.5 text-xs font-mono text-on-surface-variant hover:text-primary transition-colors"
        >
          <span className="material-symbols-outlined text-[16px]">arrow_back</span>
          <span>Back to Chapters Index</span>
        </Link>
        <span className="text-xs font-mono text-on-surface-variant bg-surface-container px-2.5 py-1 rounded">
          Chapter {chapter.chapter_number}
        </span>
      </div>

      {/* REFACTORED CHAPTER DETAIL VIEW */}
      <ChapterDetailView
        chapter={chapter}
        sections={sections}
        grammarRules={grammarRules}
        verbs={verbs}
        vocabulary={vocabulary}
        expressions={expressions}
        exercises={exercises}
        examples={examples}
      />
    </div>
  );
}
