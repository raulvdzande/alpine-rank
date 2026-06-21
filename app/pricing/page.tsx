"use client";

import Link from "next/link";
import { useState } from "react";

type Seg = "consumer" | "resort" | "brand";

export default function PricingPage() {
  const [seg, setSeg] = useState<Seg>("consumer");

  const segBtn = (s: Seg): React.CSSProperties => ({
    borderRadius: 999,
    background: seg === s ? "white" : "transparent",
    color: seg === s ? "var(--ink)" : "var(--ink2)",
    fontSize: 13,
  });

  return (
    <section className="section">
      <div className="container" style={{ textAlign: "center" }}>
        <span className="label">Prijsplannen</span>
        <h2>Transparante prijzen voor iedereen</h2>
        <p style={{ maxWidth: 440, margin: "12px auto 0" }}>Geen verborgen kosten. Geen verplichtingen. Opzeggen wanneer je wilt.</p>

        <div style={{ display: "inline-flex", background: "var(--border)", borderRadius: 999, padding: 3, margin: "24px 0", gap: 2 }}>
          <button className="btn" style={segBtn("consumer")} onClick={() => setSeg("consumer")}>⛷ Skiërs</button>
          <button className="btn" style={segBtn("resort")} onClick={() => setSeg("resort")}>🏔 Skigebieden</button>
          <button className="btn" style={segBtn("brand")} onClick={() => setSeg("brand")}>🎿 Merken</button>
        </div>

        {seg === "consumer" && (
          <div className="pricing-grid">
            <div className="pricing-card">
              <div className="plan-name">Free</div>
              <div className="plan-price"><sup>€</sup>0</div>
              <div className="plan-period">altijd gratis</div>
              <ul>
                <li>Top 50 rankings</li>
                <li>AI Matcher (3 suggesties)</li>
                <li>5 resorts wishlist</li>
                <li>Reviews lezen</li>
              </ul>
              <Link href="/register" className="btn btn-outline" style={{ width: "100%", justifyContent: "center" }}>Gratis starten</Link>
            </div>
            <div className="pricing-card featured">
              <div className="popular-badge">Beste keuze</div>
              <div className="plan-name">Explorer</div>
              <div className="plan-price"><sup>€</sup>4<span style={{ fontSize: 24 }}>,99</span></div>
              <div className="plan-period">per maand · €39/jaar (spaar €21)</div>
              <ul>
                <li>Volledige AI Matcher</li>
                <li>Alle 2.000+ rankings</li>
                <li>Sneeuwzekerheids-score</li>
                <li>Groepsplanning tool</li>
                <li>Sneeuw- &amp; prijsalerts</li>
                <li>Reviews schrijven</li>
                <li>Ski-dagboek</li>
                <li>Geen advertenties</li>
              </ul>
              <Link href="/register" className="btn btn-primary" style={{ width: "100%", justifyContent: "center" }}>Start Explorer →</Link>
            </div>
          </div>
        )}

        {seg === "resort" && (
          <div className="b2b-grid">
            <div className="pricing-card">
              <div className="plan-name">Resort Starter</div>
              <div className="plan-price"><sup>€</sup>79</div>
              <div className="plan-period">per maand per resort · €749/jaar</div>
              <ul>
                <li>Verified &amp; PeakFlow Partner badge</li>
                <li>Foto&apos;s &amp; info beheren</li>
                <li>Basis analytics</li>
                <li>Reviews reageren</li>
                <li>Ranking monitoring</li>
              </ul>
              <button className="btn btn-outline" style={{ width: "100%", justifyContent: "center" }}>Start gratis proef</button>
            </div>
            <div className="pricing-card featured">
              <div className="popular-badge">Aanbevolen</div>
              <div className="plan-name">Resort Pro</div>
              <div className="plan-price"><sup>€</sup>199</div>
              <div className="plan-period">per maand per resort · €1.899/jaar</div>
              <ul>
                <li>Alles uit Starter</li>
                <li>Uitgebreide analytics + export</li>
                <li>Concurrentie benchmark</li>
                <li>Merkproducten op pagina</li>
                <li>Promotie placement</li>
                <li>Awards nominatie</li>
                <li>Priority support</li>
              </ul>
              <button className="btn btn-primary" style={{ width: "100%", justifyContent: "center" }}>Start Pro →</button>
            </div>
            <div className="pricing-card">
              <div className="plan-name">Enterprise</div>
              <div className="plan-price" style={{ fontSize: 28 }}>Maatwerk</div>
              <div className="plan-period">voor portfolio-deals (3+ resorts)</div>
              <ul>
                <li>Alles uit Pro</li>
                <li>Portfolio-korting</li>
                <li>Dedicated account manager</li>
                <li>Jaarlijks benchmark rapport</li>
                <li>Custom integraties</li>
              </ul>
              <button className="btn btn-outline" style={{ width: "100%", justifyContent: "center" }}>Contact opnemen</button>
            </div>
          </div>
        )}

        {seg === "brand" && (
          <div className="b2b-grid">
            <div className="pricing-card">
              <div className="plan-name">Brand Basis</div>
              <div className="plan-price"><sup>€</sup>299</div>
              <div className="plan-period">per maand</div>
              <ul>
                <li>Verified brand profiel</li>
                <li>Productcatalogus</li>
                <li>Auto-matching op resort-pagina&apos;s</li>
                <li>Basis impressie analytics</li>
              </ul>
              <button className="btn btn-outline" style={{ width: "100%", justifyContent: "center" }}>Start Basis</button>
            </div>
            <div className="pricing-card featured">
              <div className="popular-badge">Meest gekozen</div>
              <div className="plan-name">Brand Pro</div>
              <div className="plan-price"><sup>€</sup>699</div>
              <div className="plan-period">per maand</div>
              <ul>
                <li>Alles uit Basis</li>
                <li>Gerichte resort-targeting</li>
                <li>Gear Selector prominentie</li>
                <li>Audience insights dashboard</li>
                <li>Demo day integratie</li>
                <li>Campaign rapporten</li>
              </ul>
              <button className="btn btn-primary" style={{ width: "100%", justifyContent: "center" }}>Start Pro →</button>
            </div>
            <div className="pricing-card">
              <div className="plan-name">Brand Enterprise</div>
              <div className="plan-price" style={{ fontSize: 28 }}>€1.500+</div>
              <div className="plan-period">per maand · jaarcontract</div>
              <ul>
                <li>Alles uit Pro</li>
                <li>Categorie-exclusiviteit</li>
                <li>Jaarlijks marktrapport</li>
                <li>Dedicated account manager</li>
                <li>Co-branded campagnes</li>
              </ul>
              <button className="btn btn-outline" style={{ width: "100%", justifyContent: "center" }}>Contact opnemen</button>
            </div>
          </div>
        )}

        <p style={{ marginTop: 28, fontSize: 13, color: "var(--ink3)" }}>Alle prijzen excl. BTW · Stripe-beveiligde betalingen · Altijd opzegbaar</p>
        <Link href="/" className="btn btn-ghost" style={{ marginTop: 12 }}>← Terug naar home</Link>
      </div>
    </section>
  );
}
