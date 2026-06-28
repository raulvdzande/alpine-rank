export const metadata = {
  title: "For Ski Resorts — PeakFlow",
  description: "PeakFlow Resort Starter: €79/month. Profile management, review analytics, ranking insights.",
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
              Manage your reputation on PeakFlow
            </h1>
            <p style={{ fontSize: 18, color: "rgba(255,255,255,.85)", marginBottom: 32, lineHeight: 1.7 }}>
              5,000+ skiers compare your resort on snow certainty, reviews and pistes. Make sure your profile is perfect.
            </p>
            <button className="btn btn-primary btn-lg" style={{ background: "white", color: "#1d9e75", fontSize: 16, fontWeight: 600 }}>
              Start free demo →
            </button>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div style={{ textAlign: "center", marginBottom: 60 }}>
            <span className="label">Why PeakFlow</span>
            <h2>What skiers see on your resort page</h2>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 32, marginBottom: 60 }} className="responsive-grid">
            <div>
              <div style={{ fontSize: 24, marginBottom: 16 }}>⭐</div>
              <h3 style={{ marginBottom: 8 }}>Reviews & Ratings</h3>
              <p style={{ fontSize: 14, color: "var(--ink2)" }}>
                Skiers rate your resort on 7 criteria: snow, terrain, lifts, après, family, value, scenery.
              </p>
            </div>
            <div>
              <div style={{ fontSize: 24, marginBottom: 16 }}>❄</div>
              <h3 style={{ marginBottom: 8 }}>Snow score</h3>
              <p style={{ fontSize: 14, color: "var(--ink2)" }}>
                Transparent snow certainty based on 10 years of data. Your altitude, historical snowfall and climate — unavailable anywhere else.
              </p>
            </div>
            <div>
              <div style={{ fontSize: 24, marginBottom: 16 }}>🏔</div>
              <h3 style={{ marginBottom: 8 }}>Piste distribution</h3>
              <p style={{ fontSize: 14, color: "var(--ink2)" }}>
                Your pistes mapped: % blue/red/black. Families see green, experts look for black — you reach both.
              </p>
            </div>
            <div>
              <div style={{ fontSize: 24, marginBottom: 16 }}>📊</div>
              <h3 style={{ marginBottom: 8 }}>Ranking position</h3>
              <p style={{ fontSize: 14, color: "var(--ink2)" }}>
                Where do you rank in your category? Top-10 resorts get more clicks and bookings.
              </p>
            </div>
            <div>
              <div style={{ fontSize: 24, marginBottom: 16 }}>💰</div>
              <h3 style={{ marginBottom: 8 }}>Price insights</h3>
              <p style={{ fontSize: 14, color: "var(--ink2)" }}>
                Skiers see your day pass price vs other resorts. Transparency builds trust.
              </p>
            </div>
            <div>
              <div style={{ fontSize: 24, marginBottom: 16 }}>🔗</div>
              <h3 style={{ marginBottom: 8 }}>Direct booking</h3>
              <p style={{ fontSize: 14, color: "var(--ink2)" }}>
                Skiers can click directly from PeakFlow to your website or booking system.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="section" style={{ background: "var(--snow)" }}>
        <div className="container">
          <div style={{ textAlign: "center", marginBottom: 48 }}>
            <h2>Resort Starter — €79 / month</h2>
            <p style={{ fontSize: 16, color: "var(--ink2)", marginTop: 12 }}>
              Everything you need to manage your profile
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
              <div style={{ fontSize: 14, color: "var(--ink3)" }}>per month • €749/year (save 20%)</div>
            </div>

            <ul style={{ listStyleType: "none", padding: 0, marginBottom: 32 }}>
              <li style={{ padding: "12px 0", borderBottom: "1px solid var(--border)", display: "flex", alignItems: "center", gap: 12 }}>
                <span style={{ fontSize: 20 }}>✓</span>
                <span>Resort profile editor (photos, text, stats)</span>
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
                <span>&ldquo;PeakFlow Partner&rdquo; badge on your profile</span>
              </li>
              <li style={{ padding: "12px 0", display: "flex", alignItems: "center", gap: 12 }}>
                <span style={{ fontSize: 20 }}>✓</span>
                <span>Email support & onboarding call</span>
              </li>
            </ul>

            <button className="btn btn-primary btn-lg" style={{ width: "100%", justifyContent: "center", fontSize: 16 }}>
              Start your free demo
            </button>

            <div style={{ fontSize: 12, color: "var(--ink3)", textAlign: "center", marginTop: 16 }}>
              No credit card needed. First month free.
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container" style={{ maxWidth: 800 }}>
          <div style={{ textAlign: "center", marginBottom: 48 }}>
            <h2>What resorts say</h2>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 32, marginBottom: 60 }} className="responsive-grid">
            <div style={{ background: "white", border: "1px solid var(--border)", borderRadius: "var(--r-lg)", padding: 24 }}>
              <div style={{ marginBottom: 16 }}>
                <div style={{ fontSize: 14, color: "var(--peak)", marginBottom: 8, fontWeight: 600 }}>⭐⭐⭐⭐⭐</div>
                <p style={{ fontSize: 14, color: "var(--ink2)", lineHeight: 1.6 }}>
                  &ldquo;We&apos;ve gotten 40% more direct visitors since joining PeakFlow. The snow score feature was a game-changer for us.&rdquo;
                </p>
              </div>
              <div style={{ fontSize: 13, fontWeight: 600 }}>Saalbach-Hinterglemm</div>
              <div style={{ fontSize: 12, color: "var(--ink3)" }}>Marketing Manager</div>
            </div>

            <div style={{ background: "white", border: "1px solid var(--border)", borderRadius: "var(--r-lg)", padding: 24 }}>
              <div style={{ marginBottom: 16 }}>
                <div style={{ fontSize: 14, color: "var(--peak)", marginBottom: 8, fontWeight: 600 }}>⭐⭐⭐⭐⭐</div>
                <p style={{ fontSize: 14, color: "var(--ink2)", lineHeight: 1.6 }}>
                  &ldquo;The analytics dashboard shows us exactly which keywords bring skiers. We&apos;ve adjusted our marketing because of it.&rdquo;
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
          <h2 style={{ color: "white", marginBottom: 20 }}>Ready to manage your reputation?</h2>
          <p style={{ fontSize: 16, marginBottom: 32, color: "rgba(255,255,255,.85)" }}>
            Thousands of skiers are comparing your resort right now. Make sure your profile is perfect.
          </p>
          <button className="btn btn-primary btn-lg" style={{ background: "white", color: "#1d9e75", fontSize: 16, fontWeight: 600 }}>
            Start your free demo
          </button>
          <div style={{ fontSize: 13, color: "rgba(255,255,255,.6)", marginTop: 16 }}>
            Questions? Email us: resorts@peakflow.io
          </div>
        </div>
      </section>

      <style>{`
        @media (max-width: 768px) {
          .responsive-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </>
  );
}
