import { Routes } from '@angular/router';

export const routes: Routes = [
    { path: '', redirectTo: 'home', pathMatch: 'full' },
    { path: 'home', loadComponent: () => import('./pages/home/home').then(m => m.Home) },
    { path: 'tools', loadComponent: () => import('./pages/tools/tools').then(m => m.Tools) },
    { path: 'tools/log-cleaner', loadComponent: () => import('./pages/log-cleaner/log-cleaner').then(m => m.LogCleaner)}
];
