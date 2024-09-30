/*
  Warnings:

  - You are about to drop the column `billingCity` on the `Order` table. All the data in the column will be lost.
  - You are about to drop the column `billingCountry` on the `Order` table. All the data in the column will be lost.
  - You are about to drop the column `billingName` on the `Order` table. All the data in the column will be lost.
  - You are about to drop the column `billingPostalCode` on the `Order` table. All the data in the column will be lost.
  - You are about to drop the column `billingState` on the `Order` table. All the data in the column will be lost.
  - You are about to drop the column `billingStreet` on the `Order` table. All the data in the column will be lost.
  - You are about to drop the column `shippingCity` on the `Order` table. All the data in the column will be lost.
  - You are about to drop the column `shippingCountry` on the `Order` table. All the data in the column will be lost.
  - You are about to drop the column `shippingName` on the `Order` table. All the data in the column will be lost.
  - You are about to drop the column `shippingPostalCode` on the `Order` table. All the data in the column will be lost.
  - You are about to drop the column `shippingState` on the `Order` table. All the data in the column will be lost.
  - You are about to drop the column `shippingStreet` on the `Order` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Order" DROP COLUMN "billingCity",
DROP COLUMN "billingCountry",
DROP COLUMN "billingName",
DROP COLUMN "billingPostalCode",
DROP COLUMN "billingState",
DROP COLUMN "billingStreet",
DROP COLUMN "shippingCity",
DROP COLUMN "shippingCountry",
DROP COLUMN "shippingName",
DROP COLUMN "shippingPostalCode",
DROP COLUMN "shippingState",
DROP COLUMN "shippingStreet",
ADD COLUMN     "billingAddressId" TEXT,
ADD COLUMN     "shippingAddressId" TEXT;

-- CreateTable
CREATE TABLE "ShippingAddress" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "street" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "postalCode" TEXT NOT NULL,
    "country" TEXT NOT NULL,

    CONSTRAINT "ShippingAddress_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BillingAddress" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "street" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "postalCode" TEXT NOT NULL,
    "country" TEXT NOT NULL,

    CONSTRAINT "BillingAddress_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_shippingAddressId_fkey" FOREIGN KEY ("shippingAddressId") REFERENCES "ShippingAddress"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_billingAddressId_fkey" FOREIGN KEY ("billingAddressId") REFERENCES "BillingAddress"("id") ON DELETE SET NULL ON UPDATE CASCADE;
