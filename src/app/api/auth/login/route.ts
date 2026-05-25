import { createServerClient } from "@supabase/ssr";
import { NextRequest, NextResponse } from "next/server";
import { SUPABASE_URL, SUPABASE_ANON_KEY } from "@/lib/config-public";
import { validateOrigin } from "@/lib/csrf";
import { logAudit } from "@/lib/audit";

export async function POST(request: NextRequest) {
  const originError = validateOrigin(request);
  if (originError) return originError;

  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  const contentType = request.headers.get("content-type") || "";
  let email: string, password: string;

  if (contentType.includes("application/json")) {
    const body = await request.json();
    email = body.email;
    password = body.password;
  } else {
    const formData = await request.formData();
    email = formData.get("email") as string;
    password = formData.get("password") as string;
  }

  const redirectUrl = new URL("/fr/initialisation", request.url);
  const response = NextResponse.redirect(redirectUrl, { status: 303 });

  const supabase = createServerClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    cookies: {
      getAll() {
        return [];
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value, options }) => {
          response.cookies.set(name, value, options);
        });
      },
    },
  });

  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    await logAudit({ action: "auth.login.echec", ip, metadata: { email } });
    const loginUrl = new URL("/fr/auth/login?error=invalid", request.url);
    return NextResponse.redirect(loginUrl, { status: 303 });
  }

  await logAudit({ action: "auth.login.succes", ip, metadata: { email } });
  return response;
}
