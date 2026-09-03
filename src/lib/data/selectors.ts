import { getMasterDataset } from "./loader";
import {
  MasterVerb,
  MasterTense,
  MasterGrammarRule,
  MasterExpression,
  MasterVocabulary,
  MasterExample,
  MasterExercise,
  MasterExceptionTrap,
  MasterConcept,
  MasterChapter,
  Sense,
  VerbConjugation,
  VerbStem,
  PatternSlot,
  FocusSpan,
  ExerciseQuestion,
  ChapterSection,
} from "../dataset/masterSchema";
import { normalizeFrenchText } from "./search";
import { slugify, makeVerbId, makeTenseId, makeRuleId, makeExpressionId, makeVocabId, makeChapterId } from "../dataset/ids";

// =======================================================================
// MASTER SCHEMA UI VIEW MODELS
// =======================================================================

export interface VerbUI {
  id: string;
  lemma: string;
  display_form?: string | null;
  english: string;
  senses: Sense[];
  group: string;
  auxiliary: string;
  regularity: string;
  pronominal: boolean;
  transitivity: string;
  past_participle?: string | null;
  present_participle?: string | null;
  stems: (string | VerbStem)[];
  conjugations: VerbConjugation[];
  conjugation_ids: string[];
  expression_ids: string[];
  related_expressions: string[];
  related_concepts: string[];
  priority: number;
  usefulness: number;
  difficulty: number;
  cefr?: string | null;
  register?: string | null;
  synonyms: string[];
  antonyms: string[];
  usage_notes: string[];
  tags: string[];
  chapter_ids: string[];
  raw_chapters: number[];
}

export interface ConjugationUI {
  id: string;
  verb_id: string;
  tense_id: string;
  tense_name_fr: string;
  tense_name_en?: string;
  mood: string;
  je?: string | null;
  tu?: string | null;
  il_elle_on?: string | null;
  nous?: string | null;
  vous?: string | null;
  ils_elles?: string | null;
  imperative_tu?: string | null;
  imperative_nous?: string | null;
  imperative_vous?: string | null;
  impersonal_form?: string | null;
  notes?: string | null;
  stems?: string[];
  endings?: string[];
}

export interface ExpressionUI {
  id: string;
  french: string;
  display_form?: string | null;
  english: string;
  type: string;
  productive: boolean;
  pattern?: string | null;
  pattern_slots: PatternSlot[];
  register: string;
  strength?: string | null;
  prepositions: string[];
  complement_structure?: string | null;
  restrictions: string[];
  transformations: unknown[];
  synonyms: string[];
  antonyms: string[];
  usage_notes: string[];
  base_verb_ids: string[];
  related_verbs: string[];
  related_vocabulary: string[];
  related_grammar_rules: string[];
  related_concepts: string[];
  priority: number;
  cefr?: string | null;
  chapter_ids: string[];
  raw_chapters: number[];
}

export interface VocabUI {
  id: string;
  french: string;
  display_form?: string | null;
  english: string;
  part_of_speech: string;
  gender?: string | null;
  article?: string | null;
  plural_form?: string | null;
  variants: string[];
  senses: Sense[];
  word_family: string[];
  category?: string | null;
  register?: string | null;
  synonyms: string[];
  antonyms: string[];
  usage_notes: string[];
  priority: number;
  cefr?: string | null;
  related_expressions: string[];
  related_verbs: string[];
  related_concepts: string[];
  chapter_ids: string[];
  raw_chapters: number[];
}

export interface GrammarRuleUI {
  id: string;
  title: string;
  title_fr?: string | null;
  summary?: string | null;
  category: string;
  explanation: string;
  formation?: string | null;
  formation_pattern?: string | null;
  usage: string[];
  restrictions: string[];
  conditions: string[];
  signal_words: string[];
  exceptions: string[];
  agreement_rules: string[];
  word_order?: string | null;
  negative_form?: string | null;
  interrogative_form?: string | null;
  affirmative_form?: string | null;
  transformations: unknown[];
  contrast_with: string[];
  common_traps: string[];
  priority: number;
  difficulty: number;
  cefr?: string | null;
  tense_ids: string[];
  verb_ids: string[];
  related_tenses: string[];
  related_concepts: string[];
  related_verbs: string[];
  related_expressions: string[];
  chapter_ids: string[];
  raw_chapters: number[];
}

export interface TenseUI {
  id: string;
  name_fr: string;
  name_en: string;
  mood: string;
  formation?: string | null;
  formation_rule?: string | null;
  usage: string[];
  signal_words: string[];
  regular_patterns: unknown[];
  irregular_stems: unknown[];
  compound_structure: unknown | null;
  agreement_rules: string[];
  negative_form?: string | null;
  interrogative_form?: string | null;
  affirmative_form?: string | null;
  common_traps: string[];
  related_tenses: string[];
  related_grammar_rules: string[];
  tags: string[];
  cefr?: string | null;
  priority: number;
  chapter_ids: string[];
  raw_chapters: number[];
}

export interface ChapterUI {
  id: string;
  chapter_number: number;
  title: string;
  pages?: {
    printed_start?: number | null;
    printed_end?: number | null;
    pdf_start?: number | null;
    pdf_end?: number | null;
  };
  sections: ChapterSection[];
  concepts: string[];
  grammar_rules: string[];
  verbs: string[];
  expressions: string[];
  vocabulary: string[];
  tenses: string[];
  exercises_count: number;
  exercise_ids: string[];
  notes?: string | null;
  // Legacy compatibility aliases
  rule_ids: string[];
  verb_ids: string[];
  vocab_ids: string[];
  expression_ids: string[];
}

export interface ExampleUI {
  id: string;
  french: string;
  english: string;
  focus_spans: FocusSpan[];
  related_verbs: string[];
  related_expressions: string[];
  related_vocabulary: string[];
  related_grammar_rules: string[];
  related_tenses: string[];
  related_concepts: string[];
  tags: string[];
  chapter_ids: string[];
  raw_chapters: number[];
  notes?: string | null;
}

export interface ExerciseUI {
  id: string;
  chapter_number: number;
  chapter_id: string;
  exercise_code: string;
  title: string;
  exercise_type: string;
  instructions: string;
  section_title?: string | null;
  pages?: {
    printed_start?: number | null;
    printed_end?: number | null;
    pdf_start?: number | null;
    pdf_end?: number | null;
  };
  questions_count: number;
  questions: ExerciseQuestion[];
  related_verbs: string[];
  related_expressions: string[];
  related_vocabulary: string[];
  related_grammar_rules: string[];
  related_tenses: string[];
  related_concepts: string[];
}

export interface ExceptionTrapUI {
  id: string;
  title: string;
  category: string;
  description: string;
  correct_form?: string | null;
  incorrect_form?: string | null;
  related_grammar_rules: string[];
  related_verbs: string[];
  related_expressions: string[];
  related_examples: string[];
  tags: string[];
  cefr?: string | null;
  priority: number;
  chapter_ids: string[];
  raw_chapters: number[];
  notes?: string | null;
}

