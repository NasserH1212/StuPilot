-- Courses (Slice B — academic foundation).
-- "courses" is a reusable, user-owned course identity. "user_courses" attaches
-- one course to one term for one user (an enrollment). Archiving a
-- user_courses row hides the course from that term's default lists without
-- touching the reusable course identity or historical items/schedule
-- records in other terms.
CREATE TABLE "courses" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "user_id" UUID NOT NULL,
    "name" VARCHAR(120) NOT NULL,
    "code" VARCHAR(32),
    "color_token" VARCHAR(32),
    "default_location" VARCHAR(120),
    "archived_at" TIMESTAMPTZ(3),
    "version" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(3) NOT NULL,

    CONSTRAINT "courses_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "courses_name_not_blank" CHECK (length(btrim("name")) > 0),
    CONSTRAINT "courses_version_non_negative" CHECK ("version" >= 0),
    CONSTRAINT "courses_user_id_fkey"
      FOREIGN KEY ("user_id") REFERENCES "users"("id")
      ON DELETE RESTRICT ON UPDATE CASCADE
);

CREATE UNIQUE INDEX "courses_id_user_id_key"
ON "courses"("id", "user_id");

CREATE INDEX "courses_user_id_idx"
ON "courses"("user_id", "archived_at");

CREATE TABLE "user_courses" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "user_id" UUID NOT NULL,
    "term_id" UUID NOT NULL,
    "course_id" UUID NOT NULL,
    "archived_at" TIMESTAMPTZ(3),
    "version" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(3) NOT NULL,

    CONSTRAINT "user_courses_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "user_courses_version_non_negative" CHECK ("version" >= 0),
    CONSTRAINT "user_courses_user_id_fkey"
      FOREIGN KEY ("user_id") REFERENCES "users"("id")
      ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "user_courses_term_id_user_id_fkey"
      FOREIGN KEY ("term_id", "user_id") REFERENCES "academic_terms"("id", "user_id")
      ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "user_courses_course_id_user_id_fkey"
      FOREIGN KEY ("course_id", "user_id") REFERENCES "courses"("id", "user_id")
      ON DELETE RESTRICT ON UPDATE CASCADE
);

CREATE UNIQUE INDEX "user_courses_id_user_id_key"
ON "user_courses"("id", "user_id");

CREATE UNIQUE INDEX "user_courses_id_user_id_term_id_key"
ON "user_courses"("id", "user_id", "term_id");

CREATE UNIQUE INDEX "user_courses_user_id_term_id_course_id_key"
ON "user_courses"("user_id", "term_id", "course_id");

CREATE INDEX "user_courses_user_id_term_id_idx"
ON "user_courses"("user_id", "term_id", "archived_at");
