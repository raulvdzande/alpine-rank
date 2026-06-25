import Link from "next/link";
import ResortDataForm from "@/app/admin/ResortDataForm";
import { createResort } from "@/app/admin/actions";

export const dynamic = "force-dynamic";

export default function NieuwResortPage() {
  return (
    <div style={{ maxWidth: 760 }}>
      <div style={{ marginBottom: 24 }}>
        <Link href="/admin" style={{ fontSize: 13, color: "#64748b", textDecoration: "none" }}>
          ← Terug naar overzicht
        </Link>
      </div>

      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontSize: 22, fontWeight: 700, color: "white", marginBottom: 4 }}>
          Nieuw resort toevoegen
        </h1>
        <p style={{ fontSize: 13, color: "#64748b" }}>
          Vul alle bekende velden in. De sneeuwzekerheids-score wordt automatisch berekend na opslaan via Open-Meteo (10 jaar historische data).
        </p>
      </div>

      <ResortDataForm
        submitLabel="Resort aanmaken + score berekenen"
        onSubmit={createResort}
      />
    </div>
  );
}
