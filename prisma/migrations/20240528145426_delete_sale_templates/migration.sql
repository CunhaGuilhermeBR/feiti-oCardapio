/*
  Warnings:

  - You are about to drop the `SaleTemplates` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Sale" DROP CONSTRAINT "Sale_interviewId_fkey";

-- DropForeignKey
ALTER TABLE "SaleTemplates" DROP CONSTRAINT "SaleTemplates_interviewId_fkey";

-- DropForeignKey
ALTER TABLE "SaleTemplates" DROP CONSTRAINT "SaleTemplates_saleId_fkey";

-- DropForeignKey
ALTER TABLE "SaleTemplates" DROP CONSTRAINT "SaleTemplates_templateId_fkey";

-- DropTable
DROP TABLE "SaleTemplates";

-- AddForeignKey
ALTER TABLE "Interview" ADD CONSTRAINT "Interview_saleId_fkey" FOREIGN KEY ("saleId") REFERENCES "Sale"("id") ON DELETE CASCADE ON UPDATE CASCADE;
