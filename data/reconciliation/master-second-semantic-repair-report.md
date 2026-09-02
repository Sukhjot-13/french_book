# Second Master Semantic Repair Report

## Baseline

Reference: final-master-reaudit.md

## Executive Summary

Targeted regeneration completed with no ID-decoded semantic shells and 0 unresolved typed references.

## Tense Mood Repair

Source table/chapter aliases set canonical moods: {"conditional":2,"indicative":8,"gerund":1,"imperative":1,"subjunctive":4,"infinitive":2,"participle":1}.

## Compound Paradigm Repair

Compound status now derives from the exact source table ID, never a fallback anchor.

## Remaining Glossary Corruption Repair

The structural continuation class is rejected; PDF page 272 restores merci -> thank you with glossary provenance.

## Placeholder Entity Removal

No source_reference_target shells or empty generated rules/examples remain. Unresolved source IDs are rejected with owner evidence instead of becoming entities.

## Relationship Reconciliation After Placeholder Removal

FINAL_TYPED_REFERENCES: 3023; FINAL_RESOLVED: 3023; FINAL_BROKEN: 0.

## Generated Global Trace Repair

Generated tense traces use real source files, source entity IDs, relationship fields, and reference locations.

## Provenance Accounting Repair

{
  "DIRECT_SOURCE_ATTESTATION_OBJECTS": 576,
  "GENERATED_SOURCE_ATTESTATIONS_FROM_GLOSSARY_ROWS": 1906,
  "GENERATED_SOURCE_ATTESTATIONS_FROM_VERB_TABLE_VERB_ROWS": 56,
  "GENERATED_SOURCE_ATTESTATIONS_FROM_VERB_TABLE_CONJUGATION_ROWS": 104,
  "DERIVED_FROM_BOOK_ATTESTATIONS": 4,
  "OTHER_GENERATED_GRAPH_EVIDENCE": 19,
  "FINAL_UNIQUE_ATTESTATIONS": 2660,
  "REJECTED_SOURCE_EVIDENCE": 396,
  "UNACCOUNTED_SOURCE_EVIDENCE": 0,
  "arithmetic": "FINAL_UNIQUE_ATTESTATIONS is the deduplicated canonical attestation total; categories may overlap by entity role but no source attestation is unaccounted."
}

## Regression Tests

See scripts/test-master-semantic-repair.ts.

## Idempotence

f6cd68af9d34c0d5e7e6476837f1f8398ff3252ff33870d715c11b23af5b9de4; master-idempotence-report.json records the two-run comparison.

## Preserved Previously-Fixed Areas

Answer-key repairs, imperative paradigms, functional roles, pronominals, chapter metadata, and targeted expressions remain regenerated from source inputs.

## Remaining Blocking Issues

None detected by the final typed relationship traversal.

## Remaining Non-Blocking Items

The source’s sparse table-only English metadata remains intentionally unexpanded.

## Final Decision

MASTER_SECOND_REPAIR_READY_FOR_REAUDIT
