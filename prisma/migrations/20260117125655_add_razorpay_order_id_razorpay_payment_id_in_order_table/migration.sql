/*
  Warnings:

  - A unique constraint covering the columns `[razorpayOrderId]` on the table `Order` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `razorpayOrderId` to the `Order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `razorpayPaymentId` to the `Order` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Order" ADD COLUMN     "razorpayOrderId" TEXT NOT NULL,
ADD COLUMN     "razorpayPaymentId" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Order_razorpayOrderId_key" ON "Order"("razorpayOrderId");
