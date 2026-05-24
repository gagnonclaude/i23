"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";

const masterclasses = [
  { key: "temps", icon: "⏳", parts: 3 },
  { key: "anxiete", icon: "😰", parts: 3 },
  { key: "confiance", icon: "💪", parts: 3 },
  { key: "relations", icon: "🤝", parts: 3 },
  { key: "energie", icon: "⚡", parts: 3 },
  { key: "identite", icon: "🪞", parts: 3 },
] as const;

export function MasterclassList() {
  const t = useTranslations("masterclass");

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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {masterclasses.map(({ key, icon, parts }) => (
            <Card key={key} hover padding="lg">
              <span className="text-3xl block mb-3">{icon}</span>
              <h3 className="text-lg font-bold text-i23-gris-fonce mb-2">
                {t(`list.${key}.title`)}
              </h3>
              <p className="text-sm text-i23-gris-fonce/70 mb-4">
                {t(`list.${key}.description`)}
              </p>
              <div className="flex items-center justify-between">
                <span className="text-xs text-i23-gris-fonce/50">{parts} {t("parts")}</span>
                <Link href={`/masterclass/${key}`}>
                  <Button size="sm" variant="outline">{t("start")}</Button>
                </Link>
              </div>
            </Card>
          ))}
        </div>

        <div className="bg-i23-gris-pale/20 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-i23-gris-fonce mb-6">{t("structure.title")}</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {(["part1", "part2", "part3"] as const).map((part, i) => (
              <div key={part} className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="w-7 h-7 bg-i23-turquoise rounded-full flex items-center justify-center text-white text-xs font-bold">
                    {i + 1}
                  </span>
                  <h3 className="font-semibold text-i23-gris-fonce text-sm">{t(`structure.${part}.title`)}</h3>
                </div>
                <p className="text-xs text-i23-gris-fonce/70 pl-9">{t(`structure.${part}.description`)}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