export type TrapUI = ExceptionTrapUI;
export type VerbConjugationUI = ConjugationUI;

export interface ConceptUI {
  id: string;
  name: string;
  description?: string | null;
  aliases: string[];
  related_grammar_rules: string[];
  related_verbs: string[];
  related_expressions: string[];
  related_vocabulary: string[];
  related_tenses: string[];
  tags: string[];
  cefr?: string | null;
  priority: number;
  chapter_ids: string[];
  raw_chapters: number[];
}

// =======================================================================
// MAPPING HELPERS
// =======================================================================

/**
 * Safely normalizes english translations (which may be an array in master data)
 * into a clean, comma-and-space separated string.
 * When isVerb is true, intelligently avoids redundancies where both bare verb and
 * infinitive with 'to' exist (e.g. ['accept', 'to accept'] -> 'to accept').
 */
export function formatEnglishList(
  val: unknown,
  isVerb: boolean = false
): string {
  if (!val) return "";
  if (typeof val === "string") {
    val = [val];
  }
  if (!Array.isArray(val)) return String(val).trim();
  if (val.length === 0) return "";

  const cleaned = (val as unknown[])
    .map((s) => (typeof s === "string" ? s.trim() : String(s ?? "").trim()))
    .filter(Boolean);
  if (cleaned.length === 0) return "";

  // Deduplicate case-insensitively preserving first appearance
  const unique: string[] = [];
  const seen = new Set<string>();
  for (const item of cleaned) {
    const lower = item.toLowerCase();
    if (!seen.has(lower)) {
      seen.add(lower);
      unique.push(item);
    }
  }

  if (isVerb) {
    // If 'to <item>' exists in unique, omit bare '<item>' to prevent redundancies
    const filtered = unique.filter((item) => {
      const lower = item.toLowerCase();
      if (!lower.startsWith("to ")) {
        if (seen.has("to " + lower)) return false;
      }
      return true;
    });
    return filtered.join(", ");
  }

  return unique.join(", ");
}

function mapVerb(v: MasterVerb): VerbUI {
  const id = makeVerbId(v.infinitive);
  const chapterIds = (v.chapters || []).map((ch) => makeChapterId(ch));

  return {
    id,
    lemma: v.infinitive,
    display_form: v.display_form || v.infinitive,
    english: formatEnglishList(v.english, true),
    senses: v.senses || [],
    group: v.verb_group || "1st_group",
    auxiliary: v.auxiliary || "avoir",
    regularity: v.regularity || "regular",
    pronominal: Boolean(v.pronominal),
    transitivity: v.transitivity || "transitive",
    past_participle: v.past_participle || null,
    present_participle: v.present_participle || null,
    stems: v.stems || [],
    conjugations: v.conjugations || [],
    conjugation_ids: (v.conjugations || []).map((_, idx) => `${id}_conj_${idx}`),
    expression_ids: (v.related_expressions || []).map((e) => makeExpressionId(e)),
    related_expressions: v.related_expressions || [],
    related_concepts: v.related_concepts || [],
    priority: v.study?.learning_priority ?? 3,
    usefulness: v.study?.usefulness ?? 3,
    difficulty: v.study?.difficulty ?? 2,
    cefr: v.study?.cefr_level || null,
    register: v.register || "neutral",
    synonyms: v.synonyms || [],
    antonyms: v.antonyms || [],
    usage_notes: v.usage_notes || [],
    tags: v.tags || [],
    chapter_ids: chapterIds,
    raw_chapters: v.chapters || [],
  };
}

function mapTense(t: MasterTense): TenseUI {
  const id = makeTenseId(t.name);
  const chapterIds = (t.chapters || []).map((ch) => makeChapterId(ch));
  const usage = Array.isArray(t.usage) ? t.usage : t.usage ? [t.usage] : [];

  return {
    id,
    name_fr: t.name,
    name_en: t.english_name || t.name,
    mood: t.mood || "indicative",
    formation: t.formation || null,
    formation_rule: t.formation || null,
    usage,
    signal_words: t.signal_words || [],
    regular_patterns: t.regular_patterns || [],
    irregular_stems: t.irregular_stems || [],
    compound_structure: t.compound_structure || null,
    agreement_rules: t.agreement_rules || [],
    negative_form: t.negative_form || null,
    interrogative_form: t.interrogative_form || null,
    affirmative_form: t.affirmative_form || null,
    common_traps: t.common_traps || [],
    related_tenses: t.related_tenses || [],
    related_grammar_rules: t.related_grammar_rules || [],
    tags: t.tags || [],
    cefr: t.study?.cefr_level || null,
    priority: t.study?.learning_priority ?? 3,
    chapter_ids: chapterIds,
    raw_chapters: t.chapters || [],
  };
}

function mapRule(r: MasterGrammarRule): GrammarRuleUI {
  const id = makeRuleId(r.rule_name);
  const chapterIds = (r.chapters || []).map((ch) => makeChapterId(ch));
  const usage = Array.isArray(r.usage) ? r.usage : r.usage ? [r.usage] : [];

  return {
    id,
    title: r.rule_name,
    title_fr: r.rule_name,
    summary: r.summary || null,
    category: (r.tags && r.tags[0]) || "General",
    explanation: r.explanation || r.summary || "",
    formation: r.formation || null,
    formation_pattern: r.formation || null,
    usage,
    restrictions: r.restrictions || [],
    conditions: r.conditions || [],
    signal_words: r.signal_words || [],
    exceptions: r.exceptions || [],
    agreement_rules: r.agreement_rules || [],
    word_order: r.word_order || null,
    negative_form: r.negative_form || null,
    interrogative_form: r.interrogative_form || null,
    affirmative_form: r.affirmative_form || null,
    transformations: r.transformations || [],
    contrast_with: r.contrast_with || [],
    common_traps: r.common_traps || [],
    priority: r.study?.learning_priority ?? 3,
    difficulty: r.study?.difficulty ?? 2,
    cefr: r.study?.cefr_level || null,
    tense_ids: (r.related_tenses || []).map(makeTenseId),
    verb_ids: (r.related_verbs || []).map(makeVerbId),
    related_tenses: r.related_tenses || [],
    related_concepts: r.related_concepts || [],
    related_verbs: r.related_verbs || [],
    related_expressions: r.related_expressions || [],
    chapter_ids: chapterIds,
    raw_chapters: r.chapters || [],
  };
}

