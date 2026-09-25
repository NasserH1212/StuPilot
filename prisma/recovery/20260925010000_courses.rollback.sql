-- MANUAL, DATA-DESTRUCTIVE RECOVERY REFERENCE ONLY.
-- Never run this against an unverified target or after real course data exists.
-- Prefer a reviewed forward-fix for any shared environment.
-- Drop in child-to-parent order: user_courses references courses.
DROP TABLE IF EXISTS "user_courses";
DROP TABLE IF EXISTS "courses";
