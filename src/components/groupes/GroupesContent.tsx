"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { Card } from "@/components/ui/Card";

const etapesGroupe = [
  { key: "accueil", icon: "1" },
  { key: "retour", icon: "2" },
  { key: "theorie", icon: "3" },
  { key: "outil", icon: "4" },
  { key: "discussion", icon: "5" },
  { key: "action", icon: "6" },
  { key: "conclusion", icon: "7" },
];

export function GroupesContent() {
  const t = useTranslations("groupes");

  return (
    <div className="py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <p className="text-i23-turquoise font-semibold text-sm tracking-wide uppercase mb-2">
            {t("badge")}
          </p>
          <h1 className="text-3xl md:text-4xl font-bold text-i23-gris-fonce mb-4">
            {t("title")}
          </h1>
          <p className="text-i23-gris-fonce/70 max-w-2xl mx-auto">
            {t("description")}
          </p>
        </div>

        <div className="mb-16">
          <h2 className="text-2xl font-bold text-i23-gris-fonce mb-8 text-center">
            {t("deroulementTitle")}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {etapesGroupe.map((etape, i) => (
              <Card key={etape.key} padding="md">
                <div className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-8 h-8 rounded-full bg-i23-turquoise/10 text-i23-turquoise font-bold text-sm flex items-center justify-center">
                    {i + 1}
                  </span>
                  <div>
                    <h3 className="font-semibold text-i23-gris-fonce text-sm">
                      {t(`etapes.${etape.key}.title`)}
                    </h3>
                    <p className="text-xs text-i23-gris-fonce/70 mt-1">
                      {t(`etapes.${etape.key}.description`)}
                    </p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>

        <div className="mb-16">
          <h2 className="text-2xl font-bold text-i23-gris-fonce mb-8 text-center">
            {t("reglesTitle")}
          </h2>
          <div className="max-w-3xl mx-auto">
            <Card padding="lg">
              <ul className="space-y-3">
                {[1, 2, 3, 4, 5, 6].map((n) => (
                  <li key={n} className="flex items-start gap-3 text-sm text-i23-gris-fonce/80">
                    <span className="flex-shrink-0 w-5 h-5 rounded-full bg-i23-jaune/20 text-i23-jaune text-xs font-bold flex items-center justify-center mt-0.5">
                      {n}
                    </span>
                    {t(`regles.r${n}`)}
                  </li>
                ))}
              </ul>
            </Card>
          </div>
        </div>

        <div className="mb-16">
          <h2 className="text-2xl font-bold text-i23-gris-fonce mb-8 text-center">
            {t("animateurTitle")}
          </h2>
          <div className="max-w-3xl mx-auto">
            <Card padding="lg">
              <ul className="space-y-3">
                {[1, 2, 3, 4, 5].map((n) => (
                  <li key={n} className="flex items-start gap-3 text-sm text-i23-gris-fonce/80">
                    <span className="flex-shrink-0 text-i23-turquoise">&#10003;</span>
                    {t(`animateur.a${n}`)}
                  </li>
                ))}
              </ul>
            </Card>
          </div>
        </div>

        <div className="text-center">
          <p className="text-i23-gris-fonce/70 mb-6">
            {t("dureeLabel")} : 60, 75 {t("ou")} 90 {t("minutes")}
          </p>
          <Link
            href="/acces"
            className="inline-block bg-i23-turquoise text-white px-8 py-3 rounded-lg font-semibold hover:bg-i23-turquoise-hover transition-colors"
          >
            {t("cta")}
          </Link>
        </div>
      </div>
    </div>
  );
}
