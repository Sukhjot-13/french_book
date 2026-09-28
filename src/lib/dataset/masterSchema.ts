/**
 * Master Schema TypeScript interfaces.
 * Matches authoritative data/MASTER_SCHEMA.json definitions exactly.
 */

export interface StudyMetadata {
  cefr_level?: string | null;
  learning_priority?: number | null;
  difficulty?: number | null;
  usefulness?: number | null;
  frequency_tier?: string | null;
  confidence_score?: number | null;
  verification_status?: string | null;
  [key: string]: unknown;
}

export interface SourceEvidence {
  source_type?: string | null;
  source_name?: string | null;
  chapter_number?: number | null;
  section_title?: string | null;
  page_printed?: number | null;
  page_pdf?: number | null;
  context_type?: string | null;
  exercise_code?: string | null;
  question_number?: number | null;
  source_text?: string | null;
  [key: string]: unknown;
}

export interface Sense {
  sense_number?: number | null;
  english_gloss?: string | null;
  meaning?: string | null;
  context?: string | null;
  register?: string | null;
  examples?: string[];
  [key: string]: unknown;
}

export interface ConjugationForms {
  je?: string | null;
  tu?: string | null;
  il_elle_on?: string | null;
  nous?: string | null;
  vous?: string | null;
  ils_elles?: string | null;
  imperative_tu?: string | null;
  imperative_nous?: string | null;
  imperative_vous?: string | null;
  impersonal_form?: string | null;
  [key: string]: unknown;
}

export interface VerbConjugation {
  tense: string;
  mood?: string | null;
  forms: ConjugationForms;
  stems?: string[];
  endings?: string[];
  formation_note?: string | null;
  irregularities?: string[];
  notes?: string[];
  sources?: SourceEvidence[];
}

export interface VerbStem {
  stem?: string | null;
  tense?: string | null;
  person?: string | null;
  note?: string | null;
  [key: string]: unknown;
}

export interface MasterVerb {
  infinitive: string;
  display_form?: string | null;
  english: string | string[];
  senses?: Sense[];
  verb_group?: string | null;
  regularity?: string | null;
  pronominal?: boolean | null;
  transitivity?: string | null;
  auxiliary?: string | null;
  past_participle?: string | null;
  present_participle?: string | null;
  stems?: (string | VerbStem)[];
  conjugations: VerbConjugation[];
  related_expressions?: string[];
  related_concepts?: string[];
  aliases?: string[];
  search_terms?: string[];
  source_classifications?: string[];
  register?: string | null;
  synonyms?: string[];
  antonyms?: string[];
  usage_notes?: string[];
  tags?: string[];
  study?: StudyMetadata | null;
  chapters: number[];
  sources?: SourceEvidence[];
  notes?: string | string[] | null;
}

export interface MasterTense {
  name: string;
  english_name?: string | null;
  mood?: string | null;
  formation?: string | null;
  usage?: string | string[] | null;
  signal_words?: string[];
  regular_patterns?: unknown[];
  irregular_stems?: unknown[];
  compound_structure?: unknown | null;
  agreement_rules?: string[];
  negative_form?: string | null;
  interrogative_form?: string | null;
  affirmative_form?: string | null;
  common_traps?: string[];
  related_tenses?: string[];
  related_grammar_rules?: string[];
  tags?: string[];
  study?: StudyMetadata | null;
  chapters: number[];
  sources?: SourceEvidence[];
  notes?: string | string[] | null;
}

export interface MasterGrammarRule {
  rule_name: string;
  summary?: string | null;
  explanation?: string | null;
  formation?: string | null;
  usage?: string | string[] | null;
  restrictions?: string[];
  conditions?: string[];
  signal_words?: string[];
  exceptions?: string[];
  agreement_rules?: string[];
  word_order?: string | null;
  negative_form?: string | null;
  interrogative_form?: string | null;
  affirmative_form?: string | null;
  transformations?: unknown[];
  contrast_with?: string[];
  common_traps?: string[];
  related_tenses?: string[];
  related_concepts?: string[];
  related_expressions?: string[];
  related_verbs?: string[];
  tags?: string[];
  study?: StudyMetadata | null;
  chapters: number[];
  sources?: SourceEvidence[];
  notes?: string | string[] | null;
}

export interface PatternSlot {
  slot_name?: string | null;
  filler_types?: string[];
  optional?: boolean;
  notes?: string | null;
}

export interface ComplementStructure {
  direct_object?: boolean | null;
  indirect_object?: boolean | null;
  preposition?: string | null;
  followed_by?: string | null;
}

export interface MasterExpression {
  canonical_form: string;
  display_form?: string | null;
  english: string | string[];
  expression_type?: string | null;
  productive?: boolean | null;
  pattern?: string | null;
  pattern_slots?: PatternSlot[];
  related_verbs?: string[];
  related_vocabulary?: string[];
  related_grammar_rules?: string[];
  related_concepts?: string[];
  prepositions?: string[];
  complement_structure?: string | ComplementStructure | null;
  restrictions?: string[];
  transformations?: unknown[];
  aliases?: string[];
  search_terms?: string[];
  collocation_strength?: string | null;
  source_classifications?: string[];
  register?: string | null;
  synonyms?: string[];
  antonyms?: string[];
  usage_notes?: string[];
  tags?: string[];
  study?: StudyMetadata | null;
  chapters: number[];
  sources?: SourceEvidence[];
  notes?: string | string[] | null;
}

