/*
  Warnings:

  - Added the required column `saleId` to the `Interview` table without a default value. This is not possible if the table is not empty.
  - Made the column `templateId` on table `Interview` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "Interview" DROP CONSTRAINT "Interview_templateId_fkey";

-- AlterTable
ALTER TABLE "Interview" ADD COLUMN     "saleId" TEXT NOT NULL,
ALTER COLUMN "templateId" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "Interview" ADD CONSTRAINT "Interview_templateId_fkey" FOREIGN KEY ("templateId") REFERENCES "Template"("id") ON DELETE CASCADE ON UPDATE CASCADE;
