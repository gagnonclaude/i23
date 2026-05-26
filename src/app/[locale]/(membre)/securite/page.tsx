import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import { MFASetup } from "@/components/auth/MFASetup";

export default async function SecuritePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect(`/${locale}/auth/login`);
  }

  const { data: factors } = await supabase.auth.mfa.listFactors();
  const isEnabled = (factors?.totp?.length ?? 0) > 0 &&
    factors?.totp?.[0]?.status === "verified";

  return (
    <div className="py-12">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-i23-gris-fonce">Sécurité du compte</h1>
          <p className="text-sm text-i23-gris-fonce/70 mt-1">{user.email}</p>
        </div>
        <MFASetup isEnabled={isEnabled} />
      </div>
    </div>
  );
}
