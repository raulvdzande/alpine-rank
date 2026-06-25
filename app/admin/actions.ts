"use server";

import { prisma } from "@/lib/prisma";
import { requireSuperAdmin } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { computeSnowScore } from "@/lib/snowScore";
import { generateSlug } from "@/lib/slug";

export interface RatingData {
  terrain: number;
  snow: number;
  lifts: number;
  apres: number;
  family: number;
  value: number;
  scenery: number;
}

export async function saveResortRating(resortId: string, data: RatingData) {
  const user = await requireSuperAdmin();
  if (!user) throw new Error("Geen toegang");

  const avg = (data.terrain + data.snow + data.lifts + data.apres + data.family + data.value + data.scenery) / 7;
  const overall = parseFloat((avg / 2).toFixed(2)); // 0-10 avg → 0-5 stars

  await prisma.review.upsert({
    where: { userId_resortId: { userId: user.id, resortId } },
    create: { userId: user.id, resortId, overall, ...data },
    update: { overall, ...data },
  });

  // Recalculate aggregate from ALL reviews (admin + users)
  const agg = await prisma.review.aggregate({
    where: { resortId },
    _avg: { overall: true },
    _count: true,
  });
  await prisma.resort.update({
    where: { id: resortId },
    data: {
      averageOverallRating: parseFloat((agg._avg.overall ?? 0).toFixed(3)),
      reviewCount: agg._count,
    },
  });

  revalidatePath("/admin");
  revalidatePath(`/admin/resort/${resortId}`);
  revalidatePath(`/resort/${resortId}`);
  revalidatePath("/resorts");
  revalidatePath("/");

  redirect("/admin");
}

export async function setSnowflakes(resortId: string, snowflakes: number, note: string, report: string) {
  const user = await requireSuperAdmin();
  if (!user) throw new Error("Geen toegang");

  if (![0, 1, 2, 3].includes(snowflakes)) throw new Error("Ongeldig aantal snowflakes");
  if (snowflakes > 0 && note.trim().length < 40) throw new Error("Citation te kort (min. 40 tekens)");
  if (snowflakes > 0 && report.trim().length < 300) throw new Error("Rapport te kort (min. 300 tekens)");

  // Progressie check: cannot skip levels when increasing
  const current = await prisma.resort.findUnique({ where: { id: resortId }, select: { snowflakes: true } });
  const currentLevel = current?.snowflakes ?? 0;
  if (snowflakes > currentLevel + 1) throw new Error(`Niet mogelijk om van ❄${"❄".repeat(currentLevel)} naar ❄${"❄".repeat(snowflakes)} te springen`);

  // Build history entry
  const historyEntry = JSON.stringify({ date: new Date().toISOString(), from: currentLevel, to: snowflakes, note: note.trim() });
  const existingHistory = (await prisma.resort.findUnique({ where: { id: resortId }, select: { snowflakeHistory: true } }))?.snowflakeHistory;
  let history: unknown[] = [];
  try { history = existingHistory ? JSON.parse(existingHistory) : []; } catch { history = []; }
  history.unshift(JSON.parse(historyEntry));

  await prisma.resort.update({
    where: { id: resortId },
    data: {
      snowflakes,
      snowflakeNote: note.trim() || null,
      snowflakeReport: report.trim() || null,
      snowflakeInspected: true,
      snowflakeAwardedAt: snowflakes > 0 ? new Date() : undefined,
      snowflakeHistory: JSON.stringify(history),
    },
  });

  revalidatePath("/admin");
  revalidatePath(`/admin/resort/${resortId}`);
  revalidatePath(`/resort/${resortId}`);
  revalidatePath("/resorts");
  revalidatePath("/snowflakes");
  revalidatePath("/");

  redirect(`/admin/resort/${resortId}`);
}

export async function clearResortRating(resortId: string) {
  const user = await requireSuperAdmin();
  if (!user) throw new Error("Geen toegang");

  await prisma.review.deleteMany({ where: { resortId, userId: user.id } });

  const agg = await prisma.review.aggregate({
    where: { resortId },
    _avg: { overall: true },
    _count: true,
  });
  await prisma.resort.update({
    where: { id: resortId },
    data: {
      averageOverallRating: parseFloat((agg._avg.overall ?? 0).toFixed(3)),
      reviewCount: agg._count,
    },
  });

  revalidatePath("/admin");
  revalidatePath(`/admin/resort/${resortId}`);
  revalidatePath(`/resort/${resortId}`);
  revalidatePath("/resorts");
  revalidatePath("/");

  redirect("/admin");
}

// ─────────────────────────────────────────────────────────────────────────────
// RESORT AANMAKEN / BEWERKEN / VERWIJDEREN
// ─────────────────────────────────────────────────────────────────────────────

export interface ResortFormData {
  name: string;
  Country: string;
  region: string;
  altitudeTop: string;
  altitudeBase: string;
  pisteKm: string;
  pisteBlue: string;
  pisteRed: string;
  pisteBlack: string;
  pisteGreen: string;
  lifts: string;
  dayPassPrice: string;
  lat: string;
  lon: string;
  snowpark: string;
  website: string;
  category: string;
}

