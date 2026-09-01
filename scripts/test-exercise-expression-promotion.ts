import assert from "assert";
import fs from "fs";
import path from "path";
import { Exercise, Expression, Verb, Vocabulary } from "../src/lib/dataset/schemas";
import { promoteExerciseExpressionCandidates } from "./enrichment/promote-exercise-expressions";

const ROOT_DIR = path.resolve(__dirname, "..");
const FINAL_DATASET = path.join(ROOT_DIR, "data", "final", "french_grammar.json");

function fixtureVerb(id: string, infinitive: string): Verb {
  return {
    id, type: "verb", infinitive, display_form: infinitive, english: [infinitive], senses: [], verb_group: "3rd_group", regularity: "irregular", pronominal: false,
    transitivity: [], auxiliary: "avoir", past_participle: null, present_participle: null, conjugation_ids: [], expression_ids: [], complement_frame_ids: [], related_verb_ids: [], contrast_verb_ids: [], confused_with_ids: [], word_family_ids: [],
    study: { learning_priority: 3, usefulness: 3, difficulty: 2, cefr: null }, usage: { register: "neutral", spoken_written: "both", contexts: [] }, frequency: { book_occurrences: 0 }, attestations: [], tags: [],
  };
}

function fixtureVocabulary(): Vocabulary {
  return {
    id: "vocab_decision", type: "vocabulary", canonical_form: "décision", display_form: "la décision", french: "décision", english: ["decision"], part_of_speech: "noun",
    noun: { gender: "feminine", article: "la", plural: null, countability: null }, adjective: null, adverb: null, senses: [], semantic_domains: [], word_family_ids: [], collocation_expression_ids: [], false_friend: false, cognate: false,
    study: { learning_priority: 3, usefulness: 3, difficulty: 2, cefr: null }, usage: { register: "neutral", spoken_written: "both", contexts: [] }, frequency: { book_occurrences: 0 }, attestations: [], tags: [],
  };
}

function fixtureExercise(id: string, questionId: string, prompt: string, answer: string): Exercise {
  return {
    id, type: "exercise", chapter_id: "chapter_01", section_id: "section_01_fixture", exercise_number: "1.1", exercise_type: "translation_en_to_fr", instructions_french: "", instructions_english: null,
    questions: [{ question_id: questionId, prompt, answer, answer_explanation: null, open_ended: false, relations: { verbs: [] } }], answer_key_source: {}, study: { difficulty: 2 },
    attestations: [{ source_type: "book", chapter_number: 1, chapter_id: "chapter_01", page_printed: 1, context_type: "exercise_question" }], tags: [],
  };
}

