import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { SignJWT } from "jose";
import { cookies } from "next/headers";

const secret = new TextEncoder().encode(process.env.JWT_SECRET || "your-secret-key");

export async function POST(req: NextRequest) {
  try {
    const { employeeId } = await req.json();

    if (!employeeId) {
      return NextResponse.json(
        { error: "Missing employeeId" },
        { status: 400 }
      );
    }

    // Verify employee exists
    const employee = await prisma.companyEmployee.findUnique({
      where: { id: employeeId },
      include: { company: true },
    });

    if (!employee) {
      return NextResponse.json(
        { error: "Employee not found" },
        { status: 404 }
      );
    }

    // Create impersonation token
    const token = await new SignJWT({
      employeeId: employee.id,
      companyId: employee.companyId,
      email: employee.email,
      role: employee.role,
      type: "company",
      impersonated: true,
    })
      .setProtectedHeader({ alg: "HS256" })
      .setExpirationTime("8h")
      .sign(secret);

    const response = NextResponse.json({ success: true });
    response.cookies.set("company_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 8 * 60 * 60,
    });

    return response;
  } catch (error) {
    return NextResponse.json(
      { error: "Impersonation failed" },
      { status: 500 }
    );
  }
}
