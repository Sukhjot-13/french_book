import fs from "fs";
import path from "path";
import assert from "assert";
import {
  isItemSaved,
  toggleItemSaved,
  isItemReviewed,
  toggleItemReviewed,
  getReviewStateSnapshot,
  subscribeReviewState,
} from "../src/lib/data/reviewStore";
import {
  nextInterval,
  getDueCards,
  getSrsStats,
  parseSrsState,
  sanitizeRecords,
  selectDueCards,
  selectSrsStats,
  SRS_SCHEMA_VERSION,
} from "../src/lib/data/srs";
import { parsePageParam, paginate, MAX_PAGE_PARAM } from "../src/lib/pagination";
import {
  getAllVerbIds,
  getAllTenseIds,
  getAllGrammarIds,
  getAllExpressionIds,
  getAllChapterIds,
  getAllConceptIds,
  getAllVocabularyIds,
} from "../src/lib/data/staticParams";
import {
  stableStringify,
  sha256Hex,
  readEvidence,
  verifyRepairAudit,
  buildRepairAudit,
} from "../src/lib/dataset/repair-audit";
import { runManagerIntegrationTests } from "./manager-integration.test";

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
  formatComplementStructure,
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

// Verb English meaning formatting and comma separation
import { formatEnglishList } from "../src/lib/data/selectors";
assert.strictEqual(formatEnglishList(["accept", "to accept"], true), "to accept");
assert.strictEqual(formatEnglishList(["like", "love", "to like", "to love"], true), "to like, to love");
const aimerDetail = getVerbById("aimer");
assert.strictEqual(aimerDetail?.verb.english, "to like, to love", "aimer english must be properly joined with comma and space");
const accepterDetail = getVerbById("accepter");
assert.strictEqual(accepterDetail?.verb.english, "to accept", "accepter english must be properly deduplicated");
console.log("✅ Verb English translations verified with comma-space formatting and intelligent deduplication.");

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
  prepAExpressions.expressions.every(
    (e) =>
      e.prepositions.some((preposition) => preposition.toLowerCase() === "à") ||
      e.french.toLowerCase().includes("à") ||
      e.pattern?.toLowerCase().includes("à")
  ),
  "Expressions filtered by 'à' must declare or display 'à'"
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
const vocabIdSet = new Set(allVocab.vocabulary.map((v) => v.id));
assert.strictEqual(vocabIdSet.size, allVocab.vocabulary.length, "All vocabulary items must have 100% unique IDs");
console.log(`✅ All ${allVocab.total} vocabulary items verified to have 100% unique IDs without React key collisions.`);

// 10. Validate getConceptById resolution and relationships
const allConcepts = getConcepts();
assert(allConcepts.length >= 200, "Must have at least 200 concepts");
const conceptIdSet = new Set(allConcepts.map((c) => c.id));
assert.strictEqual(conceptIdSet.size, allConcepts.length, "All concepts must have 100% unique IDs");
console.log(`✅ All ${allConcepts.length} concepts verified to have 100% unique IDs without React key collisions.`);
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

// 13. Validate ReviewStore logic
assert.strictEqual(typeof isItemSaved, "function", "isItemSaved must be a function");
assert.strictEqual(typeof toggleItemSaved, "function", "toggleItemSaved must be a function");
assert.strictEqual(typeof isItemReviewed, "function", "isItemReviewed must be a function");
assert.strictEqual(typeof toggleItemReviewed, "function", "toggleItemReviewed must be a function");
// Under SSR / Node test runner, safe defaults return false
assert.strictEqual(isItemSaved("verb", "prendre"), false, "SSR isItemSaved must return false safely");
assert.strictEqual(isItemReviewed("verb", "prendre"), false, "SSR isItemReviewed must return false safely");
console.log("✅ Review store helper and SSR safety verified.");

// 14. Validate SRS scheduler (pure logic — LocalStorage guarded under Node)
assert.strictEqual(nextInterval(0, true), 1, "first success schedules 1 day");
assert.strictEqual(nextInterval(1, true), 3, "1d success advances to 3d");
assert.strictEqual(nextInterval(60, true), 60, "max interval caps at 60d");
assert.strictEqual(nextInterval(7, false), 0, "miss resets to 0");
assert.strictEqual(nextInterval(999, true), 1, "unknown interval restarts ladder");
const srsCards = [
  { key: "a", front: "x", back: "y" },
  { key: "b", front: "x", back: "y" },
];
// No stored records under Node (guarded) → everything is due.
assert.strictEqual(getDueCards(srsCards).length, 2, "fresh cards are all due");
assert.deepStrictEqual(getSrsStats(srsCards), { total: 2, due: 2, learned: 0 }, "fresh stats");
console.log("✅ SRS scheduler progression and due-selection verified.");

