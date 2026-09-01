# Final Independent Semantic Audit Report

## Executive Summary
An independent, direct PDF-to-dataset semantic audit was conducted on the French grammar dataset to verify the claims made in the recent `semantic-enrichment-report.md`. While the enrichment pass did increase the total count of several linguistic entities, the dataset **fails** to comprehensively cover the source text. Severe under-extraction, missing glossary data, and inflated or misleading claims in the enrichment report necessitate further extraction.

## Final Verdict
**NEEDS_FURTHER_ENRICHMENT**

## Audit Method
1. Direct extraction of entity counts and categorical distributions via Python scripts against `data/final/french_grammar.json`.
2. Cross-referencing against the requirements established in `french_revision_super_dataset_spec.txt` and `GEMINI_BOOK_PARSING_TODO.txt`.
3. Sampling of `source_book.pdf` content across chapters 1-5, 6-10, 11-15 (specifically Chapter 14), 16-20, 21-27, verb tables, and both glossaries.
4. Validation of the specific claims made in `semantic-enrichment-report.md`.

## Example Coverage
**Status: DEFICIENT**
The dataset contains 231 examples. The enrichment report claimed 231 examples. While this matches the JSON count, 231 examples for a 286-page grammar book is severely inadequate. A standard page in the PDF contains 5-10 examples. The requirement was to extract *every* italicized or bolded French example sentence. With 27 chapters, this averages less than 10 examples per chapter, proving that massive amounts of illustrative source sentences remain unextracted.

## Vocabulary / Glossary Coverage
**Status: DEFICIENT**
Total vocabulary items: 961. The enrichment report explicitly claimed to have reparsed the English-French glossary (pages 250-259). However, there are exactly 0 items attested to the English-French glossary (`glossary_en_fr`) in the dataset. Standard words like 'accept', 'beautiful', and 'country' are completely missing from the English translations. The En-Fr glossary ingestion failed or was not merged correctly.

## Expression / Pattern / Collocation Coverage
**Status: PARTIALLY ENRICHED BUT INCOMPLETE**
- **Verb + à patterns**: 44 extracted.
- **Verb + de patterns**: 60 extracted.
- **Verb + person + infinitive**: 15 extracted.
- **Subjunctive triggers**: 42 extracted.
Chapter 14 was sampled and successfully shows ingestion of `verb + de` and `verb + à` patterns, rectifying the major omission from the previous audit. However, multi-verb constructions, discourse connectors, and idiomatic sentence starters are still sparsely represented globally.

## Conjugation Coverage
**Status: DEFICIENT**
Total conjugations: 221. The enrichment report claims to have ingested '15-tense complete paradigms for core models' (15 verbs * 15 tenses = 225 conjugations) PLUS 'full present indicative paradigms... for all 48 irregular verbs'. This would mathematically require at least 273 conjugations. The dataset only containing 221 conjugations proves that the enrichment report's claims are inflated or the pipeline failed to persist the extracted data.

## Grammar and Verb Coverage
**Status: ACCEPTABLE**
Total Grammar Rules: 93. Total Verbs: 376. The core structural extraction of rules and verbs appears solid, but they lack the dense network of examples that should be attached to them.

## Exercise / Answer-Key Coverage
**Status: ACCEPTABLE**
Total Exercises: 197. Total Questions: 1799. The exercises and their answer key reconciliations appear robust, matching the enrichment report's claims.

## Provenance / Attestation Accuracy
**Status: ACCEPTABLE (for existing entities)**
Existing entities possess valid deterministic IDs and PDF page attestations. However, missing entities inherently lack provenance.

## Cross-Link Integrity
**Status: ACCEPTABLE**
No broken relations were found. The structural graph is intact, but the graph is 'sparse' due to the missing examples and expressions.

## Duplicate / Over-Extraction Checks
No egregious duplicates were found, primarily because the dataset suffers from under-extraction rather than over-extraction.

## Direct PDF Sample Results
- **Chapters 1-5**: Examples sparsely extracted.
- **Chapters 6-10**: Examples sparsely extracted.
- **Chapters 11-15**: Chapter 14 expressions (à/de) successfully extracted, but examples remain low.
- **Chapters 16-20**: Examples sparsely extracted.
- **Chapters 21-27**: Examples sparsely extracted.
- **Verb Tables**: Incomplete ingestion (claims of 15 tenses for core models + 48 irregulars do not match the 221 total count).
- **Fr-En Glossary**: Successfully extracted (952 attestations).
- **En-Fr Glossary**: FAILED extraction (0 attestations). Words like 'accept' and 'beautiful' are missing.

## Remaining Deficiencies
1. **Examples**: Massive under-extraction of illustrative sentences from the instructional prose.
2. **Conjugations**: Missing paradigms that were explicitly claimed to be fixed.
3. **En-Fr Glossary**: Entire section missing from the vocabulary collection.

## Required Fixes
- Fix the En-Fr glossary ingestion script to correctly persist the vocabulary.
- Overhaul the example sentence extraction to truly capture the 1,000+ illustrative sentences in the PDF.
- Verify the conjugation tables parser to ensure all claimed paradigms are actually persisted to the JSON.

## Final Acceptance Checklist
- [x] Expressions count reflects prepositional patterns (verb + à/de).
- [ ] Examples count exceeds 1500+ (capturing all illustrative sentences).
- [ ] Conjugations count reflects complete paradigms for all major irregular and regular verbs taught.
- [ ] Both Fr-En AND En-Fr glossaries are fully ingested.
- [x] All extracted items have accurate `attestations` linked back to the PDF page and context type.

