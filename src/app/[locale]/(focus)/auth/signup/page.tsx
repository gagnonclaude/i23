import { setRequestLocale } from "next-intl/server";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function SignupPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);

  // Le signup se fait uniquement via le flow paiement (/#forfaits → modal → Stripe → /completer)
  redirect(`/${locale}/#forfaits`);
}
