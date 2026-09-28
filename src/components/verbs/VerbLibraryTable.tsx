"use client";

import React, { useState, useTransition } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { VerbUI } from "@/src/lib/data/selectors";
import { usePeek } from "../peek/PeekContext";
import { RowActionMenu } from "../common/RowActionMenu";

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
  const [, startTransition] = useTransition();

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

  const formatMeaning = (val: unknown): string => {
    if (!val) return "—";
    if (typeof val === "string") return val.trim() || "—";
    if (Array.isArray(val)) {
      const cleaned = val.map((s) => String(s || "").trim()).filter(Boolean);
      const unique = Array.from(new Set(cleaned));
      return unique.join(", ") || "—";
    }
    return String(val).trim() || "—";
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
              <label htmlFor="verbs-search" className="sr-only">
                Search verbs by French or English
              </label>
              <input
                id="verbs-search"
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
                  aria-label="Clear verb search"
                >
                  ×
                </button>
              )}
            </div>
          </form>

          {/* Group Filter */}
          <label htmlFor="verbs-filter-group" className="sr-only">
            Filter verbs by conjugation group
          </label>
          <select
            id="verbs-filter-group"
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
          <label htmlFor="verbs-filter-regularity" className="sr-only">
            Filter verbs by regularity
          </label>
          <select
            id="verbs-filter-regularity"
            value={initialFilters.regularity || "all"}
            onChange={(e) => updateFilters({ regularity: e.target.value })}
            className="px-2.5 py-1.5 rounded bg-surface-container-lowest border border-outline-variant text-xs text-on-surface font-mono focus:outline-none"
          >
            <option value="all">Regularity: All</option>
            <option value="regular">Regular</option>
            <option value="irregular">Irregular</option>
          </select>

          {/* Auxiliary */}
          <label htmlFor="verbs-filter-auxiliary" className="sr-only">
            Filter verbs by auxiliary
          </label>
          <select
            id="verbs-filter-auxiliary"
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
              <label htmlFor="verbs-filter-transitivity" className="sr-only">
                Filter verbs by transitivity
              </label>
              <select
                id="verbs-filter-transitivity"
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
              <label htmlFor="verbs-filter-cefr" className="sr-only">
                Filter verbs by CEFR level
              </label>
              <select
                id="verbs-filter-cefr"
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

      {/* SCAN CONTAINER (Desktop Dense Table + Mobile Purpose-Built 2-Line Rows) */}
      {verbs.length > 0 ? (
        <div className="rounded-xl border border-outline-variant overflow-hidden bg-surface-container-lowest shadow-xs">
          {/* MOBILE PURPOSE-BUILT TWO-LINE LIST (<768px) */}
          <div className="md:hidden divide-y divide-outline-variant/30">
            {verbs.map((verb) => {
              const meaning = formatMeaning(verb.english);
              return (
                <div
                  key={verb.id}
                  data-id={verb.lemma}
                  onClick={() => openPeek("verb", verb.lemma)}
                  className="p-3 active:bg-surface-container-low hover:bg-surface-container-low/60 transition-colors cursor-pointer flex items-center justify-between gap-3 group"
                >
                  {/* 2-Line Content */}
                  <div className="min-w-0 flex-1">
                    {/* Line 1: French Term · English Gloss */}
                    <div className="flex items-baseline gap-1.5 truncate">
                      <span className="font-bold text-sm text-primary tracking-tight font-sans">
                        {verb.lemma}
                      </span>
                      {verb.pronominal && (
                        <span className="text-[9px] font-mono text-purple-700 bg-purple-50 border border-purple-200 px-1 rounded">
                          se
                        </span>
                      )}
                      <span className="text-on-surface-variant/50 text-xs">·</span>
                      <span
                        className="text-xs text-on-surface font-medium truncate"
                        title={meaning !== "—" ? meaning : undefined}
                      >
                        {meaning}
                      </span>
                    </div>

                    {/* Line 2: 3e · irregular · avoir · [participle] */}
                    <div className="flex items-center gap-1 text-[11px] font-mono text-on-surface-variant/75 mt-0.5 truncate">
                      <span className="font-semibold text-on-surface">
                        {formatGroup(verb.group)}
                      </span>
                      <span className="text-on-surface-variant/40">·</span>
                      <span
                        className={
                          verb.regularity === "irregular" ? "text-amber-700 font-medium" : ""
                        }
                      >
                        {verb.regularity === "irregular" ? "irrég." : "rég."}
                      </span>
                      <span className="text-on-surface-variant/40">·</span>
                      <span className="text-primary font-medium">{verb.auxiliary}</span>
                      {verb.past_participle && (
                        <>
                          <span className="text-on-surface-variant/40">·</span>
                          <span className="text-on-surface-variant/90 truncate">
                            {verb.past_participle}
                          </span>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Right Controls: Save/Review Action Menu + Peek indicator */}
                  <div className="flex items-center gap-1 shrink-0">
                    <RowActionMenu
                      type="verb"
                      id={verb.lemma}
                      fullUrl={`/verbs/${encodeURIComponent(verb.lemma)}`}
                      label={verb.lemma}
                    />
                    <span
                      className="text-on-surface-variant/50 group-hover:text-primary transition-colors text-base font-mono pl-0.5"
                      title="Tap to Peek"
                    >
                      ›
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* DESKTOP HIGH-DENSITY SCAN TABLE (>=768px) */}
          <div className="hidden md:block overflow-x-auto max-h-[72vh] overflow-y-auto">
            <table className="w-full text-left text-xs border-collapse font-sans">
              <thead className="sticky top-0 z-10 bg-surface-container/95 backdrop-blur-md border-b border-outline-variant shadow-xs">
                <tr className="text-[11px] font-mono uppercase text-on-surface-variant/80 tracking-wider">
                  <th className="py-2.5 px-3.5 font-semibold">Verb (Lemma)</th>
                  <th className="py-2.5 px-3.5 font-semibold">Primary Meaning</th>
                  <th className="py-2.5 px-3.5 font-semibold">Classification</th>
                  <th className="py-2.5 px-3.5 font-semibold">Aux & Participle</th>
                  <th className="py-2.5 px-3.5 font-semibold">Usage & Cross-Links</th>
                  <th className="py-2.5 px-3.5 text-right font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/30">
                {verbs.map((verb) => {
                  const meaning = formatMeaning(verb.english);
                  return (
                    <tr
                      key={verb.id}
                      data-id={verb.lemma}
                      onClick={() => openPeek("verb", verb.lemma)}
                      className="even:bg-surface-container-lowest odd:bg-surface-container-low/25 hover:bg-primary/[0.04] [&[data-selected='true']]:bg-primary/[0.08] [&[data-selected='true']]:border-l-4 [&[data-selected='true']]:border-primary transition-colors cursor-pointer group"
                    >
                      {/* Verb Infinitive - Visually Dominant */}
                      <td className="py-2.5 px-3.5">
                        <div className="flex items-center gap-1.5">
                          <Link
                            href={`/verbs/${encodeURIComponent(verb.lemma)}`}
                            onClick={(e) => e.stopPropagation()}
                            className="font-bold text-sm text-primary hover:underline tracking-tight"
                            title="Open full verb dossier"
                          >
                            {verb.lemma}
                          </Link>
                          {verb.pronominal && (
                            <span className="text-[10px] font-mono text-purple-700 bg-purple-50 border border-purple-200 px-1 rounded">
                              se
                            </span>
                          )}
                          {verb.cefr && (
                            <span className="text-[10px] font-mono text-on-surface-variant/60">
                              {verb.cefr}
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Primary English Meaning */}
                      <td className="py-2.5 px-3.5 text-on-surface max-w-[280px]">
                        <span
                          className="font-medium text-xs text-on-surface line-clamp-2"
                          title={meaning !== "—" ? meaning : undefined}
                        >
                          {meaning}
                        </span>
                      </td>

                      {/* Classification - Subtle / Faded visual weight */}
                      <td className="py-2.5 px-3.5 font-mono text-[11px] text-on-surface-variant/80">
                        <span className="font-semibold text-on-surface">
                          {formatGroup(verb.group)}
                        </span>
                        <span className="text-on-surface-variant/40 mx-1">·</span>
                        <span
                          className={
                            verb.regularity === "irregular" ? "text-amber-700 font-medium" : "text-on-surface-variant/70"
                          }
                        >
                          {verb.regularity === "irregular" ? "irrégulier" : "régulier"}
                        </span>
                      </td>

                      {/* Auxiliary & Participle - Faded structural details */}
                      <td className="py-2.5 px-3.5 font-mono text-[11px] text-on-surface-variant/80">
                        <span className="text-primary font-medium">{verb.auxiliary}</span>
                        {verb.past_participle && (
                          <>
                            <span className="text-on-surface-variant/40 mx-1">·</span>
                            <span className="text-on-surface font-normal">
                              {verb.past_participle}
                            </span>
                          </>
                        )}
                      </td>

                      {/* Usage & Cross-Links - Faded */}
                      <td className="py-2.5 px-3.5 text-on-surface-variant/70 font-mono text-[11px]">
                        {verb.related_expressions?.length > 0 && (
                          <span className="mr-2">
                            {verb.related_expressions.length} expr
                          </span>
                        )}
                        {verb.raw_chapters?.length > 0 && (
                          <span>ch {verb.raw_chapters.slice(0, 2).join(",")}</span>
                        )}
                      </td>

                      {/* Right-Aligned Badges & Action Controls */}
                      <td className="py-2.5 px-3.5 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <RowActionMenu
                            type="verb"
                            id={verb.lemma}
                            fullUrl={`/verbs/${encodeURIComponent(verb.lemma)}`}
                            label={verb.lemma}
                          />
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              openPeek("verb", verb.lemma);
                            }}
                            className="inline-flex items-center gap-1 px-2 py-1 rounded text-[11px] font-mono text-primary bg-surface-container hover:bg-[#002147] hover:text-white transition-colors cursor-pointer"
                            title="Open fast Level 2 Peek"
                          >
                            <span>Peek</span>
                            <span className="text-[10px]">→</span>
                          </button>
                        </div>
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
