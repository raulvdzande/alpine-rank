"use client";

export default function RemoveResortButton({
  resortId,
  companyId,
}: {
  resortId: string;
  companyId: string;
}) {
  const handleRemove = async () => {
    if (!confirm("Are you sure you want to unlink this ski resort?")) {
      return;
    }

    try {
      const res = await fetch("/api/admin/company/resort/remove", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ resortId, companyId }),
      });

      if (res.ok) {
        alert("Ski resort unlinked");
        window.location.reload();
      } else {
        const data = await res.json();
        alert("Error: " + (data.error || "Failed to unlink"));
      }
    } catch (error) {
      alert("Error unlinking resort");
    }
  };

  return (
    <button
      onClick={handleRemove}
      title="Unlink"
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
      ✕
    </button>
  );
}
