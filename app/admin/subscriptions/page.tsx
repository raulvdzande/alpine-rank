import { prisma } from "@/lib/prisma";
import Link from "next/link";

export const metadata = {
  title: "Subscriptions — Admin",
};

export default async function SubscriptionsPage() {
  const subscriptions = await prisma.subscription.findMany({
    include: {
      user: {
        select: {
          id: true,
          email: true,
          name: true,
          createdAt: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const stats = {
    total: subscriptions.length,
    active: subscriptions.filter((s) => s.status === "active").length,
    trialing: subscriptions.filter((s) => s.status === "trialing").length,
    canceled: subscriptions.filter((s) => s.status === "canceled").length,
    paused: subscriptions.filter((s) => s.status === "paused").length,
  };

  return (
    <section style={{ padding: "40px 20px" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <Link href="/admin" style={{ fontSize: 13, color: "var(--peak)", marginBottom: 20, display: "inline-block" }}>
          ← Terug naar Admin
        </Link>

        <h1 style={{ marginBottom: 8 }}>Subscriptions</h1>
        <p style={{ color: "var(--ink2)", marginBottom: 32 }}>
          {subscriptions.length} betalingen ontvangen
        </p>

        {/* Stats */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: 16, marginBottom: 40 }}>
          <div style={{ background: "white", border: "1px solid var(--border)", borderRadius: 8, padding: 16 }}>
            <div style={{ fontSize: 24, fontWeight: 800, color: "var(--peak)" }}>{stats.total}</div>
            <div style={{ fontSize: 12, color: "var(--ink3)" }}>Totaal</div>
          </div>
          <div style={{ background: "#dcfce7", border: "1px solid #86efac", borderRadius: 8, padding: 16 }}>
            <div style={{ fontSize: 24, fontWeight: 800, color: "#166534" }}>{stats.active}</div>
            <div style={{ fontSize: 12, color: "#4d7c0f" }}>Actief</div>
          </div>
          <div style={{ background: "#fef3c7", border: "1px solid #fcd34d", borderRadius: 8, padding: 16 }}>
            <div style={{ fontSize: 24, fontWeight: 800, color: "#b45309" }}>{stats.trialing}</div>
            <div style={{ fontSize: 12, color: "#92400e" }}>Trial</div>
          </div>
          <div style={{ background: "#fee2e2", border: "1px solid #fca5a5", borderRadius: 8, padding: 16 }}>
            <div style={{ fontSize: 24, fontWeight: 800, color: "#991b1b" }}>{stats.canceled}</div>
            <div style={{ fontSize: 12, color: "#7f1d1d" }}>Canceled</div>
          </div>
        </div>

        {/* Table */}
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ borderBottom: "2px solid var(--border)" }}>
                <th style={{ padding: 12, textAlign: "left", fontSize: 12, fontWeight: 600, color: "var(--ink3)" }}>
                  Email
                </th>
                <th style={{ padding: 12, textAlign: "left", fontSize: 12, fontWeight: 600, color: "var(--ink3)" }}>
                  Naam
                </th>
                <th style={{ padding: 12, textAlign: "left", fontSize: 12, fontWeight: 600, color: "var(--ink3)" }}>
                  Plan
                </th>
                <th style={{ padding: 12, textAlign: "left", fontSize: 12, fontWeight: 600, color: "var(--ink3)" }}>
                  Status
                </th>
                <th style={{ padding: 12, textAlign: "left", fontSize: 12, fontWeight: 600, color: "var(--ink3)" }}>
                  Volgende betaling
                </th>
                <th style={{ padding: 12, textAlign: "left", fontSize: 12, fontWeight: 600, color: "var(--ink3)" }}>
                  Aangemeld
                </th>
              </tr>
            </thead>
            <tbody>
              {subscriptions.map((sub) => {
                const statusColors: Record<string, { bg: string; text: string }> = {
                  active: { bg: "#dcfce7", text: "#166534" },
                  trialing: { bg: "#fef3c7", text: "#b45309" },
                  canceled: { bg: "#fee2e2", text: "#991b1b" },
                  paused: { bg: "#e5e7eb", text: "#374151" },
                  past_due: { bg: "#fed7aa", text: "#92400e" },
                };

                const colors = statusColors[sub.status] || statusColors.trialing;

                return (
                  <tr key={sub.id} style={{ borderBottom: "1px solid var(--border)" }}>
                    <td style={{ padding: 12, fontSize: 14 }}>
                      <a href={`mailto:${sub.user.email}`} style={{ color: "var(--peak)", textDecoration: "none" }}>
                        {sub.user.email}
                      </a>
                    </td>
                    <td style={{ padding: 12, fontSize: 14, color: "var(--ink2)" }}>
                      {sub.user.name || "—"}
                    </td>
                    <td style={{ padding: 12, fontSize: 13, fontWeight: 600 }}>
                      {sub.plan}
                    </td>
                    <td style={{ padding: 12 }}>
                      <span
                        style={{
                          fontSize: 11,
                          fontWeight: 600,
                          background: colors.bg,
                          color: colors.text,
                          padding: "4px 8px",
                          borderRadius: 4,
                          textTransform: "uppercase",
                          letterSpacing: "0.5px",
                        }}
                      >
                        {sub.status}
                      </span>
                    </td>
                    <td style={{ padding: 12, fontSize: 13, color: "var(--ink2)" }}>
                      {sub.currentPeriodEnd
                        ? new Date(sub.currentPeriodEnd).toLocaleDateString("nl-NL")
                        : "—"}
                    </td>
                    <td style={{ padding: 12, fontSize: 13, color: "var(--ink3)" }}>
                      {new Date(sub.createdAt).toLocaleDateString("nl-NL", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {subscriptions.length === 0 && (
          <div style={{ textAlign: "center", padding: "40px 20px", color: "var(--ink3)" }}>
            Nog geen betalingen ontvangen
          </div>
        )}
      </div>
    </section>
  );
}
