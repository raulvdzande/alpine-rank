"use client";

import { useState, useTransition } from "react";
import { setSnowflakes } from "./actions";

interface Props {
  resortId: string;
  resortName: string;
  currentSnowflakes: number;
  currentNote: string | null;
  currentReport: string | null;
  worldCounts: { sf1: number; sf2: number; sf3: number; total: number };
}

const RUBRIC = {
  1: {
    title: "❄ One Snowflake",
    subtitle: "An exceptional resort that stands out in its category.",
    sections: [
      {
        label: "Piste & snow (on the mountain)",
        items: [
          "Piste grooming: Are pistes groomed daily? No bare patches or exposed edges?",
          "Snow coverage: Is the layer thick enough everywhere for safe skiing (min. 40 cm)?",
          "Snow quality: Consistent, not icy, pleasant to ski?",
          "Marking: All pistes clearly marked, also in poor visibility?",
        ],
      },
      {
        label: "Lifts (tested on-site)",
        items: [
          "Wait times: Acceptable (<20 min) also during busy periods?",
          "Lift condition: Gondolas/chairs clean, maintained and functional?",
          "Flow: Movement through the ski area smooth, without unnecessary detours?",
        ],
      },
      {
        label: "Mountain gastronomy",
        items: [
          "Quality: At least one mountain hut/restaurant that exceeds expectations?",
          "Service: Staff attentive and friendly?",
        ],
      },
      {
        label: "Atmosphere & experience",
        items: [
          "Authenticity: Own, recognisable atmosphere — not generic/standard?",
          "Safety: Mountain staff patrolling regularly? First aid present and visible?",
          "Après-ski: Is there a good après-ski option with atmosphere?",
        ],
      },
    ],
  },
  2: {
    title: "❄❄ Two Snowflakes",
    subtitle: "Worth a special trip to this resort. Every aspect excellent.",
    sections: [
      {
        label: "Piste & snow (on the mountain) — on top of ❄ requirements",
        items: [
          "Daily grooming: Pistes freshly prepared every night, even with little snow?",
          "Off-piste quality: Attractive and accessible terrain outside the pistes?",
          "Snow reliability: Snowmakers present and effectively deployed when needed?",
          "Terrain variety: Diverse range (green/blue/red/black) all excellently maintained?",
        ],
      },
      {
        label: "Lifts (tested on-site) — on top of ❄ requirements",
        items: [
          "Minimal wait: On busy days max 10 minutes at main lifts?",
          "Modernity: Lifts new/recent and comfortable (heated cabins, wind shields)?",
          "Connectivity: Well connected internally — no taxi/bus needed to move between pistes?",
        ],
      },
      {
        label: "Mountain gastronomy — on top of ❄ requirements",
        items: [
          "Multiple quality restaurants: At least 2-3 with distinctive cuisine?",
          "View & decor: At least one with spectacular views and distinctive interior?",
          "Value: Quality worth the price — guests willing to return purely for the food?",
        ],
      },
      {
        label: "Atmosphere & experience — on top of ❄ requirements",
        items: [
          "Unique feature: Something that makes this resort unique — doesn't exist anywhere else?",
          "Village experience: Village centre lively in the evening and worth walking through?",
          "Après-ski: Lively, authentically its own character — not generic?",
          "Hospitality: Do staff remember names? Guest proactively helped?",
        ],
      },
    ],
  },
  3: {
    title: "❄❄❄ Three Snowflakes",
    subtitle: "A unique, unparalleled ski experience. A journey worth taking on its own.",
    sections: [
      {
        label: "Piste & snow (on the mountain) — on top of ❄❄ requirements",
        items: [
          "Immaculate: Pistes every morning as if fresh snow has fallen — even without new snow?",
          "Extreme off-piste: World-class freeride, guides available, safe and spectacular?",
          "Season reliability: Consistently exceptional conditions for the majority of the season?",
          "Exclusive terrain: Pistes or experiences that don't exist anywhere else in the world?",
        ],
      },
      {
        label: "Lifts (tested on-site) — on top of ❄❄ requirements",
        items: [
          "Virtually no wait: Even on peak days <5 min at all main lifts?",
          "World-class technology: Among the most modern in the world (heated seats, wifi)?",
          "Perfect coverage: No part difficult to reach or poorly connected?",
        ],
      },
      {
        label: "Mountain gastronomy — on top of ❄❄ requirements",
        items: [
          "Restaurant level: At least one restaurant competing with Michelin-starred venues in cuisine, wine list and service?",
          "Total dining experience: Lunch on the mountain is itself a reason to visit this resort?",
          "Consistency: Every mountain dining option has quality — not a single disappointment?",
        ],
      },
      {
        label: "Atmosphere & experience — on top of ❄❄ requirements",
        items: [
          "Mythical status: This resort has an aura — feels special from the moment of arrival?",
          "Unparalleled experience: Something at this resort you cannot find anywhere else in the world?",
          "Personalisation: Guests treated as individuals — not as numbers?",
          "World-class après-ski: Among the best you have ever experienced?",
          "Total concept: From arrival to departure every aspect considered and exceptional?",
        ],
      },
    ],
  },
};

