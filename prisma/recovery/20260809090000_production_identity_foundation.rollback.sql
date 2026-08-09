-- MANUAL, DATA-DESTRUCTIVE RECOVERY REFERENCE ONLY.
-- Never run this against an unverified target or after user/product data exists.
-- Prefer a reviewed forward-fix for any shared environment.
DROP TABLE IF EXISTS "auth_identities";
DROP TABLE IF EXISTS "users";
DROP TYPE IF EXISTS "user_account_state";
