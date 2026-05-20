-- CreateTable
CREATE TABLE "OAuthClient" (
    "id" TEXT NOT NULL,
    "organizerId" TEXT NOT NULL,
    "clientId" TEXT NOT NULL,
    "clientSecretHash" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "scopes" TEXT NOT NULL,
    "redirectUris" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "OAuthClient_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "OAuthAccessToken" (
    "id" TEXT NOT NULL,
    "clientId" TEXT NOT NULL,
    "tokenHash" TEXT NOT NULL,
    "scopes" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "OAuthAccessToken_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "OAuthClient_clientId_key" ON "OAuthClient"("clientId");
CREATE INDEX "OAuthClient_clientId_idx" ON "OAuthClient"("clientId");
CREATE INDEX "OAuthClient_organizerId_idx" ON "OAuthClient"("organizerId");
CREATE UNIQUE INDEX "OAuthAccessToken_tokenHash_key" ON "OAuthAccessToken"("tokenHash");
CREATE INDEX "OAuthAccessToken_clientId_expiresAt_idx" ON "OAuthAccessToken"("clientId", "expiresAt");

-- AddForeignKey
ALTER TABLE "OAuthClient" ADD CONSTRAINT "OAuthClient_organizerId_fkey" FOREIGN KEY ("organizerId") REFERENCES "Organizer"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "OAuthAccessToken" ADD CONSTRAINT "OAuthAccessToken_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "OAuthClient"("id") ON DELETE CASCADE ON UPDATE CASCADE;
