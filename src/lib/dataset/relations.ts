import { SuperDatasetRoot, Verb, Expression, Conjugation, Example, Exercise, GrammarRule, Vocabulary, Tense } from "./schemas";

export interface DatasetReverseIndexes {
  expressionsByVerb: Map<string, string[]>;
  conjugationsByVerb: Map<string, string[]>;
  conjugationsByTense: Map<string, string[]>;
  examplesByVerb: Map<string, string[]>;
  examplesByExpression: Map<string, string[]>;
  examplesByTense: Map<string, string[]>;
  rulesByTense: Map<string, string[]>;
  rulesByConcept: Map<string, string[]>;
  exercisesByVerb: Map<string, string[]>;
  exercisesByTense: Map<string, string[]>;
  exercisesByGrammarRule: Map<string, string[]>;
  vocabularyByChapter: Map<string, string[]>;
  expressionsByChapter: Map<string, string[]>;
  verbsByChapter: Map<string, string[]>;
  allEntityIds: Set<string>;
}

export function buildReverseIndexes(dataset: SuperDatasetRoot): DatasetReverseIndexes {
  const expressionsByVerb = new Map<string, string[]>();
  const conjugationsByVerb = new Map<string, string[]>();
  const conjugationsByTense = new Map<string, string[]>();
  const examplesByVerb = new Map<string, string[]>();
  const examplesByExpression = new Map<string, string[]>();
  const examplesByTense = new Map<string, string[]>();
  const rulesByTense = new Map<string, string[]>();
  const rulesByConcept = new Map<string, string[]>();
  const exercisesByVerb = new Map<string, string[]>();
  const exercisesByTense = new Map<string, string[]>();
  const exercisesByGrammarRule = new Map<string, string[]>();
  const vocabularyByChapter = new Map<string, string[]>();
  const expressionsByChapter = new Map<string, string[]>();
  const verbsByChapter = new Map<string, string[]>();
  const allEntityIds = new Set<string>();

  // Register all top level IDs
  const registerId = (id: string | undefined) => {
    if (id) allEntityIds.add(id);
  };

  registerId(dataset.book?.id);
  dataset.chapters?.forEach((c) => registerId(c.id));
  dataset.sections?.forEach((s) => registerId(s.id));
  dataset.concepts?.forEach((c) => registerId(c.id));
  dataset.tenses?.forEach((t) => registerId(t.id));
  dataset.grammar_rules?.forEach((r) => registerId(r.id));
  dataset.verbs?.forEach((v) => registerId(v.id));
  dataset.conjugations?.forEach((c) => registerId(c.id));
  dataset.expressions?.forEach((e) => registerId(e.id));
  dataset.vocabulary?.forEach((v) => registerId(v.id));
  dataset.examples?.forEach((ex) => registerId(ex.id));
  dataset.exercises?.forEach((ex) => {
    registerId(ex.id);
    ex.questions?.forEach((q) => registerId(q.question_id));
  });
  dataset.study_sets?.forEach((s) => registerId(s.id));

  // Helper to add to map
  const addLink = (map: Map<string, string[]>, key: string, targetId: string) => {
    if (!key || !targetId) return;
    const list = map.get(key) || [];
    if (!list.includes(targetId)) {
      list.push(targetId);
      map.set(key, list);
    }
  };

  // 1. Expressions -> Verbs
  dataset.expressions?.forEach((expr) => {
    expr.base_verb_ids?.forEach((vId) => addLink(expressionsByVerb, vId, expr.id));
    expr.relations?.verbs?.forEach((vId) => addLink(expressionsByVerb, vId, expr.id));
  });

  // 2. Conjugations -> Verbs & Tenses
  dataset.conjugations?.forEach((conj) => {
    addLink(conjugationsByVerb, conj.verb_id, conj.id);
    addLink(conjugationsByTense, conj.tense_id, conj.id);
  });

  // 3. Examples -> Verbs, Expressions, Tenses
  dataset.examples?.forEach((ex) => {
    ex.relations?.verbs?.forEach((vId) => addLink(examplesByVerb, vId, ex.id));
    ex.relations?.expressions?.forEach((eId) => addLink(examplesByExpression, eId, ex.id));
    ex.relations?.tenses?.forEach((tId) => addLink(examplesByTense, tId, ex.id));
  });

  // 4. Grammar Rules -> Tenses, Concepts
  dataset.grammar_rules?.forEach((rule) => {
    rule.tense_ids?.forEach((tId) => addLink(rulesByTense, tId, rule.id));
    rule.concept_ids?.forEach((cId) => addLink(rulesByConcept, cId, rule.id));
  });

  // 5. Exercises -> Verbs, Tenses, Grammar Rules
  dataset.exercises?.forEach((ex) => {
    ex.questions?.forEach((q) => {
      q.relations?.verbs?.forEach((vId) => addLink(exercisesByVerb, vId, ex.id));
      q.relations?.tenses?.forEach((tId) => addLink(exercisesByTense, tId, ex.id));
      q.relations?.grammar_rules?.forEach((rId) => addLink(exercisesByGrammarRule, rId, ex.id));
    });
  });

  // 6. Chapter mappings
  dataset.chapters?.forEach((ch) => {
    ch.vocabulary_ids?.forEach((vId) => addLink(vocabularyByChapter, ch.id, vId));
    ch.expression_ids?.forEach((eId) => addLink(expressionsByChapter, ch.id, eId));
    ch.verb_ids?.forEach((vId) => addLink(verbsByChapter, ch.id, vId));
  });

  return {
    expressionsByVerb,
    conjugationsByVerb,
    conjugationsByTense,
    examplesByVerb,
    examplesByExpression,
    examplesByTense,
    rulesByTense,
    rulesByConcept,
    exercisesByVerb,
    exercisesByTense,
    exercisesByGrammarRule,
    vocabularyByChapter,
    expressionsByChapter,
    verbsByChapter,
    allEntityIds,
  };
}
