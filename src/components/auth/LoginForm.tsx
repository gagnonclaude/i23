"use client";

import { Link } from "@/i18n/routing";
import { useState } from "react";
import { useTranslations } from "next-intl";
import { loginAction } from "@/app/[locale]/auth/login/actions";

export function LoginForm() {
  const t = useTranslations("auth");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [resetSent, setResetSent] = useState(false);
  const [email, setEmail] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    const result = await loginAction(formData);

    if (result?.error) {
      setError(result.error);
      setLoading(false);
    }
    // Si pas d'erreur, la Server Action redirige côté serveur
  };

  const handleResetPassword = async () => {
    if (!email) {
      setError("Entre ton courriel d'abord pour réinitialiser ton mot de passe.");
      return;
    }
    const { createClient } = await import("@/lib/supabase/client");
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
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-i23-gris-fonce mb-1">
          {t("email")}
        </label>
        <input
          id="email"
          name="email"
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
          name="password"
          type="password"
          required
          className="w-full px-4 py-2.5 border border-i23-gris-pale rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-i23-turquoise"
          placeholder="••••••••"
          minLength={6}
        />
      </div>
      {error && <p className="text-sm text-red-600">{error}</p>}
      <button
        type="submit"
        disabled={loading}
        className="w-full bg-i23-turquoise text-white py-2.5 rounded-lg text-sm font-semibold hover:bg-i23-turquoise-hover transition-colors disabled:opacity-50"
      >
        {loading ? t("loading") : t("login")}
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
