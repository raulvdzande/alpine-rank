import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { employeeId, companyId } = await req.json();

    if (!employeeId || !companyId) {
      return NextResponse.json(
        { error: "Missing employeeId or companyId" },
        { status: 400 }
      );
    }

    // Verify employee belongs to company
    const employee = await prisma.companyEmployee.findUnique({
      where: { id: employeeId },
    });

    if (!employee || employee.companyId !== companyId) {
      return NextResponse.json(
        { error: "Employee not found" },
        { status: 404 }
      );
    }

    // Don't allow deleting last admin
    if (employee.role === "admin") {
      const adminCount = await prisma.companyEmployee.count({
        where: { companyId, role: "admin" },
      });

      if (adminCount === 1) {
        return NextResponse.json(
          { error: "Cannot delete the last admin" },
          { status: 400 }
        );
      }
    }

    // Delete employee
    await prisma.companyEmployee.delete({
      where: { id: employeeId },
    });

    return NextResponse.json({
      success: true,
      message: "Employee deleted",
    });
  } catch (error) {
    console.error("Employee delete error:", error);
    return NextResponse.json(
      { error: "Delete failed" },
      { status: 500 }
    );
  }
}
