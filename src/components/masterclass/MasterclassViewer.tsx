"use client";

import { useState, useEffect } from "react";
import { useTranslations, useLocale } from "next-intl";
import { type MasterclassData } from "@/lib/masterclass";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Textarea } from "@/components/ui/Textarea";

const QUIZ_PAR_MC: Record<string, string> = {
  "methode-i+": "/quiz/methode-i+",
  "energie": "/quiz/energie",
};

export function MasterclassViewer({ mc }: { mc: MasterclassData }) {
  const t = useTranslations("masterclass");
  const locale = useLocale();
  const [currentPart, setCurrentPart] = useState(0);
  const [currentSection, setCurrentSection] = useState(0);
  const [notes, setNotes] = useState<Record<string, string>>({});

  const part = mc.parties[currentPart];
  const section = part?.sections[currentSection];
  const totalSections = mc.parties.reduce((acc, p) => acc + p.sections.length, 0);
  const globalIndex = mc.parties.slice(0, currentPart).reduce((acc, p) => acc + p.sections.length, 0) + currentSection;

  // Sauvegarder la progression à chaque section
  useEffect(() => {
    fetch("/api/mc-progress", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ mc_id: mc.slug, section_actuelle: globalIndex }),
    }).catch(() => {});
  }, [globalIndex, mc.slug]);

  const goNext = () => {
    if (currentSection < part.sections.length - 1) {
      setCurrentSection(currentSection + 1);
    } else if (currentPart < mc.parties.length - 1) {
      setCurrentPart(currentPart + 1);
      setCurrentSection(0);
    }
  };

  const goPrev = () => {
    if (currentSection > 0) {
      setCurrentSection(currentSection - 1);
    } else if (currentPart > 0) {
      setCurrentPart(currentPart - 1);
      const prevPart = mc.parties[currentPart - 1];
      setCurrentSection(prevPart.sections.length - 1);
    }
  };

  const handleFinish = () => {
    const quizPath = QUIZ_PAR_MC[mc.slug];
    if (quizPath) {
      window.location.href = `/${locale}${quizPath}`;
    } else {
      window.location.href = `/${locale}/dashboard`;
    }
  };

  const isFirst = currentPart === 0 && currentSection === 0;
  const isLast = currentPart === mc.parties.length - 1 && currentSection === part.sections.length - 1;

  if (!section) return null;

  return (
    <div className="max-w-3xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <span className="text-2xl">{mc.icon}</span>
        <div>
          <h1 className="text-lg font-bold text-i23-gris-fonce">{mc.thematique}</h1>
          <p className="text-xs text-i23-gris-fonce/50">
            {t("section")} {globalIndex + 1}/{totalSections}
          </p>
        </div>
      </div>

      <div className="flex gap-1 mb-6">
        {mc.parties.map((p) =>
          p.sections.map((_, si) => {
            const partIdx = mc.parties.indexOf(p);
            const visited =
              partIdx < currentPart || (partIdx === currentPart && si <= currentSection);
            return (
              <div
                key={`${partIdx}-${si}`}
                className={`h-1 flex-1 rounded-full transition-colors ${
                  visited ? "bg-i23-turquoise" : "bg-i23-gris-pale"
                }`}
              />
            );
          })
        )}
      </div>

      <Card padding="lg" className="mb-6">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-xs font-semibold text-i23-turquoise">{section.numero}</span>
          <span className="text-xs text-i23-gris-fonce/50">{part.titre}</span>
        </div>
        <h2 className="text-xl font-bold text-i23-gris-fonce mb-1">{section.titre}</h2>
        {section.sousTitre && (
          <p className="text-sm text-i23-turquoise font-medium mb-4">{section.sousTitre}</p>
        )}

        <p className="text-sm text-i23-gris-fonce/80 leading-relaxed mb-6">{section.contenu}</p>

        {section.exemple && (
          <div className="bg-i23-gris-pale/30 rounded-xl p-4 mb-6">
            <p className="text-xs font-semibold text-i23-gris-fonce/50 uppercase mb-2">
              {t("example")} — {mc.personnage}
            </p>
            <p className="text-sm text-i23-gris-fonce/70 whitespace-pre-line">{section.exemple}</p>
          </div>
        )}

        {section.aRetenir && section.aRetenir.length > 0 && (
          <div className="bg-i23-turquoise/5 border border-i23-turquoise/20 rounded-xl p-4 mb-6">
            <p className="text-xs font-semibold text-i23-turquoise mb-2">💡 {t("keyPoints")}</p>
            <ul className="space-y-1">
              {section.aRetenir.map((item, i) => (
                <li key={i} className="text-sm text-i23-gris-fonce/80 flex items-start gap-2">
                  <span className="text-i23-turquoise mt-0.5">•</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        )}

        {section.question && (
          <div className="bg-i23-jaune/5 border border-i23-jaune/20 rounded-xl p-4 mb-6">
            <p className="text-xs font-semibold text-i23-jaune mb-2">👉 {t("question")}</p>
            <p className="text-sm text-i23-gris-fonce font-medium">{section.question}</p>
          </div>
        )}

        {section.consigne && (
          <div className="bg-i23-gris-fonce/5 border border-i23-gris-fonce/10 rounded-xl p-4 mb-6">
            <p className="text-xs font-semibold text-i23-gris-fonce/50 uppercase mb-2">{t("instruction")}</p>
            <p className="text-sm text-i23-gris-fonce">{section.consigne}</p>
          </div>
        )}

        <div className="mt-4">
          <p className="text-xs font-semibold text-i23-gris-fonce/50 uppercase mb-2">{t("myNotes")}</p>
          <Textarea
            value={notes[section.numero] || ""}
            onChange={(e) => setNotes((prev) => ({ ...prev, [section.numero]: e.target.value }))}
            placeholder={t("notesPlaceholder")}
            rows={3}
          />
        </div>

        {section.transition && (
          <p className="text-sm text-i23-turquoise font-medium mt-4">→ {section.transition}</p>
        )}
      </Card>

      <div className="flex justify-between">
        {isFirst ? (
          <div />
        ) : (
          <Button variant="ghost" onClick={goPrev}>{t("previous")}</Button>
        )}
        {isLast ? (
          <Button onClick={handleFinish}>{t("finish")}</Button>
        ) : (
          <Button onClick={goNext}>{t("nextSection")}</Button>
        )}
      </div>
    </div>
  );
}
