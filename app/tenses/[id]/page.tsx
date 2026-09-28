import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getTenseById } from "@/src/lib/data/selectors";
import { getAllTenseIds } from "@/src/lib/data/staticParams";
import { TenseDetailView } from "@/src/components/tenses/TenseDetailView";

export const revalidate = false;

export function generateStaticParams() {
  return getAllTenseIds().map((id) => ({ id }));
}

interface TenseDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function TenseDetailPage({ params }: TenseDetailPageProps) {
  const { id } = await params;
  let decodedId = id;
  try {
    decodedId = decodeURIComponent(id);
  } catch {}
  const data = getTenseById(decodedId) || getTenseById(id);

  if (!data) {
    notFound();
  }

  const { tense, conjugations, grammarRules, examples, traps } = data;

  return (
    <div className="space-y-4 pb-16">
      {/* TOP NAVIGATION / BREADCRUMBS */}
      <div className="flex items-center justify-between">
        <Link
          href="/tenses"
          className="inline-flex items-center gap-1.5 text-xs font-mono text-on-surface-variant hover:text-primary transition-colors"
        >
          <span className="material-symbols-outlined text-[16px]">arrow_back</span>
          <span>Back to Tenses Atlas</span>
        </Link>
        <span className="text-xs font-mono text-on-surface-variant bg-surface-container px-2.5 py-1 rounded">
          Deep Dive: {tense.name_fr}
        </span>
      </div>

      {/* REFACTORED TENSE DETAIL VIEW */}
      <TenseDetailView
        tense={tense}
        conjugations={conjugations}
        grammarRules={grammarRules}
        examples={examples}
        traps={traps}
      />
    </div>
  );
}
