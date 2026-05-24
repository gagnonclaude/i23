import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

function isSafeRedirect(next: string): boolean {
  if (!next.startsWith("/")) return false;
  if (next.startsWith("//")) return false;
  return true;
}

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/fr/dashboard";

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      const safeNext = isSafeRedirect(next) ? next : "/fr/dashboard";
      return NextResponse.redirect(`${origin}${safeNext}`);
    }
  }

  return NextResponse.redirect(`${origin}/fr/auth/login`);
}
