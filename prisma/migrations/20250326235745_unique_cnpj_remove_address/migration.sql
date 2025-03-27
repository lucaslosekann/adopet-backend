/*
  Warnings:

  - You are about to drop the column `addressId` on the `Ong` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[cnpj]` on the table `Ong` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "Ong" DROP CONSTRAINT "Ong_addressId_fkey";

-- AlterTable
ALTER TABLE "Ong" DROP COLUMN "addressId";

-- CreateIndex
CREATE UNIQUE INDEX "Ong_cnpj_key" ON "Ong"("cnpj");
