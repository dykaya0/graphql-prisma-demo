/*
  Warnings:

  - You are about to drop the `Tweet` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."Tweet" DROP CONSTRAINT "Tweet_userId_fkey";

-- DropTable
DROP TABLE "public"."Tweet";
