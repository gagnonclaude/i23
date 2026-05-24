import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import { QuizForm } from "@/components/parcours/QuizForm";
import { quizEnergie } from "@/lib/quiz";

export default async function QuizEnergiePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect(`/${locale}/auth/login`);

  // Vérifier que le badge Méthode i+ est obtenu
  const { data: badge } = await supabase
    .from("badges_earned")
    .select("id")
    .eq("user_id", user.id)
    .eq("badge_type", "methode-i+")
    .single();

  if (!badge) redirect(`/${locale}/dashboard`);

  return <QuizForm questions={quizEnergie} mcId="energie" onSuccess={(score, total, reussi) => {
    if (typeof window !== "undefined") {
      window.location.href = reussi ? `/${locale}/dashboard` : `/${locale}/quiz/energie`;
    }
  }} />;
}
