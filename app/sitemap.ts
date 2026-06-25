import { prisma } from "@/lib/prisma";
import type { MetadataRoute } from "next";

export const dynamic = "force-dynamic";

const ORIGIN = process.env.NEXT_PUBLIC_SITE_URL || "https://peakflow.io";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const resorts = await prisma.resort.findMany({
    select: { slug: true, updatedAt: true },
  });

  const rankings = [
    "alpen",
    "beginners",
    "familie",
    "expert",
    "budget",
    "sneeuw",
  ];

  const staticPages = [
    { url: "", lastMod: new Date(), priority: 1.0 },
    { url: "/resorts", lastMod: new Date(), priority: 0.9 },
    { url: "/rankings", lastMod: new Date(), priority: 0.8 },
    { url: "/matcher", lastMod: new Date(), priority: 0.8 },
    { url: "/about", lastMod: new Date(), priority: 0.7 },
    { url: "/snow-score", lastMod: new Date(), priority: 0.7 },
    { url: "/pricing", lastMod: new Date(), priority: 0.8 },
    { url: "/privacy", lastMod: new Date(), priority: 0.5 },
    { url: "/terms", lastMod: new Date(), priority: 0.5 },
  ];

  const resortEntries = resorts.map((r) => ({
    url: `/resorts/${r.slug}`,
    lastMod: r.updatedAt,
    priority: 0.7 as const,
  }));

  const rankingEntries = rankings.map((r) => ({
    url: `/rankings/${r}`,
    lastMod: new Date(),
    priority: 0.8 as const,
  }));

  return [
    ...staticPages,
    ...rankingEntries,
    ...resortEntries,
  ].map((entry) => ({
    url: `${ORIGIN}${entry.url}`,
    lastModified: entry.lastMod,
    priority: entry.priority,
  }));
}
