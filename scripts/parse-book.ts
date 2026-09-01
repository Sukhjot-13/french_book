import fs from "fs";
import path from "path";
import { RawPage } from "./extract-pages";
import { ChapterExtractionBundle } from "./chapter-types";
import { buildChapter1 } from "./chapter-01";
import { buildChapter2 } from "./chapter-02";
import { buildChapter3 } from "./chapter-03";
import { buildChapter4 } from "./chapter-04";
import { buildChapter5 } from "./chapter-05";
import {
  buildChapter6,
  buildChapter7,
  buildChapter8,
  buildChapter9,
  buildChapter10,
} from "./chapters-06-to-10";
import {
  buildChapter11,
  buildChapter12,
  buildChapter13,
  buildChapter14,
  buildChapter15,
  buildChapter16,
  buildChapter17,
  buildChapter18,
} from "./chapters-11-to-18";
import {
  buildChapter19,
  buildChapter20,
  buildChapter21,
  buildChapter22,
  buildChapter23,
  buildChapter24,
  buildChapter25,
  buildChapter26,
  buildChapter27,
} from "./chapters-19-to-27";

const ROOT_DIR = path.resolve(__dirname, "..");
const RAW_PAGES_FILE = path.join(ROOT_DIR, "data", "raw", "pages-all.json");
const EXTRACTED_CHAPTERS_DIR = path.join(ROOT_DIR, "data", "extracted", "chapters");

export function parseAllChapters(): ChapterExtractionBundle[] {
  if (!fs.existsSync(EXTRACTED_CHAPTERS_DIR)) {
    fs.mkdirSync(EXTRACTED_CHAPTERS_DIR, { recursive: true });
  }

  const rawPages: RawPage[] = JSON.parse(fs.readFileSync(RAW_PAGES_FILE, "utf-8"));
  console.log(`Loaded ${rawPages.length} raw pages.`);

  const builders: Array<(pages: RawPage[]) => ChapterExtractionBundle> = [
    buildChapter1,
    buildChapter2,
    buildChapter3,
    buildChapter4,
    buildChapter5,
    buildChapter6,
    buildChapter7,
    buildChapter8,
    buildChapter9,
    buildChapter10,
    buildChapter11,
    buildChapter12,
    buildChapter13,
    buildChapter14,
    buildChapter15,
    buildChapter16,
    buildChapter17,
    buildChapter18,
    buildChapter19,
    buildChapter20,
    buildChapter21,
    buildChapter22,
    buildChapter23,
    buildChapter24,
    buildChapter25,
    buildChapter26,
    buildChapter27,
  ];

  const bundles: ChapterExtractionBundle[] = [];

  for (let i = 0; i < builders.length; i++) {
    const chNum = i + 1;
    const bundle = builders[i](rawPages);
    bundles.push(bundle);

    const pad = String(chNum).padStart(2, "0");
    const outFile = path.join(EXTRACTED_CHAPTERS_DIR, `chapter-${pad}.json`);
    fs.writeFileSync(outFile, JSON.stringify(bundle, null, 2), "utf-8");
    console.log(
      `✓ Chapter ${chNum}: "${bundle.chapter.title}" -> ${bundle.sections.length} sections, ${bundle.exercises.length} exercises, ${bundle.grammar_rules.length} rules, ${bundle.verbs.length} verbs.`
    );
  }

  console.log(`\nSuccessfully parsed and saved all 27 chapters.`);
  return bundles;
}

if (require.main === module) {
  parseAllChapters();
}
