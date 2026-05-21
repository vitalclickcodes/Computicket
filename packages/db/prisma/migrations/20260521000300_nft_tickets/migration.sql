-- AlterTable
ALTER TABLE "Ticket"
  ADD COLUMN "nftTokenId" BIGINT,
  ADD COLUMN "nftClaimedWallet" TEXT,
  ADD COLUMN "nftClaimedAt" TIMESTAMP(3);

-- CreateIndex
CREATE UNIQUE INDEX "Ticket_nftTokenId_key" ON "Ticket"("nftTokenId");
