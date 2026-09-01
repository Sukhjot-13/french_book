import { z } from "zod";

// =======================================================================
// TAXONOMY & ENUMS
// =======================================================================

export const LearningPrioritySchema = z.union([
  z.literal(1),
  z.literal(2),
  z.literal(3),
  z.literal(4),
  z.literal(5),
]);

export const DifficultySchema = z.union([
  z.literal(1),
  z.literal(2),
  z.literal(3),
  z.literal(4),
  z.literal(5),
]);

export const UsefulnessSchema = z.union([
  z.literal(1),
  z.literal(2),
  z.literal(3),
  z.literal(4),
  z.literal(5),
]);

export const SourceTypeSchema = z.enum([
  "book",
  "derived_from_book",
  "study_extension",
  "external_reference",
]);

export const ContextTypeSchema = z.enum([
  "chapter_title",
  "grammar_explanation",
  "conjugation_table",
  "vocabulary_box",
  "expression_list",
  "example_sentence",
  "exercise_instruction",
  "exercise_question",
  "answer_key",
  "verb_table",
  "glossary_fr_en",
  "glossary_en_fr",
  "other",
]);

export const RegisterSchema = z.enum([
  "formal",
  "neutral",
  "informal",
  "colloquial",
  "literary",
]);

export const SpokenWrittenSchema = z.enum([
  "spoken",
  "written",
  "both",
]);

export const ExpressionTypeSchema = z.enum([
  "verb_pattern",
  "collocation",
  "fixed_expression",
  "idiom",
  "sentence_starter",
  "conversation_phrase",
  "connector",
  "functional_phrase",
  "formulaic_phrase",
]);

export const CollocationStrengthSchema = z.enum([
  "strong",
  "common",
  "possible",
]);

export const PartOfSpeechSchema = z.enum([
  "noun",
  "adjective",
  "adverb",
  "pronoun",
  "preposition",
  "conjunction",
  "interjection",
  "numeral",
  "determiner",
  "phrase",
  "verb",
  "other",
]);

export const NounGenderSchema = z.enum([
  "masculine",
  "feminine",
  "common",
  "variable",
  "unknown",
]);

export const VerbGroupSchema = z.enum([
  "1st_group",
  "2nd_group",
  "3rd_group",
  "irregular",
  "defective",
  "impersonal",
  "unknown",
]);

export const RegularitySchema = z.enum([
  "regular",
  "irregular",
  "semi_regular",
  "stem_changing",
  "spelling_changing",
]);

export const AuxiliarySchema = z.enum([
  "avoir",
  "etre",
  "both",
  "none",
]);

export const MoodSchema = z.enum([
  "indicative",
  "subjunctive",
  "conditional",
  "imperative",
  "infinitive",
  "participle",
  "gerund",
  "other",
]);

export const ExerciseTypeSchema = z.enum([
  "fill_in_conjugation",
  "translation_en_to_fr",
  "translation_fr_to_en",
  "matching",
  "negative_transformation",
  "interrogative_transformation",
  "rewrite",
  "choose_correct_form",
  "completion",
  "free_response",
  "identification",
  "ordering",
  "other",
]);

export const VerificationStatusSchema = z.enum([
  "unreviewed",
  "machine_checked",
  "human_checked",
  "needs_review",
]);

export const ConfidenceSchema = z.enum([
  "high",
  "medium",
  "low",
]);

export const FrequencyTierSchema = z.enum([
  "rare",
  "occasional",
  "common",
  "very_common",
]);

// =======================================================================
// SUPPORTING STRUCTURES
// =======================================================================

export const AttestationSchema = z.object({
  source_type: SourceTypeSchema.default("book"),
  chapter_number: z.number().int().positive().nullable().optional(),
  chapter_id: z.string().nullable().optional(),
  section_id: z.string().nullable().optional(),
  page_printed: z.number().int().positive().nullable().optional(),
  page_pdf: z.number().int().positive().nullable().optional(),
  context_type: ContextTypeSchema.default("grammar_explanation"),
  exercise_id: z.string().nullable().optional(),
  source_anchor: z.string().nullable().optional(),
  notes: z.string().nullable().optional(),
});

export const StudyMetadataSchema = z.object({
  learning_priority: LearningPrioritySchema.default(3),
  usefulness: UsefulnessSchema.default(3),
  difficulty: DifficultySchema.default(2),
  cefr: z
    .union([
      z.string(),
      z.object({
        level: z.string(),
        source_type: z.string().optional(),
      }),
    ])
    .nullable()
    .optional(),
});

