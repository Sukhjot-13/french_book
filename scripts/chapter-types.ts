import { Chapter, Section, GrammarRule, Verb, Conjugation, Vocabulary, Expression, Example, Exercise } from "../src/lib/dataset/schemas";

export interface ChapterExtractionBundle {
  chapter: Chapter;
  sections: Section[];
  grammar_rules: GrammarRule[];
  verbs: Verb[];
  conjugations: Conjugation[];
  vocabulary: Vocabulary[];
  expressions: Expression[];
  examples: Example[];
  exercises: Exercise[];
}
