"use client";

import { useState } from "react";

interface Progress {
  processed?: number;
  total?: number;
  added?: number;
  statsUpdated?: number;
  conditionsUpdated?: number;
  errors?: number;
  phase?: string;
  message?: string;
}

type Status = "idle" | "running" | "done" | "error";

export default function ResortRefreshButton() {
  const [status, setStatus] = useState<Status>("idle");
  const [progress, setProgress] = useState<Progress | null>(null);
  const [errorMsg, setErrorMsg] = useState("");

  async function handleClick() {
    setStatus("running");
    setProgress(null);
    setErrorMsg("");

    try {
      const res = await fetch("/api/admin/resort-refresh", { method: "POST" });

      if (!res.ok) {
        const text = await res.text();
        let msg = text;
        try {
          const json = JSON.parse(text);
          if (json.error) msg = json.error;
        } catch {}
        setErrorMsg(msg);
        setStatus("error");
        return;
      }

      const reader = res.body?.getReader();
      if (!reader) { setStatus("error"); setErrorMsg("No response body"); return; }

      const decoder = new TextDecoder();
      let buffer = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() ?? "";
        for (const line of lines) {
          if (!line.trim()) continue;
          try {
            const data = JSON.parse(line);
            if (data.error) {
              setErrorMsg(data.error);
              setStatus("error");
              return;
            }
            setProgress(data as Progress);
          } catch {}
        }
      }

      setStatus("done");
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : "Unknown error");
      setStatus("error");
    }
  }

  const pct = progress?.total && progress?.processed
    ? Math.round((progress.processed / progress.total) * 100)
    : 0;

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 10 }}>
      {status === "idle" && (
        <button
          onClick={handleClick}
          style={{
            background: "#3b82f6",
            color: "white",
            border: "none",
            borderRadius: 8,
            padding: "10px 20px",
            fontSize: 13,
            fontWeight: 600,
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: 8,
          }}
        >
          ↻ Refresh data
        </button>
      )}

      {status === "running" && (
        <div style={{ background: "#1e293b", border: "1px solid #334155", borderRadius: 10, padding: "14px 18px", minWidth: 320 }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
            <span style={{ fontSize: 13, color: "#94a3b8", fontWeight: 600 }}>Refreshing data...</span>
            <span style={{ fontSize: 13, color: "#60a5fa", fontWeight: 700 }}>{pct}%</span>
          </div>
          <div style={{ background: "#0f172a", borderRadius: 6, height: 8, overflow: "hidden" }}>
            <div style={{ background: "#3b82f6", height: "100%", width: `${pct}%`, transition: "width .3s ease", borderRadius: 6 }} />
          </div>
          {progress && (
            <div style={{ marginTop: 8, fontSize: 12, color: "#64748b" }}>
              {progress.message ? (
                <span style={{ color: "#94a3b8" }}>{progress.message}</span>
              ) : (
                <>
                  {progress.processed} / {progress.total}
                  {" · "}
                  <span style={{ color: "#a78bfa" }}>+{progress.added ?? 0} new</span>
                  {" · "}
                  <span style={{ color: "#34d399" }}>⛷ {progress.statsUpdated ?? 0}</span>
                  {" · "}
                  <span style={{ color: "#60a5fa" }}>❄ {progress.conditionsUpdated ?? 0}</span>
                  {(progress.errors ?? 0) > 0 && (
                    <>{" · "}<span style={{ color: "#f87171" }}>{progress.errors} errors</span></>
                  )}
                </>
              )}
            </div>
          )}
        </div>
      )}

      {status === "done" && progress && (
        <div style={{ background: "#064e3b", border: "1px solid #065f46", borderRadius: 10, padding: "14px 18px", display: "flex", alignItems: "center", gap: 16 }}>
          <span style={{ fontSize: 18 }}>✓</span>
          <div style={{ fontSize: 13, color: "#6ee7b7" }}>
            <strong>Done!</strong>{" "}
            +{progress.added ?? 0} new · ⛷ {progress.statsUpdated ?? 0} stats · ❄ {progress.conditionsUpdated ?? 0} snow
            {(progress.errors ?? 0) > 0 && <> · <span style={{ color: "#fca5a5" }}>{progress.errors} errors</span></>}
          </div>
          <button
            onClick={() => window.location.reload()}
            style={{ background: "#059669", color: "white", border: "none", borderRadius: 7, padding: "7px 14px", fontSize: 12, fontWeight: 600, cursor: "pointer", marginLeft: "auto" }}
          >
            Reload page
          </button>
        </div>
      )}

      {status === "error" && (
        <div style={{ background: "#450a0a", border: "1px solid #7f1d1d", borderRadius: 10, padding: "14px 18px", display: "flex", alignItems: "center", gap: 12 }}>
          <span style={{ fontSize: 18 }}>✕</span>
          <div>
            <div style={{ fontSize: 13, color: "#fca5a5", fontWeight: 600 }}>Error refreshing data</div>
            <div style={{ fontSize: 12, color: "#f87171", marginTop: 2 }}>{errorMsg}</div>
          </div>
          <button
            onClick={() => setStatus("idle")}
            style={{ background: "#7f1d1d", color: "#fca5a5", border: "none", borderRadius: 7, padding: "7px 14px", fontSize: 12, fontWeight: 600, cursor: "pointer", marginLeft: "auto" }}
          >
            Try again
          </button>
        </div>
      )}
    </div>
  );
}
