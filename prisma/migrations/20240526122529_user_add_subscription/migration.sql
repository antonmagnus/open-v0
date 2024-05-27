-- AlterTable
ALTER TABLE "User" ADD COLUMN     "subscription" TEXT NOT NULL DEFAULT 'free',
ADD COLUMN     "tokens" INTEGER NOT NULL DEFAULT 100;
