-- CreateEnum
CREATE TYPE "SeatStatus" AS ENUM ('AVAILABLE', 'HELD', 'SOLD');

-- AlterTable
ALTER TABLE "TicketType" ADD COLUMN     "seatMap" JSONB;

-- CreateTable
CREATE TABLE "Seat" (
    "id" TEXT NOT NULL,
    "ticketTypeId" TEXT NOT NULL,
    "row" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "status" "SeatStatus" NOT NULL DEFAULT 'AVAILABLE',
    "ticketId" TEXT,
    "heldByOrderId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Seat_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Seat_ticketId_key" ON "Seat"("ticketId");

-- CreateIndex
CREATE INDEX "Seat_ticketTypeId_status_idx" ON "Seat"("ticketTypeId", "status");

-- CreateIndex
CREATE UNIQUE INDEX "Seat_ticketTypeId_row_label_key" ON "Seat"("ticketTypeId", "row", "label");

-- AddForeignKey
ALTER TABLE "Seat" ADD CONSTRAINT "Seat_ticketTypeId_fkey" FOREIGN KEY ("ticketTypeId") REFERENCES "TicketType"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Seat" ADD CONSTRAINT "Seat_ticketId_fkey" FOREIGN KEY ("ticketId") REFERENCES "Ticket"("id") ON DELETE SET NULL ON UPDATE CASCADE;
