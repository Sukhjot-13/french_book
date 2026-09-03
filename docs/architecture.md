# Project Architecture: French Grammar Revision Platform

## Overview
A comprehensive French grammar, conjugation, and vocabulary revision platform built with Next.js (App Router), React 19, TypeScript, and Tailwind CSS. The platform maps rich lexical and pedagogical data from the French grammar reference into an intuitive, cross-referenced learning experience.

---

## Environment Variables
*No external environment variables are required by this project at present.*
- All data is statically loaded server-side from local JSON datasets (`data/MASTER_DATA.json`).
- `PORT` (optional): Standard Node.js / Next.js server port (defaults to 3000).

---

## Key User & Data Flows

### 1. The 3-Level Progressive Disclosure Flow (Scan → Peek → Deep Dive)
- **Level 1 (Scan)**: High-density tables and lists designed for fast visual triage and revision (e.g., [`VerbLibraryTable`](file:///Users/sukhjot/codes/book/src/components/verbs/VerbLibraryTable.tsx), [`VocabDictionaryTable`](file:///Users/sukhjot/codes/book/src/components/vocabulary/VocabDictionaryTable.tsx), [`GrammarLibraryTable`](file:///Users/sukhjot/codes/book/src/components/grammar/GrammarLibraryTable.tsx), [`ExpressionLibraryTable`](file:///Users/sukhjot/codes/book/src/components/expressions/ExpressionLibraryTable.tsx)). Emphasizes compact rows, monospace formatting, instant alphabet jump bars, and facet filters without overwhelming whitespace.
- **Level 2 (Peek)**: Non-disruptive slide-over drawer ([`PeekDrawer`](file:///Users/sukhjot/codes/book/src/components/peek/PeekDrawer.tsx) on desktop / bottom sheet on mobile) managed by [`PeekContext`](file:///Users/sukhjot/codes/book/src/components/peek/PeekContext.tsx) and served by the lightweight [`/api/peek`](file:///Users/sukhjot/codes/book/app/api/peek/route.ts) route. Users can click any table row or "Peek" badge to inspect key facts, core stems, traps, and verbal constructions in <150ms without losing scroll position or leaving their current revision workflow.
- **Level 3 (Deep Dive)**: Dedicated full-page routes ([`/verbs/[id]`](file:///Users/sukhjot/codes/book/app/verbs/[id]/page.tsx), [`/grammar/[id]`](file:///Users/sukhjot/codes/book/app/grammar/[id]/page.tsx), [`/expressions/[id]`](file:///Users/sukhjot/codes/book/app/expressions/[id]/page.tsx), [`/tenses/[id]`](file:///Users/sukhjot/codes/book/app/tenses/[id]/page.tsx), [`/chapters/[id]`](file:///Users/sukhjot/codes/book/app/chapters/[id]/page.tsx)). Houses exhaustive pedagogical materials: 6-form mood conjugation grids, syntactic pattern slot breakdowns, contrast-with rules, and practice drills with revealable answers.

### 2. Universal Search & Command Palette Flow
- **Trigger**: Pressing `Cmd+K` (macOS), `Ctrl+K` (Windows/Linux), or `/` anywhere opens [`CommandPalette`](file:///Users/sukhjot/codes/book/src/components/search/CommandPalette.tsx).
- **Execution**: Debounced live input queries [`/api/search?q=...`](file:///Users/sukhjot/codes/book/app/api/search/route.ts) which runs [`searchDataset()`](file:///Users/sukhjot/codes/book/src/lib/data/search.ts). Searches across all 10 master collections simultaneously using accent/diacritic-insensitive French normalization ([`normalizeFrenchText`](file:///Users/sukhjot/codes/book/src/lib/data/search.ts)).
- **Action**: Results are categorized by entity type with direct navigation (`Enter`), arrow-key selection, or Level 2 inspection.

### 3. Resilient ID Resolution & URL Routing Flow
- **Resolution Strategy**: Dynamic routes receive parameters that may be percent-encoded (`Present%20tense...`), accented (`(s')asseoir`), or slugified (`present_tense...`).
- **Pipeline**: Selectors in [`selectors.ts`](file:///Users/sukhjot/codes/book/src/lib/data/selectors.ts) utilize `safeDecode()` to resolve both raw and decoded strings against primary keys, canonical forms, display forms, and normalized slugs.

### 4. Server-Side Master Data Pipeline
- **Storage**: Master JSON database stored in [`data/MASTER_DATA.json`](file:///Users/sukhjot/codes/book/data/MASTER_DATA.json) (15.4 MB, validated against [`data/MASTER_SCHEMA.json`](file:///Users/sukhjot/codes/book/data/MASTER_SCHEMA.json)).
- **Loader**: [`getMasterDataset()`](file:///Users/sukhjot/codes/book/src/lib/data/loader.ts) loads the JSON once from disk and caches the parsed in-memory representation in process memory, delivering zero-latency server-side rendering.
- **View-Model Mapping**: Specialized selector functions in [`selectors.ts`](file:///Users/sukhjot/codes/book/src/lib/data/selectors.ts) sanitize and transform raw JSON into UI-safe contracts (e.g. flattening nested article objects, cross-linking related verbs, building reverse index lookups).

---

## Codebase File Inventory & Functions

### 1. Configuration & Guidelines

#### `package.json`
- **Purpose**: Project metadata, scripts (`dev`, `build`, `start`, `lint`, `test`), and dependencies (Next.js 16, React 19, Tailwind CSS, Zod 4, tsx).
- **Functions**: N/A (JSON configuration).

#### `package-lock.json`
- **Purpose**: Deterministic lockfile tracking exact package versions and dependency tree resolutions.
- **Functions**: N/A (JSON lockfile).

#### `next.config.ts`
- **Purpose**: Next.js framework configuration object.
- **Functions**: N/A (configuration object export).

#### `next-env.d.ts`
- **Purpose**: Auto-generated Next.js TypeScript declarations and compiler ambient types.
- **Functions**: N/A (TypeScript ambient definitions).

#### `tsconfig.json`
- **Purpose**: TypeScript compiler options, strict mode, path aliases (`@/*`), and build target definitions.
- **Functions**: N/A (JSON configuration).

#### `tsconfig.tsbuildinfo`
- **Purpose**: Incremental TypeScript compiler cache maintaining project graph and speed-ups.
- **Functions**: N/A (Binary compiler state cache).

#### `postcss.config.mjs`
- **Purpose**: PostCSS configuration loading `@tailwindcss/postcss`.
- **Functions**: N/A (ES module export).

#### `eslint.config.mjs`
- **Purpose**: ESLint flat configuration for Next.js core web vitals and TypeScript rules.
- **Functions**: N/A (ES module export).

#### `GEMINI.md` / `CLAUDE.md`
- **Purpose**: AI pair-programming rules, architectural guidelines, test requirements, docs synchronization rules, and local commit workflow standards.
- **Functions**: N/A (Markdown guidelines).

#### `docs/architecture.md`
- **Purpose**: Exhaustive codebase inventory documenting every file's purpose, all functions and their roles, and environment variables.
- **Functions**: N/A (Markdown documentation).

#### `docs/suggestions.md`
- **Purpose**: Living roadmap tracking feature suggestions, architectural improvements, and vulnerability audits.
- **Functions**: N/A (Markdown documentation).

#### `gptsugg.txt`
- **Purpose**: Tracks remaining optional UI refinements from the original 22-part "Scan → Peek → Deep Dive" design improvement plan.
- **Functions**: N/A (Text specification).

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

#### `app/favicon.ico`
- **Purpose**: Browser tab favicon icon branding the French revision platform.
- **Functions**: N/A (Binary icon file).

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

#### `app/api/peek/route.ts`
- **Purpose**: Universal Level 2 Peek API endpoint providing lightweight preview summaries for verbs, expressions, grammar rules, tenses, and vocabulary without full-page reloads.
- **Functions**:
  - `GET(request)`: Handles `?type={verb|expression|grammar|tense|vocab}&id={id}` requests and returns structured peek payloads.

---

### 3. UI Components (`src/components/`)

#### `src/components/layout/AppShell.tsx`
- **Purpose**: Responsive layout shell providing desktop sidebar navigation (with live counts for all 10 entity collections), mobile drawer, breadcrumbs, command palette integration, PeekDrawer mount, and global keyboard shortcuts.
- **Functions**:
  - `AppShell({ children })`: Client component wrapping pages with consistent application chrome.

#### `src/components/common/GlobalKeyboardShortcuts.tsx`
- **Purpose**: Global keyboard event handler providing power-user navigation across table rows and modal views (`/`, `Cmd+K`, `Esc`, `j`, `k`, `o`, `Enter`, `Space`).
- **Functions**:
  - `GlobalKeyboardShortcuts()`: Client listener mounted in AppShell.

#### `src/components/peek/PeekContext.tsx`
- **Purpose**: Global React Context provider managing Level 2 peek drawer state, selected entity type and ID, and asynchronous data fetching.
- **Functions**:
  - `PeekProvider({ children })`: Context provider component.
  - `usePeek()`: Hook returning peek state (`activePeek`, `peekData`, `loading`, `openPeek`, `closePeek`).

#### `src/components/peek/PeekDrawer.tsx`
- **Purpose**: Right-side slide-over drawer (desktop) / bottom sheet (mobile) rendering Level 2 entity previews with key facts, constructions, pitfalls, and deep-dive links.
- **Functions**:
  - `PeekDrawer()`: Slide-over UI component mounted globally in AppShell.

#### `src/components/peek/PeekTrigger.tsx`
- **Purpose**: Reusable interactive trigger button/link that invokes `openPeek(type, id)` from anywhere in the application.
- **Functions**:
  - `PeekTrigger({ type, id, label, className, children })`: Clickable trigger component.

#### `src/components/verbs/VerbLibraryTable.tsx`
- **Purpose**: Dense scan-and-peek table for the 496 verbs library with inline filters, quick preview triggers, and row click handling.
- **Functions**:
  - `VerbLibraryTable({ verbs, total, currentPage, pageSize, initialGroup, initialRegularity, initialAuxiliary, initialQuery })`: Interactive client table component.

#### `src/components/verbs/VerbDetailView.tsx`
- **Purpose**: Systematic 3-level detail view for verbs featuring mood tabs (Indicatif, Conditionnel, Subjonctif, Impératif), accessible keyboard-navigable tense accordion rows with embedded peek triggers, smart "Show More" limits, peek triggers for expressions, and demoted technical metadata.
- **Functions**:
  - `VerbDetailView({ verb, conjugations, expressions, grammarRules, examples })`: Client detail component.

#### `src/components/vocabulary/VocabDictionaryTable.tsx`
- **Purpose**: Dense alphabetical A-Z dictionary table for 1,002 vocabulary items with alphabet jump bar, part of speech filtering, and row-click Level 2 peek.
- **Functions**:
  - `VocabDictionaryTable({ vocabulary, total, currentPage, pageSize, initialQuery, initialLetter, initialPos })`: Interactive client dictionary table.

#### `src/components/expressions/ExpressionLibraryTable.tsx`
- **Purpose**: Dense scan table for 557 idiomatic expressions emphasizing syntactic pattern formulas, preposition filters (à, de, en, sur, pour, avec), and row-click Level 2 peek.
- **Functions**:
  - `ExpressionLibraryTable({ expressions, total, currentPage, pageSize, initialQuery, initialPreposition, initialBaseVerb })`: Interactive client expressions table.

#### `src/components/expressions/ExpressionDetailView.tsx`
- **Purpose**: Syntactic deep dive view for expressions highlighting pattern formulas, base verbs with Peek triggers, sentence examples with smart limits, and demoted attestation metadata.
- **Functions**:
  - `ExpressionDetailView({ expression, verbs, examples, vocabulary })`: Client detail component.

#### `src/components/grammar/GrammarLibraryTable.tsx`
- **Purpose**: Dense scan table for 284 grammar rules with formation formula previews, trap counters, and row-click Level 2 peek.
- **Functions**:
  - `GrammarLibraryTable({ rules, total, currentPage, pageSize, initialQuery, initialCategory })`: Interactive client grammar table.

#### `src/components/grammar/GrammarDetailView.tsx`
- **Purpose**: Grammar rule deep dive featuring 2-box summary capsule ("When to Use" and "Watch Out / Common Trap"), formation formula, peek-enabled related verbs/tenses, and smart examples.
- **Functions**:
  - `GrammarDetailView({ rule, tenses, verbs, examples, traps })`: Client detail component.

#### `src/components/tenses/TenseDetailView.tsx`
- **Purpose**: Tense deep dive with 4-part Quick-Reference Card (Formula, When to Use, Signal Words, Agreement & Traps), verb inflection matrix with search & Peek, and linked grammar rules.
- **Functions**:
  - `TenseDetailView({ tense, conjugations, grammarRules, examples, traps })`: Client detail component.

#### `src/components/chapters/ChapterDetailView.tsx`
- **Purpose**: Chapter dashboard featuring 1-screen Quick Cheat Sheet (Key Verbs, Core Rule, Essential 5 Vocab, #1 Trap to Avoid) and tabbed navigation (Overview, Grammar, Verbs, Vocab, Expressions, Practice).
- **Functions**:
  - `ChapterDetailView({ chapter, sections, grammarRules, verbs, vocabulary, expressions, exercises, examples })`: Client detail component.

#### `src/components/examples/ExampleExplorerList.tsx`
- **Purpose**: Interactive bilingual sentence list with clickable entity tags triggering Level 2 peek for verbs, tenses, and grammar rules directly in context.
- **Functions**:
  - `ExampleExplorerList({ examples })`: Client list component with peek triggers.

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
  - `getVerbById(id)`: Retrieves full detail for a single verb including conjugations, expressions, rules, and examples. Supports raw and URL-decoded IDs.
  - `getExpressions(filters)`: Retrieves filtered list of idiomatic expressions with pattern slots and collocations.
  - `getExpressionById(id)`: Retrieves single expression detail. Supports raw and URL-decoded IDs.
  - `getVocabulary(filters)`: Retrieves filtered vocabulary words with safely normalized articles (defensively handles string, array, and object representations), gender, plural forms, and senses.
  - `getVocabularyById(id)`: Retrieves single vocabulary detail with related expressions and examples. Supports raw and URL-decoded IDs.
  - `getGrammarRules(filters)`: Retrieves grammar rules list.
  - `getGrammarRuleById(id)`: Retrieves single grammar rule with formation, transformations, traps, and cross-links. Supports raw, URL-decoded, and slugified rule titles.
  - `getTenses()`: Retrieves all 24 tenses organized by mood.
  - `getTenseById(id)`: Retrieves single tense detail with regular patterns, irregular stems, agreement rules, and common traps. Supports raw and URL-decoded IDs.
  - `getChapters()`: Retrieves all 27 chapters.
  - `getChapterById(id)`: Retrieves chapter with linked concepts, rules, verbs, expressions, vocabulary, and exercises. Supports numeric and slug IDs.
  - `getExamples(filters)`: Retrieves example sentences with focus spans.
  - `getExercises(filters)`: Retrieves exercises with questions, options, hints, and answers.
  - `getExerciseById(id)`: Retrieves single exercise detail. Supports raw, dotted, and legacy slug IDs.
  - `getExceptionsAndTraps(filters)`: Retrieves the 108 curated common pitfalls with correct vs incorrect forms.
  - `getConcepts()`: Retrieves the 206 grammatical concepts.

#### `src/lib/data/search.ts`
- **Purpose**: In-memory search indexing and fuzzy/prefix matching over French text with accent normalization across master dataset entities (verbs, rules, tenses, expressions, vocabulary, exercises, traps, examples, chapters).
- **Functions**:
  - `normalizeFrenchText(text)`: Lowercases, removes diacritics, and normalizes punctuation for search indexing.
  - `searchDataset(dataset, query, limit)`: Searches across all master entities and returns categorized, ranked matches.

---

### 5. Dataset Engine & Utilities (`src/lib/dataset/`)

#### `src/lib/dataset/masterSchema.ts`
- **Purpose**: Authoritative TypeScript type definitions matching the complete `MASTER_SCHEMA.json` specifications and entity structures.
- **Functions**: Type exports (`MasterDataset`, `MasterVerb`, `MasterTense`, `MasterGrammarRule`, `MasterExpression`, `MasterVocabulary`, `MasterExample`, `MasterExercise`, `MasterExceptionTrap`, `MasterConcept`, `MasterChapter`).

#### `src/lib/dataset/schemas.ts`
- **Purpose**: Comprehensive Zod schemas defining types and contracts for chapters, rules, verbs, conjugations, vocabulary, expressions, and quality reports.
- **Functions**: Schema definitions and type exports.

#### `src/lib/dataset/schemas.js`
- **Purpose**: Compiled JavaScript companion module for schemas.
- **Functions**: Compiled schema objects.

#### `src/lib/dataset/ids.ts`
- **Purpose**: Deterministic identifier generation and slugification for all dataset entities.
- **Functions**:
  - `stripAccents(str)`: Removes French diacritics.
  - `slugify(str)`: Converts text to standard URL/ID friendly slug.
  - `makeBookId()`, `makeChapterId()`, `makeSectionId()`, `makeConceptId()`, `makeTenseId()`, `makeRuleId()` (includes accented discriminator to avoid collisions between `-e` and `-é` rules), `makeVerbId()`, `makeConjugationId()`, `makeExpressionId()`, `makeVocabId(word, pos)` (supports string or object), `makeExampleId()`, `makeExerciseId()`, `makeQuestionId()`, `makeStudySetId()`: Entity-specific slug builders.
  - `isValidId(id)`: Validates ID prefix and format.

#### `src/lib/dataset/ids.js`
- **Purpose**: Compiled JavaScript companion module for entity ID generators.
- **Functions**: Compiled ID helper functions.

#### `src/lib/dataset/canonicalize.ts`
- **Purpose**: De-duplication and canonicalization of lexical items from disparate extraction sources.
- **Functions**:
  - `mergeAttestations()`, `deduplicateArray()`, `canonicalizeVerb()`, `canonicalizeVocabularyEntry()`, `canonicalizeExpressionEntry()`, `canonicalizeVerbs()`, `canonicalizeVocabulary()`, `canonicalizeExpressions()`.

#### `src/lib/dataset/canonicalize.js`
- **Purpose**: Compiled JavaScript companion module for canonicalization routines.
- **Functions**: Compiled canonicalization helper functions.

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

### 6. Stylesheets & Design Tokens (`src/styles/`)

#### `src/styles/theme.css`
- **Purpose**: Universal CSS design tokens declaring the Oxford Blue palette, CEFR colors, priority colors, surface containers, and typography variables.
- **Functions**: N/A (CSS stylesheet / token definitions).

---

### 7. Data Assets (`data/`) [READ-ONLY]

#### `data/MASTER_DATA.json`
- **Purpose**: Unified, authoritative master database (15.4 MB) containing all 10 collections: 27 chapters, 496 verbs, 284 grammar rules, 24 tenses, 557 expressions, 1,002 vocabulary entries, 1,011 examples, 217 exercises, 108 exceptions & traps, and 206 concepts.
- **Functions**: N/A (JSON database).

#### `data/MASTER_SCHEMA.json`
- **Purpose**: Formal JSON Schema defining schema specifications, entity model `$defs`, and type validations for all collections in `MASTER_DATA.json`.
- **Functions**: N/A (JSON Schema).

---

### 8. Testing Suite (`tests/`)

#### `tests/run-all.test.ts`
- **Purpose**: Unified single test runner entry-point validating data presence, entity counts, selectors, and schema compliance across the platform.
- **Functions**: Executable test script asserting data health and selector accuracy.

---

### 9. UI Design Prototypes & Specifications (`ui/stitch_l_atlas_de_fran_ais/`)

#### `ui/stitch_l_atlas_de_fran_ais/l_acad_mie_digitale/DESIGN.md`
- **Purpose**: Master design system specifications documenting typography scale, Oxford Blue / French academic palette, layout grid, elevation, and component guidelines.
- **Functions**: N/A (Design specification).

#### `ui/stitch_l_atlas_de_fran_ais/revision_home/code.html` & `screen.png`
- **Purpose**: High-fidelity static HTML prototype and screenshot reference for the Revision Home dashboard.
- **Functions**: N/A (Prototype & visual reference).

#### `ui/stitch_l_atlas_de_fran_ais/chapters_library/code.html` & `screen.png`
- **Purpose**: Static HTML prototype and screenshot reference for the Chapters Library directory.
- **Functions**: N/A (Prototype & visual reference).

#### `ui/stitch_l_atlas_de_fran_ais/chapter_12_detail_advanced_revision/code.html` & `screen.png`
- **Purpose**: Static HTML prototype and screenshot reference for the single-chapter study view.
- **Functions**: N/A (Prototype & visual reference).

#### `ui/stitch_l_atlas_de_fran_ais/verbs_library/code.html` & `screen.png`
- **Purpose**: Initial static HTML prototype and screenshot reference for the Verbs Library catalog.
- **Functions**: N/A (Prototype & visual reference).

#### `ui/stitch_l_atlas_de_fran_ais/verbs_library_refined/code.html` & `screen.png`
- **Purpose**: Refined static HTML prototype and screenshot reference for the Verbs Library catalog with transitivity and CEFR filters.
- **Functions**: N/A (Prototype & visual reference).

#### `ui/stitch_l_atlas_de_fran_ais/verb_detail_prendre/code.html` & `screen.png`
- **Purpose**: Static HTML prototype and screenshot reference for the Verb Detail page and conjugation matrix.
- **Functions**: N/A (Prototype & visual reference).

#### `ui/stitch_l_atlas_de_fran_ais/tenses_moods_library/code.html` & `screen.png`
- **Purpose**: Static HTML prototype and screenshot reference for the Tenses & Moods Atlas directory.
- **Functions**: N/A (Prototype & visual reference).

#### `ui/stitch_l_atlas_de_fran_ais/tense_detail_conditionnel_pr_sent/code.html` & `screen.png`
- **Purpose**: Static HTML prototype and screenshot reference for the Tense Detail view with formation formulas.
- **Functions**: N/A (Prototype & visual reference).

#### `ui/stitch_l_atlas_de_fran_ais/grammar_library/code.html` & `screen.png`
- **Purpose**: Static HTML prototype and screenshot reference for the Grammar Rules Library directory.
- **Functions**: N/A (Prototype & visual reference).

#### `ui/stitch_l_atlas_de_fran_ais/expressions_library/code.html` & `screen.png`
- **Purpose**: Initial static HTML prototype and screenshot reference for the Expressions Library.
- **Functions**: N/A (Prototype & visual reference).

#### `ui/stitch_l_atlas_de_fran_ais/constructions_library/code.html` & `screen.png`
- **Purpose**: Static HTML prototype and screenshot reference for the Verbal Constructions directory.
- **Functions**: N/A (Prototype & visual reference).

#### `ui/stitch_l_atlas_de_fran_ais/constructions_library_refined/code.html` & `screen.png`
- **Purpose**: Refined static HTML prototype and screenshot reference for the Verbal Constructions directory with pattern slots.
- **Functions**: N/A (Prototype & visual reference).

#### `ui/stitch_l_atlas_de_fran_ais/vocabulary_library/code.html` & `screen.png`
- **Purpose**: Initial static HTML prototype and screenshot reference for the Vocabulary Lexicon.
- **Functions**: N/A (Prototype & visual reference).

#### `ui/stitch_l_atlas_de_fran_ais/global_dictionary_refined_table_view/code.html` & `screen.png`
- **Purpose**: Refined static HTML prototype and screenshot reference for the Lexicon table view with articles and gender tags.
- **Functions**: N/A (Prototype & visual reference).

#### `ui/stitch_l_atlas_de_fran_ais/global_example_explorer/code.html` & `screen.png`
- **Purpose**: Static HTML prototype and screenshot reference for the Global Example Explorer with highlight spans.
- **Functions**: N/A (Prototype & visual reference).

#### `ui/stitch_l_atlas_de_fran_ais/exceptions_traps_library/code.html` & `screen.png`
- **Purpose**: Static HTML prototype and screenshot reference for the Exceptions & Pitfalls Library with correct vs. incorrect comparison cards.
- **Functions**: N/A (Prototype & visual reference).

#### `ui/stitch_l_atlas_de_fran_ais/global_search_command_palette/code.html` & `screen.png`
- **Purpose**: Static HTML prototype and screenshot reference for the quick command palette modal.
- **Functions**: N/A (Prototype & visual reference).

---

### 8. Test Suites (`tests/`)

#### `tests/run-all.test.ts`
- **Purpose**: Unified single entry-point test runner validating master data schema compliance, 10 collection counts, data loader integrity, view model selectors, alphabetical dictionary filtering, expression pattern filtering, and search functionality.
- **Functions**:
  - Validates `data/MASTER_DATA.json` integrity and 10 entity count invariants.
  - Validates `getMasterDataset()` loader caching.
  - Validates selectors (`getHomeStats`, `getVerbs`, `getVerbById`, `getTenses`, `getTenseById`, `getGrammarRules`, `getGrammarRuleById`, `getChapters`, `getChapterById`, `getExercises`, `getExceptionsAndTraps`, `getConcepts`).
  - Validates search indexing and diacritic-insensitive query execution via `searchDataset()`.
  - Validates alphabetical dictionary sort and A-Z letter filtration via `getVocabulary({ letter })`.
  - Validates expression preposition and base-verb filtration via `getExpressions({ preposition, baseVerb })`.
