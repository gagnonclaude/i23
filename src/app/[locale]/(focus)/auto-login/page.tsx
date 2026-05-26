"use client";

import { useEffect } from "react";
import { createClient } from "@/lib/supabase/client";

export default function AutoLoginPage() {
  useEffect(() => {
    const supabase = createClient();

    // Supabase SSR détecte automatiquement le #access_token dans le hash
    supabase.auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_IN" && session) {
        window.location.replace("/fr/initialisation");
      }
    });

    // Déclenche la détection du hash
    supabase.auth.getSession();
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <p className="text-i23-gris-fonce">Connexion en cours...</p>
    </div>
  );
}
