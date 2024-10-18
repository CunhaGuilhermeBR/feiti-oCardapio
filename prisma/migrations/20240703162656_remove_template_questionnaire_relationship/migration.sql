/*
  Warnings:

  - You are about to drop the column `interviewQuestionnaireId` on the `Template` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Template" DROP CONSTRAINT "Template_interviewQuestionnaireId_fkey";

-- AlterTable
ALTER TABLE "Template" DROP COLUMN "interviewQuestionnaireId";
