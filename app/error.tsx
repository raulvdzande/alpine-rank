"use client";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div style={{ minHeight: "60vh", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "sans-serif" }}>
      <div style={{ textAlign: "center", padding: 40 }}>
        <h1 style={{ fontSize: 48, marginBottom: 8 }}>⛷️</h1>
        <h2 style={{ fontSize: 24, fontWeight: 700, color: "#1e293b", marginBottom: 8 }}>Oeps, er ging iets mis</h2>
        <p style={{ color: "#64748b", marginBottom: 24 }}>Er is een serverfout opgetreden. Probeer het opnieuw.</p>
        <button
          onClick={reset}
          style={{ background: "#1d9e75", color: "white", border: "none", padding: "12px 24px", borderRadius: 8, fontSize: 16, fontWeight: 600, cursor: "pointer" }}
        >
          Opnieuw proberen
        </button>
        {error.digest && (
          <p style={{ marginTop: 16, fontSize: 12, color: "#94a3b8" }}>Foutcode: {error.digest}</p>
        )}
      </div>
    </div>
  );
}
