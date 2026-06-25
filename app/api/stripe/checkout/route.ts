import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { stripe } from "@/lib/stripe";
import { getPricingPlans } from "@/lib/subscription";

const ORIGIN = process.env.NEXT_PUBLIC_APP_URL || "https://peakflow.io";

export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json(
        { error: "Unauthorized", redirect: "/login" },
        { status: 401 }
      );
    }

    const { plan } = await req.json();
    const plans = getPricingPlans();
    const selectedPlan = plans[plan as keyof typeof plans];

    if (!selectedPlan || !selectedPlan.priceId) {
      return NextResponse.json({ error: "Invalid plan" }, { status: 400 });
    }

    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      payment_method_types: ["card"],
      customer_email: user.email,
      line_items: [
        {
          price: selectedPlan.priceId,
          quantity: 1,
        },
      ],
      success_url: `${ORIGIN}/account?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${ORIGIN}/pricing`,
      metadata: {
        userId: user.id,
        plan,
      },
    });

    return NextResponse.json({ sessionId: session.id, url: session.url });
  } catch (error) {
    console.error("Checkout error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
