import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'admin',
    loadChildren: () => import('./admin/admin.routes'),
  },
  {
    path: 'auth',
    loadChildren: () => import('./auth/auth.routes'),
  },
  {
    path: '',
    loadChildren: () => import('./landing/landing.routes'),
  },
  {
    path: '**',
    redirectTo: '',
  },
];
