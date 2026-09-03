import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getConceptById } from "@/src/lib/data/selectors";
import { ConceptDetailView } from "@/src/components/concepts/ConceptDetailView";

interface ConceptDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function ConceptDetailPage({ params }: ConceptDetailPageProps) {
  const { id } = await params;
  let decodedId = id;
  try {
    decodedId = decodeURIComponent(id);
  } catch {}

  const data = getConceptById(decodedId) || getConceptById(id);

  if (!data) {
    notFound();
  }

  const { concept, grammarRules, tenses, verbs, expressions, vocabulary, examples } = data;

  return (
    <div className="space-y-4 pb-16">
      {/* TOP NAVIGATION / BREADCRUMBS */}
      <div className="flex items-center justify-between">
        <Link
          href="/concepts"
          className="inline-flex items-center gap-1.5 text-xs font-mono text-on-surface-variant hover:text-primary transition-colors"
        >
          <span className="material-symbols-outlined text-[16px]">arrow_back</span>
          <span>Back to Concepts Explorer</span>
        </Link>
        <span className="text-xs font-mono text-on-surface-variant bg-surface-container px-2.5 py-1 rounded">
          Deep Dive: {concept.name}
        </span>
      </div>

      {/* CONCEPT DETAIL VIEW */}
      <ConceptDetailView
        concept={concept}
        grammarRules={grammarRules}
        tenses={tenses}
        verbs={verbs}
        expressions={expressions}
        vocabulary={vocabulary}
        examples={examples}
      />
    </div>
  );
}
