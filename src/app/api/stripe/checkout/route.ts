import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { createClient } from "@/lib/supabase/server";
import { ALLOWED_PRICES } from "@/lib/config-public";
import { validateOrigin } from "@/lib/csrf";
import { logAudit } from "@/lib/audit";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(req: NextRequest) {
  const originError = validateOrigin(req);
  if (originError) return originError;

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }

  const { priceId } = await req.json();

  if (!priceId || !ALLOWED_PRICES.includes(priceId)) {
    return NextResponse.json({ error: "priceId invalide" }, { status: 400 });
  }

  const session = await stripe.checkout.sessions.create({
    customer_email: user.email!,
    line_items: [{ price: priceId, quantity: 1 }],
    mode: "subscription",
    success_url: `${process.env.NEXT_PUBLIC_SITE_URL}/dashboard?checkout=success`,
    cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL}/acces?checkout=cancelled`,
    metadata: { userId: user.id },
  });

  await logAudit({
    action: "stripe.checkout.session_created",
    user_id: user.id,
    metadata: { priceId, session_id: session.id },
  });

  return NextResponse.json({ url: session.url });
}
