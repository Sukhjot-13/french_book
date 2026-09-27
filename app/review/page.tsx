import React from "react";
import { getVerbs, getVocabulary } from "@/src/lib/data/selectors";
import { ReviewSession } from "@/src/components/review/ReviewSession";
import type { SrsCard } from "@/src/lib/data/srs";

export const metadata = {
  title: "Review Flashcards — L'Étude",
};

// SRS deck: irregular verbs (lemma → English) + vocabulary (French → English),
// capped so a first session stays completable. Scheduling state lives in
// LocalStorage (see src/lib/data/srs.ts).
export default async function ReviewPage() {
  const { verbs } = getVerbs({ limit: 400 });
  const { vocabulary } = getVocabulary({ limit: 600 });

  const cards: SrsCard[] = [
    ...verbs
      .filter((v) => v.regularity === "irregular")
      .slice(0, 120)
      .map((v) => ({
        key: `verb:${v.id}`,
        front: v.lemma,
        back: v.english || "—",
        hint: "irregular verb · English meaning",
      })),
    ...vocabulary.slice(0, 180).map((w) => ({
      key: `vocab:${w.id}`,
      front: w.display_form || w.french,
      back: w.english || "—",
      hint: [w.article, w.part_of_speech].filter(Boolean).join(" · ") || undefined,
    })),
  ];

  return (
    <div className="space-y-4 pb-12">
      <div className="border-b border-outline-variant/60 pb-3">
        <h1 className="text-xl md:text-2xl font-bold text-primary font-sans">
          Review Flashcards
        </h1>
        <p className="text-xs text-on-surface-variant mt-0.5">
          Spaced repetition over irregular verbs and vocabulary. Progress is stored in your browser.
        </p>
      </div>
      <ReviewSession cards={cards} />
    </div>
  );
}
