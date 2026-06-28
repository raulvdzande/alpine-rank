export default function CompanySuccessPage() {
  return (
    <section style={{ padding: "60px 20px", textAlign: "center" }}>
      <div style={{ maxWidth: 600, margin: "0 auto" }}>
        <div style={{ fontSize: 64, marginBottom: 24 }}>✅</div>

        <h1 style={{ fontSize: 32, fontWeight: 800, marginBottom: 12, color: "var(--peak)" }}>
          Payment received!
        </h1>

        <p style={{ fontSize: 16, color: "var(--ink2)", marginBottom: 32, lineHeight: 1.6 }}>
          Thank you! Your company account is now active. You will receive an email shortly with your login credentials and password.
        </p>

        <div style={{ background: "var(--snow)", borderRadius: 12, padding: 24, marginBottom: 32 }}>
          <h3 style={{ marginBottom: 16 }}>Next steps:</h3>
          <ol style={{ textAlign: "left", display: "inline-block", lineHeight: 2 }}>
            <li>Check your email for login credentials</li>
            <li>Log in with your manager account</li>
            <li>Change your password</li>
            <li>Add team members (optional)</li>
            <li>Complete your company profile</li>
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
          Go to your dashboard →
        </a>

        <p style={{ marginTop: 24, color: "var(--ink3)", fontSize: 13 }}>
          Questions? Contact us at support@peakflow.io
        </p>
      </div>
    </section>
  );
}
