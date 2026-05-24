/**
 * Listes prédéfinies de composantes (menaces et opportunités) par étape de la Méthode i+.
 * L'IA suggère ces composantes depuis l'histoire écrite + ces listes.
 * Le membre accepte, modifie ou écrit sa propre composante.
 */

export interface ComposantesSuggestions {
  menaces: string[];
  opportunites: string[];
}

/**
 * Composantes génériques par étape (valables pour toutes les thématiques)
 */
export const composantesParEtape: Record<number, ComposantesSuggestions> = {
  1: { // Observer
    menaces: [
      "Observer principalement ce qui ne va pas",
      "Porter attention uniquement aux problèmes",
      "Ignorer les ressources disponibles",
      "Se concentrer sur les obstacles",
      "Observer les attentes des autres avant ses propres besoins",
      "Ignorer les signaux de son corps",
      "Porter attention uniquement à ce qui doit être fait",
      "Observer son environnement comme menaçant",
    ],
    opportunites: [
      "Observer la situation dans son ensemble",
      "Reconnaître les ressources disponibles",
      "Porter attention aux signaux de son corps",
      "Observer les moments positifs aussi",
      "Identifier ce qui est réellement en jeu",
      "Observer ses besoins réels",
      "Porter attention aux solutions possibles",
      "Reconnaître ses forces dans la situation",
    ],
  },
  2: { // Prédire
    menaces: [
      "Penser qu'il faut toujours continuer",
      "Croire que ralentir est une faiblesse",
      "Imaginer que ça va mal tourner",
      "Penser qu'on doit tout gérer seul",
      "Croire qu'on n'a pas le droit d'avoir des limites",
      "Prévoir uniquement des conséquences négatives",
      "Imaginer décevoir les autres",
      "Croire qu'on ne peut pas changer",
    ],
    opportunites: [
      "Penser que les ajustements sont possibles",
      "Croire qu'il est normal d'avoir des limites",
      "Imaginer des solutions réalistes",
      "Penser qu'on peut demander de l'aide",
      "Croire que la situation peut s'améliorer",
      "Prévoir des stratégies équilibrées",
      "Imaginer retrouver de l'énergie progressivement",
      "Croire qu'on mérite de prendre soin de soi",
    ],
  },
  3: { // Ressentir
    menaces: [
      "Ressentir de l'épuisement",
      "Ressentir du stress constant",
      "Ressentir de la culpabilité",
      "Ressentir de l'impuissance",
      "Ressentir de la frustration",
      "Ressentir de la pression intérieure",
      "Ressentir de l'irritabilité",
      "Ressentir de la surcharge émotionnelle",
    ],
    opportunites: [
      "Ressentir du calme après une pause",
      "Ressentir du soulagement en ralentissant",
      "Ressentir de la légèreté émotionnelle",
      "Ressentir de la sérénité",
      "Ressentir de la motivation retrouvée",
      "Ressentir de la sécurité intérieure",
      "Ressentir de l'espoir",
      "Ressentir de la stabilité",
    ],
  },
  4: { // Choisir
    menaces: [
      "Choisir de continuer malgré les signaux",
      "Choisir d'ignorer ses besoins",
      "Choisir de prioriser uniquement les obligations",
      "Choisir de ne pas demander d'aide",
      "Choisir d'éviter la situation",
      "Choisir de faire plaisir aux autres avant soi",
      "Choisir de maintenir des habitudes épuisantes",
      "Choisir de ne pas écouter ses émotions",
    ],
    opportunites: [
      "Choisir de respecter ses limites",
      "Choisir de ralentir lorsque nécessaire",
      "Choisir de prioriser sa récupération",
      "Choisir de demander du soutien",
      "Choisir un rythme plus réaliste",
      "Choisir d'écouter son corps",
      "Choisir de faire des pauses régulières",
      "Choisir de se prioriser davantage",
    ],
  },
  5: { // Planifier
    menaces: [
      "Planifier trop d'activités",
      "Prévoir des horaires irréalistes",
      "Organiser ses journées sans pauses",
      "Prévoir uniquement les obligations",
      "Ne pas prévoir de récupération",
      "Planifier selon les attentes des autres",
      "Organiser des journées surchargées",
      "Ne pas prévoir de soutien",
    ],
    opportunites: [
      "Planifier des pauses régulières",
      "Prévoir du temps de récupération",
      "Organiser un horaire plus équilibré",
      "Planifier selon son niveau d'énergie",
      "Prévoir des moments de calme",
      "Organiser ses priorités essentielles",
      "Prévoir des limites réalistes",
      "Planifier des activités ressourçantes",
    ],
  },
  6: { // Agir
    menaces: [
      "Continuer malgré les signaux d'épuisement",
      "Négliger les pauses",
      "Maintenir un rythme trop rapide",
      "Rester disponible constamment",
      "Accumuler les obligations sans ajustement",
      "Éviter les activités de récupération",
      "Fonctionner en mode automatique",
      "Ignorer ses besoins physiques",
    ],
    opportunites: [
      "Faire des pauses régulièrement",
      "Respecter ses limites physiques",
      "Réduire les activités énergivores",
      "Prendre du temps pour récupérer",
      "Répartir son énergie dans la journée",
      "Demander de l'aide lorsque nécessaire",
      "Maintenir un rythme plus stable",
      "Écouter les signaux de son corps",
    ],
  },
  7: { // Évaluer
    menaces: [
      "Observer uniquement ce qui ne va pas",
      "Évaluer sa valeur selon sa productivité",
      "Se critiquer lorsqu'on ralentit",
      "Minimiser les améliorations",
      "Observer les pauses comme une perte de temps",
      "Ignorer les effets positifs des ajustements",
      "Se comparer aux autres",
      "Évaluer ses journées comme insuffisantes",
    ],
    opportunites: [
      "Observer les effets positifs des changements",
      "Évaluer son niveau d'énergie réel",
      "Reconnaître les stratégies qui aident",
      "Observer les moments de mieux-être",
      "Évaluer l'équilibre entre activité et récupération",
      "Reconnaître ses limites avec respect",
      "Observer les améliorations progressives",
      "Évaluer objectivement ses résultats",
    ],
  },
  8: { // Apprendre
    menaces: [
      "Intégrer la surcharge comme normale",
      "Renforcer les habitudes épuisantes",
      "Apprendre à ignorer ses limites",
      "Intégrer un rythme irréaliste",
      "Renforcer le mode survie",
      "Apprendre à ne pas écouter son corps",
      "Intégrer le stress comme mode de fonctionnement",
      "Apprendre que ses besoins ne comptent pas",
    ],
    opportunites: [
      "Apprendre à respecter ses limites",
      "Intégrer des habitudes de récupération",
      "Développer un meilleur équilibre",
      "Apprendre à écouter son corps",
      "Intégrer l'importance du repos",
      "Développer des stratégies anti-surcharge",
      "Apprendre à ralentir sans culpabilité",
      "Intégrer un rythme plus réaliste",
    ],
  },
};

