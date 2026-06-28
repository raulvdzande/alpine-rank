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
  if (!user) redirect("/login?error=" + encodeURIComponent("Access denied"));

  const navItems = [
    { href: "/admin",                    label: "Overview",        icon: "📊" },
    { href: "/admin/companies",          label: "Companies",       icon: "🏢" },
    { href: "/admin/brands",             label: "Brands",          icon: "🎨" },
    { href: "/admin/resort/nieuw",       label: "Resort",          icon: "⛷" },
    { href: "/admin/plan-interests",     label: "Plan Interest",   icon: "❤" },
  ];

  return (
    <div style={{ minHeight: "100vh", background: "#0f172a", color: "white", fontFamily: "system-ui, sans-serif", display: "flex" }}>
      <style>{`
        .admin-nav-link {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px 16px;
          color: #94a3b8;
          text-decoration: none;
          font-size: 14px;
          border-left: 3px solid transparent;
          transition: all 0.2s;
        }
        .admin-nav-link:hover {
          color: #e2e8f0;
          border-left-color: #1d9e75;
          background: rgba(29, 158, 117, 0.1);
        }
        .admin-btn {
          padding: 8px 12px;
          background: rgba(255, 255, 255, 0.1);
          color: #94a3b8;
          border: none;
          border-radius: 6px;
          cursor: pointer;
          font-size: 12px;
          transition: all 0.2s;
          text-decoration: none;
          text-align: center;
          display: block;
        }
        .admin-btn:hover {
          background: rgba(255, 255, 255, 0.15);
          color: #e2e8f0;
        }
        .admin-btn-logout {
          background: rgba(248, 113, 113, 0.1);
          color: #f87171;
        }
        .admin-btn-logout:hover {
          background: rgba(248, 113, 113, 0.2);
        }
      `}</style>

      {/* Sidebar */}
      <aside style={{
        width: 260,
        background: "#1e293b",
        borderRight: "1px solid #334155",
        display: "flex",
        flexDirection: "column",
        position: "sticky",
        top: 0,
        height: "100vh",
        overflowY: "auto",
      }}>
        {/* Logo */}
        <Link href="/admin" style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          color: "white",
          fontWeight: 800,
          fontSize: 15,
          textDecoration: "none",
          padding: "16px 20px",
          borderBottom: "1px solid #334155",
        }}>
          <img src="/logo-icon.svg" alt="PeakFlow" style={{ width: 32, height: 32 }} />
          <div>
            PeakFlow
            <div style={{ fontSize: 10, fontWeight: 700, padding: "2px 6px", borderRadius: 999, background: "#0f6e50", color: "#6ee7b7", marginTop: 2 }}>ADMIN</div>
          </div>
        </Link>

        {/* Navigation */}
        <nav style={{ flex: 1, padding: "16px 0" }}>
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="admin-nav-link"
            >
              <span style={{ fontSize: 18 }}>{item.icon}</span>
              {item.label}
            </Link>
          ))}
        </nav>

        {/* User Section */}
        <div style={{ padding: "16px", borderTop: "1px solid #334155" }}>
          <div style={{ fontSize: 12, color: "#64748b", marginBottom: 12, wordBreak: "break-all" }}>
            {user.email}
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <Link href="/" className="admin-btn">
              Site
            </Link>
            <form action={logoutAction} style={{ flex: 1 }}>
              <button type="submit" className="admin-btn admin-btn-logout" style={{ width: "100%", fontWeight: 600 }}>
                Log out
              </button>
            </form>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main style={{ flex: 1, padding: "32px", overflowY: "auto" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          {children}
        </div>
      </main>
    </div>
  );
}
