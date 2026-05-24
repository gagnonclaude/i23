import { setRequestLocale } from "next-intl/server";
import { getMasterclass } from "@/lib/masterclass";
import { MasterclassViewer } from "@/components/masterclass/MasterclassViewer";
import { notFound } from "next/navigation";

export default async function MasterclassSlugPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  const mc = getMasterclass(slug);
  if (!mc) notFound();

  return (
    <div className="py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <MasterclassViewer mc={mc} />
      </div>
    </div>
  );
}
