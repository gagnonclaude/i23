"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "@/i18n/routing";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Textarea } from "@/components/ui/Textarea";

type PerceptionItem = {
  text: string;
  type: "" | "fait" | "interpretation";
};

export function ScanObservation() {
  const t = useTranslations("outil_scan_observation");
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [situation, setSituation] = useState("");
  const [perceptions, setPerceptions] = useState<PerceptionItem[]>([
    { text: "", type: "" },
    { text: "", type: "" },
    { text: "", type: "" },
  ]);
  const [menace, setMenace] = useState("");
  const [menaceImpact, setMenaceImpact] = useState("");
  const [opportunite, setOpportunite] = useState("");
  const [faitOublie, setFaitOublie] = useState("");
  const [actionObservation, setActionObservation] = useState("");
  const [actionQuestion, setActionQuestion] = useState("");

  const addPerception = () => {
    setPerceptions([...perceptions, { text: "", type: "" }]);
  };

  const updatePerception = (index: number, field: "text" | "type", value: string) => {
    const updated = [...perceptions];
    updated[index] = { ...updated[index], [field]: value };
    setPerceptions(updated);
  };

  const removePerception = (index: number) => {
    if (perceptions.length <= 1) return;
    setPerceptions(perceptions.filter((_, i) => i !== index));
  };

  const interpretations = perceptions.filter((p) => p.type === "interpretation" && p.text.trim());
  const faits = perceptions.filter((p) => p.type === "fait" && p.text.trim());

  const canContinue = () => {
    if (step === 0) return situation.length >= 10;
    if (step === 1) return perceptions.filter((p) => p.text.trim().length >= 3).length >= 2;
    if (step === 2) return perceptions.filter((p) => p.text.trim() && p.type).length >= 2;
    if (step === 3) return menace.length >= 5 && menaceImpact.length >= 10;
    if (step === 4) return opportunite.length >= 5 && faitOublie.length >= 5;
    if (step === 5) return actionObservation.length >= 5 && actionQuestion.length >= 5;
    return true;
  };

  const totalSteps = 6;

  const handleSubmit = async () => {
    setLoading(true);
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (user) {
      await supabase.from("outils_resultats").insert({
        user_id: user.id,
        outil_type: "scan_observation",
        etape_numero: 1,
        reponses: {
          situation,
          perceptions: perceptions.filter((p) => p.text.trim()),
          menace,
          menaceImpact,
          opportunite,
          faitOublie,
          actionObservation,
          actionQuestion,
        },
        menaces: [menace],
        opportunites: [opportunite],
      });
    }

    router.push("/outils/1");
    router.refresh();
  };

  return (
    <div className="py-20">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <img src="/images/1.png" alt="Étape 1" className="w-10 h-10" />
            <div>
              <p className="text-i23-turquoise font-semibold text-xs tracking-wide uppercase">
                {t("etape1Label")}
              </p>
              <h1 className="text-xl font-bold text-i23-gris-fonce">{t("title")}</h1>
            </div>
          </div>
          <p className="text-sm text-i23-gris-fonce/70 mt-2">{t("objectif")}</p>
          <Card padding="sm" className="bg-i23-jaune/5 border-i23-jaune/30 mt-3">
            <p className="text-xs text-i23-gris-fonce/70">
              <span className="font-semibold text-i23-jaune">{t("consigneLabel")}</span>{" "}
              {t("consigne")}
            </p>
          </Card>
        </div>

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
          <div className="space-y-4">
            <h2 className="text-lg font-bold text-i23-gris-fonce">{t("s1_title")}</h2>
            <p className="text-sm text-i23-gris-fonce/70">{t("s1_description")}</p>
            <Card padding="sm" className="bg-gray-50">
              <p className="text-xs text-i23-gris-fonce/50 mb-1">{t("exempleLabel")}</p>
              <p className="text-xs text-i23-gris-fonce/70 italic">{t("s1_exemple")}</p>
            </Card>
            <Textarea
              value={situation}
              onChange={(e) => setSituation(e.target.value)}
              placeholder={t("s1_placeholder")}
              rows={3}
            />
          </div>
        )}

        {step === 1 && (
          <div className="space-y-4">
            <h2 className="text-lg font-bold text-i23-gris-fonce">{t("s2_title")}</h2>
            <p className="text-sm text-i23-gris-fonce/70">{t("s2_description")}</p>
            <Card padding="sm" className="bg-gray-50">
              <p className="text-xs text-i23-gris-fonce/50 mb-1">{t("exempleLabel")}</p>
              <p className="text-xs text-i23-gris-fonce/70 italic">{t("s2_exemple")}</p>
            </Card>
            <div className="space-y-3">
              {perceptions.map((p, i) => (
                <div key={i} className="flex items-center gap-2">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-i23-turquoise/10 text-i23-turquoise text-xs font-bold flex items-center justify-center">
                    {i + 1}
                  </span>
                  <input
                    type="text"
                    value={p.text}
                    onChange={(e) => updatePerception(i, "text", e.target.value)}
                    placeholder={t("s2_inputPlaceholder")}
                    className="flex-1 px-3 py-2 border border-i23-gris-pale rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-i23-turquoise"
                  />
                  {perceptions.length > 1 && (
                    <button
                      onClick={() => removePerception(i)}
                      className="text-i23-gris-fonce/30 hover:text-red-400 transition-colors text-lg"
                    >
                      &times;
                    </button>
                  )}
                </div>
              ))}
              <button
                onClick={addPerception}
                className="text-sm text-i23-turquoise font-semibold hover:underline"
              >
                + {t("s2_add")}
              </button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4">
            <h2 className="text-lg font-bold text-i23-gris-fonce">{t("s3_title")}</h2>
            <p className="text-sm text-i23-gris-fonce/70">{t("s3_description")}</p>
            <Card padding="sm" className="bg-i23-turquoise/5 border-i23-turquoise/20 mb-4">
              <p className="text-xs text-i23-turquoise/80">{t("s3_postulat")}</p>
            </Card>
            <div className="space-y-3">
              {perceptions
                .filter((p) => p.text.trim())
                .map((p, i) => (
                  <Card key={i} padding="sm">
                    <p className="text-sm text-i23-gris-fonce mb-3">{p.text}</p>
                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          const idx = perceptions.indexOf(p);
                          updatePerception(idx, "type", "fait");
                        }}
                        className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-all ${
                          p.type === "fait"
                            ? "bg-i23-turquoise text-white"
                            : "bg-i23-gris-pale/50 text-i23-gris-fonce/70 hover:bg-i23-gris-pale"
                        }`}
                      >
                        {t("fait")}
                      </button>
                      <button
                        onClick={() => {
                          const idx = perceptions.indexOf(p);
                          updatePerception(idx, "type", "interpretation");
                        }}
                        className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-all ${
                          p.type === "interpretation"
                            ? "bg-i23-jaune text-i23-gris-fonce"
                            : "bg-i23-gris-pale/50 text-i23-gris-fonce/70 hover:bg-i23-gris-pale"
                        }`}
                      >
                        {t("interpretation")}
                      </button>
                    </div>
                  </Card>
                ))}
            </div>
            {faits.length > 0 && interpretations.length > 0 && (
              <div className="flex gap-4 mt-4 text-xs">
                <span className="text-i23-turquoise font-semibold">{faits.length} {t("faitsCount")}</span>
                <span className="text-i23-jaune font-semibold">{interpretations.length} {t("interpretationsCount")}</span>
              </div>
            )}
          </div>
        )}

        {step === 3 && (
          <div className="space-y-4">
            <h2 className="text-lg font-bold text-i23-gris-fonce">{t("s4_title")}</h2>
            <p className="text-sm text-i23-gris-fonce/70">{t("s4_description")}</p>
            {interpretations.length > 0 && (
              <div className="space-y-2 mb-4">
                <p className="text-xs font-semibold text-i23-jaune/80 uppercase">{t("s4_tesInterpretations")}</p>
                {interpretations.map((p, i) => (
                  <div key={i} className="px-3 py-2 bg-i23-jaune/5 border border-i23-jaune/20 rounded-lg">
                    <p className="text-sm text-i23-gris-fonce">{p.text}</p>
                  </div>
                ))}
              </div>
            )}
            <Textarea
              label={t("s4_menaceLabel")}
              value={menace}
              onChange={(e) => setMenace(e.target.value)}
              placeholder={t("s4_menacePlaceholder")}
              rows={2}
            />
            <Textarea
              label={t("s4_impactLabel")}
              value={menaceImpact}
              onChange={(e) => setMenaceImpact(e.target.value)}
              placeholder={t("s4_impactPlaceholder")}
              rows={3}
            />
          </div>
        )}

        {step === 4 && (
          <div className="space-y-4">
            <h2 className="text-lg font-bold text-i23-turquoise">{t("s5_title")}</h2>
            <p className="text-sm text-i23-gris-fonce/70">{t("s5_description")}</p>
            {faits.length > 0 && (
              <div className="space-y-2 mb-4">
                <p className="text-xs font-semibold text-i23-turquoise/80 uppercase">{t("s5_tesFaits")}</p>
                {faits.map((p, i) => (
                  <div key={i} className="px-3 py-2 bg-i23-turquoise/5 border border-i23-turquoise/20 rounded-lg">
                    <p className="text-sm text-i23-gris-fonce">{p.text}</p>
                  </div>
                ))}
              </div>
            )}
            <Textarea
              label={t("s5_opportuniteLabel")}
              value={opportunite}
              onChange={(e) => setOpportunite(e.target.value)}
              placeholder={t("s5_opportunitePlaceholder")}
              rows={2}
            />
            <Textarea
              label={t("s5_faitLabel")}
              value={faitOublie}
              onChange={(e) => setFaitOublie(e.target.value)}
              placeholder={t("s5_faitPlaceholder")}
              rows={2}
            />
          </div>
        )}

        {step === 5 && (
          <div className="space-y-4">
            <h2 className="text-lg font-bold text-i23-gris-fonce">{t("s6_title")}</h2>
            <p className="text-sm text-i23-gris-fonce/70">{t("s6_description")}</p>
            <div className="grid grid-cols-2 gap-3 mb-4">
              <Card padding="sm" className="bg-red-50 border-red-200">
                <p className="text-xs text-i23-gris-fonce/50 uppercase mb-1">{t("menaceLabel")}</p>
                <p className="text-xs text-red-800">{menace}</p>
              </Card>
              <Card padding="sm" className="bg-i23-turquoise/5 border-i23-turquoise/30">
                <p className="text-xs text-i23-gris-fonce/50 uppercase mb-1">{t("opportuniteLabel")}</p>
                <p className="text-xs text-i23-turquoise">{opportunite}</p>
              </Card>
            </div>
            <Textarea
              label={t("s6_observationLabel")}
              value={actionObservation}
              onChange={(e) => setActionObservation(e.target.value)}
              placeholder={t("s6_observationPlaceholder")}
              rows={2}
            />
            <Textarea
              label={t("s6_questionLabel")}
              value={actionQuestion}
              onChange={(e) => setActionQuestion(e.target.value)}
              placeholder={t("s6_questionPlaceholder")}
              rows={2}
            />
          </div>
        )}

        <div className="flex justify-between mt-8">
          {step > 0 ? (
            <Button variant="ghost" onClick={() => setStep(step - 1)}>{t("previous")}</Button>
          ) : (
            <div />
          )}
          {step < totalSteps - 1 ? (
            <Button onClick={() => setStep(step + 1)} disabled={!canContinue()}>{t("next")}</Button>
          ) : (
            <Button onClick={handleSubmit} loading={loading}>{t("submit")}</Button>
          )}
        </div>
      </div>
    </div>
  );
}
