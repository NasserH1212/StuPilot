-- Sprint 0 technical compatibility table only. Contains no user or academic data.
CREATE TABLE "_foundation_health_checks" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "checked_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "marker" VARCHAR(64) NOT NULL,

    CONSTRAINT "_foundation_health_checks_pkey" PRIMARY KEY ("id")
);
