import Link from "next/link";

export const metadata = {
  title: "Blog — PeakFlow",
  description: "Ski resort insights, sneeuwzekerheid analysis, tips voor skiërs",
};

const ARTICLES = [
  {
    slug: "beste-skigebieden-beginners-oostenrijk",
    title: "Beste skigebieden voor beginners in Oostenrijk 2026",
    excerpt: "Welke Oostenrijkse resorts zijn perfect voor beginners? We hebben data van 10 jaar sneeuwval en duizenden reviews geanalyseerd.",
    date: "2026-01-15",
    readTime: "6 min",
    category: "Guides",
  },
  {
    slug: "kitzbuhel-vs-st-anton",
    title: "Kitzbühel vs St. Anton — welk resort past bij jou?",
    excerpt: "Twee legendaire Oostenrijkse skigebieden, maar heel andere karakter. We vergelijken sneeuwzekerheid, moeilijkheid, apres-ski en prijs.",
    date: "2026-01-10",
    readTime: "8 min",
    category: "Comparison",
  },
  {
    slug: "sneeuwzekerheid-alpen-welke-resorts",
    title: "Sneeuwzekerheid in de Alpen — welke resorts zijn het meest betrouwbaar?",
    excerpt: "Met 10 jaar Open-Meteo data hebben we de sneeuwzekerste Alpenresorts geïdentificeerd. Gebaseerd op hoogte, historische sneeuwval en breedtegraad.",
    date: "2026-01-05",
    readTime: "10 min",
    category: "Data",
  },
  {
    slug: "freeride-geheimen-verbier-chamonix",
    title: "Freeride-geheimen: Verbier vs Chamonix vs La Grave",
    excerpt: "Voor experts en freeride-skiers: waar vind je de beste poedersneeuw in Europa? Data-analyse van sneeuwval en terrain.",
    date: "2025-12-28",
    readTime: "7 min",
    category: "Freeride",
  },
  {
    slug: "goedkope-skigebieden-alpen",
    title: "5 goedkope Alpenresorts met uitstekende sneeuwzekerheid",
    excerpt: "Niet iedereen wil €70 per dag betalen. We hebben 5 ondergewaardeerde resorts gevonden onder €50 met sterke sneeuwdata.",
    date: "2025-12-20",
    readTime: "5 min",
    category: "Budget",
  },
  {
    slug: "groepsplanning-familie-skiweek",
    title: "Hoe plan je de perfecte skiweek voor een groep met verschillende niveaus?",
    excerpt: "Je groep heeft beginners, intermediate en experts. Hoe kies je een resort dat voor iedereen werkt? De PeakFlow Group Planner gids.",
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
        <h2 style={{ marginBottom: 12 }}>Ski insights van PeakFlow</h2>
        <p style={{ fontSize: 16, color: "var(--ink2)", marginBottom: 48 }}>
          Data-gedreven gidsen, resort-vergelijkingen en sneeuwanalyse voor skiërs
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
                      {new Date(article.date).toLocaleDateString("nl-NL", {
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
                    ⏱ {article.readTime} leestijd
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
            Wil je updates van nieuwe artikelen ontvangen?
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
              placeholder="jouw@email.com"
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
              Volgen
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
