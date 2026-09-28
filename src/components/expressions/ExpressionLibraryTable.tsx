"use client";

import React, { useState, useTransition } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { ExpressionUI } from "@/src/lib/data/selectors";
import { usePeek } from "../peek/PeekContext";

interface ExpressionLibraryTableProps {
  expressions: ExpressionUI[];
  total: number;
  currentPage: number;
  pageSize: number;
  initialFilters: {
    query?: string;
    type?: string;
    register?: string;
    preposition?: string;
    baseVerb?: string;
  };
}

const COMMON_PREPOSITIONS = ["à", "de", "en", "pour", "sans", "sur", "avec"];
const COMMON_BASE_VERBS = ["avoir", "faire", "prendre", "être", "mettre", "aller", "donner", "tenir"];

export function ExpressionLibraryTable({
  expressions,
  total,
  currentPage,
  pageSize,
  initialFilters,
}: ExpressionLibraryTableProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { openPeek } = usePeek();
  const [, startTransition] = useTransition();

  const [searchQuery, setSearchQuery] = useState(initialFilters.query || "");
  const [showMoreFilters, setShowMoreFilters] = useState(
    Boolean(initialFilters.preposition && initialFilters.preposition !== "all") ||
      Boolean(initialFilters.baseVerb && initialFilters.baseVerb !== "all") ||
      Boolean(initialFilters.register && initialFilters.register !== "all")
  );

  const totalPages = Math.ceil(total / pageSize);

  const updateFilters = (newFilters: Record<string, string>) => {
    const params = new URLSearchParams(searchParams.toString());
    Object.entries(newFilters).forEach(([k, v]) => {
      if (!v || v === "all") {
        params.delete(k);
      } else {
        params.set(k, v);
      }
    });
    params.set("page", "1");
    startTransition(() => {
      router.push(`/expressions?${params.toString()}`);
    });
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateFilters({ query: searchQuery });
  };

  const activeCount = [
    initialFilters.type && initialFilters.type !== "all",
    initialFilters.register && initialFilters.register !== "all",
    initialFilters.preposition && initialFilters.preposition !== "all",
    initialFilters.baseVerb && initialFilters.baseVerb !== "all",
  ].filter(Boolean).length;

  return (
    <div className="space-y-4">
      {/* FILTER BAR */}
      <div className="p-3.5 rounded-xl bg-surface-container-low border border-outline-variant space-y-3">
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Quick Search */}
          <form onSubmit={handleSearchSubmit} className="flex-1 min-w-[220px]">
            <div className="relative">
              <label htmlFor="expressions-search" className="sr-only">
                Search expressions, meaning, or pattern
              </label>
              <input
                id="expressions-search"
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search expressions, meaning, or pattern..."
                className="w-full px-3 py-1.5 pl-8 rounded bg-surface-container-lowest border border-outline-variant text-xs text-on-surface focus:outline-none focus:border-primary font-sans"
              />
              <span className="material-symbols-outlined absolute left-2 top-1.5 text-[18px] text-on-surface-variant">
                search
              </span>
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => {
                    setSearchQuery("");
                    updateFilters({ query: "" });
                  }}
                  className="absolute right-2 top-1.5 text-on-surface-variant hover:text-primary text-[14px]"
                  aria-label="Clear expression search"
                >
                  ×
                </button>
              )}
            </div>
          </form>

          {/* Type Filter */}
          <label htmlFor="expressions-filter-type" className="sr-only">
            Filter expressions by type
          </label>
          <select
            id="expressions-filter-type"
            value={initialFilters.type || "all"}
            onChange={(e) => updateFilters({ type: e.target.value })}
            className="px-2.5 py-1.5 rounded bg-surface-container-lowest border border-outline-variant text-xs text-on-surface font-mono focus:outline-none"
          >
            <option value="all">All Types</option>
            <option value="idiom">Idiom</option>
            <option value="collocation">Collocation</option>
            <option value="verbal_expression">Verbal Expression</option>
            <option value="fixed_expression">Fixed Expression</option>
            <option value="connector">Connector</option>
          </select>

          {/* Preposition Quick Select */}
          <label htmlFor="expressions-filter-preposition" className="sr-only">
            Filter expressions by preposition
          </label>
          <select
            id="expressions-filter-preposition"
            value={initialFilters.preposition || "all"}
            onChange={(e) => updateFilters({ preposition: e.target.value })}
            className="px-2.5 py-1.5 rounded bg-surface-container-lowest border border-outline-variant text-xs text-on-surface font-mono focus:outline-none"
          >
            <option value="all">Preposition: All</option>
            {COMMON_PREPOSITIONS.map((p) => (
              <option key={p} value={p}>
                prep: {p}
              </option>
            ))}
          </select>

          {/* More filters toggle button */}
          <button
            type="button"
            onClick={() => setShowMoreFilters(!showMoreFilters)}
            className={`inline-flex items-center gap-1 px-2.5 py-1.5 rounded text-xs font-mono border transition-colors ${
              showMoreFilters || activeCount > 0
                ? "bg-surface-container-high border-primary text-primary font-semibold"
                : "bg-surface-container-lowest border-outline-variant text-on-surface-variant hover:text-primary"
            }`}
          >
            <span className="material-symbols-outlined text-[15px]">tune</span>
            <span>More</span>
            {activeCount > 0 && (
              <span className="w-4 h-4 rounded-full bg-primary text-white text-[10px] flex items-center justify-center font-bold">
                {activeCount}
              </span>
            )}
          </button>
        </div>

        {/* Secondary Progressive Filter Drawer */}
        {showMoreFilters && (
          <div className="pt-2.5 border-t border-outline-variant/40 flex flex-wrap items-center gap-3 text-xs animate-in fade-in duration-100">
            {/* Base Verb */}
            <div className="flex items-center gap-1.5">
              <span className="text-[11px] font-mono text-on-surface-variant uppercase">
                Base Verb:
              </span>
              <label htmlFor="expressions-filter-base-verb" className="sr-only">
                Filter expressions by base verb
              </label>
              <select
                id="expressions-filter-base-verb"
                value={initialFilters.baseVerb || "all"}
                onChange={(e) => updateFilters({ baseVerb: e.target.value })}
                className="px-2 py-1 rounded bg-surface-container-lowest border border-outline-variant text-xs text-on-surface font-mono"
              >
                <option value="all">All Base Verbs</option>
                {COMMON_BASE_VERBS.map((v) => (
                  <option key={v} value={v}>
                    {v}
                  </option>
                ))}
              </select>
            </div>

            {/* Register */}
            <div className="flex items-center gap-1.5">
              <span className="text-[11px] font-mono text-on-surface-variant uppercase">
                Register:
              </span>
              <label htmlFor="expressions-filter-register" className="sr-only">
                Filter expressions by register
              </label>
              <select
                id="expressions-filter-register"
                value={initialFilters.register || "all"}
                onChange={(e) => updateFilters({ register: e.target.value })}
                className="px-2 py-1 rounded bg-surface-container-lowest border border-outline-variant text-xs text-on-surface font-mono"
              >
                <option value="all">All</option>
                <option value="formal">Formal</option>
                <option value="neutral">Neutral</option>
                <option value="informal">Informal</option>
                <option value="colloquial">Colloquial</option>
                <option value="literary">Literary</option>
              </select>
            </div>

            {/* Reset */}
            {(activeCount > 0 || initialFilters.query) && (
              <button
                type="button"
                onClick={() => {
                  setSearchQuery("");
                  router.push("/expressions");
                }}
                className="ml-auto text-xs text-on-surface-variant hover:text-primary underline font-mono"
              >
                Clear all filters
              </button>
            )}
          </div>
        )}
      </div>

      {/* DENSE EXPRESSIONS TABLE */}
      {expressions.length > 0 ? (
        <div className="rounded-xl border border-outline-variant overflow-hidden bg-surface-container-lowest shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-surface-container border-b border-outline-variant text-[11px] font-mono uppercase text-on-surface-variant tracking-wider">
                  <th className="py-2.5 px-3.5">Expression</th>
                  <th className="py-2.5 px-3.5">English Meaning</th>
                  <th className="py-2.5 px-3.5">Syntactic Pattern</th>
                  <th className="py-2.5 px-3.5">Base Verb / Prep</th>
                  <th className="py-2.5 px-3.5 text-right">Quick Peek</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/40">
                {expressions.map((exp) => {
                  return (
                    <tr
                      key={exp.id}
                      onClick={() => openPeek("expression", exp.french)}
                      className="hover:bg-surface-container-low transition-colors cursor-pointer group"
                    >
                      {/* Expression Name */}
                      <td className="py-2.5 px-3.5 font-semibold text-primary">
                        <Link
                          href={`/expressions/${encodeURIComponent(exp.french)}`}
                          onClick={(e) => e.stopPropagation()}
                          className="font-bold text-sm text-primary hover:underline block"
                        >
                          {exp.french}
                        </Link>
                        <span className="text-[10px] font-mono text-on-surface-variant/70 capitalize">
                          {exp.type.replace("_", " ")}
                        </span>
                      </td>

                      {/* English Meaning */}
                      <td className="py-2.5 px-3.5 text-on-surface font-medium">
                        {exp.english || "—"}
                      </td>

                      {/* Syntactic Pattern (Point 13: emphasized prominently) */}
                      <td className="py-2.5 px-3.5">
                        {exp.pattern ? (
                          <span className="font-mono text-[11px] text-blue-900 bg-blue-50 px-2 py-0.5 rounded border border-blue-200 inline-block font-semibold">
                            {exp.pattern}
                          </span>
                        ) : (
                          <span className="text-on-surface-variant/60 font-mono text-[11px]">
                            —
                          </span>
                        )}
                      </td>

                      {/* Base Verb & Prepositions */}
                      <td className="py-2.5 px-3.5 font-mono text-on-surface-variant text-[11px]">
                        {exp.related_verbs?.length > 0 && (
                          <span className="font-semibold text-primary mr-2">
                            {exp.related_verbs.join(", ")}
                          </span>
                        )}
                        {exp.prepositions?.length > 0 && (
                          <span className="text-on-surface-variant/80">
                            [{exp.prepositions.join(", ")}]
                          </span>
                        )}
                        {!exp.related_verbs?.length && !exp.prepositions?.length && <span>—</span>}
                      </td>

                      {/* Quick Peek */}
                      <td className="py-2.5 px-3.5 text-right">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            openPeek("expression", exp.french);
                          }}
                          className="px-2 py-1 rounded text-[11px] font-mono text-primary bg-surface-container group-hover:bg-[#002147] group-hover:text-white transition-colors"
                        >
                          Peek →
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="p-3 border-t border-outline-variant bg-surface-container-low flex items-center justify-between text-xs font-mono text-on-surface-variant">
              <div>
                Page <strong>{currentPage}</strong> of <strong>{totalPages}</strong> ({total} expressions)
              </div>
              <div className="flex items-center gap-1.5">
                {currentPage > 1 && (
                  <Link
                    href={`/expressions?${new URLSearchParams({
                      ...Object.fromEntries(searchParams.entries()),
                      page: String(currentPage - 1),
                    }).toString()}`}
                    className="px-2.5 py-1 rounded bg-surface-container hover:bg-surface-container-high text-primary border border-outline-variant/60"
                  >
                    ← Previous
                  </Link>
                )}
                {currentPage < totalPages && (
                  <Link
                    href={`/expressions?${new URLSearchParams({
                      ...Object.fromEntries(searchParams.entries()),
                      page: String(currentPage + 1),
                    }).toString()}`}
                    className="px-2.5 py-1 rounded bg-surface-container hover:bg-surface-container-high text-primary border border-outline-variant/60"
                  >
                    Next →
                  </Link>
                )}
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="p-12 text-center rounded-xl border border-outline-variant bg-surface-container-lowest text-on-surface-variant space-y-2">
          <span className="material-symbols-outlined text-4xl text-outline">search_off</span>
          <p className="text-sm font-medium">No expressions found matching your filter criteria.</p>
          <button
            onClick={() => router.push("/expressions")}
            className="text-xs text-primary underline font-mono"
          >
            Clear all filters
          </button>
        </div>
      )}
    </div>
  );
}
