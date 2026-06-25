import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { createOrUpdateSubscription } from "@/lib/subscription";
import { prisma } from "@/lib/prisma";

const WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET;

export async function POST(req: NextRequest) {
  if (!WEBHOOK_SECRET || !stripe) {
    return NextResponse.json(
      { error: "Stripe not configured" },
      { status: 500 }
    );
  }

  try {
    const signature = req.headers.get("stripe-signature");
    if (!signature) {
      return NextResponse.json({ error: "No signature" }, { status: 400 });
    }

    const body = await req.text();
    const event = stripe.webhooks.constructEvent(body, signature, WEBHOOK_SECRET);

    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as any;
        const userId = session.metadata?.userId;
        const registrationId = session.metadata?.registrationId;

        if (registrationId) {
          const registration = await prisma.companyRegistration.findUnique({
            where: { id: registrationId },
          });

          if (registration && registration.status === "pending") {
            const sub = await stripe.subscriptions.retrieve(session.subscription as string);
            const subData = sub as any;

            const now = new Date();
            const planEndDate = new Date(subData.current_period_end * 1000);

            const company = await prisma.company.create({
              data: {
                type: registration.type as any,
                name: registration.name,
                email: registration.email,
                phone: registration.phone,
                website: registration.website,
                street: registration.street,
                city: registration.city,
                postalCode: registration.postalCode,
                country: registration.country,
                taxId: registration.taxId,
                plan: session.metadata.plan,
                planStartDate: now,
                planEndDate,
              },
            });

            const tempPassword = Math.random().toString(36).slice(-8);
            const hashedPassword = await require("bcryptjs").hash(tempPassword, 10);

            await prisma.companyEmployee.create({
              data: {
                companyId: company.id,
                name: registration.managerName,
                email: registration.managerEmail,
                password: hashedPassword,
                role: "manager",
              },
            });

            await prisma.companySubscription.create({
              data: {
                companyId: company.id,
                status: "active",
                stripeSubscriptionId: subData.id,
                stripeCustomerId: session.customer,
                currentPeriodEnd: new Date(subData.current_period_end * 1000),
              },
            });

            await prisma.companyRegistration.update({
              where: { id: registrationId },
              data: { status: "company_created" },
            });
          }
          break;
        }

        if (userId && session.customer_email) {
          const sub = await stripe.subscriptions.retrieve(session.subscription as string);
          const subData = sub as any;
          const planName = session.metadata.plan || "explorer_monthly";

          await createOrUpdateSubscription(
            userId,
            planName,
            subData.status === "active" ? "active" : "trialing",
            subData.id,
            session.customer as string,
            new Date(subData.current_period_end * 1000),
          );
        }
        break;
      }

      case "customer.subscription.updated": {
        const subscription = event.data.object as any;
        const record = await prisma.subscription.findUnique({
          where: { stripeSubscriptionId: subscription.id },
          select: { userId: true },
        });

        if (record) {
          await createOrUpdateSubscription(
            record.userId,
            subscription.metadata?.plan || "explorer_monthly",
            subscription.status,
            subscription.id,
            subscription.customer as string,
            new Date(subscription.current_period_end * 1000),
          );
        }
        break;
      }

      case "customer.subscription.deleted": {
        const subscription = event.data.object as any;
        const record = await prisma.subscription.findUnique({
          where: { stripeSubscriptionId: subscription.id },
        });

        if (record) {
          await prisma.subscription.update({
            where: { userId: record.userId },
            data: { status: "canceled" },
          });
        }
        break;
      }

      default:
        break;
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    return NextResponse.json(
      { error: "Webhook processing failed" },
      { status: 400 }
    );
  }
}
