"use client";

import { useTranslations } from "next-intl";
import { Card } from "@/components/ui/Card";
import { badgesConfig } from "@/lib/config";

type Badge = { badge_type: string; thematique: string | null; created_at: string; nom: string; icone: string; condition: string };

export function BadgesDisplay({ badges }: { badges: Badge[] }) {
  const t = useTranslations("parcours");

  const earnedTypes = new Set(badges.map((b) => b.badge_type + (b.thematique || "")));

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {badgesConfig.map((config) => {
        const earned = badges.find((b) => b.badge_type === config.type);
        return (
          <Card key={config.type} padding="md" className={!earned ? "opacity-40" : ""}>
            <div className="text-center">
              <span className="text-3xl block mb-2">{earned ? config.icone : "🔒"}</span>
              <h3 className="font-semibold text-i23-gris-fonce mb-1">{config.nom}</h3>
              <p className="text-xs text-i23-gris-fonce/70">{config.condition}</p>
              {earned && (
                <p className="text-xs text-i23-turquoise mt-2">{t("badgeObtenu")}</p>
              )}
            </div>
          </Card>
        );
      })}
      {badges.filter((b) => b.badge_type === "thematique").map((b) => (
        <Card key={b.thematique} padding="md">
          <div className="text-center">
            <span className="text-3xl block mb-2">🏅</span>
            <h3 className="font-semibold text-i23-gris-fonce mb-1">{b.thematique}</h3>
            <p className="text-xs text-i23-turquoise">{t("badgeObtenu")}</p>
          </div>
        </Card>
      ))}
    </div>
  );
}
