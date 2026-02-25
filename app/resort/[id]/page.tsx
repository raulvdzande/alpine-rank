import { prisma } from "@/lib/prisma";
import { notFound, redirect } from "next/navigation";
import Link from "next/link";

export const dynamic = "force-dynamic";

interface Props {
  params: Promise<{ id: string }>;
}

const METRICS = ["terrain", "snow", "lifts", "apres", "family", "value", "scenery"] as const;
type Metric = typeof METRICS[number];

const METRIC_LABELS: Record<Metric, string> = {
  terrain: "Terrain",
  snow:    "Snow Quality",
  lifts:   "Lifts",
  apres:   "Après-Ski",
  family:  "Family",
  value:   "Value",
  scenery: "Scenery",
};

const METRIC_ICONS: Record<Metric, string> = {
  terrain: "◈",
  snow:    "❄",
  lifts:   "⟁",
  apres:   "◉",
  family:  "⬡",
  value:   "◇",
  scenery: "△",
};

/* ─────────────────────────────────────────
   ScoreRing — animated SVG progress ring
───────────────────────────────────────── */
function ScoreRing({ score, count }: { score: number | null; count: number }) {
  const R   = 54;
  const C   = 2 * Math.PI * R;
  const pct = score != null ? score / 10 : 0;
  const dash = C * pct;

  return (
    <div className="score-ring-wrap">
      <svg viewBox="0 0 128 128" width="180" height="180" className="score-ring-svg">
        {/* Outer glow ring */}
        <circle cx="64" cy="64" r="60" fill="none" stroke="rgba(160,210,240,0.04)" strokeWidth="1" />
        {/* Track */}
        <circle cx="64" cy="64" r={R} fill="none" stroke="rgba(160,210,240,0.07)" strokeWidth="8" />
        {/* Progress */}
        {score != null && (
          <circle
            cx="64" cy="64" r={R}
            fill="none"
            stroke="url(#scoreGrad)"
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={`${dash} ${C}`}
            strokeDashoffset={C / 4}
            className="score-ring-progress"
          />
        )}
        <defs>
          <linearGradient id="scoreGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#f0c040" />
            <stop offset="100%" stopColor="#ffd97d" />
          </linearGradient>
          <filter id="glow">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
          </filter>
        </defs>
        {/* Center text */}
        <text x="64" y="56" textAnchor="middle" dominantBaseline="middle"
          fontSize="28" fontFamily="'Bebas Neue', sans-serif" letterSpacing="0.03em"
          fill={score != null ? "#f0c040" : "rgba(200,232,255,0.2)"}
          filter="url(#glow)"
        >
          {score != null ? score.toFixed(1) : "—"}
        </text>
        <text x="64" y="76" textAnchor="middle" dominantBaseline="middle"
          fontSize="7" fontFamily="'DM Mono', monospace" letterSpacing="0.25em"
          fill="rgba(200,232,255,0.3)"
        >
          OVERALL
        </text>
        <text x="64" y="90" textAnchor="middle" dominantBaseline="middle"
          fontSize="6.5" fontFamily="'DM Mono', monospace" letterSpacing="0.1em"
          fill="rgba(200,232,255,0.18)"
        >
          {count} {count === 1 ? "review" : "reviews"}
        </text>
      </svg>
    </div>
  );
}

/* ─────────────────────────────────────────
   RadarChart — pure SVG, zero deps
───────────────────────────────────────── */
function RadarChart({ reviews }: { reviews: Array<Record<string, unknown>> }) {
  const SIZE = 280, CX = SIZE / 2, CY = SIZE / 2, RADIUS = 105, N = METRICS.length;

  const avgs = METRICS.map((key) =>
    reviews.length > 0
      ? reviews.reduce((s, r) => s + (r[key] as number), 0) / reviews.length
      : 0
  );

  const angle = (i: number) => -Math.PI / 2 + (i * 2 * Math.PI) / N;
  const pt = (r: number, i: number): [number, number] => [
    CX + r * Math.cos(angle(i)),
    CY + r * Math.sin(angle(i)),
  ];

  const polyPts = avgs
    .map((v, i) => pt((v / 10) * RADIUS, i).map((n) => n.toFixed(2)).join(","))
    .join(" ");

  return (
    <svg viewBox={`0 0 ${SIZE} ${SIZE}`} width="100%" style={{ overflow: "visible" }}>
      <defs>
        <radialGradient id="radarFill" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="rgba(160,210,240,0.25)" />
          <stop offset="100%" stopColor="rgba(160,210,240,0.04)" />
        </radialGradient>
        <filter id="radarGlow">
          <feGaussianBlur stdDeviation="2.5" result="blur"/>
          <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
        </filter>
      </defs>

      {/* Grid rings */}
      {[0.25, 0.5, 0.75, 1].map((frac, fi) => (
        <polygon
          key={frac}
          points={METRICS.map((_, i) => pt(frac * RADIUS, i).map((n) => n.toFixed(2)).join(",")).join(" ")}
          fill={fi === 3 ? "none" : "none"}
          stroke={fi === 3 ? "rgba(160,210,240,0.14)" : "rgba(160,210,240,0.06)"}
          strokeWidth={fi === 3 ? 1.5 : 1}
          strokeDasharray={fi === 3 ? "none" : "3 4"}
        />
      ))}

      {/* Spokes */}
      {METRICS.map((key, i) => {
        const [x2, y2] = pt(RADIUS, i);
        return (
          <line key={key}
            x1={CX} y1={CY} x2={x2} y2={y2}
            stroke="rgba(160,210,240,0.1)" strokeWidth="1"
          />
        );
      })}

      {/* Data area */}
      {reviews.length > 0 && (
        <>
          <polygon points={polyPts} fill="url(#radarFill)" />
          <polygon
            points={polyPts}
            fill="none"
            stroke="rgba(160,210,240,0.7)"
            strokeWidth="1.5"
            strokeLinejoin="round"
            filter="url(#radarGlow)"
          />
          {avgs.map((v, i) => {
            const [cx2, cy2] = pt((v / 10) * RADIUS, i);
            return (
              <g key={i}>
                <circle cx={cx2} cy={cy2} r="5" fill="rgba(160,210,240,0.15)" />
                <circle cx={cx2} cy={cy2} r="2.5" fill="#a0d2f0" filter="url(#radarGlow)" />
              </g>
            );
          })}
        </>
      )}

      {/* Labels */}
      {METRICS.map((key, i) => {
        const [lx, ly] = pt(RADIUS + 24, i);
        const avg = avgs[i];
        return (
          <g key={key}>
            <text x={lx} y={ly - 5}
              textAnchor="middle" dominantBaseline="middle"
              fontSize="8.5" fontFamily="'DM Mono', monospace"
              letterSpacing="0.1em" fill="rgba(200,232,255,0.4)"
            >
              {METRIC_LABELS[key].split(" ")[0].toUpperCase()}
            </text>
            {reviews.length > 0 && (
              <text x={lx} y={ly + 7}
                textAnchor="middle" dominantBaseline="middle"
                fontSize="8" fontFamily="'Bebas Neue', sans-serif"
                fill="rgba(160,210,240,0.6)"
              >
                {avg.toFixed(1)}
              </text>
            )}
          </g>
        );
      })}
    </svg>
  );
}

