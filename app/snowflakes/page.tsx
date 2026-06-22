import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { countryFlag, countryNL, emojiFor, toFiveStars } from "@/lib/display";

export const dynamic = "force-dynamic";

const PACKAGES = [
  {
    id: "basis",
    name: "Basis",
    days: "2 dagen",
    stay: "Budget t/m mid-range",
    price: 1190,
    sf: 1,
    color: "#94a3b8",
    highlight: false,
    badge: null as string | null,
    items: ["2 volledige inspectiedagen", "Verblijf in het resort (inbegrepen)", "Skipas + bergrestaurant getest", "Alle basiscategorieën beoordeeld", "Rapport + ❄ badge indien toegekend"],
  },
  {
    id: "inspecteur",
    name: "Inspecteur",
    days: "2 dagen intensief",
    stay: "Mid-range t/m upper",
    price: 1390,
    sf: 1,
    color: "#94a3b8",
    highlight: false,
    badge: null as string | null,
    items: ["2 x ochtend vroeg tot sluitingstijd", "Verblijf + diner getest", "Alle 7 categorieën", "Anonieme gastronomietest", "Rapport + foto's + ❄ badge"],
  },
  {
    id: "senior",
    name: "Senior",
    days: "3 dagen",
    stay: "Upper t/m luxe",
    price: 2190,
    sf: 2,
    color: "#f59e0b",
    highlight: true,
    badge: "POPULAIR" as string | null,
    items: ["3 dagen incognito", "Luxe verblijf + fine dining getest", "Alle 9 categorieën", "60 min. directiegesprek", "❄❄ badge + prioriteit vermelding", "Socialmedia bij toekenning"],
  },
  {
    id: "hoofd",
    name: "Hoofd",
    days: "3 dagen uitgebreid",
    stay: "Luxe t/m premium",
    price: 2990,
    sf: 2,
    color: "#f59e0b",
    highlight: false,
    badge: null as string | null,
    items: ["3 dagen, opening t/m avond", "Premium verblijf op kosten inspectie", "Anonieme restaurant + après tests", "32+ pagina rapport", "2 terugkoppelgesprekken", "❄❄ badge + eigen sectie + 3 posts"],
  },
  {
    id: "grand",
    name: "Grand",
    days: "4 dagen",
    stay: "Premium t/m 5-sterren luxe",
    price: 4190,
    sf: 3,
    color: "#fbbf24",
    highlight: false,
    badge: "EXCLUSIEF" as string | null,
    items: ["4 dagen + avond- & nachtinspectie", "5-sterren verblijf volledig inbegrepen", "Nachtleven, service & gastronomie", "48+ pagina rapport + perskit", "❄❄❄ gouden badge + glow vermelding", "Persverklaring + 6 posts"],
  },
  {
    id: "meester",
    name: "Meester",
    days: "5 dagen",
    stay: "Ultra-luxe, elk resort",
    price: 6490,
    sf: 3,
    color: "#fbbf24",
    highlight: false,
    badge: "ULTIEM" as string | null,
    items: ["5 dagen, 2 onafhankelijke inspecteurs", "Ultra-luxe verblijf (elk resort) inbegrepen", "Meerdere accommodatiecategorieën getest", "64+ pagina rapport NL + EN", "Directiebriefing + implementatieplan", "❄❄❄ badge + permanente topvermelding", "Jaarlijkse herbeoordeling inbegrepen"],
  },
];

