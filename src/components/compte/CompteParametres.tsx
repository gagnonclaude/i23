"use client";

import { useTranslations } from "next-intl";
import { ConsentementForm } from "@/components/auth/ConsentementForm";
import { useConsentement } from "@/hooks/useConsentement";

export function CompteParametres() {
  const t = useTranslations("consentement");
  const { consentement, loading } = useConsentement();

  if (loading) {
    return (
      <div className="animate-pulse space-y-4">
        <div className="h-6 bg-i23-gris-pale rounded w-1/3" />
        <div className="h-24 bg-i23-gris-pale rounded" />
        <div className="h-24 bg-i23-gris-pale rounded" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-i23-gris-fonce">{t("title")}</h1>
        <p className="text-sm text-i23-gris-fonce/70 mt-1">{t("description")}</p>
      </div>
      <ConsentementForm
        mode="parametres"
        valeurInitiale={{
          mode_sauvegarde: consentement.mode_sauvegarde,
          partage_coach: consentement.partage_coach,
        }}
      />
    </div>
  );
}
