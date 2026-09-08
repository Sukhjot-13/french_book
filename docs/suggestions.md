# Project Suggestions & Roadmap

- **2026-09-03**: Cleaned up multi-meaning English translation presentation for verbs and vocabulary: added `formatEnglishList` and `formatMeaning` to join definitions with comma and space (`", "`) instead of concatenated text, with automatic deduplication of bare and to-infinitive pairs (e.g. `["accept", "to accept"]` -> `"to accept"`).
- **2026-09-03**: Enhanced desktop table scanning across Verbs (`VerbLibraryTable`) and Vocabulary (`VocabDictionaryTable`) with sticky column headers, subtle zebra striping, selected-row indicator (`data-selected`), visually dominant French terms, and right-aligned metadata/action badges.
- **2026-09-03**: Implemented purpose-built mobile two-line list layouts (`<768px`) for Verbs and Vocabulary (Line 1: French term · English gloss; Line 2: classification/aux/participle with tap-to-peek chevron).
- **2026-09-03**: Converted `PeekDrawer` into a mobile bottom sheet (`<768px`) with top grab indicator bar, rounded top corners, backdrop blur, and bottom slide-in animation.
- **2026-09-03**: Added client-side revision store (`reviewStore.ts`) and row action menu (`RowActionMenu`) enabling saving items for review and marking entries reviewed with local persistence and reactive status updates.
- **2026-09-03**: Fixed navbar search and mobile hamburger menu in `AppShell`: added explicit button types, route-change auto-closing, backdrop click-to-close, and visible close button (`✕`) in `CommandPalette` for phones without Escape keys.
- **2026-09-02**: Modernized data layer to consume `data/MASTER_DATA.json` (the 10-collection master dataset) directly with in-memory caching and strict TypeScript interfaces matching `MASTER_SCHEMA.json`.
- **2026-09-02**: Added resilient dual matching by canonical string/infinitive and slugs across all selectors.
- **2026-09-02**: Added defensive normalization and input guards in search and ID generation routines.
- **2026-09-02**: Implemented "Scan → Peek → Deep Dive" information architecture across all collections (Verbs, Vocabulary, Expressions, Grammar, Tenses, Chapters, Examples) per `gptsugg.txt`.
- **2026-09-02**: Implemented power-user keyboard navigation (`GlobalKeyboardShortcuts`) supporting `/` / `Cmd+K` (quick search), `Escape` (close drawer), `j` / `k` (row navigation), `Enter` / `Space` (open peek), and `o` (open deep dive).
- **2026-09-02**: (Idea) Add audio pronunciation playback for verb conjugations and vocabulary entries using the Web Speech API.

## 🟡 New Features
- **2026-09-04**: (Implemented) Conservative **High-Risk Enrichment Pipeline** (`enrichment/high-risk/`) for complete verb conjugation paradigms and structural linguistic facts: includes versioned `conjugation_contract.json`, trusted source allowlists (`trusted_sources.json`), morphological risk segregation, 15 fail-closed validation gates, dual reviewer approvals, transactional application, atomic backups, immutable audit logs, and isolated derived dataset `enrichment/HIGH_RISK_DATA_ENRICHED.json`.
- **2026-09-03**: (Idea) Build a separate, copy-only new-data intake pipeline for proposing genuinely missing entities (for example, new connectors). It should send the AI a compact collection summary—natural keys, categories, and relevant relationships rather than the full master dataset—then validate duplicate natural keys and cross-references before adding approved records only to `enrichment/MASTER_DATA_ENRICHED.json`.
- **2026-09-02**: (Implemented) Dedicated **Exceptions & Traps Library** view (`/traps`) exposing the 108 curated pitfalls with side-by-side correct vs incorrect forms, category filters, and cross-references.
- **2026-09-02**: (Implemented) Interactive **Exercise Mode** (`/exercises` and within `/chapters/[id]`) showing the 217 curriculum exercises with question prompts, multiple-choice options, and interactive revealable answers.
- **2026-09-02**: (Implemented) Complete **Conjugation Matrix** on `/verbs/[id]` displaying all moods (Indicatif, Subjonctif, Conditionnel, Impératif) and tenses with person forms directly from the verb's conjugations array.
- **2026-09-02**: (Implemented) Universal **PeekDrawer & Peek API** (`/api/peek`, `PeekContext`, `PeekDrawer`) providing instantaneous Level 2 slide-over previews without leaving page context.
- **2026-09-02**: (Implemented) Dense **Alphabetical Vocabulary Dictionary** (`/vocabulary`) with A-Z jump bar, part of speech filtering, and fast peek.
- **2026-09-02**: (Implemented) Syntactic **Expression Library Table** (`/expressions`) emphasizing pattern formulas, preposition filtering (à, de, en, sur, pour, avec), and base-verb cross-links.
- **2026-09-02**: (Implemented) Chapter **Dashboard & Tabbed View** (`/chapters/[id]`) with 1-screen Quick Cheat Sheet and clean tabbed navigation.
- **2026-09-02**: (Implemented) Dedicated **Concepts Directory & Deep Dive** (`/concepts`, `/concepts/[id]`) exposing the 206 grammatical and pedagogical concepts with CEFR levels, categories, and relationship graphs.
- **2026-09-02**: (Implemented) Dedicated **Vocabulary Detail View** (`/vocabulary/[id]`) with gender pill, article, senses, synonyms, antonyms, base verbs, and contextual sentences.
- **2026-09-02**: (Implemented) **Dual-view (Card & Table) Tenses Directory** (`/tenses`) with Scan → Peek and fast mood filtering.
- **2026-09-02**: (Implemented) **Sticky Subnavigation & Deep-Link Anchors** across Verb, Grammar, Tense, and Expression detail views.
- **2026-09-02**: (Implemented) **Homepage Direct Action Jump Targets** for Irregular Verbs, Subjunctive, Priority 1 Rules, B1 Intermediate, Preposition Phrases, and Traps.
- **2026-09-02**: (Implemented) **Integrated Drill & Practice Hooks** bridging detail views directly into targeted chapter/search exercise quizzes.
- **2026-09-02**: (Implemented) **Cross-collection Example Explorer Filtering** linking verbs, tenses, grammar rules, and expressions to contextual sentence instances.
- **2026-09-02**: (Idea) Add a Spaced Repetition System (SRS) flashcard review mode for vocabulary and irregular verbs stored in browser LocalStorage.

## 🔴 Vulnerabilities
- **2026-09-08**: The full high-risk queue has no VERIFIED local evidence snapshots. It now permits explicitly marked `AI_GENERATED_UNVERIFIED` candidates for later review, but no candidate may be promoted to learner-facing data without field-specific validation and approval.
