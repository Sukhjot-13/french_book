import { ChapterExtractionBundle } from "./chapter-types";
import { RawPage } from "./extract-pages";
import { extractChapterExercises } from "./extract-chapter";
import {
  GrammarRule,
  Verb,
  Conjugation,
  Expression,
  Vocabulary,
  Example,
  Chapter,
  Section,
} from "../src/lib/dataset/schemas";
import {
  makeChapterId,
  makeSectionId,
  makeRuleId,
  makeVerbId,
  makeConjugationId,
  makeVocabId,
  makeExpressionId,
  makeExampleId,
} from "../src/lib/dataset/ids";

// =======================================================================
// CHAPTER 11: The present conditional and the past conditional
// =======================================================================
export function buildChapter11(pages: RawPage[]): ChapterExtractionBundle {
  const chNum = 11;
  const chId = makeChapterId(chNum);
  const chPages = pages.filter((p) => (p.printed_page || 0) >= 87 && (p.printed_page || 0) <= 96);
  const exercises = extractChapterExercises(chNum, chPages);

  const sec1 = {
    id: makeSectionId(chNum, 1, "The present conditional"),
    chapter_id: chId,
    order: 1,
    title: "The present conditional",
    concept_ids: [],
    tense_ids: ["tense_conditionnel_present"],
    grammar_rule_ids: [makeRuleId("conditionnel_present_formation_and_politeness"), makeRuleId("si_clause_pattern_imparfait_conditionnel")],
    verb_ids: [makeVerbId("aimer"), makeVerbId("vouloir"), makeVerbId("pouvoir")],
    expression_ids: [makeExpressionId("j'aimerais bien"), makeExpressionId("je voudrais")],
    vocabulary_ids: [],
    example_ids: [makeExampleId("conditionnel_pres", 1)],
    exercise_ids: [exercises[0]?.id, exercises[1]?.id, exercises[2]?.id, exercises[3]?.id, exercises[4]?.id].filter(Boolean) as string[],
    source: { page_start_printed: 87, page_end_printed: 92, page_start_pdf: 101, page_end_pdf: 106 },
  };

  const sec2 = {
    id: makeSectionId(chNum, 2, "The past conditional"),
    chapter_id: chId,
    order: 2,
    title: "The past conditional",
    concept_ids: [],
    tense_ids: ["tense_conditionnel_passe"],
    grammar_rule_ids: [makeRuleId("conditionnel_passe_formation_and_regrets"), makeRuleId("si_clause_pattern_pqp_conditionnel_passe")],
    verb_ids: [],
    expression_ids: [makeExpressionId("j'aurais aime"), makeExpressionId("j'aurais du")],
    vocabulary_ids: [],
    example_ids: [makeExampleId("conditionnel_passe", 1)],
    exercise_ids: [exercises[5]?.id, exercises[6]?.id, exercises[7]?.id, exercises[8]?.id].filter(Boolean) as string[],
    source: { page_start_printed: 92, page_end_printed: 96, page_start_pdf: 106, page_end_pdf: 110 },
  };

  const sections = [sec1, sec2];

  const grammar_rules: GrammarRule[] = [
    {
      id: makeRuleId("conditionnel_present_formation_and_politeness"),
      type: "grammar_rule",
      title: "Formation and uses of the present conditional",
      short_label: "conditionnel présent",
      grammar_category: "tense_formation",
      concept_ids: [],
      tense_ids: ["tense_conditionnel_present"],
      summary: "Future stem + imparfait endings (-ais, -ais, -ait, -ions, -iez, -aient). Used for politeness, wishes, and hypothetical actions.",
      explanation: "Take the future stem (parler-, finir-, vendr-, aur-, ser-, fer-, etc.) and add the imparfait endings: 'Je parlerais', 'Nous aimerions', 'Vous voudriez'. Expresses polite requests, advice, and potential outcomes.",
      formation: {
        steps: ["Take future stem", "Add imparfait endings: -ais, -ais, -ait, -ions, -iez, -aient"],
        patterns: ["future_stem + -ais/-ais/-ait/-ions/-iez/-aient"],
        endings: { je: "ais", tu: "ais", il_elle_on: "ait", nous: "ions", vous: "iez", ils_elles: "aient" },
      },
      usage_conditions: ["Polite requests (Je voudrais, Pourriez-vous)", "Wishes and desires", "Hypothetical condition"],
      trigger_words: ["si", "au cas où", "s'il vous plaît"],
      signal_words: [],
      exceptions: [],
      restrictions: [],
      notes: [],
      common_mistakes: [{ wrong: "Si j'aurais (never use conditional right after si)", correct: "Si j'avais", explanation: "Never use the conditional directly after 'si'." }],
      contrast_with_rule_ids: [],
      related_rule_ids: [],
      prerequisite_rule_ids: [],
      example_ids: [makeExampleId("conditionnel_pres", 1)],
      exercise_ids: [],
      study: { learning_priority: 5, usefulness: 5, difficulty: 2 },
      attestations: [{ source_type: "book", chapter_number: 11, page_printed: 87, context_type: "grammar_explanation" }],
      tags: ["essential", "conditional", "politeness"],
    },
    {
      id: makeRuleId("si_clause_pattern_imparfait_conditionnel"),
      type: "grammar_rule",
      title: "Hypothetical sentences with Si + imparfait -> conditionnel présent",
      short_label: "Si + imparfait -> conditionnel",
      grammar_category: "syntax",
      concept_ids: [],
      tense_ids: ["tense_conditionnel_present", "tense_imparfait"],
      summary: "Si + imparfait expresses the condition; the result clause uses the present conditional.",
      explanation: "'Si j'avais le temps, je voyagerais dans le monde entier' (If I had time, I would travel around the whole world).",
      formation: null,
      usage_conditions: ["Hypothetical contrary-to-fact present situations"],
      trigger_words: ["si"],
      signal_words: [],
      exceptions: [],
      restrictions: ["Never use the conditional in the si-clause itself."],
      notes: [],
      common_mistakes: [{ wrong: "Si je serais riche...", correct: "Si j'étais riche, j'achèterais...", explanation: "Si takes imparfait, not conditional." }],
      contrast_with_rule_ids: [],
      related_rule_ids: [],
      prerequisite_rule_ids: [],
      example_ids: [],
      exercise_ids: [],
      study: { learning_priority: 5, usefulness: 5, difficulty: 3 },
      attestations: [{ source_type: "book", chapter_number: 11, page_printed: 89, context_type: "grammar_explanation" }],
      tags: ["essential", "syntax", "si_clauses"],
    },
    {
      id: makeRuleId("conditionnel_passe_formation_and_regrets"),
      type: "grammar_rule",
      title: "Formation of the past conditional and expressing regrets",
      short_label: "conditionnel passé",
      grammar_category: "tense_formation",
      concept_ids: [],
      tense_ids: ["tense_conditionnel_passe"],
      summary: "Conditional of auxiliary (aurais/serais) + past participle. Expresses unfulfilled actions and past regrets.",
      explanation: "Formed with the present conditional of avoir or être followed by the past participle: 'J'aurais aimé vous voir' (I would have liked to see you); 'Elle serait venue' (She would have come).",
      formation: {
        steps: ["Conjugate avoir/être in conditionnel présent", "Add past participle"],
        patterns: ["[SUBJECT] + aurais/serais + [PARTICIPE PASSÉ]"],
        endings: {},
      },
      usage_conditions: ["Unfulfilled past possibilities", "Reproaches and regrets"],
      trigger_words: ["si", "j'aurais dû", "j'aurais pu"],
      signal_words: [],
      exceptions: [],
      restrictions: [],
      notes: [],
      common_mistakes: [],
      contrast_with_rule_ids: [],
      related_rule_ids: [],
      prerequisite_rule_ids: [],
      example_ids: [makeExampleId("conditionnel_passe", 1)],
      exercise_ids: [],
      study: { learning_priority: 4, usefulness: 4, difficulty: 3 },
      attestations: [{ source_type: "book", chapter_number: 11, page_printed: 92, context_type: "grammar_explanation" }],
      tags: ["conditional", "past", "compound"],
    },
  ];

  const verbs: Verb[] = [];
  const conjugations: Conjugation[] = [];
  const expressions: Expression[] = [
    {
      id: makeExpressionId("j'aimerais bien"),
      type: "expression",
      expression_type: "sentence_starter",
      canonical_form: "j'aimerais bien",
      display_form: "J'aimerais bien + infinitif",
      english: ["I would really like to...", "I'd love to..."],
      base_verb_ids: [makeVerbId("aimer")],
      related_vocabulary_ids: [],
      productive: true,
      collocation_strength: "strong",
      pattern: "J'aimerais bien [INFINITIVE]",
      pattern_slots: [{ name: "action", display: "infinitif", type: "verb_infinitive", required: true }],
      transformations: [],
      variants: [],
      function_ids: [],
      usage_notes: ["Polite expression of desire"],
      restrictions: [],
      common_mistakes: [],
      example_ids: [makeExampleId("conditionnel_pres", 1)],
      study: { learning_priority: 5, usefulness: 5, difficulty: 1 },
      usage: { register: "neutral", spoken_written: "both", contexts: ["conversation", "politeness"] },
      frequency: { book_occurrences: 4 },
      origin: { source_type: "book", created_by: "extraction", derived_from_ids: [] },
      attestations: [{ source_type: "book", chapter_number: 11, page_printed: 87, context_type: "grammar_explanation" }],
      relations: { grammar_rules: [makeRuleId("conditionnel_present_formation_and_politeness")] },
      tags: ["essential", "politeness"],
    },
  ];
  const vocabulary: Vocabulary[] = [];

  const examples: Example[] = [
    {
      id: makeExampleId("conditionnel_pres", 1),
      type: "example",
      french: "J'aimerais bien vous inviter à dîner.",
      english: "I would really like to invite you to dinner.",
      source_type: "book",
      annotations: { focus_spans: [{ text: "J'aimerais bien", role: "conditional_politeness" }] },
      relations: { verbs: [makeVerbId("aimer")], tenses: ["tense_conditionnel_present"] },
      cloze_candidates: ["aimerais"],
      study: { difficulty: 1 },
      attestations: [{ source_type: "book", chapter_number: 11, page_printed: 87, context_type: "example_sentence" }],
    },
    {
      id: makeExampleId("conditionnel_passe", 1),
      type: "example",
      french: "Si j'avais su, je serais venu plus tôt.",
      english: "If I had known, I would have come earlier.",
      source_type: "book",
      annotations: { focus_spans: [{ text: "serais venu", role: "past_conditional" }] },
      relations: { verbs: [makeVerbId("venir")], tenses: ["tense_conditionnel_passe", "tense_plus_que_parfait"] },
      cloze_candidates: ["serais venu"],
      study: { difficulty: 3 },
      attestations: [{ source_type: "book", chapter_number: 11, page_printed: 92, context_type: "example_sentence" }],
    },
  ];

  const chapter: Chapter = {
    id: chId,
    chapter_number: chNum,
    title: "The present conditional and the past conditional",
    section_ids: sections.map((s) => s.id),
    concept_ids: [],
    tense_ids: ["tense_conditionnel_present", "tense_conditionnel_passe"],
    grammar_rule_ids: grammar_rules.map((r) => r.id),
    verb_ids: verbs.map((v) => v.id),
    conjugation_ids: conjugations.map((c) => c.id),
    expression_ids: expressions.map((e) => e.id),
    vocabulary_ids: vocabulary.map((v) => v.id),
    example_ids: examples.map((e) => e.id),
    exercise_ids: exercises.map((e) => e.id),
    source: { page_start_printed: 87, page_end_printed: 96, page_start_pdf: 101, page_end_pdf: 110 },
    tags: ["conditional", "present_conditional", "past_conditional", "politeness"],
  };

  return { chapter, sections, grammar_rules, verbs, conjugations, vocabulary, expressions, examples, exercises };
}

