import { prisma } from "@/lib/prisma";
import { countryNL } from "@/lib/display";
import type { Metadata } from "next";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const resort = await prisma.resort.findUnique({ where: { slug } });

  if (!resort) {
    return {
      title: "Resort Not Found — PeakFlow",
      description: "This resort was not found on PeakFlow",
    };
  }

  const title = `${resort.name}, ${countryNL(resort.Country)} — Ski Reviews & Sneeuwscore | PeakFlow`;
  const description = `${resort.name}: ${resort.pisteKm}km pistes, sneeuwscore ${resort.snowScore?.toFixed(1) ?? "—"}/10, ${resort.lifts ?? "?"} liften. ${resort.reviewCount} beoordelingen van skiërs.`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "website",
      images: [{
        url: `/api/og?slug=${slug}`,
        width: 1200,
        height: 630,
        alt: resort.name,
      }],
    },
    alternates: {
      canonical: `/resorts/${slug}`,
    },
  };
}
