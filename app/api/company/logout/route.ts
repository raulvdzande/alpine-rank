import { NextResponse } from "next/server";

export async function GET() {
  const response = NextResponse.redirect(new URL("/company/login", process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"));
  response.cookies.delete("company_token");
  return response;
}
