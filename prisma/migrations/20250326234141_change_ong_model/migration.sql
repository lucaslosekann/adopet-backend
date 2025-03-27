/*
  Warnings:

  - You are about to drop the column `name` on the `Ong` table. All the data in the column will be lost.
  - You are about to drop the column `whatsapp` on the `Ong` table. All the data in the column will be lost.
  - Added the required column `cnpj` to the `Ong` table without a default value. This is not possible if the table is not empty.
  - Added the required column `phone` to the `Ong` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Ong" DROP COLUMN "name",
DROP COLUMN "whatsapp",
ADD COLUMN     "cnpj" TEXT NOT NULL,
ADD COLUMN     "phone" TEXT NOT NULL;
