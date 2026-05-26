import { setRequestLocale } from "next-intl/server";
import { MasterclassList } from "@/components/masterclass/MasterclassList";

export default async function MasterclassPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);

  return <MasterclassList />;
}
