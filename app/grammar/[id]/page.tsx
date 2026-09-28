import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getGrammarRuleById } from "@/src/lib/data/selectors";
import { getAllGrammarIds } from "@/src/lib/data/staticParams";
import { GrammarDetailView } from "@/src/components/grammar/GrammarDetailView";

export const revalidate = false;

export function generateStaticParams() {
  return getAllGrammarIds().map((id) => ({ id }));
}

interface GrammarDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function GrammarDetailPage({ params }: GrammarDetailPageProps) {
  const { id } = await params;
  let decodedId = id;
  try {
    decodedId = decodeURIComponent(id);
  } catch {}
  const data = getGrammarRuleById(decodedId) || getGrammarRuleById(id);

  if (!data) {
    notFound();
  }

  const { rule, tenses, verbs, examples, traps } = data;

  return (
    <div className="space-y-4 pb-16">
      {/* TOP NAVIGATION / BREADCRUMBS */}
      <div className="flex items-center justify-between">
        <Link
          href="/grammar"
          className="inline-flex items-center gap-1.5 text-xs font-mono text-on-surface-variant hover:text-primary transition-colors"
        >
          <span className="material-symbols-outlined text-[16px]">arrow_back</span>
          <span>Back to Grammar Library</span>
        </Link>
        <span className="text-xs font-mono text-on-surface-variant bg-surface-container px-2.5 py-1 rounded">
          Deep Dive: {rule.title}
        </span>
      </div>

      {/* REFACTORED GRAMMAR DETAIL VIEW */}
      <GrammarDetailView
        rule={rule}
        tenses={tenses}
        verbs={verbs}
        examples={examples}
        traps={traps}
      />
    </div>
  );
}
