// All free APIs, no API keys required:
// 1. Overpass (OpenStreetMap) — global resort discovery + per-resort lift/piste stats
// 2. Open-Meteo — live snow depth, fresh snowfall, temperature

// ─── Types ────────────────────────────────────────────────────────────────

export interface OsmResort {
  name: string;
  lat: number;
  lon: number;
  country?: string;
  website?: string;
  altitudeTop?: number;
}

export interface ResortStats {
  lifts: number;
  pisteKm: number;
  pisteGreen: number;
  pisteBlue: number;
  pisteRed: number;
  pisteBlack: number;
  snowpark: boolean;
  website?: string;
  altitudeTop?: number;
}

export interface SnowConditions {
  snowDepthBase: number | null;
  snowDepthTop: number | null;
  freshSnow24h: number | null;
  tempBase: number | null;
}

// 2 sec between per-resort Overpass queries (ToS: max 2 req/sec)
export const OVERPASS_DELAY_MS = 2000;

// ─── Country code → full name ─────────────────────────────────────────────

const COUNTRY_CODES: Record<string, string> = {
  AD: "Andorra", AR: "Argentina", AT: "Austria", AU: "Australia",
  BA: "Bosnia and Herzegovina", BG: "Bulgaria", BY: "Belarus",
  CA: "Canada", CH: "Switzerland", CL: "Chile", CN: "China",
  CZ: "Czech Republic", DE: "Germany", ES: "Spain", FI: "Finland",
  FR: "France", GB: "United Kingdom", GE: "Georgia", GR: "Greece",
  HR: "Croatia", HU: "Hungary", IN: "India", IR: "Iran",
  IS: "Iceland", IT: "Italy", JP: "Japan", KG: "Kyrgyzstan",
  KZ: "Kazakhstan", LI: "Liechtenstein", LU: "Luxembourg",
  MK: "North Macedonia", MN: "Mongolia", MX: "Mexico",
  NO: "Norway", NZ: "New Zealand", PK: "Pakistan", PL: "Poland",
  PT: "Portugal", RO: "Romania", RS: "Serbia", RU: "Russia",
  SE: "Sweden", SI: "Slovenia", SK: "Slovakia", TR: "Turkey",
  UA: "Ukraine", US: "United States", UZ: "Uzbekistan",
};

function isoToCountry(code: string): string | undefined {
  return COUNTRY_CODES[code.toUpperCase()];
}

// ─── Country from coordinates (bounding box lookup, sorted small→large) ──

