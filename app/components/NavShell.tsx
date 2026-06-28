"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

interface Props {
  user: { name: string; role: string } | null;
  logoutAction: () => Promise<void>;
}

const NAV_LINKS = [
  { href: "/resorts", label: "Resorts" },
  { href: "/snowflakes", label: "❄ Snowflakes", amber: true },
  { href: "/pricing", label: "Pricing" },
];

export default function NavShell({ user, logoutAction }: Props) {
  const path = usePathname();
  const [open, setOpen] = useState(false);
  const isAdmin = user?.role === "ADMIN";

  const isActive = (href: string) => path === href || (href !== "/" && path.startsWith(href));

  return (
    <>
      <style>{`
        .nav-wrap { background: rgba(248,247,243,.95); backdrop-filter: blur(16px); -webkit-backdrop-filter: blur(16px); border-bottom: 1px solid var(--border); position: sticky; top: 0; z-index: 200; }
        .nav-inner2 { display: flex; align-items: center; justify-content: space-between; height: 62px; }

        /* Logo */
        .nav-logo2 { display: flex; align-items: center; gap: 10px; text-decoration: none; }
        .nav-logo-icon2 { width: 34px; height: 34px; background: linear-gradient(135deg, var(--peak) 0%, var(--blue) 100%); border-radius: 9px; display: flex; align-items: center; justify-content: center; color: #fff; font-size: 16px; flex-shrink: 0; }
        .nav-logo-text2 { font-size: 18px; font-weight: 800; letter-spacing: -.02em; color: var(--ink); }

        /* Links */
        .nav-links2 { display: flex; align-items: center; gap: 4px; }
        .nav-link { font-size: 14px; font-weight: 500; color: var(--ink2); padding: 6px 12px; border-radius: 8px; transition: background .15s, color .15s; white-space: nowrap; }
        .nav-link:hover { background: var(--border); color: var(--ink); }
        .nav-link.active { background: var(--peak-light); color: var(--peak-dark); font-weight: 600; }
        .nav-link.amber { color: #b45309; font-weight: 600; }
        .nav-link.amber:hover, .nav-link.amber.active { background: #fef3c7; color: #92400e; }
        .nav-link.admin-link { color: var(--peak); font-weight: 700; }
        .nav-link.admin-link:hover, .nav-link.admin-link.active { background: var(--peak-light); color: var(--peak-dark); }

        /* Actions */
        .nav-actions2 { display: flex; align-items: center; gap: 8px; }
        .nav-user-pill { display: flex; align-items: center; gap: 8px; background: var(--border); border-radius: 999px; padding: 4px 12px 4px 4px; font-size: 13px; font-weight: 500; color: var(--ink2); }
        .nav-avatar { width: 28px; height: 28px; border-radius: 50%; background: linear-gradient(135deg, var(--peak), var(--blue)); display: flex; align-items: center; justify-content: center; color: white; font-size: 11px; font-weight: 700; flex-shrink: 0; }
        .nav-logout { background: none; border: none; font-size: 12px; color: var(--ink3); cursor: pointer; padding: 4px 8px; border-radius: 6px; font-weight: 500; }
        .nav-logout:hover { background: var(--border); color: var(--ink); }

        /* Hamburger */
        .nav-burger { display: none; flex-direction: column; gap: 5px; cursor: pointer; padding: 8px; background: none; border: none; border-radius: 8px; }
        .nav-burger:hover { background: var(--border); }
        .nav-burger span { display: block; width: 20px; height: 2px; background: var(--ink); border-radius: 2px; transition: all .2s; }
        .nav-burger.open span:nth-child(1) { transform: translateY(7px) rotate(45deg); }
        .nav-burger.open span:nth-child(2) { opacity: 0; }
        .nav-burger.open span:nth-child(3) { transform: translateY(-7px) rotate(-45deg); }

        /* Mobile drawer */
        .nav-drawer { display: none; flex-direction: column; padding: 12px 0 16px; border-top: 1px solid var(--border); gap: 2px; }
        .nav-drawer.open { display: flex; }
        .nav-drawer .nav-link { padding: 10px 16px; border-radius: 8px; font-size: 15px; }
        .nav-drawer-sep { height: 1px; background: var(--border); margin: 8px 0; }
        .nav-drawer-actions { display: flex; flex-direction: column; gap: 8px; padding: 0 4px; }

        @media (max-width: 768px) {
          .nav-links2 { display: none; }
          .nav-actions2 { display: none; }
          .nav-burger { display: flex; }
        }
      `}</style>

      <nav className="nav-wrap">
        <div className="container">
          <div className="nav-inner2">
            {/* Logo */}
            <Link href="/" className="nav-logo2">
              <img src="/logo-icon.svg" alt="PeakFlow" style={{ width: 34, height: 34 }} />
              <span className="nav-logo-text2">PeakFlow</span>
            </Link>

            {/* Desktop links */}
            <div className="nav-links2">
              {NAV_LINKS.map(l => (
                <Link
                  key={l.href}
                  href={l.href}
                  className={`nav-link${l.amber ? " amber" : ""}${isActive(l.href) ? " active" : ""}`}
                >
                  {l.label}
                </Link>
              ))}
              {user && (
                <Link href="/dashboard" className={`nav-link${isActive("/dashboard") ? " active" : ""}`}>
                  Dashboard
                </Link>
              )}
              {isAdmin && (
                <Link href="/admin" className={`nav-link admin-link${isActive("/admin") ? " active" : ""}`}>
                  ⚙ Admin
                </Link>
              )}
            </div>

            {/* Desktop actions */}
            <div className="nav-actions2">
              {user ? (
                <>
                  <div className="nav-user-pill">
                    <div className="nav-avatar">
                      {isAdmin ? "⚙" : user.name.charAt(0).toUpperCase()}
                    </div>
                    <span>{user.name.split(" ")[0]}</span>
                  </div>
                  <form action={logoutAction}>
                    <button type="submit" className="nav-logout">Log out</button>
                  </form>
                </>
              ) : (
                <>
                  <Link href="/login" className="btn btn-ghost" style={{ fontSize: 13, padding: "7px 14px" }}>Log in</Link>
                  <Link href="/register" className="btn btn-primary" style={{ fontSize: 13, padding: "7px 16px" }}>Get started →</Link>
                </>
              )}
            </div>

            {/* Hamburger */}
            <button
              className={`nav-burger${open ? " open" : ""}`}
              onClick={() => setOpen(v => !v)}
              aria-label="Menu"
            >
              <span /><span /><span />
            </button>
          </div>

          {/* Mobile drawer */}
          <div className={`nav-drawer${open ? " open" : ""}`} onClick={() => setOpen(false)}>
            {NAV_LINKS.map(l => (
              <Link
                key={l.href}
                href={l.href}
                className={`nav-link${l.amber ? " amber" : ""}${isActive(l.href) ? " active" : ""}`}
              >
                {l.label}
              </Link>
            ))}
            {user && (
              <Link href="/dashboard" className={`nav-link${isActive("/dashboard") ? " active" : ""}`}>
                Dashboard
              </Link>
            )}
            {isAdmin && (
              <Link href="/admin" className={`nav-link admin-link${isActive("/admin") ? " active" : ""}`}>
                ⚙ Admin
              </Link>
            )}
            <div className="nav-drawer-sep" />
            <div className="nav-drawer-actions">
              {user ? (
                <form action={logoutAction}>
                  <button type="submit" className="btn btn-outline" style={{ width: "100%", justifyContent: "center", fontSize: 14 }}>
                    Log out ({user.name.split(" ")[0]})
                  </button>
                </form>
              ) : (
                <>
                  <Link href="/login" className="btn btn-outline" style={{ justifyContent: "center" }}>Log in</Link>
                  <Link href="/register" className="btn btn-primary" style={{ justifyContent: "center" }}>Get started →</Link>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>
    </>
  );
}
