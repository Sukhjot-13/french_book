import React from "react";
import { getVocabulary } from "@/src/lib/data/selectors";
import { VocabDictionaryTable } from "@/src/components/vocabulary/VocabDictionaryTable";

interface VocabPageProps {
  searchParams: Promise<{
    query?: string;
    pos?: string;
    gender?: string;
    letter?: string;
    page?: string;
  }>;
}

export default async function VocabularyPage({ searchParams }: VocabPageProps) {
  const params = await searchParams;
  const query = params.query || "";
  const pos = params.pos || "all";
  const gender = params.gender || "all";
  const letter = params.letter || "all";
  const currentPage = params.page ? parseInt(params.page, 10) : 1;
  const pageSize = 50;

  const { vocabulary, total } = getVocabulary({
    query,
    pos,
    gender,
    letter,
    limit: pageSize,
    offset: (currentPage - 1) * pageSize,
  });

  return (
    <div className="space-y-4 pb-12">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-outline-variant/60 pb-3">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl md:text-2xl font-bold text-primary font-sans">
              Vocabulary Dictionary
            </h1>
            <span className="text-xs font-mono px-2 py-0.5 rounded bg-surface-container-high text-on-surface-variant">
              {total} entries
            </span>
          </div>
          <p className="text-xs text-on-surface-variant mt-0.5">
            Dictionary-style lexical inventory. Click any entry to peek word families, grammatical categories, and contextual usage.
          </p>
        </div>
      </div>

      {/* DENSE DICTIONARY TABLE WITH A-Z JUMP BAR & PEEK */}
      <VocabDictionaryTable
        vocabulary={vocabulary}
        total={total}
        currentPage={currentPage}
        pageSize={pageSize}
        initialFilters={{
          query,
          pos,
          gender,
          letter,
        }}
      />
    </div>
  );
}
