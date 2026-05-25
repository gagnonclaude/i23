import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

function isSafeRedirect(next: string): boolean {
  if (!next.startsWith("/")) return false;
  if (next.startsWith("//")) return false;
  if (next.startsWith("/\\")) return false;
  if (next.startsWith("/@")) return false;
  if (/%2f/i.test(next) || /%5c/i.test(next)) return false;
  if (/\.\./.test(next)) return false;
  return true;
}

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || origin;
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/fr/dashboard";

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      // Vérifier si le membre a déjà configuré son consentement
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: consentement } = await supabase
          .from("membre_consentement")
          .select("id")
          .eq("user_id", user.id)
          .single();

        // Nouveau membre = redirect vers consentement
        if (!consentement) {
          const locale = next.startsWith("/en") ? "en" : "fr";
          return NextResponse.redirect(`${siteUrl}/${locale}/auth/consentement`);
        }
      }

      const safeNext = isSafeRedirect(next) ? next : "/fr/dashboard";
      return NextResponse.redirect(`${siteUrl}${safeNext}`);
    }
  }

  return NextResponse.redirect(`${siteUrl}/fr/auth/login`);
}
