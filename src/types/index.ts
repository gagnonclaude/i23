export interface Utilisateur {
  id: string;
  email: string;
  nom: string;
  avatar_url?: string;
  thematique_active?: string;
  niveau_accompagnement_ia: "discret" | "accompagnement" | "coach_intensif";
  consentement_memoire_ia: boolean;
  consentement_partage_coach: boolean;
  date_inscription: string;
  abonnement_actif: boolean;
  role: "membre" | "coach" | "mandataire" | "admin" | "gestionnaire";
}

export interface Thematique {
  id: string;
  nom: string;
  description: string;
  image_url?: string;
  masterclass_id?: string;
  active: boolean;
}

export interface Declencheur {
  id: string;
  thematique_id: string;
  nom: string;
  description: string;
  type: "externe" | "interne";
  etapes_dominantes: number[];
}

export interface SchemaExperience {
  id: string;
  utilisateur_id: string;
  thematique_id: string;
  declencheur_id: string;
  histoire: string;
  nouvelle_histoire?: string;
  etapes: EtapeSchema[];
  statut: "brouillon" | "en_modification" | "experimentation" | "complete";
  date_creation: string;
  date_modification: string;
}

export interface EtapeSchema {
  etape_numero: number;
  composante: string;
  pole: "menace" | "opportunité" | "neutre";
  niveau: "i" | "2" | "3";
  outil_utilise_id?: string;
}

export interface OutiliPlus {
  id: string;
  nom: string;
  etape_numero: number;
  fonction: string;
  menace_cible: string;
  opportunite_visee: string;
  questions: QuestionOutil[];
  thematiques_compatibles: string[];
}

export interface QuestionOutil {
  id: string;
  texte: string;
  type: "texte" | "choix" | "echelle" | "texte_long";
  options?: string[];
}

export interface ReponseOutil {
  id: string;
  utilisateur_id: string;
  outil_id: string;
  schema_id: string;
  reponses: Record<string, string>;
  menace_identifiee: string;
  opportunite_trouvee: string;
  date: string;
}

export interface BilanExperience {
  id: string;
  utilisateur_id: string;
  schema_id: string;
  histoire_preparee: string;
  observation: string;
  ajustements: string;
  prochaine_histoire: string;
  resultat_positif: boolean;
  date: string;
}

export interface Masterclass {
  id: string;
  thematique_id: string;
  titre: string;
  description: string;
  parties: PartieMasterclass[];
  progression_utilisateur?: number;
}

export interface PartieMasterclass {
  id: string;
  titre: string;
  type: "introduction" | "theorie" | "transformation" | "activation";
  sections: SectionMasterclass[];
}

export interface SectionMasterclass {
  id: string;
  titre: string;
  contenu: string;
  type_contenu: "texte" | "video" | "audio" | "quiz" | "exercice";
  ordre: number;
}

export interface GroupeiPlus {
  id: string;
  thematique_id: string;
  nom: string;
  description: string;
  date_rencontre: string;
  duree_minutes: number;
  lien_zoom: string;
  inscrits: string[];
}

export interface Trajectoire {
  id: string;
  utilisateur_id: string;
  thematique_id: string;
  schemas: SchemaExperience[];
  bilans: BilanExperience[];
  evolution: "amelioration" | "stable" | "diminution";
}
