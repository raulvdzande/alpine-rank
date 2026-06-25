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

    const resorts = await prisma.resort.findMany({
      where: {
        OR: [
          { name: { contains: q, mode: "insensitive" } },
          { Country: { contains: q, mode: "insensitive" } },
        ],
      },
      select: { id: true, name: true, Country: true },
      take: 20,
    });

    return NextResponse.json({ resorts });
  } catch (error) {
    return NextResponse.json(
      { error: "Search failed" },
      { status: 500 }
    );
  }
}
