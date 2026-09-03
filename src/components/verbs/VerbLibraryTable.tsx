"use client";

import React, { useState, useTransition } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { VerbUI } from "@/src/lib/data/selectors";
import { usePeek } from "../peek/PeekContext";

interface VerbLibraryTableProps {
  verbs: VerbUI[];
  total: number;
  currentPage: number;
  pageSize: number;
  initialFilters: {
    query?: string;
    group?: string;
    regularity?: string;
    auxiliary?: string;
    transitivity?: string;
    cefr?: string;
  };
}

export function VerbLibraryTable({
  verbs,
  total,
  currentPage,
  pageSize,
  initialFilters,
}: VerbLibraryTableProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { openPeek } = usePeek();
  const [isPending, startTransition] = useTransition();

  const [showMoreFilters, setShowMoreFilters] = useState(
    Boolean(initialFilters.transitivity && initialFilters.transitivity !== "all") ||
      Boolean(initialFilters.cefr && initialFilters.cefr !== "all")
  );

  const [searchQuery, setSearchQuery] = useState(initialFilters.query || "");

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
      router.replace(`/verbs?${params.toString()}`, { scroll: false });
    });
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateFilters({ query: searchQuery });
  };

  const activeFiltersCount = [
    initialFilters.group && initialFilters.group !== "all",
    initialFilters.regularity && initialFilters.regularity !== "all",
    initialFilters.auxiliary && initialFilters.auxiliary !== "all",
    initialFilters.transitivity && initialFilters.transitivity !== "all",
    initialFilters.cefr && initialFilters.cefr !== "all",
  ].filter(Boolean).length;

  const formatGroup = (g: string) => {
    if (g === "1st_group") return "1er";
    if (g === "2nd_group") return "2e";
    if (g === "3rd_group") return "3e";
    return g;
  };

  return (
    <div className="space-y-4">
      {/* FILTER BAR - Compact & Progressive */}
      <div className="p-3.5 rounded-xl bg-surface-container-low border border-outline-variant space-y-3">
        {/* Primary Row */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Quick Search */}
          <form onSubmit={handleSearchSubmit} className="flex-1 min-w-[220px]">
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search verbs or English gloss..."
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
                >
                  ×
                </button>
              )}
            </div>
          </form>

          {/* Group Filter */}
          <select
            value={initialFilters.group || "all"}
            onChange={(e) => updateFilters({ group: e.target.value })}
            className="px-2.5 py-1.5 rounded bg-surface-container-lowest border border-outline-variant text-xs text-on-surface font-mono focus:outline-none"
          >
            <option value="all">All Groups</option>
            <option value="1st_group">1er (-er)</option>
            <option value="2nd_group">2e (-ir)</option>
            <option value="3rd_group">3e (-re/-oir)</option>
            <option value="irregular">Irrégulier</option>
          </select>

          {/* Regularity */}
          <select
            value={initialFilters.regularity || "all"}
            onChange={(e) => updateFilters({ regularity: e.target.value })}
            className="px-2.5 py-1.5 rounded bg-surface-container-lowest border border-outline-variant text-xs text-on-surface font-mono focus:outline-none"
          >
            <option value="all">Regularity: All</option>
            <option value="regular">Regular</option>
            <option value="irregular">Irregular</option>
          </select>

          {/* Auxiliary */}
          <select
            value={initialFilters.auxiliary || "all"}
            onChange={(e) => updateFilters({ auxiliary: e.target.value })}
            className="px-2.5 py-1.5 rounded bg-surface-container-lowest border border-outline-variant text-xs text-on-surface font-mono focus:outline-none"
          >
            <option value="all">Aux: All</option>
            <option value="avoir">Avoir</option>
            <option value="être">Être</option>
            <option value="both">Both</option>
          </select>

          {/* More filters toggle button */}
          <button
            type="button"
            onClick={() => setShowMoreFilters(!showMoreFilters)}
            className={`inline-flex items-center gap-1 px-2.5 py-1.5 rounded text-xs font-mono border transition-colors ${
              showMoreFilters || activeFiltersCount > 0
                ? "bg-surface-container-high border-primary text-primary font-semibold"
                : "bg-surface-container-lowest border-outline-variant text-on-surface-variant hover:text-primary"
            }`}
          >
            <span className="material-symbols-outlined text-[15px]">tune</span>
            <span>More</span>
            {activeFiltersCount > 0 && (
              <span className="w-4 h-4 rounded-full bg-primary text-white text-[10px] flex items-center justify-center font-bold">
                {activeFiltersCount}
              </span>
            )}
          </button>
        </div>

        {/* Secondary Progressive Filter Drawer */}
        {showMoreFilters && (
          <div className="pt-2.5 border-t border-outline-variant/40 flex flex-wrap items-center gap-3 text-xs animate-in fade-in duration-100">
            {/* Transitivity */}
            <div className="flex items-center gap-1.5">
              <span className="text-[11px] font-mono text-on-surface-variant uppercase">
                Transitivity:
              </span>
              <select
                value={initialFilters.transitivity || "all"}
                onChange={(e) => updateFilters({ transitivity: e.target.value })}
                className="px-2 py-1 rounded bg-surface-container-lowest border border-outline-variant text-xs text-on-surface font-mono"
              >
                <option value="all">All</option>
                <option value="transitive">Direct</option>
                <option value="transitive_indirect">Indirect</option>
                <option value="intransitive">Intransitive</option>
                <option value="both">Both</option>
              </select>
            </div>

            {/* CEFR */}
            <div className="flex items-center gap-1.5">
              <span className="text-[11px] font-mono text-on-surface-variant uppercase">
                CEFR:
              </span>
              <select
                value={initialFilters.cefr || "all"}
                onChange={(e) => updateFilters({ cefr: e.target.value })}
                className="px-2 py-1 rounded bg-surface-container-lowest border border-outline-variant text-xs text-on-surface font-mono"
              >
                <option value="all">All</option>
                <option value="A1">A1</option>
                <option value="A2">A2</option>
                <option value="B1">B1</option>
                <option value="B2">B2</option>
                <option value="C1">C1</option>
              </select>
            </div>

            {/* Reset */}
            {(activeFiltersCount > 0 || initialFilters.query) && (
              <button
                type="button"
                onClick={() => {
                  setSearchQuery("");
                  router.push("/verbs");
                }}
                className="ml-auto text-xs text-on-surface-variant hover:text-primary underline font-mono"
              >
                Clear all filters
              </button>
            )}
          </div>
        )}
      </div>

      {/* DENSE SCAN-PEEK TABLE */}
      {verbs.length > 0 ? (
        <div className="rounded-xl border border-outline-variant overflow-hidden bg-surface-container-lowest shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-surface-container border-b border-outline-variant text-[11px] font-mono uppercase text-on-surface-variant tracking-wider">
                  <th className="py-2.5 px-3.5">Verb (Lemma)</th>
                  <th className="py-2.5 px-3.5">Primary Meaning</th>
                  <th className="py-2.5 px-3.5">Classification</th>
                  <th className="py-2.5 px-3.5">Aux & Participle</th>
                  <th className="py-2.5 px-3.5">Relations</th>
                  <th className="py-2.5 px-3.5 text-right">Quick Peek</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/40">
                {verbs.map((verb) => {
                  return (
                    <tr
                      key={verb.id}
                      onClick={() => openPeek("verb", verb.lemma)}
                      className="hover:bg-surface-container-low transition-colors cursor-pointer group"
                    >
                      {/* Verb Infinitive */}
                      <td className="py-2.5 px-3.5 font-semibold text-primary">
                        <div className="flex items-center gap-1.5">
                          <Link
                            href={`/verbs/${encodeURIComponent(verb.lemma)}`}
                            onClick={(e) => e.stopPropagation()}
                            className="font-bold text-sm text-primary hover:underline"
                          >
                            {verb.lemma}
                          </Link>
                          {verb.pronominal && (
                            <span className="text-[10px] font-mono text-purple-700 bg-purple-50 border border-purple-200 px-1 rounded">
                              se
                            </span>
                          )}
                          {verb.cefr && (
                            <span className="text-[10px] font-mono text-on-surface-variant/70">
                              {verb.cefr}
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Primary English Meaning */}
                      <td className="py-2.5 px-3.5 text-on-surface">
                        <span className="font-medium text-xs">{verb.english || "—"}</span>
                      </td>

                      {/* Classification (Clean minimal inline text, no oversized badges) */}
                      <td className="py-2.5 px-3.5 font-mono text-on-surface-variant">
                        <span className="font-semibold text-on-surface">
                          {formatGroup(verb.group)}
                        </span>
                        <span className="text-on-surface-variant/70 mx-1">·</span>
                        <span
                          className={
                            verb.regularity === "irregular" ? "text-amber-700 font-medium" : ""
                          }
                        >
                          {verb.regularity === "irregular" ? "irr." : "rég."}
                        </span>
                      </td>

                      {/* Auxiliary & Participle */}
                      <td className="py-2.5 px-3.5 font-mono text-on-surface-variant">
                        <span className="text-primary font-medium">{verb.auxiliary}</span>
                        {verb.past_participle && (
                          <>
                            <span className="text-on-surface-variant/60 mx-1">·</span>
                            <span className="text-on-surface font-semibold">
                              {verb.past_participle}
                            </span>
                          </>
                        )}
                      </td>

                      {/* Usage & Relations */}
                      <td className="py-2.5 px-3.5 text-on-surface-variant font-mono text-[11px]">
                        {verb.related_expressions?.length > 0 && (
                          <span className="mr-2">
                            {verb.related_expressions.length} expr
                          </span>
                        )}
                        {verb.raw_chapters?.length > 0 && (
                          <span>ch {verb.raw_chapters.slice(0, 2).join(",")}</span>
                        )}
                      </td>

                      {/* Peek trigger */}
                      <td className="py-2.5 px-3.5 text-right">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            openPeek("verb", verb.lemma);
                          }}
                          className="px-2 py-1 rounded text-[11px] font-mono text-primary bg-surface-container hover:bg-[#002147] hover:text-white transition-colors"
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
                Page <strong>{currentPage}</strong> of <strong>{totalPages}</strong> ({total} verbs)
              </div>
              <div className="flex items-center gap-1.5">
                {currentPage > 1 && (
                  <Link
                    href={`/verbs?${new URLSearchParams({
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
                    href={`/verbs?${new URLSearchParams({
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
          <p className="text-sm font-medium">No verbs found matching the selected filters.</p>
          <button
            onClick={() => router.push("/verbs")}
            className="text-xs text-primary underline font-mono"
          >
            Clear all filters
          </button>
        </div>
      )}
    </div>
  );
}