function mapExpression(e: MasterExpression): ExpressionUI {
  const id = makeExpressionId(e.canonical_form);
  const chapterIds = (e.chapters || []).map((ch) => makeChapterId(ch));

  return {
    id,
    french: e.canonical_form,
    display_form: e.display_form || e.canonical_form,
    english: formatEnglishList(e.english, false),
    type: e.expression_type || "idiomatic_expression",
    productive: Boolean(e.productive),
    pattern: e.pattern || null,
    pattern_slots: e.pattern_slots || [],
    register: e.register || "neutral",
    strength: e.collocation_strength || null,
    prepositions: e.prepositions || [],
    complement_structure: e.complement_structure || null,
    restrictions: e.restrictions || [],
    transformations: e.transformations || [],
    synonyms: e.synonyms || [],
    antonyms: e.antonyms || [],
    usage_notes: e.usage_notes || [],
    base_verb_ids: (e.related_verbs || []).map(makeVerbId),
    related_verbs: e.related_verbs || [],
    related_vocabulary: e.related_vocabulary || [],
    related_grammar_rules: e.related_grammar_rules || [],
    related_concepts: e.related_concepts || [],
    priority: e.study?.learning_priority ?? 3,
    cefr: e.study?.cefr_level || null,
    chapter_ids: chapterIds,
    raw_chapters: e.chapters || [],
  };
}

function mapVocab(vc: MasterVocabulary, explicitIdOrIndex?: string | number): VocabUI {
  const explicitId = typeof explicitIdOrIndex === "string" ? explicitIdOrIndex : undefined;
  const id = explicitId || makeVocabId(vc.canonical_form, vc.part_of_speech);
  const chapterIds = (vc.chapters || []).map((ch) => makeChapterId(ch));

  let article: string | null = null;
  if (typeof vc.article === "string" && vc.article) {
    article = vc.article;
  } else if (Array.isArray(vc.articles)) {
    article = vc.articles.filter(Boolean).join(", ") || null;
  } else if (vc.articles && typeof vc.articles === "object") {
    const artObj = vc.articles as {
      definite?: string | null;
      indefinite?: string | null;
      partitive?: string | null;
      other?: string[];
    };
    article =
      artObj.definite ||
      artObj.indefinite ||
      artObj.partitive ||
      (Array.isArray(artObj.other) ? artObj.other[0] : null) ||
      null;
  }

  return {
    id,
    french: vc.canonical_form,
    display_form: vc.display_form || vc.canonical_form,
    english: formatEnglishList(vc.english, false),
    part_of_speech: vc.part_of_speech || "noun",
    gender: vc.gender || null,
    article,
    plural_form: vc.plural || null,
    variants: vc.variants || [],
    senses: vc.senses || [],
    word_family: vc.word_family || [],
    category: (vc.tags && vc.tags[0]) || null,
    register: vc.register || "neutral",
    synonyms: vc.synonyms || [],
    antonyms: vc.antonyms || [],
    usage_notes: vc.usage_notes || [],
    priority: vc.study?.learning_priority ?? 3,
    cefr: vc.study?.cefr_level || null,
    related_expressions: vc.related_expressions || [],
    related_verbs: vc.related_verbs || [],
    related_concepts: vc.related_concepts || [],
    chapter_ids: chapterIds,
    raw_chapters: vc.chapters || [],
  };
}

function mapChapter(ch: MasterChapter): ChapterUI {
  const id = makeChapterId(ch.chapter_number);
  const sections = ch.sections || [];
  const exerciseIds = Array.from({ length: 10 }).map((_, i) => `${ch.chapter_number}.${i + 1}`);

  return {
    id,
    chapter_number: ch.chapter_number,
    title: ch.chapter_title,
    pages: ch.pages,
    sections,
    concepts: ch.concepts || [],
    grammar_rules: ch.grammar_rules || [],
    verbs: ch.verbs || [],
    expressions: ch.expressions || [],
    vocabulary: ch.vocabulary || [],
    tenses: ch.tenses || [],
    exercises_count: sections.length,
    exercise_ids: exerciseIds,
    notes: ch.notes || null,
    rule_ids: (ch.grammar_rules || []).map((r) => makeRuleId(r)),
    verb_ids: (ch.verbs || []).map((v) => makeVerbId(v)),
    vocab_ids: (ch.vocabulary || []).map((w) => makeVocabId(w)),
    expression_ids: (ch.expressions || []).map((e) => makeExpressionId(e)),
  };
}

function mapExample(ex: MasterExample, index: number): ExampleUI {
  const id = `example_${index + 1}_${slugify(ex.french.slice(0, 30))}`;
  const chapterIds = (ex.chapters || []).map((ch) => makeChapterId(ch));

  return {
    id,
    french: ex.french,
    english: ex.english,
    focus_spans: ex.focus_spans || [],
    related_verbs: ex.related_verbs || [],
    related_expressions: ex.related_expressions || [],
    related_vocabulary: ex.related_vocabulary || [],
    related_grammar_rules: ex.related_grammar_rules || [],
    related_tenses: ex.related_tenses || [],
    related_concepts: ex.related_concepts || [],
    tags: ex.tags || [],
    chapter_ids: chapterIds,
    raw_chapters: ex.chapters || [],
    notes: ex.notes || null,
  };
}

function mapExercise(ex: MasterExercise): ExerciseUI {
  const chapterId = makeChapterId(ex.chapter_number);
  const code = ex.exercise_code.replace(/\./g, "_dot_");
  const id = `exercise_${slugify(code)}`;

  return {
    id,
    chapter_number: ex.chapter_number,
    chapter_id: chapterId,
    exercise_code: ex.exercise_code,
    title: ex.title || `Exercise ${ex.exercise_code}`,
    exercise_type: ex.exercise_type || "fill_in_the_blank",
    instructions: ex.instructions || "",
    section_title: ex.section_title || null,
    pages: ex.pages,
    questions_count: (ex.questions || []).length,
    questions: ex.questions || [],
    related_verbs: ex.related_verbs || [],
    related_expressions: ex.related_expressions || [],
    related_vocabulary: ex.related_vocabulary || [],
    related_grammar_rules: ex.related_grammar_rules || [],
    related_tenses: ex.related_tenses || [],
    related_concepts: ex.related_concepts || [],
  };
}

function mapTrap(t: MasterExceptionTrap): ExceptionTrapUI {
  const id = `trap_${slugify(t.title)}`;
  const chapterIds = (t.chapters || []).map((ch) => makeChapterId(ch));

  return {
    id,
    title: t.title,
    category: t.category || "General",
    description: t.description,
    correct_form: t.correct_form || null,
    incorrect_form: t.incorrect_form || null,
    related_grammar_rules: t.related_grammar_rules || [],
    related_verbs: t.related_verbs || [],
    related_expressions: t.related_expressions || [],
    related_examples: t.related_examples || [],
    tags: t.tags || [],
    cefr: t.study?.cefr_level || null,
    priority: t.study?.learning_priority ?? 3,
    chapter_ids: chapterIds,
    raw_chapters: t.chapters || [],
    notes: t.notes || null,
  };
}

