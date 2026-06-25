export const metadata = {
  title: "Gebruiksvoorwaarden — PeakFlow",
  description: "PeakFlow gebruiksvoorwaarden en servicebeleid",
};

export default function TermsPage() {
  return (
    <section className="section">
      <div className="container" style={{ maxWidth: 800 }}>
        <h1 style={{ marginBottom: 32 }}>Gebruiksvoorwaarden</h1>

        <div style={{ fontSize: 15, color: "var(--ink2)", lineHeight: 1.8 }}>
          <p style={{ marginBottom: 24 }}>
            <strong>Effectief vanaf:</strong> 25 juni 2026
          </p>

          <h2 style={{ fontSize: 20, fontWeight: 700, marginTop: 32, marginBottom: 12 }}>1. Acceptatie van Voorwaarden</h2>
          <p style={{ marginBottom: 24 }}>
            Door PeakFlow te gebruiken, gaat u akkoord met deze gebruiksvoorwaarden. Wanneer u niet akkoord gaat, mag u de service niet gebruiken.
          </p>

          <h2 style={{ fontSize: 20, fontWeight: 700, marginTop: 32, marginBottom: 12 }}>2. Account Registratie</h2>
          <p style={{ marginBottom: 24 }}>
            U bent verantwoordelijk voor uw account en wachtwoord. U mag:
          </p>
          <ul style={{ marginLeft: 20, marginBottom: 24, listStyleType: "disc" }}>
            <li>Niet meerdere accounts per persoon registreren</li>
            <li>Niet iemand anders&apos; inloggegevens gebruiken</li>
            <li>Niet-menseninformatie (bots, scripts) registreren</li>
            <li>Uw wachtwoord niet delen</li>
          </ul>

          <h2 style={{ fontSize: 20, fontWeight: 700, marginTop: 32, marginBottom: 12 }}>3. User-Generated Content</h2>
          <p style={{ marginBottom: 24 }}>
            Door reviews, ratings of commentaren in te dienen verleent u PeakFlow het recht deze openbaar te maken. U garandeert dat uw content:
          </p>
          <ul style={{ marginLeft: 20, marginBottom: 24, listStyleType: "disc" }}>
            <li>Waar en eerlijk is</li>
            <li>Geen copyright schendt</li>
            <li>Geen persoonlijke informatie van anderen bevat</li>
            <li>Geen hatelijkespreken of beledigingen bevat</li>
          </ul>

          <h2 style={{ fontSize: 20, fontWeight: 700, marginTop: 32, marginBottom: 12 }}>4. Subscriptions &amp; Betalingen</h2>
          <p style={{ marginBottom: 24 }}>
            <strong>Explorer Abonnementen:</strong>
          </p>
          <ul style={{ marginLeft: 20, marginBottom: 24, listStyleType: "disc" }}>
            <li>Maandelijks: €4,99/maand, opzegbaar op elk moment</li>
            <li>Jaarlijks: €39/jaar, automatische verlenging</li>
            <li>Betalingen via Stripe; u ontvangt een factuur</li>
            <li>Geen terugbetaling na betaling tenzij wettelijk vereist</li>
          </ul>

          <h2 style={{ fontSize: 20, fontWeight: 700, marginTop: 32, marginBottom: 12 }}>5. Intellectual Property</h2>
          <p style={{ marginBottom: 24 }}>
            PeakFlow en al zijn content (algoritmes, data, ontwerp, afbeeldingen) zijn eigendom van PeakFlow. U mag dit niet kopiëren, modificeren of hergebruiken zonder toestemming.
          </p>

          <h2 style={{ fontSize: 20, fontWeight: 700, marginTop: 32, marginBottom: 12 }}>6. Beperking van Aansprakelijkheid</h2>
          <p style={{ marginBottom: 24 }}>
            PeakFlow wordt &ldquo;as-is&rdquo; aangeboden. We garanderen niet dat de service foutvrij is. We zijn niet aansprakelijk voor:
          </p>
          <ul style={{ marginLeft: 20, marginBottom: 24, listStyleType: "disc" }}>
            <li>Indirect of gevolgschade</li>
            <li>Verlies van gegevens of inkomsten</li>
            <li>Onwaarheidigheden in reviews</li>
          </ul>

          <h2 style={{ fontSize: 20, fontWeight: 700, marginTop: 32, marginBottom: 12 }}>7. Schorsing en Beëindiging</h2>
          <p style={{ marginBottom: 24 }}>
            We kunnen uw account schorsen of beëindigen als u:
          </p>
          <ul style={{ marginLeft: 20, marginBottom: 24, listStyleType: "disc" }}>
            <li>Deze voorwaarden schendt</li>
            <li>Illegale activiteiten begaat</li>
            <li>Spam, hatelijke inhoud post</li>
            <li>Anderen lastigvalt of bedreigt</li>
          </ul>

          <h2 style={{ fontSize: 20, fontWeight: 700, marginTop: 32, marginBottom: 12 }}>8. Toepasselijk Recht</h2>
          <p style={{ marginBottom: 24 }}>
            Deze voorwaarden worden geregeerd door Nederlands recht. Geschillen worden opgelost onder Nederlandse jurisdictie.
          </p>

          <h2 style={{ fontSize: 20, fontWeight: 700, marginTop: 32, marginBottom: 12 }}>9. Wijzigingen</h2>
          <p style={{ marginBottom: 24 }}>
            We kunnen deze voorwaarden wijzigen. U ontvangt kennisgeving van materiële wijzigingen per e-mail.
          </p>

          <h2 style={{ fontSize: 20, fontWeight: 700, marginTop: 32, marginBottom: 12 }}>10. Contact</h2>
          <p>
            Vragen over deze voorwaarden? <br />
            E-mail: legal@peakflow.io
          </p>
        </div>
      </div>
    </section>
  );
}
