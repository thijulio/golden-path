# 0007 — Roadmaps live in docs/roadmap; delivery uses GitHub milestones

- **Status:** accepted
- **Date:** 2026-10-02

## Context

Consumer projects have placed roadmap documentation in inconsistent locations.
A shared convention is needed to keep versioned planning documents discoverable
and distinguish them from actionable delivery work.

## Decision

Every project's roadmap lives in its owning repository under `docs/roadmap/`,
with `README.md` as the index and separate documents for initiatives or phases.
Goals, scope, sequencing, and planning status belong in those documents.
Roadmaps, roadmap phases, and roadmap documents are never opened as GitHub issues.

Use GitHub milestones to group implementation issues and PRs for a phase or
release. Each milestone description links to the relevant roadmap document;
the document links back to its milestones. Issues describe actionable
implementation work or bugs.

## Consequences

- Roadmap changes are reviewed and versioned through pull requests.
- Consumers move misplaced roadmap documents into `docs/roadmap/` and update
  references.
- Existing roadmap issues are closed with a link to the replacement document
  after preserving their planning content there. Actionable implementation
  issues remain and are assigned to the appropriate milestone.
- Roadmap documents describe planning intent; GitHub milestones track delivery
  progress. Both must remain linked and current.
