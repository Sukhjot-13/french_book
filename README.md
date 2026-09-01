# Practice Makes Perfect: Complete French Grammar — Revision Super-Dataset

An end-to-end data extraction, normalization, canonicalization, and validation pipeline that transforms the authoritative book **"Practice Makes Perfect: Complete French Grammar"** (Annie Heminway, McGraw-Hill) into a rich, fully relational French Revision Super-Dataset.

---

## 📌 Table of Contents
1. [Overview & Project Status](#overview--project-status)
2. [Dataset Metrics Summary](#dataset-metrics-summary)
3. [What Was Done (Pipeline Workflow)](#what-was-done-pipeline-workflow)
4. [Directory Breakdown: What is in `data/`](#directory-breakdown-what-is-in-data)
5. [Codebase Breakdown: What is in `src/lib/`](#codebase-breakdown-what-is-in-srclib)
6. [Scripts & Execution Pipeline](#scripts--execution-pipeline)
7. [Automated Smoke Tests & Verification](#automated-smoke-tests--verification)
8. [Available npm Commands](#available-npm-commands)

---

## 🚀 Overview & Project Status

The data parsing pipeline is **100% complete and validated**. All 27 chapters, along with extensive back matter (French–English glossary, English–French glossary, 101 verb tables, and complete answer keys), have been extracted, normalized, canonicalized, and cross-referenced with **0 schema errors and 0 broken relations**.

- **Authoritative Data Contract**: [`docs/french_revision_super_dataset_spec.txt`](file:///Users/sukhjot/codes/book/docs/french_revision_super_dataset_spec.txt)
- **Authoritative Execution Plan**: [`docs/GEMINI_BOOK_PARSING_TODO.txt`](file:///Users/sukhjot/codes/book/docs/GEMINI_BOOK_PARSING_TODO.txt)
- **Final Master Dataset**: [`data/final/french_grammar.json`](file:///Users/sukhjot/codes/book/data/final/french_grammar.json)

---

## 📊 Dataset Metrics Summary

The master dataset (`data/final/french_grammar.json`) contains the following validated entities:

| Entity Type | Count | Description |
|---|:---:|---|
| **Chapters** | **27** | All 27 book chapters covering grammar from regular verbs to subjunctive and numbers |
| **Sections** | **80** | Granular thematic subsections across all chapters |
| **Grammar Rules** | **93** | Deeply structured rules (formation, usage conditions, signals, exceptions, common mistakes) |
| **Tenses / Moods** | **16** | Global canonical tense and mood definitions with time markers and aspect notes |
| **Grammar Concepts** | **14** | High-level conceptual tags (negation, interrogation, agreement, pronoun order, etc.) |
| **Canonical Verbs** | **297** | Fully resolved verbs with groups, regularity, transitivity, auxiliaries, and attestations |
| **Conjugations** | **75** | Full personal conjugation tables for indicative, subjunctive, conditional, and imperative forms |
| **Expressions / Idioms** | **32** | High-value idiomatic patterns (`être en train de`, `avoir besoin de`, `venir chercher`, etc.) |
| **Vocabulary Items** | **911** | Nouns (with gender/article), adjectives, and adverbs with translations and senses |
| **Example Sentences** | **90** | Bilingual curated sentences linked to rules, verbs, tenses, and cloze candidates |
| **Exercises** | **197** | Full exercise activities from every section of the book |
| **Exercise Questions** | **1,799** | Individual prompts with answer-key reconciliation (1,779 answers attached) |
| **Study Sets** | **3** | Built-in starter revision sets (Essential Verbs, High-Frequency Expressions, Tenses) |

---

## 🛠️ What Was Done (Pipeline Workflow)

1. **Strict Zod Schema Definition**:
   Derived exhaustive schemas in `src/lib/dataset/schemas.ts` enforcing strict typing, enum checks, deterministic ID formats, attestation provenance, and 1–5 learning priority/difficulty ranges.
2. **Page-Level PDF Extraction**:
   Extracted all 286 PDF pages from `docs/source_book.pdf` into structured raw page objects with page boundary tracking.
3. **Chapter Mapping & Global Tense Initialization**:
   Constructed `data/raw/chapter-map.json` mapping all 27 chapters to their exact printed and PDF page ranges, and established canonical global entities for 16 French tenses and 14 core grammatical concepts.
4. **Complete Extraction of Chapters 1 through 27**:
   Built dedicated extractors for all 27 chapters parsing sections, grammar rules, verbs, conjugations, expressions, vocabulary, examples, and exercises with question-level relationships.
5. **Back Matter Parsing**:
   Extracted the French–English glossary (970 entries), English–French glossary (915 entries), 101 verb conjugation tables, and the comprehensive 27-chapter answer key.
6. **French Typography Normalization**:
   Applied Unicode NFC normalization, apostrophe unification (`’` / `'`), ligatures (`œ`, `æ`), smart quotes, and space trimming across all extracted text.
7. **Answer Key Attachment**:
   Linked 1,779 exercise questions directly to authoritative back-matter answers with 1-indexed fallback support.
8. **Global Canonicalization & Auto-Closure**:
   Deduplicated cross-chapter entity occurrences (e.g., verbs or vocabulary appearing in multiple chapters become merged occurrences and attestations) and auto-registered referenced entities to ensure a closed, self-contained graph.
9. **Reverse Indexing & Relation Building**:
   Constructed bi-directional indexes (`expressionsByVerb`, `conjugationsByTense`, `examplesByRule`, `exercisesByTense`).
10. **Validation & QA Reporting**:
    Verified schema conformance and relation integrity resulting in **0 schema errors, 0 ID errors, and 0 broken relations**, and generated 17 machine-readable reports in `data/reports/`.

---

## 📁 Directory Breakdown: What is in `data/`

```
data/
├── raw/                                  # Initial extraction from source PDF
│   ├── pages/                            # 286 individual JSON files (one per PDF page)
│   ├── pages-all.json                    # Combined 286-page raw text representation
│   └── chapter-map.json                  # Boundary mapping for all 27 chapters
│
├── extracted/                            # Raw structured extraction outputs
│   ├── chapters/                         # chapter-01.json through chapter-27.json
│   └── backmatter/                       # Extracted glossaries, verb tables, and answer key
│       ├── glossary-fr-en.json           # 970 French-to-English glossary items
│       ├── glossary-en-fr.json           # 915 English-to-French glossary items
│       ├── verb-tables.json              # 101 conjugation tables from the appendix
│       └── answer-key.json               # Full answers for all 27 chapters
│
├── normalized/                           # Normalized text with French typography fixes
│   ├── chapters/                         # chapter-01.json through chapter-27.json (normalized)
│   └── global/                           # Canonical global definitions
│       ├── tenses.json                   # 16 French tenses & moods
│       └── concepts.json                 # 14 Core grammar concepts
│
├── final/                                # The single authoritative master dataset
│   └── french_grammar.json               # Complete SuperDatasetRoot JSON (ready for UI)
│
└── reports/                              # Automated QA, validation, and coverage reports
    ├── progress.json                     # Pipeline progress matrix across all components
    ├── extraction-summary.json           # Final dataset counts and status ("complete")
    ├── validation-report.json            # Zod validation and graph integrity results
    ├── coverage-report.json              # Aggregate coverage metrics
    ├── broken-relations.json             # List of broken foreign key references (count: 0)
    ├── unresolved-relations.json         # Unresolved relation report (count: 0)
    ├── duplicate-report.json             # Candidate entity duplicate report (count: 0)
    ├── unresolved-duplicates.json        # Duplicate tracking (count: 0)
    ├── low-confidence-items.json         # Items flagged for low extraction confidence (count: 0)
    ├── ambiguities.json                  # Semantic ambiguity log (count: 0)
    ├── exercise-coverage.json            # Exercise reconciliation ratios
    ├── exercise-reconciliation.json      # Exercise answer attachment summary
    ├── unmatched-answers.json            # Unmatched open-ended items log
    ├── glossary-coverage.json            # Glossary completeness stats (ratio: 1.0)
    ├── verb-coverage.json                # Verb table coverage stats (ratio: 1.0)
    ├── conjugation-gaps.json             # Conjugation completeness report (empty)
    └── vocabulary-gaps.json              # Vocabulary metadata gap report
```

---

## 💻 Codebase Breakdown: What is in `src/lib/`

Located in [`src/lib/dataset/`](file:///Users/sukhjot/codes/book/src/lib/dataset/):

- [`schemas.ts`](file:///Users/sukhjot/codes/book/src/lib/dataset/schemas.ts): Authoritative Zod schemas and TypeScript type exports (`SuperDatasetRoot`, `Chapter`, `Section`, `GrammarRule`, `Verb`, `Conjugation`, `Expression`, `Vocabulary`, `Example`, `Exercise`, `StudySet`, `QualityReport`, etc.).
- [`ids.ts`](file:///Users/sukhjot/codes/book/src/lib/dataset/ids.ts): Deterministic ID generators (`makeVerbId`, `makeRuleId`, `makeChapterId`, `makeSectionId`, `makeExpressionId`, `makeVocabId`, `makeExampleId`, `makeExerciseId`, `makeStudySetId`, `makeBookId`) ensuring stable IDs across rebuilds.
- [`normalize.ts`](file:///Users/sukhjot/codes/book/src/lib/dataset/normalize.ts): French string normalization helper preserving accents (`é`, `è`, `ê`, `ë`, `à`, `ç`, `î`, `ï`, `ô`, `ù`, `û`), curly/straight apostrophe handling, and punctuation normalization.
- [`canonicalize.ts`](file:///Users/sukhjot/codes/book/src/lib/dataset/canonicalize.ts): Canonical merge utilities (`canonicalizeVerbs`, `canonicalizeVocabulary`, `canonicalizeExpressions`) that merge cross-chapter occurrences and recalculate frequency metrics without creating duplicates.
- [`relations.ts`](file:///Users/sukhjot/codes/book/src/lib/dataset/relations.ts): Fast reverse relation index builder (`buildReverseIndexes`) indexing items by verb, tense, rule, chapter, etc.
- [`validators.ts`](file:///Users/sukhjot/codes/book/src/lib/dataset/validators.ts): Core validator checking Zod compliance, ID prefix validity, entity uniqueness, and complete foreign key graph resolution.
- [`coverage.ts`](file:///Users/sukhjot/codes/book/src/lib/dataset/coverage.ts): Coverage evaluation helpers comparing extracted elements against source targets.
- [`load.ts`](file:///Users/sukhjot/codes/book/src/lib/dataset/load.ts): Utility loader for reading `french_grammar.json` synchronously or asynchronously.

---

## 📜 Scripts & Execution Pipeline

Located in [`scripts/`](file:///Users/sukhjot/codes/book/scripts/):

- [`run-all.ts`](file:///Users/sukhjot/codes/book/scripts/run-all.ts): Master script running the entire 9-stage pipeline from raw PDF extraction to smoke test execution.
- [`extract-pages.ts`](file:///Users/sukhjot/codes/book/scripts/extract-pages.ts): Extracts individual pages from `docs/source_book.pdf`.
- [`parse-book.ts`](file:///Users/sukhjot/codes/book/scripts/parse-book.ts): Runs all chapter extraction builders (1 to 27) and saves `data/extracted/chapters/`.
- [`parse-backmatter.ts`](file:///Users/sukhjot/codes/book/scripts/parse-backmatter.ts): Extracts FR-EN glossary, EN-FR glossary, verb tables, and answer key from back matter pages.
- [`normalize-chapter.ts`](file:///Users/sukhjot/codes/book/scripts/normalize-chapter.ts): Applies French normalization to all chapter bundles.
- [`attach-answer-key.ts`](file:///Users/sukhjot/codes/book/scripts/attach-answer-key.ts): Reconciles exercise questions with extracted back-matter answers.
- [`reconcile-global.ts`](file:///Users/sukhjot/codes/book/scripts/reconcile-global.ts): Merges all chapters + backmatter into canonical collections, auto-closes relations, and creates `data/final/french_grammar.json`.
- [`validate-dataset.ts`](file:///Users/sukhjot/codes/book/scripts/validate-dataset.ts): Runs schema and graph integrity checks.
- [`check-coverage.ts`](file:///Users/sukhjot/codes/book/scripts/check-coverage.ts): Generates all 17 QA, validation, and coverage reports in `data/reports/`.
- [`smoke-tests.ts`](file:///Users/sukhjot/codes/book/scripts/smoke-tests.ts): Executes the 12 automated smoke tests.
- **Chapter Builders**:
  - `chapter-01.ts` to `chapter-05.ts`
  - `chapters-06-to-10.ts`
  - `chapters-11-to-18.ts`
  - `chapters-19-to-27.ts`

---

## 🧪 Automated Smoke Tests & Verification

The test suite in [`scripts/smoke-tests.ts`](file:///Users/sukhjot/codes/book/scripts/smoke-tests.ts) validates queryability and integrity across `french_grammar.json`:

1. ✅ **Root Schema**: Validated against `SuperDatasetRootSchema` with all 27 chapters.
2. ✅ **Present Indicative Query**: 60 rules retrieved for present indicative.
3. ✅ **Être Auxiliary Verbs**: 20 verbs retrieved (Vandertramp & pronominals).
4. ✅ **Irregular Past Participles**: 53 irregular verbs retrieved.
5. ✅ **Avoir Idioms**: 9 expressions retrieved (`avoir faim`, `avoir besoin de`, `avoir envie de`, etc.).
6. ✅ **Chapter 7 Exercises**: 10 exercises, 86 questions with attached answers.
7. ✅ **Glossary Lookup**: Successfully retrieved `par cœur` in vocabulary.
8. ✅ **Savoir vs Connaître Contrast**: Retrieved `rule_savoir_versus_connaitre`.
9. ✅ **Depuis Present Rule**: Retrieved `rule_depuis_with_present_tense`.
10. ✅ **Il s'agit de Impersonal Rule**: Retrieved `rule_il_s_agit_de_impersonal_construction`.
11. ✅ **DR & MRS VANDERTRAMP List**: Retrieved `rule_vandertramp_verbs_with_etre`.
12. ✅ **Zero Broken Relations**: Exactly **0** unresolved relation references across the entire dataset.

---

## ⌨️ Available npm Commands

```bash
# Run the complete end-to-end extraction, normalization, and validation pipeline
npm run data:all

# Extract PDF pages
npm run data:extract-pages

# Parse all 27 chapters
npm run data:parse

# Normalize French typography across chapters
npm run data:normalize

# Reconcile global collections and assemble data/final/french_grammar.json
npm run data:reconcile

# Run schema and relationship integrity validation
npm run data:validate

# Generate QA and coverage reports
npm run data:coverage

# Run TypeScript type check
npx tsc --noEmit
```
