/**
 * PeakFlow Sneeuwzekerheids-Algoritme v1
 *
 * Score 1.0 – 10.0 op basis van vier gewogen componenten:
 *   40% — Hoogtefactor (top + basis hoogte van het skigebied)
 *   35% — Historische sneeuwdata (Open-Meteo 10 jaar archief)
 *   15% — Geografische factor (breedtegraad + klimaatzone)
 *   10% — Altitudebereik (verschil top − basis = veelzijdigheid)
 *
 * De historische component wordt ASYNCHROON opgehaald van Open-Meteo.
 * Als de API niet bereikbaar is valt het algoritme terug op de drie
 * statische componenten (hergewogen tot 100%).
 */

export interface SnowScoreBreakdown {
  altitudeScore: number;       // 0-10
  latitudeScore: number;       // 0-10
  rangeScore: number;          // 0-10
  historicalScore: number | null; // 0-10, null als API niet beschikbaar
  finalScore: number;          // 1.0-10.0 gewogen eindresultaat
  factors: string[];           // leesbare verklarende factoren
}

// ─── gewichten ────────────────────────────────────────────────────────────────

const W_ALTITUDE   = 0.50;
const W_HISTORICAL = 0.30;
const W_LATITUDE   = 0.20;

// ─── 1. Hoogtescore ───────────────────────────────────────────────────────────
// Basisstation is het zwakste punt: als het er te laag ligt ontbreekt sneeuw
// bij onvoldoende neerslag.  Top bepaalt de kwaliteit, maar basis de garantie.

function altitudeScore(top: number | null, base: number | null): number {
  const b = base ?? 0;
  const t = top  ?? b;

  let baseScore: number;
  if      (b >= 2200) baseScore = 10.0;
  else if (b >= 1900) baseScore = 9.2;
  else if (b >= 1700) baseScore = 8.5;
  else if (b >= 1500) baseScore = 7.5;
  else if (b >= 1200) baseScore = 6.2;
  else if (b >= 1000) baseScore = 5.0;
  else if (b >= 800)  baseScore = 3.8;
  else if (b >= 600)  baseScore = 2.8;
  else                baseScore = 1.5;

  let topScore: number;
  if      (t >= 3500) topScore = 10.0;
  else if (t >= 3200) topScore = 9.5;
  else if (t >= 2900) topScore = 8.8;
  else if (t >= 2500) topScore = 7.5;
  else if (t >= 2000) topScore = 6.0;
  else if (t >= 1700) topScore = 4.5;
  else if (t >= 1400) topScore = 3.2;
  else                topScore = 2.0;

  // Basis is zwaarder gewogen (65%) omdat het de minimum-sneeuwgrens bepaalt
  return baseScore * 0.65 + topScore * 0.35;
}

// ─── 2. Breedtegraad / klimaatscore ───────────────────────────────────────────
// Hogere breedte = kouder = betrouwbaardere sneeuw.
// Continentale vs maritieme klimaten zijn hier niet direct modelleerbaar,
// maar breedtegraad is de beste statische proxy daarvoor.

function latitudeScore(lat: number | null): number {
  if (lat === null) return 5.0; // fallback als coördinaten ontbreken

  const a = Math.abs(lat);
  if      (a >= 67) return 9.8;  // Lappland (Levi, Ylläs)
  else if (a >= 63) return 9.0;  // Noord-Scandinavisch (Åre)
  else if (a >= 60) return 8.2;  // Noors (Hemsedal, Trysil)
  else if (a >= 57) return 7.4;  // Zuid-Scandinavisch
  else if (a >= 50) return 6.6;  // Noord-Alpen (NL-richting)
  else if (a >= 47) return 6.0;  // Noord-Alpen kern
  else if (a >= 45) return 5.5;  // Centraal-Alpen
  else if (a >= 43) return 5.0;  // Zuid-Alpen, Pyreneeën
  else if (a >= 41) return 4.2;  // Zuidelijke Pyreneeën
  else if (a >= 37) return 3.5;  // Sierra Nevada e.d.
  else              return 2.5;
}

// ─── 3. Altitudebereik (top − basis) ─────────────────────────────────────────
// Groot verticaal bereik = meer mogelijkheden bij variabele sneeuw:
// als het laag te weinig sneeuw heeft, is er altijd een zone hoger.

function rangeScore(top: number | null, base: number | null): number {
  const t = top  ?? 0;
  const b = base ?? 0;
  const r = Math.max(0, t - b);

  if      (r >= 2200) return 10.0;
  else if (r >= 1800) return 9.0;
  else if (r >= 1400) return 7.8;
  else if (r >= 1000) return 6.5;
  else if (r >= 700)  return 5.2;
  else if (r >= 400)  return 3.8;
  else if (r >= 200)  return 2.5;
  else                return 1.5;
}

// ─── 4. Historische sneeuwscore (Open-Meteo archief 10 jaar) ─────────────────
// Haalt dagelijkse sneeuwdiepte + sneeuwval op voor dec–mrt, 2014–2024.
// Berekent drie metrices:
//   a) Gemiddelde maximale sneeuwdiepte in de winter
//   b) Betrouwbaarheid = % dagen met ≥30 cm sneeuwdiepte
//   c) Gemiddelde seizoenssneeuwval over 10 jaar

