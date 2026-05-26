import { createClient } from "@/lib/supabase/server";
import { getParcoursState } from "@/lib/parcours";
import { parcoursConfig } from "@/lib/config";
import Link from "next/link";

const FOCUS_ETAPES = [
  { id: "consentement", nom: "Tes données" },
  { id: "initialisation", nom: "Initialisation i+" },
  { id: "bilan-depart", nom: "Bilan de départ" },
];

const MESSAGES: Record<string, string> = {
  "completer":     "Plus qu'une étape avant de commencer.",
  "consentement":  "Choisis comment on gère tes données.",
  "initialisation": "Configure ton profil et tes priorités.",
  "bilan-depart":  "Quelques questions pour mieux te connaître.",
  "checkout":      "Choisis ton forfait pour commencer.",
  "default":       "Tu es sur la bonne voie.",
};

async function getFocusContext(pathname: string) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    const prenom = user?.user_metadata?.prenom || null;

    const parcoursState = user ? await getParcoursState() : null;
    const etapeIdx = parcoursState
      ? parcoursConfig.etapes.findIndex((e) => e.id === parcoursState.etapeActuelle)
      : 0;
    const totalEtapes = parcoursConfig.etapes.length;
    const progression = Math.round(((etapeIdx + 1) / totalEtapes) * 100);

    const segment = pathname.split("/").filter(Boolean).pop() || "default";
    const message = MESSAGES[segment] || MESSAGES["default"];

    return { prenom, progression, message };
  } catch {
    return { prenom: null, progression: 0, message: MESSAGES["default"] };
  }
}

export default async function FocusLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const { prenom, progression, message } = await getFocusContext("");

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <header className="w-full border-b border-i23-gris-pale bg-white">
        <div className="max-w-lg mx-auto px-4 py-4 flex flex-col items-center gap-3">
          <Link href={`/${locale}`}>
            <img src="/logo.png" alt="i23" className="h-[36px] w-auto" />
          </Link>
          <div className="w-full bg-i23-gris-pale rounded-full h-1.5">
            <div
              className="bg-i23-turquoise h-1.5 rounded-full transition-all"
              style={{ width: `${progression}%` }}
            />
          </div>
          <p className="text-sm text-i23-gris-fonce/70 text-center">
            {prenom ? (
              <span><span className="font-semibold text-i23-gris-fonce">{prenom}</span>, {message}</span>
            ) : (
              message
            )}
          </p>
        </div>
      </header>
      <main className="flex-1">{children}</main>
    </div>
  );
}
