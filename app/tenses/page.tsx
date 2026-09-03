import React from "react";
import { getTenses } from "@/src/lib/data/selectors";
import { TensesDirectoryTable } from "@/src/components/tenses/TensesDirectoryTable";

export const metadata = {
  title: "Tenses & Moods Atlas | French Revision Platform",
  description: "Systematic directory of all 24 French verbal systems across Indicatif, Subjonctif, Conditionnel, and Impératif.",
};

export default async function TensesPage() {
  const tenses = getTenses();

  return (
    <div className="space-y-6 pb-16">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-outline-variant/60 pb-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-primary font-sans">
            Tenses & Moods Atlas
          </h1>
          <p className="text-xs md:text-sm text-on-surface-variant mt-1">
            Systematic breakdown of all {tenses.length} French verbal systems across Indicatif, Subjonctif, Conditionnel, and Impératif moods. Scan formations and uses, peek details, or deep dive.
          </p>
        </div>
        <div className="text-xs font-mono px-3 py-1.5 rounded-lg bg-surface-container-high border border-outline-variant/50 self-start md:self-auto">
          <strong className="text-primary">{tenses.length}</strong> Verbal Systems
        </div>
      </div>

      {/* TENSES DIRECTORY TABLE (COMPACT TABLE OR CARDS WITH SCAN → PEEK) */}
      <TensesDirectoryTable tenses={tenses} />
    </div>
  );
}
