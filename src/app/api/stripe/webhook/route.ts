import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { createAdminClient } from "@/lib/supabase/admin";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export async function POST(req: NextRequest) {
  const body = await req.text();
  const signature = req.headers.get("stripe-signature");

  if (!signature) {
    return NextResponse.json({ error: "Signature manquante" }, { status: 400 });
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch {
    return NextResponse.json({ error: "Signature invalide" }, { status: 400 });
  }

  const supabase = createAdminClient();

  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object as Stripe.Checkout.Session;
      const customerEmail = session.customer_email || session.customer_details?.email || null;
      const subscription = session.subscription as string;
      const userId = session.metadata?.userId || null;

      let currentPeriodEnd: string | null = null;

      if (subscription) {
        try {
          const sub = await stripe.subscriptions.retrieve(subscription) as unknown as Stripe.Subscription & { current_period_end: number };
          currentPeriodEnd = new Date(sub.current_period_end * 1000).toISOString();
        } catch {}
      }

      if (!currentPeriodEnd) {
        currentPeriodEnd = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString();
      }

      if (userId) {
        await supabase
          .from("subscriptions")
          .upsert({
            user_id: userId,
            stripe_customer_id: session.customer as string,
            stripe_subscription_id: subscription,
            status: "active",
            current_period_end: currentPeriodEnd,
          }, { onConflict: "stripe_subscription_id" });
      } else if (customerEmail) {
        const { data: { users } } = await supabase.auth.admin.listUsers();
        const existingUser = users?.find(u => u.email === customerEmail);

        if (existingUser) {
          await supabase
            .from("subscriptions")
            .upsert({
              user_id: existingUser.id,
              stripe_customer_id: session.customer as string,
              stripe_subscription_id: subscription,
              status: "active",
              current_period_end: currentPeriodEnd,
            }, { onConflict: "stripe_subscription_id" });
        }
      }
      break;
    }

    case "customer.subscription.updated": {
      const subscription = event.data.object as Stripe.Subscription & { current_period_end: number };
      await supabase
        .from("subscriptions")
        .update({
          status: subscription.status,
          current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
        })
        .eq("stripe_subscription_id", subscription.id);
      break;
    }

    case "customer.subscription.deleted": {
      const subscription = event.data.object as Stripe.Subscription;
      await supabase
        .from("subscriptions")
        .update({ status: "canceled" })
        .eq("stripe_subscription_id", subscription.id);
      break;
    }
  }

  return NextResponse.json({ received: true });
}
