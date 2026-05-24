import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { createAdminClient } from "@/lib/supabase/admin";
import { logAudit } from "@/lib/audit";

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
    await logAudit({ action: "stripe.webhook.signature_invalide", metadata: { signature: signature?.slice(0, 20) } });
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
        } catch (err) {
          console.error("Erreur retrieval subscription Stripe:", err);
        }
      }

      if (!currentPeriodEnd) {
        return NextResponse.json({ error: "Impossible de déterminer la période" }, { status: 500 });
      }

      if (userId) {
        const { error } = await supabase
          .from("subscriptions")
          .upsert({
            user_id: userId,
            stripe_customer_id: session.customer as string,
            stripe_subscription_id: subscription,
            status: "active",
            current_period_end: currentPeriodEnd,
          }, { onConflict: "stripe_subscription_id" });

        if (error) {
          console.error("Erreur upsert subscription (userId):", error);
          return NextResponse.json({ error: "Erreur enregistrement" }, { status: 500 });
        }
        await logAudit({ action: "stripe.webhook.abonnement_active", user_id: userId, metadata: { subscription_id: subscription, session_id: session.id } });
      } else if (customerEmail) {
        const { data: { users }, error: listError } = await supabase.auth.admin.listUsers({ page: 1, perPage: 1000 });

        if (listError) {
          console.error("Erreur listUsers:", listError);
          return NextResponse.json({ error: "Erreur recherche utilisateur" }, { status: 500 });
        }

        const existingUser = users?.find(u => u.email === customerEmail);

        if (existingUser) {
          const { error } = await supabase
            .from("subscriptions")
            .upsert({
              user_id: existingUser.id,
              stripe_customer_id: session.customer as string,
              stripe_subscription_id: subscription,
              status: "active",
              current_period_end: currentPeriodEnd,
            }, { onConflict: "stripe_subscription_id" });

          if (error) {
            console.error("Erreur upsert subscription (email):", error);
            return NextResponse.json({ error: "Erreur enregistrement" }, { status: 500 });
          }
        }
      }
      break;
    }

    case "customer.subscription.updated": {
      const subscription = event.data.object as Stripe.Subscription & { current_period_end: number };
      const { error } = await supabase
        .from("subscriptions")
        .update({
          status: subscription.status,
          current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
        })
        .eq("stripe_subscription_id", subscription.id);

      if (error) {
        console.error("Erreur update subscription:", error);
      }
      await logAudit({ action: "stripe.webhook.abonnement_mis_a_jour", metadata: { subscription_id: subscription.id, status: subscription.status } });
      break;
    }

    case "customer.subscription.deleted": {
      const subscription = event.data.object as Stripe.Subscription;
      const { error } = await supabase
        .from("subscriptions")
        .update({ status: "canceled" })
        .eq("stripe_subscription_id", subscription.id);

      if (error) {
        console.error("Erreur cancel subscription:", error);
      }
      await logAudit({ action: "stripe.webhook.abonnement_annule", metadata: { subscription_id: subscription.id } });
      break;
    }
  }

  return NextResponse.json({ received: true });
}
