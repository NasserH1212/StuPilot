-- Production application-owned identity foundation.
-- Provider subjects are authentication links only; all product ownership uses users.id.
CREATE TYPE "user_account_state" AS ENUM (
    'active',
    'disabled',
    'deletion_pending'
);

CREATE TABLE "users" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "state" "user_account_state" NOT NULL DEFAULT 'active',
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "auth_identities" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "user_id" UUID NOT NULL,
    "provider" VARCHAR(64) NOT NULL,
    "provider_subject" VARCHAR(255) NOT NULL,
    "verified_email_snapshot" VARCHAR(320),
    "email_verified_at" TIMESTAMPTZ(3) NOT NULL,
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(3) NOT NULL,

    CONSTRAINT "auth_identities_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "auth_identities_provider_not_blank" CHECK (length(btrim("provider")) > 0),
    CONSTRAINT "auth_identities_provider_subject_not_blank" CHECK (length(btrim("provider_subject")) > 0),
    CONSTRAINT "auth_identities_user_id_fkey"
      FOREIGN KEY ("user_id") REFERENCES "users"("id")
      ON DELETE RESTRICT ON UPDATE CASCADE
);

CREATE UNIQUE INDEX "auth_identities_provider_subject_key"
ON "auth_identities"("provider", "provider_subject");

CREATE INDEX "auth_identities_user_id_idx" ON "auth_identities"("user_id");
