export const metadata = {
  title: "Privacybeleid — PeakFlow",
  description: "PeakFlow privacybeleid en gegevensbescherming",
};

export default function PrivacyPage() {
  return (
    <section className="section">
      <div className="container" style={{ maxWidth: 800 }}>
        <h1 style={{ marginBottom: 32 }}>Privacybeleid</h1>

        <div style={{ fontSize: 15, color: "var(--ink2)", lineHeight: 1.8 }}>
          <p style={{ marginBottom: 24 }}>
            <strong>Effectief vanaf:</strong> 25 juni 2026
          </p>

          <h2 style={{ fontSize: 20, fontWeight: 700, marginTop: 32, marginBottom: 12 }}>1. Introductie</h2>
          <p style={{ marginBottom: 24 }}>
            PeakFlow (&ldquo;Wij&rdquo;, &ldquo;ons&rdquo;, of &ldquo;Bedrijf&rdquo;) verplicht zich uw persoonlijke gegevens te beschermen. Dit privacybeleid beschrijft hoe we uw informatie verzamelen, gebruiken, en beveiligen.
          </p>

          <h2 style={{ fontSize: 20, fontWeight: 700, marginTop: 32, marginBottom: 12 }}>2. Welke gegevens verzamelen we</h2>
          <p style={{ marginBottom: 12 }}>We verzamelen gegevens die u ons rechtstreeks verstrekt:</p>
          <ul style={{ marginLeft: 20, marginBottom: 24, listStyleType: "disc" }}>
            <li>Registratiegegevens: naam, e-mailadres, wachtwoord</li>
            <li>Profielgegevens: ski-niveau, land, voorkeuren</li>
            <li>Beoordelingsgegevens: uw reviews en ratings van skigebieden</li>
            <li>Betalingsgegevens: via Stripe (we slaan geen creditcardgegevens op)</li>
          </ul>

          <h2 style={{ fontSize: 20, fontWeight: 700, marginTop: 32, marginBottom: 12 }}>3. Hoe gebruiken we uw gegevens</h2>
          <ul style={{ marginLeft: 20, marginBottom: 24, listStyleType: "disc" }}>
            <li>Uw account beheren en u diensten verlenen</li>
            <li>U te contacteren over uw account of service</li>
            <li>Uw reviews en beoordelingen op de site te publiceren</li>
            <li>Onze service te verbeteren en analyseren</li>
            <li>Wet- en regelgeving na te leven</li>
          </ul>

          <h2 style={{ fontSize: 20, fontWeight: 700, marginTop: 32, marginBottom: 12 }}>4. Gegevensveiligheid</h2>
          <p style={{ marginBottom: 24 }}>
            We implementeren veiligheidsindustrie standaarden, inclusief HTTPS-encryptie en beveiligde databases. Uw wachtwoord wordt met bcrypt gehasht en nooit in tekst opgeslagen.
          </p>

          <h2 style={{ fontSize: 20, fontWeight: 700, marginTop: 32, marginBottom: 12 }}>5. Wettelijke grondslag</h2>
          <p style={{ marginBottom: 24 }}>
            We verwerken uw gegevens onder:
          </p>
          <ul style={{ marginLeft: 20, marginBottom: 24, listStyleType: "disc" }}>
            <li>Contractuitvoering (uw account en betalingen)</li>
            <li>Rechtmatige bedrijfsbelangen (service verbetering)</li>
            <li>Uw toestemming (marketing e-mails)</li>
          </ul>

          <h2 style={{ fontSize: 20, fontWeight: 700, marginTop: 32, marginBottom: 12 }}>6. Cookies</h2>
          <p style={{ marginBottom: 24 }}>
            We gebruiken cookies voor sessiemanagement (uw inlogstatus) en analytics (met uw toestemming). U kunt cookies weigeren, maar dit beperkt bepaalde functionaliteit.
          </p>

          <h2 style={{ fontSize: 20, fontWeight: 700, marginTop: 32, marginBottom: 12 }}>7. Uw rechten</h2>
          <p style={{ marginBottom: 24 }}>
            Onder GDPR hebt u het recht op:
          </p>
          <ul style={{ marginLeft: 20, marginBottom: 24, listStyleType: "disc" }}>
            <li><strong>Toegang:</strong> uw persoonlijke gegevens inzien</li>
            <li><strong>Correctie:</strong> onjuiste gegevens corrigeren</li>
            <li><strong>Verwijdering:</strong> &ldquo;het recht om vergeten te worden&rdquo;</li>
            <li><strong>Portabiliteit:</strong> uw gegevens downloadbaar maken</li>
            <li><strong>Bezwaar:</strong> tegen bepaalde verwerkingen</li>
          </ul>
          <p style={{ marginBottom: 24 }}>
            Neem contact op met privacy@peakflow.io om deze rechten in te roepen.
          </p>

          <h2 style={{ fontSize: 20, fontWeight: 700, marginTop: 32, marginBottom: 12 }}>8. Derde partijen</h2>
          <p style={{ marginBottom: 24 }}>
            We delen uw gegevens niet met derde partijen, behalve:
          </p>
          <ul style={{ marginLeft: 20, marginBottom: 24, listStyleType: "disc" }}>
            <li><strong>Stripe:</strong> voor betalingsverwerking</li>
            <li><strong>Analytics:</strong> geanonimiseerde data</li>
          </ul>

          <h2 style={{ fontSize: 20, fontWeight: 700, marginTop: 32, marginBottom: 12 }}>9. Wijzigingen</h2>
          <p style={{ marginBottom: 24 }}>
            We kunnen dit beleid wijzigen. Wijzigingen zijn effectief wanneer op deze pagina gepubliceerd.
          </p>

          <h2 style={{ fontSize: 20, fontWeight: 700, marginTop: 32, marginBottom: 12 }}>10. Contact</h2>
          <p>
            Vragen over privacybeleid? <br />
            E-mail: privacy@peakflow.io
          </p>
        </div>
      </div>
    </section>
  );
}
