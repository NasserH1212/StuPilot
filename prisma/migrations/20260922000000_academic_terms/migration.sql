-- Academic terms: user-owned academic periods (Slice B — academic foundation).
-- Ownership uses users.id; a composite (id, user_id) key supports future child FKs.
CREATE TABLE "academic_terms" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "user_id" UUID NOT NULL,
    "name" VARCHAR(120) NOT NULL,
    "starts_on" DATE NOT NULL,
    "ends_on" DATE NOT NULL,
    "time_zone" VARCHAR(64) NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT false,
    "archived_at" TIMESTAMPTZ(3),
    "version" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(3) NOT NULL,

    CONSTRAINT "academic_terms_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "academic_terms_name_not_blank" CHECK (length(btrim("name")) > 0),
    CONSTRAINT "academic_terms_time_zone_not_blank" CHECK (length(btrim("time_zone")) > 0),
    CONSTRAINT "academic_terms_date_order" CHECK ("ends_on" >= "starts_on"),
    CONSTRAINT "academic_terms_version_non_negative" CHECK ("version" >= 0),
    CONSTRAINT "academic_terms_user_id_fkey"
      FOREIGN KEY ("user_id") REFERENCES "users"("id")
      ON DELETE RESTRICT ON UPDATE CASCADE
);

CREATE UNIQUE INDEX "academic_terms_id_user_id_key"
ON "academic_terms"("id", "user_id");

CREATE INDEX "academic_terms_user_id_idx"
ON "academic_terms"("user_id", "archived_at", "starts_on", "ends_on");

-- At most one active, non-archived term per user (domain invariant §4.4).
CREATE UNIQUE INDEX "academic_terms_one_active_per_user"
ON "academic_terms"("user_id")
WHERE "is_active" AND "archived_at" IS NULL;
