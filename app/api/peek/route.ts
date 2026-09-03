import { NextRequest, NextResponse } from "next/server";
import {
  getVerbById,
  getTenseById,
  getExpressionById,
  getGrammarRuleById,
  getVocabularyById,
  getChapterById,
  getExceptionsAndTraps,
  getExercises,
  getExamples,
  getConceptById,
} from "@/src/lib/data/selectors";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const type = searchParams.get("type");
  const id = searchParams.get("id");

  if (!type || !id) {
    return NextResponse.json({ error: "Missing type or id" }, { status: 400 });
  }

  try {
    if (type === "verb") {
      const data = getVerbById(id);
      if (!data) return NextResponse.json({ error: "Verb not found" }, { status: 404 });
      const { verb, expressions, examples } = data;

      // extract future stem if available
      const futureStem = verb.stems?.find(
        (s) =>
          typeof s === "object" &&
          s !== null &&
          "tense_context" in s &&
          typeof (s as Record<string, unknown>).tense_context === "string" &&
          ((s as Record<string, unknown>).tense_context as string).toLowerCase().includes("futur")
      ) as { stem?: string } | undefined;
      const futureStemStr = futureStem?.stem || null;

      return NextResponse.json({
        type: "verb",
        id: verb.lemma,
        title: verb.lemma,
        subtitle: verb.english,
        url: `/verbs/${encodeURIComponent(verb.lemma)}`,
        facts: [
          { label: "Group", value: verb.group.replace("_group", "e groupe") },
          { label: "Regularity", value: verb.regularity },
          { label: "Auxiliary", value: verb.auxiliary },
          { label: "Past Participle", value: verb.past_participle || "—" },
          ...(futureStemStr ? [{ label: "Future Stem", value: `${futureStemStr}-` }] : []),
          ...(verb.transitivity ? [{ label: "Transitivity", value: verb.transitivity }] : []),
        ],
        description: verb.senses?.[0]?.english_gloss || verb.senses?.[0]?.meaning || undefined,
        constructions: expressions.slice(0, 4).map((e) => ({
          text: e.french,
          subtext: e.english,
          url: `/expressions/${encodeURIComponent(e.french)}`,
        })),
        examples: examples.slice(0, 3).map((ex) => ({
          french: ex.french,
          english: ex.english,
        })),
        chapters: verb.raw_chapters,
      });
    }

    if (type === "expression") {
      const data = getExpressionById(id);
      if (!data) return NextResponse.json({ error: "Expression not found" }, { status: 404 });
      const { expression, examples } = data;

      return NextResponse.json({
        type: "expression",
        id: expression.french,
        title: expression.french,
        subtitle: expression.english,
        url: `/expressions/${encodeURIComponent(expression.french)}`,
        facts: [
          { label: "Type", value: expression.type },
          { label: "Register", value: expression.register },
          ...(expression.strength ? [{ label: "Collocation", value: expression.strength }] : []),
          ...(expression.complement_structure ? [{ label: "Complement", value: expression.complement_structure }] : []),
        ],
        patternSnippet: expression.pattern || undefined,
        constructions: expression.prepositions?.length
          ? [{ text: "Prepositions", subtext: expression.prepositions.join(", ") }]
          : undefined,
        examples: examples.slice(0, 2).map((ex) => ({
          french: ex.french,
          english: ex.english,
        })),
        chapters: expression.raw_chapters,
      });
    }

    if (type === "tense") {
      const data = getTenseById(id);
      if (!data) return NextResponse.json({ error: "Tense not found" }, { status: 404 });
      const { tense, examples, traps } = data;

      return NextResponse.json({
        type: "tense",
        id: tense.name_fr,
        title: tense.name_fr,
        subtitle: tense.name_en || tense.mood,
        url: `/tenses/${encodeURIComponent(tense.name_fr)}`,
        facts: [
          { label: "Mood", value: tense.mood },
          ...(tense.cefr ? [{ label: "CEFR", value: tense.cefr }] : []),
        ],
        patternSnippet: tense.formation || undefined,
        description: tense.usage?.[0] || undefined,
        traps: traps.slice(0, 2).map((t) => ({
          title: t.title,
          correct: t.correct_form || undefined,
          incorrect: t.incorrect_form || undefined,
        })),
        examples: examples.slice(0, 2).map((ex) => ({
          french: ex.french,
          english: ex.english,
        })),
        chapters: tense.raw_chapters,
      });
    }

    if (type === "grammar") {
      const data = getGrammarRuleById(id);
      if (!data) return NextResponse.json({ error: "Grammar rule not found" }, { status: 404 });
      const { rule, examples, traps } = data;

      return NextResponse.json({
        type: "grammar",
        id: rule.title,
        title: rule.title,
        subtitle: rule.category,
        url: `/grammar/${encodeURIComponent(rule.title)}`,
        facts: [
          { label: "Category", value: rule.category },
          ...(rule.cefr ? [{ label: "CEFR", value: rule.cefr }] : []),
        ],
        patternSnippet: rule.formation || undefined,
        description: rule.summary || rule.explanation?.slice(0, 150),
        traps: (traps.length ? traps : rule.common_traps?.map((t) => ({ title: t, correct_form: null, incorrect_form: null })) || []).slice(0, 2).map((t: any) => ({
          title: t.title || t,
          correct: t.correct_form || undefined,
          incorrect: t.incorrect_form || undefined,
        })),
        examples: examples.slice(0, 2).map((ex) => ({
          french: ex.french,
          english: ex.english,
        })),
        chapters: rule.raw_chapters,
      });
    }

    if (type === "vocab") {
      const data = getVocabularyById(id);
      if (!data) return NextResponse.json({ error: "Vocabulary not found" }, { status: 404 });
      const { vocab, expressions, examples } = data;

      return NextResponse.json({
        type: "vocab",
        id: vocab.french,
        title: vocab.french,
        subtitle: vocab.english,
        url: `/vocabulary/${encodeURIComponent(vocab.french)}`,
        facts: [
          { label: "Part of Speech", value: vocab.part_of_speech },
          ...(vocab.gender ? [{ label: "Gender", value: vocab.gender }] : []),
          ...(vocab.article ? [{ label: "Article", value: vocab.article }] : []),
          ...(vocab.plural_form ? [{ label: "Plural", value: vocab.plural_form }] : []),
        ],
        description: vocab.senses?.[0]?.english_gloss || vocab.senses?.[0]?.meaning || undefined,
        constructions: expressions.slice(0, 3).map((e) => ({
          text: e.french,
          subtext: e.english,
          url: `/expressions/${encodeURIComponent(e.french)}`,
        })),
        examples: examples.slice(0, 2).map((ex) => ({
          french: ex.french,
          english: ex.english,
        })),
        chapters: vocab.raw_chapters,
      });
    }

    if (type === "chapter") {
      const data = getChapterById(id);
      if (!data) return NextResponse.json({ error: "Chapter not found" }, { status: 404 });
      const { chapter, sections, grammarRules, exercises } = data;

      return NextResponse.json({
        type: "chapter",
        id: String(chapter.chapter_number),
        title: `Chapter ${chapter.chapter_number}: ${chapter.title}`,
        subtitle: chapter.pages?.printed_start ? `Pages ${chapter.pages.printed_start}–${chapter.pages.printed_end}` : undefined,
        url: `/chapters/${chapter.chapter_number}`,
        facts: [
          { label: "Sections", value: String(sections.length) },
          { label: "Grammar Rules", value: String(grammarRules.length) },
          { label: "Exercises", value: String(exercises.length) },
        ],
        description: chapter.notes || undefined,
        constructions: grammarRules.slice(0, 4).map((r) => ({
          text: r.title,
          url: `/grammar/${encodeURIComponent(r.title)}`,
        })),
      });
    }

    if (type === "trap") {
      const trapsData = getExceptionsAndTraps({ limit: 150 });
      const rawDecoded = decodeURIComponent(id).toLowerCase();
      const trap = trapsData.traps.find(
        (t) =>
          t.id === id ||
          t.title.toLowerCase() === rawDecoded ||
          t.title.toLowerCase().includes(rawDecoded)
      );
      if (!trap) return NextResponse.json({ error: "Trap not found" }, { status: 404 });

      return NextResponse.json({
        type: "trap",
        id: trap.id,
        title: trap.title,
        subtitle: trap.category || "Common Pitfall",
        url: `/traps?query=${encodeURIComponent(trap.title)}`,
        facts: [
          ...(trap.category ? [{ label: "Category", value: trap.category }] : []),
          ...(trap.cefr ? [{ label: "CEFR", value: trap.cefr }] : []),
          { label: "Priority", value: `P${trap.priority}` },
        ],
        description: trap.description || trap.notes || undefined,
        traps: [
          {
            title: trap.title,
            correct: trap.correct_form || undefined,
            incorrect: trap.incorrect_form || undefined,
          },
        ],
        constructions: (trap.related_grammar_rules || []).slice(0, 3).map((r) => ({
          text: r,
          url: `/grammar/${encodeURIComponent(r)}`,
        })),
        chapters: trap.raw_chapters,
      });
    }

    if (type === "example") {
      const examplesData = getExamples({ query: decodeURIComponent(id), limit: 5 });
      const ex = examplesData.examples[0];
      if (!ex) return NextResponse.json({ error: "Example not found" }, { status: 404 });

      return NextResponse.json({
        type: "example",
        id: ex.id,
        title: ex.french,
        subtitle: ex.english,
        url: `/examples?query=${encodeURIComponent(ex.french)}`,
        facts: [
          ...(ex.related_tenses?.[0] ? [{ label: "Tense", value: ex.related_tenses[0] }] : []),
          ...(ex.related_verbs?.[0] ? [{ label: "Verb", value: ex.related_verbs[0] }] : []),
        ],
        description: ex.notes || undefined,
        examples: [{ french: ex.french, english: ex.english }],
        constructions: (ex.related_grammar_rules || []).slice(0, 3).map((r) => ({
          text: r,
          url: `/grammar/${encodeURIComponent(r)}`,
        })),
        chapters: ex.raw_chapters,
      });
    }

    if (type === "exercise") {
      const exercisesData = getExercises({ query: decodeURIComponent(id), limit: 5 });
      const ex = exercisesData.exercises[0];
      if (!ex) return NextResponse.json({ error: "Exercise not found" }, { status: 404 });

      return NextResponse.json({
        type: "exercise",
        id: ex.id,
        title: ex.title || `Exercise ${ex.exercise_code}`,
        subtitle: `Chapter ${ex.chapter_number} • ${ex.exercise_type}`,
        url: `/exercises?chapterId=${ex.chapter_id}`,
        facts: [
          { label: "Questions", value: String(ex.questions_count) },
          { label: "Type", value: ex.exercise_type },
        ],
        description: ex.instructions,
        patternSnippet: ex.questions?.[0]?.prompt ? `Q1: ${ex.questions[0].prompt}` : undefined,
        chapters: [ex.chapter_number],
      });
    }

    if (type === "concept") {
      const data = getConceptById(id);
      if (!data) return NextResponse.json({ error: "Concept not found" }, { status: 404 });
      const { concept, grammarRules, verbs, expressions, examples } = data;

      return NextResponse.json({
        type: "concept",
        id: concept.name,
        title: concept.name,
        subtitle: concept.cefr ? `CEFR ${concept.cefr}` : "Linguistic Concept",
        url: `/concepts/${encodeURIComponent(concept.name)}`,
        facts: [
          { label: "Rules", value: String(grammarRules.length) },
          { label: "Verbs", value: String(verbs.length) },
          { label: "Expressions", value: String(expressions.length) },
          ...(concept.cefr ? [{ label: "CEFR", value: concept.cefr }] : []),
        ],
        description: concept.description || undefined,
        constructions: expressions.slice(0, 3).map((e) => ({
          text: e.french,
          subtext: e.english,
          url: `/expressions/${encodeURIComponent(e.french)}`,
        })),
        examples: examples.slice(0, 2).map((ex) => ({
          french: ex.french,
          english: ex.english,
        })),
        chapters: concept.raw_chapters,
      });
    }

    return NextResponse.json({ error: `Unsupported entity type: ${type}` }, { status: 400 });
  } catch (error) {
    console.error("Peek API error:", error);
    return NextResponse.json({ error: "Failed to generate peek view" }, { status: 500 });
  }
}

