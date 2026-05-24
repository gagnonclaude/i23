import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { createClient } from "@/lib/supabase/server";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }

  const { session_id } = await req.json();

  if (!session_id) {
    return NextResponse.json({ error: "session_id manquant" }, { status: 400 });
  }

  try {
    const session = await stripe.checkout.sessions.retrieve(session_id);
    const subscription = session.subscription as string;
    const customerEmail = session.customer_email || session.customer_details?.email || null;

    if (!subscription || customerEmail !== user.email) {
      return NextResponse.json({ error: "Impossible de lier" }, { status: 400 });
    }

    let currentPeriodEnd: string | null = null;
    try {
      const sub = await stripe.subscriptions.retrieve(subscription) as unknown as Stripe.Subscription & { current_period_end: number };
      currentPeriodEnd = new Date(sub.current_period_end * 1000).toISOString();
    } catch {}

    if (!currentPeriodEnd) {
      currentPeriodEnd = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString();
    }

    const { error } = await supabase
      .from("subscriptions")
      .upsert({
        user_id: user.id,
        stripe_customer_id: session.customer as string,
        stripe_subscription_id: subscription,
        status: "active",
        current_period_end: currentPeriodEnd,
      }, { onConflict: "stripe_subscription_id" });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Erreur Stripe" }, { status: 500 });
  }
}
