"use client";

export default function ImpersonateButton({
  employeeId,
}: {
  employeeId: string;
}) {
  const handleImpersonate = async () => {
    try {
      const res = await fetch("/api/admin/company/impersonate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ employeeId }),
      });

      if (res.ok) {
        window.location.href = "/company/dashboard";
      } else {
        const data = await res.json();
        alert("Error: " + (data.error || "Impersonation failed"));
      }
    } catch (error) {
      alert("Error during impersonation");
    }
  };

  return (
    <button
      onClick={handleImpersonate}
      title="Impersonate"
      style={{
        fontSize: 16,
        background: "transparent",
        border: "none",
        cursor: "pointer",
        padding: "4px 8px",
        transition: "opacity 0.2s",
        opacity: 0.7,
      }}
      onMouseEnter={(e) => e.currentTarget.style.opacity = "1"}
      onMouseLeave={(e) => e.currentTarget.style.opacity = "0.7"}
    >
      👁️
    </button>
  );
}
