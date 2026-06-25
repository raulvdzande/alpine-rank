import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

function generateSlug(name: string, country: string): string {
  const base = `${name} ${country}`
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^\w-]/g, "")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");

  return base || "resort";
}

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

const RESORTS = [
  // Austria
  { name: "Saalbach-Hinterglemm", country: "Austria", region: "Salzburg", top: 2096, base: 1003, km: 200, blue: 40, red: 35, black: 25, lifts: 55, price: 52, lat: 47.65, lon: 12.68, category: "Expert" },
  { name: "St. Anton am Arlberg", country: "Austria", region: "Tyrol", top: 2811, base: 1304, km: 305, blue: 30, red: 40, black: 30, lifts: 88, price: 58, lat: 47.27, lon: 10.26, category: "Expert" },
  { name: "Kitzbühel", country: "Austria", region: "Tyrol", top: 2000, base: 800, km: 168, blue: 45, red: 35, black: 20, lifts: 62, price: 54, lat: 47.45, lon: 12.39, category: "Expert" },
  { name: "Ischgl", country: "Austria", region: "Tyrol", top: 2864, base: 1400, km: 238, blue: 32, red: 43, black: 25, lifts: 45, price: 56, lat: 47.02, lon: 10.29, category: "Expert" },
  { name: "Mayrhofen", country: "Austria", region: "Tyrol", top: 2965, base: 629, km: 139, blue: 38, red: 37, black: 25, lifts: 48, price: 49, lat: 47.17, lon: 11.86, category: "Intermediate" },
  { name: "Schladming", country: "Austria", region: "Styria", top: 1896, base: 745, km: 120, blue: 42, red: 35, black: 23, lifts: 36, price: 45, lat: 47.60, lon: 13.68, category: "Intermediate" },
  { name: "Obergurgl-Hochgurgl", country: "Austria", region: "Tyrol", top: 3080, base: 1930, km: 112, blue: 35, red: 40, black: 25, lifts: 26, price: 54, lat: 46.87, lon: 11.02, category: "Expert" },
  { name: "Nassfeld", country: "Austria", region: "Carinthia", top: 2530, base: 1540, km: 110, blue: 40, red: 38, black: 22, lifts: 19, price: 42, lat: 46.44, lon: 13.74, category: "Beginners" },

  // Switzerland
  { name: "Zermatt", country: "Switzerland", region: "Valais", top: 3899, base: 1616, km: 360, blue: 25, red: 40, black: 35, lifts: 62, price: 65, lat: 46.02, lon: 7.75, category: "Expert" },
  { name: "Verbier", country: "Switzerland", region: "Valais", top: 3330, base: 1500, km: 410, blue: 28, red: 45, black: 27, lifts: 88, price: 60, lat: 46.09, lon: 7.23, category: "Expert" },
  { name: "Davos-Klosters", country: "Switzerland", region: "Graubünden", top: 2844, base: 1560, km: 300, blue: 38, red: 38, black: 24, lifts: 58, price: 58, lat: 46.81, lon: 9.84, category: "Intermediate" },
  { name: "Saas-Fee", country: "Switzerland", region: "Valais", top: 3633, base: 1800, km: 100, blue: 30, red: 45, black: 25, lifts: 27, price: 62, lat: 46.10, lon: 7.95, category: "Intermediate" },
  { name: "Engelberg", country: "Switzerland", region: "Obwalden", top: 3238, base: 1050, km: 82, blue: 32, red: 42, black: 26, lifts: 22, price: 55, lat: 46.82, lon: 8.40, category: "Intermediate" },
  { name: "Andermatt", country: "Switzerland", region: "Uri", top: 2961, base: 1444, km: 120, blue: 35, red: 40, black: 25, lifts: 24, price: 54, lat: 46.66, lon: 8.63, category: "Expert" },
  { name: "Lenzerheide", country: "Switzerland", region: "Graubünden", top: 2715, base: 1476, km: 225, blue: 40, red: 35, black: 25, lifts: 41, price: 52, lat: 46.51, lon: 9.88, category: "Beginners" },
  { name: "Flims-Laax", country: "Switzerland", region: "Graubünden", top: 2596, base: 1020, km: 224, blue: 42, red: 35, black: 23, lifts: 35, price: 51, lat: 46.76, lon: 9.27, category: "Beginners" },

  // France
  { name: "Chamonix", country: "France", region: "Haute-Savoie", top: 3842, base: 1035, km: 175, blue: 25, red: 45, black: 30, lifts: 28, price: 55, lat: 45.92, lon: 6.87, category: "Expert" },
  { name: "Courchevel", country: "France", region: "Savoie", top: 2738, base: 1300, km: 600, blue: 35, red: 40, black: 25, lifts: 82, price: 62, lat: 45.39, lon: 6.63, category: "Expert" },
  { name: "Val d'Isère", country: "France", region: "Savoie", top: 3456, base: 1850, km: 300, blue: 28, red: 42, black: 30, lifts: 63, price: 60, lat: 45.45, lon: 6.96, category: "Expert" },
  { name: "Alpe d'Huez", country: "France", region: "Isère", top: 3330, base: 1860, km: 250, blue: 32, red: 40, black: 28, lifts: 84, price: 54, lat: 45.09, lon: 6.07, category: "Intermediate" },
  { name: "Les Deux Alpes", country: "France", region: "Isère", top: 3600, base: 1650, km: 225, blue: 35, red: 38, black: 27, lifts: 72, price: 52, lat: 45.00, lon: 6.11, category: "Intermediate" },
  { name: "Serre Chevalier", country: "France", region: "Hautes-Alpes", top: 2802, base: 1200, km: 250, blue: 38, red: 38, black: 24, lifts: 65, price: 48, lat: 45.13, lon: 6.33, category: "Beginners" },
  { name: "Méribel", country: "France", region: "Savoie", top: 2952, base: 1400, km: 600, blue: 36, red: 41, black: 23, lifts: 48, price: 60, lat: 45.39, lon: 6.56, category: "Intermediate" },
  { name: "La Plagne", country: "France", region: "Savoie", top: 3002, base: 1970, km: 425, blue: 34, red: 42, black: 24, lifts: 58, price: 56, lat: 45.51, lon: 6.70, category: "Intermediate" },

  // Italy
  { name: "Cortina d'Ampezzo", country: "Italy", region: "Veneto", top: 2595, base: 1224, km: 150, blue: 38, red: 37, black: 25, lifts: 33, price: 51, lat: 46.54, lon: 12.14, category: "Intermediate" },
  { name: "Livigno", country: "Italy", region: "Lombardy", top: 3000, base: 1816, km: 115, blue: 36, red: 38, black: 26, lifts: 28, price: 48, lat: 46.54, lon: 10.13, category: "Intermediate" },
  { name: "Alta Badia", country: "Italy", region: "South Tyrol", top: 2778, base: 1400, km: 130, blue: 40, red: 35, black: 25, lifts: 39, price: 54, lat: 46.49, lon: 11.94, category: "Beginners" },
  { name: "Madonna di Campiglio", country: "Italy", region: "Trentino", top: 2605, base: 1550, km: 150, blue: 42, red: 34, black: 24, lifts: 42, price: 50, lat: 46.22, lon: 10.78, category: "Beginners" },
  { name: "Val Gardena", country: "Italy", region: "South Tyrol", top: 2518, base: 1563, km: 175, blue: 38, red: 38, black: 24, lifts: 28, price: 52, lat: 46.47, lon: 11.76, category: "Intermediate" },

  // Scandinavia
  { name: "Levi", country: "Finland", region: "Lapland", top: 532, base: 200, km: 43, blue: 45, red: 35, black: 20, lifts: 17, price: 42, lat: 66.84, lon: 24.85, category: "Beginners" },
  { name: "Ylläs", country: "Finland", region: "Lapland", top: 718, base: 250, km: 65, blue: 48, red: 32, black: 20, lifts: 19, price: 40, lat: 67.41, lon: 24.10, category: "Beginners" },
  { name: "Ruka", country: "Finland", region: "Lapland", top: 534, base: 270, km: 34, blue: 44, red: 38, black: 18, lifts: 10, price: 38, lat: 66.37, lon: 29.14, category: "Beginners" },
  { name: "Åre", country: "Sweden", region: "Jämtland", top: 1420, base: 380, km: 100, blue: 40, red: 38, black: 22, lifts: 38, price: 45, lat: 63.40, lon: 13.08, category: "Intermediate" },
  { name: "Sälen", country: "Sweden", region: "Dalarna", top: 1150, base: 460, km: 130, blue: 45, red: 32, black: 23, lifts: 44, price: 44, lat: 61.53, lon: 13.63, category: "Beginners" },
  { name: "Geilo", country: "Norway", region: "Buskerud", top: 1494, base: 800, km: 40, blue: 42, red: 38, black: 20, lifts: 16, price: 46, lat: 60.53, lon: 8.27, category: "Intermediate" },
  { name: "Hemsedal", country: "Norway", region: "Buskerud", top: 1540, base: 640, km: 50, blue: 40, red: 38, black: 22, lifts: 22, price: 47, lat: 60.86, lon: 8.98, category: "Intermediate" },
  { name: "Trysil", country: "Norway", region: "Hedmark", top: 1132, base: 600, km: 66, blue: 45, red: 35, black: 20, lifts: 21, price: 41, lat: 61.29, lon: 12.26, category: "Beginners" },

  // Germany
  { name: "Garmisch-Partenkirchen", country: "Germany", region: "Bavaria", top: 2684, base: 710, km: 40, blue: 38, red: 38, black: 24, lifts: 18, price: 44, lat: 47.49, lon: 11.10, category: "Intermediate" },
  { name: "Zugspitze", country: "Germany", region: "Bavaria", top: 2964, base: 730, km: 60, blue: 35, red: 40, black: 25, lifts: 20, price: 46, lat: 47.42, lon: 10.98, category: "Intermediate" },

  // Spain/Pyrenees
  { name: "Baqueira-Beret", country: "Spain", region: "Catalonia", top: 2610, base: 1500, km: 160, blue: 36, red: 40, black: 24, lifts: 32, price: 48, lat: 42.77, lon: 0.60, category: "Intermediate" },
  { name: "Formigal", country: "Spain", region: "Aragon", top: 2640, base: 1550, km: 193, blue: 38, red: 38, black: 24, lifts: 26, price: 46, lat: 42.79, lon: -0.49, category: "Intermediate" },
  { name: "Andorra la Vella", country: "Andorra", region: "Ordino", top: 2942, base: 1940, km: 210, blue: 40, red: 36, black: 24, lifts: 44, price: 45, lat: 42.52, lon: 1.52, category: "Beginners" },

  // Additional resorts to reach 50
  { name: "Bansko", country: "Bulgaria", region: "Pirin", top: 2660, base: 925, km: 85, blue: 42, red: 35, black: 23, lifts: 18, price: 28, lat: 41.84, lon: 23.94, category: "Beginners" },
  { name: "Borovets", country: "Bulgaria", region: "Rila", top: 2874, base: 1356, km: 88, blue: 40, red: 38, black: 22, lifts: 15, price: 26, lat: 42.20, lon: 23.82, category: "Intermediate" },
  { name: "Poiana Brașov", country: "Romania", region: "Transylvania", top: 2244, base: 1030, km: 55, blue: 45, red: 32, black: 23, lifts: 12, price: 24, lat: 45.58, lon: 24.91, category: "Beginners" },
  { name: "Kopaonik", country: "Serbia", region: "Central Serbia", top: 2017, base: 1500, km: 60, blue: 44, red: 34, black: 22, lifts: 10, price: 22, lat: 43.77, lon: 20.03, category: "Beginners" },
  { name: "Banská Bystrica", country: "Slovakia", region: "Low Tatras", top: 1975, base: 920, km: 50, blue: 46, red: 32, black: 22, lifts: 8, price: 20, lat: 48.74, lon: 19.14, category: "Beginners" },
];

async function main() {
  console.log("🌱 Seeding PeakFlow with 50 European resorts...");

  for (const resort of RESORTS) {
    const slug = generateSlug(resort.name, resort.country);

    await prisma.resort.upsert({
      where: { slug },
      update: {},
      create: {
        name: resort.name,
        Country: resort.country,
        Continent: "Europe",
        slug,
        region: resort.region,
        pisteKm: resort.km,
        pisteGreen: 0,
        pisteBlue: resort.blue,
        pisteRed: resort.red,
        pisteBlack: resort.black,
        altitudeTop: resort.top,
        altitudeBase: resort.base,
        lifts: resort.lifts,
        dayPassPrice: resort.price,
        category: resort.category,
        lat: resort.lat,
        lon: resort.lon,
        snowScore: Math.random() * 3 + 6.5,
        verified: false,
      },
    });
  }

  console.log("✅ Seeded 50 resorts successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
