"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/routing";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { niveauxMaslow, bilanQuestions, thematiquesParNiveau, type NiveauMaslow } from "@/lib/initialisation";
import { advanceTo } from "@/lib/parcours";

const TOTAL_STEPS = 4;

export function InitialisationForm() {
  const t = useTranslations("parcours");
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);

  const [profil, setProfil] = useState({ prenom: "", motivation: "" });
  const [bilanReponses, setBilanReponses] = useState<Record<string, number>>({});
  const [priorites, setPriorites] = useState<NiveauMaslow[]>([]);
  const [besoins, setBesoins] = useState<string[]>([]);

  const canContinue = () => {
    if (step === 0) return profil.prenom.trim().length >= 2;
    if (step === 1) return Object.keys(bilanReponses).length === bilanQuestions.length;
    if (step === 2) return priorites.length >= 1;
    if (step === 3) return besoins.length >= 1;
    return true;
  };

  const togglePriorite = (id: NiveauMaslow) => {
    setPriorites((prev) =>
      prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]
    );
  };

  const toggleBesoin = (id: string) => {
    setBesoins((prev) =>
      prev.includes(id) ? prev.filter((b) => b !== id) : [...prev, id]
    );
  };

  const sanitize = (str: string) => str.replace(/[<>&"']/g, "").trim();

  const handleSubmit = async () => {
    setLoading(true);
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      setLoading(false);
      return;
    }

    const safeProfil = {
      prenom: sanitize(profil.prenom).slice(0, 50),
      motivation: sanitize(profil.motivation).slice(0, 1000),
    };

    const scores: Record<string, number> = {};
    const niveauScores: Record<string, number[]> = {};
    bilanQuestions.forEach((q) => {
      if (!niveauScores[q.niveau]) niveauScores[q.niveau] = [];
      const val = bilanReponses[q.id];
      if (typeof val === "number" && val >= 1 && val <= 5) {
        niveauScores[q.niveau].push(val);
      }
    });
    Object.entries(niveauScores).forEach(([niveau, vals]) => {
      scores[niveau] = vals.length > 0
        ? Math.round((vals.reduce((a, b) => a + b, 0) / vals.length) * 10) / 10
        : 0;
    });

    await Promise.all([
      supabase.from("bilans_depart").upsert({
        user_id: user.id,
        reponses: bilanReponses,
        scores_dimensions: scores,
        completed_at: new Date().toISOString(),
      }, { onConflict: "user_id" }),
      supabase.from("parcours_progression").upsert({
        user_id: user.id,
        etape_actuelle: "mc-methode",
        date_modification: new Date().toISOString(),
      }, { onConflict: "user_id" }),
    ]);

    router.push("/dashboard");
  };

  return (
    <div className="py-12">
      <div className="max-w-2xl mx-auto px-4">
        <div className="flex gap-1 mb-8">
          {Array.from({ length: TOTAL_STEPS }).map((_, i) => (
            <div key={i} className={`h-1 flex-1 rounded-full transition-colors ${i <= step ? "bg-i23-turquoise" : "bg-i23-gris-pale"}`} />
          ))}
        </div>

        <p className="text-xs text-i23-gris-fonce/50 mb-6">
          {t("initialisation.stepOf", { current: step + 1, total: TOTAL_STEPS })}
        </p>

        {step === 0 && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-i23-gris-fonce">{t("initialisation.profilTitle")}</h2>
            <p className="text-sm text-i23-gris-fonce/70">{t("initialisation.profilDesc")}</p>
            <div>
              <label className="block text-sm font-medium text-i23-gris-fonce mb-2">{t("initialisation.prenomLabel")}</label>
              <input
                type="text"
                value={profil.prenom}
                onChange={(e) => setProfil({ ...profil, prenom: e.target.value })}
                className="w-full px-4 py-3 border border-i23-gris-pale rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-i23-turquoise"
                placeholder={t("initialisation.prenomPlaceholder")}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-i23-gris-fonce mb-2">{t("initialisation.motivationLabel")}</label>
              <textarea
                value={profil.motivation}
                onChange={(e) => setProfil({ ...profil, motivation: e.target.value })}
                rows={3}
                className="w-full px-4 py-3 border border-i23-gris-pale rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-i23-turquoise resize-none"
                placeholder={t("initialisation.motivationPlaceholder")}
              />
            </div>
          </div>
        )}

        {step === 1 && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-i23-gris-fonce">{t("initialisation.bilanTitle")}</h2>
            <p className="text-sm text-i23-gris-fonce/70">{t("initialisation.bilanDesc")}</p>
            {bilanQuestions.map((q) => (
              <Card key={q.id} padding="md">
                <p className="text-sm font-medium text-i23-gris-fonce mb-3">{q.question}</p>
                <div className="flex items-center gap-3">
                  <span className="text-xs text-i23-gris-fonce/50">1</span>
                  <div className="flex gap-2 flex-1 justify-center">
                    {[1, 2, 3, 4, 5].map((n) => (
                      <button
                        key={n}
                        onClick={() => setBilanReponses({ ...bilanReponses, [q.id]: n })}
                        className={`w-10 h-10 rounded-full text-sm font-semibold transition-all ${
                          bilanReponses[q.id] === n
                            ? "bg-i23-turquoise text-white scale-110"
                            : "bg-i23-gris-pale/50 text-i23-gris-fonce/70 hover:bg-i23-gris-pale"
                        }`}
                      >
                        {n}
                      </button>
                    ))}
                  </div>
                  <span className="text-xs text-i23-gris-fonce/50">5</span>
                </div>
                <p className="text-xs text-i23-gris-fonce/40 mt-2">
                  {niveauxMaslow.find((n) => n.id === q.niveau)?.nom}
                </p>
              </Card>
            ))}
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-i23-gris-fonce">{t("initialisation.prioritesTitle")}</h2>
            <p className="text-sm text-i23-gris-fonce/70">{t("initialisation.prioritesDesc")}</p>
            <div className="space-y-3">
              {niveauxMaslow.map((niveau) => {
                const score = bilanQuestions
                  .filter((q) => q.niveau === niveau.id)
                  .reduce((acc, q) => acc + (bilanReponses[q.id] || 0), 0) /
                  bilanQuestions.filter((q) => q.niveau === niveau.id).length;
                const selected = priorites.includes(niveau.id);
                return (
                  <button
                    key={niveau.id}
                    onClick={() => togglePriorite(niveau.id)}
                    className={`w-full text-left p-4 rounded-lg border-2 transition-colors ${
                      selected
                        ? "border-i23-turquoise bg-i23-turquoise/5"
                        : "border-i23-gris-pale hover:border-i23-turquoise/50"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-i23-gris-fonce">{niveau.nom}</p>
                        <p className="text-xs text-i23-gris-fonce/60 mt-1">{niveau.description}</p>
                      </div>
                      <div className="text-right">
                        {score > 0 && (
                          <p className="text-sm font-semibold text-i23-gris-fonce">{score.toFixed(1)}/5</p>
                        )}
                        {selected && <span className="text-i23-turquoise text-sm">{t("initialisation.selected")}</span>}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-i23-gris-fonce">{t("initialisation.besoinsTitle")}</h2>
            <p className="text-sm text-i23-gris-fonce/70">{t("initialisation.besoinsDesc")}</p>
            {priorites.map((niveauId) => {
              const niveau = niveauxMaslow.find((n) => n.id === niveauId);
              const thematiques = thematiquesParNiveau[niveauId];
              if (!niveau) return null;
              return (
                <div key={niveauId}>
                  <h3 className={`text-sm font-semibold text-i23-gris-fonce mb-3`}>{niveau.nom}</h3>
                  <div className="space-y-2">
                    {thematiques.map((th) => (
                      <button
                        key={th.id}
                        onClick={() => toggleBesoin(th.id)}
                        className={`w-full text-left px-4 py-3 rounded-lg border-2 transition-colors ${
                          besoins.includes(th.id)
                            ? "border-i23-jaune bg-i23-jaune/5"
                            : "border-i23-gris-pale hover:border-i23-jaune/50"
                        }`}
                      >
                        <span className="text-sm text-i23-gris-fonce">{th.nom}</span>
                      </button>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        <div className="flex justify-between mt-8">
          {step > 0 ? (
            <Button variant="ghost" onClick={() => setStep(step - 1)}>{t("previous")}</Button>
          ) : (
            <div />
          )}
          {step < TOTAL_STEPS - 1 ? (
            <Button onClick={() => setStep(step + 1)} disabled={!canContinue()}>{t("next")}</Button>
          ) : (
            <Button onClick={handleSubmit} disabled={loading || !canContinue()}>
              {loading ? t("submitting") : t("initialisation.finish")}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
