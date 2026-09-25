-- MANUAL, DATA-DESTRUCTIVE RECOVERY REFERENCE ONLY.
-- Never run this against an unverified target or after real onboarding data exists.
-- Prefer a reviewed forward-fix for any shared environment.
ALTER TABLE "user_profiles" DROP CONSTRAINT IF EXISTS "user_profiles_university_id_fkey";
ALTER TABLE "user_profiles" DROP COLUMN IF EXISTS "university_id";
DROP TABLE IF EXISTS "universities";
