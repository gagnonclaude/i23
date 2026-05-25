"use client";

import { createClient } from "@/lib/supabase/client";
import { useRouter, Link } from "@/i18n/routing";
import { useSearchParams } from "next/navigation";
import { useState, Suspense } from "react";
import { useTranslations } from "next-intl";

function SignupFormInner({ priceId }: { priceId: string | null }) {
  const t = useTranslations("auth");
  const router = useRouter();
  const [prenom, setPrenom] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const supabase = createClient();
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { prenom },
      },
    });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    if (priceId) {
      router.push(`/checkout?priceId=${encodeURIComponent(priceId)}`);
      return;
    }

    router.push("/dashboard");
    router.refresh();
  };

  if (success) {
    return (
      <div className="text-center space-y-3">
        <div className="w-12 h-12 bg-i23-turquoise/10 rounded-full flex items-center justify-center mx-auto">
          <svg className="w-6 h-6 text-i23-turquoise" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
        </div>
        <p className="text-i23-gris-fonce font-semibold">{t("checkEmail")}</p>
        <p className="text-sm text-i23-gris-fonce/70">{t("checkEmailDesc")}</p>
      </div>
    );
  }

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

function SignupFormWithSearchParams() {
  const searchParams = useSearchParams();
  const priceId = searchParams.get("priceId");
  return <SignupFormInner priceId={priceId} />;
}

export function SignupForm() {
  return (
    <Suspense fallback={<SignupFormInner priceId={null} />}>
      <SignupFormWithSearchParams />
    </Suspense>
  );
}
