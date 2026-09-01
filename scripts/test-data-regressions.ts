import assert from "assert";
import fs from "fs";
import path from "path";
import { extractChapterExercises } from "./extract-chapter";
import { RawPage } from "./extract-pages";
import { validateDataset } from "../src/lib/dataset/validators";

const ROOT = path.resolve(__dirname, "..");
const dataset = JSON.parse(fs.readFileSync(path.join(ROOT, "data/final/french_grammar.json"), "utf-8"));
const pages: RawPage[] = JSON.parse(fs.readFileSync(path.join(ROOT, "data/raw/pages-all.json"), "utf-8"));
const exerciseCoverage = JSON.parse(fs.readFileSync(path.join(ROOT, "data/reports/exercise-coverage.json"), "utf-8"));
const verbCoverage = JSON.parse(fs.readFileSync(path.join(ROOT, "data/reports/verb-coverage.json"), "utf-8"));

const chapterFour = extractChapterExercises(4, pages.filter((page) => (page.printed_page || 0) >= 34 && (page.printed_page || 0) <= 42));
const exercise42 = chapterFour.find((exercise) => exercise.exercise_number === "4.2")!;
assert.equal(exercise42.questions[9].prompt, "Elle travaille au centre-ville.", "exercise parser stops at the next lesson heading");
assert.equal(exercise42.attestations[0].page_printed, 36, "exercise source page is exact");

assert.equal(dataset.exercises.flatMap((exercise: any) => exercise.questions).filter((question: any) => question.prompt.length > 250).length, 0, "no instructional spill remains in exercise prompts");
assert(dataset.exercises.every((exercise: any) => exercise.answer_key_source?.page_printed && exercise.answer_key_source?.page_pdf), "answer-key page provenance is present");
assert(dataset.exercises.flatMap((exercise: any) => exercise.questions).every((question: any) => question.answer_key_source?.page_printed && question.answer_key_source?.page_pdf), "each answer keeps its own source page");
assert.deepEqual(exerciseCoverage, {
  expected_source_questions: 1872,
  final_questions: 1872,
  reconciled_questions: 1872,
  missing_source_identities: [],
  unexpected_final_identities: [],
  duplicate_final_identities: [],
  answer_provenance_failures: [],
  coverage_ratio: 1,
}, "exercise coverage comes from independently parsed answer-key identities");
assert(!dataset.exercises.find((exercise: any) => exercise.exercise_number === "4.2").questions[9].relations.expressions?.includes("expr_venir_de_inf"), "venir de is not linked from leaked exercise prose");

for (const id of ["expr_savoir_inf", "expr_vouloir_inf", "expr_pouvoir_inf", "expr_devoir_inf", "expr_prendre_des_vacances"]) {
  const expression = dataset.expressions.find((item: any) => item.id === id);
  assert(expression, `${id} is promoted from reviewed source evidence`);
  assert(expression.attestations.length > 0 && expression.relations.exercises.length > 0, `${id} keeps provenance and reverse links`);
}
for (const id of ["expr_savoir_inf", "expr_vouloir_inf", "expr_pouvoir_inf", "expr_devoir_inf"]) assert.equal(dataset.expressions.find((item: any) => item.id === id).expression_type, "verb_pattern");

const beau = dataset.vocabulary.find((item: any) => item.id === "vocab_beau");
assert.equal(beau.part_of_speech, "adjective");
assert(beau.adjective.special_forms.includes("bel") && beau.adjective.feminine_singular === "belle", "beau variants are retained");
assert(dataset.vocabulary.filter((item: any) => item.english.some((meaning: string) => /^to\s+/i.test(meaning))).every((item: any) => item.part_of_speech === "verb"), "English infinitive glossary entries are verbs");
assert(!dataset.vocabulary.some((item: any) => /French-English|English-French|amer, amère bitter|off rir/i.test(item.canonical_form)), "glossary headers and ligature artifacts are rejected");
assert(!dataset.verbs.some((item: any) => /whoever/i.test(item.infinitive)), "English parentheticals do not auto-register verbs");
for (const [id, expected] of Object.entries({
  vocab_elire: { pos: "verb" }, vocab_actuel: { pos: "adjective", feminine: "actuelle" }, vocab_blanc: { pos: "adjective", feminine: "blanche" }, vocab_gentil: { pos: "adjective", feminine: "gentille" }, vocab_acteur: { pos: "noun" }, vocab_amer: { pos: "adjective", feminine: "amère" },
}) as Array<[string, any]>) {
  const item = dataset.vocabulary.find((entry: any) => entry.id === id);
  assert.equal(item.part_of_speech, expected.pos, `${id} uses source-supported POS`);
  assert.equal(item.noun !== null, expected.pos === "noun", `${id} has noun morphology only when a noun`);
  if (expected.feminine) assert.equal(item.adjective.feminine_singular, expected.feminine, `${id} keeps its complete adjective variant`);
}
assert(!dataset.vocabulary.some((item: any) => /^(?:to have a cold avoir un rhume|time de temps en temps|you merci)$/i.test(item.canonical_form)), "English/French multiword rows are never segmented into garbage vocabulary");

for (const id of ["conj_parler_present_indicative", "conj_repeter_present_indicative"]) assert.equal(dataset.conjugations.find((item: any) => item.id === id).origin.source_type, "book", `${id} retains printed-book provenance`);
for (const [verb, forms] of Object.entries({ savoir: ["sais", "sais", "sait", "savons", "savez", "savent"], pouvoir: ["peux/puis", "peux", "peut", "pouvons", "pouvez", "peuvent"], venir: ["viens", "viens", "vient", "venons", "venez", "viennent"], voir: ["vois", "vois", "voit", "voyons", "voyez", "voient"], écrire: ["écris", "écris", "écrit", "écrivons", "écrivez", "écrivent"], naître: ["nais", "nais", "naît", "naissons", "naissez", "naissent"] })) {
  const conjugation = dataset.conjugations.find((item: any) => item.id === `conj_${verb.normalize("NFD").replace(/[\u0300-\u036f]/g, "")}_present_indicative`);
  assert.deepEqual(Object.values(conjugation.forms), forms, `${verb} keeps page-239 present forms after its past participle column`);
}
assert.equal(verbCoverage.reconciled_tables, 98, "every source verb-table row reconciles by forms, not only ID");
assert.deepEqual(verbCoverage.discrepancies, [], "verb-table forms exactly match their source rows");
assert(validateDataset(dataset).passed, "material validation gates pass only for the repaired dataset");

console.log("Data extraction, POS, provenance, promotion, and quality-gate regressions passed.");
