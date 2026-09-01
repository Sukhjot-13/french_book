import fs from "fs";
import path from "path";
import { Example } from "../../src/lib/dataset/schemas";
import { makeExampleId, makeVerbId, makeExpressionId, makeRuleId, makeVocabId, slugify } from "../../src/lib/dataset/ids";
import { RawPage } from "../extract-pages";

export interface RawExampleSpec {
  french: string;
  english: string;
  chapter_number: number;
  section_order?: number;
  page_printed: number;
  page_pdf?: number;
  tense_id?: string;
  rule_id?: string;
  verb_ids?: string[];
  expression_ids?: string[];
  vocabulary_ids?: string[];
}

export const CHAPTER_TENSES_MAP: Record<number, string> = {
  1: "tense_present_indicative",
  2: "tense_present_indicative",
  3: "tense_present_indicative",
  4: "tense_present_indicative",
  5: "tense_present_indicative",
  6: "tense_present_indicative",
  7: "tense_passe_compose",
  8: "tense_imparfait",
  9: "tense_futur_simple",
  10: "tense_plus_que_parfait",
  11: "tense_conditionnel_present",
  12: "tense_conditionnel_present",
  13: "tense_subjonctif_present",
  14: "tense_infinitif_present",
  15: "tense_participe_present",
  16: "tense_passe_simple",
  17: "tense_present_indicative",
  18: "tense_present_indicative",
  19: "tense_imperatif",
  20: "tense_present_indicative",
  21: "tense_present_indicative",
  22: "tense_present_indicative",
  23: "tense_present_indicative",
  24: "tense_present_indicative",
  25: "tense_present_indicative",
  26: "tense_present_indicative",
  27: "tense_present_indicative",
};

export function getChapterFromPage(pg: number): number {
  const bounds = [
    [1, 12, 1],
    [13, 23, 2],
    [24, 33, 3],
    [34, 42, 4],
    [43, 48, 5],
    [49, 54, 6],
    [55, 64, 7],
    [65, 71, 8],
    [72, 80, 9],
    [81, 86, 10],
    [87, 93, 11],
    [94, 103, 12],
    [104, 114, 13],
    [115, 125, 14],
    [126, 130, 15],
    [131, 136, 16],
    [137, 146, 17],
    [147, 156, 18],
    [157, 167, 19],
    [168, 178, 20],
    [179, 189, 21],
    [190, 200, 22],
    [201, 210, 23],
    [211, 220, 24],
    [221, 226, 25],
    [227, 231, 26],
    [232, 235, 27],
  ];
  for (const [start, end, ch] of bounds) {
    if (pg >= start && pg <= end) return ch;
  }
  return 1;
}

const ENGLISH_STARTERS = [
  "the ", "a ", "an ", "in ", "when ", "there ", "you ", "it ", "if ", "as ", "to ", "here ",
  "these ", "this ", "they ", "we ", "he ", "she ", "let’s ", "lets ", "note ", "for ",
  "remember ", "see ", "although ", "however ", "depending ", "below ", "some ", "all ",
  "verbs ", "nouns ", "adjectives ", "french ", "english ", "most ", "many ", "both ",
  "either ", "neither ", "since ", "while ", "whereas ", "because ", "such ", "just ",
  "use ", "notice ", "chapter ", "exercise ", "section ", "table "
];

const FRENCH_COMMON_WORDS = new Set([
  "le", "la", "les", "un", "une", "des", "du", "de", "d’", "d'", "j’", "j'", "je", "tu", "il", "elle",
  "on", "nous", "vous", "ils", "elles", "c’", "c'", "ce", "cet", "cette", "ces", "qui", "que", "qu’", "qu'",
  "dont", "où", "ne", "n’", "n'", "pas", "plus", "jamais", "rien", "aucun", "tout", "tous", "toute", "toutes",
  "au", "aux", "est", "sont", "suis", "es", "sommes", "êtes", "ai", "as", "a", "avons", "avez", "ont",
  "va", "vais", "vas", "allons", "allez", "vont", "fait", "fais", "faisons", "faites", "font", "très",
  "bien", "avec", "sans", "pour", "par", "dans", "sur", "sous", "chez", "ici", "là", "mon", "ma", "mes",
  "ton", "ta", "tes", "son", "sa", "ses", "notre", "nos", "votre", "vos", "leur", "leurs"
]);

function isEnglishSentence(s: string): boolean {
  const sLow = s.toLowerCase().trim();
  for (const st of ENGLISH_STARTERS) {
    if (sLow.startsWith(st)) return true;
  }
  return false;
}

