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

  const { outil_type, etape_numero, reponses, menaces, opportunites } = body as {
    outil_type?: string;
    etape_numero?: number;
    reponses?: unknown;
    menaces?: string[];
    opportunites?: string[];
  };

  if (!outil_type || typeof outil_type !== "string" || outil_type.length > 100) {
    return NextResponse.json({ error: "outil_type invalide" }, { status: 400 });
  }

  if (typeof etape_numero !== "number" || etape_numero < 1 || etape_numero > 8) {
    return NextResponse.json({ error: "etape_numero invalide" }, { status: 400 });
  }

  if (!reponses || typeof reponses !== "object") {
    return NextResponse.json({ error: "Reponses requises" }, { status: 400 });
  }

  const { error } = await supabase
    .from("outils_resultats")
    .insert({
      user_id: user.id,
      outil_type,
      etape_numero,
      reponses,
      menaces: menaces || [],
      opportunites: opportunites || [],
    });

  if (error) {
    return NextResponse.json({ error: "Erreur lors de la sauvegarde" }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
