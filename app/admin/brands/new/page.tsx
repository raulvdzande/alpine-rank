import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import Link from "next/link";

export const metadata = { title: "Nieuw merk — Admin" };

export default function NewBrandPage() {
  async function createBrand(formData: FormData) {
    "use server";

    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const country = formData.get("country") as string;
    const phone = formData.get("phone") as string;
    const website = formData.get("website") as string;

    if (!name || !email || !country) {
      redirect("/admin/brands/new?error=" + encodeURIComponent("Verplichte velden niet ingevuld"));
    }

    // Check if email exists
    const existing = await prisma.company.findUnique({ where: { email } });
    if (existing) {
      redirect("/admin/brands/new?error=" + encodeURIComponent("E-mailadres is al in gebruik"));
    }

    const brand = await prisma.company.create({
      data: {
        type: "BRAND",
        name,
        email,
        country,
        phone: phone || null,
        website: website || null,
        street: "N/A",
        city: "N/A",
        postalCode: "N/A",
        subscription: {
          create: {
            status: "active",
          },
        },
      },
    });

    redirect(`/admin/brands/${brand.id}/edit`);
  }

  return (
    <section style={{ padding: "40px 20px", maxWidth: 600, margin: "0 auto" }}>
      <Link href="/admin/brands" style={{ fontSize: 13, color: "var(--peak)", marginBottom: 20, display: "inline-block", textDecoration: "none" }}>
        ← Terug naar merken
      </Link>

      <h1 style={{ fontSize: 28, fontWeight: 800, marginBottom: 32 }}>Nieuw merk aanmaken</h1>

      <form action={createBrand} style={{ background: "white", border: "1px solid var(--border)", borderRadius: 12, padding: 24 }}>
        <div style={{ marginBottom: 20 }}>
          <label style={{ display: "block", fontSize: 13, fontWeight: 600, marginBottom: 6 }}>
            Merknaam *
          </label>
          <input
            type="text"
            name="name"
            required
            placeholder="Bijv. Atomic"
            style={{
              width: "100%",
              padding: "10px 14px",
              border: "1px solid var(--border)",
              borderRadius: 8,
              fontSize: 14,
              boxSizing: "border-box",
            }}
          />
        </div>

        <div style={{ marginBottom: 20 }}>
          <label style={{ display: "block", fontSize: 13, fontWeight: 600, marginBottom: 6 }}>
            E-mailadres *
          </label>
          <input
            type="email"
            name="email"
            required
            placeholder="contact@merk.nl"
            style={{
              width: "100%",
              padding: "10px 14px",
              border: "1px solid var(--border)",
              borderRadius: 8,
              fontSize: 14,
              boxSizing: "border-box",
            }}
          />
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 20 }}>
          <div>
            <label style={{ display: "block", fontSize: 13, fontWeight: 600, marginBottom: 6 }}>
              Land *
            </label>
            <input
              type="text"
              name="country"
              required
              placeholder="Bijv. Netherlands"
              style={{
                width: "100%",
                padding: "10px 14px",
                border: "1px solid var(--border)",
                borderRadius: 8,
                fontSize: 14,
                boxSizing: "border-box",
              }}
            />
          </div>
          <div>
            <label style={{ display: "block", fontSize: 13, fontWeight: 600, marginBottom: 6 }}>
              Telefoonnummer
            </label>
            <input
              type="tel"
              name="phone"
              placeholder="+31 6 12345678"
              style={{
                width: "100%",
                padding: "10px 14px",
                border: "1px solid var(--border)",
                borderRadius: 8,
                fontSize: 14,
                boxSizing: "border-box",
              }}
            />
          </div>
        </div>

        <div style={{ marginBottom: 24 }}>
          <label style={{ display: "block", fontSize: 13, fontWeight: 600, marginBottom: 6 }}>
            Website
          </label>
          <input
            type="url"
            name="website"
            placeholder="https://www.merk.nl"
            style={{
              width: "100%",
              padding: "10px 14px",
              border: "1px solid var(--border)",
              borderRadius: 8,
              fontSize: 14,
              boxSizing: "border-box",
            }}
          />
        </div>

        <div style={{ display: "flex", gap: 12 }}>
          <Link href="/admin/brands" style={{ flex: 1, padding: "12px", border: "1px solid var(--border)", borderRadius: 8, background: "white", cursor: "pointer", fontSize: 14, fontWeight: 600, textAlign: "center", textDecoration: "none" }}>
            Annuleren
          </Link>
          <button
            type="submit"
            style={{
              flex: 1,
              padding: "12px",
              background: "var(--peak)",
              color: "white",
              border: "none",
              borderRadius: 8,
              fontWeight: 600,
              cursor: "pointer",
              fontSize: 14,
            }}
          >
            Aanmaken
          </button>
        </div>
      </form>
    </section>
  );
}
