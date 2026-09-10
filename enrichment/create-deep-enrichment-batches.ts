/**
 * Builds deep-enrichment batches without ever changing data/MASTER_DATA.json.
 *
 * Test run: leave MAX_BATCHES at 5.
 * Full run: change MAX_BATCHES to null. The generator will continue until
 * every top-level dataset record has either been claimed by a batch or is
 * already marked as taken_for_enrichment in the working copy.
 *
 * This generator does not apply AI responses. It only creates the safe working
 * copy and frozen prompts/manifests that a later validator and merger can use.
 */

import crypto from "crypto";
import fs from "fs";
import path from "path";

type JsonObject = Record<string, unknown>;
type CollectionName = string;

export const MAX_BATCHES: number | null = 5;
const FOLLOW_INBOUND_RELATIONSHIPS = false;
const WORKING_COPY_FORMAT = "deep-enrichment-working-copy/v1";

const PROJECT_ROOT = path.resolve(__dirname, "..");
const SOURCE_PATH = path.join(PROJECT_ROOT, "data/MASTER_DATA.json");
const SCHEMA_PATH = path.join(PROJECT_ROOT, "data/MASTER_SCHEMA.json");
const WORKING_COPY_PATH = path.join(PROJECT_ROOT, "enrichment/DEEP_ENRICHMENT_WORKING_DATA.json");
const BATCH_DIRECTORY = path.join(PROJECT_ROOT, "enrichment/deep-batches");

const COLLECTION_KEY_FIELDS: Record<string, string> = {
  chapters: "chapter_number",
  topics: "name",
  concepts: "name",
  grammar_rules: "rule_name",
  tenses: "name",
  verbs: "infinitive",
  expressions: "canonical_form",
  vocabulary: "canonical_form",
  examples: "french",
  exercises: "exercise_code",
  exceptions_and_traps: "title",
  unresolved_items: "normalized_candidate",
  source_quality: "source_name",
};

const RELATION_TARGETS: Record<string, string> = {
  chapters: "chapters",
  topics: "topics",
  concepts: "concepts",
  grammar_rules: "grammar_rules",
  verbs: "verbs",
  expressions: "expressions",
  vocabulary: "vocabulary",
  tenses: "tenses",
  related_chapters: "chapters",
  related_topics: "topics",
  related_concepts: "concepts",
  related_grammar_rules: "grammar_rules",
  related_verbs: "verbs",
  related_expressions: "expressions",
  related_vocabulary: "vocabulary",
  related_tenses: "tenses",
  related_examples: "examples",
  verb: "verbs",
  example_verb: "verbs",
  base_verb: "verbs",
  auxiliary_tense: "tenses",
};

export interface EntityReference {
  collection: CollectionName;
  index: number;
  naturalKey: string;
}

export interface BatchPlan {
  anchor: EntityReference;
  targets: EntityReference[];
  context: EntityReference[];
  unresolvedReferences: Array<{ from: EntityReference; relation: string; value: unknown }>;
}

function isObject(value: unknown): value is JsonObject {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function clone<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T;
}

