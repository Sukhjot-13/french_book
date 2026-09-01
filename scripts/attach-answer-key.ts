import fs from "fs";
import path from "path";
import { ChapterExtractionBundle } from "./chapter-types";

const ROOT_DIR = path.resolve(__dirname, "..");
const NORMALIZED_DIR = path.join(ROOT_DIR, "data", "normalized", "chapters");
const ANSWER_KEY_FILE = path.join(ROOT_DIR, "data", "extracted", "backmatter", "answer-key.json");

export function attachAnswerKey(): { matched: number; unmatched: number } {
  if (!fs.existsSync(ANSWER_KEY_FILE)) {
    console.error("Answer key file not found:", ANSWER_KEY_FILE);
    return { matched: 0, unmatched: 0 };
  }

  const rawKey: any = JSON.parse(fs.readFileSync(ANSWER_KEY_FILE, "utf-8"));
  const ansMap = new Map<string, Map<number, string>>();

  if (rawKey.chapters && typeof rawKey.chapters === "object" && !Array.isArray(rawKey.chapters)) {
    for (const [chNum, exObj] of Object.entries(rawKey.chapters as Record<string, any>)) {
      for (const [exCode, items] of Object.entries(exObj as Record<string, any[]>)) {
        const normCode = exCode.replace(/[-·]/g, ".");
        const itemMap = new Map<number, string>();
        if (Array.isArray(items)) {
          for (const it of items) {
            const qNum = it.question_number || it.item_number;
            if (qNum && it.answer_text) {
              itemMap.set(qNum, it.answer_text);
            }
          }
        }
        ansMap.set(normCode, itemMap);
      }
    }
  } else if (Array.isArray(rawKey)) {
    for (const ch of rawKey) {
      for (const ex of ch.exercises || []) {
        const normCode = (ex.exercise_code || "").replace(/[-·]/g, ".");
        const itemMap = new Map<number, string>();
        for (const it of ex.items || []) {
          const qNum = it.item_number || it.question_number;
          if (qNum && it.answer_text) {
            itemMap.set(qNum, it.answer_text);
          }
        }
        ansMap.set(normCode, itemMap);
      }
    }
  }

  let matched = 0;
  let unmatched = 0;

  const files = fs.readdirSync(NORMALIZED_DIR).filter((f) => f.startsWith("chapter-") && f.endsWith(".json"));

  for (const file of files) {
    const filePath = path.join(NORMALIZED_DIR, file);
    const bundle: ChapterExtractionBundle = JSON.parse(fs.readFileSync(filePath, "utf-8"));

    for (const ex of bundle.exercises) {
      // Find matching answers by exercise code (e.g. "1.1" or "1·1" or ex.exercise_number)
      let code = (ex.exercise_number || "").replace(/[-·]/g, ".");
      if (!code) {
        const m = ex.id.match(/exercise_\d+_(\d+)_(\d+)/) || ex.id.match(/ex_(\d+)_(\d+)/);
        if (m) {
          code = `${parseInt(m[1], 10)}.${parseInt(m[2], 10)}`;
        }
      }

      const exerciseAns = ansMap.get(code);

      for (let idx = 0; idx < ex.questions.length; idx++) {
        const q: any = ex.questions[idx];
        const qNum = idx + 1;
        const itemAns = exerciseAns?.get(qNum);

        if (itemAns) {
          q.answer = itemAns;
          q.expected_answer = itemAns;
          matched++;
        } else {
          if (!q.answer) {
            unmatched++;
          }
        }
      }
    }

    fs.writeFileSync(filePath, JSON.stringify(bundle, null, 2), "utf-8");
  }

  console.log(`Attached answer keys: ${matched} matched, ${unmatched} unmatched.`);
  return { matched, unmatched };
}

if (require.main === module) {
  attachAnswerKey();
}
