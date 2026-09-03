import React from "react";
import { getExpressions } from "@/src/lib/data/selectors";
import { ExpressionLibraryTable } from "@/src/components/expressions/ExpressionLibraryTable";

interface ExpressionsPageProps {
  searchParams: Promise<{
    query?: string;
    type?: string;
    register?: string;
    preposition?: string;
    baseVerb?: string;
    page?: string;
  }>;
}

export default async function ExpressionsPage({ searchParams }: ExpressionsPageProps) {
  const params = await searchParams;
  const query = params.query || "";
  const type = params.type || "all";
  const register = params.register || "all";
  const preposition = params.preposition || "all";
  const baseVerb = params.baseVerb || "all";
  const currentPage = params.page ? parseInt(params.page, 10) : 1;
  const pageSize = 50;

  const { expressions, total } = getExpressions({
    query,
    type,
    register,
    preposition,
    baseVerb,
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
              Expressions & Collocations
            </h1>
            <span className="text-xs font-mono px-2 py-0.5 rounded bg-surface-container-high text-on-surface-variant">
              {total} expressions
            </span>
          </div>
          <p className="text-xs text-on-surface-variant mt-0.5">
            Idiomatic formulas, syntactic structures, and verbal collocations. Click any row to peek prepositions and examples.
          </p>
        </div>
      </div>

      {/* DENSE EXPRESSIONS TABLE WITH PEEK */}
      <ExpressionLibraryTable
        expressions={expressions}
        total={total}
        currentPage={currentPage}
        pageSize={pageSize}
        initialFilters={{
          query,
          type,
          register,
          preposition,
          baseVerb,
        }}
      />
    </div>
  );
}
