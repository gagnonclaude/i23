import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(req: NextRequest) {
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

  const { thematique, declencheur, etapes, niveau } = body as {
    thematique?: string;
    declencheur?: string;
    etapes?: unknown;
    niveau?: string;
  };

  if (!thematique || typeof thematique !== "string" || thematique.length > 100) {
    return NextResponse.json({ error: "Thematique invalide" }, { status: 400 });
  }

  if (!declencheur || typeof declencheur !== "string" || declencheur.length > 500) {
    return NextResponse.json({ error: "Declencheur invalide" }, { status: 400 });
  }

  if (!etapes || typeof etapes !== "object") {
    return NextResponse.json({ error: "Etapes requises" }, { status: 400 });
  }

  const safeNiveau = niveau === "i" || niveau === "2" || niveau === "3" ? niveau : "i";

  const { error } = await supabase
    .from("schemas_experience")
    .insert({
      user_id: user.id,
      thematique,
      declencheur,
      etapes,
      niveau: safeNiveau,
    });

  if (error) {
    return NextResponse.json({ error: "Erreur lors de la sauvegarde" }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
