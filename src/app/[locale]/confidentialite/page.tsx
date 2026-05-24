import { setRequestLocale } from "next-intl/server";
import { useTranslations } from "next-intl";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Politique de confidentialite | i23",
  description: "Politique de confidentialite i23 - conformite Loi 25 (Quebec) et PIPEDA",
};

function PrivacyContent() {
  const t = useTranslations("confidentialite");

  return (
    <div className="py-20">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 prose prose-slate">
        <h1 className="text-3xl md:text-4xl font-bold text-i23-gris-fonce mb-8">
          {t("title")}
        </h1>

        <p className="text-sm text-gray-500 mb-8">
          Derniere mise a jour : 2026-05-21
        </p>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-i23-gris-fonce mb-4">{t("section1Title")}</h2>
          <p className="text-gray-700 leading-relaxed">{t("section1Content")}</p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-i23-gris-fonce mb-4">{t("section2Title")}</h2>
          <ul className="list-disc pl-6 text-gray-700 space-y-2">
            <li>{t("section2Item1")}</li>
            <li>{t("section2Item2")}</li>
            <li>{t("section2Item3")}</li>
            <li>{t("section2Item4")}</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-i23-gris-fonce mb-4">{t("section3Title")}</h2>
          <p className="text-gray-700 leading-relaxed">{t("section3Content")}</p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-i23-gris-fonce mb-4">{t("section4Title")}</h2>
          <p className="text-gray-700 leading-relaxed mb-4">{t("section4Content")}</p>
          <ul className="list-disc pl-6 text-gray-700 space-y-2">
            <li>{t("section4Item1")}</li>
            <li>{t("section4Item2")}</li>
            <li>{t("section4Item3")}</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-i23-gris-fonce mb-4">{t("section5Title")}</h2>
          <p className="text-gray-700 leading-relaxed">{t("section5Content")}</p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-i23-gris-fonce mb-4">{t("section6Title")}</h2>
          <p className="text-gray-700 leading-relaxed">{t("section6Content")}</p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-i23-gris-fonce mb-4">{t("section7Title")}</h2>
          <p className="text-gray-700 leading-relaxed">{t("section7Content")}</p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-i23-gris-fonce mb-4">{t("section8Title")}</h2>
          <p className="text-gray-700 leading-relaxed">{t("section8Content")}</p>
        </section>

        <section className="mb-8 bg-i23-turquoise/5 p-6 rounded-lg border border-i23-turquoise/20">
          <h2 className="text-xl font-semibold text-i23-gris-fonce mb-4">{t("section9Title")}</h2>
          <p className="text-gray-700 leading-relaxed">{t("section9Content")}</p>
        </section>
      </div>
    </div>
  );
}

export default async function ConfidentialitePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);

  return <PrivacyContent />;
}
