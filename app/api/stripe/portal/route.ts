import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { stripe } from "@/lib/stripe";
import { getSubscription } from "@/lib/subscription";

const ORIGIN = process.env.NEXT_PUBLIC_APP_URL || "https://peakflow.io";

export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const sub = await getSubscription(user.id);
    if (!sub?.stripeCustomerId) {
      return NextResponse.json(
        { error: "No active subscription" },
        { status: 400 }
      );
    }

    const session = await stripe.billingPortal.sessions.create({
      customer: sub.stripeCustomerId,
      return_url: `${ORIGIN}/account`,
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error("Portal error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