function mapConcept(c: MasterConcept, explicitIdOrIndex?: string | number): ConceptUI {
  const explicitId = typeof explicitIdOrIndex === "string" ? explicitIdOrIndex : undefined;
  const id = explicitId || `concept_${slugify(c.name)}`;
  const chapterIds = (c.chapters || []).map((ch) => makeChapterId(ch));

  return {
    id,
    name: c.name,
    description: c.description || null,
    aliases: c.aliases || [],
    related_grammar_rules: c.related_grammar_rules || [],
    related_verbs: c.related_verbs || [],
    related_expressions: c.related_expressions || [],
    related_vocabulary: c.related_vocabulary || [],
    related_tenses: c.related_tenses || [],
    tags: c.tags || [],
    cefr: c.study?.cefr_level || null,
    priority: c.study?.learning_priority ?? 3,
    chapter_ids: chapterIds,
    raw_chapters: c.chapters || [],
  };
}

// =======================================================================
// HOME STATS SELECTOR
// =======================================================================

export function getHomeStats() {
  const data = getMasterDataset();
  return {
    totalChapters: (data.chapters || []).length,
    totalVerbs: (data.verbs || []).length,
    totalRules: (data.grammar_rules || []).length,
    totalTenses: (data.tenses || []).length,
    totalExpressions: (data.expressions || []).length,
    totalVocabulary: (data.vocabulary || []).length,
    totalExamples: (data.examples || []).length,
    totalExercises: (data.exercises || []).length,
    totalTraps: (data.exceptions_and_traps || []).length,
    totalConcepts: (data.concepts || []).length,
    bookTitle: data.metadata?.book_title || "Practice Makes Perfect: Complete French Grammar",
    author: data.metadata?.author || "Annie Heminway",
    datasetVersion: data.schema_version,
  };
}

// =======================================================================
// VERBS SELECTORS
// =======================================================================

export interface VerbFilterOptions {
  query?: string;
  group?: string;
  regularity?: string;
  auxiliary?: string;
  transitivity?: string;
  cefr?: string;
  chapterId?: string;
  limit?: number;
  offset?: number;
  sortBy?: "infinitive" | "priority" | "difficulty";
  sortOrder?: "asc" | "desc";
}

export function getVerbs(filters?: VerbFilterOptions): { verbs: VerbUI[]; total: number } {
  const data = getMasterDataset();
  let list = (data.verbs || []).map(mapVerb);

  if (filters?.query) {
    const q = normalizeFrenchText(filters.query);
    list = list.filter((v) => {
      const lemmaNorm = normalizeFrenchText(v.lemma);
      const enNorm = normalizeFrenchText(v.english);
      return lemmaNorm.includes(q) || enNorm.includes(q);
    });
  }

  if (filters?.group && filters.group !== "all") {
    list = list.filter((v) => v.group === filters.group);
  }

  if (filters?.regularity && filters.regularity !== "all") {
    list = list.filter((v) => v.regularity === filters.regularity);
  }

  if (filters?.auxiliary && filters.auxiliary !== "all") {
    list = list.filter((v) => v.auxiliary === filters.auxiliary);
  }

  if (filters?.transitivity && filters.transitivity !== "all") {
    list = list.filter((v) => v.transitivity === filters.transitivity);
  }

  if (filters?.cefr && filters.cefr !== "all") {
    list = list.filter((v) => v.cefr === filters.cefr);
  }

  if (filters?.chapterId && filters.chapterId !== "all") {
    list = list.filter((v) => v.chapter_ids.includes(filters.chapterId!));
  }

  // Sorting
  const sortBy = filters?.sortBy || "infinitive";
  const sortOrder = filters?.sortOrder || "asc";
  list.sort((a, b) => {
    let diff = 0;
    if (sortBy === "infinitive") {
      diff = a.lemma.localeCompare(b.lemma, "fr");
    } else if (sortBy === "priority") {
      diff = (b.priority ?? 0) - (a.priority ?? 0);
    } else if (sortBy === "difficulty") {
      diff = (b.difficulty ?? 0) - (a.difficulty ?? 0);
    }
    return sortOrder === "asc" ? diff : -diff;
  });

  const total = list.length;
  if (filters?.offset !== undefined || filters?.limit !== undefined) {
    const offset = filters.offset || 0;
    const limit = filters.limit || 50;
    list = list.slice(offset, offset + limit);
  }

  return { verbs: list, total };
}

export interface VerbDetailWithGraph {
  verb: VerbUI;
  conjugations: VerbConjugation[];
  expressions: ExpressionUI[];
  grammarRules: GrammarRuleUI[];
  examples: ExampleUI[];
}

function safeDecode(str: string): string {
  try {
    return decodeURIComponent(str);
  } catch {
    return str;
  }
}

export function getVerbById(verbId: string): VerbDetailWithGraph | null {
  const data = getMasterDataset();
  const rawId = verbId;
  const decoded = safeDecode(verbId);
  const rawVerb = (data.verbs || []).find((v) => {
    const id = makeVerbId(v.infinitive);
    return (
      id === rawId ||
      id === decoded ||
      v.infinitive === rawId ||
      v.infinitive === decoded ||
      (v.display_form && (v.display_form === rawId || v.display_form === decoded)) ||
      slugify(v.infinitive) === slugify(rawId) ||
      slugify(v.infinitive) === slugify(decoded) ||
      (v.display_form &&
        (slugify(v.display_form) === slugify(rawId) || slugify(v.display_form) === slugify(decoded)))
    );
  });

  if (!rawVerb) return null;

  const verb = mapVerb(rawVerb);

  const expressions = (data.expressions || [])
    .filter((e) => {
      if ((e.related_verbs || []).some((rv) => rv === rawVerb.infinitive)) return true;
      if ((rawVerb.related_expressions || []).includes(e.canonical_form) || (rawVerb.related_expressions || []).includes(e.display_form || "")) return true;
      const lowerCanonical = (e.canonical_form || "").toLowerCase();
      const lowerInfinitive = rawVerb.infinitive.toLowerCase();
      if (lowerCanonical === lowerInfinitive || lowerCanonical.startsWith(`${lowerInfinitive} `)) return true;
      return false;
    })
    .map(mapExpression);

  const grammarRules = (data.grammar_rules || [])
    .filter((r) => (r.related_verbs || []).some((rv) => rv === rawVerb.infinitive))
    .map(mapRule);

  const examples = (data.examples || [])
    .filter((ex) => (ex.related_verbs || []).some((rv) => rv === rawVerb.infinitive))
    .map((ex, i) => mapExample(ex, i));

  return {
    verb,
    conjugations: rawVerb.conjugations || [],
    expressions,
    grammarRules,
    examples,
  };
}

// =======================================================================
// TENSES SELECTORS
// =======================================================================

export function getTenses(): TenseUI[] {
  const data = getMasterDataset();
  return (data.tenses || []).map(mapTense);
}

