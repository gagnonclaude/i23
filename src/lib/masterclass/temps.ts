export interface MasterclassSection {
  numero: string;
  titre: string;
  sousTitre?: string;
  fonction: string;
  contenu: string;
  exemple?: string;
  aRetenir?: string[];
  question?: string;
  consigne?: string;
  transition?: string;
}

export interface MasterclassPart {
  numero: number;
  titre: string;
  description: string;
  sections: MasterclassSection[];
}

export interface MasterclassData {
  slug: string;
  thematique: string;
  icon: string;
  personnage: string;
  parties: MasterclassPart[];
}

export const masterclassTemps: MasterclassData = {
  slug: "temps",
  thematique: "Gestion du temps",
  icon: "⏳",
  personnage: "Marc",
  parties: [
    {
      numero: 0,
      titre: "Introduction — Commencer le parcours i+",
      description: "Créer l'ouverture et comprendre le processus",
      sections: [
        {
          numero: "0.1",
          titre: "Bienvenue dans la Masterclass",
          sousTitre: "Tu n'es pas seul",
          fonction: "Créer l'ouverture émotionnelle et l'identification.",
          contenu: "Tu as peut-être l'impression de toujours courir après le temps sans réussir à avancer comme tu le voudrais. Cette Masterclass i+ va t'aider à comprendre ce qui se passe réellement dans tes expériences liées au temps.",
          exemple: "Tu te sens débordé. Tu reportes certaines tâches. Tu finis tes journées fatigué. Tu as l'impression de manquer de temps.",
          aRetenir: ["Ce que tu vis est une expérience, pas une fatalité", "La Méthode i+ t'aide à comprendre et transformer", "Un petit changement peut modifier toute l'expérience"],
          transition: "Voyons ensemble comment utiliser cette Masterclass.",
        },
        {
          numero: "0.2",
          titre: "Bien commencer ton parcours i+",
          sousTitre: "Une étape à la fois",
          fonction: "Expliquer comment utiliser la Masterclass.",
          contenu: "Avance une étape à la fois. Utilise les Outils i+ quand ils sont proposés. Teste les nouvelles stratégies dans ton quotidien. Partage tes expériences dans les Groupes i+.",
          exemple: "Quand tu vas vivre une situation comme commencer une tâche importante ou gérer une surcharge, tu pourras utiliser les outils directement dans ta réalité.",
          aRetenir: ["Avance une section à la fois", "Utilise les Outils i+ proposés", "Teste dans ton quotidien"],
          question: "Qu'est-ce qui t'amène à suivre cette Masterclass?",
          consigne: "Écris ta réponse dans l'Outil Schéma i+ ou dans tes notes personnelles.",
          transition: "Maintenant, découvrons comment fonctionne la Méthode i+.",
        },
        {
          numero: "0.3",
          titre: "Comprendre le processus i+",
          sousTitre: "Les 8 étapes de l'expérience",
          fonction: "Présenter les bases de la Méthode i+.",
          contenu: "Chaque expérience suit les 8 étapes de la Méthode i+. Prenons l'exemple de Marc quand il doit commencer une tâche importante.",
          exemple: "1. Observer : \"La tâche semble énorme.\"\n2. Prédire : \"Je n'aurai jamais le temps.\"\n3. Ressentir : stress.\n4. Choisir : remettre à plus tard.\n5. Planifier : faire autre chose.\n6. Agir : procrastination.\n7. Évaluer : retard.\n8. Apprendre : \"Je fonctionne toujours à la dernière minute.\"",
          aRetenir: ["Chaque expérience suit les 8 étapes", "Un petit changement dans une étape change tout", "Tu peux modifier ton schéma avant de vivre l'expérience"],
          question: "Peux-tu identifier les 8 étapes dans une expérience que tu vis régulièrement?",
          transition: "Tu connais maintenant les bases. Découvrons les Outils i+.",
        },
        {
          numero: "0.4",
          titre: "Les Outils i+",
          sousTitre: "Tes alliés pour transformer",
          fonction: "Préparer l'utilisation des Outils i+.",
          contenu: "Les Outils i+ sont des formulaires interactifs qui t'aident à transformer les menaces en opportunités, une étape à la fois. Tu les utiliseras tout au long de cette Masterclass.",
          exemple: "Outil Schéma i+ : décortiquer une expérience.\nBilan des déclencheurs : identifier ce qui active tes expériences.\nMicro-action engagée : planifier une petite action concrète.",
          aRetenir: ["Les Outils i+ transforment les menaces en opportunités", "Chaque outil correspond à une étape de la méthode", "Tu peux les utiliser en tout temps"],
          transition: "C'est parti! Commençons la première partie.",
        },
      ],
    },
    {
      numero: 1,
      titre: "Comprendre la thématique avec la Méthode i+",
      description: "Expliquer, reconnaître, identifier",
      sections: [
        {
          numero: "1.1",
          titre: "Comprendre pourquoi je cherche des raccourcis",
          sousTitre: "Les automatismes du cerveau",
          fonction: "Expliquer les automatismes du cerveau.",
          contenu: "Quand une tâche semble difficile, ton cerveau cherche une activité plus simple. C'est un mécanisme naturel, pas une faute. Le problème est quand ce mécanisme devient ton seul mode de fonctionnement.",
          exemple: "Marc s'assoit pour travailler. Il regarde la tâche. Son cerveau dit : \"Je vais juste regarder mon téléphone 2 minutes avant de commencer.\" 30 minutes plus tard, il n'a toujours pas commencé.",
          aRetenir: ["Chercher des raccourcis est un mécanisme normal", "Le problème est la répétition du schéma", "Tu peux apprendre à reconnaître ce mécanisme"],
          question: "Quel raccourci ton cerveau cherche-t-il le plus souvent?",
        },
        {
          numero: "1.2",
          titre: "Développer une nouvelle façon de voir mes expériences",
          sousTitre: "De problème à expérience",
          fonction: "Transformer un problème en expérience.",
          contenu: "Au lieu de dire \"J'ai un problème de gestion du temps\", tu peux dire \"Je vis une expérience difficile quand je dois commencer une tâche importante.\" Cette différence change tout. Un problème semble immuable. Une expérience peut être modifiée.",
          exemple: "Marc : \"J'ai toujours été mauvais en gestion du temps.\" → \"Quand je commence une tâche importante, je vis une expérience difficile. Je peux modifier cette expérience.\"",
          aRetenir: ["Un problème semble figé, une expérience peut changer", "Changer la façon de voir = première étape de transformation", "Tu es un expérimentateur, pas un problème"],
          question: "Quel \"problème\" pourrais-tu reformuler comme une expérience?",
        },
        {
          numero: "1.3",
          titre: "Comprendre les causes de mes schémas",
          sousTitre: "Des schémas appris",
          fonction: "Comprendre les schémas appris.",
          contenu: "Tes schémas d'expérience ne sont pas arrivés par hasard. Ils ont été appris. Tu as peut-être appris à fonctionner sous pression, à toujours étudier à la dernière minute, ou vu tes parents fonctionner dans l'urgence.",
          exemple: "Marc a toujours étudié la veille des examens. Son père fonctionnait dans l'urgence. Sa mère faisait tout à la dernière minute. Ces schémas sont devenus les siens.",
          aRetenir: ["Les schémas sont appris, pas innés", "Comprendre l'origine aide à s'en détacher", "Ce qui a été appris peut être réappris"],
          question: "Quel schéma as-tu appris qui influence ta gestion du temps?",
        },
        {
          numero: "1.4",
          titre: "Comprendre les conséquences de la répétition",
          sousTitre: "La trajectoire",
          fonction: "Comprendre la trajectoire.",
          contenu: "Répéter les mêmes expériences crée une trajectoire. Procrastination, retards, désorganisation, surcharge. Ces répétitions mènent au stress, à la fatigue, à la perte de confiance. Mais une trajectoire peut être ajustée.",
          exemple: "Marc répète : procrastination → retard → stress → fatigue → manque de confiance → procrastination. C'est une trajectoire qui se renforce. Mais modifier une seule expérience modifie la trajectoire.",
          aRetenir: ["La répétition crée une trajectoire", "Une trajectoire se modifie une expérience à la fois", "Même un petit changement oriente vers une meilleure direction"],
          question: "Quelle trajectoire observes-tu dans ta gestion du temps?",
        },
        {
          numero: "1.5",
          titre: "La clé : modifier une expérience",
          sousTitre: "Un petit changement, un grand impact",
          fonction: "Comprendre qu'un petit changement peut transformer l'expérience.",
          contenu: "Modifier une seule composante d'une expérience peut transformer le résultat global. Avant : \"Je dois tout faire.\" Après : \"Je vais commencer par 5 minutes.\" Cette seule modification réduit le stress, augmente l'action, améliore les résultats.",
          exemple: "Marc change une seule chose : au lieu de se dire \"Je dois finir ce projet\", il se dit \"Je vais faire 5 minutes.\" Résultat : il commence, le stress baisse, il continue souvent au-delà de 5 minutes.",
          aRetenir: ["Modifier une composante change tout le schéma", "Commencer petit est plus efficace que viser parfait", "L'action précède la motivation, pas l'inverse"],
          consigne: "Identifie une petite modification que tu pourrais faire dans une expérience liée au temps.",
          transition: "Voyons maintenant les menaces et opportunités dans tes expériences.",
        },
        {
          numero: "1.6",
          titre: "Les menaces : ce qui me bloque",
          sousTitre: "Identifier les composantes menaces",
          fonction: "Identifier les composantes menaces.",
          contenu: "Les menaces sont les composantes de ton schéma qui bloquent, surchargent ou limitent. Les voici dans un exemple de gestion du temps.",
          exemple: "Observer : \"C'est trop gros.\"\nPrédire : \"Je n'ai pas assez de temps.\"\nRessentir : stress, découragement\nChoisir : remettre à plus tard\nPlanifier : éviter, faire autre chose\nAgir : procrastiner",
          aRetenir: ["Les menaces se retrouvent dans chaque étape", "Une seule menace peut affecter tout le schéma", "Les identifier est la première étape pour les transformer"],
          question: "Quelles menaces reconnais-tu dans tes expériences liées au temps?",
        },
        {
          numero: "1.7",
          titre: "Les opportunités : ce qui va m'aider",
          sousTitre: "Activer les composantes opportunités",
          fonction: "Identifier les composantes opportunités.",
          contenu: "Les opportunités existent dans chaque expérience, même si elles ne sont pas activées. Les voici dans le même exemple.",
          exemple: "Observer : \"Je peux découper la tâche.\"\nPrédire : \"Commencer petit est suffisant.\"\nRessentir : calme, motivation légère\nChoisir : commencer maintenant\nPlanifier : bloc de 10 minutes\nAgir : première micro-action",
          aRetenir: ["Les opportunités existent toujours", "Activer une opportunité transforme l'expérience", "Tu choisis quelles opportunités activer"],
          question: "Quelles opportunités pourrais-tu activer dans tes expériences?",
        },
        {
          numero: "1.8",
          titre: "Les principes i+ liés au temps",
          sousTitre: "Des repères concrets",
          fonction: "Créer des repères concrets.",
          contenu: "Voici 3 principes i+ pour la gestion du temps.",
          exemple: "Commencer est plus important que parfait. Commencer un document imparfaitement est plus utile que ne jamais le commencer.\n\nFaire une chose à la fois. Couper les notifications pendant une tâche.\n\nLes petites actions créent de grands résultats. 15 minutes par jour pendant 30 jours créent plus de résultats qu'une seule grosse journée.",
          aRetenir: ["Commencer > parfait", "Une chose à la fois", "Petites actions = grands résultats"],
          transition: "Tu comprends maintenant que ta gestion du temps est composée d'expériences modifiables. Passons à la transformation.",
        },
      ],
    },
    {
      numero: 2,
      titre: "Transformer mes expériences avec les Outils i+",
      description: "Utiliser les outils, modifier les composantes, créer un nouveau schéma",
      sections: [
        {
          numero: "2.1",
          titre: "Voir ce que je vis comme une expérience",
          sousTitre: "Transformer la problématique",
          fonction: "Transformer la problématique en expérience.",
          contenu: "\"Je procrastine\" → \"Quand je commence une tâche importante, je ressens du stress et j'évite.\" Cette reformulation te donne prise sur l'expérience.",
          exemple: "Marc : \"Je procrastine tout le temps.\" → \"Quand je m'assois pour commencer une tâche importante, je ressens du stress et je vais sur YouTube.\"",
          consigne: "Utilise l'Outil Schéma i+ pour écrire une expérience que tu vis régulièrement.",
        },
        {
          numero: "2.2",
          titre: "Utiliser l'Outil Schéma i+",
          sousTitre: "Décortiquer l'expérience",
          fonction: "Présenter le processus complet.",
          contenu: "L'Outil Schéma i+ est le coeur du système. Tu décris une expérience réelle, tu l'associes aux 8 étapes, tu identifies les menaces et tu les transformes en opportunités.",
          exemple: "Marc décrit : \"Je m'assois à mon bureau. Je regarde la tâche. Je pense que ça va être long. Je vais sur mon téléphone.\" Il identifie chaque étape et les menaces correspondantes.",
          consigne: "Ouvre l'Outil Schéma i+ et suis les étapes pour l'expérience que tu as identifiée.",
        },
        {
          numero: "2.3",
          titre: "Toute expérience est activée par un déclencheur",
          sousTitre: "Identifier ce qui active",
          fonction: "Comprendre les déclencheurs.",
          contenu: "Un déclencheur est l'information qui active ton expérience. Il peut être externe (notification, interruption) ou interne (fatigue, pensée de surcharge).",
          exemple: "Déclencheurs externes de Marc : voir une longue liste, recevoir un courriel, une demande imprévue.\nDéclencheurs internes : fatigue, pensées de surcharge, manque de motivation.",
          aRetenir: ["Le déclencheur est le point de départ", "Il peut être externe ou interne", "L'identifier permet de s'y préparer"],
          question: "Quels sont tes déclencheurs les plus fréquents?",
        },
        {
          numero: "2.4",
          titre: "Bilan de mes déclencheurs",
          sousTitre: "Observer les patrons",
          fonction: "Observer les déclencheurs fréquents.",
          contenu: "Fais le bilan de tes déclencheurs. Lesquels reviennent le plus souvent? Lesquels ont le plus d'impact?",
          consigne: "Utilise le Bilan des déclencheurs pour lister tes déclencheurs externes et internes les plus fréquents.",
        },
        {
          numero: "2.5",
          titre: "Cibler un déclencheur",
          sousTitre: "Choisir celui à travailler",
          fonction: "Choisir un déclencheur précis.",
          contenu: "Choisis un déclencheur précis que tu veux transformer. Pas le plus gros, pas le plus difficile. Celui que tu sens prêt à travailler.",
          exemple: "Marc choisit : \"Commencer une tâche importante.\" C'est spécifique, fréquent et impactant.",
          consigne: "Choisis un déclencheur précis que tu vas travailler dans cette Masterclass.",
        },
        {
          numero: "2.6",
          titre: "Écrire l'histoire de mon expérience",
          sousTitre: "Décrire une situation réelle",
          fonction: "Décrire une situation réelle.",
          contenu: "Écris l'histoire de cette expérience comme si tu la racontais à un ami. Sois concret et précis.",
          exemple: "Marc : \"Je commence mon travail. Je regarde le document. Je pense que je ne finirai jamais. Je me sens stressé. Je vais sur YouTube. Une heure passe. Je n'ai rien fait.\"",
          consigne: "Écris l'histoire de ton expérience dans l'Outil Schéma i+.",
        },
        {
          numero: "2.7",
          titre: "Découvrir le schéma de cette expérience",
          sousTitre: "Les 8 étapes en action",
          fonction: "Identifier les composantes.",
          contenu: "Associe chaque étape à ce qui se passe dans ton expérience. Identifie les menaces.",
          exemple: "Observer : \"C'est énorme.\"\nPrédire : \"Je n'ai pas le temps.\"\nRessentir : stress\nChoisir : reporter\nPlanifier : éviter\nAgir : téléphone\nÉvaluer : aucun avancement\nApprendre : \"Je procrastine toujours.\"",
          consigne: "Complète la décortication dans l'Outil Schéma i+ pour ton expérience.",
        },
        {
          numero: "2.8",
          titre: "Activer les opportunités",
          sousTitre: "Transformer les menaces",
          fonction: "Transformer les composantes.",
          contenu: "Pour chaque menace identifiée, choisis une opportunité qui la remplace. Utilise les Outils i+ pour guider la transformation.",
          exemple: "\"C'est énorme\" → Découpage → \"Je peux faire une petite partie.\"\nStress → Respiration → Retour au calme\nReporter → Micro-action engagée → Commencer 5 minutes",
          consigne: "Dans l'Outil Schéma i+, sélectionne les menaces et choisis les opportunités correspondantes.",
        },
        {
          numero: "2.9",
          titre: "Identifier mon nouveau schéma",
          sousTitre: "Le fonctionnement que je veux",
          fonction: "Créer le nouveau fonctionnement.",
          contenu: "Réécris chaque étape en intégrant les opportunités que tu as choisies.",
          exemple: "1. Observer : \"Je peux commencer petit.\"\n2. Prédire : \"5 minutes suffisent.\"\n3. Ressentir : calme\n4. Choisir : commencer\n5. Planifier : bloc de 10 minutes\n6. Agir : première étape\n7. Évaluer : avancement\n8. Apprendre : \"Commencer fonctionne.\"",
          consigne: "Complète ton nouveau schéma dans l'Outil Schéma i+.",
        },
        {
          numero: "2.10",
          titre: "Écrire l'histoire que je vais expérimenter",
          sousTitre: "La nouvelle version",
          fonction: "Créer l'expérience i+.",
          contenu: "Écris la nouvelle histoire que tu vas vivre. Ce sera ton guide quand le déclencheur se présentera.",
          exemple: "Marc : \"Je m'assois à mon bureau. Je respire calmement. Je me rappelle que je peux commencer petit. Je fais une première étape pendant 10 minutes.\"",
          consigne: "Écris ta nouvelle histoire dans la section préparation de l'Outil Schéma i+.",
          transition: "Tu as maintenant un nouveau schéma que tu peux tester dans ta réalité.",
        },
      ],
    },
    {
      numero: 3,
      titre: "Je deviens un i+",
      description: "Expérimenter, partager, ajuster la trajectoire",
      sections: [
        {
          numero: "3.1",
          titre: "J'expérimente les nouveaux schémas",
          sousTitre: "Le changement réel commence",
          fonction: "Tester le nouveau schéma.",
          contenu: "Le changement réel commence maintenant : dans tes expériences quotidiennes. Quand le déclencheur se présente, applique ton nouveau schéma. Observe ce qui se passe.",
          exemple: "Marc commence plus rapidement. Il remarque ses distractions sans se juger. Il ajuste son environnement pour réduire les tentations.",
          aRetenir: ["Le vrai changement se vit dans le quotidien", "Observer sans juger est aussi une compétence", "Chaque petite victoire compte"],
          question: "Quand penses-tu que ton déclencheur se présentera la prochaine fois?",
          consigne: "Prépare-toi mentalement. Relis ta nouvelle histoire avant de vivre l'expérience.",
        },
        {
          numero: "3.2",
          titre: "Je partage dans les Groupes i+",
          sousTitre: "Le pouvoir du collectif",
          fonction: "Utiliser le collectif.",
          contenu: "Partager tes expériences avec d'autres membres renforce ta motivation et t'apporte des perspectives nouvelles. Les Groupes i+ sont là pour ça.",
          exemple: "D'autres participants partagent leurs stratégies pour commencer plus facilement leurs tâches. Marc découvre des techniques qu'il n'avait pas envisagées.",
          aRetenir: ["Partager renforce l'apprentissage", "Les autres ont des stratégies différentes", "L'isolement est l'ennemi du changement"],
          consigne: "Inscris-toi à un Groupe i+ pour partager ton expérience cette semaine.",
        },
        {
          numero: "3.3",
          titre: "J'active ma trajectoire i+",
          sousTitre: "Au-delà d'un déclencheur",
          fonction: "Appliquer le processus à plusieurs déclencheurs.",
          contenu: "Le processus que tu as appris fonctionne pour n'importe quel déclencheur. Applique-le à d'autres situations liées au temps, puis à d'autres thématiques.",
          exemple: "Marc applique le processus à : gérer les imprévus, répondre aux messages, organiser sa journée. Chaque fois, il identifie le déclencheur, décortique le schéma, transforme les menaces et expérimente.",
          aRetenir: ["Le processus est reproductible", "Chaque thématique suit la même logique", "Ta trajectoire s'améliore une expérience à la fois"],
          question: "Quel autre déclencheur lié au temps veux-tu travailler?",
        },
        {
          numero: "3.4",
          titre: "Je deviens un i+",
          sousTitre: "Transférer vers d'autres thématiques",
          fonction: "Transférer vers d'autres thématiques.",
          contenu: "Après la gestion du temps, tu peux appliquer la Méthode i+ à d'autres thématiques : communication, énergie, confiance en soi, anxiété. Le processus est le même. Tu deviens un expérimentateur de tes propres expériences.",
          exemple: "Marc utilise le même processus pour améliorer sa communication avec ses collègues. Il identifie le déclencheur (une réunion tendue), décortique le schéma, transforme les menaces et expérimente.",
          aRetenir: ["La méthode s'applique à toutes les thématiques", "Tu développes une compétence transférable", "Un i+ transforme ses expériences au quotidien"],
          consigne: "Choisis une autre thématique que tu veux explorer et commence une nouvelle Masterclass.",
        },
        {
          numero: "3.5",
          titre: "Conclusion",
          sousTitre: "Tu es devenu un i+",
          fonction: "Valoriser l'évolution.",
          contenu: "Tu n'es plus seulement en train d'essayer de mieux gérer ton temps. Tu développes maintenant une capacité d'adaptation que tu peux utiliser dans toute ta vie. Chaque expérience est une opportunité d'apprendre. Chaque déclencheur est une chance de transformer. Bienvenue parmi les i+.",
          aRetenir: ["Tu comprends tes expériences", "Tu sais transformer les menaces en opportunités", "Tu ajustes ta trajectoire une expérience à la fois"],
        },
      ],
    },
  ],
};
