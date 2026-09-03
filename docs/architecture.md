# Project Architecture: French Grammar Revision Platform

## Overview
A comprehensive French grammar, conjugation, and vocabulary revision platform built with Next.js (App Router), React 19, TypeScript, and Tailwind CSS. The platform maps rich lexical and pedagogical data from the French grammar reference into an intuitive, cross-referenced learning experience.

---

## Environment Variables
*No external environment variables are required by this project at present.*
- All data is statically loaded server-side from local JSON datasets (`data/MASTER_DATA.json`).
- `PORT` (optional): Standard Node.js / Next.js server port (defaults to 3000).

---

## Codebase File Inventory & Functions

### 1. Configuration & Tooling

#### `package.json`
- **Purpose**: Project metadata, dependencies (Next.js 16, React 19, Zod 4), and npm run scripts.
- **Functions**: N/A (JSON configuration).

#### `next.config.ts`
- **Purpose**: Next.js framework configuration.
- **Functions**: N/A (configuration object).

#### `tsconfig.json`
- **Purpose**: TypeScript compiler options, strict mode, path aliases (`@/*`).
- **Functions**: N/A (JSON configuration).

#### `postcss.config.mjs`
- **Purpose**: PostCSS configuration loading `@tailwindcss/postcss`.
- **Functions**: N/A (ES module export).

#### `eslint.config.mjs`
- **Purpose**: ESLint flat configuration for Next.js core web vitals and TypeScript rules.
- **Functions**: N/A (ES module export).

#### `GEMINI.md` / `CLAUDE.md`
- **Purpose**: AI behavior rules, testing standards, architecture documentation requirements, and local commit workflow guidelines.
- **Functions**: N/A (Markdown guidelines).

#### `docs/architecture.md`
- **Purpose**: Always-current file and function inventory, architectural blueprint, and environment variable catalog.
- **Functions**: N/A (Project documentation).

#### `docs/suggestions.md`
- **Purpose**: Categorized log of improvements, new features, and potential vulnerabilities.
- **Functions**: N/A (Project roadmap documentation).

---

### 2. Application Shell & Pages (`app/`)

#### `app/layout.tsx`
- **Purpose**: Root HTML layout with Google fonts (Geist), dark/light theme wrapper, and AppShell embedding.
- **Functions**:
  - `RootLayout({ children })`: Primary root layout component wrapping page content with the application navigation shell.

#### `app/page.tsx`
- **Purpose**: Home dashboard rendering master dataset metrics (verbs, rules, tenses, expressions, vocabulary, exercises, traps, concepts, chapters, examples), quick module cards, and spotlight panels for essential verbs and pitfalls.
- **Functions**:
  - `HomePage()`: Server component displaying curriculum statistics, navigation cards, and curated essentials.

#### `app/globals.css`
- **Purpose**: Global stylesheet declaring Tailwind CSS v4 directives, custom properties, color palette tokens, and scrollbar utilities.
- **Functions**: N/A (CSS stylesheet).

#### `app/chapters/page.tsx`
- **Purpose**: Chapter index explorer displaying all 27 chapters with printed page ranges, section breakdowns, rule counts, and verb counts.
- **Functions**:
  - `ChaptersPage()`: Renders filterable list of all 27 textbook chapters from the master schema.

#### `app/chapters/[id]/page.tsx`
- **Purpose**: Detailed single-chapter page aggregating concepts, sections, grammar rules, vocabulary, verbs, expressions, and interactive chapter exercises with revealable answers.
- **Functions**:
  - `ChapterDetailPage({ params })`: Server component rendering detailed chapter overview and section breakdowns.

#### `app/verbs/page.tsx`
- **Purpose**: French verb index with search, group filter (1st, 2nd, 3rd), regularity, auxiliary (`avoir`/`être`), transitivity, and CEFR level.
- **Functions**:
  - `VerbsPage({ searchParams })`: Renders searchable and filterable verb library with rich badges and past participle markers.

#### `app/verbs/[id]/page.tsx`
- **Purpose**: Comprehensive verb detail view showing infinitive, translation, semantic senses, transitivity, complete conjugation matrix grouped by mood and tense, stems, synonyms/antonyms, usage notes, and related expressions.
- **Functions**:
  - `VerbDetailPage({ params })`: Renders full conjugation tables, notes, and cross-references for a specific verb.

#### `app/tenses/page.tsx`
- **Purpose**: Tenses and moods directory categorized by mood (indicatif, conditionnel, subjonctif, impératif) with formation formulas and common trap alerts.
- **Functions**:
  - `TensesPage()`: Renders interactive directory of all 24 tenses from the master schema.

