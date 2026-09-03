"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { ConceptUI } from "@/src/lib/data/selectors";
import { usePeek } from "@/src/components/peek/PeekContext";

interface ConceptsExplorerProps {
  concepts: ConceptUI[];
}

export function ConceptsExplorer({ concepts }: ConceptsExplorerProps) {
  const { openPeek } = usePeek();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCefr, setSelectedCefr] = useState<string>("all");
  const [selectedPriority, setSelectedPriority] = useState<string>("all");

  const cefrLevels = ["all", "A1", "A2", "B1", "B2", "C1", "C2"];

  const filteredConcepts = useMemo(() => {
    return concepts.filter((c) => {
      // Search
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = c.name.toLowerCase().includes(q);
        const matchesDesc = c.description?.toLowerCase().includes(q) || false;
        const matchesAliases = c.aliases.some((a) => a.toLowerCase().includes(q));
        const matchesTags = c.tags.some((t) => t.toLowerCase().includes(q));
        if (!matchesName && !matchesDesc && !matchesAliases && !matchesTags) {
          return false;
        }
      }

      // CEFR
      if (selectedCefr !== "all") {
        if (!c.cefr || c.cefr.toUpperCase() !== selectedCefr.toUpperCase()) {
          return false;
        }
      }

      // Priority
      if (selectedPriority !== "all") {
        const p = parseInt(selectedPriority, 10);
        if (c.priority !== p) {
          return false;
        }
      }

      return true;
    });
  }, [concepts, searchQuery, selectedCefr, selectedPriority]);

  return (
    <div className="space-y-6">
      {/* FILTER & SEARCH BAR */}
      <div className="p-4 md:p-5 rounded-2xl bg-surface-container-low border border-outline-variant space-y-4 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          {/* Search Input */}
          <div className="relative flex-1">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Filter 206 concepts by name, rule, or keyword..."
              className="w-full px-3.5 py-2 pl-9 rounded-xl bg-surface-container-lowest border border-outline-variant text-xs text-on-surface focus:outline-none focus:border-primary font-sans shadow-xs"
            />
            <span className="material-symbols-outlined absolute left-2.5 top-2 text-[18px] text-on-surface-variant">
              search
            </span>
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-2 text-on-surface-variant hover:text-primary text-[14px]"
              >
                ×
              </button>
            )}
          </div>

          {/* CEFR Level filter pills */}
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-[11px] font-mono font-bold uppercase text-on-surface-variant mr-1">
              CEFR:
            </span>
            {cefrLevels.map((lvl) => (
              <button
                key={lvl}
                onClick={() => setSelectedCefr(lvl)}
                className={`px-2.5 py-1 rounded-lg text-xs font-mono transition-colors ${
                  selectedCefr === lvl
                    ? "bg-[#002147] text-white font-bold shadow-xs"
                    : "bg-surface-container-lowest border border-outline-variant/60 text-on-surface hover:bg-surface-container hover:text-primary"
                }`}
              >
                {lvl === "all" ? "All" : lvl}
              </button>
            ))}
          </div>
        </div>

        {/* Priority Filter */}
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-outline-variant/50 text-xs font-mono">
          <span className="text-on-surface-variant font-bold uppercase text-[11px]">
            Learning Priority:
          </span>
          {[
            { id: "all", label: "All Priorities" },
            { id: "1", label: "Priority 1 (Essential)" },
            { id: "2", label: "Priority 2 (Core)" },
            { id: "3", label: "Priority 3 (Extended)" },
          ].map((p) => (
            <button
              key={p.id}
              onClick={() => setSelectedPriority(p.id)}
              className={`px-2 py-0.5 rounded transition-colors ${
                selectedPriority === p.id
                  ? "bg-primary text-white font-semibold"
                  : "text-on-surface-variant hover:text-primary hover:bg-surface-container"
              }`}
            >
              {p.label}
            </button>
          ))}
          <span className="ml-auto text-on-surface-variant">
            Showing <strong className="text-primary">{filteredConcepts.length}</strong> of {concepts.length} concepts
          </span>
        </div>
      </div>

      {/* CONCEPTS GRID */}
      {filteredConcepts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredConcepts.map((concept) => (
            <div
              key={concept.id}
              className="p-5 rounded-2xl bg-surface-container-lowest border border-outline-variant shadow-xs flex flex-col justify-between hover:border-primary/50 transition-all group"
            >
              <div className="space-y-2">
                <div className="flex items-start justify-between gap-2">
                  <Link
                    href={`/concepts/${encodeURIComponent(concept.name)}`}
                    className="font-bold text-base text-primary group-hover:text-blue-900 group-hover:underline tracking-tight"
                  >
                    {concept.name}
                  </Link>
                  {concept.cefr && (
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-amber-100 text-amber-900 border border-amber-300 shrink-0">
                      {concept.cefr}
                    </span>
                  )}
                </div>

                {concept.description && (
                  <p className="text-xs text-on-surface-variant line-clamp-2 leading-relaxed">
                    {concept.description}
                  </p>
                )}

                {/* Tag Pills */}
                {concept.tags && concept.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1 pt-1">
                    {concept.tags.slice(0, 3).map((tag, idx) => (
                      <span
                        key={idx}
                        className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-surface-container text-on-surface-variant"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Connections strip & actions */}
              <div className="pt-4 mt-4 border-t border-outline-variant/50 flex items-center justify-between text-xs font-mono">
                <div className="flex items-center gap-2 text-on-surface-variant text-[11px]">
                  {concept.related_grammar_rules.length > 0 && (
                    <span title={`${concept.related_grammar_rules.length} grammar rules`}>
                      {concept.related_grammar_rules.length} rules
                    </span>
                  )}
                  {concept.related_verbs.length > 0 && (
                    <span title={`${concept.related_verbs.length} verbs`}>
                      • {concept.related_verbs.length} verbs
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => openPeek("concept", concept.name)}
                    className="px-2 py-1 rounded text-xs text-primary hover:bg-surface-container font-mono transition-colors"
                  >
                    Peek
                  </button>
                  <Link
                    href={`/concepts/${encodeURIComponent(concept.name)}`}
                    className="px-2.5 py-1 rounded bg-[#002147] text-white text-xs font-semibold hover:bg-primary transition-colors flex items-center gap-0.5"
                  >
                    <span>Dive</span>
                    <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="py-16 text-center text-on-surface-variant space-y-2 bg-surface-container-low rounded-2xl border border-outline-variant">
          <span className="material-symbols-outlined text-[40px] text-on-surface-variant/60 block">
            psychology
          </span>
          <p className="text-sm font-medium">No concepts found matching your filters.</p>
          <button
            onClick={() => {
              setSearchQuery("");
              setSelectedCefr("all");
              setSelectedPriority("all");
            }}
            className="text-xs text-primary font-mono underline"
          >
            Reset all filters
          </button>
        </div>
      )}
    </div>
  );
}
