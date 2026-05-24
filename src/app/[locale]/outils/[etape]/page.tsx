import { setRequestLocale } from "next-intl/server";
import { OutilForm } from "@/components/outils/OutilForm";
import { notFound } from "next/navigation";
import { methodeConfig } from "@/lib/config";

export default async function OutilEtapePage({
  params,
}: {
  params: Promise<{ locale: string; etape: string }>;
}) {
  const { locale, etape } = await params;
  setRequestLocale(locale);

  const etapeNumero = parseInt(etape, 10);
  if (!methodeConfig.etapes.find((e) => e.numero === etapeNumero)) {
    notFound();
  }

  return <OutilForm etapeNumero={etapeNumero} />;
}
