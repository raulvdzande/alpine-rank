-- AlterTable: add website, coordinates, and live snow condition fields to Resort
ALTER TABLE "Resort"
  ADD COLUMN IF NOT EXISTS "website"              TEXT,
  ADD COLUMN IF NOT EXISTS "lat"                  DOUBLE PRECISION,
  ADD COLUMN IF NOT EXISTS "lon"                  DOUBLE PRECISION,
  ADD COLUMN IF NOT EXISTS "snowDepthBase"         INTEGER,
  ADD COLUMN IF NOT EXISTS "snowDepthTop"          INTEGER,
  ADD COLUMN IF NOT EXISTS "freshSnow24h"          DOUBLE PRECISION,
  ADD COLUMN IF NOT EXISTS "tempBase"              DOUBLE PRECISION,
  ADD COLUMN IF NOT EXISTS "conditionsUpdatedAt"   TIMESTAMP(3);

-- CreateIndex
CREATE INDEX IF NOT EXISTS "Resort_lat_lon_idx" ON "Resort"("lat", "lon");
