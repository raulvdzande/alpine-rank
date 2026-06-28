import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { countryNL, countryFlag, toFiveStars, stars, fmtNumber } from "@/lib/display";

export const metadata = {
  title: "Resort Comparator — PeakFlow",
  description: "Compare up to 4 ski resorts side by side on all criteria",
};

interface CompareParams {
  ids?: string[];
}

export default async function ComparePage({ searchParams }: { searchParams?: Promise<CompareParams> }) {
  const sp = await (searchParams ? searchParams : Promise.resolve({} as CompareParams));
  const ids = (sp.ids ?? []).slice(0, 4).filter(Boolean);

  const resorts = ids.length > 0
    ? await prisma.resort.findMany({
        where: { id: { in: ids } },
        take: 4,
      })
    : [];

  const sortedResorts = ids.map(id => resorts.find(r => r.id === id)).filter(Boolean);

  const criteria = [
    { key: "country", label: "Country", format: (r: any) => `${countryFlag(r.Country)} ${countryNL(r.Country)}` },
    { key: "region", label: "Region", format: (r: any) => r.region ?? "—" },
    { key: "altitudeTop", label: "Top altitude", format: (r: any) => `${fmtNumber(r.altitudeTop ?? 0)} m` },
    { key: "altitudeBase", label: "Base altitude", format: (r: any) => `${fmtNumber(r.altitudeBase ?? 0)} m` },
    { key: "pisteKm", label: "Total km", format: (r: any) => `${r.pisteKm ?? "—"} km` },
    { key: "pisteGreen", label: "Green %", format: (r: any) => `${r.pisteGreen ?? "—"}%` },
    { key: "pisteBlue", label: "Blue %", format: (r: any) => `${r.pisteBlue ?? "—"}%` },
    { key: "pisteRed", label: "Red %", format: (r: any) => `${r.pisteRed ?? "—"}%` },
    { key: "pisteBlack", label: "Black %", format: (r: any) => `${r.pisteBlack ?? "—"}%` },
    { key: "lifts", label: "Lifts", format: (r: any) => `${r.lifts ?? "—"} installations` },
    { key: "dayPassPrice", label: "Adult day pass", format: (r: any) => `€${r.dayPassPrice ?? "—"}` },
    { key: "snowpark", label: "Snow park", format: (r: any) => r.snowpark ? "Yes" : "No" },
    { key: "snowScore", label: "Snow score", format: (r: any) => `${r.snowScore?.toFixed(1) ?? "—"} / 10` },
    { key: "snowflakes", label: "Snowflakes", format: (r: any) => "❄".repeat(r.snowflakes) || "—" },
    { key: "rating", label: "Rating", format: (r: any) => (r.averageOverallRating ?? 0) > 0 ? `${toFiveStars(r.averageOverallRating).toFixed(1)} ⭐` : "—" },
  ];

  return (
    <section className="section">
      <div className="container">
        <div style={{ marginBottom: 40 }}>
          <span className="label">Comparator</span>
          <h2 style={{ marginBottom: 12 }}>Compare ski resorts</h2>
          <p style={{ color: "var(--ink2)", fontSize: 16, marginBottom: 24 }}>
            Select up to 4 resorts to compare them side by side on all criteria
          </p>
        </div>

        {ids.length === 0 ? (
          <div style={{ textAlign: "center", padding: "60px 0" }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>🔍</div>
            <h3 style={{ marginBottom: 10 }}>No resorts selected</h3>
            <p style={{ color: "var(--ink3)", marginBottom: 24 }}>
              Go to the <Link href="/resorts" style={{ color: "var(--peak)", textDecoration: "underline" }}>resort listing</Link> and select resorts to compare
            </p>
            <Link href="/resorts" className="btn btn-primary btn-lg">Go to resorts →</Link>
          </div>
        ) : (
          <>
            <div style={{ overflowX: "auto", marginBottom: 40 }}>
              <table style={{
                width: "100%",
                borderCollapse: "collapse",
                fontSize: 14,
                minWidth: 800,
              }}>
                <thead>
                  <tr style={{ borderBottom: "2px solid var(--border)" }}>
                    <th style={{ textAlign: "left", padding: "16px 0", fontWeight: 700, minWidth: 160 }}>Criterion</th>
                    {sortedResorts.map(r => (
                      <th key={r!.id} style={{ padding: "16px 12px", textAlign: "center", minWidth: 200 }}>
                        <Link href={r!.slug ? `/resorts/${r!.slug}` : `/resort/${r!.id}`} style={{ fontWeight: 700, color: "var(--peak)", textDecoration: "underline" }}>
                          {r!.name}
                        </Link>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {criteria.map((c, idx) => (
                    <tr key={c.key} style={{ borderBottom: idx < criteria.length - 1 ? "1px solid var(--border)" : "none" }}>
                      <td style={{ padding: "14px 0", fontWeight: 600, color: "var(--ink2)" }}>{c.label}</td>
                      {sortedResorts.map(r => (
                        <td key={r!.id} style={{ padding: "14px 12px", textAlign: "center", color: "var(--ink)" }}>
                          {c.format(r)}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div style={{ textAlign: "center" }}>
              <Link href="/resorts" className="btn btn-primary btn-lg">← Back to resorts</Link>
            </div>
          </>
        )}
      </div>
    </section>
  );
}
