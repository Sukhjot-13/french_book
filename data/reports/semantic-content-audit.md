# Semantic and Content-Quality Audit Report

## Executive Summary
An independent semantic and content-quality audit was performed on the completed French grammar dataset (`data/final/french_grammar.json`) against the primary source material (`docs/source_book.pdf` - *Practice Makes Perfect: Complete French Grammar*), the dataset specification (`docs/french_revision_super_dataset_spec.txt`), and existing validation reports. Despite the existing pipeline reporting 100% completion with zero schema errors and passing smoke tests, this audit reveals **severe under-extraction** of linguistic content across almost all entities. 

The dataset captures the high-level structural framework (chapters, sections) and a fraction of the vocabulary, but it fails to capture the vast majority of the actual French language chunks, verb conjugations, and examples present in the 286-page PDF. 

## Final Verdict
**NEEDS_ENRICHMENT**

## Audit Method
The audit was conducted by:
1. Extracting overall entity counts from the `data/final/french_grammar.json` using `jq`.
2. Reviewing the provided dataset specification (`docs/french_revision_super_dataset_spec.txt`) to understand the required data model, particularly the goal of a global, graph-like linked dataset capturing reusable language chunks.
3. Visually inspecting and sampling the `docs/source_book.pdf` file to compare its actual density of examples, expressions, and conjugations against the extracted counts.
4. Analyzing the types of items extracted versus the specific categories of reusable language chunks mandated by the spec (e.g., collocations, verb patterns, sentence starters).

## Dataset Counts Reviewed
The current dataset reports the following counts (as per `extraction-summary.json` and direct `jq` queries):
- Total Chapters: 27
- Total Sections: 80
- Total Grammar Rules: 93
- Total Tenses: 16
- Total Concepts: 14
- Total Verbs: 297
- Total Vocabulary: 911
- Total Exercises: 197
- **Total Conjugations: 75**
- **Total Expressions: 32**
- **Total Examples: 90**

## Chapter Coverage Findings
While 27 chapters and 80 sections are present (which matches the high-level TOC of the book), the underlying content *within* those chapters has not been exhaustively mapped to the global collections. The structural scaffolding exists, but the linguistic substance is largely missing.

## Grammar Findings
93 grammar rules and 14 concepts have been extracted. While this provides a reasonable high-level overview of the grammar topics, the fine-grained linguistic rules, especially those tied to specific prepositional usages (e.g., verbs taking *à* vs. *de*, as found in Chapter 14), are not fully represented as distinct, reusable patterns.

## Verb Findings
297 verbs is a decent starting point, but a comprehensive grammar book like this contains far more verbs when accounting for pronominal verbs, irregular verbs (Chapters 4, 16), and verbs used in examples/vocabulary lists. The extraction appears to have grabbed the most prominent verbs but missed secondary verbs introduced in exercises and glossaries.

## Conjugation Findings
**Severity: CRITICAL**
The dataset contains only **75 conjugations**. This is an absurdly low number for a 286-page grammar book that dedicates entire chapters to verb paradigms across multiple tenses (Present, Passé Composé, Imparfait, Futur Simple, Subjonctif, etc.). A single verb like *être* or *avoir* has dozens of conjugations across tenses. The verb tables in the back matter (pages 236+) alone contain hundreds of conjugations. The current extraction has almost entirely missed the conjugation tables.

