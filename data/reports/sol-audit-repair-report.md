# Sol Audit Repair Report

## Scope and root causes

- Exercise parsing concatenated whole chapter pages and ended an exercise only at the next exercise-like token. Its final numbered question therefore absorbed the following lesson. Exercise attestations used the first chapter page instead of the page containing the exercise header.
- The answer-key parser discarded numeric answers/answers containing years and did not retain per-answer page provenance. Attachment therefore left answer-key pages null and 20 answer slots unresolved.
- Glossary reconciliation assigned `noun` unconditionally. The enhanced glossary parser also accepted running headers, a split `off rir` infinitive, and an adjective variant line as ordinary vocabulary.
- Auto-registration accepted arbitrary parenthetical text ending in `-re`, producing `verb_whoever_you_are`.
- Printed conjugations that entered the first canonicalization slot did not receive an explicit `book` origin. Validation and coverage treated material gaps as advisory and reported hard-coded coverage ratios.

## Repairs

- `extract-chapter.ts` now tracks source pages per line, ends at structural lesson transitions after the answer-key-confirmed final numbered item, removes page chrome, and records the actual exercise-header page. This is structural parsing, not string truncation.
- `parse-backmatter.ts` preserves answer-key page/PDF pages and accepts digit-bearing and number-only answers; `attach-answer-key.ts` carries that provenance to every exercise.
- Glossary parsing now rejects both glossary headers, repairs split infinitives, recognizes variant rows, and assigns source-supported POS. Reconciliation preserves POS/morphology across both glossary directions. `beau` is an adjective with `bel`/`belle`; English infinitive entries are verbs.
- Reviewed Sol decisions live in `sol-reviewed-expression-approvals.json` and are consumed by the general promotion architecture. The five approved expressions are promoted with canonical IDs, patterns, provenance, attestations, and reverse links.
- Unsafe verb auto-registration is limited to a French infinitive shape; unresolved vocabulary references are not fabricated as gendered nouns. Printed conjugations are normalized to `origin.source_type: book` when backed by a book attestation.
- Validation now blocks on vocabulary, exercise-boundary, answer-provenance, conjugation-provenance, semantic-garbage, relation, duplicate, and low-confidence failures. Coverage is computed from source/output reconciliation.

## Results

| Check | Before | After |
| --- | ---: | ---: |
| Prompts over 250 / 500 / 1,000 characters | 80 / 70 / 48 | 0 / 0 / 0 |
| Exercise source pages | chapter-opening page for all | 197 / 197 exact header pages |
| Answer-key printed/PDF pages | 0 / 197 populated | 197 / 197 populated |
| Reconciled answer slots | 1,779 / 1,799 | 1,804 / 1,804 |
| Vocabulary POS | 1,023 nouns | 403 verbs, 447 nouns, 19 adjectives, 10 adverbs, 7 prepositions, 4 determiners, 4 conjunctions, 124 source-unknown/other |

The false `venir de + infinitif` relation from exercise 4.2 question 10 is absent. Removed regeneration causes cover `French-English`, `English-French glossary`, `amer, amère bitter`, `off rir`, and `verb_whoever_you_are`.

The approved promotions are `savoir + infinitif`, `vouloir + infinitif`, `pouvoir + infinitif`, `devoir + infinitif`, and `prendre des vacances`.

The printed present conjugations for `parler` and `répéter` now have book origins while generated paradigms retain `derived_from_book` provenance.

## Verification

- TypeScript: pass.
- Full dataset rebuild: pass twice; canonical timestamp-free SHA-256 is `251b5c7cdd68d083b0a96dae4212d1b25fd0d38ec496dd58bc5c4e4e6388be3b` both times.
- Schema/semantic/coverage validation: pass; 0 exercise, vocabulary, conjugation, semantic-garbage, broken-relation, and duplicate failures.
- Calculated glossary coverage: 1,941 / 1,941; verb-table coverage: 98 / 98; exercise reconciliation: 1,804 / 1,804.
- New data regressions, expression-promotion fixtures, and all 12 existing smoke tests: pass.

## Remaining issues

None identified by the targeted Sol audit criteria.

READY_FOR_SOL_RECHECK
