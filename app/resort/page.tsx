import { prisma } from "@/lib/prisma";
import Link from "next/link";

interface Props {
  searchParams: Promise<{ country?: string }>;
}

export default async function ResortsPage({ searchParams }: Props) {
  const { country } = await searchParams;

  const [resorts, allCountries] = await Promise.all([
    prisma.resort.findMany({
      where: country ? { Country: country } : undefined,
      orderBy: { averageOverallRating: "desc" },
    }),
    prisma.resort.groupBy({ by: ["Country"], orderBy: { Country: "asc" } }),
  ]);

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
        }

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        html { scroll-behavior: smooth; }
        body { background: var(--bg); }

        .ar-root {
          font-family: 'Instrument Sans', sans-serif;
          background: var(--bg); color: var(--frost);
          min-height: 100svh; overflow-x: hidden;
        }

        .atmo {
          position: fixed; inset: 0; pointer-events: none; z-index: 0;
          background:
            radial-gradient(ellipse 110% 50% at 50% -5%,  rgba(60,140,220,0.16) 0%, transparent 55%),
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
          background: rgba(2,6,14,0.85);
          border-bottom: 1px solid var(--border);
          backdrop-filter: blur(16px); -webkit-backdrop-filter: blur(16px);
        }

        .nav-logo {
          font-family: 'Bebas Neue', sans-serif;
          font-size: 1.5rem; letter-spacing: 0.05em;
          background: linear-gradient(160deg, var(--white) 0%, var(--frost) 50%, var(--ice) 100%);
          -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
          text-decoration: none;
          filter: drop-shadow(0 0 18px rgba(100,180,240,0.25)); transition: filter 0.2s;
        }
        .nav-logo:hover { filter: drop-shadow(0 0 30px rgba(100,180,240,0.5)); }

        .nav-links { display: flex; align-items: center; gap: 0.6rem; }

        .nav-link {
          font-family: 'DM Mono', monospace;
          font-size: 0.58rem; letter-spacing: 0.22em; text-transform: uppercase;
          color: var(--muted); text-decoration: none;
          padding: 0.55rem 1.1rem; border: 1px solid var(--border); border-radius: 2px;
          transition: color 0.15s, border-color 0.15s; display: flex; align-items: center; gap: 0.5rem;
        }
        .nav-link:hover { color: var(--ice); border-color: var(--border-hi); }

        /* ── Hero ── */
        .hero {
          position: relative; z-index: 2;
          padding: 7rem 4rem 4rem;
          max-width: 1320px; margin: 0 auto;
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
          background: linear-gradient(90deg, transparent, var(--ice)); opacity: 0.5;
        }

        .hero-row {
          display: flex; align-items: flex-end; justify-content: space-between; gap: 2rem;
          flex-wrap: wrap;
        }

        .hero-title {
          font-family: 'Bebas Neue', sans-serif;
          font-size: clamp(4.5rem, 9vw, 9rem);
          line-height: 0.88; letter-spacing: 0.02em;
          background: linear-gradient(160deg, var(--white) 0%, var(--frost) 45%, var(--ice) 100%);
          -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
          filter: drop-shadow(0 0 60px rgba(80,160,240,0.15));
          animation: rise 0.8s ease 0.15s both;
        }

        .hero-count {
          animation: rise 0.8s ease 0.2s both;
          text-align: right;
        }

        .hero-count-val {
          font-family: 'Bebas Neue', sans-serif;
          font-size: 3.5rem; line-height: 1; letter-spacing: 0.03em;
          background: linear-gradient(135deg, var(--frost), var(--ice));
          -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
        }

        .hero-count-label {
          font-family: 'DM Mono', monospace;
          font-size: 0.56rem; letter-spacing: 0.22em; text-transform: uppercase;
          color: var(--muted);
        }

        /* Active country filter banner */
        .filter-banner {
          display: flex; align-items: center; gap: 1rem;
          margin-top: 2rem;
          padding: 0.9rem 1.4rem;
          background: rgba(140,200,240,0.06);
          border: 1px solid var(--border-hi);
          border-radius: 6px;
          animation: rise 0.6s ease 0.25s both;
        }

        .filter-label {
          font-family: 'DM Mono', monospace;
          font-size: 0.58rem; letter-spacing: 0.2em; text-transform: uppercase;
          color: var(--muted);
        }

        .filter-value {
          font-family: 'Bebas Neue', sans-serif;
          font-size: 1.1rem; letter-spacing: 0.08em;
          color: var(--ice);
        }

        .filter-clear {
          margin-left: auto;
          font-family: 'DM Mono', monospace;
          font-size: 0.56rem; letter-spacing: 0.2em; text-transform: uppercase;
          color: var(--muted); text-decoration: none;
          padding: 0.35rem 0.8rem;
          border: 1px solid var(--border); border-radius: 2px;
          transition: all 0.15s;
        }
        .filter-clear:hover { color: var(--frost); border-color: var(--border-hi); }

        /* ── Body ── */
        .body {
          position: relative; z-index: 2;
          max-width: 1320px; margin: 0 auto;
          padding: 3rem 4rem 10rem;
          display: grid;
          grid-template-columns: 240px 1fr;
          gap: 3.5rem;
          align-items: start;
        }

        /* ── Sidebar ── */
        .sidebar {
          position: sticky; top: 90px;
          animation: rise 0.7s ease 0.2s both;
        }

        .sidebar-head {
          font-family: 'DM Mono', monospace;
          font-size: 0.56rem; letter-spacing: 0.3em; text-transform: uppercase;
          color: var(--ice); opacity: 0.45;
          display: flex; align-items: center; gap: 0.6rem;
          margin-bottom: 1.2rem;
        }
        .sidebar-head::after {
          content: ''; flex: 1; height: 1px;
          background: linear-gradient(90deg, var(--border-hi), transparent);
        }

        .country-list {
          display: flex; flex-direction: column; gap: 1px;
          background: var(--surface);
          border: 1px solid var(--border);
          border-radius: 6px; overflow: hidden;
        }

        .country-link {
          display: flex; align-items: center; justify-content: space-between;
          padding: 0.65rem 1rem;
          font-family: 'DM Mono', monospace;
          font-size: 0.62rem; letter-spacing: 0.1em; text-transform: uppercase;
          color: var(--muted); text-decoration: none;
          border-bottom: 1px solid var(--border);
          transition: background 0.12s, color 0.12s;
          position: relative;
        }
        .country-link:last-child { border-bottom: none; }
        .country-link:hover { background: rgba(140,200,240,0.04); color: var(--frost); }

        .country-link.active {
          background: rgba(140,200,240,0.07);
          color: var(--ice);
          border-left: 2px solid var(--ice);
        }

        .country-link::before {
          content: '';
          position: absolute; left: 0; top: 0; bottom: 0;
          width: 2px; background: var(--ice); opacity: 0;
          transition: opacity 0.12s;
        }
        .country-link:not(.active):hover::before { opacity: 0.6; }

        .c-name { flex: 1; }
        .c-count {
          font-size: 0.55rem; opacity: 0.45;
          background: rgba(140,200,240,0.06);
          padding: 0.15rem 0.45rem; border-radius: 2px;
        }

        .show-all {
          display: block; margin-top: 0.6rem;
          font-family: 'DM Mono', monospace;
          font-size: 0.56rem; letter-spacing: 0.18em; text-transform: uppercase;
          color: var(--muted); text-decoration: none; text-align: center;
          padding: 0.6rem;
          border: 1px solid var(--border); border-radius: 4px;
          transition: all 0.15s;
        }
        .show-all:hover { color: var(--ice); border-color: var(--border-hi); }

        /* ── Resort grid ── */
        .resort-area { animation: rise 0.7s ease 0.25s both; }

        .area-head {
          display: flex; align-items: baseline; gap: 1rem;
          margin-bottom: 2rem;
          padding-bottom: 1.2rem;
          border-bottom: 1px solid var(--border);
        }

        .area-title {
          font-family: 'Bebas Neue', sans-serif;
          font-size: 2rem; letter-spacing: 0.05em; color: var(--frost); line-height: 1;
        }

        .area-rule { flex: 1; height: 1px; background: linear-gradient(90deg, var(--border-hi), transparent); }

        .area-badge {
          font-family: 'DM Mono', monospace;
          font-size: 0.58rem; letter-spacing: 0.15em; color: var(--muted);
          border: 1px solid var(--border); border-radius: 2px; padding: 0.25rem 0.65rem;
        }

        .resort-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          gap: 1px;
          background: var(--border);
          border: 1px solid var(--border);
          border-radius: 8px; overflow: hidden;
        }

        .resort-card {
          background: var(--surface);
          padding: 1.8rem;
          text-decoration: none; color: inherit;
          display: flex; flex-direction: column;
          position: relative; overflow: hidden;
          transition: background 0.15s;
          animation: fadeIn 0.5s ease both;
        }

        ${Array.from({length:20},(_,i)=>`.resort-card:nth-child(${i+1}){animation-delay:${i*0.03}s}`).join("")}

        .resort-card:hover { background: rgba(140,200,240,0.045); }

        .resort-card::before {
          content: '';
          position: absolute; top: 0; left: 0; right: 0; height: 1px;
          background: linear-gradient(90deg, transparent, rgba(140,200,240,0), transparent);
          transition: background 0.2s;
        }
        .resort-card:hover::before {
          background: linear-gradient(90deg, transparent, rgba(140,200,240,0.2), transparent);
        }

        .card-continent {
          font-family: 'DM Mono', monospace;
          font-size: 0.53rem; letter-spacing: 0.22em; text-transform: uppercase;
          color: var(--faint); margin-bottom: 0.5rem;
        }

        .card-name {
          font-family: 'Bebas Neue', sans-serif;
          font-size: 1.55rem; letter-spacing: 0.03em; line-height: 1;
          color: var(--frost); margin-bottom: 0.4rem;
          transition: color 0.15s;
        }
        .resort-card:hover .card-name { color: var(--ice); }

        .card-country {
          font-family: 'Instrument Serif', serif; font-style: italic;
          font-size: 0.85rem; color: var(--dim); flex: 1;
        }

        .card-footer {
          display: flex; align-items: center; justify-content: space-between;
          margin-top: 1.4rem; padding-top: 1rem;
          border-top: 1px solid var(--border);
        }

        .card-score {
          font-family: 'Bebas Neue', sans-serif;
          font-size: 2rem; letter-spacing: 0.04em; line-height: 1;
          color: var(--gold);
          filter: drop-shadow(0 0 10px rgba(240,190,64,0.25));
        }

        .card-score.no-score { color: var(--faint); font-size: 1.2rem; letter-spacing: 0; }

        .card-reviews {
          font-family: 'DM Mono', monospace;
          font-size: 0.58rem; letter-spacing: 0.1em;
          color: var(--faint); text-align: right;
        }

        /* Score bar at bottom of card */
        .card-bar {
          position: absolute; bottom: 0; left: 0; right: 0;
          height: 2px; background: rgba(140,200,240,0.05);
        }
        .card-bar-fill {
          height: 100%;
          background: linear-gradient(90deg, var(--ice), var(--frost));
          box-shadow: 0 0 6px rgba(140,200,240,0.4);
        }

        /* Empty state */
        .empty {
          grid-column: 1 / -1;
          text-align: center; padding: 5rem 2rem;
          border: 1px dashed rgba(140,200,240,0.1);
          border-radius: 8px;
        }
        .empty-title {
          font-family: 'Bebas Neue', sans-serif;
          font-size: 2rem; letter-spacing: 0.06em; color: var(--frost); opacity: 0.3;
          margin-bottom: 0.5rem;
        }
        .empty-body {
          font-family: 'Instrument Serif', serif; font-style: italic;
          font-size: 0.95rem; color: var(--muted);
        }

        /* ── Animations ── */
        @keyframes rise {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        /* ── Responsive ── */
        @media (max-width: 900px) {
          .body { grid-template-columns: 1fr; padding: 2rem 2rem 7rem; }
          .sidebar { position: static; }
          .country-list { display: none; }
          .hero { padding: 5rem 2rem 3rem; }
          .ar-nav { padding: 1rem 2rem; }
        }
        @media (max-width: 640px) {
          .resort-grid { grid-template-columns: 1fr; }
          .hero-row { flex-direction: column; align-items: flex-start; }
        }
      `}</style>

      <div className="atmo" aria-hidden="true" />
      <div className="grid-lines" aria-hidden="true" />

      {/* ━━━ Nav ━━━ */}
      <nav className="ar-nav">
        <Link href="/" className="nav-logo">AlpineRank</Link>
        <div className="nav-links">
          <Link href="/rankings" className="nav-link">Rankings</Link>
          <Link href="/" className="nav-link" style={{ gap: 0 }}>← Home</Link>
        </div>
      </nav>

      {/* ━━━ Hero ━━━ */}
      <div className="hero">
        <p className="hero-eyebrow">
          {country ? `Filtered by country` : "All destinations"}
        </p>
        <div className="hero-row">
          <h1 className="hero-title">
            {country ?? "Resorts"}
          </h1>
          <div className="hero-count">
            <div className="hero-count-val">{resorts.length}</div>
            <div className="hero-count-label">{country ? "in this country" : "total resorts"}</div>
          </div>
        </div>

        {country && (
          <div className="filter-banner">
            <span className="filter-label">Filtering by</span>
            <span className="filter-value">{country}</span>
            <Link href="/resorts" className="filter-clear">✕ Clear filter</Link>
          </div>
        )}
      </div>

      {/* ━━━ Body ━━━ */}
      <div className="body">

        {/* Sidebar — country filter */}
        <aside className="sidebar">
          <div className="sidebar-head">Countries</div>
          <div className="country-list">
            {allCountries.map((c) => (
              <Link
                key={c.Country}
                href={`/resorts?country=${encodeURIComponent(c.Country)}`}
                className={`country-link${country === c.Country ? " active" : ""}`}
              >
                <span className="c-name">{c.Country}</span>
              </Link>
            ))}
          </div>
          {country && (
            <Link href="/resorts" className="show-all">Show all countries</Link>
          )}
        </aside>

        {/* Resort grid */}
        <div className="resort-area">
          <div className="area-head">
            <span className="area-title">
              {country ? country : "All Resorts"}
            </span>
            <div className="area-rule" />
            <span className="area-badge">
              {resorts.length} {resorts.length === 1 ? "resort" : "resorts"}
            </span>
          </div>

          <div className="resort-grid">
            {resorts.length === 0 ? (
              <div className="empty">
                <div className="empty-title">No resorts found</div>
                <p className="empty-body">Try selecting a different country.</p>
              </div>
            ) : (
              resorts.map((resort) => (
                <Link key={resort.id} href={`/resorts/${resort.id}`} className="resort-card">
                  {resort.Continent && (
                    <span className="card-continent">{resort.Continent}</span>
                  )}
                  <span className="card-name">{resort.name}</span>
                  <span className="card-country">{resort.Country}</span>

                  <div className="card-footer">
                    {resort.averageOverallRating != null ? (
                      <span className="card-score">
                        {resort.averageOverallRating.toFixed(1)}
                      </span>
                    ) : (
                      <span className="card-score no-score">Unrated</span>
                    )}
                    <div className="card-reviews">
                      <div style={{ fontSize: "1.1rem", fontFamily: "'Bebas Neue', sans-serif", color: "var(--frost)", lineHeight: 1 }}>
                        {resort.reviewCount}
                      </div>
                      {resort.reviewCount === 1 ? "review" : "reviews"}
                    </div>
                  </div>

                  {/* Score bar */}
                  <div className="card-bar">
                    <div
                      className="card-bar-fill"
                      style={{
                        width: resort.averageOverallRating != null
                          ? `${(resort.averageOverallRating / 10) * 100}%`
                          : "0%",
                      }}
                    />
                  </div>
                </Link>
              ))
            )}
          </div>
        </div>

      </div>
    </main>
  );
}