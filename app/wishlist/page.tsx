import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import PlanInterestButton from "./PlanInterestButton";

export const metadata = {
  title: "Roadmap & Plans — PeakFlow",
  description: "See what's in each version and indicate which plan suits you.",
};

export const dynamic = "force-dynamic";

const v04Features = [
  "Snow certainty score algorithm (Open-Meteo historical data)",
  "AI Resort Matcher (level, budget, trip duration, preference)",
  "Resort comparator (up to 4 resorts side by side)",
  "Write reviews per resort with category ratings",
  "Wishlist — save resorts to your account",
  "Rankings per category (Alps, beginners, family, expert, budget, snow)",
  "Blog with ski articles",
  "Register & login for users",
  "Company dashboard for resort & brand companies",
  "Stripe payments & subscriptions",
  "Plan interest tracking via wishlist page",
];

const v04Pages = [
  "/ — Homepage",
  "/resorts — All resorts",
  "/resorts/[slug] — Resort detail",
  "/resorts/compare — Resort comparator",
  "/rankings — Rankings overview",
  "/rankings/[category] — Rankings per category",
  "/matcher — AI Resort Matcher",
  "/snow-score — Snow certainty explained",
  "/blog — Blog overview",
  "/blog/[slug] — Blog article",
  "/for-resorts — For ski resorts",
  "/pricing — Pricing",
  "/about — About us",
  "/privacy — Privacy policy",
  "/terms — Terms of service",
  "/wishlist — Roadmap & Plans",
  "/login — Log in",
  "/register — Register",
  "/account — Account profile",
  "/account/wishlist — Saved resorts",
  "/dashboard — User dashboard",
  "/company/dashboard — Company dashboard",
  "/company/setup — Company setup",
];

const userPlans = [
  {
    key: "free",
    name: "Free",
    price: "€0",
    period: "always free",
    tag: null,
    features: [
      "View top 50 rankings",
      "AI Matcher (3 suggestions)",
      "5 resorts on wishlist",
      "Read reviews",
      "Resort comparator",
    ],
  },
  {
    key: "explorer",
    name: "Explorer",
    price: "€4.99",
    period: "per month · €39/year",
    tag: "Most popular",
    features: [
      "All 2,000+ rankings",
      "Unlimited AI Matcher",
      "Unlimited wishlist",
      "Write reviews & photos",
      "Snow certainty score",
      "Set snow alerts",
      "Ski diary & statistics",
      "Group planning tool",
      "No ads",
    ],
  },
];

const resortPlans = [
  {
    key: "resort_starter",
    name: "Resort Starter",
    price: "€79",
    period: "per month · €799/year",
    tag: null,
    features: [
      "Edit resort profile",
      "Post snow reports",
      "Reply to reviews",
      "Page statistics",
      "Update lift status",
      "Verified badge",
      "3 team members",
    ],
  },
  {
    key: "resort_pro",
    name: "Resort Pro",
    price: "€199",
    period: "per month · €1,990/year",
    tag: "Recommended",
    features: [
      "Everything in Starter",
      "Benchmark vs competitors",
      "Create promotions",
      "Upload photo gallery",
      "Ranking history chart",
      "Events calendar",
      "CSV statistics export",
      "Unlimited team members",
      "API access",
    ],
  },
];

const brandPlans = [
  {
    key: "brand_basis",
    name: "Brand Basic",
    price: "€299",
    period: "per month",
    tag: null,
    features: [
      "Banner on 10 resort pages",
      "Impressions & clicks dashboard",
      "Create campaigns",
      "Brand page on PeakFlow",
      "Basic targeting (country)",
    ],
  },
  {
    key: "brand_pro",
    name: "Brand Pro",
    price: "€699",
    period: "per month",
    tag: "Most reach",
    features: [
      "Everything in Basic",
      "Unlimited resort pages",
      "Targeting by ski level & budget",
      "A/B test banners",
      "Seasonal campaigns",
      "Campaign stats per resort",
      "Milestone notifications",
      "Dedicated account manager",
    ],
  },
];

