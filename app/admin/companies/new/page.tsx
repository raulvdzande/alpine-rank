"use client";

import { useState } from "react";
import Link from "next/link";

export default function NewCompanyPage() {
  const [type, setType] = useState<"RESORT" | "BRAND">("RESORT");
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    website: "",
    street: "",
    city: "",
    postalCode: "",
    country: "",
    taxId: "",
    adminName: "",
    adminEmail: "",
    adminPassword: "",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/admin/company/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, type }),
      });

      if (res.ok) {
        const data = await res.json();
        alert(`Bedrijf aangemaakt! Admin email: ${formData.adminEmail}`);
        window.location.href = `/admin/companies/${data.companyId}`;
      } else {
        const data = await res.json();
        alert("Fout: " + (data.error || "Bedrijf aanmaken mislukt"));
      }
    } catch (error) {
      alert("Fout bij bedrijf aanmaken");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section style={{ padding: "40px 20px" }}>
      <div style={{ maxWidth: 600, margin: "0 auto" }}>
        <Link href="/admin/companies" style={{ fontSize: 13, color: "var(--peak)", marginBottom: 20, display: "inline-block" }}>
          ← Terug naar bedrijven
        </Link>

        <h1 style={{ fontSize: 28, fontWeight: 800, marginBottom: 8 }}>
          Nieuw bedrijf aanmaken
        </h1>
        <p style={{ color: "var(--ink2)", marginBottom: 32 }}>
          Maak een bedrijfsaccount aan en voeg een admin toe
        </p>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: 20, paddingBottom: 20, borderBottom: "1px solid var(--border)" }}>
            <h3 style={{ marginBottom: 12 }}>Type</h3>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              <button
                type="button"
                onClick={() => setType("RESORT")}
                style={{
                  padding: 16,
                  border: type === "RESORT" ? "2px solid var(--peak)" : "1px solid var(--border)",
                  borderRadius: 8,
                  background: type === "RESORT" ? "var(--snow)" : "white",
                  cursor: "pointer",
                  fontWeight: 600,
                  fontSize: 14,
                }}
              >
                🏔 Skigebied
              </button>
              <button
                type="button"
                onClick={() => setType("BRAND")}
                style={{
                  padding: 16,
                  border: type === "BRAND" ? "2px solid var(--peak)" : "1px solid var(--border)",
                  borderRadius: 8,
                  background: type === "BRAND" ? "var(--snow)" : "white",
                  cursor: "pointer",
                  fontWeight: 600,
                  fontSize: 14,
                }}
              >
                🎿 Merk
              </button>
            </div>
          </div>

          <div style={{ marginBottom: 20, paddingBottom: 20, borderBottom: "1px solid var(--border)" }}>
            <h3 style={{ marginBottom: 12 }}>Bedrijfsgegevens</h3>

            <div style={{ marginBottom: 16 }}>
              <label style={{ display: "block", fontSize: 13, fontWeight: 600, marginBottom: 6 }}>
                Bedrijfsnaam *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
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

            <div style={{ marginBottom: 16 }}>
              <label style={{ display: "block", fontSize: 13, fontWeight: 600, marginBottom: 6 }}>
                Email *
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                required
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

            <div style={{ marginBottom: 16 }}>
              <label style={{ display: "block", fontSize: 13, fontWeight: 600, marginBottom: 6 }}>
                Telefoonnummer
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
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

            <div style={{ marginBottom: 16 }}>
              <label style={{ display: "block", fontSize: 13, fontWeight: 600, marginBottom: 6 }}>
                Website
              </label>
              <input
                type="url"
                name="website"
                value={formData.website}
                onChange={handleInputChange}
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

            <div style={{ marginBottom: 16 }}>
              <label style={{ display: "block", fontSize: 13, fontWeight: 600, marginBottom: 6 }}>
                BTW-nummer
              </label>
              <input
                type="text"
                name="taxId"
                value={formData.taxId}
                onChange={handleInputChange}
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

          <div style={{ marginBottom: 20, paddingBottom: 20, borderBottom: "1px solid var(--border)" }}>
            <h3 style={{ marginBottom: 12 }}>Adres</h3>

            <div style={{ marginBottom: 16 }}>
              <label style={{ display: "block", fontSize: 13, fontWeight: 600, marginBottom: 6 }}>
                Straat & huisnummer *
              </label>
              <input
                type="text"
                name="street"
                value={formData.street}
                onChange={handleInputChange}
                required
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

            <div style={{ marginBottom: 16 }}>
              <label style={{ display: "block", fontSize: 13, fontWeight: 600, marginBottom: 6 }}>
                Stad *
              </label>
              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleInputChange}
                required
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

            <div style={{ marginBottom: 16 }}>
              <label style={{ display: "block", fontSize: 13, fontWeight: 600, marginBottom: 6 }}>
                Postcode *
              </label>
              <input
                type="text"
                name="postalCode"
                value={formData.postalCode}
                onChange={handleInputChange}
                required
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

            <div style={{ marginBottom: 16 }}>
              <label style={{ display: "block", fontSize: 13, fontWeight: 600, marginBottom: 6 }}>
                Land *
              </label>
              <input
                type="text"
                name="country"
                value={formData.country}
                onChange={handleInputChange}
                required
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

          <div style={{ marginBottom: 20 }}>
            <h3 style={{ marginBottom: 12 }}>Eerste Admin Account</h3>

            <div style={{ marginBottom: 16 }}>
              <label style={{ display: "block", fontSize: 13, fontWeight: 600, marginBottom: 6 }}>
                Naam *
              </label>
              <input
                type="text"
                name="adminName"
                value={formData.adminName}
                onChange={handleInputChange}
                required
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

            <div style={{ marginBottom: 16 }}>
              <label style={{ display: "block", fontSize: 13, fontWeight: 600, marginBottom: 6 }}>
                Email *
              </label>
              <input
                type="email"
                name="adminEmail"
                value={formData.adminEmail}
                onChange={handleInputChange}
                required
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

            <div style={{ marginBottom: 16 }}>
              <label style={{ display: "block", fontSize: 13, fontWeight: 600, marginBottom: 6 }}>
                Wachtwoord *
              </label>
              <input
                type="password"
                name="adminPassword"
                value={formData.adminPassword}
                onChange={handleInputChange}
                required
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

          <button
            type="submit"
            disabled={loading}
            style={{
              width: "100%",
              padding: "14px",
              background: "var(--peak)",
              color: "white",
              border: "none",
              borderRadius: 8,
              fontWeight: 600,
              cursor: loading ? "not-allowed" : "pointer",
              fontSize: 14,
              opacity: loading ? 0.6 : 1,
            }}
          >
            {loading ? "Bezig..." : "Bedrijf aanmaken"}
          </button>
        </form>
      </div>
    </section>
  );
}
