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
// CHAPTER 19: The imperative mood
// =======================================================================
export function buildChapter19(pages: RawPage[]): ChapterExtractionBundle {
  const chNum = 19;
  const chId = makeChapterId(chNum);
  const chPages = pages.filter((p) => (p.printed_page || 0) >= 147 && (p.printed_page || 0) <= 151);
  const exercises = extractChapterExercises(chNum, chPages);

  const sec1 = {
    id: makeSectionId(chNum, 1, "Formation of the imperative"),
    chapter_id: chId,
    order: 1,
    title: "Formation of the imperative",
    concept_ids: [],
    tense_ids: ["tense_imperatif"],
    grammar_rule_ids: [makeRuleId("imperative_formation_and_dropping_s")],
    verb_ids: [makeVerbId("avoir"), makeVerbId("être"), makeVerbId("savoir"), makeVerbId("vouloir")],
    expression_ids: [makeExpressionId("ayez la bonte de")],
    vocabulary_ids: [],
    example_ids: [makeExampleId("imperative", 1)],
    exercise_ids: [exercises[0]?.id, exercises[1]?.id].filter(Boolean) as string[],
    source: { page_start_printed: 147, page_end_printed: 150, page_start_pdf: 161, page_end_pdf: 164 },
  };

  const sec2 = {
    id: makeSectionId(chNum, 2, "The imperative of pronominal verbs"),
    chapter_id: chId,
    order: 2,
    title: "The imperative of pronominal verbs",
    concept_ids: ["concept_pronominal_verbs"],
    tense_ids: ["tense_imperatif"],
    grammar_rule_ids: [makeRuleId("imperative_pronominal_affirmative_vs_negative")],
    verb_ids: [makeVerbId("se dépêcher"), makeVerbId("se taire")],
    expression_ids: [makeExpressionId("taisez-vous"), makeExpressionId("depechez-vous")],
    vocabulary_ids: [],
    example_ids: [makeExampleId("imperative_pron", 1)],
    exercise_ids: [exercises[2]?.id, exercises[3]?.id].filter(Boolean) as string[],
    source: { page_start_printed: 150, page_end_printed: 151, page_start_pdf: 164, page_end_pdf: 165 },
  };

  const sections = [sec1, sec2];

  const grammar_rules: GrammarRule[] = [
    {
      id: makeRuleId("imperative_formation_and_dropping_s"),
      type: "grammar_rule",
      title: "Formation of the imperative and dropping 's' in the tu form",
      short_label: "Imperative formation",
      grammar_category: "imperative",
      concept_ids: [],
      tense_ids: ["tense_imperatif"],
      summary: "Three forms: tu, nous, vous without subject pronouns. Drop the final 's' in the 'tu' form of -er verbs and aller (Parle!, Va!), except before y or en (Vas-y!, Manges-en!).",
      explanation: "Regular -er verbs and aller drop the final -s in the tu form: 'Parle!', 'Écoute!', 'Va!'. However, when followed by y or en, the -s is kept for liaison: 'Vas-y!', 'Manges-en!'.\nIrregular imperative stems:\n- être: sois, soyons, soyez\n- avoir: aie, ayons, ayez\n- savoir: sache, sachons, sachez\n- vouloir: veuillez",
      formation: {
        steps: ["Use tu, nous, vous present forms without pronouns", "Drop 's' in tu form for -er verbs and aller", "Keep 's' before y or en"],
        patterns: ["[VERBE]!"],
        endings: {},
      },
      usage_conditions: ["Commands, instructions, invitations, requests"],
      trigger_words: ["s'il vous plaît", "s'il te plaît"],
      signal_words: [],
      exceptions: ["être (sois/soyons/soyez), avoir (aie/ayons/ayez), savoir (sache/sachons/sachez), vouloir (veuillez)"],
      restrictions: [],
      notes: [],
      common_mistakes: [{ wrong: "Parles! / Vas!", correct: "Parle! / Va! (unless followed by y/en: Vas-y!)", explanation: "Drop 's' in tu command for -er verbs." }],
      contrast_with_rule_ids: [],
      related_rule_ids: [],
      prerequisite_rule_ids: [],
      example_ids: [makeExampleId("imperative", 1)],
      exercise_ids: [],
      study: { learning_priority: 5, usefulness: 5, difficulty: 2 },
      attestations: [{ source_type: "book", chapter_number: 19, page_printed: 147, context_type: "grammar_explanation" }],
      tags: ["essential", "imperative", "commands"],
    },
    {
      id: makeRuleId("imperative_pronominal_affirmative_vs_negative"),
      type: "grammar_rule",
      title: "Pronominal verbs in affirmative vs negative imperative",
      short_label: "Pronominal imperative",
      grammar_category: "imperative",
      concept_ids: ["concept_pronominal_verbs"],
      tense_ids: ["tense_imperatif"],
      summary: "Affirmative: verb-toi / verb-nous / verb-vous (Lève-toi!). Negative: ne te/nous/vous verb pas (Ne te lève pas!).",
      explanation: "- Affirmative: Pronoun follows with a hyphen; 'te' becomes 'toi': 'Habille-toi!', 'Asseyons-nous!', 'Dépêchez-vous!'.\n- Negative: Pronoun precedes the verb; 'te' remains 'te': 'Ne t'habille pas!', 'Ne nous asseyons pas!', 'Ne vous dépêchez pas!'.",
      formation: null,
      usage_conditions: ["Commands with reflexive or reciprocal verbs"],
      trigger_words: [],
      signal_words: [],
      exceptions: [],
      restrictions: [],
      notes: [],
      common_mistakes: [{ wrong: "Ne te lève toi pas", correct: "Ne te lève pas", explanation: "Use 'te' before verb in negative command." }],
      contrast_with_rule_ids: [],
      related_rule_ids: [],
      prerequisite_rule_ids: [makeRuleId("imperative_formation_and_dropping_s")],
      example_ids: [makeExampleId("imperative_pron", 1)],
      exercise_ids: [],
      study: { learning_priority: 5, usefulness: 5, difficulty: 2 },
      attestations: [{ source_type: "book", chapter_number: 19, page_printed: 150, context_type: "grammar_explanation" }],
      tags: ["essential", "imperative", "pronominal"],
    },
  ];

  const verbs: Verb[] = [];
  const conjugations: Conjugation[] = [];
  const expressions: Expression[] = [];
  const vocabulary: Vocabulary[] = [];

  const examples: Example[] = [
    {
      id: makeExampleId("imperative", 1),
      type: "example",
      french: "Fermez la porte et asseyez-vous, s'il vous plaît.",
      english: "Close the door and sit down, please.",
      source_type: "book",
      annotations: { focus_spans: [{ text: "Fermez", role: "command" }, { text: "asseyez-vous", role: "pronominal_command" }] },
      relations: { verbs: [makeVerbId("fermer"), makeVerbId("s'asseoir")], tenses: ["tense_imperatif"] },
      cloze_candidates: ["Fermez", "asseyez-vous"],
      study: { difficulty: 1 },
      attestations: [{ source_type: "book", chapter_number: 19, page_printed: 147, context_type: "example_sentence" }],
    },
    {
      id: makeExampleId("imperative_pron", 1),
      type: "example",
      french: "Ne vous inquiétez pas, tout va bien se passer.",
      english: "Don't worry, everything is going to be fine.",
      source_type: "book",
      annotations: { focus_spans: [{ text: "Ne vous inquiétez pas", role: "negative_pronominal_command" }] },
      relations: { verbs: [makeVerbId("s'inquiéter")], tenses: ["tense_imperatif"] },
      cloze_candidates: ["Ne vous inquiétez pas"],
      study: { difficulty: 1 },
      attestations: [{ source_type: "book", chapter_number: 19, page_printed: 150, context_type: "example_sentence" }],
    },
  ];

  const chapter: Chapter = {
    id: chId,
    chapter_number: chNum,
    title: "The imperative mood",
    section_ids: sections.map((s) => s.id),
    concept_ids: ["concept_pronominal_verbs"],
    tense_ids: ["tense_imperatif"],
    grammar_rule_ids: grammar_rules.map((r) => r.id),
    verb_ids: verbs.map((v) => v.id),
    conjugation_ids: conjugations.map((c) => c.id),
    expression_ids: expressions.map((e) => e.id),
    vocabulary_ids: vocabulary.map((v) => v.id),
    example_ids: examples.map((e) => e.id),
    exercise_ids: exercises.map((e) => e.id),
    source: { page_start_printed: 147, page_end_printed: 151, page_start_pdf: 161, page_end_pdf: 165 },
    tags: ["imperative", "impératif", "commands"],
  };

  return { chapter, sections, grammar_rules, verbs, conjugations, vocabulary, expressions, examples, exercises };
}

