# Project Architecture: French Grammar Revision Platform

## Overview
A comprehensive French grammar, conjugation, and vocabulary revision platform built with Next.js (App Router), React 19, TypeScript, and Tailwind CSS. The platform maps rich lexical and pedagogical data from the French grammar reference into an intuitive, cross-referenced learning experience.

---

## Environment Variables
*No external environment variables are required for the app to run.* All data is statically loaded server-side from local JSON datasets (`data/MASTER_DATA.json`).

### Manager (centralized logging + analytics) — OPTIONAL, all nine default to unset

Nothing in this group is required. With all of them unset the integration is a set of no-ops, so local dev, CI and previews behave exactly as before. Read by `src/lib/manager/index.ts`; the full block with comments is in `.env.example`.

**Server half** — read only by Node-side code (route handlers). `MANAGER_ENDPOINT` is the base URL of the **Manager** deployment, *not* this app's own port (a local Manager is `http://127.0.0.1:3300`); pointing it at the app's own dev port makes every log POST fail silently.

| Var | Required? | Purpose | Referenced in |
|---|---|---|---|
| `MANAGER_ENDPOINT` | Optional | Base URL of the **Manager** deployment. Endpoint + app id + log key must all be present before the integration enables itself. | `src/lib/manager/index.ts` → `managerConfig` |
| `MANAGER_APP_ID` | Optional | Project slug in Manager (`french-book`). | `src/lib/manager/index.ts` → `managerConfig` |
| `MANAGER_LOG_KEY` | Optional | Project log key — `mlk_…` for the server. Never exposed to the browser (verified absent from `.next/static`). | `src/lib/manager/index.ts` → `managerConfig` |
| `MANAGER_ANALYTICS_KEY` | Optional | Analytics key (`mak_…`). | `src/lib/manager/index.ts` → `managerConfig.analyticsKey` |
| `MANAGER_LOG_SOURCE` | Optional | `server` (default) or `client`. Inferred when omitted. | `src/lib/manager/index.ts` → `SOURCE` |

**Client half** — required for *any* browser logging or analytics, because Next.js only inlines a literal `process.env.NEXT_PUBLIC_FOO` member expression into the client bundle. `process.env` is an empty object in browser code and a dynamic `process.env[name]` lookup is not inlined either, so a `'use client'` module reading `MANAGER_*` is silently dead. Every value below is written out statically in `src/lib/manager/index.ts` and guarded by a test that reads the facade source.

| Var | Required? | Purpose | Referenced in |
|---|---|---|---|
| `NEXT_PUBLIC_MANAGER_ENDPOINT` | Optional (needed for browser half) | Same value as `MANAGER_ENDPOINT`. | `src/lib/manager/index.ts` → `CLIENT_ENDPOINT` |
| `NEXT_PUBLIC_MANAGER_APP_ID` | Optional (needed for browser half) | Same value as `MANAGER_APP_ID`. | `src/lib/manager/index.ts` → `CLIENT_APP_ID` |
| `NEXT_PUBLIC_MANAGER_CLIENT_KEY` | Optional (needed for browser logs) | The project's **client** key (`mck_…`), not the server key: Manager derives each entry's `source` from the key kind. | `src/lib/manager/index.ts` → `CLIENT_LOG_KEY` |
| `NEXT_PUBLIC_MANAGER_ANALYTICS_KEY` | Optional (needed for analytics) | `mak_…` analytics key. | `src/lib/manager/index.ts` → `CLIENT_ANALYTICS_KEY` |

### Other
- `PORT` (optional): Standard Node.js / Next.js server port (defaults to 3000).

---

## Key User & Data Flows

