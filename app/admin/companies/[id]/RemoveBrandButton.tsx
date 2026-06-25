"use client";

export default function RemoveBrandButton({
  brandId,
  companyId,
}: {
  brandId: string;
  companyId: string;
}) {
  const handleRemove = async () => {
    if (!confirm("Weet je zeker dat je dit merk wilt ontkoppelen?")) {
      return;
    }

    try {
      const res = await fetch("/api/admin/company/brand/remove", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ brandId, companyId }),
      });

      if (res.ok) {
        alert("Merk ontkoppeld");
        window.location.reload();
      } else {
        const data = await res.json();
        alert("Fout: " + (data.error || "Ontkoppelen mislukt"));
      }
    } catch (error) {
      alert("Fout bij ontkoppelen");
    }
  };

  return (
    <button
      onClick={handleRemove}
      title="Ontkoppelen"
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
