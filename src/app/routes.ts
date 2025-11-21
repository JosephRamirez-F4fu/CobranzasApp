import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadChildren: () =>
      import('./auth/routes').then((m) => m.authRoutes),
  },
  {
    path: 'admin',
    loadChildren: () =>
      import('./admin/routes').then((m) => m.adminRoutes),
  },
  {
    path: 'gestor',
    loadChildren: () =>
      import('./gestor/routes').then((m) => m.gestorRoutes),
  },
  {
    path: '**',
    redirectTo: '',
  },
];
