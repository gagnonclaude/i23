"use client";

import { useTranslations } from "next-intl";
import { methodeConfig } from "@/lib/config";
import { Card } from "@/components/ui/Card";

export function MethodeContent() {
  const t = useTranslations("methode");

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
          <p className="text-i23-gris-fonce/70 max-w-2xl mx-auto mb-8">
            {t("description")}
          </p>
          <img src="/images/methode.png" alt="Méthode i+" className="mx-auto w-1/3" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-i23-gris-fonce">{t("boucle")}</h2>
            <p className="text-sm text-i23-gris-fonce/70">{t("boucleDesc")}</p>
            <div className="flex flex-wrap gap-2">
              {["Déclencheur", "Schéma", "Outil", "Trajectoire"].map((item, i) => (
                <span key={i} className="flex items-center gap-2 text-sm">
                  {i > 0 && <span className="text-i23-turquoise">→</span>}
                  <span className="bg-i23-turquoise/10 text-i23-turquoise px-3 py-1 rounded-full font-medium">{item}</span>
                </span>
              ))}
            </div>
          </div>
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-i23-gris-fonce">{t("niveaux")}</h2>
            <div className="space-y-2">
              {methodeConfig.niveaux.map((n) => {
                const img = n.id === "i" ? "/images/i.png" : n.id === "2" ? "/images/2logo.png" : "/images/3logo.png";
                return (
                  <div key={n.id} className="flex items-start gap-3">
                    <img src={img} alt={n.nom} className="w-10 h-10 flex-shrink-0" />
                    <div>
                      <p className="text-sm font-semibold text-i23-gris-fonce">{n.nom}</p>
                      <p className="text-xs text-i23-gris-fonce/70">{n.description}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <h2 className="text-2xl font-bold text-i23-gris-fonce mb-8">{t("etapesTitle")}</h2>
        <div className="space-y-6">
          {methodeConfig.etapes.map((etape) => (
            <Card key={etape.numero} padding="lg">
              <div className="flex items-start gap-4">
                <img src={`/images/${etape.numero}.png`} alt={etape.nom} className="w-12 h-12 flex-shrink-0" />
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-i23-gris-fonce mb-1">
                    {etape.nom}
                  </h3>
                  <p className="text-sm text-i23-gris-fonce/70 mb-4">
                    {etape.description}
                  </p>
                  {etape.postulats && etape.postulats.length > 0 && (
                    <div>
                      <p className="text-xs font-semibold text-i23-gris-fonce/50 uppercase tracking-wide mb-2">
                        {t("postulats")}
                      </p>
                      <ul className="space-y-1">
                        {etape.postulats.map((p, i) => (
                          <li key={i} className="text-sm text-i23-gris-fonce/80 flex items-start gap-2">
                            <span className="text-i23-turquoise mt-0.5 flex-shrink-0">•</span>
                            {p}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>

        <div className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-6">
          {methodeConfig.poles.map((pole) => (
            <Card key={pole.id} padding="md" className={pole.id === "menace" ? "border-red-200" : "border-green-200"}>
              <h3 className={`text-lg font-bold mb-2 ${pole.id === "menace" ? "text-red-600" : "text-i23-turquoise"}`}>
                {pole.nom}
              </h3>
              <p className="text-sm text-i23-gris-fonce/70">{pole.description}</p>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
