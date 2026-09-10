import assert from "assert";
import {
  addWorkflowFields,
  buildBatchPlan,
  collectEmptyFields,
  findFirstAvailableEntity,
  markPlanTaken,
} from "../enrichment/create-deep-enrichment-batches";

type Fixture = Record<string, unknown>;

const sourceFixture: Fixture = {
  chapters: [
    {
      chapter_number: 1,
      verbs: ["partir"],
      expressions: ["partir en voyage"],
      vocabulary: [{ canonical_form: "voyage", part_of_speech: "noun" }],
      concepts: [],
      grammar_rules: [],
      tenses: [],
      topics: [],
      sections: [],
    },
  ],
  verbs: [
    {
      infinitive: "partir",
      related_expressions: ["partir en voyage"],
      related_concepts: [],
      chapters: [1],
      conjugations: [{ mood: "indicative", tense: "présent", forms: { je: "pars" } }],
    },
  ],
  expressions: [
    {
      canonical_form: "partir en voyage",
      related_verbs: ["partir"],
      related_vocabulary: [{ canonical_form: "voyage", part_of_speech: "noun" }],
      related_grammar_rules: [],
      related_concepts: [],
      chapters: [1],
    },
  ],
  vocabulary: [
    {
      canonical_form: "voyage",
      part_of_speech: "noun",
      related_verbs: ["partir"],
      related_expressions: [],
      related_concepts: [],
      chapters: [1],
    },
  ],
  topics: [],
};

const workingFixture = addWorkflowFields(sourceFixture);
const anchor = findFirstAvailableEntity(workingFixture);
assert.deepStrictEqual(anchor, { collection: "chapters", index: 0, naturalKey: "1" });

const plan = buildBatchPlan(workingFixture, anchor!);
assert.strictEqual(plan.targets.length, 4, "A batch must recursively include the linked chapter, verb, expression, and vocabulary.");
assert.strictEqual(plan.context.length, 0, "A new working copy must not have pre-enriched context.");
assert.strictEqual(plan.unresolvedReferences.length, 0, "Every fixture relationship must resolve by its natural key.");

markPlanTaken(workingFixture, plan);
for (const collection of ["chapters", "verbs", "expressions", "vocabulary"]) {
  const record = (workingFixture[collection] as Array<Record<string, unknown>>)[0];
  assert.strictEqual(record.taken_for_enrichment, true, `${collection} must be claimed by the batch.`);
  assert.strictEqual(record.enriched, false, `${collection} must remain unenriched until a validated response is applied.`);
}
assert.strictEqual(
  "taken_for_enrichment" in (sourceFixture.chapters as Array<Record<string, unknown>>)[0],
  false,
  "The source fixture must stay unchanged when creating a working copy."
);

const emptyFields = collectEmptyFields({ populated: "French", nullable: null, list: [], nested: { blank: "" } });
assert.deepStrictEqual(emptyFields, [
  { path: "$.nullable", current_value: null },
  { path: "$.list", current_value: [] },
  { path: "$.nested.blank", current_value: "" },
]);

console.log("✅ Deep-enrichment working-copy flags, recursive planning, and empty-field targeting verified.");
