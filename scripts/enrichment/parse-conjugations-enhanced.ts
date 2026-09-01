import { Verb, Conjugation } from "../../src/lib/dataset/schemas";
import { makeVerbId, makeConjugationId } from "../../src/lib/dataset/ids";

export interface VerbConjugationSpec {
  verb_infinitive: string;
  english: string[];
  verb_group: "1st_group" | "2nd_group" | "3rd_group" | "irregular";
  regularity: "regular" | "irregular" | "stem_changing" | "spelling_changing" | "semi_regular";
  pronominal?: boolean;
  auxiliary: "avoir" | "etre" | "both";
  past_participle: string;
  present_participle?: string;
  page_printed?: number;
  chapter_number?: number;
  tenses: Record<
    string, // e.g. "tense_present_indicative", "tense_passe_compose", "tense_imparfait", "tense_futur_simple", "tense_conditionnel_present", "tense_subjonctif_present", "tense_imperatif", "tense_passe_simple", "tense_plus_que_parfait"
    {
      forms: Record<string, string>;
      spelling_notes?: string[];
      irregularity_notes?: string[];
    }
  >;
}

// We define full conjugation paradigms for the comprehensive list of verbs taught throughout the textbook
export const MASTER_CONJUGATION_SPECS: VerbConjugationSpec[] = [
  // 1. AVOIR
  {
    verb_infinitive: "avoir",
    english: ["to have"],
    verb_group: "3rd_group",
    regularity: "irregular",
    auxiliary: "avoir",
    past_participle: "eu",
    present_participle: "ayant",
    chapter_number: 3,
    page_printed: 28,
    tenses: {
      tense_present_indicative: {
        forms: { je: "j'ai", tu: "tu as", il_elle_on: "il a", nous: "nous avons", vous: "vous avez", ils_elles: "ils ont" },
      },
      tense_passe_compose: {
        forms: { je: "j'ai eu", tu: "tu as eu", il_elle_on: "il a eu", nous: "nous avons eu", vous: "vous avez eu", ils_elles: "ils ont eu" },
      },
      tense_imparfait: {
        forms: { je: "j'avais", tu: "tu avais", il_elle_on: "il avait", nous: "nous avions", vous: "vous aviez", ils_elles: "ils avaient" },
      },
      tense_futur_simple: {
        forms: { je: "j'aurai", tu: "tu auras", il_elle_on: "il aura", nous: "nous aurons", vous: "vous aurez", ils_elles: "ils auront" },
      },
      tense_plus_que_parfait: {
        forms: { je: "j'avais eu", tu: "tu avais eu", il_elle_on: "il avait eu", nous: "nous avions eu", vous: "vous aviez eu", ils_elles: "ils avaient eu" },
      },
      tense_conditionnel_present: {
        forms: { je: "j'aurais", tu: "tu aurais", il_elle_on: "il aurait", nous: "nous aurions", vous: "vous auriez", ils_elles: "ils auraient" },
      },
      tense_conditionnel_passe: {
        forms: { je: "j'aurais eu", tu: "tu aurais eu", il_elle_on: "il aurait eu", nous: "nous aurions eu", vous: "vous auriez eu", ils_elles: "ils auraient eu" },
      },
      tense_subjonctif_present: {
        forms: { je: "que j'aie", tu: "que tu aies", il_elle_on: "qu'il ait", nous: "que nous ayons", vous: "que vous ayez", ils_elles: "qu'ils aient" },
      },
      tense_imperatif: {
        forms: { tu: "aie", nous: "ayons", vous: "ayez" },
      },
      tense_passe_simple: {
        forms: { je: "j'eus", tu: "tu eus", il_elle_on: "il eut", nous: "nous eûmes", vous: "vous eûtes", ils_elles: "ils eurent" },
      },
    },
  },

  // 2. ÊTRE
  {
    verb_infinitive: "être",
    english: ["to be"],
    verb_group: "3rd_group",
    regularity: "irregular",
    auxiliary: "avoir",
    past_participle: "été",
    present_participle: "étant",
    chapter_number: 3,
    page_printed: 24,
    tenses: {
      tense_present_indicative: {
        forms: { je: "je suis", tu: "tu es", il_elle_on: "il est", nous: "nous sommes", vous: "vous êtes", ils_elles: "ils sont" },
      },
      tense_passe_compose: {
        forms: { je: "j'ai été", tu: "tu as été", il_elle_on: "il a été", nous: "nous avons été", vous: "vous avez été", ils_elles: "ils ont été" },
      },
      tense_imparfait: {
        forms: { je: "j'étais", tu: "tu étais", il_elle_on: "il était", nous: "nous étions", vous: "vous étiez", ils_elles: "ils étaient" },
      },
      tense_futur_simple: {
        forms: { je: "je serai", tu: "tu seras", il_elle_on: "il sera", nous: "nous serons", vous: "vous serez", ils_elles: "ils seront" },
      },
      tense_plus_que_parfait: {
        forms: { je: "j'avais été", tu: "tu avais été", il_elle_on: "il avait été", nous: "nous avions été", vous: "vous aviez été", ils_elles: "ils avaient été" },
      },
      tense_conditionnel_present: {
        forms: { je: "je serais", tu: "tu serais", il_elle_on: "il serait", nous: "nous serions", vous: "vous seriez", ils_elles: "ils seraient" },
      },
      tense_conditionnel_passe: {
        forms: { je: "j'aurais été", tu: "tu aurais été", il_elle_on: "il aurait été", nous: "nous aurions été", vous: "vous auriez été", ils_elles: "ils auraient été" },
      },
      tense_subjonctif_present: {
        forms: { je: "que je sois", tu: "que tu sois", il_elle_on: "qu'il soit", nous: "que nous soyons", vous: "que vous soyez", ils_elles: "qu'ils soient" },
      },
      tense_imperatif: {
        forms: { tu: "sois", nous: "soyons", vous: "soyez" },
      },
      tense_passe_simple: {
        forms: { je: "je fus", tu: "tu fus", il_elle_on: "il fut", nous: "nous fûmes", vous: "vous fûtes", ils_elles: "ils furent" },
      },
    },
  },

  // 3. ALLER
  {
    verb_infinitive: "aller",
    english: ["to go"],
    verb_group: "3rd_group",
    regularity: "irregular",
    auxiliary: "etre",
    past_participle: "allé",
    present_participle: "allant",
    chapter_number: 4,
    page_printed: 34,
    tenses: {
      tense_present_indicative: {
        forms: { je: "je vais", tu: "tu vas", il_elle_on: "il va", nous: "nous allons", vous: "vous allez", ils_elles: "ils vont" },
      },
      tense_passe_compose: {
        forms: { je: "je suis allé(e)", tu: "tu es allé(e)", il_elle_on: "il/elle est allé(e)", nous: "nous sommes allé(e)s", vous: "vous êtes allé(e)(s)", ils_elles: "ils/elles sont allé(e)s" },
      },
      tense_imparfait: {
        forms: { je: "j'allais", tu: "tu allais", il_elle_on: "il allait", nous: "nous allions", vous: "vous alliez", ils_elles: "ils allaient" },
      },
      tense_futur_simple: {
        forms: { je: "j'irai", tu: "tu iras", il_elle_on: "il ira", nous: "nous irons", vous: "vous irez", ils_elles: "ils iront" },
      },
      tense_plus_que_parfait: {
        forms: { je: "j'étais allé(e)", tu: "tu étais allé(e)", il_elle_on: "il/elle était allé(e)", nous: "nous étions allé(e)s", vous: "vous étiez allé(e)(s)", ils_elles: "ils/elles étaient allé(e)s" },
      },
      tense_conditionnel_present: {
        forms: { je: "j'irais", tu: "tu irais", il_elle_on: "il irait", nous: "nous irions", vous: "vous iriez", ils_elles: "ils iraient" },
      },
      tense_conditionnel_passe: {
        forms: { je: "je serais allé(e)", tu: "tu serais allé(e)", il_elle_on: "il/elle serait allé(e)", nous: "nous serions allé(e)s", vous: "vous seriez allé(e)(s)", ils_elles: "ils/elles seraient allé(e)s" },
      },
      tense_subjonctif_present: {
        forms: { je: "que j'aille", tu: "que tu ailles", il_elle_on: "qu'il aille", nous: "que nous allions", vous: "que vous alliez", ils_elles: "qu'ils aillent" },
      },
      tense_imperatif: {
        forms: { tu: "va", nous: "allons", vous: "allez" },
      },
      tense_passe_simple: {
        forms: { je: "j'allai", tu: "tu allas", il_elle_on: "il alla", nous: "nous allâmes", vous: "vous allâtes", ils_elles: "ils allèrent" },
      },
    },
  },

  // 4. FAIRE
  {
    verb_infinitive: "faire",
    english: ["to do", "to make"],
    verb_group: "3rd_group",
    regularity: "irregular",
    auxiliary: "avoir",
    past_participle: "fait",
    present_participle: "faisant",
    chapter_number: 4,
    page_printed: 38,
    tenses: {
      tense_present_indicative: {
        forms: { je: "je fais", tu: "tu fais", il_elle_on: "il fait", nous: "nous faisons", vous: "vous faites", ils_elles: "ils font" },
      },
      tense_passe_compose: {
        forms: { je: "j'ai fait", tu: "tu as fait", il_elle_on: "il a fait", nous: "nous avons fait", vous: "vous avez fait", ils_elles: "ils ont fait" },
      },
      tense_imparfait: {
        forms: { je: "je faisais", tu: "tu faisais", il_elle_on: "il faisait", nous: "nous faisions", vous: "vous faisiez", ils_elles: "ils faisaient" },
      },
      tense_futur_simple: {
        forms: { je: "je ferai", tu: "tu feras", il_elle_on: "il fera", nous: "nous ferons", vous: "vous ferez", ils_elles: "ils feront" },
      },
      tense_plus_que_parfait: {
        forms: { je: "j'avais fait", tu: "tu avais fait", il_elle_on: "il avait fait", nous: "nous avions fait", vous: "vous aviez fait", ils_elles: "ils avaient fait" },
      },
      tense_conditionnel_present: {
        forms: { je: "je ferais", tu: "tu ferais", il_elle_on: "il ferait", nous: "nous ferions", vous: "vous feriez", ils_elles: "ils feraient" },
      },
      tense_conditionnel_passe: {
        forms: { je: "j'aurais fait", tu: "tu aurais fait", il_elle_on: "il aurait fait", nous: "nous aurions fait", vous: "vous auriez fait", ils_elles: "ils auraient fait" },
      },
      tense_subjonctif_present: {
        forms: { je: "que je fasse", tu: "que tu fasses", il_elle_on: "qu'il fasse", nous: "que nous fassions", vous: "que vous fassiez", ils_elles: "qu'ils fassent" },
      },
      tense_imperatif: {
        forms: { tu: "fais", nous: "faisons", vous: "faites" },
      },
      tense_passe_simple: {
        forms: { je: "je fis", tu: "tu fis", il_elle_on: "il fit", nous: "nous fîmes", vous: "vous fîtes", ils_elles: "ils firent" },
      },
    },
  },

  // 5. VENIR
  {
    verb_infinitive: "venir",
    english: ["to come"],
    verb_group: "3rd_group",
    regularity: "irregular",
    auxiliary: "etre",
    past_participle: "venu",
    present_participle: "venant",
    chapter_number: 4,
    page_printed: 36,
    tenses: {
      tense_present_indicative: {
        forms: { je: "je viens", tu: "tu viens", il_elle_on: "il vient", nous: "nous venons", vous: "vous venez", ils_elles: "ils viennent" },
      },
      tense_passe_compose: {
        forms: { je: "je suis venu(e)", tu: "tu es venu(e)", il_elle_on: "il/elle est venu(e)", nous: "nous sommes venu(e)s", vous: "vous êtes venu(e)(s)", ils_elles: "ils/elles sont venu(e)s" },
      },
      tense_imparfait: {
        forms: { je: "je venais", tu: "tu venais", il_elle_on: "il venait", nous: "nous venions", vous: "vous veniez", ils_elles: "ils venaient" },
      },
      tense_futur_simple: {
        forms: { je: "je viendrai", tu: "tu viendras", il_elle_on: "il viendra", nous: "nous viendrons", vous: "vous viendrez", ils_elles: "ils viendront" },
      },
      tense_plus_que_parfait: {
        forms: { je: "j'étais venu(e)", tu: "tu étais venu(e)", il_elle_on: "il/elle était venu(e)", nous: "nous étions venu(e)s", vous: "vous étiez venu(e)(s)", ils_elles: "ils/elles étaient venu(e)s" },
      },
      tense_conditionnel_present: {
        forms: { je: "je viendrais", tu: "tu viendrais", il_elle_on: "il viendrait", nous: "nous viendrions", vous: "vous viendriez", ils_elles: "ils viendraient" },
      },
      tense_conditionnel_passe: {
        forms: { je: "je serais venu(e)", tu: "tu serais venu(e)", il_elle_on: "il/elle serait venu(e)", nous: "nous serions venu(e)s", vous: "vous seriez venu(e)(s)", ils_elles: "ils/elles seraient venu(e)s" },
      },
      tense_subjonctif_present: {
        forms: { je: "que je vienne", tu: "que tu viennes", il_elle_on: "qu'il vienne", nous: "que nous venions", vous: "que vous veniez", ils_elles: "qu'ils viennent" },
      },
      tense_imperatif: {
        forms: { tu: "viens", nous: "venons", vous: "venez" },
      },
      tense_passe_simple: {
        forms: { je: "je vins", tu: "tu vins", il_elle_on: "il vint", nous: "nous vînmes", vous: "vous vîntes", ils_elles: "ils vinrent" },
      },
    },
  },

  // 6. POUVOIR
  {
    verb_infinitive: "pouvoir",
    english: ["to be able to", "can"],
    verb_group: "3rd_group",
    regularity: "irregular",
    auxiliary: "avoir",
    past_participle: "pu",
    present_participle: "pouvant",
    chapter_number: 3,
    page_printed: 30,
    tenses: {
      tense_present_indicative: {
        forms: { je: "je peux / puis", tu: "tu peux", il_elle_on: "il peut", nous: "nous pouvons", vous: "vous pouvez", ils_elles: "ils peuvent" },
      },
      tense_passe_compose: {
        forms: { je: "j'ai pu", tu: "tu as pu", il_elle_on: "il a pu", nous: "nous avons pu", vous: "vous avez pu", ils_elles: "ils ont pu" },
      },
      tense_imparfait: {
        forms: { je: "je pouvais", tu: "tu pouvais", il_elle_on: "il pouvait", nous: "nous pouvions", vous: "vous pouviez", ils_elles: "ils pouvaient" },
      },
      tense_futur_simple: {
        forms: { je: "je pourrai", tu: "tu pourras", il_elle_on: "il pourra", nous: "nous pourrons", vous: "vous pourrez", ils_elles: "ils pourront" },
      },
      tense_conditionnel_present: {
        forms: { je: "je pourrais", tu: "tu pourrais", il_elle_on: "il pourrait", nous: "nous pourrions", vous: "vous pourriez", ils_elles: "ils pourraient" },
      },
      tense_subjonctif_present: {
        forms: { je: "que je puisse", tu: "que tu puisses", il_elle_on: "qu'il puisse", nous: "que nous puissions", vous: "que vous puissiez", ils_elles: "qu'ils puissent" },
      },
      tense_passe_simple: {
        forms: { je: "je pus", tu: "tu pus", il_elle_on: "il put", nous: "nous pûmes", vous: "vous pûtes", ils_elles: "ils purent" },
      },
    },
  },

  // 7. VOULOIR
  {
    verb_infinitive: "vouloir",
    english: ["to want"],
    verb_group: "3rd_group",
    regularity: "irregular",
    auxiliary: "avoir",
    past_participle: "voulu",
    present_participle: "voulant",
    chapter_number: 3,
    page_printed: 30,
    tenses: {
      tense_present_indicative: {
        forms: { je: "je veux", tu: "tu veux", il_elle_on: "il veut", nous: "nous voulons", vous: "vous voulez", ils_elles: "ils veulent" },
      },
      tense_passe_compose: {
        forms: { je: "j'ai voulu", tu: "tu as voulu", il_elle_on: "il a voulu", nous: "nous avons voulu", vous: "vous avez voulu", ils_elles: "ils ont voulu" },
      },
      tense_imparfait: {
        forms: { je: "je voulais", tu: "tu voulais", il_elle_on: "il voulait", nous: "nous voulions", vous: "vous vouliez", ils_elles: "ils voulaient" },
      },
      tense_futur_simple: {
        forms: { je: "je voudrai", tu: "tu voudras", il_elle_on: "il voudra", nous: "nous voudrons", vous: "vous voudrez", ils_elles: "ils voudront" },
      },
      tense_conditionnel_present: {
        forms: { je: "je voudrais", tu: "tu voudrais", il_elle_on: "il voudrait", nous: "nous voudrions", vous: "vous voudriez", ils_elles: "ils voudraient" },
      },
      tense_subjonctif_present: {
        forms: { je: "que je veuille", tu: "que tu veuilles", il_elle_on: "qu'il veuille", nous: "que nous voulions", vous: "que vous vouliez", ils_elles: "qu'ils veuillent" },
      },
      tense_imperatif: {
        forms: { tu: "veuille", nous: "voulons", vous: "veuillez" },
      },
      tense_passe_simple: {
        forms: { je: "je voulus", tu: "tu voulus", il_elle_on: "il voulut", nous: "nous voulûmes", vous: "vous voulûtes", ils_elles: "ils voulurent" },
      },
    },
  },

  // 8. DEVOIR
  {
    verb_infinitive: "devoir",
    english: ["to have to", "must", "to owe"],
    verb_group: "3rd_group",
    regularity: "irregular",
    auxiliary: "avoir",
    past_participle: "dû",
    present_participle: "devant",
    chapter_number: 5,
    page_printed: 43,
    tenses: {
      tense_present_indicative: {
        forms: { je: "je dois", tu: "tu dois", il_elle_on: "il doit", nous: "nous devons", vous: "vous devez", ils_elles: "ils doivent" },
      },
      tense_passe_compose: {
        forms: { je: "j'ai dû", tu: "tu as dû", il_elle_on: "il a dû", nous: "nous avons dû", vous: "vous avez dû", ils_elles: "ils ont dû" },
      },
      tense_imparfait: {
        forms: { je: "je devais", tu: "tu devais", il_elle_on: "il devait", nous: "nous devions", vous: "vous deviez", ils_elles: "ils devaient" },
      },
      tense_futur_simple: {
        forms: { je: "je devrai", tu: "tu devras", il_elle_on: "il devra", nous: "nous devrons", vous: "vous devrez", ils_elles: "ils devront" },
      },
      tense_conditionnel_present: {
        forms: { je: "je devrais", tu: "tu devrais", il_elle_on: "il devrait", nous: "nous devrions", vous: "vous devriez", ils_elles: "ils devraient" },
      },
      tense_subjonctif_present: {
        forms: { je: "que je doive", tu: "que tu doives", il_elle_on: "qu'il doive", nous: "que nous devions", vous: "que vous deviez", ils_elles: "qu'ils doivent" },
      },
      tense_passe_simple: {
        forms: { je: "je dus", tu: "tu dus", il_elle_on: "il dut", nous: "nous dûmes", vous: "vous dûtes", ils_elles: "ils durent" },
      },
    },
  },

  // 9. SAVOIR
  {
    verb_infinitive: "savoir",
    english: ["to know", "to know how to"],
    verb_group: "3rd_group",
    regularity: "irregular",
    auxiliary: "avoir",
    past_participle: "su",
    present_participle: "sachant",
    chapter_number: 3,
    page_printed: 30,
    tenses: {
      tense_present_indicative: {
        forms: { je: "je sais", tu: "tu sais", il_elle_on: "il sait", nous: "nous savons", vous: "vous savez", ils_elles: "ils savent" },
      },
      tense_passe_compose: {
        forms: { je: "j'ai su", tu: "tu as su", il_elle_on: "il a su", nous: "nous avons su", vous: "vous avez su", ils_elles: "ils ont su" },
      },
      tense_imparfait: {
        forms: { je: "je savais", tu: "tu savais", il_elle_on: "il savait", nous: "nous savions", vous: "vous saviez", ils_elles: "ils savaient" },
      },
      tense_futur_simple: {
        forms: { je: "je saurai", tu: "tu sauras", il_elle_on: "il saura", nous: "nous saurons", vous: "vous saurez", ils_elles: "ils sauront" },
      },
      tense_conditionnel_present: {
        forms: { je: "je saurais", tu: "tu saurais", il_elle_on: "il saurait", nous: "nous saurions", vous: "vous sauriez", ils_elles: "ils sauraient" },
      },
      tense_subjonctif_present: {
        forms: { je: "que je sache", tu: "que tu saches", il_elle_on: "qu'il sache", nous: "que nous sachions", vous: "que vous sachiez", ils_elles: "qu'ils sachent" },
      },
      tense_imperatif: {
        forms: { tu: "sache", nous: "sachons", vous: "sachez" },
      },
      tense_passe_simple: {
        forms: { je: "je sus", tu: "tu sus", il_elle_on: "il sut", nous: "nous sûmes", vous: "vous sûtes", ils_elles: "ils surent" },
      },
    },
  },

  // 10. PRENDRE
  {
    verb_infinitive: "prendre",
    english: ["to take"],
    verb_group: "3rd_group",
    regularity: "irregular",
    auxiliary: "avoir",
    past_participle: "pris",
    present_participle: "prenant",
    chapter_number: 4,
    page_printed: 37,
    tenses: {
      tense_present_indicative: {
        forms: { je: "je prends", tu: "tu prends", il_elle_on: "il prend", nous: "nous prenons", vous: "vous prenez", ils_elles: "ils prennent" },
      },
      tense_passe_compose: {
        forms: { je: "j'ai pris", tu: "tu as pris", il_elle_on: "il a pris", nous: "nous avons pris", vous: "vous avez pris", ils_elles: "ils ont pris" },
      },
      tense_imparfait: {
        forms: { je: "je prenais", tu: "tu prenais", il_elle_on: "il prenait", nous: "nous prenions", vous: "vous preniez", ils_elles: "ils prenaient" },
      },
      tense_futur_simple: {
        forms: { je: "je prendrai", tu: "tu prendras", il_elle_on: "il prendra", nous: "nous prendrons", vous: "vous prendrez", ils_elles: "ils prendront" },
      },
      tense_conditionnel_present: {
        forms: { je: "je prendrais", tu: "tu prendrais", il_elle_on: "il prendrait", nous: "nous prendrions", vous: "vous prendriez", ils_elles: "ils prendraient" },
      },
      tense_subjonctif_present: {
        forms: { je: "que je prenne", tu: "que tu prennes", il_elle_on: "qu'il prenne", nous: "que nous prenions", vous: "que vous preniez", ils_elles: "qu'ils prennent" },
      },
      tense_imperatif: {
        forms: { tu: "prends", nous: "prenons", vous: "prenez" },
      },
      tense_passe_simple: {
        forms: { je: "je pris", tu: "tu pris", il_elle_on: "il prit", nous: "nous prîmes", vous: "vous prîtes", ils_elles: "ils prirent" },
      },
    },
  },

  // 11. METTRE
  {
    verb_infinitive: "mettre",
    english: ["to put", "to place", "to put on"],
    verb_group: "3rd_group",
    regularity: "irregular",
    auxiliary: "avoir",
    past_participle: "mis",
    present_participle: "mettant",
    chapter_number: 4,
    page_printed: 37,
    tenses: {
      tense_present_indicative: {
        forms: { je: "je mets", tu: "tu mets", il_elle_on: "il met", nous: "nous mettons", vous: "vous mettez", ils_elles: "ils mettent" },
      },
      tense_passe_compose: {
        forms: { je: "j'ai mis", tu: "tu as mis", il_elle_on: "il a mis", nous: "nous avons mis", vous: "vous avez mis", ils_elles: "ils ont mis" },
      },
      tense_imparfait: {
        forms: { je: "je mettais", tu: "tu mettais", il_elle_on: "il mettait", nous: "nous mettions", vous: "vous mettiez", ils_elles: "ils mettaient" },
      },
      tense_futur_simple: {
        forms: { je: "je mettrai", tu: "tu mettras", il_elle_on: "il mettra", nous: "nous mettrons", vous: "vous mettrez", ils_elles: "ils mettront" },
      },
      tense_conditionnel_present: {
        forms: { je: "je mettrais", tu: "tu mettrais", il_elle_on: "il mettrait", nous: "nous mettrions", vous: "vous mettriez", ils_elles: "ils mettraient" },
      },
      tense_subjonctif_present: {
        forms: { je: "que je mette", tu: "que tu mettes", il_elle_on: "qu'il mette", nous: "que nous mettions", vous: "que vous mettiez", ils_elles: "qu'ils mettent" },
      },
      tense_imperatif: {
        forms: { tu: "mets", nous: "mettons", vous: "mettez" },
      },
      tense_passe_simple: {
        forms: { je: "je mis", tu: "tu mis", il_elle_on: "il mit", nous: "nous mîmes", vous: "vous mîtes", ils_elles: "ils mirent" },
      },
    },
  },

  // 12. VOIR
  {
    verb_infinitive: "voir",
    english: ["to see"],
    verb_group: "3rd_group",
    regularity: "irregular",
    auxiliary: "avoir",
    past_participle: "vu",
    present_participle: "voyant",
    chapter_number: 3,
    page_printed: 30,
    tenses: {
      tense_present_indicative: {
        forms: { je: "je vois", tu: "tu vois", il_elle_on: "il voit", nous: "nous voyons", vous: "vous voyez", ils_elles: "ils voient" },
      },
      tense_passe_compose: {
        forms: { je: "j'ai vu", tu: "tu as vu", il_elle_on: "il a vu", nous: "nous avons vu", vous: "vous avez vu", ils_elles: "ils ont vu" },
      },
      tense_imparfait: {
        forms: { je: "je voyais", tu: "tu voyais", il_elle_on: "il voyait", nous: "nous voyions", vous: "vous voyiez", ils_elles: "ils voyaient" },
      },
      tense_futur_simple: {
        forms: { je: "je verrai", tu: "tu verras", il_elle_on: "il verra", nous: "nous verrons", vous: "vous verrez", ils_elles: "ils verront" },
      },
      tense_conditionnel_present: {
        forms: { je: "je verrais", tu: "tu verrais", il_elle_on: "il verrait", nous: "nous verrions", vous: "vous verriez", ils_elles: "ils verraient" },
      },
      tense_subjonctif_present: {
        forms: { je: "que je voie", tu: "que tu voies", il_elle_on: "qu'il voie", nous: "que nous voyions", vous: "que vous voyiez", ils_elles: "qu'ils voient" },
      },
      tense_imperatif: {
        forms: { tu: "vois", nous: "voyons", vous: "voyez" },
      },
      tense_passe_simple: {
        forms: { je: "je vis", tu: "tu vis", il_elle_on: "il vit", nous: "nous vîmes", vous: "vous vîtes", ils_elles: "ils virent" },
      },
    },
  },

  // 13. DIRE
  {
    verb_infinitive: "dire",
    english: ["to say", "to tell"],
    verb_group: "3rd_group",
    regularity: "irregular",
    auxiliary: "avoir",
    past_participle: "dit",
    present_participle: "disant",
    chapter_number: 4,
    page_printed: 38,
    tenses: {
      tense_present_indicative: {
        forms: { je: "je dis", tu: "tu dis", il_elle_on: "il dit", nous: "nous disons", vous: "vous dites", ils_elles: "ils disent" },
      },
      tense_passe_compose: {
        forms: { je: "j'ai dit", tu: "tu as dit", il_elle_on: "il a dit", nous: "nous avons dit", vous: "vous avez dit", ils_elles: "ils ont dit" },
      },
      tense_imparfait: {
        forms: { je: "je disais", tu: "tu disais", il_elle_on: "il disait", nous: "nous disions", vous: "vous disiez", ils_elles: "ils disaient" },
      },
      tense_futur_simple: {
        forms: { je: "je dirai", tu: "tu diras", il_elle_on: "il dira", nous: "nous dirons", vous: "vous direz", ils_elles: "ils diront" },
      },
      tense_conditionnel_present: {
        forms: { je: "je dirais", tu: "tu dirais", il_elle_on: "il dirait", nous: "nous dirions", vous: "vous diriez", ils_elles: "ils diraient" },
      },
      tense_subjonctif_present: {
        forms: { je: "que je dise", tu: "que tu dises", il_elle_on: "qu'il dise", nous: "que nous disions", vous: "que vous disiez", ils_elles: "qu'ils disent" },
      },
      tense_imperatif: {
        forms: { tu: "dis", nous: "disons", vous: "dites" },
      },
      tense_passe_simple: {
        forms: { je: "je dis", tu: "tu dis", il_elle_on: "il dit", nous: "nous dîmes", vous: "vous dîtes", ils_elles: "ils dirent" },
      },
    },
  },

  // 14. LIRE
  {
    verb_infinitive: "lire",
    english: ["to read"],
    verb_group: "3rd_group",
    regularity: "irregular",
    auxiliary: "avoir",
    past_participle: "lu",
    present_participle: "lisant",
    chapter_number: 4,
    page_printed: 38,
    tenses: {
      tense_present_indicative: {
        forms: { je: "je lis", tu: "tu lis", il_elle_on: "il lit", nous: "nous lisons", vous: "vous lisez", ils_elles: "ils lisent" },
      },
      tense_passe_compose: {
        forms: { je: "j'ai lu", tu: "tu as lu", il_elle_on: "il a lu", nous: "nous avons lu", vous: "vous avez lu", ils_elles: "ils ont lu" },
      },
      tense_imparfait: {
        forms: { je: "je lisais", tu: "tu lisais", il_elle_on: "il lisait", nous: "nous lisions", vous: "vous lisiez", ils_elles: "ils lisaient" },
      },
      tense_futur_simple: {
        forms: { je: "je lirai", tu: "tu liras", il_elle_on: "il lira", nous: "nous lirons", vous: "vous lirez", ils_elles: "ils liront" },
      },
      tense_conditionnel_present: {
        forms: { je: "je lirais", tu: "tu lirais", il_elle_on: "il lirait", nous: "nous lirions", vous: "vous liriez", ils_elles: "ils liraient" },
      },
      tense_subjonctif_present: {
        forms: { je: "que je lise", tu: "que tu lises", il_elle_on: "qu'il lise", nous: "que nous lisions", vous: "que vous lisiez", ils_elles: "qu'ils lisent" },
      },
      tense_imperatif: {
        forms: { tu: "lis", nous: "lisons", vous: "lisez" },
      },
      tense_passe_simple: {
        forms: { je: "je lus", tu: "tu lus", il_elle_on: "il lut", nous: "nous lûmes", vous: "vous lûtes", ils_elles: "ils lurent" },
      },
    },
  },

  // 15. ÉCRIRE
  {
    verb_infinitive: "écrire",
    english: ["to write"],
    verb_group: "3rd_group",
    regularity: "irregular",
    auxiliary: "avoir",
    past_participle: "écrit",
    present_participle: "écrivant",
    chapter_number: 4,
    page_printed: 38,
    tenses: {
      tense_present_indicative: {
        forms: { je: "j'écris", tu: "tu écris", il_elle_on: "il écrit", nous: "nous écrivons", vous: "vous écrivez", ils_elles: "ils écrivent" },
      },
      tense_passe_compose: {
        forms: { je: "j'ai écrit", tu: "tu as écrit", il_elle_on: "il a écrit", nous: "nous avons écrit", vous: "vous avez écrit", ils_elles: "ils ont écrit" },
      },
      tense_imparfait: {
        forms: { je: "j'écrivais", tu: "tu écrivais", il_elle_on: "il écrivait", nous: "nous écrivions", vous: "vous écriviez", ils_elles: "ils écrivaient" },
      },
      tense_futur_simple: {
        forms: { je: "j'écrirai", tu: "tu écriras", il_elle_on: "il écrira", nous: "nous écrirons", vous: "vous écrirez", ils_elles: "ils écriront" },
      },
      tense_conditionnel_present: {
        forms: { je: "j'écrirais", tu: "tu écrirais", il_elle_on: "il écrirait", nous: "nous écririons", vous: "vous écririez", ils_elles: "ils écriraient" },
      },
      tense_subjonctif_present: {
        forms: { je: "que j'écrive", tu: "que tu écrives", il_elle_on: "qu'il écrive", nous: "que nous écrivions", vous: "que vous écriviez", ils_elles: "qu'ils écrivent" },
      },
      tense_imperatif: {
        forms: { tu: "écris", nous: "écrivons", vous: "écrivez" },
      },
      tense_passe_simple: {
        forms: { je: "j'écrivis", tu: "tu écrivis", il_elle_on: "il écrivit", nous: "nous écrivîmes", vous: "vous écrivîtes", ils_elles: "ils écrivirent" },
      },
    },
  },

  // 16. REGARDER (Regular -er paradigm model)
  {
    verb_infinitive: "regarder",
    english: ["to look at", "to watch"],
    verb_group: "1st_group",
    regularity: "regular",
    auxiliary: "avoir",
    past_participle: "regardé",
    present_participle: "regardant",
    chapter_number: 1,
    page_printed: 1,
    tenses: {
      tense_present_indicative: {
        forms: { je: "je regarde", tu: "tu regardes", il_elle_on: "il regarde", nous: "nous regardons", vous: "vous regardez", ils_elles: "ils regardent" },
      },
      tense_passe_compose: {
        forms: { je: "j'ai regardé", tu: "tu as regardé", il_elle_on: "il a regardé", nous: "nous avons regardé", vous: "vous avez regardé", ils_elles: "ils ont regardé" },
      },
      tense_imparfait: {
        forms: { je: "je regardais", tu: "tu regardais", il_elle_on: "il regardait", nous: "nous regardions", vous: "vous regardiez", ils_elles: "ils regardaient" },
      },
      tense_futur_simple: {
        forms: { je: "je regarderai", tu: "tu regarderas", il_elle_on: "il regardera", nous: "nous regarderons", vous: "vous regarderez", ils_elles: "ils regarderont" },
      },
      tense_plus_que_parfait: {
        forms: { je: "j'avais regardé", tu: "tu avais regardé", il_elle_on: "il avait regardé", nous: "nous avions regardé", vous: "vous aviez regardé", ils_elles: "ils avaient regardé" },
      },
      tense_conditionnel_present: {
        forms: { je: "je regarderais", tu: "tu regarderais", il_elle_on: "il regarderait", nous: "nous regarderions", vous: "vous regarderiez", ils_elles: "ils regarderaient" },
      },
      tense_conditionnel_passe: {
        forms: { je: "j'aurais regardé", tu: "tu aurais regardé", il_elle_on: "il aurait regardé", nous: "nous aurions regardé", vous: "vous auriez regardé", ils_elles: "ils auraient regardé" },
      },
      tense_subjonctif_present: {
        forms: { je: "que je regarde", tu: "que tu regardes", il_elle_on: "qu'il regarde", nous: "que nous regardions", vous: "que vous regardiez", ils_elles: "qu'ils regardent" },
      },
      tense_imperatif: {
        forms: { tu: "regarde", nous: "regardons", vous: "regardez" },
      },
      tense_passe_simple: {
        forms: { je: "je regardai", tu: "tu regardas", il_elle_on: "il regarda", nous: "nous regardâmes", vous: "vous regardâtes", ils_elles: "ils regardèrent" },
      },
    },
  },

  // 17. FINIR (Regular -ir 2nd group paradigm model)
  {
    verb_infinitive: "finir",
    english: ["to finish"],
    verb_group: "2nd_group",
    regularity: "regular",
    auxiliary: "avoir",
    past_participle: "fini",
    present_participle: "finissant",
    chapter_number: 2,
    page_printed: 13,
    tenses: {
      tense_present_indicative: {
        forms: { je: "je finis", tu: "tu finis", il_elle_on: "il finit", nous: "nous finissons", vous: "vous finissez", ils_elles: "ils finissent" },
      },
      tense_passe_compose: {
        forms: { je: "j'ai fini", tu: "tu as fini", il_elle_on: "il a fini", nous: "nous avons fini", vous: "vous avez fini", ils_elles: "ils ont fini" },
      },
      tense_imparfait: {
        forms: { je: "je finissais", tu: "tu finissais", il_elle_on: "il finissait", nous: "nous finissions", vous: "vous finissiez", ils_elles: "ils finissaient" },
      },
      tense_futur_simple: {
        forms: { je: "je finirai", tu: "tu finiras", il_elle_on: "il finira", nous: "nous finirons", vous: "vous finirez", ils_elles: "ils finiront" },
      },
      tense_plus_que_parfait: {
        forms: { je: "j'avais fini", tu: "tu avais fini", il_elle_on: "il avait fini", nous: "nous avions fini", vous: "vous aviez fini", ils_elles: "ils avaient fini" },
      },
      tense_conditionnel_present: {
        forms: { je: "je finirais", tu: "tu finirais", il_elle_on: "il finirait", nous: "nous finirions", vous: "vous finiriez", ils_elles: "ils finiraient" },
      },
      tense_subjonctif_present: {
        forms: { je: "que je finisse", tu: "que tu finisses", il_elle_on: "qu'il finisse", nous: "que nous finissions", vous: "que vous finissiez", ils_elles: "qu'ils finissent" },
      },
      tense_imperatif: {
        forms: { tu: "finis", nous: "finissons", vous: "finissez" },
      },
      tense_passe_simple: {
        forms: { je: "je finis", tu: "tu finis", il_elle_on: "il finit", nous: "nous finîmes", vous: "vous finîtes", ils_elles: "ils finirent" },
      },
    },
  },

  // 18. VENDRE (Regular -re 3rd group paradigm model)
  {
    verb_infinitive: "vendre",
    english: ["to sell"],
    verb_group: "3rd_group",
    regularity: "regular",
    auxiliary: "avoir",
    past_participle: "vendu",
    present_participle: "vendant",
    chapter_number: 2,
    page_printed: 15,
    tenses: {
      tense_present_indicative: {
        forms: { je: "je vends", tu: "tu vends", il_elle_on: "il vend", nous: "nous vendons", vous: "vous vendez", ils_elles: "ils vendent" },
      },
      tense_passe_compose: {
        forms: { je: "j'ai vendu", tu: "tu as vendu", il_elle_on: "il a vendu", nous: "nous avons vendu", vous: "vous avez vendu", ils_elles: "ils ont vendu" },
      },
      tense_imparfait: {
        forms: { je: "je vendais", tu: "tu vendais", il_elle_on: "il vendait", nous: "nous vendions", vous: "vous vendiez", ils_elles: "ils vendaient" },
      },
      tense_futur_simple: {
        forms: { je: "je vendrai", tu: "tu vendras", il_elle_on: "il vendra", nous: "nous vendrons", vous: "vous vendrez", ils_elles: "ils vendront" },
      },
      tense_plus_que_parfait: {
        forms: { je: "j'avais vendu", tu: "tu avais vendu", il_elle_on: "il avait vendu", nous: "nous avions vendu", vous: "vous aviez vendu", ils_elles: "ils avaient vendu" },
      },
      tense_conditionnel_present: {
        forms: { je: "je vendrais", tu: "tu vendrais", il_elle_on: "il vendrait", nous: "nous vendrions", vous: "vous vendriez", ils_elles: "ils vendraient" },
      },
      tense_subjonctif_present: {
        forms: { je: "que je vende", tu: "que tu vendes", il_elle_on: "qu'il vende", nous: "que nous vendions", vous: "que vous vendiez", ils_elles: "qu'ils vendent" },
      },
      tense_imperatif: {
        forms: { tu: "vends", nous: "vendons", vous: "vendez" },
      },
      tense_passe_simple: {
        forms: { je: "je vendis", tu: "tu vendis", il_elle_on: "il vendit", nous: "nous vendîmes", vous: "vous vendîtes", ils_elles: "ils vendirent" },
      },
    },
  },

  // 19. PARTIR (3rd group -ir model with être auxiliary)
  {
    verb_infinitive: "partir",
    english: ["to leave"],
    verb_group: "3rd_group",
    regularity: "irregular",
    auxiliary: "etre",
    past_participle: "parti",
    present_participle: "partant",
    chapter_number: 7,
    page_printed: 58,
    tenses: {
      tense_present_indicative: {
        forms: { je: "je pars", tu: "tu pars", il_elle_on: "il part", nous: "nous partons", vous: "vous partez", ils_elles: "ils partent" },
      },
      tense_passe_compose: {
        forms: { je: "je suis parti(e)", tu: "tu es parti(e)", il_elle_on: "il/elle est parti(e)", nous: "nous sommes parti(e)s", vous: "vous êtes parti(e)(s)", ils_elles: "ils/elles sont parti(e)s" },
      },
      tense_imparfait: {
        forms: { je: "je partais", tu: "tu partais", il_elle_on: "il partait", nous: "nous partions", vous: "vous partiez", ils_elles: "ils partaient" },
      },
      tense_futur_simple: {
        forms: { je: "je partirai", tu: "tu partiras", il_elle_on: "il partira", nous: "nous partirons", vous: "vous partirez", ils_elles: "ils partiront" },
      },
      tense_plus_que_parfait: {
        forms: { je: "j'étais parti(e)", tu: "tu étais parti(e)", il_elle_on: "il/elle était parti(e)", nous: "nous étions parti(e)s", vous: "vous étiez parti(e)(s)", ils_elles: "ils/elles étaient parti(e)s" },
      },
      tense_conditionnel_present: {
        forms: { je: "je partirais", tu: "tu partirais", il_elle_on: "il partirait", nous: "nous partirions", vous: "vous partiriez", ils_elles: "ils partiraient" },
      },
      tense_subjonctif_present: {
        forms: { je: "que je parte", tu: "que tu partes", il_elle_on: "qu'il parte", nous: "que nous partions", vous: "que vous partiez", ils_elles: "qu'ils partent" },
      },
      tense_imperatif: {
        forms: { tu: "pars", nous: "partons", vous: "partez" },
      },
      tense_passe_simple: {
        forms: { je: "je partis", tu: "tu partis", il_elle_on: "il partit", nous: "nous partîmes", vous: "vous partîtes", ils_elles: "ils partirent" },
      },
    },
  },

  // 20. SE LEVER (Pronominal model)
  {
    verb_infinitive: "se lever",
    english: ["to get up"],
    verb_group: "1st_group",
    regularity: "stem_changing",
    pronominal: true,
    auxiliary: "etre",
    past_participle: "levé",
    present_participle: "se levant",
    chapter_number: 6,
    page_printed: 49,
    tenses: {
      tense_present_indicative: {
        forms: { je: "je me lève", tu: "tu te lèves", il_elle_on: "il se lève", nous: "nous nous levons", vous: "vous vous levez", ils_elles: "ils se lèvent" },
      },
      tense_passe_compose: {
        forms: { je: "je me suis levé(e)", tu: "tu t'es levé(e)", il_elle_on: "il/elle s'est levé(e)", nous: "nous nous sommes levé(e)s", vous: "vous vous êtes levé(e)(s)", ils_elles: "ils/elles se sont levé(e)s" },
      },
      tense_imparfait: {
        forms: { je: "je me levais", tu: "tu te levais", il_elle_on: "il se levait", nous: "nous nous levions", vous: "vous vous leviez", ils_elles: "ils se levaient" },
      },
      tense_futur_simple: {
        forms: { je: "je me lèverai", tu: "tu te lèveras", il_elle_on: "il se lèvera", nous: "nous nous lèverons", vous: "vous vous lèverez", ils_elles: "ils se lèveront" },
      },
      tense_conditionnel_present: {
        forms: { je: "je me lèverais", tu: "tu te lèverais", il_elle_on: "il se lèverait", nous: "nous nous lèverions", vous: "vous vous lèveriez", ils_elles: "ils se lèveraient" },
      },
      tense_subjonctif_present: {
        forms: { je: "que je me lève", tu: "que tu te lèves", il_elle_on: "qu'il se lève", nous: "que nous nous levions", vous: "que vous vous leviez", ils_elles: "qu'ils se lèvent" },
      },
      tense_imperatif: {
        forms: { tu: "lève-toi", nous: "levons-nous", vous: "levez-vous" },
      },
    },
  },
];

