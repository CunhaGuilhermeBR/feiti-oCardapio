/*
  Warnings:

  - You are about to drop the column `speckTemplateId` on the `ConfigSpeckResult` table. All the data in the column will be lost.
  - Added the required column `speckOrigin` to the `ConfigSpeckResult` table without a default value. This is not possible if the table is not empty.
  - Added the required column `speckUrl` to the `ConfigSpeckResult` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "ConfigSpeckResult" DROP CONSTRAINT "ConfigSpeckResult_speckTemplateId_fkey";

-- AlterTable
ALTER TABLE "ConfigSpeckResult" DROP COLUMN "speckTemplateId",
ADD COLUMN     "speckOrigin" TEXT NOT NULL,
ADD COLUMN     "speckUrl" TEXT NOT NULL;
