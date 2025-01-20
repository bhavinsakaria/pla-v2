-- CreateTable
CREATE TABLE "Dispatch" (
    "id" TEXT NOT NULL,
    "challanNo" TEXT NOT NULL,
    "challanDate" TIMESTAMP(3) NOT NULL,
    "partyCode" TEXT,
    "partyName" TEXT NOT NULL,
    "partyPlace" TEXT NOT NULL,
    "orderAmt" DOUBLE PRECISION NOT NULL,
    "transportName" TEXT,
    "lrNo" TEXT,
    "lrDate" TIMESTAMP(3),
    "numberofCases" INTEGER,
    "salesRep" TEXT,
    "invoiceNo" TEXT,
    "invoiceDate" TIMESTAMP(3),
    "packingTime" TIMESTAMP(3),
    "overStatus" TEXT,
    "remarks" TEXT,
    "tags" JSONB,
    "totalItems" INTEGER,
    "totalQty" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Dispatch_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'user',
    "authProviderId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Dispatch_challanNo_key" ON "Dispatch"("challanNo");

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");
