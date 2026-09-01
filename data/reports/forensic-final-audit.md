# Forensic Final Audit Report

This report documents a targeted forensic hardening audit of three specific edge cases in the French revision dataset to ensure absolute integrity before the dataset is permanently frozen.

## 1. Conjugation Provenance Result
**Status: ISSUE FOUND**

A random sample of irregular verbs (e.g., *cueillir*, *écrire*, *naître*, *voir*) revealed an issue with provenance honesty. 

While the dataset correctly contains full 11-tense paradigms for the 48 irregular verbs, the generated/derived forms are falsely represented as being explicitly printed in the book. Specifically, derived tenses (such as the present conditional `je cueillerais` or the past subjunctive `que j'aie vu`) have an empty/null `origin` object but are accompanied by an attestation claiming they appear in a `conjugation_table` on printed page 239. 

In reality, page 239 is an index that only provides principal parts, not complete 11-tense paradigms. According to the dataset specification, these forms must not be falsely represented as directly book-attested.

**Recommendation**: Update the reconciliation script to correctly mark expanded paradigm forms with `origin.source_type: "derived_from_book"` and remove the false explicit `conjugation_table` attestations for forms that were programmatically generated rather than directly printed.

## 2. Glossary Classification Result
**Status: ISSUE FOUND**

A sample of vocabulary and expressions sourced from the English-French glossary (`glossary_en_fr`) revealed significant tokenization and parsing errors:
- **Parenthetical and Comma Mangling**: Ambiguous entries with gender variants are severely mangled. For example, the parser extracted the expression `expr_beau_bel` with the canonical form `beau (bel,` and the English definition `belle) beautiful`. Similarly, `star (film)` was mangled into the expression `lm) vedette`.
- **Instructional Prose Ingestion**: English instructional notes embedded in the glossary were erroneously extracted as French expressions. For instance, the dataset contains an expression `expr_listed_in_their_masculine_singular_form` with the canonical form `Regular adjectives in French are listed in their masculine singular form.`
- **Deduplication Failures**: Words listed with infinitive markers in English (e.g. "enter, to" and "to enter") were not properly deduplicated, resulting in redundant English search senses.

**Recommendation**: Fix the `parseGlossaryEnFrEnhanced` script to correctly parse parenthetical variants (e.g., `beau (bel, belle)`), cleanly drop instructional notes, and handle comma boundaries properly without creating garbage entities.

## 3. Low-Count Example Chapter Result
**Status: SOUND (NO ISSUE)**

A direct PDF inspection of chapters with suspiciously low example counts confirmed the scanner is working as intended:
- **Chapter 10 (5 examples)**: Primarily contains grammar rules and exercise prompts. The 5 extracted examples (e.g., *Je ne m’étais pas rendu compte que j’étais malade*) are exactly the few instructional sentences provided.
- **Chapter 15 (6 examples)**: Primarily covers participle conjugations. The 6 extracted examples accurately capture the rare illustrative sentences (e.g., *Traversant la rue, elle a perdu son chapeau*).
- **Chapter 25 (2 examples)**: Focuses on numbers and ordinal lists rather than illustrative sentences.
- **Chapter 20 (135 examples)**: Checked as a control for false-positive over-extraction. The 135 examples are genuine, short instructional sentences demonstrating direct and indirect object pronouns (e.g., *L’artiste la chante*, *Il m’appelle*).

**Recommendation**: None. The example extraction logic is highly accurate and appropriate.

## Final Recommendation
Two of the three areas require small but critical fixes before the dataset can be frozen. No modifications were made during this audit.

TARGETED_FIX_REQUIRED