export interface TenseDetailWithGraph {
  tense: TenseUI;
  conjugations: ConjugationUI[];
  verbs: VerbUI[];
  grammarRules: GrammarRuleUI[];
  examples: ExampleUI[];
  traps: ExceptionTrapUI[];
}

export function getTenseById(tenseId: string): TenseDetailWithGraph | null {
  const data = getMasterDataset();
  const rawId = tenseId;
  const decoded = safeDecode(tenseId);
  const rawTense = (data.tenses || []).find((t) => {
    const id = makeTenseId(t.name);
    return (
      id === rawId ||
      id === decoded ||
      t.name === rawId ||
      t.name === decoded ||
      (t.english_name && (t.english_name === rawId || t.english_name === decoded)) ||
      slugify(t.name) === slugify(rawId) ||
      slugify(t.name) === slugify(decoded) ||
      (t.english_name &&
        (slugify(t.english_name) === slugify(rawId) || slugify(t.english_name) === slugify(decoded)))
    );
  });

  if (!rawTense) return null;

  const tense = mapTense(rawTense);

  // Gather conjugations for this tense across verbs
  const conjugations: ConjugationUI[] = [];
  const verbList: VerbUI[] = [];

  for (const v of data.verbs || []) {
    const matches = (v.conjugations || []).filter(
      (c) =>
        c.tense === rawTense.name ||
        slugify(c.tense) === slugify(rawTense.name) ||
        (rawTense.english_name && slugify(c.tense) === slugify(rawTense.english_name))
    );
    if (matches.length > 0) {
      verbList.push(mapVerb(v));
      for (const m of matches) {
        conjugations.push({
          id: `${makeVerbId(v.infinitive)}_${slugify(m.tense)}`,
          verb_id: makeVerbId(v.infinitive),
          tense_id: tense.id,
          tense_name_fr: m.tense,
          tense_name_en: rawTense.english_name || undefined,
          mood: m.mood || rawTense.mood || "indicative",
          je: m.forms?.je || null,
          tu: m.forms?.tu || null,
          il_elle_on: m.forms?.il_elle_on || null,
          nous: m.forms?.nous || null,
          vous: m.forms?.vous || null,
          ils_elles: m.forms?.ils_elles || null,
          imperative_tu: m.forms?.imperative_tu || null,
          imperative_nous: m.forms?.imperative_nous || null,
          imperative_vous: m.forms?.imperative_vous || null,
          impersonal_form: m.forms?.impersonal_form || null,
          notes: Array.isArray(m.notes) ? m.notes.join(". ") : m.notes || null,
          stems: m.stems || [],
          endings: m.endings || [],
        });
      }
    }
  }

  const grammarRules = (data.grammar_rules || [])
    .filter((r) => (r.related_tenses || []).some((rt) => rt === rawTense.name || slugify(rt) === slugify(rawTense.name)))
    .map(mapRule);

  const examples = (data.examples || [])
    .filter((ex) => (ex.related_tenses || []).some((rt) => rt === rawTense.name || slugify(rt) === slugify(rawTense.name)))
    .map((ex, i) => mapExample(ex, i));

  const traps = (data.exceptions_and_traps || [])
    .filter((tr) => (tr.tags || []).some((tag) => slugify(tag) === slugify(rawTense.name)))
    .map(mapTrap);

  return {
    tense,
    conjugations,
    verbs: verbList.slice(0, 30),
    grammarRules,
    examples,
    traps,
  };
}

// =======================================================================
// GRAMMAR RULES SELECTORS
// =======================================================================

export interface GrammarFilterOptions {
  query?: string;
  category?: string;
  cefr?: string;
  chapterId?: string;
  limit?: number;
  offset?: number;
}

export function getGrammarRules(filters?: GrammarFilterOptions): { rules: GrammarRuleUI[]; total: number } {
  const data = getMasterDataset();
  let list = (data.grammar_rules || []).map(mapRule);

  if (filters?.query) {
    const q = normalizeFrenchText(filters.query);
    list = list.filter((r) => {
      const titleNorm = normalizeFrenchText(r.title);
      const expNorm = normalizeFrenchText(r.explanation);
      return titleNorm.includes(q) || expNorm.includes(q);
    });
  }

  if (filters?.category && filters.category !== "all") {
    list = list.filter((r) => r.category.toLowerCase() === filters.category!.toLowerCase());
  }

  if (filters?.cefr && filters.cefr !== "all") {
    list = list.filter((r) => r.cefr === filters.cefr);
  }

  if (filters?.chapterId && filters.chapterId !== "all") {
    list = list.filter((r) => r.chapter_ids.includes(filters.chapterId!));
  }

  const total = list.length;
  if (filters?.offset !== undefined || filters?.limit !== undefined) {
    const offset = filters.offset || 0;
    const limit = filters.limit || 50;
    list = list.slice(offset, offset + limit);
  }

  return { rules: list, total };
}

export interface GrammarRuleDetailWithGraph {
  rule: GrammarRuleUI;
  verbs: VerbUI[];
  tenses: TenseUI[];
  examples: ExampleUI[];
  traps: ExceptionTrapUI[];
}

export function getGrammarRuleById(ruleId: string): GrammarRuleDetailWithGraph | null {
  const data = getMasterDataset();
  const rawId = ruleId;
  const decoded = safeDecode(ruleId);
  const rawRule = (data.grammar_rules || []).find((r) => {
    const id = makeRuleId(r.rule_name);
    return (
      id === rawId ||
      id === decoded ||
      r.rule_name === rawId ||
      r.rule_name === decoded ||
      slugify(r.rule_name) === slugify(rawId) ||
      slugify(r.rule_name) === slugify(decoded)
    );
  });

  if (!rawRule) return null;

  const rule = mapRule(rawRule);

  const verbs = (data.verbs || [])
    .filter((v) => (rawRule.related_verbs || []).includes(v.infinitive))
    .map(mapVerb);

  const tenses = (data.tenses || [])
    .filter((t) => (rawRule.related_tenses || []).includes(t.name))
    .map(mapTense);

  const examples = (data.examples || [])
    .filter((ex) => (ex.related_grammar_rules || []).includes(rawRule.rule_name))
    .map((ex, i) => mapExample(ex, i));

  const traps = (data.exceptions_and_traps || [])
    .filter((tr) => (tr.related_grammar_rules || []).includes(rawRule.rule_name))
    .map(mapTrap);

  return {
    rule,
    verbs,
    tenses,
    examples,
    traps,
  };
}

// =======================================================================
// EXPRESSIONS SELECTORS
// =======================================================================

export interface ExpressionFilterOptions {
  query?: string;
  type?: string;
  register?: string;
  cefr?: string;
  chapterId?: string;
  preposition?: string;
  baseVerb?: string;
  limit?: number;
  offset?: number;
}

