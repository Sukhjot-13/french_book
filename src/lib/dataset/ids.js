"use strict";
/**
 * Deterministic ID generation utilities for French Revision Super Dataset
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.VALID_ID_PREFIXES = void 0;
exports.stripAccents = stripAccents;
exports.slugify = slugify;
exports.makeBookId = makeBookId;
exports.makeChapterId = makeChapterId;
exports.makeSectionId = makeSectionId;
exports.makeConceptId = makeConceptId;
exports.makeTenseId = makeTenseId;
exports.makeRuleId = makeRuleId;
exports.makeVerbId = makeVerbId;
exports.makeConjugationId = makeConjugationId;
exports.makeExpressionId = makeExpressionId;
exports.makeVocabId = makeVocabId;
exports.makeExampleId = makeExampleId;
exports.makeExerciseId = makeExerciseId;
exports.makeQuestionId = makeQuestionId;
exports.makeStudySetId = makeStudySetId;
exports.isValidId = isValidId;
function stripAccents(str) {
    return str
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/œ/g, "oe")
        .replace(/æ/g, "ae")
        .replace(/ç/g, "c")
        .replace(/Ç/g, "c");
}
function slugify(str) {
    return stripAccents(str)
        .toLowerCase()
        .replace(/['’`´]/g, "_")
        .replace(/[^a-z0-9_]+/g, "_")
        .replace(/_+/g, "_")
        .replace(/^_|_$/g, "");
}
function makeBookId(titleOrSlug) {
    var slug = slugify(titleOrSlug);
    return "book_".concat(slug);
}
function makeChapterId(chapterNumber) {
    var numStr = chapterNumber.toString().padStart(2, "0");
    return "chapter_".concat(numStr);
}
function makeSectionId(chapterNumber, sectionOrder, title) {
    var chStr = chapterNumber.toString().padStart(2, "0");
    var secStr = sectionOrder.toString().padStart(2, "0");
    if (title) {
        var slug = slugify(title).slice(0, 30);
        return "section_".concat(chStr, "_").concat(secStr, "_").concat(slug);
    }
    return "section_".concat(chStr, "_").concat(secStr);
}
function makeConceptId(name) {
    var slug = slugify(name);
    return "concept_".concat(slug);
}
function makeTenseId(nameEnglishOrKey) {
    var slug = slugify(nameEnglishOrKey);
    return "tense_".concat(slug);
}
function makeRuleId(titleOrKey) {
    var slug = slugify(titleOrKey);
    return "rule_".concat(slug);
}
function makeVerbId(infinitive) {
    // Strip reflexive 'se ' / 's'' prefix if present for base canonical ID, or preserve if distinct pronominal
    var clean = infinitive.trim();
    var slug = slugify(clean);
    return "verb_".concat(slug);
}
function makeConjugationId(verbIdOrInfinitive, tenseIdOrKey) {
    var vSlug = verbIdOrInfinitive.startsWith("verb_")
        ? verbIdOrInfinitive.replace(/^verb_/, "")
        : slugify(verbIdOrInfinitive);
    var tSlug = tenseIdOrKey.startsWith("tense_")
        ? tenseIdOrKey.replace(/^tense_/, "")
        : slugify(tenseIdOrKey);
    return "conj_".concat(vSlug, "_").concat(tSlug);
}
function makeExpressionId(canonicalForm) {
    // common abbreviations in IDs: quelqu'un -> qqn, quelque chose -> qqch, infinitif -> inf
    var form = canonicalForm
        .replace(/\bquelqu['’]un\b/gi, "qqn")
        .replace(/\bquelque chose\b/gi, "qqch")
        .replace(/\b[+]?\s*infinitif\b/gi, "inf");
    var slug = slugify(form);
    return "expr_".concat(slug);
}
function makeVocabId(canonicalWord, pos) {
    // Remove leading articles like 'le ', 'la ', 'l'', 'un ', 'une '
    var clean = canonicalWord.trim().replace(/^(le|la|l'|l’|les|un|une|des)\s+/i, "");
    var slug = slugify(clean);
    if (pos && (pos === "verb" || pos === "adverb" || pos === "adjective")) {
        return "vocab_".concat(slug);
    }
    return "vocab_".concat(slug);
}
function makeExampleId(verbOrChapter, index) {
    var prefix = slugify(verbOrChapter);
    var idxStr = index.toString().padStart(3, "0");
    return "example_".concat(prefix, "_").concat(idxStr);
}
function makeExerciseId(chapterNumber, exerciseNumber) {
    var chStr = chapterNumber.toString().padStart(2, "0");
    var exStr = exerciseNumber.toString().replace(/[^0-9]/g, "_").padStart(2, "0");
    return "exercise_".concat(chStr, "_").concat(exStr);
}
function makeQuestionId(exerciseId, questionIndex) {
    var qStr = questionIndex.toString().padStart(2, "0");
    return "".concat(exerciseId, "_q").concat(qStr);
}
function makeStudySetId(name) {
    var slug = slugify(name);
    return "studyset_".concat(slug);
}
exports.VALID_ID_PREFIXES = [
    "book_",
    "chapter_",
    "section_",
    "concept_",
    "tense_",
    "rule_",
    "verb_",
    "conj_",
    "expr_",
    "vocab_",
    "example_",
    "exercise_",
    "studyset_",
];
function isValidId(id) {
    if (!id || typeof id !== "string")
        return false;
    return exports.VALID_ID_PREFIXES.some(function (prefix) { return id.startsWith(prefix); });
}
