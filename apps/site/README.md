# Golden Path — Docs site

Documentation site for the golden path (stack & architecture decisions).

Built with **Angular 22** (standalone, zoneless). Content is typed in `src/app/data/*`.

## Run

```bash
pnpm install
pnpm start        # dev server → http://localhost:4200
pnpm build        # production build → dist/golden-path-site/browser
pnpm test         # unit tests (Vitest)
```

## Structure

| Path | Purpose |
|---|---|
| `src/app/data/*` | typed content (stack, radar, inventory, adrs, nav) |
| `src/app/pages/*` | one routed page per section |
| `src/app/app.ts` | shell (sidebar + topbar + router-outlet) |

## Deploy (Netlify)

- build command: `pnpm install --frozen-lockfile && pnpm build`
- publish dir: `dist/golden-path-site/browser`
- domain: `golden-path.thijulio.com` (CNAME Route53)

## Promote to repo

The canonical code home is `~/development/golden-path` (create via
`skills/create-external-repo`), linked back into the workspace via `repo ->`.
Move this folder there once the repo exists.
