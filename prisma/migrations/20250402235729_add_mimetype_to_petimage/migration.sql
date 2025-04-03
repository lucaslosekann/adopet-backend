/*
  Warnings:

  - Added the required column `mimeType` to the `PetImage` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "PetImage" ADD COLUMN     "mimeType" TEXT NOT NULL;
