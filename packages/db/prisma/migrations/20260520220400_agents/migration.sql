-- AlterTable
ALTER TABLE "Order"
  ADD COLUMN "agentCode" TEXT,
  ADD COLUMN "agentCommissionKobo" INTEGER NOT NULL DEFAULT 0;

-- CreateTable
CREATE TABLE "AgentProfile" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "agentCode" TEXT NOT NULL,
    "commissionBps" INTEGER NOT NULL DEFAULT 500,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AgentProfile_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "AgentProfile_userId_key" ON "AgentProfile"("userId");
CREATE UNIQUE INDEX "AgentProfile_agentCode_key" ON "AgentProfile"("agentCode");
CREATE INDEX "AgentProfile_agentCode_idx" ON "AgentProfile"("agentCode");

-- AddForeignKey
ALTER TABLE "AgentProfile" ADD CONSTRAINT "AgentProfile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
