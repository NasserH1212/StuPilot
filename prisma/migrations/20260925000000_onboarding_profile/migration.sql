-- Onboarding profile: locale, time zone, and optional university/major captured
-- during first-sign-in onboarding (Slice B — academic foundation). One row per
-- user; presence of "completed_at" gates whether onboarding has been finished.
CREATE TABLE "user_profiles" (
    "user_id" UUID NOT NULL,
    "locale" VARCHAR(8) NOT NULL,
    "time_zone" VARCHAR(64) NOT NULL,
    "university" VARCHAR(120),
    "major" VARCHAR(120),
    "completed_at" TIMESTAMPTZ(3),
    "version" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(3) NOT NULL,

    CONSTRAINT "user_profiles_pkey" PRIMARY KEY ("user_id"),
    CONSTRAINT "user_profiles_locale_supported" CHECK ("locale" IN ('ar', 'en')),
    CONSTRAINT "user_profiles_time_zone_not_blank" CHECK (length(btrim("time_zone")) > 0),
    CONSTRAINT "user_profiles_version_non_negative" CHECK ("version" >= 0),
    CONSTRAINT "user_profiles_user_id_fkey"
      FOREIGN KEY ("user_id") REFERENCES "users"("id")
      ON DELETE RESTRICT ON UPDATE CASCADE
);
