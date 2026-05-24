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
const apiProtectedPaths = ["/api/stripe/checkout", "/api/stripe/link-subscription", "/api/stripe/webhook", "/api/ia", "/api/parcours", "/api/quiz", "/api/badges", "/api/mc-progress"];
const authRateLimitPaths = ["/auth/login", "/auth/signup"];
const MAX_AUTH_ATTEMPTS = 5;
const RATE_LIMIT_WINDOW = 60_000;

function checkRateLimit(request: NextRequest): NextResponse | null {
  const attemptsCookie = request.cookies.get("auth_attempts")?.value;
  const attempts = attemptsCookie ? JSON.parse(attemptsCookie) : [];
  const now = Date.now();
  const recentAttempts = attempts.filter((t: number) => now - t < RATE_LIMIT_WINDOW);

  if (recentAttempts.length >= MAX_AUTH_ATTEMPTS) {
    return new NextResponse("Trop de tentatives. Reessaie dans une minute.", {
      status: 429,
      headers: { "Retry-After": "60" },
    });
  }

  return null;
}

async function getUser(request: NextRequest) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!supabaseUrl || !supabaseAnonKey) return null;

  let sessionUser: null | { id: string } = null;

  const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll() {},
    },
  });

  const { data } = await supabase.auth.getUser();
  sessionUser = data.user;
  return sessionUser;
}

export default async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isAuthRateLimited = authRateLimitPaths.some((p) => pathname.includes(p));
  if (isAuthRateLimited) {
    const rateLimitResponse = checkRateLimit(request);
    if (rateLimitResponse) return rateLimitResponse;
  }

  const isProtected = protectedPaths.some((p) => pathname.includes(p));
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
  matcher: ["/", "/(fr|en)/:path*", "/((?!api|_next|_vercel|auth|.*\\..*).*)", "/api/stripe/checkout/:path*", "/api/stripe/link-subscription/:path*", "/api/stripe/webhook/:path*", "/api/ia/:path*"],
};
