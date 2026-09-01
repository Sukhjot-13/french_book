# Sol Final Focused Recheck

## 1. Exercise Boundary Result

**FAIL.** The long spill was reduced, and there is no character-count truncation: prompt counts over 250 / 500 / 1,000 characters are `0 / 0 / 0` (maximum 131), and `extract-chapter.ts` uses exercise headers plus lesson-transition tests rather than a length limit. Exercise 4.2 question 10 is now exactly `Elle travaille au centre-ville.`; it links only `expr_aller_inf`, and `expr_venir_de_inf` has no 4.2 relation or attestation. That repair is correct.

However, the new structural test mistakes running page headings for lesson boundaries and stops multi-page exercises early. The final dataset has only 1,804 questions against 1,872 distinct source answer slots. Fifteen exercises lose 68 legitimate questions: 1.2 (5), 1.5 (6), 2.3 (2), 5.5 (3), 7.1 (3), 8.5 (5), 10.6 (8), 11.8 (8), 13.7 (3), 14.1 (4), 14.7 (2), 16.1 (3), 19.2 (2), 20.1 (7), and 22.3 (7). Targeted PDF checks confirm the loss across the book: 1.2 continues with questions 6-10 on printed page 4, 14.1 continues with 7-10 on page 117, and 22.3 continues with 4-10 on page 187.

Short spill also remains: three prompts contain the copyright footer, twelve contain a chapter title/page marker, and 27.4 question 10 ends in `Pot pourri 235`. Thus `0 / 0 / 0` reflects premature structural stopping, not complete prompt extraction.

## 2. 1804 Answer-Count Explanation

**FAIL.** The source answer key contains 197 exercise codes and 1,872 distinct, sequential answer identities: 177 exercises x 10 answers + 19 x 5 + 1 x 7. All slots have explicit answers, so no source exercise is open-ended. There are no duplicate answer identities, question IDs, within-exercise numbers, or exact prompt+answer pairs.

The change from `1,779 / 1,799` to `1,804 / 1,804` is not discovery of a 1,804-slot source total. Relative to the prior artifact, 20 previously unanswered retained questions gained answers, while boundary changes added 44 question IDs and removed 39, for a net +5 questions and +25 answered questions. Numeric/year answers such as 2002, 2004, 2005, 1885, 1902, 1995, and the number-only 26.3 answers are now captured legitimately, but 2.3 question 6 is captured as `Elle saisit Copyright ...`, so answer cleanup is incomplete.

`check-coverage.ts` defines both the exercise denominator and numerator from final-output questions and merely asks whether each output question has an answer. It never compares against the 1,872 source slots. The reported `1,804 / 1,804` is therefore circular, and exercise/question identity is materially incomplete.

## 3. Provenance Result

**PARTIAL.** A raw-page header scan found all 197 exercise headers, and all 197 final exercise attestations match their actual printed/PDF header pages; chapter-opening pages are no longer assigned globally. Early and late answer-key samples also match the source pages.

Four answer-key exercises span two pages (2.3, 8.7, 14.1, 22.1). `attach-answer-key.ts` overwrites the exercise-level source for every matched item, so these records retain only the last item's page rather than the exercise header/complete page set (for example, 14.1 stores printed 267 although its header and answers 1-5 are on 266). Answer provenance is populated but not fully faithful for multi-page entries.

## 4. Five Expression Decisions Verification

**PASS, within the available question set.** Each approved item exists exactly once. `savoir + infinitif`, `vouloir + infinitif`, `pouvoir + infinitif`, and `devoir + infinitif` are productive `verb_pattern` records with `[INFINITIVE]` patterns and correct base-verb/reverse links. `prendre des vacances` is a strong collocation linked to `verb_prendre` and `vocab_vacances`, including vocabulary and verb reverse links. Their attestations have distinct source anchors and their question forward links resolve. Two isolated rebuilds reproduce them without duplication.

`prendre une décision` also remains exactly once as a strong collocation, linked to `verb_prendre` and `vocab_decision`, with eight distinct attestations and consistent verb, vocabulary, exercise, and question links. Some total evidence is necessarily incomplete because 68 source questions are absent.

## 5. Vocabulary POS Result

