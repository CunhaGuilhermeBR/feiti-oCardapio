/*
  Warnings:

  - You are about to drop the column `degree` on the `RecommendationCourse` table. All the data in the column will be lost.
  - Added the required column `speckResultId` to the `RecommendationCourse` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "RecommendationCourse" DROP CONSTRAINT "RecommendationCourse_saleId_fkey";

-- AlterTable
ALTER TABLE "RecommendationCourse" DROP COLUMN "degree",
ADD COLUMN     "speckResultId" INTEGER NOT NULL,
ALTER COLUMN "saleId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "RecommendationCourse" ADD CONSTRAINT "RecommendationCourse_speckResultId_fkey" FOREIGN KEY ("speckResultId") REFERENCES "SpeckResult"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RecommendationCourse" ADD CONSTRAINT "RecommendationCourse_saleId_fkey" FOREIGN KEY ("saleId") REFERENCES "Sale"("id") ON DELETE SET NULL ON UPDATE CASCADE;
