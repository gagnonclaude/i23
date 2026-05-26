import { setRequestLocale } from "next-intl/server";
import { IACoach } from "@/components/ia/IACoach";

export default async function IAPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);

  return <IACoach />;
}
