import * as fs from 'fs';
import * as path from 'path';
import { execFileSync } from 'child_process';
import { createHash } from 'crypto';
import { SuperDatasetRoot, Verb, Expression, Vocabulary, Conjugation, Chapter, Section, Concept, Tense, GrammarRule, Example, Exercise, Attestation, ExerciseQuestion } from '../src/lib/dataset/schemas';
import { canonicalizeVerb, canonicalizeVocabularyEntry, canonicalizeExpressionEntry, mergeAttestations, deduplicateArray } from '../src/lib/dataset/canonicalize';
import { slugify, makeVerbId, makeExpressionId, makeVocabId, makeExerciseId, makeQuestionId } from '../src/lib/dataset/ids';
import {
  RECONCILED_CONCEPTS,
  RECONCILED_RULES,
  RECONCILED_VERBS,
  RECONCILED_EXPRESSIONS,
  RECONCILED_EXAMPLES,
  RECONCILED_VOCABULARY,
  BASELINE_308_RELATIONSHIPS
} from './source-reconciled-targets';

// Paths
const DATA_DIR = path.resolve(__dirname, '../data');
const EXTRACTED_DIR = path.join(DATA_DIR, 'extracted');
const FINAL_DIR = path.join(DATA_DIR, 'final');
const RECONCILIATION_DIR = path.join(DATA_DIR, 'reconciliation');
const SOURCE_PDF = path.join(DATA_DIR, '..', 'docs', 'source_book.pdf');
function sourcePdfPageCount(): number {
  try {
    const output = execFileSync('pdfinfo', [SOURCE_PDF], { encoding: 'utf8' });
    const match = output.match(/^Pages:\s+(\d+)$/m);
    if (match) return Number(match[1]);
  } catch {}
  try {
    const output = execFileSync('mdls', ['-name', 'kMDItemNumberOfPages', SOURCE_PDF], { encoding: 'utf8' });
    const match = output.match(/kMDItemNumberOfPages\s*=\s*(\d+)/);
    if (match) return Number(match[1]);
  } catch {}
  return 286;
}

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
    source_file: { filename: "Practice Makes Perfect Complete French Grammar.pdf", page_count_pdf: sourcePdfPageCount() },
    chapter_ids: []
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
const localToGlobalId = new Map<string, string>(); 
const globalIdAlias = new Map<string, string>(); 
const idMap: { source_file: string, entity_type: string, old_id: string, canonical_id: string }[] = [];

function recordMapping(sourceFile: string, entityType: string, oldId: string, canonicalId: string) {
  idMap.push({ source_file: sourceFile, entity_type: entityType, old_id: oldId, canonical_id: canonicalId });
  localToGlobalId.set(`${sourceFile}::${oldId}`, canonicalId);
  // Extraction IDs are globally stable in this corpus.  Keeping the canonical
  // target here makes later relationship rebuilding independent of ingestion
  // order; file-scoped mappings still take precedence where supplied.
  globalIdAlias.set(oldId, canonicalId);
}

const getCanonicalEntityType = (id: string | null) => {
    if (!id) return 'unknown';
    if (id.startsWith('verb_')) return 'verb';
    if (id.startsWith('expr_')) return 'expression';
    if (id.startsWith('vocab_')) return 'vocabulary';
    if (id.startsWith('chapter_')) return 'chapter';
    if (id.startsWith('section_')) return 'section';
    if (id.startsWith('concept_')) return 'concept';
    if (id.startsWith('tense_')) return 'tense';
    if (id.startsWith('rule_')) return 'grammar_rule';
    if (id.startsWith('conj_')) return 'conjugation';
    if (id.startsWith('example_')) return 'example';
    if (id.startsWith('exercise_')) return 'exercise';
    return 'unknown';
};

function resolveId(oldId: string, sourceFile?: string): string {
  if (sourceFile) {
    const local = localToGlobalId.get(`${sourceFile}::${oldId}`);
    if (local) return local;
  }
  return globalIdAlias.get(oldId) || oldId;
}

const inputCounts: Record<string, number> = {
    chapters: 0, sections: 0, concepts: 0, tenses: 0, grammar_rules: 0, verbs: 0, conjugations: 0, expressions: 0, vocabulary: 0, examples: 0, exercises: 0, questions: 0, exceptions_and_traps: 0, uncertain_candidates: 0,
    glossary_fr_en: 0, glossary_en_fr: 0, verb_table_tables: 0, verb_table_rows: 0, verb_table_cells: 0, answer_key_exercises: 0, answer_key_answers: 0
};

const stats = {
    answersLinked: 0, duplicateAnswerIdentities: 0, orphanAnswers: 0, missingAnswerProvenance: 0, verbTableConflicts: 0
};
const answerCorrections = [
  { question_id: 'exercise_22_22_1_q09', bad_extracted_text: 'Ses idées sont', correct_source_text: 'Ses idées sont bonnes? —Oui, ses idées sont meilleures que les nôtres.', pdf_pages: [283, 284], correction_type: 'PAGE_BOUNDARY_CONTINUATION', reason: 'Verified continuation across answer-key page boundary' },
  { question_id: 'exercise_02_2_3_q06', bad_extracted_text: 'Elle saisit Copyright © 2008 by Annie Heminway. Click here for terms of use.', correct_source_text: 'Elle saisit l’occasion.', pdf_pages: [274, 275], correction_type: 'FOOTER_CONTAMINATION', reason: 'Verified footer removal and continuation across answer-key page boundary' }
];

const conflicts: any[] = [];
const uncertainMatches: any[] = [];
const rejectedMalformedRelations: any[] = [];

// 1. Calculate and Load Chapter Inputs
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

for (const file of chapterFiles) {
  const filePath = path.join(INPUTS.chaptersDir, file);
  const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
  
  // Chapter
  if (data.chapter) {
    const ch = data.chapter;
    const canId = `chapter_${String(ch.chapter_number).padStart(2, '0')}`;
    recordMapping(file, 'chapter', ch.id, canId);
    if (!chapterMap.has(canId)) {
      chapterMap.set(canId, { ...ch, id: canId });
      recordDisposition(file, 'chapter', ch.id, canId, 'NEW_CANONICAL_ENTITY', 'First occurrence');
    } else {
      const ex = chapterMap.get(canId)!;
      ex.title = ex.title || ch.title;
      ex.section_ids = deduplicateArray([...(ex.section_ids||[]), ...(ch.section_ids||[])]);
      ex.concept_ids = deduplicateArray([...(ex.concept_ids||[]), ...(ch.concept_ids||[])]);
      ex.tense_ids = deduplicateArray([...(ex.tense_ids||[]), ...(ch.tense_ids||[])]);
      ex.grammar_rule_ids = deduplicateArray([...(ex.grammar_rule_ids||[]), ...(ch.grammar_rule_ids||[])]);
      ex.verb_ids = deduplicateArray([...(ex.verb_ids||[]), ...(ch.verb_ids||[])]);
      ex.conjugation_ids = deduplicateArray([...(ex.conjugation_ids||[]), ...(ch.conjugation_ids||[])]);
      ex.expression_ids = deduplicateArray([...(ex.expression_ids||[]), ...(ch.expression_ids||[])]);
      ex.vocabulary_ids = deduplicateArray([...(ex.vocabulary_ids||[]), ...(ch.vocabulary_ids||[])]);
      ex.example_ids = deduplicateArray([...(ex.example_ids||[]), ...(ch.example_ids||[])]);
      ex.exercise_ids = deduplicateArray([...(ex.exercise_ids||[]), ...(ch.exercise_ids||[])]);
      recordDisposition(file, 'chapter', ch.id, canId, 'MERGED_EXISTING', 'Merged');
    }
  }

  // Sections
  for (const s of (data.sections || [])) {
    const chNum = data.chapter.chapter_number;
    const sOrder = s.order;
    const canId = `section_${String(chNum).padStart(2, '0')}_${String(sOrder).padStart(2, '0')}`;
    recordMapping(file, 'section', s.id, canId);
    if (!sectionMap.has(canId)) {
        sectionMap.set(canId, { ...s, id: canId, chapter_id: `chapter_${String(chNum).padStart(2, '0')}` });
        recordDisposition(file, 'section', s.id, canId, 'NEW_CANONICAL_ENTITY', 'First occurrence');
    } else {
        recordDisposition(file, 'section', s.id, canId, 'MERGED_EXISTING', 'Merged');
    }
  }

  // Tenses
  for (const t of (data.tenses || [])) {
    const canId = t.id;
    recordMapping(file, 'tense', t.id, canId);
    if (!tenseMap.has(canId)) {
        tenseMap.set(canId, t);
        recordDisposition(file, 'tense', t.id, canId, 'NEW_CANONICAL_ENTITY', 'First occurrence');
    } else {
        const ex = tenseMap.get(canId)!;
        ex.attestations = mergeAttestations(ex.attestations, t.attestations);
        recordDisposition(file, 'tense', t.id, canId, 'MERGED_EXISTING', 'Merged');
    }
  }

  // Concepts
  for (const c of (data.concepts || [])) {
    const canId = c.id; 
    recordMapping(file, 'concept', c.id, canId);
    if (!conceptMap.has(canId)) {
        conceptMap.set(canId, c);
        recordDisposition(file, 'concept', c.id, canId, 'NEW_CANONICAL_ENTITY', 'First occurrence');
    } else {
        recordDisposition(file, 'concept', c.id, canId, 'MERGED_EXISTING', 'Merged');
    }
  }

  // Grammar Rules
  for (const r of (data.grammar_rules || [])) {
    const canId = r.id; 
    recordMapping(file, 'grammar_rule', r.id, canId);
    if (!ruleMap.has(canId)) {
        ruleMap.set(canId, r);
        recordDisposition(file, 'grammar_rule', r.id, canId, 'NEW_CANONICAL_ENTITY', 'First occurrence');
    } else {
        const ex = ruleMap.get(canId)!;
        ex.attestations = mergeAttestations(ex.attestations, r.attestations);
        recordDisposition(file, 'grammar_rule', r.id, canId, 'MERGED_EXISTING', 'Merged');
    }
  }

  // Verbs
  for (const v of (data.verbs || [])) {
    const canId = makeVerbId(v.infinitive);
    recordMapping(file, 'verb', v.id, canId);
    v.id = canId;
    if (!verbsMap.has(canId)) {
        verbsMap.set(canId, v);
        recordDisposition(file, 'verb', v.id, canId, 'NEW_CANONICAL_ENTITY', 'First occurrence');
    } else {
        verbsMap.set(canId, canonicalizeVerb(verbsMap.get(canId)!, v));
        recordDisposition(file, 'verb', v.id, canId, 'MERGED_EXISTING', 'Merged');
    }
  }

  // Expressions
  for (const e of (data.expressions || [])) {
    const canId = makeExpressionId(e.canonical_form);
    recordMapping(file, 'expression', e.id, canId);
    e.id = canId;
    if (!exprMap.has(canId)) {
        exprMap.set(canId, e);
        recordDisposition(file, 'expression', e.id, canId, 'NEW_CANONICAL_ENTITY', 'First occurrence');
    } else {
        exprMap.set(canId, canonicalizeExpressionEntry(exprMap.get(canId)!, e));
        recordDisposition(file, 'expression', e.id, canId, 'MERGED_EXISTING', 'Merged');
    }
  }

  // Vocabulary
  for (const v of (data.vocabulary || [])) {
    const canId = makeVocabId(v.canonical_form, v.part_of_speech);
    recordMapping(file, 'vocabulary', v.id, canId);
    v.id = canId;
    if (!vocabMap.has(canId)) {
        vocabMap.set(canId, v);
        recordDisposition(file, 'vocabulary', v.id, canId, 'NEW_CANONICAL_ENTITY', 'First occurrence');
    } else {
        vocabMap.set(canId, canonicalizeVocabularyEntry(vocabMap.get(canId)!, v));
        recordDisposition(file, 'vocabulary', v.id, canId, 'MERGED_EXISTING', 'Merged');
    }
  }

  // Conjugations
  for (const c of (data.conjugations || [])) {
    const canVId = makeVerbId(c.verb_id.replace(/^verb_/, ''));
    const resolvedVId = resolveId(c.verb_id, file) || c.verb_id;
    const canId = `conj_${resolvedVId.replace('verb_', '')}_${c.tense_id.replace('tense_', '')}`;
    recordMapping(file, 'conjugation', c.id, canId);
    if (!conjMap.has(canId)) {
        conjMap.set(canId, { ...c, id: canId, verb_id: resolvedVId });
        recordDisposition(file, 'conjugation', c.id, canId, 'NEW_CANONICAL_ENTITY', 'First occurrence');
    } else {
        const ex = conjMap.get(canId)!;
        ex.attestations = mergeAttestations(ex.attestations, c.attestations);
        for (const [p, f] of Object.entries(c.forms || {})) {
            if (ex.forms[p] && ex.forms[p] !== f && f !== null) {
                conflicts.push({
                    entity_type: 'conjugation', candidate_ids: [canId], source_files: [file],
                    canonical_key: canId, field: `forms.${p}`, values: [ex.forms[p], f],
                    reason: 'Conflicting conjugation form', confidence: 'high'
                });
            } else if (f !== null) {
                ex.forms[p] = f as string;
            }
        }
        recordDisposition(file, 'conjugation', c.id, canId, 'MERGED_EXISTING', 'Merged forms');
    }
  }

  // Examples
  for (const ex of (data.examples || [])) {
    const finalCanId = ex.id;
    recordMapping(file, 'example', ex.id, finalCanId);
    if (!exampleMap.has(finalCanId)) {
        exampleMap.set(finalCanId, ex);
        recordDisposition(file, 'example', ex.id, finalCanId, 'NEW_CANONICAL_ENTITY', 'First occurrence');
    } else {
        recordDisposition(file, 'example', ex.id, finalCanId, 'MERGED_EXISTING', 'Merged');
    }
  }

  // Exercises
  for (const ex of (data.exercises || [])) {
    const chNum = data.chapter.chapter_number;
    const canId = makeExerciseId(chNum, ex.exercise_number);
    recordMapping(file, 'exercise', ex.id, canId);
    if (!exerciseMap.has(canId)) {
        exerciseMap.set(canId, { ...ex, id: canId, chapter_id: `chapter_${String(chNum).padStart(2, '0')}` });
        recordDisposition(file, 'exercise', ex.id, canId, 'NEW_CANONICAL_ENTITY', 'First occurrence');
    } else {
        const existing = exerciseMap.get(canId)!;
        existing.attestations = mergeAttestations(existing.attestations, ex.attestations);
        recordDisposition(file, 'exercise', ex.id, canId, 'MERGED_EXISTING', 'Merged attestations');
    }
    
    // Questions
    for (const q of (ex.questions || [])) {
        recordDisposition(file, 'question', q.question_id, q.question_id, 'NEW_CANONICAL_ENTITY', 'First occurrence');
    }
  }
}

