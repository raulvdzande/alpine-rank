import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { countryNL, countryFlag, toFiveStars, stars, gradientFor, emojiFor } from "@/lib/display";

export const metadata = {
  title: "Rankings — PeakFlow",
  description: "Ski resorts ranked by snow certainty, level, price and more",
};

const CATEGORIES = [
  { slug: "alpen", label: "🏔 Alps", desc: "Top ski resorts in the Alps" },
  { slug: "beginners", label: "🟢 Beginners", desc: "Perfect for beginner skiers" },
  { slug: "familie", label: "👨‍👩‍👧 Family", desc: "Ideal for families with children" },
  { slug: "expert", label: "⚫ Expert", desc: "Challenging terrain for experts" },
  { slug: "budget", label: "💰 Budget", desc: "Best value for money" },
  { slug: "sneeuw", label: "❄ Snow", desc: "Highest snow certainty" },
];

export default async function RankingsPage() {
  const topSnow = await prisma.resort.findMany({
    where: { snowScore: { not: null } },
    orderBy: { snowScore: "desc" },
    take: 3,
  });

  return (
    <section className="section">
      <div className="container">
        <span className="label">Rankings</span>
        <h2>Ranked by PeakFlow</h2>
        <p style={{ fontSize: 16, color: "var(--ink2)", marginBottom: 48 }}>
          Explore our curated rankings by snow certainty, level, family-friendliness and more
        </p>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 24, marginBottom: 60 }} className="responsive-grid">
          {CATEGORIES.map((cat) => (
            <Link
              key={cat.slug}
              href={`/rankings/${cat.slug}`}
              style={{
                background: "white",
                border: "1px solid var(--border)",
                borderRadius: "var(--r-lg)",
                padding: 28,
                textDecoration: "none",
                transition: "box-shadow .2s, transform .2s",
              }}
              onMouseEnter={(e) => {
                const el = e.currentTarget as HTMLElement;
                el.style.boxShadow = "var(--shadow-lg)";
                el.style.transform = "translateY(-3px)";
              }}
              onMouseLeave={(e) => {
                const el = e.currentTarget as HTMLElement;
                el.style.boxShadow = "none";
                el.style.transform = "translateY(0)";
              }}
            >
              <div style={{ fontSize: 32, marginBottom: 12 }}>{cat.label.split(" ")[0]}</div>
              <div style={{ fontSize: 16, fontWeight: 700, marginBottom: 6, color: "var(--ink)" }}>
                {cat.label.substring(2)}
              </div>
              <div style={{ fontSize: 13, color: "var(--ink3)" }}>{cat.desc}</div>
              <div style={{ fontSize: 13, color: "var(--peak)", fontWeight: 600, marginTop: 16 }}>
                View ranking →
              </div>
            </Link>
          ))}
        </div>

        {topSnow.length > 0 && (
          <>
            <div style={{ marginBottom: 32 }}>
              <h3 style={{ marginBottom: 20 }}>🌟 Snow certainty top 3</h3>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 20 }} className="responsive-grid">
                {topSnow.map((r, i) => (
                  <Link
                    key={r.id}
                    href={r.slug ? `/resorts/${r.slug}` : `/resort/${r.id}`}
                    style={{
                      background: "white",
                      border: "1px solid var(--border)",
                      borderRadius: "var(--r-lg)",
                      overflow: "hidden",
                      textDecoration: "none",
                      transition: "box-shadow .2s, transform .2s",
                      display: "block",
                    }}
                    onMouseEnter={(e) => {
                      const el = e.currentTarget as HTMLElement;
                      el.style.boxShadow = "var(--shadow-lg)";
                      el.style.transform = "translateY(-3px)";
                    }}
                    onMouseLeave={(e) => {
                      const el = e.currentTarget as HTMLElement;
                      el.style.boxShadow = "none";
                      el.style.transform = "translateY(0)";
                    }}
                  >
                    <div
                      style={{
                        background: gradientFor(r.id),
                        padding: "40px 0",
                        textAlign: "center",
                        color: "white",
                        fontSize: 64,
                      }}
                    >
                      {emojiFor(r.id)}
                    </div>
                    <div style={{ padding: 20 }}>
                      <div style={{ fontSize: 12, fontWeight: 700, color: "var(--peak)", marginBottom: 6 }}>
                        #{i + 1} SNOW
                      </div>
                      <div style={{ fontSize: 16, fontWeight: 700, marginBottom: 8, color: "var(--ink)" }}>
                        {r.name}
                      </div>
                      <div style={{ fontSize: 13, color: "var(--ink2)", marginBottom: 12 }}>
                        {countryFlag(r.Country)} {countryNL(r.Country)}
                      </div>
                      <div style={{ fontSize: 20, fontWeight: 700, color: "var(--peak)", marginBottom: 6 }}>
                        {r.snowScore?.toFixed(1) ?? "—"}/10 ❄
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </>
        )}

        <style>{`
          @media (max-width: 768px) {
            .responsive-grid {
              grid-template-columns: 1fr !important;
            }
          }
        `}</style>
      </div>
    </section>
  );
}
