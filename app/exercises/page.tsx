import React from "react";
import Link from "next/link";
import { getExercises, getChapters } from "@/src/lib/data/selectors";
import { paginate } from "@/src/lib/pagination";

interface ExercisesPageProps {
  searchParams: Promise<{
    query?: string;
    chapterId?: string;
    type?: string;
    page?: string;
  }>;
}

export default async function ExercisesPage({ searchParams }: ExercisesPageProps) {
  const params = await searchParams;
  const query = params.query || "";
  const chapterId = params.chapterId || "all";
  const type = params.type || "all";
  const pageSize = 20;

  const filtered = getExercises({ query, chapterId, type }).exercises;
  const { items: exercises, currentPage, totalPages, total } = paginate(filtered, params.page, pageSize);

  const chapters = getChapters();

  return (
    <div className="space-y-6 pb-12">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-outline-variant/60 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-emerald-700 text-2xl">quiz</span>
            <h1 className="text-2xl md:text-3xl font-bold text-primary font-sans">
              Exercises & Practice Drills
            </h1>
          </div>
          <p className="text-xs md:text-sm text-on-surface-variant mt-1">
            Complete database of {total} curriculum practice exercises across all 27 chapters with interactive self-check answer reveals.
          </p>
        </div>
        <div className="text-xs font-mono px-3 py-1.5 rounded-lg bg-emerald-100 text-emerald-950 border border-emerald-300 self-start md:self-auto font-semibold">
          {total} Exercises Available
        </div>
      </div>

      {/* FILTER BAR */}
      <form method="GET" className="p-4 rounded-xl bg-surface-container-low border border-outline-variant space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {/* Search */}
          <div>
            <label
              htmlFor="exercises-search"
              className="block text-[11px] font-mono uppercase text-on-surface-variant mb-1"
            >
              Search Exercises
            </label>
            <div className="relative">
              <input
                id="exercises-search"
                type="text"
                name="query"
                defaultValue={query}
                placeholder="e.g. mettre les verbes, 1.1, passé composé..."
                className="w-full px-3 py-2 pl-8 rounded bg-surface-container-lowest border border-outline-variant text-sm text-on-surface focus:outline-none focus:border-primary"
              />
              <span className="material-symbols-outlined absolute left-2 top-2.5 text-[18px] text-on-surface-variant">
                search
              </span>
            </div>
          </div>

          {/* Chapter Filter */}
          <div>
            <label
              htmlFor="exercises-chapter"
              className="block text-[11px] font-mono uppercase text-on-surface-variant mb-1"
            >
              Filter by Chapter
            </label>
            <select
              id="exercises-chapter"
              name="chapterId"
              defaultValue={chapterId}
              className="w-full px-3 py-2 rounded bg-surface-container-lowest border border-outline-variant text-sm text-on-surface focus:outline-none focus:border-primary"
            >
              <option value="all">All Chapters</option>
              {chapters.map((ch) => (
                <option key={ch.id} value={ch.id}>
                  Chapter {ch.chapter_number}: {ch.title}
                </option>
              ))}
            </select>
          </div>

          {/* Exercise Type */}
          <div>
            <label
              htmlFor="exercises-type"
              className="block text-[11px] font-mono uppercase text-on-surface-variant mb-1"
            >
              Exercise Type
            </label>
            <select
              id="exercises-type"
              name="type"
              defaultValue={type}
              className="w-full px-3 py-2 rounded bg-surface-container-lowest border border-outline-variant text-sm text-on-surface focus:outline-none focus:border-primary"
            >
              <option value="all">All Types</option>
              <option value="fill_in_the_blank">Fill in the blank</option>
              <option value="multiple_choice">Multiple choice</option>
              <option value="conjugation_drill">Conjugation drill</option>
              <option value="transformation">Transformation</option>
              <option value="translation">Translation</option>
            </select>
          </div>
        </div>

        <div className="flex items-center justify-end gap-2 pt-2 border-t border-outline-variant/40">
          <Link
            href="/exercises"
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

      {/* EXERCISES LIST */}
      {exercises.length > 0 ? (
        <div className="space-y-6">
          {exercises.map((ex) => (
            <div
              key={ex.id}
              className="p-6 rounded-xl bg-surface-container-lowest border border-outline-variant shadow-xs space-y-4"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-surface-container pb-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold uppercase text-white bg-[#002147] px-2 py-0.5 rounded">
                      Ch {ex.chapter_number} • {ex.exercise_code}
                    </span>
                    <h2 className="font-bold text-base text-primary">
                      {ex.title}
                    </h2>
                  </div>
                  {ex.section_title && (
                    <p className="text-xs text-on-surface-variant font-medium mt-1">
                      Section: {ex.section_title}
                    </p>
                  )}
                </div>

                <div className="flex items-center gap-2 self-start sm:self-auto">
                  <span className="text-xs font-mono px-2 py-1 rounded bg-emerald-50 text-emerald-800 border border-emerald-200 font-semibold">
                    {ex.questions_count} questions
                  </span>
                  <Link
                    href={`/chapters/${ex.chapter_number}`}
                    className="text-xs font-mono text-primary hover:underline"
                  >
                    View Chapter &rarr;
                  </Link>
                </div>
              </div>

              {ex.instructions && (
                <div className="p-3 rounded-lg bg-surface-container-low text-xs text-on-surface font-medium leading-relaxed">
                  <strong>Instructions:</strong> {ex.instructions}
                </div>
              )}

              {/* Questions List with Self-Check Reveal */}
              {ex.questions && ex.questions.length > 0 && (
                <div className="space-y-3 pt-2">
                  <div className="text-xs font-mono font-bold uppercase text-on-surface-variant">
                    Exercise Questions & Solutions:
                  </div>

                  <div className="divide-y divide-surface-container rounded-lg border border-outline-variant/60 overflow-hidden bg-surface">
                    {ex.questions.map((q, qIdx) => (
                      <div key={qIdx} className="p-3 space-y-2 hover:bg-surface-container-lowest transition-colors">
                        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2 text-xs">
                          <div className="font-medium text-on-surface flex items-start gap-2">
                            <span className="font-mono font-bold text-primary">
                              {q.question_number || qIdx + 1}.
                            </span>
                            <span>{q.prompt}</span>
                          </div>

                          {/* Options if Multiple Choice */}
                          {q.options && q.options.length > 0 && (
                            <div className="flex flex-wrap gap-1 mt-1 sm:mt-0">
                              {q.options.map((opt, oIdx) => (
                                <span key={oIdx} className="px-2 py-0.5 rounded bg-surface-container text-[11px] font-mono">
                                  {opt}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>

                        {/* Interactive Revealable Solution */}
                        {q.correct_answer && (
                          <details className="cursor-pointer text-xs group">
                            <summary className="font-mono text-[11px] text-emerald-800 hover:text-emerald-950 font-semibold select-none inline-flex items-center gap-1">
                              <span className="material-symbols-outlined text-[14px]">visibility</span>
                              <span>Reveal Answer</span>
                            </summary>
                            <div className="mt-2 p-2.5 rounded-lg bg-emerald-50/80 border border-emerald-200 text-emerald-950 font-mono text-xs">
                              <strong>Answer:</strong>{" "}
                              <span className="font-bold">
                                {Array.isArray(q.correct_answer) ? q.correct_answer.join(" / ") : q.correct_answer}
                              </span>
                              {q.explanation && (
                                <div className="mt-1 font-sans text-[11px] text-emerald-900 border-t border-emerald-200 pt-1">
                                  {q.explanation}
                                </div>
                              )}
                            </div>
                          </details>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="p-12 text-center rounded-xl border border-dashed border-outline-variant bg-surface-container-lowest">
          <span className="material-symbols-outlined text-4xl text-outline mb-2">quiz</span>
          <h3 className="text-base font-bold text-primary">No exercises found</h3>
          <p className="text-xs text-on-surface-variant mt-1">
            Try adjusting your search query or removing filters.
          </p>
          <Link
            href="/exercises"
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
                href={`/exercises?query=${encodeURIComponent(query)}&chapterId=${chapterId}&type=${type}&page=${currentPage - 1}`}
                className="px-3 py-1.5 rounded bg-surface-container-high hover:bg-surface-container-highest border border-outline-variant"
              >
                &larr; Previous
              </Link>
            )}
            {currentPage < totalPages && (
              <Link
                href={`/exercises?query=${encodeURIComponent(query)}&chapterId=${chapterId}&type=${type}&page=${currentPage + 1}`}
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
