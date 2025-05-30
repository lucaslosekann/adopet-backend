/*
  Warnings:

  - You are about to drop the column `specieName` on the `Pet` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Pet" DROP CONSTRAINT "Pet_specieName_fkey";

-- AlterTable
ALTER TABLE "Pet" DROP COLUMN "specieName";
