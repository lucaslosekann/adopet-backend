/*
  Warnings:

  - A unique constraint covering the columns `[pixKey]` on the table `Ong` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `pixKey` to the `Ong` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Ong" ADD COLUMN     "pixKey" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Ong_pixKey_key" ON "Ong"("pixKey");
