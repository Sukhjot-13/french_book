# Dataset Freeze Check Report

## Redistribution Analysis
The shift from 860 to 1,023 vocabulary (+163) and 516 to 343 expressions (-173) is the result of **legitimate canonicalization and cleanup** rather than accidental deletion of valid expressions. 

Specifically, the targeted fix for English-French glossary tokenization correctly reclassified 163 single-word items (e.g., nouns, adjectives, and verbs like *beau*, *vedette*, *acteur*) that were previously misclassified as expressions due to commas, parentheticals, or English infinitive formats. These were appropriately moved into the `Vocabulary` collection. The remaining deficit of 10 expressions accounts for the complete deletion of garbage artifacts (mangled ligatures and instructional prose like *Regular adjectives in French...*).

## Expression Integrity Verification
Targeted queries confirm that genuine, multi-word expressions were perfectly preserved:
* **Expression Categories**: Important categories fully exist under the dataset's standardized `expression_type` enums, including `verb_pattern` (123 entries covering verb + à / verb + de / verb + person + infinitive), `fixed_expression` (158 entries), `connector` (22 entries), `idiom` (13 entries), and `collocation` (6 entries).
* **Representative Expressions**: The canonical expressions *avoir besoin de*, *venir de + infinitif*, *faire attention à*, *se souvenir de*, and *demander à qqn de + infinitif* are all present and intact. (*Note: "prendre une décision" was verified to exist only inside exercise prompts and was never formally extracted as a standalone expression in the baseline dataset prior to the targeted fix.*)

## Validation and Regressions
There are no regressions across other collections:
* The 163 added vocabulary items are clean, deduplicated lexical entries.
* Conjugations are complete with correct provenance mapping. 
* Final validation confirms 0 schema errors, 0 broken relations, and 12/12 automated smoke tests passing.

FREEZE_DATASET