**FAIL.** The reported distribution is reproduced: 403 verbs, 447 nouns, 19 adjectives, 10 adverbs, 7 prepositions, 4 determiners, 4 conjunctions, and 124 `other`. `beau` is correctly an adjective with `bel` and `belle`; all English glosses beginning with `to ...` map to verbs; sampled nouns use source gender; and most non-nouns have no noun payload.

The distribution is nevertheless not acceptance-grade. `vocab_elire` is a verb that still carries a masculine noun payload. Adjective suffix variants are corrupted (`actuel` -> `le`, `blanc` -> `he`, `gentil` -> `le`). The `other` sample shows systematic misclassification and segmentation artifacts, including `acteur, actrice` and `amer, amère` as `other`, plus entities such as `to have a cold avoir un rhume`, `time de temps en temps`, and `you merci`. The source-driven heuristics removed the blanket noun default but did not produce reliable POS/variant parsing.

## 6. Garbage Regression Result

**PARTIAL/FAIL.** The exact entities `French-English`, `English-French glossary`, `amer, amère bitter`, `off rir`, and `verb_whoever_you_are` are absent. The underlying code now rejects glossary headers, repairs split infinitives, and restricts verb auto-registration to a single French infinitive shape, so those exact artifacts should not regenerate.

Broader parser garbage still regenerates in vocabulary and exercises, including the malformed `other` records above, copyright text in prompts/one answer, and running headings appended to prompts. The semantic-garbage validator checks only narrow vocabulary/verb patterns and does not detect these current artifacts.

## 7. Conjugation Provenance Result

**PASS for the requested provenance repair; semantic table parsing remains defective.** `conj_parler_present_indicative` and `conj_repeter_present_indicative` now have `origin.source_type: book`. All 392 generated paradigms remain `derived_from_book` and have derivation IDs. All printed-book attestations have book origins. Every page-239 attestation is confined to `verb_table`; no false unrelated page-239 attestations were found.

The page-239 table rows themselves are parsed incorrectly: the source has an infinitive, past participle, then six present forms, but `parseVerbTables()` treats the past participle as `je` and shifts the paradigm (for example, `savoir` records `je: su`). This directly undermines the verb-table coverage claim even though provenance labels are correct.

## 8. Coverage/Validator Integrity Result

**FAIL.** In-memory mutation tests show `passed: false` for one injected instance of each requested category: exercise boundary, missing answer provenance, vocabulary gap, conjugation provenance mismatch, semantic garbage, duplicate canonical identity, and broken relation. Those gates are wired into `passed`.

They are not sufficient on real repaired data. The current validator passes despite the 68 missing questions, short prompt/header spill, malformed answer, non-noun noun payload, malformed `other` records, and shifted verb-table forms.

- `1,804 / 1,804` is output-derived and circular; the independently source-derived exercise-slot denominator is 1,872.
- `1,941 / 1,941` is the length of the two parser outputs (963 + 978), not a validated source-entry reconciliation. The parsed lists contain duplicate identities and malformed fragments that count as covered whenever their generated ID exists, so 1,941 is not independently justified as clean glossary coverage.
- The source really contains 98 printed verb-table rows (15 + 21 + 18 + 44 across pages 236-239), but the parser collapses them to 68 unique verb+tense identities, including 30 duplicate/mislabeled rows, and coverage checks ID existence rather than tense/form equality. `98 / 98` therefore does not establish verb-table fidelity.

## 9. Idempotence Result

**PASS.** Two full isolated rebuilds completed successfully. After removing only `generated_at` and `updated_at`, both rebuilt datasets and the checked artifact have the same canonical SHA-256: `c3f88f5b5f5603f931c1681accc2609786fe1d00a61ef2f5ce7f46e9d416af65`. The failures above are deterministic rather than rebuild drift.

## 10. Final Verdict

The targeted `venir de` repair, expression decisions, header-page provenance, conjugation origin labels, validation wiring, and rebuild determinism improved as reported. The dataset cannot be frozen because 1,804 is not the source exercise total, 68 legitimate questions are missing, residual spill/answer garbage survives validation, multi-page answer provenance is lossy, vocabulary parsing remains systematically malformed, and glossary/verb coverage can report 100% without validating clean source identities and forms.

TARGETED_FIX_REQUIRED
