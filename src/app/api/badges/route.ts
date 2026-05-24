import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { badgesConfig } from "@/lib/config";

export async function GET() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Non autorise" }, { status: 401 });

  const { data } = await supabase
    .from("badges_earned")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: true });

  const badges = (data || []).map((b: { badge_type: string; thematique: string | null; created_at: string }) => {
    const config = badgesConfig.find((c) => c.type === b.badge_type);
    return {
      ...b,
      nom: config?.nom || b.badge_type,
      icone: config?.icone || "🎖️",
      condition: config?.condition || "",
    };
  });

  return NextResponse.json({ badges });
}