// =======================================================================
// CHAPTER 12: Could, should, would?
// =======================================================================
export function buildChapter12(pages: RawPage[]): ChapterExtractionBundle {
  const chNum = 12;
  const chId = makeChapterId(chNum);
  const chPages = pages.filter((p) => (p.printed_page || 0) >= 97 && (p.printed_page || 0) <= 103);
  const exercises = extractChapterExercises(chNum, chPages);

  const sec1 = {
    id: makeSectionId(chNum, 1, "Could"),
    chapter_id: chId,
    order: 1,
    title: "Could",
    concept_ids: [],
    tense_ids: ["tense_conditionnel_present", "tense_imparfait", "tense_passe_compose"],
    grammar_rule_ids: [makeRuleId("translating_could_into_french")],
    verb_ids: [makeVerbId("pouvoir")],
    expression_ids: [makeExpressionId("pourriez-vous + infinitif"), makeExpressionId("j'ai pu")],
    vocabulary_ids: [],
    example_ids: [makeExampleId("could", 1)],
    exercise_ids: [exercises[0]?.id, exercises[1]?.id].filter(Boolean) as string[],
    source: { page_start_printed: 97, page_end_printed: 99, page_start_pdf: 111, page_end_pdf: 113 },
  };

  const sec2 = {
    id: makeSectionId(chNum, 2, "Should"),
    chapter_id: chId,
    order: 2,
    title: "Should",
    concept_ids: [],
    tense_ids: ["tense_conditionnel_present", "tense_conditionnel_passe"],
    grammar_rule_ids: [makeRuleId("translating_should_into_french")],
    verb_ids: [makeVerbId("devoir")],
    expression_ids: [makeExpressionId("vous devriez"), makeExpressionId("vous auriez du")],
    vocabulary_ids: [],
    example_ids: [makeExampleId("should", 1)],
    exercise_ids: [exercises[2]?.id, exercises[3]?.id].filter(Boolean) as string[],
    source: { page_start_printed: 99, page_end_printed: 100, page_start_pdf: 113, page_end_pdf: 114 },
  };

  const sec3 = {
    id: makeSectionId(chNum, 3, "Would"),
    chapter_id: chId,
    order: 3,
    title: "Would",
    concept_ids: [],
    tense_ids: ["tense_conditionnel_present", "tense_imparfait"],
    grammar_rule_ids: [makeRuleId("translating_would_into_french")],
    verb_ids: [makeVerbId("vouloir")],
    expression_ids: [],
    vocabulary_ids: [],
    example_ids: [makeExampleId("would", 1)],
    exercise_ids: [exercises[4]?.id, exercises[5]?.id].filter(Boolean) as string[],
    source: { page_start_printed: 100, page_end_printed: 103, page_start_pdf: 114, page_end_pdf: 117 },
  };

  const sections = [sec1, sec2, sec3];

  const grammar_rules: GrammarRule[] = [
    {
      id: makeRuleId("translating_could_into_french"),
      type: "grammar_rule",
      title: "Translating 'could' into French",
      short_label: "Could in French",
      grammar_category: "modal_translation",
      concept_ids: [],
      tense_ids: ["tense_conditionnel_present", "tense_imparfait", "tense_passe_compose"],
      summary: "Could = 1. Pourriez-vous (polite request); 2. Pouvais (past general ability); 3. Ai pu (managed to do on a specific occasion); 4. Pourrais (hypothetical).",
      explanation: "- Polite request: 'Pourriez-vous m'aider?' (Could you help me?)\n- Past general ability: 'Je pouvais courir vite' (I could / was able to run fast)\n- Specific past success: 'J'ai pu ouvrir la porte' (I could / managed to open the door)\n- Hypothetical: 'Tu pourrais essayer' (You could try).",
      formation: null,
      usage_conditions: [],
      trigger_words: ["pourriez-vous", "pouvais", "ai pu", "pourrais"],
      signal_words: [],
      exceptions: [],
      restrictions: [],
      notes: [],
      common_mistakes: [],
      contrast_with_rule_ids: [],
      related_rule_ids: [],
      prerequisite_rule_ids: [],
      example_ids: [makeExampleId("could", 1)],
      exercise_ids: [],
      study: { learning_priority: 5, usefulness: 5, difficulty: 3 },
      attestations: [{ source_type: "book", chapter_number: 12, page_printed: 97, context_type: "grammar_explanation" }],
      tags: ["essential", "modals", "translation"],
    },
    {
      id: makeRuleId("translating_should_into_french"),
      type: "grammar_rule",
      title: "Translating 'should' into French",
      short_label: "Should in French",
      grammar_category: "modal_translation",
      concept_ids: [],
      tense_ids: ["tense_conditionnel_present", "tense_conditionnel_passe"],
      summary: "Should (present) = devoir in conditionnel présent (devrais/devrait); Should have (past) = devoir in conditionnel passé (aurais dû).",
      explanation: "- Present advice / should: 'Tu devrais te reposer' (You should rest).\n- Past regret / should have: 'Tu aurais dû m'appeler' (You should have called me).",
      formation: null,
      usage_conditions: ["Giving advice", "Expressing obligation", "Past reproach / regret"],
      trigger_words: ["devrais", "devrait", "devrions", "devriez", "devraient", "aurais dû"],
      signal_words: [],
      exceptions: [],
      restrictions: [],
      notes: [],
      common_mistakes: [],
      contrast_with_rule_ids: [],
      related_rule_ids: [],
      prerequisite_rule_ids: [],
      example_ids: [makeExampleId("should", 1)],
      exercise_ids: [],
      study: { learning_priority: 5, usefulness: 5, difficulty: 2 },
      attestations: [{ source_type: "book", chapter_number: 12, page_printed: 99, context_type: "grammar_explanation" }],
      tags: ["essential", "modals", "advice"],
    },
    {
      id: makeRuleId("translating_would_into_french"),
      type: "grammar_rule",
      title: "Translating 'would' into French",
      short_label: "Would in French",
      grammar_category: "modal_translation",
      concept_ids: [],
      tense_ids: ["tense_conditionnel_present", "tense_imparfait"],
      summary: "1. Hypothetical = Conditionnel (I would go -> J'irais); 2. Habitual past = Imparfait (We would swim every day -> Nous nagions tous les jours); 3. Willingness = Vouloir (Would you please -> Voudriez-vous).",
      explanation: "Distinguish between:\n- Conditional action: 'Je voyagerais si j'avais l'argent'\n- Habit in the past: 'En été, nous allions à la plage' (In summer, we would go to the beach)\n- Polite willingness: 'Voudriez-vous fermer la fenêtre?' (Would you close the window?).",
      formation: null,
      usage_conditions: [],
      trigger_words: ["voudriez-vous"],
      signal_words: [],
      exceptions: [],
      restrictions: [],
      notes: [],
      common_mistakes: [{ wrong: "Chaque jour nous voudrions aller... (for habit)", correct: "Chaque jour nous allions...", explanation: "Use imparfait for past habitual 'would'." }],
      contrast_with_rule_ids: [],
      related_rule_ids: [],
      prerequisite_rule_ids: [],
      example_ids: [makeExampleId("would", 1)],
      exercise_ids: [],
      study: { learning_priority: 5, usefulness: 5, difficulty: 3 },
      attestations: [{ source_type: "book", chapter_number: 12, page_printed: 100, context_type: "grammar_explanation" }],
      tags: ["essential", "modals", "translation"],
    },
  ];

  const verbs: Verb[] = [];
  const conjugations: Conjugation[] = [];
  const expressions: Expression[] = [];
  const vocabulary: Vocabulary[] = [];

  const examples: Example[] = [
    {
      id: makeExampleId("could", 1),
      type: "example",
      french: "Pourriez-vous répéter la question, s'il vous plaît?",
      english: "Could you repeat the question, please?",
      source_type: "book",
      annotations: { focus_spans: [{ text: "Pourriez-vous", role: "polite_request" }] },
      relations: { verbs: [makeVerbId("pouvoir")], tenses: ["tense_conditionnel_present"] },
      cloze_candidates: ["Pourriez-vous"],
      study: { difficulty: 1 },
      attestations: [{ source_type: "book", chapter_number: 12, page_printed: 97, context_type: "example_sentence" }],
    },
    {
      id: makeExampleId("should", 1),
      type: "example",
      french: "Vous devriez voir ce médecin au plus vite.",
      english: "You should see this doctor as soon as possible.",
      source_type: "book",
      annotations: { focus_spans: [{ text: "devriez", role: "advice" }] },
      relations: { verbs: [makeVerbId("devoir")], tenses: ["tense_conditionnel_present"] },
      cloze_candidates: ["devriez"],
      study: { difficulty: 1 },
      attestations: [{ source_type: "book", chapter_number: 12, page_printed: 99, context_type: "example_sentence" }],
    },
    {
      id: makeExampleId("would", 1),
      type: "example",
      french: "Voudriez-vous m'accompagner à la gare?",
      english: "Would you come with me to the station?",
      source_type: "book",
      annotations: { focus_spans: [{ text: "Voudriez-vous", role: "polite_invitation" }] },
      relations: { verbs: [makeVerbId("vouloir")], tenses: ["tense_conditionnel_present"] },
      cloze_candidates: ["Voudriez-vous"],
      study: { difficulty: 1 },
      attestations: [{ source_type: "book", chapter_number: 12, page_printed: 100, context_type: "example_sentence" }],
    },
  ];

  const chapter: Chapter = {
    id: chId,
    chapter_number: chNum,
    title: "Could, should, would?",
    section_ids: sections.map((s) => s.id),
    concept_ids: [],
    tense_ids: ["tense_conditionnel_present", "tense_conditionnel_passe", "tense_imparfait"],
    grammar_rule_ids: grammar_rules.map((r) => r.id),
    verb_ids: verbs.map((v) => v.id),
    conjugation_ids: conjugations.map((c) => c.id),
    expression_ids: expressions.map((e) => e.id),
    vocabulary_ids: vocabulary.map((v) => v.id),
    example_ids: examples.map((e) => e.id),
    exercise_ids: exercises.map((e) => e.id),
    source: { page_start_printed: 97, page_end_printed: 103, page_start_pdf: 111, page_end_pdf: 117 },
    tags: ["could", "should", "would", "modals", "translation_nuances"],
  };

  return { chapter, sections, grammar_rules, verbs, conjugations, vocabulary, expressions, examples, exercises };
}

