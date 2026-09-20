# 0004 — Frontend framework is a per-project choice; the container is the constraint

- **Status:** accepted
- **Date:** 2026-09-20

## Context

The golden path initially defaulted to React only. But the design system already
ships framework-agnostic tokens (CSS vars + JS/TS objects via Style Dictionary),
and Nx supports React, Vue, and Angular projects under the same module-boundary
and plugin-inference rules. Locking to one framework contradicted the
"container, not framework" intent.

## Decision

React 19 is the default. Vue and Angular are accepted alternatives. The golden
path governs the container: Nx rules, project structure, design-system tokens/CSS,
the AI Toolbox, and the universal decisions (Node 24, TypeScript, pnpm, Vitest,
conventional commits) — not a single framework.

## Consequences

- New projects may pick React (default), Vue, or Angular.
- Every framework consumes the same design-system tokens (CSS vars). The React
  component packages remain the first-class implementation; Vue/Angular add thin
  wrappers only when the rule of three justifies it.
- State/routing defaults stay React-specific (Zustand, TanStack Query, React
  Router); Vue/Angular use their idiomatic equivalents under the same Nx
  constraints.
