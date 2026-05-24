"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import type { QuizQuestion } from "@/lib/quiz";

export function QuizForm({ questions, mcId, onSuccess }: { questions: QuizQuestion[]; mcId: string; onSuccess: (score: number, total: number, reussi: boolean) => void }) {
  const t = useTranslations("parcours");
  const [current, setCurrent] = useState(0);
  const [reponses, setReponses] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);

  const q = questions[current];
  const isLast = current === questions.length - 1;
  const allAnswered = questions.every((q) => reponses[q.id]);

  async function handleSubmit() {
    setSubmitting(true);
    try {
      const res = await fetch("/api/quiz", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mc_id: mcId, reponses }),
      });
      const data = await res.json();
      onSuccess(data.score, data.total, data.reussi);
    } catch {
      alert("Erreur lors de la soumission");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="py-12">
      <div className="max-w-2xl mx-auto px-4">
        <div className="mb-6 flex items-center justify-between">
          <span className="text-sm text-i23-gris-fonce/50">{t("quizQuestionOf", { current: current + 1, total: questions.length })}</span>
          <div className="flex gap-1">
            {questions.map((_, i) => (
              <div key={i} className={`w-2 h-2 rounded-full ${i <= current ? "bg-i23-turquoise" : "bg-i23-gris-pale"}`} />
            ))}
          </div>
        </div>

        <Card padding="lg">
          <h2 className="text-lg font-semibold text-i23-gris-fonce mb-6">{q.question}</h2>
          <div className="space-y-3">
            {q.choix.map((c) => (
              <button
                key={c.id}
                onClick={() => setReponses({ ...reponses, [q.id]: c.id })}
                className={`w-full text-left p-4 rounded-lg border-2 transition-colors ${
                  reponses[q.id] === c.id
                    ? "border-i23-turquoise bg-i23-turquoise/5"
                    : "border-i23-gris-pale hover:border-i23-turquoise/50"
                }`}
              >
                <span className="text-i23-gris-fonce">{c.texte}</span>
              </button>
            ))}
          </div>
        </Card>

        <div className="flex justify-between mt-6">
          <Button variant="ghost" onClick={() => setCurrent(Math.max(0, current - 1))} disabled={current === 0}>
            {t("previous")}
          </Button>
          {isLast ? (
            <Button onClick={handleSubmit} disabled={!allAnswered || submitting}>
              {submitting ? t("submitting") : t("submitQuiz")}
            </Button>
          ) : (
            <Button onClick={() => setCurrent(current + 1)} disabled={!reponses[q.id]}>
              {t("next")}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
