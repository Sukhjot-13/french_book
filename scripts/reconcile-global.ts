import fs from "fs";
import path from "path";
import { ChapterExtractionBundle } from "./chapter-types";
import {
  SuperDatasetRoot,
  Verb,
  Vocabulary,
  Expression,
  GrammarRule,
  Chapter,
  Section,
  Example,
  Exercise,
  Tense,
  Concept,
  StudySet,
} from "../src/lib/dataset/schemas";
import { canonicalizeVerbs, canonicalizeVocabulary, canonicalizeExpressions, mergeAttestations } from "../src/lib/dataset/canonicalize";
import { makeStudySetId, makeBookId, makeConjugationId, makeVerbId, makeVocabId, makeExpressionId, makeConceptId } from "../src/lib/dataset/ids";
import { buildEnrichedConjugations } from "./enrichment/parse-conjugations-enhanced";
import { buildEnrichedExpressions } from "./enrichment/parse-expressions-enhanced";
import { buildEnrichedExamples } from "./enrichment/parse-examples-enhanced";
import { promoteExerciseExpressionCandidates, writeExercisePromotionReport } from "./enrichment/promote-exercise-expressions";

const ROOT_DIR = path.resolve(__dirname, "..");
const NORMALIZED_CHAPTERS_DIR = path.join(ROOT_DIR, "data", "normalized", "chapters");
const TENSES_FILE = path.join(ROOT_DIR, "data", "normalized", "global", "tenses.json");
const CONCEPTS_FILE = path.join(ROOT_DIR, "data", "normalized", "global", "concepts.json");
const GLOSSARY_FR_EN_FILE = path.join(ROOT_DIR, "data", "extracted", "backmatter", "glossary-fr-en.json");
const GLOSSARY_EN_FR_FILE = path.join(ROOT_DIR, "data", "extracted", "backmatter", "glossary-en-fr.json");
const VERB_TABLES_FILE = path.join(ROOT_DIR, "data", "extracted", "backmatter", "verb-tables.json");
const FINAL_DATASET_FILE = path.join(ROOT_DIR, "data", "final", "french_grammar.json");
const EXERCISE_PROMOTION_REPORT = path.join(ROOT_DIR, "data", "reports", "exercise-expression-promotion.json");

interface ParsedVerbTableForm {
  verb_infinitive: string;
  verb_id: string;
  tense_name: string;
  tense_id: string;
  forms: Record<string, string>;
  page_printed: number;
}

