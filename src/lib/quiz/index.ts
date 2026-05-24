export type QuizQuestion = {
  id: string;
  question: string;
  choix: { id: string; texte: string }[];
  bonneReponse: string;
};

export type QuizResultat = {
  score: number;
  total: number;
  reussi: boolean;
  seuil: number;
};

const SEUIL_REUSSITE = 0.7;

export function calculerResultat(reponses: Record<string, string>, questions: QuizQuestion[]): QuizResultat {
  let score = 0;
  for (const q of questions) {
    if (reponses[q.id] === q.bonneReponse) score++;
  }
  const total = questions.length;
  const reussi = total > 0 && score / total >= SEUIL_REUSSITE;
  return { score, total, reussi, seuil: SEUIL_REUSSITE };
}

export const quizMethode: QuizQuestion[] = [
  {
    id: "m1",
    question: "Tu reçois un courriel urgent au travail. Dans la Méthode i+, qu'est-ce qui a activé cette expérience ?",
    choix: [
      { id: "a", texte: "Le stress que tu ressens" },
      { id: "b", texte: "Le courriel — c'est le déclencheur" },
      { id: "c", texte: "Ta journée chargée" },
    ],
    bonneReponse: "b",
  },
  {
    id: "m2",
    question: "Tu vois une tâche importante à faire et tu te concentres uniquement sur son ampleur en ignorant que tu as déjà réussi des tâches similaires. Tu es à quelle étape ?",
    choix: [
      { id: "a", texte: "Prédire — tu anticipes le pire" },
      { id: "b", texte: "Observer — tu perçois de façon sélective et négative" },
      { id: "c", texte: "Ressentir — tu vis l'anxiété" },
    ],
    bonneReponse: "b",
  },
  {
    id: "m3",
    question: "Avant même de commencer, tu penses : \"Je vais encore échouer.\" Tu es à quelle étape, et c'est quoi ?",
    choix: [
      { id: "a", texte: "Observer — une menace dans ta perception" },
      { id: "b", texte: "Prédire — une menace dans tes anticipations" },
      { id: "c", texte: "Choisir — une décision d'évitement" },
    ],
    bonneReponse: "b",
  },
  {
    id: "m4",
    question: "Tu ressens de la culpabilité et de la honte après avoir reporté une tâche. Tu es à quelle étape ?",
    choix: [
      { id: "a", texte: "Évaluer — tu observes tes résultats" },
      { id: "b", texte: "Apprendre — tu intègres un apprentissage" },
      { id: "c", texte: "Ressentir — tu vis la charge émotive de l'expérience" },
    ],
    bonneReponse: "c",
  },
  {
    id: "m5",
    question: "Tu choisis d'éviter une conversation difficile pour ne pas blesser l'autre. Avec quoi est aligné ce choix ?",
    choix: [
      { id: "a", texte: "Tes valeurs de respect" },
      { id: "b", texte: "Ta peur du conflit — c'est une menace à l'étape Choisir" },
      { id: "c", texte: "Les besoins de ton collègue" },
    ],
    bonneReponse: "b",
  },
  {
    id: "m6",
    question: "Tu planifies ta semaine en remplissant chaque heure sans prévoir de temps de récupération. C'est quoi comme composante à l'étape Planifier ?",
    choix: [
      { id: "a", texte: "Une opportunité — tu maximises ton temps" },
      { id: "b", texte: "Une menace — tu planifies sans tenir compte de ton énergie réelle" },
      { id: "c", texte: "Un déclencheur — ta semaine active le schéma" },
    ],
    bonneReponse: "b",
  },
  {
    id: "m7",
    question: "Tu attends d'être motivé avant d'agir, mais la motivation ne vient pas. Que dit la Méthode i+ sur l'étape Agir ?",
    choix: [
      { id: "a", texte: "Il faut mieux planifier pour que la motivation revienne" },
      { id: "b", texte: "L'action précède souvent la motivation — agir d'abord, même petit" },
      { id: "c", texte: "Il faut transformer l'émotion à l'étape Ressentir d'abord" },
    ],
    bonneReponse: "b",
  },
  {
    id: "m8",
    question: "Tu as avancé sur une tâche, mais tu te dis : \"C'est pas assez, j'aurais dû faire plus.\" Tu es à quelle étape et quel est le problème ?",
    choix: [
      { id: "a", texte: "Apprendre — tu intègres un mauvais apprentissage" },
      { id: "b", texte: "Évaluer — tu évalues de façon biaisée et négative malgré un progrès réel" },
      { id: "c", texte: "Observer — tu perçois mal tes résultats" },
    ],
    bonneReponse: "b",
  },
  {
    id: "m9",
    question: "Après chaque conflit, tu apprends : \"Les relations sont toujours difficiles pour moi.\" Quel est le risque selon la Méthode i+ ?",
    choix: [
      { id: "a", texte: "Tu vas éviter les relations" },
      { id: "b", texte: "Cet apprentissage va renforcer ta trajectoire dans cette direction et se répéter" },
      { id: "c", texte: "Tu vas changer de sphère pour travailler autre chose" },
    ],
    bonneReponse: "b",
  },
  {
    id: "m10",
    question: "Tu veux transformer une expérience qui se répète. Par où commences-tu selon la Méthode i+ ?",
    choix: [
      { id: "a", texte: "Tu changes ton environnement en premier" },
      { id: "b", texte: "Tu identifies le déclencheur, tu décortiques le schéma étape par étape, tu repères les menaces à transformer en opportunités" },
      { id: "c", texte: "Tu travailles ta motivation et ta discipline" },
    ],
    bonneReponse: "b",
  },
];

