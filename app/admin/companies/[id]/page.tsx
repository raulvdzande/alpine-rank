import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { notFound } from "next/navigation";
import AddEmployeeButton from "./AddEmployeeButton";
import DeleteEmployeeButton from "./DeleteEmployeeButton";
import ImpersonateButton from "./ImpersonateButton";
import AddResortButton from "./AddResortButton";
import RemoveResortButton from "./RemoveResortButton";
import AddBrandButton from "./AddBrandButton";
import RemoveBrandButton from "./RemoveBrandButton";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const company = await prisma.company.findUnique({ where: { id } });
  return { title: company ? `${company.name} — Admin` : "Company not found" };
}

export default async function CompanyDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const company = await prisma.company.findUnique({
    where: { id },
    include: {
      employees: {
        orderBy: { role: "desc" },
      },
      subscription: true,
      contactSubmissions: {
        orderBy: { createdAt: "desc" },
        take: 5,
      },
      resorts: true,
      brandAssociations: {
        include: { brand: true },
      },
    },
  });

  if (!company) {
    notFound();
  }

  const typeLabel = company.type === "RESORT" ? "🏔 Ski resort" : "🎿 Brand";

  return (
    <section>
      <div style={{ maxWidth: 1000, margin: "0 auto" }}>
        <Link href="/admin/companies" style={{ fontSize: 13, color: "var(--peak)", marginBottom: 20, display: "inline-block" }}>
          ← Back to companies
        </Link>

        <div style={{ marginBottom: 32 }}>
          <h1 style={{ fontSize: 28, fontWeight: 800, marginBottom: 4 }}>
            {company.name}
          </h1>
          <p style={{ fontSize: 14, color: "var(--ink2)" }}>
            {typeLabel} • {company.email}
          </p>
        </div>

        {/* Company info */}
        <div style={{ background: "white", border: "1px solid var(--border)", borderRadius: 12, padding: 24, marginBottom: 32 }}>
          <h2 style={{ fontSize: 16, fontWeight: 700, marginBottom: 16 }}>Company details</h2>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24, fontSize: 13 }}>
            <div>
              <div style={{ color: "var(--ink3)", marginBottom: 4, fontWeight: 600 }}>Email</div>
              <div>{company.email}</div>
            </div>
            <div>
              <div style={{ color: "var(--ink3)", marginBottom: 4, fontWeight: 600 }}>Phone number</div>
              <div>{company.phone || "—"}</div>
            </div>
            <div>
              <div style={{ color: "var(--ink3)", marginBottom: 4, fontWeight: 600 }}>Website</div>
              <div>{company.website ? <a href={company.website} style={{ color: "var(--peak)" }}>{company.website}</a> : "—"}</div>
            </div>
            <div>
              <div style={{ color: "var(--ink3)", marginBottom: 4, fontWeight: 600 }}>Status</div>
              <div style={{ color: company.subscription?.status === "active" ? "#22c55e" : "#ef4444" }}>
                {company.subscription?.status === "active" ? "✓ Active" : "Inactive"}
              </div>
            </div>
            <div style={{ gridColumn: "1 / -1" }}>
              <div style={{ color: "var(--ink3)", marginBottom: 4, fontWeight: 600 }}>Address</div>
              <div>
                {company.street}, {company.city} {company.postalCode}, {company.country}
              </div>
            </div>
          </div>
        </div>

        {/* Employees */}
        <div style={{ background: "white", border: "1px solid var(--border)", borderRadius: 12, padding: 24, marginBottom: 32 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
            <h2 style={{ fontSize: 16, fontWeight: 700 }}>Team members ({company.employees.length})</h2>
            <AddEmployeeButton companyId={company.id} />
          </div>

          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ borderBottom: "2px solid var(--border)" }}>
                  <th style={{ padding: 12, textAlign: "left", fontSize: 12, fontWeight: 600, color: "var(--ink3)" }}>
                    Name
                  </th>
                  <th style={{ padding: 12, textAlign: "left", fontSize: 12, fontWeight: 600, color: "var(--ink3)" }}>
                    Email
                  </th>
                  <th style={{ padding: 12, textAlign: "left", fontSize: 12, fontWeight: 600, color: "var(--ink3)" }}>
                    Role
                  </th>
                  <th style={{ padding: 12, textAlign: "right", fontSize: 12, fontWeight: 600, color: "var(--ink3)" }}>
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {company.employees.map((emp) => (
                  <tr key={emp.id} style={{ borderBottom: "1px solid var(--border)" }}>
                    <td style={{ padding: 12, fontSize: 13, fontWeight: 500 }}>
                      {emp.name}
                    </td>
                    <td style={{ padding: 12, fontSize: 13 }}>
                      <a href={`mailto:${emp.email}`} style={{ color: "var(--peak)", textDecoration: "none" }}>
                        {emp.email}
                      </a>
                    </td>
                    <td style={{ padding: 12 }}>
                      <span style={{
                        background: emp.role === "admin" ? "#e0f2fe" : "#f3e8ff",
                        color: emp.role === "admin" ? "#0369a1" : "#6b21a8",
                        padding: "4px 8px",
                        borderRadius: 4,
                        fontSize: 12,
                        fontWeight: 600,
                      }}>
                        {emp.role === "admin" ? "Admin" : "Employee"}
                      </span>
                    </td>
                    <td style={{ padding: 12, textAlign: "right", display: "flex", gap: 12, justifyContent: "flex-end" }}>
                      <ImpersonateButton employeeId={emp.id} />
                      <DeleteEmployeeButton
                        employeeId={emp.id}
                        companyId={company.id}
                        isLastAdmin={emp.role === "admin" && company.employees.filter(e => e.role === "admin").length === 1}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Resorts */}
        <div style={{ background: "white", border: "1px solid var(--border)", borderRadius: 12, padding: 24, marginBottom: 32 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
            <h2 style={{ fontSize: 16, fontWeight: 700 }}>Ski resorts ({company.resorts.length})</h2>
            <AddResortButton companyId={company.id} />
          </div>

          {company.resorts.length === 0 ? (
            <p style={{ color: "var(--ink3)", fontSize: 14 }}>No ski resorts linked</p>
          ) : (
            <div style={{ display: "grid", gap: 12 }}>
              {company.resorts.map((resort) => (
                <div key={resort.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: 12, background: "var(--border)", borderRadius: 8 }}>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: 14 }}>{resort.name}</div>
                    <div style={{ fontSize: 12, color: "var(--ink3)" }}>{resort.Country}</div>
                  </div>
                  <RemoveResortButton resortId={resort.id} companyId={company.id} />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Brands */}
        <div style={{ background: "white", border: "1px solid var(--border)", borderRadius: 12, padding: 24, marginBottom: 32 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
            <h2 style={{ fontSize: 16, fontWeight: 700 }}>Brands ({company.brandAssociations.length})</h2>
            <AddBrandButton companyId={company.id} />
          </div>

          {company.brandAssociations.length === 0 ? (
            <p style={{ color: "var(--ink3)", fontSize: 14 }}>No brands linked</p>
          ) : (
            <div style={{ display: "grid", gap: 12 }}>
              {company.brandAssociations.map((assoc) => (
                <div key={assoc.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: 12, background: "var(--border)", borderRadius: 8 }}>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: 14 }}>{assoc.brand.name}</div>
                    <div style={{ fontSize: 12, color: "var(--ink3)" }}>{assoc.brand.country || "—"}</div>
                  </div>
                  <RemoveBrandButton brandId={assoc.brand.id} companyId={company.id} />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