// =======================================================================
// CHAPTER 20: Articles and nouns
// =======================================================================
export function buildChapter20(pages: RawPage[]): ChapterExtractionBundle {
  const chNum = 20;
  const chId = makeChapterId(chNum);
  const chPages = pages.filter((p) => (p.printed_page || 0) >= 152 && (p.printed_page || 0) <= 165);
  const exercises = extractChapterExercises(chNum, chPages);

  const sec1 = {
    id: makeSectionId(chNum, 1, "The definite article with nouns"),
    chapter_id: chId,
    order: 1,
    title: "The definite article with nouns",
    concept_ids: [],
    tense_ids: [],
    grammar_rule_ids: [makeRuleId("definite_articles_and_contractions")],
    verb_ids: [],
    expression_ids: [],
    vocabulary_ids: [],
    example_ids: [makeExampleId("article_def", 1)],
    exercise_ids: [exercises[0]?.id, exercises[1]?.id].filter(Boolean) as string[],
    source: { page_start_printed: 152, page_end_printed: 153, page_start_pdf: 166, page_end_pdf: 167 },
  };

  const sec2 = {
    id: makeSectionId(chNum, 2, "The indefinite and partitive articles"),
    chapter_id: chId,
    order: 2,
    title: "The indefinite and partitive articles with nouns",
    concept_ids: [],
    tense_ids: [],
    grammar_rule_ids: [makeRuleId("partitive_articles_du_de_la_des"), makeRuleId("partitive_in_negation_and_quantities")],
    verb_ids: [],
    expression_ids: [makeExpressionId("un peu de"), makeExpressionId("beaucoup de")],
    vocabulary_ids: [],
    example_ids: [makeExampleId("partitive", 1)],
    exercise_ids: [exercises[2]?.id, exercises[3]?.id].filter(Boolean) as string[],
    source: { page_start_printed: 153, page_end_printed: 155, page_start_pdf: 167, page_end_pdf: 169 },
  };

  const sec3 = {
    id: makeSectionId(chNum, 3, "The gender of nouns"),
    chapter_id: chId,
    order: 3,
    title: "The gender of nouns",
    concept_ids: [],
    tense_ids: [],
    grammar_rule_ids: [makeRuleId("noun_gender_endings_rules")],
    verb_ids: [],
    expression_ids: [],
    vocabulary_ids: [],
    example_ids: [makeExampleId("gender_noun", 1)],
    exercise_ids: [exercises[4]?.id, exercises[5]?.id].filter(Boolean) as string[],
    source: { page_start_printed: 155, page_end_printed: 158, page_start_pdf: 169, page_end_pdf: 172 },
  };

  const sec4 = {
    id: makeSectionId(chNum, 4, "The plural of nouns"),
    chapter_id: chId,
    order: 4,
    title: "The plural of nouns",
    concept_ids: [],
    tense_ids: [],
    grammar_rule_ids: [makeRuleId("noun_plural_formation_and_irregular_endings")],
    verb_ids: [],
    expression_ids: [],
    vocabulary_ids: [],
    example_ids: [makeExampleId("plural_noun", 1)],
    exercise_ids: [exercises[6]?.id, exercises[7]?.id].filter(Boolean) as string[],
    source: { page_start_printed: 158, page_end_printed: 160, page_start_pdf: 172, page_end_pdf: 174 },
  };

  const sec5 = {
    id: makeSectionId(chNum, 5, "Gender of countries and geographical prepositions"),
    chapter_id: chId,
    order: 5,
    title: "The gender of countries and geographical names with prepositions",
    concept_ids: [],
    tense_ids: [],
    grammar_rule_ids: [makeRuleId("country_gender_and_prepositions_en_au_aux")],
    verb_ids: [],
    expression_ids: [makeExpressionId("en france"), makeExpressionId("au canada"), makeExpressionId("aux etats-unis")],
    vocabulary_ids: [],
    example_ids: [makeExampleId("geo_prep", 1)],
    exercise_ids: [exercises[8]?.id, exercises[9]?.id, exercises[10]?.id, exercises[11]?.id].filter(Boolean) as string[],
    source: { page_start_printed: 160, page_end_printed: 165, page_start_pdf: 174, page_end_pdf: 179 },
  };

  const sections = [sec1, sec2, sec3, sec4, sec5];

  const grammar_rules: GrammarRule[] = [
    {
      id: makeRuleId("definite_articles_and_contractions"),
      type: "grammar_rule",
      title: "Definite articles and contractions with à and de",
      short_label: "Definite articles & contractions",
      grammar_category: "articles",
      concept_ids: [],
      tense_ids: [],
      summary: "le, la, l', les. Contractions: à + le = au, à + les = aux; de + le = du, de + les = des.",
      explanation: "Definite articles designate specific items or general concepts in French (L'amour, La liberté). When combined with à or de, le and les contract:\n- à + le -> au (au cinéma)\n- à + les -> aux (aux étudiants)\n- de + le -> du (du professeur)\n- de + les -> des (des enfants)",
      formation: null,
      usage_conditions: [],
      trigger_words: ["au", "aux", "du", "des"],
      signal_words: [],
      exceptions: ["No contraction with 'la' or 'l'' (à la maison, de l'eau)."],
      restrictions: [],
      notes: [],
      common_mistakes: [{ wrong: "à le cinéma", correct: "au cinéma", explanation: "à + le must contract to au." }],
      contrast_with_rule_ids: [],
      related_rule_ids: [],
      prerequisite_rule_ids: [],
      example_ids: [makeExampleId("article_def", 1)],
      exercise_ids: [],
      study: { learning_priority: 5, usefulness: 5, difficulty: 1 },
      attestations: [{ source_type: "book", chapter_number: 20, page_printed: 152, context_type: "grammar_explanation" }],
      tags: ["essential", "articles", "contractions"],
    },
    {
      id: makeRuleId("country_gender_and_prepositions_en_au_aux"),
      type: "grammar_rule",
      title: "Country gender and prepositions (en, au, aux, à)",
      short_label: "Geographical prepositions",
      grammar_category: "prepositions",
      concept_ids: [],
      tense_ids: [],
      summary: "Countries ending in -e are feminine (use 'en': en France, en Italie). Masculine countries use 'au' (au Canada, au Japon). Plural countries use 'aux' (aux États-Unis). Cities use 'à' (à Paris).",
      explanation: "- Feminine country / vowel start: 'en' (en France, en Espagne, en Iran)\n- Masculine country starting with consonant: 'au' (au Mexique, au Canada, au Japon)\n- Plural countries: 'aux' (aux États-Unis, aux Pays-Bas)\n- Cities: 'à' (à Paris, à Tokyo, à New York)\n- Coming from: de/d' (fem: de France), du (masc: du Canada), des (pl: des États-Unis), de (cities: de Paris).",
      formation: null,
      usage_conditions: ["Expressing destination (to/in) or origin (from) with geographical places"],
      trigger_words: ["en", "au", "aux", "à", "du", "de", "des"],
      signal_words: [],
      exceptions: ["Le Mexique, le Mozambique, le Cambodge, le Zimbabwe end in -e but are masculine (au Mexique)."],
      restrictions: [],
      notes: [],
      common_mistakes: [{ wrong: "à France / dans la France", correct: "en France", explanation: "Use 'en' for feminine countries." }],
      contrast_with_rule_ids: [],
      related_rule_ids: [],
      prerequisite_rule_ids: [],
      example_ids: [makeExampleId("geo_prep", 1)],
      exercise_ids: [],
      study: { learning_priority: 5, usefulness: 5, difficulty: 2 },
      attestations: [{ source_type: "book", chapter_number: 20, page_printed: 160, context_type: "grammar_explanation" }],
      tags: ["essential", "geography", "prepositions"],
    },
  ];

  const verbs: Verb[] = [];
  const conjugations: Conjugation[] = [];
  const expressions: Expression[] = [];
  const vocabulary: Vocabulary[] = [];

  const examples: Example[] = [
    {
      id: makeExampleId("article_def", 1),
      type: "example",
      french: "Le président va au sommet international à Genève.",
      english: "The president goes to the international summit in Geneva.",
      source_type: "book",
      annotations: { focus_spans: [{ text: "au", role: "contraction" }, { text: "à", role: "city_prep" }] },
      relations: { grammar_rules: [makeRuleId("definite_articles_and_contractions")] },
      cloze_candidates: ["au", "à"],
      study: { difficulty: 1 },
      attestations: [{ source_type: "book", chapter_number: 20, page_printed: 152, context_type: "example_sentence" }],
    },
    {
      id: makeExampleId("geo_prep", 1),
      type: "example",
      french: "Elle habite en France mais elle travaille au Canada chaque été.",
      english: "She lives in France but works in Canada every summer.",
      source_type: "book",
      annotations: { focus_spans: [{ text: "en France", role: "fem_country" }, { text: "au Canada", role: "masc_country" }] },
      relations: { grammar_rules: [makeRuleId("country_gender_and_prepositions_en_au_aux")] },
      cloze_candidates: ["en", "au"],
      study: { difficulty: 2 },
      attestations: [{ source_type: "book", chapter_number: 20, page_printed: 161, context_type: "example_sentence" }],
    },
  ];

  const chapter: Chapter = {
    id: chId,
    chapter_number: chNum,
    title: "Articles and nouns",
    section_ids: sections.map((s) => s.id),
    concept_ids: [],
    tense_ids: [],
    grammar_rule_ids: grammar_rules.map((r) => r.id),
    verb_ids: verbs.map((v) => v.id),
    conjugation_ids: conjugations.map((c) => c.id),
    expression_ids: expressions.map((e) => e.id),
    vocabulary_ids: vocabulary.map((v) => v.id),
    example_ids: examples.map((e) => e.id),
    exercise_ids: exercises.map((e) => e.id),
    source: { page_start_printed: 152, page_end_printed: 165, page_start_pdf: 166, page_end_pdf: 179 },
    tags: ["articles", "nouns", "gender", "plurals", "geography"],
  };

  return { chapter, sections, grammar_rules, verbs, conjugations, vocabulary, expressions, examples, exercises };
}

