import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { validateOrigin } from "@/lib/csrf";

const ipAttempts = new Map<string, { count: number; resetAt: number }>();
const MAX_ATTEMPTS = 3;
const RATE_WINDOW = 60_000;

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const entry = ipAttempts.get(ip);
  if (!entry || now > entry.resetAt) {
    ipAttempts.set(ip, { count: 1, resetAt: now + RATE_WINDOW });
    return false;
  }
  entry.count++;
  return entry.count > MAX_ATTEMPTS;
}

export async function POST(req: NextRequest) {
  const originError = validateOrigin(req);
  if (originError) return originError;

  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || req.headers.get("x-real-ip") || "unknown";

  if (checkRateLimit(ip)) {
    return NextResponse.json({ error: "Trop de requetes. Reessaie dans une minute." }, { status: 429 });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Requete invalide" }, { status: 400 });
  }

  const { email, locale } = body as { email?: string; locale?: string };

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: "Courriel invalide" }, { status: 400 });
  }

  if (email.length > 254) {
    return NextResponse.json({ error: "Courriel trop long" }, { status: 400 });
  }

  const safeLocale = locale === "en" ? "en" : "fr";

  const supabase = createAdminClient();
  const { error } = await supabase
    .from("attente_emails")
    .upsert({ email: email.toLowerCase().trim(), locale: safeLocale }, { onConflict: "email" });

  if (error) {
    if (error.code === "42P01") {
      return NextResponse.json({ error: "Table non configuree" }, { status: 500 });
    }
    return NextResponse.json({ error: "Erreur lors de l'enregistrement" }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
