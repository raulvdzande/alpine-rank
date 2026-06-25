import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requireSuperAdmin } from "@/lib/auth";
import { redirect } from "next/navigation";
import { countryFlag, countryNL, emojiFor, toFiveStars } from "@/lib/display";
import RatingForm from "../../RatingForm";
import SnowflakeForm from "../../SnowflakeForm";

export const dynamic = "force-dynamic";

export default async function AdminResortPage({ params }: { params: Promise<{ id: string }> }) {
  const user = await requireSuperAdmin();
  if (!user) redirect("/login");

  const { id } = await params;
  const [resort, existing, totalResorts, sfCounts] = await Promise.all([
    prisma.resort.findUnique({ where: { id } }),
    prisma.review.findUnique({ where: { userId_resortId: { userId: user.id, resortId: id } } }),
    prisma.resort.count(),
    prisma.resort.groupBy({ by: ["snowflakes"], _count: { id: true }, where: { snowflakes: { gt: 0 } } }),
  ]);
  if (!resort) notFound();

  const hasRating = (resort.averageOverallRating ?? 0) > 0;

  const worldCounts = {
    sf1: sfCounts.find(x => x.snowflakes === 1)?._count.id ?? 0,
    sf2: sfCounts.find(x => x.snowflakes === 2)?._count.id ?? 0,
    sf3: sfCounts.find(x => x.snowflakes === 3)?._count.id ?? 0,
    total: totalResorts,
  };

  return (
    <>
      {/* Breadcrumb */}
      <div style={{ marginBottom: 24, display: "flex", alignItems: "center", gap: 16 }}>
        <Link href="/admin" style={{ fontSize: 13, color: "#64748b", textDecoration: "none" }}>
          ← Terug naar overzicht
        </Link>
        <Link
          href={`/admin/resort/${id}/data`}
          style={{ fontSize: 13, color: "#93c5fd", textDecoration: "none", background: "rgba(96,165,250,.1)", border: "1px solid rgba(96,165,250,.2)", borderRadius: 6, padding: "5px 12px" }}
        >
          ✏️ Data bewerken
        </Link>
      </div>

      {/* Resort header */}
      <div style={{
        background: "linear-gradient(135deg, #1a3a5c, #0f2a45)",
        borderRadius: 14,
        padding: "24px 28px",
        marginBottom: 28,
        display: "flex",
        alignItems: "center",
        gap: 20,
      }}>
        <div style={{ fontSize: 60, lineHeight: 1 }}>{emojiFor(resort.id)}</div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 11, color: "rgba(255,255,255,.4)", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: 6 }}>
            {resort.category ?? "Resort"} · {countryFlag(resort.Country)} {countryNL(resort.Country)}
          </div>
          <h1 style={{ fontSize: 26, fontWeight: 800, color: "white", margin: 0, marginBottom: 8 }}>{resort.name}</h1>
          <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
            {[
              { v: resort.pisteKm ? `${resort.pisteKm} km` : "—", l: "piste" },
              { v: resort.lifts ? `${resort.lifts}` : "—", l: "liften" },
              { v: resort.snowScore ? `${resort.snowScore.toFixed(1)}/10` : "—", l: "sneeuwscore" },
              { v: resort.dayPassPrice ? `€${resort.dayPassPrice}` : "—", l: "dagkaart" },
            ].map(s => (
              <div key={s.l} style={{ fontSize: 13, color: "rgba(255,255,255,.6)" }}>
                <span style={{ fontWeight: 600, color: "white" }}>{s.v}</span> {s.l}
              </div>
            ))}
          </div>
        </div>
        <div style={{ textAlign: "right" }}>
          {hasRating ? (
            <div>
              <div style={{ fontSize: 11, color: "rgba(255,255,255,.4)", marginBottom: 4 }}>Huidige beoordeling</div>
              <div style={{ fontSize: 28, fontWeight: 700, color: "#fbbf24" }}>
                ★ {toFiveStars(resort.averageOverallRating).toFixed(2)}
              </div>
              <div style={{ fontSize: 11, color: "#34d399", marginTop: 4 }}>✓ Beoordeeld</div>
            </div>
          ) : (
            <div>
              <div style={{ fontSize: 11, color: "#f87171", marginBottom: 4 }}>○ Nog geen beoordeling</div>
            </div>
          )}
        </div>
      </div>

      {/* Rating form */}
      <div style={{ maxWidth: 700 }}>
        <div style={{ marginBottom: 20 }}>
          <h2 style={{ fontSize: 16, fontWeight: 700, color: "white", margin: 0, marginBottom: 4 }}>
            {hasRating ? "Beoordeling bewerken" : "Beoordeling instellen"}
          </h2>
          <p style={{ fontSize: 13, color: "#64748b", margin: 0 }}>
            Scoor elk aspect van dit skigebied van 0 tot 10. De totale PeakFlow-score wordt automatisch berekend.
          </p>
        </div>

        <RatingForm
          resortId={id}
          initial={existing ? {
            terrain: existing.terrain,
            snow: existing.snow,
            lifts: existing.lifts,
            apres: existing.apres,
            family: existing.family,
            value: existing.value,
            scenery: existing.scenery,
          } : null}
        />
      </div>

      {/* Snowflakes sectie */}
      <div style={{ maxWidth: 700, marginTop: 40, paddingTop: 32, borderTop: "1px solid #334155" }}>
        <SnowflakeForm
          resortId={id}
          resortName={resort.name}
          currentSnowflakes={resort.snowflakes}
          currentNote={resort.snowflakeNote}
          currentReport={resort.snowflakeReport}
          worldCounts={worldCounts}
        />
      </div>
    </>
  );
}