export interface MasterVocabulary {
  canonical_form: string;
  display_form?: string | null;
  english: string | string[];
  part_of_speech: string;
  gender?: string | null;
  article?: string | null;
  articles?: string | string[] | null;
  plural?: string | null;
  variants?: string[];
  senses?: Sense[];
  aliases?: string[];
  search_terms?: string[];
  word_family?: string[];
  related_expressions?: string[];
  related_verbs?: string[];
  related_concepts?: string[];
  source_classifications?: string[];
  register?: string | null;
  synonyms?: string[];
  antonyms?: string[];
  usage_notes?: string[];
  tags?: string[];
  study?: StudyMetadata | null;
  chapters: number[];
  sources?: SourceEvidence[];
  notes?: string | string[] | null;
}

export interface FocusSpan {
  text: string;
  focus_type?: string | null;
  entity_name?: string | null;
}

export interface MasterExample {
  french: string;
  english: string;
  related_verbs?: string[];
  related_expressions?: string[];
  related_vocabulary?: string[];
  related_grammar_rules?: string[];
  related_tenses?: string[];
  related_concepts?: string[];
  focus_spans?: FocusSpan[];
  tags?: string[];
  chapters: number[];
  notes?: string | null;
  sources?: SourceEvidence[];
}

export interface ExerciseQuestion {
  question_number?: number | string;
  prompt: string;
  stimulus?: string | null;
  question_type?: string | null;
  options?: string[];
  correct_answer: string | string[];
  acceptable_alternatives?: string[];
  explanation?: string | null;
  hints?: string[];
  notes?: string | null;
}

export interface MasterExercise {
  chapter_number: number;
  exercise_code: string;
  title?: string | null;
  exercise_type?: string | null;
  instructions?: string | null;
  section_title?: string | null;
  pages?: {
    printed_start?: number | null;
    printed_end?: number | null;
    pdf_start?: number | null;
    pdf_end?: number | null;
  };
  questions: ExerciseQuestion[];
  related_verbs?: string[];
  related_expressions?: string[];
  related_vocabulary?: string[];
  related_grammar_rules?: string[];
  related_tenses?: string[];
  related_concepts?: string[];
  notes?: string | null;
  sources?: SourceEvidence[];
}

export interface MasterExceptionTrap {
  title: string;
  category?: string | null;
  description: string;
  correct_form?: string | null;
  incorrect_form?: string | null;
  related_grammar_rules?: string[];
  related_verbs?: string[];
  related_expressions?: string[];
  related_examples?: string[];
  tags?: string[];
  study?: StudyMetadata | null;
  chapters: number[];
  sources?: SourceEvidence[];
  notes?: string | null;
}

export interface MasterConcept {
  name: string;
  description?: string | null;
  aliases?: string[];
  related_grammar_rules?: string[];
  related_verbs?: string[];
  related_expressions?: string[];
  related_vocabulary?: string[];
  related_tenses?: string[];
  tags?: string[];
  study?: StudyMetadata | null;
  chapters: number[];
  sources?: SourceEvidence[];
  notes?: string | null;
}

export interface ChapterSection {
  title: string;
  printed_page_start?: number | null;
  printed_page_end?: number | null;
  pdf_page_start?: number | null;
  pdf_page_end?: number | null;
  key_points?: string[];
}

export interface MasterChapter {
  chapter_number: number;
  chapter_title: string;
  pages?: {
    printed_start?: number | null;
    printed_end?: number | null;
    pdf_start?: number | null;
    pdf_end?: number | null;
  };
  sections?: ChapterSection[];
  concepts?: string[];
  grammar_rules?: string[];
  verbs?: string[];
  expressions?: string[];
  vocabulary?: string[];
  tenses?: string[];
  topics?: string[];
  notes?: string | null;
  sources?: SourceEvidence[];
}

export interface MasterMetadata {
  dataset_name?: string;
  book_title?: string;
  author?: string;
  language?: string;
  source_language?: string;
  target_language?: string;
  notes?: string;
}

export interface MasterDataset {
  schema_version: string;
  dataset_type: string;
  metadata: MasterMetadata;
  chapters: MasterChapter[];
  topics?: unknown[];
  concepts: MasterConcept[];
  grammar_rules: MasterGrammarRule[];
  tenses: MasterTense[];
  verbs: MasterVerb[];
  expressions: MasterExpression[];
  vocabulary: MasterVocabulary[];
  examples: MasterExample[];
  exercises: MasterExercise[];
  exceptions_and_traps: MasterExceptionTrap[];
  unresolved_items?: unknown[];
  source_quality?: unknown[];
}
