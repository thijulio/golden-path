# 0002 — Vitest is the default test runner

- **Status:** accepted
- **Date:** 2026-09-20

## Context

Newer repos use Vitest everywhere (website, thiago-smart-library,
property-management). Jest survives only in pet-management-platform's NestJS
backend, and pure-node tooling uses node --test.

## Decision

Vitest is the default test framework. Jest is used only where NestJS requires it.
node --test is for pure-node CLI/tooling with no bundler.

## Consequences

- New frontend/app work writes Vitest tests.
- Jest appears only alongside NestJS backend tests.
- CLI-only packages may use node --test instead.
