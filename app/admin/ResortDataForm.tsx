"use client";

import { useState } from "react";
import type { ResortFormData } from "./actions";

interface Props {
  initial?: Partial<ResortFormData>;
  onSubmit: (data: ResortFormData) => Promise<void>;
  submitLabel: string;
  onDelete?: () => Promise<void>;
}

const COUNTRIES = [
  "Austria", "France", "Switzerland", "Italy", "Germany",
  "Norway", "Sweden", "Finland", "Spain", "Andorra",
  "Slovenia", "Bulgaria", "Romania", "Slovakia", "Poland",
  "United Kingdom", "Scotland", "Other",
];

const CATEGORIES = [
  "Alpine", "Nordic", "Freestyle", "Freeride", "Family", "Recreational",
];

const inputStyle: React.CSSProperties = {
  width: "100%",
  background: "#0f172a",
  border: "1px solid #334155",
  borderRadius: 8,
  color: "white",
  padding: "9px 12px",
  fontSize: 14,
  outline: "none",
  boxSizing: "border-box",
};

const labelStyle: React.CSSProperties = {
  display: "block",
  fontSize: 12,
  fontWeight: 600,
  color: "#94a3b8",
  marginBottom: 5,
  textTransform: "uppercase",
  letterSpacing: "0.4px",
};

const sectionStyle: React.CSSProperties = {
  background: "#1e293b",
  border: "1px solid #334155",
  borderRadius: 12,
  padding: "20px 24px",
  marginBottom: 20,
};

const sectionTitle: React.CSSProperties = {
  fontSize: 14,
  fontWeight: 700,
  color: "white",
  marginBottom: 16,
  paddingBottom: 12,
  borderBottom: "1px solid #334155",
};

const gridTwo: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "1fr 1fr",
  gap: "14px 20px",
};

const gridThree: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "1fr 1fr 1fr",
  gap: "14px 20px",
};

