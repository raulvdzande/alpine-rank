import { prisma } from "@/lib/prisma";
import { comparePassword, signJwt } from "@/lib/auth";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: "Alle velden zijn verplicht" },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      return NextResponse.json(
        { error: "Ongeldig e-mailadres of wachtwoord" },
        { status: 401 }
      );
    }

    const valid = await comparePassword(password, user.password);
    if (!valid) {
      return NextResponse.json(
        { error: "Ongeldig e-mailadres of wachtwoord" },
        { status: 401 }
      );
    }

    const token = await signJwt({ id: user.id, email: user.email, name: user.name, role: user.role });

    (await cookies()).set("session", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7,
      path: "/",
    });

    return NextResponse.json({ success: true, role: user.role });
  } catch (error) {
    return NextResponse.json(
      { error: "Login mislukt" },
      { status: 500 }
    );
  }
}
