"use client";

import { useState, useTransition } from "react";
import { saveResortRating, clearResortRating } from "./actions";

interface Props {
  resortId: string;
  initial: {
    terrain: number;
    snow: number;
    lifts: number;
    apres: number;
    family: number;
    value: number;
    scenery: number;
  } | null;
}

const CATEGORIES = [
  { key: "terrain", label: "Terrein & variatie", emoji: "🏔" },
  { key: "snow", label: "Sneeuwkwaliteit", emoji: "❄" },
  { key: "lifts", label: "Liften & wachtrijen", emoji: "🚡" },
  { key: "apres", label: "Après-ski", emoji: "🍺" },
  { key: "family", label: "Familie-vriendelijk", emoji: "👨‍👩‍👧" },
  { key: "value", label: "Prijs-kwaliteit", emoji: "💰" },
  { key: "scenery", label: "Uitzicht & sfeer", emoji: "🎑" },
] as const;

type CategoryKey = typeof CATEGORIES[number]["key"];

const DEFAULT: Record<CategoryKey, number> = {
  terrain: 7, snow: 7, lifts: 7, apres: 7, family: 7, value: 7, scenery: 7,
};

export default function RatingForm({ resortId, initial }: Props) {
  const [scores, setScores] = useState<Record<CategoryKey, number>>(
    initial ?? DEFAULT
  );
  const [saving, startSave] = useTransition();
  const [clearing, startClear] = useTransition();

  const avg = Object.values(scores).reduce((a, b) => a + b, 0) / 7;
  const stars = avg / 2;

  function set(key: CategoryKey, val: number) {
    setScores(s => ({ ...s, [key]: val }));
  }

  function handleSave() {
    startSave(async () => {
      await saveResortRating(resortId, scores);
    });
  }

  function handleClear() {
    if (!confirm("Beoordeling verwijderen?")) return;
    startClear(async () => {
      await clearResortRating(resortId);
    });
  }

  const getColor = (val: number) => {
    if (val >= 8) return "#34d399";
    if (val >= 6) return "#60a5fa";
    if (val >= 4) return "#fbbf24";
    return "#f87171";
  };

  const starStr = (s: number) => {
    const full = Math.floor(s);
    const half = s - full >= 0.5 ? 1 : 0;
    const empty = 5 - full - half;
    return "★".repeat(full) + (half ? "½" : "") + "☆".repeat(empty);
  };

  return (
    <div>
      {/* Overall preview */}
      <div style={{
        background: "linear-gradient(135deg, #0f2a45, #1a3a5c)",
        borderRadius: 12,
        padding: "20px 24px",
        marginBottom: 24,
        display: "flex",
        alignItems: "center",
        gap: 24,
      }}>
        <div>
          <div style={{ fontSize: 11, color: "rgba(255,255,255,.5)", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: 4 }}>Berekende totaalscore</div>
          <div style={{ fontSize: 36, fontWeight: 800, color: "#fbbf24" }}>{stars.toFixed(2)} ★</div>
          <div style={{ fontSize: 13, color: "rgba(255,255,255,.5)" }}>{starStr(stars)} · gemiddeld {avg.toFixed(1)}/10</div>
        </div>
        <div style={{ flex: 1, display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 8 }}>
          {CATEGORIES.map(c => (
            <div key={c.key} style={{ textAlign: "center" }}>
              <div style={{ fontSize: 18, fontWeight: 700, color: getColor(scores[c.key]) }}>{scores[c.key]}</div>
              <div style={{ fontSize: 10, color: "rgba(255,255,255,.4)" }}>{c.emoji}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Category sliders */}
      <div style={{ display: "flex", flexDirection: "column", gap: 16, marginBottom: 28 }}>
        {CATEGORIES.map(c => (
          <div key={c.key} style={{ background: "#1e293b", border: "1px solid #334155", borderRadius: 10, padding: "14px 18px" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
              <label style={{ fontSize: 13, color: "#cbd5e1", display: "flex", alignItems: "center", gap: 6 }}>
                <span>{c.emoji}</span> {c.label}
              </label>
              <span style={{ fontSize: 18, fontWeight: 700, color: getColor(scores[c.key]), minWidth: 28, textAlign: "right" }}>
                {scores[c.key]}
              </span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <span style={{ fontSize: 11, color: "#475569" }}>0</span>
              <input
                type="range"
                min={0}
                max={10}
                step={1}
                value={scores[c.key]}
                onChange={e => set(c.key, parseInt(e.target.value))}
                style={{ flex: 1, accentColor: getColor(scores[c.key]), cursor: "pointer" }}
              />
              <span style={{ fontSize: 11, color: "#475569" }}>10</span>
            </div>
          </div>
        ))}
      </div>

      {/* Actions */}
      <div style={{ display: "flex", gap: 12 }}>
        <button
          onClick={handleSave}
          disabled={saving || clearing}
          style={{
            flex: 1,
            background: saving ? "#0f4d38" : "#0f6e50",
            color: "white",
            border: "none",
            borderRadius: 8,
            padding: "12px 20px",
            fontSize: 14,
            fontWeight: 700,
            cursor: saving ? "not-allowed" : "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 8,
          }}
        >
          {saving ? "⏳ Opslaan..." : "✓ Beoordeling opslaan"}
        </button>
        {initial && (
          <button
            onClick={handleClear}
            disabled={saving || clearing}
            style={{
              background: "transparent",
              color: "#f87171",
              border: "1px solid rgba(248,113,113,.3)",
              borderRadius: 8,
              padding: "12px 18px",
              fontSize: 13,
              cursor: clearing ? "not-allowed" : "pointer",
            }}
          >
            {clearing ? "..." : "Verwijderen"}
          </button>
        )}
      </div>
    </div>
  );
}
