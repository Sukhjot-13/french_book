import { Verb, Vocabulary, Expression, Attestation } from "./schemas";

export function mergeAttestations(existing: Attestation[] = [], incoming: Attestation[] = []): Attestation[] {
  const merged = [...(existing || [])];
  for (const item of incoming || []) {
    const isDup = merged.some(
      (m) =>
        m.chapter_number === item.chapter_number &&
        m.page_printed === item.page_printed &&
        m.context_type === item.context_type &&
        m.section_id === item.section_id &&
        m.exercise_id === item.exercise_id &&
        m.source_anchor === item.source_anchor
    );
    if (!isDup) {
      merged.push(item);
    }
  }
  return merged;
}

export function deduplicateArray<T>(arr: T[] = []): T[] {
  return Array.from(new Set(arr || []));
}

function safeArray(val: unknown): string[] {
  if (Array.isArray(val)) return val;
  if (typeof val === "string") return [val];
  return [];
}

export function canonicalizeVerb(existing: Verb, incoming: Verb): Verb {
  const mergedAttestations = mergeAttestations(existing.attestations, incoming.attestations);
  const occurrences = Math.max(1, mergedAttestations.filter((a) => a.source_type === "book").length);

  const existingEn = safeArray(existing.english);
  const incomingEn = safeArray(incoming.english);

  return {
    ...existing,
    english: deduplicateArray([...existingEn, ...incomingEn]),
    senses: [...(existing.senses || []), ...(incoming.senses || []).filter((s) => !existing.senses?.some((es) => es.sense_id === s.sense_id))],
    conjugation_ids: deduplicateArray([...(existing.conjugation_ids || []), ...(incoming.conjugation_ids || [])]),
    expression_ids: deduplicateArray([...(existing.expression_ids || []), ...(incoming.expression_ids || [])]),
    related_verb_ids: deduplicateArray([...(existing.related_verb_ids || []), ...(incoming.related_verb_ids || [])]),
    word_family_ids: deduplicateArray([...(existing.word_family_ids || []), ...(incoming.word_family_ids || [])]),
    past_participle: existing.past_participle || incoming.past_participle || null,
    present_participle: existing.present_participle || incoming.present_participle || null,
    auxiliary: existing.auxiliary !== "avoir" ? existing.auxiliary : incoming.auxiliary || "avoir",
    regularity: existing.regularity !== "regular" ? existing.regularity : incoming.regularity || "regular",
    verb_group: existing.verb_group !== "1st_group" ? existing.verb_group : incoming.verb_group || "1st_group",
    pronominal: Boolean(existing.pronominal || incoming.pronominal),
    functional_roles: deduplicateArray([...(existing.functional_roles || []), ...(incoming.functional_roles || [])]),
    attestations: mergedAttestations,
    frequency: {
      ...existing.frequency,
      book_occurrences: occurrences,
      book_frequency_tier: occurrences > 10 ? "very_common" : occurrences > 4 ? "common" : occurrences > 1 ? "occasional" : "rare",
    },
    tags: deduplicateArray([...(existing.tags || []), ...(incoming.tags || [])]),
  };
}

export function canonicalizeVocabularyEntry(existing: Vocabulary, incoming: Vocabulary): Vocabulary {
  const mergedAttestations = mergeAttestations(existing.attestations, incoming.attestations);
  const occurrences = Math.max(1, mergedAttestations.filter((a) => a.source_type === "book").length);

  const existingEn = safeArray(existing.english);
  const incomingEn = safeArray(incoming.english);

  const hasInfinitiveGloss = [...existingEn, ...incomingEn].some((meaning) => /^to\s+/i.test(meaning.trim()));
  const partOfSpeech = hasInfinitiveGloss ? "verb" : existing.part_of_speech === "other" ? incoming.part_of_speech : existing.part_of_speech;
  return {
    ...existing,
    english: deduplicateArray([...existingEn, ...incomingEn]),
    senses: [...(existing.senses || []), ...(incoming.senses || []).filter((s) => !existing.senses?.some((es) => es.sense_id === s.sense_id))],
    part_of_speech: partOfSpeech,
    noun: partOfSpeech === "noun" ? {
      gender: existing.noun?.gender || incoming.noun?.gender || null,
      article: existing.noun?.article || incoming.noun?.article || null,
      plural: existing.noun?.plural || incoming.noun?.plural || null,
      countability: existing.noun?.countability || incoming.noun?.countability || null,
    } : null,
    adjective: partOfSpeech === "adjective" ? (existing.adjective || incoming.adjective || null) : null,
    word_family_ids: deduplicateArray([...(existing.word_family_ids || []), ...(incoming.word_family_ids || [])]),
    collocation_expression_ids: deduplicateArray([...(existing.collocation_expression_ids || []), ...(incoming.collocation_expression_ids || [])]),
    attestations: mergedAttestations,
    frequency: {
      ...existing.frequency,
      book_occurrences: occurrences,
      book_frequency_tier: occurrences > 10 ? "very_common" : occurrences > 4 ? "common" : occurrences > 1 ? "occasional" : "rare",
    },
    tags: deduplicateArray([...(existing.tags || []), ...(incoming.tags || [])]),
  };
}

