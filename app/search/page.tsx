import React from "react";
import Link from "next/link";
import { getDataset } from "@/src/lib/data/loader";
import { searchDataset } from "@/src/lib/data/search";
import { PriorityBadge } from "@/src/components/ui/Badges";

interface SearchPageProps {
  searchParams: Promise<{
    q?: string;
  }>;
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const { q } = await searchParams;
  const rawQuery = q || "";
  const dataset = getDataset();
  const results = rawQuery.trim() ? searchDataset(dataset, rawQuery, 50) : [];

  const typeIcons: Record<string, string> = {
    verb: "translate",
    expression: "chat_bubble",
    vocabulary: "dictionary",
    grammar_rule: "menu_book",
    tense: "history_toggle_off",
    chapter: "import_contacts",
    example: "format_quote",
    exercise: "quiz",
    exception_trap: "warning",
  };

  const typeLabels: Record<string, string> = {
    verb: "Verb",
    expression: "Expression",
    vocabulary: "Vocabulary",
    grammar_rule: "Grammar Rule",
    tense: "Tense / Mood",
    chapter: "Chapter",
    example: "Example Sentence",
    exercise: "Exercise",
    exception_trap: "Trap / Pitfall",
  };

  return (
    <div className="space-y-6 pb-12">
      {/* HEADER */}
      <div className="border-b border-outline-variant/60 pb-4">
        <h1 className="text-2xl md:text-3xl font-bold text-primary font-sans">
          Search Results
        </h1>
        <p className="text-xs md:text-sm text-on-surface-variant mt-1">
          {rawQuery.trim() ? (
            <>
              Found <strong className="text-primary">{results.length}</strong> matches for &ldquo;
              <strong className="text-primary">{rawQuery}</strong>&rdquo; across all 10 master collections
              (accent-insensitive).
            </>
          ) : (
            "Enter a search term to find verbs, expressions, rules, tenses, vocabulary, exercises, traps, or examples."
          )}
        </p>
      </div>

      {/* SEARCH FORM */}
      <form method="GET" className="flex gap-2 max-w-2xl">
        <div className="relative flex-1">
          <input
            type="text"
            name="q"
            defaultValue={rawQuery}
            placeholder="Search across entire repository..."
            className="w-full px-4 py-2.5 pl-10 rounded-lg bg-surface-container-lowest border border-outline-variant text-sm text-on-surface focus:outline-none focus:border-primary"
          />
          <span className="material-symbols-outlined absolute left-3 top-2.5 text-[20px] text-on-surface-variant">
            search
          </span>
        </div>
        <button
          type="submit"
          className="px-5 py-2.5 rounded-lg bg-[#002147] text-white text-xs font-semibold hover:bg-primary transition-colors"
        >
          Search
        </button>
      </form>

      {/* RESULTS LIST */}
      {results.length > 0 ? (
        <div className="divide-y divide-outline-variant/50 rounded-xl border border-outline-variant overflow-hidden bg-surface-container-lowest shadow-xs">
          {results.map((item) => (
            <Link
              key={`${item.type}-${item.id}`}
              href={item.url}
              className="p-4 md:p-5 flex items-start justify-between gap-4 hover:bg-surface-container-low transition-colors group block"
            >
              <div className="flex items-start gap-3.5">
                <div className="w-9 h-9 rounded-lg bg-surface-container-high text-primary flex items-center justify-center mt-0.5 group-hover:bg-[#002147] group-hover:text-white transition-colors shrink-0">
                  <span className="material-symbols-outlined text-[18px]">
                    {typeIcons[item.type] || "search"}
                  </span>
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-base text-primary group-hover:underline">
                      {item.title}
                    </span>
                    <span className="text-[10px] font-mono uppercase px-1.5 py-0.2 rounded bg-surface-container-highest text-on-surface-variant">
                      {typeLabels[item.type] || item.type}
                    </span>
                  </div>
                  {item.subtitle && (
                    <p className="text-xs text-on-surface-variant mt-0.5">{item.subtitle}</p>
                  )}
                  {item.snippet && (
                    <p className="text-xs text-on-surface-variant/80 font-mono mt-1 line-clamp-1">
                      {item.snippet}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-3 shrink-0">
                <PriorityBadge priority={item.priority} />
                <span className="material-symbols-outlined text-[18px] text-on-surface-variant group-hover:translate-x-1 transition-transform">
                  arrow_forward
                </span>
              </div>
            </Link>
          ))}
        </div>
      ) : rawQuery.trim() ? (
        <div className="p-12 text-center rounded-xl border border-dashed border-outline-variant bg-surface-container-lowest">
          <span className="material-symbols-outlined text-4xl text-outline mb-2">search_off</span>
          <h3 className="text-base font-bold text-primary">No results found</h3>
          <p className="text-xs text-on-surface-variant mt-1">
            We couldn&apos;t find anything matching &ldquo;{rawQuery}&rdquo;. Try another term.
          </p>
        </div>
      ) : null}
    </div>
  );
}
