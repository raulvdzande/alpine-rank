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
    if (!confirm("Are you sure you want to remove this person?")) {
      return;
    }

    try {
      const res = await fetch("/api/admin/company/employee/delete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ employeeId, companyId }),
      });

      if (res.ok) {
        alert("Person removed");
        window.location.reload();
      } else {
        const data = await res.json();
        alert("Error: " + (data.error || "Failed to delete"));
      }
    } catch (error) {
      alert("Error deleting person");
    }
  };

  if (isLastAdmin) {
    return (
      <span title="Only admin" style={{ fontSize: 16, opacity: 0.4 }}>
        🔒
      </span>
    );
  }

  return (
    <button
      onClick={handleDelete}
      title="Delete"
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
