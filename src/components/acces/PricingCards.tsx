"use client";

import { useTranslations } from "next-intl";
import { useState, useEffect } from "react";
import { useRouter } from "@/i18n/routing";
import { STRIPE_PRICES } from "@/lib/config-public";
import { EmailFirstModal } from "@/components/auth/EmailFirstModal";

const plans = [
  {
    key: "hebdo",
    priceId: STRIPE_PRICES.hebdo,
    price: "49$",
    period: "/semaine",
    highlight: false,
  },
  {
    key: "mensuel",
    priceId: STRIPE_PRICES.mensuel,
    price: "99$",
    period: "/mois",
    highlight: true,
  },
  {
    key: "trimestriel",
    priceId: STRIPE_PRICES.trimestriel,
    price: "199$",
    period: "/3 mois",
    highlight: false,
  },
];

export function PricingCards() {
  const t = useTranslations("funnel.prix");
  const [loading, setLoading] = useState<string | null>(null);
  const [modalPriceId, setModalPriceId] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleCheckout = (priceId: string, key: string) => {
    setLoading(key);
    setModalPriceId(priceId);
  };

  if (!mounted) return null;

  return (
    <>
      {modalPriceId && (
        <EmailFirstModal priceId={modalPriceId} onClose={() => { setModalPriceId(null); setLoading(null); }} />
      )}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
        {plans.map((plan) => (
          <div
            key={plan.key}
            className={`rounded-2xl p-8 border ${
              plan.highlight
                ? "border-i23-turquoise bg-white shadow-lg scale-105"
                : "border-i23-gris-pale bg-white"
            }`}
          >
            {plan.highlight && (
              <span className="inline-block bg-i23-turquoise text-white text-xs font-semibold px-3 py-1 rounded-full mb-4">
                {t("popular")}
              </span>
            )}
            <h3 className="text-xl font-bold text-i23-gris-fonce mb-2">
              {t(`${plan.key}.title`)}
            </h3>
            <p className="text-i23-gris-fonce/70 text-sm mb-6">
              {t(`${plan.key}.description`)}
            </p>
            <div className="mb-6">
              <span className="text-4xl font-bold text-i23-gris-fonce">{plan.price}</span>
              <span className="text-i23-gris-fonce/70">{plan.period}</span>
            </div>
            <button
              onClick={() => handleCheckout(plan.priceId, plan.key)}
              disabled={loading === plan.key}
              className={`w-full py-2.5 rounded-lg text-sm font-semibold transition-colors ${
                plan.highlight
                  ? "bg-i23-turquoise text-white hover:bg-i23-turquoise-hover"
                  : "border-2 border-i23-turquoise text-i23-turquoise hover:bg-i23-turquoise hover:text-white"
              } disabled:opacity-50`}
            >
              {loading === plan.key ? t("loading") : t("cta")}
            </button>
          </div>
        ))}
      </div>
    </>
  );
}
