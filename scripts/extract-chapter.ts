import fs from "fs";
import path from "path";
import { RawPage } from "./extract-pages";
import {
  Chapter,
  Section,
  GrammarRule,
  Verb,
  Conjugation,
  Vocabulary,
  Expression,
  Example,
  Exercise,
  ExerciseQuestion,
} from "../src/lib/dataset/schemas";
import {
  makeChapterId,
  makeSectionId,
  makeRuleId,
  makeVerbId,
  makeConjugationId,
  makeVocabId,
  makeExpressionId,
  makeExampleId,
  makeExerciseId,
  makeQuestionId,
} from "../src/lib/dataset/ids";

export interface ExtractedChapterData {
  chapter: Chapter;
  sections: Section[];
  grammar_rules: GrammarRule[];
  verbs: Verb[];
  conjugations: Conjugation[];
  vocabulary: Vocabulary[];
  expressions: Expression[];
  examples: Example[];
  exercises: Exercise[];
}

export function extractChapterExercises(
  chapterNum: number,
  pages: RawPage[]
): Exercise[] {
  const exercises: Exercise[] = [];
  const chId = makeChapterId(chapterNum);
  const answerKeyPath = path.resolve(__dirname, "..", "data", "extracted", "backmatter", "answer-key.json");
  const answerKey = fs.existsSync(answerKeyPath) ? JSON.parse(fs.readFileSync(answerKeyPath, "utf-8")) : { chapters: {} };
  const expectedQuestionCount = (exerciseNumber: string) => {
    const entries = answerKey.chapters?.[String(chapterNum)]?.[exerciseNumber] || [];
    return Array.isArray(entries) ? entries.reduce((max: number, entry: any) => Math.max(max, Number(entry.question_number) || 0), 0) : 0;
  };
  // Keep the page with every source line.  Concatenating pages before finding the
  // next exercise used to make the final question consume the following lesson.
  const lines = pages.flatMap((page) => page.text.split("\n").map((text) => ({ text: text.trim(), page })));
  const exerciseHeader = /^(\d{1,2})[·\.](\d{1,2})$/;
  const starts: Array<{ index: number; chapter: number; exercise: string }> = [];
  for (let index = 0; index + 1 < lines.length; index++) {
    const match = lines[index].text.match(exerciseHeader);
    if (match && /^EXERCICE$/i.test(lines[index + 1].text)) {
      starts.push({ index, chapter: Number(match[1]), exercise: match[2] });
    }
  }

  // Running heads are emitted as ordinary text by the PDF extractor.  They are
  // not lesson boundaries: on a continued exercise they occur before the next
  // numbered question.  Treat the whole line as page chrome before applying any
  // lesson-transition heuristic.
  const isRunningPageHeading = (line: string) =>
    /^(?:(?:practice makes perfect\s+complete french grammar\s*)?\d+|(?:answer key|verb tables|french-english glossary|english-french glossary|[\p{L}][\p{L}\s,'’\-]+)\s+\d+)$/iu.test(line.trim());
  const isPageChrome = (line: string) =>
    !line || /^\d+$/.test(line) || isRunningPageHeading(line) || /^(?:practice makes perfect|copyright ©|more .+ \d+)/i.test(line);
  const withoutPageChrome = (line: string) => line
    .replace(/\u0001/g, "")
    .replace(/\s+(?:\d+\s+)?practice makes perfect complete french grammar\b/gi, "")
    .replace(/^(?:answer key|verb tables|french-english glossary|english-french glossary|[\p{L}][\p{L}\s,'’\-]+)\s+\d+$/iu, "")
    .replace(/\s*·?\d+·?\s*copyright ©.*$/i, "")
    .trim();
  const isLessonHeading = (line: string) => {
    if (isPageChrome(line) || /^\d{1,2}\./.test(line) || /[.!;:]$/.test(line)) return false;
    // Source headings are short title fragments.  Restricting the shape prevents
    // wrapped exercise sentences from being mistaken for a boundary.
    return line.length <= 110 && /^[A-ZÀ-Ÿ]/.test(line) && /^(?:The|More|One|When|A |An |Regular|Irregular|Verbs|Adjectives|Nouns|Pronouns|Articles|Prepositions|Conjunctions|Tenir|Faire|Avoir|Être|Aller|Venir|Partir|Sortir|Savoir|Vouloir|Pouvoir|Devoir|Quoi|Quel|Qui|Avoir beau|Quitte)/.test(line);
  };
  const isInstructionalTransition = (line: string) =>
    /^(?:[A-ZÀ-Ÿ]{3,}$|The\b|More\b|One\b|When\b|Let[’']s\b|Another\b|You\b|As\b|Sometimes\b|Use\b|Beware\b|Uses\b|Should\b|Pourvu\b|Learning\b|Geographical\b|How\b|Indirect\b|Disjunctive\b|Possessive\b|Que\b|Using\b|Interrogative\b|Adverbs\b|Ordinal\b|Add\b|Whatever\b|Chapter\b|Il y a\b|Il s['’]agit\b|Remember\b|Comparatives\b|Comparison\b)/.test(line);

  for (let startOrdinal = 0; startOrdinal < starts.length; startOrdinal++) {
    const start = starts[startOrdinal];
    if (start.chapter !== chapterNum) continue;
    const ch = start.chapter;
    const exNumStr = start.exercise;
    const exerciseNumber = `${ch}.${exNumStr}`;
    const exerciseId = makeExerciseId(ch, exerciseNumber);
    const nextHeader = starts[startOrdinal + 1]?.index ?? lines.length;
    const expectedLastQuestion = expectedQuestionCount(exerciseNumber);
    const bodyLines: Array<{ text: string; page: RawPage }> = [];
    let sawQuestion = false;
    let currentQuestion = 0;
    for (let index = start.index + 2; index < nextHeader; index++) {
      const source = lines[index];
      // A non-numbered lesson title following an exercise is an authoritative
      // structural boundary, even when the next exercise appears pages later.
      if (isPageChrome(source.text)) continue;
      if (sawQuestion && isLessonHeading(source.text)) break;
      const questionMatch = source.text.match(/^(\d{1,2})\.\s+/);
      if (questionMatch) {
        sawQuestion = true;
        currentQuestion = Number(questionMatch[1]);
      } else if (
        // The answer key supplies the structural item count.  Once its final numbered
        // item is reached, a new capitalized prose line is a lesson transition, not a
        // continuation of the question.  Lowercase/wrapped continuations are retained.
        sawQuestion && currentQuestion >= (expectedLastQuestion || 10) &&
        isInstructionalTransition(source.text)
      ) break;
      const text = withoutPageChrome(source.text);
      if (!isPageChrome(text)) bodyLines.push({ ...source, text });
    }

    let instructionLines: string[] = [];
    let qStartIndex = 0;

    for (let i = 0; i < bodyLines.length; i++) {
      const l = bodyLines[i].text;
      if (/^\d{1,2}\.\s+/.test(l)) {
        qStartIndex = i;
        break;
      } else {
        instructionLines.push(l);
      }
    }

    const instructionsFrench = instructionLines.join(" ").trim();
    const questionsBlock = bodyLines.slice(qStartIndex).map((line) => line.text).join("\n");

    const questions: ExerciseQuestion[] = [];
    const qRegex = /(\d{1,2})\.\s+([\s\S]*?)(?=(?:\n\s*\d{1,2}\.\s+)|$)/g;
    let qMatch: RegExpExecArray | null;

    while ((qMatch = qRegex.exec(questionsBlock)) !== null) {
      const qIdx = parseInt(qMatch[1], 10);
      const prompt = qMatch[2].replace(/\n/g, " ").replace(/\s+/g, " ").trim();
      const questionId = makeQuestionId(exerciseId, qIdx);

      // Infer relations from prompt (e.g. verbs in parentheses like "(travailler)")
      const verbMatches = prompt.match(/\((?:[a-zA-ZÀ-ÿ\s’'-]+)\)/g);
      const linkedVerbs: string[] = [];
      if (verbMatches) {
        for (const vm of verbMatches) {
          const vClean = vm.replace(/[()]/g, "").trim().toLowerCase();
          if (/^(?:(?:se|s['’])\s*)?[a-zà-ÿ'’-]+$/i.test(vClean) && (vClean.endsWith("er") || vClean.endsWith("ir") || vClean.endsWith("re") || vClean === "aller" || vClean === "avoir" || vClean === "être" || vClean === "faire")) {
            linkedVerbs.push(makeVerbId(vClean));
          }
        }
      }

      questions.push({
        question_id: questionId,
        prompt,
        answer: null,
        answer_explanation: null,
        open_ended: false,
        relations: {
          verbs: linkedVerbs,
        },
      });
    }

    // Determine exercise type from instructions
    let exType: any = "fill_in_conjugation";
    const instrLower = instructionsFrench.toLowerCase();
    if (instrLower.includes("traduire") || instrLower.includes("translate")) {
      exType = instrLower.includes("anglais") ? "translation_fr_to_en" : "translation_en_to_fr";
    } else if (instrLower.includes("correspondre") || instrLower.includes("colonne")) {
      exType = "matching";
    } else if (instrLower.includes("négatif") || instrLower.includes("négation")) {
      exType = "negative_transformation";
    } else if (instrLower.includes("interrogat") || instrLower.includes("question") || instrLower.includes("inversion")) {
      exType = "interrogative_transformation";
    } else if (instrLower.includes("reformuler") || instrLower.includes("réécrire") || instrLower.includes("rewrite")) {
      exType = "rewrite";
    } else if (instrLower.includes("choisir") || instrLower.includes("choisissez")) {
      exType = "choose_correct_form";
    } else if (instrLower.includes("compléter") || instrLower.includes("remplir")) {
      exType = "completion";
    }

    exercises.push({
      id: exerciseId,
      type: "exercise",
      chapter_id: chId,
      section_id: null,
      exercise_number: exerciseNumber,
      exercise_type: exType,
      instructions_french: instructionsFrench,
      instructions_english: null,
      questions,
      answer_key_source: {
        page_printed: null,
      },
      study: { difficulty: 2 },
      attestations: [
        {
          source_type: "book",
          chapter_number: chapterNum,
          chapter_id: chId,
          page_printed: lines[start.index].page.printed_page || null,
          page_pdf: lines[start.index].page.pdf_page,
          context_type: "exercise_instruction",
        },
      ],
      tags: [exType],
    });
  }

  return exercises;
}
