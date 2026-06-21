import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { countryFlag, countryNL, toFiveStars } from "@/lib/display";

export const dynamic = "force-dynamic";

const COUNTRIES = [
  { key: "", label: "Alle landen" },
  { key: "Austria", label: "🇦🇹 Oostenrijk" },
  { key: "France", label: "🇫🇷 Frankrijk" },
  { key: "Switzerland", label: "🇨🇭 Zwitserland" },
  { key: "Italy", label: "🇮🇹 Italië" },
  { key: "Germany", label: "🇩🇪 Duitsland" },
  { key: "Norway", label: "🇳🇴 Noorwegen" },
  { key: "Sweden", label: "🇸🇪 Zweden" },
  { key: "Spain", label: "🇪🇸 Spanje" },
  { key: "Andorra", label: "🇦🇩 Andorra" },
];

type SP = Promise<{ q?: string; country?: string; page?: string }>;

export default async function AdminPage({ searchParams }: { searchParams?: SP }) {
  const sp = searchParams ? await searchParams : {};
  const q = sp.q ?? "";
  const country = sp.country ?? "";
  const page = parseInt(sp.page ?? "1");
  const PER_PAGE = 50;

  const where: Record<string, unknown> = {};
  if (q) where.name = { contains: q, mode: "insensitive" };
  if (country) where.Country = country;

  const [total, rated, withSf, count, resorts] = await Promise.all([
    prisma.resort.count(),
    prisma.resort.count({ where: { averageOverallRating: { gt: 0 } } }),
    prisma.resort.count({ where: { snowflakes: { gt: 0 } } }),
    prisma.resort.count({ where }),
    prisma.resort.findMany({
      where,
      orderBy: { name: "asc" },
      skip: (page - 1) * PER_PAGE,
      take: PER_PAGE,
      select: { id: true, name: true, Country: true, category: true, averageOverallRating: true, reviewCount: true, snowScore: true, snowflakes: true },
    }),
  ]);

  const totalPages = Math.ceil(count / PER_PAGE);

  function queryStr(overrides: Record<string, string>) {
    const p = new URLSearchParams();
    if (q) p.set("q", q);
    if (country) p.set("country", country);
    p.set("page", "1");
    for (const [k, v] of Object.entries(overrides)) {
      if (v) p.set(k, v); else p.delete(k);
    }
    return "/admin?" + p.toString();
  }

  const statCardStyle = (color: string): React.CSSProperties => ({
    background: "#1e293b",
    border: "1px solid #334155",
    borderRadius: 12,
    padding: "18px 24px",
    minWidth: 160,
    borderLeft: `3px solid ${color}`,
  });

  const inputStyle: React.CSSProperties = {
    background: "#1e293b",
    border: "1px solid #334155",
    borderRadius: 8,
    color: "white",
    padding: "8px 14px",
    fontSize: 13,
    outline: "none",
  };

  const thStyle: React.CSSProperties = {
    padding: "10px 14px",
    fontWeight: 600,
    fontSize: 11,
    textTransform: "uppercase" as const,
    letterSpacing: "0.5px",
    color: "#64748b",
    borderBottom: "1px solid #334155",
    textAlign: "left" as const,
  };

  const tdStyle: React.CSSProperties = {
    padding: "12px 14px",
    fontSize: 13,
    color: "#cbd5e1",
    borderBottom: "1px solid #1e293b",
    verticalAlign: "middle" as const,
  };

  return (
    <>
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontSize: 22, fontWeight: 700, color: "white", marginBottom: 4 }}>Resort Ratings Beheer</h1>
        <p style={{ fontSize: 13, color: "#64748b" }}>Stel de officiële PeakFlow beoordelingen in voor elk skigebied.</p>
      </div>

      {/* Stats */}
      <div style={{ display: "flex", gap: 14, marginBottom: 28, flexWrap: "wrap" }}>
        <div style={statCardStyle("#60a5fa")}>
          <div style={{ fontSize: 28, fontWeight: 700, color: "#60a5fa" }}>{total}</div>
          <div style={{ fontSize: 12, color: "#94a3b8", marginTop: 2 }}>Totaal resorts</div>
        </div>
        <div style={statCardStyle("#34d399")}>
          <div style={{ fontSize: 28, fontWeight: 700, color: "#34d399" }}>{rated}</div>
          <div style={{ fontSize: 12, color: "#94a3b8", marginTop: 2 }}>Beoordeeld</div>
        </div>
        <div style={statCardStyle("#f87171")}>
          <div style={{ fontSize: 28, fontWeight: 700, color: "#f87171" }}>{total - rated}</div>
          <div style={{ fontSize: 12, color: "#94a3b8", marginTop: 2 }}>Nog te beoordelen</div>
        </div>
        <div style={statCardStyle("#f59e0b")}>
          <div style={{ fontSize: 28, fontWeight: 700, color: "#f59e0b" }}>❄ {withSf}</div>
          <div style={{ fontSize: 12, color: "#94a3b8", marginTop: 2 }}>Met Snowflake</div>
        </div>
        <div style={{ ...statCardStyle("#a78bfa"), marginLeft: "auto" }}>
          <div style={{ fontSize: 18, fontWeight: 700, color: "#a78bfa" }}>
            {total > 0 ? Math.round((rated / total) * 100) : 0}%
          </div>
          <div style={{ fontSize: 12, color: "#94a3b8", marginTop: 2 }}>Voortgang</div>
          <div style={{ marginTop: 8, height: 4, background: "#334155", borderRadius: 2 }}>
            <div style={{ height: "100%", width: `${total > 0 ? (rated / total) * 100 : 0}%`, background: "#a78bfa", borderRadius: 2, transition: "width .3s" }} />
          </div>
        </div>
      </div>

      {/* Search */}
      <form method="get" style={{ display: "flex", gap: 10, marginBottom: 20, flexWrap: "wrap" }}>
        <input name="q" defaultValue={q} placeholder="Zoek op naam..." style={{ ...inputStyle, flex: 1, minWidth: 200 }} />
        <select name="country" defaultValue={country} style={{ ...inputStyle, cursor: "pointer" }}>
          {COUNTRIES.map(c => <option key={c.key} value={c.key}>{c.label}</option>)}
        </select>
        <button type="submit" style={{ background: "#0f6e50", color: "white", border: "none", borderRadius: 8, padding: "8px 18px", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>
          Zoeken
        </button>
        {(q || country) && (
          <Link href="/admin" style={{ display: "flex", alignItems: "center", fontSize: 13, color: "#64748b", padding: "8px 14px", background: "#1e293b", borderRadius: 8, textDecoration: "none", border: "1px solid #334155" }}>
            Wis filters
          </Link>
        )}
      </form>

      {/* Results count */}
      <div style={{ fontSize: 12, color: "#64748b", marginBottom: 12 }}>
        {count} {count === 1 ? "resort" : "resorts"} gevonden · pagina {page} van {totalPages}
      </div>

      {/* Table */}
      <div style={{ background: "#1e293b", border: "1px solid #334155", borderRadius: 12, overflow: "hidden" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr>
              <th style={thStyle}>Resort</th>
              <th style={thStyle}>Land</th>
              <th style={thStyle}>Categorie</th>
              <th style={thStyle}>Rating</th>
              <th style={thStyle}>❄</th>
              <th style={thStyle}>Status</th>
              <th style={{ ...thStyle, textAlign: "right" as const }}>Actie</th>
            </tr>
          </thead>
          <tbody>
            {resorts.map((r) => {
              const hasRating = (r.averageOverallRating ?? 0) > 0;
              const stars = hasRating ? toFiveStars(r.averageOverallRating).toFixed(1) : null;
              return (
                <tr key={r.id} style={{ transition: "background .1s" }}>
                  <td style={tdStyle}>
                    <span style={{ color: "white", fontWeight: 500 }}>{r.name}</span>
                  </td>
                  <td style={tdStyle}>{countryFlag(r.Country)} {countryNL(r.Country)}</td>
                  <td style={{ ...tdStyle, color: "#94a3b8" }}>{r.category ?? "—"}</td>
                  <td style={tdStyle}>
                    {stars ? (
                      <span style={{ color: "#fbbf24", fontWeight: 600 }}>★ {stars}</span>
                    ) : (
                      <span style={{ color: "#475569" }}>—</span>
                    )}
                  </td>
                  <td style={tdStyle}>
                    {r.snowflakes > 0 ? (
                      <span style={{ color: "#f59e0b", fontSize: 14, letterSpacing: 1 }}>{"❄".repeat(r.snowflakes)}</span>
                    ) : (
                      <span style={{ color: "#475569", fontSize: 11 }}>—</span>
                    )}
                  </td>
                  <td style={tdStyle}>
                    {hasRating ? (
                      <span style={{ display: "inline-flex", alignItems: "center", gap: 5, fontSize: 11, fontWeight: 600, color: "#34d399", background: "rgba(52,211,153,.1)", padding: "3px 8px", borderRadius: 999 }}>
                        ✓ Beoordeeld
                      </span>
                    ) : (
                      <span style={{ display: "inline-flex", alignItems: "center", gap: 5, fontSize: 11, fontWeight: 600, color: "#f87171", background: "rgba(248,113,113,.1)", padding: "3px 8px", borderRadius: 999 }}>
                        ○ Nog niet
                      </span>
                    )}
                  </td>
                  <td style={{ ...tdStyle, textAlign: "right" }}>
                    <Link
                      href={`/admin/resort/${r.id}`}
                      style={{
                        fontSize: 12,
                        fontWeight: 600,
                        color: hasRating ? "#60a5fa" : "#34d399",
                        background: hasRating ? "rgba(96,165,250,.1)" : "rgba(52,211,153,.1)",
                        padding: "5px 12px",
                        borderRadius: 6,
                        textDecoration: "none",
                        border: `1px solid ${hasRating ? "rgba(96,165,250,.2)" : "rgba(52,211,153,.2)"}`,
                      }}
                    >
                      {hasRating ? "Bewerken" : "Beoordelen"}
                    </Link>
                  </td>
                </tr>
              );
            })}
            {resorts.length === 0 && (
              <tr>
                <td colSpan={7} style={{ padding: "40px 14px", textAlign: "center", color: "#475569", fontSize: 13 }}>
                  Geen resorts gevonden voor deze filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div style={{ display: "flex", gap: 8, marginTop: 20, justifyContent: "center", flexWrap: "wrap" }}>
          {page > 1 && (
            <Link href={queryStr({ page: String(page - 1) })} style={{ fontSize: 13, color: "#94a3b8", padding: "6px 14px", background: "#1e293b", borderRadius: 6, textDecoration: "none", border: "1px solid #334155" }}>
              ← Vorige
            </Link>
          )}
          {Array.from({ length: Math.min(totalPages, 10) }, (_, i) => i + 1).map(p => (
            <Link key={p} href={queryStr({ page: String(p) })} style={{ fontSize: 13, fontWeight: p === page ? 700 : 400, color: p === page ? "white" : "#64748b", padding: "6px 12px", background: p === page ? "#0f6e50" : "#1e293b", borderRadius: 6, textDecoration: "none", border: "1px solid #334155" }}>
              {p}
            </Link>
          ))}
          {page < totalPages && (
            <Link href={queryStr({ page: String(page + 1) })} style={{ fontSize: 13, color: "#94a3b8", padding: "6px 14px", background: "#1e293b", borderRadius: 6, textDecoration: "none", border: "1px solid #334155" }}>
              Volgende →
            </Link>
          )}
        </div>
      )}
    </>
  );
}