// [minLat, minLon, maxLat, maxLon]
type Bbox = [number, number, number, number];
const COUNTRY_BBOXES: Array<{ name: string; bbox: Bbox }> = [
  { name: "Andorra",              bbox: [42.43, 1.41, 42.66, 1.79] },
  { name: "Liechtenstein",        bbox: [47.05, 9.47, 47.27, 9.64] },
  { name: "Monaco",               bbox: [43.72, 7.38, 43.75, 7.44] },
  { name: "Switzerland",          bbox: [45.82, 5.96, 47.81, 10.49] },
  { name: "Slovenia",             bbox: [45.42, 13.38, 46.88, 16.61] },
  { name: "Austria",              bbox: [46.37, 9.53, 49.02, 17.16] },
  { name: "Slovakia",             bbox: [47.73, 16.83, 49.61, 22.56] },
  { name: "Czech Republic",       bbox: [48.55, 12.09, 51.06, 18.86] },
  { name: "Hungary",              bbox: [45.74, 16.11, 48.58, 22.90] },
  { name: "Croatia",              bbox: [42.39, 13.49, 46.55, 19.43] },
  { name: "Bosnia and Herzegovina", bbox: [42.56, 15.73, 45.28, 19.62] },
  { name: "Serbia",               bbox: [42.23, 18.82, 46.19, 22.99] },
  { name: "North Macedonia",      bbox: [40.85, 20.46, 42.37, 22.95] },
  { name: "Bulgaria",             bbox: [41.23, 22.36, 44.23, 28.61] },
  { name: "Romania",              bbox: [43.62, 20.26, 48.27, 29.76] },
  { name: "Albania",              bbox: [39.64, 19.27, 42.66, 21.07] },
  { name: "Greece",               bbox: [34.80, 19.37, 41.75, 26.60] },
  { name: "Iceland",              bbox: [63.40, -24.55, 66.56, -13.50] },
  { name: "Luxembourg",           bbox: [49.44, 5.73, 50.18, 6.53] },
  { name: "Netherlands",          bbox: [50.75, 3.36, 53.55, 7.23] },
  { name: "Belgium",              bbox: [49.50, 2.54, 51.51, 6.41] },
  { name: "Portugal",             bbox: [36.96, -9.50, 42.15, -6.19] },
  { name: "Germany",              bbox: [47.27, 5.87, 55.06, 15.04] },
  { name: "Italy",                bbox: [35.49, 6.62, 47.09, 18.52] },
  { name: "France",               bbox: [41.36, -5.14, 51.09, 9.56] },
  { name: "Spain",                bbox: [27.64, -18.16, 43.79, 4.33] },
  { name: "Poland",               bbox: [49.00, 14.12, 54.84, 24.15] },
  { name: "Ukraine",              bbox: [44.39, 22.14, 52.38, 40.22] },
  { name: "Turkey",               bbox: [35.82, 25.98, 42.11, 44.82] },
  { name: "Georgia",              bbox: [41.05, 40.00, 43.59, 46.72] },
  { name: "Norway",               bbox: [57.97, 4.48, 71.19, 31.29] },
  { name: "Sweden",               bbox: [55.34, 11.12, 69.06, 24.16] },
  { name: "Finland",              bbox: [59.81, 19.09, 70.09, 31.59] },
  { name: "Morocco",              bbox: [27.67, -13.17, 35.92, -0.99] },
  { name: "Lebanon",              bbox: [33.05, 35.12, 34.69, 36.62] },
  { name: "Japan",                bbox: [24.25, 122.94, 45.55, 145.82] },
  { name: "China",                bbox: [18.16, 73.50, 53.56, 134.77] },
  { name: "India",                bbox: [8.07, 68.11, 37.10, 97.42] },
  { name: "Pakistan",             bbox: [23.69, 60.87, 37.10, 77.83] },
  { name: "Kazakhstan",           bbox: [40.57, 50.27, 55.44, 87.36] },
  { name: "Kyrgyzstan",           bbox: [39.19, 69.28, 43.24, 80.29] },
  { name: "Uzbekistan",           bbox: [37.19, 55.99, 45.59, 73.15] },
  { name: "Iran",                 bbox: [25.06, 44.02, 39.78, 63.33] },
  { name: "Russia",               bbox: [41.19, 19.64, 81.86, 180.00] },
  { name: "New Zealand",          bbox: [-47.29, 166.43, -34.40, 178.57] },
  { name: "Australia",            bbox: [-43.64, 113.34, -10.05, 153.64] },
  { name: "Chile",                bbox: [-55.90, -75.64, -17.50, -66.40] },
  { name: "Argentina",            bbox: [-55.06, -73.57, -21.78, -53.64] },
  { name: "Mexico",               bbox: [14.53, -117.13, 32.72, -86.71] },
  { name: "Canada",               bbox: [41.68, -141.00, 83.11, -52.62] },
  { name: "United States",        bbox: [18.91, -179.15, 71.39, -66.95] },
];

export function countryFromCoords(lat: number, lon: number): string | undefined {
  for (const c of COUNTRY_BBOXES) {
    const [minLat, minLon, maxLat, maxLon] = c.bbox;
    if (lat >= minLat && lat <= maxLat && lon >= minLon && lon <= maxLon) {
      return c.name;
    }
  }
  return undefined;
}

// ─── Name normalization for fuzzy matching ────────────────────────────────

export function normalizeName(s: string): string {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")  // remove diacritics
    .replace(/[^a-z0-9 ]/g, " ")      // keep only alphanumeric + space
    .replace(/\s+/g, " ")
    .trim();
}

// ─── 1. Global Overpass discovery ─────────────────────────────────────────

type OverpassNode = {
  type: "node";
  id: number;
  lat: number;
  lon: number;
  tags?: Record<string, string>;
};
type OverpassRelation = {
  type: "relation";
  id: number;
  center?: { lat: number; lon: number };
  tags?: Record<string, string>;
};
type OverpassElement = OverpassNode | OverpassRelation;

const OVERPASS_SERVERS = [
  "https://overpass-api.de/api/interpreter",
  "https://overpass.kumi.systems/api/interpreter",
  "https://maps.mail.ru/osm/tools/overpass/api/interpreter",
];

