import { createClient } from "@/lib/supabase/server";
import type { BadgeType } from "@/lib/config";

export async function getBadges(userId: string) {
  const supabase = await createClient();
  const { data } = await supabase
    .from("badges_earned")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: true });
  return data || [];
}

export async function earnBadge(userId: string, type: BadgeType, thematique?: string): Promise<boolean> {
  const supabase = await createClient();
  const { error } = await supabase
    .from("badges_earned")
    .upsert(
      { user_id: userId, badge_type: type, thematique: thematique || null },
      { onConflict: "user_id,badge_type,thematique" }
    );
  return !error;
}

export async function hasBadge(userId: string, type: BadgeType, thematique?: string): Promise<boolean> {
  const supabase = await createClient();
  let query = supabase
    .from("badges_earned")
    .select("id")
    .eq("user_id", userId)
    .eq("badge_type", type);
  if (thematique) {
    query = query.eq("thematique", thematique);
  }
  const { data } = await query;
  return (data?.length || 0) > 0;
}
