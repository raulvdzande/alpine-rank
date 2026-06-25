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

    // Verify brand exists
    const brand = await prisma.company.findUnique({
      where: { id: brandId },
    });

    if (!brand || brand.type !== "BRAND") {
      return NextResponse.json(
        { error: "Brand not found" },
        { status: 404 }
      );
    }

    // Check if already associated
    const existing = await prisma.companyBrand.findUnique({
      where: {
        companyId_brandId: { companyId, brandId },
      },
    });

    if (existing) {
      return NextResponse.json(
        { error: "Brand already associated" },
        { status: 400 }
      );
    }

    // Create association
    await prisma.companyBrand.create({
      data: { companyId, brandId },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to add brand" },
      { status: 500 }
    );
  }
}