// 15. Validate v2.2 repair audit mapping
const repairOriginal = {
  id: "verb_test",
  infinitive: "tester",
  sources: [{ ref: "p.12" }, { ref: "p.13" }],
  conjugations: ["malformed"],
};
const repairGood = {
  id: "verb_test",
  infinitive: "tester",
  conjugations: ["canonical"],
  audit: buildRepairAudit(repairOriginal, "2026-09-26T00:00:00.000Z"),
};
const repairCheck = verifyRepairAudit(repairOriginal, repairGood);
assert.strictEqual(repairCheck.ok, true, `compliant repair must verify (got: ${repairCheck.errors.join("; ")})`);
assert.strictEqual(repairCheck.originalSha256, sha256Hex(stableStringify(repairOriginal)), "hash binds the original");
// Tampered evidence fails.
const tampered = {
  ...repairGood,
  audit: { ...repairGood.audit, original_evidence: [{ ref: "p.12" }] },
};
assert.strictEqual(verifyRepairAudit(repairOriginal, tampered).ok, false, "dropped evidence must fail");
// Rebinding the hash fails.
const rebound = {
  ...repairGood,
  audit: { ...repairGood.audit, original_sha256: "0".repeat(64) },
};
assert.strictEqual(verifyRepairAudit(repairOriginal, rebound).ok, false, "wrong hash must fail");
// Key order must not affect the binding.
assert.strictEqual(
  stableStringify({ b: 1, a: [3, 2] }),
  stableStringify({ a: [3, 2], b: 1 }),
  "stable stringify is key-order independent (arrays stay ordered)"
);
// attestations fallback + audit chaining.
const withPriorAudit = { ...repairOriginal, audit: { policy: "old", x: 1 } };
const chained = { ...repairGood, audit: buildRepairAudit(withPriorAudit, "2026-09-26T00:00:00.000Z") };
assert.strictEqual(verifyRepairAudit(repairOriginal, chained).ok, true, "re-repairs chain (prior audit excluded)");
assert.deepStrictEqual(readEvidence({}), [], "no evidence sources reads empty");
console.log("✅ v2.2 repair audit mapping (hash binding + verbatim evidence) verified.");

// 16. Vocabulary id integrity: every table id must resolve to itself, and the
// article-stripping collision cases from the 2026-09-28 audit must be correct.
const fullVocab = getVocabulary({ limit: 5000 });
const misResolvingIds = fullVocab.vocabulary.filter((v) => {
  const resolved = getVocabularyById(v.id);
  return !resolved || resolved.vocab.id !== v.id;
});
assert.strictEqual(
  misResolvingIds.length,
  0,
  `every vocabulary id must resolve to itself (broken: ${misResolvingIds
    .slice(0, 5)
    .map((v) => v.id)
    .join(", ")})`
);
const dedupIdGroups = new Map<string, string[]>();
for (const v of fullVocab.vocabulary) {
  const base = v.id.replace(/_(ch\d+|\d+(_\d+)?)$/, "");
  const bucket = dedupIdGroups.get(base);
  if (bucket) bucket.push(v.id);
  else dedupIdGroups.set(base, [v.id]);
}
const collisions = [...dedupIdGroups.entries()].filter(([, ids]) => ids.length > 1);
for (const [base, ids] of collisions) {
  const resolvedForms = ids.map((id) => {
    const resolved = getVocabularyById(id);
    assert(resolved !== null, `deduped id ${id} (base ${base}) must resolve`);
    return resolved!.vocab.french;
  });
  assert.strictEqual(
    new Set(resolvedForms).size,
    ids.length,
    `every member of colliding base ${base} must resolve to its own record (${ids
      .map((id, i) => `${id}=${resolvedForms[i]}`)
      .join("|")})`
  );
}
for (const [probe, expected] of [
  ["ile", "île"],
  ["mer", "mer"],
  ["toile", "toile"],
  ["Toile", "Toile"],
  ["vacances", "vacances"],
] as const) {
  const resolved = getVocabularyById(probe);
  assert(resolved !== null, `getVocabularyById('${probe}') must resolve`);
  assert.strictEqual(
    resolved!.vocab.french,
    expected,
    `getVocabularyById('${probe}') must render '${expected}', got '${resolved!.vocab.french}'`
  );
}
const laToile = fullVocab.vocabulary.find((v) => v.french === "la Toile");
const toile = fullVocab.vocabulary.find((v) => v.french === "Toile");
assert(laToile && toile, "la Toile and Toile must both exist as separate records");
assert.notStrictEqual(laToile!.id, toile!.id, "la Toile and Toile must not collapse onto one id");
assert.strictEqual(getVocabularyById(laToile!.id)!.vocab.french, "la Toile");
assert.strictEqual(getVocabularyById(toile!.id)!.vocab.french, "Toile");
console.log(
  `✅ Vocabulary id integrity verified: all ${fullVocab.vocabulary.length} ids self-resolve, 0 collisions, article pairs kept distinct.`
);

