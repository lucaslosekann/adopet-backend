-- DropForeignKey
ALTER TABLE "Ong" DROP CONSTRAINT "Ong_addressId_fkey";

-- AlterTable
ALTER TABLE "Ong" ALTER COLUMN "addressId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Ong" ADD CONSTRAINT "Ong_addressId_fkey" FOREIGN KEY ("addressId") REFERENCES "Address"("id") ON DELETE SET NULL ON UPDATE CASCADE;
