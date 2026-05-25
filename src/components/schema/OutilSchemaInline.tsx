"use client";

import { useState } from "react";
import { getComposantesSuggestions } from "@/lib/schema/composantes";
import { Button } from "@/components/ui/Button";
import { Textarea } from "@/components/ui/Textarea";

interface OutilSchemaInlineProps {
  etape: number;
  nomEtape: string;
  menace: string;
  thematique?: string;
  onOpportuniteChoisie: (opportunite: string) => void;
  onFermer: () => void;
}

export function OutilSchemaInline({
  etape,
  nomEtape,
  menace,
  thematique,
  onOpportuniteChoisie,
  onFermer,
}: OutilSchemaInlineProps) {
  const [step, setStep] = useState<"details" | "opportunite" | "plan">("details");
  const [details, setDetails] = useState("");
  const [opportunite, setOpportunite] = useState("");
  const [plan, setPlan] = useState("");

  const suggestions = getComposantesSuggestions(etape, thematique);

  const handleValider = () => {
    if (opportunite.trim().length >= 5) {
      onOpportuniteChoisie(opportunite.trim());
      onFermer();
    }
  };

  return (
    <div className="bg-white border border-i23-turquoise/30 rounded-xl p-4 mt-2 shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-i23-turquoise uppercase">
            Outil i+ — Étape {etape} : {nomEtape}
          </span>
        </div>
        <button
          onClick={onFermer}
          className="text-i23-gris-fonce/40 hover:text-i23-gris-fonce text-xs"
        >
          Fermer
        </button>
      </div>

      {/* Menace active */}
      <div className="bg-red-50 border border-red-200 rounded-lg px-3 py-2 mb-4">
        <p className="text-xs text-red-500 font-semibold uppercase mb-0.5">Menace identifiée</p>
        <p className="text-sm text-red-800">{menace}</p>
      </div>

      {/* Étape 1 : Comprendre la menace */}
      {step === "details" && (
        <div className="space-y-3">
          <p className="text-sm font-medium text-i23-gris-fonce">
            Qu&apos;est-ce que cette menace t&apos;empêche de faire ou de vivre?
          </p>
          <Textarea
            value={details}
            onChange={(e) => setDetails(e.target.value)}
            placeholder="Décris comment cette menace se manifeste dans ton expérience..."
            rows={3}
          />
          <div className="flex justify-end">
            <Button
              onClick={() => setStep("opportunite")}
              disabled={details.length < 10}
            >
              Trouver l&apos;opportunité
            </Button>
          </div>
        </div>
      )}

      {/* Étape 2 : Trouver l'opportunité */}
      {step === "opportunite" && (
        <div className="space-y-3">
          <p className="text-sm font-medium text-i23-gris-fonce">
            Quelle opportunité veux-tu activer à cette étape?
          </p>

          {/* Suggestions */}
          {suggestions.opportunites.length > 0 && (
            <div>
              <p className="text-xs text-i23-gris-fonce/50 uppercase font-semibold mb-1.5">Suggestions</p>
              <div className="space-y-1.5 max-h-36 overflow-y-auto">
                {suggestions.opportunites.slice(0, 8).map((o, i) => (
                  <button
                    key={i}
                    onClick={() => setOpportunite(o)}
                    className={`w-full text-left text-xs px-3 py-2 rounded-lg border transition-all ${
                      opportunite === o
                        ? "border-i23-turquoise bg-i23-turquoise/5 text-i23-gris-fonce font-medium"
                        : "border-i23-gris-pale text-i23-gris-fonce/60 hover:border-i23-turquoise/30"
                    }`}
                  >
                    {o}
                  </button>
                ))}
              </div>
            </div>
          )}

          <Textarea
            value={opportunite}
            onChange={(e) => setOpportunite(e.target.value)}
            placeholder="Ou écris ta propre opportunité..."
            rows={2}
          />

          <div className="flex justify-between">
            <button
              onClick={() => setStep("details")}
              className="text-xs text-i23-gris-fonce/50 hover:text-i23-gris-fonce"
            >
              Retour
            </button>
            <Button
              onClick={handleValider}
              disabled={opportunite.trim().length < 5}
            >
              Activer cette opportunité
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
