import fs from "fs";
import path from "path";

interface ChapterCensus {
  chapter_number: number;
  sections: number;
  concepts: number;
  grammar_rules: number;
  verbs: number;
  conjugations: number;
  expressions: number;
  vocabulary: number;
  examples: number;
  exercises: number;
  questions: number;
  physical_attestation_objects: number;
}

function countAttestationsInObj(obj: any): number {
  if (!obj || typeof obj !== "object") return 0;
  let count = 0;
  if (Array.isArray(obj)) {
    for (const item of obj) {
      count += countAttestationsInObj(item);
    }
    return count;
  }
  if (Array.isArray(obj.attestations)) {
    count += obj.attestations.length;
  }
  for (const k of Object.keys(obj)) {
    if (k !== "attestations") {
      count += countAttestationsInObj(obj[k]);
    }
  }
  return count;
}

function normalizeCode(code: string): string {
  return (code || "").replace(/[·.]/g, "-").trim();
}

function extractNumber(val: string | number): string {
  if (typeof val === "number") return String(val);
  const match = val.match(/^(\d+)/);
  if (match) return match[1];
  return val.trim();
}

export function generateAuthoritativeCensus() {
  const root = process.cwd();
  const bookdataDir = path.join(root, "bookdata/json");
  const akFile = path.join(bookdataDir, "answer_key.json");

  const perChapter: ChapterCensus[] = [];
  const totals = {
    chapters: 27,
    sections: 0,
    concepts: 0,
    grammar_rules: 0,
    verbs: 0,
    conjugations: 0,
    expressions: 0,
    vocabulary: 0,
    examples: 0,
    exercises: 0,
    questions: 0,
    physical_attestation_objects: 0,
  };

  interface QuestionRecord {
    chapter: number;
    exercise_code: string;
    normalized_exercise_code: string;
    question_number_raw: string | number;
    question_number_norm: string;
    prompt: string;
    exercise_id: string;
    question_id: string;
  }

  const chapterQuestions = new Map<string, QuestionRecord>();
  const chapterExercises = new Map<string, { chapter: number; raw_code: string; id: string; question_count: number }>();

  for (let ch = 1; ch <= 27; ch++) {
    const chPath = path.join(bookdataDir, `${ch}.json`);
    const data = JSON.parse(fs.readFileSync(chPath, "utf-8"));
    const chCensus: ChapterCensus = {
      chapter_number: ch,
      sections: data.sections?.length || 0,
      concepts: data.concepts?.length || 0,
      grammar_rules: data.grammar_rules?.length || 0,
      verbs: data.verbs?.length || 0,
      conjugations: data.conjugations?.length || 0,
      expressions: data.expressions?.length || 0,
      vocabulary: data.vocabulary?.length || 0,
      examples: data.examples?.length || 0,
      exercises: data.exercises?.length || 0,
      questions: 0,
      physical_attestation_objects: countAttestationsInObj(data),
    };

    for (const ex of data.exercises || []) {
      const normCode = normalizeCode(ex.exercise_code || ex.id);
      chapterExercises.set(normCode, {
        chapter: ch,
        raw_code: ex.exercise_code,
        id: ex.id,
        question_count: ex.questions?.length || 0,
      });

      for (const q of ex.questions || []) {
        chCensus.questions++;
        const qNumRaw = q.number;
        const qNumNorm = extractNumber(qNumRaw);
        const qKey = `${normCode}::${qNumNorm}`;
        chapterQuestions.set(qKey, {
          chapter: ch,
          exercise_code: ex.exercise_code,
          normalized_exercise_code: normCode,
          question_number_raw: qNumRaw,
          question_number_norm: qNumNorm,
          prompt: q.prompt,
          exercise_id: ex.id,
          question_id: q.id,
        });
      }
    }

    totals.sections += chCensus.sections;
    totals.concepts += chCensus.concepts;
    totals.grammar_rules += chCensus.grammar_rules;
    totals.verbs += chCensus.verbs;
    totals.conjugations += chCensus.conjugations;
    totals.expressions += chCensus.expressions;
    totals.vocabulary += chCensus.vocabulary;
    totals.examples += chCensus.examples;
    totals.exercises += chCensus.exercises;
    totals.questions += chCensus.questions;
    totals.physical_attestation_objects += chCensus.physical_attestation_objects;
    perChapter.push(chCensus);
  }

  // Read answer key
  const akData = JSON.parse(fs.readFileSync(akFile, "utf-8"));
  interface AkRecord {
    chapter: number;
    exercise_code: string;
    normalized_exercise_code: string;
    question_number: string;
    answer: string;
    source_pages: any[];
  }
  const akAnswers = new Map<string, AkRecord>();
  const akExercises = new Map<string, { chapter: number; raw_code: string; answer_count: number }>();

  for (const ex of akData.exercises || []) {
    const normCode = normalizeCode(ex.exercise_code);
    akExercises.set(normCode, {
      chapter: ex.chapter_number,
      raw_code: ex.exercise_code,
      answer_count: ex.answers?.length || 0,
    });
    for (const a of ex.answers || []) {
      const qNumNorm = extractNumber(a.question_number);
      const qKey = `${normCode}::${qNumNorm}`;
      akAnswers.set(qKey, {
        chapter: ex.chapter_number,
        exercise_code: ex.exercise_code,
        normalized_exercise_code: normCode,
        question_number: qNumNorm,
        answer: a.answer,
        source_pages: a.source_pages || [],
      });
    }
  }

  // Compare and classify gaps
  interface GapRecord {
    identity: string;
    exercise_code: string;
    normalized_exercise_code: string;
    question_number: string;
    chapter: number;
    classification:
      | "COUNTING_SCHEMA_DIFFERENCE"
      | "QUESTION_PRESENT_UNDER_DIFFERENT_STRUCTURE"
      | "SOURCE_EXTRACTION_MISSING"
      | "ANSWER_KEY_ONLY_IDENTITY"
      | "MALFORMED_SOURCE_RECORD"
      | "UNRESOLVED";
    reason: string;
    answer_key_answer?: string;
    source_pages?: any[];
  }

  const gaps: GapRecord[] = [];

  // Note on 9-5: check if raw was malformed
  for (const [key, qRec] of chapterQuestions) {
    if (qRec.normalized_exercise_code === "9-5" && typeof qRec.question_number_raw === "string" && qRec.question_number_raw.includes(".")) {
      gaps.push({
        identity: key,
        exercise_code: qRec.exercise_code,
        normalized_exercise_code: qRec.normalized_exercise_code,
        question_number: qRec.question_number_norm,
        chapter: qRec.chapter,
        classification: "MALFORMED_SOURCE_RECORD",
        reason: `Question number field in bookdata/json/9.json contained prompt text ('${qRec.question_number_raw}'). Prompt and question are present in chapter source.`,
      });
    }
  }

  for (const [key, akRec] of akAnswers) {
    const chRec = chapterQuestions.get(key);
    if (!chRec) {
      if (akRec.normalized_exercise_code === "13-9") {
        gaps.push({
          identity: key,
          exercise_code: akRec.exercise_code,
          normalized_exercise_code: akRec.normalized_exercise_code,
          question_number: akRec.question_number,
          chapter: akRec.chapter,
          classification: "QUESTION_PRESENT_UNDER_DIFFERENT_STRUCTURE",
          reason: "Exercise 13-9 is a 5-item matching exercise grouped in bookdata/json/13.json as a single composite question with number '1-5'. In answer_key.json, each sub-item is listed individually with its own answer.",
          answer_key_answer: akRec.answer,
          source_pages: akRec.source_pages,
        });
      } else if (akRec.normalized_exercise_code === "9-7") {
        gaps.push({
          identity: key,
          exercise_code: akRec.exercise_code,
          normalized_exercise_code: akRec.normalized_exercise_code,
          question_number: akRec.question_number,
          chapter: akRec.chapter,
          classification: "SOURCE_EXTRACTION_MISSING",
          reason: "Questions 6-10 of exercise 9-7 are located on PDF page 93 (printed page 79) and were omitted during extraction of bookdata/json/9.json, which only extracted page 92.",
          answer_key_answer: akRec.answer,
          source_pages: akRec.source_pages,
        });
      } else if (akRec.chapter === 21) {
        gaps.push({
          identity: key,
          exercise_code: akRec.exercise_code,
          normalized_exercise_code: akRec.normalized_exercise_code,
          question_number: akRec.question_number,
          chapter: akRec.chapter,
          classification: "SOURCE_EXTRACTION_MISSING",
          reason: `Question ${akRec.question_number} of exercise ${akRec.exercise_code} was omitted during extraction of bookdata/json/21.json (PDF pages 183-196, printed pages 169-182).`,
          answer_key_answer: akRec.answer,
          source_pages: akRec.source_pages,
        });
      } else {
        gaps.push({
          identity: key,
          exercise_code: akRec.exercise_code,
          normalized_exercise_code: akRec.normalized_exercise_code,
          question_number: akRec.question_number,
          chapter: akRec.chapter,
          classification: "UNRESOLVED",
          reason: "Question present in answer_key.json but not found in bookdata chapter file.",
          answer_key_answer: akRec.answer,
          source_pages: akRec.source_pages,
        });
      }
    }
  }

  // Check composite question 13-9:1-5
  const ch13_9_comp = chapterQuestions.get("13-9::1-5");
  if (ch13_9_comp) {
    gaps.push({
      identity: "13-9::1-5",
      exercise_code: ch13_9_comp.exercise_code,
      normalized_exercise_code: ch13_9_comp.normalized_exercise_code,
      question_number: "1-5",
      chapter: 13,
      classification: "QUESTION_PRESENT_UNDER_DIFFERENT_STRUCTURE",
      reason: "Composite question '1-5' in chapter file corresponds to individual answers 1 through 5 in answer_key.json.",
    });
  }

  const censusOutput = {
    timestamp: new Date().toISOString(),
    authoritative_source_scope: "bookdata/json/ (31 files: 27 chapters, 2 glossaries, 1 verb table, 1 answer key)",
    totals,
    backmatter_summary: {
      "English-Frenchglossary.json": {
        entries: JSON.parse(fs.readFileSync(path.join(bookdataDir, "English-Frenchglossary.json"), "utf-8")).entries?.length || 0,
      },
      "French-Englishglossary.json": {
        entries: JSON.parse(fs.readFileSync(path.join(bookdataDir, "French-Englishglossary.json"), "utf-8")).entries?.length || 0,
      },
      "verb_table.json": {
        verbs: JSON.parse(fs.readFileSync(path.join(bookdataDir, "verb_table.json"), "utf-8")).verbs?.length || 0,
      },
      "answer_key.json": {
        exercises: akData.exercises?.length || 0,
        total_answers: akAnswers.size,
      },
    },
    per_chapter: perChapter,
  };

  const gapSummary = {
    timestamp: new Date().toISOString(),
    explanation: "Reconciliation of the 186 vs 197 exercises and 1755 vs 1872 questions between bookdata chapters and bookdata/json/answer_key.json.",
    summary: {
      chapter_exercises: totals.exercises, // 186
      answer_key_exercises: akData.exercises?.length || 0, // 197
      exercise_discrepancy: (akData.exercises?.length || 0) - totals.exercises, // 11
      chapter_questions: totals.questions, // 1755
      answer_key_answers: akAnswers.size, // 1872
      question_discrepancy: akAnswers.size - totals.questions, // 117
      discrepancy_breakdown: {
        "9-5": {
          type: "MALFORMED_SOURCE_RECORD",
          affected_records: 5,
          notes: "Question numbers stored as '1. Elle recevra' etc. Question and answer present.",
        },
        "9-7": {
          type: "SOURCE_EXTRACTION_MISSING",
          missing_questions: 5,
          notes: "Questions 6-10 on PDF page 93 omitted from 9.json",
        },
        "13-9": {
          type: "QUESTION_PRESENT_UNDER_DIFFERENT_STRUCTURE",
          difference: 4,
          notes: "5-item matching exercise grouped as single object '1-5' in 13.json vs 5 distinct answers in answer key",
        },
        "21-1": {
          type: "SOURCE_EXTRACTION_MISSING",
          missing_questions: 8,
          notes: "Questions 3-10 on PDF pages 183-184 omitted from 21.json (which only had Q1-Q2)",
        },
        "21-2_to_21-12": {
          type: "SOURCE_EXTRACTION_MISSING",
          missing_exercises: 11,
          missing_questions: 100,
          notes: "Exercises 21-2 through 21-12 on PDF pages 184-196 completely omitted from 21.json",
        },
      },
      gap_count_by_classification: gaps.reduce((acc, g) => {
        acc[g.classification] = (acc[g.classification] || 0) + 1;
        return acc;
      }, {} as Record<string, number>),
    },
    gaps,
  };

  const censusPath = path.join(root, "data/reconciliation/authoritative-source-census.json");
  const gapPath = path.join(root, "data/reconciliation/authoritative-question-gap.json");

  fs.writeFileSync(censusPath, JSON.stringify(censusOutput, null, 2), "utf-8");
  fs.writeFileSync(gapPath, JSON.stringify(gapSummary, null, 2), "utf-8");
  console.log(`Generated ${censusPath} and ${gapPath}`);
}

if (require.main === module) {
  generateAuthoritativeCensus();
}
