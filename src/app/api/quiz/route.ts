import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { calculerResultat, quizMethode } from "@/lib/quiz";
import { earnBadge } from "@/lib/badges";
import { advanceTo } from "@/lib/parcours";
import { validateOrigin } from "@/lib/csrf";

export async function GET(req: NextRequest) {
  const mcId = req.nextUrl.searchParams.get("mc_id");
  if (mcId === "methode-i+") {
    return NextResponse.json({ questions: quizMethode });
  }
  return NextResponse.json({ error: "MC non trouvé" }, { status: 404 });
}

export async function POST(req: NextRequest) {
  const originError = validateOrigin(req);
  if (originError) return originError;

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Non autorise" }, { status: 401 });

  const body = await req.json();
  const { mc_id, reponses } = body as { mc_id: string; reponses: Record<string, string> };

  if (!mc_id || !reponses) {
    return NextResponse.json({ error: "mc_id et reponses requis" }, { status: 400 });
  }

  const questions = mc_id === "methode-i+" ? quizMethode : [];
  if (questions.length === 0) {
    return NextResponse.json({ error: "Quiz non trouvé pour cette MC" }, { status: 404 });
  }

  const resultat = calculerResultat(reponses, questions);

  await supabase.from("quiz_results").insert({
    user_id: user.id,
    mc_id,
    score: resultat.score,
    reussi: resultat.reussi,
    reponses,
  });

  if (resultat.reussi) {
    if (mc_id === "methode-i+") {
      await earnBadge(user.id, "methode-i+");
      await advanceTo("badge-methode");
    } else {
      await earnBadge(user.id, "thematique", mc_id);
      await advanceTo("badge-thematique");
    }
  }

  return NextResponse.json(resultat);
}
