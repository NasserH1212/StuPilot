-- University of Hail's official 1448 academic calendar.
-- Source (official, owner-verified): https://www.uoh.edu.sa/En/Pages/AcademicCalender.aspx

-- The summer 1448 term's end date is not yet published (only its start and
-- finals-week start are), so "ends_on" must allow NULL. The existing
-- "ends_on >= starts_on" CHECK already passes when either side is NULL
-- (per PostgreSQL's three-valued CHECK evaluation), so it needs no change.
ALTER TABLE "university_terms" ALTER COLUMN "ends_on" DROP NOT NULL;

-- Official recesses within a university's academic calendar (Slice C —
-- university catalog and calendars). Read-only reference data supplied by the
-- owner via migrations; not consumed anywhere yet — Slice C's class-schedule
-- feature will use it to hide occurrences during a break.
CREATE TABLE "university_breaks" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "university_id" UUID NOT NULL,
    "academic_year" INTEGER NOT NULL,
    "name_ar" VARCHAR(120) NOT NULL,
    "name_en" VARCHAR(120) NOT NULL,
    "starts_on" DATE NOT NULL,
    "ends_on" DATE NOT NULL,
    "resumes_on" DATE NOT NULL,
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(3) NOT NULL,

    CONSTRAINT "university_breaks_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "university_breaks_academic_year_positive" CHECK ("academic_year" > 0),
    CONSTRAINT "university_breaks_name_ar_not_blank" CHECK (length(btrim("name_ar")) > 0),
    CONSTRAINT "university_breaks_name_en_not_blank" CHECK (length(btrim("name_en")) > 0),
    CONSTRAINT "university_breaks_date_order" CHECK ("ends_on" >= "starts_on"),
    CONSTRAINT "university_breaks_resumes_after_end" CHECK ("resumes_on" > "ends_on"),
    CONSTRAINT "university_breaks_university_id_fkey"
      FOREIGN KEY ("university_id") REFERENCES "universities"("id")
      ON DELETE RESTRICT ON UPDATE CASCADE
);

CREATE UNIQUE INDEX "university_breaks_university_id_academic_year_name_en_key"
ON "university_breaks"("university_id", "academic_year", "name_en");

CREATE INDEX "university_breaks_university_id_idx"
ON "university_breaks"("university_id", "academic_year");

-- Seed: University of Hail, academic year 1448.
INSERT INTO "university_terms" ("university_id", "academic_year", "term", "starts_on", "ends_on", "updated_at")
SELECT "id", 1448, 'first', DATE '2026-08-23', DATE '2027-01-07', CURRENT_TIMESTAMP
FROM "universities" WHERE "name_en" = 'University of Hail';

INSERT INTO "university_terms" ("university_id", "academic_year", "term", "starts_on", "ends_on", "updated_at")
SELECT "id", 1448, 'second', DATE '2027-01-17', DATE '2027-06-17', CURRENT_TIMESTAMP
FROM "universities" WHERE "name_en" = 'University of Hail';

-- Summer 1448's end date is not announced yet; finals week starts 2027-08-08.
INSERT INTO "university_terms" ("university_id", "academic_year", "term", "starts_on", "ends_on", "updated_at")
SELECT "id", 1448, 'summer', DATE '2027-06-20', NULL, CURRENT_TIMESTAMP
FROM "universities" WHERE "name_en" = 'University of Hail';

INSERT INTO "university_breaks" ("university_id", "academic_year", "name_ar", "name_en", "starts_on", "ends_on", "resumes_on", "updated_at")
SELECT "id", 1448, 'العطلة الخريفية', 'Fall break', DATE '2026-11-22', DATE '2026-11-28', DATE '2026-11-29', CURRENT_TIMESTAMP
FROM "universities" WHERE "name_en" = 'University of Hail';

INSERT INTO "university_breaks" ("university_id", "academic_year", "name_ar", "name_en", "starts_on", "ends_on", "resumes_on", "updated_at")
SELECT "id", 1448, 'عطلة عيد الفطر', 'Eid al-Fitr break', DATE '2027-02-28', DATE '2027-03-13', DATE '2027-03-14', CURRENT_TIMESTAMP
FROM "universities" WHERE "name_en" = 'University of Hail';

INSERT INTO "university_breaks" ("university_id", "academic_year", "name_ar", "name_en", "starts_on", "ends_on", "resumes_on", "updated_at")
SELECT "id", 1448, 'عطلة عيد الأضحى', 'Eid al-Adha break', DATE '2027-05-09', DATE '2027-05-22', DATE '2027-05-23', CURRENT_TIMESTAMP
FROM "universities" WHERE "name_en" = 'University of Hail';
