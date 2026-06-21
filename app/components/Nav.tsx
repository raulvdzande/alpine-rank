import Link from "next/link";
import { getCurrentUser } from "@/lib/auth";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

async function logoutAction() {
  "use server";
  (await cookies()).delete("session");
  redirect("/");
}

export default async function Nav() {
  const user = await getCurrentUser();
  const isAdmin = user?.role === "ADMIN";

  return (
    <nav>
      <div className="container">
        <div className="nav-inner">
          <Link href="/" className="nav-logo">
            <div className="nav-logo-icon">⛰</div>
            <span className="nav-logo-text">PeakFlow</span>
          </Link>
          <div className="nav-links">
            <Link href="/">Voor skiërs</Link>
            <Link href="/resorts">Skigebieden</Link>
            <Link href="/snowflakes" style={{ color: "#d97706", fontWeight: 600 }}>❄ Snowflakes</Link>
            <Link href="/pricing">Prijzen</Link>
            {user && <Link href="/dashboard">Dashboard</Link>}
            {isAdmin && <Link href="/admin" style={{ color: "var(--peak)", fontWeight: 700 }}>⚙ Beheer</Link>}
          </div>
          <div className="nav-actions">
            {user ? (
              <>
                <span style={{ fontSize: 13, color: "var(--ink3)" }}>
                  {isAdmin ? "⛰" : "👤"} {user.name}
                </span>
                <form action={logoutAction} style={{ display: "inline" }}>
                  <button type="submit" className="btn btn-ghost" style={{ fontSize: 13 }}>Uitloggen</button>
                </form>
              </>
            ) : (
              <>
                <Link href="/login" className="btn btn-ghost">Inloggen</Link>
                <Link href="/register" className="btn btn-primary">Gratis starten</Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
