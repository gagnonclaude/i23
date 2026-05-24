import { parcoursConfig, type EtapeParcours } from "@/lib/config";
import { createClient } from "@/lib/supabase/server";

export type ParcoursState = {
  etapeActuelle: EtapeParcours;
  badges: { badge_type: string; thematique: string | null }[];
  mcCompletees: string[];
  quizReussis: string[];
};

export async function getParcoursState(): Promise<ParcoursState> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return { etapeActuelle: "initialisation", badges: [], mcCompletees: [], quizReussis: [] };
  }

  const [progression, badges, mcProg, quizRes] = await Promise.all([
    supabase.from("parcours_progression").select("etape_actuelle").eq("user_id", user.id).single(),
    supabase.from("badges_earned").select("badge_type, thematique").eq("user_id", user.id),
    supabase.from("mc_progression").select("mc_id").eq("user_id", user.id).eq("completee", true),
    supabase.from("quiz_results").select("mc_id").eq("user_id", user.id).eq("reussi", true),
  ]);

  return {
    etapeActuelle: (progression.data?.etape_actuelle as EtapeParcours) || "initialisation",
    badges: badges.data || [],
    mcCompletees: (mcProg.data || []).map((r: { mc_id: string }) => r.mc_id),
    quizReussis: (quizRes.data || []).map((r: { mc_id: string }) => r.mc_id),
  };
}

export function isUnlocked(etape: EtapeParcours, state: ParcoursState): boolean {
  if (etape === "initialisation") return true;

  const config = parcoursConfig.etapes.find((e) => e.id === etape);
  if (!config || config.debloquePar.length === 0) return true;

  const etapeIds = parcoursConfig.etapes.map((e) => e.id);
  const currentIdx = etapeIds.indexOf(state.etapeActuelle);
  const targetIdx = etapeIds.indexOf(etape);

  return currentIdx >= targetIdx;
}

export function getNextStep(state: ParcoursState): EtapeParcours | null {
  const etapeIds = parcoursConfig.etapes.map((e) => e.id);
  const currentIdx = etapeIds.indexOf(state.etapeActuelle);
  if (currentIdx === -1 || currentIdx >= etapeIds.length - 1) return null;
  return etapeIds[currentIdx + 1] as EtapeParcours;
}

export async function advanceTo(etape: EtapeParcours): Promise<boolean> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return false;

  const { error } = await supabase
    .from("parcours_progression")
    .upsert({ user_id: user.id, etape_actuelle: etape, date_modification: new Date().toISOString() }, { onConflict: "user_id" });

  return !error;
}
