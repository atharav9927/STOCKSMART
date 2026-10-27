import { Routes } from '@angular/router';
import { authGuard, guestGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  {
    path: 'login',
    canActivate: [guestGuard],
    loadComponent: () =>
      import('./features/auth/login/login.component').then(m => m.LoginComponent),
  },
  {
    path: '',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./shell/app-shell.component').then(m => m.AppShellComponent),
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      {
        path: 'dashboard',
        loadComponent: () =>
          import('./features/dashboard/dashboard.component').then(m => m.DashboardComponent),
      },
      {
        path: 'profile',
        loadComponent: () =>
          import('./features/auth/profile/profile.component').then(m => m.ProfileComponent),
      },
      // Catalog routes placeholder redirects for Phase 0
      {
        path: 'catalog',
        children: [
          { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
          { path: 'products', redirectTo: '/dashboard', pathMatch: 'full' },
          { path: 'categories', redirectTo: '/dashboard', pathMatch: 'full' },
          { path: 'brands', redirectTo: '/dashboard', pathMatch: 'full' },
        ],
      },
      // Inventory routes placeholder redirects for Phase 0
      {
        path: 'inventory',
        children: [
          { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
          { path: 'stock', redirectTo: '/dashboard', pathMatch: 'full' },
          { path: 'locations', redirectTo: '/dashboard', pathMatch: 'full' },
          { path: 'movements', redirectTo: '/dashboard', pathMatch: 'full' },
          { path: 'adjustments', redirectTo: '/dashboard', pathMatch: 'full' },
          { path: 'transfers', redirectTo: '/dashboard', pathMatch: 'full' },
          { path: 'counts', redirectTo: '/dashboard', pathMatch: 'full' },
        ],
      },
      // Procurement routes placeholder redirects for Phase 0
      {
        path: 'procurement',
        children: [
          { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
          { path: 'orders', redirectTo: '/dashboard', pathMatch: 'full' },
          { path: 'suggestions', redirectTo: '/dashboard', pathMatch: 'full' },
        ],
      },
      { path: 'suppliers', redirectTo: '/dashboard', pathMatch: 'full' },
      { path: 'orders', redirectTo: '/dashboard', pathMatch: 'full' },
      { path: 'scan', redirectTo: '/dashboard', pathMatch: 'full' },
      { path: 'identification/barcodes', redirectTo: '/dashboard', pathMatch: 'full' },
      { path: 'reports', redirectTo: '/dashboard', pathMatch: 'full' },
      { path: 'reports/kpis', redirectTo: '/dashboard', pathMatch: 'full' },
      { path: 'reports/valuation', redirectTo: '/dashboard', pathMatch: 'full' },
      { path: 'reports/stockouts', redirectTo: '/dashboard', pathMatch: 'full' },
      { path: 'alerts', redirectTo: '/dashboard', pathMatch: 'full' },
      { path: 'admin/users', redirectTo: '/dashboard', pathMatch: 'full' },
      { path: 'admin/audit', redirectTo: '/dashboard', pathMatch: 'full' },
      { path: 'admin/reason-codes', redirectTo: '/dashboard', pathMatch: 'full' },
      {
        path: 'forbidden',
        loadComponent: () =>
          import('./features/auth/forbidden/forbidden.component').then(m => m.ForbiddenComponent),
      },
    ],
  },
  {
    path: '**',
    loadComponent: () =>
      import('./features/auth/not-found/not-found.component').then(m => m.NotFoundComponent),
  },
];
