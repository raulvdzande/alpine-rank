import { prisma } from "@/lib/prisma";
import { comparePassword, signJwt } from "@/lib/auth";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
  async function loginUser(formData: FormData) {
    "use server";

    const email    = formData.get("email")    as string;
    const password = formData.get("password") as string;

    if (!email || !password) throw new Error("All fields are required");

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) throw new Error("Invalid email or password");

    const valid = await comparePassword(password, user.password);
    if (!valid) throw new Error("Invalid email or password");

    // Create JWT and store in httpOnly cookie
    const token = signJwt({ id: user.id, email: user.email, name: user.name });

    (await cookies()).set("session", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: "/",
    });

    redirect("/");
  }

  return (
    <main className="ar-root">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Instrument+Sans:wght@400;500;600&family=Instrument+Serif:ital@0;1&family=DM+Mono:wght@300;400&display=swap');

        :root {
          --bg:        #04080f;
          --surface:   #070d1a;
          --panel:     #0a1220;
          --border:    rgba(160,210,240,0.1);
          --border-hi: rgba(160,210,240,0.28);
          --ice:       #a0d2f0;
          --frost:     #c8e8ff;
          --dim:       rgba(200,232,255,0.4);
          --muted:     rgba(200,232,255,0.2);
        }

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        .ar-root {
          font-family: 'Instrument Sans', sans-serif;
          background: var(--bg);
          color: var(--frost);
          min-height: 100svh;
          overflow-x: hidden;
          display: grid;
          place-items: center;
          padding: 4rem 2rem;
          position: relative;
        }

        /* ── Atmospheric bg ── */
        .ar-root::before {
          content: '';
          position: fixed;
          inset: 0;
          background:
            radial-gradient(ellipse 100% 55% at 50% -5%,  rgba(80,160,220,0.18) 0%, transparent 62%),
            radial-gradient(ellipse 55%  45% at 8%   80%, rgba(40,100,200,0.08) 0%, transparent 55%),
            radial-gradient(ellipse 50%  40% at 92%  78%, rgba(20, 60,160,0.07) 0%, transparent 50%);
          pointer-events: none;
          z-index: 0;
        }

        .ar-root::after {
          content: '';
          position: fixed;
          inset: 0;
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='300' height='300' filter='url(%23n)' opacity='0.03'/%3E%3C/svg%3E");
          pointer-events: none;
          opacity: 0.5;
          z-index: 0;
        }

        .contours {
          position: fixed;
          inset: 0;
          background-image:
            repeating-linear-gradient(0deg,  transparent, transparent 79px, rgba(160,210,240,0.02)  79px, rgba(160,210,240,0.02)  80px),
            repeating-linear-gradient(90deg, transparent, transparent 79px, rgba(160,210,240,0.014) 79px, rgba(160,210,240,0.014) 80px);
          pointer-events: none;
          z-index: 0;
        }

        .bg-mountain {
          position: fixed;
          bottom: 0; left: 0; right: 0;
          width: 100%;
          pointer-events: none;
          z-index: 0;
          opacity: 0.45;
        }

        /* ── Two-panel card ── */
        .login-wrap {
          position: relative;
          z-index: 2;
          width: 100%;
          max-width: 880px;
          display: grid;
          grid-template-columns: 1fr 1fr;
          min-height: 520px;
          border-radius: 8px;
          overflow: hidden;
          box-shadow:
            0 0 0 1px rgba(160,210,240,0.06),
            0 50px 100px rgba(0,0,0,0.65),
            0 0 160px rgba(80,160,240,0.06);
          animation: rise 0.85s ease both;
        }

        /* ── Left brand panel ── */
        .login-brand {
          background: linear-gradient(160deg, rgba(160,210,240,0.07) 0%, rgba(160,210,240,0.02) 100%);
          border-right: 1px solid var(--border);
          padding: 3.5rem 3rem;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          position: relative;
          overflow: hidden;
        }

        .login-brand::before {
          content: '';
          position: absolute;
          bottom: -80px; right: -80px;
          width: 260px; height: 260px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(160,210,240,0.07) 0%, transparent 70%);
          pointer-events: none;
        }

        .brand-logo {
          font-family: 'Bebas Neue', sans-serif;
          font-size: 2.4rem;
          letter-spacing: 0.04em;
          line-height: 1;
          background: linear-gradient(170deg, #fff 0%, var(--frost) 40%, var(--ice) 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          text-decoration: none;
          filter: drop-shadow(0 0 35px rgba(100,180,240,0.22));
          transition: filter 0.2s;
        }
        .brand-logo:hover { filter: drop-shadow(0 0 50px rgba(100,180,240,0.45)); }

        .brand-tag {
          font-family: 'DM Mono', monospace;
          font-size: 0.55rem;
          letter-spacing: 0.32em;
          color: var(--ice);
          opacity: 0.4;
          text-transform: uppercase;
          display: block;
          margin-top: 0.5rem;
        }

        .brand-body {
          flex: 1;
          display: flex;
          flex-direction: column;
          justify-content: center;
          padding: 3rem 0;
        }

        .brand-title {
          font-family: 'Bebas Neue', sans-serif;
          font-size: 3.8rem;
          letter-spacing: 0.03em;
          line-height: 0.92;
          color: var(--frost);
          margin-bottom: 1.2rem;
        }

        .brand-title em {
          font-family: 'Instrument Serif', serif;
          font-style: italic;
          font-size: 0.75em;
          background: linear-gradient(120deg, var(--frost), var(--ice));
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .brand-desc {
          font-family: 'Instrument Serif', serif;
          font-style: italic;
          font-size: 0.95rem;
          color: var(--dim);
          line-height: 1.7;
          max-width: 240px;
        }

        .brand-peaks {
          width: 100%;
          opacity: 0.35;
          margin-top: 2rem;
        }

        /* small credential hint at bottom */
        .brand-hint {
          display: flex;
          align-items: center;
          gap: 0.7rem;
        }

        .hint-dot {
          width: 6px; height: 6px;
          border-radius: 50%;
          background: var(--ice);
          opacity: 0.35;
          flex-shrink: 0;
        }

        .hint-text {
          font-family: 'DM Mono', monospace;
          font-size: 0.6rem;
          letter-spacing: 0.12em;
          color: var(--muted);
          line-height: 1.6;
        }

        /* ── Right form panel ── */
        .login-form-panel {
          background: var(--surface);
          padding: 3.5rem 3rem;
          display: flex;
          flex-direction: column;
          justify-content: center;
          position: relative;
        }

        .login-form-panel::before {
          content: '';
          position: absolute;
          top: -40px; right: -40px;
          width: 180px; height: 180px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(160,210,240,0.06) 0%, transparent 70%);
          pointer-events: none;
        }

        .form-heading {
          font-family: 'DM Mono', monospace;
          font-size: 0.58rem;
          letter-spacing: 0.28em;
          text-transform: uppercase;
          color: var(--ice);
          opacity: 0.5;
          margin-bottom: 1.8rem;
          display: flex;
          align-items: center;
          gap: 0.8rem;
        }

        .form-heading::before {
          content: '';
          display: block;
          width: 20px; height: 1px;
          background: var(--ice);
          opacity: 0.4;
        }

        /* ── Fields ── */
        .field { margin-bottom: 1.3rem; }

        .field-label {
          font-family: 'DM Mono', monospace;
          font-size: 0.58rem;
          letter-spacing: 0.22em;
          text-transform: uppercase;
          color: var(--muted);
          display: block;
          margin-bottom: 0.6rem;
        }

        .field-input {
          width: 100%;
          background: var(--panel);
          border: 1px solid var(--border);
          border-radius: 3px;
          padding: 0.85rem 1rem;
          font-family: 'Instrument Sans', sans-serif;
          font-size: 0.875rem;
          color: var(--frost);
          outline: none;
          transition: border-color 0.15s, box-shadow 0.15s, background 0.15s;
          -webkit-appearance: none;
        }

        .field-input::placeholder { color: rgba(200,232,255,0.1); }

        .field-input:focus {
          border-color: var(--border-hi);
          background: rgba(10,18,32,0.9);
          box-shadow: 0 0 0 3px rgba(160,210,240,0.07);
        }

        /* ── Submit ── */
        .btn-submit {
          position: relative;
          width: 100%;
          margin-top: 1.8rem;
          font-family: 'DM Mono', monospace;
          font-size: 0.68rem;
          letter-spacing: 0.3em;
          text-transform: uppercase;
          color: #04080f;
          background: var(--ice);
          border: none;
          border-radius: 3px;
          padding: 1rem 2rem;
          cursor: pointer;
          overflow: hidden;
          isolation: isolate;
          transition: box-shadow 0.2s, transform 0.15s;
          box-shadow: 0 0 40px rgba(160,210,240,0.15), inset 0 1px 0 rgba(255,255,255,0.25);
        }

        .btn-submit::after {
          content: '';
          position: absolute;
          inset: 0;
          background: var(--frost);
          transform: translateY(101%);
          transition: transform 0.28s cubic-bezier(0.4,0,0.2,1);
          z-index: -1;
        }

        .btn-submit:hover {
          box-shadow: 0 0 70px rgba(160,210,240,0.28), inset 0 1px 0 rgba(255,255,255,0.35);
          transform: translateY(-1px);
        }

        .btn-submit:hover::after { transform: translateY(0); }
        .btn-submit:active { transform: translateY(0); }

        /* ── Divider ── */
        .divider {
          width: 100%;
          height: 1px;
          background: linear-gradient(90deg, var(--border-hi), transparent);
          margin: 1.8rem 0;
        }

        /* ── Footer ── */
        .login-footer {
          font-family: 'DM Mono', monospace;
          font-size: 0.6rem;
          letter-spacing: 0.1em;
          color: var(--muted);
          text-align: center;
        }

        .login-footer a {
          color: var(--ice);
          text-decoration: none;
          opacity: 0.7;
          transition: opacity 0.15s;
        }
        .login-footer a:hover { opacity: 1; }

        /* ── Back home ── */
        .back-home {
          position: fixed;
          top: 1.8rem; left: 2rem;
          z-index: 10;
          font-family: 'DM Mono', monospace;
          font-size: 0.58rem;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: var(--muted);
          text-decoration: none;
          display: flex;
          align-items: center;
          gap: 0.45rem;
          transition: color 0.15s;
          animation: rise 0.6s ease 0.1s both;
        }
        .back-home::before { content: '←'; font-family: sans-serif; }
        .back-home:hover { color: var(--ice); }

        @keyframes rise {
          from { opacity: 0; transform: translateY(18px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        @media (max-width: 700px) {
          .login-wrap { grid-template-columns: 1fr; }
          .login-brand { display: none; }
          .login-form-panel { padding: 2.5rem 2rem; }
          .back-home { display: none; }
        }
      `}</style>

      <div className="contours" aria-hidden="true" />

      <svg className="bg-mountain" viewBox="0 0 1440 220" preserveAspectRatio="none" aria-hidden="true">
        <defs>
          <linearGradient id="mg" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="rgba(160,210,240,0.05)" />
            <stop offset="100%" stopColor="rgba(160,210,240,0)" />
          </linearGradient>
        </defs>
        <path d="M0,220 L0,160 L180,70 L320,140 L500,30 L660,130 L800,55 L980,160 L1120,35 L1280,120 L1440,65 L1440,220 Z" fill="url(#mg)" />
        <path d="M500,30 L474,85 L526,85 Z M1120,35 L1094,88 L1146,88 Z" fill="rgba(200,232,255,0.06)" />
      </svg>

      <Link href="/" className="back-home">Home</Link>

      {/* ━━━ Two-panel card ━━━ */}
      <div className="login-wrap">

        {/* Left: brand */}
        <div className="login-brand">
          <div>
            <Link href="/" className="brand-logo">AlpineRank</Link>
            <span className="brand-tag">Global ski resort intelligence</span>
          </div>

          <div className="brand-body">
            <h1 className="brand-title">
              Back<br />on the<br /><em>mountain.</em>
            </h1>
            <p className="brand-desc">
              Sign in to rate resorts, track your rankings, and shape the leaderboard.
            </p>
            <svg className="brand-peaks" viewBox="0 0 280 60" preserveAspectRatio="none" aria-hidden="true">
              <path d="M0,60 L0,45 L50,15 L90,38 L140,5 L185,35 L230,18 L280,42 L280,60 Z" fill="rgba(160,210,240,0.15)" />
              <path d="M140,5 L122,35 L158,35 Z" fill="rgba(200,232,255,0.12)" />
            </svg>
          </div>

          <div className="brand-hint">
            <div className="hint-dot" />
            <p className="hint-text">
              Session secured with a<br />7-day signed JWT cookie.
            </p>
          </div>
        </div>

        {/* Right: form */}
        <div className="login-form-panel">
          <p className="form-heading">Sign in</p>

          <form action={loginUser}>
            <div className="field">
              <label className="field-label" htmlFor="email">Email Address</label>
              <input
                id="email" name="email" type="email"
                required autoComplete="email"
                placeholder="you@example.com"
                className="field-input"
              />
            </div>

            <div className="field">
              <label className="field-label" htmlFor="password">Password</label>
              <input
                id="password" name="password" type="password"
                required autoComplete="current-password"
                placeholder="••••••••"
                className="field-input"
              />
            </div>

            <button type="submit" className="btn-submit">
              Sign In
            </button>
          </form>

          <div className="divider" />

          <p className="login-footer">
            No account yet?&nbsp;
            <Link href="/register">Create one →</Link>
          </p>
        </div>

      </div>
    </main>
  );
}