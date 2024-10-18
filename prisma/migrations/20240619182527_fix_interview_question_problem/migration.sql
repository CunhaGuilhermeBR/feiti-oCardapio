/*
  Warnings:

  - The primary key for the `Interview` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `configInterviewId` on the `Interview` table. All the data in the column will be lost.
  - The primary key for the `InterviewAnswer` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the `ConfigInterview` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ConfigInterviewQuestion` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "ConfigInterview" DROP CONSTRAINT "ConfigInterview_itemId_fkey";

-- DropForeignKey
ALTER TABLE "ConfigInterviewQuestion" DROP CONSTRAINT "ConfigInterviewQuestion_itemId_fkey";

-- DropForeignKey
ALTER TABLE "Interview" DROP CONSTRAINT "Interview_configInterviewId_fkey";

-- DropForeignKey
ALTER TABLE "InterviewAnswer" DROP CONSTRAINT "InterviewAnswer_interviewId_fkey";

-- DropForeignKey
ALTER TABLE "SpeckResult" DROP CONSTRAINT "SpeckResult_interviewId_fkey";

-- AlterTable
ALTER TABLE "ConfigQuestion" ADD COLUMN     "maxlength" INTEGER NOT NULL DEFAULT 1000,
ADD COLUMN     "minlength" INTEGER NOT NULL DEFAULT 28;

-- AlterTable
ALTER TABLE "Interview" DROP CONSTRAINT "Interview_pkey",
DROP COLUMN "configInterviewId",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "Interview_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "Interview_id_seq";

-- AlterTable
ALTER TABLE "InterviewAnswer" DROP CONSTRAINT "InterviewAnswer_pkey",
ALTER COLUMN "interviewId" SET DATA TYPE TEXT,
ADD CONSTRAINT "InterviewAnswer_pkey" PRIMARY KEY ("interviewId", "index");

-- AlterTable
ALTER TABLE "SpeckResult" ALTER COLUMN "interviewId" SET DATA TYPE TEXT;

-- DropTable
DROP TABLE "ConfigInterview";

-- DropTable
DROP TABLE "ConfigInterviewQuestion";

-- AddForeignKey
ALTER TABLE "InterviewAnswer" ADD CONSTRAINT "InterviewAnswer_interviewId_fkey" FOREIGN KEY ("interviewId") REFERENCES "Interview"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SpeckResult" ADD CONSTRAINT "SpeckResult_interviewId_fkey" FOREIGN KEY ("interviewId") REFERENCES "Interview"("id") ON DELETE CASCADE ON UPDATE CASCADE;
