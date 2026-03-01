-- AlterTable
ALTER TABLE "DiaryEntry" ADD COLUMN "processed" BOOLEAN NOT NULL DEFAULT false;

-- Backfill: all existing entries were created through the app and have been AI-processed
UPDATE "DiaryEntry" SET "processed" = true;
