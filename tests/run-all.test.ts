import fs from "fs";
import path from "path";
import assert from "assert";

console.log("🚀 Running complete test suite for French Revision Platform...\n");

// 1. Validate Master Data Availability (Read-Only)
const dataPath = path.resolve(process.cwd(), "data/MASTER_DATA.json");
assert(fs.existsSync(dataPath), "data/MASTER_DATA.json must exist");

const rawData = JSON.parse(fs.readFileSync(dataPath, "utf-8"));
assert.strictEqual(rawData.schema_version, "1.0.0", "Schema version must be 1.0.0");
assert(Array.isArray(rawData.chapters), "chapters must be an array");
assert(rawData.chapters.length >= 27, "chapters count must be at least 27");
assert(Array.isArray(rawData.verbs), "verbs must be an array");
assert(rawData.verbs.length >= 400, "verbs count must be at least 400");
assert(Array.isArray(rawData.grammar_rules), "grammar_rules must be an array");
assert(rawData.grammar_rules.length >= 200, "grammar_rules count must be at least 200");
assert(Array.isArray(rawData.tenses), "tenses must be an array");
assert(rawData.tenses.length >= 20, "tenses count must be at least 20");
assert(Array.isArray(rawData.expressions), "expressions must be an array");
assert(rawData.expressions.length >= 500, "expressions count must be at least 500");
assert(Array.isArray(rawData.vocabulary), "vocabulary must be an array");
assert(rawData.vocabulary.length >= 1000, "vocabulary count must be at least 1000");
assert(Array.isArray(rawData.examples), "examples must be an array");
assert(rawData.examples.length >= 1000, "examples count must be at least 1000");
assert(Array.isArray(rawData.exercises), "exercises must be an array");
assert(rawData.exercises.length >= 200, "exercises count must be at least 200");
assert(Array.isArray(rawData.exceptions_and_traps), "exceptions_and_traps must be an array");
assert(rawData.exceptions_and_traps.length >= 100, "exceptions_and_traps count must be at least 100");

console.log("✅ Master data integrity and counts verified:");
console.log(`   - Chapters: ${rawData.chapters.length}`);
console.log(`   - Verbs: ${rawData.verbs.length}`);
console.log(`   - Grammar Rules: ${rawData.grammar_rules.length}`);
console.log(`   - Tenses: ${rawData.tenses.length}`);
console.log(`   - Expressions: ${rawData.expressions.length}`);
console.log(`   - Vocabulary: ${rawData.vocabulary.length}`);
console.log(`   - Examples: ${rawData.examples.length}`);
console.log(`   - Exercises: ${rawData.exercises.length}`);
console.log(`   - Exceptions & Traps: ${rawData.exceptions_and_traps.length}`);
console.log(`   - Concepts: ${rawData.concepts.length}`);

import { getMasterDataset } from "../src/lib/data/loader";

// 2. Validate Loader Functionality
const loadedData = getMasterDataset();
assert.strictEqual(loadedData.schema_version, "1.0.0", "Loader must return valid dataset");
assert.strictEqual(loadedData.verbs.length, rawData.verbs.length, "Loader must load all verbs");
import {
  getHomeStats,
  getVerbs,
  getVerbById,
  getTenses,
  getTenseById,
  getGrammarRules,
  getGrammarRuleById,
  getExpressions,
  getVocabulary,
  getVocabularyById,
  getChapters,
  getChapterById,
  getExercises,
  getExceptionsAndTraps,
  getConcepts,
  getConceptById,
  getExamples,
} from "../src/lib/data/selectors";

// 3. Validate Selectors Functionality
const stats = getHomeStats();
assert.strictEqual(stats.totalVerbs, 496, "HomeStats must show 496 verbs");
assert.strictEqual(stats.totalChapters, 27, "HomeStats must show 27 chapters");
assert.strictEqual(stats.totalRules, 284, "HomeStats must show 284 rules");
assert.strictEqual(stats.totalTenses, 24, "HomeStats must show 24 tenses");
assert.strictEqual(stats.totalExpressions, 557, "HomeStats must show 557 expressions");
assert.strictEqual(stats.totalVocabulary, 1002, "HomeStats must show 1002 vocabulary");
assert.strictEqual(stats.totalExercises, 217, "HomeStats must show 217 exercises");
assert.strictEqual(stats.totalTraps, 108, "HomeStats must show 108 traps");
assert.strictEqual(stats.totalConcepts, 206, "HomeStats must show 206 concepts");
console.log("✅ Selector getHomeStats() verified with exact master counts.");

