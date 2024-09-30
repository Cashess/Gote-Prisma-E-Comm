/*
  Warnings:

  - You are about to drop the `cartitems` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `carts` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "cartitems" DROP CONSTRAINT "cartitems_cartId_fkey";

-- DropForeignKey
ALTER TABLE "cartitems" DROP CONSTRAINT "cartitems_productId_fkey";

-- DropForeignKey
ALTER TABLE "carts" DROP CONSTRAINT "carts_userId_fkey";

-- DropTable
DROP TABLE "cartitems";

-- DropTable
DROP TABLE "carts";
