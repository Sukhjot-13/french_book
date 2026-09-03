import React from "react";
import Link from "next/link";
import { getVocabulary } from "@/src/lib/data/selectors";
import { PriorityBadge, PosBadge, GenderBadge } from "@/src/components/ui/Badges";

interface VocabPageProps {
  searchParams: Promise<{
    query?: string;
    pos?: string;
    gender?: string;
    page?: string;
  }>;
}

export default async function VocabularyPage({ searchParams }: VocabPageProps) {
  const params = await searchParams;
  const query = params.query || "";
  const pos = params.pos || "all";
  const gender = params.gender || "all";
  const currentPage = params.page ? parseInt(params.page, 10) : 1;
  const pageSize = 50;

  const { vocabulary, total } = getVocabulary({
    query,
    pos,
    gender,
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
            Vocabulary Lexicon
          </h1>
          <p className="text-xs md:text-sm text-on-surface-variant mt-1">
            Global dictionary of {total} French lexical entries with articles, grammatical categories, gender tags, and senses.
          </p>
        </div>
        <div className="text-xs font-mono px-3 py-1.5 rounded-lg bg-surface-container-high border border-outline-variant/50 self-start md:self-auto">
          Showing <strong className="text-primary">{vocabulary.length}</strong> of{" "}
          <strong className="text-primary">{total}</strong> terms
        </div>
      </div>

      {/* FILTER BAR */}
      <form method="GET" className="p-4 rounded-xl bg-surface-container-low border border-outline-variant space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {/* Search */}
          <div className="lg:col-span-2">
            <label className="block text-[11px] font-mono uppercase text-on-surface-variant mb-1">
              Search French or English
            </label>
            <div className="relative">
              <input
                type="text"
                name="query"
                defaultValue={query}
                placeholder="e.g. maison, travail, book..."
                className="w-full px-3 py-2 pl-8 rounded bg-surface-container-lowest border border-outline-variant text-sm text-on-surface focus:outline-none focus:border-primary"
              />
              <span className="material-symbols-outlined absolute left-2 top-2.5 text-[18px] text-on-surface-variant">
                search
              </span>
            </div>
          </div>

          {/* Part of Speech */}
          <div>
            <label className="block text-[11px] font-mono uppercase text-on-surface-variant mb-1">
              Part of Speech
            </label>
            <select
              name="pos"
              defaultValue={pos}
              className="w-full px-3 py-2 rounded bg-surface-container-lowest border border-outline-variant text-sm text-on-surface focus:outline-none focus:border-primary"
            >
              <option value="all">All Parts of Speech</option>
              <option value="noun">Noun</option>
              <option value="adjective">Adjective</option>
              <option value="adverb">Adverb</option>
              <option value="preposition">Preposition</option>
              <option value="conjunction">Conjunction</option>
              <option value="pronoun">Pronoun</option>
              <option value="verb">Verb</option>
            </select>
          </div>

          {/* Gender */}
          <div>
            <label className="block text-[11px] font-mono uppercase text-on-surface-variant mb-1">
              Noun Gender
            </label>
            <select
              name="gender"
              defaultValue={gender}
              className="w-full px-3 py-2 rounded bg-surface-container-lowest border border-outline-variant text-sm text-on-surface focus:outline-none focus:border-primary"
            >
              <option value="all">All Genders</option>
              <option value="masculine">Masculine (n.m.)</option>
              <option value="feminine">Feminine (n.f.)</option>
            </select>
          </div>
        </div>

        <div className="flex items-center justify-end gap-2 pt-2 border-t border-outline-variant/40">
          <Link
            href="/vocabulary"
            className="px-3 py-1.5 text-xs text-on-surface-variant hover:text-primary transition-colors"
          >
            Reset
          </Link>
          <button
            type="submit"
            className="px-4 py-1.5 rounded bg-[#002147] text-white text-xs font-semibold hover:bg-primary transition-colors"
          >
            Apply Filters
          </button>
        </div>
      </form>

      {/* VOCABULARY TABLE */}
      {vocabulary.length > 0 ? (
        <div className="rounded-xl border border-outline-variant overflow-hidden bg-surface-container-lowest shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm border-collapse">
              <thead>
                <tr className="bg-surface-container border-b border-outline-variant text-[11px] font-mono uppercase text-on-surface-variant tracking-wider">
                  <th className="py-3 px-4">French Term</th>
                  <th className="py-3 px-4">English Translation</th>
                  <th className="py-3 px-4">Grammar & Article</th>
                  <th className="py-3 px-4">Word Family & Senses</th>
                  <th className="py-3 px-4">Priority</th>
                  <th className="py-3 px-4 text-right">Chapter</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/50">
                {vocabulary.map((item) => {
                  const firstChapter = item.raw_chapters?.[0];
                  return (
                    <tr
                      key={item.id}
                      className="hover:bg-surface-container-low transition-colors group"
                    >
                      <td className="py-3 px-4 font-semibold text-primary">
                        <div className="flex items-center gap-1.5">
                          {item.article && (
                            <span className="text-on-surface-variant/70 font-mono text-xs">
                              {item.article}
                            </span>
                          )}
                          <span className="text-base font-bold">{item.french}</span>
                          {item.plural_form && (
                            <span className="text-[11px] font-mono text-on-surface-variant/70">
                              (pl. {item.plural_form})
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="py-3 px-4 text-on-surface-variant">
                        <div className="text-on-surface font-medium">{item.english || "—"}</div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-1.5">
                          <PosBadge pos={item.part_of_speech} />
                          <GenderBadge gender={item.gender} />
                        </div>
                      </td>
                      <td className="py-3 px-4 text-xs">
                        {item.word_family && item.word_family.length > 0 ? (
                          <div className="flex flex-wrap gap-1 font-mono text-[11px] text-primary">
                            {item.word_family.slice(0, 3).map((w, idx) => (
                              <span key={idx} className="bg-surface-container px-1.5 py-0.2 rounded">
                                {w}
                              </span>
                            ))}
                          </div>
                        ) : (
                          <span className="text-on-surface-variant/60">—</span>
                        )}
                      </td>
                      <td className="py-3 px-4">
                        <PriorityBadge priority={item.priority} />
                      </td>
                      <td className="py-3 px-4 text-right">
                        {firstChapter ? (
                          <Link
                            href={`/chapters/${firstChapter}`}
                            className="px-2 py-1 rounded bg-surface-container text-xs font-mono text-primary hover:bg-primary hover:text-white transition-colors"
                          >
                            Ch {firstChapter}
                          </Link>
                        ) : (
                          <span className="text-xs font-mono text-on-surface-variant/50">—</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="p-12 text-center rounded-xl border border-dashed border-outline-variant bg-surface-container-lowest">
          <span className="material-symbols-outlined text-4xl text-outline mb-2">dictionary</span>
          <h3 className="text-base font-bold text-primary">No vocabulary found</h3>
          <p className="text-xs text-on-surface-variant mt-1">
            Try adjusting your search query or removing filters.
          </p>
          <Link
            href="/vocabulary"
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
                href={`/vocabulary?query=${encodeURIComponent(query)}&pos=${pos}&gender=${gender}&page=${currentPage - 1}`}
                className="px-3 py-1.5 rounded bg-surface-container-high hover:bg-surface-container-highest border border-outline-variant"
              >
                &larr; Previous
              </Link>
            )}
            {currentPage < totalPages && (
              <Link
                href={`/vocabulary?query=${encodeURIComponent(query)}&pos=${pos}&gender=${gender}&page=${currentPage + 1}`}
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
