# ADR 0004: Localization and locale routing

- **Status:** Accepted
- **Date:** 2026-08-07

## Context

Arabic/RTL and English/LTR are equal product requirements, Arabic is the default, and the first HTTP response must not depend on client hydration to correct document language or direction.

## Decision

- Use required path prefixes: `/ar` and `/en`.
- Redirect `/` to `/ar`; reject unsupported locale segments with a safe 404.
- Let `proxy.ts` validate the leading segment and attach a request-only locale header.
- Set `<html lang>` and `dir` in the root server layout from that header on the first response.
- Keep small typed dictionaries in source and validate locale values before dictionary access.
- Generate localized metadata and alternate-language links.
- Use CSS logical properties and `<bdi>` for isolated mixed-direction content.

There is no browser-language negotiation or locale cookie in Sprint 0. Future preference persistence must keep explicit URLs canonical and must not create a hydration-only direction change.

## Consequences

Both language modes are testable and share route semantics. Adding a locale requires a dictionary, direction mapping, metadata, routing tests, bidi review, and E2E coverage; a translation alone is insufficient.

## References

- [Next.js internationalization guide](https://nextjs.org/docs/app/guides/internationalization)
- [HTML `dir`](https://html.spec.whatwg.org/multipage/dom.html#the-dir-attribute)
