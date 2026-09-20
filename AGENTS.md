# Golden Path — Stack & Architecture Decisions

Single source of truth for stack choices across all projects. Read this before
creating a new project, adding a dependency, or changing stack.

> Living state and in-flight migrations: memory.md
> Adopt / trial / assess / hold: tech-radar.md
> Why (ADRs): decisions/

## What This Is

The decision layer on top of what already exists in code. It does not duplicate
tooling — it points to it. Golden rule: **an executed decision (a published
@thijulio package or a project scaffold) beats this document.** Docs rot;
templates don't.

## This Repository

The golden path ships as an **Nx + pnpm monorepo** (this repo):

- `apps/site/` — documentation site (Angular 22, standalone). Content is typed in
  `apps/site/src/app/data/*` and rendered by `apps/site/src/app/pages/*`.
- `packages/templates/` — executable scaffolds (future). One template = one
  executed decision; added one at a time.
- Decisions live at the repo root: `AGENTS.md`, `tech-radar.md`, `decisions/`.

### Commands

| Command | What it does |
|---|---|
| `pnpm install` | install workspace dependencies |
| `pnpm start` | run the docs site (dev server) |
| `pnpm build` | `nx build site` — production build |
| `pnpm test` | `nx test site` — unit tests (Vitest) |
| `pnpm graph` | `nx graph` — dependency graph |

### Deploy

Netlify — see `netlify.toml`. Build command `pnpm install --frozen-lockfile && nx build site`,
publish dir `apps/site/dist/site/browser`. Domain `golden-path.thijulio.com` (CNAME Route53).
A push does not deploy; deploy is a separate human-gated action.

### Keeping content in sync

The site's typed data (`apps/site/src/app/data/*`) is a curated mirror of this
decision layer. The markdown here is the source of truth; when a decision
changes, update both.

## Repositories / Packages It References

- @thijulio/eslint-config, @thijulio/prettier-config, @thijulio/tsconfig — repo dev-tooling
- @thijulio/biome-* (personal) and @thijulio/exodus-* (professional) — repo design-systems
- AI Toolbox (agents / skills / references) — repo thijulio/thijulio-ai-toolbox, local source .agents/
- npm scope @thijulio, published to GitHub Packages

## Locked Decisions (do not relitigate)

### Universal — every project

| Domain | Choice | Notes |
|---|---|---|
| Runtime | **Node 24** | Node 22 is legacy, migrating |
| Language | **TypeScript (strict)** | via @thijulio/tsconfig |
| Package manager | **pnpm** | |
| Monorepo | **Nx** | targets from plugin inference |
| Lint / format | **@thijulio/eslint-config + @thijulio/prettier-config** | zero any / suppressions |
| Styling | **Design system @thijulio** (tokens → CSS vars) | Tailwind = hold |
| Tests | **Vitest (default)**; Jest only if NestJS requires; node --test for pure CLI | |
| Publishing | **GitHub Packages**, scope @thijulio, nx release, conventional commits | |
| Git | **Conventional Commits**; no direct push to main | |

### Frontend framework — per-project choice

React 19 is the default. Vue and Angular are accepted alternatives. What the
golden path governs is the **container, not the framework**:

- Nx rules and project structure (apps/libs, module boundaries, plugin inference)
- design-system tokens/CSS (framework-agnostic — consumed as CSS vars by any framework)
- AI Toolbox (agents / skills / references)
- the universal decisions above (Node 24, TypeScript, pnpm, Vitest, conventional commits)

Pick the framework per project; keep the container consistent.

### Tier "light" — site, prototype, tooling, library

pnpm · Nx · Vite · React 19 (default) / Vue / Angular · Vitest · SWC · @thijulio configs + design system.

No NestJS, no Prisma, no Tailwind, no Storybook.

### Tier "product" — multi-tenant SaaS

"light", plus:

| Layer | Choice |
|---|---|
| Backend | **NestJS 11** (BFF + services) |
| ORM / DB | **Prisma 5 + PostgreSQL 16** |
| Client state | **Zustand** |
| Server state | **TanStack React Query** |
| Routing | **React Router DOM 6** |
| i18n | **i18next + react-i18next** (locale in URL) |
| Observability | **Sentry** |
| Component catalog | **Storybook** |
| Cloud / IaC | **AWS eu-west-3** (Lambda containers, API GW v2, RDS + RDS Proxy, S3/CloudFront) + **Terraform** |
| CI/CD | **GitHub Actions + OIDC** (no static keys) |
| Auth | **Cookie-based JWT** (HTTP-only, argon2, class-validator) |

State and routing rows above are React defaults; Vue and Angular use their
idiomatic equivalents (Pinia / Vue Router; Angular services / Angular Router)
under the same Nx + design-system constraints.

Canonical "product" example: pet-management-platform.

## Choosing a Tier

1. Multi-tenant SaaS with real users/data? → product
2. Anything else (site, prototype, CLI, internal tool) → light

When in doubt, start light; it is easier to grow into product than to strip it.

## AI Toolbox (agent assets — use it)

Reusable agents, skills, and references live in two layers:

- **Local operating source:** workspace root .agents/ (agents/, skills/, references/).
  Invoke these day-to-day.
- **Distributable layer:** thijulio/thijulio-ai-toolbox. Assets are promoted here
  one at a time (never bulk-copy), each with ownership, portability, install path,
  and a smoke test.

### When creating or changing a project

1. Check .agents/agents/INDEX.md and .agents/skills/ before improvising.
2. Architecture / stack decisions → invoke the **software-architect** agent. It
   anchors to this golden path and authors ADR drafts.
3. New external repo → skills/create-external-repo/SKILL.md; new workspace folder
   → skills/create-workspace-project/SKILL.md.
4. ADRs follow the toolbox template references/architecture-decision-record.md.
