import fs from "fs";
import path from "path";
import { SuperDatasetRoot, SuperDatasetRootSchema } from "../dataset/schemas";

let cachedDataset: SuperDatasetRoot | null = null;

/**
 * Loads the French Grammar Super Dataset defensively.
 * Caches the parsed object in memory during server execution.
 */
export function getDataset(): SuperDatasetRoot {
  if (cachedDataset) {
    return cachedDataset;
  }

  const defaultPath = path.resolve(process.cwd(), "data/final/french_grammar.json");

  if (!fs.existsSync(defaultPath)) {
    console.warn(`Dataset file not found at ${defaultPath}. Returning empty schema default.`);
    return {
      schema_version: "1.0.0",
      dataset_id: "pmp_complete_french_grammar_revision",
      generated_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      book: {
        id: "book_pmp_complete_french_grammar",
        title: "Practice Makes Perfect: Complete French Grammar",
        author: "Annie Heminway",
        language: "French",
        instruction_language: "English",
        source_file: {
          filename: "source_book.pdf",
          page_count_pdf: 286,
        },
        chapter_ids: [],
      },
      taxonomy: {},
      chapters: [],
      sections: [],
      concepts: [],
      tenses: [],
      grammar_rules: [],
      verbs: [],
      conjugations: [],
      expressions: [],
      vocabulary: [],
      examples: [],
      exercises: [],
      study_sets: [],
      quality_report: {
        counts: {},
        unresolved_relations: [],
        duplicate_candidates: [],
        low_confidence_items: [],
        missing_answers: [],
        missing_translations: [],
        missing_gender_for_nouns: [],
        missing_conjugation_forms: [],
      },
    };
  }

  try {
    const raw = fs.readFileSync(defaultPath, "utf-8");
    const parsed = JSON.parse(raw);
    const validated = SuperDatasetRootSchema.parse(parsed);
    cachedDataset = validated;
    return validated;
  } catch (error) {
    console.error("Failed to strictly parse dataset with zod; using raw JSON fallback:", error);
    try {
      const raw = fs.readFileSync(defaultPath, "utf-8");
      const fallback = JSON.parse(raw) as SuperDatasetRoot;
      cachedDataset = fallback;
      return fallback;
    } catch {
      throw error;
    }
  }
}