function runFixtureTests(): void {
  const verbs = [fixtureVerb("verb_prendre", "prendre"), fixtureVerb("verb_venir", "venir"), fixtureVerb("verb_partir", "partir"), fixtureVerb("verb_regarder", "regarder"), fixtureVerb("verb_voir", "voir")];
  const existing: Expression = {
    id: "expr_venir_de_inf", type: "expression", expression_type: "verb_pattern", canonical_form: "venir de + infinitif", display_form: "venir de + infinitif", english: ["to have just done"], base_verb_ids: ["verb_venir"], related_vocabulary_ids: [], productive: true, collocation_strength: null, pattern: "venir de + [infinitif]", pattern_slots: [], complement_structure: null, mood_governance: null, transformations: [], variants: [], function_ids: [], usage_notes: [], restrictions: [], common_mistakes: [], example_ids: [], study: { learning_priority: 3, usefulness: 3, difficulty: 2, cefr: null }, usage: { register: "neutral", spoken_written: "both", contexts: [] }, frequency: { book_occurrences: 0 }, attestations: [], relations: { exercises: [] }, tags: [],
  };
  const exercises = [
    fixtureExercise("exercise_01_1_1", "exercise_01_1_1_q01", "They make a decision.", "Ils prennent une décision."),
    fixtureExercise("exercise_01_1_2", "exercise_01_1_2_q01", "We make a decision.", "Nous prenons une décision."),
    fixtureExercise("exercise_01_1_3", "exercise_01_1_3_q01", "She has just left.", "Elle vient de partir."),
    fixtureExercise("exercise_01_1_4", "exercise_01_1_4_q01", "I watch a film.", "Je regarde un film."),
    fixtureExercise("exercise_01_1_7", "exercise_01_1_7_q01", "We watch a film.", "Nous regardons un film."),
    fixtureExercise("exercise_01_1_5", "exercise_01_1_5_q01", "Parser spill", "The passive voice prendre une décision."),
    fixtureExercise("exercise_01_1_6", "exercise_01_1_6_q01", "French only", "Je prends une retraite."),
    fixtureExercise("exercise_01_1_8", "exercise_01_1_8_q01", "Malformed French", "Nous une décision."),
    fixtureExercise("exercise_01_1_9", "exercise_01_1_9_q01", "Structural spill", "Quoi que tu dises. Avoir beau and quitte à partir."),
  ];
  const result = promoteExerciseExpressionCandidates({
    exercises,
    expressions: [existing],
    vocabulary: [fixtureVocabulary(), { ...fixtureVocabulary(), id: "vocab_film", canonical_form: "film", display_form: "le film", french: "film", english: ["film"], noun: { gender: "masculine", article: "le", plural: null, countability: null } }],
    verbs,
    conjugations: [{ verb_id: "verb_prendre", forms: { nous: "nous prenons", ils: "ils prennent" } }, { verb_id: "verb_venir", forms: { elle: "elle vient" } }, { verb_id: "verb_partir", forms: { infinitif: "partir" } }, { verb_id: "verb_regarder", forms: { je: "je regarde", nous: "nous regardons" } }, { verb_id: "verb_voir", forms: { nous: "nous voyons" } }],
    chapters: [{ id: "chapter_01", chapter_number: 1, title: "Fixture", section_ids: ["section_01_fixture"], concept_ids: [], tense_ids: [], grammar_rule_ids: [], verb_ids: [], conjugation_ids: [], expression_ids: [], vocabulary_ids: [], example_ids: [], exercise_ids: exercises.map((exercise) => exercise.id), source: {}, tags: [] }],
    sections: [{ id: "section_01_fixture", chapter_id: "chapter_01", order: 1, title: "Fixture", concept_ids: [], tense_ids: [], grammar_rule_ids: [], verb_ids: [], expression_ids: [], vocabulary_ids: [], example_ids: [], exercise_ids: exercises.map((exercise) => exercise.id), source: {} }],
    lunaReportPath: path.join(ROOT_DIR, "data", "reports", "exercise-expression-promotion-fixture-audit.json"),
  });
  const decision = result.expressions.find((expression) => expression.id === "expr_prendre_une_decision");
  assert(decision, "repeated supported construction promotes");
  assert.equal(decision.expression_type, "collocation");
  assert.equal(decision.attestations.length, 2);
  assert(result.merged_existing.includes("expr_venir_de_inf"), "existing expression receives exercise attestations");
  assert(!result.expressions.some((expression) => expression.canonical_form === "regarder un film"), "ordinary pair rejects");
  assert(!result.expressions.some((expression) => expression.canonical_form === "prendre une retraite"), "unsupported inferred meaning holds");
  assert(!result.candidates.some((candidate) => candidate.evidence.some((evidence) => evidence.question_id === "exercise_01_1_5_q01")), "parser spill rejects");
  assert(!result.candidates.some((candidate) => candidate.base_verb_id === "verb_voir"), "subject pronouns are not registered as conjugated verbs");
  assert(!result.candidates.some((candidate) => candidate.canonical_form === "quitte à + infinitif"), "bilingual section-heading spill is excluded");

  const repeat = promoteExerciseExpressionCandidates({
    exercises,
    expressions: result.expressions,
    vocabulary: result.vocabulary,
    verbs,
    conjugations: [{ verb_id: "verb_prendre", forms: { nous: "nous prenons", ils: "ils prennent" } }, { verb_id: "verb_venir", forms: { elle: "elle vient" } }, { verb_id: "verb_partir", forms: { infinitif: "partir" } }, { verb_id: "verb_regarder", forms: { je: "je regarde", nous: "nous regardons" } }, { verb_id: "verb_voir", forms: { nous: "nous voyons" } }],
    chapters: [{ id: "chapter_01", chapter_number: 1, title: "Fixture", section_ids: ["section_01_fixture"], concept_ids: [], tense_ids: [], grammar_rule_ids: [], verb_ids: [], conjugation_ids: [], expression_ids: [], vocabulary_ids: [], example_ids: [], exercise_ids: exercises.map((exercise) => exercise.id), source: {}, tags: [] }],
    sections: [{ id: "section_01_fixture", chapter_id: "chapter_01", order: 1, title: "Fixture", concept_ids: [], tense_ids: [], grammar_rule_ids: [], verb_ids: [], expression_ids: [], vocabulary_ids: [], example_ids: [], exercise_ids: exercises.map((exercise) => exercise.id), source: {} }],
    lunaReportPath: path.join(ROOT_DIR, "data", "reports", "exercise-expression-promotion-fixture-audit.json"),
  });
  assert.equal(repeat.expressions.filter((expression) => expression.id === "expr_prendre_une_decision").length, 1, "promotion is idempotent");
  assert.equal(repeat.expressions.find((expression) => expression.id === "expr_prendre_une_decision")?.attestations.length, 2, "attestations dedupe by source anchor");
}

