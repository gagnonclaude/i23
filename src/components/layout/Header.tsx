"use client";

import { useTranslations } from "next-intl";
import { Link, useRouter, usePathname } from "@/i18n/routing";
import { createClient } from "@/lib/supabase/client";
import { useEffect, useState } from "react";

export function Header() {
  const t = useTranslations("nav");
  const [isMember, setIsMember] = useState(false);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data: { user } }) => {
      setIsMember(!!user);
    });
  }, []);

  return (
    <header className="fixed top-0 w-full bg-white/90 backdrop-blur-md border-b border-i23-gris-pale z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-[72px]">
        <Link href={isMember ? "/dashboard" : "/"} className="flex items-center gap-2">
          <img src="/logo.png" alt="i23" className="h-[42px] w-auto" />
        </Link>

        {isMember && (
          <nav className="hidden md:flex items-center gap-8 text-sm text-i23-gris-fonce/70">
            <Link href="/dashboard" className="hover:text-i23-turquoise transition-colors">{t("parcours")}</Link>
            <Link href="/masterclass" className="hover:text-i23-turquoise transition-colors">{t("comprendre")}</Link>
            <Link href="/schema" className="hover:text-i23-turquoise transition-colors">{t("modifier")}</Link>
            <Link href="/experimentation" className="hover:text-i23-turquoise transition-colors">{t("experimenter")}</Link>
          </nav>
        )}

        <div className="flex items-center gap-4">
          <LangSwitcher />
          {isMember ? (
            <form action="/auth/logout" method="POST">
              <button type="submit" className="text-sm text-i23-gris-fonce/70 hover:text-i23-turquoise transition-colors">
                {t("deconnexion")}
              </button>
            </form>
          ) : (
            <Link
              href="/auth/login"
              className="text-sm text-i23-gris-fonce/70 hover:text-i23-turquoise transition-colors"
            >
              {t("dejaIp")} {t("connexion")}
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}

function LangSwitcher() {
  const router = useRouter();
  const pathname = usePathname();

  return (
    <div className="flex items-center gap-1 text-xs">
      <button
        onClick={() => router.replace(pathname, { locale: "fr" })}
        className="px-2 py-1 rounded hover:bg-i23-gris-pale/50 text-i23-gris-fonce/70 hover:text-i23-turquoise transition-colors"
      >
        FR
      </button>
      <button
        onClick={() => router.replace(pathname, { locale: "en" })}
        className="px-2 py-1 rounded hover:bg-i23-gris-pale/50 text-i23-gris-fonce/70 hover:text-i23-turquoise transition-colors"
      >
        EN
      </button>
    </div>
  );
}
