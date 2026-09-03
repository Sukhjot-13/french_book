"use client";

import React, { useState } from "react";
import Link from "next/link";
import { TenseUI } from "@/src/lib/data/selectors";
import { MoodBadge } from "@/src/components/ui/Badges";
import { usePeek } from "@/src/components/peek/PeekContext";

interface TensesDirectoryTableProps {
  tenses: TenseUI[];
}

export function TensesDirectoryTable({ tenses }: TensesDirectoryTableProps) {
  const { openPeek } = usePeek();
  const [viewMode, setViewMode] = useState<"table" | "cards">("table");
  const [filterMood, setFilterMood] = useState<string>("all");

  const moods = ["all", "indicatif", "conditionnel", "subjonctif", "impératif"];

  const filteredTenses = tenses.filter((t) => {
    if (filterMood !== "all") {
      return (t.mood || "").toLowerCase() === filterMood.toLowerCase();
    }
    return true;
  });

  // Group by mood
  const moodOrder = ["Indicatif", "Conditionnel", "Subjonctif", "Impératif"];
  const moodGroups = filteredTenses.reduce((acc, t) => {
    const mood = t.mood || "Other";
    const canonicalMood =
      moodOrder.find((m) => m.toLowerCase() === mood.toLowerCase()) || mood;
    if (!acc[canonicalMood]) acc[canonicalMood] = [];
    acc[canonicalMood].push(t);
    return acc;
  }, {} as Record<string, TenseUI[]>);

  const sortedMoodKeys = Object.keys(moodGroups).sort((a, b) => {
    const idxA = moodOrder.indexOf(a);
    const idxB = moodOrder.indexOf(b);
    if (idxA !== -1 && idxB !== -1) return idxA - idxB;
    if (idxA !== -1) return -1;
    if (idxB !== -1) return 1;
    return a.localeCompare(b);
  });

  return (
    <div className="space-y-6">
      {/* FILTER & VIEW CONTROLS */}
      <div className="p-3.5 rounded-xl bg-surface-container-low border border-outline-variant flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
        {/* Mood filter pills */}
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="text-on-surface-variant font-bold uppercase text-[11px] mr-1">
            Mood:
          </span>
          {moods.map((m) => (
            <button
              key={m}
              onClick={() => setFilterMood(m)}
              className={`px-2.5 py-1 rounded-lg capitalize transition-colors ${
                filterMood === m
                  ? "bg-[#002147] text-white font-bold shadow-xs"
                  : "bg-surface-container-lowest border border-outline-variant/60 text-on-surface hover:bg-surface-container hover:text-primary"
              }`}
            >
              {m === "all" ? "All Moods" : m}
            </button>
          ))}
        </div>

        {/* View Mode Toggle */}
        <div className="flex items-center gap-1 bg-surface-container-lowest border border-outline-variant p-0.5 rounded-lg">
          <button
            onClick={() => setViewMode("table")}
            className={`px-2.5 py-1 rounded text-xs flex items-center gap-1 transition-colors ${
              viewMode === "table"
                ? "bg-[#002147] text-white font-semibold"
                : "text-on-surface-variant hover:text-primary"
            }`}
            title="Compact Table View"
          >
            <span className="material-symbols-outlined text-[16px]">table_rows</span>
            <span>Table</span>
          </button>
          <button
            onClick={() => setViewMode("cards")}
            className={`px-2.5 py-1 rounded text-xs flex items-center gap-1 transition-colors ${
              viewMode === "cards"
                ? "bg-[#002147] text-white font-semibold"
                : "text-on-surface-variant hover:text-primary"
            }`}
            title="Card Grid View"
          >
            <span className="material-symbols-outlined text-[16px]">grid_view</span>
            <span>Cards</span>
          </button>
        </div>
      </div>

      {/* GROUPED CONTENT */}
      <div className="space-y-8">
        {sortedMoodKeys.map((mood) => {
          const groupList = moodGroups[mood];
          if (!groupList || groupList.length === 0) return null;

          return (
            <div key={mood} className="space-y-3">
              <div className="flex items-center justify-between border-b border-outline-variant/60 pb-2">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary text-[20px]">
                    history_toggle_off
                  </span>
                  <h2 className="text-base font-bold text-primary uppercase font-mono tracking-wider">
                    Mode {mood}
                  </h2>
                  <span className="px-2 py-0.5 rounded-full text-[11px] font-mono font-bold bg-surface-container-high text-on-surface-variant">
                    {groupList.length} tenses
                  </span>
                </div>
              </div>

              {viewMode === "table" ? (
                /* COMPACT SCAN → PEEK TABLE */
                <div className="overflow-x-auto rounded-xl border border-outline-variant bg-surface-container-lowest shadow-xs">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="border-b border-outline-variant bg-surface-container-low font-mono text-[11px] text-on-surface-variant uppercase tracking-wider">
                        <th className="py-2.5 px-3.5">Tense / Système</th>
                        <th className="py-2.5 px-3.5">Formation Formula</th>
                        <th className="py-2.5 px-3.5">Main Use</th>
                        <th className="py-2.5 px-3.5">Pitfalls</th>
                        <th className="py-2.5 px-3.5 text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-outline-variant/40 font-sans">
                      {groupList.map((tense) => (
                        <tr
                          key={tense.id}
                          onClick={() => openPeek("tense", tense.name_fr)}
                          className="hover:bg-surface-container-low transition-colors cursor-pointer group"
                        >
                          {/* Tense Name & English */}
                          <td className="py-3 px-3.5">
                            <div className="flex flex-col">
                              <Link
                                href={`/tenses/${encodeURIComponent(tense.name_fr)}`}
                                onClick={(e) => e.stopPropagation()}
                                className="font-bold text-sm text-primary hover:underline group-hover:text-blue-900 capitalize"
                              >
                                {tense.name_fr}
                              </Link>
                              {tense.name_en && (
                                <span className="text-[11px] font-serif italic text-on-surface-variant">
                                  {tense.name_en}
                                </span>
                              )}
                            </div>
                          </td>

                          {/* Formation formula */}
                          <td className="py-3 px-3.5 max-w-xs">
                            {tense.formation ? (
                              <code className="text-[11px] font-mono text-primary bg-surface-container px-2 py-0.5 rounded border border-outline-variant/40 inline-block">
                                {tense.formation}
                              </code>
                            ) : (
                              <span className="text-on-surface-variant/60 italic">—</span>
                            )}
                          </td>

                          {/* Main Usage */}
                          <td className="py-3 px-3.5 max-w-sm">
                            {tense.usage && tense.usage.length > 0 ? (
                              <span className="text-xs text-on-surface line-clamp-2">
                                {tense.usage[0]}
                              </span>
                            ) : (
                              <span className="text-on-surface-variant/60 italic">—</span>
                            )}
                          </td>

                          {/* Traps */}
                          <td className="py-3 px-3.5">
                            {tense.common_traps && tense.common_traps.length > 0 ? (
                              <span className="inline-flex items-center gap-1 text-[11px] font-mono text-amber-900 bg-amber-100/80 px-2 py-0.5 rounded border border-amber-300">
                                <span>⚠️</span>
                                <span>{tense.common_traps.length} trap{tense.common_traps.length > 1 ? "s" : ""}</span>
                              </span>
                            ) : (
                              <span className="text-on-surface-variant/50 text-[11px] font-mono">None</span>
                            )}
                          </td>

                          {/* Actions */}
                          <td className="py-3 px-3.5 text-right">
                            <div className="inline-flex items-center gap-1">
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  openPeek("tense", tense.name_fr);
                                }}
                                className="px-2 py-1 rounded text-[11px] font-mono text-primary bg-surface-container group-hover:bg-[#002147] group-hover:text-white transition-colors"
                              >
                                Peek →
                              </button>
                              <Link
                                href={`/tenses/${encodeURIComponent(tense.name_fr)}`}
                                onClick={(e) => e.stopPropagation()}
                                className="p-1 rounded text-on-surface-variant hover:text-primary transition-colors"
                                title="Open full tense deep dive"
                              >
                                <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                              </Link>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                /* CARD GRID VIEW */
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {groupList.map((tense) => (
                    <div
                      key={tense.id}
                      onClick={() => openPeek("tense", tense.name_fr)}
                      className="p-5 rounded-xl bg-surface-container-lowest border border-outline-variant hover:border-primary transition-all flex flex-col justify-between shadow-xs cursor-pointer group"
                    >
                      <div className="space-y-2">
                        <div className="flex items-start justify-between gap-2">
                          <Link
                            href={`/tenses/${encodeURIComponent(tense.name_fr)}`}
                            onClick={(e) => e.stopPropagation()}
                            className="font-bold text-base text-primary group-hover:underline capitalize"
                          >
                            {tense.name_fr}
                          </Link>
                          <MoodBadge mood={tense.mood} />
                        </div>

                        {tense.name_en && (
                          <p className="text-xs font-serif italic text-secondary">
                            {tense.name_en}
                          </p>
                        )}

                        {tense.formation && (
                          <div className="p-2 rounded bg-surface-container text-xs font-mono text-primary border border-outline-variant/40 mt-2">
                            {tense.formation}
                          </div>
                        )}

                        {tense.usage && tense.usage.length > 0 && (
                          <p className="text-xs text-on-surface-variant line-clamp-2">
                            {tense.usage[0]}
                          </p>
                        )}

                        {tense.common_traps && tense.common_traps.length > 0 && (
                          <p className="text-[11px] text-amber-800 bg-amber-50 px-2 py-1 rounded border border-amber-200 mt-1">
                            ⚠️ {tense.common_traps[0]}
                          </p>
                        )}
                      </div>

                      <div className="pt-4 mt-4 border-t border-outline-variant/40 flex items-center justify-between text-xs font-mono">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            openPeek("tense", tense.name_fr);
                          }}
                          className="text-primary group-hover:underline"
                        >
                          Quick Peek
                        </button>
                        <Link
                          href={`/tenses/${encodeURIComponent(tense.name_fr)}`}
                          onClick={(e) => e.stopPropagation()}
                          className="inline-flex items-center gap-1 font-semibold text-primary"
                        >
                          <span>Full Deep Dive</span>
                          <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
