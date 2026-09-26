-- MANUAL, DATA-DESTRUCTIVE RECOVERY REFERENCE ONLY.
-- Never run this against an unverified target or after real calendar data exists.
-- Prefer a reviewed forward-fix for any shared environment.
DELETE FROM "university_breaks"
WHERE "university_id" = (SELECT "id" FROM "universities" WHERE "name_en" = 'University of Hail')
  AND "academic_year" = 1448;

DELETE FROM "university_terms"
WHERE "university_id" = (SELECT "id" FROM "universities" WHERE "name_en" = 'University of Hail')
  AND "academic_year" = 1448;

DROP TABLE IF EXISTS "university_breaks";

-- Only safe if no other university_terms row relies on a NULL ends_on.
ALTER TABLE "university_terms" ALTER COLUMN "ends_on" SET NOT NULL;
