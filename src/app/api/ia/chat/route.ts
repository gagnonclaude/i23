import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

const RATE_LIMITS = new Map<string, { count: number; resetAt: number }>();
const MAX_REQUESTS_PER_MINUTE = 15;
const RATE_LIMIT_WINDOW = 60_000;
const MAX_MESSAGES = 20;
const MAX_MESSAGE_LENGTH = 2000;
const VALID_LEVELS = ["discret", "accompagnement", "intensif"];

const SYSTEM_PROMPT = `Tu es Coach i+, un coach intelligent spécialisé dans la Méthode i+.

## Ton identité
- Tu es un coach et un guide, pas un psychologue ni un thérapeute
- Tu accompagnes sans juger, encourages sans manipuler, structures sans rigidité
- Tu tutoies le membre
- Tu parles en français par défaut

## La Méthode i+
Chaque expérience suit 8 étapes :
1. Observer — percevoir les informations
2. Prédire — créer des scénarios et anticipations
3. Ressentir — vivre les émotions
4. Choisir — prendre des décisions alignées avec ses valeurs
5. Planifier — préparer les stratégies
6. Agir — mettre en application
7. Évaluer — observer les résultats
8. Apprendre — intégrer les apprentissages

## Concepts clés
- Déclencheur : ce qui active une expérience
- Schéma d'expérience : les 8 étapes d'une expérience
- Menace : composante qui bloque, surcharge ou limite
- Opportunité : composante qui aide, soutient ou ouvre une possibilité
- Trajectoire : accumulation des expériences dans le temps
- Outils i+ : formulaires interactifs pour transformer une menace en opportunité

## Ce que tu fais
- Aider à identifier les déclencheurs
- Aider à décortiquer les schémas d'expérience
- Suggérer des opportunités pour remplacer les menaces
- Proposer les Outils i+ pertinents
- Encourager l'expérimentation
- Suivre l'évolution de la trajectoire

## Ce que tu ne fais PAS
- Remplacer un psychologue ou thérapeute
- Faire des diagnostics professionnels
- Manipuler les émotions
- Prendre des décisions à la place du membre
- Si le membre mentionne des pensées suicidaires ou une crise, oriente vers les ressources d'aide (988 pour le Canada, 911 pour les urgences)`;

function checkRateLimit(userId: string): boolean {
  const now = Date.now();
  const entry = RATE_LIMITS.get(userId);
  if (!entry || now > entry.resetAt) {
    RATE_LIMITS.set(userId, { count: 1, resetAt: now + RATE_LIMIT_WINDOW });
    return false;
  }
  entry.count++;
  return entry.count > MAX_REQUESTS_PER_MINUTE;
}

export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Non autorise" }, { status: 401 });
  }

  if (checkRateLimit(user.id)) {
    return NextResponse.json({ error: "Trop de requetes. Reessaie dans une minute." }, { status: 429 });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Requete invalide" }, { status: 400 });
  }

  if (!body || typeof body !== "object" || !("messages" in body) || !Array.isArray((body as Record<string, unknown>).messages)) {
    return NextResponse.json({ error: "Messages requis" }, { status: 400 });
  }

  const { messages, level } = body as { messages: unknown[]; level?: unknown };

  if (messages.length > MAX_MESSAGES) {
    return NextResponse.json({ error: `Maximum ${MAX_MESSAGES} messages` }, { status: 400 });
  }

  for (const msg of messages) {
    if (!msg || typeof msg !== "object" || !("content" in (msg as Record<string, unknown>))) {
      return NextResponse.json({ error: "Format de message invalide" }, { status: 400 });
    }
    const content = (msg as Record<string, unknown>).content;
    if (typeof content !== "string" || content.length > MAX_MESSAGE_LENGTH) {
      return NextResponse.json({ error: "Message trop long" }, { status: 400 });
    }
  }

  const safeLevel = VALID_LEVELS.includes(level as string) ? (level as string) : "accompagnement";

  const levelInstructions: Record<string, string> = {
    discret: "Tu interviens uniquement quand le membre te pose une question. Tu es discret et concis.",
    accompagnement: "Tu accompagnes activement le membre. Tu poses des questions, tu suggères des outils, tu fais des liens avec la Méthode i+.",
    intensif: "Tu es proactif. Tu analyses les messages, tu identifies les schémas, tu proposes des actions concrètes, tu suis la progression.",
  };

  const systemMessage = `${SYSTEM_PROMPT}\n\nNiveau d'accompagnement : ${safeLevel}\n${levelInstructions[safeLevel]}`;

  const openaiKey = process.env.OPENAI_API_KEY;
  if (!openaiKey) {
    return NextResponse.json({ error: "Clé OpenAI non configurée" }, { status: 500 });
  }

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${openaiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: systemMessage },
          ...messages,
        ],
        temperature: 0.7,
        max_tokens: 1000,
      }),
    });

    const data = await response.json();
    const reply = data.choices?.[0]?.message?.content || "Désolé, je n'ai pas pu répondre.";

    return NextResponse.json({ reply });
  } catch {
    return NextResponse.json({ error: "Erreur de communication avec l'IA" }, { status: 500 });
  }
}
