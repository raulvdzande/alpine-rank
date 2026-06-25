interface InvoiceEmailProps {
  name: string;
  plan: string;
  amount: number;
  date: string;
}

export function InvoiceEmail({ name, plan, amount, date }: InvoiceEmailProps) {
  const planName = plan === "explorer_monthly" ? "Explorer Monthly" : "Explorer Yearly";

  return (
    <div style={{ fontFamily: "sans-serif", maxWidth: "600px", margin: "0 auto" }}>
      <div style={{ background: "white", padding: "40px 20px", borderBottom: "2px solid #1d9e75" }}>
        <div style={{ fontSize: 24, marginBottom: 8 }}>⛰ PeakFlow</div>
        <h1 style={{ fontSize: 24, fontWeight: 700, margin: "0 0 8px 0" }}>Betaling Ontvangen</h1>
        <p style={{ fontSize: 14, color: "#9a9a8e", margin: 0 }}>Je Explorer abonnement is actief</p>
      </div>

      <div style={{ padding: "40px 20px" }}>
        <p style={{ fontSize: 15, color: "#4a4a42", marginBottom: 24 }}>Hallo {name},</p>

        <p style={{ fontSize: 15, color: "#4a4a42", marginBottom: 32 }}>
          Bedankt voor je betaling! We hebben je Explorer abonnement geactiveerd.
        </p>

        <div style={{ background: "#f8f7f3", border: "1px solid #e8e7e0", borderRadius: "8px", padding: "20px", marginBottom: 32 }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12, fontSize: 14 }}>
            <span>Plan</span>
            <strong>{planName}</strong>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12, fontSize: 14 }}>
            <span>Bedrag</span>
            <strong>€{amount.toFixed(2)}</strong>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 14, borderTop: "1px solid #e8e7e0", paddingTop: 12 }}>
            <span>Datum</span>
            <strong>{new Date(date).toLocaleDateString("nl-NL")}</strong>
          </div>
        </div>

        <div style={{ background: "#e6f7f2", border: "1px solid #1d9e75", borderRadius: "8px", padding: "16px", marginBottom: 32 }}>
          <p style={{ fontSize: 14, color: "#0f6e50", margin: 0 }}>
            ✓ Je hebt nu volledige toegang tot PeakFlow Explorer
          </p>
        </div>

        <p style={{ fontSize: 14, color: "#9a9a8e", marginBottom: 32 }}>
          Vragen? Neem contact op met support@peakflow.io
        </p>

        <div style={{ borderTop: "1px solid #e8e7e0", paddingTop: 24 }}>
          <p style={{ fontSize: 12, color: "#9a9a8e", margin: 0 }}>
            PeakFlow · De rankings die skiërs vertrouwen
          </p>
        </div>
      </div>
    </div>
  );
}
