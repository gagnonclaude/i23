"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "@/i18n/routing";
import { methodeConfig } from "@/lib/config";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Textarea } from "@/components/ui/Textarea";

interface OutilFormProps {
  etapeNumero: number;
}

export function OutilForm({ etapeNumero }: OutilFormProps) {
  const t = useTranslations("outils");
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [menace, setMenace] = useState("");
  const [menaceDetails, setMenaceDetails] = useState("");
  const [opportunite, setOpportunite] = useState("");
  const [planAction, setPlanAction] = useState("");

  const etape = methodeConfig.etapes.find((e) => e.numero === etapeNumero);
  if (!etape) return null;

  const getMenacesRef = (): string[] => {
    const e = etape as any;
    if (e?.menaces) return e.menaces;
    if (e?.composantesParNiveau) {
      const all: string[] = [];
      Object.values(e.composantesParNiveau).forEach((n: any) => {
        if (n?.menaces) all.push(...n.menaces);
      });
      return all;
    }
    return [];
  };

  const getOpportunitesRef = (): string[] => {
    const e = etape as any;
    if (e?.opportunites) return e.opportunites;
    if (e?.composantesParNiveau) {
      const all: string[] = [];
      Object.values(e.composantesParNiveau).forEach((n: any) => {
        if (n?.opportunites) all.push(...n.opportunites);
      });
      return all;
    }
    return [];
  };

  const menacesRef = getMenacesRef();
  const opportunitesRef = getOpportunitesRef();

  const canContinue = () => {
    if (step === 0) return menace.length >= 5;
    if (step === 1) return menaceDetails.length >= 10;
    if (step === 2) return opportunite.length >= 5;
    if (step === 3) return planAction.length >= 10;
    return true;
  };

  const handleSubmit = async () => {
    setLoading(true);
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (user) {
      await supabase.from("outils_resultats").insert({
        user_id: user.id,
        outil_type: `etape_${etapeNumero}`,
        etape_numero: etapeNumero,
        reponses: { menace, menaceDetails, opportunite, planAction },
        menaces: [menace],
        opportunites: [opportunite],
      });
    }

    router.push("/outils");
    router.refresh();
  };

  return (
    <div className="py-20">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-4 mb-8">
          <img src={`/images/${etapeNumero}.png`} alt={etape.nom} className="w-10 h-10" />
          <div>
            <h1 className="text-xl font-bold text-i23-gris-fonce">
              {t("outilEtape")} {etapeNumero} : {etape.nom}
            </h1>
            <p className="text-sm text-i23-gris-fonce/70">{etape.description}</p>
          </div>
        </div>

        <div className="flex gap-1 mb-8">
          {[0, 1, 2, 3].map((i) => (
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
            <h2 className="text-lg font-bold text-i23-gris-fonce">{t("identifyMenace")}</h2>
            <p className="text-sm text-i23-gris-fonce/70">{t("identifyMenaceDesc")}</p>
            {menacesRef.length > 0 && (
              <div className="space-y-2 mb-4">
                <p className="text-xs font-semibold text-i23-gris-fonce/50 uppercase">{t("suggestions")}</p>
                {menacesRef.slice(0, 8).map((m, i) => (
                  <button
                    key={i}
                    onClick={() => setMenace(m)}
                    className={`w-full text-left px-4 py-2.5 rounded-lg border-2 text-sm transition-all ${
                      menace === m
                        ? "border-red-400 bg-red-50 text-red-800"
                        : "border-i23-gris-pale text-i23-gris-fonce/70 hover:border-red-200"
                    }`}
                  >
                    {m}
                  </button>
                ))}
              </div>
            )}
            <Textarea
              value={menace}
              onChange={(e) => setMenace(e.target.value)}
              placeholder={t("menacePlaceholder")}
              rows={3}
            />
          </div>
        )}

        {step === 1 && (
          <div className="space-y-4">
            <h2 className="text-lg font-bold text-i23-gris-fonce">{t("describeMenace")}</h2>
            <p className="text-sm text-i23-gris-fonce/70">{t("describeMenaceDesc")}</p>
            <Card padding="sm" className="bg-red-50 border-red-200">
              <p className="text-sm text-red-800 font-medium">{menace}</p>
            </Card>
            <Textarea
              value={menaceDetails}
              onChange={(e) => setMenaceDetails(e.target.value)}
              placeholder={t("describeMenacePlaceholder")}
              rows={4}
            />
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4">
            <h2 className="text-lg font-bold text-i23-turquoise">{t("chooseOpportunite")}</h2>
            <p className="text-sm text-i23-gris-fonce/70">{t("chooseOpportuniteDesc")}</p>
            <Card padding="sm" className="bg-red-50 border-red-200 mb-4">
              <p className="text-xs text-i23-gris-fonce/50 uppercase mb-1">{t("menaceLabel")}</p>
              <p className="text-sm text-red-800">{menace}</p>
            </Card>
            {opportunitesRef.length > 0 && (
              <div className="space-y-2 mb-4">
                <p className="text-xs font-semibold text-i23-gris-fonce/50 uppercase">{t("suggestions")}</p>
                {opportunitesRef.slice(0, 8).map((o, i) => (
                  <button
                    key={i}
                    onClick={() => setOpportunite(o)}
                    className={`w-full text-left px-4 py-2.5 rounded-lg border-2 text-sm transition-all ${
                      opportunite === o
                        ? "border-i23-turquoise bg-i23-turquoise/5 text-i23-gris-fonce"
                        : "border-i23-gris-pale text-i23-gris-fonce/70 hover:border-i23-turquoise/30"
                    }`}
                  >
                    {o}
                  </button>
                ))}
              </div>
            )}
            <Textarea
              value={opportunite}
              onChange={(e) => setOpportunite(e.target.value)}
              placeholder={t("opportunitePlaceholder")}
              rows={3}
            />
          </div>
        )}

        {step === 3 && (
          <div className="space-y-4">
            <h2 className="text-lg font-bold text-i23-gris-fonce">{t("actionPlan")}</h2>
            <p className="text-sm text-i23-gris-fonce/70">{t("actionPlanDesc")}</p>
            <div className="grid grid-cols-2 gap-4 mb-4">
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
              value={planAction}
              onChange={(e) => setPlanAction(e.target.value)}
              placeholder={t("actionPlanPlaceholder")}
              rows={4}
            />
          </div>
        )}

        <div className="flex justify-between mt-8">
          {step > 0 ? (
            <Button variant="ghost" onClick={() => setStep(step - 1)}>{t("previous")}</Button>
          ) : (
            <div />
          )}
          {step < 3 ? (
            <Button onClick={() => setStep(step + 1)} disabled={!canContinue()}>{t("next")}</Button>
          ) : (
            <Button onClick={handleSubmit} loading={loading}>{t("submit")}</Button>
          )}
        </div>
      </div>
    </div>
  );
}
