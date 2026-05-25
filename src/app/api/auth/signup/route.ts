import { createServerClient } from "@supabase/ssr";
import { NextResponse } from "next/server";
import { SUPABASE_URL, SUPABASE_ANON_KEY } from "@/lib/config-public";

export async function POST(request: Request) {
  const contentType = request.headers.get("content-type") || "";
  let email: string, password: string, prenom: string;

  if (contentType.includes("application/json")) {
    const body = await request.json();
    email = body.email;
    password = body.password;
    prenom = body.prenom;
  } else {
    const formData = await request.formData();
    email = formData.get("email") as string;
    password = formData.get("password") as string;
    prenom = formData.get("prenom") as string;
  }

  const redirectUrl = new URL("/fr/auth/consentement", request.url);
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

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: { data: { prenom } },
  });

  if (error) {
    const signupUrl = new URL(`/fr/auth/signup?error=${encodeURIComponent(error.message)}`, request.url);
    return NextResponse.redirect(signupUrl, { status: 303 });
  }

  const { error: loginError } = await supabase.auth.signInWithPassword({ email, password });

  if (loginError) {
    const signupUrl = new URL(`/fr/auth/signup?error=${encodeURIComponent(loginError.message)}`, request.url);
    return NextResponse.redirect(signupUrl, { status: 303 });
  }

  return response;
}