// =======================================================================
// CHAPTER 13: The present subjunctive and the past subjunctive
// =======================================================================
export function buildChapter13(pages: RawPage[]): ChapterExtractionBundle {
  const chNum = 13;
  const chId = makeChapterId(chNum);
  const chPages = pages.filter((p) => (p.printed_page || 0) >= 104 && (p.printed_page || 0) <= 114);
  const exercises = extractChapterExercises(chNum, chPages);

  const sec1 = {
    id: makeSectionId(chNum, 1, "The present subjunctive"),
    chapter_id: chId,
    order: 1,
    title: "The present subjunctive",
    concept_ids: [],
    tense_ids: ["tense_subjonctif_present"],
    grammar_rule_ids: [makeRuleId("subjonctif_present_formation_and_irregular_stems")],
    verb_ids: [makeVerbId("faire"), makeVerbId("savoir"), makeVerbId("aller"), makeVerbId("pouvoir"), makeVerbId("vouloir"), makeVerbId("avoir"), makeVerbId("être")],
    expression_ids: [],
    vocabulary_ids: [],
    example_ids: [makeExampleId("subj_form", 1)],
    exercise_ids: [exercises[0]?.id, exercises[1]?.id].filter(Boolean) as string[],
    source: { page_start_printed: 104, page_end_printed: 106, page_start_pdf: 118, page_end_pdf: 120 },
  };

  const sec2 = {
    id: makeSectionId(chNum, 2, "Uses of the subjunctive"),
    chapter_id: chId,
    order: 2,
    title: "Uses of the subjunctive",
    concept_ids: [],
    tense_ids: ["tense_subjonctif_present"],
    grammar_rule_ids: [
      makeRuleId("subjunctive_triggers_necessity_will"),
      makeRuleId("subjunctive_triggers_emotion_feeling"),
      makeRuleId("subjunctive_triggers_doubt_denial"),
      makeRuleId("subjunctive_governing_conjunctions"),
    ],
    verb_ids: [],
    expression_ids: [
      makeExpressionId("il faut que + subjonctif"),
      makeExpressionId("bien que + subjonctif"),
      makeExpressionId("pour que + subjonctif"),
      makeExpressionId("avant que + subjonctif"),
      makeExpressionId("a condition que + subjonctif"),
    ],
    vocabulary_ids: [],
    example_ids: [makeExampleId("il_faut_que", 1), makeExampleId("bien_que", 1)],
    exercise_ids: [exercises[2]?.id, exercises[3]?.id, exercises[4]?.id, exercises[5]?.id, exercises[6]?.id, exercises[7]?.id].filter(Boolean) as string[],
    source: { page_start_printed: 106, page_end_printed: 112, page_start_pdf: 120, page_end_pdf: 126 },
  };

  const sec3 = {
    id: makeSectionId(chNum, 3, "The past subjunctive"),
    chapter_id: chId,
    order: 3,
    title: "The past subjunctive",
    concept_ids: [],
    tense_ids: ["tense_subjonctif_passe"],
    grammar_rule_ids: [makeRuleId("subjonctif_passe_formation_and_usage")],
    verb_ids: [],
    expression_ids: [],
    vocabulary_ids: [],
    example_ids: [makeExampleId("subj_passe", 1)],
    exercise_ids: [exercises[8]?.id, exercises[9]?.id].filter(Boolean) as string[],
    source: { page_start_printed: 112, page_end_printed: 114, page_start_pdf: 126, page_end_pdf: 128 },
  };

  const sections = [sec1, sec2, sec3];

  const grammar_rules: GrammarRule[] = [
    {
      id: makeRuleId("subjonctif_present_formation_and_irregular_stems"),
      type: "grammar_rule",
      title: "Formation of the present subjunctive and irregular stems",
      short_label: "subjonctif présent formation",
      grammar_category: "tense_formation",
      concept_ids: [],
      tense_ids: ["tense_subjonctif_present"],
      summary: "Stem of 3rd person plural present (ils) + -e, -es, -e, -ions, -iez, -ent.",
      explanation: "Find the stem from ils/elles present (ils parl-ent, ils finiss-ent, ils vend-ent). Add endings: que je -e, que tu -es, qu'il -e, que nous -ions, que vous -iez, qu'ils -ent.\nIrregular stems:\n- être: sois, sois, soit, soyons, soyez, soient\n- avoir: aie, aies, ait, ayons, ayez, aient\n- faire: fass-\n- aller: aill- / all-\n- pouvoir: puiss-\n- savoir: sach-\n- vouloir: veuill- / voul-",
      formation: {
        steps: ["Take 'ils' present stem", "Add endings: -e, -es, -e, -ions, -iez, -ent", "Nous and vous use 'nous' present stem for stem-changing verbs"],
        patterns: ["que + subject + stem + -e/-es/-e/-ions/-iez/-ent"],
        endings: { je: "e", tu: "es", il_elle_on: "e", nous: "ions", vous: "iez", ils_elles: "ent" },
      },
      usage_conditions: [],
      trigger_words: ["que", "il faut que", "bien que"],
      signal_words: [],
      exceptions: ["être, avoir, faire, aller, pouvoir, savoir, vouloir are irregular"],
      restrictions: [],
      notes: [],
      common_mistakes: [{ wrong: "que je fais (indicative)", correct: "que je fasse (subjunctive)", explanation: "Faire uses stem fass- in subjunctive." }],
      contrast_with_rule_ids: [],
      related_rule_ids: [],
      prerequisite_rule_ids: [],
      example_ids: [makeExampleId("subj_form", 1)],
      exercise_ids: [],
      study: { learning_priority: 5, usefulness: 5, difficulty: 3 },
      attestations: [{ source_type: "book", chapter_number: 13, page_printed: 104, context_type: "grammar_explanation" }],
      tags: ["essential", "subjunctive", "formation"],
    },
    {
      id: makeRuleId("subjunctive_triggers_necessity_will"),
      type: "grammar_rule",
      title: "Subjunctive after verbs of necessity, will, and desire",
      short_label: "Subjunctive necessity & will",
      grammar_category: "mood_governance",
      concept_ids: [],
      tense_ids: ["tense_subjonctif_present"],
      summary: "Use subjunctive after il faut que, vouloir que, désirer que, exiger que, demander que.",
      explanation: "When two different subjects are involved and the main clause expresses a command, wish, or necessity: 'Il faut que tu viennes' (You must come); 'Je veux qu'elle parte' (I want her to leave).",
      formation: null,
      mood_governance: { requires: "subjunctive", trigger_expression_ids: [makeExpressionId("il faut que + subjonctif")] },
      usage_conditions: ["Two different subjects with expressing will/necessity"],
      trigger_words: ["il faut que", "vouloir que", "préférer que", "souhaiter que", "exiger que"],
      signal_words: [],
      exceptions: ["Espérer que takes indicative (J'espère qu'il viendra), not subjunctive."],
      restrictions: [],
      notes: [],
      common_mistakes: [{ wrong: "J'espère que tu viennes", correct: "J'espère que tu viendras", explanation: "Espérer takes the indicative mood." }],
      contrast_with_rule_ids: [],
      related_rule_ids: [],
      prerequisite_rule_ids: [],
      example_ids: [makeExampleId("il_faut_que", 1)],
      exercise_ids: [],
      study: { learning_priority: 5, usefulness: 5, difficulty: 3 },
      attestations: [{ source_type: "book", chapter_number: 13, page_printed: 106, context_type: "grammar_explanation" }],
      tags: ["essential", "subjunctive", "mood_governance"],
    },
    {
      id: makeRuleId("subjunctive_governing_conjunctions"),
      type: "grammar_rule",
      title: "Conjunctions that always require the subjunctive",
      short_label: "Subjunctive conjunctions",
      grammar_category: "mood_governance",
      concept_ids: [],
      tense_ids: ["tense_subjonctif_present"],
      summary: "bien que, quoique (although), pour que, afin que (so that), avant que (before), sans que (without), à condition que (on condition that), pourvu que (provided that), jusqu'à ce que (until).",
      explanation: "These conjunctions introduce clauses expressing concession, purpose, condition, or anticipation and always trigger the subjunctive:\n- 'Bien qu'il pleuve, nous sortirons' (Although it's raining, we will go out).\n- 'Je t'explique pour que tu comprennes' (I'm explaining so that you understand).",
      formation: null,
      mood_governance: { requires: "subjunctive", trigger_expression_ids: [makeExpressionId("bien que + subjonctif"), makeExpressionId("pour que + subjonctif")] },
      usage_conditions: ["Subordinate clauses with special adverbial conjunctions"],
      trigger_words: ["bien que", "quoique", "pour que", "afin que", "avant que", "sans que", "à condition que", "jusqu'à ce que"],
      signal_words: [],
      exceptions: ["après que takes indicative, though spoken French often confuses it."],
      restrictions: [],
      notes: [],
      common_mistakes: [{ wrong: "Bien qu'il pleut", correct: "Bien qu'il pleuve", explanation: "Bien que always requires the subjunctive." }],
      contrast_with_rule_ids: [],
      related_rule_ids: [],
      prerequisite_rule_ids: [],
      example_ids: [makeExampleId("bien_que", 1)],
      exercise_ids: [],
      study: { learning_priority: 5, usefulness: 5, difficulty: 3 },
      attestations: [{ source_type: "book", chapter_number: 13, page_printed: 110, context_type: "grammar_explanation" }],
      tags: ["essential", "conjunctions", "subjunctive"],
    },
  ];

  const verbs: Verb[] = [];
  const conjugations: Conjugation[] = [];
  const expressions: Expression[] = [
    {
      id: makeExpressionId("il faut que + subjonctif"),
      type: "expression",
      expression_type: "sentence_starter",
      canonical_form: "il faut que + subjonctif",
      display_form: "il faut que + subjonctif",
      english: ["it is necessary that", "one must / you have to"],
      base_verb_ids: [makeVerbId("falloir")],
      related_vocabulary_ids: [],
      productive: true,
      collocation_strength: "strong",
      pattern: "Il faut que [SUBJECT] [SUBJUNCTIVE]",
      pattern_slots: [{ name: "clause", display: "proposition au subjonctif", type: "clause", required: true }],
      transformations: [],
      variants: ["il ne faut pas que"],
      function_ids: [],
      usage_notes: ["Most common trigger of the subjunctive in French"],
      restrictions: [],
      common_mistakes: [],
      example_ids: [makeExampleId("il_faut_que", 1)],
      study: { learning_priority: 5, usefulness: 5, difficulty: 2 },
      usage: { register: "neutral", spoken_written: "both", contexts: ["communication", "necessity"] },
      frequency: { book_occurrences: 6 },
      origin: { source_type: "book", created_by: "extraction", derived_from_ids: [] },
      attestations: [{ source_type: "book", chapter_number: 13, page_printed: 106, context_type: "grammar_explanation" }],
      relations: { grammar_rules: [makeRuleId("subjunctive_triggers_necessity_will")] },
      tags: ["essential", "subjunctive_trigger"],
    },
    {
      id: makeExpressionId("bien que + subjonctif"),
      type: "expression",
      expression_type: "connector",
      canonical_form: "bien que + subjonctif",
      display_form: "bien que + subjonctif",
      english: ["although", "even though"],
      base_verb_ids: [],
      related_vocabulary_ids: [],
      productive: true,
      collocation_strength: "strong",
      pattern: "bien que [SUBJECT] [SUBJUNCTIVE]",
      pattern_slots: [{ name: "clause", display: "proposition au subjonctif", type: "clause", required: true }],
      transformations: [],
      variants: ["quoique + subjonctif"],
      function_ids: [],
      usage_notes: ["Expresses concession; always takes subjunctive"],
      restrictions: [],
      common_mistakes: [],
      example_ids: [makeExampleId("bien_que", 1)],
      study: { learning_priority: 5, usefulness: 5, difficulty: 2 },
      usage: { register: "neutral", spoken_written: "both", contexts: [] },
      frequency: { book_occurrences: 4 },
      origin: { source_type: "book", created_by: "extraction", derived_from_ids: [] },
      attestations: [{ source_type: "book", chapter_number: 13, page_printed: 110, context_type: "grammar_explanation" }],
      relations: { grammar_rules: [makeRuleId("subjunctive_governing_conjunctions")] },
      tags: ["essential", "conjunction", "subjunctive"],
    },
  ];
  const vocabulary: Vocabulary[] = [];

  const examples: Example[] = [
    {
      id: makeExampleId("subj_form", 1),
      type: "example",
      french: "Il faut que nous fassions attention.",
      english: "We must be careful / It is necessary that we be careful.",
      source_type: "book",
      annotations: { focus_spans: [{ text: "fassions", role: "subjunctive_verb" }] },
      relations: { verbs: [makeVerbId("faire")], tenses: ["tense_subjonctif_present"] },
      cloze_candidates: ["fassions"],
      study: { difficulty: 2 },
      attestations: [{ source_type: "book", chapter_number: 13, page_printed: 104, context_type: "example_sentence" }],
    },
    {
      id: makeExampleId("il_faut_que", 1),
      type: "example",
      french: "Il faut que tu viennes avec nous.",
      english: "You must come with us.",
      source_type: "book",
      annotations: { focus_spans: [{ text: "viennes", role: "subjunctive_verb" }] },
      relations: { verbs: [makeVerbId("venir")], expressions: [makeExpressionId("il faut que + subjonctif")], tenses: ["tense_subjonctif_present"] },
      cloze_candidates: ["viennes"],
      study: { difficulty: 2 },
      attestations: [{ source_type: "book", chapter_number: 13, page_printed: 106, context_type: "example_sentence" }],
    },
    {
      id: makeExampleId("bien_que", 1),
      type: "example",
      french: "Bien qu'il soit malade, il continue à travailler.",
      english: "Although he is sick, he continues to work.",
      source_type: "book",
      annotations: { focus_spans: [{ text: "soit", role: "subjunctive_verb" }] },
      relations: { verbs: [makeVerbId("être")], expressions: [makeExpressionId("bien que + subjonctif")], tenses: ["tense_subjonctif_present"] },
      cloze_candidates: ["soit"],
      study: { difficulty: 2 },
      attestations: [{ source_type: "book", chapter_number: 13, page_printed: 110, context_type: "example_sentence" }],
    },
  ];

  const chapter: Chapter = {
    id: chId,
    chapter_number: chNum,
    title: "The present subjunctive and the past subjunctive",
    section_ids: sections.map((s) => s.id),
    concept_ids: [],
    tense_ids: ["tense_subjonctif_present", "tense_subjonctif_passe"],
    grammar_rule_ids: grammar_rules.map((r) => r.id),
    verb_ids: verbs.map((v) => v.id),
    conjugation_ids: conjugations.map((c) => c.id),
    expression_ids: expressions.map((e) => e.id),
    vocabulary_ids: vocabulary.map((v) => v.id),
    example_ids: examples.map((e) => e.id),
    exercise_ids: exercises.map((e) => e.id),
    source: { page_start_printed: 104, page_end_printed: 114, page_start_pdf: 118, page_end_pdf: 128 },
    tags: ["subjunctive", "present_subjunctive", "past_subjunctive", "mood"],
  };

  return { chapter, sections, grammar_rules, verbs, conjugations, vocabulary, expressions, examples, exercises };
}

