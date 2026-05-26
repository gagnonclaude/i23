import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import { DashboardContent } from "@/components/dashboard/DashboardContent";
import { getParcoursState, type ParcoursState } from "@/lib/parcours";
import { badgesConfig } from "@/lib/config";

type Badge = { badge_type: string; thematique: string | null; created_at: string; nom: string; icone: string; condition: string };

export default async function DashboardPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect(`/${locale}/auth/login`);
  }

  const [consentementResult, bilanResult, subscriptionResult, parcoursResult, badgesData] = await Promise.all([
    supabase.from("membre_consentement").select("id").eq("user_id", user!.id).maybeSingle(),
    supabase.from("bilans_depart").select("scores_dimensions, completed_at").eq("user_id", user!.id).maybeSingle(),
    supabase.from("subscriptions").select("status").eq("user_id", user!.id).eq("status", "active").maybeSingle(),
    supabase.from("parcours_progression").select("etape_actuelle").eq("user_id", user!.id).maybeSingle(),
    supabase.from("badges_earned").select("*").eq("user_id", user!.id).order("created_at", { ascending: true }),
  ]);

  // Vérification abonnement (bypass pour compte test et dev)
  const isTestAccount = user!.email === "claude@i23.ca";
  const isDev = process.env.NODE_ENV === "development";
  if (!subscriptionResult.data && !isTestAccount && !isDev) {
    redirect(`/${locale}/#forfaits`);
  }

  // Redirects basés sur données réelles -- robuste peu importe l'état
  if (!consentementResult.data) redirect(`/${locale}/auth/consentement`);
  if (!parcoursResult.data) redirect(`/${locale}/initialisation`);
  if (!bilanResult.data?.completed_at) redirect(`/${locale}/bilan-depart`);

  const parcours = await getParcoursState();
  const bilan = bilanResult.data as { scores_dimensions: Record<string, number>; completed_at: string };

  const badges: Badge[] = (badgesData.data || []).map((b: { badge_type: string; thematique: string | null; created_at: string }) => {
    const config = badgesConfig.find((c) => c.type === b.badge_type);
    return { ...b, nom: config?.nom || b.badge_type, icone: config?.icone || "🎖️", condition: config?.condition || "" };
  });

  return <DashboardContent user={user!} bilan={bilan} parcours={parcours} badges={badges} />;
}
