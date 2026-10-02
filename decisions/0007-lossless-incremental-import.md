# 0007 — Lossless incremental import safety

- **Status:** proposed
- **Date:** 2026-10-02

## Context

A local synthetic importer demonstrated why source observations, accepted baselines and
canonical values need distinct ownership. Exact replay must return the original outcome even
after a native edit. Blank input must preserve values, and accepted assessments need explicit
review before replacement. Real PostgreSQL evidence is required for rollback and concurrency.

## Proposed decision

Use the [lossless incremental import workflow](../workflows/lossless-incremental-import.md)
for approved offline imports: immutable source evidence, deterministic normalization, three-way
field/group reconciliation, reviewed expected-hash resolutions and audited transactions.
Keep every operational source, target, credential and permission caller-controlled.

This proposal carries reusable safety patterns, not approval of a new stack, provider, package,
public data flow, scheduled sync or production import. ADR 0006 governs target and SQL safety.

## Consequences

- Source bytes are the ultimate lossless record; interpreted cells are inspectable evidence.
- Baseline adoption is distinct from canonical mutation; replay never restores old native values.
- Conflicts and optional quarantine are visible without blocking unrelated safe fields.
- Atomic groups, reviewed resolutions and provenance updates commit with canonical writes.
- Markdown/site metadata stay synchronized; independent review remains a separate gate.
- `node --test tools/import-decision.spec.mjs` checks proposal/site synchronization and routing.
