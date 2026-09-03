import React from "react";
import Link from "next/link";
import { getChapters } from "@/src/lib/data/selectors";

export default async function ChaptersPage() {
  const chapters = getChapters();

  return (
    <div className="space-y-6 pb-12">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-outline-variant/60 pb-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-primary font-sans">
            Curriculum Chapters
          </h1>
          <p className="text-xs md:text-sm text-on-surface-variant mt-1">
            Browse all {chapters.length} structured grammar lessons and textbook chapters from the Master Schema.
          </p>
        </div>
        <div className="text-xs font-mono px-3 py-1.5 rounded-lg bg-surface-container-high border border-outline-variant/50 self-start md:self-auto">
          <strong className="text-primary">{chapters.length}</strong> Chapters in Curriculum
        </div>
      </div>

      {/* CHAPTERS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {chapters.map((ch) => (
          <Link
            key={ch.id}
            href={`/chapters/${ch.chapter_number}`}
            className="p-5 rounded-xl bg-surface-container-lowest border border-outline-variant hover:border-primary transition-all duration-150 flex flex-col justify-between shadow-xs group"
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-mono font-bold uppercase text-white bg-[#002147] px-2 py-0.5 rounded">
                  Chapter {ch.chapter_number}
                </span>
                {ch.pages?.printed_start && ch.pages?.printed_end && (
                  <span className="text-[11px] font-mono text-on-surface-variant">
                    pp. {ch.pages.printed_start}–{ch.pages.printed_end}
                  </span>
                )}
              </div>

              <h2 className="font-bold text-base text-primary group-hover:underline leading-snug">
                {ch.title}
              </h2>

              {ch.sections && ch.sections.length > 0 && (
                <div className="text-xs text-on-surface-variant line-clamp-2 leading-relaxed">
                  {ch.sections.map((s) => s.title).join(" • ")}
                </div>
              )}
            </div>

            <div className="flex items-center justify-between pt-3 mt-3 border-t border-surface-container text-xs font-mono text-on-surface-variant">
              <span>
                {ch.grammar_rules.length} rules • {ch.verbs.length} verbs • {ch.sections.length} sections
              </span>
              <span className="text-primary font-bold group-hover:translate-x-1 transition-transform flex items-center gap-1">
                <span>Study</span>
                <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
              </span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
