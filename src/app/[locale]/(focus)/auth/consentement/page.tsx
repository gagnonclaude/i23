import { setRequestLocale } from "next-intl/server";
import { ConsentementForm } from "@/components/auth/ConsentementForm";

export default async function ConsentementPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-4">
      <div className="w-full max-w-lg">
        <ConsentementForm />
      </div>
    </div>
  );
}
