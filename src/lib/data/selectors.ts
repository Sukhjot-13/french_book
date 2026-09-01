import { getDataset } from "./loader";
import {
  SuperDatasetRoot,
  Verb as RawVerb,
  Conjugation as RawConjugation,
  Expression as RawExpression,
  Vocabulary as RawVocabulary,
  GrammarRule as RawGrammarRule,
  Tense as RawTense,
  Chapter as RawChapter,
  Example as RawExample,
  Exercise as RawExercise,
} from "../dataset/schemas";
import { normalizeFrenchText } from "./search";

// =======================================================================
// UNIFIED UI DATA VIEW MODELS
// =======================================================================

export interface VerbUI {
  id: string;
  lemma: string;
  english: string;
  group: string;
  auxiliary: string;
  regularity: string;
  pronominal: boolean;
  past_participle?: string | null;
  present_participle?: string | null;
  priority: number;
  usefulness: number;
  difficulty: number;
  cefr?: string | null;
  register?: string | null;
  conjugation_ids: string[];
  expression_ids: string[];
  chapter_ids: string[];
}

export interface ConjugationUI {
  id: string;
  verb_id: string;
  tense_id: string;
  tense_name_fr?: string;
  tense_name_en?: string;
  mood?: string;
  je?: string | null;
  tu?: string | null;
  il_elle_on?: string | null;
  nous?: string | null;
  vous?: string | null;
  ils_elles?: string | null;
  notes?: string | null;
}

export interface ExpressionUI {
  id: string;
  french: string;
  english: string;
  literal_english?: string | null;
  type: string;
  register: string;
  strength?: string | null;
  base_verb_ids: string[];
  priority: number;
  cefr?: string | null;
  pattern?: string | null;
  chapter_ids: string[];
}

export interface VocabUI {
  id: string;
  french: string;
  english: string;
  part_of_speech: string;
  gender?: string | null;
  plural_form?: string | null;
  category?: string | null;
  priority: number;
  cefr?: string | null;
  chapter_ids: string[];
}

export interface GrammarRuleUI {
  id: string;
  title: string;
  title_fr?: string | null;
  category: string;
  explanation: string;
  formation_pattern?: string | null;
  exceptions: string[];
  priority: number;
  difficulty: number;
  cefr?: string | null;
  tense_ids: string[];
  verb_ids: string[];
  chapter_ids: string[];
}

export interface TenseUI {
  id: string;
  name_fr: string;
  name_en: string;
  mood: string;
  aspect?: string | null;
  formation_rule?: string | null;
  temporal_reference?: string | null;
}

export interface ChapterUI {
  id: string;
  chapter_number: number;
  title: string;
  subtitle?: string | null;
  summary?: string | null;
  page_start?: number | null;
  page_end?: number | null;
  rule_ids: string[];
  verb_ids: string[];
  vocab_ids: string[];
  expression_ids: string[];
  exercise_ids: string[];
}

export interface ExampleUI {
  id: string;
  french: string;
  english: string;
  literal_english?: string | null;
  related_verb_ids: string[];
  related_tense_ids: string[];
  related_rule_ids: string[];
  chapter_ids: string[];
}

export interface ExerciseUI {
  id: string;
  chapter_id: string;
  title: string;
  instructions: string;
  questions_count: number;
  questions: Array<{
    number: number | string;
    prompt: string;
    answer?: string | null;
  }>;
}

// =======================================================================
// NORMALIZATION HELPERS
// =======================================================================

function mapVerb(v: any): VerbUI {
  const english = Array.isArray(v.english) ? v.english.join(", ") : v.english || "";
  const cefr = typeof v.study?.cefr === "string" ? v.study.cefr : v.study?.cefr?.level || null;
  const chapterIds = (v.attestations || [])
    .map((a: any) => a.chapter_id)
    .filter(Boolean) as string[];

  return {
    id: v.id,
    lemma: v.infinitive || v.lemma || v.display_form || "",
    english,
    group: v.verb_group || v.group || "1st_group",
    auxiliary: v.auxiliary || v.auxiliary_verb || "avoir",
    regularity: v.regularity || "regular",
    pronominal: Boolean(v.pronominal || v.reflexive),
    past_participle: v.past_participle,
    present_participle: v.present_participle,
    priority: v.study?.learning_priority ?? 3,
    usefulness: v.study?.usefulness ?? 3,
    difficulty: v.study?.difficulty ?? 2,
    cefr,
    register: v.usage?.register || "neutral",
    conjugation_ids: v.conjugation_ids || [],
    expression_ids: v.expression_ids || [],
    chapter_ids: chapterIds,
  };
}

