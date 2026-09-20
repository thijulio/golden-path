export interface RadarItem { tech: string; scope: string; }
export interface Ring { name: string; cls: string; items: RadarItem[]; }

export const radar: Ring[] = [
  { name: 'Adopt', cls: 'adopt', items: [
    { tech: 'Node 24', scope: 'universal' },
    { tech: 'TypeScript (strict)', scope: 'universal' },
    { tech: 'pnpm', scope: 'universal' },
    { tech: 'Nx', scope: 'universal' },
    { tech: 'Vite + React 19 (default) / Vue / Angular', scope: 'frontend' },
    { tech: 'Vitest', scope: 'testing (default)' },
    { tech: '@thijulio design system', scope: 'styling' },
    { tech: '@thijulio configs (eslint / prettier / tsconfig)', scope: 'tooling' },
    { tech: 'AI Toolbox (agents / skills / references)', scope: 'agent assets' },
    { tech: 'NestJS 11 + Prisma 5 + PostgreSQL 16', scope: 'product backend' },
    { tech: 'Zustand + TanStack React Query', scope: 'product state' },
    { tech: 'AWS eu-west-3 + Terraform', scope: 'product infra' },
  ]},
  { name: 'Trial', cls: 'trial', items: [] },
  { name: 'Assess', cls: 'assess', items: [] },
  { name: 'Hold', cls: 'hold', items: [
    { tech: 'Tailwind', scope: 'replaced by the design system; legacy in PMP' },
    { tech: 'Node 22', scope: 'migrating to 24' },
    { tech: 'Jest (frontend)', scope: 'Vitest is the default' },
    { tech: 'MongoDB / Mongoose', scope: 'old tutorial era; PostgreSQL is the default' },
  ]},
];
