"use client";

import { useState, useTransition } from "react";
import { submitReview, deleteReview, type ReviewData } from "./actions";

interface Props {
  resortId: string;
  resortName: string;
  existing: ReviewData | null;
}

const CATEGORIES: { key: keyof ReviewData; label: string; emoji: string; desc: string }[] = [
  { key: "terrain", label: "Terrein & variatie", emoji: "🏔", desc: "Diversiteit, uitdaging, off-piste" },
  { key: "snow", label: "Sneeuwkwaliteit", emoji: "❄", desc: "Dikte, poeder, conditie" },
  { key: "lifts", label: "Liften & wachtrijen", emoji: "🚡", desc: "Capaciteit, snelheid, comfort" },
  { key: "apres", label: "Après-ski", emoji: "🍺", desc: "Bars, restaurants, sfeer" },
  { key: "family", label: "Familie-vriendelijk", emoji: "👨‍👩‍👧", desc: "Kinderpistes, kinderopvang, veiligheid" },
  { key: "value", label: "Prijs-kwaliteit", emoji: "💰", desc: "Dagkaart, ski-verhuur, eten" },
  { key: "scenery", label: "Uitzicht & sfeer", emoji: "🎑", desc: "Landschap, dorpssfeer, charme" },
];

const DEFAULT: ReviewData = { terrain: 7, snow: 7, lifts: 7, apres: 7, family: 7, value: 7, scenery: 7 };

const LABELS = ["", "Slecht", "Matig", "Redelijk", "Goed", "Goed", "Prima", "Goed", "Uitstekend", "Top", "Perfect"];

function getColor(val: number): string {
  if (val >= 8) return "#22c55e";
  if (val >= 6) return "#3b82f6";
  if (val >= 4) return "#f59e0b";
  return "#ef4444";
}

