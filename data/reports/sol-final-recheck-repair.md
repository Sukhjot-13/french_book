# Sol final recheck repair

- Fixed exercise boundary handling: running headers, page markers, copyright/footer text, and post-exercise prose are excluded without character truncation. Continued exercises now extract through their source answer slots.
- Source-vs-final exercises: 1,872 / 1,872 identities reconciled; no missing, unexpected, or duplicate question identities.
- Answer provenance: all 1,872 answers retain their own `page_printed` and `page_pdf`; multi-page exercises 2.3, 8.7, 14.1, and 22.1 retain page-level provenance per answer.
- Vocabulary/glossary: repaired POS precedence, compact adjective variants, gender payload isolation, multiword row segmentation, and running-header/footer rejection. Clean source-entry reconciliation is 1,941 / 1,941. Remaining source-supported `other` entries are listed in `data/reports/remaining-other-entries.json`.
- Verb tables: parsed all 98 source rows with tense-specific table identities; page 239 now skips the past-participle column before the six present forms. Exact source-form reconciliation is 98 / 98.
- Validation: source-backed exercise reconciliation now fails the pipeline for identity or answer-provenance gaps; coverage reports verify glossary IDs and exact verb forms. Semantic/POS/provenance checks were expanded.
- Tests/idempotence: `npm run data:all`, `npm run data:test-regressions`, and `npm run build` pass. Two rebuilt canonical datasets, excluding timestamps, have SHA-256 `174fb7374e2eb0d30c05aa1dece98e8d59ee8e59880542eb8a40c5d9040e6b58`.

READY_FOR_FINAL_FREEZE_RECHECK
