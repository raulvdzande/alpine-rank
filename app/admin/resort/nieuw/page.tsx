import Link from "next/link";
import ResortDataForm from "@/app/admin/ResortDataForm";
import { createResort } from "@/app/admin/actions";

export const dynamic = "force-dynamic";

export default function NieuwResortPage() {
  return (
    <div style={{ maxWidth: 760 }}>
      <div style={{ marginBottom: 24 }}>
        <Link href="/admin" style={{ fontSize: 13, color: "#64748b", textDecoration: "none" }}>
          ← Back to overview
        </Link>
      </div>

      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontSize: 22, fontWeight: 700, color: "white", marginBottom: 4 }}>
          Add new resort
        </h1>
        <p style={{ fontSize: 13, color: "#64748b" }}>
          Fill in all known fields. The snow certainty score is calculated automatically after saving via Open-Meteo (10 years of historical data).
        </p>
      </div>

      <ResortDataForm
        submitLabel="Create resort + calculate score"
        onSubmit={createResort}
      />
    </div>
  );
}
