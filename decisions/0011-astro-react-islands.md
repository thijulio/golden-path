# 0011 — Astro + React islands for content-first sites with a persistent canvas

- **Status:** accepted (2026-10-03)
- **Date:** 2026-10-03
- **Deciders:** Thiago (owner). Drafted with the `software-architect` agent.
- **Scope:** content-first sites whose pages must be real static HTML _and_ share
  one canvas that survives navigation. First (and only) consumer:
  `thijulio/website` (Thiago OS v1).
- **Relates to:** [0004](0004-frontend-framework.md) (this ADR scopes inside
  it), [0001](0001-node-24.md), [0002](0002-vitest-default.md),
  [0003](0003-design-system-single-source.md),
  [0005](0005-nx-typecheck-one-writer-complete-inputs.md).

Sources are numbered `[Sn]` (list at the end, all checked on 2026-10-03).
Anything not checked is marked **(unverified)**.

## Context

`thijulio.com` is being rebuilt as **Thiago OS**: a content-first site whose
home is a garden that grows toward each visitor. Today `apps/web` in
`thijulio/website` is a
client-rendered React 19 + Vite 8 SPA (`index.html` with an empty
`<div id="root">`, `createRoot` in `src/main.tsx`), so crawlers, AI agents and
no-JS visitors receive an empty shell.

Requirements that drive the choice (from the website repo's
`docs/handover/2026-10-03-thiago-os-v1-handover.md`, §3, §5 and §8):

| #   | Requirement                                                                                                                                                                                                                                                                                           |
| --- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| R1  | **The 7-second path.** Every URL is a real, static HTML document. Name, role, three proofs and the CV link are in the prerendered HTML, readable with JavaScript off; on a 390 px screen the proofs sit above the garden.                                                                             |
| R2  | **One canvas survives navigation** between those URLs. The garden is one continuous space; growth is additive and must not reset.                                                                                                                                                                     |
| R3  | **`@thijulio/biome-react` components work unchanged.**                                                                                                                                                                                                                                                |
| R4  | **The Golden Path container stays:** Nx, pnpm, Node 24, strict TypeScript, Vitest, `@thijulio/*` configs, design-system tokens.                                                                                                                                                                       |
| R5  | **Budgets:** JS before first interaction capped by a measured UI budget: provisionally 80 kB compressed, then locked in slice 2 at the measured size + 10% (the handover's 60 kB was dropped by the owner on 2026-10-03, because React alone is ~59 kB [M1]); LCP ≤ 1.8 s (Lighthouse mobile); CLS 0. |
| R6  | **Host:** production on AWS (S3 + CloudFront, Terraform in the website repo, owner decision 2026-10-04); Netlify serves PR and branch previews only. The code must stay portable to Cloudflare Workers if live presence ships later.                                                                                                                                                                     |

Non-goals of this ADR:

- **The renderer.** Ink (Canvas 2D / SVG) versus three.js WebGPU is decided by
  the craft spike (`docs/handover/2026-10-03-craft-spike.md`), not here. This
  ADR only requires that exactly one renderer owns one `<canvas>` for the
  whole visit.
- The hosting move to Cloudflare, the URL grammar, and where the gardener's
  server calls run.

Facts that shape the decision:

- **React's own floor is about 59 kB.** A minimal React 19.2.7 +
  `react-dom/client` `hydrateRoot` bundle, minified by Vite 8, is
  58,785 B gzip / 50,682 B brotli [M1]. Any architecture that hydrates React
  before the first interaction spends most of R5 on React itself, which is
  why R5 is a measured budget and why only interactive components may ship
  JS.
- Astro ships **no JS for a component without a `client:*` directive**, and
  hydrates each island independently (`load`, `idle`, `visible`, `media`,
  `only`) [S6]. Custom directives (for example hydrate-on-click) are supported
  through `addClientDirective` [S21].
- With `<ClientRouter />`, "bundled module scripts … are only ever executed
  once", `window` persists, and `transition:persist` keeps an element (or an
  island "with its current state") across navigations [S3].
