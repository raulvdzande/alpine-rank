interface WelcomeEmailProps {
  name: string;
  email: string;
}

export function WelcomeEmail({ name, email }: WelcomeEmailProps) {
  return (
    <div style={{ fontFamily: "sans-serif", maxWidth: "600px", margin: "0 auto" }}>
      <div style={{ background: "linear-gradient(135deg, #1d9e75 0%, #1a5fb4 100%)", color: "white", padding: "40px 20px", textAlign: "center" }}>
        <div style={{ fontSize: 32, marginBottom: 12 }}>⛰</div>
        <h1 style={{ fontSize: 28, fontWeight: 700, margin: "0 0 8px 0" }}>Welkom bij PeakFlow</h1>
        <p style={{ fontSize: 16, margin: 0, opacity: 0.9 }}>De meest betrouwbare ski rankings van Europa</p>
      </div>

      <div style={{ padding: "40px 20px" }}>
        <p style={{ fontSize: 16, marginBottom: 20 }}>Hallo {name},</p>

        <p style={{ fontSize: 15, color: "#4a4a42", lineHeight: 1.6, marginBottom: 24 }}>
          Welkom! Je account is aangemaakt en klaar om te gebruiken. Je kunt nu:
        </p>

        <ul style={{ fontSize: 15, color: "#4a4a42", lineHeight: 1.8, marginBottom: 24 }}>
          <li>✓ 50+ Europese skigebieden verkennen</li>
          <li>✓ Resorts beoordelen op 7 categorieën</li>
          <li>✓ Je favoriete resorts opslaan in je wishlist</li>
          <li>✓ Resorts vergelijken naast elkaar</li>
          <li>✓ Onze AI Resort Matcher gebruiken</li>
        </ul>

        <p style={{ fontSize: 15, color: "#4a4a42", lineHeight: 1.6, marginBottom: 24 }}>
          Upgrade naar Explorer om al deze functies te ontgrendelen voor slechts <strong>€4,99/maand</strong> of <strong>€39/jaar</strong>.
        </p>

        <div style={{ marginBottom: 24 }}>
          <a href={`${process.env.NEXT_PUBLIC_APP_URL || "https://peakflow.io"}/pricing`} style={{
            display: "inline-block",
            background: "#1d9e75",
            color: "white",
            padding: "12px 28px",
            borderRadius: "8px",
            textDecoration: "none",
            fontWeight: 600,
            fontSize: 14,
          }}>
            Upgrade naar Explorer
          </a>
        </div>

        <p style={{ fontSize: 14, color: "#9a9a8e", marginBottom: 32 }}>
          Veel plezier en gelukkig skiën! 🎿
        </p>

        <div style={{ borderTop: "1px solid #e8e7e0", paddingTop: 24 }}>
          <p style={{ fontSize: 12, color: "#9a9a8e", margin: 0 }}>
            PeakFlow · De rankings die skiërs vertrouwen<br />
            {process.env.NEXT_PUBLIC_APP_URL || "https://peakflow.io"}
          </p>
        </div>
      </div>
    </div>
  );
}
