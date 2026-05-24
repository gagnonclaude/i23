export const siteConfig = {
  name: "i23",
  description: "Améliorer sa trajectoire de vie une expérience à la fois.",
  url: "https://i23.ca",
  ogImage: "https://i23.ca/og.jpg",
  links: {
    email: "info@i23.ca",
  },
};

export type EtapeParcours =
  | "initialisation"
  | "mc-methode"
  | "quiz-methode"
  | "badge-methode"
  | "mc-thematique"
  | "quiz-thematique"
  | "badge-thematique"
  | "outil-schema"
  | "badge-cycle"
  | "experimentation"
  | "trajectoire";

export type BadgeType =
  | "methode-i+"
  | "thematique"
  | "cycle-modification";

export const parcoursConfig: {
  etapes: { id: EtapeParcours; nom: string; description: string; chemin: string; debloquePar: EtapeParcours[] }[];
} = {
  etapes: [
    { id: "initialisation", nom: "Initialisation i+", description: "Profil, bilan des thématiques, priorités", chemin: "/initialisation", debloquePar: [] },
    { id: "mc-methode", nom: "Masterclass Méthode i+", description: "Base obligatoire pour tous les membres", chemin: "/masterclass/methode-i+", debloquePar: ["initialisation"] },
    { id: "quiz-methode", nom: "Quiz Méthode i+", description: "Validation de la compréhension", chemin: "/quiz/methode-i+", debloquePar: ["mc-methode"] },
    { id: "badge-methode", nom: "Badge Méthode i+", description: "Débloque les MC thématiques", chemin: "/badges", debloquePar: ["quiz-methode"] },
    { id: "mc-thematique", nom: "Masterclass thématique", description: "Compréhension spécifique d'une problématique", chemin: "/masterclass/thematique", debloquePar: ["badge-methode"] },
    { id: "quiz-thematique", nom: "Quiz thématique", description: "Validation des notions", chemin: "/quiz/thematique", debloquePar: ["mc-thematique"] },
    { id: "badge-thematique", nom: "Badge thématique", description: "Débloque l'Outil Schéma i+", chemin: "/badges", debloquePar: ["quiz-thematique"] },
    { id: "outil-schema", nom: "Outil Schéma i+", description: "Modification d'une expérience", chemin: "/schema", debloquePar: ["badge-thematique"] },
    { id: "badge-cycle", nom: "Badge cycle de modification", description: "Débloque l'Expérimentation i+", chemin: "/badges", debloquePar: ["outil-schema"] },
    { id: "experimentation", nom: "Expérimentation i+", description: "Application réelle et ajustements", chemin: "/experimentation", debloquePar: ["badge-cycle"] },
    { id: "trajectoire", nom: "Trajectoire i+", description: "Construction progressive du changement", chemin: "/trajectoire", debloquePar: ["experimentation"] },
  ],
};

export const badgesConfig: { type: BadgeType; nom: string; icone: string; condition: string }[] = [
  { type: "methode-i+", nom: "Badge Méthode i+", icone: "🎓", condition: "Réussir le quiz de la MC Méthode i+" },
  { type: "thematique", nom: "Badge thématique", icone: "🏅", condition: "Réussir le quiz de la MC thématique" },
  { type: "cycle-modification", nom: "Badge cycle de modification", icone: "🔄", condition: "Compléter un cycle de modification avec l'Outil Schéma" },
];

