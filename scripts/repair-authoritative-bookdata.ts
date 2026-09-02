import fs from "fs";
import path from "path";

interface MutationRecord {
  file: string;
  exercise_code: string;
  exercise_id: string;
  question_number: number;
  prompt: string;
  page_printed: number;
  page_pdf: number;
  reason: string;
}

export function repairAuthoritativeBookdata() {
  const root = process.cwd();
  const bookdataDir = path.join(root, "bookdata/json");
  const manifestPath = path.join(root, "data/reconciliation/authoritative-source-repair-manifest.json");

  const mutations: MutationRecord[] = [];

  // 1. Repair bookdata/json/9.json (Exercise 9·7 questions 6 to 10)
  const ch9Path = path.join(bookdataDir, "9.json");
  const ch9Data = JSON.parse(fs.readFileSync(ch9Path, "utf-8"));
  const ch9ExBefore = ch9Data.exercises.length;
  let ch9QBefore = 0;
  for (const ex of ch9Data.exercises) ch9QBefore += ex.questions?.length || 0;

  const ex97 = ch9Data.exercises.find((e: any) => e.exercise_code === "9·7");
  if (!ex97) {
    throw new Error("Exercise 9·7 not found in 9.json");
  }

  const missing97Prompts = [
    { num: 6, prompt: "We’ll walk along the beach." },
    { num: 7, prompt: "He’ll study French when he is in Bordeaux." },
    { num: 8, prompt: "They’ll see the Picasso exhibition when they are in Paris." },
    { num: 9, prompt: "She’ll travel to Asia when she gets her degree." },
    { num: 10, prompt: "He’ll become a doctor." },
  ];

  for (const item of missing97Prompts) {
    const existing = ex97.questions.find((q: any) => q.number === item.num);
    if (!existing) {
      const qObj = {
        id: `question_ch09_9_7_${item.num}`,
        number: item.num,
        prompt: item.prompt,
        answer: null,
        open_ended: true,
        answer_sources: [],
        verb_ids: [],
        expression_ids: [],
        vocabulary_ids: [],
        rule_ids: ["rule_futur_simple_usage_future"],
        tense_ids: ["tense_futur_simple"],
        concept_ids: ["concept_futur_simple"],
        attestations: [
          {
            chapter_number: 9,
            section_id: "section_ch09_futur_anterieur",
            section_title: "The futur antérieur",
            page_printed: 79,
            page_pdf: 93,
            context_type: "exercise",
            exercise_id: "exercise_ch09_9_7",
            question_number: item.num,
            source_text: `${item.num}. ${item.prompt}`,
          },
        ],
      };
      ex97.questions.push(qObj);
      mutations.push({
        file: "bookdata/json/9.json",
        exercise_code: "9·7",
        exercise_id: ex97.id,
        question_number: item.num,
        prompt: item.prompt,
        page_printed: 79,
        page_pdf: 93,
        reason: "Omitted during initial extraction of 9.json (page 79 / PDF page 93). Restored from textbook source.",
      });
    }
  }

  let ch9QAfter = 0;
  for (const ex of ch9Data.exercises) ch9QAfter += ex.questions?.length || 0;

  // 2. Repair bookdata/json/21.json (Exercise 21·1 questions 3 to 10, and Exercises 21·2 through 21·12)
  const ch21Path = path.join(bookdataDir, "21.json");
  const ch21Data = JSON.parse(fs.readFileSync(ch21Path, "utf-8"));
  const ch21ExBefore = ch21Data.exercises.length;
  let ch21QBefore = 0;
  for (const ex of ch21Data.exercises) ch21QBefore += ex.questions?.length || 0;

  const ex211 = ch21Data.exercises.find((e: any) => e.exercise_code === "21·1");
  if (!ex211) {
    throw new Error("Exercise 21·1 not found in 21.json");
  }

  const missing211Prompts = [
    { num: 3, prompt: "Nous soutenons votre projet.", pagePrinted: 169, pagePdf: 183 },
    { num: 4, prompt: "Ils construisent la maison de leurs rêves.", pagePrinted: 169, pagePdf: 183 },
    { num: 5, prompt: "J’ouvre la porte.", pagePrinted: 169, pagePdf: 183 },
    { num: 6, prompt: "Elle conduit la voiture de son père.", pagePrinted: 169, pagePdf: 183 },
    { num: 7, prompt: "Il accepte les résultats.", pagePrinted: 169, pagePdf: 183 },
    { num: 8, prompt: "Nous comprenons leur décision.", pagePrinted: 170, pagePdf: 184 },
    { num: 9, prompt: "Tu visites le château de Fontainebleau.", pagePrinted: 170, pagePdf: 184 },
    { num: 10, prompt: "Elle étudie sa leçon.", pagePrinted: 170, pagePdf: 184 },
  ];

  for (const item of missing211Prompts) {
    const existing = ex211.questions.find((q: any) => q.number === item.num);
    if (!existing) {
      ex211.questions.push({
        id: `question_ch21_1_${item.num}`,
        number: item.num,
        prompt: item.prompt,
        answer: null,
        open_ended: false,
        answer_sources: [],
        verb_ids: [],
        expression_ids: [],
        vocabulary_ids: [],
        rule_ids: ["rule_direct_object_pronouns_forms"],
        tense_ids: [],
        concept_ids: ["concept_direct_object_pronoun"],
        attestations: [
          {
            chapter_number: 21,
            section_id: "section_ch21_direct_object_pronouns",
            section_title: "Direct object pronouns",
            page_printed: item.pagePrinted,
            page_pdf: item.pagePdf,
            context_type: "exercise",
            exercise_id: "exercise_ch21_1",
            question_number: item.num,
            source_text: `${item.num}. ${item.prompt}`,
          },
        ],
      });
      mutations.push({
        file: "bookdata/json/21.json",
        exercise_code: "21·1",
        exercise_id: ex211.id,
        question_number: item.num,
        prompt: item.prompt,
        page_printed: item.pagePrinted,
        page_pdf: item.pagePdf,
        reason: "Omitted during initial extraction of 21.json. Restored from textbook source (printed pp. 169-170 / PDF pp. 183-184).",
      });
    }
  }

  // Definition of exercises 21·2 to 21·12 from textbook PDF
  interface ExDef {
    code: string;
    id: string;
    instructions: string;
    exercise_type: string;
    section_id: string;
    section_title: string;
    page_printed: number;
    page_pdf: number;
    rule_ids: string[];
    concept_ids: string[];
    questions: { num: number; prompt: string; pagePrinted: number; pagePdf: number }[];
  }

  const missingExercises: ExDef[] = [
    {
      code: "21·2",
      id: "exercise_ch21_2",
      instructions: "Traduire les phrases suivantes en utilisant vous et l’inversion si nécessaire.",
      exercise_type: "translation",
      section_id: "section_ch21_direct_object_pronouns",
      section_title: "Direct object pronouns",
      page_printed: 170,
      page_pdf: 184,
      rule_ids: ["rule_direct_object_pronouns_forms"],
      concept_ids: ["concept_direct_object_pronoun"],
      questions: [
        { num: 1, prompt: "He thanks me.", pagePrinted: 170, pagePdf: 184 },
        { num: 2, prompt: "The writer sends them.", pagePrinted: 170, pagePdf: 184 },
        { num: 3, prompt: "They invite us.", pagePrinted: 170, pagePdf: 184 },
        { num: 4, prompt: "We accept it.", pagePrinted: 170, pagePdf: 184 },
        { num: 5, prompt: "She called them.", pagePrinted: 170, pagePdf: 184 },
        { num: 6, prompt: "Bring them!", pagePrinted: 170, pagePdf: 184 },
        { num: 7, prompt: "I am going to buy it.", pagePrinted: 170, pagePdf: 184 },
        { num: 8, prompt: "Do not sell it!", pagePrinted: 170, pagePdf: 184 },
        { num: 9, prompt: "We must see it.", pagePrinted: 170, pagePdf: 184 },
        { num: 10, prompt: "Do you know her?", pagePrinted: 170, pagePdf: 184 },
      ],
    },
    {
      code: "21·3",
      id: "exercise_ch21_3",
      instructions: "Remplacer les mots en caractères gras par un pronom objet indirect.",
      exercise_type: "transformation",
      section_id: "section_ch21_indirect_object_pronouns",
      section_title: "Indirect object pronouns",
      page_printed: 171,
      page_pdf: 185,
      rule_ids: ["rule_indirect_object_pronouns_forms"],
      concept_ids: ["concept_indirect_object_pronoun"],
      questions: [
        { num: 1, prompt: "La grand-mère a raconté une histoire aux petits-enfants.", pagePrinted: 171, pagePdf: 185 },
        { num: 2, prompt: "Nous avons fait un cadeau à Marie.", pagePrinted: 171, pagePdf: 185 },
        { num: 3, prompt: "Je ferai parvenir le dossier à Jean dès que possible.", pagePrinted: 172, pagePdf: 186 },
        { num: 4, prompt: "Nous enverrons des fleurs à notre collègue.", pagePrinted: 172, pagePdf: 186 },
        { num: 5, prompt: "Ce théâtre appartient à un ancien comédien.", pagePrinted: 172, pagePdf: 186 },
        { num: 6, prompt: "Est-ce que tu as écrit au rédacteur en chef?", pagePrinted: 172, pagePdf: 186 },
        { num: 7, prompt: "Téléphonez à Louise aussitôt que possible!", pagePrinted: 172, pagePdf: 186 },
        { num: 8, prompt: "Ne mentionnez rien à Odile!", pagePrinted: 172, pagePdf: 186 },
        { num: 9, prompt: "Il annoncera sa décision à ses employés demain.", pagePrinted: 172, pagePdf: 186 },
        { num: 10, prompt: "Il donnera le scénario aux acteurs en fin de journée.", pagePrinted: 172, pagePdf: 186 },
      ],
    },
    {
      code: "21·4",
      id: "exercise_ch21_4",
      instructions: "Traduire les phrases suivantes en utilisant tu et l’inversion si nécessaire.",
      exercise_type: "translation",
      section_id: "section_ch21_indirect_object_pronouns",
      section_title: "Indirect object pronouns",
      page_printed: 172,
      page_pdf: 186,
      rule_ids: ["rule_indirect_object_pronouns_forms"],
      concept_ids: ["concept_indirect_object_pronoun"],
      questions: [
        { num: 1, prompt: "Bring me a book!", pagePrinted: 172, pagePdf: 186 },
        { num: 2, prompt: "Do not call them after eight P.M.!", pagePrinted: 172, pagePdf: 186 },
        { num: 3, prompt: "Send us your new play!", pagePrinted: 172, pagePdf: 186 },
        { num: 4, prompt: "I will write him a letter.", pagePrinted: 172, pagePdf: 186 },
        { num: 5, prompt: "She’ll give me an answer on Monday.", pagePrinted: 172, pagePdf: 186 },
        { num: 6, prompt: "He did not return the books to me.", pagePrinted: 172, pagePdf: 186 },
        { num: 7, prompt: "This pen belongs to her.", pagePrinted: 173, pagePdf: 187 },
        { num: 8, prompt: "He does not talk to us.", pagePrinted: 173, pagePdf: 187 },
        { num: 9, prompt: "They told us a good story.", pagePrinted: 173, pagePdf: 187 },
        { num: 10, prompt: "They’ll lend you their house for the weekend.", pagePrinted: 173, pagePdf: 187 },
      ],
    },
    {
      code: "21·5",
      id: "exercise_ch21_5",
      instructions: "Remplacer les éléments en caractères gras par y.",
      exercise_type: "transformation",
      section_id: "section_ch21_y",
      section_title: "The pronoun y",
      page_printed: 173,
      page_pdf: 187,
      rule_ids: ["rule_y"],
      concept_ids: ["concept_y"],
      questions: [
        { num: 1, prompt: "Elle s’habitue à tout.", pagePrinted: 173, pagePdf: 187 },
        { num: 2, prompt: "Tu devrais prêter attention à ce qu’il dit.", pagePrinted: 173, pagePdf: 187 },
        { num: 3, prompt: "Nous nous intéressons à son œuvre.", pagePrinted: 174, pagePdf: 188 },
        { num: 4, prompt: "Je m’abonne à ce magazine.", pagePrinted: 174, pagePdf: 188 },
        { num: 5, prompt: "Elle tient à ses bijoux.", pagePrinted: 174, pagePdf: 188 },
        { num: 6, prompt: "Nous ne croyons pas à cette nouvelle théorie scientifique.", pagePrinted: 174, pagePdf: 188 },
        { num: 7, prompt: "Il ne pense jamais aux conséquences de ses actes.", pagePrinted: 174, pagePdf: 188 },
        { num: 8, prompt: "Ils n’obéissent pas à la loi.", pagePrinted: 174, pagePdf: 188 },
        { num: 9, prompt: "Elle réfléchira au rôle que vous lui proposez.", pagePrinted: 174, pagePdf: 188 },
        { num: 10, prompt: "Pourquoi n’avez-vous jamais répondu à notre demande?", pagePrinted: 174, pagePdf: 188 },
      ],
    },
    {
      code: "21·6",
      id: "exercise_ch21_6",
      instructions: "Remplacer les éléments en caractères gras par le pronom en.",
      exercise_type: "transformation",
      section_id: "section_ch21_en",
      section_title: "The pronoun en",
      page_printed: 174,
      page_pdf: 188,
      rule_ids: ["rule_en"],
      concept_ids: ["concept_en"],
      questions: [
        { num: 1, prompt: "Tu as beaucoup de romans.", pagePrinted: 174, pagePdf: 188 },
        { num: 2, prompt: "Nous nous servons de cette clé pour ouvrir la porte d’entrée.", pagePrinted: 174, pagePdf: 188 },
        { num: 3, prompt: "Elle s’occupe de sa voiture.", pagePrinted: 175, pagePdf: 189 },
        { num: 4, prompt: "Vous avez besoin d’argent.", pagePrinted: 175, pagePdf: 189 },
        { num: 5, prompt: "Elles achètent des robes.", pagePrinted: 175, pagePdf: 189 },
        { num: 6, prompt: "Je ne parle pas de mon passé.", pagePrinted: 175, pagePdf: 189 },
        { num: 7, prompt: "Est-ce qu’il a des enfants?", pagePrinted: 175, pagePdf: 189 },
        { num: 8, prompt: "Nous rapportons des souvenirs de nos voyages.", pagePrinted: 175, pagePdf: 189 },
        { num: 9, prompt: "Profite de ton week-end!", pagePrinted: 175, pagePdf: 189 },
        { num: 10, prompt: "Avez-vous faim? —Oui, j’ai faim.", pagePrinted: 175, pagePdf: 189 },
        { num: 11, prompt: "Avez-vous sommeil? —Oui, j’ai sommeil.", pagePrinted: 175, pagePdf: 189 },
        { num: 12, prompt: "Avez-vous chaud? —Oui, j’ai chaud.", pagePrinted: 175, pagePdf: 189 },
        { num: 13, prompt: "Avez-vous froid? —Oui, j’ai froid.", pagePrinted: 175, pagePdf: 189 },
        { num: 14, prompt: "Avez-vous peur? —Oui, j’ai peur.", pagePrinted: 175, pagePdf: 189 },
        { num: 15, prompt: "Avez-vous honte? —Oui, j’ai honte.", pagePrinted: 175, pagePdf: 189 },
        { num: 16, prompt: "Avez-vous soif? —Oui, j’ai soif.", pagePrinted: 175, pagePdf: 189 },
      ],
    },
    {
      code: "21·7",
      id: "exercise_ch21_7",
      instructions: "Traduire en utilisant les pronoms compléments d’objet direct, d’objet indirect, y ou en.",
      exercise_type: "translation",
      section_id: "section_ch21_en",
      section_title: "The pronoun en",
      page_printed: 175,
      page_pdf: 189,
      rule_ids: ["rule_en", "rule_y"],
      concept_ids: ["concept_en", "concept_y"],
      questions: [
        { num: 1, prompt: "Are you thinking about the vacation? —Yes, I am thinking about it.", pagePrinted: 175, pagePdf: 189 },
        { num: 2, prompt: "We are interested in it.", pagePrinted: 175, pagePdf: 189 },
        { num: 3, prompt: "Don’t touch it! (tu)", pagePrinted: 175, pagePdf: 189 },
        { num: 4, prompt: "They are proud of it.", pagePrinted: 175, pagePdf: 189 },
        { num: 5, prompt: "I need some.", pagePrinted: 175, pagePdf: 189 },
        { num: 6, prompt: "Do you have any? (tu)", pagePrinted: 175, pagePdf: 189 },
        { num: 7, prompt: "You should not be afraid of it. (vous)", pagePrinted: 175, pagePdf: 189 },
        { num: 8, prompt: "There are two of them.", pagePrinted: 175, pagePdf: 189 },
        { num: 9, prompt: "We have some.", pagePrinted: 175, pagePdf: 189 },
        { num: 10, prompt: "He is talking about it.", pagePrinted: 175, pagePdf: 189 },
        { num: 11, prompt: "He answered it (the letter).", pagePrinted: 175, pagePdf: 189 },
        { num: 12, prompt: "She obeys him.", pagePrinted: 175, pagePdf: 189 },
      ],
    },
    {
      code: "21·8",
      id: "exercise_ch21_8",
      instructions: "Remplacer les éléments en caractères gras par des pronoms.",
      exercise_type: "transformation",
      section_id: "section_ch21_order_of_object_pronouns",
      section_title: "Order of object pronouns",
      page_printed: 177,
      page_pdf: 191,
      rule_ids: ["rule_order_object_pronouns"],
      concept_ids: ["concept_object_pronoun_order"],
      questions: [
        { num: 1, prompt: "Ne parlez pas de ce détail à Zoé!", pagePrinted: 177, pagePdf: 191 },
        { num: 2, prompt: "Elle a emprunté de l’argent à sa sœur.", pagePrinted: 177, pagePdf: 191 },
        { num: 3, prompt: "Je ferai parvenir ce document à votre avocat.", pagePrinted: 177, pagePdf: 191 },
        { num: 4, prompt: "Patrick a raconté ses aventures (f.pl.) à son frère.", pagePrinted: 177, pagePdf: 191 },
        { num: 5, prompt: "Le musicien a envoyé sa nouvelle composition à son agent.", pagePrinted: 177, pagePdf: 191 },
        { num: 6, prompt: "L’ouvrier a donné la lettre au patron.", pagePrinted: 177, pagePdf: 191 },
        { num: 7, prompt: "J’ai demandé la photo au photographe.", pagePrinted: 177, pagePdf: 191 },
        { num: 8, prompt: "Il vendra sa maison à son cousin.", pagePrinted: 177, pagePdf: 191 },
        { num: 9, prompt: "Le médecin a prescrit ce médicament au malade.", pagePrinted: 177, pagePdf: 191 },
        { num: 10, prompt: "Je recommande cet hôtel à tous mes amis.", pagePrinted: 177, pagePdf: 191 },
      ],
    },
    {
      code: "21·9",
      id: "exercise_ch21_9",
      instructions: "Traduire les phrases suivantes en utilisant tu si nécessaire.",
      exercise_type: "translation",
      section_id: "section_ch21_order_of_object_pronouns",
      section_title: "The order of object pronouns",
      page_printed: 178,
      page_pdf: 192,
      rule_ids: ["rule_order_of_object_pronouns"],
      concept_ids: ["concept_pronoun_order"],
      questions: [
        { num: 1, prompt: "I am thinking about it.", pagePrinted: 178, pagePdf: 192 },
        { num: 2, prompt: "He is not interested in it.", pagePrinted: 178, pagePdf: 192 },
        { num: 3, prompt: "She took care of it.", pagePrinted: 178, pagePdf: 192 },
        { num: 4, prompt: "I sent it (f.) to you.", pagePrinted: 178, pagePdf: 192 },
        { num: 5, prompt: "We gave it (m.) to them.", pagePrinted: 178, pagePdf: 192 },
        { num: 6, prompt: "I use it every day.", pagePrinted: 178, pagePdf: 192 },
        { num: 7, prompt: "He spoke about it.", pagePrinted: 178, pagePdf: 192 },
        { num: 8, prompt: "I need it.", pagePrinted: 178, pagePdf: 192 },
        { num: 9, prompt: "She borrowed some from me.", pagePrinted: 178, pagePdf: 192 },
        { num: 10, prompt: "They gave us some.", pagePrinted: 178, pagePdf: 192 },
      ],
    },
    {
      code: "21·10",
      id: "exercise_ch21_10",
      instructions: "Mettre en relief le pronom sujet avec un pronom disjoint en utilisant l’expression C’est... qui.",
      exercise_type: "transformation",
      section_id: "section_ch21_disjunctive_pronouns",
      section_title: "Disjunctive pronouns",
      page_printed: 181,
      page_pdf: 195,
      rule_ids: ["rule_disjunctive_pronouns_forms"],
      concept_ids: ["concept_disjunctive_pronoun"],
      questions: [
        { num: 1, prompt: "Il a gagné le prix.", pagePrinted: 181, pagePdf: 195 },
        { num: 2, prompt: "Je prendrai la décision.", pagePrinted: 181, pagePdf: 195 },
        { num: 3, prompt: "Vous écrirez le discours.", pagePrinted: 181, pagePdf: 195 },
        { num: 4, prompt: "Nous préparons le dîner.", pagePrinted: 181, pagePdf: 195 },
        { num: 5, prompt: "Tu as fait cette erreur.", pagePrinted: 181, pagePdf: 195 },
        { num: 6, prompt: "Elle lui fait toujours de beaux cadeaux.", pagePrinted: 181, pagePdf: 195 },
        { num: 7, prompt: "Je vous ai invité.", pagePrinted: 181, pagePdf: 195 },
        { num: 8, prompt: "Ils sont responsables de cette situation désastreuse.", pagePrinted: 181, pagePdf: 195 },
        { num: 9, prompt: "Elles s’occuperont de tous les détails.", pagePrinted: 181, pagePdf: 195 },
        { num: 10, prompt: "Il fait les courses.", pagePrinted: 181, pagePdf: 195 },
      ],
    },
    {
      code: "21·11",
      id: "exercise_ch21_11",
      instructions: "Traduire les phrases suivantes en utilisant un pronom disjoint et la forme tu si nécessaire.",
      exercise_type: "translation",
      section_id: "section_ch21_disjunctive_pronouns",
      section_title: "Disjunctive pronouns",
      page_printed: 181,
      page_pdf: 195,
      rule_ids: ["rule_disjunctive_pronouns_forms"],
      concept_ids: ["concept_disjunctive_pronoun"],
      questions: [
        { num: 1, prompt: "He will go to France with me.", pagePrinted: 181, pagePdf: 195 },
        { num: 2, prompt: "I hate coffee!", pagePrinted: 181, pagePdf: 195 },
        { num: 3, prompt: "She works for us.", pagePrinted: 182, pagePdf: 196 },
        { num: 4, prompt: "Whose book is this?", pagePrinted: 182, pagePdf: 196 },
        { num: 5, prompt: "Do it yourself!", pagePrinted: 182, pagePdf: 196 },
        { num: 6, prompt: "I can’t make this decision without you.", pagePrinted: 182, pagePdf: 196 },
        { num: 7, prompt: "He is taller than you are.", pagePrinted: 182, pagePdf: 196 },
        { num: 8, prompt: "I am thinking about her.", pagePrinted: 182, pagePdf: 196 },
        { num: 9, prompt: "They are afraid of him.", pagePrinted: 182, pagePdf: 196 },
        { num: 10, prompt: "She said it herself.", pagePrinted: 182, pagePdf: 196 },
      ],
    },
    {
      code: "21·12",
      id: "exercise_ch21_12",
      instructions: "Formuler une question-réponse en reliant les phrases et en utilisant aussi ou non plus.",
      exercise_type: "transformation",
      section_id: "section_ch21_disjunctive_pronouns",
      section_title: "Disjunctive pronouns",
      page_printed: 182,
      page_pdf: 196,
      rule_ids: ["rule_disjunctive_pronouns_forms"],
      concept_ids: ["concept_disjunctive_pronoun"],
      questions: [
        { num: 1, prompt: "Il n’aime pas le froid. Je n’aime pas le froid.", pagePrinted: 182, pagePdf: 196 },
        { num: 2, prompt: "Nous allons en France. Ils vont en France.", pagePrinted: 182, pagePdf: 196 },
        { num: 3, prompt: "Je prends des vacances. Elle prend des vacances.", pagePrinted: 182, pagePdf: 196 },
        { num: 4, prompt: "Nous commandons un dessert. Elles commandent un dessert.", pagePrinted: 182, pagePdf: 196 },
        { num: 5, prompt: "Il lit beaucoup. Nous lisons beaucoup.", pagePrinted: 182, pagePdf: 196 },
      ],
    },
  ];

  for (const exDef of missingExercises) {
    const existing = ch21Data.exercises.find((e: any) => e.exercise_code === exDef.code);
    if (existing) {
      existing.rule_ids = exDef.rule_ids;
      existing.concept_ids = exDef.concept_ids;
    } else {
      const exObj: any = {
        id: exDef.id,
        type: "exercise",
        exercise_code: exDef.code,
        title: exDef.instructions,
        exercise_type: exDef.exercise_type,
        instructions: exDef.instructions,
        chapter_id: "chapter_21",
        section_id: exDef.section_id,
        page_printed: exDef.page_printed,
        page_pdf: exDef.page_pdf,
        questions: [],
        verb_ids: [],
        expression_ids: [],
        vocabulary_ids: [],
        rule_ids: exDef.rule_ids,
        tense_ids: [],
        concept_ids: exDef.concept_ids,
        origin: {
          source_type: "book",
          created_by: "authoritative_source_repair",
          derived_from_ids: [],
        },
        attestations: [
          {
            chapter_number: 21,
            section_id: exDef.section_id,
            section_title: exDef.section_title,
            page_printed: exDef.page_printed,
            page_pdf: exDef.page_pdf,
            context_type: "exercise",
            exercise_id: exDef.id,
            question_number: null,
            source_text: `${exDef.code} EXERCICE ${exDef.instructions}`,
          },
        ],
      };

      for (const q of exDef.questions) {
        exObj.questions.push({
          id: `question_ch21_${exDef.code.replace(/[·.]/g, "_")}_${q.num}`,
          number: q.num,
          prompt: q.prompt,
          answer: null,
          open_ended: exDef.exercise_type === "translation",
          answer_sources: [],
          verb_ids: [],
          expression_ids: [],
          vocabulary_ids: [],
          rule_ids: exDef.rule_ids,
          tense_ids: [],
          concept_ids: exDef.concept_ids,
          attestations: [
            {
              chapter_number: 21,
              section_id: exDef.section_id,
              section_title: exDef.section_title,
              page_printed: q.pagePrinted,
              page_pdf: q.pagePdf,
              context_type: "exercise",
              exercise_id: exDef.id,
              question_number: q.num,
              source_text: `${q.num}. ${q.prompt}`,
            },
          ],
        });
        mutations.push({
          file: "bookdata/json/21.json",
          exercise_code: exDef.code,
          exercise_id: exDef.id,
          question_number: q.num,
          prompt: q.prompt,
          page_printed: q.pagePrinted,
          page_pdf: q.pagePdf,
          reason: `Omitted during initial extraction of 21.json. Restored from textbook source (printed p. ${q.pagePrinted} / PDF p. ${q.pagePdf}).`,
        });
      }

      ch21Data.exercises.push(exObj);
    }
  }

  let ch21QAfter = 0;
  for (const ex of ch21Data.exercises) ch21QAfter += ex.questions?.length || 0;
  const ch21ExAfter = ch21Data.exercises.length;

  // Write updated chapter files
  fs.writeFileSync(ch9Path, JSON.stringify(ch9Data, null, 2) + "\n", "utf-8");
  fs.writeFileSync(ch21Path, JSON.stringify(ch21Data, null, 2) + "\n", "utf-8");

  const manifest = {
    timestamp: new Date().toISOString(),
    description: "Manifest of authoritative source repairs on bookdata/json chapter files based on verified textbook PDF evidence.",
    source_pdf: "docs/source_book.pdf / bookdata/a.pdf",
    mutation_count: mutations.length,
    chapter_summary: {
      "bookdata/json/9.json": {
        exercises_before: ch9ExBefore,
        exercises_after: ch9ExBefore,
        questions_before: ch9QBefore,
        questions_after: ch9QAfter,
        questions_added: ch9QAfter - ch9QBefore,
      },
      "bookdata/json/21.json": {
        exercises_before: ch21ExBefore,
        exercises_after: ch21ExAfter,
        exercises_added: ch21ExAfter - ch21ExBefore,
        questions_before: ch21QBefore,
        questions_after: ch21QAfter,
        questions_added: ch21QAfter - ch21QBefore,
      },
    },
    total_exercises_added: ch21ExAfter - ch21ExBefore,
    total_questions_added: (ch9QAfter - ch9QBefore) + (ch21QAfter - ch21QBefore),
    mutations,
  };

  fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2), "utf-8");
  console.log(`Repaired bookdata/json/9.json and bookdata/json/21.json.`);
  console.log(`Added ${manifest.total_exercises_added} exercises and ${manifest.total_questions_added} questions.`);
  console.log(`Wrote manifest to ${manifestPath}`);
}

if (require.main === module) {
  repairAuthoritativeBookdata();
}
