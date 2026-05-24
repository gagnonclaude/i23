/**
 * Listes prédéfinies de déclencheurs par thématique et par niveau.
 * L'IA suggère ces déclencheurs, le membre choisit, modifie ou écrit le sien.
 */

export type NiveauDeclencheur = "i" | "2" | "3";

export interface DeclencheurSuggestion {
  niveau: NiveauDeclencheur;
  texte: string;
}

export const declencheursParThematique: Record<string, DeclencheurSuggestion[]> = {
  energie: [
    // Niveau i — Individuel
    { niveau: "i", texte: "Se réveiller déjà fatigué" },
    { niveau: "i", texte: "Dormir trop peu pendant plusieurs jours" },
    { niveau: "i", texte: "Ressentir une baisse importante d'énergie en après-midi" },
    { niveau: "i", texte: "Avoir de la difficulté à se concentrer" },
    { niveau: "i", texte: "Manquer de motivation pour commencer une tâche" },
    { niveau: "i", texte: "Se sentir dépassé mentalement" },
    { niveau: "i", texte: "Avoir des douleurs physiques ou des tensions" },
    { niveau: "i", texte: "Avoir une surcharge mentale" },
    { niveau: "i", texte: "Faire trop d'activités sans pause" },
    { niveau: "i", texte: "Avoir l'impression de fonctionner sur le pilote automatique" },
    { niveau: "i", texte: "Se sentir épuisé après une petite tâche" },
    { niveau: "i", texte: "Avoir des pensées constantes qui empêchent le repos" },
    { niveau: "i", texte: "Se sentir coupable de ralentir" },
    { niveau: "i", texte: "Négliger ses besoins physiques" },
    { niveau: "i", texte: "Manquer de sommeil réparateur" },
    { niveau: "i", texte: "Sentir une perte d'intérêt générale" },
    { niveau: "i", texte: "Ne pas réussir à récupérer malgré le repos" },
    { niveau: "i", texte: "Se sentir vidé émotionnellement" },
    { niveau: "i", texte: "Vouloir tout faire en même temps" },
    // Niveau 2 — Relationnel
    { niveau: "2", texte: "Recevoir trop de demandes des autres" },
    { niveau: "2", texte: "Avoir de la difficulté à dire non" },
    { niveau: "2", texte: "Être sollicité constamment" },
    { niveau: "2", texte: "Vivre des conflits relationnels" },
    { niveau: "2", texte: "Se sentir responsable des émotions des autres" },
    { niveau: "2", texte: "Être entouré de personnes négatives" },
    { niveau: "2", texte: "Recevoir des attentes élevées" },
    { niveau: "2", texte: "Avoir l'impression de devoir performer socialement" },
    { niveau: "2", texte: "Être interrompu constamment" },
    { niveau: "2", texte: "Avoir une charge familiale importante" },
    { niveau: "2", texte: "Être dans une relation énergivore" },
    { niveau: "2", texte: "Recevoir des critiques fréquentes" },
    { niveau: "2", texte: "Se sentir obligé d'aider tout le monde" },
    { niveau: "2", texte: "Ne pas se sentir compris" },
    { niveau: "2", texte: "Vivre des tensions dans le couple" },
    // Niveau 3 — Environnemental
    { niveau: "3", texte: "Avoir un horaire surchargé" },
    { niveau: "3", texte: "Travailler dans un environnement stressant" },
    { niveau: "3", texte: "Être exposé constamment au bruit" },
    { niveau: "3", texte: "Manquer de temps pour récupérer" },
    { niveau: "3", texte: "Vivre dans un environnement désorganisé" },
    { niveau: "3", texte: "Avoir trop de responsabilités" },
    { niveau: "3", texte: "Être exposé à trop de stimulation numérique" },
    { niveau: "3", texte: "Avoir une pression de performance constante" },
    { niveau: "3", texte: "Manquer d'accès à des moments de calme" },
    { niveau: "3", texte: "Avoir des déplacements épuisants" },
    { niveau: "3", texte: "Être dans un milieu de travail instable" },
    { niveau: "3", texte: "Recevoir trop d'informations en même temps" },
    { niveau: "3", texte: "Ne pas avoir d'espace personnel" },
    { niveau: "3", texte: "Avoir peu d'équilibre entre travail et repos" },
    { niveau: "3", texte: "Se sentir toujours en mode survie" },
  ],
};

export function getDeclencheursParThematique(thematique: string, niveau?: NiveauDeclencheur): DeclencheurSuggestion[] {
  const liste = declencheursParThematique[thematique] ?? [];
  if (niveau) return liste.filter((d) => d.niveau === niveau);
  return liste;
}