// =======================================================================
// CHAPTER 21: All the pronouns
// =======================================================================
export function buildChapter21(pages: RawPage[]): ChapterExtractionBundle {
  const chNum = 21;
  const chId = makeChapterId(chNum);
  const chPages = pages.filter((p) => (p.printed_page || 0) >= 166 && (p.printed_page || 0) <= 182);
  const exercises = extractChapterExercises(chNum, chPages);

  const sec1 = {
    id: makeSectionId(chNum, 1, "Subject and direct object pronouns"),
    chapter_id: chId,
    order: 1,
    title: "Subject and direct object pronouns",
    concept_ids: ["concept_object_pronouns"],
    tense_ids: [],
    grammar_rule_ids: [makeRuleId("direct_object_pronouns_le_la_les")],
    verb_ids: [],
    expression_ids: [],
    vocabulary_ids: [],
    example_ids: [makeExampleId("dop", 1)],
    exercise_ids: [exercises[0]?.id, exercises[1]?.id, exercises[2]?.id].filter(Boolean) as string[],
    source: { page_start_printed: 166, page_end_printed: 170, page_start_pdf: 180, page_end_pdf: 184 },
  };

  const sec2 = {
    id: makeSectionId(chNum, 2, "Indirect object pronouns"),
    chapter_id: chId,
    order: 2,
    title: "Indirect object pronouns (lui, leur)",
    concept_ids: ["concept_object_pronouns"],
    tense_ids: [],
    grammar_rule_ids: [makeRuleId("indirect_object_pronouns_lui_leur")],
    verb_ids: [],
    expression_ids: [],
    vocabulary_ids: [],
    example_ids: [makeExampleId("iop", 1)],
    exercise_ids: [exercises[3]?.id, exercises[4]?.id, exercises[5]?.id].filter(Boolean) as string[],
    source: { page_start_printed: 170, page_end_printed: 176, page_start_pdf: 184, page_end_pdf: 190 },
  };

  const sec3 = {
    id: makeSectionId(chNum, 3, "The order of object pronouns"),
    chapter_id: chId,
    order: 3,
    title: "The order of object pronouns and adverbial pronouns y and en",
    concept_ids: ["concept_object_pronouns"],
    tense_ids: [],
    grammar_rule_ids: [makeRuleId("double_object_pronoun_order_chart"), makeRuleId("adverbial_pronouns_y_and_en")],
    verb_ids: [],
    expression_ids: [makeExpressionId("il y en a"), makeExpressionId("s'y connaitre")],
    vocabulary_ids: [],
    example_ids: [makeExampleId("double_pronoun", 1), makeExampleId("y_en", 1)],
    exercise_ids: [exercises[6]?.id, exercises[7]?.id, exercises[8]?.id].filter(Boolean) as string[],
    source: { page_start_printed: 176, page_end_printed: 178, page_start_pdf: 190, page_end_pdf: 192 },
  };

  const sec4 = {
    id: makeSectionId(chNum, 4, "Disjunctive pronouns"),
    chapter_id: chId,
    order: 4,
    title: "Disjunctive (stress) pronouns",
    concept_ids: ["concept_object_pronouns"],
    tense_ids: [],
    grammar_rule_ids: [makeRuleId("disjunctive_pronouns_moi_toi_lui")],
    verb_ids: [],
    expression_ids: [makeExpressionId("quant a moi"), makeExpressionId("moi aussi")],
    vocabulary_ids: [],
    example_ids: [makeExampleId("disjunctive", 1)],
    exercise_ids: [exercises[9]?.id, exercises[10]?.id].filter(Boolean) as string[],
    source: { page_start_printed: 178, page_end_printed: 182, page_start_pdf: 192, page_end_pdf: 196 },
  };

  const sections = [sec1, sec2, sec3, sec4];

  const grammar_rules: GrammarRule[] = [
    {
      id: makeRuleId("direct_object_pronouns_le_la_les"),
      type: "grammar_rule",
      title: "Direct object pronouns (me, te, le, la, nous, vous, les)",
      short_label: "Direct object pronouns",
      grammar_category: "pronouns",
      concept_ids: ["concept_object_pronouns"],
      tense_ids: [],
      summary: "Replace a direct object noun (answering what? or whom?). Placed before the conjugated verb (or before the infinitive).",
      explanation: "- Je vois le film -> Je le vois.\n- Il aime cette chanson -> Il l'aime.\n- Nous invitons les amis -> Nous les invitons.\nWith an infinitive: 'Je veux le voir' (placed before the infinitive it belongs to).",
      formation: null,
      usage_conditions: [],
      trigger_words: ["le", "la", "les", "l'"],
      signal_words: [],
      exceptions: [],
      restrictions: [],
      notes: [],
      common_mistakes: [{ wrong: "Je vois lui (meaning direct object)", correct: "Je le vois", explanation: "Use direct object pronoun le/la before the verb." }],
      contrast_with_rule_ids: [makeRuleId("indirect_object_pronouns_lui_leur")],
      related_rule_ids: [],
      prerequisite_rule_ids: [],
      example_ids: [makeExampleId("dop", 1)],
      exercise_ids: [],
      study: { learning_priority: 5, usefulness: 5, difficulty: 2 },
      attestations: [{ source_type: "book", chapter_number: 21, page_printed: 167, context_type: "grammar_explanation" }],
      tags: ["essential", "pronouns", "direct_object"],
    },
    {
      id: makeRuleId("indirect_object_pronouns_lui_leur"),
      type: "grammar_rule",
      title: "Indirect object pronouns (me, te, lui, nous, vous, leur)",
      short_label: "Indirect object pronouns",
      grammar_category: "pronouns",
      concept_ids: ["concept_object_pronouns"],
      tense_ids: [],
      summary: "Replace 'à + person'. 'Lui' = to him/her (singular); 'Leur' = to them (plural).",
      explanation: "Used with verbs that take 'à + person' (parler à, téléphoner à, demander à, écrire à, répondre à, donner à):\n- Je parle à Pierre -> Je lui parle.\n- Je parle à Marie -> Je lui parle (lui is both masc and fem!).\n- J'écris aux parents -> Je leur écris (never 'leurs'!).",
      formation: null,
      usage_conditions: ["Replacing à + person"],
      trigger_words: ["lui", "leur"],
      signal_words: [],
      exceptions: [],
      restrictions: [],
      notes: ["'Lui' is used for both masculine and feminine singular. 'Leur' never takes an -s as a pronoun."],
      common_mistakes: [{ wrong: "Je leur téléphone avec s (leurs)", correct: "Je leur téléphone", explanation: "The pronoun leur never takes an s." }],
      contrast_with_rule_ids: [makeRuleId("direct_object_pronouns_le_la_les")],
      related_rule_ids: [],
      prerequisite_rule_ids: [],
      example_ids: [makeExampleId("iop", 1)],
      exercise_ids: [],
      study: { learning_priority: 5, usefulness: 5, difficulty: 3 },
      attestations: [{ source_type: "book", chapter_number: 21, page_printed: 170, context_type: "grammar_explanation" }],
      tags: ["essential", "pronouns", "indirect_object"],
    },
    {
      id: makeRuleId("double_object_pronoun_order_chart"),
      type: "grammar_rule",
      title: "Order of double object pronouns before the verb",
      short_label: "Pronoun order",
      grammar_category: "syntax",
      concept_ids: ["concept_object_pronouns"],
      tense_ids: [],
      summary: "Order before verb: 1. (me, te, se, nous, vous) -> 2. (le, la, les) -> 3. (lui, leur) -> 4. y -> 5. en.",
      explanation: "Example combinations:\n- 'Il me le donne' (1 + 2)\n- 'Je le lui donne' (2 + 3)\n- 'Il lui en parle' (3 + 5)\n- 'Je vous y emmène' (1 + 4)\n- 'Il y en a' (4 + 5)",
      formation: null,
      usage_conditions: ["Sentences with two object pronouns"],
      trigger_words: ["y", "en", "lui", "leur"],
      signal_words: [],
      exceptions: ["In affirmative imperative, order changes: [VERB] - le/la/les - moi/toi/lui/nous/vous/leur - y - en (Donne-le-moi!)."],
      restrictions: [],
      notes: [],
      common_mistakes: [{ wrong: "Je lui le donne", correct: "Je le lui donne", explanation: "Direct (le) precedes 3rd person indirect (lui)." }],
      contrast_with_rule_ids: [],
      related_rule_ids: [],
      prerequisite_rule_ids: [],
      example_ids: [makeExampleId("double_pronoun", 1)],
      exercise_ids: [],
      study: { learning_priority: 5, usefulness: 5, difficulty: 4 },
      attestations: [{ source_type: "book", chapter_number: 21, page_printed: 176, context_type: "grammar_explanation" }],
      tags: ["essential", "pronoun_order", "syntax"],
    },
  ];

  const verbs: Verb[] = [];
  const conjugations: Conjugation[] = [];
  const expressions: Expression[] = [
    {
      id: makeExpressionId("il y en a"),
      type: "expression",
      expression_type: "functional_phrase",
      canonical_form: "il y en a",
      display_form: "il y en a",
      english: ["there is some", "there are some of them"],
      base_verb_ids: [makeVerbId("avoir")],
      related_vocabulary_ids: [],
      productive: true,
      collocation_strength: "strong",
      pattern: "Il y en a [QUANTITY]",
      pattern_slots: [],
      transformations: [],
      variants: ["il n'y en a pas"],
      function_ids: [],
      usage_notes: ["Combination of impersonal y + partitive en"],
      restrictions: [],
      common_mistakes: [],
      example_ids: [makeExampleId("y_en", 1)],
      study: { learning_priority: 5, usefulness: 5, difficulty: 2 },
      usage: { register: "neutral", spoken_written: "both", contexts: [] },
      frequency: { book_occurrences: 4 },
      origin: { source_type: "book", created_by: "extraction", derived_from_ids: [] },
      attestations: [{ source_type: "book", chapter_number: 21, page_printed: 177, context_type: "grammar_explanation" }],
      relations: { grammar_rules: [makeRuleId("double_object_pronoun_order_chart")] },
      tags: ["essential", "pronouns"],
    },
  ];
  const vocabulary: Vocabulary[] = [];

  const examples: Example[] = [
    {
      id: makeExampleId("dop", 1),
      type: "example",
      french: "Ce livre? Je le lis en ce moment.",
      english: "This book? I am reading it right now.",
      source_type: "book",
      annotations: { focus_spans: [{ text: "le lis", role: "direct_object_pronoun" }] },
      relations: { verbs: [makeVerbId("lire")], grammar_rules: [makeRuleId("direct_object_pronouns_le_la_les")] },
      cloze_candidates: ["le"],
      study: { difficulty: 1 },
      attestations: [{ source_type: "book", chapter_number: 21, page_printed: 167, context_type: "example_sentence" }],
    },
    {
      id: makeExampleId("iop", 1),
      type: "example",
      french: "Je lui ai envoyé un courriel ce matin.",
      english: "I sent him (or her) an email this morning.",
      source_type: "book",
      annotations: { focus_spans: [{ text: "lui ai envoyé", role: "indirect_object_pronoun" }] },
      relations: { verbs: [makeVerbId("envoyer")], grammar_rules: [makeRuleId("indirect_object_pronouns_lui_leur")] },
      cloze_candidates: ["lui"],
      study: { difficulty: 2 },
      attestations: [{ source_type: "book", chapter_number: 21, page_printed: 170, context_type: "example_sentence" }],
    },
    {
      id: makeExampleId("double_pronoun", 1),
      type: "example",
      french: "Tu me prêtes ton vélo? — Oui, je te le prête avec plaisir.",
      english: "Will you lend me your bike? — Yes, I will lend it to you with pleasure.",
      source_type: "book",
      annotations: { focus_spans: [{ text: "te le prête", role: "double_pronoun" }] },
      relations: { verbs: [makeVerbId("prêter")], grammar_rules: [makeRuleId("double_object_pronoun_order_chart")] },
      cloze_candidates: ["te le"],
      study: { difficulty: 3 },
      attestations: [{ source_type: "book", chapter_number: 21, page_printed: 176, context_type: "example_sentence" }],
    },
    {
      id: makeExampleId("y_en", 1),
      type: "example",
      french: "Est-ce qu'il y a du café? — Oui, il y en a encore dans la cuisine.",
      english: "Is there any coffee? — Yes, there is still some in the kitchen.",
      source_type: "book",
      annotations: { focus_spans: [{ text: "il y en a", role: "y_en" }] },
      relations: { expressions: [makeExpressionId("il y en a")] },
      cloze_candidates: ["y en a"],
      study: { difficulty: 2 },
      attestations: [{ source_type: "book", chapter_number: 21, page_printed: 177, context_type: "example_sentence" }],
    },
  ];

  const chapter: Chapter = {
    id: chId,
    chapter_number: chNum,
    title: "All the pronouns",
    section_ids: sections.map((s) => s.id),
    concept_ids: ["concept_object_pronouns"],
    tense_ids: [],
    grammar_rule_ids: grammar_rules.map((r) => r.id),
    verb_ids: verbs.map((v) => v.id),
    conjugation_ids: conjugations.map((c) => c.id),
    expression_ids: expressions.map((e) => e.id),
    vocabulary_ids: vocabulary.map((v) => v.id),
    example_ids: examples.map((e) => e.id),
    exercise_ids: exercises.map((e) => e.id),
    source: { page_start_printed: 166, page_end_printed: 182, page_start_pdf: 180, page_end_pdf: 196 },
    tags: ["pronouns", "direct_object", "indirect_object", "pronoun_order", "y", "en", "disjunctive"],
  };

  return { chapter, sections, grammar_rules, verbs, conjugations, vocabulary, expressions, examples, exercises };
}