export function getExpressions(filters?: ExpressionFilterOptions): { expressions: ExpressionUI[]; total: number } {
  const data = getMasterDataset();
  let list = (data.expressions || []).map(mapExpression);

  if (filters?.query) {
    const q = normalizeFrenchText(filters.query);
    list = list.filter((e) => {
      const fr = normalizeFrenchText(e.french);
      const en = normalizeFrenchText(e.english);
      const pat = normalizeFrenchText(e.pattern || "");
      return fr.includes(q) || en.includes(q) || pat.includes(q);
    });
  }

  if (filters?.type && filters.type !== "all") {
    list = list.filter((e) => e.type === filters.type);
  }

  if (filters?.register && filters.register !== "all") {
    list = list.filter((e) => e.register === filters.register);
  }

  if (filters?.preposition && filters.preposition !== "all") {
    const prep = filters.preposition.toLowerCase();
    list = list.filter((e) =>
      (e.prepositions || []).some((p) => p.toLowerCase() === prep) ||
      (e.pattern || "").toLowerCase().includes(prep)
    );
  }

  if (filters?.baseVerb && filters.baseVerb !== "all") {
    const verb = filters.baseVerb.toLowerCase();
    list = list.filter((e) =>
      (e.related_verbs || []).some((v) => v.toLowerCase() === verb) ||
      normalizeFrenchText(e.french).includes(verb)
    );
  }

  if (filters?.cefr && filters.cefr !== "all") {
    list = list.filter((e) => e.cefr === filters.cefr);
  }

  if (filters?.chapterId && filters.chapterId !== "all") {
    list = list.filter((e) => e.chapter_ids.includes(filters.chapterId!));
  }

  const total = list.length;
  if (filters?.offset !== undefined || filters?.limit !== undefined) {
    const offset = filters.offset || 0;
    const limit = filters.limit || 50;
    list = list.slice(offset, offset + limit);
  }

  return { expressions: list, total };
}

export interface ExpressionDetailWithGraph {
  expression: ExpressionUI;
  verbs: VerbUI[];
  examples: ExampleUI[];
  vocabulary: VocabUI[];
}

export function getExpressionById(expressionId: string): ExpressionDetailWithGraph | null {
  const data = getMasterDataset();
  const rawId = expressionId;
  const decoded = safeDecode(expressionId);
  const rawExpression = (data.expressions || []).find((e) => {
    const id = makeExpressionId(e.canonical_form);
    return (
      id === rawId ||
      id === decoded ||
      e.canonical_form === rawId ||
      e.canonical_form === decoded ||
      slugify(e.canonical_form) === slugify(rawId) ||
      slugify(e.canonical_form) === slugify(decoded)
    );
  });

  if (!rawExpression) return null;

  const expression = mapExpression(rawExpression);

  const verbs = (data.verbs || [])
    .filter((v) => (rawExpression.related_verbs || []).includes(v.infinitive))
    .map(mapVerb);

  const examples = (data.examples || [])
    .filter((ex) => (ex.related_expressions || []).includes(rawExpression.canonical_form))
    .map((ex, i) => mapExample(ex, i));

  const vocabulary = (data.vocabulary || [])
    .filter((vc) => (rawExpression.related_vocabulary || []).includes(vc.canonical_form))
    .map(mapVocab);

  return {
    expression,
    verbs,
    examples,
    vocabulary,
  };
}

// =======================================================================
// VOCABULARY SELECTORS
// =======================================================================

export interface VocabFilterOptions {
  query?: string;
  pos?: string;
  gender?: string;
  cefr?: string;
  chapterId?: string;
  letter?: string;
  limit?: number;
  offset?: number;
}

export function getVocabulary(filters?: VocabFilterOptions): { vocabulary: VocabUI[]; total: number } {
  const data = getMasterDataset();
  const seenIds = new Set<string>();
  let list = (data.vocabulary || []).map((v, idx) => {
    let id = makeVocabId(v.canonical_form, v.part_of_speech);
    if (seenIds.has(id)) {
      const ch = v.chapters && v.chapters.length > 0 ? `ch${v.chapters[0]}` : String(idx + 1);
      id = `${id}_${ch}`;
    }
    seenIds.add(id);
    return mapVocab(v, id);
  });

  // Alphabetical sort by default for dictionary view
  list.sort((a, b) => a.french.localeCompare(b.french, "fr", { sensitivity: "base" }));

  if (filters?.letter && filters.letter !== "all") {
    const l = filters.letter.toLowerCase();
    list = list.filter((v) => normalizeFrenchText(v.french).startsWith(l));
  }

  if (filters?.query) {
    const q = normalizeFrenchText(filters.query);
    list = list.filter((v) => {
      const fr = normalizeFrenchText(v.french);
      const en = normalizeFrenchText(v.english);
      return fr.includes(q) || en.includes(q);
    });
  }

  if (filters?.pos && filters.pos !== "all") {
    list = list.filter((v) => v.part_of_speech === filters.pos);
  }

  if (filters?.gender && filters.gender !== "all") {
    list = list.filter((v) => v.gender === filters.gender);
  }

  if (filters?.cefr && filters.cefr !== "all") {
    list = list.filter((v) => v.cefr === filters.cefr);
  }

  if (filters?.chapterId && filters.chapterId !== "all") {
    list = list.filter((v) => v.chapter_ids.includes(filters.chapterId!));
  }

  const total = list.length;
  if (filters?.offset !== undefined || filters?.limit !== undefined) {
    const offset = filters.offset || 0;
    const limit = filters.limit || 50;
    list = list.slice(offset, offset + limit);
  }

  return { vocabulary: list, total };
}

export interface VocabDetailWithGraph {
  vocab: VocabUI;
  expressions: ExpressionUI[];
  examples: ExampleUI[];
  relatedVerbs: VerbUI[];
  relatedChapters: ChapterUI[];
}

