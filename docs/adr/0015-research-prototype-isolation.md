# ADR 0015: Research-prototype isolation

- **Status:** Accepted
- **Date:** 2026-08-07

## Context

`research-prototype/` is a disposable historical artifact from a cancelled research program. The owner explicitly prohibited importing, copying, adapting, or treating it as the production design system.

## Decision

- Preserve the directory unchanged as historical evidence.
- Exclude it from TypeScript, lint, formatting, builds, and production dependency resolution.
- Prohibit direct, alias, dynamic, and CommonJS import paths through the executable boundary checker and unit test.
- Build production copy, CSS tokens, components, and layouts independently.
- Treat screenshots, DOM structure, copy, colors, and behavior from the prototype as unavailable for production reuse unless the owner explicitly authorizes a new evidence review and ADR.

## Consequences

Historical material remains inspectable without contaminating production provenance. Similarity must arise from approved product requirements or independent design work, not prototype adaptation. Violating imports fail local checks and CI.
