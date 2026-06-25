export const metadata = {
  title: "Voor Skigebieden — PeakFlow",
  description: "PeakFlow Resort Starter: €79/maand. Profile management, review analytics, ranking insights.",
};

export default function ForResortsPage() {
  return (
    <>
      <section style={{ background: "linear-gradient(135deg, #1d9e75 0%, #1a5fb4 100%)", color: "white", padding: "80px 0" }}>
        <div className="container">
          <div style={{ maxWidth: 700 }}>
            <span style={{ fontSize: 12, fontWeight: 600, color: "rgba(255,255,255,.7)", textTransform: "uppercase", letterSpacing: "1px" }}>
              For Ski Resorts
            </span>
            <h1 style={{ fontSize: 48, fontWeight: 800, marginBottom: 20, lineHeight: 1.1 }}>
              Beheer je reputatie op PeakFlow
            </h1>
            <p style={{ fontSize: 18, color: "rgba(255,255,255,.85)", marginBottom: 32, lineHeight: 1.7 }}>
              5.000+ skiërs vergelijken jouw resort op sneeuwzekerheid, reviews en pistes. Zorg dat je profiel perfect is.
            </p>
            <button className="btn btn-primary btn-lg" style={{ background: "white", color: "#1d9e75", fontSize: 16, fontWeight: 600 }}>
              Start gratis demo →
            </button>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div style={{ textAlign: "center", marginBottom: 60 }}>
            <span className="label">Waarom PeakFlow</span>
            <h2>Wat skiërs zien op jouw resort-pagina</h2>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 32, marginBottom: 60 }} className="responsive-grid">
            <div>
              <div style={{ fontSize: 24, marginBottom: 16 }}>⭐</div>
              <h3 style={{ marginBottom: 8 }}>Reviews & Ratings</h3>
              <p style={{ fontSize: 14, color: "var(--ink2)" }}>
                Skiërs beoordelen je resort op 7 criteria: sneeuw, terrein, liften, après, familie, prijs-waarde, uitzicht.
              </p>
            </div>
            <div>
              <div style={{ fontSize: 24, marginBottom: 16 }}>❄</div>
              <h3 style={{ marginBottom: 8 }}>Sneeuwscore</h3>
              <p style={{ fontSize: 14, color: "var(--ink2)" }}>
                Transparante sneeuwzekerheid op basis van 10 jaar data. Je hoogte, historische sneeuwval, en klimaat — nergens anders te vinden.
              </p>
            </div>
            <div>
              <div style={{ fontSize: 24, marginBottom: 16 }}>🏔</div>
              <h3 style={{ marginBottom: 8 }}>Pisteverdeling</h3>
              <p style={{ fontSize: 14, color: "var(--ink2)" }}>
                Je pistes in kaart: % blauw/rood/zwart. Families zien groen, experts zoeken zwart — je bereikt beiden.
              </p>
            </div>
            <div>
              <div style={{ fontSize: 24, marginBottom: 16 }}>📊</div>
              <h3 style={{ marginBottom: 8 }}>Ranking Positie</h3>
              <p style={{ fontSize: 14, color: "var(--ink2)" }}>
                Waar rank je in je categorie? Top-10 resorts krijgen meer clicks en bookings.
              </p>
            </div>
            <div>
              <div style={{ fontSize: 24, marginBottom: 16 }}>💰</div>
              <h3 style={{ marginBottom: 8 }}>Prijs Inzicht</h3>
              <p style={{ fontSize: 14, color: "var(--ink2)" }}>
                Skiërs zien je dagkaartprijs VS andere resorts. Transparantie bouwt vertrouwen.
              </p>
            </div>
            <div>
              <div style={{ fontSize: 24, marginBottom: 16 }}>🔗</div>
              <h3 style={{ marginBottom: 8 }}>Direct Booking</h3>
              <p style={{ fontSize: 14, color: "var(--ink2)" }}>
                Skiërs kunnen rechtstreeks van PeakFlow naar jouw website of boekingssysteem klikken.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="section" style={{ background: "var(--snow)" }}>
        <div className="container">
          <div style={{ textAlign: "center", marginBottom: 48 }}>
            <h2>Resort Starter — €79 / maand</h2>
            <p style={{ fontSize: 16, color: "var(--ink2)", marginTop: 12 }}>
              Alles wat je nodig hebt om jouw profiel te beheren
            </p>
          </div>

          <div
            style={{
              background: "white",
              border: "2px solid var(--peak)",
              borderRadius: "var(--r-lg)",
              padding: 40,
              maxWidth: 600,
              marginLeft: "auto",
              marginRight: "auto",
            }}
          >
            <div style={{ marginBottom: 32 }}>
              <div style={{ fontSize: 32, fontWeight: 700, color: "var(--peak)", marginBottom: 8 }}>€79</div>
              <div style={{ fontSize: 14, color: "var(--ink3)" }}>per maand • €749/jaar (save 20%)</div>
            </div>

            <ul style={{ listStyleType: "none", padding: 0, marginBottom: 32 }}>
              <li style={{ padding: "12px 0", borderBottom: "1px solid var(--border)", display: "flex", alignItems: "center", gap: 12 }}>
                <span style={{ fontSize: 20 }}>✓</span>
                <span>Resort profiel editor (foto's, teksten, stats)</span>
              </li>
              <li style={{ padding: "12px 0", borderBottom: "1px solid var(--border)", display: "flex", alignItems: "center", gap: 12 }}>
                <span style={{ fontSize: 20 }}>✓</span>
                <span>Review management & response system</span>
              </li>
              <li style={{ padding: "12px 0", borderBottom: "1px solid var(--border)", display: "flex", alignItems: "center", gap: 12 }}>
                <span style={{ fontSize: 20 }}>✓</span>
                <span>Analytics dashboard: views, clicks, ranking</span>
              </li>
              <li style={{ padding: "12px 0", borderBottom: "1px solid var(--border)", display: "flex", alignItems: "center", gap: 12 }}>
                <span style={{ fontSize: 20 }}>✓</span>
                <span>"PeakFlow Partner" badge op je profiel</span>
              </li>
              <li style={{ padding: "12px 0", display: "flex", alignItems: "center", gap: 12 }}>
                <span style={{ fontSize: 20 }}>✓</span>
                <span>Email support & onboarding call</span>
              </li>
            </ul>

            <button className="btn btn-primary btn-lg" style={{ width: "100%", justifyContent: "center", fontSize: 16 }}>
              Start je gratis demo
            </button>

            <div style={{ fontSize: 12, color: "var(--ink3)", textAlign: "center", marginTop: 16 }}>
              Geen creditcard nodig. Eerste maand gratis.
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container" style={{ maxWidth: 800 }}>
          <div style={{ textAlign: "center", marginBottom: 48 }}>
            <h2>Wat resorts zeggen</h2>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 32, marginBottom: 60 }} className="responsive-grid">
            <div style={{ background: "white", border: "1px solid var(--border)", borderRadius: "var(--r-lg)", padding: 24 }}>
              <div style={{ marginBottom: 16 }}>
                <div style={{ fontSize: 14, color: "var(--peak)", marginBottom: 8, fontWeight: 600 }}>⭐⭐⭐⭐⭐</div>
                <p style={{ fontSize: 14, color: "var(--ink2)", lineHeight: 1.6 }}>
                  "We've gotten 40% more direct visitors since joining PeakFlow. The sneeuwscore feature was a game-changer for us."
                </p>
              </div>
              <div style={{ fontSize: 13, fontWeight: 600 }}>Saalbach-Hinterglemm</div>
              <div style={{ fontSize: 12, color: "var(--ink3)" }}>Marketing Manager</div>
            </div>

            <div style={{ background: "white", border: "1px solid var(--border)", borderRadius: "var(--r-lg)", padding: 24 }}>
              <div style={{ marginBottom: 16 }}>
                <div style={{ fontSize: 14, color: "var(--peak)", marginBottom: 8, fontWeight: 600 }}>⭐⭐⭐⭐⭐</div>
                <p style={{ fontSize: 14, color: "var(--ink2)", lineHeight: 1.6 }}>
                  "The analytics dashboard shows us exactly which keywords bring skiers. We've adjusted our marketing because of it."
                </p>
              </div>
              <div style={{ fontSize: 13, fontWeight: 600 }}>Verbier</div>
              <div style={{ fontSize: 12, color: "var(--ink3)" }}>Digital Director</div>
            </div>
          </div>
        </div>
      </section>

      <section className="section" style={{ background: "var(--peak)", color: "white" }}>
        <div className="container" style={{ textAlign: "center" }}>
          <h2 style={{ color: "white", marginBottom: 20 }}>Klaar om jouw reputatie te beheren?</h2>
          <p style={{ fontSize: 16, marginBottom: 32, color: "rgba(255,255,255,.85)" }}>
            Duizenden skiërs vergelijken jouw resort nu. Zorg dat je profiel perfect is.
          </p>
          <button className="btn btn-primary btn-lg" style={{ background: "white", color: "#1d9e75", fontSize: 16, fontWeight: 600 }}>
            Start je gratis demo
          </button>
          <div style={{ fontSize: 13, color: "rgba(255,255,255,.6)", marginTop: 16 }}>
            Vragen? Email ons: resorts@peakflow.io
          </div>
        </div>
      </section>
    </>
  );
}
