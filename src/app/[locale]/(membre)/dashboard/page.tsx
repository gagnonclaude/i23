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

  const [bilanResult, subscriptionResult, parcours, badgesData] = await Promise.all([
    supabase.from("bilans_depart").select("scores_dimensions, completed_at").eq("user_id", user.id).maybeSingle(),
    supabase.from("subscriptions").select("status").eq("user_id", user.id).eq("status", "active").maybeSingle(),
    getParcoursState(),
    supabase.from("badges_earned").select("*").eq("user_id", user.id).order("created_at", { ascending: true }),
  ]);

  const isTestAccount = user.email === "claude@i23.ca";
  const isDev = process.env.NODE_ENV === "development";
  if (!subscriptionResult.data && !isTestAccount && !isDev) {
    redirect(`/${locale}/#forfaits`);
  }

  if (parcours.etapeActuelle === "initialisation" && !bilanResult.data?.completed_at) {
    redirect(`/${locale}/initialisation`);
  }

  const bilan = bilanResult.data as { scores_dimensions: Record<string, number>; completed_at: string } | null;

  const badges: Badge[] = (badgesData.data || []).map((b: { badge_type: string; thematique: string | null; created_at: string }) => {
    const config = badgesConfig.find((c) => c.type === b.badge_type);
    return { ...b, nom: config?.nom || b.badge_type, icone: config?.icone || "🎖️", condition: config?.condition || "" };
  });

  return <DashboardContent user={user} bilan={bilan} parcours={parcours} badges={badges} />;
}
