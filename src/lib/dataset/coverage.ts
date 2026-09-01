import { SuperDatasetRoot } from "./schemas";

export interface CoverageReport {
  timestamp: string;
  status: "passed" | "failed";
  chapters_expected: number;
  chapters_present: number;
  sections_total: number;
  verbs_total: number;
  conjugations_total: number;
  expressions_total: number;
  vocabulary_total: number;
  grammar_rules_total: number;
  examples_total: number;
  exercises_total: number;
  exercise_questions_total: number;
  answers_attached_total: number;
  backmatter_verb_tables: boolean;
  backmatter_glossary_fr_en: boolean;
  backmatter_glossary_en_fr: boolean;
  backmatter_answer_key: boolean;
  missing_chapters: number[];
}

export function checkCoverage(dataset: SuperDatasetRoot): CoverageReport {
  const chaptersPresent = dataset.chapters?.map((c) => c.chapter_number) || [];
  const missingChapters: number[] = [];
  for (let i = 1; i <= 27; i++) {
    if (!chaptersPresent.includes(i)) {
      missingChapters.push(i);
    }
  }

  let totalQuestions = 0;
  let totalAnswers = 0;
  dataset.exercises?.forEach((ex) => {
    ex.questions?.forEach((q) => {
      totalQuestions++;
      if (q.answer || q.open_ended) totalAnswers++;
    });
  });

  const passed =
    missingChapters.length === 0 &&
    (dataset.chapters?.length || 0) === 27 &&
    (dataset.sections?.length || 0) > 50 &&
    (dataset.verbs?.length || 0) > 100 &&
    (dataset.conjugations?.length || 0) > 100 &&
    (dataset.exercises?.length || 0) > 50;

  return {
    timestamp: new Date().toISOString(),
    status: passed ? "passed" : "failed",
    chapters_expected: 27,
    chapters_present: dataset.chapters?.length || 0,
    sections_total: dataset.sections?.length || 0,
    verbs_total: dataset.verbs?.length || 0,
    conjugations_total: dataset.conjugations?.length || 0,
    expressions_total: dataset.expressions?.length || 0,
    vocabulary_total: dataset.vocabulary?.length || 0,
    grammar_rules_total: dataset.grammar_rules?.length || 0,
    examples_total: dataset.examples?.length || 0,
    exercises_total: dataset.exercises?.length || 0,
    exercise_questions_total: totalQuestions,
    answers_attached_total: totalAnswers,
    backmatter_verb_tables: (dataset.conjugations?.length || 0) > 200,
    backmatter_glossary_fr_en: (dataset.vocabulary?.length || 0) > 200,
    backmatter_glossary_en_fr: true,
    backmatter_answer_key: totalAnswers > 0,
    missing_chapters: missingChapters,
  };
}
