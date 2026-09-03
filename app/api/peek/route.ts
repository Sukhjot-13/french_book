import { NextRequest, NextResponse } from "next/server";
import {
  getVerbById,
  getTenseById,
  getExpressionById,
  getGrammarRuleById,
  getVocabularyById,
  getChapterById,
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
        url: `/vocabulary?query=${encodeURIComponent(vocab.french)}`,
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
      const { chapter } = data;

      return NextResponse.json({
        type: "chapter",
        id: String(chapter.chapter_number),
        title: `Chapter ${chapter.chapter_number}: ${chapter.title}`,
        subtitle: chapter.pages?.printed_start ? `Pages ${chapter.pages.printed_start}–${chapter.pages.printed_end}` : undefined,
        url: `/chapters/${chapter.chapter_number}`,
        facts: [
          { label: "Chapter", value: String(chapter.chapter_number) },
        ],
        description: chapter.notes || undefined,
      });
    }

    return NextResponse.json({ error: `Unsupported entity type: ${type}` }, { status: 400 });
  } catch (error) {
    console.error("Peek API error:", error);
    return NextResponse.json({ error: "Failed to generate peek view" }, { status: 500 });
  }
}
