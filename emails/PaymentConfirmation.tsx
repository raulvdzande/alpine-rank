export default function PaymentConfirmation({
  customerEmail,
  planName,
  amount,
  interval,
}: {
  customerEmail: string;
  planName: string;
  amount: number;
  interval: string;
}) {
  return (
    <div style={{ fontFamily: "sans-serif", color: "#333" }}>
      <h2 style={{ color: "#1d9e75" }}>Bedankt voor je betaling!</h2>

      <p>Hallo,</p>

      <p>
        Je abonnement op <strong>{planName}</strong> is geactiveerd. Hier zijn je
        betalingsgegevens:
      </p>

      <div
        style={{
          background: "#f8fafc",
          padding: "20px",
          borderRadius: "8px",
          marginBottom: "20px",
        }}
      >
        <p>
          <strong>Plan:</strong> {planName}
        </p>
        <p>
          <strong>Bedrag:</strong> €{(amount / 100).toFixed(2)}
        </p>
        <p>
          <strong>Frequentie:</strong> {interval === "month" ? "Maandelijks" : "Jaarlijks"}
        </p>
        <p>
          <strong>Email:</strong> {customerEmail}
        </p>
      </div>

      <p>
        Je kunt je abonnement op elk moment beheren via je
        <a href="https://peakflow.io/account" style={{ color: "#1d9e75" }}>
          {" "}
          accountpagina
        </a>
        .
      </p>

      <p style={{ marginTop: "30px", color: "#999", fontSize: "12px" }}>
        Vragen? Contact ons op support@peakflow.io
      </p>
    </div>
  );
}
