import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const q = req.nextUrl.searchParams.get("q");

    if (!q || q.length < 2) {
      return NextResponse.json(
        { error: "Query must be at least 2 characters" },
        { status: 400 }
      );
    }

    const brands = await prisma.company.findMany({
      where: {
        type: "BRAND",
        name: { contains: q, mode: "insensitive" },
      },
      select: { id: true, name: true, country: true },
      take: 20,
    });

    return NextResponse.json({ brands });
  } catch (error) {
    return NextResponse.json(
      { error: "Search failed" },
      { status: 500 }
    );
  }
}
