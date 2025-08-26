-- Update existing releases' streams field to match the sum of their tracks' streams
UPDATE "Release" 
SET streams = (
  SELECT COALESCE(SUM("Track".streams), 0)
  FROM "Track"
  WHERE "Track"."releaseId" = "Release".id
);
