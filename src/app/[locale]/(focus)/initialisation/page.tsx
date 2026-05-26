import { setRequestLocale } from "next-intl/server";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { InitialisationForm } from "@/components/initialisation/InitialisationForm";

export default async function InitialisationPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect(`/${locale}/auth/login`);
  }

  // Si l'initialisation est déjà faite, avancer à la prochaine étape
  const [parcoursResult, bilanResult] = await Promise.all([
    supabase.from("parcours_progression").select("etape_actuelle").eq("user_id", user!.id).maybeSingle(),
    supabase.from("bilans_depart").select("completed_at").eq("user_id", user!.id).maybeSingle(),
  ]);

  if (parcoursResult.data) {
    if (bilanResult.data?.completed_at) redirect(`/${locale}/dashboard`);
    redirect(`/${locale}/bilan-depart`);
  }

  return (
    <div className="py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <InitialisationForm />
      </div>
    </div>
  );
}