export const UsageMetadataSchema = z.object({
  register: RegisterSchema.default("neutral"),
  spoken_written: SpokenWrittenSchema.default("both"),
  contexts: z.array(z.string()).default([]),
  politeness: z.string().nullable().optional(),
});

export const OriginMetadataSchema = z.object({
  source_type: SourceTypeSchema.default("book"),
  created_by: z.string().default("extraction"),
  derived_from_ids: z.array(z.string()).default([]),
});

export const EditorialMetadataSchema = z.object({
  extraction_confidence: ConfidenceSchema.default("high"),
  verification_status: VerificationStatusSchema.default("machine_checked"),
  notes: z.string().nullable().optional(),
});

export const FrequencySchema = z.object({
  book_occurrences: z.number().int().nonnegative().default(0),
  book_frequency_tier: FrequencyTierSchema.nullable().optional(),
  real_world_frequency: z.number().nullable().optional(),
  real_world_frequency_source: z.string().nullable().optional(),
});

export const RelationsSchema = z.object({
  chapters: z.array(z.string()).default([]),
  sections: z.array(z.string()).default([]),
  concepts: z.array(z.string()).default([]),
  tenses: z.array(z.string()).default([]),
  grammar_rules: z.array(z.string()).default([]),
  verbs: z.array(z.string()).default([]),
  conjugations: z.array(z.string()).default([]),
  expressions: z.array(z.string()).default([]),
  vocabulary: z.array(z.string()).default([]),
  examples: z.array(z.string()).default([]),
  exercises: z.array(z.string()).default([]),
}).partial();

export const CommonMistakeSchema = z.object({
  wrong: z.string().nullable().optional(),
  mistake: z.string().nullable().optional(),
  correct: z.string().nullable().optional(),
  correction: z.string().nullable().optional(),
  explanation: z.string().nullable().optional(),
});

export const PatternSlotSchema = z.object({
  name: z.string(),
  display: z.string(),
  type: z.string(),
  required: z.boolean().default(true),
});

export const TransformationSchema = z.object({
  name: z.string(),
  from_pattern: z.string(),
  to_pattern: z.string(),
  notes: z.string().nullable().optional(),
});

export const SenseSchema = z.object({
  sense_id: z.string(),
  english: z.array(z.string()),
  definition_note: z.string().nullable().optional(),
  usage_contexts: z.array(z.string()).default([]),
  example_ids: z.array(z.string()).default([]),
});

export const NounMorphologySchema = z.object({
  gender: NounGenderSchema.nullable().optional(),
  article: z.string().nullable().optional(),
  plural: z.string().nullable().optional(),
  countability: z.string().nullable().optional(),
});

export const AdjectiveMorphologySchema = z.object({
  masculine_singular: z.string().nullable().optional(),
  feminine_singular: z.string().nullable().optional(),
  masculine_plural: z.string().nullable().optional(),
  feminine_plural: z.string().nullable().optional(),
  special_forms: z.array(z.string()).default([]),
});

export const PronunciationSchema = z.object({
  ipa: z.string().nullable().optional(),
  notes: z.string().nullable().optional(),
  audio_ref: z.string().nullable().optional(),
});

// =======================================================================
// TOP-LEVEL ENTITY SCHEMAS
// =======================================================================

// 1. BOOK
export const BookSchema = z.object({
  id: z.string().regex(/^book_/),
  title: z.string(),
  author: z.string(),
  language: z.string().default("French"),
  instruction_language: z.string().default("English"),
  edition_year: z.number().int().optional(),
  publisher: z.string().optional(),
  description: z.string().nullable().optional(),
  source_file: z.object({
    filename: z.string(),
    page_count_pdf: z.number().int(),
  }),
  chapter_ids: z.array(z.string()).default([]),
  notes: z.string().nullable().optional(),
});

// 2. CHAPTER
export const ChapterSchema = z.object({
  id: z.string().regex(/^chapter_/),
  chapter_number: z.number().int().positive(),
  title: z.string(),
  section_ids: z.array(z.string()).default([]),
  concept_ids: z.array(z.string()).default([]),
  tense_ids: z.array(z.string()).default([]),
  grammar_rule_ids: z.array(z.string()).default([]),
  verb_ids: z.array(z.string()).default([]),
  conjugation_ids: z.array(z.string()).default([]),
  expression_ids: z.array(z.string()).default([]),
  vocabulary_ids: z.array(z.string()).default([]),
  example_ids: z.array(z.string()).default([]),
  exercise_ids: z.array(z.string()).default([]),
  source: z.object({
    page_start_printed: z.number().int().positive().nullable().optional(),
    page_end_printed: z.number().int().positive().nullable().optional(),
    page_start_pdf: z.number().int().positive().nullable().optional(),
    page_end_pdf: z.number().int().positive().nullable().optional(),
  }),
  tags: z.array(z.string()).default([]),
});

