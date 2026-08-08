# ADR 0005: CSS and design-token approach

- **Status:** Accepted
- **Date:** 2026-08-07

## Context

Sprint 0 needs a neutral accessible shell, not a full design system. Tailwind would add a build-time utility convention; a component library would introduce visual and runtime policy before product screens exist; CSS-in-JS would add client/runtime concerns. Native CSS already supports custom properties, logical properties, media queries, and reduced motion.

## Decision

Use plain CSS with semantic class names and custom-property tokens for color, spacing, type scale, radii, focus, elevation, and content width. Use mobile-first rules, logical properties, system fonts, a visible `:focus-visible` treatment, 44px minimum interactive height, and `prefers-reduced-motion` overrides.

CSS Modules may be introduced for feature-local styles when the component count justifies them. Tailwind, CSS-in-JS, and dependency-heavy UI systems are not selected.

## Consequences

The initial bundle has no styling runtime or external font request. Token changes remain centralized, while class naming and unused-style discipline require review. Any later UI system must preserve the established accessibility and bidi contract and be justified by measured maintenance value.
