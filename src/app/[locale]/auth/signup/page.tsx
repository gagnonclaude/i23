import { setRequestLocale } from "next-intl/server";
import { SignupForm } from "@/components/auth/SignupForm";

export const dynamic = "force-dynamic";

export default async function SignupPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-i23-gris-fonce">i23</h1>
        </div>
        <div className="bg-white border border-i23-gris-pale rounded-2xl p-8">
          <SignupForm />
        </div>
      </div>
    </div>
  );
}
