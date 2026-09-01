import React from "react";
import Link from "next/link";
import { getTenses } from "@/src/lib/data/selectors";

export default async function TensesPage() {
  const { tenses, total } = getTenses();

  // Group by mood
  const moodGroups = tenses.reduce((acc, t) => {
    const mood = t.mood || "Other";
    if (!acc[mood]) acc[mood] = [];
    acc[mood].push(t);
    return acc;
  }, {} as Record<string, typeof tenses>);

  return (
    <div className="space-y-8 pb-12">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-outline-variant/60 pb-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-primary font-sans">
            Tenses & Moods Atlas
          </h1>
          <p className="text-xs md:text-sm text-on-surface-variant mt-1">
            Systematic breakdown of French verbal systems: Indicatif, Subjonctif, Conditionnel, Impératif, and Participe.
          </p>
        </div>
        <div className="text-xs font-mono px-3 py-1.5 rounded bg-surface-container-high border border-outline-variant/50 self-start md:self-auto">
          <strong className="text-primary">{total}</strong> Tenses & Moods Registered
        </div>
      </div>

      {/* TENSES GROUPED BY MOOD */}
      <div className="space-y-8">
        {Object.entries(moodGroups).map(([mood, list]) => (
          <div key={mood} className="space-y-3">
            <div className="flex items-center gap-2 border-b border-outline-variant/50 pb-2">
              <span className="material-symbols-outlined text-primary text-[20px]">
                history_toggle_off
              </span>
              <h2 className="text-lg font-bold text-primary uppercase font-mono tracking-wider">
                Mode {mood} ({list.length})
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {list.map((tense) => (
                <Link
                  key={tense.id}
                  href={`/tenses/${encodeURIComponent(tense.id)}`}
                  className="p-5 rounded-lg bg-surface-container-lowest border border-outline-variant hover:border-primary transition-all duration-150 flex flex-col justify-between shadow-xs group"
                >
                  <div className="space-y-2">
                    <div className="flex items-start justify-between">
                      <h3 className="font-bold text-base text-primary group-hover:text-primary-container">
                        {tense.name_fr}
                      </h3>
                      <span className="text-[10px] font-mono uppercase px-1.5 py-0.5 rounded bg-surface-container-high text-on-surface-variant">
                        {tense.mood || "Tense"}
                      </span>
                    </div>

                    <p className="text-xs font-serif italic text-secondary">
                      {tense.name_en}
                    </p>

                    {tense.temporal_reference && (
                      <p className="text-xs text-on-surface-variant line-clamp-2">
                        {tense.temporal_reference}
                      </p>
                    )}

                    {tense.formation_rule && (
                      <div className="p-2 rounded bg-surface-container text-xs font-mono text-primary border border-outline-variant/40 mt-2">
                        {tense.formation_rule}
                      </div>
                    )}
                  </div>

                  <div className="flex items-center justify-between pt-3 mt-3 border-t border-surface-container text-xs font-mono text-primary">
                    <span>Explore Conjugations</span>
                    <span className="material-symbols-outlined text-[16px] group-hover:translate-x-1 transition-transform">
                      arrow_forward
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
