# Golden Path

Single source of truth for stack choices across all projects.

- Docs site: apps/site (Angular 22, standalone)
- Templates (future): packages/templates
- Decisions: AGENTS.md, tech-radar.md, decisions/

## Commands

    pnpm install
    pnpm start      # dev server (docs site)
    pnpm build      # nx build site
    pnpm test       # nx test site

## Deploy

Netlify — see netlify.toml. Domain: golden-path.thijulio.com (CNAME Route53).

## Delivery workflow

The proposed [portable context preflight](workflows/delivery-context.md) records technical ownership,
scoped alignment gaps and separate implementation/review/release evidence. See [ADR 0005](decisions/0005-portable-delivery-context.md).

Database safety: proposed [isolated delivery workflow](workflows/isolated-database-delivery.md) and [ADR 0006](decisions/0006-isolated-database-delivery.md); stack adoption remains unchanged.

Offline import safety: [proposed ADR 0007](decisions/0007-lossless-incremental-import.md) and [workflow](workflows/lossless-incremental-import.md).
