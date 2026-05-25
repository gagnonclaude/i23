import { setRequestLocale } from "next-intl/server";
import { SignupForm } from "@/components/auth/SignupForm";
import { Suspense } from "react";

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
          <Suspense fallback={<div className="space-y-5 animate-pulse"><div className="h-4 bg-i23-gris-pale rounded w-1/4 mb-1"></div><div className="h-10 bg-i23-gris-pale rounded"></div><div className="h-4 bg-i23-gris-pale rounded w-1/4 mb-1 mt-5"></div><div className="h-10 bg-i23-gris-pale rounded"></div><div className="h-4 bg-i23-gris-pale rounded w-1/4 mb-1 mt-5"></div><div className="h-10 bg-i23-gris-pale rounded"></div><div className="h-10 bg-i23-turquoise/30 rounded mt-5"></div></div>}>
            <SignupForm />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
