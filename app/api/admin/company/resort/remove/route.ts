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

    // Verify resort belongs to company
    const resort = await prisma.resort.findUnique({
      where: { id: resortId },
    });

    if (!resort || resort.companyId !== companyId) {
      return NextResponse.json(
        { error: "Resort not found or not associated with this company" },
        { status: 404 }
      );
    }

    // Remove company association
    await prisma.resort.update({
      where: { id: resortId },
      data: { companyId: null },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to remove resort" },
      { status: 500 }
    );
  }
}
