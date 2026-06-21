import { requireSuperAdmin } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { cookies } from "next/headers";

export const metadata = { title: "PeakFlow Admin" };

async function logoutAction() {
  "use server";
  (await cookies()).delete("session");
  redirect("/login");
}

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const user = await requireSuperAdmin();
  if (!user) redirect("/login?error=" + encodeURIComponent("Toegang geweigerd"));

  return (
    <div style={{ minHeight: "100vh", background: "#0f172a", color: "white", fontFamily: "system-ui, sans-serif" }}>
      <header style={{
        background: "#1e293b",
        borderBottom: "1px solid #334155",
        padding: "0 28px",
        height: 56,
        display: "flex",
        alignItems: "center",
        gap: 20,
        position: "sticky",
        top: 0,
        zIndex: 100,
      }}>
        <Link href="/admin" style={{ display: "flex", alignItems: "center", gap: 8, color: "white", fontWeight: 800, fontSize: 16, textDecoration: "none", letterSpacing: "-0.3px" }}>
          <span style={{ fontSize: 20 }}>⛰</span> PeakFlow
          <span style={{ background: "#0f6e50", color: "#6ee7b7", fontSize: 10, fontWeight: 700, padding: "2px 7px", borderRadius: 999, letterSpacing: "0.5px" }}>ADMIN</span>
        </Link>

        <nav style={{ display: "flex", gap: 4, marginLeft: 16 }}>
          {[
            { href: "/admin", label: "Resorts" },
          ].map(n => (
            <Link key={n.href} href={n.href} style={{ fontSize: 13, color: "#94a3b8", padding: "6px 12px", borderRadius: 6, textDecoration: "none" }}>
              {n.label}
            </Link>
          ))}
        </nav>

        <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 16 }}>
          <span style={{ fontSize: 12, color: "#64748b" }}>{user.email}</span>
          <Link href="/" style={{ fontSize: 12, color: "#94a3b8", textDecoration: "none" }}>← Publieke site</Link>
          <form action={logoutAction}>
            <button type="submit" style={{ fontSize: 12, color: "#f87171", background: "transparent", border: "none", cursor: "pointer", padding: 0 }}>
              Uitloggen
            </button>
          </form>
        </div>
      </header>
      <main style={{ padding: "32px 28px", maxWidth: 1200, margin: "0 auto" }}>
        {children}
      </main>
    </div>
  );
}
