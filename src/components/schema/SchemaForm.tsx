"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/routing";
import { methodeConfig } from "@/lib/config";
import { Button } from "@/components/ui/Button";
import { Textarea } from "@/components/ui/Textarea";
import { useLocalDraft } from "@/hooks/useLocalDraft";
import { useConsentement } from "@/hooks/useConsentement";
import { getDeclencheursParThematique } from "@/lib/schema/declencheurs";
import { getComposantesSuggestions } from "@/lib/schema/composantes";

interface SchemaFormProps {
  thematique?: string;
}

type Polarite = "menace" | "opportunite" | "";

interface LigneTableau {
  etape: number;
  nom: string;
  composante: string;
  polarite: Polarite;
  opportunite: string;
  outilActif: boolean;
}

const etapesInitiales = (): LigneTableau[] =>
  methodeConfig.etapes.map((e) => ({
    etape: e.numero,
    nom: e.nom,
    composante: "",
    polarite: "",
    opportunite: "",
    outilActif: false,
  }));

export function SchemaForm({ thematique = "energie" }: SchemaFormProps) {
  const t = useTranslations("schema");
  const router = useRouter();
  const { consentement } = useConsentement();
  const modeSession = consentement.mode_sauvegarde === "session";

  // Zone 1 -- Déclencheur
  const [declencheurId, setDeclencheurId, clearDeclencheurId] = useLocalDraft<string | null>("schema-declencheur-id", null);
  const [declencheurTexte, setDeclencheurTexte, clearDeclencheurTexte] = useLocalDraft("schema-declencheur-texte", "");
  const [nouveauDeclencheur, setNouveauDeclencheur] = useState("");
  const [declencheursSauvegardes, setDeclencheursSauvegardes] = useState<{ id: string; texte: string }[]>([]);
  const [niveau, setNiveau, clearNiveau] = useLocalDraft<"i" | "2" | "3">("schema-niveau", "i");

  // Zone 2 -- Histoire
  const [histoire, setHistoire, clearHistoire] = useLocalDraft("schema-histoire", "");

  // Zone 3 -- Tableau
  const [tableau, setTableau, clearTableau] = useLocalDraft<LigneTableau[]>("schema-tableau", etapesInitiales());
  const [etapeActive, setEtapeActive] = useState<number | null>(null);

  // États UI
  const [zone, setZone] = useState<1 | 2 | 3>(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const suggestionsDeclencheurs = getDeclencheursParThematique(thematique, niveau);

  // Charger les déclencheurs sauvegardés
  useEffect(() => {
    fetch(`/api/declencheurs?thematique=${thematique}`)
      .then((r) => r.json())
      .then((data) => setDeclencheursSauvegardes(data.declencheurs ?? []))
      .catch(() => {});
  }, [thematique]);

  const ajouterDeclencheur = async () => {
    if (!nouveauDeclencheur.trim()) return;
    const res = await fetch("/api/declencheurs", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ thematique, texte: nouveauDeclencheur.trim() }),
    });
    if (res.ok) {
      const data = await res.json();
      setDeclencheursSauvegardes((prev) => [data.declencheur, ...prev]);
      setDeclencheurId(data.declencheur.id);
      setDeclencheurTexte(data.declencheur.texte);
      setNouveauDeclencheur("");
    }
  };

  const selectionnerDeclencheur = (id: string, texte: string) => {
    setDeclencheurId(id);
    setDeclencheurTexte(texte);
  };

  const mettreAJourLigne = (etape: number, champ: keyof LigneTableau, valeur: string | boolean) => {
    setTableau((prev) =>
      prev.map((l) => (l.etape === etape ? { ...l, [champ]: valeur } : l))
    );
  };

  const clearAll = () => {
    clearDeclencheurId();
    clearDeclencheurTexte();
    clearNiveau();
    clearHistoire();
    clearTableau();
  };

  const handleSubmit = async () => {
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
          declencheur: declencheurTexte,
          niveau,
          etapes: {
            histoire,
            tableau,
            declencheur_id: declencheurId,
          },
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

  const lignesAvecMenaces = tableau.filter((l) => l.polarite === "menace" && l.composante);
  const hasDraft = declencheurTexte.length > 0 || histoire.length > 0;

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold text-i23-gris-fonce">{t("titre")}</h1>
          {hasDraft && <p className="text-xs text-i23-turquoise/70 mt-0.5">{t("draftSaved")}</p>}
        </div>
        <div className="flex gap-2">
          {([1, 2, 3] as const).map((z) => (
            <button
              key={z}
              onClick={() => setZone(z)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                zone === z
                  ? "bg-i23-turquoise text-white"
                  : "bg-i23-gris-pale/50 text-i23-gris-fonce/60 hover:bg-i23-gris-pale"
              }`}
            >
              {z === 1 ? t("zone1") : z === 2 ? t("zone2") : t("zone3")}
            </button>
          ))}
        </div>
      </div>

      {/* Zone 1 -- Déclencheur */}
      {zone === 1 && (
        <div className="space-y-6">
          <div>
            <h2 className="text-base font-semibold text-i23-gris-fonce mb-1">{t("declencheur.title")}</h2>
            <p className="text-sm text-i23-gris-fonce/60">{t("declencheur.description")}</p>
          </div>

          {/* Niveau */}
          <div>
            <p className="text-xs font-semibold text-i23-gris-fonce/50 uppercase mb-2">{t("niveauLabel")}</p>
            <div className="flex gap-2">
              {methodeConfig.niveaux.map((n) => (
                <button
                  key={n.id}
                  onClick={() => setNiveau(n.id as "i" | "2" | "3")}
                  className={`flex-1 px-3 py-2 rounded-lg border-2 text-center transition-all ${
                    niveau === n.id
                      ? "border-i23-turquoise bg-i23-turquoise/5"
                      : "border-i23-gris-pale hover:border-i23-turquoise/50"
                  }`}
                >
                  <span className="font-bold text-i23-gris-fonce text-sm">{n.id}</span>
                  <span className="text-xs block text-i23-gris-fonce/60">{n.nom}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Déclencheurs sauvegardés */}
          {declencheursSauvegardes.length > 0 && (
            <div>
              <p className="text-xs font-semibold text-i23-gris-fonce/50 uppercase mb-2">{t("declencheur.mesDeclencheurs")}</p>
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {declencheursSauvegardes.map((d) => (
                  <button
                    key={d.id}
                    onClick={() => selectionnerDeclencheur(d.id, d.texte)}
                    className={`w-full text-left px-4 py-2.5 rounded-lg border-2 text-sm transition-all ${
                      declencheurId === d.id
                        ? "border-i23-turquoise bg-i23-turquoise/5 text-i23-gris-fonce font-medium"
                        : "border-i23-gris-pale text-i23-gris-fonce/70 hover:border-i23-turquoise/30"
                    }`}
                  >
                    {d.texte}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Suggestions IA */}
          <div>
            <p className="text-xs font-semibold text-i23-gris-fonce/50 uppercase mb-2">{t("declencheur.suggestions")}</p>
            <div className="space-y-1.5 max-h-48 overflow-y-auto">
              {suggestionsDeclencheurs.slice(0, 10).map((s, i) => (
                <button
                  key={i}
                  onClick={() => {
                    setDeclencheurTexte(s.texte);
                    setDeclencheurId(null);
                  }}
                  className={`w-full text-left px-3 py-2 rounded-lg border text-sm transition-all ${
                    declencheurTexte === s.texte
                      ? "border-i23-turquoise bg-i23-turquoise/5 text-i23-gris-fonce"
                      : "border-i23-gris-pale/50 text-i23-gris-fonce/60 hover:border-i23-turquoise/30"
                  }`}
                >
                  {s.texte}
                </button>
              ))}
            </div>
          </div>

          {/* Nouveau déclencheur */}
          <div>
            <p className="text-xs font-semibold text-i23-gris-fonce/50 uppercase mb-2">{t("declencheur.nouveau")}</p>
            <div className="flex gap-2">
              <input
                type="text"
                value={nouveauDeclencheur}
                onChange={(e) => setNouveauDeclencheur(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && ajouterDeclencheur()}
                placeholder={t("declencheur.placeholder")}
                className="flex-1 px-4 py-2.5 border border-i23-gris-pale rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-i23-turquoise"
              />
              <Button onClick={ajouterDeclencheur} disabled={!nouveauDeclencheur.trim()}>
                {t("declencheur.ajouter")}
              </Button>
            </div>
          </div>

          <div className="flex justify-end">
            <Button onClick={() => setZone(2)} disabled={!declencheurTexte}>
              {t("next")}
            </Button>
          </div>
        </div>
      )}

      {/* Zone 2 -- Histoire */}
      {zone === 2 && (
        <div className="space-y-6">
          <div>
            <h2 className="text-base font-semibold text-i23-gris-fonce mb-1">{t("histoire.title")}</h2>
            <p className="text-sm text-i23-gris-fonce/60">{t("histoire.description")}</p>
          </div>

          {/* Déclencheur actif */}
          <div className="bg-i23-turquoise/5 border border-i23-turquoise/20 rounded-xl px-4 py-3">
            <p className="text-xs font-semibold text-i23-turquoise mb-1">{t("declencheur.actif")}</p>
            <p className="text-sm text-i23-gris-fonce font-medium">{declencheurTexte}</p>
          </div>

          <Textarea
            value={histoire}
            onChange={(e) => setHistoire(e.target.value)}
            placeholder={t("histoire.placeholder")}
            rows={8}
          />

          <div className="flex justify-between">
            <Button variant="ghost" onClick={() => setZone(1)}>{t("previous")}</Button>
            <Button onClick={() => setZone(3)} disabled={histoire.length < 20}>
              {t("next")}
            </Button>
          </div>
        </div>
      )}

      {/* Zone 3 -- Tableau 8x5 */}
      {zone === 3 && (
        <div className="space-y-6">
          <div>
            <h2 className="text-base font-semibold text-i23-gris-fonce mb-1">{t("tableau.title")}</h2>
            <p className="text-sm text-i23-gris-fonce/60">{t("tableau.description")}</p>
          </div>

          {/* Tableau */}
          <div className="border border-i23-gris-pale rounded-xl overflow-hidden">
            <div className="grid grid-cols-12 bg-i23-gris-pale/30 px-4 py-2 text-xs font-semibold text-i23-gris-fonce/50 uppercase">
              <div className="col-span-2">{t("tableau.etape")}</div>
              <div className="col-span-4">{t("tableau.composante")}</div>
              <div className="col-span-1">{t("tableau.polarite")}</div>
              <div className="col-span-4">{t("tableau.opportunite")}</div>
              <div className="col-span-1">{t("tableau.outil")}</div>
            </div>

            {tableau.map((ligne) => {
              const suggestions = getComposantesSuggestions(ligne.etape, thematique);
              const isActive = etapeActive === ligne.etape;

              return (
                <div key={ligne.etape} className={`border-t border-i23-gris-pale/50 ${isActive ? "bg-i23-turquoise/5" : ""}`}>
                  <div className="grid grid-cols-12 px-4 py-3 gap-2 items-start">
                    {/* Étape */}
                    <div className="col-span-2">
                      <button
                        onClick={() => setEtapeActive(isActive ? null : ligne.etape)}
                        className="flex items-center gap-1.5 group"
                      >
                        <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${
                          ligne.polarite === "opportunite" ? "bg-i23-turquoise text-white" :
                          ligne.polarite === "menace" ? "bg-red-400 text-white" :
                          "bg-i23-gris-pale text-i23-gris-fonce/60"
                        }`}>
                          {ligne.etape}
                        </span>
                        <span className="text-xs font-medium text-i23-gris-fonce group-hover:text-i23-turquoise transition-colors">
                          {ligne.nom}
                        </span>
                      </button>
                    </div>

                    {/* Composante */}
                    <div className="col-span-4">
                      <input
                        type="text"
                        value={ligne.composante}
                        onChange={(e) => mettreAJourLigne(ligne.etape, "composante", e.target.value)}
                        onClick={() => setEtapeActive(ligne.etape)}
                        placeholder={t("tableau.composantePlaceholder")}
                        className="w-full px-2 py-1 border border-i23-gris-pale rounded text-xs focus:outline-none focus:ring-1 focus:ring-i23-turquoise"
                      />
                    </div>

                    {/* Polarité */}
                    <div className="col-span-1 flex gap-1 justify-center">
                      <button
                        onClick={() => mettreAJourLigne(ligne.etape, "polarite", ligne.polarite === "menace" ? "" : "menace")}
                        className={`text-xs px-1.5 py-0.5 rounded font-bold transition-all ${
                          ligne.polarite === "menace" ? "bg-red-100 text-red-600" : "text-i23-gris-fonce/30 hover:text-red-400"
                        }`}
                        title="Menace"
                      >
                        -
                      </button>
                      <button
                        onClick={() => mettreAJourLigne(ligne.etape, "polarite", ligne.polarite === "opportunite" ? "" : "opportunite")}
                        className={`text-xs px-1.5 py-0.5 rounded font-bold transition-all ${
                          ligne.polarite === "opportunite" ? "bg-i23-turquoise/10 text-i23-turquoise" : "text-i23-gris-fonce/30 hover:text-i23-turquoise"
                        }`}
                        title="Opportunité"
                      >
                        +
                      </button>
                    </div>

                    {/* Opportunité trouvée */}
                    <div className="col-span-4">
                      <input
                        type="text"
                        value={ligne.opportunite}
                        onChange={(e) => mettreAJourLigne(ligne.etape, "opportunite", e.target.value)}
                        placeholder={ligne.polarite === "menace" ? t("tableau.opportunitePlaceholder") : ""}
                        disabled={ligne.polarite !== "menace"}
                        className={`w-full px-2 py-1 border rounded text-xs focus:outline-none focus:ring-1 focus:ring-i23-turquoise transition-all ${
                          ligne.polarite === "menace"
                            ? "border-i23-turquoise/30 bg-i23-turquoise/5"
                            : "border-i23-gris-pale/30 bg-i23-gris-pale/10 text-i23-gris-fonce/30"
                        }`}
                      />
                    </div>

                    {/* Outil */}
                    <div className="col-span-1 flex justify-center">
                      {ligne.polarite === "menace" && (
                        <button
                          onClick={() => mettreAJourLigne(ligne.etape, "outilActif", !ligne.outilActif)}
                          className={`text-xs px-2 py-1 rounded transition-all ${
                            ligne.outilActif
                              ? "bg-i23-jaune/20 text-i23-gris-fonce font-semibold"
                              : "text-i23-gris-fonce/40 hover:text-i23-jaune"
                          }`}
                          title={t("tableau.ouvrirOutil")}
                        >
                          🛠
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Suggestions inline quand étape active */}
                  {isActive && (
                    <div className="px-4 pb-3 grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-xs font-semibold text-red-500/70 uppercase mb-1.5">{t("tableau.menacesSuggestions")}</p>
                        <div className="space-y-1 max-h-32 overflow-y-auto">
                          {suggestions.menaces.slice(0, 6).map((m, i) => (
                            <button
                              key={i}
                              onClick={() => {
                                mettreAJourLigne(ligne.etape, "composante", m);
                                mettreAJourLigne(ligne.etape, "polarite", "menace");
                              }}
                              className="w-full text-left text-xs px-2 py-1 rounded border border-red-100 text-i23-gris-fonce/60 hover:bg-red-50 hover:text-red-700 transition-all"
                            >
                              {m}
                            </button>
                          ))}
                        </div>
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-i23-turquoise/70 uppercase mb-1.5">{t("tableau.opportunitesSuggestions")}</p>
                        <div className="space-y-1 max-h-32 overflow-y-auto">
                          {suggestions.opportunites.slice(0, 6).map((o, i) => (
                            <button
                              key={i}
                              onClick={() => {
                                mettreAJourLigne(ligne.etape, "opportunite", o);
                                if (ligne.polarite !== "menace") {
                                  mettreAJourLigne(ligne.etape, "composante", o);
                                  mettreAJourLigne(ligne.etape, "polarite", "opportunite");
                                }
                              }}
                              className="w-full text-left text-xs px-2 py-1 rounded border border-i23-turquoise/20 text-i23-gris-fonce/60 hover:bg-i23-turquoise/5 hover:text-i23-turquoise transition-all"
                            >
                              {o}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Résumé des menaces */}
          {lignesAvecMenaces.length > 0 && (
            <div className="bg-i23-gris-pale/20 rounded-xl p-4">
              <p className="text-xs font-semibold text-i23-gris-fonce/50 uppercase mb-2">
                {t("tableau.menacesIdentifiees")} ({lignesAvecMenaces.length})
              </p>
              <div className="flex flex-wrap gap-2">
                {lignesAvecMenaces.map((l) => (
                  <span key={l.etape} className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded-full">
                    {l.etape}. {l.nom}
                  </span>
                ))}
              </div>
            </div>
          )}

          {error && <p className="text-sm text-red-500">{error}</p>}

          <div className="flex justify-between">
            <Button variant="ghost" onClick={() => setZone(2)}>{t("previous")}</Button>
            <Button
              onClick={handleSubmit}
              loading={loading}
              disabled={lignesAvecMenaces.length === 0 && !modeSession}
            >
              {modeSession ? t("imprimer") : t("submit")}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
