import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { validateOrigin } from "@/lib/csrf";

export type ModeSauvegarde = "enregistre" | "session";
export type PartageCoach = "aucun" | "progression" | "progression_schemas" | "tout";

const MODES_VALIDES: ModeSauvegarde[] = ["enregistre", "session"];
const PARTAGES_VALIDES: PartageCoach[] = ["aucun", "progression", "progression_schemas", "tout"];

export async function GET() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Non autorise" }, { status: 401 });

  const { data } = await supabase
    .from("membre_consentement")
    .select("mode_sauvegarde, partage_coach, consentement_donne_at, updated_at")
    .eq("user_id", user.id)
    .single();

  // Retourne les valeurs par défaut si pas encore configuré
  return NextResponse.json(data ?? {
    mode_sauvegarde: "enregistre",
    partage_coach: "aucun",
    consentement_donne_at: null,
  });
}

export async function POST(req: NextRequest) {
  const originError = validateOrigin(req);
  if (originError) return originError;

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Non autorise" }, { status: 401 });

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Requete invalide" }, { status: 400 });
  }

  const { mode_sauvegarde, partage_coach } = body as {
    mode_sauvegarde?: string;
    partage_coach?: string;
  };

  if (!mode_sauvegarde || !MODES_VALIDES.includes(mode_sauvegarde as ModeSauvegarde)) {
    return NextResponse.json({ error: "mode_sauvegarde invalide" }, { status: 400 });
  }

  if (!partage_coach || !PARTAGES_VALIDES.includes(partage_coach as PartageCoach)) {
    return NextResponse.json({ error: "partage_coach invalide" }, { status: 400 });
  }

  const { error } = await supabase
    .from("membre_consentement")
    .upsert({
      user_id: user.id,
      mode_sauvegarde,
      partage_coach,
      updated_at: new Date().toISOString(),
    }, { onConflict: "user_id" });

  if (error) {
    return NextResponse.json({ error: "Erreur lors de la sauvegarde" }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
