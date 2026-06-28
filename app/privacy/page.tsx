export const metadata = {
  title: "Privacy Policy — PeakFlow",
  description: "PeakFlow privacy policy and data protection",
};

export default function PrivacyPage() {
  return (
    <section className="section">
      <div className="container" style={{ maxWidth: 800 }}>
        <h1 style={{ marginBottom: 32 }}>Privacy Policy</h1>

        <div style={{ fontSize: 15, color: "var(--ink2)", lineHeight: 1.8 }}>
          <p style={{ marginBottom: 24 }}>
            <strong>Effective from:</strong> 25 June 2026
          </p>

          <h2 style={{ fontSize: 20, fontWeight: 700, marginTop: 32, marginBottom: 12 }}>1. Introduction</h2>
          <p style={{ marginBottom: 24 }}>
            PeakFlow (&ldquo;We&rdquo;, &ldquo;us&rdquo;, or &ldquo;Company&rdquo;) is committed to protecting your personal data. This privacy policy describes how we collect, use and secure your information.
          </p>

          <h2 style={{ fontSize: 20, fontWeight: 700, marginTop: 32, marginBottom: 12 }}>2. What data we collect</h2>
          <p style={{ marginBottom: 12 }}>We collect data you provide to us directly:</p>
          <ul style={{ marginLeft: 20, marginBottom: 24, listStyleType: "disc" }}>
            <li>Registration data: name, email address, password</li>
            <li>Profile data: ski level, country, preferences</li>
            <li>Review data: your reviews and ratings of ski resorts</li>
            <li>Payment data: via Stripe (we do not store credit card details)</li>
          </ul>

          <h2 style={{ fontSize: 20, fontWeight: 700, marginTop: 32, marginBottom: 12 }}>3. How we use your data</h2>
          <ul style={{ marginLeft: 20, marginBottom: 24, listStyleType: "disc" }}>
            <li>Manage your account and provide services to you</li>
            <li>Contact you about your account or service</li>
            <li>Publish your reviews and ratings on the site</li>
            <li>Improve and analyse our service</li>
            <li>Comply with laws and regulations</li>
          </ul>

          <h2 style={{ fontSize: 20, fontWeight: 700, marginTop: 32, marginBottom: 12 }}>4. Data security</h2>
          <p style={{ marginBottom: 24 }}>
            We implement industry security standards, including HTTPS encryption and secure databases. Your password is hashed with bcrypt and never stored in plain text.
          </p>

          <h2 style={{ fontSize: 20, fontWeight: 700, marginTop: 32, marginBottom: 12 }}>5. Legal basis</h2>
          <p style={{ marginBottom: 24 }}>
            We process your data under:
          </p>
          <ul style={{ marginLeft: 20, marginBottom: 24, listStyleType: "disc" }}>
            <li>Contract performance (your account and payments)</li>
            <li>Legitimate business interests (service improvement)</li>
            <li>Your consent (marketing emails)</li>
          </ul>

          <h2 style={{ fontSize: 20, fontWeight: 700, marginTop: 32, marginBottom: 12 }}>6. Cookies</h2>
          <p style={{ marginBottom: 24 }}>
            We use cookies for session management (your login status) and analytics (with your consent). You can refuse cookies, but this limits certain functionality.
          </p>

          <h2 style={{ fontSize: 20, fontWeight: 700, marginTop: 32, marginBottom: 12 }}>7. Your rights</h2>
          <p style={{ marginBottom: 24 }}>
            Under GDPR you have the right to:
          </p>
          <ul style={{ marginLeft: 20, marginBottom: 24, listStyleType: "disc" }}>
            <li><strong>Access:</strong> view your personal data</li>
            <li><strong>Correction:</strong> correct inaccurate data</li>
            <li><strong>Deletion:</strong> &ldquo;the right to be forgotten&rdquo;</li>
            <li><strong>Portability:</strong> download your data</li>
            <li><strong>Objection:</strong> to certain processing</li>
          </ul>
          <p style={{ marginBottom: 24 }}>
            Contact privacy@peakflow.io to exercise these rights.
          </p>

          <h2 style={{ fontSize: 20, fontWeight: 700, marginTop: 32, marginBottom: 12 }}>8. Third parties</h2>
          <p style={{ marginBottom: 24 }}>
            We do not share your data with third parties, except:
          </p>
          <ul style={{ marginLeft: 20, marginBottom: 24, listStyleType: "disc" }}>
            <li><strong>Stripe:</strong> for payment processing</li>
            <li><strong>Analytics:</strong> anonymised data</li>
          </ul>

          <h2 style={{ fontSize: 20, fontWeight: 700, marginTop: 32, marginBottom: 12 }}>9. Changes</h2>
          <p style={{ marginBottom: 24 }}>
            We may update this policy. Changes are effective when published on this page.
          </p>

          <h2 style={{ fontSize: 20, fontWeight: 700, marginTop: 32, marginBottom: 12 }}>10. Contact</h2>
          <p>
            Questions about our privacy policy? <br />
            Email: privacy@peakflow.io
          </p>
        </div>
      </div>
    </section>
  );
}
