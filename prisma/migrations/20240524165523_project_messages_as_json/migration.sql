/*
  Warnings:

  - You are about to drop the `MessageParam` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `messages` to the `Project` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "MessageParam" DROP CONSTRAINT "MessageParam_projectId_fkey";

-- AlterTable
ALTER TABLE "Project" ADD COLUMN     "messages" JSONB NOT NULL;

-- DropTable
DROP TABLE "MessageParam";
