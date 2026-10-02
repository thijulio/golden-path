export interface Adr { id: string; title: string; status: string; date: string; summary: string; }

export const adrs: Adr[] = [
  { id: '0001', title: 'Node 24 is the standard runtime', status: 'accepted', date: '2026-09-20', summary: 'Node 24 canonical for every new project and tooling; 22 is legacy.' },
  { id: '0002', title: 'Vitest is the default test runner', status: 'accepted', date: '2026-09-20', summary: 'Vitest default; Jest only where NestJS requires; node --test for pure CLI.' },
  { id: '0003', title: 'Design system is the single styling source', status: 'accepted', date: '2026-09-20', summary: 'Design system via tokens + CSS vars; Tailwind is hold and being removed.' },
  { id: '0004', title: 'Frontend framework is a per-project choice', status: 'accepted', date: '2026-09-20', summary: 'React 19 default; Vue/Angular accepted. The container is the constraint.' },
  { id: '0005', title: 'Nx typecheck: one writer per output tree, complete inputs', status: 'accepted', date: '2026-10-02', summary: 'tsc never writes a bundler\'s outDir; tool outputs gitignored; typecheck inputs include spec files and tsconfig.base.json.' },
  { id: '0006', title: 'nx release only bumps packages that really changed', status: 'accepted', date: '2026-10-02', summary: 'projectsAffectedByDependencyUpdates auto, run-many on lockfile change, split tooling by consumer, non-releasing root-config commits, format files nx release stages.' },
  { id: '0007', title: 'Roadmaps live in docs/roadmap; delivery uses GitHub milestones', status: 'accepted', date: '2026-10-02', summary: 'Roadmaps are versioned documents under docs/roadmap/, never GitHub issues. Milestones group implementation issues and PRs and link to roadmap documents.' },
];