export default function ResortDataForm({ initial = {}, onSubmit, submitLabel, onDelete }: Props) {
  const [loading, setLoading] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const [form, setForm] = useState<ResortFormData>({
    name:         initial.name         ?? "",
    Country:      initial.Country      ?? "Austria",
    region:       initial.region       ?? "",
    altitudeTop:  initial.altitudeTop  ?? "",
    altitudeBase: initial.altitudeBase ?? "",
    pisteKm:      initial.pisteKm      ?? "",
    pisteBlue:    initial.pisteBlue    ?? "",
    pisteRed:     initial.pisteRed     ?? "",
    pisteBlack:   initial.pisteBlack   ?? "",
    pisteGreen:   initial.pisteGreen   ?? "",
    lifts:        initial.lifts        ?? "",
    dayPassPrice: initial.dayPassPrice ?? "",
    lat:          initial.lat          ?? "",
    lon:          initial.lon          ?? "",
    snowpark:     initial.snowpark     ?? "false",
    website:      initial.website      ?? "",
    category:     initial.category     ?? "",
  });

  function set(key: keyof ResortFormData, value: string) {
    setForm(f => ({ ...f, [key]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await onSubmit(form);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Unknown error");
      setLoading(false);
    }
  }

  async function handleDelete() {
    if (!onDelete) return;
    setDeleting(true);
    try {
      await onDelete();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Error deleting");
      setDeleting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      {/* Basis */}
      <div style={sectionStyle}>
        <div style={sectionTitle}>Basic information</div>
        <div style={{ ...gridTwo, marginBottom: 14 }}>
          <div>
            <label style={labelStyle}>Name *</label>
            <input style={inputStyle} value={form.name} onChange={e => set("name", e.target.value)} required placeholder="e.g. Kitzbühel" />
          </div>
          <div>
            <label style={labelStyle}>Country *</label>
            <select style={{ ...inputStyle, cursor: "pointer" }} value={form.Country} onChange={e => set("Country", e.target.value)}>
              {COUNTRIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
        </div>
        <div style={gridTwo}>
          <div>
            <label style={labelStyle}>Region / Resort area</label>
            <input style={inputStyle} value={form.region} onChange={e => set("region", e.target.value)} placeholder="e.g. Tyrol" />
          </div>
          <div>
            <label style={labelStyle}>Category</label>
            <select style={{ ...inputStyle, cursor: "pointer" }} value={form.category} onChange={e => set("category", e.target.value)}>
              <option value="">— choose category —</option>
              {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
        </div>
      </div>

      {/* Altitude */}
      <div style={sectionStyle}>
        <div style={sectionTitle}>Altitude (metres above sea level)</div>
        <div style={gridTwo}>
          <div>
            <label style={labelStyle}>Summit (m)</label>
            <input style={inputStyle} type="number" value={form.altitudeTop} onChange={e => set("altitudeTop", e.target.value)} placeholder="e.g. 2800" min="100" max="5000" />
          </div>
          <div>
            <label style={labelStyle}>Base station (m)</label>
            <input style={inputStyle} type="number" value={form.altitudeBase} onChange={e => set("altitudeBase", e.target.value)} placeholder="e.g. 800" min="0" max="4000" />
          </div>
        </div>
      </div>

      {/* Pistes */}
      <div style={sectionStyle}>
        <div style={sectionTitle}>Pistes</div>
        <div style={{ marginBottom: 14 }}>
          <label style={labelStyle}>Total piste km</label>
          <input style={{ ...inputStyle, maxWidth: 200 }} type="number" value={form.pisteKm} onChange={e => set("pisteKm", e.target.value)} placeholder="e.g. 170" min="0" />
        </div>
        <div style={gridThree}>
          <div>
            <label style={labelStyle}>🔵 Blue (km)</label>
            <input style={inputStyle} type="number" value={form.pisteBlue} onChange={e => set("pisteBlue", e.target.value)} placeholder="e.g. 60" min="0" />
          </div>
          <div>
            <label style={labelStyle}>🔴 Red (km)</label>
            <input style={inputStyle} type="number" value={form.pisteRed} onChange={e => set("pisteRed", e.target.value)} placeholder="e.g. 80" min="0" />
          </div>
          <div>
            <label style={labelStyle}>⚫ Black (km)</label>
            <input style={inputStyle} type="number" value={form.pisteBlack} onChange={e => set("pisteBlack", e.target.value)} placeholder="e.g. 30" min="0" />
          </div>
        </div>
        <div style={{ marginTop: 14 }}>
          <label style={labelStyle}>🟢 Green (km)</label>
          <input style={{ ...inputStyle, maxWidth: 200 }} type="number" value={form.pisteGreen} onChange={e => set("pisteGreen", e.target.value)} placeholder="e.g. 10" min="0" />
        </div>
      </div>

      {/* Facilities */}
      <div style={sectionStyle}>
        <div style={sectionTitle}>Facilities and price</div>
        <div style={gridThree}>
          <div>
            <label style={labelStyle}>Number of lifts</label>
            <input style={inputStyle} type="number" value={form.lifts} onChange={e => set("lifts", e.target.value)} placeholder="e.g. 45" min="0" />
          </div>
          <div>
            <label style={labelStyle}>Adult day pass (€)</label>
            <input style={inputStyle} type="number" value={form.dayPassPrice} onChange={e => set("dayPassPrice", e.target.value)} placeholder="e.g. 58" min="0" />
          </div>
          <div>
            <label style={labelStyle}>Snow park</label>
            <select style={{ ...inputStyle, cursor: "pointer" }} value={form.snowpark} onChange={e => set("snowpark", e.target.value)}>
              <option value="false">No</option>
              <option value="true">Yes</option>
            </select>
          </div>
        </div>
        <div style={{ marginTop: 14 }}>
          <label style={labelStyle}>Website</label>
          <input style={inputStyle} type="url" value={form.website} onChange={e => set("website", e.target.value)} placeholder="https://www.resort.com" />
        </div>
      </div>

      {/* GPS */}
      <div style={sectionStyle}>
        <div style={sectionTitle}>GPS coordinates (for snow score and map)</div>
        <p style={{ fontSize: 12, color: "#64748b", marginBottom: 14, marginTop: -8 }}>
          Find the resort on <strong style={{ color: "#94a3b8" }}>openstreetmap.org</strong>, click the location and copy the coordinates. Or use Google Maps: right-click → coordinates.
        </p>
        <div style={gridTwo}>
          <div>
            <label style={labelStyle}>Latitude (lat)</label>
            <input style={inputStyle} type="number" step="0.000001" value={form.lat} onChange={e => set("lat", e.target.value)} placeholder="e.g. 47.4444" min="-90" max="90" />
          </div>
          <div>
            <label style={labelStyle}>Longitude (lon)</label>
            <input style={inputStyle} type="number" step="0.000001" value={form.lon} onChange={e => set("lon", e.target.value)} placeholder="e.g. 12.3911" min="-180" max="180" />
          </div>
        </div>
        <div style={{ marginTop: 12, padding: "10px 14px", background: "rgba(96,165,250,.07)", border: "1px solid rgba(96,165,250,.15)", borderRadius: 8, fontSize: 12, color: "#93c5fd" }}>
          ℹ️ The snow certainty score is calculated automatically after saving. With coordinates, 10 years of Open-Meteo historical data are included (stronger score).
        </div>
      </div>

      {error && (
        <div style={{ background: "rgba(248,113,113,.1)", border: "1px solid rgba(248,113,113,.3)", borderRadius: 8, padding: "12px 16px", marginBottom: 16, fontSize: 13, color: "#f87171" }}>
          ❌ {error}
        </div>
      )}

      <div style={{ display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap" }}>
        <button
          type="submit"
          disabled={loading}
          style={{ background: loading ? "#1e293b" : "#0f6e50", color: loading ? "#64748b" : "white", border: "none", borderRadius: 8, padding: "11px 28px", fontSize: 14, fontWeight: 700, cursor: loading ? "not-allowed" : "pointer" }}
        >
          {loading ? "Saving..." : submitLabel}
        </button>

        {onDelete && !confirmDelete && (
          <button
            type="button"
            onClick={() => setConfirmDelete(true)}
            style={{ background: "transparent", color: "#f87171", border: "1px solid rgba(248,113,113,.3)", borderRadius: 8, padding: "10px 18px", fontSize: 13, fontWeight: 600, cursor: "pointer" }}
          >
            Delete resort
          </button>
        )}

        {onDelete && confirmDelete && (
          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <span style={{ fontSize: 13, color: "#f87171" }}>Are you sure?</span>
            <button
              type="button"
              onClick={handleDelete}
              disabled={deleting}
              style={{ background: "#7f1d1d", color: "white", border: "none", borderRadius: 8, padding: "8px 16px", fontSize: 13, fontWeight: 700, cursor: "pointer" }}
            >
              {deleting ? "Deleting..." : "Yes, delete"}
            </button>
            <button
              type="button"
              onClick={() => setConfirmDelete(false)}
              style={{ background: "#1e293b", color: "#94a3b8", border: "1px solid #334155", borderRadius: 8, padding: "8px 14px", fontSize: 13, cursor: "pointer" }}
            >
              Cancel
            </button>
          </div>
        )}
      </div>
    </form>
  );
}
