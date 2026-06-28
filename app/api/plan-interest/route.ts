import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

const VALID_PLANS = ["free", "explorer", "resort_starter", "resort_pro", "brand_basis", "brand_pro"];

export async function POST(req: NextRequest) {
  try {
    const { email, plan } = await req.json();

    if (!email || !plan) {
      return NextResponse.json({ error: "Email en plan zijn verplicht" }, { status: 400 });
    }

    if (!VALID_PLANS.includes(plan)) {
      return NextResponse.json({ error: "Ongeldig plan" }, { status: 400 });
    }

    const user = await getCurrentUser();

    await prisma.planInterest.upsert({
      where: { email_plan: { email, plan } },
      update: {},
      create: { email, plan, userId: user?.id ?? null },
    });

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Server fout" }, { status: 500 });
  }
}
