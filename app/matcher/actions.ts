"use server";

import { prisma } from "@/lib/prisma";
import type { Prisma } from "@prisma/client";
import { countryNL } from "@/lib/display";

export interface MatchInput {
  level: string; // beginner | gevorderd | expert | freeride
  budget: string; // low | mid | high | any
  region: string; // all | at | fr | ch | it | sc
  priority: string; // snow | km | value | apres | family
}

export interface MatchResult {
  id: string;
  rank: number;
  name: string;
  tag: string;
  score: number;
}

const REGION_COUNTRIES: Record<string, string[]> = {
  at: ["Austria"],
  fr: ["France"],
  ch: ["Switzerland"],
  it: ["Italy"],
  sc: ["Norway", "Sweden", "Finland"],
};

const BUDGET_RANGE: Record<string, { lte?: number; gte?: number }> = {
  low: { lte: 40 },
  mid: { gte: 40, lte: 65 },
  high: { gte: 65, lte: 90 },
  any: {},
};

const PRIORITY_TAG: Record<string, string> = {
  snow: "Sneeuw zeker",
  km: "Grote pistekaart",
  value: "Prijs-kwaliteit",
  apres: "Apres-ski",
  family: "Familie-vriendelijk",
};

export async function findMatches(input: MatchInput): Promise<MatchResult[]> {
  const where: Prisma.ResortWhereInput = {};

  const countries = REGION_COUNTRIES[input.region];
  if (countries) where.Country = { in: countries };

  const range = BUDGET_RANGE[input.budget] ?? {};
  if (range.lte || range.gte) where.dayPassPrice = range;

  if (input.priority === "family") where.category = { in: ["Familie", "Beginners"] };

  const orderBy: Prisma.ResortOrderByWithRelationInput =
    input.priority === "km" ? { pisteKm: "desc" } :
    input.priority === "value" ? { dayPassPrice: "asc" } :
    input.priority === "family" ? { averageOverallRating: "desc" } :
    { snowScore: "desc" };

  let resorts = await prisma.resort.findMany({ where, orderBy, take: 5 });

  // Fallback: relax filters if too few matches
  if (resorts.length < 5) {
    const relaxed: Prisma.ResortWhereInput = {};
    if (countries) relaxed.Country = { in: countries };
    resorts = await prisma.resort.findMany({ where: relaxed, orderBy, take: 5 });
  }

  const tag = PRIORITY_TAG[input.priority] ?? "Aanbevolen";

  return resorts.map((r, i) => ({
    id: r.id,
    rank: i + 1,
    name: `${r.name}, ${countryNL(r.Country)}`,
    tag: i === 0 ? tag : (r.category ?? tag),
    score: Math.max(70, 96 - i * 3 - (r.snowScore ? Math.round((9.8 - r.snowScore)) : 0)),
  }));
}
