import { prisma } from "@/lib/prisma";
import { redirect, notFound } from "next/navigation";
import Link from "next/link";

export const metadata = { title: "Merk wijzigen — Admin" };

export default async function EditBrandPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const brand = await prisma.company.findUnique({
    where: { id },
  });

  if (!brand || brand.type !== "BRAND") {
    notFound();
  }

  async function updateBrand(formData: FormData) {
    "use server";

    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const country = formData.get("country") as string;
    const phone = formData.get("phone") as string;
    const website = formData.get("website") as string;

    if (!name || !email || !country) {
      redirect(`/admin/brands/${id}/edit?error=${encodeURIComponent("Verplichte velden niet ingevuld")}`);
    }

    await prisma.company.update({
      where: { id },
      data: {
        name,
        email,
        country,
        phone: phone || null,
        website: website || null,
      },
    });

    redirect("/admin/brands?success=" + encodeURIComponent("Merk bijgewerkt"));
  }

  return (
    <section style={{ padding: "40px 20px", maxWidth: 600, margin: "0 auto" }}>
      <Link href="/admin/brands" style={{ fontSize: 13, color: "var(--peak)", marginBottom: 20, display: "inline-block", textDecoration: "none" }}>
        ← Terug naar merken
      </Link>

      <h1 style={{ fontSize: 28, fontWeight: 800, marginBottom: 32 }}>Merk wijzigen</h1>

      <div style={{ background: "white", border: "1px solid var(--border)", borderRadius: 12, padding: 24, marginBottom: 24 }}>
        <h2 style={{ fontSize: 16, fontWeight: 700, marginBottom: 16 }}>Logo</h2>

        {brand.logo && (
          <div style={{ marginBottom: 16 }}>
            <img src={brand.logo} alt={brand.name} style={{ width: 120, height: 120, objectFit: "contain", borderRadius: 8, background: "var(--border)", padding: 8 }} />
          </div>
        )}

        <form action={`/api/admin/brand/logo?id=${id}`} method="POST" encType="multipart/form-data" style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <input
            type="file"
            name="logo"
            accept="image/*"
            required
            style={{ flex: 1 }}
          />
          <button
            type="submit"
            style={{
              padding: "10px 16px",
              background: "var(--peak)",
              color: "white",
              border: "none",
              borderRadius: 8,
              fontWeight: 600,
              cursor: "pointer",
              fontSize: 13,
            }}
          >
            Upload
          </button>
        </form>
      </div>

      <form action={updateBrand} style={{ background: "white", border: "1px solid var(--border)", borderRadius: 12, padding: 24 }}>
        <div style={{ marginBottom: 20 }}>
          <label style={{ display: "block", fontSize: 13, fontWeight: 600, marginBottom: 6 }}>
            Merknaam *
          </label>
          <input
            type="text"
            name="name"
            required
            defaultValue={brand.name}
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
            defaultValue={brand.email}
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
              defaultValue={brand.country}
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
              defaultValue={brand.phone || ""}
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
            defaultValue={brand.website || ""}
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
            Opslaan
          </button>
        </div>
      </form>
    </section>
  );
}