export async function fetchHistoricalScore(lat: number, lon: number): Promise<number | null> {
  try {
    const url = new URL("https://archive-api.open-meteo.com/v1/archive");
    url.searchParams.set("latitude",   String(lat));
    url.searchParams.set("longitude",  String(lon));
    url.searchParams.set("start_date", "2014-11-01");
    url.searchParams.set("end_date",   "2024-03-31");
    url.searchParams.set("daily",      "snowfall_sum,snow_depth_max");
    url.searchParams.set("timezone",   "auto");

    const res = await fetch(url.toString(), {
      next:   { revalidate: 60 * 60 * 24 * 30 }, // 30 dagen cache
      signal: AbortSignal.timeout(20_000),
    });
    if (!res.ok) return null;

    const data = await res.json();
    const dates:     string[] = data.daily?.time          ?? [];
    const snowfall:  number[] = data.daily?.snowfall_sum  ?? [];
    const depth:     number[] = data.daily?.snow_depth_max ?? [];

    // Filter: alleen december (12) en jan/feb/mrt (1-3)
    let totalDepth    = 0;
    let totalSnowfall = 0;
    let reliableDays  = 0;
    let winterDays    = 0;

    for (let i = 0; i < dates.length; i++) {
      const month = parseInt(dates[i].split("-")[1], 10);
      if (month === 12 || month <= 3) {
        const d = depth[i]    ?? 0;
        const s = snowfall[i] ?? 0;
        totalDepth    += d;
        totalSnowfall += s;
        if (d >= 30) reliableDays++;
        winterDays++;
      }
    }

    if (winterDays === 0) return null;

    const avgDepth    = totalDepth    / winterDays;          // cm
    const reliability = reliableDays  / winterDays;          // 0-1
    const avgSnowfall = totalSnowfall / 10;                  // cm/seizoen (10j)

    // Deelscore sneeuwdiepte (0-10)
    let dScore: number;
    if      (avgDepth >= 180) dScore = 10.0;
    else if (avgDepth >= 130) dScore = 9.0;
    else if (avgDepth >= 90)  dScore = 7.5;
    else if (avgDepth >= 60)  dScore = 6.0;
    else if (avgDepth >= 35)  dScore = 4.5;
    else if (avgDepth >= 15)  dScore = 3.0;
    else                      dScore = 1.5;

    // Deelscore betrouwbaarheid (0-10)
    const rScore = Math.min(10, reliability * 12.5);

    // Deelscore seizoenssneeuwval (0-10)
    let sScore: number;
    if      (avgSnowfall >= 800) sScore = 10.0;
    else if (avgSnowfall >= 600) sScore = 9.0;
    else if (avgSnowfall >= 400) sScore = 7.5;
    else if (avgSnowfall >= 250) sScore = 6.0;
    else if (avgSnowfall >= 150) sScore = 4.5;
    else if (avgSnowfall >= 80)  sScore = 3.0;
    else                         sScore = 1.5;

    // Gewogen combinatie (diepte zwaarst: 45%)
    return dScore * 0.45 + rScore * 0.35 + sScore * 0.20;
  } catch {
    return null;
  }
}

// ─── Publieke functie ─────────────────────────────────────────────────────────

export async function computeSnowScore(resort: {
  altitudeTop:  number | null;
  altitudeBase: number | null;
  lat:          number | null;
  lon:          number | null;
}): Promise<SnowScoreBreakdown> {

  const aScore = altitudeScore(resort.altitudeTop, resort.altitudeBase);
  const lScore = latitudeScore(resort.lat);
  const rScore = rangeScore(resort.altitudeTop, resort.altitudeBase);

  let hScore: number | null = null;
  if (resort.lat !== null && resort.lon !== null) {
    hScore = await fetchHistoricalScore(resort.lat, resort.lon);
  }

  // Gewogen gemiddelde — als historische data ontbreekt, herweeg de rest
  let numerator   = aScore * W_ALTITUDE + lScore * W_LATITUDE;
  let denominator = W_ALTITUDE + W_LATITUDE;

  if (hScore !== null) {
    numerator   += hScore * W_HISTORICAL;
    denominator += W_HISTORICAL;
  }

  const raw   = numerator / denominator;
  const final = parseFloat(Math.max(1.0, Math.min(10.0, raw)).toFixed(1));

  // Menselijke verklaringen
  const factors: string[] = [];
  const top  = resort.altitudeTop  ?? 0;
  const base = resort.altitudeBase ?? 0;
  const lat  = resort.lat          ?? 0;

  if (top  >= 3500)                factors.push("Gletsjertoegang boven 3.500 m — vrijwel jaarrond sneeuw");
  if (top  >= 3000 && top < 3500)  factors.push("Toppiste boven 3.000 m — uitstekende hoogtegarantie");
  if (base >= 2000)                factors.push("Basisstation op 2.000 m+ — sneeuw op alle pistes gegarandeerd");
  if (base >= 1500 && base < 2000) factors.push("Comfortabele basishoogte van 1.500 m+");
  if (base < 800)                  factors.push("Laag basisstation — sneeuwzekerheid kwetsbaar bij warmte");
  if (lat  >= 63)                  factors.push("Scandinavische ligging — extreme kou en lange seizoenen");
  if (lat  >= 60 && lat < 63)      factors.push("Noordelijk klimaat — koud en betrouwbaar");
  if ((top - base) >= 1500)        factors.push("Groot hoogtebereik (1.500 m+) — altijd een sneeuwzekere zone");
  if (hScore !== null && hScore >= 8.0) factors.push("Uitstekende historische sneeuwdata (10-jaars archief)");
  if (hScore !== null && hScore <= 4.0) factors.push("Matige historische sneeuwdata — variabele seizoenen");

  return {
    altitudeScore:   parseFloat(aScore.toFixed(2)),
    latitudeScore:   parseFloat(lScore.toFixed(2)),
    rangeScore:      parseFloat(rScore.toFixed(2)),
    historicalScore: hScore !== null ? parseFloat(hScore.toFixed(2)) : null,
    finalScore:      final,
    factors,
  };
}
