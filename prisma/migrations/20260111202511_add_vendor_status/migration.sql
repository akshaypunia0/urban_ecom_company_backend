/*
  Warnings:

  - You are about to drop the column `approved` on the `Vendor` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "VendorStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED');

-- AlterTable
ALTER TABLE "Vendor" DROP COLUMN "approved",
ADD COLUMN     "status" "VendorStatus" NOT NULL DEFAULT 'PENDING';