// 3. SECTION
export const SectionSchema = z.object({
  id: z.string().regex(/^section_/),
  chapter_id: z.string().regex(/^chapter_/),
  order: z.number().int().positive(),
  title: z.string(),
  concept_ids: z.array(z.string()).default([]),
  tense_ids: z.array(z.string()).default([]),
  grammar_rule_ids: z.array(z.string()).default([]),
  verb_ids: z.array(z.string()).default([]),
  expression_ids: z.array(z.string()).default([]),
  vocabulary_ids: z.array(z.string()).default([]),
  example_ids: z.array(z.string()).default([]),
  exercise_ids: z.array(z.string()).default([]),
  source: z.object({
    page_start_printed: z.number().int().positive().nullable().optional(),
    page_end_printed: z.number().int().positive().nullable().optional(),
    page_start_pdf: z.number().int().positive().nullable().optional(),
    page_end_pdf: z.number().int().positive().nullable().optional(),
  }),
});

// 4. CONCEPT
export const ConceptSchema = z.object({
  id: z.string().regex(/^concept_/),
  name: z.string(),
  name_french: z.string().optional(),
  description: z.string().nullable().optional(),
  relations: RelationsSchema.default({}),
  study: StudyMetadataSchema.default({ learning_priority: 3, usefulness: 3, difficulty: 2 }),
  tags: z.array(z.string()).default([]),
});

// 5. TENSE / MOOD
export const TenseSchema = z.object({
  id: z.string().regex(/^tense_/),
  type: z.literal("tense").default("tense"),
  name_french: z.string(),
  name_english: z.string(),
  mood: MoodSchema.default("indicative"),
  time_reference: z.array(z.string()).default([]),
  aspect_notes: z.string().nullable().optional(),
  summary: z.string().nullable().optional(),
  formation_rule_ids: z.array(z.string()).default([]),
  usage_rule_ids: z.array(z.string()).default([]),
  exception_rule_ids: z.array(z.string()).default([]),
  common_time_marker_ids: z.array(z.string()).default([]),
  common_time_markers_text: z.array(z.string()).default([]),
  related_tense_ids: z.array(z.string()).default([]),
  contrast_tense_ids: z.array(z.string()).default([]),
  conjugation_ids: z.array(z.string()).default([]),
  example_ids: z.array(z.string()).default([]),
  exercise_ids: z.array(z.string()).default([]),
  study: StudyMetadataSchema.default({ learning_priority: 3, usefulness: 3, difficulty: 2 }),
  attestations: z.array(AttestationSchema).default([]),
  tags: z.array(z.string()).default([]),
});

// 6. GRAMMAR RULE
export const GrammarRuleSchema = z.object({
  id: z.string().regex(/^rule_/),
  type: z.literal("grammar_rule").default("grammar_rule"),
  title: z.string(),
  short_label: z.string().nullable().optional(),
  grammar_category: z.string().default("general"),
  concept_ids: z.array(z.string()).default([]),
  tense_ids: z.array(z.string()).default([]),
  summary: z.string().nullable().optional(),
  explanation: z.string().default(""),
  formation: z
    .object({
      steps: z.array(z.string()).default([]),
      patterns: z.array(z.string()).default([]),
      endings: z.record(z.string(), z.string()).default({}),
      auxiliary: z.string().nullable().optional(),
      agreement: z.string().nullable().optional(),
    })
    .nullable()
    .optional(),
  mood_governance: z
    .object({
      requires: z.string().nullable().optional(),
      trigger_expression_ids: z.array(z.string()).default([]),
    })
    .nullable()
    .optional(),
  usage_conditions: z.array(z.string()).default([]),
  trigger_words: z.array(z.string()).default([]),
  signal_words: z.array(z.string()).default([]),
  exceptions: z.array(z.string()).default([]),
  restrictions: z.array(z.string()).default([]),
  notes: z.array(z.string()).default([]),
  common_mistakes: z.array(CommonMistakeSchema).default([]),
  contrast_with_rule_ids: z.array(z.string()).default([]),
  related_rule_ids: z.array(z.string()).default([]),
  prerequisite_rule_ids: z.array(z.string()).default([]),
  example_ids: z.array(z.string()).default([]),
  exercise_ids: z.array(z.string()).default([]),
  study: StudyMetadataSchema.default({ learning_priority: 3, usefulness: 3, difficulty: 2 }),
  attestations: z.array(AttestationSchema).default([]),
  tags: z.array(z.string()).default([]),
});


