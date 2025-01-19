/*
  Warnings:

  - Added the required column `status` to the `Workflow` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "WorkflowStatus" AS ENUM ('On', 'Off');

-- DropIndex
DROP INDEX "Workflow_name_userId_key";

-- AlterTable
ALTER TABLE "Workflow" ADD COLUMN     "status" "WorkflowStatus" NOT NULL;