function mapConjugation(c: any, tenseMap?: Map<string, RawTense>): ConjugationUI {
  const forms = c.forms || {};
  const tInfo = tenseMap?.get(c.tense_id);

  return {
    id: c.id,
    verb_id: c.verb_id,
    tense_id: c.tense_id,
    tense_name_fr: tInfo?.name_french,
    tense_name_en: tInfo?.name_english,
    mood: tInfo?.mood,
    je: forms.je || forms["j'"] || c.je || null,
    tu: forms.tu || c.tu || null,
    il_elle_on: forms.il_elle_on || forms.il || c.il_elle_on || null,
    nous: forms.nous || c.nous || null,
    vous: forms.vous || c.vous || null,
    ils_elles: forms.ils_elles || forms.ils || c.ils_elles || null,
    notes: (c.irregularity_notes || []).concat(c.agreement_notes || []).join(". ") || null,
  };
}

function mapExpression(e: any): ExpressionUI {
  const english = Array.isArray(e.english) ? e.english.join("; ") : e.english || "";
  const cefr = typeof e.study?.cefr === "string" ? e.study.cefr : e.study?.cefr?.level || null;
  const chapterIds = (e.attestations || [])
    .map((a: any) => a.chapter_id)
    .filter(Boolean) as string[];

  return {
    id: e.id,
    french: e.canonical_form || e.french || "",
    english,
    literal_english: e.literal_english || null,
    type: e.expression_type || "verb_pattern",
    register: e.usage?.register || "neutral",
    strength: e.collocation_strength || null,
    base_verb_ids: e.base_verb_ids || [],
    priority: e.study?.learning_priority ?? 3,
    cefr,
    pattern: e.pattern || null,
    chapter_ids: chapterIds,
  };
}

function mapVocab(vc: any): VocabUI {
  const english = Array.isArray(vc.english) ? vc.english.join(", ") : vc.english || "";
  const cefr = typeof vc.study?.cefr === "string" ? vc.study.cefr : vc.study?.cefr?.level || null;
  const chapterIds = (vc.attestations || [])
    .map((a: any) => a.chapter_id)
    .filter(Boolean) as string[];

  return {
    id: vc.id,
    french: vc.canonical_form || vc.french || "",
    english,
    part_of_speech: vc.part_of_speech || "noun",
    gender: vc.noun?.gender || null,
    plural_form: vc.noun?.plural || null,
    category: vc.semantic_domains?.[0] || null,
    priority: vc.study?.learning_priority ?? 3,
    cefr,
    chapter_ids: chapterIds,
  };
}

function mapRule(r: any): GrammarRuleUI {
  const cefr = typeof r.study?.cefr === "string" ? r.study.cefr : r.study?.cefr?.level || null;
  const chapterIds = (r.attestations || [])
    .map((a: any) => a.chapter_id)
    .filter(Boolean) as string[];

  const formationPattern = r.formation?.patterns?.join(" | ") || null;

  return {
    id: r.id,
    title: r.title || "Grammar Rule",
    title_fr: r.short_label || null,
    category: r.grammar_category || "general",
    explanation: r.explanation || r.summary || "",
    formation_pattern: formationPattern,
    exceptions: r.exceptions || [],
    priority: r.study?.learning_priority ?? 3,
    difficulty: r.study?.difficulty ?? 2,
    cefr,
    tense_ids: r.tense_ids || [],
    verb_ids: r.verb_ids || [],
    chapter_ids: chapterIds,
  };
}

function mapTense(t: any): TenseUI {
  return {
    id: t.id,
    name_fr: t.name_french,
    name_en: t.name_english,
    mood: t.mood || "indicative",
    aspect: t.aspect_notes || null,
    formation_rule: t.summary || null,
    temporal_reference: t.time_reference?.join(", ") || null,
  };
}