function runDatasetRegression(): void {
  const dataset = JSON.parse(fs.readFileSync(FINAL_DATASET, "utf-8"));
  const expression = dataset.expressions.find((item: Expression) => item.id === "expr_prendre_une_decision");
  const verb = dataset.verbs.find((item: Verb) => item.id === "verb_prendre");
  const vocabulary = dataset.vocabulary.find((item: Vocabulary) => item.id === "vocab_decision");
  assert(expression, "canonical prendre une décision exists exactly once");
  assert.equal(dataset.expressions.filter((item: Expression) => item.id === "expr_prendre_une_decision").length, 1);
  assert.equal(expression.expression_type, "collocation");
  assert(expression.base_verb_ids.includes("verb_prendre"));
  assert(expression.related_vocabulary_ids.includes("vocab_decision"));
  assert(expression.attestations.some((item: Expression["attestations"][number]) => item.exercise_id && item.chapter_id && item.page_printed && item.source_anchor));
  assert(verb.expression_ids.includes(expression.id), "verb reverse relation exists");
  assert(vocabulary.collocation_expression_ids.includes(expression.id), "vocabulary reverse relation exists");
  assert(dataset.exercises.some((exercise: Exercise) => exercise.questions.some((question) => question.relations.expressions?.includes(expression.id) && question.relations.vocabulary?.includes(vocabulary.id))), "question relations exist");
  for (const id of ["expr_quoi_que_clause", "expr_quelle_que_soit_noun", "expr_qui_que_clause", "expr_quitte_a_inf"]) {
    const formula = dataset.expressions.find((item: Expression) => item.id === id);
    assert(formula, `${id} exists when source translations support it`);
    assert(formula.productive && formula.pattern && formula.pattern_slots.length === 1, `${id} has consistent productive pattern metadata`);
    assert(formula.english.every((meaning: string) => meaning.includes("[") && !/[,.!]/.test(meaning) && meaning.split(/\s+/).length <= 5), `${id} has concise slot-bearing English, not a copied sentence`);
  }
  const rerun = promoteExerciseExpressionCandidates({ ...dataset, lunaReportPath: path.join(ROOT_DIR, "data", "reports", "exercise-expression-candidates.json") });
  assert.equal(rerun.expressions.filter((item) => item.id === expression.id).length, 1, "final-dataset reconciliation is idempotent");
  assert.equal(rerun.expressions.find((item) => item.id === expression.id)?.attestations.length, expression.attestations.length, "final attestation count is stable");
}

runFixtureTests();
runDatasetRegression();
console.log("Exercise-expression promotion fixtures and prendre une décision regression passed.");