async function overpassFetch(query: string, timeoutMs: number): Promise<Response> {
  const body = "data=" + encodeURIComponent(query);
  const headers = {
    "Content-Type": "application/x-www-form-urlencoded",
    "Accept": "*/*",
    "User-Agent": "PeakFlow/1.0 (peakflow.app ski resort data)",
  };

  for (const server of OVERPASS_SERVERS) {
    for (let attempt = 0; attempt < 2; attempt++) {
      try {
        const res = await fetch(server, {
          method: "POST",
          body,
          headers,
          cache: "no-store",
          signal: AbortSignal.timeout(timeoutMs),
        });
        if (res.status === 429 || res.status === 503) {
          // Rate limited — wait then try next server
          await new Promise((r) => setTimeout(r, 8000));
          break;
        }
        if (res.ok) return res;
        // Other error — try next server immediately
        break;
      } catch {
        // Timeout or network error — try next server
        break;
      }
    }
  }
  throw new Error("Alle Overpass servers onbereikbaar (429/503). Probeer het later opnieuw.");
}

export async function fetchAllResorts(): Promise<OsmResort[]> {
  const query = `[out:json][timeout:40];
(
  node["leisure"="ski_resort"];
  relation["leisure"="ski_resort"];
  relation["site"="piste"]["type"="site"];
);
out tags center;`;

  const res = await overpassFetch(query, 50000);
  if (!res.ok) throw new Error(`Overpass discovery failed: ${res.status}`);
  const data = await res.json() as { elements: OverpassElement[] };

  const results: OsmResort[] = [];
  const seen = new Set<string>();

  for (const el of data.elements) {
    const tags = el.tags ?? {};

    // Get coordinates
    let lat: number | undefined;
    let lon: number | undefined;
    if (el.type === "node") {
      lat = el.lat;
      lon = el.lon;
    } else if (el.center) {
      lat = el.center.lat;
      lon = el.center.lon;
    }
    if (lat == null || lon == null) continue;

    // Prefer English name
    const name = tags["name:en"] ?? tags.name ?? "";
    if (!name || name.length < 2) continue;

    // Deduplicate by normalized name
    const key = normalizeName(name);
    if (seen.has(key)) continue;
    seen.add(key);

    // Country — from OSM tag first, then coordinate lookup
    const countryCode =
      tags["addr:country_code"] ??
      tags["is_in:country_code"] ??
      tags["addr:country"] ?? "";
    const country =
      isoToCountry(countryCode) ??
      countryFromCoords(lat, lon) ??
      undefined;

    // Summit elevation
    const summitStr = tags.highest_summit ?? tags["ele:max"] ?? tags.ele ?? "";
    const altitudeTop = summitStr ? Math.round(parseFloat(summitStr)) : undefined;

    results.push({
      name,
      lat,
      lon,
      country: country || undefined,
      website: tags.website || undefined,
      altitudeTop: altitudeTop && Number.isFinite(altitudeTop) ? altitudeTop : undefined,
    });
  }

  return results;
}

// ─── 2. Per-resort Overpass stats ─────────────────────────────────────────

type GeomNode = { lat: number; lon: number };
type OverpassWay = {
  type: "way";
  tags?: Record<string, string>;
  geometry?: GeomNode[];
};
type OverpassResortEl = {
  type: string;
  tags?: Record<string, string>;
  geometry?: GeomNode[];
};

function haversineKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
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

function wayLengthKm(geometry: GeomNode[]): number {
  let total = 0;
  for (let i = 1; i < geometry.length; i++) {
    total += haversineKm(
      geometry[i - 1].lat, geometry[i - 1].lon,
      geometry[i].lat, geometry[i].lon
    );
  }
  return total;
}

