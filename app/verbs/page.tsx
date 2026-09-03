import React from "react";
import { getVerbs } from "@/src/lib/data/selectors";
import { VerbLibraryTable } from "@/src/components/verbs/VerbLibraryTable";

interface VerbsPageProps {
  searchParams: Promise<{
    query?: string;
    group?: string;
    regularity?: string;
    auxiliary?: string;
    transitivity?: string;
    cefr?: string;
    priority?: string;
    page?: string;
  }>;
}

export default async function VerbsPage({ searchParams }: VerbsPageProps) {
  const params = await searchParams;
  const query = params.query || "";
  const group = params.group || "all";
  const regularity = params.regularity || "all";
  const auxiliary = params.auxiliary || "all";
  const transitivity = params.transitivity || "all";
  const cefr = params.cefr || "all";
  const currentPage = params.page ? parseInt(params.page, 10) : 1;
  const pageSize = 50;

  const { verbs, total } = getVerbs({
    query,
    group,
    regularity,
    auxiliary,
    transitivity,
    cefr,
    limit: pageSize,
    offset: (currentPage - 1) * pageSize,
  });

  return (
    <div className="space-y-4 pb-12">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-outline-variant/60 pb-3">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl md:text-2xl font-bold text-primary font-sans">
              Verbs Library
            </h1>
            <span className="text-xs font-mono px-2 py-0.5 rounded bg-surface-container-high text-on-surface-variant">
              {total} verbs
            </span>
          </div>
          <p className="text-xs text-on-surface-variant mt-0.5">
            Scan verbs at a glance, click any row to peek key conjugations and examples, or select lemma for deep dive.
          </p>
        </div>
      </div>

      {/* DENSE TABLE WITH PROGRESSIVE FILTERS & PEEK */}
      <VerbLibraryTable
        verbs={verbs}
        total={total}
        currentPage={currentPage}
        pageSize={pageSize}
        initialFilters={{
          query,
          group,
          regularity,
          auxiliary,
          transitivity,
          cefr,
        }}
      />
    </div>
  );
}
