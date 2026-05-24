import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(req: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Non autorise" }, { status: 401 });

  const mcId = req.nextUrl.searchParams.get("mc_id");
  if (!mcId) return NextResponse.json({ error: "mc_id requis" }, { status: 400 });

  const { data } = await supabase
    .from("mc_progression")
    .select("*")
    .eq("user_id", user.id)
    .eq("mc_id", mcId)
    .single();

  return NextResponse.json(data || { mc_id: mcId, section_actuelle: 0, completee: false });
}

export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Non autorise" }, { status: 401 });

  const body = await req.json();
  const { mc_id, section_actuelle, completee } = body as { mc_id: string; section_actuelle: number; completee?: boolean };

  if (!mc_id) return NextResponse.json({ error: "mc_id requis" }, { status: 400 });

  const { error } = await supabase
    .from("mc_progression")
    .upsert(
      { user_id: user.id, mc_id, section_actuelle, completee: completee || false, updated_at: new Date().toISOString() },
      { onConflict: "user_id,mc_id" }
    );

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  if (completee) {
    const { data: progression } = await supabase
      .from("parcours_progression")
      .select("etape_actuelle")
      .eq("user_id", user.id)
      .single();

    const etapeActuelle = (progression as { etape_actuelle: string } | null)?.etape_actuelle;

    if (mc_id === "methode-i+" && etapeActuelle === "mc-methode") {
      await supabase
        .from("parcours_progression")
        .update({ etape_actuelle: "quiz-methode", date_modification: new Date().toISOString() })
        .eq("user_id", user.id);
    } else if (etapeActuelle === "mc-thematique") {
      await supabase
        .from("parcours_progression")
        .update({ etape_actuelle: "quiz-thematique", date_modification: new Date().toISOString() })
        .eq("user_id", user.id);
    }
  }

  return NextResponse.json({ success: true });
}