export default function ReviewForm({ resortId, resortName, existing }: Props) {
  const [open, setOpen] = useState(false);
  const [scores, setScores] = useState<ReviewData>(existing ?? DEFAULT);
  const [saving, startSave] = useTransition();
  const [deleting, startDelete] = useTransition();

  const avg = (Object.values(scores) as number[]).reduce((a, b) => a + b, 0) / 7;
  const stars = avg / 2;

  function set(key: keyof ReviewData, val: number) {
    setScores(s => ({ ...s, [key]: val }));
  }

  function handleSave() {
    startSave(async () => { await submitReview(resortId, scores); });
  }

  function handleDelete() {
    if (!confirm("Weet je zeker dat je je review wilt verwijderen?")) return;
    startDelete(async () => { await deleteReview(resortId); });
  }

  const starDisplay = (s: number) => {
    const full = Math.floor(s);
    const half = s - full >= 0.25 ? (s - full >= 0.75 ? 1 : 0.5) : 0;
    return { full, half: half === 0.5, extra: half === 1 ? 1 : 0, empty: 5 - full - (half === 0.5 ? 1 : 0) - (half === 1 ? 1 : 0) };
  };

  const s = starDisplay(stars);

  if (!open) {
    return (
      <div style={{ border: "2px dashed var(--border)", borderRadius: "var(--r-lg)", padding: 24, textAlign: "center" }}>
        {existing ? (
          <>
            <div style={{ fontSize: 20, marginBottom: 8 }}>✏️</div>
            <div style={{ fontSize: 15, fontWeight: 600, marginBottom: 4 }}>Je hebt al een review geschreven</div>
            <div style={{ fontSize: 13, color: "var(--ink3)", marginBottom: 16 }}>
              Jouw score: {(avg / 2).toFixed(1)} / 5 sterren
            </div>
            <button onClick={() => setOpen(true)} className="btn btn-outline" style={{ fontSize: 13, marginRight: 8 }}>
              ✏️ Bewerk review
            </button>
            <button onClick={handleDelete} disabled={deleting} style={{ fontSize: 13, color: "#ef4444", background: "transparent", border: "1px solid rgba(239,68,68,.3)", borderRadius: "var(--r)", padding: "7px 16px", cursor: "pointer" }}>
              {deleting ? "..." : "Verwijderen"}
            </button>
          </>
        ) : (
          <>
            <div style={{ fontSize: 24, marginBottom: 8 }}>⭐</div>
            <div style={{ fontSize: 15, fontWeight: 600, marginBottom: 4 }}>Geef jouw mening over {resortName}</div>
            <div style={{ fontSize: 13, color: "var(--ink3)", marginBottom: 16 }}>Help andere skiërs met jouw eerlijke beoordeling</div>
            <button onClick={() => setOpen(true)} className="btn btn-primary">
              Review schrijven →
            </button>
          </>
        )}
      </div>
    );
  }

  return (
    <div style={{ border: "1px solid var(--border)", borderRadius: "var(--r-lg)", overflow: "hidden" }}>
      {/* Header */}
      <div style={{ background: "linear-gradient(135deg, var(--peak-dark), #1a3a5c)", padding: "20px 24px", color: "white" }}>
        <div style={{ fontSize: 13, color: "rgba(255,255,255,.6)", marginBottom: 4 }}>
          {existing ? "Jouw review bewerken" : "Jouw review voor"} {resortName}
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div>
            <span style={{ fontSize: 32, fontWeight: 800, color: "#fbbf24" }}>{stars.toFixed(1)}</span>
            <span style={{ color: "#fbbf24", fontSize: 20, marginLeft: 4 }}>
              {"★".repeat(s.full)}{s.half ? "½" : ""}{s.extra ? "★" : ""}{"☆".repeat(Math.max(0, s.empty))}
            </span>
          </div>
          <div style={{ fontSize: 12, color: "rgba(255,255,255,.5)" }}>gemiddeld {avg.toFixed(1)}/10</div>
        </div>
      </div>

      {/* Sliders */}
      <div style={{ padding: 24, background: "white" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 24 }}>
          {CATEGORIES.map(c => (
            <div key={c.key} style={{ background: "#f8fafc", borderRadius: 10, padding: "14px 16px", border: "1px solid var(--border)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10 }}>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 600, display: "flex", alignItems: "center", gap: 5 }}>
                    <span>{c.emoji}</span> {c.label}
                  </div>
                  <div style={{ fontSize: 11, color: "var(--ink3)", marginTop: 2 }}>{c.desc}</div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <span style={{ fontSize: 20, fontWeight: 700, color: getColor(scores[c.key]) }}>{scores[c.key]}</span>
                  <div style={{ fontSize: 10, color: "var(--ink3)" }}>{LABELS[scores[c.key]]}</div>
                </div>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ fontSize: 10, color: "var(--ink3)" }}>0</span>
                <input
                  type="range"
                  min={0}
                  max={10}
                  step={1}
                  value={scores[c.key]}
                  onChange={e => set(c.key, parseInt(e.target.value))}
                  style={{ flex: 1, accentColor: getColor(scores[c.key]), cursor: "pointer", height: 4 }}
                />
                <span style={{ fontSize: 10, color: "var(--ink3)" }}>10</span>
              </div>
              <div style={{ marginTop: 6, height: 4, background: "#e2e8f0", borderRadius: 2 }}>
                <div style={{ height: "100%", width: `${scores[c.key] * 10}%`, background: getColor(scores[c.key]), borderRadius: 2, transition: "width .15s" }} />
              </div>
            </div>
          ))}
        </div>

        {/* Score summary */}
        <div style={{ background: "var(--snow)", borderRadius: "var(--r)", padding: "14px 18px", marginBottom: 20, display: "flex", alignItems: "center", gap: 16 }}>
          <div>
            <div style={{ fontSize: 11, color: "var(--ink3)", marginBottom: 2 }}>Jouw totaalscore</div>
            <div style={{ fontSize: 24, fontWeight: 700, color: avg >= 8 ? "#22c55e" : avg >= 6 ? "var(--peak-dark)" : "#f59e0b" }}>
              {stars.toFixed(2)} / 5 ★
            </div>
          </div>
          <div style={{ flex: 1, display: "grid", gridTemplateColumns: "repeat(7,1fr)", gap: 4 }}>
            {CATEGORIES.map(c => (
              <div key={c.key} style={{ textAlign: "center" }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: getColor(scores[c.key]) }}>{scores[c.key]}</div>
                <div style={{ fontSize: 9, color: "var(--ink3)" }}>{c.emoji}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Buttons */}
        <div style={{ display: "flex", gap: 10 }}>
          <button
            onClick={handleSave}
            disabled={saving || deleting}
            className="btn btn-primary btn-lg"
            style={{ flex: 1, justifyContent: "center", opacity: saving ? 0.7 : 1 }}
          >
            {saving ? "⏳ Opslaan..." : existing ? "✓ Review bijwerken" : "✓ Review plaatsen"}
          </button>
          <button onClick={() => setOpen(false)} className="btn btn-ghost" style={{ fontSize: 13 }}>
            Annuleren
          </button>
        </div>
        <p style={{ fontSize: 11, color: "var(--ink3)", marginTop: 12, textAlign: "center" }}>
          Jouw review wordt gepubliceerd als officiële PeakFlow beoordeling en telt mee in de totaalscore.
        </p>
      </div>
    </div>
  );
}
