import { setRequestLocale } from "next-intl/server";
import { GroupesContent } from "@/components/groupes/GroupesContent";

export default async function GroupesPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);

  return <GroupesContent />;
}
