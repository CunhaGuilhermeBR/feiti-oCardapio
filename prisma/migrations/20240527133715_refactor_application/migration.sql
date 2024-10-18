-- DropForeignKey
ALTER TABLE "SaleTemplates" DROP CONSTRAINT "SaleTemplates_saleId_fkey";

-- DropForeignKey
ALTER TABLE "SaleTemplates" DROP CONSTRAINT "SaleTemplates_templateId_fkey";

-- AddForeignKey
ALTER TABLE "SaleTemplates" ADD CONSTRAINT "SaleTemplates_saleId_fkey" FOREIGN KEY ("saleId") REFERENCES "Sale"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SaleTemplates" ADD CONSTRAINT "SaleTemplates_templateId_fkey" FOREIGN KEY ("templateId") REFERENCES "Template"("id") ON DELETE CASCADE ON UPDATE CASCADE;
