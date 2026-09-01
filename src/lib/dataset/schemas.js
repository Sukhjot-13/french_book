"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.QualityReportSchema = exports.StudySetSchema = exports.StudySetSortSchema = exports.StudySetFilterSchema = exports.ExerciseSchema = exports.ExerciseQuestionSchema = exports.ExampleSchema = exports.VocabularySchema = exports.ExpressionSchema = exports.ConjugationSchema = exports.VerbSchema = exports.GrammarRuleSchema = exports.TenseSchema = exports.ConceptSchema = exports.SectionSchema = exports.ChapterSchema = exports.BookSchema = exports.PronunciationSchema = exports.AdjectiveMorphologySchema = exports.NounMorphologySchema = exports.SenseSchema = exports.TransformationSchema = exports.PatternSlotSchema = exports.CommonMistakeSchema = exports.RelationsSchema = exports.FrequencySchema = exports.EditorialMetadataSchema = exports.OriginMetadataSchema = exports.UsageMetadataSchema = exports.StudyMetadataSchema = exports.AttestationSchema = exports.FrequencyTierSchema = exports.ConfidenceSchema = exports.VerificationStatusSchema = exports.ExerciseTypeSchema = exports.MoodSchema = exports.AuxiliarySchema = exports.RegularitySchema = exports.VerbGroupSchema = exports.NounGenderSchema = exports.PartOfSpeechSchema = exports.CollocationStrengthSchema = exports.ExpressionTypeSchema = exports.SpokenWrittenSchema = exports.RegisterSchema = exports.ContextTypeSchema = exports.SourceTypeSchema = exports.UsefulnessSchema = exports.DifficultySchema = exports.LearningPrioritySchema = void 0;
exports.SuperDatasetRootSchema = exports.TaxonomySchema = void 0;
var zod_1 = require("zod");
// =======================================================================
// TAXONOMY & ENUMS
// =======================================================================
exports.LearningPrioritySchema = zod_1.z.union([
    zod_1.z.literal(1),
    zod_1.z.literal(2),
    zod_1.z.literal(3),
    zod_1.z.literal(4),
    zod_1.z.literal(5),
]);
exports.DifficultySchema = zod_1.z.union([
    zod_1.z.literal(1),
    zod_1.z.literal(2),
    zod_1.z.literal(3),
    zod_1.z.literal(4),
    zod_1.z.literal(5),
]);
exports.UsefulnessSchema = zod_1.z.union([
    zod_1.z.literal(1),
    zod_1.z.literal(2),
    zod_1.z.literal(3),
    zod_1.z.literal(4),
    zod_1.z.literal(5),
]);
exports.SourceTypeSchema = zod_1.z.enum([
    "book",
    "derived_from_book",
    "study_extension",
    "external_reference",
]);
exports.ContextTypeSchema = zod_1.z.enum([
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
exports.RegisterSchema = zod_1.z.enum([
    "formal",
    "neutral",
    "informal",
    "colloquial",
    "literary",
]);
exports.SpokenWrittenSchema = zod_1.z.enum([
    "spoken",
    "written",
    "both",
]);
exports.ExpressionTypeSchema = zod_1.z.enum([
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
exports.CollocationStrengthSchema = zod_1.z.enum([
    "strong",
    "common",
    "possible",
]);
exports.PartOfSpeechSchema = zod_1.z.enum([
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
exports.NounGenderSchema = zod_1.z.enum([
    "masculine",
    "feminine",
    "common",
    "variable",
    "unknown",
]);
exports.VerbGroupSchema = zod_1.z.enum([
    "1st_group",
    "2nd_group",
    "3rd_group",
    "irregular",
    "defective",
    "impersonal",
    "unknown",
]);
exports.RegularitySchema = zod_1.z.enum([
    "regular",
    "irregular",
    "semi_regular",
    "stem_changing",
    "spelling_changing",
]);
exports.AuxiliarySchema = zod_1.z.enum([
    "avoir",
    "etre",
    "both",
    "none",
]);
exports.MoodSchema = zod_1.z.enum([
    "indicative",
    "subjunctive",
    "conditional",
    "imperative",
    "infinitive",
    "participle",
    "gerund",
    "other",
]);
exports.ExerciseTypeSchema = zod_1.z.enum([
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
exports.VerificationStatusSchema = zod_1.z.enum([
    "unreviewed",
    "machine_checked",
    "human_checked",
    "needs_review",
]);
exports.ConfidenceSchema = zod_1.z.enum([
    "high",
    "medium",
    "low",
]);
exports.FrequencyTierSchema = zod_1.z.enum([
    "rare",
    "occasional",
    "common",
    "very_common",
]);
// =======================================================================
// SUPPORTING STRUCTURES
// =======================================================================
exports.AttestationSchema = zod_1.z.object({
    source_type: exports.SourceTypeSchema.default("book"),
    chapter_number: zod_1.z.number().int().positive().nullable().optional(),
    chapter_id: zod_1.z.string().nullable().optional(),
    section_id: zod_1.z.string().nullable().optional(),
    page_printed: zod_1.z.number().int().positive().nullable().optional(),
    page_pdf: zod_1.z.number().int().positive().nullable().optional(),
    context_type: exports.ContextTypeSchema.default("grammar_explanation"),
    exercise_id: zod_1.z.string().nullable().optional(),
    source_anchor: zod_1.z.string().nullable().optional(),
    notes: zod_1.z.string().nullable().optional(),
});
exports.StudyMetadataSchema = zod_1.z.object({
    learning_priority: exports.LearningPrioritySchema.default(3),
    usefulness: exports.UsefulnessSchema.default(3),
    difficulty: exports.DifficultySchema.default(2),
    cefr: zod_1.z
        .union([
        zod_1.z.string(),
        zod_1.z.object({
            level: zod_1.z.string(),
            source_type: zod_1.z.string().optional(),
        }),
    ])
        .nullable()
        .optional(),
});
exports.UsageMetadataSchema = zod_1.z.object({
    register: exports.RegisterSchema.default("neutral"),
    spoken_written: exports.SpokenWrittenSchema.default("both"),
    contexts: zod_1.z.array(zod_1.z.string()).default([]),
    politeness: zod_1.z.string().nullable().optional(),
});
exports.OriginMetadataSchema = zod_1.z.object({
    source_type: exports.SourceTypeSchema.default("book"),
    created_by: zod_1.z.string().default("extraction"),
    derived_from_ids: zod_1.z.array(zod_1.z.string()).default([]),
});
exports.EditorialMetadataSchema = zod_1.z.object({
    extraction_confidence: exports.ConfidenceSchema.default("high"),
    verification_status: exports.VerificationStatusSchema.default("machine_checked"),
    notes: zod_1.z.string().nullable().optional(),
});
exports.FrequencySchema = zod_1.z.object({
    book_occurrences: zod_1.z.number().int().nonnegative().default(0),
    book_frequency_tier: exports.FrequencyTierSchema.nullable().optional(),
    real_world_frequency: zod_1.z.number().nullable().optional(),
    real_world_frequency_source: zod_1.z.string().nullable().optional(),
});
exports.RelationsSchema = zod_1.z.object({
    chapters: zod_1.z.array(zod_1.z.string()).default([]),
    sections: zod_1.z.array(zod_1.z.string()).default([]),
    concepts: zod_1.z.array(zod_1.z.string()).default([]),
    tenses: zod_1.z.array(zod_1.z.string()).default([]),
    grammar_rules: zod_1.z.array(zod_1.z.string()).default([]),
    verbs: zod_1.z.array(zod_1.z.string()).default([]),
    conjugations: zod_1.z.array(zod_1.z.string()).default([]),
    expressions: zod_1.z.array(zod_1.z.string()).default([]),
    vocabulary: zod_1.z.array(zod_1.z.string()).default([]),
    examples: zod_1.z.array(zod_1.z.string()).default([]),
    exercises: zod_1.z.array(zod_1.z.string()).default([]),
}).partial();
exports.CommonMistakeSchema = zod_1.z.object({
    wrong: zod_1.z.string().nullable().optional(),
    mistake: zod_1.z.string().nullable().optional(),
    correct: zod_1.z.string().nullable().optional(),
    correction: zod_1.z.string().nullable().optional(),
    explanation: zod_1.z.string().nullable().optional(),
});
exports.PatternSlotSchema = zod_1.z.object({
    name: zod_1.z.string(),
    display: zod_1.z.string(),
    type: zod_1.z.string(),
    required: zod_1.z.boolean().default(true),
});
exports.TransformationSchema = zod_1.z.object({
    name: zod_1.z.string(),
    from_pattern: zod_1.z.string(),
    to_pattern: zod_1.z.string(),
    notes: zod_1.z.string().nullable().optional(),
});
exports.SenseSchema = zod_1.z.object({
    sense_id: zod_1.z.string(),
    english: zod_1.z.array(zod_1.z.string()),
    definition_note: zod_1.z.string().nullable().optional(),
    usage_contexts: zod_1.z.array(zod_1.z.string()).default([]),
    example_ids: zod_1.z.array(zod_1.z.string()).default([]),
});
exports.NounMorphologySchema = zod_1.z.object({
    gender: exports.NounGenderSchema.nullable().optional(),
    article: zod_1.z.string().nullable().optional(),
    plural: zod_1.z.string().nullable().optional(),
    countability: zod_1.z.string().nullable().optional(),
});
exports.AdjectiveMorphologySchema = zod_1.z.object({
    masculine_singular: zod_1.z.string().nullable().optional(),
    feminine_singular: zod_1.z.string().nullable().optional(),
    masculine_plural: zod_1.z.string().nullable().optional(),
    feminine_plural: zod_1.z.string().nullable().optional(),
    special_forms: zod_1.z.array(zod_1.z.string()).default([]),
});
exports.PronunciationSchema = zod_1.z.object({
    ipa: zod_1.z.string().nullable().optional(),
    notes: zod_1.z.string().nullable().optional(),
    audio_ref: zod_1.z.string().nullable().optional(),
});
// =======================================================================
// TOP-LEVEL ENTITY SCHEMAS
// =======================================================================
// 1. BOOK
exports.BookSchema = zod_1.z.object({
    id: zod_1.z.string().regex(/^book_/),
    title: zod_1.z.string(),
    author: zod_1.z.string(),
    language: zod_1.z.string().default("French"),
    instruction_language: zod_1.z.string().default("English"),
    edition_year: zod_1.z.number().int().optional(),
    publisher: zod_1.z.string().optional(),
    description: zod_1.z.string().nullable().optional(),
    source_file: zod_1.z.object({
        filename: zod_1.z.string(),
        page_count_pdf: zod_1.z.number().int(),
    }),
    chapter_ids: zod_1.z.array(zod_1.z.string()).default([]),
    notes: zod_1.z.string().nullable().optional(),
});
// 2. CHAPTER
exports.ChapterSchema = zod_1.z.object({
    id: zod_1.z.string().regex(/^chapter_/),
    chapter_number: zod_1.z.number().int().positive(),
    title: zod_1.z.string(),
    section_ids: zod_1.z.array(zod_1.z.string()).default([]),
    concept_ids: zod_1.z.array(zod_1.z.string()).default([]),
    tense_ids: zod_1.z.array(zod_1.z.string()).default([]),
    grammar_rule_ids: zod_1.z.array(zod_1.z.string()).default([]),
    verb_ids: zod_1.z.array(zod_1.z.string()).default([]),
    conjugation_ids: zod_1.z.array(zod_1.z.string()).default([]),
    expression_ids: zod_1.z.array(zod_1.z.string()).default([]),
    vocabulary_ids: zod_1.z.array(zod_1.z.string()).default([]),
    example_ids: zod_1.z.array(zod_1.z.string()).default([]),
    exercise_ids: zod_1.z.array(zod_1.z.string()).default([]),
    source: zod_1.z.object({
        page_start_printed: zod_1.z.number().int().positive().nullable().optional(),
        page_end_printed: zod_1.z.number().int().positive().nullable().optional(),
        page_start_pdf: zod_1.z.number().int().positive().nullable().optional(),
        page_end_pdf: zod_1.z.number().int().positive().nullable().optional(),
    }),
    tags: zod_1.z.array(zod_1.z.string()).default([]),
});
// 3. SECTION
exports.SectionSchema = zod_1.z.object({
    id: zod_1.z.string().regex(/^section_/),
    chapter_id: zod_1.z.string().regex(/^chapter_/),
    order: zod_1.z.number().int().positive(),
    title: zod_1.z.string(),
    concept_ids: zod_1.z.array(zod_1.z.string()).default([]),
    tense_ids: zod_1.z.array(zod_1.z.string()).default([]),
    grammar_rule_ids: zod_1.z.array(zod_1.z.string()).default([]),
    verb_ids: zod_1.z.array(zod_1.z.string()).default([]),
    expression_ids: zod_1.z.array(zod_1.z.string()).default([]),
    vocabulary_ids: zod_1.z.array(zod_1.z.string()).default([]),
    example_ids: zod_1.z.array(zod_1.z.string()).default([]),
    exercise_ids: zod_1.z.array(zod_1.z.string()).default([]),
    source: zod_1.z.object({
        page_start_printed: zod_1.z.number().int().positive().nullable().optional(),
        page_end_printed: zod_1.z.number().int().positive().nullable().optional(),
        page_start_pdf: zod_1.z.number().int().positive().nullable().optional(),
        page_end_pdf: zod_1.z.number().int().positive().nullable().optional(),
    }),
});
// 4. CONCEPT
exports.ConceptSchema = zod_1.z.object({
    id: zod_1.z.string().regex(/^concept_/),
    name: zod_1.z.string(),
    name_french: zod_1.z.string().optional(),
    description: zod_1.z.string().nullable().optional(),
    relations: exports.RelationsSchema.default({}),
    study: exports.StudyMetadataSchema.default({ learning_priority: 3, usefulness: 3, difficulty: 2 }),
    tags: zod_1.z.array(zod_1.z.string()).default([]),
});
// 5. TENSE / MOOD
exports.TenseSchema = zod_1.z.object({
    id: zod_1.z.string().regex(/^tense_/),
    type: zod_1.z.literal("tense").default("tense"),
    name_french: zod_1.z.string(),
    name_english: zod_1.z.string(),
    mood: exports.MoodSchema.default("indicative"),
    time_reference: zod_1.z.array(zod_1.z.string()).default([]),
    aspect_notes: zod_1.z.string().nullable().optional(),
    summary: zod_1.z.string().nullable().optional(),
    formation_rule_ids: zod_1.z.array(zod_1.z.string()).default([]),
    usage_rule_ids: zod_1.z.array(zod_1.z.string()).default([]),
    exception_rule_ids: zod_1.z.array(zod_1.z.string()).default([]),
    common_time_marker_ids: zod_1.z.array(zod_1.z.string()).default([]),
    common_time_markers_text: zod_1.z.array(zod_1.z.string()).default([]),
    related_tense_ids: zod_1.z.array(zod_1.z.string()).default([]),
    contrast_tense_ids: zod_1.z.array(zod_1.z.string()).default([]),
    conjugation_ids: zod_1.z.array(zod_1.z.string()).default([]),
    example_ids: zod_1.z.array(zod_1.z.string()).default([]),
    exercise_ids: zod_1.z.array(zod_1.z.string()).default([]),
    study: exports.StudyMetadataSchema.default({ learning_priority: 3, usefulness: 3, difficulty: 2 }),
    attestations: zod_1.z.array(exports.AttestationSchema).default([]),
    tags: zod_1.z.array(zod_1.z.string()).default([]),
});
// 6. GRAMMAR RULE
exports.GrammarRuleSchema = zod_1.z.object({
    id: zod_1.z.string().regex(/^rule_/),
    type: zod_1.z.literal("grammar_rule").default("grammar_rule"),
    title: zod_1.z.string(),
    short_label: zod_1.z.string().nullable().optional(),
    grammar_category: zod_1.z.string().default("general"),
    concept_ids: zod_1.z.array(zod_1.z.string()).default([]),
    tense_ids: zod_1.z.array(zod_1.z.string()).default([]),
    summary: zod_1.z.string().nullable().optional(),
    explanation: zod_1.z.string().default(""),
    formation: zod_1.z
        .object({
        steps: zod_1.z.array(zod_1.z.string()).default([]),
        patterns: zod_1.z.array(zod_1.z.string()).default([]),
        endings: zod_1.z.record(zod_1.z.string(), zod_1.z.string()).default({}),
        auxiliary: zod_1.z.string().nullable().optional(),
        agreement: zod_1.z.string().nullable().optional(),
    })
        .nullable()
        .optional(),
    mood_governance: zod_1.z
        .object({
        requires: zod_1.z.string().nullable().optional(),
        trigger_expression_ids: zod_1.z.array(zod_1.z.string()).default([]),
    })
        .nullable()
        .optional(),
    usage_conditions: zod_1.z.array(zod_1.z.string()).default([]),
    trigger_words: zod_1.z.array(zod_1.z.string()).default([]),
    signal_words: zod_1.z.array(zod_1.z.string()).default([]),
    exceptions: zod_1.z.array(zod_1.z.string()).default([]),
    restrictions: zod_1.z.array(zod_1.z.string()).default([]),
    notes: zod_1.z.array(zod_1.z.string()).default([]),
    common_mistakes: zod_1.z.array(exports.CommonMistakeSchema).default([]),
    contrast_with_rule_ids: zod_1.z.array(zod_1.z.string()).default([]),
    related_rule_ids: zod_1.z.array(zod_1.z.string()).default([]),
    prerequisite_rule_ids: zod_1.z.array(zod_1.z.string()).default([]),
    example_ids: zod_1.z.array(zod_1.z.string()).default([]),
    exercise_ids: zod_1.z.array(zod_1.z.string()).default([]),
    study: exports.StudyMetadataSchema.default({ learning_priority: 3, usefulness: 3, difficulty: 2 }),
    attestations: zod_1.z.array(exports.AttestationSchema).default([]),
    tags: zod_1.z.array(zod_1.z.string()).default([]),
});
// 7. VERB
exports.VerbSchema = zod_1.z.object({
    id: zod_1.z.string().regex(/^verb_/),
    type: zod_1.z.literal("verb").default("verb"),
    infinitive: zod_1.z.string(),
    display_form: zod_1.z.string().optional(),
    english: zod_1.z.array(zod_1.z.string()),
    senses: zod_1.z.array(exports.SenseSchema).default([]),
    verb_group: exports.VerbGroupSchema.default("1st_group"),
    regularity: exports.RegularitySchema.default("regular"),
    pronominal: zod_1.z.boolean().default(false),
    transitivity: zod_1.z.array(zod_1.z.string()).default([]),
    auxiliary: exports.AuxiliarySchema.default("avoir"),
    past_participle: zod_1.z.string().nullable().optional(),
    present_participle: zod_1.z.string().nullable().optional(),
    conjugation_ids: zod_1.z.array(zod_1.z.string()).default([]),
    expression_ids: zod_1.z.array(zod_1.z.string()).default([]),
    complement_frame_ids: zod_1.z.array(zod_1.z.string()).default([]),
    related_verb_ids: zod_1.z.array(zod_1.z.string()).default([]),
    contrast_verb_ids: zod_1.z.array(zod_1.z.string()).default([]),
    confused_with_ids: zod_1.z.array(zod_1.z.string()).default([]),
    word_family_ids: zod_1.z.array(zod_1.z.string()).default([]),
    study: exports.StudyMetadataSchema.default({ learning_priority: 3, usefulness: 3, difficulty: 2 }),
    usage: exports.UsageMetadataSchema.default({ register: "neutral", spoken_written: "both", contexts: [] }),
    frequency: exports.FrequencySchema.default({ book_occurrences: 0 }),
    origin: exports.OriginMetadataSchema.default({ source_type: "book", created_by: "extraction", derived_from_ids: [] }).optional(),
    attestations: zod_1.z.array(exports.AttestationSchema).default([]),
    tags: zod_1.z.array(zod_1.z.string()).default([]),
});
// 8. CONJUGATION
exports.ConjugationSchema = zod_1.z.object({
    id: zod_1.z.string().regex(/^conj_/),
    type: zod_1.z.literal("conjugation").default("conjugation"),
    verb_id: zod_1.z.string().regex(/^verb_/),
    tense_id: zod_1.z.string().regex(/^tense_/),
    forms: zod_1.z.record(zod_1.z.string(), zod_1.z.string().nullable()).default({}),
    compound: zod_1.z.boolean().default(false),
    components: zod_1.z
        .object({
        auxiliary_verb_id: zod_1.z.string().nullable().optional(),
        auxiliary_tense_id: zod_1.z.string().nullable().optional(),
        past_participle: zod_1.z.string().nullable().optional(),
    })
        .default({}),
    agreement_notes: zod_1.z.array(zod_1.z.string()).default([]),
    spelling_change_notes: zod_1.z.array(zod_1.z.string()).default([]),
    irregularity_notes: zod_1.z.array(zod_1.z.string()).default([]),
    example_ids: zod_1.z.array(zod_1.z.string()).default([]),
    origin: exports.OriginMetadataSchema.default({ source_type: "book", created_by: "extraction", derived_from_ids: [] }).optional(),
    attestations: zod_1.z.array(exports.AttestationSchema).default([]),
    editorial: exports.EditorialMetadataSchema.default({ extraction_confidence: "high", verification_status: "machine_checked" }),
});
// 9. EXPRESSION
exports.ExpressionSchema = zod_1.z.object({
    id: zod_1.z.string().regex(/^expr_/),
    type: zod_1.z.literal("expression").default("expression"),
    expression_type: exports.ExpressionTypeSchema.default("verb_pattern"),
    canonical_form: zod_1.z.string(),
    display_form: zod_1.z.string().optional(),
    english: zod_1.z.array(zod_1.z.string()),
    base_verb_ids: zod_1.z.array(zod_1.z.string()).default([]),
    related_vocabulary_ids: zod_1.z.array(zod_1.z.string()).default([]),
    productive: zod_1.z.boolean().default(false),
    collocation_strength: exports.CollocationStrengthSchema.nullable().optional(),
    pattern: zod_1.z.string().nullable().optional(),
    pattern_slots: zod_1.z.array(exports.PatternSlotSchema).default([]),
    complement_structure: zod_1.z
        .object({
        head: zod_1.z.string().nullable().optional(),
        person_preposition: zod_1.z.string().nullable().optional(),
        noun_preposition: zod_1.z.string().nullable().optional(),
        infinitive_preposition: zod_1.z.string().nullable().optional(),
        clause_marker: zod_1.z.string().nullable().optional(),
    })
        .nullable()
        .optional(),
    mood_governance: zod_1.z
        .object({
        following_clause_mood: zod_1.z.string().nullable().optional(),
        notes: zod_1.z.string().nullable().optional(),
    })
        .nullable()
        .optional(),
    transformations: zod_1.z.array(exports.TransformationSchema).default([]),
    variants: zod_1.z.array(zod_1.z.string()).default([]),
    function_ids: zod_1.z.array(zod_1.z.string()).default([]),
    usage_notes: zod_1.z.array(zod_1.z.string()).default([]),
    restrictions: zod_1.z.array(zod_1.z.string()).default([]),
    common_mistakes: zod_1.z.array(exports.CommonMistakeSchema).default([]),
    example_ids: zod_1.z.array(zod_1.z.string()).default([]),
    study: exports.StudyMetadataSchema.default({ learning_priority: 3, usefulness: 3, difficulty: 2 }),
    usage: exports.UsageMetadataSchema.default({ register: "neutral", spoken_written: "both", contexts: [] }),
    frequency: exports.FrequencySchema.default({ book_occurrences: 0 }),
    origin: exports.OriginMetadataSchema.default({ source_type: "book", created_by: "extraction", derived_from_ids: [] }).optional(),
    attestations: zod_1.z.array(exports.AttestationSchema).default([]),
    relations: exports.RelationsSchema.default({}),
    tags: zod_1.z.array(zod_1.z.string()).default([]),
});
// 10. VOCABULARY
exports.VocabularySchema = zod_1.z.object({
    id: zod_1.z.string().regex(/^vocab_/),
    type: zod_1.z.literal("vocabulary").default("vocabulary"),
    canonical_form: zod_1.z.string(),
    display_form: zod_1.z.string().optional(),
    french: zod_1.z.string(),
    english: zod_1.z.array(zod_1.z.string()),
    part_of_speech: exports.PartOfSpeechSchema.default("noun"),
    noun: exports.NounMorphologySchema.nullable().optional(),
    adjective: exports.AdjectiveMorphologySchema.nullable().optional(),
    adverb: zod_1.z.record(zod_1.z.string(), zod_1.z.any()).nullable().optional(),
    senses: zod_1.z.array(exports.SenseSchema).default([]),
    semantic_domains: zod_1.z.array(zod_1.z.string()).default([]),
    word_family_ids: zod_1.z.array(zod_1.z.string()).default([]),
    collocation_expression_ids: zod_1.z.array(zod_1.z.string()).default([]),
    false_friend: zod_1.z.boolean().default(false),
    cognate: zod_1.z.boolean().default(false),
    pronunciation: exports.PronunciationSchema.nullable().optional(),
    study: exports.StudyMetadataSchema.default({ learning_priority: 3, usefulness: 3, difficulty: 2 }),
    usage: exports.UsageMetadataSchema.default({ register: "neutral", spoken_written: "both", contexts: [] }),
    frequency: exports.FrequencySchema.default({ book_occurrences: 0 }),
    origin: exports.OriginMetadataSchema.default({ source_type: "book", created_by: "extraction", derived_from_ids: [] }).optional(),
    attestations: zod_1.z.array(exports.AttestationSchema).default([]),
    tags: zod_1.z.array(zod_1.z.string()).default([]),
});
// 11. EXAMPLE SENTENCE
exports.ExampleSchema = zod_1.z.object({
    id: zod_1.z.string().regex(/^example_/),
    type: zod_1.z.literal("example").default("example"),
    french: zod_1.z.string(),
    english: zod_1.z.string(),
    literal_english: zod_1.z.string().nullable().optional(),
    source_type: exports.SourceTypeSchema.default("book"),
    annotations: zod_1.z
        .object({
        focus_spans: zod_1.z
            .array(zod_1.z.object({
            text: zod_1.z.string(),
            role: zod_1.z.string().optional(),
        }))
            .default([]),
    })
        .default({ focus_spans: [] }),
    relations: exports.RelationsSchema.default({}),
    cloze_candidates: zod_1.z.array(zod_1.z.string()).default([]),
    study: zod_1.z
        .object({
        difficulty: exports.DifficultySchema.default(2),
    })
        .default({ difficulty: 2 }),
    attestations: zod_1.z.array(exports.AttestationSchema).default([]),
});
// 12. EXERCISE QUESTION & EXERCISE
exports.ExerciseQuestionSchema = zod_1.z.object({
    question_id: zod_1.z.string(),
    prompt: zod_1.z.string(),
    answer: zod_1.z.string().nullable().optional(),
    answer_explanation: zod_1.z.string().nullable().optional(),
    answer_key_source: zod_1.z
        .object({
        page_printed: zod_1.z.number().int().positive().nullable().optional(),
        page_pdf: zod_1.z.number().int().positive().nullable().optional(),
    })
        .optional(),
    open_ended: zod_1.z.boolean().default(false),
    relations: exports.RelationsSchema.default({}),
});
exports.ExerciseSchema = zod_1.z.object({
    id: zod_1.z.string().regex(/^exercise_/),
    type: zod_1.z.literal("exercise").default("exercise"),
    chapter_id: zod_1.z.string().regex(/^chapter_/),
    section_id: zod_1.z.string().nullable().optional(),
    exercise_number: zod_1.z.string(),
    exercise_type: exports.ExerciseTypeSchema.default("fill_in_conjugation"),
    instructions_french: zod_1.z.string().default(""),
    instructions_english: zod_1.z.string().nullable().optional(),
    questions: zod_1.z.array(exports.ExerciseQuestionSchema).default([]),
    answer_key_source: zod_1.z
        .object({
        page_printed: zod_1.z.number().int().positive().nullable().optional(),
        page_pdf: zod_1.z.number().int().positive().nullable().optional(),
    })
        .default({}),
    study: zod_1.z
        .object({
        difficulty: exports.DifficultySchema.default(2),
    })
        .default({ difficulty: 2 }),
    attestations: zod_1.z.array(exports.AttestationSchema).default([]),
    tags: zod_1.z.array(zod_1.z.string()).default([]),
});
// 13. STUDY SET
exports.StudySetFilterSchema = zod_1.z.object({
    field: zod_1.z.string(),
    operator: zod_1.z.enum(["equals", "gte", "lte", "contains", "in", "neq"]),
    value: zod_1.z.any(),
});
exports.StudySetSortSchema = zod_1.z.object({
    field: zod_1.z.string(),
    direction: zod_1.z.enum(["asc", "desc"]),
});
exports.StudySetSchema = zod_1.z.object({
    id: zod_1.z.string().regex(/^studyset_/),
    name: zod_1.z.string(),
    description: zod_1.z.string().nullable().optional(),
    type: zod_1.z.enum(["static", "dynamic"]).default("static"),
    item_ids: zod_1.z.array(zod_1.z.string()).default([]),
    query: zod_1.z
        .object({
        collection: zod_1.z.string(),
        filters: zod_1.z.array(exports.StudySetFilterSchema).default([]),
        sort: zod_1.z.array(exports.StudySetSortSchema).default([]),
    })
        .optional(),
    tags: zod_1.z.array(zod_1.z.string()).default([]),
});
// 14. QUALITY REPORT
exports.QualityReportSchema = zod_1.z.object({
    counts: zod_1.z.record(zod_1.z.string(), zod_1.z.number().int().nonnegative()).default({}),
    unresolved_relations: zod_1.z.array(zod_1.z.any()).default([]),
    duplicate_candidates: zod_1.z.array(zod_1.z.any()).default([]),
    low_confidence_items: zod_1.z.array(zod_1.z.any()).default([]),
    missing_answers: zod_1.z.array(zod_1.z.any()).default([]),
    missing_translations: zod_1.z.array(zod_1.z.any()).default([]),
    missing_gender_for_nouns: zod_1.z.array(zod_1.z.any()).default([]),
    missing_conjugation_forms: zod_1.z.array(zod_1.z.any()).default([]),
});
// 15. TAXONOMY
exports.TaxonomySchema = zod_1.z.object({
    learning_priority: zod_1.z.record(zod_1.z.string(), zod_1.z.string()).optional(),
    difficulty: zod_1.z.record(zod_1.z.string(), zod_1.z.string()).optional(),
    registers: zod_1.z.array(zod_1.z.string()).optional(),
    spoken_written: zod_1.z.array(zod_1.z.string()).optional(),
    expression_types: zod_1.z.array(zod_1.z.string()).optional(),
    collocation_strength: zod_1.z.array(zod_1.z.string()).optional(),
    verification_status: zod_1.z.array(zod_1.z.string()).optional(),
    confidence: zod_1.z.array(zod_1.z.string()).optional(),
}).passthrough();
// =======================================================================
// MASTER ROOT SCHEMA
// =======================================================================
exports.SuperDatasetRootSchema = zod_1.z.object({
    schema_version: zod_1.z.string().default("1.0.0"),
    dataset_id: zod_1.z.string().default("pmp_complete_french_grammar_revision"),
    generated_at: zod_1.z.string().nullable().optional(),
    updated_at: zod_1.z.string().nullable().optional(),
    book: exports.BookSchema,
    taxonomy: exports.TaxonomySchema.default({}),
    chapters: zod_1.z.array(exports.ChapterSchema).default([]),
    sections: zod_1.z.array(exports.SectionSchema).default([]),
    concepts: zod_1.z.array(exports.ConceptSchema).default([]),
    tenses: zod_1.z.array(exports.TenseSchema).default([]),
    grammar_rules: zod_1.z.array(exports.GrammarRuleSchema).default([]),
    verbs: zod_1.z.array(exports.VerbSchema).default([]),
    conjugations: zod_1.z.array(exports.ConjugationSchema).default([]),
    expressions: zod_1.z.array(exports.ExpressionSchema).default([]),
    vocabulary: zod_1.z.array(exports.VocabularySchema).default([]),
    examples: zod_1.z.array(exports.ExampleSchema).default([]),
    exercises: zod_1.z.array(exports.ExerciseSchema).default([]),
    study_sets: zod_1.z.array(exports.StudySetSchema).default([]),
    quality_report: exports.QualityReportSchema.default({
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
