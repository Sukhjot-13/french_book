/**
 * Normalization utilities for French text and search
 */
import { stripAccents } from "./ids";

export function normalizeFrenchText(text: string): string {
  if (!text) return "";
  return text
    .replace(/[’`´]/g, "'")
    .replace(/[“”]/g, '"')
    .replace(/\r\n/g, "\n")
    .replace(/\t/g, " ")
    .replace(/ +/g, " ")
    .trim();
}

export function searchNormalize(text: string): string {
  if (!text) return "";
  return stripAccents(text)
    .toLowerCase()
    .replace(/['’`´]/g, "")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

export function cleanPdfText(raw: string): string {
  if (!raw) return "";
  return raw
    .replace(/\r\n/g, "\n")
    .replace(/\r/g, "\n")
    .replace(/\f/g, "\n")
    .replace(/­\n/g, "") // soft hyphen
    .replace(/-\n/g, "") // hyphenation across lines
    .replace(/\u00A0/g, " ") // non-breaking space
    .replace(/[ \t]+/g, " ")
    .trim();
}
