"use client";

import { useState } from "react";

export function LoginForm() {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const form = e.currentTarget;
    const email = (form.elements.namedItem("email") as HTMLInputElement).value;
    const password = (form.elements.namedItem("password") as HTMLInputElement).value;

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email, password }),
      });

      const result = await response.json();

      if (!response.ok || result.error) {
        setError(result.error || "Erreur de connexion.");
        setLoading(false);
        return;
      }

      window.location.replace("/fr/initialisation");
    } catch (err) {
      setError("Erreur réseau. Réessaie.");
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleLogin} className="space-y-5">
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-i23-gris-fonce mb-1">
          Courriel
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          className="w-full px-4 py-2.5 border border-i23-gris-pale rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-i23-turquoise"
          placeholder="courriel@exemple.com"
        />
      </div>
      <div>
        <label htmlFor="password" className="block text-sm font-medium text-i23-gris-fonce mb-1">
          Mot de passe
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
        {loading ? "Chargement..." : "Se connecter"}
      </button>
      <p className="text-center text-sm text-i23-gris-fonce/70 mt-2">
        Pas de compte?{" "}
        <a href="/fr/auth/signup" className="text-i23-turquoise font-semibold hover:underline">
          Créer un compte
        </a>
      </p>
    </form>
  );
}
