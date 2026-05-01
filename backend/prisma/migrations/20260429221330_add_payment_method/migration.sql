/*
  Warnings:

  - Added the required column `paymentMethod` to the `Command` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "PaymentMethod" AS ENUM ('cash', 'card');

-- AlterTable
ALTER TABLE "Command" ADD COLUMN "paymentMethod" "PaymentMethod" NOT NULL DEFAULT 'cash';
ALTER TABLE "Command" ALTER COLUMN "paymentMethod" DROP DEFAULT;

-- AlterTable
ALTER TABLE "Item" ALTER COLUMN "color" DROP DEFAULT;
