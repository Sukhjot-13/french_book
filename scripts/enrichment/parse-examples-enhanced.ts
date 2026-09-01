import { Example } from "../../src/lib/dataset/schemas";
import { makeExampleId, makeVerbId, makeExpressionId, makeRuleId, makeVocabId, slugify } from "../../src/lib/dataset/ids";

export interface RawExampleSpec {
  french: string;
  english: string;
  chapter_number: number;
  section_order?: number;
  page_printed: number;
  tense_id?: string;
  rule_id?: string;
  verb_ids?: string[];
  expression_ids?: string[];
  vocabulary_ids?: string[];
}

export const MASTER_EXAMPLE_SPECS: RawExampleSpec[] = [
  // CHAPTER 1: Present tense of regular -er verbs (pp. 1-12)
  { french: "Ici, on parle japonais.", english: "Japanese is spoken here.", chapter_number: 1, page_printed: 2, tense_id: "tense_present_indicative", verb_ids: ["parler"] },
  { french: "On ne devrait pas se comporter ainsi.", english: "One should not behave this way.", chapter_number: 1, page_printed: 2, tense_id: "tense_present_indicative", verb_ids: ["devoir", "se comporter"] },
  { french: "On va au cinéma ce soir?", english: "Shall we go to the movies tonight?", chapter_number: 1, page_printed: 2, tense_id: "tense_present_indicative", verb_ids: ["aller"] },
  { french: "En Espagne, on mange des tapas.", english: "In Spain, they eat tapas.", chapter_number: 1, page_printed: 2, tense_id: "tense_present_indicative", verb_ids: ["manger"] },
  { french: "On est tous d’accord.", english: "We all agree.", chapter_number: 1, page_printed: 2, tense_id: "tense_present_indicative", verb_ids: ["être"], expression_ids: ["être d'accord avec"] },
  { french: "Valérie parle à son ami Ludovic.", english: "Valérie is talking to her friend Ludovic.", chapter_number: 1, page_printed: 9, tense_id: "tense_present_indicative", verb_ids: ["parler"] },
  { french: "Il regarde les étoiles dans le ciel.", english: "He is looking at the stars in the sky.", chapter_number: 1, page_printed: 9, tense_id: "tense_present_indicative", verb_ids: ["regarder"] },
  { french: "Il part demain soir.", english: "He will leave tomorrow night.", chapter_number: 1, page_printed: 9, tense_id: "tense_present_indicative", verb_ids: ["partir"] },
  { french: "On parle de cela en fin de semaine.", english: "We will discuss this at the end of the week.", chapter_number: 1, page_printed: 9, tense_id: "tense_present_indicative", verb_ids: ["parler"] },
  { french: "Tous les jours, le soleil se lève.", english: "The sun rises every day.", chapter_number: 1, page_printed: 9, tense_id: "tense_present_indicative", verb_ids: ["se lever"] },
  { french: "D’habitude, j’achète la viande dans cette boucherie.", english: "Usually I buy meat in this butcher shop.", chapter_number: 1, page_printed: 9, tense_id: "tense_present_indicative", verb_ids: ["acheter"] },
  { french: "La reine avance vers le trône.", english: "The queen moves toward the throne.", chapter_number: 1, page_printed: 9, tense_id: "tense_present_indicative", verb_ids: ["avancer"] },
  { french: "Un instant, s’il vous plaît, je suis en train de parler à Rémi.", english: "One moment, please, I am talking to Rémi.", chapter_number: 1, page_printed: 9, tense_id: "tense_present_indicative", verb_ids: ["être", "parler"], expression_ids: ["être en train de + infinitif"] },
  { french: "J’habite à Nice depuis trois ans.", english: "I have been living in Nice for three years.", chapter_number: 1, page_printed: 10, tense_id: "tense_present_indicative", verb_ids: ["habiter"] },
  { french: "Il y a combien de temps que vous connaissez M. Blier?", english: "How long have you known Mr. Blier?", chapter_number: 1, page_printed: 11, tense_id: "tense_present_indicative", verb_ids: ["connaître"], expression_ids: ["il y a ... que"] },
  { french: "Ça fait cinq ans que j’ai ce dictionnaire.", english: "I have had this dictionary for five years.", chapter_number: 1, page_printed: 11, tense_id: "tense_present_indicative", verb_ids: ["avoir"], expression_ids: ["ça fait ... que"] },

  // CHAPTER 2: Present of -ir and -re verbs, Questions, Negation (pp. 13-23)
  { french: "Elle finit ses devoirs avant le dîner.", english: "She finishes her homework before dinner.", chapter_number: 2, page_printed: 13, tense_id: "tense_present_indicative", verb_ids: ["finir"] },
  { french: "Nous choisissons un bon restaurant pour ce soir.", english: "We are choosing a good restaurant for tonight.", chapter_number: 2, page_printed: 14, tense_id: "tense_present_indicative", verb_ids: ["choisir"] },
  { french: "Ils réussissent toujours à leurs examens.", english: "They always pass their exams.", chapter_number: 2, page_printed: 14, tense_id: "tense_present_indicative", verb_ids: ["réussir"] },
  { french: "Ils vendent leur maison de campagne.", english: "They are selling their country house.", chapter_number: 2, page_printed: 15, tense_id: "tense_present_indicative", verb_ids: ["vendre"] },
  { french: "J'attends le bus depuis dix minutes.", english: "I have been waiting for the bus for ten minutes.", chapter_number: 2, page_printed: 16, tense_id: "tense_present_indicative", verb_ids: ["attendre"] },
  { french: "Est-ce que vous parlez italien?", english: "Do you speak Italian?", chapter_number: 2, page_printed: 18, tense_id: "tense_present_indicative", verb_ids: ["parler"], expression_ids: ["est-ce que"] },
  { french: "Qu'est-ce que tu regardes à la télévision?", english: "What are you watching on television?", chapter_number: 2, page_printed: 18, tense_id: "tense_present_indicative", verb_ids: ["regarder"], expression_ids: ["qu'est-ce que"] },
  { french: "Vous venez demain, n'est-ce pas?", english: "You are coming tomorrow, aren't you?", chapter_number: 2, page_printed: 19, tense_id: "tense_present_indicative", verb_ids: ["venir"], expression_ids: ["n'est-ce pas"] },
  { french: "Il ne regarde jamais la télévision le matin.", english: "He never watches television in the morning.", chapter_number: 2, page_printed: 20, tense_id: "tense_present_indicative", verb_ids: ["regarder"], expression_ids: ["ne ... jamais"] },
  { french: "Je ne connais personne dans cette ville.", english: "I don't know anyone in this city.", chapter_number: 2, page_printed: 20, tense_id: "tense_present_indicative", verb_ids: ["connaître"], expression_ids: ["ne ... personne"] },
  { french: "Nous ne voulons rien dire à ce sujet.", english: "We don't want to say anything on this subject.", chapter_number: 2, page_printed: 20, tense_id: "tense_present_indicative", verb_ids: ["vouloir", "dire"], expression_ids: ["ne ... rien"] },
  { french: "Elle n'a que dix euros dans son sac.", english: "She only has ten euros in her bag.", chapter_number: 2, page_printed: 20, tense_id: "tense_present_indicative", verb_ids: ["avoir"], expression_ids: ["ne ... que"] },

  // CHAPTER 3: To be and to have (-oir verbs) (pp. 24-33)
  { french: "Nous sommes fatigués après ce long voyage.", english: "We are tired after this long trip.", chapter_number: 3, page_printed: 25, tense_id: "tense_present_indicative", verb_ids: ["être"] },
  { french: "Elle est très fière de son travail.", english: "She is very proud of her work.", chapter_number: 3, page_printed: 26, tense_id: "tense_present_indicative", verb_ids: ["être"] },
  { french: "Ils ont une grande maison au bord de la mer.", english: "They have a large house by the seaside.", chapter_number: 3, page_printed: 27, tense_id: "tense_present_indicative", verb_ids: ["avoir"] },
  { french: "J'ai très faim et j'ai grand soif.", english: "I am very hungry and very thirsty.", chapter_number: 3, page_printed: 28, tense_id: "tense_present_indicative", verb_ids: ["avoir"], expression_ids: ["avoir faim", "avoir soif"] },
  { french: "Elle a peur des chiens et des araignées.", english: "She is afraid of dogs and spiders.", chapter_number: 3, page_printed: 28, tense_id: "tense_present_indicative", verb_ids: ["avoir"], expression_ids: ["avoir peur de"] },
  { french: "Nous avons grand besoin de faire une pause.", english: "We really need to take a break.", chapter_number: 3, page_printed: 28, tense_id: "tense_present_indicative", verb_ids: ["avoir", "faire"], expression_ids: ["avoir besoin de"] },
  { french: "Tu as tout à fait raison sur ce point.", english: "You are completely right on this point.", chapter_number: 3, page_printed: 28, tense_id: "tense_present_indicative", verb_ids: ["avoir"], expression_ids: ["avoir raison"] },
  { french: "Je peux vous aider à porter ces valises.", english: "I can help you carry those suitcases.", chapter_number: 3, page_printed: 30, tense_id: "tense_present_indicative", verb_ids: ["pouvoir", "aider", "porter"] },
  { french: "Nous voulons réserver une chambre avec vue.", english: "We want to book a room with a view.", chapter_number: 3, page_printed: 30, tense_id: "tense_present_indicative", verb_ids: ["vouloir", "réserver"] },
  { french: "Elle sait parler trois langues étrangères.", english: "She knows how to speak three foreign languages.", chapter_number: 3, page_printed: 30, tense_id: "tense_present_indicative", verb_ids: ["savoir", "parler"] },

  // CHAPTER 4: Irregular verbs (aller, venir, faire, prendre, mettre, dire) (pp. 34-42)
  { french: "Je vais aller chercher les enfants à l'école.", english: "I am going to go pick up the children at school.", chapter_number: 4, page_printed: 35, tense_id: "tense_present_indicative", verb_ids: ["aller", "chercher"], expression_ids: ["aller + infinitif", "aller chercher"] },
  { french: "Nous venons d'arriver à la gare centrale.", english: "We have just arrived at the central station.", chapter_number: 4, page_printed: 36, tense_id: "tense_present_indicative", verb_ids: ["venir", "arriver"], expression_ids: ["venir de + infinitif"] },
  { french: "Il fait la cuisine pour tous ses amis.", english: "He cooks for all his friends.", chapter_number: 4, page_printed: 39, tense_id: "tense_present_indicative", verb_ids: ["faire"], expression_ids: ["faire la cuisine"] },
  { french: "Faites attention en traversant la rue.", english: "Pay attention while crossing the street.", chapter_number: 4, page_printed: 39, tense_id: "tense_imperatif", verb_ids: ["faire", "traverser"], expression_ids: ["faire attention à"] },
  { french: "Elle fait semblant de ne pas comprendre.", english: "She pretends not to understand.", chapter_number: 4, page_printed: 39, tense_id: "tense_present_indicative", verb_ids: ["faire", "comprendre"], expression_ids: ["faire semblant de + infinitif"] },
  { french: "Je fais réparer ma voiture au garage.", english: "I am having my car repaired at the garage.", chapter_number: 4, page_printed: 40, tense_id: "tense_present_indicative", verb_ids: ["faire", "réparer"], expression_ids: ["faire + infinitif"] },
  { french: "Prenez une décision sans tarder!", english: "Make a decision without delay!", chapter_number: 4, page_printed: 41, tense_id: "tense_imperatif", verb_ids: ["prendre"] },

  // CHAPTER 5: Devoir, Il y a, Il s'agit de (pp. 43-48)
  { french: "Vous devez présenter votre passeport à l'embarquement.", english: "You must present your passport at boarding.", chapter_number: 5, page_printed: 43, tense_id: "tense_present_indicative", verb_ids: ["devoir", "présenter"] },
  { french: "Il y a beaucoup de monde sur la plage aujourd'hui.", english: "There are a lot of people on the beach today.", chapter_number: 5, page_printed: 44, tense_id: "tense_present_indicative", verb_ids: ["avoir"], expression_ids: ["il y a"] },
  { french: "Il s'agit d'un projet de grande envergure.", english: "It is a large-scale project.", chapter_number: 5, page_printed: 45, tense_id: "tense_present_indicative", verb_ids: ["agir"], expression_ids: ["il s'agit de"] },
  { french: "Ils craignent les conséquences de cette décision.", english: "They fear the consequences of this decision.", chapter_number: 5, page_printed: 46, tense_id: "tense_present_indicative", verb_ids: ["craindre"] },

  // CHAPTER 6: Pronominal verbs (pp. 49-54)
  { french: "Je me lève à six heures du matin.", english: "I get up at six o'clock in the morning.", chapter_number: 6, page_printed: 49, tense_id: "tense_present_indicative", verb_ids: ["se lever"] },
  { french: "Dépêchez-vous, nous allons être en retard!", english: "Hurry up, we are going to be late!", chapter_number: 6, page_printed: 50, tense_id: "tense_imperatif", verb_ids: ["se dépêcher", "aller", "être"], expression_ids: ["se dépêcher de + infinitif", "être en retard"] },
  { french: "Elle se souvient toujours des anniversaires de ses amis.", english: "She always remembers her friends' birthdays.", chapter_number: 6, page_printed: 50, tense_id: "tense_present_indicative", verb_ids: ["se souvenir"], expression_ids: ["se souvenir de"] },
  { french: "Ils s'entendent à merveille depuis des années.", english: "They get along wonderfully for years.", chapter_number: 6, page_printed: 51, tense_id: "tense_present_indicative", verb_ids: ["s'entendre"] },

  // CHAPTER 7: Passé composé (pp. 55-64)
  { french: "Hier soir, nous avons dîné chez des amis.", english: "Yesterday evening, we had dinner at friends' place.", chapter_number: 7, page_printed: 55, tense_id: "tense_passe_compose", verb_ids: ["dîner"] },
  { french: "Elle est partie pour Nice la semaine dernière.", english: "She left for Nice last week.", chapter_number: 7, page_printed: 58, tense_id: "tense_passe_compose", verb_ids: ["partir"] },
  { french: "Ils sont arrivés à l'aéroport à midi précis.", english: "They arrived at the airport at exactly noon.", chapter_number: 7, page_printed: 58, tense_id: "tense_passe_compose", verb_ids: ["arriver"] },
  { french: "Elle s'est réveillée en sursaut au milieu de la nuit.", english: "She woke up with a start in the middle of the night.", chapter_number: 7, page_printed: 61, tense_id: "tense_passe_compose", verb_ids: ["se réveiller"] },

  // CHAPTER 8: Imparfait (pp. 65-71)
  { french: "Quand j'étais petit, nous habitions au bord du lac.", english: "When I was small, we used to live by the lake.", chapter_number: 8, page_printed: 65, tense_id: "tense_imparfait", verb_ids: ["être", "habiter"] },
  { french: "Il faisait doux et le vent soufflait doucement.", english: "It was mild and the wind was blowing gently.", chapter_number: 8, page_printed: 66, tense_id: "tense_imparfait", verb_ids: ["faire", "souffler"] },
  { french: "Pendant que je lisais, mon frère cuisinait.", english: "While I was reading, my brother was cooking.", chapter_number: 8, page_printed: 68, tense_id: "tense_imparfait", verb_ids: ["lire", "cuisiner"] },

  // CHAPTER 9: Futur simple & Futur antérieur (pp. 72-80)
  { french: "Demain matin, je prendrai le train de sept heures.", english: "Tomorrow morning, I will take the seven o'clock train.", chapter_number: 9, page_printed: 72, tense_id: "tense_futur_simple", verb_ids: ["prendre"] },
  { french: "Dès que vous arriverez, appelez-moi immédiatement.", english: "As soon as you arrive, call me immediately.", chapter_number: 9, page_printed: 74, tense_id: "tense_futur_simple", verb_ids: ["arriver", "appeler"] },
  { french: "Quand j'aurai fini mon livre, je vous le prêterai.", english: "When I have finished my book, I will lend it to you.", chapter_number: 9, page_printed: 76, tense_id: "tense_futur_anterieur", verb_ids: ["finir", "prêter"] },

  // CHAPTER 10: Plus-que-parfait (pp. 81-86)
  { french: "Elle avait préparé le repas avant notre arrivée.", english: "She had prepared the meal before our arrival.", chapter_number: 10, page_printed: 81, tense_id: "tense_plus_que_parfait", verb_ids: ["préparer"] },
  { french: "Ils étaient sortis quand le facteur a sonné.", english: "They had gone out when the mail carrier rang.", chapter_number: 10, page_printed: 82, tense_id: "tense_plus_que_parfait", verb_ids: ["sortir", "sonner"] },

  // CHAPTER 11 & 12: Conditional & Si clauses (pp. 87-103)
  { french: "Si j'avais assez d'argent, j'achèterais cet appartement.", english: "If I had enough money, I would buy this apartment.", chapter_number: 11, page_printed: 89, tense_id: "tense_conditionnel_present", verb_ids: ["avoir", "acheter"] },
  { french: "Je voudrais un café noir et un croissant, s'il vous plaît.", english: "I would like a black coffee and a croissant, please.", chapter_number: 11, page_printed: 91, tense_id: "tense_conditionnel_present", verb_ids: ["vouloir"] },
  { french: "Pourriez-vous répéter votre question plus lentement?", english: "Could you repeat your question more slowly?", chapter_number: 11, page_printed: 91, tense_id: "tense_conditionnel_present", verb_ids: ["pouvoir", "répéter"] },
  { french: "Si tu avais étudié, tu aurais réussi l'examen.", english: "If you had studied, you would have passed the exam.", chapter_number: 12, page_printed: 98, tense_id: "tense_conditionnel_passe", verb_ids: ["étudier", "réussir"] },

  // CHAPTER 13: Subjunctive (pp. 104-114)
  { french: "Il faut que nous prenions une décision maintenant.", english: "We must make a decision now.", chapter_number: 13, page_printed: 104, tense_id: "tense_subjonctif_present", verb_ids: ["falloir", "prendre"], expression_ids: ["il faut que + subjonctif"] },
  { french: "Je veux que vous soyez à l'heure demain.", english: "I want you to be on time tomorrow.", chapter_number: 13, page_printed: 106, tense_id: "tense_subjonctif_present", verb_ids: ["vouloir", "être"], expression_ids: ["vouloir que + subjonctif", "être à l'heure"] },
  { french: "Bien qu'il pleuve, ils sont allés faire une promenade.", english: "Although it is raining, they went for a walk.", chapter_number: 13, page_printed: 108, tense_id: "tense_subjonctif_present", verb_ids: ["pleuvoir", "aller", "faire"], expression_ids: ["bien que + subjonctif"] },
  { french: "Je vous donne les clés pour que vous puissiez entrer.", english: "I give you the keys so that you can enter.", chapter_number: 13, page_printed: 108, tense_id: "tense_subjonctif_present", verb_ids: ["donner", "pouvoir", "entrer"], expression_ids: ["pour que + subjonctif"] },

  // CHAPTER 14: Infinitive mood & Prepositional patterns (pp. 115-125)
  { french: "Faire la cuisine est son passe-temps favori.", english: "Cooking is his favorite pastime.", chapter_number: 14, page_printed: 115, tense_id: "tense_present_indicative", verb_ids: ["faire", "être"], expression_ids: ["faire la cuisine"] },
  { french: "Suivre des cours de cuisine est très enrichissant.", english: "Taking cooking classes is very rewarding.", chapter_number: 14, page_printed: 115, tense_id: "tense_present_indicative", verb_ids: ["suivre", "être"] },
  { french: "Voyager par le train est rapide et confortable.", english: "Traveling by train is fast and comfortable.", chapter_number: 14, page_printed: 115, tense_id: "tense_present_indicative", verb_ids: ["voyager", "être"] },
  { french: "Apprendre une langue étrangère demande de la patience.", english: "Learning a foreign language requires patience.", chapter_number: 14, page_printed: 115, tense_id: "tense_present_indicative", verb_ids: ["apprendre", "demander"] },
  { french: "Prendre ce médicament deux fois par jour.", english: "Take this medication twice a day.", chapter_number: 14, page_printed: 115, tense_id: "tense_present_indicative", verb_ids: ["prendre"] },
  { french: "Ne pas se pencher par la portière.", english: "Do not lean out of the door.", chapter_number: 14, page_printed: 115, tense_id: "tense_present_indicative", verb_ids: ["se pencher"] },
  { french: "Ne pas marcher sur la pelouse du parc.", english: "Keep off the lawn in the park.", chapter_number: 14, page_printed: 115, tense_id: "tense_present_indicative", verb_ids: ["marcher"] },
  { french: "Lire attentivement la notice avant usage.", english: "Read the instructions carefully before use.", chapter_number: 14, page_printed: 115, tense_id: "tense_present_indicative", verb_ids: ["lire"] },
  { french: "Il a promis de ne pas ajouter trop de sel.", english: "He promised not to add too much salt.", chapter_number: 14, page_printed: 115, tense_id: "tense_passe_compose", verb_ids: ["promettre", "ajouter"], expression_ids: ["promettre de + infinitif"] },
  { french: "Je lui ai demandé de ne pas faire frire le poisson.", english: "I asked her not to fry the fish.", chapter_number: 14, page_printed: 115, tense_id: "tense_passe_compose", verb_ids: ["demander", "faire", "frire"], expression_ids: ["demander à qqn de + infinitif"] },
  { french: "Elle m’a dit de ne pas mettre d’huile.", english: "She told me not to put any oil in.", chapter_number: 14, page_printed: 115, tense_id: "tense_passe_compose", verb_ids: ["dire", "mettre"], expression_ids: ["dire à qqn de + infinitif"] },
  { french: "Je lui ai conseillé de ne pas mettre le plat au four trop tôt.", english: "I advised her not to put the dish in the oven too early.", chapter_number: 14, page_printed: 115, tense_id: "tense_passe_compose", verb_ids: ["conseiller", "mettre"], expression_ids: ["conseiller à qqn de + infinitif"] },
  { french: "Hacher finement les herbes fraîches.", english: "Chop the fresh herbs finely.", chapter_number: 14, page_printed: 116, tense_id: "tense_present_indicative", verb_ids: ["hacher"] },
  { french: "Farcir la volaille avec les marrons.", english: "Stuff the poultry with chestnuts.", chapter_number: 14, page_printed: 116, tense_id: "tense_present_indicative", verb_ids: ["farcir"] },
  { french: "Râper du gruyère sur le dessus.", english: "Grate gruyère cheese on top.", chapter_number: 14, page_printed: 116, tense_id: "tense_present_indicative", verb_ids: ["râper"] },
  { french: "Pocher le filet de saumon dans le court-bouillon.", english: "Poach the salmon fillet in the stock.", chapter_number: 14, page_printed: 116, tense_id: "tense_present_indicative", verb_ids: ["pocher"] },
  { french: "J’ai vu les enfants traverser prudemment la rue.", english: "I saw the children crossing the street prudently.", chapter_number: 14, page_printed: 117, tense_id: "tense_passe_compose", verb_ids: ["voir", "traverser"] },
  { french: "Elle a entendu les cloches sonner au loin.", english: "She heard the bells ringing in the distance.", chapter_number: 14, page_printed: 117, tense_id: "tense_passe_compose", verb_ids: ["entendre", "sonner"] },
  { french: "On entendait les oiseaux chanter à l'aube.", english: "We could hear the birds singing at dawn.", chapter_number: 14, page_printed: 117, tense_id: "tense_imparfait", verb_ids: ["entendre", "chanter"] },
  { french: "Elle a vu le cerf sauter par-dessus la barrière.", english: "She saw the stag jumping over the fence.", chapter_number: 14, page_printed: 117, tense_id: "tense_passe_compose", verb_ids: ["voir", "sauter"] },
  { french: "Que dire dans une telle situation?", english: "What is there to say in such a situation?", chapter_number: 14, page_printed: 117, tense_id: "tense_present_indicative", verb_ids: ["dire"] },
  { french: "Pourquoi protester si tout va bien?", english: "Why protest if everything is going well?", chapter_number: 14, page_printed: 117, tense_id: "tense_present_indicative", verb_ids: ["protester", "aller"] },
  { french: "Comment lui expliquer notre point de vue?", english: "How to explain our point of view to him?", chapter_number: 14, page_printed: 117, tense_id: "tense_present_indicative", verb_ids: ["expliquer"] },
  { french: "Quoi faire face à ce problème inattendu?", english: "What can we do facing this unexpected problem?", chapter_number: 14, page_printed: 117, tense_id: "tense_present_indicative", verb_ids: ["faire"] },
  { french: "Il est assis au café à lire son journal.", english: "He is sitting at the cafe reading his newspaper.", chapter_number: 14, page_printed: 118, tense_id: "tense_present_indicative", verb_ids: ["être", "lire"] },
  { french: "Elle est occupée à préparer les invitations.", english: "She is busy preparing the invitations.", chapter_number: 14, page_printed: 118, tense_id: "tense_present_indicative", verb_ids: ["être", "préparer"] },
  { french: "Les invités ont remercié les hôtes d'avoir organisé cette fête.", english: "The guests thanked the hosts for having organized this party.", chapter_number: 14, page_printed: 119, tense_id: "tense_passe_compose", verb_ids: ["remercier", "organiser"], expression_ids: ["remercier de + infinitif"] },
  { french: "Nous nous sommes excusés d’être arrivés si tard.", english: "We apologized for arriving so late.", chapter_number: 14, page_printed: 119, tense_id: "tense_passe_compose", verb_ids: ["s'excuser", "arriver"], expression_ids: ["s'excuser de + infinitif"] },
  { french: "Il a regretté d’avoir parlé sans réfléchir.", english: "He regretted having spoken without thinking.", chapter_number: 14, page_printed: 119, tense_id: "tense_passe_compose", verb_ids: ["regretter", "parler", "réfléchir"], expression_ids: ["regretter de + infinitif"] },
  { french: "Faites mariner la viande avant d’éplucher les légumes.", english: "Marinate the meat before peeling the vegetables.", chapter_number: 14, page_printed: 119, tense_id: "tense_imperatif", verb_ids: ["faire", "mariner", "éplucher"] },
  { french: "Servez le vin après avoir débouché la bouteille.", english: "Serve the wine after uncorking the bottle.", chapter_number: 14, page_printed: 119, tense_id: "tense_imperatif", verb_ids: ["servir", "déboucher"] },
  { french: "Les voisins aiment se réunir sur la terrasse.", english: "The neighbors like to gather on the terrace.", chapter_number: 14, page_printed: 121, tense_id: "tense_present_indicative", verb_ids: ["aimer", "se réunir"] },
  { french: "Elle espère trouver un emploi intéressant.", english: "She hopes to find an interesting job.", chapter_number: 14, page_printed: 121, tense_id: "tense_present_indicative", verb_ids: ["espérer", "trouver"] },
  { french: "Il sait préparer d'excellents gâteaux.", english: "He knows how to prepare excellent cakes.", chapter_number: 14, page_printed: 121, tense_id: "tense_present_indicative", verb_ids: ["savoir", "préparer"] },

  // CHAPTER 15: Present participle & Gerund (pp. 126-130)
  { french: "En persévérant, il a surmonté toutes les difficultés.", english: "By persevering, he overcame all difficulties.", chapter_number: 15, page_printed: 127, tense_id: "tense_passe_compose", verb_ids: ["persévérer", "surmonter"] },
  { french: "Elle aime chanter tout en cuisinant.", english: "She likes to sing while cooking.", chapter_number: 15, page_printed: 128, tense_id: "tense_present_indicative", verb_ids: ["aimer", "chanter", "cuisiner"] },

  // CHAPTER 16: Passé simple (pp. 131-135)
  { french: "Le cortège s'arrêta devant le grand palais.", english: "The procession stopped in front of the grand palace.", chapter_number: 16, page_printed: 132, tense_id: "tense_passe_simple", verb_ids: ["s'arrêter"] },
  { french: "Ils prirent place autour de la table ronde.", english: "They took their seats around the round table.", chapter_number: 16, page_printed: 133, tense_id: "tense_passe_simple", verb_ids: ["prendre"] },

  // CHAPTER 17: Passive voice (pp. 136-140)
  { french: "Ce tableau a été peint par un artiste célèbre.", english: "This painting was painted by a famous artist.", chapter_number: 17, page_printed: 137, tense_id: "tense_passe_compose", verb_ids: ["peindre", "être"] },
  { french: "Le document sera signé par les deux directeurs.", english: "The document will be signed by both directors.", chapter_number: 17, page_printed: 138, tense_id: "tense_futur_simple", verb_ids: ["signer", "être"] },

  // CHAPTER 18: Indirect speech (pp. 141-146)
  { french: "Le journaliste annonce que les négociations ont abouti.", english: "The journalist announces that negotiations have succeeded.", chapter_number: 18, page_printed: 142, tense_id: "tense_present_indicative", verb_ids: ["annoncer", "aboutir"] },
  { french: "Il m'a demandé si nous étions prêts à partir.", english: "He asked me if we were ready to leave.", chapter_number: 18, page_printed: 144, tense_id: "tense_passe_compose", verb_ids: ["demander", "être", "partir"] },

  // CHAPTER 19: Imperative (pp. 147-151)
  { french: "Fermez la porte à clé avant de partir!", english: "Lock the door before leaving!", chapter_number: 19, page_printed: 148, tense_id: "tense_imperatif", verb_ids: ["fermer", "partir"] },
  { french: "Passez-moi le dictionnaire, s'il vous plaît.", english: "Hand me the dictionary, please.", chapter_number: 19, page_printed: 149, tense_id: "tense_imperatif", verb_ids: ["passer"] },

  // CHAPTER 20: Articles & Nouns (pp. 152-165)
  { french: "Il boit toujours une tasse de café après le déjeuner.", english: "He always drinks a cup of coffee after lunch.", chapter_number: 20, page_printed: 156, tense_id: "tense_present_indicative", verb_ids: ["boire"] },
  { french: "Nous avons acheté un kilo de pommes au marché.", english: "We bought a kilo of apples at the market.", chapter_number: 20, page_printed: 158, tense_id: "tense_passe_compose", verb_ids: ["acheter"] },

  // CHAPTER 21: Pronouns (pp. 166-182)
  { french: "Je la rencontre souvent à la bibliothèque.", english: "I often run into her at the library.", chapter_number: 21, page_printed: 168, tense_id: "tense_present_indicative", verb_ids: ["rencontrer"] },
  { french: "Nous lui avons envoyé une carte d'anniversaire.", english: "We sent him/her a birthday card.", chapter_number: 21, page_printed: 170, tense_id: "tense_passe_compose", verb_ids: ["envoyer"] },
  { french: "Tu vas à Paris? J'y vais aussi la semaine prochaine.", english: "Are you going to Paris? I am going there too next week.", chapter_number: 21, page_printed: 175, tense_id: "tense_present_indicative", verb_ids: ["aller"] },
  { french: "Il y a des fraises? Oui, j'en prends un panier.", english: "Are there strawberries? Yes, I'll take a basket of them.", chapter_number: 21, page_printed: 176, tense_id: "tense_present_indicative", verb_ids: ["avoir", "prendre"] },
  { french: "Ce secret, je te le confie à toi seul.", english: "This secret, I entrust it to you alone.", chapter_number: 21, page_printed: 178, tense_id: "tense_present_indicative", verb_ids: ["confier"] },

  // CHAPTER 22: Adjectives & Comparisons (pp. 183-190)
  { french: "Cette ville est plus ancienne que notre capitale.", english: "This town is older than our capital.", chapter_number: 22, page_printed: 187, tense_id: "tense_present_indicative", verb_ids: ["être"], expression_ids: ["plus ... que"] },
  { french: "Ce livre est moins difficile que je ne le pensais.", english: "This book is less difficult than I thought.", chapter_number: 22, page_printed: 187, tense_id: "tense_present_indicative", verb_ids: ["être", "penser"], expression_ids: ["moins ... que"] },
  { french: "Elle chante aussi bien que sa sœur aînée.", english: "She sings as well as her older sister.", chapter_number: 22, page_printed: 187, tense_id: "tense_present_indicative", verb_ids: ["chanter"], expression_ids: ["aussi ... que"] },

  // CHAPTER 23: Demonstrative adjectives & Prepositions (pp. 191-201)
  { french: "L'hôtel se trouve en face de l'office de tourisme.", english: "The hotel is located opposite the tourist office.", chapter_number: 23, page_printed: 195, tense_id: "tense_present_indicative", verb_ids: ["se trouver"], expression_ids: ["en face de"] },
  { french: "Grâce à votre soutien, nous avons atteint notre objectif.", english: "Thanks to your support, we reached our goal.", chapter_number: 23, page_printed: 196, tense_id: "tense_passe_compose", verb_ids: ["atteindre"], expression_ids: ["grâce à"] },
  { french: "Le pont traverse la rivière au milieu de la forêt.", english: "The bridge crosses the river in the middle of the forest.", chapter_number: 23, page_printed: 195, tense_id: "tense_present_indicative", verb_ids: ["traverser"], expression_ids: ["au milieu de"] },

  // CHAPTER 24: Relative pronouns (pp. 202-211)
  { french: "L'artisan qui a restauré ce meuble est très doué.", english: "The craftsman who restored this piece of furniture is very talented.", chapter_number: 24, page_printed: 202, tense_id: "tense_present_indicative", verb_ids: ["restaurer", "être"] },
  { french: "Le spectacle que nous avons vu était grandiose.", english: "The show that we saw was magnificent.", chapter_number: 24, page_printed: 203, tense_id: "tense_passe_compose", verb_ids: ["voir", "être"] },
  { french: "Le projet dont nous parlons verra le jour bientôt.", english: "The project we are talking about will see the light soon.", chapter_number: 24, page_printed: 204, tense_id: "tense_present_indicative", verb_ids: ["parler", "voir"] },
  { french: "Ce qui compte le plus, c'est votre motivation.", english: "What matters most is your motivation.", chapter_number: 24, page_printed: 205, tense_id: "tense_present_indicative", verb_ids: ["compter", "être"], expression_ids: ["ce qui"] },

  // CHAPTER 25: Adverbs & Expressions of time (pp. 212-220)
  { french: "Le médecin arrivera tout de suite après sa consultation.", english: "The doctor will arrive immediately after his appointment.", chapter_number: 25, page_printed: 215, tense_id: "tense_futur_simple", verb_ids: ["arriver"], expression_ids: ["tout de suite"] },
  { french: "Nous nous promenons dans ce parc de temps en temps.", english: "We walk in this park from time to time.", chapter_number: 25, page_printed: 215, tense_id: "tense_present_indicative", verb_ids: ["se promener"], expression_ids: ["de temps en temps"] },
  { french: "Tout à coup, les lumières de la salle se sont éteintes.", english: "All of a sudden, the room lights went out.", chapter_number: 25, page_printed: 215, tense_id: "tense_passe_compose", verb_ids: ["s'éteindre"], expression_ids: ["tout à coup"] },

  // CHAPTER 26: Numbers (pp. 221-229)
  { french: "Une dizaine de personnes attendaient devant la porte.", english: "About ten people were waiting in front of the door.", chapter_number: 26, page_printed: 224, tense_id: "tense_imparfait", verb_ids: ["attendre"] },
  { french: "La plupart des étudiants ont réussi cette épreuve.", english: "Most of the students passed this test.", chapter_number: 26, page_printed: 226, tense_id: "tense_passe_compose", verb_ids: ["réussir"], expression_ids: ["la plupart de"] },

  // CHAPTER 27: Connectors & Pot-pourri (pp. 230-235)
  { french: "La route était barrée, par conséquent nous avons fait un détour.", english: "The road was blocked, consequently we took a detour.", chapter_number: 27, page_printed: 230, tense_id: "tense_passe_compose", verb_ids: ["être", "faire"], expression_ids: ["par conséquent"] },
  { french: "Bien que le chemin soit difficile, le sommet offre une vue splendide.", english: "Although the path is difficult, the summit offers a splendid view.", chapter_number: 27, page_printed: 230, tense_id: "tense_subjonctif_present", verb_ids: ["être", "offrir"], expression_ids: ["bien que + subjonctif"] },
  { french: "Puisque vous êtes prêts, nous pouvons commencer la réunion.", english: "Since you are ready, we can begin the meeting.", chapter_number: 27, page_printed: 230, tense_id: "tense_present_indicative", verb_ids: ["être", "pouvoir", "commencer"], expression_ids: ["puisque"] },
];

