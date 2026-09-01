import fs from "fs";
import path from "path";
import { RawPage } from "../extract-pages";
import { makeVocabId, makeExpressionId, slugify } from "../../src/lib/dataset/ids";
import { cleanPdfText } from "../../src/lib/dataset/normalize";

export interface ParsedGlossaryEntry {
  id: string;
  french: string;
  english: string[];
  gender?: "masculine" | "feminine" | "common" | null;
  part_of_speech?: string;
  is_expression?: boolean;
  page_printed: number;
  page_pdf: number;
}

// Well-known French multi-word expressions in the glossary
const KNOWN_GLOSSARY_EXPRESSIONS: Record<string, string> = {
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

export function parseGlossaryFrEnEnhanced(pages: RawPage[]): ParsedGlossaryEntry[] {
  // Printed 240-249 (PDF 254-263)
  const gPages = pages.filter((p) => (p.printed_page || 0) >= 240 && (p.printed_page || 0) <= 249);
  const entries: ParsedGlossaryEntry[] = [];

  for (const page of gPages) {
    const rawLines = page.text.split("\n").map((l) => l.trim()).filter(Boolean);
    let i = 0;

    while (i < rawLines.length) {
      let line = rawLines[i];
      if (
        /^\d+$/.test(line) ||
        /^[A-Z]$/.test(line) ||
        /^French-English glossary/i.test(line) ||
        /French-English glossary\s+\d+/i.test(line) ||
        /\d+\s+French-English glossary/i.test(line)
      ) {
        i++;
        continue;
      }

      // Check continuation line
      if (i + 1 < rawLines.length) {
        const next = rawLines[i + 1];
        const isNextHeader =
          /^\d+$/.test(next) ||
          /^[A-Z]$/.test(next) ||
          /^French-English glossary/i.test(next) ||
          next.includes("(m.)") ||
          next.includes("(f.)") ||
          next.includes("(m./f.)");

        if (!isNextHeader) {
          // If current line ends with a parenthetical or has no obvious english
          if (
            /\((?:m\.|f\.|m\.\/f\.|f\.\/m\.|f\.pl\.|m\.pl\.|pl\.)\)$/.test(line) ||
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

      // Check for gender mark
      const gMatch = line.match(/\((m\.|f\.|m\.\/f\.|f\.\/m\.|f\.pl\.|m\.pl\.|pl\.|m\. or f\.)\)/i);
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
      } else if (line.includes(" to ")) {
        const idx = line.indexOf(" to ");
        fr = line.slice(0, idx).trim();
        en = line.slice(idx + 1).trim();
      } else {
        // Match against known expressions first
        let foundKnown = false;
        for (const [kFr, kEn] of Object.entries(KNOWN_GLOSSARY_EXPRESSIONS)) {
          if (line.toLowerCase().startsWith(kFr.toLowerCase())) {
            fr = line.slice(0, kFr.length).trim();
            en = line.slice(kFr.length).trim() || kEn;
            foundKnown = true;
            isExpression = true;
            break;
          }
        }

        if (!foundKnown) {
          // General split on transition
          // e.g. "accès haut-débit high-speed access" or "acide sour, acid"
          const tokens = line.split(/\s+/);
          if (tokens.length === 2) {
            fr = tokens[0];
            en = tokens[1];
          } else {
            // Check if there are English words
            const match = line.match(/^([a-zA-ZÀ-ÿ’'\-,\s/()]+?)\s{1,3}([a-z].*)$/);
            if (match) {
              fr = match[1].trim();
              en = match[2].trim();
            } else {
              fr = line;
              en = "";
            }
          }
        }
      }

      // Clean reflexive verbs e.g. "abonner à (s’)" -> "s’abonner à"
      if (fr.includes("(s’)") || fr.includes("(s')")) {
        fr = "s’" + fr.replace(/\(s[’']\)/g, "").trim();
      } else if (fr.includes("(se)")) {
        fr = "se " + fr.replace(/\(se\)/g, "").trim();
      }

      fr = fr.trim().replace(/^[-·]\s*/, "");
      en = en.trim().replace(/^[-·]\s*/, "");

      if (fr && fr.length >= 2) {
        const englishList = en
          ? en
              .split(/,\s*/)
              .map((s) => s.trim())
              .filter(Boolean)
          : [fr];

        const id = makeVocabId(fr);
        entries.push({
          id,
          french: fr,
          english: englishList,
          gender,
          is_expression: isExpression || fr.split(/\s+/).length >= 2 || fr.startsWith("se ") || fr.startsWith("s’"),
          page_printed: page.printed_page || 240,
          page_pdf: page.pdf_page,
        });
      }

      i++;
    }
  }

  return entries;
}