export default function SnowflakeForm({ resortId, resortName, currentSnowflakes, currentNote, currentReport, worldCounts }: Props) {
  const [selected, setSelected] = useState<number>(currentSnowflakes);
  const [note, setNote] = useState(currentNote ?? "");
  const [report, setReport] = useState(currentReport ?? "");
  const [confirmName, setConfirmName] = useState("");
  const [confirmCheck1, setConfirmCheck1] = useState(false);
  const [confirmCheck2, setConfirmCheck2] = useState(false);
  const [openRubric, setOpenRubric] = useState<number | null>(null);
  const [error, setError] = useState("");
  const [saving, startSave] = useTransition();

  const isLowering = selected < currentSnowflakes;
  const isThree = selected === 3;
  const noteLen = note.trim().length;
  const reportLen = report.trim().length;

  const canSave =
    (selected === 0 || (noteLen >= 40 && reportLen >= 300)) &&
    (!isLowering || confirmName.trim().length >= 2) &&
    (!isThree || (confirmCheck1 && confirmCheck2 && confirmName.trim().length >= 2));

  function handleSave() {
    setError("");
    startSave(async () => {
      try {
        await setSnowflakes(resortId, selected, note, report);
      } catch (e) {
        setError(e instanceof Error ? e.message : "Something went wrong");
      }
    });
  }

  const tileStyle = (n: number): React.CSSProperties => {
    const isSelected = selected === n;
    const isDisabled = (n === 2 && currentSnowflakes < 1) || (n === 3 && currentSnowflakes < 2);
    return {
      flex: 1,
      minWidth: 80,
      padding: "16px 12px",
      borderRadius: 10,
      border: isSelected ? "2px solid #f59e0b" : "2px solid #334155",
      background: isSelected ? "rgba(245,158,11,.15)" : "#1e293b",
      color: isDisabled ? "#475569" : isSelected ? "#fbbf24" : "#94a3b8",
      cursor: isDisabled ? "not-allowed" : "pointer",
      textAlign: "center",
      fontSize: 13,
      fontWeight: isSelected ? 700 : 400,
      opacity: isDisabled ? 0.5 : 1,
      transition: "all .15s",
      animation: n === 3 && !isDisabled ? "sf-pulse 2.5s ease-in-out infinite" : undefined,
    };
  };

  return (
    <div>
      <div style={{ marginBottom: 20 }}>
        <h2 style={{ fontSize: 16, fontWeight: 700, color: "white", marginBottom: 4 }}>Award PeakFlow Snowflakes</h2>
        <p style={{ fontSize: 13, color: "#64748b" }}>
          Award Snowflakes based on your physical visit to {resortName}. The inspection rubric below helps you determine which level applies.
        </p>
      </div>

      {/* Worldwide distribution */}
      <div style={{ background: "#1e293b", border: "1px solid #334155", borderRadius: 10, padding: "14px 18px", marginBottom: 20 }}>
        <div style={{ fontSize: 11, color: "#64748b", marginBottom: 8, textTransform: "uppercase" as const, letterSpacing: "0.5px" }}>
          Global Snowflake distribution ({worldCounts.total} resorts)
        </div>
        <div style={{ display: "flex", gap: 20, flexWrap: "wrap" }}>
          {[
            { label: "❄", count: worldCounts.sf1, color: "#94a3b8" },
            { label: "❄❄", count: worldCounts.sf2, color: "#f59e0b" },
            { label: "❄❄❄", count: worldCounts.sf3, color: "#fbbf24" },
          ].map(x => (
            <div key={x.label} style={{ fontSize: 13, color: x.color }}>
              <span style={{ fontWeight: 700 }}>{x.label}</span>
              <span style={{ color: "#64748b", marginLeft: 6 }}>{x.count} resorts</span>
            </div>
          ))}
        </div>
      </div>

      {/* Inspection rubric accordion */}
      <div style={{ marginBottom: 20 }}>
        <div style={{ fontSize: 13, color: "#94a3b8", fontWeight: 600, marginBottom: 10 }}>Inspection criteria (to be assessed on-site)</div>
        {([1, 2, 3] as const).map(n => (
          <div key={n} style={{ marginBottom: 6, border: "1px solid #334155", borderRadius: 8, overflow: "hidden" }}>
            <button
              onClick={() => setOpenRubric(openRubric === n ? null : n)}
              style={{ width: "100%", textAlign: "left", background: "#1e293b", border: "none", color: "#94a3b8", padding: "12px 16px", fontSize: 13, cursor: "pointer", display: "flex", justifyContent: "space-between", alignItems: "center" }}
            >
              <span style={{ fontWeight: 600 }}>{RUBRIC[n].title}</span>
              <span style={{ color: "#475569" }}>{openRubric === n ? "▲" : "▼"}</span>
            </button>
            {openRubric === n && (
              <div style={{ padding: "12px 16px 16px", background: "#0f172a" }}>
                <p style={{ fontSize: 12, color: "#64748b", marginBottom: 12, fontStyle: "italic" }}>{RUBRIC[n].subtitle}</p>
                {RUBRIC[n].sections.map(section => (
                  <div key={section.label} style={{ marginBottom: 14 }}>
                    <div style={{ fontSize: 11, fontWeight: 700, color: "#64748b", textTransform: "uppercase" as const, letterSpacing: "0.5px", marginBottom: 6 }}>{section.label}</div>
                    {section.items.map((item, i) => (
                      <div key={i} style={{ fontSize: 12, color: "#94a3b8", padding: "3px 0 3px 12px", borderLeft: "2px solid #334155", marginBottom: 4 }}>
                        {item}
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Tier selector */}
      <div style={{ marginBottom: 20 }}>
        <div style={{ fontSize: 13, color: "#94a3b8", fontWeight: 600, marginBottom: 10 }}>Level to award</div>
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          {[
            { n: 0, label: "None", sub: "No Snowflake" },
            { n: 1, label: "❄", sub: "One Snowflake" },
            { n: 2, label: "❄❄", sub: "Two Snowflakes" },
            { n: 3, label: "❄❄❄", sub: "Three Snowflakes" },
          ].map(({ n, label, sub }) => {
            const isDisabled = (n === 2 && currentSnowflakes < 1) || (n === 3 && currentSnowflakes < 2);
            const tooltip = n === 2 && currentSnowflakes < 1 ? "Requires: resort must already have ❄" :
                           n === 3 && currentSnowflakes < 2 ? "Requires: resort must already have ❄❄" : undefined;
            return (
              <button
                key={n}
                disabled={isDisabled}
                onClick={() => !isDisabled && setSelected(n)}
                title={tooltip}
                style={tileStyle(n)}
              >
                <div style={{ fontSize: n === 0 ? 20 : 22, marginBottom: 4 }}>{label}</div>
                <div style={{ fontSize: 11 }}>{sub}</div>
                {n > 0 && currentSnowflakes < n && (
                  <div style={{ fontSize: 10, marginTop: 4, opacity: 0.6 }}>
                    {n === 2 ? "Requires ❄ first" : "Requires ❄❄ first"}
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Text fields — only if selected > 0 */}
      {selected > 0 && (
        <div style={{ marginBottom: 20 }}>
          {/* Citation */}
          <div style={{ marginBottom: 16 }}>
            <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#94a3b8", marginBottom: 6 }}>
              Public citation <span style={{ color: "#64748b", fontWeight: 400 }}>(visible in banner on resort page)</span>
            </label>
            <input
              type="text"
              value={note}
              onChange={e => setNote(e.target.value)}
              maxLength={150}
              placeholder="One powerful sentence that captures the essence of the inspection..."
              style={{ width: "100%", background: "#1e293b", border: `1px solid ${noteLen < 40 && noteLen > 0 ? "#ef4444" : "#334155"}`, borderRadius: 8, color: "white", padding: "10px 14px", fontSize: 13 }}
            />
            <div style={{ fontSize: 11, color: noteLen < 40 ? "#f87171" : "#64748b", marginTop: 4, textAlign: "right" }}>
              {noteLen} / 40 minimum (max 150)
            </div>
          </div>

          {/* Full report */}
          <div>
            <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#94a3b8", marginBottom: 6 }}>
              Full inspection report <span style={{ color: "#64748b", fontWeight: 400 }}>(visible to resort and all visitors)</span>
            </label>
            <textarea
              value={report}
              onChange={e => setReport(e.target.value)}
              placeholder="Write a comprehensive report of your visit. Describe what you experienced per category: piste & snow, lifts, gastronomy, atmosphere. State what was excellent, what set this resort apart, and why you award this level (or not yet). This report is fully visible to the resort and all visitors."
              rows={10}
              style={{ width: "100%", background: "#1e293b", border: `1px solid ${reportLen < 300 && reportLen > 0 ? "#ef4444" : "#334155"}`, borderRadius: 8, color: "white", padding: "12px 14px", fontSize: 13, resize: "vertical", minHeight: 220 }}
            />
            <div style={{ fontSize: 11, color: reportLen < 300 ? "#f87171" : "#64748b", marginTop: 4, textAlign: "right" }}>
              {reportLen} / 300 minimum required
            </div>
          </div>
        </div>
      )}

      {/* Downgrade confirmation */}
      {isLowering && (
        <div style={{ background: "rgba(239,68,68,.1)", border: "1px solid rgba(239,68,68,.3)", borderRadius: 10, padding: "16px 18px", marginBottom: 16 }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: "#f87171", marginBottom: 10 }}>
            ⚠ You are lowering this resort from {currentSnowflakes} to {selected} Snowflake(s). Type the name of the resort to confirm:
          </div>
          <input
            type="text"
            value={confirmName}
            onChange={e => setConfirmName(e.target.value)}
            placeholder={resortName}
            style={{ width: "100%", background: "#0f172a", border: "1px solid rgba(239,68,68,.4)", borderRadius: 8, color: "white", padding: "8px 12px", fontSize: 13 }}
          />
        </div>
      )}

      {/* 3-Snowflake extra confirmation */}
      {isThree && !isLowering && (
        <div style={{ background: "rgba(245,158,11,.08)", border: "1px solid rgba(245,158,11,.3)", borderRadius: 10, padding: "16px 18px", marginBottom: 16 }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: "#fbbf24", marginBottom: 12 }}>
            ❄❄❄ Three Snowflakes is the highest distinction. Confirm your verdict:
          </div>
          <label style={{ display: "flex", gap: 10, alignItems: "flex-start", marginBottom: 10, cursor: "pointer", fontSize: 13, color: "#94a3b8" }}>
            <input type="checkbox" checked={confirmCheck1} onChange={e => setConfirmCheck1(e.target.checked)} style={{ marginTop: 2 }} />
            I confirm that this resort scores excellent in all categories and has zero weak points
          </label>
          <label style={{ display: "flex", gap: 10, alignItems: "flex-start", marginBottom: 12, cursor: "pointer", fontSize: 13, color: "#94a3b8" }}>
            <input type="checkbox" checked={confirmCheck2} onChange={e => setConfirmCheck2(e.target.checked)} style={{ marginTop: 2 }} />
            I confirm that this resort offers an unparalleled experience that exists nowhere else in the world
          </label>
          <div style={{ fontSize: 12, color: "#64748b", marginBottom: 8 }}>Type the name of the resort to confirm:</div>
          <input
            type="text"
            value={confirmName}
            onChange={e => setConfirmName(e.target.value)}
            placeholder={resortName}
            style={{ width: "100%", background: "#0f172a", border: "1px solid rgba(245,158,11,.3)", borderRadius: 8, color: "white", padding: "8px 12px", fontSize: 13 }}
          />
        </div>
      )}

      {error && (
        <div style={{ background: "rgba(239,68,68,.1)", border: "1px solid rgba(239,68,68,.3)", borderRadius: 8, padding: "10px 14px", marginBottom: 12, color: "#f87171", fontSize: 13 }}>
          ✗ {error}
        </div>
      )}

      <button
        onClick={handleSave}
        disabled={!canSave || saving}
        style={{
          width: "100%",
          padding: "12px 20px",
          borderRadius: 10,
          border: "none",
          background: canSave ? "linear-gradient(135deg,#d97706,#f59e0b)" : "#334155",
          color: canSave ? "white" : "#64748b",
          fontSize: 14,
          fontWeight: 700,
          cursor: canSave ? "pointer" : "not-allowed",
          opacity: saving ? 0.7 : 1,
          letterSpacing: "0.3px",
        }}
      >
        {saving ? "⏳ Saving..." : selected === 0 ? "Remove snowflakes" : `❄${"❄".repeat(selected - 1)} Award ${selected} Snowflake${selected > 1 ? "s" : ""}`}
      </button>

      {currentSnowflakes > 0 && (
        <div style={{ marginTop: 12, fontSize: 12, color: "#64748b", textAlign: "center" }}>
          Current status: {currentSnowflakes} Snowflake{currentSnowflakes > 1 ? "s" : ""} · Awarded on {new Date().toLocaleDateString("en-GB")}
        </div>
      )}
    </div>
  );
}