#### `app/tenses/[id]/page.tsx`
- **Purpose**: Detailed tense guide with formation formulas, usage nuances, regular ending patterns, irregular stems, signal words, agreement rules, and common trap callouts.
- **Functions**:
  - `TenseDetailPage({ params })`: Renders detailed pedagogical explanation, conjugation grid, and related pitfalls for a tense.

#### `app/grammar/page.tsx`
- **Purpose**: Grammar rules and concepts directory organized with search, pagination, formation snippets, exception indicators, and trap alerts.
- **Functions**:
  - `GrammarPage({ searchParams })`: Renders categorized grammar rules list with search and filters.

#### `app/grammar/[id]/page.tsx`
- **Purpose**: Detailed grammar rule page showing explanations, formation formulas, restrictions, conditions, signal words, agreement rules, word order, contrast-with rules, and traps.
- **Functions**:
  - `GrammarDetailPage({ params })`: Renders comprehensive rule guide, associated tenses, governed verbs, and related examples.

#### `app/expressions/page.tsx`
- **Purpose**: Idiomatic expressions and collocations explorer with pattern formulas, expression types, registers, and search filters.
- **Functions**:
  - `ExpressionsPage({ searchParams })`: Renders searchable expressions catalog with register and type filters.

#### `app/expressions/[id]/page.tsx`
- **Purpose**: Detailed expression view showing canonical form, syntactic pattern, pattern slots, prepositions, complement structures, restrictions, underlying core verbs, and related vocabulary.
- **Functions**:
  - `ExpressionDetailPage({ params })`: Renders full expression breakdown, pattern analysis, and contextual examples.

#### `app/vocabulary/page.tsx`
- **Purpose**: Vocabulary library with part-of-speech, gender, article, and word family filters displaying all 1,002 entries from the master schema.
- **Functions**:
  - `VocabularyPage({ searchParams })`: Renders searchable table of vocabulary words with articles, grammatical categories, word family, and senses.

#### `app/examples/page.tsx`
- **Purpose**: Global example sentence explorer with interactive focus spans, target linguistic badges, and bidirectional links to grammar rules, verbs, and chapters.
- **Functions**:
  - `ExamplesPage({ searchParams })`: Renders searchable collection of contextual French-English example sentences.

#### `app/exercises/page.tsx`
- **Purpose**: Dedicated Exercises and Practice Drills library presenting all 217 curriculum exercises with instructions, question prompts, options, and interactive revealable answer keys.
- **Functions**:
  - `ExercisesPage({ searchParams })`: Renders searchable and filterable exercises directory.

#### `app/traps/page.tsx`
- **Purpose**: Dedicated Pitfalls & Common Traps library rendering the 108 curated items with side-by-side correct vs. incorrect form comparisons, explanations, and cross-references.
- **Functions**:
  - `TrapsPage({ searchParams })`: Renders searchable and filterable traps directory.

#### `app/search/page.tsx`
- **Purpose**: Dedicated search page for deep queries across all 10 master collections (verbs, expressions, vocabulary, grammar rules, tenses, chapters, examples, exercises, and traps).
- **Functions**:
  - `SearchPage({ searchParams })`: Renders unified query input and list of matching entity cards.

#### `app/api/search/route.ts`
- **Purpose**: API endpoint for real-time search queries and quick command palette lookups.
- **Functions**:
  - `GET(request)`: Handles search queries and returns matched items grouped by category.

---

### 3. UI Components (`src/components/`)

#### `src/components/layout/AppShell.tsx`
- **Purpose**: Responsive layout shell providing desktop sidebar navigation (with live counts for all 10 entity collections), mobile drawer, breadcrumbs, and command palette integration.
- **Functions**:
  - `AppShell({ children })`: Client component wrapping pages with consistent application chrome.

#### `src/components/search/CommandPalette.tsx`
- **Purpose**: Modal command palette (`Cmd+K` / `Ctrl+K`) for keyboard-first navigation and instant search.
- **Functions**:
  - `CommandPalette()`: Client component managing search dialog, keyboard shortcuts, and live results.

#### `src/components/ui/Badges.tsx`
- **Purpose**: Color-coded badges for linguistic attributes (CEFR, verb group, part of speech, auxiliary, priority, transitivity, mood, register, collocation strength).
- **Functions**:
  - `PriorityBadge({ priority })`: Renders visual priority indicator.
  - `GroupBadge({ group })`: Renders verb group pill (1er, 2e, 3e).
  - `AuxiliaryBadge({ auxiliary })`: Renders auxiliary verb indicator (`avoir` / `être`).
  - `RegularityBadge({ regularity })`: Renders regular / irregular pill.
  - `TransitivityBadge({ transitivity })`: Renders transitivity classification (transitif direct, intransitif, etc.).
  - `PosBadge({ pos })`: Renders part of speech pill.
  - `GenderBadge({ gender })`: Renders masculine / feminine / neutral pill.
  - `RegisterBadge({ register })`: Renders register tag (familiar, formal, literary).
  - `CEFRBadge({ cefr })`: Renders CEFR proficiency level badge (A1 to C2).
  - `MoodBadge({ mood })`: Renders grammatical mood badge (indicatif, subjonctif, etc.).
  - `CollocationBadge({ strength })`: Renders collocation strength badge.

