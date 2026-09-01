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
  const fullText = pages.map((p) => p.text).join("\n");
  const chId = makeChapterId(chapterNum);

  // Pattern matching: "1·1\nEXERCICE\nInstructions..." or "1.1\nEXERCICE" or "EXERCICE 1·1"
  const exRegex = /(?:(\d{1,2})[·\.](\d{1,2}))\s*\n\s*EXERCICE\s*\n([\s\S]*?)(?=(?:\d{1,2}[·\.]\d{1,2}\s*\n\s*EXERCICE)|(?:Chapter\s+\d+)|\n\s*\d{1,2}\s+[A-ZÀ-Ÿ]|$)/gi;
  let match: RegExpExecArray | null;

  while ((match = exRegex.exec(fullText)) !== null) {
    const ch = parseInt(match[1], 10);
    if (ch !== chapterNum) continue;
    const exNumStr = match[2];
    const exerciseNumber = `${ch}.${exNumStr}`;
    const exerciseId = makeExerciseId(ch, exerciseNumber);
    const body = match[3].trim();

    // First line(s) before "1." are instructions
    const lines = body.split("\n");
    let instructionLines: string[] = [];
    let qStartIndex = 0;

    for (let i = 0; i < lines.length; i++) {
      const l = lines[i].trim();
      if (/^\d{1,2}\.\s+/.test(l)) {
        qStartIndex = i;
        break;
      } else {
        instructionLines.push(l);
      }
    }

    const instructionsFrench = instructionLines.join(" ").trim();
    const questionsBlock = lines.slice(qStartIndex).join("\n");

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
          if (vClean.endsWith("er") || vClean.endsWith("ir") || vClean.endsWith("re") || vClean === "aller" || vClean === "avoir" || vClean === "être" || vClean === "faire") {
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
          page_printed: pages[0]?.printed_page || null,
          context_type: "exercise_instruction",
        },
      ],
      tags: [exType],
    });
  }

  return exercises;
}
