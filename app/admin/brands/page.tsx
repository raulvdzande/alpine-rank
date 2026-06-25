import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Suspense } from "react";

export const metadata = { title: "Merken — Admin" };

async function BrandsList() {
  const brands = await prisma.company.findMany({
    where: { type: "BRAND" },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <div style={{ display: "grid", gap: 16 }}>
        {brands.length === 0 ? (
          <p style={{ color: "var(--ink3)", textAlign: "center", padding: "40px 20px" }}>Geen merken gevonden</p>
        ) : (
          brands.map((brand) => (
            <div key={brand.id} style={{ background: "white", border: "1px solid var(--border)", borderRadius: 12, padding: 20, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div style={{ display: "flex", gap: 16, alignItems: "center", flex: 1 }}>
                {brand.logo && (
                  <img src={brand.logo} alt={brand.name} style={{ width: 60, height: 60, objectFit: "contain", borderRadius: 8, background: "var(--border)" }} />
                )}
                <div>
                  <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 4 }}>{brand.name}</h3>
                  <p style={{ fontSize: 13, color: "var(--ink3)" }}>{brand.country || "—"} • {brand.email}</p>
                </div>
              </div>
              <div style={{ display: "flex", gap: 8 }}>
                <Link href={`/admin/brands/${brand.id}/edit`} style={{ padding: "8px 16px", background: "var(--peak)", color: "white", borderRadius: 8, textDecoration: "none", fontWeight: 600, fontSize: 13 }}>
                  Wijzigen
                </Link>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default function BrandsPage() {
  return (
    <section style={{ padding: "40px 20px", maxWidth: 1000, margin: "0 auto" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 32 }}>
        <h1 style={{ fontSize: 28, fontWeight: 800 }}>Merken</h1>
        <Link href="/admin/brands/new" style={{ padding: "10px 20px", background: "var(--peak)", color: "white", borderRadius: 8, textDecoration: "none", fontWeight: 600 }}>
          + Nieuw merk
        </Link>
      </div>

      <Suspense fallback={<p>Laden...</p>}>
        <BrandsList />
      </Suspense>
    </section>
  );
}
