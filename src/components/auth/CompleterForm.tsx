"use client";

import { createClient } from "@/lib/supabase/client";
import { useRouter } from "@/i18n/routing";
import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";

export function CompleterForm({ sessionId, fallbackEmail }: { sessionId: string | null; fallbackEmail: string | null }) {
  const t = useTranslations("auth");
  const router = useRouter();
  const [email, setEmail] = useState(fallbackEmail || "");
  const [prenom, setPrenom] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!sessionId) return;

    const fetchSession = async () => {
      try {
        const res = await fetch(`/api/stripe/session?session_id=${sessionId}`);
        const data = await res.json();
        if (data.email) setEmail(data.email);
      } catch {}
    };

    fetchSession();
  }, [sessionId]);

  const handleComplete = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const supabase = createClient();
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { prenom } },
    });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    if (sessionId) {
      try {
        await fetch("/api/stripe/link-subscription", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ session_id: sessionId }),
        });
      } catch {}
    }

    router.push("/auth/consentement");
    router.refresh();
  };

  return (
    <form onSubmit={handleComplete} className="space-y-5">
      <h2 className="text-xl font-bold text-i23-gris-fonce text-center mb-2">
        {t("completerTitle")}
      </h2>
      <p className="text-sm text-i23-gris-fonce/70 text-center mb-6">
        {t("completerDesc")}
      </p>
      <div>
        <label htmlFor="prenom" className="block text-sm font-medium text-i23-gris-fonce mb-1">
          {t("prenom")}
        </label>
        <input
          id="prenom"
          type="text"
          required
          value={prenom}
          onChange={(e) => setPrenom(e.target.value)}
          className="w-full px-4 py-2.5 border border-i23-gris-pale rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-i23-turquoise"
          placeholder={t("prenomPlaceholder")}
          maxLength={50}
        />
      </div>
      <div>
        <label htmlFor="password" className="block text-sm font-medium text-i23-gris-fonce mb-1">
          {t("password")}
        </label>
        <input
          id="password"
          type="password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full px-4 py-2.5 border border-i23-gris-pale rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-i23-turquoise"
          placeholder="••••••••"
          minLength={6}
        />
      </div>
      {email && (
        <p className="text-xs text-i23-gris-fonce/50 text-center">
          {t("email")} : {email}
        </p>
      )}
      {error && <p className="text-sm text-red-600">{error}</p>}
      <button
        type="submit"
        disabled={loading}
        className="w-full bg-i23-turquoise text-white py-2.5 rounded-lg text-sm font-semibold hover:bg-i23-turquoise-hover transition-colors disabled:opacity-50"
      >
        {loading ? t("loading") : t("signup")}
      </button>
    </form>
  );
}
