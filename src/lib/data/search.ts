import { SuperDatasetRoot } from "../dataset/schemas";

/**
 * Normalizes French text by stripping diacritics and converting to lowercase.
 * e.g., "Être" -> "etre", "Connaître" -> "connaitre", "garçon" -> "garcon"
 */
export function normalizeFrenchText(text: string | null | undefined): string {
  if (!text) return "";
  return text
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
}

export type SearchResultType =
  | "verb"
  | "expression"
  | "vocabulary"
  | "grammar_rule"
  | "tense"
  | "chapter"
  | "example";

export interface SearchResultItem {
  id: string;
  type: SearchResultType;
  title: string;
  subtitle?: string;
  snippet?: string;
  url: string;
  badge?: string;
  priority?: number;
  score: number;
}

/**
 * Performs fast accent-insensitive search across all 7 dataset collections.
 */
export function searchDataset(
  dataset: SuperDatasetRoot,
  rawQuery: string,
  limit: number = 25
): SearchResultItem[] {
  const query = normalizeFrenchText(rawQuery);
  if (!query || query.length < 1) {
    return [];
  }

  const results: SearchResultItem[] = [];

  // 1. VERBS
  for (const verb of dataset.verbs || []) {
    const lemma = (verb as any).infinitive || (verb as any).lemma || "";
    const enArr = Array.isArray(verb.english) ? verb.english : [(verb as any).english_translation || ""];
    const enStr = enArr.join(", ");
    const normLemma = normalizeFrenchText(lemma);
    const normTrans = normalizeFrenchText(enStr);

    let score = 0;
    if (normLemma === query) score = 100;
    else if (normLemma.startsWith(query)) score = 80;
    else if (normLemma.includes(query)) score = 60;
    else if (normTrans.includes(query)) score = 40;

    if (score > 0) {
      results.push({
        id: verb.id,
        type: "verb",
        title: lemma,
        subtitle: enStr || verb.verb_group || "Verb",
        url: `/verbs/${encodeURIComponent(verb.id)}`,
        badge: verb.verb_group || "verb",
        priority: verb.study?.learning_priority,
        score,
      });
    }
  }

  // 2. EXPRESSIONS
  for (const exp of dataset.expressions || []) {
    const fr = (exp as any).canonical_form || (exp as any).french || "";
    const enArr = Array.isArray(exp.english) ? exp.english : [(exp as any).english || ""];
    const enStr = enArr.join("; ");
    const normFr = normalizeFrenchText(fr);
    const normEn = normalizeFrenchText(enStr);

    let score = 0;
    if (normFr === query) score = 95;
    else if (normFr.startsWith(query)) score = 75;
    else if (normFr.includes(query)) score = 55;
    else if (normEn.includes(query)) score = 35;

    if (score > 0) {
      results.push({
        id: exp.id,
        type: "expression",
        title: fr,
        subtitle: enStr,
        snippet: exp.expression_type || "Expression",
        url: `/expressions/${encodeURIComponent(exp.id)}`,
        badge: exp.expression_type || "expression",
        priority: exp.study?.learning_priority,
        score,
      });
    }
  }

  // 3. VOCABULARY
  for (const item of dataset.vocabulary || []) {
    const fr = (item as any).canonical_form || (item as any).french || "";
    const enArr = Array.isArray(item.english) ? item.english : [(item as any).english || ""];
    const enStr = enArr.join(", ");
    const normFr = normalizeFrenchText(fr);
    const normEn = normalizeFrenchText(enStr);

    let score = 0;
    if (normFr === query) score = 90;
    else if (normFr.startsWith(query)) score = 70;
    else if (normFr.includes(query)) score = 50;
    else if (normEn.includes(query)) score = 30;

    if (score > 0) {
      results.push({
        id: item.id,
        type: "vocabulary",
        title: fr,
        subtitle: enStr,
        snippet: item.part_of_speech,
        url: `/vocabulary?query=${encodeURIComponent(fr)}`,
        badge: item.part_of_speech || "vocab",
        priority: item.study?.learning_priority,
        score,
      });
    }
  }

  // 4. GRAMMAR RULES
  for (const rule of dataset.grammar_rules || []) {
    const title = rule.title || "";
    const normTitle = normalizeFrenchText(title);
    const normExpl = normalizeFrenchText(rule.explanation || rule.summary || "");

    let score = 0;
    if (normTitle.includes(query)) score = 65;
    else if (normExpl.includes(query)) score = 25;

    if (score > 0) {
      results.push({
        id: rule.id,
        type: "grammar_rule",
        title: title,
        snippet: rule.summary || rule.explanation?.slice(0, 100),
        url: `/grammar/${encodeURIComponent(rule.id)}`,
        badge: rule.grammar_category || "grammar",
        priority: rule.study?.learning_priority,
        score,
      });
    }
  }

  // 5. TENSES
  for (const tense of dataset.tenses || []) {
    const fr = tense.name_french || "";
    const en = tense.name_english || "";
    const normFr = normalizeFrenchText(fr);
    const normEn = normalizeFrenchText(en);

    let score = 0;
    if (normFr === query || normEn === query) score = 90;
    else if (normFr.includes(query) || normEn.includes(query)) score = 60;

    if (score > 0) {
      results.push({
        id: tense.id,
        type: "tense",
        title: `${fr} (${en})`,
        subtitle: tense.mood || "Tense",
        url: `/tenses/${encodeURIComponent(tense.id)}`,
        badge: tense.mood || "tense",
        score,
      });
    }
  }

  // 6. CHAPTERS
  for (const ch of dataset.chapters || []) {
    const title = ch.title || "";
    const normTitle = normalizeFrenchText(title);
    const num = String(ch.chapter_number);

    let score = 0;
    if (query === `chapter ${num}` || query === `ch ${num}` || query === num) {
      score = 85;
    } else if (normTitle.includes(query)) {
      score = 55;
    }

    if (score > 0) {
      results.push({
        id: ch.id,
        type: "chapter",
        title: `Chapter ${ch.chapter_number}: ${title}`,
        url: `/chapters/${encodeURIComponent(ch.id)}`,
        badge: `ch ${ch.chapter_number}`,
        score,
      });
    }
  }

  // 7. EXAMPLES
  for (const ex of dataset.examples || []) {
    const normFr = normalizeFrenchText(ex.french);
    const normEn = normalizeFrenchText(ex.english);

    let score = 0;
    if (normFr.includes(query)) score = 45;
    else if (normEn.includes(query)) score = 20;

    if (score > 0) {
      results.push({
        id: ex.id,
        type: "example",
        title: ex.french,
        subtitle: ex.english,
        url: `/examples?query=${encodeURIComponent(rawQuery)}`,
        badge: "example",
        score,
      });
    }
  }

  return results
    .sort((a, b) => b.score - a.score || a.title.length - b.title.length)
    .slice(0, limit);
}