export default async function WishlistPage() {
  const user = await getCurrentUser();

  let savedPlans: string[] = [];
  if (user) {
    const interests = await prisma.planInterest.findMany({
      where: { userId: user.id },
      select: { plan: true },
    });
    savedPlans = interests.map(i => i.plan);
  }

  return (
    <div style={{ fontFamily: "system-ui, sans-serif" }}>

      {/* Hero */}
      <section style={{
        background: "linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f4c35 100%)",
        color: "white", padding: "80px 20px", textAlign: "center",
      }}>
        <div style={{ maxWidth: 720, margin: "0 auto" }}>
          <div style={{
            display: "inline-block", background: "rgba(29,158,117,0.2)", color: "#6ee7b7",
            padding: "6px 16px", borderRadius: 999, fontSize: 13, fontWeight: 700,
            marginBottom: 24, border: "1px solid rgba(110,231,183,0.3)",
          }}>
            v1.0 isn't out yet — but you can already indicate your interest
          </div>
          <h1 style={{ fontSize: 52, fontWeight: 900, marginBottom: 20, lineHeight: 1.1 }}>
            PeakFlow Roadmap<br /><span style={{ color: "#6ee7b7" }}>& Plans</span>
          </h1>
          <p style={{ fontSize: 18, color: "#94a3b8", maxWidth: 560, margin: "0 auto 32px" }}>
            See what&apos;s in each version, compare the plans and add your favourite plan to your wishlist.
            That way we know what the community wants most.
          </p>
          <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
            <a href="#versies" style={{ background: "#1d9e75", color: "white", padding: "14px 28px", borderRadius: 8, fontWeight: 700, textDecoration: "none", fontSize: 15 }}>
              View versions →
            </a>
            <a href="#plans" style={{ background: "rgba(255,255,255,0.1)", color: "white", padding: "14px 28px", borderRadius: 8, fontWeight: 700, textDecoration: "none", fontSize: 15, border: "1px solid rgba(255,255,255,0.2)" }}>
              Compare plans
            </a>
          </div>
        </div>
      </section>

      {/* Versie tijdlijn */}
      <section id="versies" style={{ padding: "80px 20px", background: "#f8fafc" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 48 }}>
            <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: 2, color: "#1d9e75", textTransform: "uppercase", marginBottom: 12 }}>Roadmap</div>
            <h2 style={{ fontSize: 36, fontWeight: 800, color: "#0f172a" }}>What&apos;s in each version?</h2>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 24 }}>
            {/* v0.4 */}
            <div style={{ background: "white", borderRadius: 16, padding: 32, border: "2px solid #1d9e75", position: "relative" }}>
              <div style={{ position: "absolute", top: -12, left: 24, background: "#1d9e75", color: "white", padding: "4px 14px", borderRadius: 999, fontSize: 12, fontWeight: 700 }}>
                Live now
              </div>
              <div style={{ fontSize: 28, fontWeight: 900, color: "#0f172a", marginBottom: 4 }}>v0.4</div>
              <div style={{ fontSize: 13, color: "#64748b", marginBottom: 24 }}>The foundation — in development</div>

              <div style={{ fontSize: 13, fontWeight: 700, color: "#1d9e75", textTransform: "uppercase", letterSpacing: 1, marginBottom: 12 }}>Features</div>
              <ul style={{ listStyle: "none", padding: 0, margin: "0 0 28px", display: "flex", flexDirection: "column", gap: 9 }}>
                {v04Features.map(f => (
                  <li key={f} style={{ display: "flex", alignItems: "flex-start", gap: 10, fontSize: 13, color: "#334155" }}>
                    <span style={{ color: "#1d9e75", fontWeight: 700, flexShrink: 0 }}>✓</span>
                    {f}
                  </li>
                ))}
              </ul>

              <div style={{ fontSize: 13, fontWeight: 700, color: "#1d9e75", textTransform: "uppercase", letterSpacing: 1, marginBottom: 12 }}>Pages</div>
              <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 7 }}>
                {v04Pages.map(p => (
                  <li key={p} style={{ fontSize: 12, color: "#64748b", fontFamily: "monospace", background: "#f8fafc", padding: "4px 8px", borderRadius: 4 }}>
                    {p}
                  </li>
                ))}
              </ul>
            </div>

            {/* v0.5 */}
            <div style={{ background: "white", borderRadius: 16, padding: 32, border: "2px solid #3b82f6", position: "relative" }}>
              <div style={{ position: "absolute", top: -12, left: 24, background: "#3b82f6", color: "white", padding: "4px 14px", borderRadius: 999, fontSize: 12, fontWeight: 700 }}>
                Coming soon
              </div>
              <div style={{ fontSize: 28, fontWeight: 900, color: "#0f172a", marginBottom: 4 }}>v0.5</div>
              <div style={{ fontSize: 13, color: "#64748b", marginBottom: 24 }}>In development — details to follow</div>

              <div style={{ fontSize: 13, fontWeight: 700, color: "#3b82f6", textTransform: "uppercase", letterSpacing: 1, marginBottom: 12 }}>Features</div>
              <div style={{ padding: 16, background: "#eff6ff", borderRadius: 10, marginBottom: 20, textAlign: "center" }}>
                <div style={{ fontSize: 13, color: "#3b82f6", fontWeight: 600 }}>🔒 Coming soon — announcement shortly</div>
              </div>

              <div style={{ fontSize: 13, fontWeight: 700, color: "#3b82f6", textTransform: "uppercase", letterSpacing: 1, marginBottom: 12 }}>Pages</div>
              <div style={{ padding: 16, background: "#eff6ff", borderRadius: 10, textAlign: "center" }}>
                <div style={{ fontSize: 13, color: "#3b82f6", fontWeight: 600 }}>🔒 Coming soon — announcement shortly</div>
              </div>
            </div>

            {/* v1.0 */}
            <div style={{ background: "white", borderRadius: 16, padding: 32, border: "2px solid #e2e8f0", position: "relative" }}>
              <div style={{ position: "absolute", top: -12, left: 24, background: "#64748b", color: "white", padding: "4px 14px", borderRadius: 999, fontSize: 12, fontWeight: 700 }}>
                Future
              </div>
              <div style={{ fontSize: 28, fontWeight: 900, color: "#0f172a", marginBottom: 4 }}>v1.0</div>
              <div style={{ fontSize: 13, color: "#64748b", marginBottom: 24 }}>The full public launch</div>

              <div style={{ fontSize: 13, fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", letterSpacing: 1, marginBottom: 12 }}>Features</div>
              <div style={{ padding: 16, background: "#f8fafc", borderRadius: 10, marginBottom: 20, textAlign: "center" }}>
                <div style={{ fontSize: 13, color: "#94a3b8", fontWeight: 600 }}>○ Not yet announced</div>
              </div>

              <div style={{ fontSize: 13, fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", letterSpacing: 1, marginBottom: 12 }}>Pages</div>
              <div style={{ padding: 16, background: "#f8fafc", borderRadius: 10, textAlign: "center" }}>
                <div style={{ fontSize: 13, color: "#94a3b8", fontWeight: 600 }}>○ Not yet announced</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Plans */}
      <section id="plans" style={{ padding: "80px 20px", background: "white" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 16 }}>
            <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: 2, color: "#1d9e75", textTransform: "uppercase", marginBottom: 12 }}>Plans</div>
            <h2 style={{ fontSize: 36, fontWeight: 800, color: "#0f172a", marginBottom: 12 }}>Which plan suits you?</h2>
            <p style={{ color: "#64748b", fontSize: 16, maxWidth: 480, margin: "0 auto" }}>
              Add your favourite plan to your wishlist. That way we know what the community wants and we&apos;ll build it faster.
            </p>
          </div>

          {/* Gebruiker */}
          <div style={{ marginTop: 56 }}>
            <h3 style={{ fontSize: 20, fontWeight: 800, color: "#0f172a", marginBottom: 6 }}>⛷ For skiers</h3>
            <p style={{ color: "#64748b", fontSize: 14, marginBottom: 24 }}>Find the perfect resort, compare and track your ski season</p>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 20 }}>
              {userPlans.map(plan => (
                <PlanCard
                  key={plan.key}
                  plan={plan}
                  userEmail={user?.email ?? null}
                  alreadySaved={savedPlans.includes(plan.key)}
                />
              ))}
            </div>
          </div>

          {/* Resort */}
          <div style={{ marginTop: 56 }}>
            <h3 style={{ fontSize: 20, fontWeight: 800, color: "#0f172a", marginBottom: 6 }}>🏔 For ski resorts</h3>
            <p style={{ color: "#64748b", fontSize: 14, marginBottom: 24 }}>Manage your profile, reply to reviews and track your ranking</p>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 20 }}>
              {resortPlans.map(plan => (
                <PlanCard
                  key={plan.key}
                  plan={plan}
                  userEmail={user?.email ?? null}
                  alreadySaved={savedPlans.includes(plan.key)}
                />
              ))}
            </div>
          </div>

          {/* Brand */}
          <div style={{ marginTop: 56 }}>
            <h3 style={{ fontSize: 20, fontWeight: 800, color: "#0f172a", marginBottom: 6 }}>🎿 For brands</h3>
            <p style={{ color: "#64748b", fontSize: 14, marginBottom: 24 }}>Reach skiers at the moment they choose a resort</p>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 20 }}>
              {brandPlans.map(plan => (
                <PlanCard
                  key={plan.key}
                  plan={plan}
                  userEmail={user?.email ?? null}
                  alreadySaved={savedPlans.includes(plan.key)}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA bottom */}
      <section style={{ background: "#0f172a", color: "white", padding: "60px 20px", textAlign: "center" }}>
        <div style={{ maxWidth: 560, margin: "0 auto" }}>
          <h2 style={{ fontSize: 28, fontWeight: 800, marginBottom: 12 }}>Questions or ideas?</h2>
          <p style={{ color: "#94a3b8", marginBottom: 24 }}>
            Missing a feature or want to contribute to the roadmap? Send us a message.
          </p>
          <a
            href="mailto:raulvdzande740@gmail.com"
            style={{ background: "#1d9e75", color: "white", padding: "14px 28px", borderRadius: 8, fontWeight: 700, textDecoration: "none", fontSize: 15, display: "inline-block" }}
          >
            Send a message →
          </a>
        </div>
      </section>
    </div>
  );
}

