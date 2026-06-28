import Link from "next/link";

export const metadata = {
  title: "Blog — PeakFlow",
  description: "Ski resort insights, snow certainty analysis, tips for skiers",
};

const ARTICLES = [
  {
    slug: "beste-skigebieden-beginners-oostenrijk",
    title: "Best ski resorts for beginners in Austria 2026",
    excerpt: "Which Austrian resorts are perfect for beginners? We analysed 10 years of snowfall data and thousands of reviews.",
    date: "2026-01-15",
    readTime: "6 min",
    category: "Guides",
  },
  {
    slug: "kitzbuhel-vs-st-anton",
    title: "Kitzbühel vs St. Anton — which resort suits you?",
    excerpt: "Two legendary Austrian ski resorts, but very different character. We compare snow certainty, difficulty, après-ski and price.",
    date: "2026-01-10",
    readTime: "8 min",
    category: "Comparison",
  },
  {
    slug: "sneeuwzekerheid-alpen-welke-resorts",
    title: "Snow certainty in the Alps — which resorts are most reliable?",
    excerpt: "With 10 years of Open-Meteo data we identified the most snow-reliable Alpine resorts. Based on altitude, historical snowfall and latitude.",
    date: "2026-01-05",
    readTime: "10 min",
    category: "Data",
  },
  {
    slug: "freeride-geheimen-verbier-chamonix",
    title: "Freeride secrets: Verbier vs Chamonix vs La Grave",
    excerpt: "For experts and freeride skiers: where do you find the best powder snow in Europe? Data analysis of snowfall and terrain.",
    date: "2025-12-28",
    readTime: "7 min",
    category: "Freeride",
  },
  {
    slug: "goedkope-skigebieden-alpen",
    title: "5 budget Alpine resorts with excellent snow certainty",
    excerpt: "Not everyone wants to pay €70 per day. We found 5 underrated resorts under €50 with strong snow data.",
    date: "2025-12-20",
    readTime: "5 min",
    category: "Budget",
  },
  {
    slug: "groepsplanning-familie-skiweek",
    title: "How to plan the perfect ski week for a group with different levels?",
    excerpt: "Your group has beginners, intermediates and experts. How do you choose a resort that works for everyone? The PeakFlow Group Planner guide.",
    date: "2025-12-15",
    readTime: "6 min",
    category: "Guides",
  },
];

export default function BlogPage() {
  return (
    <section className="section">
      <div className="container" style={{ maxWidth: 900 }}>
        <span className="label">Blog</span>
        <h2 style={{ marginBottom: 12 }}>Ski insights from PeakFlow</h2>
        <p style={{ fontSize: 16, color: "var(--ink2)", marginBottom: 48 }}>
          Data-driven guides, resort comparisons and snow analysis for skiers
        </p>

        <div style={{ display: "grid", gap: 32, marginBottom: 60 }}>
          {ARTICLES.map((article) => (
            <Link
              key={article.slug}
              href={`/blog/${article.slug}`}
              style={{
                display: "block",
                textDecoration: "none",
                borderBottom: "1px solid var(--border)",
                paddingBottom: 32,
              }}
            >
              <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 20 }}>
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", gap: 12, alignItems: "center", marginBottom: 10 }}>
                    <span
                      style={{
                        fontSize: 12,
                        fontWeight: 600,
                        color: "var(--peak)",
                        textTransform: "uppercase",
                        letterSpacing: "0.5px",
                      }}
                    >
                      {article.category}
                    </span>
                    <span style={{ fontSize: 12, color: "var(--ink3)" }}>
                      {new Date(article.date).toLocaleDateString("en-GB", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </span>
                  </div>

                  <h3
                    style={{
                      fontSize: 20,
                      fontWeight: 700,
                      marginBottom: 10,
                      color: "var(--ink)",
                      lineHeight: 1.3,
                    }}
                  >
                    {article.title}
                  </h3>

                  <p style={{ fontSize: 15, color: "var(--ink2)", marginBottom: 12, lineHeight: 1.6 }}>
                    {article.excerpt}
                  </p>

                  <div
                    style={{
                      fontSize: 13,
                      color: "var(--ink3)",
                      display: "flex",
                      alignItems: "center",
                      gap: 4,
                    }}
                  >
                    ⏱ {article.readTime} read
                  </div>
                </div>

                <div
                  style={{
                    fontSize: 24,
                    color: "var(--peak)",
                    flexShrink: 0,
                    marginTop: 6,
                  }}
                >
                  →
                </div>
              </div>
            </Link>
          ))}
        </div>

        <div style={{ textAlign: "center" }}>
          <p style={{ color: "var(--ink3)", marginBottom: 20 }}>
            Want to receive updates on new articles?
          </p>
          <div
            style={{
              display: "flex",
              gap: 10,
              justifyContent: "center",
              flexWrap: "wrap",
            }}
          >
            <input
              type="email"
              placeholder="your@email.com"
              style={{
                padding: "10px 16px",
                borderRadius: "8px",
                border: "1px solid var(--border)",
                fontSize: 14,
                minWidth: 250,
              }}
            />
            <button
              className="btn btn-primary"
              style={{
                fontSize: 14,
                padding: "10px 24px",
              }}
            >
              Subscribe
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
