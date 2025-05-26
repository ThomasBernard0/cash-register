/*
  Warnings:

  - You are about to alter the column `priceInCent` on the `CommandItem` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Integer`.
  - You are about to alter the column `priceInCent` on the `Item` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Integer`.

*/
-- AlterTable
ALTER TABLE "CommandItem" ALTER COLUMN "priceInCent" SET DATA TYPE INTEGER;

-- AlterTable
ALTER TABLE "Item" ALTER COLUMN "priceInCent" SET DATA TYPE INTEGER;
