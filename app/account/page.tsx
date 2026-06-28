import Link from "next/link";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";

export const metadata = {
  title: "Account — PeakFlow",
  description: "Your PeakFlow account settings",
};

export default async function AccountPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  return (
    <section className="section">
      <div className="container" style={{ maxWidth: 600 }}>
        <span className="label">Account</span>
        <h2>My profile</h2>

        <div style={{
          background: "white",
          border: "1px solid var(--border)",
          borderRadius: "var(--r-lg)",
          padding: 32,
          marginTop: 32,
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 32 }}>
            <div style={{
              width: 64,
              height: 64,
              borderRadius: "50%",
              background: "linear-gradient(135deg, var(--peak), var(--blue))",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 28,
              color: "white",
              fontWeight: 700,
            }}>
              {user.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <div style={{ fontSize: 20, fontWeight: 700, color: "var(--ink)" }}>{user.name}</div>
              <div style={{ fontSize: 14, color: "var(--ink3)" }}>{user.email}</div>
            </div>
          </div>

          <div style={{ borderTop: "1px solid var(--border)", paddingTop: 24 }}>
            <h3 style={{ fontSize: 16, marginBottom: 20 }}>Your information</h3>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 24 }}>
              <div>
                <label style={{ fontSize: 12, fontWeight: 600, color: "var(--ink3)", textTransform: "uppercase", display: "block", marginBottom: 8 }}>
                  Name
                </label>
                <div style={{ padding: "10px 12px", background: "var(--snow)", borderRadius: "var(--r)", color: "var(--ink2)" }}>
                  {user.name}
                </div>
              </div>
              <div>
                <label style={{ fontSize: 12, fontWeight: 600, color: "var(--ink3)", textTransform: "uppercase", display: "block", marginBottom: 8 }}>
                  Email address
                </label>
                <div style={{ padding: "10px 12px", background: "var(--snow)", borderRadius: "var(--r)", color: "var(--ink2)" }}>
                  {user.email}
                </div>
              </div>
            </div>

            <div style={{ padding: 16, background: "var(--peak-light)", borderRadius: "var(--r-lg)", borderLeft: "3px solid var(--peak)", marginBottom: 24 }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: "var(--peak-dark)", marginBottom: 6, textTransform: "uppercase" }}>
                ✓ Account confirmed
              </div>
              <div style={{ fontSize: 13, color: "var(--peak-dark)" }}>
                Your account is fully set up and ready to use
              </div>
            </div>
          </div>

          <div style={{ display: "flex", gap: 12, marginTop: 32 }}>
            <Link href="/account/wishlist" className="btn btn-primary" style={{ flex: 1, justifyContent: "center" }}>
              ❤ My wishlist
            </Link>
            <Link href="/account/settings" className="btn btn-ghost" style={{ flex: 1, justifyContent: "center" }}>
              Settings
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
