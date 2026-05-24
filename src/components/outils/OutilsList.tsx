"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { methodeConfig } from "@/lib/config";
import { Card } from "@/components/ui/Card";

export function OutilsList() {
  const t = useTranslations("outils");

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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {methodeConfig.etapes.map((etape) => (
            <Link key={etape.numero} href={`/outils/${etape.numero}`}>
              <Card hover padding="md">
                <div className="flex items-start gap-4">
                  <img
                    src={`/images/${etape.numero}.png`}
                    alt={etape.nom}
                    className="w-12 h-12 flex-shrink-0"
                  />
                  <div className="flex-1">
                    <h3 className="font-semibold text-i23-gris-fonce mb-1">
                      {t("outilEtape")} {etape.numero} : {etape.nom}
                    </h3>
                    <p className="text-xs text-i23-gris-fonce/70">
                      {etape.description}
                    </p>
                  </div>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
