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

export function parseGlossaryFrEn(pages: RawPage[]): ParsedGlossaryEntry[] {
  // Printed 240-249 (PDF 254-263)
  const gPages = pages.filter((p) => (p.printed_page || 0) >= 240 && (p.printed_page || 0) <= 249);
  const entries: ParsedGlossaryEntry[] = [];

  for (const page of gPages) {
    const lines = page.text.split("\n");
    for (const rawLine of lines) {
      const line = rawLine.trim();
      if (!line || line.length < 3) continue;
      if (/^[A-Z]$/.test(line)) continue; // Letter header
      if (/^French-English glossary/i.test(line)) continue;
      if (/^\d+$/i.test(line)) continue; // Page number

      // Format e.g. "accès haut-débit (m.) high-speed access"
      // "acide sour, acid"
      // "abonner à (s’) to subscribe to"
      // "acteur, actrice (m./f.) actor, actress"
      let gender: "masculine" | "feminine" | "common" | null = null;
      if (/\(m\.\)/i.test(line)) gender = "masculine";
      else if (/\(f\.\)/i.test(line)) gender = "feminine";
      else if (/\(m\.\/f\.\)/i.test(line) || /\(f\.\/m\.\)/i.test(line)) gender = "common";

      // Split french and english
      // Usually there's a transition from french word to english definition
      // e.g. "à carreaux checked" -> french: "à carreaux", english: ["checked"]
      let fr = "";
      let en = "";

      if (line.includes("(m.)") || line.includes("(f.)") || line.includes("(m./f.)")) {
        const parts = line.split(/\((?:m\.|f\.|m\.\/f\.)\)/);
        fr = parts[0].trim();
        en = parts[1]?.trim() || "";
      } else {
        // Try common words split
        const match = line.match(/^([a-zA-ZÀ-ÿ\s’'-,()]+?)\s+(to\s+[a-z].*|[a-z].*)$/);
        if (match) {
          fr = match[1].trim();
          en = match[2].trim();
        } else {
          fr = line;
          en = "";
        }
      }

      if (fr) {
        const englishList = en ? en.split(/,\s*/).map((s) => s.trim()).filter(Boolean) : [];
        const id = makeVocabId(fr);
        entries.push({
          id,
          french: fr,
          english: englishList.length > 0 ? englishList : [en || fr],
          gender,
          page_printed: page.printed_page || 240,
          page_pdf: page.pdf_page,
        });
      }
    }
  }

  return entries;
}

export function parseGlossaryEnFr(pages: RawPage[]): Array<{ english: string; french: string; page_printed: number }> {
  // Printed 250-259 (PDF 264-273)
  const gPages = pages.filter((p) => (p.printed_page || 0) >= 250 && (p.printed_page || 0) <= 259);
  const entries: Array<{ english: string; french: string; page_printed: number }> = [];

  for (const page of gPages) {
    const lines = page.text.split("\n");
    for (const rawLine of lines) {
      const line = rawLine.trim();
      if (!line || line.length < 3) continue;
      if (/^[A-Z]$/.test(line)) continue;
      if (/^English-French glossary/i.test(line)) continue;
      if (/^\d+$/i.test(line)) continue;

      // e.g. "accept, to accepter"
      // "access, high-speed accès haut-débit (m.)"
      // "actor, actress acteur, actrice (m./f.)"
      const match = line.match(/^([^,]+(?:,\s*[^,]+)*?)\s+([a-zA-ZÀ-ÿ\s’'-]+(?:\s*\([^)]+\))?)$/);
      if (match) {
        entries.push({
          english: match[1].trim(),
          french: match[2].trim(),
          page_printed: page.printed_page || 250,
        });
      }
    }
  }

  return entries;
}

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
        const inf = tokens[0];
        if (inf.endsWith("er") || inf.endsWith("ir") || inf.endsWith("re") || inf === "aller" || inf === "avoir" || inf === "être" || inf === "faire") {
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
  console.log("Parsing all back matter files...");
  const pagesPath = path.resolve(process.cwd(), "data/raw/pages-all.json");
  const pages: RawPage[] = JSON.parse(fs.readFileSync(pagesPath, "utf-8"));

  const outDir = path.resolve(process.cwd(), "data/extracted/backmatter");
  fs.mkdirSync(outDir, { recursive: true });

  const answerKey = parseAnswerKey(pages);
  fs.writeFileSync(path.join(outDir, "answer-key.json"), JSON.stringify(answerKey, null, 2), "utf-8");
  console.log(`Answer key extracted: ${Object.keys(answerKey.chapters).length} chapters found.`);

  const glossaryFrEn = parseGlossaryFrEn(pages);
  fs.writeFileSync(path.join(outDir, "glossary-fr-en.json"), JSON.stringify(glossaryFrEn, null, 2), "utf-8");
  console.log(`French-English glossary extracted: ${glossaryFrEn.length} entries.`);

  const glossaryEnFr = parseGlossaryEnFr(pages);
  fs.writeFileSync(path.join(outDir, "glossary-en-fr.json"), JSON.stringify(glossaryEnFr, null, 2), "utf-8");
  console.log(`English-French glossary extracted: ${glossaryEnFr.length} entries.`);

  const verbTables = parseVerbTables(pages);
  fs.writeFileSync(path.join(outDir, "verb-tables.json"), JSON.stringify(verbTables, null, 2), "utf-8");
  console.log(`Verb tables extracted: ${verbTables.length} tables found.`);
}

if (require.main === module) {
  parseBackmatter().catch((err) => {
    console.error("Backmatter parsing failed:", err);
    process.exit(1);
  });
}

