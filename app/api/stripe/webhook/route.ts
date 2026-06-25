import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { createOrUpdateSubscription } from "@/lib/subscription";
import { prisma } from "@/lib/prisma";
import { Resend } from "resend";

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

const WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET;

export async function POST(req: NextRequest) {
  if (!WEBHOOK_SECRET) {
    return NextResponse.json(
      { error: "Webhook secret not configured" },
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

        // Handle company registration
        if (registrationId) {
          const registration = await prisma.companyRegistration.findUnique({
            where: { id: registrationId },
          });

          if (registration && registration.status === "pending") {
            // Get subscription details
            const sub = await stripe.subscriptions.retrieve(session.subscription as string);
            const subData = sub as any;

            // Create company
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

            // Create manager employee with temporary password
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

            // Create subscription
            await prisma.companySubscription.create({
              data: {
                companyId: company.id,
                status: "active",
                stripeSubscriptionId: subData.id,
                stripeCustomerId: session.customer,
                currentPeriodEnd: new Date(subData.current_period_end * 1000),
              },
            });

            // Update registration status
            await prisma.companyRegistration.update({
              where: { id: registrationId },
              data: { status: "company_created" },
            });

            // Send welcome email
            if (resend) {
              try {
                await resend.emails.send({
                  from: "PeakFlow <noreply@peakflow.io>",
                  to: registration.managerEmail,
                  subject: "Welkom bij PeakFlow! Jouw bedrijfsaccount is actief",
                  html: `
                    <h2 style="color: #1d9e75;">Welkom bij PeakFlow!</h2>
                    <p>Hallo ${registration.managerName},</p>
                    <p>Jouw bedrijfsaccount is geactiveerd. Hier zijn je login gegevens:</p>
                    <div style="background: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
                      <p><strong>Email:</strong> ${registration.managerEmail}</p>
                      <p><strong>Bedrijf:</strong> ${registration.name}</p>
                      <p><strong>Initieel wachtwoord:</strong> ${tempPassword}</p>
                    </div>
                    <p><a href="https://peakflow.io/company/login" style="color: #1d9e75;">Log in op je dashboard</a></p>
                    <p style="color: #999; font-size: 12px;">Verander alsjeblieft onmiddellijk je wachtwoord voor je eerste login.</p>
                  `,
                });

                // Send admin notification
                await resend.emails.send({
                  from: "PeakFlow <noreply@peakflow.io>",
                  to: "raulvdzande740@gmail.com",
                  subject: `🎉 Nieuw bedrijf geregistreerd - ${registration.name}`,
                  html: `
                    <h2>Nieuw bedrijf!</h2>
                    <div style="background: #f0f9ff; padding: 20px; border-radius: 8px; margin: 20px 0;">
                      <p><strong>Type:</strong> ${registration.type}</p>
                      <p><strong>Bedrijf:</strong> ${registration.name}</p>
                      <p><strong>Email:</strong> ${registration.email}</p>
                      <p><strong>Manager:</strong> ${registration.managerName}</p>
                      <p><strong>Adres:</strong> ${registration.street}, ${registration.city} ${registration.postalCode}, ${registration.country}</p>
                    </div>
                  `,
                });
              } catch (emailError) {
                console.error("Email sending failed:", emailError);
              }
            }
          }
          break;
        }

        // Handle user subscription
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

          // Send emails if Resend is configured
          if (resend) {
            try {
              const priceId = session.line_items?.data?.[0]?.price?.id;
              const price = await stripe.prices.retrieve(priceId);
              const priceData = price as any;

              // Send confirmation email to customer
              await resend.emails.send({
                from: "PeakFlow <noreply@peakflow.io>",
                to: session.customer_email,
                subject: "Betaling ontvangen - Welkom bij PeakFlow!",
                html: `
                  <h2 style="color: #1d9e75;">Bedankt voor je betaling!</h2>
                  <p>Hallo,</p>
                  <p>Je abonnement op <strong>${planName}</strong> is geactiveerd.</p>
                  <div style="background: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
                    <p><strong>Plan:</strong> ${planName}</p>
                    <p><strong>Bedrag:</strong> €${((priceData.unit_amount || 0) / 100).toFixed(2)}</p>
                    <p><strong>Frequentie:</strong> ${priceData.recurring?.interval === "month" ? "Maandelijks" : "Jaarlijks"}</p>
                  </div>
                  <p>Je kunt je abonnement beheren via <a href="https://peakflow.io/account" style="color: #1d9e75;">je accountpagina</a>.</p>
                  <p style="margin-top: 30px; color: #999; font-size: 12px;">PeakFlow Team</p>
                `,
              });

              // Send admin notification
              await resend.emails.send({
                from: "PeakFlow <noreply@peakflow.io>",
                to: "raulvdzande740@gmail.com",
                subject: `🎉 Nieuwe betaling ontvangen - ${planName}`,
                html: `
                  <h2>Nieuwe betaling ontvangen!</h2>
                  <div style="background: #f0f9ff; padding: 20px; border-radius: 8px; margin: 20px 0;">
                    <p><strong>Klant:</strong> ${session.customer_email}</p>
                    <p><strong>Plan:</strong> ${planName}</p>
                    <p><strong>Bedrag:</strong> €${((priceData.unit_amount || 0) / 100).toFixed(2)}</p>
                    <p><strong>Frequentie:</strong> ${priceData.recurring?.interval === "month" ? "Maandelijks" : "Jaarlijks"}</p>
                    <p><strong>Stripe ID:</strong> ${subData.id}</p>
                  </div>
                  <p><a href="https://dashboard.stripe.com" style="color: #1d9e75;">Bekijk in Stripe Dashboard</a></p>
                `,
              });
            } catch (emailError) {
              console.error("Email sending failed:", emailError);
            }
          }
        }
        break;
      }

      case "customer.subscription.updated": {
        const subscription = event.data.object as any;
        const userId = await prisma.subscription.findUnique({
          where: { stripeSubscriptionId: subscription.id },
          select: { userId: true },
        });

        if (userId) {
          const subData = subscription as any;
          await createOrUpdateSubscription(
            userId.userId,
            subData.metadata?.plan || "explorer_monthly",
            subData.status,
            subData.id,
            subData.customer as string,
            new Date(subData.current_period_end * 1000),
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
    console.error("Webhook error:", error);
    return NextResponse.json(
      { error: "Webhook processing failed" },
      { status: 400 }
    );
  }
}