export function getVocabularyById(vocabId: string): VocabDetailWithGraph | null {
  const data = getMasterDataset();
  const rawId = vocabId;
  const decoded = safeDecode(vocabId);
  const rawVocab = (data.vocabulary || []).find((v) => {
    const idWithPos = makeVocabId(v.canonical_form, v.part_of_speech);
    const idBare = makeVocabId(v.canonical_form);
    return (
      idWithPos === rawId ||
      idWithPos === decoded ||
      idBare === rawId ||
      idBare === decoded ||
      v.canonical_form === rawId ||
      v.canonical_form === decoded ||
      slugify(v.canonical_form) === slugify(rawId) ||
      slugify(v.canonical_form) === slugify(decoded) ||
      rawId.startsWith(idWithPos) ||
      decoded.startsWith(idWithPos) ||
      rawId.startsWith(idBare) ||
      decoded.startsWith(idBare)
    );
  });

  if (!rawVocab) return null;

  const vocab = mapVocab(rawVocab);
  const normWord = normalizeFrenchText(rawVocab.canonical_form);

  const expressions = (data.expressions || [])
    .filter((e) => {
      const normExp = normalizeFrenchText(e.canonical_form);
      return (
        (rawVocab.related_expressions || []).includes(e.canonical_form) ||
        (e.related_vocabulary || []).includes(rawVocab.canonical_form) ||
        normExp.includes(normWord)
      );
    })
    .slice(0, 10)
    .map(mapExpression);

  const examples = (data.examples || [])
    .filter((ex, i) => {
      const normFr = normalizeFrenchText(ex.french);
      return normFr.includes(normWord);
    })
    .slice(0, 10)
    .map((ex, i) => mapExample(ex, i));

  const relatedVerbs = (data.verbs || [])
    .filter((v) => {
      const normVerb = normalizeFrenchText(v.infinitive);
      return (
        (rawVocab.related_verbs || []).includes(v.infinitive) ||
        normVerb === normWord
      );
    })
    .slice(0, 6)
    .map(mapVerb);

  const relatedChapters = (data.chapters || [])
    .filter((ch) => (rawVocab.chapters || []).includes(ch.chapter_number))
    .map(mapChapter);

  return {
    vocab,
    expressions,
    examples,
    relatedVerbs,
    relatedChapters,
  };
}

// =======================================================================
// CHAPTERS SELECTORS
// =======================================================================

export function getChapters(): ChapterUI[] {
  const data = getMasterDataset();
  return (data.chapters || [])
    .map(mapChapter)
    .sort((a, b) => a.chapter_number - b.chapter_number);
}

export interface ChapterDetailWithGraph {
  chapter: ChapterUI;
  sections: Array<{ id: string; title: string; summary?: string | null }>;
  grammarRules: GrammarRuleUI[];
  verbs: VerbUI[];
  vocabulary: VocabUI[];
  expressions: ExpressionUI[];
  exercises: ExerciseUI[];
  examples: ExampleUI[];
}

export function getChapterById(chapterId: string): ChapterDetailWithGraph | null {
  const data = getMasterDataset();
  const rawId = chapterId;
  const decoded = safeDecode(chapterId);
  const rawChapter = (data.chapters || []).find(
    (c) =>
      makeChapterId(c.chapter_number) === rawId ||
      makeChapterId(c.chapter_number) === decoded ||
      String(c.chapter_number) === rawId ||
      String(c.chapter_number) === decoded ||
      `chapter_${c.chapter_number}` === rawId ||
      `chapter_${c.chapter_number}` === decoded
  );
  if (!rawChapter) return null;

  const chapter = mapChapter(rawChapter);
  const chNum = rawChapter.chapter_number;

  const sections = (rawChapter.sections || []).map((s, idx) => ({
    id: `sec_${chNum}_${idx + 1}`,
    title: s.title,
    summary: (s.key_points || []).join(". ") || null,
  }));

  const grammarRules = (data.grammar_rules || [])
    .filter((r) => (r.chapters || []).includes(chNum))
    .map(mapRule);

  const verbs = (data.verbs || [])
    .filter((v) => (v.chapters || []).includes(chNum))
    .map(mapVerb);

  const vocabulary = (data.vocabulary || [])
    .filter((vc) => (vc.chapters || []).includes(chNum))
    .map(mapVocab);

  const expressions = (data.expressions || [])
    .filter((e) => (e.chapters || []).includes(chNum))
    .map(mapExpression);

  const exercises = (data.exercises || [])
    .filter((ex) => ex.chapter_number === chNum)
    .map(mapExercise);

  const examples = (data.examples || [])
    .filter((ex) => (ex.chapters || []).includes(chNum))
    .map((ex, i) => mapExample(ex, i));

  return {
    chapter,
    sections,
    grammarRules,
    verbs,
    vocabulary,
    expressions,
    exercises,
    examples,
  };
}

// =======================================================================
// EXAMPLES SELECTORS
// =======================================================================

export interface ExampleFilterOptions {
  query?: string;
  chapterId?: string;
  verb?: string;
  tense?: string;
  grammarRule?: string;
  expression?: string;
  concept?: string;
  hasTranslation?: boolean;
  limit?: number;
  offset?: number;
}

export function getExamples(filters?: ExampleFilterOptions): { examples: ExampleUI[]; total: number } {
  const data = getMasterDataset();
  let list = (data.examples || []).map((ex, i) => mapExample(ex, i));

  if (filters?.query) {
    const q = normalizeFrenchText(filters.query);
    list = list.filter((ex) => {
      const fr = normalizeFrenchText(ex.french);
      const en = normalizeFrenchText(ex.english);
      return fr.includes(q) || en.includes(q);
    });
  }

  if (filters?.chapterId && filters.chapterId !== "all") {
    list = list.filter((ex) => ex.chapter_ids.includes(filters.chapterId!));
  }

  if (filters?.verb && filters.verb !== "all") {
    const v = normalizeFrenchText(filters.verb);
    list = list.filter((ex) =>
      ex.related_verbs.some((rv) => normalizeFrenchText(rv).includes(v)) ||
      normalizeFrenchText(ex.french).includes(v)
    );
  }

  if (filters?.tense && filters.tense !== "all") {
    const t = normalizeFrenchText(filters.tense);
    list = list.filter((ex) =>
      ex.related_tenses.some((rt) => normalizeFrenchText(rt).includes(t)) ||
      slugify(t) === slugify(filters.tense!)
    );
  }

  if (filters?.grammarRule && filters.grammarRule !== "all") {
    const gr = normalizeFrenchText(filters.grammarRule);
    list = list.filter((ex) =>
      ex.related_grammar_rules.some((rg) => normalizeFrenchText(rg).includes(gr))
    );
  }

  if (filters?.expression && filters.expression !== "all") {
    const exp = normalizeFrenchText(filters.expression);
    list = list.filter((ex) =>
      ex.related_expressions.some((re) => normalizeFrenchText(re).includes(exp))
    );
  }

  if (filters?.concept && filters.concept !== "all") {
    const c = normalizeFrenchText(filters.concept);
    list = list.filter((ex) =>
      ex.related_concepts.some((rc) => normalizeFrenchText(rc).includes(c))
    );
  }

  if (filters?.hasTranslation !== undefined) {
    list = list.filter((ex) =>
      filters.hasTranslation ? Boolean(ex.english && ex.english.trim()) : !ex.english
    );
  }

  const total = list.length;
  if (filters?.offset !== undefined || filters?.limit !== undefined) {
    const offset = filters.offset || 0;
    const limit = filters.limit || 50;
    list = list.slice(offset, offset + limit);
  }

  return { examples: list, total };
}

// =======================================================================
// EXERCISES SELECTORS
// =======================================================================

export interface ExerciseFilterOptions {
  query?: string;
  chapterId?: string;
  type?: string;
  limit?: number;
  offset?: number;
}

