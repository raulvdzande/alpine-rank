"use client";

import { useState } from "react";

export default function AddEmployeeButton({ companyId }: { companyId: string }) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    role: "employee",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/admin/company/employee/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ companyId, ...formData }),
      });

      if (res.ok) {
        alert(`Medewerker toegevoegd! Setup email verzonden naar ${formData.email}`);
        setFormData({ name: "", email: "", role: "employee" });
        setOpen(false);
        window.location.reload();
      } else {
        const data = await res.json();
        alert("Fout: " + (data.error || "Medewerker toevoegen mislukt"));
      }
    } catch (error) {
      alert("Fout bij toevoegen medewerker");
    } finally {
      setLoading(false);
    }
  };

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        style={{
          background: "var(--peak)",
          color: "white",
          border: "none",
          padding: "8px 16px",
          borderRadius: 6,
          cursor: "pointer",
          fontWeight: 600,
          fontSize: 13,
        }}
      >
        + Lid toevoegen
      </button>
    );
  }

  return (
    <div style={{
      position: "fixed",
      inset: 0,
      background: "rgba(0,0,0,0.5)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      zIndex: 1000,
    }}>
      <div style={{
        background: "white",
        borderRadius: 12,
        padding: 24,
        maxWidth: 400,
        width: "100%",
        margin: 20,
      }}>
        <h2 style={{ marginBottom: 20, fontSize: 18, fontWeight: 700 }}>
          Teamlid toevoegen
        </h2>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: 16 }}>
            <label style={{ display: "block", fontSize: 13, fontWeight: 600, marginBottom: 6 }}>
              Naam *
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

          <div style={{ marginBottom: 20 }}>
            <label style={{ display: "block", fontSize: 13, fontWeight: 600, marginBottom: 6 }}>
              Rol *
            </label>
            <select
              name="role"
              value={formData.role}
              onChange={handleInputChange}
              style={{
                width: "100%",
                padding: "10px 14px",
                border: "1px solid var(--border)",
                borderRadius: 8,
                fontSize: 14,
                boxSizing: "border-box",
              }}
            >
              <option value="employee">Employee</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          <div style={{ display: "flex", gap: 12 }}>
            <button
              type="button"
              onClick={() => setOpen(false)}
              disabled={loading}
              style={{
                flex: 1,
                padding: "10px",
                border: "1px solid var(--border)",
                borderRadius: 8,
                background: "white",
                cursor: "pointer",
                fontSize: 14,
                fontWeight: 600,
              }}
            >
              Annuleren
            </button>
            <button
              type="submit"
              disabled={loading}
              style={{
                flex: 1,
                padding: "10px",
                background: "var(--peak)",
                color: "white",
                border: "none",
                borderRadius: 8,
                cursor: loading ? "not-allowed" : "pointer",
                fontSize: 14,
                fontWeight: 600,
                opacity: loading ? 0.6 : 1,
              }}
            >
              {loading ? "Bezig..." : "Toevoegen"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
