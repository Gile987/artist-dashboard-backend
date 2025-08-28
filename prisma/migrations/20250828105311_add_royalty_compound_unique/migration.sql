/*
  Warnings:

  - A unique constraint covering the columns `[trackId,period]` on the table `Royalty` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Royalty_trackId_period_key" ON "public"."Royalty"("trackId", "period");