// 7. VERB
export const VerbSchema = z.object({
  id: z.string().regex(/^verb_/),
  type: z.literal("verb").default("verb"),
  infinitive: z.string(),
  display_form: z.string().optional(),
  english: z.array(z.string()),
  senses: z.array(SenseSchema).default([]),
  verb_group: VerbGroupSchema.default("1st_group"),
  regularity: RegularitySchema.default("regular"),
  pronominal: z.boolean().default(false),
  transitivity: z.array(z.string()).default([]),
  auxiliary: AuxiliarySchema.default("avoir"),
  past_participle: z.string().nullable().optional(),
  present_participle: z.string().nullable().optional(),
  conjugation_ids: z.array(z.string()).default([]),
  expression_ids: z.array(z.string()).default([]),
  complement_frame_ids: z.array(z.string()).default([]),
  related_verb_ids: z.array(z.string()).default([]),
  contrast_verb_ids: z.array(z.string()).default([]),
  confused_with_ids: z.array(z.string()).default([]),
  word_family_ids: z.array(z.string()).default([]),
  study: StudyMetadataSchema.default({ learning_priority: 3, usefulness: 3, difficulty: 2 }),
  usage: UsageMetadataSchema.default({ register: "neutral", spoken_written: "both", contexts: [] }),
  frequency: FrequencySchema.default({ book_occurrences: 0 }),
  attestations: z.array(AttestationSchema).default([]),
  tags: z.array(z.string()).default([]),
});

// 8. CONJUGATION
export const ConjugationSchema = z.object({
  id: z.string().regex(/^conj_/),
  type: z.literal("conjugation").default("conjugation"),
  verb_id: z.string().regex(/^verb_/),
  tense_id: z.string().regex(/^tense_/),
  forms: z.record(z.string(), z.string().nullable()).default({}),
  compound: z.boolean().default(false),
  components: z
    .object({
      auxiliary_verb_id: z.string().nullable().optional(),
      auxiliary_tense_id: z.string().nullable().optional(),
      past_participle: z.string().nullable().optional(),
    })
    .default({}),
  agreement_notes: z.array(z.string()).default([]),
  spelling_change_notes: z.array(z.string()).default([]),
  irregularity_notes: z.array(z.string()).default([]),
  example_ids: z.array(z.string()).default([]),
  attestations: z.array(AttestationSchema).default([]),
  editorial: EditorialMetadataSchema.default({ extraction_confidence: "high", verification_status: "machine_checked" }),
});

// 9. EXPRESSION
export const ExpressionSchema = z.object({
  id: z.string().regex(/^expr_/),
  type: z.literal("expression").default("expression"),
  expression_type: ExpressionTypeSchema.default("verb_pattern"),
  canonical_form: z.string(),
  display_form: z.string().optional(),
  english: z.array(z.string()),
  base_verb_ids: z.array(z.string()).default([]),
  related_vocabulary_ids: z.array(z.string()).default([]),
  productive: z.boolean().default(false),
  collocation_strength: CollocationStrengthSchema.nullable().optional(),
  pattern: z.string().nullable().optional(),
  pattern_slots: z.array(PatternSlotSchema).default([]),
  complement_structure: z
    .object({
      head: z.string().nullable().optional(),
      person_preposition: z.string().nullable().optional(),
      noun_preposition: z.string().nullable().optional(),
      infinitive_preposition: z.string().nullable().optional(),
      clause_marker: z.string().nullable().optional(),
    })
    .nullable()
    .optional(),
  mood_governance: z
    .object({
      following_clause_mood: z.string().nullable().optional(),
      notes: z.string().nullable().optional(),
    })
    .nullable()
    .optional(),
  transformations: z.array(TransformationSchema).default([]),
  variants: z.array(z.string()).default([]),
  function_ids: z.array(z.string()).default([]),
  usage_notes: z.array(z.string()).default([]),
  restrictions: z.array(z.string()).default([]),
  common_mistakes: z.array(CommonMistakeSchema).default([]),
  example_ids: z.array(z.string()).default([]),
  study: StudyMetadataSchema.default({ learning_priority: 3, usefulness: 3, difficulty: 2 }),
  usage: UsageMetadataSchema.default({ register: "neutral", spoken_written: "both", contexts: [] }),
  frequency: FrequencySchema.default({ book_occurrences: 0 }),
  origin: OriginMetadataSchema.default({ source_type: "book", created_by: "extraction", derived_from_ids: [] }),
  attestations: z.array(AttestationSchema).default([]),
  relations: RelationsSchema.default({}),
  tags: z.array(z.string()).default([]),
});

