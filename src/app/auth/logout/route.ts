import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";
import { validateOrigin } from "@/lib/csrf";
import { logAudit } from "@/lib/audit";

export async function POST(request: NextRequest) {
  const csrfError = validateOrigin(request);
  if (csrfError) return csrfError;

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  await supabase.auth.signOut();

  if (user) {
    await logAudit({ action: "auth.logout", user_id: user.id, ip: request.headers.get("x-forwarded-for") ?? "unknown" });
  }

  const origin = process.env.NEXT_PUBLIC_SITE_URL || new URL(request.url).origin;
  return NextResponse.redirect(`${origin}/fr/auth/login`, { status: 302 });
}
