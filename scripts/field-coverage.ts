/**
 * Field-completeness inventory for the master dataset (suggestion 2026-09-10).
 *
 * Regenerates the completeness report from data/MASTER_DATA.json (+ schema)
 * instead of maintaining it by hand. Read-only: never writes the dataset.
 *
 * Usage: npx tsx scripts/field-coverage.ts [--json]
 *   --json  print the machine-readable report instead of the table.
 */
import fs from "fs";
import path from "path";

const ROOT = path.resolve(__dirname, "..");
const DATA_PATH = path.join(ROOT, "data", "MASTER_DATA.json");

interface FieldStat {
  field: string;
  present: number;
  empty: number;
  coverage: number;
}

interface CollectionStat {
  collection: string;
  total: number;
  fields: FieldStat[];
}

function isEmpty(value: unknown): boolean {
  if (value === null || value === undefined) return true;
  if (typeof value === "string") return value.trim() === "";
  if (Array.isArray(value)) return value.length === 0;
  if (typeof value === "object") return Object.keys(value).length === 0;
  return false;
}

// Critical display fields per collection: gaps here are learner-visible.
// (Keyed to the real MASTER_DATA.json field names — verified 2026-09-26.)
const CRITICAL_FIELDS: Record<string, string[]> = {
  verbs: ["infinitive", "english", "verb_group", "conjugations"],
  vocabulary: ["canonical_form", "english", "part_of_speech"],
  expressions: ["canonical_form", "english"],
  grammar_rules: ["rule_name", "explanation"],
  tenses: ["name", "english_name", "mood"],
  chapters: ["chapter_number", "chapter_title"],
  examples: ["french", "english"],
  exercises: ["instructions", "questions"],
  exceptions_and_traps: ["title", "description"],
  concepts: ["name"],
};

function main(): void {
  const raw = JSON.parse(fs.readFileSync(DATA_PATH, "utf-8"));
  const asJson = process.argv.includes("--json");
  const report: CollectionStat[] = [];

  for (const [collection, fields] of Object.entries(CRITICAL_FIELDS)) {
    const rows: unknown[] = Array.isArray(raw[collection]) ? raw[collection] : [];
    const stat: CollectionStat = { collection, total: rows.length, fields: [] };
    for (const field of fields) {
      let empty = 0;
      for (const row of rows) {
        if (isEmpty((row as Record<string, unknown>)[field])) empty += 1;
      }
      const present = rows.length - empty;
      stat.fields.push({
        field,
        present,
        empty,
        coverage: rows.length === 0 ? 1 : present / rows.length,
      });
    }
    report.push(stat);
  }

  if (asJson) {
    console.log(JSON.stringify({ generatedAt: new Date().toISOString(), collections: report }, null, 2));
    return;
  }

  console.log("Field completeness — data/MASTER_DATA.json\n");
  console.log(
    "collection".padEnd(22) +
      "total".padEnd(8) +
      "field".padEnd(22) +
      "present".padEnd(9) +
      "empty".padEnd(8) +
      "coverage"
  );
  console.log("-".repeat(80));
  for (const col of report) {
    for (const f of col.fields) {
      const flag = f.coverage < 1 ? "  <-- gap" : "";
      console.log(
        col.collection.padEnd(22) +
          String(col.total).padEnd(8) +
          f.field.padEnd(22) +
          String(f.present).padEnd(9) +
          String(f.empty).padEnd(8) +
          `${(f.coverage * 100).toFixed(1)}%${flag}`
      );
    }
  }
  const gaps = report.flatMap((c) =>
    c.fields.filter((f) => f.coverage < 1).map((f) => `${c.collection}.${f.field}`)
  );
  console.log(`\n${gaps.length} field gap(s): ${gaps.join(", ") || "none"}`);
}

main();
