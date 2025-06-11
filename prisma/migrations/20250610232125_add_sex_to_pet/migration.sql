/*
  Warnings:

  - Added the required column `sex` to the `Pet` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "PetSex" AS ENUM ('MALE', 'FEMALE');

-- AlterTable
ALTER TABLE "Pet" ADD COLUMN     "sex" "PetSex" NOT NULL;