// =======================================================================
// CHAPTER 22: Adjectives and comparisons
// =======================================================================
export function buildChapter22(pages: RawPage[]): ChapterExtractionBundle {
  const chNum = 22;
  const chId = makeChapterId(chNum);
  const chPages = pages.filter((p) => (p.printed_page || 0) >= 183 && (p.printed_page || 0) <= 190);
  const exercises = extractChapterExercises(chNum, chPages);

  const sec1 = {
    id: makeSectionId(chNum, 1, "Agreement and placement of adjectives"),
    chapter_id: chId,
    order: 1,
    title: "Agreement and placement of adjectives (BAGS rule)",
    concept_ids: ["concept_adjective_agreement"],
    tense_ids: [],
    grammar_rule_ids: [makeRuleId("adjective_agreement_gender_number"), makeRuleId("bags_adjectives_before_noun")],
    verb_ids: [],
    expression_ids: [],
    vocabulary_ids: [],
    example_ids: [makeExampleId("adj_bags", 1)],
    exercise_ids: [exercises[0]?.id, exercises[1]?.id].filter(Boolean) as string[],
    source: { page_start_printed: 183, page_end_printed: 185, page_start_pdf: 197, page_end_pdf: 199 },
  };

  const sec2 = {
    id: makeSectionId(chNum, 2, "Comparatives and superlatives"),
    chapter_id: chId,
    order: 2,
    title: "Comparatives and superlatives",
    concept_ids: ["concept_adjective_agreement"],
    tense_ids: [],
    grammar_rule_ids: [makeRuleId("comparative_plus_moins_aussi"), makeRuleId("irregular_comparatives_meilleur_mieux")],
    verb_ids: [],
    expression_ids: [makeExpressionId("plus ... que"), makeExpressionId("moins ... que"), makeExpressionId("aussi ... que")],
    vocabulary_ids: [],
    example_ids: [makeExampleId("comp", 1)],
    exercise_ids: [exercises[2]?.id, exercises[3]?.id, exercises[4]?.id].filter(Boolean) as string[],
    source: { page_start_printed: 185, page_end_printed: 190, page_start_pdf: 199, page_end_pdf: 204 },
  };

  const sections = [sec1, sec2];

  const grammar_rules: GrammarRule[] = [
    {
      id: makeRuleId("adjective_agreement_gender_number"),
      type: "grammar_rule",
      title: "Adjective agreement in gender and number",
      short_label: "Adjective agreement",
      grammar_category: "adjectives",
      concept_ids: ["concept_adjective_agreement"],
      tense_ids: [],
      summary: "Adjectives agree in gender (+e for fem) and number (+s for plural) with the noun they modify.",
      explanation: "Special masculine forms before vowel/silent h: beau -> bel, nouveau -> nouvel, vieux -> vieil.\nFeminine forms: belle, nouvelle, vieille.",
      formation: null,
      usage_conditions: [],
      trigger_words: [],
      signal_words: [],
      exceptions: ["Compound color adjectives (bleu marine, vert clair) and invariable colors (marron, orange) do not agree."],
      restrictions: [],
      notes: [],
      common_mistakes: [{ wrong: "un beau homme", correct: "un bel homme", explanation: "Use bel before masculine noun starting with vowel." }],
      contrast_with_rule_ids: [],
      related_rule_ids: [],
      prerequisite_rule_ids: [],
      example_ids: [makeExampleId("adj_bags", 1)],
      exercise_ids: [],
      study: { learning_priority: 5, usefulness: 5, difficulty: 2 },
      attestations: [{ source_type: "book", chapter_number: 22, page_printed: 183, context_type: "grammar_explanation" }],
      tags: ["essential", "adjectives", "agreement"],
    },
    {
      id: makeRuleId("bags_adjectives_before_noun"),
      type: "grammar_rule",
      title: "Placement of adjectives: the BAGS rule (Beauty, Age, Goodness, Size)",
      short_label: "BAGS adjective placement",
      grammar_category: "adjectives",
      concept_ids: ["concept_adjective_agreement"],
      tense_ids: [],
      summary: "Most adjectives follow the noun in French, except BAGS adjectives which precede the noun.",
      explanation: "- Beauty: beau, joli\n- Age: jeune, vieux, nouveau\n- Goodness: bon, mauvais, meilleur, gentil\n- Size: grand, petit, gros, haut, long\nExample: 'une jolie maison', 'un vieux livre', 'une grande ville'.",
      formation: null,
      usage_conditions: ["Adjectives placed before noun"],
      trigger_words: ["beau", "joli", "jeune", "vieux", "nouveau", "bon", "mauvais", "grand", "petit"],
      signal_words: [],
      exceptions: [],
      restrictions: [],
      notes: ["Some adjectives change meaning based on position: grand homme (great man) vs homme grand (tall man); pauvre homme (pitiful) vs homme pauvre (poor)."],
      common_mistakes: [{ wrong: "une voiture belle", correct: "une belle voiture", explanation: "BAGS adjectives precede the noun." }],
      contrast_with_rule_ids: [],
      related_rule_ids: [],
      prerequisite_rule_ids: [],
      example_ids: [makeExampleId("adj_bags", 1)],
      exercise_ids: [],
      study: { learning_priority: 5, usefulness: 5, difficulty: 2 },
      attestations: [{ source_type: "book", chapter_number: 22, page_printed: 184, context_type: "grammar_explanation" }],
      tags: ["essential", "adjectives", "placement", "bags"],
    },
  ];

  const verbs: Verb[] = [];
  const conjugations: Conjugation[] = [];
  const expressions: Expression[] = [];
  const vocabulary: Vocabulary[] = [];

  const examples: Example[] = [
    {
      id: makeExampleId("adj_bags", 1),
      type: "example",
      french: "C'est un bel appartement dans un vieux quartier.",
      english: "It is a beautiful apartment in an old neighborhood.",
      source_type: "book",
      annotations: { focus_spans: [{ text: "bel", role: "bags_beauty" }, { text: "vieux", role: "bags_age" }] },
      relations: { grammar_rules: [makeRuleId("bags_adjectives_before_noun"), makeRuleId("adjective_agreement_gender_number")] },
      cloze_candidates: ["bel", "vieux"],
      study: { difficulty: 2 },
      attestations: [{ source_type: "book", chapter_number: 22, page_printed: 184, context_type: "example_sentence" }],
    },
  ];

  const chapter: Chapter = {
    id: chId,
    chapter_number: chNum,
    title: "Adjectives and comparisons",
    section_ids: sections.map((s) => s.id),
    concept_ids: ["concept_adjective_agreement"],
    tense_ids: [],
    grammar_rule_ids: grammar_rules.map((r) => r.id),
    verb_ids: verbs.map((v) => v.id),
    conjugation_ids: conjugations.map((c) => c.id),
    expression_ids: expressions.map((e) => e.id),
    vocabulary_ids: vocabulary.map((v) => v.id),
    example_ids: examples.map((e) => e.id),
    exercise_ids: exercises.map((e) => e.id),
    source: { page_start_printed: 183, page_end_printed: 190, page_start_pdf: 197, page_end_pdf: 204 },
    tags: ["adjectives", "comparisons", "bags", "agreement"],
  };

  return { chapter, sections, grammar_rules, verbs, conjugations, vocabulary, expressions, examples, exercises };
}

