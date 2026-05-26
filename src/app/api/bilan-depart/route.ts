import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { validateOrigin } from "@/lib/csrf";
import { logAudit } from "@/lib/audit";

export async function POST(req: NextRequest) {
  const originError = validateOrigin(req);
  if (originError) return originError;

  const supabase = await createClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();

  console.log("[bilan-depart] user:", user?.id ?? "null", "authError:", authError?.message ?? "none");

  if (!user) {
    return NextResponse.json({ error: "Non autorise", debug: authError?.message }, { status: 401 });
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

  const { error } = await supabase
    .from("bilans_depart")
    .upsert({
      user_id: user.id,
      reponses,
      scores_dimensions,
      completed_at: new Date().toISOString(),
    }, { onConflict: "user_id" });

  console.log("[bilan-depart] upsert error:", error?.message ?? "none", "code:", error?.code ?? "none");

  if (error) {
    return NextResponse.json({ error: "Erreur lors de la sauvegarde", debug: error.message, code: error.code }, { status: 500 });
  }

  await logAudit({ action: "bilan.upsert", user_id: user.id });

  return NextResponse.json({ success: true });
}
