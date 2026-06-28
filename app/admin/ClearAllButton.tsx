"use client";

import { useState } from "react";
import { deleteAllResorts } from "./actions";

export default function ClearAllButton({ total }: { total: number }) {
  const [step, setStep] = useState<"idle" | "confirm" | "loading">("idle");
  const [error, setError] = useState<string | null>(null);

  async function handleConfirm() {
    setStep("loading");
    try {
      await deleteAllResorts();
      window.location.reload();
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Error");
      setStep("idle");
    }
  }

  if (step === "confirm") {
    return (
      <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
        <span style={{ fontSize: 13, color: "#f87171" }}>
          ⚠️ Delete all {total} resorts and reviews?
        </span>
        <button
          onClick={handleConfirm}
          style={{ background: "#7f1d1d", color: "white", border: "none", borderRadius: 8, padding: "8px 16px", fontSize: 13, fontWeight: 700, cursor: "pointer" }}
        >
          Yes, delete all
        </button>
        <button
          onClick={() => setStep("idle")}
          style={{ background: "#1e293b", color: "#94a3b8", border: "1px solid #334155", borderRadius: 8, padding: "8px 14px", fontSize: 13, cursor: "pointer" }}
        >
          Cancel
        </button>
        {error && <span style={{ fontSize: 12, color: "#f87171" }}>{error}</span>}
      </div>
    );
  }

  if (step === "loading") {
    return <span style={{ fontSize: 13, color: "#f87171" }}>Deleting...</span>;
  }

  return (
    <button
      onClick={() => setStep("confirm")}
      style={{ background: "transparent", color: "#f87171", border: "1px solid rgba(248,113,113,.3)", borderRadius: 8, padding: "8px 16px", fontSize: 13, fontWeight: 600, cursor: "pointer" }}
    >
      🗑 Clear all
    </button>
  );
}
