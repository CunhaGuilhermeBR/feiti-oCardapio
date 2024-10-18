/*
  Warnings:

  - A unique constraint covering the columns `[applicationId]` on the table `ApplicationEmail` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "ApplicationEmail_applicationId_key" ON "ApplicationEmail"("applicationId");
