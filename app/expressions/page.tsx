import React from "react";
import Link from "next/link";
import { getExpressions } from "@/src/lib/data/selectors";
import { PriorityBadge, RegisterBadge } from "@/src/components/ui/Badges";

interface ExpressionsPageProps {
  searchParams: Promise<{
    query?: string;
    type?: string;
    register?: string;
    strength?: string;
    priority?: string;
    page?: string;
  }>;
}

export default async function ExpressionsPage({ searchParams }: ExpressionsPageProps) {
  const params = await searchParams;
  const query = params.query || "";
  const type = params.type || "all";
  const register = params.register || "all";
  const strength = params.strength || "all";
  const priority = params.priority ? parseInt(params.priority, 10) : undefined;
  const currentPage = params.page ? parseInt(params.page, 10) : 1;
  const pageSize = 50;

  const { expressions, total } = getExpressions({
    query,
    type,
    register,
    strength,
    priority,
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
            Expressions & Collocations Library
          </h1>
          <p className="text-xs md:text-sm text-on-surface-variant mt-1">
            Idioms, verb constructions, connectors, conversational phrases, and lexical collocations.
          </p>
        </div>
        <div className="text-xs font-mono px-3 py-1.5 rounded bg-surface-container-high border border-outline-variant/50 self-start md:self-auto">
          Showing <strong className="text-primary">{expressions.length}</strong> of{" "}
          <strong className="text-primary">{total}</strong> expressions
        </div>
      </div>

      {/* FILTER BAR */}
      <form method="GET" className="p-4 rounded-lg bg-surface-container-low border border-outline-variant space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {/* Search text */}
          <div className="lg:col-span-2">
            <label className="block text-[11px] font-mono uppercase text-on-surface-variant mb-1">
              Search Expression or Meaning
            </label>
            <div className="relative">
              <input
                type="text"
                name="query"
                defaultValue={query}
                placeholder="e.g. avoir besoin de, faire attention, taking decision..."
                className="w-full px-3 py-2 pl-8 rounded bg-surface-container-lowest border border-outline-variant text-sm text-on-surface focus:outline-none focus:border-primary"
              />
              <span className="material-symbols-outlined absolute left-2 top-2 text-[18px] text-on-surface-variant">
                search
              </span>
            </div>
          </div>

          {/* Type Filter */}
          <div>
            <label className="block text-[11px] font-mono uppercase text-on-surface-variant mb-1">
              Expression Type
            </label>
            <select
              name="type"
              defaultValue={type}
              className="w-full px-3 py-2 rounded bg-surface-container-lowest border border-outline-variant text-sm text-on-surface focus:outline-none focus:border-primary"
            >
              <option value="all">All Types</option>
              <option value="verb_pattern">Verb Pattern</option>
              <option value="collocation">Collocation</option>
              <option value="fixed_expression">Fixed Expression</option>
              <option value="idiom">Idiom</option>
              <option value="connector">Connector / Transition</option>
              <option value="sentence_starter">Sentence Starter</option>
              <option value="conversation_phrase">Conversation Phrase</option>
            </select>
          </div>

          {/* Register Filter */}
          <div>
            <label className="block text-[11px] font-mono uppercase text-on-surface-variant mb-1">
              Register
            </label>
            <select
              name="register"
              defaultValue={register}
              className="w-full px-3 py-2 rounded bg-surface-container-lowest border border-outline-variant text-sm text-on-surface focus:outline-none focus:border-primary"
            >
              <option value="all">All Registers</option>
              <option value="formal">Formal</option>
              <option value="neutral">Neutral</option>
              <option value="informal">Informal</option>
              <option value="colloquial">Colloquial</option>
              <option value="literary">Literary</option>
            </select>
          </div>
        </div>

        <div className="flex items-center justify-between pt-2 border-t border-outline-variant/40">
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-mono text-on-surface-variant">Priority:</span>
            {[5, 4, 3, 2, 1].map((p) => (
              <Link
                key={p}
                href={`/expressions?query=${encodeURIComponent(query)}&type=${type}&register=${register}&strength=${strength}&priority=${priority === p ? "" : p}`}
                className={`px-2 py-0.5 rounded text-xs font-mono ${
                  priority === p
                    ? "bg-primary text-white font-bold"
                    : "bg-surface-container-high text-on-surface-variant hover:bg-surface-container-highest"
                }`}
              >
                P{p}
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <Link
              href="/expressions"
              className="px-3 py-1.5 text-xs text-on-surface-variant hover:text-primary transition-colors"
            >
              Reset
            </Link>
            <button
              type="submit"
              className="px-4 py-1.5 rounded bg-primary text-white text-xs font-semibold hover:bg-primary-container transition-colors"
            >
              Apply Filters
            </button>
          </div>
        </div>
      </form>

      {/* EXPRESSIONS TABLE */}
      {expressions.length > 0 ? (
        <div className="rounded-lg border border-outline-variant overflow-hidden bg-surface-container-lowest shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm border-collapse">
              <thead>
                <tr className="bg-surface-container border-b border-outline-variant text-[11px] font-mono uppercase text-on-surface-variant tracking-wider">
                  <th className="py-3 px-4">French Expression</th>
                  <th className="py-3 px-4">English Meaning</th>
                  <th className="py-3 px-4">Type / Register</th>
                  <th className="py-3 px-4">Priority</th>
                  <th className="py-3 px-4 text-right">Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/50">
                {expressions.map((exp) => (
                  <tr
                    key={exp.id}
                    className="hover:bg-surface-container-low transition-colors group"
                  >
                    <td className="py-3 px-4 font-semibold text-primary">
                      <Link
                        href={`/expressions/${encodeURIComponent(exp.id)}`}
                        className="hover:underline text-base"
                      >
                        {exp.french}
                      </Link>
                    </td>
                    <td className="py-3 px-4 text-on-surface-variant">
                      <div>{exp.english || "—"}</div>
                      {exp.literal_english && (
                        <div className="text-xs text-on-surface-variant/70 italic">
                          Lit: &ldquo;{exp.literal_english}&rdquo;
                        </div>
                      )}
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex flex-wrap items-center gap-1">
                        {exp.type && (
                          <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-surface-container-high text-on-surface-variant uppercase">
                            {exp.type}
                          </span>
                        )}
                        <RegisterBadge register={exp.register} />
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <PriorityBadge priority={exp.priority} />
                    </td>
                    <td className="py-3 px-4 text-right">
                      <Link
                        href={`/expressions/${encodeURIComponent(exp.id)}`}
                        className="inline-flex items-center gap-1 text-xs font-mono font-medium text-primary hover:underline px-2.5 py-1 rounded bg-surface-container group-hover:bg-primary group-hover:text-white transition-colors"
                      >
                        <span>View</span>
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
        <div className="p-12 text-center rounded-lg border border-dashed border-outline-variant bg-surface-container-lowest">
          <span className="material-symbols-outlined text-4xl text-outline mb-2">chat_bubble</span>
          <h3 className="text-base font-bold text-primary">No expressions found</h3>
          <p className="text-xs text-on-surface-variant mt-1">
            Try adjusting your search query or removing filters.
          </p>
          <Link
            href="/expressions"
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
                href={`/expressions?query=${encodeURIComponent(query)}&type=${type}&register=${register}&strength=${strength}&priority=${priority || ""}&page=${currentPage - 1}`}
                className="px-3 py-1.5 rounded bg-surface-container-high hover:bg-surface-container-highest border border-outline-variant"
              >
                &larr; Previous
              </Link>
            )}
            {currentPage < totalPages && (
              <Link
                href={`/expressions?query=${encodeURIComponent(query)}&type=${type}&register=${register}&strength=${strength}&priority=${priority || ""}&page=${currentPage + 1}`}
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
