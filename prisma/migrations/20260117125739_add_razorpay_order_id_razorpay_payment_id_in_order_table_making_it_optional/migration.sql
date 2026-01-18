-- AlterTable
ALTER TABLE "Order" ALTER COLUMN "razorpayOrderId" DROP NOT NULL,
ALTER COLUMN "razorpayPaymentId" DROP NOT NULL;
