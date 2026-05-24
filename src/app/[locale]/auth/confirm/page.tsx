"use client";

import { createClient } from "@/lib/supabase/client";
import { useRouter } from "@/i18n/routing";
import { useEffect } from "react";
import { useTranslations } from "next-intl";

export default function ConfirmPage() {
  const t = useTranslations("auth");
  const router = useRouter();

  useEffect(() => {
    const confirm = async () => {
      const supabase = createClient();
      const { error } = await supabase.auth.getSession();
      if (!error) {
        router.push("/dashboard");
      }
    };
    confirm();
  }, [router]);

  return (
    <div className="min-h-[80vh] flex items-center justify-center">
      <div className="text-center">
        <div className="w-12 h-12 border-4 border-i23-turquoise border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-i23-gris-fonce">{t("confirming")}</p>
      </div>
    </div>
  );
}