export const quizEnergie: QuizQuestion[] = [
  {
    id: "e1",
    question: "Tu te lèves fatigué malgré 8 heures de sommeil et tu décides de prendre du café pour passer au travers de ta journée chargée. Selon les bases de la gestion de l'énergie, que fais-tu ?",
    choix: [
      { id: "a", texte: "Tu récupères ton énergie efficacement" },
      { id: "b", texte: "Tu utilises un faux boost qui masque le vrai problème sans récupérer" },
      { id: "c", texte: "Tu adaptes ton rythme à ton niveau énergétique réel" },
    ],
    bonneReponse: "b",
  },
  {
    id: "e2",
    question: "Tu remarques de l'irritabilité, des tensions physiques et une baisse de motivation depuis quelques jours. Selon la Méthode i+, ces signaux sont :",
    choix: [
      { id: "a", texte: "Des symptômes à ignorer si tu n'as pas le temps" },
      { id: "b", texte: "Des voyants du tableau de bord énergétique à observer et respecter" },
      { id: "c", texte: "Des problèmes émotionnels à gérer à l'étape Ressentir seulement" },
    ],
    bonneReponse: "b",
  },
  {
    id: "e3",
    question: "Tu as une journée surchargée, peu de sommeil et un conflit non résolu. Un collègue te demande de l'aide sur un projet non urgent. Que suggère la gestion de l'énergie ?",
    choix: [
      { id: "a", texte: "Aider quand même — c'est important pour la relation" },
      { id: "b", texte: "Évaluer si ce trajet vaut le coût énergétique dans tes conditions actuelles" },
      { id: "c", texte: "Refuser toujours quand tu es fatigué" },
    ],
    bonneReponse: "b",
  },
  {
    id: "e4",
    question: "Tu crois qu'il faut toujours continuer, que ralentir est une faiblesse. Dans ton schéma d'énergie, cette croyance est :",
    choix: [
      { id: "a", texte: "Une opportunité — elle te garde productif" },
      { id: "b", texte: "Une menace à l'étape Prédire qui vide ton réservoir" },
      { id: "c", texte: "Un déclencheur externe lié à ton environnement" },
    ],
    bonneReponse: "b",
  },
  {
    id: "e5",
    question: "Tu choisis de travailler jusqu'à 23h malgré ta fatigue pour terminer un projet. Ce choix est aligné avec :",
    choix: [
      { id: "a", texte: "Tes valeurs de rigueur et de performance" },
      { id: "b", texte: "La pression et tes croyances sur la productivité — c'est une menace à l'étape Choisir" },
      { id: "c", texte: "Les besoins du projet" },
    ],
    bonneReponse: "b",
  },
  {
    id: "e6",
    question: "Tu planifies ta semaine sans prévoir de moments de récupération ni de réserve pour les imprévus. Quelle est la conséquence selon les bases de la gestion de l'énergie ?",
    choix: [
      { id: "a", texte: "Tu seras plus efficace car tout est planifié" },
      { id: "b", texte: "Tu n'auras aucune marge d'adaptation — le moindre imprévu devient une surcharge" },
      { id: "c", texte: "Tu construis une opportunité à l'étape Planifier" },
    ],
    bonneReponse: "b",
  },
  {
    id: "e7",
    question: "Tu continues à fonctionner à plein régime malgré les signaux de fatigue depuis des semaines. Selon la métaphore du véhicule, que se passe-t-il ?",
    choix: [
      { id: "a", texte: "Le moteur s'adapte progressivement et devient plus fort" },
      { id: "b", texte: "Le moteur s'use progressivement — sans entretien, les capacités diminuent à long terme" },
      { id: "c", texte: "Tu construis des réserves énergétiques supplémentaires" },
    ],
    bonneReponse: "b",
  },
  {
    id: "e8",
    question: "Tu évalues ta journée en te disant : \"J'ai fait moins que prévu, je suis inefficace.\" Quelle menace est présente à l'étape Évaluer ?",
    choix: [
      { id: "a", texte: "Tu ignores les signaux de ton corps" },
      { id: "b", texte: "Tu évalues ta valeur selon ta productivité en ignorant ton niveau énergétique réel" },
      { id: "c", texte: "Tu planifiais trop au départ" },
    ],
    bonneReponse: "b",
  },
  {
    id: "e9",
    question: "Après plusieurs semaines de surcharge, tu apprends : \"C'est normal d'être épuisé, c'est comme ça la vie.\" Quel est le risque selon la Méthode i+ ?",
    choix: [
      { id: "a", texte: "Tu vas arrêter de travailler" },
      { id: "b", texte: "Tu intègres la surcharge comme normale — ton schéma se renforce et ta trajectoire continue dans cette direction" },
      { id: "c", texte: "Tu vas chercher de l'aide plus rapidement" },
    ],
    bonneReponse: "b",
  },
  {
    id: "e10",
    question: "Tu veux transformer ton schéma énergétique. Quelle est la première question à te poser selon les bases de la gestion de l'énergie ?",
    choix: [
      { id: "a", texte: "Comment puis-je en faire plus avec moins d'énergie ?" },
      { id: "b", texte: "Est-ce que cette expérience vaut réellement son coût énergétique dans mes conditions actuelles ?" },
      { id: "c", texte: "Comment améliorer ma discipline pour mieux gérer ma fatigue ?" },
    ],
    bonneReponse: "b",
  },
];

export const quizParMC: Record<string, QuizQuestion[]> = {
  "methode-i+": quizMethode,
  "energie": quizEnergie,
};

export function getQuizByMC(mcId: string): QuizQuestion[] {
  return quizParMC[mcId] ?? [];
}
