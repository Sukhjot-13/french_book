# Targeted Final Fix Report

This report documents the resolution of the two targeted deficiencies identified in `data/reports/forensic-final-audit.md` before final dataset freezing.

---

## 1. Root Fixes Made

### Fix 1 — Conjugation Provenance Hardening
- **Schema Update**: Added `origin: OriginMetadataSchema.default({ source_type: "book", created_by: "extraction", derived_from_ids: [] })` directly into `ConjugationSchema` in [schemas.ts](file:///Users/sukhjot/codes/book/src/lib/dataset/schemas.ts).
- **Generator Hardening**: Updated `buildEnrichedConjugations()` in [parse-conjugations-enhanced.ts](file:///Users/sukhjot/codes/book/scripts/enrichment/parse-conjugations-enhanced.ts):
  - Directly printed forms (e.g., present indicative on page 239 for irregular verbs, or pp. 236–238 for model verb tables) retain genuine book attestations and `origin.source_type: "book"`.
  - Programmatically derived tenses (such as compound tenses, imperfect, conditional, subjunctive, etc. not printed on page 239) now accurately carry `origin.source_type: "derived_from_book"`, `origin.created_by: "rule_expansion"`, and have all false page 239 `conjugation_table` attestations removed.
  - All 11-tense paradigms and conjugation forms across all verbs remain 100% preserved.
- **Reconciliation Hardening**: Updated [reconcile-global.ts](file:///Users/sukhjot/codes/book/scripts/reconcile-global.ts) to merge chapter-extracted book conjugations with enriched conjugations without overwriting genuine chapter book attestations.

### Fix 2 — English-French Glossary Parsing & Classification
- **Ligature Cleanup**: Added `cleanLigatures()` in [parse-glossary-enhanced.ts](file:///Users/sukhjot/codes/book/scripts/enrichment/parse-glossary-enhanced.ts) to resolve PDF font ligature spaces (`fi lm` $\to$ `film`, `fi l` $\to$ `fil`, `souff rir` $\to$ `souffrir`, `soft ware` $\to$ `software`, `coff ee` $\to$ `coffee`).
- **Instructional Prose Dropping**: Filtered instructional notes and copyright statements (`Regular adjectives in French are listed in their masculine singular form.`, `Copyright © 2008...`) to prevent ingestion as vocabulary or expression entities.
- **Parenthetical & Comma Disambiguation**:
  - `parseGlossaryFrEnEnhanced` preserves internal parentheticals like `beau (bel, belle)` without splitting across commas.
  - `parseGlossaryEnFrEnhanced` correctly distinguishes English qualifiers like `star (film)` and `fine (penalty)` from French headwords (`vedette`, `amende`), and preserves English variant pairs (`actor, actress`).
- **English Infinitive Normalization**: Normalized English infinitives (`enter, to` $\to$ `to enter`, `born, to be` $\to$ `to be born`, `brown, to (cooking)` $\to$ `to brown (cooking)`) to eliminate redundant duplicate search senses.
- **Entity Classification**: Properly mapped single nouns, adjectives, and gender pairs (`beau, bel, belle`, `acteur, actrice`) to `Vocabulary` (`is_expression: false`) rather than creating spurious `Expression` records.

---

## 2. Garbage / Incorrect Entities Removed

The following spurious entities created by faulty tokenization have been completely eliminated:
- `vocab_regular` (caused by instructional prose footer)
- `expr_listed_in_their_masculine_singular_form` (caused by instructional prose footer)
- `expr_beau_bel` (mangled parenthetical `beau (bel,`)
- `expr_lm_vedette` (mangled ligature `lm) vedette`)
- `expr_film_tournage` (mangled parenthetical `(film) tournage`)
- `expr_woman_artisan_e` (mangled parenthetical `(-woman) artisan(e)`)
- `expr_penalty_amende` (mangled parenthetical `(penalty) amende`)
- `expr_computer_pirate` (mangled parenthetical `(computer) pirate`)
- `expr_keyboard_touche` (mangled parenthetical `(keyboard) touche`)
- `expr_criminal_peine` (mangled parenthetical `(criminal) peine`)
- `expr_college_etudiant_e` (mangled parenthetical `(college) étudiant(e)`)
- `expr_wristwatch_montre` (mangled parenthetical `(wristwatch) montre`)

---

## 3. Targeted Verification

### A. Conjugation Provenance Verification
- **Page 239 Integrity**: Exactly 48 conjugations now cite printed page 239 (strictly `tense_present_indicative` for the 48 irregular verbs). Zero non-present tenses falsely cite page 239.
- **Sample Verbs Audit**:
  - `verb_cueillir`:
    - `tense_present_indicative`: `origin.source_type: "book"`, attestation page 239.
    - `tense_passe_compose`, `tense_imparfait`, `tense_futur_simple`, `tense_conditionnel_present`, `tense_subjonctif_present`: `origin.source_type: "derived_from_book"`, `attestations: []`.
  - `verb_ecrire`, `verb_naitre`, `verb_voir`, `verb_avoir`, `verb_etre`, `verb_aller`: Audited with 100% correct provenance separation between printed forms and rule-expanded forms.
- **Global Breakdown**:
  - Total Conjugations: 468
  - Directly Book-Attested Conjugations: 74
  - Derived-from-Book Conjugations: 394

### B. Glossary Parser & Classification Verification
- `beau (bel, belle)`: Stored cleanly as [vocab_beau](file:///Users/sukhjot/codes/book/data/final/french_grammar.json) (`canonical_form: "beau"`, `english: ["beautiful"]`). Zero bogus expression entities.
- `star (film)`: Reconciled cleanly with [vocab_vedette](file:///Users/sukhjot/codes/book/data/final/french_grammar.json) (`canonical_form: "vedette"`, `gender: "feminine"`, `english: ["(movie) star", "star (film)"]`).
- `star`: Stored cleanly as [vocab_etoile](file:///Users/sukhjot/codes/book/data/final/french_grammar.json) (`canonical_form: "étoile"`, `gender: "feminine"`, `english: ["star"]`).
- `Regular adjectives...`: 0 matching entries in vocabulary or expressions.
- English senses: `entrer` and `accepter` carry clean, deduplicated senses without inverted `, to` duplicates.

---

## 4. Before / After Relevant Counts

| Metric | Before Fix | After Fix | Change |
| :--- | :--- | :--- | :--- |
| **Total Conjugations** | 470 | 468 | -2 (removed false non-verb tables) |
| **Page 239 Attested Conjugations** | 200 (152 false) | 48 (100% genuine) | -152 false attestations removed |
| **Derived Conjugations (`derived_from_book`)** | 0 (unmarked) | 394 (explicitly marked) | +394 marked |
| **Vocabulary Count** | 1,024 | 1,023 | -1 (dropped instructional `vocab_regular`) |
| **Expression Count** | 358 | 343 | -15 (removed all mangled expressions) |
| **Schema Validation Errors** | 0 | 0 | 0 |
| **Broken Relation IDs** | 0 | 0 | 0 |
| **Smoke Tests Passing** | 12 / 12 | 12 / 12 | 100% pass |

---

## 5. Validation Results

The full pipeline and validation suite were executed:
- `npm run data:all`: Completed with 0 errors across all 9 stages.
- `validateFinalDataset()`: Schema Valid = YES, Schema Errors = 0, ID Errors = 0, Broken Relations = 0.
- `runSmokeTests()`: All 12/12 automated integration tests passed.

---

READY_FOR_FREEZE_CHECK
