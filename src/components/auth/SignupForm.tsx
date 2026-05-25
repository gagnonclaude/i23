"use client";

import { useSearchParams } from "next/navigation";

export function SignupForm({ action }: { action: (formData: FormData) => Promise<void> }) {
  const searchParams = useSearchParams();
  const errorParam = searchParams.get("error");
  const error = errorParam ? decodeURIComponent(errorParam) : null;

  return (
    <form action={action} className="space-y-5">
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
        className="w-full bg-i23-turquoise text-white py-2.5 rounded-lg text-sm font-semibold hover:bg-i23-turquoise-hover transition-colors"
      >
        Créer mon compte
      </button>
    </form>
  );
}
