/*
  Warnings:

  - You are about to drop the column `score` on the `RecommendationCourse` table. All the data in the column will be lost.
  - You are about to drop the column `speckResultId` on the `SpeckResult` table. All the data in the column will be lost.
  - Added the required column `configSpeckResultId` to the `SpeckResult` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "SpeckResult" DROP CONSTRAINT "SpeckResult_speckResultId_fkey";

-- AlterTable
ALTER TABLE "RecommendationCourse" DROP COLUMN "score";

-- AlterTable
ALTER TABLE "SpeckResult" DROP COLUMN "speckResultId",
ADD COLUMN     "configSpeckResultId" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "SpeckResult" ADD CONSTRAINT "SpeckResult_configSpeckResultId_fkey" FOREIGN KEY ("configSpeckResultId") REFERENCES "ConfigSpeckResult"("id") ON DELETE CASCADE ON UPDATE CASCADE;
