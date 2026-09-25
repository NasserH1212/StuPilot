# ADR 0017: University catalog and academic-calendar reference data

- **Date:** 2026-09-26
- **Status:** Accepted
- **Decision owners:** StuPilot project owner and engineering

## Context

Onboarding previously captured "university" as unconstrained free text, and academic terms were always entered manually. `03b` listed an "institutional academic calendar feed" as explicitly not included, and scope-control rule 4 prohibited university-specific logic in shared domain rules. The owner decided StuPilot should offer a curated catalog of Saudi universities and, where the owner supplies official dates, that university's published academic calendar — while keeping every student able to use the product without an affiliation, and keeping the core academic domain model unchanged.

## Decision

- A new, read-only `universities` reference table (name in Arabic/English, short name, optional local logo path, active flag) is seeded with real, verifiable Saudi institutions only. It is maintained by migration, not by in-app CRUD.
- Onboarding replaces the free-text university input with a searchable picker over this catalog (logo or short-name monogram + name) and keeps a "my university isn't listed" option that preserves the original free-text field. `user_profiles.university_id` is a nullable foreign key; the free-text column remains the fallback.
- A new, read-only `university_terms` reference table (university, Hijri academic year, term slot, start/end date) holds official calendars the owner supplies. It starts empty; no calendar dates are invented.
- When creating an academic term, a student whose university has published terms may pick one and its dates fill in read-only; everyone else — and any student without a published calendar — keeps full manual date entry. The `Term` domain model, its invariants, and the manual path are unchanged.
- Scope-control rule 4 in `03b` is narrowed: university-specific data may exist only as optional, curated reference data that pre-fills input. It must never become a required dependency of shared domain rules, and manual entry must always remain available.

## Consequences

- `03b`'s capability map now includes the curated catalog under Onboarding and curated (not live-synced) published calendars under Terms; automatic calendar import/sync from external university systems remains out of scope.
- Logos are local files under `public/universities/`, consistent with the existing CSP's block on remote image sources; institutions without a supplied logo file show a monogram badge instead.
- Extending the catalog or adding a university's official calendar is a data-only migration, with no application-code change required.
