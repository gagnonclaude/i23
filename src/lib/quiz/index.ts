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
  { id: "m1", question: "Combien d'étapes composent la Méthode i+ ?", choix: [{ id: "a", texte: "6" }, { id: "b", texte: "8" }, { id: "c", texte: "10" }], bonneReponse: "b" },
  { id: "m2", question: "Quelle est la première étape de la Méthode i+ ?", choix: [{ id: "a", texte: "Ressentir" }, { id: "b", texte: "Prédire" }, { id: "c", texte: "Observer" }], bonneReponse: "c" },
  { id: "m3", question: "Qu'est-ce qu'un déclencheur dans la Méthode i+ ?", choix: [{ id: "a", texte: "Une opportunité" }, { id: "b", texte: "Ce qui active une expérience" }, { id: "c", texte: "Un outil i+" }], bonneReponse: "b" },
  { id: "m4", question: "Qu'est-ce qu'une menace dans un schéma d'expérience ?", choix: [{ id: "a", texte: "Une composante qui bloque, surcharge ou limite" }, { id: "b", texte: "Un danger physique" }, { id: "c", texte: "Une étape à éviter" }], bonneReponse: "a" },
  { id: "m5", question: "Qu'est-ce qu'une opportunité dans un schéma d'expérience ?", choix: [{ id: "a", texte: "Une chance de gagner de l'argent" }, { id: "b", texte: "Une composante qui aide, soutient ou ouvre une possibilité" }, { id: "c", texte: "Un événement externe favorable" }], bonneReponse: "b" },
  { id: "m6", question: "Combien de niveaux existe-t-il dans la Méthode i+ ?", choix: [{ id: "a", texte: "2" }, { id: "b", texte: "3" }, { id: "c", texte: "4" }], bonneReponse: "b" },
  { id: "m7", question: "Que signifie le niveau i ?", choix: [{ id: "a", texte: "Individuel" }, { id: "b", texte: "Interne" }, { id: "c", texte: "Intelligent" }], bonneReponse: "a" },
  { id: "m8", question: "Qu'est-ce qu'une trajectoire dans la Méthode i+ ?", choix: [{ id: "a", texte: "Un chemin physique" }, { id: "b", texte: "L'accumulation des expériences dans le temps" }, { id: "c", texte: "Un plan financier" }], bonneReponse: "b" },
  { id: "m9", question: "À quoi servent les Outils i+ ?", choix: [{ id: "a", texte: "À mesurer le QI" }, { id: "b", texte: "À transformer une menace en opportunité" }, { id: "c", texte: "À créer des schémas" }], bonneReponse: "b" },
  { id: "m10", question: "Quelle étape suit Choisir dans la Méthode i+ ?", choix: [{ id: "a", texte: "Agir" }, { id: "b", texte: "Planifier" }, { id: "c", texte: "Évaluer" }], bonneReponse: "b" },
];
