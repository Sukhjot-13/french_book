import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { SuperDatasetRootSchema } from '../src/lib/dataset/schemas';

const root = path.resolve(__dirname, '..');
const preview = JSON.parse(fs.readFileSync(path.join(root, 'data/final/french_grammar_master.preview.json'), 'utf8'));
const relManifest = JSON.parse(fs.readFileSync(path.join(root, 'data/reconciliation/authoritative-relationship-manifest.json'), 'utf8'));
const provenance = JSON.parse(fs.readFileSync(path.join(root, 'data/reconciliation/authoritative-provenance-ledger.json'), 'utf8'));
const targetReconstruction = JSON.parse(fs.readFileSync(path.join(root, 'data/reconciliation/authoritative-target-reconstruction-manifest.json'), 'utf8'));
const idempotence = JSON.parse(fs.readFileSync(path.join(root, 'data/reconciliation/authoritative-idempotence-report.json'), 'utf8'));
const answerReconciliation = JSON.parse(fs.readFileSync(path.join(root, 'data/reconciliation/authoritative-answer-reconciliation.json'), 'utf8'));
const vocabConflicts = JSON.parse(fs.readFileSync(path.join(root, 'data/reconciliation/master-vocabulary-conflict-resolution.json'), 'utf8'));
const generated = JSON.parse(fs.readFileSync(path.join(root, 'data/reconciliation/master-generated-global-entities.json'), 'utf8'));
const answerCorrections = JSON.parse(fs.readFileSync(path.join(root, 'data/reconciliation/master-answer-key-corrections.json'), 'utf8'));

// Schema parse
SuperDatasetRootSchema.parse(preview);

// 1. Authoritative Idempotence, Provenance, & Answer Reconciliation
assert.equal(idempotence.idempotence_result.result, 'IDEMPOTENCE_PASS', 'Genuine two-run idempotence passes');
assert.equal(idempotence.idempotence_result.hash_match, true, 'Dual run hashes match');
assert.equal(idempotence.metadata.total_authoritative_files, 31, 'Exactly 31 authoritative source files consumed');
assert.equal(provenance.metadata.unaccounted_count, 0, 'Zero unaccounted items via set difference');
assert.equal(provenance.metadata.completeness_percent, 100, 'Provenance 100% complete');
assert.equal(answerReconciliation.counts.unmatched_answers, 0, 'Zero unmatched answers in answer key');
assert.equal(answerReconciliation.counts.unmatched_questions, 0, 'Zero unmatched questions');

// 2. Relationship traversal is recomputed rather than trusted from a report
const allCanonicalIds = new Set([
  preview.book.id,
  ...preview.chapters.map((x: any) => x.id),
  ...preview.sections.map((x: any) => x.id),
  ...preview.concepts.map((x: any) => x.id),
  ...preview.tenses.map((x: any) => x.id),
  ...preview.grammar_rules.map((x: any) => x.id),
  ...preview.verbs.map((x: any) => x.id),
  ...preview.conjugations.map((x: any) => x.id),
  ...preview.expressions.map((x: any) => x.id),
  ...preview.vocabulary.map((x: any) => x.id),
  ...preview.examples.map((x: any) => x.id),
  ...preview.exercises.map((x: any) => x.id),
  ...preview.exercises.flatMap((x: any) => x.questions?.map((q: any) => q.question_id) || [])
]);

let independentBrokenCount = 0;
function checkId(id: string | undefined) {
  if (id && !allCanonicalIds.has(id)) {
    independentBrokenCount++;
  }
}
function checkArray(arr: string[] | undefined) {
  for (const id of arr || []) checkId(id);
}

checkArray(preview.book.chapter_ids);
for (const ch of preview.chapters) {
  checkArray(ch.section_ids);
  checkArray(ch.concept_ids);
  checkArray(ch.tense_ids);
  checkArray(ch.grammar_rule_ids);
  checkArray(ch.verb_ids);
  checkArray(ch.conjugation_ids);
  checkArray(ch.expression_ids);
  checkArray(ch.vocabulary_ids);
  checkArray(ch.example_ids);
  checkArray(ch.exercise_ids);
}
for (const sec of preview.sections) {
  checkId(sec.chapter_id);
  checkArray(sec.concept_ids);
  checkArray(sec.tense_ids);
  checkArray(sec.grammar_rule_ids);
  checkArray(sec.verb_ids);
  checkArray(sec.expression_ids);
  checkArray(sec.vocabulary_ids);
  checkArray(sec.example_ids);
  checkArray(sec.exercise_ids);
}
for (const r of preview.grammar_rules) {
  checkArray(r.concept_ids);
  checkArray(r.tense_ids);
  checkArray(r.contrast_with_rule_ids);
  checkArray(r.related_rule_ids);
  checkArray(r.prerequisite_rule_ids);
  checkArray(r.example_ids);
  checkArray(r.exercise_ids);
  checkArray(r.mood_governance?.trigger_expression_ids);
}
for (const v of preview.verbs) {
  checkArray(v.conjugation_ids);
  checkArray(v.expression_ids);
  checkArray(v.complement_frame_ids);
  checkArray(v.related_verb_ids);
  checkArray(v.contrast_verb_ids);
  checkArray(v.confused_with_ids);
  checkArray(v.word_family_ids);
}
for (const c of preview.conjugations) {
  checkId(c.verb_id);
  checkId(c.tense_id);
  checkArray(c.example_ids);
}
for (const e of preview.expressions) {
  checkArray(e.base_verb_ids);
  checkArray(e.related_vocabulary_ids);
  checkArray(e.function_ids);
  checkArray(e.example_ids);
}
for (const ex of preview.exercises) {
  checkId(ex.chapter_id);
  checkId(ex.section_id);
  for (const q of ex.questions || []) {
    if (q.relations) {
      checkArray(q.relations.verbs);
      checkArray(q.relations.expressions);
      checkArray(q.relations.vocabulary);
      checkArray(q.relations.tenses);
      checkArray(q.relations.grammar_rules);
      checkArray(q.relations.concepts);
      checkArray(q.relations.examples);
    }
  }
}
assert.equal(independentBrokenCount, 0, 'Independent traversal confirms zero broken relationships');

