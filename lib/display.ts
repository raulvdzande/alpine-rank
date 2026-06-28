// Deterministic visual + formatting helpers for the PeakFlow UI.

const GRADIENTS = [
  "linear-gradient(135deg,#7cb8d8,#4a9abe)",
  "linear-gradient(135deg,#8cc5a8,#5a9e7a)",
  "linear-gradient(135deg,#c8a0d8,#9a6ab8)",
  "linear-gradient(135deg,#f0c080,#d4903a)",
  "linear-gradient(135deg,#a0c8f0,#6a9abe)",
  "linear-gradient(135deg,#c8e8c0,#88b878)",
];

const EMOJIS = ["🏔", "⛰", "🎿", "🗻", "⛷", "🏕"];

const FLOAT_BG = ["#e8f4fc", "#eaf5ec", "#fef3e0"];

export function hash(str: string): number {
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

export function gradientFor(id: string): string {
  return GRADIENTS[hash(id) % GRADIENTS.length];
}

export function emojiFor(id: string): string {
  return EMOJIS[hash(id + "e") % EMOJIS.length];
}

export function avatarBg(seed: string): string {
  return FLOAT_BG[hash(seed) % FLOAT_BG.length];
}

const COUNTRY_DATA: Record<string, { en: string; flag: string }> = {
  Austria: { en: "Austria", flag: "🇦🇹" },
  France: { en: "France", flag: "🇫🇷" },
  Switzerland: { en: "Switzerland", flag: "🇨🇭" },
  Italy: { en: "Italy", flag: "🇮🇹" },
  Germany: { en: "Germany", flag: "🇩🇪" },
  "United States": { en: "United States", flag: "🇺🇸" },
  Canada: { en: "Canada", flag: "🇨🇦" },
  Bulgaria: { en: "Bulgaria", flag: "🇧🇬" },
  Norway: { en: "Norway", flag: "🇳🇴" },
  Sweden: { en: "Sweden", flag: "🇸🇪" },
  Spain: { en: "Spain", flag: "🇪🇸" },
  Andorra: { en: "Andorra", flag: "🇦🇩" },
  Slovenia: { en: "Slovenia", flag: "🇸🇮" },
  Czechia: { en: "Czechia", flag: "🇨🇿" },
  "Czech Republic": { en: "Czech Republic", flag: "🇨🇿" },
  Poland: { en: "Poland", flag: "🇵🇱" },
  Finland: { en: "Finland", flag: "🇫🇮" },
  Japan: { en: "Japan", flag: "🇯🇵" },
};

export function countryNL(country: string): string {
  return COUNTRY_DATA[country]?.en ?? country;
}

export function countryFlag(country: string): string {
  return COUNTRY_DATA[country]?.flag ?? "🏔";
}

export function stars(rating: number): string {
  const r = Math.round(rating);
  return "★★★★★".slice(0, r) + "☆☆☆☆☆".slice(0, 5 - r);
}

// 0-5 star rating from a stored 0-5 (or 0-10) average
export function toFiveStars(avg: number | null | undefined): number {
  if (!avg) return 0;
  return avg > 5 ? avg / 2 : avg;
}

export function fmtCount(n: number): string {
  if (n >= 1000) return (n / 1000).toFixed(1).replace(".0", "") + "k";
  return String(n);
}

export function fmtNumber(n: number): string {
  return n.toLocaleString("en-US");
}

export function snowBar(score: number): { width: string; bar: string; color: string } {
  const pct = Math.round(score * 10);
  if (score >= 9) return { width: `${pct}%`, bar: "linear-gradient(90deg,#22c55e,#16a34a)", color: "#6ee7b7" };
  if (score >= 8.7) return { width: `${pct}%`, bar: "linear-gradient(90deg,#86efac,#22c55e)", color: "#86efac" };
  return { width: `${pct}%`, bar: "linear-gradient(90deg,#fde68a,#f59e0b)", color: "#fde68a" };
}
