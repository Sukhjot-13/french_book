# Master Merge Summary

## Inputs

### SOURCE_RECORD_INVENTORY
Chapters: 27
Sections: 80
Glossary FR->EN: 948
Glossary EN->FR: 978
Verb Table Tables: 20
Verb Table Rows: 56
Answer Key Exercises: 197
Answer Key Answers: 1872

Total Source Records: 4178

### CANONICALIZATION_INPUT_INVENTORY
Concepts: 0 (SOURCE_CONFIRMED_ZERO)
Tenses: 0 (SOURCE_CONFIRMED_ZERO)
Grammar Rules: 93
Verbs: 119
Conjugations: 23
Expressions: 32
Vocabulary: 22
Examples: 90
Exercises: 197
Questions: 1872
Exceptions and Traps: 0 (SOURCE_CONFIRMED_ZERO)
Uncertain Candidates: 0
Glossary FR->EN Processed: 948
Glossary EN->FR Processed: 978
Verb Table Cells Processed: 104

Total Inputs Processed into Entities: 4478

### DISPOSITION_RECORD_COUNT
Total Processed Entities: 6634 (Includes Chapters, Sections, Answers, etc.)
MERGED_EXISTING: 2871
NEW_CANONICAL_ENTITY: 3746
ROUTED_TO_OTHER_ENTITY_TYPE: 0
UNCERTAIN: 0
CONFLICT: 0
REJECTED_MALFORMED: 17

## Final Canonical Entity Counts
chapters: 27
sections: 80
concepts: 12
tenses: 19
grammar_rules: 120
verbs: 451
conjugations: 108
expressions: 225
vocabulary: 575
examples: 97
exercises: 197
questions: 1872
answers: 1872
exceptions_and_traps: 0
study_sets: 0

## Glossary Integration
Glossary FR->EN rows: 948
Glossary EN->FR rows: 978
Total: 1926

ordinary vocabulary:
  merged: 470
  newly created canonical entities: 550
verbs:
  merged: 440
  newly created canonical entities: 272
expressions:
  merged: 69
  newly created canonical entities: 108
uncertain: 0
conflict: 0
rejected: 17

SOURCE ROW TOTAL: 1926

## Verb Table Integration
source tables: 20
source verb rows: 56
forms/conjugation cells: 104
conflicts: 0

### VERB TABLE SOURCE ROW TRACE
1. verb_regarder (Infinitive: regarder) - Processed\n2. verb_vendre (Infinitive: vendre) - Processed\n3. verb_partir (Infinitive: partir) - Processed\n4. verb_manger (Infinitive: manger) - Processed\n5. verb_commencer (Infinitive: commencer) - Processed\n6. verb_acheter (Infinitive: acheter) - Processed\n7. verb_appeler (Infinitive: appeler) - Processed\n8. verb_payer (Infinitive: payer) - Processed\n9. verb_préférer (Infinitive: préférer) - Processed\n10. verb_acquérir (Infinitive: acquérir) - Processed\n11. verb_aller (Infinitive: aller) - Processed\n12. verb_apprendre (Infinitive: apprendre) - Processed\n13. verb_(s')asseoir (Infinitive: (s')asseoir) - Processed\n14. verb_avoir (Infinitive: avoir) - Processed\n15. verb_battre (Infinitive: battre) - Processed\n16. verb_boire (Infinitive: boire) - Processed\n17. verb_comprendre (Infinitive: comprendre) - Processed\n18. verb_conclure (Infinitive: conclure) - Processed\n19. verb_conduire (Infinitive: conduire) - Processed\n20. verb_connaître (Infinitive: connaître) - Processed\n21. verb_courir (Infinitive: courir) - Processed\n22. verb_craindre (Infinitive: craindre) - Processed\n23. verb_croire (Infinitive: croire) - Processed\n24. verb_cueillir (Infinitive: cueillir) - Processed\n25. verb_devoir (Infinitive: devoir) - Processed\n26. verb_dire (Infinitive: dire) - Processed\n27. verb_dormir (Infinitive: dormir) - Processed\n28. verb_écrire (Infinitive: écrire) - Processed\n29. verb_envoyer (Infinitive: envoyer) - Processed\n30. verb_être (Infinitive: être) - Processed\n31. verb_faire (Infinitive: faire) - Processed\n32. verb_falloir (Infinitive: falloir) - Processed\n33. verb_fuir (Infinitive: fuir) - Processed\n34. verb_haïr (Infinitive: haïr) - Processed\n35. verb_lire (Infinitive: lire) - Processed\n36. verb_mettre (Infinitive: mettre) - Processed\n37. verb_mourir (Infinitive: mourir) - Processed\n38. verb_naître (Infinitive: naître) - Processed\n39. verb_offrir (Infinitive: offrir) - Processed\n40. verb_ouvrir (Infinitive: ouvrir) - Processed\n41. verb_peindre (Infinitive: peindre) - Processed\n42. verb_plaire (Infinitive: plaire) - Processed\n43. verb_pleuvoir (Infinitive: pleuvoir) - Processed\n44. verb_pouvoir (Infinitive: pouvoir) - Processed\n45. verb_prendre (Infinitive: prendre) - Processed\n46. verb_recevoir (Infinitive: recevoir) - Processed\n47. verb_résoudre (Infinitive: résoudre) - Processed\n48. verb_rire (Infinitive: rire) - Processed\n49. verb_savoir (Infinitive: savoir) - Processed\n50. verb_suivre (Infinitive: suivre) - Processed\n51. verb_tenir (Infinitive: tenir) - Processed\n52. verb_vaincre (Infinitive: vaincre) - Processed\n53. verb_venir (Infinitive: venir) - Processed\n54. verb_vivre (Infinitive: vivre) - Processed\n55. verb_voir (Infinitive: voir) - Processed\n56. verb_vouloir (Infinitive: vouloir) - Processed

