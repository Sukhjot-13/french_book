# Exercise-derived expression promotion fix

## Root cause

`parse-expressions-enhanced.ts` supplied a static master list, while `enrich-exercises.ts` only added a few heuristic IDs and was never invoked by the active pipeline.  No stage examined reconciled exercise prompts plus answer-key answers to create canonical expressions.  `reconcileGlobal()` could only canonicalize expression objects that already existed.

## Change made

- Added `scripts/enrichment/promote-exercise-expressions.ts`, a deterministic two-stage discovery/promotion pass run by `reconcile-global.ts` after answer attachment and before final relationship/canonical reconciliation.
- Discovery scans clean, bounded prompt and answer text, uses only the final lexical token of each conjugation cell (never subject pronouns), records question-level source anchors, and consumes the mechanical audit at `exercise-expression-candidates.json` as conservative review evidence rather than as an expression allowlist.
- Bilingual section-heading boundaries (including the `Avoir beau and quitte à` structural spill form) terminate an exercise field before evidence is collected.  Formula translations now use a generic shared-English n-gram extractor and slot rendering, so no copied exercise sentence becomes expression metadata.
- Promotion requires recurrence, direct source translation where a learner-facing meaning is needed, canonical verb/vocabulary resolution, and rejects parser spill, singletons, ordinary compositional pairs, and unsupported inferences.  New productive patterns remain held unless explicitly supported; `sol_review` never promotes.
- Added exercise/question/section/chapter links, expression-to-exercise relations, verb and vocabulary reverse links, source-anchor-aware attestation dedupe, and stronger relation/normalized-duplicate validation.

## Final promotion result

Genuine new canonical expressions: **5**.  The four formulaic additions are productive, have typed pattern slots, and use concise shared source translations: `whatever [clause]`, `whatever [noun]`, `whoever [clause]`, and `even if it means [infinitive]`.

- `expr_prendre_une_decision` — `prendre une décision` (collocation)
- `expr_quoi_que_clause`
- `expr_quelle_que_soit_noun`
- `expr_qui_que_clause`
- `expr_quitte_a_inf`

Existing expressions merged with new exercise attestations: **20**.

`expr_menacer_de_inf`, `expr_apprendre_a_inf`, `expr_faire_la_cuisine`, `expr_prendre_un_verre`, `expr_aller_inf`, `expr_venir_de_inf`, `expr_commencer_a_inf`, `expr_tenir_a_inf`, `expr_faire_la_queue`, `expr_faire_la_sieste`, `expr_faire_des_grimaces`, `expr_faire_inf`, `expr_faire_le_plein`, `expr_ce_qui`, `expr_faire_du_sport`, `expr_faire_la_vaisselle`, `expr_avoir_la_grippe`, `expr_aider_a_inf`, `expr_faire_les_courses`, `expr_finir_de_inf`.

The audit's ordinary compositional false positives remain rejected, including `ouvrir la porte` and `regarder un film`; the original mechanical audit also records `suivre un cours` and `prendre le train` as non-promotable.  Singleton/fragment/spill-only candidates are not promoted.

## `prendre une décision` confirmation

Exactly one canonical `expr_prendre_une_decision` exists.  It is a `collocation`, links to `verb_prendre` and `vocab_decision`, and has eight source-anchor-distinct exercise attestations across chapters 8, 9, 10, 21, and 24 (pages 65, 72, 81, 166, and 202).  The promoted vocabulary record is `la décision` (feminine; English `decision`) and points back through `collocation_expression_ids`.  Exercise questions, affected chapters/sections, `expression.relations.exercises`, and `verb_prendre.expression_ids` all resolve.

## Validation and tests

- `npx tsc --noEmit --pretty false` — pass.
- `npx tsx scripts/attach-answer-key.ts` — 1,779 matched; 20 unmatched unchanged source slots.
- `npx tsx scripts/reconcile-global.ts` — pass; repeated rerun is idempotent for canonical expression and attestation identity.
- `npx tsx scripts/test-exercise-expression-promotion.ts` — pass: promotion, existing merge, subject-pronoun false-form prevention, ordinary/singleton/spill/unsupported-inference rejection, bilingual-heading spill prevention, concise formula metadata, targeted decision relations, and idempotence.
- `npx tsx scripts/validate-dataset.ts` — schema errors 0, ID errors 0, broken relations 0.
- `npx tsx scripts/check-coverage.ts` — pass; duplicate report is empty.
- `npx tsx scripts/smoke-tests.ts` — all 12 smoke tests pass.
- Direct final dataset inspection — 348 expressions, 1,024 vocabulary entries, exactly one normalized `prendre une décision` identity.

## Remaining holds

The active scan retains **522** conservative holds.  Five discovered `sol_review` items (`savoir + infinitif`, `vouloir + infinitif`, `pouvoir + infinitif`, `devoir + infinitif`, and `prendre des vacances`) are deliberately not guessed.  The source audit's unpromoted `parler de`, `manquer de`, and `se servir de` remain available for human review even though no unsafe canonical item was created.  Several `clear_new` collocations are also held because the exercises do not independently provide the required canonical noun gender/article plus English support or a safe phrase-level English derivation.

BLOCKERS: human review is still required for the Sol-review candidates and held source-meaning/gender cases; therefore this change is not marked `READY_TO_FREEZE`.
