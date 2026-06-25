import { prisma } from "@/lib/prisma";
import Link from "next/link";

export const metadata = {
  title: "Bedrijven — Admin",
};

export default async function CompaniesPage() {
  const companies = await prisma.company.findMany({
    include: {
      subscription: true,
      employees: true,
      contactSubmissions: {
        orderBy: { createdAt: "desc" },
        take: 1,
      },
    },
    orderBy: { createdAt: "desc" },
  });

  const stats = {
    total: companies.length,
    resorts: companies.filter((c) => c.type === "RESORT").length,
    brands: companies.filter((c) => c.type === "BRAND").length,
    active: companies.filter((c) => c.subscription?.status === "active").length,
  };

  return (
    <section>
      <div style={{ maxWidth: 1400, margin: "0 auto" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 32 }}>
          <div>
            <h1 style={{ marginBottom: 8 }}>Bedrijven Beheer</h1>
            <p style={{ color: "var(--ink2)" }}>
              {stats.total} bedrijven
            </p>
          </div>
          <Link
            href="/admin/companies/new"
            style={{
              background: "#0f6e50",
              color: "white",
              padding: "8px 16px",
              borderRadius: 6,
              textDecoration: "none",
              fontWeight: 600,
              fontSize: 13,
            }}
          >
            + Nieuw bedrijf
          </Link>
        </div>

        {/* Stats */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: 12, marginBottom: 32 }}>
          <div style={{ background: "white", border: "1px solid var(--border)", borderRadius: 8, padding: 16 }}>
            <div style={{ fontSize: 20, fontWeight: 800, color: "var(--peak)" }}>{stats.total}</div>
            <div style={{ fontSize: 12, color: "var(--ink3)" }}>Totaal</div>
          </div>
          <div style={{ background: "white", border: "1px solid var(--border)", borderRadius: 8, padding: 16 }}>
            <div style={{ fontSize: 20, fontWeight: 800, color: "#0891b2" }}>{stats.resorts}</div>
            <div style={{ fontSize: 12, color: "var(--ink3)" }}>Skigebieden</div>
          </div>
          <div style={{ background: "white", border: "1px solid var(--border)", borderRadius: 8, padding: 16 }}>
            <div style={{ fontSize: 20, fontWeight: 800, color: "#8b5cf6" }}>{stats.brands}</div>
            <div style={{ fontSize: 12, color: "var(--ink3)" }}>Merken</div>
          </div>
          <div style={{ background: "white", border: "1px solid var(--border)", borderRadius: 8, padding: 16 }}>
            <div style={{ fontSize: 20, fontWeight: 800, color: "#22c55e" }}>{stats.active}</div>
            <div style={{ fontSize: 12, color: "var(--ink3)" }}>Actief</div>
          </div>
        </div>

        {/* Table */}
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ borderBottom: "2px solid var(--border)" }}>
                <th style={{ padding: 12, textAlign: "left", fontSize: 12, fontWeight: 600, color: "var(--ink3)" }}>
                  Bedrijf
                </th>
                <th style={{ padding: 12, textAlign: "left", fontSize: 12, fontWeight: 600, color: "var(--ink3)" }}>
                  Type
                </th>
                <th style={{ padding: 12, textAlign: "left", fontSize: 12, fontWeight: 600, color: "var(--ink3)" }}>
                  Email
                </th>
                <th style={{ padding: 12, textAlign: "left", fontSize: 12, fontWeight: 600, color: "var(--ink3)" }}>
                  Adres
                </th>
                <th style={{ padding: 12, textAlign: "left", fontSize: 12, fontWeight: 600, color: "var(--ink3)" }}>
                  Status
                </th>
                <th style={{ padding: 12, textAlign: "left", fontSize: 12, fontWeight: 600, color: "var(--ink3)" }}>
                  Team
                </th>
                <th style={{ padding: 12, textAlign: "left", fontSize: 12, fontWeight: 600, color: "var(--ink3)" }}>
                  Acties
                </th>
              </tr>
            </thead>
            <tbody>
              {companies.map((company) => (
                <tr key={company.id} style={{ borderBottom: "1px solid var(--border)" }}>
                  <td style={{ padding: 12, fontSize: 14, fontWeight: 600 }}>
                    {company.name}
                  </td>
                  <td style={{ padding: 12, fontSize: 12 }}>
                    <span style={{
                      background: company.type === "RESORT" ? "#e0f2fe" : "#f3e8ff",
                      color: company.type === "RESORT" ? "#0369a1" : "#6b21a8",
                      padding: "4px 8px",
                      borderRadius: 4,
                      fontWeight: 600,
                    }}>
                      {company.type === "RESORT" ? "🏔 Skigebied" : "🎿 Merk"}
                    </span>
                  </td>
                  <td style={{ padding: 12, fontSize: 13 }}>
                    <a href={`mailto:${company.email}`} style={{ color: "var(--peak)", textDecoration: "none" }}>
                      {company.email}
                    </a>
                  </td>
                  <td style={{ padding: 12, fontSize: 12, color: "var(--ink2)" }}>
                    {company.city}, {company.country}
                  </td>
                  <td style={{ padding: 12 }}>
                    <span style={{
                      fontSize: 11,
                      fontWeight: 600,
                      background: company.subscription?.status === "active" ? "#dcfce7" : "#fee2e2",
                      color: company.subscription?.status === "active" ? "#166534" : "#991b1b",
                      padding: "4px 8px",
                      borderRadius: 4,
                    }}>
                      {company.subscription?.status === "active" ? "Actief" : "Inactief"}
                    </span>
                  </td>
                  <td style={{ padding: 12, fontSize: 13 }}>
                    {company.employees.length} leden
                  </td>
                  <td style={{ padding: 12, fontSize: 12 }}>
                    <Link href={`/admin/companies/${company.id}`} style={{
                      color: "var(--peak)",
                      textDecoration: "none",
                      fontWeight: 600,
                    }}>
                      Details →
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {companies.length === 0 && (
          <div style={{ textAlign: "center", padding: "40px 20px", color: "var(--ink3)" }}>
            Nog geen bedrijven geregistreerd
          </div>
        )}
      </div>
    </section>
  );
}
