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
          <span className="label">Pricing</span>
          <h2 style={{ marginBottom: 8 }}>Transparent pricing for everyone</h2>
          <p style={{ maxWidth: 420, margin: "0 auto 24px", color: "var(--ink2)", fontSize: 14 }}>
            No hidden costs. No commitments. Cancel whenever you want.
          </p>

          {/* Segment */}
          <div style={{ display: "inline-flex", background: "var(--border)", borderRadius: 999, padding: 3, marginBottom: 24, gap: 2 }}>
            <button className="btn" style={segBtn("consumer")} onClick={() => setSeg("consumer")}>⛷ Skiers</button>
            <button className="btn" style={segBtn("resort")} onClick={() => setSeg("resort")}>🏔 Ski resorts</button>
            <button className="btn" style={segBtn("brand")} onClick={() => setSeg("brand")}>🎿 Brands</button>
          </div>

          {/* Annual toggle */}
          <div className="pr-toggle">
            <span>Monthly</span>
            <button className={`pr-switch${annual ? " on" : ""}`} onClick={() => setAnnual(v => !v)} aria-label="Annual">
              <span className="pr-knob" />
            </button>
            <span>Annual <span className="save-pill">2 months free</span></span>
          </div>

          {/* ── SKIERS ── */}
          {seg === "consumer" && (
            <>
              <div className="pc-grid">
                {/* Free */}
                <div className="pc">
                  <div className="pc-name">Free</div>
                  <div className="pc-sub">Discover PeakFlow. No credit card, always free.</div>
                  <div className="pc-price"><sup>€</sup>0</div>
                  <div className="pc-period">free forever</div>
                  <hr />
                  <ul>
                    <li><span className="g">✓</span> Top 50 ski resort rankings</li>
                    <li><span className="g">✓</span> AI Matcher — 3 free suggestions</li>
                    <li><span className="g">✓</span> Wishlist up to 5 resorts</li>
                    <li><span className="g">✓</span> Read resort pages &amp; reviews</li>
                    <li><span className="g">✓</span> Basic filters (country, level)</li>
                  </ul>
                  <Link href="/register" className="btn btn-outline" style={{ width: "100%", justifyContent: "center" }}>Get started free</Link>
                </div>

                {/* Explorer */}
                <div className="pc hot">
                  <div className="pc-badge">Best choice</div>
                  <div className="pc-name">Explorer</div>
                  <div className="pc-sub">Everything to find and plan your perfect ski holiday.</div>
                  <div className="pc-price">
                    <sup>€</sup>{annual ? "4.16" : "4.99"}
                  </div>
                  <div className="pc-period">
                    per month · {annual ? "€49.99 per year" : "or €49.99/year (2 months free)"}
                  </div>
                  <hr />
                  <ul>
                    <span className="lbl">Discover</span>
                    <li><span className="g">✓</span> All 2,000+ resorts + full rankings</li>
                    <li><span className="g">✓</span> Full AI Matcher — unlimited</li>
                    <li><span className="g">✓</span> Snow certainty score per resort</li>
                    <li><span className="g">✓</span> All filters: snow, price, level, country, vibe</li>
                    <li><span className="g">✓</span> PeakFlow Snowflake certified resorts</li>
                    <span className="lbl">Plan</span>
                    <li><span className="g">✓</span> Unlimited wishlist</li>
                    <li><span className="g">✓</span> Group planning tool</li>
                    <li><span className="g">✓</span> Snow &amp; price alerts per resort</li>
                    <li><span className="g">✓</span> Ski diary &amp; trip calendar</li>
                    <span className="lbl">Community</span>
                    <li><span className="g">✓</span> Write reviews &amp; rate resorts</li>
                    <li><span className="g">✓</span> No ads</li>
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
                  <div className="pc-sub">For the skier who leaves nothing to chance.</div>
                  <div className="pc-price">
                    <sup>€</sup>{annual ? "9.16" : "10.99"}
                  </div>
                  <div className="pc-period">
                    per month · {annual ? "€109.99 per year" : "or €109.99/year (2 months free)"}
                  </div>
                  <hr />
                  <ul>
                    <li><span className="g">✓</span> Everything in Explorer</li>
                    <span className="lbl">Pro exclusive</span>
                    <li><span className="s">★</span> Compare up to 5 resorts side by side</li>
                    <li><span className="s">★</span> Historical snow data — 10 years back</li>
                    <li><span className="s">★</span> Value analysis per resort</li>
                    <li><span className="s">★</span> Season report: best weeks per resort</li>
                    <li><span className="s">★</span> Early access to new features</li>
                    <li><span className="s">★</span> Pro badge on your profile</li>
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
                <span>💡 <strong>Skiers spend an average of €1,500–€4,000 per ski holiday.</strong> Explorer helps you make the best choice — for less than a cup of coffee per month.</span>
                <span style={{ color: "var(--ink3)" }}>Cancel anytime</span>
              </div>
            </>
          )}

          {/* ── RESORTS ── */}
          {seg === "resort" && (
            <>
              <div className="pc-grid">
                {/* Starter */}
                <div className="pc">
                  <div className="pc-name">Starter</div>
                  <div className="pc-sub">Professional presence on PeakFlow. Manage your resort yourself.</div>
                  <div className="pc-price">
                    <sup>€</sup>{annual ? "83" : "99"}
                  </div>
                  <div className="pc-period">
                    per month · {annual ? "€999/year (save €189)" : "or €999/year (save €189)"}
                  </div>
                  <hr />
                  <ul>
                    <span className="lbl">Profile</span>
                    <li><span className="g">✓</span> Verified &amp; PeakFlow Partner badge</li>
                    <li><span className="g">✓</span> Unlimited photos, videos &amp; description</li>
                    <li><span className="g">✓</span> Manage day pass prices &amp; opening times</li>
                    <li><span className="g">✓</span> Update piste info &amp; facilities</li>
                    <li><span className="g">✓</span> Respond to reviews</li>
                    <span className="lbl">Insights</span>
                    <li><span className="g">✓</span> Weekly ranking monitoring</li>
                    <li><span className="g">✓</span> Page visitors &amp; review overview</li>
                    <li><span className="g">✓</span> Sentiment analysis on reviews</li>
                  </ul>
                  <button
                    className="btn btn-outline"
                    style={{ width: "100%", justifyContent: "center" }}
                    onClick={() => handleCheckout(annual ? "resort_starter_yearly" : "resort_starter_monthly")}
                    disabled={loading === (annual ? "resort_starter_yearly" : "resort_starter_monthly")}
                  >
                    {loading === (annual ? "resort_starter_yearly" : "resort_starter_monthly") ? "Loading..." : "Try free for 30 days"}
                  </button>
                </div>

                {/* Pro */}
                <div className="pc hot">
                  <div className="pc-badge">Recommended</div>
                  <div className="pc-name">Pro</div>
                  <div className="pc-sub">Maximum visibility, deep data and active promotion to skiers.</div>
                  <div className="pc-price">
                    <sup>€</sup>{annual ? "332" : "399"}
                  </div>
                  <div className="pc-period">
                    per month · {annual ? "€3,990/year (save €798)" : "or €3,990/year (save €798)"}
                  </div>
                  <hr />
                  <ul>
                    <li><span className="g">✓</span> Everything in Starter</li>
                    <span className="lbl">Analytics</span>
                    <li><span className="s">★</span> Real-time visitor data + geographic origin</li>
                    <li><span className="s">★</span> Competitor benchmark (up to 5 resorts)</li>
                    <li><span className="s">★</span> Monthly performance report (PDF)</li>
                    <li><span className="s">★</span> Data export (CSV / Excel)</li>
                    <span className="lbl">Promotion</span>
                    <li><span className="s">★</span> Featured position in search results</li>
                    <li><span className="s">★</span> Promo banner on comparable resorts</li>
                    <li><span className="s">★</span> Brands &amp; products on your page</li>
                    <li><span className="s">★</span> Nominated for PeakFlow Award each season</li>
                    <span className="lbl">Support</span>
                    <li><span className="s">★</span> Priority email support</li>
                    <li><span className="s">★</span> Personal onboarding call</li>
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
                  <div className="pc-sub">Portfolio deal for groups with multiple resorts or full chains.</div>
                  <div className="pc-price" style={{ fontSize: 28, lineHeight: 1.3 }}>Custom</div>
                  <div className="pc-period">for 3+ resorts · annual contract</div>
                  <hr />
                  <ul>
                    <li><span className="g">✓</span> Everything in Pro</li>
                    <span className="lbl">Extra</span>
                    <li><span className="s">★</span> Portfolio discount (up to 35%)</li>
                    <li><span className="s">★</span> Dedicated account manager</li>
                    <li><span className="s">★</span> Combined portfolio analytics</li>
                    <li><span className="s">★</span> Annual benchmark report</li>
                    <li><span className="s">★</span> Custom API integration</li>
                    <li><span className="s">★</span> SLA &amp; contract guarantees</li>
                  </ul>
                  <button className="btn btn-outline" style={{ width: "100%", justifyContent: "center" }}>Contact us</button>
                </div>
              </div>

              <div className="value-note">
                <span>🏔 <strong>Thousands of skiers plan monthly via PeakFlow.</strong> Pro resorts appear at the top — one extra booking more than covers the annual plan.</span>
                <span style={{ color: "var(--ink3)" }}>30 days free · no credit card required</span>
              </div>
            </>
          )}

          {/* ── BRANDS ── */}
          {seg === "brand" && (
            <>
              <div className="pc-grid">
                {/* Basic */}
                <div className="pc">
                  <div className="pc-name">Brand Basic</div>
                  <div className="pc-sub">Position your brand in front of active skiers at the moment they&apos;re planning.</div>
                  <div className="pc-price"><sup>€</sup>299</div>
                  <div className="pc-period">per month · €2,879/year (save €509)</div>
                  <hr />
                  <ul>
                    <span className="lbl">Presence</span>
                    <li><span className="g">✓</span> Verified brand profile</li>
                    <li><span className="g">✓</span> Product catalogue — unlimited products</li>
                    <li><span className="g">✓</span> Auto-matching on relevant resort pages</li>
                    <li><span className="g">✓</span> Category presence (skis, helmets, jackets…)</li>
                    <span className="lbl">Data</span>
                    <li><span className="g">✓</span> Impression &amp; click analytics</li>
                    <li><span className="g">✓</span> Monthly reach report</li>
                  </ul>
                  <button className="btn btn-outline" style={{ width: "100%", justifyContent: "center" }}>Start Basic</button>
                </div>

                {/* Pro */}
                <div className="pc hot">
                  <div className="pc-badge">Most popular</div>
                  <div className="pc-name">Brand Pro</div>
                  <div className="pc-sub">Reach the right skiers targeted by level, resort type and travel intent.</div>
                  <div className="pc-price"><sup>€</sup>699</div>
                  <div className="pc-period">per month · €6,710/year (save €1,078)</div>
                  <hr />
                  <ul>
                    <li><span className="g">✓</span> Everything in Basic</li>
                    <span className="lbl">Targeting</span>
                    <li><span className="s">★</span> Targeted resort targeting (level, country, type)</li>
                    <li><span className="s">★</span> Prominent Gear Selector listing</li>
                    <li><span className="s">★</span> Personalised product recommendations to users</li>
                    <span className="lbl">Insights</span>
                    <li><span className="s">★</span> Audience insights dashboard</li>
                    <li><span className="s">★</span> Audience segmentation (level, age, country)</li>
                    <li><span className="s">★</span> Detailed campaign performance reports</li>
                    <span className="lbl">Activation</span>
                    <li><span className="s">★</span> Demo day &amp; season campaign integration</li>
                    <li><span className="s">★</span> Featured brand in PeakFlow content</li>
                  </ul>
                  <button className="btn btn-primary" style={{ width: "100%", justifyContent: "center" }}>Start Pro →</button>
                </div>

                {/* Enterprise */}
                <div className="pc">
                  <div className="pc-name">Brand Enterprise</div>
                  <div className="pc-sub">Full category dominance and co-branded campaigns tailored to you.</div>
                  <div className="pc-price" style={{ fontSize: 28, lineHeight: 1.3 }}>€1,500+</div>
                  <div className="pc-period">per month · annual contract</div>
                  <hr />
                  <ul>
                    <li><span className="g">✓</span> Everything in Pro</li>
                    <span className="lbl">Exclusive</span>
                    <li><span className="s">★</span> Category exclusivity — your brand only</li>
                    <li><span className="s">★</span> Co-branded campaigns with PeakFlow</li>
                    <li><span className="s">★</span> Annual ski market report</li>
                    <li><span className="s">★</span> Dedicated account manager</li>
                    <li><span className="s">★</span> Custom integrations &amp; API access</li>
                    <li><span className="s">★</span> Contract guarantees &amp; SLA</li>
                  </ul>
                  <button className="btn btn-outline" style={{ width: "100%", justifyContent: "center" }}>Contact us</button>
                </div>
              </div>

              <div className="value-note">
                <span>🎿 <strong>PeakFlow reaches skiers at the moment they&apos;re planning</strong> — high purchase intent, no wasted reach. Cheaper than Google Ads with higher relevance.</span>
                <span style={{ color: "var(--ink3)" }}>All prices excl. VAT</span>
              </div>
            </>
          )}

          <p style={{ marginTop: 20, fontSize: 12, color: "var(--ink3)" }}>
            All prices excl. VAT · Stripe-secured payments · Cancel anytime
          </p>
          <Link href="/" className="btn btn-ghost" style={{ marginTop: 10 }}>← Back to home</Link>
        </div>
      </section>
    </>
  );
}
