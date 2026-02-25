import { prisma } from "../lib/prisma";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const topResorts = await prisma.resort.findMany({
    orderBy: { averageOverallRating: "desc" },
    take: 10,
  });

  const totalResorts = await prisma.resort.count();
  const totalReviews = await prisma.review.count();

  const countries = await prisma.resort.groupBy({ by: ["Country"] });

  return (
    <main className="ar-root">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Instrument+Sans:wght@400;500;600&family=Instrument+Serif:ital@0;1&family=DM+Mono:wght@300;400&display=swap');

        :root {
          --bg:        #04080f;
          --surface:   #070d1a;
          --panel:     #0a1220;
          --border:    rgba(160,210,240,0.1);
          --border-hi: rgba(160,210,240,0.25);
          --ice:       #a0d2f0;
          --frost:     #c8e8ff;
          --dim:       rgba(200,232,255,0.35);
          --muted:     rgba(200,232,255,0.18);
          --gold:      #f0c040;
          --silver:    #c0ccd8;
          --bronze:    #d4845a;
        }

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        .ar-root {
          font-family: 'Instrument Sans', sans-serif;
          background: var(--bg);
          color: var(--frost);
          min-height: 100vh;
          overflow-x: hidden;
        }

        /* ━━━━━━━━━━ HERO ━━━━━━━━━━ */
        .hero {
          position: relative;
          min-height: 100svh;
          display: grid;
          place-items: center;
          padding: 0 2rem;
          overflow: hidden;
        }

        .hero::before {
          content: '';
          position: absolute;
          inset: 0;
          background:
            radial-gradient(ellipse 100% 55% at 50% -10%,  rgba(80,160,220,0.18) 0%, transparent 65%),
            radial-gradient(ellipse 60%  40% at 15%  70%,  rgba(40,100,200,0.09) 0%, transparent 60%),
            radial-gradient(ellipse 50%  35% at 85%  80%,  rgba(20, 60,160,0.08) 0%, transparent 55%);
          pointer-events: none;
        }

        .hero::after {
          content: '';
          position: absolute;
          inset: 0;
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='300' height='300' filter='url(%23n)' opacity='0.035'/%3E%3C/svg%3E");
          pointer-events: none;
          opacity: 0.6;
        }

        .contours {
          position: absolute;
          inset: 0;
          background-image:
            repeating-linear-gradient(0deg, transparent, transparent 79px, rgba(160,210,240,0.025) 79px, rgba(160,210,240,0.025) 80px),
            repeating-linear-gradient(90deg, transparent, transparent 79px, rgba(160,210,240,0.018) 79px, rgba(160,210,240,0.018) 80px);
          pointer-events: none;
        }

        .hero-mountain {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          width: 100%;
          pointer-events: none;
        }

        .hero-inner {
          position: relative;
          z-index: 2;
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
        }

        .hero-eyebrow {
          font-family: 'DM Mono', monospace;
          font-size: 0.65rem;
          font-weight: 400;
          letter-spacing: 0.35em;
          color: var(--ice);
          text-transform: uppercase;
          opacity: 0.6;
          margin-bottom: 1.8rem;
          animation: rise 1s ease both;
        }

        .hero-title {
          font-family: 'Bebas Neue', sans-serif;
          font-size: clamp(6rem, 20vw, 18rem);
          line-height: 0.88;
          letter-spacing: -0.01em;
          background: linear-gradient(175deg, #ffffff 0%, var(--frost) 30%, var(--ice) 60%, #5aaad0 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          animation: rise 1s ease 0.08s both;
          filter: drop-shadow(0 0 80px rgba(100,180,240,0.25));
        }

        .hero-tagline {
          font-family: 'Instrument Serif', serif;
          font-style: italic;
          font-size: clamp(1.1rem, 2.5vw, 1.5rem);
          color: var(--dim);
          margin-top: 1.8rem;
          letter-spacing: 0.01em;
          animation: rise 1s ease 0.18s both;
          max-width: 480px;
        }

        .hero-cta {
          margin-top: 3rem;
          display: flex;
          gap: 1rem;
          animation: rise 1s ease 0.28s both;
        }

        .btn-a {
          display: inline-flex;
          align-items: center;
          background: var(--ice);
          color: #04080f;
          font-family: 'Instrument Sans', sans-serif;
          font-weight: 600;
          font-size: 0.875rem;
          letter-spacing: 0.03em;
          padding: 0.85rem 2rem;
          border-radius: 4px;
          text-decoration: none;
          transition: all 0.2s;
          box-shadow: 0 0 50px rgba(160,210,240,0.22), inset 0 1px 0 rgba(255,255,255,0.3);
        }

        .btn-a:hover {
          background: var(--frost);
          box-shadow: 0 0 80px rgba(160,210,240,0.4), inset 0 1px 0 rgba(255,255,255,0.4);
          transform: translateY(-2px);
        }

        .btn-b {
          display: inline-flex;
          align-items: center;
          font-family: 'Instrument Sans', sans-serif;
          font-weight: 500;
          font-size: 0.875rem;
          letter-spacing: 0.03em;
          padding: 0.85rem 2rem;
          border: 1px solid var(--border-hi);
          border-radius: 4px;
          color: var(--dim);
          text-decoration: none;
          transition: all 0.2s;
        }

        .btn-b:hover {
          border-color: var(--ice);
          color: var(--ice);
          background: rgba(160,210,240,0.05);
          transform: translateY(-2px);
        }

        .hero-scroll-indicator {
          position: absolute;
          bottom: 2.5rem;
          left: 50%;
          transform: translateX(-50%);
          z-index: 2;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.6rem;
          animation: rise 1s ease 0.5s both;
        }

        .scroll-track {
          width: 1px;
          height: 48px;
          background: linear-gradient(to bottom, var(--ice), transparent);
          position: relative;
          overflow: hidden;
        }

        .scroll-track::after {
          content: '';
          position: absolute;
          top: -100%;
          left: 0;
          width: 100%;
          height: 100%;
          background: linear-gradient(to bottom, transparent, var(--frost));
          animation: drip 2s ease-in-out infinite;
        }

        .scroll-label {
          font-family: 'DM Mono', monospace;
          font-size: 0.58rem;
          letter-spacing: 0.25em;
          color: var(--muted);
          text-transform: uppercase;
        }

        /* ━━━━━━━━━━ STATS ━━━━━━━━━━ */
        .stats-band {
          border-top: 1px solid var(--border);
          border-bottom: 1px solid var(--border);
          background: var(--surface);
          position: relative;
        }

        .stats-band::before {
          content: '';
          position: absolute;
          inset: 0;
          background: radial-gradient(ellipse 60% 100% at 50% 0%, rgba(160,210,240,0.04) 0%, transparent 70%);
          pointer-events: none;
        }

        .stats-inner {
          max-width: 960px;
          margin: 0 auto;
          display: grid;
          grid-template-columns: repeat(3, 1fr);
        }

        .stat-cell {
          padding: 3.5rem 2rem;
          text-align: center;
          position: relative;
        }

        .stat-cell + .stat-cell::before {
          content: '';
          position: absolute;
          left: 0;
          top: 25%;
          bottom: 25%;
          width: 1px;
          background: linear-gradient(to bottom, transparent, var(--border-hi), transparent);
        }

        .stat-value {
          font-family: 'Bebas Neue', sans-serif;
          font-size: clamp(4rem, 7vw, 6.5rem);
          line-height: 1;
          letter-spacing: 0.02em;
          background: linear-gradient(150deg, var(--frost) 0%, var(--ice) 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          display: block;
        }

        .stat-name {
          font-family: 'DM Mono', monospace;
          font-size: 0.65rem;
          letter-spacing: 0.22em;
          color: var(--muted);
          text-transform: uppercase;
          display: block;
          margin-top: 0.6rem;
        }

        /* ━━━━━━━━━━ LEADERBOARD ━━━━━━━━━━ */
        .lb-section {
          padding: 7rem 2rem;
          position: relative;
        }

        .lb-section::before {
          content: '';
          position: absolute;
          top: 0;
          left: 50%;
          transform: translateX(-50%);
          width: 1px;
          height: 80px;
          background: linear-gradient(to bottom, transparent, var(--border-hi));
        }

        .section-header {
          text-align: center;
          margin-bottom: 4.5rem;
        }

        .s-eyebrow {
          font-family: 'DM Mono', monospace;
          font-size: 0.62rem;
          letter-spacing: 0.35em;
          color: var(--ice);
          opacity: 0.5;
          text-transform: uppercase;
          display: block;
          margin-bottom: 0.9rem;
        }

        .s-title {
          font-family: 'Bebas Neue', sans-serif;
          font-size: clamp(3rem, 6vw, 5.5rem);
          letter-spacing: 0.06em;
          color: var(--frost);
          line-height: 1;
        }

        .lb-table {
          max-width: 820px;
          margin: 0 auto;
          border: 1px solid var(--border);
          border-radius: 8px;
          overflow: hidden;
          background: var(--surface);
        }

        .lb-header {
          display: grid;
          grid-template-columns: 56px 1fr 90px 90px;
          padding: 0.75rem 1.5rem;
          border-bottom: 1px solid var(--border);
          background: rgba(160,210,240,0.03);
        }

        .lb-header span {
          font-family: 'DM Mono', monospace;
          font-size: 0.58rem;
          letter-spacing: 0.2em;
          color: var(--muted);
          text-transform: uppercase;
        }

        .lb-header span:last-child,
        .lb-header span:nth-child(3) { text-align: right; }

        .lb-row {
          display: grid;
          grid-template-columns: 56px 1fr 90px 90px;
          align-items: center;
          padding: 1.25rem 1.5rem;
          border-bottom: 1px solid var(--border);
          text-decoration: none;
          color: inherit;
          position: relative;
          transition: background 0.15s;
        }

        .lb-row:last-child { border-bottom: none; }

        .lb-row::after {
          content: '';
          position: absolute;
          left: 0; top: 0; bottom: 0;
          width: 2px;
          background: transparent;
          transition: background 0.15s;
        }

        .lb-row:hover { background: rgba(160,210,240,0.04); }
        .lb-row:hover::after { background: var(--ice); }

        .lb-row.is-gold   { background: linear-gradient(90deg, rgba(240,192,64,0.05) 0%, transparent 50%); }
        .lb-row.is-silver { background: linear-gradient(90deg, rgba(192,204,216,0.04) 0%, transparent 50%); }
        .lb-row.is-bronze { background: linear-gradient(90deg, rgba(212,132,90,0.04) 0%, transparent 50%); }

        .lb-pos {
          font-family: 'DM Mono', monospace;
          font-size: 0.75rem;
          color: var(--muted);
          letter-spacing: 0.05em;
        }

        .lb-pos.top { font-size: 1.3rem; }

        .lb-name {
          font-size: 0.975rem;
          font-weight: 500;
          color: var(--frost);
          margin-bottom: 0.2rem;
          transition: color 0.15s;
        }

        .lb-row:hover .lb-name { color: var(--ice); }

        .lb-loc {
          font-family: 'DM Mono', monospace;
          font-size: 0.65rem;
          color: var(--muted);
          letter-spacing: 0.05em;
        }

        .lb-reviews {
          font-family: 'DM Mono', monospace;
          font-size: 0.68rem;
          color: var(--muted);
          text-align: right;
          letter-spacing: 0.05em;
        }

        .lb-score {
          font-family: 'Bebas Neue', sans-serif;
          font-size: 2rem;
          letter-spacing: 0.05em;
          text-align: right;
          line-height: 1;
        }

        .lb-score.is-gold   { color: var(--gold);   }
        .lb-score.is-silver { color: var(--silver);  }
        .lb-score.is-bronze { color: var(--bronze);  }
        .lb-score.is-rest   { color: var(--ice);     }

        .lb-footer {
          display: flex;
          justify-content: flex-end;
          padding: 1.2rem 1.5rem 0;
        }

        .lb-more {
          font-family: 'DM Mono', monospace;
          font-size: 0.68rem;
          letter-spacing: 0.18em;
          color: var(--ice);
          text-decoration: none;
          text-transform: uppercase;
          opacity: 0.7;
          transition: opacity 0.15s;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .lb-more:hover { opacity: 1; }
        .lb-more::after { content: '→'; font-family: sans-serif; }

        /* ━━━━━━━━━━ RULE ━━━━━━━━━━ */
        .rule {
          width: 100%;
          height: 1px;
          background: linear-gradient(90deg, transparent 0%, var(--border-hi) 20%, var(--border-hi) 80%, transparent 100%);
        }

        /* ━━━━━━━━━━ COUNTRIES ━━━━━━━━━━ */
        .countries-section {
          padding: 6rem 2rem;
          background: var(--surface);
          position: relative;
          overflow: hidden;
        }

        .countries-section::before {
          content: '';
          position: absolute;
          inset: 0;
          background: radial-gradient(ellipse 70% 80% at 50% 50%, rgba(160,210,240,0.03) 0%, transparent 70%);
          pointer-events: none;
        }

        .country-wrap {
          max-width: 760px;
          margin: 0 auto;
          display: flex;
          flex-wrap: wrap;
          gap: 0.6rem;
          justify-content: center;
        }

        .c-tag {
          font-family: 'DM Mono', monospace;
          font-size: 0.68rem;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: var(--muted);
          border: 1px solid var(--border);
          border-radius: 2px;
          padding: 0.45rem 1rem;
          text-decoration: none;
          transition: all 0.15s;
        }

        .c-tag:hover {
          color: var(--ice);
          border-color: var(--border-hi);
          background: rgba(160,210,240,0.05);
        }

        /* ━━━━━━━━━━ FINAL CTA ━━━━━━━━━━ */
        .final {
          padding: 9rem 2rem 8rem;
          text-align: center;
          position: relative;
          overflow: hidden;
        }

        .final::before {
          content: '';
          position: absolute;
          inset: 0;
          background: radial-gradient(ellipse 60% 60% at 50% 30%, rgba(120,190,240,0.1) 0%, transparent 65%);
          pointer-events: none;
        }

        .final-watermark {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          font-family: 'Bebas Neue', sans-serif;
          font-size: clamp(18rem, 35vw, 32rem);
          line-height: 1;
          color: rgba(160,210,240,0.025);
          pointer-events: none;
          user-select: none;
          white-space: nowrap;
          letter-spacing: -0.05em;
        }

        .final-inner {
          position: relative;
          z-index: 2;
          max-width: 560px;
          margin: 0 auto;
        }

        .final-title {
          font-family: 'Bebas Neue', sans-serif;
          font-size: clamp(4rem, 9vw, 8rem);
          letter-spacing: 0.04em;
          line-height: 0.95;
          color: var(--frost);
          margin-bottom: 1.5rem;
        }

        .final-title em {
          font-family: 'Instrument Serif', serif;
          font-style: italic;
          font-size: 0.85em;
          background: linear-gradient(120deg, var(--frost), var(--ice));
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .final-sub {
          font-size: 0.95rem;
          font-weight: 400;
          color: var(--muted);
          line-height: 1.75;
          margin-bottom: 2.8rem;
        }

        .btn-register {
          position: relative;
          display: inline-block;
          font-family: 'DM Mono', monospace;
          font-size: 0.75rem;
          font-weight: 400;
          letter-spacing: 0.22em;
          text-transform: uppercase;
          color: var(--frost);
          text-decoration: none;
          padding: 1.1rem 3rem;
          border-radius: 3px;
          overflow: hidden;
          isolation: isolate;
        }

        .btn-register::before {
          content: '';
          position: absolute;
          inset: 0;
          border-radius: 3px;
          padding: 1px;
          background: linear-gradient(135deg, var(--ice), rgba(160,210,240,0.2), var(--ice));
          -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
          -webkit-mask-composite: xor;
          mask-composite: exclude;
          pointer-events: none;
        }

        .btn-register::after {
          content: '';
          position: absolute;
          inset: 0;
          background: var(--ice);
          transform: translateY(101%);
          transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          z-index: -1;
        }

        .btn-register:hover::after { transform: translateY(0); }
        .btn-register:hover { color: var(--bg); }
        .btn-register span { position: relative; z-index: 1; transition: color 0.3s; }

        /* ━━━━━━━━━━ ANIMATIONS ━━━━━━━━━━ */
        @keyframes rise {
          from { opacity: 0; transform: translateY(24px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        @keyframes drip {
          0%   { top: -100%; }
          100% { top: 100%; }
        }

        /* ━━━━━━━━━━ RESPONSIVE ━━━━━━━━━━ */
        @media (max-width: 640px) {
          .stats-inner { grid-template-columns: 1fr; }
          .stat-cell + .stat-cell::before { display: none; }
          .stat-cell { padding: 2.5rem 1.5rem; border-bottom: 1px solid var(--border); }
          .stat-cell:last-child { border-bottom: none; }
          .lb-header, .lb-row { grid-template-columns: 44px 1fr 70px; }
          .lb-reviews { display: none; }
          .hero-cta { flex-direction: column; }
        }
      `}</style>

      {/* ━━━ HERO ━━━ */}
      <section className="hero">
        <div className="contours" aria-hidden="true" />

        <svg className="hero-mountain" viewBox="0 0 1440 280" preserveAspectRatio="none" aria-hidden="true">
          <defs>
            <linearGradient id="mg" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="rgba(160,210,240,0.06)" />
              <stop offset="100%" stopColor="rgba(160,210,240,0)" />
            </linearGradient>
          </defs>
          <path d="M0,280 L0,200 L200,90 L360,170 L520,50 L680,160 L840,70 L1000,190 L1160,40 L1300,140 L1440,80 L1440,280 Z" fill="url(#mg)" />
          <path d="M520,50 L490,110 L550,110 Z M1160,40 L1130,95 L1190,95 Z M840,70 L815,120 L865,120 Z" fill="rgba(200,232,255,0.08)" />
        </svg>

        <div className="hero-inner">
          <p className="hero-eyebrow">Global Ski Resort Intelligence</p>
          <h1 className="hero-title">AlpineRank</h1>
          <p className="hero-tagline">
            The world's most precise ranking platform<br />for elite ski destinations.
          </p>
          <div className="hero-cta">
            <Link href="/rankings" className="btn-a">View Rankings</Link>
            <Link href="/resorts" className="btn-b">Browse Resorts</Link>
          </div>
        </div>

        <div className="hero-scroll-indicator" aria-hidden="true">
          <div className="scroll-track" />
          <span className="scroll-label">scroll</span>
        </div>
      </section>

      {/* ━━━ STATS ━━━ */}
      <section className="stats-band">
        <div className="stats-inner">
          {[
            { v: totalResorts.toLocaleString(),  l: "Resorts Worldwide" },
            { v: totalReviews.toLocaleString(),  l: "Verified Reviews"  },
            { v: countries.length.toString(),    l: "Countries Covered" },
          ].map(({ v, l }) => (
            <div key={l} className="stat-cell">
              <span className="stat-value">{v}</span>
              <span className="stat-name">{l}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ━━━ LEADERBOARD ━━━ */}
      <section className="lb-section">
        <div className="section-header">
          <span className="s-eyebrow">Season Rankings</span>
          <h2 className="s-title">Global Top 10</h2>
        </div>

        <div style={{ maxWidth: 820, margin: "0 auto" }}>
          <div className="lb-table">
            <div className="lb-header">
              <span>Pos</span>
              <span>Resort</span>
              <span style={{ textAlign: "right" }}>Reviews</span>
              <span style={{ textAlign: "right" }}>Score</span>
            </div>

            {topResorts.map((resort: typeof topResorts[number], i: number) => {
              const rowCls = i === 0 ? "is-gold" : i === 1 ? "is-silver" : i === 2 ? "is-bronze" : "";
              const scoreCls = i === 0 ? "is-gold" : i === 1 ? "is-silver" : i === 2 ? "is-bronze" : "is-rest";
              const medals = ["🥇", "🥈", "🥉"];
              return (
                <Link key={resort.id} href={`/resort/${resort.id}`} className={`lb-row ${rowCls}`}>
                  <span className={`lb-pos${i < 3 ? " top" : ""}`}>
                    {i < 3 ? medals[i] : String(i + 1).padStart(2, "0")}
                  </span>
                  <div>
                    <div className="lb-name">{resort.name}</div>
                    <div className="lb-loc">{resort.Country} · {resort.Continent}</div>
                  </div>
                  <div className="lb-reviews">{resort.reviewCount}</div>
                  <div className={`lb-score ${scoreCls}`}>
                    {resort.averageOverallRating?.toFixed(1) ?? "—"}
                  </div>
                </Link>
              );
            })}
          </div>

          <div className="lb-footer">
            <Link href="/rankings" className="lb-more">Full rankings</Link>
          </div>
        </div>
      </section>

      <div className="rule" />

      {/* ━━━ COUNTRIES ━━━ */}
      <section className="countries-section">
        <div className="section-header" style={{ marginBottom: "2.5rem" }}>
          <span className="s-eyebrow">Destinations</span>
          <h2 className="s-title">Explore by Country</h2>
        </div>
        <div className="country-wrap">
          {countries.slice(0, 22).map((c: typeof countries[number]) => (
            <Link key={c.Country} href={`/resort?country=${encodeURIComponent(c.Country)}`} className="c-tag">
              {c.Country}
            </Link>
          ))}
        </div>
      </section>

      <div className="rule" />

      {/* ━━━ FINAL CTA ━━━ */}
      <section className="final">
        <div className="final-watermark" aria-hidden="true">№1</div>
        <div className="final-inner">
          <h2 className="final-title">
            Rate<br /><em>the slopes.</em>
          </h2>
          <p className="final-sub">
            Join AlpineRank and help shape the world's most trusted ski resort ranking platform. Your rating matters.
          </p>
          <Link href="/register" className="btn-register">
            <span>Create Free Account</span>
          </Link>
        </div>
      </section>
    </main>
  );
}