#### `src/components/ui/CrossLink.tsx`
- **Purpose**: Standardized internal navigation link with entity-specific styling and icons.
- **Functions**:
  - `CrossLink({ href, title, subtitle, type, count })`: Renders interactive card/link pointing to internal entities.

---

### 4. Data Layer (`src/lib/data/`)

#### `src/lib/data/loader.ts`
- **Purpose**: Robust, server-side cached data loader reading the master dataset from disk (`data/MASTER_DATA.json`).
- **Functions**:
  - `getMasterDataset()`: Reads and caches master dataset as `MasterDataset` from `data/MASTER_DATA.json`.
  - `getDataset()`: Backward-compatible alias returning `MasterDataset`.

#### `src/lib/data/selectors.ts`
- **Purpose**: Data query layer providing view models and aggregation methods for UI components from the master dataset.
- **Functions**:
  - `getHomeStats()`: Aggregates total counts of verbs, rules, vocabulary, tenses, expressions, examples, exercises, traps, concepts, and chapters.
  - `getVerbs(filters)`: Retrieves filtered and sorted list of verbs with rich attributes (transitivity, senses, conjugations, stems, synonyms).
  - `getVerbById(id)`: Retrieves full detail for a single verb including conjugations, expressions, rules, and examples.
  - `getExpressions(filters)`: Retrieves filtered list of idiomatic expressions with pattern slots and collocations.
  - `getExpressionById(id)`: Retrieves single expression detail.
  - `getVocabulary(filters)`: Retrieves filtered vocabulary words with articles, gender, plural forms, and senses.
  - `getGrammarRules(filters)`: Retrieves grammar rules list.
  - `getGrammarRuleById(id)`: Retrieves single grammar rule with formation, transformations, traps, and cross-links.
  - `getTenses()`: Retrieves all 24 tenses organized by mood.
  - `getTenseById(id)`: Retrieves single tense detail with regular patterns, irregular stems, agreement rules, and common traps.
  - `getChapters()`: Retrieves all 27 chapters.
  - `getChapterById(id)`: Retrieves chapter with linked concepts, rules, verbs, expressions, vocabulary, and exercises.
  - `getExamples(filters)`: Retrieves example sentences with focus spans.
  - `getExercises(filters)`: Retrieves exercises with questions, options, hints, and answers.
  - `getExerciseById(id)`: Retrieves single exercise detail.
  - `getExceptionsAndTraps(filters)`: Retrieves the 108 curated common pitfalls with correct vs incorrect forms.
  - `getConcepts()`: Retrieves the 206 grammatical concepts.

#### `src/lib/data/search.ts`
- **Purpose**: In-memory search indexing and fuzzy/prefix matching over French text with accent normalization across master dataset entities (verbs, rules, tenses, expressions, vocabulary, exercises, traps, examples, chapters).
- **Functions**:
  - `normalizeFrenchText(text)`: Lowercases, removes diacritics, and normalizes punctuation for search indexing.
  - `searchDataset(dataset, query, limit)`: Searches across all master entities and returns categorized, ranked matches.

---

### 5. Dataset Pipeline & Utilities (`src/lib/dataset/`)

#### `src/lib/dataset/masterSchema.ts`
- **Purpose**: Authoritative TypeScript type definitions matching the complete `MASTER_SCHEMA.json` specifications and entity structures.
- **Functions**: Type exports (`MasterDataset`, `MasterVerb`, `MasterTense`, `MasterGrammarRule`, `MasterExpression`, `MasterVocabulary`, `MasterExample`, `MasterExercise`, `MasterExceptionTrap`, `MasterConcept`, `MasterChapter`).

#### `src/lib/dataset/schemas.ts`
- **Purpose**: Comprehensive Zod schemas defining types and contracts for chapters, rules, verbs, conjugations, vocabulary, expressions, and quality reports.
- **Functions**: Schema definitions and type exports.

