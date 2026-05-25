"use client";

import { createClient } from "@/lib/supabase/client";
import { Link } from "@/i18n/routing";
import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";

export function LoginForm() {
  const t = useTranslations("auth");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [resetSent, setResetSent] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    if (!loggedIn) return;
    // Attendre que Supabase confirme la session via onAuthStateChange
    const supabase = createClient();
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === "SIGNED_IN") {
        subscription.unsubscribe();
        window.location.href = "/fr/dashboard";
      }
    });
    // Timeout de sécurité : forcer la navigation après 2 secondes si l'event ne vient pas
    const timeout = setTimeout(() => {
      subscription.unsubscribe();
      window.location.href = "/fr/dashboard";
    }, 2000);
    return () => {
      subscription.unsubscribe();
      clearTimeout(timeout);
    };
  }, [loggedIn]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    // Déclenche le useEffect qui attend onAuthStateChange
    setLoggedIn(true);
  };

  const handleResetPassword = async () => {
    if (!email) {
      setError("Entre ton courriel d'abord pour réinitialiser ton mot de passe.");
      return;
    }
    const supabase = createClient();
    const { error } = await supabase.auth.resetPasswordForEmail(email);
    if (error) {
      setError(error.message);
    } else {
      setError(null);
      setResetSent(true);
    }
  };

  return (
    <form onSubmit={handleLogin} className="space-y-5">
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-i23-gris-fonce mb-1">
          {t("email")}
        </label>
        <input
          id="email"
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full px-4 py-2.5 border border-i23-gris-pale rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-i23-turquoise"
          placeholder="courriel@exemple.com"
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
      {error && <p className="text-sm text-red-600">{error}</p>}
      <button
        type="submit"
        disabled={loading || loggedIn}
        className="w-full bg-i23-turquoise text-white py-2.5 rounded-lg text-sm font-semibold hover:bg-i23-turquoise-hover transition-colors disabled:opacity-50"
      >
        {loading || loggedIn ? t("loading") : t("login")}
      </button>
      <p className="text-center text-sm text-i23-gris-fonce/70">
        {resetSent ? t("resetSent") : (
          <a href="#" onClick={(e) => { e.preventDefault(); handleResetPassword(); }} className="text-i23-turquoise font-semibold hover:underline">
            {t("forgotPassword")}
          </a>
        )}
      </p>
      <p className="text-center text-sm text-i23-gris-fonce/70">
        {t("noAccount")}{" "}
        <Link href="/auth/signup" className="text-i23-turquoise font-semibold hover:underline">
          {t("signupLink")}
        </Link>
      </p>
    </form>
  );
}
