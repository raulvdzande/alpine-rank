import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { resend } from "@/lib/resend";
import { randomBytes } from "crypto";

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json({ error: "Email required" }, { status: 400 });
    }

    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const resetToken = randomBytes(32).toString("hex");
    const resetExpiry = new Date(Date.now() + 3600000);

    await prisma.user.update({
      where: { id: user.id },
      data: {
        password: resetToken,
        updatedAt: resetExpiry,
      },
    });

    const resetUrl = `${process.env.NEXT_PUBLIC_APP_URL || "https://peakflow.io"}/reset-password?token=${resetToken}&email=${encodeURIComponent(email)}`;

    await resend.emails.send({
      from: "noreply@peakflow.io",
      to: email,
      subject: "Wachtwoord opnieuw instellen — PeakFlow",
      html: `
        <p>Hallo,</p>
        <p>We hebben een verzoek ontvangen om je wachtwoord opnieuw in te stellen.</p>
        <p><a href="${resetUrl}" style="display: inline-block; background: #1d9e75; color: white; padding: 10px 20px; border-radius: 6px; text-decoration: none; font-weight: 600;">Wachtwoord resetten</a></p>
        <p style="color: #999; font-size: 12px;">Deze link verloopt over 1 uur.</p>
      `,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Password reset error:", error);
    return NextResponse.json(
      { error: "Failed to send reset email" },
      { status: 500 }
    );
  }
}
