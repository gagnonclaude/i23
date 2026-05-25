"use client";

import { useSearchParams } from "next/navigation";

export function LoginForm({ action }: { action: (formData: FormData) => Promise<void> }) {
  const searchParams = useSearchParams();
  const errorParam = searchParams.get("error");
  const error = errorParam === "invalid" ? "Courriel ou mot de passe incorrect." : null;

  return (
    <form action={action} className="space-y-5">
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
        className="w-full bg-i23-turquoise text-white py-2.5 rounded-lg text-sm font-semibold hover:bg-i23-turquoise-hover transition-colors"
      >
        Se connecter
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
