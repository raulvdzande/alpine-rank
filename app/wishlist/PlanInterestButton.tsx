"use client";

import { useState } from "react";

interface Props {
  plan: string;
  userEmail: string | null;
  alreadySaved?: boolean;
}

export default function PlanInterestButton({ plan, userEmail, alreadySaved }: Props) {
  const [state, setState] = useState<"idle" | "email" | "loading" | "done">(
    alreadySaved ? "done" : "idle"
  );
  const [email, setEmail] = useState(userEmail || "");
  const [error, setError] = useState("");

  const submit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!email) return;
    setState("loading");
    const res = await fetch("/api/plan-interest", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, plan }),
    });
    if (res.ok || res.status === 409) {
      setState("done");
    } else {
      setError("Something went wrong, please try again");
      setState(userEmail ? "idle" : "email");
    }
  };

  if (state === "done") {
    return (
      <div style={{
        textAlign: "center", padding: "12px", borderRadius: 8,
        background: "rgba(29,158,117,0.1)", color: "#1d9e75", fontWeight: 600, fontSize: 14,
      }}>
        ✓ Added to your wishlist!
      </div>
    );
  }

  if (state === "email") {
    return (
      <form onSubmit={submit} style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        <input
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          placeholder="your@email.com"
          required
          autoFocus
          style={{
            padding: "10px 12px", borderRadius: 6, border: "1px solid #e2e8f0",
            fontSize: 14, outline: "none", width: "100%", boxSizing: "border-box" as const,
          }}
        />
        {error && <div style={{ color: "#f87171", fontSize: 12 }}>{error}</div>}
        <button
          type="submit"
          style={{
            background: "#1d9e75", color: "white", border: "none", padding: "11px",
            borderRadius: 8, fontWeight: 700, cursor: "pointer", fontSize: 14,
          }}
        >
          Confirm →
        </button>
      </form>
    );
  }

  return (
    <button
      onClick={() => userEmail ? submit() : setState("email")}
      disabled={state === "loading"}
      style={{
        width: "100%", background: "#1d9e75", color: "white", border: "none",
        padding: "12px", borderRadius: 8, fontWeight: 700, cursor: "pointer",
        fontSize: 14, opacity: state === "loading" ? 0.7 : 1,
      }}
    >
      {state === "loading" ? "Saving..." : "Add to my wishlist"}
    </button>
  );
}
