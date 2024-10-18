/*
  Warnings:

  - You are about to drop the column `saleId` on the `RecommendationCourse` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "RecommendationCourse" DROP CONSTRAINT "RecommendationCourse_saleId_fkey";

-- AlterTable
ALTER TABLE "RecommendationCourse" DROP COLUMN "saleId";