function PlanCard({
  plan,
  userEmail,
  alreadySaved,
}: {
  plan: { key: string; name: string; price: string; period: string; tag: string | null; features: string[] };
  userEmail: string | null;
  alreadySaved: boolean;
}) {
  const isFeatured = !!plan.tag;

  return (
    <div style={{
      border: isFeatured ? "2px solid #1d9e75" : "2px solid #e2e8f0",
      borderRadius: 16,
      padding: 28,
      background: "white",
      position: "relative",
      display: "flex",
      flexDirection: "column",
    }}>
      {plan.tag && (
        <div style={{
          position: "absolute", top: -12, left: 24,
          background: "#1d9e75", color: "white",
          padding: "4px 14px", borderRadius: 999, fontSize: 12, fontWeight: 700,
        }}>
          {plan.tag}
        </div>
      )}
      <div style={{ fontSize: 18, fontWeight: 800, color: "#0f172a", marginBottom: 4 }}>{plan.name}</div>
      <div style={{ marginBottom: 4 }}>
        <span style={{ fontSize: 32, fontWeight: 900, color: "#0f172a" }}>{plan.price}</span>
      </div>
      <div style={{ fontSize: 13, color: "#94a3b8", marginBottom: 24 }}>{plan.period}</div>

      <ul style={{ listStyle: "none", padding: 0, margin: "0 0 24px", flex: 1, display: "flex", flexDirection: "column", gap: 10 }}>
        {plan.features.map(f => (
          <li key={f} style={{ display: "flex", alignItems: "flex-start", gap: 10, fontSize: 14, color: "#334155" }}>
            <span style={{ color: "#1d9e75", fontWeight: 700, flexShrink: 0 }}>✓</span>
            {f}
          </li>
        ))}
      </ul>

      <PlanInterestButton plan={plan.key} userEmail={userEmail} alreadySaved={alreadySaved} />
    </div>
  );
}
