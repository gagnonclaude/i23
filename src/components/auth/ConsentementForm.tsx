"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/routing";
import { Button } from "@/components/ui/Button";
import type { ModeSauvegarde, PartageCoach } from "@/hooks/useConsentement";

interface ConsentementFormProps {
  /** Mode paramètres = pas de redirect, affiche confirmation inline */
  mode?: "signup" | "parametres";
  valeurInitiale?: {
    mode_sauvegarde: ModeSauvegarde;
    partage_coach: PartageCoach;
  };
}

export function ConsentementForm({ mode = "signup", valeurInitiale }: ConsentementFormProps) {
  const t = useTranslations("consentement");
  const router = useRouter();
  const [modeSauvegarde, setModeSauvegarde] = useState<ModeSauvegarde>(valeurInitiale?.mode_sauvegarde ?? "enregistre");
  const [partageCoach, setPartageCoach] = useState<PartageCoach>(valeurInitiale?.partage_coach ?? "aucun");
  const [loading, setLoading] = useState(false);
  const [sauvegarde, setSauvegarde] = useState(false);

  const handleSubmit = async () => {
    setLoading(true);
    await fetch("/api/consentement", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ mode_sauvegarde: modeSauvegarde, partage_coach: partageCoach }),
    });
    setLoading(false);

    if (mode === "signup") {
      router.push("/initialisation");
    } else {
      setSauvegarde(true);
      setTimeout(() => setSauvegarde(false), 3000);
    }
  };

  return (
    <div className="space-y-8">
      {mode === "signup" && (
        <div className="text-center">
          <img src="/logo.png" alt="i23" className="h-10 mx-auto mb-6" />
          <h1 className="text-2xl font-bold text-i23-gris-fonce mb-2">{t("title")}</h1>
          <p className="text-sm text-i23-gris-fonce/70 leading-relaxed">{t("description")}</p>
        </div>
      )}

      {/* Mode sauvegarde */}
      <div className="space-y-3">
        <p className="text-sm font-semibold text-i23-gris-fonce">{t("modeSauvegarde.label")}</p>
        <div className="space-y-2">
          {(["enregistre", "session"] as ModeSauvegarde[]).map((m) => (
            <button
              key={m}
              onClick={() => setModeSauvegarde(m)}
              className={`w-full text-left p-4 rounded-xl border-2 transition-all ${
                modeSauvegarde === m
                  ? "border-i23-turquoise bg-i23-turquoise/5"
                  : "border-i23-gris-pale hover:border-i23-turquoise/50"
              }`}
            >
              <p className="font-medium text-i23-gris-fonce text-sm">{t(`modeSauvegarde.${m}`)}</p>
              <p className="text-xs text-i23-gris-fonce/60 mt-1">{t(`modeSauvegarde.${m}Desc`)}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Partage coach */}
      <div className="space-y-3">
        <p className="text-sm font-semibold text-i23-gris-fonce">{t("partageCoach.label")}</p>
        <div className="space-y-2">
          {(["aucun", "progression", "progression_schemas", "tout"] as PartageCoach[]).map((p) => (
            <button
              key={p}
              onClick={() => setPartageCoach(p)}
              className={`w-full text-left p-4 rounded-xl border-2 transition-all ${
                partageCoach === p
                  ? "border-i23-jaune bg-i23-jaune/5"
                  : "border-i23-gris-pale hover:border-i23-jaune/50"
              }`}
            >
              <p className="font-medium text-i23-gris-fonce text-sm">{t(`partageCoach.${p}`)}</p>
              <p className="text-xs text-i23-gris-fonce/60 mt-1">{t(`partageCoach.${p}Desc`)}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Loi 25 */}
      <p className="text-xs text-i23-gris-fonce/50 leading-relaxed border-t border-i23-gris-pale pt-4">
        {t("loi25")}
      </p>

      <Button
        onClick={handleSubmit}
        loading={loading}
        className="w-full"
      >
        {sauvegarde ? t("sauvegarde") : mode === "signup" ? t("confirmer") : t("modifier")}
      </Button>
    </div>
  );
}
