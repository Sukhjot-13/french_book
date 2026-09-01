import fs from "fs";
import path from "path";
import { Chapter, Exercise, Expression, Section, Verb, Vocabulary } from "../../src/lib/dataset/schemas";
import { makeExpressionId, makeVocabId } from "../../src/lib/dataset/ids";
import { canonicalizeExpressions, canonicalizeVocabulary, mergeAttestations } from "../../src/lib/dataset/canonicalize";

export type ExerciseExpressionDisposition = "promoted" | "merged_existing" | "held_for_review" | "rejected";

export interface ExerciseExpressionCandidate {
  canonical_form: string;
  type_hypothesis: "verb_noun_collocation" | "productive_verb_pattern" | "fixed_formulaic_phrase" | "fixed_expression";
  base_verb_id?: string;
  noun?: string;
  evidence: Array<{
    exercise_id: string;
    question_id: string;
    chapter_id: string;
    chapter_number: number | null;
    page_printed: number | null;
    source: "prompt" | "answer";
    source_anchor: string;
    context: string;
  }>;
  translation_evidence: Array<{ english: string; french: string; question_id: string }>;
  existing_expression_id?: string;
  luna_disposition?: string;
  reviewed_approval?: ReviewedApproval;
  disposition?: ExerciseExpressionDisposition;
  reason?: string;
}

export interface ExercisePromotionResult {
  expressions: Expression[];
  vocabulary: Vocabulary[];
  candidates: ExerciseExpressionCandidate[];
  promoted: string[];
  merged_existing: string[];
  held_for_review: string[];
  rejected: string[];
}

interface LunaCandidate {
  normalized_candidate: string;
  type_hypothesis: string;
  disposition: string;
  translation_evidence?: Array<{ question_id: string; english_source: string; french_source: string }>;
}

interface ReviewedApproval {
  canonical_form: string;
  english: string[];
  expression_type: "verb_pattern" | "collocation" | "formulaic_phrase" | "fixed_expression";
}

