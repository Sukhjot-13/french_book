"use client";

import React, { useState, useTransition } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { VocabUI } from "@/src/lib/data/selectors";
import { useIsDesktop } from "@/src/hooks/useMediaQuery";
import { usePeek } from "../peek/PeekContext";
import { RowActionMenu } from "../common/RowActionMenu";

interface VocabDictionaryTableProps {
  vocabulary: VocabUI[];
  total: number;
  currentPage: number;
  pageSize: number;
  initialFilters: {
    query?: string;
    pos?: string;
    gender?: string;
    letter?: string;
  };
}

const ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

export function VocabDictionaryTable({
  vocabulary,
  total,
  currentPage,
  pageSize,
  initialFilters,
}: VocabDictionaryTableProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { openPeek } = usePeek();
  const [, startTransition] = useTransition();
  const isDesktop = useIsDesktop();

  const [searchQuery, setSearchQuery] = useState(initialFilters.query || "");

  const totalPages = Math.max(1, Math.ceil(total / pageSize));

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
      router.push(`/vocabulary?${params.toString()}`);
    });
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateFilters({ query: searchQuery });
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

  const formatPosGender = (item: VocabUI) => {
    if (item.part_of_speech === "noun") {
      if (item.gender === "masculine") return "n.m.";
      if (item.gender === "feminine") return "n.f.";
      return "n.";
    }
    if (item.part_of_speech === "adjective") return "adj.";
    if (item.part_of_speech === "adverb") return "adv.";
    if (item.part_of_speech === "preposition") return "prép.";
    if (item.part_of_speech === "conjunction") return "conj.";
    if (item.part_of_speech === "verb") return "v.";
    if (item.part_of_speech === "pronoun") return "pron.";
    return item.part_of_speech;
  };

  const detailHref = (item: VocabUI) => `/vocabulary/${encodeURIComponent(item.id)}`;

  return (
    <div className="space-y-4">
      {/* A-Z ALPHABET JUMP BAR */}
      <div className="p-2.5 rounded-xl bg-surface-container-low border border-outline-variant flex flex-wrap items-center justify-between gap-1 overflow-x-auto shadow-xs">
        <button
          type="button"
          onClick={() => updateFilters({ letter: "all", query: "" })}
          className={`px-2 py-1 rounded text-xs font-mono transition-colors ${
            !initialFilters.letter || initialFilters.letter === "all"
              ? "bg-[#002147] text-white font-bold"
              : "text-on-surface-variant hover:text-primary hover:bg-surface-container"
          }`}
        >
          All
        </button>
        {ALPHABET.map((char) => {
          const isSelected = initialFilters.letter?.toUpperCase() === char;
          return (
            <button
              key={char}
              type="button"
              aria-pressed={isSelected}
              onClick={() => updateFilters({ letter: char, query: "" })}
              className={`w-7 h-7 flex items-center justify-center rounded text-xs font-mono transition-colors ${
                isSelected
                  ? "bg-[#002147] text-white font-bold shadow-xs"
                  : "text-on-surface-variant hover:text-primary hover:bg-surface-container"
              }`}
            >
              {char}
            </button>
          );
        })}
      </div>

      {/* FILTER & SEARCH BAR */}
      <div className="p-3 rounded-xl bg-surface-container-low border border-outline-variant flex flex-wrap items-center justify-between gap-3">
        {/* Search */}
        <form onSubmit={handleSearchSubmit} className="flex-1 min-w-[240px]">
          <label htmlFor="vocab-dictionary-search" className="sr-only">
            Search dictionary by French or English
          </label>
          <div className="relative">
            <input
              id="vocab-dictionary-search"
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search dictionary (French or English)..."
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
                aria-label="Clear dictionary search"
              >
                ×
              </button>
            )}
          </div>
        </form>

        {/* Category & Gender Selects */}
        <div className="flex items-center gap-2">
          <label htmlFor="vocab-filter-pos" className="sr-only">
            Filter by part of speech
          </label>
          <select
            id="vocab-filter-pos"
            value={initialFilters.pos || "all"}
            onChange={(e) => updateFilters({ pos: e.target.value })}
            className="px-2.5 py-1.5 rounded bg-surface-container-lowest border border-outline-variant text-xs text-on-surface font-mono"
          >
            <option value="all">All Parts of Speech</option>
            <option value="noun">Nouns</option>
            <option value="adjective">Adjectives</option>
            <option value="adverb">Adverbs</option>
            <option value="preposition">Prepositions</option>
            <option value="conjunction">Conjunctions</option>
            <option value="verb">Verbs</option>
          </select>

          <label htmlFor="vocab-filter-gender" className="sr-only">
            Filter by gender
          </label>
          <select
            id="vocab-filter-gender"
            value={initialFilters.gender || "all"}
            onChange={(e) => updateFilters({ gender: e.target.value })}
            className="px-2.5 py-1.5 rounded bg-surface-container-lowest border border-outline-variant text-xs text-on-surface font-mono"
          >
            <option value="all">All Genders</option>
            <option value="masculine">Masculine (m.)</option>
            <option value="feminine">Feminine (f.)</option>
          </select>

          {(initialFilters.query || (initialFilters.pos && initialFilters.pos !== "all") || (initialFilters.gender && initialFilters.gender !== "all") || initialFilters.letter) && (
            <button
              type="button"
              onClick={() => {
                setSearchQuery("");
                router.push("/vocabulary");
              }}
              className="text-xs font-mono text-on-surface-variant hover:text-primary underline px-1"
            >
              Reset
            </button>
          )}
        </div>
      </div>

      {/* SCAN CONTAINER (Desktop Dense Table OR Mobile Two-Line List, one at a time) */}
      {vocabulary.length > 0 ? (
        <div className="rounded-xl border border-outline-variant overflow-hidden bg-surface-container-lowest shadow-xs">
          {isDesktop ? (
            /* DESKTOP HIGH-DENSITY SCAN TABLE (>=768px) */
            <div className="overflow-x-auto max-h-[72vh] overflow-y-auto">
              <table className="w-full text-left text-xs border-collapse font-sans">
                <thead className="sticky top-0 z-10 bg-surface-container/95 backdrop-blur-md border-b border-outline-variant shadow-xs">
                  <tr className="text-[11px] font-mono uppercase text-on-surface-variant/80 tracking-wider">
                    <th className="py-2.5 px-3.5 font-semibold">Term (Lexical Entry)</th>
                    <th className="py-2.5 px-3.5 font-semibold">Category</th>
                    <th className="py-2.5 px-3.5 font-semibold">English Translation</th>
                    <th className="py-2.5 px-3.5 font-semibold">Family &amp; Notes</th>
                    <th className="py-2.5 px-3.5 text-right font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-outline-variant/30">
                  {vocabulary.map((item) => {
                    const meaning = formatMeaning(item.english);
                    return (
                      <tr
                        key={item.id}
                        data-id={item.french}
                        onClick={() => openPeek("vocab", item.id)}
                        className="even:bg-surface-container-lowest odd:bg-surface-container-low/25 hover:bg-primary/[0.04] [&[data-selected='true']]:bg-primary/[0.08] [&[data-selected='true']]:border-l-4 [&[data-selected='true']]:border-primary transition-colors cursor-pointer group"
                      >
                        {/* Term + Article - Visually Dominant */}
                        <td className="py-2.5 px-3.5">
                          <div className="flex items-center gap-1.5">
                            {item.article && typeof item.article === "string" && (
                              <span className="text-on-surface-variant/75 font-normal font-serif">
                                {item.article}
                              </span>
                            )}
                            <Link
                              href={detailHref(item)}
                              onClick={(e) => e.stopPropagation()}
                              className="font-bold text-sm text-primary hover:underline tracking-tight"
                              title="Open full vocabulary page"
                            >
                              {item.french}
                            </Link>
                            {item.plural_form && (
                              <span className="text-[11px] text-on-surface-variant/60 font-mono">
                                (pl. {item.plural_form})
                              </span>
                            )}
                          </div>
                        </td>

                        {/* Type / Gender - Muted/Faded visual weight */}
                        <td className="py-2.5 px-3.5 font-mono text-[11px] text-on-surface-variant/80">
                          <span className="font-semibold text-on-surface">
                            {formatPosGender(item)}
                          </span>
                        </td>

                        {/* English Meaning */}
                        <td className="py-2.5 px-3.5 text-on-surface max-w-[280px]">
                          <span
                            className="font-medium text-xs text-on-surface line-clamp-2"
                            title={meaning !== "—" ? meaning : undefined}
                          >
                            {meaning}
                          </span>
                        </td>

                        {/* Word Family / Senses - Faded */}
                        <td className="py-2.5 px-3.5 text-on-surface-variant/70 text-[11px]">
                          {item.word_family?.length > 0 ? (
                            <span className="font-mono text-on-surface-variant/80 truncate block max-w-xs">
                              {item.word_family.slice(0, 3).join(", ")}
                            </span>
                          ) : item.senses?.[0]?.meaning ? (
                            <span className="truncate block max-w-xs text-on-surface-variant/80">
                              {item.senses[0].meaning}
                            </span>
                          ) : (
                            <span>—</span>
                          )}
                        </td>

                        {/* Right-Aligned Badges & Action Controls */}
                        <td className="py-2.5 px-3.5 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <RowActionMenu
                              type="vocab"
                              id={item.id}
                              fullUrl={detailHref(item)}
                              label={item.french}
                            />
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                openPeek("vocab", item.id);
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
          ) : (
            /* MOBILE PURPOSE-BUILT TWO-LINE LIST (<768px) */
            <div className="divide-y divide-outline-variant/30">
              {vocabulary.map((item) => {
                const meaning = formatMeaning(item.english);
                return (
                  <div
                    key={item.id}
                    data-id={item.french}
                    onClick={() => openPeek("vocab", item.id)}
                    className="p-3 active:bg-surface-container-low hover:bg-surface-container-low/60 transition-colors cursor-pointer flex items-center justify-between gap-3 group"
                  >
                    {/* 2-Line Content */}
                    <div className="min-w-0 flex-1">
                      {/* Line 1: [Article] French Term · English Gloss */}
                      <div className="flex items-baseline gap-1.5 truncate">
                        {item.article && typeof item.article === "string" && (
                          <span className="text-on-surface-variant/70 font-serif text-xs">
                            {item.article}
                          </span>
                        )}
                        <span className="font-bold text-sm text-primary tracking-tight font-sans">
                          {item.french}
                        </span>
                        {item.plural_form && (
                          <span className="text-[10px] text-on-surface-variant/60 font-mono">
                            (pl. {item.plural_form})
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

                      {/* Line 2: Category/Gender · CEFR · Word Family / Sense */}
                      <div className="flex items-center gap-1 text-[11px] font-mono text-on-surface-variant/75 mt-0.5 truncate">
                        <span className="font-semibold text-on-surface">
                          {formatPosGender(item)}
                        </span>
                        {item.word_family && item.word_family.length > 0 ? (
                          <>
                            <span className="text-on-surface-variant/40">·</span>
                            <span className="text-on-surface-variant/80 truncate">
                              famille: {item.word_family.slice(0, 2).join(", ")}
                            </span>
                          </>
                        ) : item.senses?.[0]?.meaning ? (
                          <>
                            <span className="text-on-surface-variant/40">·</span>
                            <span className="text-on-surface-variant/80 truncate">
                              {item.senses[0].meaning}
                            </span>
                          </>
                        ) : null}
                      </div>
                    </div>

                    {/* Right Controls: Save/Review Action Menu + Peek indicator */}
                    <div className="flex items-center gap-1 shrink-0">
                      <RowActionMenu
                        type="vocab"
                        id={item.id}
                        fullUrl={detailHref(item)}
                        label={item.french}
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
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="p-3 border-t border-outline-variant bg-surface-container-low flex items-center justify-between text-xs font-mono text-on-surface-variant">
              <div>
                Page <strong>{currentPage}</strong> of <strong>{totalPages}</strong> ({total} entries)
              </div>
              <div className="flex items-center gap-1.5">
                {currentPage > 1 && (
                  <Link
                    href={`/vocabulary?${new URLSearchParams({
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
                    href={`/vocabulary?${new URLSearchParams({
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
          <p className="text-sm font-medium">No dictionary entries found for your filter.</p>
          <button
            onClick={() => router.push("/vocabulary")}
            className="text-xs text-primary underline font-mono"
          >
            Clear all filters
          </button>
        </div>
      )}
    </div>
  );
}
