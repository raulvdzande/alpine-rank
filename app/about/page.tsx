export const metadata = {
  title: "About PeakFlow — Ski Rankings & Resort Data",
  description: "PeakFlow: data-driven ski rankings made by skiers, for skiers",
};

export default function AboutPage() {
  return (
    <section className="section">
      <div className="container">
        <div style={{ maxWidth: 700, marginBottom: 60 }}>
          <span className="label">About us</span>
          <h1 style={{ marginBottom: 20 }}>PeakFlow</h1>
          <p style={{ fontSize: 18, color: "var(--ink2)", lineHeight: 1.8 }}>
            We build the most reliable ski resort rankings in Europe. Data-driven, made by skiers, for skiers.
          </p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 40, marginBottom: 60 }} className="responsive-grid">
          <div>
            <h2 style={{ fontSize: 20, marginBottom: 12 }}>Our Mission</h2>
            <p style={{ color: "var(--ink2)", lineHeight: 1.75 }}>
              Skiers deserve transparent, honest data to find their perfect resort. No marketing fluff. No half-truths. Only real knowledge from real skiers.
            </p>
          </div>
          <div>
            <h2 style={{ fontSize: 20, marginBottom: 12 }}>Our Values</h2>
            <ul style={{ color: "var(--ink2)", lineHeight: 1.75, paddingLeft: 20, listStyleType: "disc" }}>
              <li><strong>Transparent:</strong> All data and algorithms are public</li>
              <li><strong>Verified:</strong> Reviews from real skiers</li>
              <li><strong>Neutral:</strong> No paid placements</li>
            </ul>
          </div>
        </div>

        <div style={{ background: "white", border: "1px solid var(--border)", borderRadius: "var(--r-lg)", padding: 40, marginBottom: 60 }}>
          <h2 style={{ fontSize: 20, marginBottom: 24 }}>Our Algorithm</h2>
          <p style={{ color: "var(--ink2)", marginBottom: 20 }}>
            PeakFlow ranks resorts based on four factors:
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
            <div>
              <div style={{ fontSize: 16, fontWeight: 700, marginBottom: 8 }}>❄ Snow certainty (50%)</div>
              <p style={{ fontSize: 14, color: "var(--ink3)" }}>
                Altitude, 10 years of historical snow data, and latitude
              </p>
            </div>
            <div>
              <div style={{ fontSize: 16, fontWeight: 700, marginBottom: 8 }}>⭐ Ratings</div>
              <p style={{ fontSize: 14, color: "var(--ink3)" }}>
                Average rating from real skiers across 7 categories
              </p>
            </div>
            <div>
              <div style={{ fontSize: 16, fontWeight: 700, marginBottom: 8 }}>🏔 Geography (30%)</div>
              <p style={{ fontSize: 14, color: "var(--ink3)" }}>
                Location, altitude, piste distribution and terrain variety
              </p>
            </div>
            <div>
              <div style={{ fontSize: 16, fontWeight: 700, marginBottom: 8 }}>💰 Value</div>
              <p style={{ fontSize: 14, color: "var(--ink3)" }}>
                Day pass price versus piste km and snow certainty
              </p>
            </div>
          </div>
        </div>

        <div style={{ background: "var(--peak-light)", borderRadius: "var(--r-lg)", padding: 40, marginBottom: 60 }}>
          <h2 style={{ fontSize: 20, marginBottom: 20, color: "var(--peak-dark)" }}>Snowflakes Award</h2>
          <p style={{ color: "var(--peak-dark)", marginBottom: 16 }}>
            The PeakFlow Snowflake Award is our limited distinction for exceptional ski resorts. Resorts are personally inspected for snow certainty, service, and unique experience.
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16 }}>
            <div>
              <div style={{ fontSize: 24, marginBottom: 8 }}>❄</div>
              <div style={{ fontWeight: 600, marginBottom: 4 }}>1 Snowflake</div>
              <p style={{ fontSize: 13 }}>Excellent snow certainty</p>
            </div>
            <div>
              <div style={{ fontSize: 24, marginBottom: 8 }}>❄❄</div>
              <div style={{ fontWeight: 600, marginBottom: 4 }}>2 Snowflakes</div>
              <p style={{ fontSize: 13 }}>Exceptional experience</p>
            </div>
            <div>
              <div style={{ fontSize: 24, marginBottom: 8 }}>❄❄❄</div>
              <div style={{ fontWeight: 600, marginBottom: 4 }}>3 Snowflakes</div>
              <p style={{ fontSize: 13 }}>Mythical status</p>
            </div>
          </div>
        </div>

        <div style={{ textAlign: "center" }}>
          <h2 style={{ marginBottom: 24 }}>Ready to get started?</h2>
          <p style={{ color: "var(--ink2)", marginBottom: 32 }}>
            Discover 50+ European ski resorts ranked by PeakFlow
          </p>
          <a href="/resorts" className="btn btn-primary btn-lg">Go to resorts →</a>
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .responsive-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  );
}
