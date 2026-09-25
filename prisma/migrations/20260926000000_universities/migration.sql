-- Curated catalog of Saudi universities for the onboarding picker (Slice C —
-- university catalog and calendars). Read-only reference data: seeded and
-- extended via migrations, not through in-app CRUD. Logos are local files
-- under public/universities/ (the CSP blocks remote images); until a
-- "logo_path" is set, the UI falls back to a monogram badge built from
-- "short_name".
CREATE TABLE "universities" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "name_ar" VARCHAR(160) NOT NULL,
    "name_en" VARCHAR(160) NOT NULL,
    "short_name" VARCHAR(32) NOT NULL,
    "logo_path" VARCHAR(255),
    "active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(3) NOT NULL,

    CONSTRAINT "universities_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "universities_name_ar_not_blank" CHECK (length(btrim("name_ar")) > 0),
    CONSTRAINT "universities_name_en_not_blank" CHECK (length(btrim("name_en")) > 0),
    CONSTRAINT "universities_short_name_not_blank" CHECK (length(btrim("short_name")) > 0)
);

CREATE UNIQUE INDEX "universities_name_en_key" ON "universities"("name_en");
CREATE UNIQUE INDEX "universities_short_name_key" ON "universities"("short_name");
CREATE INDEX "universities_active_idx" ON "universities"("active");

-- Onboarding profile: optional link to a catalog entry. The existing free-text
-- "university" column remains as the fallback for "My university isn't
-- listed".
ALTER TABLE "user_profiles" ADD COLUMN "university_id" UUID;

ALTER TABLE "user_profiles"
  ADD CONSTRAINT "user_profiles_university_id_fkey"
  FOREIGN KEY ("university_id") REFERENCES "universities"("id")
  ON DELETE RESTRICT ON UPDATE CASCADE;

CREATE INDEX "user_profiles_university_id_idx" ON "user_profiles"("university_id");

-- Seed: well-known Saudi public and a few well-known private universities.
-- Real, verifiable institution names only. No logos yet.
INSERT INTO "universities" ("name_ar", "name_en", "short_name", "updated_at") VALUES
  ('جامعة الملك سعود', 'King Saud University', 'KSU', CURRENT_TIMESTAMP),
  ('جامعة الملك عبدالعزيز', 'King Abdulaziz University', 'KAU', CURRENT_TIMESTAMP),
  ('جامعة الملك فهد للبترول والمعادن', 'King Fahd University of Petroleum and Minerals', 'KFUPM', CURRENT_TIMESTAMP),
  ('جامعة الإمام محمد بن سعود الإسلامية', 'Imam Muhammad ibn Saud Islamic University', 'IMSIU', CURRENT_TIMESTAMP),
  ('جامعة أم القرى', 'Umm Al-Qura University', 'UQU', CURRENT_TIMESTAMP),
  ('الجامعة الإسلامية بالمدينة المنورة', 'Islamic University of Madinah', 'IU', CURRENT_TIMESTAMP),
  ('جامعة الملك خالد', 'King Khalid University', 'KKU', CURRENT_TIMESTAMP),
  ('جامعة الملك فيصل', 'King Faisal University', 'KFU', CURRENT_TIMESTAMP),
  ('جامعة الملك سعود بن عبدالعزيز للعلوم الصحية', 'King Saud bin Abdulaziz University for Health Sciences', 'KSAU-HS', CURRENT_TIMESTAMP),
  ('جامعة الأميرة نورة بنت عبدالرحمن', 'Princess Nourah bint Abdulrahman University', 'PNU', CURRENT_TIMESTAMP),
  ('جامعة الإمام عبدالرحمن بن فيصل', 'Imam Abdulrahman Bin Faisal University', 'IAU', CURRENT_TIMESTAMP),
  ('جامعة القصيم', 'Qassim University', 'QU', CURRENT_TIMESTAMP),
  ('جامعة طيبة', 'Taibah University', 'TU', CURRENT_TIMESTAMP),
  ('جامعة جازان', 'Jazan University', 'JU', CURRENT_TIMESTAMP),
  ('جامعة نجران', 'Najran University', 'NU', CURRENT_TIMESTAMP),
  ('جامعة الطائف', 'Taif University', 'TIU', CURRENT_TIMESTAMP),
  ('جامعة حائل', 'University of Hail', 'UOH', CURRENT_TIMESTAMP),
  ('جامعة الجوف', 'Jouf University', 'JOUF', CURRENT_TIMESTAMP),
  ('جامعة تبوك', 'University of Tabuk', 'UT', CURRENT_TIMESTAMP),
  ('جامعة الباحة', 'Al-Baha University', 'BU', CURRENT_TIMESTAMP),
  ('جامعة شقراء', 'Shaqra University', 'SHU', CURRENT_TIMESTAMP),
  ('جامعة المجمعة', 'Majmaah University', 'MU', CURRENT_TIMESTAMP),
  ('جامعة الأمير سطام بن عبدالعزيز', 'Prince Sattam bin Abdulaziz University', 'PSAU', CURRENT_TIMESTAMP),
  ('جامعة الملك عبدالله للعلوم والتقنية', 'King Abdullah University of Science and Technology', 'KAUST', CURRENT_TIMESTAMP),
  ('جامعة الأمير سلطان', 'Prince Sultan University', 'PSU', CURRENT_TIMESTAMP),
  ('جامعة الفيصل', 'Alfaisal University', 'ALFAISAL', CURRENT_TIMESTAMP),
  ('جامعة عفت', 'Effat University', 'EFFAT', CURRENT_TIMESTAMP);
