import { prisma } from "@/lib/prisma";

export async function isExplorerSubscriber(userId: string): Promise<boolean> {
  const sub = await prisma.subscription.findUnique({
    where: { userId },
  });

  if (!sub) return false;
  return sub.status === "active" || sub.status === "trialing";
}

export async function getSubscription(userId: string) {
  return prisma.subscription.findUnique({
    where: { userId },
  });
}

export async function createOrUpdateSubscription(
  userId: string,
  plan: string,
  status: string,
  stripeSubscriptionId: string,
  stripeCustomerId: string,
  currentPeriodEnd: Date,
) {
  return prisma.subscription.upsert({
    where: { userId },
    create: {
      userId,
      plan,
      status,
      stripeSubscriptionId,
      stripeCustomerId,
      currentPeriodEnd,
    },
    update: {
      plan,
      status,
      stripeSubscriptionId,
      stripeCustomerId,
      currentPeriodEnd,
    },
  });
}

export function getPricingPlans() {
  return {
    // Consumer Plans
    explorer_monthly: {
      priceId: process.env.STRIPE_PRICE_EXPLORER_MONTHLY,
      name: "Explorer",
      price: 4.99,
      interval: "month",
      type: "consumer",
    },
    explorer_yearly: {
      priceId: process.env.STRIPE_PRICE_EXPLORER_YEARLY,
      name: "Explorer",
      price: 49.99,
      interval: "year",
      type: "consumer",
    },
    pro_monthly: {
      priceId: process.env.STRIPE_PRICE_PRO_MONTHLY,
      name: "Pro",
      price: 10.99,
      interval: "month",
      type: "consumer",
    },
    pro_yearly: {
      priceId: process.env.STRIPE_PRICE_PRO_YEARLY,
      name: "Pro",
      price: 109.99,
      interval: "year",
      type: "consumer",
    },
    // Resort Plans
    resort_starter_monthly: {
      priceId: process.env.STRIPE_PRICE_RESORT_STARTER_MONTHLY,
      name: "Resort Starter",
      price: 99,
      interval: "month",
      type: "resort",
    },
    resort_starter_yearly: {
      priceId: process.env.STRIPE_PRICE_RESORT_STARTER_YEARLY,
      name: "Resort Starter",
      price: 999,
      interval: "year",
      type: "resort",
    },
    resort_pro_monthly: {
      priceId: process.env.STRIPE_PRICE_RESORT_PRO_MONTHLY,
      name: "Resort Pro",
      price: 399,
      interval: "month",
      type: "resort",
    },
    resort_pro_yearly: {
      priceId: process.env.STRIPE_PRICE_RESORT_PRO_YEARLY,
      name: "Resort Pro",
      price: 3990,
      interval: "year",
      type: "resort",
    },
  };
}
