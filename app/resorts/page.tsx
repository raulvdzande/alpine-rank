import Link from "next/link";
import { prisma } from "@/lib/prisma";
import type { Prisma } from "@prisma/client";
import {
  gradientFor, emojiFor, countryNL, countryFlag, toFiveStars, stars, fmtCount, fmtNumber,
} from "@/lib/display";
import { getCurrentUser } from "@/lib/auth";
import ResortSearch from "./ResortSearch";

export const dynamic = "force-dynamic";

const COUNTRY_FILTERS = [
  { key: "", label: "All resorts" },
  { key: "Austria", label: "🇦🇹 Austria" },
  { key: "France", label: "🇫🇷 France" },
  { key: "Switzerland", label: "🇨🇭 Switzerland" },
  { key: "Italy", label: "🇮🇹 Italy" },
];
const CAT_FILTERS = [
  { key: "Beginners", label: "🟢 Beginners" },
  { key: "Familie", label: "👨‍👩‍👧 Family" },
  { key: "Expert", label: "⚫ Expert" },
];

type Search = { country?: string; cat?: string; sort?: string; sf?: string; q?: string };

function buildQuery(next: Search): string {
  const p = new URLSearchParams();
  if (next.country) p.set("country", next.country);
  if (next.cat) p.set("cat", next.cat);
  if (next.sort) p.set("sort", next.sort);
  if (next.sf) p.set("sf", next.sf);
  if (next.q) p.set("q", next.q);
  const s = p.toString();
  return s ? `/resorts?${s}` : "/resorts";
}

export default async function ResortsPage({ searchParams }: { searchParams?: Promise<Search> }) {
  const [sp, user] = await Promise.all([
    searchParams ? searchParams : Promise.resolve({} as Search),
    getCurrentUser(),
  ]);
  const isSuperAdmin = user?.role === "ADMIN";

  const country = sp.country ?? "";
  const cat = sp.cat ?? "";
  const sort = sp.sort ?? "snow";
  const sf = sp.sf ?? "";
  const q = isSuperAdmin ? (sp.q ?? "") : "";

  const where: Prisma.ResortWhereInput = {};
  if (country) where.Country = country;
  if (cat) where.category = cat;
  if (q) where.name = { contains: q, mode: "insensitive" };

  const orderBy: Prisma.ResortOrderByWithRelationInput =
    sort === "rating" ? { averageOverallRating: "desc" } :
    sort === "price" ? { dayPassPrice: "asc" } :
    { snowScore: "desc" };

  const sfOnly = sp.sf === "1";
  if (sfOnly) where.snowflakes = { gt: 0 };

  const resorts = await prisma.resort.findMany({ where, orderBy, take: q ? 100 : 24 });

  return (
    <section className="section">
      <div className="container">
        <span className="label">Rankings 2025–26</span>
        <h2>Europe&apos;s most complete ski rankings</h2>
        {isSuperAdmin && (
          <div style={{ marginBottom: 16, display: "flex", alignItems: "center", gap: 12 }}>
            <span style={{ fontSize: 11, fontWeight: 700, color: "#f59e0b", textTransform: "uppercase", letterSpacing: 1 }}>Admin search</span>
            <ResortSearch current={q} />
            {q && (
              <span style={{ fontSize: 13, color: "#64748b" }}>
                {resorts.length} result{resorts.length !== 1 ? "s" : ""} for &ldquo;{q}&rdquo;
              </span>
            )}
          </div>
        )}

        <div className="filter-row">
          {COUNTRY_FILTERS.map((f) => (
            <Link key={f.label} href={buildQuery({ country: f.key, cat, sort })}
              className={`btn ${country === f.key ? "btn-primary" : "btn-ghost"}`} style={{ fontSize: 13, padding: "7px 14px" }}>
              {f.label}
            </Link>
          ))}
          {CAT_FILTERS.map((f) => (
            <Link key={f.label} href={buildQuery({ country, cat: cat === f.key ? "" : f.key, sort, sf })}
              className={`btn ${cat === f.key ? "btn-primary" : "btn-ghost"}`} style={{ fontSize: 13, padding: "7px 14px" }}>
              {f.label}
            </Link>
          ))}
          <Link href={buildQuery({ country, cat, sort, sf: sf === "1" ? "" : "1" })}
            className={`btn ${sf === "1" ? "btn-primary" : "btn-ghost"}`}
            style={{ fontSize: 13, padding: "7px 14px", color: sf === "1" ? undefined : "#f59e0b", borderColor: sf !== "1" ? "rgba(245,158,11,.4)" : undefined }}>
            ❄ Snowflakes
          </Link>
          <div style={{ marginLeft: "auto", display: "flex", gap: 6 }}>
            {[
              { k: "snow", l: "Highest snow score" },
              { k: "rating", l: "Best rating" },
              { k: "price", l: "Lowest price" },
            ].map((s) => (
              <Link key={s.k} href={buildQuery({ country, cat, sort: s.k })}
                className={`btn ${sort === s.k ? "btn-outline" : "btn-ghost"}`}
                style={{ fontSize: 13, padding: "7px 12px", borderColor: sort === s.k ? "var(--peak)" : undefined, color: sort === s.k ? "var(--peak-dark)" : undefined }}>
                {s.l}
              </Link>
            ))}
          </div>
        </div>

        {resorts.length === 0 ? (
          <p style={{ textAlign: "center", padding: "60px 0", color: "var(--ink3)" }}>No resorts found for these filters.</p>
        ) : (
          <div className="resort-grid">
            {resorts.map((r, i) => (
              <Link href={r.slug ? `/resorts/${r.slug}` : `/resort/${r.id}`} className="resort-card" key={r.id} style={{ position: "relative" }}>
                {r.snowflakes > 0 && (
                  <div className={`sf-card-badge sf-${r.snowflakes}`}>{"❄".repeat(r.snowflakes)}</div>
                )}
                <div className="resort-img" style={{ background: gradientFor(r.id) }}>
                  <div className="resort-rank">#{i + 1} {r.category}</div>
                  <div className="resort-snow-score">❄ {r.snowScore?.toFixed(1)}</div>
                  <div className="resort-img-emoji">{emojiFor(r.id)}</div>
                </div>
                <div className="resort-body">
                  <div className="resort-name">{r.name} {r.verified && <span className="badge-verified">✓</span>}</div>
                  <div className="resort-location">{countryFlag(r.Country)} {countryNL(r.Country)}</div>
                  <div className="resort-stats">
                    <div className="resort-stat"><span>{r.pisteKm}</span> km</div>
                    <div className="resort-stat"><span>{r.lifts}</span> lifts</div>
                    <div className="resort-stat"><span>€{r.dayPassPrice}</span>/day</div>
                  </div>
                  {(r.averageOverallRating ?? 0) > 0 && (
                    <div className="resort-rating"><span className="stars">{stars(toFiveStars(r.averageOverallRating))}</span><span className="count">{toFiveStars(r.averageOverallRating).toFixed(1)} ({fmtCount(r.reviewCount)})</span></div>
                  )}
                </div>
              </Link>
            ))}
          </div>
        )}

        <div style={{ textAlign: "center", marginTop: 32 }}>
          <p style={{ fontSize: 13, color: "var(--ink3)", marginBottom: 12 }}>Upgrade to Explorer for snow certainty scores and all resorts</p>
          <Link href="/pricing" className="btn btn-primary btn-lg">Upgrade to Explorer →</Link>
        </div>
      </div>
    </section>
  );
}
