import React from "react";
import Link from "next/link";
import { getExceptionsAndTraps } from "@/src/lib/data/selectors";
import { PriorityBadge, CEFRBadge } from "@/src/components/ui/Badges";

interface TrapsPageProps {
  searchParams: Promise<{
    query?: string;
    category?: string;
    page?: string;
  }>;
}

export default async function TrapsPage({ searchParams }: TrapsPageProps) {
  const params = await searchParams;
  const query = params.query || "";
  const category = params.category || "all";
  const currentPage = params.page ? parseInt(params.page, 10) : 1;
  const pageSize = 30;

  const { traps, total } = getExceptionsAndTraps({
    query,
    category,
    limit: pageSize,
    offset: (currentPage - 1) * pageSize,
  });

  const totalPages = Math.ceil(total / pageSize);

  const categories = [
    "All Categories",
    "Verbs & Conjugation",
    "Spelling & Orthography",
    "Prepositions",
    "Articles & Nouns",
    "Adjectives & Agreement",
    "Pronouns",
    "Negation",
  ];

  return (
    <div className="space-y-6 pb-12">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-outline-variant/60 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-amber-600 text-2xl">warning</span>
            <h1 className="text-2xl md:text-3xl font-bold text-amber-950 font-sans">
              Pitfalls & Common Traps Library
            </h1>
          </div>
          <p className="text-xs md:text-sm text-on-surface-variant mt-1">
            Curated index of {total} frequent pitfalls, false friends, and irregular traps with side-by-side correct vs. incorrect forms.
          </p>
        </div>
        <div className="text-xs font-mono px-3 py-1.5 rounded-lg bg-amber-100 text-amber-900 border border-amber-300 self-start md:self-auto font-semibold">
          {total} Traps Cataloged
        </div>
      </div>

      {/* FILTER BAR */}
      <form method="GET" className="p-4 rounded-xl bg-amber-50/50 border border-amber-200 space-y-3">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1 relative">
            <input
              type="text"
              name="query"
              defaultValue={query}
              placeholder="Search traps, keywords, or error patterns..."
              className="w-full px-3 py-2 pl-8 rounded bg-surface-container-lowest border border-amber-300 text-sm text-on-surface focus:outline-none focus:border-amber-600"
            />
            <span className="material-symbols-outlined absolute left-2 top-2.5 text-[18px] text-amber-700">
              search
            </span>
          </div>

          <div className="sm:w-56">
            <select
              name="category"
              defaultValue={category}
              className="w-full px-3 py-2 rounded bg-surface-container-lowest border border-amber-300 text-sm text-on-surface focus:outline-none focus:border-amber-600"
              aria-label="Filter by category"
            >
              {categories.map((c) => (
                <option key={c} value={c === "All Categories" ? "all" : c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href="/traps"
              className="px-3 py-2 text-xs text-on-surface-variant hover:text-primary transition-colors"
            >
              Reset
            </Link>
            <button
              type="submit"
              className="px-4 py-2 rounded bg-amber-700 text-white text-xs font-semibold hover:bg-amber-800 transition-colors"
            >
              Filter Traps
            </button>
          </div>
        </div>
      </form>

      {/* TRAPS GRID */}
      {traps.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {traps.map((trap) => (
            <div
              key={trap.id}
              className="p-5 rounded-xl bg-surface-container-lowest border border-amber-200/80 hover:border-amber-400 transition-all flex flex-col justify-between shadow-xs space-y-3"
            >
              <div className="space-y-2">
                <div className="flex items-start justify-between gap-2">
                  <h2 className="font-bold text-base text-amber-950 leading-snug">
                    {trap.title}
                  </h2>
                  <div className="flex items-center gap-1">
                    {trap.category && (
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-100 text-amber-900 border border-amber-300 whitespace-nowrap">
                        {trap.category}
                      </span>
                    )}
                    <PriorityBadge priority={trap.priority} />
                    <CEFRBadge cefr={trap.cefr} />
                  </div>
                </div>

                <p className="text-xs text-on-surface-variant leading-relaxed">
                  {trap.description}
                </p>

                {/* Side-by-side Correct vs Incorrect Form */}
                {(trap.correct_form || trap.incorrect_form) && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2 font-mono text-xs">
                    {trap.correct_form && (
                      <div className="p-2.5 rounded-lg bg-emerald-50 border border-emerald-300 text-emerald-950">
                        <span className="block text-[10px] uppercase font-bold text-emerald-800 mb-0.5">
                          ✓ Correct Form:
                        </span>
                        <span className="font-bold text-sm">{trap.correct_form}</span>
                      </div>
                    )}
                    {trap.incorrect_form && (
                      <div className="p-2.5 rounded-lg bg-rose-50 border border-rose-300 text-rose-950">
                        <span className="block text-[10px] uppercase font-bold text-rose-800 mb-0.5">
                          ✗ Common Mistake:
                        </span>
                        <span className="line-through text-rose-800 font-bold text-sm">{trap.incorrect_form}</span>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Related Grammar Rules & Verbs */}
              <div className="pt-3 border-t border-surface-container flex flex-wrap items-center justify-between gap-2 text-xs">
                <div className="flex flex-wrap items-center gap-1">
                  {trap.related_grammar_rules && trap.related_grammar_rules.length > 0 && (
                    <Link
                      href={`/grammar/${encodeURIComponent(trap.related_grammar_rules[0])}`}
                      className="text-[11px] font-mono text-primary bg-surface-container px-2 py-0.5 rounded hover:underline"
                    >
                      rule: {trap.related_grammar_rules[0]}
                    </Link>
                  )}
                  {trap.related_verbs && trap.related_verbs.length > 0 && (
                    <Link
                      href={`/verbs/${encodeURIComponent(trap.related_verbs[0])}`}
                      className="text-[11px] font-mono text-primary bg-surface-container px-2 py-0.5 rounded hover:underline"
                    >
                      verb: {trap.related_verbs[0]}
                    </Link>
                  )}
                </div>

                {trap.raw_chapters && trap.raw_chapters.length > 0 && (
                  <Link
                    href={`/chapters/${trap.raw_chapters[0]}`}
                    className="text-[10px] font-mono text-on-surface-variant hover:text-primary"
                  >
                    Chapter {trap.raw_chapters[0]}
                  </Link>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="p-12 text-center rounded-xl border border-dashed border-outline-variant bg-surface-container-lowest">
          <span className="material-symbols-outlined text-4xl text-amber-600 mb-2">warning</span>
          <h3 className="text-base font-bold text-primary">No traps found</h3>
          <p className="text-xs text-on-surface-variant mt-1">
            Try adjusting your search query or removing filters.
          </p>
          <Link
            href="/traps"
            className="inline-block mt-4 px-4 py-2 rounded bg-amber-700 text-white text-xs font-semibold"
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
                href={`/traps?query=${encodeURIComponent(query)}&page=${currentPage - 1}`}
                className="px-3 py-1.5 rounded bg-surface-container-high hover:bg-surface-container-highest border border-outline-variant"
              >
                &larr; Previous
              </Link>
            )}
            {currentPage < totalPages && (
              <Link
                href={`/traps?query=${encodeURIComponent(query)}&page=${currentPage + 1}`}
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
