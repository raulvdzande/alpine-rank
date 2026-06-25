export default function CompanySuccessPage() {
  return (
    <section style={{ padding: "60px 20px", textAlign: "center" }}>
      <div style={{ maxWidth: 600, margin: "0 auto" }}>
        <div style={{ fontSize: 64, marginBottom: 24 }}>✅</div>

        <h1 style={{ fontSize: 32, fontWeight: 800, marginBottom: 12, color: "var(--peak)" }}>
          Betaling ontvangen!
        </h1>

        <p style={{ fontSize: 16, color: "var(--ink2)", marginBottom: 32, lineHeight: 1.6 }}>
          Bedankt! Je bedrijfsaccount is nu actief. Je ontvangt zo meteen een email met je login gegevens en wachtwoord.
        </p>

        <div style={{ background: "var(--snow)", borderRadius: 12, padding: 24, marginBottom: 32 }}>
          <h3 style={{ marginBottom: 16 }}>Volgende stappen:</h3>
          <ol style={{ textAlign: "left", display: "inline-block", lineHeight: 2 }}>
            <li>Check je email voor login gegevens</li>
            <li>Log in met je manager account</li>
            <li>Verander je wachtwoord</li>
            <li>Voeg teamleden toe (optioneel)</li>
            <li>Vul je bedrijfsprofiel aan</li>
          </ol>
        </div>

        <a
          href="/company/login"
          style={{
            display: "inline-block",
            background: "var(--peak)",
            color: "white",
            padding: "14px 32px",
            borderRadius: 8,
            textDecoration: "none",
            fontWeight: 600,
            fontSize: 16,
          }}
        >
          Ga naar je dashboard →
        </a>

        <p style={{ marginTop: 24, color: "var(--ink3)", fontSize: 13 }}>
          Vragen? Contact ons op support@peakflow.io
        </p>
      </div>
    </section>
  );
}
