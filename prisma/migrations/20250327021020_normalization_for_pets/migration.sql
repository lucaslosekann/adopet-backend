/*
  Warnings:

  - You are about to drop the column `breed` on the `Pet` table. All the data in the column will be lost.
  - You are about to drop the column `species` on the `Pet` table. All the data in the column will be lost.
  - Added the required column `breedName` to the `Pet` table without a default value. This is not possible if the table is not empty.
  - Added the required column `speciesName` to the `Pet` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Pet" DROP COLUMN "breed",
DROP COLUMN "species",
ADD COLUMN     "breedName" TEXT NOT NULL,
ADD COLUMN     "speciesName" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "Specie" (
    "name" TEXT NOT NULL,

    CONSTRAINT "Specie_pkey" PRIMARY KEY ("name")
);

-- CreateTable
CREATE TABLE "Breed" (
    "name" TEXT NOT NULL,

    CONSTRAINT "Breed_pkey" PRIMARY KEY ("name")
);

-- AddForeignKey
ALTER TABLE "Pet" ADD CONSTRAINT "Pet_speciesName_fkey" FOREIGN KEY ("speciesName") REFERENCES "Specie"("name") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Pet" ADD CONSTRAINT "Pet_breedName_fkey" FOREIGN KEY ("breedName") REFERENCES "Breed"("name") ON DELETE RESTRICT ON UPDATE CASCADE;
