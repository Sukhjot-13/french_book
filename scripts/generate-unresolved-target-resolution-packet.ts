/**
 * Produces a bounded, source-only review packet for rejected relationship
 * pointers.  It deliberately reads no legacy or intermediate dataset.
 */
import * as fs from 'fs';
import * as path from 'path';

const root = path.resolve(__dirname, '..');
const sourceDir = path.join(root, 'bookdata', 'json');
const reconciliationDir = path.join(root, 'data', 'reconciliation');
const packetPath = path.join(reconciliationDir, 'unresolved-target-resolution-packet.json');
const masterPath = path.join(root, 'data', 'final', 'french_grammar_master.preview.json');
const manifestPath = path.join(reconciliationDir, 'authoritative-relationship-manifest.json');

const read = (file: string): any => JSON.parse(fs.readFileSync(file, 'utf8'));
const normalize = (value: unknown): string => String(value ?? '')
  .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
  .toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_+|_+$/g, '');
const asStrings = (value: unknown): string[] => Array.isArray(value) ? value.filter((item): item is string => typeof item === 'string') : typeof value === 'string' ? [value] : [];
const unique = <T>(values: T[]): T[] => [...new Set(values)];

type Entity = {
  id: string;
  type: string;
  file: string;
  chapterNumber: number | null;
  value: any;
  french: string;
  english: string[];
  source: Record<string, unknown>;
};

const typeForCollection: Record<string, string> = {
  chapters: 'chapter', sections: 'section', concepts: 'concept', tenses: 'tense',
  grammar_rules: 'grammar_rule', verbs: 'verb', conjugations: 'conjugation',
  expressions: 'expression', vocabulary: 'vocabulary', examples: 'example', exercises: 'exercise',
};
const fieldTypes: Record<string, string> = {
  chapter_ids: 'chapter', section_ids: 'section', concept_ids: 'concept', tense_ids: 'tense',
  grammar_rule_ids: 'grammar_rule', rule_ids: 'grammar_rule', verb_ids: 'verb', conjugation_ids: 'conjugation',
  expression_ids: 'expression', vocabulary_ids: 'vocabulary', example_ids: 'example', exercise_ids: 'exercise',
  'relations.verbs': 'verb', 'relations.expressions': 'expression', 'relations.vocabulary': 'vocabulary',
  'relations.grammar_rules': 'grammar_rule', 'relations.tenses': 'tense', 'relations.concepts': 'concept',
  base_verb_ids: 'verb', related_vocabulary_ids: 'vocabulary', function_ids: 'grammar_rule',
  related_rule_ids: 'grammar_rule', prerequisite_rule_ids: 'grammar_rule', contrast_with_rule_ids: 'grammar_rule',
  related_verb_ids: 'verb', contrast_verb_ids: 'verb', confused_with_ids: 'verb', word_family_ids: 'vocabulary',
};

function displayFrench(value: any): string {
  return String(value?.canonical_form ?? value?.infinitive ?? value?.french ?? value?.name_french ?? value?.title_french ?? value?.title ?? value?.prompt ?? value?.sentence_french ?? value?.source_text ?? '');
}
function displayEnglish(value: any): string[] {
  const direct = value?.english ?? value?.translation_en ?? value?.name ?? value?.explanation ?? value?.prompt_en;
  return asStrings(direct).length ? asStrings(direct) : typeof direct === 'string' ? [direct] : [];
}
function sourceLocation(value: any, chapterNumber: number | null): Record<string, unknown> {
  const att = value?.attestations?.[0] ?? value?.provenance?.[0] ?? value?.source ?? {};
  return {
    chapter_number: att.chapter_number ?? chapterNumber,
    chapter_id: att.chapter_id ?? null,
    section_id: att.section_id ?? value?.section_id ?? null,
    page_printed: att.page_printed ?? value?.page_printed ?? null,
    page_pdf: att.page_pdf ?? value?.page_pdf ?? null,
    source_anchor: att.source_anchor ?? null,
  };
}
function collectRelations(value: any): Array<{ field: string; target: string }> {
  const result: Array<{ field: string; target: string }> = [];
  const walk = (node: any, prefix = '') => {
    if (!node || typeof node !== 'object') return;
    for (const [key, child] of Object.entries(node)) {
      const field = prefix ? `${prefix}.${key}` : key;
      if ((key.endsWith('_ids') || key === 'tense_id' || key === 'verb_id' || prefix === 'relations') && (typeof child === 'string' || Array.isArray(child))) {
        for (const target of asStrings(child)) result.push({ field, target });
      }
      if (key === 'relations') walk(child, field);
    }
  };
  walk(value);
  return result;
}
function addEntity(into: Entity[], id: unknown, type: string, file: string, chapterNumber: number | null, value: any) {
  if (typeof id !== 'string' || !id) return;
  into.push({ id, type, file, chapterNumber, value, french: displayFrench(value), english: displayEnglish(value), source: sourceLocation(value, chapterNumber) });
}

