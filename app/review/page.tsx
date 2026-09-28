import React from "react";
import { getVerbs, getVocabulary } from "@/src/lib/data/selectors";
import { ReviewSession } from "@/src/components/review/ReviewSession";
import type { SrsCard } from "@/src/lib/data/srs";

export const metadata = {
  title: "Review Flashcards — L'Étude",
};

const VOCAB_DECK_SIZE = 300;
const VOCAB_STRIDE = Math.ceil(1002 / VOCAB_DECK_SIZE);

// SRS deck: irregular verbs (lemma → English) + vocabulary (French → English).
// Built from the untruncated collections so no irregular verb is dropped and the
// vocabulary sample is spread across the whole A–Z range instead of a leading
// alphabetical slice. Scheduling state lives in LocalStorage (see srs.ts), and
// ReviewSession keeps drawing further batches as cards are learned.
export default async function ReviewPage() {
  const { verbs } = getVerbs();
  const { vocabulary } = getVocabulary();

  const cards: SrsCard[] = [
    ...verbs
      .filter((v) => v.regularity === "irregular")
      .map((v) => ({
        key: `verb:${v.id}`,
        front: v.lemma,
        back: v.english || "—",
        hint: "irregular verb · English meaning",
      })),
    ...vocabulary
      .filter((_, idx) => idx % VOCAB_STRIDE === 0)
      .map((w) => ({
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
          Spaced repetition over {verbs.filter((v) => v.regularity === "irregular").length} irregular
          verbs and a cross-section of the {vocabulary.length}-entry dictionary. Progress is stored in
          your browser.
        </p>
      </div>
      <ReviewSession cards={cards} />
    </div>
  );
}
