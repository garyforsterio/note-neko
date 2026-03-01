-- AlterTable
ALTER TABLE "DiaryEntry" ADD COLUMN     "reviewed" BOOLEAN NOT NULL DEFAULT false;

-- Mark all existing entries as reviewed
UPDATE "DiaryEntry" SET "reviewed" = true;