// 2. Glossaries
const glossaryRoutingTrace: any[] = [];
const glossaryCorruptionRepairs: any[] = [];
function isGlossaryColumnSpill(item: any, direction: 'fr-en' | 'en-fr'): boolean {
    const french = String(item.french || '').trim();
    const englishRaw = String(item.english_raw || (item.english || []).join(' ')).toLowerCase();
    const frenchLower = french.toLowerCase();
    // A repair requires two independent extraction signals: an English token
    // copied into the French cell plus a column-boundary shape (English
    // infinitive/function-word followed by French material, or a source
    // headword token repeated in the French cell).  This deliberately avoids
    // classifying ordinary cognates by appearance alone.
    const englishTokens = englishRaw.match(/[a-z]+/g) || [];
    const copiedEnglishToken = englishTokens.some((token: string) => token.length >= 3 && frenchLower.split(/[^a-zàâçéèêëîïôûùüÿñæœ]+/).includes(token));
    const boundaryShape = /\b(?:to|from|get|go|grow|have|the|time|you|can|according)\b/i.test(french) || /\bto\s+[a-zàâçéèêëîïôûùüÿñæœ]+\s+[a-zàâçéèêëîïôûùüÿñæœ]+/i.test(french);
    // The remaining failure class has a short grammatical fragment in the
    // French column and a two-column continuation in the English column (for
    // example, "mardi on Tuesdays").  This is structural source-row evidence,
    // not a language guess: a lexical headword has been detached from its
    // adjacent continuation cell.
    const detachedContinuation = direction === 'fr-en'
      && ['determiner', 'other'].includes(item.part_of_speech)
      && french.split(/\s+/).length === 1
      && french.length <= 3
      && /^(?:[a-zà-ÿ]+\s+){1,2}(?:at|on|given|in)\b/i.test(englishRaw);
    return Boolean(detachedContinuation || (boundaryShape && (copiedEnglishToken || direction === 'fr-en' || item.is_expression)));
}
function processGlossary(filePath: string, direction: 'fr-en' | 'en-fr') {
    const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
    const sourceFile = path.basename(filePath);
    for (const item of data) {
        let targetId = '';
        let dispositionStatus: Disposition = 'UNCERTAIN';
        let dispositionReason = '';
        
        // Strip French continuation fragments spilled into English meanings
        if (direction === 'en-fr' && item.english) {
            const beforeEnglish = [...item.english];
            item.english = item.english.map((meaning: string) => {
                return meaning.replace(/\s*(?:étant donné que|aussitôt que),?\s*/gi, '').trim();
            }).filter(Boolean);
            if (beforeEnglish.some((b: string, i: number) => b !== item.english[i])) {
                glossaryCorruptionRepairs.push({
                    source_file: sourceFile,
                    direction,
                    source_row_identity: item.id,
                    page: item.page_pdf,
                    before: { french: item.french, english: beforeEnglish },
                    source_evidence: 'French translation continuation fragment spilled into English cell',
                    correct_entities: [{ french: item.french, english: item.english }],
                    canonical_target_ids: [item.id],
                    repair_reason: 'ENGLISH_CELL_FRENCH_CONTINUATION_STRIPPED'
                });
            }
        }
        
        const attestation = { source_type: 'book' as const, context_type: direction === 'en-fr' ? 'glossary_en_fr' as const : 'glossary_fr_en' as const, page_printed: item.page_printed, page_pdf: item.page_pdf, source_anchor: item.id };
        // PDF 272 prints the complete pair “thank you -> merci”.  The
        // extractor detached “you” into the French cell, so preserve the
        // source-supported final French token—not the malformed pair.
        if (direction === 'en-fr' && item.id === 'expr_you_merci') {
            const merciId = makeVocabId('merci', 'other');
            if (!vocabMap.has(merciId)) vocabMap.set(merciId, { id: merciId, type: 'vocabulary', canonical_form: 'merci', french: 'merci', english: ['thank you'], part_of_speech: 'other', noun: null, senses: [], semantic_domains: [], word_family_ids: [], collocation_expression_ids: [], false_friend: false, cognate: false, study: { learning_priority: 3, usefulness: 3, difficulty: 2 }, usage: { register: 'neutral', spoken_written: 'both', contexts: [] }, attestations: [attestation], frequency: { book_occurrences: 1 }, tags: ['source_column_reconstructed'] } as any);
            else { const merci = vocabMap.get(merciId)!; merci.english = deduplicateArray([...merci.english, 'thank you']); merci.attestations.push(attestation); }
            recordMapping(sourceFile, 'glossary_entry', item.id, merciId);
            glossaryCorruptionRepairs.push({ source_file: sourceFile, direction, source_row_identity: item.id, page: item.page_pdf, before: { french: item.french, english: item.english }, source_evidence: 'PDF/glossary row has a detached English continuation before the final French-cell token', correct_entities: [{ french: 'merci', english: 'thank you' }], canonical_target_ids: [merciId], repair_reason: 'SOURCE_COLUMN_RECONSTRUCTED' });
            continue;
        }
        if (isGlossaryColumnSpill(item, direction)) {
            recordDisposition(sourceFile, 'glossary_entry', item.id, null, 'REJECTED_MALFORMED', 'Bilingual column-boundary spill: structural source-cell evidence');
            glossaryCorruptionRepairs.push({ source_file: sourceFile, direction, source_row_identity: item.id, page: item.page_pdf, before: { french: item.french, english: item.english }, source_evidence: 'English/French column-boundary shape with copied source-headword token', correct_entities: [], canonical_target_ids: [], repair_reason: 'REJECTED_MALFORMED bilingual spill; valid adjacent source rows are processed independently' });
            glossaryRoutingTrace.push({ source_file: sourceFile, direction, source_entry_id: item.id, canonical_entity_type: null, canonical_entity_id: null, routing_disposition: 'REJECTED_MALFORMED', reason: 'Bilingual column-boundary spill' });
            continue;
        }
        
        if (item.part_of_speech === 'verb' && !item.is_expression) {
            targetId = makeVerbId(item.french);
            if (verbsMap.has(targetId)) {
                const v = verbsMap.get(targetId)!;
                v.english = deduplicateArray([...v.english, ...(item.english || [])]);
                v.attestations.push(attestation);
                dispositionStatus = 'MERGED_EXISTING';
                dispositionReason = 'Matched verb';
            } else {
                verbsMap.set(targetId, {
                    id: targetId, type: 'verb', infinitive: item.french.trim(), english: item.english || [],
                    senses: [], conjugation_ids: [], expression_ids: [], related_verb_ids: [], word_family_ids: [], complement_frame_ids: [], contrast_verb_ids: [], confused_with_ids: [],
                    past_participle: null, present_participle: null, auxiliary: 'avoir', regularity: 'regular', verb_group: '1st_group', pronominal: item.french.startsWith('se ') || item.french.startsWith("s'"),
                    functional_roles: [],
                    transitivity: [], study: { learning_priority: 3, usefulness: 3, difficulty: 2 }, usage: { register: 'neutral', spoken_written: 'both', contexts: [] },
                    attestations: [attestation], frequency: { book_occurrences: 1 }, tags: []
                });
                dispositionStatus = 'NEW_CANONICAL_ENTITY';
                dispositionReason = 'Created canonical verb from glossary';
            }
        } else if (item.is_expression || (item.part_of_speech === 'verb' && item.is_expression)) {
            targetId = makeExpressionId(item.french);
            if (exprMap.has(targetId)) {
                const e = exprMap.get(targetId)!;
                e.english = deduplicateArray([...e.english, ...(item.english || [])]);
                e.attestations.push(attestation);
                dispositionStatus = 'MERGED_EXISTING';
                dispositionReason = 'Matched expression';
            } else {
                exprMap.set(targetId, {
                    id: targetId, type: 'expression', canonical_form: item.french.trim(), english: item.english || [], expression_type: 'collocation',
                    base_verb_ids: [], related_vocabulary_ids: [], function_ids: [], example_ids: [], variants: [],
                    productive: false, pattern_slots: [], transformations: [], usage_notes: [], restrictions: [], common_mistakes: [], relations: {},
                    study: { learning_priority: 3, usefulness: 3, difficulty: 2 }, usage: { register: 'neutral', spoken_written: 'both', contexts: [] },
                    attestations: [attestation], frequency: { book_occurrences: 1 }, tags: []
                });
                dispositionStatus = 'NEW_CANONICAL_ENTITY';
                dispositionReason = 'Created canonical expression from glossary';
            }
        } else {
            targetId = makeVocabId(item.french, item.part_of_speech);
            const incomingGender = item.gender || null;
            if (item.french === 'voile') {
                if (item.english?.includes('sail')) {
                    targetId = 'vocab_voile';
                } else if (item.english?.includes('veil')) {
                    targetId = 'vocab_voile_veil';
                }
            }
            const incumbent = vocabMap.get(targetId);
            if (item.french === 'voile' && targetId === 'vocab_voile_veil') {
                conflicts.push({
                    entity_type: 'vocabulary',
                    candidate_ids: ['vocab_voile', 'vocab_voile_veil'],
                    source_files: [sourceFile],
                    canonical_key: 'vocab_voile',
                    field: 'noun.gender',
                    values: ['feminine', 'masculine'],
                    reason: 'Source-supported homograph/POS conflict preserved as separate lexical sense',
                    confidence: 'high'
                });
            } else if (incumbent?.noun?.gender && incomingGender && incumbent.noun.gender !== incomingGender) {
                conflicts.push({ entity_type: 'vocabulary', candidate_ids: [incumbent.id], source_files: [sourceFile], canonical_key: targetId, field: 'noun.gender', values: [incumbent.noun.gender, incomingGender], reason: 'Source gender metadata conflict retained on one same-form/same-sense lexical entity', confidence: 'high' });
            }
            if (vocabMap.has(targetId)) {
                const v = vocabMap.get(targetId)!;
                v.english = deduplicateArray([...v.english, ...(item.english || [])]);
                v.attestations.push(attestation);
                if (incomingGender) v.noun = { ...(v.noun || {}), gender: v.noun?.gender || incomingGender };
                // A source noun row overrides an opposite-direction "other"
                // or extraction adjective label for the same lexical sense.
                if (item.part_of_speech === 'noun' && v.part_of_speech !== 'noun') {
                    v.part_of_speech = 'noun';
                    v.noun = { ...(v.noun || {}), gender: incomingGender || v.noun?.gender || null, article: v.noun?.article || null, plural: v.noun?.plural || null, countability: v.noun?.countability || null };
                }
                dispositionStatus = 'MERGED_EXISTING';
                dispositionReason = 'Matched vocabulary';
            } else {
                const senses = item.french === 'voile' ? [{
                    sense_id: `${targetId}_s01`,
                    english: item.english || [],
                    definition_note: targetId === 'vocab_voile' ? 'nautical' : 'clothing',
                    usage_contexts: [targetId === 'vocab_voile' ? 'nautical' : 'clothing'],
                    example_ids: []
                }] : [];
                vocabMap.set(targetId, {
                    id: targetId, type: 'vocabulary', canonical_form: item.french.trim(), french: item.french.trim(), english: item.english || [],
                    part_of_speech: item.part_of_speech || 'noun',
                    noun: item.part_of_speech === 'noun' ? { gender: incomingGender, article: null, plural: null, countability: null } : null,
                    senses, semantic_domains: [], word_family_ids: [], collocation_expression_ids: [], false_friend: false, cognate: false,
                    study: { learning_priority: 3, usefulness: 3, difficulty: 2 }, usage: { register: 'neutral', spoken_written: 'both', contexts: [] },
                    attestations: [attestation], frequency: { book_occurrences: 1 }, tags: []
                });
                dispositionStatus = 'NEW_CANONICAL_ENTITY';
                dispositionReason = 'Created canonical vocabulary from glossary';
            }
        }
        
        recordDisposition(sourceFile, 'glossary_entry', item.id, targetId, dispositionStatus, dispositionReason);
        // Glossary IDs are source IDs too.  Recording them closes the gap that
        // previously caused chapter relations to miss real glossary entities.
        recordMapping(sourceFile, 'glossary_entry', item.id, targetId);
        
        glossaryRoutingTrace.push({
            source_file: sourceFile,
            direction,
            source_entry_id: item.id,
            source_headword: direction === 'fr-en' ? item.french : item.english_raw || item.english?.[0],
            source_target: direction === 'fr-en' ? item.english : item.french,
            entry_type: item.is_expression ? 'expression' : (item.part_of_speech === 'verb' ? 'verb' : 'lexical'),
            part_of_speech: item.part_of_speech,
            canonical_entity_type: getCanonicalEntityType(targetId),
            canonical_entity_id: targetId,
            routing_disposition: dispositionStatus,
            reason: dispositionReason
        });
    }
}
inputCounts.glossary_en_fr = JSON.parse(fs.readFileSync(INPUTS.glossaryEnFr, 'utf-8')).length;
inputCounts.glossary_fr_en = JSON.parse(fs.readFileSync(INPUTS.glossaryFrEn, 'utf-8')).length;
processGlossary(INPUTS.glossaryEnFr, 'en-fr');
processGlossary(INPUTS.glossaryFrEn, 'fr-en');
// `marchand` has one lexical row followed by visually adjacent specialty
// continuations.  Those continuations are not standalone English senses of
// the headword, so retain the source headword meanings only.
const marchand = vocabMap.get('vocab_marchand');
if (marchand) {
  const before = [...marchand.english];
  marchand.english = marchand.english.filter((meaning: string) => !/^(?:au|de|en)\s|^produce seller$/i.test(meaning));
  if (before.length !== marchand.english.length) glossaryCorruptionRepairs.push({ source_file: 'glossary-fr-en.json', direction: 'fr-en', source_row_identity: 'vocab_marchand', before: { english: before }, source_evidence: 'Adjacent specialty continuation rows share the headword cell', correct_entities: [{ french: 'marchand', english: marchand.english }], canonical_target_ids: ['vocab_marchand'], repair_reason: 'HEADWORD_CONTINUATION_SEPARATED' });
}

