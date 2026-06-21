"use client";

import Link from "next/link";
import { useState, useTransition } from "react";
import { findMatches, type MatchResult } from "./actions";

export default function MatcherPage() {
  const [state, setState] = useState<"idle" | "loading" | "done">("idle");
  const [results, setResults] = useState<MatchResult[]>([]);
  const [, startTransition] = useTransition();

  const [level, setLevel] = useState("gevorderd");
  const [budget, setBudget] = useState("mid");
  const [region, setRegion] = useState("fr");
  const [priority, setPriority] = useState("value");

  function runMatcher() {
    setState("loading");
    startTransition(async () => {
      const r = await findMatches({ level, budget, region, priority });
      // small delay so the "Analyseren..." state is visible
      setTimeout(() => {
        setResults(r);
        setState("done");
      }, 900);
    });
  }

  return (
    <section className="ai-section" style={{ minHeight: "calc(100vh - 60px)", display: "flex", alignItems: "center" }}>
      <div className="container" style={{ width: "100%" }}>
        <div style={{ maxWidth: 680, margin: "0 auto" }}>
          <span className="label" style={{ textAlign: "center", display: "block" }}>AI Resort Matcher</span>
          <h2 style={{ textAlign: "center", marginBottom: 8 }}>Vertel ons wat je zoekt</h2>
          <p style={{ textAlign: "center", marginBottom: 0 }}>Wij vinden jouw perfecte skigebied in 10 seconden.</p>
          <div className="ai-widget">
            <span className="ai-label">✨ PeakFlow AI — Powered by Claude</span>
            <div className="ai-title">Wat zoek jij dit seizoen?</div>
            <div className="ai-inputs">
              <div className="ai-input-group">
                <label>Jouw ski-niveau</label>
                <select value={level} onChange={(e) => setLevel(e.target.value)}>
                  <option value="beginner">🟢 Beginner (1-2 jaar)</option>
                  <option value="gevorderd">🔵 Gevorderd (3-6 jaar)</option>
                  <option value="expert">🔴 Expert (7+ jaar)</option>
                  <option value="freeride">⚫ Freeride / off-piste</option>
                </select>
              </div>
              <div className="ai-input-group">
                <label>Budget per dag (dagkaart)</label>
                <select value={budget} onChange={(e) => setBudget(e.target.value)}>
                  <option value="low">🟢 Onder €40</option>
                  <option value="mid">🔵 €40–€65</option>
                  <option value="high">🔴 €65–€90</option>
                  <option value="any">⚫ Budget geen issue</option>
                </select>
              </div>
              <div className="ai-input-group">
                <label>Regio voorkeur</label>
                <select value={region} onChange={(e) => setRegion(e.target.value)}>
                  <option value="all">Hele Alpen</option>
                  <option value="at">Oostenrijk</option>
                  <option value="fr">Frankrijk</option>
                  <option value="ch">Zwitserland</option>
                  <option value="it">Italië</option>
                  <option value="sc">Scandinavië</option>
                </select>
              </div>
              <div className="ai-input-group">
                <label>Prioriteit</label>
                <select value={priority} onChange={(e) => setPriority(e.target.value)}>
                  <option value="snow">Sneeuwkwaliteit</option>
                  <option value="km">Pistekm</option>
                  <option value="value">Prijs-kwaliteit</option>
                  <option value="apres">Apres-ski</option>
                  <option value="family">Familie-vriendelijk</option>
                </select>
              </div>
            </div>
            <button
              className="btn btn-primary btn-lg"
              style={{ width: "100%", justifyContent: "center", background: state === "done" ? "#0f6e50" : undefined }}
              onClick={runMatcher}
              disabled={state === "loading"}
            >
              {state === "idle" && "🤖 Vind mijn perfecte resort →"}
              {state === "loading" && "🤖 Analyseren..."}
              {state === "done" && "✓ Klaar — zie jouw top 5 resorts"}
            </button>

            {state === "done" && (
              <div className="ai-results">
                <div className="ai-result-label">
                  <span>✓</span>
                  <span>Top aanbevelingen voor jou</span>
                </div>
                {results.length === 0 && (
                  <p style={{ fontSize: 13, color: "rgba(255,255,255,.6)", padding: "8px 0" }}>Geen resorts gevonden — probeer een ander filter.</p>
                )}
                {results.map((res) => (
                  <Link href={`/resort/${res.id}`} className="ai-result-row" key={res.id} style={{ color: "inherit" }}>
                    <div className="air-rank">{res.rank}</div>
                    <div className="air-name">{res.name}</div>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <span className="air-tag">{res.tag}</span>
                      <span className="air-score">{res.score}</span>
                    </div>
                  </Link>
                ))}
                <div style={{ marginTop: 16, textAlign: "center" }}>
                  <span style={{ fontSize: 12, color: "rgba(255,255,255,.5)" }}>Maak een gratis account aan voor alle details, sneeuwscores en vergelijker →</span>
                </div>
              </div>
            )}
          </div>
          <div style={{ textAlign: "center", marginTop: 16 }}>
            <Link href="/" className="btn btn-ghost">← Terug naar home</Link>
          </div>
        </div>
      </div>
    </section>
  );
}
