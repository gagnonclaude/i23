import { setRequestLocale } from "next-intl/server";
import { OutilsList } from "@/components/outils/OutilsList";

export default async function OutilsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);

  return <OutilsList />;
}