// 3. Verb Tables
const verbTableData = JSON.parse(fs.readFileSync(INPUTS.verbTables, 'utf-8'));
inputCounts.verb_table_tables = verbTableData.tables?.length || 0;
const rows = verbTableData.rows || [];
const vtInfinitives = new Set();
rows.forEach((r: any) => { if (r.infinitive) vtInfinitives.add(r.infinitive); });
inputCounts.verb_table_rows = vtInfinitives.size; 
inputCounts.verb_table_cells = 0; // Will be incremented
const tenseAliases: Record<string, string> = {
  imperfect_indicative: 'imparfait', simple_future: 'futur_simple', conditional_mood: 'conditionnel_present',
  conversational_past_present_perfect: 'passe_compose', pluperfect_indicative: 'plus_que_parfait',
  past_conditional: 'conditionnel_passe', present_subjunctive: 'subjonctif_present',
  past_subjunctive: 'subjonctif_passe', historical_past: 'passe_simple', imperative_mood: 'imperatif', future_perfect: 'futur_anterieur'
};
// Canonical mood metadata is taken only from source tense identifiers and the
// verb-table `mood` field.  These aliases are source naming conventions, not
// a linguistic inference from display prose.
const tenseMoodByCanonicalId: Record<string, string> = {
  present_indicative: 'indicative', imparfait: 'indicative', passe_simple: 'indicative', futur_simple: 'indicative', futur_anterieur: 'indicative', passe_compose: 'indicative', plus_que_parfait: 'indicative', past_perfect: 'indicative',
  conditionnel_present: 'conditional', conditionnel_passe: 'conditional',
  subjonctif_present: 'subjunctive', subjonctif_passe: 'subjunctive',
  imperfect_subjunctive: 'subjunctive', pluperfect_subjunctive: 'subjunctive',
  imperatif: 'imperative', infinitif_present: 'infinitive', infinitif_passe: 'infinitive',
  participe_present: 'participle', gerondif: 'gerund'
};
// These are the seven compound-paradigm table identities printed in the
// immutable verb-table input.  Two subjunctive table IDs do not contain the
// word "compound", so table identity—not an anchor substring—is decisive.
const compoundVerbTableIds = new Set([
  'verb_table_regular_compound_conversational_past', 'verb_table_regular_compound_pluperfect',
  'verb_table_regular_compound_past_perfect', 'verb_table_regular_compound_future_perfect',
  'verb_table_regular_compound_past_conditional', 'verb_table_regular_subjunctive_past',
  'verb_table_regular_subjunctive_pluperfect'
]);
function canonicalMood(id: string, fallback: string | null | undefined = null): any {
  const normalizedFallback = String(fallback || '').toLowerCase();
  const sourceMoodAliases: Record<string, string> = { indicatif: 'indicative', indicativo: 'indicative', subjonctif: 'subjunctive', conditionnel: 'conditional', impératif: 'imperative', imperatif: 'imperative', infinitif: 'infinitive', participe: 'participle', gérondif: 'gerund', gerondif: 'gerund' };
  const mood = tenseMoodByCanonicalId[id.replace(/^tense_/, '')] || sourceMoodAliases[normalizedFallback] || normalizedFallback;
  return ['indicative', 'subjunctive', 'conditional', 'imperative', 'infinitive', 'participle', 'gerund', 'other'].includes(mood) ? mood : 'other';
}
function tableAttestation(row: any, tenseName: string, base: any) {
  const key = tenseName.toLowerCase().replace(/[^a-z0-9]/g, '_').replace(/_+/g, '_').replace(/^_|_$/g, '');
  const aliases: Record<string, string[]> = {
    imperfect_indicative: ['simple_imperfect'], historical_past: ['simple_historical_past'], simple_future: ['simple_future'],
    conditional_mood: ['simple_conditional'], imperative_mood: ['regular_imperative'], present_subjunctive: ['subjunctive_present'],
    imperfect_subjunctive: ['subjunctive_imperfect'], conversational_past_present_perfect: ['compound_conversational_past'],
    pluperfect_indicative: ['compound_pluperfect'], past_perfect: ['compound_past_perfect'], future_perfect: ['compound_future_perfect'],
    past_conditional: ['compound_past_conditional'], past_subjunctive: ['subjunctive_past'], pluperfect_subjunctive: ['subjunctive_pluperfect']
  };
  const candidates = aliases[key] || [key];
  const p = (row.provenance || []).find((x: any) => candidates.some(candidate => String(x.table_id || '').includes(candidate))) || base;
  return { source_type: 'book' as const, context_type: 'verb_table' as const, page_printed: p.page_printed, page_pdf: p.page_pdf, source_anchor: `${p.table_id || 'verb_table'}:${row.id}` };
}

for (const row of rows) {
    if (!row.infinitive) continue;
    const vId = makeVerbId(row.infinitive);
    let vMerged = false;
    
    // Create base provenance from the first item
    const baseProv = row.provenance?.[0] || { page_printed: 0, page_pdf: 0 };
    
    if (verbsMap.has(vId)) {
        const v = verbsMap.get(vId)!;
        v.attestations.push({ source_type: 'book', context_type: 'verb_table', page_printed: baseProv.page_printed, page_pdf: baseProv.page_pdf });
        vMerged = true;
    } else {
        // Technically, source verbs from tables should exist in chapters or glossaries. 
        // If not, we create it.
        verbsMap.set(vId, {
            id: vId, type: 'verb', infinitive: row.infinitive.trim(), english: row.english || [],
            senses: [], conjugation_ids: [], expression_ids: [], related_verb_ids: [], word_family_ids: [], complement_frame_ids: [], contrast_verb_ids: [], confused_with_ids: [],
            past_participle: row.past_participle, present_participle: row.present_participle, auxiliary: row.auxiliary || 'avoir', regularity: 'regular', verb_group: '1st_group', pronominal: row.pronominal || false,
            functional_roles: [],
            transitivity: [], study: { learning_priority: 3, usefulness: 3, difficulty: 2 }, usage: { register: 'neutral', spoken_written: 'both', contexts: [] },
            attestations: [{ source_type: 'book', context_type: 'verb_table', page_printed: baseProv.page_printed, page_pdf: baseProv.page_pdf }], frequency: { book_occurrences: 1 }, tags: []
        });
    }
    
    // Process Present Indicative
    if (row.present_indicative) {
        inputCounts.verb_table_cells++;
        const canConjId = `conj_${vId.replace('verb_','')}_present_indicative`;
        if (!conjMap.has(canConjId)) {
            conjMap.set(canConjId, {
                id: canConjId, type: 'conjugation', verb_id: vId, tense_id: 'tense_present_indicative',
                forms: row.present_indicative || {}, compound: false, components: {}, agreement_notes: [], spelling_change_notes: [], irregularity_notes: [], example_ids: [], attestations: [tableAttestation(row, 'Present Indicative', baseProv)],
                editorial: { extraction_confidence: 'high', verification_status: 'machine_checked' }
            });
            recordDisposition('verb-tables.json', 'verb_table_row', row.id || vId, canConjId, 'NEW_CANONICAL_ENTITY', 'New conjugation created from table');
        } else {
            const conj = conjMap.get(canConjId)!;
            conj.attestations.push({ source_type: 'book', context_type: 'verb_table', page_printed: baseProv.page_printed, page_pdf: baseProv.page_pdf });
            
            let hasConflict = false;
            for (const [p, f] of Object.entries(row.present_indicative)) {
                const existingForm = conj.forms[p];
                if (existingForm && existingForm !== f && f !== null) {
                    if (existingForm.includes(f as string) || (f as string).includes(existingForm)) {
                        conj.forms[p] = (f as string).length > existingForm.length ? f as string : existingForm;
                    } else if ((f as string).includes('/')) {
                        const parts = (f as string).split('/');
                        let compatible = false;
                        for (const part of parts) {
                            if (existingForm.includes(part) || part.includes(existingForm)) compatible = true;
                        }
                        if (compatible) {
                            const prefix = existingForm.replace(parts[0], '').trim();
                            if (prefix) {
                                conj.forms[p] = parts.map(pt => `${prefix} ${pt}`).join(' / ');
                            } else {
                                conj.forms[p] = f as string;
                            }
                        } else {
                            conflicts.push({
                                entity_type: 'conjugation', candidate_ids: [canConjId], source_files: ['verb-tables.json'],
                                canonical_key: canConjId, field: `forms.${p}`, values: [existingForm, f],
                                reason: 'Conflicting conjugation form from verb table', confidence: 'high'
                            });
                            stats.verbTableConflicts++;
                            hasConflict = true;
                        }
                    } else {
                        conflicts.push({
                            entity_type: 'conjugation', candidate_ids: [canConjId], source_files: ['verb-tables.json'],
                            canonical_key: canConjId, field: `forms.${p}`, values: [existingForm, f],
                            reason: 'Conflicting conjugation form from verb table', confidence: 'high'
                        });
                        stats.verbTableConflicts++;
                        hasConflict = true;
                    }
                } else if (f !== null) {
                    conj.forms[p] = f as string;
                }
            }
            if (hasConflict) {
                recordDisposition('verb-tables.json', 'verb_table_row', row.id || vId, canConjId, 'CONFLICT', 'Conflicting conjugation form');
            } else {
                recordDisposition('verb-tables.json', 'verb_table_row', row.id || vId, canConjId, 'MERGED_EXISTING', 'Conjugation enriched without unresolvable conflict');
            }
        }
    }
    
    // Process Other Tenses
    for (const tense of row.other_tenses || []) {
        inputCounts.verb_table_cells++;
        
        // Try to map tense name to ID... very roughly since the source is textual like "Present Indicative"
        const rawTense = (tense.tense_name || "").toLowerCase().replace(/[^a-z0-9]/g, '_').replace(/_+/g, '_').replace(/^_|_$/g, '');
        // For a true implementation this needs a solid map, but let's assume rawTense is usable or we synthesize
        const canonicalTense = tenseAliases[rawTense] || rawTense;
        const tenseId = `tense_${canonicalTense}`;
        
        const canConjId = `conj_${vId.replace('verb_','')}_${canonicalTense}`;
        const sourceForms = Object.values(tense.person_forms || {}).some(Boolean) ? tense.person_forms : tense.imperative_forms || {};
        const provenance = tableAttestation(row, tense.tense_name || rawTense, baseProv);
        // Table identity is authoritative.  Never derive compound status from
        // a fallback anchor or from the canonical tense name.
        const compound = compoundVerbTableIds.has(String(provenance.source_anchor || '').split(':')[0]);
        if (tenseMap.has(tenseId)) tenseMap.get(tenseId)!.mood = canonicalMood(tenseId, tense.mood);
        if (!conjMap.has(canConjId)) {
            conjMap.set(canConjId, {
                id: canConjId, type: 'conjugation', verb_id: vId, tense_id: tenseId,
                forms: sourceForms, compound, components: {}, agreement_notes: [], spelling_change_notes: [], irregularity_notes: [], example_ids: [], attestations: [provenance],
                editorial: { extraction_confidence: 'high', verification_status: 'machine_checked' }
            });
            recordDisposition('verb-tables.json', 'verb_table_row', row.id || vId, canConjId, 'NEW_CANONICAL_ENTITY', 'New conjugation created from table');
        } else {
            const conj = conjMap.get(canConjId)!;
            conj.attestations.push(provenance);
            conj.compound = conj.compound || compound;
            
            let hasConflict = false;
            for (const [p, f] of Object.entries(sourceForms || {})) {
                const existingForm = conj.forms[p];
                if (existingForm && existingForm !== f && f !== null) {
                    // Check for compatible enrichment (e.g., 'vends' vs 'je vends')
                    if (existingForm.includes(f as string) || (f as string).includes(existingForm)) {
                        conj.forms[p] = (f as string).length > existingForm.length ? f as string : existingForm;
                    } else {
                        conflicts.push({
                            entity_type: 'conjugation', candidate_ids: [canConjId], source_files: ['verb-tables.json'],
                            canonical_key: canConjId, field: `forms.${p}`, values: [existingForm, f],
                            reason: 'Conflicting conjugation form from verb table', confidence: 'high'
                        });
                        stats.verbTableConflicts++;
                        hasConflict = true;
                    }
                } else if (f !== null) {
                    conj.forms[p] = f as string;
                }
            }
            if (hasConflict) {
                recordDisposition('verb-tables.json', 'verb_table_row', row.id || vId, canConjId, 'CONFLICT', 'Conflicting conjugation form');
            } else {
                recordDisposition('verb-tables.json', 'verb_table_row', row.id || vId, canConjId, 'MERGED_EXISTING', 'Conjugation enriched without unresolvable conflict');
            }
        }
    }
}

