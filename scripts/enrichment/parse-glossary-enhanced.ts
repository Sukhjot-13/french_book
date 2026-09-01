import fs from "fs";
import path from "path";
import { RawPage } from "../extract-pages";
import { makeVocabId, makeExpressionId, slugify } from "../../src/lib/dataset/ids";
import { cleanPdfText } from "../../src/lib/dataset/normalize";

export interface ParsedGlossaryEntry {
  id: string;
  french: string;
  english: string[];
  english_raw?: string;
  gender?: "masculine" | "feminine" | "common" | null;
  part_of_speech?: string;
  is_expression?: boolean;
  page_printed: number;
  page_pdf: number;
}

// Well-known French multi-word expressions in the glossary
export const KNOWN_GLOSSARY_EXPRESSIONS: Record<string, string> = {
  "à carreaux": "checked",
  "à fleurs": "flowered",
  "à la campagne": "in the country",
  "à la mer": "by the sea",
  "à la montagne": "in the mountains",
  "à la plage": "at the beach",
  "à midi": "at noon",
  "à minuit": "at midnight",
  "à peine": "hardly",
  "à plis": "pleated",
  "à pois": "polka-dotted",
  "à rayures": "striped",
  "à volants": "flounced",
  "accès haut-débit": "high-speed access",
  "actuel(le)": "present, present day",
  "actuellement": "currently",
  "adresse IP": "Internet protocol address",
  "adresse URL": "URL",
  "affaires": "business",
  "agence de voyages": "travel agency",
  "agréable": "pleasant",
  "ainsi": "thus",
  "allemand": "German",
  "aller simple": "one-way ticket",
  "anglais": "English",
  "année dernière": "last year",
  "année prochaine": "next year",
  "appareil photo": "camera",
  "arbre généalogique": "family tree",
  "arc-en-ciel": "rainbow",
  "argent liquide": "cash",
  "arrêt de bus": "bus stop",
  "art contemporain": "contemporary art",
  "article de journal": "newspaper article",
  "ascenseur": "elevator",
  "assurance maladie": "health insurance",
  "au bord de la mer": "at the seaside",
  "au début": "at the beginning",
  "au fait": "by the way",
  "au fond": "at the back, deep down",
  "au lieu de": "instead of",
  "au moins": "at least",
  "au moment où": "at the moment when",
  "au revoir": "good-bye",
  "au secours": "help",
  "aujourd'hui": "today",
  "aussitôt que": "as soon as",
  "autant de": "as much, as many",
  "autoroute": "highway",
  "autoroutes de l'information": "information highways",
  "autrefois": "formerly",
  "avant de": "before",
  "avant-hier": "the day before yesterday",
  "avec plaisir": "with pleasure",
  "avoir ... ans": "to be ... years old",
  "avoir besoin de": "to need to, to need",
  "avoir chaud": "to be warm, hot",
  "avoir de la chance": "to be lucky",
  "avoir des ennuis": "to have trouble",
  "avoir du mal à": "to have a hard time",
  "avoir envie de": "to feel like, to want",
  "avoir faim": "to be hungry",
  "avoir froid": "to be cold",
  "avoir honte": "to be ashamed",
  "avoir l'air de": "to seem, to look like",
  "avoir l'intention de": "to intend to",
  "avoir l'obligation de": "to have an obligation to",
  "avoir l'occasion de": "to have the opportunity to",
  "avoir le cafard": "to have the blues",
  "avoir le temps de": "to have time to",
  "avoir le vertige": "to feel dizzy",
  "avoir lieu": "to take place",
  "avoir mal à la tête": "to have a headache",
  "avoir mal au cœur": "to feel sick, nauseous",
  "avoir mal au dos": "to have a backache",
  "avoir mal au ventre": "to have a stomachache",
  "avoir mal aux dents": "to have a toothache",
  "avoir mal aux yeux": "to have sore eyes",
  "avoir peur de": "to be afraid of",
  "avoir raison": "to be right",
  "avoir soif": "to be thirsty",
  "avoir sommeil": "to be sleepy",
  "avoir tort": "to be wrong",
  "baccalauréat": "high school diploma",
  "bain de soleil": "sunbath",
  "bande dessinée": "comic strip",
  "banlieue": "suburbs",
  "beau temps": "nice weather",
  "beaucoup de": "a lot of, many",
  "bien de la chance": "a lot of luck",
  "bien des choses": "many things",
  "bien entendu": "of course",
  "bien que": "although",
  "bien sûr": "of course",
  "billet aller-retour": "round-trip ticket",
  "boîte aux lettres": "mailbox",
  "boîte de nuit": "nightclub",
  "bon appétit": "enjoy your meal",
  "bon voyage": "have a good trip",
  "bonne chance": "good luck",
  "bonne journée": "have a nice day",
  "bonne nuit": "good night",
  "bonne soirée": "have a good evening",
  "boulevard": "boulevard",
  "bureau de poste": "post office",
  "c'est-à-dire": "that is to say",
  "carte bancaire": "bank card",
  "carte postale": "postcard",
  "centre-ville": "downtown, city center",
  "chambre d'hôtes": "bed and breakfast",
  "chambre double": "double room",
  "chambre individuelle": "single room",
  "champ de bataille": "battlefield",
  "chaque année": "every year",
  "chaque jour": "every day",
  "chaque mois": "every month",
  "chaque semaine": "every week",
  "chef-d'œuvre": "masterpiece",
  "chemin de fer": "railway",
  "chute d'eau": "waterfall",
  "clef USB": "USB drive, flash drive",
  "clin d'œil": "wink",
  "combien de temps": "how long",
  "comme ci, comme ça": "so-so",
  "comme d'habitude": "as usual",
  "comment allez-vous": "how are you",
  "carte d'identité": "identity card",
  "coup de foudre": "love at first sight",
  "coup de téléphone": "phone call",
  "courrier électronique": "e-mail",
  "d'abord": "first of all",
  "d'accord": "all right, agreed",
  "d'ailleurs": "moreover, besides",
  "d'autre part": "on the other hand",
  "d'habitude": "usually",
  "d'un côté": "on the one hand",
  "de bonne heure": "early",
  "de nouveau": "again",
  "de plus en plus": "more and more",
  "de rien": "you're welcome",
  "de temps en temps": "from time to time",
  "déjà-vu": "already seen",
  "demi-heure": "half an hour",
  "depuis combien de temps": "for how long",
  "disque compact": "CD, compact disc",
  "eau minérale": "mineral water",
  "en avance": "early, ahead of time",
  "en bas": "downstairs, below",
  "en ce qui concerne": "as far as ... is concerned",
  "en colère": "angry",
  "en effet": "indeed",
  "en face de": "opposite, across from",
  "en fait": "in fact",
  "en général": "in general",
  "en haut": "upstairs, above",
  "en même temps": "at the same time",
  "en panne": "out of order, broken down",
  "en plein air": "outdoors",
  "en retard": "late",
  "en route": "on the way",
  "en train de": "in the process of, in the middle of",
  "en vacances": "on vacation",
  "en ville": "in town",
  "encore une fois": "once again",
  "face à face": "face to face",
  "faire attention": "to pay attention",
  "faire de l'exercice": "to exercise",
  "faire de la randonnée": "to hike",
  "faire des achats": "to go shopping",
  "faire des courses": "to run errands, to grocery shop",
  "faire du jogging": "to jog",
  "faire du ski": "to ski",
  "faire du sport": "to play sports",
  "faire du vélo": "to bike",
  "faire la connaissance de": "to meet, get to know",
  "faire la cuisine": "to cook",
  "faire la grasse matinée": "to sleep in",
  "faire la queue": "to wait in line",
  "faire la vaisselle": "to do the dishes",
  "faire le ménage": "to do the housework",
  "faire les valises": "to pack bags",
  "faire semblant de": "to pretend to",
  "faire un tour": "to take a walk/drive",
  "faire un voyage": "to take a trip",
  "faire une promenade": "to go for a walk",
  "fournisseur d'accès": "internet service provider",
  "garder le silence": "to keep quiet",
  "gare routière": "bus station",
  "grand magasin": "department store",
  "grâce à": "thanks to",
  "haut-parleur": "loudspeaker",
  "hors d'œuvre": "appetizer",
  "hôtel de ville": "city hall",
  "il fait beau": "the weather is nice",
  "il fait chaud": "it is hot",
  "il fait froid": "it is cold",
  "il fait mauvais": "the weather is bad",
  "il faut": "it is necessary",
  "il s'agit de": "it is about, a matter of",
  "il y a": "there is, there are, ago",
  "jet d'eau": "fountain, water jet",
  "jeu de cartes": "deck of cards",
  "jeu vidéo": "video game",
  "jour de fête": "holiday",
  "jus d'orange": "orange juice",
  "jusqu'à ce que": "until",
  "la plupart de": "most of",
  "laissez-passer": "pass",
  "le long de": "along",
  "machine à écrire": "typewriter",
  "machine à laver": "washing machine",
  "maître d'hôtel": "headwaiter",
  "mal à la tête": "headache",
  "mal au cœur": "nausea",
  "marché aux puces": "flea market",
  "mode d'emploi": "instructions, manual",
  "mot de passe": "password",
  "moyen-courrier": "medium-haul flight",
  "n'est-ce pas": "isn't it, right",
  "n'importe comment": "anyhow, no matter how",
  "n'importe où": "anywhere",
  "n'importe quand": "anytime",
  "n'importe quel": "any",
  "n'importe qui": "anyone",
  "n'importe quoi": "anything",
  "nom de famille": "last name, surname",
  "nouvel an": "New Year",
  "par avion": "by air mail, by plane",
  "par cœur": "by heart",
  "par conséquent": "consequently",
  "par exemple": "for example",
  "par hasard": "by chance",
  "par terre": "on the ground, on the floor",
  "pas du tout": "not at all",
  "passer du temps": "to spend time",
  "passer un examen": "to take an exam",
  "payer par carte": "to pay by card",
  "petit à petit": "little by little",
  "petit déjeuner": "breakfast",
  "peut-être": "perhaps, maybe",
  "pièce d'identité": "ID card",
  "plein de": "full of",
  "point de repère": "landmark",
  "point de vue": "point of view",
  "pomme de terre": "potato",
  "porte-monnaie": "coin purse",
  "poste de télévision": "TV set",
  "prendre l'avion": "to take the plane",
  "prendre le bus": "to take the bus",
  "prendre le train": "to take the train",
  "prendre rendez-vous": "to make an appointment",
  "prendre sa retraite": "to retire",
  "prendre une décision": "to make a decision",
  "près de": "near, close to",
  "prêt-à-porter": "ready-to-wear",
  "raison de plus": "all the more reason",
  "rendre visite à": "to visit (a person)",
  "rez-de-chaussée": "ground floor",
  "rien du tout": "nothing at all",
  "s'il vous plaît": "please",
  "salle à manger": "dining room",
  "salle d'attente": "waiting room",
  "salle de bains": "bathroom",
  "salle de classe": "classroom",
  "sans doute": "no doubt, probably",
  "secrétaire général": "general secretary",
  "site Internet": "website",
  "soit... soit": "either... or",
  "station-service": "gas station",
  "sur-le-champ": "immediately, on the spot",
  "table de chevet": "nightstand",
  "table ronde": "round table",
  "tant mieux": "so much the better",
  "tant pis": "too bad",
  "téléphone portable": "cell phone",
  "temps en temps": "time to time",
  "tire-bouchon": "corkscrew",
  "titre de séjour": "residence permit",
  "tombée de la nuit": "nightfall",
  "tout à coup": "all of a sudden",
  "tout à fait": "completely, exactly",
  "tout à l'heure": "in a little while, earlier",
  "tout d'abord": "first of all",
  "tout de même": "all the same",
  "tout de suite": "immediately, right away",
  "tout de suite après": "right after",
  "tout droit": "straight ahead",
  "tout le monde": "everyone",
  "tout le temps": "all the time",
  "trait d'union": "hyphen",
  "un peu de": "a little bit of",
  "va-et-vient": "coming and going",
  "vers le haut": "upwards",
  "vis-à-vis": "opposite, face-to-face",
  "voiture de sport": "sports car",
  "vol sans escale": "nonstop flight",
  "volontiers": "gladly, with pleasure",
  "week-end": "weekend",
};

