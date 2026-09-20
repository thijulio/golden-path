import { Component } from '@angular/core';
import { repos, services } from '../../data/inventory';

export interface EnvVar { group: string; variable: string; clientSafe: boolean; }

const envVars: EnvVar[] = [
  { group: 'App', variable: '*_PUBLIC_* / VITE_* (URL, brand, public keys)', clientSafe: true },
  { group: 'DB', variable: 'DATABASE_URL', clientSafe: false },
  { group: 'Supabase', variable: 'SUPABASE_URL, SUPABASE_ANON_KEY', clientSafe: true },
  { group: 'Supabase', variable: 'SUPABASE_SERVICE_ROLE_KEY', clientSafe: false },
  { group: 'AWS', variable: 'AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY, AWS_REGION', clientSafe: false },
  { group: 'R2', variable: 'R2_ACCOUNT_ID, R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY, R2_BUCKET, R2_ENDPOINT', clientSafe: false },
  { group: 'Stripe', variable: 'STRIPE_SECRET_KEY, STRIPE_WEBHOOK_SECRET', clientSafe: false },
  { group: 'Stripe', variable: 'STRIPE_PUBLISHABLE_KEY', clientSafe: true },
  { group: 'Email', variable: 'RESEND_API_KEY', clientSafe: false },
  { group: 'Sentry', variable: 'SENTRY_DSN', clientSafe: true },
  { group: 'Sentry', variable: 'SENTRY_AUTH_TOKEN, SENTRY_ORG, SENTRY_PROJECT', clientSafe: false },
  { group: 'GCP OAuth', variable: 'NETLIFY_GOOGLE_CLIENT_ID, NETLIFY_GOOGLE_CLIENT_SECRET', clientSafe: false },
  { group: 'IA', variable: 'AWS_ACCESS_KEY_ID (Bedrock) / OPENAI_API_KEY / DEEPSEEK_API_KEY', clientSafe: false },
  { group: 'Analytics', variable: '*_PUBLIC_POSTHOG_KEY / *_PUBLIC_PLAUSIBLE_DOMAIN', clientSafe: true },
  { group: 'Netlify / CI', variable: 'NETLIFY_AUTH_TOKEN, NETLIFY_SITE_ID, NODE_AUTH_TOKEN', clientSafe: false },
];

const security: string[] = [
  'No secrets in git; gitleaks in CI.',
  'DATABASE_URL and server-only keys never in *_PUBLIC_*/VITE_*.',
  'AI key never in the browser; server routes/functions only.',
  'Signed upload/download URLs with short expiry.',
  'Automatic backups (Neon/Supabase/RDS) and storage.',
  'Budget/limit alert on AI and AWS billing; error alert on Sentry.',
  'Dependabot/renovate + secret scanning.',
  'Product tier: least-privilege IAM + OIDC (no static keys).',
];

const dod: string[] = [
  'dev-tooling published (v0.1.0) before any new scaffold.',
  'Repo(s) created under ~/development/ and pushed; linked-repos.yaml updated.',
  'Database created (Neon/Supabase/RDS) with migration + seed.',
  'Netlify (or AWS) site with envs, custom domain *.thijulio.com, one deploy OK.',
  '.env.example complete + .env local (no secrets committed).',
  'CI/CD: typecheck, lint, test, build, deploy.',
  'Sentry + analytics initialized (when applicable).',
  'Open decisions resolved or recorded with an owner.',
  'Setup ADR created (references/architecture-decision-record.md).',
  'No secrets in the repository (verification run).',
];

@Component({
  selector: 'app-deployment',
  styleUrl: './deployment.scss',
  templateUrl: './deployment.html',
})
export class Deployment {
  protected readonly repos = repos;
  protected readonly services = services;
  protected readonly envVars = envVars;
  protected readonly security = security;
  protected readonly dod = dod;
}
