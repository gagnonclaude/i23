import { setRequestLocale } from "next-intl/server";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { LoginForm } from "@/components/auth/LoginForm";

export const dynamic = "force-dynamic";

export default async function LoginPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);

  async function login(formData: FormData) {
    "use server";
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    const supabase = await createClient();
    const { error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      redirect(`/${locale}/auth/login?error=invalid`);
    }

    redirect(`/${locale}/initialisation`);
  }

  const searchParams_error = undefined;

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-i23-gris-fonce">i23</h1>
        </div>
        <div className="bg-white border border-i23-gris-pale rounded-2xl p-8">
          <LoginForm action={login} />
        </div>
      </div>
    </div>
  );
}
