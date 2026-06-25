import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requireSuperAdmin } from "@/lib/auth";
import ResortDataForm from "@/app/admin/ResortDataForm";
import { updateResortData, deleteResort } from "@/app/admin/actions";
import type { ResortFormData } from "@/app/admin/actions";
import { computeSnowScore } from "@/lib/snowScore";

export const dynamic = "force-dynamic";

export default async function EditResortDataPage({ params }: { params: Promise<{ id: string }> }) {
  const user = await requireSuperAdmin();
  if (!user) redirect("/login");

  const { id } = await params;
  const resort = await prisma.resort.findUnique({ where: { id } });
  if (!resort) notFound();

  const initial: Partial<ResortFormData> = {
    name:         resort.name,
    Country:      resort.Country,
    region:       resort.region       ?? "",
    altitudeTop:  resort.altitudeTop  != null ? String(resort.altitudeTop)  : "",
    altitudeBase: resort.altitudeBase != null ? String(resort.altitudeBase) : "",
    pisteKm:      resort.pisteKm      != null ? String(resort.pisteKm)      : "",
    pisteBlue:    resort.pisteBlue    != null ? String(resort.pisteBlue)    : "",
    pisteRed:     resort.pisteRed     != null ? String(resort.pisteRed)     : "",
    pisteBlack:   resort.pisteBlack   != null ? String(resort.pisteBlack)   : "",
    pisteGreen:   resort.pisteGreen   != null ? String(resort.pisteGreen)   : "",
    lifts:        resort.lifts        != null ? String(resort.lifts)        : "",
    dayPassPrice: resort.dayPassPrice != null ? String(resort.dayPassPrice) : "",
    lat:          resort.lat          != null ? String(resort.lat)          : "",
    lon:          resort.lon          != null ? String(resort.lon)          : "",
    snowpark:     resort.snowpark ? "true" : "false",
    website:      resort.website  ?? "",
    category:     resort.category ?? "",
  };

  // Compute breakdown for display
  const breakdown = await computeSnowScore({
    altitudeTop:  resort.altitudeTop,
    altitudeBase: resort.altitudeBase,
    lat:          resort.lat,
    lon:          resort.lon,
  });

  const scoreColor = (s: number) => s >= 8 ? "#34d399" : s >= 6 ? "#60a5fa" : s >= 4 ? "#f59e0b" : "#f87171";

  return (
    <div style={{ maxWidth: 760 }}>
      <div style={{ marginBottom: 24, display: "flex", gap: 16, alignItems: "center" }}>
        <Link href={`/admin/resort/${id}`} style={{ fontSize: 13, color: "#64748b", textDecoration: "none" }}>
          ← Terug naar beoordelen
        </Link>
        <Link href="/admin" style={{ fontSize: 13, color: "#475569", textDecoration: "none" }}>
          Admin overzicht
        </Link>
      </div>

      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 22, fontWeight: 700, color: "white", marginBottom: 4 }}>
          {resort.name} — Data bewerken
        </h1>
        <p style={{ fontSize: 13, color: "#64748b" }}>
          Pas de fysieke gegevens aan. De sneeuwscore wordt direct herberekend.
        </p>
      </div>

      {/* Huidige sneeuwscore breakdown */}
      <div style={{ background: "#1e293b", border: "1px solid #334155", borderRadius: 12, padding: "16px 20px", marginBottom: 24 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: "#94a3b8", marginBottom: 12, textTransform: "uppercase", letterSpacing: "0.4px" }}>
          Huidige sneeuwzekerheids-score
        </div>
        <div style={{ display: "flex", gap: 24, alignItems: "center", flexWrap: "wrap" }}>
          <div style={{ fontSize: 40, fontWeight: 800, color: scoreColor(breakdown.finalScore) }}>
            {breakdown.finalScore.toFixed(1)}
            <span style={{ fontSize: 18, color: "#475569" }}>/10</span>
          </div>
          <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
            {[
              { l: "Hoogte (40%)",       v: breakdown.altitudeScore },
              { l: "Historisch (35%)",   v: breakdown.historicalScore },
              { l: "Breedtegraad (15%)", v: breakdown.latitudeScore },
              { l: "Bereik (10%)",       v: breakdown.rangeScore },
            ].map(({ l, v }) => (
              <div key={l} style={{ textAlign: "center" }}>
                <div style={{ fontSize: 18, fontWeight: 700, color: v !== null ? scoreColor(v) : "#475569" }}>
                  {v !== null ? v.toFixed(1) : "—"}
                </div>
                <div style={{ fontSize: 11, color: "#64748b", marginTop: 2 }}>{l}</div>
              </div>
            ))}
          </div>
        </div>
        {breakdown.factors.length > 0 && (
          <div style={{ marginTop: 12, display: "flex", gap: 8, flexWrap: "wrap" }}>
            {breakdown.factors.map((f, i) => (
              <span key={i} style={{ fontSize: 11, color: "#93c5fd", background: "rgba(96,165,250,.1)", border: "1px solid rgba(96,165,250,.2)", borderRadius: 999, padding: "3px 10px" }}>
                {f}
              </span>
            ))}
          </div>
        )}
      </div>

      <ResortDataForm
        initial={initial}
        submitLabel="Opslaan + sneeuwscore herberekenen"
        onSubmit={(data: ResortFormData) => updateResortData(id, data)}
        onDelete={() => deleteResort(id)}
      />
    </div>
  );
}