#### `src/lib/dataset/ids.ts`
- **Purpose**: Deterministic identifier generation and slugification for all dataset entities.
- **Functions**:
  - `stripAccents(str)`: Removes French diacritics.
  - `slugify(str)`: Converts text to standard URL/ID friendly slug.
  - `makeBookId()`, `makeChapterId()`, `makeSectionId()`, `makeConceptId()`, `makeTenseId()`, `makeRuleId()`, `makeVerbId()`, `makeConjugationId()`, `makeExpressionId()`, `makeVocabId(word, pos)` (supports string or object), `makeExampleId()`, `makeExerciseId()`, `makeQuestionId()`, `makeStudySetId()`: Entity-specific slug builders.
  - `isValidId(id)`: Validates ID prefix and format.

#### `src/lib/dataset/canonicalize.ts`
- **Purpose**: De-duplication and canonicalization of lexical items from disparate extraction sources.
- **Functions**:
  - `mergeAttestations()`, `deduplicateArray()`, `canonicalizeVerb()`, `canonicalizeVocabularyEntry()`, `canonicalizeExpressionEntry()`, `canonicalizeVerbs()`, `canonicalizeVocabulary()`, `canonicalizeExpressions()`.

#### `src/lib/dataset/normalize.ts`
- **Purpose**: Text cleaning, OCR artifact cleanup, and normalization routines.
- **Functions**:
  - `normalizeFrenchText(text)`: Accented text normalization.
  - `searchNormalize(text)`: Normalization tailored for search keys.
  - `cleanPdfText(text)`: Strips PDF line-breaks, ligatures, and artifacts.

#### `src/lib/dataset/relations.ts`
- **Purpose**: Builds bi-directional indexes connecting verbs, rules, tenses, and chapters.
- **Functions**:
  - `buildReverseIndexes(dataset)`: Generates reverse lookup tables for relations.

#### `src/lib/dataset/coverage.ts`
- **Purpose**: Evaluates dataset completeness against expected chapter and section coverage.
- **Functions**:
  - `checkCoverage(dataset)`: Audits entities per chapter and flags missing sections.

#### `src/lib/dataset/load.ts`
- **Purpose**: Low-level loader for legacy schema dataset files with Zod validation.
- **Functions**:
  - `loadSuperDataset(filePath)`: Loads and parses dataset against `SuperDatasetRootSchema`.

#### `src/lib/dataset/validators.ts`
- **Purpose**: Dataset integrity verification and cross-reference validation.
- **Functions**:
  - `validateDataset(dataset)`: Validates foreign key relationships and schema adherence.

---

### 6. Stylesheets & Tokens (`src/styles/`)

#### `src/styles/theme.css`
- **Purpose**: Universal CSS design tokens declaring the Oxford Blue palette, CEFR colors, priority colors, surface containers, and typography variables.
- **Functions**: N/A (CSS stylesheet / token definitions).

---

### 7. Testing (`tests/`)

#### `tests/run-all.test.ts`
- **Purpose**: Unified single test runner entry-point validating data presence, entity counts, selectors, and schema compliance.
- **Functions**: Executable test script asserting data health and selector accuracy.

---

### 8. UI Design Prototypes & Specifications (`ui/`)

#### `ui/stitch_l_atlas_de_fran_ais/l_acad_mie_digitale/DESIGN.md`
- **Purpose**: Comprehensive visual design guidelines, typography scale (Hanken Grotesk, JetBrains Mono, Source Serif 4), color philosophy, layout constraints, component rules, and micro-interaction specifications.
- **Functions**: N/A (Design specification document).

#### `ui/stitch_l_atlas_de_fran_ais/*/` (Static HTML & Visual Mockups)
- **Purpose**: High-fidelity static HTML prototypes and screenshot reference captures (`code.html` and `screen.png`) used as visual blueprints for page implementation:
  - `revision_home`: Dashboard and curriculum landing blueprint.
  - `chapters_library` & `chapter_12_detail_advanced_revision`: Chapter index and single-chapter study layout.
  - `verbs_library` & `verbs_library_refined`: Filterable verb catalog and transitivity layout.
  - `verb_detail_prendre`: Full verb detail and conjugation matrix blueprint.
  - `tenses_moods_library` & `tense_detail_conditionnel_pr_sent`: Tense catalog and tense detail page layout.
  - `grammar_library`: Categorized grammar rules catalog blueprint.
  - `expressions_library`, `constructions_library`, `constructions_library_refined`: Idiomatic expressions and pattern slots layout.
  - `global_dictionary_refined_table_view` & `vocabulary_library`: Comprehensive vocabulary dictionary tables.
  - `global_example_explorer`: Bilingual example sentence explorer with highlight spans.
  - `exceptions_traps_library`: Pitfalls and common traps side-by-side comparison layout.
  - `global_search_command_palette`: Keyboard-first command palette dialog.
- **Functions**: N/A (Design mockups and static reference code).