- Native cross-document view transitions replace the old document with a new
  one [S16]; a canvas and its GPU context would be recreated on every
  navigation.
- Islands cannot share React context; Astro's recommended answer is Nano
  Stores (< 1 KB, zero dependencies) [S5].

## Decision

Use **Astro 7** for `apps/web`, with **React islands** via `@astrojs/react` 7.
Versions at the time of writing [S1]: `astro` 7.3.5 (Node ≥ 22.12.0),
`@astrojs/react` 7.0.0 (React 17–19 peer),
`nanostores` 1.5.4 + `@nanostores/react` 2.0.1.

1. **Static by default.** `output: 'static'` (Astro's default) prerenders every
   page [S7]. A route opts into on-demand rendering only with
   `export const prerender = false`, and only once the adapter is installed.
   `.astro` files are thin: layout and content composition only.
2. **React islands for UI, never on the 7-second path.** Biome React
   components are used as-is. Rendered without a directive they become static
   HTML with zero JS [S6]. When they need interactivity, they hydrate with
   `client:visible`, `client:idle` or a custom on-interaction directive. All
   islands share one React runtime, and every UI piece is a React component
   (owner answer 1): no hand-written DOM updates beside React. The UI line
   of R5 caps what hydrates before the first interaction.
3. **One canvas, owned outside React.** The shared layout holds one
   `<canvas transition:persist="garden">`, driven by a **bundled module
   script** (a singleton, because bundled scripts run once under the
   ClientRouter [S3]). The engine listens to `astro:before-swap` and
   `astro:page-load` [S3] to follow the route. Bud buttons are real HTML over
   the canvas. React never renders, owns or re-renders the canvas.
4. **Navigation through `<ClientRouter />`**, not native cross-document view
   transitions (which recreate the document, so they fail R2 [S16]). Without
   JS, links are plain `<a>` tags to real HTML pages, so R1 holds regardless.
5. **Shared state through Nano Stores.** The engine, the islands and plain
   scripts share `$route`, `$garden` and `$decision`-style atoms. No
   cross-island React context.
6. **The garden is a pure function.** The scene comes from
   `grow(snapshot, picks, seed)` in a framework-free library, so any context
   loss rebuilds the same garden from state. The renderer is behind an
   interface whose implementation the craft spike chooses.
7. **Framework-free core.** The domain libraries (graph schemas, garden core,
   renderers, gardener) import nothing from `astro`, `astro:*` or `react`. Only
   `apps/web` and the UI islands know the framework. This keeps the exit cheap
   (see "Reversal cost").
8. **Host: AWS for production, Netlify for previews, portable code.** The
   static build is synced to a private S3 bucket behind CloudFront (origin
   access control, a viewer-request CloudFront Function for the apex → www
   301 and directory `index.html`), managed by Terraform in the website repo
   with its own state. Netlify builds PR and branch previews only (no
   production deploys). A fully static Astro site needs no adapter [S8].
   On-demand routes arrive from slice 5 (`/fit` in slice 5, plates in slice 6); how they run on AWS
   (for example the official `@astrojs/node` adapter on Lambda behind the
   same CloudFront, or a community adapter) is decided then (**unverified**).
   Server code uses Web-standard `Request`/`Response`, ESM only, and no host
   SDK outside one host module, so `@astrojs/cloudflare` (Workers only; Pages
   is no longer supported; `workerd` has no CommonJS) can replace it [S10].
9. **CSP at the host, not in Astro.** Astro's built-in CSP does not support
   `<ClientRouter />` [S4]. The policy is set as a response header by a
   CloudFront response headers policy owned by the hosting stack; the deploy
   step writes the current hash set into its CSP value before invalidating
   the cache. Terraform owns the policy and its other headers but ignores
   changes to the CSP value (`ignore_changes`), so a later plan never reverts
   the deployed hashes.
   On-demand responses (from slice 5) set the same policy themselves. Astro emits **inline** `<script>` and
   `<style>` for islands [S14], so the build computes their `sha256` hashes
   from `dist/**/*.html` and writes them into the policy. The policy is
   **one site-wide set**: the union of every page's hashes, served on every
   page. A CSP header binds to the document, and under the ClientRouter the
   visitor stays in the first document while later pages' scripts run inside
   it [S3], so per-page hashes would block them after a navigation. Start
   with `script-src 'self' 'sha256-…'`. `'strict-dynamic'` is not adopted: it
   ignores `'self'` and does not trust parser-inserted scripts [S15], and a
   static host has no per-request nonce.
10. **Nx wired by hand.** No Nx plugin supports Astro 7: `@nxtensions/astro`
    19.0.1 peers Astro 3–4 and Nx 19; `@geekvetica/nx-astro` 2.0.0 peers
    Astro ≥ 5 < 7 [S1]. `apps/web` gets `nx:run-commands` targets (`build`,
    `dev`, `preview`, `typecheck` = `astro check`) with explicit `inputs` and
    `outputs`. `astro build` is the **only writer** of `apps/web/dist`
    (0005-A). Unit tests stay on Vitest through Astro's `getViteConfig()`
    [S20], so `@nx/vitest` inference keeps working.

### Scope

- **In scope:** content-first sites that need per-URL static HTML **and** a
  persistent canvas or other long-lived client state across pages.
- **Out of scope:** app-like products (PMP and similar) stay **React + Vite**
  per [0004](0004-frontend-framework.md). Plain content sites without a
  persistent canvas are not covered either; they need their own evidence
  before reusing this ADR.
- **Radar ring: trial**, one project. Promotion to adopt needs a second
  consumer and green conformance checks (below) for one release.

## Alternatives considered

| Option                                                       | Honest assessment                                                                                                                                                                                                                                                                                                                                                                                                                                     |
| ------------------------------------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Keep the Vite SPA + a prerender step**                     | Smallest change, and R2 is trivial (one document, client routing). But Vite ships no static pre-render command: it is a third-party plugin or a script on Vite's SSR API that we would own [S19]. Every page then hydrates the whole React app: React's ~59 kB floor [M1] plus the code of every component on the page, interactive or not, which is likely over R5 (not measured).                                                                   |
| **React Router 8 framework mode with `prerender`**           | Real HTML per URL [S17], and the canvas can live in the root layout, so R2 is natural. But pages hydrate the root and matched route modules like any SSR app, with no islands. Every component on the page ships its JS, plus the router runtime (size not measured), so R5 is likely exceeded; islands ship only the interactive parts. It also brings in a framework mode the golden path doesn't list (the product default is React Router DOM 6). |
| **Next.js 16 static export**                                 | Per-route HTML, and Server Components render at build. But static export drops Proxy, headers, redirects, rewrites, Server Actions and ISR [S18], and the client still runs React plus the App Router runtime (size not measured, **unverified**). No gain over Astro for a content site, and a heavier platform to run.                                                                                                                              |
| **Angular 22 (prerender + incremental hydration)**           | It would showcase Thiago's deepest stack, and incremental hydration defers JS much like islands. It fails R3: Biome components are React, and 0004 allows Angular wrappers only by the rule of three. The draft's "three.js is React-first" argument does not hold once the canvas lives outside any framework (Decision 3), so R3 is the deciding reason. Revisit if the site's story becomes Angular.                                               |
| **Astro without the ClientRouter (native view transitions)** | Keeps Astro's built-in CSP [S4] and the simplest model. But each navigation is a new document [S16], so the canvas and GPU context are rebuilt on every page. R2 degrades to "regrow on load". Rejected as the default, kept as **Exit A** below.                                                                                                                                                                                                     |

## Consequences

**Good**

- R1 by construction: static HTML per URL, zero JS unless an island asks for it
  [S6][S7].
- R2 with one persisted canvas and a singleton engine [S3].
- R3: Biome React components unchanged, as static HTML or islands.
- R4: Nx, pnpm, Node 24, TypeScript, Vitest and `@thijulio` configs stay.
  Astro 7 builds on Vite 8 [S2], which the repo already uses.
- Content collections validate data with Zod 4 schemas and `glob()`/`file()`
  loaders [S23], which fits the public evidence snapshot.

**Costs**

- **GPU context loss is a design input.** Handled by the pure `grow()`
  (Decision 6) and tested (see "Conformance").
- **No built-in CSP** (Decision 9): a build step owns the inline-script hashes,
  and on-demand routes set headers in middleware.
- **Nx by hand** (Decision 10): about four targets to maintain. No plugin
  inference for `apps/web`.
- **Two hosts.** Production on AWS, previews on Netlify: two build targets
  to keep equivalent. Accepted because Netlify's Free plan caps production
  deploys and bandwidth with a shared monthly credit pool that pauses every
  project when exhausted, while previews cost nothing there [S24]. On-demand work
  (from slice 5) needs its own AWS design; launch pages are static, plates are
  cached immutable, and until the eval set exists the gardener's numbers come
  from the rules table in the snapshot, client-side.
- **React's ~59 kB floor** [M1] is paid once, before the first interaction,
  for every visit; the measured UI budget (owner answer 1) is what keeps the
  rest of the islands honest.
- **One more tool** on the radar, plus `.astro` lint and format tooling (below).

**Migration of `apps/web` (concrete)**

- Remove `index.html`, `vite.config.mts`, `src/main.tsx` and `src/app/**`
  (template sections superseded by the new design; `app.spec.tsx` goes with
  them). Add `astro.config.mjs`, `src/pages/`, `src/layouts/` and
  `vitest.config.ts` (`getViteConfig`).
- Dependencies: `astro`, `@astrojs/react`, `@astrojs/check`, `nanostores`,
  `@nanostores/react`. The on-demand adapter comes with slice 5.
- `nx.json`: `@nx/vite/plugin` stops inferring `apps/web` (no Vite config).
  It stays for Vite libraries. Add `nx:run-commands` targets as above.
- Root `package.json` `engines.node` was raised from `>=22` to `>=24` (0001)
  in slice 0.
- `.gitignore`: add `.astro/`.
- `netlify.toml` (previews): `publish = "apps/web/dist"` holds for static
  output. Production deploys are an S3 sync plus a CloudFront invalidation
  from CI (slice 2).
- Lint and format: `eslint-plugin-astro` ≥ 2 requires ESLint ≥ 10; `thijulio/website`
  runs ESLint 9.39.5, and 1.7.0 is the last line that accepts ESLint 9 [S1].
  Either pin 1.7.x or move `@thijulio/eslint-config` to ESLint 10 (a
  dev-tooling change). Whether 1.7.x and `prettier-plugin-astro` 1.1.0 parse
  Astro 7's Rust-compiler output correctly is **unverified**.

## Risks and mitigations

| Risk                                                                                        | Mitigation                                                                                                                                                                                                                                                                                                                                        |
| ------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Safari loses the GPU context of a persisted canvas** on body swap (#15727 [S12])          | Fixed upstream: PR #15728 (merged 2026-03-05) moves persisted elements onto `<html>` before the swap, and that code is in 7.3.5's `swap-functions.js` [S12]. Real-Safari behaviour is **unverified** here. Keep the regrow-from-`grow()` path, and run the persistence test on WebKit in CI plus real Safari/iOS before each slice ships.         |
| **A persisted React island stops updating its DOM** (#13287 [S13])                          | Closed 2025-08-24 for lack of a reproduction, not fixed [S13]. It doesn't matter here: the canvas is not a React island (Decision 3). React islands that persist are avoided; if one is needed, it gets its own persistence test.                                                                                                                 |
| **R5 fails** because React hydrates before the first interaction                            | Decision 2 policy plus a CI budget gate. Escape hatches, in order: move non-critical islands to a custom on-interaction directive [S21]; split islands so static parts render without a directive; Preact compat for islands (Biome compatibility **unverified**, and it bends R3). Engine-driven DOM beside React is ruled out (owner answer 1). |
| **CSP drift**: an inline hash changes and the page silently breaks                          | The hash step runs in the build and writes one site-wide union. A Playwright test loads every prerendered page, directly and after a ClientRouter navigation, under the production header and fails on any `securitypolicyviolation`.                                                                                                             |
| **Nx targets rot** (wrong inputs/outputs, false cache hits)                                 | Explicit `inputs` (including `astro.config.mjs`, `src/**`, the snapshot JSON and `{workspaceRoot}/tsconfig.base.json`) and `outputs` (`dist`). Check that a no-change rerun is a cache hit and a snapshot change is a miss. A local `createNodesV2` plugin only if a second Astro app appears.                                                    |
| **Host lock-in to AWS**                                                                     | Decision 8 rules. Hosting lives in one Terraform stack and one deploy step; no AWS SDK in site code outside one host module.                                                                                                                                                                                                                                          |
| **Ecosystem risk**: Astro was acquired by Cloudflare (Jan 2026)                             | Astro remains MIT and committed to multi-host deploys [S11]. The static build needs no adapter; the on-demand adapter is chosen in slice 5. Exit B covers the worst case.                                                                                                                           |
| **The Rust compiler rejects sloppy markup** (no auto-correction, JSX-style strictness) [S2] | Accepted; it enforces valid HTML, which R1 and accessibility want anyway.                                                                                                                                                                                                                                                                         |

## Reversal cost and exit plan

Triggers: R2 cannot be held on WebKit/Safari after the mitigations; R5 cannot
be met with React islands; or Astro stalls.

- **Exit A, stay on Astro, drop the ClientRouter** (hours to days): use native
  cross-document view transitions and regrow the garden from `grow()` on every
  page load. This regains Astro's built-in CSP [S4] and degrades R2 from "one
  living canvas" to "same garden, redrawn".
- **Exit B, leave Astro** (days, estimated, not measured): move to React Router
  framework mode with `prerender` or a Vite SSR prerender script. Only the thin
  `.astro` layouts and pages (about 6 route types in v1) are rewritten as TSX.
  Domain libraries, renderers and Biome islands move unchanged (Decision 7).
  R5 then needs its own answer (the React floor [M1]).
- **Host exit, AWS to Netlify or Cloudflare** (hours for the static site,
  days with on-demand routes): point the build at the other host, move the
  security headers to its config, swap the adapter if one is in use, and
  re-point DNS.

The cost stays at that size only while Decision 7 is enforced (see
"Conformance").

## How conformance is checked

| Check                    | Mechanism                                                                                                                                                                                                                                                                                                                                                                                                                                        |
| ------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **7-second path (R1)**   | Playwright, `javaScriptEnabled: false`, at desktop and 390 px. The raw HTML and the rendered page contain the H1 name, positioning, three proofs and the CV link. At 390 px the proofs' box sits above the garden's box. Runs in CI from slice 2.                                                                                                                                                                                                |
| **JS budget (R5)**       | Playwright with JS on, no input, at `/` (desktop + 390 px). Sum the gzip size of every JS resource requested before the first interaction, reported in two lines: UI (islands, router, stores) and garden engine (renderer). Fail the UI line above its budget (80 kB until slice 2 locks the measured size + 10%; answer 1). The engine line is reported and gets its own budget with the renderer decision (answer 3). Same run asserts CLS 0. |
| **Canvas survives (R2)** | Playwright on Chromium **and WebKit**: navigate `/` → `/brief` → `/` through the ClientRouter. Assert it is the same `<canvas>` node (a marker set at boot), the engine booted once, and grown branches are unchanged.                                                                                                                                                                                                                           |
| **Context loss**         | Force the renderer's context loss in a test. The scene rebuilt from `grow()` deep-equals the scene before the loss (compare data, not pixels).                                                                                                                                                                                                                                                                                                   |
| **Framework-free core**  | Lint rule (`no-restricted-imports`) in the domain libraries forbidding `astro`, `astro:*`, `react` and `react-dom`.                                                                                                                                                                                                                                                                                                                              |
| **CSP**                  | Under the production header, every prerendered page loads directly **and** is reached from `/` through the ClientRouter (one navigation per route type), with zero `securitypolicyviolation` events.                                                                                                                                                                                                                                             |
| **Nx**                   | `nx build web` twice gives a cache hit; touching the snapshot gives a miss. `nx typecheck web` runs `astro check` with no emit.                                                                                                                                                                                                                                                                                                                  |
| **Scope**                | A second project adopting Astro amends this ADR or opens a new one before it lands on the radar's adopt ring.                                                                                                                                                                                                                                                                                                                                    |

## Owner answers at acceptance (2026-10-03)

1. **React everywhere; the UI budget is measured.** Every UI piece, including
   the gardener note and the legend, is a React component; islands may
   hydrate on idle or visible. Everything requested before the first
   interaction counts toward the UI line of R5. The budget is as big as the
   site needs, set by measurement: 80 kB gzip provisionally; slice 2 measures
   the real UI bundle and locks the budget at that size + 10%. Raising it
   later is a deliberate, recorded change (one line with the reason), never a
   silently loosened check. Text still paints from static HTML before any JS,
   so the LCP and CLS targets are unchanged.
2. **Server code: Astro endpoints/actions**, not host-specific functions, so
   on-demand code stays portable across adapters and hosts.
3. **Still open: does the garden engine count toward the UI budget?** The craft
   spike measures each renderer's size and load time; the owner sets the
   engine's budget together with the renderer decision. Until then the CI
   check reports UI and engine separately and fails only the UI line.

Tooling notes from acceptance: `.astro` lint pins `eslint-plugin-astro` 1.7.x
while the repo is on ESLint 9; moving `@thijulio/eslint-config` to ESLint 10 is
a separate dev-tooling decision.

## Sources

Checked 2026-10-03.

- **[S1]** npm registry (`npm view`): astro 7.3.5 (engines node ≥ 22.12.0);
  @astrojs/react 7.0.0 (peers react/react-dom ^17 ‖ ^18 ‖ ^19); @astrojs/netlify
  8.2.6 (peer astro ^7.0.0, published 2026-09-16); @astrojs/cloudflare 14.3.3
  (peers astro ^7.2.0, wrangler ^4.125.0); nanostores 1.5.4; @nanostores/react
  2.0.1; @astrojs/check 0.9.10; @nxtensions/astro 19.0.1 (peers astro ^3 ‖ ^4,
  nx ^19); @geekvetica/nx-astro 2.0.0 (peers astro ≥ 5 < 7, nx ≥ 21);
  eslint-plugin-astro 3.2.1 (peer eslint ≥ 10; 1.7.0 = last with eslint
  ≥ 8.57); prettier-plugin-astro 1.1.0; react-router 8.4.0; next 16.3.8;
  @angular/core 22.2.1.
- **[S2]** Astro 7 release (22 Jun 2026; Rust compiler, Vite 8 + Rolldown,
  compiler breaking changes): https://astro.build/blog/astro-7/
- **[S3]** View transitions / ClientRouter, `transition:persist`, lifecycle
  events: https://docs.astro.build/en/guides/view-transitions/
- **[S4]** `security.csp`: "Astro's view transitions using the
  `<ClientRouter />` are not supported":
  https://docs.astro.build/en/reference/configuration-reference/#securitycsp
- **[S5]** Sharing state between islands (Nano Stores):
  https://docs.astro.build/en/recipes/sharing-state-islands/
- **[S6]** Client directives; no directive = no JS:
  https://docs.astro.build/en/reference/directives-reference/
- **[S7]** Static default and per-route `prerender`:
  https://docs.astro.build/en/guides/on-demand-rendering/
- **[S8]** `@astrojs/netlify` (Functions; `middlewareMode: 'edge'`; static
  sites usually need no adapter; `staticHeaders` tied to Astro CSP):
  https://docs.astro.build/en/guides/integrations-guide/netlify/. The output
  path `.netlify/v1/` under the Astro root was read from the 8.2.6 package
  (`dist/index.js`).
- **[S9]** Netlify on Astro (on-demand rendering = Netlify Functions):
  https://docs.netlify.com/build/frameworks/framework-setup-guides/astro/
- **[S10]** `@astrojs/cloudflare` (Workers only, `workerd`, no CommonJS):
  https://docs.astro.build/en/guides/integrations-guide/cloudflare/
- **[S11]** Astro joins Cloudflare (16 Jan 2026; MIT, multi-host):
  https://astro.build/blog/joining-cloudflare/
- **[S12]** Safari persisted-canvas context loss: issue
  https://github.com/withastro/astro/issues/15727 (closed 2026-03-05); fix
  https://github.com/withastro/astro/pull/15728 (merged 2026-03-05). Fix
  logic confirmed in astro 7.3.5 `dist/transitions/swap-functions.js`.
- **[S13]** Persisted React island not updating:
  https://github.com/withastro/astro/issues/13287 (closed 2025-08-24, "needs
  reproduction").
- **[S14]** Inline island scripts and styles: astro 7.3.5
  `dist/runtime/server/scripts.js` emits `<style>…</style><script>…</script>`
  for island hydration (read from the published package).
- **[S15]** `'strict-dynamic'` ignores host sources, `'self'` and
  `'unsafe-inline'`, and does not trust parser-inserted scripts:
  https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers/Content-Security-Policy/script-src
- **[S16]** Cross-document view transitions replace the document:
  https://developer.mozilla.org/en-US/docs/Web/API/View_Transition_API/Using
- **[S17]** React Router pre-rendering (v8.4.0 docs):
  https://reactrouter.com/how-to/pre-rendering
- **[S18]** Next.js static export, unsupported features (16.3.8 docs):
  https://nextjs.org/docs/app/guides/static-exports
- **[S19]** Vite SSR guide (pre-rendering is a demo script, not a built-in
  command): https://vite.dev/guide/ssr
- **[S20]** Testing with Astro (Vitest via `getViteConfig`; Playwright):
  https://docs.astro.build/en/guides/testing/
- **[S21]** `addClientDirective` (custom client directives):
  https://docs.astro.build/en/reference/integrations-reference/
- **[S22]** Netlify custom headers apply only to static files, not to
  Function/SSR responses: https://docs.netlify.com/manage/routing/headers/
- **[M1]** Local measurement, 2026-10-03: `react@19.2.7` +
  `react-dom@19.2.7/client`, an entry calling `hydrateRoot` on one element,
  built with `thijulio/website`'s Vite 8 in production mode: 189,503 B minified,
  58,785 B `gzip -9`, 50,682 B brotli.
- **[S23]** Content collections (Zod 4 via `astro/zod`; `glob()`/`file()`
  loaders): https://docs.astro.build/en/guides/content-collections/
- **[S24]** Netlify credit-based plans (Free: 300 credits a month, production
  deploy 15 credits, previews and branch deploys 0, bandwidth 20 credits per
  GB; exhausted credits pause every project), read 2026-10-04:
  https://docs.netlify.com/manage/accounts-and-billing/billing/billing-for-credit-based-plans/how-credits-work/
