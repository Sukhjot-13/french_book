/**
 * Creates a second, minimal prompt set from frozen full-record deep batches.
 *
 * Unlike deep-batches, these prompts never expose populated source fields.
 * They contain only an entity identity and the paths that are empty in the
 * corresponding master record, plus the full schema needed to propose data.
 */

import crypto from "crypto";
import fs from "fs";
import path from "path";
import {
  COLLECTION_KEY_FIELDS,
  collectEmptyFields,
  getRecordKey,
} from "./create-deep-enrichment-batches";

type JsonObject = Record<string, unknown>;

export const MAX_EMPTY_FIELD_BATCHES: number | null = null;

const PROJECT_ROOT = path.resolve(__dirname, "..");
const SCHEMA_PATH = path.join(PROJECT_ROOT, "data/MASTER_SCHEMA.json");
const DEEP_BATCH_DIRECTORY = path.join(PROJECT_ROOT, "enrichment/deep-batches");
const OUTPUT_DIRECTORY = path.join(PROJECT_ROOT, "enrichment/empty-field-batches");
const TARGET_HEADING = "Target entities — full source records";

function isObject(value: unknown): value is JsonObject {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function sha256(value: string): string {
  return crypto.createHash("sha256").update(value).digest("hex");
}

function writeTextAtomically(filePath: string, value: string): void {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  const temporaryPath = `${filePath}.${process.pid}.tmp`;
  fs.writeFileSync(temporaryPath, value, "utf8");
  fs.renameSync(temporaryPath, filePath);
}

export function extractJsonCodeBlock(batchText: string, heading: string): unknown {
  const marker = `## ${heading}\n\n\`\`\`json\n`;
  const start = batchText.indexOf(marker);
  if (start === -1) throw new Error(`Batch is missing the ${heading} JSON section.`);

  const jsonStart = start + marker.length;
  const end = batchText.indexOf("\n\`\`\`", jsonStart);
  if (end === -1) throw new Error(`Batch has an unterminated ${heading} JSON section.`);
  return JSON.parse(batchText.slice(jsonStart, end)) as unknown;
}

export interface EmptyFieldTarget {
  collection: string;
  natural_key_field: string;
  natural_key: string;
  source_target_ordinal: number;
  empty_field_paths: string[];
}

export function emptyOnlyTargets(fullRecords: unknown): EmptyFieldTarget[] {
  if (!isObject(fullRecords)) throw new Error("Deep-batch target records must be a collection-to-records object.");

  const targets: EmptyFieldTarget[] = [];
  let ordinal = 0;
  for (const [collection, value] of Object.entries(fullRecords)) {
    if (!Array.isArray(value)) throw new Error(`Deep-batch collection ${collection} is not an array.`);
    const naturalKeyField = COLLECTION_KEY_FIELDS[collection];
    if (!naturalKeyField) throw new Error(`No natural-key configuration exists for ${collection}.`);

    for (const record of value) {
      ordinal += 1;
      if (!isObject(record)) throw new Error(`Deep-batch collection ${collection} contains a non-object record.`);
      const naturalKey = getRecordKey(collection, record);
      if (!naturalKey) throw new Error(`Deep-batch ${collection} record is missing ${naturalKeyField}.`);

      const emptyFieldPaths = collectEmptyFields(record).map(({ path: fieldPath }) => fieldPath);
      if (emptyFieldPaths.length === 0) continue;
      targets.push({
        collection,
        natural_key_field: naturalKeyField,
        natural_key: naturalKey,
        source_target_ordinal: ordinal,
        empty_field_paths: emptyFieldPaths,
      });
    }
  }
  return targets;
}

function getDeepBatchFiles(): string[] {
  if (!fs.existsSync(DEEP_BATCH_DIRECTORY)) {
    throw new Error(`No deep batches found at ${path.relative(PROJECT_ROOT, DEEP_BATCH_DIRECTORY)}.`);
  }
  return fs
    .readdirSync(DEEP_BATCH_DIRECTORY)
    .filter((name) => /^DEEP_BATCH_\d+\.txt$/.test(name))
    .sort((left, right) => left.localeCompare(right, undefined, { numeric: true }));
}

function buildEmptyFieldBatchText(
  sourceBatchName: string,
  schema: JsonObject,
  schemaHash: string,
  targets: EmptyFieldTarget[]
): string {
  const sourceBatchId = path.basename(sourceBatchName, ".txt");
  const batchId = sourceBatchId.replace(/^DEEP_BATCH_/, "EMPTY_FIELD_BATCH_");
  const responseContract = {
    operations: {
      MERGE_EXISTING: {
        required: ["collection", "natural_key", "patch", "evidence", "reason"],
        rule: "patch may contain values only for empty_field_paths supplied for that entity. Do not restate or overwrite populated fields.",
      },
      INSERT_NEW: {
        required: ["collection", "natural_key", "record", "evidence", "reason"],
        rule: "Use only for a genuinely new related entity. record must be a complete master-schema-valid record with no workflow fields.",
      },
      NO_PROPOSAL: {
        required: ["collection", "natural_key", "reason"],
        rule: "Use when no source-supported addition can be proposed for the supplied empty paths.",
      },
    },
  };

  return `# ${batchId} — Empty-Field Enrichment\n\n` +
    `## Source\n` +
    `- Derived from full-context batch: ${sourceBatchId}\n` +
    `- Master schema SHA-256: ${schemaHash}\n` +
    `- Target entities with at least one empty field: ${targets.length}\n\n` +
    `## Mandatory instructions\n` +
    `1. The target section deliberately contains no populated source-field values. Treat each empty_field_paths entry as the only existing-data gap you may enrich.\n` +
    `2. Do not infer, restate, replace, or overwrite any populated field from the master dataset.\n` +
    `3. For MERGE_EXISTING, provide patch values only for a supplied empty_field_paths entry of that same entity.\n` +
    `4. You may propose a genuinely new related record only through INSERT_NEW, using a complete schema-valid record.\n` +
    `5. Never include enriched or taken_for_enrichment; they are local workflow fields.\n` +
    `6. Return JSON using the response contract. Never invent provenance.\n\n` +
    `## Full master schema\n\n\`\`\`json\n${JSON.stringify(schema, null, 2)}\n\`\`\`\n\n` +
    `## Response contract\n\n\`\`\`json\n${JSON.stringify(responseContract, null, 2)}\n\`\`\`\n\n` +
    `## Target entities — identities and empty field paths only\n\n\`\`\`json\n${JSON.stringify(targets, null, 2)}\n\`\`\`\n`;
}

export function generateEmptyFieldEnrichmentBatches(): { created: number; skipped: number; outputDirectory: string } {
  const schemaText = fs.readFileSync(SCHEMA_PATH, "utf8");
  const schema = JSON.parse(schemaText) as JsonObject;
  const schemaHash = sha256(schemaText);
  const batchLimit = MAX_EMPTY_FIELD_BATCHES ?? Number.POSITIVE_INFINITY;
  const deepBatchFiles = getDeepBatchFiles();
  let created = 0;
  let skipped = 0;

  for (const deepBatchFile of deepBatchFiles) {
    if (created >= batchLimit) break;
    const deepBatchPath = path.join(DEEP_BATCH_DIRECTORY, deepBatchFile);
    const fullRecords = extractJsonCodeBlock(fs.readFileSync(deepBatchPath, "utf8"), TARGET_HEADING);
    const targets = emptyOnlyTargets(fullRecords);
    if (targets.length === 0) {
      skipped += 1;
      continue;
    }

    const outputName = deepBatchFile.replace(/^DEEP_BATCH_/, "EMPTY_FIELD_BATCH_");
    const outputPath = path.join(OUTPUT_DIRECTORY, outputName);
    writeTextAtomically(outputPath, buildEmptyFieldBatchText(deepBatchFile, schema, schemaHash, targets));
    console.log(`${outputName}: ${targets.length} entities with empty fields from ${deepBatchFile}.`);
    created += 1;
  }

  console.log(
    `Created ${created} empty-field batch(es); skipped ${skipped} deep batch(es) with no empty fields. ` +
      `Output: ${path.relative(PROJECT_ROOT, OUTPUT_DIRECTORY)}`
  );
  return { created, skipped, outputDirectory: OUTPUT_DIRECTORY };
}

if (require.main === module) {
  generateEmptyFieldEnrichmentBatches();
}
