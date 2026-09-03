import React from "react";
import Link from "next/link";
import { getTenses } from "@/src/lib/data/selectors";
import { MoodBadge } from "@/src/components/ui/Badges";

export default async function TensesPage() {
  const tenses = getTenses();

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
            Systematic breakdown of all {tenses.length} French verbal systems across Indicatif, Subjonctif, Conditionnel, and Impératif moods.
          </p>
        </div>
        <div className="text-xs font-mono px-3 py-1.5 rounded-lg bg-surface-container-high border border-outline-variant/50 self-start md:self-auto">
          <strong className="text-primary">{tenses.length}</strong> Verbal Systems
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
              <h2 className="text-base font-bold text-primary uppercase font-mono tracking-wider">
                Mode {mood} ({list.length})
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {list.map((tense) => (
                <Link
                  key={tense.id}
                  href={`/tenses/${encodeURIComponent(tense.name_fr)}`}
                  className="p-5 rounded-xl bg-surface-container-lowest border border-outline-variant hover:border-primary transition-all duration-150 flex flex-col justify-between shadow-xs group"
                >
                  <div className="space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="font-bold text-base text-primary group-hover:underline capitalize">
                        {tense.name_fr}
                      </h3>
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

                    {tense.common_traps && tense.common_traps.length > 0 && (
                      <p className="text-[11px] text-amber-800 bg-amber-50 px-2 py-1 rounded border border-amber-200 mt-1">
                        ⚠️ {tense.common_traps[0]}
                      </p>
                    )}
                  </div>

                  <div className="flex items-center justify-between pt-3 mt-3 border-t border-surface-container text-xs font-mono text-primary">
                    <span>Explore System</span>
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
