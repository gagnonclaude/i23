import { setRequestLocale } from "next-intl/server";
import { CompleterForm } from "@/components/auth/CompleterForm";

export default async function CompleterPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ session_id?: string; email?: string }>;
}) {
  const { locale } = await params;
  const { session_id, email } = await searchParams;
  setRequestLocale(locale);

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <img src="/logo.png" alt="i23" className="h-[52px] mx-auto mb-4" />
        </div>
        <div className="bg-white border border-i23-gris-pale rounded-2xl p-8">
          <CompleterForm sessionId={session_id || null} fallbackEmail={email || null} />
        </div>
      </div>
    </div>
  );
}
