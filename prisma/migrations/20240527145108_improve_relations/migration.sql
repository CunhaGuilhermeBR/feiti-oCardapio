/*
  Warnings:

  - You are about to drop the column `appId` on the `ConfigMoodle` table. All the data in the column will be lost.
  - You are about to drop the column `speckResultId` on the `ConfigSpeckResult` table. All the data in the column will be lost.
  - You are about to drop the column `saleId` on the `Interview` table. All the data in the column will be lost.
  - The primary key for the `InterviewAnswer` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `InterviewAnswer` table. All the data in the column will be lost.
  - The primary key for the `InterviewQuestion` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `InterviewQuestion` table. All the data in the column will be lost.
  - The primary key for the `SaleTemplates` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - Added the required column `itemId` to the `ConfigQuestion` table without a default value. This is not possible if the table is not empty.
  - Added the required column `interviewId` to the `SaleTemplates` table without a default value. This is not possible if the table is not empty.
  - Added the required column `speckResultId` to the `SpeckResult` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "ConfigMoodle" DROP CONSTRAINT "ConfigMoodle_appId_fkey";

-- DropForeignKey
ALTER TABLE "ConfigSpeckResult" DROP CONSTRAINT "ConfigSpeckResult_speckResultId_fkey";

-- DropForeignKey
ALTER TABLE "Interview" DROP CONSTRAINT "Interview_saleId_fkey";

-- DropForeignKey
ALTER TABLE "Interview" DROP CONSTRAINT "Interview_templateId_fkey";

-- DropIndex
DROP INDEX "Interview_saleId_key";

-- AlterTable
ALTER TABLE "ConfigMoodle" DROP COLUMN "appId";

-- AlterTable
ALTER TABLE "ConfigQuestion" ADD COLUMN     "itemId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "ConfigSpeckResult" DROP COLUMN "speckResultId";

-- AlterTable
ALTER TABLE "Interview" DROP COLUMN "saleId",
ALTER COLUMN "templateId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "InterviewAnswer" DROP CONSTRAINT "InterviewAnswer_pkey",
DROP COLUMN "id",
ADD CONSTRAINT "InterviewAnswer_pkey" PRIMARY KEY ("interviewId", "index");

-- AlterTable
ALTER TABLE "InterviewQuestion" DROP CONSTRAINT "InterviewQuestion_pkey",
DROP COLUMN "id",
ADD CONSTRAINT "InterviewQuestion_pkey" PRIMARY KEY ("questionnaireId", "index");

-- AlterTable
ALTER TABLE "Sale" ADD COLUMN     "interviewId" INTEGER;

-- AlterTable
ALTER TABLE "SaleTemplates" DROP CONSTRAINT "SaleTemplates_pkey",
ADD COLUMN     "interviewId" INTEGER NOT NULL,
ADD CONSTRAINT "SaleTemplates_pkey" PRIMARY KEY ("saleId", "templateId", "interviewId");

-- AlterTable
ALTER TABLE "SpeckResult" ADD COLUMN     "speckResultId" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "Sale" ADD CONSTRAINT "Sale_interviewId_fkey" FOREIGN KEY ("interviewId") REFERENCES "Interview"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SaleTemplates" ADD CONSTRAINT "SaleTemplates_interviewId_fkey" FOREIGN KEY ("interviewId") REFERENCES "Interview"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Interview" ADD CONSTRAINT "Interview_templateId_fkey" FOREIGN KEY ("templateId") REFERENCES "Template"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SpeckResult" ADD CONSTRAINT "SpeckResult_speckResultId_fkey" FOREIGN KEY ("speckResultId") REFERENCES "ConfigSpeckResult"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ConfigQuestion" ADD CONSTRAINT "ConfigQuestion_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "ConfigurableItem"("id") ON DELETE CASCADE ON UPDATE CASCADE;
