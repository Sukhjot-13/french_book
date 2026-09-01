import fs from "fs";
import path from "path";
import { SuperDatasetRoot, SuperDatasetRootSchema } from "./schemas";

export function loadSuperDataset(filePath?: string): SuperDatasetRoot {
  const defaultPath = path.resolve(process.cwd(), "data/final/french_grammar.json");
  const target = filePath ? path.resolve(process.cwd(), filePath) : defaultPath;

  if (!fs.existsSync(target)) {
    throw new Error(`Dataset file not found at ${target}`);
  }

  const raw = fs.readFileSync(target, "utf-8");
  const parsed = JSON.parse(raw);
  return SuperDatasetRootSchema.parse(parsed);
}
