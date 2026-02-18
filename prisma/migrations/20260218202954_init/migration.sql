-- CreateEnum
CREATE TYPE "Role" AS ENUM ('USER', 'ADMIN');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" "Role" NOT NULL DEFAULT 'USER',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Resort" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "url" TEXT,
    "locationCoordinate" TEXT NOT NULL,
    "locationCountry" TEXT NOT NULL,
    "locationRegion" TEXT,
    "elevationTopM" INTEGER NOT NULL,
    "elevationDifferenceM" INTEGER NOT NULL,
    "totalSlopeLengthKm" DOUBLE PRECISION NOT NULL,
    "numberOfLifts" INTEGER NOT NULL,
    "numberOfSlopes" INTEGER NOT NULL,
    "annualSnowfallCm" INTEGER NOT NULL,
    "averageOverallRating" DOUBLE PRECISION DEFAULT 0,
    "reviewCount" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Resort_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Review" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "resortId" TEXT NOT NULL,
    "terrain" INTEGER NOT NULL,
    "snow" INTEGER NOT NULL,
    "lifts" INTEGER NOT NULL,
    "apres" INTEGER NOT NULL,
    "family" INTEGER NOT NULL,
    "value" INTEGER NOT NULL,
    "scenery" INTEGER NOT NULL,
    "overall" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Review_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE INDEX "User_email_idx" ON "User"("email");

-- CreateIndex
CREATE INDEX "Resort_locationCountry_idx" ON "Resort"("locationCountry");

-- CreateIndex
CREATE INDEX "Resort_averageOverallRating_idx" ON "Resort"("averageOverallRating");

-- CreateIndex
CREATE INDEX "Resort_reviewCount_idx" ON "Resort"("reviewCount");

-- CreateIndex
CREATE INDEX "Review_resortId_idx" ON "Review"("resortId");

-- CreateIndex
CREATE UNIQUE INDEX "Review_userId_resortId_key" ON "Review"("userId", "resortId");

-- AddForeignKey
ALTER TABLE "Review" ADD CONSTRAINT "Review_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Review" ADD CONSTRAINT "Review_resortId_fkey" FOREIGN KEY ("resortId") REFERENCES "Resort"("id") ON DELETE CASCADE ON UPDATE CASCADE;
