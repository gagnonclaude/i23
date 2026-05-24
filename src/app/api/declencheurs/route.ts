import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { validateOrigin } from "@/lib/csrf";

export async function GET(req: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Non autorise" }, { status: 401 });

  const thematique = req.nextUrl.searchParams.get("thematique");

  let query = supabase
    .from("declencheurs")
    .select("*")
    .eq("user_id", user.id)
    .eq("statut", "actif")
    .order("created_at", { ascending: false });

  if (thematique) {
    query = query.eq("thematique", thematique);
  }

  const { data, error } = await query;
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ declencheurs: data || [] });
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

  const { thematique, texte } = body as { thematique?: string; texte?: string };

  if (!thematique || typeof thematique !== "string" || thematique.length > 100) {
    return NextResponse.json({ error: "thematique invalide" }, { status: 400 });
  }

  if (!texte || typeof texte !== "string" || texte.length < 3 || texte.length > 500) {
    return NextResponse.json({ error: "texte invalide (3-500 caractères)" }, { status: 400 });
  }

  const { data, error } = await supabase
    .from("declencheurs")
    .insert({ user_id: user.id, thematique, texte, statut: "actif" })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ declencheur: data });
}

export async function PATCH(req: NextRequest) {
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

  const { id, statut } = body as { id?: string; statut?: string };

  if (!id || typeof id !== "string") {
    return NextResponse.json({ error: "id requis" }, { status: 400 });
  }

  if (!statut || !["actif", "archive"].includes(statut)) {
    return NextResponse.json({ error: "statut invalide" }, { status: 400 });
  }

  const { error } = await supabase
    .from("declencheurs")
    .update({ statut })
    .eq("id", id)
    .eq("user_id", user.id);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ success: true });
}
