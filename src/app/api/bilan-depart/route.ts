import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { validateOrigin } from "@/lib/csrf";
import { logAudit } from "@/lib/audit";

export async function POST(req: NextRequest) {
  const originError = validateOrigin(req);
  if (originError) return originError;

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Non autorise" }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Requete invalide" }, { status: 400 });
  }

  const { reponses, scores_dimensions } = body as { reponses?: unknown; scores_dimensions?: unknown };

  if (!reponses || typeof reponses !== "object") {
    return NextResponse.json({ error: "Reponses requises" }, { status: 400 });
  }

  if (!scores_dimensions || typeof scores_dimensions !== "object") {
    return NextResponse.json({ error: "Scores requis" }, { status: 400 });
  }

  const [bilanResult, parcoursResult] = await Promise.all([
    supabase.from("bilans_depart").upsert({
      user_id: user.id,
      reponses,
      scores_dimensions,
      completed_at: new Date().toISOString(),
    }, { onConflict: "user_id" }),
    supabase.from("parcours_progression").upsert({
      user_id: user.id,
      etape_actuelle: "mc-methode",
      date_modification: new Date().toISOString(),
    }, { onConflict: "user_id" }),
  ]);

  if (bilanResult.error || parcoursResult.error) {
    return NextResponse.json({ error: "Erreur lors de la sauvegarde" }, { status: 500 });
  }

  await logAudit({ action: "bilan.upsert", user_id: user.id });

  return NextResponse.json({ success: true });
}
