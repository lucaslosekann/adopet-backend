/*
  Warnings:

  - You are about to drop the column `speciesName` on the `Pet` table. All the data in the column will be lost.
  - Added the required column `specieName` to the `Breed` table without a default value. This is not possible if the table is not empty.
  - Added the required column `about` to the `Ong` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Pet" DROP CONSTRAINT "Pet_speciesName_fkey";

-- AlterTable
ALTER TABLE "Breed" ADD COLUMN     "specieName" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Ong" ADD COLUMN     "about" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Pet" DROP COLUMN "speciesName",
ADD COLUMN     "specieName" TEXT;

-- AddForeignKey
ALTER TABLE "Pet" ADD CONSTRAINT "Pet_specieName_fkey" FOREIGN KEY ("specieName") REFERENCES "Specie"("name") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Breed" ADD CONSTRAINT "Breed_specieName_fkey" FOREIGN KEY ("specieName") REFERENCES "Specie"("name") ON DELETE RESTRICT ON UPDATE CASCADE;