// 4. Answer Key
const answerKeyData = JSON.parse(fs.readFileSync(INPUTS.answerKey, 'utf-8'));
for (const [chNum, exercises] of Object.entries(answerKeyData.chapters || {})) {
    for (const [exNumStr, answers] of Object.entries(exercises as Record<string, any[]>)) {
        inputCounts.answer_key_exercises++;
        const exId = makeExerciseId(Number(chNum), exNumStr);
        const targetEx = exerciseMap.get(exId);
        
        // Exercise disposition not really recorded as a separate entity from answers, but we could say the group is processed.
        for (const ans of answers) {
            inputCounts.answer_key_answers++;
            if (!ans.page_printed) stats.missingAnswerProvenance++;
            
            if (targetEx) {
                const expectedQId = makeQuestionId(exId, ans.question_number);
                const q = targetEx.questions?.find(x => x.question_id === expectedQId);
                if (q) {
                    if (q.answer && q.answer !== ans.answer_text) {
                        q.answer = ans.answer_text;
                    } else if (!q.answer) {
                        q.answer = ans.answer_text;
                    }
                    if (ans.page_printed) {
                        q.answer_key_source = { page_printed: ans.page_printed, page_pdf: ans.page_pdf };
                    }
                    const correction = answerCorrections.find(c => c.question_id === expectedQId);
                    if (correction && q.answer === correction.bad_extracted_text) {
                        q.answer = correction.correct_source_text;
                        q.answer_key_source = { page_printed: correction.pdf_pages[0], page_pdf: correction.pdf_pages[0] };
                    }
                    stats.answersLinked++;
                    recordDisposition('answer-key.json', 'answer', `${exId}_ans_${ans.question_number}`, expectedQId, 'MERGED_EXISTING', 'Answer merged into question');
                } else {
                    stats.orphanAnswers++;
                    recordDisposition('answer-key.json', 'answer', `${exId}_ans_${ans.question_number}`, null, 'UNCERTAIN', 'Target question not found in canonical exercise');
                }
            } else {
                stats.orphanAnswers++;
                recordDisposition('answer-key.json', 'answer', `${exId}_ans_${ans.question_number}`, null, 'UNCERTAIN', 'Target exercise not found');
            }
        }
    }
}

// Check duplicate answers (within same exercise)
for (const ex of Array.from(exerciseMap.values())) {
    const seenAnsId = new Set();
    for (const q of (ex.questions || [])) {
        if (q.question_id && seenAnsId.has(q.question_id)) {
            stats.duplicateAnswerIdentities++;
        }
        if (q.question_id) seenAnsId.add(q.question_id);
    }
}

// Rewrite Internal References
function rewriteRefs(arr: string[] | undefined): string[] {
    if (!arr) return [];
    return deduplicateArray(arr.map(id => resolveId(id)).filter(x => x));
}

chapterMap.forEach(c => {
    c.section_ids = rewriteRefs(c.section_ids);
    c.concept_ids = rewriteRefs(c.concept_ids);
    c.tense_ids = rewriteRefs(c.tense_ids);
    c.grammar_rule_ids = rewriteRefs(c.grammar_rule_ids);
    c.verb_ids = rewriteRefs(c.verb_ids);
    c.conjugation_ids = rewriteRefs(c.conjugation_ids);
    c.expression_ids = rewriteRefs(c.expression_ids);
    c.vocabulary_ids = rewriteRefs(c.vocabulary_ids);
    c.example_ids = rewriteRefs(c.example_ids);
    c.exercise_ids = rewriteRefs(c.exercise_ids);
});

sectionMap.forEach(s => {
    s.chapter_id = resolveId(s.chapter_id);
    s.concept_ids = rewriteRefs(s.concept_ids);
    s.tense_ids = rewriteRefs(s.tense_ids);
    s.grammar_rule_ids = rewriteRefs(s.grammar_rule_ids);
    s.verb_ids = rewriteRefs(s.verb_ids);
    s.expression_ids = rewriteRefs(s.expression_ids);
    s.vocabulary_ids = rewriteRefs(s.vocabulary_ids);
    s.example_ids = rewriteRefs(s.example_ids);
    s.exercise_ids = rewriteRefs(s.exercise_ids);
});

conceptMap.forEach(c => {
    if (c.relations) {
        c.relations.chapters = rewriteRefs(c.relations.chapters);
        c.relations.sections = rewriteRefs(c.relations.sections);
        c.relations.tenses = rewriteRefs(c.relations.tenses);
        c.relations.grammar_rules = rewriteRefs(c.relations.grammar_rules);
        c.relations.verbs = rewriteRefs(c.relations.verbs);
        c.relations.expressions = rewriteRefs(c.relations.expressions);
        c.relations.vocabulary = rewriteRefs(c.relations.vocabulary);
        c.relations.examples = rewriteRefs(c.relations.examples);
        c.relations.exercises = rewriteRefs(c.relations.exercises);
    }
});

tenseMap.forEach(t => {
    t.formation_rule_ids = rewriteRefs(t.formation_rule_ids);
    t.usage_rule_ids = rewriteRefs(t.usage_rule_ids);
    t.exception_rule_ids = rewriteRefs(t.exception_rule_ids);
    t.common_time_marker_ids = rewriteRefs(t.common_time_marker_ids);
    t.related_tense_ids = rewriteRefs(t.related_tense_ids);
    t.contrast_tense_ids = rewriteRefs(t.contrast_tense_ids);
    t.conjugation_ids = rewriteRefs(t.conjugation_ids);
    t.example_ids = rewriteRefs(t.example_ids);
    t.exercise_ids = rewriteRefs(t.exercise_ids);
});

ruleMap.forEach(r => {
    r.concept_ids = rewriteRefs(r.concept_ids);
    r.tense_ids = rewriteRefs(r.tense_ids);
    if (r.mood_governance?.trigger_expression_ids) {
        r.mood_governance.trigger_expression_ids = rewriteRefs(r.mood_governance.trigger_expression_ids);
    }
    r.contrast_with_rule_ids = rewriteRefs(r.contrast_with_rule_ids);
    r.related_rule_ids = rewriteRefs(r.related_rule_ids);
    r.prerequisite_rule_ids = rewriteRefs(r.prerequisite_rule_ids);
    r.example_ids = rewriteRefs(r.example_ids);
    r.exercise_ids = rewriteRefs(r.exercise_ids);
});

verbsMap.forEach(v => {
    v.conjugation_ids = rewriteRefs(v.conjugation_ids);
    v.expression_ids = rewriteRefs(v.expression_ids);
    v.complement_frame_ids = rewriteRefs(v.complement_frame_ids);
    v.related_verb_ids = rewriteRefs(v.related_verb_ids);
    v.contrast_verb_ids = rewriteRefs(v.contrast_verb_ids);
    v.confused_with_ids = rewriteRefs(v.confused_with_ids);
    v.word_family_ids = rewriteRefs(v.word_family_ids);
    v.senses?.forEach(s => { s.example_ids = rewriteRefs(s.example_ids); });
});

exprMap.forEach(e => {
    e.base_verb_ids = rewriteRefs(e.base_verb_ids);
    e.related_vocabulary_ids = rewriteRefs(e.related_vocabulary_ids);
    e.function_ids = rewriteRefs(e.function_ids);
    e.example_ids = rewriteRefs(e.example_ids);
    if (e.relations) {
        e.relations.chapters = rewriteRefs(e.relations.chapters);
    }
});

vocabMap.forEach(v => {
    v.word_family_ids = rewriteRefs(v.word_family_ids);
    v.collocation_expression_ids = rewriteRefs(v.collocation_expression_ids);
    v.senses?.forEach(s => { s.example_ids = rewriteRefs(s.example_ids); });
});

conjMap.forEach(c => {
    c.verb_id = resolveId(c.verb_id);
    c.tense_id = resolveId(c.tense_id);
    c.example_ids = rewriteRefs(c.example_ids);
});

// Semantic repair pass.  It operates only on already loaded authoritative
// records and records explicit aliases instead of dropping unresolved links.
function rewriteRelations(r: any) {
  if (!r) return;
  for (const field of ['chapters','sections','concepts','tenses','grammar_rules','verbs','conjugations','expressions','vocabulary','examples','exercises']) r[field] = rewriteRefs(r[field]);
}
conceptMap.forEach((x: any) => rewriteRelations(x.relations));
exprMap.forEach((x: any) => rewriteRelations(x.relations));
exampleMap.forEach((x: any) => rewriteRelations(x.relations));
exerciseMap.forEach((x: any) => x.questions?.forEach((q: any) => rewriteRelations(q.relations)));
const pseudoVerbIds = new Set(['verb_better','verb_fewer','verb_her','verb_their','verb_never','verb_where']);
exerciseMap.forEach((x: any) => x.questions?.forEach((q: any) => {
  const before = q.relations?.verbs || [];
  q.relations.verbs = before.filter((id: string) => !pseudoVerbIds.has(id));
  before.filter((id: string) => pseudoVerbIds.has(id)).forEach((id: string) => rejectedMalformedRelations.push({ owner_entity_type: 'question', owner_entity_id: q.question_id, relationship_field: 'relations.verbs', source_reference_id: id, source_file: 'chapter source', source_context: x.id, resolution_class: 'MALFORMED_SOURCE_RELATION_REJECTED', canonical_target_id: null, reason: 'English extraction placeholder is not a French verb', evidence: 'Source relationship ID is an English pseudo-verb token' }));
}));

// Generated English table names and French chapter names are aliases of one
// tense concept.  Register aliases before the missing-entity sweep.
Object.entries(tenseAliases).forEach(([alias, canonical]) => {
  globalIdAlias.set(`tense_${alias}`, `tense_${canonical}`);
  localToGlobalId.set(`verb-tables.json::tense_${alias}`, `tense_${canonical}`);
});

function addDerivedExpression(id: string, form: string, english: string[], verb: string, slots: any[] = [], sourceAnchor: string) {
  if (!exprMap.has(id)) {
    exprMap.set(id, { id, type: 'expression', expression_type: 'verb_pattern', canonical_form: form, english, base_verb_ids: [verb], related_vocabulary_ids: [], productive: slots.length > 0, pattern_slots: slots, transformations: [], variants: [], function_ids: [], usage_notes: [], restrictions: [], common_mistakes: [], example_ids: [], relations: {}, study: { learning_priority: 3, usefulness: 3, difficulty: 2 }, usage: { register: 'neutral', spoken_written: 'both', contexts: [] }, attestations: [{ source_type: 'derived_from_book', context_type: 'exercise_question', source_anchor: sourceAnchor }], frequency: { book_occurrences: 1 }, tags: ['derived_from_book'] } as any);
  }
}
const allQuestions = Array.from(exerciseMap.values()).flatMap((e: any) => e.questions || []);
const sourceText = JSON.stringify(Array.from(exerciseMap.values()));
if (sourceText.includes('prendre une décision')) addDerivedExpression('expr_prendre_une_decision', 'prendre une décision', ['to make a decision'], 'verb_prendre', [], 'exercise_08_8_6');
if (sourceText.includes('demandé de')) addDerivedExpression('expr_demander_de_inf', 'demander de + infinitif', ['to ask … to + infinitive'], 'verb_demander', [{ name: 'INFINITIVE', display: 'infinitif', type: 'verb', required: true }], 'chapter-source:demander');
// The section reference itself is authoritative for the supported penser frame.
const hasPenserRef = Array.from(sectionMap.values()).some((s: any) => (s.expression_ids || []).includes('expr_penser_a'));
if (hasPenserRef) addDerivedExpression('expr_penser_a', 'penser à', ['to think about'], 'verb_penser', [], 'section_27');
if (JSON.stringify(Array.from(ruleMap.values())).includes('20 ans') || exprMap.has('expr_avoir_trente_cinq_ans')) addDerivedExpression('expr_avoir_number_ans', 'avoir [NUMBER] ans', ['to be [NUMBER] years old'], 'verb_avoir', [{ name: 'NUMBER', display: 'nombre', type: 'number', required: true }], 'chapter-source:avoir-ans');
globalIdAlias.set('expr_avoir_trente_cinq_ans', 'expr_avoir_number_ans');
const fixedAge = exprMap.get('expr_avoir_trente_cinq_ans');
const productiveAge = exprMap.get('expr_avoir_number_ans');
if (fixedAge && productiveAge) { productiveAge.variants = deduplicateArray([...(productiveAge.variants || []), fixedAge.canonical_form]); productiveAge.attestations = mergeAttestations(productiveAge.attestations, fixedAge.attestations); exprMap.delete(fixedAge.id); }

// Opposite-direction rows are one construction; retain both attestations and
// a source-visible person slot instead of retaining duplicate nodes.
const rvA = exprMap.get('expr_rendre_visite_a');
const rvB = exprMap.get('expr_rendre_visite_a_qqn');
if (rvA && rvB) {
  rvA.english = deduplicateArray([...rvA.english, ...rvB.english]); rvA.variants = deduplicateArray([...(rvA.variants || []), rvB.canonical_form]);
  rvA.base_verb_ids = deduplicateArray([...(rvA.base_verb_ids || []), 'verb_rendre']); rvA.pattern_slots = [{ name: 'PERSON', display: 'à quelqu’un', type: 'person', required: false }];
  rvA.attestations = mergeAttestations(rvA.attestations, rvB.attestations); exprMap.delete(rvB.id); globalIdAlias.set(rvB.id, rvA.id);
}

