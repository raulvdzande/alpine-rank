export const metadata = {
  title: "Over PeakFlow — Ski Rankings & Resort Data",
  description: "PeakFlow: data-gedreven ski rankings gemaakt door skiërs, voor skiërs",
};

export default function AboutPage() {
  return (
    <section className="section">
      <div className="container">
        <div style={{ maxWidth: 700, marginBottom: 60 }}>
          <span className="label">Over ons</span>
          <h1 style={{ marginBottom: 20 }}>PeakFlow</h1>
          <p style={{ fontSize: 18, color: "var(--ink2)", lineHeight: 1.8 }}>
            Wij bouwen de meest betrouwbare ski resort rankings van Europa. Data-gedreven, door skiërs gemaakt, voor skiërs.
          </p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 40, marginBottom: 60 }} className="responsive-grid">
          <div>
            <h2 style={{ fontSize: 20, marginBottom: 12 }}>Onze Missie</h2>
            <p style={{ color: "var(--ink2)", lineHeight: 1.75 }}>
              Skiërs verdienen transparante, honest data om hun perfecte resort te vinden. Geen marketing-gebabbel. Geen onwaarheden. Alleen echte kennis van echte skiërs.
            </p>
          </div>
          <div>
            <h2 style={{ fontSize: 20, marginBottom: 12 }}>Onze Waarden</h2>
            <ul style={{ color: "var(--ink2)", lineHeight: 1.75, paddingLeft: 20, listStyleType: "disc" }}>
              <li><strong>Transparant:</strong> Alle data en algoritmes zijn openbaar</li>
              <li><strong>Geverifieerd:</strong> Reviews van echte skiërs</li>
              <li><strong>Neutraal:</strong> Geen betaalde plaatsingen</li>
            </ul>
          </div>
        </div>

        <div style={{ background: "white", border: "1px solid var(--border)", borderRadius: "var(--r-lg)", padding: 40, marginBottom: 60 }}>
          <h2 style={{ fontSize: 20, marginBottom: 24 }}>Ons Algoritme</h2>
          <p style={{ color: "var(--ink2)", marginBottom: 20 }}>
            PeakFlow rangschikt resorts op basis van vier factoren:
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
            <div>
              <div style={{ fontSize: 16, fontWeight: 700, marginBottom: 8 }}>❄ Sneeuwzekerheid (50%)</div>
              <p style={{ fontSize: 14, color: "var(--ink3)" }}>
                Hoogte, historische sneeuwdata van 10 jaar, en breedtegraad
              </p>
            </div>
            <div>
              <div style={{ fontSize: 16, fontWeight: 700, marginBottom: 8 }}>⭐ Beoordelingen</div>
              <p style={{ fontSize: 14, color: "var(--ink3)" }}>
                Gemiddelde rating van echte skiërs op 7 categorieën
              </p>
            </div>
            <div>
              <div style={{ fontSize: 16, fontWeight: 700, marginBottom: 8 }}>🏔 Geografie (30%)</div>
              <p style={{ fontSize: 14, color: "var(--ink3)" }}>
                Ligging, hoogte, pisteverdeling en terreinvariatie
              </p>
            </div>
            <div>
              <div style={{ fontSize: 16, fontWeight: 700, marginBottom: 8 }}>💰 Waarde</div>
              <p style={{ fontSize: 14, color: "var(--ink3)" }}>
                Dagkaartprijs versus pistekm en sneeuwzekerheid
              </p>
            </div>
          </div>
        </div>

        <div style={{ background: "var(--peak-light)", borderRadius: "var(--r-lg)", padding: 40, marginBottom: 60 }}>
          <h2 style={{ fontSize: 20, marginBottom: 20, color: "var(--peak-dark)" }}>Snowflakes Award</h2>
          <p style={{ color: "var(--peak-dark)", marginBottom: 16 }}>
            De PeakFlow Snowflake Award is onze beperkte onderscheiding voor uitzonderlijke skigebieden. Resorts worden persoonlijk geïnspecteerd op sneeuwzekerheid, service, en unieke ervaring.
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16 }}>
            <div>
              <div style={{ fontSize: 24, marginBottom: 8 }}>❄</div>
              <div style={{ fontWeight: 600, marginBottom: 4 }}>1 Snowflake</div>
              <p style={{ fontSize: 13 }}>Uitstekende sneeuwzekerheid</p>
            </div>
            <div>
              <div style={{ fontSize: 24, marginBottom: 8 }}>❄❄</div>
              <div style={{ fontWeight: 600, marginBottom: 4 }}>2 Snowflakes</div>
              <p style={{ fontSize: 13 }}>Uitzonderlijke ervaring</p>
            </div>
            <div>
              <div style={{ fontSize: 24, marginBottom: 8 }}>❄❄❄</div>
              <div style={{ fontWeight: 600, marginBottom: 4 }}>3 Snowflakes</div>
              <p style={{ fontSize: 13 }}>Mythische status</p>
            </div>
          </div>
        </div>

        <div style={{ textAlign: "center" }}>
          <h2 style={{ marginBottom: 24 }}>Klaar om te beginnen?</h2>
          <p style={{ color: "var(--ink2)", marginBottom: 32 }}>
            Ontdek 50+ Europese skigebieden gerankt door PeakFlow
          </p>
          <a href="/resorts" className="btn btn-primary btn-lg">Ga naar resorts →</a>
        </div>
      </div>
    </section>
  );
}
