import { extractPages } from "./extract-pages";
import { parseBackmatter } from "./parse-backmatter";
import { parseAllChapters } from "./parse-book";
import { normalizeAllChapters } from "./normalize-chapter";
import { attachAnswerKey } from "./attach-answer-key";
import { reconcileGlobal } from "./reconcile-global";
import { validateFinalDataset } from "./validate-dataset";
import { checkCoverage } from "./check-coverage";
import { runSmokeTests } from "./smoke-tests";

async function runAll() {
  console.log("==================================================");
  console.log("🚀 STARTING COMPLETE FRENCH BOOK PARSING PIPELINE");
  console.log("==================================================\n");

  console.log("--- STAGE 1: Extracting raw PDF pages ---");
  await extractPages();

  console.log("\n--- STAGE 2: Parsing back matter ---");
  await parseBackmatter();

  console.log("\n--- STAGE 3: Parsing all 27 chapters ---");
  parseAllChapters();

  console.log("\n--- STAGE 4: Normalizing chapters ---");
  normalizeAllChapters();

  console.log("\n--- STAGE 5: Attaching answer key ---");
  attachAnswerKey();

  console.log("\n--- STAGE 6: Global reconciliation & indexing ---");
  reconcileGlobal();

  console.log("\n--- STAGE 7: Validating schema & relationship integrity ---");
  const valReport = validateFinalDataset();
  if (valReport.schema_errors.length > 0 || valReport.unresolved_relations.length > 0) {
    console.error("Pipeline aborted due to validation errors.");
    process.exit(1);
  }

  console.log("\n--- STAGE 8: Generating quality & coverage reports ---");
  checkCoverage();

  console.log("\n--- STAGE 9: Running automated smoke tests ---");
  runSmokeTests();

  console.log("\n==================================================");
  console.log("✨ PARSING & VALIDATION PIPELINE COMPLETED 100%!");
  console.log("==================================================");
}

if (require.main === module) {
  runAll().catch((err) => {
    console.error("Pipeline failed with error:", err);
    process.exit(1);
  });
}