const sourceEntities: Entity[] = [];
for (let number = 1; number <= 27; number++) {
  const file = `${number}.json`;
  const data = read(path.join(sourceDir, file));
  const chapterNumber = data?.chapter?.chapter_number ?? number;
  addEntity(sourceEntities, data?.chapter?.id, 'chapter', file, chapterNumber, data.chapter);
  for (const [collection, type] of Object.entries(typeForCollection)) {
    for (const value of data[collection] ?? []) {
      addEntity(sourceEntities, value?.id, type, file, chapterNumber, value);
      if (collection === 'exercises') for (const question of value.questions ?? []) {
        addEntity(sourceEntities, question?.question_id ?? question?.id, 'question', file, chapterNumber, question);
      }
    }
  }
}

const master = read(masterPath);
const canonicalEntities: Entity[] = [];
for (const [collection, type] of Object.entries(typeForCollection)) {
  for (const value of master[collection] ?? []) {
    addEntity(canonicalEntities, value?.id, type, 'french_grammar_master.preview.json', value?.attestations?.[0]?.chapter_number ?? null, value);
    if (collection === 'exercises') for (const question of value.questions ?? []) addEntity(canonicalEntities, question?.question_id, 'question', 'french_grammar_master.preview.json', value?.chapter_number ?? null, question);
  }
}
const sourceById = new Map(sourceEntities.map(entity => [entity.id, entity]));

function targetForms(target: string): string[] {
  const forms = [target, target.replace(/^(chapter|section|concept|rule|verb|conj|expression|expr|vocab|example|exercise|question)_/, '')];
  forms.push(target.replace(/^example_ch\d+_/, ''));
  return unique(forms.map(normalize).filter(Boolean));
}
function tokenSimilarity(left: string, right: string): number {
  const a = new Set(normalize(left).split('_').filter(Boolean));
  const b = new Set(normalize(right).split('_').filter(Boolean));
  if (!a.size || !b.size) return 0;
  let shared = 0; for (const token of a) if (b.has(token)) shared++;
  return shared / new Set([...a, ...b]).size;
}
function phraseTokensMatch(form: string, french: string): boolean {
  const wanted = normalize(form).split('_').filter(token => token.length > 1);
  const actual = normalize(french).split('_').filter(Boolean);
  return wanted.length > 1 && wanted.every(token => actual.some(candidate => candidate.startsWith(token.slice(0, Math.min(4, token.length)))));
}
function candidates(target: string, expectedType: string | undefined, owner: Entity | undefined, pool: Entity[]) {
  const forms = targetForms(target);
  return pool.map(entity => {
    const id = normalize(entity.id);
    const french = normalize(entity.french);
    let score = 0;
    const reasons: string[] = [];
    if (entity.id === target) { score += 100; reasons.push('exact ID'); }
    if (forms.includes(id)) { score += 85; reasons.push('normalized ID'); }
    if (french && forms.includes(french)) { score += 80; reasons.push('accent-insensitive French form'); }
    if (forms.some(form => phraseTokensMatch(form, entity.french))) { score += 70; reasons.push('target phrase occurs in French source text'); }
    const similarity = Math.max(
      tokenSimilarity(target, entity.id), tokenSimilarity(target, entity.french),
      ...forms.map(form => Math.max(tokenSimilarity(form, entity.id), tokenSimilarity(form, entity.french))),
    );
    if (similarity >= 0.67) { score += Math.round(similarity * 45); reasons.push(`canonical-form similarity ${similarity.toFixed(2)}`); }
    if (expectedType && entity.type === expectedType) { score += 18; reasons.push('compatible entity type'); }
    if (owner?.chapterNumber && entity.chapterNumber) {
      const distance = Math.abs(owner.chapterNumber - entity.chapterNumber);
      if (distance === 0) { score += 12; reasons.push('same source chapter'); }
      else if (distance <= 2) { score += 5; reasons.push('nearby source chapter'); }
    }
    return { entity, score, reason: reasons.join('; ') || 'no deterministic feature' };
  }).filter(candidate => candidate.score > 0)
    .sort((a, b) => b.score - a.score || a.entity.id.localeCompare(b.entity.id)).slice(0, 5)
    .map(({ entity, score, reason }) => ({ id: entity.id, type: entity.type, french: entity.french || null, english: entity.english, source_file: entity.file, source: entity.source, score, reason }));
}

