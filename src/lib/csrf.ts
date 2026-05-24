import { NextRequest, NextResponse } from "next/server";

const ALLOWED_ORIGINS = [
  process.env.NEXT_PUBLIC_SITE_URL,
  "https://i23.ca",
  "https://www.i23.ca",
  ...(process.env.NODE_ENV === "development" ? ["http://localhost:3000"] : []),
].filter(Boolean) as string[];

/**
 * Valide que la requête provient d'un Origin autorisé.
 * Retourne null si OK, ou une NextResponse 403 si refusé.
 */
export function validateOrigin(req: NextRequest): NextResponse | null {
  const origin = req.headers.get("origin");

  // Pas d'origin = requête server-to-server ou curl direct.
  // On bloque par défaut pour les routes mutantes.
  if (!origin) {
    return NextResponse.json({ error: "Origin manquant" }, { status: 403 });
  }

  if (!ALLOWED_ORIGINS.includes(origin)) {
    return NextResponse.json({ error: "Origin non autorisé" }, { status: 403 });
  }

  return null;
}
