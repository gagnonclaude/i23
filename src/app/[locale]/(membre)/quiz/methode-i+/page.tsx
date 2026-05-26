import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import { QuizForm } from "@/components/parcours/QuizForm";
import { quizMethode } from "@/lib/quiz";

export default async function QuizMethodePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect(`/${locale}/auth/login`);

  return <QuizForm questions={quizMethode} mcId="methode-i+" onSuccess={(score, total, reussi) => {
    if (typeof window !== "undefined") {
      window.location.href = reussi ? `/${locale}/dashboard` : `/${locale}/quiz/methode-i+`;
    }
  }} />;
}