export async function fetchResortStats(
  lat: number,
  lon: number
): Promise<ResortStats | null> {
  // ~5-8 km bounding box — precise enough to avoid neighboring resorts
  const dlat = 0.06;
  const dlon = 0.10;
  const bbox = `${lat - dlat},${lon - dlon},${lat + dlat},${lon + dlon}`;

  const query = `[out:json][timeout:12];
(
  way["aerialway"~"cable_car|gondola|chair_lift|drag_lift|t-bar|j-bar|platter|rope_tow|magic_carpet|funicular|mixed_lift"](${bbox});
  way["piste:type"="downhill"](${bbox});
  way["piste:type"="snowpark"](${bbox});
  node["leisure"="ski_resort"](${bbox});
  way["leisure"="ski_resort"](${bbox});
  relation["leisure"="ski_resort"](${bbox});
);
out tags geom;`;

  try {
    const res = await overpassFetch(query, 15000);
    if (!res.ok) return null;

    const data = await res.json() as { elements: OverpassResortEl[] };
    const elements = data.elements ?? [];

    let lifts = 0;
    let pisteKmTotal = 0;
    let pisteGreen = 0;
    let pisteBlue = 0;
    let pisteRed = 0;
    let pisteBlack = 0;
    let snowpark = false;
    let website: string | undefined;
    let altitudeTop: number | undefined;

    for (const el of elements) {
      const tags = el.tags ?? {};

      if (tags.aerialway) lifts++;

      if (tags["piste:type"] === "downhill" && el.geometry?.length) {
        const km = wayLengthKm(el.geometry);
        pisteKmTotal += km;
        const diff = tags["piste:difficulty"] ?? "";
        if (diff === "novice" || diff === "beginner") pisteGreen++;
        else if (diff === "easy") pisteBlue++;
        else if (diff === "intermediate") pisteRed++;
        else if (diff === "advanced" || diff === "expert") pisteBlack++;
        else pisteBlue++;
      }

      if (tags["piste:type"] === "snowpark") snowpark = true;

      if (tags.leisure === "ski_resort") {
        if (!website && tags.website) website = tags.website;
        const summit = tags.highest_summit ?? tags["ele:max"] ?? tags.ele;
        if (summit) {
          const n = Math.round(parseFloat(summit));
          if (Number.isFinite(n) && n > (altitudeTop ?? 0)) altitudeTop = n;
        }
      }
    }

    if (lifts === 0 && pisteKmTotal === 0) return null;

    return {
      lifts,
      pisteKm: Math.round(pisteKmTotal),
      pisteGreen,
      pisteBlue,
      pisteRed,
      pisteBlack,
      snowpark,
      website: website || undefined,
      altitudeTop: altitudeTop || undefined,
    };
  } catch {
    return null;  // timeout or network error — not counted as error
  }
}

// ─── 3. Open-Meteo snow conditions ────────────────────────────────────────

export async function fetchSnowConditions(
  lat: number,
  lon: number,
  altitudeTop?: number | null
): Promise<SnowConditions> {
  let snowDepthBase: number | null = null;
  let snowDepthTop: number | null = null;
  let freshSnow24h: number | null = null;
  let tempBase: number | null = null;

  try {
    const url =
      `https://api.open-meteo.com/v1/forecast` +
      `?latitude=${lat}&longitude=${lon}` +
      `&current=snow_depth,temperature_2m` +
      `&daily=snowfall_sum&timezone=auto&forecast_days=2`;

    const res = await fetch(url, { signal: AbortSignal.timeout(10000) });
    if (res.ok) {
      const d = await res.json() as {
        current?: { snow_depth?: number; temperature_2m?: number };
        daily?: { snowfall_sum?: number[] };
      };
      if (d.current?.snow_depth != null)
        snowDepthBase = Math.round(d.current.snow_depth * 100);
      if (d.current?.temperature_2m != null)
        tempBase = Math.round(d.current.temperature_2m * 10) / 10;
      if (d.daily?.snowfall_sum?.[0] != null)
        freshSnow24h = Math.round(d.daily.snowfall_sum[0] * 10) / 10;
    }
  } catch { /* non-fatal */ }

  if (altitudeTop && altitudeTop > 0) {
    try {
      const topUrl =
        `https://api.open-meteo.com/v1/forecast` +
        `?latitude=${lat}&longitude=${lon}` +
        `&current=snow_depth&timezone=auto&elevation=${altitudeTop}`;
      const res = await fetch(topUrl, { signal: AbortSignal.timeout(8000) });
      if (res.ok) {
        const d = await res.json() as { current?: { snow_depth?: number } };
        if (d.current?.snow_depth != null)
          snowDepthTop = Math.round(d.current.snow_depth * 100);
      }
    } catch { /* non-fatal */ }
  }

  return { snowDepthBase, snowDepthTop, freshSnow24h, tempBase };
}