export const methodeConfig = {
  etapes: [
    { numero: 1, nom: "Observer", description: "Percevoir et sélectionner les informations dans une situation.", postulats: ["Les perceptions sont subjectives.", "Une collecte précise des informations améliore la qualité des autres étapes.", "L'attention ciblée améliore la gestion.", "Les perceptions détaillées permettent une meilleure compréhension des déclencheurs.", "Les données perçues doivent être validées pour éviter les erreurs d'interprétation."] },
    { numero: 2, nom: "Prédire", description: "Créer des scénarios, interprétations et anticipations.", postulats: ["Le passé éclaire le futur.", "Valider ses pensées évite les erreurs de jugement.", "Évaluer les scénarios permet des prédictions réalistes.", "Des interprétations basées sur des faits solides sont essentielles.", "Aligner ses croyances avec ses expériences passées améliore les prédictions."], menaces: ["Je ne suis pas assez bon.", "Je ne mérite pas d'être heureux.", "Je suis un échec.", "Personne ne m'aime vraiment.", "Je n'arriverai jamais à rien.", "Je suis trop vieux pour changer.", "Je suis trop bête pour comprendre.", "Tout est de ma faute.", "Je suis invisible.", "Mes sentiments ne comptent pas.", "Je n'ai pas de talent.", "Je suis toujours en tort.", "Je ne mérite pas de réussir.", "Les autres sont toujours meilleurs que moi.", "Je ne peux pas faire confiance à mon intuition.", "Je ne suis pas digne d'amour.", "Mes rêves sont irréalistes.", "Je suis trop faible pour affronter mes problèmes.", "Personne ne me comprendra jamais.", "Je n'ai rien d'intéressant à dire.", "Je ne peux pas être moi-même.", "Je suis trop imparfait pour être accepté.", "Je suis condamné à être seul.", "Je dois être parfait pour être apprécié.", "Je ne peux pas changer.", "Je suis un fardeau pour les autres.", "Je ne mérite pas le respect.", "Mes efforts ne comptent pas.", "Je suis incapable de prendre des décisions.", "Je suis destiné à échouer.", "Je suis indigne de bonheur.", "Je suis toujours de trop.", "Mes besoins ne sont pas importants.", "Je ne pourrai jamais réparer mes erreurs.", "Je suis responsable du bonheur des autres.", "Je dois me sacrifier pour être aimé.", "Je ne peux pas compter sur moi-même.", "Je suis irrécupérable.", "Les autres pensent toujours du mal de moi.", "Je ne mérite pas de deuxième chance."], opportunites: ["Mon sommeil est une priorité, et une bonne nuit de repos régénère mon énergie.", "Chaque repas équilibré que je prends nourrit mon corps et stimule ma vitalité.", "Boire de l'eau tout au long de la journée maintient mon corps hydraté et mon énergie stable.", "Je choisis de gérer le stress avec des techniques de relaxation pour préserver mon énergie mentale.", "Mes émotions sont des signaux, et les exprimer me libère de l'énergie négative.", "Je trouve l'équilibre entre le travail et la vie personnelle pour maintenir une énergie constante.", "Des pauses régulières nourrissent ma productivité et ma concentration.", "Mon corps est mon allié, et je l'écoute en lui accordant le repos nécessaire.", "Des objectifs réalisables me motivent et me donnent une énergie positive.", "L'exercice physique est un stimulant naturel pour mon énergie physique et mentale.", "Je choisis des collations saines qui soutiennent mon niveau d'énergie tout au long de la journée.", "Ma routine matinale positive me donne une impulsion énergétique chaque jour.", "Je m'expose régulièrement à la lumière naturelle pour réguler mon rythme circadien.", "Le rire est un moyen puissant d'augmenter mon énergie et mon bien-être émotionnel.", "J'entretiens des relations positives qui nourrissent mon énergie émotionnelle.", "La gratitude est une source d'énergie, et je prends le temps de la cultiver chaque jour.", "Je suis capable de dire non lorsque c'est nécessaire pour préserver mon énergie.", "Ma créativité me stimule, et j'exprime librement cette énergie créatrice.", "Des moments de détente sont essentiels pour réapprovisionner mon énergie mentale.", "Je choisis des activités sociales qui nourrissent mon énergie plutôt que de l'épuiser.", "La modération dans toutes les choses maintient mon énergie à un niveau constant.", "Je me connecte avec la nature pour revitaliser mon énergie et ma vitalité.", "Les défis sont des opportunités de croissance qui stimulent mon énergie mentale.", "Je suis attentif à ma posture physique, ce qui renforce ma confiance et mon énergie.", "Ma capacité à apprendre de nouvelles choses me stimule et m'apporte une énergie mentale.", "La pleine conscience calme mon esprit et régule positivement mon niveau d'énergie.", "Je pratique la gestion du temps pour réduire le stress et augmenter mon efficacité.", "La communication ouverte dans mes relations renforce ma connexion et mon énergie sociale.", "Je prends des pauses courtes lorsque nécessaire pour recharger rapidement mon énergie.", "Je trouve du plaisir dans mes activités quotidiennes, ce qui alimente mon énergie.", "L'engagement dans des projets significatifs me donne une énergie motivante.", "J'exprime ma créativité à travers des moyens variés, renforçant ainsi mon énergie.", "Je fixe des limites technologiques pour préserver mon énergie mentale et émotionnelle.", "La compagnie d'animaux de compagnie apporte de la joie et stimule mon énergie.", "Chaque jour, je prends le temps de reconnaître et d'apprécier les aspects positifs de ma vie.", "Les moments de relaxation profonde me revitalisent et maintiennent mon énergie stable.", "Je suis ouvert à de nouvelles expériences qui alimentent ma curiosité et mon énergie.", "Je maintiens une attitude positive, ce qui favorise un flux constant d'énergie positive.", "J'accepte mes limites et demande de l'aide lorsque cela est nécessaire pour maintenir mon énergie.", "Je choisis consciemment des pensées positives qui alimentent mon énergie et ma vitalité."] },
    { numero: 3, nom: "Ressentir", description: "Vivre les émotions et la charge émotive liées à l'expérience.", postulats: ["Identifier clairement chaque émotion est crucial.", "Accepter ses émotions sans jugement aide à mieux les gérer.", "Exprimer les émotions de manière saine améliore le bien-être.", "Gérer les émotions de manière proactive évite qu'elles ne deviennent envahissantes.", "Développer une conscience émotionnelle profonde est bénéfique pour la santé mentale."], composantesParNiveau: { i: { menaces: ["Ressentir souvent de la honte et de la culpabilité après ses actions.", "Ressentir de la peur concernant son avenir.", "Ressentir de la tristesse liée à sa perte de contrôle sur ses habitudes.", "Ressentir de la frustration face à ses échecs répétés de changement.", "Être souvent en colère contre soi-même pour ses actions."], opportunites: ["Ressentir de la détermination à surmonter ses problèmes.", "Ressentir un certain soulagement lorsqu'on parle de ses problèmes avec un conseiller.", "Ressentir de la gratitude pour l'aide reçue.", "Ressentir de l'espoir en voyant des exemples de personnes ayant surmonté des situations similaires.", "Ressentir un regain de confiance en prenant de petites mesures positives chaque jour."] }, "2": { menaces: ["Se sentir souvent isolé en raison de ses problèmes.", "Ressentir de la honte en face de ses amis et de sa famille.", "Avoir peur du jugement des autres.", "Ressentir de la colère lorsque ses proches ne comprennent pas ses luttes.", "Se sentir rejeté par certains membres de sa famille."], opportunites: ["Ressentir de la gratitude pour le soutien de ses amis proches.", "Se sentir réconforté après avoir rejoint un groupe de soutien.", "Ressentir une amélioration dans ses relations en communiquant ouvertement avec ses proches.", "Ressentir un renforcement de ses liens familiaux grâce à des conversations honnêtes et empathiques.", "Ressentir un sentiment d'appartenance en participant à des activités sociales positives."] }, "3": { menaces: ["Se sentir submergé par le désordre de son logement.", "Ressentir de l'anxiété en passant devant des lieux associés aux mauvaises habitudes.", "Se sentir stressé par la pression financière constante.", "Ressentir de la frustration lorsqu'on n'arrive pas à créer un environnement calme chez soi.", "Être perturbé par le bruit et les distractions de son quartier."], opportunites: ["Ressentir de la satisfaction en réorganisant son espace de vie pour qu'il soit plus apaisant.", "Ressentir un sentiment de contrôle en évitant les quartiers associés aux mauvaises habitudes.", "Ressentir une diminution de son stress en suivant un plan budgétaire strict.", "Ressentir une tranquillité d'esprit en créant une zone de détente chez soi pour la méditation.", "Ressentir un apaisement en trouvant des endroits calmes et sereins dans sa communauté pour se ressourcer."] } } },
    { numero: 4, nom: "Choisir", description: "Prendre des décisions selon l'identité, les besoins, les valeurs, la réalité, les autres et l'environnement.", postulats: ["Aligner ses décisions avec ses valeurs renforce l'authenticité.", "Évaluer soigneusement toutes les options mène à de meilleures décisions.", "Prendre des décisions en toute connaissance de cause évite les regrets.", "Assurer que les décisions reflètent sa réalité personnelle est essentiel pour le bien-être.", "Faire des choix qui respectent ses valeurs profondes améliore la satisfaction de vie."], composantesParNiveau: { i: { menaces: ["Continuer ses habitudes destructrices pour tenter de récupérer ses pertes.", "Choisir d'ignorer les conseils de ses amis et de ses conseillers.", "Décider de ne pas suivre de programme de traitement.", "Choisir de rester inactif et de ne pas faire d'exercice.", "Décider de ne pas changer ses habitudes malsaines."], opportunites: ["Décider de chercher de l'aide professionnelle.", "Choisir de suivre les conseils de ses amis et de ses conseillers pour améliorer sa situation.", "Décider de s'inscrire à un programme de traitement.", "Choisir d'intégrer l'exercice physique dans sa routine.", "Décider d'adopter des habitudes alimentaires saines."] }, "2": { menaces: [], opportunites: [] }, "3": { menaces: [], opportunites: [] } } },
    { numero: 5, nom: "Planifier", description: "Préparer les stratégies liées aux décisions.", postulats: ["Définir des objectifs précis et atteignables est essentiel pour le succès.", "Organiser efficacement les ressources maximise les chances de réussite.", "Planifier chaque action avec soin évite les imprévus.", "Préparer chaque étape garantit un bon déroulement des stratégies.", "Anticiper les obstacles permet de les surmonter plus facilement."] },
    { numero: 6, nom: "Agir", description: "Mettre les stratégies en application dans le quotidien.", postulats: ["Intégrer les actions dans une routine quotidienne facilite la cohérence.", "Maintenir la régularité dans les actions est crucial pour des résultats durables.", "Adopter une approche flexible permet de s'adapter aux changements.", "Évaluer régulièrement les progrès aide à ajuster les stratégies.", "Rechercher le soutien social renforce la motivation."] },
    { numero: 7, nom: "Évaluer", description: "Observer les résultats des actions et de l'expérience.", postulats: ["Observer attentivement les résultats obtenus permet d'ajuster les stratégies.", "Comparer les résultats avec les attentes initiales aide à évaluer l'efficacité.", "Interpréter les résultats de manière objective évite les biais.", "Apporter des ajustements basés sur les observations améliore les résultats futurs.", "Utiliser les résultats pour améliorer les stratégies futures est essentiel pour la progression."] },
    { numero: 8, nom: "Apprendre", description: "Intégrer les apprentissages et ajuster les prochaines expériences.", postulats: ["Intégrer les succès et les échecs permet une évolution continue.", "Actualiser constamment ses apprentissages améliore l'adaptabilité.", "Préparer chaque nouvelle expérience avec soin maximise les chances de réussite.", "Tirer des leçons de chaque situation vécue évite de répéter les mêmes erreurs.", "Adopter une attitude d'apprentissage continu favorise le développement personnel."] },
  ],
  niveaux: [
    { id: "i", nom: "Individuel", description: "Relation avec soi. Ce qui est personnel." },
    { id: "2", nom: "Relationnel", description: "Les autres êtres humains, les relations, les interactions." },
    { id: "3", nom: "Environnemental", description: "Tout ce qui n'est pas humain. Contexte, milieu, lieux, ressources." },
  ],
  poles: [
    { id: "menace", nom: "Menace", description: "Composante qui bloque, surcharge, limite ou éloigne." },
    { id: "opportunite", nom: "Opportunité", description: "Composante qui aide, soutient, ouvre une possibilité, clarifie." },
  ],
};

export const pricingConfig = [
  {
    id: "hebdomadaire",
    nom: "Hebdomadaire",
    prix: 49,
    intervalle: "week" as const,
    description: "Accès complet pour une semaine",
  },
  {
    id: "mensuel",
    nom: "Mensuel",
    prix: 99,
    intervalle: "month" as const,
    description: "Accès complet pour un mois",
    populaire: true,
  },
  {
    id: "trimestriel",
    nom: "Trimestriel",
    prix: 199,
    intervalle: "month" as const,
    intervalleCount: 3,
    description: "Accès complet pour 3 mois",
  },
];
