# Project Suggestions & Roadmap

## 🟢 Improvements

- **2026-09-02**: (Idea) Add audio pronunciation playback for verb conjugations and vocabulary entries using the Web Speech API.

## 🟡 New Features

- **2026-09-03**: (Idea) Build a separate, copy-only new-data intake pipeline for proposing genuinely missing entities (for example, new connectors). It should send the AI a compact collection summary—natural keys, categories, and relevant relationships rather than the full master dataset—then validate duplicate natural keys and cross-references before adding approved records only to `enrichment/MASTER_DATA_ENRICHED.json`.

## 🔴 Vulnerabilities

- **2026-09-08**: The full high-risk queue has no VERIFIED local evidence snapshots. It now permits explicitly marked `AI_GENERATED_UNVERIFIED` candidates for later review, but no candidate may be promoted to learner-facing data without field-specific validation and approval.
