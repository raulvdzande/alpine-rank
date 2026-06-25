"use client";

import { useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";

function SetupForm() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  if (!token) {
    return (
      <section style={{ padding: "60px 20px", textAlign: "center" }}>
        <div style={{ maxWidth: 500, margin: "0 auto" }}>
          <h1>Invalid link</h1>
          <p style={{ color: "var(--ink2)" }}>Setup link is missing or invalid.</p>
        </div>
      </section>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Wachtwoorden komen niet overeen");
      return;
    }

    if (password.length < 8) {
      setError("Wachtwoord moet minstens 8 karakters zijn");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/company/setup-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password }),
      });

      if (res.ok) {
        setSuccess(true);
      } else {
        const data = await res.json();
        setError(data.error || "Setup mislukt");
      }
    } catch (err) {
      setError("Fout bij setup");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <section style={{ padding: "60px 20px", textAlign: "center" }}>
        <div style={{ maxWidth: 500, margin: "0 auto" }}>
          <div style={{ fontSize: 48, marginBottom: 20 }}>✅</div>
          <h1 style={{ fontSize: 28, fontWeight: 800, marginBottom: 12, color: "var(--peak)" }}>
            Wachtwoord ingesteld!
          </h1>
          <p style={{ fontSize: 16, color: "var(--ink2)", marginBottom: 32 }}>
            Je kunt nu inloggen met je account.
          </p>
          <a
            href="/company/login"
            style={{
              display: "inline-block",
              background: "var(--peak)",
              color: "white",
              padding: "12px 28px",
              borderRadius: 8,
              textDecoration: "none",
              fontWeight: 600,
            }}
          >
            Ga naar login →
          </a>
        </div>
      </section>
    );
  }

  return (
    <section style={{ padding: "60px 20px", minHeight: "100vh", display: "flex", alignItems: "center" }}>
      <div style={{ maxWidth: 400, margin: "0 auto", width: "100%" }}>
        <div style={{ marginBottom: 32, textAlign: "center" }}>
          <h1 style={{ fontSize: 28, fontWeight: 800, marginBottom: 8 }}>
            Wachtwoord instellen
          </h1>
          <p style={{ color: "var(--ink2)" }}>
            Stel je wachtwoord in om toegang te krijgen
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          {error && (
            <div style={{
              background: "#fee2e2",
              border: "1px solid #fca5a5",
              color: "#991b1b",
              padding: 12,
              borderRadius: 8,
              marginBottom: 16,
              fontSize: 13,
            }}>
              {error}
            </div>
          )}

          <div style={{ marginBottom: 16 }}>
            <label style={{ display: "block", fontSize: 13, fontWeight: 600, marginBottom: 6 }}>
              Wachtwoord (min. 8 karakters) *
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={{
                width: "100%",
                padding: "10px 14px",
                border: "1px solid var(--border)",
                borderRadius: 8,
                fontSize: 14,
                boxSizing: "border-box",
              }}
            />
          </div>

          <div style={{ marginBottom: 20 }}>
            <label style={{ display: "block", fontSize: 13, fontWeight: 600, marginBottom: 6 }}>
              Herhaal wachtwoord *
            </label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              style={{
                width: "100%",
                padding: "10px 14px",
                border: "1px solid var(--border)",
                borderRadius: 8,
                fontSize: 14,
                boxSizing: "border-box",
              }}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              width: "100%",
              padding: "12px",
              background: "var(--peak)",
              color: "white",
              border: "none",
              borderRadius: 8,
              fontWeight: 600,
              cursor: loading ? "not-allowed" : "pointer",
              fontSize: 14,
              opacity: loading ? 0.6 : 1,
            }}
          >
            {loading ? "Bezig..." : "Wachtwoord instellen"}
          </button>
        </form>
      </div>
    </section>
  );
}

export default function CompanySetupPage() {
  return (
    <Suspense fallback={<div style={{ padding: "60px 20px", textAlign: "center" }}>Loading...</div>}>
      <SetupForm />
    </Suspense>
  );
}
