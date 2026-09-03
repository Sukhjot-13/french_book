# Project Suggestions & Roadmap

## 🟢 Improvements
- **2026-09-02**: Modernized data layer to consume `data/MASTER_DATA.json` (the 10-collection master dataset) directly with in-memory caching and strict TypeScript interfaces matching `MASTER_SCHEMA.json`.
- **2026-09-02**: Added resilient dual matching by canonical string/infinitive and slugs across all selectors.
- **2026-09-02**: Added defensive normalization and input guards in search and ID generation routines.
- **2026-09-02**: Implemented "Scan → Peek → Deep Dive" information architecture across all collections (Verbs, Vocabulary, Expressions, Grammar, Tenses, Chapters, Examples) per `gptsugg.txt`.
- **2026-09-02**: Implemented power-user keyboard navigation (`GlobalKeyboardShortcuts`) supporting `/` / `Cmd+K` (quick search), `Escape` (close drawer), `j` / `k` (row navigation), `Enter` / `Space` (open peek), and `o` (open deep dive).
- **2026-09-02**: (Idea) Add audio pronunciation playback for verb conjugations and vocabulary entries using the Web Speech API.

## 🟡 New Features
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
- *(None identified at present)*
