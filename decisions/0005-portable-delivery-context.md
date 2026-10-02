# 0005 — Portable delivery context and evidence ownership

- **Status:** proposed
- **Date:** 2026-10-02

## Context

A database delivery preflight found private planning documents competing with stale project entrypoints:
context still described an empty repository while committed code already provided connectivity. An older
import contract also conflicted with a later supplement. Plans could be mistaken for delivered behavior,
and runtime references to another local checkout would prevent independent execution from a fresh clone.

## Proposed decision

Use [the delivery-context workflow](../workflows/delivery-context.md): one repository-owned technical
contract with explicit supplement precedence, private evidence retained outside Git, sanitized pinned
code references, deterministic bounded context validation, and separate implementation/review/release
states. Project entrypoints route to this owner and name any local-only worktree limitation.

Assess actual configuration against current Golden Path decisions before every ticket. Record scoped
approved differences and unresolved adoption gates; do not silently change stack or generalize a
project exception into a universal decision. Shared proposals and their typed site entries change together.

## Consequences

- A fresh executor can identify the exact predecessor, authorized scope, requirements and next ticket.
- No private evidence is needed to verify execution routing or synthetic local tests.
- A checker needs a real Markdown parser, traversal protection and meaningful regression fixtures.
- Local tests and self-review remain distinct from independent review, merge, deployment and cutover.
- This proposal adds a workflow contract only; it does not approve an ORM, database provider, new tier,
  dependency installation, publication or cloud changes. Acceptance remains pending review.
