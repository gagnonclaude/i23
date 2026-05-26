import { setRequestLocale } from "next-intl/server";
import { MethodeContent } from "@/components/methode/MethodeContent";

export default async function MethodePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);

  return <MethodeContent />;
}
