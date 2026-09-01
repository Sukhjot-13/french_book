import fs from "fs";
import path from "path";
import { ChapterExtractionBundle } from "./chapter-types";
import { normalizeFrenchText } from "../src/lib/dataset/normalize";

const ROOT_DIR = path.resolve(__dirname, "..");
const EXTRACTED_DIR = path.join(ROOT_DIR, "data", "extracted", "chapters");
const NORMALIZED_DIR = path.join(ROOT_DIR, "data", "normalized", "chapters");

export function normalizeAllChapters(): void {
  if (!fs.existsSync(NORMALIZED_DIR)) {
    fs.mkdirSync(NORMALIZED_DIR, { recursive: true });
  }

  const files = fs.readdirSync(EXTRACTED_DIR).filter((f) => f.startsWith("chapter-") && f.endsWith(".json"));

  for (const file of files) {
    const rawContent = fs.readFileSync(path.join(EXTRACTED_DIR, file), "utf-8");
    const bundle: ChapterExtractionBundle = JSON.parse(rawContent);

    // Normalize strings in bundle
    bundle.chapter.title = normalizeFrenchText(bundle.chapter.title);
    bundle.sections.forEach((sec) => {
      sec.title = normalizeFrenchText(sec.title);
    });

    bundle.grammar_rules.forEach((rule) => {
      rule.title = normalizeFrenchText(rule.title);
      rule.summary = rule.summary ? normalizeFrenchText(rule.summary) : null;
      rule.explanation = normalizeFrenchText(rule.explanation);
    });

    bundle.examples.forEach((ex) => {
      ex.french = normalizeFrenchText(ex.french);
      ex.english = normalizeFrenchText(ex.english);
    });

    bundle.exercises.forEach((ex) => {
      ex.instructions_french = normalizeFrenchText(ex.instructions_french || "");
      if (ex.instructions_english) {
        ex.instructions_english = normalizeFrenchText(ex.instructions_english);
      }
      ex.questions.forEach((q) => {
        q.prompt = normalizeFrenchText(q.prompt);
        if (q.answer) q.answer = normalizeFrenchText(q.answer);
      });
    });

    fs.writeFileSync(path.join(NORMALIZED_DIR, file), JSON.stringify(bundle, null, 2), "utf-8");
  }

  console.log(`Normalized ${files.length} chapters.`);
}

if (require.main === module) {
  normalizeAllChapters();
}
