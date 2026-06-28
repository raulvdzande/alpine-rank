export const metadata = {
  title: "Snow Certainty Score — PeakFlow",
  description: "How PeakFlow calculates snow certainty with algorithms and 10 years of Open-Meteo data",
};

export default function SnowScorePage() {
  return (
    <section className="section">
      <div className="container" style={{ maxWidth: 800 }}>
        <span className="label">Algorithm</span>
        <h1 style={{ marginBottom: 32 }}>Snow Certainty Score</h1>

        <div style={{ fontSize: 16, color: "var(--ink2)", lineHeight: 1.8 }}>
          <p style={{ marginBottom: 32, fontSize: 18 }}>
            PeakFlow ranks ski resorts on snow certainty using real data, not marketing language.
          </p>

          <h2 style={{ fontSize: 22, fontWeight: 700, marginTop: 40, marginBottom: 16 }}>How We Calculate It</h2>

          <p style={{ marginBottom: 20 }}>
            The PeakFlow snow certainty score is a number from 1–10 based on three factors:
          </p>

          <div style={{
            background: "var(--peak-light)",
            borderRadius: "var(--r-lg)",
            padding: 24,
            marginBottom: 24,
            borderLeft: "4px solid var(--peak)",
          }}>
            <div style={{ marginBottom: 20 }}>
              <div style={{ fontSize: 18, fontWeight: 700, color: "var(--peak-dark)", marginBottom: 8 }}>
                50% — Altitude
              </div>
              <p style={{ color: "var(--peak-dark)" }}>
                Resorts at higher altitudes have more snow. We assess the base station (weakest point) and top piste (best case).
              </p>
              <div style={{ fontSize: 13, marginTop: 12, background: "rgba(255,255,255,.5)", padding: "10px 12px", borderRadius: "6px" }}>
                Base ≥2200m: 10/10 · 1500–1700m: 7.5/10 · &lt;800m: 2.8/10
              </div>
            </div>

            <div style={{ marginBottom: 20 }}>
              <div style={{ fontSize: 18, fontWeight: 700, color: "var(--peak-dark)", marginBottom: 8 }}>
                30% — Historical data
              </div>
              <p style={{ color: "var(--peak-dark)" }}>
                Open-Meteo APIs give us 10 years of daily snowfall and snow depth (2014–2024). We calculate average winter snowfall, reliability, and maximum depth.
              </p>
            </div>

            <div>
              <div style={{ fontSize: 18, fontWeight: 700, color: "var(--peak-dark)", marginBottom: 8 }}>
                20% — Geographic climate
              </div>
              <p style={{ color: "var(--peak-dark)" }}>
                Latitude determines cold and season length. Scandinavia (63°N) scores higher than the Pyrenees (43°N).
              </p>
            </div>
          </div>

          <h2 style={{ fontSize: 22, fontWeight: 700, marginTop: 40, marginBottom: 16 }}>Examples</h2>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 32 }}>
            <div style={{ background: "white", border: "1px solid var(--border)", borderRadius: "var(--r-lg)", padding: 20 }}>
              <div style={{ fontSize: 20, fontWeight: 700, marginBottom: 8 }}>Zermatt 🇨🇭</div>
              <div style={{ fontSize: 14, color: "var(--ink3)", marginBottom: 12 }}>Base 1600m · Top 4478m</div>
              <div style={{ fontSize: 28, fontWeight: 700, color: "var(--peak)", marginBottom: 12 }}>9.5 / 10</div>
              <p style={{ fontSize: 13, color: "var(--ink2)" }}>
                Exceptionally high altitude, excellent historical data, Scandinavian latitude effect
              </p>
            </div>

            <div style={{ background: "white", border: "1px solid var(--border)", borderRadius: "var(--r-lg)", padding: 20 }}>
              <div style={{ fontSize: 20, fontWeight: 700, marginBottom: 8 }}>Chamonix 🇫🇷</div>
              <div style={{ fontSize: 14, color: "var(--ink3)", marginBottom: 12 }}>Base 1035m · Top 3842m</div>
              <div style={{ fontSize: 28, fontWeight: 700, color: "var(--peak)", marginBottom: 12 }}>8.2 / 10</div>
              <p style={{ fontSize: 13, color: "var(--ink2)" }}>
                High range, good snow data, but lower base station
              </p>
            </div>

            <div style={{ background: "white", border: "1px solid var(--border)", borderRadius: "var(--r-lg)", padding: 20 }}>
              <div style={{ fontSize: 20, fontWeight: 700, marginBottom: 8 }}>Levi 🇫🇮</div>
              <div style={{ fontSize: 14, color: "var(--ink3)", marginBottom: 12 }}>Base 200m · Top 532m</div>
              <div style={{ fontSize: 28, fontWeight: 700, color: "var(--peak)", marginBottom: 12 }}>7.8 / 10</div>
              <p style={{ fontSize: 13, color: "var(--ink2)" }}>
                Low altitude, but extremely northern (67°N) compensates with long winter season
              </p>
            </div>

            <div style={{ background: "white", border: "1px solid var(--border)", borderRadius: "var(--r-lg)", padding: 20 }}>
              <div style={{ fontSize: 20, fontWeight: 700, marginBottom: 8 }}>La Plagne 🇫🇷</div>
              <div style={{ fontSize: 14, color: "var(--ink3)", marginBottom: 12 }}>Base 1970m · Top 3002m</div>
              <div style={{ fontSize: 28, fontWeight: 700, color: "var(--peak)", marginBottom: 12 }}>8.7 / 10</div>
              <p style={{ fontSize: 13, color: "var(--ink2)" }}>
                High base, excellent historical data, very reliable
              </p>
            </div>
          </div>

          <h2 style={{ fontSize: 22, fontWeight: 700, marginTop: 40, marginBottom: 16 }}>Why this matters</h2>

          <p style={{ marginBottom: 16 }}>
            Other ski websites mention &ldquo;snow certainty&rdquo; without measuring it. PeakFlow:
          </p>

          <ul style={{ marginLeft: 20, marginBottom: 32, listStyleType: "disc", color: "var(--ink2)" }}>
            <li>Uses 10 years of real snow data (not estimates)</li>
            <li>Accounts for altitude, climate and history</li>
            <li>Publishes the algorithm (no black box)</li>
            <li>Works with Open-Meteo for transparency</li>
          </ul>

          <div style={{ background: "var(--blue-light)", borderRadius: "var(--r-lg)", padding: 24, borderLeft: "4px solid var(--blue)" }}>
            <div style={{ fontWeight: 700, color: "var(--blue-dark)", marginBottom: 8 }}>📊 Open Data</div>
            <p style={{ color: "var(--blue-dark)" }}>
              All PeakFlow scores are open and verifiable. If you disagree with our calculation, you can reproduce it.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
