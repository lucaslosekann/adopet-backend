/*
  Warnings:

  - Added the required column `expenseRange` to the `Pet` table without a default value. This is not possible if the table is not empty.
  - Added the required column `isActive` to the `Pet` table without a default value. This is not possible if the table is not empty.
  - Added the required column `isGoodWithKids` to the `Pet` table without a default value. This is not possible if the table is not empty.
  - Added the required column `size` to the `Pet` table without a default value. This is not possible if the table is not empty.
  - Added the required column `expenseRange` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `isActive` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `isGoodWithKids` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `size` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Pet" ADD COLUMN     "expenseRange" TEXT NOT NULL,
ADD COLUMN     "isActive" BOOLEAN NOT NULL,
ADD COLUMN     "isGoodWithKids" BOOLEAN NOT NULL,
ADD COLUMN     "size" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "expenseRange" TEXT NOT NULL,
ADD COLUMN     "isActive" BOOLEAN NOT NULL,
ADD COLUMN     "isGoodWithKids" BOOLEAN NOT NULL,
ADD COLUMN     "size" TEXT NOT NULL;