## Answer-Key Integration
expected exercises: 197
expected answers: 1872
answers linked: 1872
duplicate answer identities: 0
orphan answers: 0
missing answer provenance: 0

## Relationship Rebuild
relationships examined: 3331
resolved: 3331
broken: 0

## Attestation & Provenance Accounting
incoming source attestations: 2799
unique final attestations: 2799
exact duplicate attestations collapsed: 0
rejected attestations: 0
unaccounted attestations: 0

Provenance breakdown:
{
  "book": 2795,
  "derived_from_book": 4
}

## Conflicts
\`\`\`json\n[
  {
    "entity_type": "vocabulary",
    "candidate_ids": [
      "vocab_voile",
      "vocab_voile_veil"
    ],
    "source_files": [
      "glossary-en-fr.json"
    ],
    "canonical_key": "vocab_voile",
    "field": "noun.gender",
    "values": [
      "feminine",
      "masculine"
    ],
    "reason": "Source-supported homograph/POS conflict preserved as separate lexical sense",
    "confidence": "high"
  },
  {
    "entity_type": "vocabulary",
    "candidate_ids": [
      "vocab_anniversaire",
      "vocab_anniversaire_birthday"
    ],
    "source_files": [
      "glossary-fr-en.json"
    ],
    "canonical_key": "vocab_anniversaire",
    "field": "noun.gender",
    "values": [
      "feminine",
      "masculine"
    ],
    "reason": "Source-supported homograph/POS conflict preserved as separate lexical sense",
    "confidence": "high"
  },
  {
    "entity_type": "vocabulary",
    "candidate_ids": [
      "vocab_meurtrier",
      "vocab_meurtrier_murderer"
    ],
    "source_files": [
      "glossary-fr-en.json"
    ],
    "canonical_key": "vocab_meurtrier",
    "field": "noun.gender",
    "values": [
      "masculine",
      "common"
    ],
    "reason": "Source-supported homograph/POS conflict preserved as separate lexical sense",
    "confidence": "high"
  },
  {
    "entity_type": "vocabulary",
    "candidate_ids": [
      "vocab_patron",
      "vocab_patron_boss"
    ],
    "source_files": [
      "glossary-fr-en.json"
    ],
    "canonical_key": "vocab_patron",
    "field": "noun.gender",
    "values": [
      "masculine",
      "common"
    ],
    "reason": "Source-supported homograph/POS conflict preserved as separate lexical sense",
    "confidence": "high"
  },
  {
    "entity_type": "vocabulary",
    "candidate_ids": [
      "vocab_veuf",
      "vocab_veuf_widower"
    ],
    "source_files": [
      "glossary-fr-en.json"
    ],
    "canonical_key": "vocab_veuf",
    "field": "noun.gender",
    "values": [
      "masculine",
      "common"
    ],
    "reason": "Source-supported homograph/POS conflict preserved as separate lexical sense",
    "confidence": "high"
  }
]\n\`\`\`

## Duplicate Audit
canonical duplicate IDs: 0
canonical verb duplicates: 0
expression duplicates: 0
vocabulary duplicates: 0
conjugation duplicates: 0
exercise duplicates: 0
question duplicates: 0
answer duplicates: 0
normalization collisions: 0
near-duplicate candidates: 0
