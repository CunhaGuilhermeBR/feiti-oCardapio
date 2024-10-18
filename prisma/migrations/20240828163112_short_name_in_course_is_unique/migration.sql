/*
  Warnings:

  - A unique constraint covering the columns `[shortName]` on the table `Course` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateTable
CREATE TABLE "Recommendation" (
    "courseName" TEXT NOT NULL,
    "interviewId" TEXT NOT NULL,

    CONSTRAINT "Recommendation_pkey" PRIMARY KEY ("interviewId","courseName")
);

-- CreateIndex
CREATE UNIQUE INDEX "Course_shortName_key" ON "Course"("shortName");

-- AddForeignKey
ALTER TABLE "Recommendation" ADD CONSTRAINT "Recommendation_courseName_fkey" FOREIGN KEY ("courseName") REFERENCES "Course"("name") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Recommendation" ADD CONSTRAINT "Recommendation_interviewId_fkey" FOREIGN KEY ("interviewId") REFERENCES "Interview"("id") ON DELETE CASCADE ON UPDATE CASCADE;