// =======================================================================
// CHAPTER 23: Demonstrative adjectives and pronouns
// =======================================================================
export function buildChapter23(pages: RawPage[]): ChapterExtractionBundle {
  const chNum = 23;
  const chId = makeChapterId(chNum);
  const chPages = pages.filter((p) => (p.printed_page || 0) >= 191 && (p.printed_page || 0) <= 201);
  const exercises = extractChapterExercises(chNum, chPages);

  const sec1 = {
    id: makeSectionId(chNum, 1, "Demonstrative and possessive adjectives"),
    chapter_id: chId,
    order: 1,
    title: "Demonstrative and possessive adjectives",
    concept_ids: ["concept_demonstratives_possessives"],
    tense_ids: [],
    grammar_rule_ids: [makeRuleId("demonstrative_adjectives_ce_cet_cette_ces"), makeRuleId("possessive_adjectives_rules")],
    verb_ids: [],
    expression_ids: [],
    vocabulary_ids: [],
    example_ids: [makeExampleId("dem_adj", 1)],
    exercise_ids: [exercises[0]?.id, exercises[1]?.id, exercises[2]?.id].filter(Boolean) as string[],
    source: { page_start_printed: 191, page_end_printed: 195, page_start_pdf: 205, page_end_pdf: 209 },
  };

  const sec2 = {
    id: makeSectionId(chNum, 2, "Possessive and demonstrative pronouns"),
    chapter_id: chId,
    order: 2,
    title: "Possessive pronouns and demonstrative pronouns",
    concept_ids: ["concept_demonstratives_possessives"],
    tense_ids: [],
    grammar_rule_ids: [makeRuleId("possessive_pronouns_chart"), makeRuleId("demonstrative_pronouns_celui_celle_ceux_celles")],
    verb_ids: [],
    expression_ids: [makeExpressionId("celui-ci"), makeExpressionId("celui-la")],
    vocabulary_ids: [],
    example_ids: [makeExampleId("dem_pron", 1)],
    exercise_ids: [exercises[3]?.id, exercises[4]?.id, exercises[5]?.id, exercises[6]?.id].filter(Boolean) as string[],
    source: { page_start_printed: 195, page_end_printed: 201, page_start_pdf: 209, page_end_pdf: 215 },
  };

  const sections = [sec1, sec2];

  const grammar_rules: GrammarRule[] = [
    {
      id: makeRuleId("demonstrative_adjectives_ce_cet_cette_ces"),
      type: "grammar_rule",
      title: "Demonstrative adjectives (ce, cet, cette, ces)",
      short_label: "Demonstrative adjectives",
      grammar_category: "adjectives",
      concept_ids: ["concept_demonstratives_possessives"],
      tense_ids: [],
      summary: "ce (masc. cons), cet (masc. vowel/silent h), cette (fem), ces (plural).",
      explanation: "- ce livre (this/that book)\n- cet hôtel / cet homme (before vowel/silent h)\n- cette table (this/that table)\n- ces livres / ces tables (these/those books/tables)\nAdd -ci (this) or -là (that) to emphasize proximity: 'ce livre-ci', 'ce livre-là'.",
      formation: null,
      usage_conditions: [],
      trigger_words: ["ce", "cet", "cette", "ces"],
      signal_words: [],
      exceptions: [],
      restrictions: [],
      notes: [],
      common_mistakes: [{ wrong: "ce homme", correct: "cet homme", explanation: "Use cet before masculine noun beginning with vowel or silent h." }],
      contrast_with_rule_ids: [],
      related_rule_ids: [],
      prerequisite_rule_ids: [],
      example_ids: [makeExampleId("dem_adj", 1)],
      exercise_ids: [],
      study: { learning_priority: 5, usefulness: 5, difficulty: 1 },
      attestations: [{ source_type: "book", chapter_number: 23, page_printed: 191, context_type: "grammar_explanation" }],
      tags: ["essential", "demonstratives"],
    },
    {
      id: makeRuleId("demonstrative_pronouns_celui_celle_ceux_celles"),
      type: "grammar_rule",
      title: "Demonstrative pronouns (celui, celle, ceux, celles)",
      short_label: "Demonstrative pronouns",
      grammar_category: "pronouns",
      concept_ids: ["concept_demonstratives_possessives"],
      tense_ids: [],
      summary: "Replace demonstrative adjective + noun: celui (m.sg), celle (f.sg), ceux (m.pl), celles (f.pl).",
      explanation: "Demonstrative pronouns cannot stand alone; they must be followed by:\n1. -ci or -là: 'celui-ci', 'celle-là'\n2. 'de' + possessor: 'celui de Pierre' (Pierre's one)\n3. A relative pronoun (qui, que, dont): 'celui qui parle' (the one who is speaking).",
      formation: null,
      usage_conditions: ["Replacing a specific noun previously mentioned"],
      trigger_words: ["celui", "celle", "ceux", "celles"],
      signal_words: [],
      exceptions: [],
      restrictions: ["Never used alone without -ci/-là, de, or relative clause."],
      notes: [],
      common_mistakes: [],
      contrast_with_rule_ids: [],
      related_rule_ids: [],
      prerequisite_rule_ids: [],
      example_ids: [makeExampleId("dem_pron", 1)],
      exercise_ids: [],
      study: { learning_priority: 4, usefulness: 5, difficulty: 3 },
      attestations: [{ source_type: "book", chapter_number: 23, page_printed: 198, context_type: "grammar_explanation" }],
      tags: ["demonstrative_pronouns", "pronouns"],
    },
  ];

  const verbs: Verb[] = [];
  const conjugations: Conjugation[] = [];
  const expressions: Expression[] = [];
  const vocabulary: Vocabulary[] = [];

  const examples: Example[] = [
    {
      id: makeExampleId("dem_adj", 1),
      type: "example",
      french: "Cet endroit est magnifique à cette saison.",
      english: "This place is magnificent at this time of year.",
      source_type: "book",
      annotations: { focus_spans: [{ text: "Cet endroit", role: "masc_vowel" }, { text: "cette saison", role: "fem_noun" }] },
      relations: { grammar_rules: [makeRuleId("demonstrative_adjectives_ce_cet_cette_ces")] },
      cloze_candidates: ["Cet", "cette"],
      study: { difficulty: 1 },
      attestations: [{ source_type: "book", chapter_number: 23, page_printed: 191, context_type: "example_sentence" }],
    },
    {
      id: makeExampleId("dem_pron", 1),
      type: "example",
      french: "Quelle voiture préférez-vous? — Celle de mon frère.",
      english: "Which car do you prefer? — The one of my brother / My brother's.",
      source_type: "book",
      annotations: { focus_spans: [{ text: "Celle de", role: "demonstrative_pronoun" }] },
      relations: { grammar_rules: [makeRuleId("demonstrative_pronouns_celui_celle_ceux_celles")] },
      cloze_candidates: ["Celle"],
      study: { difficulty: 2 },
      attestations: [{ source_type: "book", chapter_number: 23, page_printed: 198, context_type: "example_sentence" }],
    },
  ];

  const chapter: Chapter = {
    id: chId,
    chapter_number: chNum,
    title: "Demonstrative adjectives and pronouns",
    section_ids: sections.map((s) => s.id),
    concept_ids: ["concept_demonstratives_possessives"],
    tense_ids: [],
    grammar_rule_ids: grammar_rules.map((r) => r.id),
    verb_ids: verbs.map((v) => v.id),
    conjugation_ids: conjugations.map((c) => c.id),
    expression_ids: expressions.map((e) => e.id),
    vocabulary_ids: vocabulary.map((v) => v.id),
    example_ids: examples.map((e) => e.id),
    exercise_ids: exercises.map((e) => e.id),
    source: { page_start_printed: 191, page_end_printed: 201, page_start_pdf: 205, page_end_pdf: 215 },
    tags: ["demonstratives", "possessives", "pronouns"],
  };

  return { chapter, sections, grammar_rules, verbs, conjugations, vocabulary, expressions, examples, exercises };
}