export function cleanLigatures(text: string): string {
  return text
    .replace(/\bfi\s+lm\b/gi, "film")
    .replace(/\bfi\s+l\b/gi, "fil")
    .replace(/\bcoff\s+ee\b/gi, "coffee")
    .replace(/\bcoiff\s+ure\b/gi, "coiffure")
    .replace(/\bsouff\s+rir\b/gi, "souffrir")
    .replace(/\bsoft\s+ware\b/gi, "software")
    .replace(/\boff\s+ice\b/gi, "office");
}

export function isInstructionalOrHeader(line: string): boolean {
  const t = line.trim();
  if (/^\d+$/.test(t)) return true;
  if (/^[A-Z]$/.test(t)) return true;
  if (/^(?:French|English)-French glossary/i.test(t)) return true;
  if (/glossary\s+\d+/i.test(t) || /\d+\s+glossary/i.test(t)) return true;
  if (/Regular adjectives in French are listed/i.test(t)) return true;
  if (/Copyright ©/i.test(t)) return true;
  return false;
}

export function normalizeEnglishInfinitive(en: string): string {
  let s = en.trim();
  if (/, to be$/i.test(s)) {
    return "to be " + s.replace(/, to be$/i, "").trim();
  }
  if (/, to be\s*\(([^)]+)\)$/i.test(s)) {
    const m = s.match(/^(.*?),\s*to be\s*\(([^)]+)\)$/i);
    if (m) return `to be ${m[1].trim()} (${m[2].trim()})`;
  }
  if (/, to\s*\(([^)]+)\)$/i.test(s)) {
    const m = s.match(/^(.*?),\s*to\s*\(([^)]+)\)$/i);
    if (m) return `to ${m[1].trim()} (${m[2].trim()})`;
  }
  if (/, to$/i.test(s)) {
    return "to " + s.replace(/, to$/i, "").trim();
  }
  return s;
}

