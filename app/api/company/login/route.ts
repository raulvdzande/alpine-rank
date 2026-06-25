import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { SignJWT } from "jose";

const secret = new TextEncoder().encode(process.env.JWT_SECRET || "your-secret-key");

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password required" },
        { status: 400 }
      );
    }

    // Find employee
    const employee = await prisma.companyEmployee.findUnique({
      where: { email },
      include: { company: true },
    });

    if (!employee) {
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 }
      );
    }

    // Check password
    const isValid = await bcrypt.compare(password, employee.password);

    if (!isValid) {
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 }
      );
    }

    // Create JWT token
    const token = await new SignJWT({
      employeeId: employee.id,
      companyId: employee.companyId,
      email: employee.email,
      role: employee.role,
      type: "company",
    })
      .setProtectedHeader({ alg: "HS256" })
      .setExpirationTime("30d")
      .sign(secret);

    const response = NextResponse.json({
      success: true,
      message: "Login successful",
    });

    response.cookies.set("company_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 30 * 24 * 60 * 60, // 30 days
    });

    return response;
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { error: "Login failed" },
      { status: 500 }
    );
  }
}