// =======================================================================
// CHAPTER 24: Relative pronouns
// =======================================================================
export function buildChapter24(pages: RawPage[]): ChapterExtractionBundle {
  const chNum = 24;
  const chId = makeChapterId(chNum);
  const chPages = pages.filter((p) => (p.printed_page || 0) >= 202 && (p.printed_page || 0) <= 211);
  const exercises = extractChapterExercises(chNum, chPages);

  const sec1 = {
    id: makeSectionId(chNum, 1, "Qui and Que"),
    chapter_id: chId,
    order: 1,
    title: "Qui and Que",
    concept_ids: ["concept_relative_pronouns"],
    tense_ids: [],
    grammar_rule_ids: [makeRuleId("relative_pronouns_qui_vs_que")],
    verb_ids: [],
    expression_ids: [],
    vocabulary_ids: [],
    example_ids: [makeExampleId("qui_que", 1)],
    exercise_ids: [exercises[0]?.id, exercises[1]?.id].filter(Boolean) as string[],
    source: { page_start_printed: 202, page_end_printed: 204, page_start_pdf: 216, page_end_pdf: 218 },
  };

  const sec2 = {
    id: makeSectionId(chNum, 2, "Lequel, Ou, Dont"),
    chapter_id: chId,
    order: 2,
    title: "Lequel, Où, and Dont",
    concept_ids: ["concept_relative_pronouns"],
    tense_ids: [],
    grammar_rule_ids: [makeRuleId("relative_pronoun_dont_rules"), makeRuleId("relative_pronoun_ou_and_lequel")],
    verb_ids: [],
    expression_ids: [makeExpressionId("ce dont j'ai besoin"), makeExpressionId("le jour ou")],
    vocabulary_ids: [],
    example_ids: [makeExampleId("dont", 1), makeExampleId("ou", 1)],
    exercise_ids: [exercises[2]?.id, exercises[3]?.id, exercises[4]?.id].filter(Boolean) as string[],
    source: { page_start_printed: 205, page_end_printed: 209, page_start_pdf: 219, page_end_pdf: 223 },
  };

  const sec3 = {
    id: makeSectionId(chNum, 3, "Ce que, ce qui, ce dont, ce a quoi"),
    chapter_id: chId,
    order: 3,
    title: "Indefinite relative pronouns: ce que, ce qui, ce dont, ce à quoi",
    concept_ids: ["concept_relative_pronouns"],
    tense_ids: [],
    grammar_rule_ids: [makeRuleId("indefinite_relative_pronouns_ce_qui_ce_que_ce_dont")],
    verb_ids: [],
    expression_ids: [makeExpressionId("ce qui me plait"), makeExpressionId("ce que je pense"), makeExpressionId("ce a quoi je pense")],
    vocabulary_ids: [],
    example_ids: [makeExampleId("ce_que", 1)],
    exercise_ids: [exercises[5]?.id, exercises[6]?.id, exercises[7]?.id].filter(Boolean) as string[],
    source: { page_start_printed: 209, page_end_printed: 211, page_start_pdf: 223, page_end_pdf: 225 },
  };

  const sections = [sec1, sec2, sec3];

  const grammar_rules: GrammarRule[] = [
    {
      id: makeRuleId("relative_pronouns_qui_vs_que"),
      type: "grammar_rule",
      title: "Relative pronouns: Qui (subject) versus Que (direct object)",
      short_label: "qui vs que",
      grammar_category: "relative_pronouns",
      concept_ids: ["concept_relative_pronouns"],
      tense_ids: [],
      summary: "'Qui' is followed by a verb (subject). 'Que' (or qu') is followed by a subject + verb (direct object).",
      explanation: "- Qui: 'L'homme qui parle' (The man who is speaking - qui is the subject of parle).\n- Que: 'Le livre que je lis' (The book that I am reading - je is subject, que is direct object).\nNote: 'qui' never elides to qu', only 'que' elides to 'qu'' before a vowel.",
      formation: null,
      usage_conditions: [],
      trigger_words: ["qui", "que", "qu'"],
      signal_words: [],
      exceptions: [],
      restrictions: [],
      notes: [],
      common_mistakes: [{ wrong: "L'homme qu'arrive", correct: "L'homme qui arrive", explanation: "Qui never elides before a vowel." }],
      contrast_with_rule_ids: [],
      related_rule_ids: [],
      prerequisite_rule_ids: [],
      example_ids: [makeExampleId("qui_que", 1)],
      exercise_ids: [],
      study: { learning_priority: 5, usefulness: 5, difficulty: 2 },
      attestations: [{ source_type: "book", chapter_number: 24, page_printed: 202, context_type: "grammar_explanation" }],
      tags: ["essential", "relative_pronouns"],
    },
    {
      id: makeRuleId("relative_pronoun_dont_rules"),
      type: "grammar_rule",
      title: "The relative pronoun dont (replacing de + noun)",
      short_label: "dont",
      grammar_category: "relative_pronouns",
      concept_ids: ["concept_relative_pronouns"],
      tense_ids: [],
      summary: "'Dont' replaces 'de + noun' (expressing of which, whose, about which).",
      explanation: "Used whenever the verb, adjective, or noun in the relative clause takes 'de':\n- parler de -> 'Le film dont je parle'\n- avoir besoin de -> 'Ce dont j'ai besoin'\n- être fier de -> 'L'enfant dont il est fier'\n- possession (whose) -> 'L'auteur dont j'ai lu le livre'.",
      formation: null,
      usage_conditions: ["Relating verbs/expressions requiring 'de'"],
      trigger_words: ["dont"],
      signal_words: [],
      exceptions: [],
      restrictions: [],
      notes: ["Do not repeat 'de' or possessive after dont: 'L'homme dont le fils est médecin' (not 'dont son fils')."],
      common_mistakes: [{ wrong: "L'homme dont son fils...", correct: "L'homme dont le fils...", explanation: "Use definite article, not possessive, with dont." }],
      contrast_with_rule_ids: [],
      related_rule_ids: [],
      prerequisite_rule_ids: [],
      example_ids: [makeExampleId("dont", 1)],
      exercise_ids: [],
      study: { learning_priority: 5, usefulness: 5, difficulty: 3 },
      attestations: [{ source_type: "book", chapter_number: 24, page_printed: 207, context_type: "grammar_explanation" }],
      tags: ["essential", "relative_pronouns"],
    },
  ];

  const verbs: Verb[] = [];
  const conjugations: Conjugation[] = [];
  const expressions: Expression[] = [];
  const vocabulary: Vocabulary[] = [];

  const examples: Example[] = [
    {
      id: makeExampleId("qui_que", 1),
      type: "example",
      french: "C'est l'étudiant qui a gagné le concours et que tout le monde admire.",
      english: "It is the student who won the contest and whom everyone admires.",
      source_type: "book",
      annotations: { focus_spans: [{ text: "qui a gagné", role: "subject_relative" }, { text: "que tout le monde admire", role: "object_relative" }] },
      relations: { grammar_rules: [makeRuleId("relative_pronouns_qui_vs_que")] },
      cloze_candidates: ["qui", "que"],
      study: { difficulty: 2 },
      attestations: [{ source_type: "book", chapter_number: 24, page_printed: 202, context_type: "example_sentence" }],
    },
    {
      id: makeExampleId("dont", 1),
      type: "example",
      french: "Voici le roman dont tout le monde parle.",
      english: "Here is the novel that everyone is talking about.",
      source_type: "book",
      annotations: { focus_spans: [{ text: "dont", role: "dont_relative" }] },
      relations: { grammar_rules: [makeRuleId("relative_pronoun_dont_rules")] },
      cloze_candidates: ["dont"],
      study: { difficulty: 2 },
      attestations: [{ source_type: "book", chapter_number: 24, page_printed: 207, context_type: "example_sentence" }],
    },
    {
      id: makeExampleId("ce_que", 1),
      type: "example",
      french: "Ce qui m'intéresse, c'est ce que vous pensez de ce projet.",
      english: "What interests me is what you think of this project.",
      source_type: "book",
      annotations: { focus_spans: [{ text: "Ce qui", role: "subject" }, { text: "ce que", role: "object" }] },
      relations: { grammar_rules: [makeRuleId("relative_pronouns_qui_vs_que")] },
      cloze_candidates: ["Ce qui", "ce que"],
      study: { difficulty: 2 },
      attestations: [{ source_type: "book", chapter_number: 24, page_printed: 209, context_type: "example_sentence" }],
    },
  ];

  const chapter: Chapter = {
    id: chId,
    chapter_number: chNum,
    title: "Relative pronouns",
    section_ids: sections.map((s) => s.id),
    concept_ids: ["concept_relative_pronouns"],
    tense_ids: [],
    grammar_rule_ids: grammar_rules.map((r) => r.id),
    verb_ids: verbs.map((v) => v.id),
    conjugation_ids: conjugations.map((c) => c.id),
    expression_ids: expressions.map((e) => e.id),
    vocabulary_ids: vocabulary.map((v) => v.id),
    example_ids: examples.map((e) => e.id),
    exercise_ids: exercises.map((e) => e.id),
    source: { page_start_printed: 202, page_end_printed: 211, page_start_pdf: 216, page_end_pdf: 225 },
    tags: ["relative_pronouns", "qui", "que", "dont", "ou", "ce_qui", "ce_que"],
  };

  return { chapter, sections, grammar_rules, verbs, conjugations, vocabulary, expressions, examples, exercises };
}

// =======================================================================
// CHAPTER 25: Adverbs of time, frequency, location
// =======================================================================
export function buildChapter25(pages: RawPage[]): ChapterExtractionBundle {
  const chNum = 25;
  const chId = makeChapterId(chNum);
  const chPages = pages.filter((p) => (p.printed_page || 0) >= 212 && (p.printed_page || 0) <= 220);
  const exercises = extractChapterExercises(chNum, chPages);

  const sec1 = {
    id: makeSectionId(chNum, 1, "Adverbs and expressions of time"),
    chapter_id: chId,
    order: 1,
    title: "Adverbs and expressions of time and frequency",
    concept_ids: [],
    tense_ids: [],
    grammar_rule_ids: [makeRuleId("time_and_frequency_adverbs_placement")],
    verb_ids: [],
    expression_ids: [makeExpressionId("de temps en temps"), makeExpressionId("tout a l'heure"), makeExpressionId("en ce moment")],
    vocabulary_ids: [],
    example_ids: [makeExampleId("adv_time", 1)],
    exercise_ids: [exercises[0]?.id, exercises[1]?.id].filter(Boolean) as string[],
    source: { page_start_printed: 212, page_end_printed: 218, page_start_pdf: 226, page_end_pdf: 232 },
  };

  const sec2 = {
    id: makeSectionId(chNum, 2, "Question words and location adverbs"),
    chapter_id: chId,
    order: 2,
    title: "Interrogative forms; question words and adverbs of location",
    concept_ids: [],
    tense_ids: [],
    grammar_rule_ids: [makeRuleId("question_words_ou_quand_comment_pourquoi")],
    verb_ids: [],
    expression_ids: [],
    vocabulary_ids: [],
    example_ids: [makeExampleId("adv_loc", 1)],
    exercise_ids: [exercises[2]?.id, exercises[3]?.id].filter(Boolean) as string[],
    source: { page_start_printed: 219, page_end_printed: 220, page_start_pdf: 233, page_end_pdf: 234 },
  };

  const sections = [sec1, sec2];

  const grammar_rules: GrammarRule[] = [
    {
      id: makeRuleId("time_and_frequency_adverbs_placement"),
      type: "grammar_rule",
      title: "Placement of adverbs of frequency and time",
      short_label: "Adverb placement",
      grammar_category: "adverbs",
      concept_ids: [],
      tense_ids: [],
      summary: "Short adverbs of frequency (souvent, toujours, jamais, bien, mal) immediately follow the conjugated verb; in compound tenses they sit between auxiliary and past participle.",
      explanation: "- Simple tense: 'Il parle souvent français' (after verb).\n- Compound tense: 'Il a souvent parlé français' (between auxiliary and participle).\n- Time expressions (hier, demain, ce matin) usually sit at beginning or end of sentence.",
      formation: null,
      usage_conditions: [],
      trigger_words: ["souvent", "toujours", "jamais", "parfois", "rarement", "déjà"],
      signal_words: [],
      exceptions: [],
      restrictions: [],
      notes: [],
      common_mistakes: [{ wrong: "Il souvent mange", correct: "Il mange souvent", explanation: "Adverbs follow conjugated verb in French." }],
      contrast_with_rule_ids: [],
      related_rule_ids: [],
      prerequisite_rule_ids: [],
      example_ids: [makeExampleId("adv_time", 1)],
      exercise_ids: [],
      study: { learning_priority: 5, usefulness: 5, difficulty: 2 },
      attestations: [{ source_type: "book", chapter_number: 25, page_printed: 212, context_type: "grammar_explanation" }],
      tags: ["essential", "adverbs", "syntax"],
    },
    {
      id: makeRuleId("question_words_ou_quand_comment_pourquoi"),
      type: "grammar_rule",
      title: "Interrogative question words (Où, Quand, Comment, Pourquoi, Combien)",
      short_label: "Question words",
      grammar_category: "interrogation",
      concept_ids: ["concept_interrogation"],
      tense_ids: [],
      summary: "Où (where), Quand (when), Comment (how), Pourquoi (why), Combien (how much/many), Qui (who), Que/Qu' (what).",
      explanation: "Combined with est-ce que or inversion:\n- 'Où habitez-vous?' / 'Où est-ce que vous habitez?'\n- 'Pourquoi pars-tu?' / 'Pourquoi est-ce que tu pars?'",
      formation: null,
      usage_conditions: [],
      trigger_words: ["où", "quand", "comment", "pourquoi", "combien"],
      signal_words: [],
      exceptions: [],
      restrictions: [],
      notes: [],
      common_mistakes: [],
      contrast_with_rule_ids: [],
      related_rule_ids: [],
      prerequisite_rule_ids: [],
      example_ids: [makeExampleId("adv_loc", 1)],
      exercise_ids: [],
      study: { learning_priority: 5, usefulness: 5, difficulty: 1 },
      attestations: [{ source_type: "book", chapter_number: 25, page_printed: 219, context_type: "grammar_explanation" }],
      tags: ["essential", "questions", "adverbs"],
    },
  ];

  const verbs: Verb[] = [];
  const conjugations: Conjugation[] = [];
  const expressions: Expression[] = [];
  const vocabulary: Vocabulary[] = [];

  const examples: Example[] = [
    {
      id: makeExampleId("adv_time", 1),
      type: "example",
      french: "Nous avons toujours aimé nous promener le long de la Seine.",
      english: "We have always loved taking walks along the Seine.",
      source_type: "book",
      annotations: { focus_spans: [{ text: "toujours", role: "adverb_frequency" }] },
      relations: { grammar_rules: [makeRuleId("time_and_frequency_adverbs_placement")] },
      cloze_candidates: ["toujours"],
      study: { difficulty: 1 },
      attestations: [{ source_type: "book", chapter_number: 25, page_printed: 212, context_type: "example_sentence" }],
    },
    {
      id: makeExampleId("adv_loc", 1),
      type: "example",
      french: "Où avez-vous passé vos dernières vacances?",
      english: "Where did you spend your last vacation?",
      source_type: "book",
      annotations: { focus_spans: [{ text: "Où", role: "question_word" }] },
      relations: { grammar_rules: [makeRuleId("question_words_ou_quand_comment_pourquoi")] },
      cloze_candidates: ["Où"],
      study: { difficulty: 1 },
      attestations: [{ source_type: "book", chapter_number: 25, page_printed: 219, context_type: "example_sentence" }],
    },
  ];

  const chapter: Chapter = {
    id: chId,
    chapter_number: chNum,
    title: "Adverbs and expressions of time, frequency, and location",
    section_ids: sections.map((s) => s.id),
    concept_ids: [],
    tense_ids: [],
    grammar_rule_ids: grammar_rules.map((r) => r.id),
    verb_ids: verbs.map((v) => v.id),
    conjugation_ids: conjugations.map((c) => c.id),
    expression_ids: expressions.map((e) => e.id),
    vocabulary_ids: vocabulary.map((v) => v.id),
    example_ids: examples.map((e) => e.id),
    exercise_ids: exercises.map((e) => e.id),
    source: { page_start_printed: 212, page_end_printed: 220, page_start_pdf: 226, page_end_pdf: 234 },
    tags: ["adverbs", "time", "frequency", "location", "questions"],
  };

  return { chapter, sections, grammar_rules, verbs, conjugations, vocabulary, expressions, examples, exercises };
}

