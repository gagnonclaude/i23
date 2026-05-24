"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/routing";
import { methodeConfig } from "@/lib/config";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Textarea } from "@/components/ui/Textarea";
import { useLocalDraft } from "@/hooks/useLocalDraft";
import { useConsentement } from "@/hooks/useConsentement";

const STEPS = [
  "declencheurs",
  "selection",
  "histoire",
  "decortication",
  "menaces",
  "transformation",
  "opportunites",
  "nouveauSchema",
  "preparation",
] as const;

const etapesInitial = Object.fromEntries(methodeConfig.etapes.map((e) => [e.numero, ""]));

export function SchemaForm() {
  const t = useTranslations("schema");
  const router = useRouter();
  const { consentement } = useConsentement();
  const modeSession = consentement.mode_sauvegarde === "session";
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Auto-save de toute la progression dans localStorage
  const [step, setStep, clearStep] = useLocalDraft("schema-step", 0);
  const [thematique, setThematique, clearThematique] = useLocalDraft("schema-thematique", "");
  const [declencheur, setDeclencheur, clearDeclencheur] = useLocalDraft("schema-declencheur", "");
  const [histoire, setHistoire, clearHistoire] = useLocalDraft("schema-histoire", "");
  const [niveau, setNiveau, clearNiveau] = useLocalDraft<"i" | "2" | "3">("schema-niveau", "i");
  const [etapes, setEtapes, clearEtapes] = useLocalDraft<Record<number, string>>("schema-etapes", etapesInitial);
  const [menacesSelection, setMenacesSelection, clearMenaces] = useLocalDraft<number[]>("schema-menaces", []);
  const [opportunitesSelection, setOpportunitesSelection, clearOpportunites] = useLocalDraft<number[]>("schema-opportunites", []);
  const [nouveauSchema, setNouveauSchema, clearNouveauSchema] = useLocalDraft<Record<number, string>>("schema-nouveau", etapesInitial);
  const [nouvelleHistoire, setNouvelleHistoire, clearNouvelleHistoire] = useLocalDraft("schema-nouvelle-histoire", "");

  const clearAll = () => {
    clearStep();
    clearThematique();
    clearDeclencheur();
    clearHistoire();
    clearNiveau();
    clearEtapes();
    clearMenaces();
    clearOpportunites();
    clearNouveauSchema();
    clearNouvelleHistoire();
  };

  const toggleMenace = (idx: number) => {
    setMenacesSelection((prev) =>
      prev.includes(idx) ? prev.filter((i) => i !== idx) : [...prev, idx]
    );
  };

  const toggleOpportunite = (idx: number) => {
    setOpportunitesSelection((prev) =>
      prev.includes(idx) ? prev.filter((i) => i !== idx) : [...prev, idx]
    );
  };

  const canContinue = () => {
    if (step === 0) return thematique.length >= 2;
    if (step === 1) return declencheur.length >= 3;
    if (step === 2) return histoire.length >= 20;
    if (step === 3) return Object.values(etapes).some((v) => v.length >= 3);
    if (step === 4) return menacesSelection.length > 0;
    return true;
  };

  const handleSubmit = async () => {
    // Mode session : pas de sauvegarde en BD, on propose l'impression
    if (modeSession) {
      window.print();
      clearAll();
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/schemas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          thematique,
          declencheur,
          etapes: { histoire, niveau, etapes, menaces: menacesSelection, opportunites: opportunitesSelection, nouveauSchema, nouvelleHistoire },
          niveau,
        }),
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

    clearAll();
    router.push("/dashboard");
  };

  const thematiques = [
    { key: "travail", icon: "💼" },
    { key: "relations", icon: "🤝" },
    { key: "sante", icon: "🏃" },
    { key: "finances", icon: "💰" },
    { key: "identite", icon: "🪞" },
    { key: "famille", icon: "👨‍👩‍👧" },
    { key: "creatvite", icon: "🎨" },
    { key: "spirituel", icon: "🧘" },
  ] as const;

  const getComposantesFromDecortication = (): { numero: number; nom: string; texte: string }[] => {
    return methodeConfig.etapes
      .map((e) => ({
        numero: e.numero,
        nom: e.nom,
        texte: etapes[e.numero] || "",
      }))
      .filter((e) => e.texte.length >= 3);
  };

  const getMenaces = (): { numero: number; nom: string; texte: string }[] => {
    return getComposantesFromDecortication();
  };

  const getOpportunites = (): string[] => {
    const etape2 = methodeConfig.etapes[1] as any;
    if (step === 6 && etape2?.opportunites) return etape2.opportunites;
    return [];
  };

  const hasDraft = thematique.length > 0 || declencheur.length > 0 || histoire.length > 0;

  return (
    <div className="max-w-3xl mx-auto">
      <div className="flex items-center justify-between mb-2">
        <div className="flex gap-1 flex-1">
          {STEPS.map((_, i) => (
            <div
              key={i}
              className={`h-1 flex-1 rounded-full transition-colors ${
                i <= step ? "bg-i23-turquoise" : "bg-i23-gris-pale"
              }`}
            />
          ))}
        </div>
      </div>

      <div className="flex items-center justify-between mb-6">
        <p className="text-xs text-i23-gris-fonce/50">
          {t("step")} {step + 1}/9
        </p>
        {hasDraft && (
          <p className="text-xs text-i23-turquoise/70">{t("draftSaved")}</p>
        )}
      </div>

      {step === 0 && (
        <div className="space-y-6">
          <h2 className="text-xl font-bold text-i23-gris-fonce">{t("declencheurs.title")}</h2>
          <p className="text-sm text-i23-gris-fonce/70">{t("declencheurs.description")}</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {thematiques.map(({ key, icon }) => (
              <button
                key={key}
                onClick={() => setThematique(t(`thematiques.${key}`))}
                className={`p-4 rounded-xl border-2 text-center transition-all ${
                  thematique === t(`thematiques.${key}`)
                    ? "border-i23-turquoise bg-i23-turquoise/5"
                    : "border-i23-gris-pale hover:border-i23-turquoise/50"
                }`}
              >
                <span className="text-2xl block mb-1">{icon}</span>
                <span className="text-xs font-medium text-i23-gris-fonce">{t(`thematiques.${key}`)}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {step === 1 && (
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-i23-gris-fonce">{t("selection.title")}</h2>
          <p className="text-sm text-i23-gris-fonce/70">{t("selection.description")}</p>
          <div className="space-y-3 mb-4">
            <p className="text-xs font-semibold text-i23-gris-fonce/50 uppercase">{t("niveauLabel")}</p>
            <div className="flex gap-3">
              {methodeConfig.niveaux.map((n) => (
                <button
                  key={n.id}
                  onClick={() => setNiveau(n.id as "i" | "2" | "3")}
                  className={`flex-1 px-4 py-3 rounded-xl border-2 text-center transition-all ${
                    niveau === n.id
                      ? "border-i23-turquoise bg-i23-turquoise/5"
                      : "border-i23-gris-pale hover:border-i23-turquoise/50"
                  }`}
                >
                  <span className="font-bold text-i23-gris-fonce">{n.id === "i" ? "i" : n.id}</span>
                  <span className="text-xs block text-i23-gris-fonce/70">{n.nom}</span>
                </button>
              ))}
            </div>
          </div>
          <Textarea
            value={declencheur}
            onChange={(e) => setDeclencheur(e.target.value)}
            placeholder={t("selection.placeholder")}
            rows={3}
          />
        </div>
      )}

      {step === 2 && (
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-i23-gris-fonce">{t("histoire.title")}</h2>
          <p className="text-sm text-i23-gris-fonce/70">{t("histoire.description")}</p>
          <Textarea
            value={histoire}
            onChange={(e) => setHistoire(e.target.value)}
            placeholder={t("histoire.placeholder")}
            rows={6}
          />
        </div>
      )}

      {step === 3 && (
        <div className="space-y-6">
          <h2 className="text-xl font-bold text-i23-gris-fonce">{t("decortication.title")}</h2>
          <p className="text-sm text-i23-gris-fonce/70">{t("decortication.description")}</p>
          {methodeConfig.etapes.map((etape) => (
            <div key={etape.numero} className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="w-7 h-7 bg-i23-turquoise rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                  {etape.numero}
                </span>
                <label className="text-sm font-medium text-i23-gris-fonce">
                  {etape.nom}
                </label>
              </div>
              <Textarea
                value={etapes[etape.numero] || ""}
                onChange={(e) => setEtapes((prev) => ({ ...prev, [etape.numero]: e.target.value }))}
                placeholder={etape.description}
                rows={2}
              />
            </div>
          ))}
        </div>
      )}

      {step === 4 && (
        <div className="space-y-6">
          <h2 className="text-xl font-bold text-i23-gris-fonce">{t("menaces.title")}</h2>
          <p className="text-sm text-i23-gris-fonce/70">{t("menaces.description")}</p>
          <div className="space-y-3 max-h-[28rem] overflow-y-auto">
            {getMenaces().map((comp) => (
              <button
                key={comp.numero}
                onClick={() => toggleMenace(comp.numero)}
                className={`w-full text-left px-4 py-3 rounded-lg border-2 transition-all ${
                  menacesSelection.includes(comp.numero)
                    ? "border-red-400 bg-red-50"
                    : "border-i23-gris-pale hover:border-red-200"
                }`}
              >
                <div className="flex items-center gap-2 mb-1">
                  <img src={`/images/${comp.numero}.png`} alt={comp.nom} className="w-5 h-5" />
                  <span className={`text-xs font-semibold ${menacesSelection.includes(comp.numero) ? "text-red-700" : "text-i23-gris-fonce/50"}`}>
                    {comp.numero}. {comp.nom}
                  </span>
                </div>
                <p className={`text-sm ${menacesSelection.includes(comp.numero) ? "text-red-800" : "text-i23-gris-fonce/70"}`}>
                  {comp.texte}
                </p>
              </button>
            ))}
          </div>
        </div>
      )}

      {step === 5 && (
        <div className="space-y-4 text-center">
          <h2 className="text-xl font-bold text-i23-gris-fonce">{t("transformation.title")}</h2>
          <p className="text-sm text-i23-gris-fonce/70">{t("transformation.description")}</p>
          <div className="flex flex-wrap gap-2 justify-center">
            {menacesSelection.map((num) => {
              const comp = getComposantesFromDecortication().find((c) => c.numero === num);
              return comp ? (
                <span key={num} className="bg-red-100 text-red-700 text-xs px-3 py-1 rounded-full">
                  {comp.numero}. {comp.nom}
                </span>
              ) : null;
            })}
          </div>
          <p className="text-sm text-i23-turquoise font-semibold mt-4">{t("transformation.hint")}</p>
        </div>
      )}

      {step === 6 && (
        <div className="space-y-6">
          <h2 className="text-xl font-bold text-i23-gris-fonce">{t("opportunites.title")}</h2>
          <p className="text-sm text-i23-gris-fonce/70">{t("opportunites.description")}</p>
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {getOpportunites().map((o, i) => (
              <button
                key={i}
                onClick={() => toggleOpportunite(i)}
                className={`w-full text-left px-4 py-3 rounded-lg border-2 text-sm transition-all ${
                  opportunitesSelection.includes(i)
                    ? "border-i23-turquoise bg-i23-turquoise/5 text-i23-gris-fonce"
                    : "border-i23-gris-pale text-i23-gris-fonce/70 hover:border-i23-turquoise/30"
                }`}
              >
                {o}
              </button>
            ))}
          </div>
        </div>
      )}

      {step === 7 && (
        <div className="space-y-6">
          <h2 className="text-xl font-bold text-i23-gris-fonce">{t("nouveauSchema.title")}</h2>
          <p className="text-sm text-i23-gris-fonce/70">{t("nouveauSchema.description")}</p>
          {methodeConfig.etapes.map((etape) => (
            <div key={etape.numero} className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="w-7 h-7 bg-i23-turquoise rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                  {etape.numero}
                </span>
                <label className="text-sm font-medium text-i23-gris-fonce">
                  {etape.nom}
                </label>
              </div>
              <Textarea
                value={nouveauSchema[etape.numero] || ""}
                onChange={(e) => setNouveauSchema((prev) => ({ ...prev, [etape.numero]: e.target.value }))}
                placeholder={t("nouveauSchema.placeholder")}
                rows={2}
              />
            </div>
          ))}
        </div>
      )}

      {step === 8 && (
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-i23-gris-fonce">{t("preparation.title")}</h2>
          <p className="text-sm text-i23-gris-fonce/70">{t("preparation.description")}</p>
          <Textarea
            value={nouvelleHistoire}
            onChange={(e) => setNouvelleHistoire(e.target.value)}
            placeholder={t("preparation.placeholder")}
            rows={6}
          />
        </div>
      )}

      {error && (
        <p className="text-sm text-red-500 mt-4">{error}</p>
      )}

      <div className="flex justify-between mt-8">
        {step > 0 ? (
          <Button variant="ghost" onClick={() => setStep(step - 1)}>{t("previous")}</Button>
        ) : (
          <div />
        )}
        {step < STEPS.length - 1 ? (
          <Button onClick={() => setStep(step + 1)} disabled={!canContinue()}>{t("next")}</Button>
        ) : (
          <Button onClick={handleSubmit} loading={loading}>
            {modeSession ? t("imprimer") : t("submit")}
          </Button>
        )}
      </div>
    </div>
  );
}
