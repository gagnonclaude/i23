"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";

type MFAStep = "idle" | "enroll" | "verify" | "enabled" | "disable-confirm";

interface MFASetupProps {
  isEnabled: boolean;
}

export function MFASetup({ isEnabled }: MFASetupProps) {
  const [step, setStep] = useState<MFAStep>(isEnabled ? "enabled" : "idle");
  const [qrCode, setQrCode] = useState<string>("");
  const [secret, setSecret] = useState<string>("");
  const [factorId, setFactorId] = useState<string>("");
  const [code, setCode] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleEnroll = async () => {
    setLoading(true);
    setError(null);
    const supabase = createClient();

    const { data, error } = await supabase.auth.mfa.enroll({
      factorType: "totp",
      friendlyName: "i23 Authenticator",
    });

    if (error || !data) {
      setError("Impossible d'activer le 2FA. Réessaie.");
      setLoading(false);
      return;
    }

    setQrCode(data.totp.qr_code);
    setSecret(data.totp.secret);
    setFactorId(data.id);
    setStep("enroll");
    setLoading(false);
  };

  const handleVerify = async () => {
    if (code.length !== 6) {
      setError("Le code doit avoir 6 chiffres.");
      return;
    }
    setLoading(true);
    setError(null);
    const supabase = createClient();

    const challengeRes = await supabase.auth.mfa.challenge({ factorId });
    if (challengeRes.error || !challengeRes.data) {
      setError("Erreur lors du défi 2FA.");
      setLoading(false);
      return;
    }

    const { error } = await supabase.auth.mfa.verify({
      factorId,
      challengeId: challengeRes.data.id,
      code,
    });

    if (error) {
      setError("Code incorrect. Vérifie ton app et réessaie.");
      setLoading(false);
      return;
    }

    setStep("enabled");
    setLoading(false);
  };

  const handleDisable = async () => {
    setLoading(true);
    setError(null);
    const supabase = createClient();

    const { data: factors } = await supabase.auth.mfa.listFactors();
    const totp = factors?.totp?.[0];

    if (!totp) {
      setStep("idle");
      setLoading(false);
      return;
    }

    const { error } = await supabase.auth.mfa.unenroll({ factorId: totp.id });
    if (error) {
      setError("Impossible de désactiver le 2FA.");
      setLoading(false);
      return;
    }

    setStep("idle");
    setCode("");
    setLoading(false);
  };

  return (
    <Card padding="lg">
      <h3 className="text-base font-semibold text-i23-gris-fonce mb-1">
        Authentification à deux facteurs
      </h3>
      <p className="text-sm text-i23-gris-fonce/70 mb-4">
        Ajoute une couche de sécurité à ton compte. Chaque connexion demande un code de ton téléphone.
      </p>

      {error && (
        <p className="text-sm text-red-600 mb-4">{error}</p>
      )}

      {step === "idle" && (
        <Button onClick={handleEnroll} disabled={loading}>
          {loading ? "Chargement..." : "Activer le 2FA"}
        </Button>
      )}

      {step === "enroll" && (
        <div className="space-y-4">
          <div>
            <p className="text-sm text-i23-gris-fonce mb-2">
              1. Ouvre ton app d&apos;authentification (Google Authenticator, 1Password, etc.)
            </p>
            <p className="text-sm text-i23-gris-fonce mb-3">
              2. Scan ce code QR :
            </p>
            <div className="flex justify-center mb-3">
              <img src={qrCode} alt="QR Code 2FA" className="w-40 h-40 border rounded-lg" />
            </div>
            <p className="text-xs text-i23-gris-fonce/60 text-center mb-4">
              Ou entre manuellement : <span className="font-mono font-semibold">{secret}</span>
            </p>
          </div>
          <div>
            <p className="text-sm text-i23-gris-fonce mb-2">
              3. Entre le code à 6 chiffres pour confirmer :
            </p>
            <input
              type="text"
              inputMode="numeric"
              maxLength={6}
              value={code}
              onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
              placeholder="000000"
              className="w-full px-4 py-2.5 border border-i23-gris-pale rounded-lg text-sm text-center tracking-widest focus:outline-none focus:ring-2 focus:ring-i23-turquoise"
            />
          </div>
          <div className="flex gap-3">
            <Button onClick={handleVerify} disabled={loading || code.length !== 6}>
              {loading ? "Vérification..." : "Confirmer"}
            </Button>
            <Button variant="ghost" onClick={() => setStep("idle")} disabled={loading}>
              Annuler
            </Button>
          </div>
        </div>
      )}

      {step === "enabled" && (
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-sm text-green-700 font-medium">
            <span>✓</span>
            <span>2FA activé sur ton compte</span>
          </div>
          {step === "enabled" && (
            <Button
              variant="ghost"
              onClick={() => setStep("disable-confirm")}
              disabled={loading}
            >
              Désactiver le 2FA
            </Button>
          )}
        </div>
      )}

      {step === "disable-confirm" && (
        <div className="space-y-3">
          <p className="text-sm text-i23-gris-fonce">
            Es-tu certain de vouloir désactiver le 2FA ? Ton compte sera moins sécurisé.
          </p>
          <div className="flex gap-3">
            <Button onClick={handleDisable} disabled={loading}>
              {loading ? "Désactivation..." : "Oui, désactiver"}
            </Button>
            <Button variant="ghost" onClick={() => setStep("enabled")} disabled={loading}>
              Annuler
            </Button>
          </div>
        </div>
      )}
    </Card>
  );
}
