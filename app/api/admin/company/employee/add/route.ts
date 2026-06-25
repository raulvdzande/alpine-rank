import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";

const TEST_PASSWORD = "testen123";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { companyId, name, email, role } = body;

    if (!companyId || !name || !email || !role) {
      return NextResponse.json(
        { error: "Missing required fields" },
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

    // Check if email exists
    const existing = await prisma.companyEmployee.findUnique({
      where: { email },
    });

    if (existing) {
      return NextResponse.json(
        { error: "Email already exists" },
        { status: 400 }
      );
    }

    // Hash test password
    const hashedPassword = await bcrypt.hash(TEST_PASSWORD, 10);

    // Create employee
    const employee = await prisma.companyEmployee.create({
      data: {
        companyId,
        name,
        email,
        password: hashedPassword,
        role,
      },
    });


    return NextResponse.json({
      success: true,
      employee: {
        id: employee.id,
        name: employee.name,
        email: employee.email,
        role: employee.role,
      },
      message: `Employee added. Login with email: ${email}, password: ${TEST_PASSWORD}`,
    });
  } catch (error) {
    console.error("Employee add error:", error);
    return NextResponse.json(
      { error: "Failed to add employee" },
      { status: 500 }
    );
  }
}
