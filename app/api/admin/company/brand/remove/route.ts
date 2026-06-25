import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { companyId, brandId } = await req.json();

    if (!companyId || !brandId) {
      return NextResponse.json(
        { error: "Missing companyId or brandId" },
        { status: 400 }
      );
    }

    // Verify association exists
    const association = await prisma.companyBrand.findUnique({
      where: {
        companyId_brandId: { companyId, brandId },
      },
    });

    if (!association) {
      return NextResponse.json(
        { error: "Association not found" },
        { status: 404 }
      );
    }

    // Delete association
    await prisma.companyBrand.delete({
      where: {
        companyId_brandId: { companyId, brandId },
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to remove brand" },
      { status: 500 }
    );
  }
}