// 17. Vocabulary relation flattening: no raw object may reach a text node.
const objectLeak = fullVocab.vocabulary.find(
  (v) =>
    v.word_family.some((x) => typeof x !== "string") ||
    v.synonyms.some((x) => typeof x !== "string") ||
    v.antonyms.some((x) => typeof x !== "string") ||
    v.variants.some((x) => typeof x !== "string")
);
assert.strictEqual(objectLeak, undefined, `no vocabulary relation may stay an object (leak: ${objectLeak?.french})`);
const objectSense = fullVocab.vocabulary.find((v) =>
  v.senses.some((s) => typeof s !== "object" || typeof s.english_gloss !== "string" || s.english_gloss === "")
);
assert.strictEqual(objectSense, undefined, `every vocabulary sense must expose a string gloss (leak: ${objectSense?.french})`);
const objectComplement = getExpressions().expressions.find(
  (e) => e.complement_structure !== null && typeof e.complement_structure !== "string"
);
assert.strictEqual(
  objectComplement,
  undefined,
  `complement_structure must be flattened before rendering (leak: ${objectComplement?.french})`
);
assert.strictEqual(
  formatComplementStructure({ direct_object: false, indirect_object: false, preposition: "à", followed_by: "infinitive" }),
  "à · + infinitive",
  "complement_structure flattens to a readable slot signature"
);
assert.strictEqual(formatComplementStructure({ direct_object: null, indirect_object: null, preposition: null, followed_by: null }), null);
console.log("✅ Heterogeneous dataset fields flattened (vocab relations, senses, complement_structure).");

// 18. Pagination guards: non-numeric, zero, negative and oversized page params.
assert.strictEqual(parsePageParam(undefined), 1, "missing page defaults to 1");
assert.strictEqual(parsePageParam(""), 1, "empty page defaults to 1");
assert.strictEqual(parsePageParam("abc"), 1, "non-numeric page defaults to 1");
assert.strictEqual(parsePageParam("2x"), 1, "trailing garbage page defaults to 1");
assert.strictEqual(parsePageParam("0"), 1, "zero page clamps to 1");
assert.strictEqual(parsePageParam("-5"), 1, "negative page clamps to 1");
assert.strictEqual(parsePageParam("3"), 3, "valid page passes through");
assert.strictEqual(parsePageParam("999999999"), MAX_PAGE_PARAM, "huge page clamps to the ceiling");
const paged = paginate(Array.from({ length: 120 }, (_, i) => i), "abc", 50);
assert.strictEqual(paged.currentPage, 1, "non-numeric page falls back to page 1");
assert.strictEqual(paged.items.length, 50, "page 1 is full");
assert.strictEqual(paged.totalPages, 3, "totalPages is derived from total and pageSize");
assert(Number.isFinite(paged.items[0]), "offset must be a finite number");
const overflow = paginate(Array.from({ length: 10 }, (_, i) => i), "99", 50);
assert.strictEqual(overflow.currentPage, 1, "page beyond the end clamps to the last page");
assert.strictEqual(overflow.totalPages, 1, "totalPages never below 1");
const empty = paginate([], "4", 50);
assert.strictEqual(empty.totalPages, 1, "empty result still reports one page");
console.log("✅ Pagination guards verified (NaN, zero, negative, overflow, empty).");