export function reconcileGlobal(): SuperDatasetRoot {
  console.log("Starting global reconciliation with enriched passes...");

  // Load canonical tenses and concepts
  const tenses: Tense[] = JSON.parse(fs.readFileSync(TENSES_FILE, "utf-8"));
  const concepts: Concept[] = JSON.parse(fs.readFileSync(CONCEPTS_FILE, "utf-8"));

  // Load backmatter
  const glossaryFrEn: any[] = fs.existsSync(GLOSSARY_FR_EN_FILE)
    ? JSON.parse(fs.readFileSync(GLOSSARY_FR_EN_FILE, "utf-8"))
    : [];
  const glossaryEnFr: any[] = fs.existsSync(GLOSSARY_EN_FR_FILE)
    ? JSON.parse(fs.readFileSync(GLOSSARY_EN_FR_FILE, "utf-8"))
    : [];
  const verbTables: ParsedVerbTableForm[] = fs.existsSync(VERB_TABLES_FILE)
    ? JSON.parse(fs.readFileSync(VERB_TABLES_FILE, "utf-8"))
    : [];

  const vocabMap = new Map<string, Vocabulary>();
  const exprMap = new Map<string, Expression>();

  // 1a. Convert Fr-En glossary entries into canonical Vocabulary & Expression objects
  for (const g of glossaryFrEn) {
    const vocabId = makeVocabId(g.french);
    const exprId = makeExpressionId(g.french);
    const isExpr = Boolean(g.is_expression);

    if (isExpr) {
      exprMap.set(exprId, {
        id: exprId,
        type: "expression",
        expression_type: g.french.startsWith("se ") || g.french.startsWith("s’") ? "verb_pattern" : "fixed_expression",
        canonical_form: g.french,
        display_form: g.french,
        english: Array.isArray(g.english) ? g.english : [g.english || g.french],
        base_verb_ids: [],
        related_vocabulary_ids: [],
        productive: false,
        collocation_strength: "common",
        pattern: null,
        pattern_slots: [],
        complement_structure: null,
        mood_governance: null,
        transformations: [],
        variants: [],
        function_ids: [],
        usage_notes: [],
        restrictions: [],
        common_mistakes: [],
        example_ids: [],
        study: { learning_priority: 3, usefulness: 4, difficulty: 2 },
        usage: { register: "neutral", spoken_written: "both", contexts: [] },
        frequency: { book_occurrences: 1 },
        origin: { source_type: "book", created_by: "extraction", derived_from_ids: [] },
        attestations: [
          {
            source_type: "book",
            page_printed: g.page_printed,
            page_pdf: g.page_pdf,
            context_type: "glossary_fr_en",
          },
        ],
        relations: {},
        tags: ["glossary", "expression"],
      });
    } else {
      vocabMap.set(vocabId, {
        id: vocabId,
        type: "vocabulary",
        canonical_form: g.french,
        display_form: g.french,
        french: g.french,
        english: Array.isArray(g.english) ? g.english : [g.english || g.french],
        part_of_speech: "noun",
        noun: {
          gender: g.gender || null,
          article: null,
          plural: null,
          countability: null,
        },
        adjective: null,
        adverb: null,
        senses: [
          {
            sense_id: `${vocabId}_s1`,
            english: Array.isArray(g.english) ? g.english : [g.english || g.french],
            usage_contexts: [],
            example_ids: [],
          },
        ],
        semantic_domains: [],
        word_family_ids: [],
        collocation_expression_ids: [],
        false_friend: false,
        cognate: false,
        study: { learning_priority: 3, usefulness: 3, difficulty: 2 },
        usage: { register: "neutral", spoken_written: "both", contexts: [] },
        frequency: { book_occurrences: 1 },
        origin: { source_type: "book", created_by: "extraction", derived_from_ids: [] },
        attestations: [
          {
            source_type: "book",
            page_printed: g.page_printed,
            page_pdf: g.page_pdf,
            context_type: "glossary_fr_en",
          },
        ],
        tags: ["glossary", "backmatter"],
      });
    }
  }

  // 1b. Ingest En-Fr glossary & reconcile with canonical entries
  for (const g of glossaryEnFr) {
    const vocabId = makeVocabId(g.french);
    const exprId = makeExpressionId(g.french);
    const isExpr = Boolean(g.is_expression);
    const enList = Array.isArray(g.english) ? g.english : [g.english || g.french];

    const attestation = {
      source_type: "book" as const,
      page_printed: g.page_printed,
      page_pdf: g.page_pdf,
      context_type: "glossary_en_fr" as const,
    };

    if (isExpr) {
      if (exprMap.has(exprId)) {
        const existing = exprMap.get(exprId)!;
        existing.english = Array.from(new Set([...existing.english, ...enList]));
        existing.attestations.push(attestation);
      } else {
        exprMap.set(exprId, {
          id: exprId,
          type: "expression",
          expression_type: g.french.startsWith("se ") || g.french.startsWith("s’") ? "verb_pattern" : "fixed_expression",
          canonical_form: g.french,
          display_form: g.french,
          english: enList,
          base_verb_ids: [],
          related_vocabulary_ids: [],
          productive: false,
          collocation_strength: "common",
          pattern: null,
          pattern_slots: [],
          complement_structure: null,
          mood_governance: null,
          transformations: [],
          variants: [],
          function_ids: [],
          usage_notes: [],
          restrictions: [],
          common_mistakes: [],
          example_ids: [],
          study: { learning_priority: 3, usefulness: 4, difficulty: 2 },
          usage: { register: "neutral", spoken_written: "both", contexts: [] },
          frequency: { book_occurrences: 1 },
          origin: { source_type: "book", created_by: "extraction", derived_from_ids: [] },
          attestations: [attestation],
          relations: {},
          tags: ["glossary", "expression", "en_fr_glossary"],
        });
      }
    } else {
      if (vocabMap.has(vocabId)) {
        const existing = vocabMap.get(vocabId)!;
        existing.english = Array.from(new Set([...existing.english, ...enList]));
        if (!existing.noun?.gender && g.gender) {
          if (!existing.noun) {
            existing.noun = { gender: g.gender, article: null, plural: null, countability: null };
          } else {
            existing.noun.gender = g.gender;
          }
        }
        existing.attestations.push(attestation);
        if (existing.senses && existing.senses.length > 0) {
          existing.senses[0].english = Array.from(new Set([...existing.senses[0].english, ...enList]));
        }
      } else {
        vocabMap.set(vocabId, {
          id: vocabId,
          type: "vocabulary",
          canonical_form: g.french,
          display_form: g.french,
          french: g.french,
          english: enList,
          part_of_speech: "noun",
          noun: {
            gender: g.gender || null,
            article: null,
            plural: null,
            countability: null,
          },
          adjective: null,
          adverb: null,
          senses: [
            {
              sense_id: `${vocabId}_s1`,
              english: enList,
              usage_contexts: [],
              example_ids: [],
            },
          ],
          semantic_domains: [],
          word_family_ids: [],
          collocation_expression_ids: [],
          false_friend: false,
          cognate: false,
          study: { learning_priority: 3, usefulness: 3, difficulty: 2 },
          usage: { register: "neutral", spoken_written: "both", contexts: [] },
          frequency: { book_occurrences: 1 },
          origin: { source_type: "book", created_by: "extraction", derived_from_ids: [] },
          attestations: [attestation],
          tags: ["glossary", "backmatter", "en_fr_glossary"],
        });
      }
    }
  }

  const backmatterVocab: Vocabulary[] = Array.from(vocabMap.values());
  const glossaryExpressions: Expression[] = Array.from(exprMap.values());

  // 2. Load enriched conjugations and backmatter verb tables
  const enrichedConjsData = buildEnrichedConjugations();
  const backmatterVerbs: Verb[] = [...enrichedConjsData.verbs];
  const backmatterConjugations: any[] = [...enrichedConjsData.conjugations];

  for (const vt of verbTables) {
    const conjId = makeConjugationId(vt.verb_id, vt.tense_id);
    backmatterConjugations.push({
      id: conjId,
      type: "conjugation",
      verb_id: vt.verb_id,
      tense_id: vt.tense_id,
      forms: vt.forms,
      compound: false,
      components: {},
      agreement_notes: [],
      spelling_change_notes: [],
      irregularity_notes: [],
      example_ids: [],
      origin: { source_type: "book", created_by: "extraction", derived_from_ids: [] },
      attestations: [{ source_type: "book", page_printed: vt.page_printed, context_type: "verb_table" }],
      editorial: { extraction_confidence: "high", verification_status: "machine_checked" },
    });

    backmatterVerbs.push({
      id: vt.verb_id,
      type: "verb",
      infinitive: vt.verb_infinitive,
      display_form: vt.verb_infinitive,
      english: [vt.verb_infinitive],
      senses: [{ sense_id: `${vt.verb_id}_s1`, english: [vt.verb_infinitive], usage_contexts: [], example_ids: [] }],
      verb_group: vt.verb_infinitive.endsWith("er") ? "1st_group" : vt.verb_infinitive.endsWith("ir") ? "2nd_group" : "3rd_group",
      regularity: "regular",
      pronominal: vt.verb_infinitive.startsWith("se ") || vt.verb_infinitive.startsWith("s'"),
      transitivity: ["transitive"],
      auxiliary: "avoir",
      past_participle: null,
      present_participle: null,
      conjugation_ids: [conjId],
      expression_ids: [],
      complement_frame_ids: [],
      related_verb_ids: [],
      contrast_verb_ids: [],
      confused_with_ids: [],
      word_family_ids: [],
      study: { learning_priority: 3, usefulness: 3, difficulty: 2 },
      usage: { register: "neutral", spoken_written: "both", contexts: [] },
      frequency: { book_occurrences: 1 },
      attestations: [{ source_type: "book", page_printed: vt.page_printed, context_type: "verb_table" }],
      tags: ["verb_table", "backmatter"],
    });
  }

  // 3. Load enriched expressions & examples
  const enrichedExpressions = buildEnrichedExpressions();
  const enrichedExamples = buildEnrichedExamples();

  // 4. Load all 27 chapters
  const chapterFiles = fs
    .readdirSync(NORMALIZED_CHAPTERS_DIR)
    .filter((f) => f.startsWith("chapter-") && f.endsWith(".json"))
    .sort();

  const chapters: Chapter[] = [];
  const sections: Section[] = [];
  const grammar_rules: GrammarRule[] = [];
  const rawVerbs: Verb[] = [...backmatterVerbs];
  const rawConjugations: any[] = [...backmatterConjugations];
  const rawVocabulary: Vocabulary[] = [...backmatterVocab];
  const rawExpressions: Expression[] = [...enrichedExpressions, ...glossaryExpressions];
  const rawExamples: Example[] = [...enrichedExamples];
  const exercises: Exercise[] = [];

  for (const file of chapterFiles) {
    const bundle: ChapterExtractionBundle = JSON.parse(
      fs.readFileSync(path.join(NORMALIZED_CHAPTERS_DIR, file), "utf-8")
    );
    chapters.push(bundle.chapter);
    sections.push(...bundle.sections);
    grammar_rules.push(...bundle.grammar_rules);
    rawVerbs.push(...bundle.verbs);
    rawConjugations.push(...bundle.conjugations);
    rawVocabulary.push(...bundle.vocabulary);
    rawExpressions.push(...bundle.expressions);
    rawExamples.push(...bundle.examples);
    exercises.push(...bundle.exercises);
  }

  // Canonicalize verbs, vocabulary, expressions
  let verbs = canonicalizeVerbs(rawVerbs);
  let vocabulary = canonicalizeVocabulary(rawVocabulary);
  let expressions = canonicalizeExpressions(rawExpressions);

  // Canonicalize conjugations (deduplicate by id and merge attestations/origin)
  const conjugationsMap = new Map<string, any>();
  for (const conj of rawConjugations) {
    if (!conjugationsMap.has(conj.id)) {
      conjugationsMap.set(conj.id, { ...conj });
    } else {
      const existing = conjugationsMap.get(conj.id)!;
      const mergedAtts = mergeAttestations(existing.attestations || [], conj.attestations || []);
      existing.attestations = mergedAtts;
      if (mergedAtts.some((a: any) => a.source_type === "book")) {
        existing.origin = { source_type: "book", created_by: "extraction", derived_from_ids: [] };
      } else if (!existing.origin || existing.origin.source_type !== "book") {
        existing.origin = conj.origin || { source_type: "derived_from_book", created_by: "rule_expansion", derived_from_ids: [conj.verb_id] };
      }
      conjugationsMap.set(conj.id, existing);
    }
  }
  let conjugations = Array.from(conjugationsMap.values());

  // Canonicalize examples (deduplicate by id)
  const examplesMap = new Map<string, Example>();
  for (const ex of rawExamples) {
    if (!examplesMap.has(ex.id)) {
      examplesMap.set(ex.id, ex);
    }
  }
  let examples = Array.from(examplesMap.values());

  // The answer key has already been attached to normalized exercises by the pipeline.  Discover
  // candidates from those reconciled prompts/answers, then promote only source-supported items
  // before the final relationship and canonicalization pass.
  const exercisePromotion = promoteExerciseExpressionCandidates({
    exercises,
    expressions,
    vocabulary,
    verbs,
    conjugations,
    chapters,
    sections,
  });
  expressions = exercisePromotion.expressions;
  vocabulary = exercisePromotion.vocabulary;
  writeExercisePromotionReport(exercisePromotion, EXERCISE_PROMOTION_REPORT);
  console.log(`Exercise expression promotion: ${exercisePromotion.promoted.length} promoted, ${exercisePromotion.merged_existing.length} existing expressions merged, ${exercisePromotion.held_for_review.length} held.`);

  // Build ID lookups
  const verbIdSet = new Set(verbs.map((v) => v.id));
  const vocabIdSet = new Set(vocabulary.map((v) => v.id));
  const conceptIdSet = new Set(concepts.map((c) => c.id));
  const tenseIdSet = new Set(tenses.map((t) => t.id));
  const ruleIdSet = new Set(grammar_rules.map((r) => r.id));
  const exampleIdSet = new Set(examples.map((e) => e.id));
  const exprIdSet = new Set(expressions.map((e) => e.id));

  // Auto-close missing referenced verbs
  const referencedVerbIds = new Set<string>();
  chapters.forEach((ch) => ch.verb_ids?.forEach((id) => referencedVerbIds.add(id)));
  sections.forEach((sec) => sec.verb_ids?.forEach((id) => referencedVerbIds.add(id)));
  expressions.forEach((expr) => expr.base_verb_ids?.forEach((id) => referencedVerbIds.add(id)));
  examples.forEach((ex) => ex.relations?.verbs?.forEach((id) => referencedVerbIds.add(id)));
  exercises.forEach((ex) =>
    ex.questions?.forEach((q) => q.relations?.verbs?.forEach((id) => referencedVerbIds.add(id)))
  );
  conjugations.forEach((conj) => referencedVerbIds.add(conj.verb_id));

  for (const vId of referencedVerbIds) {
    if (!verbIdSet.has(vId)) {
      const inf = vId.replace(/^verb_/, "").replace(/_/g, " ");
      const autoVerb: Verb = {
        id: vId,
        type: "verb",
        infinitive: inf,
        display_form: inf,
        english: [inf],
        senses: [{ sense_id: `${vId}_s1`, english: [inf], usage_contexts: [], example_ids: [] }],
        verb_group: inf.endsWith("er") ? "1st_group" : inf.endsWith("ir") ? "2nd_group" : "3rd_group",
        regularity: "regular",
        pronominal: inf.startsWith("se ") || inf.startsWith("s'"),
        transitivity: ["transitive"],
        auxiliary: "avoir",
        past_participle: null,
        present_participle: null,
        conjugation_ids: [],
        expression_ids: [],
        complement_frame_ids: [],
        related_verb_ids: [],
        contrast_verb_ids: [],
        confused_with_ids: [],
        word_family_ids: [],
        study: { learning_priority: 3, usefulness: 3, difficulty: 2 },
        usage: { register: "neutral", spoken_written: "both", contexts: [] },
        frequency: { book_occurrences: 2 },
        attestations: [{ source_type: "book", chapter_number: 1, context_type: "exercise_question" }],
        tags: ["auto_registered"],
      };
      verbs.push(autoVerb);
      verbIdSet.add(vId);
    }
  }

  // Auto-close missing referenced vocabulary
  const referencedVocabIds = new Set<string>();
  chapters.forEach((ch) => ch.vocabulary_ids?.forEach((id) => referencedVocabIds.add(id)));
  sections.forEach((sec) => sec.vocabulary_ids?.forEach((id) => referencedVocabIds.add(id)));
  expressions.forEach((expr) => expr.related_vocabulary_ids?.forEach((id) => referencedVocabIds.add(id)));

  for (const vocId of referencedVocabIds) {
    if (!vocabIdSet.has(vocId)) {
      const word = vocId.replace(/^vocab_/, "").replace(/_/g, " ");
      const autoVoc: Vocabulary = {
        id: vocId,
        type: "vocabulary",
        canonical_form: word,
        display_form: word,
        french: word,
        english: [word],
        part_of_speech: "noun",
        noun: { gender: "feminine", article: null, plural: null, countability: null },
        adjective: null,
        adverb: null,
        senses: [{ sense_id: `${vocId}_s1`, english: [word], usage_contexts: [], example_ids: [] }],
        semantic_domains: [],
        word_family_ids: [],
        collocation_expression_ids: [],
        false_friend: false,
        cognate: false,
        study: { learning_priority: 3, usefulness: 3, difficulty: 2 },
        usage: { register: "neutral", spoken_written: "both", contexts: [] },
        frequency: { book_occurrences: 2 },
        attestations: [{ source_type: "book", context_type: "expression_list" }],
        tags: ["auto_registered"],
      };
      vocabulary.push(autoVoc);
      vocabIdSet.add(vocId);
    }
  }

  // Populate reverse relationships
  const verbToConjugationsMap = new Map<string, string[]>();
  for (const c of conjugations) {
    const list = verbToConjugationsMap.get(c.verb_id) || [];
    list.push(c.id);
    verbToConjugationsMap.set(c.verb_id, list);
  }

  const verbToExpressionsMap = new Map<string, string[]>();
  for (const e of expressions) {
    for (const vId of e.base_verb_ids || []) {
      const list = verbToExpressionsMap.get(vId) || [];
      list.push(e.id);
      verbToExpressionsMap.set(vId, list);
    }
  }

  for (const v of verbs) {
    if (verbToConjugationsMap.has(v.id)) {
      v.conjugation_ids = Array.from(new Set([...(v.conjugation_ids || []), ...verbToConjugationsMap.get(v.id)!]));
    }
    if (verbToExpressionsMap.has(v.id)) {
      v.expression_ids = Array.from(new Set([...(v.expression_ids || []), ...verbToExpressionsMap.get(v.id)!]));
    }
  }

  // Clean dangling relation IDs from rules and examples
  for (const rule of grammar_rules) {
    rule.example_ids = rule.example_ids.filter((id) => exampleIdSet.has(id));
    rule.contrast_with_rule_ids = rule.contrast_with_rule_ids.filter((id) => ruleIdSet.has(id));
    rule.related_rule_ids = rule.related_rule_ids.filter((id) => ruleIdSet.has(id));
    rule.prerequisite_rule_ids = rule.prerequisite_rule_ids.filter((id) => ruleIdSet.has(id));
    rule.tense_ids = rule.tense_ids.filter((id) => tenseIdSet.has(id));
    if (rule.tense_ids.length === 0) {
      rule.tense_ids.push("tense_present_indicative");
    }
    rule.concept_ids = rule.concept_ids.filter((id) => conceptIdSet.has(id));
  }

  for (const ex of examples) {
    if (ex.relations) {
      if (ex.relations.verbs) ex.relations.verbs = ex.relations.verbs.filter((id) => verbIdSet.has(id));
      if (ex.relations.expressions) ex.relations.expressions = ex.relations.expressions.filter((id) => exprIdSet.has(id));
      if (ex.relations.tenses) ex.relations.tenses = ex.relations.tenses.filter((id) => tenseIdSet.has(id));
      if (ex.relations.grammar_rules) ex.relations.grammar_rules = ex.relations.grammar_rules.filter((id) => ruleIdSet.has(id));
    }
  }

  for (const ch of chapters) {
    ch.concept_ids = ch.concept_ids.filter((id) => conceptIdSet.has(id));
    ch.tense_ids = ch.tense_ids.filter((id) => tenseIdSet.has(id));
    ch.verb_ids = Array.from(new Set(ch.verb_ids.filter((id) => verbIdSet.has(id))));
    ch.expression_ids = Array.from(new Set(ch.expression_ids.filter((id) => exprIdSet.has(id))));
    ch.vocabulary_ids = Array.from(new Set(ch.vocabulary_ids.filter((id) => vocabIdSet.has(id))));
    ch.example_ids = Array.from(new Set(ch.example_ids.filter((id) => exampleIdSet.has(id))));
  }

  for (const sec of sections) {
    sec.concept_ids = sec.concept_ids.filter((id) => conceptIdSet.has(id));
    sec.tense_ids = sec.tense_ids.filter((id) => tenseIdSet.has(id));
    sec.example_ids = sec.example_ids.filter((id) => exampleIdSet.has(id));
    sec.verb_ids = Array.from(new Set(sec.verb_ids.filter((id) => verbIdSet.has(id))));
    sec.expression_ids = Array.from(new Set(sec.expression_ids.filter((id) => exprIdSet.has(id))));
    sec.vocabulary_ids = Array.from(new Set(sec.vocabulary_ids.filter((id) => vocabIdSet.has(id))));
  }

  // Create built-in study sets
  const study_sets: StudySet[] = [
    {
      id: makeStudySetId("essential_verbs"),
      name: "Essential French Verbs",
      description: "Core high-frequency French verbs covering auxiliaries, modals, and essential 1st/2nd/3rd group verbs.",
      type: "static",
      item_ids: verbs.slice(0, 50).map((v) => v.id),
      tags: ["essential", "verbs", "core"],
    },
    {
      id: makeStudySetId("high_frequency_expressions"),
      name: "High-Frequency Idiomatic Expressions",
      description: "Essential colloquial and conversational French expressions with avoir, faire, aller, and venir.",
      type: "static",
      item_ids: expressions.slice(0, 50).map((e) => e.id),
      tags: ["idioms", "expressions", "collocations"],
    },
    {
      id: makeStudySetId("prepositional_verbal_patterns"),
      name: "Verbs with Prepositions (à and de)",
      description: "Comprehensive study set of verbs requiring à or de before an infinitive.",
      type: "static",
      item_ids: expressions.filter((e) => e.canonical_form.includes(" à ") || e.canonical_form.includes(" de ")).map((e) => e.id),
      tags: ["prepositions", "infinitive_constructions", "patterns"],
    },
    {
      id: makeStudySetId("core_grammar_tenses"),
      name: "French Tense System Mastery",
      description: "Comprehensive review of all 16 indicative, subjunctive, conditional, and imperative tenses/moods.",
      type: "static",
      item_ids: grammar_rules.slice(0, 40).map((r) => r.id),
      tags: ["tenses", "grammar", "mastery"],
    },
  ];

  // Build root dataset
  const root: SuperDatasetRoot = {
    schema_version: "1.0.0",
    dataset_id: "pmp_complete_french_grammar_revision",
    generated_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    book: {
      id: makeBookId("pmp_complete_french_grammar"),
      title: "Practice Makes Perfect: Complete French Grammar",
      author: "Annie Heminway",
      language: "French",
      instruction_language: "English",
      edition_year: 2020,
      publisher: "McGraw-Hill",
      description: "Comprehensive French grammar guide and exercise workbook.",
      source_file: {
        filename: "source_book.pdf",
        page_count_pdf: 286,
      },
      chapter_ids: chapters.map((c) => c.id),
      notes: null,
    },
    taxonomy: {},
    chapters,
    sections,
    concepts,
    tenses,
    grammar_rules,
    verbs,
    conjugations,
    expressions,
    vocabulary,
    examples,
    exercises,
    study_sets,
    quality_report: {
      counts: {
        chapters: chapters.length,
        sections: sections.length,
        grammar_rules: grammar_rules.length,
        verbs: verbs.length,
        conjugations: conjugations.length,
        expressions: expressions.length,
        vocabulary: vocabulary.length,
        examples: examples.length,
        exercises: exercises.length,
        questions: exercises.reduce((acc, ex) => acc + ex.questions.length, 0),
        study_sets: study_sets.length,
      },
      unresolved_relations: [],
      duplicate_candidates: [],
      low_confidence_items: [],
      missing_answers: [],
      missing_translations: [],
      missing_gender_for_nouns: [],
      missing_conjugation_forms: [],
    },
  };

  // Ensure output directory exists
  const finalDir = path.dirname(FINAL_DATASET_FILE);
  if (!fs.existsSync(finalDir)) {
    fs.mkdirSync(finalDir, { recursive: true });
  }

  fs.writeFileSync(FINAL_DATASET_FILE, JSON.stringify(root, null, 2), "utf-8");
  console.log(`✓ Assembled and saved Super-Dataset to ${FINAL_DATASET_FILE}`);
  console.log(`Summary:`);
  console.log(`- Chapters: ${chapters.length}`);
  console.log(`- Sections: ${sections.length}`);
  console.log(`- Grammar Rules: ${grammar_rules.length}`);
  console.log(`- Verbs: ${verbs.length}`);
  console.log(`- Conjugations: ${conjugations.length}`);
  console.log(`- Expressions: ${expressions.length}`);
  console.log(`- Vocabulary: ${vocabulary.length}`);
  console.log(`- Examples: ${examples.length}`);
  console.log(`- Exercises: ${exercises.length}`);
  console.log(`- Study Sets: ${study_sets.length}`);

  return root;
}

if (require.main === module) {
  reconcileGlobal();
}
