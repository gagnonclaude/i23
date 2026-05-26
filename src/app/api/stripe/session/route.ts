import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

export async function GET(req: NextRequest) {
  if (!process.env.STRIPE_SECRET_KEY) {
    return NextResponse.json({ error: "Configuration Stripe manquante" }, { status: 500 });
  }
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

  const sessionId = req.nextUrl.searchParams.get("session_id");

  if (!sessionId || !/^cs_test_[a-zA-Z0-9]+$/.test(sessionId) && !/^cs_[a-zA-Z0-9]+$/.test(sessionId)) {
    return NextResponse.json({ error: "session_id invalide" }, { status: 400 });
  }

  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    const email = session.customer_email || session.customer_details?.email || null;
    return NextResponse.json({ email });
  } catch {
    return NextResponse.json({ email: null });
  }
}
