import { setRequestLocale } from "next-intl/server";
import { SchemaForm } from "@/components/schema/SchemaForm";

export default async function SchemaPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <div className="py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SchemaForm />
      </div>
    </div>
  );
}
