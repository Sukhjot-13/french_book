import React from "react";
import Link from "next/link";
import { getGrammarRules } from "@/src/lib/data/selectors";
import { PriorityBadge } from "@/src/components/ui/Badges";

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
  const currentPage = params.page ? parseInt(params.page, 10) : 1;
  const pageSize = 40;

  const { rules, total } = getGrammarRules({
    query,
    limit: pageSize,
    offset: (currentPage - 1) * pageSize,
  });

  const totalPages = Math.ceil(total / pageSize);

  return (
    <div className="space-y-6 pb-12">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-outline-variant/60 pb-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-primary font-sans">
            Grammar Rules Library
          </h1>
          <p className="text-xs md:text-sm text-on-surface-variant mt-1">
            Exhaustive inventory of {total} French grammar rules with formation patterns, signal words, transformations, and trap callouts.
          </p>
        </div>
        <div className="text-xs font-mono px-3 py-1.5 rounded-lg bg-surface-container-high border border-outline-variant/50 self-start md:self-auto">
          Showing <strong className="text-primary">{rules.length}</strong> of{" "}
          <strong className="text-primary">{total}</strong> rules
        </div>
      </div>

      {/* SEARCH BAR */}
      <form method="GET" className="p-4 rounded-xl bg-surface-container-low border border-outline-variant">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1 relative">
            <input
              type="text"
              name="query"
              defaultValue={query}
              placeholder="Search grammar rules, explanations, or formation..."
              className="w-full px-3 py-2 pl-8 rounded bg-surface-container-lowest border border-outline-variant text-sm text-on-surface focus:outline-none focus:border-primary"
            />
            <span className="material-symbols-outlined absolute left-2 top-2.5 text-[18px] text-on-surface-variant">
              search
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Link
              href="/grammar"
              className="px-3 py-2 text-xs text-on-surface-variant hover:text-primary transition-colors"
            >
              Reset
            </Link>
            <button
              type="submit"
              className="px-4 py-2 rounded bg-[#002147] text-white text-xs font-semibold hover:bg-primary transition-colors"
            >
              Search
            </button>
          </div>
        </div>
      </form>

      {/* GRAMMAR RULES LIST */}
      {rules.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {rules.map((rule) => (
            <div
              key={rule.id}
              className="p-5 rounded-xl bg-surface-container-lowest border border-outline-variant hover:border-primary transition-all duration-150 flex flex-col justify-between shadow-xs group"
            >
              <div className="space-y-2">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <Link
                      href={`/grammar/${encodeURIComponent(rule.title)}`}
                      className="font-bold text-base text-primary hover:underline group-hover:text-primary-container"
                    >
                      {rule.title}
                    </Link>
                    {rule.category && (
                      <span className="inline-block text-[10px] font-mono px-1.5 py-0.2 rounded bg-surface-container-high text-on-surface-variant uppercase mt-1">
                        {rule.category}
                      </span>
                    )}
                  </div>
                  <PriorityBadge priority={rule.priority} />
                </div>

                <p className="text-xs text-on-surface-variant line-clamp-3 leading-relaxed">
                  {rule.summary || rule.explanation}
                </p>

                {rule.formation && (
                  <div className="p-2 rounded bg-surface-container font-mono text-xs text-primary border border-outline-variant/40">
                    <span className="font-bold text-[10px] uppercase block text-on-surface-variant">Formation:</span>
                    {rule.formation}
                  </div>
                )}
              </div>

              <div className="flex items-center justify-between pt-4 mt-3 border-t border-surface-container text-xs">
                <div className="flex items-center gap-1.5">
                  {rule.common_traps && rule.common_traps.length > 0 && (
                    <span className="inline-flex items-center gap-1 text-[11px] font-mono text-amber-900 bg-amber-100 px-1.5 py-0.5 rounded">
                      ⚠️ {rule.common_traps.length} trap{rule.common_traps.length > 1 ? "s" : ""}
                    </span>
                  )}
                  {rule.exceptions && rule.exceptions.length > 0 && (
                    <span className="inline-flex items-center gap-1 text-[11px] font-mono text-rose-900 bg-rose-100 px-1.5 py-0.5 rounded">
                      {rule.exceptions.length} exception{rule.exceptions.length > 1 ? "s" : ""}
                    </span>
                  )}
                </div>

                <Link
                  href={`/grammar/${encodeURIComponent(rule.title)}`}
                  className="inline-flex items-center gap-1 text-xs font-mono font-medium text-primary hover:underline"
                >
                  <span>Explore Rule</span>
                  <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
                </Link>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="p-12 text-center rounded-xl border border-dashed border-outline-variant bg-surface-container-lowest">
          <span className="material-symbols-outlined text-4xl text-outline mb-2">menu_book</span>
          <h3 className="text-base font-bold text-primary">No grammar rules found</h3>
          <p className="text-xs text-on-surface-variant mt-1">
            Try adjusting your search query or removing filters.
          </p>
          <Link
            href="/grammar"
            className="inline-block mt-4 px-4 py-2 rounded bg-primary text-white text-xs font-semibold"
          >
            Clear All Filters
          </Link>
        </div>
      )}

      {/* PAGINATION */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between border-t border-outline-variant/60 pt-4 text-xs font-mono text-on-surface-variant">
          <div>
            Page {currentPage} of {totalPages}
          </div>
          <div className="flex items-center gap-2">
            {currentPage > 1 && (
              <Link
                href={`/grammar?query=${encodeURIComponent(query)}&page=${currentPage - 1}`}
                className="px-3 py-1.5 rounded bg-surface-container-high hover:bg-surface-container-highest border border-outline-variant"
              >
                &larr; Previous
              </Link>
            )}
            {currentPage < totalPages && (
              <Link
                href={`/grammar?query=${encodeURIComponent(query)}&page=${currentPage + 1}`}
                className="px-3 py-1.5 rounded bg-surface-container-high hover:bg-surface-container-highest border border-outline-variant"
              >
                Next &rarr;
              </Link>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
