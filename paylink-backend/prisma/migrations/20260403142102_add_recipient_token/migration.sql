-- AlterTable
ALTER TABLE "PaymentLink" ADD COLUMN     "hasRecipientToken" BOOLEAN NOT NULL DEFAULT false;

-- CreateTable
CREATE TABLE "RecipientToken" (
    "id" TEXT NOT NULL,
    "linkId" TEXT NOT NULL,
    "encryptedMsisdn" TEXT NOT NULL,
    "providerCode" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "used" BOOLEAN NOT NULL DEFAULT false,
    "usedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "RecipientToken_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "RecipientToken" ADD CONSTRAINT "RecipientToken_linkId_fkey" FOREIGN KEY ("linkId") REFERENCES "PaymentLink"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
