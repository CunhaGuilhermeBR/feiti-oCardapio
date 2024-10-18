/*
  Warnings:

  - The primary key for the `MoodleSubmission` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `moodleTaskCourse` on the `MoodleSubmission` table. All the data in the column will be lost.
  - You are about to drop the column `moodleTaskName` on the `MoodleSubmission` table. All the data in the column will be lost.
  - The primary key for the `MoodleTask` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - A unique constraint covering the columns `[saleId,moodleTaskId]` on the table `MoodleSubmission` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `moodleTaskId` to the `MoodleSubmission` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "MoodleSubmission" DROP CONSTRAINT "MoodleSubmission_moodleTaskName_moodleTaskCourse_fkey";

-- AlterTable
ALTER TABLE "MoodleSubmission" DROP CONSTRAINT "MoodleSubmission_pkey",
DROP COLUMN "moodleTaskCourse",
DROP COLUMN "moodleTaskName",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD COLUMN     "moodleTaskId" INTEGER NOT NULL,
ADD CONSTRAINT "MoodleSubmission_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "MoodleTask" DROP CONSTRAINT "MoodleTask_pkey",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "MoodleTask_pkey" PRIMARY KEY ("id");

-- CreateIndex
CREATE UNIQUE INDEX "MoodleSubmission_saleId_moodleTaskId_key" ON "MoodleSubmission"("saleId", "moodleTaskId");

-- AddForeignKey
ALTER TABLE "MoodleSubmission" ADD CONSTRAINT "MoodleSubmission_moodleTaskId_fkey" FOREIGN KEY ("moodleTaskId") REFERENCES "MoodleTask"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