// =======================================================================
// CHAPTER 14: The infinitive mood
// =======================================================================
export function buildChapter14(pages: RawPage[]): ChapterExtractionBundle {
  const chNum = 14;
  const chId = makeChapterId(chNum);
  const chPages = pages.filter((p) => (p.printed_page || 0) >= 115 && (p.printed_page || 0) <= 125);
  const exercises = extractChapterExercises(chNum, chPages);

  const sec1 = {
    id: makeSectionId(chNum, 1, "The infinitif present"),
    chapter_id: chId,
    order: 1,
    title: "The infinitif présent",
    concept_ids: ["concept_verb_preposition_patterns"],
    tense_ids: ["tense_infinitif_present"],
    grammar_rule_ids: [makeRuleId("infinitive_after_prepositions_and_as_subject")],
    verb_ids: [],
    expression_ids: [makeExpressionId("avant de + infinitif"), makeExpressionId("sans + infinitif"), makeExpressionId("pour + infinitif")],
    vocabulary_ids: [],
    example_ids: [makeExampleId("inf_pres", 1)],
    exercise_ids: [exercises[0]?.id, exercises[1]?.id].filter(Boolean) as string[],
    source: { page_start_printed: 115, page_end_printed: 118, page_start_pdf: 129, page_end_pdf: 132 },
  };

  const sec2 = {
    id: makeSectionId(chNum, 2, "The infinitif passe"),
    chapter_id: chId,
    order: 2,
    title: "The infinitif passé",
    concept_ids: [],
    tense_ids: ["tense_infinitif_passe"],
    grammar_rule_ids: [makeRuleId("infinitif_passe_with_apres")],
    verb_ids: [],
    expression_ids: [makeExpressionId("apres avoir + participe passe"), makeExpressionId("apres etre + participe passe")],
    vocabulary_ids: [],
    example_ids: [makeExampleId("inf_passe", 1)],
    exercise_ids: [exercises[2]?.id, exercises[3]?.id].filter(Boolean) as string[],
    source: { page_start_printed: 118, page_end_printed: 120, page_start_pdf: 132, page_end_pdf: 134 },
  };

  const sec3 = {
    id: makeSectionId(chNum, 3, "Verbs with their prepositions"),
    chapter_id: chId,
    order: 3,
    title: "Verbs with their prepositions",
    concept_ids: ["concept_verb_preposition_patterns"],
    tense_ids: ["tense_infinitif_present"],
    grammar_rule_ids: [makeRuleId("verbs_requiring_preposition_a"), makeRuleId("verbs_requiring_preposition_de"), makeRuleId("verbs_taking_direct_infinitive")],
    verb_ids: [
      makeVerbId("commencer"),
      makeVerbId("apprendre"),
      makeVerbId("inviter"),
      makeVerbId("réussir"),
      makeVerbId("décider"),
      makeVerbId("demander"),
      makeVerbId("essayer"),
      makeVerbId("oublier"),
      makeVerbId("promettre"),
      makeVerbId("refuser"),
    ],
    expression_ids: [
      makeExpressionId("commencer a + infinitif"),
      makeExpressionId("apprendre a + infinitif"),
      makeExpressionId("decider de + infinitif"),
      makeExpressionId("essayer de + infinitif"),
      makeExpressionId("demander de + infinitif"),
      makeExpressionId("oublier de + infinitif"),
    ],
    vocabulary_ids: [],
    example_ids: [makeExampleId("verb_prep_a", 1), makeExampleId("verb_prep_de", 1)],
    exercise_ids: [exercises[4]?.id, exercises[5]?.id, exercises[6]?.id, exercises[7]?.id, exercises[8]?.id].filter(Boolean) as string[],
    source: { page_start_printed: 120, page_end_printed: 125, page_start_pdf: 134, page_end_pdf: 139 },
  };

  const sections = [sec1, sec2, sec3];

  const grammar_rules: GrammarRule[] = [
    {
      id: makeRuleId("infinitive_after_prepositions_and_as_subject"),
      type: "grammar_rule",
      title: "Uses of the present infinitive: after prepositions and as subject",
      short_label: "Present infinitive uses",
      grammar_category: "infinitive_usage",
      concept_ids: ["concept_verb_preposition_patterns"],
      tense_ids: ["tense_infinitif_present"],
      summary: "In French, all prepositions (pour, sans, avant de, afin de, à, de) take the infinitive (never the -ing form as in English).",
      explanation: "Unlike English which uses the gerund (-ing) after prepositions ('without knowing', 'before leaving'), French requires the infinitive: 'sans savoir', 'avant de partir', 'pour réussir'.",
      formation: null,
      usage_conditions: ["After prepositions (except 'en' which takes the gerund)"],
      trigger_words: ["pour", "sans", "avant de", "afin de"],
      signal_words: [],
      exceptions: ["'en' takes the present participle / gerund (en mangeant)."],
      restrictions: [],
      notes: [],
      common_mistakes: [{ wrong: "avant partant", correct: "avant de partir", explanation: "Use avant de + infinitive." }],
      contrast_with_rule_ids: [],
      related_rule_ids: [],
      prerequisite_rule_ids: [],
      example_ids: [makeExampleId("inf_pres", 1)],
      exercise_ids: [],
      study: { learning_priority: 5, usefulness: 5, difficulty: 1 },
      attestations: [{ source_type: "book", chapter_number: 14, page_printed: 115, context_type: "grammar_explanation" }],
      tags: ["essential", "infinitive", "prepositions"],
    },
    {
      id: makeRuleId("infinitif_passe_with_apres"),
      type: "grammar_rule",
      title: "The past infinitive with après (après avoir / après être)",
      short_label: "après + infinitif passé",
      grammar_category: "infinitive_usage",
      concept_ids: [],
      tense_ids: ["tense_infinitif_passe"],
      summary: "'Après' is ALWAYS followed by the past infinitive (après avoir fait, après être parti).",
      explanation: "To express 'after doing something', French uses après + past infinitive: 'Après avoir dîné, nous sommes allés au cinéma' (After having dinner / After dining, we went to the movies).",
      formation: {
        steps: ["après + avoir / être (infinitive) + past participle"],
        patterns: ["après avoir/être + [PARTICIPE PASSÉ]"],
        endings: {},
      },
      usage_conditions: ["Actions completed prior to the main clause action"],
      trigger_words: ["après", "après avoir", "après être"],
      signal_words: [],
      exceptions: [],
      restrictions: [],
      notes: [],
      common_mistakes: [{ wrong: "après manger (present)", correct: "après avoir mangé (past)", explanation: "Après requires the past infinitive." }],
      contrast_with_rule_ids: [],
      related_rule_ids: [],
      prerequisite_rule_ids: [],
      example_ids: [makeExampleId("inf_passe", 1)],
      exercise_ids: [],
      study: { learning_priority: 5, usefulness: 5, difficulty: 2 },
      attestations: [{ source_type: "book", chapter_number: 14, page_printed: 118, context_type: "grammar_explanation" }],
      tags: ["essential", "infinitive_passe", "time"],
    },
    {
      id: makeRuleId("verbs_requiring_preposition_a"),
      type: "grammar_rule",
      title: "Verbs followed by à + infinitive",
      short_label: "Verbs with à + inf",
      grammar_category: "verb_government",
      concept_ids: ["concept_verb_preposition_patterns"],
      tense_ids: ["tense_infinitif_present"],
      summary: "Key verbs taking à before an infinitive: commencer à, apprendre à, inviter à, réussir à, hésiter à, continuer à, aider à.",
      explanation: "- commencer à parler\n- apprendre à conduire\n- réussir à finir\n- hésiter à répondre\n- aider quelqu'un à faire quelque chose",
      formation: null,
      usage_conditions: [],
      trigger_words: ["à"],
      signal_words: [],
      exceptions: [],
      restrictions: [],
      notes: [],
      common_mistakes: [],
      contrast_with_rule_ids: [makeRuleId("verbs_requiring_preposition_de")],
      related_rule_ids: [],
      prerequisite_rule_ids: [],
      example_ids: [makeExampleId("verb_prep_a", 1)],
      exercise_ids: [],
      study: { learning_priority: 5, usefulness: 5, difficulty: 2 },
      attestations: [{ source_type: "book", chapter_number: 14, page_printed: 120, context_type: "grammar_explanation" }],
      tags: ["essential", "verb_pattern", "a_infinitive"],
    },
    {
      id: makeRuleId("verbs_requiring_preposition_de"),
      type: "grammar_rule",
      title: "Verbs followed by de + infinitive",
      short_label: "Verbs with de + inf",
      grammar_category: "verb_government",
      concept_ids: ["concept_verb_preposition_patterns"],
      tense_ids: ["tense_infinitif_present"],
      summary: "Key verbs taking de before an infinitive: accepter de, refuser de, décider de, demander de, essayer de, oublier de, promettre de, regretter de, risquer de.",
      explanation: "- décider de partir\n- demander de venir\n- essayer de comprendre\n- oublier de téléphoner\n- refuser de parler",
      formation: null,
      usage_conditions: [],
      trigger_words: ["de", "d'"],
      signal_words: [],
      exceptions: [],
      restrictions: [],
      notes: [],
      common_mistakes: [],
      contrast_with_rule_ids: [makeRuleId("verbs_requiring_preposition_a")],
      related_rule_ids: [],
      prerequisite_rule_ids: [],
      example_ids: [makeExampleId("verb_prep_de", 1)],
      exercise_ids: [],
      study: { learning_priority: 5, usefulness: 5, difficulty: 2 },
      attestations: [{ source_type: "book", chapter_number: 14, page_printed: 122, context_type: "grammar_explanation" }],
      tags: ["essential", "verb_pattern", "de_infinitive"],
    },
    {
      id: makeRuleId("verbs_taking_direct_infinitive"),
      type: "grammar_rule",
      title: "Verbs followed directly by an infinitive without preposition",
      short_label: "Direct infinitive verbs",
      grammar_category: "verb_government",
      concept_ids: ["concept_verb_preposition_patterns"],
      tense_ids: ["tense_infinitif_present"],
      summary: "Semi-auxiliary and modal verbs followed directly by an infinitive (no preposition): aimer, aller, devoir, pouvoir, savoir, vouloir, préférer, espérer, laisser, faire.",
      explanation: "- Je veux partir (not je veux de partir)\n- Il doit travailler\n- Nous aimons voyager\n- Elle préfère rester",
      formation: null,
      usage_conditions: [],
      trigger_words: [],
      signal_words: [],
      exceptions: [],
      restrictions: [],
      notes: [],
      common_mistakes: [{ wrong: "Je veux de partir", correct: "Je veux partir", explanation: "Vouloir takes direct infinitive without preposition." }],
      contrast_with_rule_ids: [makeRuleId("verbs_requiring_preposition_a"), makeRuleId("verbs_requiring_preposition_de")],
      related_rule_ids: [],
      prerequisite_rule_ids: [],
      example_ids: [],
      exercise_ids: [],
      study: { learning_priority: 5, usefulness: 5, difficulty: 1 },
      attestations: [{ source_type: "book", chapter_number: 14, page_printed: 124, context_type: "grammar_explanation" }],
      tags: ["essential", "direct_infinitive"],
    },
  ];

  const verbs: Verb[] = [];
  const conjugations: Conjugation[] = [];
  const expressions: Expression[] = [
    {
      id: makeExpressionId("apres avoir + participe passe"),
      type: "expression",
      expression_type: "verb_pattern",
      canonical_form: "après avoir + participe passé",
      display_form: "après avoir + participe passé",
      english: ["after having done something", "after doing something"],
      base_verb_ids: [makeVerbId("avoir")],
      related_vocabulary_ids: [],
      productive: true,
      collocation_strength: "strong",
      pattern: "après avoir [PAST_PARTICIPLE]",
      pattern_slots: [{ name: "action", display: "participe passé", type: "past_participle", required: true }],
      transformations: [],
      variants: ["après être + participe passé"],
      function_ids: [],
      usage_notes: ["Past infinitive with après"],
      restrictions: [],
      common_mistakes: [],
      example_ids: [makeExampleId("inf_passe", 1)],
      study: { learning_priority: 5, usefulness: 5, difficulty: 2 },
      usage: { register: "neutral", spoken_written: "both", contexts: [] },
      frequency: { book_occurrences: 4 },
      origin: { source_type: "book", created_by: "extraction", derived_from_ids: [] },
      attestations: [{ source_type: "book", chapter_number: 14, page_printed: 118, context_type: "grammar_explanation" }],
      relations: { grammar_rules: [makeRuleId("infinitif_passe_with_apres")] },
      tags: ["essential", "infinitive_passe"],
    },
    {
      id: makeExpressionId("avant de + infinitif"),
      type: "expression",
      expression_type: "verb_pattern",
      canonical_form: "avant de + infinitif",
      display_form: "avant de + infinitif",
      english: ["before doing something"],
      base_verb_ids: [],
      related_vocabulary_ids: [],
      productive: true,
      collocation_strength: "strong",
      pattern: "avant de [INFINITIVE]",
      pattern_slots: [{ name: "action", display: "infinitif", type: "verb_infinitive", required: true }],
      transformations: [],
      variants: ["avant d'"],
      function_ids: [],
      usage_notes: ["Used when the subject of both actions is the same"],
      restrictions: [],
      common_mistakes: [],
      example_ids: [],
      study: { learning_priority: 5, usefulness: 5, difficulty: 1 },
      usage: { register: "neutral", spoken_written: "both", contexts: [] },
      frequency: { book_occurrences: 4 },
      origin: { source_type: "book", created_by: "extraction", derived_from_ids: [] },
      attestations: [{ source_type: "book", chapter_number: 14, page_printed: 115, context_type: "grammar_explanation" }],
      relations: { grammar_rules: [makeRuleId("infinitive_after_prepositions_and_as_subject")] },
      tags: ["essential", "preposition_pattern"],
    },
  ];
  const vocabulary: Vocabulary[] = [];

  const examples: Example[] = [
    {
      id: makeExampleId("inf_pres", 1),
      type: "example",
      french: "Il est parti sans dire au revoir.",
      english: "He left without saying goodbye.",
      source_type: "book",
      annotations: { focus_spans: [{ text: "sans dire", role: "preposition_infinitive" }] },
      relations: { verbs: [makeVerbId("dire")], tenses: ["tense_infinitif_present"] },
      cloze_candidates: ["sans dire"],
      study: { difficulty: 1 },
      attestations: [{ source_type: "book", chapter_number: 14, page_printed: 115, context_type: "example_sentence" }],
    },
    {
      id: makeExampleId("inf_passe", 1),
      type: "example",
      french: "Après avoir fini ses études, elle a voyagé en Italie.",
      english: "After finishing her studies, she traveled in Italy.",
      source_type: "book",
      annotations: { focus_spans: [{ text: "Après avoir fini", role: "past_infinitive" }] },
      relations: { verbs: [makeVerbId("finir")], expressions: [makeExpressionId("apres avoir + participe passe")], tenses: ["tense_infinitif_passe"] },
      cloze_candidates: ["Après avoir fini"],
      study: { difficulty: 2 },
      attestations: [{ source_type: "book", chapter_number: 14, page_printed: 118, context_type: "example_sentence" }],
    },
    {
      id: makeExampleId("verb_prep_a", 1),
      type: "example",
      french: "Elle a commencé à apprendre le français il y a un an.",
      english: "She started learning French a year ago.",
      source_type: "book",
      annotations: { focus_spans: [{ text: "commencé à apprendre", role: "a_preposition" }] },
      relations: { verbs: [makeVerbId("commencer"), makeVerbId("apprendre")], grammar_rules: [makeRuleId("verbs_requiring_preposition_a")] },
      cloze_candidates: ["commencé à"],
      study: { difficulty: 2 },
      attestations: [{ source_type: "book", chapter_number: 14, page_printed: 120, context_type: "example_sentence" }],
    },
    {
      id: makeExampleId("verb_prep_de", 1),
      type: "example",
      french: "Nous avons décidé de partir tôt demain matin.",
      english: "We decided to leave early tomorrow morning.",
      source_type: "book",
      annotations: { focus_spans: [{ text: "décidé de partir", role: "de_preposition" }] },
      relations: { verbs: [makeVerbId("décider"), makeVerbId("partir")], grammar_rules: [makeRuleId("verbs_requiring_preposition_de")] },
      cloze_candidates: ["décidé de"],
      study: { difficulty: 2 },
      attestations: [{ source_type: "book", chapter_number: 14, page_printed: 122, context_type: "example_sentence" }],
    },
  ];

  const chapter: Chapter = {
    id: chId,
    chapter_number: chNum,
    title: "The infinitive mood",
    section_ids: sections.map((s) => s.id),
    concept_ids: ["concept_verb_preposition_patterns"],
    tense_ids: ["tense_infinitif_present", "tense_infinitif_passe"],
    grammar_rule_ids: grammar_rules.map((r) => r.id),
    verb_ids: verbs.map((v) => v.id),
    conjugation_ids: conjugations.map((c) => c.id),
    expression_ids: expressions.map((e) => e.id),
    vocabulary_ids: vocabulary.map((v) => v.id),
    example_ids: examples.map((e) => e.id),
    exercise_ids: exercises.map((e) => e.id),
    source: { page_start_printed: 115, page_end_printed: 125, page_start_pdf: 129, page_end_pdf: 139 },
    tags: ["infinitive", "infinitif_present", "infinitif_passe", "prepositions", "verb_patterns"],
  };

  return { chapter, sections, grammar_rules, verbs, conjugations, vocabulary, expressions, examples, exercises };
}

