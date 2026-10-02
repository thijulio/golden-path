# Portable delivery context preflight

Proposed workflow, 2026-10-02. This guidance changes no stack selection and grants no execution authority.
See [ADR 0005](../decisions/0005-portable-delivery-context.md). Markdown decisions own meaning;
site data is a synchronized summary. Project-specific source data stays with its project.

## Before implementation

1. Record repository identity, current branch/head, dirty paths and worktrees. Fetch the named remote
   and record the exact base/predecessor. Preserve other work; execute in an isolated branch when requested.
2. Read project instructions, the current radar and applicable ADRs. Compare actual package/project
   configuration with shared choices. Record concrete gaps, approved project choices and unresolved gates.
   A narrow approved exception does not rewrite the universal stack or justify extra dependencies.
3. Put sanitized requirements, the selected plan and delivery evidence in the implementation repository.
   Give supplements explicit precedence. Private studies become provenance; context entrypoints route
   to repository docs. Do not maintain two editable implementation authorities.
4. Capture code-only compatibility references at an exact source commit with hashes and attribution/license
   status. Inspect content before promotion; never copy snapshots, credentials, source records or private
   review excerpts. Captured files are documentation inputs; ports require tests and new provenance evidence.
5. Check local execution links and heading anchors deterministically, without HTTP requests or scanning
   private folders. Required links cannot escape the repository, including symlink targets. A fresh clone
   must reach requirements and status from README and AGENTS within two links. Exercise the checker with
   broken files, anchors, reference links, fence examples and path-escape fixtures.
6. Record allowed actions and the exact next ticket. Keep evidence separate for implemented-local,
   independently reviewed, merged and deployed. A planned command, historical deployment or self-review
   cannot establish a current delivery state.

## Adoption record

Each project owns its alignment record with: shared base SHA/date; actual configuration; aligned areas;
concrete deviations and their scoped authority; reusable improvement; validation; unresolved gates.
Keep project identities and operational evidence in that project. Promote only demonstrated reusable
patterns. Do not add a cross-repository change merely to create a second commit.

When a shared decision changes, update its Markdown and typed site entry together, recording proposed
versus accepted status. Validate the changed module and attempt the repository's checks; missing
installed dependencies are a gate, not permission to install when the user excludes installation.

## Completion handoff

Name each worktree, branch, exact base/head, changed files, checks and their real outcomes, independent
review status, publication/deployment status, deviations, and next starting commit/ticket. If context
routing uses a symlink to an older primary checkout, name the isolated worktree explicitly until
integration; do not silently retarget the user's symlink or reset their checkout.
