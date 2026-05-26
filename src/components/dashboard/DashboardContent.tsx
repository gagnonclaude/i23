"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { ParcoursVisuel } from "@/components/parcours/ParcoursVisuel";
import { BadgesDisplay } from "@/components/parcours/BadgesDisplay";
import type { User } from "@supabase/supabase-js";
import type { ParcoursState } from "@/lib/parcours";

interface BilanData {
  scores_dimensions: Record<string, number>;
  completed_at: string;
}

type Badge = { badge_type: string; thematique: string | null; created_at: string; nom: string; icone: string; condition: string };

export function DashboardContent({ user, bilan, parcours, badges }: { user: User; bilan: BilanData | null; parcours: ParcoursState; badges: Badge[]; }) {
  const t = useTranslations("dashboard");
  const tp = useTranslations("parcours");

  const scores = bilan?.scores_dimensions || {};
  const bilanDone = !!bilan?.completed_at;

  const dimensions: { key: string; label: string; color: string }[] = [
    { key: "energie", label: t("energie"), color: "bg-i23-turquoise" },
    { key: "anxiete", label: t("anxiete"), color: "bg-i23-jaune" },
    { key: "temps", label: t("temps"), color: "bg-i23-turquoise" },
    { key: "emotions", label: t("emotions"), color: "bg-i23-jaune" },
    { key: "motivation", label: t("motivation"), color: "bg-i23-turquoise" },
    { key: "communication", label: t("communication"), color: "bg-i23-jaune" },
    { key: "confiance", label: t("confiance"), color: "bg-i23-turquoise" },
    { key: "relations", label: t("relations"), color: "bg-i23-jaune" },
  ];

  return (
    <div className="py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-10">
          <div>
            <h1 className="text-2xl font-bold text-i23-gris-fonce">{t("title")}</h1>
            <p className="text-sm text-i23-gris-fonce/70 mt-1">{user.email}</p>
          </div>
          <form action="/auth/logout" method="POST">
            <Button variant="ghost" size="sm">{t("logout")}</Button>
          </form>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-10">
          <div className="lg:col-span-2">
            <Card padding="lg">
              <h2 className="text-lg font-semibold text-i23-gris-fonce mb-4">{tp("monParcours")}</h2>
              <ParcoursVisuel state={parcours} />
            </Card>
          </div>
          <div>
            <Card padding="lg">
              <h2 className="text-lg font-semibold text-i23-gris-fonce mb-4">{tp("mesBadges")}</h2>
              <BadgesDisplay badges={badges} />
            </Card>
          </div>
        </div>

        {!bilanDone && (
          <Card className="mb-8 border-i23-turquoise bg-i23-turquoise/5">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-i23-gris-fonce mb-1">{t("bilanTitle")}</h3>
                <p className="text-sm text-i23-gris-fonce/70">{t("bilanDesc")}</p>
              </div>
              <Link href="/bilan-depart">
                <Button>{t("bilanCta")}</Button>
              </Link>
            </div>
          </Card>
        )}

        {bilanDone && (
          <div className="mb-10">
            <h2 className="text-lg font-semibold text-i23-gris-fonce mb-4">{t("scoresTitle")}</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {dimensions.map(({ key, label, color }) => {
                const val = scores[key] || 0;
                const pct = Math.min(val * 20, 100);
                return (
                  <Card key={key} padding="sm">
                    <p className="text-xs font-medium text-i23-gris-fonce/70 mb-2">{label}</p>
                    <div className="h-2 bg-i23-gris-pale rounded-full overflow-hidden">
                      <div className={`h-full rounded-full ${color}`} style={{ width: `${pct}%` }} />
                    </div>
                    <p className="text-xs text-i23-gris-fonce/50 mt-1">{val.toFixed(1)}/5</p>
                  </Card>
                );
              })}
            </div>
          </div>
        )}

        <h2 className="text-lg font-semibold text-i23-gris-fonce mb-4">{t("modulesTitle")}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {([
            { key: "schema", href: "/schema", icon: "🧩" },
            { key: "outils", href: "/outils", icon: "🛠" },
            { key: "masterclass", href: "/masterclass", icon: "🎓" },
            { key: "bilan", href: "/bilan-depart", icon: "📋" },
            { key: "groupes", href: "/groupes", icon: "👥" },
            { key: "ia", href: "/ia", icon: "🤖" },
            { key: "securite", href: "/securite", icon: "🔒" },
          ] as const).map(({ key, href, icon }) => (
            <Link key={key} href={href}>
              <Card hover padding="md">
                <span className="text-2xl block mb-2">{icon}</span>
                <h3 className="font-semibold text-i23-gris-fonce mb-1">{t(`modules.${key}.title`)}</h3>
                <p className="text-xs text-i23-gris-fonce/70">{t(`modules.${key}.description`)}</p>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