// 19. Versioned SRS envelope with per-record validation.
assert.strictEqual(SRS_SCHEMA_VERSION, 2, "SRS envelope carries a schema version");
assert.deepStrictEqual(parseSrsState(null), { version: SRS_SCHEMA_VERSION, records: {} }, "absent state is empty");
assert.deepStrictEqual(parseSrsState("{oops"), { version: SRS_SCHEMA_VERSION, records: {} }, "malformed JSON is dropped");
assert.deepStrictEqual(parseSrsState("[]"), { version: SRS_SCHEMA_VERSION, records: {} }, "non-object payload is dropped");
const v2 = parseSrsState(
  JSON.stringify({ version: 2, records: { a: { intervalDays: 3, due: 10, lapses: 0 } } })
);
assert.deepStrictEqual(v2.records.a, { intervalDays: 3, due: 10, lapses: 0 }, "valid v2 record survives");
const mixed = parseSrsState(
  JSON.stringify({
    version: 2,
    records: {
      good: { intervalDays: 1, due: 5, lapses: 0 },
      badDue: { intervalDays: 1, due: "soon", lapses: 0 },
      badInterval: { intervalDays: null, due: 5, lapses: 0 },
      badLapses: { intervalDays: 1, due: 5, lapses: "x" },
      negative: { intervalDays: -1, due: 5, lapses: 0 },
      notObject: "nope",
    },
  })
);
assert.deepStrictEqual(Object.keys(mixed.records), ["good"], "only well-formed records survive the read");
const legacy = parseSrsState(JSON.stringify({ a: { intervalDays: 1, due: 5, lapses: 0 } }));
assert.strictEqual(legacy.version, 1, "bare v1 map is recognised as version 1");
assert.deepStrictEqual(legacy.records.a, { intervalDays: 1, due: 5, lapses: 0 }, "v1 records migrate forward");
const corruptCard = { key: "corrupt", front: "x", back: "y" };
const corruptNow = Date.now();
assert.deepStrictEqual(
  selectDueCards([corruptCard], { corrupt: { intervalDays: 1, due: "nope", lapses: 0 } } as never, corruptNow).length,
  1,
  "a malformed stored record must not permanently strand the card"
);
assert.deepStrictEqual(
  selectSrsStats([corruptCard], { corrupt: { intervalDays: 1, due: "nope", lapses: 0 } } as never, corruptNow),
  { total: 1, due: 1, learned: 0 },
  "a malformed stored record is counted as due, never silently lost"
);
assert.deepStrictEqual(sanitizeRecords(null), {}, "sanitizeRecords tolerates junk");
console.log("✅ SRS versioned envelope + per-record validation verified (invalid records dropped, v1 migrates).");

// 20. Review state snapshot reads both maps in one pass.
assert.deepStrictEqual(getReviewStateSnapshot(), { saved: new Set(), reviewed: new Set() }, "SSR snapshot is empty");
assert.strictEqual(typeof subscribeReviewState, "function", "subscribeReviewState must be a function");
assert.strictEqual(typeof getReviewStateSnapshot, "function", "getReviewStateSnapshot must be a function");
console.log("✅ Review state snapshot helper verified.");

// 21. Search result vocabulary urls must be the deduplicated detail id.
const vocabSearch = searchDataset(loadedData, "île");
for (const hit of vocabSearch.filter((h) => h.type === "vocabulary")) {
  const slug = hit.url.replace("/vocabulary/", "");
  const resolved = getVocabularyById(decodeURIComponent(slug));
  assert(resolved !== null, `search hit ${hit.url} must resolve to a vocabulary record`);
  assert.strictEqual(
    resolved!.vocab.french,
    hit.title,
    `search hit ${hit.url} must render '${hit.title}', got '${resolved!.vocab.french}'`
  );
}
console.log("✅ Search vocabulary URLs resolve to their own record.");

// 22. generateStaticParams id lists must be non-empty and unique.
for (const [label, ids] of [
  ["verbs", getAllVerbIds()],
  ["tenses", getAllTenseIds()],
  ["grammar", getAllGrammarIds()],
  ["expressions", getAllExpressionIds()],
  ["chapters", getAllChapterIds()],
  ["concepts", getAllConceptIds()],
  ["vocabulary", getAllVocabularyIds()],
] as const) {
  assert(ids.length > 0, `${label} static params must not be empty`);
  assert.strictEqual(new Set(ids).size, ids.length, `${label} static params must be unique`);
}
assert.strictEqual(getAllVerbIds().length, 496, "all 496 verbs are prerenderable");
assert.strictEqual(getAllVocabularyIds().length, 1002, "all 1002 vocabulary records are prerenderable");
console.log("✅ generateStaticParams id lists are complete and unique for all seven detail routes.");

// 23. Manager integration facade (optional observability — no-ops when unconfigured).
//     Async because the facade reads its env at module load, so the suite
//     re-imports it through cache-busting query strings. `tsx` emits CJS for
//     this repo (no "type": "module"), which forbids top-level await — hence the
//     explicit chain and the process.exitCode below.
runManagerIntegrationTests()
  .then((managerChecks) => {
    console.log(
      `✅ Manager integration verified (${managerChecks} checks: disabled no-ops, enablement, NEXT_PUBLIC_ client split, static-access guard, batching + leading-edge flush, drop count, globalThis sharing).`
    );
    console.log("\n🎉 All tests passed successfully!");
  })
  .catch((error) => {
    console.error("\n❌ Manager integration suite failed:", error);
    process.exitCode = 1;
  });
