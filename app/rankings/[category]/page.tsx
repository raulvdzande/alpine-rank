import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import type { Prisma } from "@prisma/client";
import {
  countryNL, countryFlag, toFiveStars, stars, fmtCount, gradientFor, emojiFor,
} from "@/lib/display";

const CATEGORY_MAP: Record<string, { label: string; desc: string; filter?: Prisma.ResortWhereInput; orderBy?: Prisma.ResortOrderByWithRelationInput }> = {
  alpen: {
    label: "🏔 Alps Rankings",
    desc: "Top ski resorts in the Alps",
    filter: { Country: { in: ["Austria", "Switzerland", "France", "Italy"] } },
    orderBy: { snowScore: "desc" },
  },
  beginners: {
    label: "🟢 Beginners Rankings",
    desc: "Perfect for beginner skiers",
    filter: { category: "Beginners" },
    orderBy: { averageOverallRating: "desc" },
  },
  familie: {
    label: "👨‍👩‍👧 Family Rankings",
    desc: "Ideal for families with children",
    filter: { category: "Familie" },
    orderBy: { averageOverallRating: "desc" },
  },
  expert: {
    label: "⚫ Expert Rankings",
    desc: "Challenging terrain for experts",
    filter: { category: "Expert" },
    orderBy: { pisteBlack: "desc" },
  },
  budget: {
    label: "💰 Budget Rankings",
    desc: "Best value for money",
    orderBy: { dayPassPrice: "asc" },
  },
  sneeuw: {
    label: "❄ Snow certainty Rankings",
    desc: "Resorts with the highest snow certainty",
    filter: { snowScore: { not: null } },
    orderBy: { snowScore: "desc" },
  },
};

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ category: string }> }) {
  const { category } = await params;
  const cat = CATEGORY_MAP[category];
  if (!cat) return {};

  return {
    title: `${cat.label.split(" ")[1] || cat.label} — PeakFlow Rankings`,
    description: cat.desc,
  };
}

export default async function CategoryRankingPage({ params }: { params: Promise<{ category: string }> }) {
  const { category } = await params;
  const catData = CATEGORY_MAP[category];

  if (!catData) notFound();

  const resorts = await prisma.resort.findMany({
    where: catData.filter ?? {},
    orderBy: catData.orderBy ?? { snowScore: "desc" },
    take: 50,
  });

  if (resorts.length === 0) notFound();

  return (
    <section className="section">
      <div className="container">
        <Link href="/rankings" style={{ fontSize: 13, color: "var(--peak)", marginBottom: 20, display: "inline-block" }}>
          ← Back to rankings
        </Link>

        <span className="label">Ranking</span>
        <h2 style={{ marginBottom: 12 }}>{catData.label}</h2>
        <p style={{ fontSize: 16, color: "var(--ink2)", marginBottom: 40 }}>{catData.desc}</p>

        <div className="resort-grid">
          {resorts.map((r, i) => (
            <Link
              href={r.slug ? `/resorts/${r.slug}` : `/resort/${r.id}`}
              className="resort-card"
              key={r.id}
              style={{ position: "relative" }}
            >
              {r.snowflakes > 0 && (
                <div style={{
                  position: "absolute",
                  top: 10,
                  right: 10,
                  background: "white",
                  borderRadius: "50%",
                  width: 40,
                  height: 40,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 18,
                  fontWeight: 700,
                  zIndex: 10,
                }}>
                  {"❄".repeat(r.snowflakes)}
                </div>
              )}
              <div className="resort-img" style={{ background: gradientFor(r.id) }}>
                <div className="resort-rank">#{i + 1} {r.category}</div>
                <div className="resort-snow-score">❄ {r.snowScore?.toFixed(1)}</div>
                <div className="resort-img-emoji">{emojiFor(r.id)}</div>
              </div>
              <div className="resort-body">
                <div className="resort-name">{r.name} {r.verified && <span className="badge-verified">✓</span>}</div>
                <div className="resort-location">{countryFlag(r.Country)} {countryNL(r.Country)}</div>
                <div className="resort-stats">
                  <div className="resort-stat"><span>{r.pisteKm}</span> km</div>
                  <div className="resort-stat"><span>{r.lifts}</span> lifts</div>
                  <div className="resort-stat"><span>€{r.dayPassPrice}</span>/day</div>
                </div>
                {(r.averageOverallRating ?? 0) > 0 && (
                  <div className="resort-rating">
                    <span className="stars">{stars(toFiveStars(r.averageOverallRating))}</span>
                    <span className="count">{toFiveStars(r.averageOverallRating).toFixed(1)} ({fmtCount(r.reviewCount)})</span>
                  </div>
                )}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
