export interface UniversalDecision { domain: string; choice: string; notes: string; }
export interface StackRow { layer: string; choice: string; }

export const universal: UniversalDecision[] = [
  { domain: 'Runtime', choice: 'Node 24', notes: 'Node 22 is legacy, migrating.' },
  { domain: 'Language', choice: 'TypeScript (strict)', notes: 'via @thijulio/tsconfig.' },
  { domain: 'Package manager', choice: 'pnpm', notes: '' },
  { domain: 'Monorepo', choice: 'Nx', notes: 'targets from plugin inference.' },
  { domain: 'Lint / format', choice: '@thijulio/eslint-config + @thijulio/prettier-config', notes: 'zero any / suppressions.' },
  { domain: 'Styling', choice: 'Design system @thijulio (tokens → CSS vars)', notes: 'Tailwind = hold.' },
  { domain: 'Tests', choice: 'Vitest (default)', notes: 'Jest only if NestJS requires; node --test for pure CLI.' },
  { domain: 'Publishing', choice: 'GitHub Packages, scope @thijulio', notes: 'nx release, conventional commits.' },
  { domain: 'Git', choice: 'Conventional Commits', notes: 'no direct push to main.' },
];

export const lightTier: string[] = [
  'pnpm · Nx · Vite · React 19 (default) / Vue / Angular · Vitest · SWC · @thijulio configs + design system',
  'No NestJS, no Prisma, no Tailwind, no Storybook.',
];

export const lightDefaults: StackRow[] = [
  { layer: 'Database', choice: 'Neon (Postgres serverless)' },
  { layer: 'ORM', choice: 'Drizzle' },
  { layer: 'Storage', choice: 'Cloudflare R2 (S3 only where it already exists)' },
  { layer: 'Auth', choice: 'Netlify Identity (Google) — Supabase Auth only for OTP/magic-link products' },
  { layer: 'Region', choice: 'eu-west-3 (user data) / eu-west-1 (assets, IA)' },
];

export const productTier: StackRow[] = [
  { layer: 'Backend', choice: 'NestJS 11 (BFF + services)' },
  { layer: 'ORM / DB', choice: 'Prisma 5 + PostgreSQL 16' },
  { layer: 'Client state', choice: 'Zustand' },
  { layer: 'Server state', choice: 'TanStack React Query' },
  { layer: 'Routing', choice: 'React Router DOM 6' },
  { layer: 'i18n', choice: 'i18next + react-i18next (locale in URL)' },
  { layer: 'Observability', choice: 'Sentry' },
  { layer: 'Component catalog', choice: 'Storybook' },
  { layer: 'Cloud / IaC', choice: 'AWS eu-west-3 (Lambda, API GW v2, RDS + RDS Proxy, S3/CloudFront) + Terraform' },
  { layer: 'CI/CD', choice: 'GitHub Actions + OIDC (no static keys)' },
  { layer: 'Auth', choice: 'Cookie-based JWT (HTTP-only, argon2, class-validator)' },
];
