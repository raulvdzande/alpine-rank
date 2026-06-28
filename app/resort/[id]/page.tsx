import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import {
  emojiFor, countryNL, countryFlag, toFiveStars, stars, fmtNumber, avatarBg,
} from "@/lib/display";
import ReviewForm from "./ReviewForm";

export const dynamic = "force-dynamic";

const SUPER_ADMIN_EMAIL = "raulvdzande740@gmail.com";

const CATEGORIES = [
  { key: "terrain" as const, label: "Terrain", emoji: "🏔" },
  { key: "snow" as const, label: "Snow", emoji: "❄" },
  { key: "lifts" as const, label: "Lifts", emoji: "🚡" },
  { key: "apres" as const, label: "Après", emoji: "🍺" },
  { key: "family" as const, label: "Family", emoji: "👨‍👩‍👧" },
  { key: "value" as const, label: "Value", emoji: "💰" },
  { key: "scenery" as const, label: "Scenery", emoji: "🎑" },
];

function getCatColor(val: number): string {
  if (val >= 8) return "#22c55e";
  if (val >= 6) return "#3b82f6";
  if (val >= 4) return "#f59e0b";
  return "#ef4444";
}

const cardStyle: React.CSSProperties = {
  background: "white",
  border: "1px solid var(--border)",
  borderRadius: "var(--r-lg)",
  padding: 24,
  marginBottom: 20,
};

function monthYear(d: Date): string {
  return d.toLocaleDateString("en-GB", { month: "long", year: "numeric" });
}

