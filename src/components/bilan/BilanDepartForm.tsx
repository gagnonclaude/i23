"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/routing";
import { useRouter as useNextRouter } from "next/navigation";
import { useLocalDraft } from "@/hooks/useLocalDraft";

type Dimension = "energie" | "anxiete" | "temps" | "emotions" | "motivation" | "communication" | "confiance" | "relations";

const questions: { key: string; dimension: Dimension; type: "scale" | "choice" | "text" }[] = [
  { key: "q1", dimension: "energie", type: "scale" },
  { key: "q2", dimension: "anxiete", type: "scale" },
  { key: "q3", dimension: "temps", type: "choice" },
  { key: "q4", dimension: "emotions", type: "scale" },
  { key: "q5", dimension: "motivation", type: "choice" },
  { key: "q6", dimension: "communication", type: "scale" },
  { key: "q7", dimension: "confiance", type: "scale" },
  { key: "q8", dimension: "relations", type: "choice" },
  { key: "q9", dimension: "anxiete", type: "choice" },
  { key: "q10", dimension: "energie", type: "choice" },
  { key: "q11", dimension: "emotions", type: "choice" },
  { key: "q12", dimension: "confiance", type: "choice" },
  { key: "q13", dimension: "temps", type: "scale" },
  { key: "q14", dimension: "relations", type: "scale" },
  { key: "q15", dimension: "motivation", type: "scale" },
  { key: "q16", dimension: "communication", type: "choice" },
  { key: "q17", dimension: "emotions", type: "text" },
  { key: "q18", dimension: "confiance", type: "text" },
];

const QUESTIONS_PER_STEP = 4;
const totalSteps = Math.ceil(questions.length / QUESTIONS_PER_STEP) + 1;

export function BilanDepartForm() {
  const t = useTranslations("bilan");
  const router = useRouter();
  const nextRouter = useNextRouter();
  const [step, setStep] = useState(0);
  const [answers, setAnswers, clearAnswers] = useLocalDraft<Record<string, string | number>>("bilan-depart", {});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const currentQuestions = step === 0
    ? []
    : questions.slice((step - 1) * QUESTIONS_PER_STEP, step * QUESTIONS_PER_STEP);

  const setAnswer = (key: string, value: string | number) => {
    setAnswers((prev) => ({ ...prev, [key]: value }));
  };

  const canContinue = () => {
    if (step === 0) return true;
    return currentQuestions.every((q) => {
      if (q.type === "text") return ((answers[q.key] as string) || "").length >= 5;
      return answers[q.key] !== undefined && answers[q.key] !== "";
    });
  };

  const handleSubmit = async () => {
    setLoading(true);

    const dimensions: Record<string, number[]> = {
      energie: [], anxiete: [], temps: [], emotions: [],
      motivation: [], communication: [], confiance: [], relations: [],
    };

    questions.forEach((q) => {
      const val = answers[q.key];
      if (val !== undefined && val !== "") {
        const num = q.type === "scale" ? Number(val) : q.type === "choice" ? Number(val) : 0;
        if (!isNaN(num)) dimensions[q.dimension].push(num);
      }
    });

    const scores: Record<string, number> = {};
    Object.entries(dimensions).forEach(([dim, vals]) => {
      scores[dim] = vals.length > 0 ? Math.round(vals.reduce((a, b) => a + b, 0) / vals.length * 10) / 10 : 0;
    });

    try {
      const res = await fetch("/api/bilan-depart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reponses: answers, scores_dimensions: scores }),
      });
      if (!res.ok) {
        setError("Erreur lors de la sauvegarde. Réessaie.");
        setLoading(false);
        return;
      }
    } catch {
      setError("Erreur de connexion. Réessaie.");
      setLoading(false);
      return;
    }

    clearAnswers();
    nextRouter.refresh();
    router.push("/dashboard");
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex gap-1 mb-8">
        {Array.from({ length: totalSteps }).map((_, i) => (
          <div
            key={i}
            className={`h-1 flex-1 rounded-full transition-colors ${
              i <= step ? "bg-i23-turquoise" : "bg-i23-gris-pale"
            }`}
          />
        ))}
      </div>

      {step === 0 && (
        <div className="text-center space-y-4">
          <h2 className="text-2xl font-bold text-i23-gris-fonce">{t("accueil.title")}</h2>
          <p className="text-i23-gris-fonce/70">{t("accueil.description")}</p>
        </div>
      )}

      {step > 0 && (
        <div className="space-y-8">
          {currentQuestions.map((q) => (
            <div key={q.key} className="space-y-3">
              <p className="text-sm font-medium text-i23-gris-fonce">{t(`questions.${q.key}`)}</p>

              {q.type === "scale" && (
                <div className="flex items-center gap-3">
                  <span className="text-xs text-i23-gris-fonce/50">{t("scale.low")}</span>
                  <div className="flex gap-2 flex-1 justify-center">
                    {[1, 2, 3, 4, 5].map((n) => (
                      <button
                        key={n}
                        onClick={() => setAnswer(q.key, n)}
                        className={`w-10 h-10 rounded-full text-sm font-semibold transition-all ${
                          answers[q.key] === n
                            ? "bg-i23-turquoise text-white scale-110"
                            : "bg-i23-gris-pale/50 text-i23-gris-fonce/70 hover:bg-i23-gris-pale"
                        }`}
                      >
                        {n}
                      </button>
                    ))}
                  </div>
                  <span className="text-xs text-i23-gris-fonce/50">{t("scale.high")}</span>
                </div>
              )}

              {q.type === "choice" && (
                <div className="flex gap-2">
                  {(["a", "b", "c"] as const).map((letter, idx) => (
                    <button
                      key={letter}
                      onClick={() => setAnswer(q.key, String(idx + 1))}
                      className={`flex-1 px-3 py-2.5 rounded-lg text-sm border-2 transition-all ${
                        answers[q.key] === String(idx + 1)
                          ? "border-i23-turquoise bg-i23-turquoise/5 text-i23-gris-fonce font-medium"
                          : "border-i23-gris-pale text-i23-gris-fonce/70 hover:border-i23-turquoise/30"
                      }`}
                    >
                      {t(`questions.${q.key}_${letter}`)}
                    </button>
                  ))}
                </div>
              )}

              {q.type === "text" && (
                <textarea
                  value={(answers[q.key] as string) || ""}
                  onChange={(e) => setAnswer(q.key, e.target.value)}
                  rows={3}
                  className="w-full px-4 py-3 border border-i23-gris-pale rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-i23-turquoise resize-none"
                  placeholder={t("placeholder")}
                />
              )}
            </div>
          ))}
        </div>
      )}

      <div className="flex justify-between mt-8">
        {step > 0 ? (
          <button
            onClick={() => setStep(step - 1)}
            className="px-6 py-2.5 text-sm text-i23-gris-fonce/70 hover:text-i23-gris-fonce transition-colors"
          >
            {t("previous")}
          </button>
        ) : (
          <div />
        )}
        {step < totalSteps - 1 ? (
          <button
            onClick={() => setStep(step + 1)}
            disabled={!canContinue()}
            className="px-6 py-2.5 bg-i23-turquoise text-white text-sm font-semibold rounded-lg hover:bg-i23-turquoise-hover transition-colors disabled:opacity-50"
          >
            {t("next")}
          </button>
        ) : (
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="px-6 py-2.5 bg-i23-turquoise text-white text-sm font-semibold rounded-lg hover:bg-i23-turquoise-hover transition-colors disabled:opacity-50"
          >
            {loading ? t("loading") : t("submit")}
          </button>
        )}
      </div>
    </div>
  );
}