// =======================================================================
// CHAPTER 15: The present participle and the gerund
// =======================================================================
export function buildChapter15(pages: RawPage[]): ChapterExtractionBundle {
  const chNum = 15;
  const chId = makeChapterId(chNum);
  const chPages = pages.filter((p) => (p.printed_page || 0) >= 126 && (p.printed_page || 0) <= 130);
  const exercises = extractChapterExercises(chNum, chPages);

  const sec1 = {
    id: makeSectionId(chNum, 1, "The present participle"),
    chapter_id: chId,
    order: 1,
    title: "The present participle",
    concept_ids: [],
    tense_ids: ["tense_participe_present"],
    grammar_rule_ids: [makeRuleId("present_participle_formation_and_adjectival_use")],
    verb_ids: [makeVerbId("avoir"), makeVerbId("être"), makeVerbId("savoir")],
    expression_ids: [],
    vocabulary_ids: [],
    example_ids: [makeExampleId("part_pres", 1)],
    exercise_ids: [exercises[0]?.id, exercises[1]?.id].filter(Boolean) as string[],
    source: { page_start_printed: 126, page_end_printed: 129, page_start_pdf: 140, page_end_pdf: 143 },
  };

  const sec2 = {
    id: makeSectionId(chNum, 2, "The gerund"),
    chapter_id: chId,
    order: 2,
    title: "The gerund",
    concept_ids: [],
    tense_ids: ["tense_gerondif"],
    grammar_rule_ids: [makeRuleId("gerund_en_participle_formation_and_functions")],
    verb_ids: [],
    expression_ids: [makeExpressionId("en + participe present"), makeExpressionId("tout en + participe present")],
    vocabulary_ids: [],
    example_ids: [makeExampleId("gerund", 1)],
    exercise_ids: [exercises[2]?.id, exercises[3]?.id].filter(Boolean) as string[],
    source: { page_start_printed: 129, page_end_printed: 130, page_start_pdf: 143, page_end_pdf: 144 },
  };

  const sections = [sec1, sec2];

  const grammar_rules: GrammarRule[] = [
    {
      id: makeRuleId("present_participle_formation_and_adjectival_use"),
      type: "grammar_rule",
      title: "Formation of the present participle and verbal adjectives",
      short_label: "Present participle",
      grammar_category: "participle_formation",
      concept_ids: [],
      tense_ids: ["tense_participe_present"],
      summary: "Drop -ons from the present 'nous' form and add -ant. Irregulars: ayant (avoir), étant (être), sachant (savoir).",
      explanation: "Verbal adjectives agree in gender and number with the noun they modify (des histoires amusantes), whereas present participles acting as verbs do not agree (une femme parlant français).",
      formation: {
        steps: ["Take 'nous' present stem", "Add -ant ending"],
        patterns: ["nous_stem + -ant"],
        endings: {},
      },
      usage_conditions: ["Clause modifiers", "Verbal adjectives agreeing with nouns"],
      trigger_words: [],
      signal_words: [],
      exceptions: ["ayant (avoir), étant (être), sachant (savoir)"],
      restrictions: [],
      notes: [],
      common_mistakes: [],
      contrast_with_rule_ids: [],
      related_rule_ids: [makeRuleId("gerund_en_participle_formation_and_functions")],
      prerequisite_rule_ids: [],
      example_ids: [makeExampleId("part_pres", 1)],
      exercise_ids: [],
      study: { learning_priority: 4, usefulness: 4, difficulty: 2 },
      attestations: [{ source_type: "book", chapter_number: 15, page_printed: 126, context_type: "grammar_explanation" }],
      tags: ["participle", "formation"],
    },
    {
      id: makeRuleId("gerund_en_participle_formation_and_functions"),
      type: "grammar_rule",
      title: "The gerund (en + present participle): simultaneity, means, and condition",
      short_label: "Gerund (gérondif)",
      grammar_category: "tense_usage",
      concept_ids: [],
      tense_ids: ["tense_gerondif"],
      summary: "Formed with 'en' + present participle. Expresses while doing (simultaneity), by doing (means), or if doing (condition).",
      explanation: "1. Simultaneity: 'Il écoute de la musique en travaillant' (He listens to music while working).\n2. Means / Manner: 'C'est en forgeant qu'on devient forgeron' (Practice makes perfect / By forging one becomes a blacksmith).\n3. 'Tout en' emphasizes simultaneous contrast: 'Tout en souriant, elle refusait' (While still smiling, she refused).",
      formation: {
        steps: ["en + present participle"],
        patterns: ["en + [PARTICIPE PRÉSENT]"],
        endings: {},
      },
      usage_conditions: ["Both actions must share the same subject"],
      trigger_words: ["en", "tout en"],
      signal_words: [],
      exceptions: [],
      restrictions: ["Subject of gerund must be identical to subject of main clause."],
      notes: [],
      common_mistakes: [],
      contrast_with_rule_ids: [],
      related_rule_ids: [],
      prerequisite_rule_ids: [],
      example_ids: [makeExampleId("gerund", 1)],
      exercise_ids: [],
      study: { learning_priority: 5, usefulness: 5, difficulty: 2 },
      attestations: [{ source_type: "book", chapter_number: 15, page_printed: 129, context_type: "grammar_explanation" }],
      tags: ["essential", "gerund", "gérondif"],
    },
  ];

  const verbs: Verb[] = [];
  const conjugations: Conjugation[] = [];
  const expressions: Expression[] = [
    {
      id: makeExpressionId("en + participe present"),
      type: "expression",
      expression_type: "verb_pattern",
      canonical_form: "en + participe présent",
      display_form: "en + participe présent (gérondif)",
      english: ["while doing...", "by doing..."],
      base_verb_ids: [],
      related_vocabulary_ids: [],
      productive: true,
      collocation_strength: "strong",
      pattern: "en [PRESENT_PARTICIPLE]",
      pattern_slots: [{ name: "action", display: "participe présent", type: "verb", required: true }],
      transformations: [],
      variants: ["tout en + participe présent"],
      function_ids: [],
      usage_notes: ["Expresses simultaneous action or means"],
      restrictions: [],
      common_mistakes: [],
      example_ids: [makeExampleId("gerund", 1)],
      study: { learning_priority: 5, usefulness: 5, difficulty: 2 },
      usage: { register: "neutral", spoken_written: "both", contexts: [] },
      frequency: { book_occurrences: 4 },
      origin: { source_type: "book", created_by: "extraction", derived_from_ids: [] },
      attestations: [{ source_type: "book", chapter_number: 15, page_printed: 129, context_type: "grammar_explanation" }],
      relations: { grammar_rules: [makeRuleId("gerund_en_participle_formation_and_functions")] },
      tags: ["essential", "gerund"],
    },
  ];
  const vocabulary: Vocabulary[] = [];

  const examples: Example[] = [
    {
      id: makeExampleId("part_pres", 1),
      type: "example",
      french: "Ce sont des personnes parlant plusieurs langues.",
      english: "These are people speaking several languages.",
      source_type: "book",
      annotations: { focus_spans: [{ text: "parlant", role: "present_participle" }] },
      relations: { verbs: [makeVerbId("parler")], tenses: ["tense_participe_present"] },
      cloze_candidates: ["parlant"],
      study: { difficulty: 2 },
      attestations: [{ source_type: "book", chapter_number: 15, page_printed: 126, context_type: "example_sentence" }],
    },
    {
      id: makeExampleId("gerund", 1),
      type: "example",
      french: "Elle chante en préparant le dîner.",
      english: "She sings while making dinner.",
      source_type: "book",
      annotations: { focus_spans: [{ text: "en préparant", role: "gerund" }] },
      relations: { verbs: [makeVerbId("chanter"), makeVerbId("préparer")], expressions: [makeExpressionId("en + participe present")], tenses: ["tense_gerondif"] },
      cloze_candidates: ["en préparant"],
      study: { difficulty: 1 },
      attestations: [{ source_type: "book", chapter_number: 15, page_printed: 129, context_type: "example_sentence" }],
    },
  ];

  const chapter: Chapter = {
    id: chId,
    chapter_number: chNum,
    title: "The present participle and the gerund",
    section_ids: sections.map((s) => s.id),
    concept_ids: [],
    tense_ids: ["tense_participe_present", "tense_gerondif"],
    grammar_rule_ids: grammar_rules.map((r) => r.id),
    verb_ids: verbs.map((v) => v.id),
    conjugation_ids: conjugations.map((c) => c.id),
    expression_ids: expressions.map((e) => e.id),
    vocabulary_ids: vocabulary.map((v) => v.id),
    example_ids: examples.map((e) => e.id),
    exercise_ids: exercises.map((e) => e.id),
    source: { page_start_printed: 126, page_end_printed: 130, page_start_pdf: 140, page_end_pdf: 144 },
    tags: ["present_participle", "gerund", "gérondif"],
  };

  return { chapter, sections, grammar_rules, verbs, conjugations, vocabulary, expressions, examples, exercises };
}

