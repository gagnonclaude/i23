import { setRequestLocale } from "next-intl/server";
import { CompteParametres } from "@/components/compte/CompteParametres";

export default async function ComptePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      <CompteParametres />
    </div>
  );
}