// 10. VOCABULARY
export const VocabularySchema = z.object({
  id: z.string().regex(/^vocab_/),
  type: z.literal("vocabulary").default("vocabulary"),
  canonical_form: z.string(),
  display_form: z.string().optional(),
  french: z.string(),
  english: z.array(z.string()),
  part_of_speech: PartOfSpeechSchema.default("noun"),
  noun: NounMorphologySchema.nullable().optional(),
  adjective: AdjectiveMorphologySchema.nullable().optional(),
  adverb: z.record(z.string(), z.any()).nullable().optional(),
  senses: z.array(SenseSchema).default([]),
  semantic_domains: z.array(z.string()).default([]),
  word_family_ids: z.array(z.string()).default([]),
  collocation_expression_ids: z.array(z.string()).default([]),
  false_friend: z.boolean().default(false),
  cognate: z.boolean().default(false),
  pronunciation: PronunciationSchema.nullable().optional(),
  study: StudyMetadataSchema.default({ learning_priority: 3, usefulness: 3, difficulty: 2 }),
  usage: UsageMetadataSchema.default({ register: "neutral", spoken_written: "both", contexts: [] }),
  frequency: FrequencySchema.default({ book_occurrences: 0 }),
  attestations: z.array(AttestationSchema).default([]),
  tags: z.array(z.string()).default([]),
});


// 11. EXAMPLE SENTENCE
export const ExampleSchema = z.object({
  id: z.string().regex(/^example_/),
  type: z.literal("example").default("example"),
  french: z.string(),
  english: z.string(),
  literal_english: z.string().nullable().optional(),
  source_type: SourceTypeSchema.default("book"),
  annotations: z
    .object({
      focus_spans: z
        .array(
          z.object({
            text: z.string(),
            role: z.string().optional(),
          })
        )
        .default([]),
    })
    .default({ focus_spans: [] }),
  relations: RelationsSchema.default({}),
  cloze_candidates: z.array(z.string()).default([]),
  study: z
    .object({
      difficulty: DifficultySchema.default(2),
    })
    .default({ difficulty: 2 }),
  attestations: z.array(AttestationSchema).default([]),
});

// 12. EXERCISE QUESTION & EXERCISE
export const ExerciseQuestionSchema = z.object({
  question_id: z.string(),
  prompt: z.string(),
  answer: z.string().nullable().optional(),
  answer_explanation: z.string().nullable().optional(),
  open_ended: z.boolean().default(false),
  relations: RelationsSchema.default({}),
});

export const ExerciseSchema = z.object({
  id: z.string().regex(/^exercise_/),
  type: z.literal("exercise").default("exercise"),
  chapter_id: z.string().regex(/^chapter_/),
  section_id: z.string().nullable().optional(),
  exercise_number: z.string(),
  exercise_type: ExerciseTypeSchema.default("fill_in_conjugation"),
  instructions_french: z.string().default(""),
  instructions_english: z.string().nullable().optional(),
  questions: z.array(ExerciseQuestionSchema).default([]),
  answer_key_source: z
    .object({
      page_printed: z.number().int().positive().nullable().optional(),
      page_pdf: z.number().int().positive().nullable().optional(),
    })
    .default({}),
  study: z
    .object({
      difficulty: DifficultySchema.default(2),
    })
    .default({ difficulty: 2 }),
  attestations: z.array(AttestationSchema).default([]),
  tags: z.array(z.string()).default([]),
});

// 13. STUDY SET
export const StudySetFilterSchema = z.object({
  field: z.string(),
  operator: z.enum(["equals", "gte", "lte", "contains", "in", "neq"]),
  value: z.any(),
});

export const StudySetSortSchema = z.object({
  field: z.string(),
  direction: z.enum(["asc", "desc"]),
});