/* ─────────────────────────────────────────
   RatingForm — slider-based inputs
───────────────────────────────────────── */
function RatingForm({ action, resortId }: { action: (fd: FormData) => Promise<void>; resortId: string }) {
  return (
    <form action={action} className="rf-form">
      <input type="hidden" name="resortId" value={resortId} />
      <input type="hidden" name="userId" value="" />

      <div className="rf-sliders">
        {METRICS.map((key, i) => (
          <div key={key} className="rf-row" style={{ animationDelay: `${0.05 * i}s` }}>
            <div className="rf-row-head">
              <span className="rf-icon">{METRIC_ICONS[key]}</span>
              <label className="rf-label" htmlFor={`rf-${key}`}>
                {METRIC_LABELS[key]}
              </label>
              <output className="rf-output" id={`out-${key}`}>5</output>
            </div>
            <div className="rf-track-wrap">
              <input
                id={`rf-${key}`}
                name={key}
                type="range"
                min="1" max="10" step="0.5"
                defaultValue="5"
                className="rf-slider"
                onInput={`this.parentElement.parentElement.querySelector('#out-${key}').value=this.value` as unknown as React.FormEventHandler}
              />
              <div className="rf-track-fill" />
            </div>
          </div>
        ))}
      </div>

      <button type="submit" className="rf-submit">
        <span className="rf-submit-text">Submit Rating</span>
        <span className="rf-submit-arrow">→</span>
      </button>
    </form>
  );
}

