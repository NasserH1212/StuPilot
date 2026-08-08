# ADR 0014: Week-start and time-zone baseline

- **Status:** Accepted
- **Date:** 2026-08-07

## Context

The owner approved Sunday as the default week start while requiring a future user preference. Academic schedules mix recurring local intent with absolute reminder/event instants. Time calculations must not assume a server or hosting region.

## Decision

- Represent Sunday as `0` in the shared typed default; do not hard-code it inside future calendar algorithms.
- Initially derive an IANA time-zone candidate from the browser, then persist an explicit user preference when that feature is approved.
- Store absolute instants as PostgreSQL `timestamptz`/UTC semantics.
- Model future recurring academic intent with local date/time plus an IANA zone, converting at application boundaries with DST tests.
- Pass week start and zone explicitly into calculation services; avoid ambient server-local time.

Sprint 0 implements only the typed default seam. It does not implement calendars, schedules, reminders, or preferences.

## Consequences

Sunday works immediately without closing the path to another preference. DST gaps/overlaps, travel, and preference changes require explicit product rules and tests when scheduling work begins.
