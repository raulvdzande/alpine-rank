import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import {
  gradientFor, emojiFor, countryNL, toFiveStars, stars, fmtCount, fmtNumber, snowBar,
} from "@/lib/display";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const user = await getCurrentUser();
  if (!user) redirect("/wishlist");
  let totalResorts = 0, totalReviews = 0, countriesGrouped: { Country: string }[] = [];
  let topResorts: Awaited<ReturnType<typeof prisma.resort.findMany>> = [];
  let snowTop: Awaited<ReturnType<typeof prisma.resort.findMany>> = [];
  let beginnersPick: Awaited<ReturnType<typeof prisma.resort.findFirst>> = null;

  try {
    const [resortsCount, reviewAgg, countries, top, snow] = await Promise.all([
      prisma.resort.count(),
      prisma.resort.aggregate({ _sum: { reviewCount: true } }),
      prisma.resort.groupBy({ by: ["Country"] }),
      prisma.resort.findMany({ where: { reviewCount: { gt: 0 } }, orderBy: { averageOverallRating: "desc" }, take: 3 }),
      prisma.resort.findMany({ orderBy: { snowScore: "desc" }, take: 6 }),
    ]);
    totalResorts = resortsCount;
    totalReviews = reviewAgg._sum.reviewCount ?? 0;
    countriesGrouped = countries;
    topResorts = top;
    snowTop = snow;
    beginnersPick = await prisma.resort.findFirst({ where: { category: "Beginners" }, orderBy: { snowScore: "desc" } });
  } catch (err) {
    console.error("[HomePage] DB error:", err);
  }

  const heroTop = topResorts[0];

  return (
    <>
      {/* HERO */}
      <section className="hero">
        <div className="container">
          <div className="hero-eyebrow">
            <span className="hero-eyebrow-dot" />
            New: Snow certainty score 2025–26 is live
          </div>
          <h1>The <span className="gradient">rankings skiers</span> trust</h1>
          <p className="hero-sub">Compare {fmtNumber(totalResorts)} ski resorts on snow quality, piste km, level and price. Find your perfect resort with AI — in 10 seconds.</p>
          <div className="hero-actions">
            <Link href="/matcher" className="btn btn-primary btn-xl">Start AI Matcher for free →</Link>
            <Link href="/resorts" className="btn btn-outline btn-lg">View all rankings</Link>
          </div>
          <div className="hero-trust">
            <div className="hero-trust-avatars">
              <span>👤</span><span>👤</span><span>👤</span><span>👤</span><span>👤</span>
            </div>
            <div>
              <div className="hero-trust-stars">★★★★★</div>
              <p className="hero-trust-text">Based on {fmtNumber(totalReviews)} verified reviews</p>
            </div>
          </div>
        </div>

        <div className="container">
          <div className="hero-visual">
            <svg viewBox="0 0 1100 340" xmlns="http://www.w3.org/2000/svg" className="mountain-bg" preserveAspectRatio="none">
              <polygon points="0,340 220,80 380,220 520,40 700,180 850,60 1100,200 1100,340" fill="#d1e8f5" opacity=".5" />
              <polygon points="0,340 220,120 380,260 520,100 700,220 850,110 1100,240 1100,340" fill="#b8d9ef" opacity=".6" />
              <polygon points="0,340 0,280 200,160 350,290 500,140 680,270 820,150 1000,260 1100,200 1100,340" fill="white" opacity=".9" />
              <polygon points="520,40 480,120 560,120" fill="white" opacity=".95" />
              <polygon points="850,60 820,130 880,130" fill="white" opacity=".95" />
              <polygon points="220,80 185,150 255,150" fill="white" opacity=".85" />
              <g fill="#2d5a3d" opacity=".4">
                <polygon points="100,260 108,295 92,295" />
                <polygon points="140,250 148,288 132,288" />
                <polygon points="920,230 928,265 912,265" />
                <polygon points="960,240 968,275 952,275" />
                <polygon points="1000,220 1008,260 992,260" />
              </g>
            </svg>

            {heroTop && (
              <div className="resort-card-float" style={{ bottom: 40, left: 40, maxWidth: 200 }}>
                <div className="rci" style={{ background: "#e8f4fc" }}>{emojiFor(heroTop.id)}</div>
                <div>
                  <div className="rcname">{heroTop.name}</div>
                  <div className="rcsub">{countryNL(heroTop.Country)} · {heroTop.pisteKm} km</div>
                  <div className="stars-row">{stars(toFiveStars(heroTop.averageOverallRating))} <span style={{ color: "#9a9a8e", fontSize: 10 }}>({fmtCount(heroTop.reviewCount)})</span></div>
                </div>
              </div>
            )}

            {heroTop && (
              <div className="snow-badge" style={{ top: 24, right: 160 }}>
                <span className="dot" />
                <span style={{ fontSize: 12, fontWeight: 600 }}>Snow score: {heroTop.snowScore?.toFixed(1)}</span>
              </div>
            )}

            {beginnersPick && (
              <div className="resort-card-float" style={{ bottom: 40, right: 40, maxWidth: 210 }}>
                <div className="rci" style={{ background: "#eaf5ec" }}>⛷</div>
                <div>
                  <div className="rcname">#1 for beginners</div>
                  <div className="rcsub">{beginnersPick.name}</div>
                  <div className="stars-row" style={{ color: "var(--peak)" }}>✓ AI Recommendation</div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* LOGOS */}
      <section className="logos">
        <div className="container">
          <p className="logos-label">Trusted by skiers heading to these resorts</p>
          <div className="logos-row">
            {topResorts.concat(snowTop).slice(0, 8).map((r) => (
              <div className="logo-item" key={"logo" + r.id}>{r.name}</div>
            ))}
          </div>
        </div>
      </section>

      {/* STATS BAR */}
      <section className="stats-bar">
        <div className="container">
          <div className="stats-inner">
            <div className="stat-item"><div className="stat-number">{fmtNumber(totalResorts)}</div><div className="stat-label">Ski resorts ranked</div></div>
            <div className="stat-item"><div className="stat-number">{fmtNumber(totalReviews)}</div><div className="stat-label">Verified reviews</div></div>
            <div className="stat-item"><div className="stat-number">{countriesGrouped.length}</div><div className="stat-label">Countries covered</div></div>
            <div className="stat-item"><div className="stat-number">10 years</div><div className="stat-label">Historical snow data</div></div>
            <div className="stat-item"><div className="stat-number">98%</div><div className="stat-label">Snow certainty accuracy</div></div>
          </div>
        </div>
      </section>

      {/* PROBLEM */}
      <section className="section" style={{ background: "var(--snow)" }}>
        <div className="container">
          <span className="label">The problem</span>
          <h2>Resort planning is broken</h2>
          <div className="problem-grid">
            <div className="problem-card">
              <span className="problem-icon">😤</span>
              <h3>Unreliable reviews</h3>
              <p style={{ fontSize: 14 }}>TripAdvisor and Google are full of unverifiable reviews from people who were never there. You don&apos;t know who to trust.</p>
            </div>
            <div className="problem-card">
              <span className="problem-icon">🌫</span>
              <h3>No snow guarantee</h3>
              <p style={{ fontSize: 14 }}>Snow conditions are hard to compare. Every website says their resort is &quot;excellent&quot;. You book €2,000 and land on green runs.</p>
            </div>
            <div className="problem-card">
              <span className="problem-icon">👥</span>
              <h3>Groups with mixed levels</h3>
              <p style={{ fontSize: 14 }}>Eight people, four levels, three budgets. The same conflict every year. Nobody has a tool that actually helps find a compromise.</p>
            </div>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="section" style={{ background: "var(--white)" }}>
        <div className="container" style={{ textAlign: "center" }}>
          <span className="label">How it works</span>
          <h2>From uncertainty to perfect holiday<br />in three steps</h2>
          <div className="steps">
            <div className="step">
              <div className="step-num">1</div>
              <h3>Enter your criteria</h3>
              <p>Level, budget, trip duration and what you&apos;re looking for. The AI Matcher does the rest — no endless scrolling.</p>
            </div>
            <div className="step">
              <div className="step-num">2</div>
              <h3>Compare with real data</h3>
              <p>Snow certainty score, verified reviews, piste km per level, lift prices and travel time. Everything side by side.</p>
            </div>
            <div className="step">
              <div className="step-num">3</div>
              <h3>Book with confidence</h3>
              <p>Save to your wishlist, set snow alerts and track conditions at your resort before departure.</p>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="section" style={{ background: "var(--snow)" }}>
        <div className="container">
          <span className="label">Features</span>
          <h2>Everything you need for<br />a better ski holiday</h2>
          <div className="features-grid">
            {[
              { ic: "🤖", bg: "var(--peak-light)", h: "AI Resort Matcher", p: "Level + budget + trip duration + preference → top 5 tailored recommendations. Built on real data, not sponsored placement.", tag: "Free", tbg: "var(--peak-light)", tc: "var(--peak-dark)" },
              { ic: "❄️", bg: "var(--blue-light)", h: "Snow certainty score", p: "Based on 10 years of historical snow data, altitude, wind patterns and climate trends. Every resort scored 1–10.", tag: "Explorer", tbg: "var(--peak-light)", tc: "var(--peak-dark)" },
              { ic: "👥", bg: "#fef3e0", h: "Group planning", p: "Enter multiple levels and budgets. PeakFlow finds resorts that work for everyone — with an explanation of why.", tag: "Explorer", tbg: "var(--peak-light)", tc: "var(--peak-dark)" },
              { ic: "✅", bg: "var(--green-light)", h: "Verified reviews", p: "GPS check or lift pass code confirms you were really there. Reviewer level is shown alongside every review.", tag: "Explorer", tbg: "var(--peak-light)", tc: "var(--peak-dark)" },
              { ic: "🔔", bg: "#fef3e0", h: "Snow & price alerts", p: "Fresh snow at your wishlist resort? Or the price dropped at a booking partner? You get notified right away.", tag: "Explorer", tbg: "var(--peak-light)", tc: "var(--peak-dark)" },
              { ic: "📱", bg: "var(--blue-light)", h: "On-mountain companion", p: "On the slope: offline piste map, GPS run tracking, live snow conditions, friend locations. All in one app.", tag: "Coming soon", tbg: "var(--blue-light)", tc: "var(--blue)" },
            ].map((f) => (
              <div className="feature-block" key={f.h}>
                <div className="feature-icon" style={{ background: f.bg }}>{f.ic}</div>
                <h3>{f.h}</h3>
                <p>{f.p}</p>
                <span className="feature-tag" style={{ background: f.tbg, color: f.tc }}>{f.tag}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TOP RESORTS PREVIEW */}
      <section className="section" style={{ background: "var(--white)" }}>
        <div className="container">
          <span className="label">Top rankings</span>
          <h2>The best rated resorts of 2025–26</h2>
          <div className="resort-grid">
            {topResorts.map((r, i) => (
              <Link href={`/resort/${r.id}`} className="resort-card" key={r.id}>
                <div className="resort-img" style={{ background: gradientFor(r.id) }}>
                  <div className="resort-rank">#{i + 1} {r.category}</div>
                  <div className="resort-snow-score">❄ {r.snowScore?.toFixed(1)}</div>
                  <div className="resort-img-emoji">{emojiFor(r.id)}</div>
                </div>
                <div className="resort-body">
                  <div className="resort-name">{r.name} {r.verified && <span className="badge-verified">✓ Verified</span>}</div>
                  <div className="resort-location">📍 {countryNL(r.Country)}{r.region ? `, ${r.region}` : ""}</div>
                  <div className="resort-stats">
                    <div className="resort-stat"><span>{r.pisteKm}</span> km piste</div>
                    <div className="resort-stat"><span>{fmtNumber(r.altitudeTop ?? 0)}</span> m altitude</div>
                    <div className="resort-stat"><span>€{r.dayPassPrice}</span> day pass</div>
                  </div>
                  <div className="resort-rating"><span className="stars">{stars(toFiveStars(r.averageOverallRating))}</span><span className="count">{toFiveStars(r.averageOverallRating).toFixed(1)} ({fmtNumber(r.reviewCount)} reviews)</span></div>
                </div>
              </Link>
            ))}
          </div>
          <div style={{ textAlign: "center", marginTop: 32 }}>
            <Link href="/resorts" className="btn btn-outline btn-lg">View all {fmtNumber(totalResorts)} resorts →</Link>
          </div>
        </div>
      </section>

      {/* SNOW SCORE TABLE */}
      <section className="snow-section">
        <div className="container">
          <span className="label">Snow certainty score</span>
          <h2>Know what you&apos;re getting —<br />before you book</h2>
          <p style={{ color: "rgba(255,255,255,.7)", maxWidth: 480, marginTop: 12 }}>Based on 10 years of historical snow data, altitude and climate trends. Our score is unavailable anywhere else.</p>
          <div className="snow-table">
            <div className="snow-table-header">
              <div>Resort</div><div>Altitude</div><div>Snow certainty</div><div>Score</div>
            </div>
            {snowTop.map((r) => {
              const sb = snowBar(r.snowScore ?? 0);
              return (
                <div className="snow-row" key={r.id}>
                  <div><div className="name">{r.name}</div><div className="country">{countryNL(r.Country)}</div></div>
                  <div style={{ color: "rgba(255,255,255,.7)", fontSize: 13 }}>{fmtNumber(r.altitudeTop ?? 0)} m</div>
                  <div><div className="snow-bar-wrap"><div className="snow-bar" style={{ width: sb.width, background: sb.bar }} /></div></div>
                  <div className="score-num" style={{ color: sb.color }}>{r.snowScore?.toFixed(1)}</div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* AWARDS */}
      <section className="award-section">
        <div className="container" style={{ textAlign: "center" }}>
          <span className="label">PeakFlow Awards 2026</span>
          <h2>The Michelin stars of the ski world</h2>
          <p style={{ maxWidth: 480, margin: "12px auto 0" }}>Based on {fmtNumber(totalReviews)} verified reviews and objective data. The award every ski resort aspires to.</p>
          <div className="award-grid">
            {[
              { t: "🏆", h: "Best overall", w: topResorts[0]?.name ?? "—" },
              { t: "❄️", h: "Best snow quality", w: snowTop[0]?.name ?? "—" },
              { t: "👨‍👩‍👧", h: "Best family resort", w: beginnersPick?.name ?? topResorts[1]?.name ?? "—" },
              { t: "💰", h: "Best value", w: topResorts[2]?.name ?? "—" },
            ].map((a) => (
              <div className="award-card" key={a.h}>
                <span className="trophy">{a.t}</span>
                <h4>{a.h}</h4>
                <div className="winner">{a.w}</div>
                <div className="year">PeakFlow Award 2026</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SEGMENTS */}
      <section className="segments">
        <div className="container">
          <span className="label">For everyone in the ski industry</span>
          <h2>One platform, three audiences</h2>
          <div className="seg-grid">
            <div className="seg">
              <span className="seg-emoji">⛷️</span>
              <h3>Skiers &amp; snowboarders</h3>
              <p>Find your perfect resort with AI, compare on snow certainty, read reviews from people who were actually there and get alerts when it snows.</p>
              <div className="seg-price">Free · Explorer €4.99/mo</div>
            </div>
            <div className="seg">
              <span className="seg-emoji">🏔</span>
              <h3>Ski resort operators</h3>
              <p>Manage your resort profile, monitor rankings, respond to reviews and see how you perform against your competitors with our benchmark dashboard.</p>
              <div className="seg-price">Resort Starter €79/mo · Pro €199/mo</div>
            </div>
            <div className="seg">
              <span className="seg-emoji">🎿</span>
              <h3>Ski &amp; snowboard brands</h3>
              <p>Reach 12,000+ skiers at the moment they&apos;re browsing resorts and considering gear. Contextual placement that beats generic ads.</p>
              <div className="seg-price">Brand Basic €299/mo · Pro €699/mo</div>
              <div className="seg-brands">
                <span className="seg-brand">Atomic</span>
                <span className="seg-brand">Burton</span>
                <span className="seg-brand">Rossignol</span>
                <span className="seg-brand">Salomon</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="section" style={{ background: "var(--snow)" }}>
        <div className="container">
          <span className="label">What users say</span>
          <h2>Real opinions from real skiers</h2>
          <div className="testimonial-grid">
            {[
              { q: "The snow certainty score saved us. We almost booked Chamonix but PeakFlow showed that Zermatt was much more reliable that year. Best decision ever.", bg: "#e8f4fc", n: "Lars V.", r: "Expert skier · 12 years experience" },
              { q: "The group planning tool is genius. With 10 people, from complete beginner to black run fan, PeakFlow found a resort perfect for everyone. No more conflict.", bg: "#eaf5ec", n: "Sofie K.", r: "Beginner · First ski trip with friends" },
              { q: "I could finally read reviews from people at the same level as me. Reviews on TripAdvisor are useless if you don&apos;t know whether the writer is an expert or a beginner.", bg: "#fef3e0", n: "Daan M.", r: "Advanced · 8 years skiing" },
            ].map((t) => (
              <div className="testimonial" key={t.n}>
                <div className="stars-row" style={{ fontSize: 14, marginBottom: 12, color: "#f59e0b" }}>★★★★★</div>
                <p className="quote">&quot;{t.q}&quot;</p>
                <div className="author">
                  <div className="author-avatar" style={{ background: t.bg }}>👤</div>
                  <div>
                    <div className="author-name">{t.n}</div>
                    <div className="author-role">{t.r}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PRICING PREVIEW */}
      <section className="section" style={{ background: "var(--white)" }}>
        <div className="container" style={{ textAlign: "center" }}>
          <span className="label">Pricing</span>
          <h2>Less than one après-ski drink</h2>
          <p style={{ maxWidth: 400, margin: "12px auto 0" }}>A ski holiday costs an average of €2,000. PeakFlow Explorer costs €4.99 per month.</p>
          <div className="pricing-grid">
            <div className="pricing-card">
              <div className="plan-name">Free</div>
              <div className="plan-price"><sup>€</sup>0</div>
              <div className="plan-period">always free</div>
              <div className="plan-desc">For those who want to explore what PeakFlow has to offer.</div>
              <ul>
                <li>View top 50 rankings</li>
                <li>AI Matcher (3 suggestions)</li>
                <li>5 resorts on wishlist</li>
                <li>Read reviews</li>
              </ul>
              <Link href="/register" className="btn btn-outline" style={{ width: "100%", justifyContent: "center" }}>Get started free</Link>
            </div>
            <div className="pricing-card featured">
              <div className="popular-badge">Most popular</div>
              <div className="plan-name">Explorer</div>
              <div className="plan-price"><sup>€</sup>4<span style={{ fontSize: 24 }}>.99</span></div>
              <div className="plan-period">per month · €39/year (35% off)</div>
              <div className="plan-desc">For the serious skier who wants the best.</div>
              <ul>
                <li>Full AI Matcher (unlimited)</li>
                <li>All {fmtNumber(totalResorts)} rankings</li>
                <li>Snow certainty score</li>
                <li>Group planning tool</li>
                <li>Snow &amp; price alerts</li>
                <li>Write verified reviews</li>
                <li>Ski diary &amp; statistics</li>
                <li>No ads</li>
              </ul>
              <Link href="/register" className="btn btn-primary" style={{ width: "100%", justifyContent: "center" }}>Start Explorer →</Link>
            </div>
          </div>
          <p style={{ marginTop: 20, fontSize: 13, color: "var(--ink3)" }}>For resorts &amp; brands: <Link href="/pricing" style={{ color: "var(--peak)", fontWeight: 600 }}>view B2B plans →</Link></p>
        </div>
      </section>

      {/* CTA */}
      <section className="cta-section">
        <div className="container">
          <span className="label" style={{ color: "#6ee7b7", display: "block", textAlign: "center", marginBottom: 16 }}>Get started free</span>
          <h2>Find your perfect resort this season</h2>
          <p>No credit card needed. Free account, instant access to the AI Matcher and the top 50 rankings.</p>
          <div className="cta-actions">
            <Link href="/matcher" className="btn btn-white btn-xl">Start AI Matcher for free →</Link>
            <Link href="/resorts" className="btn btn-glass btn-lg">View all rankings</Link>
          </div>
        </div>
      </section>
    </>
  );
}
