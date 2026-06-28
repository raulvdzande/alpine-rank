import { cookies } from "next/headers";
import { jwtVerify } from "jose";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import Link from "next/link";

const secret = new TextEncoder().encode(process.env.JWT_SECRET || "your-secret-key");

export const metadata = {
  title: "Company Dashboard",
};

async function getCompanyData() {
  const cookieStore = await cookies();
  const token = cookieStore.get("company_token")?.value;

  if (!token) {
    redirect("/company/login");
  }

  try {
    const verified = await jwtVerify(token, secret);
    const payload = verified.payload as any;

    const company = await prisma.company.findUnique({
      where: { id: payload.companyId },
      include: {
        employees: true,
        subscription: true,
      },
    });

    const employee = await prisma.companyEmployee.findUnique({
      where: { id: payload.employeeId },
    });

    if (!company || !employee) {
      redirect("/company/login");
    }

    return { company, employee };
  } catch (error) {
    redirect("/company/login");
  }
}

export default async function CompanyDashboardPage() {
  const { company, employee } = await getCompanyData();

  const typeLabel = company.type === "RESORT" ? "🏔 Ski resort" : "🎿 Brand";

  return (
    <div style={{ minHeight: "100vh", background: "var(--snow)", padding: "32px 20px" }}>
      <div style={{ maxWidth: 1000, margin: "0 auto" }}>
        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 40 }}>
          <div>
            <h1 style={{ fontSize: 32, fontWeight: 800, marginBottom: 4 }}>
              {company.name}
            </h1>
            <p style={{ fontSize: 14, color: "var(--ink3)" }}>
              {typeLabel} • Welcome {employee.name}
            </p>
          </div>

          <div style={{ textAlign: "right" }}>
            <p style={{ fontSize: 12, color: "var(--ink3)", marginBottom: 8 }}>
              {employee.email}
            </p>
            <Link
              href="/api/company/logout"
              style={{
                fontSize: 12,
                color: "var(--peak)",
                textDecoration: "none",
                fontWeight: 600,
              }}
            >
              Log out
            </Link>
          </div>
        </div>

        {/* Stats */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 16, marginBottom: 40 }}>
          <div style={{ background: "white", padding: 20, borderRadius: 12, border: "1px solid var(--border)" }}>
            <div style={{ fontSize: 12, color: "var(--ink3)", marginBottom: 8 }}>Company name</div>
            <div style={{ fontSize: 18, fontWeight: 700 }}>{company.name}</div>
          </div>

          <div style={{ background: "white", padding: 20, borderRadius: 12, border: "1px solid var(--border)" }}>
            <div style={{ fontSize: 12, color: "var(--ink3)", marginBottom: 8 }}>Type</div>
            <div style={{ fontSize: 18, fontWeight: 700 }}>{typeLabel}</div>
          </div>

          <div style={{ background: "white", padding: 20, borderRadius: 12, border: "1px solid var(--border)" }}>
            <div style={{ fontSize: 12, color: "var(--ink3)", marginBottom: 8 }}>Status</div>
            <div style={{ fontSize: 18, fontWeight: 700, color: "#22c55e" }}>
              {company.subscription?.status === "active" ? "Active" : "Inactive"}
            </div>
          </div>

          <div style={{ background: "white", padding: 20, borderRadius: 12, border: "1px solid var(--border)" }}>
            <div style={{ fontSize: 12, color: "var(--ink3)", marginBottom: 8 }}>Team</div>
            <div style={{ fontSize: 18, fontWeight: 700 }}>{company.employees.length} members</div>
          </div>
        </div>

        {/* Main content */}
        <div style={{ background: "white", padding: 32, borderRadius: 12, border: "1px solid var(--border)" }}>
          <h2 style={{ marginBottom: 24, fontSize: 20, fontWeight: 700 }}>
            Welcome to PeakFlow
          </h2>

          <div style={{ marginBottom: 32, padding: 20, background: "var(--snow)", borderRadius: 8 }}>
            <h3 style={{ marginBottom: 12, fontSize: 16, fontWeight: 600 }}>
              {company.type === "RESORT" ? "Ski Resort Dashboard" : "Brand Dashboard"}
            </h3>
            <p style={{ color: "var(--ink2)", lineHeight: 1.6 }}>
              {company.type === "RESORT"
                ? "Manage your ski resort profile, track reviews and page analytics."
                : "Manage your brand profile and track how your resorts perform on PeakFlow."}
            </p>
          </div>

          <div style={{ marginBottom: 32 }}>
            <h3 style={{ marginBottom: 16, fontSize: 16, fontWeight: 600 }}>
              Company details
            </h3>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, fontSize: 13 }}>
              <div>
                <div style={{ color: "var(--ink3)", marginBottom: 4 }}>Email</div>
                <div style={{ fontWeight: 600 }}>{company.email}</div>
              </div>
              <div>
                <div style={{ color: "var(--ink3)", marginBottom: 4 }}>Phone number</div>
                <div style={{ fontWeight: 600 }}>{company.phone || "—"}</div>
              </div>
              <div>
                <div style={{ color: "var(--ink3)", marginBottom: 4 }}>Address</div>
                <div style={{ fontWeight: 600 }}>
                  {company.street}, {company.city} {company.postalCode}
                </div>
              </div>
              <div>
                <div style={{ color: "var(--ink3)", marginBottom: 4 }}>Country</div>
                <div style={{ fontWeight: 600 }}>{company.country}</div>
              </div>
            </div>
          </div>

          <div style={{ marginBottom: 32 }}>
            <h3 style={{ marginBottom: 16, fontSize: 16, fontWeight: 600 }}>
              Team members ({company.employees.length})
            </h3>
            <div style={{ background: "var(--snow)", borderRadius: 8, overflow: "hidden" }}>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr style={{ borderBottom: "1px solid var(--border)" }}>
                    <th style={{ padding: 12, textAlign: "left", fontSize: 12, fontWeight: 600, color: "var(--ink3)" }}>
                      Name
                    </th>
                    <th style={{ padding: 12, textAlign: "left", fontSize: 12, fontWeight: 600, color: "var(--ink3)" }}>
                      Email
                    </th>
                    <th style={{ padding: 12, textAlign: "left", fontSize: 12, fontWeight: 600, color: "var(--ink3)" }}>
                      Role
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
                      <td style={{ padding: 12, fontSize: 12 }}>
                        <span style={{
                          background: emp.role === "admin" ? "#e0f2fe" : "#f3e8ff",
                          color: emp.role === "admin" ? "#0369a1" : "#6b21a8",
                          padding: "4px 8px",
                          borderRadius: 4,
                          fontWeight: 600,
                        }}>
                          {emp.role === "admin" ? "Admin" : "Employee"}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
