"use client";

import { Link } from "@/i18n/routing";
import { useState } from "react";
import { useTranslations } from "next-intl";

export function SignupForm() {
  const t = useTranslations("auth");
  const [prenom, setPrenom] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const prenomVal = prenom;
    const emailVal = email;
    const passwordVal = password;

    const response = await fetch("/api/auth/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: emailVal, password: passwordVal, prenom: prenomVal }),
    });

    const result = await response.json();

    if (!response.ok || result.error) {
      setError(result.error || "Erreur lors de la création du compte.");
      setLoading(false);
      return;
    }

    window.location.replace("/fr/auth/consentement");
  };

  return (
    <form onSubmit={handleSignup} className="space-y-5">
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
        disabled={loading}
        className="w-full bg-i23-turquoise text-white py-2.5 rounded-lg text-sm font-semibold hover:bg-i23-turquoise-hover transition-colors disabled:opacity-50"
      >
        {loading ? t("loading") : t("signup")}
      </button>
      <p className="text-center text-sm text-i23-gris-fonce/70">
        {t("hasAccount")}{" "}
        <Link href="/auth/login" className="text-i23-turquoise font-semibold hover:underline">
          {t("loginLink")}
        </Link>
      </p>
    </form>
  );
}
