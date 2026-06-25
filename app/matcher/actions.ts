"use server";

import { prisma } from "@/lib/prisma";
import { countryNL } from "@/lib/display";

export interface MatchInput {
  level: string; // beginner | intermediate | advanced | expert | freeride
  budgetPerDay: number; // euros
  tripDays: number; // 1-14
  preference: string; // pistes | park | powder | apres | family
  groupType?: string; // solo | couple | friends | family
}

export interface MatchResult {
  id: string;
  rank: number;
  name: string;
  country: string;
  slug?: string;
  snowScore: number | null;
  pisteKm: number | null;
  dayPassPrice: number | null;
  totalScore: number;
  matchReason: string;
  breakdown: Record<string, number>;
}

export async function findMatches(input: MatchInput): Promise<MatchResult[]> {
  // Fetch all resorts with complete data
  const resorts = await prisma.resort.findMany({
    select: {
      id: true,
      name: true,
      Country: true,
      slug: true,
      snowScore: true,
      pisteKm: true,
      pisteBlue: true,
      pisteGreen: true,
      pisteRed: true,
      pisteBlack: true,
      dayPassPrice: true,
      snowpark: true,
      averageOverallRating: true,
    },
    where: {
      pisteKm: { not: null }, // Only resorts with full data
    },
  });

  if (resorts.length === 0) return [];

  // Score each resort
  const scored = resorts.map((r) => {
    const breakdown: Record<string, number> = {};
    let totalScore = 0;

    // ─── Level Match (25 pts) ───
    const totalPistes = (r.pisteKm ?? 0) || 1;
    let levelScore = 0;

    if (input.level === "beginner") {
      const beginnerPct = ((r.pisteGreen ?? 0) + (r.pisteBlue ?? 0)) / totalPistes;
      levelScore = Math.min(25, beginnerPct * 30);
    } else if (input.level === "intermediate") {
      const intermediatePct = ((r.pisteRed ?? 0) + (r.pisteBlue ?? 0)) / totalPistes;
      levelScore = Math.min(25, intermediatePct * 30);
    } else if (input.level === "advanced" || input.level === "expert") {
      const advancedPct = ((r.pisteBlack ?? 0) + (r.pisteRed ?? 0)) / totalPistes;
      levelScore = Math.min(25, advancedPct * 30);
    } else if (input.level === "freeride") {
      const freerideScore = ((r.snowScore ?? 0) * 2.5) + ((r.pisteBlack ?? 0) / totalPistes * 10);
      levelScore = Math.min(25, freerideScore);
    } else {
      levelScore = 15; // default
    }
    breakdown.levelMatch = Math.round(levelScore);
    totalScore += levelScore;

    // ─── Budget Match (20 pts) ───
    const totalBudget = (r.dayPassPrice ?? 0) * input.tripDays;
    const budgetAllocation = input.budgetPerDay * input.tripDays;
    let budgetScore = 0;

    if (r.dayPassPrice === null) {
      budgetScore = 10; // Neutral if price unknown
    } else if (r.dayPassPrice <= input.budgetPerDay) {
      budgetScore = 20; // Full score if within budget
    } else if (r.dayPassPrice <= input.budgetPerDay * 1.2) {
      budgetScore = 15; // Partial score if 20% over
    } else {
      budgetScore = 0; // No score if way over budget
    }
    breakdown.budgetMatch = Math.round(budgetScore);
    totalScore += budgetScore;

    // ─── Preference Match (30 pts) ───
    let preferenceScore = 0;

    if (input.preference === "pistes") {
      preferenceScore = Math.min(30, (r.pisteKm ?? 0) / 50); // Scale to 30pts for 1500km resort
    } else if (input.preference === "park") {
      preferenceScore = r.snowpark ? 30 : 0;
    } else if (input.preference === "powder") {
      preferenceScore = (r.snowScore ?? 0) * 3;
    } else if (input.preference === "apres") {
      preferenceScore = (r.averageOverallRating ?? 0) * 6;
    } else if (input.preference === "family") {
      preferenceScore = (r.averageOverallRating ?? 0) * 6; // Proxy via rating
    } else {
      preferenceScore = 15;
    }
    preferenceScore = Math.min(30, preferenceScore);
    breakdown.preferenceMatch = Math.round(preferenceScore);
    totalScore += preferenceScore;

    // ─── Snow Score Component (15 pts) ───
    const snowScore = Math.min(15, (r.snowScore ?? 0) * 1.5);
    breakdown.snowScore = Math.round(snowScore);
    totalScore += snowScore;

    // ─── Rating Bonus (10 pts) ───
    const ratingBonus = Math.min(10, (r.averageOverallRating ?? 0) * 2);
    breakdown.ratingBonus = Math.round(ratingBonus);
    totalScore += ratingBonus;

    // Build match reason from highest-scoring component
    let matchReason = "";
    const entries = Object.entries(breakdown).sort(([, a], [, b]) => b - a);
    const topComponent = entries[0]?.[0] ?? "";

    if (topComponent === "levelMatch") matchReason = "Perfect skill match";
    else if (topComponent === "budgetMatch") matchReason = "Great value";
    else if (topComponent === "preferenceMatch") matchReason = "Matches your preference";
    else if (topComponent === "snowScore") matchReason = "Excellent snow certainty";
    else if (topComponent === "ratingBonus") matchReason = "Highly rated by skiers";
    else matchReason = "Recommended";

    return {
      id: r.id,
      name: r.name,
      country: r.Country,
      slug: r.slug,
      snowScore: r.snowScore,
      pisteKm: r.pisteKm,
      dayPassPrice: r.dayPassPrice,
      totalScore: Math.round(totalScore),
      matchReason,
      breakdown,
    };
  });

  // Sort by score, take top 5, add rank
  const ranked = scored
    .sort((a, b) => b.totalScore - a.totalScore)
    .slice(0, 5)
    .map((r, i) => ({
      ...r,
      rank: i + 1,
    }));

  return ranked;
}
