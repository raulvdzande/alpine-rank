import { prisma } from "@/lib/prisma";
import { calculateBayesianScore } from "@/lib/ranking";
import Link from "next/link";

export const dynamic = "force-dynamic";

const MIN_VOTES = 5;

const CATEGORIES = [
  { key: "terrain", label: "Terrain",    icon: "◈", color: "#9dd0f0" },
  { key: "snow",    label: "Snow",       icon: "❄", color: "#b8e0ff" },
  { key: "lifts",   label: "Lifts",      icon: "⟁", color: "#8ecae6" },
  { key: "apres",   label: "Après-Ski",  icon: "◉", color: "#a8dadc" },
  { key: "family",  label: "Family",     icon: "⬡", color: "#90c9f0" },
  { key: "value",   label: "Value",      icon: "◇", color: "#7bbfdf" },
  { key: "scenery", label: "Scenery",    icon: "△", color: "#aad4ef" },
] as const;

type CategoryKey = typeof CATEGORIES[number]["key"];

export default async function RankingsPage() {
  const resorts = await prisma.resort.findMany({ include: { reviews: true } });

  if (!resorts.length) {
    return (
      <main style={{ minHeight: "100svh", background: "#02060e", color: "#c5e5ff", display: "grid", placeItems: "center" }}>
        <p style={{ fontFamily: "'DM Mono', monospace", letterSpacing: "0.2em", opacity: 0.4 }}>No resorts found.</p>
      </main>
    );
  }

  const globalAverage = resorts.reduce((a, r) => a + (r.averageOverallRating ?? 0), 0) / resorts.length;

  const rankedOverall = resorts
    .map((r) => ({
      ...r,
      score: calculateBayesianScore(r.averageOverallRating ?? 0, r.reviewCount, globalAverage, MIN_VOTES),
    }))
    .sort((a, b) => b.score - a.score)
    .slice(0, 10);

  function getCategoryRanking(category: CategoryKey) {
    return resorts
      .map((resort) => {
        const n = resort.reviews.length;
        const avg = n > 0
          ? resort.reviews.reduce((s, rv) => s + (rv[category] as number), 0) / n
          : 0;
        return {
          ...resort,
          score: calculateBayesianScore(avg, n, globalAverage, MIN_VOTES),
        };
      })
      .sort((a, b) => b.score - a.score)
      .slice(0, 10);
  }

  const categoryRankings = CATEGORIES.map((cat) => ({
    ...cat,
    data: getCategoryRanking(cat.key),
  }));

  return (
    <main className="ar-root">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Instrument+Sans:ital,wght@0,400;0,500;0,600;1,400&family=Instrument+Serif:ital@0;1&family=DM+Mono:wght@300;400&display=swap');

        :root {
          --bg:         #02060e;
          --surface:    #060c18;
          --panel:      #080f1e;
          --border:     rgba(140,200,240,0.08);
          --border-hi:  rgba(140,200,240,0.22);
          --ice:        #9dd0f0;
          --frost:      #c5e5ff;
          --white:      #e8f4ff;
          --dim:        rgba(197,229,255,0.4);
          --muted:      rgba(197,229,255,0.22);
          --faint:      rgba(197,229,255,0.1);
          --gold:       #f0be40;
          --silver:     #b8ccd8;
          --bronze:     #c8845a;
        }

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        html { scroll-behavior: smooth; }
        body { background: var(--bg); }

        .ar-root {
          font-family: 'Instrument Sans', sans-serif;
          background: var(--bg);
          color: var(--frost);
          min-height: 100svh;
          overflow-x: hidden;
        }

        /* ── Atmosphere ── */
        .atmo {
          position: fixed; inset: 0; pointer-events: none; z-index: 0;
          background:
            radial-gradient(ellipse 110% 50% at 50% -5%,  rgba(60,140,220,0.18) 0%, transparent 55%),
            radial-gradient(ellipse 55%  45% at 5%   80%, rgba(30,80,200,0.09)  0%, transparent 55%),
            radial-gradient(ellipse 50%  40% at 95%  75%, rgba(10,50,160,0.07)  0%, transparent 50%);
        }

        .grid-lines {
          position: fixed; inset: 0; pointer-events: none; z-index: 0;
          background-image:
            repeating-linear-gradient(0deg, transparent, transparent 79px, rgba(140,200,240,0.022) 79px, rgba(140,200,240,0.022) 80px),
            repeating-linear-gradient(90deg, transparent, transparent 79px, rgba(140,200,240,0.016) 79px, rgba(140,200,240,0.016) 80px);
        }

        /* ── Nav ── */
        .ar-nav {
          position: sticky; top: 0; z-index: 50;
          display: flex; align-items: center; justify-content: space-between;
          padding: 1.1rem 4rem;
          background: rgba(2,6,14,0.8);
          border-bottom: 1px solid var(--border);
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
        }

        .nav-logo {
          font-family: 'Bebas Neue', sans-serif;
          font-size: 1.5rem; letter-spacing: 0.05em;
          background: linear-gradient(160deg, var(--white) 0%, var(--frost) 50%, var(--ice) 100%);
          -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
          text-decoration: none;
          filter: drop-shadow(0 0 18px rgba(100,180,240,0.25));
          transition: filter 0.2s;
        }
        .nav-logo:hover { filter: drop-shadow(0 0 30px rgba(100,180,240,0.5)); }

        .nav-home {
          font-family: 'DM Mono', monospace;
          font-size: 0.58rem; letter-spacing: 0.22em; text-transform: uppercase;
          color: var(--muted); text-decoration: none;
          display: flex; align-items: center; gap: 0.5rem;
          transition: color 0.15s;
          padding: 0.55rem 1.1rem;
          border: 1px solid var(--border);
          border-radius: 2px;
        }
        .nav-home::before { content: '←'; font-family: sans-serif; opacity: 0.6; }
        .nav-home:hover { color: var(--ice); border-color: var(--border-hi); }

        /* ── Hero ── */
        .hero {
          position: relative; z-index: 2;
          padding: 7rem 4rem 5rem;
          max-width: 1320px; margin: 0 auto;
          display: grid;
          grid-template-columns: 1fr auto;
          align-items: end;
          gap: 3rem;
        }

        .hero-eyebrow {
          font-family: 'DM Mono', monospace;
          font-size: 0.6rem; letter-spacing: 0.35em; text-transform: uppercase;
          color: var(--ice); opacity: 0.5;
          display: flex; align-items: center; gap: 0.6rem;
          margin-bottom: 1.2rem;
          animation: rise 0.8s ease 0.1s both;
        }
        .hero-eyebrow::before {
          content: ''; width: 28px; height: 1px;
          background: linear-gradient(90deg, transparent, var(--ice));
          opacity: 0.5;
        }

        .hero-title {
          font-family: 'Bebas Neue', sans-serif;
          font-size: clamp(5rem, 10vw, 10rem);
          line-height: 0.88; letter-spacing: 0.02em;
          background: linear-gradient(160deg, var(--white) 0%, var(--frost) 45%, var(--ice) 100%);
          -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
          filter: drop-shadow(0 0 70px rgba(80,160,240,0.15));
          animation: rise 0.8s ease 0.15s both;
        }

        .hero-sub {
          font-family: 'Instrument Serif', serif; font-style: italic;
          font-size: 1.1rem; color: var(--dim);
          margin-top: 1.2rem;
          animation: rise 0.8s ease 0.25s both;
        }

        .hero-stats {
          display: flex; flex-direction: column; align-items: flex-end; gap: 0.6rem;
          animation: rise 0.8s ease 0.2s both;
        }

        .hero-stat-val {
          font-family: 'Bebas Neue', sans-serif;
          font-size: 3.2rem; letter-spacing: 0.03em; line-height: 1;
          background: linear-gradient(135deg, var(--frost), var(--ice));
          -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
        }

        .hero-stat-label {
          font-family: 'DM Mono', monospace;
          font-size: 0.56rem; letter-spacing: 0.22em; text-transform: uppercase;
          color: var(--muted); text-align: right;
        }

        /* ── Category nav ── */
        .cat-nav {
          position: sticky; top: 65px; z-index: 40;
          background: rgba(2,6,14,0.9);
          border-bottom: 1px solid var(--border);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
        }

        .cat-nav-inner {
          max-width: 1320px; margin: 0 auto;
          padding: 0 4rem;
          display: flex; overflow-x: auto;
          scrollbar-width: none;
        }
        .cat-nav-inner::-webkit-scrollbar { display: none; }

        .cat-pill {
          display: flex; align-items: center; gap: 0.5rem;
          padding: 0.9rem 1.3rem;
          font-family: 'DM Mono', monospace;
          font-size: 0.57rem; letter-spacing: 0.18em; text-transform: uppercase;
          color: var(--muted); text-decoration: none;
          border-bottom: 2px solid transparent;
          white-space: nowrap; flex-shrink: 0;
          transition: color 0.15s, border-color 0.15s;
        }
        .cat-pill:hover { color: var(--frost); border-color: var(--border-hi); }
        .cat-pill.is-overall { color: var(--gold); border-color: rgba(240,190,64,0.28); }
        .cat-pill.is-overall:hover { border-color: var(--gold); }

        /* ── Page body ── */
        .page-body {
          position: relative; z-index: 2;
          max-width: 1320px; margin: 0 auto;
          padding: 6rem 4rem 10rem;
          display: flex; flex-direction: column; gap: 8rem;
        }

        /* ── Section header ── */
        .rank-section { animation: rise 0.6s ease both; }

        .sec-head {
          display: grid;
          grid-template-columns: auto 1fr auto;
          align-items: center;
          gap: 1.5rem;
          margin-bottom: 2.5rem;
          padding-bottom: 1.5rem;
          border-bottom: 1px solid var(--border);
        }

        .sec-icon {
          width: 48px; height: 48px;
          display: flex; align-items: center; justify-content: center;
          background: var(--surface); border: 1px solid var(--border);
          border-radius: 6px; font-size: 1.1rem; color: var(--ice); flex-shrink: 0;
        }

        .sec-title {
          font-family: 'Bebas Neue', sans-serif;
          font-size: 2.8rem; letter-spacing: 0.05em; line-height: 1; color: var(--frost);
        }

        .sec-label {
          font-family: 'DM Mono', monospace;
          font-size: 0.57rem; letter-spacing: 0.2em; text-transform: uppercase;
          color: var(--muted); margin-top: 0.25rem;
        }

        .sec-rule { height: 1px; background: linear-gradient(90deg, var(--border-hi), transparent); }

        .sec-badge {
          font-family: 'DM Mono', monospace;
          font-size: 0.58rem; letter-spacing: 0.18em; color: var(--muted);
          border: 1px solid var(--border); border-radius: 2px;
          padding: 0.3rem 0.75rem; white-space: nowrap;
        }

        /* ── Podium ── */
        .podium {
          display: grid; grid-template-columns: 1fr 1.08fr 1fr;
          gap: 1px; background: var(--border);
          border-radius: 8px 8px 0 0; overflow: hidden;
        }

        .podium-card {
          padding: 2.5rem 2rem;
          display: flex; flex-direction: column;
          text-decoration: none; color: inherit;
          transition: background 0.2s; position: relative; overflow: hidden;
        }

        .p1 { background: linear-gradient(160deg, rgba(240,190,64,0.09) 0%, var(--surface) 55%); }
        .p2 { background: linear-gradient(160deg, rgba(184,204,216,0.07) 0%, var(--surface) 55%); order: -1; }
        .p3 { background: linear-gradient(160deg, rgba(200,132,90,0.07) 0%, var(--surface) 55%); }
        .podium-card:hover { background: rgba(140,200,240,0.05); }

        .podium-card::after {
          content: ''; position: absolute; top: 0; left: 0; right: 0; height: 1px;
        }
        .p1::after { background: linear-gradient(90deg, transparent, rgba(240,190,64,0.4), transparent); }
        .p2::after { background: linear-gradient(90deg, transparent, rgba(184,204,216,0.3), transparent); }
        .p3::after { background: linear-gradient(90deg, transparent, rgba(200,132,90,0.3), transparent); }

        .podium-medal { font-size: 1.8rem; margin-bottom: 1.2rem; }
        .podium-rank {
          font-family: 'DM Mono', monospace;
          font-size: 0.54rem; letter-spacing: 0.28em; text-transform: uppercase;
          color: var(--muted); margin-bottom: 0.5rem;
        }
        .podium-name {
          font-family: 'Bebas Neue', sans-serif;
          font-size: 1.9rem; letter-spacing: 0.03em; line-height: 1;
          color: var(--frost); margin-bottom: 0.4rem; transition: color 0.15s;
        }
        .podium-card:hover .podium-name { color: var(--ice); }
        .podium-loc {
          font-family: 'DM Mono', monospace;
          font-size: 0.6rem; letter-spacing: 0.1em; color: var(--faint); flex: 1;
        }
        .podium-score {
          font-family: 'Bebas Neue', sans-serif;
          font-size: 3.5rem; letter-spacing: 0.04em; line-height: 1; margin-top: 1.5rem;
        }
        .p1 .podium-score { color: var(--gold); filter: drop-shadow(0 0 20px rgba(240,190,64,0.3)); }
        .p2 .podium-score { color: var(--silver); }
        .p3 .podium-score { color: var(--bronze); }
        .podium-score-label {
          font-family: 'DM Mono', monospace;
          font-size: 0.54rem; letter-spacing: 0.2em; text-transform: uppercase;
          color: var(--muted);
        }

        /* ── Rank table ── */
        .rank-table {
          display: flex; flex-direction: column;
          background: var(--surface); border: 1px solid var(--border);
          border-radius: 8px; overflow: hidden;
        }
        .rank-table.sub-podium { border-radius: 0 0 8px 8px; border-top: none; }

        .rth {
          display: grid; grid-template-columns: 72px 1fr 100px 120px 110px;
          padding: 0.7rem 1.8rem;
          background: rgba(140,200,240,0.03);
          border-bottom: 1px solid var(--border);
        }
        .rth span {
          font-family: 'DM Mono', monospace;
          font-size: 0.53rem; letter-spacing: 0.22em; text-transform: uppercase;
          color: var(--faint);
        }
        .rth span.r { text-align: right; }

        .rank-row {
          display: grid; grid-template-columns: 72px 1fr 100px 120px 110px;
          align-items: center; padding: 1.2rem 1.8rem;
          border-bottom: 1px solid var(--border);
          text-decoration: none; color: inherit;
          position: relative; transition: background 0.15s;
          animation: slideRow 0.5s ease both;
        }
        .rank-row:last-child { border-bottom: none; }
        .rank-row:hover { background: rgba(140,200,240,0.04); }

        .rank-row::before {
          content: ''; position: absolute; left: 0; top: 0; bottom: 0;
          width: 3px; border-radius: 0 2px 2px 0;
          opacity: 0; transition: opacity 0.15s;
        }
        .rank-row:hover::before { opacity: 1; }

        .pos-1 { background: linear-gradient(90deg, rgba(240,190,64,0.06) 0%, transparent 40%); }
        .pos-2 { background: linear-gradient(90deg, rgba(184,204,216,0.05) 0%, transparent 40%); }
        .pos-3 { background: linear-gradient(90deg, rgba(200,132,90,0.05)  0%, transparent 40%); }
        .pos-1::before { background: var(--gold); }
        .pos-2::before { background: var(--silver); }
        .pos-3::before { background: var(--bronze); }
        .rank-row:not(.pos-1):not(.pos-2):not(.pos-3)::before { background: var(--ice); }

        .rr-pos { display: flex; align-items: center; gap: 0.4rem; }
        .pos-medal { font-size: 1.25rem; line-height: 1; }
        .pos-num { font-family: 'DM Mono', monospace; font-size: 0.7rem; letter-spacing: 0.08em; color: var(--muted); }

        .rr-name {
          font-weight: 600; font-size: 0.92rem; color: var(--frost);
          transition: color 0.15s; display: block; margin-bottom: 0.2rem;
        }
        .rank-row:hover .rr-name { color: var(--ice); }

        .rr-loc {
          font-family: 'DM Mono', monospace;
          font-size: 0.58rem; letter-spacing: 0.08em; color: var(--faint);
          display: flex; align-items: center; gap: 0.35rem;
        }

        .rr-reviews {
          font-family: 'DM Mono', monospace;
          font-size: 0.63rem; letter-spacing: 0.06em; color: var(--muted); text-align: right;
        }

        .rr-bar-track {
          height: 3px; background: rgba(140,200,240,0.07);
          border-radius: 3px; overflow: hidden;
        }
        .rr-bar-fill {
          height: 100%; border-radius: 3px;
          background: linear-gradient(90deg, var(--ice), var(--frost));
          box-shadow: 0 0 8px rgba(140,200,240,0.4);
          animation: growBar 1s cubic-bezier(0.16,1,0.3,1) both;
          transform-origin: left;
        }

        .rr-score {
          font-family: 'Bebas Neue', sans-serif;
          font-size: 1.9rem; letter-spacing: 0.04em; line-height: 1; text-align: right;
        }
        .gold   { color: var(--gold);   filter: drop-shadow(0 0 10px rgba(240,190,64,0.3)); }
        .silver { color: var(--silver); }
        .bronze { color: var(--bronze); }
        .rest   { color: var(--ice);    }

        /* ── Category 2-col grid ── */
        .cat-grid {
          display: grid; grid-template-columns: 1fr 1fr;
          gap: 5rem 3.5rem;
        }

        /* ── Animations ── */
        @keyframes rise {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes slideRow {
          from { opacity: 0; transform: translateX(-8px); }
          to   { opacity: 1; transform: translateX(0); }
        }
        @keyframes growBar {
          from { transform: scaleX(0); }
          to   { transform: scaleX(1); }
        }

        ${Array.from({length: 10}, (_,i) => `.rank-row:nth-child(${i+2}){animation-delay:${i*0.04}s}`).join("")}

        /* ── Responsive ── */
        @media (max-width: 1100px) {
          .cat-grid { grid-template-columns: 1fr; gap: 6rem; }
          .rth, .rank-row { grid-template-columns: 56px 1fr 80px 90px; }
          .rth span:nth-child(4) { display: none; } /* hide bar header */
          .rr-bar-track { display: none; }
        }
        @media (max-width: 768px) {
          .hero { grid-template-columns: 1fr; padding: 5rem 2rem 4rem; }
          .hero-stats { align-items: flex-start; }
          .page-body { padding: 4rem 2rem 7rem; }
          .ar-nav, .cat-nav-inner { padding-left: 2rem; padding-right: 2rem; }
          .podium { grid-template-columns: 1fr; }
          .p2 { order: 0; }
          .rth { display: none; }
          .rank-row { grid-template-columns: 48px 1fr 72px; }
          .rr-reviews { display: none; }
        }
      `}</style>

      <div className="atmo" aria-hidden="true" />
      <div className="grid-lines" aria-hidden="true" />

      {/* ━━━ Nav ━━━ */}
      <nav className="ar-nav">
        <Link href="/" className="nav-logo">AlpineRank</Link>
        <Link href="/" className="nav-home">Home</Link>
      </nav>

      {/* ━━━ Category nav strip ━━━ */}
      <div className="cat-nav">
        <div className="cat-nav-inner">
          <a href="#overall" className="cat-pill is-overall">⭑ Overall</a>
          {CATEGORIES.map((cat) => (
            <a key={cat.key} href={`#${cat.key}`} className="cat-pill">
              {cat.icon} {cat.label}
            </a>
          ))}
        </div>
      </div>

      {/* ━━━ Hero ━━━ */}
      <div className="hero">
        <div>
          <p className="hero-eyebrow">Bayesian-weighted · Season 2025</p>
          <h1 className="hero-title">Global<br />Rankings</h1>
          <p className="hero-sub">The definitive ranking of the world's finest ski destinations.</p>
        </div>
        <div className="hero-stats">
          {[
            { v: resorts.length,                                                     l: "Resorts ranked"  },
            { v: resorts.reduce((s, r) => s + r.reviewCount, 0),                   l: "Total ratings"   },
            { v: globalAverage.toFixed(1),                                           l: "Global average"  },
          ].map(({ v, l }) => (
            <div key={l} style={{ textAlign: "right" }}>
              <div className="hero-stat-val">{v}</div>
              <div className="hero-stat-label">{l}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="page-body">

        {/* ━━━━━━━━━━━━━━
            OVERALL TOP 10
        ━━━━━━━━━━━━━━ */}
        <section id="overall" className="rank-section">
          <div className="sec-head">
            <div className="sec-icon" style={{ color: "var(--gold)", borderColor: "rgba(240,190,64,0.2)" }}>⭑</div>
            <div>
              <div className="sec-title">Overall Top 10</div>
              <div className="sec-label">Bayesian-weighted across all categories</div>
            </div>
            <div className="sec-rule" />
            <span className="sec-badge">Score /10</span>
          </div>

          {/* Podium: top 3 */}
          <div className="podium">
            {(["p2","p1","p3"] as const).map((cls) => {
              const idx = cls === "p1" ? 0 : cls === "p2" ? 1 : 2;
              const r = rankedOverall[idx];
              if (!r) return null;
              return (
                <Link key={r.id} href={`/resorts/${r.id}`} className={`podium-card ${cls}`}>
                  <span className="podium-medal">{["🥇","🥈","🥉"][idx]}</span>
                  <div className="podium-rank">{["1st Place","2nd Place","3rd Place"][idx]}</div>
                  <div className="podium-name">{r.name}</div>
                  <div className="podium-loc">{r.Country}{r.Continent ? ` · ${r.Continent}` : ""}</div>
                  <div className="podium-score">{r.score.toFixed(2)}</div>
                  <div className="podium-score-label">Score</div>
                </Link>
              );
            })}
          </div>

          {/* Rows 4–10 */}
          <div className="rank-table sub-podium">
            <div className="rth">
              <span>Pos</span><span>Resort</span>
              <span className="r">Reviews</span><span className="r">Score bar</span><span className="r">Score</span>
            </div>
            {rankedOverall.slice(3).map((r, i) => (
              <Link key={r.id} href={`/resorts/${r.id}`} className="rank-row">
                <div className="rr-pos"><span className="pos-num">{String(i + 4).padStart(2,"0")}</span></div>
                <div>
                  <span className="rr-name">{r.name}</span>
                  <span className="rr-loc">{r.Country}{r.Continent && <><span style={{opacity:0.3}}>·</span>{r.Continent}</>}</span>
                </div>
                <div className="rr-reviews">{r.reviewCount}</div>
                <div className="rr-bar-track">
                  <div className="rr-bar-fill" style={{ width:`${(r.score/10)*100}%`, animationDelay:`${i*0.05}s` }} />
                </div>
                <div className="rr-score rest">{r.score.toFixed(2)}</div>
              </Link>
            ))}
          </div>
        </section>

        {/* ━━━━━━━━━━━━━━
            CATEGORY RANKINGS
        ━━━━━━━━━━━━━━ */}
        <div className="cat-grid">
          {categoryRankings.map((cat, si) => (
            <section key={cat.key} id={cat.key} className="rank-section" style={{ animationDelay: `${si * 0.05}s` }}>
              <div className="sec-head">
                <div className="sec-icon" style={{ color: cat.color, borderColor: `${cat.color}22` }}>
                  {cat.icon}
                </div>
                <div>
                  <div className="sec-title">{cat.label}</div>
                  <div className="sec-label">Top 10 by category score</div>
                </div>
                <div className="sec-rule" />
              </div>

              <div className="rank-table">
                <div className="rth">
                  <span>Pos</span><span>Resort</span>
                  <span className="r">Reviews</span><span className="r">Bar</span><span className="r">Score</span>
                </div>
                {cat.data.map((r, i) => {
                  const posClass   = i === 0 ? "pos-1" : i === 1 ? "pos-2" : i === 2 ? "pos-3" : "";
                  const scoreClass = i === 0 ? "gold"  : i === 1 ? "silver": i === 2 ? "bronze": "rest";
                  return (
                    <Link key={r.id} href={`/resorts/${r.id}`} className={`rank-row ${posClass}`}>
                      <div className="rr-pos">
                        {i < 3
                          ? <span className="pos-medal">{["🥇","🥈","🥉"][i]}</span>
                          : <span className="pos-num">{String(i + 1).padStart(2,"0")}</span>
                        }
                      </div>
                      <div>
                        <span className="rr-name">{r.name}</span>
                        <span className="rr-loc">{r.Country}{r.Continent && <><span style={{opacity:0.3}}>·</span>{r.Continent}</>}</span>
                      </div>
                      <div className="rr-reviews">{r.reviewCount}</div>
                      <div className="rr-bar-track">
                        <div className="rr-bar-fill" style={{
                          width: `${(r.score / 10) * 100}%`,
                          background: `linear-gradient(90deg, ${cat.color}, ${cat.color}bb)`,
                          boxShadow: `0 0 8px ${cat.color}44`,
                          animationDelay: `${i * 0.05}s`,
                        }} />
                      </div>
                      <div className={`rr-score ${scoreClass}`}>{r.score.toFixed(2)}</div>
                    </Link>
                  );
                })}
              </div>
            </section>
          ))}
        </div>

      </div>
    </main>
  );
}