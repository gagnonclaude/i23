import { createServerClient } from "@supabase/ssr";
import { NextResponse } from "next/server";
import { SUPABASE_URL, SUPABASE_ANON_KEY } from "@/lib/config-public";

export async function POST(request: Request) {
  const { email, password, prenom } = await request.json();

  const signupResponse = NextResponse.json({ success: true });

  const supabase = createServerClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    cookies: {
      getAll() {
        return [];
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value, options }) => {
          signupResponse.cookies.set(name, value, options);
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
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  // Connexion immédiate après signup
  const { error: loginError } = await supabase.auth.signInWithPassword({ email, password });

  if (loginError) {
    return NextResponse.json({ error: loginError.message }, { status: 400 });
  }

  return NextResponse.json({ success: true, user: data.user?.email }, {
    headers: signupResponse.headers,
  });
}
