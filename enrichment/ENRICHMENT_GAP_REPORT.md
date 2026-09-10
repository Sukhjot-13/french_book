# Master Dataset Enrichment Gap Report

Generated 2026-09-10 from `data/MASTER_DATA.json` against
`data/MASTER_SCHEMA.json`. This is an inventory for the next enrichment run;
it does not modify the master dataset or treat every empty array as an error.
Many relationship arrays are deliberately empty when no reliable link is known.

## Dataset snapshot

| Collection | Records |
| --- | ---: |
| Chapters | 27 |
| Topics | 0 |
| Concepts | 206 |
| Grammar rules | 284 |
| Tenses | 24 |
| Verbs | 496 |
| Expressions | 557 |
| Vocabulary | 1,002 |
| Examples | 1,011 |
| Exercises | 217 |
| Exceptions and traps | 108 |
| Explicitly unresolved source items | 13 |

## Highest-priority content gaps

1. **Topics:** the schema has a `topics` collection, but it currently has no
   records. A future queue should establish whether topics are a required
   learning layer and, if so, add source-supported records and chapter links.
2. **Verb paradigms:** every verb has exactly seven stored conjugation records:
   `présent`, `imparfait`, `futur_simple`, `passé_simple`,
   `conditionnel_présent`, `subjonctif_présent`, and `impératif`. Per-verb
   paradigms are not stored for the other named tense records, including
   `passé composé`, `plus-que-parfait`, `futur antérieur`, `passé antérieur`,
   `conditionnel passé`, `subjonctif passé`, `subjonctif imparfait`, and
   `subjonctif plus-que-parfait`, nor for the passive forms and
   `participe présent`. Adding any of these requires a versioned conjugation
   contract before generation, not an ad-hoc fill.
3. **Conjugation provenance and explanatory data:** the 3,472 stored verb
   conjugation records have no nested `sources`; 1,691 have no formation note,
   2,939 have no irregularity note, and 2,779 have no general note. Empty
   `stems` (1,020) and `endings` (1,074) must be interpreted by verb/tense
   type before filling: they can be inapplicable for an irregular or compound
   form. The imperative intentionally lacks non-imperative person slots, and
   the other six records intentionally lack imperative slots, so those blanks
   are not missing conjugations.
4. **Source uncertainties:** 13 candidates are explicitly held back rather
   than silently added. They need source review before they become content.

## Explicitly unresolved source items

- Expressions: `aimer + infinitive`, `menacer de + infinitive`,
  `s'appeler + name`, `piquer une crise`, `venir + infinitif`,
  `faire un compliment`, `faire un tour`, `avoir lieu`, `ignorer où`,
  `en Afrique`, and `il y a [distance] d'ici à [lieu]`.
- Vocabulary: `autochtone` and `inconnu` need part-of-speech confirmation.

## Field-completeness inventory

The counts below are records where a schema-defined field is empty (`null`, an
empty string, an empty array, or an empty object). A required field can still
legitimately be empty under the current schema, so each proposed fill needs
source evidence and a field-specific applicability rule.

| Collection | Fields with the most material empty-value backlog |
| --- | --- |
| Chapters (27) | `topics` 27; `sources` 27; `notes` 27; `tenses` 10; `verbs` 2; `expressions` 1. |
| Concepts (206) | Relationship coverage is absent for all records in `related_grammar_rules`, `related_verbs`, `related_expressions`, `related_vocabulary`, and `related_tenses`; `notes` 206; `tags` 151; `aliases` 75; `sources` 5. |
| Grammar rules (284) | `notes` 284; `contrast_with` 284; `affirmative_form` 252; `interrogative_form` 233; `negative_form` 211; `related_expressions` 195; `tags` 189; `signal_words` 166; `related_verbs` 127; `related_tenses` 116; `common_traps` 77; `usage` 14; `explanation` 2. |
| Tenses (24) | `notes`, `common_traps`, `negative_form`, `interrogative_form`, `affirmative_form`, `related_tenses`, and `related_grammar_rules` are empty for all 24; `sources` 24; `chapters` 6. |
| Verbs (496) | `source_classifications` 496; `synonyms` 496; `antonyms` 496; `register` 491; `tags` 490; `notes` 448; `aliases` 429; `related_expressions` 351; `usage_notes` 243; `related_concepts` 181; `senses` 68; `chapters` 50; `search_terms` 31. |
| Expressions (557) | `synonyms` and `antonyms` 557; `notes` 555; `tags` 551; `register` 539; `related_vocabulary` 427; `aliases` 412; `usage_notes` 348; `related_grammar_rules` 271; `related_verbs` 232; `related_concepts` 120; `search_terms` 43; `productive` and `chapters` 31; `collocation_strength` 21. |
| Vocabulary (1,002) | `notes` 986; `source_classifications` 987; `antonyms` 984; `related_verbs` 973; `synonyms` 947; `aliases` 931; `related_expressions` 879; `variants` 855; `register` 835; `word_family` 833; `tags` 810; `usage_notes` 619; `related_concepts` 466; `chapters` 216; `search_terms` 142. |
| Examples (1,011) | `notes` 839; `related_vocabulary` 799; `related_expressions` 595; `related_tenses` 357; `tags` 316; `focus_spans` 224; `related_verbs` 123; `related_grammar_rules` 48; `related_concepts` 18; `english` 3. |
| Exercises (217) | `section_title` 217; `notes` 172; `title` 152; `related_vocabulary` 105; `related_expressions` 99; `related_tenses` 90; `related_verbs` 76; `related_grammar_rules` 37; `exercise_type`, `instructions`, `related_concepts`, and `sources` 31 each. |
| Exceptions and traps (108) | `notes` 108; `related_expressions` 69; `related_verbs` 56; `related_examples` 37; `related_grammar_rules` 9. |
| Unresolved items (13) | `notes` 13; `possible_values` 12. These are review work, not AI-fill targets. |
| Source-quality metadata (4) | Several fields are empty because each record describes a different source direction/type. Treat these as extraction-audit metadata, not ordinary enrichment content. |

## Recommended restart order

1. Resolve the 13 explicit uncertainties and decide the intended `topics`
   scope from the original sources.
2. Enrich source/provenance fields and learner-facing missing translations,
   titles, instructions, and explanations before broad relationship tagging.
3. Create separate small, source-bound batches for each collection/field.
   Relationship fields must only use natural keys that already exist.
4. Treat conjugations, grammar classifications, exercise answers, and other
   linguistic facts as high-risk: use the extra controls in
   `ENRICHMENT_INSTRUCTIONS.md`, named review, and a derived output only.
5. Do not fill synonyms, antonyms, relationship arrays, notes, or source
   classifications merely to reduce counts. Empty remains correct when the
   source provides no support.
