import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function DELETE(req: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Non autorise" }, { status: 401 });
  }

  const confirmation = req.headers.get("x-confirm-delete");
  if (confirmation !== "SUPPRIMER_MON_COMPTE") {
    return NextResponse.json(
      { error: "Confirmation requise. Ajoute le header x-confirm-delete: SUPPRIMER_MON_COMPTE" },
      { status: 400 }
    );
  }

  const userId = user.id;

  const adminClient = createAdminClient();

  const tables = [
    "schemas_experience",
    "outils_resultats",
    "bilans_depart",
    "subscriptions",
    "parcours_progression",
    "quiz_results",
    "badges_earned",
    "mc_progression",
  ] as const;

  for (const table of tables) {
    const { error } = await adminClient
      .from(table)
      .delete()
      .eq("user_id", userId);
    if (error) {
      console.error(`Erreur suppression ${table}:`, error);
    }
  }

  const { error: authError } = await adminClient.auth.admin.deleteUser(userId);

  if (authError) {
    return NextResponse.json({ error: "Erreur lors de la suppression du compte" }, { status: 500 });
  }

  return NextResponse.json({ message: "Compte supprime avec succes" }, { status: 200 });
}