export const StudySetSchema = z.object({
  id: z.string().regex(/^studyset_/),
  name: z.string(),
  description: z.string().nullable().optional(),
  type: z.enum(["static", "dynamic"]).default("static"),
  item_ids: z.array(z.string()).default([]),
  query: z
    .object({
      collection: z.string(),
      filters: z.array(StudySetFilterSchema).default([]),
      sort: z.array(StudySetSortSchema).default([]),
    })
    .optional(),
  tags: z.array(z.string()).default([]),
});

// 14. QUALITY REPORT
export const QualityReportSchema = z.object({
  counts: z.record(z.string(), z.number().int().nonnegative()).default({}),
  unresolved_relations: z.array(z.any()).default([]),
  duplicate_candidates: z.array(z.any()).default([]),
  low_confidence_items: z.array(z.any()).default([]),
  missing_answers: z.array(z.any()).default([]),
  missing_translations: z.array(z.any()).default([]),
  missing_gender_for_nouns: z.array(z.any()).default([]),
  missing_conjugation_forms: z.array(z.any()).default([]),
});

// 15. TAXONOMY
export const TaxonomySchema = z.object({
  learning_priority: z.record(z.string(), z.string()).optional(),
  difficulty: z.record(z.string(), z.string()).optional(),
  registers: z.array(z.string()).optional(),
  spoken_written: z.array(z.string()).optional(),
  expression_types: z.array(z.string()).optional(),
  collocation_strength: z.array(z.string()).optional(),
  verification_status: z.array(z.string()).optional(),
  confidence: z.array(z.string()).optional(),
}).passthrough();

// =======================================================================
// MASTER ROOT SCHEMA
// =======================================================================

export const SuperDatasetRootSchema = z.object({
  schema_version: z.string().default("1.0.0"),
  dataset_id: z.string().default("pmp_complete_french_grammar_revision"),
  generated_at: z.string().nullable().optional(),
  updated_at: z.string().nullable().optional(),

  book: BookSchema,
  taxonomy: TaxonomySchema.default({}),

  chapters: z.array(ChapterSchema).default([]),
  sections: z.array(SectionSchema).default([]),

  concepts: z.array(ConceptSchema).default([]),
  tenses: z.array(TenseSchema).default([]),
  grammar_rules: z.array(GrammarRuleSchema).default([]),

  verbs: z.array(VerbSchema).default([]),
  conjugations: z.array(ConjugationSchema).default([]),

  expressions: z.array(ExpressionSchema).default([]),
  vocabulary: z.array(VocabularySchema).default([]),

  examples: z.array(ExampleSchema).default([]),
  exercises: z.array(ExerciseSchema).default([]),

  study_sets: z.array(StudySetSchema).default([]),

  quality_report: QualityReportSchema.default({
    counts: {},
    unresolved_relations: [],
    duplicate_candidates: [],
    low_confidence_items: [],
    missing_answers: [],
    missing_translations: [],
    missing_gender_for_nouns: [],
    missing_conjugation_forms: [],
  }),
});

// TypeScript Types
export type Book = z.infer<typeof BookSchema>;
export type Chapter = z.infer<typeof ChapterSchema>;
export type Section = z.infer<typeof SectionSchema>;
export type Concept = z.infer<typeof ConceptSchema>;
export type Tense = z.infer<typeof TenseSchema>;
export type GrammarRule = z.infer<typeof GrammarRuleSchema>;
export type Verb = z.infer<typeof VerbSchema>;
export type Conjugation = z.infer<typeof ConjugationSchema>;
export type Expression = z.infer<typeof ExpressionSchema>;
export type Vocabulary = z.infer<typeof VocabularySchema>;
export type Example = z.infer<typeof ExampleSchema>;
export type Exercise = z.infer<typeof ExerciseSchema>;
export type ExerciseQuestion = z.infer<typeof ExerciseQuestionSchema>;
export type StudySet = z.infer<typeof StudySetSchema>;
export type QualityReport = z.infer<typeof QualityReportSchema>;
export type Taxonomy = z.infer<typeof TaxonomySchema>;
export type SuperDatasetRoot = z.infer<typeof SuperDatasetRootSchema>;
export type Attestation = z.infer<typeof AttestationSchema>;
export type StudyMetadata = z.infer<typeof StudyMetadataSchema>;
export type UsageMetadata = z.infer<typeof UsageMetadataSchema>;
export type EditorialMetadata = z.infer<typeof EditorialMetadataSchema>;
