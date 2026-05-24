"use client";

import { useTranslations } from "next-intl";
import { PricingCards } from "@/components/acces/PricingCards";

export default function HomeContent({ locale }: { locale: string }) {
  const t = useTranslations("funnel");

  return (
    <>
      <section className="py-20 md:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <p className="text-i23-turquoise font-semibold text-sm tracking-wide uppercase mb-4">
              {t("probleme.badge")}
            </p>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-i23-gris-fonce leading-tight mb-6">
              {t("probleme.title")}
              <br />
              <span className="text-i23-turquoise">{t("probleme.titleHighlight")}</span>
            </h1>
            <p className="text-lg text-i23-gris-fonce/70 mb-8 leading-relaxed">
              {t("probleme.description")}
            </p>
            <a
              href="#forfaits"
              className="inline-flex items-center justify-center bg-i23-turquoise text-white px-6 py-3 rounded-lg text-sm font-semibold hover:bg-i23-turquoise-hover transition-colors"
            >
              {t("cta.button")}
            </a>
          </div>
        </div>
      </section>

      <section className="py-20 bg-i23-gris-pale/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <p className="text-i23-turquoise font-semibold text-sm tracking-wide uppercase mb-2">
              {t("agitation.badge")}
            </p>
            <h2 className="text-3xl md:text-4xl font-bold text-i23-gris-fonce mb-4">
              {t("agitation.title")}
            </h2>
            <p className="text-i23-gris-fonce/70 leading-relaxed">
              {t("agitation.description")}
            </p>
          </div>
          <div className="max-w-2xl mx-auto space-y-4">
            {(["1", "2", "3", "4"] as const).map((key) => (
              <div key={key} className="flex items-start gap-4 bg-white border border-i23-gris-pale rounded-xl p-5">
                <div className="w-8 h-8 bg-i23-jaune/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-i23-jaune font-bold text-sm">{key}</span>
                </div>
                <p className="text-i23-gris-fonce/80 text-sm leading-relaxed">
                  {t(`agitation.items.${key}`)}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <p className="text-i23-turquoise font-semibold text-sm tracking-wide uppercase mb-2">
              {t("solution.badge")}
            </p>
            <h2 className="text-3xl md:text-4xl font-bold text-i23-gris-fonce mb-4">
              {t("solution.title")}
            </h2>
            <p className="text-i23-gris-fonce/70 leading-relaxed">
              {t("solution.description")}
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {(["observer", "predire", "ressentir", "choisir", "planifier", "agir", "evaluer", "apprendre"] as const).map((key, i) => (
              <div key={key} className="bg-white border border-i23-gris-pale rounded-2xl p-6 text-center hover:shadow-lg transition-shadow">
                <div className="w-10 h-10 bg-i23-turquoise rounded-full flex items-center justify-center mx-auto mb-3 text-white font-bold text-sm">
                  {i + 1}
                </div>
                <h3 className="font-semibold text-i23-gris-fonce mb-1">{t(`solution.items.${key}.title`)}</h3>
                <p className="text-i23-gris-fonce/70 text-xs leading-relaxed">{t(`solution.items.${key}.description`)}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-i23-gris-fonce">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <p className="text-i23-jaune font-semibold text-sm tracking-wide uppercase mb-2">
              {t("credibilite.badge")}
            </p>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              {t("credibilite.title")}
            </h2>
            <p className="text-white/70 leading-relaxed">
              {t("credibilite.description")}
            </p>
          </div>
          <div className="grid grid-cols-3 gap-8 max-w-2xl mx-auto">
            {(["annees", "theories", "etapes"] as const).map((key) => (
              <div key={key} className="text-center">
                <p className="text-4xl md:text-5xl font-bold text-i23-jaune mb-2">
                  {t(`credibilite.stats.${key}.value`)}
                </p>
                <p className="text-white/60 text-sm">
                  {t(`credibilite.stats.${key}.label`)}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <p className="text-i23-turquoise font-semibold text-sm tracking-wide uppercase mb-2">
              {t("benefices.badge")}
            </p>
            <h2 className="text-3xl md:text-4xl font-bold text-i23-gris-fonce">
              {t("benefices.title")}
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {(["masterclass", "schema", "outils", "groupes", "ia", "parcours"] as const).map((key) => (
              <div key={key} className="bg-white border border-i23-gris-pale rounded-2xl p-6 hover:shadow-lg transition-shadow">
                <h3 className="font-semibold text-i23-gris-fonce mb-2">{t(`benefices.items.${key}.title`)}</h3>
                <p className="text-i23-gris-fonce/70 text-sm leading-relaxed">{t(`benefices.items.${key}.description`)}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="forfaits" className="py-20 bg-i23-gris-pale/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <p className="text-i23-turquoise font-semibold text-sm tracking-wide uppercase mb-2">
              {t("prix.badge")}
            </p>
            <h2 className="text-3xl md:text-4xl font-bold text-i23-gris-fonce mb-2">
              {t("prix.title")}
            </h2>
            <p className="text-i23-gris-fonce/70 text-sm">
              {t("prix.subtitle")}
            </p>
          </div>
          <PricingCards />
        </div>
      </section>

      <section className="py-20 bg-gradient-to-br from-i23-turquoise to-i23-turquoise-hover">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            {t("cta.title")}
          </h2>
          <p className="text-white/80 mb-8 max-w-2xl mx-auto leading-relaxed">
            {t("cta.description")}
          </p>
          <a
            href="#forfaits"
            className="inline-flex items-center justify-center bg-i23-jaune text-i23-gris-fonce px-8 py-3 rounded-lg text-sm font-semibold hover:bg-i23-jaune-hover transition-colors"
          >
            {t("cta.button")}
          </a>
        </div>
      </section>
    </>
  );
}
