import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const {
      type,
      name,
      email,
      phone,
      website,
      street,
      city,
      postalCode,
      country,
      taxId,
      adminName,
      adminEmail,
      adminPassword,
    } = body;

    if (!type || !name || !email || !street || !city || !postalCode || !country || !adminEmail || !adminPassword) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Check if company email exists
    const existingCompany = await prisma.company.findUnique({
      where: { email },
    });

    if (existingCompany) {
      return NextResponse.json(
        { error: "Company email already exists" },
        { status: 400 }
      );
    }

    // Check if admin email exists
    const existingEmployee = await prisma.companyEmployee.findUnique({
      where: { email: adminEmail },
    });

    if (existingEmployee) {
      return NextResponse.json(
        { error: "Admin email already exists" },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(adminPassword, 10);

    // Create company with admin
    const now = new Date();
    const planEndDate = new Date(now.getFullYear() + 1, now.getMonth(), now.getDate());

    const company = await prisma.company.create({
      data: {
        type: type.toUpperCase(),
        name,
        email,
        phone,
        website,
        street,
        city,
        postalCode,
        country,
        taxId,
        plan: `${type.toLowerCase()}_starter_yearly`,
        planStartDate: now,
        planEndDate,
        employees: {
          create: {
            name: adminName,
            email: adminEmail,
            password: hashedPassword,
            role: "admin",
          },
        },
        subscription: {
          create: {
            status: "active",
            currentPeriodEnd: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
          },
        },
      },
    });

    return NextResponse.json({
      success: true,
      companyId: company.id,
      message: "Company created successfully",
    });
  } catch (error) {
    console.error("Company creation error:", error);
    return NextResponse.json(
      { error: "Company creation failed" },
      { status: 500 }
    );
  }
}
