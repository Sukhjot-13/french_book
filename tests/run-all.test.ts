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
  getChapters,
  getChapterById,
  getExercises,
  getExceptionsAndTraps,
  getConcepts,
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
import { searchDataset } from "../src/lib/data/search";

// 4. Validate Search Functionality
const searchMatches = searchDataset(loadedData, "etre");
assert(searchMatches.length > 0, "Search for 'etre' should return results");
assert(searchMatches.some((m) => m.type === "verb"), "Search for 'etre' should find the verb être");
console.log(`✅ Search searchDataset('etre') verified with ${searchMatches.length} results.`);

console.log("\n🎉 All tests passed successfully!");