function hasFrenchMarkers(s: string): boolean {
  if (/[éèêëàâäçîïôöùûüÿœæÉÈÊÀÂÇÎÔÙ]/.test(s)) return true;
  const words = s.toLowerCase().match(/[a-zA-ZÀ-ÿ’']+/g) || [];
  let frMatchCount = 0;
  for (const w of words) {
    if (FRENCH_COMMON_WORDS.has(w)) frMatchCount++;
  }
  return frMatchCount >= 1;
}

export function scanChapterPagesForExamples(pages: RawPage[]): RawExampleSpec[] {
  const specs: RawExampleSpec[] = [];
  const chPages = pages.filter((p) => (p.printed_page || 0) >= 1 && (p.printed_page || 0) <= 235);

  for (const p of chPages) {
    const pg = p.printed_page || 1;
    const ch = getChapterFromPage(pg);
    const lines = p.text.split("\n");

    let i = 0;
    while (i < lines.length) {
      const line = lines[i].trim();
      if (!line || line.length < 5) {
        i++;
        continue;
      }

      if (
        /^\d+$/.test(line) ||
        /Complete French Grammar/i.test(line) ||
        /^[A-Z\s]{4,}$/.test(line) ||
        /^EXERCICE/i.test(line) ||
        /^\d+[-·]\d+/.test(line) ||
        /^VOCABULAIRE\b/i.test(line)
      ) {
        i++;
        continue;
      }

      // Pattern 1: Single line French sentence followed by English translation
      const m1 = line.match(/^([A-ZÀ-Ÿ][a-zA-ZÀ-ÿ\s’'\-\,\;\:\(\)]+[\.\?\!])\s+([A-Z][a-zA-Z\s’'\-\,\;\:\(\)]+[\.\?\!]?)$/);
      if (m1) {
        const fr = m1[1].trim();
        const en = m1[2].trim();
        if (!isEnglishSentence(fr) && hasFrenchMarkers(fr) && fr.split(/\s+/).length >= 2 && en.split(/\s+/).length >= 2) {
          specs.push({
            french: fr,
            english: en,
            chapter_number: ch,
            page_printed: pg,
            page_pdf: p.pdf_page,
            tense_id: CHAPTER_TENSES_MAP[ch] || "tense_present_indicative",
          });
          i++;
          continue;
        }
      }

      // Pattern 2: Two-line pair: Line 1 French sentence, Line 2 English sentence
      if (i + 1 < lines.length) {
        const nextLine = lines[i + 1].trim();
        if (
          /^[A-ZÀ-Ÿ][a-zA-ZÀ-ÿ\s’'\-\,\;\:\(\)]+[\.\?\!]$/.test(line) &&
          /^[A-Z][a-zA-Z\s’'\-\,\;\:\(\)]+[\.\?\!]?$/.test(nextLine)
        ) {
          const frWords = line.split(/\s+/);
          const enWords = nextLine.split(/\s+/);

          if (!isEnglishSentence(line) && hasFrenchMarkers(line) && frWords.length >= 2 && enWords.length >= 2) {
            specs.push({
              french: line,
              english: nextLine,
              chapter_number: ch,
              page_printed: pg,
              page_pdf: p.pdf_page,
              tense_id: CHAPTER_TENSES_MAP[ch] || "tense_present_indicative",
            });
            i += 2;
            continue;
          }
        }
      }

      i++;
    }
  }

  return specs;
}

export function buildEnrichedExamples(): Example[] {
  const pagesPath = path.resolve(process.cwd(), "data/raw/pages-all.json");
  const pages: RawPage[] = fs.existsSync(pagesPath) ? JSON.parse(fs.readFileSync(pagesPath, "utf-8")) : [];

  const scanned = scanChapterPagesForExamples(pages);

  // Deduplicate and aggregate multi-page attestations
  const map = new Map<string, { spec: RawExampleSpec; attestations: any[] }>();

  for (const item of scanned) {
    const key = item.french.toLowerCase().replace(/[.,/#!$%^&*;:{}=\-_`~()]/g, "").trim();
    if (!map.has(key)) {
      map.set(key, {
        spec: item,
        attestations: [
          {
            source_type: "book",
            chapter_number: item.chapter_number,
            page_printed: item.page_printed,
            page_pdf: item.page_pdf,
            context_type: "example_sentence",
          },
        ],
      });
    } else {
      const existing = map.get(key)!;
      existing.attestations.push({
        source_type: "book",
        chapter_number: item.chapter_number,
        page_printed: item.page_printed,
        page_pdf: item.page_pdf,
        context_type: "example_sentence",
      });
    }
  }

  const examples: Example[] = [];
  let index = 1;

  for (const { spec, attestations } of map.values()) {
    const chPad = String(spec.chapter_number).padStart(2, "0");
    const exId = makeExampleId(`ch${chPad}`, index++);
    const tenseId = spec.tense_id || CHAPTER_TENSES_MAP[spec.chapter_number] || "tense_present_indicative";

    examples.push({
      id: exId,
      type: "example",
      french: spec.french,
      english: spec.english,
      literal_english: null,
      source_type: "book",
      annotations: {
        focus_spans: [],
      },
      relations: {
        tenses: [tenseId],
        verbs: spec.verb_ids ? spec.verb_ids.map((v) => makeVerbId(v)) : [],
        expressions: spec.expression_ids ? spec.expression_ids.map((e) => makeExpressionId(e)) : [],
        grammar_rules: [],
      },
      cloze_candidates: [],
      study: {
        difficulty: 2,
      },
      attestations,
    });
  }

  return examples;
}
