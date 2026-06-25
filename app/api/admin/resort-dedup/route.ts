import { requireSuperAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { normalizeName } from "@/lib/skiApi";

export const maxDuration = 60;

// Haversine distance in km
function distKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

// Resort score: higher = keep this one
function score(r: {
  snowflakes: number;
  reviewCount: number;
  createdAt: Date;
  lat: number | null;
  lon: number | null;
  pisteKm: number | null;
  lifts: number | null;
  altitudeTop: number | null;
}): number {
  let s = 0;
  if (r.snowflakes > 0) s += 100000;
  if (r.reviewCount > 0) s += r.reviewCount * 1000;
  if (r.lat != null) s += 20;
  if (r.lon != null) s += 20;
  if (r.pisteKm != null) s += 10;
  if (r.lifts != null) s += 10;
  if (r.altitudeTop != null) s += 10;
  // Older entries preferred as tiebreaker
  s -= r.createdAt.getTime() / 1e12;
  return s;
}

export async function POST() {
  const user = await requireSuperAdmin();
  if (!user) return new Response("Unauthorized", { status: 401 });

  const all = await prisma.resort.findMany({
    select: {
      id: true,
      name: true,
      snowflakes: true,
      reviewCount: true,
      createdAt: true,
      lat: true,
      lon: true,
      pisteKm: true,
      lifts: true,
      altitudeTop: true,
    },
  });

  // Union-Find to group duplicates
  const parent = new Map<string, string>();
  function find(id: string): string {
    if (parent.get(id) !== id) parent.set(id, find(parent.get(id)!));
    return parent.get(id)!;
  }
  function union(a: string, b: string) {
    parent.set(find(a), find(b));
  }
  for (const r of all) parent.set(r.id, r.id);

  // 1. Same normalized name → duplicate
  const byName = new Map<string, string>();
  for (const r of all) {
    const key = normalizeName(r.name);
    if (byName.has(key)) union(r.id, byName.get(key)!);
    else byName.set(key, r.id);
  }

  // 2. Coordinates within 2 km → duplicate
  // Sort by lat for a sweep-line optimisation (only compare if |Δlat| < 0.02°)
  const withCoords = all.filter((r) => r.lat != null && r.lon != null);
  withCoords.sort((a, b) => a.lat! - b.lat!);

  for (let i = 0; i < withCoords.length; i++) {
    const a = withCoords[i];
    for (let j = i + 1; j < withCoords.length; j++) {
      const b = withCoords[j];
      if (b.lat! - a.lat! > 0.05) break; // > ~5.5 km apart in lat → stop
      if (distKm(a.lat!, a.lon!, b.lat!, b.lon!) <= 2) {
        union(a.id, b.id);
      }
    }
  }

  // Build groups
  const groups = new Map<string, typeof all>();
  for (const r of all) {
    const root = find(r.id);
    if (!groups.has(root)) groups.set(root, []);
    groups.get(root)!.push(r);
  }

  const toDelete: string[] = [];
  for (const group of groups.values()) {
    if (group.length <= 1) continue;
    group.sort((a, b) => score(b) - score(a));
    for (const dup of group.slice(1)) toDelete.push(dup.id);
  }

  if (toDelete.length === 0) {
    return Response.json({ deleted: 0, message: "Geen duplicaten gevonden" });
  }

  let deleted = 0;
  for (let i = 0; i < toDelete.length; i += 100) {
    const batch = toDelete.slice(i, i + 100);
    await prisma.resort.deleteMany({ where: { id: { in: batch } } });
    deleted += batch.length;
  }

  return Response.json({ deleted, message: `${deleted} duplicaten verwijderd` });
}