export function normalizeKey(value: unknown): string {
  return String(value ?? "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[’']/g, "'")
    .replace(/\s+/g, " ")
    .trim();
}

function sha256(value: string): string {
  return crypto.createHash("sha256").update(value).digest("hex");
}

function writeJsonAtomically(filePath: string, value: unknown): void {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  const temporaryPath = `${filePath}.${process.pid}.tmp`;
  fs.writeFileSync(temporaryPath, `${JSON.stringify(value, null, 2)}\n`, "utf8");
  fs.renameSync(temporaryPath, filePath);
}

function getRecordKey(collection: string, record: JsonObject): string | null {
  const keyField = COLLECTION_KEY_FIELDS[collection];
  if (!keyField || record[keyField] === undefined || record[keyField] === null) return null;
  const key = String(record[keyField]).trim();
  return key || null;
}

function getRecords(dataset: JsonObject, collection: string): JsonObject[] {
  const value = dataset[collection];
  return Array.isArray(value) ? value.filter(isObject) : [];
}

function listCollections(dataset: JsonObject): string[] {
  return Object.keys(dataset).filter((collection) => Array.isArray(dataset[collection]));
}

export function addWorkflowFields(masterDataset: JsonObject): JsonObject {
  const workingCopy = clone(masterDataset);
  for (const collection of listCollections(workingCopy)) {
    for (const record of getRecords(workingCopy, collection)) {
      record.enriched = false;
      record.taken_for_enrichment = false;
    }
  }
  return workingCopy;
}

function removeWorkflowFields(dataset: JsonObject): JsonObject {
  const baseline = clone(dataset);
  for (const collection of listCollections(baseline)) {
    for (const record of getRecords(baseline, collection)) {
      delete record.enriched;
      delete record.taken_for_enrichment;
    }
  }
  return baseline;
}

export function hashDatasetWithoutWorkflowFields(dataset: JsonObject): string {
  return sha256(JSON.stringify(removeWorkflowFields(dataset)));
}

function ensureWorkingCopy(masterDataset: JsonObject, masterHash: string): JsonObject {
  if (!fs.existsSync(WORKING_COPY_PATH)) {
    const created = addWorkflowFields(masterDataset);
    writeJsonAtomically(WORKING_COPY_PATH, created);
    return created;
  }

  const existing = JSON.parse(fs.readFileSync(WORKING_COPY_PATH, "utf8")) as JsonObject;
  if (hashDatasetWithoutWorkflowFields(existing) !== masterHash) {
    throw new Error(
      "The deep-enrichment working copy no longer matches the current master dataset. " +
        "Do not overwrite it automatically; archive it or deliberately reset it before continuing."
    );
  }

  for (const collection of listCollections(existing)) {
    for (const record of getRecords(existing, collection)) {
      if (typeof record.enriched !== "boolean" || typeof record.taken_for_enrichment !== "boolean") {
        throw new Error(`Working-copy workflow fields are invalid in ${collection}.`);
      }
    }
  }
  return existing;
}

function buildIdentityIndex(dataset: JsonObject): Map<string, Map<string, EntityReference[]>> {
  const index = new Map<string, Map<string, EntityReference[]>>();
  for (const collection of listCollections(dataset)) {
    const collectionIndex = new Map<string, EntityReference[]>();
    getRecords(dataset, collection).forEach((record, recordIndex) => {
      const naturalKey = getRecordKey(collection, record);
      if (!naturalKey) return;
      const normalized = normalizeKey(naturalKey);
      const matches = collectionIndex.get(normalized) ?? [];
      matches.push({ collection, index: recordIndex, naturalKey });
      collectionIndex.set(normalized, matches);
    });
    index.set(collection, collectionIndex);
  }
  return index;
}

function referenceValues(value: unknown, collection: string): string[] {
  if (typeof value === "string" || typeof value === "number") return [String(value)];
  if (Array.isArray(value)) return value.flatMap((item) => referenceValues(item, collection));
  if (!isObject(value)) return [];

  const preferredField = COLLECTION_KEY_FIELDS[collection];
  const candidates = [
    preferredField,
    "canonical_form",
    "infinitive",
    "rule_name",
    "name",
    "french",
    "title",
    "exercise_code",
    "display_form",
  ];
  for (const field of candidates) {
    if (field && (typeof value[field] === "string" || typeof value[field] === "number")) {
      return [String(value[field])];
    }
  }
  return [];
}

function extractRelations(
  record: JsonObject,
  owningCollection: string
): Array<{ relation: string; collection: string; value: unknown }> {
  const relations: Array<{ relation: string; collection: string; value: unknown }> = [];
  const visited = new WeakSet<object>();

  const visit = (value: unknown): void => {
    if (Array.isArray(value)) {
      value.forEach(visit);
      return;
    }
    if (!isObject(value) || visited.has(value)) return;
    visited.add(value);

    for (const [field, nestedValue] of Object.entries(value)) {
      const targetCollection =
        RELATION_TARGETS[field] ??
        (["synonyms", "antonyms"].includes(field) && ["verbs", "expressions", "vocabulary"].includes(owningCollection)
          ? owningCollection
          : undefined);
      if (targetCollection) {
        relations.push({ relation: field, collection: targetCollection, value: nestedValue });
      }
      visit(nestedValue);
    }
  };

  visit(record);
  return relations;
}

function getRecord(dataset: JsonObject, reference: EntityReference): JsonObject {
  const records = getRecords(dataset, reference.collection);
  const record = records[reference.index];
  if (!record) throw new Error(`Missing ${reference.collection}[${reference.index}] from working copy.`);
  return record;
}

function entityId(reference: EntityReference): string {
  return `${reference.collection}:${reference.index}`;
}

function findInboundReferences(
  dataset: JsonObject,
  target: EntityReference,
  index: Map<string, Map<string, EntityReference[]>>
): EntityReference[] {
  if (!FOLLOW_INBOUND_RELATIONSHIPS) return [];
  const incoming: EntityReference[] = [];
  const targetKey = normalizeKey(target.naturalKey);
  for (const collection of listCollections(dataset)) {
    for (const [candidateKey, references] of index.get(collection) ?? []) {
      for (const reference of references) {
        const record = getRecord(dataset, reference);
        const linksTarget = extractRelations(record, reference.collection).some((relation) =>
          relation.collection === target.collection &&
          referenceValues(relation.value, relation.collection).some((value) => normalizeKey(value) === targetKey)
        );
        if (linksTarget && candidateKey) incoming.push(reference);
      }
    }
  }
  return incoming;
}

export function findFirstAvailableEntity(dataset: JsonObject): EntityReference | null {
  for (const collection of listCollections(dataset)) {
    const records = getRecords(dataset, collection);
    for (let index = 0; index < records.length; index += 1) {
      const record = records[index];
      const naturalKey = getRecordKey(collection, record);
      if (naturalKey && record.taken_for_enrichment === false) {
        return { collection, index, naturalKey };
      }
    }
  }
  return null;
}

export function buildBatchPlan(dataset: JsonObject, anchor: EntityReference): BatchPlan {
  const identityIndex = buildIdentityIndex(dataset);
  const targets = new Map<string, EntityReference>();
  const context = new Map<string, EntityReference>();
  const unresolvedReferences: BatchPlan["unresolvedReferences"] = [];
  const queue: EntityReference[] = [anchor];

  while (queue.length > 0) {
    const current = queue.shift();
    if (!current) continue;
    const currentId = entityId(current);
    if (targets.has(currentId) || context.has(currentId)) continue;

    const record = getRecord(dataset, current);
    if (record.taken_for_enrichment === true && currentId !== entityId(anchor)) {
      context.set(currentId, current);
      continue;
    }

    targets.set(currentId, current);
    for (const relation of extractRelations(record, current.collection)) {
      const targetIndex = identityIndex.get(relation.collection);
      for (const value of referenceValues(relation.value, relation.collection)) {
        const matches = targetIndex?.get(normalizeKey(value)) ?? [];
        if (matches.length === 0) {
          unresolvedReferences.push({ from: current, relation: relation.relation, value });
          continue;
        }
        matches.forEach((match) => queue.push(match));
      }
    }

    findInboundReferences(dataset, current, identityIndex).forEach((match) => queue.push(match));
  }

  return {
    anchor,
    targets: [...targets.values()],
    context: [...context.values()],
    unresolvedReferences,
  };
}

export function markPlanTaken(dataset: JsonObject, plan: BatchPlan): void {
  for (const reference of plan.targets) {
    const record = getRecord(dataset, reference);
    record.taken_for_enrichment = true;
  }
}

function recordsByCollection(dataset: JsonObject, references: EntityReference[]): Record<string, JsonObject[]> {
  const grouped: Record<string, JsonObject[]> = {};
  for (const reference of references) {
    const records = grouped[reference.collection] ?? [];
    records.push(clone(getRecord(dataset, reference)));
    grouped[reference.collection] = records;
  }
  return grouped;
}

function getNextBatchNumber(): number {
  if (!fs.existsSync(BATCH_DIRECTORY)) return 1;
  const numbers = fs
    .readdirSync(BATCH_DIRECTORY)
    .map((name) => /^DEEP_BATCH_(\d{3})\.json$/.exec(name)?.[1])
    .filter((value): value is string => Boolean(value))
    .map(Number);
  return numbers.length === 0 ? 1 : Math.max(...numbers) + 1;
}

function buildBatchDocument(
  dataset: JsonObject,
  schema: JsonObject,
  masterHash: string,
  schemaHash: string,
  batchNumber: number,
  plan: BatchPlan
): JsonObject {
  const batchId = `DEEP_BATCH_${String(batchNumber).padStart(3, "0")}`;
  return {
    batch_id: batchId,
    workflow_format: WORKING_COPY_FORMAT,
    source: {
      master_data_sha256: masterHash,
      master_schema_sha256: schemaHash,
      working_copy: path.relative(PROJECT_ROOT, WORKING_COPY_PATH),
    },
    generation_config: {
      max_batches_this_run: MAX_BATCHES,
      follows_inbound_relationships: FOLLOW_INBOUND_RELATIONSHIPS,
      relationship_fields: Object.keys(RELATION_TARGETS),
    },
    anchor: plan.anchor,
    target_entity_count: plan.targets.length,
    context_entity_count: plan.context.length,
    target_entities: recordsByCollection(dataset, plan.targets),
    already_enriched_context: recordsByCollection(dataset, plan.context),
    unresolved_existing_references: plan.unresolvedReferences,
    master_schema: schema,
    ai_response_contract: {
      instruction:
        "Return structured proposals only. Enrich all applicable fields of every target entity. " +
        "You may propose additions or merges for related entities not supplied in this batch, but never invent provenance.",
      operations: {
        MERGE_EXISTING: {
          required: ["collection", "natural_key", "patch", "evidence", "reason"],
          rule: "The natural key must resolve to exactly one existing record after normalization.",
        },
        INSERT_NEW: {
          required: ["collection", "natural_key", "record", "evidence", "reason"],
          rule: "record must satisfy the master schema entity definition and must not contain workflow fields.",
        },
        NO_PROPOSAL: {
          required: ["collection", "natural_key", "reason"],
          rule: "Use when no source-supported addition can be proposed.",
        },
      },
      merge_rules: [
        "Never overwrite a conflicting learner-facing value automatically.",
        "Deduplicate compatible array values by normalized natural key.",
        "Merge verb conjugations by mood and tense, then inspect individual person forms for conflicts.",
        "All proposed references must use existing natural keys or include an INSERT_NEW operation in the same response.",
      ],
    },
  };
}

export function generateDeepEnrichmentBatches(): { created: number; workingCopyPath: string } {
  const masterText = fs.readFileSync(SOURCE_PATH, "utf8");
  const schemaText = fs.readFileSync(SCHEMA_PATH, "utf8");
  const masterDataset = JSON.parse(masterText) as JsonObject;
  const schema = JSON.parse(schemaText) as JsonObject;
  const masterHash = sha256(masterText);
  const canonicalMasterHash = sha256(JSON.stringify(masterDataset));
  const schemaHash = sha256(schemaText);
  const workingCopy = ensureWorkingCopy(masterDataset, canonicalMasterHash);
  const batchLimit = MAX_BATCHES ?? Number.POSITIVE_INFINITY;
  let created = 0;
  let batchNumber = getNextBatchNumber();

  while (created < batchLimit) {
    const anchor = findFirstAvailableEntity(workingCopy);
    if (!anchor) break;
    const plan = buildBatchPlan(workingCopy, anchor);
    if (plan.targets.length === 0) throw new Error(`No targets were found for ${anchor.collection}:${anchor.naturalKey}.`);

    markPlanTaken(workingCopy, plan);
    const batch = buildBatchDocument(workingCopy, schema, masterHash, schemaHash, batchNumber, plan);
    const batchPath = path.join(BATCH_DIRECTORY, `DEEP_BATCH_${String(batchNumber).padStart(3, "0")}.json`);
    writeJsonAtomically(batchPath, batch);
    writeJsonAtomically(WORKING_COPY_PATH, workingCopy);

    console.log(
      `${path.basename(batchPath)}: ${plan.anchor.collection}:${plan.anchor.naturalKey} → ` +
        `${plan.targets.length} targets, ${plan.context.length} context records, ${plan.unresolvedReferences.length} unresolved references.`
    );
    created += 1;
    batchNumber += 1;
  }

  console.log(`Created ${created} deep-enrichment batch(es). Working copy: ${path.relative(PROJECT_ROOT, WORKING_COPY_PATH)}`);
  return { created, workingCopyPath: WORKING_COPY_PATH };
}

if (require.main === module) {
  generateDeepEnrichmentBatches();
}
