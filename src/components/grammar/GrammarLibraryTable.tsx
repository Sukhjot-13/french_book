"use client";

import React, { useState, useTransition } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { GrammarRuleUI } from "@/src/lib/data/selectors";
import { usePeek } from "../peek/PeekContext";

interface GrammarLibraryTableProps {
  rules: GrammarRuleUI[];
  total: number;
  currentPage: number;
  pageSize: number;
  initialQuery?: string;
}

export function GrammarLibraryTable({
  rules,
  total,
  currentPage,
  pageSize,
  initialQuery,
}: GrammarLibraryTableProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { openPeek } = usePeek();
  const [, startTransition] = useTransition();

  const [searchQuery, setSearchQuery] = useState(initialQuery || "");
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
      router.replace(`/grammar?${params.toString()}`, { scroll: false });
    });
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateFilters({ query: searchQuery });
  };

  return (
    <div className="space-y-4">
      {/* FILTER BAR */}
      <div className="p-3.5 rounded-xl bg-surface-container-low border border-outline-variant flex flex-wrap items-center justify-between gap-3">
        {/* Search Input */}
        <form onSubmit={handleSearchSubmit} className="flex-1 min-w-[240px]">
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search grammar rules, categories, or formation formulas..."
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

        {/* Category select if any */}
        <div className="flex items-center gap-2">
          {initialQuery && (
            <button
              type="button"
              onClick={() => {
                setSearchQuery("");
                router.push("/grammar");
              }}
              className="text-xs font-mono text-on-surface-variant hover:text-primary underline px-1"
            >
              Reset
            </button>
          )}
        </div>
      </div>

      {/* DENSE SCAN-PEEK TABLE */}
      {rules.length > 0 ? (
        <div className="rounded-xl border border-outline-variant overflow-hidden bg-surface-container-lowest shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-surface-container border-b border-outline-variant text-[11px] font-mono uppercase text-on-surface-variant tracking-wider">
                  <th className="py-2.5 px-3.5">Rule / Concept</th>
                  <th className="py-2.5 px-3.5">Summary</th>
                  <th className="py-2.5 px-3.5">Formation / Signal</th>
                  <th className="py-2.5 px-3.5">Traps & Flags</th>
                  <th className="py-2.5 px-3.5 text-right">Quick Peek</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/40">
                {rules.map((rule) => {
                  return (
                    <tr
                      key={rule.id}
                      onClick={() => openPeek("grammar", rule.title)}
                      className="hover:bg-surface-container-low transition-colors cursor-pointer group"
                    >
                      {/* Rule Name */}
                      <td className="py-2.5 px-3.5 font-semibold text-primary max-w-[200px]">
                        <Link
                          href={`/grammar/${encodeURIComponent(rule.title)}`}
                          onClick={(e) => e.stopPropagation()}
                          className="font-bold text-sm text-primary hover:underline block truncate"
                        >
                          {rule.title}
                        </Link>
                        {rule.category && (
                          <span className="text-[10px] font-mono text-on-surface-variant/70 uppercase">
                            {rule.category}
                          </span>
                        )}
                      </td>

                      {/* Summary */}
                      <td className="py-2.5 px-3.5 text-on-surface max-w-sm">
                        <p className="line-clamp-2 text-xs leading-relaxed">
                          {rule.summary || rule.explanation || "—"}
                        </p>
                      </td>

                      {/* Formation / Signal Words */}
                      <td className="py-2.5 px-3.5 font-mono text-on-surface-variant max-w-[220px]">
                        {rule.formation ? (
                          <span className="text-[11px] font-semibold text-primary block truncate">
                            {rule.formation}
                          </span>
                        ) : rule.signal_words?.length ? (
                          <span className="text-[11px] text-on-surface-variant/80 block truncate">
                            {rule.signal_words.slice(0, 3).join(", ")}
                          </span>
                        ) : (
                          <span>—</span>
                        )}
                      </td>

                      {/* Traps & Flags */}
                      <td className="py-2.5 px-3.5 font-mono text-[11px]">
                        {rule.common_traps && rule.common_traps.length > 0 ? (
                          <span className="text-amber-800 bg-amber-50 border border-amber-200 px-1.5 py-0.5 rounded inline-block">
                            ⚠️ {rule.common_traps.length} trap{rule.common_traps.length > 1 ? "s" : ""}
                          </span>
                        ) : (
                          <span className="text-on-surface-variant/60">—</span>
                        )}
                      </td>

                      {/* Quick Peek */}
                      <td className="py-2.5 px-3.5 text-right">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            openPeek("grammar", rule.title);
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
                Page <strong>{currentPage}</strong> of <strong>{totalPages}</strong> ({total} rules)
              </div>
              <div className="flex items-center gap-1.5">
                {currentPage > 1 && (
                  <Link
                    href={`/grammar?${new URLSearchParams({
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
                    href={`/grammar?${new URLSearchParams({
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
          <p className="text-sm font-medium">No grammar rules found matching your search.</p>
          <button
            onClick={() => router.push("/grammar")}
            className="text-xs text-primary underline font-mono"
          >
            Clear search
          </button>
        </div>
      )}
    </div>
  );
}
