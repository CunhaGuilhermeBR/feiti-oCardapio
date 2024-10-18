/*
  Warnings:

  - You are about to drop the column `customerName` on the `Interview` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Interview" DROP COLUMN "customerName";

-- AlterTable
ALTER TABLE "Sale" ADD COLUMN     "customerEmail" TEXT NOT NULL DEFAULT 'john.doe@email.com',
ADD COLUMN     "customerName" TEXT NOT NULL DEFAULT 'John Doe';