export function canonicalizeExpressionEntry(existing: Expression, incoming: Expression): Expression {
  const mergedAttestations = mergeAttestations(existing.attestations, incoming.attestations);
  const occurrences = Math.max(1, mergedAttestations.filter((a) => a.source_type === "book").length);

  const existingEn = safeArray(existing.english);
  const incomingEn = safeArray(incoming.english);

  return {
    ...existing,
    english: deduplicateArray([...existingEn, ...incomingEn]),
    base_verb_ids: deduplicateArray([...(existing.base_verb_ids || []), ...(incoming.base_verb_ids || [])]),
    related_vocabulary_ids: deduplicateArray([...(existing.related_vocabulary_ids || []), ...(incoming.related_vocabulary_ids || [])]),
    example_ids: deduplicateArray([...(existing.example_ids || []), ...(incoming.example_ids || [])]),
    function_ids: deduplicateArray([...(existing.function_ids || []), ...(incoming.function_ids || [])]),
    variants: deduplicateArray([...(existing.variants || []), ...(incoming.variants || [])]),
    attestations: mergedAttestations,
    frequency: {
      ...existing.frequency,
      book_occurrences: occurrences,
      book_frequency_tier: occurrences > 10 ? "very_common" : occurrences > 4 ? "common" : occurrences > 1 ? "occasional" : "rare",
    },
    tags: deduplicateArray([...(existing.tags || []), ...(incoming.tags || [])]),
  };
}

export function canonicalizeVerbs(verbs: Verb[]): Verb[] {
  const map = new Map<string, Verb>();
  for (const v of verbs) {
    if (!v || !v.id) continue;
    if (!map.has(v.id)) {
      map.set(v.id, {
        ...v,
        english: safeArray(v.english).length > 0 ? safeArray(v.english) : [v.infinitive || "to do"],
        frequency: {
          ...v.frequency,
          book_occurrences: Math.max(1, v.attestations?.length || 1),
        },
      });
    } else {
      const existing = map.get(v.id)!;
      map.set(v.id, canonicalizeVerb(existing, v));
    }
  }
  return Array.from(map.values());
}

export function canonicalizeVocabulary(vocab: Vocabulary[]): Vocabulary[] {
  const map = new Map<string, Vocabulary>();
  for (const v of vocab) {
    if (!v || !v.id) continue;
    if (!map.has(v.id)) {
      map.set(v.id, {
        ...v,
        english: safeArray(v.english).length > 0 ? safeArray(v.english) : [v.french || ""],
        frequency: {
          ...v.frequency,
          book_occurrences: Math.max(1, v.attestations?.length || 1),
        },
      });
    } else {
      const existing = map.get(v.id)!;
      map.set(v.id, canonicalizeVocabularyEntry(existing, v));
    }
  }
  return Array.from(map.values());
}

export function canonicalizeExpressions(exprs: Expression[]): Expression[] {
  const map = new Map<string, Expression>();
  for (const e of exprs) {
    if (!e || !e.id) continue;
    if (!map.has(e.id)) {
      map.set(e.id, {
        ...e,
        english: safeArray(e.english).length > 0 ? safeArray(e.english) : [e.canonical_form || ""],
        frequency: {
          ...e.frequency,
          book_occurrences: Math.max(1, e.attestations?.length || 1),
        },
      });
    } else {
      const existing = map.get(e.id)!;
      map.set(e.id, canonicalizeExpressionEntry(existing, e));
    }
  }
  return Array.from(map.values());
}
