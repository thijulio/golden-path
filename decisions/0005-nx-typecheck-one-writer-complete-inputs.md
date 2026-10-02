# 0005 — Nx typecheck: one writer per output tree, complete inputs

- **Status:** accepted
- **Date:** 2026-10-02

| Part | Status | Source |
|---|---|---|
| A — one writer per output tree | accepted | thijulio/design-systems#12 (merged 2026-10-02) |
| B — typecheck inputs include spec files | accepted | thijulio/design-systems#11 (merged 2026-10-02) |

## Context

**A.** In design-systems (nx 23.0.1) the vite libraries (`packages/primitives`,
`packages/biome/react`, `packages/exodus/react`) had two writers on `dist/`:

- `build` = `vite build`: outputs `{projectRoot}/dist`, `emptyOutDir: true`, and
  vite-plugin-dts writes the `.d.ts` into vite's `build.outDir`.
- `typecheck` (inferred by `@nx/vite`) = `tsc --build --emitDeclarationOnly`, with
  `tsconfig.lib.json` `outDir: "dist"` (the Nx generator default). It declares no
  outputs and has no ordering against `build`.

They ran in parallel and flaked: TS6305 "Output file ... has not been built from
source file", TS2306, vite `ENOTEMPTY`. A jittered harness failed 4/20
(exodus-react) and 2/15 (primitives) before the fix, 0/50 after.

pet-management-platform hit the same class of bug (PMP #169;
`docs/testing/e2e-strategy.md`, "Flake policy and mitigations"): each backend
service's serve executor ran its own nested build pipeline, so several Nx
processes wrote the shared `dist/out-tsc/**` and `.cache/tsbuildinfo/*` trees at
once. PMP fixed it by construction (`runBuildTargetDependencies: false` +
`dependsOn: ["^build"]`, so one `run-many` builds each dependency exactly once),
explicitly not with retries.

**B.** `@nx/vite` infers typecheck inputs as
`["production", "^production", {"externalDependencies": ["typescript"]}]`.
`production` excludes `*.spec.tsx`, but `tsc --build` follows `tsconfig.json` →
`tsconfig.spec.json` and checks them. A type error that exists only in a spec was a
cache hit and a false pass (reproduced). `tsconfig.base.json` was not an input
either, so a stricter compiler flag could not bust the cache.

## Decision

### A — One writer per output tree

- tsc's `outDir` and `tsBuildInfoFile` must never be a bundler's `outDir`.
- Every tool output dir is gitignored. Nx hashes untracked, non-ignored files, so a
  `.tsbuildinfo` landing in an input path makes the task invalidate its own cache.
- Two accepted layouts; follow the repo's existing convention:

| Layout | `outDir` | `tsBuildInfoFile` | Ignore |
|---|---|---|---|
| Root (PMP) | `<root>/dist/out-tsc/<project>` | `<root>/.cache/tsbuildinfo/<project>.tsbuildinfo` | `.cache` must be in `.gitignore` |
| In-package (design-systems) | `out-tsc/lib` | `out-tsc/lib/tsconfig.lib.tsbuildinfo` | covered by an `out-tsc` ignore |

- Rejected: `typecheck.dependsOn: ["build"]` as the fix. It serializes two writers
  instead of removing the overlap.

### B — Typecheck inputs include spec files

Per project, in `package.json` `nx.targets.typecheck.inputs`:

```json
["default", "{workspaceRoot}/tsconfig.base.json", "^production", { "externalDependencies": ["typescript"] }]
```

Per project, not `targetDefaults.typecheck`: target defaults are looked up by target
name with no per-project filter, so they would also override projects whose
typecheck is inferred by `@nx/js/typescript` (and its own inputs). Nx merges target
keys separately (`inputs`, `outputs` and `dependsOn` coexist), but arrays replace
unless spread with `"..."`.

## Consequences

- When cross-package imports resolve through `package.json` `types` → the
  dependency's bundler-built `dist` (not through project references), the
  consumer's typecheck depends on `^build`. design-systems: react libraries'
  `typecheck.dependsOn: ["^typecheck", "^build"]`.
- An app whose build runs `tsc -b` over project references depends on
  `^typecheck`, or it rebuilds a library's tsc output concurrently with that
  library's own typecheck. design-systems: `docs:build.dependsOn: ["^build", "^typecheck"]`.
- Gotcha: in a nested git worktree, a missing `dist` makes TypeScript silently fall
  through to the main checkout's `node_modules` (confirmed with
  `--traceResolution`), so a clean typecheck there can falsely pass. Verify from a
  standalone clone or CI.
- B trade-off: `default` includes README/CHANGELOG, so editing them re-runs `tsc`.
  Seconds, and preferable to a false pass.
- New Nx projects (and future `packages/templates` scaffolds) start with the
  layout and inputs above instead of the generator defaults.
