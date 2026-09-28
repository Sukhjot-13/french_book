import React from "react";
import { getGrammarRules } from "@/src/lib/data/selectors";
import { paginate } from "@/src/lib/pagination";
import { GrammarLibraryTable } from "@/src/components/grammar/GrammarLibraryTable";

interface GrammarPageProps {
  searchParams: Promise<{
    query?: string;
    priority?: string;
    page?: string;
  }>;
}

export default async function GrammarPage({ searchParams }: GrammarPageProps) {
  const params = await searchParams;
  const query = params.query || "";
  const pageSize = 40;

  const filtered = getGrammarRules({ query }).rules;
  const { items: rules, currentPage, total } = paginate(filtered, params.page, pageSize);

  return (
    <div className="space-y-4 pb-12">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-outline-variant/60 pb-3">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl md:text-2xl font-bold text-primary font-sans">
              Grammar Rules Library
            </h1>
            <span className="text-xs font-mono px-2 py-0.5 rounded bg-surface-container-high text-on-surface-variant">
              {total} rules
            </span>
          </div>
          <p className="text-xs text-on-surface-variant mt-0.5">
            Core syntactic mechanisms, formation formulas, and trap callouts. Click any row to peek rules and examples.
          </p>
        </div>
      </div>

      {/* DENSE SCAN-PEEK TABLE */}
      <GrammarLibraryTable
        rules={rules}
        total={total}
        currentPage={currentPage}
        pageSize={pageSize}
        initialQuery={query}
      />
    </div>
  );
}
