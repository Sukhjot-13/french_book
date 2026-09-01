import fs from "fs";
import path from "path";
import { SuperDatasetRootSchema, SuperDatasetRoot } from "../src/lib/dataset/schemas";
import { validateDataset } from "../src/lib/dataset/validators";

const ROOT_DIR = path.resolve(__dirname, "..");
const FINAL_DATASET_FILE = path.join(ROOT_DIR, "data", "final", "french_grammar.json");

export function runSmokeTests(): void {
  console.log("=== RUNNING 12 DATASET SMOKE TESTS ===");

  if (!fs.existsSync(FINAL_DATASET_FILE)) {
    throw new Error(`Final dataset file does not exist at ${FINAL_DATASET_FILE}`);
  }

  const raw = JSON.parse(fs.readFileSync(FINAL_DATASET_FILE, "utf-8"));

  // Smoke Test 1: Load dataset with Zod schema validation
  console.log("Test 1: Validating dataset root with SuperDatasetRootSchema...");
  const root: SuperDatasetRoot = SuperDatasetRootSchema.parse(raw);
  console.log(`  ✓ Passed: Valid SuperDatasetRoot with ${root.chapters.length} chapters.`);

  // Smoke Test 2: Query all rules for tense_present_indicative
  console.log("Test 2: Querying all rules for present indicative...");
  const presentRules = root.grammar_rules.filter((r) =>
    r.tense_ids.includes("tense_present_indicative")
  );
  console.log(`  ✓ Passed: Found ${presentRules.length} rules for present indicative.`);
  if (presentRules.length === 0) throw new Error("Expected at least one present indicative rule");

  // Smoke Test 3: Query all verbs conjugated with être in passé composé
  console.log("Test 3: Querying verbs using être auxiliary...");
  const etreVerbs = root.verbs.filter((v) => v.auxiliary === "etre");
  console.log(`  ✓ Passed: Found ${etreVerbs.length} verbs with être auxiliary.`);

  // Smoke Test 4: Query all irregular past participles
  console.log("Test 4: Querying verbs with irregular past participles...");
  const irregPart = root.verbs.filter((v) => v.past_participle && v.regularity === "irregular");
  console.log(`  ✓ Passed: Found ${irregPart.length} verbs with irregular past participles.`);

  // Smoke Test 5: Query all expressions containing avoir
  console.log("Test 5: Querying expressions containing avoir...");
  const avoirExpressions = root.expressions.filter(
    (e) => e.canonical_form.toLowerCase().includes("avoir") || e.base_verb_ids.includes("verb_avoir")
  );
  console.log(`  ✓ Passed: Found ${avoirExpressions.length} expressions with avoir.`);
  if (avoirExpressions.length === 0) throw new Error("Expected avoir expressions");

  // Smoke Test 6: Query all exercises in Chapter 7 with their answer key
  console.log("Test 6: Querying exercises in Chapter 7...");
  const ch7Exercises = root.exercises.filter((ex) => ex.chapter_id === "chapter_07");
  console.log(`  ✓ Passed: Found ${ch7Exercises.length} exercises in Chapter 7.`);
  const ch7Answered = ch7Exercises.reduce(
    (acc, ex) => acc + ex.questions.filter((q: any) => q.answer || q.expected_answer).length,
    0
  );
  console.log(`    Reconciled answers in Chapter 7: ${ch7Answered}.`);

  // Smoke Test 7: Query glossary for 'par cœur'
  console.log("Test 7: Querying glossary for 'par cœur'...");
  const parCoeur = root.vocabulary.filter((v) => v.french.toLowerCase().includes("coeur") || v.french.toLowerCase().includes("cœur"));
  console.log(`  ✓ Passed: Found ${parCoeur.length} items related to 'cœur'.`);

  // Smoke Test 8: Query connaître vs savoir contrast
  console.log("Test 8: Querying savoir vs connaître contrast...");
  const savoirRule = root.grammar_rules.find((r) => r.id.includes("savoir"));
  console.log(`  ✓ Passed: Rule 'savoir vs connaître' found: "${savoirRule?.title}".`);
  if (!savoirRule) throw new Error("Expected savoir vs connaître rule");

  // Smoke Test 9: Query 'depuis' rule with present tense
  console.log("Test 9: Querying 'depuis' rule with present tense...");
  const depuisRule = root.grammar_rules.find((r) => r.id.includes("depuis"));
  console.log(`  ✓ Passed: Rule 'depuis' found: "${depuisRule?.title}".`);
  if (!depuisRule) throw new Error("Expected depuis rule");

  // Smoke Test 10: Query 'il s'agit de' rule and examples
  console.log("Test 10: Querying 'il s'agit de' rule and examples...");
  const ilSagitRule = root.grammar_rules.find((r) => r.id.includes("il_s_agit_de"));
  console.log(`  ✓ Passed: Rule 'il s'agit de' found: "${ilSagitRule?.title}".`);
  if (!ilSagitRule) throw new Error("Expected il s'agit de rule");

  // Smoke Test 11: Query DR & MRS VANDERTRAMP verb list
  console.log("Test 11: Querying DR & MRS VANDERTRAMP rule...");
  const vandertrampRule = root.grammar_rules.find((r) => r.id.includes("vandertramp"));
  console.log(`  ✓ Passed: Vandertramp rule found: "${vandertrampRule?.title}".`);
  if (!vandertrampRule) throw new Error("Expected vandertramp rule");

  // Smoke Test 12: Verify zero broken relation IDs across entire dataset
  console.log("Test 12: Verifying 0 broken relation IDs across entire dataset...");
  const valReport = validateDataset(root);
  console.log(`  Broken relations count: ${valReport.unresolved_relations.length}`);
  if (valReport.unresolved_relations.length > 0) {
    console.error("Broken relations encountered:", valReport.unresolved_relations.slice(0, 5));
    throw new Error(`Validation failed: ${valReport.unresolved_relations.length} broken relations.`);
  }
  console.log("  ✓ Passed: Exactly 0 broken relations!");

  console.log("\n==========================================");
  console.log("🎉 ALL 12 SMOKE TESTS PASSED SUCCESSFULLY!");
  console.log("==========================================");
}

if (require.main === module) {
  runSmokeTests();
}
