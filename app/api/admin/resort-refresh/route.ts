import { requireSuperAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import {
  fetchAllResorts,
  fetchResortStats,
  fetchSnowConditions,
  normalizeName,
  OVERPASS_DELAY_MS,
} from "@/lib/skiApi";
import { generateSlug } from "@/lib/slug";

export const maxDuration = 300;

export async function POST() {
  const user = await requireSuperAdmin();
  if (!user) return new Response("Unauthorized", { status: 401 });

  const encoder = new TextEncoder();

  const stream = new ReadableStream({
    async start(ctrl) {
      function send(data: object) {
        try {
          ctrl.enqueue(encoder.encode(JSON.stringify(data) + "\n"));
        } catch { /* closed */ }
      }

      let discovered = 0;
      let added = 0;
      let statsUpdated = 0;
      let conditionsUpdated = 0;
      let errors = 0;

      try {
        // ── Phase 1: global discovery ──────────────────────────────────────
        send({ phase: "discovery", message: "Alle skigebieden ophalen van OpenStreetMap..." });

        const osmResorts = await fetchAllResorts();
        send({ phase: "discovery", message: `${osmResorts.length} skigebieden gevonden in OSM` });

        // Load our DB resorts for matching
        const dbResorts = await prisma.resort.findMany({
          select: { id: true, name: true, Country: true, lat: true, lon: true, altitudeTop: true },
        });

        // Build normalized name → db resort map
        const dbMap = new Map<string, typeof dbResorts[0]>();
        for (const r of dbResorts) {
          dbMap.set(normalizeName(r.name), r);
        }

        // Match OSM resorts against DB, add new ones
        const toProcess: Array<{
          id: string;
          name: string;
          lat: number;
          lon: number;
          altitudeTop?: number | null;
          isNew: boolean;
        }> = [];

        for (const osm of osmResorts) {
          const key = normalizeName(osm.name);
          const existing = dbMap.get(key);

          if (existing) {
            // Update coordinates + website if we got them from OSM
            const update: Record<string, unknown> = {};
            if (existing.lat == null && osm.lat) update.lat = osm.lat;
            if (existing.lon == null && osm.lon) update.lon = osm.lon;
            if (osm.website) update.website = osm.website;
            if (osm.altitudeTop && !existing.altitudeTop) update.altitudeTop = osm.altitudeTop;

            if (Object.keys(update).length > 0) {
              await prisma.resort.update({ where: { id: existing.id }, data: update });
            }

            toProcess.push({
              id: existing.id,
              name: existing.name,
              lat: osm.lat ?? existing.lat!,
              lon: osm.lon ?? existing.lon!,
              altitudeTop: osm.altitudeTop ?? existing.altitudeTop,
              isNew: false,
            });
          } else {
            // Add new resort
            try {
              const slug = generateSlug(osm.name, osm.country ?? "Unknown");
              const created = await prisma.resort.create({
                data: {
                  slug,
                  name: osm.name,
                  Country: osm.country ?? "Unknown",
                  lat: osm.lat,
                  lon: osm.lon,
                  website: osm.website,
                  altitudeTop: osm.altitudeTop,
                  snowpark: false,
                  verified: false,
                },
                select: { id: true },
              });
              added++;
              discovered++;
              toProcess.push({
                id: created.id,
                name: osm.name,
                lat: osm.lat,
                lon: osm.lon,
                altitudeTop: osm.altitudeTop,
                isNew: true,
              });
            } catch {
              // duplicate name conflict — skip
            }
          }
        }

        send({ phase: "discovery_done", added, message: `${added} nieuwe resorts toegevoegd` });

        // ── Phase 2 + 3: per-resort stats + snow conditions ───────────────
        const total = toProcess.length;

        for (let i = 0; i < toProcess.length; i++) {
          const r = toProcess[i];
          const processed = i + 1;

          try {
            const update: Record<string, unknown> = {};

            // Overpass stats
            const stats = await fetchResortStats(r.lat, r.lon);
            if (stats) {
              if (stats.lifts > 0)      update.lifts      = stats.lifts;
              if (stats.pisteKm > 0)    update.pisteKm    = stats.pisteKm;
              if (stats.pisteGreen > 0) update.pisteGreen = stats.pisteGreen;
              if (stats.pisteBlue > 0)  update.pisteBlue  = stats.pisteBlue;
              if (stats.pisteRed > 0)   update.pisteRed   = stats.pisteRed;
              if (stats.pisteBlack > 0) update.pisteBlack = stats.pisteBlack;
              update.snowpark = stats.snowpark;
              if (stats.website)        update.website    = stats.website;
              if (stats.altitudeTop)    update.altitudeTop = stats.altitudeTop;
              statsUpdated++;
            }

            await new Promise((res) => setTimeout(res, OVERPASS_DELAY_MS));

            // Open-Meteo snow conditions
            const altTop = (update.altitudeTop as number | undefined) ?? r.altitudeTop;
            const conditions = await fetchSnowConditions(r.lat, r.lon, altTop);
            update.snowDepthBase       = conditions.snowDepthBase;
            update.snowDepthTop        = conditions.snowDepthTop;
            update.freshSnow24h        = conditions.freshSnow24h;
            update.tempBase            = conditions.tempBase;
            update.conditionsUpdatedAt = new Date();
            conditionsUpdated++;

            await prisma.resort.update({ where: { id: r.id }, data: update });
          } catch {
            errors++;
          }

          send({ processed, total, added, statsUpdated, conditionsUpdated, errors });
        }

        send({ phase: "done", total, added, statsUpdated, conditionsUpdated, errors });
      } catch (err) {
        send({ error: err instanceof Error ? err.message : "Onbekende fout" });
      } finally {
        ctrl.close();
      }
    },
  });

  return new Response(stream, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