function parseResortForm(data: ResortFormData) {
  return {
    name:         data.name.trim(),
    Country:      data.Country.trim(),
    region:       data.region.trim() || null,
    altitudeTop:  data.altitudeTop  ? parseInt(data.altitudeTop)  : null,
    altitudeBase: data.altitudeBase ? parseInt(data.altitudeBase) : null,
    pisteKm:      data.pisteKm      ? parseInt(data.pisteKm)      : null,
    pisteBlue:    data.pisteBlue    ? parseInt(data.pisteBlue)    : null,
    pisteRed:     data.pisteRed     ? parseInt(data.pisteRed)     : null,
    pisteBlack:   data.pisteBlack   ? parseInt(data.pisteBlack)   : null,
    pisteGreen:   data.pisteGreen   ? parseInt(data.pisteGreen)   : null,
    lifts:        data.lifts        ? parseInt(data.lifts)        : null,
    dayPassPrice: data.dayPassPrice ? parseInt(data.dayPassPrice) : null,
    lat:          data.lat          ? parseFloat(data.lat)        : null,
    lon:          data.lon          ? parseFloat(data.lon)        : null,
    snowpark:     data.snowpark === "true",
    website:      data.website.trim() || null,
    category:     data.category.trim() || null,
  };
}

export async function createResort(data: ResortFormData) {
  const user = await requireSuperAdmin();
  if (!user) throw new Error("Geen toegang");
  if (!data.name.trim()) throw new Error("Naam is verplicht");
  if (!data.Country.trim()) throw new Error("Land is verplicht");

  const fields = parseResortForm(data);

  // Bereken sneeuwscore direct na aanmaken
  let snowScore = 0;
  if (fields.lat !== null && fields.lon !== null) {
    const result = await computeSnowScore({
      altitudeTop:  fields.altitudeTop,
      altitudeBase: fields.altitudeBase,
      lat:          fields.lat,
      lon:          fields.lon,
    });
    snowScore = result.finalScore;
  } else if (fields.altitudeTop || fields.altitudeBase) {
    const result = await computeSnowScore({
      altitudeTop:  fields.altitudeTop,
      altitudeBase: fields.altitudeBase,
      lat:          null,
      lon:          null,
    });
    snowScore = result.finalScore;
  }

  const slug = generateSlug(fields.name, fields.Country);
  const resort = await prisma.resort.create({
    data: { ...fields, slug, snowScore, Continent: "Europe" },
  });

  revalidatePath("/admin");
  revalidatePath("/resorts");
  revalidatePath("/");

  redirect(`/admin/resort/${resort.id}`);
}

export async function updateResortData(resortId: string, data: ResortFormData) {
  const user = await requireSuperAdmin();
  if (!user) throw new Error("Geen toegang");
  if (!data.name.trim()) throw new Error("Naam is verplicht");

  const fields = parseResortForm(data);

  // Herbereken sneeuwscore na data-update
  const result = await computeSnowScore({
    altitudeTop:  fields.altitudeTop,
    altitudeBase: fields.altitudeBase,
    lat:          fields.lat,
    lon:          fields.lon,
  });

  await prisma.resort.update({
    where: { id: resortId },
    data:  { ...fields, snowScore: result.finalScore },
  });

  revalidatePath("/admin");
  revalidatePath(`/admin/resort/${resortId}`);
  revalidatePath(`/resort/${resortId}`);
  revalidatePath("/resorts");
  revalidatePath("/");

  redirect(`/admin/resort/${resortId}`);
}

export async function deleteResort(resortId: string) {
  const user = await requireSuperAdmin();
  if (!user) throw new Error("Geen toegang");

  await prisma.review.deleteMany({ where: { resortId } });
  await prisma.resort.delete({ where: { id: resortId } });

  revalidatePath("/admin");
  revalidatePath("/resorts");
  revalidatePath("/");

  redirect("/admin");
}

export async function deleteAllResorts() {
  const user = await requireSuperAdmin();
  if (!user) throw new Error("Geen toegang");

  await prisma.review.deleteMany({});
  await prisma.resort.deleteMany({});

  revalidatePath("/admin");
  revalidatePath("/resorts");
  revalidatePath("/");
}

export async function recalcSnowScore(resortId: string) {
  const user = await requireSuperAdmin();
  if (!user) throw new Error("Geen toegang");

  const resort = await prisma.resort.findUnique({
    where:  { id: resortId },
    select: { altitudeTop: true, altitudeBase: true, lat: true, lon: true },
  });
  if (!resort) throw new Error("Resort niet gevonden");

  const result = await computeSnowScore({
    altitudeTop:  resort.altitudeTop,
    altitudeBase: resort.altitudeBase,
    lat:          resort.lat,
    lon:          resort.lon,
  });

  await prisma.resort.update({
    where: { id: resortId },
    data:  { snowScore: result.finalScore },
  });

  revalidatePath(`/admin/resort/${resortId}`);
  revalidatePath(`/resort/${resortId}`);
  revalidatePath("/resorts");

  return result;
}
