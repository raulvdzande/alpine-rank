export const metadata = {
  title: "Sneeuwzekerheid Score — PeakFlow",
  description: "Hoe PeakFlow sneeuwzekerheid berekent met algoritmes en 10 jaar Open-Meteo data",
};

export default function SnowScorePage() {
  return (
    <section className="section">
      <div className="container" style={{ maxWidth: 800 }}>
        <span className="label">Algoritme</span>
        <h1 style={{ marginBottom: 32 }}>Sneeuwzekerheid Score</h1>

        <div style={{ fontSize: 16, color: "var(--ink2)", lineHeight: 1.8 }}>
          <p style={{ marginBottom: 32, fontSize: 18 }}>
            PeakFlow rangschikt skigebieden op sneeuwzekerheid met behulp van echte data, niet marketing-taal.
          </p>

          <h2 style={{ fontSize: 22, fontWeight: 700, marginTop: 40, marginBottom: 16 }}>Hoe We Het Berekenen</h2>

          <p style={{ marginBottom: 20 }}>
            De PeakFlow sneeuwzekerheid score is een getal van 1-10 gebaseerd op drie factoren:
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
                50% — Hoogte
              </div>
              <p style={{ color: "var(--peak-dark)" }}>
                Resorts op hogere hoogte hebben meer sneeuw. We beoordelen de basistatie (zwakste punt) en toppiste (best geval).
              </p>
              <div style={{ fontSize: 13, marginTop: 12, background: "rgba(255,255,255,.5)", padding: "10px 12px", borderRadius: "6px" }}>
                Basisstation ≥2200m: 10/10 · 1500-1700m: 7.5/10 · &lt;800m: 2.8/10
              </div>
            </div>

            <div style={{ marginBottom: 20 }}>
              <div style={{ fontSize: 18, fontWeight: 700, color: "var(--peak-dark)", marginBottom: 8 }}>
                30% — Historische Data
              </div>
              <p style={{ color: "var(--peak-dark)" }}>
                Open-Meteo APIs geven ons 10 jaar dagelijkse sneeuwval en -diepte (2014-2024). We berekenen gemiddelde wintersneeuwval, betrouwbaarheid, en maximale diepte.
              </p>
            </div>

            <div>
              <div style={{ fontSize: 18, fontWeight: 700, color: "var(--peak-dark)", marginBottom: 8 }}>
                20% — Geografisch Klimaat
              </div>
              <p style={{ color: "var(--peak-dark)" }}>
                Breedtegraad bepaalt kou en seizoenlengte. Scandinavië (63°N) krijgt hogere score dan Pyreneeën (43°N).
              </p>
            </div>
          </div>

          <h2 style={{ fontSize: 22, fontWeight: 700, marginTop: 40, marginBottom: 16 }}>Voorbeelden</h2>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 32 }}>
            <div style={{ background: "white", border: "1px solid var(--border)", borderRadius: "var(--r-lg)", padding: 20 }}>
              <div style={{ fontSize: 20, fontWeight: 700, marginBottom: 8 }}>Zermatt 🇨🇭</div>
              <div style={{ fontSize: 14, color: "var(--ink3)", marginBottom: 12 }}>Basis 1600m · Top 4478m</div>
              <div style={{ fontSize: 28, fontWeight: 700, color: "var(--peak)", marginBottom: 12 }}>9.5 / 10</div>
              <p style={{ fontSize: 13, color: "var(--ink2)" }}>
                Uitzonderlijk hoog, uitstekende historische gegevens, Scandinavisch breedtegraad-effect
              </p>
            </div>

            <div style={{ background: "white", border: "1px solid var(--border)", borderRadius: "var(--r-lg)", padding: 20 }}>
              <div style={{ fontSize: 20, fontWeight: 700, marginBottom: 8 }}>Chamonix 🇫🇷</div>
              <div style={{ fontSize: 14, color: "var(--ink3)", marginBottom: 12 }}>Basis 1035m · Top 3842m</div>
              <div style={{ fontSize: 28, fontWeight: 700, color: "var(--peak)", marginBottom: 12 }}>8.2 / 10</div>
              <p style={{ fontSize: 13, color: "var(--ink2)" }}>
                Hoog bereik, betere sneeuwgegevens, maar lager basisstation
              </p>
            </div>

            <div style={{ background: "white", border: "1px solid var(--border)", borderRadius: "var(--r-lg)", padding: 20 }}>
              <div style={{ fontSize: 20, fontWeight: 700, marginBottom: 8 }}>Levi 🇫🇮</div>
              <div style={{ fontSize: 14, color: "var(--ink3)", marginBottom: 12 }}>Basis 200m · Top 532m</div>
              <div style={{ fontSize: 28, fontWeight: 700, color: "var(--peak)", marginBottom: 12 }}>7.8 / 10</div>
              <p style={{ fontSize: 13, color: "var(--ink2)" }}>
                Laag, maar extreem noordelijk (67°N) kompenseert met lange winterseizoen
              </p>
            </div>

            <div style={{ background: "white", border: "1px solid var(--border)", borderRadius: "var(--r-lg)", padding: 20 }}>
              <div style={{ fontSize: 20, fontWeight: 700, marginBottom: 8 }}>La Plagne 🇫🇷</div>
              <div style={{ fontSize: 14, color: "var(--ink3)", marginBottom: 12 }}>Basis 1970m · Top 3002m</div>
              <div style={{ fontSize: 28, fontWeight: 700, color: "var(--peak)", marginBottom: 12 }}>8.7 / 10</div>
              <p style={{ fontSize: 13, color: "var(--ink2)" }}>
                Hoge basis, uitstekende historische data, zeer betrouwbaar
              </p>
            </div>
          </div>

          <h2 style={{ fontSize: 22, fontWeight: 700, marginTop: 40, marginBottom: 16 }}>Waarom dit belangrijk is</h2>

          <p style={{ marginBottom: 16 }}>
            Andere ski websites zeggen &ldquo;sneeuwzekerheid&rdquo; zonder dit te meten. PeakFlow:
          </p>

          <ul style={{ marginLeft: 20, marginBottom: 32, listStyleType: "disc", color: "var(--ink2)" }}>
            <li>Gebruikt 10 jaar echte sneeuwgegevens (niet haalucilaties)</li>
            <li>Verantwoordt hoogte, klimaat, en geschiedenis</li>
            <li>Publiceert de algoritme (geen blackbox)</li>
            <li>Werkt samen met Open-Meteo voor transparantie</li>
          </ul>

          <div style={{ background: "var(--blue-light)", borderRadius: "var(--r-lg)", padding: 24, borderLeft: "4px solid var(--blue)" }}>
            <div style={{ fontWeight: 700, color: "var(--blue-dark)", marginBottom: 8 }}>📊 Open Data</div>
            <p style={{ color: "var(--blue-dark)" }}>
              Alle PeakFlow scores zijn open en verifieerbaar. Als u het niet eens bent met onze berekening, kunt u het reproduceren.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
