"use client";

import { useState, useEffect } from "react";

export function CookieBanner() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem("analytics-consent");
    if (consent === null) {
      setShow(true);
    }
  }, []);

  function acceptCookies() {
    localStorage.setItem("analytics-consent", "true");
    setShow(false);
    window.location.reload();
  }

  function rejectCookies() {
    localStorage.setItem("analytics-consent", "false");
    setShow(false);
  }

  if (!show) return null;

  return (
    <div
      id="cookie-banner"
      style={{
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        background: "white",
        borderTop: "1px solid var(--border)",
        padding: "20px",
        boxShadow: "0 -2px 12px rgba(0,0,0,0.08)",
        zIndex: 1000,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 16,
        flexWrap: "wrap",
      }}
    >
      <div style={{ flex: 1, minWidth: 300 }}>
        <div style={{ fontWeight: 600, marginBottom: 6 }}>📊 Analytics & Cookies</div>
        <div style={{ fontSize: 13, color: "var(--ink2)", lineHeight: 1.5 }}>
          We gebruiken Google Analytics en PostHog om PeakFlow beter te maken. Alleen anonieme data, je privacy staat voorop.
          <a href="/privacy" style={{ color: "var(--peak)", textDecoration: "underline", marginLeft: 4 }}>
            Lees ons privacybeleid
          </a>
        </div>
      </div>

      <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
        <button
          onClick={rejectCookies}
          style={{
            padding: "8px 16px",
            borderRadius: "6px",
            border: "1px solid var(--border2)",
            background: "white",
            cursor: "pointer",
            fontSize: 13,
            fontWeight: 600,
          }}
        >
          Weigeren
        </button>
        <button
          onClick={acceptCookies}
          className="btn btn-primary"
          style={{
            fontSize: 13,
            padding: "8px 16px",
          }}
        >
          ✓ Accepteren
        </button>
      </div>
    </div>
  );
}
