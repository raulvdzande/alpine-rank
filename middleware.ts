import { NextRequest, NextResponse } from "next/server";

const PUBLIC_PAGES = ["/wishlist", "/login"];
const PUBLIC_API = ["/api/auth/login", "/api/company/login", "/api/plan-interest"];

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Next.js internals
  if (pathname.startsWith("/_next")) return NextResponse.next();

  // Files with extensions
  if (/\.[a-zA-Z0-9]+$/.test(pathname)) return NextResponse.next();

  // Public pages
  if (PUBLIC_PAGES.some(p => pathname === p || pathname.startsWith(p + "/"))) {
    return NextResponse.next();
  }

  // Public API
  if (PUBLIC_API.some(p => pathname === p || pathname.startsWith(p + "/"))) {
    return NextResponse.next();
  }

  // Check cookie existence (real JWT verify happens on each page)
  const hasSession = req.cookies.has("session") || req.cookies.has("company_token");

  if (!hasSession) {
    if (pathname.startsWith("/api/")) {
      return NextResponse.json({ error: "Niet ingelogd" }, { status: 401 });
    }
    return NextResponse.redirect(new URL("/wishlist", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image).*)"],
};
