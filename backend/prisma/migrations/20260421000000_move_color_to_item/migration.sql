-- AlterTable: add color to Item with default, then make it required
ALTER TABLE "Item" ADD COLUMN "color" TEXT NOT NULL DEFAULT '#FFFFFF';

-- AlterTable: remove color from Section
ALTER TABLE "Section" DROP COLUMN "color";
