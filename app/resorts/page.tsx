import { prisma } from "@/lib/prisma";
import Link from "next/link";

interface SearchParams {
  q?: string;
  continent?: string;
  country?: string;
  sort?: string;
  min?: string;
}

interface Props {
  searchParams: Promise<SearchParams>;
}

const SORT_OPTIONS = [
  { value: "rating_desc",  label: "Top Rated" },
  { value: "rating_asc",   label: "Lowest Rated" },
  { value: "name_asc",     label: "A → Z" },
  { value: "name_desc",    label: "Z → A" },
  { value: "reviews_desc", label: "Most Reviewed" },
] as const;

const PREVIEW_METRICS = ["terrain", "snow", "lifts", "apres"] as const;

function ScoreRing({ rating, count }: { rating: number | null; count: number }) {
  const pct = rating != null ? (rating / 10) * 100 : 0;
  const R = 24, C = 2 * Math.PI * R;
  const dash = (pct / 100) * C;

  return (
    <div className="card-score-wrap">
      <svg viewBox="0 0 60 60" width="64" height="64">
        <defs>
          <linearGradient id="cg" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#f0c040" />
            <stop offset="100%" stopColor="#ffd97d" />
          </linearGradient>
          <filter id="cglow">
            <feGaussianBlur stdDeviation="1.5" result="b" />
            <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
        </defs>
        <circle cx="30" cy="30" r={R} fill="none" stroke="rgba(160,210,240,0.08)" strokeWidth="4" />
        {rating != null && (
          <circle
            cx="30" cy="30" r={R}
            fill="none" stroke="url(#cg)" strokeWidth="4"
            strokeLinecap="round"
            strokeDasharray={`${dash} ${C}`}
            strokeDashoffset={C / 4}
            filter="url(#cglow)"
          />
        )}
        <text x="30" y="30" textAnchor="middle" dominantBaseline="central"
          fontSize="13" fontFamily="'Bebas Neue', sans-serif" letterSpacing="0.03em"
          fill={rating != null ? "#f0c040" : "rgba(200,232,255,0.2)"}
        >
          {rating != null ? rating.toFixed(1) : "—"}
        </text>
      </svg>
      <span className="card-review-count">
        {count} {count === 1 ? "review" : "reviews"}
      </span>
    </div>
  );
}

