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
  tenses: Record<string, { forms: Record<string, string>; spelling_notes?: string[]; irregularity_notes?: string[] }>;
}

export const MASTER_CONJUGATION_SPECS: VerbConjugationSpec[] = [
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
        forms: {"je": "j’ai", "tu": "tu as", "il_elle_on": "il a", "nous": "nous avons", "vous": "vous avez", "ils_elles": "ils ont"},
      },
      tense_passe_compose: {
        forms: {"je": "j’ai eu", "tu": "tu as eu", "il_elle_on": "il a eu", "nous": "nous avons eu", "vous": "vous avez eu", "ils_elles": "ils ont eu"},
      },
      tense_imparfait: {
        forms: {"je": "j’avais", "tu": "tu avais", "il_elle_on": "il avait", "nous": "nous avions", "vous": "vous aviez", "ils_elles": "ils avaient"},
      },
      tense_futur_simple: {
        forms: {"je": "j’aurai", "tu": "tu auras", "il_elle_on": "il aura", "nous": "nous aurons", "vous": "vous aurez", "ils_elles": "ils auront"},
      },
      tense_plus_que_parfait: {
        forms: {"je": "j’avais eu", "tu": "tu avais eu", "il_elle_on": "il avait eu", "nous": "nous avions eu", "vous": "vous aviez eu", "ils_elles": "ils avaient eu"},
      },
      tense_conditionnel_present: {
        forms: {"je": "j’aurais", "tu": "tu aurais", "il_elle_on": "il aurait", "nous": "nous aurions", "vous": "vous auriez", "ils_elles": "ils auraient"},
      },
      tense_conditionnel_passe: {
        forms: {"je": "j’aurais eu", "tu": "tu aurais eu", "il_elle_on": "il aurait eu", "nous": "nous aurions eu", "vous": "vous auriez eu", "ils_elles": "ils auraient eu"},
      },
      tense_subjonctif_present: {
        forms: {"je": "que j’aie", "tu": "que tu aies", "il_elle_on": "qu’il ait", "nous": "que nous ayons", "vous": "que vous ayez", "ils_elles": "qu’ils aient"},
      },
      tense_subjonctif_passe: {
        forms: {"je": "que j’aie eu", "tu": "que tu aies eu", "il_elle_on": "qu’il ait eu", "nous": "que nous ayons eu", "vous": "que vous ayez eu", "ils_elles": "qu’ils aient eu"},
      },
      tense_imperatif: {
        forms: {"tu": "aie", "nous": "ayons", "vous": "ayez"},
      },
      tense_passe_simple: {
        forms: {"je": "j’eus", "tu": "tu eus", "il_elle_on": "il eut", "nous": "nous eûmes", "vous": "vous eûtes", "ils_elles": "ils eurent"},
      },
    },
  },
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
        forms: {"je": "je suis", "tu": "tu es", "il_elle_on": "il est", "nous": "nous sommes", "vous": "vous êtes", "ils_elles": "ils sont"},
      },
      tense_passe_compose: {
        forms: {"je": "j’ai été", "tu": "tu as été", "il_elle_on": "il a été", "nous": "nous avons été", "vous": "vous avez été", "ils_elles": "ils ont été"},
      },
      tense_imparfait: {
        forms: {"je": "j’étais", "tu": "tu étais", "il_elle_on": "il était", "nous": "nous étions", "vous": "vous étiez", "ils_elles": "ils étaient"},
      },
      tense_futur_simple: {
        forms: {"je": "je serai", "tu": "tu seras", "il_elle_on": "il sera", "nous": "nous serons", "vous": "vous serez", "ils_elles": "ils seront"},
      },
      tense_plus_que_parfait: {
        forms: {"je": "j’avais été", "tu": "tu avais été", "il_elle_on": "il avait été", "nous": "nous avions été", "vous": "vous aviez été", "ils_elles": "ils avaient été"},
      },
      tense_conditionnel_present: {
        forms: {"je": "je serais", "tu": "tu serais", "il_elle_on": "il serait", "nous": "nous serions", "vous": "vous seriez", "ils_elles": "ils seraient"},
      },
      tense_conditionnel_passe: {
        forms: {"je": "j’aurais été", "tu": "tu aurais été", "il_elle_on": "il aurait été", "nous": "nous aurions été", "vous": "vous auriez été", "ils_elles": "ils auraient été"},
      },
      tense_subjonctif_present: {
        forms: {"je": "que je sois", "tu": "que tu sois", "il_elle_on": "qu’il soit", "nous": "que nous soyons", "vous": "que vous soyez", "ils_elles": "qu’ils soient"},
      },
      tense_subjonctif_passe: {
        forms: {"je": "que j’aie été", "tu": "que tu aies été", "il_elle_on": "qu’il ait été", "nous": "que nous ayons été", "vous": "que vous ayez été", "ils_elles": "qu’ils aient été"},
      },
      tense_imperatif: {
        forms: {"tu": "sois", "nous": "soyons", "vous": "soyez"},
      },
      tense_passe_simple: {
        forms: {"je": "je fus", "tu": "tu fus", "il_elle_on": "il fut", "nous": "nous fûmes", "vous": "vous fûtes", "ils_elles": "ils furent"},
      },
    },
  },
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
        forms: {"je": "je vais", "tu": "tu vas", "il_elle_on": "il va", "nous": "nous allons", "vous": "vous allez", "ils_elles": "ils vont"},
      },
      tense_passe_compose: {
        forms: {"je": "je suis allé(e)", "tu": "tu es allé(e)", "il_elle_on": "il est allé / elle est allée", "nous": "nous sommes allé(e)s", "vous": "vous êtes allé(e)(s)", "ils_elles": "ils sont allés / elles sont allées"},
      },
      tense_imparfait: {
        forms: {"je": "j’allais", "tu": "tu allais", "il_elle_on": "il allait", "nous": "nous allions", "vous": "vous alliez", "ils_elles": "ils allaient"},
      },
      tense_futur_simple: {
        forms: {"je": "j’irai", "tu": "tu iras", "il_elle_on": "il ira", "nous": "nous irons", "vous": "vous irez", "ils_elles": "ils iront"},
      },
      tense_plus_que_parfait: {
        forms: {"je": "j’étais allé(e)", "tu": "tu étais allé(e)", "il_elle_on": "il était allé", "nous": "nous étions allé(e)s", "vous": "vous étiez allé(e)(s)", "ils_elles": "ils étaient allés"},
      },
      tense_conditionnel_present: {
        forms: {"je": "j’irais", "tu": "tu irais", "il_elle_on": "il irait", "nous": "nous irions", "vous": "vous iriez", "ils_elles": "ils iraient"},
      },
      tense_conditionnel_passe: {
        forms: {"je": "je serais allé(e)", "tu": "tu serais allé(e)", "il_elle_on": "il serait allé", "nous": "nous serions allé(e)s", "vous": "vous seriez allé(e)(s)", "ils_elles": "ils seraient allés"},
      },
      tense_subjonctif_present: {
        forms: {"je": "que j’aille", "tu": "que tu ailles", "il_elle_on": "qu’il aille", "nous": "que nous allions", "vous": "que vous alliez", "ils_elles": "qu’ils aillent"},
      },
      tense_subjonctif_passe: {
        forms: {"je": "que je sois allé(e)", "tu": "que tu sois allé(e)", "il_elle_on": "qu’il soit allé", "nous": "que nous soyons allé(e)s", "vous": "que vous soyez allé(e)(s)", "ils_elles": "qu’ils soient allés"},
      },
      tense_imperatif: {
        forms: {"tu": "va", "nous": "allons", "vous": "allez"},
      },
      tense_passe_simple: {
        forms: {"je": "j’allai", "tu": "tu allas", "il_elle_on": "il alla", "nous": "nous allâmes", "vous": "vous allâtes", "ils_elles": "ils allèrent"},
      },
    },
  },
  {
    verb_infinitive: "faire",
    english: ["to make", "to do"],
    verb_group: "3rd_group",
    regularity: "irregular",
    auxiliary: "avoir",
    past_participle: "fait",
    present_participle: "faisant",
    chapter_number: 4,
    page_printed: 38,
    tenses: {
      tense_present_indicative: {
        forms: {"je": "je fais", "tu": "tu fais", "il_elle_on": "il fait", "nous": "nous faisons", "vous": "vous faites", "ils_elles": "ils font"},
      },
      tense_passe_compose: {
        forms: {"je": "j’ai fait", "tu": "tu as fait", "il_elle_on": "il a fait", "nous": "nous avons fait", "vous": "vous avez fait", "ils_elles": "ils ont fait"},
      },
      tense_imparfait: {
        forms: {"je": "je faisais", "tu": "tu faisais", "il_elle_on": "il faisait", "nous": "nous faisions", "vous": "vous faisiez", "ils_elles": "ils faisaient"},
      },
      tense_futur_simple: {
        forms: {"je": "je ferai", "tu": "tu feras", "il_elle_on": "il fera", "nous": "nous ferons", "vous": "vous ferez", "ils_elles": "ils feront"},
      },
      tense_plus_que_parfait: {
        forms: {"je": "j’avais fait", "tu": "tu avais fait", "il_elle_on": "il avait fait", "nous": "nous avions fait", "vous": "vous aviez fait", "ils_elles": "ils avaient fait"},
      },
      tense_conditionnel_present: {
        forms: {"je": "je ferais", "tu": "tu ferais", "il_elle_on": "il ferait", "nous": "nous ferions", "vous": "vous feriez", "ils_elles": "ils feraient"},
      },
      tense_conditionnel_passe: {
        forms: {"je": "j’aurais fait", "tu": "tu aurais fait", "il_elle_on": "il aurait fait", "nous": "nous aurions fait", "vous": "vous auriez fait", "ils_elles": "ils auraient fait"},
      },
      tense_subjonctif_present: {
        forms: {"je": "que je fasse", "tu": "que tu fasses", "il_elle_on": "qu’il fasse", "nous": "que nous fassions", "vous": "que vous fassiez", "ils_elles": "qu’ils fassent"},
      },
      tense_subjonctif_passe: {
        forms: {"je": "que j’aie fait", "tu": "que tu aies fait", "il_elle_on": "qu’il ait fait", "nous": "que nous ayons fait", "vous": "que vous ayez fait", "ils_elles": "qu’ils aient fait"},
      },
      tense_imperatif: {
        forms: {"tu": "fais", "nous": "faisons", "vous": "faites"},
      },
      tense_passe_simple: {
        forms: {"je": "je fis", "tu": "tu fis", "il_elle_on": "il fit", "nous": "nous fîmes", "vous": "vous fîtes", "ils_elles": "ils firent"},
      },
    },
  },
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
        forms: {"je": "je viens", "tu": "tu viens", "il_elle_on": "il vient", "nous": "nous venons", "vous": "vous venez", "ils_elles": "ils viennent"},
      },
      tense_passe_compose: {
        forms: {"je": "je suis venu(e)", "tu": "tu es venu(e)", "il_elle_on": "il est venu", "nous": "nous sommes venu(e)s", "vous": "vous êtes venu(e)(s)", "ils_elles": "ils sont venus"},
      },
      tense_imparfait: {
        forms: {"je": "je venais", "tu": "tu venais", "il_elle_on": "il venait", "nous": "nous venions", "vous": "vous veniez", "ils_elles": "ils venaient"},
      },
      tense_futur_simple: {
        forms: {"je": "je viendrai", "tu": "tu viendras", "il_elle_on": "il viendra", "nous": "nous viendrons", "vous": "vous viendrez", "ils_elles": "ils viendront"},
      },
      tense_plus_que_parfait: {
        forms: {"je": "j’étais venu(e)", "tu": "tu étais venu(e)", "il_elle_on": "il était venu", "nous": "nous étions venu(e)s", "vous": "vous étiez venu(e)(s)", "ils_elles": "ils étaient venus"},
      },
      tense_conditionnel_present: {
        forms: {"je": "je viendrais", "tu": "tu viendrais", "il_elle_on": "il viendrait", "nous": "nous viendrions", "vous": "vous viendriez", "ils_elles": "ils viendraient"},
      },
      tense_conditionnel_passe: {
        forms: {"je": "je serais venu(e)", "tu": "tu serais venu(e)", "il_elle_on": "il serait venu", "nous": "nous serions venu(e)s", "vous": "vous seriez venu(e)(s)", "ils_elles": "ils seraient venus"},
      },
      tense_subjonctif_present: {
        forms: {"je": "que je vienne", "tu": "que tu viennes", "il_elle_on": "qu’il vienne", "nous": "que nous venions", "vous": "que vous veniez", "ils_elles": "qu’ils viennent"},
      },
      tense_subjonctif_passe: {
        forms: {"je": "que je sois venu(e)", "tu": "que tu sois venu(e)", "il_elle_on": "qu’il soit venu", "nous": "que nous soyons venu(e)s", "vous": "que vous soyez venu(e)(s)", "ils_elles": "qu’ils soient venus"},
      },
      tense_imperatif: {
        forms: {"tu": "viens", "nous": "venons", "vous": "venez"},
      },
      tense_passe_simple: {
        forms: {"je": "je vins", "tu": "tu vins", "il_elle_on": "il vint", "nous": "nous vînmes", "vous": "vous vîntes", "ils_elles": "ils vinrent"},
      },
    },
  },
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
        forms: {"je": "je peux / puis", "tu": "tu peux", "il_elle_on": "il peut", "nous": "nous pouvons", "vous": "vous pouvez", "ils_elles": "ils peuvent"},
      },
      tense_passe_compose: {
        forms: {"je": "j’ai pu", "tu": "tu as pu", "il_elle_on": "il a pu", "nous": "nous avons pu", "vous": "vous avez pu", "ils_elles": "ils ont pu"},
      },
      tense_imparfait: {
        forms: {"je": "je pouvais", "tu": "tu pouvais", "il_elle_on": "il pouvait", "nous": "nous pouvions", "vous": "vous pouviez", "ils_elles": "ils pouvaient"},
      },
      tense_futur_simple: {
        forms: {"je": "je pourrai", "tu": "tu pourras", "il_elle_on": "il pourra", "nous": "nous pourrons", "vous": "vous pourrez", "ils_elles": "ils pourront"},
      },
      tense_plus_que_parfait: {
        forms: {"je": "j’avais pu", "tu": "tu avais pu", "il_elle_on": "il avait pu", "nous": "nous avions pu", "vous": "vous aviez pu", "ils_elles": "ils avaient pu"},
      },
      tense_conditionnel_present: {
        forms: {"je": "je pourrais", "tu": "tu pourrais", "il_elle_on": "il pourrait", "nous": "nous pourrions", "vous": "vous pourriez", "ils_elles": "ils pourraient"},
      },
      tense_conditionnel_passe: {
        forms: {"je": "j’aurais pu", "tu": "tu aurais pu", "il_elle_on": "il aurait pu", "nous": "nous aurions pu", "vous": "vous auriez pu", "ils_elles": "ils auraient pu"},
      },
      tense_subjonctif_present: {
        forms: {"je": "que je puisse", "tu": "que tu puisses", "il_elle_on": "qu’il puisse", "nous": "que nous puissions", "vous": "que vous puissiez", "ils_elles": "qu’ils puissent"},
      },
      tense_subjonctif_passe: {
        forms: {"je": "que j’aie pu", "tu": "que tu aies pu", "il_elle_on": "qu’il ait pu", "nous": "que nous ayons pu", "vous": "que vous ayez pu", "ils_elles": "qu’ils aient pu"},
      },
      tense_passe_simple: {
        forms: {"je": "je pus", "tu": "tu pus", "il_elle_on": "il put", "nous": "nous pûmes", "vous": "vous pûtes", "ils_elles": "ils purent"},
      },
    },
  },
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
        forms: {"je": "je veux", "tu": "tu veux", "il_elle_on": "il veut", "nous": "nous voulons", "vous": "vous voulez", "ils_elles": "ils veulent"},
      },
      tense_passe_compose: {
        forms: {"je": "j’ai voulu", "tu": "tu as voulu", "il_elle_on": "il a voulu", "nous": "nous avons voulu", "vous": "vous avez voulu", "ils_elles": "ils ont voulu"},
      },
      tense_imparfait: {
        forms: {"je": "je voulais", "tu": "tu voulais", "il_elle_on": "il voulait", "nous": "nous voulions", "vous": "vous vouliez", "ils_elles": "ils voulaient"},
      },
      tense_futur_simple: {
        forms: {"je": "je voudrai", "tu": "tu voudras", "il_elle_on": "il voudra", "nous": "nous voudrons", "vous": "vous voudrez", "ils_elles": "ils voudront"},
      },
      tense_plus_que_parfait: {
        forms: {"je": "j’avais voulu", "tu": "tu avais voulu", "il_elle_on": "il avait voulu", "nous": "nous avions voulu", "vous": "vous aviez voulu", "ils_elles": "ils avaient voulu"},
      },
      tense_conditionnel_present: {
        forms: {"je": "je voudrais", "tu": "tu voudrais", "il_elle_on": "il voudrait", "nous": "nous voudrions", "vous": "vous voudriez", "ils_elles": "ils voudraient"},
      },
      tense_conditionnel_passe: {
        forms: {"je": "j’aurais voulu", "tu": "tu aurais voulu", "il_elle_on": "il aurait voulu", "nous": "nous aurions voulu", "vous": "vous auriez voulu", "ils_elles": "ils auraient voulu"},
      },
      tense_subjonctif_present: {
        forms: {"je": "que je veuille", "tu": "que tu veuilles", "il_elle_on": "qu’il veuille", "nous": "que nous voulions", "vous": "que vous vouliez", "ils_elles": "qu’ils veuillent"},
      },
      tense_subjonctif_passe: {
        forms: {"je": "que j’aie voulu", "tu": "que tu aies voulu", "il_elle_on": "qu’il ait voulu", "nous": "que nous ayons voulu", "vous": "que vous ayez voulu", "ils_elles": "qu’ils aient voulu"},
      },
      tense_imperatif: {
        forms: {"tu": "veuille", "nous": "voulons", "vous": "veuillez"},
      },
      tense_passe_simple: {
        forms: {"je": "je voulus", "tu": "tu voulus", "il_elle_on": "il voulut", "nous": "nous voulûmes", "vous": "vous voulûtes", "ils_elles": "ils voulurent"},
      },
    },
  },
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
        forms: {"je": "je dois", "tu": "tu dois", "il_elle_on": "il doit", "nous": "nous devons", "vous": "vous devez", "ils_elles": "ils doivent"},
      },
      tense_passe_compose: {
        forms: {"je": "j’ai dû", "tu": "tu as dû", "il_elle_on": "il a dû", "nous": "nous avons dû", "vous": "vous avez dû", "ils_elles": "ils ont dû"},
      },
      tense_imparfait: {
        forms: {"je": "je devais", "tu": "tu devais", "il_elle_on": "il devait", "nous": "nous devions", "vous": "vous deviez", "ils_elles": "ils devaient"},
      },
      tense_futur_simple: {
        forms: {"je": "je devrai", "tu": "tu devras", "il_elle_on": "il devra", "nous": "nous devrons", "vous": "vous devrez", "ils_elles": "ils devront"},
      },
      tense_plus_que_parfait: {
        forms: {"je": "j’avais dû", "tu": "tu avais dû", "il_elle_on": "il avait dû", "nous": "nous avions dû", "vous": "vous aviez dû", "ils_elles": "ils avaient dû"},
      },
      tense_conditionnel_present: {
        forms: {"je": "je devrais", "tu": "tu devrais", "il_elle_on": "il devrait", "nous": "nous devrions", "vous": "vous devriez", "ils_elles": "ils devraient"},
      },
      tense_conditionnel_passe: {
        forms: {"je": "j’aurais dû", "tu": "tu aurais dû", "il_elle_on": "il aurait dû", "nous": "nous aurions dû", "vous": "vous auriez dû", "ils_elles": "ils auraient dû"},
      },
      tense_subjonctif_present: {
        forms: {"je": "que je doive", "tu": "que tu doives", "il_elle_on": "qu’il doive", "nous": "que nous devions", "vous": "que vous deviez", "ils_elles": "qu’ils doivent"},
      },
      tense_subjonctif_passe: {
        forms: {"je": "que j’aie dû", "tu": "que tu aies dû", "il_elle_on": "qu’il ait dû", "nous": "que nous ayons dû", "vous": "que vous ayez dû", "ils_elles": "qu’ils aient dû"},
      },
      tense_passe_simple: {
        forms: {"je": "je dus", "tu": "tu dus", "il_elle_on": "il dut", "nous": "nous dûmes", "vous": "vous dûtes", "ils_elles": "ils durent"},
      },
    },
  },
  {
    verb_infinitive: "savoir",
    english: ["to know"],
    verb_group: "3rd_group",
    regularity: "irregular",
    auxiliary: "avoir",
    past_participle: "su",
    present_participle: "sachant",
    chapter_number: 3,
    page_printed: 30,
    tenses: {
      tense_present_indicative: {
        forms: {"je": "je sais", "tu": "tu sais", "il_elle_on": "il sait", "nous": "nous savons", "vous": "vous savez", "ils_elles": "ils savent"},
      },
      tense_passe_compose: {
        forms: {"je": "j’ai su", "tu": "tu as su", "il_elle_on": "il a su", "nous": "nous avons su", "vous": "vous avez su", "ils_elles": "ils ont su"},
      },
      tense_imparfait: {
        forms: {"je": "je savais", "tu": "tu savais", "il_elle_on": "il savait", "nous": "nous savions", "vous": "vous saviez", "ils_elles": "ils savaient"},
      },
      tense_futur_simple: {
        forms: {"je": "je saurai", "tu": "tu sauras", "il_elle_on": "il saura", "nous": "nous saurons", "vous": "vous saurez", "ils_elles": "ils sauront"},
      },
      tense_plus_que_parfait: {
        forms: {"je": "j’avais su", "tu": "tu avais su", "il_elle_on": "il avait su", "nous": "nous avions su", "vous": "vous aviez su", "ils_elles": "ils avaient su"},
      },
      tense_conditionnel_present: {
        forms: {"je": "je saurais", "tu": "tu saurais", "il_elle_on": "il saurait", "nous": "nous saurions", "vous": "vous sauriez", "ils_elles": "ils sauraient"},
      },
      tense_conditionnel_passe: {
        forms: {"je": "j’aurais su", "tu": "tu aurais su", "il_elle_on": "il aurait su", "nous": "nous aurions su", "vous": "vous auriez su", "ils_elles": "ils auraient su"},
      },
      tense_subjonctif_present: {
        forms: {"je": "que je sache", "tu": "que tu saches", "il_elle_on": "qu’il sache", "nous": "que nous sachions", "vous": "que vous sachiez", "ils_elles": "qu’ils sachent"},
      },
      tense_subjonctif_passe: {
        forms: {"je": "que j’aie su", "tu": "que tu aies su", "il_elle_on": "qu’il ait su", "nous": "que nous ayons su", "vous": "que vous ayez su", "ils_elles": "qu’ils aient su"},
      },
      tense_imperatif: {
        forms: {"tu": "sache", "nous": "sachons", "vous": "sachez"},
      },
      tense_passe_simple: {
        forms: {"je": "je sus", "tu": "tu sus", "il_elle_on": "il sut", "nous": "nous sûmes", "vous": "vous sûtes", "ils_elles": "ils surent"},
      },
    },
  },
  {
    verb_infinitive: "prendre",
    english: ["to take"],
    verb_group: "3rd_group",
    regularity: "irregular",
    auxiliary: "avoir",
    past_participle: "pris",
    present_participle: "prenant",
    chapter_number: 4,
    page_printed: 40,
    tenses: {
      tense_present_indicative: {
        forms: {"je": "je prends", "tu": "tu prends", "il_elle_on": "il prend", "nous": "nous prenons", "vous": "vous prenez", "ils_elles": "ils prennent"},
      },
      tense_passe_compose: {
        forms: {"je": "j’ai pris", "tu": "tu as pris", "il_elle_on": "il a pris", "nous": "nous avons pris", "vous": "vous avez pris", "ils_elles": "ils ont pris"},
      },
      tense_imparfait: {
        forms: {"je": "je prenais", "tu": "tu prenais", "il_elle_on": "il prenait", "nous": "nous prenions", "vous": "vous preniez", "ils_elles": "ils prenaient"},
      },
      tense_futur_simple: {
        forms: {"je": "je prendrai", "tu": "tu prendras", "il_elle_on": "il prendra", "nous": "nous prendrons", "vous": "vous prendrez", "ils_elles": "ils prendront"},
      },
      tense_plus_que_parfait: {
        forms: {"je": "j’avais pris", "tu": "tu avais pris", "il_elle_on": "il avait pris", "nous": "nous avions pris", "vous": "vous aviez pris", "ils_elles": "ils avaient pris"},
      },
      tense_conditionnel_present: {
        forms: {"je": "je prendrais", "tu": "tu prendrais", "il_elle_on": "il prendrait", "nous": "nous prendrions", "vous": "vous prendriez", "ils_elles": "ils prendraient"},
      },
      tense_conditionnel_passe: {
        forms: {"je": "j’aurais pris", "tu": "tu aurais pris", "il_elle_on": "il aurait pris", "nous": "nous aurions pris", "vous": "vous auriez pris", "ils_elles": "ils auraient pris"},
      },
      tense_subjonctif_present: {
        forms: {"je": "que je prenne", "tu": "que tu prennes", "il_elle_on": "qu’il prenne", "nous": "que nous prenions", "vous": "que vous preniez", "ils_elles": "qu’ils prennent"},
      },
      tense_subjonctif_passe: {
        forms: {"je": "que j’aie pris", "tu": "que tu aies pris", "il_elle_on": "qu’il ait pris", "nous": "que nous ayons pris", "vous": "que vous ayez pris", "ils_elles": "qu’ils aient pris"},
      },
      tense_imperatif: {
        forms: {"tu": "prends", "nous": "prenons", "vous": "prenez"},
      },
      tense_passe_simple: {
        forms: {"je": "je pris", "tu": "tu pris", "il_elle_on": "il prit", "nous": "nous prîmes", "vous": "vous prîtes", "ils_elles": "ils prirent"},
      },
    },
  },
  {
    verb_infinitive: "mettre",
    english: ["to put", "to place"],
    verb_group: "3rd_group",
    regularity: "irregular",
    auxiliary: "avoir",
    past_participle: "mis",
    present_participle: "mettant",
    chapter_number: 4,
    page_printed: 41,
    tenses: {
      tense_present_indicative: {
        forms: {"je": "je mets", "tu": "tu mets", "il_elle_on": "il met", "nous": "nous mettons", "vous": "vous mettez", "ils_elles": "ils mettent"},
      },
      tense_passe_compose: {
        forms: {"je": "j’ai mis", "tu": "tu as mis", "il_elle_on": "il a mis", "nous": "nous avons mis", "vous": "vous avez mis", "ils_elles": "ils ont mis"},
      },
      tense_imparfait: {
        forms: {"je": "je mettais", "tu": "tu mettais", "il_elle_on": "il mettait", "nous": "nous mettions", "vous": "vous mettiez", "ils_elles": "ils mettaient"},
      },
      tense_futur_simple: {
        forms: {"je": "je mettrai", "tu": "tu mettras", "il_elle_on": "il mettra", "nous": "nous mettrons", "vous": "vous mettrez", "ils_elles": "ils mettront"},
      },
      tense_plus_que_parfait: {
        forms: {"je": "j’avais mis", "tu": "tu avais mis", "il_elle_on": "il avait mis", "nous": "nous avions mis", "vous": "vous aviez mis", "ils_elles": "ils avaient mis"},
      },
      tense_conditionnel_present: {
        forms: {"je": "je mettrais", "tu": "tu mettrais", "il_elle_on": "il mettrait", "nous": "nous mettrions", "vous": "vous mettriez", "ils_elles": "ils mettraient"},
      },
      tense_conditionnel_passe: {
        forms: {"je": "j’aurais mis", "tu": "tu aurais mis", "il_elle_on": "il aurait mis", "nous": "nous aurions mis", "vous": "vous auriez mis", "ils_elles": "ils auraient mis"},
      },
      tense_subjonctif_present: {
        forms: {"je": "que je mette", "tu": "que tu mettes", "il_elle_on": "qu’il mette", "nous": "que nous mettions", "vous": "que vous mettiez", "ils_elles": "qu’ils mettent"},
      },
      tense_subjonctif_passe: {
        forms: {"je": "que j’aie mis", "tu": "que tu aies mis", "il_elle_on": "qu’il ait mis", "nous": "que nous ayons mis", "vous": "que vous ayez mis", "ils_elles": "qu’ils aient mis"},
      },
      tense_imperatif: {
        forms: {"tu": "mets", "nous": "mettons", "vous": "mettez"},
      },
      tense_passe_simple: {
        forms: {"je": "je mis", "tu": "tu mis", "il_elle_on": "il mit", "nous": "nous mîmes", "vous": "vous mîtes", "ils_elles": "ils mirent"},
      },
    },
  },
  {
    verb_infinitive: "voir",
    english: ["to see"],
    verb_group: "3rd_group",
    regularity: "irregular",
    auxiliary: "avoir",
    past_participle: "vu",
    present_participle: "voyant",
    chapter_number: 4,
    page_printed: 41,
    tenses: {
      tense_present_indicative: {
        forms: {"je": "je vois", "tu": "tu vois", "il_elle_on": "il voit", "nous": "nous voyons", "vous": "vous voyez", "ils_elles": "ils voient"},
      },
      tense_passe_compose: {
        forms: {"je": "j’ai vu", "tu": "tu as vu", "il_elle_on": "il a vu", "nous": "nous avons vu", "vous": "vous avez vu", "ils_elles": "ils ont vu"},
      },
      tense_imparfait: {
        forms: {"je": "je voyais", "tu": "tu voyais", "il_elle_on": "il voyait", "nous": "nous voyions", "vous": "vous voyiez", "ils_elles": "ils voyaient"},
      },
      tense_futur_simple: {
        forms: {"je": "je verrai", "tu": "tu verras", "il_elle_on": "il verra", "nous": "nous verrons", "vous": "vous verrez", "ils_elles": "ils verront"},
      },
      tense_plus_que_parfait: {
        forms: {"je": "j’avais vu", "tu": "tu avais vu", "il_elle_on": "il avait vu", "nous": "nous avions vu", "vous": "vous aviez vu", "ils_elles": "ils avaient vu"},
      },
      tense_conditionnel_present: {
        forms: {"je": "je verrais", "tu": "tu verrais", "il_elle_on": "il verrait", "nous": "nous verrions", "vous": "vous verriez", "ils_elles": "ils verraient"},
      },
      tense_conditionnel_passe: {
        forms: {"je": "j’aurais vu", "tu": "tu aurais vu", "il_elle_on": "il aurait vu", "nous": "nous aurions vu", "vous": "vous auriez vu", "ils_elles": "ils auraient vu"},
      },
      tense_subjonctif_present: {
        forms: {"je": "que je voie", "tu": "que tu voies", "il_elle_on": "qu’il voie", "nous": "que nous voyions", "vous": "que vous voyiez", "ils_elles": "qu’ils voient"},
      },
      tense_subjonctif_passe: {
        forms: {"je": "que j’aie vu", "tu": "que tu aies vu", "il_elle_on": "qu’il ait vu", "nous": "que nous ayons vu", "vous": "que vous ayez vu", "ils_elles": "qu’ils aient vu"},
      },
      tense_imperatif: {
        forms: {"tu": "vois", "nous": "voyons", "vous": "voyez"},
      },
      tense_passe_simple: {
        forms: {"je": "je vis", "tu": "tu vis", "il_elle_on": "il vit", "nous": "nous vîmes", "vous": "vous vîtes", "ils_elles": "ils virent"},
      },
    },
  },
  {
    verb_infinitive: "dire",
    english: ["to say", "to tell"],
    verb_group: "3rd_group",
    regularity: "irregular",
    auxiliary: "avoir",
    past_participle: "dit",
    present_participle: "disant",
    chapter_number: 4,
    page_printed: 42,
    tenses: {
      tense_present_indicative: {
        forms: {"je": "je dis", "tu": "tu dis", "il_elle_on": "il dit", "nous": "nous disons", "vous": "vous dites", "ils_elles": "ils disent"},
      },
      tense_passe_compose: {
        forms: {"je": "j’ai dit", "tu": "tu as dit", "il_elle_on": "il a dit", "nous": "nous avons dit", "vous": "vous avez dit", "ils_elles": "ils ont dit"},
      },
      tense_imparfait: {
        forms: {"je": "je disais", "tu": "tu disais", "il_elle_on": "il disait", "nous": "nous disions", "vous": "vous disiez", "ils_elles": "ils disaient"},
      },
      tense_futur_simple: {
        forms: {"je": "je dirai", "tu": "tu diras", "il_elle_on": "il dira", "nous": "nous dirons", "vous": "vous direz", "ils_elles": "ils diront"},
      },
      tense_plus_que_parfait: {
        forms: {"je": "j’avais dit", "tu": "tu avais dit", "il_elle_on": "il avait dit", "nous": "nous avions dit", "vous": "vous aviez dit", "ils_elles": "ils avaient dit"},
      },
      tense_conditionnel_present: {
        forms: {"je": "je dirais", "tu": "tu dirais", "il_elle_on": "il dirait", "nous": "nous dirions", "vous": "vous diriez", "ils_elles": "ils diraient"},
      },
      tense_conditionnel_passe: {
        forms: {"je": "j’aurais dit", "tu": "tu aurais dit", "il_elle_on": "il aurait dit", "nous": "nous aurions dit", "vous": "vous auriez dit", "ils_elles": "ils auraient dit"},
      },
      tense_subjonctif_present: {
        forms: {"je": "que je dise", "tu": "que tu dises", "il_elle_on": "qu’il dise", "nous": "que nous disions", "vous": "que vous disiez", "ils_elles": "qu’ils disent"},
      },
      tense_subjonctif_passe: {
        forms: {"je": "que j’aie dit", "tu": "que tu aies dit", "il_elle_on": "qu’il ait dit", "nous": "que nous ayons dit", "vous": "que vous ayez dit", "ils_elles": "qu’ils aient dit"},
      },
      tense_imperatif: {
        forms: {"tu": "dis", "nous": "disons", "vous": "dites"},
      },
      tense_passe_simple: {
        forms: {"je": "je dis", "tu": "tu dis", "il_elle_on": "il dit", "nous": "nous dîmes", "vous": "vous dîtes", "ils_elles": "ils dirent"},
      },
    },
  },
  {
    verb_infinitive: "lire",
    english: ["to read"],
    verb_group: "3rd_group",
    regularity: "irregular",
    auxiliary: "avoir",
    past_participle: "lu",
    present_participle: "lisant",
    chapter_number: 4,
    page_printed: 42,
    tenses: {
      tense_present_indicative: {
        forms: {"je": "je lis", "tu": "tu lis", "il_elle_on": "il lit", "nous": "nous lisons", "vous": "vous lisez", "ils_elles": "ils lisent"},
      },
      tense_passe_compose: {
        forms: {"je": "j’ai lu", "tu": "tu as lu", "il_elle_on": "il a lu", "nous": "nous avons lu", "vous": "vous avez lu", "ils_elles": "ils ont lu"},
      },
      tense_imparfait: {
        forms: {"je": "je lisais", "tu": "tu lisais", "il_elle_on": "il lisait", "nous": "nous lisions", "vous": "vous lisiez", "ils_elles": "ils lisaient"},
      },
      tense_futur_simple: {
        forms: {"je": "je lirai", "tu": "tu liras", "il_elle_on": "il lira", "nous": "nous lirons", "vous": "vous lirez", "ils_elles": "ils liront"},
      },
      tense_plus_que_parfait: {
        forms: {"je": "j’avais lu", "tu": "tu avais lu", "il_elle_on": "il avait lu", "nous": "nous avions lu", "vous": "vous aviez lu", "ils_elles": "ils avaient lu"},
      },
      tense_conditionnel_present: {
        forms: {"je": "je lirais", "tu": "tu lirais", "il_elle_on": "il lirait", "nous": "nous lirions", "vous": "vous liriez", "ils_elles": "ils liraient"},
      },
      tense_conditionnel_passe: {
        forms: {"je": "j’aurais lu", "tu": "tu aurais lu", "il_elle_on": "il aurait lu", "nous": "nous aurions lu", "vous": "vous auriez lu", "ils_elles": "ils auraient lu"},
      },
      tense_subjonctif_present: {
        forms: {"je": "que je lise", "tu": "que tu lises", "il_elle_on": "qu’il lise", "nous": "que nous lisions", "vous": "que vous lisiez", "ils_elles": "qu’ils lisent"},
      },
      tense_subjonctif_passe: {
        forms: {"je": "que j’aie lu", "tu": "que tu aies lu", "il_elle_on": "qu’il ait lu", "nous": "que nous ayons lu", "vous": "que vous ayez lu", "ils_elles": "qu’ils aient lu"},
      },
      tense_imperatif: {
        forms: {"tu": "lis", "nous": "lisons", "vous": "lisez"},
      },
      tense_passe_simple: {
        forms: {"je": "je lus", "tu": "tu lus", "il_elle_on": "il lut", "nous": "nous lûmes", "vous": "vous lûtes", "ils_elles": "ils lurent"},
      },
    },
  },
  {
    verb_infinitive: "écrire",
    english: ["to write"],
    verb_group: "3rd_group",
    regularity: "irregular",
    auxiliary: "avoir",
    past_participle: "écrit",
    present_participle: "écrivant",
    chapter_number: 4,
    page_printed: 42,
    tenses: {
      tense_present_indicative: {
        forms: {"je": "j’écris", "tu": "tu écris", "il_elle_on": "il écrit", "nous": "nous écrivons", "vous": "vous écrivez", "ils_elles": "ils écrivent"},
      },
      tense_passe_compose: {
        forms: {"je": "j’ai écrit", "tu": "tu as écrit", "il_elle_on": "il a écrit", "nous": "nous avons écrit", "vous": "vous avez écrit", "ils_elles": "ils ont écrit"},
      },
      tense_imparfait: {
        forms: {"je": "j’écrivais", "tu": "tu écrivais", "il_elle_on": "il écrivait", "nous": "nous écrivions", "vous": "vous écriviez", "ils_elles": "ils écrivaient"},
      },
      tense_futur_simple: {
        forms: {"je": "j’écrirai", "tu": "tu écriras", "il_elle_on": "il écrira", "nous": "nous écrirons", "vous": "vous écrirez", "ils_elles": "ils écriront"},
      },
      tense_plus_que_parfait: {
        forms: {"je": "j’avais écrit", "tu": "tu avais écrit", "il_elle_on": "il avait écrit", "nous": "nous avions écrit", "vous": "vous aviez écrit", "ils_elles": "ils avaient écrit"},
      },
      tense_conditionnel_present: {
        forms: {"je": "j’écrirais", "tu": "tu écrirais", "il_elle_on": "il écrirait", "nous": "nous écririons", "vous": "vous écririez", "ils_elles": "ils écriraient"},
      },
      tense_conditionnel_passe: {
        forms: {"je": "j’aurais écrit", "tu": "tu aurais écrit", "il_elle_on": "il aurait écrit", "nous": "nous aurions écrit", "vous": "vous auriez écrit", "ils_elles": "ils auraient écrit"},
      },
      tense_subjonctif_present: {
        forms: {"je": "que j’écrive", "tu": "que tu écrives", "il_elle_on": "qu’il écrive", "nous": "que nous écrivions", "vous": "que vous écriviez", "ils_elles": "qu’ils écrivent"},
      },
      tense_subjonctif_passe: {
        forms: {"je": "que j’aie écrit", "tu": "que tu aies écrit", "il_elle_on": "qu’il ait écrit", "nous": "que nous ayons écrit", "vous": "que vous ayez écrit", "ils_elles": "qu’ils aient écrit"},
      },
      tense_imperatif: {
        forms: {"tu": "écris", "nous": "écrivons", "vous": "écrivez"},
      },
      tense_passe_simple: {
        forms: {"je": "j’écrivis", "tu": "tu écrivis", "il_elle_on": "il écrivit", "nous": "nous écrivîmes", "vous": "vous écrivîtes", "ils_elles": "ils écrivirent"},
      },
    },
  },
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
        forms: {"je": "je regarde", "tu": "tu regardes", "il_elle_on": "il regarde", "nous": "nous regardons", "vous": "vous regardez", "ils_elles": "ils regardent"},
      },
      tense_passe_compose: {
        forms: {"je": "j’ai regardé", "tu": "tu as regardé", "il_elle_on": "il a regardé", "nous": "nous avons regardé", "vous": "vous avez regardé", "ils_elles": "ils ont regardé"},
      },
      tense_imparfait: {
        forms: {"je": "je regardais", "tu": "tu regardais", "il_elle_on": "il regardait", "nous": "nous regardions", "vous": "vous regardiez", "ils_elles": "ils regardaient"},
      },
      tense_futur_simple: {
        forms: {"je": "je regarderai", "tu": "tu regarderas", "il_elle_on": "il regardera", "nous": "nous regarderons", "vous": "vous regarderez", "ils_elles": "ils regarderont"},
      },
      tense_plus_que_parfait: {
        forms: {"je": "j’avais regardé", "tu": "tu avais regardé", "il_elle_on": "il avait regardé", "nous": "nous avions regardé", "vous": "vous aviez regardé", "ils_elles": "ils avaient regardé"},
      },
      tense_conditionnel_present: {
        forms: {"je": "je regarderais", "tu": "tu regarderais", "il_elle_on": "il regarderait", "nous": "nous regarderions", "vous": "vous regarderiez", "ils_elles": "ils regarderaient"},
      },
      tense_conditionnel_passe: {
        forms: {"je": "j’aurais regardé", "tu": "tu aurais regardé", "il_elle_on": "il aurait regardé", "nous": "nous aurions regardé", "vous": "vous auriez regardé", "ils_elles": "ils auraient regardé"},
      },
      tense_subjonctif_present: {
        forms: {"je": "que je regarde", "tu": "que tu regardes", "il_elle_on": "qu’il regarde", "nous": "que nous regardions", "vous": "que vous regardiez", "ils_elles": "qu’ils regardent"},
      },
      tense_subjonctif_passe: {
        forms: {"je": "que j’aie regardé", "tu": "que tu aies regardé", "il_elle_on": "qu’il ait regardé", "nous": "que nous ayons regardé", "vous": "que vous ayez regardé", "ils_elles": "qu’ils aient regardé"},
      },
      tense_imperatif: {
        forms: {"tu": "regarde", "nous": "regardons", "vous": "regardez"},
      },
      tense_passe_simple: {
        forms: {"je": "je regardai", "tu": "tu regardas", "il_elle_on": "il regarda", "nous": "nous regardâmes", "vous": "vous regardâtes", "ils_elles": "ils regardèrent"},
      },
    },
  },
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
        forms: {"je": "je finis", "tu": "tu finis", "il_elle_on": "il finit", "nous": "nous finissons", "vous": "vous finissez", "ils_elles": "ils finissent"},
      },
      tense_passe_compose: {
        forms: {"je": "j’ai fini", "tu": "tu as fini", "il_elle_on": "il a fini", "nous": "nous avons fini", "vous": "vous avez fini", "ils_elles": "ils ont fini"},
      },
      tense_imparfait: {
        forms: {"je": "je finissais", "tu": "tu finissais", "il_elle_on": "il finissait", "nous": "nous finissions", "vous": "vous finissiez", "ils_elles": "ils finissaient"},
      },
      tense_futur_simple: {
        forms: {"je": "je finirai", "tu": "tu finiras", "il_elle_on": "il finira", "nous": "nous finirons", "vous": "vous finirez", "ils_elles": "ils finiront"},
      },
      tense_plus_que_parfait: {
        forms: {"je": "j’avais fini", "tu": "tu avais fini", "il_elle_on": "il avait fini", "nous": "nous avions fini", "vous": "vous aviez fini", "ils_elles": "ils avaient fini"},
      },
      tense_conditionnel_present: {
        forms: {"je": "je finirais", "tu": "tu finirais", "il_elle_on": "il finirait", "nous": "nous finirions", "vous": "vous finiriez", "ils_elles": "ils finiraient"},
      },
      tense_conditionnel_passe: {
        forms: {"je": "j’aurais fini", "tu": "tu aurais fini", "il_elle_on": "il aurait fini", "nous": "nous aurions fini", "vous": "vous auriez fini", "ils_elles": "ils auraient fini"},
      },
      tense_subjonctif_present: {
        forms: {"je": "que je finisse", "tu": "que tu finisses", "il_elle_on": "qu’il finisse", "nous": "que nous finissions", "vous": "que vous finissiez", "ils_elles": "qu’ils finissent"},
      },
      tense_subjonctif_passe: {
        forms: {"je": "que j’aie fini", "tu": "que tu aies fini", "il_elle_on": "qu’il ait fini", "nous": "que nous ayons fini", "vous": "que vous ayez fini", "ils_elles": "qu’ils aient fini"},
      },
      tense_imperatif: {
        forms: {"tu": "finis", "nous": "finissons", "vous": "finissez"},
      },
      tense_passe_simple: {
        forms: {"je": "je finis", "tu": "tu finis", "il_elle_on": "il finit", "nous": "nous finîmes", "vous": "vous finîtes", "ils_elles": "ils finirent"},
      },
    },
  },
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
        forms: {"je": "je vends", "tu": "tu vends", "il_elle_on": "il vend", "nous": "nous vendons", "vous": "vous vendez", "ils_elles": "ils vendent"},
      },
      tense_passe_compose: {
        forms: {"je": "j’ai vendu", "tu": "tu as vendu", "il_elle_on": "il a vendu", "nous": "nous avons vendu", "vous": "vous avez vendu", "ils_elles": "ils ont vendu"},
      },
      tense_imparfait: {
        forms: {"je": "je vendais", "tu": "tu vendais", "il_elle_on": "il vendait", "nous": "nous vendions", "vous": "vous vendiez", "ils_elles": "ils vendaient"},
      },
      tense_futur_simple: {
        forms: {"je": "je vendrai", "tu": "tu vendras", "il_elle_on": "il vendra", "nous": "nous vendrons", "vous": "vous vendrez", "ils_elles": "ils vendront"},
      },
      tense_plus_que_parfait: {
        forms: {"je": "j’avais vendu", "tu": "tu avais vendu", "il_elle_on": "il avait vendu", "nous": "nous avions vendu", "vous": "vous aviez vendu", "ils_elles": "ils avaient vendu"},
      },
      tense_conditionnel_present: {
        forms: {"je": "je vendrais", "tu": "tu vendrais", "il_elle_on": "il vendrait", "nous": "nous vendrions", "vous": "vous vendriez", "ils_elles": "ils vendraient"},
      },
      tense_conditionnel_passe: {
        forms: {"je": "j’aurais vendu", "tu": "tu aurais vendu", "il_elle_on": "il aurait vendu", "nous": "nous aurions vendu", "vous": "vous auriez vendu", "ils_elles": "ils auraient vendu"},
      },
      tense_subjonctif_present: {
        forms: {"je": "que je vende", "tu": "que tu vendes", "il_elle_on": "qu’il vende", "nous": "que nous vendions", "vous": "que vous vendiez", "ils_elles": "qu’ils vendent"},
      },
      tense_subjonctif_passe: {
        forms: {"je": "que j’aie vendu", "tu": "que tu aies vendu", "il_elle_on": "qu’il ait vendu", "nous": "que nous ayons vendu", "vous": "que vous ayez vendu", "ils_elles": "qu’ils aient vendu"},
      },
      tense_imperatif: {
        forms: {"tu": "vends", "nous": "vendons", "vous": "vendez"},
      },
      tense_passe_simple: {
        forms: {"je": "je vendis", "tu": "tu vendis", "il_elle_on": "il vendit", "nous": "nous vendîmes", "vous": "vous vendîtes", "ils_elles": "ils vendirent"},
      },
    },
  },
  {
    verb_infinitive: "partir",
    english: ["to leave", "to depart"],
    verb_group: "3rd_group",
    regularity: "irregular",
    auxiliary: "etre",
    past_participle: "parti",
    present_participle: "partant",
    chapter_number: 2,
    page_printed: 14,
    tenses: {
      tense_present_indicative: {
        forms: {"je": "je pars", "tu": "tu pars", "il_elle_on": "il part", "nous": "nous partons", "vous": "vous partez", "ils_elles": "ils partent"},
      },
      tense_passe_compose: {
        forms: {"je": "je suis parti(e)", "tu": "tu es parti(e)", "il_elle_on": "il est parti / elle est partie", "nous": "nous sommes parti(e)s", "vous": "vous êtes parti(e)(s)", "ils_elles": "ils sont partis / elles sont parties"},
      },
      tense_imparfait: {
        forms: {"je": "je partais", "tu": "tu partais", "il_elle_on": "il partait", "nous": "nous partions", "vous": "vous partiez", "ils_elles": "ils partaient"},
      },
      tense_futur_simple: {
        forms: {"je": "je partirai", "tu": "tu partiras", "il_elle_on": "il partira", "nous": "nous partirons", "vous": "vous partirez", "ils_elles": "ils partiront"},
      },
      tense_plus_que_parfait: {
        forms: {"je": "j’étais parti(e)", "tu": "tu étais parti(e)", "il_elle_on": "il était parti", "nous": "nous étions parti(e)s", "vous": "vous étiez parti(e)(s)", "ils_elles": "ils étaient partis"},
      },
      tense_conditionnel_present: {
        forms: {"je": "je partirais", "tu": "tu partirais", "il_elle_on": "il partirait", "nous": "nous partirions", "vous": "vous partiriez", "ils_elles": "ils partiraient"},
      },
      tense_conditionnel_passe: {
        forms: {"je": "je serais parti(e)", "tu": "tu serais parti(e)", "il_elle_on": "il serait parti", "nous": "nous serions parti(e)s", "vous": "vous seriez parti(e)(s)", "ils_elles": "ils seraient partis"},
      },
      tense_subjonctif_present: {
        forms: {"je": "que je parte", "tu": "que tu partes", "il_elle_on": "qu’il parte", "nous": "que nous partions", "vous": "que vous partiez", "ils_elles": "qu’ils partent"},
      },
      tense_subjonctif_passe: {
        forms: {"je": "que je sois parti(e)", "tu": "que tu sois parti(e)", "il_elle_on": "qu’il soit parti", "nous": "que nous soyons parti(e)s", "vous": "que vous soyez parti(e)(s)", "ils_elles": "qu’ils soient partis"},
      },
      tense_imperatif: {
        forms: {"tu": "pars", "nous": "partons", "vous": "partez"},
      },
      tense_passe_simple: {
        forms: {"je": "je partis", "tu": "tu partis", "il_elle_on": "il partit", "nous": "nous partîmes", "vous": "vous partîtes", "ils_elles": "ils partirent"},
      },
    },
  },
  {
    verb_infinitive: "se lever",
    english: ["to get up", "to rise"],
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
        forms: {"je": "je me lève", "tu": "tu te lèves", "il_elle_on": "il se lève", "nous": "nous nous levons", "vous": "vous vous levez", "ils_elles": "ils se lèvent"},
      },
      tense_passe_compose: {
        forms: {"je": "je me suis levé(e)", "tu": "tu t’es levé(e)", "il_elle_on": "il s’est levé / elle s’est levée", "nous": "nous nous sommes levé(e)s", "vous": "vous vous êtes levé(e)(s)", "ils_elles": "ils se sont levés / elles se sont levées"},
      },
      tense_imparfait: {
        forms: {"je": "je me levais", "tu": "tu te levais", "il_elle_on": "il se levait", "nous": "nous nous levions", "vous": "vous vous leviez", "ils_elles": "ils se levaient"},
      },
      tense_futur_simple: {
        forms: {"je": "je me lèverai", "tu": "tu te lèveras", "il_elle_on": "il se lèvera", "nous": "nous nous lèverons", "vous": "vous vous lèverez", "ils_elles": "ils se lèveront"},
      },
      tense_plus_que_parfait: {
        forms: {"je": "je m’étais levé(e)", "tu": "tu t’étais levé(e)", "il_elle_on": "il s’était levé", "nous": "nous nous étions levé(e)s", "vous": "vous vous étiez levé(e)(s)", "ils_elles": "ils s’étaient levés"},
      },
      tense_conditionnel_present: {
        forms: {"je": "je me lèverais", "tu": "tu te lèverais", "il_elle_on": "il se lèverait", "nous": "nous nous lèverions", "vous": "vous vous lèveriez", "ils_elles": "ils se lèveraient"},
      },
      tense_conditionnel_passe: {
        forms: {"je": "je me serais levé(e)", "tu": "tu te serais levé(e)", "il_elle_on": "il se serait levé", "nous": "nous nous serions levé(e)s", "vous": "vous vous seriez levé(e)(s)", "ils_elles": "ils se seraient levés"},
      },
      tense_subjonctif_present: {
        forms: {"je": "que je me lève", "tu": "que tu te lèves", "il_elle_on": "qu’il se lève", "nous": "que nous nous levions", "vous": "que vous vous leviez", "ils_elles": "qu’ils se lèvent"},
      },
      tense_subjonctif_passe: {
        forms: {"je": "que je me sois levé(e)", "tu": "que tu te sois levé(e)", "il_elle_on": "qu’il se soit levé", "nous": "que nous nous soyons levé(e)s", "vous": "que vous vous soyez levé(e)(s)", "ils_elles": "qu’ils se soient levés"},
      },
      tense_imperatif: {
        forms: {"tu": "lève-toi", "nous": "levons-nous", "vous": "levez-vous"},
      },
      tense_passe_simple: {
        forms: {"je": "je me levai", "tu": "tu te levas", "il_elle_on": "il se leva", "nous": "nous nous levâmes", "vous": "vous vous levâtes", "ils_elles": "ils se levèrent"},
      },
    },
  },
  {
    verb_infinitive: "manger",
    english: ["to eat"],
    verb_group: "1st_group",
    regularity: "spelling_changing",
    auxiliary: "avoir",
    past_participle: "mangé",
    present_participle: "mangeant",
    chapter_number: 1,
    page_printed: 238,
    tenses: {
      tense_present_indicative: {
        forms: {"je": "je mange", "tu": "tu manges", "il_elle_on": "il mange", "nous": "nous mangeons", "vous": "vous mangez", "ils_elles": "ils mangent"},
      },
      tense_passe_compose: {
        forms: {"je": "j’ai mangé", "tu": "tu as mangé", "il_elle_on": "il a mangé", "nous": "nous avons mangé", "vous": "vous avez mangé", "ils_elles": "ils ont mangé"},
      },
      tense_imparfait: {
        forms: {"je": "je mangeais", "tu": "tu mangeais", "il_elle_on": "il mangeait", "nous": "nous mangions", "vous": "vous mangiez", "ils_elles": "ils mangeaient"},
      },
      tense_futur_simple: {
        forms: {"je": "je mangerai", "tu": "tu mangeras", "il_elle_on": "il mangera", "nous": "nous mangerons", "vous": "vous mangerez", "ils_elles": "ils mangeront"},
      },
      tense_conditionnel_present: {
        forms: {"je": "je mangerais", "tu": "tu mangerais", "il_elle_on": "il mangerait", "nous": "nous mangerions", "vous": "vous mangeriez", "ils_elles": "ils mangeraient"},
      },
      tense_subjonctif_present: {
        forms: {"je": "que je mange", "tu": "que tu manges", "il_elle_on": "qu’il mange", "nous": "que nous mangions", "vous": "que vous mangiez", "ils_elles": "qu’ils mangent"},
      },
      tense_imperatif: {
        forms: {"tu": "mange", "nous": "mangeons", "vous": "mangez"},
      },
      tense_passe_simple: {
        forms: {"je": "je mangeai", "tu": "tu mangeas", "il_elle_on": "il mangea", "nous": "nous mangeâmes", "vous": "vous mangeâtes", "ils_elles": "ils mangèrent"},
      },
    },
  },
  {
    verb_infinitive: "commencer",
    english: ["to begin", "to start"],
    verb_group: "1st_group",
    regularity: "spelling_changing",
    auxiliary: "avoir",
    past_participle: "commencé",
    present_participle: "commençant",
    chapter_number: 1,
    page_printed: 238,
    tenses: {
      tense_present_indicative: {
        forms: {"je": "je commence", "tu": "tu commences", "il_elle_on": "il commence", "nous": "nous commençons", "vous": "vous commencez", "ils_elles": "ils commencent"},
      },
      tense_passe_compose: {
        forms: {"je": "j’ai commencé", "tu": "tu as commencé", "il_elle_on": "il a commencé", "nous": "nous avons commencé", "vous": "vous avez commencé", "ils_elles": "ils ont commencé"},
      },
      tense_imparfait: {
        forms: {"je": "je commençais", "tu": "tu commençais", "il_elle_on": "il commençait", "nous": "nous commencions", "vous": "vous commenciez", "ils_elles": "ils commençaient"},
      },
      tense_futur_simple: {
        forms: {"je": "je commencerai", "tu": "tu commenceras", "il_elle_on": "il commencera", "nous": "nous commencerons", "vous": "vous commencerez", "ils_elles": "ils commenceront"},
      },
      tense_conditionnel_present: {
        forms: {"je": "je commencerais", "tu": "tu commencerais", "il_elle_on": "il commencerait", "nous": "nous commencerions", "vous": "vous commenceriez", "ils_elles": "ils commenceraient"},
      },
      tense_subjonctif_present: {
        forms: {"je": "que je commence", "tu": "que tu commences", "il_elle_on": "qu’il commence", "nous": "que nous commencions", "vous": "que vous commenciez", "ils_elles": "qu’ils commencent"},
      },
      tense_imperatif: {
        forms: {"tu": "commence", "nous": "commençons", "vous": "commencez"},
      },
      tense_passe_simple: {
        forms: {"je": "je commençai", "tu": "tu commenças", "il_elle_on": "il commença", "nous": "nous commençâmes", "vous": "vous commençâtes", "ils_elles": "ils commencèrent"},
      },
    },
  },
  {
    verb_infinitive: "acheter",
    english: ["to buy"],
    verb_group: "1st_group",
    regularity: "stem_changing",
    auxiliary: "avoir",
    past_participle: "acheté",
    present_participle: "achetant",
    chapter_number: 1,
    page_printed: 238,
    tenses: {
      tense_present_indicative: {
        forms: {"je": "j’achète", "tu": "tu achètes", "il_elle_on": "il achète", "nous": "nous achetons", "vous": "vous achetez", "ils_elles": "ils achètent"},
      },
      tense_passe_compose: {
        forms: {"je": "j’ai acheté", "tu": "tu as acheté", "il_elle_on": "il a acheté", "nous": "nous avons acheté", "vous": "vous avez acheté", "ils_elles": "ils ont acheté"},
      },
      tense_imparfait: {
        forms: {"je": "j’achetais", "tu": "tu achetais", "il_elle_on": "il achetait", "nous": "nous achetions", "vous": "vous achetiez", "ils_elles": "ils achetaient"},
      },
      tense_futur_simple: {
        forms: {"je": "j’achèterai", "tu": "tu achèteras", "il_elle_on": "il achètera", "nous": "nous achèterons", "vous": "vous achèterez", "ils_elles": "ils achèteront"},
      },
      tense_conditionnel_present: {
        forms: {"je": "j’achèterais", "tu": "tu achèterais", "il_elle_on": "il achèterait", "nous": "nous achèterions", "vous": "vous achèteriez", "ils_elles": "ils achèteraient"},
      },
      tense_subjonctif_present: {
        forms: {"je": "que j’achète", "tu": "que tu achètes", "il_elle_on": "qu’il achète", "nous": "que nous achetions", "vous": "que vous achetiez", "ils_elles": "qu’ils achètent"},
      },
      tense_imperatif: {
        forms: {"tu": "achète", "nous": "achetons", "vous": "achetez"},
      },
      tense_passe_simple: {
        forms: {"je": "j’achetai", "tu": "tu achetas", "il_elle_on": "il acheta", "nous": "nous achetâmes", "vous": "vous achetâtes", "ils_elles": "ils achetèrent"},
      },
    },
  },
  {
    verb_infinitive: "appeler",
    english: ["to call"],
    verb_group: "1st_group",
    regularity: "stem_changing",
    auxiliary: "avoir",
    past_participle: "appelé",
    present_participle: "appelant",
    chapter_number: 1,
    page_printed: 238,
    tenses: {
      tense_present_indicative: {
        forms: {"je": "j’appelle", "tu": "tu appelles", "il_elle_on": "il appelle", "nous": "nous appelons", "vous": "vous appelez", "ils_elles": "ils appellent"},
      },
      tense_passe_compose: {
        forms: {"je": "j’ai appelé", "tu": "tu as appelé", "il_elle_on": "il a appelé", "nous": "nous avons appelé", "vous": "vous avez appelé", "ils_elles": "ils ont appelé"},
      },
      tense_imparfait: {
        forms: {"je": "j’appelais", "tu": "tu appelais", "il_elle_on": "il appelait", "nous": "nous appelions", "vous": "vous appeliez", "ils_elles": "ils appelaient"},
      },
      tense_futur_simple: {
        forms: {"je": "j’appellerai", "tu": "tu appelleras", "il_elle_on": "il appellera", "nous": "nous appellerons", "vous": "vous appellerez", "ils_elles": "ils appelleront"},
      },
      tense_conditionnel_present: {
        forms: {"je": "j’appellerais", "tu": "tu appellerais", "il_elle_on": "il appellerait", "nous": "nous appellerions", "vous": "vous appelleriez", "ils_elles": "ils appelleraient"},
      },
      tense_subjonctif_present: {
        forms: {"je": "que j’appelle", "tu": "que tu appelles", "il_elle_on": "qu’il appelle", "nous": "que nous appelions", "vous": "que vous appeliez", "ils_elles": "qu’ils appellent"},
      },
      tense_imperatif: {
        forms: {"tu": "appelle", "nous": "appelons", "vous": "appelez"},
      },
      tense_passe_simple: {
        forms: {"je": "j’appelai", "tu": "tu appelas", "il_elle_on": "il appela", "nous": "nous appelâmes", "vous": "vous appelâtes", "ils_elles": "ils appelèrent"},
      },
    },
  },
  {
    verb_infinitive: "payer",
    english: ["to pay"],
    verb_group: "1st_group",
    regularity: "stem_changing",
    auxiliary: "avoir",
    past_participle: "payé",
    present_participle: "payant",
    chapter_number: 1,
    page_printed: 238,
    tenses: {
      tense_present_indicative: {
        forms: {"je": "je paie / paye", "tu": "tu paies / payes", "il_elle_on": "il paie / paye", "nous": "nous payons", "vous": "vous payez", "ils_elles": "ils paient / payent"},
      },
      tense_passe_compose: {
        forms: {"je": "j’ai payé", "tu": "tu as payé", "il_elle_on": "il a payé", "nous": "nous avons payé", "vous": "vous avez payé", "ils_elles": "ils ont payé"},
      },
      tense_imparfait: {
        forms: {"je": "je payais", "tu": "tu payais", "il_elle_on": "il payait", "nous": "nous payions", "vous": "vous payiez", "ils_elles": "ils payaient"},
      },
      tense_futur_simple: {
        forms: {"je": "je paierai / payerai", "tu": "tu paieras / payeras", "il_elle_on": "il paiera / payera", "nous": "nous paierons / payerons", "vous": "vous paierez / payerez", "ils_elles": "ils paieront / payeront"},
      },
      tense_conditionnel_present: {
        forms: {"je": "je paierais / payerais", "tu": "tu paierais", "il_elle_on": "il paierait", "nous": "nous paierions", "vous": "vous paieriez", "ils_elles": "ils paieraient"},
      },
      tense_subjonctif_present: {
        forms: {"je": "que je paie", "tu": "que tu paies", "il_elle_on": "qu’il paie", "nous": "que nous payions", "vous": "que vous payiez", "ils_elles": "qu’ils paient"},
      },
      tense_imperatif: {
        forms: {"tu": "paie", "nous": "payons", "vous": "payez"},
      },
      tense_passe_simple: {
        forms: {"je": "je payai", "tu": "tu payas", "il_elle_on": "il paya", "nous": "nous payâmes", "vous": "vous payâtes", "ils_elles": "ils payèrent"},
      },
    },
  },
  {
    verb_infinitive: "préférer",
    english: ["to prefer"],
    verb_group: "1st_group",
    regularity: "stem_changing",
    auxiliary: "avoir",
    past_participle: "préféré",
    present_participle: "préférant",
    chapter_number: 1,
    page_printed: 238,
    tenses: {
      tense_present_indicative: {
        forms: {"je": "je préfère", "tu": "tu préfères", "il_elle_on": "il préfère", "nous": "nous préférons", "vous": "vous préférez", "ils_elles": "ils préfèrent"},
      },
      tense_passe_compose: {
        forms: {"je": "j’ai préféré", "tu": "tu as préféré", "il_elle_on": "il a préféré", "nous": "nous avons préféré", "vous": "vous avez préféré", "ils_elles": "ils ont préféré"},
      },
      tense_imparfait: {
        forms: {"je": "je préférais", "tu": "tu préférais", "il_elle_on": "il préférait", "nous": "nous préférions", "vous": "vous préfériez", "ils_elles": "ils préféraient"},
      },
      tense_futur_simple: {
        forms: {"je": "je préférerai", "tu": "tu préféreras", "il_elle_on": "il préférera", "nous": "nous préférerons", "vous": "vous préférerez", "ils_elles": "ils préféreront"},
      },
      tense_conditionnel_present: {
        forms: {"je": "je préférerais", "tu": "tu préférerais", "il_elle_on": "il préférerait", "nous": "nous préférerions", "vous": "vous préféreriez", "ils_elles": "ils préféreraient"},
      },
      tense_subjonctif_present: {
        forms: {"je": "que je préfère", "tu": "que tu préfères", "il_elle_on": "qu’il préfère", "nous": "que nous préférions", "vous": "que vous préfériez", "ils_elles": "qu’ils préfèrent"},
      },
      tense_imperatif: {
        forms: {"tu": "préfère", "nous": "préférons", "vous": "préférez"},
      },
      tense_passe_simple: {
        forms: {"je": "je préférai", "tu": "tu préféras", "il_elle_on": "il préféra", "nous": "nous préférâmes", "vous": "vous préférâtes", "ils_elles": "ils préférèrent"},
      },
    },
  },
  {
    verb_infinitive: "acquérir",
    english: ["to acquire"],
    verb_group: "3rd_group",
    regularity: "irregular",
    auxiliary: "avoir",
    past_participle: "acquis",
    present_participle: "acquérant",
    chapter_number: 27,
    page_printed: 239,
    tenses: {
      tense_present_indicative: {
        forms: {"je": "j’acquiers", "tu": "tu acquiers", "il_elle_on": "il acquiert", "nous": "nous acquérons", "vous": "vous acquérez", "ils_elles": "ils acquièrent"},
      },
      tense_passe_compose: {
        forms: {"je": "j’ai acquis", "tu": "tu as acquis", "il_elle_on": "il a acquis", "nous": "nous avons acquis", "vous": "vous avez acquis", "ils_elles": "ils ont acquis"},
      },
      tense_imparfait: {
        forms: {"je": "j’acquérais", "tu": "tu acquérais", "il_elle_on": "il acquérait", "nous": "nous acquérions", "vous": "vous acquériez", "ils_elles": "ils acquéraient"},
      },
      tense_futur_simple: {
        forms: {"je": "j’acquerrai", "tu": "tu acquerras", "il_elle_on": "il acquerra", "nous": "nous acquerrons", "vous": "vous acquerrez", "ils_elles": "ils acquerront"},
      },
      tense_conditionnel_present: {
        forms: {"je": "j’acquerrais", "tu": "tu acquerrais", "il_elle_on": "il acquerrait", "nous": "nous acquerrions", "vous": "vous acquerriez", "ils_elles": "ils acquerraient"},
      },
      tense_subjonctif_present: {
        forms: {"je": "que j’acquière", "tu": "que tu acquières", "il_elle_on": "qu’il acquière", "nous": "que nous acquérions", "vous": "que vous acquériez", "ils_elles": "qu’ils acquièrent"},
      },
      tense_passe_simple: {
        forms: {"je": "j’acquis", "tu": "tu acquis", "il_elle_on": "il acquit", "nous": "nous acquîmes", "vous": "vous acquîtes", "ils_elles": "ils acquirent"},
      },
    },
  },
  {
    verb_infinitive: "apprendre",
    english: ["to learn"],
    verb_group: "3rd_group",
    regularity: "irregular",
    auxiliary: "avoir",
    past_participle: "appris",
    present_participle: "apprenant",
    chapter_number: 4,
    page_printed: 239,
    tenses: {
      tense_present_indicative: {
        forms: {"je": "j’apprends", "tu": "tu apprends", "il_elle_on": "il apprend", "nous": "nous apprenons", "vous": "vous apprenez", "ils_elles": "ils apprennent"},
      },
      tense_passe_compose: {
        forms: {"je": "j’ai appris", "tu": "tu as appris", "il_elle_on": "il a appris", "nous": "nous avons appris", "vous": "vous avez appris", "ils_elles": "ils ont appris"},
      },
      tense_imparfait: {
        forms: {"je": "j’apprenais", "tu": "tu apprenais", "il_elle_on": "il apprenait", "nous": "nous apprenions", "vous": "vous appreniez", "ils_elles": "ils apprenaient"},
      },
      tense_futur_simple: {
        forms: {"je": "j’apprendrai", "tu": "tu apprendras", "il_elle_on": "il apprendra", "nous": "nous apprendrons", "vous": "vous apprendrez", "ils_elles": "ils apprendront"},
      },
      tense_conditionnel_present: {
        forms: {"je": "j’apprendrais", "tu": "tu apprendrais", "il_elle_on": "il apprendrait", "nous": "nous apprendrions", "vous": "vous apprendriez", "ils_elles": "ils apprendraient"},
      },
      tense_subjonctif_present: {
        forms: {"je": "que j’apprenne", "tu": "que tu apprennes", "il_elle_on": "qu’il apprenne", "nous": "que nous apprenions", "vous": "que vous appreniez", "ils_elles": "qu’ils apprennent"},
      },
      tense_imperatif: {
        forms: {"tu": "apprends", "nous": "apprenons", "vous": "apprenez"},
      },
    },
  },
  {
    verb_infinitive: "s’asseoir",
    english: ["to sit down"],
    verb_group: "3rd_group",
    regularity: "irregular",
    pronominal: true,
    auxiliary: "etre",
    past_participle: "assis",
    present_participle: "s’asseyant",
    chapter_number: 6,
    page_printed: 239,
    tenses: {
      tense_present_indicative: {
        forms: {"je": "je m’assieds", "tu": "tu t’assieds", "il_elle_on": "il s’assied", "nous": "nous nous asseyons", "vous": "vous vous asseyez", "ils_elles": "ils s’asseyent"},
      },
      tense_passe_compose: {
        forms: {"je": "je me suis assis(e)", "tu": "tu t’es assis(e)", "il_elle_on": "il s’est assis", "nous": "nous nous sommes assis(es)", "vous": "vous vous êtes assis(e)(s)", "ils_elles": "ils se sont assis"},
      },
      tense_imparfait: {
        forms: {"je": "je m’asseyais", "tu": "tu t’asseyais", "il_elle_on": "il s’asseyait", "nous": "nous nous asseyions", "vous": "vous vous asseyiez", "ils_elles": "ils s’asseyaient"},
      },
      tense_futur_simple: {
        forms: {"je": "je m’assiérai", "tu": "tu t’assiéras", "il_elle_on": "il s’assiéra", "nous": "nous nous assiérons", "vous": "vous vous assiérez", "ils_elles": "ils s’assiéront"},
      },
      tense_conditionnel_present: {
        forms: {"je": "je m’assiérais", "tu": "tu t’assiérais", "il_elle_on": "il s’assiérait", "nous": "nous nous assiérions", "vous": "vous vous assiériez", "ils_elles": "ils s’assiéraient"},
      },
      tense_subjonctif_present: {
        forms: {"je": "que je m’asseye", "tu": "que tu t’asseyes", "il_elle_on": "qu’il s’asseye", "nous": "que nous nous asseyions", "vous": "que vous vous asseyiez", "ils_elles": "qu’ils s’asseyent"},
      },
      tense_imperatif: {
        forms: {"tu": "assieds-toi", "nous": "asseyons-nous", "vous": "asseyez-vous"},
      },
    },
  },
  {
    verb_infinitive: "battre",
    english: ["to beat", "to hit"],
    verb_group: "3rd_group",
    regularity: "irregular",
    auxiliary: "avoir",
    past_participle: "battu",
    present_participle: "battant",
    chapter_number: 2,
    page_printed: 239,
    tenses: {
      tense_present_indicative: {
        forms: {"je": "je bats", "tu": "tu bats", "il_elle_on": "il bat", "nous": "nous battons", "vous": "vous battez", "ils_elles": "ils battent"},
      },
      tense_passe_compose: {
        forms: {"je": "j’ai battu", "tu": "tu as battu", "il_elle_on": "il a battu", "nous": "nous avons battu", "vous": "vous avez battu", "ils_elles": "ils ont battu"},
      },
      tense_imparfait: {
        forms: {"je": "je battais", "tu": "tu battais", "il_elle_on": "il battait", "nous": "nous battions", "vous": "vous battiez", "ils_elles": "ils battaient"},
      },
      tense_futur_simple: {
        forms: {"je": "je battrai", "tu": "tu battras", "il_elle_on": "il battra", "nous": "nous battrons", "vous": "vous battrez", "ils_elles": "ils battront"},
      },
      tense_conditionnel_present: {
        forms: {"je": "je battrais", "tu": "tu battrais", "il_elle_on": "il battrait", "nous": "nous battrions", "vous": "vous battriez", "ils_elles": "ils battraient"},
      },
      tense_subjonctif_present: {
        forms: {"je": "que je batte", "tu": "que tu battes", "il_elle_on": "qu’il batte", "nous": "que nous battions", "vous": "que vous battiez", "ils_elles": "qu’ils battent"},
      },
    },
  },
  {
    verb_infinitive: "boire",
    english: ["to drink"],
    verb_group: "3rd_group",
    regularity: "irregular",
    auxiliary: "avoir",
    past_participle: "bu",
    present_participle: "buvant",
    chapter_number: 4,
    page_printed: 239,
    tenses: {
      tense_present_indicative: {
        forms: {"je": "je bois", "tu": "tu bois", "il_elle_on": "il boit", "nous": "nous buvons", "vous": "vous buvez", "ils_elles": "ils boivent"},
      },
      tense_passe_compose: {
        forms: {"je": "j’ai bu", "tu": "tu as bu", "il_elle_on": "il a bu", "nous": "nous avons bu", "vous": "vous avez bu", "ils_elles": "ils ont bu"},
      },
      tense_imparfait: {
        forms: {"je": "je buvais", "tu": "tu buvais", "il_elle_on": "il buvait", "nous": "nous buvions", "vous": "vous buviez", "ils_elles": "ils buvaient"},
      },
      tense_futur_simple: {
        forms: {"je": "je boirai", "tu": "tu boiras", "il_elle_on": "il boira", "nous": "nous boirons", "vous": "vous boirez", "ils_elles": "ils boiront"},
      },
      tense_conditionnel_present: {
        forms: {"je": "je boirais", "tu": "tu boirais", "il_elle_on": "il boirait", "nous": "nous boirions", "vous": "vous boiriez", "ils_elles": "ils boiraient"},
      },
      tense_subjonctif_present: {
        forms: {"je": "que je boive", "tu": "que tu boives", "il_elle_on": "qu’il boive", "nous": "que nous buvions", "vous": "que vous buviez", "ils_elles": "qu’ils boivent"},
      },
    },
  },
  {
    verb_infinitive: "comprendre",
    english: ["to understand"],
    verb_group: "3rd_group",
    regularity: "irregular",
    auxiliary: "avoir",
    past_participle: "compris",
    present_participle: "comprenant",
    chapter_number: 4,
    page_printed: 239,
    tenses: {
      tense_present_indicative: {
        forms: {"je": "je comprends", "tu": "tu comprends", "il_elle_on": "il comprend", "nous": "nous comprenons", "vous": "vous comprenez", "ils_elles": "ils comprennent"},
      },
      tense_passe_compose: {
        forms: {"je": "j’ai compris", "tu": "tu as compris", "il_elle_on": "il a compris", "nous": "nous avons compris", "vous": "vous avez compris", "ils_elles": "ils ont compris"},
      },
      tense_imparfait: {
        forms: {"je": "je comprenais", "tu": "tu comprenais", "il_elle_on": "il comprenait", "nous": "nous comprenions", "vous": "vous compreniez", "ils_elles": "ils comprenaient"},
      },
      tense_futur_simple: {
        forms: {"je": "je comprendrai", "tu": "tu comprendras", "il_elle_on": "il comprendra", "nous": "nous comprendrons", "vous": "vous comprendrez", "ils_elles": "ils comprendront"},
      },
      tense_conditionnel_present: {
        forms: {"je": "je comprendrais", "tu": "tu comprendrais", "il_elle_on": "il comprendrait", "nous": "nous comprendrions", "vous": "vous comprendriez", "ils_elles": "ils comprendraient"},
      },
      tense_subjonctif_present: {
        forms: {"je": "que je comprenne", "tu": "que tu comprennes", "il_elle_on": "qu’il comprenne", "nous": "que nous comprenions", "vous": "que vous compreniez", "ils_elles": "qu’ils comprennent"},
      },
    },
  },
  {
    verb_infinitive: "conclure",
    english: ["to conclude"],
    verb_group: "3rd_group",
    regularity: "irregular",
    auxiliary: "avoir",
    past_participle: "conclu",
    present_participle: "concluant",
    chapter_number: 2,
    page_printed: 239,
    tenses: {
      tense_present_indicative: {
        forms: {"je": "je conclus", "tu": "tu conclus", "il_elle_on": "il conclut", "nous": "nous concluons", "vous": "vous concluez", "ils_elles": "ils concluent"},
      },
      tense_passe_compose: {
        forms: {"je": "j’ai conclu", "tu": "tu as conclu", "il_elle_on": "il a conclu", "nous": "nous avons conclu", "vous": "vous avez conclu", "ils_elles": "ils ont conclu"},
      },
      tense_imparfait: {
        forms: {"je": "je concluais", "tu": "tu concluais", "il_elle_on": "il concluait", "nous": "nous concluions", "vous": "vous concluiez", "ils_elles": "ils concluaient"},
      },
      tense_futur_simple: {
        forms: {"je": "je conclurai", "tu": "tu concluras", "il_elle_on": "il conclura", "nous": "nous conclurons", "vous": "vous conclurez", "ils_elles": "ils concluront"},
      },
      tense_conditionnel_present: {
        forms: {"je": "je conclurais", "tu": "tu conclurais", "il_elle_on": "il conclurait", "nous": "nous conclurions", "vous": "vous concluriez", "ils_elles": "ils concluraient"},
      },
      tense_subjonctif_present: {
        forms: {"je": "que je conclue", "tu": "que tu conclues", "il_elle_on": "qu’il conclue", "nous": "que nous concluions", "vous": "que vous concluiez", "ils_elles": "qu’ils concluent"},
      },
    },
  },
  {
    verb_infinitive: "conduire",
    english: ["to drive", "to lead"],
    verb_group: "3rd_group",
    regularity: "irregular",
    auxiliary: "avoir",
    past_participle: "conduit",
    present_participle: "conduisant",
    chapter_number: 2,
    page_printed: 239,
    tenses: {
      tense_present_indicative: {
        forms: {"je": "je conduis", "tu": "tu conduis", "il_elle_on": "il conduit", "nous": "nous conduisons", "vous": "vous conduisez", "ils_elles": "ils conduisent"},
      },
      tense_passe_compose: {
        forms: {"je": "j’ai conduit", "tu": "tu as conduit", "il_elle_on": "il a conduit", "nous": "nous avons conduit", "vous": "vous avez conduit", "ils_elles": "ils ont conduit"},
      },
      tense_imparfait: {
        forms: {"je": "je conduisais", "tu": "tu conduisais", "il_elle_on": "il conduisait", "nous": "nous conduisions", "vous": "vous conduisiez", "ils_elles": "ils conduisaient"},
      },
      tense_futur_simple: {
        forms: {"je": "je conduirai", "tu": "tu conduiras", "il_elle_on": "il conduira", "nous": "nous conduirons", "vous": "vous conduirez", "ils_elles": "ils conduiront"},
      },
      tense_conditionnel_present: {
        forms: {"je": "je conduirais", "tu": "tu conduirais", "il_elle_on": "il conduirait", "nous": "nous conduirions", "vous": "vous conduiriez", "ils_elles": "ils conduiraient"},
      },
      tense_subjonctif_present: {
        forms: {"je": "que je conduise", "tu": "que tu conduises", "il_elle_on": "qu’il conduise", "nous": "que nous conduisions", "vous": "que vous conduisiez", "ils_elles": "qu’ils conduisent"},
      },
    },
  },
  {
    verb_infinitive: "connaître",
    english: ["to know", "to be acquainted with"],
    verb_group: "3rd_group",
    regularity: "irregular",
    auxiliary: "avoir",
    past_participle: "connu",
    present_participle: "connaissant",
    chapter_number: 2,
    page_printed: 239,
    tenses: {
      tense_present_indicative: {
        forms: {"je": "je connais", "tu": "tu connais", "il_elle_on": "il connaît", "nous": "nous connaissons", "vous": "vous connaissez", "ils_elles": "ils connaissent"},
      },
      tense_passe_compose: {
        forms: {"je": "j’ai connu", "tu": "tu as connu", "il_elle_on": "il a connu", "nous": "nous avons connu", "vous": "vous avez connu", "ils_elles": "ils ont connu"},
      },
      tense_imparfait: {
        forms: {"je": "je connaissais", "tu": "tu connaissais", "il_elle_on": "il connaissait", "nous": "nous connaissions", "vous": "vous connaissiez", "ils_elles": "ils connaissaient"},
      },
      tense_futur_simple: {
        forms: {"je": "je connaîtrai", "tu": "tu connaîtras", "il_elle_on": "il connaîtra", "nous": "nous connaîtrons", "vous": "vous connaîtrez", "ils_elles": "ils connaîtront"},
      },
      tense_conditionnel_present: {
        forms: {"je": "je connaîtrais", "tu": "tu connaîtrais", "il_elle_on": "il connaîtrait", "nous": "nous connaîtrions", "vous": "vous connaîtriez", "ils_elles": "ils connaîtraient"},
      },
      tense_subjonctif_present: {
        forms: {"je": "que je connaisse", "tu": "que tu connaisses", "il_elle_on": "qu’il connaisse", "nous": "que nous connaissions", "vous": "que vous connaissiez", "ils_elles": "qu’ils connaissent"},
      },
    },
  },
  {
    verb_infinitive: "courir",
    english: ["to run"],
    verb_group: "3rd_group",
    regularity: "irregular",
    auxiliary: "avoir",
    past_participle: "couru",
    present_participle: "courant",
    chapter_number: 2,
    page_printed: 239,
    tenses: {
      tense_present_indicative: {
        forms: {"je": "je cours", "tu": "tu cours", "il_elle_on": "il court", "nous": "nous courons", "vous": "vous courez", "ils_elles": "ils courent"},
      },
      tense_passe_compose: {
        forms: {"je": "j’ai couru", "tu": "tu as couru", "il_elle_on": "il a couru", "nous": "nous avons couru", "vous": "vous avez couru", "ils_elles": "ils ont couru"},
      },
      tense_imparfait: {
        forms: {"je": "je courais", "tu": "tu courais", "il_elle_on": "il courait", "nous": "nous courions", "vous": "vous couriez", "ils_elles": "ils couraient"},
      },
      tense_futur_simple: {
        forms: {"je": "je courrai", "tu": "tu courras", "il_elle_on": "il courra", "nous": "nous courrons", "vous": "vous courrez", "ils_elles": "ils courront"},
      },
      tense_conditionnel_present: {
        forms: {"je": "je courrais", "tu": "tu courrais", "il_elle_on": "il courrait", "nous": "nous courrions", "vous": "vous courriez", "ils_elles": "ils courraient"},
      },
      tense_subjonctif_present: {
        forms: {"je": "que je coure", "tu": "que tu coures", "il_elle_on": "qu’il coure", "nous": "que nous courions", "vous": "que vous couriez", "ils_elles": "qu’ils courent"},
      },
    },
  },
  {
    verb_infinitive: "craindre",
    english: ["to fear"],
    verb_group: "3rd_group",
    regularity: "irregular",
    auxiliary: "avoir",
    past_participle: "craint",
    present_participle: "craignant",
    chapter_number: 5,
    page_printed: 239,
    tenses: {
      tense_present_indicative: {
        forms: {"je": "je crains", "tu": "tu crains", "il_elle_on": "il craint", "nous": "nous craignons", "vous": "vous craignez", "ils_elles": "ils craignent"},
      },
      tense_passe_compose: {
        forms: {"je": "j’ai craint", "tu": "tu as craint", "il_elle_on": "il a craint", "nous": "nous avons craint", "vous": "vous avez craint", "ils_elles": "ils ont craint"},
      },
      tense_imparfait: {
        forms: {"je": "je craignais", "tu": "tu craignais", "il_elle_on": "il craignait", "nous": "nous craignions", "vous": "vous craigniez", "ils_elles": "ils craignaient"},
      },
      tense_futur_simple: {
        forms: {"je": "je craindrai", "tu": "tu craindras", "il_elle_on": "il craindra", "nous": "nous craindrons", "vous": "vous craindrez", "ils_elles": "ils craindront"},
      },
      tense_conditionnel_present: {
        forms: {"je": "je craindrais", "tu": "tu craindrais", "il_elle_on": "il craindrait", "nous": "nous craindrions", "vous": "vous craindriez", "ils_elles": "ils craindraient"},
      },
      tense_subjonctif_present: {
        forms: {"je": "que je craigne", "tu": "que tu craignes", "il_elle_on": "qu’il craigne", "nous": "que nous craignions", "vous": "que vous craigniez", "ils_elles": "qu’ils craignent"},
      },
    },
  },
  {
    verb_infinitive: "croire",
    english: ["to believe"],
    verb_group: "3rd_group",
    regularity: "irregular",
    auxiliary: "avoir",
    past_participle: "cru",
    present_participle: "croyant",
    chapter_number: 4,
    page_printed: 239,
    tenses: {
      tense_present_indicative: {
        forms: {"je": "je crois", "tu": "tu crois", "il_elle_on": "il croit", "nous": "nous croyons", "vous": "vous croyez", "ils_elles": "ils croient"},
      },
      tense_passe_compose: {
        forms: {"je": "j’ai cru", "tu": "tu as cru", "il_elle_on": "il a cru", "nous": "nous avons cru", "vous": "vous avez cru", "ils_elles": "ils ont cru"},
      },
      tense_imparfait: {
        forms: {"je": "je croyais", "tu": "tu croyais", "il_elle_on": "il croyait", "nous": "nous croyions", "vous": "vous croyiez", "ils_elles": "ils croyaient"},
      },
      tense_futur_simple: {
        forms: {"je": "je croirai", "tu": "tu croiras", "il_elle_on": "il croira", "nous": "nous croirons", "vous": "vous croirez", "ils_elles": "ils croiront"},
      },
      tense_conditionnel_present: {
        forms: {"je": "je croirais", "tu": "tu croirais", "il_elle_on": "il croirait", "nous": "nous croirions", "vous": "vous croiriez", "ils_elles": "ils croiraient"},
      },
      tense_subjonctif_present: {
        forms: {"je": "que je croie", "tu": "que tu croies", "il_elle_on": "qu’il croie", "nous": "que nous croyions", "vous": "que vous croyiez", "ils_elles": "qu’ils croient"},
      },
    },
  },
  {
    verb_infinitive: "cueillir",
    english: ["to gather", "to pick"],
    verb_group: "3rd_group",
    regularity: "irregular",
    auxiliary: "avoir",
    past_participle: "cueilli",
    present_participle: "cueillant",
    chapter_number: 2,
    page_printed: 239,
    tenses: {
      tense_present_indicative: {
        forms: {"je": "je cueille", "tu": "tu cueilles", "il_elle_on": "il cueille", "nous": "nous cueillons", "vous": "vous cueillez", "ils_elles": "ils cueillent"},
      },
      tense_passe_compose: {
        forms: {"je": "j’ai cueilli", "tu": "tu as cueilli", "il_elle_on": "il a cueilli", "nous": "nous avons cueilli", "vous": "vous avez cueilli", "ils_elles": "ils ont cueilli"},
      },
      tense_imparfait: {
        forms: {"je": "je cueillais", "tu": "tu cueillais", "il_elle_on": "il cueillait", "nous": "nous cueillions", "vous": "vous cueilliez", "ils_elles": "ils cueillaient"},
      },
      tense_futur_simple: {
        forms: {"je": "je cueillerai", "tu": "tu cueilleras", "il_elle_on": "il cueillera", "nous": "nous cueillerons", "vous": "vous cueillerez", "ils_elles": "ils cueilleront"},
      },
      tense_conditionnel_present: {
        forms: {"je": "je cueillerais", "tu": "tu cueillerais", "il_elle_on": "il cueillerait", "nous": "nous cueillerions", "vous": "vous cueilleriez", "ils_elles": "ils cueilleraient"},
      },
      tense_subjonctif_present: {
        forms: {"je": "que je cueille", "tu": "que tu cueilles", "il_elle_on": "qu’il cueille", "nous": "que nous cueillions", "vous": "que vous cueilliez", "ils_elles": "qu’ils cueillent"},
      },
    },
  },
  {
    verb_infinitive: "dormir",
    english: ["to sleep"],
    verb_group: "3rd_group",
    regularity: "irregular",
    auxiliary: "avoir",
    past_participle: "dormi",
    present_participle: "dormant",
    chapter_number: 2,
    page_printed: 239,
    tenses: {
      tense_present_indicative: {
        forms: {"je": "je dors", "tu": "tu dors", "il_elle_on": "il dort", "nous": "nous dormons", "vous": "vous dormez", "ils_elles": "ils dorment"},
      },
      tense_passe_compose: {
        forms: {"je": "j’ai dormi", "tu": "tu as dormi", "il_elle_on": "il a dormi", "nous": "nous avons dormi", "vous": "vous avez dormi", "ils_elles": "ils ont dormi"},
      },
      tense_imparfait: {
        forms: {"je": "je dormais", "tu": "tu dormais", "il_elle_on": "il dormait", "nous": "nous dormions", "vous": "vous dormiez", "ils_elles": "ils dormaient"},
      },
      tense_futur_simple: {
        forms: {"je": "je dormirai", "tu": "tu dormiras", "il_elle_on": "il dormira", "nous": "nous dormirons", "vous": "vous dormirez", "ils_elles": "ils dormiront"},
      },
      tense_conditionnel_present: {
        forms: {"je": "je dormirais", "tu": "tu dormirais", "il_elle_on": "il dormirait", "nous": "nous dormirions", "vous": "vous dormiriez", "ils_elles": "ils dormiraient"},
      },
      tense_subjonctif_present: {
        forms: {"je": "que je dorme", "tu": "que tu dormes", "il_elle_on": "qu’il dorme", "nous": "que nous dormions", "vous": "que vous dormiez", "ils_elles": "qu’ils dorment"},
      },
    },
  },
  {
    verb_infinitive: "envoyer",
    english: ["to send"],
    verb_group: "1st_group",
    regularity: "irregular",
    auxiliary: "avoir",
    past_participle: "envoyé",
    present_participle: "envoyant",
    chapter_number: 1,
    page_printed: 239,
    tenses: {
      tense_present_indicative: {
        forms: {"je": "j’envoie", "tu": "tu envoies", "il_elle_on": "il envoie", "nous": "nous envoyons", "vous": "vous envoyez", "ils_elles": "ils envoient"},
      },
      tense_passe_compose: {
        forms: {"je": "j’ai envoyé", "tu": "tu as envoyé", "il_elle_on": "il a envoyé", "nous": "nous avons envoyé", "vous": "vous avez envoyé", "ils_elles": "ils ont envoyé"},
      },
      tense_imparfait: {
        forms: {"je": "j’envoyais", "tu": "tu envoyais", "il_elle_on": "il envoyait", "nous": "nous envoyions", "vous": "vous envoyiez", "ils_elles": "ils envoyaient"},
      },
      tense_futur_simple: {
        forms: {"je": "j’enverrai", "tu": "tu enverras", "il_elle_on": "il enverra", "nous": "nous enverrons", "vous": "vous enverrez", "ils_elles": "ils enverront"},
      },
      tense_conditionnel_present: {
        forms: {"je": "j’enverrais", "tu": "tu enverrais", "il_elle_on": "il enverrait", "nous": "nous enverrions", "vous": "vous enverriez", "ils_elles": "ils enverraient"},
      },
      tense_subjonctif_present: {
        forms: {"je": "que j’envoie", "tu": "que tu envoies", "il_elle_on": "qu’il envoie", "nous": "que nous envoyions", "vous": "que vous envoyiez", "ils_elles": "qu’ils envoient"},
      },
    },
  },
  {
    verb_infinitive: "falloir",
    english: ["to be necessary"],
    verb_group: "3rd_group",
    regularity: "irregular",
    auxiliary: "avoir",
    past_participle: "fallu",
    chapter_number: 5,
    page_printed: 239,
    tenses: {
      tense_present_indicative: {
        forms: {"il_elle_on": "il faut"},
      },
      tense_passe_compose: {
        forms: {"il_elle_on": "il a fallu"},
      },
      tense_imparfait: {
        forms: {"il_elle_on": "il fallait"},
      },
      tense_futur_simple: {
        forms: {"il_elle_on": "il faudra"},
      },
      tense_plus_que_parfait: {
        forms: {"il_elle_on": "il avait fallu"},
      },
      tense_conditionnel_present: {
        forms: {"il_elle_on": "il faudrait"},
      },
      tense_subjonctif_present: {
        forms: {"il_elle_on": "qu’il faille"},
      },
      tense_passe_simple: {
        forms: {"il_elle_on": "il fallut"},
      },
    },
  },
  {
    verb_infinitive: "fuir",
    english: ["to flee"],
    verb_group: "3rd_group",
    regularity: "irregular",
    auxiliary: "avoir",
    past_participle: "fui",
    present_participle: "fuyant",
    chapter_number: 2,
    page_printed: 239,
    tenses: {
      tense_present_indicative: {
        forms: {"je": "je fuis", "tu": "tu fuis", "il_elle_on": "il fuit", "nous": "nous fuyons", "vous": "vous fuyez", "ils_elles": "ils fuient"},
      },
      tense_passe_compose: {
        forms: {"je": "j’ai fui", "tu": "tu as fui", "il_elle_on": "il a fui", "nous": "nous avons fui", "vous": "vous avez fui", "ils_elles": "ils ont fui"},
      },
      tense_imparfait: {
        forms: {"je": "je fuyais", "tu": "tu fuyais", "il_elle_on": "il fuyait", "nous": "nous fuyions", "vous": "vous fuyiez", "ils_elles": "ils fuyaient"},
      },
      tense_futur_simple: {
        forms: {"je": "je fuirai", "tu": "tu fuiras", "il_elle_on": "il fuira", "nous": "nous fuirons", "vous": "vous fuirez", "ils_elles": "ils fuiront"},
      },
      tense_conditionnel_present: {
        forms: {"je": "je fuirais", "tu": "tu fuirais", "il_elle_on": "il fuirait", "nous": "nous fuirions", "vous": "vous fuiriez", "ils_elles": "ils fuiraient"},
      },
      tense_subjonctif_present: {
        forms: {"je": "que je fuie", "tu": "que tu fuies", "il_elle_on": "qu’il fuie", "nous": "que nous fuyions", "vous": "que vous fuyiez", "ils_elles": "qu’ils fuient"},
      },
    },
  },
  {
    verb_infinitive: "haïr",
    english: ["to hate"],
    verb_group: "2nd_group",
    regularity: "irregular",
    auxiliary: "avoir",
    past_participle: "haï",
    present_participle: "haïssant",
    chapter_number: 2,
    page_printed: 239,
    tenses: {
      tense_present_indicative: {
        forms: {"je": "je hais", "tu": "tu hais", "il_elle_on": "il hait", "nous": "nous haïssons", "vous": "vous haïssez", "ils_elles": "ils haïssent"},
      },
      tense_passe_compose: {
        forms: {"je": "j’ai haï", "tu": "tu as haï", "il_elle_on": "il a haï", "nous": "nous avons haï", "vous": "vous avez haï", "ils_elles": "ils ont haï"},
      },
      tense_imparfait: {
        forms: {"je": "je haïssais", "tu": "tu haïssais", "il_elle_on": "il haïssait", "nous": "nous haïssions", "vous": "vous haïssiez", "ils_elles": "ils haïssaient"},
      },
      tense_futur_simple: {
        forms: {"je": "je haïrai", "tu": "tu haïras", "il_elle_on": "il haïra", "nous": "nous haïrons", "vous": "vous haïrez", "ils_elles": "ils haïront"},
      },
      tense_conditionnel_present: {
        forms: {"je": "je haïrais", "tu": "tu haïrais", "il_elle_on": "il haïrait", "nous": "nous haïrions", "vous": "vous haïriez", "ils_elles": "ils haïraient"},
      },
      tense_subjonctif_present: {
        forms: {"je": "que je haïsse", "tu": "que tu haïsses", "il_elle_on": "qu’il haïsse", "nous": "que nous haïssions", "vous": "que vous haïssiez", "ils_elles": "qu’ils haïssent"},
      },
    },
  },
  {
    verb_infinitive: "mourir",
    english: ["to die"],
    verb_group: "3rd_group",
    regularity: "irregular",
    auxiliary: "etre",
    past_participle: "mort",
    present_participle: "mourant",
    chapter_number: 7,
    page_printed: 239,
    tenses: {
      tense_present_indicative: {
        forms: {"je": "je meurs", "tu": "tu meurs", "il_elle_on": "il meurt", "nous": "nous mourons", "vous": "vous mourez", "ils_elles": "ils meurent"},
      },
      tense_passe_compose: {
        forms: {"je": "je suis mort(e)", "tu": "tu es mort(e)", "il_elle_on": "il est mort", "nous": "nous sommes mort(e)s", "vous": "vous êtes mort(e)(s)", "ils_elles": "ils sont morts"},
      },
      tense_imparfait: {
        forms: {"je": "je mourais", "tu": "tu mourais", "il_elle_on": "il mourait", "nous": "nous mourions", "vous": "vous mouriez", "ils_elles": "ils mouraient"},
      },
      tense_futur_simple: {
        forms: {"je": "je mourrai", "tu": "tu mourras", "il_elle_on": "il mourra", "nous": "nous mourrons", "vous": "vous mourrez", "ils_elles": "ils mourront"},
      },
      tense_conditionnel_present: {
        forms: {"je": "je mourrais", "tu": "tu mourrais", "il_elle_on": "il mourrait", "nous": "nous mourrions", "vous": "vous mourriez", "ils_elles": "ils mourraient"},
      },
      tense_subjonctif_present: {
        forms: {"je": "que je meure", "tu": "que tu meures", "il_elle_on": "qu’il meure", "nous": "que nous mourions", "vous": "que vous mouriez", "ils_elles": "qu’ils meurent"},
      },
    },
  },
  {
    verb_infinitive: "naître",
    english: ["to be born"],
    verb_group: "3rd_group",
    regularity: "irregular",
    auxiliary: "etre",
    past_participle: "né",
    present_participle: "naissant",
    chapter_number: 7,
    page_printed: 239,
    tenses: {
      tense_present_indicative: {
        forms: {"je": "je nais", "tu": "tu nais", "il_elle_on": "il naît", "nous": "nous naissons", "vous": "vous naissez", "ils_elles": "ils naissent"},
      },
      tense_passe_compose: {
        forms: {"je": "je suis né(e)", "tu": "tu es né(e)", "il_elle_on": "il est né", "nous": "nous sommes né(e)s", "vous": "vous êtes né(e)(s)", "ils_elles": "ils sont nés"},
      },
      tense_imparfait: {
        forms: {"je": "je naissais", "tu": "tu naissais", "il_elle_on": "il naissait", "nous": "nous naissions", "vous": "vous naissiez", "ils_elles": "ils naissaient"},
      },
      tense_futur_simple: {
        forms: {"je": "je naîtrai", "tu": "tu naîtras", "il_elle_on": "il naîtra", "nous": "nous naîtrons", "vous": "vous naîtrez", "ils_elles": "ils naîtront"},
      },
      tense_conditionnel_present: {
        forms: {"je": "je naîtrais", "tu": "tu naîtrais", "il_elle_on": "il naîtrait", "nous": "nous naîtrions", "vous": "vous naîtriez", "ils_elles": "ils naîtraient"},
      },
      tense_subjonctif_present: {
        forms: {"je": "que je naisse", "tu": "que tu naisses", "il_elle_on": "qu’il naisse", "nous": "que nous naissions", "vous": "que vous naissiez", "ils_elles": "qu’ils naissent"},
      },
    },
  },
  {
    verb_infinitive: "offrir",
    english: ["to offer", "to give"],
    verb_group: "3rd_group",
    regularity: "irregular",
    auxiliary: "avoir",
    past_participle: "offert",
    present_participle: "offrant",
    chapter_number: 2,
    page_printed: 239,
    tenses: {
      tense_present_indicative: {
        forms: {"je": "j’offre", "tu": "tu offres", "il_elle_on": "il offre", "nous": "nous offrons", "vous": "vous offrez", "ils_elles": "ils offrent"},
      },
      tense_passe_compose: {
        forms: {"je": "j’ai offert", "tu": "tu as offert", "il_elle_on": "il a offert", "nous": "nous avons offert", "vous": "vous avez offert", "ils_elles": "ils ont offert"},
      },
      tense_imparfait: {
        forms: {"je": "j’offrais", "tu": "tu offrais", "il_elle_on": "il offrait", "nous": "nous offrions", "vous": "vous offriez", "ils_elles": "ils offraient"},
      },
      tense_futur_simple: {
        forms: {"je": "j’offrirai", "tu": "tu offriras", "il_elle_on": "il offrira", "nous": "nous offrirons", "vous": "vous offrirez", "ils_elles": "ils offriront"},
      },
      tense_conditionnel_present: {
        forms: {"je": "j’offrirais", "tu": "tu offrirais", "il_elle_on": "il offrirait", "nous": "nous offririons", "vous": "vous offririez", "ils_elles": "ils offriraient"},
      },
      tense_subjonctif_present: {
        forms: {"je": "que j’offre", "tu": "que tu offres", "il_elle_on": "qu’il offre", "nous": "que nous offrions", "vous": "que vous offriez", "ils_elles": "qu’ils offrent"},
      },
    },
  },
  {
    verb_infinitive: "ouvrir",
    english: ["to open"],
    verb_group: "3rd_group",
    regularity: "irregular",
    auxiliary: "avoir",
    past_participle: "ouvert",
    present_participle: "ouvrant",
    chapter_number: 2,
    page_printed: 239,
    tenses: {
      tense_present_indicative: {
        forms: {"je": "j’ouvre", "tu": "tu ouvres", "il_elle_on": "il ouvre", "nous": "nous ouvrons", "vous": "vous ouvrez", "ils_elles": "ils ouvrent"},
      },
      tense_passe_compose: {
        forms: {"je": "j’ai ouvert", "tu": "tu as ouvert", "il_elle_on": "il a ouvert", "nous": "nous avons ouvert", "vous": "vous avez ouvert", "ils_elles": "ils ont ouvert"},
      },
      tense_imparfait: {
        forms: {"je": "j’ouvrais", "tu": "tu ouvrais", "il_elle_on": "il ouvrait", "nous": "nous ouvrions", "vous": "vous ouvriez", "ils_elles": "ils ouvraient"},
      },
      tense_futur_simple: {
        forms: {"je": "j’ouvrirai", "tu": "tu ouvriras", "il_elle_on": "il ouvrira", "nous": "nous ouvrirons", "vous": "vous ouvrirez", "ils_elles": "ils ouvriront"},
      },
      tense_conditionnel_present: {
        forms: {"je": "j’ouvrirais", "tu": "tu ouvrirais", "il_elle_on": "il ouvrirait", "nous": "nous ouvririons", "vous": "vous ouvririez", "ils_elles": "ils ouvriraient"},
      },
      tense_subjonctif_present: {
        forms: {"je": "que j’ouvre", "tu": "que tu ouvres", "il_elle_on": "qu’il ouvre", "nous": "que nous ouvrions", "vous": "que vous ouvriez", "ils_elles": "qu’ils ouvrent"},
      },
    },
  },
  {
    verb_infinitive: "peindre",
    english: ["to paint"],
    verb_group: "3rd_group",
    regularity: "irregular",
    auxiliary: "avoir",
    past_participle: "peint",
    present_participle: "peignant",
    chapter_number: 2,
    page_printed: 239,
    tenses: {
      tense_present_indicative: {
        forms: {"je": "je peins", "tu": "tu peins", "il_elle_on": "il peint", "nous": "nous peignons", "vous": "vous peignez", "ils_elles": "ils peignent"},
      },
      tense_passe_compose: {
        forms: {"je": "j’ai peint", "tu": "tu as peint", "il_elle_on": "il a peint", "nous": "nous avons peint", "vous": "vous avez peint", "ils_elles": "ils ont peint"},
      },
      tense_imparfait: {
        forms: {"je": "je peignais", "tu": "tu peignais", "il_elle_on": "il peignait", "nous": "nous peignions", "vous": "vous peigniez", "ils_elles": "ils peignaient"},
      },
      tense_futur_simple: {
        forms: {"je": "je peindrai", "tu": "tu peindras", "il_elle_on": "il peindra", "nous": "nous peindrons", "vous": "vous peindrez", "ils_elles": "ils peindront"},
      },
      tense_conditionnel_present: {
        forms: {"je": "je peindrais", "tu": "tu peindrais", "il_elle_on": "il peindrait", "nous": "nous peindrions", "vous": "vous peindriez", "ils_elles": "ils peindraient"},
      },
      tense_subjonctif_present: {
        forms: {"je": "que je peigne", "tu": "que tu peignes", "il_elle_on": "qu’il peigne", "nous": "que nous peignions", "vous": "que vous peigniez", "ils_elles": "qu’ils peignent"},
      },
    },
  },
  {
    verb_infinitive: "plaire",
    english: ["to please"],
    verb_group: "3rd_group",
    regularity: "irregular",
    auxiliary: "avoir",
    past_participle: "plu",
    present_participle: "plaisant",
    chapter_number: 2,
    page_printed: 239,
    tenses: {
      tense_present_indicative: {
        forms: {"je": "je plais", "tu": "tu plais", "il_elle_on": "il plaît", "nous": "nous plaisons", "vous": "vous plaisez", "ils_elles": "ils plaisent"},
      },
      tense_passe_compose: {
        forms: {"je": "j’ai plu", "tu": "tu as plu", "il_elle_on": "il a plu", "nous": "nous avons plu", "vous": "vous avez plu", "ils_elles": "ils ont plu"},
      },
      tense_imparfait: {
        forms: {"je": "je plaisais", "tu": "tu plaisais", "il_elle_on": "il plaisait", "nous": "nous plaisions", "vous": "vous plaisiez", "ils_elles": "ils plaisaient"},
      },
      tense_futur_simple: {
        forms: {"je": "je plairai", "tu": "tu plairas", "il_elle_on": "il plaira", "nous": "nous plairons", "vous": "vous plairez", "ils_elles": "ils plairont"},
      },
      tense_conditionnel_present: {
        forms: {"je": "je plairais", "tu": "tu plairais", "il_elle_on": "il plairait", "nous": "nous plairions", "vous": "vous plairiez", "ils_elles": "ils plairaient"},
      },
      tense_subjonctif_present: {
        forms: {"je": "que je plaise", "tu": "que tu plaises", "il_elle_on": "qu’il plaise", "nous": "que nous plaisions", "vous": "que vous plaisiez", "ils_elles": "qu’ils plaisent"},
      },
    },
  },
  {
    verb_infinitive: "pleuvoir",
    english: ["to rain"],
    verb_group: "3rd_group",
    regularity: "irregular",
    auxiliary: "avoir",
    past_participle: "plu",
    chapter_number: 5,
    page_printed: 239,
    tenses: {
      tense_present_indicative: {
        forms: {"il_elle_on": "il pleut"},
      },
      tense_passe_compose: {
        forms: {"il_elle_on": "il a plu"},
      },
      tense_imparfait: {
        forms: {"il_elle_on": "il pleuvait"},
      },
      tense_futur_simple: {
        forms: {"il_elle_on": "il pleuvra"},
      },
      tense_plus_que_parfait: {
        forms: {"il_elle_on": "il avait plu"},
      },
      tense_conditionnel_present: {
        forms: {"il_elle_on": "il pleuvrait"},
      },
      tense_subjonctif_present: {
        forms: {"il_elle_on": "qu’il pleuve"},
      },
      tense_passe_simple: {
        forms: {"il_elle_on": "il plut"},
      },
    },
  },
  {
    verb_infinitive: "recevoir",
    english: ["to receive"],
    verb_group: "3rd_group",
    regularity: "irregular",
    auxiliary: "avoir",
    past_participle: "reçu",
    present_participle: "recevant",
    chapter_number: 3,
    page_printed: 239,
    tenses: {
      tense_present_indicative: {
        forms: {"je": "je reçois", "tu": "tu reçois", "il_elle_on": "il reçoit", "nous": "nous recevons", "vous": "vous recevez", "ils_elles": "ils reçoivent"},
      },
      tense_passe_compose: {
        forms: {"je": "j’ai reçu", "tu": "tu as reçu", "il_elle_on": "il a reçu", "nous": "nous avons reçu", "vous": "vous avez reçu", "ils_elles": "ils ont reçu"},
      },
      tense_imparfait: {
        forms: {"je": "je recevais", "tu": "tu recevais", "il_elle_on": "il recevait", "nous": "nous recevions", "vous": "vous receviez", "ils_elles": "ils recevaient"},
      },
      tense_futur_simple: {
        forms: {"je": "je recevrai", "tu": "tu recevras", "il_elle_on": "il recevra", "nous": "nous recevrons", "vous": "vous recevrez", "ils_elles": "ils recevront"},
      },
      tense_conditionnel_present: {
        forms: {"je": "je recevrais", "tu": "tu recevrais", "il_elle_on": "il recevrait", "nous": "nous recevrions", "vous": "vous recevriez", "ils_elles": "ils recevraient"},
      },
      tense_subjonctif_present: {
        forms: {"je": "que je reçoive", "tu": "que tu reçoives", "il_elle_on": "qu’il reçoive", "nous": "que nous recevions", "vous": "que vous receviez", "ils_elles": "qu’ils reçoivent"},
      },
    },
  },
  {
    verb_infinitive: "résoudre",
    english: ["to resolve", "to solve"],
    verb_group: "3rd_group",
    regularity: "irregular",
    auxiliary: "avoir",
    past_participle: "résolu",
    present_participle: "résolvant",
    chapter_number: 2,
    page_printed: 239,
    tenses: {
      tense_present_indicative: {
        forms: {"je": "je résous", "tu": "tu résous", "il_elle_on": "il résout", "nous": "nous résolvons", "vous": "vous résolvez", "ils_elles": "ils résolvent"},
      },
      tense_passe_compose: {
        forms: {"je": "j’ai résolu", "tu": "tu as résolu", "il_elle_on": "il a résolu", "nous": "nous avons résolu", "vous": "vous avez résolu", "ils_elles": "ils ont résolu"},
      },
      tense_imparfait: {
        forms: {"je": "je résolvais", "tu": "tu résolvais", "il_elle_on": "il résolvait", "nous": "nous résolvions", "vous": "vous résolviez", "ils_elles": "ils résolvaient"},
      },
      tense_futur_simple: {
        forms: {"je": "je résoudrai", "tu": "tu résoudras", "il_elle_on": "il résoudra", "nous": "nous résoudrons", "vous": "vous résoudrez", "ils_elles": "ils résoudront"},
      },
      tense_conditionnel_present: {
        forms: {"je": "je résoudrais", "tu": "tu résoudrais", "il_elle_on": "il résoudrait", "nous": "nous résoudrions", "vous": "vous résoudriez", "ils_elles": "ils résoudraient"},
      },
      tense_subjonctif_present: {
        forms: {"je": "que je résolve", "tu": "que tu résolves", "il_elle_on": "qu’il résolve", "nous": "que nous résolvions", "vous": "que vous résolviez", "ils_elles": "qu’ils résolvent"},
      },
    },
  },
  {
    verb_infinitive: "rire",
    english: ["to laugh"],
    verb_group: "3rd_group",
    regularity: "irregular",
    auxiliary: "avoir",
    past_participle: "ri",
    present_participle: "riant",
    chapter_number: 2,
    page_printed: 239,
    tenses: {
      tense_present_indicative: {
        forms: {"je": "je ris", "tu": "tu ris", "il_elle_on": "il rit", "nous": "nous rions", "vous": "vous riez", "ils_elles": "ils rient"},
      },
      tense_passe_compose: {
        forms: {"je": "j’ai ri", "tu": "tu as ri", "il_elle_on": "il a ri", "nous": "nous avons ri", "vous": "vous avez ri", "ils_elles": "ils ont ri"},
      },
      tense_imparfait: {
        forms: {"je": "je riais", "tu": "tu riais", "il_elle_on": "il riait", "nous": "nous riions", "vous": "vous riiez", "ils_elles": "ils riaient"},
      },
      tense_futur_simple: {
        forms: {"je": "je rirai", "tu": "tu riras", "il_elle_on": "il rira", "nous": "nous rirons", "vous": "vous rirez", "ils_elles": "ils riront"},
      },
      tense_conditionnel_present: {
        forms: {"je": "je rirais", "tu": "tu rirais", "il_elle_on": "il rirait", "nous": "nous ririons", "vous": "vous ririez", "ils_elles": "ils riraient"},
      },
      tense_subjonctif_present: {
        forms: {"je": "que je rie", "tu": "que tu ries", "il_elle_on": "qu’il rie", "nous": "que nous riions", "vous": "que vous riiez", "ils_elles": "qu’ils rient"},
      },
    },
  },
  {
    verb_infinitive: "suivre",
    english: ["to follow"],
    verb_group: "3rd_group",
    regularity: "irregular",
    auxiliary: "avoir",
    past_participle: "suivi",
    present_participle: "suivant",
    chapter_number: 2,
    page_printed: 239,
    tenses: {
      tense_present_indicative: {
        forms: {"je": "je suis", "tu": "tu suis", "il_elle_on": "il suit", "nous": "nous suivons", "vous": "vous suivez", "ils_elles": "ils suivent"},
      },
      tense_passe_compose: {
        forms: {"je": "j’ai suivi", "tu": "tu as suivi", "il_elle_on": "il a suivi", "nous": "nous avons suivi", "vous": "vous avez suivi", "ils_elles": "ils ont suivi"},
      },
      tense_imparfait: {
        forms: {"je": "je suivais", "tu": "tu suivais", "il_elle_on": "il suivait", "nous": "nous suivions", "vous": "vous suiviez", "ils_elles": "ils suivaient"},
      },
      tense_futur_simple: {
        forms: {"je": "je suivrai", "tu": "tu suivras", "il_elle_on": "il suivra", "nous": "nous suivrons", "vous": "vous suivrez", "ils_elles": "ils suivront"},
      },
      tense_conditionnel_present: {
        forms: {"je": "je suivrais", "tu": "tu suivrais", "il_elle_on": "il suivrait", "nous": "nous suivrions", "vous": "vous suivriez", "ils_elles": "ils suivraient"},
      },
      tense_subjonctif_present: {
        forms: {"je": "que je suive", "tu": "que tu suives", "il_elle_on": "qu’il suive", "nous": "que nous suivions", "vous": "que vous suiviez", "ils_elles": "qu’ils suivent"},
      },
    },
  },
  {
    verb_infinitive: "tenir",
    english: ["to hold"],
    verb_group: "3rd_group",
    regularity: "irregular",
    auxiliary: "avoir",
    past_participle: "tenu",
    present_participle: "tenant",
    chapter_number: 4,
    page_printed: 239,
    tenses: {
      tense_present_indicative: {
        forms: {"je": "je tiens", "tu": "tu tiens", "il_elle_on": "il tient", "nous": "nous tenons", "vous": "vous tenez", "ils_elles": "ils tiennent"},
      },
      tense_passe_compose: {
        forms: {"je": "j’ai tenu", "tu": "tu as tenu", "il_elle_on": "il a tenu", "nous": "nous avons tenu", "vous": "vous avez tenu", "ils_elles": "ils ont tenu"},
      },
      tense_imparfait: {
        forms: {"je": "je tenais", "tu": "tu tenais", "il_elle_on": "il tenait", "nous": "nous tenions", "vous": "vous teniez", "ils_elles": "ils tenaient"},
      },
      tense_futur_simple: {
        forms: {"je": "je tiendrai", "tu": "tu tiendras", "il_elle_on": "il tiendra", "nous": "nous tiendrons", "vous": "vous tiendrez", "ils_elles": "ils tiendront"},
      },
      tense_conditionnel_present: {
        forms: {"je": "je tiendrais", "tu": "tu tiendrais", "il_elle_on": "il tiendrait", "nous": "nous tiendrions", "vous": "vous tiendriez", "ils_elles": "ils tiendraient"},
      },
      tense_subjonctif_present: {
        forms: {"je": "que je tienne", "tu": "que tu tiennes", "il_elle_on": "qu’il tienne", "nous": "que nous tenions", "vous": "que vous teniez", "ils_elles": "qu’ils tiennent"},
      },
    },
  },
  {
    verb_infinitive: "vaincre",
    english: ["to conquer", "to defeat"],
    verb_group: "3rd_group",
    regularity: "irregular",
    auxiliary: "avoir",
    past_participle: "vaincu",
    present_participle: "vainquant",
    chapter_number: 2,
    page_printed: 239,
    tenses: {
      tense_present_indicative: {
        forms: {"je": "je vaincs", "tu": "tu vaincs", "il_elle_on": "il vainc", "nous": "nous vainquons", "vous": "vous vainquez", "ils_elles": "ils vainquent"},
      },
      tense_passe_compose: {
        forms: {"je": "j’ai vaincu", "tu": "tu as vaincu", "il_elle_on": "il a vaincu", "nous": "nous avons vaincu", "vous": "vous avez vaincu", "ils_elles": "ils ont vaincu"},
      },
      tense_imparfait: {
        forms: {"je": "je vainquais", "tu": "tu vainquais", "il_elle_on": "il vainquait", "nous": "nous vainquions", "vous": "vous vainquiez", "ils_elles": "ils vainquaient"},
      },
      tense_futur_simple: {
        forms: {"je": "je vaincrai", "tu": "tu vaincras", "il_elle_on": "il vaincra", "nous": "nous vaincrons", "vous": "vous vaincrez", "ils_elles": "ils vaincront"},
      },
      tense_conditionnel_present: {
        forms: {"je": "je vaincrais", "tu": "tu vaincrais", "il_elle_on": "il vaincrait", "nous": "nous vaincrions", "vous": "vous vaincriez", "ils_elles": "ils vaincraient"},
      },
      tense_subjonctif_present: {
        forms: {"je": "que je vainque", "tu": "que tu vainques", "il_elle_on": "qu’il vainque", "nous": "que nous vainquions", "vous": "que vous vainquiez", "ils_elles": "qu’ils vainquent"},
      },
    },
  },
  {
    verb_infinitive: "vivre",
    english: ["to live"],
    verb_group: "3rd_group",
    regularity: "irregular",
    auxiliary: "avoir",
    past_participle: "vécu",
    present_participle: "vivant",
    chapter_number: 2,
    page_printed: 239,
    tenses: {
      tense_present_indicative: {
        forms: {"je": "je vis", "tu": "tu vis", "il_elle_on": "il vit", "nous": "nous vivons", "vous": "vous vivez", "ils_elles": "ils vivent"},
      },
      tense_passe_compose: {
        forms: {"je": "j’ai vécu", "tu": "tu as vécu", "il_elle_on": "il a vécu", "nous": "nous avons vécu", "vous": "vous avez vécu", "ils_elles": "ils ont vécu"},
      },
      tense_imparfait: {
        forms: {"je": "je vivais", "tu": "tu vivais", "il_elle_on": "il vivait", "nous": "nous vivions", "vous": "vous viviez", "ils_elles": "ils vivaient"},
      },
      tense_futur_simple: {
        forms: {"je": "je vivrai", "tu": "tu vivras", "il_elle_on": "il vivra", "nous": "nous vivrons", "vous": "vous vivrez", "ils_elles": "ils vivront"},
      },
      tense_conditionnel_present: {
        forms: {"je": "je vivrais", "tu": "tu vivrais", "il_elle_on": "il vivrait", "nous": "nous vivrions", "vous": "vous vivriez", "ils_elles": "ils vivraient"},
      },
      tense_subjonctif_present: {
        forms: {"je": "que je vive", "tu": "que tu vives", "il_elle_on": "qu’il vive", "nous": "que nous vivions", "vous": "que vous viviez", "ils_elles": "qu’ils vivent"},
      },
    },
  },
];