// Verbs selector
const verbList = getVerbs();
assert.strictEqual(verbList.total, 496, "getVerbs() must return all 496 verbs");
const firstVerb = verbList.verbs[0];
assert(firstVerb.id, "Verb must have an id");
assert(firstVerb.lemma, "Verb must have a lemma");

// Verb detail with conjugations
const verbDetail = getVerbById(firstVerb.lemma);
assert(verbDetail !== null, `Verb detail must be found for ${firstVerb.lemma}`);
console.log(`✅ Selector getVerbById('${firstVerb.lemma}') verified with ${verbDetail.conjugations.length} conjugations.`);

// Tenses selector
const tenseList = getTenses();
assert.strictEqual(tenseList.length, 24, "getTenses() must return 24 tenses");
const tenseDetail = getTenseById(tenseList[0].name_fr);
assert(tenseDetail !== null, `Tense detail must be found for ${tenseList[0].name_fr}`);
console.log(`✅ Selector getTenseById('${tenseList[0].name_fr}') verified.`);

// Grammar rules selector
const ruleList = getGrammarRules();
assert.strictEqual(ruleList.total, 284, "getGrammarRules() must return 284 rules");
const ruleDetail = getGrammarRuleById(ruleList.rules[0].title);
assert(ruleDetail !== null, `Rule detail must be found for ${ruleList.rules[0].title}`);
console.log(`✅ Selector getGrammarRuleById('${ruleList.rules[0].title}') verified.`);

// Chapters selector
const chapterList = getChapters();
assert.strictEqual(chapterList.length, 27, "getChapters() must return 27 chapters");
const chapterDetail = getChapterById("1");
assert(chapterDetail !== null, "Chapter detail for chapter 1 must exist");
console.log(`✅ Selector getChapterById('1') verified with ${chapterDetail.sections.length} sections, ${chapterDetail.grammarRules.length} rules, ${chapterDetail.exercises.length} exercises.`);

// Exercises & Traps selectors
const exercises = getExercises();
assert.strictEqual(exercises.total, 217, "getExercises() must return 217 exercises");
const traps = getExceptionsAndTraps();
assert.strictEqual(traps.total, 108, "getExceptionsAndTraps() must return 108 traps");
const concepts = getConcepts();
assert.strictEqual(concepts.length, 206, "getConcepts() must return 206 concepts");
import { searchDataset, normalizeFrenchText } from "../src/lib/data/search";

// 4. Validate Search Functionality
const searchMatches = searchDataset(loadedData, "etre");
assert(searchMatches.length > 0, "Search for 'etre' should return results");
assert(searchMatches.some((m) => m.type === "verb"), "Search for 'etre' should find the verb être");
console.log(`✅ Search searchDataset('etre') verified with ${searchMatches.length} results.`);

// 5. Validate Vocabulary Alphabetical Sorting and A-Z Filtering
const vocabA = getVocabulary({ letter: "A" });
assert(vocabA.total > 0, "Vocabulary starting with 'A' should return items");
assert(
  vocabA.vocabulary.every((v) => normalizeFrenchText(v.french).startsWith("a")),
  "All items returned under letter A must normalize to starting with a (handling A, À, Â, etc.)"
);
console.log(`✅ Selector getVocabulary({ letter: 'A' }) verified with ${vocabA.total} items.`);

// 6. Validate Expressions Preposition and Base Verb Filtering
const prepAExpressions = getExpressions({ preposition: "à" });
assert(prepAExpressions.total > 0, "Expressions with preposition 'à' should return items");
assert(
  prepAExpressions.expressions.every((e) => e.french.toLowerCase().includes("à") || e.pattern?.toLowerCase().includes("à")),
  "Expressions filtered by 'à' must contain 'à'"
);
console.log(`✅ Selector getExpressions({ preposition: 'à' }) verified with ${prepAExpressions.total} expressions.`);

const avoirExpressions = getExpressions({ baseVerb: "avoir" });
assert(avoirExpressions.total > 0, "Expressions based on 'avoir' must return items");
console.log(`✅ Selector getExpressions({ baseVerb: 'avoir' }) verified with ${avoirExpressions.total} expressions.`);

