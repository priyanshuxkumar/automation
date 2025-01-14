/*
  Warnings:

  - Added the required column `triggerId` to the `Workflow` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Workflow" ADD COLUMN     "triggerId" TEXT NOT NULL;
