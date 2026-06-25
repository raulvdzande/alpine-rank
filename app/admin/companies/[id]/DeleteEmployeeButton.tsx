"use client";

export default function DeleteEmployeeButton({
  employeeId,
  companyId,
  isLastAdmin,
}: {
  employeeId: string;
  companyId: string;
  isLastAdmin: boolean;
}) {
  const handleDelete = async () => {
    if (!confirm("Weet je zeker dat je deze persoon wilt verwijderen?")) {
      return;
    }

    try {
      const res = await fetch("/api/admin/company/employee/delete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ employeeId, companyId }),
      });

      if (res.ok) {
        alert("Persoon verwijderd");
        window.location.reload();
      } else {
        const data = await res.json();
        alert("Fout: " + (data.error || "Verwijderen mislukt"));
      }
    } catch (error) {
      alert("Fout bij verwijderen");
    }
  };

  if (isLastAdmin) {
    return (
      <span title="Enige admin" style={{ fontSize: 16, opacity: 0.4 }}>
        🔒
      </span>
    );
  }

  return (
    <button
      onClick={handleDelete}
      title="Verwijderen"
      style={{
        fontSize: 16,
        background: "transparent",
        border: "none",
        cursor: "pointer",
        padding: "4px 8px",
        transition: "opacity 0.2s",
        opacity: 0.7,
        color: "#ef4444",
      }}
      onMouseEnter={(e) => e.currentTarget.style.opacity = "1"}
      onMouseLeave={(e) => e.currentTarget.style.opacity = "0.7"}
    >
      🗑️
    </button>
  );
}