// =======================================================================
// CHAPTER 16: The passé simple
// =======================================================================
export function buildChapter16(pages: RawPage[]): ChapterExtractionBundle {
  const chNum = 16;
  const chId = makeChapterId(chNum);
  const chPages = pages.filter((p) => (p.printed_page || 0) >= 131 && (p.printed_page || 0) <= 135);
  const exercises = extractChapterExercises(chNum, chPages);

  const sec1 = {
    id: makeSectionId(chNum, 1, "Formation of the passe simple"),
    chapter_id: chId,
    order: 1,
    title: "Formation of the passé simple",
    concept_ids: ["concept_past_time"],
    tense_ids: ["tense_passe_simple"],
    grammar_rule_ids: [makeRuleId("passe_simple_regular_endings")],
    verb_ids: [],
    expression_ids: [],
    vocabulary_ids: [],
    example_ids: [makeExampleId("passe_simple", 1)],
    exercise_ids: [exercises[0]?.id, exercises[1]?.id].filter(Boolean) as string[],
    source: { page_start_printed: 131, page_end_printed: 132, page_start_pdf: 145, page_end_pdf: 146 },
  };

  const sec2 = {
    id: makeSectionId(chNum, 2, "The passe simple of irregular verbs"),
    chapter_id: chId,
    order: 2,
    title: "The passé simple of irregular verbs",
    concept_ids: ["concept_past_time"],
    tense_ids: ["tense_passe_simple"],
    grammar_rule_ids: [makeRuleId("passe_simple_irregular_verbs_patterns")],
    verb_ids: [makeVerbId("avoir"), makeVerbId("être"), makeVerbId("faire"), makeVerbId("venir"), makeVerbId("voir")],
    expression_ids: [],
    vocabulary_ids: [],
    example_ids: [makeExampleId("passe_simple_irreg", 1)],
    exercise_ids: [exercises[2]?.id, exercises[3]?.id, exercises[4]?.id].filter(Boolean) as string[],
    source: { page_start_printed: 132, page_end_printed: 135, page_start_pdf: 146, page_end_pdf: 149 },
  };

  const sections = [sec1, sec2];

  const grammar_rules: GrammarRule[] = [
    {
      id: makeRuleId("passe_simple_regular_endings"),
      type: "grammar_rule",
      title: "Formation of the passé simple for regular verbs",
      short_label: "passé simple regular",
      grammar_category: "tense_formation",
      concept_ids: ["concept_past_time"],
      tense_ids: ["tense_passe_simple"],
      summary: "-er verbs take -a endings (-ai, -as, -a, -âmes, -âtes, -èrent); -ir/-re verbs take -i endings (-is, -is, -it, -îmes, -îtes, -irent).",
      explanation: "The passé simple is the literary past tense used in written French narratives (novels, history, formal journalism). Third person forms (il parla, ils parlèrent / il finit, ils finirent) are by far the most frequent.",
      formation: {
        steps: ["-er verbs: -ai, -as, -a, -âmes, -âtes, -èrent", "-ir/-re verbs: -is, -is, -it, -îmes, -îtes, -irent"],
        patterns: ["-a endings / -i endings"],
        endings: {},
      },
      usage_conditions: ["Written literature, formal history, fairy tales"],
      trigger_words: ["ce jour-là", "soudain", "alors"],
      signal_words: [],
      exceptions: [],
      restrictions: ["Almost never used in spoken conversation."],
      notes: [],
      common_mistakes: [],
      contrast_with_rule_ids: [],
      related_rule_ids: [],
      prerequisite_rule_ids: [],
      example_ids: [makeExampleId("passe_simple", 1)],
      exercise_ids: [],
      study: { learning_priority: 2, usefulness: 3, difficulty: 4 },
      attestations: [{ source_type: "book", chapter_number: 16, page_printed: 131, context_type: "grammar_explanation" }],
      tags: ["literary", "passé_simple", "past"],
    },
    {
      id: makeRuleId("passe_simple_irregular_verbs_patterns"),
      type: "grammar_rule",
      title: "Irregular passé simple: -u-, -i-, and -in- patterns",
      short_label: "passé simple irregular",
      grammar_category: "tense_formation",
      concept_ids: ["concept_past_time"],
      tense_ids: ["tense_passe_simple"],
      summary: "Three irregular vowel patterns: 1. -u- pattern (eut, fut, put, voulut, sut, dut); 2. -i- pattern (vit, prit, mit, dit, fit); 3. -in- pattern (vint, tint).",
      explanation: "- Avoir: il eut, ils eurent\n- Être: il fut, ils furent\n- Faire: il fit, ils firent\n- Venir: il vint, ils vinrent\n- Voir: il vit, ils virent\n- Pouvoir: il put, ils purent",
      formation: null,
      usage_conditions: ["Literary narratives"],
      trigger_words: [],
      signal_words: [],
      exceptions: [],
      restrictions: [],
      notes: [],
      common_mistakes: [],
      contrast_with_rule_ids: [],
      related_rule_ids: [],
      prerequisite_rule_ids: [],
      example_ids: [makeExampleId("passe_simple_irreg", 1)],
      exercise_ids: [],
      study: { learning_priority: 2, usefulness: 3, difficulty: 4 },
      attestations: [{ source_type: "book", chapter_number: 16, page_printed: 132, context_type: "grammar_explanation" }],
      tags: ["literary", "passé_simple", "irregular"],
    },
  ];

  const verbs: Verb[] = [];
  const conjugations: Conjugation[] = [];
  const expressions: Expression[] = [];
  const vocabulary: Vocabulary[] = [];

  const examples: Example[] = [
    {
      id: makeExampleId("passe_simple", 1),
      type: "example",
      french: "La reine avança vers le trône et salua l'assemblée.",
      english: "The queen moved toward the throne and greeted the assembly.",
      source_type: "book",
      annotations: { focus_spans: [{ text: "avança", role: "passe_simple" }, { text: "salua", role: "passe_simple" }] },
      relations: { verbs: [makeVerbId("avancer"), makeVerbId("saluer")], tenses: ["tense_passe_simple"] },
      cloze_candidates: ["avança", "salua"],
      study: { difficulty: 3 },
      attestations: [{ source_type: "book", chapter_number: 16, page_printed: 131, context_type: "example_sentence" }],
    },
    {
      id: makeExampleId("passe_simple_irreg", 1),
      type: "example",
      french: "Le roi fit appeler ses conseillers et leur parla.",
      english: "The king had his advisers called and spoke to them.",
      source_type: "book",
      annotations: { focus_spans: [{ text: "fit", role: "passe_simple_irregular" }] },
      relations: { verbs: [makeVerbId("faire")], tenses: ["tense_passe_simple"] },
      cloze_candidates: ["fit"],
      study: { difficulty: 3 },
      attestations: [{ source_type: "book", chapter_number: 16, page_printed: 133, context_type: "example_sentence" }],
    },
  ];

  const chapter: Chapter = {
    id: chId,
    chapter_number: chNum,
    title: "The passé simple",
    section_ids: sections.map((s) => s.id),
    concept_ids: ["concept_past_time"],
    tense_ids: ["tense_passe_simple"],
    grammar_rule_ids: grammar_rules.map((r) => r.id),
    verb_ids: verbs.map((v) => v.id),
    conjugation_ids: conjugations.map((c) => c.id),
    expression_ids: expressions.map((e) => e.id),
    vocabulary_ids: vocabulary.map((v) => v.id),
    example_ids: examples.map((e) => e.id),
    exercise_ids: exercises.map((e) => e.id),
    source: { page_start_printed: 131, page_end_printed: 135, page_start_pdf: 145, page_end_pdf: 149 },
    tags: ["passe_simple", "literary_past", "narrative"],
  };

  return { chapter, sections, grammar_rules, verbs, conjugations, vocabulary, expressions, examples, exercises };
}

