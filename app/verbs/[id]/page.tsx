import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getVerbById } from "@/src/lib/data/selectors";
import { getAllVerbIds } from "@/src/lib/data/staticParams";
import { VerbDetailView } from "@/src/components/verbs/VerbDetailView";

export const revalidate = false;

export function generateStaticParams() {
  return getAllVerbIds().map((id) => ({ id }));
}

interface VerbDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function VerbDetailPage({ params }: VerbDetailPageProps) {
  const { id } = await params;
  let decodedId = id;
  try {
    decodedId = decodeURIComponent(id);
  } catch {}
  const data = getVerbById(decodedId) || getVerbById(id);

  if (!data) {
    notFound();
  }

  const { verb, conjugations, expressions, grammarRules, examples } = data;

  return (
    <div className="space-y-4 pb-16">
      {/* TOP BREADCRUMB NAVIGATION */}
      <div className="flex items-center justify-between">
        <Link
          href="/verbs"
          className="inline-flex items-center gap-1.5 text-xs font-mono text-on-surface-variant hover:text-primary transition-colors"
        >
          <span className="material-symbols-outlined text-[16px]">arrow_back</span>
          <span>Back to Verbs Library</span>
        </Link>
        <span className="text-xs font-mono text-on-surface-variant bg-surface-container px-2.5 py-1 rounded">
          Deep Dive: {verb.lemma}
        </span>
      </div>

      {/* REFACTORED VERB DETAIL COMPONENT */}
      <VerbDetailView
        verb={verb}
        conjugations={conjugations}
        expressions={expressions}
        grammarRules={grammarRules}
        examples={examples}
      />
    </div>
  );
}
