-- CreateEnum
CREATE TYPE "WalletKycTier" AS ENUM ('NONE', 'BASIC', 'VERIFIED');

-- AlterTable
ALTER TABLE "User"
  ADD COLUMN "kycTier" "WalletKycTier" NOT NULL DEFAULT 'NONE',
  ADD COLUMN "kycSubmittedAt" TIMESTAMP(3),
  ADD COLUMN "kycVerifiedAt" TIMESTAMP(3),
  ADD COLUMN "kycBvn" TEXT,
  ADD COLUMN "kycIdNumber" TEXT,
  ADD COLUMN "kycIdDocumentUrl" TEXT;
