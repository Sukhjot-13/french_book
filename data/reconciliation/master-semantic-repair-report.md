# Master Semantic Repair Report

## Baseline

Reference: final-master-semantic-audit.md

## Executive Summary

The preview was regenerated exclusively from the 31 structured inputs. Stable canonical hash: `f6cd68af9d34c0d5e7e6476837f1f8398ff3252ff33870d715c11b23af5b9de4`.

## Relationship Repairs

- BEFORE: 219 independently observed broken typed references.
- ROOT CAUSE: source-local IDs were rewritten without source-aware/global aliases and the prior audit omitted nested typed relationship fields.
- PIPELINE CHANGE: complete schema-aware typed walker, canonical alias rewriting, source-backed targets, and explicit rejection records for English pseudo-verbs and empty-paradigm placeholders.
- AFTER: TOTAL_TYPED_REFERENCES=3023; RESOLVED=3023; MALFORMED_SOURCE_RELATIONS_REJECTED=396; UNRESOLVED=0.

## Glossary Corruption Repairs

Structural bilingual column-boundary detection rejected 22 malformed source rows before entity construction. Trace: master-glossary-corruption-repairs.json.

## Vocabulary Gender / POS / Sense Repairs

Glossary noun gender is retained; disagreeing gender-bearing senses are separated rather than silently flattened (including voile).

## Expression Repairs

Base-verb links are rebuilt from source-supported canonical infinitives. Source-derived patterns include prendre une décision and avoir [NUMBER] ans where the exercise source attests them; rendre visite variants reconcile to one construction.

## Tense Canonicalization

French chapter tense IDs and English verb-table tense labels use deterministic aliases before conjugation creation.

## Conjugation Repairs

Empty synthetic paradigms are not emitted. Imperative forms use imperative_forms; verb-table paradigms retain row/table attestations and compound table metadata.

## Verb Functional Role / Pronominal Repairs

functional_roles distinguishes auxiliary/modal/impersonal source roles from morphological verb_group; source pronominal spellings retain their flag.

## Answer-Key Boundary Repairs

Two auditable PDF-verified corrections are recorded in master-answer-key-corrections.json.

## Book Metadata Repairs

book.chapter_ids contains 27 ordered chapters; PDF page count is read from the local source PDF (286).

## Provenance Accounting

The merge summary distinguishes source attestation objects from structured glossary and verb-table provenance.

## Regression Test Results

See scripts/test-master-semantic-repair.ts.

## Idempotence

Canonical hash: `f6cd68af9d34c0d5e7e6476837f1f8398ff3252ff33870d715c11b23af5b9de4`. A second identical run must reproduce it (excluding volatile timestamps).

## Remaining Blocking Issues

None detected by the complete typed reference audit.

## Remaining Non-Blocking Review Items

prendre un verre variants and source-table English gaps remain deliberately unexpanded.

## Final Decision

MASTER_REPAIRED_PREVIEW_READY_FOR_REAUDIT
