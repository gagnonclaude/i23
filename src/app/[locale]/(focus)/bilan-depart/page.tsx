import { setRequestLocale } from "next-intl/server";
import { BilanDepartForm } from "@/components/bilan/BilanDepartForm";

export default async function BilanDepartPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <div className="py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <BilanDepartForm />
      </div>
    </div>
  );
}