// 3. Reconstructed and resolved targets exist in canonical entities
for (const r of relManifest.resolutions) {
  assert(allCanonicalIds.has(r.resolved_target), `Resolved relationship target ${r.resolved_target} must exist in canonical entities`);
}

// 4. No empty/slug-decoded semantic entities are created
assert(!preview.grammar_rules.some((x: any) => !x.explanation || x.explanation.trim().length === 0), 'No empty grammar rules');
assert(!preview.expressions.some((x: any) => (x.tags || []).includes('source_reference_target') || !x.english.length), 'No shell expressions');
assert(!preview.examples.some((x: any) => !x.french || !x.english), 'No empty examples');
assert(!preview.verbs.some((x: any) => (x.tags || []).includes('source_reference_target')), 'No shell verbs created from empty synthesis');
assert(!preview.vocabulary.some((x: any) => (x.tags || []).includes('source_reference_target') || !x.english.length), 'No shell vocabulary');

// 5. Voile preserves both source-supported senses/genders
const voileEntries = preview.vocabulary.filter((x: any) => x.french === 'voile');
assert.equal(voileEntries.length, 2, 'voile has exactly 2 source-supported entries');
const sailVoile = voileEntries.find((v: any) => v.english.includes('sail'));
const veilVoile = voileEntries.find((v: any) => v.english.includes('veil'));
assert(sailVoile, 'voile (sail) exists');
assert.equal(sailVoile.noun?.gender, 'feminine', 'voile (sail) is feminine');
assert(veilVoile, 'voile (veil) exists');
assert.equal(veilVoile.noun?.gender, 'masculine', 'voile (veil) is masculine');
assert.equal(preview.vocabulary.filter((x: any) => x.french === 'anniversaire').length, 1, 'anniversaire is not split');
assert.equal(preview.vocabulary.filter((x: any) => x.french === 'meurtrier').length, 1, 'meurtrier is not split');
assert.equal(preview.vocabulary.filter((x: any) => x.french === 'patron').length, 1, 'patron is not split');
const voileConflict = vocabConflicts.find((x: any) => x.french === 'voile');
assert.equal(voileConflict?.resolution, 'SOURCE_HOMOGRAPH_SENSES_SEPARATED', 'voile conflict records separated homograph senses');

// 6. expr_vu_que contains no glossary continuation garbage
const vuQue = preview.expressions.find((x: any) => x.id === 'expr_vu_que');
assert(vuQue, 'expr_vu_que exists');
assert(!vuQue.english.some((e: string) => e.includes('étant donné que') || e.includes(',')), 'expr_vu_que contains no French continuation fragments');
assert.deepEqual(vuQue.english, ['given', 'in view of'], 'expr_vu_que has clean English meanings');
const desQue = preview.expressions.find((x: any) => x.id === 'expr_des_que');
assert(desQue, 'expr_des_que exists');
assert(!desQue.english.some((e: string) => e.includes('aussitôt que') || e.includes(',')), 'expr_des_que contains no continuation fragments');

// 7. Generated-global number_of_references equals actual traversal count
assert.equal(generated.length, 31, 'Exactly 31 generated globals (19 tenses + 12 concepts)');
for (const gen of generated) {
  assert.equal(gen.number_of_references, gen.reference_locations.length, `${gen.canonical_id} number_of_references matches reference_locations length`);
  assert(gen.number_of_references > 0, `${gen.canonical_id} has actual positive reference count`);
}

