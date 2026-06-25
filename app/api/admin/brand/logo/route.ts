import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import { join } from "path";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const logo = formData.get("logo") as File;
    const id = req.nextUrl.searchParams.get("id");

    if (!logo || !id) {
      return NextResponse.json(
        { error: "Missing logo or id" },
        { status: 400 }
      );
    }

    // Verify brand exists
    const brand = await prisma.company.findUnique({
      where: { id },
    });

    if (!brand || brand.type !== "BRAND") {
      return NextResponse.json(
        { error: "Brand not found" },
        { status: 404 }
      );
    }

    // Save file
    const bytes = await logo.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const filename = `${id}-${Date.now()}-${logo.name}`;
    const filepath = join(process.cwd(), "public", "uploads", "brands", filename);

    try {
      await mkdir(join(process.cwd(), "public", "uploads", "brands"), { recursive: true });
      await writeFile(filepath, buffer);
    } catch (err) {
      return NextResponse.json(
        { error: "Failed to save file" },
        { status: 500 }
      );
    }

    // Update brand with logo URL
    const logoUrl = `/uploads/brands/${filename}`;
    await prisma.company.update({
      where: { id },
      data: { logo: logoUrl },
    });

    return NextResponse.json({ success: true, logo: logoUrl });
  } catch (error) {
    return NextResponse.json(
      { error: "Upload failed" },
      { status: 500 }
    );
  }
}