/* ─────────────────────────────────────────
   Page
───────────────────────────────────────── */
export default async function ResortPage({ params }: Props) {
  const { id } = await params;

  const resort = await prisma.resort.findUnique({
    where: { id },
    include: { reviews: { include: { user: true } } },
  });

  if (!resort) return notFound();

  async function submitReview(formData: FormData) {
    "use server";
    const terrain = Number(formData.get("terrain"));
    const snow    = Number(formData.get("snow"));
    const lifts   = Number(formData.get("lifts"));
    const apres   = Number(formData.get("apres"));
    const family  = Number(formData.get("family"));
    const value   = Number(formData.get("value"));
    const scenery = Number(formData.get("scenery"));
    const userId  = formData.get("userId") as string;
    const overall = (terrain + snow + lifts + apres + family + value + scenery) / 7;

    await prisma.review.create({
      data: { userId, resortId: id, terrain, snow, lifts, apres, family, value, scenery, overall },
    });

    const allReviews     = await prisma.review.findMany({ where: { resortId: id } });
    const reviewCount    = allReviews.length;
    const averageOverall = reviewCount > 0
      ? allReviews.reduce((s, r) => s + r.overall, 0) / reviewCount : 0;

    await prisma.resort.update({
      where: { id },
      data: { averageOverallRating: averageOverall, reviewCount },
    });

    redirect(`/resorts/${id}`);
  }

  const metricAverages = METRICS.map((key) => ({
    key,
    label: METRIC_LABELS[key],
    icon: METRIC_ICONS[key],
    avg: resort.reviews.length > 0
      ? resort.reviews.reduce((s, r) => s + (r[key] as number), 0) / resort.reviews.length
      : 0,
  }));

  const topMetric = resort.reviews.length > 0
    ? metricAverages.reduce((a, b) => a.avg > b.avg ? a : b)
    : null;

  return (
    <main className="ar-root">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Instrument+Sans:ital,wght@0,400;0,500;0,600;1,400&family=Instrument+Serif:ital@0;1&family=DM+Mono:wght@300;400&display=swap');

        :root {
          --bg:         #02060e;
          --surface:    #060c18;
          --panel:      #080f1e;
          --lift:       #0c1428;
          --border:     rgba(140,200,240,0.08);
          --border-hi:  rgba(140,200,240,0.22);
          --border-glow:rgba(140,200,240,0.4);
          --ice:        #9dd0f0;
          --frost:      #c5e5ff;
          --white:      #e8f4ff;
          --dim:        rgba(197,229,255,0.4);
          --muted:      rgba(197,229,255,0.22);
          --faint:      rgba(197,229,255,0.1);
          --gold:       #f0be40;
          --gold-dim:   rgba(240,190,64,0.3);
          --gold-faint: rgba(240,190,64,0.08);
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

        /* ════════════════════════════
           HERO
        ════════════════════════════ */
        .hero {
          position: relative;
          min-height: 100svh;
          display: flex;
          flex-direction: column;
          justify-content: flex-end;
          overflow: hidden;
        }

        /* Atmospheric layers */
        .hero-atmo {
          position: absolute; inset: 0; pointer-events: none; z-index: 0;
          background:
            radial-gradient(ellipse 120% 60% at 50% -10%, rgba(60,140,220,0.22) 0%, transparent 58%),
            radial-gradient(ellipse 60% 50% at 10% 90%, rgba(30,80,200,0.1) 0%, transparent 55%),
            radial-gradient(ellipse 50% 40% at 90% 80%, rgba(10,50,160,0.08) 0%, transparent 50%);
        }

        /* Contour grid */
        .hero-grid {
          position: absolute; inset: 0; pointer-events: none; z-index: 0;
          background-image:
            repeating-linear-gradient(0deg, transparent, transparent 79px, rgba(140,200,240,0.025) 79px, rgba(140,200,240,0.025) 80px),
            repeating-linear-gradient(90deg, transparent, transparent 79px, rgba(140,200,240,0.018) 79px, rgba(140,200,240,0.018) 80px);
        }

        /* Noise texture */
        .hero-noise {
          position: absolute; inset: 0; pointer-events: none; z-index: 0; opacity: 0.4;
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='200' height='200' filter='url(%23n)' opacity='0.04'/%3E%3C/svg%3E");
        }

        /* Snow particles */
        .snow { position: absolute; inset: 0; pointer-events: none; z-index: 1; overflow: hidden; }

        .flake {
          position: absolute;
          top: -10px;
          border-radius: 50%;
          background: rgba(200,232,255,0.6);
          animation: fall linear infinite;
        }

        ${Array.from({ length: 28 }, (_, i) => {
          const size = 1 + (i % 4) * 0.7;
          const left = (i * 37 + 11) % 100;
          const dur  = 8 + (i * 13 % 12);
          const del  = -(i * 7 % 20);
          const blur = i % 3 === 0 ? "filter:blur(0.5px);" : "";
          return `.flake:nth-child(${i + 1}){width:${size}px;height:${size}px;left:${left}%;animation-duration:${dur}s;animation-delay:${del}s;${blur}opacity:${0.2 + (i % 5) * 0.1};}`;
        }).join("")}

        @keyframes fall {
          0%   { transform: translateY(-10px) translateX(0) rotate(0deg); }
          25%  { transform: translateY(25vh) translateX(12px) rotate(90deg); }
          50%  { transform: translateY(50vh) translateX(-8px) rotate(180deg); }
          75%  { transform: translateY(75vh) translateX(15px) rotate(270deg); }
          100% { transform: translateY(105vh) translateX(-5px) rotate(360deg); opacity: 0; }
        }

        /* Mountain silhouette */
        .hero-mountain {
          position: absolute;
          bottom: 0; left: 0; right: 0;
          width: 100%;
          pointer-events: none;
          z-index: 2;
        }

        /* Sticky nav */
        .ar-nav {
          position: fixed; top: 0; left: 0; right: 0;
          z-index: 100;
          display: flex; align-items: center; justify-content: space-between;
          padding: 1.1rem 3rem;
          background: rgba(2,6,14,0);
          transition: background 0.4s, border-color 0.4s, backdrop-filter 0.4s;
        }

        .ar-nav.scrolled {
          background: rgba(2,6,14,0.85);
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

        .nav-actions { display: flex; align-items: center; gap: 1.5rem; }

        .nav-back {
          font-family: 'DM Mono', monospace;
          font-size: 0.58rem; letter-spacing: 0.22em; text-transform: uppercase;
          color: var(--muted); text-decoration: none;
          display: flex; align-items: center; gap: 0.5rem;
          transition: color 0.15s;
          padding: 0.55rem 1.1rem;
          border: 1px solid var(--border);
          border-radius: 2px;
        }
        .nav-back::before { content: '←'; font-family: sans-serif; opacity: 0.6; }
        .nav-back:hover { color: var(--ice); border-color: var(--border-hi); }

        /* Hero content */
        .hero-content {
          position: relative; z-index: 10;
          padding: 0 4rem 5rem;
          display: grid;
          grid-template-columns: 1fr auto;
          align-items: end;
          gap: 2rem;
          max-width: 1300px;
          margin: 0 auto;
          width: 100%;
        }

        .hero-meta {
          display: flex; align-items: center; gap: 0.8rem;
          margin-bottom: 1rem;
          animation: slideUp 0.8s cubic-bezier(0.16,1,0.3,1) 0.1s both;
        }

        .meta-tag {
          font-family: 'DM Mono', monospace;
          font-size: 0.58rem; letter-spacing: 0.28em; text-transform: uppercase;
          color: var(--muted);
          background: rgba(140,200,240,0.06);
          border: 1px solid var(--border);
          padding: 0.3rem 0.7rem;
          border-radius: 2px;
        }

        .meta-sep { color: var(--faint); font-size: 0.7rem; }

        .hero-name {
          font-family: 'Bebas Neue', sans-serif;
          font-size: clamp(4rem, 9vw, 9rem);
          line-height: 0.88;
          letter-spacing: 0.01em;
          color: var(--white);
          margin-bottom: 1.4rem;
          filter: drop-shadow(0 0 80px rgba(80,160,240,0.15));
          animation: slideUp 0.8s cubic-bezier(0.16,1,0.3,1) 0.2s both;
        }

        .hero-subline {
          font-family: 'Instrument Serif', serif; font-style: italic;
          font-size: 1.05rem; color: var(--dim);
          animation: slideUp 0.8s cubic-bezier(0.16,1,0.3,1) 0.3s both;
          display: flex; align-items: center; gap: 0.5rem;
        }

        .hero-score-wrap {
          animation: slideUp 0.8s cubic-bezier(0.16,1,0.3,1) 0.25s both;
          display: flex; flex-direction: column; align-items: center;
          gap: 0.8rem;
        }

        .score-ring-wrap { position: relative; }

        .score-ring-svg {
          filter: drop-shadow(0 0 30px rgba(240,190,64,0.15));
        }

        .score-ring-progress {
          transition: stroke-dasharray 1.5s cubic-bezier(0.16,1,0.3,1) 0.5s;
        }

        /* Best metric badge */
        .best-badge {
          font-family: 'DM Mono', monospace;
          font-size: 0.58rem; letter-spacing: 0.18em; text-transform: uppercase;
          color: var(--gold);
          border: 1px solid rgba(240,190,64,0.25);
          padding: 0.35rem 0.9rem;
          border-radius: 2px;
          background: var(--gold-faint);
          white-space: nowrap;
        }

        /* ════════════════════════════
           QUICK-STATS BAR
        ════════════════════════════ */
        .quick-bar {
          background: var(--surface);
          border-top: 1px solid var(--border);
          border-bottom: 1px solid var(--border);
          position: relative; z-index: 5;
          overflow-x: auto;
          scrollbar-width: none;
        }
        .quick-bar::-webkit-scrollbar { display: none; }

        .quick-bar-inner {
          display: flex;
          max-width: 1300px;
          margin: 0 auto;
        }

        .quick-cell {
          flex: 1;
          padding: 1.5rem 1.8rem;
          display: flex; flex-direction: column; align-items: center; gap: 0.4rem;
          border-right: 1px solid var(--border);
          position: relative;
          min-width: 90px;
          transition: background 0.15s;
        }
        .quick-cell:last-child { border-right: none; }
        .quick-cell:hover { background: rgba(140,200,240,0.03); }

        .qc-icon {
          font-size: 0.9rem; opacity: 0.4; line-height: 1;
          transition: opacity 0.15s;
        }
        .quick-cell:hover .qc-icon { opacity: 0.7; }

        .qc-score {
          font-family: 'Bebas Neue', sans-serif;
          font-size: 1.6rem; letter-spacing: 0.04em; line-height: 1;
          color: var(--frost);
          transition: color 0.15s;
        }
        .quick-cell:hover .qc-score { color: var(--ice); }

        .qc-label {
          font-family: 'DM Mono', monospace;
          font-size: 0.52rem; letter-spacing: 0.18em; text-transform: uppercase;
          color: var(--faint);
          white-space: nowrap;
        }

        .qc-bar {
          position: absolute; bottom: 0; left: 0; right: 0;
          height: 2px;
          background: rgba(140,200,240,0.06);
          overflow: hidden;
        }

        .qc-bar-fill {
          height: 100%;
          background: linear-gradient(90deg, var(--ice), var(--frost));
          box-shadow: 0 0 6px rgba(140,200,240,0.6);
        }

        /* ════════════════════════════
           MAIN CONTENT
        ════════════════════════════ */
        .content {
          max-width: 1300px;
          margin: 0 auto;
          padding: 6rem 4rem 10rem;
          position: relative;
          z-index: 5;
        }

        /* Section header */
        .sec-head {
          display: flex; align-items: baseline; gap: 1rem;
          margin-bottom: 2.5rem;
        }

        .sec-title {
          font-family: 'Bebas Neue', sans-serif;
          font-size: 2.5rem; letter-spacing: 0.06em; color: var(--frost); line-height: 1;
        }

        .sec-rule {
          flex: 1; height: 1px;
          background: linear-gradient(90deg, var(--border-hi), transparent);
        }

        .sec-badge {
          font-family: 'DM Mono', monospace;
          font-size: 0.6rem; letter-spacing: 0.18em;
          color: var(--muted);
          border: 1px solid var(--border);
          border-radius: 2px;
          padding: 0.28rem 0.7rem;
        }

        /* ════════════════════════════
           BREAKDOWN + FORM GRID
        ════════════════════════════ */
        .analysis-grid {
          display: grid;
          grid-template-columns: 1fr 420px;
          gap: 2.5rem;
          margin-bottom: 7rem;
          align-items: start;
        }

        /* Metric bars */
        .metrics-panel {
          background: var(--surface);
          border: 1px solid var(--border);
          border-radius: 8px;
          padding: 2.5rem;
          margin-bottom: 2rem;
        }

        .metrics-panel-head {
          font-family: 'DM Mono', monospace;
          font-size: 0.58rem; letter-spacing: 0.3em; text-transform: uppercase;
          color: var(--ice); opacity: 0.5;
          display: flex; align-items: center; gap: 0.6rem;
          margin-bottom: 2.2rem;
        }
        .metrics-panel-head::after {
          content: ''; flex: 1; height: 1px;
          background: linear-gradient(90deg, var(--border-hi), transparent);
        }

        .metric-row {
          display: grid;
          grid-template-columns: 22px 90px 1fr 38px;
          align-items: center;
          gap: 0.8rem;
          padding: 0.55rem 0;
          border-bottom: 1px solid var(--border);
          animation: fadeIn 0.5s ease both;
        }

        .metric-row:last-child { border-bottom: none; }

        ${METRICS.map((_, i) => `.metric-row:nth-child(${i + 1}){animation-delay:${i * 0.06}s}`).join("")}

        .m-icon {
          font-size: 0.75rem; color: var(--muted);
          text-align: center; line-height: 1;
        }

        .m-name {
          font-family: 'DM Mono', monospace;
          font-size: 0.6rem; letter-spacing: 0.12em; text-transform: uppercase;
          color: var(--muted);
        }

        .m-track {
          height: 4px;
          background: rgba(140,200,240,0.07);
          border-radius: 4px;
          overflow: hidden;
          position: relative;
        }

        .m-fill {
          height: 100%; border-radius: 4px;
          background: linear-gradient(90deg, var(--ice) 0%, var(--frost) 100%);
          box-shadow: 0 0 10px rgba(140,200,240,0.5);
          animation: growBar 1s cubic-bezier(0.16,1,0.3,1) both;
          transform-origin: left;
        }

        ${METRICS.map((_, i) => `.metric-row:nth-child(${i + 1}) .m-fill{animation-delay:${0.1 + i * 0.06}s}`).join("")}

        @keyframes growBar {
          from { transform: scaleX(0); }
          to   { transform: scaleX(1); }
        }

        .m-val {
          font-family: 'Bebas Neue', sans-serif;
          font-size: 1.2rem; letter-spacing: 0.05em; line-height: 1;
          color: var(--frost); text-align: right;
        }

        .m-val.empty { color: var(--faint); font-size: 0.9rem; letter-spacing: 0; }

        /* Radar panel */
        .radar-panel {
          background: var(--surface);
          border: 1px solid var(--border);
          border-radius: 8px;
          padding: 2rem;
        }

        .radar-panel-head {
          font-family: 'DM Mono', monospace;
          font-size: 0.58rem; letter-spacing: 0.3em; text-transform: uppercase;
          color: var(--ice); opacity: 0.5;
          display: flex; align-items: center; gap: 0.6rem;
          margin-bottom: 1.5rem;
        }
        .radar-panel-head::after {
          content: ''; flex: 1; height: 1px;
          background: linear-gradient(90deg, var(--border-hi), transparent);
        }

        /* ════════════════════════════
           RATING FORM
        ════════════════════════════ */
        .form-card {
          background: var(--surface);
          border: 1px solid var(--border);
          border-radius: 8px;
          padding: 2.5rem;
          position: relative;
          overflow: hidden;
        }

        .form-card::before {
          content: '';
          position: absolute; top: 0; left: 0; right: 0; height: 1px;
          background: linear-gradient(90deg, transparent, var(--border-hi) 40%, var(--border-hi) 60%, transparent);
        }

        .form-card::after {
          content: '';
          position: absolute; top: -60px; right: -60px;
          width: 200px; height: 200px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(140,200,240,0.06) 0%, transparent 70%);
          pointer-events: none;
        }

        .form-title {
          font-family: 'Bebas Neue', sans-serif;
          font-size: 2rem; letter-spacing: 0.06em; color: var(--frost);
          margin-bottom: 0.4rem;
        }

        .form-subtitle {
          font-family: 'Instrument Serif', serif; font-style: italic;
          font-size: 0.9rem; color: var(--muted);
          margin-bottom: 2rem;
        }

        .rf-form { display: flex; flex-direction: column; gap: 0; }

        .rf-sliders {
          display: flex; flex-direction: column;
          gap: 0;
          margin-bottom: 1.8rem;
        }

        .rf-row {
          padding: 0.9rem 0;
          border-bottom: 1px solid var(--border);
          animation: fadeIn 0.4s ease both;
        }
        .rf-row:last-child { border-bottom: none; }

        .rf-row-head {
          display: flex; align-items: center; gap: 0.6rem;
          margin-bottom: 0.65rem;
        }

        .rf-icon {
          font-size: 0.7rem; color: var(--muted); width: 16px; text-align: center;
          flex-shrink: 0;
        }

        .rf-label {
          font-family: 'DM Mono', monospace;
          font-size: 0.58rem; letter-spacing: 0.18em; text-transform: uppercase;
          color: var(--muted); flex: 1;
        }

        .rf-output {
          font-family: 'Bebas Neue', sans-serif;
          font-size: 1.05rem; letter-spacing: 0.05em;
          color: var(--ice); min-width: 28px; text-align: right;
        }

        .rf-track-wrap {
          padding-left: 22px;
          position: relative;
        }

        .rf-slider {
          -webkit-appearance: none; appearance: none;
          width: 100%; height: 4px;
          background: rgba(140,200,240,0.1);
          border-radius: 4px;
          outline: none;
          cursor: pointer;
          position: relative;
        }

        .rf-slider::-webkit-slider-thumb {
          -webkit-appearance: none;
          width: 14px; height: 14px;
          border-radius: 50%;
          background: var(--ice);
          cursor: pointer;
          box-shadow: 0 0 0 3px rgba(140,200,240,0.15), 0 0 12px rgba(140,200,240,0.4);
          transition: transform 0.15s, box-shadow 0.15s;
        }

        .rf-slider::-moz-range-thumb {
          width: 14px; height: 14px;
          border-radius: 50%; border: none;
          background: var(--ice);
          cursor: pointer;
          box-shadow: 0 0 0 3px rgba(140,200,240,0.15), 0 0 12px rgba(140,200,240,0.4);
        }

        .rf-slider:focus::-webkit-slider-thumb {
          transform: scale(1.3);
          box-shadow: 0 0 0 4px rgba(140,200,240,0.2), 0 0 20px rgba(140,200,240,0.6);
        }

        .rf-slider::-webkit-slider-runnable-track {
          height: 4px;
          background: linear-gradient(90deg,
            var(--ice) calc(var(--val, 40%) * 1%),
            rgba(140,200,240,0.1) calc(var(--val, 40%) * 1%)
          );
          border-radius: 4px;
        }

        .rf-submit {
          position: relative; width: 100%;
          display: flex; align-items: center; justify-content: center; gap: 0.8rem;
          font-family: 'DM Mono', monospace;
          font-size: 0.7rem; letter-spacing: 0.3em; text-transform: uppercase;
          color: var(--bg);
          background: var(--ice);
          border: none; border-radius: 4px;
          padding: 1.1rem 2rem;
          cursor: pointer; overflow: hidden; isolation: isolate;
          transition: box-shadow 0.25s, transform 0.15s;
          box-shadow: 0 0 40px rgba(140,200,240,0.18), inset 0 1px 0 rgba(255,255,255,0.3);
        }

        .rf-submit::before {
          content: '';
          position: absolute; inset: 0;
          background: linear-gradient(135deg, transparent 0%, rgba(255,255,255,0.12) 50%, transparent 100%);
          transform: translateX(-100%) skewX(-20deg);
          transition: transform 0.6s ease;
          z-index: 0;
        }

        .rf-submit:hover::before { transform: translateX(200%) skewX(-20deg); }
        .rf-submit:hover {
          box-shadow: 0 0 70px rgba(140,200,240,0.35), inset 0 1px 0 rgba(255,255,255,0.4);
          transform: translateY(-1px);
        }
        .rf-submit:active { transform: translateY(0); }
        .rf-submit-text, .rf-submit-arrow { position: relative; z-index: 1; }
        .rf-submit-arrow { font-family: sans-serif; transition: transform 0.2s; }
        .rf-submit:hover .rf-submit-arrow { transform: translateX(3px); }

        /* ════════════════════════════
           REVIEWS
        ════════════════════════════ */
        .reviews-section { margin-top: 2rem; }

        .reviews-grid {
          display: flex; flex-direction: column;
          gap: 0.6rem;
        }

        .review-card {
          background: var(--surface);
          border: 1px solid var(--border);
          border-radius: 6px;
          padding: 1.8rem 2rem;
          position: relative;
          transition: background 0.15s, border-color 0.15s;
          overflow: hidden;
          animation: fadeIn 0.5s ease both;
        }

        ${Array.from({ length: 10 }, (_, i) => `.review-card:nth-child(${i + 1}){animation-delay:${i * 0.04}s}`).join("")}

        .review-card::before {
          content: '';
          position: absolute; left: 0; top: 0; bottom: 0;
          width: 3px; border-radius: 0 2px 2px 0;
          background: linear-gradient(to bottom, var(--ice), transparent);
          opacity: 0;
          transition: opacity 0.2s;
        }

        .review-card:hover { background: rgba(140,200,240,0.03); border-color: var(--border-hi); }
        .review-card:hover::before { opacity: 1; }

        .review-header {
          display: flex; align-items: flex-start; justify-content: space-between;
          margin-bottom: 1.2rem; gap: 1rem;
        }

        .review-author-wrap {}

        .review-author {
          font-weight: 600; font-size: 0.95rem; color: var(--frost);
          margin-bottom: 0.2rem;
        }

        .review-date {
          font-family: 'DM Mono', monospace;
          font-size: 0.58rem; letter-spacing: 0.12em; color: var(--faint);
        }

        .review-score-wrap { text-align: right; flex-shrink: 0; }

        .review-score {
          font-family: 'Bebas Neue', sans-serif;
          font-size: 2.5rem; letter-spacing: 0.04em; line-height: 1;
          color: var(--gold);
          filter: drop-shadow(0 0 12px rgba(240,190,64,0.25));
        }

        .review-score-label {
          font-family: 'DM Mono', monospace;
          font-size: 0.52rem; letter-spacing: 0.15em; text-transform: uppercase;
          color: var(--muted); display: block;
        }

        .review-chips {
          display: flex; flex-wrap: wrap;
          gap: 0.3rem 0.5rem;
        }

        .chip {
          display: inline-flex; align-items: center; gap: 0.3rem;
          font-family: 'DM Mono', monospace;
          font-size: 0.58rem; letter-spacing: 0.08em;
          background: var(--panel);
          border: 1px solid var(--border);
          border-radius: 2px;
          padding: 0.22rem 0.55rem;
          color: var(--muted);
          transition: border-color 0.15s;
        }

        .review-card:hover .chip { border-color: rgba(140,200,240,0.12); }

        .chip-icon { opacity: 0.5; font-size: 0.65rem; }
        .chip-val { color: var(--dim); font-family: 'Instrument Sans', sans-serif; font-size: 0.65rem; }

        /* Empty state */
        .empty {
          text-align: center;
          padding: 5rem 2rem;
          border: 1px dashed rgba(140,200,240,0.1);
          border-radius: 8px;
          background: radial-gradient(ellipse 60% 60% at 50% 50%, rgba(140,200,240,0.03) 0%, transparent 70%);
        }

        .empty-icon {
          font-size: 2rem; margin-bottom: 1rem; opacity: 0.2;
        }

        .empty-title {
          font-family: 'Bebas Neue', sans-serif;
          font-size: 2rem; letter-spacing: 0.06em; color: var(--frost);
          margin-bottom: 0.6rem; opacity: 0.4;
        }

        .empty-body {
          font-family: 'Instrument Serif', serif; font-style: italic;
          font-size: 1rem; color: var(--muted);
        }

        /* ════════════════════════════
           DIVIDER
        ════════════════════════════ */
        .divider {
          height: 1px; margin: 0 0 5rem;
          background: linear-gradient(90deg, transparent, var(--border-hi) 20%, var(--border-hi) 80%, transparent);
        }

        /* ════════════════════════════
           KEYFRAMES
        ════════════════════════════ */
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(28px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(12px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        /* ════════════════════════════
           RESPONSIVE
        ════════════════════════════ */
        @media (max-width: 900px) {
          .analysis-grid { grid-template-columns: 1fr; }
          .hero-content { grid-template-columns: 1fr; padding: 0 2rem 4rem; }
          .hero-score-wrap { align-self: flex-start; }
          .content { padding: 4rem 2rem 7rem; }
          .ar-nav { padding: 1rem 2rem; }
          .quick-bar-inner { padding: 0 1rem; }
        }

        @media (max-width: 640px) {
          .hero-name { font-size: clamp(3.2rem, 12vw, 5.5rem); }
          .quick-cell { padding: 1.2rem 1rem; min-width: 72px; }
          .qc-score { font-size: 1.3rem; }
        }
      `}</style>

      {/* ━━━ Nav ━━━ */}
      <nav className="ar-nav" id="ar-nav">
        <Link href="/" className="nav-logo">AlpineRank</Link>
        <div className="nav-actions">
          <Link href="/rankings" className="nav-back">Rankings</Link>
        </div>
      </nav>

      {/* ━━━ Hero ━━━ */}
      <section className="hero">
        <div className="hero-atmo" aria-hidden="true" />
        <div className="hero-grid"  aria-hidden="true" />
        <div className="hero-noise" aria-hidden="true" />

        {/* Snowfall */}
        <div className="snow" aria-hidden="true">
          {Array.from({ length: 28 }, (_, i) => (
            <div key={i} className="flake" />
          ))}
        </div>

        {/* Mountain */}
        <svg className="hero-mountain" viewBox="0 0 1440 360" preserveAspectRatio="none" aria-hidden="true">
          <defs>
            <linearGradient id="mtnGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="rgba(140,200,240,0.07)" />
              <stop offset="100%" stopColor="rgba(2,6,14,0.95)" />
            </linearGradient>
            <linearGradient id="snowCap" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="rgba(200,232,255,0.12)" />
              <stop offset="100%" stopColor="transparent" />
            </linearGradient>
          </defs>
          {/* Back range */}
          <path d="M0,360 L0,260 L180,120 L340,210 L480,80 L620,190 L760,60 L900,180 L1060,50 L1200,160 L1340,90 L1440,140 L1440,360 Z"
            fill="rgba(6,12,24,0.6)" />
          {/* Front range */}
          <path d="M0,360 L0,300 L120,200 L260,280 L400,160 L560,260 L680,140 L820,240 L960,110 L1100,230 L1240,150 L1380,220 L1440,180 L1440,360 Z"
            fill="url(#mtnGrad)" />
          {/* Snow caps */}
          <path d="M400,160 L370,215 L430,215 Z M680,140 L650,195 L710,195 Z M960,110 L930,165 L990,165 Z M480,80 L445,140 L515,140 Z M760,60 L725,120 L795,120 Z M1060,50 L1025,110 L1095,110 Z"
            fill="url(#snowCap)" />
        </svg>

        <div className="hero-content">
          <div>
            <div className="hero-meta">
              {resort.Continent && <span className="meta-tag">{resort.Continent}</span>}
              {resort.Continent && <span className="meta-sep">·</span>}
              <span className="meta-tag">{resort.Country}</span>
            </div>
            <h1 className="hero-name">{resort.name}</h1>
            <p className="hero-subline">
              {resort.Country}
              {resort.Continent && <><span style={{ opacity: 0.3, margin: "0 0.3rem" }}>·</span>{resort.Continent}</>}
            </p>
          </div>

          <div className="hero-score-wrap">
            <ScoreRing
              score={resort.averageOverallRating ?? null}
              count={resort.reviewCount}
            />
            {topMetric && resort.reviews.length > 0 && (
              <div className="best-badge">
                {topMetric.icon} Best: {topMetric.label.split(" ")[0]}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ━━━ Quick-stats bar ━━━ */}
      <div className="quick-bar">
        <div className="quick-bar-inner">
          {metricAverages.map(({ key, icon, label, avg }) => (
            <div key={key} className="quick-cell">
              <span className="qc-icon">{icon}</span>
              <span className="qc-score">
                {resort.reviews.length > 0 ? avg.toFixed(1) : "—"}
              </span>
              <span className="qc-label">{label.split(" ")[0]}</span>
              <div className="qc-bar">
                <div className="qc-bar-fill" style={{ width: `${(avg / 10) * 100}%` }} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ━━━ Main content ━━━ */}
      <div className="content">

        {/* Section: Analysis */}
        <div className="sec-head">
          <h2 className="sec-title">Analysis</h2>
          <div className="sec-rule" />
          <span className="sec-badge">{resort.reviews.length} ratings</span>
        </div>

        <div className="analysis-grid">
          {/* Left: metric bars + radar */}
          <div>
            <div className="metrics-panel">
              <div className="metrics-panel-head">Rating Breakdown</div>
              {metricAverages.map(({ key, icon, label, avg }) => (
                <div key={key} className="metric-row">
                  <span className="m-icon">{icon}</span>
                  <span className="m-name">{label}</span>
                  <div className="m-track">
                    <div className="m-fill" style={{ width: `${(avg / 10) * 100}%` }} />
                  </div>
                  <span className={`m-val${resort.reviews.length === 0 ? " empty" : ""}`}>
                    {resort.reviews.length > 0 ? avg.toFixed(1) : "—"}
                  </span>
                </div>
              ))}
            </div>

            {resort.reviews.length > 0 && (
              <div className="radar-panel">
                <div className="radar-panel-head">Performance Shape</div>
                <RadarChart reviews={resort.reviews as unknown as Array<Record<string, unknown>>} />
              </div>
            )}
          </div>

          {/* Right: form */}
          <div className="form-card">
            <div className="form-title">Rate this resort</div>
            <p className="form-subtitle">Move the sliders to set your scores</p>
            <RatingForm action={submitReview} resortId={id} />
          </div>
        </div>

        <div className="divider" />

        {/* Section: Reviews */}
        <section className="reviews-section">
          <div className="sec-head">
            <h2 className="sec-title">Reviews</h2>
            <div className="sec-rule" />
            <span className="sec-badge">{resort.reviews.length} total</span>
          </div>

          {resort.reviews.length === 0 ? (
            <div className="empty">
              <div className="empty-icon">❄</div>
              <div className="empty-title">No reviews yet</div>
              <p className="empty-body">Be the first to rate {resort.name} above.</p>
            </div>
          ) : (
            <div className="reviews-grid">
              {resort.reviews.map((review) => (
                <div key={review.id} className="review-card">
                  <div className="review-header">
                    <div className="review-author-wrap">
                      <div className="review-author">{review.user.name}</div>
                      <div className="review-date">
                        {new Date(review.createdAt).toLocaleDateString("en-US", {
                          month: "short", day: "numeric", year: "numeric"
                        })}
                      </div>
                    </div>
                    <div className="review-score-wrap">
                      <div className="review-score">{review.overall.toFixed(1)}</div>
                      <span className="review-score-label">Overall</span>
                    </div>
                  </div>
                  <div className="review-chips">
                    {METRICS.map((key) => (
                      <span key={key} className="chip">
                        <span className="chip-icon">{METRIC_ICONS[key]}</span>
                        <span>{METRIC_LABELS[key].split(" ")[0]}</span>
                        <span className="chip-val">{review[key] as number}</span>
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

      </div>

      {/* Nav scroll behaviour */}
      <script dangerouslySetInnerHTML={{ __html: `
        (function(){
          var nav = document.getElementById('ar-nav');
          if(!nav) return;
          function upd(){ nav.classList.toggle('scrolled', window.scrollY > 60); }
          window.addEventListener('scroll', upd, { passive: true });
          upd();
        })();
      `}} />

      {/* Slider live output */}
      <script dangerouslySetInnerHTML={{ __html: `
        document.addEventListener('input', function(e){
          if(e.target.classList.contains('rf-slider')){
            var id = e.target.id.replace('rf-','out-');
            var out = document.getElementById(id);
            if(out) out.value = parseFloat(e.target.value).toFixed(1);
          }
        });
      `}} />
    </main>
  );
}