const manifest = read(manifestPath);
const entries = (manifest.rejected_pointers ?? []).map((pointer: any) => {
  const owner = sourceById.get(pointer.from);
  const expectedType = fieldTypes[pointer.field];
  const localRelations = owner ? collectRelations(owner.value).filter(relation => relation.field === pointer.field || relation.target === pointer.dangling_target) : [];
  return {
    source_file: owner?.file ?? null,
    owner_id: pointer.from,
    owner_type: owner?.type ?? null,
    relationship_field: pointer.field,
    unresolved_target_id: pointer.dangling_target,
    owner_french_source_text: owner?.french || null,
    owner_english_or_explanation: owner?.english ?? [],
    source: owner?.source ?? null,
    relevant_local_source_relations: localRelations,
    expected_entity_type: expectedType ?? null,
    normalized_variants: targetForms(pointer.dangling_target),
    likely_chapter_offset_variants: /^example_ch43_/.test(pointer.dangling_target) ? ['example_ch05_<same-number>'] : /^example_ch49_/.test(pointer.dangling_target) ? ['example_ch06_<same-number>'] : /^example_ch27_0\d{2}$/.test(pointer.dangling_target) ? ['example_ch27_<number-minus-20>'] : [],
    candidate_canonical_targets: candidates(pointer.dangling_target, expectedType, owner, canonicalEntities),
    candidate_source_entities: candidates(pointer.dangling_target, expectedType, owner, sourceEntities),
    previous_disposition: pointer.status,
    previous_reason: pointer.reason,
  };
});
const families = new Map<string, number>();
for (const entry of entries) {
  const prefix = entry.unresolved_target_id.split('_')[0];
  const family = `${entry.owner_type ?? 'unknown'} | ${entry.relationship_field} | ${prefix}`;
  families.set(family, (families.get(family) ?? 0) + 1);
}
const packet = {
  metadata: {
    generated_at: new Date().toISOString(),
    authoritative_inputs: [...Array.from({ length: 27 }, (_, i) => `${i + 1}.json`), 'English-Frenchglossary.json', 'French-Englishglossary.json', 'verb_table.json', 'answer_key.json'],
    rejected_pointer_count: entries.length,
    source_entity_count_considered: sourceEntities.length,
    canonical_entity_count_considered: canonicalEntities.length,
    scope: 'Only rejected relationship pointers and bounded deterministic candidates are included.',
  },
  semantic_families: [...families.entries()].map(([family, count]) => ({ family, count })).sort((a, b) => b.count - a.count || a.family.localeCompare(b.family)),
  unresolved_pointers: entries,
};
fs.writeFileSync(packetPath, JSON.stringify(packet, null, 2) + '\n');
console.log(`Wrote ${path.relative(root, packetPath)} with ${entries.length} unresolved pointers.`);
