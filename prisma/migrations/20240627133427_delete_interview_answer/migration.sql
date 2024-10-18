/*
  Warnings:

  - You are about to drop the `InterviewAnswer` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "InterviewAnswer" DROP CONSTRAINT "InterviewAnswer_interviewId_fkey";

-- DropTable
DROP TABLE "InterviewAnswer";
