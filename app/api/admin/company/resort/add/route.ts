import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { companyId, resortId } = await req.json();

    if (!companyId || !resortId) {
      return NextResponse.json(
        { error: "Missing companyId or resortId" },
        { status: 400 }
      );
    }

    // Verify company exists
    const company = await prisma.company.findUnique({
      where: { id: companyId },
    });

    if (!company) {
      return NextResponse.json(
        { error: "Company not found" },
        { status: 404 }
      );
    }

    // Verify resort exists
    const resort = await prisma.resort.findUnique({
      where: { id: resortId },
    });

    if (!resort) {
      return NextResponse.json(
        { error: "Resort not found" },
        { status: 404 }
      );
    }

    // Update resort with company
    await prisma.resort.update({
      where: { id: resortId },
      data: { companyId },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to add resort" },
      { status: 500 }
    );
  }
}
