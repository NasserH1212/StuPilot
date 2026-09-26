-- Weekly class meetings for a course enrollment (Slice C — class schedule and
-- calendar), matching 03f §4.7 ("recurring_class_series"), narrower than
-- iCalendar RRULE by design: the application expands bounded occurrences on
-- demand and never stores one row per future occurrence.
--
-- Two deliberate deviations from 03f, documented in that file:
--   1. "weekdays" is INTEGER[] rather than SMALLINT[] — functionally
--      identical for values 0-6, simpler to author by hand.
--   2. "meeting_type" is a new column beyond 03f's reviewed set, added for
--      this slice's lecture/lab/tutorial distinction.
CREATE TYPE "class_meeting_type" AS ENUM ('lecture', 'lab', 'tutorial');

CREATE TABLE "recurring_class_series" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "user_id" UUID NOT NULL,
    "user_course_id" UUID NOT NULL,
    "weekdays" INTEGER[] NOT NULL,
    "local_start_time" TIME NOT NULL,
    "local_end_time" TIME NOT NULL,
    "starts_on" DATE NOT NULL,
    "ends_on" DATE NOT NULL,
    "time_zone" VARCHAR(64) NOT NULL,
    "location" VARCHAR(120),
    "meeting_type" "class_meeting_type" NOT NULL,
    "archived_at" TIMESTAMPTZ(3),
    "version" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(3) NOT NULL,

    CONSTRAINT "recurring_class_series_pkey" PRIMARY KEY ("id"),
    -- 0=Sunday..6=Saturday (matches JS Date#getDay and this app's Sunday week start).
    CONSTRAINT "recurring_class_series_weekdays_not_empty" CHECK (array_length("weekdays", 1) > 0),
    CONSTRAINT "recurring_class_series_weekdays_valid" CHECK ("weekdays" <@ ARRAY[0,1,2,3,4,5,6]),
    CONSTRAINT "recurring_class_series_time_order" CHECK ("local_end_time" > "local_start_time"),
    CONSTRAINT "recurring_class_series_date_order" CHECK ("ends_on" >= "starts_on"),
    CONSTRAINT "recurring_class_series_time_zone_not_blank" CHECK (length(btrim("time_zone")) > 0),
    CONSTRAINT "recurring_class_series_version_non_negative" CHECK ("version" >= 0),
    CONSTRAINT "recurring_class_series_user_id_fkey"
      FOREIGN KEY ("user_id") REFERENCES "users"("id")
      ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "recurring_class_series_user_course_id_user_id_fkey"
      FOREIGN KEY ("user_course_id", "user_id") REFERENCES "user_courses"("id", "user_id")
      ON DELETE RESTRICT ON UPDATE CASCADE
);

CREATE UNIQUE INDEX "recurring_class_series_id_user_id_key"
ON "recurring_class_series"("id", "user_id");

-- Matches 03f §6's baseline index for bounded occurrence expansion.
CREATE INDEX "recurring_class_series_user_id_user_course_id_idx"
ON "recurring_class_series"("user_id", "user_course_id", "starts_on", "ends_on");
