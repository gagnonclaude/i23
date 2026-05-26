import { redirect } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import Stripe from "stripe";
import { ALLOWED_PRICES } from "@/lib/config-public";

export default async function CheckoutPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ priceId?: string; email?: string }>;
}) {
  const { locale } = await params;
  const { priceId, email } = await searchParams;
  setRequestLocale(locale);

  if (!priceId || !(ALLOWED_PRICES as readonly string[]).includes(priceId)) {
    redirect(`/${locale}/#forfaits`);
  }

  if (!process.env.STRIPE_SECRET_KEY) {
    redirect(`/${locale}/#forfaits`);
  }
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

  const baseUrl = process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}`
    : (process.env.NEXT_PUBLIC_SITE_URL || "https://i23.ca");

  const session = await stripe.checkout.sessions.create({
    customer_email: email || undefined,
    line_items: [{ price: priceId, quantity: 1 }],
    mode: "subscription",
    locale: locale === "en" ? "en" : "fr",
    success_url: `${baseUrl}/${locale}/auth/completer?checkout=success&session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${baseUrl}/${locale}/#forfaits?checkout=cancelled`,
  });

  if (session.url) {
    redirect(session.url);
  }

  redirect(`/${locale}/#forfaits`);
}
