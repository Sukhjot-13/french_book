import fs from "fs";
import path from "path";
import { RawPage } from "./extract-pages";
import { makeVerbId, makeTenseId, makeConjugationId, makeVocabId, slugify } from "../src/lib/dataset/ids";
import { cleanPdfText } from "../src/lib/dataset/normalize";

export interface ParsedAnswerKey {
  chapters: Record<
    number,
    Record<
      string, // e.g. "1.1" or "1-1"
      Array<{
        question_number: number;
        answer_text: string;
      }>
    >
  >;
}

export interface ParsedGlossaryEntry {
  id: string;
  french: string;
  english: string[];
  gender?: "masculine" | "feminine" | "common" | null;
  part_of_speech?: string;
  page_printed: number;
  page_pdf: number;
}

export interface ParsedVerbTableForm {
  verb_infinitive: string;
  verb_id: string;
  tense_name: string;
  tense_id: string;
  forms: Record<string, string>;
  page_printed: number;
}

export function parseAnswerKey(pages: RawPage[]): ParsedAnswerKey {
  // Answer key spans printed pages 260-272 (PDF 274-286)
  const akPages = pages.filter((p) => (p.printed_page || 0) >= 260 && (p.printed_page || 0) <= 272);
  const fullText = akPages.map((p) => p.text).join("\n");

  const result: ParsedAnswerKey = { chapters: {} };

  // Split by chapter markers like "1 The present tense of regular -er verbs", "2 The present tense...", or "14 The infinitive mood"
  // Note: in answer key, chapter headers appear like "\n1 The present tense..." or "\n14 The infinitive..."
  const lines = fullText.split("\n");
  let currentChapter = 0;
  let currentExerciseNum = "";

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;

    // Check for chapter header e.g. "1 The present tense of regular -er verbs" or "10 The plus-que-parfait"
    const chMatch = line.match(/^(\d{1,2})\s+([A-ZÀ-Ÿ][a-zA-ZÀ-ÿ\s\-',()·:]+)$/);
    if (chMatch && parseInt(chMatch[1], 10) >= 1 && parseInt(chMatch[1], 10) <= 27) {
      currentChapter = parseInt(chMatch[1], 10);
      if (!result.chapters[currentChapter]) {
        result.chapters[currentChapter] = {};
      }
      continue;
    }
  }

  // More granular regex matching across entire text
  // Pattern: "(\d{1,2})[-·](\d{1,2})" e.g. "1-1", "1·1", "2-10"
  // Followed by "1. ... 2. ... 3. ..."
  const exRegex = /(?:^|\n)\s*(\d{1,2})[-·](\d{1,2})\s+([\s\S]*?)(?=(?:\n\s*\d{1,2}[-·]\d{1,2}\s+)|\n\s*\d{1,2}\s+[A-ZÀ-Ÿ]|$)/g;
  let match: RegExpExecArray | null;

  while ((match = exRegex.exec(fullText)) !== null) {
    const chNum = parseInt(match[1], 10);
    const exNum = `${match[1]}.${match[2]}`;
    const answersBlock = match[3];

    if (!result.chapters[chNum]) {
      result.chapters[chNum] = {};
    }

    const questionAnswers: Array<{ question_number: number; answer_text: string }> = [];

    // Parse items like "1. answer 2. answer" or "1. h 2. e"
    // Handle answers with parentheses or multiple words
    const qRegex = /(\d{1,2})\.\s+([^0-9\n]+(?:\s+[^0-9\n]+)*?)(?=(?:\s+\d{1,2}\.\s+)|$)/g;
    let qMatch: RegExpExecArray | null;
    while ((qMatch = qRegex.exec(answersBlock.replace(/\n/g, " "))) !== null) {
      const qNum = parseInt(qMatch[1], 10);
      const ans = qMatch[2].trim();
      questionAnswers.push({ question_number: qNum, answer_text: ans });
    }

    // Fallback if standard qRegex didn't catch (e.g. list of words like "1. suis 2. es 3. est")
    if (questionAnswers.length === 0) {
      const simpleTokens = answersBlock.split(/\s+(\d{1,2})\.\s+/);
      for (let k = 1; k < simpleTokens.length; k += 2) {
        const qNum = parseInt(simpleTokens[k], 10);
        const ans = simpleTokens[k + 1]?.trim() || "";
        questionAnswers.push({ question_number: qNum, answer_text: ans });
      }
    }

    result.chapters[chNum][exNum] = questionAnswers;
  }

  return result;
}

import { parseGlossaryFrEnEnhanced, parseGlossaryEnFrEnhanced } from "./enrichment/parse-glossary-enhanced";
import { buildEnrichedConjugations } from "./enrichment/parse-conjugations-enhanced";

export const parseGlossaryFrEn = parseGlossaryFrEnEnhanced;
export const parseGlossaryEnFr = parseGlossaryEnFrEnhanced;

export function parseVerbTables(pages: RawPage[]): ParsedVerbTableForm[] {
  // Printed 236-239 (PDF 250-253)
  const vtPages = pages.filter((p) => (p.printed_page || 0) >= 236 && (p.printed_page || 0) <= 239);
  const tables: ParsedVerbTableForm[] = [];

  // Key regular & irregular verbs listed in back matter:
  // regarder, vendre, partir, finir, aller, avoir, être, faire, devoir, pouvoir, vouloir, savoir, venir, prendre, mettre, voir, etc.
  // We parse individual tense rows: present, imparfait, futur, conditionnel, passe_simple, subjonctif
  const tensesMap: Record<string, string> = {
    "PRESENT INDICATIVE": "tense_present_indicative",
    "IMPERFECT": "tense_imparfait",
    "FUTURE": "tense_futur_simple",
    "PRESENT CONDITIONAL": "tense_conditionnel_present",
    "PASSÉ SIMPLE": "tense_passe_simple",
    "PRESENT SUBJUNCTIVE": "tense_subjonctif_present",
    "IMPERATIVE": "tense_imperatif",
  };

  for (const page of vtPages) {
    const lines = page.text.split("\n");
    let currentTense = "tense_present_indicative";

    for (const rawLine of lines) {
      const line = rawLine.trim();
      if (!line) continue;

      for (const [tName, tId] of Object.entries(tensesMap)) {
        if (line.toUpperCase().includes(tName)) {
          currentTense = tId;
        }
      }

      // Check if line contains verb row: e.g. "regarder regarde regardes regarde regardons regardez regardent"
      const tokens = line.split(/\s+/);
      if (tokens.length >= 7) {
        let inf = tokens[0].replace(/^\(s’\)|^\(se\)/, "").trim();
        if (inf.startsWith("(") && inf.endsWith(")")) inf = inf.slice(1, -1);
        const isExcluded = /^(?:There|Other|Here|Indicative|Verbs|Subjunctive|Compound|Copyright|Simple|Verb|Note|French)/i.test(inf);
        if (!isExcluded && (inf.endsWith("er") || inf.endsWith("ir") || inf.endsWith("re") || inf === "aller" || inf === "avoir" || inf === "être" || inf === "faire" || inf === "asseoir")) {
          const verbId = makeVerbId(inf);
          const forms: Record<string, string> = {
            je: tokens[1],
            tu: tokens[2],
            il_elle_on: tokens[3],
            nous: tokens[4],
            vous: tokens[5],
            ils_elles: tokens[6],
          };

          tables.push({
            verb_infinitive: inf,
            verb_id: verbId,
            tense_name: currentTense,
            tense_id: currentTense,
            forms,
            page_printed: page.printed_page || 236,
          });
        }
      }
    }
  }

  return tables;
}

export async function parseBackmatter() {
  console.log("Parsing all back matter files with enhanced parsers...");
  const pagesPath = path.resolve(process.cwd(), "data/raw/pages-all.json");
  const pages: RawPage[] = JSON.parse(fs.readFileSync(pagesPath, "utf-8"));

  const outDir = path.resolve(process.cwd(), "data/extracted/backmatter");
  fs.mkdirSync(outDir, { recursive: true });

  const answerKey = parseAnswerKey(pages);
  fs.writeFileSync(path.join(outDir, "answer-key.json"), JSON.stringify(answerKey, null, 2), "utf-8");
  console.log(`Answer key extracted: ${Object.keys(answerKey.chapters).length} chapters found.`);

  const glossaryFrEn = parseGlossaryFrEnEnhanced(pages);
  fs.writeFileSync(path.join(outDir, "glossary-fr-en.json"), JSON.stringify(glossaryFrEn, null, 2), "utf-8");
  console.log(`French-English glossary extracted: ${glossaryFrEn.length} entries.`);

  const glossaryEnFr = parseGlossaryEnFr(pages);
  fs.writeFileSync(path.join(outDir, "glossary-en-fr.json"), JSON.stringify(glossaryEnFr, null, 2), "utf-8");
  console.log(`English-French glossary extracted: ${glossaryEnFr.length} entries.`);

  const enrichedConjs = buildEnrichedConjugations();
  const verbTables = parseVerbTables(pages);
  fs.writeFileSync(path.join(outDir, "verb-tables.json"), JSON.stringify(verbTables, null, 2), "utf-8");
  fs.writeFileSync(path.join(outDir, "enriched-conjugations.json"), JSON.stringify(enrichedConjs, null, 2), "utf-8");
  console.log(`Verb tables extracted: ${verbTables.length} tables found, ${enrichedConjs.conjugations.length} enriched conjugations generated.`);
}

if (require.main === module) {
  parseBackmatter().catch((err) => {
    console.error("Backmatter parsing failed:", err);
    process.exit(1);
  });
}

