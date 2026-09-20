export interface Repo { name: string; role: string; status: 'exists' | 'create'; note?: string; }
export interface Service { name: string; exists: boolean; toCreate?: string; credential: string; where: string; }

export const repos: Repo[] = [
  { name: 'website', role: 'site / portfolio', status: 'exists', note: 'scope not yet defined.' },
  { name: 'dev-tooling', role: 'configs @thijulio/*', status: 'exists', note: 'v0.0.1 unpublished — publish before scaffolding.' },
  { name: 'design-systems', role: 'design system (biome / exodus)', status: 'exists', note: 'published 0.0.2.' },
  { name: 'thijulio-ai-toolbox', role: 'agents / skills / references', status: 'exists' },
  { name: 'pet-management-platform', role: 'canonical SaaS (product)', status: 'exists' },
  { name: 'pet-management-platform-infra', role: 'Terraform for PMP', status: 'exists' },
  { name: 'aws-account-bootstrap', role: 'AWS account bootstrap', status: 'exists' },
  { name: 'thiago-library', role: 'library (Sheets + Netlify)', status: 'exists', note: 'live.' },
  { name: 'thiago-smart-library', role: 'smart library (AI-first)', status: 'exists', note: 'repo created, empty.' },
  { name: 'personal-library', role: 'legacy AIF-C01', status: 'exists', note: 'historical — do not touch.' },
  { name: 'publications', role: 'articles / talks', status: 'exists' },
  { name: 'painter-studio', role: 'painting app', status: 'exists', note: 'checkout in iCloud — move to ~/development/painter-studio.' },
  { name: 'maison-feline', role: 'cat sitting (pet-sitting)', status: 'create', note: 'create now via create-external-repo.' },
  { name: 'templates', role: 'golden path scaffolds', status: 'create', note: 'future — decide name.' },
];

export const services: Service[] = [
  { name: 'GitHub org', exists: true, credential: 'PAT (repo, workflow, read:packages)', where: 'GitHub Secrets / .npmrc' },
  { name: 'Netlify', exists: true, toCreate: 'maison-feline, painter-studio (link), smart-library (build)', credential: 'NETLIFY_AUTH_TOKEN, NETLIFY_SITE_ID', where: 'GitHub Secrets / site env' },
  { name: 'Neon', exists: false, toCreate: 'maison-feline, smart-library, painter-studio (if Neon)', credential: 'connection string', where: 'Netlify env / .env' },
  { name: 'Supabase', exists: false, toCreate: 'auth maison-feline, DB painter-studio (if chosen)', credential: 'SUPABASE_URL, SUPABASE_ANON_KEY, SUPABASE_SERVICE_ROLE_KEY', where: 'Netlify env / .env' },
  { name: 'AWS', exists: true, toCreate: 'S3 painter-studio, Bedrock maison-feline, product tier via Terraform', credential: 'AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY, AWS_REGION', where: '.env / Secrets' },
  { name: 'Cloudflare R2', exists: false, toCreate: 'bucket maison-feline (if R2)', credential: 'R2_ACCOUNT_ID, R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY, R2_BUCKET, R2_ENDPOINT', where: '.env' },
  { name: 'Stripe', exists: false, toCreate: 'maison-feline', credential: 'STRIPE_SECRET_KEY, STRIPE_PUBLISHABLE_KEY, STRIPE_WEBHOOK_SECRET', where: '.env / Netlify env' },
  { name: 'Resend', exists: false, toCreate: 'maison-feline', credential: 'RESEND_API_KEY', where: '.env / Netlify env' },
  { name: 'Sentry', exists: false, toCreate: 'maison-feline, PMP', credential: 'SENTRY_DSN, SENTRY_AUTH_TOKEN, SENTRY_ORG, SENTRY_PROJECT', where: '.env / Netlify env' },
  { name: 'Google Cloud OAuth', exists: true, toCreate: 'painter-studio, maison-feline (if Identity)', credential: 'NETLIFY_GOOGLE_CLIENT_ID, NETLIFY_GOOGLE_CLIENT_SECRET', where: 'Netlify env' },
  { name: 'Google Sheets / Drive', exists: true, credential: 'service account / OAuth', where: '.env / Functions' },
  { name: 'IA (Bedrock / OpenAI / DeepSeek)', exists: true, toCreate: 'Bedrock maison-feline', credential: 'provider keys', where: '.env / Netlify env' },
  { name: 'Analytics (Plausible / PostHog)', exists: false, toCreate: 'maison-feline', credential: 'public site key', where: '.env' },
  { name: 'Google Search Console', exists: false, toCreate: 'maison-feline (phase 2)', credential: 'domain verification', where: 'n/a' },
  { name: 'Route53 (DNS)', exists: true, toCreate: 'subdomain per project (*.thijulio.com)', credential: 'CNAME', where: '—' },
];
