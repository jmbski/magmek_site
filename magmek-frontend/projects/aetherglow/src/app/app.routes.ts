import { Routes } from '@angular/router';

export const routes: Routes = [
    { path: '', redirectTo: 'home', pathMatch: 'full' },
    { path: 'home', loadComponent: () => import('./pages/home/home').then(m => m.Home) },
    { path: 'tools', loadComponent: () => import('./pages/tools/tools').then(m => m.Tools) },
    { path: 'tools/log-cleaner', loadComponent: () => import('./pages/log-cleaner/log-cleaner').then(m => m.LogCleaner)},
    { path: 'dress-code', loadComponent: () => import('./pages/dress-code/dress-code').then(m => m.DressCode)},
    { path: 'character-details', loadComponent: () => import('./pages/character-details/character-details').then(m => m.CharacterDetails)},
    { path: 'factions', loadComponent: () => import('./pages/factions/factions').then(m => m.Factions)},
    { path: 'locations', loadComponent: () => import('./pages/locations/locations').then(m => m.Locations)},
    { path: 'world-overview', loadComponent: () => import('./pages/world-overview/world-overview').then(m => m.WorldOverview)},
    { path: 'rp-etiquette', loadComponent: () => import('./pages/rp-etiquette/rp-etiquette').then(m => m.RpEtiquette)},
];
