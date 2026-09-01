import fs from "fs";
import path from "path";
import { SuperDatasetRoot } from "../src/lib/dataset/schemas";
import { validateDataset, ValidationReport } from "../src/lib/dataset/validators";

const ROOT_DIR = path.resolve(__dirname, "..");
const FINAL_DATASET_FILE = path.join(ROOT_DIR, "data", "final", "french_grammar.json");
const BROKEN_RELATIONS_REPORT = path.join(ROOT_DIR, "data", "reports", "broken-relations.json");

export function validateFinalDataset(): ValidationReport {
  if (!fs.existsSync(FINAL_DATASET_FILE)) {
    throw new Error(`Final dataset file does not exist at ${FINAL_DATASET_FILE}. Run reconcile-global first.`);
  }

  console.log("Reading dataset for validation...");
  const root: SuperDatasetRoot = JSON.parse(fs.readFileSync(FINAL_DATASET_FILE, "utf-8"));

  console.log("Validating schemas, ID prefixes, and relationship integrity...");
  const report = validateDataset(root);

  // Save broken relations report
  const brokenDir = path.dirname(BROKEN_RELATIONS_REPORT);
  if (!fs.existsSync(brokenDir)) {
    fs.mkdirSync(brokenDir, { recursive: true });
  }

  fs.writeFileSync(
    BROKEN_RELATIONS_REPORT,
    JSON.stringify(
      {
        total_broken_relations: report.unresolved_relations.length,
        broken_relations: report.unresolved_relations,
        checked_at: new Date().toISOString(),
      },
      null,
      2
    ),
    "utf-8"
  );

  console.log("\n=== VALIDATION RESULTS ===");
  console.log(`Schema Valid: ${report.schema_errors.length === 0 ? "YES" : "NO"}`);
  console.log(`Total Schema Errors: ${report.schema_errors.length}`);
  console.log(`Total ID Errors: ${report.id_errors.length}`);
  console.log(`Broken Relations: ${report.unresolved_relations.length}`);

  if (report.schema_errors.length > 0) {
    console.error("\nSchema Errors encountered (first 10):");
    report.schema_errors.slice(0, 10).forEach((err) => console.error(` - [${err.path}] ${err.message}`));
  }
  if (report.id_errors.length > 0) {
    console.error("\nID Errors encountered (first 10):");
    report.id_errors.slice(0, 10).forEach((err) => console.error(` - [${err.id}] ${err.error}`));
  }
  if (report.unresolved_relations.length > 0) {
    console.error("\nUnresolved Relations encountered (first 10):");
    report.unresolved_relations.slice(0, 10).forEach((rel) =>
      console.error(` - [${rel.from_id} -> ${rel.target_id}] (${rel.relation_type})`)
    );
  }

  return report;
}

if (require.main === module) {
  const report = validateFinalDataset();
  if (report.schema_errors.length > 0 || report.id_errors.length > 0 || report.unresolved_relations.length > 0) {
    process.exit(1);
  }
}
