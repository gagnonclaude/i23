"use client";

import { useState } from "react";

export function SignupForm() {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSignup = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const form = e.currentTarget;
    const prenom = (form.elements.namedItem("prenom") as HTMLInputElement).value;
    const email = (form.elements.namedItem("email") as HTMLInputElement).value;
    const password = (form.elements.namedItem("password") as HTMLInputElement).value;

    try {
      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email, password, prenom }),
      });

      const result = await response.json();

      if (!response.ok || result.error) {
        setError(result.error || "Erreur lors de la création du compte.");
        setLoading(false);
        return;
      }

      window.location.replace("/fr/auth/consentement");
    } catch (err) {
      setError("Erreur réseau. Réessaie.");
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSignup} className="space-y-5">
      <div>
        <label htmlFor="prenom" className="block text-sm font-medium text-i23-gris-fonce mb-1">
          Prénom
        </label>
        <input
          id="prenom"
          name="prenom"
          type="text"
          required
          className="w-full px-4 py-2.5 border border-i23-gris-pale rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-i23-turquoise"
          placeholder="Ton prénom"
          maxLength={50}
        />
      </div>
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
        {loading ? "Chargement..." : "Créer mon compte"}
      </button>
    </form>
  );
}