### 1. The 3-Level Progressive Disclosure Flow (Scan → Peek → Deep Dive)
- **Level 1 (Scan)**: High-density tables and lists designed for fast visual triage and revision (e.g., [`VerbLibraryTable`](file:///Users/sukhjot/codes/github/french_book/src/components/verbs/VerbLibraryTable.tsx), [`VocabDictionaryTable`](file:///Users/sukhjot/codes/github/french_book/src/components/vocabulary/VocabDictionaryTable.tsx), [`GrammarLibraryTable`](file:///Users/sukhjot/codes/github/french_book/src/components/grammar/GrammarLibraryTable.tsx), [`ExpressionLibraryTable`](file:///Users/sukhjot/codes/github/french_book/src/components/expressions/ExpressionLibraryTable.tsx)). Emphasizes compact rows, monospace formatting, instant alphabet jump bars, and facet filters without overwhelming whitespace.
- **Level 2 (Peek)**: Non-disruptive slide-over drawer ([`PeekDrawer`](file:///Users/sukhjot/codes/github/french_book/src/components/peek/PeekDrawer.tsx) on desktop / bottom sheet on mobile) managed by [`PeekContext`](file:///Users/sukhjot/codes/github/french_book/src/components/peek/PeekContext.tsx) and served by the lightweight [`/api/peek`](file:///Users/sukhjot/codes/github/french_book/app/api/peek/route.ts) route. Users can click any table row or "Peek" badge to inspect key facts, core stems, traps, and verbal constructions in <150ms without losing scroll position or leaving their current revision workflow.
- **Level 3 (Deep Dive)**: Dedicated full-page routes ([`/verbs/[id]`](file:///Users/sukhjot/codes/github/french_book/app/verbs/[id]/page.tsx), [`/grammar/[id]`](file:///Users/sukhjot/codes/github/french_book/app/grammar/[id]/page.tsx), [`/expressions/[id]`](file:///Users/sukhjot/codes/github/french_book/app/expressions/[id]/page.tsx), [`/tenses/[id]`](file:///Users/sukhjot/codes/github/french_book/app/tenses/[id]/page.tsx), [`/chapters/[id]`](file:///Users/sukhjot/codes/github/french_book/app/chapters/[id]/page.tsx)). Houses exhaustive pedagogical materials: 6-form mood conjugation grids, syntactic pattern slot breakdowns, contrast-with rules, and practice drills with revealable answers.

### 2. Universal Search & Command Palette Flow
- **Trigger**: Pressing `Cmd+K` (macOS), `Ctrl+K` (Windows/Linux), or `/` anywhere opens [`CommandPalette`](file:///Users/sukhjot/codes/github/french_book/src/components/search/CommandPalette.tsx).
- **Execution**: Debounced live input queries [`/api/search?q=...`](file:///Users/sukhjot/codes/github/french_book/app/api/search/route.ts) which runs [`searchDataset()`](file:///Users/sukhjot/codes/github/french_book/src/lib/data/search.ts). Searches across all 10 master collections simultaneously using accent/diacritic-insensitive French normalization ([`normalizeFrenchText`](file:///Users/sukhjot/codes/github/french_book/src/lib/data/search.ts)).
- **Action**: Results are categorized by entity type with direct navigation (`Enter`), arrow-key selection, or Level 2 inspection.

### 3. Resilient ID Resolution & URL Routing Flow
- **Resolution Strategy**: Dynamic routes receive parameters that may be percent-encoded (`Present%20tense...`), accented (`(s')asseoir`), or slugified (`present_tense...`).
- **Pipeline**: Selectors in [`selectors.ts`](file:///Users/sukhjot/codes/github/french_book/src/lib/data/selectors.ts) utilize `safeDecode()` to resolve both raw and decoded strings against primary keys, canonical forms, display forms, and normalized slugs. `decodeURIComponent` is never called unguarded: `/api/peek` returns `400` for an unusable id rather than a `500`.
- **Vocabulary identity (rewritten 2026-09-28)**: vocabulary ids are no longer derived independently by the table and the detail page. `getVocabIndex()` builds one memoized index of the 1002 records (`byId`, `byCanonical`, `bySlug`) and assigns the deduplicated id once; `getVocabulary()`, `getVocabularyById()`, `resolveVocabularyId()` and `getAllVocabularyIds()` all read from it, so the dictionary table id, the `/vocabulary/[id]` id, the search-result URL and the review-store key are the same string. `getVocabularyById()` matches exact id first, then exact canonical form, then slug — **prefix matching was removed**, because `rawId.startsWith(idBare)` made 188 of 1002 ids render a different record. `makeVocabId()` no longer strips leading articles, so `la Toile`, `Toile` and `toile` are three distinct records. Measured: 188 → 0 mis-resolving ids, 13 → 0 colliding base id groups (1 residual case, `Toile` / `toile`, is disambiguated by the chapter suffix and both resolve to themselves).
- **Static generation**: `generateStaticParams` in [`staticParams.ts`](file:///Users/sukhjot/codes/github/french_book/src/lib/data/staticParams.ts) enumerates every id for the seven dynamic detail routes, so all 2614 detail pages are prerendered at build time. The seven filterable list routes stay dynamic because they read `searchParams`.

### 4. Server-Side Master Data Pipeline
- **Storage**: Immutable source master JSON database stored in [`data/MASTER_DATA.json`](file:///Users/sukhjot/codes/github/french_book/data/MASTER_DATA.json), validated against [`data/MASTER_SCHEMA.json`](file:///Users/sukhjot/codes/github/french_book/data/MASTER_SCHEMA.json). There is no active derived dataset after the 2026-09-10 enrichment reset; any future enrichment output must be separately named under `enrichment/` and never replace the source dataset.
- **Loader**: [`getMasterDataset()`](file:///Users/sukhjot/codes/github/french_book/src/lib/data/loader.ts) loads the JSON once from disk and caches the parsed in-memory representation in process memory, delivering zero-latency server-side rendering.
- **View-Model Mapping**: Specialized selector functions in [`selectors.ts`](file:///Users/sukhjot/codes/github/french_book/src/lib/data/selectors.ts) sanitize and transform raw JSON into UI-safe contracts (e.g. flattening nested article objects, cross-linking related verbs, building reverse index lookups).

---

## Codebase File Inventory & Functions

### 1. Configuration & Guidelines

#### `package.json`
- **Purpose**: Project metadata, scripts (`dev`, `build`, `start`, `lint`, `test`, `data:coverage-report`) and dependencies (Next.js 16, React 19, `pdf-parse`, Tailwind CSS, tsx). 2026-09-28 cleanup: the nine `data:*` scripts pointing at files that do not exist (`extract-pages`, `parse-book`, `normalize-chapter`, `reconcile-global`, `validate-dataset`, `check-coverage`, `build-final-dataset`, `test-data-regressions`, `run-all`) and the `zod` runtime dependency (used only by the deleted `src/lib/dataset/schemas.ts`) were removed.
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

#### `postcss.config.mjs`
- **Purpose**: PostCSS configuration loading `@tailwindcss/postcss`.
- **Functions**: N/A (ES module export).

#### `eslint.config.mjs`
- **Purpose**: ESLint flat configuration for Next.js core web vitals and TypeScript rules.
- **Functions**: N/A (ES module export).

#### `.gitignore`
- **Purpose**: Version control ignore rules specifying exclusions for dependencies (`node_modules`), Next.js build artifacts (`.next`, `out`), environment variables (`.env*`), caches (`*.tsbuildinfo`), test coverage, and OS metadata files (`.DS_Store`).
- **Functions**: N/A (Git configuration).

#### `AGENTS.md`
- **Purpose**: Authoritative AI behavior, architectural documentation requirements, test runner rules, suggestions logging, and local-first commit workflow guidelines for Antigravity.
- **Functions**: N/A (Markdown guidelines).

#### `docs/architecture.md`
- **Purpose**: Exhaustive codebase inventory documenting every file's purpose, all functions and their roles, and environment variables.
- **Functions**: N/A (Markdown documentation).

#### `docs/suggestions.md`
- **Purpose**: Living roadmap tracking feature suggestions, architectural improvements, vulnerability audits, and the planned copy-only new-data intake workflow for proposing missing entities without exposing the full master dataset.
- **Functions**: N/A (Markdown documentation).

#### `docs/to-do.md`
- **Purpose**: Current enrichment restart handoff pointing to the gap report and operating instructions, and recording that no prior queue, response, validation, approval, or derived dataset remains active.
- **Functions**: N/A (Markdown task handoff).

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

#### `app/not-found.tsx` (2026-09-28)
- **Purpose**: App-shell-styled 404 page. Every dynamic route calls `notFound()` for an unknown id; without this the seven detail routes rendered Next's unstyled default outside the shell.
- **Functions**:
  - `NotFound()`: Renders the "Page not found" panel with links back to the home dashboard, vocabulary, verbs and search.

#### `app/error.tsx` (2026-09-28)
- **Purpose**: Client error boundary for the root segment. A throw inside a selector (or any other render error) previously white-screened the whole app.
- **Functions**:
  - `GlobalError({ error, reset })`: Renders the failure panel, shows `error.digest` for support correlation, and offers a "Try again" `reset()` action plus a link home.

#### `app/<route>/loading.tsx` (2026-09-28)
- **Purpose**: Route-level loading skeletons for the twelve list/detail routes (`/chapters`, `/concepts`, `/examples`, `/exercises`, `/expressions`, `/grammar`, `/review`, `/search`, `/tenses`, `/traps`, `/verbs`, `/vocabulary`), each delegating to the shared `ListSkeleton`.
- **Functions**:
  - `Loading()`: Returns `<ListSkeleton rows={n} label="Loading <route>" />` for that route.

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

#### `app/vocabulary/[id]/page.tsx`
- **Purpose**: Vocabulary item deep dive view showing grammatical gender, articles, senses, synonyms/antonyms, related expressions, base verbs, and contextual examples.
- **Functions**:
  - `VocabDetailPage({ params })`: Server page resolving word entry and rendering `VocabDetailView`.

#### `app/concepts/page.tsx`
- **Purpose**: Concepts taxonomy directory cataloging all 206 grammatical and pedagogical concepts with CEFR levels, categories, and quick peek integration.
- **Functions**:
  - `ConceptsPage()`: Server page rendering `ConceptsExplorer`.

#### `app/concepts/[id]/page.tsx`
- **Purpose**: Concept deep dive view showing definition, CEFR metadata, interconnected grammar rules, verbs, expressions, vocabulary, and related tenses.
- **Functions**:
  - `ConceptDetailPage({ params })`: Server page resolving concept entity and rendering `ConceptDetailView`.

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
  - `TrapsPage({ searchParams })`: Renders searchable and filterable traps directory (query text + category dropdown backed by the `category` search param).

#### `app/review/page.tsx` (2026-09-28)
- **Purpose**: SRS flashcard review over all 133 irregular verbs plus an A-Z cross-section of the 1002-entry dictionary. Rewritten 2026-09-28: the deck is built from the **untruncated** collections with the cap applied after filtering, so the previous alphabetical slice (which stopped at "chaque année" and excluded 13 irregular verbs) no longer makes anything beyond C unlearnable, and the deck grows as cards are scheduled forward.
- **Functions**:
  - `ReviewPage()`: Builds `SrsCard[]` (all 133 irregular verbs: lemma → English; 251 strided vocabulary cards spread across A-Z: French → English) and renders `ReviewSession`.

#### `app/search/page.tsx`
- **Purpose**: Dedicated search page for deep queries across all 10 master collections (verbs, expressions, vocabulary, grammar rules, tenses, chapters, examples, exercises, and traps).
- **Functions**:
  - `SearchPage({ searchParams })`: Renders unified query input and list of matching entity cards.

#### `app/api/search/route.ts` (2026-09-28 hardened)
- **Purpose**: API endpoint for real-time search queries and quick command palette lookups. Input is now validated: `limit` is clamped to 1–50 (default 20, previously unbounded and returning ~2500 results / ~600 KB per request after a full 18 MB scan), a `q` longer than 100 characters is a `400`, and every response carries `Cache-Control: public, max-age=60, s-maxage=300, stale-while-revalidate=600`.
- **Functions**:
  - `GET(request)`: Validates `q` length and `limit`, then returns matched items grouped by category, or a `400` for malformed input.
  - `json(body, status = 200)`: Internal helper attaching the shared `Cache-Control` header to every response.
  - `resolveLimit(rawLimit)`: Internal helper parsing and clamping `limit` to 1–50, returning `null` (→ `400`) for non-numeric input.

#### `app/api/peek/route.ts` (2026-09-28 hardened)
- **Purpose**: Universal Level 2 Peek API endpoint providing lightweight preview summaries for verbs, expressions, grammar rules, tenses, vocabulary, chapters, traps, examples, exercises, and concepts without full-page reloads. The `id` is decoded once through a guarded helper, so a malformed value (for example a trailing `%`) is a `400` instead of the `500` the previous unguarded `decodeURIComponent` calls produced. Vocabulary peek payloads now return the canonical deduplicated id and `/vocabulary/<id>` URL.
- **Functions**:
  - `GET(request)`: Handles `?type={verb|expression|tense|grammar|vocab|chapter|trap|example|exercise|concept}&id={id}` requests and returns structured peek payloads, or `400` for a missing / malformed type or id.
  - `safeDecode(value)`: Internal helper returning `null` instead of throwing `URIError` on a malformed percent-encoding.

---

### 3. UI Components (`src/components/`)

#### `src/components/layout/AppShell.tsx`
- **Purpose**: Responsive layout shell providing desktop sidebar navigation (with live counts for all 10 entity collections), mobile header with search and hamburger menu triggers, mobile drawer with auto-close on navigation and body scroll lock, breadcrumbs, command palette integration, PeekDrawer mount, and global keyboard shortcuts. Mobile drawer auto-close uses the adjust-state-during-render pattern (no setState-in-effect).
- **Functions**:
  - `AppShell({ children })`: Client component wrapping pages with consistent application chrome and listening for global `"open-command-palette"` events.

#### `src/components/common/RowActionMenu.tsx` (2026-09-28)
- **Purpose**: Reusable compact action menu providing "Save for review" toggle, "Mark as reviewed" toggle, and "Full Detail Page" navigation link with reactive bookmark badges and local storage synchronization. The saved/reviewed flags are now hydrated **once per menu in a mount effect** from `getReviewStateSnapshot()` and kept current through the existing subscription; previously `isItemSaved` and `isItemReviewed` ran during render, so a 50-row page (mobile list *and* desktop table both mounted) performed roughly 200 full localStorage reads and parses per render pass. Dropdown items carry `role="menuitem"` and the trigger carries `aria-expanded` / `aria-haspopup`.
- **Functions**:
  - `RowActionMenu({ type, id, fullUrl, label })`: Interactive action dropdown and status pill component.

#### `src/components/common/GlobalKeyboardShortcuts.tsx`
- **Purpose**: Global keyboard event handler providing power-user navigation across table rows and modal views (`/`, `Cmd+K`, `Esc`, `j`, `k`, `o`, `Enter`, `Space`); dispatches `"open-command-palette"` event on `Cmd+K`.
- **Functions**:
  - `GlobalKeyboardShortcuts()`: Client listener mounted in AppShell.
  - `handleKeyDown(e)`: Internal key event dispatcher for navigation, search, and drawer toggling.

#### `src/components/common/PronunciationButton.tsx` (2026-09-28)
- **Purpose**: Web Speech API pronunciation (no network/assets). Wired into verb + vocabulary detail headers. Rewritten 2026-09-28: the button is **always rendered**, because the previous `typeof window === "undefined"` early return in the render body made the server emit no button while the first client render emitted one — a guaranteed hydration mismatch on every `/verbs/[id]` and `/vocabulary/[id]` page. Support is now detected through `useSyncExternalStore` (server snapshot `false`) and the handler is a no-op when unsupported; the button stays visible with `aria-disabled` and reduced opacity.
- **Functions**:
  - `PronunciationButton({ text, lang, label })`: Always renders the button; speaks `text` (`fr-FR`, 0.9 rate) with a speaking pulse.
  - `subscribeToSpeechSupport()`: Internal no-op subscribe function for the `useSyncExternalStore` capability check.
  - `getSpeechSupportSnapshot()`: Internal client snapshot returning whether `window.speechSynthesis` exists.
  - `getSpeechSupportServerSnapshot()`: Internal server snapshot, always `false`.

#### `src/components/review/ReviewSession.tsx` (2026-09-28)
- **Purpose**: Client flashcard session: tap-to-flip card, Again (card cycles back into the session) / Got it grading via `gradeCard()`, progress counts, all-caught-up state. Rewritten 2026-09-28: the previous `useState(() => getDueCards(cards))` read LocalStorage **during render**, so the server treated every card as due while the client treated only a filtered subset as due (a hydration mismatch plus an impure render), and `getSrsStats(cards)` re-parsed LocalStorage on every render. The component now reads the store exclusively through `useSyncExternalStore` and derives the queue and the stats with `useMemo`, so nothing touches LocalStorage in the render body. The progress counter is `done + 1` over a fixed `session.total`.
- **Functions**:
  - `ReviewSession({ cards })`: Runs one review session over due cards from the external SRS store.
  - `buildQueue(due, resolved)`: Internal pure helper that drops "got it" cards and re-appends "again" cards to the end of the session queue.

#### `src/components/peek/PeekContext.tsx` (2026-09-28)
- **Purpose**: Global React Context provider managing Level 2 peek drawer state, selected entity type and ID, and asynchronous data fetching. Hardened 2026-09-28: `openPeek` now clears `peekData` to `null` **before** awaiting, so a 404 or a failed fetch can no longer leave the previous entity's title and facts on screen, and a monotonic `requestCounterRef` discards out-of-order responses so two fast peeks cannot render the wrong entity. `closePeek` also bumps the counter and clears the payload.
- **Functions**:
  - `PeekProvider({ children })`: Context provider component.
  - `usePeek()`: Hook returning peek state (`isOpen`, `isLoading`, `peekData`, `openPeek`, `closePeek`, `canGoBack`, `canGoForward`, `goBack`, `goForward`).
  - `fetchPeekData(type, id)`: Internal async helper returning cached or freshly fetched peek data, or `null` on failure.

#### `src/components/peek/PeekDrawer.tsx`
- **Purpose**: Dual-mode preview component acting as a right-side slide-over drawer on desktop (`>=768px`) and a tactile bottom sheet on mobile screens (`<768px`) with top drag/grab indicator bar, rounded top corners, max-height 85vh, and bottom slide-in animation.
- **Functions**:
  - `PeekDrawer()`: Slide-over and bottom-sheet UI component mounted globally in AppShell.
  - `handleKeyDown(e)`: Internal key event listener closing drawer on Escape.
  - `helperDeterminePeekType(url)`: Internal helper mapping a linked `/<type>/<id>` URL back to a peek target; the inline `decode` closure returns `null` for malformed percent-encodings instead of throwing.

#### `src/components/peek/PeekTrigger.tsx` (2026-09-28)
- **Purpose**: Reusable interactive trigger that invokes `openPeek(type, id)` from anywhere in the application. The `inline` variant is now a real `<button type="button">`: it was a `span` with no role, no `tabIndex` and no key handler that also called `preventDefault()`, so it was unreachable by keyboard and could hijack an enclosing `Link`.
- **Functions**:
  - `PeekTrigger({ type, id, className, variant, title, children })`: Clickable trigger component; `icon` / `badge` / `button` variants were already real buttons.
  - `handleClick(e)`: Click handler stopping propagation (no `preventDefault`) and invoking `openPeek`.

#### `src/components/verbs/VerbLibraryTable.tsx`
- **Purpose**: Scan-and-peek interface for the 496 verbs library featuring enhanced desktop table scanning (sticky header, subtle zebra striping, selected-row styling via `data-selected`, visually dominant French lemma, formatted English meaning with intelligent deduplication, right-aligned action badges) and a purpose-built mobile two-line list layout (`<768px`: Line 1 = French lemma · English gloss; Line 2 = classification, auxiliary, participle with tap-to-peek and save/review menu).
- **Functions**:
  - `VerbLibraryTable({ verbs, total, currentPage, pageSize, initialFilters })`: Dual-mode responsive table/list component.
  - `formatGroup(g)`: Normalizes verb group string for badge rendering.
  - `formatMeaning(val)`: Formats and safely joins English translations with commas, removing redundant elements.
  - `updateFilters(newFilters)`: Pushes updated URL search query parameters for verb filters.
  - `handleSearchSubmit(e)`: Form submit handler committing search queries.

#### `src/components/verbs/VerbDetailView.tsx`
- **Purpose**: Systematic 3-level detail view for verbs featuring mood tabs (Indicatif, Conditionnel, Subjonctif, Impératif), accessible keyboard-navigable tense accordion rows with embedded peek triggers, smart "Show More" limits, peek triggers for expressions, and demoted technical metadata. Mood-change tense reset uses the adjust-state-during-render pattern (no setState-in-effect).
- **Functions**:
  - `VerbDetailView({ verb, conjugations, expressions, grammarRules, examples })`: Client detail component.
  - `formatGroupName(g)`: Formats French verb group name into descriptive label.

#### `src/components/vocabulary/VocabDictionaryTable.tsx`
- **Purpose**: Alphabetical A-Z dictionary interface for 1,002 vocabulary items featuring enhanced desktop table scanning (sticky header, zebra striping, selected-row styling, dominant French term with article, formatted English gloss, right-aligned badges) and a purpose-built mobile two-line list layout (`<768px`: Line 1 = article/term · English gloss; Line 2 = category, CEFR, word family with tap-to-peek and save/review menu).
- **Functions**:
  - `VocabDictionaryTable({ vocabulary, total, currentPage, pageSize, initialFilters })`: Dual-mode responsive dictionary table/list component.
  - `formatMeaning(val)`: Formats and safely joins English translations with commas, removing duplicates.
  - `formatPosGender(item)`: Formats part of speech and gender display badge text.
  - `updateFilters(newFilters)`: Pushes updated URL search parameters for vocabulary filters.
  - `handleSearchSubmit(e)`: Form submit handler committing dictionary search queries.
  - `detailHref(item)`: Returns `/vocabulary/<dedup id>`; since 2026-09-28 rows link and key by the canonical id instead of the French form, so `la Toile` and `Toile` are two distinct URLs.
- **Changes (2026-09-28)**: the mobile list and the desktop table are no longer both mounted — `useIsDesktop()` renders only the active breakpoint, halving the mounted `RowActionMenu` count from 100 to 50 on a 50-row page. `totalPages` is floored at 1, rows key on `item.id` (not `id` + index), and the search input, part-of-speech select, gender select and the clear-search button all have proper `id` / `htmlFor` / `aria-label` pairs.

#### `src/components/vocabulary/VocabDetailView.tsx`
- **Purpose**: Vocabulary word deep dive with gender tag, article, definitions/senses, synonyms, antonyms, related expressions, base verbs, and contextual sentences.
- **Functions**:
  - `VocabDetailView({ vocab, baseVerbs, expressions, examples })`: Interactive client component with peek triggers and external cross-filters.

#### `src/components/expressions/ExpressionLibraryTable.tsx`
- **Purpose**: Dense scan table for 557 idiomatic expressions emphasizing syntactic pattern formulas, preposition filters (à, de, en, sur, pour, avec), and row-click Level 2 peek.
- **Functions**:
  - `ExpressionLibraryTable({ expressions, total, currentPage, pageSize, initialQuery, initialPreposition, initialBaseVerb })`: Interactive client expressions table.
  - `updateFilters(newFilters)`: Pushes updated URL search parameters for expression filters.
  - `handleSearchSubmit(e)`: Form submit handler committing expression search queries.

#### `src/components/expressions/ExpressionDetailView.tsx`
- **Purpose**: Syntactic deep dive view for expressions highlighting pattern formulas, base verbs with Peek triggers, sentence examples with smart limits, and demoted attestation metadata.
- **Functions**:
  - `ExpressionDetailView({ expression, verbs, examples, vocabulary })`: Client detail component.

#### `src/components/grammar/GrammarLibraryTable.tsx`
- **Purpose**: Dense scan table for 284 grammar rules with formation formula previews, trap counters, and row-click Level 2 peek.
- **Functions**:
  - `GrammarLibraryTable({ rules, total, currentPage, pageSize, initialQuery })`: Interactive client grammar table.
  - `updateFilters(newFilters)`: Pushes updated URL search parameters for rule filters.
  - `handleSearchSubmit(e)`: Form submit handler committing grammar search queries.

#### `src/components/grammar/GrammarDetailView.tsx`
- **Purpose**: Grammar rule deep dive featuring 2-box summary capsule ("When to Use" and "Watch Out / Common Trap"), formation formula, peek-enabled related verbs/tenses, and smart examples.
- **Functions**:
  - `GrammarDetailView({ rule, tenses, verbs, examples, traps })`: Client detail component.

#### `src/components/tenses/TensesDirectoryTable.tsx`
- **Purpose**: Dual-view (Card and Table) directory for all 24 French tenses and moods with mood filters, search, quick Peek triggers, and direct navigation.
- **Functions**:
  - `TensesDirectoryTable({ tenses, initialMood, initialQuery })`: Interactive client component with scan-to-peek interactions and layout switcher.

#### `src/components/tenses/TenseDetailView.tsx`
- **Purpose**: Tense deep dive with sticky subnavigation, 4-part Quick-Reference Card (Formula, When to Use, Signal Words, Agreement & Traps), verb inflection matrix with search & Peek, linked grammar rules, contextual sentence examples, related traps & pitfalls section, practice drill CTA, and demoted attestation metadata.
- **Functions**:
  - `TenseDetailView({ tense, conjugations, grammarRules, examples, traps })`: Client detail component.

#### `src/components/concepts/ConceptsExplorer.tsx`
- **Purpose**: Semantic concept explorer cataloging all 206 concepts with live search, CEFR badges, category filters, and quick peek integration.
- **Functions**:
  - `ConceptsExplorer({ concepts })`: Interactive client directory component with search, CEFR level pill selector, and priority filters.

#### `src/components/concepts/ConceptDetailView.tsx`
- **Purpose**: Concept deep dive interface displaying semantic taxonomy, CEFR badges, related grammar rules, verbs, expressions, vocabulary, and related tenses with peek and drill links.
- **Functions**:
  - `ConceptDetailView({ concept, grammarRules, verbs, expressions, vocabulary, tenses })`: Client detail component.

#### `src/components/chapters/ChapterDetailView.tsx`
- **Purpose**: Chapter dashboard featuring 1-screen Quick Cheat Sheet (Key Verbs, Core Rule, Essential 5 Vocab, #1 Trap to Avoid) and tabbed navigation (Overview, Grammar, Verbs, Vocab, Expressions, Practice).
- **Functions**:
  - `ChapterDetailView({ chapter, sections, grammarRules, verbs, vocabulary, expressions, exercises, examples })`: Client detail component.

#### `src/components/examples/ExampleExplorerList.tsx`
- **Purpose**: Interactive bilingual sentence list with clickable entity tags triggering Level 2 peek for verbs, tenses, and grammar rules directly in context.
- **Functions**:
  - `ExampleExplorerList({ examples })`: Client list component with peek triggers.

#### `src/components/search/CommandPalette.tsx`
- **Purpose**: Modal command palette (`Cmd+K` / `Ctrl+K`) for keyboard-first navigation and instant search with backdrop click-to-close, explicit close button (`✕`) for mobile devices without Escape keys, and responsive padding. Open/close state is owned by `AppShell` via `isOpen`/`onClose` props; internal query/reset state uses the adjust-state-during-render pattern (no setState-in-effect) and search fetching is debounced (~150ms) with a focus-on-open effect.
- **Functions**:
  - `CommandPalette({ isOpen, onClose })`: Client component managing search dialog, keyboard shortcuts, live results, and debounced `/api/search` fetching.
  - `handleKeyDown(e)`: Effect-internal key event listener for palette keyboard triggers (`Cmd+K`/`Ctrl+K`, `Esc`).
  - `handleKeyDownInInput(e)`: Handles arrow keys, Enter, and Tab inside palette input.
  - `handleSelect(item)`: Executes selection navigation to the result URL and closes the palette.

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

#### `src/components/ui/ListSkeleton.tsx` (2026-09-28)
- **Purpose**: Shared loading skeleton rendered by every `app/<route>/loading.tsx`, so a slow dataset filter pass shows structure instead of a blank page.
- **Functions**:
  - `ListSkeleton({ rows, label })`: Renders an `aria-busy` header, facet-bar, and row placeholders with a screen-reader status label.

#### `src/components/ui/CrossLink.tsx`
- **Purpose**: Standardized internal navigation link with entity-specific styling and icons.
- **Functions**:
  - `CrossLink({ href, title, subtitle, type, count })`: Renders interactive card/link pointing to internal entities.

---

### 4. Data Layer (`src/lib/data/`) and Shared Utilities (`src/lib/`, `src/hooks/`)

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
  - `getVocabulary(filters)`: Retrieves filtered vocabulary words with safely normalized articles, guaranteed 100% unique IDs assigned by the shared `getVocabIndex()`, gender, plural forms, and flattened senses. 2026-09-28: ids now come from the shared index instead of being recomputed here.
  - `getVocabularyById(id)`: Retrieves single vocabulary detail with related expressions, related verbs, related chapters, and examples. Matches exact id → exact canonical form → slug (prefix clauses removed 2026-09-28) and returns the index id as `vocab.id`, so the detail page and the table always agree.
  - `getGrammarRules(filters)`: Retrieves grammar rules list.
  - `getGrammarRuleById(id)`: Retrieves single grammar rule with formation, transformations, traps, and cross-links. Supports raw, URL-decoded, and slugified rule titles.
  - `getTenses()`: Retrieves all 24 tenses organized by mood.
  - `getTenseById(id)`: Retrieves single tense detail with regular patterns, irregular stems, agreement rules, and common traps. Supports raw and URL-decoded IDs.
  - `getChapters()`: Retrieves all 27 chapters.
  - `getChapterById(id)`: Retrieves chapter with linked concepts, rules, verbs, expressions, vocabulary, and exercises. Supports numeric and slug IDs.
  - `getExamples(filters)`: Retrieves example sentences with focus spans, verb filter, tense filter, and translation filter.
  - `getExercises(filters)`: Retrieves exercises with questions, options, hints, and answers.
  - `getExerciseById(id)`: Retrieves single exercise detail. Supports raw, dotted, and legacy slug IDs.
  - `getExceptionsAndTraps(filters)`: Retrieves the 108 curated common pitfalls with correct vs incorrect forms.
  - `getConcepts()`: Retrieves all 206 grammatical concepts with guaranteed 100% unique IDs across case-variant duplicates.
  - `getConceptById(id)`: Retrieves single concept detail with linked grammar rules, tenses, verbs, expressions, vocabulary, and examples. Supports raw, slugified, disambiguated, and URL-decoded IDs.
  - `safeDecode(str)`: Defensive URL decoding helper preventing URI malformed exceptions.
  - `getVocabIndex()`: Internal memoized builder for the single source of vocabulary truth — returns `{ entries, byId, byCanonical, bySlug }` with the deduplicated id assigned once.
  - `resolveVocabRecord(rawId, decoded)`: Internal exact-id → canonical-form → slug resolver used by `getVocabularyById`.
  - `resolveVocabularyId(canonicalForm, partOfSpeech?)`: Returns the canonical detail id for a vocabulary record from the shared index (used by search results so a hit opens its own record).
  - `formatComplementStructure(value)`: Flattens the dataset's object-shaped `complement_structure` into a readable slot signature; all 557 expression records carry the object shape, and rendering it raw was a prerender crash.
  - `formatVocabRelation(value)`: Flattens one heterogeneous vocabulary relation (bare string or `{ canonical_form }` / `{ form }` reference) to a display string.
  - `formatVocabRelations(value)`: Array wrapper over `formatVocabRelation` with dedupe; applied to `variants`, `word_family`, `synonyms`, `antonyms` and `usage_notes`.
  - `normalizeVocabSenses(value)`: Normalizes master vocabulary senses (which use an `english` key plus nested `articles`) to the UI `Sense` shape with a guaranteed string `english_gloss`.
  - `formatEnglishList(val, isVerb)`: Normalizes English translation strings or arrays into a clean comma-separated list, intelligently deduplicating bare and to-infinitive pairs for verbs.
  - `mapVerb(v)`: View-model normalizer for verbs.
  - `mapTense(t)`: View-model normalizer for tenses.
  - `mapRule(r)`: View-model normalizer for grammar rules.
  - `mapExpression(e)`: View-model normalizer for expressions.
  - `mapVocab(w)`: View-model normalizer for vocabulary entries.
  - `mapChapter(c)`: View-model normalizer for chapters.
  - `mapExample(ex)`: View-model normalizer for example sentences.
  - `mapExercise(ex)`: View-model normalizer for exercises.
  - `mapTrap(tr)`: View-model normalizer for pitfalls and traps.
  - `mapConcept(c)`: View-model normalizer for grammatical concepts.

#### `src/lib/data/search.ts`
- **Purpose**: In-memory search indexing and fuzzy/prefix matching over French text with accent normalization across master dataset entities (verbs, rules, tenses, expressions, vocabulary, exercises, traps, examples, chapters).
- **Functions**:
  - `normalizeFrenchText(text)`: Lowercases, removes diacritics, and normalizes punctuation for search indexing.
  - `searchDataset(dataset, query, limit)`: Searches across all master entities and returns categorized, ranked matches. Vocabulary hits use the canonical deduplicated detail id (via `resolveVocabularyId`) for both the result `id` and the `/vocabulary/<id>` URL, so a search result always opens its own record.

#### `src/lib/data/reviewStore.ts`
- **Purpose**: Client-side storage helper for saving items for review and marking entries reviewed with persistent `localStorage` backing and cross-component reactive custom event broadcasting.
- **Functions**:
  - `isItemSaved(type, id)`: Returns boolean indicating whether entity is saved for review.
  - `toggleItemSaved(type, id)`: Toggles saved bookmark status in localStorage and emits custom change event.
  - `isItemReviewed(type, id)`: Returns boolean indicating whether entity has been marked as reviewed.
  - `toggleItemReviewed(type, id)`: Toggles reviewed status in localStorage and emits custom change event.
  - `subscribeReviewState(callback)`: Registers listener for `letude-review-state-changed` events and returns cleanup unsubscription function.
  - `safeGetStorage(key)`: Safely parses JSON records from localStorage with SSR fallback.
  - `safeSetStorage(key, data)`: Safely persists JSON records to localStorage and notifies subscribers.
  - `getReviewStateSnapshot()`: Reads **both** key maps in one pass and returns `{ saved: Set<string>, reviewed: Set<string> }`. Added 2026-09-28: `RowActionMenu` previously called `isItemSaved` and `isItemReviewed` during render, so a 50-row page performed roughly 200 full localStorage reads and parses per render pass.
  - `sanitizeStore(store, storageKey)`: Internal helper that prunes any key whose value is not `true`, so neither key map can grow without bound.

#### `src/lib/data/srs.ts` (2026-09-28)
- **Purpose**: SM-2-lite spaced-repetition scheduler persisted in LocalStorage (`letude_srs`). Powers the `/review` flashcards. The persisted payload is now a **versioned envelope** (`{ version, records }`, `SRS_SCHEMA_VERSION = 2`) and every record is validated with `Number.isFinite` on read; a malformed or future-shaped record is dropped instead of silently stranding its card forever (previously `rec.due <= now` evaluated false, the card was never due again, and `getSrsStats` counted it as neither due nor learned — a permanent loss with no migration path). Version 1 bare-map payloads migrate forward. The store is exposed through `useSyncExternalStore`-compatible subscribe/snapshot functions so no component reads LocalStorage during render.
- **Functions**:
  - `nextInterval(currentDays, remembered)`: 0 → 1 → 3 → 7 → 14 → 30 → 60 ladder; miss resets to 0.
  - `gradeCard(key, remembered, now)`: Records a grade, writes the versioned envelope, notifies listeners, returns the new record.
  - `selectDueCards(cards, records, now)`: Pure filter to due-or-new cards; treats an unusable stored record as due.
  - `selectSrsStats(cards, records, now)`: Pure `{ total, due, learned }` counter; an unusable record counts as due.
  - `getDueCards(cards, now)`: Store-reading convenience wrapper around `selectDueCards` (used by tests and non-React callers).
  - `getSrsStats(cards, now)`: Store-reading convenience wrapper around `selectSrsStats`.
  - `sanitizeRecords(input)`: Keeps only well-formed `SrsRecord` entries from an arbitrary parsed value.
  - `parseSrsState(raw)`: Parses and validates a persisted payload into `{ version, records }`, tolerating absent, malformed, non-object and legacy v1 shapes.
  - `isSrsRecord(value)`: Type guard checking `Number.isFinite` on `intervalDays`, `due` and `lapses` plus non-negative intervals and lapse counts.
  - `isUsableRecord(rec)`: Internal guard used by the pure selectors.
  - `subscribeSrsStore(listener)`: `useSyncExternalStore` subscribe function; also listens for cross-tab `storage` events.
  - `getSrsStoreSnapshot()`: Returns the memoized client snapshot, re-reading storage only when the raw string changed.
  - `getSrsServerSnapshot()`: Returns the constant empty server snapshot.
  - `readStorage()` / `writeStorage(records)`: Internal LocalStorage read/write helpers with quota and SSR guards.

#### `src/lib/manager/` (2026-09-28) — Manager integration (optional)

Three files, all no-ops unless configured. This app has no logging layer of its own, so the facade is the single entry point: the two API routes call `logServerEvent`/`logServerError` directly, next to the JSON they already return. Full contract in `README.md` § "Manager integration".

| File | Purpose | Exports |
|---|---|---|
| `src/lib/manager/logger.ts` | The vendored `@manager/logger` SDK: one file, zero dependencies, types included. Refreshed with `curl -H "x-manager-key: …" "…/api/sdk/logger?format=ts"`. Do not edit by hand. | `initLogger`, `traceIdFromHeaders`, `shutdownLoggers`, `fingerprint`, `LOG_SDK_VERSION`, `LOG_SDK_PATH`, `TRACE_HEADER` |
| `src/lib/manager/index.ts` | The integration facade. Reads the server `MANAGER_*` block into `managerConfig` and — separately, and this is the whole point — the `NEXT_PUBLIC_MANAGER_*` block into `managerClientConfig` using **static** `process.env.NEXT_PUBLIC_*` member expressions, because Next.js strips non-public env from the client bundle. Exposes a no-op logger when unconfigured, creates the real logger lazily on first use and caches it on `globalThis`, batches routine levels on a 250ms window, and leading-edge-flushes `error`/`fatal`. Never throws. | `managerConfig`, `managerClientConfig`, `startManagerLogger`, `getManagerLogger`, `managerLog`, `getManagerDroppedCount`, `logServerEvent`, `logServerError`, `managerTrackerScript` |
| `src/lib/manager/ManagerProvider.tsx` | `'use client'` component mounted in `app/layout.tsx`. Starts the browser logger and injects the analytics `<script>` once, guarded against double injection. Gated on `managerClientConfig.enabled`, **not** `managerConfig.enabled`. | `ManagerProvider` (default) |

**Delivery profile.** Routine levels ride the SDK's own 250ms `flushIntervalMs` window, so a burst of N lines becomes one HTTP request rather than N. `error`/`fatal` skip the window via `scheduleUrgentFlush` (leading edge): flush now if `URGENT_FLUSH_MIN_GAP_MS` (100ms) has passed, otherwise arm a single trailing flush — a burst of 50 errors costs ~2 requests, not 50. Measured with `node scripts/measure-log-delivery.mjs 200`: **201/200 entries delivered, 0 dropped, 11 requests, 18.3 entries/request** at 213 logs/s.

**Design points.**
- The logger is created on first use, not at boot: Next.js compiles startup hooks and route handlers into separate module graphs, so a boot-created instance is not the object a request sees.
- `captureProcessErrors` is intentionally **off** — Next.js owns process error handling, and extra process listeners stop log delivery entirely.
- The SDK import stays extensionless (`from './logger'`). Turbopack does not resolve an explicit `'./logger.js'` to `logger.ts`, so the JS-reference form would fail the production build here; `scripts/measure-log-delivery.mjs` bridges the same gap for plain Node with a `module.registerHooks` resolve hook.

#### `src/lib/pagination.ts` (2026-09-28)- **Purpose**: Shared pagination arithmetic for the seven filterable list routes. Replaces the raw `parseInt(params.page, 10)` calls that produced a `NaN` offset (an empty slice next to a header reporting the full entry count and "Page NaN of NaN") for any non-numeric, zero, negative or very large `?page=` value.
- **Functions**:
  - `parsePageParam(rawPage)`: Returns a positive integer page number, defaulting to 1 for missing, empty, non-numeric, zero, negative or garbage input and clamping to `MAX_PAGE_PARAM`.
  - `paginate(items, rawPage, pageSize)`: Slices `items` and returns `{ items, currentPage, totalPages, total }` with `totalPages` floored at 1 and `currentPage` clamped into range.
  - `MAX_PAGE_PARAM`: Upper bound constant (100000) for a supplied page number.

#### `src/lib/data/staticParams.ts` (2026-09-28)
- **Purpose**: Enumerable id lists for the seven dynamic detail routes. The dataset is fully static, so every id can be enumerated at build time and prerendered rather than re-rendered per request.
- **Functions**:
  - `getAllVerbIds()`: 496 verb lemmas.
  - `getAllTenseIds()`: 24 French tense names.
  - `getAllGrammarIds()`: 284 grammar rule titles.
  - `getAllExpressionIds()`: 557 expression canonical forms.
  - `getAllChapterIds()`: 27 chapter numbers as strings.
  - `getAllConceptIds()`: 206 concept names.
  - `getAllVocabularyIds()`: 1002 deduplicated vocabulary ids from the shared index.

#### `src/hooks/useMediaQuery.ts` (2026-09-28)
- **Note**: the only file under `src/hooks/`.
- **Purpose**: CSS media-query subscription built on `useSyncExternalStore`, so the server snapshot and the first client render agree and no `setState`-in-effect cascade is triggered. Used to render only the active breakpoint instead of mounting both the mobile list and the desktop table.
- **Functions**:
  - `useMediaQuery(query)`: Returns whether the query currently matches; subscribes to `change` (with an `addListener` fallback).
  - `useIsDesktop()`: Convenience hook for the `(min-width: 768px)` table breakpoint.
  - `usePrefersReducedMotion()`: Convenience hook for `(prefers-reduced-motion: reduce)`.
  - `useIsTouch()`: Convenience hook for `(hover: none) and (pointer: coarse)`.
  - `MEDIA_BREAKPOINTS`: Named breakpoint query constants.

#### `src/lib/dataset/repair-audit.ts` (2026-09-26)
- **Purpose**: v2.2 repair gate — hash-bound audit mapping for canonical record replacement (see `enrichment/REPAIR_POLICY_V2_2.md`). Pure, no I/O.
- **Functions**:
  - `stableStringify(value)`: Deterministic key-sorted JSON.
  - `sha256Hex(text)`: SHA-256 hex digest.
  - `readEvidence(record)`: `sources` array (fallback: `attestations`).
  - `auditableOriginal(record)`: Record minus any prior `audit` block (re-repairs chain).
  - `verifyRepairAudit(original, repaired)`: Checks policy id, timestamp, hash binding, verbatim evidence preservation. Returns `{ ok, errors, originalSha256 }`.
  - `buildRepairAudit(original, repairedAt)`: Builds a compliant audit block.

---

### 5. Dataset Engine & Utilities (`src/lib/dataset/`)

#### `src/lib/dataset/masterSchema.ts`
- **Purpose**: Authoritative TypeScript type definitions matching the complete `MASTER_SCHEMA.json` specifications and entity structures. Corrected 2026-09-28: `MasterExpression.complement_structure` is declared `string | ComplementStructure | null` (it is an object in all 557 records) and a new `ComplementStructure` interface models `{ direct_object, indirect_object, preposition, followed_by }`.
- **Functions**: Type exports (`MasterDataset`, `MasterVerb`, `MasterTense`, `MasterGrammarRule`, `MasterExpression`, `MasterVocabulary`, `MasterExample`, `MasterExercise`, `MasterExceptionTrap`, `MasterConcept`, `MasterChapter`, `ComplementStructure`, `Sense`, `ConjugationForms`, `PatternSlot`, `VerbConjugation`, `VerbStem`, `FocusSpan`, `ExerciseQuestion`, `ChapterSection`, `SourceEvidence`, `Study`).


#### `src/lib/dataset/ids.ts`
- **Purpose**: Deterministic identifier generation and slugification for all dataset entities.
- **Functions**:
  - `stripAccents(str)`: Removes French diacritics (including œ/æ/ç handling).
  - `slugify(str)`: Converts text to standard URL/ID friendly slug.
  - `makeBookId(titleOrSlug)`: Generates root book identifier.
  - `makeChapterId(chapterNumber)`: Generates formatted chapter identifier.
  - `makeSectionId(chapterNumber, sectionOrder, title?)`: Generates chapter section identifier with optional title slug suffix.
  - `makeConceptId(name, suffix?)`: Generates slugified concept identifier with optional chapter or index suffix to prevent duplicate key collisions.
  - `makeTenseId(nameEnglishOrKey)`: Generates slugified tense identifier.
  - `makeRuleId(titleOrKey)`: Generates rule identifier with accented `-é` discriminator to avoid collisions.
  - `makeVerbId(infinitive)`: Generates verb lemma identifier.
  - `makeConjugationId(verbIdOrInfinitive, tenseIdOrKey)`: Generates composite conjugation record identifier.
  - `makeExpressionId(canonicalForm)`: Generates expression identifier with qqn/qqch/inf abbreviation normalization.
  - `makeVocabId(word, pos?)`: Generates vocabulary identifier with part-of-speech discriminator to prevent homograph collisions (supports string or object input). Since 2026-09-28 the leading article is **kept** in the slug, so `la Toile`, `Toile` and `toile` cannot collapse onto one identifier; any residual collision is disambiguated by the `getVocabIndex()` suffix in `selectors.ts`.
  - `makeExampleId(verbOrChapter, index)`: Generates deterministic zero-padded example sentence identifier.
  - `makeExerciseId(chapterNumber, exerciseNumber)`: Generates exercise identifier.
  - `makeQuestionId(exerciseId, questionIndex)`: Generates individual drill question identifier.
  - `makeStudySetId(name)`: Generates study set identifier.
  - `VALID_ID_PREFIXES`: Tuple of allowed entity ID prefixes.
  - `isValidId(id)`: Validates ID prefix and format.







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
- **Purpose**: Formal JSON Schema defining schema specifications, entity model `$defs`, and type validations for all collections in `MASTER_DATA.json`; supports the dataset’s `articles` object and optional enrichment fields without requiring them on every entity.
- **Functions**: N/A (JSON Schema).

---

### 8. Testing Suite (`tests/`)

#### `tests/manager-integration.test.ts` (2026-09-28)
- **Purpose**: The Manager integration facade suite, run by `tests/run-all.test.ts` as its final section (`npm test`). 14 checks in the repo's assert-based idiom. Because the facade reads its environment at module load, every case re-`require`s it through `createRequire` with its own cache entry deleted — the `tsx` equivalent of vitest's `vi.resetModules()`. (`tsx` compiles this repo to CJS because there is no `"type": "module"`, which is also why the caller chains a promise rather than using top-level `await`.)
- **Functions**:
  - `runManagerIntegrationTests()`: Runs all 14 cases and resolves with the check count. Covers: disabled-when-unconfigured no-ops across every entry point; server enablement; the analytics key alone never enabling logs; whitespace-only values treated as unconfigured; **the server block never enabling the client half**; the client half enabling itself from `NEXT_PUBLIC_*` alone; the tracker tag's shape; the tracker being omitted without a client analytics key; a **static-access guard** that reads `src/lib/manager/index.ts` and fails if any `NEXT_PUBLIC_*` value stops being a literal `process.env.X` member expression or if the client block dynamically indexes `process.env`; `managerLog` never throwing at any level; info riding the 250ms window while `error` leading-edge flushes with the 100ms floor; unknown levels falling back to `info`; `getManagerDroppedCount`; `globalThis` instance sharing; and the real SDK surface.
  - `setEnv(values)`: Clears all nine `MANAGER_*`/`NEXT_PUBLIC_MANAGER_*` vars, then applies the given set.
  - `loadManager()`: Returns a freshly-evaluated copy of the facade with the cached instance on `globalThis` cleared.

#### `tests/run-all.test.ts`
- **Purpose**: Unified single entry-point test runner validating master data schema compliance, 10 collection counts, data loader integrity, view model selectors, alphabetical dictionary filtering, expression pattern filtering, and search functionality.
- **Functions**:
  - Validates `data/MASTER_DATA.json` integrity and 10 entity count invariants.
  - Validates `getMasterDataset()` loader caching.
  - Validates selectors (`getHomeStats`, `getVerbs`, `getVerbById`, `getTenses`, `getTenseById`, `getGrammarRules`, `getGrammarRuleById`, `getChapters`, `getChapterById`, `getExercises`, `getExceptionsAndTraps`, `getConcepts`, `getConceptById`, `getExamples`, `getVocabulary`, `getVocabularyById`, `getExpressions`).
  - Validates search indexing and diacritic-insensitive query execution via `searchDataset()`.
  - Validates alphabetical dictionary sort and A-Z letter filtration via `getVocabulary({ letter })`.
  - Validates expression preposition and base-verb filtration via `getExpressions({ preposition, baseVerb })`.
  - Validates ID uniqueness across grammar rules and exercises without collisions.
  - Validates URL-encoded identifier lookups.
  - Validates vocabulary article sanitization (string or null).
  - Validates enhanced example filters (`verb`, `tense`, `hasTranslation`).
  - Validates SRS scheduler (`nextInterval` ladder/cap/reset, due selection, stats) and v2.2 repair audit mapping (compliant verify, tampered-evidence fail, rebound-hash fail, key-order-stable hash, re-repair chaining) — added 2026-09-26.
  - Validates `reviewStore` functions (`isItemSaved`, `toggleItemSaved`, `isItemReviewed`, `toggleItemReviewed`) and SSR environment safety.
  - Validates vocabulary id integrity: every one of the 1002 table ids resolves to itself, every colliding base-id group resolves to distinct records, and the previously broken `ile` / `mer` / `toile` / `Toile` / `vacances` probes plus the `la Toile` vs `Toile` pair resolve correctly — added 2026-09-28.
  - Validates heterogeneous dataset fields are flattened before rendering: no vocabulary relation (`word_family`, `synonyms`, `antonyms`, `variants`) may remain an object, every sense exposes a string `english_gloss`, and no `complement_structure` reaches the UI as an object — added 2026-09-28.
  - Validates pagination guards via `parsePageParam` / `paginate`: missing, empty, non-numeric, trailing-garbage, zero, negative and oversized `?page=` values, plus the page-1, overflow and empty-result cases — added 2026-09-28.
  - Validates the versioned SRS envelope: `SRS_SCHEMA_VERSION`, absent / malformed / non-object / legacy-v1 payloads, per-record `Number.isFinite` validation dropping bad records, and a malformed record being treated as due rather than permanently stranded — added 2026-09-28.
  - Validates `getReviewStateSnapshot()` / `subscribeReviewState()` exist and return an empty SSR snapshot — added 2026-09-28.
  - Validates that every search-result vocabulary URL resolves to its own record — added 2026-09-28.
  - Validates that the seven `generateStaticParams` id lists are non-empty, unique, and complete (496 verbs, 1002 vocabulary, 24 tenses, 284 rules, 557 expressions, 27 chapters, 206 concepts) — added 2026-09-28.

---

### 9. UI Design Prototypes & Specifications (`ui/stitch_l_atlas_de_fran_ais/`)

#### `ui/stitch_l_atlas_de_fran_ais/l_acad_mie_digitale/DESIGN.md`
- **Purpose**: Master design system specifications documenting typography scale, Oxford Blue / French academic palette, layout grid, elevation, and component guidelines.
- **Functions**: N/A (Design specification).

#### `ui/stitch_l_atlas_de_fran_ais/revision_home/code.html` & `ui/stitch_l_atlas_de_fran_ais/revision_home/screen.png`
- **Purpose**: High-fidelity static HTML prototype and screenshot reference for the Revision Home dashboard.
- **Functions**: N/A (Prototype & visual reference).

#### `ui/stitch_l_atlas_de_fran_ais/chapters_library/code.html` & `ui/stitch_l_atlas_de_fran_ais/chapters_library/screen.png`
- **Purpose**: Static HTML prototype and screenshot reference for the Chapters Library directory.
- **Functions**: N/A (Prototype & visual reference).

#### `ui/stitch_l_atlas_de_fran_ais/chapter_12_detail_advanced_revision/code.html` & `ui/stitch_l_atlas_de_fran_ais/chapter_12_detail_advanced_revision/screen.png`
- **Purpose**: Static HTML prototype and screenshot reference for the single-chapter study view.
- **Functions**: N/A (Prototype & visual reference).

#### `ui/stitch_l_atlas_de_fran_ais/verbs_library/code.html` & `ui/stitch_l_atlas_de_fran_ais/verbs_library/screen.png`
- **Purpose**: Initial static HTML prototype and screenshot reference for the Verbs Library catalog.
- **Functions**: N/A (Prototype & visual reference).

#### `ui/stitch_l_atlas_de_fran_ais/verbs_library_refined/code.html` & `ui/stitch_l_atlas_de_fran_ais/verbs_library_refined/screen.png`
- **Purpose**: Refined static HTML prototype and screenshot reference for the Verbs Library catalog with transitivity and CEFR filters.
- **Functions**: N/A (Prototype & visual reference).

#### `ui/stitch_l_atlas_de_fran_ais/verb_detail_prendre/code.html` & `ui/stitch_l_atlas_de_fran_ais/verb_detail_prendre/screen.png`
- **Purpose**: Static HTML prototype and screenshot reference for the Verb Detail page and conjugation matrix.
- **Functions**: N/A (Prototype & visual reference).

#### `ui/stitch_l_atlas_de_fran_ais/tenses_moods_library/code.html` & `ui/stitch_l_atlas_de_fran_ais/tenses_moods_library/screen.png`
- **Purpose**: Static HTML prototype and screenshot reference for the Tenses & Moods Atlas directory.
- **Functions**: N/A (Prototype & visual reference).

#### `ui/stitch_l_atlas_de_fran_ais/tense_detail_conditionnel_pr_sent/code.html` & `ui/stitch_l_atlas_de_fran_ais/tense_detail_conditionnel_pr_sent/screen.png`
- **Purpose**: Static HTML prototype and screenshot reference for the Tense Detail view with formation formulas.
- **Functions**: N/A (Prototype & visual reference).

#### `ui/stitch_l_atlas_de_fran_ais/grammar_library/code.html` & `ui/stitch_l_atlas_de_fran_ais/grammar_library/screen.png`
- **Purpose**: Static HTML prototype and screenshot reference for the Grammar Rules Library directory.
- **Functions**: N/A (Prototype & visual reference).

#### `ui/stitch_l_atlas_de_fran_ais/expressions_library/code.html` & `ui/stitch_l_atlas_de_fran_ais/expressions_library/screen.png`
- **Purpose**: Initial static HTML prototype and screenshot reference for the Expressions Library.
- **Functions**: N/A (Prototype & visual reference).

#### `ui/stitch_l_atlas_de_fran_ais/constructions_library/code.html` & `ui/stitch_l_atlas_de_fran_ais/constructions_library/screen.png`
- **Purpose**: Static HTML prototype and screenshot reference for the Verbal Constructions directory.
- **Functions**: N/A (Prototype & visual reference).

#### `ui/stitch_l_atlas_de_fran_ais/constructions_library_refined/code.html` & `ui/stitch_l_atlas_de_fran_ais/constructions_library_refined/screen.png`
- **Purpose**: Refined static HTML prototype and screenshot reference for the Verbal Constructions directory with pattern slots.
- **Functions**: N/A (Prototype & visual reference).

#### `ui/stitch_l_atlas_de_fran_ais/vocabulary_library/code.html` & `ui/stitch_l_atlas_de_fran_ais/vocabulary_library/screen.png`
- **Purpose**: Initial static HTML prototype and screenshot reference for the Vocabulary Lexicon.
- **Functions**: N/A (Prototype & visual reference).

#### `ui/stitch_l_atlas_de_fran_ais/global_dictionary_refined_table_view/code.html` & `ui/stitch_l_atlas_de_fran_ais/global_dictionary_refined_table_view/screen.png`
- **Purpose**: Refined static HTML prototype and screenshot reference for the Lexicon table view with articles and gender tags.
- **Functions**: N/A (Prototype & visual reference).

#### `ui/stitch_l_atlas_de_fran_ais/global_example_explorer/code.html` & `ui/stitch_l_atlas_de_fran_ais/global_example_explorer/screen.png`
- **Purpose**: Static HTML prototype and screenshot reference for the Global Example Explorer with highlight spans.
- **Functions**: N/A (Prototype & visual reference).

#### `ui/stitch_l_atlas_de_fran_ais/exceptions_traps_library/code.html` & `ui/stitch_l_atlas_de_fran_ais/exceptions_traps_library/screen.png`
- **Purpose**: Static HTML prototype and screenshot reference for the Exceptions & Pitfalls Library with correct vs. incorrect comparison cards.
- **Functions**: N/A (Prototype & visual reference).

#### `ui/stitch_l_atlas_de_fran_ais/global_search_command_palette/code.html` & `ui/stitch_l_atlas_de_fran_ais/global_search_command_palette/screen.png`
- **Purpose**: Static HTML prototype and screenshot reference for the quick command palette modal.
- **Functions**: N/A (Prototype & visual reference).

---

### 10. Retired Enrichment Pipeline Inventory (removed 2026-09-10)

The entries in this historical section document files deliberately removed during
the enrichment reset. They are not present in the repository, must not be run,
and have no active data or approval status. The current two-file enrichment
workspace is documented after this historical record.

#### `enrichment/__init__.py`
- **Purpose**: Root package initialization file marking the enrichment directory as a Python package.
- **Functions**: N/A (Package initializer).

#### `enrichment/scripts/__init__.py`
- **Purpose**: Package initialization file for enrichment pipeline automation and maintenance scripts.
- **Functions**: N/A (Package initializer).

#### `enrichment/tests/__init__.py`
- **Purpose**: Package initialization file for the enrichment automated testing suite.
- **Functions**: N/A (Package initializer).

#### `enrichment/manual/batches/`
- **Purpose**: Directory for manual AI enrichment queue prompt files (`*.txt`). All 162 batches across all enrichable collections (26 vocabulary, 25 verbs, 19 expressions, 11 concepts, 19 grammar rules, 3 tenses, 6 exceptions/traps, 34 examples, 15 exercises, 4 chapters) have been fully processed, validated, and applied to `enrichment/MASTER_DATA_ENRICHED.json`. The prompt files have been cleaned up post-enrichment.
- **Functions**: N/A (batch prompt queue directory).

#### `enrichment/manual/logs/BATCH_MANIFEST.json` & `enrichment/manual/logs/PROGRESS.json`
- **Purpose**: Generated audit metadata for the completed 162-batch queue: natural-key targets, source hash, requested fields, batch locations, and generation/application progress tracking.
- **Functions**: N/A (generated JSON audit metadata).

#### `enrichment/MASTER_DATA_ENRICHED.json`
- **Purpose**: Schema-valid enrichment-only copy of the immutable master dataset. It is created or updated exclusively by applying validated response patches (all 162 batches applied across all 10 enrichable collections); `data/MASTER_DATA.json` remains unchanged.
- **Functions**: N/A (generated dataset artifact).

#### `enrichment/manual/validated/`, `review/`, `reports/`, `responses/`, `backups/` & `logs/<batch_id>.json`
- **Purpose**: Directories for validation-safe patch payloads, validation reports, human-readable apply reports, incoming AI response payloads, and per-batch application audit logs. All working artifacts for completed batches 001 through 162 have been cleaned up.
- **Functions**: N/A (pipeline working and audit directories).

#### `enrichment/plan.txt`
- **Purpose**: Authoritative 86-section specification document for the safe, deterministic, auditable manual AI enrichment pipeline for `MASTER_DATA.json`.
- **Functions**: N/A (Specification document).

#### `enrichment/high-risk/plan.md`
- **Purpose**: Separate implementation blueprint for a fail-closed, evidence-backed high-risk enrichment pipeline. It defines isolated artifact directories, field-specific contracts, batch generation, response schema, automated and independent verification, human approval, transactional application, auditing, and rollout procedures; the first proposed scope is fill-only `verbs.conjugations`.
- **Functions**: N/A (Specification document).

#### `enrichment/scripts/enrichment_config.py`
- **Purpose**: Central configuration defining directory paths, the immutable source path, enrichment-only output path (`enrichment/MASTER_DATA_ENRICHED.json`), batch sizes, natural keys, implemented patch operations, and field authorization boundaries.
- **Functions**:
  - `DEFAULT_BATCH_SIZES`: Dictionary governing default chunk sizes for batch generation.
  - `COLLECTION_ORDER`: Authoritative global sequence ordering for whole-dataset queue generation.
  - `NATURAL_KEYS`: Mapping of collection names to natural key field specifications.
  - `ALLOWED_OPERATIONS`: Whitelist of permitted JSON patch operations.
  - `SAFE_FIELDS` & `HIGH_RISK_FIELDS`: Field categorizations used to authorize enrichment; vocabulary includes safe fill-only inflection fields (`gender`, `articles`, `plural`, `variants`) and examples include reusable `related_verbs`/`related_tenses` links.
  - `RELATIONSHIP_TARGETS`: Maps additive example links to their target collections so references must resolve during validation.
  - `ENRICHED_DATA_PATH`: Copy-only enrichment output location; `MASTER_DATA_PATH` is never an apply target.

#### `enrichment/scripts/enrichment_helpers.py`
- **Purpose**: Shared data utilities for the enrichment pipeline including deterministic JSON loading/saving, master schema validation, natural key extraction, resilient entity matching, diacritic normalization, pre-apply backup snapshots, and atomic file replacement.
- **Functions**:
  - `load_json(path)`: Reads and parses JSON file.
  - `save_json(data, path, indent=2)`: Writes formatted JSON file with directory auto-creation.
  - `load_master_data(path=None)`: Loads authoritative `MASTER_DATA.json`.
  - `load_master_schema(path=None)`: Loads `MASTER_SCHEMA.json`.
  - `calculate_hash(data_or_path)`: Computes SHA-256 hash of a file or JSON data structure.
  - `normalize_french_text(text)`: Lowercases, removes diacritics/accents, and normalizes spacing for duplicate detection.
  - `natural_key_to_str(collection, key)`: Converts scalar or composite natural keys into deterministic string representations.
  - `extract_natural_key(collection, entity)`: Extracts natural key from entity dict based on collection rules.
  - `natural_keys_match(key1, key2)`: Compares two natural keys with defensive normalization.
  - `build_natural_key_index(dataset, collection)`: Indexes master collection for fast entity resolution.
  - `find_entity_by_natural_key(dataset, collection, natural_key, index=None)`: Finds entity tuple `(index, entity)` by natural key.
  - `backup_master_data(batch_id, source_path=None)`: Creates timestamped snapshot in `enrichment/manual/backups/`.
  - `save_master_data_atomically(data, target_path=None)`: Writes to temporary file before atomic POSIX rename.
  - `stable_value_key(value)`: Creates deterministic duplicate keys for scalar and structured array values.
  - `validate_against_master_schema(data, schema_path=None)`: Runs jsonschema validation against full dataset.
  - `resolve_field_name(field)`: Resolves field aliases (e.g. `english_meanings` to `english`).

#### `enrichment/scripts/make_enrichment_batch.py`
- **Purpose**: Generates self-contained prompt batch `.txt` files in `enrichment/manual/batches/`. Each prompt contains the relevant collection-schema excerpt, authorized target fields, entity context, and an instruction to return a downloadable `*_RESPONSE.json` file.
- **Functions**:
  - `get_next_global_sequence(manifest)`: Calculates the next sequential batch index.
  - `filter_entity_context(collection, entity, requested_fields=None)`: Prepares compact pedagogical context for prompt generation without metadata bloat.
  - `get_collection_schema_excerpt(collection, requested_fields)`: Extracts natural-key and authorized-field schema details plus referenced `$defs` for the selected collection.
  - `format_batch_prompt(batch_id, collection, entities_context, requested_fields=None, collection_schema=None)`: Assembles a prompt with safety directives, schema excerpt, and downloadable JSON-file contract.
  - `generate_single_batch(dataset, collection, entities, global_seq, collection_batch_num, requested_fields=None, master_hash="")`: Writes `.txt` prompt and creates manifest entry.
  - `run_batch_generation(args)`: Main batch generator coordinator managing CLI options and logging progress.
  - `main()`: CLI entry point.

#### `enrichment/scripts/validate_enrichment_response.py`
- **Purpose**: Validates raw GPT JSON responses against master integrity rules, manifest batch ownership, explicitly requested fields, natural reference resolution, and the implemented operation whitelist.
- **Functions**:
  - `ValidationResult.__init__(batch_id, collection)`: Tracks validation metrics, errors, warnings, and status.
  - `ValidationResult.to_dict()`: Serializes validation state.
  - `validate_response_file(response_path, dataset, manifest=None, indices=None)`: Executes 18-point validation checks on a single response file and produces clean patch payload.
  - `run_validation(args)`: Processes single or bulk response files and logs validation reports to `enrichment/manual/review/`.
  - `main()`: CLI entry point.

#### `enrichment/scripts/preview_enrichment.py`
- **Purpose**: Performs dry-run diff calculation for validated patch files against current master data without modifying master, detecting safe additions, no-ops, and conflicts.
- **Functions**:
  - `DiffOperation.__init__(op_type, field, status, existing_value=None, proposed_value=None, applied_value=None, reason=None)`: Models single diff operation.
  - `DiffOperation.to_dict()`: Serializes diff operation.
  - `preview_patch_file(patch_path, dataset, indices=None)`: Evaluates patch diff against dataset in memory and calculates summary stats.
  - `run_preview(args)`: Coordinates single or bulk preview and outputs machine-readable JSON to `enrichment/manual/review/`.
  - `main()`: CLI entry point.

#### `enrichment/scripts/generate_enrichment_report.py`
- **Purpose**: Formats dry-run preview JSON or applied audit logs into clean, human-readable `.txt` documents under `enrichment/manual/reports/` for effortless human review without touching raw JSON.
- **Functions**:
  - `format_preview_report(preview)`: Formats preview diff into structured ASCII report with summary, entity-by-entity additions, and dedicated conflicts section.
  - `format_applied_report(audit)`: Formats applied audit log into structured confirmation report with before/after hashes and field additions breakdown.
  - `generate_report_for_file(input_file, mode)`: Loads JSON and writes corresponding `.txt` report.
  - `run_report_generation(args)`: Coordinates single or folder-wide report generation.
  - `main()`: CLI entry point.

#### `enrichment/scripts/apply_enrichment.py`
- **Purpose**: Applies approved patch files only to `enrichment/MASTER_DATA_ENRICHED.json` (or an explicit enrichment output), with pre-validation, output-only backups, in-memory staging, schema verification, atomic write, and audit logging. It never writes `data/MASTER_DATA.json`.
- **Functions**:
  - `apply_patch_to_dataset(dataset, patch_data, indices=None)`: Staged in-memory applicator for safe scalar fills and scalar/object unique additions, with duplicate normalization and conflict skipping.
  - `run_apply(args)`: Pre-validates every selected patch, then coordinates output-only backup, schema verification, atomic write, and applied-report generation.
  - `main()`: CLI entry point.

#### `enrichment/scripts/run_pipeline.py`
- **Purpose**: High-level workflow orchestrator providing one-command execution for multi-step pipelines (`process-responses`, `apply-approved`, `generate-queue`).
- **Functions**:
  - `run_process_responses()`: Validates all responses, computes previews, and generates human-readable diff reports in one command.
  - `run_apply_approved(force_validated=False)`: Atomically stages and applies all approved patches.
  - `run_generate_queue(reset=False)`: Generates all batch prompt files across the entire dataset (supports `--reset` to clear counters and regenerate from scratch).
  - `main()`: CLI entry point.

#### `enrichment/tests/test_enrichment_pipeline.py`
- **Purpose**: Fourteen-test suite validating batch generation, collection-schema excerpts, downloadable JSON response instructions, field authorization, reusable example-link validation, previewing, reporting, and object-safe transactional application.
- **Functions**:
  - `TestEnrichmentConfiguration`: Asserts configuration completeness across all 11 collections and protected items.
    - `test_collections_and_batch_sizes()`: Verifies default batch sizes and natural keys exist for all collections.
    - `test_vocabulary_enrichment_includes_inflection_fields()`: Verifies safe inflection fields (`gender`, `articles`, `plural`, `variants`).
    - `test_example_enrichment_includes_reusable_links()`: Verifies reusable relation links (`related_verbs`, `related_tenses`).
  - `TestEnrichmentHelpers`: Tests text normalization, natural key serialization, and equality matching.
    - `test_normalize_french_text()`: Tests diacritic and spacing normalization on French text.
    - `test_natural_key_to_str()`: Tests scalar and composite natural key serialization.
    - `test_natural_keys_match()`: Tests resilient natural key matching.
  - `TestEnrichmentValidationAndPreview`: Tests clean patch validation, rejection of forbidden operations and artificial IDs, and dry-run diff categorization.
    - `setUp()`: Prepares mock master dataset for validation and diff evaluation.
    - `test_validation_clean_patch()`: Validates clean compliant patch against mock master dataset.
    - `test_validation_rejects_forbidden_ops_and_artificial_ids()`: Verifies rejection of unauthorized operations and synthetic IDs.
    - `test_validation_rejects_field_not_requested_by_manifest()`: Verifies strict rejection of unrequested fields.
    - `test_schema_excerpt_and_downloadable_json_instruction()`: Verifies batch prompt generation and schema excerpt formatting.
    - `test_example_relationships_must_resolve()`: Verifies cross-reference resolution for example links.
    - `test_preview_diff_calculations()`: Verifies dry-run addition, no-op, and conflict calculation.
  - `TestEnrichmentApplyEngine`: Tests in-memory transactional apply, conflict preservation, and applied report generation.
    - `setUp()`: Sets up mock dataset for application engine.
    - `test_in_memory_apply_and_conflict_handling()`: Tests safe value application and non-destructive conflict skipping.
    - `test_add_object_unique_preserves_and_appends_objects()`: Tests structured object addition without duplications.

---

### 11. Retired High-Risk Enrichment Pipeline Inventory (removed 2026-09-10)

This is a retained historical record only. All files and lifecycle directories
named in this section were removed during the reset and must be recreated from
the current instructions if a new queue is needed.

#### `enrichment/HIGH_RISK_DATA_ENRICHED.json`
- **Purpose**: High-risk derived dataset containing completed verb conjugation paradigms and structural enrichments. Derived from `MASTER_DATA_ENRICHED.json` (or `data/MASTER_DATA.json`) without mutating either baseline; validated against `data/MASTER_SCHEMA.json`.
- **Functions**: N/A (derived dataset artifact).

#### `enrichment/high-risk/plan.md`
- **Purpose**: Authoritative specification blueprint for the conservative high-risk enrichment pipeline governing invariants, conjugation contracts, trusted source allowlists, validation gates, dual reviewer approvals, transactional application, and the definition of full-enrichment completion.
- **Functions**: N/A (specification document).

#### `enrichment/high-risk/config/high_risk_config.py`
- **Purpose**: Authoritative configuration governing high-risk directory paths, legacy and complete-queue version constants, v2.1 fill/partial-completion modes, full 11-collection high-risk field inventories, active collection policy, and allowed operations.
- **Functions**:
  - `HIGH_RISK_FIELDS`: Dictionary of high-risk exclusions across 11 collections.
  - `ALLOWED_OPERATIONS`: Strict allowed operations list (`["set_if_missing_complete"]`).
  - `NATURAL_KEYS`: Natural key mapping per collection.
  - `CONTROLLED_NO_PROPOSAL_REASONS`: Approved reason codes for unproposed targets.
  - `FULL_QUEUE_VERSION`, `FULL_QUEUE_VALIDATOR_VERSION`, `FULL_QUEUE_APPLICATOR_VERSION`: Independent compatibility boundary for current complete-queue prompts, validation, and application.
  - `FULL_QUEUE_FILL_MODE`, `FULL_QUEUE_REPAIR_MODE`: Authorized v2.1 empty-field and preservation-only partial-conjugation completion modes.

#### `enrichment/high-risk/config/conjugation_contract.json`
- **Purpose**: Versioned machine-readable contract specifying canonical moods, mandatory tenses, person forms, display conventions, diacritics policy, and impersonal/defective verb exceptions.
- **Functions**: N/A (JSON contract specification).

#### `enrichment/high-risk/config/correction_conjugation_policy_v2_2.json`
- **Purpose**: Narrow, staging-only v2.2 policy overlay documenting evidence-backed correction exceptions without changing the frozen v2.1 contract. It currently declares `pouvoir` as having a null-only imperative, citing Larousse's statement that the imperative is inusité.
- **Functions**: N/A (JSON policy configuration).

#### `enrichment/high-risk/config/trusted_sources.json`
- **Purpose**: Versioned high-risk source registry. A reference remains unusable until it is marked `VERIFIED` and supplies a legal in-repository evidence snapshot plus its SHA-256; the initial entries are intentionally pending that evidence.
- **Functions**: N/A (JSON configuration).

#### `enrichment/high-risk/config/response_schema.json`
- **Purpose**: Formal JSON Schema enforcing strict fail-closed structure validation on AI worker `*_RESPONSE.json` files.
- **Functions**: N/A (JSON Schema).

#### `enrichment/high-risk/fixtures/sample_paradigms.json`
- **Purpose**: Checked-in reference test fixture containing complete canonical 7-tense conjugation paradigms matching `MASTER_SCHEMA.json` and `conjugation_contract.json`.
- **Functions**: N/A (JSON test fixture).

#### `enrichment/high-risk/scripts/high_risk_helpers.py`
- **Purpose**: Shared utilities for deterministic SHA-256 hashing, baseline loading, conjugation contract evaluation, morphological risk classification, and schema normalization.
- **Functions**:
  - `compute_file_sha256(path)`: Computes SHA-256 hash of a file on disk.
  - `compute_content_sha256(content)`: Computes SHA-256 hash of text or bytes.
  - `get_baseline_dataset_path()`: Resolves baseline dataset path (prefers normal-enriched output if present).
  - `load_baseline_dataset(path=None)`: Loads baseline dataset and returns parsed dict with SHA-256 hash.
  - `load_conjugation_contract()`: Loads `conjugation_contract.json`.
  - `load_trusted_sources()`: Loads `trusted_sources.json`.
  - `load_response_schema()`: Loads `response_schema.json`.
  - `is_pronominal(infinitive)`: Detects pronominal/reflexive verbs.
  - `is_impersonal(infinitive, contract=None)`: Detects impersonal verbs (e.g. `pleuvoir`, `falloir`).
  - `is_defective(infinitive)`: Detects defective verbs with incomplete paradigms.
  - `classify_morphological_type(verb, contract=None)`: Classifies verbs into morphological categories (`regular_er`, `regular_ir`, `spelling_change`, `irregular`, `pronominal`, `impersonal`, `defective`).
  - `evaluate_verb_conjugation_status(verb, contract)`: Evaluates verb against contract and returns status (`COMPLETE`, `MISSING`, `PARTIAL`, `MALFORMED`).
  - `normalize_conjugations_for_schema(conjs, infinitive)`: Normalizes endings (deduplication) and populates full `$defs/sourceEvidence` properties.
  - `validate_master_dataset_schema(dataset)`: Validates dataset against `MASTER_SCHEMA.json`.

#### `enrichment/high-risk/scripts/inventory_high_risk.py`
- **Purpose**: Read-only preflight auditor evaluating all 496 verbs against `MASTER_SCHEMA.json` and `conjugation_contract.json`, segregating verbs by morphological risk and emitting inventory reports.
- **Functions**:
  - `run_inventory(baseline_path=None)`: Executes preflight scan, checks natural key uniqueness, counts verb statuses, and writes `inventory.json` and `inventory_report.txt`.
  - `main()`: CLI entry point.

#### `enrichment/high-risk/scripts/inventory_full_high_risk.py`
- **Purpose**: Audits every configured high-risk field in a selected baseline or derived dataset, reports exact remaining empty slots and conjugation statuses, includes unresolved-source-item counts, and exposes strict high-risk and whole-dataset completion flags.
- **Functions**:
  - `_is_empty(value)`: Identifies high-risk values still considered unfilled.
  - `inventory_full_high_risk(dataset_path=None, emit_artifacts=True, reports_dir=REPORTS_DIR)`: Produces the machine-readable and human-readable all-field completion inventory.
  - `main()`: CLI entry point with optional `--require-complete` enforcement.

#### `enrichment/high-risk/scripts/make_high_risk_batch.py`
- **Purpose**: Deterministic batch generator slicing missing verbs into small (5-10) risk-segregated batches, producing worker `.txt` prompts, and maintaining `BATCH_MANIFEST.json`.
- **Functions**:
  - `format_batch_txt(batch_id, baseline_hash, targets, contract, trusted_sources)`: Formats worker prompt with rules, schema excerpts, and response template.
  - `generate_batch(morphology="regular_er", batch_size=5, batch_num=1, infinitive=None, baseline_path=None)`: Generates a single-field verb batch, records its checksum, and ignores unrelated/composite-key entries in a complete-queue manifest.
  - `main()`: CLI entry point.

#### `enrichment/high-risk/scripts/make_full_high_risk_queue.py`
- **Purpose**: Generates the v2.1 complete high-risk work queue from the normal-enriched baseline, covering every empty high-risk field plus completion batches for contract-classified partial verb conjugations. Prompts request non-empty `AI_GENERATED_UNVERIFIED` candidates and require repair candidates to retain every existing conjugation record unchanged.
- **Functions**:
  - `is_empty(value)`: Identifies fields eligible for fill-only batching.
  - `entity_key(collection, entity)`: Extracts configured scalar or composite natural keys.
  - `chunks(items, size)`: Creates deterministic fixed-size prompt groups.
  - `context(collection, field, entity)`: Produces target context with the complete existing non-target record for a proposal batch.
  - `resolve_schema_references(schema, definitions, stack=())`: Inlines local JSON Schema definitions into AI-readable field contracts.
  - `field_value_schema(master_schema, collection, field)`: Extracts one fully resolved target-field schema from the master schema.
  - `prompt(batch_id, collection, field, mode, baseline_hash, targets, value_schema)`: Formats a self-contained high-risk batch instruction file with an authoritative field-value schema and complete non-target context.
  - `build_queue(baseline_path=None)`: Writes the full batch set and its version/checksum manifest; refuses malformed or unsupported existing conjugation data.
  - `main()`: CLI entry point.

#### `enrichment/high-risk/scripts/make_correction_queue_v2_2.py`
- **Purpose**: Generates the isolated `corrections-v2.2` draft queue from the frozen v2.1 manifest, its aggregate validation summary, and raw responses. It groups only failed partial-conjugation repairs and strict-gate `NO_PROPOSAL` targets into compact, field-specific prompts without modifying frozen v2.1 files. Repair prompts preserve a hash-bound digest of baseline source evidence and explicitly remain staged until a reviewed v2.2 repair policy, validator, and applicator exist.
- **Functions**:
  - `chunks(items, size)`: Creates deterministic manually transferable prompt groups.
  - `key_token(value)`: Serializes scalar or composite natural keys for safe comparison.
  - `find_entity(data, collection, entity_key)`: Resolves correction targets against the immutable normal-enriched baseline.
  - `correction_context(collection, field, entity)`: Produces compact, field-specific context; conjugation context omits immutable source payloads and includes their SHA-256 digests instead.
  - `repair_instructions(contract)`: Formats draft canonical conjugation repair requirements and the required mood/tense/person contract.
  - `fill_instructions()`: Formats no-gap retry requirements for former `NO_PROPOSAL` targets.
  - `prompt(...)`: Creates a self-contained correction prompt with response envelope, schema, traceability, and exact response destination.
  - `load_failure_targets(summary, manifest, data)`: Collects failed v2.1 repair targets plus their precise validator errors.
  - `load_no_proposal_targets(summary, manifest, data)`: Collects former `NO_PROPOSAL` targets from their raw v2.1 response files.
  - `write_handoff(output_dir, manifest)`: Writes the manual/coordinator-agent handoff guide.
  - `build_correction_queue(output_dir, baseline_path=None, replace_generated=False)`: Safely writes the separate correction prompt set and local traceability manifest; replacement is limited to a verified prior generated queue.
  - `main()`: CLI entry point.

#### `enrichment/high-risk/scripts/validate_correction_queue_v2_2.py`
- **Purpose**: Provides a separate fail-closed staging validator for v2.2 correction responses. It validates the isolated correction-manifest envelope, target ownership, proposal completeness, no-placeholder and no-`NO_PROPOSAL` rules, exact field-schema conformance, canonical conjugation shape, staged-source rules, and a combined in-memory `MASTER_SCHEMA` dry run. A pass is only readiness for repair-policy review, never approval or application.
- **Functions**:
  - `load_correction_conjugation_policy(path=...)`: Loads and version-checks the narrow v2.2 exception policy.
  - `_validate_correction_conjugation_candidate(entity, candidate, contract, policy)`: Applies canonical contract validation plus null-only imperative exceptions; it never permits a non-null exception form.
  - `validate_correction_response(response_path, data, baseline_hash, manifest, master_schema, contract)`: Validates one staged response and produces its machine-readable report payload.
  - `validate_correction_folder(response_dir, reports_dir, baseline_path=None)`: Validates the complete correction response set, writes per-batch and aggregate reports, and dry-runs all passing proposals into the baseline.
  - `main()`: CLI entry point with optional strict `--require-complete` enforcement for policy-review readiness.

#### `enrichment/high-risk/scripts/validate_full_high_risk_response.py`
- **Purpose**: Validates v2.1 full-queue responses against their frozen manifest, baseline, target ownership, exact resolved field schema, fill/partial-completion preconditions, existing-conjugation preservation, canonical conjugation completeness, placeholder rules, and a full-dataset schema dry run. PASS artifacts remain review candidates rather than merge authorization.
- **Functions**:
  - `_key_token(key)`: Canonicalizes scalar and composite natural keys for ownership checks.
  - `_entity_key(collection, entity)`: Extracts an entity's configured natural key.
  - `_find_entity(data, collection, key)`: Resolves a target against the immutable baseline.
  - `_is_empty(value)`: Evaluates the fill-only precondition.
  - `_contains_placeholder(value)`: Recursively rejects strong placeholder markers in proposed values.
  - `_candidate_evidence(evidence, field, trusted_sources)`: Validates either the explicit unverified AI-candidate marker or a VERIFIED allowlisted source with a matching in-repository snapshot hash.
  - `_preserves_existing_conjugations(existing, candidate)`: Ensures partial-completion candidates retain all source-derived conjugation records unchanged.
  - `_validate_conjugation_candidate(entity, candidate, contract)`: Enforces canonical mood/tense uniqueness plus required personal, impersonal, and defective-form semantics.
  - `_write_validation_artifacts(response_path, response, report, reports_dir, validated_dir)`: Emits a validation report and integrity-bound review artifact only on PASS.
  - `validate_full_queue_response(response_path, baseline_path=None, emit_artifacts=False, reports_dir=None, validated_dir=None)`: Performs fail-closed v2.1 validation and optionally materializes reports/validated payloads.
  - `main()`: CLI entry point for one full-queue response.

#### `enrichment/high-risk/scripts/process_full_high_risk_responses.py`
- **Purpose**: Incrementally bulk-validates current v2.1 DeepSeek response files and produces an aggregate completion report that distinguishes missing files, validation failures, proposals, and `NO_PROPOSAL` gaps.
- **Functions**:
  - `process_response_folder(response_dir=RESPONSES_DIR, baseline_path=None, reports_dir=REPORTS_DIR, validated_dir=VALIDATED_DIR)`: Validates every current-manifest response found, writes per-batch artifacts and the full-queue summary, and computes strict review readiness.
  - `main()`: CLI entry point supporting incremental processing and final `--require-complete` enforcement.

#### `enrichment/high-risk/scripts/validate_high_risk_response.py`
- **Purpose**: Fail-closed validator checking candidate `*_RESPONSE.json` files against frozen-manifest metadata/checksums, target ownership, fill-only rules, evidence, canonical mood/tense uniqueness, and an in-memory schema dry run; it emits a hash-linked validated payload only on complete pass.
- **Functions**:
  - `validate_response(response_path, baseline_path=None)`: Runs the validation gates and emits the response and validation-report hashes used to bind later approval and application.
  - `main()`: CLI entry point.

#### `enrichment/high-risk/scripts/preview_high_risk.py`
- **Purpose**: Generic dry-run diff preview generator showing entity-by-entity before/after values for scalar or composite keys across legacy conjugations and all v2.1 high-risk collections/fields.
- **Functions**:
  - `_key_token(key)`: Canonicalizes scalar or composite keys.
  - `_entity_key(collection, entity)`: Extracts the configured natural key.
  - `_find_entity(data, collection, key)`: Resolves a baseline entity for preview.
  - `generate_preview(validated_file, baseline_path=None)`: Formats generic human-readable before/after diffs and writes `_PREVIEW.txt` report.
  - `main()`: CLI entry point.

#### `enrichment/high-risk/scripts/approve_high_risk.py`
- **Purpose**: Dual-reviewer approval tool for both legacy and current v2.1 high-risk fields. It accepts only validator-produced payloads bound to their matching PASS report and records a hash-based approval integrity chain.
- **Functions**:
  - `approve_batch(validated_path, linguistic_reviewer, compliance_reviewer, notes=None)`: Requires two distinct reviewers, verifies the matching PASS report, and copies a hash-bound approval payload to `approved/`.
  - `reject_batch(validated_path, reviewer, reason)`: Records rejection report in `rejected/`.
  - `approve_validated_folder(validated_dir, linguistic_reviewer, compliance_reviewer, notes=None)`: Bulk-approves only when every current batch is validated and no validated payload contains a `NO_PROPOSAL` gap.
  - `main()`: CLI entry point.

#### `enrichment/high-risk/scripts/apply_high_risk_enrichment.py`
- **Purpose**: Transaction-safe applicator applying only integrity-bound, current-baseline approvals to `enrichment/HIGH_RISK_DATA_ENRICHED.json`, enforcing output provenance state, atomic backups, fill-only invariants, schema validation, and immutable audit logging.
- **Functions**:
  - `state_path_for(output_path)`: Resolves the adjacent output-provenance state file.
  - `apply_approved_batch(approved_file, output_path=None, baseline_path=None)`: Re-runs authoritative validation, rejects stale/tampered approvals and incompatible existing outputs, then backs up, stages, schema-validates, atomically writes, and audits the derived dataset.
  - `main()`: CLI entry point.

#### `enrichment/high-risk/scripts/apply_full_high_risk_enrichment.py`
- **Purpose**: Generic v2.1 transaction-safe applicator for integrity-bound approvals across all configured high-risk collections and fields. It revalidates raw responses, protects both baseline datasets, enforces fill/repair preconditions, supports an explicit first-run rebuild of the historical stateless derived output, schema-validates staged data, atomically writes output/state, backs up prior output, and records immutable audits.
- **Functions**:
  - `state_path_for(output_path)`: Resolves the adjacent v2.1 provenance-state file.
  - `_key_token(key)`: Canonicalizes scalar or composite natural keys.
  - `_entity_key(collection, entity)`: Extracts the configured natural key.
  - `_find_entity(data, collection, key)`: Resolves one staged entity.
  - `_is_empty(value)`: Rechecks the fill-only precondition at application time.
  - `_atomic_write_json(path, payload)`: Atomically writes a JSON artifact beside its destination.
  - `apply_full_approved_batch(approved_file, output_path=None, baseline_path=None, ...)`: Verifies exact approved-to-validated payload identity plus the complete hash chain, stages one approved change set, enforces idempotence and preconditions, writes the derived output/state, and emits audit/report artifacts.
  - `apply_full_approved_folder(approved_dir=APPROVED_DIR, output_path=None, baseline_path=None, rebuild_from_baseline=False)`: Applies only current-manifest approvals in deterministic order.
  - `main()`: CLI entry point for one approval or a folder, including explicit `--rebuild` support.

#### `enrichment/high-risk/tests/test_high_risk_pipeline.py`
- **Purpose**: Automated suite verifying configuration boundaries, contract rules, isolated preflight classification, both legacy and v2.1 fail-closed validation paths, field-schema rejection, preservation-only conjugation completion, the isolated v2.2 correction queue, generic approval/application, bulk response reporting, idempotence, output safety guards, and source immutability.
- **Functions**:
  - `TestHighRiskConfiguration`: Tests configuration boundaries, versions, contracts, and allowlists.
  - `TestInventoryAndClassification`: Tests morphological classification plus legacy conjugation and full all-field inventory totals.
  - `TestBatchGeneratorAndManifest`: Tests complete-queue manifest presence, checksum locking, baseline metadata, isolated v2.2 correction-queue traceability, rejection of correction-response metadata mismatches, and the null-only `pouvoir` imperative exception.
  - `TestValidationGatesFailClosed`: Tests legacy fail-closed rejection across response, metadata, precondition, evidence, and placeholder gates without mutating the production manifest.
  - `TestFullQueueValidation`: Tests v2.1 no-proposal accounting, schema-valid candidate acceptance, schema rejection, and partial-conjugation preservation.
  - `TestApprovalAndSafeApplication`: Tests legacy protections plus v2.1 validation-to-approval-to-generic-application, idempotence, bulk missing-response reporting, and rejection of incomplete bulk approvals.

#### Directory Inventory: `batches/`, `responses/`, `validated/`, `approved/`, `rejected/`, `reports/`, `audits/`, `backups/`
- **Purpose**: Isolated lifecycle directories housing prompt `.txt` files, worker responses, validated payloads, approved batches with decision metadata, rejection reports, verification/preview/applied text reports, immutable audit logs (`*_AUDIT.json`), and atomic timestamped dataset backups.
- **Functions**: N/A (high-risk pipeline lifecycle directories).

#### `enrichment/high-risk/batches/corrections-v2.2/`
- **Purpose**: A separate v2.2 draft remediation workspace containing 25 compact prompts (`C22_001` through `C22_025`), `CORRECTION_MANIFEST.json`, and `HANDOFF.md`. It covers the 30 failed v2.1 conjugation-repair batches (147 targets) and 254 prior `NO_PROPOSAL` targets, but is not an approved or applicable dataset queue.
- **Functions**: N/A (generated correction prompts and traceability artifacts).

#### `enrichment/high-risk/{responses,validated,approved,reports,audits}/corrections-v2.2/`
- **Purpose**: Isolated lifecycle destinations for future v2.2 staged responses and the reports, validated candidates, approvals, and audits that may be created only after a reviewed v2.2 repair-policy implementation.
- **Functions**: N/A (empty/staged lifecycle directories).

---

### 12. Current Enrichment Reset (`enrichment/`)

#### `enrichment/ENRICHMENT_GAP_REPORT.md`
- **Purpose**: Read-only, 2026-09-10 inventory of content and provenance gaps in `MASTER_DATA.json`. It covers every collection, distinguishes intentional empty relationships from backlog candidates, identifies the 13 unresolved source items, and documents the present seven-paradigm verb coverage.
- **Functions**: N/A (Markdown report).

#### `enrichment/ENRICHMENT_INSTRUCTIONS.md`
- **Purpose**: The authoritative restart procedure for a future safe enrichment run. It defines immutable input protection, batch/manifest content, response destinations, fail-closed validation, lifecycle/audit folders, extra linguistic-risk review controls, derived-output-only application, and final verification.
- **Functions**: N/A (Markdown operating instructions).

#### `enrichment/REPAIR_POLICY_V2_2.md` (2026-09-26)
- **Purpose**: v2.2 canonical-replacement repair policy resolving the frozen-v2.1 incompatibility: malformed records may be replaced when schema-valid + hash-bound audit preserved + dual review passed. Non-goal: no promotion or migration runner ships here.
- **Functions**: N/A (Markdown policy).

#### `scripts/check-manager-integration.mjs` (2026-09-28)
- **Purpose**: `npm run manager:check` — live end-to-end check against a running Manager. Posts one log with the server key, one with the client key and one event with the analytics key; asserts each wrong key kind is refused (401, and a generic body for an unknown key); then hits this app's own `/api/peek?type=bogus` (400) and `/api/search?q=verbe` (200) so the app's real logging path is exercised. Requires `MANAGER_ENDPOINT`, `MANAGER_LOG_KEY`, `MANAGER_ANALYTICS_KEY` and `APP_ORIGIN` (default `http://localhost:3601`); `MANAGER_CLIENT_KEY` is optional and its check is skipped when unset.
- **Functions**: N/A (script; `check()` records pass/fail and the process exits 1 on any failure).

#### `scripts/measure-log-delivery.mjs` (2026-09-28)
- **Purpose**: `node scripts/measure-log-delivery.mjs [count]` — fires N entries at the facade the way a request handler would, counts the HTTP requests that actually reach the ingest endpoint, and reports latency, entries/request and SDK drops. The facade is TypeScript and this repo has no bundler dependency, so the script installs a `module.registerHooks` resolve hook that appends `.ts` to the facade's extensionless `./logger` import and lets Node's own type stripping do the transform — which also proves that specifier resolves outside Turbopack.
- **Functions**: N/A (script).

#### `scripts/field-coverage.ts` (2026-09-26)
- **Purpose**: Read-only field-completeness inventory regenerated from `data/MASTER_DATA.json` (`npm run data:coverage-report`, `--json` for machine output). First run found 3 real gaps (2× grammar explanations, 3× example translations, 31× exercise instructions).
- **Functions**:
  - `main()`: Prints per-collection coverage table + gap list.

---

## Verification

`npm run lint` (0 errors, 0 warnings) · `npm test` (full suite, incl. 14 Manager integration checks) · `npx tsc --noEmit` (clean) · `npm run build` (clean, 2614 prerendered pages) · `npm run manager:check` (8 checks) · `node scripts/measure-log-delivery.mjs 200`.

Manager integration verified end to end against a running Manager: a production server on :3601 answering `GET /api/peek?type=bogus` lands in Manager as `level=info source=server keyPrefix=mlk_A5g` ~1s after the request.