export default async function ResortDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [r, currentUser] = await Promise.all([
    prisma.resort.findUnique({ where: { id } }),
    getCurrentUser(),
  ]);
  if (!r) notFound();

  const reviews = await prisma.review.findMany({
    where: { resortId: id },
    include: { user: { select: { id: true, name: true, email: true, role: true } } },
    orderBy: { createdAt: "desc" },
    take: 20,
  });

  const betterCount = await prisma.resort.count({ where: { snowScore: { gt: r.snowScore ?? 0 } } });
  const rank = betterCount + 1;
  const fiveStar = toFiveStars(r.averageOverallRating);
  const hasRating = fiveStar > 0;

  const myReview = currentUser
    ? reviews.find(rv => rv.userId === currentUser.id) ?? null
    : null;

  const catAvg: Record<string, number> = {};
  if (reviews.length > 0) {
    for (const cat of CATEGORIES) {
      const avg = reviews.reduce((sum, rv) => sum + (rv[cat.key] as number), 0) / reviews.length;
      catAvg[cat.key] = parseFloat(avg.toFixed(1));
    }
  }

  const piste = [
    { c: "#2ecc71", p: r.pisteGreen ?? 0, l: "Green" },
    { c: "#3498db", p: r.pisteBlue ?? 0, l: "Blue" },
    { c: "#e74c3c", p: r.pisteRed ?? 0, l: "Red" },
    { c: "#2c3e50", p: r.pisteBlack ?? 0, l: "Black" },
  ];
  const maxP = Math.max(...piste.map((x) => x.p), 1);

  return (
    <>
      {/* HERO */}
      <div style={{ background: "linear-gradient(135deg,#1a3a5c,#0f2a45)", color: "white", padding: "60px 0 0", overflow: "hidden" }}>
        <div className="container">
          <div style={{ display: "flex", alignItems: "flex-start", gap: 24, flexWrap: "wrap" }}>
            <div style={{ flex: 1, minWidth: 260 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12, flexWrap: "wrap" }}>
                <span style={{ fontSize: 12, fontWeight: 600, color: "#6ee7b7", background: "rgba(110,231,183,.15)", padding: "3px 10px", borderRadius: 999 }}>
                  #{rank} {r.category}
                </span>
                {r.verified && (
                  <span style={{ fontSize: 12, fontWeight: 600, color: "#93c5fd", background: "rgba(147,197,253,.15)", padding: "3px 10px", borderRadius: 999 }}>
                    ✓ Verified Partner
                  </span>
                )}
              </div>
              <h1 style={{ fontSize: 40, fontWeight: 800, marginBottom: 8 }}>{r.name}</h1>
              <p style={{ color: "rgba(255,255,255,.65)", marginBottom: 24 }}>
                📍 {r.region ? `${r.region}, ` : ""}{countryNL(r.Country)} · {fmtNumber(r.altitudeBase ?? 0)} – {fmtNumber(r.altitudeTop ?? 0)} m
              </p>
              <div style={{ display: "flex", gap: 20, flexWrap: "wrap", marginBottom: 32 }}>
                {[
                  { v: r.snowScore?.toFixed(1) ?? "—", l: "Snow score", c: "#6ee7b7" },
                  { v: String(r.pisteKm ?? "—"), l: "km piste" },
                  { v: String(r.lifts ?? "—"), l: "lifts" },
                  ...(hasRating ? [{ v: `${fiveStar.toFixed(1)}★`, l: `${r.reviewCount} ${r.reviewCount === 1 ? "review" : "reviews"}` }] : []),
                ].map((s) => (
                  <div key={s.l}>
                    <div style={{ fontSize: 28, fontWeight: 700, color: s.c ?? "white" }}>{s.v}</div>
                    <div style={{ fontSize: 12, color: "rgba(255,255,255,.5)" }}>{s.l}</div>
                  </div>
                ))}
              </div>
              <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                <button className="btn btn-primary btn-lg">Book day pass →</button>
                <Link href="/resorts" className="btn" style={{ background: "rgba(255,255,255,.1)", color: "white", border: "1px solid rgba(255,255,255,.2)" }}>← Back</Link>
              </div>
            </div>
            <div style={{ fontSize: 120, lineHeight: 1, filter: "drop-shadow(0 8px 24px rgba(0,0,0,.3))", alignSelf: "flex-end" }}>{emojiFor(r.id)}</div>
          </div>
        </div>
      </div>

      {/* SNOWFLAKE BANNER */}
      {r.snowflakes > 0 && (
        <div className={`sf-banner sf-banner-${r.snowflakes}`}>
          <div className="container">
            <div className="sf-banner-inner">
              <div className={r.snowflakes === 3 ? "sf-icons sf-glow" : "sf-icons"}>{"❄".repeat(r.snowflakes)}</div>
              <div>
                <div className="sf-title">{r.snowflakes} PeakFlow Snowflake{r.snowflakes > 1 ? "s" : ""}</div>
                {r.snowflakeNote && <div className="sf-note">&ldquo;{r.snowflakeNote}&rdquo;</div>}
              </div>
              <div className="sf-meta">
                <div className="sf-year">{r.snowflakeAwardedAt ? new Date(r.snowflakeAwardedAt).getFullYear() : ""}</div>
                <div className="sf-seal">PeakFlow Inspection ✓</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* CONTENT */}
      <div className="container" style={{ paddingTop: 40, paddingBottom: 60 }}>
        <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 28, alignItems: "start" }}>
          <div>
            {/* PISTE DISTRIBUTION */}
            <div style={cardStyle}>
              <h3 style={{ marginBottom: 16 }}>Piste distribution</h3>
              <div style={{ display: "flex", gap: 12, marginBottom: 16, alignItems: "flex-end" }}>
                {piste.map((b) => (
                  <div key={b.l} style={{ textAlign: "center", flex: 1 }}>
                    <div style={{ height: 40 + Math.round((b.p / maxP) * 80), background: b.c, borderRadius: 6, display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontWeight: 700, fontSize: b.p >= 10 ? 18 : 14 }}>
                      {b.p}%
                    </div>
                    <div style={{ fontSize: 12, color: "var(--ink3)", marginTop: 6 }}>{b.l}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* RATING BREAKDOWN */}
            {reviews.length > 0 && (
              <div style={cardStyle}>
                <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 20 }}>
                  <div>
                    <h3 style={{ marginBottom: 4 }}>PeakFlow Reviews</h3>
                    <div style={{ fontSize: 13, color: "var(--ink3)" }}>{r.reviewCount} {r.reviewCount === 1 ? "review" : "reviews"}</div>
                  </div>
                  <div style={{ marginLeft: "auto", textAlign: "right" }}>
                    <div style={{ fontSize: 36, fontWeight: 800, color: "var(--peak-dark)" }}>{fiveStar.toFixed(1)}</div>
                    <div style={{ color: "#f59e0b", fontSize: 16 }}>{stars(fiveStar)}</div>
                  </div>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                  {CATEGORIES.map(cat => {
                    const val = catAvg[cat.key] ?? 0;
                    return (
                      <div key={cat.key} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                        <span style={{ width: 20, textAlign: "center" }}>{cat.emoji}</span>
                        <span style={{ fontSize: 12, color: "var(--ink2)", minWidth: 70 }}>{cat.label}</span>
                        <div style={{ flex: 1, height: 6, background: "#f1f5f9", borderRadius: 3 }}>
                          <div style={{ height: "100%", width: `${val * 10}%`, background: getCatColor(val), borderRadius: 3, transition: "width .3s" }} />
                        </div>
                        <span style={{ fontSize: 12, fontWeight: 600, color: getCatColor(val), minWidth: 28, textAlign: "right" }}>{val}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* REVIEWS LIST */}
            {reviews.length > 0 && (
              <div style={cardStyle}>
                <h3 style={{ marginBottom: 16 }}>Reviews</h3>
                {reviews.map((rv, idx) => {
                  const isAdmin = rv.user.email === SUPER_ADMIN_EMAIL;
                  const rvStars = toFiveStars(rv.overall);
                  const isOwn = currentUser?.id === rv.userId;
                  return (
                    <div key={rv.id} style={idx < reviews.length - 1 ? { borderBottom: "1px solid var(--border)", paddingBottom: 18, marginBottom: 18 } : undefined}>
                      <div style={{ display: "flex", alignItems: "flex-start", gap: 10, marginBottom: 10 }}>
                        <div style={{ width: 36, height: 36, background: isAdmin ? "var(--peak-light)" : avatarBg(rv.userId), borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, flexShrink: 0 }}>
                          {isAdmin ? "⛰" : "👤"}
                        </div>
                        <div style={{ flex: 1 }}>
                          <div style={{ display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap" }}>
                            <span style={{ fontSize: 13, fontWeight: 600 }}>
                              {isAdmin ? "PeakFlow Editorial" : rv.user.name}
                            </span>
                            {isAdmin && (
                              <span style={{ background: "var(--peak-light)", color: "var(--peak-dark)", fontSize: 10, fontWeight: 700, padding: "2px 7px", borderRadius: 999 }}>
                                ✓ Official
                              </span>
                            )}
                            {!isAdmin && (
                              <span style={{ background: "#f0fdf4", color: "#15803d", fontSize: 10, fontWeight: 600, padding: "2px 7px", borderRadius: 999 }}>
                                ✓ Verified
                              </span>
                            )}
                            {isOwn && !isAdmin && (
                              <span style={{ background: "#eff6ff", color: "#1d4ed8", fontSize: 10, fontWeight: 600, padding: "2px 7px", borderRadius: 999 }}>
                                Your review
                              </span>
                            )}
                          </div>
                          <div style={{ fontSize: 11, color: "var(--ink3)", marginTop: 2 }}>{monthYear(rv.createdAt)}</div>
                        </div>
                        <div style={{ color: "#f59e0b", fontSize: 14, whiteSpace: "nowrap" }}>{stars(rvStars)} {rvStars.toFixed(1)}</div>
                      </div>
                      <div style={{ display: "grid", gridTemplateColumns: "repeat(7,1fr)", gap: 6, padding: "10px 0", borderTop: "1px solid var(--border)" }}>
                        {CATEGORIES.map(cat => (
                          <div key={cat.key} style={{ textAlign: "center" }}>
                            <div style={{ fontSize: 14, fontWeight: 700, color: getCatColor(rv[cat.key] as number) }}>
                              {rv[cat.key]}
                            </div>
                            <div style={{ fontSize: 9, color: "var(--ink3)" }}>{cat.emoji} {cat.label}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* WRITE A REVIEW */}
            <div style={{ marginBottom: 20 }}>
              <h3 style={{ marginBottom: 12 }}>
                {myReview ? "Your review" : "Write a review"}
              </h3>
              {currentUser ? (
                <ReviewForm
                  resortId={id}
                  resortName={r.name}
                  existing={myReview ? {
                    terrain: myReview.terrain,
                    snow: myReview.snow,
                    lifts: myReview.lifts,
                    apres: myReview.apres,
                    family: myReview.family,
                    value: myReview.value,
                    scenery: myReview.scenery,
                  } : null}
                />
              ) : (
                <div style={{ border: "2px dashed var(--border)", borderRadius: "var(--r-lg)", padding: 28, textAlign: "center" }}>
                  <div style={{ fontSize: 28, marginBottom: 10 }}>⭐</div>
                  <div style={{ fontSize: 15, fontWeight: 600, marginBottom: 6 }}>Help other skiers with your opinion</div>
                  <div style={{ fontSize: 13, color: "var(--ink3)", marginBottom: 18 }}>
                    Log in or create a free account to leave a review for {r.name}.
                  </div>
                  <div style={{ display: "flex", gap: 10, justifyContent: "center" }}>
                    <Link href="/login" className="btn btn-primary">Log in →</Link>
                    <Link href="/register" className="btn btn-outline">Register for free</Link>
                  </div>
                </div>
              )}
            </div>

            {/* PEAKFLOW INSPECTION REPORT */}
            {r.snowflakeInspected && r.snowflakeReport && (
              <div style={{ ...cardStyle, border: "1px solid #f59e0b", background: "linear-gradient(135deg,#fffbeb,#fef3c7)" }}>
                <div style={{ display: "flex", alignItems: "flex-start", gap: 16, marginBottom: 20, flexWrap: "wrap" }}>
                  <div style={{ fontSize: 32, lineHeight: 1 }}>{"❄".repeat(r.snowflakes) || "○"}</div>
                  <div style={{ flex: 1 }}>
                    <h3 style={{ marginBottom: 4, color: "#92400e" }}>PeakFlow Inspection Report</h3>
                    <p style={{ fontSize: 13, color: "#b45309", margin: 0 }}>
                      Personally assessed by a PeakFlow inspector
                      {r.snowflakeAwardedAt && ` · ${new Date(r.snowflakeAwardedAt).toLocaleDateString("en-GB", { month: "long", year: "numeric" })}`}
                    </p>
                  </div>
                  <div style={{ background: "#f59e0b", color: "white", fontSize: 11, fontWeight: 700, padding: "4px 10px", borderRadius: 999, whiteSpace: "nowrap" as const }}>
                    PeakFlow Inspection ✓
                  </div>
                </div>

                <div style={{ background: "rgba(255,255,255,.6)", borderRadius: 10, padding: "14px 16px", marginBottom: 16 }}>
                  <div style={{ fontSize: 12, fontWeight: 700, color: "#92400e", textTransform: "uppercase" as const, letterSpacing: "0.5px", marginBottom: 10 }}>
                    Assessment criteria
                  </div>
                  <p style={{ fontSize: 13, color: "#78350f", marginBottom: 10 }}>This resort was physically visited and assessed on the following criteria:</p>
                  <ul style={{ fontSize: 13, color: "#92400e", paddingLeft: 18, lineHeight: 2 }}>
                    <li>Piste grooming & snow quality on site</li>
                    <li>Waiting times and lift quality during busy periods</li>
                    <li>Gastronomic quality on the mountain</li>
                    <li>Atmosphere, authenticity and village experience</li>
                    <li>Safety and service during the visit</li>
                    {r.snowflakes >= 2 && <li>Terrain variety & off-piste quality</li>}
                    {r.snowflakes >= 2 && <li>Hospitality and personalisation</li>}
                    {r.snowflakes >= 3 && <li>Mountain gastronomy at restaurant level</li>}
                    {r.snowflakes >= 3 && <li>Mythical status & unparalleled experience</li>}
                  </ul>
                </div>

                <div style={{ marginBottom: 16 }}>
                  <div style={{ fontSize: 12, fontWeight: 700, color: "#92400e", textTransform: "uppercase" as const, letterSpacing: "0.5px", marginBottom: 12 }}>
                    Inspector&apos;s verdict
                  </div>
                  {r.snowflakeReport.split("\n\n").map((para, i) => (
                    <p key={i} style={{ fontSize: 14, color: "#1c1917", lineHeight: 1.75, marginBottom: 12 }}>{para}</p>
                  ))}
                </div>

                {r.snowflakeNote && (
                  <blockquote style={{ borderLeft: "3px solid #f59e0b", margin: 0, paddingLeft: 16 }}>
                    <p style={{ fontSize: 15, fontStyle: "italic", color: "#78350f", marginBottom: 6 }}>
                      &ldquo;{r.snowflakeNote}&rdquo;
                    </p>
                    <cite style={{ fontSize: 12, color: "#b45309", fontStyle: "normal", fontWeight: 600 }}>— PeakFlow Inspector</cite>
                  </blockquote>
                )}
              </div>
            )}

            {/* RECOMMENDED GEAR */}
            <div style={cardStyle}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
                <h3>Recommended gear for {r.name}</h3>
                <span style={{ fontSize: 11, color: "var(--ink3)" }}>Sponsored</span>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                {[
                  { ic: "🎿", bg: "var(--peak-light)", n: "Atomic Maverick 95", d: "Advanced · All-mountain", p: "€749 → Shop" },
                  { ic: "👟", bg: "var(--blue-light)", n: "Rossignol Speed 120", d: "Expert · Race feel", p: "€499 → Shop" },
                ].map((g) => (
                  <div key={g.n} style={{ border: "1px solid var(--border)", borderRadius: "var(--r)", padding: 14, display: "flex", gap: 10, alignItems: "center" }}>
                    <div style={{ width: 40, height: 40, background: g.bg, borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20 }}>{g.ic}</div>
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 600 }}>{g.n}</div>
                      <div style={{ fontSize: 12, color: "var(--ink3)" }}>{g.d}</div>
                      <div style={{ fontSize: 12, color: "var(--peak)", fontWeight: 600, marginTop: 2 }}>{g.p}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* SIDEBAR */}
          <div>
            <div style={{ background: "white", border: "1px solid var(--border)", borderRadius: "var(--r-lg)", padding: 20, position: "sticky", top: 80 }}>
              <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 14 }}>Quick facts</div>
              <div style={{ fontSize: 13, color: "var(--ink2)" }}>
                {[
                  ["Country", `${countryFlag(r.Country)} ${countryNL(r.Country)}`],
                  ["Region", r.region ?? "—"],
                  ["Top altitude", `${fmtNumber(r.altitudeTop ?? 0)} m`],
                  ["Base altitude", `${fmtNumber(r.altitudeBase ?? 0)} m`],
                  ["Total km", `${r.pisteKm ?? "—"} km`],
                  ["Lifts", `${r.lifts ?? "—"} installations`],
                  ["Adult day pass", `€${r.dayPassPrice ?? "—"}`],
                  ["Snow certainty", `${r.snowScore?.toFixed(1) ?? "—"} / 10`],
                  ["Snow park", r.snowpark ? "Yes" : "No"],
                  ...(hasRating ? [["PeakFlow rating", `${fiveStar.toFixed(1)} / 5 ★`]] : []),
                ].map(([k, v], i, arr) => (
                  <div key={k} style={{ display: "flex", justifyContent: "space-between", padding: "7px 0", borderBottom: i < arr.length - 1 ? "1px solid var(--border)" : "none" }}>
                    <span>{k}</span>
                    <span style={{ fontWeight: 500, color: k === "Snow certainty" || k === "PeakFlow rating" ? "var(--peak-dark)" : "var(--ink)" }}>{v}</span>
                  </div>
                ))}
              </div>
              <button className="btn btn-primary" style={{ width: "100%", justifyContent: "center", marginTop: 16 }}>Book day pass →</button>
              <button className="btn btn-outline" style={{ width: "100%", justifyContent: "center", marginTop: 8 }}>+ Wishlist</button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
