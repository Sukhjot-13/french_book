import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getVocabularyById } from "@/src/lib/data/selectors";
import { getAllVocabularyIds } from "@/src/lib/data/staticParams";
import { VocabDetailView } from "@/src/components/vocabulary/VocabDetailView";

export const revalidate = false;

export function generateStaticParams() {
  return getAllVocabularyIds().map((id) => ({ id }));
}

interface VocabDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function VocabDetailPage({ params }: VocabDetailPageProps) {
  const { id } = await params;
  const data = getVocabularyById(id);

  if (!data) {
    notFound();
  }

  const { vocab, expressions, examples, relatedVerbs, relatedChapters } = data;

  return (
    <div className="space-y-4 pb-16">
      {/* TOP NAVIGATION / BREADCRUMBS */}
      <div className="flex items-center justify-between">
        <Link
          href="/vocabulary"
          className="inline-flex items-center gap-1.5 text-xs font-mono text-on-surface-variant hover:text-primary transition-colors"
        >
          <span className="material-symbols-outlined text-[16px]">arrow_back</span>
          <span>Back to Vocabulary Dictionary</span>
        </Link>
        <span className="text-xs font-mono text-on-surface-variant bg-surface-container px-2.5 py-1 rounded">
          Deep Dive: {vocab.french}
        </span>
      </div>

      {/* VOCABULARY DETAIL VIEW */}
      <VocabDetailView
        vocab={vocab}
        expressions={expressions}
        examples={examples}
        relatedVerbs={relatedVerbs}
        relatedChapters={relatedChapters}
      />
    </div>
  );
}
