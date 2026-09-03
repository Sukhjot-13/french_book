import { MasterDataset } from "../dataset/masterSchema";
import { makeVerbId, makeTenseId, makeRuleId, makeExpressionId, makeChapterId, slugify } from "../dataset/ids";

/**
 * Normalizes French text by stripping diacritics and converting to lowercase.
 * e.g., "Être" -> "etre", "Connaître" -> "connaitre", "garçon" -> "garcon"
 */
export function normalizeFrenchText(text: unknown): string {
  if (typeof text !== "string") return "";
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
  | "example"
  | "exercise"
  | "trap"
  | "concept";

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
 * Performs fast accent-insensitive search across master dataset collections.
 */
export function searchDataset(
  dataset: MasterDataset,
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
    const lemma = verb.infinitive || "";
    const enStr = verb.english || "";
    const normLemma = normalizeFrenchText(lemma);
    const normTrans = normalizeFrenchText(enStr);

    let score = 0;
    if (normLemma === query) score = 100;
    else if (normLemma.startsWith(query)) score = 80;
    else if (normLemma.includes(query)) score = 60;
    else if (normTrans.includes(query)) score = 40;

    if (score > 0) {
      results.push({
        id: makeVerbId(lemma),
        type: "verb",
        title: lemma,
        subtitle: enStr || verb.verb_group || "Verb",
        url: `/verbs/${encodeURIComponent(lemma)}`,
        badge: verb.verb_group || "verb",
        priority: verb.study?.learning_priority ?? undefined,
        score,
      });
    }
  }

  // 2. EXPRESSIONS
  for (const exp of dataset.expressions || []) {
    const fr = exp.canonical_form || "";
    const enStr = exp.english || "";
    const normFr = normalizeFrenchText(fr);
    const normEn = normalizeFrenchText(enStr);

    let score = 0;
    if (normFr === query) score = 95;
    else if (normFr.startsWith(query)) score = 75;
    else if (normFr.includes(query)) score = 55;
    else if (normEn.includes(query)) score = 35;

    if (score > 0) {
      results.push({
        id: makeExpressionId(fr),
        type: "expression",
        title: fr,
        subtitle: enStr,
        snippet: exp.expression_type || "Expression",
        url: `/expressions/${encodeURIComponent(fr)}`,
        badge: exp.expression_type || "expression",
        priority: exp.study?.learning_priority ?? undefined,
        score,
      });
    }
  }

  // 3. VOCABULARY
  for (const item of dataset.vocabulary || []) {
    const fr = item.canonical_form || "";
    const enStr = item.english || "";
    const normFr = normalizeFrenchText(fr);
    const normEn = normalizeFrenchText(enStr);

    let score = 0;
    if (normFr === query) score = 90;
    else if (normFr.startsWith(query)) score = 70;
    else if (normFr.includes(query)) score = 50;
    else if (normEn.includes(query)) score = 30;

    if (score > 0) {
      results.push({
        id: `vocab_${slugify(fr)}`,
        type: "vocabulary",
        title: fr,
        subtitle: enStr,
        snippet: item.part_of_speech,
        url: `/vocabulary/${encodeURIComponent(fr)}`,
        badge: item.part_of_speech || "vocab",
        priority: item.study?.learning_priority ?? undefined,
        score,
      });
    }
  }

  // 4. GRAMMAR RULES
  for (const rule of dataset.grammar_rules || []) {
    const title = rule.rule_name || "";
    const normTitle = normalizeFrenchText(title);
    const normExpl = normalizeFrenchText(rule.explanation || rule.summary || "");

    let score = 0;
    if (normTitle.includes(query)) score = 65;
    else if (normExpl.includes(query)) score = 25;

    if (score > 0) {
      results.push({
        id: makeRuleId(title),
        type: "grammar_rule",
        title,
        snippet: rule.summary || rule.explanation?.slice(0, 100) || undefined,
        url: `/grammar/${encodeURIComponent(title)}`,
        badge: (rule.tags && rule.tags[0]) || "grammar",
        priority: rule.study?.learning_priority ?? undefined,
        score,
      });
    }
  }

  // 5. TENSES
  for (const tense of dataset.tenses || []) {
    const fr = tense.name || "";
    const en = tense.english_name || "";
    const normFr = normalizeFrenchText(fr);
    const normEn = normalizeFrenchText(en);

    let score = 0;
    if (normFr === query || normEn === query) score = 90;
    else if (normFr.includes(query) || normEn.includes(query)) score = 60;

    if (score > 0) {
      results.push({
        id: makeTenseId(fr),
        type: "tense",
        title: en ? `${fr} (${en})` : fr,
        subtitle: tense.mood || "Tense",
        url: `/tenses/${encodeURIComponent(fr)}`,
        badge: tense.mood || "tense",
        score,
      });
    }
  }

  // 6. CHAPTERS
  for (const ch of dataset.chapters || []) {
    const title = ch.chapter_title || "";
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
        id: makeChapterId(ch.chapter_number),
        type: "chapter",
        title: `Chapter ${ch.chapter_number}: ${title}`,
        url: `/chapters/${ch.chapter_number}`,
        badge: `ch ${ch.chapter_number}`,
        score,
      });
    }
  }

  // 7. EXERCISES
  for (const ex of dataset.exercises || []) {
    const title = ex.title || `Exercise ${ex.exercise_code}`;
    const normTitle = normalizeFrenchText(title);
    const normCode = normalizeFrenchText(ex.exercise_code);
    const normInst = normalizeFrenchText(ex.instructions);

    let score = 0;
    if (normCode === query) score = 80;
    else if (normTitle.includes(query)) score = 60;
    else if (normInst.includes(query)) score = 40;

    if (score > 0) {
      results.push({
        id: `exercise_${slugify(ex.exercise_code)}`,
        type: "exercise",
        title,
        subtitle: `Chapter ${ex.chapter_number} • ${ex.exercise_type || "Exercise"}`,
        snippet: ex.instructions?.slice(0, 100),
        url: `/chapters/${ex.chapter_number}`,
        badge: "exercise",
        score,
      });
    }
  }

  // 8. EXCEPTIONS & TRAPS
  for (const trap of dataset.exceptions_and_traps || []) {
    const title = trap.title;
    const normTitle = normalizeFrenchText(title);
    const normDesc = normalizeFrenchText(trap.description);

    let score = 0;
    if (normTitle.includes(query)) score = 70;
    else if (normDesc.includes(query)) score = 35;

    if (score > 0) {
      results.push({
        id: `trap_${slugify(title)}`,
        type: "trap",
        title,
        subtitle: trap.category || "Pitfall",
        snippet: trap.description.slice(0, 100),
        url: `/traps`,
        badge: "trap",
        score,
      });
    }
  }

  // 9. EXAMPLES
  for (const ex of dataset.examples || []) {
    const normFr = normalizeFrenchText(ex.french);
    const normEn = normalizeFrenchText(ex.english);

    let score = 0;
    if (normFr.includes(query)) score = 45;
    else if (normEn.includes(query)) score = 20;

    if (score > 0) {
      results.push({
        id: `example_${slugify(ex.french.slice(0, 20))}`,
        type: "example",
        title: ex.french,
        subtitle: ex.english,
        url: `/examples?query=${encodeURIComponent(rawQuery)}`,
        badge: "example",
        score,
      });
    }
  }

  // 10. CONCEPTS
  for (const concept of dataset.concepts || []) {
    const name = concept.name || "";
    const normName = normalizeFrenchText(name);
    const normDesc = normalizeFrenchText(concept.description);

    let score = 0;
    if (normName === query) score = 92;
    else if (normName.startsWith(query)) score = 72;
    else if (normName.includes(query)) score = 52;
    else if (normDesc.includes(query)) score = 25;

    if (score > 0) {
      results.push({
        id: `concept_${slugify(name)}`,
        type: "concept",
        title: name,
        subtitle: concept.description ? concept.description.slice(0, 80) : "Linguistic Concept",
        snippet: concept.study?.cefr_level ? `CEFR ${concept.study.cefr_level}` : undefined,
        url: `/concepts/${encodeURIComponent(name)}`,
        badge: concept.study?.cefr_level || "concept",
        priority: concept.study?.learning_priority ?? undefined,
        score,
      });
    }
  }

  return results
    .sort((a, b) => b.score - a.score || a.title.length - b.title.length)
    .slice(0, limit);
}
