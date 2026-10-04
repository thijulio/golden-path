# 0008 — Isolated database delivery and permission evidence

- **Status:** accepted
- **Date:** 2026-10-02

## Context

A scoped SQL foundation demonstrated failures that unit doubles cannot establish: deferred
constraints run after a privileged routine returns, migrations can lose their connection
before recording history, default routine execution can leak privileges, and forced database
cleanup can terminate pooled connections that are still closing. A planned local port was
already occupied by unrelated work and had to be preserved.

## Decision

Use the [isolated database workflow](../workflows/isolated-database-delivery.md) for an approved
SQL delivery: validate the disposable target and its identity before mutation, use checksummed
forward migrations on one direct client, and prove constraints/privileges/concurrency/rollback
with actual PostgreSQL and distinct logins. Track independent review separately from implementation.

The demonstrated project uses SQL and node-postgres for a bounded single-owner application.
This is evidence for reusable safety patterns, **not** acceptance of a new tier, ORM exception,
Neon hosting, project dependency versions or production operations. Existing locked stack decisions
and the radar remain unchanged. A project outside those tiers records its approved scope and
unresolved alignment rather than silently replacing its architecture.

## Consequences

- Disposable means loopback plus exact name/container allowlists, private instance marker, no real
  records, and tmpfs storage; a local hostname alone is insufficient.
- Migration bytes/history and role grants become inspectable review evidence.
- SECURITY DEFINER and deferred triggers require deliberate privilege and search-path review.
- Connection-loss, checksum-drift and concurrency tests must actually run; no skip/mock substitution.
- Shared adoption, independent review, hosted tests and production approval remain separate gates.
- `node --test tools/database-decision.spec.mjs` guards Markdown/site proposal metadata synchronization.