// =======================================================================
// CHAPTER 17: The passive voice
// =======================================================================
export function buildChapter17(pages: RawPage[]): ChapterExtractionBundle {
  const chNum = 17;
  const chId = makeChapterId(chNum);
  const chPages = pages.filter((p) => (p.printed_page || 0) >= 136 && (p.printed_page || 0) <= 140);
  const exercises = extractChapterExercises(chNum, chPages);

  const sec1 = {
    id: makeSectionId(chNum, 1, "Formation of the passive voice"),
    chapter_id: chId,
    order: 1,
    title: "Formation of the passive voice",
    concept_ids: ["concept_passive_voice"],
    tense_ids: [],
    grammar_rule_ids: [makeRuleId("passive_voice_formation_and_agreement")],
    verb_ids: [],
    expression_ids: [],
    vocabulary_ids: [],
    example_ids: [makeExampleId("passive", 1)],
    exercise_ids: [exercises[0]?.id, exercises[1]?.id].filter(Boolean) as string[],
    source: { page_start_printed: 136, page_end_printed: 139, page_start_pdf: 150, page_end_pdf: 153 },
  };

  const sec2 = {
    id: makeSectionId(chNum, 2, "Uses and avoiding the passive voice"),
    chapter_id: chId,
    order: 2,
    title: "Uses and avoiding the passive voice in French",
    concept_ids: ["concept_passive_voice"],
    tense_ids: [],
    grammar_rule_ids: [makeRuleId("avoiding_passive_voice_with_on_and_pronominals")],
    verb_ids: [],
    expression_ids: [makeExpressionId("on + verbe actif")],
    vocabulary_ids: [],
    example_ids: [makeExampleId("avoid_passive", 1)],
    exercise_ids: [exercises[2]?.id, exercises[3]?.id].filter(Boolean) as string[],
    source: { page_start_printed: 139, page_end_printed: 140, page_start_pdf: 153, page_end_pdf: 154 },
  };

  const sections = [sec1, sec2];

  const grammar_rules: GrammarRule[] = [
    {
      id: makeRuleId("passive_voice_formation_and_agreement"),
      type: "grammar_rule",
      title: "Formation of the passive voice and agent prepositions (par / de)",
      short_label: "Passive voice formation",
      grammar_category: "passive_voice",
      concept_ids: ["concept_passive_voice"],
      tense_ids: [],
      summary: "Être (in any tense) + past participle (agreeing with subject) + par / de + agent.",
      explanation: "Active: 'Le chat mange la souris' -> Passive: 'La souris est mangée par le chat'. The past participle always agrees in gender and number with the grammatical subject. 'Par' is standard; 'de' is used with state/emotion verbs (aimé de, respecté de, entouré de).",
      formation: {
        steps: ["Conjugate être in the original tense", "Add past participle of action verb agreeing with subject", "Introduce agent with 'par' or 'de'"],
        patterns: ["[PATIENT] + être (temps voulu) + [PARTICIPE PASSÉ ACCORDÉ] + par/de + [AGENT]"],
        endings: {},
      },
      usage_conditions: ["Emphasizing the result or the recipient of the action"],
      trigger_words: ["par", "de"],
      signal_words: [],
      exceptions: [],
      restrictions: [],
      notes: [],
      common_mistakes: [{ wrong: "La maison a été vendu", correct: "La maison a été vendue", explanation: "Participle agrees with feminine subject 'la maison'." }],
      contrast_with_rule_ids: [],
      related_rule_ids: [makeRuleId("avoiding_passive_voice_with_on_and_pronominals")],
      prerequisite_rule_ids: [],
      example_ids: [makeExampleId("passive", 1)],
      exercise_ids: [],
      study: { learning_priority: 4, usefulness: 4, difficulty: 3 },
      attestations: [{ source_type: "book", chapter_number: 17, page_printed: 136, context_type: "grammar_explanation" }],
      tags: ["passive_voice", "agreement"],
    },
    {
      id: makeRuleId("avoiding_passive_voice_with_on_and_pronominals"),
      type: "grammar_rule",
      title: "Avoiding the passive voice in French using 'on' or pronominal verbs",
      short_label: "Avoiding the passive",
      grammar_category: "syntax",
      concept_ids: ["concept_passive_voice"],
      tense_ids: [],
      summary: "French prefers active sentences using 'on' (On parle français) or passive pronominals (Le français se parle) over literal passive constructions.",
      explanation: "Instead of 'Le pont a été détruit', French frequently prefers:\n1. Active with 'on': 'On a détruit le pont'.\n2. Passive pronominal: 'Ce livre se lit facilement'.",
      formation: null,
      usage_conditions: ["Natural idiomatic French style"],
      trigger_words: ["on", "se"],
      signal_words: [],
      exceptions: [],
      restrictions: [],
      notes: [],
      common_mistakes: [],
      contrast_with_rule_ids: [],
      related_rule_ids: [],
      prerequisite_rule_ids: [],
      example_ids: [makeExampleId("avoid_passive", 1)],
      exercise_ids: [],
      study: { learning_priority: 5, usefulness: 5, difficulty: 2 },
      attestations: [{ source_type: "book", chapter_number: 17, page_printed: 139, context_type: "grammar_explanation" }],
      tags: ["essential", "style", "passive_voice"],
    },
  ];

  const verbs: Verb[] = [];
  const conjugations: Conjugation[] = [];
  const expressions: Expression[] = [
    {
      id: makeExpressionId("on + verbe actif"),
      type: "expression",
      expression_type: "sentence_starter",
      canonical_form: "on + verbe actif",
      display_form: "On + verbe actif (remplaçant le passif)",
      english: ["someone does...", "people do...", "is done"],
      base_verb_ids: [],
      related_vocabulary_ids: [],
      productive: true,
      collocation_strength: "strong",
      pattern: "On [ACTIVE_VERB]",
      pattern_slots: [],
      transformations: [],
      variants: [],
      function_ids: [],
      usage_notes: ["Natural French alternative to passive"],
      restrictions: [],
      common_mistakes: [],
      example_ids: [makeExampleId("avoid_passive", 1)],
      study: { learning_priority: 5, usefulness: 5, difficulty: 1 },
      usage: { register: "neutral", spoken_written: "both", contexts: [] },
      frequency: { book_occurrences: 4 },
      origin: { source_type: "book", created_by: "extraction", derived_from_ids: [] },
      attestations: [{ source_type: "book", chapter_number: 17, page_printed: 139, context_type: "grammar_explanation" }],
      relations: { grammar_rules: [makeRuleId("avoiding_passive_voice_with_on_and_pronominals")] },
      tags: ["essential", "style"],
    },
  ];
  const vocabulary: Vocabulary[] = [];

  const examples: Example[] = [
    {
      id: makeExampleId("passive", 1),
      type: "example",
      french: "Le nouveau musée a été inauguré par le ministre.",
      english: "The new museum was inaugurated by the minister.",
      source_type: "book",
      annotations: { focus_spans: [{ text: "a été inauguré par", role: "passive_construction" }] },
      relations: { verbs: [makeVerbId("inaugurer")], grammar_rules: [makeRuleId("passive_voice_formation_and_agreement")] },
      cloze_candidates: ["a été inauguré"],
      study: { difficulty: 2 },
      attestations: [{ source_type: "book", chapter_number: 17, page_printed: 136, context_type: "example_sentence" }],
    },
    {
      id: makeExampleId("avoid_passive", 1),
      type: "example",
      french: "On a construit ce château au quinzième siècle.",
      english: "This castle was built in the fifteenth century (literally: One built this castle...).",
      source_type: "book",
      annotations: { focus_spans: [{ text: "On a construit", role: "active_alternative" }] },
      relations: { verbs: [makeVerbId("construire")], expressions: [makeExpressionId("on + verbe actif")] },
      cloze_candidates: ["On a construit"],
      study: { difficulty: 1 },
      attestations: [{ source_type: "book", chapter_number: 17, page_printed: 139, context_type: "example_sentence" }],
    },
  ];

  const chapter: Chapter = {
    id: chId,
    chapter_number: chNum,
    title: "The passive voice",
    section_ids: sections.map((s) => s.id),
    concept_ids: ["concept_passive_voice"],
    tense_ids: [],
    grammar_rule_ids: grammar_rules.map((r) => r.id),
    verb_ids: verbs.map((v) => v.id),
    conjugation_ids: conjugations.map((c) => c.id),
    expression_ids: expressions.map((e) => e.id),
    vocabulary_ids: vocabulary.map((v) => v.id),
    example_ids: examples.map((e) => e.id),
    exercise_ids: exercises.map((e) => e.id),
    source: { page_start_printed: 136, page_end_printed: 140, page_start_pdf: 150, page_end_pdf: 154 },
    tags: ["passive_voice", "voix_passive", "on"],
  };

  return { chapter, sections, grammar_rules, verbs, conjugations, vocabulary, expressions, examples, exercises };
}

