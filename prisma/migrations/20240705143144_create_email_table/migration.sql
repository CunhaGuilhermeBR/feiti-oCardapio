-- CreateTable
CREATE TABLE "ApplicationEmail" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "emailPassword" TEXT NOT NULL,
    "applicationId" INTEGER NOT NULL,

    CONSTRAINT "ApplicationEmail_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "ApplicationEmail" ADD CONSTRAINT "ApplicationEmail_applicationId_fkey" FOREIGN KEY ("applicationId") REFERENCES "Application"("id") ON DELETE CASCADE ON UPDATE CASCADE;
