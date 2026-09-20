# 0003 — Design system is the single styling source

- **Status:** accepted
- **Date:** 2026-09-20

## Context

Tailwind was used in product apps (pet-management-platform, property-management)
while personal sites used the design-system CSS vars directly. That split created
two styling sources.

## Decision

The design system (@thijulio/biome-* personal, @thijulio/exodus-* professional) is
the single styling source, via tokens and CSS custom properties. Tailwind is hold
and being removed.

## Consequences

- No Tailwind in new code.
- Existing Tailwind (PMP) is legacy in migration — remove, don't expand.
- Components consume design-system CSS vars, not utility classes.
