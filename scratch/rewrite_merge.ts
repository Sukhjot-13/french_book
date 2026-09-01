import fs from 'fs';
import path from 'path';
import { SuperDatasetRoot, Verb, Expression, Vocabulary, Conjugation, Chapter, Section, Concept, Tense, GrammarRule, Example, Exercise, Attestation } from '../src/lib/dataset/schemas';
import { canonicalizeVerb, canonicalizeVocabularyEntry, canonicalizeExpressionEntry, mergeAttestations, deduplicateArray } from '../src/lib/dataset/canonicalize';
import { slugify, makeVerbId, makeExpressionId, makeVocabId, makeExerciseId, makeQuestionId } from '../src/lib/dataset/ids';

// Paths
const DATA_DIR = path.resolve(__dirname, '../data');
const EXTRACTED_DIR = path.join(DATA_DIR, 'extracted');
const FINAL_DIR = path.join(DATA_DIR, 'final');
const RECONCILIATION_DIR = path.join(DATA_DIR, 'reconciliation');

const INPUTS = {
  chaptersDir: path.join(EXTRACTED_DIR, 'chapters'),
  glossaryEnFr: path.join(EXTRACTED_DIR, 'backmatter', 'glossary-en-fr.json'),
  glossaryFrEn: path.join(EXTRACTED_DIR, 'backmatter', 'glossary-fr-en.json'),
  verbTables: path.join(EXTRACTED_DIR, 'backmatter', 'verb-tables.json'),
  answerKey: path.join(EXTRACTED_DIR, 'backmatter', 'answer-key.json')
};

// Ensure output dirs
if (!fs.existsSync(FINAL_DIR)) fs.mkdirSync(FINAL_DIR, { recursive: true });
if (!fs.existsSync(RECONCILIATION_DIR)) fs.mkdirSync(RECONCILIATION_DIR, { recursive: true });

// State
const master: SuperDatasetRoot = {
  schema_version: "1.0.0",
  dataset_id: "pmp_complete_french_grammar_revision",
  generated_at: "2026-09-01T00:00:00Z",
  updated_at: "2026-09-01T00:00:00Z",
  book: {
    id: "book_practice_makes_perfect_complete_french_grammar",
    title: "Practice Makes Perfect: Complete French Grammar",
    author: "Annie Heminway",
    language: "French",
    instruction_language: "English",
    source_file: { filename: "Practice Makes Perfect Complete French Grammar.pdf", page_count_pdf: 338 }
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
    counts: {}, unresolved_relations: [], duplicate_candidates: [], low_confidence_items: [],
    missing_answers: [], missing_translations: [], missing_gender_for_nouns: [], missing_conjugation_forms: []
  }
};

type Disposition = 'MERGED_EXISTING' | 'NEW_CANONICAL_ENTITY' | 'ROUTED_TO_OTHER_ENTITY_TYPE' | 'UNCERTAIN' | 'CONFLICT' | 'REJECTED_MALFORMED';

interface DispoRecord {
    source_file: string;
    source_entity_type: string;
    source_id: string;
    canonical_id: string | null;
    disposition: Disposition;
    reason: string;
}

const dispositions: DispoRecord[] = [];

function recordDisposition(source_file: string, source_entity_type: string, source_id: string, canonical_id: string | null, disposition: Disposition, reason: string) {
    dispositions.push({ source_file, source_entity_type, source_id, canonical_id, disposition, reason });
}

// Canonical maps
const verbsMap = new Map<string, Verb>();
const vocabMap = new Map<string, Vocabulary>();
const exprMap = new Map<string, Expression>();
const conjMap = new Map<string, Conjugation>();
const chapterMap = new Map<string, Chapter>();
const sectionMap = new Map<string, Section>();
const conceptMap = new Map<string, Concept>();
const tenseMap = new Map<string, Tense>();
const ruleMap = new Map<string, GrammarRule>();
const exampleMap = new Map<string, Example>();
const exerciseMap = new Map<string, Exercise>();

// ID tracking for rewriting
const localToGlobalId = new Map<string, string>(); // Format: `${source_file}::${old_id}` -> `canonical_id`
const globalIdAlias = new Map<string, string>(); // `provisional_global` -> `canonical_id` (since entities across files often share provisional IDs)

function recordMapping(sourceFile: string, entityType: string, oldId: string, canonicalId: string) {
  localToGlobalId.set(`${sourceFile}::${oldId}`, canonicalId);
  if (!globalIdAlias.has(oldId)) {
    globalIdAlias.set(oldId, canonicalId);
  }
}

function resolveId(oldId: string, sourceFile?: string): string {
  if (sourceFile) {
    const local = localToGlobalId.get(`${sourceFile}::${oldId}`);
    if (local) return local;
  }
  return globalIdAlias.get(oldId) || oldId;
}

const inputCounts: Record<string, number> = {
    chapters: 0, sections: 0, concepts: 0, tenses: 0, grammar_rules: 0, verbs: 0, conjugations: 0, expressions: 0, vocabulary: 0, examples: 0, exercises: 0, questions: 0, exceptions_and_traps: 0, uncertain_candidates: 0,
    glossary_fr_en: 0, glossary_en_fr: 0, verb_table_tables: 0, verb_table_rows: 0, answer_key_exercises: 0, answer_key_answers: 0
};

const stats = {
    answersLinked: 0, duplicateAnswerIdentities: 0, orphanAnswers: 0, missingAnswerProvenance: 0
};

const conflicts: any[] = [];
const uncertainMatches: any[] = [];

const chapterFiles = fs.readdirSync(INPUTS.chaptersDir).filter(f => f.endsWith('.json')).sort();
if (chapterFiles.length !== 27) {
  console.warn(`WARNING: Found ${chapterFiles.length} chapter files, expected 27.`);
}

for (const file of chapterFiles) {
  const filePath = path.join(INPUTS.chaptersDir, file);
  const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
  
  if (data.chapter) inputCounts.chapters++;
  inputCounts.sections += (data.sections || []).length;
  inputCounts.concepts += (data.concepts || []).length;
  inputCounts.tenses += (data.tenses || []).length;
  inputCounts.grammar_rules += (data.grammar_rules || []).length;
  inputCounts.verbs += (data.verbs || []).length;
  inputCounts.conjugations += (data.conjugations || []).length;
  inputCounts.expressions += (data.expressions || []).length;
  inputCounts.vocabulary += (data.vocabulary || []).length;
  inputCounts.examples += (data.examples || []).length;
  inputCounts.exercises += (data.exercises || []).length;
  for (const ex of (data.exercises || [])) {
      inputCounts.questions += (ex.questions || []).length;
  }
}

const vt = JSON.parse(fs.readFileSync(INPUTS.verbTables, 'utf-8'));
inputCounts.verb_table_tables = 20; 
const vtInfinitives = new Set();
vt.forEach((r: any) => vtInfinitives.add(r.verb_infinitive));
inputCounts.verb_table_rows = vtInfinitives.size; 

const ak = JSON.parse(fs.readFileSync(INPUTS.answerKey, 'utf-8'));
for (const [ch, exs] of Object.entries(ak.chapters || {})) {
    for (const [ex, ans] of Object.entries(exs as any)) {
        inputCounts.answer_key_exercises++;
        inputCounts.answer_key_answers += (ans as any[]).length;
    }
}
inputCounts.glossary_fr_en = JSON.parse(fs.readFileSync(INPUTS.glossaryFrEn, 'utf-8')).length;
inputCounts.glossary_en_fr = JSON.parse(fs.readFileSync(INPUTS.glossaryEnFr, 'utf-8')).length;
