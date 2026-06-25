"use client";

import { useState } from "react";

interface Brand {
  id: string;
  name: string;
  country: string;
}

export default function AddBrandButton({ companyId }: { companyId: string }) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [searched, setSearched] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedBrandId, setSelectedBrandId] = useState("");

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/brands/search?q=${encodeURIComponent(searchQuery)}`);
      if (res.ok) {
        const data = await res.json();
        setBrands(data.brands || []);
      }
    } finally {
      setLoading(false);
      setSearched(true);
    }
  };

  const handleAdd = async () => {
    if (!selectedBrandId) return;
    setLoading(true);
    try {
      const res = await fetch("/api/admin/company/brand/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ companyId, brandId: selectedBrandId }),
      });
      if (res.ok) {
        alert("Merk toegevoegd");
        setOpen(false);
        setSearchQuery("");
        setSelectedBrandId("");
        setBrands([]);
        window.location.reload();
      } else {
        const data = await res.json();
        alert("Fout: " + (data.error || "Toevoegen mislukt"));
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
        + Merk toevoegen
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
          Merk toevoegen
        </h2>

        <div style={{ marginBottom: 16 }}>
          <label style={{ display: "block", fontSize: 13, fontWeight: 600, marginBottom: 6 }}>
            Zoek merk
          </label>
          <div style={{ display: "flex", gap: 8 }}>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleSearch()}
              placeholder="Bijv. Atomic, Salomon..."
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
              Zoeken
            </button>
          </div>
        </div>

        {searched && brands.length > 0 && (
          <div style={{ marginBottom: 16 }}>
            <label style={{ display: "block", fontSize: 13, fontWeight: 600, marginBottom: 6 }}>
              Selecteer merk
            </label>
            <select
              value={selectedBrandId}
              onChange={(e) => setSelectedBrandId(e.target.value)}
              style={{
                width: "100%",
                padding: "10px 14px",
                border: "1px solid var(--border)",
                borderRadius: 8,
                fontSize: 14,
                boxSizing: "border-box",
              }}
            >
              <option value="">— Kies een merk —</option>
              {brands.map((brand) => (
                <option key={brand.id} value={brand.id}>
                  {brand.name}
                </option>
              ))}
            </select>
          </div>
        )}

        {searched && brands.length === 0 && (
          <p style={{ fontSize: 13, color: "var(--ink3)", marginBottom: 16 }}>Geen merken gevonden</p>
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
            Annuleren
          </button>
          <button
            onClick={handleAdd}
            disabled={loading || !selectedBrandId}
            style={{
              flex: 1,
              padding: "10px",
              background: "var(--peak)",
              color: "white",
              border: "none",
              borderRadius: 8,
              cursor: loading || !selectedBrandId ? "not-allowed" : "pointer",
              fontSize: 14,
              fontWeight: 600,
              opacity: loading || !selectedBrandId ? 0.6 : 1,
            }}
          >
            {loading ? "Bezig..." : "Toevoegen"}
          </button>
        </div>
      </div>
    </div>
  );
}
