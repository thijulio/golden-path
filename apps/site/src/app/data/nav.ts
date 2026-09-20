export interface NavItem { label: string; path: string; }
export interface NavGroup { title: string; items: NavItem[]; }

export const navGroups: NavGroup[] = [
  { title: 'Golden Path', items: [{ label: 'Overview', path: '/' }] },
  { title: 'Decisions', items: [
    { label: 'Stack & Decisions', path: '/stack' },
    { label: 'Tech Radar', path: '/tech-radar' },
    { label: 'ADRs', path: '/adrs' },
  ]},
  { title: 'Execution', items: [{ label: 'Deployment & Accounts', path: '/deployment' }] },
  { title: 'Assets', items: [{ label: 'AI Toolbox', path: '/ai-toolbox' }] },
];
