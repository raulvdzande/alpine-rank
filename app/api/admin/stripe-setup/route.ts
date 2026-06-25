import { stripe } from "@/lib/stripe";
import { NextResponse } from "next/server";

export async function POST() {
  try {
    if (!stripe) {
      return NextResponse.json(
        { error: "Stripe not configured" },
        { status: 500 }
      );
    }

    console.log("🔧 Setting up Stripe products and prices...");

    // Consumer Products
    const explorerProduct = await stripe.products.create({
      name: "Explorer",
      description: "Alles om jouw perfecte skivakantie te vinden",
    });

    const explorerMonthly = await stripe.prices.create({
      product: explorerProduct.id,
      unit_amount: 499, // €4.99
      currency: "eur",
      recurring: { interval: "month" },
    });

    const explorerYearly = await stripe.prices.create({
      product: explorerProduct.id,
      unit_amount: 4999, // €49.99
      currency: "eur",
      recurring: { interval: "year" },
    });

    const proProduct = await stripe.products.create({
      name: "Pro (Consumer)",
      description: "Voor de skiër die niets aan het toeval overlaat",
    });

    const proMonthly = await stripe.prices.create({
      product: proProduct.id,
      unit_amount: 1099, // €10.99
      currency: "eur",
      recurring: { interval: "month" },
    });

    const proYearly = await stripe.prices.create({
      product: proProduct.id,
      unit_amount: 10999, // €109.99
      currency: "eur",
      recurring: { interval: "year" },
    });

    // Resort Products
    const resortStarterProduct = await stripe.products.create({
      name: "Resort Starter",
      description: "Professionele aanwezigheid op PeakFlow",
    });

    const resortStarterMonthly = await stripe.prices.create({
      product: resortStarterProduct.id,
      unit_amount: 9900, // €99
      currency: "eur",
      recurring: { interval: "month" },
    });

    const resortStarterYearly = await stripe.prices.create({
      product: resortStarterProduct.id,
      unit_amount: 99900, // €999
      currency: "eur",
      recurring: { interval: "year" },
    });

    const resortProProduct = await stripe.products.create({
      name: "Resort Pro",
      description: "Maximale zichtbaarheid en diepgaande data",
    });

    const resortProMonthly = await stripe.prices.create({
      product: resortProProduct.id,
      unit_amount: 39900, // €399
      currency: "eur",
      recurring: { interval: "month" },
    });

    const resortProYearly = await stripe.prices.create({
      product: resortProProduct.id,
      unit_amount: 399000, // €3.990
      currency: "eur",
      recurring: { interval: "year" },
    });

    const result = {
      explorer_monthly: explorerMonthly.id,
      explorer_yearly: explorerYearly.id,
      pro_monthly: proMonthly.id,
      pro_yearly: proYearly.id,
      resort_starter_monthly: resortStarterMonthly.id,
      resort_starter_yearly: resortStarterYearly.id,
      resort_pro_monthly: resortProMonthly.id,
      resort_pro_yearly: resortProYearly.id,
    };

    console.log("✅ Stripe setup complete!");
    console.log("Add these to your .env file:");
    console.log(JSON.stringify(result, null, 2));

    return NextResponse.json({
      success: true,
      message: "Stripe products created successfully",
      priceIds: result,
    });
  } catch (error) {
    console.error("Setup error:", error);
    return NextResponse.json(
      { success: false, error: String(error) },
      { status: 500 }
    );
  }
}
