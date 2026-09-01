"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.mergeAttestations = mergeAttestations;
exports.deduplicateArray = deduplicateArray;
exports.canonicalizeVerb = canonicalizeVerb;
exports.canonicalizeVocabularyEntry = canonicalizeVocabularyEntry;
exports.canonicalizeExpressionEntry = canonicalizeExpressionEntry;
exports.canonicalizeVerbs = canonicalizeVerbs;
exports.canonicalizeVocabulary = canonicalizeVocabulary;
exports.canonicalizeExpressions = canonicalizeExpressions;
function mergeAttestations(existing, incoming) {
    if (existing === void 0) { existing = []; }
    if (incoming === void 0) { incoming = []; }
    var merged = __spreadArray([], (existing || []), true);
    var _loop_1 = function (item) {
        var isDup = merged.some(function (m) {
            return m.chapter_number === item.chapter_number &&
                m.page_printed === item.page_printed &&
                m.context_type === item.context_type &&
                m.section_id === item.section_id &&
                m.exercise_id === item.exercise_id &&
                m.source_anchor === item.source_anchor;
        });
        if (!isDup) {
            merged.push(item);
        }
    };
    for (var _i = 0, _a = incoming || []; _i < _a.length; _i++) {
        var item = _a[_i];
        _loop_1(item);
    }
    return merged;
}
function deduplicateArray(arr) {
    if (arr === void 0) { arr = []; }
    return Array.from(new Set(arr || []));
}
function safeArray(val) {
    if (Array.isArray(val))
        return val;
    if (typeof val === "string")
        return [val];
    return [];
}
function canonicalizeVerb(existing, incoming) {
    var mergedAttestations = mergeAttestations(existing.attestations, incoming.attestations);
    var occurrences = Math.max(1, mergedAttestations.filter(function (a) { return a.source_type === "book"; }).length);
    var existingEn = safeArray(existing.english);
    var incomingEn = safeArray(incoming.english);
    return __assign(__assign({}, existing), { english: deduplicateArray(__spreadArray(__spreadArray([], existingEn, true), incomingEn, true)), senses: __spreadArray(__spreadArray([], (existing.senses || []), true), (incoming.senses || []).filter(function (s) { var _a; return !((_a = existing.senses) === null || _a === void 0 ? void 0 : _a.some(function (es) { return es.sense_id === s.sense_id; })); }), true), conjugation_ids: deduplicateArray(__spreadArray(__spreadArray([], (existing.conjugation_ids || []), true), (incoming.conjugation_ids || []), true)), expression_ids: deduplicateArray(__spreadArray(__spreadArray([], (existing.expression_ids || []), true), (incoming.expression_ids || []), true)), related_verb_ids: deduplicateArray(__spreadArray(__spreadArray([], (existing.related_verb_ids || []), true), (incoming.related_verb_ids || []), true)), word_family_ids: deduplicateArray(__spreadArray(__spreadArray([], (existing.word_family_ids || []), true), (incoming.word_family_ids || []), true)), past_participle: existing.past_participle || incoming.past_participle || null, present_participle: existing.present_participle || incoming.present_participle || null, auxiliary: existing.auxiliary !== "avoir" ? existing.auxiliary : incoming.auxiliary || "avoir", regularity: existing.regularity !== "regular" ? existing.regularity : incoming.regularity || "regular", verb_group: existing.verb_group !== "1st_group" ? existing.verb_group : incoming.verb_group || "1st_group", pronominal: Boolean(existing.pronominal || incoming.pronominal), attestations: mergedAttestations, frequency: __assign(__assign({}, existing.frequency), { book_occurrences: occurrences, book_frequency_tier: occurrences > 10 ? "very_common" : occurrences > 4 ? "common" : occurrences > 1 ? "occasional" : "rare" }), tags: deduplicateArray(__spreadArray(__spreadArray([], (existing.tags || []), true), (incoming.tags || []), true)) });
}
function canonicalizeVocabularyEntry(existing, incoming) {
    var _a, _b, _c, _d, _e, _f, _g, _h;
    var mergedAttestations = mergeAttestations(existing.attestations, incoming.attestations);
    var occurrences = Math.max(1, mergedAttestations.filter(function (a) { return a.source_type === "book"; }).length);
    var existingEn = safeArray(existing.english);
    var incomingEn = safeArray(incoming.english);
    var hasInfinitiveGloss = __spreadArray(__spreadArray([], existingEn, true), incomingEn, true).some(function (meaning) { return /^to\s+/i.test(meaning.trim()); });
    var partOfSpeech = hasInfinitiveGloss ? "verb" : existing.part_of_speech === "other" ? incoming.part_of_speech : existing.part_of_speech;
    return __assign(__assign({}, existing), { english: deduplicateArray(__spreadArray(__spreadArray([], existingEn, true), incomingEn, true)), senses: __spreadArray(__spreadArray([], (existing.senses || []), true), (incoming.senses || []).filter(function (s) { var _a; return !((_a = existing.senses) === null || _a === void 0 ? void 0 : _a.some(function (es) { return es.sense_id === s.sense_id; })); }), true), part_of_speech: partOfSpeech, noun: partOfSpeech === "noun" ? {
            gender: ((_a = existing.noun) === null || _a === void 0 ? void 0 : _a.gender) || ((_b = incoming.noun) === null || _b === void 0 ? void 0 : _b.gender) || null,
            article: ((_c = existing.noun) === null || _c === void 0 ? void 0 : _c.article) || ((_d = incoming.noun) === null || _d === void 0 ? void 0 : _d.article) || null,
            plural: ((_e = existing.noun) === null || _e === void 0 ? void 0 : _e.plural) || ((_f = incoming.noun) === null || _f === void 0 ? void 0 : _f.plural) || null,
            countability: ((_g = existing.noun) === null || _g === void 0 ? void 0 : _g.countability) || ((_h = incoming.noun) === null || _h === void 0 ? void 0 : _h.countability) || null,
        } : null, adjective: partOfSpeech === "adjective" ? (existing.adjective || incoming.adjective || null) : null, word_family_ids: deduplicateArray(__spreadArray(__spreadArray([], (existing.word_family_ids || []), true), (incoming.word_family_ids || []), true)), collocation_expression_ids: deduplicateArray(__spreadArray(__spreadArray([], (existing.collocation_expression_ids || []), true), (incoming.collocation_expression_ids || []), true)), attestations: mergedAttestations, frequency: __assign(__assign({}, existing.frequency), { book_occurrences: occurrences, book_frequency_tier: occurrences > 10 ? "very_common" : occurrences > 4 ? "common" : occurrences > 1 ? "occasional" : "rare" }), tags: deduplicateArray(__spreadArray(__spreadArray([], (existing.tags || []), true), (incoming.tags || []), true)) });
}
function canonicalizeExpressionEntry(existing, incoming) {
    var mergedAttestations = mergeAttestations(existing.attestations, incoming.attestations);
    var occurrences = Math.max(1, mergedAttestations.filter(function (a) { return a.source_type === "book"; }).length);
    var existingEn = safeArray(existing.english);
    var incomingEn = safeArray(incoming.english);
    return __assign(__assign({}, existing), { english: deduplicateArray(__spreadArray(__spreadArray([], existingEn, true), incomingEn, true)), base_verb_ids: deduplicateArray(__spreadArray(__spreadArray([], (existing.base_verb_ids || []), true), (incoming.base_verb_ids || []), true)), related_vocabulary_ids: deduplicateArray(__spreadArray(__spreadArray([], (existing.related_vocabulary_ids || []), true), (incoming.related_vocabulary_ids || []), true)), example_ids: deduplicateArray(__spreadArray(__spreadArray([], (existing.example_ids || []), true), (incoming.example_ids || []), true)), function_ids: deduplicateArray(__spreadArray(__spreadArray([], (existing.function_ids || []), true), (incoming.function_ids || []), true)), variants: deduplicateArray(__spreadArray(__spreadArray([], (existing.variants || []), true), (incoming.variants || []), true)), attestations: mergedAttestations, frequency: __assign(__assign({}, existing.frequency), { book_occurrences: occurrences, book_frequency_tier: occurrences > 10 ? "very_common" : occurrences > 4 ? "common" : occurrences > 1 ? "occasional" : "rare" }), tags: deduplicateArray(__spreadArray(__spreadArray([], (existing.tags || []), true), (incoming.tags || []), true)) });
}
function canonicalizeVerbs(verbs) {
    var _a;
    var map = new Map();
    for (var _i = 0, verbs_1 = verbs; _i < verbs_1.length; _i++) {
        var v = verbs_1[_i];
        if (!v || !v.id)
            continue;
        if (!map.has(v.id)) {
            map.set(v.id, __assign(__assign({}, v), { english: safeArray(v.english).length > 0 ? safeArray(v.english) : [v.infinitive || "to do"], frequency: __assign(__assign({}, v.frequency), { book_occurrences: Math.max(1, ((_a = v.attestations) === null || _a === void 0 ? void 0 : _a.length) || 1) }) }));
        }
        else {
            var existing = map.get(v.id);
            map.set(v.id, canonicalizeVerb(existing, v));
        }
    }
    return Array.from(map.values());
}
function canonicalizeVocabulary(vocab) {
    var _a;
    var map = new Map();
    for (var _i = 0, vocab_1 = vocab; _i < vocab_1.length; _i++) {
        var v = vocab_1[_i];
        if (!v || !v.id)
            continue;
        if (!map.has(v.id)) {
            map.set(v.id, __assign(__assign({}, v), { english: safeArray(v.english).length > 0 ? safeArray(v.english) : [v.french || ""], frequency: __assign(__assign({}, v.frequency), { book_occurrences: Math.max(1, ((_a = v.attestations) === null || _a === void 0 ? void 0 : _a.length) || 1) }) }));
        }
        else {
            var existing = map.get(v.id);
            map.set(v.id, canonicalizeVocabularyEntry(existing, v));
        }
    }
    return Array.from(map.values());
}
function canonicalizeExpressions(exprs) {
    var _a;
    var map = new Map();
    for (var _i = 0, exprs_1 = exprs; _i < exprs_1.length; _i++) {
        var e = exprs_1[_i];
        if (!e || !e.id)
            continue;
        if (!map.has(e.id)) {
            map.set(e.id, __assign(__assign({}, e), { english: safeArray(e.english).length > 0 ? safeArray(e.english) : [e.canonical_form || ""], frequency: __assign(__assign({}, e.frequency), { book_occurrences: Math.max(1, ((_a = e.attestations) === null || _a === void 0 ? void 0 : _a.length) || 1) }) }));
        }
        else {
            var existing = map.get(e.id);
            map.set(e.id, canonicalizeExpressionEntry(existing, e));
        }
    }
    return Array.from(map.values());
}
