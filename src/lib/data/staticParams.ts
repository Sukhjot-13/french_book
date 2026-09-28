import {
  getVerbs,
  getTenses,
  getGrammarRules,
  getExpressions,
  getChapters,
  getConcepts,
  getVocabulary,
} from "./selectors";

/**
 * Enumerable id lists for the seven dynamic detail routes. The dataset is fully
 * static, so every id can be enumerated at build time and prerendered.
 * Vocabulary ids come from the deduplicated index so they match exactly what
 * /vocabulary and /vocabulary/[id] produce.
 */

export function getAllVerbIds(): string[] {
  return getVerbs().verbs.map((v) => v.lemma);
}

export function getAllTenseIds(): string[] {
  return getTenses().map((t) => t.name_fr);
}

export function getAllGrammarIds(): string[] {
  return getGrammarRules().rules.map((r) => r.title);
}

export function getAllExpressionIds(): string[] {
  return getExpressions().expressions.map((e) => e.french);
}

export function getAllChapterIds(): string[] {
  return getChapters().map((c) => String(c.chapter_number));
}

export function getAllConceptIds(): string[] {
  return getConcepts().map((c) => c.name);
}

export function getAllVocabularyIds(): string[] {
  return getVocabulary({ limit: Number.MAX_SAFE_INTEGER }).vocabulary.map((v) => v.id);
}
