"use client";

import { useState, useEffect } from "react";

export type ModeSauvegarde = "enregistre" | "session";
export type PartageCoach = "aucun" | "progression" | "progression_schemas" | "tout";

export interface Consentement {
  mode_sauvegarde: ModeSauvegarde;
  partage_coach: PartageCoach;
  consentement_donne_at: string | null;
}

const DEFAULT: Consentement = {
  mode_sauvegarde: "enregistre",
  partage_coach: "aucun",
  consentement_donne_at: null,
};

export function useConsentement() {
  const [consentement, setConsentement] = useState<Consentement>(DEFAULT);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/consentement")
      .then((r) => r.json())
      .then((data) => {
        setConsentement({ ...DEFAULT, ...data });
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const sauvegarder = async (updates: Partial<Consentement>) => {
    const nouveau = { ...consentement, ...updates };
    setConsentement(nouveau);
    await fetch("/api/consentement", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        mode_sauvegarde: nouveau.mode_sauvegarde,
        partage_coach: nouveau.partage_coach,
      }),
    });
  };

  return { consentement, loading, sauvegarder };
}