export default async function ResortsPage({ searchParams }: Props) {
  const sp = await searchParams;
  const query     = sp.q?.trim() ?? "";
  const continent = sp.continent ?? "";
  const country   = sp.country ?? "";
  const sort      = sp.sort ?? "rating_desc";
  const minRating = sp.min ? parseFloat(sp.min) : 0;
  const hasFilters = !!(query || continent || country || minRating || sort !== "rating_desc");

  // Where clause
  const where: Record<string, unknown> = {};
  if (query)     where.name      = { contains: query,     mode: "insensitive" };
  if (continent) where.Continent = { equals:   continent, mode: "insensitive" };
  if (country)   where.Country   = { equals:   country,   mode: "insensitive" };
  if (minRating > 0) where.averageOverallRating = { gte: minRating };

  // OrderBy
  type SortVal = typeof SORT_OPTIONS[number]["value"];
  const orderByMap: Record<SortVal, object> = {
    rating_desc:  { averageOverallRating: "desc" },
    rating_asc:   { averageOverallRating: "asc"  },
    name_asc:     { name: "asc"  },
    name_desc:    { name: "desc" },
    reviews_desc: { reviewCount: "desc" },
  };
  const orderBy = orderByMap[sort as SortVal] ?? orderByMap.rating_desc;

  const [resorts, allResorts] = await Promise.all([
    prisma.resort.findMany({ where, orderBy, take: 72 }),
    prisma.resort.findMany({ select: { Continent: true, Country: true } }),
  ]);

  const totalCount = await prisma.resort.count({ where });

  const continents = [...new Set(allResorts.map(r => r.Continent).filter(Boolean))].sort() as string[];
  const countries  = (continent
    ? allResorts.filter(r => r.Continent === continent)
    : allResorts
  ).map(r => r.Country).filter((v): v is string => !!v);
  const uniqueCountries = [...new Set(countries)].sort();

  return (
    <main className="root">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Instrument+Sans:ital,wght@0,400;0,500;0,600;1,400&family=Instrument+Serif:ital@0;1&family=DM+Mono:wght@300;400&display=swap');

        :root {
          --bg:          #02060e;
          --surface:     #060c18;
          --panel:       #080f1e;
          --lift:        #0c1428;
          --border:      rgba(140,200,240,0.08);
          --border-hi:   rgba(140,200,240,0.22);
          --ice:         #9dd0f0;
          --frost:       #c5e5ff;
          --white:       #e8f4ff;
          --dim:         rgba(197,229,255,0.4);
          --muted:       rgba(197,229,255,0.22);
          --faint:       rgba(197,229,255,0.1);
          --gold:        #f0be40;
          --gold-faint:  rgba(240,190,64,0.08);
        }

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        html { scroll-behavior: smooth; }

        .root {
          font-family: 'Instrument Sans', sans-serif;
          background: var(--bg);
          color: var(--frost);
          min-height: 100svh;
          overflow-x: hidden;
        }

        /* ══ NAV ══ */
        .nav {
          position: sticky; top: 0; z-index: 100;
          display: flex; align-items: center; justify-content: space-between;
          padding: 1.1rem 3rem;
          background: rgba(2,6,14,0.90);
          border-bottom: 1px solid var(--border);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
        }

        .nav-logo {
          font-family: 'Bebas Neue', sans-serif;
          font-size: 1.5rem; letter-spacing: 0.05em;
          background: linear-gradient(160deg, var(--white) 0%, var(--frost) 50%, var(--ice) 100%);
          -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
          text-decoration: none;
          filter: drop-shadow(0 0 18px rgba(100,180,240,0.25));
        }

        .nav-links { display: flex; align-items: center; gap: 1rem; }

        .nav-link {
          font-family: 'DM Mono', monospace;
          font-size: 0.58rem; letter-spacing: 0.22em; text-transform: uppercase;
          color: var(--muted); text-decoration: none;
          padding: 0.5rem 1rem;
          border: 1px solid transparent; border-radius: 2px;
          transition: color 0.15s, border-color 0.15s, background 0.15s;
        }
        .nav-link:hover { color: var(--ice); border-color: var(--border); }
        .nav-link.active {
          color: var(--ice); border-color: var(--border-hi);
          background: rgba(140,200,240,0.05);
        }

        /* ══ HEADER ══ */
        .page-header {
          position: relative; overflow: hidden;
          padding: 5rem 3rem 3.5rem;
          border-bottom: 1px solid var(--border);
        }

        .ph-atmo {
          position: absolute; inset: 0; pointer-events: none;
          background:
            radial-gradient(ellipse 100% 200% at 85% 50%, rgba(60,140,220,0.12) 0%, transparent 58%),
            radial-gradient(ellipse 55% 120% at 10% 65%, rgba(30,80,200,0.07) 0%, transparent 55%);
        }

        .ph-grid {
          position: absolute; inset: 0; pointer-events: none;
          background-image:
            repeating-linear-gradient(0deg, transparent, transparent 39px, rgba(140,200,240,0.018) 39px, rgba(140,200,240,0.018) 40px),
            repeating-linear-gradient(90deg, transparent, transparent 39px, rgba(140,200,240,0.013) 39px, rgba(140,200,240,0.013) 40px);
        }

        .ph-inner {
          position: relative; z-index: 2;
          max-width: 1300px; margin: 0 auto;
          display: flex; align-items: flex-end; justify-content: space-between; gap: 2rem;
          flex-wrap: wrap;
        }

        .ph-eyebrow {
          font-family: 'DM Mono', monospace;
          font-size: 0.58rem; letter-spacing: 0.3em; text-transform: uppercase;
          color: var(--muted);
          display: flex; align-items: center; gap: 0.6rem;
          margin-bottom: 0.8rem;
          animation: fadeUp 0.6s ease both;
        }

        .ph-dot { width: 4px; height: 4px; border-radius: 50%; background: var(--ice); opacity: 0.45; }

        .ph-title {
          font-family: 'Bebas Neue', sans-serif;
          font-size: clamp(3.5rem, 6vw, 7rem); line-height: 0.9;
          letter-spacing: 0.02em; color: var(--white);
          filter: drop-shadow(0 0 60px rgba(80,160,240,0.10));
          animation: fadeUp 0.6s ease 0.05s both;
        }

        .ph-sub {
          font-family: 'Instrument Serif', serif; font-style: italic;
          font-size: 1rem; color: var(--dim); margin-top: 0.9rem;
          animation: fadeUp 0.6s ease 0.1s both;
        }

        .ph-stat {
          display: flex; flex-direction: column; align-items: flex-end;
          animation: fadeUp 0.6s ease 0.15s both;
        }

        .ph-stat-num {
          font-family: 'Bebas Neue', sans-serif;
          font-size: 4rem; line-height: 1; letter-spacing: 0.04em;
          color: var(--ice);
          filter: drop-shadow(0 0 24px rgba(140,200,240,0.3));
        }

        .ph-stat-label {
          font-family: 'DM Mono', monospace;
          font-size: 0.56rem; letter-spacing: 0.25em; text-transform: uppercase;
          color: var(--muted);
        }

        /* ══ CONTROLS ══ */
        .controls {
          background: var(--surface);
          border-bottom: 1px solid var(--border);
          position: sticky; top: 57px; z-index: 50;
        }

        .controls-inner {
          max-width: 1300px; margin: 0 auto;
          padding: 1rem 3rem;
          display: flex; align-items: center; gap: 0.7rem; flex-wrap: wrap;
        }

        .search-wrap { position: relative; flex: 1; min-width: 200px; max-width: 340px; }

        .search-icon {
          position: absolute; left: 0.9rem; top: 50%; transform: translateY(-50%);
          font-size: 0.85rem; color: var(--muted); pointer-events: none; line-height: 1;
        }

        .search-input {
          width: 100%;
          font-family: 'DM Mono', monospace;
          font-size: 0.68rem; letter-spacing: 0.1em;
          color: var(--frost);
          background: var(--panel);
          border: 1px solid var(--border); border-radius: 3px;
          padding: 0.7rem 0.9rem 0.7rem 2.3rem;
          outline: none;
          transition: border-color 0.15s, box-shadow 0.15s;
          -webkit-appearance: none;
        }
        .search-input::placeholder { color: var(--faint); }
        .search-input:focus {
          border-color: var(--border-hi);
          box-shadow: 0 0 0 3px rgba(140,200,240,0.06);
        }

        .filter-select {
          font-family: 'DM Mono', monospace;
          font-size: 0.6rem; letter-spacing: 0.1em; text-transform: uppercase;
          color: var(--muted);
          background: var(--panel);
          border: 1px solid var(--border); border-radius: 3px;
          padding: 0.7rem 2.2rem 0.7rem 0.85rem;
          outline: none; cursor: pointer;
          -webkit-appearance: none; appearance: none;
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='6' viewBox='0 0 10 6'%3E%3Cpath d='M0 0l5 6 5-6z' fill='rgba(197%2C229%2C255%2C0.2)'/%3E%3C/svg%3E");
          background-repeat: no-repeat;
          background-position: right 0.7rem center;
          transition: border-color 0.15s, color 0.15s;
          min-width: 130px;
        }
        .filter-select:focus, .filter-select:hover { border-color: var(--border-hi); color: var(--ice); }
        .filter-select option { background: #080f1e; }

        .min-wrap {
          display: flex; align-items: center; gap: 0.5rem;
          background: var(--panel); border: 1px solid var(--border); border-radius: 3px;
          padding: 0.7rem 0.85rem; white-space: nowrap;
        }

        .min-label {
          font-family: 'DM Mono', monospace;
          font-size: 0.58rem; letter-spacing: 0.12em; text-transform: uppercase;
          color: var(--faint);
        }

        .min-select {
          font-family: 'Bebas Neue', sans-serif;
          font-size: 1rem; letter-spacing: 0.05em;
          color: var(--gold); background: transparent;
          border: none; outline: none; cursor: pointer;
          -webkit-appearance: none; appearance: none;
        }
        .min-select option { background: #080f1e; font-family: sans-serif; font-size: 0.8rem; }

        .ctrl-btn {
          font-family: 'DM Mono', monospace;
          font-size: 0.58rem; letter-spacing: 0.2em; text-transform: uppercase;
          border-radius: 3px; padding: 0.7rem 1rem; cursor: pointer;
          white-space: nowrap; text-decoration: none; display: inline-flex; align-items: center;
          transition: color 0.15s, border-color 0.15s, background 0.15s;
        }

        .apply-btn {
          color: var(--bg); background: var(--ice); border: 1px solid var(--ice);
        }
        .apply-btn:hover { background: var(--frost); border-color: var(--frost); }

        .clear-btn {
          color: var(--muted); background: none; border: 1px solid var(--border);
        }
        .clear-btn:hover { color: var(--ice); border-color: var(--border-hi); }

        .results-meta {
          margin-left: auto;
          font-family: 'DM Mono', monospace;
          font-size: 0.57rem; letter-spacing: 0.15em; text-transform: uppercase;
          color: var(--faint); white-space: nowrap;
        }
        .results-meta strong { color: var(--ice); font-weight: 400; }

        /* ══ GRID ══ */
        .grid-wrap {
          max-width: 1300px; margin: 0 auto;
          padding: 2.5rem 3rem 8rem;
        }

        .resort-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(310px, 1fr));
          gap: 1px;
          border: 1px solid var(--border);
          border-radius: 8px;
          overflow: hidden;
          background: var(--border);
        }

        /* ══ CARD ══ */
        .resort-card {
          background: var(--surface);
          padding: 1.8rem;
          position: relative;
          text-decoration: none; color: inherit;
          display: flex; flex-direction: column; gap: 1.1rem;
          overflow: hidden;
          transition: background 0.18s;
          animation: fadeUp 0.4s ease both;
        }

        ${Array.from({ length: 36 }, (_, i) =>
          `.resort-card:nth-child(${i + 1}){animation-delay:${Math.min(i * 0.025, 0.45)}s}`
        ).join("")}

        .resort-card::before {
          content: '';
          position: absolute; inset: 0;
          background: radial-gradient(ellipse 80% 80% at 50% -10%, rgba(140,200,240,0.04) 0%, transparent 60%);
          opacity: 0; transition: opacity 0.25s; pointer-events: none;
        }

        .resort-card::after {
          content: '';
          position: absolute; top: 0; left: 0; right: 0; height: 1px;
          background: linear-gradient(90deg, transparent, rgba(140,200,240,0.28) 50%, transparent);
          opacity: 0; transition: opacity 0.25s;
        }

        .resort-card:hover { background: var(--lift); }
        .resort-card:hover::before, .resort-card:hover::after { opacity: 1; }

        /* Index number (top-right corner) */
        .card-index {
          position: absolute; top: 1rem; right: 1.2rem;
          font-family: 'Bebas Neue', sans-serif;
          font-size: 0.75rem; letter-spacing: 0.12em;
          color: rgba(197,229,255,0.08);
          transition: color 0.2s;
        }
        .resort-card:hover .card-index { color: rgba(197,229,255,0.15); }

        .card-top {
          display: flex; align-items: flex-start; justify-content: space-between; gap: 0.8rem;
        }

        .card-meta { flex: 1; min-width: 0; }

        .card-tags {
          display: flex; align-items: center; gap: 0.35rem; flex-wrap: wrap;
          margin-bottom: 0.5rem;
        }

        .card-tag {
          font-family: 'DM Mono', monospace;
          font-size: 0.49rem; letter-spacing: 0.2em; text-transform: uppercase;
          color: var(--muted);
          background: rgba(140,200,240,0.05);
          border: 1px solid var(--border);
          border-radius: 2px;
          padding: 0.18rem 0.45rem;
          white-space: nowrap;
          transition: border-color 0.15s;
        }
        .resort-card:hover .card-tag { border-color: rgba(140,200,240,0.12); }

        .card-name {
          font-family: 'Bebas Neue', sans-serif;
          font-size: clamp(1.55rem, 2.2vw, 1.9rem);
          line-height: 0.9; letter-spacing: 0.02em;
          color: var(--white);
          word-break: break-word;
          transition: color 0.15s;
        }
        .resort-card:hover .card-name { color: var(--frost); }

        .card-score-wrap {
          display: flex; flex-direction: column; align-items: center; gap: 0.25rem;
          flex-shrink: 0; padding-top: 0.15rem;
        }

        .card-review-count {
          font-family: 'DM Mono', monospace;
          font-size: 0.48rem; letter-spacing: 0.1em;
          color: var(--faint); white-space: nowrap;
        }

        /* Mini metrics */
        .card-metrics { display: grid; grid-template-columns: 1fr 1fr; gap: 0.3rem 1rem; }

        .mini-metric { display: flex; align-items: center; gap: 0.4rem; }

        .mini-label {
          font-family: 'DM Mono', monospace;
          font-size: 0.48rem; letter-spacing: 0.1em; text-transform: uppercase;
          color: var(--faint); min-width: 38px; flex-shrink: 0;
        }

        .mini-track {
          flex: 1; height: 2px;
          background: rgba(140,200,240,0.06);
          border-radius: 2px; overflow: hidden;
        }

        .mini-fill {
          height: 100%; border-radius: 2px;
          background: linear-gradient(90deg, rgba(157,208,240,0.55), rgba(197,229,255,0.75));
          box-shadow: 0 0 5px rgba(140,200,240,0.4);
        }

        .mini-val {
          font-family: 'Bebas Neue', sans-serif;
          font-size: 0.75rem; letter-spacing: 0.04em; line-height: 1;
          color: var(--dim); min-width: 24px; text-align: right;
        }

        /* Footer */
        .card-footer {
          display: flex; align-items: center; justify-content: space-between;
          padding-top: 0.8rem;
          border-top: 1px solid var(--border);
        }

        .card-cta {
          font-family: 'DM Mono', monospace;
          font-size: 0.54rem; letter-spacing: 0.2em; text-transform: uppercase;
          color: var(--muted);
          display: flex; align-items: center; gap: 0.4rem;
          transition: color 0.15s, gap 0.2s;
        }
        .card-cta::after { content: '→'; font-family: sans-serif; }
        .resort-card:hover .card-cta { color: var(--ice); gap: 0.7rem; }

        .no-reviews-note {
          font-family: 'Instrument Serif', serif; font-style: italic;
          font-size: 0.78rem; color: var(--faint);
        }

        /* ══ EMPTY ══ */
        .empty {
          text-align: center; padding: 7rem 2rem;
          grid-column: 1 / -1; background: var(--surface);
        }

        .empty-icon { font-size: 2.5rem; margin-bottom: 1.2rem; opacity: 0.18; display: block; }

        .empty-title {
          font-family: 'Bebas Neue', sans-serif;
          font-size: 3rem; letter-spacing: 0.06em; color: var(--frost); opacity: 0.3;
          margin-bottom: 0.6rem;
        }

        .empty-sub {
          font-family: 'Instrument Serif', serif; font-style: italic;
          font-size: 1rem; color: var(--muted);
        }

        /* ══ KEYFRAMES ══ */
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(14px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        /* ══ RESPONSIVE ══ */
        @media (max-width: 900px) {
          .nav  { padding: 1rem 1.5rem; }
          .page-header { padding: 3.5rem 1.5rem 2.5rem; }
          .controls-inner { padding: 0.9rem 1.5rem; }
          .grid-wrap { padding: 1.8rem 1.5rem 5rem; }
        }

        @media (max-width: 600px) {
          .resort-grid { grid-template-columns: 1fr; }
          .results-meta { display: none; }
          .ph-title { font-size: clamp(2.8rem, 10vw, 4.5rem); }
          .filter-select { min-width: 0; }
        }
      `}</style>

      {/* ━━━ Nav ━━━ */}
      <nav className="nav">
        <Link href="/" className="nav-logo">AlpineRank</Link>
        <div className="nav-links">
          <Link href="/resorts"  className="nav-link active">Resorts</Link>
          <Link href="/rankings" className="nav-link">Rankings</Link>
        </div>
      </nav>

      {/* ━━━ Header ━━━ */}
      <header className="page-header">
        <div className="ph-atmo" aria-hidden="true" />
        <div className="ph-grid"  aria-hidden="true" />
        <div className="ph-inner">
          <div>
            <div className="ph-eyebrow">
              <div className="ph-dot" />
              Browse
            </div>
            <h1 className="ph-title">All Resorts</h1>
            <p className="ph-sub">Discover, compare &amp; rate ski destinations worldwide</p>
          </div>
          <div className="ph-stat">
            <div className="ph-stat-num">{totalCount}</div>
            <div className="ph-stat-label">{hasFilters ? "Results Found" : "Resorts Indexed"}</div>
          </div>
        </div>
      </header>

      {/* ━━━ Controls ━━━ */}
      <form className="controls" method="GET" action="/resorts">
        <div className="controls-inner">
          {/* Search */}
          <div className="search-wrap">
            <span className="search-icon">⌕</span>
            <input
              className="search-input"
              name="q" type="search"
              placeholder="Search by name…"
              defaultValue={query}
              autoComplete="off"
            />
          </div>

          {/* Continent */}
          <select className="filter-select" name="continent" defaultValue={continent}>
            <option value="">All Continents</option>
            {continents.map(c => <option key={c} value={c}>{c}</option>)}
          </select>

          {/* Country */}
          <select className="filter-select" name="country" defaultValue={country}>
            <option value="">All Countries</option>
            {uniqueCountries.map(c => <option key={c} value={c}>{c}</option>)}
          </select>

          {/* Min rating */}
          <div className="min-wrap">
            <span className="min-label">Min ★</span>
            <select className="min-select" name="min" defaultValue={sp.min ?? ""}>
              <option value="">Any</option>
              <option value="5">5.0+</option>
              <option value="6">6.0+</option>
              <option value="7">7.0+</option>
              <option value="8">8.0+</option>
              <option value="9">9.0+</option>
            </select>
          </div>

          {/* Sort */}
          <select className="filter-select" name="sort" defaultValue={sort}>
            {SORT_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>

          <button type="submit" className="ctrl-btn apply-btn">Apply</button>

          {hasFilters && (
            <Link href="/resorts" className="ctrl-btn clear-btn">Clear</Link>
          )}

          <div className="results-meta">
            <strong>{totalCount}</strong> resort{totalCount !== 1 ? "s" : ""}
          </div>
        </div>
      </form>

      {/* ━━━ Grid ━━━ */}
      <div className="grid-wrap">
        <div className="resort-grid">
          {resorts.length === 0 ? (
            <div className="empty">
              <span className="empty-icon">❄</span>
              <div className="empty-title">No resorts found</div>
              <p className="empty-sub">Try adjusting your filters or search term.</p>
            </div>
          ) : (
            resorts.map((resort, idx) => (
              <Link key={resort.id} href={`/resorts/${resort.id}`} className="resort-card">
                <span className="card-index">#{String(idx + 1).padStart(2, "0")}</span>

                <div className="card-top">
                  <div className="card-meta">
                    <div className="card-tags">
                      {resort.Country   && <span className="card-tag">{resort.Country}</span>}
                      {resort.Continent && <span className="card-tag">{resort.Continent}</span>}
                    </div>
                    <div className="card-name">{resort.name}</div>
                  </div>
                  <ScoreRing rating={resort.averageOverallRating} count={resort.reviewCount} />
                </div>

                {resort.reviewCount > 0 ? (
                  <div className="card-metrics">
                    {PREVIEW_METRICS.map(key => {
                      const val = (resort as Record<string, unknown>)[key] as number | null ?? 0;
                      return (
                        <div key={key} className="mini-metric">
                          <span className="mini-label">{key}</span>
                          <div className="mini-track">
                            <div className="mini-fill" style={{ width: `${(val / 10) * 100}%` }} />
                          </div>
                          <span className="mini-val">{typeof val === "number" ? val.toFixed(1) : "—"}</span>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <p className="no-reviews-note">No ratings yet — be the first.</p>
                )}

                <div className="card-footer">
                  <span className="card-cta">View Resort</span>
                </div>
              </Link>
            ))
          )}
        </div>
      </div>
    </main>
  );
}