## Expression / Construction / Collocation Findings
**Severity: CRITICAL**
The dataset contains only **32 expressions**. This indicates a massive failure in semantic extraction. The specification explicitly demands the extraction of verb + preposition constructions, verb + infinitive constructions, collocations, idioms, and functional phrases. 
The PDF is densely packed with these. For example:
- Chapter 14 lists dozens of verbs followed by *à* (e.g., *s'amuser à*, *hésiter à*, *réussir à*) and verbs followed by *de* (e.g., *accepter de*, *avoir besoin de*, *se dépêcher de*).
- Crucial constructions like *prendre une décision*, *venir chercher quelqu'un*, *demander à quelqu'un de*, and *penser que* are systematically under-extracted. 
The current count of 32 represents less than 5% of the actual reusable expressions in the book.

## Vocabulary Findings
911 vocabulary items were extracted. While this seems substantial, the book contains extensive vocabulary boxes (Vocabulaire) in almost every chapter, plus a comprehensive French-English glossary at the back (pages 240-273). The true vocabulary count should likely be in the thousands.

## Example Sentence Findings
**Severity: CRITICAL**
The dataset contains only **90 example sentences**. A standard grammar book provides 5 to 10 examples *per page* to illustrate rules. With 286 pages, we should expect upwards of 1,000 to 2,000 example sentences. Examples demonstrating the Passé Composé vs. Imparfait, subjunctive triggers, and pronoun ordering are fundamental to the dataset's study quality but have been almost entirely ignored.

## Exercise / Answer-Key Findings
The dataset reports 197 exercises and 1799 questions. The extraction of the exercise structure seems relatively complete in terms of counts, but the linguistic material *inside* those exercises (vocabulary, collocations) has not been properly cross-linked or extracted into the global `expressions` or `vocabulary` collections as required by the spec.

## Back-Matter Findings
The back matter contains extensive verb tables (pages 236-239) and glossaries (pages 240-273). Based on the counts of conjugations (75) and vocabulary (911), it is highly probable that the back matter was either entirely skipped or only shallowly parsed.

## Provenance / Attestation Findings
For the limited items that do exist, the attestation schema appears valid. However, the true value of the dataset lies in comprehensive attestations. Because the core entities (expressions, examples) are missing, their corresponding attestations are also missing.

## Classification / Priority Findings
The specification mandates a Layer B (Editorial / Study Intelligence) including `learning_priority`, `usefulness`, and `difficulty`. While the schema supports this, the lack of actual linguistic chunks (expressions, collocations) means this editorial layer is currently useless.

## Missing or Under-Extracted Items
- **Verb + Preposition Patterns**: Almost entirely missing (e.g., *commencer à*, *décider de*).
- **Collocations**: Noun-adjective and verb-noun pairings (e.g., *prendre une décision*) are severely under-extracted.
- **Conjugation Paradigms**: The vast majority of verb forms across all tenses are missing.
- **Example Sentences**: Thousands of contextual examples are missing.
- **Glossary Terms**: Significant portions of the back-matter glossary are missing.

## Suspicious Counts
- **32 Expressions**: Inappropriately low. Should be hundreds.
- **75 Conjugations**: Inappropriately low. Should be hundreds/thousands.
- **90 Examples**: Inappropriately low. Should be thousands.

## Random Sample Results
A random sample of PDF Page 137 (Chapter 14: Verbs followed by the preposition *de*) reveals a list of over 40 distinct verbal expressions (e.g., *accepter de*, *accuser de*, *s'arrêter de*). Since the entire dataset only contains 32 expressions globally, it is mathematically certain that the pipeline failed to extract the contents of just this single page, let alone the rest of the book.

## Required Fixes
1. **Reparse for Expressions**: Implement a dedicated extraction pass focusing specifically on identifying and extracting verb + preposition constructions, collocations, idioms, and sentence starters from grammar explanations and vocabulary lists.
2. **Reparse for Examples**: Extract every italicized or bolded French example sentence used to illustrate grammar rules throughout the text.
3. **Reparse for Conjugations**: Parse the verb tables in the chapters and the back matter to build a complete conjugation mapping for all introduced verbs.
4. **Glossary Extraction**: Ensure the French-English back-matter glossary is fully parsed into the vocabulary collection.

## Recommended Improvements
- Modify the parsing prompt/logic to not just look for explicit "Vocabulaire" boxes, but to semantically identify reusable linguistic chunks embedded within the instructional prose.
- Cross-reference the exercise answer keys to extract "correct" sentences as additional high-quality examples.

## Final Acceptance Checklist
- [ ] Expressions count exceeds 500+ (capturing all prepositional patterns and collocations).
- [ ] Examples count exceeds 1500+ (capturing all illustrative sentences).
- [ ] Conjugations count reflects complete paradigms for all major irregular and regular verbs taught.
- [ ] Back-matter verb tables and glossaries are fully ingested.
- [ ] All extracted items have accurate `attestations` linked back to the PDF page and context type.
