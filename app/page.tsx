import Link from "next/link";
import { prisma } from "@/lib/prisma";
import {
  gradientFor, emojiFor, countryNL, toFiveStars, stars, fmtCount, fmtNumber, snowBar,
} from "@/lib/display";

export const dynamic = "force-dynamic";

export default async function HomePage() {
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
            Nieuw: Sneeuwzekerheids-score 2025–26 is live
          </div>
          <h1>De <span className="gradient">rankings die skiërs</span> vertrouwen</h1>
          <p className="hero-sub">Vergelijk {fmtNumber(totalResorts)} skigebieden op sneeuwkwaliteit, pistekm, niveau en prijs. Vind het perfecte resort met AI — in 10 seconden.</p>
          <div className="hero-actions">
            <Link href="/matcher" className="btn btn-primary btn-xl">Start AI Matcher gratis →</Link>
            <Link href="/resorts" className="btn btn-outline btn-lg">Alle rankings bekijken</Link>
          </div>
          <div className="hero-trust">
            <div className="hero-trust-avatars">
              <span>👤</span><span>👤</span><span>👤</span><span>👤</span><span>👤</span>
            </div>
            <div>
              <div className="hero-trust-stars">★★★★★</div>
              <p className="hero-trust-text">Gebaseerd op {fmtNumber(totalReviews)} geverifieerde reviews</p>
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
                <span style={{ fontSize: 12, fontWeight: 600 }}>Sneeuwscore: {heroTop.snowScore?.toFixed(1)}</span>
              </div>
            )}

            {beginnersPick && (
              <div className="resort-card-float" style={{ bottom: 40, right: 40, maxWidth: 210 }}>
                <div className="rci" style={{ background: "#eaf5ec" }}>⛷</div>
                <div>
                  <div className="rcname">#1 voor beginners</div>
                  <div className="rcsub">{beginnersPick.name}</div>
                  <div className="stars-row" style={{ color: "var(--peak)" }}>✓ AI Aanbeveling</div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* LOGOS */}
      <section className="logos">
        <div className="container">
          <p className="logos-label">Vertrouwd door skiërs die naar deze gebieden gaan</p>
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
            <div className="stat-item"><div className="stat-number">{fmtNumber(totalResorts)}</div><div className="stat-label">Skigebieden gerankt</div></div>
            <div className="stat-item"><div className="stat-number">{fmtNumber(totalReviews)}</div><div className="stat-label">Geverifieerde reviews</div></div>
            <div className="stat-item"><div className="stat-number">{countriesGrouped.length}</div><div className="stat-label">Landen gedekt</div></div>
            <div className="stat-item"><div className="stat-number">10 jaar</div><div className="stat-label">Historische sneeuwdata</div></div>
            <div className="stat-item"><div className="stat-number">98%</div><div className="stat-label">Sneeuwzekerheid nauwkeurig</div></div>
          </div>
        </div>
      </section>

      {/* PROBLEM */}
      <section className="section" style={{ background: "var(--snow)" }}>
        <div className="container">
          <span className="label">Het probleem</span>
          <h2>Skigebied plannen is gebroken</h2>
          <div className="problem-grid">
            <div className="problem-card">
              <span className="problem-icon">😤</span>
              <h3>Onbetrouwbare reviews</h3>
              <p style={{ fontSize: 14 }}>TripAdvisor en Google zijn vol met onverifieerbare reviews van mensen die er nooit zijn geweest. Je weet niet wie je vertrouwt.</p>
            </div>
            <div className="problem-card">
              <span className="problem-icon">🌫</span>
              <h3>Geen sneeuwgarantie</h3>
              <p style={{ fontSize: 14 }}>Sneeuwcondities zijn moeilijk te vergelijken. Elke website zegt dat hun resort &quot;uitstekend&quot; is. Je boekt €2.000 en belandt op groene pisten.</p>
            </div>
            <div className="problem-card">
              <span className="problem-icon">👥</span>
              <h3>Groepen met gemengde niveaus</h3>
              <p style={{ fontSize: 14 }}>Acht mensen, vier niveaus, drie budgetten. Elk jaar hetzelfde conflict. Niemand heeft een tool die écht helpt een compromis te vinden.</p>
            </div>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="section" style={{ background: "var(--white)" }}>
        <div className="container" style={{ textAlign: "center" }}>
          <span className="label">Hoe het werkt</span>
          <h2>Van twijfel naar perfecte vakantie<br />in drie stappen</h2>
          <div className="steps">
            <div className="step">
              <div className="step-num">1</div>
              <h3>Vul jouw criteria in</h3>
              <p>Niveau, budget, reisduur en wat je zoekt. De AI Matcher doet de rest — geen eindeloos scrollen.</p>
            </div>
            <div className="step">
              <div className="step-num">2</div>
              <h3>Vergelijk met echte data</h3>
              <p>Sneeuwzekerheids-score, geverifieerde reviews, pistekm per niveau, liftprijzen en reistijd. Alles naast elkaar.</p>
            </div>
            <div className="step">
              <div className="step-num">3</div>
              <h3>Boek met vertrouwen</h3>
              <p>Sla op in je wishlist, stel sneeuwmeldingen in en volg de conditie van jouw resort voor vertrek.</p>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="section" style={{ background: "var(--snow)" }}>
        <div className="container">
          <span className="label">Functies</span>
          <h2>Alles wat je nodig hebt voor<br />een betere skivakantie</h2>
          <div className="features-grid">
            {[
              { ic: "🤖", bg: "var(--peak-light)", h: "AI Resort Matcher", p: "Niveau + budget + reisduur + voorkeur → top 5 aanbevelingen op maat. Gebouwd op echte data, niet op gesponsorde plaatsing.", tag: "Gratis beschikbaar", tbg: "var(--peak-light)", tc: "var(--peak-dark)" },
              { ic: "❄️", bg: "var(--blue-light)", h: "Sneeuwzekerheids-score", p: "Op basis van 10 jaar historische sneeuwdata, hoogte, windpatronen en klimaattrends. Elk resort een score van 1–10.", tag: "Explorer", tbg: "var(--peak-light)", tc: "var(--peak-dark)" },
              { ic: "👥", bg: "#fef3e0", h: "Groepsplanning", p: "Voer meerdere niveaus en budgetten in. PeakFlow vindt resorts die voor iedereen werken — met uitleg waarom.", tag: "Explorer", tbg: "var(--peak-light)", tc: "var(--peak-dark)" },
              { ic: "✅", bg: "var(--green-light)", h: "Geverifieerde reviews", p: "GPS-check of liftpas-code bevestigt dat je er echt bent geweest. Niveau van de reviewer staat bij elke review zichtbaar.", tag: "Explorer", tbg: "var(--peak-light)", tc: "var(--peak-dark)" },
              { ic: "🔔", bg: "#fef3e0", h: "Sneeuw- & prijsalerts", p: "Verse sneeuw gevallen in jouw wishlist-resort? Of de prijs gezakt bij een boekingspartner? Je krijgt direct bericht.", tag: "Explorer", tbg: "var(--peak-light)", tc: "var(--peak-dark)" },
              { ic: "📱", bg: "var(--blue-light)", h: "On-mountain companion", p: "Op de berg: pistemap offline, GPS run-tracking, live sneeuwconditie, vriendenlocatie. Alles in één app.", tag: "Binnenkort", tbg: "var(--blue-light)", tc: "var(--blue)" },
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
          <h2>De best beoordeelde resorts van 2025–26</h2>
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
                    <div className="resort-stat"><span>{fmtNumber(r.altitudeTop ?? 0)}</span> m hoogte</div>
                    <div className="resort-stat"><span>€{r.dayPassPrice}</span> dagkaart</div>
                  </div>
                  <div className="resort-rating"><span className="stars">{stars(toFiveStars(r.averageOverallRating))}</span><span className="count">{toFiveStars(r.averageOverallRating).toFixed(1)} ({fmtNumber(r.reviewCount)} reviews)</span></div>
                </div>
              </Link>
            ))}
          </div>
          <div style={{ textAlign: "center", marginTop: 32 }}>
            <Link href="/resorts" className="btn btn-outline btn-lg">Alle {fmtNumber(totalResorts)} resorts bekijken →</Link>
          </div>
        </div>
      </section>

      {/* SNOW SCORE TABLE */}
      <section className="snow-section">
        <div className="container">
          <span className="label">Sneeuwzekerheids-score</span>
          <h2>Weet waar je aan toe bent —<br />vóór je boekt</h2>
          <p style={{ color: "rgba(255,255,255,.7)", maxWidth: 480, marginTop: 12 }}>Op basis van 10 jaar historische sneeuwdata, hoogte en klimaattrends. Onze score is nergens anders beschikbaar.</p>
          <div className="snow-table">
            <div className="snow-table-header">
              <div>Resort</div><div>Hoogte</div><div>Sneeuwzekerheid</div><div>Score</div>
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
          <h2>De Michelin-sterren van de skiwereld</h2>
          <p style={{ maxWidth: 480, margin: "12px auto 0" }}>Op basis van {fmtNumber(totalReviews)} geverifieerde reviews en objectieve data. De award waar elk skigebied naar streeft.</p>
          <div className="award-grid">
            {[
              { t: "🏆", h: "Beste overall", w: topResorts[0]?.name ?? "—" },
              { t: "❄️", h: "Beste sneeuwkwaliteit", w: snowTop[0]?.name ?? "—" },
              { t: "👨‍👩‍👧", h: "Beste familieskigebied", w: beginnersPick?.name ?? topResorts[1]?.name ?? "—" },
              { t: "💰", h: "Beste prijs-kwaliteit", w: topResorts[2]?.name ?? "—" },
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
          <span className="label">Voor iedereen in de ski-industrie</span>
          <h2>Eén platform, drie doelgroepen</h2>
          <div className="seg-grid">
            <div className="seg">
              <span className="seg-emoji">⛷️</span>
              <h3>Skiërs &amp; snowboarders</h3>
              <p>Vind jouw perfecte resort met AI, vergelijk op sneeuwzekerheid, lees reviews van mensen die er echt zijn geweest en krijg meldingen als het sneeuwt.</p>
              <div className="seg-price">Gratis · Explorer €4,99/mnd</div>
            </div>
            <div className="seg">
              <span className="seg-emoji">🏔</span>
              <h3>Skigebied operators</h3>
              <p>Beheer uw resortprofiel, monitor rankings, reageer op reviews en zie hoe u presteert ten opzichte van uw concurrenten met ons benchmark dashboard.</p>
              <div className="seg-price">Resort Starter €79/mnd · Pro €199/mnd</div>
            </div>
            <div className="seg">
              <span className="seg-emoji">🎿</span>
              <h3>Ski- &amp; snowboardmerken</h3>
              <p>Bereik 12.000+ skiërs op het moment dat ze een resort bekijken en uitrusting overwegen. Contextuele plaatsing die generieke advertenties verslaat.</p>
              <div className="seg-price">Brand Basis €299/mnd · Pro €699/mnd</div>
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
          <span className="label">Wat gebruikers zeggen</span>
          <h2>Echte meningen van echte skiërs</h2>
          <div className="testimonial-grid">
            {[
              { q: "De sneeuwzekerheids-score heeft ons gered. We hadden bijna Chamonix geboekt maar PeakFlow liet zien dat Zermatt dat jaar veel betrouwbaarder was. Beste beslissing ooit.", bg: "#e8f4fc", n: "Lars V.", r: "Expert skiër · 12 jaar ervaring" },
              { q: "De groepsplanning tool is geniaal. Met 10 mensen, van absolute beginner tot zwarte piste fan, vond PeakFlow een resort perfect voor iedereen. Geen conflict meer.", bg: "#eaf5ec", n: "Sofie K.", r: "Beginner · Eerste skivakantie met vriendengroep" },
              { q: "Ik kon eindelijk reviews lezen van mensen met hetzelfde niveau als ik. Reviews op TripAdvisor zijn nutteloos als je niet weet of de schrijver ook een expert is of een beginner.", bg: "#fef3e0", n: "Daan M.", r: "Gevorderd · 8 jaar skiën" },
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
          <span className="label">Prijzen</span>
          <h2>Minder dan één après-ski drankje</h2>
          <p style={{ maxWidth: 400, margin: "12px auto 0" }}>Een skivakantie kost gemiddeld €2.000. PeakFlow Explorer kost €4,99 per maand.</p>
          <div className="pricing-grid">
            <div className="pricing-card">
              <div className="plan-name">Free</div>
              <div className="plan-price"><sup>€</sup>0</div>
              <div className="plan-period">altijd gratis</div>
              <div className="plan-desc">Voor wie wil verkennen wat PeakFlow te bieden heeft.</div>
              <ul>
                <li>Top 50 rankings bekijken</li>
                <li>AI Matcher (3 suggesties)</li>
                <li>5 resorts op wishlist</li>
                <li>Reviews lezen</li>
              </ul>
              <Link href="/register" className="btn btn-outline" style={{ width: "100%", justifyContent: "center" }}>Gratis starten</Link>
            </div>
            <div className="pricing-card featured">
              <div className="popular-badge">Meest populair</div>
              <div className="plan-name">Explorer</div>
              <div className="plan-price"><sup>€</sup>4<span style={{ fontSize: 24 }}>,99</span></div>
              <div className="plan-period">per maand · €39/jaar (35% korting)</div>
              <div className="plan-desc">Voor de serieuze skiër die het beste wil.</div>
              <ul>
                <li>Volledige AI Matcher (onbeperkt)</li>
                <li>Alle {fmtNumber(totalResorts)} rankings</li>
                <li>Sneeuwzekerheids-score</li>
                <li>Groepsplanning tool</li>
                <li>Sneeuw- &amp; prijsalerts</li>
                <li>Geverifieerde reviews schrijven</li>
                <li>Ski-dagboek &amp; statistieken</li>
                <li>Geen advertenties</li>
              </ul>
              <Link href="/register" className="btn btn-primary" style={{ width: "100%", justifyContent: "center" }}>Start Explorer →</Link>
            </div>
          </div>
          <p style={{ marginTop: 20, fontSize: 13, color: "var(--ink3)" }}>Voor skigebieden &amp; merken: <Link href="/pricing" style={{ color: "var(--peak)", fontWeight: 600 }}>bekijk B2B plannen →</Link></p>
        </div>
      </section>

      {/* CTA */}
      <section className="cta-section">
        <div className="container">
          <span className="label" style={{ color: "#6ee7b7", display: "block", textAlign: "center", marginBottom: 16 }}>Gratis starten</span>
          <h2>Vind dit seizoen jouw perfecte resort</h2>
          <p>Geen creditcard nodig. Gratis account, direct toegang tot de AI Matcher en de top 50 rankings.</p>
          <div className="cta-actions">
            <Link href="/matcher" className="btn btn-white btn-xl">Start AI Matcher gratis →</Link>
            <Link href="/resorts" className="btn btn-glass btn-lg">Bekijk alle rankings</Link>
          </div>
        </div>
      </section>
    </>
  );
}