// 7. Validate ID Uniqueness Across Rules & Exercises (including Chapter 1)
const allRuleIds = ruleList.rules.map((r) => r.id);
const uniqueRuleIds = new Set(allRuleIds);
assert.strictEqual(
  uniqueRuleIds.size,
  allRuleIds.length,
  `All ${allRuleIds.length} grammar rules must have unique IDs (found ${allRuleIds.length - uniqueRuleIds.size} duplicates)`
);
console.log(`✅ Grammar rule IDs verified 100% unique across all ${allRuleIds.length} rules.`);

const ch1RuleIds = chapterDetail.grammarRules.map((r) => r.id);
const uniqueCh1RuleIds = new Set(ch1RuleIds);
assert.strictEqual(
  uniqueCh1RuleIds.size,
  ch1RuleIds.length,
  `Chapter 1 must have unique grammar rule IDs (found duplicates: ${ch1RuleIds.filter((id, i) => ch1RuleIds.indexOf(id) !== i).join(", ")})`
);
console.log(`✅ Chapter 1 grammar rule IDs verified unique without collisions.`);

const allExIds = exercises.exercises.map((e) => e.id);
const uniqueExIds = new Set(allExIds);
assert.strictEqual(
  uniqueExIds.size,
  allExIds.length,
  `All ${allExIds.length} exercises must have unique IDs (found ${allExIds.length - uniqueExIds.size} duplicates)`
);
console.log(`✅ Exercise IDs verified 100% unique across all ${allExIds.length} exercises.`);

// 8. Validate URL-encoded ID resolution in selectors (e.g. grammar rules with spaces)
const encodedRuleName = "Present%20tense%20for%20historical%20facts";
const resolvedEncodedRule = getGrammarRuleById(encodedRuleName);
assert(resolvedEncodedRule !== null, `getGrammarRuleById('${encodedRuleName}') must resolve successfully`);
assert.strictEqual(
  resolvedEncodedRule.rule.title,
  "Present tense for historical facts",
  "Resolved rule title must match"
);
console.log(`✅ URL-encoded ID lookup verified for getGrammarRuleById('${encodedRuleName}').`);

// 9. Validate that all vocabulary items map article as string or null (never object)
const allVocab = getVocabulary({ limit: 2000 });
for (const v of allVocab.vocabulary) {
  assert(
    v.article === null || typeof v.article === "string",
    `Vocabulary article for '${v.french}' must be string or null, but found ${typeof v.article}`
  );
}
console.log(`✅ All ${allVocab.total} vocabulary items verified to have string or null article field.`);

// 10. Validate getConceptById resolution and relationships
const allConcepts = getConcepts();
assert(allConcepts.length >= 200, "Must have at least 200 concepts");
const firstConcept = allConcepts[0];
const conceptDetail = getConceptById(firstConcept.name);
assert(conceptDetail !== null, `getConceptById('${firstConcept.name}') must return concept detail`);
assert.strictEqual(conceptDetail.concept.name, firstConcept.name, "Concept name must match");
console.log(`✅ Selector getConceptById('${firstConcept.name}') verified.`);

// 11. Validate enhanced getExamples filters (verb, tense, grammarRule, translation)
const verbExamples = getExamples({ verb: "être", limit: 10 });
assert(verbExamples.examples.length > 0, "getExamples({ verb: 'être' }) should return examples");
const tenseExamples = getExamples({ tense: "présent", limit: 10 });
assert(tenseExamples.examples.length > 0, "getExamples({ tense: 'présent' }) should return examples");
const transExamples = getExamples({ hasTranslation: true, limit: 10 });
assert(transExamples.examples.length > 0, "getExamples({ hasTranslation: true }) should return examples");
console.log(`✅ Enhanced getExamples() filters (verb, tense, hasTranslation) verified.`);

// 12. Validate getVocabularyById relatedVerbs and relatedChapters
const testVocab = getVocabularyById("maison") || getVocabularyById("temps");
assert(testVocab !== null, "Vocabulary detail must resolve for common word");
assert(Array.isArray(testVocab.relatedVerbs), "relatedVerbs must be an array");
assert(Array.isArray(testVocab.relatedChapters), "relatedChapters must be an array");
console.log(`✅ Selector getVocabularyById('${testVocab.vocab.french}') graph verified.`);

console.log("\n🎉 All tests passed successfully!");




