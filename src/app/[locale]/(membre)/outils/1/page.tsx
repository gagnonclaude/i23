import { setRequestLocale } from "next-intl/server";
import { OutilsEtape1List } from "@/components/outils/OutilsEtape1List";

export default async function OutilsEtape1Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);

  return <OutilsEtape1List />;
}
