"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { createClient } from "@/lib/supabase/client";
import { useEffect, useState } from "react";

export function Footer() {
  const t = useTranslations("footer");
  const [isMember, setIsMember] = useState(false);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data: { user } }) => {
      setIsMember(!!user);
    });
  }, []);

  return (
    <footer className="bg-i23-gris-fonce text-white/70">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {isMember ? (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <Link href="/dashboard" className="inline-block">
                <span className="text-3xl font-bold text-white">i23</span>
              </Link>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4 text-sm">{t("methode")}</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="/methode" className="hover:text-i23-turquoise transition-colors">{t("etapes")}</Link></li>
                <li><Link href="/methode" className="hover:text-i23-turquoise transition-colors">{t("schemas")}</Link></li>
                <li><Link href="/methode" className="hover:text-i23-turquoise transition-colors">{t("trajectoires")}</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4 text-sm">{t("services")}</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="/masterclass" className="hover:text-i23-turquoise transition-colors">{t("masterclass")}</Link></li>
                <li><Link href="/outils" className="hover:text-i23-turquoise transition-colors">{t("outils")}</Link></li>
                <li><Link href="/groupes" className="hover:text-i23-turquoise transition-colors">{t("groupes")}</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4 text-sm">i23</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="/confidentialite" className="hover:text-i23-turquoise transition-colors">{t("confidentialite")}</Link></li>
              </ul>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-2">
            <span className="text-2xl font-bold text-white">i23</span>
          </div>
        )}
        <div className="border-t border-white/10 mt-8 pt-6 text-center text-xs">
          &copy; {new Date().getFullYear()} i23. {t("copyright")}
        </div>
      </div>
    </footer>
  );
}
