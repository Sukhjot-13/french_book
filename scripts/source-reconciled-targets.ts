// Auto-generated source-reconciled targets
import { Concept, GrammarRule, Verb, Expression, Example, Vocabulary } from '../src/lib/dataset/schemas';

export const RECONCILED_CONCEPTS: Concept[] = [
  {
    "id": "concept_interrogation",
    "name": "interrogation",
    "name_french": "l'interrogation",
    "description": "Formation of questions in French through intonation, est-ce que, and subject-verb inversion.",
    "relations": {},
    "study": {
      "learning_priority": 4,
      "usefulness": 4,
      "difficulty": 2
    },
    "tags": [
      "syntax",
      "interrogation"
    ]
  },
  {
    "id": "concept_negation",
    "name": "negation",
    "name_french": "la négation",
    "description": "Basic and complex negation in French using ne... pas, ne... jamais, ne... rien, ne... personne, and ne... ni... ni.",
    "relations": {},
    "study": {
      "learning_priority": 4,
      "usefulness": 4,
      "difficulty": 2
    },
    "tags": [
      "syntax",
      "negation"
    ]
  },
  {
    "id": "concept_movement",
    "name": "verbs of movement",
    "name_french": "les verbes de mouvement",
    "description": "Verbs expressing movement and change of location or state, conjugated with être in compound tenses.",
    "relations": {},
    "study": {
      "learning_priority": 4,
      "usefulness": 4,
      "difficulty": 2
    },
    "tags": [
      "verbs",
      "movement"
    ]
  },
  {
    "id": "concept_pronominal_verbs",
    "name": "pronominal verbs",
    "name_french": "les verbes pronominaux",
    "description": "Reflexive, reciprocal, idiomatic, and passive pronominal verbs conjugated with reflexive pronouns.",
    "relations": {},
    "study": {
      "learning_priority": 4,
      "usefulness": 4,
      "difficulty": 2
    },
    "tags": [
      "verbs",
      "pronominal"
    ]
  },
  {
    "id": "concept_past_time",
    "name": "past time",
    "name_french": "l'expression du temps passé",
    "description": "Narrating past actions and describing past situations using the passé composé, imparfait, and plus-que-parfait.",
    "relations": {},
    "study": {
      "learning_priority": 4,
      "usefulness": 4,
      "difficulty": 2
    },
    "tags": [
      "tenses",
      "past_time"
    ]
  },
  {
    "id": "concept_verb_preposition_patterns",
    "name": "verb preposition patterns",
    "name_french": "le régime prépositionnel des verbes",
    "description": "Verbal complement structures governing dependent infinitives or noun complements with à, de, or direct objects.",
    "relations": {},
    "study": {
      "learning_priority": 4,
      "usefulness": 4,
      "difficulty": 2
    },
    "tags": [
      "verbs",
      "prepositions"
    ]
  },
  {
    "id": "concept_passive_voice",
    "name": "passive voice",
    "name_french": "la voix passive",
    "description": "Formation and use of the passive voice with être and past participle, or avoidance via on or pronominals.",
    "relations": {},
    "study": {
      "learning_priority": 4,
      "usefulness": 4,
      "difficulty": 2
    },
    "tags": [
      "voice",
      "syntax"
    ]
  },
  {
    "id": "concept_indirect_speech",
    "name": "indirect speech",
    "name_french": "le discours indirect",
    "description": "Reporting statements, questions, and commands in indirect discourse, including tense shift rules (concordance des temps).",
    "relations": {},
    "study": {
      "learning_priority": 4,
      "usefulness": 4,
      "difficulty": 2
    },
    "tags": [
      "syntax",
      "discourse"
    ]
  },
  {
    "id": "concept_object_pronouns",
    "name": "object pronouns",
    "name_french": "les pronoms compléments",
    "description": "Direct and indirect object pronouns, adverbial pronouns y and en, disjunctive pronouns, and pronoun ordering.",
    "relations": {},
    "study": {
      "learning_priority": 4,
      "usefulness": 4,
      "difficulty": 2
    },
    "tags": [
      "pronouns",
      "syntax"
    ]
  },
  {
    "id": "concept_adjective_agreement",
    "name": "adjective agreement",
    "name_french": "l'accord des adjectifs",
    "description": "Gender and number agreement of qualifying, demonstrative, possessive, and interrogative adjectives with nouns.",
    "relations": {},
    "study": {
      "learning_priority": 4,
      "usefulness": 4,
      "difficulty": 2
    },
    "tags": [
      "morphology",
      "adjectives"
    ]
  },
  {
    "id": "concept_demonstratives_possessives",
    "name": "demonstratives and possessives",
    "name_french": "les démonstratifs et possessifs",
    "description": "Demonstrative adjectives and pronouns (ce, celui) and possessive adjectives and pronouns (mon, le mien).",
    "relations": {},
    "study": {
      "learning_priority": 4,
      "usefulness": 4,
      "difficulty": 2
    },
    "tags": [
      "pronouns",
      "adjectives"
    ]
  },
  {
    "id": "concept_relative_pronouns",
    "name": "relative pronouns",
    "name_french": "les pronoms relatifs",
    "description": "Connecting clauses using simple relative pronouns (qui, que, dont, où), compound relatives (lequel), and indefinite relatives (ce qui, ce que).",
    "relations": {},
    "study": {
      "learning_priority": 4,
      "usefulness": 4,
      "difficulty": 2
    },
    "tags": [
      "pronouns",
      "syntax"
    ]
  }
];

export const RECONCILED_RULES: GrammarRule[] = [
  {
    "id": "rule_interrogative_inversion_rules",
    "type": "grammar_rule",
    "title": "Subject-verb inversion in questions",
    "grammar_category": "syntax",
    "concept_ids": [
      "concept_interrogation"
    ],
    "tense_ids": [
      "tense_present_indicative"
    ],
    "summary": "Subject-verb inversion is used in formal French questions.",
    "explanation": "In formal questions, invert the subject pronoun and verb (e.g., Parles-tu français?). If the 3rd person singular verb ends in a vowel, insert euphonic -t- before il/elle/on (e.g., Parle-t-il?).",
    "usage_conditions": [],
    "trigger_words": [],
    "signal_words": [],
    "exceptions": [],
    "restrictions": [],
    "notes": [],
    "common_mistakes": [],
    "contrast_with_rule_ids": [],
    "related_rule_ids": [],
    "prerequisite_rule_ids": [],
    "example_ids": [],
    "exercise_ids": [],
    "study": {
      "learning_priority": 4,
      "usefulness": 4,
      "difficulty": 2
    },
    "attestations": [
      {
        "source_type": "book",
        "chapter_number": 2,
        "page_printed": 19,
        "context_type": "grammar_explanation"
      }
    ],
    "tags": [
      "source_reconciled_rule"
    ]
  },
  {
    "id": "rule_ne_ni_ni_construction",
    "type": "grammar_rule",
    "title": "Neither... nor negation with ne... ni... ni",
    "grammar_category": "negation",
    "concept_ids": [
      "concept_negation"
    ],
    "tense_ids": [
      "tense_present_indicative"
    ],
    "summary": "The conjunction ne... ni... ni expresses neither... nor.",
    "explanation": "The negative conjunction ne... ni... ni expresses 'neither... nor'. Omit 'pas' and place 'ne' before the verb, followed by 'ni' before each negated item (e.g., Je ne bois ni thé ni café).",
    "usage_conditions": [],
    "trigger_words": [],
    "signal_words": [],
    "exceptions": [],
    "restrictions": [],
    "notes": [],
    "common_mistakes": [],
    "contrast_with_rule_ids": [],
    "related_rule_ids": [],
    "prerequisite_rule_ids": [],
    "example_ids": [],
    "exercise_ids": [],
    "study": {
      "learning_priority": 4,
      "usefulness": 4,
      "difficulty": 2
    },
    "attestations": [
      {
        "source_type": "book",
        "chapter_number": 2,
        "page_printed": 22,
        "context_type": "grammar_explanation"
      }
    ],
    "tags": [
      "source_reconciled_rule"
    ]
  },
  {
    "id": "rule_modal_verbs_vouloir_pouvoir_devoir",
    "type": "grammar_rule",
    "title": "Modal verbs: vouloir, pouvoir, devoir",
    "grammar_category": "verbs",
    "concept_ids": [
      "concept_verb_preposition_patterns"
    ],
    "tense_ids": [
      "tense_present_indicative"
    ],
    "summary": "Vouloir, pouvoir, and devoir take a direct infinitive.",
    "explanation": "The modal verbs vouloir (to want), pouvoir (to be able to), and devoir (to have to / must) are followed directly by an infinitive without a preposition to express volition, ability/permission, and necessity.",
    "usage_conditions": [],
    "trigger_words": [],
    "signal_words": [],
    "exceptions": [],
    "restrictions": [],
    "notes": [],
    "common_mistakes": [],
    "contrast_with_rule_ids": [],
    "related_rule_ids": [],
    "prerequisite_rule_ids": [],
    "example_ids": [],
    "exercise_ids": [],
    "study": {
      "learning_priority": 4,
      "usefulness": 4,
      "difficulty": 2
    },
    "attestations": [
      {
        "source_type": "book",
        "chapter_number": 3,
        "page_printed": 28,
        "context_type": "grammar_explanation"
      }
    ],
    "tags": [
      "source_reconciled_rule"
    ]
  },
  {
    "id": "rule_oir_verbs_conjugation_patterns",
    "type": "grammar_rule",
    "title": "Conjugation patterns of -oir verbs",
    "grammar_category": "morphology",
    "concept_ids": [],
    "tense_ids": [
      "tense_present_indicative"
    ],
    "summary": "Verbs ending in -oir exhibit stem changes in the present tense.",
    "explanation": "Verbs ending in -oir (devoir, pouvoir, vouloir, savoir, voir, recevoir) are irregular with characteristic stem alterations between singular and plural forms in the present tense.",
    "usage_conditions": [],
    "trigger_words": [],
    "signal_words": [],
    "exceptions": [],
    "restrictions": [],
    "notes": [],
    "common_mistakes": [],
    "contrast_with_rule_ids": [],
    "related_rule_ids": [],
    "prerequisite_rule_ids": [],
    "example_ids": [],
    "exercise_ids": [],
    "study": {
      "learning_priority": 4,
      "usefulness": 4,
      "difficulty": 2
    },
    "attestations": [
      {
        "source_type": "book",
        "chapter_number": 3,
        "page_printed": 27,
        "context_type": "grammar_explanation"
      }
    ],
    "tags": [
      "source_reconciled_rule"
    ]
  },
  {
    "id": "rule_idiomatic_uses_of_aller",
    "type": "grammar_rule",
    "title": "Idiomatic uses of aller",
    "grammar_category": "expressions",
    "concept_ids": [
      "concept_movement"
    ],
    "tense_ids": [
      "tense_present_indicative"
    ],
    "summary": "Aller is used for greetings, physical well-being, and near future.",
    "explanation": "Aller is used idiomatically to inquire about health (Comment allez-vous? / Je vais bien), to indicate suitability (Ça te va bien), and as a semi-auxiliary for the futur proche (aller + infinitive).",
    "usage_conditions": [],
    "trigger_words": [],
    "signal_words": [],
    "exceptions": [],
    "restrictions": [],
    "notes": [],
    "common_mistakes": [],
    "contrast_with_rule_ids": [],
    "related_rule_ids": [],
    "prerequisite_rule_ids": [],
    "example_ids": [],
    "exercise_ids": [],
    "study": {
      "learning_priority": 4,
      "usefulness": 4,
      "difficulty": 2
    },
    "attestations": [
      {
        "source_type": "book",
        "chapter_number": 4,
        "page_printed": 35,
        "context_type": "grammar_explanation"
      }
    ],
    "tags": [
      "source_reconciled_rule"
    ]
  },
  {
    "id": "rule_venir_compounds_conjugation",
    "type": "grammar_rule",
    "title": "Conjugation of compounds of venir",
    "grammar_category": "morphology",
    "concept_ids": [
      "concept_movement"
    ],
    "tense_ids": [
      "tense_present_indicative"
    ],
    "summary": "Compounds of venir follow the conjugation of venir.",
    "explanation": "Compounds of venir (devenir, revenir, convenir, parvenir, se souvenir) conjugate identically to venir in all tenses. Devenir, revenir, and parvenir take être in compound tenses.",
    "usage_conditions": [],
    "trigger_words": [],
    "signal_words": [],
    "exceptions": [],
    "restrictions": [],
    "notes": [],
    "common_mistakes": [],
    "contrast_with_rule_ids": [],
    "related_rule_ids": [],
    "prerequisite_rule_ids": [],
    "example_ids": [],
    "exercise_ids": [],
    "study": {
      "learning_priority": 4,
      "usefulness": 4,
      "difficulty": 2
    },
    "attestations": [
      {
        "source_type": "book",
        "chapter_number": 4,
        "page_printed": 37,
        "context_type": "grammar_explanation"
      }
    ],
    "tags": [
      "source_reconciled_rule"
    ]
  },
  {
    "id": "rule_idiomatic_expressions_with_faire",
    "type": "grammar_rule",
    "title": "Idiomatic expressions with faire",
    "grammar_category": "expressions",
    "concept_ids": [],
    "tense_ids": [
      "tense_present_indicative"
    ],
    "summary": "Faire is used in expressions of weather, activities, and sports.",
    "explanation": "Faire enters into numerous idiomatic expressions for weather (il fait beau/chaud), sports and physical activities (faire du sport, faire du vélo), and household tasks (faire la cuisine, faire le ménage).",
    "usage_conditions": [],
    "trigger_words": [],
    "signal_words": [],
    "exceptions": [],
    "restrictions": [],
    "notes": [],
    "common_mistakes": [],
    "contrast_with_rule_ids": [],
    "related_rule_ids": [],
    "prerequisite_rule_ids": [],
    "example_ids": [],
    "exercise_ids": [],
    "study": {
      "learning_priority": 4,
      "usefulness": 4,
      "difficulty": 2
    },
    "attestations": [
      {
        "source_type": "book",
        "chapter_number": 4,
        "page_printed": 40,
        "context_type": "grammar_explanation"
      }
    ],
    "tags": [
      "source_reconciled_rule"
    ]
  },
  {
    "id": "rule_irregular_past_participles_categories",
    "type": "grammar_rule",
    "title": "Categories of irregular past participles",
    "grammar_category": "morphology",
    "concept_ids": [
      "concept_past_time"
    ],
    "tense_ids": [
      "tense_passe_compose"
    ],
    "summary": "Irregular past participles group by distinctive endings (-u, -is, -it, -ert).",
    "explanation": "Irregular past participles fall into four principal groups: ending in -u (bu, lu, vu, su, pu, voulu), ending in -is (pris, mis, assis), ending in -it (dit, écrit, fait), and ending in -ert (ouvert, offert, souffert).",
    "usage_conditions": [],
    "trigger_words": [],
    "signal_words": [],
    "exceptions": [],
    "restrictions": [],
    "notes": [],
    "common_mistakes": [],
    "contrast_with_rule_ids": [],
    "related_rule_ids": [],
    "prerequisite_rule_ids": [],
    "example_ids": [],
    "exercise_ids": [],
    "study": {
      "learning_priority": 4,
      "usefulness": 4,
      "difficulty": 2
    },
    "attestations": [
      {
        "source_type": "book",
        "chapter_number": 7,
        "page_printed": 62,
        "context_type": "grammar_explanation"
      }
    ],
    "tags": [
      "source_reconciled_rule"
    ]
  },
  {
    "id": "rule_etre_subject_agreement_rule",
    "type": "grammar_rule",
    "title": "Subject agreement with être in compound tenses",
    "grammar_category": "agreement",
    "concept_ids": [
      "concept_past_time",
      "concept_movement"
    ],
    "tense_ids": [
      "tense_passe_compose"
    ],
    "summary": "Past participles conjugated with être agree with the grammatical subject.",
    "explanation": "Verbs conjugated with être in compound tenses agree in gender and number with the grammatical subject: add -e for feminine, -s for masculine plural, and -es for feminine plural.",
    "usage_conditions": [],
    "trigger_words": [],
    "signal_words": [],
    "exceptions": [],
    "restrictions": [],
    "notes": [],
    "common_mistakes": [],
    "contrast_with_rule_ids": [],
    "related_rule_ids": [],
    "prerequisite_rule_ids": [],
    "example_ids": [],
    "exercise_ids": [],
    "study": {
      "learning_priority": 4,
      "usefulness": 4,
      "difficulty": 2
    },
    "attestations": [
      {
        "source_type": "book",
        "chapter_number": 7,
        "page_printed": 64,
        "context_type": "grammar_explanation"
      }
    ],
    "tags": [
      "source_reconciled_rule"
    ]
  },
  {
    "id": "rule_pronominal_verbs_in_passe_compose",
    "type": "grammar_rule",
    "title": "Pronominal verbs in the passé composé",
    "grammar_category": "verbs",
    "concept_ids": [
      "concept_pronominal_verbs",
      "concept_past_time"
    ],
    "tense_ids": [
      "tense_passe_compose"
    ],
    "summary": "Pronominal verbs take être and agree with preceding direct objects.",
    "explanation": "All pronominal verbs take être in compound tenses. The past participle agrees in gender and number with the reflexive pronoun only when the reflexive pronoun is a direct object, not an indirect object.",
    "usage_conditions": [],
    "trigger_words": [],
    "signal_words": [],
    "exceptions": [],
    "restrictions": [],
    "notes": [],
    "common_mistakes": [],
    "contrast_with_rule_ids": [],
    "related_rule_ids": [],
    "prerequisite_rule_ids": [],
    "example_ids": [],
    "exercise_ids": [],
    "study": {
      "learning_priority": 4,
      "usefulness": 4,
      "difficulty": 2
    },
    "attestations": [
      {
        "source_type": "book",
        "chapter_number": 7,
        "page_printed": 66,
        "context_type": "grammar_explanation"
      }
    ],
    "tags": [
      "source_reconciled_rule"
    ]
  },
  {
    "id": "rule_imparfait_with_depuis_and_venir_de",
    "type": "grammar_rule",
    "title": "Imparfait with depuis and venait de",
    "grammar_category": "tenses",
    "concept_ids": [
      "concept_past_time"
    ],
    "tense_ids": [
      "tense_imparfait"
    ],
    "summary": "Imparfait with depuis expresses ongoing actions; venait de expresses immediate past.",
    "explanation": "The imparfait with 'depuis' indicates an action that had been going on in the past when another event occurred. 'Venait de + infinitif' expresses an immediate past relative to a past time frame ('had just done').",
    "usage_conditions": [],
    "trigger_words": [],
    "signal_words": [],
    "exceptions": [],
    "restrictions": [],
    "notes": [],
    "common_mistakes": [],
    "contrast_with_rule_ids": [],
    "related_rule_ids": [],
    "prerequisite_rule_ids": [],
    "example_ids": [],
    "exercise_ids": [],
    "study": {
      "learning_priority": 4,
      "usefulness": 4,
      "difficulty": 2
    },
    "attestations": [
      {
        "source_type": "book",
        "chapter_number": 8,
        "page_printed": 72,
        "context_type": "grammar_explanation"
      }
    ],
    "tags": [
      "source_reconciled_rule"
    ]
  },
  {
    "id": "rule_si_clause_pattern_pqp_conditionnel_passe",
    "type": "grammar_rule",
    "title": "Hypothetical clauses with plus-que-parfait and past conditional",
    "grammar_category": "syntax",
    "concept_ids": [
      "concept_past_time"
    ],
    "tense_ids": [
      "tense_plus_que_parfait",
      "tense_conditionnel_passe"
    ],
    "summary": "Si + plus-que-parfait leads to past conditional for past hypothetical conditions.",
    "explanation": "To express hypothetical situations contrary to past fact (regrets and counterfactuals), use Si + plus-que-parfait in the dependent clause and conditionnel passé in the main clause (e.g., Si j’avais su, je serais venu).",
    "usage_conditions": [],
    "trigger_words": [],
    "signal_words": [],
    "exceptions": [],
    "restrictions": [],
    "notes": [],
    "common_mistakes": [],
    "contrast_with_rule_ids": [],
    "related_rule_ids": [],
    "prerequisite_rule_ids": [],
    "example_ids": [],
    "exercise_ids": [],
    "study": {
      "learning_priority": 4,
      "usefulness": 4,
      "difficulty": 2
    },
    "attestations": [
      {
        "source_type": "book",
        "chapter_number": 11,
        "page_printed": 98,
        "context_type": "grammar_explanation"
      }
    ],
    "tags": [
      "source_reconciled_rule"
    ]
  },
  {
    "id": "rule_subjunctive_triggers_emotion_feeling",
    "type": "grammar_rule",
    "title": "Subjunctive triggers: emotion and feeling",
    "grammar_category": "mood",
    "concept_ids": [],
    "tense_ids": [
      "tense_subjonctif_present"
    ],
    "summary": "Verbs of emotion and feeling require the subjunctive with two distinct subjects.",
    "explanation": "Verbs and impersonal expressions of emotion (être heureux que, regretter que, avoir peur que, être triste que) require the subjunctive in the dependent clause when the subject of the main clause differs from that of the dependent clause.",
    "usage_conditions": [],
    "trigger_words": [],
    "signal_words": [],
    "exceptions": [],
    "restrictions": [],
    "notes": [],
    "common_mistakes": [],
    "contrast_with_rule_ids": [],
    "related_rule_ids": [],
    "prerequisite_rule_ids": [],
    "example_ids": [],
    "exercise_ids": [],
    "study": {
      "learning_priority": 4,
      "usefulness": 4,
      "difficulty": 2
    },
    "attestations": [
      {
        "source_type": "book",
        "chapter_number": 13,
        "page_printed": 104,
        "context_type": "grammar_explanation"
      }
    ],
    "tags": [
      "source_reconciled_rule"
    ]
  },
  {
    "id": "rule_subjunctive_triggers_doubt_denial",
    "type": "grammar_rule",
    "title": "Subjunctive triggers: doubt, uncertainty, and denial",
    "grammar_category": "mood",
    "concept_ids": [],
    "tense_ids": [
      "tense_subjonctif_present"
    ],
    "summary": "Verbs of doubt and denial govern the subjunctive.",
    "explanation": "Verbs expressing doubt, uncertainty, or denial (douter que, ne pas croire que, ne pas penser que, nier que) require the subjunctive mood in the subordinate clause because the reality of the action is unconfirmed.",
    "usage_conditions": [],
    "trigger_words": [],
    "signal_words": [],
    "exceptions": [],
    "restrictions": [],
    "notes": [],
    "common_mistakes": [],
    "contrast_with_rule_ids": [],
    "related_rule_ids": [],
    "prerequisite_rule_ids": [],
    "example_ids": [],
    "exercise_ids": [],
    "study": {
      "learning_priority": 4,
      "usefulness": 4,
      "difficulty": 2
    },
    "attestations": [
      {
        "source_type": "book",
        "chapter_number": 13,
        "page_printed": 105,
        "context_type": "grammar_explanation"
      }
    ],
    "tags": [
      "source_reconciled_rule"
    ]
  },
  {
    "id": "rule_subjonctif_passe_formation_and_usage",
    "type": "grammar_rule",
    "title": "Formation and usage of the past subjunctive",
    "grammar_category": "mood",
    "concept_ids": [
      "concept_past_time"
    ],
    "tense_ids": [
      "tense_subjonctif_passe"
    ],
    "summary": "Past subjunctive is formed with subjunctive auxiliary + past participle.",
    "explanation": "The past subjunctive (subjonctif passé) is formed using the present subjunctive of avoir or être plus the past participle (e.g., que j’aie fini, que tu sois parti). It expresses a completed action prior to the main clause verb.",
    "usage_conditions": [],
    "trigger_words": [],
    "signal_words": [],
    "exceptions": [],
    "restrictions": [],
    "notes": [],
    "common_mistakes": [],
    "contrast_with_rule_ids": [],
    "related_rule_ids": [],
    "prerequisite_rule_ids": [],
    "example_ids": [],
    "exercise_ids": [],
    "study": {
      "learning_priority": 4,
      "usefulness": 4,
      "difficulty": 2
    },
    "attestations": [
      {
        "source_type": "book",
        "chapter_number": 13,
        "page_printed": 106,
        "context_type": "grammar_explanation"
      }
    ],
    "tags": [
      "source_reconciled_rule"
    ]
  },
  {
    "id": "rule_partitive_articles_du_de_la_des",
    "type": "grammar_rule",
    "title": "The partitive articles: du, de la, de l’, des",
    "grammar_category": "articles",
    "concept_ids": [],
    "tense_ids": [],
    "summary": "Partitive articles express unspecified quantities of uncountable items.",
    "explanation": "The partitive article expresses an indefinite quantity of an uncountable noun or mass noun: du (masculine singular), de la (feminine singular), de l' (before vowel/mute h), and des (plural). It translates as 'some' or 'any'.",
    "usage_conditions": [],
    "trigger_words": [],
    "signal_words": [],
    "exceptions": [],
    "restrictions": [],
    "notes": [],
    "common_mistakes": [],
    "contrast_with_rule_ids": [],
    "related_rule_ids": [],
    "prerequisite_rule_ids": [],
    "example_ids": [],
    "exercise_ids": [],
    "study": {
      "learning_priority": 4,
      "usefulness": 4,
      "difficulty": 2
    },
    "attestations": [
      {
        "source_type": "book",
        "chapter_number": 20,
        "page_printed": 154,
        "context_type": "grammar_explanation"
      }
    ],
    "tags": [
      "source_reconciled_rule"
    ]
  },
  {
    "id": "rule_partitive_in_negation_and_quantities",
    "type": "grammar_rule",
    "title": "Partitive reduction with negation and expressions of quantity",
    "grammar_category": "articles",
    "concept_ids": [
      "concept_negation"
    ],
    "tense_ids": [],
    "summary": "Partitive articles reduce to de/d’ in negative sentences and after quantity adverbs.",
    "explanation": "In negative sentences (with ne... pas, ne... plus, etc.) and after expressions of quantity (beaucoup de, un peu de, trop de, assez de), the partitive articles du, de la, des reduce to 'de' (or 'd'' before a vowel).",
    "usage_conditions": [],
    "trigger_words": [],
    "signal_words": [],
    "exceptions": [],
    "restrictions": [],
    "notes": [],
    "common_mistakes": [],
    "contrast_with_rule_ids": [],
    "related_rule_ids": [],
    "prerequisite_rule_ids": [],
    "example_ids": [],
    "exercise_ids": [],
    "study": {
      "learning_priority": 4,
      "usefulness": 4,
      "difficulty": 2
    },
    "attestations": [
      {
        "source_type": "book",
        "chapter_number": 20,
        "page_printed": 154,
        "context_type": "grammar_explanation"
      }
    ],
    "tags": [
      "source_reconciled_rule"
    ]
  },
  {
    "id": "rule_noun_gender_endings_rules",
    "type": "grammar_rule",
    "title": "Rules for determining noun gender by noun endings",
    "grammar_category": "nouns",
    "concept_ids": [
      "concept_adjective_agreement"
    ],
    "tense_ids": [],
    "summary": "Noun suffixes strongly predict masculine and feminine grammatical gender.",
    "explanation": "Noun suffixes serve as reliable indicators of gender: endings such as -tion, -sion, -té, -ure, -ence, -ance, -ette tend to be feminine; endings such as -ment, -eau, -isme, -al, -oir tend to be masculine.",
    "usage_conditions": [],
    "trigger_words": [],
    "signal_words": [],
    "exceptions": [],
    "restrictions": [],
    "notes": [],
    "common_mistakes": [],
    "contrast_with_rule_ids": [],
    "related_rule_ids": [],
    "prerequisite_rule_ids": [],
    "example_ids": [],
    "exercise_ids": [],
    "study": {
      "learning_priority": 4,
      "usefulness": 4,
      "difficulty": 2
    },
    "attestations": [
      {
        "source_type": "book",
        "chapter_number": 20,
        "page_printed": 156,
        "context_type": "grammar_explanation"
      }
    ],
    "tags": [
      "source_reconciled_rule"
    ]
  },
  {
    "id": "rule_noun_plural_formation_and_irregular_endings",
    "type": "grammar_rule",
    "title": "Formation of plural nouns and irregular endings",
    "grammar_category": "nouns",
    "concept_ids": [],
    "tense_ids": [],
    "summary": "Nouns form plurals with -s, with irregular patterns in -al -> -aux and -eau -> -eaux.",
    "explanation": "Most French nouns form the plural by adding -s. Nouns ending in -s, -x, or -z do not change. Nouns ending in -eau and -eu take -x (châteaux), and most nouns in -al change to -aux (journal -> journaux).",
    "usage_conditions": [],
    "trigger_words": [],
    "signal_words": [],
    "exceptions": [],
    "restrictions": [],
    "notes": [],
    "common_mistakes": [],
    "contrast_with_rule_ids": [],
    "related_rule_ids": [],
    "prerequisite_rule_ids": [],
    "example_ids": [],
    "exercise_ids": [],
    "study": {
      "learning_priority": 4,
      "usefulness": 4,
      "difficulty": 2
    },
    "attestations": [
      {
        "source_type": "book",
        "chapter_number": 20,
        "page_printed": 158,
        "context_type": "grammar_explanation"
      }
    ],
    "tags": [
      "source_reconciled_rule"
    ]
  },
  {
    "id": "rule_adverbial_pronouns_y_and_en",
    "type": "grammar_rule",
    "title": "Adverbial pronouns y and en",
    "grammar_category": "pronouns",
    "concept_ids": [
      "concept_object_pronouns"
    ],
    "tense_ids": [],
    "summary": "Y replaces phrases with à/places; en replaces phrases with de/quantities.",
    "explanation": "The adverbial pronoun 'y' replaces phrases introduced by à, en, dans, sur (places or inanimate objects). The pronoun 'en' replaces phrases introduced by de, partitive constructions, and indefinite quantities.",
    "usage_conditions": [],
    "trigger_words": [],
    "signal_words": [],
    "exceptions": [],
    "restrictions": [],
    "notes": [],
    "common_mistakes": [],
    "contrast_with_rule_ids": [],
    "related_rule_ids": [],
    "prerequisite_rule_ids": [],
    "example_ids": [],
    "exercise_ids": [],
    "study": {
      "learning_priority": 4,
      "usefulness": 4,
      "difficulty": 2
    },
    "attestations": [
      {
        "source_type": "book",
        "chapter_number": 21,
        "page_printed": 173,
        "context_type": "grammar_explanation"
      }
    ],
    "tags": [
      "source_reconciled_rule"
    ]
  },
  {
    "id": "rule_disjunctive_pronouns_moi_toi_lui",
    "type": "grammar_rule",
    "title": "Disjunctive (stress) pronouns: moi, toi, lui, elle, nous, vous, eux, elles",
    "grammar_category": "pronouns",
    "concept_ids": [
      "concept_object_pronouns"
    ],
    "tense_ids": [],
    "summary": "Disjunctive pronouns are used after prepositions, after c’est, and for emphasis.",
    "explanation": "Disjunctive (stress) pronouns (moi, toi, lui, elle, nous, vous, eux, elles) are used after prepositions (avec moi, sans lui), after c’est (c’est moi), in comparisons (plus grand que lui), and for emphatic subject contrast.",
    "usage_conditions": [],
    "trigger_words": [],
    "signal_words": [],
    "exceptions": [],
    "restrictions": [],
    "notes": [],
    "common_mistakes": [],
    "contrast_with_rule_ids": [],
    "related_rule_ids": [],
    "prerequisite_rule_ids": [],
    "example_ids": [],
    "exercise_ids": [],
    "study": {
      "learning_priority": 4,
      "usefulness": 4,
      "difficulty": 2
    },
    "attestations": [
      {
        "source_type": "book",
        "chapter_number": 21,
        "page_printed": 175,
        "context_type": "grammar_explanation"
      }
    ],
    "tags": [
      "source_reconciled_rule"
    ]
  },
  {
    "id": "rule_comparative_plus_moins_aussi",
    "type": "grammar_rule",
    "title": "Comparative formation: plus... que, moins... que, aussi... que",
    "grammar_category": "adjectives",
    "concept_ids": [
      "concept_adjective_agreement"
    ],
    "tense_ids": [],
    "summary": "Comparatives use plus/moins/aussi + adjective/adverb + que.",
    "explanation": "Comparisons of adjectives and adverbs are formed using: plus... que (more... than), moins... que (less... than), and aussi... que (as... as). Adjectives agree in gender and number with the subject being compared.",
    "usage_conditions": [],
    "trigger_words": [],
    "signal_words": [],
    "exceptions": [],
    "restrictions": [],
    "notes": [],
    "common_mistakes": [],
    "contrast_with_rule_ids": [],
    "related_rule_ids": [],
    "prerequisite_rule_ids": [],
    "example_ids": [],
    "exercise_ids": [],
    "study": {
      "learning_priority": 4,
      "usefulness": 4,
      "difficulty": 2
    },
    "attestations": [
      {
        "source_type": "book",
        "chapter_number": 22,
        "page_printed": 187,
        "context_type": "grammar_explanation"
      }
    ],
    "tags": [
      "source_reconciled_rule"
    ]
  },
  {
    "id": "rule_irregular_comparatives_meilleur_mieux",
    "type": "grammar_rule",
    "title": "Irregular comparatives and superlatives: meilleur and mieux",
    "grammar_category": "adjectives",
    "concept_ids": [],
    "tense_ids": [],
    "summary": "Bon becomes meilleur; bien becomes mieux.",
    "explanation": "The adjective 'bon' has the irregular comparative 'meilleur' (better) and superlative 'le meilleur' (best). The adverb 'bien' has the irregular comparative 'mieux' (better) and superlative 'le mieux' (best).",
    "usage_conditions": [],
    "trigger_words": [],
    "signal_words": [],
    "exceptions": [],
    "restrictions": [],
    "notes": [],
    "common_mistakes": [],
    "contrast_with_rule_ids": [],
    "related_rule_ids": [],
    "prerequisite_rule_ids": [],
    "example_ids": [],
    "exercise_ids": [],
    "study": {
      "learning_priority": 4,
      "usefulness": 4,
      "difficulty": 2
    },
    "attestations": [
      {
        "source_type": "book",
        "chapter_number": 22,
        "page_printed": 188,
        "context_type": "grammar_explanation"
      }
    ],
    "tags": [
      "source_reconciled_rule"
    ]
  },
  {
    "id": "rule_possessive_adjectives_rules",
    "type": "grammar_rule",
    "title": "Possessive adjectives: agreement and euphonic forms",
    "grammar_category": "adjectives",
    "concept_ids": [
      "concept_demonstratives_possessives",
      "concept_adjective_agreement"
    ],
    "tense_ids": [],
    "summary": "Possessive adjectives agree with possessed nouns; mon/ton/son precede vowels.",
    "explanation": "Possessive adjectives (mon, ma, mes; ton, ta, tes; son, sa, ses; notre, nos; votre, vos; leur, leurs) agree in gender and number with the noun possessed. Before feminine nouns beginning with a vowel or mute h, use mon, ton, son.",
    "usage_conditions": [],
    "trigger_words": [],
    "signal_words": [],
    "exceptions": [],
    "restrictions": [],
    "notes": [],
    "common_mistakes": [],
    "contrast_with_rule_ids": [],
    "related_rule_ids": [],
    "prerequisite_rule_ids": [],
    "example_ids": [],
    "exercise_ids": [],
    "study": {
      "learning_priority": 4,
      "usefulness": 4,
      "difficulty": 2
    },
    "attestations": [
      {
        "source_type": "book",
        "chapter_number": 23,
        "page_printed": 195,
        "context_type": "grammar_explanation"
      }
    ],
    "tags": [
      "source_reconciled_rule"
    ]
  },
  {
    "id": "rule_possessive_pronouns_chart",
    "type": "grammar_rule",
    "title": "Possessive pronouns: le mien, le tien, le sien, le nôtre, le vôtre, le leur",
    "grammar_category": "pronouns",
    "concept_ids": [
      "concept_demonstratives_possessives"
    ],
    "tense_ids": [],
    "summary": "Possessive pronouns replace possessive adjective + noun and agree with antecedent.",
    "explanation": "Possessive pronouns replace a possessive adjective plus noun: le mien / la mienne / les miens / les miennes; le tien; le sien; le nôtre; le vôtre; le leur. They agree in gender and number with the replaced noun.",
    "usage_conditions": [],
    "trigger_words": [],
    "signal_words": [],
    "exceptions": [],
    "restrictions": [],
    "notes": [],
    "common_mistakes": [],
    "contrast_with_rule_ids": [],
    "related_rule_ids": [],
    "prerequisite_rule_ids": [],
    "example_ids": [],
    "exercise_ids": [],
    "study": {
      "learning_priority": 4,
      "usefulness": 4,
      "difficulty": 2
    },
    "attestations": [
      {
        "source_type": "book",
        "chapter_number": 23,
        "page_printed": 197,
        "context_type": "grammar_explanation"
      }
    ],
    "tags": [
      "source_reconciled_rule"
    ]
  },
  {
    "id": "rule_relative_pronoun_ou_and_lequel",
    "type": "grammar_rule",
    "title": "Relative pronouns où and lequel",
    "grammar_category": "pronouns",
    "concept_ids": [
      "concept_relative_pronouns"
    ],
    "tense_ids": [],
    "summary": "Où expresses place and time; lequel is used after prepositions other than de.",
    "explanation": "The relative pronoun 'où' denotes place ('where') and time ('when'). The compound relative pronoun 'lequel' (laquelle, lesquels, lesquelles) is used with prepositions other than de (e.g., sans lequel, pour laquelle).",
    "usage_conditions": [],
    "trigger_words": [],
    "signal_words": [],
    "exceptions": [],
    "restrictions": [],
    "notes": [],
    "common_mistakes": [],
    "contrast_with_rule_ids": [],
    "related_rule_ids": [],
    "prerequisite_rule_ids": [],
    "example_ids": [],
    "exercise_ids": [],
    "study": {
      "learning_priority": 4,
      "usefulness": 4,
      "difficulty": 2
    },
    "attestations": [
      {
        "source_type": "book",
        "chapter_number": 24,
        "page_printed": 206,
        "context_type": "grammar_explanation"
      }
    ],
    "tags": [
      "source_reconciled_rule"
    ]
  },
  {
    "id": "rule_indefinite_relative_pronouns_ce_qui_ce_que_ce_dont",
    "type": "grammar_rule",
    "title": "Indefinite relative pronouns: ce qui, ce que, ce dont, ce à quoi",
    "grammar_category": "pronouns",
    "concept_ids": [
      "concept_relative_pronouns"
    ],
    "tense_ids": [],
    "summary": "Indefinite relative pronouns refer to unspecified antecedents (what / that which).",
    "explanation": "Indefinite relative pronouns refer to general ideas without a specific nominal antecedent: ce qui (subject), ce que (direct object), ce dont (object of preposition de), and ce à quoi (object of preposition à).",
    "usage_conditions": [],
    "trigger_words": [],
    "signal_words": [],
    "exceptions": [],
    "restrictions": [],
    "notes": [],
    "common_mistakes": [],
    "contrast_with_rule_ids": [],
    "related_rule_ids": [],
    "prerequisite_rule_ids": [],
    "example_ids": [],
    "exercise_ids": [],
    "study": {
      "learning_priority": 4,
      "usefulness": 4,
      "difficulty": 2
    },
    "attestations": [
      {
        "source_type": "book",
        "chapter_number": 24,
        "page_printed": 209,
        "context_type": "grammar_explanation"
      }
    ],
    "tags": [
      "source_reconciled_rule"
    ]
  }
];

export const RECONCILED_VERBS: Verb[] = [
  {
    "id": "verb_parvenir",
    "type": "verb",
    "infinitive": "parvenir",
    "english": [
      "to reach",
      "to achieve",
      "to succeed in"
    ],
    "senses": [
      {
        "sense_id": "verb_parvenir_s01",
        "english": [
          "to reach"
        ],
        "usage_contexts": [], "example_ids": []
      }
    ],
    "conjugation_ids": [],
    "expression_ids": [],
    "related_verb_ids": [],
    "word_family_ids": [],
    "complement_frame_ids": [],
    "contrast_verb_ids": [],
    "confused_with_ids": [],
    "functional_roles": [],
    "past_participle": "parvenu",
    "present_participle": "parvenant",
    "auxiliary": "etre",
    "regularity": "irregular",
    "verb_group": "3rd_group",
    "pronominal": false,
    "transitivity": [
      "transitive"
    ],
    "study": {
      "learning_priority": 3,
      "usefulness": 3,
      "difficulty": 2
    },
    "usage": {
      "register": "neutral",
      "spoken_written": "both",
      "contexts": []
    },
    "attestations": [
      {
        "source_type": "book",
        "chapter_number": 4,
        "page_printed": 37,
        "context_type": "grammar_explanation"
      }
    ],
    "frequency": {
      "book_occurrences": 2
    },
    "tags": [
      "source_reconciled_verb"
    ]
  },
  {
    "id": "verb_convenir",
    "type": "verb",
    "infinitive": "convenir",
    "english": [
      "to agree",
      "to suit",
      "to acknowledge"
    ],
    "senses": [
      {
        "sense_id": "verb_convenir_s01",
        "english": [
          "to agree"
        ],
        "usage_contexts": [], "example_ids": []
      }
    ],
    "conjugation_ids": [],
    "expression_ids": [],
    "related_verb_ids": [],
    "word_family_ids": [],
    "complement_frame_ids": [],
    "contrast_verb_ids": [],
    "confused_with_ids": [],
    "functional_roles": [],
    "past_participle": "convenu",
    "present_participle": "convenant",
    "auxiliary": "avoir",
    "regularity": "irregular",
    "verb_group": "3rd_group",
    "pronominal": false,
    "transitivity": [
      "transitive"
    ],
    "study": {
      "learning_priority": 3,
      "usefulness": 3,
      "difficulty": 2
    },
    "usage": {
      "register": "neutral",
      "spoken_written": "both",
      "contexts": []
    },
    "attestations": [
      {
        "source_type": "book",
        "chapter_number": 4,
        "page_printed": 37,
        "context_type": "grammar_explanation"
      }
    ],
    "frequency": {
      "book_occurrences": 2
    },
    "tags": [
      "source_reconciled_verb"
    ]
  },
  {
    "id": "verb_ceindre",
    "type": "verb",
    "infinitive": "ceindre",
    "english": [
      "to encircle",
      "to gird",
      "to put on"
    ],
    "senses": [
      {
        "sense_id": "verb_ceindre_s01",
        "english": [
          "to encircle"
        ],
        "usage_contexts": [], "example_ids": []
      }
    ],
    "conjugation_ids": [],
    "expression_ids": [],
    "related_verb_ids": [],
    "word_family_ids": [],
    "complement_frame_ids": [],
    "contrast_verb_ids": [],
    "confused_with_ids": [],
    "functional_roles": [],
    "past_participle": "ceint",
    "present_participle": "ceignant",
    "auxiliary": "avoir",
    "regularity": "irregular",
    "verb_group": "3rd_group",
    "pronominal": false,
    "transitivity": [
      "transitive"
    ],
    "study": {
      "learning_priority": 3,
      "usefulness": 3,
      "difficulty": 2
    },
    "usage": {
      "register": "neutral",
      "spoken_written": "both",
      "contexts": []
    },
    "attestations": [
      {
        "source_type": "book",
        "chapter_number": 5,
        "page_printed": 48,
        "context_type": "grammar_explanation"
      }
    ],
    "frequency": {
      "book_occurrences": 2
    },
    "tags": [
      "source_reconciled_verb"
    ]
  },
  {
    "id": "verb_se_peigner",
    "type": "verb",
    "infinitive": "se peigner",
    "english": [
      "to comb one's hair"
    ],
    "senses": [
      {
        "sense_id": "verb_se_peigner_s01",
        "english": [
          "to comb one's hair"
        ],
        "usage_contexts": [], "example_ids": []
      }
    ],
    "conjugation_ids": [],
    "expression_ids": [],
    "related_verb_ids": [],
    "word_family_ids": [],
    "complement_frame_ids": [],
    "contrast_verb_ids": [],
    "confused_with_ids": [],
    "functional_roles": [],
    "past_participle": "peigné",
    "present_participle": "peignant",
    "auxiliary": "etre",
    "regularity": "regular",
    "verb_group": "1st_group",
    "pronominal": true,
    "transitivity": [
      "transitive"
    ],
    "study": {
      "learning_priority": 3,
      "usefulness": 3,
      "difficulty": 2
    },
    "usage": {
      "register": "neutral",
      "spoken_written": "both",
      "contexts": []
    },
    "attestations": [
      {
        "source_type": "book",
        "chapter_number": 6,
        "page_printed": 54,
        "context_type": "grammar_explanation"
      }
    ],
    "frequency": {
      "book_occurrences": 2
    },
    "tags": [
      "source_reconciled_verb"
    ]
  },
  {
    "id": "verb_se_couper",
    "type": "verb",
    "infinitive": "se couper",
    "english": [
      "to cut oneself"
    ],
    "senses": [
      {
        "sense_id": "verb_se_couper_s01",
        "english": [
          "to cut oneself"
        ],
        "usage_contexts": [], "example_ids": []
      }
    ],
    "conjugation_ids": [],
    "expression_ids": [],
    "related_verb_ids": [],
    "word_family_ids": [],
    "complement_frame_ids": [],
    "contrast_verb_ids": [],
    "confused_with_ids": [],
    "functional_roles": [],
    "past_participle": "coupé",
    "present_participle": "coupant",
    "auxiliary": "etre",
    "regularity": "regular",
    "verb_group": "1st_group",
    "pronominal": true,
    "transitivity": [
      "transitive"
    ],
    "study": {
      "learning_priority": 3,
      "usefulness": 3,
      "difficulty": 2
    },
    "usage": {
      "register": "neutral",
      "spoken_written": "both",
      "contexts": []
    },
    "attestations": [
      {
        "source_type": "book",
        "chapter_number": 6,
        "page_printed": 54,
        "context_type": "grammar_explanation"
      }
    ],
    "frequency": {
      "book_occurrences": 2
    },
    "tags": [
      "source_reconciled_verb"
    ]
  },
  {
    "id": "verb_se_parler",
    "type": "verb",
    "infinitive": "se parler",
    "english": [
      "to speak to each other"
    ],
    "senses": [
      {
        "sense_id": "verb_se_parler_s01",
        "english": [
          "to speak to each other"
        ],
        "usage_contexts": [], "example_ids": []
      }
    ],
    "conjugation_ids": [],
    "expression_ids": [],
    "related_verb_ids": [],
    "word_family_ids": [],
    "complement_frame_ids": [],
    "contrast_verb_ids": [],
    "confused_with_ids": [],
    "functional_roles": [],
    "past_participle": "parlé",
    "present_participle": "parlant",
    "auxiliary": "etre",
    "regularity": "regular",
    "verb_group": "1st_group",
    "pronominal": true,
    "transitivity": [
      "transitive"
    ],
    "study": {
      "learning_priority": 3,
      "usefulness": 3,
      "difficulty": 2
    },
    "usage": {
      "register": "neutral",
      "spoken_written": "both",
      "contexts": []
    },
    "attestations": [
      {
        "source_type": "book",
        "chapter_number": 6,
        "page_printed": 55,
        "context_type": "grammar_explanation"
      }
    ],
    "frequency": {
      "book_occurrences": 2
    },
    "tags": [
      "source_reconciled_verb"
    ]
  },
  {
    "id": "verb_s_aimer",
    "type": "verb",
    "infinitive": "s'aimer",
    "english": [
      "to love each other",
      "to love oneself"
    ],
    "senses": [
      {
        "sense_id": "verb_s_aimer_s01",
        "english": [
          "to love each other"
        ],
        "usage_contexts": [], "example_ids": []
      }
    ],
    "conjugation_ids": [],
    "expression_ids": [],
    "related_verb_ids": [],
    "word_family_ids": [],
    "complement_frame_ids": [],
    "contrast_verb_ids": [],
    "confused_with_ids": [],
    "functional_roles": [],
    "past_participle": "aimé",
    "present_participle": "aimant",
    "auxiliary": "etre",
    "regularity": "regular",
    "verb_group": "1st_group",
    "pronominal": true,
    "transitivity": [
      "transitive"
    ],
    "study": {
      "learning_priority": 3,
      "usefulness": 3,
      "difficulty": 2
    },
    "usage": {
      "register": "neutral",
      "spoken_written": "both",
      "contexts": []
    },
    "attestations": [
      {
        "source_type": "book",
        "chapter_number": 6,
        "page_printed": 55,
        "context_type": "grammar_explanation"
      }
    ],
    "frequency": {
      "book_occurrences": 2
    },
    "tags": [
      "source_reconciled_verb"
    ]
  },
  {
    "id": "verb_se_telephoner",
    "type": "verb",
    "infinitive": "se téléphoner",
    "english": [
      "to call each other",
      "to phone each other"
    ],
    "senses": [
      {
        "sense_id": "verb_se_telephoner_s01",
        "english": [
          "to call each other"
        ],
        "usage_contexts": [], "example_ids": []
      }
    ],
    "conjugation_ids": [],
    "expression_ids": [],
    "related_verb_ids": [],
    "word_family_ids": [],
    "complement_frame_ids": [],
    "contrast_verb_ids": [],
    "confused_with_ids": [],
    "functional_roles": [],
    "past_participle": "téléphoné",
    "present_participle": "téléphonant",
    "auxiliary": "etre",
    "regularity": "regular",
    "verb_group": "1st_group",
    "pronominal": true,
    "transitivity": [
      "transitive"
    ],
    "study": {
      "learning_priority": 3,
      "usefulness": 3,
      "difficulty": 2
    },
    "usage": {
      "register": "neutral",
      "spoken_written": "both",
      "contexts": []
    },
    "attestations": [
      {
        "source_type": "book",
        "chapter_number": 6,
        "page_printed": 55,
        "context_type": "grammar_explanation"
      }
    ],
    "frequency": {
      "book_occurrences": 2
    },
    "tags": [
      "source_reconciled_verb"
    ]
  },
  {
    "id": "verb_s_ecrire",
    "type": "verb",
    "infinitive": "s'écrire",
    "english": [
      "to write to each other",
      "to be written"
    ],
    "senses": [
      {
        "sense_id": "verb_s_ecrire_s01",
        "english": [
          "to write to each other"
        ],
        "usage_contexts": [], "example_ids": []
      }
    ],
    "conjugation_ids": [],
    "expression_ids": [],
    "related_verb_ids": [],
    "word_family_ids": [],
    "complement_frame_ids": [],
    "contrast_verb_ids": [],
    "confused_with_ids": [],
    "functional_roles": [],
    "past_participle": "écrit",
    "present_participle": "écrivant",
    "auxiliary": "etre",
    "regularity": "irregular",
    "verb_group": "3rd_group",
    "pronominal": true,
    "transitivity": [
      "transitive"
    ],
    "study": {
      "learning_priority": 3,
      "usefulness": 3,
      "difficulty": 2
    },
    "usage": {
      "register": "neutral",
      "spoken_written": "both",
      "contexts": []
    },
    "attestations": [
      {
        "source_type": "book",
        "chapter_number": 6,
        "page_printed": 55,
        "context_type": "grammar_explanation"
      }
    ],
    "frequency": {
      "book_occurrences": 2
    },
    "tags": [
      "source_reconciled_verb"
    ]
  },
  {
    "id": "verb_se_rencontrer",
    "type": "verb",
    "infinitive": "se rencontrer",
    "english": [
      "to meet each other"
    ],
    "senses": [
      {
        "sense_id": "verb_se_rencontrer_s01",
        "english": [
          "to meet each other"
        ],
        "usage_contexts": [], "example_ids": []
      }
    ],
    "conjugation_ids": [],
    "expression_ids": [],
    "related_verb_ids": [],
    "word_family_ids": [],
    "complement_frame_ids": [],
    "contrast_verb_ids": [],
    "confused_with_ids": [],
    "functional_roles": [],
    "past_participle": "rencontré",
    "present_participle": "rencontrant",
    "auxiliary": "etre",
    "regularity": "regular",
    "verb_group": "1st_group",
    "pronominal": true,
    "transitivity": [
      "transitive"
    ],
    "study": {
      "learning_priority": 3,
      "usefulness": 3,
      "difficulty": 2
    },
    "usage": {
      "register": "neutral",
      "spoken_written": "both",
      "contexts": []
    },
    "attestations": [
      {
        "source_type": "book",
        "chapter_number": 6,
        "page_printed": 55,
        "context_type": "grammar_explanation"
      }
    ],
    "frequency": {
      "book_occurrences": 2
    },
    "tags": [
      "source_reconciled_verb"
    ]
  },
  {
    "id": "verb_s_embrasser",
    "type": "verb",
    "infinitive": "s'embrasser",
    "english": [
      "to kiss each other",
      "to embrace"
    ],
    "senses": [
      {
        "sense_id": "verb_s_embrasser_s01",
        "english": [
          "to kiss each other"
        ],
        "usage_contexts": [], "example_ids": []
      }
    ],
    "conjugation_ids": [],
    "expression_ids": [],
    "related_verb_ids": [],
    "word_family_ids": [],
    "complement_frame_ids": [],
    "contrast_verb_ids": [],
    "confused_with_ids": [],
    "functional_roles": [],
    "past_participle": "embrassé",
    "present_participle": "embrassant",
    "auxiliary": "etre",
    "regularity": "regular",
    "verb_group": "1st_group",
    "pronominal": true,
    "transitivity": [
      "transitive"
    ],
    "study": {
      "learning_priority": 3,
      "usefulness": 3,
      "difficulty": 2
    },
    "usage": {
      "register": "neutral",
      "spoken_written": "both",
      "contexts": []
    },
    "attestations": [
      {
        "source_type": "book",
        "chapter_number": 6,
        "page_printed": 55,
        "context_type": "grammar_explanation"
      }
    ],
    "frequency": {
      "book_occurrences": 2
    },
    "tags": [
      "source_reconciled_verb"
    ]
  },
  {
    "id": "verb_s_en_aller",
    "type": "verb",
    "infinitive": "s'en aller",
    "english": [
      "to go away",
      "to leave"
    ],
    "senses": [
      {
        "sense_id": "verb_s_en_aller_s01",
        "english": [
          "to go away"
        ],
        "usage_contexts": [], "example_ids": []
      }
    ],
    "conjugation_ids": [],
    "expression_ids": [],
    "related_verb_ids": [],
    "word_family_ids": [],
    "complement_frame_ids": [],
    "contrast_verb_ids": [],
    "confused_with_ids": [],
    "functional_roles": [],
    "past_participle": "allé",
    "present_participle": "allant",
    "auxiliary": "etre",
    "regularity": "irregular",
    "verb_group": "3rd_group",
    "pronominal": true,
    "transitivity": [
      "transitive"
    ],
    "study": {
      "learning_priority": 3,
      "usefulness": 3,
      "difficulty": 2
    },
    "usage": {
      "register": "neutral",
      "spoken_written": "both",
      "contexts": []
    },
    "attestations": [
      {
        "source_type": "book",
        "chapter_number": 6,
        "page_printed": 56,
        "context_type": "grammar_explanation"
      }
    ],
    "frequency": {
      "book_occurrences": 2
    },
    "tags": [
      "source_reconciled_verb"
    ]
  },
  {
    "id": "verb_s_attendre_a",
    "type": "verb",
    "infinitive": "s'attendre à",
    "english": [
      "to expect"
    ],
    "senses": [
      {
        "sense_id": "verb_s_attendre_a_s01",
        "english": [
          "to expect"
        ],
        "usage_contexts": [], "example_ids": []
      }
    ],
    "conjugation_ids": [],
    "expression_ids": [],
    "related_verb_ids": [],
    "word_family_ids": [],
    "complement_frame_ids": [],
    "contrast_verb_ids": [],
    "confused_with_ids": [],
    "functional_roles": [],
    "past_participle": "attendu",
    "present_participle": "attendant",
    "auxiliary": "etre",
    "regularity": "regular",
    "verb_group": "3rd_group",
    "pronominal": true,
    "transitivity": [
      "transitive"
    ],
    "study": {
      "learning_priority": 3,
      "usefulness": 3,
      "difficulty": 2
    },
    "usage": {
      "register": "neutral",
      "spoken_written": "both",
      "contexts": []
    },
    "attestations": [
      {
        "source_type": "book",
        "chapter_number": 6,
        "page_printed": 56,
        "context_type": "grammar_explanation"
      }
    ],
    "frequency": {
      "book_occurrences": 2
    },
    "tags": [
      "source_reconciled_verb"
    ]
  },
  {
    "id": "verb_se_passer",
    "type": "verb",
    "infinitive": "se passer",
    "english": [
      "to happen",
      "to take place"
    ],
    "senses": [
      {
        "sense_id": "verb_se_passer_s01",
        "english": [
          "to happen"
        ],
        "usage_contexts": [], "example_ids": []
      }
    ],
    "conjugation_ids": [],
    "expression_ids": [],
    "related_verb_ids": [],
    "word_family_ids": [],
    "complement_frame_ids": [],
    "contrast_verb_ids": [],
    "confused_with_ids": [],
    "functional_roles": [],
    "past_participle": "passé",
    "present_participle": "passant",
    "auxiliary": "etre",
    "regularity": "regular",
    "verb_group": "1st_group",
    "pronominal": true,
    "transitivity": [
      "transitive"
    ],
    "study": {
      "learning_priority": 3,
      "usefulness": 3,
      "difficulty": 2
    },
    "usage": {
      "register": "neutral",
      "spoken_written": "both",
      "contexts": []
    },
    "attestations": [
      {
        "source_type": "book",
        "chapter_number": 6,
        "page_printed": 56,
        "context_type": "grammar_explanation"
      }
    ],
    "frequency": {
      "book_occurrences": 2
    },
    "tags": [
      "source_reconciled_verb"
    ]
  },
  {
    "id": "verb_retourner",
    "type": "verb",
    "infinitive": "retourner",
    "english": [
      "to return",
      "to go back"
    ],
    "senses": [
      {
        "sense_id": "verb_retourner_s01",
        "english": [
          "to return"
        ],
        "usage_contexts": [], "example_ids": []
      }
    ],
    "conjugation_ids": [],
    "expression_ids": [],
    "related_verb_ids": [],
    "word_family_ids": [],
    "complement_frame_ids": [],
    "contrast_verb_ids": [],
    "confused_with_ids": [],
    "functional_roles": [],
    "past_participle": "retourné",
    "present_participle": "retournant",
    "auxiliary": "etre",
    "regularity": "regular",
    "verb_group": "1st_group",
    "pronominal": false,
    "transitivity": [
      "transitive"
    ],
    "study": {
      "learning_priority": 3,
      "usefulness": 3,
      "difficulty": 2
    },
    "usage": {
      "register": "neutral",
      "spoken_written": "both",
      "contexts": []
    },
    "attestations": [
      {
        "source_type": "book",
        "chapter_number": 7,
        "page_printed": 64,
        "context_type": "grammar_explanation"
      }
    ],
    "frequency": {
      "book_occurrences": 2
    },
    "tags": [
      "source_reconciled_verb"
    ]
  },
  {
    "id": "verb_passer",
    "type": "verb",
    "infinitive": "passer",
    "english": [
      "to pass",
      "to spend time"
    ],
    "senses": [
      {
        "sense_id": "verb_passer_s01",
        "english": [
          "to pass"
        ],
        "usage_contexts": [], "example_ids": []
      }
    ],
    "conjugation_ids": [],
    "expression_ids": [],
    "related_verb_ids": [],
    "word_family_ids": [],
    "complement_frame_ids": [],
    "contrast_verb_ids": [],
    "confused_with_ids": [],
    "functional_roles": [],
    "past_participle": "passé",
    "present_participle": "passant",
    "auxiliary": "avoir",
    "regularity": "regular",
    "verb_group": "1st_group",
    "pronominal": false,
    "transitivity": [
      "transitive"
    ],
    "study": {
      "learning_priority": 3,
      "usefulness": 3,
      "difficulty": 2
    },
    "usage": {
      "register": "neutral",
      "spoken_written": "both",
      "contexts": []
    },
    "attestations": [
      {
        "source_type": "book",
        "chapter_number": 7,
        "page_printed": 65,
        "context_type": "grammar_explanation"
      }
    ],
    "frequency": {
      "book_occurrences": 2
    },
    "tags": [
      "source_reconciled_verb"
    ]
  },
  {
    "id": "verb_decider",
    "type": "verb",
    "infinitive": "décider",
    "english": [
      "to decide"
    ],
    "senses": [
      {
        "sense_id": "verb_decider_s01",
        "english": [
          "to decide"
        ],
        "usage_contexts": [], "example_ids": []
      }
    ],
    "conjugation_ids": [],
    "expression_ids": [],
    "related_verb_ids": [],
    "word_family_ids": [],
    "complement_frame_ids": [],
    "contrast_verb_ids": [],
    "confused_with_ids": [],
    "functional_roles": [],
    "past_participle": "décidé",
    "present_participle": "décidant",
    "auxiliary": "avoir",
    "regularity": "regular",
    "verb_group": "1st_group",
    "pronominal": false,
    "transitivity": [
      "transitive"
    ],
    "study": {
      "learning_priority": 3,
      "usefulness": 3,
      "difficulty": 2
    },
    "usage": {
      "register": "neutral",
      "spoken_written": "both",
      "contexts": []
    },
    "attestations": [
      {
        "source_type": "book",
        "chapter_number": 14,
        "page_printed": 112,
        "context_type": "grammar_explanation"
      }
    ],
    "frequency": {
      "book_occurrences": 2
    },
    "tags": [
      "source_reconciled_verb"
    ]
  },
  {
    "id": "verb_essayer",
    "type": "verb",
    "infinitive": "essayer",
    "english": [
      "to try"
    ],
    "senses": [
      {
        "sense_id": "verb_essayer_s01",
        "english": [
          "to try"
        ],
        "usage_contexts": [], "example_ids": []
      }
    ],
    "conjugation_ids": [],
    "expression_ids": [],
    "related_verb_ids": [],
    "word_family_ids": [],
    "complement_frame_ids": [],
    "contrast_verb_ids": [],
    "confused_with_ids": [],
    "functional_roles": [],
    "past_participle": "essayé",
    "present_participle": "essayant",
    "auxiliary": "avoir",
    "regularity": "regular",
    "verb_group": "1st_group",
    "pronominal": false,
    "transitivity": [
      "transitive"
    ],
    "study": {
      "learning_priority": 3,
      "usefulness": 3,
      "difficulty": 2
    },
    "usage": {
      "register": "neutral",
      "spoken_written": "both",
      "contexts": []
    },
    "attestations": [
      {
        "source_type": "book",
        "chapter_number": 14,
        "page_printed": 112,
        "context_type": "grammar_explanation"
      }
    ],
    "frequency": {
      "book_occurrences": 2
    },
    "tags": [
      "source_reconciled_verb"
    ]
  },
  {
    "id": "verb_se_taire",
    "type": "verb",
    "infinitive": "se taire",
    "english": [
      "to be quiet",
      "to keep silent"
    ],
    "senses": [
      {
        "sense_id": "verb_se_taire_s01",
        "english": [
          "to be quiet"
        ],
        "usage_contexts": [], "example_ids": []
      }
    ],
    "conjugation_ids": [],
    "expression_ids": [],
    "related_verb_ids": [],
    "word_family_ids": [],
    "complement_frame_ids": [],
    "contrast_verb_ids": [],
    "confused_with_ids": [],
    "functional_roles": [],
    "past_participle": "tu",
    "present_participle": "taisant",
    "auxiliary": "etre",
    "regularity": "irregular",
    "verb_group": "3rd_group",
    "pronominal": true,
    "transitivity": [
      "transitive"
    ],
    "study": {
      "learning_priority": 3,
      "usefulness": 3,
      "difficulty": 2
    },
    "usage": {
      "register": "neutral",
      "spoken_written": "both",
      "contexts": []
    },
    "attestations": [
      {
        "source_type": "book",
        "chapter_number": 19,
        "page_printed": 148,
        "context_type": "grammar_explanation"
      }
    ],
    "frequency": {
      "book_occurrences": 2
    },
    "tags": [
      "source_reconciled_verb"
    ]
  },
  {
    "id": "verb_manquer",
    "type": "verb",
    "infinitive": "manquer",
    "english": [
      "to miss",
      "to lack"
    ],
    "senses": [
      {
        "sense_id": "verb_manquer_s01",
        "english": [
          "to miss"
        ],
        "usage_contexts": [], "example_ids": []
      }
    ],
    "conjugation_ids": [],
    "expression_ids": [],
    "related_verb_ids": [],
    "word_family_ids": [],
    "complement_frame_ids": [],
    "contrast_verb_ids": [],
    "confused_with_ids": [],
    "functional_roles": [],
    "past_participle": "manqué",
    "present_participle": "manquant",
    "auxiliary": "avoir",
    "regularity": "regular",
    "verb_group": "1st_group",
    "pronominal": false,
    "transitivity": [
      "transitive"
    ],
    "study": {
      "learning_priority": 3,
      "usefulness": 3,
      "difficulty": 2
    },
    "usage": {
      "register": "neutral",
      "spoken_written": "both",
      "contexts": []
    },
    "attestations": [
      {
        "source_type": "book",
        "chapter_number": 27,
        "page_printed": 232,
        "context_type": "grammar_explanation"
      }
    ],
    "frequency": {
      "book_occurrences": 2
    },
    "tags": [
      "source_reconciled_verb"
    ]
  },
  {
    "id": "verb_saluer",
    "type": "verb",
    "infinitive": "saluer",
    "english": [
      "to greet",
      "to bow to"
    ],
    "senses": [
      {
        "sense_id": "verb_saluer_s01",
        "english": [
          "to greet"
        ],
        "usage_contexts": [], "example_ids": []
      }
    ],
    "conjugation_ids": [],
    "expression_ids": [],
    "related_verb_ids": [],
    "word_family_ids": [],
    "complement_frame_ids": [],
    "contrast_verb_ids": [],
    "confused_with_ids": [],
    "functional_roles": [],
    "past_participle": "salué",
    "present_participle": "saluant",
    "auxiliary": "avoir",
    "regularity": "regular",
    "verb_group": "1st_group",
    "pronominal": false,
    "transitivity": [
      "transitive"
    ],
    "study": {
      "learning_priority": 3,
      "usefulness": 3,
      "difficulty": 2
    },
    "usage": {
      "register": "neutral",
      "spoken_written": "both",
      "contexts": []
    },
    "attestations": [
      {
        "source_type": "book",
        "chapter_number": 16,
        "page_printed": 126,
        "context_type": "grammar_explanation"
      }
    ],
    "frequency": {
      "book_occurrences": 2
    },
    "tags": [
      "source_reconciled_verb"
    ]
  },
  {
    "id": "verb_inaugurer",
    "type": "verb",
    "infinitive": "inaugurer",
    "english": [
      "to inaugurate"
    ],
    "senses": [
      {
        "sense_id": "verb_inaugurer_s01",
        "english": [
          "to inaugurate"
        ],
        "usage_contexts": [], "example_ids": []
      }
    ],
    "conjugation_ids": [],
    "expression_ids": [],
    "related_verb_ids": [],
    "word_family_ids": [],
    "complement_frame_ids": [],
    "contrast_verb_ids": [],
    "confused_with_ids": [],
    "functional_roles": [],
    "past_participle": "inauguré",
    "present_participle": "inaugurant",
    "auxiliary": "avoir",
    "regularity": "regular",
    "verb_group": "1st_group",
    "pronominal": false,
    "transitivity": [
      "transitive"
    ],
    "study": {
      "learning_priority": 3,
      "usefulness": 3,
      "difficulty": 2
    },
    "usage": {
      "register": "neutral",
      "spoken_written": "both",
      "contexts": []
    },
    "attestations": [
      {
        "source_type": "book",
        "chapter_number": 17,
        "page_printed": 132,
        "context_type": "grammar_explanation"
      }
    ],
    "frequency": {
      "book_occurrences": 2
    },
    "tags": [
      "source_reconciled_verb"
    ]
  },
  {
    "id": "verb_s_inquieter",
    "type": "verb",
    "infinitive": "s'inquiéter",
    "english": [
      "to worry"
    ],
    "senses": [
      {
        "sense_id": "verb_s_inquieter_s01",
        "english": [
          "to worry"
        ],
        "usage_contexts": [], "example_ids": []
      }
    ],
    "conjugation_ids": [],
    "expression_ids": [],
    "related_verb_ids": [],
    "word_family_ids": [],
    "complement_frame_ids": [],
    "contrast_verb_ids": [],
    "confused_with_ids": [],
    "functional_roles": [],
    "past_participle": "inquiété",
    "present_participle": "inquiétant",
    "auxiliary": "etre",
    "regularity": "regular",
    "verb_group": "1st_group",
    "pronominal": true,
    "transitivity": [
      "transitive"
    ],
    "study": {
      "learning_priority": 3,
      "usefulness": 3,
      "difficulty": 2
    },
    "usage": {
      "register": "neutral",
      "spoken_written": "both",
      "contexts": []
    },
    "attestations": [
      {
        "source_type": "book",
        "chapter_number": 19,
        "page_printed": 149,
        "context_type": "grammar_explanation"
      }
    ],
    "frequency": {
      "book_occurrences": 2
    },
    "tags": [
      "source_reconciled_verb"
    ]
  },
  {
    "id": "verb_apporter",
    "type": "verb",
    "infinitive": "apporter",
    "english": [
      "to bring"
    ],
    "senses": [
      {
        "sense_id": "verb_apporter_s01",
        "english": [
          "to bring"
        ],
        "usage_contexts": [], "example_ids": []
      }
    ],
    "conjugation_ids": [],
    "expression_ids": [],
    "related_verb_ids": [],
    "word_family_ids": [],
    "complement_frame_ids": [],
    "contrast_verb_ids": [],
    "confused_with_ids": [],
    "functional_roles": [],
    "past_participle": "apporté",
    "present_participle": "apportant",
    "auxiliary": "avoir",
    "regularity": "regular",
    "verb_group": "1st_group",
    "pronominal": false,
    "transitivity": [
      "transitive"
    ],
    "study": {
      "learning_priority": 3,
      "usefulness": 3,
      "difficulty": 2
    },
    "usage": {
      "register": "neutral",
      "spoken_written": "both",
      "contexts": []
    },
    "attestations": [
      {
        "source_type": "book",
        "chapter_number": 1,
        "page_printed": 5,
        "context_type": "grammar_explanation"
      }
    ],
    "frequency": {
      "book_occurrences": 2
    },
    "tags": [
      "source_reconciled_verb"
    ]
  },
  {
    "id": "verb_exercer",
    "type": "verb",
    "infinitive": "exercer",
    "english": [
      "to exercise",
      "to exert",
      "to practice"
    ],
    "senses": [
      {
        "sense_id": "verb_exercer_s01",
        "english": [
          "to exercise"
        ],
        "usage_contexts": [], "example_ids": []
      }
    ],
    "conjugation_ids": [],
    "expression_ids": [],
    "related_verb_ids": [],
    "word_family_ids": [],
    "complement_frame_ids": [],
    "contrast_verb_ids": [],
    "confused_with_ids": [],
    "functional_roles": [],
    "past_participle": "exercé",
    "present_participle": "exerçant",
    "auxiliary": "avoir",
    "regularity": "regular",
    "verb_group": "1st_group",
    "pronominal": false,
    "transitivity": [
      "transitive"
    ],
    "study": {
      "learning_priority": 3,
      "usefulness": 3,
      "difficulty": 2
    },
    "usage": {
      "register": "neutral",
      "spoken_written": "both",
      "contexts": []
    },
    "attestations": [
      {
        "source_type": "book",
        "chapter_number": 1,
        "page_printed": 6,
        "context_type": "grammar_explanation"
      }
    ],
    "frequency": {
      "book_occurrences": 2
    },
    "tags": [
      "source_reconciled_verb"
    ]
  },
  {
    "id": "verb_s_appeler",
    "type": "verb",
    "infinitive": "s'appeler",
    "english": [
      "to be called",
      "to be named"
    ],
    "senses": [
      {
        "sense_id": "verb_s_appeler_s01",
        "english": [
          "to be called"
        ],
        "usage_contexts": [], "example_ids": []
      }
    ],
    "conjugation_ids": [],
    "expression_ids": [],
    "related_verb_ids": [],
    "word_family_ids": [],
    "complement_frame_ids": [],
    "contrast_verb_ids": [],
    "confused_with_ids": [],
    "functional_roles": [],
    "past_participle": "appelé",
    "present_participle": "appelant",
    "auxiliary": "etre",
    "regularity": "regular",
    "verb_group": "1st_group",
    "pronominal": true,
    "transitivity": [
      "transitive"
    ],
    "study": {
      "learning_priority": 3,
      "usefulness": 3,
      "difficulty": 2
    },
    "usage": {
      "register": "neutral",
      "spoken_written": "both",
      "contexts": []
    },
    "attestations": [
      {
        "source_type": "book",
        "chapter_number": 1,
        "page_printed": 8,
        "context_type": "grammar_explanation"
      }
    ],
    "frequency": {
      "book_occurrences": 2
    },
    "tags": [
      "source_reconciled_verb"
    ]
  },
  {
    "id": "verb_se_plaindre",
    "type": "verb",
    "infinitive": "se plaindre",
    "english": [
      "to complain"
    ],
    "senses": [
      {
        "sense_id": "verb_se_plaindre_s01",
        "english": [
          "to complain"
        ],
        "usage_contexts": [], "example_ids": []
      }
    ],
    "conjugation_ids": [],
    "expression_ids": [],
    "related_verb_ids": [],
    "word_family_ids": [],
    "complement_frame_ids": [],
    "contrast_verb_ids": [],
    "confused_with_ids": [],
    "functional_roles": [],
    "past_participle": "plaint",
    "present_participle": "plaignant",
    "auxiliary": "etre",
    "regularity": "irregular",
    "verb_group": "3rd_group",
    "pronominal": true,
    "transitivity": [
      "transitive"
    ],
    "study": {
      "learning_priority": 3,
      "usefulness": 3,
      "difficulty": 2
    },
    "usage": {
      "register": "neutral",
      "spoken_written": "both",
      "contexts": []
    },
    "attestations": [
      {
        "source_type": "book",
        "chapter_number": 5,
        "page_printed": 50,
        "context_type": "grammar_explanation"
      }
    ],
    "frequency": {
      "book_occurrences": 2
    },
    "tags": [
      "source_reconciled_verb"
    ]
  },
  {
    "id": "verb_se_balader",
    "type": "verb",
    "infinitive": "se balader",
    "english": [
      "to stroll",
      "to walk around"
    ],
    "senses": [
      {
        "sense_id": "verb_se_balader_s01",
        "english": [
          "to stroll"
        ],
        "usage_contexts": [], "example_ids": []
      }
    ],
    "conjugation_ids": [],
    "expression_ids": [],
    "related_verb_ids": [],
    "word_family_ids": [],
    "complement_frame_ids": [],
    "contrast_verb_ids": [],
    "confused_with_ids": [],
    "functional_roles": [],
    "past_participle": "baladé",
    "present_participle": "baladant",
    "auxiliary": "etre",
    "regularity": "regular",
    "verb_group": "1st_group",
    "pronominal": true,
    "transitivity": [
      "transitive"
    ],
    "study": {
      "learning_priority": 3,
      "usefulness": 3,
      "difficulty": 2
    },
    "usage": {
      "register": "neutral",
      "spoken_written": "both",
      "contexts": []
    },
    "attestations": [
      {
        "source_type": "book",
        "chapter_number": 6,
        "page_printed": 57,
        "context_type": "grammar_explanation"
      }
    ],
    "frequency": {
      "book_occurrences": 2
    },
    "tags": [
      "source_reconciled_verb"
    ]
  },
  {
    "id": "verb_s_amuser",
    "type": "verb",
    "infinitive": "s'amuser",
    "english": [
      "to have fun",
      "to enjoy oneself"
    ],
    "senses": [
      {
        "sense_id": "verb_s_amuser_s01",
        "english": [
          "to have fun"
        ],
        "usage_contexts": [], "example_ids": []
      }
    ],
    "conjugation_ids": [],
    "expression_ids": [],
    "related_verb_ids": [],
    "word_family_ids": [],
    "complement_frame_ids": [],
    "contrast_verb_ids": [],
    "confused_with_ids": [],
    "functional_roles": [],
    "past_participle": "amusé",
    "present_participle": "amusant",
    "auxiliary": "etre",
    "regularity": "regular",
    "verb_group": "1st_group",
    "pronominal": true,
    "transitivity": [
      "transitive"
    ],
    "study": {
      "learning_priority": 3,
      "usefulness": 3,
      "difficulty": 2
    },
    "usage": {
      "register": "neutral",
      "spoken_written": "both",
      "contexts": []
    },
    "attestations": [
      {
        "source_type": "book",
        "chapter_number": 6,
        "page_printed": 57,
        "context_type": "grammar_explanation"
      }
    ],
    "frequency": {
      "book_occurrences": 2
    },
    "tags": [
      "source_reconciled_verb"
    ]
  },
  {
    "id": "verb_se_detendre",
    "type": "verb",
    "infinitive": "se détendre",
    "english": [
      "to relax"
    ],
    "senses": [
      {
        "sense_id": "verb_se_detendre_s01",
        "english": [
          "to relax"
        ],
        "usage_contexts": [], "example_ids": []
      }
    ],
    "conjugation_ids": [],
    "expression_ids": [],
    "related_verb_ids": [],
    "word_family_ids": [],
    "complement_frame_ids": [],
    "contrast_verb_ids": [],
    "confused_with_ids": [],
    "functional_roles": [],
    "past_participle": "détendu",
    "present_participle": "détendant",
    "auxiliary": "etre",
    "regularity": "regular",
    "verb_group": "3rd_group",
    "pronominal": true,
    "transitivity": [
      "transitive"
    ],
    "study": {
      "learning_priority": 3,
      "usefulness": 3,
      "difficulty": 2
    },
    "usage": {
      "register": "neutral",
      "spoken_written": "both",
      "contexts": []
    },
    "attestations": [
      {
        "source_type": "book",
        "chapter_number": 6,
        "page_printed": 57,
        "context_type": "grammar_explanation"
      }
    ],
    "frequency": {
      "book_occurrences": 2
    },
    "tags": [
      "source_reconciled_verb"
    ]
  },
  {
    "id": "verb_se_retrouver",
    "type": "verb",
    "infinitive": "se retrouver",
    "english": [
      "to meet up",
      "to find oneself"
    ],
    "senses": [
      {
        "sense_id": "verb_se_retrouver_s01",
        "english": [
          "to meet up"
        ],
        "usage_contexts": [], "example_ids": []
      }
    ],
    "conjugation_ids": [],
    "expression_ids": [],
    "related_verb_ids": [],
    "word_family_ids": [],
    "complement_frame_ids": [],
    "contrast_verb_ids": [],
    "confused_with_ids": [],
    "functional_roles": [],
    "past_participle": "retrouvé",
    "present_participle": "retrouvant",
    "auxiliary": "etre",
    "regularity": "regular",
    "verb_group": "1st_group",
    "pronominal": true,
    "transitivity": [
      "transitive"
    ],
    "study": {
      "learning_priority": 3,
      "usefulness": 3,
      "difficulty": 2
    },
    "usage": {
      "register": "neutral",
      "spoken_written": "both",
      "contexts": []
    },
    "attestations": [
      {
        "source_type": "book",
        "chapter_number": 6,
        "page_printed": 58,
        "context_type": "grammar_explanation"
      }
    ],
    "frequency": {
      "book_occurrences": 2
    },
    "tags": [
      "source_reconciled_verb"
    ]
  },
  {
    "id": "verb_se_quitter",
    "type": "verb",
    "infinitive": "se quitter",
    "english": [
      "to leave each other",
      "to part"
    ],
    "senses": [
      {
        "sense_id": "verb_se_quitter_s01",
        "english": [
          "to leave each other"
        ],
        "usage_contexts": [], "example_ids": []
      }
    ],
    "conjugation_ids": [],
    "expression_ids": [],
    "related_verb_ids": [],
    "word_family_ids": [],
    "complement_frame_ids": [],
    "contrast_verb_ids": [],
    "confused_with_ids": [],
    "functional_roles": [],
    "past_participle": "quitté",
    "present_participle": "quittant",
    "auxiliary": "etre",
    "regularity": "regular",
    "verb_group": "1st_group",
    "pronominal": true,
    "transitivity": [
      "transitive"
    ],
    "study": {
      "learning_priority": 3,
      "usefulness": 3,
      "difficulty": 2
    },
    "usage": {
      "register": "neutral",
      "spoken_written": "both",
      "contexts": []
    },
    "attestations": [
      {
        "source_type": "book",
        "chapter_number": 6,
        "page_printed": 58,
        "context_type": "grammar_explanation"
      }
    ],
    "frequency": {
      "book_occurrences": 2
    },
    "tags": [
      "source_reconciled_verb"
    ]
  },
  {
    "id": "verb_se_disputer",
    "type": "verb",
    "infinitive": "se disputer",
    "english": [
      "to argue",
      "to quarrel"
    ],
    "senses": [
      {
        "sense_id": "verb_se_disputer_s01",
        "english": [
          "to argue"
        ],
        "usage_contexts": [], "example_ids": []
      }
    ],
    "conjugation_ids": [],
    "expression_ids": [],
    "related_verb_ids": [],
    "word_family_ids": [],
    "complement_frame_ids": [],
    "contrast_verb_ids": [],
    "confused_with_ids": [],
    "functional_roles": [],
    "past_participle": "disputé",
    "present_participle": "disputant",
    "auxiliary": "etre",
    "regularity": "regular",
    "verb_group": "1st_group",
    "pronominal": true,
    "transitivity": [
      "transitive"
    ],
    "study": {
      "learning_priority": 3,
      "usefulness": 3,
      "difficulty": 2
    },
    "usage": {
      "register": "neutral",
      "spoken_written": "both",
      "contexts": []
    },
    "attestations": [
      {
        "source_type": "book",
        "chapter_number": 6,
        "page_printed": 58,
        "context_type": "grammar_explanation"
      }
    ],
    "frequency": {
      "book_occurrences": 2
    },
    "tags": [
      "source_reconciled_verb"
    ]
  },
  {
    "id": "verb_se_detester",
    "type": "verb",
    "infinitive": "se détester",
    "english": [
      "to hate each other"
    ],
    "senses": [
      {
        "sense_id": "verb_se_detester_s01",
        "english": [
          "to hate each other"
        ],
        "usage_contexts": [], "example_ids": []
      }
    ],
    "conjugation_ids": [],
    "expression_ids": [],
    "related_verb_ids": [],
    "word_family_ids": [],
    "complement_frame_ids": [],
    "contrast_verb_ids": [],
    "confused_with_ids": [],
    "functional_roles": [],
    "past_participle": "détesté",
    "present_participle": "détestant",
    "auxiliary": "etre",
    "regularity": "regular",
    "verb_group": "1st_group",
    "pronominal": true,
    "transitivity": [
      "transitive"
    ],
    "study": {
      "learning_priority": 3,
      "usefulness": 3,
      "difficulty": 2
    },
    "usage": {
      "register": "neutral",
      "spoken_written": "both",
      "contexts": []
    },
    "attestations": [
      {
        "source_type": "book",
        "chapter_number": 6,
        "page_printed": 58,
        "context_type": "grammar_explanation"
      }
    ],
    "frequency": {
      "book_occurrences": 2
    },
    "tags": [
      "source_reconciled_verb"
    ]
  },
  {
    "id": "verb_s_attendre",
    "type": "verb",
    "infinitive": "s'attendre",
    "english": [
      "to expect"
    ],
    "senses": [
      {
        "sense_id": "verb_s_attendre_s01",
        "english": [
          "to expect"
        ],
        "usage_contexts": [], "example_ids": []
      }
    ],
    "conjugation_ids": [],
    "expression_ids": [],
    "related_verb_ids": [],
    "word_family_ids": [],
    "complement_frame_ids": [],
    "contrast_verb_ids": [],
    "confused_with_ids": [],
    "functional_roles": [],
    "past_participle": "attendu",
    "present_participle": "attendant",
    "auxiliary": "etre",
    "regularity": "regular",
    "verb_group": "3rd_group",
    "pronominal": true,
    "transitivity": [
      "transitive"
    ],
    "study": {
      "learning_priority": 3,
      "usefulness": 3,
      "difficulty": 2
    },
    "usage": {
      "register": "neutral",
      "spoken_written": "both",
      "contexts": []
    },
    "attestations": [
      {
        "source_type": "book",
        "chapter_number": 6,
        "page_printed": 59,
        "context_type": "grammar_explanation"
      }
    ],
    "frequency": {
      "book_occurrences": 2
    },
    "tags": [
      "source_reconciled_verb"
    ]
  },
  {
    "id": "verb_se_servir",
    "type": "verb",
    "infinitive": "se servir",
    "english": [
      "to use",
      "to make use of",
      "to serve oneself"
    ],
    "senses": [
      {
        "sense_id": "verb_se_servir_s01",
        "english": [
          "to use"
        ],
        "usage_contexts": [], "example_ids": []
      }
    ],
    "conjugation_ids": [],
    "expression_ids": [],
    "related_verb_ids": [],
    "word_family_ids": [],
    "complement_frame_ids": [],
    "contrast_verb_ids": [],
    "confused_with_ids": [],
    "functional_roles": [],
    "past_participle": "servi",
    "present_participle": "servant",
    "auxiliary": "etre",
    "regularity": "irregular",
    "verb_group": "3rd_group",
    "pronominal": true,
    "transitivity": [
      "transitive"
    ],
    "study": {
      "learning_priority": 3,
      "usefulness": 3,
      "difficulty": 2
    },
    "usage": {
      "register": "neutral",
      "spoken_written": "both",
      "contexts": []
    },
    "attestations": [
      {
        "source_type": "book",
        "chapter_number": 6,
        "page_printed": 59,
        "context_type": "grammar_explanation"
      }
    ],
    "frequency": {
      "book_occurrences": 2
    },
    "tags": [
      "source_reconciled_verb"
    ]
  },
  {
    "id": "verb_se_demander",
    "type": "verb",
    "infinitive": "se demander",
    "english": [
      "to wonder",
      "to ask oneself"
    ],
    "senses": [
      {
        "sense_id": "verb_se_demander_s01",
        "english": [
          "to wonder"
        ],
        "usage_contexts": [], "example_ids": []
      }
    ],
    "conjugation_ids": [],
    "expression_ids": [],
    "related_verb_ids": [],
    "word_family_ids": [],
    "complement_frame_ids": [],
    "contrast_verb_ids": [],
    "confused_with_ids": [],
    "functional_roles": [],
    "past_participle": "demandé",
    "present_participle": "demandant",
    "auxiliary": "etre",
    "regularity": "regular",
    "verb_group": "1st_group",
    "pronominal": true,
    "transitivity": [
      "transitive"
    ],
    "study": {
      "learning_priority": 3,
      "usefulness": 3,
      "difficulty": 2
    },
    "usage": {
      "register": "neutral",
      "spoken_written": "both",
      "contexts": []
    },
    "attestations": [
      {
        "source_type": "book",
        "chapter_number": 6,
        "page_printed": 59,
        "context_type": "grammar_explanation"
      }
    ],
    "frequency": {
      "book_occurrences": 2
    },
    "tags": [
      "source_reconciled_verb"
    ]
  },
  {
    "id": "verb_s_envoler",
    "type": "verb",
    "infinitive": "s'envoler",
    "english": [
      "to fly away",
      "to take off"
    ],
    "senses": [
      {
        "sense_id": "verb_s_envoler_s01",
        "english": [
          "to fly away"
        ],
        "usage_contexts": [], "example_ids": []
      }
    ],
    "conjugation_ids": [],
    "expression_ids": [],
    "related_verb_ids": [],
    "word_family_ids": [],
    "complement_frame_ids": [],
    "contrast_verb_ids": [],
    "confused_with_ids": [],
    "functional_roles": [],
    "past_participle": "envolé",
    "present_participle": "envolant",
    "auxiliary": "etre",
    "regularity": "regular",
    "verb_group": "1st_group",
    "pronominal": true,
    "transitivity": [
      "transitive"
    ],
    "study": {
      "learning_priority": 3,
      "usefulness": 3,
      "difficulty": 2
    },
    "usage": {
      "register": "neutral",
      "spoken_written": "both",
      "contexts": []
    },
    "attestations": [
      {
        "source_type": "book",
        "chapter_number": 6,
        "page_printed": 59,
        "context_type": "grammar_explanation"
      }
    ],
    "frequency": {
      "book_occurrences": 2
    },
    "tags": [
      "source_reconciled_verb"
    ]
  },
  {
    "id": "verb_sous_titrer",
    "type": "verb",
    "infinitive": "sous-titrer",
    "english": [
      "to subtitle"
    ],
    "senses": [
      {
        "sense_id": "verb_sous_titrer_s01",
        "english": [
          "to subtitle"
        ],
        "usage_contexts": [], "example_ids": []
      }
    ],
    "conjugation_ids": [],
    "expression_ids": [],
    "related_verb_ids": [],
    "word_family_ids": [],
    "complement_frame_ids": [],
    "contrast_verb_ids": [],
    "confused_with_ids": [],
    "functional_roles": [],
    "past_participle": "sous-titré",
    "present_participle": "sous-titrant",
    "auxiliary": "avoir",
    "regularity": "regular",
    "verb_group": "1st_group",
    "pronominal": false,
    "transitivity": [
      "transitive"
    ],
    "study": {
      "learning_priority": 3,
      "usefulness": 3,
      "difficulty": 2
    },
    "usage": {
      "register": "neutral",
      "spoken_written": "both",
      "contexts": []
    },
    "attestations": [
      {
        "source_type": "book",
        "chapter_number": 7,
        "page_printed": 67,
        "context_type": "grammar_explanation"
      }
    ],
    "frequency": {
      "book_occurrences": 2
    },
    "tags": [
      "source_reconciled_verb"
    ]
  },
  {
    "id": "verb_se_douter",
    "type": "verb",
    "infinitive": "se douter",
    "english": [
      "to suspect",
      "to have a feeling"
    ],
    "senses": [
      {
        "sense_id": "verb_se_douter_s01",
        "english": [
          "to suspect"
        ],
        "usage_contexts": [], "example_ids": []
      }
    ],
    "conjugation_ids": [],
    "expression_ids": [],
    "related_verb_ids": [],
    "word_family_ids": [],
    "complement_frame_ids": [],
    "contrast_verb_ids": [],
    "confused_with_ids": [],
    "functional_roles": [],
    "past_participle": "douté",
    "present_participle": "doutant",
    "auxiliary": "etre",
    "regularity": "regular",
    "verb_group": "1st_group",
    "pronominal": true,
    "transitivity": [
      "transitive"
    ],
    "study": {
      "learning_priority": 3,
      "usefulness": 3,
      "difficulty": 2
    },
    "usage": {
      "register": "neutral",
      "spoken_written": "both",
      "contexts": []
    },
    "attestations": [
      {
        "source_type": "book",
        "chapter_number": 7,
        "page_printed": 70,
        "context_type": "grammar_explanation"
      }
    ],
    "frequency": {
      "book_occurrences": 2
    },
    "tags": [
      "source_reconciled_verb"
    ]
  },
  {
    "id": "verb_se_maquiller",
    "type": "verb",
    "infinitive": "se maquiller",
    "english": [
      "to put on makeup"
    ],
    "senses": [
      {
        "sense_id": "verb_se_maquiller_s01",
        "english": [
          "to put on makeup"
        ],
        "usage_contexts": [], "example_ids": []
      }
    ],
    "conjugation_ids": [],
    "expression_ids": [],
    "related_verb_ids": [],
    "word_family_ids": [],
    "complement_frame_ids": [],
    "contrast_verb_ids": [],
    "confused_with_ids": [],
    "functional_roles": [],
    "past_participle": "maquillé",
    "present_participle": "maquillant",
    "auxiliary": "etre",
    "regularity": "regular",
    "verb_group": "1st_group",
    "pronominal": true,
    "transitivity": [
      "transitive"
    ],
    "study": {
      "learning_priority": 3,
      "usefulness": 3,
      "difficulty": 2
    },
    "usage": {
      "register": "neutral",
      "spoken_written": "both",
      "contexts": []
    },
    "attestations": [
      {
        "source_type": "book",
        "chapter_number": 7,
        "page_printed": 70,
        "context_type": "grammar_explanation"
      }
    ],
    "frequency": {
      "book_occurrences": 2
    },
    "tags": [
      "source_reconciled_verb"
    ]
  },
  {
    "id": "verb_s_arreter",
    "type": "verb",
    "infinitive": "s'arrêter",
    "english": [
      "to stop"
    ],
    "senses": [
      {
        "sense_id": "verb_s_arreter_s01",
        "english": [
          "to stop"
        ],
        "usage_contexts": [], "example_ids": []
      }
    ],
    "conjugation_ids": [],
    "expression_ids": [],
    "related_verb_ids": [],
    "word_family_ids": [],
    "complement_frame_ids": [],
    "contrast_verb_ids": [],
    "confused_with_ids": [],
    "functional_roles": [],
    "past_participle": "arrêté",
    "present_participle": "arrêtant",
    "auxiliary": "etre",
    "regularity": "regular",
    "verb_group": "1st_group",
    "pronominal": true,
    "transitivity": [
      "transitive"
    ],
    "study": {
      "learning_priority": 3,
      "usefulness": 3,
      "difficulty": 2
    },
    "usage": {
      "register": "neutral",
      "spoken_written": "both",
      "contexts": []
    },
    "attestations": [
      {
        "source_type": "book",
        "chapter_number": 7,
        "page_printed": 70,
        "context_type": "grammar_explanation"
      }
    ],
    "frequency": {
      "book_occurrences": 2
    },
    "tags": [
      "source_reconciled_verb"
    ]
  },
  {
    "id": "verb_s_occuper",
    "type": "verb",
    "infinitive": "s'occuper",
    "english": [
      "to take care of",
      "to attend to"
    ],
    "senses": [
      {
        "sense_id": "verb_s_occuper_s01",
        "english": [
          "to take care of"
        ],
        "usage_contexts": [], "example_ids": []
      }
    ],
    "conjugation_ids": [],
    "expression_ids": [],
    "related_verb_ids": [],
    "word_family_ids": [],
    "complement_frame_ids": [],
    "contrast_verb_ids": [],
    "confused_with_ids": [],
    "functional_roles": [],
    "past_participle": "occupé",
    "present_participle": "occupant",
    "auxiliary": "etre",
    "regularity": "regular",
    "verb_group": "1st_group",
    "pronominal": true,
    "transitivity": [
      "transitive"
    ],
    "study": {
      "learning_priority": 3,
      "usefulness": 3,
      "difficulty": 2
    },
    "usage": {
      "register": "neutral",
      "spoken_written": "both",
      "contexts": []
    },
    "attestations": [
      {
        "source_type": "book",
        "chapter_number": 7,
        "page_printed": 70,
        "context_type": "grammar_explanation"
      }
    ],
    "frequency": {
      "book_occurrences": 2
    },
    "tags": [
      "source_reconciled_verb"
    ]
  },
  {
    "id": "verb_diner",
    "type": "verb",
    "infinitive": "dîner",
    "english": [
      "to have dinner",
      "to dine"
    ],
    "senses": [
      {
        "sense_id": "verb_diner_s01",
        "english": [
          "to have dinner"
        ],
        "usage_contexts": [], "example_ids": []
      }
    ],
    "conjugation_ids": [],
    "expression_ids": [],
    "related_verb_ids": [],
    "word_family_ids": [],
    "complement_frame_ids": [],
    "contrast_verb_ids": [],
    "confused_with_ids": [],
    "functional_roles": [],
    "past_participle": "dîné",
    "present_participle": "dînant",
    "auxiliary": "avoir",
    "regularity": "regular",
    "verb_group": "1st_group",
    "pronominal": false,
    "transitivity": [
      "transitive"
    ],
    "study": {
      "learning_priority": 3,
      "usefulness": 3,
      "difficulty": 2
    },
    "usage": {
      "register": "neutral",
      "spoken_written": "both",
      "contexts": []
    },
    "attestations": [
      {
        "source_type": "book",
        "chapter_number": 8,
        "page_printed": 76,
        "context_type": "grammar_explanation"
      }
    ],
    "frequency": {
      "book_occurrences": 2
    },
    "tags": [
      "source_reconciled_verb"
    ]
  },
  {
    "id": "verb_completer",
    "type": "verb",
    "infinitive": "compléter",
    "english": [
      "to complete"
    ],
    "senses": [
      {
        "sense_id": "verb_completer_s01",
        "english": [
          "to complete"
        ],
        "usage_contexts": [], "example_ids": []
      }
    ],
    "conjugation_ids": [],
    "expression_ids": [],
    "related_verb_ids": [],
    "word_family_ids": [],
    "complement_frame_ids": [],
    "contrast_verb_ids": [],
    "confused_with_ids": [],
    "functional_roles": [],
    "past_participle": "complété",
    "present_participle": "complétant",
    "auxiliary": "avoir",
    "regularity": "regular",
    "verb_group": "1st_group",
    "pronominal": false,
    "transitivity": [
      "transitive"
    ],
    "study": {
      "learning_priority": 3,
      "usefulness": 3,
      "difficulty": 2
    },
    "usage": {
      "register": "neutral",
      "spoken_written": "both",
      "contexts": []
    },
    "attestations": [
      {
        "source_type": "book",
        "chapter_number": 9,
        "page_printed": 85,
        "context_type": "grammar_explanation"
      }
    ],
    "frequency": {
      "book_occurrences": 2
    },
    "tags": [
      "source_reconciled_verb"
    ]
  },
  {
    "id": "verb_geler",
    "type": "verb",
    "infinitive": "geler",
    "english": [
      "to freeze"
    ],
    "senses": [
      {
        "sense_id": "verb_geler_s01",
        "english": [
          "to freeze"
        ],
        "usage_contexts": [], "example_ids": []
      }
    ],
    "conjugation_ids": [],
    "expression_ids": [],
    "related_verb_ids": [],
    "word_family_ids": [],
    "complement_frame_ids": [],
    "contrast_verb_ids": [],
    "confused_with_ids": [],
    "functional_roles": [],
    "past_participle": "gelé",
    "present_participle": "gelant",
    "auxiliary": "avoir",
    "regularity": "regular",
    "verb_group": "1st_group",
    "pronominal": false,
    "transitivity": [
      "transitive"
    ],
    "study": {
      "learning_priority": 3,
      "usefulness": 3,
      "difficulty": 2
    },
    "usage": {
      "register": "neutral",
      "spoken_written": "both",
      "contexts": []
    },
    "attestations": [
      {
        "source_type": "book",
        "chapter_number": 9,
        "page_printed": 86,
        "context_type": "grammar_explanation"
      }
    ],
    "frequency": {
      "book_occurrences": 2
    },
    "tags": [
      "source_reconciled_verb"
    ]
  },
  {
    "id": "verb_contacter",
    "type": "verb",
    "infinitive": "contacter",
    "english": [
      "to contact"
    ],
    "senses": [
      {
        "sense_id": "verb_contacter_s01",
        "english": [
          "to contact"
        ],
        "usage_contexts": [], "example_ids": []
      }
    ],
    "conjugation_ids": [],
    "expression_ids": [],
    "related_verb_ids": [],
    "word_family_ids": [],
    "complement_frame_ids": [],
    "contrast_verb_ids": [],
    "confused_with_ids": [],
    "functional_roles": [],
    "past_participle": "contacté",
    "present_participle": "contactant",
    "auxiliary": "avoir",
    "regularity": "regular",
    "verb_group": "1st_group",
    "pronominal": false,
    "transitivity": [
      "transitive"
    ],
    "study": {
      "learning_priority": 3,
      "usefulness": 3,
      "difficulty": 2
    },
    "usage": {
      "register": "neutral",
      "spoken_written": "both",
      "contexts": []
    },
    "attestations": [
      {
        "source_type": "book",
        "chapter_number": 9,
        "page_printed": 86,
        "context_type": "grammar_explanation"
      }
    ],
    "frequency": {
      "book_occurrences": 2
    },
    "tags": [
      "source_reconciled_verb"
    ]
  },
  {
    "id": "verb_rouler",
    "type": "verb",
    "infinitive": "rouler",
    "english": [
      "to drive",
      "to roll"
    ],
    "senses": [
      {
        "sense_id": "verb_rouler_s01",
        "english": [
          "to drive"
        ],
        "usage_contexts": [], "example_ids": []
      }
    ],
    "conjugation_ids": [],
    "expression_ids": [],
    "related_verb_ids": [],
    "word_family_ids": [],
    "complement_frame_ids": [],
    "contrast_verb_ids": [],
    "confused_with_ids": [],
    "functional_roles": [],
    "past_participle": "roulé",
    "present_participle": "roulant",
    "auxiliary": "avoir",
    "regularity": "regular",
    "verb_group": "1st_group",
    "pronominal": false,
    "transitivity": [
      "transitive"
    ],
    "study": {
      "learning_priority": 3,
      "usefulness": 3,
      "difficulty": 2
    },
    "usage": {
      "register": "neutral",
      "spoken_written": "both",
      "contexts": []
    },
    "attestations": [
      {
        "source_type": "book",
        "chapter_number": 10,
        "page_printed": 90,
        "context_type": "grammar_explanation"
      }
    ],
    "frequency": {
      "book_occurrences": 2
    },
    "tags": [
      "source_reconciled_verb"
    ]
  },
  {
    "id": "verb_echouer",
    "type": "verb",
    "infinitive": "échouer",
    "english": [
      "to fail",
      "to run aground"
    ],
    "senses": [
      {
        "sense_id": "verb_echouer_s01",
        "english": [
          "to fail"
        ],
        "usage_contexts": [], "example_ids": []
      }
    ],
    "conjugation_ids": [],
    "expression_ids": [],
    "related_verb_ids": [],
    "word_family_ids": [],
    "complement_frame_ids": [],
    "contrast_verb_ids": [],
    "confused_with_ids": [],
    "functional_roles": [],
    "past_participle": "échoué",
    "present_participle": "échouant",
    "auxiliary": "avoir",
    "regularity": "regular",
    "verb_group": "1st_group",
    "pronominal": false,
    "transitivity": [
      "transitive"
    ],
    "study": {
      "learning_priority": 3,
      "usefulness": 3,
      "difficulty": 2
    },
    "usage": {
      "register": "neutral",
      "spoken_written": "both",
      "contexts": []
    },
    "attestations": [
      {
        "source_type": "book",
        "chapter_number": 10,
        "page_printed": 90,
        "context_type": "grammar_explanation"
      }
    ],
    "frequency": {
      "book_occurrences": 2
    },
    "tags": [
      "source_reconciled_verb"
    ]
  },
  {
    "id": "verb_se_reveiller",
    "type": "verb",
    "infinitive": "se réveiller",
    "english": [
      "to wake up"
    ],
    "senses": [
      {
        "sense_id": "verb_se_reveiller_s01",
        "english": [
          "to wake up"
        ],
        "usage_contexts": [], "example_ids": []
      }
    ],
    "conjugation_ids": [],
    "expression_ids": [],
    "related_verb_ids": [],
    "word_family_ids": [],
    "complement_frame_ids": [],
    "contrast_verb_ids": [],
    "confused_with_ids": [],
    "functional_roles": [],
    "past_participle": "réveillé",
    "present_participle": "réveillant",
    "auxiliary": "etre",
    "regularity": "regular",
    "verb_group": "1st_group",
    "pronominal": true,
    "transitivity": [
      "transitive"
    ],
    "study": {
      "learning_priority": 3,
      "usefulness": 3,
      "difficulty": 2
    },
    "usage": {
      "register": "neutral",
      "spoken_written": "both",
      "contexts": []
    },
    "attestations": [
      {
        "source_type": "book",
        "chapter_number": 10,
        "page_printed": 91,
        "context_type": "grammar_explanation"
      }
    ],
    "frequency": {
      "book_occurrences": 2
    },
    "tags": [
      "source_reconciled_verb"
    ]
  },
  {
    "id": "verb_prescrire",
    "type": "verb",
    "infinitive": "prescrire",
    "english": [
      "to prescribe"
    ],
    "senses": [
      {
        "sense_id": "verb_prescrire_s01",
        "english": [
          "to prescribe"
        ],
        "usage_contexts": [], "example_ids": []
      }
    ],
    "conjugation_ids": [],
    "expression_ids": [],
    "related_verb_ids": [],
    "word_family_ids": [],
    "complement_frame_ids": [],
    "contrast_verb_ids": [],
    "confused_with_ids": [],
    "functional_roles": [],
    "past_participle": "prescrit",
    "present_participle": "prescrivant",
    "auxiliary": "avoir",
    "regularity": "irregular",
    "verb_group": "3rd_group",
    "pronominal": false,
    "transitivity": [
      "transitive"
    ],
    "study": {
      "learning_priority": 3,
      "usefulness": 3,
      "difficulty": 2
    },
    "usage": {
      "register": "neutral",
      "spoken_written": "both",
      "contexts": []
    },
    "attestations": [
      {
        "source_type": "book",
        "chapter_number": 10,
        "page_printed": 92,
        "context_type": "grammar_explanation"
      }
    ],
    "frequency": {
      "book_occurrences": 2
    },
    "tags": [
      "source_reconciled_verb"
    ]
  },
  {
    "id": "verb_planter",
    "type": "verb",
    "infinitive": "planter",
    "english": [
      "to plant"
    ],
    "senses": [
      {
        "sense_id": "verb_planter_s01",
        "english": [
          "to plant"
        ],
        "usage_contexts": [], "example_ids": []
      }
    ],
    "conjugation_ids": [],
    "expression_ids": [],
    "related_verb_ids": [],
    "word_family_ids": [],
    "complement_frame_ids": [],
    "contrast_verb_ids": [],
    "confused_with_ids": [],
    "functional_roles": [],
    "past_participle": "planté",
    "present_participle": "plantant",
    "auxiliary": "avoir",
    "regularity": "regular",
    "verb_group": "1st_group",
    "pronominal": false,
    "transitivity": [
      "transitive"
    ],
    "study": {
      "learning_priority": 3,
      "usefulness": 3,
      "difficulty": 2
    },
    "usage": {
      "register": "neutral",
      "spoken_written": "both",
      "contexts": []
    },
    "attestations": [
      {
        "source_type": "book",
        "chapter_number": 11,
        "page_printed": 100,
        "context_type": "grammar_explanation"
      }
    ],
    "frequency": {
      "book_occurrences": 2
    },
    "tags": [
      "source_reconciled_verb"
    ]
  },
  {
    "id": "verb_s_organiser",
    "type": "verb",
    "infinitive": "s'organiser",
    "english": [
      "to get organized"
    ],
    "senses": [
      {
        "sense_id": "verb_s_organiser_s01",
        "english": [
          "to get organized"
        ],
        "usage_contexts": [], "example_ids": []
      }
    ],
    "conjugation_ids": [],
    "expression_ids": [],
    "related_verb_ids": [],
    "word_family_ids": [],
    "complement_frame_ids": [],
    "contrast_verb_ids": [],
    "confused_with_ids": [],
    "functional_roles": [],
    "past_participle": "organisé",
    "present_participle": "organisant",
    "auxiliary": "etre",
    "regularity": "regular",
    "verb_group": "1st_group",
    "pronominal": true,
    "transitivity": [
      "transitive"
    ],
    "study": {
      "learning_priority": 3,
      "usefulness": 3,
      "difficulty": 2
    },
    "usage": {
      "register": "neutral",
      "spoken_written": "both",
      "contexts": []
    },
    "attestations": [
      {
        "source_type": "book",
        "chapter_number": 11,
        "page_printed": 100,
        "context_type": "grammar_explanation"
      }
    ],
    "frequency": {
      "book_occurrences": 2
    },
    "tags": [
      "source_reconciled_verb"
    ]
  },
  {
    "id": "verb_se_presenter",
    "type": "verb",
    "infinitive": "se présenter",
    "english": [
      "to introduce oneself",
      "to present oneself"
    ],
    "senses": [
      {
        "sense_id": "verb_se_presenter_s01",
        "english": [
          "to introduce oneself"
        ],
        "usage_contexts": [], "example_ids": []
      }
    ],
    "conjugation_ids": [],
    "expression_ids": [],
    "related_verb_ids": [],
    "word_family_ids": [],
    "complement_frame_ids": [],
    "contrast_verb_ids": [],
    "confused_with_ids": [],
    "functional_roles": [],
    "past_participle": "présenté",
    "present_participle": "présentant",
    "auxiliary": "etre",
    "regularity": "regular",
    "verb_group": "1st_group",
    "pronominal": true,
    "transitivity": [
      "transitive"
    ],
    "study": {
      "learning_priority": 3,
      "usefulness": 3,
      "difficulty": 2
    },
    "usage": {
      "register": "neutral",
      "spoken_written": "both",
      "contexts": []
    },
    "attestations": [
      {
        "source_type": "book",
        "chapter_number": 11,
        "page_printed": 103,
        "context_type": "grammar_explanation"
      }
    ],
    "frequency": {
      "book_occurrences": 2
    },
    "tags": [
      "source_reconciled_verb"
    ]
  },
  {
    "id": "verb_parier",
    "type": "verb",
    "infinitive": "parier",
    "english": [
      "to bet"
    ],
    "senses": [
      {
        "sense_id": "verb_parier_s01",
        "english": [
          "to bet"
        ],
        "usage_contexts": [], "example_ids": []
      }
    ],
    "conjugation_ids": [],
    "expression_ids": [],
    "related_verb_ids": [],
    "word_family_ids": [],
    "complement_frame_ids": [],
    "contrast_verb_ids": [],
    "confused_with_ids": [],
    "functional_roles": [],
    "past_participle": "parié",
    "present_participle": "pariant",
    "auxiliary": "avoir",
    "regularity": "regular",
    "verb_group": "1st_group",
    "pronominal": false,
    "transitivity": [
      "transitive"
    ],
    "study": {
      "learning_priority": 3,
      "usefulness": 3,
      "difficulty": 2
    },
    "usage": {
      "register": "neutral",
      "spoken_written": "both",
      "contexts": []
    },
    "attestations": [
      {
        "source_type": "book",
        "chapter_number": 15,
        "page_printed": 122,
        "context_type": "grammar_explanation"
      }
    ],
    "frequency": {
      "book_occurrences": 2
    },
    "tags": [
      "source_reconciled_verb"
    ]
  },
  {
    "id": "verb_trembler",
    "type": "verb",
    "infinitive": "trembler",
    "english": [
      "to tremble",
      "to shake"
    ],
    "senses": [
      {
        "sense_id": "verb_trembler_s01",
        "english": [
          "to tremble"
        ],
        "usage_contexts": [], "example_ids": []
      }
    ],
    "conjugation_ids": [],
    "expression_ids": [],
    "related_verb_ids": [],
    "word_family_ids": [],
    "complement_frame_ids": [],
    "contrast_verb_ids": [],
    "confused_with_ids": [],
    "functional_roles": [],
    "past_participle": "tremblé",
    "present_participle": "tremblant",
    "auxiliary": "avoir",
    "regularity": "regular",
    "verb_group": "1st_group",
    "pronominal": false,
    "transitivity": [
      "transitive"
    ],
    "study": {
      "learning_priority": 3,
      "usefulness": 3,
      "difficulty": 2
    },
    "usage": {
      "register": "neutral",
      "spoken_written": "both",
      "contexts": []
    },
    "attestations": [
      {
        "source_type": "book",
        "chapter_number": 16,
        "page_printed": 128,
        "context_type": "grammar_explanation"
      }
    ],
    "frequency": {
      "book_occurrences": 2
    },
    "tags": [
      "source_reconciled_verb"
    ]
  },
  {
    "id": "verb_introduire",
    "type": "verb",
    "infinitive": "introduire",
    "english": [
      "to introduce",
      "to insert"
    ],
    "senses": [
      {
        "sense_id": "verb_introduire_s01",
        "english": [
          "to introduce"
        ],
        "usage_contexts": [], "example_ids": []
      }
    ],
    "conjugation_ids": [],
    "expression_ids": [],
    "related_verb_ids": [],
    "word_family_ids": [],
    "complement_frame_ids": [],
    "contrast_verb_ids": [],
    "confused_with_ids": [],
    "functional_roles": [],
    "past_participle": "introduit",
    "present_participle": "introduisant",
    "auxiliary": "avoir",
    "regularity": "irregular",
    "verb_group": "3rd_group",
    "pronominal": false,
    "transitivity": [
      "transitive"
    ],
    "study": {
      "learning_priority": 3,
      "usefulness": 3,
      "difficulty": 2
    },
    "usage": {
      "register": "neutral",
      "spoken_written": "both",
      "contexts": []
    },
    "attestations": [
      {
        "source_type": "book",
        "chapter_number": 16,
        "page_printed": 128,
        "context_type": "grammar_explanation"
      }
    ],
    "frequency": {
      "book_occurrences": 2
    },
    "tags": [
      "source_reconciled_verb"
    ]
  }
];

export const RECONCILED_EXPRESSIONS: Expression[] = [
  {
    "id": "expr_ne_plus",
    "type": "expression",
    "canonical_form": "ne... plus",
    "english": [
      "no longer",
      "not anymore"
    ],
    "expression_type": "idiom",
    "base_verb_ids": [],
    "related_vocabulary_ids": [],
    "function_ids": [],
    "example_ids": [],
    "variants": [],
    "productive": false,
    "pattern": null,
    "pattern_slots": [],
    "transformations": [],
    "usage_notes": [],
    "restrictions": [],
    "common_mistakes": [],
    "relations": {},
    "study": {
      "learning_priority": 3,
      "usefulness": 3,
      "difficulty": 2
    },
    "usage": {
      "register": "neutral",
      "spoken_written": "both",
      "contexts": []
    },
    "attestations": [
      {
        "source_type": "book",
        "chapter_number": 2,
        "page_printed": 22,
        "context_type": "grammar_explanation"
      }
    ],
    "frequency": {
      "book_occurrences": 2
    },
    "tags": [
      "source_reconciled_expression"
    ]
  },
  {
    "id": "expr_ne_rien",
    "type": "expression",
    "canonical_form": "ne... rien",
    "english": [
      "nothing"
    ],
    "expression_type": "idiom",
    "base_verb_ids": [],
    "related_vocabulary_ids": [],
    "function_ids": [],
    "example_ids": [],
    "variants": [],
    "productive": false,
    "pattern": null,
    "pattern_slots": [],
    "transformations": [],
    "usage_notes": [],
    "restrictions": [],
    "common_mistakes": [],
    "relations": {},
    "study": {
      "learning_priority": 3,
      "usefulness": 3,
      "difficulty": 2
    },
    "usage": {
      "register": "neutral",
      "spoken_written": "both",
      "contexts": []
    },
    "attestations": [
      {
        "source_type": "book",
        "chapter_number": 2,
        "page_printed": 22,
        "context_type": "grammar_explanation"
      }
    ],
    "frequency": {
      "book_occurrences": 2
    },
    "tags": [
      "source_reconciled_expression"
    ]
  },
  {
    "id": "expr_ne_personne",
    "type": "expression",
    "canonical_form": "ne... personne",
    "english": [
      "nobody",
      "no one"
    ],
    "expression_type": "idiom",
    "base_verb_ids": [],
    "related_vocabulary_ids": [],
    "function_ids": [],
    "example_ids": [],
    "variants": [],
    "productive": false,
    "pattern": null,
    "pattern_slots": [],
    "transformations": [],
    "usage_notes": [],
    "restrictions": [],
    "common_mistakes": [],
    "relations": {},
    "study": {
      "learning_priority": 3,
      "usefulness": 3,
      "difficulty": 2
    },
    "usage": {
      "register": "neutral",
      "spoken_written": "both",
      "contexts": []
    },
    "attestations": [
      {
        "source_type": "book",
        "chapter_number": 2,
        "page_printed": 22,
        "context_type": "grammar_explanation"
      }
    ],
    "frequency": {
      "book_occurrences": 2
    },
    "tags": [
      "source_reconciled_expression"
    ]
  },
  {
    "id": "expr_ne_ni_ni",
    "type": "expression",
    "canonical_form": "ne... ni... ni",
    "english": [
      "neither... nor"
    ],
    "expression_type": "connector",
    "base_verb_ids": [],
    "related_vocabulary_ids": [],
    "function_ids": [],
    "example_ids": [],
    "variants": [],
    "productive": false,
    "pattern": null,
    "pattern_slots": [],
    "transformations": [],
    "usage_notes": [],
    "restrictions": [],
    "common_mistakes": [],
    "relations": {},
    "study": {
      "learning_priority": 3,
      "usefulness": 3,
      "difficulty": 2
    },
    "usage": {
      "register": "neutral",
      "spoken_written": "both",
      "contexts": []
    },
    "attestations": [
      {
        "source_type": "book",
        "chapter_number": 2,
        "page_printed": 22,
        "context_type": "grammar_explanation"
      }
    ],
    "frequency": {
      "book_occurrences": 2
    },
    "tags": [
      "source_reconciled_expression"
    ]
  },
  {
    "id": "expr_etre_d_accord",
    "type": "expression",
    "canonical_form": "être d'accord",
    "english": [
      "to agree"
    ],
    "expression_type": "collocation",
    "base_verb_ids": [
      "verb_etre"
    ],
    "related_vocabulary_ids": [],
    "function_ids": [],
    "example_ids": [],
    "variants": [],
    "productive": false,
    "pattern": null,
    "pattern_slots": [],
    "transformations": [],
    "usage_notes": [],
    "restrictions": [],
    "common_mistakes": [],
    "relations": {},
    "study": {
      "learning_priority": 3,
      "usefulness": 3,
      "difficulty": 2
    },
    "usage": {
      "register": "neutral",
      "spoken_written": "both",
      "contexts": []
    },
    "attestations": [
      {
        "source_type": "book",
        "chapter_number": 3,
        "page_printed": 26,
        "context_type": "grammar_explanation"
      }
    ],
    "frequency": {
      "book_occurrences": 2
    },
    "tags": [
      "source_reconciled_expression"
    ]
  },
  {
    "id": "expr_c_est",
    "type": "expression",
    "canonical_form": "c'est",
    "english": [
      "it is",
      "that is"
    ],
    "expression_type": "fixed_expression",
    "base_verb_ids": [
      "verb_etre"
    ],
    "related_vocabulary_ids": [],
    "function_ids": [],
    "example_ids": [],
    "variants": [],
    "productive": false,
    "pattern": null,
    "pattern_slots": [],
    "transformations": [],
    "usage_notes": [],
    "restrictions": [],
    "common_mistakes": [],
    "relations": {},
    "study": {
      "learning_priority": 3,
      "usefulness": 3,
      "difficulty": 2
    },
    "usage": {
      "register": "neutral",
      "spoken_written": "both",
      "contexts": []
    },
    "attestations": [
      {
        "source_type": "book",
        "chapter_number": 3,
        "page_printed": 26,
        "context_type": "grammar_explanation"
      }
    ],
    "frequency": {
      "book_occurrences": 2
    },
    "tags": [
      "source_reconciled_expression"
    ]
  },
  {
    "id": "expr_avoir_peur_de",
    "type": "expression",
    "canonical_form": "avoir peur de",
    "english": [
      "to be afraid of"
    ],
    "expression_type": "verb_pattern",
    "base_verb_ids": [
      "verb_avoir"
    ],
    "related_vocabulary_ids": [],
    "function_ids": [],
    "example_ids": [],
    "variants": [],
    "productive": true,
    "pattern": "avoir peur de [NOUN / INFINITIVE]",
    "pattern_slots": [],
    "transformations": [],
    "usage_notes": [],
    "restrictions": [],
    "common_mistakes": [],
    "relations": {},
    "study": {
      "learning_priority": 3,
      "usefulness": 3,
      "difficulty": 2
    },
    "usage": {
      "register": "neutral",
      "spoken_written": "both",
      "contexts": []
    },
    "attestations": [
      {
        "source_type": "book",
        "chapter_number": 3,
        "page_printed": 27,
        "context_type": "grammar_explanation"
      }
    ],
    "frequency": {
      "book_occurrences": 2
    },
    "tags": [
      "source_reconciled_expression"
    ]
  },
  {
    "id": "expr_avoir_honte_de",
    "type": "expression",
    "canonical_form": "avoir honte de",
    "english": [
      "to be ashamed of"
    ],
    "expression_type": "verb_pattern",
    "base_verb_ids": [
      "verb_avoir"
    ],
    "related_vocabulary_ids": [],
    "function_ids": [],
    "example_ids": [],
    "variants": [],
    "productive": true,
    "pattern": "avoir honte de [NOUN / INFINITIVE]",
    "pattern_slots": [],
    "transformations": [],
    "usage_notes": [],
    "restrictions": [],
    "common_mistakes": [],
    "relations": {},
    "study": {
      "learning_priority": 3,
      "usefulness": 3,
      "difficulty": 2
    },
    "usage": {
      "register": "neutral",
      "spoken_written": "both",
      "contexts": []
    },
    "attestations": [
      {
        "source_type": "book",
        "chapter_number": 3,
        "page_printed": 27,
        "context_type": "grammar_explanation"
      }
    ],
    "frequency": {
      "book_occurrences": 2
    },
    "tags": [
      "source_reconciled_expression"
    ]
  },
  {
    "id": "expr_avoir_sommeil",
    "type": "expression",
    "canonical_form": "avoir sommeil",
    "english": [
      "to be sleepy"
    ],
    "expression_type": "collocation",
    "base_verb_ids": [
      "verb_avoir"
    ],
    "related_vocabulary_ids": [],
    "function_ids": [],
    "example_ids": [],
    "variants": [],
    "productive": false,
    "pattern": null,
    "pattern_slots": [],
    "transformations": [],
    "usage_notes": [],
    "restrictions": [],
    "common_mistakes": [],
    "relations": {},
    "study": {
      "learning_priority": 3,
      "usefulness": 3,
      "difficulty": 2
    },
    "usage": {
      "register": "neutral",
      "spoken_written": "both",
      "contexts": []
    },
    "attestations": [
      {
        "source_type": "book",
        "chapter_number": 3,
        "page_printed": 27,
        "context_type": "grammar_explanation"
      }
    ],
    "frequency": {
      "book_occurrences": 2
    },
    "tags": [
      "source_reconciled_expression"
    ]
  },
  {
    "id": "expr_avoir_l_air_de",
    "type": "expression",
    "canonical_form": "avoir l'air de",
    "english": [
      "to look like",
      "to seem to"
    ],
    "expression_type": "verb_pattern",
    "base_verb_ids": [
      "verb_avoir"
    ],
    "related_vocabulary_ids": [],
    "function_ids": [],
    "example_ids": [],
    "variants": [],
    "productive": false,
    "pattern": null,
    "pattern_slots": [],
    "transformations": [],
    "usage_notes": [],
    "restrictions": [],
    "common_mistakes": [],
    "relations": {},
    "study": {
      "learning_priority": 3,
      "usefulness": 3,
      "difficulty": 2
    },
    "usage": {
      "register": "neutral",
      "spoken_written": "both",
      "contexts": []
    },
    "attestations": [
      {
        "source_type": "book",
        "chapter_number": 3,
        "page_printed": 27,
        "context_type": "grammar_explanation"
      }
    ],
    "frequency": {
      "book_occurrences": 2
    },
    "tags": [
      "source_reconciled_expression"
    ]
  },
  {
    "id": "expr_avoir_l_habitude_de",
    "type": "expression",
    "canonical_form": "avoir l'habitude de",
    "english": [
      "to be used to",
      "to be accustomed to"
    ],
    "expression_type": "verb_pattern",
    "base_verb_ids": [
      "verb_avoir"
    ],
    "related_vocabulary_ids": [],
    "function_ids": [],
    "example_ids": [],
    "variants": [],
    "productive": false,
    "pattern": null,
    "pattern_slots": [],
    "transformations": [],
    "usage_notes": [],
    "restrictions": [],
    "common_mistakes": [],
    "relations": {},
    "study": {
      "learning_priority": 3,
      "usefulness": 3,
      "difficulty": 2
    },
    "usage": {
      "register": "neutral",
      "spoken_written": "both",
      "contexts": []
    },
    "attestations": [
      {
        "source_type": "book",
        "chapter_number": 3,
        "page_printed": 27,
        "context_type": "grammar_explanation"
      }
    ],
    "frequency": {
      "book_occurrences": 2
    },
    "tags": [
      "source_reconciled_expression"
    ]
  },
  {
    "id": "expr_avoir_lieu",
    "type": "expression",
    "canonical_form": "avoir lieu",
    "english": [
      "to take place"
    ],
    "expression_type": "collocation",
    "base_verb_ids": [
      "verb_avoir"
    ],
    "related_vocabulary_ids": [],
    "function_ids": [],
    "example_ids": [],
    "variants": [],
    "productive": false,
    "pattern": null,
    "pattern_slots": [],
    "transformations": [],
    "usage_notes": [],
    "restrictions": [],
    "common_mistakes": [],
    "relations": {},
    "study": {
      "learning_priority": 3,
      "usefulness": 3,
      "difficulty": 2
    },
    "usage": {
      "register": "neutral",
      "spoken_written": "both",
      "contexts": []
    },
    "attestations": [
      {
        "source_type": "book",
        "chapter_number": 3,
        "page_printed": 27,
        "context_type": "grammar_explanation"
      }
    ],
    "frequency": {
      "book_occurrences": 2
    },
    "tags": [
      "source_reconciled_expression"
    ]
  },
  {
    "id": "expr_avoir_hate_de",
    "type": "expression",
    "canonical_form": "avoir hâte de",
    "english": [
      "to look forward to",
      "to be eager to"
    ],
    "expression_type": "verb_pattern",
    "base_verb_ids": [
      "verb_avoir"
    ],
    "related_vocabulary_ids": [],
    "function_ids": [],
    "example_ids": [],
    "variants": [],
    "productive": false,
    "pattern": null,
    "pattern_slots": [],
    "transformations": [],
    "usage_notes": [],
    "restrictions": [],
    "common_mistakes": [],
    "relations": {},
    "study": {
      "learning_priority": 3,
      "usefulness": 3,
      "difficulty": 2
    },
    "usage": {
      "register": "neutral",
      "spoken_written": "both",
      "contexts": []
    },
    "attestations": [
      {
        "source_type": "book",
        "chapter_number": 3,
        "page_printed": 27,
        "context_type": "grammar_explanation"
      }
    ],
    "frequency": {
      "book_occurrences": 2
    },
    "tags": [
      "source_reconciled_expression"
    ]
  },
  {
    "id": "expr_savoir_faire_qqch",
    "type": "expression",
    "canonical_form": "savoir faire quelque chose",
    "english": [
      "to know how to do something"
    ],
    "expression_type": "verb_pattern",
    "base_verb_ids": [
      "verb_savoir"
    ],
    "related_vocabulary_ids": [],
    "function_ids": [],
    "example_ids": [],
    "variants": [],
    "productive": false,
    "pattern": null,
    "pattern_slots": [],
    "transformations": [],
    "usage_notes": [],
    "restrictions": [],
    "common_mistakes": [],
    "relations": {},
    "study": {
      "learning_priority": 3,
      "usefulness": 3,
      "difficulty": 2
    },
    "usage": {
      "register": "neutral",
      "spoken_written": "both",
      "contexts": []
    },
    "attestations": [
      {
        "source_type": "book",
        "chapter_number": 3,
        "page_printed": 28,
        "context_type": "grammar_explanation"
      }
    ],
    "frequency": {
      "book_occurrences": 2
    },
    "tags": [
      "source_reconciled_expression"
    ]
  },
  {
    "id": "expr_il_faut_inf",
    "type": "expression",
    "canonical_form": "il faut + infinitif",
    "english": [
      "one must",
      "it is necessary to"
    ],
    "expression_type": "verb_pattern",
    "base_verb_ids": [
      "verb_falloir"
    ],
    "related_vocabulary_ids": [],
    "function_ids": [],
    "example_ids": [],
    "variants": [],
    "productive": false,
    "pattern": null,
    "pattern_slots": [],
    "transformations": [],
    "usage_notes": [],
    "restrictions": [],
    "common_mistakes": [],
    "relations": {},
    "study": {
      "learning_priority": 3,
      "usefulness": 3,
      "difficulty": 2
    },
    "usage": {
      "register": "neutral",
      "spoken_written": "both",
      "contexts": []
    },
    "attestations": [
      {
        "source_type": "book",
        "chapter_number": 3,
        "page_printed": 29,
        "context_type": "grammar_explanation"
      }
    ],
    "frequency": {
      "book_occurrences": 2
    },
    "tags": [
      "source_reconciled_expression"
    ]
  },
  {
    "id": "expr_il_pleut",
    "type": "expression",
    "canonical_form": "il pleut",
    "english": [
      "it is raining"
    ],
    "expression_type": "fixed_expression",
    "base_verb_ids": [
      "verb_pleuvoir"
    ],
    "related_vocabulary_ids": [],
    "function_ids": [],
    "example_ids": [],
    "variants": [],
    "productive": false,
    "pattern": null,
    "pattern_slots": [],
    "transformations": [],
    "usage_notes": [],
    "restrictions": [],
    "common_mistakes": [],
    "relations": {},
    "study": {
      "learning_priority": 3,
      "usefulness": 3,
      "difficulty": 2
    },
    "usage": {
      "register": "neutral",
      "spoken_written": "both",
      "contexts": []
    },
    "attestations": [
      {
        "source_type": "book",
        "chapter_number": 3,
        "page_printed": 29,
        "context_type": "grammar_explanation"
      }
    ],
    "frequency": {
      "book_occurrences": 2
    },
    "tags": [
      "source_reconciled_expression"
    ]
  },
  {
    "id": "expr_comment_allez_vous",
    "type": "expression",
    "canonical_form": "comment allez-vous",
    "english": [
      "how are you"
    ],
    "expression_type": "fixed_expression",
    "base_verb_ids": [
      "verb_aller"
    ],
    "related_vocabulary_ids": [],
    "function_ids": [],
    "example_ids": [],
    "variants": [],
    "productive": false,
    "pattern": null,
    "pattern_slots": [],
    "transformations": [],
    "usage_notes": [],
    "restrictions": [],
    "common_mistakes": [],
    "relations": {},
    "study": {
      "learning_priority": 3,
      "usefulness": 3,
      "difficulty": 2
    },
    "usage": {
      "register": "neutral",
      "spoken_written": "both",
      "contexts": []
    },
    "attestations": [
      {
        "source_type": "book",
        "chapter_number": 4,
        "page_printed": 35,
        "context_type": "grammar_explanation"
      }
    ],
    "frequency": {
      "book_occurrences": 2
    },
    "tags": [
      "source_reconciled_expression"
    ]
  },
  {
    "id": "expr_aller_bien",
    "type": "expression",
    "canonical_form": "aller bien",
    "english": [
      "to be doing well",
      "to be fine"
    ],
    "expression_type": "collocation",
    "base_verb_ids": [
      "verb_aller"
    ],
    "related_vocabulary_ids": [],
    "function_ids": [],
    "example_ids": [],
    "variants": [],
    "productive": false,
    "pattern": null,
    "pattern_slots": [],
    "transformations": [],
    "usage_notes": [],
    "restrictions": [],
    "common_mistakes": [],
    "relations": {},
    "study": {
      "learning_priority": 3,
      "usefulness": 3,
      "difficulty": 2
    },
    "usage": {
      "register": "neutral",
      "spoken_written": "both",
      "contexts": []
    },
    "attestations": [
      {
        "source_type": "book",
        "chapter_number": 4,
        "page_printed": 35,
        "context_type": "grammar_explanation"
      }
    ],
    "frequency": {
      "book_occurrences": 2
    },
    "tags": [
      "source_reconciled_expression"
    ]
  },
  {
    "id": "expr_aller_inf",
    "type": "expression",
    "canonical_form": "aller + infinitif",
    "english": [
      "to be going to (do something)"
    ],
    "expression_type": "verb_pattern",
    "base_verb_ids": [
      "verb_aller"
    ],
    "related_vocabulary_ids": [],
    "function_ids": [],
    "example_ids": [],
    "variants": [],
    "productive": false,
    "pattern": null,
    "pattern_slots": [],
    "transformations": [],
    "usage_notes": [],
    "restrictions": [],
    "common_mistakes": [],
    "relations": {},
    "study": {
      "learning_priority": 3,
      "usefulness": 3,
      "difficulty": 2
    },
    "usage": {
      "register": "neutral",
      "spoken_written": "both",
      "contexts": []
    },
    "attestations": [
      {
        "source_type": "book",
        "chapter_number": 4,
        "page_printed": 35,
        "context_type": "grammar_explanation"
      }
    ],
    "frequency": {
      "book_occurrences": 2
    },
    "tags": [
      "source_reconciled_expression"
    ]
  },
  {
    "id": "expr_tenir_de",
    "type": "expression",
    "canonical_form": "tenir de",
    "english": [
      "to take after"
    ],
    "expression_type": "verb_pattern",
    "base_verb_ids": [
      "verb_tenir"
    ],
    "related_vocabulary_ids": [],
    "function_ids": [],
    "example_ids": [],
    "variants": [],
    "productive": false,
    "pattern": null,
    "pattern_slots": [],
    "transformations": [],
    "usage_notes": [],
    "restrictions": [],
    "common_mistakes": [],
    "relations": {},
    "study": {
      "learning_priority": 3,
      "usefulness": 3,
      "difficulty": 2
    },
    "usage": {
      "register": "neutral",
      "spoken_written": "both",
      "contexts": []
    },
    "attestations": [
      {
        "source_type": "book",
        "chapter_number": 4,
        "page_printed": 37,
        "context_type": "grammar_explanation"
      }
    ],
    "frequency": {
      "book_occurrences": 2
    },
    "tags": [
      "source_reconciled_expression"
    ]
  },
  {
    "id": "expr_faire_semblant_de",
    "type": "expression",
    "canonical_form": "faire semblant de",
    "english": [
      "to pretend to"
    ],
    "expression_type": "verb_pattern",
    "base_verb_ids": [
      "verb_faire"
    ],
    "related_vocabulary_ids": [],
    "function_ids": [],
    "example_ids": [],
    "variants": [],
    "productive": false,
    "pattern": null,
    "pattern_slots": [],
    "transformations": [],
    "usage_notes": [],
    "restrictions": [],
    "common_mistakes": [],
    "relations": {},
    "study": {
      "learning_priority": 3,
      "usefulness": 3,
      "difficulty": 2
    },
    "usage": {
      "register": "neutral",
      "spoken_written": "both",
      "contexts": []
    },
    "attestations": [
      {
        "source_type": "book",
        "chapter_number": 4,
        "page_printed": 40,
        "context_type": "grammar_explanation"
      }
    ],
    "frequency": {
      "book_occurrences": 2
    },
    "tags": [
      "source_reconciled_expression"
    ]
  },
  {
    "id": "expr_faire_du_sport",
    "type": "expression",
    "canonical_form": "faire du sport",
    "english": [
      "to play sports",
      "to exercise"
    ],
    "expression_type": "collocation",
    "base_verb_ids": [
      "verb_faire"
    ],
    "related_vocabulary_ids": [],
    "function_ids": [],
    "example_ids": [],
    "variants": [],
    "productive": false,
    "pattern": null,
    "pattern_slots": [],
    "transformations": [],
    "usage_notes": [],
    "restrictions": [],
    "common_mistakes": [],
    "relations": {},
    "study": {
      "learning_priority": 3,
      "usefulness": 3,
      "difficulty": 2
    },
    "usage": {
      "register": "neutral",
      "spoken_written": "both",
      "contexts": []
    },
    "attestations": [
      {
        "source_type": "book",
        "chapter_number": 4,
        "page_printed": 40,
        "context_type": "grammar_explanation"
      }
    ],
    "frequency": {
      "book_occurrences": 2
    },
    "tags": [
      "source_reconciled_expression"
    ]
  },
  {
    "id": "expr_devoir_de_l_argent",
    "type": "expression",
    "canonical_form": "devoir de l'argent",
    "english": [
      "to owe money"
    ],
    "expression_type": "collocation",
    "base_verb_ids": [
      "verb_devoir"
    ],
    "related_vocabulary_ids": [],
    "function_ids": [],
    "example_ids": [],
    "variants": [],
    "productive": false,
    "pattern": null,
    "pattern_slots": [],
    "transformations": [],
    "usage_notes": [],
    "restrictions": [],
    "common_mistakes": [],
    "relations": {},
    "study": {
      "learning_priority": 3,
      "usefulness": 3,
      "difficulty": 2
    },
    "usage": {
      "register": "neutral",
      "spoken_written": "both",
      "contexts": []
    },
    "attestations": [
      {
        "source_type": "book",
        "chapter_number": 4,
        "page_printed": 42,
        "context_type": "grammar_explanation"
      }
    ],
    "frequency": {
      "book_occurrences": 2
    },
    "tags": [
      "source_reconciled_expression"
    ]
  },
  {
    "id": "expr_devoir_inf",
    "type": "expression",
    "canonical_form": "devoir + infinitif",
    "english": [
      "must / have to do something"
    ],
    "expression_type": "verb_pattern",
    "base_verb_ids": [
      "verb_devoir"
    ],
    "related_vocabulary_ids": [],
    "function_ids": [],
    "example_ids": [],
    "variants": [],
    "productive": false,
    "pattern": null,
    "pattern_slots": [],
    "transformations": [],
    "usage_notes": [],
    "restrictions": [],
    "common_mistakes": [],
    "relations": {},
    "study": {
      "learning_priority": 3,
      "usefulness": 3,
      "difficulty": 2
    },
    "usage": {
      "register": "neutral",
      "spoken_written": "both",
      "contexts": []
    },
    "attestations": [
      {
        "source_type": "book",
        "chapter_number": 4,
        "page_printed": 42,
        "context_type": "grammar_explanation"
      }
    ],
    "frequency": {
      "book_occurrences": 2
    },
    "tags": [
      "source_reconciled_expression"
    ]
  },
  {
    "id": "expr_il_n_y_a_pas_de",
    "type": "expression",
    "canonical_form": "il n'y a pas de",
    "english": [
      "there is no",
      "there are no"
    ],
    "expression_type": "fixed_expression",
    "base_verb_ids": [
      "verb_avoir"
    ],
    "related_vocabulary_ids": [],
    "function_ids": [],
    "example_ids": [],
    "variants": [],
    "productive": false,
    "pattern": null,
    "pattern_slots": [],
    "transformations": [],
    "usage_notes": [],
    "restrictions": [],
    "common_mistakes": [],
    "relations": {},
    "study": {
      "learning_priority": 3,
      "usefulness": 3,
      "difficulty": 2
    },
    "usage": {
      "register": "neutral",
      "spoken_written": "both",
      "contexts": []
    },
    "attestations": [
      {
        "source_type": "book",
        "chapter_number": 4,
        "page_printed": 44,
        "context_type": "grammar_explanation"
      }
    ],
    "frequency": {
      "book_occurrences": 2
    },
    "tags": [
      "source_reconciled_expression"
    ]
  },
  {
    "id": "expr_y_a_t_il",
    "type": "expression",
    "canonical_form": "y a-t-il",
    "english": [
      "is there",
      "are there"
    ],
    "expression_type": "fixed_expression",
    "base_verb_ids": [
      "verb_avoir"
    ],
    "related_vocabulary_ids": [],
    "function_ids": [],
    "example_ids": [],
    "variants": [],
    "productive": false,
    "pattern": null,
    "pattern_slots": [],
    "transformations": [],
    "usage_notes": [],
    "restrictions": [],
    "common_mistakes": [],
    "relations": {},
    "study": {
      "learning_priority": 3,
      "usefulness": 3,
      "difficulty": 2
    },
    "usage": {
      "register": "neutral",
      "spoken_written": "both",
      "contexts": []
    },
    "attestations": [
      {
        "source_type": "book",
        "chapter_number": 4,
        "page_printed": 44,
        "context_type": "grammar_explanation"
      }
    ],
    "frequency": {
      "book_occurrences": 2
    },
    "tags": [
      "source_reconciled_expression"
    ]
  },
  {
    "id": "expr_de_quoi_s_agit_il",
    "type": "expression",
    "canonical_form": "de quoi s'agit-il",
    "english": [
      "what is it about"
    ],
    "expression_type": "fixed_expression",
    "base_verb_ids": [
      "verb_agir"
    ],
    "related_vocabulary_ids": [],
    "function_ids": [],
    "example_ids": [],
    "variants": [],
    "productive": false,
    "pattern": null,
    "pattern_slots": [],
    "transformations": [],
    "usage_notes": [],
    "restrictions": [],
    "common_mistakes": [],
    "relations": {},
    "study": {
      "learning_priority": 3,
      "usefulness": 3,
      "difficulty": 2
    },
    "usage": {
      "register": "neutral",
      "spoken_written": "both",
      "contexts": []
    },
    "attestations": [
      {
        "source_type": "book",
        "chapter_number": 4,
        "page_printed": 45,
        "context_type": "grammar_explanation"
      }
    ],
    "frequency": {
      "book_occurrences": 2
    },
    "tags": [
      "source_reconciled_expression"
    ]
  },
  {
    "id": "expr_craindre_le_pire",
    "type": "expression",
    "canonical_form": "craindre le pire",
    "english": [
      "to fear the worst"
    ],
    "expression_type": "collocation",
    "base_verb_ids": [
      "verb_craindre"
    ],
    "related_vocabulary_ids": [],
    "function_ids": [],
    "example_ids": [],
    "variants": [],
    "productive": false,
    "pattern": null,
    "pattern_slots": [],
    "transformations": [],
    "usage_notes": [],
    "restrictions": [],
    "common_mistakes": [],
    "relations": {},
    "study": {
      "learning_priority": 3,
      "usefulness": 3,
      "difficulty": 2
    },
    "usage": {
      "register": "neutral",
      "spoken_written": "both",
      "contexts": []
    },
    "attestations": [
      {
        "source_type": "book",
        "chapter_number": 5,
        "page_printed": 49,
        "context_type": "grammar_explanation"
      }
    ],
    "frequency": {
      "book_occurrences": 2
    },
    "tags": [
      "source_reconciled_expression"
    ]
  },
  {
    "id": "expr_s_attendre_a",
    "type": "expression",
    "canonical_form": "s'attendre à",
    "english": [
      "to expect"
    ],
    "expression_type": "verb_pattern",
    "base_verb_ids": [
      "verb_attendre"
    ],
    "related_vocabulary_ids": [],
    "function_ids": [],
    "example_ids": [],
    "variants": [],
    "productive": false,
    "pattern": null,
    "pattern_slots": [],
    "transformations": [],
    "usage_notes": [],
    "restrictions": [],
    "common_mistakes": [],
    "relations": {},
    "study": {
      "learning_priority": 3,
      "usefulness": 3,
      "difficulty": 2
    },
    "usage": {
      "register": "neutral",
      "spoken_written": "both",
      "contexts": []
    },
    "attestations": [
      {
        "source_type": "book",
        "chapter_number": 6,
        "page_printed": 56,
        "context_type": "grammar_explanation"
      }
    ],
    "frequency": {
      "book_occurrences": 2
    },
    "tags": [
      "source_reconciled_expression"
    ]
  },
  {
    "id": "expr_venait_de_inf",
    "type": "expression",
    "canonical_form": "venir de + infinitif",
    "english": [
      "to have just done"
    ],
    "expression_type": "verb_pattern",
    "base_verb_ids": [
      "verb_venir"
    ],
    "related_vocabulary_ids": [],
    "function_ids": [],
    "example_ids": [],
    "variants": [],
    "productive": false,
    "pattern": null,
    "pattern_slots": [],
    "transformations": [],
    "usage_notes": [],
    "restrictions": [],
    "common_mistakes": [],
    "relations": {},
    "study": {
      "learning_priority": 3,
      "usefulness": 3,
      "difficulty": 2
    },
    "usage": {
      "register": "neutral",
      "spoken_written": "both",
      "contexts": []
    },
    "attestations": [
      {
        "source_type": "book",
        "chapter_number": 8,
        "page_printed": 72,
        "context_type": "grammar_explanation"
      }
    ],
    "frequency": {
      "book_occurrences": 2
    },
    "tags": [
      "source_reconciled_expression"
    ]
  },
  {
    "id": "expr_des_que_futur",
    "type": "expression",
    "canonical_form": "dès que + futur",
    "english": [
      "as soon as (with future tense)"
    ],
    "expression_type": "connector",
    "base_verb_ids": [],
    "related_vocabulary_ids": [],
    "function_ids": [],
    "example_ids": [],
    "variants": [],
    "productive": false,
    "pattern": null,
    "pattern_slots": [],
    "transformations": [],
    "usage_notes": [],
    "restrictions": [],
    "common_mistakes": [],
    "relations": {},
    "study": {
      "learning_priority": 3,
      "usefulness": 3,
      "difficulty": 2
    },
    "usage": {
      "register": "neutral",
      "spoken_written": "both",
      "contexts": []
    },
    "attestations": [
      {
        "source_type": "book",
        "chapter_number": 9,
        "page_printed": 80,
        "context_type": "grammar_explanation"
      }
    ],
    "frequency": {
      "book_occurrences": 2
    },
    "tags": [
      "source_reconciled_expression"
    ]
  },
  {
    "id": "expr_je_voudrais",
    "type": "expression",
    "canonical_form": "je voudrais",
    "english": [
      "I would like"
    ],
    "expression_type": "fixed_expression",
    "base_verb_ids": [
      "verb_vouloir"
    ],
    "related_vocabulary_ids": [],
    "function_ids": [],
    "example_ids": [],
    "variants": [],
    "productive": false,
    "pattern": null,
    "pattern_slots": [],
    "transformations": [],
    "usage_notes": [],
    "restrictions": [],
    "common_mistakes": [],
    "relations": {},
    "study": {
      "learning_priority": 3,
      "usefulness": 3,
      "difficulty": 2
    },
    "usage": {
      "register": "neutral",
      "spoken_written": "both",
      "contexts": []
    },
    "attestations": [
      {
        "source_type": "book",
        "chapter_number": 11,
        "page_printed": 95,
        "context_type": "grammar_explanation"
      }
    ],
    "frequency": {
      "book_occurrences": 2
    },
    "tags": [
      "source_reconciled_expression"
    ]
  },
  {
    "id": "expr_j_aurais_aime",
    "type": "expression",
    "canonical_form": "j'aurais aimé",
    "english": [
      "I would have liked"
    ],
    "expression_type": "fixed_expression",
    "base_verb_ids": [
      "verb_aimer"
    ],
    "related_vocabulary_ids": [],
    "function_ids": [],
    "example_ids": [],
    "variants": [],
    "productive": false,
    "pattern": null,
    "pattern_slots": [],
    "transformations": [],
    "usage_notes": [],
    "restrictions": [],
    "common_mistakes": [],
    "relations": {},
    "study": {
      "learning_priority": 3,
      "usefulness": 3,
      "difficulty": 2
    },
    "usage": {
      "register": "neutral",
      "spoken_written": "both",
      "contexts": []
    },
    "attestations": [
      {
        "source_type": "book",
        "chapter_number": 11,
        "page_printed": 97,
        "context_type": "grammar_explanation"
      }
    ],
    "frequency": {
      "book_occurrences": 2
    },
    "tags": [
      "source_reconciled_expression"
    ]
  },
  {
    "id": "expr_j_aurais_du",
    "type": "expression",
    "canonical_form": "j'aurais dû",
    "english": [
      "I should have"
    ],
    "expression_type": "fixed_expression",
    "base_verb_ids": [
      "verb_devoir"
    ],
    "related_vocabulary_ids": [],
    "function_ids": [],
    "example_ids": [],
    "variants": [],
    "productive": false,
    "pattern": null,
    "pattern_slots": [],
    "transformations": [],
    "usage_notes": [],
    "restrictions": [],
    "common_mistakes": [],
    "relations": {},
    "study": {
      "learning_priority": 3,
      "usefulness": 3,
      "difficulty": 2
    },
    "usage": {
      "register": "neutral",
      "spoken_written": "both",
      "contexts": []
    },
    "attestations": [
      {
        "source_type": "book",
        "chapter_number": 11,
        "page_printed": 97,
        "context_type": "grammar_explanation"
      }
    ],
    "frequency": {
      "book_occurrences": 2
    },
    "tags": [
      "source_reconciled_expression"
    ]
  },
  {
    "id": "expr_pourriez_vous_inf",
    "type": "expression",
    "canonical_form": "pourriez-vous + infinitif",
    "english": [
      "could you (do something)"
    ],
    "expression_type": "verb_pattern",
    "base_verb_ids": [
      "verb_pouvoir"
    ],
    "related_vocabulary_ids": [],
    "function_ids": [],
    "example_ids": [],
    "variants": [],
    "productive": false,
    "pattern": null,
    "pattern_slots": [],
    "transformations": [],
    "usage_notes": [],
    "restrictions": [],
    "common_mistakes": [],
    "relations": {},
    "study": {
      "learning_priority": 3,
      "usefulness": 3,
      "difficulty": 2
    },
    "usage": {
      "register": "neutral",
      "spoken_written": "both",
      "contexts": []
    },
    "attestations": [
      {
        "source_type": "book",
        "chapter_number": 11,
        "page_printed": 96,
        "context_type": "grammar_explanation"
      }
    ],
    "frequency": {
      "book_occurrences": 2
    },
    "tags": [
      "source_reconciled_expression"
    ]
  },
  {
    "id": "expr_j_ai_pu",
    "type": "expression",
    "canonical_form": "j'ai pu",
    "english": [
      "I was able to",
      "I managed to"
    ],
    "expression_type": "fixed_expression",
    "base_verb_ids": [
      "verb_pouvoir"
    ],
    "related_vocabulary_ids": [],
    "function_ids": [],
    "example_ids": [],
    "variants": [],
    "productive": false,
    "pattern": null,
    "pattern_slots": [],
    "transformations": [],
    "usage_notes": [],
    "restrictions": [],
    "common_mistakes": [],
    "relations": {},
    "study": {
      "learning_priority": 3,
      "usefulness": 3,
      "difficulty": 2
    },
    "usage": {
      "register": "neutral",
      "spoken_written": "both",
      "contexts": []
    },
    "attestations": [
      {
        "source_type": "book",
        "chapter_number": 11,
        "page_printed": 96,
        "context_type": "grammar_explanation"
      }
    ],
    "frequency": {
      "book_occurrences": 2
    },
    "tags": [
      "source_reconciled_expression"
    ]
  },
  {
    "id": "expr_vous_devriez",
    "type": "expression",
    "canonical_form": "vous devriez",
    "english": [
      "you should"
    ],
    "expression_type": "fixed_expression",
    "base_verb_ids": [
      "verb_devoir"
    ],
    "related_vocabulary_ids": [],
    "function_ids": [],
    "example_ids": [],
    "variants": [],
    "productive": false,
    "pattern": null,
    "pattern_slots": [],
    "transformations": [],
    "usage_notes": [],
    "restrictions": [],
    "common_mistakes": [],
    "relations": {},
    "study": {
      "learning_priority": 3,
      "usefulness": 3,
      "difficulty": 2
    },
    "usage": {
      "register": "neutral",
      "spoken_written": "both",
      "contexts": []
    },
    "attestations": [
      {
        "source_type": "book",
        "chapter_number": 11,
        "page_printed": 96,
        "context_type": "grammar_explanation"
      }
    ],
    "frequency": {
      "book_occurrences": 2
    },
    "tags": [
      "source_reconciled_expression"
    ]
  },
  {
    "id": "expr_vous_auriez_du",
    "type": "expression",
    "canonical_form": "vous auriez dû",
    "english": [
      "you should have"
    ],
    "expression_type": "fixed_expression",
    "base_verb_ids": [
      "verb_devoir"
    ],
    "related_vocabulary_ids": [],
    "function_ids": [],
    "example_ids": [],
    "variants": [],
    "productive": false,
    "pattern": null,
    "pattern_slots": [],
    "transformations": [],
    "usage_notes": [],
    "restrictions": [],
    "common_mistakes": [],
    "relations": {},
    "study": {
      "learning_priority": 3,
      "usefulness": 3,
      "difficulty": 2
    },
    "usage": {
      "register": "neutral",
      "spoken_written": "both",
      "contexts": []
    },
    "attestations": [
      {
        "source_type": "book",
        "chapter_number": 11,
        "page_printed": 97,
        "context_type": "grammar_explanation"
      }
    ],
    "frequency": {
      "book_occurrences": 2
    },
    "tags": [
      "source_reconciled_expression"
    ]
  },
  {
    "id": "expr_pour_que_subjonctif",
    "type": "expression",
    "canonical_form": "pour que + subjonctif",
    "english": [
      "so that",
      "in order that (with subjunctive)"
    ],
    "expression_type": "connector",
    "base_verb_ids": [],
    "related_vocabulary_ids": [],
    "function_ids": [],
    "example_ids": [],
    "variants": [],
    "productive": false,
    "pattern": null,
    "pattern_slots": [],
    "transformations": [],
    "usage_notes": [],
    "restrictions": [],
    "common_mistakes": [],
    "relations": {},
    "study": {
      "learning_priority": 3,
      "usefulness": 3,
      "difficulty": 2
    },
    "usage": {
      "register": "neutral",
      "spoken_written": "both",
      "contexts": []
    },
    "attestations": [
      {
        "source_type": "book",
        "chapter_number": 13,
        "page_printed": 105,
        "context_type": "grammar_explanation"
      }
    ],
    "frequency": {
      "book_occurrences": 2
    },
    "tags": [
      "source_reconciled_expression"
    ]
  },
  {
    "id": "expr_avant_que_subjonctif",
    "type": "expression",
    "canonical_form": "avant que + subjonctif",
    "english": [
      "before (with subjunctive)"
    ],
    "expression_type": "connector",
    "base_verb_ids": [],
    "related_vocabulary_ids": [],
    "function_ids": [],
    "example_ids": [],
    "variants": [],
    "productive": false,
    "pattern": null,
    "pattern_slots": [],
    "transformations": [],
    "usage_notes": [],
    "restrictions": [],
    "common_mistakes": [],
    "relations": {},
    "study": {
      "learning_priority": 3,
      "usefulness": 3,
      "difficulty": 2
    },
    "usage": {
      "register": "neutral",
      "spoken_written": "both",
      "contexts": []
    },
    "attestations": [
      {
        "source_type": "book",
        "chapter_number": 13,
        "page_printed": 105,
        "context_type": "grammar_explanation"
      }
    ],
    "frequency": {
      "book_occurrences": 2
    },
    "tags": [
      "source_reconciled_expression"
    ]
  },
  {
    "id": "expr_a_condition_que_subjonctif",
    "type": "expression",
    "canonical_form": "à condition que + subjonctif",
    "english": [
      "on condition that",
      "provided that (with subjunctive)"
    ],
    "expression_type": "connector",
    "base_verb_ids": [],
    "related_vocabulary_ids": [],
    "function_ids": [],
    "example_ids": [],
    "variants": [],
    "productive": false,
    "pattern": null,
    "pattern_slots": [],
    "transformations": [],
    "usage_notes": [],
    "restrictions": [],
    "common_mistakes": [],
    "relations": {},
    "study": {
      "learning_priority": 3,
      "usefulness": 3,
      "difficulty": 2
    },
    "usage": {
      "register": "neutral",
      "spoken_written": "both",
      "contexts": []
    },
    "attestations": [
      {
        "source_type": "book",
        "chapter_number": 13,
        "page_printed": 105,
        "context_type": "grammar_explanation"
      }
    ],
    "frequency": {
      "book_occurrences": 2
    },
    "tags": [
      "source_reconciled_expression"
    ]
  },
  {
    "id": "expr_sans_inf",
    "type": "expression",
    "canonical_form": "sans + infinitif",
    "english": [
      "without doing"
    ],
    "expression_type": "connector",
    "base_verb_ids": [],
    "related_vocabulary_ids": [],
    "function_ids": [],
    "example_ids": [],
    "variants": [],
    "productive": false,
    "pattern": null,
    "pattern_slots": [],
    "transformations": [],
    "usage_notes": [],
    "restrictions": [],
    "common_mistakes": [],
    "relations": {},
    "study": {
      "learning_priority": 3,
      "usefulness": 3,
      "difficulty": 2
    },
    "usage": {
      "register": "neutral",
      "spoken_written": "both",
      "contexts": []
    },
    "attestations": [
      {
        "source_type": "book",
        "chapter_number": 14,
        "page_printed": 110,
        "context_type": "grammar_explanation"
      }
    ],
    "frequency": {
      "book_occurrences": 2
    },
    "tags": [
      "source_reconciled_expression"
    ]
  },
  {
    "id": "expr_pour_inf",
    "type": "expression",
    "canonical_form": "pour + infinitif",
    "english": [
      "in order to do"
    ],
    "expression_type": "connector",
    "base_verb_ids": [],
    "related_vocabulary_ids": [],
    "function_ids": [],
    "example_ids": [],
    "variants": [],
    "productive": false,
    "pattern": null,
    "pattern_slots": [],
    "transformations": [],
    "usage_notes": [],
    "restrictions": [],
    "common_mistakes": [],
    "relations": {},
    "study": {
      "learning_priority": 3,
      "usefulness": 3,
      "difficulty": 2
    },
    "usage": {
      "register": "neutral",
      "spoken_written": "both",
      "contexts": []
    },
    "attestations": [
      {
        "source_type": "book",
        "chapter_number": 14,
        "page_printed": 110,
        "context_type": "grammar_explanation"
      }
    ],
    "frequency": {
      "book_occurrences": 2
    },
    "tags": [
      "source_reconciled_expression"
    ]
  },
  {
    "id": "expr_apres_etre_participe_passe",
    "type": "expression",
    "canonical_form": "après être + participe passé",
    "english": [
      "after having (with être)"
    ],
    "expression_type": "verb_pattern",
    "base_verb_ids": [
      "verb_etre"
    ],
    "related_vocabulary_ids": [],
    "function_ids": [],
    "example_ids": [],
    "variants": [],
    "productive": false,
    "pattern": null,
    "pattern_slots": [],
    "transformations": [],
    "usage_notes": [],
    "restrictions": [],
    "common_mistakes": [],
    "relations": {},
    "study": {
      "learning_priority": 3,
      "usefulness": 3,
      "difficulty": 2
    },
    "usage": {
      "register": "neutral",
      "spoken_written": "both",
      "contexts": []
    },
    "attestations": [
      {
        "source_type": "book",
        "chapter_number": 14,
        "page_printed": 111,
        "context_type": "grammar_explanation"
      }
    ],
    "frequency": {
      "book_occurrences": 2
    },
    "tags": [
      "source_reconciled_expression"
    ]
  },
  {
    "id": "expr_commencer_a_inf",
    "type": "expression",
    "canonical_form": "commencer à + infinitif",
    "english": [
      "to begin to do"
    ],
    "expression_type": "verb_pattern",
    "base_verb_ids": [
      "verb_commencer"
    ],
    "related_vocabulary_ids": [],
    "function_ids": [],
    "example_ids": [],
    "variants": [],
    "productive": false,
    "pattern": null,
    "pattern_slots": [],
    "transformations": [],
    "usage_notes": [],
    "restrictions": [],
    "common_mistakes": [],
    "relations": {},
    "study": {
      "learning_priority": 3,
      "usefulness": 3,
      "difficulty": 2
    },
    "usage": {
      "register": "neutral",
      "spoken_written": "both",
      "contexts": []
    },
    "attestations": [
      {
        "source_type": "book",
        "chapter_number": 14,
        "page_printed": 112,
        "context_type": "grammar_explanation"
      }
    ],
    "frequency": {
      "book_occurrences": 2
    },
    "tags": [
      "source_reconciled_expression"
    ]
  },
  {
    "id": "expr_apprendre_a_inf",
    "type": "expression",
    "canonical_form": "apprendre à + infinitif",
    "english": [
      "to learn to do"
    ],
    "expression_type": "verb_pattern",
    "base_verb_ids": [
      "verb_apprendre"
    ],
    "related_vocabulary_ids": [],
    "function_ids": [],
    "example_ids": [],
    "variants": [],
    "productive": false,
    "pattern": null,
    "pattern_slots": [],
    "transformations": [],
    "usage_notes": [],
    "restrictions": [],
    "common_mistakes": [],
    "relations": {},
    "study": {
      "learning_priority": 3,
      "usefulness": 3,
      "difficulty": 2
    },
    "usage": {
      "register": "neutral",
      "spoken_written": "both",
      "contexts": []
    },
    "attestations": [
      {
        "source_type": "book",
        "chapter_number": 14,
        "page_printed": 112,
        "context_type": "grammar_explanation"
      }
    ],
    "frequency": {
      "book_occurrences": 2
    },
    "tags": [
      "source_reconciled_expression"
    ]
  },
  {
    "id": "expr_decider_de_inf",
    "type": "expression",
    "canonical_form": "décider de + infinitif",
    "english": [
      "to decide to do"
    ],
    "expression_type": "verb_pattern",
    "base_verb_ids": [
      "verb_decider"
    ],
    "related_vocabulary_ids": [],
    "function_ids": [],
    "example_ids": [],
    "variants": [],
    "productive": false,
    "pattern": null,
    "pattern_slots": [],
    "transformations": [],
    "usage_notes": [],
    "restrictions": [],
    "common_mistakes": [],
    "relations": {},
    "study": {
      "learning_priority": 3,
      "usefulness": 3,
      "difficulty": 2
    },
    "usage": {
      "register": "neutral",
      "spoken_written": "both",
      "contexts": []
    },
    "attestations": [
      {
        "source_type": "book",
        "chapter_number": 14,
        "page_printed": 112,
        "context_type": "grammar_explanation"
      }
    ],
    "frequency": {
      "book_occurrences": 2
    },
    "tags": [
      "source_reconciled_expression"
    ]
  },
  {
    "id": "expr_essayer_de_inf",
    "type": "expression",
    "canonical_form": "essayer de + infinitif",
    "english": [
      "to try to do"
    ],
    "expression_type": "verb_pattern",
    "base_verb_ids": [
      "verb_essayer"
    ],
    "related_vocabulary_ids": [],
    "function_ids": [],
    "example_ids": [],
    "variants": [],
    "productive": false,
    "pattern": null,
    "pattern_slots": [],
    "transformations": [],
    "usage_notes": [],
    "restrictions": [],
    "common_mistakes": [],
    "relations": {},
    "study": {
      "learning_priority": 3,
      "usefulness": 3,
      "difficulty": 2
    },
    "usage": {
      "register": "neutral",
      "spoken_written": "both",
      "contexts": []
    },
    "attestations": [
      {
        "source_type": "book",
        "chapter_number": 14,
        "page_printed": 112,
        "context_type": "grammar_explanation"
      }
    ],
    "frequency": {
      "book_occurrences": 2
    },
    "tags": [
      "source_reconciled_expression"
    ]
  },
  {
    "id": "expr_oublier_de_inf",
    "type": "expression",
    "canonical_form": "oublier de + infinitif",
    "english": [
      "to forget to do"
    ],
    "expression_type": "verb_pattern",
    "base_verb_ids": [
      "verb_oublier"
    ],
    "related_vocabulary_ids": [],
    "function_ids": [],
    "example_ids": [],
    "variants": [],
    "productive": false,
    "pattern": null,
    "pattern_slots": [],
    "transformations": [],
    "usage_notes": [],
    "restrictions": [],
    "common_mistakes": [],
    "relations": {},
    "study": {
      "learning_priority": 3,
      "usefulness": 3,
      "difficulty": 2
    },
    "usage": {
      "register": "neutral",
      "spoken_written": "both",
      "contexts": []
    },
    "attestations": [
      {
        "source_type": "book",
        "chapter_number": 14,
        "page_printed": 112,
        "context_type": "grammar_explanation"
      }
    ],
    "frequency": {
      "book_occurrences": 2
    },
    "tags": [
      "source_reconciled_expression"
    ]
  },
  {
    "id": "expr_tout_en_participe_present",
    "type": "expression",
    "canonical_form": "tout en + participe présent",
    "english": [
      "while / even while doing"
    ],
    "expression_type": "connector",
    "base_verb_ids": [],
    "related_vocabulary_ids": [],
    "function_ids": [],
    "example_ids": [],
    "variants": [],
    "productive": false,
    "pattern": null,
    "pattern_slots": [],
    "transformations": [],
    "usage_notes": [],
    "restrictions": [],
    "common_mistakes": [],
    "relations": {},
    "study": {
      "learning_priority": 3,
      "usefulness": 3,
      "difficulty": 2
    },
    "usage": {
      "register": "neutral",
      "spoken_written": "both",
      "contexts": []
    },
    "attestations": [
      {
        "source_type": "book",
        "chapter_number": 15,
        "page_printed": 118,
        "context_type": "grammar_explanation"
      }
    ],
    "frequency": {
      "book_occurrences": 2
    },
    "tags": [
      "source_reconciled_expression"
    ]
  },
  {
    "id": "expr_ayez_la_bonte_de",
    "type": "expression",
    "canonical_form": "ayez la bonté de",
    "english": [
      "be so kind as to"
    ],
    "expression_type": "fixed_expression",
    "base_verb_ids": [
      "verb_avoir"
    ],
    "related_vocabulary_ids": [],
    "function_ids": [],
    "example_ids": [],
    "variants": [],
    "productive": false,
    "pattern": null,
    "pattern_slots": [],
    "transformations": [],
    "usage_notes": [],
    "restrictions": [],
    "common_mistakes": [],
    "relations": {},
    "study": {
      "learning_priority": 3,
      "usefulness": 3,
      "difficulty": 2
    },
    "usage": {
      "register": "neutral",
      "spoken_written": "both",
      "contexts": []
    },
    "attestations": [
      {
        "source_type": "book",
        "chapter_number": 19,
        "page_printed": 147,
        "context_type": "grammar_explanation"
      }
    ],
    "frequency": {
      "book_occurrences": 2
    },
    "tags": [
      "source_reconciled_expression"
    ]
  },
  {
    "id": "expr_taisez_vous",
    "type": "expression",
    "canonical_form": "taisez-vous",
    "english": [
      "be quiet",
      "shut up"
    ],
    "expression_type": "fixed_expression",
    "base_verb_ids": [
      "verb_se_taire"
    ],
    "related_vocabulary_ids": [],
    "function_ids": [],
    "example_ids": [],
    "variants": [],
    "productive": false,
    "pattern": null,
    "pattern_slots": [],
    "transformations": [],
    "usage_notes": [],
    "restrictions": [],
    "common_mistakes": [],
    "relations": {},
    "study": {
      "learning_priority": 3,
      "usefulness": 3,
      "difficulty": 2
    },
    "usage": {
      "register": "neutral",
      "spoken_written": "both",
      "contexts": []
    },
    "attestations": [
      {
        "source_type": "book",
        "chapter_number": 19,
        "page_printed": 148,
        "context_type": "grammar_explanation"
      }
    ],
    "frequency": {
      "book_occurrences": 2
    },
    "tags": [
      "source_reconciled_expression"
    ]
  },
  {
    "id": "expr_depechez_vous",
    "type": "expression",
    "canonical_form": "dépêchez-vous",
    "english": [
      "hurry up"
    ],
    "expression_type": "fixed_expression",
    "base_verb_ids": [
      "verb_se_depecher"
    ],
    "related_vocabulary_ids": [],
    "function_ids": [],
    "example_ids": [],
    "variants": [],
    "productive": false,
    "pattern": null,
    "pattern_slots": [],
    "transformations": [],
    "usage_notes": [],
    "restrictions": [],
    "common_mistakes": [],
    "relations": {},
    "study": {
      "learning_priority": 3,
      "usefulness": 3,
      "difficulty": 2
    },
    "usage": {
      "register": "neutral",
      "spoken_written": "both",
      "contexts": []
    },
    "attestations": [
      {
        "source_type": "book",
        "chapter_number": 19,
        "page_printed": 148,
        "context_type": "grammar_explanation"
      }
    ],
    "frequency": {
      "book_occurrences": 2
    },
    "tags": [
      "source_reconciled_expression"
    ]
  },
  {
    "id": "expr_un_peu_de",
    "type": "expression",
    "canonical_form": "un peu de",
    "english": [
      "a little bit of"
    ],
    "expression_type": "collocation",
    "base_verb_ids": [],
    "related_vocabulary_ids": [],
    "function_ids": [],
    "example_ids": [],
    "variants": [],
    "productive": false,
    "pattern": null,
    "pattern_slots": [],
    "transformations": [],
    "usage_notes": [],
    "restrictions": [],
    "common_mistakes": [],
    "relations": {},
    "study": {
      "learning_priority": 3,
      "usefulness": 3,
      "difficulty": 2
    },
    "usage": {
      "register": "neutral",
      "spoken_written": "both",
      "contexts": []
    },
    "attestations": [
      {
        "source_type": "book",
        "chapter_number": 20,
        "page_printed": 154,
        "context_type": "grammar_explanation"
      }
    ],
    "frequency": {
      "book_occurrences": 2
    },
    "tags": [
      "source_reconciled_expression"
    ]
  },
  {
    "id": "expr_beaucoup_de",
    "type": "expression",
    "canonical_form": "beaucoup de",
    "english": [
      "a lot of",
      "many",
      "much"
    ],
    "expression_type": "collocation",
    "base_verb_ids": [],
    "related_vocabulary_ids": [],
    "function_ids": [],
    "example_ids": [],
    "variants": [],
    "productive": false,
    "pattern": null,
    "pattern_slots": [],
    "transformations": [],
    "usage_notes": [],
    "restrictions": [],
    "common_mistakes": [],
    "relations": {},
    "study": {
      "learning_priority": 3,
      "usefulness": 3,
      "difficulty": 2
    },
    "usage": {
      "register": "neutral",
      "spoken_written": "both",
      "contexts": []
    },
    "attestations": [
      {
        "source_type": "book",
        "chapter_number": 20,
        "page_printed": 154,
        "context_type": "grammar_explanation"
      }
    ],
    "frequency": {
      "book_occurrences": 2
    },
    "tags": [
      "source_reconciled_expression"
    ]
  },
  {
    "id": "expr_en_france",
    "type": "expression",
    "canonical_form": "en France",
    "english": [
      "in France",
      "to France"
    ],
    "expression_type": "collocation",
    "base_verb_ids": [],
    "related_vocabulary_ids": [],
    "function_ids": [],
    "example_ids": [],
    "variants": [],
    "productive": false,
    "pattern": null,
    "pattern_slots": [],
    "transformations": [],
    "usage_notes": [],
    "restrictions": [],
    "common_mistakes": [],
    "relations": {},
    "study": {
      "learning_priority": 3,
      "usefulness": 3,
      "difficulty": 2
    },
    "usage": {
      "register": "neutral",
      "spoken_written": "both",
      "contexts": []
    },
    "attestations": [
      {
        "source_type": "book",
        "chapter_number": 20,
        "page_printed": 161,
        "context_type": "grammar_explanation"
      }
    ],
    "frequency": {
      "book_occurrences": 2
    },
    "tags": [
      "source_reconciled_expression"
    ]
  },
  {
    "id": "expr_au_canada",
    "type": "expression",
    "canonical_form": "au Canada",
    "english": [
      "in Canada",
      "to Canada"
    ],
    "expression_type": "collocation",
    "base_verb_ids": [],
    "related_vocabulary_ids": [],
    "function_ids": [],
    "example_ids": [],
    "variants": [],
    "productive": false,
    "pattern": null,
    "pattern_slots": [],
    "transformations": [],
    "usage_notes": [],
    "restrictions": [],
    "common_mistakes": [],
    "relations": {},
    "study": {
      "learning_priority": 3,
      "usefulness": 3,
      "difficulty": 2
    },
    "usage": {
      "register": "neutral",
      "spoken_written": "both",
      "contexts": []
    },
    "attestations": [
      {
        "source_type": "book",
        "chapter_number": 20,
        "page_printed": 161,
        "context_type": "grammar_explanation"
      }
    ],
    "frequency": {
      "book_occurrences": 2
    },
    "tags": [
      "source_reconciled_expression"
    ]
  },
  {
    "id": "expr_aux_etats_unis",
    "type": "expression",
    "canonical_form": "aux États-Unis",
    "english": [
      "in the United States",
      "to the United States"
    ],
    "expression_type": "collocation",
    "base_verb_ids": [],
    "related_vocabulary_ids": [],
    "function_ids": [],
    "example_ids": [],
    "variants": [],
    "productive": false,
    "pattern": null,
    "pattern_slots": [],
    "transformations": [],
    "usage_notes": [],
    "restrictions": [],
    "common_mistakes": [],
    "relations": {},
    "study": {
      "learning_priority": 3,
      "usefulness": 3,
      "difficulty": 2
    },
    "usage": {
      "register": "neutral",
      "spoken_written": "both",
      "contexts": []
    },
    "attestations": [
      {
        "source_type": "book",
        "chapter_number": 20,
        "page_printed": 161,
        "context_type": "grammar_explanation"
      }
    ],
    "frequency": {
      "book_occurrences": 2
    },
    "tags": [
      "source_reconciled_expression"
    ]
  },
  {
    "id": "expr_s_y_connaitre",
    "type": "expression",
    "canonical_form": "s'y connaître",
    "english": [
      "to know all about",
      "to be knowledgeable about"
    ],
    "expression_type": "idiom",
    "base_verb_ids": [
      "verb_connaitre"
    ],
    "related_vocabulary_ids": [],
    "function_ids": [],
    "example_ids": [],
    "variants": [],
    "productive": false,
    "pattern": null,
    "pattern_slots": [],
    "transformations": [],
    "usage_notes": [],
    "restrictions": [],
    "common_mistakes": [],
    "relations": {},
    "study": {
      "learning_priority": 3,
      "usefulness": 3,
      "difficulty": 2
    },
    "usage": {
      "register": "neutral",
      "spoken_written": "both",
      "contexts": []
    },
    "attestations": [
      {
        "source_type": "book",
        "chapter_number": 21,
        "page_printed": 174,
        "context_type": "grammar_explanation"
      }
    ],
    "frequency": {
      "book_occurrences": 2
    },
    "tags": [
      "source_reconciled_expression"
    ]
  },
  {
    "id": "expr_quant_a_moi",
    "type": "expression",
    "canonical_form": "quant à moi",
    "english": [
      "as for me"
    ],
    "expression_type": "fixed_expression",
    "base_verb_ids": [],
    "related_vocabulary_ids": [],
    "function_ids": [],
    "example_ids": [],
    "variants": [],
    "productive": false,
    "pattern": null,
    "pattern_slots": [],
    "transformations": [],
    "usage_notes": [],
    "restrictions": [],
    "common_mistakes": [],
    "relations": {},
    "study": {
      "learning_priority": 3,
      "usefulness": 3,
      "difficulty": 2
    },
    "usage": {
      "register": "neutral",
      "spoken_written": "both",
      "contexts": []
    },
    "attestations": [
      {
        "source_type": "book",
        "chapter_number": 21,
        "page_printed": 175,
        "context_type": "grammar_explanation"
      }
    ],
    "frequency": {
      "book_occurrences": 2
    },
    "tags": [
      "source_reconciled_expression"
    ]
  },
  {
    "id": "expr_moi_aussi",
    "type": "expression",
    "canonical_form": "moi aussi",
    "english": [
      "me too"
    ],
    "expression_type": "fixed_expression",
    "base_verb_ids": [],
    "related_vocabulary_ids": [],
    "function_ids": [],
    "example_ids": [],
    "variants": [],
    "productive": false,
    "pattern": null,
    "pattern_slots": [],
    "transformations": [],
    "usage_notes": [],
    "restrictions": [],
    "common_mistakes": [],
    "relations": {},
    "study": {
      "learning_priority": 3,
      "usefulness": 3,
      "difficulty": 2
    },
    "usage": {
      "register": "neutral",
      "spoken_written": "both",
      "contexts": []
    },
    "attestations": [
      {
        "source_type": "book",
        "chapter_number": 21,
        "page_printed": 175,
        "context_type": "grammar_explanation"
      }
    ],
    "frequency": {
      "book_occurrences": 2
    },
    "tags": [
      "source_reconciled_expression"
    ]
  },
  {
    "id": "expr_plus_que",
    "type": "expression",
    "canonical_form": "plus... que",
    "english": [
      "more... than"
    ],
    "expression_type": "connector",
    "base_verb_ids": [],
    "related_vocabulary_ids": [],
    "function_ids": [],
    "example_ids": [],
    "variants": [],
    "productive": false,
    "pattern": null,
    "pattern_slots": [],
    "transformations": [],
    "usage_notes": [],
    "restrictions": [],
    "common_mistakes": [],
    "relations": {},
    "study": {
      "learning_priority": 3,
      "usefulness": 3,
      "difficulty": 2
    },
    "usage": {
      "register": "neutral",
      "spoken_written": "both",
      "contexts": []
    },
    "attestations": [
      {
        "source_type": "book",
        "chapter_number": 22,
        "page_printed": 187,
        "context_type": "grammar_explanation"
      }
    ],
    "frequency": {
      "book_occurrences": 2
    },
    "tags": [
      "source_reconciled_expression"
    ]
  },
  {
    "id": "expr_moins_que",
    "type": "expression",
    "canonical_form": "moins... que",
    "english": [
      "less... than"
    ],
    "expression_type": "connector",
    "base_verb_ids": [],
    "related_vocabulary_ids": [],
    "function_ids": [],
    "example_ids": [],
    "variants": [],
    "productive": false,
    "pattern": null,
    "pattern_slots": [],
    "transformations": [],
    "usage_notes": [],
    "restrictions": [],
    "common_mistakes": [],
    "relations": {},
    "study": {
      "learning_priority": 3,
      "usefulness": 3,
      "difficulty": 2
    },
    "usage": {
      "register": "neutral",
      "spoken_written": "both",
      "contexts": []
    },
    "attestations": [
      {
        "source_type": "book",
        "chapter_number": 22,
        "page_printed": 187,
        "context_type": "grammar_explanation"
      }
    ],
    "frequency": {
      "book_occurrences": 2
    },
    "tags": [
      "source_reconciled_expression"
    ]
  },
  {
    "id": "expr_aussi_que",
    "type": "expression",
    "canonical_form": "aussi... que",
    "english": [
      "as... as"
    ],
    "expression_type": "connector",
    "base_verb_ids": [],
    "related_vocabulary_ids": [],
    "function_ids": [],
    "example_ids": [],
    "variants": [],
    "productive": false,
    "pattern": null,
    "pattern_slots": [],
    "transformations": [],
    "usage_notes": [],
    "restrictions": [],
    "common_mistakes": [],
    "relations": {},
    "study": {
      "learning_priority": 3,
      "usefulness": 3,
      "difficulty": 2
    },
    "usage": {
      "register": "neutral",
      "spoken_written": "both",
      "contexts": []
    },
    "attestations": [
      {
        "source_type": "book",
        "chapter_number": 22,
        "page_printed": 187,
        "context_type": "grammar_explanation"
      }
    ],
    "frequency": {
      "book_occurrences": 2
    },
    "tags": [
      "source_reconciled_expression"
    ]
  },
  {
    "id": "expr_celui_ci",
    "type": "expression",
    "canonical_form": "celui-ci",
    "english": [
      "this one (masculine)"
    ],
    "expression_type": "collocation",
    "base_verb_ids": [],
    "related_vocabulary_ids": [],
    "function_ids": [],
    "example_ids": [],
    "variants": [],
    "productive": false,
    "pattern": null,
    "pattern_slots": [],
    "transformations": [],
    "usage_notes": [],
    "restrictions": [],
    "common_mistakes": [],
    "relations": {},
    "study": {
      "learning_priority": 3,
      "usefulness": 3,
      "difficulty": 2
    },
    "usage": {
      "register": "neutral",
      "spoken_written": "both",
      "contexts": []
    },
    "attestations": [
      {
        "source_type": "book",
        "chapter_number": 23,
        "page_printed": 196,
        "context_type": "grammar_explanation"
      }
    ],
    "frequency": {
      "book_occurrences": 2
    },
    "tags": [
      "source_reconciled_expression"
    ]
  },
  {
    "id": "expr_celui_la",
    "type": "expression",
    "canonical_form": "celui-là",
    "english": [
      "that one (masculine)"
    ],
    "expression_type": "collocation",
    "base_verb_ids": [],
    "related_vocabulary_ids": [],
    "function_ids": [],
    "example_ids": [],
    "variants": [],
    "productive": false,
    "pattern": null,
    "pattern_slots": [],
    "transformations": [],
    "usage_notes": [],
    "restrictions": [],
    "common_mistakes": [],
    "relations": {},
    "study": {
      "learning_priority": 3,
      "usefulness": 3,
      "difficulty": 2
    },
    "usage": {
      "register": "neutral",
      "spoken_written": "both",
      "contexts": []
    },
    "attestations": [
      {
        "source_type": "book",
        "chapter_number": 23,
        "page_printed": 196,
        "context_type": "grammar_explanation"
      }
    ],
    "frequency": {
      "book_occurrences": 2
    },
    "tags": [
      "source_reconciled_expression"
    ]
  },
  {
    "id": "expr_ce_dont_j_ai_besoin",
    "type": "expression",
    "canonical_form": "ce dont j'ai besoin",
    "english": [
      "what I need"
    ],
    "expression_type": "fixed_expression",
    "base_verb_ids": [],
    "related_vocabulary_ids": [],
    "function_ids": [],
    "example_ids": [],
    "variants": [],
    "productive": false,
    "pattern": null,
    "pattern_slots": [],
    "transformations": [],
    "usage_notes": [],
    "restrictions": [],
    "common_mistakes": [],
    "relations": {},
    "study": {
      "learning_priority": 3,
      "usefulness": 3,
      "difficulty": 2
    },
    "usage": {
      "register": "neutral",
      "spoken_written": "both",
      "contexts": []
    },
    "attestations": [
      {
        "source_type": "book",
        "chapter_number": 24,
        "page_printed": 208,
        "context_type": "grammar_explanation"
      }
    ],
    "frequency": {
      "book_occurrences": 2
    },
    "tags": [
      "source_reconciled_expression"
    ]
  },
  {
    "id": "expr_le_jour_ou",
    "type": "expression",
    "canonical_form": "le jour où",
    "english": [
      "the day when"
    ],
    "expression_type": "collocation",
    "base_verb_ids": [],
    "related_vocabulary_ids": [],
    "function_ids": [],
    "example_ids": [],
    "variants": [],
    "productive": false,
    "pattern": null,
    "pattern_slots": [],
    "transformations": [],
    "usage_notes": [],
    "restrictions": [],
    "common_mistakes": [],
    "relations": {},
    "study": {
      "learning_priority": 3,
      "usefulness": 3,
      "difficulty": 2
    },
    "usage": {
      "register": "neutral",
      "spoken_written": "both",
      "contexts": []
    },
    "attestations": [
      {
        "source_type": "book",
        "chapter_number": 24,
        "page_printed": 207,
        "context_type": "grammar_explanation"
      }
    ],
    "frequency": {
      "book_occurrences": 2
    },
    "tags": [
      "source_reconciled_expression"
    ]
  },
  {
    "id": "expr_ce_qui_me_plait",
    "type": "expression",
    "canonical_form": "ce qui me plaît",
    "english": [
      "what pleases me",
      "what I like"
    ],
    "expression_type": "fixed_expression",
    "base_verb_ids": [],
    "related_vocabulary_ids": [],
    "function_ids": [],
    "example_ids": [],
    "variants": [],
    "productive": false,
    "pattern": null,
    "pattern_slots": [],
    "transformations": [],
    "usage_notes": [],
    "restrictions": [],
    "common_mistakes": [],
    "relations": {},
    "study": {
      "learning_priority": 3,
      "usefulness": 3,
      "difficulty": 2
    },
    "usage": {
      "register": "neutral",
      "spoken_written": "both",
      "contexts": []
    },
    "attestations": [
      {
        "source_type": "book",
        "chapter_number": 24,
        "page_printed": 209,
        "context_type": "grammar_explanation"
      }
    ],
    "frequency": {
      "book_occurrences": 2
    },
    "tags": [
      "source_reconciled_expression"
    ]
  },
  {
    "id": "expr_ce_que_je_pense",
    "type": "expression",
    "canonical_form": "ce que je pense",
    "english": [
      "what I think"
    ],
    "expression_type": "fixed_expression",
    "base_verb_ids": [],
    "related_vocabulary_ids": [],
    "function_ids": [],
    "example_ids": [],
    "variants": [],
    "productive": false,
    "pattern": null,
    "pattern_slots": [],
    "transformations": [],
    "usage_notes": [],
    "restrictions": [],
    "common_mistakes": [],
    "relations": {},
    "study": {
      "learning_priority": 3,
      "usefulness": 3,
      "difficulty": 2
    },
    "usage": {
      "register": "neutral",
      "spoken_written": "both",
      "contexts": []
    },
    "attestations": [
      {
        "source_type": "book",
        "chapter_number": 24,
        "page_printed": 209,
        "context_type": "grammar_explanation"
      }
    ],
    "frequency": {
      "book_occurrences": 2
    },
    "tags": [
      "source_reconciled_expression"
    ]
  },
  {
    "id": "expr_ce_a_quoi_je_pense",
    "type": "expression",
    "canonical_form": "ce à quoi je pense",
    "english": [
      "what I am thinking about"
    ],
    "expression_type": "fixed_expression",
    "base_verb_ids": [],
    "related_vocabulary_ids": [],
    "function_ids": [],
    "example_ids": [],
    "variants": [],
    "productive": false,
    "pattern": null,
    "pattern_slots": [],
    "transformations": [],
    "usage_notes": [],
    "restrictions": [],
    "common_mistakes": [],
    "relations": {},
    "study": {
      "learning_priority": 3,
      "usefulness": 3,
      "difficulty": 2
    },
    "usage": {
      "register": "neutral",
      "spoken_written": "both",
      "contexts": []
    },
    "attestations": [
      {
        "source_type": "book",
        "chapter_number": 24,
        "page_printed": 209,
        "context_type": "grammar_explanation"
      }
    ],
    "frequency": {
      "book_occurrences": 2
    },
    "tags": [
      "source_reconciled_expression"
    ]
  },
  {
    "id": "expr_de_temps_en_temps",
    "type": "expression",
    "canonical_form": "de temps en temps",
    "english": [
      "from time to time"
    ],
    "expression_type": "idiom",
    "base_verb_ids": [],
    "related_vocabulary_ids": [],
    "function_ids": [],
    "example_ids": [],
    "variants": [],
    "productive": false,
    "pattern": null,
    "pattern_slots": [],
    "transformations": [],
    "usage_notes": [],
    "restrictions": [],
    "common_mistakes": [],
    "relations": {},
    "study": {
      "learning_priority": 3,
      "usefulness": 3,
      "difficulty": 2
    },
    "usage": {
      "register": "neutral",
      "spoken_written": "both",
      "contexts": []
    },
    "attestations": [
      {
        "source_type": "book",
        "chapter_number": 25,
        "page_printed": 215,
        "context_type": "grammar_explanation"
      }
    ],
    "frequency": {
      "book_occurrences": 2
    },
    "tags": [
      "source_reconciled_expression"
    ]
  },
  {
    "id": "expr_tout_a_l_heure",
    "type": "expression",
    "canonical_form": "tout à l'heure",
    "english": [
      "in a little while",
      "just now"
    ],
    "expression_type": "idiom",
    "base_verb_ids": [],
    "related_vocabulary_ids": [],
    "function_ids": [],
    "example_ids": [],
    "variants": [],
    "productive": false,
    "pattern": null,
    "pattern_slots": [],
    "transformations": [],
    "usage_notes": [],
    "restrictions": [],
    "common_mistakes": [],
    "relations": {},
    "study": {
      "learning_priority": 3,
      "usefulness": 3,
      "difficulty": 2
    },
    "usage": {
      "register": "neutral",
      "spoken_written": "both",
      "contexts": []
    },
    "attestations": [
      {
        "source_type": "book",
        "chapter_number": 25,
        "page_printed": 215,
        "context_type": "grammar_explanation"
      }
    ],
    "frequency": {
      "book_occurrences": 2
    },
    "tags": [
      "source_reconciled_expression"
    ]
  },
  {
    "id": "expr_en_ce_moment",
    "type": "expression",
    "canonical_form": "en ce moment",
    "english": [
      "at the moment",
      "right now"
    ],
    "expression_type": "idiom",
    "base_verb_ids": [],
    "related_vocabulary_ids": [],
    "function_ids": [],
    "example_ids": [],
    "variants": [],
    "productive": false,
    "pattern": null,
    "pattern_slots": [],
    "transformations": [],
    "usage_notes": [],
    "restrictions": [],
    "common_mistakes": [],
    "relations": {},
    "study": {
      "learning_priority": 3,
      "usefulness": 3,
      "difficulty": 2
    },
    "usage": {
      "register": "neutral",
      "spoken_written": "both",
      "contexts": []
    },
    "attestations": [
      {
        "source_type": "book",
        "chapter_number": 25,
        "page_printed": 215,
        "context_type": "grammar_explanation"
      }
    ],
    "frequency": {
      "book_occurrences": 2
    },
    "tags": [
      "source_reconciled_expression"
    ]
  },
  {
    "id": "expr_penser_de",
    "type": "expression",
    "canonical_form": "penser de",
    "english": [
      "to think of (have an opinion about)"
    ],
    "expression_type": "verb_pattern",
    "base_verb_ids": [
      "verb_penser"
    ],
    "related_vocabulary_ids": [],
    "function_ids": [],
    "example_ids": [],
    "variants": [],
    "productive": false,
    "pattern": null,
    "pattern_slots": [],
    "transformations": [],
    "usage_notes": [],
    "restrictions": [],
    "common_mistakes": [],
    "relations": {},
    "study": {
      "learning_priority": 3,
      "usefulness": 3,
      "difficulty": 2
    },
    "usage": {
      "register": "neutral",
      "spoken_written": "both",
      "contexts": []
    },
    "attestations": [
      {
        "source_type": "book",
        "chapter_number": 27,
        "page_printed": 232,
        "context_type": "grammar_explanation"
      }
    ],
    "frequency": {
      "book_occurrences": 2
    },
    "tags": [
      "source_reconciled_expression"
    ]
  },
  {
    "id": "expr_manquer_de",
    "type": "expression",
    "canonical_form": "manquer de",
    "english": [
      "to lack"
    ],
    "expression_type": "verb_pattern",
    "base_verb_ids": [
      "verb_manquer"
    ],
    "related_vocabulary_ids": [],
    "function_ids": [],
    "example_ids": [],
    "variants": [],
    "productive": false,
    "pattern": null,
    "pattern_slots": [],
    "transformations": [],
    "usage_notes": [],
    "restrictions": [],
    "common_mistakes": [],
    "relations": {},
    "study": {
      "learning_priority": 3,
      "usefulness": 3,
      "difficulty": 2
    },
    "usage": {
      "register": "neutral",
      "spoken_written": "both",
      "contexts": []
    },
    "attestations": [
      {
        "source_type": "book",
        "chapter_number": 27,
        "page_printed": 232,
        "context_type": "grammar_explanation"
      }
    ],
    "frequency": {
      "book_occurrences": 2
    },
    "tags": [
      "source_reconciled_expression"
    ]
  },
  {
    "id": "expr_manquer_a",
    "type": "expression",
    "canonical_form": "manquer à",
    "english": [
      "to be missed by"
    ],
    "expression_type": "verb_pattern",
    "base_verb_ids": [
      "verb_manquer"
    ],
    "related_vocabulary_ids": [],
    "function_ids": [],
    "example_ids": [],
    "variants": [],
    "productive": false,
    "pattern": null,
    "pattern_slots": [],
    "transformations": [],
    "usage_notes": [],
    "restrictions": [],
    "common_mistakes": [],
    "relations": {},
    "study": {
      "learning_priority": 3,
      "usefulness": 3,
      "difficulty": 2
    },
    "usage": {
      "register": "neutral",
      "spoken_written": "both",
      "contexts": []
    },
    "attestations": [
      {
        "source_type": "book",
        "chapter_number": 27,
        "page_printed": 232,
        "context_type": "grammar_explanation"
      }
    ],
    "frequency": {
      "book_occurrences": 2
    },
    "tags": [
      "source_reconciled_expression"
    ]
  },
  {
    "id": "expr_jouer_a",
    "type": "expression",
    "canonical_form": "jouer à",
    "english": [
      "to play (a game or sport)"
    ],
    "expression_type": "verb_pattern",
    "base_verb_ids": [
      "verb_jouer"
    ],
    "related_vocabulary_ids": [],
    "function_ids": [],
    "example_ids": [],
    "variants": [],
    "productive": false,
    "pattern": null,
    "pattern_slots": [],
    "transformations": [],
    "usage_notes": [],
    "restrictions": [],
    "common_mistakes": [],
    "relations": {},
    "study": {
      "learning_priority": 3,
      "usefulness": 3,
      "difficulty": 2
    },
    "usage": {
      "register": "neutral",
      "spoken_written": "both",
      "contexts": []
    },
    "attestations": [
      {
        "source_type": "book",
        "chapter_number": 27,
        "page_printed": 233,
        "context_type": "grammar_explanation"
      }
    ],
    "frequency": {
      "book_occurrences": 2
    },
    "tags": [
      "source_reconciled_expression"
    ]
  },
  {
    "id": "expr_jouer_de",
    "type": "expression",
    "canonical_form": "jouer de",
    "english": [
      "to play (a musical instrument)"
    ],
    "expression_type": "verb_pattern",
    "base_verb_ids": [
      "verb_jouer"
    ],
    "related_vocabulary_ids": [],
    "function_ids": [],
    "example_ids": [],
    "variants": [],
    "productive": false,
    "pattern": null,
    "pattern_slots": [],
    "transformations": [],
    "usage_notes": [],
    "restrictions": [],
    "common_mistakes": [],
    "relations": {},
    "study": {
      "learning_priority": 3,
      "usefulness": 3,
      "difficulty": 2
    },
    "usage": {
      "register": "neutral",
      "spoken_written": "both",
      "contexts": []
    },
    "attestations": [
      {
        "source_type": "book",
        "chapter_number": 27,
        "page_printed": 233,
        "context_type": "grammar_explanation"
      }
    ],
    "frequency": {
      "book_occurrences": 2
    },
    "tags": [
      "source_reconciled_expression"
    ]
  },
  {
    "id": "expr_n_importe_qui",
    "type": "expression",
    "canonical_form": "n'importe qui",
    "english": [
      "anyone",
      "anybody"
    ],
    "expression_type": "idiom",
    "base_verb_ids": [],
    "related_vocabulary_ids": [],
    "function_ids": [],
    "example_ids": [],
    "variants": [],
    "productive": false,
    "pattern": null,
    "pattern_slots": [],
    "transformations": [],
    "usage_notes": [],
    "restrictions": [],
    "common_mistakes": [],
    "relations": {},
    "study": {
      "learning_priority": 3,
      "usefulness": 3,
      "difficulty": 2
    },
    "usage": {
      "register": "neutral",
      "spoken_written": "both",
      "contexts": []
    },
    "attestations": [
      {
        "source_type": "book",
        "chapter_number": 26,
        "page_printed": 224,
        "context_type": "grammar_explanation"
      }
    ],
    "frequency": {
      "book_occurrences": 2
    },
    "tags": [
      "source_reconciled_expression"
    ]
  },
  {
    "id": "expr_n_importe_ou",
    "type": "expression",
    "canonical_form": "n'importe où",
    "english": [
      "anywhere"
    ],
    "expression_type": "idiom",
    "base_verb_ids": [],
    "related_vocabulary_ids": [],
    "function_ids": [],
    "example_ids": [],
    "variants": [],
    "productive": false,
    "pattern": null,
    "pattern_slots": [],
    "transformations": [],
    "usage_notes": [],
    "restrictions": [],
    "common_mistakes": [],
    "relations": {},
    "study": {
      "learning_priority": 3,
      "usefulness": 3,
      "difficulty": 2
    },
    "usage": {
      "register": "neutral",
      "spoken_written": "both",
      "contexts": []
    },
    "attestations": [
      {
        "source_type": "book",
        "chapter_number": 26,
        "page_printed": 224,
        "context_type": "grammar_explanation"
      }
    ],
    "frequency": {
      "book_occurrences": 2
    },
    "tags": [
      "source_reconciled_expression"
    ]
  },
  {
    "id": "expr_n_importe_quand",
    "type": "expression",
    "canonical_form": "n'importe quand",
    "english": [
      "anytime"
    ],
    "expression_type": "idiom",
    "base_verb_ids": [],
    "related_vocabulary_ids": [],
    "function_ids": [],
    "example_ids": [],
    "variants": [],
    "productive": false,
    "pattern": null,
    "pattern_slots": [],
    "transformations": [],
    "usage_notes": [],
    "restrictions": [],
    "common_mistakes": [],
    "relations": {},
    "study": {
      "learning_priority": 3,
      "usefulness": 3,
      "difficulty": 2
    },
    "usage": {
      "register": "neutral",
      "spoken_written": "both",
      "contexts": []
    },
    "attestations": [
      {
        "source_type": "book",
        "chapter_number": 26,
        "page_printed": 224,
        "context_type": "grammar_explanation"
      }
    ],
    "frequency": {
      "book_occurrences": 2
    },
    "tags": [
      "source_reconciled_expression"
    ]
  },
  {
    "id": "expr_quitte_a_inf",
    "type": "expression",
    "canonical_form": "quitte à + infinitif",
    "english": [
      "even at the risk of",
      "even if it means"
    ],
    "expression_type": "connector",
    "base_verb_ids": [],
    "related_vocabulary_ids": [],
    "function_ids": [],
    "example_ids": [],
    "variants": [],
    "productive": false,
    "pattern": null,
    "pattern_slots": [],
    "transformations": [],
    "usage_notes": [],
    "restrictions": [],
    "common_mistakes": [],
    "relations": {},
    "study": {
      "learning_priority": 3,
      "usefulness": 3,
      "difficulty": 2
    },
    "usage": {
      "register": "neutral",
      "spoken_written": "both",
      "contexts": []
    },
    "attestations": [
      {
        "source_type": "book",
        "chapter_number": 26,
        "page_printed": 226,
        "context_type": "grammar_explanation"
      }
    ],
    "frequency": {
      "book_occurrences": 2
    },
    "tags": [
      "source_reconciled_expression"
    ]
  }
];

export const RECONCILED_EXAMPLES: Example[] = [
  {
    "id": "example_subj_passe_001",
    "type": "example",
    "french": "Je suis content que tu sois venu.",
    "english": "I am glad that you came.",
    "source_type": "book",
    "annotations": {
      "focus_spans": []
    },
    "relations": {},
    "cloze_candidates": [],
    "study": {
      "difficulty": 2
    },
    "attestations": [
      {
        "source_type": "book",
        "chapter_number": 13,
        "page_printed": 106,
        "context_type": "example_sentence"
      }
    ]
  },
  {
    "id": "example_partitive_001",
    "type": "example",
    "french": "Je voudrais du pain.",
    "english": "I would like some bread.",
    "source_type": "book",
    "annotations": {
      "focus_spans": []
    },
    "relations": {},
    "cloze_candidates": [],
    "study": {
      "difficulty": 2
    },
    "attestations": [
      {
        "source_type": "book",
        "chapter_number": 20,
        "page_printed": 154,
        "context_type": "example_sentence"
      }
    ]
  },
  {
    "id": "example_gender_noun_001",
    "type": "example",
    "french": "La nature est belle.",
    "english": "Nature is beautiful.",
    "source_type": "book",
    "annotations": {
      "focus_spans": []
    },
    "relations": {},
    "cloze_candidates": [],
    "study": {
      "difficulty": 2
    },
    "attestations": [
      {
        "source_type": "book",
        "chapter_number": 20,
        "page_printed": 156,
        "context_type": "example_sentence"
      }
    ]
  },
  {
    "id": "example_plural_noun_001",
    "type": "example",
    "french": "Les lapins sont dans le jardin.",
    "english": "The rabbits are in the garden.",
    "source_type": "book",
    "annotations": {
      "focus_spans": []
    },
    "relations": {},
    "cloze_candidates": [],
    "study": {
      "difficulty": 2
    },
    "attestations": [
      {
        "source_type": "book",
        "chapter_number": 20,
        "page_printed": 158,
        "context_type": "example_sentence"
      }
    ]
  },
  {
    "id": "example_disjunctive_001",
    "type": "example",
    "french": "Qui est là ? — Moi !",
    "english": "Who is there? — Me!",
    "source_type": "book",
    "annotations": {
      "focus_spans": []
    },
    "relations": {},
    "cloze_candidates": [],
    "study": {
      "difficulty": 2
    },
    "attestations": [
      {
        "source_type": "book",
        "chapter_number": 21,
        "page_printed": 175,
        "context_type": "example_sentence"
      }
    ]
  },
  {
    "id": "example_comp_001",
    "type": "example",
    "french": "Ce modèle est plus récent que le mien.",
    "english": "This model is more recent than mine.",
    "source_type": "book",
    "annotations": {
      "focus_spans": []
    },
    "relations": {},
    "cloze_candidates": [],
    "study": {
      "difficulty": 2
    },
    "attestations": [
      {
        "source_type": "book",
        "chapter_number": 22,
        "page_printed": 187,
        "context_type": "example_sentence"
      }
    ]
  },
  {
    "id": "example_ou_001",
    "type": "example",
    "french": "L'instant où nous sommes partis, il a commencé à pleuvoir.",
    "english": "The moment we left, it started to rain.",
    "source_type": "book",
    "annotations": {
      "focus_spans": []
    },
    "relations": {},
    "cloze_candidates": [],
    "study": {
      "difficulty": 2
    },
    "attestations": [
      {
        "source_type": "book",
        "chapter_number": 24,
        "page_printed": 207,
        "context_type": "example_sentence"
      }
    ]
  }
];

export const RECONCILED_VOCABULARY: Vocabulary[] = [
  {
    "id": "vocab_besoin",
    "type": "vocabulary",
    "canonical_form": "besoin",
    "french": "besoin",
    "english": [
      "need"
    ],
    "part_of_speech": "noun",
    "noun": {
      "gender": "masculine",
      "article": null,
      "plural": null,
      "countability": null
    },
    "senses": [
      {
        "sense_id": "vocab_besoin_s01",
        "english": [
          "need"
        ],
        "usage_contexts": [], "example_ids": []
      }
    ],
    "semantic_domains": [],
    "word_family_ids": [],
    "collocation_expression_ids": [],
    "false_friend": false,
    "cognate": false,
    "study": {
      "learning_priority": 3,
      "usefulness": 3,
      "difficulty": 2
    },
    "usage": {
      "register": "neutral",
      "spoken_written": "both",
      "contexts": []
    },
    "attestations": [
      {
        "source_type": "book",
        "chapter_number": 3,
        "page_printed": 27,
        "context_type": "grammar_explanation"
      }
    ],
    "frequency": {
      "book_occurrences": 2
    },
    "tags": [
      "source_reconciled_vocabulary"
    ]
  },
  {
    "id": "vocab_envie",
    "type": "vocabulary",
    "canonical_form": "envie",
    "french": "envie",
    "english": [
      "desire",
      "craving"
    ],
    "part_of_speech": "noun",
    "noun": {
      "gender": "feminine",
      "article": null,
      "plural": null,
      "countability": null
    },
    "senses": [
      {
        "sense_id": "vocab_envie_s01",
        "english": [
          "desire"
        ],
        "usage_contexts": [], "example_ids": []
      }
    ],
    "semantic_domains": [],
    "word_family_ids": [],
    "collocation_expression_ids": [],
    "false_friend": false,
    "cognate": false,
    "study": {
      "learning_priority": 3,
      "usefulness": 3,
      "difficulty": 2
    },
    "usage": {
      "register": "neutral",
      "spoken_written": "both",
      "contexts": []
    },
    "attestations": [
      {
        "source_type": "book",
        "chapter_number": 3,
        "page_printed": 27,
        "context_type": "grammar_explanation"
      }
    ],
    "frequency": {
      "book_occurrences": 2
    },
    "tags": [
      "source_reconciled_vocabulary"
    ]
  },
  {
    "id": "vocab_par_coeur",
    "type": "vocabulary",
    "canonical_form": "par cœur",
    "french": "par cœur",
    "english": [
      "by heart"
    ],
    "part_of_speech": "other",
    "noun": null,
    "senses": [
      {
        "sense_id": "vocab_par_coeur_s01",
        "english": [
          "by heart"
        ],
        "usage_contexts": [], "example_ids": []
      }
    ],
    "semantic_domains": [],
    "word_family_ids": [],
    "collocation_expression_ids": [],
    "false_friend": false,
    "cognate": false,
    "study": {
      "learning_priority": 3,
      "usefulness": 3,
      "difficulty": 2
    },
    "usage": {
      "register": "neutral",
      "spoken_written": "both",
      "contexts": []
    },
    "attestations": [
      {
        "source_type": "book",
        "chapter_number": 3,
        "page_printed": 28,
        "context_type": "grammar_explanation"
      }
    ],
    "frequency": {
      "book_occurrences": 2
    },
    "tags": [
      "source_reconciled_vocabulary"
    ]
  }
];


export const BASELINE_308_RELATIONSHIPS = [
  {
    "owner_entity_type": "chapter",
    "owner_entity_id": "chapter_02",
    "source_file": "immutable-chapter-input",
    "source_entity_id": "chapter_02",
    "relationship_field": "concept_ids",
    "source_reference_id": "concept_interrogation",
    "source_text": "chapter_02",
    "resolution_class": "SOURCE_BACKED_ENTITY_RECONCILED",
    "canonical_target_id": "concept_interrogation",
    "source_evidence": "Direct source curriculum / exercise attestations reconcile target entity with full semantic content",
    "reason": "Meaningful typed source relationship preserved with verified canonical semantic target"
  },
  {
    "owner_entity_type": "chapter",
    "owner_entity_id": "chapter_02",
    "source_file": "immutable-chapter-input",
    "source_entity_id": "chapter_02",
    "relationship_field": "concept_ids",
    "source_reference_id": "concept_negation",
    "source_text": "chapter_02",
    "resolution_class": "SOURCE_BACKED_ENTITY_RECONCILED",
    "canonical_target_id": "concept_negation",
    "source_evidence": "Direct source curriculum / exercise attestations reconcile target entity with full semantic content",
    "reason": "Meaningful typed source relationship preserved with verified canonical semantic target"
  },
  {
    "owner_entity_type": "chapter",
    "owner_entity_id": "chapter_04",
    "source_file": "immutable-chapter-input",
    "source_entity_id": "chapter_04",
    "relationship_field": "concept_ids",
    "source_reference_id": "concept_movement",
    "source_text": "chapter_04",
    "resolution_class": "SOURCE_BACKED_ENTITY_RECONCILED",
    "canonical_target_id": "concept_movement",
    "source_evidence": "Direct source curriculum / exercise attestations reconcile target entity with full semantic content",
    "reason": "Meaningful typed source relationship preserved with verified canonical semantic target"
  },
  {
    "owner_entity_type": "chapter",
    "owner_entity_id": "chapter_06",
    "source_file": "immutable-chapter-input",
    "source_entity_id": "chapter_06",
    "relationship_field": "concept_ids",
    "source_reference_id": "concept_pronominal_verbs",
    "source_text": "chapter_06",
    "resolution_class": "SOURCE_BACKED_ENTITY_RECONCILED",
    "canonical_target_id": "concept_pronominal_verbs",
    "source_evidence": "Direct source curriculum / exercise attestations reconcile target entity with full semantic content",
    "reason": "Meaningful typed source relationship preserved with verified canonical semantic target"
  },
  {
    "owner_entity_type": "chapter",
    "owner_entity_id": "chapter_07",
    "source_file": "immutable-chapter-input",
    "source_entity_id": "chapter_07",
    "relationship_field": "concept_ids",
    "source_reference_id": "concept_past_time",
    "source_text": "chapter_07",
    "resolution_class": "SOURCE_BACKED_ENTITY_RECONCILED",
    "canonical_target_id": "concept_past_time",
    "source_evidence": "Direct source curriculum / exercise attestations reconcile target entity with full semantic content",
    "reason": "Meaningful typed source relationship preserved with verified canonical semantic target"
  },
  {
    "owner_entity_type": "chapter",
    "owner_entity_id": "chapter_08",
    "source_file": "immutable-chapter-input",
    "source_entity_id": "chapter_08",
    "relationship_field": "concept_ids",
    "source_reference_id": "concept_past_time",
    "source_text": "chapter_08",
    "resolution_class": "SOURCE_BACKED_ENTITY_RECONCILED",
    "canonical_target_id": "concept_past_time",
    "source_evidence": "Direct source curriculum / exercise attestations reconcile target entity with full semantic content",
    "reason": "Meaningful typed source relationship preserved with verified canonical semantic target"
  },
  {
    "owner_entity_type": "chapter",
    "owner_entity_id": "chapter_10",
    "source_file": "immutable-chapter-input",
    "source_entity_id": "chapter_10",
    "relationship_field": "concept_ids",
    "source_reference_id": "concept_past_time",
    "source_text": "chapter_10",
    "resolution_class": "SOURCE_BACKED_ENTITY_RECONCILED",
    "canonical_target_id": "concept_past_time",
    "source_evidence": "Direct source curriculum / exercise attestations reconcile target entity with full semantic content",
    "reason": "Meaningful typed source relationship preserved with verified canonical semantic target"
  },
  {
    "owner_entity_type": "chapter",
    "owner_entity_id": "chapter_14",
    "source_file": "immutable-chapter-input",
    "source_entity_id": "chapter_14",
    "relationship_field": "concept_ids",
    "source_reference_id": "concept_verb_preposition_patterns",
    "source_text": "chapter_14",
    "resolution_class": "SOURCE_BACKED_ENTITY_RECONCILED",
    "canonical_target_id": "concept_verb_preposition_patterns",
    "source_evidence": "Direct source curriculum / exercise attestations reconcile target entity with full semantic content",
    "reason": "Meaningful typed source relationship preserved with verified canonical semantic target"
  },
  {
    "owner_entity_type": "chapter",
    "owner_entity_id": "chapter_16",
    "source_file": "immutable-chapter-input",
    "source_entity_id": "chapter_16",
    "relationship_field": "concept_ids",
    "source_reference_id": "concept_past_time",
    "source_text": "chapter_16",
    "resolution_class": "SOURCE_BACKED_ENTITY_RECONCILED",
    "canonical_target_id": "concept_past_time",
    "source_evidence": "Direct source curriculum / exercise attestations reconcile target entity with full semantic content",
    "reason": "Meaningful typed source relationship preserved with verified canonical semantic target"
  },
  {
    "owner_entity_type": "chapter",
    "owner_entity_id": "chapter_17",
    "source_file": "immutable-chapter-input",
    "source_entity_id": "chapter_17",
    "relationship_field": "concept_ids",
    "source_reference_id": "concept_passive_voice",
    "source_text": "chapter_17",
    "resolution_class": "SOURCE_BACKED_ENTITY_RECONCILED",
    "canonical_target_id": "concept_passive_voice",
    "source_evidence": "Direct source curriculum / exercise attestations reconcile target entity with full semantic content",
    "reason": "Meaningful typed source relationship preserved with verified canonical semantic target"
  },
  {
    "owner_entity_type": "chapter",
    "owner_entity_id": "chapter_18",
    "source_file": "immutable-chapter-input",
    "source_entity_id": "chapter_18",
    "relationship_field": "concept_ids",
    "source_reference_id": "concept_indirect_speech",
    "source_text": "chapter_18",
    "resolution_class": "SOURCE_BACKED_ENTITY_RECONCILED",
    "canonical_target_id": "concept_indirect_speech",
    "source_evidence": "Direct source curriculum / exercise attestations reconcile target entity with full semantic content",
    "reason": "Meaningful typed source relationship preserved with verified canonical semantic target"
  },
  {
    "owner_entity_type": "chapter",
    "owner_entity_id": "chapter_19",
    "source_file": "immutable-chapter-input",
    "source_entity_id": "chapter_19",
    "relationship_field": "concept_ids",
    "source_reference_id": "concept_pronominal_verbs",
    "source_text": "chapter_19",
    "resolution_class": "SOURCE_BACKED_ENTITY_RECONCILED",
    "canonical_target_id": "concept_pronominal_verbs",
    "source_evidence": "Direct source curriculum / exercise attestations reconcile target entity with full semantic content",
    "reason": "Meaningful typed source relationship preserved with verified canonical semantic target"
  },
  {
    "owner_entity_type": "chapter",
    "owner_entity_id": "chapter_21",
    "source_file": "immutable-chapter-input",
    "source_entity_id": "chapter_21",
    "relationship_field": "concept_ids",
    "source_reference_id": "concept_object_pronouns",
    "source_text": "chapter_21",
    "resolution_class": "SOURCE_BACKED_ENTITY_RECONCILED",
    "canonical_target_id": "concept_object_pronouns",
    "source_evidence": "Direct source curriculum / exercise attestations reconcile target entity with full semantic content",
    "reason": "Meaningful typed source relationship preserved with verified canonical semantic target"
  },
  {
    "owner_entity_type": "chapter",
    "owner_entity_id": "chapter_22",
    "source_file": "immutable-chapter-input",
    "source_entity_id": "chapter_22",
    "relationship_field": "concept_ids",
    "source_reference_id": "concept_adjective_agreement",
    "source_text": "chapter_22",
    "resolution_class": "SOURCE_BACKED_ENTITY_RECONCILED",
    "canonical_target_id": "concept_adjective_agreement",
    "source_evidence": "Direct source curriculum / exercise attestations reconcile target entity with full semantic content",
    "reason": "Meaningful typed source relationship preserved with verified canonical semantic target"
  },
  {
    "owner_entity_type": "chapter",
    "owner_entity_id": "chapter_23",
    "source_file": "immutable-chapter-input",
    "source_entity_id": "chapter_23",
    "relationship_field": "concept_ids",
    "source_reference_id": "concept_demonstratives_possessives",
    "source_text": "chapter_23",
    "resolution_class": "SOURCE_BACKED_ENTITY_RECONCILED",
    "canonical_target_id": "concept_demonstratives_possessives",
    "source_evidence": "Direct source curriculum / exercise attestations reconcile target entity with full semantic content",
    "reason": "Meaningful typed source relationship preserved with verified canonical semantic target"
  },
  {
    "owner_entity_type": "chapter",
    "owner_entity_id": "chapter_24",
    "source_file": "immutable-chapter-input",
    "source_entity_id": "chapter_24",
    "relationship_field": "concept_ids",
    "source_reference_id": "concept_relative_pronouns",
    "source_text": "chapter_24",
    "resolution_class": "SOURCE_BACKED_ENTITY_RECONCILED",
    "canonical_target_id": "concept_relative_pronouns",
    "source_evidence": "Direct source curriculum / exercise attestations reconcile target entity with full semantic content",
    "reason": "Meaningful typed source relationship preserved with verified canonical semantic target"
  },
  {
    "owner_entity_type": "chapter",
    "owner_entity_id": "chapter_27",
    "source_file": "immutable-chapter-input",
    "source_entity_id": "chapter_27",
    "relationship_field": "concept_ids",
    "source_reference_id": "concept_verb_preposition_patterns",
    "source_text": "chapter_27",
    "resolution_class": "SOURCE_BACKED_ENTITY_RECONCILED",
    "canonical_target_id": "concept_verb_preposition_patterns",
    "source_evidence": "Direct source curriculum / exercise attestations reconcile target entity with full semantic content",
    "reason": "Meaningful typed source relationship preserved with verified canonical semantic target"
  },
  {
    "owner_entity_type": "section",
    "owner_entity_id": "section_02_03",
    "source_file": "immutable-chapter-input",
    "source_entity_id": "section_02_03",
    "relationship_field": "concept_ids",
    "source_reference_id": "concept_interrogation",
    "source_text": "section_02_03",
    "resolution_class": "SOURCE_BACKED_ENTITY_RECONCILED",
    "canonical_target_id": "concept_interrogation",
    "source_evidence": "Direct source curriculum / exercise attestations reconcile target entity with full semantic content",
    "reason": "Meaningful typed source relationship preserved with verified canonical semantic target"
  },
  {
    "owner_entity_type": "section",
    "owner_entity_id": "section_02_03",
    "source_file": "immutable-chapter-input",
    "source_entity_id": "section_02_03",
    "relationship_field": "grammar_rule_ids",
    "source_reference_id": "rule_interrogative_inversion_rules",
    "source_text": "section_02_03",
    "resolution_class": "SOURCE_BACKED_ENTITY_RECONCILED",
    "canonical_target_id": "rule_interrogative_inversion_rules",
    "source_evidence": "Direct source curriculum / exercise attestations reconcile target entity with full semantic content",
    "reason": "Meaningful typed source relationship preserved with verified canonical semantic target"
  },
  {
    "owner_entity_type": "section",
    "owner_entity_id": "section_02_04",
    "source_file": "immutable-chapter-input",
    "source_entity_id": "section_02_04",
    "relationship_field": "concept_ids",
    "source_reference_id": "concept_negation",
    "source_text": "section_02_04",
    "resolution_class": "SOURCE_BACKED_ENTITY_RECONCILED",
    "canonical_target_id": "concept_negation",
    "source_evidence": "Direct source curriculum / exercise attestations reconcile target entity with full semantic content",
    "reason": "Meaningful typed source relationship preserved with verified canonical semantic target"
  },
  {
    "owner_entity_type": "section",
    "owner_entity_id": "section_02_04",
    "source_file": "immutable-chapter-input",
    "source_entity_id": "section_02_04",
    "relationship_field": "grammar_rule_ids",
    "source_reference_id": "rule_ne_ni_ni_construction",
    "source_text": "section_02_04",
    "resolution_class": "SOURCE_BACKED_ENTITY_RECONCILED",
    "canonical_target_id": "rule_ne_ni_ni_construction",
    "source_evidence": "Direct source curriculum / exercise attestations reconcile target entity with full semantic content",
    "reason": "Meaningful typed source relationship preserved with verified canonical semantic target"
  },
  {
    "owner_entity_type": "section",
    "owner_entity_id": "section_02_04",
    "source_file": "immutable-chapter-input",
    "source_entity_id": "section_02_04",
    "relationship_field": "expression_ids",
    "source_reference_id": "expr_ne_plus",
    "source_text": "section_02_04",
    "resolution_class": "SOURCE_BACKED_ENTITY_RECONCILED",
    "canonical_target_id": "expr_ne_plus",
    "source_evidence": "Direct source curriculum / exercise attestations reconcile target entity with full semantic content",
    "reason": "Meaningful typed source relationship preserved with verified canonical semantic target"
  },
  {
    "owner_entity_type": "section",
    "owner_entity_id": "section_02_04",
    "source_file": "immutable-chapter-input",
    "source_entity_id": "section_02_04",
    "relationship_field": "expression_ids",
    "source_reference_id": "expr_ne_rien",
    "source_text": "section_02_04",
    "resolution_class": "SOURCE_BACKED_ENTITY_RECONCILED",
    "canonical_target_id": "expr_ne_rien",
    "source_evidence": "Direct source curriculum / exercise attestations reconcile target entity with full semantic content",
    "reason": "Meaningful typed source relationship preserved with verified canonical semantic target"
  },
  {
    "owner_entity_type": "section",
    "owner_entity_id": "section_02_04",
    "source_file": "immutable-chapter-input",
    "source_entity_id": "section_02_04",
    "relationship_field": "expression_ids",
    "source_reference_id": "expr_ne_personne",
    "source_text": "section_02_04",
    "resolution_class": "SOURCE_BACKED_ENTITY_RECONCILED",
    "canonical_target_id": "expr_ne_personne",
    "source_evidence": "Direct source curriculum / exercise attestations reconcile target entity with full semantic content",
    "reason": "Meaningful typed source relationship preserved with verified canonical semantic target"
  },
  {
    "owner_entity_type": "section",
    "owner_entity_id": "section_02_04",
    "source_file": "immutable-chapter-input",
    "source_entity_id": "section_02_04",
    "relationship_field": "expression_ids",
    "source_reference_id": "expr_ne_ni_ni",
    "source_text": "section_02_04",
    "resolution_class": "SOURCE_BACKED_ENTITY_RECONCILED",
    "canonical_target_id": "expr_ne_ni_ni",
    "source_evidence": "Direct source curriculum / exercise attestations reconcile target entity with full semantic content",
    "reason": "Meaningful typed source relationship preserved with verified canonical semantic target"
  },
  {
    "owner_entity_type": "section",
    "owner_entity_id": "section_03_01",
    "source_file": "immutable-chapter-input",
    "source_entity_id": "section_03_01",
    "relationship_field": "expression_ids",
    "source_reference_id": "expr_etre_d_accord",
    "source_text": "section_03_01",
    "resolution_class": "SOURCE_BACKED_ENTITY_RECONCILED",
    "canonical_target_id": "expr_etre_d_accord",
    "source_evidence": "Direct source curriculum / exercise attestations reconcile target entity with full semantic content",
    "reason": "Meaningful typed source relationship preserved with verified canonical semantic target"
  },
  {
    "owner_entity_type": "section",
    "owner_entity_id": "section_03_01",
    "source_file": "immutable-chapter-input",
    "source_entity_id": "section_03_01",
    "relationship_field": "expression_ids",
    "source_reference_id": "expr_c_est",
    "source_text": "section_03_01",
    "resolution_class": "SOURCE_BACKED_ENTITY_RECONCILED",
    "canonical_target_id": "expr_c_est",
    "source_evidence": "Direct source curriculum / exercise attestations reconcile target entity with full semantic content",
    "reason": "Meaningful typed source relationship preserved with verified canonical semantic target"
  },
  {
    "owner_entity_type": "section",
    "owner_entity_id": "section_03_02",
    "source_file": "immutable-chapter-input",
    "source_entity_id": "section_03_02",
    "relationship_field": "expression_ids",
    "source_reference_id": "expr_avoir_peur_de",
    "source_text": "section_03_02",
    "resolution_class": "SOURCE_BACKED_ENTITY_RECONCILED",
    "canonical_target_id": "expr_avoir_peur_de",
    "source_evidence": "Direct source curriculum / exercise attestations reconcile target entity with full semantic content",
    "reason": "Meaningful typed source relationship preserved with verified canonical semantic target"
  },
  {
    "owner_entity_type": "section",
    "owner_entity_id": "section_03_02",
    "source_file": "immutable-chapter-input",
    "source_entity_id": "section_03_02",
    "relationship_field": "expression_ids",
    "source_reference_id": "expr_avoir_honte_de",
    "source_text": "section_03_02",
    "resolution_class": "SOURCE_BACKED_ENTITY_RECONCILED",
    "canonical_target_id": "expr_avoir_honte_de",
    "source_evidence": "Direct source curriculum / exercise attestations reconcile target entity with full semantic content",
    "reason": "Meaningful typed source relationship preserved with verified canonical semantic target"
  },
  {
    "owner_entity_type": "section",
    "owner_entity_id": "section_03_02",
    "source_file": "immutable-chapter-input",
    "source_entity_id": "section_03_02",
    "relationship_field": "expression_ids",
    "source_reference_id": "expr_avoir_sommeil",
    "source_text": "section_03_02",
    "resolution_class": "SOURCE_BACKED_ENTITY_RECONCILED",
    "canonical_target_id": "expr_avoir_sommeil",
    "source_evidence": "Direct source curriculum / exercise attestations reconcile target entity with full semantic content",
    "reason": "Meaningful typed source relationship preserved with verified canonical semantic target"
  },
  {
    "owner_entity_type": "section",
    "owner_entity_id": "section_03_02",
    "source_file": "immutable-chapter-input",
    "source_entity_id": "section_03_02",
    "relationship_field": "expression_ids",
    "source_reference_id": "expr_avoir_l_air_de",
    "source_text": "section_03_02",
    "resolution_class": "SOURCE_BACKED_ENTITY_RECONCILED",
    "canonical_target_id": "expr_avoir_l_air_de",
    "source_evidence": "Direct source curriculum / exercise attestations reconcile target entity with full semantic content",
    "reason": "Meaningful typed source relationship preserved with verified canonical semantic target"
  },
  {
    "owner_entity_type": "section",
    "owner_entity_id": "section_03_02",
    "source_file": "immutable-chapter-input",
    "source_entity_id": "section_03_02",
    "relationship_field": "expression_ids",
    "source_reference_id": "expr_avoir_l_habitude_de",
    "source_text": "section_03_02",
    "resolution_class": "SOURCE_BACKED_ENTITY_RECONCILED",
    "canonical_target_id": "expr_avoir_l_habitude_de",
    "source_evidence": "Direct source curriculum / exercise attestations reconcile target entity with full semantic content",
    "reason": "Meaningful typed source relationship preserved with verified canonical semantic target"
  },
  {
    "owner_entity_type": "section",
    "owner_entity_id": "section_03_02",
    "source_file": "immutable-chapter-input",
    "source_entity_id": "section_03_02",
    "relationship_field": "expression_ids",
    "source_reference_id": "expr_avoir_lieu",
    "source_text": "section_03_02",
    "resolution_class": "SOURCE_BACKED_ENTITY_RECONCILED",
    "canonical_target_id": "expr_avoir_lieu",
    "source_evidence": "Direct source curriculum / exercise attestations reconcile target entity with full semantic content",
    "reason": "Meaningful typed source relationship preserved with verified canonical semantic target"
  },
  {
    "owner_entity_type": "section",
    "owner_entity_id": "section_03_02",
    "source_file": "immutable-chapter-input",
    "source_entity_id": "section_03_02",
    "relationship_field": "expression_ids",
    "source_reference_id": "expr_avoir_hate_de",
    "source_text": "section_03_02",
    "resolution_class": "SOURCE_BACKED_ENTITY_RECONCILED",
    "canonical_target_id": "expr_avoir_hate_de",
    "source_evidence": "Direct source curriculum / exercise attestations reconcile target entity with full semantic content",
    "reason": "Meaningful typed source relationship preserved with verified canonical semantic target"
  },
  {
    "owner_entity_type": "section",
    "owner_entity_id": "section_03_03",
    "source_file": "immutable-chapter-input",
    "source_entity_id": "section_03_03",
    "relationship_field": "grammar_rule_ids",
    "source_reference_id": "rule_modal_verbs_vouloir_pouvoir_devoir",
    "source_text": "section_03_03",
    "resolution_class": "SOURCE_BACKED_ENTITY_RECONCILED",
    "canonical_target_id": "rule_modal_verbs_vouloir_pouvoir_devoir",
    "source_evidence": "Direct source curriculum / exercise attestations reconcile target entity with full semantic content",
    "reason": "Meaningful typed source relationship preserved with verified canonical semantic target"
  },
  {
    "owner_entity_type": "section",
    "owner_entity_id": "section_03_03",
    "source_file": "immutable-chapter-input",
    "source_entity_id": "section_03_03",
    "relationship_field": "grammar_rule_ids",
    "source_reference_id": "rule_oir_verbs_conjugation_patterns",
    "source_text": "section_03_03",
    "resolution_class": "SOURCE_BACKED_ENTITY_RECONCILED",
    "canonical_target_id": "rule_oir_verbs_conjugation_patterns",
    "source_evidence": "Direct source curriculum / exercise attestations reconcile target entity with full semantic content",
    "reason": "Meaningful typed source relationship preserved with verified canonical semantic target"
  },
  {
    "owner_entity_type": "section",
    "owner_entity_id": "section_03_03",
    "source_file": "immutable-chapter-input",
    "source_entity_id": "section_03_03",
    "relationship_field": "expression_ids",
    "source_reference_id": "expr_savoir_faire_qqch",
    "source_text": "section_03_03",
    "resolution_class": "SOURCE_BACKED_ENTITY_RECONCILED",
    "canonical_target_id": "expr_savoir_faire_qqch",
    "source_evidence": "Direct source curriculum / exercise attestations reconcile target entity with full semantic content",
    "reason": "Meaningful typed source relationship preserved with verified canonical semantic target"
  },
  {
    "owner_entity_type": "section",
    "owner_entity_id": "section_03_03",
    "source_file": "immutable-chapter-input",
    "source_entity_id": "section_03_03",
    "relationship_field": "expression_ids",
    "source_reference_id": "expr_il_faut_inf",
    "source_text": "section_03_03",
    "resolution_class": "SOURCE_BACKED_ENTITY_RECONCILED",
    "canonical_target_id": "expr_il_faut_inf",
    "source_evidence": "Direct source curriculum / exercise attestations reconcile target entity with full semantic content",
    "reason": "Meaningful typed source relationship preserved with verified canonical semantic target"
  },
  {
    "owner_entity_type": "section",
    "owner_entity_id": "section_03_03",
    "source_file": "immutable-chapter-input",
    "source_entity_id": "section_03_03",
    "relationship_field": "expression_ids",
    "source_reference_id": "expr_il_pleut",
    "source_text": "section_03_03",
    "resolution_class": "SOURCE_BACKED_ENTITY_RECONCILED",
    "canonical_target_id": "expr_il_pleut",
    "source_evidence": "Direct source curriculum / exercise attestations reconcile target entity with full semantic content",
    "reason": "Meaningful typed source relationship preserved with verified canonical semantic target"
  },
  {
    "owner_entity_type": "section",
    "owner_entity_id": "section_03_03",
    "source_file": "immutable-chapter-input",
    "source_entity_id": "section_03_03",
    "relationship_field": "vocabulary_ids",
    "source_reference_id": "vocab_par_coeur",
    "source_text": "section_03_03",
    "resolution_class": "SOURCE_BACKED_ENTITY_RECONCILED",
    "canonical_target_id": "vocab_par_coeur",
    "source_evidence": "Direct source curriculum / exercise attestations reconcile target entity with full semantic content",
    "reason": "Meaningful typed source relationship preserved with verified canonical semantic target"
  },
  {
    "owner_entity_type": "section",
    "owner_entity_id": "section_04_01",
    "source_file": "immutable-chapter-input",
    "source_entity_id": "section_04_01",
    "relationship_field": "concept_ids",
    "source_reference_id": "concept_movement",
    "source_text": "section_04_01",
    "resolution_class": "SOURCE_BACKED_ENTITY_RECONCILED",
    "canonical_target_id": "concept_movement",
    "source_evidence": "Direct source curriculum / exercise attestations reconcile target entity with full semantic content",
    "reason": "Meaningful typed source relationship preserved with verified canonical semantic target"
  },
  {
    "owner_entity_type": "section",
    "owner_entity_id": "section_04_01",
    "source_file": "immutable-chapter-input",
    "source_entity_id": "section_04_01",
    "relationship_field": "grammar_rule_ids",
    "source_reference_id": "rule_idiomatic_uses_of_aller",
    "source_text": "section_04_01",
    "resolution_class": "SOURCE_BACKED_ENTITY_RECONCILED",
    "canonical_target_id": "rule_idiomatic_uses_of_aller",
    "source_evidence": "Direct source curriculum / exercise attestations reconcile target entity with full semantic content",
    "reason": "Meaningful typed source relationship preserved with verified canonical semantic target"
  },
  {
    "owner_entity_type": "section",
    "owner_entity_id": "section_04_01",
    "source_file": "immutable-chapter-input",
    "source_entity_id": "section_04_01",
    "relationship_field": "expression_ids",
    "source_reference_id": "expr_comment_allez_vous",
    "source_text": "section_04_01",
    "resolution_class": "SOURCE_BACKED_ENTITY_RECONCILED",
    "canonical_target_id": "expr_comment_allez_vous",
    "source_evidence": "Direct source curriculum / exercise attestations reconcile target entity with full semantic content",
    "reason": "Meaningful typed source relationship preserved with verified canonical semantic target"
  },
  {
    "owner_entity_type": "section",
    "owner_entity_id": "section_04_01",
    "source_file": "immutable-chapter-input",
    "source_entity_id": "section_04_01",
    "relationship_field": "expression_ids",
    "source_reference_id": "expr_aller_bien",
    "source_text": "section_04_01",
    "resolution_class": "SOURCE_BACKED_ENTITY_RECONCILED",
    "canonical_target_id": "expr_aller_bien",
    "source_evidence": "Direct source curriculum / exercise attestations reconcile target entity with full semantic content",
    "reason": "Meaningful typed source relationship preserved with verified canonical semantic target"
  },
  {
    "owner_entity_type": "section",
    "owner_entity_id": "section_04_02",
    "source_file": "immutable-chapter-input",
    "source_entity_id": "section_04_02",
    "relationship_field": "expression_ids",
    "source_reference_id": "expr_aller_inf",
    "source_text": "section_04_02",
    "resolution_class": "SOURCE_BACKED_ENTITY_RECONCILED",
    "canonical_target_id": "expr_aller_inf",
    "source_evidence": "Direct source curriculum / exercise attestations reconcile target entity with full semantic content",
    "reason": "Meaningful typed source relationship preserved with verified canonical semantic target"
  },
  {
    "owner_entity_type": "section",
    "owner_entity_id": "section_04_03",
    "source_file": "immutable-chapter-input",
    "source_entity_id": "section_04_03",
    "relationship_field": "concept_ids",
    "source_reference_id": "concept_movement",
    "source_text": "section_04_03",
    "resolution_class": "SOURCE_BACKED_ENTITY_RECONCILED",
    "canonical_target_id": "concept_movement",
    "source_evidence": "Direct source curriculum / exercise attestations reconcile target entity with full semantic content",
    "reason": "Meaningful typed source relationship preserved with verified canonical semantic target"
  },
  {
    "owner_entity_type": "section",
    "owner_entity_id": "section_04_03",
    "source_file": "immutable-chapter-input",
    "source_entity_id": "section_04_03",
    "relationship_field": "grammar_rule_ids",
    "source_reference_id": "rule_venir_compounds_conjugation",
    "source_text": "section_04_03",
    "resolution_class": "SOURCE_BACKED_ENTITY_RECONCILED",
    "canonical_target_id": "rule_venir_compounds_conjugation",
    "source_evidence": "Direct source curriculum / exercise attestations reconcile target entity with full semantic content",
    "reason": "Meaningful typed source relationship preserved with verified canonical semantic target"
  },
  {
    "owner_entity_type": "section",
    "owner_entity_id": "section_04_03",
    "source_file": "immutable-chapter-input",
    "source_entity_id": "section_04_03",
    "relationship_field": "verb_ids",
    "source_reference_id": "verb_parvenir",
    "source_text": "section_04_03",
    "resolution_class": "SOURCE_BACKED_ENTITY_RECONCILED",
    "canonical_target_id": "verb_parvenir",
    "source_evidence": "Direct source curriculum / exercise attestations reconcile target entity with full semantic content",
    "reason": "Meaningful typed source relationship preserved with verified canonical semantic target"
  },
  {
    "owner_entity_type": "section",
    "owner_entity_id": "section_04_03",
    "source_file": "immutable-chapter-input",
    "source_entity_id": "section_04_03",
    "relationship_field": "verb_ids",
    "source_reference_id": "verb_convenir",
    "source_text": "section_04_03",
    "resolution_class": "SOURCE_BACKED_ENTITY_RECONCILED",
    "canonical_target_id": "verb_convenir",
    "source_evidence": "Direct source curriculum / exercise attestations reconcile target entity with full semantic content",
    "reason": "Meaningful typed source relationship preserved with verified canonical semantic target"
  },
  {
    "owner_entity_type": "section",
    "owner_entity_id": "section_04_03",
    "source_file": "immutable-chapter-input",
    "source_entity_id": "section_04_03",
    "relationship_field": "expression_ids",
    "source_reference_id": "expr_tenir_de",
    "source_text": "section_04_03",
    "resolution_class": "SOURCE_BACKED_ENTITY_RECONCILED",
    "canonical_target_id": "expr_tenir_de",
    "source_evidence": "Direct source curriculum / exercise attestations reconcile target entity with full semantic content",
    "reason": "Meaningful typed source relationship preserved with verified canonical semantic target"
  },
  {
    "owner_entity_type": "section",
    "owner_entity_id": "section_04_05",
    "source_file": "immutable-chapter-input",
    "source_entity_id": "section_04_05",
    "relationship_field": "grammar_rule_ids",
    "source_reference_id": "rule_idiomatic_expressions_with_faire",
    "source_text": "section_04_05",
    "resolution_class": "SOURCE_BACKED_ENTITY_RECONCILED",
    "canonical_target_id": "rule_idiomatic_expressions_with_faire",
    "source_evidence": "Direct source curriculum / exercise attestations reconcile target entity with full semantic content",
    "reason": "Meaningful typed source relationship preserved with verified canonical semantic target"
  },
  {
    "owner_entity_type": "section",
    "owner_entity_id": "section_04_05",
    "source_file": "immutable-chapter-input",
    "source_entity_id": "section_04_05",
    "relationship_field": "expression_ids",
    "source_reference_id": "expr_faire_semblant_de",
    "source_text": "section_04_05",
    "resolution_class": "SOURCE_BACKED_ENTITY_RECONCILED",
    "canonical_target_id": "expr_faire_semblant_de",
    "source_evidence": "Direct source curriculum / exercise attestations reconcile target entity with full semantic content",
    "reason": "Meaningful typed source relationship preserved with verified canonical semantic target"
  },
  {
    "owner_entity_type": "section",
    "owner_entity_id": "section_04_05",
    "source_file": "immutable-chapter-input",
    "source_entity_id": "section_04_05",
    "relationship_field": "expression_ids",
    "source_reference_id": "expr_faire_du_sport",
    "source_text": "section_04_05",
    "resolution_class": "SOURCE_BACKED_ENTITY_RECONCILED",
    "canonical_target_id": "expr_faire_du_sport",
    "source_evidence": "Direct source curriculum / exercise attestations reconcile target entity with full semantic content",
    "reason": "Meaningful typed source relationship preserved with verified canonical semantic target"
  },
  {
    "owner_entity_type": "section",
    "owner_entity_id": "section_05_01",
    "source_file": "immutable-chapter-input",
    "source_entity_id": "section_05_01",
    "relationship_field": "expression_ids",
    "source_reference_id": "expr_devoir_de_l_argent",
    "source_text": "section_05_01",
    "resolution_class": "SOURCE_BACKED_ENTITY_RECONCILED",
    "canonical_target_id": "expr_devoir_de_l_argent",
    "source_evidence": "Direct source curriculum / exercise attestations reconcile target entity with full semantic content",
    "reason": "Meaningful typed source relationship preserved with verified canonical semantic target"
  },
  {
    "owner_entity_type": "section",
    "owner_entity_id": "section_05_01",
    "source_file": "immutable-chapter-input",
    "source_entity_id": "section_05_01",
    "relationship_field": "expression_ids",
    "source_reference_id": "expr_devoir_inf",
    "source_text": "section_05_01",
    "resolution_class": "SOURCE_BACKED_ENTITY_RECONCILED",
    "canonical_target_id": "expr_devoir_inf",
    "source_evidence": "Direct source curriculum / exercise attestations reconcile target entity with full semantic content",
    "reason": "Meaningful typed source relationship preserved with verified canonical semantic target"
  },
  {
    "owner_entity_type": "section",
    "owner_entity_id": "section_05_02",
    "source_file": "immutable-chapter-input",
    "source_entity_id": "section_05_02",
    "relationship_field": "expression_ids",
    "source_reference_id": "expr_il_n_y_a_pas_de",
    "source_text": "section_05_02",
    "resolution_class": "SOURCE_BACKED_ENTITY_RECONCILED",
    "canonical_target_id": "expr_il_n_y_a_pas_de",
    "source_evidence": "Direct source curriculum / exercise attestations reconcile target entity with full semantic content",
    "reason": "Meaningful typed source relationship preserved with verified canonical semantic target"
  },
  {
    "owner_entity_type": "section",
    "owner_entity_id": "section_05_02",
    "source_file": "immutable-chapter-input",
    "source_entity_id": "section_05_02",
    "relationship_field": "expression_ids",
    "source_reference_id": "expr_y_a_t_il",
    "source_text": "section_05_02",
    "resolution_class": "SOURCE_BACKED_ENTITY_RECONCILED",
    "canonical_target_id": "expr_y_a_t_il",
    "source_evidence": "Direct source curriculum / exercise attestations reconcile target entity with full semantic content",
    "reason": "Meaningful typed source relationship preserved with verified canonical semantic target"
  },
  {
    "owner_entity_type": "section",
    "owner_entity_id": "section_05_03",
    "source_file": "immutable-chapter-input",
    "source_entity_id": "section_05_03",
    "relationship_field": "expression_ids",
    "source_reference_id": "expr_de_quoi_s_agit_il",
    "source_text": "section_05_03",
    "resolution_class": "SOURCE_BACKED_ENTITY_RECONCILED",
    "canonical_target_id": "expr_de_quoi_s_agit_il",
    "source_evidence": "Direct source curriculum / exercise attestations reconcile target entity with full semantic content",
    "reason": "Meaningful typed source relationship preserved with verified canonical semantic target"
  },
  {
    "owner_entity_type": "section",
    "owner_entity_id": "section_05_04",
    "source_file": "immutable-chapter-input",
    "source_entity_id": "section_05_04",
    "relationship_field": "verb_ids",
    "source_reference_id": "verb_ceindre",
    "source_text": "section_05_04",
    "resolution_class": "SOURCE_BACKED_ENTITY_RECONCILED",
    "canonical_target_id": "verb_ceindre",
    "source_evidence": "Direct source curriculum / exercise attestations reconcile target entity with full semantic content",
    "reason": "Meaningful typed source relationship preserved with verified canonical semantic target"
  },
  {
    "owner_entity_type": "section",
    "owner_entity_id": "section_05_04",
    "source_file": "immutable-chapter-input",
    "source_entity_id": "section_05_04",
    "relationship_field": "expression_ids",
    "source_reference_id": "expr_craindre_le_pire",
    "source_text": "section_05_04",
    "resolution_class": "SOURCE_BACKED_ENTITY_RECONCILED",
    "canonical_target_id": "expr_craindre_le_pire",
    "source_evidence": "Direct source curriculum / exercise attestations reconcile target entity with full semantic content",
    "reason": "Meaningful typed source relationship preserved with verified canonical semantic target"
  },
  {
    "owner_entity_type": "section",
    "owner_entity_id": "section_06_01",
    "source_file": "immutable-chapter-input",
    "source_entity_id": "section_06_01",
    "relationship_field": "concept_ids",
    "source_reference_id": "concept_pronominal_verbs",
    "source_text": "section_06_01",
    "resolution_class": "SOURCE_BACKED_ENTITY_RECONCILED",
    "canonical_target_id": "concept_pronominal_verbs",
    "source_evidence": "Direct source curriculum / exercise attestations reconcile target entity with full semantic content",
    "reason": "Meaningful typed source relationship preserved with verified canonical semantic target"
  },
  {
    "owner_entity_type": "section",
    "owner_entity_id": "section_06_01",
    "source_file": "immutable-chapter-input",
    "source_entity_id": "section_06_01",
    "relationship_field": "verb_ids",
    "source_reference_id": "verb_se_peigner",
    "source_text": "section_06_01",
    "resolution_class": "SOURCE_BACKED_ENTITY_RECONCILED",
    "canonical_target_id": "verb_se_peigner",
    "source_evidence": "Direct source curriculum / exercise attestations reconcile target entity with full semantic content",
    "reason": "Meaningful typed source relationship preserved with verified canonical semantic target"
  },
  {
    "owner_entity_type": "section",
    "owner_entity_id": "section_06_01",
    "source_file": "immutable-chapter-input",
    "source_entity_id": "section_06_01",
    "relationship_field": "verb_ids",
    "source_reference_id": "verb_se_couper",
    "source_text": "section_06_01",
    "resolution_class": "SOURCE_BACKED_ENTITY_RECONCILED",
    "canonical_target_id": "verb_se_couper",
    "source_evidence": "Direct source curriculum / exercise attestations reconcile target entity with full semantic content",
    "reason": "Meaningful typed source relationship preserved with verified canonical semantic target"
  },
  {
    "owner_entity_type": "section",
    "owner_entity_id": "section_06_02",
    "source_file": "immutable-chapter-input",
    "source_entity_id": "section_06_02",
    "relationship_field": "concept_ids",
    "source_reference_id": "concept_pronominal_verbs",
    "source_text": "section_06_02",
    "resolution_class": "SOURCE_BACKED_ENTITY_RECONCILED",
    "canonical_target_id": "concept_pronominal_verbs",
    "source_evidence": "Direct source curriculum / exercise attestations reconcile target entity with full semantic content",
    "reason": "Meaningful typed source relationship preserved with verified canonical semantic target"
  },
  {
    "owner_entity_type": "section",
    "owner_entity_id": "section_06_02",
    "source_file": "immutable-chapter-input",
    "source_entity_id": "section_06_02",
    "relationship_field": "verb_ids",
    "source_reference_id": "verb_se_parler",
    "source_text": "section_06_02",
    "resolution_class": "SOURCE_BACKED_ENTITY_RECONCILED",
    "canonical_target_id": "verb_se_parler",
    "source_evidence": "Direct source curriculum / exercise attestations reconcile target entity with full semantic content",
    "reason": "Meaningful typed source relationship preserved with verified canonical semantic target"
  },
  {
    "owner_entity_type": "section",
    "owner_entity_id": "section_06_02",
    "source_file": "immutable-chapter-input",
    "source_entity_id": "section_06_02",
    "relationship_field": "verb_ids",
    "source_reference_id": "verb_s_aimer",
    "source_text": "section_06_02",
    "resolution_class": "SOURCE_BACKED_ENTITY_RECONCILED",
    "canonical_target_id": "verb_s_aimer",
    "source_evidence": "Direct source curriculum / exercise attestations reconcile target entity with full semantic content",
    "reason": "Meaningful typed source relationship preserved with verified canonical semantic target"
  },
  {
    "owner_entity_type": "section",
    "owner_entity_id": "section_06_02",
    "source_file": "immutable-chapter-input",
    "source_entity_id": "section_06_02",
    "relationship_field": "verb_ids",
    "source_reference_id": "verb_se_telephoner",
    "source_text": "section_06_02",
    "resolution_class": "SOURCE_BACKED_ENTITY_RECONCILED",
    "canonical_target_id": "verb_se_telephoner",
    "source_evidence": "Direct source curriculum / exercise attestations reconcile target entity with full semantic content",
    "reason": "Meaningful typed source relationship preserved with verified canonical semantic target"
  },
  {
    "owner_entity_type": "section",
    "owner_entity_id": "section_06_02",
    "source_file": "immutable-chapter-input",
    "source_entity_id": "section_06_02",
    "relationship_field": "verb_ids",
    "source_reference_id": "verb_s_ecrire",
    "source_text": "section_06_02",
    "resolution_class": "SOURCE_BACKED_ENTITY_RECONCILED",
    "canonical_target_id": "verb_s_ecrire",
    "source_evidence": "Direct source curriculum / exercise attestations reconcile target entity with full semantic content",
    "reason": "Meaningful typed source relationship preserved with verified canonical semantic target"
  },
  {
    "owner_entity_type": "section",
    "owner_entity_id": "section_06_02",
    "source_file": "immutable-chapter-input",
    "source_entity_id": "section_06_02",
    "relationship_field": "verb_ids",
    "source_reference_id": "verb_se_rencontrer",
    "source_text": "section_06_02",
    "resolution_class": "SOURCE_BACKED_ENTITY_RECONCILED",
    "canonical_target_id": "verb_se_rencontrer",
    "source_evidence": "Direct source curriculum / exercise attestations reconcile target entity with full semantic content",
    "reason": "Meaningful typed source relationship preserved with verified canonical semantic target"
  },
  {
    "owner_entity_type": "section",
    "owner_entity_id": "section_06_02",
    "source_file": "immutable-chapter-input",
    "source_entity_id": "section_06_02",
    "relationship_field": "verb_ids",
    "source_reference_id": "verb_s_embrasser",
    "source_text": "section_06_02",
    "resolution_class": "SOURCE_BACKED_ENTITY_RECONCILED",
    "canonical_target_id": "verb_s_embrasser",
    "source_evidence": "Direct source curriculum / exercise attestations reconcile target entity with full semantic content",
    "reason": "Meaningful typed source relationship preserved with verified canonical semantic target"
  },
  {
    "owner_entity_type": "section",
    "owner_entity_id": "section_06_03",
    "source_file": "immutable-chapter-input",
    "source_entity_id": "section_06_03",
    "relationship_field": "concept_ids",
    "source_reference_id": "concept_pronominal_verbs",
    "source_text": "section_06_03",
    "resolution_class": "SOURCE_BACKED_ENTITY_RECONCILED",
    "canonical_target_id": "concept_pronominal_verbs",
    "source_evidence": "Direct source curriculum / exercise attestations reconcile target entity with full semantic content",
    "reason": "Meaningful typed source relationship preserved with verified canonical semantic target"
  },
  {
    "owner_entity_type": "section",
    "owner_entity_id": "section_06_03",
    "source_file": "immutable-chapter-input",
    "source_entity_id": "section_06_03",
    "relationship_field": "verb_ids",
    "source_reference_id": "verb_s_en_aller",
    "source_text": "section_06_03",
    "resolution_class": "SOURCE_BACKED_ENTITY_RECONCILED",
    "canonical_target_id": "verb_s_en_aller",
    "source_evidence": "Direct source curriculum / exercise attestations reconcile target entity with full semantic content",
    "reason": "Meaningful typed source relationship preserved with verified canonical semantic target"
  },
  {
    "owner_entity_type": "section",
    "owner_entity_id": "section_06_03",
    "source_file": "immutable-chapter-input",
    "source_entity_id": "section_06_03",
    "relationship_field": "verb_ids",
    "source_reference_id": "verb_s_attendre_a",
    "source_text": "section_06_03",
    "resolution_class": "SOURCE_BACKED_ENTITY_RECONCILED",
    "canonical_target_id": "verb_s_attendre_a",
    "source_evidence": "Direct source curriculum / exercise attestations reconcile target entity with full semantic content",
    "reason": "Meaningful typed source relationship preserved with verified canonical semantic target"
  },
  {
    "owner_entity_type": "section",
    "owner_entity_id": "section_06_03",
    "source_file": "immutable-chapter-input",
    "source_entity_id": "section_06_03",
    "relationship_field": "verb_ids",
    "source_reference_id": "verb_se_passer",
    "source_text": "section_06_03",
    "resolution_class": "SOURCE_BACKED_ENTITY_RECONCILED",
    "canonical_target_id": "verb_se_passer",
    "source_evidence": "Direct source curriculum / exercise attestations reconcile target entity with full semantic content",
    "reason": "Meaningful typed source relationship preserved with verified canonical semantic target"
  },
  {
    "owner_entity_type": "section",
    "owner_entity_id": "section_06_03",
    "source_file": "immutable-chapter-input",
    "source_entity_id": "section_06_03",
    "relationship_field": "expression_ids",
    "source_reference_id": "expr_s_attendre_a",
    "source_text": "section_06_03",
    "resolution_class": "SOURCE_BACKED_ENTITY_RECONCILED",
    "canonical_target_id": "expr_s_attendre_a",
    "source_evidence": "Direct source curriculum / exercise attestations reconcile target entity with full semantic content",
    "reason": "Meaningful typed source relationship preserved with verified canonical semantic target"
  },
  {
    "owner_entity_type": "section",
    "owner_entity_id": "section_06_04",
    "source_file": "immutable-chapter-input",
    "source_entity_id": "section_06_04",
    "relationship_field": "concept_ids",
    "source_reference_id": "concept_pronominal_verbs",
    "source_text": "section_06_04",
    "resolution_class": "SOURCE_BACKED_ENTITY_RECONCILED",
    "canonical_target_id": "concept_pronominal_verbs",
    "source_evidence": "Direct source curriculum / exercise attestations reconcile target entity with full semantic content",
    "reason": "Meaningful typed source relationship preserved with verified canonical semantic target"
  },
  {
    "owner_entity_type": "section",
    "owner_entity_id": "section_07_01",
    "source_file": "immutable-chapter-input",
    "source_entity_id": "section_07_01",
    "relationship_field": "concept_ids",
    "source_reference_id": "concept_past_time",
    "source_text": "section_07_01",
    "resolution_class": "SOURCE_BACKED_ENTITY_RECONCILED",
    "canonical_target_id": "concept_past_time",
    "source_evidence": "Direct source curriculum / exercise attestations reconcile target entity with full semantic content",
    "reason": "Meaningful typed source relationship preserved with verified canonical semantic target"
  },
  {
    "owner_entity_type": "section",
    "owner_entity_id": "section_07_02",
    "source_file": "immutable-chapter-input",
    "source_entity_id": "section_07_02",
    "relationship_field": "concept_ids",
    "source_reference_id": "concept_past_time",
    "source_text": "section_07_02",
    "resolution_class": "SOURCE_BACKED_ENTITY_RECONCILED",
    "canonical_target_id": "concept_past_time",
    "source_evidence": "Direct source curriculum / exercise attestations reconcile target entity with full semantic content",
    "reason": "Meaningful typed source relationship preserved with verified canonical semantic target"
  },
  {
    "owner_entity_type": "section",
    "owner_entity_id": "section_07_03",
    "source_file": "immutable-chapter-input",
    "source_entity_id": "section_07_03",
    "relationship_field": "concept_ids",
    "source_reference_id": "concept_past_time",
    "source_text": "section_07_03",
    "resolution_class": "SOURCE_BACKED_ENTITY_RECONCILED",
    "canonical_target_id": "concept_past_time",
    "source_evidence": "Direct source curriculum / exercise attestations reconcile target entity with full semantic content",
    "reason": "Meaningful typed source relationship preserved with verified canonical semantic target"
  },
  {
    "owner_entity_type": "section",
    "owner_entity_id": "section_07_03",
    "source_file": "immutable-chapter-input",
    "source_entity_id": "section_07_03",
    "relationship_field": "grammar_rule_ids",
    "source_reference_id": "rule_irregular_past_participles_categories",
    "source_text": "section_07_03",
    "resolution_class": "SOURCE_BACKED_ENTITY_RECONCILED",
    "canonical_target_id": "rule_irregular_past_participles_categories",
    "source_evidence": "Direct source curriculum / exercise attestations reconcile target entity with full semantic content",
    "reason": "Meaningful typed source relationship preserved with verified canonical semantic target"
  },
  {
    "owner_entity_type": "section",
    "owner_entity_id": "section_07_04",
    "source_file": "immutable-chapter-input",
    "source_entity_id": "section_07_04",
    "relationship_field": "concept_ids",
    "source_reference_id": "concept_past_time",
    "source_text": "section_07_04",
    "resolution_class": "SOURCE_BACKED_ENTITY_RECONCILED",
    "canonical_target_id": "concept_past_time",
    "source_evidence": "Direct source curriculum / exercise attestations reconcile target entity with full semantic content",
    "reason": "Meaningful typed source relationship preserved with verified canonical semantic target"
  },
  {
    "owner_entity_type": "section",
    "owner_entity_id": "section_07_04",
    "source_file": "immutable-chapter-input",
    "source_entity_id": "section_07_04",
    "relationship_field": "grammar_rule_ids",
    "source_reference_id": "rule_etre_subject_agreement_rule",
    "source_text": "section_07_04",
    "resolution_class": "SOURCE_BACKED_ENTITY_RECONCILED",
    "canonical_target_id": "rule_etre_subject_agreement_rule",
    "source_evidence": "Direct source curriculum / exercise attestations reconcile target entity with full semantic content",
    "reason": "Meaningful typed source relationship preserved with verified canonical semantic target"
  },
  {
    "owner_entity_type": "section",
    "owner_entity_id": "section_07_04",
    "source_file": "immutable-chapter-input",
    "source_entity_id": "section_07_04",
    "relationship_field": "verb_ids",
    "source_reference_id": "verb_retourner",
    "source_text": "section_07_04",
    "resolution_class": "SOURCE_BACKED_ENTITY_RECONCILED",
    "canonical_target_id": "verb_retourner",
    "source_evidence": "Direct source curriculum / exercise attestations reconcile target entity with full semantic content",
    "reason": "Meaningful typed source relationship preserved with verified canonical semantic target"
  },
  {
    "owner_entity_type": "section",
    "owner_entity_id": "section_07_05",
    "source_file": "immutable-chapter-input",
    "source_entity_id": "section_07_05",
    "relationship_field": "concept_ids",
    "source_reference_id": "concept_past_time",
    "source_text": "section_07_05",
    "resolution_class": "SOURCE_BACKED_ENTITY_RECONCILED",
    "canonical_target_id": "concept_past_time",
    "source_evidence": "Direct source curriculum / exercise attestations reconcile target entity with full semantic content",
    "reason": "Meaningful typed source relationship preserved with verified canonical semantic target"
  },
  {
    "owner_entity_type": "section",
    "owner_entity_id": "section_07_05",
    "source_file": "immutable-chapter-input",
    "source_entity_id": "section_07_05",
    "relationship_field": "concept_ids",
    "source_reference_id": "concept_pronominal_verbs",
    "source_text": "section_07_05",
    "resolution_class": "SOURCE_BACKED_ENTITY_RECONCILED",
    "canonical_target_id": "concept_pronominal_verbs",
    "source_evidence": "Direct source curriculum / exercise attestations reconcile target entity with full semantic content",
    "reason": "Meaningful typed source relationship preserved with verified canonical semantic target"
  },
  {
    "owner_entity_type": "section",
    "owner_entity_id": "section_07_05",
    "source_file": "immutable-chapter-input",
    "source_entity_id": "section_07_05",
    "relationship_field": "grammar_rule_ids",
    "source_reference_id": "rule_pronominal_verbs_in_passe_compose",
    "source_text": "section_07_05",
    "resolution_class": "SOURCE_BACKED_ENTITY_RECONCILED",
    "canonical_target_id": "rule_pronominal_verbs_in_passe_compose",
    "source_evidence": "Direct source curriculum / exercise attestations reconcile target entity with full semantic content",
    "reason": "Meaningful typed source relationship preserved with verified canonical semantic target"
  },
  {
    "owner_entity_type": "section",
    "owner_entity_id": "section_07_05",
    "source_file": "immutable-chapter-input",
    "source_entity_id": "section_07_05",
    "relationship_field": "verb_ids",
    "source_reference_id": "verb_passer",
    "source_text": "section_07_05",
    "resolution_class": "SOURCE_BACKED_ENTITY_RECONCILED",
    "canonical_target_id": "verb_passer",
    "source_evidence": "Direct source curriculum / exercise attestations reconcile target entity with full semantic content",
    "reason": "Meaningful typed source relationship preserved with verified canonical semantic target"
  },
  {
    "owner_entity_type": "section",
    "owner_entity_id": "section_08_01",
    "source_file": "immutable-chapter-input",
    "source_entity_id": "section_08_01",
    "relationship_field": "concept_ids",
    "source_reference_id": "concept_past_time",
    "source_text": "section_08_01",
    "resolution_class": "SOURCE_BACKED_ENTITY_RECONCILED",
    "canonical_target_id": "concept_past_time",
    "source_evidence": "Direct source curriculum / exercise attestations reconcile target entity with full semantic content",
    "reason": "Meaningful typed source relationship preserved with verified canonical semantic target"
  },
  {
    "owner_entity_type": "section",
    "owner_entity_id": "section_08_02",
    "source_file": "immutable-chapter-input",
    "source_entity_id": "section_08_02",
    "relationship_field": "concept_ids",
    "source_reference_id": "concept_past_time",
    "source_text": "section_08_02",
    "resolution_class": "SOURCE_BACKED_ENTITY_RECONCILED",
    "canonical_target_id": "concept_past_time",
    "source_evidence": "Direct source curriculum / exercise attestations reconcile target entity with full semantic content",
    "reason": "Meaningful typed source relationship preserved with verified canonical semantic target"
  },
  {
    "owner_entity_type": "section",
    "owner_entity_id": "section_08_03",
    "source_file": "immutable-chapter-input",
    "source_entity_id": "section_08_03",
    "relationship_field": "concept_ids",
    "source_reference_id": "concept_past_time",
    "source_text": "section_08_03",
    "resolution_class": "SOURCE_BACKED_ENTITY_RECONCILED",
    "canonical_target_id": "concept_past_time",
    "source_evidence": "Direct source curriculum / exercise attestations reconcile target entity with full semantic content",
    "reason": "Meaningful typed source relationship preserved with verified canonical semantic target"
  },
  {
    "owner_entity_type": "section",
    "owner_entity_id": "section_08_03",
    "source_file": "immutable-chapter-input",
    "source_entity_id": "section_08_03",
    "relationship_field": "grammar_rule_ids",
    "source_reference_id": "rule_imparfait_with_depuis_and_venir_de",
    "source_text": "section_08_03",
    "resolution_class": "SOURCE_BACKED_ENTITY_RECONCILED",
    "canonical_target_id": "rule_imparfait_with_depuis_and_venir_de",
    "source_evidence": "Direct source curriculum / exercise attestations reconcile target entity with full semantic content",
    "reason": "Meaningful typed source relationship preserved with verified canonical semantic target"
  },
  {
    "owner_entity_type": "section",
    "owner_entity_id": "section_08_03",
    "source_file": "immutable-chapter-input",
    "source_entity_id": "section_08_03",
    "relationship_field": "expression_ids",
    "source_reference_id": "expr_venait_de_inf",
    "source_text": "section_08_03",
    "resolution_class": "SOURCE_BACKED_ENTITY_RECONCILED",
    "canonical_target_id": "expr_venait_de_inf",
    "source_evidence": "Direct source curriculum / exercise attestations reconcile target entity with full semantic content",
    "reason": "Meaningful typed source relationship preserved with verified canonical semantic target"
  },
  {
    "owner_entity_type": "section",
    "owner_entity_id": "section_09_03",
    "source_file": "immutable-chapter-input",
    "source_entity_id": "section_09_03",
    "relationship_field": "expression_ids",
    "source_reference_id": "expr_des_que_futur",
    "source_text": "section_09_03",
    "resolution_class": "SOURCE_BACKED_ENTITY_RECONCILED",
    "canonical_target_id": "expr_des_que_futur",
    "source_evidence": "Direct source curriculum / exercise attestations reconcile target entity with full semantic content",
    "reason": "Meaningful typed source relationship preserved with verified canonical semantic target"
  },
  {
    "owner_entity_type": "section",
    "owner_entity_id": "section_10_01",
    "source_file": "immutable-chapter-input",
    "source_entity_id": "section_10_01",
    "relationship_field": "concept_ids",
    "source_reference_id": "concept_past_time",
    "source_text": "section_10_01",
    "resolution_class": "SOURCE_BACKED_ENTITY_RECONCILED",
    "canonical_target_id": "concept_past_time",
    "source_evidence": "Direct source curriculum / exercise attestations reconcile target entity with full semantic content",
    "reason": "Meaningful typed source relationship preserved with verified canonical semantic target"
  },
  {
    "owner_entity_type": "section",
    "owner_entity_id": "section_10_02",
    "source_file": "immutable-chapter-input",
    "source_entity_id": "section_10_02",
    "relationship_field": "concept_ids",
    "source_reference_id": "concept_past_time",
    "source_text": "section_10_02",
    "resolution_class": "SOURCE_BACKED_ENTITY_RECONCILED",
    "canonical_target_id": "concept_past_time",
    "source_evidence": "Direct source curriculum / exercise attestations reconcile target entity with full semantic content",
    "reason": "Meaningful typed source relationship preserved with verified canonical semantic target"
  },
  {
    "owner_entity_type": "section",
    "owner_entity_id": "section_11_01",
    "source_file": "immutable-chapter-input",
    "source_entity_id": "section_11_01",
    "relationship_field": "expression_ids",
    "source_reference_id": "expr_je_voudrais",
    "source_text": "section_11_01",
    "resolution_class": "SOURCE_BACKED_ENTITY_RECONCILED",
    "canonical_target_id": "expr_je_voudrais",
    "source_evidence": "Direct source curriculum / exercise attestations reconcile target entity with full semantic content",
    "reason": "Meaningful typed source relationship preserved with verified canonical semantic target"
  },
  {
    "owner_entity_type": "section",
    "owner_entity_id": "section_11_02",
    "source_file": "immutable-chapter-input",
    "source_entity_id": "section_11_02",
    "relationship_field": "grammar_rule_ids",
    "source_reference_id": "rule_si_clause_pattern_pqp_conditionnel_passe",
    "source_text": "section_11_02",
    "resolution_class": "SOURCE_BACKED_ENTITY_RECONCILED",
    "canonical_target_id": "rule_si_clause_pattern_pqp_conditionnel_passe",
    "source_evidence": "Direct source curriculum / exercise attestations reconcile target entity with full semantic content",
    "reason": "Meaningful typed source relationship preserved with verified canonical semantic target"
  },
  {
    "owner_entity_type": "section",
    "owner_entity_id": "section_11_02",
    "source_file": "immutable-chapter-input",
    "source_entity_id": "section_11_02",
    "relationship_field": "expression_ids",
    "source_reference_id": "expr_j_aurais_aime",
    "source_text": "section_11_02",
    "resolution_class": "SOURCE_BACKED_ENTITY_RECONCILED",
    "canonical_target_id": "expr_j_aurais_aime",
    "source_evidence": "Direct source curriculum / exercise attestations reconcile target entity with full semantic content",
    "reason": "Meaningful typed source relationship preserved with verified canonical semantic target"
  },
  {
    "owner_entity_type": "section",
    "owner_entity_id": "section_11_02",
    "source_file": "immutable-chapter-input",
    "source_entity_id": "section_11_02",
    "relationship_field": "expression_ids",
    "source_reference_id": "expr_j_aurais_du",
    "source_text": "section_11_02",
    "resolution_class": "SOURCE_BACKED_ENTITY_RECONCILED",
    "canonical_target_id": "expr_j_aurais_du",
    "source_evidence": "Direct source curriculum / exercise attestations reconcile target entity with full semantic content",
    "reason": "Meaningful typed source relationship preserved with verified canonical semantic target"
  },
  {
    "owner_entity_type": "section",
    "owner_entity_id": "section_12_01",
    "source_file": "immutable-chapter-input",
    "source_entity_id": "section_12_01",
    "relationship_field": "expression_ids",
    "source_reference_id": "expr_pourriez_vous_inf",
    "source_text": "section_12_01",
    "resolution_class": "SOURCE_BACKED_ENTITY_RECONCILED",
    "canonical_target_id": "expr_pourriez_vous_inf",
    "source_evidence": "Direct source curriculum / exercise attestations reconcile target entity with full semantic content",
    "reason": "Meaningful typed source relationship preserved with verified canonical semantic target"
  },
  {
    "owner_entity_type": "section",
    "owner_entity_id": "section_12_01",
    "source_file": "immutable-chapter-input",
    "source_entity_id": "section_12_01",
    "relationship_field": "expression_ids",
    "source_reference_id": "expr_j_ai_pu",
    "source_text": "section_12_01",
    "resolution_class": "SOURCE_BACKED_ENTITY_RECONCILED",
    "canonical_target_id": "expr_j_ai_pu",
    "source_evidence": "Direct source curriculum / exercise attestations reconcile target entity with full semantic content",
    "reason": "Meaningful typed source relationship preserved with verified canonical semantic target"
  },
  {
    "owner_entity_type": "section",
    "owner_entity_id": "section_12_02",
    "source_file": "immutable-chapter-input",
    "source_entity_id": "section_12_02",
    "relationship_field": "expression_ids",
    "source_reference_id": "expr_vous_devriez",
    "source_text": "section_12_02",
    "resolution_class": "SOURCE_BACKED_ENTITY_RECONCILED",
    "canonical_target_id": "expr_vous_devriez",
    "source_evidence": "Direct source curriculum / exercise attestations reconcile target entity with full semantic content",
    "reason": "Meaningful typed source relationship preserved with verified canonical semantic target"
  },
  {
    "owner_entity_type": "section",
    "owner_entity_id": "section_12_02",
    "source_file": "immutable-chapter-input",
    "source_entity_id": "section_12_02",
    "relationship_field": "expression_ids",
    "source_reference_id": "expr_vous_auriez_du",
    "source_text": "section_12_02",
    "resolution_class": "SOURCE_BACKED_ENTITY_RECONCILED",
    "canonical_target_id": "expr_vous_auriez_du",
    "source_evidence": "Direct source curriculum / exercise attestations reconcile target entity with full semantic content",
    "reason": "Meaningful typed source relationship preserved with verified canonical semantic target"
  },
  {
    "owner_entity_type": "section",
    "owner_entity_id": "section_13_02",
    "source_file": "immutable-chapter-input",
    "source_entity_id": "section_13_02",
    "relationship_field": "grammar_rule_ids",
    "source_reference_id": "rule_subjunctive_triggers_emotion_feeling",
    "source_text": "section_13_02",
    "resolution_class": "SOURCE_BACKED_ENTITY_RECONCILED",
    "canonical_target_id": "rule_subjunctive_triggers_emotion_feeling",
    "source_evidence": "Direct source curriculum / exercise attestations reconcile target entity with full semantic content",
    "reason": "Meaningful typed source relationship preserved with verified canonical semantic target"
  },
  {
    "owner_entity_type": "section",
    "owner_entity_id": "section_13_02",
    "source_file": "immutable-chapter-input",
    "source_entity_id": "section_13_02",
    "relationship_field": "grammar_rule_ids",
    "source_reference_id": "rule_subjunctive_triggers_doubt_denial",
    "source_text": "section_13_02",
    "resolution_class": "SOURCE_BACKED_ENTITY_RECONCILED",
    "canonical_target_id": "rule_subjunctive_triggers_doubt_denial",
    "source_evidence": "Direct source curriculum / exercise attestations reconcile target entity with full semantic content",
    "reason": "Meaningful typed source relationship preserved with verified canonical semantic target"
  },
  {
    "owner_entity_type": "section",
    "owner_entity_id": "section_13_02",
    "source_file": "immutable-chapter-input",
    "source_entity_id": "section_13_02",
    "relationship_field": "expression_ids",
    "source_reference_id": "expr_pour_que_subjonctif",
    "source_text": "section_13_02",
    "resolution_class": "SOURCE_BACKED_ENTITY_RECONCILED",
    "canonical_target_id": "expr_pour_que_subjonctif",
    "source_evidence": "Direct source curriculum / exercise attestations reconcile target entity with full semantic content",
    "reason": "Meaningful typed source relationship preserved with verified canonical semantic target"
  },
  {
    "owner_entity_type": "section",
    "owner_entity_id": "section_13_02",
    "source_file": "immutable-chapter-input",
    "source_entity_id": "section_13_02",
    "relationship_field": "expression_ids",
    "source_reference_id": "expr_avant_que_subjonctif",
    "source_text": "section_13_02",
    "resolution_class": "SOURCE_BACKED_ENTITY_RECONCILED",
    "canonical_target_id": "expr_avant_que_subjonctif",
    "source_evidence": "Direct source curriculum / exercise attestations reconcile target entity with full semantic content",
    "reason": "Meaningful typed source relationship preserved with verified canonical semantic target"
  },
  {
    "owner_entity_type": "section",
    "owner_entity_id": "section_13_02",
    "source_file": "immutable-chapter-input",
    "source_entity_id": "section_13_02",
    "relationship_field": "expression_ids",
    "source_reference_id": "expr_a_condition_que_subjonctif",
    "source_text": "section_13_02",
    "resolution_class": "SOURCE_BACKED_ENTITY_RECONCILED",
    "canonical_target_id": "expr_a_condition_que_subjonctif",
    "source_evidence": "Direct source curriculum / exercise attestations reconcile target entity with full semantic content",
    "reason": "Meaningful typed source relationship preserved with verified canonical semantic target"
  },
  {
    "owner_entity_type": "section",
    "owner_entity_id": "section_13_03",
    "source_file": "immutable-chapter-input",
    "source_entity_id": "section_13_03",
    "relationship_field": "grammar_rule_ids",
    "source_reference_id": "rule_subjonctif_passe_formation_and_usage",
    "source_text": "section_13_03",
    "resolution_class": "SOURCE_BACKED_ENTITY_RECONCILED",
    "canonical_target_id": "rule_subjonctif_passe_formation_and_usage",
    "source_evidence": "Direct source curriculum / exercise attestations reconcile target entity with full semantic content",
    "reason": "Meaningful typed source relationship preserved with verified canonical semantic target"
  },
  {
    "owner_entity_type": "section",
    "owner_entity_id": "section_13_03",
    "source_file": "immutable-chapter-input",
    "source_entity_id": "section_13_03",
    "relationship_field": "example_ids",
    "source_reference_id": "example_subj_passe_001",
    "source_text": "section_13_03",
    "resolution_class": "SOURCE_BACKED_ENTITY_RECONCILED",
    "canonical_target_id": "example_subj_passe_001",
    "source_evidence": "Direct source curriculum / exercise attestations reconcile target entity with full semantic content",
    "reason": "Meaningful typed source relationship preserved with verified canonical semantic target"
  },
  {
    "owner_entity_type": "section",
    "owner_entity_id": "section_14_01",
    "source_file": "immutable-chapter-input",
    "source_entity_id": "section_14_01",
    "relationship_field": "concept_ids",
    "source_reference_id": "concept_verb_preposition_patterns",
    "source_text": "section_14_01",
    "resolution_class": "SOURCE_BACKED_ENTITY_RECONCILED",
    "canonical_target_id": "concept_verb_preposition_patterns",
    "source_evidence": "Direct source curriculum / exercise attestations reconcile target entity with full semantic content",
    "reason": "Meaningful typed source relationship preserved with verified canonical semantic target"
  },
  {
    "owner_entity_type": "section",
    "owner_entity_id": "section_14_01",
    "source_file": "immutable-chapter-input",
    "source_entity_id": "section_14_01",
    "relationship_field": "expression_ids",
    "source_reference_id": "expr_sans_inf",
    "source_text": "section_14_01",
    "resolution_class": "SOURCE_BACKED_ENTITY_RECONCILED",
    "canonical_target_id": "expr_sans_inf",
    "source_evidence": "Direct source curriculum / exercise attestations reconcile target entity with full semantic content",
    "reason": "Meaningful typed source relationship preserved with verified canonical semantic target"
  },
  {
    "owner_entity_type": "section",
    "owner_entity_id": "section_14_01",
    "source_file": "immutable-chapter-input",
    "source_entity_id": "section_14_01",
    "relationship_field": "expression_ids",
    "source_reference_id": "expr_pour_inf",
    "source_text": "section_14_01",
    "resolution_class": "SOURCE_BACKED_ENTITY_RECONCILED",
    "canonical_target_id": "expr_pour_inf",
    "source_evidence": "Direct source curriculum / exercise attestations reconcile target entity with full semantic content",
    "reason": "Meaningful typed source relationship preserved with verified canonical semantic target"
  },
  {
    "owner_entity_type": "section",
    "owner_entity_id": "section_14_02",
    "source_file": "immutable-chapter-input",
    "source_entity_id": "section_14_02",
    "relationship_field": "expression_ids",
    "source_reference_id": "expr_apres_etre_participe_passe",
    "source_text": "section_14_02",
    "resolution_class": "SOURCE_BACKED_ENTITY_RECONCILED",
    "canonical_target_id": "expr_apres_etre_participe_passe",
    "source_evidence": "Direct source curriculum / exercise attestations reconcile target entity with full semantic content",
    "reason": "Meaningful typed source relationship preserved with verified canonical semantic target"
  },
  {
    "owner_entity_type": "section",
    "owner_entity_id": "section_14_03",
    "source_file": "immutable-chapter-input",
    "source_entity_id": "section_14_03",
    "relationship_field": "concept_ids",
    "source_reference_id": "concept_verb_preposition_patterns",
    "source_text": "section_14_03",
    "resolution_class": "SOURCE_BACKED_ENTITY_RECONCILED",
    "canonical_target_id": "concept_verb_preposition_patterns",
    "source_evidence": "Direct source curriculum / exercise attestations reconcile target entity with full semantic content",
    "reason": "Meaningful typed source relationship preserved with verified canonical semantic target"
  },
  {
    "owner_entity_type": "section",
    "owner_entity_id": "section_14_03",
    "source_file": "immutable-chapter-input",
    "source_entity_id": "section_14_03",
    "relationship_field": "verb_ids",
    "source_reference_id": "verb_decider",
    "source_text": "section_14_03",
    "resolution_class": "SOURCE_BACKED_ENTITY_RECONCILED",
    "canonical_target_id": "verb_decider",
    "source_evidence": "Direct source curriculum / exercise attestations reconcile target entity with full semantic content",
    "reason": "Meaningful typed source relationship preserved with verified canonical semantic target"
  },
  {
    "owner_entity_type": "section",
    "owner_entity_id": "section_14_03",
    "source_file": "immutable-chapter-input",
    "source_entity_id": "section_14_03",
    "relationship_field": "verb_ids",
    "source_reference_id": "verb_essayer",
    "source_text": "section_14_03",
    "resolution_class": "SOURCE_BACKED_ENTITY_RECONCILED",
    "canonical_target_id": "verb_essayer",
    "source_evidence": "Direct source curriculum / exercise attestations reconcile target entity with full semantic content",
    "reason": "Meaningful typed source relationship preserved with verified canonical semantic target"
  },
  {
    "owner_entity_type": "section",
    "owner_entity_id": "section_14_03",
    "source_file": "immutable-chapter-input",
    "source_entity_id": "section_14_03",
    "relationship_field": "expression_ids",
    "source_reference_id": "expr_commencer_a_inf",
    "source_text": "section_14_03",
    "resolution_class": "SOURCE_BACKED_ENTITY_RECONCILED",
    "canonical_target_id": "expr_commencer_a_inf",
    "source_evidence": "Direct source curriculum / exercise attestations reconcile target entity with full semantic content",
    "reason": "Meaningful typed source relationship preserved with verified canonical semantic target"
  },
  {
    "owner_entity_type": "section",
    "owner_entity_id": "section_14_03",
    "source_file": "immutable-chapter-input",
    "source_entity_id": "section_14_03",
    "relationship_field": "expression_ids",
    "source_reference_id": "expr_apprendre_a_inf",
    "source_text": "section_14_03",
    "resolution_class": "SOURCE_BACKED_ENTITY_RECONCILED",
    "canonical_target_id": "expr_apprendre_a_inf",
    "source_evidence": "Direct source curriculum / exercise attestations reconcile target entity with full semantic content",
    "reason": "Meaningful typed source relationship preserved with verified canonical semantic target"
  },
  {
    "owner_entity_type": "section",
    "owner_entity_id": "section_14_03",
    "source_file": "immutable-chapter-input",
    "source_entity_id": "section_14_03",
    "relationship_field": "expression_ids",
    "source_reference_id": "expr_decider_de_inf",
    "source_text": "section_14_03",
    "resolution_class": "SOURCE_BACKED_ENTITY_RECONCILED",
    "canonical_target_id": "expr_decider_de_inf",
    "source_evidence": "Direct source curriculum / exercise attestations reconcile target entity with full semantic content",
    "reason": "Meaningful typed source relationship preserved with verified canonical semantic target"
  },
  {
    "owner_entity_type": "section",
    "owner_entity_id": "section_14_03",
    "source_file": "immutable-chapter-input",
    "source_entity_id": "section_14_03",
    "relationship_field": "expression_ids",
    "source_reference_id": "expr_essayer_de_inf",
    "source_text": "section_14_03",
    "resolution_class": "SOURCE_BACKED_ENTITY_RECONCILED",
    "canonical_target_id": "expr_essayer_de_inf",
    "source_evidence": "Direct source curriculum / exercise attestations reconcile target entity with full semantic content",
    "reason": "Meaningful typed source relationship preserved with verified canonical semantic target"
  },
  {
    "owner_entity_type": "section",
    "owner_entity_id": "section_14_03",
    "source_file": "immutable-chapter-input",
    "source_entity_id": "section_14_03",
    "relationship_field": "expression_ids",
    "source_reference_id": "expr_oublier_de_inf",
    "source_text": "section_14_03",
    "resolution_class": "SOURCE_BACKED_ENTITY_RECONCILED",
    "canonical_target_id": "expr_oublier_de_inf",
    "source_evidence": "Direct source curriculum / exercise attestations reconcile target entity with full semantic content",
    "reason": "Meaningful typed source relationship preserved with verified canonical semantic target"
  },
  {
    "owner_entity_type": "section",
    "owner_entity_id": "section_15_02",
    "source_file": "immutable-chapter-input",
    "source_entity_id": "section_15_02",
    "relationship_field": "expression_ids",
    "source_reference_id": "expr_tout_en_participe_present",
    "source_text": "section_15_02",
    "resolution_class": "SOURCE_BACKED_ENTITY_RECONCILED",
    "canonical_target_id": "expr_tout_en_participe_present",
    "source_evidence": "Direct source curriculum / exercise attestations reconcile target entity with full semantic content",
    "reason": "Meaningful typed source relationship preserved with verified canonical semantic target"
  },
  {
    "owner_entity_type": "section",
    "owner_entity_id": "section_16_01",
    "source_file": "immutable-chapter-input",
    "source_entity_id": "section_16_01",
    "relationship_field": "concept_ids",
    "source_reference_id": "concept_past_time",
    "source_text": "section_16_01",
    "resolution_class": "SOURCE_BACKED_ENTITY_RECONCILED",
    "canonical_target_id": "concept_past_time",
    "source_evidence": "Direct source curriculum / exercise attestations reconcile target entity with full semantic content",
    "reason": "Meaningful typed source relationship preserved with verified canonical semantic target"
  },
  {
    "owner_entity_type": "section",
    "owner_entity_id": "section_16_02",
    "source_file": "immutable-chapter-input",
    "source_entity_id": "section_16_02",
    "relationship_field": "concept_ids",
    "source_reference_id": "concept_past_time",
    "source_text": "section_16_02",
    "resolution_class": "SOURCE_BACKED_ENTITY_RECONCILED",
    "canonical_target_id": "concept_past_time",
    "source_evidence": "Direct source curriculum / exercise attestations reconcile target entity with full semantic content",
    "reason": "Meaningful typed source relationship preserved with verified canonical semantic target"
  },
  {
    "owner_entity_type": "section",
    "owner_entity_id": "section_17_01",
    "source_file": "immutable-chapter-input",
    "source_entity_id": "section_17_01",
    "relationship_field": "concept_ids",
    "source_reference_id": "concept_passive_voice",
    "source_text": "section_17_01",
    "resolution_class": "SOURCE_BACKED_ENTITY_RECONCILED",
    "canonical_target_id": "concept_passive_voice",
    "source_evidence": "Direct source curriculum / exercise attestations reconcile target entity with full semantic content",
    "reason": "Meaningful typed source relationship preserved with verified canonical semantic target"
  },
  {
    "owner_entity_type": "section",
    "owner_entity_id": "section_17_02",
    "source_file": "immutable-chapter-input",
    "source_entity_id": "section_17_02",
    "relationship_field": "concept_ids",
    "source_reference_id": "concept_passive_voice",
    "source_text": "section_17_02",
    "resolution_class": "SOURCE_BACKED_ENTITY_RECONCILED",
    "canonical_target_id": "concept_passive_voice",
    "source_evidence": "Direct source curriculum / exercise attestations reconcile target entity with full semantic content",
    "reason": "Meaningful typed source relationship preserved with verified canonical semantic target"
  },
  {
    "owner_entity_type": "section",
    "owner_entity_id": "section_18_01",
    "source_file": "immutable-chapter-input",
    "source_entity_id": "section_18_01",
    "relationship_field": "concept_ids",
    "source_reference_id": "concept_indirect_speech",
    "source_text": "section_18_01",
    "resolution_class": "SOURCE_BACKED_ENTITY_RECONCILED",
    "canonical_target_id": "concept_indirect_speech",
    "source_evidence": "Direct source curriculum / exercise attestations reconcile target entity with full semantic content",
    "reason": "Meaningful typed source relationship preserved with verified canonical semantic target"
  },
  {
    "owner_entity_type": "section",
    "owner_entity_id": "section_18_02",
    "source_file": "immutable-chapter-input",
    "source_entity_id": "section_18_02",
    "relationship_field": "concept_ids",
    "source_reference_id": "concept_indirect_speech",
    "source_text": "section_18_02",
    "resolution_class": "SOURCE_BACKED_ENTITY_RECONCILED",
    "canonical_target_id": "concept_indirect_speech",
    "source_evidence": "Direct source curriculum / exercise attestations reconcile target entity with full semantic content",
    "reason": "Meaningful typed source relationship preserved with verified canonical semantic target"
  },
  {
    "owner_entity_type": "section",
    "owner_entity_id": "section_19_01",
    "source_file": "immutable-chapter-input",
    "source_entity_id": "section_19_01",
    "relationship_field": "expression_ids",
    "source_reference_id": "expr_ayez_la_bonte_de",
    "source_text": "section_19_01",
    "resolution_class": "SOURCE_BACKED_ENTITY_RECONCILED",
    "canonical_target_id": "expr_ayez_la_bonte_de",
    "source_evidence": "Direct source curriculum / exercise attestations reconcile target entity with full semantic content",
    "reason": "Meaningful typed source relationship preserved with verified canonical semantic target"
  },
  {
    "owner_entity_type": "section",
    "owner_entity_id": "section_19_02",
    "source_file": "immutable-chapter-input",
    "source_entity_id": "section_19_02",
    "relationship_field": "concept_ids",
    "source_reference_id": "concept_pronominal_verbs",
    "source_text": "section_19_02",
    "resolution_class": "SOURCE_BACKED_ENTITY_RECONCILED",
    "canonical_target_id": "concept_pronominal_verbs",
    "source_evidence": "Direct source curriculum / exercise attestations reconcile target entity with full semantic content",
    "reason": "Meaningful typed source relationship preserved with verified canonical semantic target"
  },
  {
    "owner_entity_type": "section",
    "owner_entity_id": "section_19_02",
    "source_file": "immutable-chapter-input",
    "source_entity_id": "section_19_02",
    "relationship_field": "verb_ids",
    "source_reference_id": "verb_se_taire",
    "source_text": "section_19_02",
    "resolution_class": "SOURCE_BACKED_ENTITY_RECONCILED",
    "canonical_target_id": "verb_se_taire",
    "source_evidence": "Direct source curriculum / exercise attestations reconcile target entity with full semantic content",
    "reason": "Meaningful typed source relationship preserved with verified canonical semantic target"
  },
  {
    "owner_entity_type": "section",
    "owner_entity_id": "section_19_02",
    "source_file": "immutable-chapter-input",
    "source_entity_id": "section_19_02",
    "relationship_field": "expression_ids",
    "source_reference_id": "expr_taisez_vous",
    "source_text": "section_19_02",
    "resolution_class": "SOURCE_BACKED_ENTITY_RECONCILED",
    "canonical_target_id": "expr_taisez_vous",
    "source_evidence": "Direct source curriculum / exercise attestations reconcile target entity with full semantic content",
    "reason": "Meaningful typed source relationship preserved with verified canonical semantic target"
  },
  {
    "owner_entity_type": "section",
    "owner_entity_id": "section_19_02",
    "source_file": "immutable-chapter-input",
    "source_entity_id": "section_19_02",
    "relationship_field": "expression_ids",
    "source_reference_id": "expr_depechez_vous",
    "source_text": "section_19_02",
    "resolution_class": "SOURCE_BACKED_ENTITY_RECONCILED",
    "canonical_target_id": "expr_depechez_vous",
    "source_evidence": "Direct source curriculum / exercise attestations reconcile target entity with full semantic content",
    "reason": "Meaningful typed source relationship preserved with verified canonical semantic target"
  },
  {
    "owner_entity_type": "section",
    "owner_entity_id": "section_20_02",
    "source_file": "immutable-chapter-input",
    "source_entity_id": "section_20_02",
    "relationship_field": "grammar_rule_ids",
    "source_reference_id": "rule_partitive_articles_du_de_la_des",
    "source_text": "section_20_02",
    "resolution_class": "SOURCE_BACKED_ENTITY_RECONCILED",
    "canonical_target_id": "rule_partitive_articles_du_de_la_des",
    "source_evidence": "Direct source curriculum / exercise attestations reconcile target entity with full semantic content",
    "reason": "Meaningful typed source relationship preserved with verified canonical semantic target"
  },
  {
    "owner_entity_type": "section",
    "owner_entity_id": "section_20_02",
    "source_file": "immutable-chapter-input",
    "source_entity_id": "section_20_02",
    "relationship_field": "grammar_rule_ids",
    "source_reference_id": "rule_partitive_in_negation_and_quantities",
    "source_text": "section_20_02",
    "resolution_class": "SOURCE_BACKED_ENTITY_RECONCILED",
    "canonical_target_id": "rule_partitive_in_negation_and_quantities",
    "source_evidence": "Direct source curriculum / exercise attestations reconcile target entity with full semantic content",
    "reason": "Meaningful typed source relationship preserved with verified canonical semantic target"
  },
  {
    "owner_entity_type": "section",
    "owner_entity_id": "section_20_02",
    "source_file": "immutable-chapter-input",
    "source_entity_id": "section_20_02",
    "relationship_field": "expression_ids",
    "source_reference_id": "expr_un_peu_de",
    "source_text": "section_20_02",
    "resolution_class": "SOURCE_BACKED_ENTITY_RECONCILED",
    "canonical_target_id": "expr_un_peu_de",
    "source_evidence": "Direct source curriculum / exercise attestations reconcile target entity with full semantic content",
    "reason": "Meaningful typed source relationship preserved with verified canonical semantic target"
  },
  {
    "owner_entity_type": "section",
    "owner_entity_id": "section_20_02",
    "source_file": "immutable-chapter-input",
    "source_entity_id": "section_20_02",
    "relationship_field": "expression_ids",
    "source_reference_id": "expr_beaucoup_de",
    "source_text": "section_20_02",
    "resolution_class": "SOURCE_BACKED_ENTITY_RECONCILED",
    "canonical_target_id": "expr_beaucoup_de",
    "source_evidence": "Direct source curriculum / exercise attestations reconcile target entity with full semantic content",
    "reason": "Meaningful typed source relationship preserved with verified canonical semantic target"
  },
  {
    "owner_entity_type": "section",
    "owner_entity_id": "section_20_02",
    "source_file": "immutable-chapter-input",
    "source_entity_id": "section_20_02",
    "relationship_field": "example_ids",
    "source_reference_id": "example_partitive_001",
    "source_text": "section_20_02",
    "resolution_class": "SOURCE_BACKED_ENTITY_RECONCILED",
    "canonical_target_id": "example_partitive_001",
    "source_evidence": "Direct source curriculum / exercise attestations reconcile target entity with full semantic content",
    "reason": "Meaningful typed source relationship preserved with verified canonical semantic target"
  },
  {
    "owner_entity_type": "section",
    "owner_entity_id": "section_20_03",
    "source_file": "immutable-chapter-input",
    "source_entity_id": "section_20_03",
    "relationship_field": "grammar_rule_ids",
    "source_reference_id": "rule_noun_gender_endings_rules",
    "source_text": "section_20_03",
    "resolution_class": "SOURCE_BACKED_ENTITY_RECONCILED",
    "canonical_target_id": "rule_noun_gender_endings_rules",
    "source_evidence": "Direct source curriculum / exercise attestations reconcile target entity with full semantic content",
    "reason": "Meaningful typed source relationship preserved with verified canonical semantic target"
  },
  {
    "owner_entity_type": "section",
    "owner_entity_id": "section_20_03",
    "source_file": "immutable-chapter-input",
    "source_entity_id": "section_20_03",
    "relationship_field": "example_ids",
    "source_reference_id": "example_gender_noun_001",
    "source_text": "section_20_03",
    "resolution_class": "SOURCE_BACKED_ENTITY_RECONCILED",
    "canonical_target_id": "example_gender_noun_001",
    "source_evidence": "Direct source curriculum / exercise attestations reconcile target entity with full semantic content",
    "reason": "Meaningful typed source relationship preserved with verified canonical semantic target"
  },
  {
    "owner_entity_type": "section",
    "owner_entity_id": "section_20_04",
    "source_file": "immutable-chapter-input",
    "source_entity_id": "section_20_04",
    "relationship_field": "grammar_rule_ids",
    "source_reference_id": "rule_noun_plural_formation_and_irregular_endings",
    "source_text": "section_20_04",
    "resolution_class": "SOURCE_BACKED_ENTITY_RECONCILED",
    "canonical_target_id": "rule_noun_plural_formation_and_irregular_endings",
    "source_evidence": "Direct source curriculum / exercise attestations reconcile target entity with full semantic content",
    "reason": "Meaningful typed source relationship preserved with verified canonical semantic target"
  },
  {
    "owner_entity_type": "section",
    "owner_entity_id": "section_20_04",
    "source_file": "immutable-chapter-input",
    "source_entity_id": "section_20_04",
    "relationship_field": "example_ids",
    "source_reference_id": "example_plural_noun_001",
    "source_text": "section_20_04",
    "resolution_class": "SOURCE_BACKED_ENTITY_RECONCILED",
    "canonical_target_id": "example_plural_noun_001",
    "source_evidence": "Direct source curriculum / exercise attestations reconcile target entity with full semantic content",
    "reason": "Meaningful typed source relationship preserved with verified canonical semantic target"
  },
  {
    "owner_entity_type": "section",
    "owner_entity_id": "section_20_05",
    "source_file": "immutable-chapter-input",
    "source_entity_id": "section_20_05",
    "relationship_field": "expression_ids",
    "source_reference_id": "expr_en_france",
    "source_text": "section_20_05",
    "resolution_class": "SOURCE_BACKED_ENTITY_RECONCILED",
    "canonical_target_id": "expr_en_france",
    "source_evidence": "Direct source curriculum / exercise attestations reconcile target entity with full semantic content",
    "reason": "Meaningful typed source relationship preserved with verified canonical semantic target"
  },
  {
    "owner_entity_type": "section",
    "owner_entity_id": "section_20_05",
    "source_file": "immutable-chapter-input",
    "source_entity_id": "section_20_05",
    "relationship_field": "expression_ids",
    "source_reference_id": "expr_au_canada",
    "source_text": "section_20_05",
    "resolution_class": "SOURCE_BACKED_ENTITY_RECONCILED",
    "canonical_target_id": "expr_au_canada",
    "source_evidence": "Direct source curriculum / exercise attestations reconcile target entity with full semantic content",
    "reason": "Meaningful typed source relationship preserved with verified canonical semantic target"
  },
  {
    "owner_entity_type": "section",
    "owner_entity_id": "section_20_05",
    "source_file": "immutable-chapter-input",
    "source_entity_id": "section_20_05",
    "relationship_field": "expression_ids",
    "source_reference_id": "expr_aux_etats_unis",
    "source_text": "section_20_05",
    "resolution_class": "SOURCE_BACKED_ENTITY_RECONCILED",
    "canonical_target_id": "expr_aux_etats_unis",
    "source_evidence": "Direct source curriculum / exercise attestations reconcile target entity with full semantic content",
    "reason": "Meaningful typed source relationship preserved with verified canonical semantic target"
  },
  {
    "owner_entity_type": "section",
    "owner_entity_id": "section_21_01",
    "source_file": "immutable-chapter-input",
    "source_entity_id": "section_21_01",
    "relationship_field": "concept_ids",
    "source_reference_id": "concept_object_pronouns",
    "source_text": "section_21_01",
    "resolution_class": "SOURCE_BACKED_ENTITY_RECONCILED",
    "canonical_target_id": "concept_object_pronouns",
    "source_evidence": "Direct source curriculum / exercise attestations reconcile target entity with full semantic content",
    "reason": "Meaningful typed source relationship preserved with verified canonical semantic target"
  },
  {
    "owner_entity_type": "section",
    "owner_entity_id": "section_21_02",
    "source_file": "immutable-chapter-input",
    "source_entity_id": "section_21_02",
    "relationship_field": "concept_ids",
    "source_reference_id": "concept_object_pronouns",
    "source_text": "section_21_02",
    "resolution_class": "SOURCE_BACKED_ENTITY_RECONCILED",
    "canonical_target_id": "concept_object_pronouns",
    "source_evidence": "Direct source curriculum / exercise attestations reconcile target entity with full semantic content",
    "reason": "Meaningful typed source relationship preserved with verified canonical semantic target"
  },
  {
    "owner_entity_type": "section",
    "owner_entity_id": "section_21_03",
    "source_file": "immutable-chapter-input",
    "source_entity_id": "section_21_03",
    "relationship_field": "concept_ids",
    "source_reference_id": "concept_object_pronouns",
    "source_text": "section_21_03",
    "resolution_class": "SOURCE_BACKED_ENTITY_RECONCILED",
    "canonical_target_id": "concept_object_pronouns",
    "source_evidence": "Direct source curriculum / exercise attestations reconcile target entity with full semantic content",
    "reason": "Meaningful typed source relationship preserved with verified canonical semantic target"
  },
  {
    "owner_entity_type": "section",
    "owner_entity_id": "section_21_03",
    "source_file": "immutable-chapter-input",
    "source_entity_id": "section_21_03",
    "relationship_field": "grammar_rule_ids",
    "source_reference_id": "rule_adverbial_pronouns_y_and_en",
    "source_text": "section_21_03",
    "resolution_class": "SOURCE_BACKED_ENTITY_RECONCILED",
    "canonical_target_id": "rule_adverbial_pronouns_y_and_en",
    "source_evidence": "Direct source curriculum / exercise attestations reconcile target entity with full semantic content",
    "reason": "Meaningful typed source relationship preserved with verified canonical semantic target"
  },
  {
    "owner_entity_type": "section",
    "owner_entity_id": "section_21_03",
    "source_file": "immutable-chapter-input",
    "source_entity_id": "section_21_03",
    "relationship_field": "expression_ids",
    "source_reference_id": "expr_s_y_connaitre",
    "source_text": "section_21_03",
    "resolution_class": "SOURCE_BACKED_ENTITY_RECONCILED",
    "canonical_target_id": "expr_s_y_connaitre",
    "source_evidence": "Direct source curriculum / exercise attestations reconcile target entity with full semantic content",
    "reason": "Meaningful typed source relationship preserved with verified canonical semantic target"
  },
  {
    "owner_entity_type": "section",
    "owner_entity_id": "section_21_04",
    "source_file": "immutable-chapter-input",
    "source_entity_id": "section_21_04",
    "relationship_field": "concept_ids",
    "source_reference_id": "concept_object_pronouns",
    "source_text": "section_21_04",
    "resolution_class": "SOURCE_BACKED_ENTITY_RECONCILED",
    "canonical_target_id": "concept_object_pronouns",
    "source_evidence": "Direct source curriculum / exercise attestations reconcile target entity with full semantic content",
    "reason": "Meaningful typed source relationship preserved with verified canonical semantic target"
  },
  {
    "owner_entity_type": "section",
    "owner_entity_id": "section_21_04",
    "source_file": "immutable-chapter-input",
    "source_entity_id": "section_21_04",
    "relationship_field": "grammar_rule_ids",
    "source_reference_id": "rule_disjunctive_pronouns_moi_toi_lui",
    "source_text": "section_21_04",
    "resolution_class": "SOURCE_BACKED_ENTITY_RECONCILED",
    "canonical_target_id": "rule_disjunctive_pronouns_moi_toi_lui",
    "source_evidence": "Direct source curriculum / exercise attestations reconcile target entity with full semantic content",
    "reason": "Meaningful typed source relationship preserved with verified canonical semantic target"
  },
  {
    "owner_entity_type": "section",
    "owner_entity_id": "section_21_04",
    "source_file": "immutable-chapter-input",
    "source_entity_id": "section_21_04",
    "relationship_field": "expression_ids",
    "source_reference_id": "expr_quant_a_moi",
    "source_text": "section_21_04",
    "resolution_class": "SOURCE_BACKED_ENTITY_RECONCILED",
    "canonical_target_id": "expr_quant_a_moi",
    "source_evidence": "Direct source curriculum / exercise attestations reconcile target entity with full semantic content",
    "reason": "Meaningful typed source relationship preserved with verified canonical semantic target"
  },
  {
    "owner_entity_type": "section",
    "owner_entity_id": "section_21_04",
    "source_file": "immutable-chapter-input",
    "source_entity_id": "section_21_04",
    "relationship_field": "expression_ids",
    "source_reference_id": "expr_moi_aussi",
    "source_text": "section_21_04",
    "resolution_class": "SOURCE_BACKED_ENTITY_RECONCILED",
    "canonical_target_id": "expr_moi_aussi",
    "source_evidence": "Direct source curriculum / exercise attestations reconcile target entity with full semantic content",
    "reason": "Meaningful typed source relationship preserved with verified canonical semantic target"
  },
  {
    "owner_entity_type": "section",
    "owner_entity_id": "section_21_04",
    "source_file": "immutable-chapter-input",
    "source_entity_id": "section_21_04",
    "relationship_field": "example_ids",
    "source_reference_id": "example_disjunctive_001",
    "source_text": "section_21_04",
    "resolution_class": "SOURCE_BACKED_ENTITY_RECONCILED",
    "canonical_target_id": "example_disjunctive_001",
    "source_evidence": "Direct source curriculum / exercise attestations reconcile target entity with full semantic content",
    "reason": "Meaningful typed source relationship preserved with verified canonical semantic target"
  },
  {
    "owner_entity_type": "section",
    "owner_entity_id": "section_22_01",
    "source_file": "immutable-chapter-input",
    "source_entity_id": "section_22_01",
    "relationship_field": "concept_ids",
    "source_reference_id": "concept_adjective_agreement",
    "source_text": "section_22_01",
    "resolution_class": "SOURCE_BACKED_ENTITY_RECONCILED",
    "canonical_target_id": "concept_adjective_agreement",
    "source_evidence": "Direct source curriculum / exercise attestations reconcile target entity with full semantic content",
    "reason": "Meaningful typed source relationship preserved with verified canonical semantic target"
  },
  {
    "owner_entity_type": "section",
    "owner_entity_id": "section_22_02",
    "source_file": "immutable-chapter-input",
    "source_entity_id": "section_22_02",
    "relationship_field": "concept_ids",
    "source_reference_id": "concept_adjective_agreement",
    "source_text": "section_22_02",
    "resolution_class": "SOURCE_BACKED_ENTITY_RECONCILED",
    "canonical_target_id": "concept_adjective_agreement",
    "source_evidence": "Direct source curriculum / exercise attestations reconcile target entity with full semantic content",
    "reason": "Meaningful typed source relationship preserved with verified canonical semantic target"
  },
  {
    "owner_entity_type": "section",
    "owner_entity_id": "section_22_02",
    "source_file": "immutable-chapter-input",
    "source_entity_id": "section_22_02",
    "relationship_field": "grammar_rule_ids",
    "source_reference_id": "rule_comparative_plus_moins_aussi",
    "source_text": "section_22_02",
    "resolution_class": "SOURCE_BACKED_ENTITY_RECONCILED",
    "canonical_target_id": "rule_comparative_plus_moins_aussi",
    "source_evidence": "Direct source curriculum / exercise attestations reconcile target entity with full semantic content",
    "reason": "Meaningful typed source relationship preserved with verified canonical semantic target"
  },
  {
    "owner_entity_type": "section",
    "owner_entity_id": "section_22_02",
    "source_file": "immutable-chapter-input",
    "source_entity_id": "section_22_02",
    "relationship_field": "grammar_rule_ids",
    "source_reference_id": "rule_irregular_comparatives_meilleur_mieux",
    "source_text": "section_22_02",
    "resolution_class": "SOURCE_BACKED_ENTITY_RECONCILED",
    "canonical_target_id": "rule_irregular_comparatives_meilleur_mieux",
    "source_evidence": "Direct source curriculum / exercise attestations reconcile target entity with full semantic content",
    "reason": "Meaningful typed source relationship preserved with verified canonical semantic target"
  },
  {
    "owner_entity_type": "section",
    "owner_entity_id": "section_22_02",
    "source_file": "immutable-chapter-input",
    "source_entity_id": "section_22_02",
    "relationship_field": "expression_ids",
    "source_reference_id": "expr_plus_que",
    "source_text": "section_22_02",
    "resolution_class": "SOURCE_BACKED_ENTITY_RECONCILED",
    "canonical_target_id": "expr_plus_que",
    "source_evidence": "Direct source curriculum / exercise attestations reconcile target entity with full semantic content",
    "reason": "Meaningful typed source relationship preserved with verified canonical semantic target"
  },
  {
    "owner_entity_type": "section",
    "owner_entity_id": "section_22_02",
    "source_file": "immutable-chapter-input",
    "source_entity_id": "section_22_02",
    "relationship_field": "expression_ids",
    "source_reference_id": "expr_moins_que",
    "source_text": "section_22_02",
    "resolution_class": "SOURCE_BACKED_ENTITY_RECONCILED",
    "canonical_target_id": "expr_moins_que",
    "source_evidence": "Direct source curriculum / exercise attestations reconcile target entity with full semantic content",
    "reason": "Meaningful typed source relationship preserved with verified canonical semantic target"
  },
  {
    "owner_entity_type": "section",
    "owner_entity_id": "section_22_02",
    "source_file": "immutable-chapter-input",
    "source_entity_id": "section_22_02",
    "relationship_field": "expression_ids",
    "source_reference_id": "expr_aussi_que",
    "source_text": "section_22_02",
    "resolution_class": "SOURCE_BACKED_ENTITY_RECONCILED",
    "canonical_target_id": "expr_aussi_que",
    "source_evidence": "Direct source curriculum / exercise attestations reconcile target entity with full semantic content",
    "reason": "Meaningful typed source relationship preserved with verified canonical semantic target"
  },
  {
    "owner_entity_type": "section",
    "owner_entity_id": "section_22_02",
    "source_file": "immutable-chapter-input",
    "source_entity_id": "section_22_02",
    "relationship_field": "example_ids",
    "source_reference_id": "example_comp_001",
    "source_text": "section_22_02",
    "resolution_class": "SOURCE_BACKED_ENTITY_RECONCILED",
    "canonical_target_id": "example_comp_001",
    "source_evidence": "Direct source curriculum / exercise attestations reconcile target entity with full semantic content",
    "reason": "Meaningful typed source relationship preserved with verified canonical semantic target"
  },
  {
    "owner_entity_type": "section",
    "owner_entity_id": "section_23_01",
    "source_file": "immutable-chapter-input",
    "source_entity_id": "section_23_01",
    "relationship_field": "concept_ids",
    "source_reference_id": "concept_demonstratives_possessives",
    "source_text": "section_23_01",
    "resolution_class": "SOURCE_BACKED_ENTITY_RECONCILED",
    "canonical_target_id": "concept_demonstratives_possessives",
    "source_evidence": "Direct source curriculum / exercise attestations reconcile target entity with full semantic content",
    "reason": "Meaningful typed source relationship preserved with verified canonical semantic target"
  },
  {
    "owner_entity_type": "section",
    "owner_entity_id": "section_23_01",
    "source_file": "immutable-chapter-input",
    "source_entity_id": "section_23_01",
    "relationship_field": "grammar_rule_ids",
    "source_reference_id": "rule_possessive_adjectives_rules",
    "source_text": "section_23_01",
    "resolution_class": "SOURCE_BACKED_ENTITY_RECONCILED",
    "canonical_target_id": "rule_possessive_adjectives_rules",
    "source_evidence": "Direct source curriculum / exercise attestations reconcile target entity with full semantic content",
    "reason": "Meaningful typed source relationship preserved with verified canonical semantic target"
  },
  {
    "owner_entity_type": "section",
    "owner_entity_id": "section_23_02",
    "source_file": "immutable-chapter-input",
    "source_entity_id": "section_23_02",
    "relationship_field": "concept_ids",
    "source_reference_id": "concept_demonstratives_possessives",
    "source_text": "section_23_02",
    "resolution_class": "SOURCE_BACKED_ENTITY_RECONCILED",
    "canonical_target_id": "concept_demonstratives_possessives",
    "source_evidence": "Direct source curriculum / exercise attestations reconcile target entity with full semantic content",
    "reason": "Meaningful typed source relationship preserved with verified canonical semantic target"
  },
  {
    "owner_entity_type": "section",
    "owner_entity_id": "section_23_02",
    "source_file": "immutable-chapter-input",
    "source_entity_id": "section_23_02",
    "relationship_field": "grammar_rule_ids",
    "source_reference_id": "rule_possessive_pronouns_chart",
    "source_text": "section_23_02",
    "resolution_class": "SOURCE_BACKED_ENTITY_RECONCILED",
    "canonical_target_id": "rule_possessive_pronouns_chart",
    "source_evidence": "Direct source curriculum / exercise attestations reconcile target entity with full semantic content",
    "reason": "Meaningful typed source relationship preserved with verified canonical semantic target"
  },
  {
    "owner_entity_type": "section",
    "owner_entity_id": "section_23_02",
    "source_file": "immutable-chapter-input",
    "source_entity_id": "section_23_02",
    "relationship_field": "expression_ids",
    "source_reference_id": "expr_celui_ci",
    "source_text": "section_23_02",
    "resolution_class": "SOURCE_BACKED_ENTITY_RECONCILED",
    "canonical_target_id": "expr_celui_ci",
    "source_evidence": "Direct source curriculum / exercise attestations reconcile target entity with full semantic content",
    "reason": "Meaningful typed source relationship preserved with verified canonical semantic target"
  },
  {
    "owner_entity_type": "section",
    "owner_entity_id": "section_23_02",
    "source_file": "immutable-chapter-input",
    "source_entity_id": "section_23_02",
    "relationship_field": "expression_ids",
    "source_reference_id": "expr_celui_la",
    "source_text": "section_23_02",
    "resolution_class": "SOURCE_BACKED_ENTITY_RECONCILED",
    "canonical_target_id": "expr_celui_la",
    "source_evidence": "Direct source curriculum / exercise attestations reconcile target entity with full semantic content",
    "reason": "Meaningful typed source relationship preserved with verified canonical semantic target"
  },
  {
    "owner_entity_type": "section",
    "owner_entity_id": "section_24_01",
    "source_file": "immutable-chapter-input",
    "source_entity_id": "section_24_01",
    "relationship_field": "concept_ids",
    "source_reference_id": "concept_relative_pronouns",
    "source_text": "section_24_01",
    "resolution_class": "SOURCE_BACKED_ENTITY_RECONCILED",
    "canonical_target_id": "concept_relative_pronouns",
    "source_evidence": "Direct source curriculum / exercise attestations reconcile target entity with full semantic content",
    "reason": "Meaningful typed source relationship preserved with verified canonical semantic target"
  },
  {
    "owner_entity_type": "section",
    "owner_entity_id": "section_24_02",
    "source_file": "immutable-chapter-input",
    "source_entity_id": "section_24_02",
    "relationship_field": "concept_ids",
    "source_reference_id": "concept_relative_pronouns",
    "source_text": "section_24_02",
    "resolution_class": "SOURCE_BACKED_ENTITY_RECONCILED",
    "canonical_target_id": "concept_relative_pronouns",
    "source_evidence": "Direct source curriculum / exercise attestations reconcile target entity with full semantic content",
    "reason": "Meaningful typed source relationship preserved with verified canonical semantic target"
  },
  {
    "owner_entity_type": "section",
    "owner_entity_id": "section_24_02",
    "source_file": "immutable-chapter-input",
    "source_entity_id": "section_24_02",
    "relationship_field": "grammar_rule_ids",
    "source_reference_id": "rule_relative_pronoun_ou_and_lequel",
    "source_text": "section_24_02",
    "resolution_class": "SOURCE_BACKED_ENTITY_RECONCILED",
    "canonical_target_id": "rule_relative_pronoun_ou_and_lequel",
    "source_evidence": "Direct source curriculum / exercise attestations reconcile target entity with full semantic content",
    "reason": "Meaningful typed source relationship preserved with verified canonical semantic target"
  },
  {
    "owner_entity_type": "section",
    "owner_entity_id": "section_24_02",
    "source_file": "immutable-chapter-input",
    "source_entity_id": "section_24_02",
    "relationship_field": "expression_ids",
    "source_reference_id": "expr_ce_dont_j_ai_besoin",
    "source_text": "section_24_02",
    "resolution_class": "SOURCE_BACKED_ENTITY_RECONCILED",
    "canonical_target_id": "expr_ce_dont_j_ai_besoin",
    "source_evidence": "Direct source curriculum / exercise attestations reconcile target entity with full semantic content",
    "reason": "Meaningful typed source relationship preserved with verified canonical semantic target"
  },
  {
    "owner_entity_type": "section",
    "owner_entity_id": "section_24_02",
    "source_file": "immutable-chapter-input",
    "source_entity_id": "section_24_02",
    "relationship_field": "expression_ids",
    "source_reference_id": "expr_le_jour_ou",
    "source_text": "section_24_02",
    "resolution_class": "SOURCE_BACKED_ENTITY_RECONCILED",
    "canonical_target_id": "expr_le_jour_ou",
    "source_evidence": "Direct source curriculum / exercise attestations reconcile target entity with full semantic content",
    "reason": "Meaningful typed source relationship preserved with verified canonical semantic target"
  },
  {
    "owner_entity_type": "section",
    "owner_entity_id": "section_24_02",
    "source_file": "immutable-chapter-input",
    "source_entity_id": "section_24_02",
    "relationship_field": "example_ids",
    "source_reference_id": "example_ou_001",
    "source_text": "section_24_02",
    "resolution_class": "SOURCE_BACKED_ENTITY_RECONCILED",
    "canonical_target_id": "example_ou_001",
    "source_evidence": "Direct source curriculum / exercise attestations reconcile target entity with full semantic content",
    "reason": "Meaningful typed source relationship preserved with verified canonical semantic target"
  },
  {
    "owner_entity_type": "section",
    "owner_entity_id": "section_24_03",
    "source_file": "immutable-chapter-input",
    "source_entity_id": "section_24_03",
    "relationship_field": "concept_ids",
    "source_reference_id": "concept_relative_pronouns",
    "source_text": "section_24_03",
    "resolution_class": "SOURCE_BACKED_ENTITY_RECONCILED",
    "canonical_target_id": "concept_relative_pronouns",
    "source_evidence": "Direct source curriculum / exercise attestations reconcile target entity with full semantic content",
    "reason": "Meaningful typed source relationship preserved with verified canonical semantic target"
  },
  {
    "owner_entity_type": "section",
    "owner_entity_id": "section_24_03",
    "source_file": "immutable-chapter-input",
    "source_entity_id": "section_24_03",
    "relationship_field": "grammar_rule_ids",
    "source_reference_id": "rule_indefinite_relative_pronouns_ce_qui_ce_que_ce_dont",
    "source_text": "section_24_03",
    "resolution_class": "SOURCE_BACKED_ENTITY_RECONCILED",
    "canonical_target_id": "rule_indefinite_relative_pronouns_ce_qui_ce_que_ce_dont",
    "source_evidence": "Direct source curriculum / exercise attestations reconcile target entity with full semantic content",
    "reason": "Meaningful typed source relationship preserved with verified canonical semantic target"
  },
  {
    "owner_entity_type": "section",
    "owner_entity_id": "section_24_03",
    "source_file": "immutable-chapter-input",
    "source_entity_id": "section_24_03",
    "relationship_field": "expression_ids",
    "source_reference_id": "expr_ce_qui_me_plait",
    "source_text": "section_24_03",
    "resolution_class": "SOURCE_BACKED_ENTITY_RECONCILED",
    "canonical_target_id": "expr_ce_qui_me_plait",
    "source_evidence": "Direct source curriculum / exercise attestations reconcile target entity with full semantic content",
    "reason": "Meaningful typed source relationship preserved with verified canonical semantic target"
  },
  {
    "owner_entity_type": "section",
    "owner_entity_id": "section_24_03",
    "source_file": "immutable-chapter-input",
    "source_entity_id": "section_24_03",
    "relationship_field": "expression_ids",
    "source_reference_id": "expr_ce_que_je_pense",
    "source_text": "section_24_03",
    "resolution_class": "SOURCE_BACKED_ENTITY_RECONCILED",
    "canonical_target_id": "expr_ce_que_je_pense",
    "source_evidence": "Direct source curriculum / exercise attestations reconcile target entity with full semantic content",
    "reason": "Meaningful typed source relationship preserved with verified canonical semantic target"
  },
  {
    "owner_entity_type": "section",
    "owner_entity_id": "section_24_03",
    "source_file": "immutable-chapter-input",
    "source_entity_id": "section_24_03",
    "relationship_field": "expression_ids",
    "source_reference_id": "expr_ce_a_quoi_je_pense",
    "source_text": "section_24_03",
    "resolution_class": "SOURCE_BACKED_ENTITY_RECONCILED",
    "canonical_target_id": "expr_ce_a_quoi_je_pense",
    "source_evidence": "Direct source curriculum / exercise attestations reconcile target entity with full semantic content",
    "reason": "Meaningful typed source relationship preserved with verified canonical semantic target"
  },
  {
    "owner_entity_type": "section",
    "owner_entity_id": "section_25_01",
    "source_file": "immutable-chapter-input",
    "source_entity_id": "section_25_01",
    "relationship_field": "expression_ids",
    "source_reference_id": "expr_de_temps_en_temps",
    "source_text": "section_25_01",
    "resolution_class": "SOURCE_BACKED_ENTITY_RECONCILED",
    "canonical_target_id": "expr_de_temps_en_temps",
    "source_evidence": "Direct source curriculum / exercise attestations reconcile target entity with full semantic content",
    "reason": "Meaningful typed source relationship preserved with verified canonical semantic target"
  },
  {
    "owner_entity_type": "section",
    "owner_entity_id": "section_25_01",
    "source_file": "immutable-chapter-input",
    "source_entity_id": "section_25_01",
    "relationship_field": "expression_ids",
    "source_reference_id": "expr_tout_a_l_heure",
    "source_text": "section_25_01",
    "resolution_class": "SOURCE_BACKED_ENTITY_RECONCILED",
    "canonical_target_id": "expr_tout_a_l_heure",
    "source_evidence": "Direct source curriculum / exercise attestations reconcile target entity with full semantic content",
    "reason": "Meaningful typed source relationship preserved with verified canonical semantic target"
  },
  {
    "owner_entity_type": "section",
    "owner_entity_id": "section_25_01",
    "source_file": "immutable-chapter-input",
    "source_entity_id": "section_25_01",
    "relationship_field": "expression_ids",
    "source_reference_id": "expr_en_ce_moment",
    "source_text": "section_25_01",
    "resolution_class": "SOURCE_BACKED_ENTITY_RECONCILED",
    "canonical_target_id": "expr_en_ce_moment",
    "source_evidence": "Direct source curriculum / exercise attestations reconcile target entity with full semantic content",
    "reason": "Meaningful typed source relationship preserved with verified canonical semantic target"
  },
  {
    "owner_entity_type": "section",
    "owner_entity_id": "section_27_01",
    "source_file": "immutable-chapter-input",
    "source_entity_id": "section_27_01",
    "relationship_field": "concept_ids",
    "source_reference_id": "concept_verb_preposition_patterns",
    "source_text": "section_27_01",
    "resolution_class": "SOURCE_BACKED_ENTITY_RECONCILED",
    "canonical_target_id": "concept_verb_preposition_patterns",
    "source_evidence": "Direct source curriculum / exercise attestations reconcile target entity with full semantic content",
    "reason": "Meaningful typed source relationship preserved with verified canonical semantic target"
  },
  {
    "owner_entity_type": "section",
    "owner_entity_id": "section_27_01",
    "source_file": "immutable-chapter-input",
    "source_entity_id": "section_27_01",
    "relationship_field": "verb_ids",
    "source_reference_id": "verb_manquer",
    "source_text": "section_27_01",
    "resolution_class": "SOURCE_BACKED_ENTITY_RECONCILED",
    "canonical_target_id": "verb_manquer",
    "source_evidence": "Direct source curriculum / exercise attestations reconcile target entity with full semantic content",
    "reason": "Meaningful typed source relationship preserved with verified canonical semantic target"
  },
  {
    "owner_entity_type": "section",
    "owner_entity_id": "section_27_01",
    "source_file": "immutable-chapter-input",
    "source_entity_id": "section_27_01",
    "relationship_field": "expression_ids",
    "source_reference_id": "expr_penser_de",
    "source_text": "section_27_01",
    "resolution_class": "SOURCE_BACKED_ENTITY_RECONCILED",
    "canonical_target_id": "expr_penser_de",
    "source_evidence": "Direct source curriculum / exercise attestations reconcile target entity with full semantic content",
    "reason": "Meaningful typed source relationship preserved with verified canonical semantic target"
  },
  {
    "owner_entity_type": "section",
    "owner_entity_id": "section_27_01",
    "source_file": "immutable-chapter-input",
    "source_entity_id": "section_27_01",
    "relationship_field": "expression_ids",
    "source_reference_id": "expr_manquer_de",
    "source_text": "section_27_01",
    "resolution_class": "SOURCE_BACKED_ENTITY_RECONCILED",
    "canonical_target_id": "expr_manquer_de",
    "source_evidence": "Direct source curriculum / exercise attestations reconcile target entity with full semantic content",
    "reason": "Meaningful typed source relationship preserved with verified canonical semantic target"
  },
  {
    "owner_entity_type": "section",
    "owner_entity_id": "section_27_01",
    "source_file": "immutable-chapter-input",
    "source_entity_id": "section_27_01",
    "relationship_field": "expression_ids",
    "source_reference_id": "expr_manquer_a",
    "source_text": "section_27_01",
    "resolution_class": "SOURCE_BACKED_ENTITY_RECONCILED",
    "canonical_target_id": "expr_manquer_a",
    "source_evidence": "Direct source curriculum / exercise attestations reconcile target entity with full semantic content",
    "reason": "Meaningful typed source relationship preserved with verified canonical semantic target"
  },
  {
    "owner_entity_type": "section",
    "owner_entity_id": "section_27_01",
    "source_file": "immutable-chapter-input",
    "source_entity_id": "section_27_01",
    "relationship_field": "expression_ids",
    "source_reference_id": "expr_jouer_a",
    "source_text": "section_27_01",
    "resolution_class": "SOURCE_BACKED_ENTITY_RECONCILED",
    "canonical_target_id": "expr_jouer_a",
    "source_evidence": "Direct source curriculum / exercise attestations reconcile target entity with full semantic content",
    "reason": "Meaningful typed source relationship preserved with verified canonical semantic target"
  },
  {
    "owner_entity_type": "section",
    "owner_entity_id": "section_27_01",
    "source_file": "immutable-chapter-input",
    "source_entity_id": "section_27_01",
    "relationship_field": "expression_ids",
    "source_reference_id": "expr_jouer_de",
    "source_text": "section_27_01",
    "resolution_class": "SOURCE_BACKED_ENTITY_RECONCILED",
    "canonical_target_id": "expr_jouer_de",
    "source_evidence": "Direct source curriculum / exercise attestations reconcile target entity with full semantic content",
    "reason": "Meaningful typed source relationship preserved with verified canonical semantic target"
  },
  {
    "owner_entity_type": "section",
    "owner_entity_id": "section_27_02",
    "source_file": "immutable-chapter-input",
    "source_entity_id": "section_27_02",
    "relationship_field": "expression_ids",
    "source_reference_id": "expr_n_importe_qui",
    "source_text": "section_27_02",
    "resolution_class": "SOURCE_BACKED_ENTITY_RECONCILED",
    "canonical_target_id": "expr_n_importe_qui",
    "source_evidence": "Direct source curriculum / exercise attestations reconcile target entity with full semantic content",
    "reason": "Meaningful typed source relationship preserved with verified canonical semantic target"
  },
  {
    "owner_entity_type": "section",
    "owner_entity_id": "section_27_02",
    "source_file": "immutable-chapter-input",
    "source_entity_id": "section_27_02",
    "relationship_field": "expression_ids",
    "source_reference_id": "expr_n_importe_ou",
    "source_text": "section_27_02",
    "resolution_class": "SOURCE_BACKED_ENTITY_RECONCILED",
    "canonical_target_id": "expr_n_importe_ou",
    "source_evidence": "Direct source curriculum / exercise attestations reconcile target entity with full semantic content",
    "reason": "Meaningful typed source relationship preserved with verified canonical semantic target"
  },
  {
    "owner_entity_type": "section",
    "owner_entity_id": "section_27_02",
    "source_file": "immutable-chapter-input",
    "source_entity_id": "section_27_02",
    "relationship_field": "expression_ids",
    "source_reference_id": "expr_n_importe_quand",
    "source_text": "section_27_02",
    "resolution_class": "SOURCE_BACKED_ENTITY_RECONCILED",
    "canonical_target_id": "expr_n_importe_quand",
    "source_evidence": "Direct source curriculum / exercise attestations reconcile target entity with full semantic content",
    "reason": "Meaningful typed source relationship preserved with verified canonical semantic target"
  },
  {
    "owner_entity_type": "section",
    "owner_entity_id": "section_27_02",
    "source_file": "immutable-chapter-input",
    "source_entity_id": "section_27_02",
    "relationship_field": "expression_ids",
    "source_reference_id": "expr_quitte_a_inf",
    "source_text": "section_27_02",
    "resolution_class": "SOURCE_BACKED_ENTITY_RECONCILED",
    "canonical_target_id": "expr_quitte_a_inf",
    "source_evidence": "Direct source curriculum / exercise attestations reconcile target entity with full semantic content",
    "reason": "Meaningful typed source relationship preserved with verified canonical semantic target"
  },
  {
    "owner_entity_type": "grammar_rule",
    "owner_entity_id": "rule_interrogative_formation_methods",
    "source_file": "immutable-chapter-input",
    "source_entity_id": "rule_interrogative_formation_methods",
    "relationship_field": "concept_ids",
    "source_reference_id": "concept_interrogation",
    "source_text": "rule_interrogative_formation_methods",
    "resolution_class": "SOURCE_BACKED_ENTITY_RECONCILED",
    "canonical_target_id": "concept_interrogation",
    "source_evidence": "Direct source curriculum / exercise attestations reconcile target entity with full semantic content",
    "reason": "Meaningful typed source relationship preserved with verified canonical semantic target"
  },
  {
    "owner_entity_type": "grammar_rule",
    "owner_entity_id": "rule_negative_form_ne_pas",
    "source_file": "immutable-chapter-input",
    "source_entity_id": "rule_negative_form_ne_pas",
    "relationship_field": "concept_ids",
    "source_reference_id": "concept_negation",
    "source_text": "rule_negative_form_ne_pas",
    "resolution_class": "SOURCE_BACKED_ENTITY_RECONCILED",
    "canonical_target_id": "concept_negation",
    "source_evidence": "Direct source curriculum / exercise attestations reconcile target entity with full semantic content",
    "reason": "Meaningful typed source relationship preserved with verified canonical semantic target"
  },
  {
    "owner_entity_type": "grammar_rule",
    "owner_entity_id": "rule_negative_words_jamais_plus_rien_personne",
    "source_file": "immutable-chapter-input",
    "source_entity_id": "rule_negative_words_jamais_plus_rien_personne",
    "relationship_field": "concept_ids",
    "source_reference_id": "concept_negation",
    "source_text": "rule_negative_words_jamais_plus_rien_personne",
    "resolution_class": "SOURCE_BACKED_ENTITY_RECONCILED",
    "canonical_target_id": "concept_negation",
    "source_evidence": "Direct source curriculum / exercise attestations reconcile target entity with full semantic content",
    "reason": "Meaningful typed source relationship preserved with verified canonical semantic target"
  },
  {
    "owner_entity_type": "grammar_rule",
    "owner_entity_id": "rule_verb_aller_present_conjugation",
    "source_file": "immutable-chapter-input",
    "source_entity_id": "rule_verb_aller_present_conjugation",
    "relationship_field": "concept_ids",
    "source_reference_id": "concept_movement",
    "source_text": "rule_verb_aller_present_conjugation",
    "resolution_class": "SOURCE_BACKED_ENTITY_RECONCILED",
    "canonical_target_id": "concept_movement",
    "source_evidence": "Direct source curriculum / exercise attestations reconcile target entity with full semantic content",
    "reason": "Meaningful typed source relationship preserved with verified canonical semantic target"
  },
  {
    "owner_entity_type": "grammar_rule",
    "owner_entity_id": "rule_verb_venir_present_conjugation",
    "source_file": "immutable-chapter-input",
    "source_entity_id": "rule_verb_venir_present_conjugation",
    "relationship_field": "concept_ids",
    "source_reference_id": "concept_movement",
    "source_text": "rule_verb_venir_present_conjugation",
    "resolution_class": "SOURCE_BACKED_ENTITY_RECONCILED",
    "canonical_target_id": "concept_movement",
    "source_evidence": "Direct source curriculum / exercise attestations reconcile target entity with full semantic content",
    "reason": "Meaningful typed source relationship preserved with verified canonical semantic target"
  },
  {
    "owner_entity_type": "grammar_rule",
    "owner_entity_id": "rule_reflexive_verbs_conjugation_and_pronouns",
    "source_file": "immutable-chapter-input",
    "source_entity_id": "rule_reflexive_verbs_conjugation_and_pronouns",
    "relationship_field": "concept_ids",
    "source_reference_id": "concept_pronominal_verbs",
    "source_text": "rule_reflexive_verbs_conjugation_and_pronouns",
    "resolution_class": "SOURCE_BACKED_ENTITY_RECONCILED",
    "canonical_target_id": "concept_pronominal_verbs",
    "source_evidence": "Direct source curriculum / exercise attestations reconcile target entity with full semantic content",
    "reason": "Meaningful typed source relationship preserved with verified canonical semantic target"
  },
  {
    "owner_entity_type": "grammar_rule",
    "owner_entity_id": "rule_reciprocal_verbs_usage",
    "source_file": "immutable-chapter-input",
    "source_entity_id": "rule_reciprocal_verbs_usage",
    "relationship_field": "concept_ids",
    "source_reference_id": "concept_pronominal_verbs",
    "source_text": "rule_reciprocal_verbs_usage",
    "resolution_class": "SOURCE_BACKED_ENTITY_RECONCILED",
    "canonical_target_id": "concept_pronominal_verbs",
    "source_evidence": "Direct source curriculum / exercise attestations reconcile target entity with full semantic content",
    "reason": "Meaningful typed source relationship preserved with verified canonical semantic target"
  },
  {
    "owner_entity_type": "grammar_rule",
    "owner_entity_id": "rule_passive_and_idiomatic_pronominals",
    "source_file": "immutable-chapter-input",
    "source_entity_id": "rule_passive_and_idiomatic_pronominals",
    "relationship_field": "concept_ids",
    "source_reference_id": "concept_pronominal_verbs",
    "source_text": "rule_passive_and_idiomatic_pronominals",
    "resolution_class": "SOURCE_BACKED_ENTITY_RECONCILED",
    "canonical_target_id": "concept_pronominal_verbs",
    "source_evidence": "Direct source curriculum / exercise attestations reconcile target entity with full semantic content",
    "reason": "Meaningful typed source relationship preserved with verified canonical semantic target"
  },
  {
    "owner_entity_type": "grammar_rule",
    "owner_entity_id": "rule_pronominals_imperative_and_infinitive_position",
    "source_file": "immutable-chapter-input",
    "source_entity_id": "rule_pronominals_imperative_and_infinitive_position",
    "relationship_field": "concept_ids",
    "source_reference_id": "concept_pronominal_verbs",
    "source_text": "rule_pronominals_imperative_and_infinitive_position",
    "resolution_class": "SOURCE_BACKED_ENTITY_RECONCILED",
    "canonical_target_id": "concept_pronominal_verbs",
    "source_evidence": "Direct source curriculum / exercise attestations reconcile target entity with full semantic content",
    "reason": "Meaningful typed source relationship preserved with verified canonical semantic target"
  },
  {
    "owner_entity_type": "grammar_rule",
    "owner_entity_id": "rule_past_participle_regular_endings",
    "source_file": "immutable-chapter-input",
    "source_entity_id": "rule_past_participle_regular_endings",
    "relationship_field": "concept_ids",
    "source_reference_id": "concept_past_time",
    "source_text": "rule_past_participle_regular_endings",
    "resolution_class": "SOURCE_BACKED_ENTITY_RECONCILED",
    "canonical_target_id": "concept_past_time",
    "source_evidence": "Direct source curriculum / exercise attestations reconcile target entity with full semantic content",
    "reason": "Meaningful typed source relationship preserved with verified canonical semantic target"
  },
  {
    "owner_entity_type": "grammar_rule",
    "owner_entity_id": "rule_passe_compose_with_avoir_formation",
    "source_file": "immutable-chapter-input",
    "source_entity_id": "rule_passe_compose_with_avoir_formation",
    "relationship_field": "concept_ids",
    "source_reference_id": "concept_past_time",
    "source_text": "rule_passe_compose_with_avoir_formation",
    "resolution_class": "SOURCE_BACKED_ENTITY_RECONCILED",
    "canonical_target_id": "concept_past_time",
    "source_evidence": "Direct source curriculum / exercise attestations reconcile target entity with full semantic content",
    "reason": "Meaningful typed source relationship preserved with verified canonical semantic target"
  },
  {
    "owner_entity_type": "grammar_rule",
    "owner_entity_id": "rule_agreement_with_preceding_direct_object",
    "source_file": "immutable-chapter-input",
    "source_entity_id": "rule_agreement_with_preceding_direct_object",
    "relationship_field": "concept_ids",
    "source_reference_id": "concept_past_time",
    "source_text": "rule_agreement_with_preceding_direct_object",
    "resolution_class": "SOURCE_BACKED_ENTITY_RECONCILED",
    "canonical_target_id": "concept_past_time",
    "source_evidence": "Direct source curriculum / exercise attestations reconcile target entity with full semantic content",
    "reason": "Meaningful typed source relationship preserved with verified canonical semantic target"
  },
  {
    "owner_entity_type": "grammar_rule",
    "owner_entity_id": "rule_vandertramp_verbs_with_etre",
    "source_file": "immutable-chapter-input",
    "source_entity_id": "rule_vandertramp_verbs_with_etre",
    "relationship_field": "concept_ids",
    "source_reference_id": "concept_past_time",
    "source_text": "rule_vandertramp_verbs_with_etre",
    "resolution_class": "SOURCE_BACKED_ENTITY_RECONCILED",
    "canonical_target_id": "concept_past_time",
    "source_evidence": "Direct source curriculum / exercise attestations reconcile target entity with full semantic content",
    "reason": "Meaningful typed source relationship preserved with verified canonical semantic target"
  },
  {
    "owner_entity_type": "grammar_rule",
    "owner_entity_id": "rule_vandertramp_verbs_with_etre",
    "source_file": "immutable-chapter-input",
    "source_entity_id": "rule_vandertramp_verbs_with_etre",
    "relationship_field": "concept_ids",
    "source_reference_id": "concept_movement",
    "source_text": "rule_vandertramp_verbs_with_etre",
    "resolution_class": "SOURCE_BACKED_ENTITY_RECONCILED",
    "canonical_target_id": "concept_movement",
    "source_evidence": "Direct source curriculum / exercise attestations reconcile target entity with full semantic content",
    "reason": "Meaningful typed source relationship preserved with verified canonical semantic target"
  },
  {
    "owner_entity_type": "grammar_rule",
    "owner_entity_id": "rule_verbs_with_both_avoir_and_etre",
    "source_file": "immutable-chapter-input",
    "source_entity_id": "rule_verbs_with_both_avoir_and_etre",
    "relationship_field": "concept_ids",
    "source_reference_id": "concept_past_time",
    "source_text": "rule_verbs_with_both_avoir_and_etre",
    "resolution_class": "SOURCE_BACKED_ENTITY_RECONCILED",
    "canonical_target_id": "concept_past_time",
    "source_evidence": "Direct source curriculum / exercise attestations reconcile target entity with full semantic content",
    "reason": "Meaningful typed source relationship preserved with verified canonical semantic target"
  },
  {
    "owner_entity_type": "grammar_rule",
    "owner_entity_id": "rule_imparfait_formation_rule",
    "source_file": "immutable-chapter-input",
    "source_entity_id": "rule_imparfait_formation_rule",
    "relationship_field": "concept_ids",
    "source_reference_id": "concept_past_time",
    "source_text": "rule_imparfait_formation_rule",
    "resolution_class": "SOURCE_BACKED_ENTITY_RECONCILED",
    "canonical_target_id": "concept_past_time",
    "source_evidence": "Direct source curriculum / exercise attestations reconcile target entity with full semantic content",
    "reason": "Meaningful typed source relationship preserved with verified canonical semantic target"
  },
  {
    "owner_entity_type": "grammar_rule",
    "owner_entity_id": "rule_imparfait_vs_passe_compose_master_contrast",
    "source_file": "immutable-chapter-input",
    "source_entity_id": "rule_imparfait_vs_passe_compose_master_contrast",
    "relationship_field": "concept_ids",
    "source_reference_id": "concept_past_time",
    "source_text": "rule_imparfait_vs_passe_compose_master_contrast",
    "resolution_class": "SOURCE_BACKED_ENTITY_RECONCILED",
    "canonical_target_id": "concept_past_time",
    "source_evidence": "Direct source curriculum / exercise attestations reconcile target entity with full semantic content",
    "reason": "Meaningful typed source relationship preserved with verified canonical semantic target"
  },
  {
    "owner_entity_type": "grammar_rule",
    "owner_entity_id": "rule_si_plus_imparfait_suggestions",
    "source_file": "immutable-chapter-input",
    "source_entity_id": "rule_si_plus_imparfait_suggestions",
    "relationship_field": "concept_ids",
    "source_reference_id": "concept_past_time",
    "source_text": "rule_si_plus_imparfait_suggestions",
    "resolution_class": "SOURCE_BACKED_ENTITY_RECONCILED",
    "canonical_target_id": "concept_past_time",
    "source_evidence": "Direct source curriculum / exercise attestations reconcile target entity with full semantic content",
    "reason": "Meaningful typed source relationship preserved with verified canonical semantic target"
  },
  {
    "owner_entity_type": "grammar_rule",
    "owner_entity_id": "rule_plus_que_parfait_formation_rule",
    "source_file": "immutable-chapter-input",
    "source_entity_id": "rule_plus_que_parfait_formation_rule",
    "relationship_field": "concept_ids",
    "source_reference_id": "concept_past_time",
    "source_text": "rule_plus_que_parfait_formation_rule",
    "resolution_class": "SOURCE_BACKED_ENTITY_RECONCILED",
    "canonical_target_id": "concept_past_time",
    "source_evidence": "Direct source curriculum / exercise attestations reconcile target entity with full semantic content",
    "reason": "Meaningful typed source relationship preserved with verified canonical semantic target"
  },
  {
    "owner_entity_type": "grammar_rule",
    "owner_entity_id": "rule_plus_que_parfait_usage_and_si_seulement",
    "source_file": "immutable-chapter-input",
    "source_entity_id": "rule_plus_que_parfait_usage_and_si_seulement",
    "relationship_field": "concept_ids",
    "source_reference_id": "concept_past_time",
    "source_text": "rule_plus_que_parfait_usage_and_si_seulement",
    "resolution_class": "SOURCE_BACKED_ENTITY_RECONCILED",
    "canonical_target_id": "concept_past_time",
    "source_evidence": "Direct source curriculum / exercise attestations reconcile target entity with full semantic content",
    "reason": "Meaningful typed source relationship preserved with verified canonical semantic target"
  },
  {
    "owner_entity_type": "grammar_rule",
    "owner_entity_id": "rule_infinitive_after_prepositions_and_as_subject",
    "source_file": "immutable-chapter-input",
    "source_entity_id": "rule_infinitive_after_prepositions_and_as_subject",
    "relationship_field": "concept_ids",
    "source_reference_id": "concept_verb_preposition_patterns",
    "source_text": "rule_infinitive_after_prepositions_and_as_subject",
    "resolution_class": "SOURCE_BACKED_ENTITY_RECONCILED",
    "canonical_target_id": "concept_verb_preposition_patterns",
    "source_evidence": "Direct source curriculum / exercise attestations reconcile target entity with full semantic content",
    "reason": "Meaningful typed source relationship preserved with verified canonical semantic target"
  },
  {
    "owner_entity_type": "grammar_rule",
    "owner_entity_id": "rule_verbs_requiring_preposition_a",
    "source_file": "immutable-chapter-input",
    "source_entity_id": "rule_verbs_requiring_preposition_a",
    "relationship_field": "concept_ids",
    "source_reference_id": "concept_verb_preposition_patterns",
    "source_text": "rule_verbs_requiring_preposition_a",
    "resolution_class": "SOURCE_BACKED_ENTITY_RECONCILED",
    "canonical_target_id": "concept_verb_preposition_patterns",
    "source_evidence": "Direct source curriculum / exercise attestations reconcile target entity with full semantic content",
    "reason": "Meaningful typed source relationship preserved with verified canonical semantic target"
  },
  {
    "owner_entity_type": "grammar_rule",
    "owner_entity_id": "rule_verbs_requiring_preposition_de",
    "source_file": "immutable-chapter-input",
    "source_entity_id": "rule_verbs_requiring_preposition_de",
    "relationship_field": "concept_ids",
    "source_reference_id": "concept_verb_preposition_patterns",
    "source_text": "rule_verbs_requiring_preposition_de",
    "resolution_class": "SOURCE_BACKED_ENTITY_RECONCILED",
    "canonical_target_id": "concept_verb_preposition_patterns",
    "source_evidence": "Direct source curriculum / exercise attestations reconcile target entity with full semantic content",
    "reason": "Meaningful typed source relationship preserved with verified canonical semantic target"
  },
  {
    "owner_entity_type": "grammar_rule",
    "owner_entity_id": "rule_verbs_taking_direct_infinitive",
    "source_file": "immutable-chapter-input",
    "source_entity_id": "rule_verbs_taking_direct_infinitive",
    "relationship_field": "concept_ids",
    "source_reference_id": "concept_verb_preposition_patterns",
    "source_text": "rule_verbs_taking_direct_infinitive",
    "resolution_class": "SOURCE_BACKED_ENTITY_RECONCILED",
    "canonical_target_id": "concept_verb_preposition_patterns",
    "source_evidence": "Direct source curriculum / exercise attestations reconcile target entity with full semantic content",
    "reason": "Meaningful typed source relationship preserved with verified canonical semantic target"
  },
  {
    "owner_entity_type": "grammar_rule",
    "owner_entity_id": "rule_passe_simple_regular_endings",
    "source_file": "immutable-chapter-input",
    "source_entity_id": "rule_passe_simple_regular_endings",
    "relationship_field": "concept_ids",
    "source_reference_id": "concept_past_time",
    "source_text": "rule_passe_simple_regular_endings",
    "resolution_class": "SOURCE_BACKED_ENTITY_RECONCILED",
    "canonical_target_id": "concept_past_time",
    "source_evidence": "Direct source curriculum / exercise attestations reconcile target entity with full semantic content",
    "reason": "Meaningful typed source relationship preserved with verified canonical semantic target"
  },
  {
    "owner_entity_type": "grammar_rule",
    "owner_entity_id": "rule_passe_simple_irregular_verbs_patterns",
    "source_file": "immutable-chapter-input",
    "source_entity_id": "rule_passe_simple_irregular_verbs_patterns",
    "relationship_field": "concept_ids",
    "source_reference_id": "concept_past_time",
    "source_text": "rule_passe_simple_irregular_verbs_patterns",
    "resolution_class": "SOURCE_BACKED_ENTITY_RECONCILED",
    "canonical_target_id": "concept_past_time",
    "source_evidence": "Direct source curriculum / exercise attestations reconcile target entity with full semantic content",
    "reason": "Meaningful typed source relationship preserved with verified canonical semantic target"
  },
  {
    "owner_entity_type": "grammar_rule",
    "owner_entity_id": "rule_passive_voice_formation_and_agreement",
    "source_file": "immutable-chapter-input",
    "source_entity_id": "rule_passive_voice_formation_and_agreement",
    "relationship_field": "concept_ids",
    "source_reference_id": "concept_passive_voice",
    "source_text": "rule_passive_voice_formation_and_agreement",
    "resolution_class": "SOURCE_BACKED_ENTITY_RECONCILED",
    "canonical_target_id": "concept_passive_voice",
    "source_evidence": "Direct source curriculum / exercise attestations reconcile target entity with full semantic content",
    "reason": "Meaningful typed source relationship preserved with verified canonical semantic target"
  },
  {
    "owner_entity_type": "grammar_rule",
    "owner_entity_id": "rule_avoiding_passive_voice_with_on_and_pronominals",
    "source_file": "immutable-chapter-input",
    "source_entity_id": "rule_avoiding_passive_voice_with_on_and_pronominals",
    "relationship_field": "concept_ids",
    "source_reference_id": "concept_passive_voice",
    "source_text": "rule_avoiding_passive_voice_with_on_and_pronominals",
    "resolution_class": "SOURCE_BACKED_ENTITY_RECONCILED",
    "canonical_target_id": "concept_passive_voice",
    "source_evidence": "Direct source curriculum / exercise attestations reconcile target entity with full semantic content",
    "reason": "Meaningful typed source relationship preserved with verified canonical semantic target"
  },
  {
    "owner_entity_type": "grammar_rule",
    "owner_entity_id": "rule_direct_to_indirect_speech_transformations",
    "source_file": "immutable-chapter-input",
    "source_entity_id": "rule_direct_to_indirect_speech_transformations",
    "relationship_field": "concept_ids",
    "source_reference_id": "concept_indirect_speech",
    "source_text": "rule_direct_to_indirect_speech_transformations",
    "resolution_class": "SOURCE_BACKED_ENTITY_RECONCILED",
    "canonical_target_id": "concept_indirect_speech",
    "source_evidence": "Direct source curriculum / exercise attestations reconcile target entity with full semantic content",
    "reason": "Meaningful typed source relationship preserved with verified canonical semantic target"
  },
  {
    "owner_entity_type": "grammar_rule",
    "owner_entity_id": "rule_concordance_des_temps_tense_shifts",
    "source_file": "immutable-chapter-input",
    "source_entity_id": "rule_concordance_des_temps_tense_shifts",
    "relationship_field": "concept_ids",
    "source_reference_id": "concept_indirect_speech",
    "source_text": "rule_concordance_des_temps_tense_shifts",
    "resolution_class": "SOURCE_BACKED_ENTITY_RECONCILED",
    "canonical_target_id": "concept_indirect_speech",
    "source_evidence": "Direct source curriculum / exercise attestations reconcile target entity with full semantic content",
    "reason": "Meaningful typed source relationship preserved with verified canonical semantic target"
  },
  {
    "owner_entity_type": "grammar_rule",
    "owner_entity_id": "rule_imperative_pronominal_affirmative_vs_negative",
    "source_file": "immutable-chapter-input",
    "source_entity_id": "rule_imperative_pronominal_affirmative_vs_negative",
    "relationship_field": "concept_ids",
    "source_reference_id": "concept_pronominal_verbs",
    "source_text": "rule_imperative_pronominal_affirmative_vs_negative",
    "resolution_class": "SOURCE_BACKED_ENTITY_RECONCILED",
    "canonical_target_id": "concept_pronominal_verbs",
    "source_evidence": "Direct source curriculum / exercise attestations reconcile target entity with full semantic content",
    "reason": "Meaningful typed source relationship preserved with verified canonical semantic target"
  },
  {
    "owner_entity_type": "grammar_rule",
    "owner_entity_id": "rule_direct_object_pronouns_le_la_les",
    "source_file": "immutable-chapter-input",
    "source_entity_id": "rule_direct_object_pronouns_le_la_les",
    "relationship_field": "concept_ids",
    "source_reference_id": "concept_object_pronouns",
    "source_text": "rule_direct_object_pronouns_le_la_les",
    "resolution_class": "SOURCE_BACKED_ENTITY_RECONCILED",
    "canonical_target_id": "concept_object_pronouns",
    "source_evidence": "Direct source curriculum / exercise attestations reconcile target entity with full semantic content",
    "reason": "Meaningful typed source relationship preserved with verified canonical semantic target"
  },
  {
    "owner_entity_type": "grammar_rule",
    "owner_entity_id": "rule_indirect_object_pronouns_lui_leur",
    "source_file": "immutable-chapter-input",
    "source_entity_id": "rule_indirect_object_pronouns_lui_leur",
    "relationship_field": "concept_ids",
    "source_reference_id": "concept_object_pronouns",
    "source_text": "rule_indirect_object_pronouns_lui_leur",
    "resolution_class": "SOURCE_BACKED_ENTITY_RECONCILED",
    "canonical_target_id": "concept_object_pronouns",
    "source_evidence": "Direct source curriculum / exercise attestations reconcile target entity with full semantic content",
    "reason": "Meaningful typed source relationship preserved with verified canonical semantic target"
  },
  {
    "owner_entity_type": "grammar_rule",
    "owner_entity_id": "rule_double_object_pronoun_order_chart",
    "source_file": "immutable-chapter-input",
    "source_entity_id": "rule_double_object_pronoun_order_chart",
    "relationship_field": "concept_ids",
    "source_reference_id": "concept_object_pronouns",
    "source_text": "rule_double_object_pronoun_order_chart",
    "resolution_class": "SOURCE_BACKED_ENTITY_RECONCILED",
    "canonical_target_id": "concept_object_pronouns",
    "source_evidence": "Direct source curriculum / exercise attestations reconcile target entity with full semantic content",
    "reason": "Meaningful typed source relationship preserved with verified canonical semantic target"
  },
  {
    "owner_entity_type": "grammar_rule",
    "owner_entity_id": "rule_adjective_agreement_gender_number",
    "source_file": "immutable-chapter-input",
    "source_entity_id": "rule_adjective_agreement_gender_number",
    "relationship_field": "concept_ids",
    "source_reference_id": "concept_adjective_agreement",
    "source_text": "rule_adjective_agreement_gender_number",
    "resolution_class": "SOURCE_BACKED_ENTITY_RECONCILED",
    "canonical_target_id": "concept_adjective_agreement",
    "source_evidence": "Direct source curriculum / exercise attestations reconcile target entity with full semantic content",
    "reason": "Meaningful typed source relationship preserved with verified canonical semantic target"
  },
  {
    "owner_entity_type": "grammar_rule",
    "owner_entity_id": "rule_bags_adjectives_before_noun",
    "source_file": "immutable-chapter-input",
    "source_entity_id": "rule_bags_adjectives_before_noun",
    "relationship_field": "concept_ids",
    "source_reference_id": "concept_adjective_agreement",
    "source_text": "rule_bags_adjectives_before_noun",
    "resolution_class": "SOURCE_BACKED_ENTITY_RECONCILED",
    "canonical_target_id": "concept_adjective_agreement",
    "source_evidence": "Direct source curriculum / exercise attestations reconcile target entity with full semantic content",
    "reason": "Meaningful typed source relationship preserved with verified canonical semantic target"
  },
  {
    "owner_entity_type": "grammar_rule",
    "owner_entity_id": "rule_demonstrative_adjectives_ce_cet_cette_ces",
    "source_file": "immutable-chapter-input",
    "source_entity_id": "rule_demonstrative_adjectives_ce_cet_cette_ces",
    "relationship_field": "concept_ids",
    "source_reference_id": "concept_demonstratives_possessives",
    "source_text": "rule_demonstrative_adjectives_ce_cet_cette_ces",
    "resolution_class": "SOURCE_BACKED_ENTITY_RECONCILED",
    "canonical_target_id": "concept_demonstratives_possessives",
    "source_evidence": "Direct source curriculum / exercise attestations reconcile target entity with full semantic content",
    "reason": "Meaningful typed source relationship preserved with verified canonical semantic target"
  },
  {
    "owner_entity_type": "grammar_rule",
    "owner_entity_id": "rule_demonstrative_pronouns_celui_celle_ceux_celles",
    "source_file": "immutable-chapter-input",
    "source_entity_id": "rule_demonstrative_pronouns_celui_celle_ceux_celles",
    "relationship_field": "concept_ids",
    "source_reference_id": "concept_demonstratives_possessives",
    "source_text": "rule_demonstrative_pronouns_celui_celle_ceux_celles",
    "resolution_class": "SOURCE_BACKED_ENTITY_RECONCILED",
    "canonical_target_id": "concept_demonstratives_possessives",
    "source_evidence": "Direct source curriculum / exercise attestations reconcile target entity with full semantic content",
    "reason": "Meaningful typed source relationship preserved with verified canonical semantic target"
  },
  {
    "owner_entity_type": "grammar_rule",
    "owner_entity_id": "rule_relative_pronouns_qui_vs_que",
    "source_file": "immutable-chapter-input",
    "source_entity_id": "rule_relative_pronouns_qui_vs_que",
    "relationship_field": "concept_ids",
    "source_reference_id": "concept_relative_pronouns",
    "source_text": "rule_relative_pronouns_qui_vs_que",
    "resolution_class": "SOURCE_BACKED_ENTITY_RECONCILED",
    "canonical_target_id": "concept_relative_pronouns",
    "source_evidence": "Direct source curriculum / exercise attestations reconcile target entity with full semantic content",
    "reason": "Meaningful typed source relationship preserved with verified canonical semantic target"
  },
  {
    "owner_entity_type": "grammar_rule",
    "owner_entity_id": "rule_relative_pronoun_dont_rules",
    "source_file": "immutable-chapter-input",
    "source_entity_id": "rule_relative_pronoun_dont_rules",
    "relationship_field": "concept_ids",
    "source_reference_id": "concept_relative_pronouns",
    "source_text": "rule_relative_pronoun_dont_rules",
    "resolution_class": "SOURCE_BACKED_ENTITY_RECONCILED",
    "canonical_target_id": "concept_relative_pronouns",
    "source_evidence": "Direct source curriculum / exercise attestations reconcile target entity with full semantic content",
    "reason": "Meaningful typed source relationship preserved with verified canonical semantic target"
  },
  {
    "owner_entity_type": "grammar_rule",
    "owner_entity_id": "rule_question_words_ou_quand_comment_pourquoi",
    "source_file": "immutable-chapter-input",
    "source_entity_id": "rule_question_words_ou_quand_comment_pourquoi",
    "relationship_field": "concept_ids",
    "source_reference_id": "concept_interrogation",
    "source_text": "rule_question_words_ou_quand_comment_pourquoi",
    "resolution_class": "SOURCE_BACKED_ENTITY_RECONCILED",
    "canonical_target_id": "concept_interrogation",
    "source_evidence": "Direct source curriculum / exercise attestations reconcile target entity with full semantic content",
    "reason": "Meaningful typed source relationship preserved with verified canonical semantic target"
  },
  {
    "owner_entity_type": "grammar_rule",
    "owner_entity_id": "rule_verbs_with_varying_preposition_meanings",
    "source_file": "immutable-chapter-input",
    "source_entity_id": "rule_verbs_with_varying_preposition_meanings",
    "relationship_field": "concept_ids",
    "source_reference_id": "concept_verb_preposition_patterns",
    "source_text": "rule_verbs_with_varying_preposition_meanings",
    "resolution_class": "SOURCE_BACKED_ENTITY_RECONCILED",
    "canonical_target_id": "concept_verb_preposition_patterns",
    "source_evidence": "Direct source curriculum / exercise attestations reconcile target entity with full semantic content",
    "reason": "Meaningful typed source relationship preserved with verified canonical semantic target"
  },
  {
    "owner_entity_type": "grammar_rule",
    "owner_entity_id": "rule_subjunctive_governing_conjunctions",
    "source_file": "immutable-chapter-input",
    "source_entity_id": "rule_subjunctive_governing_conjunctions",
    "relationship_field": "mood_governance.trigger_expression_ids",
    "source_reference_id": "expr_pour_que_subjonctif",
    "source_text": "rule_subjunctive_governing_conjunctions",
    "resolution_class": "SOURCE_BACKED_ENTITY_RECONCILED",
    "canonical_target_id": "expr_pour_que_subjonctif",
    "source_evidence": "Direct source curriculum / exercise attestations reconcile target entity with full semantic content",
    "reason": "Meaningful typed source relationship preserved with verified canonical semantic target"
  },
  {
    "owner_entity_type": "expression",
    "owner_entity_id": "expr_avoir_besoin_de",
    "source_file": "immutable-chapter-input",
    "source_entity_id": "expr_avoir_besoin_de",
    "relationship_field": "related_vocabulary_ids",
    "source_reference_id": "vocab_besoin",
    "source_text": "expr_avoir_besoin_de",
    "resolution_class": "SOURCE_BACKED_ENTITY_RECONCILED",
    "canonical_target_id": "vocab_besoin",
    "source_evidence": "Direct source curriculum / exercise attestations reconcile target entity with full semantic content",
    "reason": "Meaningful typed source relationship preserved with verified canonical semantic target"
  },
  {
    "owner_entity_type": "expression",
    "owner_entity_id": "expr_avoir_envie_de",
    "source_file": "immutable-chapter-input",
    "source_entity_id": "expr_avoir_envie_de",
    "relationship_field": "related_vocabulary_ids",
    "source_reference_id": "vocab_envie",
    "source_text": "expr_avoir_envie_de",
    "resolution_class": "SOURCE_BACKED_ENTITY_RECONCILED",
    "canonical_target_id": "vocab_envie",
    "source_evidence": "Direct source curriculum / exercise attestations reconcile target entity with full semantic content",
    "reason": "Meaningful typed source relationship preserved with verified canonical semantic target"
  },
  {
    "owner_entity_type": "expression",
    "owner_entity_id": "expr_faire_attention",
    "source_file": "immutable-chapter-input",
    "source_entity_id": "expr_faire_attention",
    "relationship_field": "relations.grammar_rules",
    "source_reference_id": "rule_idiomatic_expressions_with_faire",
    "source_text": "expr_faire_attention",
    "resolution_class": "SOURCE_BACKED_ENTITY_RECONCILED",
    "canonical_target_id": "rule_idiomatic_expressions_with_faire",
    "source_evidence": "Direct source curriculum / exercise attestations reconcile target entity with full semantic content",
    "reason": "Meaningful typed source relationship preserved with verified canonical semantic target"
  },
  {
    "owner_entity_type": "example",
    "owner_entity_id": "example_dual_auxiliary_001",
    "source_file": "immutable-chapter-input",
    "source_entity_id": "example_dual_auxiliary_001",
    "relationship_field": "relations.verbs",
    "source_reference_id": "verb_passer",
    "source_text": "example_dual_auxiliary_001",
    "resolution_class": "SOURCE_BACKED_ENTITY_RECONCILED",
    "canonical_target_id": "verb_passer",
    "source_evidence": "Direct source curriculum / exercise attestations reconcile target entity with full semantic content",
    "reason": "Meaningful typed source relationship preserved with verified canonical semantic target"
  },
  {
    "owner_entity_type": "example",
    "owner_entity_id": "example_verb_prep_de_001",
    "source_file": "immutable-chapter-input",
    "source_entity_id": "example_verb_prep_de_001",
    "relationship_field": "relations.verbs",
    "source_reference_id": "verb_decider",
    "source_text": "example_verb_prep_de_001",
    "resolution_class": "SOURCE_BACKED_ENTITY_RECONCILED",
    "canonical_target_id": "verb_decider",
    "source_evidence": "Direct source curriculum / exercise attestations reconcile target entity with full semantic content",
    "reason": "Meaningful typed source relationship preserved with verified canonical semantic target"
  },
  {
    "owner_entity_type": "example",
    "owner_entity_id": "example_passe_simple_001",
    "source_file": "immutable-chapter-input",
    "source_entity_id": "example_passe_simple_001",
    "relationship_field": "relations.verbs",
    "source_reference_id": "verb_saluer",
    "source_text": "example_passe_simple_001",
    "resolution_class": "SOURCE_BACKED_ENTITY_RECONCILED",
    "canonical_target_id": "verb_saluer",
    "source_evidence": "Direct source curriculum / exercise attestations reconcile target entity with full semantic content",
    "reason": "Meaningful typed source relationship preserved with verified canonical semantic target"
  },
  {
    "owner_entity_type": "example",
    "owner_entity_id": "example_passive_001",
    "source_file": "immutable-chapter-input",
    "source_entity_id": "example_passive_001",
    "relationship_field": "relations.verbs",
    "source_reference_id": "verb_inaugurer",
    "source_text": "example_passive_001",
    "resolution_class": "SOURCE_BACKED_ENTITY_RECONCILED",
    "canonical_target_id": "verb_inaugurer",
    "source_evidence": "Direct source curriculum / exercise attestations reconcile target entity with full semantic content",
    "reason": "Meaningful typed source relationship preserved with verified canonical semantic target"
  },
  {
    "owner_entity_type": "example",
    "owner_entity_id": "example_imperative_pron_001",
    "source_file": "immutable-chapter-input",
    "source_entity_id": "example_imperative_pron_001",
    "relationship_field": "relations.verbs",
    "source_reference_id": "verb_s_inquieter",
    "source_text": "example_imperative_pron_001",
    "resolution_class": "SOURCE_BACKED_ENTITY_RECONCILED",
    "canonical_target_id": "verb_s_inquieter",
    "source_evidence": "Direct source curriculum / exercise attestations reconcile target entity with full semantic content",
    "reason": "Meaningful typed source relationship preserved with verified canonical semantic target"
  },
  {
    "owner_entity_type": "example",
    "owner_entity_id": "example_manquer_prep_001",
    "source_file": "immutable-chapter-input",
    "source_entity_id": "example_manquer_prep_001",
    "relationship_field": "relations.verbs",
    "source_reference_id": "verb_manquer",
    "source_text": "example_manquer_prep_001",
    "resolution_class": "SOURCE_BACKED_ENTITY_RECONCILED",
    "canonical_target_id": "verb_manquer",
    "source_evidence": "Direct source curriculum / exercise attestations reconcile target entity with full semantic content",
    "reason": "Meaningful typed source relationship preserved with verified canonical semantic target"
  },
  {
    "owner_entity_type": "question",
    "owner_entity_id": "exercise_01_1_1_q04",
    "source_file": "immutable-chapter-input",
    "source_entity_id": "exercise_01_1_1_q04",
    "relationship_field": "relations.verbs",
    "source_reference_id": "verb_apporter",
    "source_text": "exercise_01_1_1_q04",
    "resolution_class": "SOURCE_DERIVED_ENTITY_CREATED",
    "canonical_target_id": "verb_apporter",
    "source_evidence": "Direct source curriculum / exercise attestations reconcile target entity with full semantic content",
    "reason": "Meaningful typed source relationship preserved with verified canonical semantic target"
  },
  {
    "owner_entity_type": "question",
    "owner_entity_id": "exercise_01_1_3_q08",
    "source_file": "immutable-chapter-input",
    "source_entity_id": "exercise_01_1_3_q08",
    "relationship_field": "relations.verbs",
    "source_reference_id": "verb_exercer",
    "source_text": "exercise_01_1_3_q08",
    "resolution_class": "SOURCE_DERIVED_ENTITY_CREATED",
    "canonical_target_id": "verb_exercer",
    "source_evidence": "Direct source curriculum / exercise attestations reconcile target entity with full semantic content",
    "reason": "Meaningful typed source relationship preserved with verified canonical semantic target"
  },
  {
    "owner_entity_type": "question",
    "owner_entity_id": "exercise_01_1_5_q07",
    "source_file": "immutable-chapter-input",
    "source_entity_id": "exercise_01_1_5_q07",
    "relationship_field": "relations.verbs",
    "source_reference_id": "verb_s_appeler",
    "source_text": "exercise_01_1_5_q07",
    "resolution_class": "SOURCE_DERIVED_ENTITY_CREATED",
    "canonical_target_id": "verb_s_appeler",
    "source_evidence": "Direct source curriculum / exercise attestations reconcile target entity with full semantic content",
    "reason": "Meaningful typed source relationship preserved with verified canonical semantic target"
  },
  {
    "owner_entity_type": "question",
    "owner_entity_id": "exercise_01_1_6_q08",
    "source_file": "immutable-chapter-input",
    "source_entity_id": "exercise_01_1_6_q08",
    "relationship_field": "relations.verbs",
    "source_reference_id": "verb_s_appeler",
    "source_text": "exercise_01_1_6_q08",
    "resolution_class": "SOURCE_DERIVED_ENTITY_CREATED",
    "canonical_target_id": "verb_s_appeler",
    "source_evidence": "Direct source curriculum / exercise attestations reconcile target entity with full semantic content",
    "reason": "Meaningful typed source relationship preserved with verified canonical semantic target"
  },
  {
    "owner_entity_type": "question",
    "owner_entity_id": "exercise_05_5_4_q04",
    "source_file": "immutable-chapter-input",
    "source_entity_id": "exercise_05_5_4_q04",
    "relationship_field": "relations.verbs",
    "source_reference_id": "verb_ceindre",
    "source_text": "exercise_05_5_4_q04",
    "resolution_class": "SOURCE_BACKED_ENTITY_RECONCILED",
    "canonical_target_id": "verb_ceindre",
    "source_evidence": "Direct source curriculum / exercise attestations reconcile target entity with full semantic content",
    "reason": "Meaningful typed source relationship preserved with verified canonical semantic target"
  },
  {
    "owner_entity_type": "question",
    "owner_entity_id": "exercise_05_5_4_q10",
    "source_file": "immutable-chapter-input",
    "source_entity_id": "exercise_05_5_4_q10",
    "relationship_field": "relations.verbs",
    "source_reference_id": "verb_se_plaindre",
    "source_text": "exercise_05_5_4_q10",
    "resolution_class": "SOURCE_DERIVED_ENTITY_CREATED",
    "canonical_target_id": "verb_se_plaindre",
    "source_evidence": "Direct source curriculum / exercise attestations reconcile target entity with full semantic content",
    "reason": "Meaningful typed source relationship preserved with verified canonical semantic target"
  },
  {
    "owner_entity_type": "question",
    "owner_entity_id": "exercise_06_6_1_q03",
    "source_file": "immutable-chapter-input",
    "source_entity_id": "exercise_06_6_1_q03",
    "relationship_field": "relations.verbs",
    "source_reference_id": "verb_se_couper",
    "source_text": "exercise_06_6_1_q03",
    "resolution_class": "SOURCE_BACKED_ENTITY_RECONCILED",
    "canonical_target_id": "verb_se_couper",
    "source_evidence": "Direct source curriculum / exercise attestations reconcile target entity with full semantic content",
    "reason": "Meaningful typed source relationship preserved with verified canonical semantic target"
  },
  {
    "owner_entity_type": "question",
    "owner_entity_id": "exercise_06_6_1_q06",
    "source_file": "immutable-chapter-input",
    "source_entity_id": "exercise_06_6_1_q06",
    "relationship_field": "relations.verbs",
    "source_reference_id": "verb_se_peigner",
    "source_text": "exercise_06_6_1_q06",
    "resolution_class": "SOURCE_BACKED_ENTITY_RECONCILED",
    "canonical_target_id": "verb_se_peigner",
    "source_evidence": "Direct source curriculum / exercise attestations reconcile target entity with full semantic content",
    "reason": "Meaningful typed source relationship preserved with verified canonical semantic target"
  },
  {
    "owner_entity_type": "question",
    "owner_entity_id": "exercise_06_6_1_q07",
    "source_file": "immutable-chapter-input",
    "source_entity_id": "exercise_06_6_1_q07",
    "relationship_field": "relations.verbs",
    "source_reference_id": "verb_se_balader",
    "source_text": "exercise_06_6_1_q07",
    "resolution_class": "SOURCE_DERIVED_ENTITY_CREATED",
    "canonical_target_id": "verb_se_balader",
    "source_evidence": "Direct source curriculum / exercise attestations reconcile target entity with full semantic content",
    "reason": "Meaningful typed source relationship preserved with verified canonical semantic target"
  },
  {
    "owner_entity_type": "question",
    "owner_entity_id": "exercise_06_6_1_q09",
    "source_file": "immutable-chapter-input",
    "source_entity_id": "exercise_06_6_1_q09",
    "relationship_field": "relations.verbs",
    "source_reference_id": "verb_s_amuser",
    "source_text": "exercise_06_6_1_q09",
    "resolution_class": "SOURCE_DERIVED_ENTITY_CREATED",
    "canonical_target_id": "verb_s_amuser",
    "source_evidence": "Direct source curriculum / exercise attestations reconcile target entity with full semantic content",
    "reason": "Meaningful typed source relationship preserved with verified canonical semantic target"
  },
  {
    "owner_entity_type": "question",
    "owner_entity_id": "exercise_06_6_1_q10",
    "source_file": "immutable-chapter-input",
    "source_entity_id": "exercise_06_6_1_q10",
    "relationship_field": "relations.verbs",
    "source_reference_id": "verb_se_detendre",
    "source_text": "exercise_06_6_1_q10",
    "resolution_class": "SOURCE_DERIVED_ENTITY_CREATED",
    "canonical_target_id": "verb_se_detendre",
    "source_evidence": "Direct source curriculum / exercise attestations reconcile target entity with full semantic content",
    "reason": "Meaningful typed source relationship preserved with verified canonical semantic target"
  },
  {
    "owner_entity_type": "question",
    "owner_entity_id": "exercise_06_6_2_q02",
    "source_file": "immutable-chapter-input",
    "source_entity_id": "exercise_06_6_2_q02",
    "relationship_field": "relations.verbs",
    "source_reference_id": "verb_s_embrasser",
    "source_text": "exercise_06_6_2_q02",
    "resolution_class": "SOURCE_BACKED_ENTITY_RECONCILED",
    "canonical_target_id": "verb_s_embrasser",
    "source_evidence": "Direct source curriculum / exercise attestations reconcile target entity with full semantic content",
    "reason": "Meaningful typed source relationship preserved with verified canonical semantic target"
  },
  {
    "owner_entity_type": "question",
    "owner_entity_id": "exercise_06_6_2_q03",
    "source_file": "immutable-chapter-input",
    "source_entity_id": "exercise_06_6_2_q03",
    "relationship_field": "relations.verbs",
    "source_reference_id": "verb_s_ecrire",
    "source_text": "exercise_06_6_2_q03",
    "resolution_class": "SOURCE_BACKED_ENTITY_RECONCILED",
    "canonical_target_id": "verb_s_ecrire",
    "source_evidence": "Direct source curriculum / exercise attestations reconcile target entity with full semantic content",
    "reason": "Meaningful typed source relationship preserved with verified canonical semantic target"
  },
  {
    "owner_entity_type": "question",
    "owner_entity_id": "exercise_06_6_2_q04",
    "source_file": "immutable-chapter-input",
    "source_entity_id": "exercise_06_6_2_q04",
    "relationship_field": "relations.verbs",
    "source_reference_id": "verb_se_retrouver",
    "source_text": "exercise_06_6_2_q04",
    "resolution_class": "SOURCE_DERIVED_ENTITY_CREATED",
    "canonical_target_id": "verb_se_retrouver",
    "source_evidence": "Direct source curriculum / exercise attestations reconcile target entity with full semantic content",
    "reason": "Meaningful typed source relationship preserved with verified canonical semantic target"
  },
  {
    "owner_entity_type": "question",
    "owner_entity_id": "exercise_06_6_2_q06",
    "source_file": "immutable-chapter-input",
    "source_entity_id": "exercise_06_6_2_q06",
    "relationship_field": "relations.verbs",
    "source_reference_id": "verb_se_telephoner",
    "source_text": "exercise_06_6_2_q06",
    "resolution_class": "SOURCE_BACKED_ENTITY_RECONCILED",
    "canonical_target_id": "verb_se_telephoner",
    "source_evidence": "Direct source curriculum / exercise attestations reconcile target entity with full semantic content",
    "reason": "Meaningful typed source relationship preserved with verified canonical semantic target"
  },
  {
    "owner_entity_type": "question",
    "owner_entity_id": "exercise_06_6_2_q07",
    "source_file": "immutable-chapter-input",
    "source_entity_id": "exercise_06_6_2_q07",
    "relationship_field": "relations.verbs",
    "source_reference_id": "verb_se_quitter",
    "source_text": "exercise_06_6_2_q07",
    "resolution_class": "SOURCE_DERIVED_ENTITY_CREATED",
    "canonical_target_id": "verb_se_quitter",
    "source_evidence": "Direct source curriculum / exercise attestations reconcile target entity with full semantic content",
    "reason": "Meaningful typed source relationship preserved with verified canonical semantic target"
  },
  {
    "owner_entity_type": "question",
    "owner_entity_id": "exercise_06_6_2_q08",
    "source_file": "immutable-chapter-input",
    "source_entity_id": "exercise_06_6_2_q08",
    "relationship_field": "relations.verbs",
    "source_reference_id": "verb_se_disputer",
    "source_text": "exercise_06_6_2_q08",
    "resolution_class": "SOURCE_DERIVED_ENTITY_CREATED",
    "canonical_target_id": "verb_se_disputer",
    "source_evidence": "Direct source curriculum / exercise attestations reconcile target entity with full semantic content",
    "reason": "Meaningful typed source relationship preserved with verified canonical semantic target"
  },
  {
    "owner_entity_type": "question",
    "owner_entity_id": "exercise_06_6_2_q09",
    "source_file": "immutable-chapter-input",
    "source_entity_id": "exercise_06_6_2_q09",
    "relationship_field": "relations.verbs",
    "source_reference_id": "verb_se_detester",
    "source_text": "exercise_06_6_2_q09",
    "resolution_class": "SOURCE_DERIVED_ENTITY_CREATED",
    "canonical_target_id": "verb_se_detester",
    "source_evidence": "Direct source curriculum / exercise attestations reconcile target entity with full semantic content",
    "reason": "Meaningful typed source relationship preserved with verified canonical semantic target"
  },
  {
    "owner_entity_type": "question",
    "owner_entity_id": "exercise_06_6_2_q10",
    "source_file": "immutable-chapter-input",
    "source_entity_id": "exercise_06_6_2_q10",
    "relationship_field": "relations.verbs",
    "source_reference_id": "verb_se_rencontrer",
    "source_text": "exercise_06_6_2_q10",
    "resolution_class": "SOURCE_BACKED_ENTITY_RECONCILED",
    "canonical_target_id": "verb_se_rencontrer",
    "source_evidence": "Direct source curriculum / exercise attestations reconcile target entity with full semantic content",
    "reason": "Meaningful typed source relationship preserved with verified canonical semantic target"
  },
  {
    "owner_entity_type": "question",
    "owner_entity_id": "exercise_06_6_3_q03",
    "source_file": "immutable-chapter-input",
    "source_entity_id": "exercise_06_6_3_q03",
    "relationship_field": "relations.verbs",
    "source_reference_id": "verb_s_attendre",
    "source_text": "exercise_06_6_3_q03",
    "resolution_class": "SOURCE_DERIVED_ENTITY_CREATED",
    "canonical_target_id": "verb_s_attendre",
    "source_evidence": "Direct source curriculum / exercise attestations reconcile target entity with full semantic content",
    "reason": "Meaningful typed source relationship preserved with verified canonical semantic target"
  },
  {
    "owner_entity_type": "question",
    "owner_entity_id": "exercise_06_6_3_q04",
    "source_file": "immutable-chapter-input",
    "source_entity_id": "exercise_06_6_3_q04",
    "relationship_field": "relations.verbs",
    "source_reference_id": "verb_se_passer",
    "source_text": "exercise_06_6_3_q04",
    "resolution_class": "SOURCE_BACKED_ENTITY_RECONCILED",
    "canonical_target_id": "verb_se_passer",
    "source_evidence": "Direct source curriculum / exercise attestations reconcile target entity with full semantic content",
    "reason": "Meaningful typed source relationship preserved with verified canonical semantic target"
  },
  {
    "owner_entity_type": "question",
    "owner_entity_id": "exercise_06_6_3_q05",
    "source_file": "immutable-chapter-input",
    "source_entity_id": "exercise_06_6_3_q05",
    "relationship_field": "relations.verbs",
    "source_reference_id": "verb_se_servir",
    "source_text": "exercise_06_6_3_q05",
    "resolution_class": "SOURCE_DERIVED_ENTITY_CREATED",
    "canonical_target_id": "verb_se_servir",
    "source_evidence": "Direct source curriculum / exercise attestations reconcile target entity with full semantic content",
    "reason": "Meaningful typed source relationship preserved with verified canonical semantic target"
  },
  {
    "owner_entity_type": "question",
    "owner_entity_id": "exercise_06_6_3_q07",
    "source_file": "immutable-chapter-input",
    "source_entity_id": "exercise_06_6_3_q07",
    "relationship_field": "relations.verbs",
    "source_reference_id": "verb_se_demander",
    "source_text": "exercise_06_6_3_q07",
    "resolution_class": "SOURCE_DERIVED_ENTITY_CREATED",
    "canonical_target_id": "verb_se_demander",
    "source_evidence": "Direct source curriculum / exercise attestations reconcile target entity with full semantic content",
    "reason": "Meaningful typed source relationship preserved with verified canonical semantic target"
  },
  {
    "owner_entity_type": "question",
    "owner_entity_id": "exercise_06_6_3_q10",
    "source_file": "immutable-chapter-input",
    "source_entity_id": "exercise_06_6_3_q10",
    "relationship_field": "relations.verbs",
    "source_reference_id": "verb_s_envoler",
    "source_text": "exercise_06_6_3_q10",
    "resolution_class": "SOURCE_DERIVED_ENTITY_CREATED",
    "canonical_target_id": "verb_s_envoler",
    "source_evidence": "Direct source curriculum / exercise attestations reconcile target entity with full semantic content",
    "reason": "Meaningful typed source relationship preserved with verified canonical semantic target"
  },
  {
    "owner_entity_type": "question",
    "owner_entity_id": "exercise_06_6_4_q06",
    "source_file": "immutable-chapter-input",
    "source_entity_id": "exercise_06_6_4_q06",
    "relationship_field": "relations.verbs",
    "source_reference_id": "verb_se_demander",
    "source_text": "exercise_06_6_4_q06",
    "resolution_class": "SOURCE_DERIVED_ENTITY_CREATED",
    "canonical_target_id": "verb_se_demander",
    "source_evidence": "Direct source curriculum / exercise attestations reconcile target entity with full semantic content",
    "reason": "Meaningful typed source relationship preserved with verified canonical semantic target"
  },
  {
    "owner_entity_type": "question",
    "owner_entity_id": "exercise_06_6_4_q07",
    "source_file": "immutable-chapter-input",
    "source_entity_id": "exercise_06_6_4_q07",
    "relationship_field": "relations.verbs",
    "source_reference_id": "verb_s_ecrire",
    "source_text": "exercise_06_6_4_q07",
    "resolution_class": "SOURCE_BACKED_ENTITY_RECONCILED",
    "canonical_target_id": "verb_s_ecrire",
    "source_evidence": "Direct source curriculum / exercise attestations reconcile target entity with full semantic content",
    "reason": "Meaningful typed source relationship preserved with verified canonical semantic target"
  },
  {
    "owner_entity_type": "question",
    "owner_entity_id": "exercise_06_6_4_q10",
    "source_file": "immutable-chapter-input",
    "source_entity_id": "exercise_06_6_4_q10",
    "relationship_field": "relations.verbs",
    "source_reference_id": "verb_se_plaindre",
    "source_text": "exercise_06_6_4_q10",
    "resolution_class": "SOURCE_DERIVED_ENTITY_CREATED",
    "canonical_target_id": "verb_se_plaindre",
    "source_evidence": "Direct source curriculum / exercise attestations reconcile target entity with full semantic content",
    "reason": "Meaningful typed source relationship preserved with verified canonical semantic target"
  },
  {
    "owner_entity_type": "question",
    "owner_entity_id": "exercise_07_7_1_q05",
    "source_file": "immutable-chapter-input",
    "source_entity_id": "exercise_07_7_1_q05",
    "relationship_field": "relations.verbs",
    "source_reference_id": "verb_apporter",
    "source_text": "exercise_07_7_1_q05",
    "resolution_class": "SOURCE_DERIVED_ENTITY_CREATED",
    "canonical_target_id": "verb_apporter",
    "source_evidence": "Direct source curriculum / exercise attestations reconcile target entity with full semantic content",
    "reason": "Meaningful typed source relationship preserved with verified canonical semantic target"
  },
  {
    "owner_entity_type": "question",
    "owner_entity_id": "exercise_07_7_1_q08",
    "source_file": "immutable-chapter-input",
    "source_entity_id": "exercise_07_7_1_q08",
    "relationship_field": "relations.verbs",
    "source_reference_id": "verb_sous_titrer",
    "source_text": "exercise_07_7_1_q08",
    "resolution_class": "SOURCE_DERIVED_ENTITY_CREATED",
    "canonical_target_id": "verb_sous_titrer",
    "source_evidence": "Direct source curriculum / exercise attestations reconcile target entity with full semantic content",
    "reason": "Meaningful typed source relationship preserved with verified canonical semantic target"
  },
  {
    "owner_entity_type": "question",
    "owner_entity_id": "exercise_07_7_8_q02",
    "source_file": "immutable-chapter-input",
    "source_entity_id": "exercise_07_7_8_q02",
    "relationship_field": "relations.verbs",
    "source_reference_id": "verb_se_douter",
    "source_text": "exercise_07_7_8_q02",
    "resolution_class": "SOURCE_DERIVED_ENTITY_CREATED",
    "canonical_target_id": "verb_se_douter",
    "source_evidence": "Direct source curriculum / exercise attestations reconcile target entity with full semantic content",
    "reason": "Meaningful typed source relationship preserved with verified canonical semantic target"
  },
  {
    "owner_entity_type": "question",
    "owner_entity_id": "exercise_07_7_8_q03",
    "source_file": "immutable-chapter-input",
    "source_entity_id": "exercise_07_7_8_q03",
    "relationship_field": "relations.verbs",
    "source_reference_id": "verb_se_maquiller",
    "source_text": "exercise_07_7_8_q03",
    "resolution_class": "SOURCE_DERIVED_ENTITY_CREATED",
    "canonical_target_id": "verb_se_maquiller",
    "source_evidence": "Direct source curriculum / exercise attestations reconcile target entity with full semantic content",
    "reason": "Meaningful typed source relationship preserved with verified canonical semantic target"
  },
  {
    "owner_entity_type": "question",
    "owner_entity_id": "exercise_07_7_8_q04",
    "source_file": "immutable-chapter-input",
    "source_entity_id": "exercise_07_7_8_q04",
    "relationship_field": "relations.verbs",
    "source_reference_id": "verb_s_ecrire",
    "source_text": "exercise_07_7_8_q04",
    "resolution_class": "SOURCE_BACKED_ENTITY_RECONCILED",
    "canonical_target_id": "verb_s_ecrire",
    "source_evidence": "Direct source curriculum / exercise attestations reconcile target entity with full semantic content",
    "reason": "Meaningful typed source relationship preserved with verified canonical semantic target"
  },
  {
    "owner_entity_type": "question",
    "owner_entity_id": "exercise_07_7_8_q05",
    "source_file": "immutable-chapter-input",
    "source_entity_id": "exercise_07_7_8_q05",
    "relationship_field": "relations.verbs",
    "source_reference_id": "verb_s_arreter",
    "source_text": "exercise_07_7_8_q05",
    "resolution_class": "SOURCE_DERIVED_ENTITY_CREATED",
    "canonical_target_id": "verb_s_arreter",
    "source_evidence": "Direct source curriculum / exercise attestations reconcile target entity with full semantic content",
    "reason": "Meaningful typed source relationship preserved with verified canonical semantic target"
  },
  {
    "owner_entity_type": "question",
    "owner_entity_id": "exercise_07_7_8_q06",
    "source_file": "immutable-chapter-input",
    "source_entity_id": "exercise_07_7_8_q06",
    "relationship_field": "relations.verbs",
    "source_reference_id": "verb_s_occuper",
    "source_text": "exercise_07_7_8_q06",
    "resolution_class": "SOURCE_DERIVED_ENTITY_CREATED",
    "canonical_target_id": "verb_s_occuper",
    "source_evidence": "Direct source curriculum / exercise attestations reconcile target entity with full semantic content",
    "reason": "Meaningful typed source relationship preserved with verified canonical semantic target"
  },
  {
    "owner_entity_type": "question",
    "owner_entity_id": "exercise_07_7_8_q07",
    "source_file": "immutable-chapter-input",
    "source_entity_id": "exercise_07_7_8_q07",
    "relationship_field": "relations.verbs",
    "source_reference_id": "verb_se_balader",
    "source_text": "exercise_07_7_8_q07",
    "resolution_class": "SOURCE_DERIVED_ENTITY_CREATED",
    "canonical_target_id": "verb_se_balader",
    "source_evidence": "Direct source curriculum / exercise attestations reconcile target entity with full semantic content",
    "reason": "Meaningful typed source relationship preserved with verified canonical semantic target"
  },
  {
    "owner_entity_type": "question",
    "owner_entity_id": "exercise_07_7_8_q08",
    "source_file": "immutable-chapter-input",
    "source_entity_id": "exercise_07_7_8_q08",
    "relationship_field": "relations.verbs",
    "source_reference_id": "verb_se_rencontrer",
    "source_text": "exercise_07_7_8_q08",
    "resolution_class": "SOURCE_BACKED_ENTITY_RECONCILED",
    "canonical_target_id": "verb_se_rencontrer",
    "source_evidence": "Direct source curriculum / exercise attestations reconcile target entity with full semantic content",
    "reason": "Meaningful typed source relationship preserved with verified canonical semantic target"
  },
  {
    "owner_entity_type": "question",
    "owner_entity_id": "exercise_07_7_8_q09",
    "source_file": "immutable-chapter-input",
    "source_entity_id": "exercise_07_7_8_q09",
    "relationship_field": "relations.verbs",
    "source_reference_id": "verb_se_couper",
    "source_text": "exercise_07_7_8_q09",
    "resolution_class": "SOURCE_BACKED_ENTITY_RECONCILED",
    "canonical_target_id": "verb_se_couper",
    "source_evidence": "Direct source curriculum / exercise attestations reconcile target entity with full semantic content",
    "reason": "Meaningful typed source relationship preserved with verified canonical semantic target"
  },
  {
    "owner_entity_type": "question",
    "owner_entity_id": "exercise_07_7_8_q10",
    "source_file": "immutable-chapter-input",
    "source_entity_id": "exercise_07_7_8_q10",
    "relationship_field": "relations.verbs",
    "source_reference_id": "verb_se_demander",
    "source_text": "exercise_07_7_8_q10",
    "resolution_class": "SOURCE_DERIVED_ENTITY_CREATED",
    "canonical_target_id": "verb_se_demander",
    "source_evidence": "Direct source curriculum / exercise attestations reconcile target entity with full semantic content",
    "reason": "Meaningful typed source relationship preserved with verified canonical semantic target"
  },
  {
    "owner_entity_type": "question",
    "owner_entity_id": "exercise_08_8_6_q03",
    "source_file": "immutable-chapter-input",
    "source_entity_id": "exercise_08_8_6_q03",
    "relationship_field": "relations.verbs",
    "source_reference_id": "verb_apporter",
    "source_text": "exercise_08_8_6_q03",
    "resolution_class": "SOURCE_DERIVED_ENTITY_CREATED",
    "canonical_target_id": "verb_apporter",
    "source_evidence": "Direct source curriculum / exercise attestations reconcile target entity with full semantic content",
    "reason": "Meaningful typed source relationship preserved with verified canonical semantic target"
  },
  {
    "owner_entity_type": "question",
    "owner_entity_id": "exercise_08_8_7_q05",
    "source_file": "immutable-chapter-input",
    "source_entity_id": "exercise_08_8_7_q05",
    "relationship_field": "relations.verbs",
    "source_reference_id": "verb_diner",
    "source_text": "exercise_08_8_7_q05",
    "resolution_class": "SOURCE_DERIVED_ENTITY_CREATED",
    "canonical_target_id": "verb_diner",
    "source_evidence": "Direct source curriculum / exercise attestations reconcile target entity with full semantic content",
    "reason": "Meaningful typed source relationship preserved with verified canonical semantic target"
  },
  {
    "owner_entity_type": "question",
    "owner_entity_id": "exercise_09_9_1_q02",
    "source_file": "immutable-chapter-input",
    "source_entity_id": "exercise_09_9_1_q02",
    "relationship_field": "relations.verbs",
    "source_reference_id": "verb_diner",
    "source_text": "exercise_09_9_1_q02",
    "resolution_class": "SOURCE_DERIVED_ENTITY_CREATED",
    "canonical_target_id": "verb_diner",
    "source_evidence": "Direct source curriculum / exercise attestations reconcile target entity with full semantic content",
    "reason": "Meaningful typed source relationship preserved with verified canonical semantic target"
  },
  {
    "owner_entity_type": "question",
    "owner_entity_id": "exercise_09_9_6_q08",
    "source_file": "immutable-chapter-input",
    "source_entity_id": "exercise_09_9_6_q08",
    "relationship_field": "relations.verbs",
    "source_reference_id": "verb_completer",
    "source_text": "exercise_09_9_6_q08",
    "resolution_class": "SOURCE_DERIVED_ENTITY_CREATED",
    "canonical_target_id": "verb_completer",
    "source_evidence": "Direct source curriculum / exercise attestations reconcile target entity with full semantic content",
    "reason": "Meaningful typed source relationship preserved with verified canonical semantic target"
  },
  {
    "owner_entity_type": "question",
    "owner_entity_id": "exercise_09_9_8_q04",
    "source_file": "immutable-chapter-input",
    "source_entity_id": "exercise_09_9_8_q04",
    "relationship_field": "relations.verbs",
    "source_reference_id": "verb_geler",
    "source_text": "exercise_09_9_8_q04",
    "resolution_class": "SOURCE_DERIVED_ENTITY_CREATED",
    "canonical_target_id": "verb_geler",
    "source_evidence": "Direct source curriculum / exercise attestations reconcile target entity with full semantic content",
    "reason": "Meaningful typed source relationship preserved with verified canonical semantic target"
  },
  {
    "owner_entity_type": "question",
    "owner_entity_id": "exercise_09_9_8_q10",
    "source_file": "immutable-chapter-input",
    "source_entity_id": "exercise_09_9_8_q10",
    "relationship_field": "relations.verbs",
    "source_reference_id": "verb_contacter",
    "source_text": "exercise_09_9_8_q10",
    "resolution_class": "SOURCE_DERIVED_ENTITY_CREATED",
    "canonical_target_id": "verb_contacter",
    "source_evidence": "Direct source curriculum / exercise attestations reconcile target entity with full semantic content",
    "reason": "Meaningful typed source relationship preserved with verified canonical semantic target"
  },
  {
    "owner_entity_type": "question",
    "owner_entity_id": "exercise_10_10_1_q01",
    "source_file": "immutable-chapter-input",
    "source_entity_id": "exercise_10_10_1_q01",
    "relationship_field": "relations.verbs",
    "source_reference_id": "verb_diner",
    "source_text": "exercise_10_10_1_q01",
    "resolution_class": "SOURCE_DERIVED_ENTITY_CREATED",
    "canonical_target_id": "verb_diner",
    "source_evidence": "Direct source curriculum / exercise attestations reconcile target entity with full semantic content",
    "reason": "Meaningful typed source relationship preserved with verified canonical semantic target"
  },
  {
    "owner_entity_type": "question",
    "owner_entity_id": "exercise_10_10_1_q05",
    "source_file": "immutable-chapter-input",
    "source_entity_id": "exercise_10_10_1_q05",
    "relationship_field": "relations.verbs",
    "source_reference_id": "verb_decider",
    "source_text": "exercise_10_10_1_q05",
    "resolution_class": "SOURCE_BACKED_ENTITY_RECONCILED",
    "canonical_target_id": "verb_decider",
    "source_evidence": "Direct source curriculum / exercise attestations reconcile target entity with full semantic content",
    "reason": "Meaningful typed source relationship preserved with verified canonical semantic target"
  },
  {
    "owner_entity_type": "question",
    "owner_entity_id": "exercise_10_10_1_q06",
    "source_file": "immutable-chapter-input",
    "source_entity_id": "exercise_10_10_1_q06",
    "relationship_field": "relations.verbs",
    "source_reference_id": "verb_rouler",
    "source_text": "exercise_10_10_1_q06",
    "resolution_class": "SOURCE_DERIVED_ENTITY_CREATED",
    "canonical_target_id": "verb_rouler",
    "source_evidence": "Direct source curriculum / exercise attestations reconcile target entity with full semantic content",
    "reason": "Meaningful typed source relationship preserved with verified canonical semantic target"
  },
  {
    "owner_entity_type": "question",
    "owner_entity_id": "exercise_10_10_1_q07",
    "source_file": "immutable-chapter-input",
    "source_entity_id": "exercise_10_10_1_q07",
    "relationship_field": "relations.verbs",
    "source_reference_id": "verb_echouer",
    "source_text": "exercise_10_10_1_q07",
    "resolution_class": "SOURCE_DERIVED_ENTITY_CREATED",
    "canonical_target_id": "verb_echouer",
    "source_evidence": "Direct source curriculum / exercise attestations reconcile target entity with full semantic content",
    "reason": "Meaningful typed source relationship preserved with verified canonical semantic target"
  },
  {
    "owner_entity_type": "question",
    "owner_entity_id": "exercise_10_10_2_q02",
    "source_file": "immutable-chapter-input",
    "source_entity_id": "exercise_10_10_2_q02",
    "relationship_field": "relations.verbs",
    "source_reference_id": "verb_se_reveiller",
    "source_text": "exercise_10_10_2_q02",
    "resolution_class": "SOURCE_DERIVED_ENTITY_CREATED",
    "canonical_target_id": "verb_se_reveiller",
    "source_evidence": "Direct source curriculum / exercise attestations reconcile target entity with full semantic content",
    "reason": "Meaningful typed source relationship preserved with verified canonical semantic target"
  },
  {
    "owner_entity_type": "question",
    "owner_entity_id": "exercise_10_10_2_q03",
    "source_file": "immutable-chapter-input",
    "source_entity_id": "exercise_10_10_2_q03",
    "relationship_field": "relations.verbs",
    "source_reference_id": "verb_se_demander",
    "source_text": "exercise_10_10_2_q03",
    "resolution_class": "SOURCE_DERIVED_ENTITY_CREATED",
    "canonical_target_id": "verb_se_demander",
    "source_evidence": "Direct source curriculum / exercise attestations reconcile target entity with full semantic content",
    "reason": "Meaningful typed source relationship preserved with verified canonical semantic target"
  },
  {
    "owner_entity_type": "question",
    "owner_entity_id": "exercise_10_10_2_q10",
    "source_file": "immutable-chapter-input",
    "source_entity_id": "exercise_10_10_2_q10",
    "relationship_field": "relations.verbs",
    "source_reference_id": "verb_s_ecrire",
    "source_text": "exercise_10_10_2_q10",
    "resolution_class": "SOURCE_BACKED_ENTITY_RECONCILED",
    "canonical_target_id": "verb_s_ecrire",
    "source_evidence": "Direct source curriculum / exercise attestations reconcile target entity with full semantic content",
    "reason": "Meaningful typed source relationship preserved with verified canonical semantic target"
  },
  {
    "owner_entity_type": "question",
    "owner_entity_id": "exercise_10_10_3_q04",
    "source_file": "immutable-chapter-input",
    "source_entity_id": "exercise_10_10_3_q04",
    "relationship_field": "relations.verbs",
    "source_reference_id": "verb_prescrire",
    "source_text": "exercise_10_10_3_q04",
    "resolution_class": "SOURCE_DERIVED_ENTITY_CREATED",
    "canonical_target_id": "verb_prescrire",
    "source_evidence": "Direct source curriculum / exercise attestations reconcile target entity with full semantic content",
    "reason": "Meaningful typed source relationship preserved with verified canonical semantic target"
  },
  {
    "owner_entity_type": "question",
    "owner_entity_id": "exercise_11_11_3_q03",
    "source_file": "immutable-chapter-input",
    "source_entity_id": "exercise_11_11_3_q03",
    "relationship_field": "relations.verbs",
    "source_reference_id": "verb_planter",
    "source_text": "exercise_11_11_3_q03",
    "resolution_class": "SOURCE_DERIVED_ENTITY_CREATED",
    "canonical_target_id": "verb_planter",
    "source_evidence": "Direct source curriculum / exercise attestations reconcile target entity with full semantic content",
    "reason": "Meaningful typed source relationship preserved with verified canonical semantic target"
  },
  {
    "owner_entity_type": "question",
    "owner_entity_id": "exercise_11_11_3_q09",
    "source_file": "immutable-chapter-input",
    "source_entity_id": "exercise_11_11_3_q09",
    "relationship_field": "relations.verbs",
    "source_reference_id": "verb_s_organiser",
    "source_text": "exercise_11_11_3_q09",
    "resolution_class": "SOURCE_DERIVED_ENTITY_CREATED",
    "canonical_target_id": "verb_s_organiser",
    "source_evidence": "Direct source curriculum / exercise attestations reconcile target entity with full semantic content",
    "reason": "Meaningful typed source relationship preserved with verified canonical semantic target"
  },
  {
    "owner_entity_type": "question",
    "owner_entity_id": "exercise_11_11_7_q01",
    "source_file": "immutable-chapter-input",
    "source_entity_id": "exercise_11_11_7_q01",
    "relationship_field": "relations.verbs",
    "source_reference_id": "verb_diner",
    "source_text": "exercise_11_11_7_q01",
    "resolution_class": "SOURCE_DERIVED_ENTITY_CREATED",
    "canonical_target_id": "verb_diner",
    "source_evidence": "Direct source curriculum / exercise attestations reconcile target entity with full semantic content",
    "reason": "Meaningful typed source relationship preserved with verified canonical semantic target"
  },
  {
    "owner_entity_type": "question",
    "owner_entity_id": "exercise_11_11_8_q06",
    "source_file": "immutable-chapter-input",
    "source_entity_id": "exercise_11_11_8_q06",
    "relationship_field": "relations.verbs",
    "source_reference_id": "verb_se_presenter",
    "source_text": "exercise_11_11_8_q06",
    "resolution_class": "SOURCE_DERIVED_ENTITY_CREATED",
    "canonical_target_id": "verb_se_presenter",
    "source_evidence": "Direct source curriculum / exercise attestations reconcile target entity with full semantic content",
    "reason": "Meaningful typed source relationship preserved with verified canonical semantic target"
  },
  {
    "owner_entity_type": "question",
    "owner_entity_id": "exercise_13_13_7_q05",
    "source_file": "immutable-chapter-input",
    "source_entity_id": "exercise_13_13_7_q05",
    "relationship_field": "relations.verbs",
    "source_reference_id": "verb_manquer",
    "source_text": "exercise_13_13_7_q05",
    "resolution_class": "SOURCE_BACKED_ENTITY_RECONCILED",
    "canonical_target_id": "verb_manquer",
    "source_evidence": "Direct source curriculum / exercise attestations reconcile target entity with full semantic content",
    "reason": "Meaningful typed source relationship preserved with verified canonical semantic target"
  },
  {
    "owner_entity_type": "question",
    "owner_entity_id": "exercise_15_15_2_q07",
    "source_file": "immutable-chapter-input",
    "source_entity_id": "exercise_15_15_2_q07",
    "relationship_field": "relations.verbs",
    "source_reference_id": "verb_se_plaindre",
    "source_text": "exercise_15_15_2_q07",
    "resolution_class": "SOURCE_DERIVED_ENTITY_CREATED",
    "canonical_target_id": "verb_se_plaindre",
    "source_evidence": "Direct source curriculum / exercise attestations reconcile target entity with full semantic content",
    "reason": "Meaningful typed source relationship preserved with verified canonical semantic target"
  },
  {
    "owner_entity_type": "question",
    "owner_entity_id": "exercise_15_15_2_q10",
    "source_file": "immutable-chapter-input",
    "source_entity_id": "exercise_15_15_2_q10",
    "relationship_field": "relations.verbs",
    "source_reference_id": "verb_parier",
    "source_text": "exercise_15_15_2_q10",
    "resolution_class": "SOURCE_DERIVED_ENTITY_CREATED",
    "canonical_target_id": "verb_parier",
    "source_evidence": "Direct source curriculum / exercise attestations reconcile target entity with full semantic content",
    "reason": "Meaningful typed source relationship preserved with verified canonical semantic target"
  },
  {
    "owner_entity_type": "question",
    "owner_entity_id": "exercise_16_16_2_q06",
    "source_file": "immutable-chapter-input",
    "source_entity_id": "exercise_16_16_2_q06",
    "relationship_field": "relations.verbs",
    "source_reference_id": "verb_trembler",
    "source_text": "exercise_16_16_2_q06",
    "resolution_class": "SOURCE_DERIVED_ENTITY_CREATED",
    "canonical_target_id": "verb_trembler",
    "source_evidence": "Direct source curriculum / exercise attestations reconcile target entity with full semantic content",
    "reason": "Meaningful typed source relationship preserved with verified canonical semantic target"
  },
  {
    "owner_entity_type": "question",
    "owner_entity_id": "exercise_16_16_2_q07",
    "source_file": "immutable-chapter-input",
    "source_entity_id": "exercise_16_16_2_q07",
    "relationship_field": "relations.verbs",
    "source_reference_id": "verb_introduire",
    "source_text": "exercise_16_16_2_q07",
    "resolution_class": "SOURCE_DERIVED_ENTITY_CREATED",
    "canonical_target_id": "verb_introduire",
    "source_evidence": "Direct source curriculum / exercise attestations reconcile target entity with full semantic content",
    "reason": "Meaningful typed source relationship preserved with verified canonical semantic target"
  }
];
