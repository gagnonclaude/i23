"use server";

import { createClient } from "@/lib/supabase/server";
import { logAudit } from "@/lib/audit";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function soumettreBilan(
  reponses: Record<string, string | number>,
  scores_dimensions: Record<string, number>,
  locale: string
) {
  const supabase = await createClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();

  console.log("[soumettreBilan] user:", user?.id ?? "null", "authError:", authError?.message ?? "none");

  if (!user) {
    redirect(`/${locale}/auth/login`);
  }

  const [bilanResult, parcoursResult] = await Promise.all([
    supabase.from("bilans_depart").upsert({
      user_id: user!.id,
      reponses,
      scores_dimensions,
      completed_at: new Date().toISOString(),
    }, { onConflict: "user_id" }),
    supabase.from("parcours_progression").upsert({
      user_id: user!.id,
      etape_actuelle: "mc-methode",
      date_modification: new Date().toISOString(),
    }, { onConflict: "user_id" }),
  ]);

  console.log("[soumettreBilan] bilanError:", bilanResult.error?.message ?? "none", "parcoursError:", parcoursResult.error?.message ?? "none");

  if (bilanResult.error || parcoursResult.error) {
    return { error: "Erreur lors de la sauvegarde. Réessaie." };
  }

  await logAudit({ action: "bilan.upsert", user_id: user!.id });

  revalidatePath(`/${locale}/dashboard`);
  redirect(`/${locale}/dashboard`);
}
