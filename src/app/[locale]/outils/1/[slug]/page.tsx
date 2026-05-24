import { setRequestLocale } from "next-intl/server";
import { ScanObservation } from "@/components/outils/ScanObservation";
import { notFound } from "next/navigation";

const outilsEtape1Slugs = ["scan-observation"];

export default async function OutilEtape1ToolPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  if (!outilsEtape1Slugs.includes(slug)) {
    notFound();
  }

  return <ScanObservation />;
}