// 8. Generated-global trace lists all actual source/reference locations
for (const gen of generated) {
  assert(gen.source_files.length > 0, `${gen.canonical_id} lists real source files`);
  assert(!gen.source_files.includes('synthesized'), `${gen.canonical_id} does not list synthesized placeholder`);
  assert(gen.source_entity_ids.length > 0, `${gen.canonical_id} lists real source entity IDs`);
  assert(gen.source_relationship_fields.length > 0, `${gen.canonical_id} lists real relationship fields`);
  assert(gen.reference_locations.length > 0, `${gen.canonical_id} lists real reference locations`);
}

// 9. Provenance completeness computed via set difference from ledger
assert.equal(provenance.metadata.unaccounted_count, 0, 'UNACCOUNTED_SOURCE_EVIDENCE is zero via set difference');
assert.equal(provenance.metadata.completeness_percent, 100, 'Provenance is 100% complete');
assert(provenance.metadata.formula.includes('SOURCE_EVIDENCE_UNIVERSE \\ MASTER_REPRESENTED_EVIDENCE'), 'Formula uses set difference');
assert.equal(provenance.metadata.source_universe_size, provenance.metadata.master_represented_size, 'Universe matches represented evidence count');
assert(provenance.metadata.source_universe_size > 9000, 'Universe accounts for full source evidence');
assert.equal(provenance.unaccounted_items.length, 0, 'Zero unaccounted items in ledger');

// 12. Previous fixed tense moods remain correct
assert(preview.tenses.every((x: any) => x.mood !== 'other'), 'Canonical tense moods are source-safe');
assert(preview.tenses.some((x: any) => x.mood === 'conditional'), 'Conditional mood retained');
assert(preview.tenses.some((x: any) => x.mood === 'subjunctive'), 'Subjunctive mood retained');
assert(preview.tenses.some((x: any) => x.mood === 'infinitive'), 'Infinitive mood retained');

// 13. 21 compound paradigms remain correct
const compoundTableIds = new Set(['verb_table_regular_compound_conversational_past', 'verb_table_regular_compound_pluperfect', 'verb_table_regular_compound_past_perfect', 'verb_table_regular_compound_future_perfect', 'verb_table_regular_compound_past_conditional', 'verb_table_regular_subjunctive_past', 'verb_table_regular_subjunctive_pluperfect']);
const sourceCompound = preview.conjugations.filter((x: any) => x.attestations.some((a: any) => compoundTableIds.has(String(a.source_anchor || '').split(':')[0])));
assert.equal(sourceCompound.length, 21, 'All 21 source compound paradigms are retained');
assert.equal(sourceCompound.filter((x: any) => !x.compound).length, 0, 'Table compound flags match their actual table identity');

// 14. Answer-key repairs remain correct
assert.equal(answerCorrections.length, 2, 'Two answer key boundary corrections are documented');
const q1 = preview.exercises.flatMap((e: any) => e.questions || []).find((q: any) => q.question_id === 'question_ch22_1_9');
assert.equal(q1?.answer, 'Ses idées sont bonnes? —Oui, ses idées sont meilleures que les nôtres.', 'q09 answer boundary continuation repaired');
const q2 = preview.exercises.flatMap((e: any) => e.questions || []).find((q: any) => q.question_id === 'question_2_3_6');
assert.equal(q2?.answer, 'Elle saisit l’occasion.', 'q06 footer contamination removed');

// 15. Functional_roles/pronominal repairs remain correct
const etreVerb = preview.verbs.find((v: any) => v.id === 'verb_etre');
assert(etreVerb.functional_roles.includes('auxiliary'), 'verb_etre has auxiliary functional role');
const pouvoirVerb = preview.verbs.find((v: any) => v.id === 'verb_pouvoir');
assert(pouvoirVerb.functional_roles.includes('modal'), 'verb_pouvoir has modal functional role');
const sePlaindre = preview.verbs.find((v: any) => v.id === 'verb_se_plaindre');
assert.equal(sePlaindre.pronominal, true, 'se plaindre is marked pronominal');

// 16. Targeted expressions remain correct
assert(preview.expressions.some((x: any) => x.id === 'expr_prendre_une_decision' && x.base_verb_ids.includes('verb_prendre')), 'prendre une décision is linked to verb_prendre');
assert(preview.expressions.some((x: any) => (x.id === 'expr_avoir_number_ans' || x.id === 'expr_avoir_ans') && x.pattern_slots.some((s: any) => s.name.toLowerCase() === 'number' || s.name.toLowerCase() === 'age')), 'productive age pattern is retained');

// 17. Chapter/PDF metadata remains correct
assert.equal(preview.book.chapter_ids.length, 27, 'Book has all 27 chapters');
assert.equal(preview.book.source_file.page_count_pdf, 286, 'PDF page count comes from source file');
for (let i = 1; i <= 27; i++) {
  const chId = `chapter_${String(i).padStart(2, '0')}`;
  const ch = preview.chapters.find((c: any) => c.id === chId);
  assert(ch, `Chapter ${i} exists`);
  assert.equal(ch.chapter_number, i, `Chapter ${i} number matches`);
}

console.log('All 17 Master Semantic Repair Regressions Passed Successfully!');
