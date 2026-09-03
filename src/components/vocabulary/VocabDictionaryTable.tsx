"use client";

import React, { useState, useTransition } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { VocabUI } from "@/src/lib/data/selectors";
import { usePeek } from "../peek/PeekContext";

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
      router.push(`/vocabulary?${params.toString()}`);
    });
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateFilters({ query: searchQuery });
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
          <div className="relative">
            <input
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
              >
                ×
              </button>
            )}
          </div>
        </form>

        {/* Category & Gender Selects */}
        <div className="flex items-center gap-2">
          <select
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

          <select
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

      {/* DENSE DICTIONARY TABLE */}
      {vocabulary.length > 0 ? (
        <div className="rounded-xl border border-outline-variant overflow-hidden bg-surface-container-lowest shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse font-sans">
              <thead>
                <tr className="bg-surface-container border-b border-outline-variant text-[11px] font-mono uppercase text-on-surface-variant tracking-wider">
                  <th className="py-2.5 px-3.5">Term (Lexical Entry)</th>
                  <th className="py-2.5 px-3.5">Category</th>
                  <th className="py-2.5 px-3.5">English Translation</th>
                  <th className="py-2.5 px-3.5">Family & Notes</th>
                  <th className="py-2.5 px-3.5 text-right">Quick Peek</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/40">
                {vocabulary.map((item) => {
                  return (
                    <tr
                      key={item.id}
                      onClick={() => openPeek("vocab", item.french)}
                      className="hover:bg-surface-container-low transition-colors cursor-pointer group"
                    >
                      {/* Term + Article */}
                      <td className="py-2.5 px-3.5 font-semibold text-primary">
                        <div className="flex items-center gap-1.5">
                          {item.article && typeof item.article === "string" && (
                            <span className="text-on-surface-variant/80 font-normal font-serif">
                              {item.article}
                            </span>
                          )}
                          <span className="font-bold text-sm text-primary group-hover:underline">
                            {item.french}
                          </span>
                          {item.plural_form && (
                            <span className="text-[11px] text-on-surface-variant/70 font-mono">
                              (pl. {item.plural_form})
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Type / Gender (e.g. n.m., adj., etc.) */}
                      <td className="py-2.5 px-3.5 font-mono text-on-surface-variant">
                        <span className="font-semibold text-on-surface">
                          {formatPosGender(item)}
                        </span>
                      </td>

                      {/* English Meaning */}
                      <td className="py-2.5 px-3.5 text-on-surface font-medium">
                        {item.english || "—"}
                      </td>

                      {/* Word Family / Senses */}
                      <td className="py-2.5 px-3.5 text-on-surface-variant text-[11px]">
                        {item.word_family?.length > 0 ? (
                          <span className="font-mono text-on-surface-variant">
                            {item.word_family.slice(0, 3).join(", ")}
                          </span>
                        ) : item.senses?.[0]?.meaning ? (
                          <span className="truncate block max-w-xs">
                            {item.senses[0].meaning}
                          </span>
                        ) : (
                          <span>—</span>
                        )}
                      </td>

                      {/* Quick Peek */}
                      <td className="py-2.5 px-3.5 text-right">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            openPeek("vocab", item.french);
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
