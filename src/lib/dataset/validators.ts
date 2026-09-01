import { SuperDatasetRoot, SuperDatasetRootSchema } from "./schemas";
import { isValidId } from "./ids";
import { buildReverseIndexes } from "./relations";

export interface ValidationReport {
  timestamp: string;
  passed: boolean;
  total_entities: number;
  schema_errors: Array<{ path: string; message: string }>;
  id_errors: Array<{ id: string; error: string }>;
  unresolved_relations: Array<{ from_id: string; from_type: string; target_id: string; relation_type: string }>;
  duplicate_candidates: Array<{ entity_type: string; ids: string[]; display_name: string; reason: string }>;
  low_confidence_items: Array<{ id: string; type: string; confidence: string; reason?: string }>;
  conjugation_gaps: Array<{ verb_id: string; tense_id: string; missing_forms: string[] }>;
  vocabulary_gaps: Array<{ id: string; french: string; gap: string }>;
  exercise_gaps: Array<{ exercise_id: string; question_id: string; gap: string }>;
}

export function validateDataset(dataset: any): ValidationReport {
  const schemaErrors: Array<{ path: string; message: string }> = [];
  const idErrors: Array<{ id: string; error: string }> = [];
  const unresolvedRelations: Array<{ from_id: string; from_type: string; target_id: string; relation_type: string }> = [];
  const duplicateCandidates: Array<{ entity_type: string; ids: string[]; display_name: string; reason: string }> = [];
  const lowConfidenceItems: Array<{ id: string; type: string; confidence: string; reason?: string }> = [];
  const conjugationGaps: Array<{ verb_id: string; tense_id: string; missing_forms: string[] }> = [];
  const vocabularyGaps: Array<{ id: string; french: string; gap: string }> = [];
  const exerciseGaps: Array<{ exercise_id: string; question_id: string; gap: string }> = [];

  // 1. Zod schema validation
  const parseResult = SuperDatasetRootSchema.safeParse(dataset);
  if (!parseResult.success) {
    for (const issue of parseResult.error.issues) {
      schemaErrors.push({
        path: issue.path.join("."),
        message: issue.message,
      });
    }
  }

  const typedData: SuperDatasetRoot = parseResult.success ? parseResult.data : dataset;

  // 2. ID set & uniqueness checks
  const allIds = new Set<string>();
  let totalEntities = 0;

  const checkEntityId = (id: string | undefined, type: string) => {
    if (!id) {
      idErrors.push({ id: "(empty)", error: `Missing ID on ${type}` });
      return;
    }
    if (!isValidId(id)) {
      idErrors.push({ id, error: `Invalid ID prefix for ${type}` });
    }
    if (allIds.has(id)) {
      idErrors.push({ id, error: `Duplicate ID: ${id}` });
    }
    allIds.add(id);
    totalEntities++;
  };

  if (typedData.book?.id) checkEntityId(typedData.book.id, "book");
  typedData.chapters?.forEach((c) => checkEntityId(c.id, "chapter"));
  typedData.sections?.forEach((s) => checkEntityId(s.id, "section"));
  typedData.concepts?.forEach((c) => checkEntityId(c.id, "concept"));
  typedData.tenses?.forEach((t) => checkEntityId(t.id, "tense"));
  typedData.grammar_rules?.forEach((r) => checkEntityId(r.id, "grammar_rule"));
  typedData.verbs?.forEach((v) => checkEntityId(v.id, "verb"));
  typedData.conjugations?.forEach((c) => checkEntityId(c.id, "conjugation"));
  typedData.expressions?.forEach((e) => checkEntityId(e.id, "expression"));
  typedData.vocabulary?.forEach((v) => checkEntityId(v.id, "vocabulary"));
  typedData.examples?.forEach((ex) => checkEntityId(ex.id, "example"));
  typedData.exercises?.forEach((ex) => {
    checkEntityId(ex.id, "exercise");
    ex.questions?.forEach((q) => {
      checkEntityId(q.question_id, "exercise_question");
    });
  });
  typedData.study_sets?.forEach((s) => checkEntityId(s.id, "study_set"));

  // 3. Relation integrity
  const checkRelation = (fromId: string, fromType: string, targetId: string, relationType: string) => {
    if (!targetId) return;
    if (!allIds.has(targetId)) {
      unresolvedRelations.push({
        from_id: fromId,
        from_type: fromType,
        target_id: targetId,
        relation_type: relationType,
      });
    }
  };

  // Check conjugations
  typedData.conjugations?.forEach((c) => {
    checkRelation(c.id, "conjugation", c.verb_id, "verb_id");
    checkRelation(c.id, "conjugation", c.tense_id, "tense_id");
    c.example_ids?.forEach((exId) => checkRelation(c.id, "conjugation", exId, "example_id"));
    if (c.editorial?.extraction_confidence === "low") {
      lowConfidenceItems.push({ id: c.id, type: "conjugation", confidence: "low", reason: c.editorial.notes || undefined });
    }
    // Check forms
    if (!c.forms || Object.keys(c.forms).length === 0) {
      conjugationGaps.push({ verb_id: c.verb_id, tense_id: c.tense_id, missing_forms: ["(all forms empty)"] });
    }
  });

  // Check expressions
  typedData.expressions?.forEach((e) => {
    e.base_verb_ids?.forEach((vId) => checkRelation(e.id, "expression", vId, "base_verb_id"));
    e.related_vocabulary_ids?.forEach((vId) => checkRelation(e.id, "expression", vId, "related_vocabulary_id"));
    e.example_ids?.forEach((exId) => checkRelation(e.id, "expression", exId, "example_id"));
  });

  // Check vocabulary
  typedData.vocabulary?.forEach((v) => {
    v.word_family_ids?.forEach((wId) => checkRelation(v.id, "vocabulary", wId, "word_family_id"));
    v.collocation_expression_ids?.forEach((eId) => checkRelation(v.id, "vocabulary", eId, "collocation_expression_id"));
    if (v.part_of_speech === "noun" && !v.noun?.gender) {
      vocabularyGaps.push({ id: v.id, french: v.french, gap: "Missing noun gender" });
    }
  });

  // Check chapters & sections
  typedData.chapters?.forEach((ch) => {
    ch.section_ids?.forEach((sId) => checkRelation(ch.id, "chapter", sId, "section_id"));
    ch.verb_ids?.forEach((vId) => checkRelation(ch.id, "chapter", vId, "verb_id"));
    ch.vocabulary_ids?.forEach((vId) => checkRelation(ch.id, "chapter", vId, "vocabulary_id"));
    ch.expression_ids?.forEach((eId) => checkRelation(ch.id, "chapter", eId, "expression_id"));
    ch.exercise_ids?.forEach((exId) => checkRelation(ch.id, "chapter", exId, "exercise_id"));
    ch.grammar_rule_ids?.forEach((rId) => checkRelation(ch.id, "chapter", rId, "grammar_rule_id"));
    ch.tense_ids?.forEach((tId) => checkRelation(ch.id, "chapter", tId, "tense_id"));
    ch.concept_ids?.forEach((cId) => checkRelation(ch.id, "chapter", cId, "concept_id"));
  });

  // Check exercises
  typedData.exercises?.forEach((ex) => {
    checkRelation(ex.id, "exercise", ex.chapter_id, "chapter_id");
    if (ex.section_id) checkRelation(ex.id, "exercise", ex.section_id, "section_id");
    ex.questions?.forEach((q) => {
      if (!q.answer && !q.open_ended) {
        exerciseGaps.push({ exercise_id: ex.id, question_id: q.question_id, gap: "Unanswered objective question" });
      }
      q.relations?.verbs?.forEach((vId) => checkRelation(q.question_id, "question", vId, "verb"));
      q.relations?.tenses?.forEach((tId) => checkRelation(q.question_id, "question", tId, "tense"));
      q.relations?.grammar_rules?.forEach((rId) => checkRelation(q.question_id, "question", rId, "grammar_rule"));
    });
  });

  // Check examples
  typedData.examples?.forEach((ex) => {
    ex.relations?.verbs?.forEach((vId) => checkRelation(ex.id, "example", vId, "verb"));
    ex.relations?.expressions?.forEach((eId) => checkRelation(ex.id, "example", eId, "expression"));
    ex.relations?.tenses?.forEach((tId) => checkRelation(ex.id, "example", tId, "tense"));
    ex.relations?.grammar_rules?.forEach((rId) => checkRelation(ex.id, "example", rId, "grammar_rule"));
  });

  // Check study sets
  typedData.study_sets?.forEach((s) => {
    s.item_ids?.forEach((itemId) => checkRelation(s.id, "study_set", itemId, "item_id"));
  });

  const passed =
    schemaErrors.length === 0 &&
    idErrors.length === 0 &&
    unresolvedRelations.length === 0 &&
    duplicateCandidates.length === 0 &&
    lowConfidenceItems.length === 0;

  return {
    timestamp: new Date().toISOString(),
    passed,
    total_entities: totalEntities,
    schema_errors: schemaErrors,
    id_errors: idErrors,
    unresolved_relations: unresolvedRelations,
    duplicate_candidates: duplicateCandidates,
    low_confidence_items: lowConfidenceItems,
    conjugation_gaps: conjugationGaps,
    vocabulary_gaps: vocabularyGaps,
    exercise_gaps: exerciseGaps,
  };
}