// =======================================================================
// CHAPTER 18: Indirect speech
// =======================================================================
export function buildChapter18(pages: RawPage[]): ChapterExtractionBundle {
  const chNum = 18;
  const chId = makeChapterId(chNum);
  const chPages = pages.filter((p) => (p.printed_page || 0) >= 141 && (p.printed_page || 0) <= 146);
  const exercises = extractChapterExercises(chNum, chPages);

  const sec1 = {
    id: makeSectionId(chNum, 1, "Direct speech versus indirect speech"),
    chapter_id: chId,
    order: 1,
    title: "Direct speech versus indirect speech",
    concept_ids: ["concept_indirect_speech"],
    tense_ids: [],
    grammar_rule_ids: [makeRuleId("direct_to_indirect_speech_transformations")],
    verb_ids: [makeVerbId("dire"), makeVerbId("demander"), makeVerbId("affirmer")],
    expression_ids: [],
    vocabulary_ids: [],
    example_ids: [makeExampleId("discours_indirect", 1)],
    exercise_ids: [exercises[0]?.id, exercises[1]?.id].filter(Boolean) as string[],
    source: { page_start_printed: 141, page_end_printed: 142, page_start_pdf: 155, page_end_pdf: 156 },
  };

  const sec2 = {
    id: makeSectionId(chNum, 2, "Balancing tenses la concordance des temps"),
    chapter_id: chId,
    order: 2,
    title: "Balancing tenses: la concordance des temps",
    concept_ids: ["concept_indirect_speech"],
    tense_ids: [],
    grammar_rule_ids: [makeRuleId("concordance_des_temps_tense_shifts")],
    verb_ids: [],
    expression_ids: [],
    vocabulary_ids: [],
    example_ids: [makeExampleId("concordance", 1)],
    exercise_ids: [exercises[2]?.id, exercises[3]?.id, exercises[4]?.id].filter(Boolean) as string[],
    source: { page_start_printed: 142, page_end_printed: 146, page_start_pdf: 156, page_end_pdf: 160 },
  };

  const sections = [sec1, sec2];

  const grammar_rules: GrammarRule[] = [
    {
      id: makeRuleId("direct_to_indirect_speech_transformations"),
      type: "grammar_rule",
      title: "Reporting statements and questions in indirect speech",
      short_label: "Indirect speech basics",
      grammar_category: "indirect_speech",
      concept_ids: ["concept_indirect_speech"],
      tense_ids: [],
      summary: "Reporting verbs take 'que' for statements, 'si' for yes/no questions, 'ce que' for qu'est-ce que, and 'de + infinitive' for commands.",
      explanation: "- Statements: Il dit : « Je pars » -> Il dit qu'il part.\n- Yes/No questions: Il demande : « Est-ce que tu viens ? » -> Il demande si je viens.\n- What questions: Il demande : « Qu'est-ce que tu fais ? » -> Il demande ce que je fais.\n- Commands: Il dit : « Partez ! » -> Il dit de partir.",
      formation: null,
      usage_conditions: ["Reporting spoken utterances"],
      trigger_words: ["que", "si", "ce que", "ce qui", "de"],
      signal_words: [],
      exceptions: [],
      restrictions: [],
      notes: [],
      common_mistakes: [{ wrong: "Il demande qu'est-ce que je fais", correct: "Il demande ce que je fais", explanation: "Qu'est-ce que changes to 'ce que' in indirect speech." }],
      contrast_with_rule_ids: [],
      related_rule_ids: [makeRuleId("concordance_des_temps_tense_shifts")],
      prerequisite_rule_ids: [],
      example_ids: [makeExampleId("discours_indirect", 1)],
      exercise_ids: [],
      study: { learning_priority: 5, usefulness: 5, difficulty: 3 },
      attestations: [{ source_type: "book", chapter_number: 18, page_printed: 141, context_type: "grammar_explanation" }],
      tags: ["essential", "indirect_speech", "syntax"],
    },
    {
      id: makeRuleId("concordance_des_temps_tense_shifts"),
      type: "grammar_rule",
      title: "Tense shifts in indirect speech (la concordance des temps)",
      short_label: "Concordance des temps",
      grammar_category: "indirect_speech",
      concept_ids: ["concept_indirect_speech"],
      tense_ids: [],
      summary: "When reporting verb is in the past: Present -> Imparfait; Passé composé -> Plus-que-parfait; Futur simple -> Conditionnel présent.",
      explanation: "If the introductory verb is in a past tense (il a dit, il disait):\n- Présent becomes Imparfait: 'Je suis fatigué' -> Il a dit qu'il était fatigué.\n- Passé composé becomes Plus-que-parfait: 'J'ai fini' -> Il a dit qu'il avait fini.\n- Futur simple becomes Conditionnel présent: 'Je viendrai' -> Il a dit qu'il viendrait.",
      formation: null,
      usage_conditions: ["Indirect speech introduced by a past tense verb"],
      trigger_words: [],
      signal_words: [],
      exceptions: ["If the introductory verb is in the present (il dit), tenses do NOT shift."],
      restrictions: [],
      notes: [],
      common_mistakes: [{ wrong: "Il a dit qu'il viendra demain", correct: "Il a dit qu'il viendrait le lendemain", explanation: "Future shifts to conditional when introductory verb is in past." }],
      contrast_with_rule_ids: [],
      related_rule_ids: [],
      prerequisite_rule_ids: [],
      example_ids: [makeExampleId("concordance", 1)],
      exercise_ids: [],
      study: { learning_priority: 5, usefulness: 5, difficulty: 4 },
      attestations: [{ source_type: "book", chapter_number: 18, page_printed: 142, context_type: "grammar_explanation" }],
      tags: ["essential", "indirect_speech", "tense_agreement"],
    },
  ];

  const verbs: Verb[] = [];
  const conjugations: Conjugation[] = [];
  const expressions: Expression[] = [];
  const vocabulary: Vocabulary[] = [];

  const examples: Example[] = [
    {
      id: makeExampleId("discours_indirect", 1),
      type: "example",
      french: "Il me demande ce que je veux faire.",
      english: "He asks me what I want to do.",
      source_type: "book",
      annotations: { focus_spans: [{ text: "ce que je veux", role: "indirect_question" }] },
      relations: { verbs: [makeVerbId("demander"), makeVerbId("vouloir")], grammar_rules: [makeRuleId("direct_to_indirect_speech_transformations")] },
      cloze_candidates: ["ce que"],
      study: { difficulty: 2 },
      attestations: [{ source_type: "book", chapter_number: 18, page_printed: 141, context_type: "example_sentence" }],
    },
    {
      id: makeExampleId("concordance", 1),
      type: "example",
      french: "Elle a affirmé qu'elle viendrait à la fête le lendemain.",
      english: "She affirmed that she would come to the party the next day.",
      source_type: "book",
      annotations: { focus_spans: [{ text: "a affirmé qu'elle viendrait", role: "tense_shift" }] },
      relations: { verbs: [makeVerbId("affirmer"), makeVerbId("venir")], grammar_rules: [makeRuleId("concordance_des_temps_tense_shifts")] },
      cloze_candidates: ["viendrait"],
      study: { difficulty: 3 },
      attestations: [{ source_type: "book", chapter_number: 18, page_printed: 142, context_type: "example_sentence" }],
    },
  ];

  const chapter: Chapter = {
    id: chId,
    chapter_number: chNum,
    title: "Indirect speech",
    section_ids: sections.map((s) => s.id),
    concept_ids: ["concept_indirect_speech"],
    tense_ids: [],
    grammar_rule_ids: grammar_rules.map((r) => r.id),
    verb_ids: verbs.map((v) => v.id),
    conjugation_ids: conjugations.map((c) => c.id),
    expression_ids: expressions.map((e) => e.id),
    vocabulary_ids: vocabulary.map((v) => v.id),
    example_ids: examples.map((e) => e.id),
    exercise_ids: exercises.map((e) => e.id),
    source: { page_start_printed: 141, page_end_printed: 146, page_start_pdf: 155, page_end_pdf: 160 },
    tags: ["indirect_speech", "discours_indirect", "concordance_des_temps"],
  };

  return { chapter, sections, grammar_rules, verbs, conjugations, vocabulary, expressions, examples, exercises };
}
