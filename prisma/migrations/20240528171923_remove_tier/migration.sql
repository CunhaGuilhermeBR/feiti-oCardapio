/*
  Warnings:

  - You are about to drop the `Tier` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `goodFeature` to the `Course` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Tier" DROP CONSTRAINT "Tier_courseName_fkey";

-- AlterTable
ALTER TABLE "Course" ADD COLUMN     "goodFeature" BOOLEAN NOT NULL;

-- DropTable
DROP TABLE "Tier";
