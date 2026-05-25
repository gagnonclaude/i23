import { setRequestLocale } from "next-intl/server";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { SignupForm } from "@/components/auth/SignupForm";

export const dynamic = "force-dynamic";

export default async function SignupPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);

  async function signup(formData: FormData) {
    "use server";
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const prenom = formData.get("prenom") as string;

    const supabase = await createClient();

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { prenom } },
    });

    if (error) {
      redirect(`/${locale}/auth/signup?error=${encodeURIComponent(error.message)}`);
    }

    const { error: loginError } = await supabase.auth.signInWithPassword({ email, password });

    if (loginError) {
      redirect(`/${locale}/auth/signup?error=${encodeURIComponent(loginError.message)}`);
    }

    redirect(`/${locale}/auth/consentement`);
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-i23-gris-fonce">i23</h1>
        </div>
        <div className="bg-white border border-i23-gris-pale rounded-2xl p-8">
          <SignupForm action={signup} />
        </div>
      </div>
    </div>
  );
}
