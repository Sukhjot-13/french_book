/** Independent source-occurrence to canonical-edge/provenance reconciliation. */
import * as fs from 'fs';
import * as path from 'path';

const root = path.resolve(__dirname, '..');
const sourceDir = path.join(root, 'bookdata/json');
const recDir = path.join(root, 'data/reconciliation');
const read = (p: string): any => JSON.parse(fs.readFileSync(p, 'utf8'));
const write = (name: string, data: any) => fs.writeFileSync(path.join(recDir, name), JSON.stringify(data, null, 2) + '\n');
const norm = (v: unknown) => String(v ?? '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_|_$/g, '');
const strings = (v: unknown): string[] => Array.isArray(v) ? v.filter((x): x is string => typeof x === 'string') : typeof v === 'string' ? [v] : [];

type Occ = { source_file: string; owner_id: string; owner_type: string; field: string; target: string; occurrence_index: number };
const relationshipFields = (value: any) => {
  const out: Array<{ field: string; target: string }> = [];
  const walk = (node: any, prefix = '') => {
    if (!node || typeof node !== 'object') return;
    for (const [key, child] of Object.entries(node)) {
      const field = prefix ? `${prefix}.${key}` : key;
      if ((key.endsWith('_ids') || key === 'tense_id' || key === 'verb_id' || prefix === 'relations') && (typeof child === 'string' || Array.isArray(child))) for (const target of strings(child)) out.push({ field, target });
      if (key === 'relations') walk(child, field);
    }
  };
  walk(value); return out;
};
const collections: Record<string, string> = { sections: 'section', concepts: 'concept', grammar_rules: 'grammar_rule', verbs: 'verb', conjugations: 'conjugation', expressions: 'expression', vocabulary: 'vocabulary', examples: 'example', exercises: 'exercise' };
const sources: Array<{ file: string; id: string; type: string; value: any }> = [];
for (let n = 1; n <= 27; n++) {
  const file = `${n}.json`, data = read(path.join(sourceDir, file));
  if (data.chapter?.id) sources.push({ file, id: data.chapter.id, type: 'chapter', value: data.chapter });
  for (const [collection, type] of Object.entries(collections)) for (const value of data[collection] ?? []) {
    sources.push({ file, id: value.id, type, value });
    if (collection === 'exercises') for (const q of value.questions ?? []) sources.push({ file, id: q.question_id ?? q.id, type: 'question', value: q });
  }
}
const sourceById = new Map(sources.map(s => [s.id, s]));
const master = read(path.join(root, 'data/final/french_grammar_master.preview.json'));
const canonical = new Map<string, any>();
for (const key of ['chapters', 'sections', 'concepts', 'tenses', 'grammar_rules', 'verbs', 'conjugations', 'expressions', 'vocabulary', 'examples', 'exercises']) for (const v of master[key] ?? []) { canonical.set(v.id, v); if (key === 'exercises') for (const q of v.questions ?? []) canonical.set(q.question_id, q); }
const manifest = read(path.join(recDir, 'authoritative-relationship-manifest.json'));
const targetRewrite = new Map((manifest.resolutions ?? []).map((r: any) => [`${r.from}|${r.field}|${r.original_target}`, r.resolved_target]));
const globalTargetRewrite = new Map<string, string>();
for (const r of manifest.resolutions ?? []) if (r.original_target !== r.resolved_target && !globalTargetRewrite.has(r.original_target)) globalTargetRewrite.set(r.original_target, r.resolved_target);
const rejected = new Map((manifest.rejected_pointers ?? []).map((r: any) => [`${r.from}|${r.field}|${r.dangling_target}`, r]));
const semantic = read(path.join(recDir, 'unresolved-target-semantic-resolutions.json'));
const malformed = new Map((semantic.resolutions ?? []).filter((r: any) => r.classification === 'SOURCE_POINTER_MALFORMED').map((r: any) => [`${r.source_owner}|${r.source_field}|${r.original_target}`, r]));

const canonicalFields = (ownerType: string, field: string) => {
  const relation = (name: string) => `relations.${name}`;
  if (ownerType === 'expression') {
    if (field === 'verb_ids') return ['base_verb_ids', relation('verbs')]; if (field === 'vocabulary_ids') return ['related_vocabulary_ids', relation('vocabulary')]; if (field === 'concept_ids') return ['function_ids', relation('concepts')]; if (field === 'rule_ids') return [relation('grammar_rules')];
  }
  if (ownerType === 'example' || ownerType === 'question') {
    const map: Record<string, string> = { verb_ids: 'verbs', expression_ids: 'expressions', vocabulary_ids: 'vocabulary', rule_ids: 'grammar_rules', tense_ids: 'tenses', concept_ids: 'concepts' };
    return [field.startsWith('relations.') ? field : map[field] ? relation(map[field]) : field];
  }
  if (field.startsWith('relations.')) return [field];
  if (field === 'contrast_with_ids') return [field, relation('grammar_rules')];
  const map: Record<string, string> = { verb_ids: 'verbs', expression_ids: 'expressions', vocabulary_ids: 'vocabulary', rule_ids: 'grammar_rules', tense_ids: 'tenses', concept_ids: 'concepts', conjugation_ids: 'conjugations', example_ids: 'examples', exercise_ids: 'exercises', contrast_with_ids: 'contrast_with' };
  return map[field] ? [field, relation(map[field])] : [field];
};
const edgeValues = (owner: any, field: string): string[] => field.startsWith('relations.') ? strings(owner?.relations?.[field.slice(10)]) : strings(owner?.[field]);
const occurrences: Occ[] = [];
for (const source of sources) relationshipFields(source.value).forEach(({ field, target }, occurrence_index) => occurrences.push({ source_file: source.file, owner_id: source.id, owner_type: source.type, field, target, occurrence_index }));
const relationship = occurrences.map(occ => {
  const key = `${occ.owner_id}|${occ.field}|${occ.target}`, rewrite = targetRewrite.get(key) ?? globalTargetRewrite.get(occ.target) ?? occ.target, fields = canonicalFields(occ.owner_type, occ.field);
  const sourceOwner = sourceById.get(occ.owner_id), owner = canonical.get(occ.owner_id);
  let canonicalOwnerId = occ.owner_id, cf = fields.find(field => edgeValues(owner, field).includes(rewrite)) ?? fields[0], edgeExists = edgeValues(owner, cf).includes(rewrite), ownerRewrite = false;
  if (occ.owner_type === 'exercise' && !edgeExists) {
    const exercise = canonical.get(occ.owner_id); const childFields = canonicalFields('question', occ.field);
    const question = (exercise?.questions ?? []).find((q: any) => childFields.some(field => edgeValues(q, field).includes(rewrite)));
    if (question) { canonicalOwnerId = question.question_id; cf = childFields.find(field => edgeValues(question, field).includes(rewrite))!; edgeExists = true; ownerRewrite = true; }
  }
  const reject = rejected.get(key), disposition = reject && malformed.has(key) ? 'EXPLICITLY_REJECTED_WITH_JUSTIFICATION'
    : edgeExists ? ownerRewrite && rewrite !== occ.target ? 'REPRESENTED_AFTER_OWNER_AND_TARGET_REWRITE' : ownerRewrite ? 'REPRESENTED_AFTER_OWNER_REWRITE' : rewrite !== occ.target ? 'REPRESENTED_AFTER_TARGET_REWRITE' : 'REPRESENTED_EXACT'
    : 'UNACCOUNTED';
  return { evidence_id: `${occ.source_file}::${occ.owner_id}::${occ.field}::${occ.target}::${occ.occurrence_index}`, ...occ, canonical_owner_id: canonicalOwnerId, canonical_relationship_type: cf, canonical_target_id: rewrite, canonical_edge_id: edgeExists ? `${canonicalOwnerId}|${cf}|${rewrite}` : null, disposition, reason: disposition === 'EXPLICITLY_REJECTED_WITH_JUSTIFICATION' ? malformed.get(key)?.evidence : edgeExists ? null : `Canonical edge ${occ.owner_id}|${cf}|${rewrite} is absent`, source_evidence: sourceOwner?.value?.attestations?.[0]?.source_text ?? null };
});
write('authoritative-relationship-evidence-reconciliation.json', { metadata: { generated_at: new Date().toISOString(), source_occurrences: relationship.length, counts: count(relationship, 'disposition') }, occurrences: relationship });

const attKey = (a: any) => [a.chapter_number, a.chapter_id, a.section_id, a.page_printed, a.page_pdf, a.context_type, a.exercise_id, a.question_number].map(norm).join('|');
const sourceAttestations = sources.flatMap(s => (s.value.attestations ?? []).map((a: any, i: number) => ({ source_file: s.file, owner_id: s.id, owner_type: s.type, occurrence_index: i, value: a })));
const attestations = sourceAttestations.map(a => {
  const owner = canonical.get(a.owner_id), candidates = owner?.attestations ?? [], text = norm(a.value.source_text);
  const exact = candidates.some((c: any) => attKey(a.value) === attKey(c));
  const normalized = !exact && !!text && candidates.some((c: any) => [a.value.chapter_number, a.value.section_id, a.value.page_printed, a.value.exercise_id].every((v, i) => norm(v) === norm([c.chapter_number, c.section_id, c.page_printed, c.exercise_id][i])) && norm(c.notes).includes(text));
  return { evidence_id: `${a.source_file}::${a.owner_id}::attestation::${a.occurrence_index}`, source_file: a.source_file, owner_id: a.owner_id, owner_type: a.owner_type, disposition: exact ? 'PRESERVED_EXACT' : normalized ? 'PRESERVED_IN_NORMALIZED_PROVENANCE' : owner ? 'AUDITOR_MAPPING_GAP' : 'GENUINELY_MISSING' };
});
write('authoritative-attestation-evidence-reconciliation.json', { metadata: { generated_at: new Date().toISOString(), source_occurrences: attestations.length, counts: count(attestations, 'disposition') }, occurrences: attestations });

const glossary = ['English-Frenchglossary.json', 'French-Englishglossary.json'].flatMap(file => (read(path.join(sourceDir, file)).entries ?? []).map((row: any, i: number) => ({ file, row, i }))).map(({ file, row, i }) => {
  const french = new Set([row.canonical_french, ...strings(row.french)].map(norm).filter(Boolean)), english = new Set([row.canonical_english, ...strings(row.english)].map(norm).filter(Boolean));
  const matches = [...canonical.values()].filter(v => french.has(norm(v.infinitive ?? v.canonical_form ?? v.display_form)) && strings(v.english).some(e => english.has(norm(e))));
  const provenance = matches.some(v => (v.attestations ?? []).some((a: any) => String(a.source_anchor ?? '').includes(row.id)));
  return { evidence_id: `${file}::${row.id ?? i}`, source_file: file, source_row_id: row.id ?? null, canonical_ids: matches.map(v => v.id), disposition: provenance ? 'REPRESENTED_EXACT' : matches.length ? 'AUDITOR_MAPPING_GAP' : 'UNACCOUNTED' };
});
write('authoritative-glossary-evidence-reconciliation.json', { metadata: { generated_at: new Date().toISOString(), source_rows: glossary.length, counts: count(glossary, 'disposition') }, rows: glossary });
function count(xs: any[], key: string) { const result: Record<string, number> = {}; for (const x of xs) result[x[key]] = (result[x[key]] ?? 0) + 1; return result; }
console.log(JSON.stringify({ relationships: count(relationship, 'disposition'), attestations: count(attestations, 'disposition'), glossary: count(glossary, 'disposition') }));
