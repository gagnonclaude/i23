"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { parcoursConfig, badgesConfig, type EtapeParcours } from "@/lib/config";
import type { ParcoursState } from "@/lib/parcours";

export function ParcoursVisuel({ state }: { state: ParcoursState }) {
  const t = useTranslations("parcours");

  const etapeIdx = parcoursConfig.etapes.findIndex((e) => e.id === state.etapeActuelle);

  return (
    <div className="space-y-3">
      {parcoursConfig.etapes.map((etape, idx) => {
        const isCurrent = idx === etapeIdx;
        const isDone = idx < etapeIdx;
        const isLocked = idx > etapeIdx;

        return (
          <div key={etape.id} className={`flex items-center gap-3 ${isLocked ? "opacity-40" : ""}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold shrink-0 ${
              isDone ? "bg-i23-turquoise text-white"
              : isCurrent ? "bg-i23-jaune text-i23-gris-fonce"
              : "bg-i23-gris-pale text-i23-gris-fonce/50"
            }`}>
              {isDone ? "✓" : idx + 1}
            </div>
            <div className="flex-1">
              <p className={`font-medium ${isCurrent ? "text-i23-gris-fonce" : "text-i23-gris-fonce/70"}`}>
                {etape.nom}
              </p>
              {!isLocked && (
                <p className="text-xs text-i23-gris-fonce/50">{etape.description}</p>
              )}
            </div>
            {isCurrent && (
              <Link href={etape.chemin as Parameters<typeof Link>[0]["href"]}>
                <Button size="sm">{t("continuer")}</Button>
              </Link>
            )}
            {isDone && (
              <span className="text-xs text-i23-turquoise font-medium">{t("complete")}</span>
            )}
          </div>
        );
      })}
    </div>
  );
}
