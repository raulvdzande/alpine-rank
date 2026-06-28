export const metadata = {
  title: "Terms of Service — PeakFlow",
  description: "PeakFlow terms of service and usage policy",
};

export default function TermsPage() {
  return (
    <section className="section">
      <div className="container" style={{ maxWidth: 800 }}>
        <h1 style={{ marginBottom: 32 }}>Terms of Service</h1>

        <div style={{ fontSize: 15, color: "var(--ink2)", lineHeight: 1.8 }}>
          <p style={{ marginBottom: 24 }}>
            <strong>Effective from:</strong> 25 June 2026
          </p>

          <h2 style={{ fontSize: 20, fontWeight: 700, marginTop: 32, marginBottom: 12 }}>1. Acceptance of Terms</h2>
          <p style={{ marginBottom: 24 }}>
            By using PeakFlow, you agree to these terms of service. If you do not agree, you may not use the service.
          </p>

          <h2 style={{ fontSize: 20, fontWeight: 700, marginTop: 32, marginBottom: 12 }}>2. Account Registration</h2>
          <p style={{ marginBottom: 24 }}>
            You are responsible for your account and password. You may not:
          </p>
          <ul style={{ marginLeft: 20, marginBottom: 24, listStyleType: "disc" }}>
            <li>Register multiple accounts per person</li>
            <li>Use someone else&apos;s login credentials</li>
            <li>Register non-human information (bots, scripts)</li>
            <li>Share your password</li>
          </ul>

          <h2 style={{ fontSize: 20, fontWeight: 700, marginTop: 32, marginBottom: 12 }}>3. User-Generated Content</h2>
          <p style={{ marginBottom: 24 }}>
            By submitting reviews, ratings or comments you grant PeakFlow the right to publish them. You guarantee that your content:
          </p>
          <ul style={{ marginLeft: 20, marginBottom: 24, listStyleType: "disc" }}>
            <li>Is truthful and fair</li>
            <li>Does not infringe copyright</li>
            <li>Does not contain other people&apos;s personal information</li>
            <li>Does not contain hate speech or insults</li>
          </ul>

          <h2 style={{ fontSize: 20, fontWeight: 700, marginTop: 32, marginBottom: 12 }}>4. Subscriptions &amp; Payments</h2>
          <p style={{ marginBottom: 24 }}>
            <strong>Explorer subscriptions:</strong>
          </p>
          <ul style={{ marginLeft: 20, marginBottom: 24, listStyleType: "disc" }}>
            <li>Monthly: €4.99/month, cancellable at any time</li>
            <li>Annual: €39/year, automatic renewal</li>
            <li>Payments via Stripe; you receive an invoice</li>
            <li>No refunds after payment unless legally required</li>
          </ul>

          <h2 style={{ fontSize: 20, fontWeight: 700, marginTop: 32, marginBottom: 12 }}>5. Intellectual Property</h2>
          <p style={{ marginBottom: 24 }}>
            PeakFlow and all its content (algorithms, data, design, images) are owned by PeakFlow. You may not copy, modify or reuse this without permission.
          </p>

          <h2 style={{ fontSize: 20, fontWeight: 700, marginTop: 32, marginBottom: 12 }}>6. Limitation of Liability</h2>
          <p style={{ marginBottom: 24 }}>
            PeakFlow is provided &ldquo;as-is&rdquo;. We do not guarantee that the service is error-free. We are not liable for:
          </p>
          <ul style={{ marginLeft: 20, marginBottom: 24, listStyleType: "disc" }}>
            <li>Indirect or consequential damages</li>
            <li>Loss of data or revenue</li>
            <li>Inaccuracies in reviews</li>
          </ul>

          <h2 style={{ fontSize: 20, fontWeight: 700, marginTop: 32, marginBottom: 12 }}>7. Suspension and Termination</h2>
          <p style={{ marginBottom: 24 }}>
            We may suspend or terminate your account if you:
          </p>
          <ul style={{ marginLeft: 20, marginBottom: 24, listStyleType: "disc" }}>
            <li>Violate these terms</li>
            <li>Engage in illegal activities</li>
            <li>Post spam or hateful content</li>
            <li>Harass or threaten others</li>
          </ul>

          <h2 style={{ fontSize: 20, fontWeight: 700, marginTop: 32, marginBottom: 12 }}>8. Governing Law</h2>
          <p style={{ marginBottom: 24 }}>
            These terms are governed by Dutch law. Disputes are resolved under Dutch jurisdiction.
          </p>

          <h2 style={{ fontSize: 20, fontWeight: 700, marginTop: 32, marginBottom: 12 }}>9. Changes</h2>
          <p style={{ marginBottom: 24 }}>
            We may update these terms. You will receive notification of material changes by email.
          </p>

          <h2 style={{ fontSize: 20, fontWeight: 700, marginTop: 32, marginBottom: 12 }}>10. Contact</h2>
          <p>
            Questions about these terms? <br />
            Email: legal@peakflow.io
          </p>
        </div>
      </div>
    </section>
  );
}