// =======================================================================
// CHAPTER 26: Numbers
// =======================================================================
export function buildChapter26(pages: RawPage[]): ChapterExtractionBundle {
  const chNum = 26;
  const chId = makeChapterId(chNum);
  const chPages = pages.filter((p) => (p.printed_page || 0) >= 221 && (p.printed_page || 0) <= 229);
  const exercises = extractChapterExercises(chNum, chPages);

  const sec1 = {
    id: makeSectionId(chNum, 1, "The numbers 0 to 50 and ordinals"),
    chapter_id: chId,
    order: 1,
    title: "The numbers 0 to 50 and ordinal numbers",
    concept_ids: [],
    tense_ids: [],
    grammar_rule_ids: [makeRuleId("cardinal_and_ordinal_numbers_rules")],
    verb_ids: [],
    expression_ids: [],
    vocabulary_ids: [],
    example_ids: [makeExampleId("numbers", 1)],
    exercise_ids: [exercises[0]?.id, exercises[1]?.id].filter(Boolean) as string[],
    source: { page_start_printed: 221, page_end_printed: 224, page_start_pdf: 235, page_end_pdf: 238 },
  };

  const sec2 = {
    id: makeSectionId(chNum, 2, "Numbers 50 and greater"),
    chapter_id: chId,
    order: 2,
    title: "Numbers 50 and greater (soixante-dix, quatre-vingts, cent, mille)",
    concept_ids: [],
    tense_ids: [],
    grammar_rule_ids: [makeRuleId("french_numbers_70_80_90_rules")],
    verb_ids: [],
    expression_ids: [],
    vocabulary_ids: [],
    example_ids: [makeExampleId("large_numbers", 1)],
    exercise_ids: [exercises[2]?.id, exercises[3]?.id, exercises[4]?.id].filter(Boolean) as string[],
    source: { page_start_printed: 224, page_end_printed: 229, page_start_pdf: 238, page_end_pdf: 243 },
  };

  const sections = [sec1, sec2];

  const grammar_rules: GrammarRule[] = [
    {
      id: makeRuleId("cardinal_and_ordinal_numbers_rules"),
      type: "grammar_rule",
      title: "Cardinal and ordinal numbers in French",
      short_label: "Numbers and ordinals",
      grammar_category: "numbers",
      concept_ids: [],
      tense_ids: [],
      summary: "Ordinals: premier/première, deuxième, troisième, etc. (add -ième to cardinal number).",
      explanation: "Dates use cardinal numbers in French, except for the first of the month which uses 'premier': 'le premier mai' vs 'le deux mai'.",
      formation: null,
      usage_conditions: [],
      trigger_words: ["premier", "deuxième", "troisième"],
      signal_words: [],
      exceptions: ["un -> premier/première; cinq -> cinquième; neuf -> neuvième"],
      restrictions: [],
      notes: [],
      common_mistakes: [{ wrong: "le deux mai (for 1st)", correct: "le premier mai", explanation: "Only the 1st of the month uses ordinal premier." }],
      contrast_with_rule_ids: [],
      related_rule_ids: [],
      prerequisite_rule_ids: [],
      example_ids: [makeExampleId("numbers", 1)],
      exercise_ids: [],
      study: { learning_priority: 4, usefulness: 5, difficulty: 1 },
      attestations: [{ source_type: "book", chapter_number: 26, page_printed: 221, context_type: "grammar_explanation" }],
      tags: ["numbers", "ordinals"],
    },
    {
      id: makeRuleId("french_numbers_70_80_90_rules"),
      type: "grammar_rule",
      title: "French counting system for 70, 80, and 90",
      short_label: "Numbers 70, 80, 90",
      grammar_category: "numbers",
      concept_ids: [],
      tense_ids: [],
      summary: "70 = soixante-dix; 71 = soixante et onze; 80 = quatre-vingts; 81 = quatre-vingt-un; 90 = quatre-vingt-dix; 91 = quatre-vingt-onze.",
      explanation: "- 70s: soixante-dix, soixante et onze, soixante-douze...\n- 80s: quatre-vingts (note the 's' on vingt only when not followed by another number), quatre-vingt-un...\n- 90s: quatre-vingt-dix, quatre-vingt-onze, quatre-vingt-douze...\n- 'mille' is invariable (deux mille, never milles).",
      formation: null,
      usage_conditions: [],
      trigger_words: ["soixante-dix", "quatre-vingts", "quatre-vingt-dix", "cent", "mille"],
      signal_words: [],
      exceptions: [],
      restrictions: [],
      notes: [],
      common_mistakes: [{ wrong: "quatre-vingts-un", correct: "quatre-vingt-un", explanation: "Drop the 's' on quatre-vingts when another number follows." }],
      contrast_with_rule_ids: [],
      related_rule_ids: [],
      prerequisite_rule_ids: [],
      example_ids: [makeExampleId("large_numbers", 1)],
      exercise_ids: [],
      study: { learning_priority: 5, usefulness: 5, difficulty: 2 },
      attestations: [{ source_type: "book", chapter_number: 26, page_printed: 224, context_type: "grammar_explanation" }],
      tags: ["essential", "numbers"],
    },
  ];

  const verbs: Verb[] = [];
  const conjugations: Conjugation[] = [];
  const expressions: Expression[] = [];
  const vocabulary: Vocabulary[] = [];

  const examples: Example[] = [
    {
      id: makeExampleId("numbers", 1),
      type: "example",
      french: "Nous habitons au troisième étage d'un immeuble haussmannien.",
      english: "We live on the third floor of a Haussmannian building.",
      source_type: "book",
      annotations: { focus_spans: [{ text: "troisième", role: "ordinal" }] },
      relations: { grammar_rules: [makeRuleId("cardinal_and_ordinal_numbers_rules")] },
      cloze_candidates: ["troisième"],
      study: { difficulty: 1 },
      attestations: [{ source_type: "book", chapter_number: 26, page_printed: 222, context_type: "example_sentence" }],
    },
    {
      id: makeExampleId("large_numbers", 1),
      type: "example",
      french: "Ce livre coûte quatre-vingt-dix-neuf euros.",
      english: "This book costs ninety-nine euros.",
      source_type: "book",
      annotations: { focus_spans: [{ text: "quatre-vingt-dix-neuf", role: "number_99" }] },
      relations: { grammar_rules: [makeRuleId("french_numbers_70_80_90_rules")] },
      cloze_candidates: ["quatre-vingt-dix-neuf"],
      study: { difficulty: 2 },
      attestations: [{ source_type: "book", chapter_number: 26, page_printed: 225, context_type: "example_sentence" }],
    },
  ];

  const chapter: Chapter = {
    id: chId,
    chapter_number: chNum,
    title: "Numbers",
    section_ids: sections.map((s) => s.id),
    concept_ids: [],
    tense_ids: [],
    grammar_rule_ids: grammar_rules.map((r) => r.id),
    verb_ids: verbs.map((v) => v.id),
    conjugation_ids: conjugations.map((c) => c.id),
    expression_ids: expressions.map((e) => e.id),
    vocabulary_ids: vocabulary.map((v) => v.id),
    example_ids: examples.map((e) => e.id),
    exercise_ids: exercises.map((e) => e.id),
    source: { page_start_printed: 221, page_end_printed: 229, page_start_pdf: 235, page_end_pdf: 243 },
    tags: ["numbers", "cardinals", "ordinals"],
  };

  return { chapter, sections, grammar_rules, verbs, conjugations, vocabulary, expressions, examples, exercises };
}

