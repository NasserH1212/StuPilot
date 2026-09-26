-- MANUAL, DATA-DESTRUCTIVE RECOVERY REFERENCE ONLY.
-- Never run this against an unverified target or after real schedule data exists.
-- Prefer a reviewed forward-fix for any shared environment.
DROP TABLE IF EXISTS "recurring_class_series";
DROP TYPE IF EXISTS "class_meeting_type";
