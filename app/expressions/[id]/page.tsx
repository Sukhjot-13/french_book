import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getExpressionById } from "@/src/lib/data/selectors";
import { getAllExpressionIds } from "@/src/lib/data/staticParams";
import { ExpressionDetailView } from "@/src/components/expressions/ExpressionDetailView";

export const revalidate = false;

export function generateStaticParams() {
  return getAllExpressionIds().map((id) => ({ id }));
}

interface ExpressionDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function ExpressionDetailPage({ params }: ExpressionDetailPageProps) {
  const { id } = await params;
  let decodedId = id;
  try {
    decodedId = decodeURIComponent(id);
  } catch {}
  const data = getExpressionById(decodedId) || getExpressionById(id);

  if (!data) {
    notFound();
  }

  const { expression, verbs, examples, vocabulary } = data;

  return (
    <div className="space-y-4 pb-16">
      {/* TOP NAVIGATION / BREADCRUMBS */}
      <div className="flex items-center justify-between">
        <Link
          href="/expressions"
          className="inline-flex items-center gap-1.5 text-xs font-mono text-on-surface-variant hover:text-primary transition-colors"
        >
          <span className="material-symbols-outlined text-[16px]">arrow_back</span>
          <span>Back to Expressions Library</span>
        </Link>
        <span className="text-xs font-mono text-on-surface-variant bg-surface-container px-2.5 py-1 rounded">
          Deep Dive: {expression.french}
        </span>
      </div>

      {/* REFACTORED EXPRESSION DETAIL VIEW */}
      <ExpressionDetailView
        expression={expression}
        verbs={verbs}
        examples={examples}
        vocabulary={vocabulary}
      />
    </div>
  );
}
