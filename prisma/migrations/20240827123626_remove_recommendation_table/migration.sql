/*
  Warnings:

  - You are about to drop the `RecommendationCourse` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "RecommendationCourse" DROP CONSTRAINT "RecommendationCourse_courseName_fkey";

-- DropForeignKey
ALTER TABLE "RecommendationCourse" DROP CONSTRAINT "RecommendationCourse_speckResultId_fkey";

-- DropTable
DROP TABLE "RecommendationCourse";
