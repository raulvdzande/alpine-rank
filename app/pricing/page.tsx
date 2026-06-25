"use client";

import Link from "next/link";
import { useState } from "react";

type Seg = "consumer" | "resort" | "brand";

export default function PricingPage() {
  const [seg, setSeg] = useState<Seg>("consumer");
  const [annual, setAnnual] = useState(false);
  const [loading, setLoading] = useState<string | null>(null);

  const handleCheckout = async (plan: string) => {
    setLoading(plan);
    try {
      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan }),
      });

      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else if (res.status === 401 || data.redirect) {
        window.location.href = "/login?redirect=/pricing";
      } else {
        alert("Error: " + (data.error || "Unknown error"));
      }
    } catch (err) {
      alert("Error starting checkout");
    } finally {
      setLoading(null);
    }
  };

  const segBtn = (s: Seg): React.CSSProperties => ({
    borderRadius: 999,
    background: seg === s ? "white" : "transparent",
    color: seg === s ? "var(--ink)" : "var(--ink2)",
    fontSize: 13,
  });

  return (
    <>
      <style>{`
        .pr-toggle { display:flex; align-items:center; gap:10px; justify-content:center; margin-bottom:32px; font-size:13px; color:var(--ink2); flex-wrap:wrap; }
        .pr-switch { width:40px; height:22px; background:var(--border); border-radius:999px; position:relative; cursor:pointer; border:none; padding:0; transition:background .2s; flex-shrink:0; }
        .pr-switch.on { background:var(--primary); }
        .pr-knob { position:absolute; top:3px; left:3px; width:16px; height:16px; background:white; border-radius:50%; transition:left .2s; }
        .pr-switch.on .pr-knob { left:21px; }
        .save-pill { background:#dcfce7; color:#166534; font-size:10px; font-weight:700; padding:2px 8px; border-radius:999px; }

        .pc-grid { display:grid; grid-template-columns:repeat(auto-fit,minmax(240px,1fr)); gap:16px; text-align:left; max-width:980px; margin:0 auto 20px; }
        .pc { background:white; border:1px solid var(--border); border-radius:14px; padding:24px 20px; display:flex; flex-direction:column; }
        .pc.hot { border-color:var(--primary); box-shadow:0 0 0 1px var(--primary),0 8px 32px rgba(59,130,246,.1); }
        .pc-badge { display:inline-block; background:var(--primary); color:white; font-size:10px; font-weight:700; padding:3px 10px; border-radius:999px; margin-bottom:10px; letter-spacing:.03em; }
        .pc-name { font-size:18px; font-weight:800; margin-bottom:3px; }
        .pc-sub { font-size:12px; color:var(--ink3); line-height:1.5; margin-bottom:16px; min-height:36px; }
        .pc-price { font-size:38px; font-weight:800; line-height:1; }
        .pc-price sup { font-size:18px; vertical-align:top; margin-top:7px; }
        .pc-period { font-size:11px; color:var(--ink3); margin:4px 0 20px; }
        .pc hr { border:none; border-top:1px solid var(--border); margin:0 0 14px; }
        .pc ul { list-style:none; padding:0; margin:0 0 20px; flex:1; }
        .pc ul li { font-size:12.5px; color:var(--ink2); padding:3.5px 0; display:flex; gap:8px; align-items:flex-start; line-height:1.4; }
        .pc ul .g { color:#22c55e; flex-shrink:0; font-size:13px; margin-top:1px; }
        .pc ul .s { color:#f59e0b; flex-shrink:0; font-size:11px; margin-top:2px; }
        .pc ul .lbl { display:block; font-size:10px; font-weight:700; color:var(--ink3); text-transform:uppercase; letter-spacing:.06em; padding:8px 0 2px; }
        .value-note { background:var(--bg2,#f8fafc); border:1px solid var(--border); border-radius:10px; padding:13px 18px; display:flex; align-items:center; justify-content:space-between; gap:12px; flex-wrap:wrap; font-size:12px; color:var(--ink2); max-width:980px; margin:0 auto 8px; }

        @media(max-width:640px){
          .pc-grid,.pc-grid.pc-grid { grid-template-columns:1fr; }
          .pr-toggle { gap:8px; }
        }
      `}</style>

      <section className="section">
        <div className="container" style={{ textAlign: "center" }}>
          <span className="label">Prijsplannen</span>
          <h2 style={{ marginBottom: 8 }}>Transparante prijzen voor iedereen</h2>
          <p style={{ maxWidth: 420, margin: "0 auto 24px", color: "var(--ink2)", fontSize: 14 }}>
            Geen verborgen kosten. Geen verplichtingen. Opzeggen wanneer je wilt.
          </p>

          {/* Segment */}
          <div style={{ display: "inline-flex", background: "var(--border)", borderRadius: 999, padding: 3, marginBottom: 24, gap: 2 }}>
            <button className="btn" style={segBtn("consumer")} onClick={() => setSeg("consumer")}>⛷ Skiërs</button>
            <button className="btn" style={segBtn("resort")} onClick={() => setSeg("resort")}>🏔 Skigebieden</button>
            <button className="btn" style={segBtn("brand")} onClick={() => setSeg("brand")}>🎿 Merken</button>
          </div>

          {/* Jaar toggle */}
          <div className="pr-toggle">
            <span>Maandelijks</span>
            <button className={`pr-switch${annual ? " on" : ""}`} onClick={() => setAnnual(v => !v)} aria-label="Jaarlijks">
              <span className="pr-knob" />
            </button>
            <span>Jaarlijks <span className="save-pill">2 maanden gratis</span></span>
          </div>

          {/* ── SKIËRS ── */}
          {seg === "consumer" && (
            <>
              <div className="pc-grid">
                {/* Free */}
                <div className="pc">
                  <div className="pc-name">Free</div>
                  <div className="pc-sub">Ontdek PeakFlow. Geen creditcard, altijd gratis.</div>
                  <div className="pc-price"><sup>€</sup>0</div>
                  <div className="pc-period">voor altijd gratis</div>
                  <hr />
                  <ul>
                    <li><span className="g">✓</span> Top 50 skiresorts rankings</li>
                    <li><span className="g">✓</span> AI Matcher — 3 gratis suggesties</li>
                    <li><span className="g">✓</span> Wishlist tot 5 resorts</li>
                    <li><span className="g">✓</span> Resortpagina&apos;s &amp; reviews lezen</li>
                    <li><span className="g">✓</span> Basisfilters (land, niveau)</li>
                  </ul>
                  <Link href="/register" className="btn btn-outline" style={{ width: "100%", justifyContent: "center" }}>Gratis starten</Link>
                </div>

                {/* Explorer */}
                <div className="pc hot">
                  <div className="pc-badge">Beste keuze</div>
                  <div className="pc-name">Explorer</div>
                  <div className="pc-sub">Alles om jouw perfecte skivakantie te vinden en plannen.</div>
                  <div className="pc-price">
                    <sup>€</sup>{annual ? "4,16" : "4,99"}
                  </div>
                  <div className="pc-period">
                    per maand · {annual ? "€49,99 per jaar" : "of €49,99/jaar (2 mnd gratis)"}
                  </div>
                  <hr />
                  <ul>
                    <span className="lbl">Ontdekken</span>
                    <li><span className="g">✓</span> Alle 2.000+ resorts + volledige rankings</li>
                    <li><span className="g">✓</span> Volledige AI Matcher — onbeperkt</li>
                    <li><span className="g">✓</span> Sneeuwzekerheids-score per resort</li>
                    <li><span className="g">✓</span> Alle filters: sneeuw, prijs, niveau, land, sfeer</li>
                    <li><span className="g">✓</span> PeakFlow Snowflake gecertificeerde resorts</li>
                    <span className="lbl">Plannen</span>
                    <li><span className="g">✓</span> Onbeperkte wishlist</li>
                    <li><span className="g">✓</span> Groepsplanning tool</li>
                    <li><span className="g">✓</span> Sneeuw- &amp; prijsalerts per resort</li>
                    <li><span className="g">✓</span> Ski-dagboek &amp; reiskalender</li>
                    <span className="lbl">Community</span>
                    <li><span className="g">✓</span> Reviews schrijven &amp; resort raten</li>
                    <li><span className="g">✓</span> Geen advertenties</li>
                  </ul>
                  <button
                    className="btn btn-primary"
                    style={{ width: "100%", justifyContent: "center" }}
                    onClick={() => handleCheckout(annual ? "explorer_yearly" : "explorer_monthly")}
                    disabled={loading === (annual ? "explorer_yearly" : "explorer_monthly")}
                  >
                    {loading === (annual ? "explorer_yearly" : "explorer_monthly") ? "Loading..." : "Start Explorer →"}
                  </button>
                </div>

                {/* Pro */}
                <div className="pc">
                  <div className="pc-name">Pro</div>
                  <div className="pc-sub">Voor de skiër die niets aan het toeval overlaat.</div>
                  <div className="pc-price">
                    <sup>€</sup>{annual ? "9,16" : "10,99"}
                  </div>
                  <div className="pc-period">
                    per maand · {annual ? "€109,99 per jaar" : "of €109,99/jaar (2 mnd gratis)"}
                  </div>
                  <hr />
                  <ul>
                    <li><span className="g">✓</span> Alles uit Explorer</li>
                    <span className="lbl">Exclusief Pro</span>
                    <li><span className="s">★</span> Vergelijk tot 5 resorts naast elkaar</li>
                    <li><span className="s">★</span> Historische sneeuwdata — 10 jaar terug</li>
                    <li><span className="s">★</span> Prijs-kwaliteitanalyse per resort</li>
                    <li><span className="s">★</span> Seizoensrapport: beste weken per resort</li>
                    <li><span className="s">★</span> Vroegtijdig toegang tot nieuwe features</li>
                    <li><span className="s">★</span> Pro badge op je profiel</li>
                  </ul>
                  <button
                    className="btn btn-outline"
                    style={{ width: "100%", justifyContent: "center" }}
                    onClick={() => handleCheckout(annual ? "pro_yearly" : "pro_monthly")}
                    disabled={loading === (annual ? "pro_yearly" : "pro_monthly")}
                  >
                    {loading === (annual ? "pro_yearly" : "pro_monthly") ? "Loading..." : "Start Pro →"}
                  </button>
                </div>
              </div>

              <div className="value-note">
                <span>💡 <strong>Skiërs geven gemiddeld €1.500–€4.000 per wintersportvakantie.</strong> Explorer helpt je de beste keuze maken — voor minder dan een kop koffie per maand.</span>
                <span style={{ color: "var(--ink3)" }}>Altijd opzegbaar</span>
              </div>
            </>
          )}

          {/* ── SKIGEBIEDEN ── */}
          {seg === "resort" && (
            <>
              <div className="pc-grid">
                {/* Starter */}
                <div className="pc">
                  <div className="pc-name">Starter</div>
                  <div className="pc-sub">Professionele aanwezigheid op PeakFlow. Beheer jouw resort zelf.</div>
                  <div className="pc-price">
                    <sup>€</sup>{annual ? "83" : "99"}
                  </div>
                  <div className="pc-period">
                    per maand · {annual ? "€999/jaar (spaar €189)" : "of €999/jaar (spaar €189)"}
                  </div>
                  <hr />
                  <ul>
                    <span className="lbl">Profiel</span>
                    <li><span className="g">✓</span> Verified &amp; PeakFlow Partner badge</li>
                    <li><span className="g">✓</span> Onbeperkt foto&apos;s, video&apos;s &amp; beschrijving</li>
                    <li><span className="g">✓</span> Dagkaartprijzen &amp; openingstijden beheren</li>
                    <li><span className="g">✓</span> Piste-informatie &amp; faciliteiten updaten</li>
                    <li><span className="g">✓</span> Reviews beantwoorden</li>
                    <span className="lbl">Inzicht</span>
                    <li><span className="g">✓</span> Wekelijkse ranking monitoring</li>
                    <li><span className="g">✓</span> Paginabezoekers &amp; review-overzicht</li>
                    <li><span className="g">✓</span> Sentiment analyse op reviews</li>
                  </ul>
                  <button
                    className="btn btn-outline"
                    style={{ width: "100%", justifyContent: "center" }}
                    onClick={() => handleCheckout(annual ? "resort_starter_yearly" : "resort_starter_monthly")}
                    disabled={loading === (annual ? "resort_starter_yearly" : "resort_starter_monthly")}
                  >
                    {loading === (annual ? "resort_starter_yearly" : "resort_starter_monthly") ? "Loading..." : "30 dagen gratis proberen"}
                  </button>
                </div>

                {/* Pro */}
                <div className="pc hot">
                  <div className="pc-badge">Aanbevolen</div>
                  <div className="pc-name">Pro</div>
                  <div className="pc-sub">Maximale zichtbaarheid, diepgaande data en actieve promotie naar skiërs.</div>
                  <div className="pc-price">
                    <sup>€</sup>{annual ? "332" : "399"}
                  </div>
                  <div className="pc-period">
                    per maand · {annual ? "€3.990/jaar (spaar €798)" : "of €3.990/jaar (spaar €798)"}
                  </div>
                  <hr />
                  <ul>
                    <li><span className="g">✓</span> Alles uit Starter</li>
                    <span className="lbl">Analytics</span>
                    <li><span className="s">★</span> Realtime bezoekersdata + geografische herkomst</li>
                    <li><span className="s">★</span> Concurrentie benchmark (tot 5 resorts)</li>
                    <li><span className="s">★</span> Maandelijks performance rapport (PDF)</li>
                    <li><span className="s">★</span> Data export (CSV / Excel)</li>
                    <span className="lbl">Promotie</span>
                    <li><span className="s">★</span> Uitgelichte positie in zoekresultaten</li>
                    <li><span className="s">★</span> Promotie-banner op vergelijkbare resorts</li>
                    <li><span className="s">★</span> Merken &amp; producten op jouw pagina</li>
                    <li><span className="s">★</span> Elk seizoen genomineerd voor PeakFlow Award</li>
                    <span className="lbl">Support</span>
                    <li><span className="s">★</span> Priority e-mail support</li>
                    <li><span className="s">★</span> Persoonlijke onboarding call</li>
                  </ul>
                  <button
                    className="btn btn-primary"
                    style={{ width: "100%", justifyContent: "center" }}
                    onClick={() => handleCheckout(annual ? "resort_pro_yearly" : "resort_pro_monthly")}
                    disabled={loading === (annual ? "resort_pro_yearly" : "resort_pro_monthly")}
                  >
                    {loading === (annual ? "resort_pro_yearly" : "resort_pro_monthly") ? "Loading..." : "Start Pro →"}
                  </button>
                </div>

                {/* Enterprise */}
                <div className="pc">
                  <div className="pc-name">Enterprise</div>
                  <div className="pc-sub">Portfolio-deal voor groepen met meerdere resorts of volledige ketens.</div>
                  <div className="pc-price" style={{ fontSize: 28, lineHeight: 1.3 }}>Op maat</div>
                  <div className="pc-period">voor 3+ resorts · jaarcontract</div>
                  <hr />
                  <ul>
                    <li><span className="g">✓</span> Alles uit Pro</li>
                    <span className="lbl">Extra</span>
                    <li><span className="s">★</span> Portfolio-korting (tot 35%)</li>
                    <li><span className="s">★</span> Dedicated account manager</li>
                    <li><span className="s">★</span> Gecombineerde portfolio-analytics</li>
                    <li><span className="s">★</span> Jaarlijks benchmark rapport NL + EN</li>
                    <li><span className="s">★</span> Custom API-integratie</li>
                    <li><span className="s">★</span> SLA &amp; contractgaranties</li>
                  </ul>
                  <button className="btn btn-outline" style={{ width: "100%", justifyContent: "center" }}>Contact opnemen</button>
                </div>
              </div>

              <div className="value-note">
                <span>🏔 <strong>Duizenden skiërs plannen maandelijks via PeakFlow.</strong> Pro-resorts verschijnen bovenaan — één extra boeking dekt het jaarplan al ruimschoots.</span>
                <span style={{ color: "var(--ink3)" }}>30 dagen gratis · geen creditcard vereist</span>
              </div>
            </>
          )}

          {/* ── MERKEN ── */}
          {seg === "brand" && (
            <>
              <div className="pc-grid">
                {/* Basis */}
                <div className="pc">
                  <div className="pc-name">Brand Basis</div>
                  <div className="pc-sub">Zet jouw merk neer bij actieve skiërs op het moment dat ze plannen.</div>
                  <div className="pc-price"><sup>€</sup>299</div>
                  <div className="pc-period">per maand · €2.879/jaar (spaar €509)</div>
                  <hr />
                  <ul>
                    <span className="lbl">Aanwezigheid</span>
                    <li><span className="g">✓</span> Verified brand profiel</li>
                    <li><span className="g">✓</span> Productcatalogus — onbeperkt producten</li>
                    <li><span className="g">✓</span> Auto-matching op relevante resort-pagina&apos;s</li>
                    <li><span className="g">✓</span> Categorie-aanwezigheid (ski&apos;s, helmen, jassen…)</li>
                    <span className="lbl">Data</span>
                    <li><span className="g">✓</span> Impressie &amp; klikanalytics</li>
                    <li><span className="g">✓</span> Maandelijks bereikrapport</li>
                  </ul>
                  <button className="btn btn-outline" style={{ width: "100%", justifyContent: "center" }}>Start Basis</button>
                </div>

                {/* Pro */}
                <div className="pc hot">
                  <div className="pc-badge">Meest gekozen</div>
                  <div className="pc-name">Brand Pro</div>
                  <div className="pc-sub">Bereik de juiste skiërs gericht op niveau, resort-type en reisintentie.</div>
                  <div className="pc-price"><sup>€</sup>699</div>
                  <div className="pc-period">per maand · €6.710/jaar (spaar €1.078)</div>
                  <hr />
                  <ul>
                    <li><span className="g">✓</span> Alles uit Basis</li>
                    <span className="lbl">Targeting</span>
                    <li><span className="s">★</span> Gerichte resort-targeting (niveau, land, type)</li>
                    <li><span className="s">★</span> Prominente Gear Selector vermelding</li>
                    <li><span className="s">★</span> Gepersonaliseerde productaanbevelingen aan gebruikers</li>
                    <span className="lbl">Inzicht</span>
                    <li><span className="s">★</span> Audience insights dashboard</li>
                    <li><span className="s">★</span> Doelgroep-segmentatie (niveau, leeftijd, land)</li>
                    <li><span className="s">★</span> Gedetailleerde campaign performance rapporten</li>
                    <span className="lbl">Activatie</span>
                    <li><span className="s">★</span> Demo day &amp; seizoenscampagne integratie</li>
                    <li><span className="s">★</span> Aanbevolen merk bij PeakFlow content</li>
                  </ul>
                  <button className="btn btn-primary" style={{ width: "100%", justifyContent: "center" }}>Start Pro →</button>
                </div>

                {/* Enterprise */}
                <div className="pc">
                  <div className="pc-name">Brand Enterprise</div>
                  <div className="pc-sub">Volledige categorie-dominantie en co-branded campagnes op maat.</div>
                  <div className="pc-price" style={{ fontSize: 28, lineHeight: 1.3 }}>€1.500+</div>
                  <div className="pc-period">per maand · jaarcontract</div>
                  <hr />
                  <ul>
                    <li><span className="g">✓</span> Alles uit Pro</li>
                    <span className="lbl">Exclusief</span>
                    <li><span className="s">★</span> Categorie-exclusiviteit — alleen jouw merk</li>
                    <li><span className="s">★</span> Co-branded campagnes met PeakFlow</li>
                    <li><span className="s">★</span> Jaarlijks ski-marktrapport (NL + EN)</li>
                    <li><span className="s">★</span> Dedicated account manager</li>
                    <li><span className="s">★</span> Custom integraties &amp; API-toegang</li>
                    <li><span className="s">★</span> Contractgaranties &amp; SLA</li>
                  </ul>
                  <button className="btn btn-outline" style={{ width: "100%", justifyContent: "center" }}>Contact opnemen</button>
                </div>
              </div>

              <div className="value-note">
                <span>🎿 <strong>PeakFlow bereikt skiërs op het moment dat ze plannen</strong> — hoge koopintentie, geen verspild bereik. Goedkoper dan Google Ads met hogere relevantie.</span>
                <span style={{ color: "var(--ink3)" }}>Alle prijzen excl. BTW</span>
              </div>
            </>
          )}

          <p style={{ marginTop: 20, fontSize: 12, color: "var(--ink3)" }}>
            Alle prijzen excl. BTW · Stripe-beveiligde betalingen · Altijd opzegbaar
          </p>
          <Link href="/" className="btn btn-ghost" style={{ marginTop: 10 }}>← Terug naar home</Link>
        </div>
      </section>
    </>
  );
}
