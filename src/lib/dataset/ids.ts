/**
 * Deterministic ID generation utilities for French Revision Super Dataset
 */

export function stripAccents(str: string): string {
  return str
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/œ/g, "oe")
    .replace(/æ/g, "ae")
    .replace(/ç/g, "c")
    .replace(/Ç/g, "c");
}

export function slugify(str: string): string {
  return stripAccents(str)
    .toLowerCase()
    .replace(/['’`´]/g, "_")
    .replace(/[^a-z0-9_]+/g, "_")
    .replace(/_+/g, "_")
    .replace(/^_|_$/g, "");
}

export function makeBookId(titleOrSlug: string): string {
  const slug = slugify(titleOrSlug);
  return `book_${slug}`;
}

export function makeChapterId(chapterNumber: number): string {
  const numStr = chapterNumber.toString().padStart(2, "0");
  return `chapter_${numStr}`;
}


export function makeSectionId(chapterNumber: number, sectionOrder: number, title?: string): string {
  const chStr = chapterNumber.toString().padStart(2, "0");
  const secStr = sectionOrder.toString().padStart(2, "0");
  if (title) {
    const slug = slugify(title).slice(0, 30);
    return `section_${chStr}_${secStr}_${slug}`;
  }
  return `section_${chStr}_${secStr}`;
}

export function makeConceptId(name: string): string {
  const slug = slugify(name);
  return `concept_${slug}`;
}

export function makeTenseId(nameEnglishOrKey: string): string {
  const slug = slugify(nameEnglishOrKey);
  return `tense_${slug}`;
}

export function makeRuleId(titleOrKey: string): string {
  const slug = slugify(titleOrKey);
  return `rule_${slug}`;
}

export function makeVerbId(infinitive: string): string {
  // Strip reflexive 'se ' / 's'' prefix if present for base canonical ID, or preserve if distinct pronominal
  const clean = infinitive.trim();
  const slug = slugify(clean);
  return `verb_${slug}`;
}

export function makeConjugationId(verbIdOrInfinitive: string, tenseIdOrKey: string): string {
  const vSlug = verbIdOrInfinitive.startsWith("verb_")
    ? verbIdOrInfinitive.replace(/^verb_/, "")
    : slugify(verbIdOrInfinitive);
  const tSlug = tenseIdOrKey.startsWith("tense_")
    ? tenseIdOrKey.replace(/^tense_/, "")
    : slugify(tenseIdOrKey);
  return `conj_${vSlug}_${tSlug}`;
}

export function makeExpressionId(canonicalForm: string): string {
  // common abbreviations in IDs: quelqu'un -> qqn, quelque chose -> qqch, infinitif -> inf
  let form = canonicalForm
    .replace(/\bquelqu['’]un\b/gi, "qqn")
    .replace(/\bquelque chose\b/gi, "qqch")
    .replace(/\b[+]?\s*infinitif\b/gi, "inf");
  const slug = slugify(form);
  return `expr_${slug}`;
}

export function makeVocabId(canonicalWord: string, pos?: string): string {
  // Remove leading articles like 'le ', 'la ', 'l'', 'un ', 'une '
  let clean = canonicalWord.trim().replace(/^(le|la|l'|l’|les|un|une|des)\s+/i, "");
  const slug = slugify(clean);
  if (pos && (pos === "verb" || pos === "adverb" || pos === "adjective")) {
    return `vocab_${slug}`;
  }
  return `vocab_${slug}`;
}

export function makeExampleId(verbOrChapter: string, index: number): string {
  const prefix = slugify(verbOrChapter);
  const idxStr = index.toString().padStart(3, "0");
  return `example_${prefix}_${idxStr}`;
}

export function makeExerciseId(chapterNumber: number, exerciseNumber: string | number): string {
  const chStr = chapterNumber.toString().padStart(2, "0");
  const exStr = exerciseNumber.toString().replace(/[^0-9]/g, "_").padStart(2, "0");
  return `exercise_${chStr}_${exStr}`;
}

export function makeQuestionId(exerciseId: string, questionIndex: number): string {
  const qStr = questionIndex.toString().padStart(2, "0");
  return `${exerciseId}_q${qStr}`;
}

export function makeStudySetId(name: string): string {
  const slug = slugify(name);
  return `studyset_${slug}`;
}

export const VALID_ID_PREFIXES = [
  "book_",
  "chapter_",
  "section_",
  "concept_",
  "tense_",
  "rule_",
  "verb_",
  "conj_",
  "expr_",
  "vocab_",
  "example_",
  "exercise_",
  "studyset_",
] as const;

export function isValidId(id: string): boolean {
  if (!id || typeof id !== "string") return false;
  return VALID_ID_PREFIXES.some((prefix) => id.startsWith(prefix));
}
