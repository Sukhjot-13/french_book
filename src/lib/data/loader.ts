import fs from "fs";
import path from "path";
import { MasterDataset } from "../dataset/masterSchema";

let cachedMasterDataset: MasterDataset | null = null;

/**
 * Loads the French Grammar Master Dataset defensively from data/MASTER_DATA.json.
 * Caches the parsed object in memory during server execution.
 */
export function getMasterDataset(): MasterDataset {
  if (cachedMasterDataset) {
    return cachedMasterDataset;
  }

  const defaultPath = path.resolve(process.cwd(), "data/MASTER_DATA.json");

  if (!fs.existsSync(defaultPath)) {
    console.warn(`Master dataset file not found at ${defaultPath}. Returning empty schema default.`);
    return {
      schema_version: "1.0.0",
      dataset_type: "french_revision_master",
      metadata: {
        dataset_name: "Complete French Grammar Master Dataset",
        book_title: "Practice Makes Perfect: Complete French Grammar",
        author: "Annie Heminway",
        language: "French",
        source_language: "French",
        target_language: "English",
        notes: "Fallback empty master dataset",
      },
      chapters: [],
      topics: [],
      concepts: [],
      grammar_rules: [],
      tenses: [],
      verbs: [],
      expressions: [],
      vocabulary: [],
      examples: [],
      exercises: [],
      exceptions_and_traps: [],
      unresolved_items: [],
      source_quality: [],
    };
  }

  try {
    const raw = fs.readFileSync(defaultPath, "utf-8");
    const parsed = JSON.parse(raw) as MasterDataset;
    cachedMasterDataset = parsed;
    return parsed;
  } catch (error) {
    console.error("Failed to parse master dataset from data/MASTER_DATA.json:", error);
    throw error;
  }
}

/**
 * Alias for backward-compatibility with existing selectors.
 */
export function getDataset(): MasterDataset {
  return getMasterDataset();
}