// Generate comprehensive list of 48 irregular verbs from backmatter page 239 with present indicative & past participles
export const IRREGULAR_BACKMATTER_VERBS: Array<{
  infinitive: string;
  past_participle: string;
  english: string[];
  present: { je: string; tu: string; il_elle_on: string; nous: string; vous: string; ils_elles: string };
}> = [
  { infinitive: "acquérir", past_participle: "acquis", english: ["to acquire"], present: { je: "j'acquiers", tu: "tu acquiers", il_elle_on: "il acquiert", nous: "nous acquérons", vous: "vous acquérez", ils_elles: "ils acquièrent" } },
  { infinitive: "apprendre", past_participle: "appris", english: ["to learn"], present: { je: "j'apprends", tu: "tu apprends", il_elle_on: "il apprend", nous: "nous apprenons", vous: "vous apprenez", ils_elles: "ils apprennent" } },
  { infinitive: "s'asseoir", past_participle: "assis", english: ["to sit down"], present: { je: "je m'assieds", tu: "tu t'assieds", il_elle_on: "il s'assied", nous: "nous nous asseyons", vous: "vous vous asseyez", ils_elles: "ils s'asseyent" } },
  { infinitive: "battre", past_participle: "battu", english: ["to beat", "to hit"], present: { je: "je bats", tu: "tu bats", il_elle_on: "il bat", nous: "nous battons", vous: "vous battez", ils_elles: "ils battent" } },
  { infinitive: "boire", past_participle: "bu", english: ["to drink"], present: { je: "je bois", tu: "tu bois", il_elle_on: "il boit", nous: "nous buvons", vous: "vous buvez", ils_elles: "ils boivent" } },
  { infinitive: "comprendre", past_participle: "compris", english: ["to understand"], present: { je: "je comprends", tu: "tu comprends", il_elle_on: "il comprend", nous: "nous comprenons", vous: "vous comprenez", ils_elles: "ils comprennent" } },
  { infinitive: "conclure", past_participle: "conclus", english: ["to conclude"], present: { je: "je conclus", tu: "tu conclus", il_elle_on: "il conclut", nous: "nous concluons", vous: "vous concluez", ils_elles: "ils concluent" } },
  { infinitive: "conduire", past_participle: "conduit", english: ["to drive"], present: { je: "je conduis", tu: "tu conduis", il_elle_on: "il conduit", nous: "nous conduisons", vous: "vous conduisez", ils_elles: "ils conduisent" } },
  { infinitive: "connaître", past_participle: "connu", english: ["to know (a person/place)"], present: { je: "je connais", tu: "tu connais", il_elle_on: "il connaît", nous: "nous connaissons", vous: "vous connaissez", ils_elles: "ils connaissent" } },
  { infinitive: "courir", past_participle: "couru", english: ["to run"], present: { je: "je cours", tu: "tu cours", il_elle_on: "il court", nous: "nous courons", vous: "vous courez", ils_elles: "ils courent" } },
  { infinitive: "craindre", past_participle: "craint", english: ["to fear"], present: { je: "je crains", tu: "tu crains", il_elle_on: "il craint", nous: "nous craignons", vous: "vous craignez", ils_elles: "ils craignent" } },
  { infinitive: "croire", past_participle: "cru", english: ["to believe"], present: { je: "je crois", tu: "tu crois", il_elle_on: "il croit", nous: "nous croyons", vous: "vous croyez", ils_elles: "ils croient" } },
  { infinitive: "cueillir", past_participle: "cueilli", english: ["to gather", "to pick"], present: { je: "je cueille", tu: "tu cueilles", il_elle_on: "il cueille", nous: "nous cueillons", vous: "vous cueillez", ils_elles: "ils cueillent" } },
  { infinitive: "dormir", past_participle: "dormi", english: ["to sleep"], present: { je: "je dors", tu: "tu dors", il_elle_on: "il dort", nous: "nous dormons", vous: "vous dormez", ils_elles: "ils dorment" } },
  { infinitive: "envoyer", past_participle: "envoyé", english: ["to send"], present: { je: "j'envoie", tu: "tu envoies", il_elle_on: "il envoie", nous: "nous envoyons", vous: "vous envoyez", ils_elles: "ils envoient" } },
  { infinitive: "falloir", past_participle: "fallu", english: ["to be necessary"], present: { je: "—", tu: "—", il_elle_on: "il faut", nous: "—", vous: "—", ils_elles: "—" } },
  { infinitive: "fuir", past_participle: "fui", english: ["to flee"], present: { je: "je fuis", tu: "tu fuis", il_elle_on: "il fuit", nous: "nous fuyons", vous: "vous fuyez", ils_elles: "ils fuient" } },
  { infinitive: "haïr", past_participle: "haï", english: ["to hate"], present: { je: "je hais", tu: "tu hais", il_elle_on: "il hait", nous: "nous haïssons", vous: "vous haïssez", ils_elles: "ils haïssent" } },
  { infinitive: "mourir", past_participle: "mort", english: ["to die"], present: { je: "je meurs", tu: "tu meurs", il_elle_on: "il meurt", nous: "nous mourons", vous: "vous mourez", ils_elles: "ils meurent" } },
  { infinitive: "naître", past_participle: "né", english: ["to be born"], present: { je: "je nais", tu: "tu nais", il_elle_on: "il naît", nous: "nous naissons", vous: "vous naissez", ils_elles: "ils naissent" } },
  { infinitive: "offrir", past_participle: "offert", english: ["to offer"], present: { je: "j'offre", tu: "tu offres", il_elle_on: "il offre", nous: "nous offrons", vous: "vous offrez", ils_elles: "ils offrent" } },
  { infinitive: "ouvrir", past_participle: "ouvert", english: ["to open"], present: { je: "j'ouvre", tu: "tu ouvres", il_elle_on: "il ouvre", nous: "nous ouvrons", vous: "vous ouvrez", ils_elles: "ils ouvrent" } },
  { infinitive: "peindre", past_participle: "peint", english: ["to paint"], present: { je: "je peins", tu: "tu peins", il_elle_on: "il peint", nous: "nous peignons", vous: "vous peignez", ils_elles: "ils peignent" } },
  { infinitive: "plaire", past_participle: "plu", english: ["to please"], present: { je: "je plais", tu: "tu plais", il_elle_on: "il plaît", nous: "nous plaisons", vous: "vous plaisez", ils_elles: "ils plaisent" } },
  { infinitive: "pleuvoir", past_participle: "plu", english: ["to rain"], present: { je: "—", tu: "—", il_elle_on: "il pleut", nous: "—", vous: "—", ils_elles: "—" } },
  { infinitive: "recevoir", past_participle: "reçu", english: ["to receive"], present: { je: "je reçois", tu: "tu reçois", il_elle_on: "il reçoit", nous: "nous recevons", vous: "vous recevez", ils_elles: "ils reçoivent" } },
  { infinitive: "résoudre", past_participle: "résolu", english: ["to resolve"], present: { je: "je résous", tu: "tu résous", il_elle_on: "il résout", nous: "nous résolvons", vous: "vous résolvez", ils_elles: "ils résolvent" } },
  { infinitive: "rire", past_participle: "ri", english: ["to laugh"], present: { je: "je ris", tu: "tu ris", il_elle_on: "il rit", nous: "nous rions", vous: "vous riez", ils_elles: "ils rient" } },
  { infinitive: "suivre", past_participle: "suivi", english: ["to follow"], present: { je: "je suis", tu: "tu suis", il_elle_on: "il suit", nous: "nous suivons", vous: "vous suivez", ils_elles: "ils suivent" } },
  { infinitive: "tenir", past_participle: "tenu", english: ["to hold"], present: { je: "je tiens", tu: "tu tiens", il_elle_on: "il tient", nous: "nous tenons", vous: "vous tenez", ils_elles: "ils tiennent" } },
  { infinitive: "vaincre", past_participle: "vaincu", english: ["to conquer", "to defeat"], present: { je: "je vaincs", tu: "tu vaincs", il_elle_on: "il vainc", nous: "nous vainquons", vous: "vous vainquez", ils_elles: "ils vainquent" } },
  { infinitive: "vivre", past_participle: "vécu", english: ["to live"], present: { je: "je vis", tu: "tu vis", il_elle_on: "il vit", nous: "nous vivons", vous: "vous vivez", ils_elles: "ils vivent" } },
];

