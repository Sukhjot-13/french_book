import { SuperDatasetRootSchema, SuperDatasetRoot } from "../src/lib/dataset/schemas";
import { validateDataset } from "../src/lib/dataset/validators";

const fixture: SuperDatasetRoot = {
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
    edition_year: 2008,
    publisher: "McGraw-Hill",
    source_file: {
      filename: "docs/source_book.pdf",
      page_count_pdf: 286,
    },
    chapter_ids: ["chapter_01"],
  },

  taxonomy: {
    expression_types: ["verb_pattern", "collocation", "fixed_expression", "idiom", "sentence_starter"],
  },

  chapters: [
    {
      id: "chapter_01",
      chapter_number: 1,
      title: "The present tense of regular -er verbs",
      section_ids: ["section_01_01_regular_er_present"],
      concept_ids: [],
      tense_ids: ["tense_present_indicative"],
      grammar_rule_ids: ["rule_regular_er_present"],
      verb_ids: ["verb_parler", "verb_demander"],
      conjugation_ids: ["conj_parler_present_indicative", "conj_demander_present_indicative"],
      expression_ids: ["expr_demander_a_qqn_de_inf"],
      vocabulary_ids: ["vocab_decision"],
      example_ids: ["example_parler_001"],
      exercise_ids: ["exercise_01_01"],
      source: {
        page_start_printed: 1,
        page_end_printed: 12,
        page_start_pdf: 15,
        page_end_pdf: 26,
      },
      tags: ["er_verbs", "present"],
    },
  ],

  sections: [
    {
      id: "section_01_01_regular_er_present",
      chapter_id: "chapter_01",
      order: 1,
      title: "Regular -er verbs in the present",
      concept_ids: [],
      tense_ids: ["tense_present_indicative"],
      grammar_rule_ids: ["rule_regular_er_present"],
      verb_ids: ["verb_parler"],
      expression_ids: [],
      vocabulary_ids: [],
      example_ids: ["example_parler_001"],
      exercise_ids: ["exercise_01_01"],
      source: {
        page_start_printed: 1,
        page_end_printed: 4,
        page_start_pdf: 15,
        page_end_pdf: 18,
      },
    },
  ],

  concepts: [],

  tenses: [
    {
      id: "tense_present_indicative",
      type: "tense",
      name_french: "présent de l'indicatif",
      name_english: "present indicative",
      mood: "indicative",
      time_reference: ["present"],
      summary: "Present indicative",
      formation_rule_ids: ["rule_regular_er_present"],
      usage_rule_ids: [],
      exception_rule_ids: [],
      common_time_marker_ids: [],
      common_time_markers_text: ["maintenant"],
      related_tense_ids: [],
      contrast_tense_ids: [],
      conjugation_ids: ["conj_parler_present_indicative"],
      example_ids: ["example_parler_001"],
      exercise_ids: ["exercise_01_01"],
      study: {
        learning_priority: 5,
        usefulness: 5,
        difficulty: 1,
      },
      attestations: [],
      tags: ["present"],
    },
  ],

  grammar_rules: [
    {
      id: "rule_regular_er_present",
      type: "grammar_rule",
      title: "Regular -er verbs in the present tense",
      short_label: "Regular -er present",
      grammar_category: "verb_formation",
      concept_ids: [],
      tense_ids: ["tense_present_indicative"],
      summary: "Drop -er and add -e, -es, -e, -ons, -ez, -ent.",
      explanation: "To conjugate a regular -er verb in the present tense, drop the -er ending and add endings.",
      formation: {
        steps: ["Drop -er ending from infinitive", "Add appropriate ending for subject pronoun"],
        patterns: ["stem + ending"],
        endings: { je: "e", tu: "es", il_elle_on: "e", nous: "ons", vous: "ez", ils_elles: "ent" },
      },
      usage_conditions: [],
      trigger_words: [],
      signal_words: [],
      exceptions: [],
      restrictions: [],
      notes: [],
      common_mistakes: [],
      contrast_with_rule_ids: [],
      related_rule_ids: [],
      prerequisite_rule_ids: [],
      example_ids: ["example_parler_001"],
      exercise_ids: ["exercise_01_01"],
      study: {
        learning_priority: 5,
        usefulness: 5,
        difficulty: 1,
      },
      attestations: [
        {
          source_type: "book",
          chapter_number: 1,
          page_printed: 1,
          context_type: "grammar_explanation",
        },
      ],
      tags: ["er_verbs"],
    },
  ],

  verbs: [
    {
      id: "verb_parler",
      type: "verb",
      infinitive: "parler",
      display_form: "parler",
      english: ["to speak", "to talk"],
      senses: [
        {
          sense_id: "verb_parler_s1",
          english: ["to speak", "to talk"],
          usage_contexts: [],
          example_ids: ["example_parler_001"],
        },
      ],
      verb_group: "1st_group",
      regularity: "regular",
      pronominal: false,
      transitivity: ["transitive", "intransitive"],
      auxiliary: "avoir",
      past_participle: "parlé",
      present_participle: "parlant",
      conjugation_ids: ["conj_parler_present_indicative"],
      expression_ids: [],
      complement_frame_ids: [],
      related_verb_ids: [],
      contrast_verb_ids: [],
      confused_with_ids: [],
      word_family_ids: [],
      study: {
        learning_priority: 5,
        usefulness: 5,
        difficulty: 1,
      },
      usage: {
        register: "neutral",
        spoken_written: "both",
        contexts: [],
      },
      frequency: {
        book_occurrences: 1,
      },
      attestations: [
        {
          source_type: "book",
          chapter_number: 1,
          page_printed: 1,
          context_type: "grammar_explanation",
        },
      ],
      tags: ["essential"],
    },
    {
      id: "verb_demander",
      type: "verb",
      infinitive: "demander",
      display_form: "demander",
      english: ["to ask", "to request"],
      senses: [],
      verb_group: "1st_group",
      regularity: "regular",
      pronominal: false,
      transitivity: ["transitive"],
      auxiliary: "avoir",
      past_participle: "demandé",
      present_participle: null,
      conjugation_ids: ["conj_demander_present_indicative"],
      expression_ids: ["expr_demander_a_qqn_de_inf"],
      complement_frame_ids: [],
      related_verb_ids: [],
      contrast_verb_ids: [],
      confused_with_ids: [],
      word_family_ids: [],
      study: {
        learning_priority: 5,
        usefulness: 5,
        difficulty: 2,
      },
      usage: {
        register: "neutral",
        spoken_written: "both",
        contexts: [],
      },
      frequency: {
        book_occurrences: 1,
      },
      attestations: [],
      tags: ["essential"],
    },
  ],

  conjugations: [
    {
      id: "conj_parler_present_indicative",
      type: "conjugation",
      verb_id: "verb_parler",
      tense_id: "tense_present_indicative",
      forms: {
        je: "je parle",
        tu: "tu parles",
        il_elle_on: "il/elle/on parle",
        nous: "nous parlons",
        vous: "vous parlez",
        ils_elles: "ils/elles parlent",
      },
      compound: false,
      components: {},
      agreement_notes: [],
      spelling_change_notes: [],
      irregularity_notes: [],
      example_ids: ["example_parler_001"],
      attestations: [],
      editorial: {
        extraction_confidence: "high",
        verification_status: "machine_checked",
      },
    },
    {
      id: "conj_demander_present_indicative",
      type: "conjugation",
      verb_id: "verb_demander",
      tense_id: "tense_present_indicative",
      forms: {
        je: "je demande",
        tu: "tu demandes",
        il_elle_on: "il/elle/on demande",
        nous: "nous demandons",
        vous: "vous demandez",
        ils_elles: "ils/elles demandent",
      },
      compound: false,
      components: {},
      agreement_notes: [],
      spelling_change_notes: [],
      irregularity_notes: [],
      example_ids: [],
      attestations: [],
      editorial: {
        extraction_confidence: "high",
        verification_status: "machine_checked",
      },
    },
  ],

  expressions: [
    {
      id: "expr_demander_a_qqn_de_inf",
      type: "expression",
      expression_type: "verb_pattern",
      canonical_form: "demander à quelqu'un de + infinitif",
      display_form: "demander à quelqu'un de + infinitif",
      english: ["to ask someone to do something"],
      base_verb_ids: ["verb_demander"],
      related_vocabulary_ids: [],
      productive: true,
      collocation_strength: "strong",
      pattern: "demander à [PERSON] de [INFINITIVE]",
      pattern_slots: [
        { name: "person", display: "quelqu'un", type: "person", required: true },
        { name: "action", display: "infinitif", type: "verb_infinitive", required: true },
      ],
      transformations: [],
      variants: [],
      function_ids: [],
      usage_notes: [],
      restrictions: [],
      common_mistakes: [],
      example_ids: [],
      study: {
        learning_priority: 5,
        usefulness: 5,
        difficulty: 2,
      },
      usage: {
        register: "neutral",
        spoken_written: "both",
        contexts: [],
      },
      frequency: {
        book_occurrences: 1,
      },
      origin: {
        source_type: "book",
        created_by: "extraction",
        derived_from_ids: [],
      },
      attestations: [],
      relations: {
        verbs: ["verb_demander"],
      },
      tags: ["verb_pattern"],
    },
  ],

  vocabulary: [
    {
      id: "vocab_decision",
      type: "vocabulary",
      canonical_form: "décision",
      display_form: "la décision",
      french: "décision",
      english: ["decision"],
      part_of_speech: "noun",
      noun: {
        gender: "feminine",
        article: "la",
        plural: "décisions",
      },
      senses: [],
      semantic_domains: ["cognition"],
      word_family_ids: [],
      collocation_expression_ids: [],
      false_friend: false,
      cognate: true,
      study: {
        learning_priority: 4,
        usefulness: 5,
        difficulty: 1,
      },
      usage: {
        register: "neutral",
        spoken_written: "both",
        contexts: [],
      },
      frequency: {
        book_occurrences: 1,
      },
      attestations: [],
      tags: ["noun"],
    },
  ],

  examples: [
    {
      id: "example_parler_001",
      type: "example",
      french: "Je parle français.",
      english: "I speak French.",
      source_type: "book",
      annotations: { focus_spans: [{ text: "parle", role: "verb" }] },
      relations: {
        verbs: ["verb_parler"],
        tenses: ["tense_present_indicative"],
        grammar_rules: ["rule_regular_er_present"],
      },
      cloze_candidates: ["parle"],
      study: { difficulty: 1 },
      attestations: [],
    },
  ],

  exercises: [
    {
      id: "exercise_01_01",
      type: "exercise",
      chapter_id: "chapter_01",
      section_id: "section_01_01_regular_er_present",
      exercise_number: "1.1",
      exercise_type: "fill_in_conjugation",
      instructions_french: "Mettre les verbes entre parenthèses au présent.",
      questions: [
        {
          question_id: "exercise_01_01_q01",
          prompt: "Je (parler) avec mon ami.",
          answer: "parle",
          open_ended: false,
          relations: {
            verbs: ["verb_parler"],
            tenses: ["tense_present_indicative"],
            grammar_rules: ["rule_regular_er_present"],
          },
        },
      ],
      study: { difficulty: 1 },
      answer_key_source: { page_printed: 1, page_pdf: 15 },
      attestations: [],
      tags: ["conjugation"],
    },
  ],

  study_sets: [
    {
      id: "studyset_essential_verbs",
      name: "Essential Verbs",
      type: "static",
      item_ids: ["verb_parler", "verb_demander"],
      tags: ["essential"],
    },
  ],

  quality_report: {
    counts: { verbs: 2, conjugations: 2, expressions: 1, vocabulary: 1 },
    unresolved_relations: [],
    duplicate_candidates: [],
    low_confidence_items: [],
    missing_answers: [],
    missing_translations: [],
    missing_gender_for_nouns: [],
    missing_conjugation_forms: [],
  },
};

const result = SuperDatasetRootSchema.safeParse(fixture);
if (!result.success) {
  console.error("Fixture Zod validation failed:", result.error);
  process.exit(1);
} else {
  console.log("Fixture Zod validation PASSED!");
}

const valReport = validateDataset(fixture);
if (!valReport.passed) {
  console.error("Fixture Validator check failed:", valReport);
  process.exit(1);
} else {
  console.log("Fixture Validator check PASSED with 0 errors!");
}
