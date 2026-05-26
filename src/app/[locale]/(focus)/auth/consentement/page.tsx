import { setRequestLocale } from "next-intl/server";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { ConsentementForm } from "@/components/auth/ConsentementForm";

export default async function ConsentementPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect(`/${locale}/auth/login`);
  }

  // Si consentement déjà donné, avancer à la prochaine étape
  const [consentementResult, parcoursResult, bilanResult] = await Promise.all([
    supabase.from("membre_consentement").select("id").eq("user_id", user!.id).maybeSingle(),
    supabase.from("parcours_progression").select("etape_actuelle").eq("user_id", user!.id).maybeSingle(),
    supabase.from("bilans_depart").select("completed_at").eq("user_id", user!.id).maybeSingle(),
  ]);

  if (consentementResult.data) {
    if (!parcoursResult.data) redirect(`/${locale}/initialisation`);
    if (!bilanResult.data?.completed_at) redirect(`/${locale}/bilan-depart`);
    redirect(`/${locale}/dashboard`);
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-4">
      <div className="w-full max-w-lg">
        <ConsentementForm />
      </div>
    </div>
  );
}