export function parseGlossaryFrEnEnhanced(pages: RawPage[]): ParsedGlossaryEntry[] {
  // Printed 240-249 (PDF 254-263)
  const gPages = pages.filter((p) => (p.printed_page || 0) >= 240 && (p.printed_page || 0) <= 249);
  const entries: ParsedGlossaryEntry[] = [];

  for (const page of gPages) {
    const rawLines = cleanLigatures(page.text).split("\n").map((l) => l.trim()).filter(Boolean);
    let i = 0;

    while (i < rawLines.length) {
      let line = rawLines[i];
      if (isInstructionalOrHeader(line)) {
        i++;
        continue;
      }

      // Check continuation line
      if (i + 1 < rawLines.length) {
        const next = rawLines[i + 1];
        const isNextHeader = isInstructionalOrHeader(next);

        if (!isNextHeader) {
          if (
            /\((?:m\.|f\.|m\.\/f\.|f\.\/m\.|f\.pl\.|m\.pl\.|pl\.|m\.\/f\s*)\)$/.test(line) ||
            line.endsWith(" de") ||
            line.endsWith(" d'") ||
            line.endsWith(" à")
          ) {
            line = line + " " + next;
            i++;
          }
        }
      }

      let gender: "masculine" | "feminine" | "common" | null = null;
      let fr = "";
      let en = "";
      let isExpression = false;

      // 1. Gender mark
      const gMatch = line.match(/\((m\.|f\.|m\.\/f\.|f\.\/m\.|f\.pl\.|m\.pl\.|pl\.|m\.\s*or\s*f\.|m\.\/f\s*)\)/i);
      if (gMatch) {
        const gStr = gMatch[1].toLowerCase();
        if (gStr.startsWith("m./f") || gStr.startsWith("f./m") || gStr.includes("or")) {
          gender = "common";
        } else if (gStr.startsWith("m")) {
          gender = "masculine";
        } else if (gStr.startsWith("f")) {
          gender = "feminine";
        }

        const idx = line.indexOf(gMatch[0]);
        fr = line.slice(0, idx).trim();
        en = line.slice(idx + gMatch[0].length).trim();
      } else if (line.match(/^([a-zA-ZÀ-ÿ\s’'\-]+?\s*\([^)]+\))\s+([a-zA-Z].*)$/)) {
        // Parenthetical variant e.g. "beau (bel, belle) beautiful" or "jouer (à, de) to play" or "nouveau (nouvel, nouvelle) new"
        const m = line.match(/^([a-zA-ZÀ-ÿ\s’'\-]+?\s*\([^)]+\))\s+([a-zA-Z].*)$/);
        fr = m![1].trim();
        en = m![2].trim();
      } else if (line.includes(" to ")) {
        const idx = line.indexOf(" to ");
        fr = line.slice(0, idx).trim();
        en = line.slice(idx + 1).trim();
      } else {
        // Match against known expressions
        let foundKnown = false;
        for (const [kFr, kEn] of Object.entries(KNOWN_GLOSSARY_EXPRESSIONS)) {
          if (line.toLowerCase().startsWith(kFr.toLowerCase() + " ") || line.toLowerCase() === kFr.toLowerCase()) {
            fr = line.slice(0, kFr.length).trim();
            en = line.slice(kFr.length).trim() || kEn;
            foundKnown = true;
            isExpression = true;
            break;
          }
        }

        if (!foundKnown) {
          const tokens = line.split(/\s+/);
          if (tokens.length === 2) {
            fr = tokens[0];
            en = tokens[1];
          } else {
            const m = line.match(/^([a-zA-ZÀ-ÿ’'\-]+)\s+(.+)$/);
            if (m) {
              fr = m[1];
              en = m[2];
            } else {
              fr = line;
              en = "";
            }
          }
        }
      }

      if (fr.includes("(s’)") || fr.includes("(s')")) {
        fr = "s’" + fr.replace(/\(s[’']\)/g, "").trim();
      } else if (fr.includes("(se)")) {
        fr = "se " + fr.replace(/\(se\)/g, "").trim();
      }

      fr = fr.trim().replace(/^[-·]\s*/, "");
      en = en.trim().replace(/^[-·]\s*/, "");

      if (fr && fr.length >= 2) {
        // Determine canonical headword if fr has parenthetical variants e.g. "beau (bel, belle)" -> canonical "beau"
        let canonicalFr = fr;
        if (/^[a-zA-ZÀ-ÿ’'\-]+\s*\([^)]+\)$/.test(fr) && !fr.startsWith("se ") && !fr.startsWith("s’")) {
          canonicalFr = fr.replace(/\s*\([^)]+\)$/, "").trim();
        }

        const englishList = en
          ? en
              .split(/,\s*/)
              .map((s) => s.trim())
              .filter(Boolean)
          : [canonicalFr];

        const isExpr = isExpression || (
          !/^[a-zA-ZÀ-ÿ’'\-]+(?:\s*\([^)]+\))?$/.test(fr) &&
          (canonicalFr.split(/\s+/).length >= 2 || canonicalFr.startsWith("se ") || canonicalFr.startsWith("s’")) &&
          !canonicalFr.includes(",")
        );

        const id = isExpr ? makeExpressionId(canonicalFr) : makeVocabId(canonicalFr);
        entries.push({
          id,
          french: canonicalFr,
          english: englishList,
          gender,
          is_expression: isExpr,
          page_printed: page.printed_page || 240,
          page_pdf: page.pdf_page,
        });
      }

      i++;
    }
  }

  return entries;
}

export function parseGlossaryEnFrEnhanced(pages: RawPage[]): ParsedGlossaryEntry[] {
  // Printed 250-259 (PDF 264-273)
  const gPages = pages.filter((p) => (p.printed_page || 0) >= 250 && (p.printed_page || 0) <= 259);
  const frPages = pages.filter((p) => (p.printed_page || 0) >= 240 && (p.printed_page || 0) <= 249);

  // Build dictionary of known French terms from Fr-En pages & expressions
  const knownFrenchTerms = new Set<string>();
  const knownFrenchMultiwords: string[] = [];

  for (const [kFr] of Object.entries(KNOWN_GLOSSARY_EXPRESSIONS)) {
    knownFrenchTerms.add(kFr.toLowerCase());
    if (kFr.includes(" ")) knownFrenchMultiwords.push(kFr.toLowerCase());
  }

  for (const p of frPages) {
    const lines = cleanLigatures(p.text).split("\n").map((l) => l.trim()).filter(Boolean);
    for (const l of lines) {
      if (isInstructionalOrHeader(l)) continue;
      const gMatch = l.match(/\((?:m\.|f\.|m\.\/f\.|f\.\/m\.|f\.pl\.|m\.pl\.|pl\.|m\.\s*or\s*f\.|m\.\/f\s*)\)/i);
      let frPart = "";
      if (gMatch) {
        frPart = l.slice(0, gMatch.index).trim();
      } else if (l.match(/^([a-zA-ZÀ-ÿ\s’'\-]+?\s*\([^)]+\))\s+([a-zA-Z].*)$/)) {
        const m = l.match(/^([a-zA-ZÀ-ÿ\s’'\-]+?\s*\([^)]+\))\s+([a-zA-Z].*)$/);
        frPart = m![1].trim();
      } else if (l.includes(" to ")) {
        frPart = l.slice(0, l.indexOf(" to ")).trim();
      } else {
        frPart = l.split(/\s+/)[0];
      }
      const clean = frPart.toLowerCase().replace(/\([^)]+\)/g, "").trim();
      if (clean) {
        knownFrenchTerms.add(clean);
        if (clean.includes(" ")) knownFrenchMultiwords.push(clean);
      }
    }
  }

  knownFrenchMultiwords.sort((a, b) => b.length - a.length);

  const entries: ParsedGlossaryEntry[] = [];

  for (const page of gPages) {
    const rawLines = cleanLigatures(page.text).split("\n").map((l) => l.trim()).filter(Boolean);
    let i = 0;

    while (i < rawLines.length) {
      let line = rawLines[i];
      if (isInstructionalOrHeader(line)) {
        i++;
        continue;
      }

      // Check continuation line
      if (i + 1 < rawLines.length) {
        const next = rawLines[i + 1];
        const isNextHeader = isInstructionalOrHeader(next);

        if (!isNextHeader && (line.endsWith(",") || line.endsWith("(") || line.endsWith("to") || next.startsWith("(") || next.startsWith("d’") || next.startsWith("de "))) {
          line = line + " " + next;
          i++;
        }
      }

      let gender: "masculine" | "feminine" | "common" | null = null;
      let enRaw = "";
      let frRaw = "";
      let isExpression = false;

      // 1. Verb pattern: "verb, to [infinitive]" or "verb, to be [infinitive]"
      const vMatch = line.match(/^(.*?(?:,\s*to\s+be\b|,\s*to\s*\([^)]+\)|,\s*to\b|\bto\s+be\b|\bto\b).*?)\s+([a-zA-ZÀ-ÿ’'\-,\s/()]+)$/);
      if (vMatch && (vMatch[1].includes(", to") || vMatch[1].endsWith(" to") || vMatch[1].startsWith("to "))) {
        enRaw = vMatch[1].trim();
        frRaw = vMatch[2].trim();
      } else {
        // 2. Gender tagged noun: "... (m.)", "... (f.)", "... (m./f.)", etc.
        const gMatch = line.match(/\((m\.|f\.|m\.\/f\.|f\.\/m\.|f\.pl\.|m\.pl\.|pl\.|m\.\s*or\s*f\.|m\.\/f\s*)\)$/i);
        if (gMatch) {
          const gStr = gMatch[1].toLowerCase();
          if (gStr.startsWith("m./f") || gStr.startsWith("f./m") || gStr.includes("or")) {
            gender = "common";
          } else if (gStr.startsWith("m")) {
            gender = "masculine";
          } else if (gStr.startsWith("f")) {
            gender = "feminine";
          }

          const before = line.slice(0, gMatch.index).trim();

          // Check known multiwords
          let matchedMulti = false;
          for (const mw of knownFrenchMultiwords) {
            if (before.toLowerCase().endsWith(" " + mw) || before.toLowerCase() === mw) {
              frRaw = before.slice(before.length - mw.length).trim();
              enRaw = before.slice(0, before.length - mw.length).trim();
              matchedMulti = true;
              break;
            }
          }

          if (!matchedMulti) {
            // Check if before has English parens like `word (...) french`:
            // e.g. "star (film) vedette", "craftsman (-woman) artisan(e)", "fine (penalty) amende", "pounds (English currency, weight) livres"
            const parenMatch = before.match(/^(.*?\([^)]+\))\s+([a-zA-ZÀ-ÿ’'\-,\s/()]+)$/);
            if (parenMatch && (parenMatch[1].includes("-woman") || !parenMatch[2].includes("(") || parenMatch[2].includes("artisan("))) {
              enRaw = parenMatch[1].trim();
              frRaw = parenMatch[2].trim();
            } else if (before.includes(", ")) {
              const tokens = before.split(/\s+/);
              let splitIdx = -1;
              for (let t = 1; t < tokens.length; t++) {
                const firstWord = tokens[t].toLowerCase().replace(/,/g, "");
                if (knownFrenchTerms.has(firstWord)) {
                  splitIdx = t;
                  break;
                }
              }
              if (splitIdx !== -1) {
                enRaw = tokens.slice(0, splitIdx).join(" ");
                frRaw = tokens.slice(splitIdx).join(" ");
              } else {
                const half = Math.floor(tokens.length / 2);
                enRaw = tokens.slice(0, half).join(" ");
                frRaw = tokens.slice(half).join(" ");
              }
            } else {
              const tokens = before.split(/\s+/);
              if (tokens.length === 2) {
                enRaw = tokens[0];
                frRaw = tokens[1];
              } else {
                let splitIdx = -1;
                for (let t = 1; t < tokens.length; t++) {
                  const firstWord = tokens[t].toLowerCase().replace(/,/g, "");
                  if (knownFrenchTerms.has(firstWord)) {
                    splitIdx = t;
                    break;
                  }
                }
                if (splitIdx !== -1) {
                  enRaw = tokens.slice(0, splitIdx).join(" ");
                  frRaw = tokens.slice(splitIdx).join(" ");
                } else {
                  const half = Math.floor(tokens.length / 2);
                  enRaw = tokens.slice(0, half).join(" ");
                  frRaw = tokens.slice(half).join(" ");
                }
              }
            }
          }
        } else {
          // 3. Other expressions / adjectives / adverbs
          let foundKnown = false;
          for (const mw of knownFrenchMultiwords) {
            if (line.toLowerCase().endsWith(" " + mw) || line.toLowerCase() === mw) {
              frRaw = line.slice(line.length - mw.length).trim();
              enRaw = line.slice(0, line.length - mw.length).trim();
              foundKnown = true;
              isExpression = true;
              break;
            }
          }

          if (!foundKnown) {
            const tokens = line.split(/\s+/);
            if (tokens.length === 2) {
              enRaw = tokens[0];
              frRaw = tokens[1];
            } else {
              let splitIdx = -1;
              for (let t = 1; t < tokens.length; t++) {
                const word = tokens[t].toLowerCase().replace(/,/g, "");
                if (knownFrenchTerms.has(word)) {
                  splitIdx = t;
                  break;
                }
              }
              if (splitIdx !== -1) {
                enRaw = tokens.slice(0, splitIdx).join(" ");
                frRaw = tokens.slice(splitIdx).join(" ");
              } else {
                const half = Math.floor(tokens.length / 2);
                enRaw = tokens.slice(0, half).join(" ");
                frRaw = tokens.slice(half).join(" ");
              }
            }
          }
        }
      }

      // Clean French term
      let cleanFr = frRaw.trim().replace(/^[-·]\s*/, "");
      if (cleanFr.includes("(s’)") || cleanFr.includes("(s')")) {
        cleanFr = "s’" + cleanFr.replace(/\(s[’']\)/g, "").trim();
      } else if (cleanFr.includes("(se)")) {
        cleanFr = "se " + cleanFr.replace(/\(se\)/g, "").trim();
      }

      // Clean English term & normalize infinitive
      let cleanEn = enRaw.trim().replace(/^[-·]\s*/, "");
      let enDisplay = normalizeEnglishInfinitive(cleanEn);

      if (cleanFr && cleanFr.length >= 2) {
        // Determine canonical headword if fr is comma list of adjectives/gender variants like "beau, bel, belle" -> canonical "beau"
        let canonicalFr = cleanFr;
        if (cleanFr.includes(", ")) {
          const parts = cleanFr.split(", ");
          // If parts are variants of same word (e.g. "beau, bel, belle" or "acteur, actrice" or "créatif, créative" or "meurtrier, meurtrière")
          if (parts.length >= 2 && !cleanFr.startsWith("se ") && !cleanFr.startsWith("s’")) {
            canonicalFr = parts[0].trim();
          }
        }

        const enList = [enDisplay];

        const isExpr = isExpression || (
          canonicalFr.split(/\s+/).length >= 2 &&
          (canonicalFr.startsWith("se ") || canonicalFr.startsWith("s’") || KNOWN_GLOSSARY_EXPRESSIONS[canonicalFr] !== undefined)
        );

        const id = isExpr ? makeExpressionId(canonicalFr) : makeVocabId(canonicalFr);

        entries.push({
          id,
          french: canonicalFr,
          english: enList,
          english_raw: cleanEn,
          gender,
          is_expression: isExpr,
          page_printed: page.printed_page || 250,
          page_pdf: page.pdf_page,
        });
      }

      i++;
    }
  }

  return entries;
}
