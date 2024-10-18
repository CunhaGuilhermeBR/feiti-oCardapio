/*
  Warnings:

  - The values [VTEX] on the enum `ConfigPageType` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "ConfigPageType_new" AS ENUM ('INSTRUCTIONS', 'HOWITWORKS', 'PRESENTATION', 'ITEM', 'SPECKRESULT', 'INTERVIEW', 'SELECTQUESTIONNAIRE');
ALTER TABLE "ConfigurableItem" ALTER COLUMN "configPageType" DROP DEFAULT;
ALTER TABLE "ConfigurableItem" ALTER COLUMN "configPageType" TYPE "ConfigPageType_new" USING ("configPageType"::text::"ConfigPageType_new");
ALTER TYPE "ConfigPageType" RENAME TO "ConfigPageType_old";
ALTER TYPE "ConfigPageType_new" RENAME TO "ConfigPageType";
DROP TYPE "ConfigPageType_old";
ALTER TABLE "ConfigurableItem" ALTER COLUMN "configPageType" SET DEFAULT 'ITEM';
COMMIT;
