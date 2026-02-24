import { prisma } from "../lib/prisma";
import fs from "fs";
import csv from "csv-parser";

const filePath = "resorts.csv";

async function main() {
  const resorts: any[] = [];

  fs.createReadStream(filePath)
    .pipe(csv())
    .on("data", (data) => resorts.push(data))
    .on("end", async () => {
      for (const r of resorts) {
        await prisma.resort.create({
          data: {
            name: r.name,
            url: r.url,
            locationCoordinate: r.location_coordinate,
            locationCountry: r.location_country,
            locationRegion: r.location_region,
            elevationTopM: parseInt(r.elevation_top_m),
            elevationDifferenceM: parseInt(r.elevation_difference_m),
            totalSlopeLengthKm: parseFloat(r.total_slope_length_km),
            numberOfLifts: parseInt(r.number_of_lifts),
            numberOfSlopes: parseInt(r.number_of_slopes),
            annualSnowfallCm: parseInt(r.annual_snowfall_cm),
          },
        });
      }
      console.log("Resorts imported successfully!");
      process.exit(0);
    });
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});