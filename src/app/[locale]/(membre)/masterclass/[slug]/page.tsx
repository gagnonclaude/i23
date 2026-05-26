import { setRequestLocale } from "next-intl/server";
import { getMasterclass } from "@/lib/masterclass";
import { MasterclassViewer } from "@/components/masterclass/MasterclassViewer";
import { notFound, redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

// MC qui nécessitent le badge Méthode i+ (toutes les thématiques)
const MC_THEMATIQUES = ["energie", "anxiete", "alimentation", "communication", "dependances"];

export default async function MasterclassSlugPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  const mc = getMasterclass(slug);
  if (!mc) notFound();

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect(`/${locale}/auth/login`);

  // MC Méthode i+ : nécessite initialisation complétée
  if (slug === "methode-i+") {
    const { data: parcours } = await supabase
      .from("parcours_progression")
      .select("etape_actuelle")
      .eq("user_id", user.id)
      .single();

    if (!parcours) redirect(`/${locale}/initialisation`);
  }

  // MC thématiques : nécessitent le badge Méthode i+
  if (MC_THEMATIQUES.includes(slug)) {
    const { data: badge } = await supabase
      .from("badges_earned")
      .select("id")
      .eq("user_id", user.id)
      .eq("badge_type", "methode-i+")
      .single();

    if (!badge) redirect(`/${locale}/dashboard`);
  }

  return (
    <div className="py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <MasterclassViewer mc={mc} />
      </div>
    </div>
  );
}