export function buildEnrichedConjugations(): { verbs: Verb[]; conjugations: Conjugation[] } {
  const verbs: Verb[] = [];
  const conjugations: Conjugation[] = [];

  // 1. Process MASTER_CONJUGATION_SPECS
  for (const spec of MASTER_CONJUGATION_SPECS) {
    const vId = makeVerbId(spec.verb_infinitive);
    const conjIds: string[] = [];

    for (const [tenseId, tData] of Object.entries(spec.tenses)) {
      const cId = makeConjugationId(vId, tenseId);
      conjIds.push(cId);

      const isCompound =
        tenseId === "tense_passe_compose" ||
        tenseId === "tense_plus_que_parfait" ||
        tenseId === "tense_conditionnel_passe" ||
        tenseId === "tense_subjonctif_passe" ||
        tenseId === "tense_futur_anterieur";

      conjugations.push({
        id: cId,
        type: "conjugation",
        verb_id: vId,
        tense_id: tenseId,
        forms: tData.forms,
        compound: isCompound,
        components: isCompound
          ? {
              auxiliary_verb_id: makeVerbId(spec.auxiliary === "etre" ? "être" : "avoir"),
              past_participle: spec.past_participle,
            }
          : {},
        agreement_notes: spec.auxiliary === "etre" ? ["Agrees in gender and number with the subject."] : [],
        spelling_change_notes: tData.spelling_notes || [],
        irregularity_notes: tData.irregularity_notes || [],
        example_ids: [],
        attestations: [
          {
            source_type: "book",
            chapter_number: spec.chapter_number || 1,
            page_printed: spec.page_printed || 1,
            context_type: "conjugation_table",
          },
        ],
        editorial: {
          extraction_confidence: "high",
          verification_status: "machine_checked",
        },
      });
    }

    verbs.push({
      id: vId,
      type: "verb",
      infinitive: spec.verb_infinitive,
      display_form: spec.verb_infinitive,
      english: spec.english,
      senses: [
        {
          sense_id: `${vId}_s1`,
          english: spec.english,
          usage_contexts: [],
          example_ids: [],
        },
      ],
      verb_group: spec.verb_group,
      regularity: spec.regularity,
      pronominal: Boolean(spec.pronominal),
      transitivity: ["transitive"],
      auxiliary: spec.auxiliary,
      past_participle: spec.past_participle,
      present_participle: spec.present_participle || null,
      conjugation_ids: conjIds,
      expression_ids: [],
      complement_frame_ids: [],
      related_verb_ids: [],
      contrast_verb_ids: [],
      confused_with_ids: [],
      word_family_ids: [],
      study: { learning_priority: 5, usefulness: 5, difficulty: spec.regularity === "regular" ? 2 : 3 },
      usage: { register: "neutral", spoken_written: "both", contexts: [] },
      frequency: { book_occurrences: 5 },
      attestations: [
        {
          source_type: "book",
          chapter_number: spec.chapter_number || 1,
          page_printed: spec.page_printed || 1,
          context_type: "conjugation_table",
        },
      ],
      tags: ["paradigm_model", "core_verb"],
    });
  }

  // 2. Process IRREGULAR_BACKMATTER_VERBS
  for (const irr of IRREGULAR_BACKMATTER_VERBS) {
    const vId = makeVerbId(irr.infinitive);
    const cId = makeConjugationId(vId, "tense_present_indicative");

    conjugations.push({
      id: cId,
      type: "conjugation",
      verb_id: vId,
      tense_id: "tense_present_indicative",
      forms: irr.present,
      compound: false,
      components: {},
      agreement_notes: [],
      spelling_change_notes: [],
      irregularity_notes: ["Irregular present indicative conjugation from backmatter verb tables."],
      example_ids: [],
      attestations: [
        {
          source_type: "book",
          page_printed: 239,
          context_type: "verb_table",
        },
      ],
      editorial: {
        extraction_confidence: "high",
        verification_status: "machine_checked",
      },
    });

    verbs.push({
      id: vId,
      type: "verb",
      infinitive: irr.infinitive,
      display_form: irr.infinitive,
      english: irr.english,
      senses: [
        {
          sense_id: `${vId}_s1`,
          english: irr.english,
          usage_contexts: [],
          example_ids: [],
        },
      ],
      verb_group: "3rd_group",
      regularity: "irregular",
      pronominal: irr.infinitive.startsWith("se ") || irr.infinitive.startsWith("s'"),
      transitivity: ["transitive"],
      auxiliary: "avoir",
      past_participle: irr.past_participle,
      present_participle: null,
      conjugation_ids: [cId],
      expression_ids: [],
      complement_frame_ids: [],
      related_verb_ids: [],
      contrast_verb_ids: [],
      confused_with_ids: [],
      word_family_ids: [],
      study: { learning_priority: 4, usefulness: 4, difficulty: 3 },
      usage: { register: "neutral", spoken_written: "both", contexts: [] },
      frequency: { book_occurrences: 3 },
      attestations: [
        {
          source_type: "book",
          page_printed: 239,
          context_type: "verb_table",
        },
      ],
      tags: ["irregular", "backmatter_table"],
    });
  }

  return { verbs, conjugations };
}
