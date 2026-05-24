export const outilsEtape1 = [
  { slug: "scan-observation", numero: 1 },
  { slug: "scan-focus", numero: 2 },
  { slug: "validation-perceptions", numero: 3 },
  { slug: "reequilibrage-attention", numero: 4 },
  { slug: "detection-informations", numero: 5 },
  { slug: "observation-ressources", numero: 6 },
  { slug: "observation-contraintes", numero: 7 },
  { slug: "cartographie-situation", numero: 8 },
  { slug: "clarification-faits", numero: 9 },
  { slug: "faits-vs-interpretations", numero: 10 },
];

export const outilsEtape2 = [
  { slug: "test-realite", numero: 1 },
  { slug: "reecriture-scenario", numero: 2 },
  { slug: "verification-croyances", numero: 3 },
  { slug: "analyse-scenarios", numero: 4 },
  { slug: "detection-catastrophisations", numero: 5 },
  { slug: "reorientation-attention", numero: 6 },
  { slug: "construction-scenario-opportunite", numero: 7 },
  { slug: "analyse-predictions", numero: 8 },
  { slug: "validation-probabilites", numero: 9 },
  { slug: "recherche-alternatives", numero: 10 },
];

export const outilsEtape3 = [
  { slug: "respiration-guidee", numero: 1 },
  { slug: "relaxation-progressive", numero: 2 },
  { slug: "verbalisation-interieure", numero: 3 },
  { slug: "diminution-charge-emotive", numero: 4 },
  { slug: "thermometre-emotionnel", numero: 5 },
  { slug: "pause-emotionnelle", numero: 6 },
  { slug: "decharge-emotive", numero: 7 },
  { slug: "regulation-stress", numero: 8 },
  { slug: "ancrage-emotionnel", numero: 9 },
  { slug: "retour-calme", numero: 10 },
];

export const outilsEtape4 = [
  { slug: "priorite-besoins", numero: 1 },
  { slug: "clarification-decision", numero: 2 },
  { slug: "analyse-options", numero: 3 },
  { slug: "choix-aligne", numero: 4 },
  { slug: "equilibre-besoins", numero: 5 },
  { slug: "decision-progressive", numero: 6 },
  { slug: "respect-limites", numero: 7 },
  { slug: "alignement-valeurs", numero: 8 },
  { slug: "analyse-impacts", numero: 9 },
  { slug: "validation-decision", numero: 10 },
];

export const outilsEtape5 = [
  { slug: "planification-simple", numero: 1 },
  { slug: "plan-adaptation", numero: 2 },
  { slug: "decoupage-taches", numero: 3 },
  { slug: "horaire-adapte", numero: 4 },
  { slug: "planification-pauses", numero: 5 },
  { slug: "preparation-ressources", numero: 6 },
  { slug: "prevision-obstacles", numero: 7 },
  { slug: "planification-flexible", numero: 8 },
  { slug: "gestion-priorites", numero: 9 },
  { slug: "calendrier-experimentation", numero: 10 },
];

export const outilsEtape6 = [
  { slug: "micro-action", numero: 1 },
  { slug: "routine-action", numero: 2 },
  { slug: "depart-progressif", numero: 3 },
  { slug: "premiere-etape-concrete", numero: 4 },
  { slug: "activation-comportementale", numero: 5 },
  { slug: "engagement-quotidien", numero: 6 },
  { slug: "reduction-evitement", numero: 7 },
  { slug: "mise-action-graduelle", numero: 8 },
  { slug: "habitude-i", numero: 9 },
  { slug: "tableau-actions", numero: 10 },
];

export const outilsEtape7 = [
  { slug: "suivi-resultats", numero: 1 },
  { slug: "comparaison-objectif-resultat", numero: 2 },
  { slug: "analyse-strategies", numero: 3 },
  { slug: "journal-experimentation", numero: 4 },
  { slug: "observation-progres", numero: 5 },
  { slug: "mesure-ajustements", numero: 6 },
  { slug: "validation-resultats", numero: 7 },
  { slug: "evaluation-trajectoire", numero: 8 },
  { slug: "identification-reussites", numero: 9 },
  { slug: "ajustement-actions", numero: 10 },
];

export const outilsEtape8 = [
  { slug: "integration-apprentissages", numero: 1 },
  { slug: "ajustement-schema", numero: 2 },
  { slug: "bilan-experiences", numero: 3 },
  { slug: "lecons-apprises", numero: 4 },
  { slug: "synthese-strategies", numero: 5 },
  { slug: "consolidation-opportunites", numero: 6 },
  { slug: "preparation-declencheur", numero: 7 },
  { slug: "evolution-trajectoire", numero: 8 },
  { slug: "renforcement-acquis", numero: 9 },
  { slug: "transfert-thematiques", numero: 10 },
];

export const outilsParEtape: Record<number, { slug: string; numero: number }[]> = {
  1: outilsEtape1,
  2: outilsEtape2,
  3: outilsEtape3,
  4: outilsEtape4,
  5: outilsEtape5,
  6: outilsEtape6,
  7: outilsEtape7,
  8: outilsEtape8,
};
