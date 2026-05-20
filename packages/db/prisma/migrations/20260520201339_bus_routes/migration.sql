-- CreateEnum
CREATE TYPE "EventType" AS ENUM ('EVENT', 'BUS_TRIP');

-- AlterTable
ALTER TABLE "Event" ADD COLUMN     "busRouteId" TEXT,
ADD COLUMN     "type" "EventType" NOT NULL DEFAULT 'EVENT';

-- CreateTable
CREATE TABLE "BusRoute" (
    "id" TEXT NOT NULL,
    "organizerId" TEXT NOT NULL,
    "fromCity" TEXT NOT NULL,
    "toCity" TEXT NOT NULL,
    "durationMinutes" INTEGER NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "BusRoute_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "BusRoute_fromCity_toCity_idx" ON "BusRoute"("fromCity", "toCity");

-- CreateIndex
CREATE INDEX "BusRoute_organizerId_idx" ON "BusRoute"("organizerId");

-- CreateIndex
CREATE INDEX "Event_type_status_startsAt_idx" ON "Event"("type", "status", "startsAt");

-- AddForeignKey
ALTER TABLE "BusRoute" ADD CONSTRAINT "BusRoute_organizerId_fkey" FOREIGN KEY ("organizerId") REFERENCES "Organizer"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Event" ADD CONSTRAINT "Event_busRouteId_fkey" FOREIGN KEY ("busRouteId") REFERENCES "BusRoute"("id") ON DELETE SET NULL ON UPDATE CASCADE;
