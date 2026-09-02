import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { SuperDatasetRootSchema } from '../src/lib/dataset/schemas';

const root = path.resolve(__dirname, '..');
const preview = JSON.parse(fs.readFileSync(path.join(root, 'data/final/french_grammar_master.preview.json'), 'utf8'));
const audit = JSON.parse(fs.readFileSync(path.join(root, 'data/reconciliation/master-relationship-audit.json'), 'utf8'));
const resolutions = JSON.parse(fs.readFileSync(path.join(root, 'data/reconciliation/master-broken-reference-resolution.json'), 'utf8'));

SuperDatasetRootSchema.parse(preview);
assert.equal(audit.broken, 0, 'complete typed relationship audit has no unresolved references');
assert.equal(preview.book.chapter_ids.length, 27, 'book has every chapter');
assert.equal(preview.book.source_file.page_count_pdf, 286, 'PDF page count comes from source file');
assert.equal(preview.conjugations.filter((x: any) => !Object.values(x.forms).some(Boolean)).length, 0, 'no empty synthetic paradigms');
for (const verb of ['regarder', 'vendre', 'partir']) assert(preview.conjugations.some((x: any) => x.verb_id === `verb_${verb}` && x.tense_id === 'tense_imperatif' && Object.values(x.forms).some(Boolean)), `${verb} imperative forms survive`);
assert(!preview.verbs.some((x: any) => ['better','fewer','her','their','never','where'].includes(x.infinitive)), 'English pseudo-verbs are never created');
assert(resolutions.some((x: any) => x.resolution_class === 'MALFORMED_SOURCE_RELATION_REJECTED'), 'rejected source links retain evidence');
assert(preview.expressions.some((x: any) => x.id === 'expr_prendre_une_decision' && x.base_verb_ids.includes('verb_prendre')), 'prendre une décision is linked');
assert(preview.expressions.some((x: any) => x.id === 'expr_avoir_number_ans' && x.pattern_slots.some((s: any) => s.name === 'NUMBER')), 'productive age pattern is retained');
assert(!preview.expressions.some((x: any) => /\b(?:from|time|have|get|grow)\b/i.test(x.canonical_form) && x.canonical_form.split(/\s+/).length > 2), 'known bilingual spill shapes do not survive');
console.log('Master semantic repair regressions passed.');
