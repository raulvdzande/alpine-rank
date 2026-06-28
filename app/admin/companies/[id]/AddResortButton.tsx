"use client";

import { useState } from "react";

interface Resort {
  id: string;
  name: string;
  Country: string;
}

export default function AddResortButton({ companyId }: { companyId: string }) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [resorts, setResorts] = useState<Resort[]>([]);
  const [searched, setSearched] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedResortId, setSelectedResortId] = useState("");

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/resorts/search?q=${encodeURIComponent(searchQuery)}`);
      if (res.ok) {
        const data = await res.json();
        setResorts(data.resorts || []);
      }
    } finally {
      setLoading(false);
      setSearched(true);
    }
  };

  const handleAdd = async () => {
    if (!selectedResortId) return;
    setLoading(true);
    try {
      const res = await fetch("/api/admin/company/resort/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ companyId, resortId: selectedResortId }),
      });
      if (res.ok) {
        alert("Ski resort added");
        setOpen(false);
        setSearchQuery("");
        setSelectedResortId("");
        setResorts([]);
        window.location.reload();
      } else {
        const data = await res.json();
        alert("Error: " + (data.error || "Failed to add"));
      }
    } finally {
      setLoading(false);
    }
  };

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        style={{
          background: "var(--peak)",
          color: "white",
          border: "none",
          padding: "8px 16px",
          borderRadius: 6,
          cursor: "pointer",
          fontWeight: 600,
          fontSize: 13,
        }}
      >
        + Add ski resort
      </button>
    );
  }

  return (
    <div style={{
      position: "fixed",
      inset: 0,
      background: "rgba(0,0,0,0.5)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      zIndex: 1000,
    }}>
      <div style={{
        background: "white",
        borderRadius: 12,
        padding: 24,
        maxWidth: 400,
        width: "100%",
        margin: 20,
      }}>
        <h2 style={{ marginBottom: 20, fontSize: 18, fontWeight: 700 }}>
          Add ski resort
        </h2>

        <div style={{ marginBottom: 16 }}>
          <label style={{ display: "block", fontSize: 13, fontWeight: 600, marginBottom: 6 }}>
            Search ski resort
          </label>
          <div style={{ display: "flex", gap: 8 }}>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleSearch()}
              placeholder="e.g. Verbier, Zermatt..."
              style={{
                flex: 1,
                padding: "10px 14px",
                border: "1px solid var(--border)",
                borderRadius: 8,
                fontSize: 14,
                boxSizing: "border-box",
              }}
            />
            <button
              onClick={handleSearch}
              disabled={loading}
              style={{
                padding: "10px 14px",
                background: "var(--peak)",
                color: "white",
                border: "none",
                borderRadius: 8,
                cursor: loading ? "not-allowed" : "pointer",
                fontWeight: 600,
                fontSize: 13,
                opacity: loading ? 0.6 : 1,
              }}
            >
              Search
            </button>
          </div>
        </div>

        {searched && resorts.length > 0 && (
          <div style={{ marginBottom: 16 }}>
            <label style={{ display: "block", fontSize: 13, fontWeight: 600, marginBottom: 6 }}>
              Select ski resort
            </label>
            <select
              value={selectedResortId}
              onChange={(e) => setSelectedResortId(e.target.value)}
              style={{
                width: "100%",
                padding: "10px 14px",
                border: "1px solid var(--border)",
                borderRadius: 8,
                fontSize: 14,
                boxSizing: "border-box",
              }}
            >
              <option value="">— Choose a ski resort —</option>
              {resorts.map((resort) => (
                <option key={resort.id} value={resort.id}>
                  {resort.name}, {resort.Country}
                </option>
              ))}
            </select>
          </div>
        )}

        {searched && resorts.length === 0 && (
          <p style={{ fontSize: 13, color: "var(--ink3)", marginBottom: 16 }}>No ski resorts found</p>
        )}

        <div style={{ display: "flex", gap: 12 }}>
          <button
            type="button"
            onClick={() => setOpen(false)}
            disabled={loading}
            style={{
              flex: 1,
              padding: "10px",
              border: "1px solid var(--border)",
              borderRadius: 8,
              background: "white",
              cursor: "pointer",
              fontSize: 14,
              fontWeight: 600,
            }}
          >
            Cancel
          </button>
          <button
            onClick={handleAdd}
            disabled={loading || !selectedResortId}
            style={{
              flex: 1,
              padding: "10px",
              background: "var(--peak)",
              color: "white",
              border: "none",
              borderRadius: 8,
              cursor: loading || !selectedResortId ? "not-allowed" : "pointer",
              fontSize: 14,
              fontWeight: 600,
              opacity: loading || !selectedResortId ? 0.6 : 1,
            }}
          >
            {loading ? "Saving..." : "Add"}
          </button>
        </div>
      </div>
    </div>
  );
}