const DEFAULT_LUNA_REPORT = path.resolve(__dirname, "../../data/reports/exercise-expression-candidates.json");
const DEFAULT_REVIEWED_APPROVALS = path.resolve(__dirname, "../../data/reports/sol-reviewed-expression-approvals.json");
const FRENCH_DETERMINERS = new Set(["un", "une", "le", "la", "les", "du", "des", "de", "ce", "cet", "cette", "ces", "mon", "ma", "mes", "ton", "ta", "tes", "son", "sa", "ses", "notre", "nos", "votre", "vos", "leur", "leurs"]);
const FRENCH_FILLERS = new Set(["ne", "pas", "plus", "jamais", "bien", "très", "si", "que", "qu", "de", "d", "à", "a", "en", "y", "lui", "leur", "me", "te", "se", "nous", "vous", "il", "elle", "ils", "elles", "on"]);
const FRENCH_ADJECTIVE_LIKE = new Set(["meilleur", "meilleure", "bon", "bonne", "grand", "grande", "long", "longue", "petit", "petite", "jeune", "vieux", "vieille", "nouveau", "nouvelle"]);
const SPILL_MARKERS = /\b(?:practice makes perfect|remember that|all the pronouns|the passive voice|the present subjunctive|pot pourri)\b/i;
// Extracted exercises occasionally run into the next bilingual section heading (for example,
// "Avoir beau and quitte à").  A title-cased French phrase joined to an English `and` is a
// structural boundary, never part of the preceding exercise response.
const BILINGUAL_HEADING_BOUNDARY = /\b[A-ZÀ-Ý][\p{L}’'-]+(?:\s+[\p{L}’'-]+){0,2}\s+and\s+[\p{L}’'-]+/u;

function normalize(text: string): string {
  return text
    .normalize("NFC")
    .replace(/[’`]/g, "'")
    .replace(/[—–]/g, "-")
    .replace(/\s+/g, " ")
    .trim()
    .toLocaleLowerCase("fr");
}

function ascii(text: string): string {
  return normalize(text).normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

function cleanExerciseText(text: string): string {
  const compact = text.replace(/[()]/g, " ").replace(/\u0001/g, " ");
  const boundaries = [compact.search(SPILL_MARKERS), compact.search(BILINGUAL_HEADING_BOUNDARY)].filter((index) => index >= 0);
  const boundary = boundaries.length ? Math.min(...boundaries) : -1;
  return (boundary >= 0 ? compact.slice(0, boundary) : compact).replace(/\s+/g, " ").trim();
}

function tokens(text: string): string[] {
  return normalize(text).match(/[\p{L}]+(?:'[\p{L}]+)?/gu) || [];
}

function exercisePage(exercise: Exercise): number | null {
  return exercise.attestations.find((a) => a.page_printed)?.page_printed ?? null;
}

function exerciseChapterNumber(exercise: Exercise): number | null {
  const attested = exercise.attestations.find((a) => a.chapter_number)?.chapter_number;
  return attested ?? (Number(exercise.chapter_id.replace("chapter_", "")) || null);
}

function buildVerbForms(verbs: Verb[], conjugations: Array<{ verb_id: string; forms: Record<string, string | null> }>, knownVerbIds: string[] = []): Map<string, { id: string; infinitive: string }> {
  const result = new Map<string, { id: string; infinitive: string }>();
  const verbsById = new Map(verbs.map((verb) => [verb.id, verb]));
  for (const verb of verbs) result.set(normalize(verb.infinitive), { id: verb.id, infinitive: normalize(verb.infinitive) });
  for (const id of knownVerbIds) {
    if (!id.startsWith("verb_")) continue;
    const infinitive = normalize(id.replace(/^verb_/, "").replace(/_/g, " "));
    if (!result.has(infinitive)) result.set(infinitive, { id, infinitive });
  }
  for (const conjugation of conjugations) {
    const verb = verbsById.get(conjugation.verb_id);
    if (!verb) continue;
    for (const form of Object.values(conjugation.forms || {})) {
      // A conjugation cell may include a subject pronoun ("nous prenons").  Register only
      // its final lexical token; registering every token turns subjects into false verb forms.
      const token = tokens(form || "").at(-1);
      if (token) result.set(token, { id: verb.id, infinitive: normalize(verb.infinitive) });
    }
  }
  return result;
}

function looksFrench(text: string, verbForms: Map<string, unknown>): boolean {
  const sourceTokens = tokens(text);
  return sourceTokens.some((token) => verbForms.has(token) || FRENCH_DETERMINERS.has(token) || token === "que" || token === "à");
}

function chooseCanonicalDeterminer(determiners: string[]): string {
  return [...determiners].sort((a, b) => {
    const aRank = ["un", "une", "le", "la"].indexOf(a);
    const bRank = ["un", "une", "le", "la"].indexOf(b);
    return (aRank < 0 ? 99 : aRank) - (bRank < 0 ? 99 : bRank);
  })[0] || "";
}

function nounGender(determiner: string): "masculine" | "feminine" | null {
  if (["une", "la", "cette", "ma", "ta", "sa"].includes(determiner)) return "feminine";
  if (["un", "le", "cet", "ce", "mon", "ton", "son"].includes(determiner)) return "masculine";
  return null;
}

function formulaicCanonical(rawTokens: string[], index: number, verbForms: Map<string, unknown>): string | null {
  const one = rawTokens[index];
  const two = `${one || ""} ${rawTokens[index + 1] || ""}`.trim();
  const three = `${two} ${rawTokens[index + 2] || ""}`.trim();
  // A verb+preposition construction is handled by the productive-pattern detector.  Here,
  // restrict the generic formula detector to non-verbal discourse/formula heads such as
  // "quitte à"; otherwise ordinary verb frames would be misclassified as formulas.
  if (!verbForms.has(one) && rawTokens[index + 1] === "à" && verbForms.has(rawTokens[index + 2])) return `${two} + infinitif`;
  if (["quoi", "qui", "où"].includes(one) && rawTokens[index + 1] === "que") return `${two} + clause`;
  if ((one === "quel" || one === "quelle" || one === "quels" || one === "quelles") && rawTokens[index + 1] === "que" && verbForms.has(rawTokens[index + 2])) {
    return `${three} + noun`;
  }
  return null;
}

function candidateKey(candidate: Pick<ExerciseExpressionCandidate, "canonical_form" | "type_hypothesis">): string {
  if (candidate.type_hypothesis === "verb_noun_collocation") {
    const words = normalize(candidate.canonical_form).split(" ");
    return `${candidate.type_hypothesis}:${words[0]}:${words.at(-1)}`;
  }
  return `${candidate.type_hypothesis}:${normalize(candidate.canonical_form)}`;
}

function loadLunaEvidence(reportPath = DEFAULT_LUNA_REPORT): Map<string, LunaCandidate> {
  if (!fs.existsSync(reportPath)) return new Map();
  const report = JSON.parse(fs.readFileSync(reportPath, "utf-8"));
  const entries: LunaCandidate[] = Array.isArray(report.candidates) ? report.candidates : [];
  return new Map(entries.map((entry) => [normalize(entry.normalized_candidate), entry]));
}

function loadReviewedApprovals(reportPath = DEFAULT_REVIEWED_APPROVALS): Map<string, ReviewedApproval> {
  if (!fs.existsSync(reportPath)) return new Map();
  const report = JSON.parse(fs.readFileSync(reportPath, "utf-8"));
  const approvals: ReviewedApproval[] = Array.isArray(report.approved) ? report.approved : [];
  return new Map(approvals.map((approval) => [normalize(approval.canonical_form), approval]));
}

function translationEvidence(question: Exercise["questions"][number]): { english: string; french: string } | null {
  const prompt = cleanExerciseText(question.prompt || "");
  const answer = cleanExerciseText(question.answer || "");
  if (!answer) return null;
  const promptLooksFrench = /[àâçéèêëîïôûùüÿœ]|\b(?:je|tu|nous|vous|il|elle|le|la|une|un|que)\b/i.test(prompt);
  const answerLooksFrench = /[àâçéèêëîïôûùüÿœ]|\b(?:je|tu|nous|vous|il|elle|le|la|une|un|que)\b/i.test(answer);
  if (!promptLooksFrench && answerLooksFrench) return { english: prompt, french: answer };
  if (promptLooksFrench && !answerLooksFrench) return { english: answer, french: prompt };
  return null;
}

/**
 * Discover candidate constructions from exercise prompts and reconciled answers.  This deliberately
 * records candidates first; promotion happens in a separate conservative pass below.
 */
export function discoverExerciseExpressionCandidates(
  exercises: Exercise[],
  verbs: Verb[],
  conjugations: Array<{ verb_id: string; forms: Record<string, string | null> }>,
  knownVerbIds: string[] = [],
  lunaReportPath = DEFAULT_LUNA_REPORT,
): ExerciseExpressionCandidate[] {
  const verbForms = buildVerbForms(verbs, conjugations, knownVerbIds);
  const grouped = new Map<string, ExerciseExpressionCandidate & { determiners?: string[] }>();
  const luna = loadLunaEvidence(lunaReportPath);

  const add = (candidate: ExerciseExpressionCandidate, determiner?: string) => {
    const key = candidateKey(candidate);
    const existing = grouped.get(key);
    if (existing) {
      existing.evidence.push(...candidate.evidence);
      existing.translation_evidence.push(...candidate.translation_evidence);
      if (determiner) existing.determiners?.push(determiner);
      return;
    }
    grouped.set(key, { ...candidate, determiners: determiner ? [determiner] : [] });
  };

  for (const exercise of exercises) {
    const chapterNumber = exerciseChapterNumber(exercise);
    const pagePrinted = exercisePage(exercise);
    for (const question of exercise.questions) {
      const translated = translationEvidence(question);
      for (const source of ["prompt", "answer"] as const) {
        const original = source === "prompt" ? question.prompt : question.answer || "";
        const clean = cleanExerciseText(original);
        if (!clean || !looksFrench(clean, verbForms)) continue;
        const sourceTokens = tokens(clean);
        const evidenceBase = {
          exercise_id: exercise.id,
          question_id: question.question_id,
          chapter_id: exercise.chapter_id,
          chapter_number: chapterNumber,
          page_printed: pagePrinted,
          source,
          source_anchor: `${question.question_id}:${source}`,
          context: clean.slice(0, 240),
        } as const;

        for (let index = 0; index < sourceTokens.length; index++) {
          const form = verbForms.get(sourceTokens[index]);
          if (form) {
            const next = sourceTokens[index + 1];
            const nextVerb = verbForms.get(next);
            const followingVerb = verbForms.get(sourceTokens[index + 2]);
            if ((next === "à" || next === "de") && followingVerb) {
              add({
                canonical_form: `${form.infinitive} ${next} + infinitif`,
                type_hypothesis: "productive_verb_pattern",
                base_verb_id: form.id,
                evidence: [evidenceBase],
                translation_evidence: translated ? [{ ...translated, question_id: question.question_id }] : [],
              });
            } else if (nextVerb && !FRENCH_FILLERS.has(next)) {
              add({
                canonical_form: `${form.infinitive} + infinitif`,
                type_hypothesis: "productive_verb_pattern",
                base_verb_id: form.id,
                evidence: [evidenceBase],
                translation_evidence: translated ? [{ ...translated, question_id: question.question_id }] : [],
              });
            }

            if (FRENCH_DETERMINERS.has(next)) {
              const nounTokens = sourceTokens.slice(index + 2, index + 5)
                .filter((token) => !FRENCH_FILLERS.has(token) && !verbForms.has(token));
              // Prefer the first non-adjectival noun after the determiner.  Looking farther
              // ahead crosses complements ("cette décision sans toi") and creates accidental
              // adjacency candidates from the final pronoun.
              const noun = nounTokens.find((token) => !FRENCH_ADJECTIVE_LIKE.has(token));
              if (noun && noun.length > 1) {
                add({
                  canonical_form: `${form.infinitive} ${next} ${noun}`,
                  type_hypothesis: "verb_noun_collocation",
                  base_verb_id: form.id,
                  noun,
                  evidence: [evidenceBase],
                  translation_evidence: translated ? [{ ...translated, question_id: question.question_id }] : [],
                }, next);
              }
            }
          }

          const formula = formulaicCanonical(sourceTokens, index, verbForms);
          if (formula) {
            add({
              canonical_form: formula,
              type_hypothesis: "fixed_formulaic_phrase",
              evidence: [evidenceBase],
              translation_evidence: translated ? [{ ...translated, question_id: question.question_id }] : [],
            });
          }
        }
      }
    }
  }

  return Array.from(grouped.values()).map((candidate) => {
    if (candidate.type_hypothesis === "verb_noun_collocation" && candidate.noun) {
      const determiner = chooseCanonicalDeterminer(candidate.determiners || []);
      candidate.canonical_form = `${candidate.base_verb_id ? normalize(verbs.find((verb) => verb.id === candidate.base_verb_id)?.infinitive || "") : ""} ${determiner} ${candidate.noun}`.trim();
    }
    const lunar = luna.get(normalize(candidate.canonical_form));
    candidate.luna_disposition = lunar?.disposition;
    // Luna's report is audit evidence, not an allowlist: it can only make a discovered
    // candidate more conservative (for example, a Sol-review hold) or refine its class.
    if (lunar?.type_hypothesis === "fixed_expression") candidate.type_hypothesis = "fixed_expression";
    for (const translation of lunar?.translation_evidence || []) {
      candidate.translation_evidence.push({ english: translation.english_source, french: translation.french_source, question_id: translation.question_id });
    }
    candidate.evidence = candidate.evidence.filter((value, index, all) => all.findIndex((other) => other.source_anchor === value.source_anchor) === index);
    candidate.translation_evidence = candidate.translation_evidence.filter((value, index, all) => all.findIndex((other) => other.question_id === value.question_id && other.english === value.english) === index);
    delete candidate.determiners;
    return candidate;
  });
}

function normalizedExpressionIdentity(expression: Expression): string {
  return normalize(expression.canonical_form)
    .replace(/\[(?:[^\]]+)\]/g, "")
    .replace(/\+/g, "")
    .replace(/\s+(?:infinitif|noun|clause)\b/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function candidateExpressionIdentity(candidate: ExerciseExpressionCandidate): string {
  return normalize(candidate.canonical_form).replace(/\+/g, "").replace(/\s+(?:infinitif|noun|clause)\b/g, "").replace(/\s+/g, " ").trim();
}

function findExistingExpression(candidate: ExerciseExpressionCandidate, expressions: Expression[]): Expression | undefined {
  const expected = candidateExpressionIdentity(candidate);
  return expressions.find((expression) => normalizedExpressionIdentity(expression) === expected);
}

function hasDirectNounTranslation(candidate: ExerciseExpressionCandidate): boolean {
  if (!candidate.noun) return false;
  const nounAscii = ascii(candidate.noun);
  return candidate.translation_evidence.some((evidence) => new RegExp(`\\b${nounAscii}\\b`, "i").test(ascii(evidence.english)));
}

function genericSlotType(canonicalForm: string): { name: string; display: string; type: string; token: string } | null {
  if (/\+ infinitif$/.test(canonicalForm)) return { name: "action", display: "infinitif", type: "verb_infinitive", token: "INFINITIVE" };
  if (/\+ noun$/.test(canonicalForm)) return { name: "noun", display: "nom", type: "noun_phrase", token: "NOUN" };
  if (/\+ clause$/.test(canonicalForm)) return { name: "clause", display: "proposition", type: "clause", token: "CLAUSE" };
  return null;
}

function sharedEnglishNgram(translations: string[]): string | null {
  const tokenLists = translations.map((translation) => (translation.toLowerCase().match(/[a-z]+/g) || []));
  if (tokenLists.length === 0 || tokenLists.some((tokens) => tokens.length === 0)) return null;
  const candidateCounts = new Map<string, number>();
  for (const tokens of tokenLists) {
    const inThisTranslation = new Set<string>();
    for (let length = 1; length <= Math.min(5, tokens.length); length++) {
      for (let index = 0; index <= tokens.length - length; index++) inThisTranslation.add(tokens.slice(index, index + length).join(" "));
    }
    for (const ngram of inThisTranslation) candidateCounts.set(ngram, (candidateCounts.get(ngram) || 0) + 1);
  }
  const minimum = translations.length > 1 ? 2 : 1;
  return Array.from(candidateCounts)
    .filter(([, count]) => count >= minimum)
    .filter(([ngram]) => /[a-z]/.test(ngram))
    .sort(([a, aCount], [b, bCount]) => bCount - aCount || b.split(" ").length - a.split(" ").length || a.localeCompare(b))[0]?.[0] || null;
}

function conciseFormulaEnglish(candidate: ExerciseExpressionCandidate): string[] {
  const slot = genericSlotType(candidate.canonical_form);
  if (!slot) return [];
  const shared = sharedEnglishNgram(candidate.translation_evidence.map((evidence) => evidence.english));
  if (!shared) return [];
  // For clause and noun formulas, a shared lead word is safer than retaining a concrete
  // subject/example.  For infinitive formulas, preserve a shared multiword connective.
  const concise = slot.type === "verb_infinitive" ? shared : shared.split(" ")[0];
  return concise ? [`${concise} [${slot.token.toLowerCase()}]`] : [];
}

function englishForCandidate(candidate: ExerciseExpressionCandidate): string[] {
  if (candidate.reviewed_approval) return candidate.reviewed_approval.english;
  if (candidate.type_hypothesis === "fixed_formulaic_phrase") return conciseFormulaEnglish(candidate);
  const evidence = candidate.noun
    ? candidate.translation_evidence.find((item) => new RegExp(`\\b${ascii(candidate.noun!)}\\b`, "i").test(ascii(item.english))) || candidate.translation_evidence[0]
    : candidate.translation_evidence[0];
  if (!evidence) return [];
  if (candidate.noun) {
    const nounAscii = ascii(candidate.noun);
    const englishWords = evidence.english.match(/[A-Za-z]+/g) || [];
    const index = englishWords.findIndex((word) => word.toLowerCase() === nounAscii);
    if (index > 0) {
      const verb = englishWords.slice(0, index).filter((word) => !/^(i|you|he|she|we|they|him|her|them|this|that|the|a|an)$/i.test(word)).at(-1);
      return verb ? [`to ${verb.toLowerCase()} a ${nounAscii}`] : [nounAscii];
    }
  }
  return [];
}

function makeAttestations(candidate: ExerciseExpressionCandidate) {
  return candidate.evidence.map((evidence) => ({
    source_type: "book" as const,
    chapter_number: evidence.chapter_number,
    chapter_id: evidence.chapter_id,
    page_printed: evidence.page_printed,
    context_type: "exercise_question" as const,
    exercise_id: evidence.exercise_id,
    source_anchor: evidence.source_anchor,
    notes: evidence.context,
  }));
}

function promoteVocabulary(candidate: ExerciseExpressionCandidate, vocabulary: Vocabulary[]): Vocabulary | undefined {
  if (!candidate.noun || !hasDirectNounTranslation(candidate)) return undefined;
  const noun = candidate.noun;
  const id = makeVocabId(noun);
  const existing = vocabulary.find((item) => item.id === id || normalize(item.canonical_form) === normalize(noun));
  if (existing) return existing;
  const articleSource = candidate.canonical_form.split(" ")[1] || "";
  const gender = nounGender(articleSource);
  if (!gender) return undefined;
  return {
    id,
    type: "vocabulary",
    canonical_form: noun,
    display_form: `${gender === "feminine" ? "la" : "le"} ${noun}`,
    french: noun,
    english: [ascii(noun)],
    part_of_speech: "noun",
    noun: { gender, article: gender === "feminine" ? "la" : "le", plural: null, countability: null },
    adjective: null,
    adverb: null,
    senses: [{ sense_id: `${id}_s1`, english: [ascii(noun)], usage_contexts: [], example_ids: [] }],
    semantic_domains: [],
    word_family_ids: [],
    collocation_expression_ids: [],
    false_friend: false,
    cognate: false,
    study: { learning_priority: 3, usefulness: 3, difficulty: 2, cefr: null },
    usage: { register: "neutral", spoken_written: "both", contexts: [] },
    frequency: { book_occurrences: 0, book_frequency_tier: null, real_world_frequency: null, real_world_frequency_source: null },
    origin: { source_type: "derived_from_book", created_by: "exercise_expression_promotion", derived_from_ids: [] },
    attestations: makeAttestations(candidate),
    tags: ["exercise_derived", "collocation_vocabulary"],
  };
}

/** Promote only candidates that meet source, recurrence, and relation requirements. */
export function promoteExerciseExpressionCandidates(args: {
  exercises: Exercise[];
  expressions: Expression[];
  vocabulary: Vocabulary[];
  verbs: Verb[];
  conjugations: Array<{ verb_id: string; forms: Record<string, string | null> }>;
  chapters: Chapter[];
  sections: Section[];
  lunaReportPath?: string;
  reviewedApprovalsPath?: string;
}): ExercisePromotionResult {
  const hasLunaAudit = fs.existsSync(args.lunaReportPath || DEFAULT_LUNA_REPORT);
  const candidates = discoverExerciseExpressionCandidates(
    args.exercises,
    args.verbs,
    args.conjugations,
    [
      ...args.expressions.flatMap((expression) => expression.base_verb_ids),
      ...args.exercises.flatMap((exercise) => exercise.questions.flatMap((question) => question.relations?.verbs || [])),
    ],
    args.lunaReportPath,
  );
  const reviewedApprovals = loadReviewedApprovals(args.reviewedApprovalsPath);
  for (const candidate of candidates) candidate.reviewed_approval = reviewedApprovals.get(normalize(candidate.canonical_form));
  const expressions = [...args.expressions];
  const vocabulary = [...args.vocabulary];
  const promoted: string[] = [];
  const mergedExisting: string[] = [];
  const heldForReview: string[] = [];
  const rejected: string[] = [];

  const linkCandidate = (candidate: ExerciseExpressionCandidate, expression: Expression, vocab?: Vocabulary) => {
    expression.attestations = mergeAttestations(expression.attestations, makeAttestations(candidate));
    expression.relations = { ...expression.relations, exercises: Array.from(new Set([...(expression.relations?.exercises || []), ...candidate.evidence.map((e) => e.exercise_id)])) };
    if (candidate.base_verb_id) expression.base_verb_ids = Array.from(new Set([...expression.base_verb_ids, candidate.base_verb_id]));
    if (vocab) {
      expression.related_vocabulary_ids = Array.from(new Set([...expression.related_vocabulary_ids, vocab.id]));
      vocab.collocation_expression_ids = Array.from(new Set([...vocab.collocation_expression_ids, expression.id]));
    }
    for (const evidence of candidate.evidence) {
      const exercise = args.exercises.find((item) => item.id === evidence.exercise_id);
      const question = exercise?.questions.find((item) => item.question_id === evidence.question_id);
      if (!question) continue;
      question.relations = question.relations || {};
      question.relations.expressions = Array.from(new Set([...(question.relations.expressions || []), expression.id]));
      if (vocab) question.relations.vocabulary = Array.from(new Set([...(question.relations.vocabulary || []), vocab.id]));
    }
    for (const chapterId of new Set(candidate.evidence.map((e) => e.chapter_id))) {
      const chapter = args.chapters.find((item) => item.id === chapterId);
      if (chapter) chapter.expression_ids = Array.from(new Set([...chapter.expression_ids, expression.id]));
      for (const section of args.sections.filter((section) => section.chapter_id === chapterId && candidate.evidence.some((e) => section.exercise_ids.includes(e.exercise_id)))) {
        section.expression_ids = Array.from(new Set([...section.expression_ids, expression.id]));
      }
    }
  };

  for (const candidate of candidates) {
    const questionCount = new Set(candidate.evidence.map((e) => e.question_id)).size;
    const existing = findExistingExpression(candidate, expressions);
    if (candidate.luna_disposition === "sol_review" && !candidate.reviewed_approval) {
      candidate.disposition = "held_for_review";
      candidate.reason = "Luna marked the source evidence sol_review; promotion intentionally does not guess.";
      heldForReview.push(candidate.canonical_form);
      continue;
    }
    if (candidate.luna_disposition === "reject") {
      candidate.disposition = "rejected";
      candidate.reason = "The independent mechanical audit classified this as an ordinary compositional pair.";
      rejected.push(candidate.canonical_form);
      continue;
    }
    if (existing) {
      const noun = candidate.noun;
      linkCandidate(candidate, existing, noun ? vocabulary.find((item) => normalize(item.canonical_form) === normalize(noun)) : undefined);
      candidate.existing_expression_id = existing.id;
      candidate.disposition = "merged_existing";
      candidate.reason = "Canonical identity and expression type resolve to an existing source-backed expression.";
      mergedExisting.push(existing.id);
      continue;
    }
    if (candidate.type_hypothesis === "productive_verb_pattern" && !candidate.reviewed_approval) {
      candidate.disposition = "held_for_review";
      candidate.reason = "A new productive pattern needs explicit source pattern support; exercise recurrence alone is insufficient.";
      heldForReview.push(candidate.canonical_form);
      continue;
    }
    if (candidate.type_hypothesis === "verb_noun_collocation" && hasLunaAudit && candidate.luna_disposition !== "clear_new" && !candidate.reviewed_approval) {
      candidate.disposition = "held_for_review";
      candidate.reason = "The available exercise audit does not provide a clear-new collocation disposition.";
      heldForReview.push(candidate.canonical_form);
      continue;
    }
    if (candidate.type_hypothesis === "fixed_formulaic_phrase" && candidate.luna_disposition !== "clear_new" && !candidate.reviewed_approval) {
      candidate.disposition = "held_for_review";
      candidate.reason = "A formulaic candidate needs explicit source-pattern evidence; recurrence alone is insufficient.";
      heldForReview.push(candidate.canonical_form);
      continue;
    }
    if (questionCount < 2 && !candidate.reviewed_approval) {
      candidate.disposition = "rejected";
      candidate.reason = "Singleton exercise evidence without explicit pattern support is not promoted.";
      rejected.push(candidate.canonical_form);
      continue;
    }
    const noun = candidate.noun;
    const vocabularyItem = noun
      ? vocabulary.find((item) => normalize(item.canonical_form) === normalize(noun)) || promoteVocabulary(candidate, vocabulary)
      : undefined;
    if (candidate.type_hypothesis === "verb_noun_collocation" && !vocabularyItem) {
      candidate.disposition = "held_for_review";
      candidate.reason = "The noun lacks a source-supported canonical vocabulary record with gender/article and English meaning.";
      heldForReview.push(candidate.canonical_form);
      continue;
    }
    if (vocabularyItem && !vocabulary.some((item) => item.id === vocabularyItem.id)) vocabulary.push(vocabularyItem);
    const english = englishForCandidate(candidate);
    if (candidate.type_hypothesis !== "fixed_formulaic_phrase" && english.length === 0) {
      candidate.disposition = "held_for_review";
      candidate.reason = "No direct exercise translation supports a learner-facing English meaning.";
      heldForReview.push(candidate.canonical_form);
      continue;
    }
    const type = candidate.reviewed_approval?.expression_type || (candidate.type_hypothesis === "verb_noun_collocation" ? "collocation" : candidate.type_hypothesis === "productive_verb_pattern" ? "verb_pattern" : candidate.type_hypothesis === "fixed_expression" ? "fixed_expression" : "formulaic_phrase");
    const slot = (candidate.type_hypothesis === "fixed_formulaic_phrase" || candidate.type_hypothesis === "productive_verb_pattern") ? genericSlotType(candidate.canonical_form) : null;
    const expression: Expression = {
      id: makeExpressionId(candidate.canonical_form),
      type: "expression",
      expression_type: type,
      canonical_form: candidate.canonical_form,
      display_form: candidate.canonical_form,
      english,
      base_verb_ids: candidate.base_verb_id ? [candidate.base_verb_id] : [],
      related_vocabulary_ids: vocabularyItem ? [vocabularyItem.id] : [],
      productive: type === "verb_pattern" || Boolean(slot),
      collocation_strength: type === "collocation" ? "strong" : "common",
      pattern: slot ? candidate.canonical_form.replace(/\+ (?:infinitif|noun|clause)/, `[${slot.token}]`) : null,
      pattern_slots: slot ? [{ name: slot.name, display: slot.display, type: slot.type, required: true }] : [],
      complement_structure: null,
      mood_governance: null,
      transformations: [],
      variants: [],
      function_ids: [],
      usage_notes: [],
      restrictions: [],
      common_mistakes: [],
      example_ids: [],
      study: { learning_priority: type === "collocation" ? 5 : 3, usefulness: type === "collocation" ? 5 : 3, difficulty: 2, cefr: null },
      usage: { register: "neutral", spoken_written: "both", contexts: ["exercise_derived"] },
      frequency: { book_occurrences: 0, book_frequency_tier: null, real_world_frequency: null, real_world_frequency_source: null },
      origin: { source_type: "derived_from_book", created_by: "exercise_expression_promotion", derived_from_ids: [] },
      attestations: [],
      relations: { exercises: [] },
      tags: ["exercise_derived", type],
    };
    linkCandidate(candidate, expression, vocabularyItem);
    expressions.push(expression);
    candidate.disposition = "promoted";
    candidate.reason = candidate.reviewed_approval ? "Promoted from explicit Sol semantic review with clean source evidence." : "Repeated, clean exercise evidence and direct source translation satisfy the conservative promotion rules.";
    promoted.push(expression.id);
  }

  return {
    expressions: canonicalizeExpressions(expressions),
    vocabulary: canonicalizeVocabulary(vocabulary),
    candidates,
    promoted: Array.from(new Set(promoted)),
    merged_existing: Array.from(new Set(mergedExisting)),
    held_for_review: Array.from(new Set(heldForReview)),
    rejected: Array.from(new Set(rejected)),
  };
}

export function writeExercisePromotionReport(result: ExercisePromotionResult, reportPath: string): void {
  fs.writeFileSync(reportPath, JSON.stringify({
    schema_version: "exercise-expression-promotion.v1",
    promoted: result.promoted,
    merged_existing: result.merged_existing,
    held_for_review: result.held_for_review,
    rejected: result.rejected,
    candidates: result.candidates,
  }, null, 2), "utf-8");
}