export function getExercises(filters?: ExerciseFilterOptions): { exercises: ExerciseUI[]; total: number } {
  const data = getMasterDataset();
  let list = (data.exercises || []).map(mapExercise);

  if (filters?.query) {
    const q = normalizeFrenchText(filters.query);
    list = list.filter((ex) => {
      const titleNorm = normalizeFrenchText(ex.title);
      const instNorm = normalizeFrenchText(ex.instructions);
      const codeNorm = normalizeFrenchText(ex.exercise_code);
      return titleNorm.includes(q) || instNorm.includes(q) || codeNorm.includes(q);
    });
  }

  if (filters?.chapterId && filters.chapterId !== "all") {
    list = list.filter((ex) => ex.chapter_id === filters.chapterId!);
  }

  if (filters?.type && filters.type !== "all") {
    list = list.filter((ex) => ex.exercise_type === filters.type);
  }

  const total = list.length;
  if (filters?.offset !== undefined || filters?.limit !== undefined) {
    const offset = filters.offset || 0;
    const limit = filters.limit || 50;
    list = list.slice(offset, offset + limit);
  }

  return { exercises: list, total };
}

export function getExerciseById(exerciseId: string): ExerciseUI | null {
  const data = getMasterDataset();
  const rawId = exerciseId;
  const decoded = safeDecode(exerciseId);
  const rawExercise = (data.exercises || []).find((ex) => {
    const code = ex.exercise_code.replace(/\./g, "_dot_");
    const id = `exercise_${slugify(code)}`;
    const legacyId = `exercise_${slugify(ex.exercise_code)}`;
    return (
      id === rawId ||
      id === decoded ||
      legacyId === rawId ||
      legacyId === decoded ||
      ex.exercise_code === rawId ||
      ex.exercise_code === decoded ||
      slugify(ex.exercise_code) === slugify(rawId) ||
      slugify(ex.exercise_code) === slugify(decoded)
    );
  });

  if (!rawExercise) return null;
  return mapExercise(rawExercise);
}

// =======================================================================
// EXCEPTIONS & TRAPS SELECTORS
// =======================================================================

export interface TrapFilterOptions {
  query?: string;
  category?: string;
  chapterId?: string;
  limit?: number;
  offset?: number;
}

export function getExceptionsAndTraps(filters?: TrapFilterOptions): { traps: ExceptionTrapUI[]; total: number } {
  const data = getMasterDataset();
  let list = (data.exceptions_and_traps || []).map(mapTrap);

  if (filters?.query) {
    const q = normalizeFrenchText(filters.query);
    list = list.filter((t) => {
      const titleNorm = normalizeFrenchText(t.title);
      const descNorm = normalizeFrenchText(t.description);
      return titleNorm.includes(q) || descNorm.includes(q);
    });
  }

  if (filters?.category && filters.category !== "all") {
    list = list.filter((t) => t.category.toLowerCase() === filters.category!.toLowerCase());
  }

  if (filters?.chapterId && filters.chapterId !== "all") {
    list = list.filter((t) => t.chapter_ids.includes(filters.chapterId!));
  }

  const total = list.length;
  if (filters?.offset !== undefined || filters?.limit !== undefined) {
    const offset = filters.offset || 0;
    const limit = filters.limit || 50;
    list = list.slice(offset, offset + limit);
  }

  return { traps: list, total };
}

// =======================================================================
// CONCEPTS SELECTORS
// =======================================================================

export function getConcepts(): ConceptUI[] {
  const data = getMasterDataset();
  const seenIds = new Set<string>();
  return (data.concepts || []).map((c, idx) => {
    let id = `concept_${slugify(c.name)}`;
    if (seenIds.has(id)) {
      const ch = c.chapters && c.chapters.length > 0 ? `ch${c.chapters[0]}` : String(idx + 1);
      id = `${id}_${ch}`;
    }
    seenIds.add(id);
    return mapConcept(c, id);
  });
}

export interface ConceptDetailWithGraph {
  concept: ConceptUI;
  grammarRules: GrammarRuleUI[];
  tenses: TenseUI[];
  verbs: VerbUI[];
  expressions: ExpressionUI[];
  vocabulary: VocabUI[];
  examples: ExampleUI[];
}

export function getConceptById(conceptId: string): ConceptDetailWithGraph | null {
  const data = getMasterDataset();
  const rawId = conceptId;
  const decoded = safeDecode(conceptId);
  const concepts = getConcepts();
  const foundConcept = concepts.find((c) => {
    return (
      c.id === rawId ||
      c.id === decoded ||
      c.name === rawId ||
      c.name === decoded ||
      slugify(c.name) === slugify(rawId) ||
      slugify(c.name) === slugify(decoded) ||
      rawId.startsWith(c.id) ||
      decoded.startsWith(c.id)
    );
  });

  if (!foundConcept) return null;

  const concept = foundConcept;
  const rawConcept = (data.concepts || []).find((c) => c.name === foundConcept.name) || (data.concepts || [])[0];
  const normName = normalizeFrenchText(rawConcept.name);

  const grammarRules = (data.grammar_rules || [])
    .filter((gr) =>
      (rawConcept.related_grammar_rules || []).includes(gr.rule_name) ||
      (gr.related_concepts || []).some((rc) => normalizeFrenchText(rc).includes(normName))
    )
    .slice(0, 15)
    .map(mapRule);

  const tenses = (data.tenses || [])
    .filter((t) =>
      (rawConcept.related_tenses || []).includes(t.name) ||
      normalizeFrenchText(t.name).includes(normName) ||
      (t.tags || []).some((tag) => normalizeFrenchText(tag).includes(normName))
    )
    .map(mapTense);

  const verbs = (data.verbs || [])
    .filter((v) =>
      (rawConcept.related_verbs || []).includes(v.infinitive) ||
      (v.related_concepts || []).some((rc) => normalizeFrenchText(rc).includes(normName))
    )
    .slice(0, 15)
    .map(mapVerb);

  const expressions = (data.expressions || [])
    .filter((e) =>
      (rawConcept.related_expressions || []).includes(e.canonical_form) ||
      (e.related_concepts || []).some((rc) => normalizeFrenchText(rc).includes(normName))
    )
    .slice(0, 15)
    .map(mapExpression);

  const vocabulary = (data.vocabulary || [])
    .filter((vocab) =>
      (rawConcept.related_vocabulary || []).includes(vocab.canonical_form) ||
      (vocab.related_concepts || []).some((rc) => normalizeFrenchText(rc).includes(normName))
    )
    .slice(0, 20)
    .map(mapVocab);

  const examples = (data.examples || [])
    .filter((ex) =>
      (ex.related_concepts || []).some((rc) => normalizeFrenchText(rc).includes(normName))
    )
    .slice(0, 10)
    .map((ex, i) => mapExample(ex, i));

  return {
    concept,
    grammarRules,
    tenses,
    verbs,
    expressions,
    vocabulary,
    examples,
  };
}
