# 0006 — nx release only bumps packages that really changed

- **Status:** accepted
- **Date:** 2026-10-02

| Rules | Status | Source |
|---|---|---|
| 1–4 — affected scope, CI, tooling split, commit types | accepted | thijulio/design-systems#9 (merged 2026-10-02) |
| 5 — format files staged by nx release | accepted | thijulio/design-systems#10 (merged 2026-10-02) |

## Context

In design-systems a release that only touched `packages/core`, the three css
packages, `AGENTS.md` and the lockfile bumped all 9 packages, most with
"version bump only" changelogs.

Mechanism (verified against the nx 23.0.1 source): `nx release` versioning
attributes each `feat`/`fix` commit to every project it *affects*. It calls
`filterAffected()`, the same logic as `nx affected`
(`nx/dist/src/command-line/release/utils/release-graph.js`). Project changelogs only
list commits touching the package's own files (`changelog.js`), hence the
"version bump only" entries. So a release bump is only as precise as the affected
graph.

Separately, nx release writes `CHANGELOG.md` without a final newline. The release
job runs with `HUSKY=0`, so nothing formats it, and the next CI `nx format:check` on
main failed.

## Decision

1. **Narrow dependency-update attribution.** In `nx.json`:

   ```json
   "pluginsConfig": { "@nx/js": { "projectsAffectedByDependencyUpdates": "auto" } }
   ```

   The default `'all'` marks every project affected on any lockfile change (a
   css-only change released all 9 packages). Measured with
   `nx release --dry-run --skip-publish`: a replay of that release went from 9
   bumped to 6 (3 tokens + 3 css).

2. **CI runs everything when the lockfile changed.** `'auto'` also narrows
   `nx affected` in CI, and projects have no graph edges to the toolchain
   (typescript, jest, eslint, `@nx/*`). CI computes
   `git diff --name-only "$NX_BASE" "$NX_HEAD"` and runs `nx run-many` when the
   lockfile is in it, `nx affected` otherwise (design-systems
   `.github/workflows/ci.yml`; use `pnpm-lock.yaml` in pnpm repos).

3. **Split private build tooling by consumer.** A tooling project every package
   depends on bumps every package on any change. design-systems extracted
   `@thijulio/fonts` from `core`; a fonts fix went from 6 bumped to 3.

4. **Root-config commits never release.** Commits that only touch root config
   (`nx.json`, `eslint.config.*`, `jest.preset.*`, `tsconfig.base.json`) are typed
   `build:` / `ci:` / `chore:` / `refactor:`, never `feat:` / `fix:`, because those
   files affect every project. With squash merges, the PR title is the commit.

5. **Format what nx release stages, inside its own commit.** A release-only
   pre-commit hook (`.github/release-hooks/pre-commit`, enabled in the release
   workflow with `git config core.hooksPath .github/release-hooks`) runs
   `nx format:write` (prettier) on the staged files and re-stages them. nx still
   owns versions, the commit message and tags, and the tags point at the formatted
   commit.

## Consequences

- Fewer no-op releases and honest changelogs; consumers stop seeing
  "version bump only" noise. Confirmed on design-systems main: the release run
  for the #9 merge (`dc4b74e`, Actions run 37002696807) detected no changes for
  all 9 packages and published nothing.
- CI coverage on toolchain upgrades is unchanged (rule 2 compensates for rule 1).
- Commit typing becomes load-bearing: a `feat:`/`fix:` PR title on a root-config
  change still bumps everything. Reviewers check the squash title.
- Rule 5 alternatives rejected in design-systems#10: nx hooks (only
  `preVersionCommand`, runs too early), a custom changelog renderer (returns a
  fragment, not the file), `git commit --amend` + re-tag (breaks once nx pushes),
  `.prettierignore` for CHANGELOGs (hides drift).
- Future `packages/templates` scaffolds that publish with nx release ship these
  settings and the hook from day one.
