import { Exercise, ExerciseQuestion } from "../../src/lib/dataset/schemas";
import { makeVerbId, makeRuleId, makeVocabId, makeExpressionId } from "../../src/lib/dataset/ids";

// Common verbs lookup map for fast recognition in French sentences
const COMMON_VERBS = [
  "être", "avoir", "aller", "faire", "venir", "prendre", "mettre", "voir", "dire", "lire", "écrire",
  "pouvoir", "vouloir", "devoir", "savoir", "falloir", "parler", "manger", "aimer", "finir", "choisir",
  "vendre", "attendre", "partir", "sortir", "dormir", "servir", "arriver", "entrer", "monter", "descendre",
  "rester", "tomber", "retourner", "mourir", "naître", "commencer", "acheter", "appeler", "payer",
  "préférer", "espérer", "répéter", "envoyer", "nettoyer", "se lever", "se coucher", "se dépêcher",
  "se souvenir", "s'amuser", "comprendre", "apprendre", "boire", "croire", "craindre", "connaître",
  "conduire", "recevoir", "vivre", "suivre", "ouvrir", "offrir", "plaire", "rire", "courir"
];

export function enrichExerciseRelations(exercises: Exercise[]): Exercise[] {
  for (const ex of exercises) {
    for (const q of ex.questions) {
      if (!q.relations) {
        q.relations = {
          verbs: [],
          expressions: [],
          grammar_rules: [],
          tenses: [],
          vocabulary: [],
        };
      }

      const text = `${q.prompt} ${q.answer || ""}`.toLowerCase();
      const detectedVerbs = new Set<string>(q.relations.verbs || []);
      const detectedExpressions = new Set<string>(q.relations.expressions || []);

      // Check common verbs
      for (const v of COMMON_VERBS) {
        // match infinitive or common stems
        const stem = v.slice(0, Math.max(3, v.length - 2));
        if (text.includes(v) || (stem.length >= 3 && text.includes(stem))) {
          detectedVerbs.add(makeVerbId(v));
        }
      }

      // Check expressions
      if (text.includes("en train de")) detectedExpressions.add(makeExpressionId("être en train de + infinitif"));
      if (text.includes("il y a")) detectedExpressions.add(makeExpressionId("il y a"));
      if (text.includes("il s'agit")) detectedExpressions.add(makeExpressionId("il s'agit de"));
      if (text.includes("besoin de")) detectedExpressions.add(makeExpressionId("avoir besoin de"));
      if (text.includes("envie de")) detectedExpressions.add(makeExpressionId("avoir envie de"));
      if (text.includes("peur de")) detectedExpressions.add(makeExpressionId("avoir peur de"));
      if (text.includes("attention")) detectedExpressions.add(makeExpressionId("faire attention à"));
      if (text.includes("cuisine")) detectedExpressions.add(makeExpressionId("faire la cuisine"));
      if (text.includes("dépêch")) detectedExpressions.add(makeExpressionId("se dépêcher de + infinitif"));
      if (text.includes("souvien") || text.includes("souvenir")) detectedExpressions.add(makeExpressionId("se souvenir de"));

      q.relations.verbs = Array.from(detectedVerbs);
      q.relations.expressions = Array.from(detectedExpressions);
    }
  }

  return exercises;
}
