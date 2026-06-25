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
  "Alpin", "Nordisch", "Freestyle", "Freeride", "Familie", "Recreatief",
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
      setError(err instanceof Error ? err.message : "Onbekende fout");
      setLoading(false);
    }
  }

  async function handleDelete() {
    if (!onDelete) return;
    setDeleting(true);
    try {
      await onDelete();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Fout bij verwijderen");
      setDeleting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      {/* Basis */}
      <div style={sectionStyle}>
        <div style={sectionTitle}>Basisinformatie</div>
        <div style={{ ...gridTwo, marginBottom: 14 }}>
          <div>
            <label style={labelStyle}>Naam *</label>
            <input style={inputStyle} value={form.name} onChange={e => set("name", e.target.value)} required placeholder="bijv. Kitzbühel" />
          </div>
          <div>
            <label style={labelStyle}>Land *</label>
            <select style={{ ...inputStyle, cursor: "pointer" }} value={form.Country} onChange={e => set("Country", e.target.value)}>
              {COUNTRIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
        </div>
        <div style={gridTwo}>
          <div>
            <label style={labelStyle}>Regio / Skigebied</label>
            <input style={inputStyle} value={form.region} onChange={e => set("region", e.target.value)} placeholder="bijv. Tirol" />
          </div>
          <div>
            <label style={labelStyle}>Categorie</label>
            <select style={{ ...inputStyle, cursor: "pointer" }} value={form.category} onChange={e => set("category", e.target.value)}>
              <option value="">— kies categorie —</option>
              {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
        </div>
      </div>

      {/* Hoogte */}
      <div style={sectionStyle}>
        <div style={sectionTitle}>Hoogte (meter boven zeeniveau)</div>
        <div style={gridTwo}>
          <div>
            <label style={labelStyle}>Bergtop (m)</label>
            <input style={inputStyle} type="number" value={form.altitudeTop} onChange={e => set("altitudeTop", e.target.value)} placeholder="bijv. 2800" min="100" max="5000" />
          </div>
          <div>
            <label style={labelStyle}>Basisstation (m)</label>
            <input style={inputStyle} type="number" value={form.altitudeBase} onChange={e => set("altitudeBase", e.target.value)} placeholder="bijv. 800" min="0" max="4000" />
          </div>
        </div>
      </div>

      {/* Pistes */}
      <div style={sectionStyle}>
        <div style={sectionTitle}>Pistes</div>
        <div style={{ marginBottom: 14 }}>
          <label style={labelStyle}>Totale pistekm</label>
          <input style={{ ...inputStyle, maxWidth: 200 }} type="number" value={form.pisteKm} onChange={e => set("pisteKm", e.target.value)} placeholder="bijv. 170" min="0" />
        </div>
        <div style={gridThree}>
          <div>
            <label style={labelStyle}>🔵 Blauw (km)</label>
            <input style={inputStyle} type="number" value={form.pisteBlue} onChange={e => set("pisteBlue", e.target.value)} placeholder="bijv. 60" min="0" />
          </div>
          <div>
            <label style={labelStyle}>🔴 Rood (km)</label>
            <input style={inputStyle} type="number" value={form.pisteRed} onChange={e => set("pisteRed", e.target.value)} placeholder="bijv. 80" min="0" />
          </div>
          <div>
            <label style={labelStyle}>⚫ Zwart (km)</label>
            <input style={inputStyle} type="number" value={form.pisteBlack} onChange={e => set("pisteBlack", e.target.value)} placeholder="bijv. 30" min="0" />
          </div>
        </div>
        <div style={{ marginTop: 14 }}>
          <label style={labelStyle}>🟢 Groen (km)</label>
          <input style={{ ...inputStyle, maxWidth: 200 }} type="number" value={form.pisteGreen} onChange={e => set("pisteGreen", e.target.value)} placeholder="bijv. 10" min="0" />
        </div>
      </div>

      {/* Faciliteiten */}
      <div style={sectionStyle}>
        <div style={sectionTitle}>Faciliteiten en prijs</div>
        <div style={gridThree}>
          <div>
            <label style={labelStyle}>Aantal liften</label>
            <input style={inputStyle} type="number" value={form.lifts} onChange={e => set("lifts", e.target.value)} placeholder="bijv. 45" min="0" />
          </div>
          <div>
            <label style={labelStyle}>Dagkaart volwassene (€)</label>
            <input style={inputStyle} type="number" value={form.dayPassPrice} onChange={e => set("dayPassPrice", e.target.value)} placeholder="bijv. 58" min="0" />
          </div>
          <div>
            <label style={labelStyle}>Snowpark</label>
            <select style={{ ...inputStyle, cursor: "pointer" }} value={form.snowpark} onChange={e => set("snowpark", e.target.value)}>
              <option value="false">Nee</option>
              <option value="true">Ja</option>
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
        <div style={sectionTitle}>GPS-coördinaten (voor sneeuwscore en kaart)</div>
        <p style={{ fontSize: 12, color: "#64748b", marginBottom: 14, marginTop: -8 }}>
          Zoek het resort op <strong style={{ color: "#94a3b8" }}>openstreetmap.org</strong>, klik op de locatie en kopieer de coördinaten. Of gebruik Google Maps: rechtsklik → coördinaten.
        </p>
        <div style={gridTwo}>
          <div>
            <label style={labelStyle}>Breedtegraad (lat)</label>
            <input style={inputStyle} type="number" step="0.000001" value={form.lat} onChange={e => set("lat", e.target.value)} placeholder="bijv. 47.4444" min="-90" max="90" />
          </div>
          <div>
            <label style={labelStyle}>Lengtegraad (lon)</label>
            <input style={inputStyle} type="number" step="0.000001" value={form.lon} onChange={e => set("lon", e.target.value)} placeholder="bijv. 12.3911" min="-180" max="180" />
          </div>
        </div>
        <div style={{ marginTop: 12, padding: "10px 14px", background: "rgba(96,165,250,.07)", border: "1px solid rgba(96,165,250,.15)", borderRadius: 8, fontSize: 12, color: "#93c5fd" }}>
          ℹ️ De sneeuwzekerheids-score wordt automatisch berekend na opslaan. Met coördinaten worden 10 jaar Open-Meteo historische data meegenomen (sterkere score).
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
          {loading ? "Bezig..." : submitLabel}
        </button>

        {onDelete && !confirmDelete && (
          <button
            type="button"
            onClick={() => setConfirmDelete(true)}
            style={{ background: "transparent", color: "#f87171", border: "1px solid rgba(248,113,113,.3)", borderRadius: 8, padding: "10px 18px", fontSize: 13, fontWeight: 600, cursor: "pointer" }}
          >
            Resort verwijderen
          </button>
        )}

        {onDelete && confirmDelete && (
          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <span style={{ fontSize: 13, color: "#f87171" }}>Weet je het zeker?</span>
            <button
              type="button"
              onClick={handleDelete}
              disabled={deleting}
              style={{ background: "#7f1d1d", color: "white", border: "none", borderRadius: 8, padding: "8px 16px", fontSize: 13, fontWeight: 700, cursor: "pointer" }}
            >
              {deleting ? "Verwijderen..." : "Ja, verwijder"}
            </button>
            <button
              type="button"
              onClick={() => setConfirmDelete(false)}
              style={{ background: "#1e293b", color: "#94a3b8", border: "1px solid #334155", borderRadius: 8, padding: "8px 14px", fontSize: 13, cursor: "pointer" }}
            >
              Annuleer
            </button>
          </div>
        )}
      </div>
    </form>
  );
}
