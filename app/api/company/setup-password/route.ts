import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { jwtVerify } from "jose";

const secret = new TextEncoder().encode(process.env.JWT_SECRET || "your-secret-key");

export async function POST(req: NextRequest) {
  try {
    const { token, password } = await req.json();

    if (!token || !password) {
      return NextResponse.json(
        { error: "Missing token or password" },
        { status: 400 }
      );
    }

    if (password.length < 8) {
      return NextResponse.json(
        { error: "Password must be at least 8 characters" },
        { status: 400 }
      );
    }

    // Verify token
    let payload: any;
    try {
      const verified = await jwtVerify(token, secret);
      payload = verified.payload;
    } catch (error) {
      return NextResponse.json(
        { error: "Invalid or expired setup link" },
        { status: 400 }
      );
    }

    if (payload.type !== "setup") {
      return NextResponse.json(
        { error: "Invalid token type" },
        { status: 400 }
      );
    }

    // Find employee
    const employee = await prisma.companyEmployee.findUnique({
      where: { id: payload.employeeId },
    });

    if (!employee) {
      return NextResponse.json(
        { error: "Employee not found" },
        { status: 404 }
      );
    }

    // Hash and update password
    const hashedPassword = await bcrypt.hash(password, 10);
    await prisma.companyEmployee.update({
      where: { id: payload.employeeId },
      data: { password: hashedPassword },
    });

    return NextResponse.json({
      success: true,
      message: "Password set successfully",
    });
  } catch (error) {
    console.error("Setup password error:", error);
    return NextResponse.json(
      { error: "Setup failed" },
      { status: 500 }
    );
  }
}
