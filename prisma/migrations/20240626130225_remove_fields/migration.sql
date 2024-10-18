/*
  Warnings:

  - You are about to drop the column `essayId` on the `SpeckResult` table. All the data in the column will be lost.

*/
-- AlterEnum
ALTER TYPE "ConfigPageType" ADD VALUE 'INTERVIEW';

-- AlterTable
ALTER TABLE "SpeckResult" DROP COLUMN "essayId";