/**
 * Composantes enrichies par thématique (s'ajoutent aux génériques)
 */
export const composantesParThematiqueEtEtape: Record<string, Partial<Record<number, ComposantesSuggestions>>> = {
  energie: {
    1: {
      menaces: [
        "Observer principalement sa fatigue",
        "Porter attention uniquement au manque d'énergie",
        "Observer constamment les tâches restantes",
        "Ignorer les moments où l'énergie est meilleure",
      ],
      opportunites: [
        "Observer son niveau d'énergie réel",
        "Reconnaître les signes de fatigue",
        "Observer les moments où l'énergie est meilleure",
        "Identifier les activités énergivores",
        "Observer les activités ressourçantes",
      ],
    },
    2: {
      menaces: [
        "Croire que ralentir fera perdre le contrôle",
        "Penser qu'on doit être productif constamment",
        "Imaginer perdre des opportunités en se reposant",
        "Croire que récupérer fait perdre du temps",
      ],
      opportunites: [
        "Penser que le repos aide la récupération",
        "Croire qu'il est possible de ralentir sans échouer",
        "Imaginer une meilleure stabilité énergétique",
        "Croire qu'on peut protéger son énergie",
      ],
    },
  },
};

export function getComposantesSuggestions(etape: number, thematique?: string): ComposantesSuggestions {
  const base = composantesParEtape[etape] ?? { menaces: [], opportunites: [] };

  if (!thematique) return base;

  const enrichies = composantesParThematiqueEtEtape[thematique]?.[etape];
  if (!enrichies) return base;

  return {
    menaces: [...(enrichies.menaces ?? []), ...base.menaces],
    opportunites: [...(enrichies.opportunites ?? []), ...base.opportunites],
  };
}
