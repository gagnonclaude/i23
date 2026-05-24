export const niveauxMaslow = [
  { id: "physiologique", nom: "Besoins physiologiques", description: "Énergie, sommeil, alimentation, fonctionnement quotidien", color: "bg-red-400" },
  { id: "securite", nom: "Besoins de sécurité", description: "Sécurité émotionnelle, stabilité, santé, environnement sécurisant", color: "bg-orange-400" },
  { id: "appartenance", nom: "Besoins d'appartenance", description: "Relations, amour, communication, connexion sociale", color: "bg-yellow-400" },
  { id: "estime", nom: "Besoins d'estime", description: "Confiance, valeur personnelle, reconnaissance, compétence", color: "bg-green-400" },
  { id: "accomplissement", nom: "Accomplissement de soi", description: "Sens, mission, croissance, réalisation personnelle", color: "bg-i23-turquoise" },
] as const;

export type NiveauMaslow = (typeof niveauxMaslow)[number]["id"];

export const thematiquesParNiveau: Record<NiveauMaslow, { id: string; nom: string }[]> = {
  physiologique: [
    { id: "energie", nom: "Gestion de l'énergie" },
    { id: "sommeil", nom: "Sommeil et récupération" },
    { id: "alimentation", nom: "Alimentation" },
    { id: "routine", nom: "Routine de vie équilibrée" },
  ],
  securite: [
    { id: "anxiete", nom: "Gestion de l'anxiété" },
    { id: "temps", nom: "Gestion du temps" },
    { id: "stress", nom: "Stress chronique" },
    { id: "survie", nom: "Sortir du mode survie" },
  ],
  appartenance: [
    { id: "communication", nom: "Communication efficace" },
    { id: "relations", nom: "Relations saines" },
    { id: "conflits", nom: "Gestion des conflits" },
    { id: "limites", nom: "Poser ses limites" },
  ],
  estime: [
    { id: "confiance", nom: "Confiance en soi" },
    { id: "estime", nom: "Estime de soi" },
    { id: "dependances", nom: "Sortir de mes dépendances" },
    { id: "affirmation", nom: "Affirmation de soi" },
  ],
  accomplissement: [
    { id: "mission", nom: "Mission personnelle" },
    { id: "valeurs", nom: "Vie alignée avec mes valeurs" },
    { id: "potentiel", nom: "Plein potentiel" },
    { id: "creativite", nom: "Créativité et expression" },
  ],
};

export const bilanQuestions: { id: string; niveau: NiveauMaslow; question: string }[] = [
  { id: "b1", niveau: "physiologique", question: "À quel point te sens-tu reposé(e) et énergique au quotidien?" },
  { id: "b2", niveau: "physiologique", question: "Tes habitudes de vie (sommeil, alimentation, activité physique) sont-elles satisfaisantes?" },
  { id: "b3", niveau: "securite", question: "Te sens-tu en sécurité émotionnelle dans ta vie actuelle?" },
  { id: "b4", niveau: "securite", question: "Gères-tu bien le stress et l'imprévu au quotidien?" },
  { id: "b5", niveau: "appartenance", question: "Te sens-tu connecté(e) aux personnes qui comptent pour toi?" },
  { id: "b6", niveau: "appartenance", question: "Es-tu à l'aise d'être honnête dans tes relations?" },
  { id: "b7", niveau: "estime", question: "À quel point fais-tu confiance à ton propre jugement?" },
  { id: "b8", niveau: "estime", question: "Te sens-tu capable de prendre ta place et de t'affirmer?" },
  { id: "b9", niveau: "accomplissement", question: "As-tu clairement identifié ce qui te motive et donne du sens à ta vie?" },
  { id: "b10", niveau: "accomplissement", question: "Vis-tu en alignement avec tes valeurs profondes?" },
];
