-- CreateEnum
CREATE TYPE "AdoptionStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED');

-- CreateTable
CREATE TABLE "Adoption" (
    "id" TEXT NOT NULL,
    "petId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "status" "AdoptionStatus" NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Adoption_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AdoptionRequestSubmission" (
    "id" TEXT NOT NULL,
    "idCard" BYTEA NOT NULL,
    "profOfResidence" BYTEA NOT NULL,
    "adoptionId" TEXT NOT NULL,
    "hadPetsBefore" BOOLEAN NOT NULL,
    "hasOtherPets" BOOLEAN NOT NULL,
    "houseType" TEXT NOT NULL,
    "hasFinancialConditions" BOOLEAN NOT NULL,
    "isPreparedForLongTerm" BOOLEAN NOT NULL,
    "whatWillDoIfProblemsArise" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AdoptionRequestSubmission_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Adoption_petId_userId_key" ON "Adoption"("petId", "userId");

-- AddForeignKey
ALTER TABLE "Adoption" ADD CONSTRAINT "Adoption_petId_fkey" FOREIGN KEY ("petId") REFERENCES "Pet"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Adoption" ADD CONSTRAINT "Adoption_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AdoptionRequestSubmission" ADD CONSTRAINT "AdoptionRequestSubmission_adoptionId_fkey" FOREIGN KEY ("adoptionId") REFERENCES "Adoption"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
