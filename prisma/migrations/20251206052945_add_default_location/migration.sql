-- AlterTable
ALTER TABLE "User" ADD COLUMN     "defaultLocationLat" DOUBLE PRECISION,
ADD COLUMN     "defaultLocationLng" DOUBLE PRECISION,
ADD COLUMN     "defaultLocationName" TEXT,
ADD COLUMN     "defaultLocationPlaceId" TEXT;
