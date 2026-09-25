-- Official published academic-calendar entries for a university (Slice C —
-- university catalog and calendars). Read-only reference data the owner
-- supplies via a reviewed forward-fix migration once official dates are
-- available; this migration intentionally seeds no rows and no calendar
-- dates are invented. Used only to pre-fill term-creation dates for a
-- student whose university has one — never a dependency of the
-- university-independent "academic_terms" domain model.
CREATE TYPE "university_term_slot" AS ENUM ('first', 'second', 'third', 'summer');

CREATE TABLE "university_terms" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "university_id" UUID NOT NULL,
    "academic_year" INTEGER NOT NULL,
    "term" "university_term_slot" NOT NULL,
    "starts_on" DATE NOT NULL,
    "ends_on" DATE NOT NULL,
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(3) NOT NULL,

    CONSTRAINT "university_terms_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "university_terms_academic_year_positive" CHECK ("academic_year" > 0),
    CONSTRAINT "university_terms_date_order" CHECK ("ends_on" >= "starts_on"),
    CONSTRAINT "university_terms_university_id_fkey"
      FOREIGN KEY ("university_id") REFERENCES "universities"("id")
      ON DELETE RESTRICT ON UPDATE CASCADE
);

CREATE UNIQUE INDEX "university_terms_university_id_academic_year_term_key"
ON "university_terms"("university_id", "academic_year", "term");

CREATE INDEX "university_terms_university_id_idx"
ON "university_terms"("university_id", "academic_year");
