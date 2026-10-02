export interface Adr {
  id: string;
  title: string;
  status: string;
  date: string;
  summary: string;
}

export const adrs: Adr[] = [
  {
    id: '0001',
    title: 'Node 24 is the standard runtime',
    status: 'accepted',
    date: '2026-09-20',
    summary: 'Node 24 canonical for every new project and tooling; 22 is legacy.',
  },
  {
    id: '0002',
    title: 'Vitest is the default test runner',
    status: 'accepted',
    date: '2026-09-20',
    summary: 'Vitest default; Jest only where NestJS requires; node --test for pure CLI.',
  },
  {
    id: '0003',
    title: 'Design system is the single styling source',
    status: 'accepted',
    date: '2026-09-20',
    summary: 'Design system via tokens + CSS vars; Tailwind is hold and being removed.',
  },
  {
    id: '0004',
    title: 'Frontend framework is a per-project choice',
    status: 'accepted',
    date: '2026-09-20',
    summary: 'React 19 default; Vue/Angular accepted. The container is the constraint.',
  },
  {
    id: '0005',
    title: 'Portable delivery context and evidence ownership',
    status: 'proposed',
    date: '2026-10-02',
    summary:
      'One repository-owned contract, private provenance, pinned code references, bounded link checks and separate implementation/review/release evidence; stack unchanged.',
  },
  {
    id: '0006',
    title: 'Isolated database delivery and permission evidence',
    status: 'proposed',
    date: '2026-10-02',
    summary:
      'Disposable target markers, checksummed direct-client migrations and real PostgreSQL role/concurrency/rollback evidence; independent review required, existing stack unchanged.',
  },
];
