import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', pathMatch: 'full', title: 'Golden Path', loadComponent: () => import('./pages/overview/overview').then(m => m.Overview) },
  { path: 'stack', title: 'Stack & Decisions — Golden Path', loadComponent: () => import('./pages/stack/stack').then(m => m.Stack) },
  { path: 'tech-radar', title: 'Tech Radar — Golden Path', loadComponent: () => import('./pages/tech-radar/tech-radar').then(m => m.TechRadar) },
  { path: 'deployment', title: 'Deployment & Accounts — Golden Path', loadComponent: () => import('./pages/deployment/deployment').then(m => m.Deployment) },
  { path: 'adrs', title: 'ADRs — Golden Path', loadComponent: () => import('./pages/adrs/adrs').then(m => m.Adrs) },
  { path: 'ai-toolbox', title: 'AI Toolbox — Golden Path', loadComponent: () => import('./pages/ai-toolbox/ai-toolbox').then(m => m.AiToolbox) },
  { path: '**', redirectTo: '' },
];