function mapChapter(ch: any): ChapterUI {
  return {
    id: ch.id,
    chapter_number: ch.chapter_number,
    title: ch.title,
    subtitle: ch.tags?.[0] || null,
    summary: null,
    page_start: ch.source?.page_start_printed || null,
    page_end: ch.source?.page_end_printed || null,
    rule_ids: ch.grammar_rule_ids || [],
    verb_ids: ch.verb_ids || [],
    vocab_ids: ch.vocabulary_ids || [],
    expression_ids: ch.expression_ids || [],
    exercise_ids: ch.exercise_ids || [],
  };
}

function mapExample(ex: any): ExampleUI {
  const chapterIds = (ex.attestations || [])
    .map((a: any) => a.chapter_id)
    .filter(Boolean) as string[];

  return {
    id: ex.id,
    french: ex.french,
    english: ex.english,
    literal_english: ex.literal_english || null,
    related_verb_ids: ex.annotations?.focus_spans?.map((s: any) => s.text) || [],
    related_tense_ids: [],
    related_rule_ids: [],
    chapter_ids: chapterIds,
  };
}

// =======================================================================
// DASHBOARD & SUMMARY STATS
// =======================================================================

export interface DatasetHomeStats {
  verbsCount: number;
  regularVerbsCount: number;
  irregularVerbsCount: number;
  expressionsCount: number;
  vocabCount: number;
  grammarRulesCount: number;
  tensesCount: number;
  chaptersCount: number;
  examplesCount: number;
  exercisesCount: number;
  essentialPriorityCount: number;
  highPriorityCount: number;
}

