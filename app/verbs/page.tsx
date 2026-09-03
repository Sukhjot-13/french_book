import React from "react";
import Link from "next/link";
import { getVerbs } from "@/src/lib/data/selectors";
import {
  PriorityBadge,
  GroupBadge,
  AuxiliaryBadge,
  RegularityBadge,
  TransitivityBadge,
  CEFRBadge,
} from "@/src/components/ui/Badges";

interface VerbsPageProps {
  searchParams: Promise<{
    query?: string;
    group?: string;
    regularity?: string;
    auxiliary?: string;
    transitivity?: string;
    cefr?: string;
    priority?: string;
    page?: string;
  }>;
}

export default async function VerbsPage({ searchParams }: VerbsPageProps) {
  const params = await searchParams;
  const query = params.query || "";
  const group = params.group || "all";
  const regularity = params.regularity || "all";
  const auxiliary = params.auxiliary || "all";
  const transitivity = params.transitivity || "all";
  const cefr = params.cefr || "all";
  const currentPage = params.page ? parseInt(params.page, 10) : 1;
  const pageSize = 50;

  const { verbs, total } = getVerbs({
    query,
    group,
    regularity,
    auxiliary,
    transitivity,
    cefr,
    limit: pageSize,
    offset: (currentPage - 1) * pageSize,
  });

  const totalPages = Math.ceil(total / pageSize);

  return (
    <div className="space-y-6 pb-12">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-outline-variant/60 pb-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-primary font-sans">
            Verbs & Conjugations Library
          </h1>
          <p className="text-xs md:text-sm text-on-surface-variant mt-1">
            Authoritative inventory of {total} French verbs from the Master Schema with full tense conjugations, auxiliaries, transitivity, and senses.
          </p>
        </div>
        <div className="text-xs font-mono px-3 py-1.5 rounded-lg bg-surface-container-high border border-outline-variant/50 self-start md:self-auto">
          Showing <strong className="text-primary">{verbs.length}</strong> of{" "}
          <strong className="text-primary">{total}</strong> verbs
        </div>
      </div>

      {/* FILTER BAR */}
      <form method="GET" className="p-4 rounded-xl bg-surface-container-low border border-outline-variant space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {/* Search text */}
          <div className="lg:col-span-2">
            <label className="block text-[11px] font-mono uppercase text-on-surface-variant mb-1">
              Search Verb or English
            </label>
            <div className="relative">
              <input
                type="text"
                name="query"
                defaultValue={query}
                placeholder="e.g. prendre, aller, to speak..."
                className="w-full px-3 py-2 pl-8 rounded bg-surface-container-lowest border border-outline-variant text-sm text-on-surface focus:outline-none focus:border-primary"
              />
              <span className="material-symbols-outlined absolute left-2 top-2 text-[18px] text-on-surface-variant">
                search
              </span>
            </div>
          </div>

          {/* Group Filter */}
          <div>
            <label className="block text-[11px] font-mono uppercase text-on-surface-variant mb-1">
              Verb Group
            </label>
            <select
              name="group"
              defaultValue={group}
              className="w-full px-3 py-2 rounded bg-surface-container-lowest border border-outline-variant text-sm text-on-surface focus:outline-none focus:border-primary"
            >
              <option value="all">All Groups</option>
              <option value="1st_group">1er Groupe (-er)</option>
              <option value="2nd_group">2e Groupe (-ir)</option>
              <option value="3rd_group">3e Groupe (-re/-oir)</option>
              <option value="irregular">Irrégulier</option>
            </select>
          </div>

          {/* Regularity Filter */}
          <div>
            <label className="block text-[11px] font-mono uppercase text-on-surface-variant mb-1">
              Regularity
            </label>
            <select
              name="regularity"
              defaultValue={regularity}
              className="w-full px-3 py-2 rounded bg-surface-container-lowest border border-outline-variant text-sm text-on-surface focus:outline-none focus:border-primary"
            >
              <option value="all">All Regularities</option>
              <option value="regular">Regular</option>
              <option value="irregular">Irregular</option>
            </select>
          </div>

          {/* Auxiliary Filter */}
          <div>
            <label className="block text-[11px] font-mono uppercase text-on-surface-variant mb-1">
              Auxiliary
            </label>
            <select
              name="auxiliary"
              defaultValue={auxiliary}
              className="w-full px-3 py-2 rounded bg-surface-container-lowest border border-outline-variant text-sm text-on-surface focus:outline-none focus:border-primary"
            >
              <option value="all">All Auxiliaries</option>
              <option value="avoir">Avoir</option>
              <option value="être">Être</option>
              <option value="both">Both (Avoir / Être)</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-2 border-t border-outline-variant/40">
          {/* Transitivity */}
          <div>
            <label className="block text-[11px] font-mono uppercase text-on-surface-variant mb-1">
              Transitivity
            </label>
            <select
              name="transitivity"
              defaultValue={transitivity}
              className="w-full px-3 py-1.5 rounded bg-surface-container-lowest border border-outline-variant text-xs text-on-surface focus:outline-none focus:border-primary"
            >
              <option value="all">All Transitivities</option>
              <option value="transitive">Transitif direct</option>
              <option value="transitive_indirect">Transitif indirect</option>
              <option value="intransitive">Intransitif</option>
              <option value="both">Transitif & Intransitif</option>
            </select>
          </div>

          {/* CEFR Level */}
          <div>
            <label className="block text-[11px] font-mono uppercase text-on-surface-variant mb-1">
              CEFR Level
            </label>
            <select
              name="cefr"
              defaultValue={cefr}
              className="w-full px-3 py-1.5 rounded bg-surface-container-lowest border border-outline-variant text-xs text-on-surface focus:outline-none focus:border-primary"
            >
              <option value="all">All CEFR Levels</option>
              <option value="A1">A1 Beginner</option>
              <option value="A2">A2 Elementary</option>
              <option value="B1">B1 Intermediate</option>
              <option value="B2">B2 Upper Intermediate</option>
              <option value="C1">C1 Advanced</option>
            </select>
          </div>

          <div className="lg:col-span-2 flex items-end justify-end gap-2">
            <Link
              href="/verbs"
              className="px-3 py-1.5 text-xs text-on-surface-variant hover:text-primary transition-colors"
            >
              Reset Filters
            </Link>
            <button
              type="submit"
              className="px-4 py-1.5 rounded bg-[#002147] text-white text-xs font-semibold hover:bg-primary transition-colors"
            >
              Apply Filters
            </button>
          </div>
        </div>
      </form>

      {/* VERBS TABLE */}
      {verbs.length > 0 ? (
        <div className="rounded-xl border border-outline-variant overflow-hidden bg-surface-container-lowest shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm border-collapse">
              <thead>
                <tr className="bg-surface-container border-b border-outline-variant text-[11px] font-mono uppercase text-on-surface-variant tracking-wider">
                  <th className="py-3 px-4">Infinitive (Lemma)</th>
                  <th className="py-3 px-4">English Meaning</th>
                  <th className="py-3 px-4">Classification</th>
                  <th className="py-3 px-4">Auxiliary & Transitivity</th>
                  <th className="py-3 px-4">CEFR & Priority</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/50">
                {verbs.map((verb) => (
                  <tr
                    key={verb.id}
                    className="hover:bg-surface-container-low transition-colors group"
                  >
                    <td className="py-3 px-4 font-semibold text-primary">
                      <Link
                        href={`/verbs/${encodeURIComponent(verb.lemma)}`}
                        className="hover:underline flex items-center gap-2"
                      >
                        <span className="text-base font-bold">{verb.lemma}</span>
                        {verb.pronominal && (
                          <span className="text-[10px] font-mono text-purple-700 bg-purple-50 border border-purple-200 px-1 rounded">
                            se
                          </span>
                        )}
                      </Link>
                    </td>
                    <td className="py-3 px-4 text-on-surface-variant">
                      <div className="font-medium text-on-surface">{verb.english || "—"}</div>
                      {verb.past_participle && (
                        <div className="text-[11px] font-mono text-slate-500 mt-0.5">
                          p.p.: <span className="font-semibold text-slate-700">{verb.past_participle}</span>
                        </div>
                      )}
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex flex-wrap items-center gap-1">
                        <GroupBadge group={verb.group} />
                        <RegularityBadge regularity={verb.regularity} />
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex flex-wrap items-center gap-1">
                        <AuxiliaryBadge auxiliary={verb.auxiliary} />
                        <TransitivityBadge transitivity={verb.transitivity} />
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-1.5">
                        <CEFRBadge cefr={verb.cefr} />
                        <PriorityBadge priority={verb.priority} />
                      </div>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <Link
                        href={`/verbs/${encodeURIComponent(verb.lemma)}`}
                        className="inline-flex items-center gap-1 text-xs font-mono font-medium text-primary hover:underline px-2.5 py-1 rounded bg-surface-container group-hover:bg-[#002147] group-hover:text-white transition-colors"
                      >
                        <span>Conjugate</span>
                        <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="p-12 text-center rounded-xl border border-dashed border-outline-variant bg-surface-container-lowest">
          <span className="material-symbols-outlined text-4xl text-outline mb-2">translate</span>
          <h3 className="text-base font-bold text-primary">No verbs found</h3>
          <p className="text-xs text-on-surface-variant mt-1">
            Try adjusting your search query or removing filters.
          </p>
          <Link
            href="/verbs"
            className="inline-block mt-4 px-4 py-2 rounded bg-primary text-white text-xs font-semibold"
          >
            Clear All Filters
          </Link>
        </div>
      )}

      {/* PAGINATION */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between border-t border-outline-variant/60 pt-4 text-xs font-mono text-on-surface-variant">
          <div>
            Page {currentPage} of {totalPages}
          </div>
          <div className="flex items-center gap-2">
            {currentPage > 1 && (
              <Link
                href={`/verbs?query=${encodeURIComponent(query)}&group=${group}&regularity=${regularity}&auxiliary=${auxiliary}&transitivity=${transitivity}&cefr=${cefr}&page=${currentPage - 1}`}
                className="px-3 py-1.5 rounded bg-surface-container-high hover:bg-surface-container-highest border border-outline-variant"
              >
                &larr; Previous
              </Link>
            )}
            {currentPage < totalPages && (
              <Link
                href={`/verbs?query=${encodeURIComponent(query)}&group=${group}&regularity=${regularity}&auxiliary=${auxiliary}&transitivity=${transitivity}&cefr=${cefr}&page=${currentPage + 1}`}
                className="px-3 py-1.5 rounded bg-surface-container-high hover:bg-surface-container-highest border border-outline-variant"
              >
                Next &rarr;
              </Link>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
