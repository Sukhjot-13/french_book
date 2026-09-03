import React from "react";
import Link from "next/link";
import { getExamples, getChapters } from "@/src/lib/data/selectors";

interface ExamplesPageProps {
  searchParams: Promise<{
    query?: string;
    chapterId?: string;
    page?: string;
  }>;
}

export default async function ExamplesPage({ searchParams }: ExamplesPageProps) {
  const params = await searchParams;
  const query = params.query || "";
  const chapterId = params.chapterId || "all";
  const currentPage = params.page ? parseInt(params.page, 10) : 1;
  const pageSize = 40;

  const { examples, total } = getExamples({
    query,
    chapterId,
    limit: pageSize,
    offset: (currentPage - 1) * pageSize,
  });

  const chapters = getChapters();
  const totalPages = Math.ceil(total / pageSize);

  return (
    <div className="space-y-6 pb-12">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-outline-variant/60 pb-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-primary font-sans">
            Global Example Explorer
          </h1>
          <p className="text-xs md:text-sm text-on-surface-variant mt-1">
            Bilingual French sentence bank with grammatical focus spans and direct cross-references to verbs and rules.
          </p>
        </div>
        <div className="text-xs font-mono px-3 py-1.5 rounded-lg bg-surface-container-high border border-outline-variant/50 self-start md:self-auto">
          Showing <strong className="text-primary">{examples.length}</strong> of{" "}
          <strong className="text-primary">{total}</strong> sentences
        </div>
      </div>

      {/* FILTER BAR */}
      <form method="GET" className="p-4 rounded-xl bg-surface-container-low border border-outline-variant space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {/* Search */}
          <div className="sm:col-span-2">
            <label className="block text-[11px] font-mono uppercase text-on-surface-variant mb-1">
              Search Sentences
            </label>
            <div className="relative">
              <input
                type="text"
                name="query"
                defaultValue={query}
                placeholder="e.g. café, train, nous sommes..."
                className="w-full px-3 py-2 pl-8 rounded bg-surface-container-lowest border border-outline-variant text-sm text-on-surface focus:outline-none focus:border-primary"
              />
              <span className="material-symbols-outlined absolute left-2 top-2.5 text-[18px] text-on-surface-variant">
                search
              </span>
            </div>
          </div>

          {/* Chapter Filter */}
          <div>
            <label className="block text-[11px] font-mono uppercase text-on-surface-variant mb-1">
              Filter by Chapter
            </label>
            <select
              name="chapterId"
              defaultValue={chapterId}
              className="w-full px-3 py-2 rounded bg-surface-container-lowest border border-outline-variant text-sm text-on-surface focus:outline-none focus:border-primary"
            >
              <option value="all">All Chapters</option>
              {chapters.map((ch) => (
                <option key={ch.id} value={ch.id}>
                  Ch {ch.chapter_number}: {ch.title}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex items-center justify-end gap-2 pt-2 border-t border-outline-variant/40">
          <Link
            href="/examples"
            className="px-3 py-1.5 text-xs text-on-surface-variant hover:text-primary transition-colors"
          >
            Reset
          </Link>
          <button
            type="submit"
            className="px-4 py-1.5 rounded bg-[#002147] text-white text-xs font-semibold hover:bg-primary transition-colors"
          >
            Apply Filters
          </button>
        </div>
      </form>

      {/* EXAMPLES LIST */}
      {examples.length > 0 ? (
        <div className="divide-y divide-outline-variant/50 rounded-xl border border-outline-variant overflow-hidden bg-surface-container-lowest shadow-xs">
          {examples.map((ex) => (
            <div key={ex.id} className="p-4 md:p-5 hover:bg-surface-container-low transition-colors space-y-2">
              <p className="text-base md:text-lg text-primary font-serif leading-snug">
                {ex.french}
              </p>
              <p className="text-xs md:text-sm text-on-surface-variant font-sans">
                {ex.english}
              </p>

              {/* Focus Spans & Entities Tagging */}
              <div className="flex flex-wrap items-center gap-1.5 pt-2 text-xs">
                {ex.focus_spans && ex.focus_spans.length > 0 && (
                  <div className="flex flex-wrap items-center gap-1">
                    {ex.focus_spans.map((span, sIdx) => (
                      <span
                        key={sIdx}
                        className="px-2 py-0.5 rounded bg-blue-100 text-blue-900 font-mono text-[11px] font-semibold border border-blue-200"
                        title={span.focus_type || "Focus span"}
                      >
                        🎯 {span.text}
                      </span>
                    ))}
                  </div>
                )}

                {ex.related_verbs && ex.related_verbs.length > 0 && (
                  <div className="flex flex-wrap items-center gap-1">
                    {ex.related_verbs.map((v, vIdx) => (
                      <Link
                        key={vIdx}
                        href={`/verbs/${encodeURIComponent(v)}`}
                        className="px-2 py-0.5 rounded bg-purple-50 text-purple-900 hover:bg-purple-100 font-mono text-[11px] border border-purple-200"
                      >
                        verb: {v}
                      </Link>
                    ))}
                  </div>
                )}

                {ex.related_grammar_rules && ex.related_grammar_rules.length > 0 && (
                  <div className="flex flex-wrap items-center gap-1">
                    {ex.related_grammar_rules.map((rule, rIdx) => (
                      <Link
                        key={rIdx}
                        href={`/grammar/${encodeURIComponent(rule)}`}
                        className="px-2 py-0.5 rounded bg-amber-50 text-amber-900 hover:bg-amber-100 font-mono text-[11px] border border-amber-200"
                      >
                        rule: {rule}
                      </Link>
                    ))}
                  </div>
                )}

                {ex.raw_chapters && ex.raw_chapters.length > 0 && (
                  <div className="flex items-center gap-1 ml-auto">
                    {ex.raw_chapters.map((chNum) => (
                      <Link
                        key={chNum}
                        href={`/chapters/${chNum}`}
                        className="px-2 py-0.5 rounded bg-surface-container font-mono text-[10px] text-primary hover:bg-primary hover:text-white transition-colors"
                      >
                        Ch {chNum}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="p-12 text-center rounded-xl border border-dashed border-outline-variant bg-surface-container-lowest">
          <span className="material-symbols-outlined text-4xl text-outline mb-2">format_quote</span>
          <h3 className="text-base font-bold text-primary">No example sentences found</h3>
          <p className="text-xs text-on-surface-variant mt-1">
            Try adjusting your search query or removing filters.
          </p>
          <Link
            href="/examples"
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
                href={`/examples?query=${encodeURIComponent(query)}&chapterId=${chapterId}&page=${currentPage - 1}`}
                className="px-3 py-1.5 rounded bg-surface-container-high hover:bg-surface-container-highest border border-outline-variant"
              >
                &larr; Previous
              </Link>
            )}
            {currentPage < totalPages && (
              <Link
                href={`/examples?query=${encodeURIComponent(query)}&chapterId=${chapterId}&page=${currentPage + 1}`}
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