export function buildEnrichedExamples(): Example[] {
  return MASTER_EXAMPLE_SPECS.map((spec, idx) => {
    const prefix = spec.verb_ids && spec.verb_ids.length > 0 ? spec.verb_ids[0] : `ch${spec.chapter_number}`;
    const id = makeExampleId(prefix, idx + 1);

    const verbIds = (spec.verb_ids || []).map((v) => makeVerbId(v));
    const exprIds = (spec.expression_ids || []).map((e) => makeExpressionId(e));
    const tenseIds = spec.tense_id ? [spec.tense_id] : ["tense_present_indicative"];
    const ruleIds = spec.rule_id ? [spec.rule_id] : [];

    return {
      id,
      type: "example" as const,
      french: spec.french,
      english: spec.english,
      literal_english: null,
      source_type: "book",
      annotations: {
        focus_spans: [],
      },
      relations: {
        verbs: verbIds,
        expressions: exprIds,
        tenses: tenseIds,
        grammar_rules: ruleIds,
        vocabulary: (spec.vocabulary_ids || []).map((w) => makeVocabId(w)),
      },
      cloze_candidates: [],
      study: { difficulty: 2 },
      attestations: [
        {
          source_type: "book",
          chapter_number: spec.chapter_number,
          page_printed: spec.page_printed,
          context_type: "example_sentence",
        },
      ],
    };
  });
}
