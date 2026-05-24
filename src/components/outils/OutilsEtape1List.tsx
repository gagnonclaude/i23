"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { Card } from "@/components/ui/Card";
import { outilsEtape1 } from "@/lib/outils";

export function OutilsEtape1List() {
  const t = useTranslations("outils_etape1");

  return (
    <div className="py-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-4 mb-8">
          <img src="/images/1.png" alt="Étape 1" className="w-10 h-10" />
          <div>
            <p className="text-i23-turquoise font-semibold text-xs tracking-wide uppercase">
              {t("badge")}
            </p>
            <h1 className="text-xl font-bold text-i23-gris-fonce">{t("title")}</h1>
          </div>
        </div>
        <p className="text-sm text-i23-gris-fonce/70 mb-8">{t("description")}</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {outilsEtape1.map((outil) => (
            <Link key={outil.slug} href={`/outils/1/${outil.slug}`}>
              <Card hover padding="md">
                <div className="flex items-center gap-3">
                  <span className="flex-shrink-0 w-8 h-8 rounded-full bg-i23-turquoise/10 text-i23-turquoise font-bold text-sm flex items-center justify-center">
                    {outil.numero}
                  </span>
                  <div>
                    <h3 className="font-semibold text-i23-gris-fonce text-sm">
                      {t(`outil_${outil.numero}_title`)}
                    </h3>
                    <p className="text-xs text-i23-gris-fonce/70 mt-0.5">
                      {t(`outil_${outil.numero}_desc`)}
                    </p>
                  </div>
                </div>
              </Card>
            </Link>
          ))}
        </div>

        <div className="mt-8">
          <Link href="/outils" className="text-sm text-i23-turquoise hover:underline">
            &larr; {t("backToOutils")}
          </Link>
        </div>
      </div>
    </div>
  );
}
