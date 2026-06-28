"use client";

import { useState } from "react";
import Link from "next/link";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      let res = await fetch("/api/company/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (res.ok) {
        window.location.href = "/company/dashboard";
        return;
      }

      res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.role === "ADMIN") {
          window.location.href = "/admin";
        } else {
          window.location.href = "/";
        }
      } else {
        const data = await res.json();
        setError(data.error || "Invalid email address or password");
      }
    } catch {
      setError("Login error, please try again");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: "60px 20px", minHeight: "100vh", display: "flex", alignItems: "center" }}>
      <div style={{ maxWidth: 400, margin: "0 auto", width: "100%" }}>
        <div style={{ marginBottom: 32, textAlign: "center" }}>
          <img src="/logo.svg" alt="PeakFlow" style={{ width: 80, height: 80, marginBottom: 16 }} />
          <h1 style={{ fontSize: 28, fontWeight: 800, marginBottom: 8 }}>PeakFlow</h1>
          <p style={{ color: "var(--ink2)", fontSize: 13 }}>Log in to your account</p>
        </div>

        <form onSubmit={handleSubmit}>
          {error && (
            <div style={{
              background: "#fee2e2", border: "1px solid #fca5a5", color: "#991b1b",
              padding: 12, borderRadius: 8, marginBottom: 16, fontSize: 13,
            }}>
              {error}
            </div>
          )}

          <div style={{ marginBottom: 16 }}>
            <label style={{ display: "block", fontSize: 13, fontWeight: 600, marginBottom: 6 }}>
              Email address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="you@example.com"
              autoComplete="email"
              style={{ width: "100%", padding: "10px 14px", border: "1px solid var(--border)", borderRadius: 8, fontSize: 14, boxSizing: "border-box" }}
            />
          </div>

          <div style={{ marginBottom: 20 }}>
            <label style={{ display: "block", fontSize: 13, fontWeight: 600, marginBottom: 6 }}>
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="••••••••"
              autoComplete="current-password"
              style={{ width: "100%", padding: "10px 14px", border: "1px solid var(--border)", borderRadius: 8, fontSize: 14, boxSizing: "border-box" }}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              width: "100%", padding: "12px", background: "var(--peak)", color: "white",
              border: "none", borderRadius: 8, fontWeight: 600,
              cursor: loading ? "not-allowed" : "pointer", fontSize: 14, opacity: loading ? 0.6 : 1,
            }}
          >
            {loading ? "Loading..." : "Log in →"}
          </button>
        </form>

        <p style={{ textAlign: "center", fontSize: 13, color: "var(--ink3)", marginTop: 20 }}>
          Don&apos;t have an account? <Link href="/register" style={{ color: "var(--peak)", textDecoration: "none", fontWeight: 600 }}>Get started →</Link>
        </p>
      </div>
    </div>
  );
}
