-- CreateTable
CREATE TABLE "PricingRule" (
    "id" TEXT NOT NULL,
    "ticketTypeId" TEXT NOT NULL,
    "soldPercentThreshold" INTEGER NOT NULL,
    "priceAdjustmentBps" INTEGER NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PricingRule_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "PricingRule_ticketTypeId_soldPercentThreshold_idx" ON "PricingRule"("ticketTypeId", "soldPercentThreshold");

-- AddForeignKey
ALTER TABLE "PricingRule" ADD CONSTRAINT "PricingRule_ticketTypeId_fkey" FOREIGN KEY ("ticketTypeId") REFERENCES "TicketType"("id") ON DELETE CASCADE ON UPDATE CASCADE;
