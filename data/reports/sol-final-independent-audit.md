# 1. Audit Method

Read-only, risk-based audit of the final artifact and active build path. I queried the JSON with `jq`, inspected only acceptance-relevant code and report fields, ran the independent TypeScript/promotion/smoke/validator checks, rebuilt three times in an isolated `/tmp` copy, and source-checked only the PDF pages needed for disputed expressions and provenance. Anomalies in exercise boundaries and vocabulary typing were expanded deterministically to establish their scope.

# 2. Validation Snapshot

- Final counts are 27 chapters, 80 sections, 93 grammar rules, 16 tenses, 339 verbs, 468 conjugations, 348 expressions, 1,024 vocabulary records, 979 examples, 197 exercises, and 1,799 questions; these match `quality_report` and the latest extraction summary.
- Independent reruns passed TypeScript, the promotion fixture/regression test, Zod/ID/structural-relation validation, duplicate detection, and all 12 smoke tests. Structural broken relations and normalized duplicate candidates are both zero.
- The active pipeline attaches answers before `reconcileGlobal()`, runs exercise promotion before final relation reconciliation, and validates `data/final/french_grammar.json`. Two isolated rebuilds produced the same canonical SHA-256 after removing run timestamps (`9d0e9ea58c33a7c8b2aee6c8205323c7a94dccdf06177fd828d98ccaebd0d693`); raw files differ only because timestamps are regenerated.
- The validator's `passed: true` is not a sufficient acceptance gate: the same run reports 557 vocabulary gaps and 20 exercise gaps, while `passed` ignores both. Coverage ratios for glossary and verb-table ingestion are assigned as constant `1.0`, not calculated completeness checks.

# 3. Exercise-Promotion Findings

The new stage uses generic verb-form, verb-preposition, verb-noun, and formula discovery rather than hardcoded target phrases; deterministic ID helpers, canonical merging, source anchors, conservative holds, and ordinary-pair rejection are implemented. It reproducibly reports five new expressions, 20 existing merges, and 522 holds. `ouvrir la porte`, `regarder un film`, `suivre un cours`, and `prendre le train` remain rejected.

`prendre une décision` occurs once as `expr_prendre_une_decision`, is a collocation, links to `verb_prendre` and `vocab_decision`, has eight distinct anchors across six questions, and has correct verb/vocabulary/question reverse links. The four formula promotions also exist once with concise slot metadata and source-supported meanings.

However, promotion is not acceptance-safe against actual extraction spill. Ten of the 20 merged expressions received at least one spill-derived evidence record (12 suspect attestations total). For example, `venir de + infinitif` is falsely linked to exercise 4.2 question 10 because the real prompt ends at “Elle travaille au centre-ville” and leaked lesson prose contains `venir de`. `quitte à + infinitif` records only two of the five answer-key occurrences. Exercise page provenance is also not exact: every exercise in a chapter receives the chapter opening page; the `prendre une décision` occurrence printed on page 70 is stored as page 65, and chapter-27 answers printed on page 272 are stored as page 230.

# 4. Five Ambiguous Candidate Decisions

- **PROMOTE — `savoir + infinitif`:** the book explicitly gives “to know (how to),” a worked example, and repeated exercise evidence.
- **PROMOTE — `vouloir + infinitif`:** the no-preposition lesson explicitly gives “to want to,” with a worked contrast and 24 detected questions.
- **PROMOTE — `pouvoir + infinitif`:** the source explicitly teaches “can, to be able to,” supported by 11 questions and six translations.
- **PROMOTE — `devoir + infinitif`:** the source explicitly teaches “must, to have to,” supported by 17 questions and 12 translations.
- **PROMOTE — `prendre des vacances`:** five independent questions, a direct “take a vacation” translation, repeated lesson/answer-key use, and existing `verb_prendre`/`vocab_vacances` make this a useful collocation rather than a guessed fragment.

All five require additions to the authoritative dataset; none matches an existing canonical expression.

# 5. Regression/Semantic Sampling Results

- Chapter 14 `à`/`de` expression lists, the known expressions `avoir besoin de`, `venir de + infinitif`, `faire attention à`, `demander à qqn de + infinitif`, and the representative early/middle/late and low/high-count examples remain present and useful.
- Both glossary directions are ingested, and `vedette` correctly preserves “star (film).” The `beau (bel, belle)` regression does not pass: `vocab_beau` is typed as a noun and has no adjective/variant structure.
- Conjugation sampling covers regular, pronominal, stem-changing, and irregular verbs. Of 468 records, 74 printed records are `book` and 392 generated records are `derived_from_book` with derivation IDs; the two printed present tables for `parler` and `répéter` incorrectly have `origin: null`. Page-239 samples are confined to verb-table provenance.
- Exercise/answer matching is 1,779/1,799, but boundary quality fails: 80 prompts exceed 250 characters, 70 exceed 500, and 48 exceed 1,000 because following lessons were appended. All 197 `answer_key_source.page_printed` values are null.
- Structural foreign keys resolve, but semantic garbage remains, including auto-registered `verb_whoever_you_are` linked from two formula questions. Canonical rebuild duplicate checks remain clean.

# 6. Remaining Problems

1. Fix exercise field boundaries, remove spill-derived promotion links/attestations, preserve exact exercise and answer-key pages, and rerun promotion.
2. Promote the five reviewed candidates and re-audit all newly affected links.
3. Correct glossary part-of-speech modeling: 1,023/1,024 vocabulary records are typed as nouns, including 404 records whose English starts with “to” and adjectives such as `beau`.
4. Remove remaining garbage/header/ligature records such as `French-English`, `English-French glossary`, `amer, amère bitter`, and `off rir`, plus false auto-registered verbs.
5. Set the two null printed-conjugation origins to `book`, and make validation/coverage fail on material semantic, exercise, provenance, and vocabulary gaps rather than reporting completion.

# 7. Final Verdict

The artifact is structurally reproducible and duplicate-free, and the new promotion architecture is directionally sound, but the required candidate additions, false promotion attestations, systemic exercise spill/page provenance, vocabulary typing failures, and remaining garbage are material to learning value and data integrity. It must not be frozen.

TARGETED_FIX_REQUIRED
