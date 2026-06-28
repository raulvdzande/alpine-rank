import Link from "next/link";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { toFiveStars, stars, fmtNumber, countryNL, countryFlag, emojiFor, gradientFor } from "@/lib/display";

export const dynamic = "force-dynamic";

const SUPER_ADMIN_EMAIL = "raulvdzande740@gmail.com";

export default async function DashboardPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login?error=" + encodeURIComponent("Log in to view your dashboard"));

  const isAdmin = user.role === "ADMIN";

  const myReviews = await prisma.review.findMany({
    where: { userId: user.id },
    include: { resort: { select: { id: true, name: true, Country: true, snowScore: true, category: true } } },
    orderBy: { createdAt: "desc" },
    take: 10,
  });

  const reviewedIds = myReviews.map(r => r.resortId);
  const recommended = await prisma.resort.findMany({
    where: { id: { notIn: reviewedIds }, snowScore: { gt: 7 } },
    orderBy: { snowScore: "desc" },
    take: 3,
    select: { id: true, name: true, Country: true, snowScore: true, pisteKm: true, category: true, averageOverallRating: true },
  });

  let adminStats = null;
  let lastRated: { id: string; name: string; Country: string; averageOverallRating: number | null }[] = [];
  if (isAdmin) {
    const [totalResorts, rated, unrated] = await Promise.all([
      prisma.resort.count(),
      prisma.resort.count({ where: { averageOverallRating: { gt: 0 } } }),
      prisma.resort.count({ where: { OR: [{ averageOverallRating: null }, { averageOverallRating: 0 }] } }),
    ]);
    lastRated = await prisma.resort.findMany({
      where: { averageOverallRating: { gt: 0 } },
      orderBy: { updatedAt: "desc" },
      take: 5,
      select: { id: true, name: true, Country: true, averageOverallRating: true },
    });
    adminStats = { totalResorts, rated, unrated };
  }

  const avgUserRating = myReviews.length > 0
    ? myReviews.reduce((s, r) => s + toFiveStars(r.overall), 0) / myReviews.length
    : 0;

  return (
    <section className="section" style={{ background: "var(--snow)", minHeight: "calc(100vh - 60px)" }}>
      <div className="container">

        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 32, flexWrap: "wrap", gap: 16 }}>
          <div>
            <span className="label">Personal dashboard</span>
            <h2 style={{ marginBottom: 4 }}>Welcome, {user.name} 👋</h2>
            <p style={{ color: "var(--ink3)", marginTop: 0 }}>
              {isAdmin
                ? "You are logged in as super admin — you have access to all management tools."
                : "Manage your reviews, wishlist and find your perfect ski resort."}
            </p>
          </div>
          <div style={{ display: "flex", gap: 10 }}>
            {isAdmin && (
              <Link href="/admin" className="btn btn-primary">
                ⚙️ Resort management →
              </Link>
            )}
            <Link href="/resorts" className="btn btn-outline">Browse resorts</Link>
          </div>
        </div>

        {isAdmin && adminStats && (
          <div style={{
            background: "linear-gradient(135deg, #0f2a45, #1a3a5c)",
            borderRadius: "var(--r-lg)",
            padding: 28,
            marginBottom: 28,
            border: "1px solid rgba(110,231,183,.15)",
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
              <span style={{ fontSize: 20 }}>⛰</span>
              <div>
                <div style={{ fontSize: 14, fontWeight: 700, color: "white" }}>Super Admin Panel</div>
                <div style={{ fontSize: 12, color: "rgba(255,255,255,.5)" }}>Only visible to you</div>
              </div>
              <Link href="/admin" style={{ marginLeft: "auto", fontSize: 12, color: "#6ee7b7", fontWeight: 600, textDecoration: "none", border: "1px solid rgba(110,231,183,.3)", padding: "5px 12px", borderRadius: 6 }}>
                Open admin →
              </Link>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 16, marginBottom: 20 }}>
              {[
                { label: "Total resorts", val: adminStats.totalResorts, color: "#60a5fa" },
                { label: "Rated", val: adminStats.rated, color: "#34d399" },
                { label: "Pending", val: adminStats.unrated, color: "#f87171" },
              ].map(s => (
                <div key={s.label} style={{ background: "rgba(255,255,255,.05)", borderRadius: 10, padding: "14px 18px", border: "1px solid rgba(255,255,255,.08)" }}>
                  <div style={{ fontSize: 24, fontWeight: 700, color: s.color }}>{s.val}</div>
                  <div style={{ fontSize: 12, color: "rgba(255,255,255,.5)", marginTop: 2 }}>{s.label}</div>
                </div>
              ))}
            </div>

            <div style={{ marginBottom: adminStats.rated > 0 ? 20 : 0 }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: "rgba(255,255,255,.4)", marginBottom: 6 }}>
                <span>Rating progress</span>
                <span>{Math.round((adminStats.rated / adminStats.totalResorts) * 100)}%</span>
              </div>
              <div style={{ height: 6, background: "rgba(255,255,255,.1)", borderRadius: 3 }}>
                <div style={{ height: "100%", width: `${(adminStats.rated / adminStats.totalResorts) * 100}%`, background: "linear-gradient(90deg,#34d399,#10b981)", borderRadius: 3 }} />
              </div>
            </div>

            {lastRated.length > 0 && (
              <div>
                <div style={{ fontSize: 11, color: "rgba(255,255,255,.4)", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: 10 }}>
                  Recently rated
                </div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                  {lastRated.map(r => (
                    <Link key={r.id} href={`/admin/resort/${r.id}`} style={{ fontSize: 12, color: "rgba(255,255,255,.7)", background: "rgba(255,255,255,.07)", border: "1px solid rgba(255,255,255,.1)", padding: "4px 10px", borderRadius: 999, textDecoration: "none", display: "flex", alignItems: "center", gap: 5 }}>
                      <span style={{ color: "#fbbf24" }}>★</span>
                      {toFiveStars(r.averageOverallRating).toFixed(1)} {r.name.length > 25 ? r.name.substring(0, 25) + "…" : r.name}
                    </Link>
                  ))}
                  <Link href="/admin" style={{ fontSize: 12, color: "#6ee7b7", background: "transparent", border: "1px dashed rgba(110,231,183,.3)", padding: "4px 10px", borderRadius: 999, textDecoration: "none" }}>
                    All resorts →
                  </Link>
                </div>
              </div>
            )}
          </div>
        )}

        <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 16, marginBottom: 28 }}>
          {[
            {
              label: "My reviews",
              val: myReviews.length,
              icon: "⭐",
              sub: myReviews.length > 0 ? `Avg. ${avgUserRating.toFixed(1)} / 5 ★` : "Write your first review",
              color: "#f59e0b",
            },
            {
              label: "Wishlist",
              val: 0,
              icon: "❤️",
              sub: "Save favourite resorts",
              color: "#ef4444",
            },
            {
              label: "Viewed resorts",
              val: 0,
              icon: "👁",
              sub: "Coming soon",
              color: "#3b82f6",
            },
            {
              label: "Profile",
              val: myReviews.length > 0 ? "Active" : "New",
              icon: "👤",
              sub: user.email,
              color: "#8b5cf6",
            },
          ].map(s => (
            <div key={s.label} style={{ background: "white", border: "1px solid var(--border)", borderRadius: "var(--r-lg)", padding: "18px 20px", borderLeft: `3px solid ${s.color}` }}>
              <div style={{ fontSize: 22 }}>{s.icon}</div>
              <div style={{ fontSize: 22, fontWeight: 700, color: "var(--ink)", marginTop: 6 }}>{s.val}</div>
              <div style={{ fontSize: 12, fontWeight: 600, color: "var(--ink2)", marginTop: 2 }}>{s.label}</div>
              <div style={{ fontSize: 11, color: "var(--ink3)", marginTop: 2 }}>{s.sub}</div>
            </div>
          ))}
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 24, alignItems: "start" }}>
          <div>
            <div style={{ background: "white", border: "1px solid var(--border)", borderRadius: "var(--r-lg)", padding: 24, marginBottom: 20 }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 18 }}>
                <h3 style={{ margin: 0 }}>My reviews</h3>
                {myReviews.length > 0 && (
                  <span style={{ fontSize: 12, color: "var(--ink3)" }}>{myReviews.length} reviews</span>
                )}
              </div>

              {myReviews.length === 0 ? (
                <div style={{ textAlign: "center", padding: "28px 0" }}>
                  <div style={{ fontSize: 36, marginBottom: 10 }}>⭐</div>
                  <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 6 }}>No reviews written yet</div>
                  <p style={{ fontSize: 13, color: "var(--ink3)", marginBottom: 16 }}>
                    Visit a resort page and share your experiences. Help other skiers!
                  </p>
                  <Link href="/resorts" className="btn btn-primary">Choose a resort →</Link>
                </div>
              ) : (
                <div>
                  {myReviews.map((rv, idx) => {
                    const rvStars = toFiveStars(rv.overall);
                    return (
                      <div key={rv.id} style={idx < myReviews.length - 1 ? { borderBottom: "1px solid var(--border)", paddingBottom: 16, marginBottom: 16 } : undefined}>
                        <div style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
                          <div style={{ width: 42, height: 42, borderRadius: 10, background: gradientFor(rv.resort.id), display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, flexShrink: 0 }}>
                            {emojiFor(rv.resort.id)}
                          </div>
                          <div style={{ flex: 1 }}>
                            <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                              <Link href={`/resort/${rv.resort.id}`} style={{ fontSize: 14, fontWeight: 600, color: "var(--ink)", textDecoration: "none" }}>
                                {rv.resort.name}
                              </Link>
                              <span style={{ fontSize: 11, color: "var(--ink3)" }}>{countryFlag(rv.resort.Country)} {countryNL(rv.resort.Country)}</span>
                            </div>
                            <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 4 }}>
                              <span style={{ color: "#f59e0b", fontSize: 13 }}>{stars(rvStars)}</span>
                              <span style={{ fontSize: 12, fontWeight: 600 }}>{rvStars.toFixed(1)}</span>
                              <span style={{ fontSize: 11, color: "var(--ink3)" }}>
                                T:{rv.terrain} · S:{rv.snow} · L:{rv.lifts} · A:{rv.apres} · F:{rv.family} · P:{rv.value} · U:{rv.scenery}
                              </span>
                            </div>
                          </div>
                          <div style={{ display: "flex", gap: 6, flexShrink: 0 }}>
                            <Link href={`/resort/${rv.resort.id}`} style={{ fontSize: 11, color: "var(--peak)", fontWeight: 600, textDecoration: "none" }}>
                              Edit →
                            </Link>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                  <div style={{ marginTop: 16, paddingTop: 16, borderTop: "1px solid var(--border)", textAlign: "center" }}>
                    <Link href="/resorts" className="btn btn-outline" style={{ fontSize: 13 }}>
                      Rate more resorts →
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div>
            <div style={{ background: "white", border: "1px solid var(--border)", borderRadius: "var(--r-lg)", padding: 20, marginBottom: 16 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
                <div style={{ width: 44, height: 44, background: isAdmin ? "var(--peak-light)" : "#eff6ff", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20 }}>
                  {isAdmin ? "⛰" : "👤"}
                </div>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 700 }}>{user.name}</div>
                  <div style={{ fontSize: 12, color: "var(--ink3)" }}>{user.email}</div>
                </div>
              </div>
              <div style={{ fontSize: 12, color: "var(--ink2)" }}>
                {[
                  ["Role", isAdmin ? "⚙️ Super Admin" : "👤 User"],
                  ["Reviews", `${myReviews.length} written`],
                  ["Account", "Active"],
                ].map(([k, v], i, arr) => (
                  <div key={k} style={{ display: "flex", justifyContent: "space-between", padding: "6px 0", borderBottom: i < arr.length - 1 ? "1px solid var(--border)" : "none" }}>
                    <span style={{ color: "var(--ink3)" }}>{k}</span>
                    <span style={{ fontWeight: 600 }}>{v}</span>
                  </div>
                ))}
              </div>
              {isAdmin && (
                <Link href="/admin" className="btn btn-primary" style={{ width: "100%", justifyContent: "center", marginTop: 14, fontSize: 13 }}>
                  ⚙️ Open admin panel
                </Link>
              )}
            </div>

            <div style={{ background: "white", border: "1px solid var(--border)", borderRadius: "var(--r-lg)", padding: 20 }}>
              <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 14 }}>
                {myReviews.length > 0 ? "Not yet rated" : "Recommended to explore"}
              </div>
              {recommended.length === 0 ? (
                <p style={{ fontSize: 12, color: "var(--ink3)" }}>You&apos;ve already rated all top resorts. Well done!</p>
              ) : (
                recommended.map((r, idx) => (
                  <Link key={r.id} href={`/resort/${r.id}`} style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none", padding: "8px 0", borderBottom: idx < recommended.length - 1 ? "1px solid var(--border)" : "none" }}>
                    <div style={{ width: 34, height: 34, borderRadius: 8, background: gradientFor(r.id), display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, flexShrink: 0 }}>
                      {emojiFor(r.id)}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 12, fontWeight: 600, color: "var(--ink)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{r.name}</div>
                      <div style={{ fontSize: 11, color: "var(--ink3)" }}>
                        {countryFlag(r.Country)} · ❄ {r.snowScore?.toFixed(1)}
                        {(r.averageOverallRating ?? 0) > 0 ? ` · ★ ${toFiveStars(r.averageOverallRating).toFixed(1)}` : ""}
                      </div>
                    </div>
                    <span style={{ fontSize: 11, color: "var(--peak)", fontWeight: 600 }}>→</span>
                  </Link>
                ))
              )}
              <Link href="/resorts" className="btn btn-ghost" style={{ width: "100%", justifyContent: "center", marginTop: 12, fontSize: 12 }}>
                View all resorts →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
