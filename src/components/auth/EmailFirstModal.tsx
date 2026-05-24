"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/routing";

export function EmailFirstModal({
  priceId,
  onClose,
}: {
  priceId: string;
  onClose: () => void;
}) {
  const t = useTranslations("auth");
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await fetch("/api/attente", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, locale: "fr" }),
      });
    } catch {}

    router.push(`/checkout?priceId=${encodeURIComponent(priceId)}&email=${encodeURIComponent(email)}`);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={onClose}>
      <div className="bg-white rounded-2xl p-8 w-full max-w-md mx-4 shadow-xl" onClick={(e) => e.stopPropagation()}>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-i23-gris-fonce">{t("emailFirstTitle")}</h2>
          <button onClick={onClose} className="text-i23-gris-fonce/50 hover:text-i23-gris-fonce text-2xl leading-none">&times;</button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label htmlFor="modal-email" className="block text-sm font-medium text-i23-gris-fonce mb-1">
              {t("email")}
            </label>
            <input
              id="modal-email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2.5 border border-i23-gris-pale rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-i23-turquoise"
              placeholder="courriel@exemple.com"
            />
          </div>
          {error && <p className="text-sm text-red-600">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-i23-turquoise text-white py-2.5 rounded-lg text-sm font-semibold hover:bg-i23-turquoise-hover transition-colors disabled:opacity-50"
          >
            {loading ? t("loading") : t("continueToPayment")}
          </button>
          <p className="text-center text-xs text-i23-gris-fonce/50">
            {t("emailFirstNote")}
          </p>
        </form>
      </div>
    </div>
  );
}