// =======================================================================
// CHAPTER 27: Pot pourri
// =======================================================================
export function buildChapter27(pages: RawPage[]): ChapterExtractionBundle {
  const chNum = 27;
  const chId = makeChapterId(chNum);
  const chPages = pages.filter((p) => (p.printed_page || 0) >= 230 && (p.printed_page || 0) <= 235);
  const exercises = extractChapterExercises(chNum, chPages);

  const sec1 = {
    id: makeSectionId(chNum, 1, "Verbs that use different prepositions"),
    chapter_id: chId,
    order: 1,
    title: "Verbs that use different prepositions",
    concept_ids: ["concept_verb_preposition_patterns"],
    tense_ids: [],
    grammar_rule_ids: [makeRuleId("verbs_with_varying_preposition_meanings")],
    verb_ids: [makeVerbId("penser"), makeVerbId("manquer"), makeVerbId("servir"), makeVerbId("jouer")],
    expression_ids: [
      makeExpressionId("penser a"),
      makeExpressionId("penser de"),
      makeExpressionId("manquer de"),
      makeExpressionId("manquer a"),
      makeExpressionId("jouer a"),
      makeExpressionId("jouer de"),
    ],
    vocabulary_ids: [],
    example_ids: [makeExampleId("penser_prep", 1), makeExampleId("manquer_prep", 1)],
    exercise_ids: [exercises[0]?.id, exercises[1]?.id].filter(Boolean) as string[],
    source: { page_start_printed: 230, page_end_printed: 233, page_start_pdf: 244, page_end_pdf: 247 },
  };

  const sec2 = {
    id: makeSectionId(chNum, 2, "Whatever, whenever, wherever, whoever"),
    chapter_id: chId,
    order: 2,
    title: "Whatever, whenever, wherever, whoever and Avoir beau",
    concept_ids: [],
    tense_ids: [],
    grammar_rule_ids: [makeRuleId("indefinite_n_importe_and_avoir_beau")],
    verb_ids: [],
    expression_ids: [
      makeExpressionId("n'importe quoi"),
      makeExpressionId("n'importe qui"),
      makeExpressionId("n'importe ou"),
      makeExpressionId("n'importe quand"),
      makeExpressionId("avoir beau + infinitif"),
      makeExpressionId("quitte a + infinitif"),
    ],
    vocabulary_ids: [],
    example_ids: [makeExampleId("avoir_beau", 1)],
    exercise_ids: [exercises[2]?.id, exercises[3]?.id].filter(Boolean) as string[],
    source: { page_start_printed: 233, page_end_printed: 235, page_start_pdf: 247, page_end_pdf: 249 },
  };

  const sections = [sec1, sec2];

  const grammar_rules: GrammarRule[] = [
    {
      id: makeRuleId("verbs_with_varying_preposition_meanings"),
      type: "grammar_rule",
      title: "Verbs with different prepositions carrying different meanings",
      short_label: "Preposition meaning shifts",
      grammar_category: "verb_government",
      concept_ids: ["concept_verb_preposition_patterns"],
      tense_ids: [],
      summary: "penser à (think about) vs penser de (have an opinion on); manquer à (miss someone) vs manquer de (lack); jouer à (sports/games) vs jouer de (musical instruments).",
      explanation: "- Penser à: 'Je pense à mes vacances' (Thinking about)\n- Penser de: 'Que pensez-vous de ce film?' (What is your opinion of...)\n- Manquer de: 'Il manque d'argent' (He lacks money)\n- Manquer à: 'Tu me manques' (You are missing to me = I miss you)\n- Jouer à: 'jouer au tennis', 'jouer aux échecs'\n- Jouer de: 'jouer du piano', 'jouer de la guitare'.",
      formation: null,
      usage_conditions: [],
      trigger_words: ["penser à", "penser de", "manquer à", "manquer de", "jouer à", "jouer de"],
      signal_words: [],
      exceptions: [],
      restrictions: [],
      notes: [],
      common_mistakes: [{ wrong: "Tu me manques (misunderstood as you miss me)", correct: "Tu me manques = I miss you (literally: you are missing to me)", explanation: "The person missed is the subject." }],
      contrast_with_rule_ids: [],
      related_rule_ids: [],
      prerequisite_rule_ids: [],
      example_ids: [makeExampleId("penser_prep", 1), makeExampleId("manquer_prep", 1)],
      exercise_ids: [],
      study: { learning_priority: 5, usefulness: 5, difficulty: 3 },
      attestations: [{ source_type: "book", chapter_number: 27, page_printed: 230, context_type: "grammar_explanation" }],
      tags: ["essential", "verb_prepositions", "collocations"],
    },
    {
      id: makeRuleId("indefinite_n_importe_and_avoir_beau"),
      type: "grammar_rule",
      title: "Indefinite n'importe expressions and Avoir beau + infinitive",
      short_label: "n'importe & avoir beau",
      grammar_category: "idiomatic_construction",
      concept_ids: [],
      tense_ids: [],
      summary: "1. n'importe quoi (whatever), n'importe qui (whoever), n'importe où (wherever), n'importe quand (whenever). 2. avoir beau + infinitive = however much one tries / in vain.",
      explanation: "- 'J'ai beau chercher, je ne trouve pas mes clés' (No matter how much I look / Even though I look everywhere, I can't find my keys).\n- 'Quitte à' = even if it means / at the risk of: 'Quitte à rater mon train, je dois lui parler'.",
      formation: {
        steps: ["Conjugate avoir + beau + infinitive of action verb"],
        patterns: ["[SUBJECT] + avoir beau + [INFINITIF]"],
        endings: {},
      },
      usage_conditions: ["Concession and futile efforts"],
      trigger_words: ["avoir beau", "n'importe quoi", "n'importe qui", "quitte à"],
      signal_words: [],
      exceptions: [],
      restrictions: [],
      notes: [],
      common_mistakes: [],
      contrast_with_rule_ids: [],
      related_rule_ids: [],
      prerequisite_rule_ids: [],
      example_ids: [makeExampleId("avoir_beau", 1)],
      exercise_ids: [],
      study: { learning_priority: 5, usefulness: 5, difficulty: 2 },
      attestations: [{ source_type: "book", chapter_number: 27, page_printed: 233, context_type: "grammar_explanation" }],
      tags: ["essential", "idioms", "concession"],
    },
  ];

  const verbs: Verb[] = [];
  const conjugations: Conjugation[] = [];
  const expressions: Expression[] = [
    {
      id: makeExpressionId("avoir beau + infinitif"),
      type: "expression",
      expression_type: "verb_pattern",
      canonical_form: "avoir beau + infinitif",
      display_form: "avoir beau + infinitif",
      english: ["no matter how much one tries", "in vain", "try as one might"],
      base_verb_ids: [makeVerbId("avoir")],
      related_vocabulary_ids: [],
      productive: true,
      collocation_strength: "strong",
      pattern: "avoir beau [INFINITIVE]",
      pattern_slots: [{ name: "action", display: "infinitif", type: "verb_infinitive", required: true }],
      transformations: [],
      variants: [],
      function_ids: [],
      usage_notes: ["High-value French concession construction"],
      restrictions: [],
      common_mistakes: [],
      example_ids: [makeExampleId("avoir_beau", 1)],
      study: { learning_priority: 5, usefulness: 5, difficulty: 2 },
      usage: { register: "neutral", spoken_written: "both", contexts: ["conversation", "descriptions"] },
      frequency: { book_occurrences: 4 },
      origin: { source_type: "book", created_by: "extraction", derived_from_ids: [] },
      attestations: [{ source_type: "book", chapter_number: 27, page_printed: 234, context_type: "grammar_explanation" }],
      relations: { grammar_rules: [makeRuleId("indefinite_n_importe_and_avoir_beau")] },
      tags: ["essential", "idiom", "verb_pattern"],
    },
  ];
  const vocabulary: Vocabulary[] = [];

  const examples: Example[] = [
    {
      id: makeExampleId("penser_prep", 1),
      type: "example",
      french: "Que pensez-vous de cette proposition?",
      english: "What do you think of this proposal? (What is your opinion?)",
      source_type: "book",
      annotations: { focus_spans: [{ text: "pensez-vous de", role: "opinion_preposition" }] },
      relations: { verbs: [makeVerbId("penser")], grammar_rules: [makeRuleId("verbs_with_varying_preposition_meanings")] },
      cloze_candidates: ["de"],
      study: { difficulty: 2 },
      attestations: [{ source_type: "book", chapter_number: 27, page_printed: 230, context_type: "example_sentence" }],
    },
    {
      id: makeExampleId("manquer_prep", 1),
      type: "example",
      french: "Tu me manques beaucoup depuis ton départ.",
      english: "I miss you very much since your departure.",
      source_type: "book",
      annotations: { focus_spans: [{ text: "Tu me manques", role: "missing_expression" }] },
      relations: { verbs: [makeVerbId("manquer")], grammar_rules: [makeRuleId("verbs_with_varying_preposition_meanings")] },
      cloze_candidates: ["manques"],
      study: { difficulty: 2 },
      attestations: [{ source_type: "book", chapter_number: 27, page_printed: 231, context_type: "example_sentence" }],
    },
    {
      id: makeExampleId("avoir_beau", 1),
      type: "example",
      french: "J'ai beau faire des efforts, il n'est jamais content.",
      english: "No matter how much effort I make, he is never satisfied.",
      source_type: "book",
      annotations: { focus_spans: [{ text: "J'ai beau faire", role: "concession_construction" }] },
      relations: { verbs: [makeVerbId("faire")], expressions: [makeExpressionId("avoir beau + infinitif")] },
      cloze_candidates: ["J'ai beau faire"],
      study: { difficulty: 2 },
      attestations: [{ source_type: "book", chapter_number: 27, page_printed: 234, context_type: "example_sentence" }],
    },
  ];

  const chapter: Chapter = {
    id: chId,
    chapter_number: chNum,
    title: "Pot pourri",
    section_ids: sections.map((s) => s.id),
    concept_ids: ["concept_verb_preposition_patterns"],
    tense_ids: [],
    grammar_rule_ids: grammar_rules.map((r) => r.id),
    verb_ids: verbs.map((v) => v.id),
    conjugation_ids: conjugations.map((c) => c.id),
    expression_ids: expressions.map((e) => e.id),
    vocabulary_ids: vocabulary.map((v) => v.id),
    example_ids: examples.map((e) => e.id),
    exercise_ids: exercises.map((e) => e.id),
    source: { page_start_printed: 230, page_end_printed: 235, page_start_pdf: 244, page_end_pdf: 249 },
    tags: ["pot_pourri", "prepositions", "avoir_beau", "n_importe"],
  };

  return { chapter, sections, grammar_rules, verbs, conjugations, vocabulary, expressions, examples, exercises };
}
