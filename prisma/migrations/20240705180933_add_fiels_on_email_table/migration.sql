/*
  Warnings:

  - Added the required column `domain` to the `ApplicationEmail` table without a default value. This is not possible if the table is not empty.
  - Added the required column `host` to the `ApplicationEmail` table without a default value. This is not possible if the table is not empty.
  - Added the required column `port` to the `ApplicationEmail` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "ApplicationEmail" ADD COLUMN     "domain" TEXT NOT NULL,
ADD COLUMN     "host" TEXT NOT NULL,
ADD COLUMN     "port" INTEGER NOT NULL;