export function getHomeStats(): DatasetHomeStats {
  const data = getDataset();
  const verbs = (data.verbs || []).map(mapVerb);
  const expressions = (data.expressions || []).map(mapExpression);
  const vocab = (data.vocabulary || []).map(mapVocab);
  const rules = (data.grammar_rules || []).map(mapRule);

  const regularVerbsCount = verbs.filter((v) => v.regularity === "regular").length;
  const irregularVerbsCount = verbs.filter((v) => v.regularity === "irregular").length;

  let essentialPriorityCount = 0;
  let highPriorityCount = 0;

  for (const v of verbs) {
    if (v.priority === 5) essentialPriorityCount++;
    if (v.priority === 4) highPriorityCount++;
  }
  for (const e of expressions) {
    if (e.priority === 5) essentialPriorityCount++;
    if (e.priority === 4) highPriorityCount++;
  }
  for (const vc of vocab) {
    if (vc.priority === 5) essentialPriorityCount++;
    if (vc.priority === 4) highPriorityCount++;
  }
  for (const r of rules) {
    if (r.priority === 5) essentialPriorityCount++;
    if (r.priority === 4) highPriorityCount++;
  }

  return {
    verbsCount: verbs.length,
    regularVerbsCount,
    irregularVerbsCount,
    expressionsCount: expressions.length,
    vocabCount: vocab.length,
    grammarRulesCount: rules.length,
    tensesCount: (data.tenses || []).length,
    chaptersCount: (data.chapters || []).length,
    examplesCount: (data.examples || []).length,
    exercisesCount: (data.exercises || []).length,
    essentialPriorityCount,
    highPriorityCount,
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
  priority?: number;
  limit?: number;
  offset?: number;
}

export function getVerbs(filters?: VerbFilterOptions): { verbs: VerbUI[]; total: number } {
  const data = getDataset();
  let list = (data.verbs || []).map(mapVerb);

  if (filters?.query) {
    const q = normalizeFrenchText(filters.query);
    list = list.filter((v) => {
      const lemma = normalizeFrenchText(v.lemma);
      const en = normalizeFrenchText(v.english);
      return lemma.includes(q) || en.includes(q);
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

  if (filters?.priority) {
    list = list.filter((v) => v.priority === filters.priority);
  }

  list = list.sort((a, b) => a.lemma.localeCompare(b.lemma, "fr"));

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
  conjugations: ConjugationUI[];
  expressions: ExpressionUI[];
  grammarRules: GrammarRuleUI[];
  examples: ExampleUI[];
  chapters: ChapterUI[];
}

export function getVerbById(verbId: string): VerbDetailWithGraph | null {
  const data = getDataset();
  const rawVerb = (data.verbs || []).find(
    (v) => v.id === verbId || normalizeFrenchText(v.infinitive) === normalizeFrenchText(verbId)
  );

  if (!rawVerb) return null;

  const verb = mapVerb(rawVerb);
  const tenseMap = new Map((data.tenses || []).map((t) => [t.id, t]));

  // Conjugations
  const conjugations = (data.conjugations || [])
    .filter((c) => c.verb_id === rawVerb.id)
    .map((c) => mapConjugation(c, tenseMap));

  // Expressions
  const expressions = (data.expressions || [])
    .filter(
      (e) =>
        (e.base_verb_ids || []).includes(rawVerb.id) ||
        normalizeFrenchText(e.canonical_form).includes(normalizeFrenchText(verb.lemma))
    )
    .map(mapExpression);

  // Grammar rules
  const grammarRules = (data.grammar_rules || [])
    .filter((r) => verb.chapter_ids.some((chId: string) => (r.attestations || []).some((a) => a.chapter_id === chId)))
    .map(mapRule);

  // Examples
  const normLemma = normalizeFrenchText(verb.lemma);
  const examples = (data.examples || [])
    .filter((ex) => normalizeFrenchText(ex.french).split(/\s+/).includes(normLemma))
    .map(mapExample);

  // Chapters
  const chapterIds = new Set(verb.chapter_ids);
  const chapters = (data.chapters || [])
    .filter((ch) => chapterIds.has(ch.id))
    .map(mapChapter);

  return {
    verb,
    conjugations,
    expressions,
    grammarRules,
    examples,
    chapters,
  };
}

// =======================================================================
// EXPRESSIONS SELECTORS
// =======================================================================

export interface ExpressionFilterOptions {
  query?: string;
  type?: string;
  register?: string;
  strength?: string;
  priority?: number;
  verbId?: string;
  limit?: number;
  offset?: number;
}

export function getExpressions(
  filters?: ExpressionFilterOptions
): { expressions: ExpressionUI[]; total: number } {
  const data = getDataset();
  let list = (data.expressions || []).map(mapExpression);

  if (filters?.query) {
    const q = normalizeFrenchText(filters.query);
    list = list.filter((e) => {
      const fr = normalizeFrenchText(e.french);
      const en = normalizeFrenchText(e.english);
      const lit = normalizeFrenchText(e.literal_english);
      return fr.includes(q) || en.includes(q) || lit.includes(q);
    });
  }

  if (filters?.type && filters.type !== "all") {
    list = list.filter((e) => e.type === filters.type);
  }

  if (filters?.register && filters.register !== "all") {
    list = list.filter((e) => e.register === filters.register);
  }

  if (filters?.strength && filters.strength !== "all") {
    list = list.filter((e) => e.strength === filters.strength);
  }

  if (filters?.priority) {
    list = list.filter((e) => e.priority === filters.priority);
  }

  if (filters?.verbId) {
    list = list.filter((e) => e.base_verb_ids.includes(filters.verbId!));
  }

  list = list.sort((a, b) => a.french.localeCompare(b.french, "fr"));

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
  primaryVerb: VerbUI | null;
  relatedVerbs: VerbUI[];
  examples: ExampleUI[];
  chapters: ChapterUI[];
}

export function getExpressionById(expressionId: string): ExpressionDetailWithGraph | null {
  const data = getDataset();
  const rawExp = (data.expressions || []).find((e) => e.id === expressionId);
  if (!rawExp) return null;

  const expression = mapExpression(rawExp);

  const baseVerbs = (data.verbs || [])
    .filter((v) => expression.base_verb_ids.includes(v.id))
    .map(mapVerb);

  const primaryVerb = baseVerbs[0] || null;
  const relatedVerbs = baseVerbs.slice(1);

  const normFr = normalizeFrenchText(expression.french);
  const examples = (data.examples || [])
    .filter((ex) => normalizeFrenchText(ex.french).includes(normFr))
    .map(mapExample);

  const chapterIds = new Set(expression.chapter_ids);
  const chapters = (data.chapters || [])
    .filter((ch) => chapterIds.has(ch.id))
    .map(mapChapter);

  return {
    expression,
    primaryVerb,
    relatedVerbs,
    examples,
    chapters,
  };
}

// =======================================================================
// VOCABULARY SELECTORS
// =======================================================================

export interface VocabFilterOptions {
  query?: string;
  pos?: string;
  gender?: string;
  category?: string;
  priority?: number;
  limit?: number;
  offset?: number;
}

export function getVocabulary(
  filters?: VocabFilterOptions
): { vocabulary: VocabUI[]; total: number } {
  const data = getDataset();
  let list = (data.vocabulary || []).map(mapVocab);

  if (filters?.query) {
    const q = normalizeFrenchText(filters.query);
    list = list.filter((item) => {
      const fr = normalizeFrenchText(item.french);
      const en = normalizeFrenchText(item.english);
      return fr.includes(q) || en.includes(q);
    });
  }

  if (filters?.pos && filters.pos !== "all") {
    list = list.filter((item) => item.part_of_speech === filters.pos);
  }

  if (filters?.gender && filters.gender !== "all") {
    list = list.filter((item) => item.gender === filters.gender);
  }

  if (filters?.category && filters.category !== "all") {
    list = list.filter((item) => item.category === filters.category);
  }

  if (filters?.priority) {
    list = list.filter((item) => item.priority === filters.priority);
  }

  list = list.sort((a, b) => a.french.localeCompare(b.french, "fr"));

  const total = list.length;
  if (filters?.offset !== undefined || filters?.limit !== undefined) {
    const offset = filters.offset || 0;
    const limit = filters.limit || 50;
    list = list.slice(offset, offset + limit);
  }

  return { vocabulary: list, total };
}

// =======================================================================
// GRAMMAR RULES SELECTORS
// =======================================================================

export interface GrammarFilterOptions {
  query?: string;
  priority?: number;
  difficulty?: number;
  limit?: number;
  offset?: number;
}

export function getGrammarRules(
  filters?: GrammarFilterOptions
): { rules: GrammarRuleUI[]; total: number } {
  const data = getDataset();
  let list = (data.grammar_rules || []).map(mapRule);

  if (filters?.query) {
    const q = normalizeFrenchText(filters.query);
    list = list.filter((r) => {
      const tEn = normalizeFrenchText(r.title);
      const tFr = normalizeFrenchText(r.title_fr);
      const exp = normalizeFrenchText(r.explanation);
      return tEn.includes(q) || tFr.includes(q) || exp.includes(q);
    });
  }

  if (filters?.priority) {
    list = list.filter((r) => r.priority === filters.priority);
  }

  if (filters?.difficulty) {
    list = list.filter((r) => r.difficulty === filters.difficulty);
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
  tenses: TenseUI[];
  verbs: VerbUI[];
  examples: ExampleUI[];
  exercises: ExerciseUI[];
  chapters: ChapterUI[];
}

export function getGrammarRuleById(ruleId: string): GrammarRuleDetailWithGraph | null {
  const data = getDataset();
  const rawRule = (data.grammar_rules || []).find((r) => r.id === ruleId);
  if (!rawRule) return null;

  const rule = mapRule(rawRule);

  const tenses = (data.tenses || [])
    .filter((t) => rule.tense_ids.includes(t.id))
    .map(mapTense);

  const verbs = (data.verbs || [])
    .filter((v) => rule.verb_ids.includes(v.id))
    .map(mapVerb);

  const examples = (data.examples || [])
    .filter((ex) => (rawRule.example_ids || []).includes(ex.id))
    .map(mapExample);

  const exercises = (data.exercises || [])
    .filter((ex) => (rawRule.exercise_ids || []).includes(ex.id))
    .map((ex: any) => ({
      id: ex.id,
      chapter_id: ex.chapter_id,
      title: (ex as any).title || `Exercise ${ex.id}`,
      instructions: ex.instructions_english || "",
      questions_count: (ex.questions || []).length,
      questions: (ex.questions || []).map((q: any, i: number) => ({
        number: q.question_number || i + 1,
        prompt: q.prompt || q.target_fr || "",
        answer: q.answer || null,
      })),
    }));

  const chapterIds = new Set(rule.chapter_ids);
  const chapters = (data.chapters || [])
    .filter((ch) => chapterIds.has(ch.id))
    .map(mapChapter);

  return {
    rule,
    tenses,
    verbs,
    examples,
    exercises,
    chapters,
  };
}

// =======================================================================
// TENSES SELECTORS
// =======================================================================

export function getTenses(): { tenses: TenseUI[]; total: number } {
  const data = getDataset();
  const list = (data.tenses || []).map(mapTense);
  return { tenses: list, total: list.length };
}

export interface TenseDetailWithGraph {
  tense: TenseUI;
  conjugations: ConjugationUI[];
  verbs: VerbUI[];
  grammarRules: GrammarRuleUI[];
  examples: ExampleUI[];
}

export function getTenseById(tenseId: string): TenseDetailWithGraph | null {
  const data = getDataset();
  const rawTense = (data.tenses || []).find((t) => t.id === tenseId);
  if (!rawTense) return null;

  const tense = mapTense(rawTense);
  const tenseMap = new Map((data.tenses || []).map((t) => [t.id, t]));

  const conjugations = (data.conjugations || [])
    .filter((c) => c.tense_id === rawTense.id)
    .map((c) => mapConjugation(c, tenseMap));

  const verbIds = new Set(conjugations.map((c) => c.verb_id));
  const verbs = (data.verbs || [])
    .filter((v) => verbIds.has(v.id))
    .map(mapVerb);

  const grammarRules = (data.grammar_rules || [])
    .filter((r) => (r.tense_ids || []).includes(rawTense.id))
    .map(mapRule);

  const examples = (data.examples || [])
    .filter((ex) => (rawTense.example_ids || []).includes(ex.id))
    .map(mapExample);

  return {
    tense,
    conjugations,
    verbs,
    grammarRules,
    examples,
  };
}

// =======================================================================
// CHAPTERS SELECTORS
// =======================================================================

export function getChapters(): ChapterUI[] {
  const data = getDataset();
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
  const data = getDataset();
  const rawChapter = (data.chapters || []).find(
    (c) => c.id === chapterId || String(c.chapter_number) === chapterId
  );
  if (!rawChapter) return null;

  const chapter = mapChapter(rawChapter);

  const sections = (data.sections || [])
    .filter((s) => s.chapter_id === rawChapter.id)
    .map((s) => ({
      id: s.id,
      title: s.title,
      summary: null,
    }));

  const grammarRules = (data.grammar_rules || [])
    .filter((r) => (chapter.rule_ids || []).includes(r.id) || (r.attestations || []).some((a) => a.chapter_id === rawChapter.id))
    .map(mapRule);

  const verbs = (data.verbs || [])
    .filter((v) => (chapter.verb_ids || []).includes(v.id) || (v.attestations || []).some((a) => a.chapter_id === rawChapter.id))
    .map(mapVerb);

  const vocabulary = (data.vocabulary || [])
    .filter((vc) => (chapter.vocab_ids || []).includes(vc.id) || (vc.attestations || []).some((a) => a.chapter_id === rawChapter.id))
    .map(mapVocab);

  const expressions = (data.expressions || [])
    .filter((e) => (chapter.expression_ids || []).includes(e.id) || (e.attestations || []).some((a) => a.chapter_id === rawChapter.id))
    .map(mapExpression);

  const exercises = (data.exercises || [])
    .filter((ex) => ex.chapter_id === rawChapter.id || (chapter.exercise_ids || []).includes(ex.id))
    .map((ex: any) => ({
      id: ex.id,
      chapter_id: ex.chapter_id,
      title: (ex as any).title || `Exercise ${ex.id}`,
      instructions: ex.instructions_english || "",
      questions_count: (ex.questions || []).length,
      questions: (ex.questions || []).map((q: any, i: number) => ({
        number: q.question_number || i + 1,
        prompt: q.prompt || q.target_fr || "",
        answer: q.answer || null,
      })),
    }));

  const examples = (data.examples || [])
    .filter((ex) => (ex.attestations || []).some((a) => a.chapter_id === rawChapter.id))
    .map(mapExample);

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
  tenseId?: string;
  verbId?: string;
  ruleId?: string;
  chapterId?: string;
  limit?: number;
  offset?: number;
}

export function getExamples(
  filters?: ExampleFilterOptions
): { examples: ExampleUI[]; total: number } {
  const data = getDataset();
  let list = (data.examples || []).map(mapExample);

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

  const total = list.length;
  if (filters?.offset !== undefined || filters?.limit !== undefined) {
    const offset = filters.offset || 0;
    const limit = filters.limit || 50;
    list = list.slice(offset, offset + limit);
  }

  return { examples: list, total };
}