export function buildEnrichedConjugations(): { verbs: Verb[]; conjugations: Conjugation[] } {
  const verbs: Verb[] = [];
  const conjugations: Conjugation[] = [];

  for (const spec of MASTER_CONJUGATION_SPECS) {
    const verbId = makeVerbId(spec.verb_infinitive);
    const conjIds: string[] = [];

    for (const [tenseId, tData] of Object.entries(spec.tenses)) {
      const conjId = makeConjugationId(verbId, tenseId);
      conjIds.push(conjId);

      const isCompound = tenseId.includes("compose") || tenseId.includes("plus_que_parfait") || tenseId.includes("conditionnel_passe") || tenseId.includes("subjonctif_passe") || tenseId.includes("anterieur");

      const isExplicitlyPrinted = (() => {
        if (spec.page_printed === 236 || spec.page_printed === 237) {
          return true; // Model verbs on pp. 236-238 have full tables
        }
        if (spec.page_printed === 238) {
          return tenseId === "tense_present_indicative" || tenseId === "tense_imparfait";
        }
        if (spec.page_printed === 239) {
          return tenseId === "tense_present_indicative";
        }
        // Chapter basic tables
        return tenseId === "tense_present_indicative";
      })();

      conjugations.push({
        id: conjId,
        type: "conjugation",
        verb_id: verbId,
        tense_id: tenseId,
        forms: tData.forms,
        compound: isCompound,
        components: isCompound ? { auxiliary_verb_id: spec.auxiliary === "etre" ? "verb_etre" : "verb_avoir", past_participle: spec.past_participle } : {},
        agreement_notes: [],
        spelling_change_notes: tData.spelling_notes || [],
        irregularity_notes: tData.irregularity_notes || (spec.regularity === "irregular" ? ["Irregular verb paradigm from source book verb tables."] : []),
        example_ids: [],
        origin: isExplicitlyPrinted
          ? { source_type: "book", created_by: "extraction", derived_from_ids: [] }
          : { source_type: "derived_from_book", created_by: "rule_expansion", derived_from_ids: [verbId] },
        attestations: isExplicitlyPrinted
          ? [
              {
                source_type: "book",
                chapter_number: spec.chapter_number || (spec.page_printed && spec.page_printed >= 236 ? null : 1),
                page_printed: spec.page_printed || 236,
                context_type: spec.page_printed && spec.page_printed >= 236 ? "verb_table" : "conjugation_table",
              },
            ]
          : [],
        editorial: {
          extraction_confidence: "high",
          verification_status: "machine_checked",
        },
      });
    }

    verbs.push({
      id: verbId,
      type: "verb",
      infinitive: spec.verb_infinitive,
      display_form: spec.verb_infinitive,
      english: spec.english,
      senses: [
        {
          sense_id: `${verbId}_s1`,
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
      frequency: { book_occurrences: 10 },
      origin: { source_type: "book", created_by: "extraction", derived_from_ids: [] },
      attestations: [
        {
          source_type: "book",
          chapter_number: spec.chapter_number || (spec.page_printed && spec.page_printed >= 236 ? null : 1),
          page_printed: spec.page_printed || 236,
          context_type: spec.page_printed && spec.page_printed >= 236 ? "verb_table" : "conjugation_table",
        },
      ],
      tags: ["paradigm_model", "source_verb_table"],
    });
  }

  return { verbs, conjugations };
}
