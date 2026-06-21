import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { countryFlag, countryNL, emojiFor, toFiveStars } from "@/lib/display";

export const dynamic = "force-dynamic";

export default async function SnowflakesPage() {
  const [total, resorts] = await Promise.all([
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

  const cardStyle: React.CSSProperties = {
    background: "white",
    border: "1px solid var(--border)",
    borderRadius: "var(--r-lg)",
    padding: "20px 24px",
    display: "flex",
    alignItems: "flex-start",
    gap: 16,
    marginBottom: 12,
  };

  function ResortCard({ r, tier }: { r: typeof resorts[0]; tier: number }) {
    const colors = {
      1: { border: "#94a3b8", bg: "#f8fafc", sf: "#64748b", accent: "#334155" },
      2: { border: "#f59e0b", bg: "#fffbeb", sf: "#d97706", accent: "#92400e" },
      3: { border: "#fbbf24", bg: "linear-gradient(135deg,#fffbeb,#fef3c7)", sf: "#f59e0b", accent: "#78350f" },
    }[tier] ?? { border: "#e2e8f0", bg: "white", sf: "#64748b", accent: "#334155" };

    return (
      <Link href={`/resort/${r.id}`} style={{ textDecoration: "none" }}>
        <div style={{ ...cardStyle, border: `1px solid ${colors.border}`, background: colors.bg }}>
          <div style={{ fontSize: 48, lineHeight: 1 }}>{emojiFor(r.id)}</div>
          <div style={{ flex: 1 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4, flexWrap: "wrap" }}>
              <span style={{ fontSize: 20, letterSpacing: 3, color: colors.sf }}>{"❄".repeat(r.snowflakes)}</span>
              {r.snowflakeAwardedAt && (
                <span style={{ fontSize: 11, color: colors.accent, background: "rgba(0,0,0,.06)", padding: "2px 8px", borderRadius: 999 }}>
                  {new Date(r.snowflakeAwardedAt).getFullYear()}
                </span>
              )}
            </div>
            <div style={{ fontSize: 17, fontWeight: 700, color: "#1a1a16", marginBottom: 4 }}>{r.name}</div>
            <div style={{ fontSize: 13, color: "#64748b", marginBottom: r.snowflakeNote ? 10 : 0 }}>
              {countryFlag(r.Country)} {countryNL(r.Country)}
              {(r.averageOverallRating ?? 0) > 0 && (
                <span style={{ marginLeft: 12, color: "#f59e0b", fontWeight: 600 }}>
                  ★ {toFiveStars(r.averageOverallRating).toFixed(1)}
                </span>
              )}
            </div>
            {r.snowflakeNote && (
              <p style={{ fontSize: 13, color: colors.accent, fontStyle: "italic", margin: 0 }}>
                &ldquo;{r.snowflakeNote}&rdquo;
              </p>
            )}
          </div>
          <div style={{ fontSize: 12, color: "var(--peak)", fontWeight: 600 }}>Bekijk →</div>
        </div>
      </Link>
    );
  }

  return (
    <>
      {/* HERO */}
      <div style={{ background: "linear-gradient(135deg,#1c0a00,#78350f,#d97706)", color: "white", padding: "80px 0 60px" }}>
        <div className="container">
          <div style={{ maxWidth: 680 }}>
            <div style={{ fontSize: 48, letterSpacing: 8, marginBottom: 20 }}>❄❄❄</div>
            <h1 style={{ fontSize: "clamp(28px,4vw,48px)", fontWeight: 800, marginBottom: 16, color: "white" }}>
              PeakFlow Snowflakes
            </h1>
            <p style={{ fontSize: 18, color: "rgba(255,255,255,.8)", lineHeight: 1.7, marginBottom: 32 }}>
              Het hoogste onderscheidingssysteem voor skiresorts. Zoals de Michelin-sterren voor restaurants, zijn PeakFlow Snowflakes de ultieme erkenning voor uitzonderlijke skigebieden — uitgereikt na een rigoureuze inspectie ter plaatse.
            </p>
            <div style={{ display: "flex", gap: 20, flexWrap: "wrap" }}>
              {[
                { n: sf1.length, label: "❄ One Snowflake" },
                { n: sf2.length, label: "❄❄ Two Snowflakes" },
                { n: sf3.length, label: "❄❄❄ Three Snowflakes" },
              ].map(x => (
                <div key={x.label} style={{ textAlign: "center" }}>
                  <div style={{ fontSize: 28, fontWeight: 800, color: "#fbbf24" }}>{x.n}</div>
                  <div style={{ fontSize: 12, color: "rgba(255,255,255,.6)" }}>{x.label}</div>
                </div>
              ))}
              <div style={{ textAlign: "center" }}>
                <div style={{ fontSize: 28, fontWeight: 800, color: "rgba(255,255,255,.5)" }}>{total}</div>
                <div style={{ fontSize: 12, color: "rgba(255,255,255,.4)" }}>Totaal beoordeeld</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container" style={{ paddingTop: 60, paddingBottom: 80 }}>
        <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 48, alignItems: "start" }}>
          <div>
            {/* 3 SNOWFLAKES */}
            {sf3.length > 0 && (
              <section style={{ marginBottom: 48 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
                  <div style={{ fontSize: 28, letterSpacing: 4 }}>❄❄❄</div>
                  <div>
                    <h2 style={{ fontSize: 22, marginBottom: 2 }}>Drie Snowflakes</h2>
                    <p style={{ fontSize: 13, color: "var(--ink3)", margin: 0 }}>Een unieke, onvergelijkbare skiervaring. Een reis op zichzelf waard.</p>
                  </div>
                </div>
                {sf3.map(r => <ResortCard key={r.id} r={r} tier={3} />)}
              </section>
            )}

            {/* 2 SNOWFLAKES */}
            {sf2.length > 0 && (
              <section style={{ marginBottom: 48 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
                  <div style={{ fontSize: 24, letterSpacing: 4, color: "#d97706" }}>❄❄</div>
                  <div>
                    <h2 style={{ fontSize: 22, marginBottom: 2 }}>Twee Snowflakes</h2>
                    <p style={{ fontSize: 13, color: "var(--ink3)", margin: 0 }}>De reis speciaal naar dit resort waard. Elk aspect uitstekend.</p>
                  </div>
                </div>
                {sf2.map(r => <ResortCard key={r.id} r={r} tier={2} />)}
              </section>
            )}

            {/* 1 SNOWFLAKE */}
            {sf1.length > 0 && (
              <section style={{ marginBottom: 48 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
                  <div style={{ fontSize: 22, color: "#64748b" }}>❄</div>
                  <div>
                    <h2 style={{ fontSize: 22, marginBottom: 2 }}>Één Snowflake</h2>
                    <p style={{ fontSize: 13, color: "var(--ink3)", margin: 0 }}>Een uitzonderlijk resort dat opvalt in zijn categorie.</p>
                  </div>
                </div>
                {sf1.map(r => <ResortCard key={r.id} r={r} tier={1} />)}
              </section>
            )}

            {resorts.length === 0 && (
              <div style={{ textAlign: "center", padding: "80px 0", color: "var(--ink3)" }}>
                <div style={{ fontSize: 48, marginBottom: 16 }}>❄</div>
                <p>Nog geen resorts hebben een PeakFlow Snowflake ontvangen.</p>
                <p style={{ fontSize: 13, marginTop: 8 }}>Inspectie aanvragen? Neem contact op via het formulier hieronder.</p>
              </div>
            )}
          </div>

          {/* SIDEBAR: aanvraagproces */}
          <div style={{ position: "sticky", top: 80 }}>
            <div style={{ background: "linear-gradient(135deg,#0f172a,#1e293b)", border: "1px solid #334155", borderRadius: "var(--r-lg)", padding: 24, marginBottom: 20 }}>
              <div style={{ fontSize: 14, fontWeight: 700, color: "white", marginBottom: 4 }}>Inspectie aanvragen</div>
              <div style={{ fontSize: 13, color: "#94a3b8", lineHeight: 1.7, marginBottom: 20 }}>
                Wil jouw resort een PeakFlow Snowflake ontvangen? Vraag een inspectie aan. Onze inspecteur bezoekt jouw resort persoonlijk en beoordeelt alles ter plaatse.
              </div>

              {/* Prijzen per tier */}
              <div style={{ marginBottom: 20 }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: "#64748b", textTransform: "uppercase" as const, letterSpacing: "0.5px", marginBottom: 10 }}>Inspectiepakketten</div>
                {[
                  {
                    sf: "❄", label: "Één Snowflake", price: "€ 1.490", travel: "€ 224", note: "Initiële inspectie", color: "#94a3b8",
                    includes: ["1 dag inspectiebezoek ter plaatse", "Beoordeling op 4 hoofdcategorieën", "Volledig inspectierapport (PDF)", "Snowflake-badge op PeakFlow profiel", "Vermelding op /snowflakes pagina"],
                  },
                  {
                    sf: "❄❄", label: "Twee Snowflakes", price: "€ 2.490", travel: "€ 374", note: "Uitgebreide inspectie", color: "#f59e0b",
                    includes: ["2 dagen inspectiebezoek ter plaatse", "Beoordeling op alle 9 categorieën", "Uitgebreid inspectierapport met foto's", "Snowflake-badge + featured positie", "Vermelding op /snowflakes pagina", "Socialmedia-vermelding bij toekenning"],
                  },
                  {
                    sf: "❄❄❄", label: "Drie Snowflakes", price: "€ 3.990", travel: "€ 599", note: "Prestige inspectie", color: "#fbbf24",
                    includes: ["3 dagen prestige inspectiebezoek", "Diepgaande beoordeling op alle categorieën", "Uitgebreid rapport + persoonlijk gesprek", "Gouden Snowflake-badge met animatie", "Topvermelding op /snowflakes pagina", "Persverklaring & socialmedia-campagne", "Jaarlijks herinspectierapport inbegrepen"],
                  },
                ].map(p => (
                  <div key={p.sf} style={{ padding: "14px 0", borderBottom: "1px solid #1e293b" }}>
                    <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 10 }}>
                      <div>
                        <div style={{ fontSize: 14, color: p.color, letterSpacing: 2, marginBottom: 2 }}>{p.sf}</div>
                        <div style={{ fontSize: 12, color: "#64748b" }}>{p.note}</div>
                      </div>
                      <div style={{ textAlign: "right" }}>
                        <div style={{ fontSize: 15, fontWeight: 700, color: "white" }}>{p.price}</div>
                        <div style={{ fontSize: 10, color: "#475569" }}>+ reiskosten ({p.travel} · 15%)</div>
                      </div>
                    </div>
                    <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                      {p.includes.map((item, i) => (
                        <li key={i} style={{ fontSize: 11, color: "#64748b", padding: "2px 0", display: "flex", gap: 6, alignItems: "flex-start" }}>
                          <span style={{ color: p.color, flexShrink: 0 }}>✓</span>
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
                <div style={{ fontSize: 11, color: "#475569", marginTop: 10, lineHeight: 1.6 }}>
                  Reiskosten bedragen 15% van de inspectiefee. Jaarlijkse herbeoordeling tegen dezelfde kosten.
                </div>
              </div>

              <div style={{ marginBottom: 20 }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: "#64748b", textTransform: "uppercase" as const, letterSpacing: "0.5px", marginBottom: 10 }}>Aanvraagproces</div>
                {[
                  { step: "1", text: "Stuur een aanvraag in via het contactformulier" },
                  { step: "2", text: "Betaal de inspectiefee vooraf" },
                  { step: "3", text: "Onze inspecteur plant een bezoek aan jouw resort" },
                  { step: "4", text: "Na het bezoek ontvangt u het volledige inspectierapport" },
                ].map(s => (
                  <div key={s.step} style={{ display: "flex", gap: 12, marginBottom: 12 }}>
                    <div style={{ width: 24, height: 24, background: "#f59e0b", color: "white", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700, flexShrink: 0 }}>
                      {s.step}
                    </div>
                    <div style={{ fontSize: 13, color: "#94a3b8", paddingTop: 3 }}>{s.text}</div>
                  </div>
                ))}
              </div>
              <a
                href="mailto:inspectie@peakflow.ski"
                style={{ display: "block", textAlign: "center", background: "linear-gradient(135deg,#d97706,#f59e0b)", color: "white", padding: "12px 20px", borderRadius: 8, fontSize: 13, fontWeight: 700, textDecoration: "none" }}
              >
                Inspectie aanvragen →
              </a>
            </div>

            <div style={{ background: "white", border: "1px solid var(--border)", borderRadius: "var(--r-lg)", padding: 20 }}>
              <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 12 }}>Wat betekent een Snowflake?</div>
              {[
                { sf: "❄", title: "Één Snowflake", desc: "Resort overtreft de standaard. Uitstekend in zijn categorie." },
                { sf: "❄❄", title: "Twee Snowflakes", desc: "De reis speciaal waard. Elk aspect uitstekend, geen zwakke punten." },
                { sf: "❄❄❄", title: "Drie Snowflakes", desc: "Onvergelijkbaar. Een van de beste skiresorts op aarde." },
              ].map(x => (
                <div key={x.sf} style={{ marginBottom: 14, paddingBottom: 14, borderBottom: "1px solid var(--border)" }}>
                  <div style={{ fontSize: 18, marginBottom: 4 }}>{x.sf}</div>
                  <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 2 }}>{x.title}</div>
                  <div style={{ fontSize: 12, color: "var(--ink3)" }}>{x.desc}</div>
                </div>
              ))}
              <div style={{ fontSize: 12, color: "var(--ink3)", marginTop: 8 }}>
                Snowflakes zijn alleen te verdienen via een officieel PeakFlow inspectiebezoek. Ze kunnen worden ingetrokken als de kwaliteit daalt.
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
