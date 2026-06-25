"use client";

export default function RemoveResortButton({
  resortId,
  companyId,
}: {
  resortId: string;
  companyId: string;
}) {
  const handleRemove = async () => {
    if (!confirm("Weet je zeker dat je dit skigebied wilt ontkoppelen?")) {
      return;
    }

    try {
      const res = await fetch("/api/admin/company/resort/remove", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ resortId, companyId }),
      });

      if (res.ok) {
        alert("Skigebied ontkoppeld");
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