export default async function SnowflakesPage() {
  const [, resorts] = await Promise.all([
    prisma.resort.count(),
    prisma.resort.findMany({
      where: { snowflakeInspected: true },
      orderBy: [{ snowflakes: "desc" }, { averageOverallRating: "desc" }],
      select: {
        id: true, name: true, Country: true, snowflakes: true,
        snowflakeNote: true, snowflakeAwardedAt: true, averageOverallRating: true,
      },
    }),
  ]);

  const sf3 = resorts.filter(r => r.snowflakes === 3);
  const sf2 = resorts.filter(r => r.snowflakes === 2);
  const sf1 = resorts.filter(r => r.snowflakes === 1);

  function ResortCard({ r, tier }: { r: typeof resorts[0]; tier: number }) {
    const c = tier === 3
      ? { border: "rgba(251,191,36,.4)", bg: "linear-gradient(135deg,#fffbeb,#fef3c7)", sf: "#d97706", accent: "#78350f" }
      : tier === 2
      ? { border: "#f59e0b", bg: "#fffbeb", sf: "#d97706", accent: "#92400e" }
      : { border: "#e2e8f0", bg: "#f8fafc", sf: "#64748b", accent: "#334155" };

    return (
      <Link href={`/resort/${r.id}`} style={{ textDecoration: "none", display: "block", marginBottom: 10 }}>
        <div style={{ background: c.bg, border: `1px solid ${c.border}`, borderRadius: 12, padding: "14px 16px", display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ fontSize: 36, lineHeight: 1, flexShrink: 0 }}>{emojiFor(r.id)}</div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 15, fontWeight: 700, color: "#1a1a16", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{r.name}</div>
            <div style={{ fontSize: 12, color: "#64748b", marginTop: 2 }}>
              {countryFlag(r.Country)} {countryNL(r.Country)}
              {r.snowflakeAwardedAt && <span style={{ marginLeft: 8, color: c.sf }}>· {new Date(r.snowflakeAwardedAt).getFullYear()}</span>}
            </div>
            {r.snowflakeNote && (
              <p style={{ fontSize: 11, color: c.accent, fontStyle: "italic", margin: "5px 0 0", overflow: "hidden", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical" as const }}>&ldquo;{r.snowflakeNote}&rdquo;</p>
            )}
          </div>
          <div style={{ textAlign: "right", flexShrink: 0 }}>
            <div style={{ fontSize: 16, letterSpacing: 2, color: c.sf }}>{"❄".repeat(r.snowflakes)}</div>
            {(r.averageOverallRating ?? 0) > 0 && (
              <div style={{ fontSize: 11, color: "#f59e0b", fontWeight: 600, marginTop: 2 }}>★ {toFiveStars(r.averageOverallRating).toFixed(1)}</div>
            )}
          </div>
        </div>
      </Link>
    );
  }

  return (
    <>
      <style>{`
        .sf-hero { background: linear-gradient(135deg,#1c0a00,#78350f,#b45309); color: white; padding: 56px 0 44px; }
        .sf-hero-inner { display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 24px; }
        .sf-hero-counts { display: flex; gap: 24px; }

        .sf-pkg-section { background: #0f172a; padding: 48px 0; }
        .sf-pkg-header { display: flex; align-items: flex-end; justify-content: space-between; margin-bottom: 28px; flex-wrap: wrap; gap: 10px; }
        .sf-pkg-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 14px; margin-bottom: 24px; }
        .sf-tier-bar { display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; }

        .sf-bottom { display: grid; grid-template-columns: 2fr 1fr; gap: 40px; align-items: start; padding-top: 48px; padding-bottom: 72px; }
        .sf-sidebar { position: sticky; top: 80px; }

        @media (max-width: 900px) {
          .sf-pkg-grid { grid-template-columns: repeat(2, 1fr); }
        }

        @media (max-width: 640px) {
          .sf-hero { padding: 40px 0 32px; }
          .sf-hero-inner { flex-direction: column; gap: 20px; }
          .sf-hero-counts { gap: 20px; }

          .sf-pkg-section { padding: 36px 0; }
          .sf-pkg-header { flex-direction: column; align-items: flex-start; }
          .sf-pkg-grid { grid-template-columns: 1fr; gap: 12px; }
          .sf-tier-bar { grid-template-columns: 1fr; gap: 8px; }

          .sf-bottom { grid-template-columns: 1fr; gap: 32px; padding-top: 32px; padding-bottom: 48px; }
          .sf-sidebar { position: static; }
        }
      `}</style>

      {/* HERO */}
      <div className="sf-hero">
        <div className="container">
          <div className="sf-hero-inner">
            <div style={{ maxWidth: 520 }}>
              <div style={{ fontSize: 32, letterSpacing: 8, marginBottom: 14 }}>❄❄❄</div>
              <h1 style={{ fontSize: "clamp(24px,4vw,42px)", fontWeight: 800, color: "white", marginBottom: 10, margin: "0 0 10px" }}>
                PeakFlow Snowflakes
              </h1>
              <p style={{ fontSize: 15, color: "rgba(255,255,255,.75)", lineHeight: 1.7, margin: 0 }}>
                De hoogste onderscheiding voor skiresorts. Uitgereikt na een persoonlijk inspectiebezoek — niet op basis van statistieken.
              </p>
            </div>
            <div className="sf-hero-counts">
              {[
                { n: sf1.length, sf: "❄", c: "#94a3b8" },
                { n: sf2.length, sf: "❄❄", c: "#f59e0b" },
                { n: sf3.length, sf: "❄❄❄", c: "#fbbf24" },
              ].map(x => (
                <div key={x.sf} style={{ textAlign: "center" }}>
                  <div style={{ fontSize: 22, fontWeight: 800, color: x.c }}>{x.n}</div>
                  <div style={{ fontSize: 12, letterSpacing: 3, color: x.c, opacity: .7 }}>{x.sf}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* PAKKETTEN */}
      <div className="sf-pkg-section">
        <div className="container">
          <div className="sf-pkg-header">
            <div>
              <div style={{ fontSize: 11, fontWeight: 700, color: "#f59e0b", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 6 }}>Inspectiepakketten</div>
              <h2 style={{ fontSize: 21, fontWeight: 800, color: "white", margin: 0 }}>Kies jouw pakket</h2>
            </div>
            <div style={{ fontSize: 11, color: "#475569" }}>+ 15% reiskosten · excl. BTW · herbeoordeling zelfde tarief</div>
          </div>

          <div className="sf-pkg-grid">
            {PACKAGES.map(p => {
              const travel = Math.round(p.price * 0.15);
              return (
                <div key={p.id} style={{
                  background: p.highlight ? "linear-gradient(160deg,#14241a,#1a3024)" : "#1e293b",
                  border: `1px solid ${p.highlight ? "#f59e0b" : p.sf === 3 ? "rgba(251,191,36,.2)" : "#334155"}`,
                  borderRadius: 12,
                  padding: "20px 16px",
                  position: "relative",
                  display: "flex",
                  flexDirection: "column",
                }}>
                  {p.badge && (
                    <div style={{ position: "absolute", top: -10, left: "50%", transform: "translateX(-50%)", background: p.highlight ? "#f59e0b" : "#d97706", color: "white", fontSize: 9, fontWeight: 800, padding: "3px 12px", borderRadius: 999, letterSpacing: "0.07em", whiteSpace: "nowrap" }}>
                      {p.badge}
                    </div>
                  )}

                  <div style={{ marginBottom: 12 }}>
                    <div style={{ fontSize: 15, fontWeight: 800, color: "white", marginBottom: 2 }}>{p.name}</div>
                    <div style={{ fontSize: 11, color: "#64748b" }}>{p.days}</div>
                    <div style={{ fontSize: 10, color: "#334155", marginTop: 2 }}>{p.stay}</div>
                  </div>

                  <div style={{ marginBottom: 12 }}>
                    <span style={{ fontSize: 26, fontWeight: 800, color: p.color }}>€ {p.price.toLocaleString("nl-NL")}</span>
                    <div style={{ fontSize: 10, color: "#475569", marginTop: 2 }}>+ € {travel} reiskosten</div>
                  </div>

                  <div style={{ fontSize: 11, color: p.color, letterSpacing: 2, marginBottom: 12, display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap" }}>
                    {"❄".repeat(p.sf)}
                    <span style={{ color: "#475569", letterSpacing: 0, fontSize: 10 }}>
                      {["basis","inspecteur"].includes(p.id) ? "min. voor ❄" : ["senior","hoofd"].includes(p.id) ? "min. voor ❄❄" : "min. voor ❄❄❄"}
                    </span>
                  </div>

                  <ul style={{ listStyle: "none", padding: 0, margin: 0, flex: 1, borderTop: "1px solid #334155", paddingTop: 10 }}>
                    {p.items.map((item, i) => (
                      <li key={i} style={{
                        fontSize: 12,
                        color: item.startsWith("❄") ? p.color : "#94a3b8",
                        fontWeight: item.startsWith("❄") ? 600 : 400,
                        padding: "3px 0",
                        display: "flex",
                        gap: 7,
                      }}>
                        <span style={{ color: item.startsWith("❄") ? p.color : "#334155", flexShrink: 0 }}>{item.startsWith("❄") ? "★" : "✓"}</span>
                        {item}
                      </li>
                    ))}
                  </ul>

                  <a href="mailto:inspectie@peakflow.ski" style={{
                    display: "block", textAlign: "center", marginTop: 14,
                    background: p.highlight ? "#f59e0b" : "transparent",
                    color: p.highlight ? "white" : p.color,
                    border: `1px solid ${p.highlight ? "#f59e0b" : p.color}`,
                    padding: "9px 0", borderRadius: 7, fontSize: 12, fontWeight: 700, textDecoration: "none",
                  }}>
                    Aanvragen →
                  </a>
                </div>
              );
            })}
          </div>

          {/* Min vereiste balk */}
          <div className="sf-tier-bar">
            {[
              { sf: "❄", color: "#94a3b8", pkg: "Basis", from: "€ 1.190" },
              { sf: "❄❄", color: "#f59e0b", pkg: "Senior", from: "€ 2.190" },
              { sf: "❄❄❄", color: "#fbbf24", pkg: "Grand", from: "€ 4.190" },
            ].map(x => (
              <div key={x.sf} style={{ background: "#1e293b", borderLeft: `3px solid ${x.color}`, borderRadius: 8, padding: "12px 14px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8 }}>
                <div>
                  <div style={{ fontSize: 10, color: "#475569", marginBottom: 2 }}>Minimum voor {x.sf}</div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: "white" }}>{x.pkg}</div>
                </div>
                <div style={{ fontSize: 13, fontWeight: 800, color: x.color, whiteSpace: "nowrap" }}>v.a. {x.from}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* GECERTIFICEERDE RESORTS */}
      <div className="container">
        <div className="sf-bottom">
          <div>
            {sf3.length > 0 && (
              <section style={{ marginBottom: 36 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14, flexWrap: "wrap" }}>
                  <span style={{ fontSize: 20, letterSpacing: 4, color: "#d97706" }}>❄❄❄</span>
                  <h2 style={{ fontSize: 17, fontWeight: 700, margin: 0 }}>Drie Snowflakes</h2>
                  <span style={{ fontSize: 12, color: "var(--ink3)" }}>— onvergelijkbaar</span>
                </div>
                {sf3.map(r => <ResortCard key={r.id} r={r} tier={3} />)}
              </section>
            )}
            {sf2.length > 0 && (
              <section style={{ marginBottom: 36 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14, flexWrap: "wrap" }}>
                  <span style={{ fontSize: 18, letterSpacing: 4, color: "#d97706" }}>❄❄</span>
                  <h2 style={{ fontSize: 17, fontWeight: 700, margin: 0 }}>Twee Snowflakes</h2>
                  <span style={{ fontSize: 12, color: "var(--ink3)" }}>— speciaal de reis waard</span>
                </div>
                {sf2.map(r => <ResortCard key={r.id} r={r} tier={2} />)}
              </section>
            )}
            {sf1.length > 0 && (
              <section style={{ marginBottom: 36 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14, flexWrap: "wrap" }}>
                  <span style={{ fontSize: 16, color: "#64748b" }}>❄</span>
                  <h2 style={{ fontSize: 17, fontWeight: 700, margin: 0 }}>Één Snowflake</h2>
                  <span style={{ fontSize: 12, color: "var(--ink3)" }}>— uitstekend in categorie</span>
                </div>
                {sf1.map(r => <ResortCard key={r.id} r={r} tier={1} />)}
              </section>
            )}
            {resorts.length === 0 && (
              <div style={{ textAlign: "center", padding: "60px 0", color: "var(--ink3)" }}>
                <div style={{ fontSize: 40, marginBottom: 12 }}>❄</div>
                <p>Nog geen gecertificeerde resorts.</p>
              </div>
            )}
          </div>

          {/* SIDEBAR */}
          <div className="sf-sidebar">
            <div style={{ background: "#0f172a", border: "1px solid #1e293b", borderRadius: 12, padding: 20, marginBottom: 14 }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: "white", marginBottom: 14 }}>Hoe werkt het?</div>
              {[
                { n: "1", t: "Kies een pakket en vraag aan" },
                { n: "2", t: "Betaal de inspectiefee" },
                { n: "3", t: "Inspecteur bezoekt jouw resort" },
                { n: "4", t: "Ontvang rapport + eventueel Snowflake" },
              ].map(s => (
                <div key={s.n} style={{ display: "flex", gap: 10, marginBottom: 10, alignItems: "flex-start" }}>
                  <div style={{ width: 20, height: 20, background: "#f59e0b", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 700, color: "white", flexShrink: 0, marginTop: 1 }}>{s.n}</div>
                  <div style={{ fontSize: 12, color: "#94a3b8" }}>{s.t}</div>
                </div>
              ))}
              <a href="mailto:inspectie@peakflow.ski" style={{ display: "block", textAlign: "center", background: "linear-gradient(135deg,#d97706,#f59e0b)", color: "white", padding: "10px", borderRadius: 8, fontSize: 13, fontWeight: 700, textDecoration: "none", marginTop: 6 }}>
                Inspectie aanvragen →
              </a>
            </div>

            <div style={{ background: "white", border: "1px solid var(--border)", borderRadius: 12, padding: 20 }}>
              <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 14 }}>Wat is een Snowflake?</div>
              {[
                { sf: "❄", title: "Uitzonderlijk", desc: "Overtreft de standaard in zijn categorie." },
                { sf: "❄❄", title: "Uitstekend", desc: "Geen zwakke punten. De reis speciaal waard." },
                { sf: "❄❄❄", title: "Onvergelijkbaar", desc: "Een van de beste skiresorts op aarde." },
              ].map((x, i, arr) => (
                <div key={x.sf} style={{ display: "flex", gap: 12, paddingBottom: i < arr.length - 1 ? 12 : 0, marginBottom: i < arr.length - 1 ? 12 : 0, borderBottom: i < arr.length - 1 ? "1px solid var(--border)" : "none" }}>
                  <div style={{ fontSize: 16, flexShrink: 0, width: 44 }}>{x.sf}</div>
                  <div>
                    <div style={{ fontSize: 12, fontWeight: 700 }}>{x.title}</div>
                    <div style={{ fontSize: 11, color: "var(--ink3)", marginTop: 1 }}>{x.desc}</div>
                  </div>
                </div>
              ))}
              <div style={{ fontSize: 11, color: "var(--ink3)", marginTop: 14, paddingTop: 12, borderTop: "1px solid var(--border)" }}>
                Een Snowflake is nooit gekocht — alleen verdiend. Het oordeel van de inspecteur is altijd onafhankelijk.
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
