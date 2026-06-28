import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";
export const metadata = { title: "Plan Interest — Admin" };

const PLAN_LABELS: Record<string, string> = {
  free: "Free (User)",
  explorer: "Explorer (User)",
  resort_starter: "Resort Starter",
  resort_pro: "Resort Pro",
  brand_basis: "Brand Basic",
  brand_pro: "Brand Pro",
};

const PLAN_COLORS: Record<string, string> = {
  free: "#64748b",
  explorer: "#1d9e75",
  resort_starter: "#3b82f6",
  resort_pro: "#1d4ed8",
  brand_basis: "#f59e0b",
  brand_pro: "#d97706",
};

export default async function PlanInterestsPage() {
  const allInterests = await prisma.planInterest.findMany({
    orderBy: { createdAt: "desc" },
  });

  const countByPlan: Record<string, number> = {};
  for (const interest of allInterests) {
    countByPlan[interest.plan] = (countByPlan[interest.plan] ?? 0) + 1;
  }

  const total = allInterests.length;
  const thisWeek = allInterests.filter(i => {
    const diff = Date.now() - new Date(i.createdAt).getTime();
    return diff < 7 * 24 * 60 * 60 * 1000;
  }).length;
  const withAccount = allInterests.filter(i => i.userId).length;

  const maxCount = Math.max(...Object.values(countByPlan), 1);

  const planOrder = ["explorer", "resort_pro", "resort_starter", "brand_pro", "brand_basis", "free"];
  const sortedPlans = planOrder.filter(p => (countByPlan[p] ?? 0) > 0)
    .concat(planOrder.filter(p => !countByPlan[p]));

  return (
    <div>
      <h1 style={{ fontSize: 28, fontWeight: 800, color: "white", marginBottom: 8 }}>Plan Interest</h1>
      <p style={{ color: "#64748b", marginBottom: 32 }}>Who wants which plan — submitted via the public wishlist page</p>

      {/* Summary cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 16, marginBottom: 40 }}>
        {[
          { label: "Total interest", value: total, color: "#1d9e75" },
          { label: "New this week", value: thisWeek, color: "#3b82f6" },
          { label: "With account", value: withAccount, color: "#f59e0b" },
          { label: "Most popular plan", value: sortedPlans[0] ? PLAN_LABELS[sortedPlans[0]] ?? sortedPlans[0] : "—", color: "#8b5cf6", small: true },
        ].map(card => (
          <div key={card.label} style={{ background: "#1e293b", borderRadius: 12, padding: 20, border: "1px solid #334155" }}>
            <div style={{ fontSize: 12, color: "#64748b", marginBottom: 8 }}>{card.label}</div>
            <div style={{ fontSize: card.small ? 16 : 28, fontWeight: 800, color: card.color }}>{card.value}</div>
          </div>
        ))}
      </div>

      {/* Bar chart per plan */}
      <div style={{ background: "#1e293b", borderRadius: 12, padding: 24, border: "1px solid #334155", marginBottom: 32 }}>
        <h2 style={{ fontSize: 16, fontWeight: 700, color: "white", marginBottom: 24 }}>Interest per plan</h2>
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {planOrder.map(plan => {
            const count = countByPlan[plan] ?? 0;
            const pct = Math.round((count / maxCount) * 100);
            const color = PLAN_COLORS[plan] ?? "#64748b";
            return (
              <div key={plan} style={{ display: "flex", alignItems: "center", gap: 16 }}>
                <div style={{ width: 140, fontSize: 13, color: "#94a3b8", flexShrink: 0 }}>
                  {PLAN_LABELS[plan] ?? plan}
                </div>
                <div style={{ flex: 1, background: "#0f172a", borderRadius: 4, height: 24, overflow: "hidden" }}>
                  <div style={{
                    width: `${pct}%`, height: "100%", background: color,
                    borderRadius: 4, minWidth: count > 0 ? 8 : 0,
                    transition: "width 0.3s ease",
                  }} />
                </div>
                <div style={{ width: 32, textAlign: "right", fontSize: 14, fontWeight: 700, color: "white", flexShrink: 0 }}>
                  {count}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Recent signups table */}
      <div style={{ background: "#1e293b", borderRadius: 12, border: "1px solid #334155", overflow: "hidden" }}>
        <div style={{ padding: "20px 24px", borderBottom: "1px solid #334155", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <h2 style={{ fontSize: 16, fontWeight: 700, color: "white", margin: 0 }}>
            All signups ({total})
          </h2>
        </div>
        {allInterests.length === 0 ? (
          <div style={{ padding: 40, textAlign: "center", color: "#64748b" }}>No signups yet</div>
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ borderBottom: "1px solid #334155" }}>
                  {["Email", "Plan", "Account", "Date"].map(h => (
                    <th key={h} style={{ padding: "12px 24px", textAlign: "left", fontSize: 12, fontWeight: 600, color: "#64748b", textTransform: "uppercase" }}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {allInterests.map(i => (
                  <tr key={i.id} style={{ borderBottom: "1px solid #1e293b" }}>
                    <td style={{ padding: "14px 24px", fontSize: 14, color: "#e2e8f0" }}>{i.email}</td>
                    <td style={{ padding: "14px 24px" }}>
                      <span style={{
                        background: `${PLAN_COLORS[i.plan] ?? "#64748b"}20`,
                        color: PLAN_COLORS[i.plan] ?? "#94a3b8",
                        padding: "4px 10px", borderRadius: 999, fontSize: 12, fontWeight: 700,
                      }}>
                        {PLAN_LABELS[i.plan] ?? i.plan}
                      </span>
                    </td>
                    <td style={{ padding: "14px 24px", fontSize: 13, color: i.userId ? "#1d9e75" : "#64748b" }}>
                      {i.userId ? "✓ Logged in" : "Guest"}
                    </td>
                    <td style={{ padding: "14px 24px", fontSize: 13, color: "#64748b" }}>
                      {new Date(i.createdAt).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
