-- CreateTable
CREATE TABLE "Pet" (
    "id" TEXT NOT NULL,
    "formerName" TEXT NOT NULL,
    "dateOfBirth" INTEGER NOT NULL,
    "weight" DOUBLE PRECISION NOT NULL,
    "species" TEXT NOT NULL,
    "breed" TEXT NOT NULL,
    "castrated" BOOLEAN NOT NULL,
    "ongId" TEXT NOT NULL,
    "available" BOOLEAN NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Pet_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Pet" ADD CONSTRAINT "Pet_ongId_fkey" FOREIGN KEY ("ongId") REFERENCES "Ong"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
