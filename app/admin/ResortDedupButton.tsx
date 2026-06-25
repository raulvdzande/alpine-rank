"use client";

import { useState } from "react";

type Status = "idle" | "running" | "done" | "error";

export default function ResortDedupButton() {
  const [status, setStatus] = useState<Status>("idle");
  const [result, setResult] = useState("");

  async function handleClick() {
    if (!confirm("Alle dubbele resorts verwijderen? De versie met de meeste data (reviews, snowflakes) blijft bewaard.")) return;
    setStatus("running");
    try {
      const res = await fetch("/api/admin/resort-dedup", { method: "POST" });
      const json = await res.json();
      if (!res.ok) {
        setResult(json.error ?? "Onbekende fout");
        setStatus("error");
        return;
      }
      setResult(json.message);
      setStatus("done");
      if (json.deleted > 0) setTimeout(() => window.location.reload(), 1500);
    } catch (err) {
      setResult(err instanceof Error ? err.message : "Onbekende fout");
      setStatus("error");
    }
  }

  const colors: Record<Status, string> = {
    idle: "#475569",
    running: "#78716c",
    done: "#059669",
    error: "#dc2626",
  };

  return (
    <button
      onClick={handleClick}
      disabled={status === "running"}
      style={{
        background: colors[status],
        color: "white",
        border: "none",
        borderRadius: 8,
        padding: "10px 18px",
        fontSize: 13,
        fontWeight: 600,
        cursor: status === "running" ? "wait" : "pointer",
        display: "flex",
        alignItems: "center",
        gap: 8,
        whiteSpace: "nowrap",
      }}
    >
      {status === "running" ? "⏳ Verwijderen..." : status === "done" ? `✓ ${result}` : status === "error" ? `✕ ${result}` : "⚡ Duplicaten verwijderen"}
    </button>
  );
}
