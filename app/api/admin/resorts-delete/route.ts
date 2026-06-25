import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST() {
  try {
    const deleted = await prisma.resort.deleteMany({});
    return NextResponse.json({
      success: true,
      message: `Deleted ${deleted.count} resorts`,
      count: deleted.count,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: String(error) },
      { status: 500 }
    );
  }
}
