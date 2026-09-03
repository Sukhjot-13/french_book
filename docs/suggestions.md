# Project Suggestions & Roadmap

## 🟢 Improvements
- **2026-09-02**: Modernized data layer to consume `data/MASTER_DATA.json` (the 10-collection master dataset) directly with in-memory caching and strict TypeScript interfaces matching `MASTER_SCHEMA.json`.
- **2026-09-02**: Added resilient dual matching by canonical string/infinitive and slugs across all selectors.
- **2026-09-02**: Added defensive normalization and input guards in search and ID generation routines.
- **2026-09-02**: (Idea) Add audio pronunciation playback for verb conjugations and vocabulary entries using the Web Speech API.

## 🟡 New Features
- **2026-09-02**: (Implemented) Dedicated **Exceptions & Traps Library** view (`/traps`) exposing the 108 curated pitfalls with side-by-side correct vs incorrect forms, category filters, and cross-references.
- **2026-09-02**: (Implemented) Interactive **Exercise Mode** (`/exercises` and within `/chapters/[id]`) showing the 217 curriculum exercises with question prompts, multiple-choice options, and interactive revealable answers.
- **2026-09-02**: (Implemented) Complete **Conjugation Matrix** on `/verbs/[id]` displaying all moods (Indicatif, Subjonctif, Conditionnel, Impératif) and tenses with person forms directly from the verb's conjugations array.
- **2026-09-02**: (Idea) Add a Spaced Repetition System (SRS) flashcard review mode for vocabulary and irregular verbs stored in browser LocalStorage.

## 🔴 Vulnerabilities
- *(None identified at present)*
