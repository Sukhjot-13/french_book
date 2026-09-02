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

FINAL_TYPED_REFERENCES: 3418; FINAL_RESOLVED: 3418; FINAL_BROKEN: 0.

## Generated Global Trace Repair

Generated tense traces use real source files, source entity IDs, relationship fields, and reference locations.

## Provenance Accounting Repair

{
  "DIRECT_SOURCE_ATTESTATION_OBJECTS": 753,
  "GENERATED_SOURCE_ATTESTATIONS_FROM_GLOSSARY_ROWS": 1893,
  "GENERATED_SOURCE_ATTESTATIONS_FROM_VERB_TABLE_VERB_ROWS": 56,
  "GENERATED_SOURCE_ATTESTATIONS_FROM_VERB_TABLE_CONJUGATION_ROWS": 104,
  "DERIVED_FROM_BOOK_ATTESTATIONS": 4,
  "OTHER_GENERATED_GRAPH_EVIDENCE": 31,
  "FINAL_ATTESTATION_OCCURRENCES": 2837,
  "FINAL_UNIQUE_ENTITY_ATTESTATIONS": 2824,
  "EXACT_DUPLICATE_ATTESTATIONS_COLLAPSED": 13,
  "CONFIRMED_MALFORMED_SOURCE_EVIDENCE_REJECTED": 108,
  "SOURCE_EVIDENCE_RECONCILED": 2823,
  "UNACCOUNTED_SOURCE_EVIDENCE": 0,
  "arithmetic": "UNACCOUNTED_SOURCE_EVIDENCE is computed deterministically as authoritative source evidence minus reconciled evidence minus confirmed malformed rejected evidence."
}

## Regression Tests

See scripts/test-master-semantic-repair.ts.

## Idempotence

e9faedf5b2fea18924eb73bfb2604f158b342b4e94e517450ba88090da46910c; master-idempotence-report.json records the two-run comparison.

## Preserved Previously-Fixed Areas

Answer-key repairs, imperative paradigms, functional roles, pronominals, chapter metadata, and targeted expressions remain regenerated from source inputs.

## Remaining Blocking Issues

None detected by the final typed relationship traversal.

## Remaining Non-Blocking Items

The source’s sparse table-only English metadata remains intentionally unexpanded.

## Final Decision

MASTER_SECOND_REPAIR_READY_FOR_REAUDIT