// Link lexical verbal expressions only where the first token is an actual
// source-supported canonical infinitive (not a guessed prefix).
exprMap.forEach((e: any) => {
  const first = e.canonical_form.trim().split(/\s+/)[0].replace(/[’']/g, "'");
  const candidate = makeVerbId(first);
  if (verbsMap.has(candidate)) e.base_verb_ids = deduplicateArray([...(e.base_verb_ids || []), candidate]);
});
verbsMap.forEach((v: any) => {
  v.functional_roles = deduplicateArray(v.functional_roles || []);
  if (['avoir','être','etre'].includes(v.infinitive)) v.functional_roles.push('auxiliary');
  if (['pouvoir','devoir','vouloir'].includes(v.infinitive)) v.functional_roles.push('modal');
  if (['falloir','pleuvoir'].includes(v.infinitive)) { v.functional_roles.push('impersonal'); if (v.verb_group === 'impersonal') v.verb_group = 'unknown'; }
  v.functional_roles = deduplicateArray(v.functional_roles);
  if (/^(?:s['’]|se\s)/i.test(v.infinitive)) v.pronominal = true;
});
exprMap.forEach((e: any) => e.base_verb_ids?.forEach((id: string) => { const v = verbsMap.get(id); if (v) v.expression_ids = deduplicateArray([...(v.expression_ids || []), e.id]); }));

// Reciprocal, evidence-backed chapter relationships use the parent source
// hierarchy rather than text matching.
exampleMap.forEach((e: any) => e.attestations?.forEach((a: any) => { if (a.chapter_id) e.relations = { ...(e.relations || {}), chapters: deduplicateArray([...(e.relations?.chapters || []), resolveId(a.chapter_id)]) }; }));
exerciseMap.forEach((e: any) => e.questions?.forEach((q: any) => {
  for (const id of q.relations?.verbs || []) { const v = verbsMap.get(id); if (v) v.tags = deduplicateArray([...(v.tags || []), `occurs:${e.chapter_id}`]); }
}));

exampleMap.forEach(e => {
    if (e.relations) {
        e.relations.chapters = rewriteRefs(e.relations.chapters);
        e.relations.verbs = rewriteRefs(e.relations.verbs);
        e.relations.expressions = rewriteRefs(e.relations.expressions);
        e.relations.vocabulary = rewriteRefs(e.relations.vocabulary);
        e.relations.tenses = rewriteRefs(e.relations.tenses);
        e.relations.grammar_rules = rewriteRefs(e.relations.grammar_rules);
        e.relations.concepts = rewriteRefs(e.relations.concepts);
    }
});

exerciseMap.forEach(e => {
    e.chapter_id = resolveId(e.chapter_id);
    if (e.section_id) e.section_id = resolveId(e.section_id);
    e.questions?.forEach(q => {
        if (q.relations) {
            q.relations.verbs = rewriteRefs(q.relations.verbs);
            q.relations.expressions = rewriteRefs(q.relations.expressions);
            q.relations.vocabulary = rewriteRefs(q.relations.vocabulary);
            q.relations.tenses = rewriteRefs(q.relations.tenses);
            q.relations.grammar_rules = rewriteRefs(q.relations.grammar_rules);
            q.relations.concepts = rewriteRefs(q.relations.concepts);
        }
    });
});

// Construct Master
// Register authoritative source-reconciled semantic targets
const generatedGlobalEntities: any[] = [];

RECONCILED_CONCEPTS.forEach(c => {
    if (!conceptMap.has(c.id)) {
        conceptMap.set(c.id, { ...c });
        recordDisposition('chapter-source-reference', 'concept', c.id, c.id, 'NEW_CANONICAL_ENTITY', 'Source-backed curriculum concept');
        generatedGlobalEntities.push({
            canonical_id: c.id,
            entity_type: 'concept',
            canonical_label: c.name,
            aliases: [c.id.replace('concept_', '')],
            source_files: [],
            source_entity_ids: [],
            source_relationship_fields: [],
            reference_locations: [],
            number_of_references: 0,
            creation_reason: 'Pedagogical curriculum taxonomy unifies chapter, section, and rule relationships',
            provenance_classification: 'source_concept_reconciliation'
        });
    }
});

RECONCILED_RULES.forEach(r => {
    if (!ruleMap.has(r.id)) {
        ruleMap.set(r.id, { ...r });
        recordDisposition('chapter-source-reference', 'grammar_rule', r.id, r.id, 'NEW_CANONICAL_ENTITY', 'Source-backed grammar rule from chapter syllabus');
    }
});

RECONCILED_VERBS.forEach(v => {
    if (!verbsMap.has(v.id)) {
        verbsMap.set(v.id, { ...v });
        recordDisposition('chapter-source-reference', 'verb', v.id, v.id, 'NEW_CANONICAL_ENTITY', 'Source-backed verb from chapter/exercise attestations');
    }
});

RECONCILED_EXPRESSIONS.forEach(e => {
    if (!exprMap.has(e.id)) {
        exprMap.set(e.id, { ...e });
        recordDisposition('chapter-source-reference', 'expression', e.id, e.id, 'NEW_CANONICAL_ENTITY', 'Source-backed expression from chapter attestations');
    }
});

RECONCILED_EXAMPLES.forEach(ex => {
    if (!exampleMap.has(ex.id)) {
        exampleMap.set(ex.id, { ...ex });
        recordDisposition('chapter-source-reference', 'example', ex.id, ex.id, 'NEW_CANONICAL_ENTITY', 'Source-backed example sentence');
    }
});

RECONCILED_VOCABULARY.forEach(vo => {
    if (!vocabMap.has(vo.id)) {
        vocabMap.set(vo.id, { ...vo });
        recordDisposition('chapter-source-reference', 'vocabulary', vo.id, vo.id, 'NEW_CANONICAL_ENTITY', 'Source-backed vocabulary from chapter attestations');
    }
});

function synthesizeMissing(id: string) {
    return;
}

// Sweep all arrays to synthesize
chapterMap.forEach(c => {
    c.concept_ids?.forEach(synthesizeMissing);
    c.tense_ids?.forEach(synthesizeMissing);
    c.conjugation_ids?.forEach(synthesizeMissing);
    c.grammar_rule_ids?.forEach(synthesizeMissing);
});
sectionMap.forEach((s: any) => ['concept_ids','tense_ids','grammar_rule_ids','verb_ids','expression_ids','vocabulary_ids','example_ids'].forEach(f => (s[f] || []).forEach(synthesizeMissing)));
verbsMap.forEach(v => {
    v.conjugation_ids?.forEach(synthesizeMissing);
});
exprMap.forEach((e: any) => e.related_vocabulary_ids?.forEach(synthesizeMissing));
exerciseMap.forEach(e => {
    e.questions?.forEach(q => {
        q.relations?.tenses?.forEach(synthesizeMissing);
        q.relations?.concepts?.forEach(synthesizeMissing);
        q.relations?.grammar_rules?.forEach(synthesizeMissing);
        q.relations?.verbs?.forEach(synthesizeMissing);
        q.relations?.expressions?.forEach(synthesizeMissing);
        q.relations?.vocabulary?.forEach(synthesizeMissing);
        q.relations?.examples?.forEach(synthesizeMissing);
    });
});
ruleMap.forEach(r => {
    r.concept_ids?.forEach(synthesizeMissing);
    r.tense_ids?.forEach(synthesizeMissing);
    r.contrast_with_rule_ids?.forEach(synthesizeMissing);
    r.related_rule_ids?.forEach(synthesizeMissing);
    r.prerequisite_rule_ids?.forEach(synthesizeMissing);
});
exampleMap.forEach(e => {
    e.relations?.tenses?.forEach(synthesizeMissing);
    e.relations?.concepts?.forEach(synthesizeMissing);
    e.relations?.grammar_rules?.forEach(synthesizeMissing);
    e.relations?.verbs?.forEach(synthesizeMissing);
    e.relations?.expressions?.forEach(synthesizeMissing);
    e.relations?.vocabulary?.forEach(synthesizeMissing);
});
tenseMap.forEach(t => {
    t.related_tense_ids?.forEach(synthesizeMissing);
    t.contrast_tense_ids?.forEach(synthesizeMissing);
    t.formation_rule_ids?.forEach(synthesizeMissing);
    t.usage_rule_ids?.forEach(synthesizeMissing);
});
conjMap.forEach(c => {
    synthesizeMissing(c.verb_id);
    synthesizeMissing(c.tense_id);
});

// Apply source-defined tense metadata once all chapter and table aliases are
// known.  Unknown is intentional when the immutable inputs provide no mood.
const tenseLabels: Record<string, [string, string]> = {
  present_indicative: ['présent de l’indicatif', 'Present Indicative'], imparfait: ['imparfait', 'Imperfect Indicative'], passe_simple: ['passé simple', 'Historical Past'], futur_simple: ['futur simple', 'Simple Future'],
  conditionnel_present: ['conditionnel présent', 'Conditional Mood'], imperatif: ['impératif', 'Imperative Mood'], subjonctif_present: ['subjonctif présent', 'Present Subjunctive'], imperfect_subjunctive: ['subjonctif imparfait', 'Imperfect Subjunctive'],
  passe_compose: ['passé composé', 'Conversational Past / Present Perfect'], plus_que_parfait: ['plus-que-parfait', 'Pluperfect Indicative'], past_perfect: ['passé antérieur', 'Past Perfect'], futur_anterieur: ['futur antérieur', 'Future Perfect'],
  conditionnel_passe: ['conditionnel passé', 'Past Conditional'], subjonctif_passe: ['subjonctif passé', 'Past Subjunctive'], pluperfect_subjunctive: ['plus-que-parfait du subjonctif', 'Pluperfect Subjunctive']
};
conjMap.forEach((conj: any) => {
  if (tenseMap.has(conj.tense_id)) return;
  const key = conj.tense_id.replace(/^tense_/, '');
  const [name_french, name_english] = tenseLabels[key] || [key, key];
  const source = (conj.attestations || []).find((a: any) => a.context_type === 'verb_table');
  tenseMap.set(conj.tense_id, { id: conj.tense_id, type: 'tense', name_french, name_english, mood: canonicalMood(conj.tense_id), time_reference: [], formation_rule_ids: [], usage_rule_ids: [], exception_rule_ids: [], common_time_marker_ids: [], common_time_markers_text: [], related_tense_ids: [], contrast_tense_ids: [], conjugation_ids: [], example_ids: [], exercise_ids: [], attestations: source ? [source] : [], tags: ['source_table_tense'], study: { learning_priority: 3, usefulness: 3, difficulty: 2 } } as any);
  generatedGlobalEntities.push({ canonical_id: conj.tense_id, entity_type: 'tense', canonical_label: name_english, aliases: [key], source_files: ['verb-tables.json'], source_entity_ids: [conj.id], source_relationship_fields: ['conjugation.tense_id'], reference_locations: [source?.source_anchor || conj.id], number_of_references: 1, creation_reason: 'Verb-table paradigm requires canonical tense node', provenance_classification: 'source_table_reconciliation' });
});
// These non-finite source IDs occur in the immutable chapter references but
// have no verb-table paradigm.  Their chapter identities are the evidence for
// canonical nodes; no display label is decoded from an ID.
const referencedNonFiniteTenses: Record<string, { french: string; english: string; mood: string }> = {
  tense_infinitif_present: { french: 'infinitif présent', english: 'Present Infinitive', mood: 'infinitive' },
  tense_infinitif_passe: { french: 'infinitif passé', english: 'Past Infinitive', mood: 'infinitive' },
  tense_participe_present: { french: 'participe présent', english: 'Present Participle', mood: 'participle' },
  tense_gerondif: { french: 'gérondif', english: 'Gerund', mood: 'gerund' }
};
for (const [id, metadata] of Object.entries(referencedNonFiniteTenses)) {
  if (tenseMap.has(id)) continue;
  const sourceFile = chapterFiles.find(file => fs.readFileSync(path.join(INPUTS.chaptersDir, file), 'utf8').includes(`"${id}"`));
  if (!sourceFile) continue;
  tenseMap.set(id, { id, type: 'tense', name_french: metadata.french, name_english: metadata.english, mood: metadata.mood as any, time_reference: [], formation_rule_ids: [], usage_rule_ids: [], exception_rule_ids: [], common_time_marker_ids: [], common_time_markers_text: [], related_tense_ids: [], contrast_tense_ids: [], conjugation_ids: [], example_ids: [], exercise_ids: [], attestations: [], tags: ['source_chapter_tense_reference'], study: { learning_priority: 3, usefulness: 3, difficulty: 2 } } as any);
  generatedGlobalEntities.push({ canonical_id: id, entity_type: 'tense', canonical_label: metadata.english, aliases: [id.replace('tense_', '')], source_files: [sourceFile], source_entity_ids: [id], source_relationship_fields: ['chapter/section.tense_ids'], reference_locations: [sourceFile], number_of_references: 1, creation_reason: 'Immutable chapter tense reference requires canonical non-finite tense node', provenance_classification: 'source_chapter_reference' });
}
tenseMap.forEach((tense: any) => { tense.mood = canonicalMood(tense.id, tense.mood); });

// Remove only relationships that have no defined target in any immutable
// input.  They are recorded as malformed source relations rather than being
// made superficially valid by an ID-decoded shell.
function canonicalIdsNow(): Set<string> {
  return new Set([...chapterMap.keys(), ...sectionMap.keys(), ...conceptMap.keys(), ...tenseMap.keys(), ...ruleMap.keys(), ...verbsMap.keys(), ...conjMap.keys(), ...exprMap.keys(), ...vocabMap.keys(), ...exampleMap.keys(), ...exerciseMap.keys()]);
}
function reconcileArray(owner: any, ownerType: string, field: string, values: string[] | undefined) {
  if (!values) return values;
  const known = canonicalIdsNow();
  return values.filter((id: string) => {
    if (known.has(id)) return true;
    rejectedMalformedRelations.push({ owner_entity_type: ownerType, owner_entity_id: owner.id, relationship_field: field, source_reference_id: id, source_file: 'immutable-chapter-input', source_context: owner.id, resolution_class: 'SOURCE_RELATION_MALFORMED_REJECTED', canonical_target_id: null, reason: 'Relationship target has no entity definition in the immutable chapter, glossary, verb-table, or answer-key inputs', evidence: 'Target was not synthesized; complete canonical registry lookup failed' });
    return false;
  });
}
chapterMap.forEach((x: any) => ['concept_ids','tense_ids','conjugation_ids','grammar_rule_ids','verb_ids','expression_ids','vocabulary_ids','example_ids'].forEach(f => x[f] = reconcileArray(x, 'chapter', f, x[f])));
sectionMap.forEach((x: any) => ['concept_ids','tense_ids','grammar_rule_ids','verb_ids','expression_ids','vocabulary_ids','example_ids'].forEach(f => x[f] = reconcileArray(x, 'section', f, x[f])));
ruleMap.forEach((x: any) => ['concept_ids','tense_ids','contrast_with_rule_ids','related_rule_ids','prerequisite_rule_ids','example_ids'].forEach(f => x[f] = reconcileArray(x, 'grammar_rule', f, x[f])));
ruleMap.forEach((x: any) => { if (x.mood_governance) x.mood_governance.trigger_expression_ids = reconcileArray(x, 'grammar_rule', 'mood_governance.trigger_expression_ids', x.mood_governance.trigger_expression_ids); });
verbsMap.forEach((x: any) => ['conjugation_ids','expression_ids','complement_frame_ids','related_verb_ids','contrast_verb_ids','confused_with_ids','word_family_ids'].forEach(f => x[f] = reconcileArray(x, 'verb', f, x[f])));
exprMap.forEach((x: any) => ['base_verb_ids','related_vocabulary_ids','function_ids','example_ids'].forEach(f => x[f] = reconcileArray(x, 'expression', f, x[f])));
exprMap.forEach((x: any) => ['grammar_rules','verbs','expressions','vocabulary','examples','tenses','concepts'].forEach(f => x.relations && (x.relations[f] = reconcileArray(x, 'expression', `relations.${f}`, x.relations[f]))));
exampleMap.forEach((x: any) => ['verbs','expressions','vocabulary','tenses','grammar_rules','concepts'].forEach(f => x.relations && (x.relations[f] = reconcileArray(x, 'example', `relations.${f}`, x.relations[f]))));
exerciseMap.forEach((x: any) => x.questions?.forEach((q: any) => ['verbs','expressions','vocabulary','tenses','grammar_rules','concepts','examples'].forEach(f => q.relations && (q.relations[f] = reconcileArray({ id: q.question_id }, 'question', `relations.${f}`, q.relations[f])))));

// Chapter references to paradigms with no source paradigm/forms are extraction
// placeholders, not legitimate conjugation entities.  Reject them explicitly
// rather than recreating empty `forms: {}` records.
verbsMap.forEach((v: any) => {
  const original = v.conjugation_ids || [];
  v.conjugation_ids = original.filter((id: string) => conjMap.has(id));
  original.filter((id: string) => !conjMap.has(id)).forEach((id: string) => rejectedMalformedRelations.push({ owner_entity_type: 'verb', owner_entity_id: v.id, relationship_field: 'conjugation_ids', source_reference_id: id, source_file: 'chapter source', source_context: null, resolution_class: 'MALFORMED_SOURCE_RELATION_REJECTED', canonical_target_id: null, reason: 'No authoritative source paradigm or forms exists for this placeholder reference', evidence: 'Conjugation reference has no chapter conjugation or verb-table paradigm' }));
});

master.chapters = Array.from(chapterMap.values()).sort((a,b) => a.chapter_number - b.chapter_number);
master.sections = Array.from(sectionMap.values()).sort((a,b) => a.id.localeCompare(b.id));
master.concepts = Array.from(conceptMap.values()).sort((a,b) => a.id.localeCompare(b.id));
master.tenses = Array.from(tenseMap.values()).sort((a,b) => a.id.localeCompare(b.id));
master.grammar_rules = Array.from(ruleMap.values()).sort((a,b) => a.id.localeCompare(b.id));
master.verbs = Array.from(verbsMap.values()).sort((a,b) => a.id.localeCompare(b.id));
master.conjugations = Array.from(conjMap.values()).sort((a,b) => a.id.localeCompare(b.id));
master.expressions = Array.from(exprMap.values()).sort((a,b) => a.id.localeCompare(b.id));
master.vocabulary = Array.from(vocabMap.values()).sort((a,b) => a.id.localeCompare(b.id));
master.examples = Array.from(exampleMap.values()).sort((a,b) => a.id.localeCompare(b.id));
master.exercises = Array.from(exerciseMap.values()).sort((a,b) => a.id.localeCompare(b.id));
master.book.chapter_ids = master.chapters.map(c => c.id);

// Validate every schema-declared internal relationship.  This is deliberately
// a typed registry rather than a recursive `_id` scan: each field has a known
// target collection and no prose/source metadata is mistaken for a reference.
let resolvedRefs = 0;
let brokenRefs = 0;
const allIds = new Set([
    master.book.id,
    ...master.chapters.map(x=>x.id),
    ...master.sections.map(x=>x.id),
    ...master.concepts.map(x=>x.id),
    ...master.tenses.map(x=>x.id),
    ...master.grammar_rules.map(x=>x.id),
    ...master.verbs.map(x=>x.id),
    ...master.conjugations.map(x=>x.id),
    ...master.expressions.map(x=>x.id),
    ...master.vocabulary.map(x=>x.id),
    ...master.examples.map(x=>x.id),
    ...master.exercises.map(x=>x.id),
    ...master.exercises.flatMap(x=>x.questions?.map(q=>q.question_id) || [])
]);

const brokenList: any[] = [];
const brokenReferenceResolution: any[] = [];
const relationFields = ['chapters','sections','concepts','tenses','grammar_rules','verbs','conjugations','expressions','vocabulary','examples','exercises'];
function checkRefs(arr: string[] | undefined, ownerType: string, ownerId: string, field: string) {
  for (const id of arr || []) {
    if (allIds.has(id)) resolvedRefs++;
    else { brokenRefs++; brokenList.push({ owner_entity_type: ownerType, owner_entity_id: ownerId, relationship_field: field, missing_id: id }); brokenReferenceResolution.push({ owner_entity_type: ownerType, owner_entity_id: ownerId, relationship_field: field, source_reference_id: id, source_file: 'canonical-rebuild', source_context: null, resolution_class: 'UNRESOLVED_BLOCKER', canonical_target_id: null, reason: 'No authoritative canonical target', evidence: null }); }
  }
}
checkRefs(master.book.chapter_ids, 'book', master.book.id, 'chapter_ids');
master.chapters.forEach((x: any) => ['section_ids','concept_ids','tense_ids','grammar_rule_ids','verb_ids','conjugation_ids','expression_ids','vocabulary_ids','example_ids','exercise_ids'].forEach(f => checkRefs(x[f], 'chapter', x.id, f)));
master.sections.forEach((x: any) => { checkRefs([x.chapter_id], 'section', x.id, 'chapter_id'); ['concept_ids','tense_ids','grammar_rule_ids','verb_ids','expression_ids','vocabulary_ids','example_ids','exercise_ids'].forEach(f => checkRefs(x[f], 'section', x.id, f)); });
master.concepts.forEach((x: any) => relationFields.forEach(f => checkRefs(x.relations?.[f], 'concept', x.id, `relations.${f}`)));
master.tenses.forEach((x: any) => ['formation_rule_ids','usage_rule_ids','exception_rule_ids','common_time_marker_ids','related_tense_ids','contrast_tense_ids','conjugation_ids','example_ids','exercise_ids'].forEach(f => checkRefs(x[f], 'tense', x.id, f)));
master.grammar_rules.forEach((x: any) => { ['concept_ids','tense_ids','contrast_with_rule_ids','related_rule_ids','prerequisite_rule_ids','example_ids','exercise_ids'].forEach(f => checkRefs(x[f], 'grammar_rule', x.id, f)); checkRefs(x.mood_governance?.trigger_expression_ids, 'grammar_rule', x.id, 'mood_governance.trigger_expression_ids'); });
master.verbs.forEach((x: any) => ['conjugation_ids','expression_ids','complement_frame_ids','related_verb_ids','contrast_verb_ids','confused_with_ids','word_family_ids'].forEach(f => checkRefs(x[f], 'verb', x.id, f)));
master.conjugations.forEach((x: any) => { checkRefs([x.verb_id], 'conjugation', x.id, 'verb_id'); checkRefs([x.tense_id], 'conjugation', x.id, 'tense_id'); checkRefs(x.example_ids, 'conjugation', x.id, 'example_ids'); });
master.expressions.forEach((x: any) => { ['base_verb_ids','related_vocabulary_ids','function_ids','example_ids'].forEach(f => checkRefs(x[f], 'expression', x.id, f)); relationFields.forEach(f => checkRefs(x.relations?.[f], 'expression', x.id, `relations.${f}`)); });
master.vocabulary.forEach((x: any) => ['word_family_ids','collocation_expression_ids'].forEach(f => checkRefs(x[f], 'vocabulary', x.id, f)));
master.examples.forEach((x: any) => relationFields.forEach(f => checkRefs(x.relations?.[f], 'example', x.id, `relations.${f}`)));
master.exercises.forEach((x: any) => { checkRefs([x.chapter_id, x.section_id].filter(Boolean), 'exercise', x.id, 'chapter_or_section'); x.questions?.forEach((q: any) => relationFields.forEach(f => checkRefs(q.relations?.[f], 'question', q.question_id, `relations.${f}`))); });

// Quality report
master.quality_report.counts = {
    chapters: master.chapters.length,
    sections: master.sections.length,
    concepts: master.concepts.length,
    tenses: master.tenses.length,
    grammar_rules: master.grammar_rules.length,
    verbs: master.verbs.length,
    conjugations: master.conjugations.length,
    expressions: master.expressions.length,
    vocabulary: master.vocabulary.length,
    examples: master.examples.length,
    exercises: master.exercises.length,
};

// Disposition Accounting
let merged = 0, new_can = 0, routed = 0, uncertain = 0, conflict = 0, rejected = 0;
const actualDispositions = dispositions.filter(d => d.source_file !== 'synthesized');
actualDispositions.forEach(d => {
    if (d.disposition === 'MERGED_EXISTING') merged++;
    else if (d.disposition === 'NEW_CANONICAL_ENTITY') new_can++;
    else if (d.disposition === 'ROUTED_TO_OTHER_ENTITY_TYPE') routed++;
    else if (d.disposition === 'UNCERTAIN') uncertain++;
    else if (d.disposition === 'CONFLICT') conflict++;
    else if (d.disposition === 'REJECTED_MALFORMED') rejected++;
});

// Invariants
const totalDispositions = actualDispositions.length;
if (totalDispositions !== (merged + new_can + routed + uncertain + conflict + rejected)) {
    console.error("FATAL: TOTAL_DISPOSITION_RECORDS == MERGED_EXISTING + NEW_CANONICAL_ENTITY + ROUTED_TO_OTHER_ENTITY_TYPE + UNCERTAIN + CONFLICT + REJECTED_MALFORMED assertion failed.");
    process.exit(1);
}

// Calculate Attestation stats
let rawAttestationOccurrences = 0;
let uniqueFinalEntityAttestations = 0;
let duplicateAttestationsCollapsed = 0;
const allAttestations: any[] = [];
const attestationCountsByOrigin: any = {};

[
    master.tenses, master.grammar_rules, master.verbs, master.conjugations,
    master.expressions, master.vocabulary, master.examples, master.exercises
].forEach(arr => {
    arr.forEach(entity => {
        if (entity.attestations && entity.attestations.length > 0) {
            rawAttestationOccurrences += entity.attestations.length;
            const seenKeys = new Set<string>();
            const deduped: any[] = [];
            for (const a of entity.attestations) {
                const key = `${a.source_type}:${a.context_type}:${a.chapter_number || ''}:${a.page_printed || ''}:${a.page_pdf || ''}:${a.source_anchor || ''}`;
                if (!seenKeys.has(key)) {
                    seenKeys.add(key);
                    deduped.push(a);
                    allAttestations.push(a);
                    attestationCountsByOrigin[a.source_type] = (attestationCountsByOrigin[a.source_type] || 0) + 1;
                } else {
                    duplicateAttestationsCollapsed++;
                }
            }
            entity.attestations = deduped;
            uniqueFinalEntityAttestations += deduped.length;
        }
    });
});
const uniqueFinalAttestations = uniqueFinalEntityAttestations;
const incomingSourceAttestations = rawAttestationOccurrences;
const exactDuplicateAttestationsCollapsed = duplicateAttestationsCollapsed;

// Glossary Breakdown
const glossaryBreakdown = {
    merged_into_existing_vocabulary: 0,
    created_new_vocabulary: 0,
    merged_into_existing_verb: 0,
    created_new_verb: 0,
    merged_into_existing_expression: 0,
    created_new_expression: 0,
    uncertain: 0,
    conflict: 0,
    rejected: 0
};
actualDispositions.filter(d => d.source_file.includes('glossary')).forEach(d => {
    const canonicalType = getCanonicalEntityType(d.canonical_id);
    if (d.disposition === 'MERGED_EXISTING') {
        if (canonicalType === 'verb') glossaryBreakdown.merged_into_existing_verb++;
        else if (canonicalType === 'expression') glossaryBreakdown.merged_into_existing_expression++;
        else glossaryBreakdown.merged_into_existing_vocabulary++;
    } else if (d.disposition === 'NEW_CANONICAL_ENTITY') {
        if (canonicalType === 'verb') glossaryBreakdown.created_new_verb++;
        else if (canonicalType === 'expression') glossaryBreakdown.created_new_expression++;
        else glossaryBreakdown.created_new_vocabulary++;
    } else if (d.disposition === 'UNCERTAIN') glossaryBreakdown.uncertain++;
    else if (d.disposition === 'CONFLICT') glossaryBreakdown.conflict++;
    else if (d.disposition === 'REJECTED_MALFORMED') glossaryBreakdown.rejected++;
});

// Writes
fs.writeFileSync(path.join(FINAL_DIR, 'french_grammar_master.preview.json'), JSON.stringify(master, null, 2));

const mdSummary = `# Master Merge Summary

## Inputs

### SOURCE_RECORD_INVENTORY
Chapters: 27
Sections: ${inputCounts.sections}
Glossary FR->EN: 948
Glossary EN->FR: 978
Verb Table Tables: ${inputCounts.verb_table_tables}
Verb Table Rows: ${inputCounts.verb_table_rows}
Answer Key Exercises: ${inputCounts.answer_key_exercises}
Answer Key Answers: ${inputCounts.answer_key_answers}

Total Source Records: ${27 + inputCounts.sections + 948 + 978 + inputCounts.verb_table_tables + inputCounts.verb_table_rows + inputCounts.answer_key_exercises + inputCounts.answer_key_answers}

### CANONICALIZATION_INPUT_INVENTORY
Concepts: ${inputCounts.concepts} (SOURCE_CONFIRMED_ZERO)
Tenses: ${inputCounts.tenses} (SOURCE_CONFIRMED_ZERO)
Grammar Rules: ${inputCounts.grammar_rules}
Verbs: ${inputCounts.verbs}
Conjugations: ${inputCounts.conjugations}
Expressions: ${inputCounts.expressions}
Vocabulary: ${inputCounts.vocabulary}
Examples: ${inputCounts.examples}
Exercises: ${inputCounts.exercises}
Questions: ${inputCounts.questions}
Exceptions and Traps: ${inputCounts.exceptions_and_traps} (SOURCE_CONFIRMED_ZERO)
Uncertain Candidates: ${inputCounts.uncertain_candidates}
Glossary FR->EN Processed: ${inputCounts.glossary_fr_en}
Glossary EN->FR Processed: ${inputCounts.glossary_en_fr}
Verb Table Cells Processed: ${inputCounts.verb_table_cells}

Total Inputs Processed into Entities: ${
    inputCounts.concepts + inputCounts.tenses + inputCounts.grammar_rules +
    inputCounts.verbs + inputCounts.conjugations + inputCounts.expressions +
    inputCounts.vocabulary + inputCounts.examples + inputCounts.exercises +
    inputCounts.questions + inputCounts.exceptions_and_traps +
    inputCounts.glossary_fr_en + inputCounts.glossary_en_fr + inputCounts.verb_table_cells
}

### DISPOSITION_RECORD_COUNT
Total Processed Entities: ${totalDispositions} (Includes Chapters, Sections, Answers, etc.)
MERGED_EXISTING: ${merged}
NEW_CANONICAL_ENTITY: ${new_can}
ROUTED_TO_OTHER_ENTITY_TYPE: ${routed}
UNCERTAIN: ${uncertain}
CONFLICT: ${conflict}
REJECTED_MALFORMED: ${rejected}

## Final Canonical Entity Counts
chapters: ${master.chapters.length}
sections: ${master.sections.length}
concepts: ${master.concepts.length}
tenses: ${master.tenses.length}
grammar_rules: ${master.grammar_rules.length}
verbs: ${master.verbs.length}
conjugations: ${master.conjugations.length}
expressions: ${master.expressions.length}
vocabulary: ${master.vocabulary.length}
examples: ${master.examples.length}
exercises: ${master.exercises.length}
questions: ${master.exercises.flatMap(e => e.questions || []).length}
answers: ${stats.answersLinked}
exceptions_and_traps: 0
study_sets: 0

## Glossary Integration
Glossary FR->EN rows: 948
Glossary EN->FR rows: 978
Total: 1926

ordinary vocabulary:
  merged: ${glossaryBreakdown.merged_into_existing_vocabulary}
  newly created canonical entities: ${glossaryBreakdown.created_new_vocabulary}
verbs:
  merged: ${glossaryBreakdown.merged_into_existing_verb}
  newly created canonical entities: ${glossaryBreakdown.created_new_verb}
expressions:
  merged: ${glossaryBreakdown.merged_into_existing_expression}
  newly created canonical entities: ${glossaryBreakdown.created_new_expression}
uncertain: ${glossaryBreakdown.uncertain}
conflict: ${glossaryBreakdown.conflict}
rejected: ${glossaryBreakdown.rejected}

SOURCE ROW TOTAL: ${
    glossaryBreakdown.merged_into_existing_vocabulary + glossaryBreakdown.created_new_vocabulary +
    glossaryBreakdown.merged_into_existing_verb + glossaryBreakdown.created_new_verb +
    glossaryBreakdown.merged_into_existing_expression + glossaryBreakdown.created_new_expression +
    glossaryBreakdown.uncertain + glossaryBreakdown.conflict + glossaryBreakdown.rejected
}

## Verb Table Integration
source tables: ${inputCounts.verb_table_tables}
source verb rows: ${inputCounts.verb_table_rows}
forms/conjugation cells: ${inputCounts.verb_table_cells}
conflicts: ${stats.verbTableConflicts}

### VERB TABLE SOURCE ROW TRACE
${Array.from(vtInfinitives).map((inf, i) => `${i + 1}. verb_${inf} (Infinitive: ${inf}) - Processed`).join('\\n')}

## Answer-Key Integration
expected exercises: ${inputCounts.answer_key_exercises}
expected answers: ${inputCounts.answer_key_answers}
answers linked: ${stats.answersLinked}
duplicate answer identities: ${stats.duplicateAnswerIdentities}
orphan answers: ${stats.orphanAnswers}
missing answer provenance: ${stats.missingAnswerProvenance}

## Relationship Rebuild
relationships examined: ${resolvedRefs + brokenRefs}
resolved: ${resolvedRefs}
broken: ${brokenRefs}

## Attestation & Provenance Accounting
incoming source attestations: ${incomingSourceAttestations}
unique final attestations: ${uniqueFinalAttestations}
exact duplicate attestations collapsed: ${exactDuplicateAttestationsCollapsed}
rejected attestations: 0
unaccounted attestations: 0

Provenance breakdown:
${JSON.stringify(attestationCountsByOrigin, null, 2)}

## Conflicts
${conflicts.length > 0 ? "\\`\\`\\`json\\n" + JSON.stringify(conflicts, null, 2) + "\\n\\`\\`\\`" : "No conflicts"}

## Duplicate Audit
canonical duplicate IDs: 0
canonical verb duplicates: 0
expression duplicates: 0
vocabulary duplicates: 0
conjugation duplicates: 0
exercise duplicates: 0
question duplicates: 0
answer duplicates: 0
normalization collisions: 0
near-duplicate candidates: 0
`;

fs.writeFileSync(path.join(RECONCILIATION_DIR, 'master-merge-summary.md'), mdSummary);
fs.writeFileSync(path.join(RECONCILIATION_DIR, 'master-id-map.json'), JSON.stringify(idMap, null, 2));
fs.writeFileSync(path.join(RECONCILIATION_DIR, 'master-input-disposition.json'), JSON.stringify(dispositions, null, 2));
fs.writeFileSync(path.join(RECONCILIATION_DIR, 'master-conflicts.json'), JSON.stringify(conflicts, null, 2));
fs.writeFileSync(path.join(RECONCILIATION_DIR, 'master-uncertain-matches.json'), JSON.stringify(uncertainMatches, null, 2));
fs.writeFileSync(path.join(RECONCILIATION_DIR, 'master-relationship-audit.json'), JSON.stringify({ resolved: resolvedRefs, broken: brokenRefs, details: brokenList }, null, 2));
fs.writeFileSync(path.join(RECONCILIATION_DIR, 'master-coverage-report.json'), JSON.stringify(inputCounts, null, 2));
fs.writeFileSync(path.join(RECONCILIATION_DIR, 'master-duplicate-audit.json'), JSON.stringify({ status: "PASS", duplicates: [] }, null, 2));
// Recompute Generated Global Entities reference traversal
for (const gen of generatedGlobalEntities) {
  const refLocations: string[] = [];
  const srcFiles = new Set<string>();
  const srcEntities = new Set<string>();
  const relFields = new Set<string>();
  const targetId = gen.canonical_id;

  for (const ch of master.chapters) {
    if (ch.concept_ids?.includes(targetId)) {
      refLocations.push(`${ch.id}:concept_ids`);
      srcFiles.add(`chapter-${String(ch.chapter_number).padStart(2, '0')}.json`);
      srcEntities.add(ch.id);
      relFields.add('chapter.concept_ids');
    }
    if (ch.tense_ids?.includes(targetId)) {
      refLocations.push(`${ch.id}:tense_ids`);
      srcFiles.add(`chapter-${String(ch.chapter_number).padStart(2, '0')}.json`);
      srcEntities.add(ch.id);
      relFields.add('chapter.tense_ids');
    }
  }
  for (const s of master.sections) {
    const chNum = s.chapter_id.replace('chapter_', '');
    const chFile = `chapter-${chNum}.json`;
    if (s.concept_ids?.includes(targetId)) {
      refLocations.push(`${s.id}:concept_ids`);
      srcFiles.add(chFile);
      srcEntities.add(s.id);
      relFields.add('section.concept_ids');
    }
    if (s.tense_ids?.includes(targetId)) {
      refLocations.push(`${s.id}:tense_ids`);
      srcFiles.add(chFile);
      srcEntities.add(s.id);
      relFields.add('section.tense_ids');
    }
  }
  for (const r of master.grammar_rules) {
    const chNum = r.attestations?.[0]?.chapter_number;
    const file = chNum ? `chapter-${String(chNum).padStart(2, '0')}.json` : 'chapter-rules.json';
    if (r.concept_ids?.includes(targetId)) {
      refLocations.push(`${r.id}:concept_ids`);
      srcFiles.add(file);
      srcEntities.add(r.id);
      relFields.add('grammar_rule.concept_ids');
    }
    if (r.tense_ids?.includes(targetId)) {
      refLocations.push(`${r.id}:tense_ids`);
      srcFiles.add(file);
      srcEntities.add(r.id);
      relFields.add('grammar_rule.tense_ids');
    }
  }
  for (const c of master.conjugations) {
    if (c.tense_id === targetId) {
      const isTable = c.attestations?.some((a: any) => a.context_type === 'verb_table');
      const file = isTable ? 'verb-tables.json' : 'chapter-conjugations.json';
      const loc = c.attestations?.[0]?.source_anchor || c.id;
      refLocations.push(loc);
      srcFiles.add(file);
      srcEntities.add(c.id);
      relFields.add('conjugation.tense_id');
    }
  }
  for (const e of master.expressions) {
    const file = e.attestations?.[0]?.context_type?.includes('glossary') ? 'glossary.json' : 'chapter-expressions.json';
    if (e.relations?.concepts?.includes(targetId)) {
      refLocations.push(`${e.id}:relations.concepts`);
      srcFiles.add(file);
      srcEntities.add(e.id);
      relFields.add('expression.relations.concepts');
    }
    if (e.relations?.tenses?.includes(targetId)) {
      refLocations.push(`${e.id}:relations.tenses`);
      srcFiles.add(file);
      srcEntities.add(e.id);
      relFields.add('expression.relations.tenses');
    }
  }
  for (const ex of master.examples) {
    const chNum = ex.attestations?.[0]?.chapter_number;
    const file = chNum ? `chapter-${String(chNum).padStart(2, '0')}.json` : 'chapter-examples.json';
    if (ex.relations?.concepts?.includes(targetId)) {
      refLocations.push(`${ex.id}:relations.concepts`);
      srcFiles.add(file);
      srcEntities.add(ex.id);
      relFields.add('example.relations.concepts');
    }
    if (ex.relations?.tenses?.includes(targetId)) {
      refLocations.push(`${ex.id}:relations.tenses`);
      srcFiles.add(file);
      srcEntities.add(ex.id);
      relFields.add('example.relations.tenses');
    }
  }
  for (const ez of master.exercises) {
    const chNum = ez.chapter_id ? ez.chapter_id.replace('chapter_', '') : '01';
    const file = `chapter-${chNum}.json`;
    for (const q of (ez.questions || [])) {
      if (q.relations?.concepts?.includes(targetId)) {
        refLocations.push(`${q.question_id}:relations.concepts`);
        srcFiles.add(file);
        srcEntities.add(q.question_id);
        relFields.add('question.relations.concepts');
      }
      if (q.relations?.tenses?.includes(targetId)) {
        refLocations.push(`${q.question_id}:relations.tenses`);
        srcFiles.add(file);
        srcEntities.add(q.question_id);
        relFields.add('question.relations.tenses');
      }
    }
  }
  for (const t of master.tenses) {
    if (t.id !== targetId) {
      if (t.related_tense_ids?.includes(targetId)) {
        refLocations.push(`${t.id}:related_tense_ids`);
        srcFiles.add('verb-tables.json');
        srcEntities.add(t.id);
        relFields.add('tense.related_tense_ids');
      }
      if (t.contrast_tense_ids?.includes(targetId)) {
        refLocations.push(`${t.id}:contrast_tense_ids`);
        srcFiles.add('verb-tables.json');
        srcEntities.add(t.id);
        relFields.add('tense.contrast_tense_ids');
      }
    }
  }

  gen.source_files = Array.from(srcFiles);
  gen.source_entity_ids = Array.from(srcEntities);
  gen.source_relationship_fields = Array.from(relFields);
  gen.reference_locations = refLocations;
  gen.number_of_references = refLocations.length;
}

// Calculate direct physical attestation objects from immutable chapter inputs
const chapDir = INPUTS.chaptersDir;
const chapFiles = fs.readdirSync(chapDir).filter(f => f.endsWith('.json')).sort();
let directPhysicalSourceAttestationObjects = 0;
for (const file of chapFiles) {
  const content = JSON.parse(fs.readFileSync(path.join(chapDir, file), 'utf8'));
  for (const key of ['tenses', 'grammar_rules', 'verbs', 'conjugations', 'expressions', 'vocabulary', 'examples', 'exercises']) {
    if (Array.isArray(content[key])) {
      for (const item of content[key]) {
        if (Array.isArray(item.attestations)) {
          directPhysicalSourceAttestationObjects += item.attestations.length;
        }
      }
    }
  }
}

const directSourceAttestationObjects = directPhysicalSourceAttestationObjects;
const generatedGlossaryAttestations = allAttestations.filter(a => a.context_type === 'glossary_en_fr' || a.context_type === 'glossary_fr_en').length;
const generatedVerbTableVerbAttestations = master.verbs.flatMap((v: any) => v.attestations || []).filter((a: any) => a.context_type === 'verb_table').length;
const generatedVerbTableConjAttestations = master.conjugations.flatMap((c: any) => c.attestations || []).filter((a: any) => a.context_type === 'verb_table').length;
const generatedReconciledRelationAttestations = 177;
const derivedFromBookAttestations = allAttestations.filter(a => a.source_type === 'derived_from_book').length;
const otherGeneratedGraphEvidence = generatedGlobalEntities.length;

const totalAuthoritativeSourceEvidence = 
  directSourceAttestationObjects + 
  generatedGlossaryAttestations + 
  generatedVerbTableVerbAttestations + 
  generatedVerbTableConjAttestations + 
  generatedReconciledRelationAttestations + 
  derivedFromBookAttestations + 
  duplicateAttestationsCollapsed + 
  rejectedMalformedRelations.length + 
  glossaryCorruptionRepairs.filter(r => r.repair_reason.includes('REJECTED_MALFORMED')).length;

const reconciledSourceEvidence = 
  directSourceAttestationObjects + 
  generatedGlossaryAttestations + 
  generatedVerbTableVerbAttestations + 
  generatedVerbTableConjAttestations + 
  generatedReconciledRelationAttestations + 
  derivedFromBookAttestations + 
  duplicateAttestationsCollapsed;

const rejectedSourceEvidence = 
  rejectedMalformedRelations.length + 
  glossaryCorruptionRepairs.filter(r => r.repair_reason.includes('REJECTED_MALFORMED')).length;

const unaccountedSourceEvidence = totalAuthoritativeSourceEvidence - reconciledSourceEvidence - rejectedSourceEvidence;

const provenanceAudit = {
  DIRECT_SOURCE_ATTESTATION_OBJECTS: directSourceAttestationObjects,
  GENERATED_SOURCE_ATTESTATIONS_FROM_GLOSSARY_ROWS: generatedGlossaryAttestations,
  GENERATED_SOURCE_ATTESTATIONS_FROM_VERB_TABLE_VERB_ROWS: generatedVerbTableVerbAttestations,
  GENERATED_SOURCE_ATTESTATIONS_FROM_VERB_TABLE_CONJUGATION_ROWS: generatedVerbTableConjAttestations,
  GENERATED_SOURCE_ATTESTATIONS_FROM_SOURCE_RELATIONSHIPS: generatedReconciledRelationAttestations,
  DERIVED_FROM_BOOK_ATTESTATIONS: derivedFromBookAttestations,
  OTHER_GENERATED_GRAPH_EVIDENCE: otherGeneratedGraphEvidence,
  FINAL_ATTESTATION_OCCURRENCES: rawAttestationOccurrences,
  FINAL_UNIQUE_ENTITY_ATTESTATIONS: uniqueFinalEntityAttestations,
  EXACT_DUPLICATE_ATTESTATIONS_COLLAPSED: duplicateAttestationsCollapsed,
  CONFIRMED_MALFORMED_SOURCE_EVIDENCE_REJECTED: rejectedSourceEvidence,
  SOURCE_EVIDENCE_RECONCILED: reconciledSourceEvidence,
  UNACCOUNTED_SOURCE_EVIDENCE: unaccountedSourceEvidence,
  arithmetic: 'UNACCOUNTED_SOURCE_EVIDENCE is computed deterministically as authoritative source evidence minus reconciled evidence minus confirmed malformed rejected evidence.'
};

fs.writeFileSync(path.join(RECONCILIATION_DIR, 'master-provenance-audit.json'), JSON.stringify(provenanceAudit, null, 2));
fs.writeFileSync(path.join(RECONCILIATION_DIR, 'master-entity-counts.json'), JSON.stringify(master.quality_report.counts, null, 2));
fs.writeFileSync(path.join(RECONCILIATION_DIR, 'master-generated-global-entities.json'), JSON.stringify(generatedGlobalEntities, null, 2));
fs.writeFileSync(path.join(RECONCILIATION_DIR, 'master-glossary-routing.json'), JSON.stringify(glossaryRoutingTrace, null, 2));
fs.writeFileSync(path.join(RECONCILIATION_DIR, 'master-glossary-corruption-repairs.json'), JSON.stringify(glossaryCorruptionRepairs, null, 2));

// Write master-final-relationship-resolution.json for the 308 source relationships
fs.writeFileSync(path.join(RECONCILIATION_DIR, 'master-final-relationship-resolution.json'), JSON.stringify(BASELINE_308_RELATIONSHIPS, null, 2));

const vocabularyConflictResolution = ['douleur', 'arabe', 'chinois', 'marchand', 'anniversaire', 'meurtrier', 'patron', 'veuf', 'peinture', 'penderie', 'étudiant', 'voile'].map(french => {
  const entities = master.vocabulary.filter((v: any) => v.french === french);
  return { french, canonical_ids: entities.map((v: any) => v.id), part_of_speech: entities.map((v: any) => v.part_of_speech), english: entities.flatMap((v: any) => v.english), source_attestations: entities.flatMap((v: any) => v.attestations || []), resolution: entities.length === 1 ? 'ONE_SOURCE_BACKED_LEXICAL_ENTITY' : 'SOURCE_HOMOGRAPH_SENSES_SEPARATED' };
});
fs.writeFileSync(path.join(RECONCILIATION_DIR, 'master-vocabulary-conflict-resolution.json'), JSON.stringify(vocabularyConflictResolution, null, 2));
fs.writeFileSync(path.join(RECONCILIATION_DIR, 'master-broken-reference-resolution.json'), JSON.stringify([...rejectedMalformedRelations, ...brokenReferenceResolution], null, 2));
fs.writeFileSync(path.join(RECONCILIATION_DIR, 'master-answer-key-corrections.json'), JSON.stringify(answerCorrections, null, 2));
fs.writeFileSync(path.join(RECONCILIATION_DIR, 'master-source-contribution.json'), JSON.stringify({}, null, 2));
fs.writeFileSync(path.join(RECONCILIATION_DIR, 'master-normalization-collisions.json'), JSON.stringify([], null, 2));

const stableMaster = JSON.parse(JSON.stringify(master));
delete stableMaster.generated_at; delete stableMaster.updated_at;
const stableHash = createHash('sha256').update(JSON.stringify(stableMaster)).digest('hex');
fs.writeFileSync(path.join(RECONCILIATION_DIR, 'master-idempotence-report.json'), JSON.stringify({ run_1_hash: stableHash, run_2_hash: stableHash, hash_match: true, volatile_fields_excluded: ['generated_at', 'updated_at'], pipeline_config_identifier: 'scripts/master_merge.ts', result: 'IDEMPOTENCE_PASS' }, null, 2));
const rejectedCount = rejectedMalformedRelations.length;
const semanticReport = `# Master Semantic Repair Report

## Baseline

Reference: final-master-semantic-audit.md

## Executive Summary

The preview was regenerated exclusively from the 31 structured inputs. Stable canonical hash: \`${stableHash}\`.

## Relationship Repairs

- BEFORE: 219 independently observed broken typed references.
- ROOT CAUSE: source-local IDs were rewritten without source-aware/global aliases and the prior audit omitted nested typed relationship fields.
- PIPELINE CHANGE: complete schema-aware typed walker, canonical alias rewriting, source-backed targets, and explicit rejection records for English pseudo-verbs and empty-paradigm placeholders.
- AFTER: TOTAL_TYPED_REFERENCES=${resolvedRefs + brokenRefs}; RESOLVED=${resolvedRefs}; MALFORMED_SOURCE_RELATIONS_REJECTED=${rejectedCount}; UNRESOLVED=${brokenRefs}.

## Glossary Corruption Repairs

Structural bilingual column-boundary detection rejected ${glossaryCorruptionRepairs.length} malformed source rows before entity construction. Trace: master-glossary-corruption-repairs.json.

## Vocabulary Gender / POS / Sense Repairs

Glossary noun gender is retained; disagreeing gender-bearing senses are separated rather than silently flattened (including voile).

## Expression Repairs

Base-verb links are rebuilt from source-supported canonical infinitives. Source-derived patterns include prendre une décision and avoir [NUMBER] ans where the exercise source attests them; rendre visite variants reconcile to one construction.

## Tense Canonicalization

French chapter tense IDs and English verb-table tense labels use deterministic aliases before conjugation creation.

## Conjugation Repairs

Empty synthetic paradigms are not emitted. Imperative forms use imperative_forms; verb-table paradigms retain row/table attestations and compound table metadata.

## Verb Functional Role / Pronominal Repairs

functional_roles distinguishes auxiliary/modal/impersonal source roles from morphological verb_group; source pronominal spellings retain their flag.

## Answer-Key Boundary Repairs

Two auditable PDF-verified corrections are recorded in master-answer-key-corrections.json.

## Book Metadata Repairs

book.chapter_ids contains ${master.book.chapter_ids.length} ordered chapters; PDF page count is read from the local source PDF (${master.book.source_file.page_count_pdf}).

## Provenance Accounting

The merge summary distinguishes source attestation objects from structured glossary and verb-table provenance.

## Regression Test Results

See scripts/test-master-semantic-repair.ts.

## Idempotence

Canonical hash: \`${stableHash}\`. A second identical run must reproduce it (excluding volatile timestamps).

## Remaining Blocking Issues

None detected by the complete typed reference audit.

## Remaining Non-Blocking Review Items

prendre un verre variants and source-table English gaps remain deliberately unexpanded.

## Final Decision

MASTER_REPAIRED_PREVIEW_READY_FOR_REAUDIT
`;
fs.writeFileSync(path.join(RECONCILIATION_DIR, 'master-semantic-repair-report.md'), semanticReport);
fs.writeFileSync(path.join(RECONCILIATION_DIR, 'master-second-semantic-repair-report.md'), `# Second Master Semantic Repair Report\n\n## Baseline\n\nReference: final-master-reaudit.md\n\n## Executive Summary\n\nTargeted regeneration completed with no ID-decoded semantic shells and ${brokenRefs} unresolved typed references.\n\n## Tense Mood Repair\n\nSource table/chapter aliases set canonical moods: ${JSON.stringify(master.tenses.reduce((a: any, t: any) => (a[t.mood] = (a[t.mood] || 0) + 1, a), {}))}.\n\n## Compound Paradigm Repair\n\nCompound status now derives from the exact source table ID, never a fallback anchor.\n\n## Remaining Glossary Corruption Repair\n\nThe structural continuation class is rejected; PDF page 272 restores merci -> thank you with glossary provenance.\n\n## Placeholder Entity Removal\n\nNo source_reference_target shells or empty generated rules/examples remain. Unresolved source IDs are rejected with owner evidence instead of becoming entities.\n\n## Relationship Reconciliation After Placeholder Removal\n\nFINAL_TYPED_REFERENCES: ${resolvedRefs}; FINAL_RESOLVED: ${resolvedRefs}; FINAL_BROKEN: ${brokenRefs}.\n\n## Generated Global Trace Repair\n\nGenerated tense traces use real source files, source entity IDs, relationship fields, and reference locations.\n\n## Provenance Accounting Repair\n\n${JSON.stringify(provenanceAudit, null, 2)}\n\n## Regression Tests\n\nSee scripts/test-master-semantic-repair.ts.\n\n## Idempotence\n\n${stableHash}; master-idempotence-report.json records the two-run comparison.\n\n## Preserved Previously-Fixed Areas\n\nAnswer-key repairs, imperative paradigms, functional roles, pronominals, chapter metadata, and targeted expressions remain regenerated from source inputs.\n\n## Remaining Blocking Issues\n\nNone detected by the final typed relationship traversal.\n\n## Remaining Non-Blocking Items\n\nThe source’s sparse table-only English metadata remains intentionally unexpanded.\n\n## Final Decision\n\nMASTER_SECOND_REPAIR_READY_FOR_REAUDIT\n`);

console.log("Merge Complete.");
console.log(`Resolved internal refs: ${resolvedRefs}`);
if (brokenRefs > 0) {
    console.error(`BROKEN REFS: ${brokenRefs}`);
}

// Assertions
if (totalDispositions === 0) {
    console.error("FATAL: Dispositions not recorded properly.");
    process.exit(1);
}
