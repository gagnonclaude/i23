import createIntlMiddleware from "next-intl/middleware";
import { routing } from "@/i18n/routing";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";

const intlMiddleware = createIntlMiddleware({
  ...routing,
  localeDetection: false,
});

const protectedPaths = ["/dashboard", "/schema", "/outils", "/bilan-depart", "/quiz", "/initialisation", "/experimentation", "/trajectoire"];
const apiProtectedPaths = ["/api/stripe/checkout", "/api/stripe/link-subscription", "/api/ia", "/api/parcours", "/api/quiz", "/api/badges", "/api/mc-progress", "/api/consentement"];
const authRateLimitPaths = ["/auth/login", "/auth/signup"];

// Routes API sensibles avec leurs limites
const apiRateLimits: { path: string; max: number; windowMs: number }[] = [
  { path: "/api/ia/chat",              max: 20,  windowMs: 3_600_000 }, // 20/heure
  { path: "/api/stripe/checkout",      max: 10,  windowMs:   60_000  }, // 10/minute
  { path: "/api/stripe/link-subscription", max: 10, windowMs: 60_000 }, // 10/minute
  { path: "/api/attente",              max: 3,   windowMs:   60_000  }, // 3/minute
  { path: "/api/initialisation",       max: 10,  windowMs:   60_000  }, // 10/minute
  { path: "/api/quiz",                 max: 30,  windowMs:   60_000  }, // 30/minute
  { path: "/api/schemas",              max: 30,  windowMs:   60_000  }, // 30/minute
  { path: "/api/outils-resultats",     max: 30,  windowMs:   60_000  }, // 30/minute
  { path: "/api/compte/suppression",   max: 3,   windowMs: 3_600_000 }, // 3/heure
];

// Rate limiting par IP en mémoire
// Note : migrer vers Redis (Upstash) pour persistance entre instances Vercel
const ipStore = new Map<string, { count: number; resetAt: number }>();

const AUTH_MAX = 5;
const AUTH_WINDOW = 60_000;

function getIP(request: NextRequest): string {
  return (
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "unknown"
  );
}

function checkIPRateLimit(key: string, max: number, windowMs: number): boolean {
  const now = Date.now();
  const entry = ipStore.get(key);

  if (!entry || now > entry.resetAt) {
    ipStore.set(key, { count: 1, resetAt: now + windowMs });
    return false; // pas limité
  }

  entry.count++;
  return entry.count > max; // limité si dépasse
}

async function getUser(request: NextRequest) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!supabaseUrl || !supabaseAnonKey) return null;

  const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll() {},
    },
  });

  const { data } = await supabase.auth.getUser();
  return data.user;
}

export default async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const ip = getIP(request);

  // Rate limiting auth par IP (remplace le cookie)
  const isAuthRateLimited = authRateLimitPaths.some((p) => pathname.startsWith(p));
  if (isAuthRateLimited) {
    const key = `auth:${ip}`;
    if (checkIPRateLimit(key, AUTH_MAX, AUTH_WINDOW)) {
      return new NextResponse("Trop de tentatives. Reessaie dans une minute.", {
        status: 429,
        headers: { "Retry-After": "60" },
      });
    }
  }

  // Rate limiting routes API par IP
  const apiLimit = apiRateLimits.find((r) => pathname.startsWith(r.path));
  if (apiLimit) {
    const key = `api:${apiLimit.path}:${ip}`;
    if (checkIPRateLimit(key, apiLimit.max, apiLimit.windowMs)) {
      return new NextResponse("Trop de requetes.", {
        status: 429,
        headers: { "Retry-After": String(Math.ceil(apiLimit.windowMs / 1000)) },
      });
    }
  }

  const isProtected = protectedPaths.some((p) => pathname.startsWith(`/${pathname.split("/")[1]}${p}`) || pathname.endsWith(p) || pathname.includes(`${p}/`));
  const isApiProtected = apiProtectedPaths.some((p) => pathname.startsWith(p));

  if (isProtected || isApiProtected) {
    const user = await getUser(request);

    if (!user) {
      if (isApiProtected) {
        return new NextResponse("Non autorise", { status: 401 });
      }
      const locale = pathname.split("/")[1] === "en" ? "en" : "fr";
      const loginUrl = new URL(`/${locale}/auth/login`, request.url);
      loginUrl.searchParams.set("redirect", pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  return intlMiddleware(request);
}

export const config = {
  matcher: ["/", "/(fr|en)/:path*", "/((?!api|_next|_vercel|auth|.*\\..*).*)", "/api/stripe/checkout/:path*", "/api/stripe/link-subscription/:path*", "/api/ia/:path*", "/api/parcours/:path*", "/api/quiz/:path*", "/api/badges/:path*", "/api/mc-progress/:path*", "/api/attente/:path*", "/api/initialisation/:path*", "/api/schemas/:path*", "/api/outils-resultats/:path*", "/api/compte/suppression/:path*", "/api/consentement/:path*"],
};
